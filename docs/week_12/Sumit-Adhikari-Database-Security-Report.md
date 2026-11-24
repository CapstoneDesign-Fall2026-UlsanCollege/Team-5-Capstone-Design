# Week 12 — Database Security, Migrations & DATA-01 Verification Report

**1. Student & GitHub Username:** Sumit Adhikari (`adronnie`)  
**2. Assigned Responsibility:** Database, Supabase Migrations, Row Level Security (RLS), and Data Isolation (`DATA-01`)  
**3. Review / Execution Attribution:** Repository SQL inspection, live anonymous REST probing, and `tests/e2e/rls-isolation.spec.js` test-harness enhancements completed **agent-assisted** on branch `week12/final-qa-reconciliation` (`bb7c974`), **pending personal SQL Dashboard execution, live `DATA-01` execution, and sign-off by Sumit Adhikari (`adronnie`)**.

---

## 4. Professor's Feedback Addressed

1. Pending migrations `009`, `010`, and `012` must be audited individually for exact filenames, SQL validity, dependencies, RLS policies, and live cloud application evidence—never assuming a local `.sql` file is applied live.
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
3. Enhanced [`tests/e2e/rls-isolation.spec.js`](../../tests/e2e/rls-isolation.spec.js) (`E2E-RLS-01`) to test full ordinary-JWT `GET`, `PATCH`, and `DELETE` denial across `tasks`, `quiz_attempts`, `study_activity_events`, and `profiles` for Student A vs. Student B (cleanly skipped as `NOT RUN` when live disposable credentials are absent).
4. Clarified ownership in Week 12 reports so Sumit Adhikari (`adronnie`) is credited as **Database Security Owner** and **Reporter of Issue #84 (dark-mode subject dropdown)**, while J.N. Taj Oli (`jn-oli`) owns the CSS dropdown fix.

---

## 7. Files Modified / Created

- Created [`docs/week_12/Sumit-Adhikari-Database-Security-Report.md`](Sumit-Adhikari-Database-Security-Report.md) (this individual responsibility report)
- Updated [`tests/e2e/rls-isolation.spec.js`](../../tests/e2e/rls-isolation.spec.js) (`E2E-RLS-01` expanded to cover read/modify/delete API checks with Student A/B JWTs; `E2E-RLS-02` checks 8 private tables anonymously)

---

## 8. Migration Audit & Live Verification Status

> **Safety Rule:** No production SQL was executed and no destructive DDL or `service_role` bypass was run.

| Migration File | Exact Purpose & Dependencies | SQL & RLS Review | Live Cloud Probe (Nov 25, 2026) | Status | Admin Action Required |
|---|---|---|---|---|---|
| [`009_ai_quiz_tables.sql`](../../supabase/migrations/009_ai_quiz_tables.sql) | Creates `ai_quizzes`, `ai_quiz_questions`, `ai_quiz_attempts` (`FK -> subjects(id), profiles(id)`). Supports AI Quiz storage. | Valid PostgreSQL DDL; RLS enabled on all 3 tables with `auth.uid()` owner policies (`select/insert/update/delete` on `ai_quizzes`; nested ownership on `ai_quiz_questions`; `user_id` ownership on `ai_quiz_attempts`). Reversible via `DROP TABLE IF EXISTS`. | `GET /rest/v1/ai_quizzes?select=id&limit=1` → **HTTP 404 (`PGRST205`)** | **UNVERIFIED (Not Applied Live)** | Authorized Supabase admin runs `009_ai_quiz_tables.sql` in SQL Editor, then reloads schema (`NOTIFY pgrst, 'reload schema';`) and verifies tables. |
| [`010_complete_universities.sql`](../../supabase/migrations/010_complete_universities.sql) | Inserts expanded international university catalog (`FK/dependency -> universities` table from `007_universities.sql`). | Valid idempotent SQL (`ON CONFLICT DO NOTHING` / catalog inserts). Read-only public catalog once applied (`007` RLS select policy applies). | `GET /rest/v1/universities?select=country,name&name=ilike.*Kelaniya*` → **`[]` HTTP 200** (count stays 46 from `007`) | **UNVERIFIED (Not Applied Live)** | Authorized Supabase admin runs `010_complete_universities.sql`, verifies updated row count (`> 46`). |
| [`011_study_streak_analytics.sql`](../../supabase/migrations/011_study_streak_analytics.sql) | Study Analytics 2.0 (`study_preferences`, `study_activity_events`, `student_achievements`, RPCs, trigger). | Valid idempotent DDL; `auth.uid()` RLS verified **36/36 PASS** in local PGlite (`tests/db/study-streak.db.test.js`). Rollback at [`011_study_streak_analytics_down.sql`](../../supabase/rollbacks/011_study_streak_analytics_down.sql). | `GET /rest/v1/study_preferences?select=student_id&limit=1` → **`[]` HTTP 200** | **APPLIED** (Tables visible; two-account live streak check stays part of `DATA-01`) | Confirm via `supabase_migrations.schema_migrations` receipt and include streak events in live `DATA-01`. |
| [`012_quiz_difficulty_and_repetition.sql`](../../supabase/migrations/012_quiz_difficulty_and_repetition.sql) | Adds `difficulty`, `explanation`, `fingerprint` on `quiz_questions` + `difficulty` on `quiz_attempts` + indexes (`004`, `005` dependency). | Numbering resolved (`011_` duplicate renamed to `012_` in PR #75); rollback exists at [`012_quiz_difficulty_and_repetition_down.sql`](../../supabase/rollbacks/012_quiz_difficulty_and_repetition_down.sql). Minor hygiene note: header comments inside `012` / `012_down` still say `Migration 011`. | `GET /rest/v1/quiz_attempts?select=id,difficulty&limit=1` → **HTTP 400 (`42703` missing column)** | **UNVERIFIED (Not Applied Live)** | Authorized Supabase admin runs `012_quiz_difficulty_and_repetition.sql` cleanly in SQL Editor and verifies columns exist. |
| [`013_ai_tutor.sql`](../../supabase/migrations/013_ai_tutor.sql) *(Deferred AI Tutor)* | Creates `ai_tutor_conversations`, `ai_tutor_messages`, `ai_tutor_learning_sessions`, `ai_tutor_usage_quotas`, triggers & anti-impersonation RLS (`001`, `002` dependency). | Valid SQL; RLS + `REVOKE` tamper protections verified **4/4 PASS** in local PGlite (`tests/db/ai-tutor.db.test.js`). Rollback at [`013_ai_tutor_down.sql`](../../supabase/rollbacks/013_ai_tutor_down.sql). | `GET /rest/v1/ai_tutor_conversations?select=id&limit=1` → **HTTP 404 (`PGRST205`)** | **DEFERRED (Not Applied Live; Out of Week 11 MVP)** | Keep **DEFERRED** until frozen MVP gates pass and post-freeze deployment is authorized. |

---

## 9. `DATA-01` Live Two-Account RLS Verification Status

- **Responsible Owner:** Sumit Adhikari (`adronnie`)
- **Independent QA Collaborators:** Prince Karki (`princekark`) and Prabin Rai (`RaiPrabin697`)
- **Current Live Status:** **`NOT RUN`** (no live disposable Student A / Student B credentials were authorized or executed in this environment)
- **What Existing Automated Checks Establish (Non-Substitute for `DATA-01`):**
  - `E2E-RLS-02` (Nov 25 live anonymous REST probe via Playwright + `tests/e2e/e2e_runner.py`): **PASS** — unauthenticated `GET` calls returned `HTTP 200 []` across `tasks`, `profiles`, `student_subjects`, `quiz_attempts`, `quiz_responses`, `study_preferences`, `study_activity_events`, and `student_achievements`.
  - PGlite local PostgreSQL tests (`study-streak.db.test.js` **36/36 PASS**, `ai-tutor.db.test.js` **4/4 PASS**): verify SQL policy logic locally only.

### Exact Live `DATA-01` Verification Checklist & Script

1. Supply two authorized disposable student accounts (`E2E_STUDENT_A_EMAIL` / `E2E_STUDENT_A_PASSWORD` and `E2E_STUDENT_B_EMAIL` / `E2E_STUDENT_B_PASSWORD` — never use `service_role`).
2. Run the automated check or perform manually via ordinary authenticated browser sessions + PostgREST `Bearer <access_token>`:
   ```bash
   export E2E_STUDENT_A_EMAIL="student_a@example.com"
   export E2E_STUDENT_A_PASSWORD="..."
   export E2E_STUDENT_B_EMAIL="student_b@example.com"
   export E2E_STUDENT_B_PASSWORD="..."
   npx playwright test tests/e2e/rls-isolation.spec.js --project="Desktop Chrome"
   ```
3. Verify and capture redacted screenshots / HTTP responses into [`docs/week_12/Evidence/DATA-01-RLS/`](Evidence/DATA-01-RLS/README.md) confirming all 9 checks:
   - Student A creates and reads their own task.
   - Student B sees 0 of Student A's tasks in UI **and** receives `[]` (`0` rows) on `GET /rest/v1/tasks?id=eq.<A_TASK_ID>`.
   - Student B receives `0` rows modified/deleted on `PATCH` and `DELETE` against Student A's task ID.
   - Student B receives `[]` on `quiz_attempts`, `study_activity_events`, and `profiles` filtered to Student A's `user_id`.
   - Both Student A and Student B retain full read/write access to their own records.

---

## 10. Dark-Mode Subject Dropdown Issue Attribution ([Issue #84](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84))

- **Reporter:** Sumit Adhikari (`adronnie`) — discovered dark-mode `<select>` dropdown text visibility bug during "Add a Study Task" testing and filed Issue #84 with screenshot evidence.
- **Fix Owner:** J.N. Taj Oli (`jn-oli`) — responsive/UI owner (fix applied agent-assisted in [`public/styles.css`](../../public/styles.css) pending `jn-oli` & QA review; Sumit is credited accurately as reporter, not frontend fix implementer).

---

## 11. Remaining Blockers & Review Status

- **Live SQL Execution (`009`, `010`, `012`):** Blocked pending Supabase project owner authorization & SQL Editor screenshots (`schema_migrations` / table inspection).
- **Live `DATA-01` Two-Account RLS:** **NOT RUN** pending coordinated Student A + Student B run by `adronnie`, `princekark`, and `RaiPrabin697`.
- **AI Tutor (`013`):** **DEFERRED** outside Week 11 frozen MVP scope.
- **Personal Review Status:** Prepared agent-assisted; requires personal execution/review sign-off from Sumit Adhikari (`adronnie`).

---

## 12. Final Conclusion

Database security and migration readiness remain **UNVERIFIED / NO-GO** for release until authorized application of `009`, `010`, and `012` and a redacted live **DATA-01** pass are completed and signed off.
