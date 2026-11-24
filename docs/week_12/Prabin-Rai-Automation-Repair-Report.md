# Week 12 — Playwright Automation Harness Repair Report

**1. Student & GitHub Username:** Prabin Rai (`RaiPrabin697`)  
**2. Assigned Responsibility:** QA Automation, Playwright Test Harness Repair, and Evidence Reconciliation  
**3. Execution & Attribution Note:** Harness repairs and Nov 23/25 test runs documented below were completed **agent-assisted** on branch `week12/final-qa-reconciliation` (`bb7c974`) and require **personal code review, execution, and confirmation by Prabin Rai (`RaiPrabin697`)**. Prabin's prior PR [#76](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/76) reconciled historical Week 11 documentation (`RAI_LIVE_TEST_RECEIPT.md`); this report records the Week 12 Playwright automation repair track ([Issue #81](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/81)).

---

## 4. Professor's Feedback Addressed

1. Establish an explicit Week 12 automation repair record tied to `RaiPrabin697` separately from PR #76 evidence reconciliation.
2. Repair genuine harness bugs (stale selectors, missing mobile drawer opens, missing authentication setup, strict-mode locator ambiguities, broken conditional `if (isVisible())` bypasses, missing cleanup/confirmation modal handling) without deleting assertions or faking passes.
3. Prefer semantic Playwright locators (`getByRole()`, `getByLabel()`, `getByPlaceholder()`, `getByText()` where appropriate) and remove arbitrary fixed delays (`waitForTimeout`).
4. Separate mocked non-cloud UI regression checks cleanly from the 24-case live E2E spec inventory.

---

## 5. Files Inspected & Modified

- **Inspected Directory Check:** Confirmed `public/tests/` does **not** exist in the repository; active browser specs live strictly under [`tests/e2e/`](../../tests/e2e/).
- **Configuration & Helpers:**
  - [`playwright.config.js`](../../playwright.config.js) — added cross-platform local Chrome executable fallback (`resolveLocalChromeExecutable()`) when Playwright-managed Chromium/ffmpeg binaries are not downloaded locally.
  - Created [`tests/e2e/helpers/auth.js`](../../tests/e2e/helpers/auth.js) — shared `loginAsStudent(page, role)` (honest `test.skip` when `E2E_STUDENT_A/B` env vars are unset), accessible `navigateToView()`, `toggleTheme()`, `ensureThemeMode()`, `getSessionFromBrowser()`, and isolated non-cloud `setupMockedDashboardSession()`.
- **Repaired Canonical E2E Specs (24 Core Cases + 2 Regressions):**
  - [`tests/e2e/auth.spec.js`](../../tests/e2e/auth.spec.js) (`E2E-AUTH-01..05`)
  - [`tests/e2e/onboarding.spec.js`](../../tests/e2e/onboarding.spec.js) (`E2E-ONB-01..04`)
  - [`tests/e2e/tasks.spec.js`](../../tests/e2e/tasks.spec.js) (`E2E-TASK-01..04`)
  - [`tests/e2e/analytics.spec.js`](../../tests/e2e/analytics.spec.js) (`E2E-ANLY-01..03`)
  - [`tests/e2e/quiz.spec.js`](../../tests/e2e/quiz.spec.js) (`E2E-QUIZ-01..04`)
  - [`tests/e2e/mobile.spec.js`](../../tests/e2e/mobile.spec.js) (`E2E-MOB-01..04`)
  - [`tests/e2e/rls-isolation.spec.js`](../../tests/e2e/rls-isolation.spec.js) (`E2E-RLS-01..02`)
- **Added Separate Mocked UI Regression Suite (Non-Cloud):**
  - Created [`tests/e2e/ui-regression-mocked.spec.js`](../../tests/e2e/ui-regression-mocked.spec.js) (`UI-REG-01..06`, verified cleanly outside the 24-case live count).

---

## 6. Harness Problems Identified & Repaired

| Area | Original Harness Defect | Fix Implemented |
|---|---|---|
| Auth Alert (`E2E-AUTH-03`) | Expected `#auth-alert` and `.alert-danger\|error`; app uses `#form-alert.is-visible` | Updated locator to `#form-alert` + `is-visible` assertion; used `getByLabel`/`getByRole` across login/signup/recovery |
| Password Recovery (`E2E-AUTH-04`) | Expected `#reset-btn`, `#new-password`, `#submit-btn`, and ambiguous `a[href*="reset-password"]` | Updated to exact controls (`getByRole('button', { name: /Send recovery instructions/i })`, `getByRole('link', { name: /Enter code/i })`, `getByRole('button', { name: /Update password/i })`, `New password`) |
| Unauth Redirect (`E2E-AUTH-05`) | Synchronous URL check + permissive `isLoginPage \|\| hasPreviewBadge` fallback | Replaced with async `await expect(page).toHaveURL(/\/auth\/login\.html/)` |
| Onboarding (`E2E-ONB-01..04`) | Wrong `#onboarding-*` IDs, old major `'Computer Science'`, `.badge-core`, unauthenticated route | Updated to `#academic-*` via `getByLabel`, exact major `'Computer Science & Engineering (CSE)'`, `.core-badge`, `.scrollable-subject-card`, and `loginAsStudent()` |
| Tasks (`E2E-TASK-01..04`) | Wrong `#btn-add-task`, `#task-title`, `#btn-save-task`, `.task-item`, `.btn-delete-task`, `page.on('dialog')`, arbitrary `waitForTimeout(300)` | Switched to semantic `getByRole`/`getByPlaceholder`/`getByLabel`, `.task-card`, `.delete-btn`, `#confirm-modal` Delete button, and zero `waitForTimeout` calls |
| Analytics (`E2E-ANLY-01..03`) | Wrong `#stat-total-tasks`, `#subject-progress-list` | Updated to `#analytics-progress-text`, `#weekly-activity-chart`, `#analytics-task-total`, `#subject-progress-container` |
| Quiz (`E2E-QUIZ-01..04`) | Strict-mode `button:has-text("Rapid")`, wrong `#btn-start-standard-quiz`, silent `if (await aiTab.isVisible())` skip in `E2E-QUIZ-02`, missing Retake coverage | Upgraded to `getByRole('tab', ...)` / scoped panel `getByLabel`, unconditional assertions, and added `E2E-QUIZ-04` Retake Quiz check |
| Mobile (`E2E-MOB-01..04`) | Assumed `#sidebar` visible on 375px viewport; wrong `#theme-toggle` | Added `#open-sidebar-btn` (`getByRole('button', { name: /Open menu/i })`) drawer open + dark-mode toggle check + `E2E-MOB-04` quiz overflow check |
| RLS (`E2E-RLS-01..02`) | `E2E-RLS-01` tested tasks without real distinct login sessions or direct PostgREST modification/deletion denial | Added separate `loginAsStudent(A/B)` + ordinary-JWT PostgREST `GET`/`PATCH`/`DELETE` checks across `tasks`, `quiz_attempts`, `study_activity_events`, `profiles` (`SKIPPED` without credentials); updated `E2E-RLS-02` across 8 live tables |

---

## 7. Execution Comparison (Before vs. After Repair)

- **Environment:** Local Vite Preview (`http://localhost:4173` via `npm run build`), Chromium (`Desktop Chrome` + `Mobile Chrome (Pixel 5)`), branch `week12/final-qa-reconciliation` (`bb7c974` + staged repairs).
- **Command Run (Nov 25, 2026 — Agent-Assisted):**
  ```bash
  npx playwright test tests/e2e/auth.spec.js tests/e2e/onboarding.spec.js tests/e2e/tasks.spec.js tests/e2e/analytics.spec.js tests/e2e/quiz.spec.js tests/e2e/mobile.spec.js tests/e2e/rls-isolation.spec.js tests/e2e/ui-regression-mocked.spec.js --project="Desktop Chrome" --project="Mobile Chrome (Pixel 5)"
  ```

| Category | Historical Nov 22 Run (`princekark`) | Nov 25 Post-Repair Run (Agent-Assisted) | Evidence |
|---|---|---|---|
| **Original 24 E2E Scenarios — Unauth / Anon** (`AUTH-01..05`, `RLS-02`) | 4 PASS, 1 FAIL (`AUTH-04`), 1 NOT RUN (`RLS-02`) | **6 / 6 PASS** (`12 / 12` across Desktop + Mobile Chrome) | [`PLAYWRIGHT_E2E_REPORT.md`](PLAYWRIGHT_E2E_REPORT.md) |
| **Original 24 E2E Scenarios — Authenticated Live** (`ONB-01..04`, `TASK-01..04`, `ANLY-01..03`, `QUIZ-01..03`, `MOB-01..03`, `RLS-01`) | 3 PASS (incl. weak `QUIZ-02`), 7 FAIL, 8 unconfirmed | **18 / 18 SKIPPED (`NOT RUN`)** on live preview pending `E2E_STUDENT_A_*` / `E2E_STUDENT_B_*` credentials | Explicit credential gate in [`helpers/auth.js`](../../tests/e2e/helpers/auth.js) |
| **Extra Regression Cases (`QUIZ-04`, `MOB-04`)** | Not present | **2 / 2 SKIPPED (`NOT RUN`)** pending live credentials | [`quiz.spec.js`](../../tests/e2e/quiz.spec.js), [`mobile.spec.js`](../../tests/e2e/mobile.spec.js) |
| **Separate Non-Cloud Mocked UI Regressions (`UI-REG-01..06`)** | Not present | **6 / 6 PASS** (`12 / 12` across Desktop + Mobile Chrome, 7 viewports × 2 themes) | [`ui-regression-mocked.spec.js`](../../tests/e2e/ui-regression-mocked.spec.js), [`Evidence/Playwright-Fixes/`](Evidence/Playwright-Fixes/) |
| **AI Tutor Spec (`ai-tutor.spec.js`)** | Out of Week 11 frozen MVP | **DEFERRED / NOT INCLUDED IN MVP GATE** | [`ai-tutor.spec.js`](../../tests/e2e/ai-tutor.spec.js) |

---

## 8. Remaining Problems & Review Status

1. **Authenticated Live Browser Execution Pending:** All 18 authenticated canonical E2E cases (plus 2 new Retake/Mobile regressions) remain **SKIPPED / NOT RUN** until Prabin Rai / Prince Karki run the repaired suite using two live disposable accounts (`E2E_STUDENT_A_*` / `E2E_STUDENT_B_*`).
2. **Cross-Browser (`Firefox` / `Safari` / `iPhone 12`) Execution:** Only `Desktop Chrome` and `Mobile Chrome (Pixel 5)` were executed locally (WebKit/Firefox binaries not installed locally).
3. **Attribution & Sign-Off:** All harness repairs above are **agent-assisted** pending Prabin Rai's (`RaiPrabin697`) independent review and personal execution receipt.

---

## 9. Final Conclusion

The Playwright test harness selector, synchronization, and isolation defects tracked under Issue #81 are resolved in code, cleanly tested on unauthenticated/live-anon and non-cloud mocked UI paths (**24 Playwright runs PASS, 40 live-credential runs SKIPPED, 0 FAIL**), and ready for Prabin Rai's personal review and credentialed live execution.
