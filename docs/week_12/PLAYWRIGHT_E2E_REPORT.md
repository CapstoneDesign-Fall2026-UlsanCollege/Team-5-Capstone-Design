# Week 12 — Playwright Browser E2E Verification Report

**Automation Harness Owner:** Prabin Rai (`RaiPrabin697`)  
**Independent QA Execution Owner:** Prince Karki (`princekark`)  
**Latest Agent-Assisted Reconciliation Run:** November 25, 2026 (`032e6cd` / PR #87 baseline, Local Vite Preview + Desktop Chrome & Mobile Chrome Pixel 5)  
**Command:** `npx playwright test tests/e2e/auth.spec.js tests/e2e/onboarding.spec.js tests/e2e/tasks.spec.js tests/e2e/analytics.spec.js tests/e2e/quiz.spec.js tests/e2e/mobile.spec.js tests/e2e/rls-isolation.spec.js tests/e2e/ui-regression-mocked.spec.js --project="Desktop Chrome" --project="Mobile Chrome (Pixel 5)"`

---

## 1. Execution Timeline (All Historical Runs Preserved)

| Date | Operator / Attribution | Target | Original 24-Case Baseline Result | Separate / Non-Baseline Runs |
|---|---|---|---|---|
| **Nov 20, 2026** | Team baseline | Spec audit | **0 / 24** executed (`NOT RUN`) | `@playwright/test` not yet installed |
| **Nov 22, 2026** | **Prince Karki (`princekark`)** *(Independent QA)* | Local Vite preview (`auth`, `analytics`, `quiz`, `tasks`, `onboarding`, `mobile`, `rls`) | **15 executed: 7 PASS, 8 FAIL, 9 UNCONFIRMED** | See [PRINCE_KARKI_AUTOMATED_QA_REPORT.md](./PRINCE_KARKI_AUTOMATED_QA_REPORT.md) & failure classification matrix (§16.1) |
| **Nov 23, 2026** | Agent-assisted (`PR #85`, `232fb20`) | Local Vite build + Desktop/Mobile Chrome | **6 / 24 PASS** (`12` Chrome runs); **18 / 24 NOT RUN (`SKIPPED`)** | `UI-REG-01..05` (`10` Chrome runs **PASS**); `QUIZ-04` & `MOB-04` (`4` runs `SKIPPED`) |
| **Nov 25, 2026** | Agent-assisted (`week12/final-qa-reconciliation`, pending `RaiPrabin697` & `princekark` personal review) | Semantic locators (`getByRole`/`getByLabel`), expanded `E2E-RLS-01`, full **7-viewport × 2-theme** responsive sweep | **6 / 24 PASS** (`12` Chrome runs); **0 FAIL**; **18 / 24 NOT RUN (`SKIPPED` pending `E2E_STUDENT_A/B` credentials)** | `UI-REG-01..06` non-cloud mocked suite: **6 / 6 PASS** (**12 / 12** Chrome runs); `E2E-QUIZ-04` & `E2E-MOB-04` (`4` runs `SKIPPED`) |

*(Reconciled total in Nov 25 Playwright invocation across both Chrome projects: **24 passed, 40 skipped, 0 failed** = 12 original unauth/anon passes + 12 separate non-cloud UI regression passes + 36 original credential-gated skips + 4 extra credential-gated skips.)*

---

## 2. November 25 Run — Detailed Suite Breakdown

### A. Original 24-Case Live E2E Suite Inventory

| Suite | Scenarios | Desktop Chrome | Mobile Chrome (Pixel 5) | Status Label & Attribution |
|---|---|---|---|---|
| `auth.spec.js` (`E2E-AUTH-01..05`) | 5 unauthenticated / live-Auth error tests | **5 PASS** | **5 PASS** | **PASS** *(Agent-assisted rerun; uses semantic `getByLabel`/`getByRole` locators)* |
| `rls-isolation.spec.js` (`E2E-RLS-02`) | Direct anonymous REST `GET` across 8 private tables | **1 PASS** | **1 PASS** | **PASS** *(HTTP `200`, `0` rows returned)* |
| `onboarding.spec.js` (`E2E-ONB-01..04`) | 4 live onboarding flows | **4 SKIPPED** | **4 SKIPPED** | **NOT RUN** *(Requires `E2E_STUDENT_A_EMAIL`/`PASSWORD`)* |
| `tasks.spec.js` (`E2E-TASK-01..04`) | 4 live task CRUD & search flows | **4 SKIPPED** | **4 SKIPPED** | **NOT RUN** *(Requires `E2E_STUDENT_A_EMAIL`/`PASSWORD`)* |
| `analytics.spec.js` (`E2E-ANLY-01..03`) | 3 live analytics flows | **3 SKIPPED** | **3 SKIPPED** | **NOT RUN** *(Requires `E2E_STUDENT_A_EMAIL`/`PASSWORD`)* |
| `quiz.spec.js` (`E2E-QUIZ-01..03`) | 3 live quiz setup/AI/play flows | **3 SKIPPED** | **3 SKIPPED** | **NOT RUN** *(Requires `E2E_STUDENT_A_EMAIL`/`PASSWORD`)* |
| `mobile.spec.js` (`E2E-MOB-01..03`) | 3 live mobile shell/drawer/view flows | **3 SKIPPED** | **3 SKIPPED** | **NOT RUN** *(Requires `E2E_STUDENT_A_EMAIL`/`PASSWORD`)* |
| `rls-isolation.spec.js` (`E2E-RLS-01`) | Live Student A vs B UI & PostgREST `GET`/`PATCH`/`DELETE` (`DATA-01`) | **1 SKIPPED** | **1 SKIPPED** | **NOT RUN** *(Requires `E2E_STUDENT_A_*` + `E2E_STUDENT_B_*`)* |
| **24-Case Baseline Totals** | **24 unique cases** | **6 PASS / 18 SKIPPED** | **6 PASS / 18 SKIPPED** | **12 PASS / 36 NOT RUN (SKIPPED) / 0 FAIL** |

### B. Separate Non-Baseline Suites (Mocked UI Regression & Extra Live Regressions)

| Test ID | Scope Verified | Result (`Desktop` + `Mobile`) | Evidence |
|---|---|---|---|
| `UI-REG-01` | Sidebar omits Wireframes link & exposes active MVP links | **2 PASS** | [`ui-regression-mocked.spec.js`](../../tests/e2e/ui-regression-mocked.spec.js) |
| `UI-REG-02` | Issue #79: Subject card `Enter` / `Space` keyboard toggle & focus retention | **2 PASS** | [`ui-regression-mocked.spec.js`](../../tests/e2e/ui-regression-mocked.spec.js) |
| `UI-REG-03` | Issue #80 + `.quiz-setup-controls[hidden]` visibility fix | **2 PASS** | [`mobile-quiz-setup-375px.png`](./Evidence/Playwright-Fixes/mobile-quiz-setup-375px.png) |
| `UI-REG-04` | Deadline toast validation + Issue #84 `#task-subject` Light/Dark dropdown contrast & focus ring | **2 PASS** | [`mobile-task-modal-dark-375px.png`](./Evidence/Playwright-Fixes/mobile-task-modal-dark-375px.png) |
| `UI-REG-05` | Rapid Quiz live timer + Retake Quiz clean Question 1 reset | **2 PASS** | [`mobile-quiz-result-375px.png`](./Evidence/Playwright-Fixes/mobile-quiz-result-375px.png) |
| `UI-REG-06` | Issue #83: All 7 viewports (`320`, `375`, `390`, `430`, `768`, `1024`, `1440px`) × Light/Dark (`14` combinations) zero sideways scroll | **2 PASS** | [`mobile-quiz-setup-320px-dark.png`](./Evidence/Playwright-Fixes/mobile-quiz-setup-320px-dark.png), [`desktop-quiz-setup-1440px-light.png`](./Evidence/Playwright-Fixes/desktop-quiz-setup-1440px-light.png) |
| `E2E-QUIZ-04`, `E2E-MOB-04` | Extra credential-gated Retake & Mobile Quiz specs | **4 SKIPPED (`NOT RUN`)** | Requires live `E2E_STUDENT_A_*` |
| `ai-tutor.spec.js` | AI Tutor (`PR #78` / migration `013`) | **DEFERRED / NOT RUN** | Out of Week 11 frozen MVP release gate |

---

## 3. Exact Command for Authorized Personal Execution (`RaiPrabin697` & `princekark`)

```bash
export E2E_STUDENT_A_EMAIL="student_a@example.com"
export E2E_STUDENT_A_PASSWORD="..."
export E2E_STUDENT_B_EMAIL="student_b@example.com"
export E2E_STUDENT_B_PASSWORD="..."

npm run build
npx playwright test --project="Desktop Chrome" --project="Mobile Chrome (Pixel 5)" --reporter=html
```
