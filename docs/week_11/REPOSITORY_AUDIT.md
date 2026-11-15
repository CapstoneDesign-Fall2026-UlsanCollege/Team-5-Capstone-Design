# Repository Audit — Week 11 MVP Baseline & Architecture Assessment


**Project:** Smart Study Companion  
**Team:** Team 5 — Capstone Design, Fall 2026 (Ulsan College)  
**Audit Date:** 2026-11-15 (Target Execution Window: November 15–18, 2026)  
**Branch:** `supabase-auth` (Commit `1098cb1` on `origin/supabase-auth`)  
**Auditor:** Team 5 Technical Release & Full-Stack Audit

---

## 1. Executive Summary & Repository Status

This repository audit establishes the verified code, database, deployment, and testing baseline for Smart Study Companion as Team 5 enters the **Week 11 MVP Verification and Goal Freeze Gate**.

Every architectural layer was inspected in local source code, automated test runners, and via live read-only probes against Supabase Cloud (`https://bcwwnjtmrcxggbaallon.supabase.co`).

### Key Findings
1. **Frontend SPA & Build:** All 6 HTML entry points (`index.html`, `login`, `signup`, `verify`, `forgot-password`, `reset-password`) build cleanly via Vite 6 in `117ms`. Five distinct application views (`#dashboard`, `#tasks`, `#subjects`, `#analytics`, `#quiz`) are fully wired.
2. **Automated Verification:** **28/28** Vitest unit & contract tests pass (`npm test`); **11/11** Python integration checks pass (`python3 tests/run_tests.py`); **4/4** AI Quiz schema/scoring checks pass (`python3 tests/test_ai_quiz.py`); and **3/3** E2E integration groups pass (`npm run test:e2e`).
3. **Actual Backend Architecture:** The directory `Backend/` is **not a runnable Express or Node server**; it is an organized architectural mirror. The true application backend is **Supabase (Supabase Auth, Supabase PostgREST PostgreSQL, and Deno Edge Functions)**. Deploying an independent Node server on Render is unnecessary and redundant.
4. **Live Supabase State:** Seeded catalog tables (`universities=46`, `subjects=32`, `major_subjects=128`, `quiz_questions=345`) are live (`HTTP 200/206`). Anonymous reads on private tables (`tasks`, `profiles`, `quiz_attempts`) return `0` rows due to active RLS.
5. **Operational Blockers:** Migration `009_ai_quiz_tables.sql` (`404 PGRST205`) and `010_complete_universities.sql` remain pending execution in the Supabase Cloud SQL Editor; Edge Function `generate-ai-quiz` is not yet deployed via CLI (`404 NOT_FOUND`); live signup email confirmation is skipped (`"mailer_autoconfirm": true`) pending Brevo Custom SMTP configuration.

---

## 2. Full-Stack Audit Matrix

| Feature / Module | Implemented in Code? | Local Tests Passing? | Deployed Live? | Live Integration Verified? | Status | Responsible Member | Evidence Path |
|---|---|---|---|---|---|---|---|
| **Student Registration (`signup.html`)** | Yes | Yes (`auth.test.js`, `run_tests.py`) | Yes (Vite / Pages) | Partial (`mailer_autoconfirm` skips email) | **PARTIAL** | Nabin Khadka / Prince Karki | [`public/auth/signup.html`](../../public/auth/signup.html), [`tests/unit/auth.test.js`](../../tests/unit/auth.test.js) |
| **Student Sign-In (`login.html`)** | Yes | Yes (Mocks & Contracts) | Yes | Yes (Auth endpoints live) | **VERIFIED (unit/static only)** | Nabin Khadka / Prince Karki | [`public/auth/login.html`](../../public/auth/login.html), [`src/services/auth.js`](../../src/services/auth.js) |
| **6-Digit OTP Password Reset** | Yes | Yes (Dual OTP & Link) | Yes | Blocked (Shared SMTP limits, `@gmmail.com` typo) | **BLOCKED (Delivery)** | Nabin Khadka / Prince Karki | [`password-reset-investigation.md`](../week_10/password-reset-investigation.md), [`public/auth/reset-password.html`](../../public/auth/reset-password.html) |
| **Route Protection (`auth-guard.js`)** | Yes | Yes (Exemptions verified) | Yes | Yes (Clean redirection) | **VERIFIED (unit/static only)** | Nabin Khadka | [`src/auth-guard.js`](../../src/auth-guard.js), [`tests/unit/backend-services.test.js`](../../tests/unit/backend-services.test.js) |
| **Academic Onboarding (`#subjects`)** | Yes | Yes (Cascading logic passing) | Yes | Partial (Catalog live; onboarding save DB check unrun) | **PARTIAL** | Nabin Khadka / Sumit Adhikari | [`src/lib/academic-catalog.js`](../../src/lib/academic-catalog.js), [`public/app.js`](../../public/app.js) |
| **Task CRUD (`#tasks`)** | Yes | Yes (Validation & contracts pass) | Yes | Partial (Anon blocked; authenticated E2E unrun) | **PARTIAL** | Sumit Adhikari / Prabin Rai | [`src/services/tasks.js`](../../src/services/tasks.js), [`tests/unit/tasks.test.js`](../../tests/unit/tasks.test.js) |
| **Study Task Analytics (`#analytics`)** | Yes | Yes (Ring, 7-day chart, counters) | Yes | Yes (Local calculations verified) | **VERIFIED (unit/static only)** | Nabin Khadka / J.N. Taj Oli | [`public/app.js`](../../public/app.js), [`study-analytics-dashboard.png`](../week_10/study-analytics-dashboard.png) |
| **Curated Quiz Practice (`#quiz`)** | Yes | Yes (Scoring, standard/rapid modes) | Yes | Partial (345 questions live; attempt save unrun) | **PARTIAL** | Nabin Khadka / Sumit Adhikari | [`src/services/quiz.js`](../../src/services/quiz.js), [`data/quiz-bank.json`](../../data/quiz-bank.json) |
| **AI Quiz Tables (`009`)** | Yes | Yes (Schema validated in Python) | No | Blocked (`404 PGRST205` on live PostgREST) | **BLOCKED (Cloud DB)** | Sumit Adhikari / Nabin Khadka | [`supabase/migrations/009_ai_quiz_tables.sql`](../../supabase/migrations/009_ai_quiz_tables.sql) |
| **AI Quiz Edge Function** | Yes | Yes (Compile & mock pass) | No | Blocked (`404 NOT_FOUND` live) | **BLOCKED (Deploy)** | Nabin Khadka | [`supabase/functions/generate-ai-quiz/index.ts`](../../supabase/functions/generate-ai-quiz/index.ts) |
| **Complete Universities (`010`)** | Yes | Yes (Syntax & seeds verified) | No | Blocked (Awaiting SQL Editor execution) | **BLOCKED (Cloud DB)** | Sumit Adhikari / Nabin Khadka | [`supabase/migrations/010_complete_universities.sql`](../../supabase/migrations/010_complete_universities.sql) |
| **Two-Account RLS Isolation** | Yes (Policies written) | Yes (Anon reads blocked) | Yes (006 live) | Not Tested (Interactive 2-student browser test unrun) | **NOT TESTED (Live)** | Sumit Adhikari / Prabin Rai | [`supabase/migrations/006_rls_policies.sql`](../../supabase/migrations/006_rls_policies.sql), [`tests/e2e/rls-isolation.spec.js`](../../tests/e2e/rls-isolation.spec.js) |
| **Playwright E2E Suite** | Yes (7 specs written) | Yes (`e2e_runner.py` passes) | N/A | Partial (DOM hooks & REST verified; full browser unrun) | **PARTIAL** | Prabin Rai | [`tests/e2e/`](../../tests/e2e/), [`playwright.config.js`](../../playwright.config.js) |
| **Theme Toggle (Light/Dark)** | Yes | Yes (6 tests pass in Vitest) | Yes | Yes (Persistent in localStorage) | **VERIFIED (unit/static only)** | J.N. Taj Oli | [`src/theme.js`](../../src/theme.js), [`tests/unit/theme.test.js`](../../tests/unit/theme.test.js) |
| **Gemini AI Chat Assistant** | Spec in repo | Spec only | No | Not implemented by design (Freeze gate) | **NOT IMPLEMENTED (Planned)** | Team 5 | [`docs/AI_STUDY_ASSISTANT_ARCHITECTURE.md`](../AI_STUDY_ASSISTANT_ARCHITECTURE.md) |

---

## 3. Backend Architecture Analysis: The Role of `Backend/`

A central question addressed in this audit is whether the project requires an independent Node/Express backend deployed on Render.

### Codebase Inspection Results
1. `Backend/` contains:
   - `Backend/README.md`
   - `Backend/auth-guard.js`
   - `Backend/lib/` (`supabase.js`, `academic-catalog.js`, `regional-catalog.js`)
   - `Backend/services/` (`auth.js`, `profile.js`, `subjects.js`, `tasks.js`, `quiz.js`, `ai-quiz.js`)
   - `Backend/supabase/` (`setup_all.sql`, `migrations/001`–`010`, `functions/generate-ai-quiz/index.ts`)
2. `Backend/` **lacks**:
   - `package.json`
   - `server.js` or `index.js`
   - Express, Fastify, or Koa frameworks
   - `listen()` calls or HTTP port bindings
   - Process entry points

### Architectural Verdict
Smart Study Companion operates as a modern **BaaS (Backend-as-a-Service) + Serverless Architecture**:
- **Authentication:** Supabase Auth handles student identity, tokens, and sessions.
- **Data & Access Control:** Supabase PostgreSQL with PostgREST handles data queries and enforces security directly through Row Level Security (RLS) policies.
- **Serverless Compute:** Supabase Edge Functions (Deno) handle AI requests without exposing API keys.
- **Frontend Delivery:** Static assets are served via Vercel / GitHub Pages.

**Conclusion:** Deploying a separate Node HTTP server to Render would be redundant and artificial. Render can serve as an optional static site mirror, but **Supabase is the genuine, complete backend** for this application.

---

## 4. Verification Check Commands Run

```bash
# 1. Python Automated Test Suite
python3 tests/run_tests.py
# Result: ALL TESTS PASSED SUCCESSFULLY (11/11)

# 2. Python AI Quiz Schema & Scoring Suite
python3 tests/test_ai_quiz.py
# Result: ALL AI QUIZ TESTS PASSED! (4/4)

# 3. Vitest Unit & Contract Suite
npm test
# Result: Test Files 5 passed (5), Tests 28 passed (28)

# 4. Production Multi-Page Vite Build
npm run build
# Result: Built 6 entry points into dist/ in 117ms

# 5. Playwright & E2E Integration Runner
npm run test:e2e
# Result: ALL E2E INTEGRATION CHECKS PASSED SUCCESSFULLY (3/3 GROUPS)
```

