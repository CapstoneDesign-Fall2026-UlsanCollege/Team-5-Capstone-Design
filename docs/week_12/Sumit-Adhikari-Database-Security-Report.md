# Week 12 — Database Security, Migrations & DATA-01 Verification Report

**1. Student & GitHub Username:** Sumit Adhikari (`adronnie`)  
**2. Assigned Responsibility:** Database, Supabase Migrations, Row Level Security (RLS), and Data Isolation (`DATA-01`)  
**3. Review / Execution Attribution:** Repository SQL inspection, live anonymous REST probing, and `tests/e2e/rls-isolation.spec.js` test-harness enhancements completed **agent-assisted** on branch `week12/final-qa-reconciliation` (`bb7c974`), pending personal SQL Dashboard execution, live `DATA-01` execution, and sign-off by Sumit Adhikari (`adronnie`).

---

## 4. Professor's Feedback Addressed

1. Pending migrations `009`, `010`, and `012` must be audited individually for exact filenames, SQL validity, dependencies, RLS policies, and live cloud application evidence—never assuming that a local `.sql` file is applied live.
2. Deferred migration `013` (`AI Tutor`) must be inspected separately and kept outside frozen-core release gates.
3. Live two-account RLS verification (`DATA-01`) must test UI and backend API access denial (read, update, delete across tasks, quiz attempts, study streaks, and profile) using ordinary authenticated student sessions—never the `service_role` key—and remain marked **NOT RUN** unless executed live.
4. Dark-mode subject dropdown defect (`Issue #84`): clearly distinguish **Reporter (`adronnie`)** from **Fix Owner (`jn-oli`)** and **Independent QA Tester**.

---

## 5. Objective

Audit all pending and deferred Supabase migrations, provide safe non-destructive verification and execution procedures for authorized Supabase administration, prepare comprehensive live `DATA-01` verification coverage, and accurately document database/security ownership.

---

## 6. Work Performed (Agent-Assisted Reconciliation)

1. Audited [`supabase/migrations/`](../../supabase/migrations/) and [`supabase/rollbacks/`](../../supabase/rollbacks/) for migrations `009`, `010`, `011`, `012`, and `013`.
2. Probed live Supabase PostgREST endpoints (`https://bcwwnjtmrcxggbaallon.supabase.co`) using the public publishable key to confirm schema visibility without executing unauthorized DDL or mutations.
3. Enhanced [`tests/e2e/rls-isolation.spec.js`](../../tests/e2e/rls-isolation.spec.js) (`E2E-RLS-01`) to test full ordinary-JWT `GET`, `PATCH`, and `DELETE` denial across `tasks`, `quiz_attempts`, `study_activity_events`, and `profiles` for Student A versus Student B. The test is cleanly skipped as **NOT RUN** when live disposable credentials are absent.
4. Clarified ownership in Week 12 reports so Sumit Adhikari (`adronnie`) is credited as **Database Security Owner** and **Reporter of Issue #84** (dark-mode subject dropdown), while J.N. Taj Oli (`jn-oli`) owns the CSS dropdown fix.

---

## 7. Files Modified / Created

- Created [`docs/week_12/Sumit-Adhikari-Database-Security-Report.md`](Sumit-Adhikari-Database-Security-Report.md) — this individual responsibility report.
- Updated [`tests/e2e/rls-isolation.spec.js`](../../tests/e2e/rls-isolation.spec.js):
  - `E2E-RLS-01` expanded to cover read, modify, and delete API checks with Student A/B JWTs.
  - `E2E-RLS-02` checks eight private tables anonymously.

---

## 8. Migration Audit & Live Verification Status

> **Safety Rule:** No production SQL was executed and no destructive DDL or `service_role` bypass was run.

| Migration File | Exact Purpose & Dependencies | SQL & RLS Review | Live Cloud Probe (Nov 25, 2026) | Status | Admin Action Required |
|---|---|---|---|---|---|
| [`009_ai_quiz_tables.sql`](../../supabase/migrations/009_ai_quiz_tables.sql) | Creates `ai_quizzes`, `ai_quiz_questions`, and `ai_quiz_attempts` (`FK -> subjects(id), profiles(id)`). Supports AI Quiz storage. | Valid PostgreSQL DDL. RLS is enabled on all three tables with `auth.uid()` owner policies: select/insert/update/delete on `ai_quizzes`, nested ownership on `ai_quiz_questions`, and `user_id` ownership on `ai_quiz_attempts`. Reversible via `DROP TABLE IF EXISTS`. | `GET /rest/v1/ai_quizzes?select=id&limit=1` → HTTP `404` (`PGRST205`) | **UNVERIFIED — Not Applied Live** | Authorized Supabase admin runs `009_ai_quiz_tables.sql` in the SQL Editor, reloads the schema with `NOTIFY pgrst, 'reload schema';`, and verifies the tables. |
| [`010_complete_universities.sql`](../../supabase/migrations/010_complete_universities.sql) | Inserts an expanded international university catalog. Depends on the `universities` table created by `007_universities.sql`. | Valid idempotent SQL using `ON CONFLICT DO NOTHING` and catalog inserts. The catalog remains public/read-only under the existing `007` select policy. | `GET /rest/v1/universities?select=country,name&name=ilike.*Kelaniya*` → `[]`, HTTP `200`; count remains `46` from `007`. | **UNVERIFIED — Not Applied Live** | Authorized Supabase admin runs `010_complete_universities.sql` and verifies that the university row count is greater than `46`. |
| [`011_study_streak_analytics.sql`](../../supabase/migrations/011_study_streak_analytics.sql) | Adds Study Analytics 2.0: `study_preferences`, `study_activity_events`, `student_achievements`, RPCs, and triggers. | Valid idempotent DDL. `auth.uid()` RLS logic passed `36/36` local PGlite tests (`tests/db/study-streak.db.test.js`). Rollback is available at [`011_study_streak_analytics_down.sql`](../../supabase/rollbacks/011_study_streak_analytics_down.sql). | `GET /rest/v1/study_preferences?select=student_id&limit=1` → `[]`, HTTP `200` | **APPLIED — Tables Visible** | Confirm using `supabase_migrations.schema_migrations` and include streak events in the live `DATA-01` run. |
| [`012_quiz_difficulty_and_repetition.sql`](../../supabase/migrations/012_quiz_difficulty_and_repetition.sql) | Adds `difficulty` and `explanation` to `quiz_questions`, `difficulty` to `quiz_attempts`, a fingerprint column, and indexes. Depends on migrations `004` and `005`. | Numbering was resolved in PR #75 by renaming the duplicate `011` migration to `012`. Rollback exists at [`012_quiz_difficulty_and_repetition_down.sql`](../../supabase/rollbacks/012_quiz_difficulty_and_repetition_down.sql). Minor comment hygiene: header comments still say Migration `011`. | `GET /rest/v1/quiz_attempts?select=id,difficulty&limit=1` → HTTP `400` (`42703`, missing column) | **UNVERIFIED — Not Applied Live** | Authorized Supabase admin runs `012_quiz_difficulty_and_repetition.sql` in the SQL Editor and verifies that all added columns exist. |
| [`013_ai_tutor.sql`](../../supabase/migrations/013_ai_tutor.sql) *(Deferred AI Tutor)* | Creates `ai_tutor_conversations`, `ai_tutor_messages`, `ai_tutor_learning_sessions`, `ai_tutor_usage_quotas`, triggers, and anti-impersonation RLS. Depends on migrations `001` and `002`. | Valid SQL. RLS and `REVOKE` tamper protections passed `4/4` local PGlite tests (`tests/db/ai-tutor.db.test.js`). Rollback is available at [`013_ai_tutor_down.sql`](../../supabase/rollbacks/013_ai_tutor_down.sql). | `GET /rest/v1/ai_tutor_conversations?select=id&limit=1` → HTTP `404` (`PGRST205`) | **DEFERRED — Not Applied Live** | Keep deferred outside the frozen Week 11 MVP scope until post-freeze deployment is explicitly authorized. |

---

## 9. `DATA-01` Live Two-Account RLS Verification Status

- **Responsible Owner:** Sumit Adhikari (`adronnie`)
- **Independent QA Collaborators:** Prince Karki (`princekark`) and Prabin Rai (`RaiPrabin697`)
- **Independent QA Tester for Issue #84:** To be named and recorded during QA sign-off.
- **Current Live Status:** **NOT RUN** — no live disposable Student A/Student B credentials were authorized or executed in this environment.

### What Existing Automated Checks Establish — Not a Substitute for `DATA-01`

- `E2E-RLS-02` (Nov 25 live anonymous REST probe via Playwright + `tests/e2e/e2e_runner.py`): **PASS** — unauthenticated `GET` calls returned HTTP `200 []` across `tasks`, `profiles`, `student_subjects`, `quiz_attempts`, `quiz_responses`, `study_preferences`, `study_activity_events`, and `student_achievements`.
- PGlite local PostgreSQL tests:
  - `study-streak.db.test.js`: **36/36 PASS**
  - `ai-tutor.db.test.js`: **4/4 PASS**

These checks validate policy logic and anonymous access locally or over anonymous REST, but do not replace live ordinary-JWT two-account verification.

### Exact Live `DATA-01` Verification Checklist & Script

1. Supply two authorized disposable student accounts:
   - `E2E_STUDENT_A_EMAIL` / `E2E_STUDENT_A_PASSWORD`
   - `E2E_STUDENT_B_EMAIL` / `E2E_STUDENT_B_PASSWORD`
2. Never use the `service_role` key.
3. Run the automated check or perform the verification manually using authenticated browser sessions and ordinary PostgREST bearer tokens:

```bash
export E2E_STUDENT_A_EMAIL="student_a@example.com"
export E2E_STUDENT_A_PASSWORD="..."
export E2E_STUDENT_B_EMAIL="student_b@example.com"
export E2E_STUDENT_B_PASSWORD="..."

npx playwright test tests/e2e/rls-isolation.spec.js --project="Desktop Chrome"
```

4. Capture redacted screenshots or HTTP responses in [`docs/week_12/Evidence/DATA-01-RLS/`](Evidence/DATA-01-RLS/README.md).
5. Confirm all required checks:
   - Student A creates and reads their own task.
   - Student B sees zero of Student A's tasks in the UI.
   - `GET /rest/v1/tasks?id=eq.<A_TASK_ID>` from Student B returns `[]`.
   - Student B receives zero rows modified or deleted on `PATCH` and `DELETE` against Student A's task ID.
   - Student B receives `[]` for `quiz_attempts`, `study_activity_events`, and `profiles` filtered to Student A's `user_id`.
   - Both Student A and Student B retain full read/write access to their own records.

---

## 10. Dark-Mode Subject Dropdown Issue Attribution ([Issue #84](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84))

- **Reporter:** Sumit Adhikari (`adronnie`) — discovered the dark-mode `<select>` dropdown text visibility defect while testing **Add a Study Task**, then filed Issue #84 with screenshot evidence.
- **Fix Owner:** J.N. Taj Oli (`jn-oli`) — responsible for the responsive/UI fix in [`public/styles.css`](../../public/styles.css). The fix is pending personal review and sign-off by `jn-oli`.
- **Independent QA Tester:** An independent tester must reproduce the issue and verify the fix. The tester's name and sign-off must be recorded separately before the fix is considered approved.

---

## 11. Remaining Blockers & Review Status

- **Live SQL execution (`009`, `010`, `012`):** Blocked pending Supabase project-owner authorization and SQL Editor screenshots, including migration receipts/schema verification.
- **Live `DATA-01` two-account RLS:** **NOT RUN** pending a coordinated Student A/Student B run by `adronnie`, `princekark`, and `RaiPrabin697`.
- **AI Tutor (`013`):** **DEFERRED** outside the frozen MVP scope.
- **Personal review status:** Prepared agent-assisted; requires personal execution/review sign-off from Sumit Adhikari (`adronnie`).

---

## 12. Final Conclusion

Database security and migration readiness remain **UNVERIFIED / NO-GO** for release until authorized application of `009`, `010`, and `012` and a redacted live `DATA-01` pass are completed and signed off.
