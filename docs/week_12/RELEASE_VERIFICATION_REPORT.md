# Week 12 — Release Verification & QA Readiness Report

**Project:** Smart Study Companion — Team 5 (Ulsan College)  
**Repository:** https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design  
**Verified Baseline (`origin/main`):** `032e6cd` (incl. [PR #85](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/85), [PR #86](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/86), & [PR #87](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/87); plus Quiz tab WAI-ARIA & doc polish)  
**Verification Date:** November 25, 2026  
**Target Deadline:** Wednesday, November 25, 2026  
**Release Decision:** **NO-GO — Pending Live Security and Release Verification.**

---

## A. Executive Summary

Week 12 release readiness remains **NO-GO — Pending Live Security and Release Verification.** While local Vitest suites (**12 files, 93/93 PASS**), PGlite database RLS tests (**36/36** and **4/4 PASS**), Python integration/contract checks (**PASS**), production Vite build (**PASS**), unauthenticated/live-anon Playwright checks (**6/24 scenarios = 12/12 Chrome desktop/mobile PASS**), and non-cloud responsive/UI regression checks (**`UI-REG-01..06`: 12/12 Chrome runs PASS across `320px–1440px` Light & Dark modes**) succeed, mandatory P0 live gates remain open:

1. **Official Course Vercel Deployment SHA (`MVP-DEP-01` — Owner: `liftupkhadka555-spec`):** **`UNKNOWN / UNVERIFIED`** (`BLOCKED` locally; active HTTP `etag: "e6cce49db1d3fbd659ee860ed84f94f2"` reflects older `03ae6a4` build and lags `main` `032e6cd`, [Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59) pending). Production was **not** redeployed.
2. **Live Supabase Migrations `009`, `010`, `012` (`MVP-DB-01` — Owner: `adronnie`):** **`UNVERIFIED` / NOT APPLIED** in live Supabase (`bcwwnjtmrcxggbaallon.supabase.co`). Only `011_study_streak_analytics.sql` (plus `001`–`008`) returned live `HTTP 200`. See [Sumit Adhikari Report](./Sumit-Adhikari-Database-Security-Report.md).
3. **Live `DATA-01` Two-Student Authenticated RLS (`MVP-SEC-01` — Owner: `adronnie`, Collaborators: `princekark` & `RaiPrabin697`):** **`NOT RUN`**. Live anonymous `E2E-RLS-02` **`PASS`** (0 rows across 8 tables) does not substitute for live Student A/B isolation.
4. **Live AI Quiz Edge Function (`MVP-AIQ-01` — Owners: `liftupkhadka555-spec` / `adronnie`):** **`UNVERIFIED`** (`POST /functions/v1/generate-ai-quiz` returns **HTTP 404**; `GEMINI_API_KEY` secret unverified).
5. **Credentialed Live Playwright Browser Runs (`MVP-E2E-01` — Harness: `RaiPrabin697`, Independent QA: `princekark`):** **`UNCONFIRMED`** (**18 / 24** live authenticated scenarios `NOT RUN / SKIPPED` pending `E2E_STUDENT_A_*` and `E2E_STUDENT_B_*`, plus agent-assisted repairs pending personal review).
6. **Responsive Issue `#83` & Dark-Mode Dropdown `#84` (`MVP-RESP-01` — Reporter `#84`: `adronnie`, Fix Owner: `jn-oli`):** Agent-assisted code fixes and 7-viewport Chrome matrix **`PASS`**, but Issue `#83`/`#84` stay **`UNCONFIRMED`** / **OPEN** pending personal `jn-oli` & independent live QA verification.
7. **Formal Team Freeze Sign-Off (`MVP-GOV-01` — All 5 Members):** **`BLOCKED`** (`0/5` formal signatures in `FEATURE_FREEZE_DECISION.md` & `weekly-report.md`).
8. **AI Tutor Deferred Boundary (`EXT-AIT-01`):** **DEFERRED — Local Implementation Exists, Live Verification Pending** ([PR #78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/78), migration `013_ai_tutor.sql` [`HTTP 404`], `ai-tutor-chat` [`HTTP 404`]). Excluded from frozen Week 11/12 MVP gates.

---

## B. Deployment Verification (`P0` — Owner: `liftupkhadka555-spec`)

| Check Item | Value / Observation (November 25, 2026) |
|---|---|
| **`origin/main` Commit SHA** | `032e6cd` (including PR #85 `22879a9`, PR #86 `391961f`, & PR #87 `032e6cd`) |
| **Course Vercel URL Probed** | `https://team-5-capstone-design.vercel.app/` (`HTTP/2 200`, `etag: "e6cce49db1d3fbd659ee860ed84f94f2"`, `last-modified: Tue, 24 Nov 2026 15:23:08 GMT`) |
| **Fork Vercel URL Probed** | `https://team-5-capstone-design-761v.vercel.app/` (`HTTP/2 200`, identical `etag: "e6cce49db1d3fbd659ee860ed84f94f2"`, bundle `main-C9nMNtAi.js` from `03ae6a4`) |
| **Vercel Org Integration ([Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59))** | Pending org admin approval (`vercel` CLI / API token unavailable locally) |
| **Official SHA Status** | **`UNKNOWN / UNVERIFIED`** (`BLOCKED` locally; active bundle lags `main` `032e6cd`) |

*(Note: Preserves all Nabin Khadka completed work intact; fork sync and local build are explicitly not treated as course Vercel deployment proof. Full instructions in [DEPLOYMENT_VERIFICATION.md](./DEPLOYMENT_VERIFICATION.md).)*

---

## C. Database & Security (`P0` — Owner: `adronnie`)

Full SQL review, dependencies, RLS checks, remediation plan, and live `DATA-01` procedure live in [Sumit-Adhikari-Database-Security-Report.md](./Sumit-Adhikari-Database-Security-Report.md):
- **`009_ai_quiz_tables.sql`:** `GET /rest/v1/ai_quizzes?select=id&limit=1` → **HTTP 404** (`UNVERIFIED` / not applied live).
- **`010_complete_universities.sql`:** `GET /rest/v1/universities?select=country,name&name=ilike.*Kelaniya*` → **`[]`** (`UNVERIFIED` / not applied live).
- **`011_study_streak_analytics.sql`:** `GET /rest/v1/study_preferences?select=student_id&limit=1` → **HTTP 200** (`APPLIED`).
- **`012_quiz_difficulty_and_repetition.sql`:** `GET /rest/v1/quiz_attempts?select=id,difficulty&limit=1` → **HTTP 400** (`UNVERIFIED` / not applied live).
- **`013_ai_tutor.sql` *(Deferred)*:** `GET /rest/v1/ai_tutor_conversations?select=id&limit=1` → **HTTP 404** (`DEFERRED` outside MVP scope).
- **Live `DATA-01`:** **`NOT RUN`** (coordinated procedure documented for `adronnie`, `princekark`, `RaiPrabin697`; enhanced in [`rls-isolation.spec.js`](../../tests/e2e/rls-isolation.spec.js)). Anonymous REST `E2E-RLS-02` returned **PASS** (0 rows across 8 tables).

---

## D. Automated Testing, Failure Matrix & Responsive Regression (`P1` — `RaiPrabin697`, `princekark`, `jn-oli`)

1. **Local Automated & Build Suites (Nov 25, 2026):**
   - `npm test` (Vitest): **12 files, 93 / 93 PASS**
   - `node --test tests/db/study-streak.db.test.js`: **36 / 36 PASS** *(PGlite local emulation)*
   - `node --test tests/db/ai-tutor.db.test.js`: **4 / 4 PASS** *(PGlite local emulation; deferred AI Tutor)*
   - `python3 tests/run_tests.py`: **11 / 11 PASS**
   - `python3 tests/test_ai_quiz.py`: **4 / 4 PASS**
   - `python3 tests/test_ai_tutor.py`: **PASS** *(static/contract checks; deferred AI Tutor)*
   - `python3 tests/e2e/e2e_runner.py`: **3 / 3 groups PASS** *(DOM bindings + public catalog & anon REST)*
   - `npm run build` (`vite v6.4.5`): **PASS** (33 modules, 6 HTML entry points)
2. **Playwright 24-Case Baseline Progression:**
   - **Nov 22 Historical (`princekark`):** **15 executed (7 PASS, 8 FAIL, 9 unconfirmed)**. Exact 8-failure classification table in [`PRINCE_KARKI_AUTOMATED_QA_REPORT.md` §16.1](./PRINCE_KARKI_AUTOMATED_QA_REPORT.md).
   - **Nov 25 Repaired Harness (`RaiPrabin697` report / `princekark` addendum, agent-assisted pending review):** Uses semantic `getByRole`/`getByLabel`/`getByPlaceholder` locators and zero `waitForTimeout`:
     - **6 / 24 (`E2E-AUTH-01..05`, `E2E-RLS-02`) = 12 / 12 Chrome runs `PASS`**
     - **18 / 24 (`ONB`, `TASK`, `ANLY`, `QUIZ-01..03`, `MOB-01..03`, `RLS-01`) = 36 / 36 Chrome runs `NOT RUN` (`SKIPPED` pending `E2E_STUDENT_A/B`)**, **0 `FAIL`**
     - **Separate Non-Cloud Mocked UI Regressions (`UI-REG-01..06`):** **12 / 12 Chrome runs `PASS`**, verifying **all 7 viewports (`320, 375, 390, 430, 768, 1024, 1440px`) in Light & Dark modes**, Issue `#79`, Issue `#80` + `.quiz-setup-controls[hidden]` fix, Issue `#83`, Issue `#84` (dropdown contrast + `:focus-visible`), and Rapid Quiz timer + Retake Quiz!
   - Full details in [Prabin-Rai-Automation-Repair-Report.md](./Prabin-Rai-Automation-Repair-Report.md), [JN-Taj-Oli-Responsive-UI-Report.md](./JN-Taj-Oli-Responsive-UI-Report.md), and [PLAYWRIGHT_E2E_REPORT.md](./PLAYWRIGHT_E2E_REPORT.md).

---

## E. AI Features Status

- **AI Quiz Generator (`generate-ai-quiz`, Part of MVP Scope):** `POST /functions/v1/generate-ai-quiz` returns **HTTP 404 (`UNVERIFIED` / NOT DEPLOYED)**; migration `009` unapplied; `GEMINI_API_KEY` secret unverified. Client curated fallback must not be confused with verified live Gemini generation.
- **AI Tutor (`PR #78` / Migration `013` / `ai-tutor-chat`, Deferred Scope):** **DEFERRED — Local Implementation Exists, Live Verification Pending.** Both `013` tables and `ai-tutor-chat` return **HTTP 404** live. Excluded from frozen-core release gates.

---

## F. Outstanding Work Before GO Decision

See [`MVP_VERIFICATION_MATRIX.md`](./MVP_VERIFICATION_MATRIX.md) for the complete 16-gate matrix (`MVP-AUTH-01` .. `EXT-AIT-01`):
1. **P0 — `adronnie`:** Apply migrations `009`, `010`, `012` cleanly with admin authorization and capture schema verification proof.
2. **P0 — `adronnie` + `princekark` + `RaiPrabin697`:** Execute live **`DATA-01`** using two disposable ordinary student accounts and save redacted responses/screenshots in [`Evidence/DATA-01-RLS/`](Evidence/DATA-01-RLS/README.md).
3. **P0 — `liftupkhadka555-spec` + Org Admin:** Resolve [Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59) and verify the official course Vercel production SHA matches the approved release commit.
4. **P1 — `RaiPrabin697` & `princekark`:** Review repaired harness and run all 24 Playwright scenarios with live `E2E_STUDENT_A/B` credentials.
5. **P1 — `jn-oli` & Independent QA:** Personally verify Issues `#83`/`#84` on live deployed builds across viewports before posting [ISSUE_83_UPDATE_DRAFT.md](./ISSUE_83_UPDATE_DRAFT.md) and closing `#83`/`#84`.
6. **P1 — `liftupkhadka555-spec` & `adronnie`:** Deploy `generate-ai-quiz` with `GEMINI_API_KEY` and capture live HTTP `200` test, plus live signup & expired recovery token logs.
7. **P0 — All 5 Members:** Record formal freeze and release approvals in `FEATURE_FREEZE_DECISION.md` and `weekly-report.md`.
