# Week 12 — Playwright Browser E2E Verification Report

**Responsible:** Prabin Rai / Prince Karki / Nabin Khadka  
**Latest Run Date:** November 23, 2026 (Local Vite Preview + Google Chrome & Mobile Pixel 5 Emulation)  
**Command:** `PW_CHROMIUM_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npx playwright test tests/e2e/auth.spec.js tests/e2e/onboarding.spec.js tests/e2e/tasks.spec.js tests/e2e/analytics.spec.js tests/e2e/quiz.spec.js tests/e2e/mobile.spec.js tests/e2e/rls-isolation.spec.js tests/e2e/ui-regression-mocked.spec.js --project="Desktop Chrome" --project="Mobile Chrome (Pixel 5)"`

---

## 1. Execution Timeline (History Preserved)

| Date | Operator | Target | Outcome Summary | Notes |
|---|---|---|---|---|
| **Nov 20, 2026** | Team baseline | Spec audit | **0 / 24** executed (`Not run`) | `@playwright/test` not yet installed |
| **Nov 22, 2026** | Prince Karki | Local Vite preview (`auth`, `onboarding`, `tasks`, `analytics`, `quiz`, `mobile`, `rls`) | **15 executed: 7 PASS, 8 FAIL, 9 unconfirmed** | Documented in [PRINCE_KARKI_AUTOMATED_QA_REPORT.md](./PRINCE_KARKI_AUTOMATED_QA_REPORT.md) & [Issue #81](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/81). Failures driven primarily by outdated selectors, missing auth/mobile drawer steps, strict-mode locators, and weak conditional `isVisible()` guards |
| **Nov 23, 2026** | Nabin Khadka | Fresh Vite build `npm run build` + `http://localhost:4173` on **Desktop Chrome** & **Mobile Chrome (Pixel 5)** after selector & UI fixes | **22 PASS, 40 SKIPPED (credential-gated live flows), 0 FAIL** | Unauthenticated/live-anon specs (**12/12 PASS**) + separated non-cloud mocked UI regression specs (**10/10 PASS**). Live student flows (`onboarding`, `tasks`, `analytics`, `quiz`, `mobile`, `E2E-RLS-01`) honestly **SKIPPED** without `E2E_STUDENT_A_*` / `E2E_STUDENT_B_*` credentials |

---

## 2. November 23 Run — Suite-by-Suite Breakdown (Desktop Chrome + Mobile Chrome)

### A. Real Environment / Unauthenticated & Live-Anon E2E (No Mocks)

| Suite | Cases Covered | Desktop Chrome | Mobile Chrome (Pixel 5) | Scope Proven |
|---|---|---|---|---|
| `auth.spec.js` (`E2E-AUTH-01..05`) | Login render, Signup country→university cascade, real Supabase invalid-login alert (`#form-alert.is-visible`), Forgot/Reset 6-digit OTP UI, unauthenticated `/` → `/auth/login.html` redirect | **5 PASS** | **5 PASS** | Real UI + live Supabase Auth error rejection |
| `rls-isolation.spec.js` (`E2E-RLS-02`) | Direct anonymous REST `GET` against 8 live Supabase private tables (`tasks`, `profiles`, `student_subjects`, `quiz_attempts`, `quiz_responses`, `study_preferences`, `study_activity_events`, `student_achievements`) | **1 PASS** | **1 PASS** | Anonymous REST queries return HTTP `200` with `0` rows |
| **Subtotal (Real Unauthenticated / Anon)** | **6 unique scenarios × 2 projects = 12 runs** | **6 PASS** | **6 PASS** | **12 / 12 PASS** |

### B. Live Authenticated E2E (`E2E_STUDENT_A_*` / `E2E_STUDENT_B_*` Required)

| Suite | Cases | Status | Reason |
|---|---|---|---|
| `onboarding.spec.js` | `E2E-ONB-01..04` | **SKIPPED (8 runs)** | Selectors & major/faculty values fixed (`#academic-*`, `.scrollable-subject-card`, `Computer Science & Engineering (CSE)`), gated explicitly on `E2E_STUDENT_A_EMAIL`/`PASSWORD` |
| `tasks.spec.js` | `E2E-TASK-01..04` | **SKIPPED (8 runs)** | Fixed selectors (`#add-task-btn`, `#search-input`, `#task-name`, `.task-card`, `.toggle-btn`, `.delete-btn`, `#confirm-delete`), gated on `E2E_STUDENT_A_*` |
| `analytics.spec.js` | `E2E-ANLY-01..03` | **SKIPPED (6 runs)** | Fixed selectors (`#analytics-progress-text`, `#weekly-activity-chart`, `#workload-*-text`, `#subject-progress-container`, `#analytics-quiz-summary`), gated on `E2E_STUDENT_A_*` |
| `quiz.spec.js` | `E2E-QUIZ-01..04` | **SKIPPED (8 runs)** | Removed conditional `if (isVisible())` skip, fixed selectors (`#quiz-tab-ai`, `#quiz-start-btn`, `#quiz-retake-btn`), added Retake regression `E2E-QUIZ-04`, gated on `E2E_STUDENT_A_*` |
| `mobile.spec.js` | `E2E-MOB-01..04` | **SKIPPED (8 runs)** | Opens `#open-sidebar-btn`, tests `html.dark` toggle, drawer view switching, and adds `E2E-MOB-04` Quiz `375px` overflow check, gated on `E2E_STUDENT_A_*` |
| `rls-isolation.spec.js` | `E2E-RLS-01` | **SKIPPED (2 runs)** | Requires two live accounts (`E2E_STUDENT_A_*` + `E2E_STUDENT_B_*`) for live cross-account CRUD & isolation check |
| `ai-tutor.spec.js` | `AI-01..AI-18` (9 tests) | **OUT OF MVP SCOPE / NOT RE-RUN** | AI Tutor (`PR #78` / migration `013`) is deferred outside Week 11 frozen MVP |

### C. Mocked UI & Week 12 Regression Suite (`ui-regression-mocked.spec.js` — Non-Cloud)

Uses Playwright `page.route()` interception strictly to render `public/index.html` + `public/styles.css` + `public/app.js` in Chromium without live passwords. Does **not** certify live Supabase Auth, RLS, or Edge Functions.

| Test ID | Regression / Bug Verified | Desktop Chrome | Mobile Chrome (Pixel 5) | Visual Evidence |
|---|---|---|---|---|
| `UI-REG-01` | Sidebar omits Wireframes link & exposes active MVP views | **PASS** | **PASS** | — |
| `UI-REG-02` | Issue #79: Subject card `Enter` / `Space` keyboard toggle & focus retention | **PASS** | **PASS** | — |
| `UI-REG-03` | Issue #80 + CSS `[hidden]` bug fix: Active quiz tab styling + `#quiz-curated-panel[hidden]` actually hides panel when AI tab active | **PASS** | **PASS** | [`mobile-quiz-setup-375px.png`](./Evidence/Playwright-Fixes/mobile-quiz-setup-375px.png) |
| `UI-REG-04` | Task invalid/empty deadline toast validation + Issue #84 `#task-subject` dark-mode dropdown contrast | **PASS** | **PASS** | [`mobile-task-modal-dark-375px.png`](./Evidence/Playwright-Fixes/mobile-task-modal-dark-375px.png) |
| `UI-REG-05` | Issue #83 + Retake Quiz: 375px mobile Quiz Setup/AI/Play/Result zero horizontal overflow + clean `#quiz-retake-btn` restart | **PASS** | **PASS** | [`mobile-quiz-result-375px.png`](./Evidence/Playwright-Fixes/mobile-quiz-result-375px.png) |

---

## 3. Exact Commands to Execute Live Authenticated E2E

```bash
export E2E_STUDENT_A_EMAIL="student_a@example.com"
export E2E_STUDENT_A_PASSWORD="..."
export E2E_STUDENT_B_EMAIL="student_b@example.com"
export E2E_STUDENT_B_PASSWORD="..."

npm run build
npx playwright test --project="Desktop Chrome" --project="Mobile Chrome (Pixel 5)" --reporter=html
```
