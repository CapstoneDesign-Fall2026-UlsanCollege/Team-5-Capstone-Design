# Database and RLS Verification — Week 11 MVP Assessment

**Project:** Smart Study Companion  
**Database owner (documented):** Sumit Adhikari (`adronnie`)  
**Integration support (documented):** Nabin Khadka (`liftupkhadka555-spec`)  
**Target database:** `https://bcwwnjtmrcxggbaallon.supabase.co`  
**Report date:** 2026-11-15  
**Status:** Partial. Repository migrations and policies are present. Previously recorded anonymous REST probes returned catalog data and zero rows from private tables. Migrations 009 and 010, live AI-table visibility, and authenticated two-account isolation still require verification. This report does not claim full database/RLS verification.

---

## 1. Repository migration inventory and ownership

The repository contains migrations `001`–`011`. The Week 11 database checks relevant to this report are:

| Migration | Repository purpose | Live status based on available evidence |
|---|---|---|
| [`006_rls_policies.sql`](../../supabase/migrations/006_rls_policies.sql) | RLS policies for profiles, tasks, enrollments, and quiz attempts/responses | Anonymous zero-row results were previously recorded for private tables. Authenticated cross-account isolation is not yet demonstrated. |
| [`009_ai_quiz_tables.sql`](../../supabase/migrations/009_ai_quiz_tables.sql) | Creates `ai_quizzes`, `ai_quiz_questions`, and `ai_quiz_attempts`, enables RLS, and defines policies | **Needs live verification.** The recorded request to `ai_quizzes` returned `404 PGRST205`; this shows PostgREST could not find `public.ai_quizzes` in its schema cache at probe time. It does not alone establish whether the migration was never applied, the table is in another schema, or the API cache is stale. |
| [`010_complete_universities.sql`](../../supabase/migrations/010_complete_universities.sql) | Adds university catalog entries including Bhutan, Maldives, and Other / International | **Needs live verification.** The recorded live catalog lacked these entries; this is consistent with migration 010 not being applied, but confirm via migration history and table contents. |

Migration 009 is part of the AI Quiz Generator implementation introduced in commit [`800199f`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/800199f2886fccd6dfa47492d2b744d3136430a3), authored by Khadka Nabin. The report names Sumit Adhikari as database owner; the repository alone does not establish who executed either migration in the live project. Confirm the execution owner from Supabase migration history or the project team.

---

## 2. Previously recorded live probes

The following results were recorded for probes made on **2026-11-15** using the project's public anon key. They are historical evidence in this report, not probes re-run during the current documentation update.

| Probe | Previously recorded result |
|---|---|
| `GET /rest/v1/universities?select=count` | HTTP 200; 46 rows across 7 countries. |
| `GET /rest/v1/subjects?select=count` | HTTP 200; 32 rows. |
| `GET /rest/v1/major_subjects?select=count` | HTTP 200; 128 rows. |
| `GET /rest/v1/quiz_questions?select=count` | HTTP 200; 345 rows. |
| `GET /rest/v1/ai_quizzes?select=count` | HTTP 404, code `PGRST205`; message: `Could not find the table 'public.ai_quizzes' in the schema cache`. |
| Anonymous reads of `tasks`, `profiles`, `student_subjects`, `quiz_attempts`, and `quiz_responses` | HTTP 200 with `[]` recorded for each. This is evidence of zero rows returned to those anonymous requests; it is not a two-account authenticated isolation test. |

The absence of Bhutan, Maldives, and Other / International entries from the recorded university response is evidence those expected entries were not visible in that probe. Check the live migration history and catalog before concluding why they were absent.

---

## 3. Required live checks and how to verify them

### Migration application and AI quiz table visibility

In the Supabase SQL Editor for the target project, first inspect the migration history (if the project uses the standard Supabase migration history table):

```sql
SELECT version, name
FROM supabase_migrations.schema_migrations
WHERE version IN ('009', '010')
ORDER BY version;
```

If the history table is unavailable or the project was migrated manually, check the project’s deployment records and verify the actual schema directly:

```sql
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_name IN ('ai_quizzes', 'ai_quiz_questions', 'ai_quiz_attempts')
ORDER BY table_schema, table_name;
```

Then:

1. Confirm all three tables exist in `public` and have the expected names.
2. If any table is absent, apply [`009_ai_quiz_tables.sql`](../../supabase/migrations/009_ai_quiz_tables.sql) to the target project; do not claim AI quiz persistence works before this and the API check pass.
3. Confirm RLS is enabled and inspect the policies for all three AI quiz tables.
4. If the `public` table exists but PostgREST still returns `PGRST205`, reload the API schema cache in the SQL Editor and retry:
   ```sql
   NOTIFY pgrst, 'reload schema';
   ```
5. Retry an authenticated request to the exact table name and record the HTTP status, response, and timestamp. Confirm inserts/reads obey RLS. A successful SQL query or cache reload alone does not prove authenticated API access.

### Migration 010

Check for the expected entries in `public.universities` and the migration history. If migration 010 is absent from the live database, apply [`010_complete_universities.sql`](../../supabase/migrations/010_complete_universities.sql), then repeat and save the catalog query results.

### Two-account authenticated task isolation

Migration 006 contains task policies scoped with `auth.uid() = student_id`. This is the intended policy, not proof by itself that live isolation works. The repository has [`tests/e2e/rls-isolation.spec.js`](../../tests/e2e/rls-isolation.spec.js), but its presence is not evidence that the test passed; the spec must be run with two distinct, authenticated test accounts against the approved target.

Record results for:

1. Student A creates a task; verify it is stored with A’s user ID.
2. Student B cannot read or update A’s task.
3. Student B can create and read their own task.
4. Student A still sees their own task.

Use a disposable/test project and test accounts, and retain the test output. **Current status: not tested / no authenticated two-account evidence recorded.**

---

## 4. Anonymous RLS evidence and limits

Previously recorded anonymous requests returned HTTP 200 with zero rows for these private tables:

| Table | Recorded anonymous response | What this supports |
|---|---|---|
| `public.tasks` | `[]` | No rows were returned to the anonymous request. |
| `public.profiles` | `[]` | No rows were returned to the anonymous request. |
| `public.student_subjects` | `[]` | No rows were returned to the anonymous request. |
| `public.quiz_attempts` | `[]` | No rows were returned to the anonymous request. |
| `public.quiz_responses` | `[]` | No rows were returned to the anonymous request. |

These observations are consistent with anonymous access being restricted, but alone they do not prove the policies were the cause (for example, an empty table also returns no rows). They do not verify authenticated user-to-user isolation. Keep these checks labeled as anonymous probes, not full RLS verification.

---

## 5. Next actions and evidence register

1. Verify and record live application status for migrations 009 and 010; identify who applied them from migration/deployment history.
2. Investigate `PGRST205` by checking table existence, exact name, `public` schema, migration status, API exposure, and schema-cache visibility. Apply migration 009 if missing; reload the cache only if the table exists but is not recognized.
3. Run and record the authenticated two-account task isolation test. The existing E2E spec is a starting point, not a completed result.
4. Ask a teammate to independently reproduce at least one database/API check and record their name, date, and output.
5. Add evidence links or saved, redacted output for each live check. Do not include API keys, access tokens, or other credentials.

| Check | Current result | Evidence to attach |
|---|---|---|
| Live catalog responses | Previously recorded: HTTP 200 counts above | Timestamped response/log or dashboard query result |
| Anonymous private-table reads | Previously recorded: HTTP 200 `[]` | Timestamped requests/responses; do not describe as authenticated isolation |
| Migration 009 / AI tables | Pending verification; `PGRST205` was observed | Migration-history result, schema query, RLS policy check, authenticated API request |
| Migration 010 / university additions | Pending verification; expected entries absent in previous probe | Migration-history result and post-migration catalog query |
| Authenticated two-account isolation | Not tested | E2E output and test-account procedure/results |
| Independent reproduction | Pending | Teammate, date, check performed, and output/link |

**Overall status: Partially verified. Full database and authenticated RLS verification is not complete.**
