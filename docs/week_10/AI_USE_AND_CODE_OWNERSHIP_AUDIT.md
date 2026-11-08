# AI Use and Code Ownership Audit — Team 5 Smart Study Companion

**Team:** 5 — Smart Study Companion  
**Prepared:** November 8, 2026 (repository review)  
**Course week:** Week 10, November 5–11, 2026; Sprint 2  
**Status:** IN PROGRESS — repository/source map prepared; member explanations, AI-use declarations, role acceptance, and the planned independent database and end-to-end checks remain pending.

This audit adapts the supplied AI-use and code-ownership format to Team 5’s repository. It uses repository files, issues, pull request history, and the Week 10 records as evidence. It does not claim that a student accepted a role, explained code, or ran a test unless the linked evidence says so. The audit was drafted with AI assistance; see the disclosure section below. No code or database changes are part of this audit.

Team planning and current evidence:
- [Week 10 Slice and Stewardship Plan](Slice.md)
- [Week 10 shared report](weekly-report.md)
- [Week 10 Supabase Verification Report](SUPABASE_VERIFICATION_REPORT.md)
- [Week 10 Full-Stack Changes Model](FULL_STACK_CHANGES_MODEL.md)
- [Issue #48 — Study Analytics, University Hierarchy, Subject Onboarding, Auth](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48)
- [Merged PR #46](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/46)

The Week 10 assignment says each student should explain their slice and another teammate should independently check it. The team’s `Slice.md` keeps the save/read, blank-title, unauthorized-access, automated task, and authentication scenarios marked Pending. Preparation and code inspection do not complete those checks.

## Codebase area map

The areas below are taken from the Team 5 Week 10 plan and current repository paths. Proposed roles reflect the plan; role acceptance and backup acceptance are not recorded in the reviewed Week 10 report. Stewardship means maintaining documentation, tests, and handoffs—not exclusive ownership of files.

| Area | Actual repository boundary / responsibility | Planned owner and basis | Planned backup / learning partner | Repeatable health or review check | Evidence and limits |
|---|---|---|---|---|---|
| Supabase schema, persistence, and data security | [`supabase/migrations/`](../../supabase/migrations/), especially `003_tasks.sql` and `006_rls_policies.sql`; task service [`public/src/services/tasks.js`](../../public/src/services/tasks.js) | Sumit Adhikari (`adronnie`), Slice 1 in [`Slice.md`](Slice.md). Acceptance not recorded in the Week 10 member table. | Nabin Khadka (`liftupkhadka555-spec`) is the planned review/handoff partner in `Slice.md`; confirmation pending. | Apply/review migrations in a test project; create/read task; check invalid title and two-user read/update/delete isolation; record expected and observed results. | Migration code and the task service exist. Week 10 Slice and report mark cloud save/read and RLS verification Pending. No live database result is established here. |
| Automated functional and regression tests | [`tests/`](../../tests/), [`tests/unit/`](../../tests/unit/), [`package.json`](../../package.json), [`vitest.config.js`](../../vitest.config.js) | Prabin Rai (`RaiPrabin697`), Slice 2 in `Slice.md`. Acceptance not recorded in the Week 10 member table. | Prince Karki (`princekark`) is the planned peer check in the team plan; confirmation pending. | Run `npm test` and `python3 tests/run_tests.py`; add a real task-flow integration test for valid input, blank title, and reload persistence. | Tests and scripts are present. Existing unit tests exercise helper calculations/validation, and the Python suite checks source/schema text; they do not prove live Supabase writes or RLS isolation. The Week 10 issue reports 7/7 groups, but this audit did not execute them. |
| Authentication and end-to-end session behavior | [`public/auth/`](../../public/auth/), [`public/src/services/auth.js`](../../public/src/services/auth.js), [`public/src/lib/supabase.js`](../../public/src/lib/supabase.js) | Prince Karki (`princekark`), Slice 3 in `Slice.md`. Acceptance not recorded in the Week 10 member table. | Nabin Khadka is the planned implementation handoff; acceptance pending. | With a configured test project, verify valid/invalid login, email verification, session restore after refresh, recovery, logout, and protected page behavior; label local demo checks separately. | Source contains Supabase Auth and local-preview branches. [`Evidence.md`](../../Evidence.md) records local-preview page checks only, not a live Supabase auth test. Week 10 auth E2E verification remains unchecked. |
| UI/UX, responsiveness, and accessibility | [`public/index.html`](../../public/index.html), [`public/styles.css`](../../public/styles.css), [`public/app.js`](../../public/app.js) | J.N. Taj Oli (`jn-oli`), Slice 4 in `Slice.md`. Acceptance not recorded in the Week 10 member table. | Nabin is the planned frontend integration partner; acceptance pending. | Test all five views at desktop/mobile sizes, keyboard access, readable controls, and light/dark theme behavior; record viewport, browser, and result. | Week 10 analytics and subjects screenshots are present. They support visual evidence of views, not all responsive/accessibility behaviors. Week 10 report leaves this verification task unchecked. |
| Frontend/backend integration, onboarding, analytics, and authentication feature implementation | [`public/app.js`](../../public/app.js), [`public/auth/auth-init.js`](../../public/auth/auth-init.js), [`src/services/`](../../src/services/), [`src/lib/`](../../src/lib/), and matching static-site modules under `public/src/` | Nabin Khadka (`liftupkhadka555-spec`), Slice 5 and Week 10 feature work. His personal evidence is in [`Evidence.md`](../../Evidence.md) and the contribution ledger. | Sumit for data access and Prince for authentication checks are proposed partners in `Slice.md`; acceptance pending. | Trace form → service → database and back; check returned errors; verify correct current user; have a teammate reproduce a successful and failing path. | Issue #48 identifies Nabin as owner; PR #46 is merged. This supports implementation authorship/history, not proof that each cloud behavior succeeds. Static review found request-shape mismatches documented below. |
| Build, deployment, and handoff | [`package.json`](../../package.json), [`vite.config.js`](../../vite.config.js), [`public/`](../../public/), GitHub Pages Actions | Shared area; no separate Week 10 steward acceptance found in the reviewed report. | Team handoff partner to be named and confirmed. | Check the current deployment workflow, open published pages, verify browser assets and configuration, and record a new dated test. | [Pages deployment run](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/actions/runs/42372842865) completed successfully for the reviewed commit. This proves workflow success, not interactive app behavior or Supabase connectivity. |

## Individual slice and stewardship record

The slices below reflect the Team 5 plan and available evidence. The Week 10 contribution table has a populated Nabin row and blank rows for the other four members. Those blank rows are not proof that a member did no work; they mean this audit cannot attribute Week 10 work or confirm an explanation on their behalf.

| Student | Planned roadmap slice / source entry point | Planned area and backup | Explanation and role status | Check and evidence | Next owned step |
|---|---|---|---|---|---|
| **Nabin Khadka** (`liftupkhadka555-spec`) | Slice 5: full-stack auth integration. Week 10 implementation includes analytics, academic hierarchy, onboarding, and auth updates. Entry points: [`public/app.js`](../../public/app.js), [`public/auth/auth-init.js`](../../public/auth/auth-init.js), [`src/services/`](../../src/services/). | Frontend/backend integration; planned review with Sumit and Prince. | Issue #48 and the Week 10 report identify Nabin’s implementation work. His code explanation and a fresh independent peer check are not documented by this audit. | Merged [PR #46](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/46); [analytics screenshot](study-analytics-dashboard.png); [subjects/university screenshot](subjects-university-selector.png). Live Supabase behavior remains unverified. | Explain the app-to-service contracts, fix or document the request-shape mismatches, and have a teammate verify task/auth flows with actual expected/observed results. |
| **Sumit Adhikari** (`adronnie`) | Slice 1: save and retrieve a student task; inspect schema and student-level access. Entry points: [`supabase/migrations/003_tasks.sql`](../../supabase/migrations/003_tasks.sql), [`supabase/migrations/006_rls_policies.sql`](../../supabase/migrations/006_rls_policies.sql), [`public/src/services/tasks.js`](../../public/src/services/tasks.js). | Database and Supabase integration; Nabin is the planned handoff/review partner. | Planned in `Slice.md`; Week 10 report’s contribution row is blank. Acceptance and code explain-back are **PENDING**. | The plan’s valid-task, missing-title, and unauthorized access cases are all marked Pending. No live save/read or cross-student result is claimed. | Record the schema and RLS inspection, run the three test cases in an approved test project, and add own evidence/AI-use statement to the team record. |
| **Prabin Rai** (`RaiPrabin697`) | Slice 2: automate a task or quiz flow. Entry point: [`tests/unit/tasks.test.js`](../../tests/unit/tasks.test.js), `tests/run_tests.py`, and the actual service integration to be added/verified. | Functional and regression testing; Prince is planned peer verifier. | Planned in `Slice.md`; Week 10 report’s contribution row is blank. Acceptance and explain-back are **PENDING**. | The visible Vitest task tests use local helper functions for metrics/filtering; they do not import the task service. The Python suite checks code/schema assertions, not a live database. No new functional task test execution is evidenced here. | Add/execute a repeatable service-level or browser test for insert, title rejection, and read after refresh; record the exact command, runtime, result, and limits. |
| **Prince Karki** (`princekark`) | Slice 3: verify login, logout, and session restoration. Entry point: [`public/auth/auth-init.js`](../../public/auth/auth-init.js), [`public/src/services/auth.js`](../../public/src/services/auth.js), and `public/app.js`. | Auth and E2E testing; Nabin is planned implementation handoff and Prabin the planned test partner. | Planned in `Slice.md`; Week 10 report’s contribution row is blank. Acceptance and explain-back are **PENDING**. | Week 10 report leaves auth/E2E verification unchecked. Earlier local-preview evidence is not live Supabase authentication evidence. | Test real Supabase authentication in a test project and record valid/invalid login, refresh, recovery, and logout outcomes without exposing credentials. |
| **J.N. Taj Oli** (`jn-oli`) | Slice 4: responsive dashboard, navigation, and theme verification. Entry point: [`public/index.html`](../../public/index.html), [`public/styles.css`](../../public/styles.css), [`public/app.js`](../../public/app.js). | UI/UX, frontend styling, and accessibility; Nabin is the planned integration partner. | Planned in `Slice.md`; Week 10 report’s contribution row is blank. Acceptance and explain-back are **PENDING**. | Week 10 screenshots show analytics and onboarding UI. The report leaves responsive/theme verification unchecked; screenshots alone do not prove mobile or accessibility behavior. | Record browser and viewport checks, keyboard/theme results, and remaining UI issues; add own contribution and AI-use declaration. |

## Source explanation prepared for the task persistence slice

This is a source trace prepared from the repository, not a student explain-back and not proof of a successful run. The planned database steward and an independent reviewer should confirm or correct it.

**Intended request:** A signed-in student enters a subject, title, and deadline in the quick task form or task modal. The UI trims the title and checks required fields, finds a subject ID, then calls `apiCreateTask` in `public/app.js`.

**Current service contract:** `public/src/services/tasks.js` expects `task.student_id`, `task.subject_id`, `task.title`, and `task.deadline`. When configured, it sends those values to `tasks`; otherwise it stores a local task in browser localStorage.

**Static mismatch found:** Both task-create call sites in `public/app.js` pass `studentId` and `subjectId`, while the service reads `student_id` and `subject_id`. Unless the service interface is reconciled, the required student and subject values can be undefined. The database requires both fields, so a cloud insert is likely to fail. The same issue means a local-mode task object may lack those IDs. The task edit handler passes `subjectId`, while the database field is `subject_id`.

**Read path:** After session lookup, `loadUserData()` calls `getTasks(currentUser.id)`. The cloud query filters by `student_id`, orders by deadline, and joins the subject record. If the client is unconfigured, it reads a shared task localStorage key instead. A displayed task is not proof of cloud persistence; check the database row and confirm which client mode is active.

**Specific teammate explain-back question:** “What exact object does `createTask()` receive from each UI form, which fields does the service insert, and how would you prove the returned task belongs to the current authenticated student rather than only to an ID supplied by the browser?” The answer, reviewer name, and observed test result are **PENDING**.

### Expected and actual evidence

| Check / type | Expected result | Actual result / evidence | Limit |
|---|---|---|---|
| Static source trace — this audit | Identify form, service, database fields, ownership checks, and fallback path. | Source paths and field names inspected in `public/app.js`, `public/src/services/tasks.js`, migrations `003_tasks.sql` and `006_rls_policies.sql`. | Static inspection only; no app or SQL operation run. |
| Week 10 implementation history | Feature work merged into `main` and Pages build completes. | PR #46 is merged; the Pages deployment run for commit `43baf49544f96900312bc9542fb4b718536daa51` reports success. | Merge/build status does not establish app runtime, cloud connection, task save, or RLS behavior. |
| Week 10 planned task/RLS scenarios | Valid save/read; reject blank title; deny another student’s access. | `Slice.md` lists all three as Pending; Week 10 report leaves database save/read and RLS unchecked. | No scenario is marked Pass by this audit. |
| Existing automated suite | Verify a real database task path and isolation. | Week 10 report/Issue #48 state the Python suite passed 7/7 check groups. The suite source checks file/schema text and sample logic. | This audit did not run the suite; those assertions do not execute Supabase requests or migrations. |
| Published app | Pages responds and interactive functionality works. | Pages workflow succeeded; app URLs are documented in the Week 10 report. | No interactive browser session or HTTP-level availability test was performed here. |

## AI-use disclosure

This is a partial, evidence-based record—not a retrospective inventory of every AI tool used by every teammate. An absent declaration does not mean that no AI was used. Each member should add their own disclosure and explain their own contribution; this document does not speak for them.

| Change / person | Known AI use from reviewed evidence | What is supported | Human confirmation / limit |
|---|---|---|---|
| This audit document | Yes — AI assistance was used to inspect linked repository evidence and draft this report using the format supplied in the conversation. | The document records source paths, planned roles, documented test status, static findings, and explicit unknowns. | Team members should review, correct, and own the final explanations. This report is not evidence that a student understands code merely because it describes it. |
| Nabin Khadka / Week 10 implementation | No complete AI-use declaration was found in the reviewed Week 10 report, Issue #48, or `Evidence.md`. | Issue #48 and merged PR #46 attribute implementation work to Nabin. | AI-use history and student explain-back are unknown here; ask Nabin to document them rather than infer either use or non-use. |
| Sumit Adhikari | No Week 10 AI-use declaration found in the reviewed member row. | Slice 1 is assigned to Sumit in the team plan; the Week 10 contribution row is blank. | Work, AI use, role acceptance, and checks need Sumit’s own statement/evidence. |
| Prabin Rai | No Week 10 AI-use declaration found in the reviewed member row. | Slice 2 is assigned to Prabin in the team plan; the Week 10 contribution row is blank. | Work, AI use, role acceptance, and checks need Prabin’s own statement/evidence. |
| Prince Karki | No Week 10 AI-use declaration found in the reviewed member row. | Slice 3 is assigned to Prince in the team plan; the Week 10 contribution row is blank. | Work, AI use, role acceptance, and checks need Prince’s own statement/evidence. |
| J.N. Taj Oli | No Week 10 AI-use declaration found in the reviewed member row. | Slice 4 is assigned to J.N. Taj Oli in the team plan; the Week 10 contribution row is blank. | Work, AI use, role acceptance, and checks need J.N. Taj Oli’s own statement/evidence. |

## Gaps, owners, and next checks

| Gap / location | Planned owner / next person to confirm | Next check / evidence | Status |
|---|---|---|---|
| Member role acceptance and personal contribution records | Each member; keep the Week 10 report’s own-row instruction | Each member fills their own report row with issue/PR/commit/test links and accepts or revises the planned slice. | Pending; four Week 10 member rows are blank. |
| Task create/update request contract | Nabin (integration) and Sumit (database review), subject to their confirmation | Align caller/service fields; test cloud and local paths; capture returned data and any error. | Static mismatch found; fix and test not evidenced here. |
| Cloud task save/read and refresh persistence | Sumit planned Slice 1; Prabin planned Slice 2 | Run in a test Supabase project; inspect the task row; refresh/sign back in; record observed result. | Pending in `Slice.md` and Week 10 report. |
| Blank-title validation | Prabin planned test owner; Nabin integration support | Try empty and whitespace-only title in the UI and at the service/database boundary; verify no row is created. | UI trims/checks title in code; actual test not verified here. |
| Cross-student RLS isolation | Sumit planned database owner; independent partner to be named | Use two test accounts; check select/update/delete denial for the other student’s task. | Pending; live policies not inspected. |
| Quiz save payload contract and response persistence | Nabin planned integration owner; database/test reviewer to be confirmed | Align the caller’s camelCase payload with `saveQuizAttempt()`’s snake_case contract and required `mode`; test attempt and response rows. | Static mismatch found; no live quiz insert verified. |
| Subject catalog/enrollment writes and RLS | Sumit planned database review; Nabin planned frontend/service integration | Decide whether subjects are read-only shared catalog; align policies and upsert behavior; surface every returned error. | Static policy/service concern; live database state unknown. |
| Analytics metric accuracy | Nabin planned feature owner; J.N. Taj Oli planned UI review | Compare chart labels and aggregation with intended behavior; code currently groups tasks using `deadline` while the UI text describes tasks completed per day. | Static discrepancy found; no separate metric verification recorded. |
| Supabase configuration on GitHub Pages | Nabin planned integration support; deployment configuration owner to be confirmed | Confirm how browser values are injected without exposing service-role credentials; check browser console and network request against the expected project. | Not verified; Pages workflow success alone is insufficient. |
| Independent peer checks | Pairings in `Slice.md`; individuals must accept | Name reviewer, record the exact command/actions, expected and actual output, date, and any limits in an issue/report. | Pending in reviewed Week 10 records. |

If a check fails, record the observed failure and next step. Do not mark a feature or ownership slice complete based only on the source trace, a screenshot, a green deployment workflow, or a planning checklist.

## Evidence index

- [Week 10 Slice and Stewardship Plan](Slice.md)
- [Week 10 shared report](weekly-report.md)
- [Supabase and Live App Verification Report](SUPABASE_VERIFICATION_REPORT.md)
- [Full-Stack Changes Model](FULL_STACK_CHANGES_MODEL.md)
- [Study analytics screenshot](study-analytics-dashboard.png)
- [Subjects and university selector screenshot](subjects-university-selector.png)
- [Personal evidence record](../../Evidence.md)
- [Contribution ledger](../CONTRIBUTION_LEDGER.md)
- [Merged PR #46](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/46)
- [Issue #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48)
- [GitHub Pages deployment run](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/actions/runs/42372842865)

**Audit boundary:** This is a separate Week 10 ownership/AI-use audit based on repository evidence and static code review. It does not certify live Supabase operation, attribute unrecorded work, or claim student confirmations. Update it only with dated, attributable evidence and each member’s own confirmation.
