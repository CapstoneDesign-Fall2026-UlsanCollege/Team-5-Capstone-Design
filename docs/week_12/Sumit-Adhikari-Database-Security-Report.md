# Week 12 — Database Security, Migrations & DATA-01 Verification Report

**1. Student & GitHub Username:** Sumit Adhikari (adronnie)  
**2. Assigned Responsibility:** Database, Supabase Migrations, Row Level Security (RLS), and Data Isolation (DATA-01)  
**3. Review / Execution Attribution:** The SQL files in this repository were reviewed. Live Supabase Dashboard execution was not run. Live DATA-01 was not run. No response log is linked for an anonymous REST probe. tests/e2e/rls-isolation.spec.js was not changed for this report. Sign-off by Sumit Adhikari (adronnie) is pending.

---

## 4. Professor's Feedback Addressed

- Pending migrations 009, 010, and 012 are reviewed from the repository files for filename, SQL, dependencies, and RLS. A local .sql file is not treated as applied on the live project.
- Sumit's proposed AI Tutor model and the separate migration 013 are recorded separately. Both stay outside the frozen-core release gate.
- Live two-account RLS verification (DATA-01) must use ordinary authenticated student sessions, never the service_role key. It stays NOT RUN until a live result is linked.
- Dark-mode subject dropdown defect (Issue #84): Sumit Adhikari (adronnie) is the Reporter. Nabin Khadka implemented the dropdown contrast change.

---

## 5. Objective

Record the repository status of the pending and deferred Supabase migrations, keep live checks marked NOT RUN until evidence is linked, and document the Issue #84 report.

---

## 6. Work Performed

- Reviewed [supabase/migrations/](../../supabase/migrations/) and [supabase/rollbacks/](../../supabase/rollbacks/) for migrations 009, 010, 011, 012, and 013.
- Did not record a live PostgREST probe. The Live Cloud Probe column below stays not run because no response log is linked.
- Read [tests/e2e/rls-isolation.spec.js](../../tests/e2e/rls-isolation.spec.js). E2E-RLS-01 checks the task screen in the browser and is skipped when two live student accounts are absent. E2E-RLS-02 is an anonymous read of eight private tables. This report does not mark either test as passed, and the file was not given new GET, PATCH, or DELETE token checks.
- Recorded ownership for this area. Sumit Adhikari (adronnie) is the database reporter for Issue #84. Nabin Khadka implemented the dark-mode subject dropdown contrast change.

---

## 7. Files Modified / Created

- Created [docs/week_12/Sumit-Adhikari-Database-Security-Report.md](Sumit-Adhikari-Database-Security-Report.md) — this individual responsibility report.
- tests/e2e/rls-isolation.spec.js was not modified for this report.

---

## 8. Migration Audit & Live Verification Status

**Safety Rule:** No production SQL was executed and no destructive DDL or service_role bypass was run. Live probe cells stay not run until a response log is linked.

| Migration File | Exact Purpose & Dependencies | SQL & RLS Review | Live Cloud Probe | Status | Admin Action Required |
|---|---|---|---|---|---|
| [009_ai_quiz_tables.sql](../../supabase/migrations/009_ai_quiz_tables.sql) | Creates ai_quizzes, ai_quiz_questions, and ai_quiz_attempts (FK -> subjects(id), profiles(id)). Supports AI Quiz storage. | RLS is enabled on all three tables. Owner policies cover select, insert, update, and delete on ai_quizzes and ai_quiz_attempts. Question policies are tied to the parent quiz owner. | not run | UNVERIFIED — Not Applied Live | An authorized Supabase admin runs 009_ai_quiz_tables.sql in the SQL Editor and links the result. |
| [010_complete_universities.sql](../../supabase/migrations/010_complete_universities.sql) | Inserts more rows into public.universities. Depends on 007_universities.sql. Uses ON CONFLICT (country, name) DO NOTHING. | Idempotent catalog insert. No new table and no new RLS policy. | not run | UNVERIFIED — Not Applied Live | An authorized Supabase admin runs 010_complete_universities.sql and links the row-count result. |
| [011_study_streak_analytics.sql](../../supabase/migrations/011_study_streak_analytics.sql) | Adds Study Analytics 2.0: study_preferences, study_activity_events, student_achievements, functions, and a trigger. | Rollback file: [011_study_streak_analytics_down.sql](../../supabase/rollbacks/011_study_streak_analytics_down.sql). The file header still says proposed. The shared Week 12 report records an SQL Editor run on 17 November 2026. This report adds no new receipt. Local PGlite results in the Week 12 release report are not a live two-account result. | not run | APPLIED in the shared Week 12 report (17 November 2026). Streak checks inside DATA-01 stay NOT RUN. | Include streak events when DATA-01 is run live. |
| [012_quiz_difficulty_and_repetition.sql](../../supabase/migrations/012_quiz_difficulty_and_repetition.sql) | Adds difficulty, explanation, and fingerprint on quiz_questions, and difficulty on quiz_attempts, plus indexes. Depends on the existing quiz tables. | The filename and rollback file use 012. The header comment inside the SQL still says Migration 011. Rollback file: [012_quiz_difficulty_and_repetition_down.sql](../../supabase/rollbacks/012_quiz_difficulty_and_repetition_down.sql). | not run | UNVERIFIED — Not Applied Live | An authorized Supabase admin runs 012_quiz_difficulty_and_repetition.sql and links proof that the columns exist. |
| [AI tutor DB model.md](AI%20tutor%20DB%20model.md) | Sumit's proposed model: ai_conversations, ai_messages, ai_usage_quotas, and ai_saved_notes. | The document status line says Proposed — not applied. This is not the same SQL as 013_ai_tutor.sql. | not run | PROPOSED — Not Applied | Leave it not applied until the team lifts the freeze and a live result is linked. |
| [013_ai_tutor.sql](../../supabase/migrations/013_ai_tutor.sql) (Deferred AI Tutor) | Creates ai_tutor_conversations, ai_tutor_messages, ai_tutor_learning_sessions, and ai_tutor_usage_quotas, with RLS. Depends on 001_profiles.sql and 002_subjects.sql. | Rollback file: [013_ai_tutor_down.sql](../../supabase/rollbacks/013_ai_tutor_down.sql). These table names differ from Sumit's proposed model. Local PGlite results in the Week 12 release report are not a live apply. | not run | DEFERRED — Not Applied Live | Keep it outside the frozen MVP gate until a live result is linked. |

---

## 9. DATA-01 Live Two-Account RLS Verification Status

- **Responsible Owner:** Sumit Adhikari (adronnie)
- **Named collaborators in the shared report:** Prince Karki (princekark) and Prabin Rai (RaiPrabin697)
- **Current Live Status:** NOT RUN — no live Student A / Student B result is linked.
- **Evidence folder:** [docs/week_12/Evidence/DATA-01-RLS/](Evidence/DATA-01-RLS/README.md) still says NOT RUN.

### What is not a substitute for DATA-01

- E2E-RLS-01 and E2E-RLS-02: NOT RUN in this report. No response log is linked.
- Local PGlite results recorded in the Week 12 release report check SQL on a local database only.

### Exact Live DATA-01 Verification Checklist

This checklist is the future run. It has not been executed for this report.

- Use two authorized disposable student accounts:
  - E2E_STUDENT_A_EMAIL / E2E_STUDENT_A_PASSWORD
  - E2E_STUDENT_B_EMAIL / E2E_STUDENT_B_PASSWORD
- Use ordinary authenticated sessions. Do not use the service_role key.
- Save redacted screenshots or HTTP responses in [docs/week_12/Evidence/DATA-01-RLS/](Evidence/DATA-01-RLS/README.md).
- Confirm these checks before any status changes from NOT RUN:
  - Student A creates and reads their own task.
  - Student B sees zero of Student A's tasks in the UI.
  - Student B's authenticated read of Student A's task returns [].
  - Student B's authenticated update and delete against Student A's task change 0 rows.
  - Student B's authenticated reads of Student A's quiz attempts, study activity, and profile return [].
  - Student A and Student B can still read and write their own records.

---

## 10. Dark-Mode Subject Dropdown Issue Attribution (Issue #84)

On 23 November 2026, Sumit Adhikari (adronnie) tested Add a Study Task in light mode and dark mode.

- Light mode: the subject list was readable.
- Dark mode: the subject dropdown showed light text on a white list, so the subject names were hard to read.
- The screenshot is attached on Issue #84.

**Reporter:** Sumit Adhikari (adronnie) — found the defect, captured the screenshot, and opened Issue #84.

**Implemented by:** Nabin Khadka — applied the dark-mode subject dropdown contrast change in [public/styles.css](../../public/styles.css).

---

## 11. Remaining Blockers & Review Status

- **Live SQL execution (009, 010, 012):** NOT RUN. Status stays unverified until a SQL Editor or schema_migrations result is linked.
- **Live DATA-01 two-account RLS:** NOT RUN.
- **Proposed AI Tutor model:** NOT APPLIED.
- **AI Tutor migration (013):** DEFERRED — Not Applied Live.
- **Personal review status:** Sign-off by Sumit Adhikari (adronnie) is pending.

---

## 12. Final Conclusion

Database security and migration readiness remain UNVERIFIED / NO-GO. Migrations 009, 010, and 012 are not marked applied. Sumit's proposed AI Tutor model and migration 013 are not applied. DATA-01 stays NOT RUN until a redacted live result is linked.
