# Week 12 — Release Verification & QA Readiness Report

**Project:** Smart Study Companion — Team 5 (Ulsan College)  
**Repository:** https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design  
**Verified Baseline Commit (`origin/main`):** `e9f86df1703a568b7efbb5d30f073936bc2b2aa0`  
**QA Fix Branch:** `week12/release-readiness-qa-fixes`  
**Verification Date:** November 23, 2026  
**Target Deadline:** Wednesday, November 25, 2026  
**Prepared By:** Nabin Khadka (`liftupkhadka555-spec`)  
**Release Decision:** **NO-GO**

---

## A. Executive Summary

Week 12 release readiness remains **NO-GO**. While all local automated unit tests (**93/93 PASS**), PGlite database isolation tests (**36/36** and **4/4 PASS**), Python integration/contract checks (**PASS**), production Vite build, unauthenticated/anonymous Playwright checks (**12/12 PASS**), and non-cloud UI regression checks (**10/10 PASS**) succeed—alongside newly resolved UI defects (**Issues #79, #80, #83, #84**, plus `.quiz-setup-controls[hidden]` visibility bug)—multiple **P0 live cloud gates** remain unverified or unapplied:

1. **Official Course Vercel Deployment SHA (`P0`):** Verification via Vercel CLI/API is **BLOCKED** locally; both the official team URL and personal fork URL currently serve an identical older bundle (`etag: "e6cce49db1d3fbd659ee860ed84f94f2"`, fork commit `03ae6a4`) that lags `origin/main` (`e9f86df`) and lacks the November 23 QA/UI fixes.
2. **Live Supabase Migrations (`P0`):** Migrations `009`, `010`, and `012` are **NOT APPLIED** in live Supabase (`bcwwnjtmrcxggbaallon.supabase.co`). Only `011_study_streak_analytics.sql` (plus `001`–`008`) is active live.
3. **Live `DATA-01` Two-Student RLS (`P0`):** **NOT RUN** in live Supabase (requires coordinated execution using two disposable student accounts Student A and Student B). Anonymous REST checks (`E2E-RLS-02`) confirm 0 rows leaked across 8 live private tables, which supports RLS presence on `001`–`008` + `011` but does **not** prove authenticated cross-student isolation (`DATA-01`).
4. **Live AI Quiz Edge Function (`P1`):** `POST /functions/v1/generate-ai-quiz` returns **HTTP 404 (NOT DEPLOYED)** and lacks live `GEMINI_API_KEY` verification.
5. **Credentialed Live Playwright Flows (`P1`):** Authenticated E2E scenarios (`E2E-ONB-*`, `E2E-TASK-*`, `E2E-ANLY-*`, `E2E-QUIZ-*`, `E2E-MOB-*`, `E2E-RLS-01`) remain **SKIPPED** until disposable test credentials (`E2E_STUDENT_A_*`, `E2E_STUDENT_B_*`) are provided.
6. **Scope Preservation (Frozen Week 11 MVP vs. AI Tutor):** AI Tutor ([PR #78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/78), migration `013_ai_tutor.sql`, `ai-tutor-chat`) is **excluded from the Week 11 frozen MVP release gate** and reported for status only (live migration `013` and Edge Function both return HTTP 404 / unapplied).

---

## B. Deployment Verification (`P0`)

| Check Item | Value / Observation (November 23, 2026) |
|---|---|
| **`origin/main` Commit SHA** | `e9f86df1703a568b7efbb5d30f073936bc2b2aa0` |
| **Course Vercel URL Probed** | `https://team-5-capstone-design.vercel.app/` (`Environment: Production`, returned `HTTP/2 200`, `etag: "e6cce49db1d3fbd659ee860ed84f94f2"`, `last-modified: Mon, 23 Nov 2026 11:52:40 GMT`) |
| **Personal Fork Vercel URL Probed** | `https://team-5-capstone-design-761v.vercel.app/` (`Environment: Production`, returned `HTTP/2 200`, identical `etag: "e6cce49db1d3fbd659ee860ed84f94f2"`, `last-modified: Mon, 23 Nov 2026 03:13:30 GMT`) |
| **Served Asset Proof** | `assets/main-C9nMNtAi.js` & `assets/main-BFX0WH0o.css` (built from fork commit `03ae6a4`, containing `#view-ai-tutor`) |
| **Verification Method** | Unauthenticated `curl -sI` HTTP header inspection + asset hash check (`vercel` CLI not installed, Vercel API token unavailable) |
| **Vercel Org Integration ([Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59))** | **PENDING** university org admin GitHub App approval |
| **Final Deployment Status** | **BLOCKED (authoritative course Vercel SHA unobtainable locally) + DEPLOYMENT MISMATCH** (active bundle predates `e9f86df` docs commits and does not include `week12/release-readiness-qa-fixes` fixes) |

> [!IMPORTANT]
> Production was **not** redeployed. See [DEPLOYMENT_VERIFICATION.md](./DEPLOYMENT_VERIFICATION.md) for the exact step-by-step instructions an authorized Vercel project owner must run to record and verify the production commit SHA before approval.

---

## C. Database & Security (`P0`)

### 1. Live Supabase Migration Verification (`bcwwnjtmrcxggbaallon.supabase.co`)

| Migration File | Schema Intent | Live REST Probe (Nov 23, 2026) | Status | Rollback / Notes |
|---|---|---|---|---|
| `009_ai_quiz_tables.sql` | Creates `ai_quizzes`, `ai_quiz_questions`, `ai_quiz_attempts` with FK refs, indexes, and owner RLS policies | `GET /rest/v1/ai_quizzes?select=id&limit=1` → **HTTP 404** | **NOT APPLIED** | No `009_down.sql` in `supabase/rollbacks/`; safe additive DDL, reversible via `DROP TABLE IF EXISTS ai_quiz_attempts, ai_quiz_questions, ai_quizzes;` |
| `010_complete_universities.sql` | Expands `universities` catalog beyond baseline `007` (adds Sri Lanka / Kelaniya, UK/US/Asian institutions, idempotent insert) | `GET /rest/v1/universities?select=country,name&name=ilike.*Kelaniya*` → **`[]`** (count remains 46 from `007`) | **NOT APPLIED** | Additive data insert (`ON CONFLICT DO NOTHING`); review duplicates against `007` before applying |
| `011_study_streak_analytics.sql` | Creates `study_preferences`, `study_activity_events`, `student_achievements` + server streak RPCs & trigger | `GET /rest/v1/study_preferences?select=student_id&limit=1` → **HTTP 200** | **APPLIED** | Rollback exists at [`011_study_streak_analytics_down.sql`](../../supabase/rollbacks/011_study_streak_analytics_down.sql) |
| `012_quiz_difficulty_and_repetition.sql` | Adds `quiz_questions.(difficulty, explanation, fingerprint)` + `quiz_attempts.difficulty` + repetition-prevention indexes (resolved duplicate `011_` prefix in PR #75) | `GET /rest/v1/quiz_attempts?select=id,difficulty&limit=1` → **HTTP 400** (missing column) | **NOT APPLIED** | Rollback exists at [`012_quiz_difficulty_and_repetition_down.sql`](../../supabase/rollbacks/012_quiz_difficulty_and_repetition_down.sql). Minor hygiene note: header comments inside `012` & `012_down` still mention `Migration 011` |
| `013_ai_tutor.sql` *(Out of Frozen MVP)* | Creates `ai_tutor_conversations`, `ai_tutor_messages`, `ai_tutor_learning_sessions`, `ai_tutor_usage_quotas` with triggers & anti-impersonation RLS | `GET /rest/v1/ai_tutor_conversations?select=id&limit=1` → **HTTP 404** | **NOT APPLIED** | Reported for status only (excluded from Week 11 MVP gate). Rollback exists at [`013_ai_tutor_down.sql`](../../supabase/rollbacks/013_ai_tutor_down.sql) |

### 2. Reviewable Remediation Plan (For Authorized DBA / Supabase Dashboard Execution)

Do **not** execute schema changes without project owner authorization. Once approved, apply in Supabase SQL Editor in order:
1. Run `supabase/migrations/009_ai_quiz_tables.sql` (required before deploying `generate-ai-quiz`).
2. Run `supabase/migrations/010_complete_universities.sql` (verify post-run `SELECT COUNT(*) FROM public.universities;`).
3. Run `supabase/migrations/012_quiz_difficulty_and_repetition.sql` (additive `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` — preserves existing quiz history rows).
4. **Verify migration history:** `SELECT version, name FROM supabase_migrations.schema_migrations ORDER BY version;` (or verify target tables/columns in Table Editor & RLS policies in Authentication → Policies).

### 3. Live `DATA-01` Two-Student RLS Verification

- **Anonymous RLS Probe (`E2E-RLS-02`):** **PASS** (November 23, 2026 via Playwright `request` context + `tests/e2e/e2e_runner.py`). Direct unauthenticated REST `GET` requests across `tasks`, `profiles`, `student_subjects`, `quiz_attempts`, `quiz_responses`, `study_preferences`, `study_activity_events`, and `student_achievements` all returned `HTTP 200` with `0` rows.
- **Emulated Multi-Tenant SQL RLS (`tests/db/study-streak.db.test.js` & `tests/db/ai-tutor.db.test.js`):** **PASS** (`36/36` and `4/4` in local PGlite PostgreSQL).
- **Live Authenticated Two-Student `DATA-01` (`DATA-01A` .. `DATA-01E`, `E2E-RLS-01`):** **NOT RUN**. Requires coordinated run with Student A and Student B live accounts via normal authenticated JWT sessions (never `service_role`). See [DATA-01-RLS-VERIFICATION.md](./DATA-01-RLS-VERIFICATION.md) and **Evidence pending** (`docs/week_12/Evidence/DATA-01-RLS/`).

---

## D. Automated Testing & Regression Summary

### 1. Local Automated Suites (Executed November 23, 2026 After All Edits)

| Suite | Command | Result | Scope Limit |
|---|---|---|---|
| **Vitest Unit Tests** | `npm test` | **12 files, 93 / 93 PASS** | Uses mocked Supabase/storage boundaries where needed |
| **PGlite DB RLS Tests (Study Streak)** | `node --test tests/db/study-streak.db.test.js` | **36 / 36 PASS** | Local PostgreSQL WASM emulation, not live cloud |
| **PGlite DB RLS Tests (AI Tutor)** | `node --test tests/db/ai-tutor.db.test.js` | **4 / 4 PASS** | Local PostgreSQL WASM emulation; AI Tutor is out of MVP |
| **Python System Suite** | `python3 tests/run_tests.py` | **11 / 11 PASS** | Static/logic verification |
| **AI Quiz Contract Suite** | `python3 tests/test_ai_quiz.py` | **4 / 4 PASS** | Local validation, not live Edge Function execution |
| **AI Tutor Contract Suite** | `python3 tests/test_ai_tutor.py` | **PASS (all contract groups)** | Static/contract verification; AI Tutor out of MVP |
| **E2E Contract Runner** | `python3 tests/e2e/e2e_runner.py` | **3 / 3 groups PASS** | Static DOM + live public catalog & anon RLS REST probes |
| **Production Build** | `npm run build` | **PASS** (`vite v6.4.5`, 33 modules built cleanly in 151ms) | Bundle build only |

### 2. Playwright Browser Testing Progression (`tests/e2e/`)

- **November 22 Baseline ([Prince QA Report](./PRINCE_KARKI_AUTOMATED_QA_REPORT.md)):** Of 24 scenarios, **15 executed (7 passed, 8 failed)** and **9 unconfirmed** on local preview. Root-cause breakdown:
  - **Test-script defects (fixed Nov 23):** Outdated DOM IDs (`#auth-alert` vs `#form-alert`, `#reset-btn` vs `#forgot-btn`, `#new-password` vs `#password`, `#onboarding-*` vs `#academic-*`, `#btn-add-task` vs `#add-task-btn`, `.task-item`/`btn-delete-task` vs `.task-card`/`.delete-btn` + `#confirm-delete`, `Computer Science` vs `Computer Science & Engineering (CSE)`), strict-mode locator match on `a[href*="reset-password"]`, missing auth/login setup causing redirects, missing `#open-sidebar-btn` mobile drawer click, and a conditional `if (await aiTab.isVisible())` bypass in `E2E-QUIZ-02`.
  - **Genuine application defects discovered & fixed (Nov 23):**
    1. **`.quiz-setup-controls[hidden]` override (`public/styles.css`):** `.quiz-setup-controls { display: grid; }` overrode HTML `[hidden]`, keeping `#quiz-curated-panel` visible underneath the AI Quiz panel when switching tabs. Fixed via `.quiz-setup-controls[hidden] { display: none !important; }`.
    2. **Issue #83 — Phone-width Quiz horizontal overflow (`public/styles.css`, `public/index.html`):** `.quiz-type-tabs` lacked `flex-wrap: wrap`, `.modal-actions` lacked `flex-wrap: wrap` (overflowing 3 buttons in `#quiz-result`), grid `minmax(220px, 1fr)` & `.quiz-setup-controls` lacked `min-width: 0` / `min(220px, 100%)`, and `.subject-progress-meta` lacked wrapping. Fixed cleanly and verified `scrollWidth <= clientWidth + 2` across 375px Quiz Setup, AI Tab, Play, and Result screens.
    3. **Issue #80 — Active Quiz Mode Tab Visual & ARIA State (`public/styles.css`, `public/index.html`, `public/app.js`):** Added `.quiz-type-tabs .btn-ghost.is-active` styling (`--teal-soft` fill, `--teal` border/text), `role="tablist"`/`role="tab"`, and synchronized `aria-selected`/`aria-pressed` via `setQuizSetupMode()`.
    4. **Issue #79 — Subject Card Keyboard Toggle (`public/app.js`):** Added shared `toggleSubjectCard()` helper handling `Enter` and `Space` keydown on `.scrollable-subject-card` while restoring focus across re-renders.
    5. **Issue #84 — Add Task Subject Dropdown Contrast in Dark Mode (`public/styles.css`):** Added `.modal-card select`, `color-scheme: light/dark`, and explicit `html.dark select option` contrast colors (`#162022` / `#f4efe6`) across modals and forms.
- **November 23 Rerun Results (`Desktop Chrome` + `Mobile Chrome (Pixel 5)`):** **22 PASS, 40 SKIPPED (credential-gated), 0 FAIL** (details in [PLAYWRIGHT_E2E_REPORT.md](./PLAYWRIGHT_E2E_REPORT.md)). Visual captures saved in:
  - [`mobile-quiz-setup-375px.png`](./Evidence/Playwright-Fixes/mobile-quiz-setup-375px.png)
  - [`mobile-quiz-result-375px.png`](./Evidence/Playwright-Fixes/mobile-quiz-result-375px.png)
  - [`mobile-task-modal-dark-375px.png`](./Evidence/Playwright-Fixes/mobile-task-modal-dark-375px.png)

### 3. Targeted Week 11 / Week 12 Regression Status

| Feature / Fix | Verification Status (Nov 23, 2026) | Evidence |
|---|---|---|
| Wireframes sidebar link removal | **PASS (Automated Chrome UI Regression `UI-REG-01`)** | Verified absent in `#sidebar` |
| Retake Quiz functionality | **PASS (Vitest `quiz-retake.test.js` + Chrome UI Regression `UI-REG-05` + Nov 23 J.N. Taj manual check)** | [QUIZ_RETAKE_PEER_REVIEW.md](./QUIZ_RETAKE_PEER_REVIEW.md) & `UI-REG-05` |
| Task deadline validation (`parseDeadlineInputToIso`) | **PASS (Vitest `bug-fixes-week12.test.js` + Chrome UI Regression `UI-REG-04`)** | Validates missing/invalid inputs cleanly without crash |
| Local date handling (`formatLocalDateInput`) | **PASS (Vitest `bug-fixes-week12.test.js`)** | Avoids UTC midnight shift in `UTC+9` |
| Quiz-history 200-cap | **PASS (Vitest + code check `getQuizHistory(currentUser.id, 200)`)** | Analytics uses full fetched array up to 200; recent panel slices top 8 |
| Password recovery flow | **PASS (Nov 22 manual verification by Prince Karki); Signup verification & expired-token live tests remain unverified** | [PRINCE_KARKI_PASSWORD_RECOVERY_QA.md](./PRINCE_KARKI_PASSWORD_RECOVERY_QA.md) |

---

## E. AI Features Status

1. **AI Quiz Generator (`generate-ai-quiz` Edge Function — Part of Week 11 Scope):**
   - Local implementation exists at `supabase/functions/generate-ai-quiz/index.ts` (uses `GEMINI_API_KEY`, default `gemini-2.5-flash`, validates student JWT, writes to `ai_quizzes` & `ai_quiz_questions`).
   - Live Supabase probe `POST https://bcwwnjtmrcxggbaallon.supabase.co/functions/v1/generate-ai-quiz` returned **HTTP 404 (NOT DEPLOYED)**.
   - Supporting database tables (`009_ai_quiz_tables.sql`) are **NOT APPLIED** live, and `GEMINI_API_KEY` server secret is unverified.
   - Frontend (`public/src/services/ai-quiz.js`) transparently falls back to curated subject questions only when labeled or surfaces an error rather than generating fake mock questions.
2. **AI Tutor (`PR #78` / Migration `013_ai_tutor.sql` / `ai-tutor-chat` — Out of Frozen MVP Scope):**
   - Merged into `origin/main` via [PR #78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/78) prior to this audit.
   - Live cloud probes show `ai_tutor_conversations` returns **HTTP 404 (`013` NOT APPLIED)** and `/functions/v1/ai-tutor-chat` returns **HTTP 404 (`NOT DEPLOYED`)**.
   - **Per release rules, AI Tutor stays excluded from Week 11/12 MVP release gates** and is documented strictly for accurate status reporting.

---

## F. Outstanding Work Before Final GO Sign-Off (Before Nov 25, 2026)

| Priority | Blocker / Task | Owner(s) | Required Evidence to Clear Gate |
|---|---|---|---|
| **P0** | Merge `week12/release-readiness-qa-fixes` (after team PR review) & authorize production deploy, OR record exact course Vercel project commit SHA ([Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59)) | **Nabin Khadka** + Org Admin | Vercel Dashboard / CLI screenshot showing Course Project URL, Production environment, and Git SHA matching release commit |
| **P0** | Apply migrations `009`, `010`, and `012` in authorized live Supabase project | **Sumit Adhikari** / **Nabin Khadka** | SQL Editor confirmation + verified live table/column query receipts |
| **P0** | Execute live two-student RLS matrix (`DATA-01A`..`01E`, `E2E-RLS-01`) | **Prince Karki** / **Prabin Rai** / **Sumit Adhikari** | Redacted REST + UI screenshots saved in `docs/week_12/Evidence/DATA-01-RLS/` |
| **P1** | Deploy `generate-ai-quiz` Edge Function, configure `GEMINI_API_KEY`, and verify end-to-end live AI quiz generation | **Nabin Khadka** / **Sumit Adhikari** | Live HTTP `200` generation receipt & persisted `ai_quizzes` row |
| **P1** | Run live credentialed Playwright suite (`E2E_STUDENT_A_*`, `E2E_STUDENT_B_*`) across Desktop & Mobile | **Prabin Rai** / **Nabin Khadka** | Playwright HTML report / output showing 0 failures on all 24+ live cases |
| **P1** | Complete peer verification screenshots for Issues `#79`, `#80`, `#83`, `#84`, signup confirmation, and expired recovery token; finalize all 5 member sign-offs | **J.N. Taj Oli**, **Prince Karki**, **Prabin Rai**, **Sumit Adhikari**, **Nabin Khadka** | Updated sign-off table in `weekly-report.md` & `FEATURE_FREEZE_DECISION.md` |
