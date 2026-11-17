# Study Analytics 2.0 — Feature Proposal (Streaks, Protection, Goals, Calendar, Badges)

**Status:** PROPOSED — implemented on a separate branch for review. **Not merged. Not deployed. Migration 011 not applied to any Supabase project.**
**Branch:** `feature/study-streak-analytics-upgrade` (from `main` @ `2390f2b`)
**Proposed by:** Nabin Khadka (`liftupkhadka555-spec`)
**Date:** November 17, 2026
**Scope note:** This is outside the Week 11 proposed MVP freeze ([`FEATURE_FREEZE_DECISION.md`](FEATURE_FREEZE_DECISION.md)). It must not merge into the frozen MVP without team approval (see §12).

---

## 1. Purpose and student benefit

Study Analytics today answers "how much of my workload is done?" It does not reward consistency. Study Analytics 2.0 adds a light-touch motivation layer: a daily study streak, optional streak protection, a personal daily goal, a calendar of days actually studied, achievement badges, and congratulations messages. Students get positive feedback for returning to study, with no pressure language and no penalty for taking a break.

## 2. What stays unchanged

All five existing analytics components (completion ring, Weekly Activity, Workload Breakdown, Subject-Wise Completion Progress, Quiz Performance), Dashboard, Study Tasks CRUD, search/filter, onboarding, quizzes, AI quiz, auth/session, light/dark theme, and the existing tables/RLS. **Weekly Activity still means *scheduled* tasks** (its code is untouched). The new calendar is a separate component showing *completed-on* dates.

## 3. Schema findings (inspected, not assumed)

| Question | Finding (from `supabase/migrations/003_tasks.sql`, `006_rls_policies.sql`) |
|---|---|
| `tasks.student_id` | Exists (`UUID NOT NULL`, FK `profiles`) |
| `tasks.completed` | Exists (`BOOLEAN NOT NULL DEFAULT false`) |
| `tasks.updated_at` | Exists, but is bumped by **any** edit, so it cannot prove when a task was completed |
| `tasks.completed_at` | **Does not exist.** Completion dates of existing tasks are unprovable |
| Existing RLS | `tasks_*_own` (select/insert/update/delete = `auth.uid() = student_id`) |
| Next migration number | `011` is the next unused file number (on disk and on all remote branches). **Conflict to resolve:** `docs/FINAL_ROADMAP.md` and `AI_STUDY_ASSISTANT_ARCHITECTURE.md` *reserve* `011` for the deferred, unimplemented `011_ai_study_assistant.sql`. See §11 |

Because `completed_at` is missing, the design records an **auditable event log** instead of guessing from the boolean. **No backfill:** tasks completed before this feature create no events and no streak days.

## 4. Data model (migration `011_study_streak_analytics.sql`, additive only)

| Object | Purpose | Student access |
|---|---|---|
| `study_activity_events` | Append-only log: one row per completion (`student_id`, `task_id`, server `completed_at`, `activity_date`, `timezone`, `voided_at`). Unique active event per task | `SELECT` own only |
| `study_preferences` | `daily_goal` (1–20, default 3), `timezone` | `SELECT` own only |
| `student_achievements` | Earned badges; `UNIQUE (student_id, badge_key)` and a `CHECK` on the 8 keys | `SELECT` own only |
| Trigger `tasks_log_completion` on `tasks` | The **only** writer of events (`false→true` records, `true→false` voids) | n/a |
| `get_study_summary()` / `set_daily_study_goal(int)` / `sync_study_timezone(text)` | The only student-callable writes/reads; student comes from `auth.uid()` | `EXECUTE` for `authenticated` only |
| `study_streak_compute`, `award_study_achievements`, `record_study_event` | Internal engine | No student access (revoked) |

Rollback: [`supabase/rollbacks/011_study_streak_analytics_down.sql`](../../supabase/rollbacks/011_study_streak_analytics_down.sql) (drops only objects created by 011; does not touch `tasks` data).

## 5. Streak and protection rules (single source of truth: SQL `study_streak_compute`)

Streak, protection balance, longest streak, totals and the calendar are **derived** from the event log on every read. There are no mutable counters, so refreshes, retries and multiple devices cannot double-award protection.

1. A day is **active** if it has ≥ 1 non-voided completion event (several tasks = one day).
2. Each active day extends the streak by 1.
3. Every **7th active day in a run** earns 1 protection (cap **2**; an award at the cap is not stored).
4. A fully missed day (always a day *before* the current day) while a streak is running:
   - **automatically consumes one protection** if available. The day is **protected**: the streak is bridged, but it is *not* an active day and adds nothing to the streak count or totals; otherwise
   - the streak ends (resets to 0, progress toward the next protection restarts).
5. The current day never counts as a miss: after studying yesterday, the streak stays visible and shows "still going" until today ends.
6. Missed days when no streak is running consume nothing. Completing a task after a break starts a new streak. `longest_streak` is the maximum ever reached and is not reduced by resets.
7. "Today" is the student's calendar day in their saved timezone, computed by the **server** clock.

**Decision for approval (documented per the brief):** protection is **automatic** (no manual activation). Alternative: manual "use protection" button. Default kept as automatic unless the team chooses otherwise.

## 6. Completion-history policy

| Situation | Behaviour |
|---|---|
| Complete a task | One event, server timestamp, date in the student's timezone at that moment |
| Network retry / repeated "complete" | `true→true` is a no-op; unique-active-event index makes duplicates impossible |
| Undo completion | Event is voided (kept for audit). A day with no other event stops being active |
| Complete again after undo | A new active event; voided history retained |
| Delete a completed task | Event is **kept** (no FK on `task_id`): the student did study that day |
| Edit title/deadline/subject of a completed task | No effect on events |
| Several completions in a day | One active day; counts toward the daily goal and task totals |
| Timezone change | Applies to **future** events only; past `activity_date` values are never rewritten. A timezone move can extend, never retroactively break, a streak |
| Task created already completed | Treated as a completion event at creation time |
| Pre-existing completed tasks | **No events, no streak, no badge credit** (dates cannot be proven) |
| Earned badges | Never revoked (undo/reset/deletion do not remove them) |

## 7. UI changes (HTML/CSS/JS only; no framework change)

- **Directly below the Study Task Analytics header:** encouragement line + cards: Current Study Streak (flame), Longest Study Streak, Daily Study Goal ("2 / 3 Tasks Completed", progress bar, editable target), Streak Protection (balance / 2), Today's Study Status, Total Active Study Days.
- **Below Weekly Activity / Workload:** *Study Consistency Calendar* (monthly; completed / protected / inactive / today; click a date to see its task count; empty state; legend).
- **Below Subject-Wise Completion Progress:** *Achievement Badges* (8 badges, locked muted with progress, unlocked highlighted with earned date).
- **Study Tasks:** after a *successful* completion, one dismissible toast; confetti only for milestones and never under `prefers-reduced-motion`.
- Existing Quiz Performance section is unchanged.

**Celebration rules.** Priority (one toast at a time): 30/14/7-day streak badge → first task → all tasks due today done → daily goal reached → 3-day streak → other badge → regular. Messages are the exact texts from the brief. Dedupe: badge messages come from the server's *newly earned* diff (so they cannot repeat after refresh); goal and "all due today" messages are additionally remembered per student/date in `localStorage`. If the post-completion summary cannot be read, only the plain message is shown, so no milestone is ever claimed without server evidence. The celebration runs only after the existing task update returned success.

## 8. Files

**Created**
- `supabase/migrations/011_study_streak_analytics.sql` (+ mirror `Backend/supabase/migrations/`)
- `supabase/rollbacks/011_study_streak_analytics_down.sql`
- `src/lib/study-logic.js`, `src/services/study-streak.js`, `src/services/study-goals.js`, `src/services/study-achievements.js`, `src/study-celebrations.js`, `src/study-analytics-upgrade.js` (mirrored byte-for-byte to `public/src/`; the four non-UI modules also to `Backend/`)
- `public/study-analytics-upgrade.css`
- `tests/unit/study-logic.test.js`, `tests/unit/study-achievements-celebrations.test.js`
- `tests/db/` (isolated PGlite SQL tests; own `package.json`, not part of the root install)
- `tests/manual/study-preview.html` (manual UI harness with a mocked backend)

**Existing files minimally modified**
- `public/index.html`: 3 empty mount `<section>/<div>`s + one `<link>` for the new CSS.
- `public/app.js`: one import block; `initStudyAnalytics(...)` in `init()`; `loadStudyAnalytics()` after the first `render()`; `renderStudyAnalytics()` in `render()`; in the existing toggle handler, `await ensureStudyTimezoneSynced()` before completing and a call to `studyTaskCompleted(task)` / `studyTaskUndone()` **after** the existing success check. No existing calculation, render function or Supabase call was altered.

## 9. Security

- RLS enabled on all three new tables; **no INSERT/UPDATE/DELETE policies and write privileges revoked**: students cannot forge events, badges or goals.
- Trigger and RPCs are `SECURITY DEFINER` with `search_path = ''`; RPCs never accept a student id (they use `auth.uid()`); internal functions are not executable by `anon`/`authenticated`.
- Trustworthy timestamps: `completed_at` and "today" come from the database clock.
- Duplicate achievements prevented by `UNIQUE (student_id, badge_key)` plus `ON CONFLICT DO NOTHING`; per-student advisory lock serialises concurrent completions.
- No service-role key or secret is used in the frontend.
- Residual limitation: the system proves that a task was *marked complete*, not that studying occurred. A student can create and complete tasks to inflate their own streak. It is a self-motivation feature, not an assessment.

## 10. Test evidence

> Local results are **not** live Supabase verification. No migration was applied to the live project and no live account was used.

### Executed (this branch, Nov 17, 2026, local machine)

| Suite | Result | Scope |
|---|---|---|
| Vitest (`npm test`) | **58 / 58 PASS** (28 existing + 30 new) | Local unit tests; existing 28 still pass unchanged |
| Python system harness (`tests/run_tests.py`) | **11 / 11 PASS** | Structure/integration |
| Python AI quiz suite (`tests/test_ai_quiz.py`) | **4 / 4 PASS** | AI quiz checks |
| Vite production build (`npm run build`) | **PASS** | 6 HTML entries; new modules resolve and bundle |
| SQL tests (`tests/db`, PGlite in-memory Postgres) | **36 / 36 PASS** | Real migrations 001–006 + proposed 011 on an emulated Supabase (stubbed `auth.uid()`, `anon`/`authenticated` roles). Includes two-student RLS isolation, no-direct-write checks, trigger policy, streak/protection scenarios, achievements once-only, timezone, idempotent re-run |
| Mutation sanity check | 2 SQL tests failed when the protection cap and the 7-day rule were deliberately broken, then the file was restored and the suite re-run green | Confirms the tests detect regressions |

### Brief §13 checklist

| # | Check | Status |
|---|---|---|
| 1 | Existing analytics calculations remain correct | ✅ local (existing Vitest/Python suites unchanged and passing; no calculation code edited) |
| 2 | Task CRUD unchanged | ◐ local only: existing tests pass and the trigger is additive; **no live/browser CRUD run** |
| 3 | One completion → at most one event | ✅ local SQL |
| 4 | Several tasks one date = one streak day | ✅ local SQL |
| 5 | Consecutive dates increment | ✅ local SQL |
| 6 | Missed dates / protection rules | ✅ local SQL |
| 7 | Refresh preserves streak & goal | ◐ by construction (derived from stored data; repeated reads identical in SQL tests); **no browser refresh run** |
| 8 | Another device loads same data | ⛔ **NOT RUN** (needs live Supabase + two sessions) |
| 9 | Undo / delete / edit | ✅ local SQL |
| 10 | Achievements awarded once | ✅ local SQL |
| 11 | Daily-goal celebration | ✅ local unit (message selection and dedupe); ⛔ not seen in a browser |
| 12 | Student B cannot access Student A's streak/achievements | ✅ **local emulation** only; ⛔ live two-account test **NOT RUN** |
| 13 | Light and dark themes | ⛔ **NOT RUN** (no browser available this session; CSS uses existing theme variables) |
| 14 | Weekly Activity still means scheduled tasks | ◐ code untouched; no visual check |
| 15 | Quiz Performance functional | ◐ code untouched; no visual check |

### Not executed (honest list)

Live Supabase verification; applying 011; two-account RLS on the live project; multi-device test; **real-browser UI checks** (rendering, dark mode, 375/768 px layout, reduced-motion, goal-save UX); Playwright (still 0/24 from Week 11); true concurrent-connection race test (the SQL suite uses one connection; the advisory lock is untested under contention); timezone behaviour on a real device.

### How to complete verification (after approval)

1. **Manual UI smoke (no database needed):** `python3 -m http.server 4310` from the repo root, open `http://localhost:4310/tests/manual/study-preview.html`, and walk the checks (cards, calendar, badges, goal save, 5 celebration scenarios, dark mode, 375/768 px, reduced motion). This harness uses the real modules with a **mocked** network layer. It has **not yet been run in a browser**.
2. **Staging project:** apply `011` to a disposable Supabase project, run two disposable accounts (A, B): complete tasks as A on two devices; confirm B sees none of it; run the rollback script once.
3. Only then consider the production project.

## 11. Risks

| Risk | Mitigation / owner |
|---|---|
| Migration number `011` collides with the planned AI Study Assistant migration | Nothing applied yet, so renaming is trivial. Team decides: keep `011` for streaks and renumber the AI plan, or rename this file to `012`. **Decision needed** |
| A trigger on `tasks` sits in the task-completion write path; a bug could block completing tasks | Additive, tested locally, trivial rollback script; staging test before production. The frontend ignores streak read failures |
| Legacy completed tasks earn no streak/badge credit | Intentional (unprovable). Students may find "Task Achiever" progress starts at 0 |
| Event rows can accumulate | Small rows, partial indexes; summary payload capped at ~400 calendar days |
| Streak can be inflated by self-created tasks | Documented limitation (§9) |
| Goal/all-due celebration dedupe is device-local | Cosmetic; worst case a message repeats on another device |
| `tests/db` adds a dev dependency (PGlite) | Isolated in `tests/db/package.json`; not installed by the root `npm install` or Vercel |

## 12. Rollback plan

Frontend: revert the PR (new files are additive; the only edits are the small hooks in `app.js`/`index.html`). Database: run `supabase/rollbacks/011_study_streak_analytics_down.sql` (export the three tables first; dropping them deletes streak history, goals and badges). Existing tables and data are never altered by 011.

## 13. Team approval status

| Member | GitHub | Approval |
|---|---|---|
| Nabin Khadka (proposer) | `liftupkhadka555-spec` | **PENDING** (proposal author; not a team approval) |
| Sumit Adhikari | `adronnie` | **PENDING** |
| Prince Karki | `princekark` | **PENDING** |
| Prabin Rai | `RaiPrabin697` | **PENDING** |
| J.N. Taj Oli | `jn-oli` | **PENDING** |

Decisions requested: (a) approve this enhancement outside the Week 11 freeze (or defer to a post-freeze window); (b) automatic vs manual protection; (c) migration number `011` vs `012`; (d) authorization to apply `011` to a **staging** project, and later to production; (e) whether pre-feature completed tasks should ever count toward task-count badges.

## 14. Deployment readiness

**NOT READY.** Missing: team approval, staging migration, live two-account verification, browser UI verification, and a production migration authorization with the rollback plan above.
