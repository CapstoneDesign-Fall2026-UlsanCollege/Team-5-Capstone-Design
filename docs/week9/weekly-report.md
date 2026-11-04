# Week 9 Team Report

**Team:** 5 — Smart Study Companion  **Week:** 9  
**Report date:** 2026-11-04

## Team goal and summary

This week’s documented work moved the project from earlier browser-local and proposed-auth designs toward the Supabase Auth and PostgreSQL implementation. The repository contains the merged migration work, current auth pages, a Week 9 login/signup UI design, a database-model review, and a dated automated test report.

The evidence does **not** yet demonstrate live account and cloud-data behavior: the reported automated checks ran against a local working snapshot, the fresh browser smoke test was not run, and no live Supabase credentials were used. This report distinguishes implementation/code review, automated checks, local preview, and live-service tests rather than treating them as equivalent.

## Documented Week 9 deliverables

| Deliverable | Evidence and status |
|---|---|
| Supabase Auth and PostgreSQL implementation | [PR #41](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/41) is merged. The [root README](../../README.md) describes Supabase Auth, PostgreSQL, and RLS as the current architecture. This establishes implementation history, not successful live end-to-end behavior. |
| Login/signup UI proposal and mockups | [Week 9 auth UI design](auth-ui-design.md) names J.N. Taj Oli as owner and documents the mockup’s field validation and error-state intent. It is a design artifact; the clickable mockups do not create real accounts. |
| Database-model review | [Database-model review](database-model-check-report.md), dated 2026-10-31, inspects repository code and migrations. It flags quiz-answer visibility and documentation drift. It is a code/schema review, not a live database test. |
| Automated test report | [Week 9 test report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/c54be0c511a773e5018af2f89e07299d7a20b887/docs/week9/TEST_REPORT.md) records `npm test` (12 tests), `python3 tests/run_tests.py` (6 check groups), and `npm run build` as passing on its local working snapshot, with stated scope limitations. |
| Upgrade plan | [Next-week upgrade plan](NEXT_WEEK_UPGRADE_PLAN.md) records code-review findings and proposed acceptance criteria. Its unchecked items are future work, not completed features or tests. |

## Evidence links

| Evidence type | Link | What it supports / limitation |
|---|---|---|
| Pull request | [PR #41 — Supabase Auth and PostgreSQL migration](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/41) | Merged implementation history; does not by itself prove live Supabase behavior. |
| Current architecture | [Project README](../../README.md) | Documents the Supabase Auth/PostgreSQL direction and setup instructions. The setup list currently names migrations 001–006; the upgrade plan reports a migration 007, so the sequence needs reconciliation. |
| Auth UI | [Week 9 auth UI design](auth-ui-design.md); [login page](../../public/auth/login.html); [signup page](../../public/auth/signup.html) | Design, mockup intent, and current page source. The design describes validation/error behavior; that is distinct from a recorded live-auth test. |
| Testing | [Week 9 test report](TEST_REPORT_2026-11-03.md); [test documentation](../tests/README.md) | Automated results, manual-test boundaries, and evidence checklist. |
| Database and follow-up | [Database-model review](database-model-check-report.md); [upgrade plan](NEXT_WEEK_UPGRADE_PLAN.md) | Code/schema review findings and proposed work. |
| Local preview evidence | [Nabin Khadka’s evidence note](../../Evidence.md) | Records a local signup-page check and local-preview sign-in to the dashboard by Nabin; explicitly not a live Supabase test. |
| Prior-week context | [Week 8 auth feature design](../week8/LoginIn_signup_Features.md); [Week 8 weekly report](../week8/weekly-report.md) | Earlier proposal and record of the browser-local prototype; historical context, not Week 9 live-system evidence. |
| Earlier database design | [Week 8 database login/signup proposal](../week8/database_login%20%26%20signup.md) | Describes custom `users`, sessions, and reset-token tables. These are proposals, not the current Supabase Auth and `profiles` implementation. |

## Testing status — keep environments distinct

| Test category | Recorded result | What it does not establish |
|---|---|---|
| Automated checks | The 2026-11-03 test report records `npm test` PASS (3 files, 12 tests), `python3 tests/run_tests.py` PASS (6 check groups), and `npm run build` PASS. | Unit tests use small helpers in test files; Python checks inspect files/SQL text and do not execute migrations against PostgreSQL. The report also notes the tested checkout had uncommitted changes. |
| Local browser preview | Nabin’s evidence note records opening signup and login in local preview and signing in through the local-preview flow to the dashboard. | This is local-preview evidence only; it does not establish live signup, email verification, cloud persistence, or RLS isolation. |
| Fresh browser smoke / end-to-end | The 2026-11-03 report marks the browser smoke test NOT RUN because Vite could not bind to localhost (`listen EPERM`); it also says no Playwright run was performed. | No fresh visual/interactive result is claimed. |
| Live Supabase | No live credentials were used for the reported checks. | Signup, email verification, task persistence in PostgreSQL, RLS behavior, and two-account isolation remain unverified. |

## Individual contribution evidence

Entries below are limited to evidence in the repository. A design specification is not represented as a completed test. “Awaiting confirmation” means this report does not yet have enough Week 9 evidence to attribute work; each student should confirm their own row and add evidence.

| Student | GitHub login | Week 9 contribution supported by available evidence | Evidence |
|---|---|---|---|
| Nabin Khadka | `liftupkhadka555-spec` | Authored the merged Supabase Auth/PostgreSQL migration and login/signup implementation; his evidence note records a local-preview signup-page check and sign-in to the dashboard. He explicitly does not claim live Supabase testing. | [PR #41](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/41); [Nabin’s evidence note](../../Evidence.md) |
| Sumit Adhkari | `adronnie` | |[Database Model Check](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/c54be0c511a773e5018af2f89e07299d7a20b887/docs/week9/database-model-check-report.md), [Backend design](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/a37fa8da2e3d8d63ef2bccbb9178820696495032/docs/week9/backend-design.md) |
| Prabin Rai | `RaiPrabin697` |Prepared the Week 9 QA Evidence Matrix and Demo Roadmap, documenting test procedures, expected results, evidence requirements, and pending QA checks. |[Demo](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/9ec448b81e4d5f61c261c05652f7c6ab1520f7bd/docs/week9/FINAL_DEMO_ROADMAP.md), [Evidence Matrix](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/9ec448b81e4d5f61c261c05652f7c6ab1520f7bd/docs/week9/QA_EVIDENCE_MATRIX.md) |
| Prince Karki | `princekark` | | |
| J.N. Taj Oli | `jn-oli` | Authored the Week 9 login/signup UI design and mockup package. The design specifies field-level validation/error messages, a top-of-card alert, `aria-invalid`/`aria-describedby`, and password-rule indicators that update while typing. These are documented design behaviors; this report does not claim a fresh manual validation run unless separately recorded. | [Week 9 auth UI design](auth-ui-design.md), [weekly report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/e0dff121ac2d0ce117b8eec1f3e92a0aa535aa75/docs/week9/weekly-report.md), “Owner validation check.” |

## Blockers, risks, and open verification

| Item | Evidence/status | Follow-up |
|---|---|---|
| Live auth and RLS validation | Not tested with live Supabase credentials in the Week 9 test report. | Run and document the proposed account, profile, task-persistence, and two-user isolation cases using test accounts. Never include credentials. |
| Fresh local browser smoke test | Not run in the test report because the local server could not bind. | Rerun when a local server can start; record tester, date, expected/actual results, pass/fail, and screenshots. |
| Subject/task persistence mismatch | Upgrade plan reports ten frontend course options versus five seeded subjects and a possible in-memory fallback for unmatched subjects. | Reconcile catalogs and test task creation/reload for every selectable course; show errors rather than false success if cloud writes fail. |
| Quiz recording and answer visibility | Upgrade plan identifies quiz questions without database IDs in the active flow; database review flags `correct_answer` exposure to authenticated clients. | Verify question/response persistence. Record the team’s MVP decision on whether answer exposure is knowingly accepted for the demo; stronger production follow-up is to keep answer keys off the client and score through trusted server-side logic. No team decision is claimed here. |
| Migration setup instructions | README setup steps list migrations 001–006, while the upgrade plan says migration 007 exists. | Confirm the migration file and required sequence, update setup instructions, and verify on a clean Supabase project. |

## Architecture and documentation alignment

The current documented implementation uses Supabase Auth for identity, a `profiles` table linked to `auth.users`, PostgreSQL for application data, and RLS for access control. Older Week 8 materials proposing a generic `/api/auth/*` service, custom user/session tables, or a no-login/localStorage model should be labeled historical proposals, not descriptions of the current implementation. In particular, [the older database design](../week8/database_login%20%26%20signup.md) proposes custom `users`, `user_sessions`, and `password_reset_tokens` tables that are not the current documented model.

The Week 9 UI design is a mockup/design artifact, the database review and upgrade plan are repository/code reviews, and the automated test report limits what its checks prove. Keep those evidence types distinct. The README’s test section describes expected output; use the dated test report as the current-window run receipt and do not describe the README block itself as a fresh run.

## Team decisions and next actions

| Decision / reporting rule | Rationale | Evidence |
|---|---|---|
| Describe Supabase Auth and PostgreSQL as the current architecture; label older localStorage/no-auth and generic custom-auth designs as historical proposals. | The merged implementation and current README describe the Supabase direction. | [PR #41](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/41); [README](../../README.md); [Week 8 database proposal](../week8/database_login%20%26%20signup.md) |
| Report automated, local-preview, browser smoke, and live Supabase checks separately. | They have different evidence and the Week 9 test report records browser/live gaps. | [Week 9 test report](TEST_REPORT_2026-11-03.md) |
| Treat upgrade-plan acceptance criteria as pending until their tests/evidence are recorded. | The plan is proposed future work; its checklist remains unchecked. | [Next-week upgrade plan](NEXT_WEEK_UPGRADE_PLAN.md) |
| Quiz-answer exposure decision is pending team confirmation. | The database review establishes that authenticated users can read `correct_answer`; no accepted-risk decision is documented in the reviewed materials. | [Database-model review](database-model-check-report.md) |

### Proposed next steps (not completed in this report)

- Run one repeatable live Supabase end-to-end check with a fresh test account: sign up/sign in, create a task, reload and confirm persistence, then verify a second account cannot read the first account’s data. Record live-vs-code-inspection scope, date, tester, expected/actual results, and safe evidence; do not include credentials.
- Rerun browser smoke tests and capture dated screenshots when the local server is available.
- Resolve the course catalog/task persistence and quiz question/response findings in the upgrade plan.
- Have the team decide and document whether quiz-answer exposure is accepted for the MVP demo or whether to move scoring server-side.
- Confirm migration 007 and the full migration sequence; correct setup instructions and verify on a clean Supabase project.
- Have Sumit, Prabin, and Prince confirm their Week 9 contributions and attach evidence. J.N. Taj Oli should record whether the documented validation/error states were personally checked, with date/results, if claiming a completed check.


## Week 9 evidence scope

This report separates implementation history, source review, automated checks, local-preview observations, and live-service testing. A passing check in one category must not be presented as proof for another category. RaiPrabin697’s contribution in this update is documentation work; it is not a claim of a fresh application test.


## RaiPrabin697 personal Week 9 record

**Updated:** 2026-11-04  
**Contribution type:** Documentation authored in this branch. This entry does not claim implementation or a fresh application test.

| Contribution | Evidence | Test status / next action |
|---|---|---|
| Prepared the Week 9 QA evidence matrix and final-demo roadmap, including reproducible steps, evidence boundaries, privacy-safe proof guidance, and fallback criteria. | [QA Evidence Matrix](QA_EVIDENCE_MATRIX.md); [Final Demo Roadmap](FINAL_DEMO_ROADMAP.md); [documentation PR branch](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/docs/week9-rai-evidence/docs/week9) | **Not run by RaiPrabin697 in this update:** fresh-account signup/sign-in, subject/task creation with reload, and second-account isolation. Next action is to execute these checks in an approved test environment and append date, tester, expected/actual result, and safe proof. Live Supabase/RLS remains unverified by the existing report. |

No credentials or private account values are included in this record. Existing team-member contribution rows above are unchanged.


## RaiPrabin697 PR and documentation audit

**PR:** [#42 — Week 9 personal evidence and demo roadmap](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/42) (open; unmerged).

The branch update records RaiPrabin697’s documentation contribution only. The QA matrix and demo roadmap are linked above; the fresh signup/sign-in, task-reload, and two-account isolation cases remain **Not run** by RaiPrabin697 in this update.

### Documentation audit

- The PR file list was checked: all changed paths are under `docs/`; root README, application code, tests, and issue records are unchanged.
- The new Week 9 matrix, roadmap, report, ledger, documentation hub, roadmap index, and status-page links were checked against existing branch paths. The four issue links in the QA matrix resolve to existing issues; those issues were not edited.
- No external account credentials or private test-account data were added.
- No live Supabase or browser-test completion is claimed.
