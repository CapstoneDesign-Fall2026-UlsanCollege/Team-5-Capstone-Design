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

## Week 12 personal records (P0/P1 Fixes, Brevo SMTP, Final QA & Ownership Reconciliation)

| Member | GitHub login | Week 12 contribution | Evidence (PRs, Commits & Created Documents) | Status |
|---|---|---|---|---|
| Nabin Khadka | `liftupkhadka555-spec` | Preserved completed Week 12 engineering work: removed Wireframes 404 link (`PR #69`), fixed Retake Quiz (`PR #71`), deadline/local-date/200-cap/`012_` rename (`PR #72`, `PR #75`), Brevo Custom SMTP resolving `#40` live recovery (`1783981`), local Gemini AI Tutor (`PR #78`, kept **DEFERRED** out of MVP gate), and Week 12 verification hub/release audit (`PR #85`). Authoritative course Vercel SHA remains **`UNKNOWN / UNVERIFIED`**. | [PR #69](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/69), [PR #71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/71), [PR #72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/72), [PR #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75), [PR #78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/78), [PR #82](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/82), [PR #85](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/85), [`docs/week_12/RELEASE_VERIFICATION_REPORT.md`](week_12/RELEASE_VERIFICATION_REPORT.md), [`docs/week_12/DEPLOYMENT_VERIFICATION.md`](week_12/DEPLOYMENT_VERIFICATION.md), [`docs/week_12/MVP_VERIFICATION_MATRIX.md`](week_12/MVP_VERIFICATION_MATRIX.md) | **Merged code intact; Vercel SHA (`UNKNOWN / UNVERIFIED`) & live Edge deploys pending** |
| Sumit Adhikari | `adronnie` | Proposed Week 12 AI Tutor PostgreSQL model (`013`, deferred); reported dark-mode subject dropdown bug ([Issue #84](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84), fix owned by `jn-oli`). Agent-assisted audit report & live `DATA-01` script improvements staged under `adronnie`'s ownership pending personal SQL run & review. | [`docs/week_12/Sumit-Adhikari-Database-Security-Report.md`](week_12/Sumit-Adhikari-Database-Security-Report.md), [`docs/week_12/AI tutor DB model.md`](week_12/AI%20tutor%20DB%20model.md), [Issue #84](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84#issue-6552876384) | **Personal confirmation, live `009`/`010`/`012`, & `DATA-01` pending (`NOT RUN`)** |
| Prince Karki | `princekark` | Executed Nov 22 Playwright baseline (`15/24`: 7 PASS, 8 FAIL, 9 unconfirmed) and manual live password-recovery PASS (`W12-01`–`W12-06`). Nov 25 failure classification addendum & Chrome retest (`6/24` unauth/anon PASS, `18/24` live `NOT RUN`) recorded as agent-assisted pending `princekark` independent rerun. | [`docs/week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md`](week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md), [`docs/week_12/PRINCE_KARKI_PASSWORD_RECOVERY_QA.md`](week_12/PRINCE_KARKI_PASSWORD_RECOVERY_QA.md), [`docs/week_12/Evidence/`](week_12/Evidence/) | **Nov 22 baseline recorded; credentialed retest & `DATA-01` pending** |
| Prabin Rai | `RaiPrabin697` | Reconciled evidence boundaries (`PR #76`, `PR #86`). Playwright harness repairs (`getByRole`/`getByLabel`, `E2E-RLS-01` API denial, non-cloud `UI-REG-01..06` suite) recorded in Week 12 repair report as **agent-assisted pending `RaiPrabin697`'s personal review and rerun**. | [PR #76](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/76), [PR #86](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/86), [`docs/week_12/Prabin-Rai-Automation-Repair-Report.md`](week_12/Prabin-Rai-Automation-Repair-Report.md), [`docs/week_12/PLAYWRIGHT_E2E_REPORT.md`](week_12/PLAYWRIGHT_E2E_REPORT.md) | **PR #76/#86 merged; personal rerun of repaired Playwright suite pending** |
| J.N. Taj Oli | `jn-oli` | Authored design-only AI Tutor UI/UX spec, filed Issues `#79`, `#80`, `#83`, and completed Nov 23 dark-mode Retake Quiz verification (`QUIZ_RETAKE_PEER_REVIEW.md`). Fix owner for Issue `#83` (`320px–1440px` Light/Dark Quiz layout) and `#84` (dark-mode subject dropdown, reported by `adronnie`) — code fixes & 7-viewport Chrome check staged agent-assisted pending personal confirmation. | [`docs/week_12/JN-Taj-Oli-Responsive-UI-Report.md`](week_12/JN-Taj-Oli-Responsive-UI-Report.md), [`docs/week_12/ISSUE_83_UPDATE_DRAFT.md`](week_12/ISSUE_83_UPDATE_DRAFT.md), [`docs/week_12/QUIZ_RETAKE_PEER_REVIEW.md`](week_12/QUIZ_RETAKE_PEER_REVIEW.md), [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83), [Issue #84](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84) | **Retake PASS; personal recheck of `#83`/`#84` & sign-off pending** |

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
