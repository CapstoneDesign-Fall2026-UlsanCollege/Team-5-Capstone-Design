# Contribution Ledger

## Week 11 documentation contribution - 2026-11-14

`RaiPrabin697`: prepared the [review package](week_11/README.md), evidence classification, task reproduction instructions and dated documentation reconciliation with automated assistance. This is documentation work, not a fresh application test. Historical unit tests and assisted browser observations are separately attributed in the [register](week_11/EVIDENCE_REGISTER.md). Human review/acceptance and independent repetition remain pending. Other members' historical rows below are unchanged.

This ledger keeps member contribution rows tied to visible evidence. Update the rows when a teammate adds a commit, issue update, screenshot, or tested-by note.

## Name ↔ GitHub login

Use both the legal name and the exact GitHub login in report rows. These mappings come from the [project agreement](week1/project_agreement.md).

| Student | GitHub login |
|---|---|
| Nabin Khadka | `liftupkhadka555-spec` |
| Sumit Adhikari | `adronnie` |
| Prince Karki | `princekark` |
| Prabin Rai | `RaiPrabin697` |
| J.N. Taj Oli | `jn-oli` |

**Identity note:** The report row **Nabin Khadka is `liftupkhadka555-spec`**. Confirmed by Nabin Khadka. It is not `RaiPrabin697` (that login is Prabin Rai).

## Current-window row (`liftupkhadka555-spec`)

| Member | GitHub login | What they did | Evidence |
|---|---|---|---|
| Nabin Khadka | `liftupkhadka555-spec` | Authored Week 10 [`Slice.md`](week_10/Slice.md), [`weekly-report.md`](week_10/weekly-report.md), developer integration report [`AI_QUIZ_DEVELOPER_INTEGRATION_REPORT.md`](week_10/AI_QUIZ_DEVELOPER_INTEGRATION_REPORT.md), and the Week 10 Backend Audit & Testing documentation set ([`backend-final-report.md`](week_10/backend-final-report.md), [`backend-architecture.md`](week_10/backend-architecture.md), [`backend-integration-report.md`](week_10/backend-integration-report.md), [`authentication-testing.md`](week_10/authentication-testing.md), [`password-reset-investigation.md`](week_10/password-reset-investigation.md), [`database-verification.md`](week_10/database-verification.md), [`subject-selection-testing.md`](week_10/subject-selection-testing.md), [`task-quiz-testing.md`](week_10/task-quiz-testing.md), [`ai-integration-plan.md`](week_10/ai-integration-plan.md), [`backend-test-results.md`](week_10/backend-test-results.md), [`Evidence/README.md`](week_10/Evidence/README.md), [`COMPLETE_BACKEND_INTEGRATION_REPORT.md`](COMPLETE_BACKEND_INTEGRATION_REPORT.md), [`AI_STUDY_ASSISTANT_ARCHITECTURE.md`](AI_STUDY_ASSISTANT_ARCHITECTURE.md)); built consolidated Supabase setup script [`setup_all.sql`](../supabase/setup_all.sql) and [`010_complete_universities.sql`](../supabase/migrations/010_complete_universities.sql); implemented **AI Quiz Generator** with schema migration [`009_ai_quiz_tables.sql`](../supabase/migrations/009_ai_quiz_tables.sql), Edge Function (`generate-ai-quiz`), and client generator service; completed backend fixes (`ec6bd38`) across `auth-guard.js`, `subjects.js`, `tasks.js`, `quiz.js`, `ai-quiz.js`, `app.js`, and `vite.config.js`; diagnosed live recovery blockers (`@gmmail.com` user typo, `mailer_autoconfirm: true`, unapplied `009`/`010`, SMTP/template requirements); expanded automated suites (`11/11` Python checks [`tests/run_tests.py`](../tests/run_tests.py), [`tests/test_ai_quiz.py`](../tests/test_ai_quiz.py), `27/27` Vitest via [`backend-services.test.js`](../tests/unit/backend-services.test.js)). Live E2E browser sessions & Dashboard SQL/SMTP actions remain open. | [`docs/week_10/backend-final-report.md`](week_10/backend-final-report.md), [`docs/week_10/backend-test-results.md`](week_10/backend-test-results.md), [`docs/week_10/password-reset-investigation.md`](week_10/password-reset-investigation.md), [`docs/week_10/database-verification.md`](week_10/database-verification.md), [`docs/COMPLETE_BACKEND_INTEGRATION_REPORT.md`](COMPLETE_BACKEND_INTEGRATION_REPORT.md), [`docs/AI_STUDY_ASSISTANT_ARCHITECTURE.md`](AI_STUDY_ASSISTANT_ARCHITECTURE.md), [`docs/SUPABASE_EMAIL_TEMPLATES_SETUP.md`](SUPABASE_EMAIL_TEMPLATES_SETUP.md), [`docs/week_10/AI_QUIZ_DEVELOPER_INTEGRATION_REPORT.md`](week_10/AI_QUIZ_DEVELOPER_INTEGRATION_REPORT.md), [`docs/week_10/Slice.md`](week_10/Slice.md), [`docs/week_10/weekly-report.md`](week_10/weekly-report.md), [`supabase/setup_all.sql`](../supabase/setup_all.sql), [`supabase/migrations/009_ai_quiz_tables.sql`](../supabase/migrations/009_ai_quiz_tables.sql), [`supabase/migrations/010_complete_universities.sql`](../supabase/migrations/010_complete_universities.sql), [`tests/unit/backend-services.test.js`](../tests/unit/backend-services.test.js), Commit `ec6bd38`, [Issue #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48), [PR #46](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/46) |

## Earlier Week 6 rows

| Member | GitHub login | Week 6 contribution | Evidence |
|---|---|---|---|
| Nabin Khadka | `liftupkhadka555-spec` | Coordination, proof collection, and evidence review | [Week 6 tested-by note](Week6/tested-by-notes.md) |
| Sumit Adhikari | `adronnie` | Frontend and theme follow-up owner | [Theme issue proof](Week6/Demo2.png) |
| Prince Karki | `princekark` | Tester role and feedback/report support | [Week 6 feedback](Week6/WEEK6_FEEDBACK_AND_SUGGESTIONS.md) |
| Prabin Rai | `RaiPrabin697` | Testing/evidence support and docs review | [Week 6 weekly report](Week6/WEEKLY_REPORT.md) |
| J.N. Taj Oli | `jn-oli` | Documentation and weekly report support | [Week 6 weekly report](Week6/WEEKLY_REPORT.md) |

## Rule

Only mark a contribution complete when there is a link to a file, screenshot, commit, PR, or issue update. Each student adds their own row; do not confirm another member’s work on their behalf.

## Week 9 personal record

| Member | Week 9 contribution | Evidence | Test status / next action |
|---|---|---|---|
| Prabin Rai (`RaiPrabin697`) | Authored the QA Evidence Matrix and Final Demo Roadmap in the Week 9 docs PR. This is a documentation contribution only. | [Week 9 report](week9/weekly-report.md#raiprabin697-personal-week-9-record); [QA Evidence Matrix](week9/QA_EVIDENCE_MATRIX.md); [Final Demo Roadmap](week9/FINAL_DEMO_ROADMAP.md) | Fresh signup/sign-in, task reload, and second-account isolation checks are **Not run** by Rai in this update. Next action: execute them in a test environment and append actual results and safe proof. |

Only add test completion evidence after execution; do not infer live account behavior from code or design documents.
