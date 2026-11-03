# Week 9 Team Report

**Team:** 5 — Smart Study Companion  
**Week:** 9  
**Report date:** 2026-11-03

## Team goal and summary

This week’s documented work advanced the project from the earlier browser-local prototype and auth proposals toward the Supabase-backed application, and brought together the login/signup UI design, database review, testing record, and upgrade plan. The merged implementation is tracked in PR #41. Week 9 documentation records the UI proposal and mockups, a database-model review, automated test results, and follow-up work identified from code review.

This report summarizes repository evidence; it does not imply that every team member completed every listed activity. Individual attribution is limited to evidence available in the linked records. Work without Week 9 evidence is marked as not recorded here rather than assumed complete.

## Documented Week 9 deliverables

| Deliverable | Evidence and status |
|---|---|
| Supabase Auth and PostgreSQL implementation | PR #41 is merged. The root README describes Supabase Auth, PostgreSQL, and RLS as the current architecture. |
| Login/signup UI proposal and mockups | Week 9 design document identifies J.N. Taj Oli as owner and describes the mockups as UI references. The proposal itself says the mockups do not create real accounts. |
| Database-model review | The review describes the implemented schema and RLS, and flags quiz-answer exposure and documentation drift as items needing attention. It is a repository review, not proof of a live database test. |
| Automated test report | The dated report records `npm test` (12 tests), the Python checks (6 groups), and `npm run build` as passing on its local working snapshot. See the report for scope and limitations. |
| Upgrade plan | The plan records code-review findings and proposed follow-up work; its checklist items are plans, not completed features or tests. |

## Evidence links

| Evidence type | Link | What it supports / limitation |
|---|---|---|
| Pull request | [PR #41 — Supabase Auth and PostgreSQL migration](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/41) | Merged implementation history; does not by itself prove live service testing. |
| Current architecture | [Project README](../../README.md) | Documents the Supabase Auth/PostgreSQL direction and setup instructions. |
| Auth UI | [Week 9 auth UI design](auth-ui-design.md); [login page](../../public/auth/login.html); [signup page](../../public/auth/signup.html) | UI design, mockups, and current page source; mockups are not live-auth test evidence. |
| Testing | [Week 9 test report](TEST_REPORT_2026-11-03.md); [test documentation](../tests/README.md) | Automated results, manual-test boundaries, and evidence checklist. |
| Database and follow-up | [Database-model review](database-model-check-report.md); [upgrade plan](NEXT_WEEK_UPGRADE_PLAN.md) | Code/schema review findings and proposed next work. |
| Local preview evidence | [Nabin Khadka’s evidence note](../../Evidence.md) | Records a local signup-page check and local-preview sign-in to the dashboard by Nabin; explicitly not a live Supabase test. |
| Prior-week context | [Week 8 auth feature design](../week8/LoginIn_signup_Features.md); [Week 8 weekly report](../week8/weekly-report.md) | Earlier design proposal and a Week 8 record that says its fresh app test was not run. |

## Testing status — keep environments distinct

| Test category | Recorded result | What it does not establish |
|---|---|---|
| Automated checks | The 2026-11-03 test report records `npm test` PASS (3 files, 12 tests), `python3 tests/run_tests.py` PASS (6 check groups), and `npm run build` PASS. | The report says the unit tests use test-local helper logic; Python checks inspect files/SQL text rather than executing migrations against PostgreSQL/Supabase. The tested checkout was a modified local snapshot. |
| Local browser preview | Nabin’s evidence note records opening signup and login in the local preview and signing in through the local-preview flow to the dashboard. | This is local-preview evidence only, not a fresh browser smoke test for the separate 2026-11-03 test report and not proof of real account creation or cloud persistence. |
| Fresh browser smoke / end-to-end | The 2026-11-03 report marks its browser smoke test NOT RUN because Vite could not bind to localhost (`listen EPERM`); it also says no Playwright run was performed. | No fresh visual or interactive result is claimed by that test report. |
| Live Supabase | No live credentials were used for the reported checks. | Signup, email verification, RLS behavior, two-user isolation, and cloud persistence remain unverified in that report. |

## Individual contribution evidence

Entries below are based on the available repository records. “Not recorded” means this report did not find sufficient Week 9 evidence to describe a contribution; it is not a claim that the person did no work. Members should add or correct their own row with an evidence link if needed.

| Student | GitHub login | Week 9 contribution supported by available evidence | Evidence |
|---|---|---|---|
| Nabin Khadka | `liftupkhadka555-spec` | Authored the merged Supabase Auth/PostgreSQL migration and login/signup implementation in PR #41; the evidence note also records his local-preview signup/login checks. | [PR #41](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/41); [Nabin’s evidence note](../../Evidence.md) |
| Sumit Adhkari | `adronnie` | | |
| Prabin Rai | `RaiPrabin697` | | |
| Prince Karki | `princekark` | | |
| J.N. Taj Oli | `jn-oli` | Authored the Week 9 login/signup UI design and mockup package, which identifies J.N. as owner. | [Week 9 auth UI design](auth-ui-design.md); [Weekly report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/8810a615f2470e3f87838261528869e637fcbc1f/docs/week9/weekly-report.md) |

## Blockers, risks, and open verification

| Item | Evidence/status | Follow-up |
|---|---|---|
| Live auth and RLS validation | Not tested with live Supabase credentials in the Week 9 test report. | Run and document the proposed account, profile, and two-user isolation cases using test accounts. |
| Fresh local browser smoke test | Not run in the test report because the local server could not bind. | Rerun when a local server can start; record tester, date, expected/actual results, and screenshots. |
| Subject/task persistence mismatch | Upgrade plan reports ten frontend course options versus five seeded subjects and a possible in-memory fallback for unmatched subjects. | Reconcile catalogs and test create/refresh behavior before claiming persistence. |
| Quiz recording and answer visibility | Upgrade plan identifies quiz questions without database IDs in the active flow; database review flags `correct_answer` exposure. | Verify question/response persistence and review answer-key protection. |
| Migration setup instructions | Upgrade plan says migration 007 exists but README lists migrations 001–006. | Update setup instructions and verify the full migration sequence on a clean project. |
| Member attribution gaps | Week 9 evidence was not found for Prabin Rai and Prince Karki in the reviewed materials. | Ask those members to add their own accurate Week 9 description and evidence link. |

## Architecture and documentation alignment

Older Week 8 materials include proposals for a generic `/api/auth/*` service, custom authentication/session storage, and earlier no-login/localStorage planning. These are historical proposals, not the current implementation description. The root README and merged PR #41 describe the current direction as Supabase Auth for identity and Supabase PostgreSQL for application data, with profiles linked to `auth.users` and RLS policies for access control. The local-preview flow is a separate prototype path and must not be presented as live Supabase authentication.

The Week 9 UI design is a design/mockup artifact. The database review and upgrade plan are repository/code reviews, and the automated test report explicitly limits what its checks prove. Keep those evidence types separate in future reports.

## Team decisions and next actions

| Decision / agreed reporting rule | Rationale | Evidence |
|---|---|---|
| Describe Supabase Auth and PostgreSQL as the current architecture; label older localStorage/no-auth and generic API designs as historical proposals. | The merged implementation and current README supersede earlier proposals. | [PR #41](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/41); [README](../../README.md); [Week 8 design](../week8/LoginIn_signup_Features.md) |
| Report automated, local-preview, browser smoke, and live Supabase checks separately. | They have different evidence and the Week 9 test report records browser/live gaps. | [Week 9 test report](TEST_REPORT_2026-11-03.md); [Nabin’s local evidence](../../Evidence.md) |
| Treat upgrade-plan acceptance criteria as pending until their tests/evidence are recorded. | The plan is explicitly proposed future work and its checklist remains unchecked. | [Next-week upgrade plan](NEXT_WEEK_UPGRADE_PLAN.md) |

### Proposed next steps (not completed in this report)

- Rerun browser smoke tests and capture dated screenshots when the local server is available.
- Perform live Supabase auth, profile, RLS, and data-isolation tests with test accounts.
- Resolve the course catalog/task persistence and quiz question/response findings in the upgrade plan.
- Correct setup instructions to include migration 007, then verify the migrations on a clean Supabase project.
- Have each team member confirm their Week 9 contribution and attach evidence before filling any currently unrecorded row.
