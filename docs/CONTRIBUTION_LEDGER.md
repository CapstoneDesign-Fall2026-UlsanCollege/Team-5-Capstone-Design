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

## Week 12 personal records (P0/P1 Fixes, Brevo SMTP & AI Tutor Implementation)

| Member | GitHub login | Week 12 contribution | Evidence (PRs, Commits & Created Documents) | Status |
|---|---|---|---|---|
| Nabin Khadka | `liftupkhadka555-spec` | Fixed broken Wireframes link (`PR #69`), Retake Quiz flow + unit suite (`PR #71`), Task Modal deadline validation, UTC date offset, Quiz History 20-attempt cap, and `012_quiz_difficulty_and_repetition.sql` rename (`PR #72`, `PR #75`); configured Brevo Custom SMTP resolving Issue #40 live password reset (`1783981`); implemented and locally verified personalized Gemini AI Tutor (`#ai-tutor`, `ai-tutor-chat` Edge Function, migration `013_ai_tutor.sql` & rollback, Vitest/PGlite RLS/Playwright specs; live cloud deploy pending) (`PR #78`), synced personal Vercel fork `main` (`03ae6a4`), and authored 15 Week 12 & AI Tutor documents. | [PR #69](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/69), [PR #71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/71), [PR #72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/72), [PR #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75), [PR #78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/78), [`docs/week_12/weekly-report.md`](week_12/weekly-report.md), [`docs/week_12/README.md`](week_12/README.md), [`docs/week_12/TECHNICAL_AUDIT.md`](week_12/TECHNICAL_AUDIT.md), [`docs/week_12/QUIZ_RETAKE_BUG_FIX_REPORT.md`](week_12/QUIZ_RETAKE_BUG_FIX_REPORT.md), [`docs/week_12/BUG_FIX_REGRESSION_REPORT.md`](week_12/BUG_FIX_REGRESSION_REPORT.md), [`docs/week_12/AUTH_SMTP_VERIFICATION.md`](week_12/AUTH_SMTP_VERIFICATION.md), [`docs/week_12/DATA-01-RLS-VERIFICATION.md`](week_12/DATA-01-RLS-VERIFICATION.md), [`docs/week_12/PLAYWRIGHT_E2E_REPORT.md`](week_12/PLAYWRIGHT_E2E_REPORT.md), [`docs/week_12/DEPLOYMENT_VERIFICATION.md`](week_12/DEPLOYMENT_VERIFICATION.md), [`docs/week_12/Evidence/Quiz-Retake-Fix/README.md`](week_12/Evidence/Quiz-Retake-Fix/README.md), [`docs/week_12/Evidence/DATA-01-RLS/README.md`](week_12/Evidence/DATA-01-RLS/README.md), [`docs/ai_tutor/AI_TUTOR_IMPLEMENTATION_REPORT.md`](ai_tutor/AI_TUTOR_IMPLEMENTATION_REPORT.md), [`docs/ai_tutor/AI_TUTOR_TESTING_REPORT.md`](ai_tutor/AI_TUTOR_TESTING_REPORT.md), [`docs/ai_tutor/AI_TUTOR_SETUP_GUIDE.md`](ai_tutor/AI_TUTOR_SETUP_GUIDE.md), [`docs/ai_tutor/Evidence/README.md`](ai_tutor/Evidence/README.md) | **Merged to `main`; live AI Tutor & Playwright gates pending** |
| Sumit Adhikari | `adronnie` | _To be filled by Sumit_ | — | Not confirmed |
| Prince Karki | `princekark` | _See Week 12 shared report / to be filled by Prince_ | [`docs/week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md`](week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md), [`docs/week_12/PRINCE_KARKI_PASSWORD_RECOVERY_QA.md`](week_12/PRINCE_KARKI_PASSWORD_RECOVERY_QA.md) | Not confirmed |
| Prabin Rai | `RaiPrabin697` | _See Week 12 shared report / to be filled by Prabin_ | [PR #76](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/76) | Not confirmed |
| J.N. Taj Oli | `jn-oli` | _See Week 12 shared report / to be filled by J.N. Taj_ | [`docs/week_12/AI_TUTOR_UI_UX_SPEC.md`](week_12/AI_TUTOR_UI_UX_SPEC.md), [Issue #79](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/79), [Issue #80](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/80) | Not confirmed |

## Week 11 personal records (MVP Verification & Freeze Window)

| Member | GitHub login | Week 11 contribution | Evidence | Status |
|---|---|---|---|---|
| Nabin Khadka | `liftupkhadka555-spec` | Production Vercel frontend deployment, authoring 7 Playwright E2E suites & automated runner, audit & closure of 18 historical GitHub issues, and full Week 11 technical audit documentation set (`REPOSITORY_AUDIT.md`, `DEPLOYMENT_VERIFICATION.md`, `AUTHENTICATION_VERIFICATION.md`, `DATABASE_AND_RLS_VERIFICATION.md`, `AI_QUIZ_LIVE_VERIFICATION.md`, `FEATURE_FREEZE_DECISION.md`). | [`docs/week_11/NABIN_KHADKA_EVIDENCE.md`](week_11/NABIN_KHADKA_EVIDENCE.md), [`docs/week_11/VERCEL_DEPLOYMENT_REPORT.md`](week_11/VERCEL_DEPLOYMENT_REPORT.md), [`docs/week_11/E2E_TEST_RESULTS.md`](week_11/E2E_TEST_RESULTS.md), [`docs/week_11/ISSUES_AUDIT_SEP19_OCT13.md`](week_11/ISSUES_AUDIT_SEP19_OCT13.md) | **Verified & Completed** |
| Sumit Adhikari | `adronnie` | _To be filled by Sumit_ | — | Not confirmed |
| Prince Karki | `princekark` | _To be filled by Prince_ | — | Not confirmed |
| Prabin Rai | `RaiPrabin697` | _To be filled by Prabin_ | — | Not confirmed |
| J.N. Taj Oli | `jn-oli` | _To be filled by J.N. Taj_ | — | Not confirmed |

## Earlier Week 10 row (`liftupkhadka555-spec`)

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
