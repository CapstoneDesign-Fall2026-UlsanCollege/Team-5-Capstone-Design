# Week 12 — Automated Testing and QA Verification Report

**Project:** Smart Study Companion — Team 5  
**Tester:** Prince Karki  
**GitHub Username:** `princekark`  
**Role:** Tester / Quality Assurance  
**Testing Date:** November 22, 2026  
**Testing Tool:** Playwright  
**Browser:** Chromium (Desktop Chrome Project)  
**Testing Environment:** Local Vite Preview — `http://localhost:4173/`  
**Source:** Downloaded Team 5 GitHub repository ZIP  
**Commit SHA:** Not verified (ZIP download does not include Git history)  
**Status:** Automated Testing Partially Completed — Test Script Issues Identified

---

## 1. Objective

The objective of Week 12 automated testing was to independently verify the core functionality of Smart Study Companion using Playwright.

Testing focused on:

1. Authentication and login validation.
2. Password recovery interface.
3. Study Analytics dashboard.
4. Standard, Rapid, and AI Quiz interfaces.
5. Study Tasks management.
6. Academic onboarding and subject selection.
7. Mobile responsiveness and navigation.

The purpose was to identify failed test cases, verify expected functionality, collect testing evidence, and report issues to the development team.

No application source code changes were made.

---

## 2. Testing Environment and Setup

The following setup was completed successfully:

| Setup Task | Result |
|---|---|
| Downloaded updated project | PASS |
| Installed Node.js dependencies | PASS |
| Installed Playwright | PASS |
| Installed Chromium | PASS |
| Vite production build | PASS |
| Started local application | PASS |
| Created dedicated QA test account | PASS |
| Saved authenticated Playwright session | PASS |
| Configured local authenticated testing | PASS |

**Build command:**

`npm.cmd run build`

**Build result:** PASS — 29 modules transformed.

Playwright was configured to use the dedicated QA account for testing authenticated application pages.

A local `playwright.qa.config.js` configuration and private `qa-auth.json` session file were used.

The authentication session was saved locally and was not uploaded to GitHub.

---

## 3. Automated Testing Summary

The repository contains 24 drafted Playwright browser test cases.

| Metric | Count |
|---|---:|
| Total drafted test cases | 24 |
| Confirmed executed cases | 15 |
| Passed | 7 |
| Failed | 8 |
| Remaining unconfirmed cases | 9 |

**Important:** The reported PASS count includes a Quiz test with conditional assertions that may not have executed. It also includes AUTH-03, which passed after a local test-script correction.

Therefore, the reported PASS count should not be interpreted as complete feature verification.

---

## 4. Authentication Automated Testing

**Test File:** `tests/e2e/auth.spec.js`

**Command:**

`npx.cmd playwright test tests/e2e/auth.spec.js --project="Desktop Chrome"`

### Results

| Test ID | Test Case | Result |
|---|---|---|
| E2E-AUTH-01 | Login page renders required elements | PASS |
| E2E-AUTH-02 | Signup page renders academic fields | PASS |
| E2E-AUTH-03 | Invalid login displays error alert | PASS after local correction |
| E2E-AUTH-04 | Password recovery form and OTP interface | FAIL |
| E2E-AUTH-05 | Unauthenticated dashboard access behavior | PASS |

### Findings

**AUTH-03 — Invalid Login Alert**

The original automated test failed because Playwright searched for `#auth-alert`.

The actual application uses `#form-alert`.

The locator was corrected in the local QA copy, and the individual test was executed again.

**Retest result:** 1 PASS, 0 FAIL.

This was a test-script issue, not a confirmed application bug.

**AUTH-04 — Password Recovery**

The automated test failed because it searched for `#reset-btn` on the Forgot Password page.

The application uses `#forgot-btn` on that page.

Additional password-reset selectors in the test script also differ from the actual application.

**Result:** FAIL — Test-script selector mismatch.

**Recommendation:** The test owner should update the authentication test selectors and rerun the full browser test suite.

---

## 5. Manual Password Recovery Verification

Password recovery was also independently verified through manual testing.

### Results

| Test Case | Result |
|---|---|
| Open Forgot Password page | PASS |
| Submit password recovery request | PASS |
| Receive recovery email | PASS |
| Receive 6-digit verification code | PASS |
| Open password reset form | PASS |
| Set new password successfully | PASS |
| Login using new password | PASS |
| Access authenticated application | PASS |
| Confirm previous password is rejected | PASS |

**Overall Manual Password Recovery Result: PASS**

### Evidence

- `W12-01-forgot-password-page.png`
- `W12-02-recovery-request.png`
- `W12-03-recovery-email-received.png`
- `W12-04-reset-password.png`
- `W12-05-new-password-login.png`
- `W12-05A-AFTER NEW PSW LOG IN .png`
- `W12-06-old-password-rejected.png`

The screenshots support the manual recovery journey. Successful login using the new password was also confirmed by the tester.

**Note:** Email addresses, OTP codes, and passwords must be redacted before screenshots are uploaded to GitHub.

---

## 6. Study Analytics Automated Testing

**Test File:** `tests/e2e/analytics.spec.js`

**Command:**

`npx.cmd playwright test tests/e2e/analytics.spec.js --config=playwright.qa.config.js --project="Desktop Chrome"`

### Results

| Test ID | Test Case | Result |
|---|---|---|
| E2E-ANLY-01 | Analytics KPI cards, completion ring, and weekly chart | FAIL |
| E2E-ANLY-02 | Subject progress and workload breakdown | FAIL |
| E2E-ANLY-03 | Quiz Analytics summary section | PASS |

**Summary:** 1 PASS, 2 FAIL.

### Findings

**ANLY-01**

The test searched for `#stat-total-tasks` or `.stat-total`.

These selectors did not match the Analytics page.

The application uses `#analytics-task-total` for its Analytics task count.

The authenticated browser successfully reached the Analytics view, but the test failed at the Total Tasks assertion.

**ANLY-02**

The test searched for `#subject-progress-list` or `.subject-progress-container`.

The application uses `#subject-progress-container`.

The test therefore failed before completing its remaining assertions.

**ANLY-03**

The Quiz Analytics summary section was successfully located and displayed.

The test passed.

This verifies that the summary section is visible, but does not independently verify the correctness of the underlying statistics.

### Recommendation

Update outdated selectors and rerun all three Analytics tests using the authenticated QA session.

### Evidence

- `W12-AUTO-ANALYTICS-LOGIN-REDIRECT.png`
- `W12-AUTO-ANALYTICS-FULL-RESULT.png` — terminal screenshot to retain with evidence

---

## 7. Quiz Automated Testing

**Test File:** `tests/e2e/quiz.spec.js`

**Command:**

`npx.cmd playwright test tests/e2e/quiz.spec.js --config=playwright.qa.config.js --project="Desktop Chrome"`

### Results

| Test ID | Test Case | Result |
|---|---|---|
| E2E-QUIZ-01 | Quiz setup, modes, and subject selector | FAIL |
| E2E-QUIZ-02 | AI Quiz interface | PASS — limited verification |
| E2E-QUIZ-03 | Start standard quiz and display questions | FAIL |

**Summary:** 1 reported PASS, 2 FAIL.

### Findings

**QUIZ-01**

Playwright encountered a strict-mode error because the selector matched multiple elements containing "Rapid".

The automated test could not uniquely identify the required Rapid Quiz control.

**QUIZ-02**

Playwright reported PASS.

However, the test contains a conditional check that can bypass the AI Quiz assertions when the expected tab is not found.

Therefore, this result does not prove that AI Quiz generation or its interface works correctly.

**QUIZ-03**

The test timed out while searching for the standard quiz start button.

The test expects `#btn-start-standard-quiz`, but the application uses `#quiz-start-btn`.

The failure is consistent with an outdated test locator.

### Recommendation

Correct the Quiz test selectors, ensure assertions execute unconditionally, and add regression coverage for the Retake Quiz feature.

### Evidence

- `W12-AUTO-QUIZ-AUTHENTICATED.png`

---

## 8. Study Tasks Automated Testing

**Test File:** `tests/e2e/tasks.spec.js`

### Results

| Test ID | Test Case | Result |
|---|---|---|
| E2E-TASK-01 | Tasks page displays create button, filters, and task list | FAIL |
| E2E-TASK-02 | Empty task validation | NOT RUN |
| E2E-TASK-03 | Task creation, persistence, completion, and deletion | NOT RUN |
| E2E-TASK-04 | Task search filtering | NOT RUN |

### Findings

TASK-01 failed because Playwright searched for `#btn-add-task`.

The application uses `#add-task-btn`.

Other expected test selectors also differ from the application, including the task search input and task container.

The remaining Tasks tests were not executed in this QA session.

### Recommendation

Update the automated test selectors and execute the remaining Tasks tests using disposable data in the dedicated QA account.

### Evidence

- `W12-AUTO-TASK-01-SELECTOR-FAIL.png`

---

## 9. Academic Onboarding Automated Testing

**Test File:** `tests/e2e/onboarding.spec.js`

### Test Coverage

| Test ID | Test Case | Status |
|---|---|---|
| E2E-ONB-01 | Academic hierarchy selectors | Result not confirmed |
| E2E-ONB-02 | Cascading university and major selection | NOT RUN |
| E2E-ONB-03 | Subject search filtering | NOT RUN |
| E2E-ONB-04 | Subject selection and persistence | NOT RUN |

The Onboarding test was attempted during the session, but its complete terminal result was not preserved.

A source-code comparison also identified that the test expects `#subject-search`, whereas the application uses `#subject-search-input`.

### Recommendation

Confirm and document the Onboarding test result, update mismatched selectors, and complete the remaining tests.

No Onboarding PASS claim is made from the available automated evidence.

---

## 10. Mobile Responsive Automated Testing

**Test File:** `tests/e2e/mobile.spec.js`

**Viewport:** 375 × 667 pixels.

### Results

| Test ID | Test Case | Result |
|---|---|---|
| E2E-MOB-01 | Mobile page loads without horizontal overflow | PASS |
| E2E-MOB-02 | Mobile navigation and theme toggle | FAIL |
| E2E-MOB-03 | Switching between Analytics and Tasks | FAIL |

**Summary:** 1 PASS, 2 FAIL.

### Findings

**MOB-01**

The test successfully verified that the document width did not exceed the simulated mobile viewport beyond the allowed tolerance.

**Result:** PASS.

**MOB-02**

The test expected `#theme-toggle` or `.theme-toggle-btn`.

The application uses `#theme-toggle-btn` and `.theme-toggle`.

The automated test failed because the expected locator was not found.

**MOB-03**

Playwright attempted to click the Study Analytics navigation link while the mobile sidebar was closed.

The element existed but was outside the visible viewport.

The test timed out after 30 seconds.

The test script needs to open the mobile hamburger menu before selecting protected navigation links.

### Recommendation

Update the mobile navigation test sequence and theme-toggle locator. Rerun both failed tests.

### Evidence

- `W12-AUTO-MOBILE-01-PASS.png` — terminal capture to retain
- `W12-AUTO-MOBILE-02-SELECTOR-FAIL.png`
- `W12-AUTO-MOBILE-03-NAVIGATION-TIMEOUT.png`

---

## 11. Two-Student Data Isolation Testing

**Test File:** `tests/e2e/rls-isolation.spec.js`

| Test ID | Description | Status |
|---|---|---|
| E2E-RLS-01 | Student A and Student B data isolation | NOT RUN |
| E2E-RLS-02 | Anonymous API access restrictions | NOT RUN |

Live two-student RLS verification was not completed during this testing session.

The existing two-browser-context test does not, by itself, prove isolation between two separately authenticated student accounts.

### Recommendation

Perform a dedicated live RLS security test using two disposable student accounts and verify database-level isolation.

**Security Status:** Not independently verified in this session.

---

## 12. Consolidated QA Findings

| Finding ID | Area | Finding | Classification |
|---|---|---|---|
| QA-01 | Authentication | Outdated alert selector | Test-script issue |
| QA-02 | Password Recovery | Outdated form selectors | Test-script issue |
| QA-03 | Analytics | KPI selector mismatch | Test-script issue |
| QA-04 | Analytics | Subject progress selector mismatch | Test-script issue |
| QA-05 | Quiz | Multiple elements match Rapid selector | Test-script issue |
| QA-06 | AI Quiz | Conditional assertions may be bypassed | Test coverage issue |
| QA-07 | Quiz | Start button selector mismatch | Test-script issue |
| QA-08 | Tasks | Add Task selector mismatch | Test-script issue |
| QA-09 | Mobile | Theme toggle selector mismatch | Test-script issue |
| QA-10 | Mobile | Sidebar not opened before navigation | Test-script issue |
| QA-11 | RLS | Two-account security verification not executed | Verification gap |
| QA-12 | Quiz | Retake Quiz browser regression not covered | Verification gap |

### Important Observation

Most confirmed failures are associated with outdated or incorrect Playwright selectors and incomplete test setup.

These results should not be classified as confirmed application defects without further investigation.

---

## 13. Recommendations for Developers

1. Update Playwright selectors to match the application's actual HTML elements.
2. Maintain an authenticated QA setup for tests of protected pages.
3. Ensure AI Quiz assertions cannot be silently skipped.
4. Correct the mobile test sequence so the hamburger menu opens before navigation.
5. Add automated Retake Quiz regression testing.
6. Verify Tasks CRUD using disposable test data.
7. Complete the remaining Onboarding test cases.
8. Perform independent two-student Supabase RLS verification.
9. Add browser test execution to the team's CI workflow after the scripts are validated.
10. Retest all failed cases and record the results against an identified Git revision.

---

## 14. Testing Limitations

- Testing was conducted against a local application preview.
- The source was downloaded as a ZIP file, so the exact Git commit could not be verified.
- Some existing Playwright scripts contained outdated selectors.
- Several tests failed before reaching the application behavior they were intended to verify.
- Quiz-02 reported PASS despite potentially bypassed assertions.
- Remaining Tasks and Onboarding test cases were not completely verified.
- Live two-student database isolation was not tested.
- No conclusion about production deployment readiness can be drawn from this testing alone.

The tester made a local correction to the AUTH-03 Playwright test and used a separate local QA authentication configuration.

No application source code was modified, and no changes were pushed to the main Team 5 repository.

---

## 15. Final QA Conclusion

During Week 12, I independently executed Playwright automated tests covering Authentication, Study Analytics, Quiz, Tasks, and Mobile responsiveness.

Out of 24 drafted browser test cases, 15 have confirmed execution results:

- **7 reported PASS**
- **8 FAIL**
- **9 unconfirmed or not executed**

The successful results include authentication page checks, a locally corrected invalid-login test, Quiz Analytics section visibility, and mobile overflow verification.

The testing identified several mismatches between existing automated test scripts and the application's current HTML structure.

The main manual password recovery journey was also independently verified successfully.

**Overall Status: PARTIAL — Automated QA executed, test-script maintenance and additional verification required.**

The application should be retested after the automated test scripts are updated. No production-readiness sign-off is claimed based on these results.

---

**Prepared by:** Prince Karki  
**GitHub:** `princekark`  
**Role:** Tester / QA  
**Project:** Smart Study Companion — Team 5  
**Date:** November 22, 2026
