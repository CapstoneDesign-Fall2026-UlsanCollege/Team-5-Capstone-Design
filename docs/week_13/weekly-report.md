# Weekly Report

**Team:** Team 5 — Smart Study Companion  
**Week:** 13  
**Date:** November 26, 2026  
**Repository:** [Team-5-Capstone-Design](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design)  
**Feature Branch:** `feature/manual-time-schedule-and-improvements` (branched from `main` @ `e817132`)  
**MVP Core Gate (`main`):** **NO-GO — Pending Live Security and Release Verification** (preserved unchanged from Week 12)  
**Week 13 Feature Branch Status:** Implemented & locally verified; **live Supabase migrations (`014`, `015`) & live 2-account E2E remain `NOT RUN` pending PR review and live DB deploy**

---

## 1. This Week's Goal

Following the Week 12 bridge plan, Week 13 focused on delivering requested post-MVP usability and personalized planning enhancements on an isolated feature branch (`feature/manual-time-schedule-and-improvements`) while keeping `main` untouched until team review and live release gates complete:

1. Protect students against accidental subject deselection with an accessible confirmation dialog and Supabase rollback safety.
2. Reorder sidebar navigation so **Study Tasks** sits first and **Time Schedule** sits between **Quiz Practice & Results** and **AI Tutor**.
3. Support optional multiline **Task Description / Details** (up to 1,000 characters) across forms, task cards, search, and Supabase schema (`014`).
4. Deliver a manual **Time Schedule & Study Planner** (`015`) with Daily & Weekly views, overview stats, recurring schedules, overlap conflict warnings, single-occurrence vs full-series actions, completion/undo, and full responsive Light/Dark support.

---

## 2. Work Completed

### Feature 1 — Subject Deselection Confirmation Dialog (`public/index.html`, `public/app.js`, `src/services/subjects.js`)
- Kept selecting unselected subject cards immediate (`aria-checked="true"`).
- Triggered accessible modal `#subject-remove-modal` (`Remove Subject?`) whenever clicking or pressing `Enter`/`Space` on an already-selected card, explaining clearly that existing study tasks, quiz history, and progress will not be deleted.
- Added keyboard `Escape` / backdrop / Close dismissal, `Tab`/`Shift+Tab` focus trapping, focus return to the re-rendered card, double-click prevention (`Removing...`), Supabase synchronization via `saveStudentSubjects`, and automatic selection rollback with an error toast on save failure.

### Feature 2 — Reordered Sidebar Navigation (`public/index.html`, `public/app.js`)
- Reordered `.side-nav` identically for desktop and mobile drawer:
  1. `Study Tasks` (`#tasks`)
  2. `Dashboard` (`#dashboard` — preserved as default post-login route)
  3. `Subjects & University` (`#subjects`)
  4. `Study Analytics` (`#analytics`)
  5. `Quiz Practice & Results` (`#quiz`)
  6. `Time Schedule` (`#schedule`)
  7. `AI Tutor` (`#ai-tutor`)

### Feature 3 — Optional Task Description / Details (`014_task_description.sql`, `src/services/tasks.js`, `public/index.html`, `public/app.js`)
- Added optional multiline `<textarea>` labeled `Task Description / Details` (`maxlength="1000"`, placeholder, live `0 / 1000` counter) to both `#task-form` and Quick Add `#create-task-form`.
- Safely rendered escaped multiline notes inside `.task-copy` with a `Show more` / `Show less` clamp toggle on long entries, full search matching, editing/clearing support, and missing-column backward compatibility.

### Feature 4 — Manual Time Schedule & Study Planner (`015_time_schedules.sql`, `src/lib/time-schedule.js`, `src/services/schedules.js`, `src/time-schedule-ui.js`, `public/time-schedule.css`)
- Built Daily Summary metrics (`Today's Activities`, `Planned Study Time Today`, `Completed Today`, `Upcoming Session`), **Daily View** (chronological timeline + current/upcoming highlight), **Weekly View** (Mon–Sun desktop grid + prev/next week + `Today` button + mobile stacked layout), and encouraging empty state (`Your schedule is empty` + `Add Schedule` button).
- Implemented manual creation/editing across all 8 required activity types (`Study Session`, `Assignment`, `Exam Preparation`, `Quiz Practice`, `Revision`, `Break`, `Personal Activity`, `Other`) and 4 repeat modes (`Does not repeat`, `Every day`, `Every week`, `Selected weekdays` + optional repeat end date).
- Added overlap conflict detection (`#schedule-conflict-modal` letting the student adjust or save anyway without overwriting), completion/undo toggling, and recurring single-occurrence vs entire-series edit & delete flows (`study_schedule_exceptions`).

---

## 3. Database & Security Verification

- **Added SQL Migrations & Rollbacks (mirrored to `Backend/supabase/migrations/`):**
  - [`014_task_description.sql`](../../supabase/migrations/014_task_description.sql) / [`014_task_description_down.sql`](../../supabase/rollbacks/014_task_description_down.sql) — nullable `tasks.description`, `<= 1000` check constraint, inherits `tasks` per-student RLS.
  - [`015_time_schedules.sql`](../../supabase/migrations/015_time_schedules.sql) / [`015_time_schedules_down.sql`](../../supabase/rollbacks/015_time_schedules_down.sql) — `study_schedules`, `study_schedule_exceptions`, qualified `study_schedules.subject_id` enrollment validation via RLS & helper functions, historical subject preservation on updates, `end_time > start_time`, `updated_at` triggers, and `anon` revocation.
- **PGlite Local PostgreSQL WASM (`tests/db/time-schedule.db.test.js` + `ai-tutor.db.test.js`):** **7 / 7 PASS** covering idempotency, 2-student RLS isolation, unowned subject blocking, constraint enforcement, exception cascading, and clean rollbacks.
- **Live Cloud Supabase Application:** **NOT RUN** (migrations `009`, `010`, `012`, `013`, `014`, `015` and `DATA-01` 2-account live checks remain open on live Supabase).

---

## 4. Automated & Visual Testing Summary

| Check | Outcome | Scope / Notes |
|---|---|---|
| `npm run build` | **PASS** (`172ms`) | Multi-entry Vite production bundle |
| Mirror diff (`src` ↔ `public/src` ↔ `Backend`) | **PASS** (`0` diffs) | All frontend/backend mirrors synchronized |
| `npx vitest run` | **105 / 105 PASS** (`13` files) | Pure schedule engine, task validation, & service unit checks (mocked `supabase.js`) |
| `node --test tests/db/ai-tutor.db.test.js tests/db/time-schedule.db.test.js` | **7 / 7 PASS** | Real local Postgres WASM RLS, constraints, & rollbacks |
| `python3 tests/run_tests.py` & `tests/test_ai_quiz.py` | **11 / 11** + **4 / 4 PASS** | Project structure, schema, & AI quiz static checks |
| Playwright `Desktop Chrome` (`ui-regression-mocked.spec.js` + `improvements-schedule.spec.js`) | **10 / 10 PASS** | Non-cloud mocked Supabase routes across Desktop + 7 responsive viewports |
| Playwright `Mobile Chrome (Pixel 5)` (`improvements-schedule.spec.js`) | **4 / 4 PASS** | Mobile drawer nav, modals, Time Schedule Light/Dark overflow |
| Visual Before/After Evidence | **12 PNGs verified** | Saved in [`docs/time_schedule/Evidence/`](../time_schedule/Evidence/) |
| Live Credentialed Supabase E2E (`auth`, `onboarding`, `tasks`, `rls-isolation`) & Live `e2e_runner.py` HTTP probe | **NOT RUN** | Sandbox network blocked / awaiting team live deployment |

---

## 5. Week 13 Individual Contributions — One Row per Member

| Member | GitHub login | What they did in Week 13 | Evidence links | Verification status |
|---|---|---|---|---|
| **Nabin Khadka** | `liftupkhadka555-spec` | Designed and implemented all 4 Week 13 feature enhancements on branch `feature/manual-time-schedule-and-improvements`: custom Subject Removal Confirmation modal (`#subject-remove-modal`) with Supabase sync & error rollback; reordered sidebar navigation (`Study Tasks` first, `Time Schedule` between `Quiz Practice & Results` and `AI Tutor`); optional 1,000-char `Task Description / Details` (`014` SQL migration + rollback, UI forms, escaped multiline rendering & search); and manual `Time Schedule` planner (`015` SQL migration + rollback, pure recurrence/conflict engine `time-schedule.js`, service CRUD `schedules.js`, Daily/Weekly/mobile UI `time-schedule-ui.js`). Authored Vitest (`105/105`), PGlite PostgreSQL WASM (`7/7`), and mocked Playwright Desktop/Mobile suites (`14/14`), captured 12 before/after screenshots, and authored Week 13 + feature reports (`docs/week_13/`, `docs/time_schedule/`). | Branch `feature/manual-time-schedule-and-improvements` (`d7a80af`, `bb866c4`, `9eb04d5`); [Report](../time_schedule/IMPROVEMENTS_AND_TIME_SCHEDULE_REPORT.md); [Evidence](../time_schedule/Evidence/); [`014`](../../supabase/migrations/014_task_description.sql); [`015`](../../supabase/migrations/015_time_schedules.sql); [`time-schedule.db.test.js`](../../tests/db/time-schedule.db.test.js); [`improvements-schedule.spec.js`](../../tests/e2e/improvements-schedule.spec.js) | **Local tests & screenshots verified (`PASS`); PR review & live Supabase deploy pending** |
| **Sumit Adhikari** | `adronnie` | Database & RLS reviewer target for migrations `014` / `015` alongside pending live `009`/`010`/`012`/`013` application and live `DATA-01` execution. | [`docs/week_12/Sumit-Adhikari-Database-Security-Report.md`](../week_12/Sumit-Adhikari-Database-Security-Report.md) | **PENDING** |
| **Prabin Rai** | `RaiPrabin697` | Automation QA reviewer target for new Vitest, PGlite, and Playwright E2E regression suites (`improvements-schedule.spec.js`) and live credentialed E2E execution. | [`docs/week_12/Prabin-Rai-Automation-Repair-Report.md`](../week_12/Prabin-Rai-Automation-Repair-Report.md) | **PENDING** |
| **Prince Karki** | `princekark` | Independent QA verification target for live credentialed Task Descriptions, Subject Removal sync, and Time Schedule E2E flows. | [`docs/week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md`](../week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md) | **PENDING** |
| **J.N. Taj Oli** | `jn-oli` | UI/UX & responsive Dark/Light manual verification target for reordered navigation, confirmation/conflict modals, and Daily/Weekly mobile Time Schedule views. | [`docs/week_12/JN-Taj-Oli-Responsive-UI-Report.md`](../week_12/JN-Taj-Oli-Responsive-UI-Report.md) | **PENDING** |

---

## 6. Open Blockers, Risks & Bridge Tasks Before Merging to `main`

| Action Item | Owner | Current Status |
|---|---|---|
| Review & approve `feature/manual-time-schedule-and-improvements` PR without overwriting frozen `main` gates | Team 5 | **OPEN** |
| Apply migrations (`009`, `010`, `012`, `013`, `014`, `015`) in order on live Supabase after admin authorization | Nabin / Sumit | **NOT RUN** |
| Run live 2-account `DATA-01` RLS verification covering `tasks.description`, `study_schedules`, and `study_schedule_exceptions` | Sumit / Prince / Prabin | **NOT RUN** |
| Execute full credentialed Playwright live run (`24` core + Week 13 feature specs) + manual Desktop/Mobile Light/Dark spot-check | Prabin / Prince / J.N. Taj | **NOT RUN** |
| Update official course Vercel deployment & verify active commit SHA (`Issue #59`) + collect `5/5` sign-offs | Nabin / All Team 5 | **BLOCKED / PENDING** |
