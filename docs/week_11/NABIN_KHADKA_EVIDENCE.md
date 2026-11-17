# Week 11 Individual Evidence & Verification Record — Nabin Khadka

**Student Name:** Nabin Khadka  
**GitHub Login:** `liftupkhadka555-spec`  
**Role:** Full-Stack Integration, Deployment, Repository Audit, and Release Coordination  
**Team:** Team 5 — Smart Study Companion (Capstone Design, Fall 2026, Ulsan College)  
**Execution Period:** November 15–18, 2026  
**Reconciliation Date:** November 17, 2026  
**Status:** **Implementation, Deployment Preparation and Documentation Completed in Part — Live Verification and Freeze Approval Pending**

---

## 1. Executive Summary

In Week 11 ("MVP Verification and Goal Freeze"), I led the full-stack repository audit, frontend cloud deployment setup, E2E test framework specification, and historical issue resolution for the Smart Study Companion project.

While substantial implementation, configuration, and documentation milestones were achieved, live release acceptance criteria remain gated by external dependencies (independent RLS execution, cloud database migration execution, and team freeze sign-offs). This document records both completed work and pending verification gates with full transparency.

---

## 2. Completed Technical Contributions & Evidence

### A. Frontend Production Deployment Setup (Vercel)
- **Accomplishment:** Verified multi-page Vite production build (112ms, 6 HTML pages) and configured deployment pipeline to the Vercel Edge Network with HTTP security headers (`nosniff`, `DENY`, `strict-origin`).
- **Temporary Deployment URL:** [`https://rapid-oxygen-cicusvj.tmp.now`](https://rapid-oxygen-cicusvj.tmp.now) (Verified HTTP 200 on all 6 entry points).
- **Personal Fork CI/CD Pipeline:** Configured [`liftupkhadka555-spec/Team-5-Capstone-Design`](https://github.com/liftupkhadka555-spec/Team-5-Capstone-Design) connected to Vercel project `team-5-capstone-design-761v` with environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- **Evidence Documents & Screenshots:**
  - Deployment Report: [`docs/week_11/VERCEL_DEPLOYMENT_REPORT.md`](VERCEL_DEPLOYMENT_REPORT.md)
  - Evidence Dossier: [`docs/week_11/Evidence/Nabin-Khadka/README.md`](Evidence/Nabin-Khadka/README.md)
  - Vercel Dashboard Screenshot: [`docs/week_11/Evidence/Nabin-Khadka/W11-VERCEL-01-project-creation.png`](Evidence/Nabin-Khadka/W11-VERCEL-01-project-creation.png) (Displays GitHub project import confirmation for `team-5-capstone-design-761v`).

### B. Frontend Deployment Platform Decision & GitHub Issue #59
- **Accomplishment:** Authored comparative architectural evaluation of Vercel vs. GitHub Pages vs. Netlify, confirming Vercel as the optimal Jamstack host for our Vite/Supabase stack. Authored tracker issue #59.
- **Evidence Document:** [`docs/week_11/FRONTEND_DEPLOYMENT_DECISION.md`](FRONTEND_DEPLOYMENT_DECISION.md)
- **GitHub Issue:** [Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59) (Decision documented; final closure pending team review).

### C. Resolution & Audit of 18 Historical GitHub Issues (Sep 19 – Oct 13)
- **Accomplishment:** Audited all 21 historical issues, linked each to verifiable code, unit tests, and screenshots, and landed merge commit `09d4c64` on `main` to close all 18 completed issues (#15–#23, #25, #28–#35).
- **Evidence Document:** [`docs/week_11/ISSUES_AUDIT_SEP19_OCT13.md`](ISSUES_AUDIT_SEP19_OCT13.md)
- **Result:** Reduced open issue backlog on the course repository from 32 to 14.

### D. Playwright E2E Test Suite & Automated Contract Runner
- **Accomplishment:** Authored 7 Playwright E2E specifications covering 24 student journey scenarios (`tests/e2e/*.spec.js`), reconciled baseURL and routing paths (`/#tasks`, `/#subjects`, `/auth/...`), and implemented a Python contract runner (`tests/e2e/e2e_runner.py`) passing 3/3 check groups.
- **Evidence Document:** [`docs/week_11/E2E_TEST_RESULTS.md`](E2E_TEST_RESULTS.md)

### E. Full-Stack Technical Audit Documentation Set
- **Accomplishment:** Authored 7 comprehensive audit documents establishing verified baselines:
  1. [`docs/week_11/REPOSITORY_AUDIT.md`](REPOSITORY_AUDIT.md) &mdash; Codebase audit confirming BaaS architecture over redundant Express servers.
  2. [`docs/week_11/AUTHENTICATION_VERIFICATION.md`](AUTHENTICATION_VERIFICATION.md) &mdash; 14-step auth flow audit and Brevo Custom SMTP setup guide.
  3. [`docs/week_11/DATABASE_AND_RLS_VERIFICATION.md`](DATABASE_AND_RLS_VERIFICATION.md) &mdash; Supabase Cloud table audit and non-destructive SQL execution plan for `009`/`010`.
  4. [`docs/week_11/AI_QUIZ_LIVE_VERIFICATION.md`](AI_QUIZ_LIVE_VERIFICATION.md) &mdash; Deno Edge Function deployment runbook and fallback handling.
  5. [`docs/week_11/DEPLOYMENT_VERIFICATION.md`](DEPLOYMENT_VERIFICATION.md) &mdash; Build verification and hosting provenance reconciliation.
  6. [`docs/week_11/UI_UX_VERIFICATION.md`](UI_UX_VERIFICATION.md) &mdash; Theme consistency review and passing unit tests.
  7. [`docs/week_11/FEATURE_FREEZE_DECISION.md`](FEATURE_FREEZE_DECISION.md) &mdash; Proposed formal freeze locking core modules and deferring Gemini AI Chat.

---

## 3. Explicit Disclosure of Unverified Gates & Limitations

In compliance with the professor's Week 11 feedback, the following limitations are explicitly disclosed:

1. **Playwright Browser Tests Unexecuted:** While 24 test cases were drafted across 7 spec files, **0 of 24 test cases were executed in a real browser** because `@playwright/test` is not installed in `package.json` dependencies.
2. **Two-Student Authenticated RLS Isolation Unverified:** While anonymous REST calls return 0 rows due to RLS, **authenticated two-student RLS isolation (`DATA-01`) has NOT been executed** with live accounts.
3. **Database Migrations Unapplied in Cloud:** Migrations `009_ai_quiz_tables.sql` and `010_complete_universities.sql` exist in code but remain **unapplied to the live Supabase Cloud project** (Issue #53 pending).
4. **Course Organization Deployment Pending Admin Approval:** The Vercel GitHub App installation for `CapstoneDesign-Fall2026-UlsanCollege` requires organization admin approval; deployment was verified via personal fork pipeline.
5. **Team Freeze Sign-Offs Pending:** Formal sign-off on `FEATURE_FREEZE_DECISION.md` remains **pending for all 5 team members**.

---

## 4. Verification Check Summary

| Test Suite | Command | Result | Actual Scope |
| :--- | :--- | :---: | :--- |
| **Vitest Unit & Services** | `npm test` | **PASS (28/28)** | Local unit and service contract tests |
| **Python System Harness** | `python3 tests/run_tests.py` | **PASS (11/11)** | Structural, schema, and calculation checks |
| **Python AI Quiz Suite** | `python3 tests/test_ai_quiz.py` | **PASS (4/4)** | AI quiz schema, bounds, and scoring checks |
| **Vite Multi-Page Build** | `npm run build` | **PASS (112ms)** | 6 HTML entry points bundled into `dist/` |
| **Python E2E Contract Runner** | `npm run test:e2e` | **PASS (3/3)** | Static DOM hook bindings and anonymous REST probe |
| **Playwright Browser Suite** | `npm run test:e2e:playwright` | **NOT RUN (0/24)** | Pending package and browser binary installation |
| **Two-Student Authenticated RLS** | Protocol in `INDEPENDENT_VERIFICATION.md` | **NOT RUN** | Pending disposable test accounts |
