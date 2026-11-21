/**
 * Local PostgreSQL RLS & Schema Tests for Migration 013 (AI Tutor) using PGlite.
 *
 * SCOPE / HONESTY NOTE:
 *   - Runs against real PostgreSQL/WASM (PGlite) locally with stubbed auth.uid() & roles.
 *   - Passing proves SQL constraints, triggers, cascade deletes, and RLS policy logic locally;
 *     it is NOT live Supabase Cloud verification until 013_ai_tutor.sql is applied in Supabase.
 *
 * Run: node --test tests/db/ai-tutor.db.test.js
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
  ]) {
    await db.exec(migration(m));
  }

  await db.exec(migration('013_ai_tutor.sql'));
  subjectId = (await rows(`SELECT id FROM public.subjects LIMIT 1`))[0].id;
});

test('013_ai_tutor.sql is idempotent on repeated execution', async () => {
  await db.exec(migration('013_ai_tutor.sql'));
});

test('two-student RLS isolation: Student B cannot read, modify, delete, or inject into Student A chats', async () => {
  const studentA = await newStudent();
  const studentB = await newStudent();

  // Student A creates a conversation & sends a student message
  const convA = await asUser(studentA, async () => {
    const res = await db.query(
      `INSERT INTO public.ai_tutor_conversations (student_id, title, subject_id, difficulty, teaching_mode, preferred_language)
       VALUES ($1, 'Binary Trees Help', $2, 'beginner', 'explain', 'en')
       RETURNING id`,
      [studentA, subjectId]
    );
    const cid = res.rows[0].id;
    await db.query(
      `INSERT INTO public.ai_tutor_messages (conversation_id, role, content)
       VALUES ($1, 'student', 'Explain binary search trees')`,
      [cid]
    );
    return cid;
  });

  // Service role (postgres owner) inserts assistant reply
  await db.query(
    `INSERT INTO public.ai_tutor_messages (conversation_id, role, content)
     VALUES ($1, 'assistant', 'A binary search tree stores smaller values left.')`,
    [convA]
  );

  // Student B tries to read Student A's conversations -> 0 rows
  const bReadConvs = await asUser(studentB, () =>
    rows(`SELECT * FROM public.ai_tutor_conversations WHERE id = $1`, [convA])
  );
  assert.equal(bReadConvs.length, 0);

  // Student B tries to read Student A's messages by guessing conversation_id -> 0 rows
  const bReadMsgs = await asUser(studentB, () =>
    rows(`SELECT * FROM public.ai_tutor_messages WHERE conversation_id = $1`, [convA])
  );
  assert.equal(bReadMsgs.length, 0);

  // Student B tries to update or delete Student A's conversation -> 0 rows affected
  const bUpdate = await asUser(studentB, () =>
    db.query(`UPDATE public.ai_tutor_conversations SET title = 'Hacked' WHERE id = $1`, [convA])
  );
  assert.equal(bUpdate.affectedRows, 0);

  const bDelete = await asUser(studentB, () =>
    db.query(`DELETE FROM public.ai_tutor_conversations WHERE id = $1`, [convA])
  );
  assert.equal(bDelete.affectedRows, 0);

  // Student B tries to attach a message into Student A's conversation -> RLS rejects
  await assert.rejects(
    asUser(studentB, () =>
      db.query(
        `INSERT INTO public.ai_tutor_messages (conversation_id, role, content) VALUES ($1, 'student', 'Injected')`,
        [convA]
      )
    ),
    /row-level security/i
  );

  // Anonymous access returns 0 rows
  const anonConvs = await asAnon(() => rows(`SELECT * FROM public.ai_tutor_conversations`));
  const anonMsgs = await asAnon(() => rows(`SELECT * FROM public.ai_tutor_messages`));
  assert.equal(anonConvs.length, 0);
  assert.equal(anonMsgs.length, 0);
});

test('anti-impersonation & tamper protection: students cannot forge assistant messages or reset quotas', async () => {
  const studentA = await newStudent();
  const convId = await asUser(studentA, async () => {
    const res = await db.query(
      `INSERT INTO public.ai_tutor_conversations (student_id, title) VALUES ($1, 'Security Test') RETURNING id`,
      [studentA]
    );
    return res.rows[0].id;
  });

  // Student A tries to forge role='assistant' directly -> RLS rejects!
  await assert.rejects(
    asUser(studentA, () =>
      db.query(
        `INSERT INTO public.ai_tutor_messages (conversation_id, role, content) VALUES ($1, 'assistant', 'Forged answer')`,
        [convId]
      )
    ),
    /row-level security/i
  );

  // Student A cannot insert or mutate ai_tutor_usage_quotas
  await assert.rejects(
    asUser(studentA, () =>
      db.query(
        `INSERT INTO public.ai_tutor_usage_quotas (student_id, request_count) VALUES ($1, 0)`,
        [studentA]
      )
    ),
    /permission denied/i
  );

  // Student A cannot UPDATE existing ai_tutor_messages directly
  await assert.rejects(
    asUser(studentA, () =>
      db.query(`UPDATE public.ai_tutor_messages SET content = 'Tampered' WHERE conversation_id = $1`, [convId])
    ),
    /permission denied/i
  );
});

test('cascade delete removes messages cleanly and rollback script restores clean schema', async () => {
  const studentA = await newStudent();
  const convId = await asUser(studentA, async () => {
    const r = await db.query(
      `INSERT INTO public.ai_tutor_conversations (student_id, title) VALUES ($1, 'Cascade Chat') RETURNING id`,
      [studentA]
    );
    const id = r.rows[0].id;
    await db.query(
      `INSERT INTO public.ai_tutor_messages (conversation_id, role, content) VALUES ($1, 'student', 'Hi')`,
      [id]
    );
    return id;
  });

  await asUser(studentA, () =>
    db.query(`DELETE FROM public.ai_tutor_conversations WHERE id = $1`, [convId])
  );
  const leftoverMsgs = await rows(`SELECT * FROM public.ai_tutor_messages WHERE conversation_id = $1`, [convId]);
  assert.equal(leftoverMsgs.length, 0);

  // Verify rollback runs cleanly and re-applying migration works
  await db.exec(rollback('013_ai_tutor_down.sql'));
  await db.exec(migration('013_ai_tutor.sql'));
});
