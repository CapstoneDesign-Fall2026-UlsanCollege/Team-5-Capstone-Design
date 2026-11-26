/**
 * Local PostgreSQL RLS & Schema Tests for Migrations 014 & 015 using PGlite.
 *
 * SCOPE / HONESTY NOTE:
 *   - Runs against real PostgreSQL/WASM (PGlite) locally with stubbed auth.uid() & roles.
 *   - Passing proves SQL constraints, triggers, cascade deletes, subject ownership validation,
 *     and RLS policy logic locally; live Supabase Cloud apply requires separate project deployment.
 *
 * Run: node --test tests/db/time-schedule.db.test.js
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
const rollback = (name) => readFileSync(resolve(here, '../../supabase/rollbacks', name), 'utf8');

let db;
let subjectEnrolledA;
let subjectOtherB;

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

const rows = async (sql, params = []) => (await db.query(sql, params)).rows;

before(async () => {
  db = new PGlite();
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
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated;
  `);

  for (const m of [
    '001_profiles.sql',
    '002_subjects.sql',
    '003_tasks.sql',
    '004_quiz_questions.sql',
    '005_quiz_attempts.sql',
    '006_rls_policies.sql',
    '014_task_description.sql',
    '015_time_schedules.sql',
  ]) {
    await db.exec(migration(m));
  }

  // Verify idempotency by running 014 & 015 a second time
  await db.exec(migration('014_task_description.sql'));
  await db.exec(migration('015_time_schedules.sql'));

  const existingSubjects = await rows(`SELECT id FROM public.subjects ORDER BY name LIMIT 2`);
  subjectEnrolledA = existingSubjects[0].id;
  subjectOtherB = existingSubjects[1].id;
});

test('014: Optional task description persists, enforces 1000-char limit, clears to NULL, and isolates students', async () => {
  const alice = await newStudent();
  const bob = await newStudent();

  const legacyTask = await asUser(alice, () =>
    rows(
      `INSERT INTO public.tasks (student_id, subject_id, title, deadline)
       VALUES ($1, $2, 'Legacy No-Desc Task', '2026-11-30T23:59:00Z')
       RETURNING id, description`,
      [alice, subjectEnrolledA],
    ),
  );
  assert.equal(legacyTask[0].description, null);

  const multilineNotes = '- Read Chapter 4\n- Complete questions 1-10\n- Prepare topology diagrams';
  const descTask = await asUser(alice, () =>
    rows(
      `INSERT INTO public.tasks (student_id, subject_id, title, description, deadline)
       VALUES ($1, $2, 'Chapter 4 Assignment', $3, '2026-11-30T23:59:00Z')
       RETURNING id, description`,
      [alice, subjectEnrolledA, multilineNotes],
    ),
  );
  assert.equal(descTask[0].description, multilineNotes);

  // Max 1000 chars allowed; 1001 rejected
  const maxDesc = 'x'.repeat(1000);
  await asUser(alice, () =>
    db.query(`UPDATE public.tasks SET description = $1 WHERE id = $2`, [maxDesc, descTask[0].id]),
  );

  await assert.rejects(
    asUser(alice, () =>
      db.query(`UPDATE public.tasks SET description = $1 WHERE id = $2`, ['x'.repeat(1001), descTask[0].id]),
    ),
    /tasks_description_length_check/i,
  );

  // Clear back to NULL
  const cleared = await asUser(alice, () =>
    rows(`UPDATE public.tasks SET description = NULL WHERE id = $1 RETURNING description`, [descTask[0].id]),
  );
  assert.equal(cleared[0].description, null);

  // Cross-student isolation: Bob sees zero of Alice's tasks or descriptions
  const bobSeen = await asUser(bob, () => rows(`SELECT id, description FROM public.tasks`));
  assert.equal(bobSeen.length, 0);

  const bobUpdate = await asUser(bob, () =>
    rows(`UPDATE public.tasks SET description = 'Hacked' WHERE id = $1 RETURNING id`, [descTask[0].id]),
  );
  assert.equal(bobUpdate.length, 0);
});

test('015: Schedule CRUD, subject ownership validation, time constraints, and exception lifecycle', async () => {
  const alice = await newStudent();
  const bob = await newStudent();

  // Enroll Alice in subjectEnrolledA only; Bob in subjectOtherB only
  await asUser(alice, () =>
    db.query(`INSERT INTO public.student_subjects (student_id, subject_id) VALUES ($1, $2)`, [alice, subjectEnrolledA]),
  );
  await asUser(bob, () =>
    db.query(`INSERT INTO public.student_subjects (student_id, subject_id) VALUES ($1, $2)`, [bob, subjectOtherB]),
  );

  // Reject unowned subject_id for Alice
  await assert.rejects(
    asUser(alice, () =>
      db.query(
        `INSERT INTO public.study_schedules
           (student_id, subject_id, title, activity_type, schedule_date, start_time, end_time, start_at, end_at)
         VALUES ($1, $2, 'Unowned Subject Attempt', 'revision', '2026-11-27', '19:00', '20:30',
                 '2026-11-27T10:00:00Z', '2026-11-27T11:30:00Z')`,
        [alice, subjectOtherB],
      ),
    ),
    /row-level security/i,
  );

  // Reject end_time <= start_time
  await assert.rejects(
    asUser(alice, () =>
      db.query(
        `INSERT INTO public.study_schedules
           (student_id, subject_id, title, activity_type, schedule_date, start_time, end_time, start_at, end_at)
         VALUES ($1, NULL, 'Invalid Time Order', 'break', '2026-11-27', '19:00', '18:00',
                 '2026-11-27T10:00:00Z', '2026-11-27T09:00:00Z')`,
        [alice],
      ),
    ),
    /study_schedules_time_order_check/i,
  );

  // Reject weekdays without repeat_days
  await assert.rejects(
    asUser(alice, () =>
      db.query(
        `INSERT INTO public.study_schedules
           (student_id, title, activity_type, schedule_date, start_time, end_time, start_at, end_at, repeat_rule, repeat_days)
         VALUES ($1, 'Missing Weekdays', 'study_session', '2026-11-27', '19:00', '20:30',
                 '2026-11-27T10:00:00Z', '2026-11-27T11:30:00Z', 'weekdays', '{}')`,
        [alice],
      ),
    ),
    /study_schedules_weekdays_rule_check/i,
  );

  // Valid schedule with owned subject_id & weekly repeat
  const inserted = await asUser(alice, () =>
    rows(
      `INSERT INTO public.study_schedules
         (student_id, subject_id, title, activity_type, description, schedule_date, start_time, end_time,
          start_at, end_at, timezone, repeat_rule, repeat_until)
       VALUES ($1, $2, 'Computer Networks Revision', 'revision', 'Review OSI & TCP/IP',
               '2026-11-27', '19:00', '20:30', '2026-11-27T10:00:00Z', '2026-11-27T11:30:00Z',
               'Asia/Seoul', 'weekly', '2026-12-25')
       RETURNING id, completed, repeat_rule`,
      [alice, subjectEnrolledA],
    ),
  );
  const scheduleId = inserted[0].id;
  assert.equal(inserted[0].completed, false);
  assert.equal(inserted[0].repeat_rule, 'weekly');

  // If Alice later deselects Computer Networks, historical schedule persists and can still be updated for completion
  await asUser(alice, () =>
    db.query(`DELETE FROM public.student_subjects WHERE student_id = $1 AND subject_id = $2`, [alice, subjectEnrolledA]),
  );
  const stillHere = await asUser(alice, () =>
    rows(`UPDATE public.study_schedules SET completed = true WHERE id = $1 RETURNING completed, subject_id`, [scheduleId]),
  );
  assert.equal(stillHere[0].completed, true);
  assert.equal(stillHere[0].subject_id, subjectEnrolledA);

  // Alice still cannot reassign a schedule to an unowned subject
  await assert.rejects(
    asUser(alice, () =>
      db.query(`UPDATE public.study_schedules SET subject_id = $1 WHERE id = $2`, [subjectOtherB, scheduleId]),
    ),
    /row-level security/i,
  );

  // RLS isolation: Bob cannot see Alice's schedules or attach exceptions to Alice's schedule_id
  const bobRows = await asUser(bob, () => rows(`SELECT id FROM public.study_schedules`));
  assert.equal(bobRows.length, 0);

  await assert.rejects(
    asUser(bob, () =>
      db.query(
        `INSERT INTO public.study_schedule_exceptions (schedule_id, student_id, occurrence_date, status)
         VALUES ($1, $2, '2026-12-04', 'cancelled')`,
        [scheduleId, bob],
      ),
    ),
    /row-level security/i,
  );

  // Anon role cannot query study_schedules
  await assert.rejects(
    asAnon(() => db.query(`SELECT id FROM public.study_schedules`)),
    /permission denied/i,
  );

  // Alice cancels a single occurrence on Dec 4 and completes Dec 11
  await asUser(alice, () =>
    db.query(
      `INSERT INTO public.study_schedule_exceptions (schedule_id, student_id, occurrence_date, status)
       VALUES ($1, $2, '2026-12-04', 'cancelled')`,
      [scheduleId, alice],
    ),
  );
  await asUser(alice, () =>
    db.query(
      `INSERT INTO public.study_schedule_exceptions (schedule_id, student_id, occurrence_date, status, completed)
       VALUES ($1, $2, '2026-12-11', 'completed', true)`,
      [scheduleId, alice],
    ),
  );
  const excRows = await asUser(alice, () =>
    rows(`SELECT occurrence_date::text AS occ, status, completed FROM public.study_schedule_exceptions ORDER BY occurrence_date`),
  );
  assert.equal(excRows.length, 2);

  // Cascade delete when parent schedule is removed
  await asUser(alice, () => db.query(`DELETE FROM public.study_schedules WHERE id = $1`, [scheduleId]));
  const remainingExc = await asUser(alice, () => rows(`SELECT id FROM public.study_schedule_exceptions`));
  assert.equal(remainingExc.length, 0);
});

test('014 & 015 rollback scripts cleanly revert schema changes', async () => {
  await db.exec(rollback('015_time_schedules_down.sql'));
  await db.exec(rollback('014_task_description_down.sql'));

  const tablesLeft = await rows(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('study_schedules', 'study_schedule_exceptions')`,
  );
  assert.equal(tablesLeft.length, 0);

  const colsLeft = await rows(
    `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tasks' AND column_name = 'description'`,
  );
  assert.equal(colsLeft.length, 0);

  // Re-apply cleanly so final state mirrors HEAD migrations
  await db.exec(migration('014_task_description.sql'));
  await db.exec(migration('015_time_schedules.sql'));
});
