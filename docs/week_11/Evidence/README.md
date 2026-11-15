# Week 11 Evidence Package — Smart Study Companion


**Team:** Team 5 — Capstone Design, Fall 2026 (Ulsan College)  
**Target Milestone:** Week 11 MVP Verification and Goal Freeze  
**Execution Window:** November 15–18, 2026  

---

## 1. Automated Test Evidence Logs

| Test Category | Execution Command | Result Summary | Output Log Reference |
|---|---|---|---|
| **Vitest Unit & Contracts** | `npm test` | **28/28 PASS** (5 files, 222ms) | [`docs/week_11/E2E_TEST_RESULTS.md#1-automated-regression-baseline-re-execution`](../E2E_TEST_RESULTS.md#1-automated-regression-baseline-re-execution) |
| **Python System Harness** | `python3 tests/run_tests.py` | **11/11 PASS** (All check groups) | [`docs/week_11/REPOSITORY_AUDIT.md#4-verification-check-commands-run`](../REPOSITORY_AUDIT.md#4-verification-check-commands-run) |
| **Python AI Quiz Suite** | `python3 tests/test_ai_quiz.py` | **4/4 PASS** (Schema, scoring, UI) | [`docs/week_11/AI_QUIZ_LIVE_VERIFICATION.md#4-verification-check-results`](../AI_QUIZ_LIVE_VERIFICATION.md#4-verification-check-results) |
| **Vite Multi-Page Build** | `npm run build` | **PASS** (6 HTML entries, 117ms) | [`docs/week_11/DEPLOYMENT_VERIFICATION.md#production-build-verification`](../DEPLOYMENT_VERIFICATION.md#production-build-verification) |
| **Playwright E2E Runner** | `npm run test:e2e` | **3/3 PASS** (Specs, DOM, Live REST) | [`docs/week_11/E2E_TEST_RESULTS.md#3-standalone-e2e-integration-runner-results`](../E2E_TEST_RESULTS.md#3-standalone-e2e-integration-runner-results) |

---

## 2. Live Supabase Cloud Contract Evidence

Executed on 2026-11-15 against `https://bcwwnjtmrcxggbaallon.supabase.co`:
- `GET /rest/v1/universities?select=count` → HTTP 200, count: 46
- `GET /rest/v1/subjects?select=count` → HTTP 200, count: 32
- `GET /rest/v1/major_subjects?select=count` → HTTP 200, count: 128
- `GET /rest/v1/quiz_questions?select=count` → HTTP 200, count: 345
- `GET /rest/v1/tasks?select=*` (Anonymous) → HTTP 200, 0 rows leaked (RLS active)
- `GET /rest/v1/profiles?select=*` (Anonymous) → HTTP 200, 0 rows leaked (RLS active)
- `GET /rest/v1/quiz_attempts?select=*` (Anonymous) → HTTP 200, 0 rows leaked (RLS active)
- `GET /rest/v1/ai_quizzes?select=count` → HTTP 404 (PGRST205, Migration 009 unapplied)
- `POST /functions/v1/generate-ai-quiz` → HTTP 404 (NOT_FOUND, CLI deploy pending)

---

## 3. Visual & UI Artifacts

- **Study Task Analytics Dashboard (`#analytics`):** Verified screenshot at [`docs/week_10/study-analytics-dashboard.png`](../week_10/study-analytics-dashboard.png).
- **Academic Hierarchy & University Selector (`#subjects`):** Verified screenshot at [`docs/week_10/subjects-university-selector.png`](../week_10/subjects-university-selector.png).
- **Automated Theme Toggle Passing:** Verified screenshot at [`docs/week_10/Evidence/Automated test passed.png`](../week_10/Evidence/Automated%20test%20passed.png).
- **Desktop & Mobile Light/Dark Viewport Evidence:** Documented in [`docs/week_10/Evidence/desktop evidence.md`](../week_10/Evidence/desktop%20evidence.md) and [`docs/week_10/Evidence/mobile evidence.md`](../week_10/Evidence/mobile%20evidence.md).

