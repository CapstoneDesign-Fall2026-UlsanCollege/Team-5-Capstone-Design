/**
 * Local SQL tests for Migration 011 (Study Analytics 2.0) using PGlite (in-memory Postgres/WASM).
 *
 * SCOPE / HONESTY NOTE
 *  - This is a LOCAL emulation: a real Postgres engine, but NOT the live Supabase project.
 *    auth.uid(), the `anon`/`authenticated` roles and Supabase default privileges are stubbed below.
 *  - It executes the real migrations 001-006 plus the proposed 011 against a throwaway database.
 *  - Passing here is NOT "live Supabase verification". See docs/week_11/STUDY_ANALYTICS_2_PROPOSAL.md.
 *  - True multi-connection concurrency and multi-device behaviour are NOT exercised (single connection).
 *
 * Run:  cd tests/db && npm install && npm test
 */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';

const here = dirname(fileURLToPath(import.meta.url));
const migration = (name) => readFileSync(resolve(here, '../../supabase/migrations', name), 'utf8');

let db;
let subjectId;

async function asUser(uid, fn) {
  await db.exec('RESET ROLE');
  await db.query(`SELECT set_config('request.jwt.claim.sub', $1, false)`, [uid ?? '']);
  await db.exec('SET ROLE authenticated');
  try {
    return await fn();
  } finally {
    await db.exec('RESET ROLE');
    await db.query(`SELECT set_config('request.jwt.claim.sub', '', false)`);
  }
}

async function asAnon(fn) {
  await db.exec('RESET ROLE');
  await db.exec('SET ROLE anon');
  try {
    return await fn();
  } finally {
    await db.exec('RESET ROLE');
  }
}

async function newStudent() {
  const id = randomUUID();
  await db.query(`INSERT INTO auth.users (id, raw_user_meta_data) VALUES ($1, '{}'::jsonb)`, [id]);
  return id;
}

async function newTask(studentId, completed = false) {
  const id = randomUUID();
  await db.query(
    `INSERT INTO public.tasks (id, student_id, subject_id, title, deadline, completed)
     VALUES ($1, $2, $3, 'Test task', now() + interval '1 day', $4)`,
    [id, studentId, subjectId, completed],
  );
  return id;
}

async function setCompleted(taskId, completed, uid) {
  return asUser(uid, () =>
    db.query(`UPDATE public.tasks SET completed = $1 WHERE id = $2`, [completed, taskId]),
  );
}

const rows = async (sql, params) => (await db.query(sql, params)).rows;
const one = async (sql, params) => (await rows(sql, params))[0];

/** Insert an event with an explicit (controlled) date, as the superuser/owner. */
async function seedEvents(studentId, dates, perDay = 1) {
  for (const d of dates) {
    for (let i = 0; i < perDay; i += 1) {
      await db.query(
        `INSERT INTO public.study_activity_events (student_id, task_id, activity_date, timezone)
         VALUES ($1, $2, $3::date, 'UTC')`,
        [studentId, randomUUID(), d],
      );
    }
  }
}

const day = (base, offset) => {
  const d = new Date(`${base}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
};
const range = (base, from, to) => Array.from({ length: to - from + 1 }, (_, i) => day(base, from + i));

const compute = async (studentId, today) =>
  (await one(`SELECT public.study_streak_compute($1, $2::date) AS s`, [studentId, today])).s;

before(async () => {
  db = new PGlite();

  // ---- Supabase emulation (stubs) ----
  await db.exec(`
    CREATE ROLE anon NOLOGIN;
    CREATE ROLE authenticated NOLOGIN;
    CREATE SCHEMA auth;
    CREATE TABLE auth.users (id uuid PRIMARY KEY, raw_user_meta_data jsonb);
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
      SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    GRANT USAGE ON SCHEMA public, auth TO anon, authenticated;
    GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
    -- Supabase grants new public objects to anon/authenticated by default; mirror that.
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated;
  `);

  // ---- Real existing migrations (core schema + RLS) ----
  for (const m of [
    '001_profiles.sql',
    '002_subjects.sql',
    '003_tasks.sql',
    '004_quiz_questions.sql',
    '005_quiz_attempts.sql',
    '006_rls_policies.sql',
  ]) {
    await db.exec(migration(m));
  }

  // ---- Proposed migration under test ----
  await db.exec(migration('011_study_streak_analytics.sql'));

  subjectId = (await one(`SELECT id FROM public.subjects LIMIT 1`)).id;
});

// ---------------------------------------------------------------------------
// Migration hygiene
// ---------------------------------------------------------------------------
test('011 is re-runnable (idempotent) without error', async () => {
  await db.exec(migration('011_study_streak_analytics.sql'));
});

test('011 does not change the existing tasks columns or tasks RLS policies', async () => {
  const cols = (await rows(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'tasks' ORDER BY ordinal_position`,
  )).map((r) => r.column_name);
  assert.deepEqual(cols, ['id', 'student_id', 'subject_id', 'title', 'deadline', 'completed', 'created_at', 'updated_at']);
  const pols = (await rows(`SELECT policyname FROM pg_policies WHERE tablename = 'tasks' ORDER BY policyname`)).map((r) => r.policyname);
  assert.deepEqual(pols, ['tasks_delete_own', 'tasks_insert_own', 'tasks_select_own', 'tasks_update_own']);
});

// ---------------------------------------------------------------------------
// Event log policy (trigger)
// ---------------------------------------------------------------------------
test('completing a task creates exactly one event; repeated "true" updates create none', async () => {
  const s = await newStudent();
  const t = await newTask(s);
  await setCompleted(t, true, s);
  await setCompleted(t, true, s); // network retry
  await setCompleted(t, true, s);
  const ev = await rows(`SELECT * FROM public.study_activity_events WHERE task_id = $1`, [t]);
  assert.equal(ev.length, 1);
  assert.equal(ev[0].student_id, s);
  assert.equal(ev[0].voided_at, null);
});

test('undo voids the event; completing again creates a new active event (history kept)', async () => {
  const s = await newStudent();
  const t = await newTask(s);
  await setCompleted(t, true, s);
  await setCompleted(t, false, s);
  let ev = await rows(`SELECT voided_at, void_reason FROM public.study_activity_events WHERE task_id = $1`, [t]);
  assert.equal(ev.length, 1);
  assert.notEqual(ev[0].voided_at, null);
  assert.equal(ev[0].void_reason, 'undo');
  assert.equal((await compute(s, day('2026-01-01', 0))).total_completed_tasks, 0);

  await setCompleted(t, true, s);
  ev = await rows(`SELECT voided_at FROM public.study_activity_events WHERE task_id = $1`, [t]);
  assert.equal(ev.length, 2);
  assert.equal(ev.filter((e) => e.voided_at === null).length, 1);
});

test('a task inserted as already-completed records one event', async () => {
  const s = await newStudent();
  const t = await newTask(s, true);
  const ev = await rows(`SELECT 1 FROM public.study_activity_events WHERE task_id = $1`, [t]);
  assert.equal(ev.length, 1);
});

test('deleting a completed task preserves the study history', async () => {
  const s = await newStudent();
  const t = await newTask(s);
  await setCompleted(t, true, s);
  await asUser(s, () => db.query(`DELETE FROM public.tasks WHERE id = $1`, [t]));
  const ev = await rows(`SELECT voided_at FROM public.study_activity_events WHERE task_id = $1`, [t]);
  assert.equal(ev.length, 1);
  assert.equal(ev[0].voided_at, null);
});

test('editing a completed task (title/deadline) does not create or void events', async () => {
  const s = await newStudent();
  const t = await newTask(s);
  await setCompleted(t, true, s);
  await asUser(s, () => db.query(`UPDATE public.tasks SET title = 'Edited', deadline = now() + interval '3 day' WHERE id = $1`, [t]));
  const ev = await rows(`SELECT voided_at FROM public.study_activity_events WHERE task_id = $1`, [t]);
  assert.equal(ev.length, 1);
  assert.equal(ev[0].voided_at, null);
});

test('legacy completed tasks (completed before the feature) produce no events / no fake streak', async () => {
  const s = await newStudent();
  // Simulate legacy data: disable the trigger, insert completed tasks, re-enable.
  await db.exec(`ALTER TABLE public.tasks DISABLE TRIGGER tasks_log_completion`);
  await newTask(s, true);
  await newTask(s, true);
  await db.exec(`ALTER TABLE public.tasks ENABLE TRIGGER tasks_log_completion`);
  const state = await compute(s, day('2026-01-01', 0));
  assert.equal(state.current_streak, 0);
  assert.equal(state.total_completed_tasks, 0);
  assert.equal(state.tracking_started, null);
});

test('event day uses the student timezone at completion time; later timezone changes do not rewrite history', async () => {
  const s = await newStudent();
  await asUser(s, () => db.query(`SELECT public.sync_study_timezone('Asia/Seoul')`));
  const t = await newTask(s);
  await setCompleted(t, true, s);
  const ev = await one(
    `SELECT activity_date::text AS d, timezone, (completed_at AT TIME ZONE 'Asia/Seoul')::date::text AS expected FROM public.study_activity_events WHERE task_id = $1`,
    [t],
  );
  assert.equal(ev.timezone, 'Asia/Seoul');
  assert.equal(ev.d, ev.expected);

  await asUser(s, () => db.query(`SELECT public.sync_study_timezone('America/Los_Angeles')`));
  const after = await one(`SELECT activity_date::text AS d, timezone FROM public.study_activity_events WHERE task_id = $1`, [t]);
  assert.equal(after.d, ev.d);
  assert.equal(after.timezone, 'Asia/Seoul');
});

test('invalid timezones are rejected', async () => {
  const s = await newStudent();
  await assert.rejects(() => asUser(s, () => db.query(`SELECT public.sync_study_timezone('Mars/Olympus')`)), /Unknown timezone/);
});

// ---------------------------------------------------------------------------
// Streak engine (controlled dates, p_today fixed)
// ---------------------------------------------------------------------------
const BASE = '2026-03-01';

test('no events: zeros and no tracking start', async () => {
  const s = await newStudent();
  const st = await compute(s, BASE);
  assert.equal(st.current_streak, 0);
  assert.equal(st.longest_streak, 0);
  assert.equal(st.total_active_days, 0);
  assert.equal(st.streak_status, 'none');
});

test('multiple tasks on the same day count as ONE active day', async () => {
  const s = await newStudent();
  await seedEvents(s, [BASE], 4);
  const st = await compute(s, BASE);
  assert.equal(st.total_active_days, 1);
  assert.equal(st.current_streak, 1);
  assert.equal(st.completed_today, 4);
  assert.equal(st.total_completed_tasks, 4);
  assert.equal(st.studied_today, true);
});

test('consecutive days extend the streak', async () => {
  const s = await newStudent();
  await seedEvents(s, range(BASE, -4, 0));
  const st = await compute(s, BASE);
  assert.equal(st.current_streak, 5);
  assert.equal(st.longest_streak, 5);
  assert.equal(st.streak_status, 'active_today');
});

test('studied yesterday but not yet today: streak stays visible as at_risk', async () => {
  const s = await newStudent();
  await seedEvents(s, range(BASE, -3, -1));
  const st = await compute(s, BASE);
  assert.equal(st.current_streak, 3);
  assert.equal(st.studied_today, false);
  assert.equal(st.streak_status, 'at_risk');
});

test('an unprotected missed day resets the streak; longest is preserved; new activity starts a new streak', async () => {
  const s = await newStudent();
  await seedEvents(s, [...range(BASE, -6, -4)]); // 3-day streak, then miss -3,-2,-1
  let st = await compute(s, BASE);
  assert.equal(st.current_streak, 0);
  assert.equal(st.longest_streak, 3);
  assert.equal(st.streak_status, 'none');

  await seedEvents(s, [BASE]);
  st = await compute(s, BASE);
  assert.equal(st.current_streak, 1);
  assert.equal(st.longest_streak, 3);
});

test('7 active days earn exactly one protection', async () => {
  const s = await newStudent();
  await seedEvents(s, range(BASE, -6, 0));
  const st = await compute(s, BASE);
  assert.equal(st.current_streak, 7);
  assert.equal(st.protection_balance, 1);
  assert.equal(st.toward_next_protection, 0);
});

test('protection auto-covers ONE missed day without manufacturing an active day', async () => {
  const s = await newStudent();
  // 7 active days (-8..-2), miss -1 (protected), study today
  await seedEvents(s, [...range(BASE, -8, -2), BASE]);
  const st = await compute(s, BASE);
  assert.equal(st.protected_days_used, 1);
  assert.equal(st.protection_balance, 0);
  assert.equal(st.total_active_days, 8, 'protected day is not an active day');
  assert.equal(st.current_streak, 8, 'streak = genuine active days in the unbroken run (protected day only bridges)');
  const protectedDay = st.days.find((d) => d.kind === 'protected');
  assert.equal(protectedDay.date, day(BASE, -1));
  assert.equal(protectedDay.tasks, 0);
  assert.equal(st.days.filter((d) => d.kind === 'active').length, 8);
});

test('protection is applied once per missed date (repeated computes are identical)', async () => {
  const s = await newStudent();
  await seedEvents(s, [...range(BASE, -8, -2), BASE]);
  const a = await compute(s, BASE);
  const b = await compute(s, BASE);
  const c = await compute(s, BASE);
  assert.deepEqual(a, b);
  assert.deepEqual(b, c);
  assert.equal(a.protected_days_used, 1);
});

test('without protection left, a second missed day expires the streak', async () => {
  const s = await newStudent();
  // 7 active (-9..-3) => balance 1; miss -2 (protected, balance 0); miss -1 => reset
  await seedEvents(s, range(BASE, -9, -3));
  const st = await compute(s, BASE);
  assert.equal(st.current_streak, 0);
  assert.equal(st.longest_streak, 7);
  assert.equal(st.protected_days_used, 1);
  assert.equal(st.protection_balance, 0);
});

test('protection balance is capped at two', async () => {
  const s = await newStudent();
  await seedEvents(s, range(BASE, -20, 0)); // 21 active days -> 3 would be earned, cap = 2
  const st = await compute(s, BASE);
  assert.equal(st.current_streak, 21);
  assert.equal(st.protection_balance, 2);
});

test('two protections cover two consecutive missed days, the third miss resets', async () => {
  const s = await newStudent();
  // 14 active (-18..-5) => balance 2; miss -4,-3 (protected x2); miss -2 => reset; miss -1
  await seedEvents(s, range(BASE, -18, -5));
  const st = await compute(s, BASE);
  assert.equal(st.protected_days_used, 2);
  assert.equal(st.current_streak, 0);
  assert.equal(st.longest_streak, 14);
});

test('once a streak has expired, further inactive days are inert (no extra protection use, no negative balance)', async () => {
  const s = await newStudent();
  // 7 active days (-30..-24) => +1 protection; -23 protected; -22 resets; -21..-1 are plain inactive days
  await seedEvents(s, range(BASE, -30, -24));
  const st = await compute(s, BASE);
  assert.equal(st.protected_days_used, 1);
  assert.equal(st.protection_balance, 0);
  assert.equal(st.current_streak, 0);
  assert.equal(st.days.filter((d) => d.kind === 'protected').length, 1);
});

test('undoing the only task of a day removes that active day', async () => {
  const s = await newStudent();
  const t = await newTask(s);
  await setCompleted(t, true, s);
  const todayUtc = (await one(`SELECT (now() AT TIME ZONE 'UTC')::date::text AS d`)).d;
  assert.equal((await compute(s, todayUtc)).total_active_days, 1);
  await setCompleted(t, false, s);
  assert.equal((await compute(s, todayUtc)).total_active_days, 0);
});

// ---------------------------------------------------------------------------
// Summary RPC, daily goal
// ---------------------------------------------------------------------------
test('get_study_summary defaults: goal 3, UTC, empty badges', async () => {
  const s = await newStudent();
  const sum = (await asUser(s, () => one(`SELECT public.get_study_summary() AS s`))).s;
  assert.equal(sum.daily_goal, 3);
  assert.equal(sum.timezone, 'UTC');
  assert.deepEqual(sum.achievements, []);
  assert.equal(sum.current_streak, 0);
});

test('daily goal persists, is validated, and is per-student', async () => {
  const a = await newStudent();
  const b = await newStudent();
  await asUser(a, () => db.query(`SELECT public.set_daily_study_goal(5)`));
  const sa = (await asUser(a, () => one(`SELECT public.get_study_summary() AS s`))).s;
  const sb = (await asUser(b, () => one(`SELECT public.get_study_summary() AS s`))).s;
  assert.equal(sa.daily_goal, 5);
  assert.equal(sb.daily_goal, 3);
  for (const bad of [0, -1, 21, null]) {
    await assert.rejects(() => asUser(a, () => db.query(`SELECT public.set_daily_study_goal($1)`, [bad])), /Daily goal must be between 1 and 20/);
  }
  assert.equal((await asUser(a, () => one(`SELECT public.get_study_summary() AS s`))).s.daily_goal, 5);
});

test('completed_today counts only today, independent of scheduled deadlines', async () => {
  const s = await newStudent();
  // 3 tasks scheduled (deadline) tomorrow, only 2 completed now
  const t1 = await newTask(s);
  const t2 = await newTask(s);
  await newTask(s);
  await setCompleted(t1, true, s);
  await setCompleted(t2, true, s);
  const sum = (await asUser(s, () => one(`SELECT public.get_study_summary() AS s`))).s;
  assert.equal(sum.completed_today, 2);
  assert.equal(sum.total_completed_tasks, 2);
});

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------
const badgeKeys = async (s) =>
  (await rows(`SELECT badge_key FROM public.student_achievements WHERE student_id = $1 ORDER BY badge_key`, [s])).map((r) => r.badge_key);

test('first completion awards First Step once', async () => {
  const s = await newStudent();
  const t1 = await newTask(s);
  await setCompleted(t1, true, s);
  assert.deepEqual(await badgeKeys(s), ['first_step']);
  const t2 = await newTask(s);
  await setCompleted(t2, true, s);
  assert.deepEqual(await badgeKeys(s), ['first_step']);
  const ach = await rows(`SELECT count(*)::int AS n FROM public.student_achievements WHERE student_id = $1 AND badge_key = 'first_step'`, [s]);
  assert.equal(ach[0].n, 1);
});

test('Task Achiever unlocks at 10 completed tasks, not before', async () => {
  const s = await newStudent();
  for (let i = 0; i < 9; i += 1) await setCompleted(await newTask(s), true, s);
  assert.equal((await badgeKeys(s)).includes('task_achiever'), false);
  await setCompleted(await newTask(s), true, s);
  assert.equal((await badgeKeys(s)).includes('task_achiever'), true);
});

test('streak badges unlock at 3 and 7 days; award is idempotent; badges survive undo/reset', async () => {
  const s = await newStudent();
  const todayUtc = (await one(`SELECT (now() AT TIME ZONE 'UTC')::date::text AS d`)).d;
  await seedEvents(s, range(todayUtc, -2, -1)); // 2 prior days
  const t = await newTask(s);
  await setCompleted(t, true, s); // today => 3-day streak
  assert.deepEqual(await badgeKeys(s), ['consistent_learner', 'first_step']);

  for (let i = 0; i < 3; i += 1) await db.query(`SELECT public.award_study_achievements($1)`, [s]);
  assert.equal((await badgeKeys(s)).length, 2, 'repeated awards never duplicate');

  await setCompleted(t, false, s); // undo today
  assert.equal((await badgeKeys(s)).includes('consistent_learner'), true, 'earned badge is preserved after undo');
});

test('Weekly Champion unlocks at a 7-day streak', async () => {
  const s = await newStudent();
  const todayUtc = (await one(`SELECT (now() AT TIME ZONE 'UTC')::date::text AS d`)).d;
  await seedEvents(s, range(todayUtc, -6, -1));
  await setCompleted(await newTask(s), true, s);
  const keys = await badgeKeys(s);
  assert.ok(keys.includes('weekly_champion'));
  assert.ok(keys.includes('consistent_learner'));
  assert.ok(!keys.includes('dedicated_student'));
});

test('DB constraint rejects duplicate or unknown badges', async () => {
  const s = await newStudent();
  await db.query(`INSERT INTO public.student_achievements (student_id, badge_key) VALUES ($1, 'first_step')`, [s]);
  await assert.rejects(() => db.query(`INSERT INTO public.student_achievements (student_id, badge_key) VALUES ($1, 'first_step')`, [s]), /uq_student_achievement|duplicate/);
  await assert.rejects(() => db.query(`INSERT INTO public.student_achievements (student_id, badge_key) VALUES ($1, 'fake_badge')`, [s]), /check/i);
});

// ---------------------------------------------------------------------------
// Security: two-student isolation + no direct writes (LOCAL emulation of RLS)
// ---------------------------------------------------------------------------
test('Student B cannot read Student A events, achievements or preferences', async () => {
  const a = await newStudent();
  const b = await newStudent();
  await asUser(a, () => db.query(`SELECT public.set_daily_study_goal(7)`));
  await setCompleted(await newTask(a), true, a);

  const aRows = await asUser(a, async () => ({
    ev: (await rows(`SELECT * FROM public.study_activity_events`)).length,
    ach: (await rows(`SELECT * FROM public.student_achievements`)).length,
    pref: (await rows(`SELECT * FROM public.study_preferences`)).length,
  }));
  assert.deepEqual(aRows, { ev: 1, ach: 1, pref: 1 });

  const bRows = await asUser(b, async () => ({
    ev: (await rows(`SELECT * FROM public.study_activity_events WHERE student_id = $1`, [a])).length,
    ach: (await rows(`SELECT * FROM public.student_achievements WHERE student_id = $1`, [a])).length,
    pref: (await rows(`SELECT * FROM public.study_preferences WHERE student_id = $1`, [a])).length,
    all: (await rows(`SELECT * FROM public.study_activity_events`)).length,
  }));
  assert.deepEqual(bRows, { ev: 0, ach: 0, pref: 0, all: 0 });

  const sumB = (await asUser(b, () => one(`SELECT public.get_study_summary() AS s`))).s;
  assert.equal(sumB.total_completed_tasks, 0);
  assert.equal(sumB.daily_goal, 3);
  assert.deepEqual(sumB.achievements, []);
});

test('Students cannot write the new tables directly (no forged events, badges or goals)', async () => {
  const a = await newStudent();
  const attempts = [
    `INSERT INTO public.study_activity_events (student_id, task_id, activity_date, timezone) VALUES ('${a}', gen_random_uuid(), now()::date, 'UTC')`,
    `INSERT INTO public.student_achievements (student_id, badge_key) VALUES ('${a}', 'study_master')`,
    `INSERT INTO public.study_preferences (student_id, daily_goal) VALUES ('${a}', 20)`,
  ];
  for (const sql of attempts) {
    await assert.rejects(() => asUser(a, () => db.query(sql)), /permission denied|row-level security/i, sql);
  }
  await setCompleted(await newTask(a), true, a);
  for (const sql of [
    `UPDATE public.study_activity_events SET activity_date = now()::date - 30`,
    `DELETE FROM public.study_activity_events`,
    `DELETE FROM public.student_achievements`,
    `UPDATE public.study_preferences SET daily_goal = 20`,
  ]) {
    await assert.rejects(() => asUser(a, () => db.query(sql)), /permission denied|row-level security/i, sql);
  }
});

test('Students cannot call internal functions directly', async () => {
  const a = await newStudent();
  const b = await newStudent();
  for (const sql of [
    `SELECT public.study_streak_compute('${b}'::uuid, now()::date)`,
    `SELECT public.award_study_achievements('${b}'::uuid)`,
    `SELECT public.record_study_event('${b}'::uuid, gen_random_uuid())`,
  ]) {
    await assert.rejects(() => asUser(a, () => db.query(sql)), /permission denied/i, sql);
  }
});

test('anon cannot call the student RPCs; authenticated without a user id is rejected', async () => {
  for (const sql of [
    `SELECT public.get_study_summary()`,
    `SELECT public.set_daily_study_goal(5)`,
    `SELECT public.sync_study_timezone('UTC')`,
  ]) {
    await assert.rejects(() => asAnon(() => db.query(sql)), /permission denied/i, sql);
  }
  await assert.rejects(() => asUser('', () => db.query(`SELECT public.get_study_summary()`)), /Not authenticated/);
});

test('Student B cannot complete Student A\'s task, so no event is created for A', async () => {
  const a = await newStudent();
  const b = await newStudent();
  const t = await newTask(a);
  const res = await asUser(b, () => db.query(`UPDATE public.tasks SET completed = true WHERE id = $1`, [t]));
  assert.equal(res.affectedRows, 0);
  assert.equal((await rows(`SELECT 1 FROM public.study_activity_events WHERE task_id = $1`, [t])).length, 0);
});
