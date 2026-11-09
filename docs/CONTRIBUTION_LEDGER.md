# Contribution Ledger

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
| Nabin Khadka | `liftupkhadka555-spec` | Authored Week 10 [`Slice.md`](week_10/Slice.md), [`weekly-report.md`](week_10/weekly-report.md), and developer integration report [`AI_QUIZ_DEVELOPER_INTEGRATION_REPORT.md`](week_10/AI_QUIZ_DEVELOPER_INTEGRATION_REPORT.md); built & executed live Supabase database setup script [`setup_all.sql`](../supabase/setup_all.sql) with 8 production tables; implemented **AI Quiz Generator** with schema migration [`009_ai_quiz_tables.sql`](../supabase/migrations/009_ai_quiz_tables.sql), Supabase Edge Function (`generate-ai-quiz`), and client generator service; resolved full-stack problems 1, 2, and 3 (mandatory signup-to-login redirect, major curriculum filtering, and 6-digit OTP verification); implemented Study Task Analytics (`#analytics`) and multi-tier University & Subject Onboarding (`#subjects`); expanded automated test suite to 11/11 passing ([`tests/run_tests.py`](../tests/run_tests.py), [`tests/test_ai_quiz.py`](../tests/test_ai_quiz.py)). | [`docs/week_10/AI_QUIZ_DEVELOPER_INTEGRATION_REPORT.md`](week_10/AI_QUIZ_DEVELOPER_INTEGRATION_REPORT.md), [`docs/AI_Quiz_Generator.md`](AI_Quiz_Generator.md), [`docs/database/AI_Quiz_Database.md`](database/AI_Quiz_Database.md), [`docs/database/AI_Quiz_ERD.md`](database/AI_Quiz_ERD.md), [`docs/AI_Quiz_Testing.md`](AI_Quiz_Testing.md), [`docs/week_10/Slice.md`](week_10/Slice.md), [`docs/week_10/weekly-report.md`](week_10/weekly-report.md), [`supabase/setup_all.sql`](../supabase/setup_all.sql), [`supabase/migrations/009_ai_quiz_tables.sql`](../supabase/migrations/009_ai_quiz_tables.sql), [Issue #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48), [PR #46](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/46) |

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

