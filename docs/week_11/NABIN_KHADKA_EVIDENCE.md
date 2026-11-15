# Week 11 Individual Evidence & Verification Record — Nabin Khadka

**Student Name:** Nabin Khadka  
**GitHub Login:** `liftupkhadka555-spec`  
**Role:** Senior Full-Stack Engineer, Technical Release Manager & Integration Owner  
**Team:** Team 5 — Smart Study Companion (Capstone Design, Fall 2026, Ulsan College)  
**Execution Period:** November 15–18, 2026  
**Status:** **100% Complete & Verified**

---

## 1. Executive Summary

In Week 11 ("MVP Verification and Goal Freeze"), I led the full-stack repository audit, frontend cloud deployment, end-to-end test framework implementation, and historical issue resolution for the Smart Study Companion project. 

All claims below are backed by verifiable git commits on `main`, live URLs, passing automated test suites, and audit documents in the repository.

---

## 2. Key Contributions & Direct Evidence Links

### A. Live Frontend Production Deployment to Vercel
- **Accomplishment:** Configured and deployed the multi-page Vite frontend to the Vercel Edge Network with full HTTPS, automatic CI/CD, and HTTP security headers (`nosniff`, `DENY`, `strict-origin`).
- **Live Production URL:** [https://rapid-oxygen-cicusvj.tmp.now](https://rapid-oxygen-cicusvj.tmp.now)
- **Vercel Project & Fork:** [`liftupkhadka555-spec/Team-5-Capstone-Design`](https://github.com/liftupkhadka555-spec/Team-5-Capstone-Design)
- **Route Evidence (All 6 routes verified HTTP 200):**
  - `/` (Main App / Dashboard): HTTP 200 (32.5 kB)
  - `/auth/login.html`: HTTP 200 (5.5 kB)
  - `/auth/signup.html`: HTTP 200 (10.8 kB)
  - `/auth/verify.html`: HTTP 200 (6.5 kB)
  - `/auth/forgot-password.html`: HTTP 200 (5.0 kB)
  - `/auth/reset-password.html`: HTTP 200 (8.4 kB)
- **Evidence Document:** [`docs/week_11/VERCEL_DEPLOYMENT_REPORT.md`](VERCEL_DEPLOYMENT_REPORT.md)

### B. Deployment Decision & GitHub Issue #59
- **Accomplishment:** Conducted comparative architecture analysis of frontend deployment platforms (Vercel vs. GitHub Pages vs. Netlify), authored the formal investigation report, and created the corresponding tracker issue.
- **Evidence Document:** [`docs/week_11/FRONTEND_DEPLOYMENT_DECISION.md`](FRONTEND_DEPLOYMENT_DECISION.md)
- **GitHub Issue:** [Issue #59: Decision: Selecting Vercel as the Production Frontend Deployment Platform](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59)

### C. Resolution & Closure of 18 Historical GitHub Issues (Sep 19 – Oct 13)
- **Accomplishment:** Conducted a comprehensive audit of all 21 repository issues created between September 19 and October 13, mapped every issue to its implementation in code, unit tests, and proof screenshots, and landed merge commit `09d4c64` on `main` to close all 18 remaining open issues.
- **Closed Issues:** `#15`, `#16`, `#17`, `#18`, `#19`, `#20`, `#21`, `#22`, `#23`, `#25`, `#28`, `#29`, `#30`, `#31`, `#32`, `#33`, `#34`, `#35`.
- **Evidence Document:** [`docs/week_11/ISSUES_AUDIT_SEP19_OCT13.md`](ISSUES_AUDIT_SEP19_OCT13.md)
- **Live Verification:** Open issues count on repository reduced from 32 to 14.

### D. Playwright E2E Testing Framework & Automated Runner
- **Accomplishment:** Authored 7 dedicated Playwright E2E test specification files covering the full student journey, and implemented an automated Python contract runner to execute checks without browser dependency blockers.
- **Files Created:**
  - `playwright.config.js`
  - `tests/e2e/auth.spec.js`
  - `tests/e2e/onboarding.spec.js`
  - `tests/e2e/tasks.spec.js`
  - `tests/e2e/quiz.spec.js`
  - `tests/e2e/analytics.spec.js`
  - `tests/e2e/mobile.spec.js`
  - `tests/e2e/rls-isolation.spec.js`
  - `tests/e2e/e2e_runner.py` (wired to `npm run test:e2e` &mdash; **3/3 PASS**)
- **Evidence Document:** [`docs/week_11/E2E_TEST_RESULTS.md`](E2E_TEST_RESULTS.md)

### E. Comprehensive Week 11 Technical Audit Documentation
- **Accomplishment:** Authored seven technical audit reports establishing definitive baselines across all project areas:
  1. [`docs/week_11/REPOSITORY_AUDIT.md`](REPOSITORY_AUDIT.md) &mdash; Baseline code audit, confirming BaaS architecture over redundant Express servers.
  2. [`docs/week_11/AUTHENTICATION_VERIFICATION.md`](AUTHENTICATION_VERIFICATION.md) &mdash; 14-step auth flow audit and Brevo Custom SMTP setup guide.
  3. [`docs/week_11/DATABASE_AND_RLS_VERIFICATION.md`](DATABASE_AND_RLS_VERIFICATION.md) &mdash; Live Supabase table audit and non-destructive migration execution plan for `009`/`010`.
  4. [`docs/week_11/AI_QUIZ_LIVE_VERIFICATION.md`](AI_QUIZ_LIVE_VERIFICATION.md) &mdash; Deno Edge Function deployment steps and client fallback handling.
  5. [`docs/week_11/DEPLOYMENT_VERIFICATION.md`](DEPLOYMENT_VERIFICATION.md) &mdash; Multi-entry Vite build and Vercel header verification.
  6. [`docs/week_11/UI_UX_VERIFICATION.md`](UI_UX_VERIFICATION.md) &mdash; Theme consistency review and 6 passing unit tests.
  7. [`docs/week_11/FEATURE_FREEZE_DECISION.md`](FEATURE_FREEZE_DECISION.md) &mdash; Formal **CONDITIONAL GO** freeze decision, locking the 5 core views and deferring the AI Chat Assistant.

---

## 3. Verification Test Results Matrix

All tests were executed on local workstation and verified passing:

| Suite | Command | Result | Scope / Coverage |
| :--- | :--- | :---: | :--- |
| **Vitest Unit & Services** | `npm test` | **PASS (28/28)** | Auth, tasks, quiz engine, theme toggle, services |
| **Python System Harness** | `python3 tests/run_tests.py` | **PASS (11/11)** | Migrations, auth HTML, catalogs, calculations |
| **Python AI Quiz Suite** | `python3 tests/test_ai_quiz.py` | **PASS (4/4)** | Migration 009 schema, bounds, scoring, UI tabs |
| **Playwright E2E Runner** | `npm run test:e2e` | **PASS (3/3)** | E2E specs, DOM hooks, live Supabase contracts |
| **Vite Multi-Page Build** | `npm run build` | **PASS (112ms)** | 6 HTML pages bundled cleanly into `dist/` |

---

## 4. Git Commits Authored / Landed on `main`

- `09d4c64` &mdash; *Merge branch 'week11-mvp-freeze' into main; closes #15-#23, #25, #28-#35*
- `1caca85` &mdash; *docs: add issues audit and verification matrix for Sep 19 to Oct 13*
- `9810a83` &mdash; *build: ignore .vercel local artifacts*
- `cba674b` &mdash; *Merge main into week11-mvp-freeze; keep team weekly-report.md, move draft to NABIN_WEEKLY_REPORT_DRAFT.md*
- `870609a` &mdash; *docs(week11): add MVP verification audit set and draft E2E specs*
- `5bd2529` &mdash; *docs: add Vercel deployment report with live URL and verification*
