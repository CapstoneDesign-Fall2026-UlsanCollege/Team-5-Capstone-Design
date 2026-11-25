# Week 12 — Professor Feedback Follow-Up: Independent Playwright QA

**Project:** Smart Study Companion — Team 5  
**Tester:** Prince Karki (`princekark`)  
**Role:** Independent QA / Tester (test, collect evidence, report; no development changes requested)  
**Follow-up date:** November 25, 2026 (Asia/Seoul)  
**Related issue:** #81 — Fix Playwright Test Failures and Complete QA Verification  
**Original report:** Week 12 Independent QA  
**Test environment:** Local Vite preview (`http://localhost:4173`), Playwright Chromium / Desktop Chrome project  
**Original source identification:** Local downloaded ZIP; exact Git SHA not verified. The November 25 retests used this older local copy with some prior local test-only selector edits, not a confirmed checkout of the team's newest revision.

## 1. Professor's Requested Follow-Up

- Classify the eight November 22 failures as test-harness problem or reproduced product defect.
- Have the test-script owner repair incorrect selectors, navigation steps, and weak assertions; independently retest the corrected candidate.
- Complete unconfirmed cases and capture traceable terminal/Playwright evidence.
- Keep the live two-account Supabase RLS (DATA-01 / E2E-RLS-01) test separately marked NOT RUN until actually executed.

## 2. Preserve the Original November 22 Baseline

| Measure | November 22 baseline |
|---|---:|
| Original drafted browser cases | 24 |
| Cases with reported execution outcomes | 15 |
| Reported PASS | 7 |
| Reported FAIL | 8 |
| Unconfirmed / not executed | 9 |

**Interpretation:** The original 7 reported PASS include QUIZ-02, whose conditional assertion could have been bypassed; it was not full AI Quiz verification. Subsequent individual reruns are not added to the 24-case baseline as new unique cases.

## 3. Classification of the Eight Original Failures

| Test ID | November 22 failure evidence | Classification | November 25 independent status |
|---|---|---|---|
| E2E-AUTH-04 | Forgot-password test expected `#reset-btn` rather than `#forgot-btn`; other reset-form selectors were outdated | Harness — selector mismatch | PASS reported after local test-script edit. UI visibility only; not an automated email-delivery proof |
| E2E-ANLY-01 | Expected `#stat-total-tasks`; app uses `#analytics-task-total` | Harness — selector mismatch | PASS reported after local test-script edit |
| E2E-ANLY-02 | Original subject-progress selector outdated; after one local edit, the `#workload-breakdown`, `.workload-container` assertion remained outdated | Harness — selector mismatch | FAIL observed; failed test remains unresolved in the user's older local test copy |
| E2E-QUIZ-01 | Original Rapid button selector matched multiple elements (Playwright strict-mode failure) | Harness — ambiguous locator (supported by prior error) | FAIL observed again; exact November 25 error not captured, so do not overstate its current cause |
| E2E-QUIZ-03 | Test waited for `#btn-start-standard-quiz` / `button:has-text("Start Quiz")`; app uses `#quiz-start-btn` | Harness — outdated selector | FAIL observed, with 30-second locator timeout in the Playwright error report |
| E2E-TASK-01 | Original test used `#btn-add-task`; app uses `#add-task-btn` | Harness — outdated selector | No new conclusive retest receipt provided |
| E2E-MOB-02 | Original test looked for `#theme-toggle` or `.theme-toggle-btn`; app uses `#theme-toggle-btn` | Harness — outdated selector | No November 25 retest receipt provided |
| E2E-MOB-03 | Test clicked hidden sidebar Analytics link without first opening the mobile hamburger menu | Harness — missing navigation step | No November 25 retest receipt provided |

**Confirmed reproduced product defects from these eight reports:** None established by the available evidence. This does not certify that all application features are defect-free; several tests stopped before reaching their intended functional assertion.

## 4. Additional November 25 Individual Retests

These entries summarize the tester's subsequent runs on the older local copy. They are not a fresh complete suite result.

| Test ID | Result | Evidence / limitation |
|---|---|---|
| E2E-AUTH-04 | PASS (tester-reported) | After local test-only selector edits. No terminal PASS screenshot supplied in this evidence bundle |
| E2E-ANLY-01 | PASS (tester-reported) | After local test-only selector edits. No terminal PASS screenshot supplied in this evidence bundle |
| E2E-ANLY-02 | FAIL (screenshot) | `W12-RETEST-ANLY-02-FAIL.png`: outdated workload-container assertion remains |
| E2E-QUIZ-01 | FAIL (screenshot) | `W12-RETEST-QUIZ-01-FAIL.png`: terminal FAIL; current error detail not supplied |
| E2E-QUIZ-03 | FAIL (screenshot + error) | `W12-RETEST-QUIZ-03-FAIL.png` and `W12-RETEST-QUIZ-03-ERROR.png`: timeout waiting for stale Start Quiz button selector |
| E2E-TASK-04 | FAIL (screenshot) | `W12-RETEST-TASK-04-FAIL.png`: older script failed while filling `#task-search-input`; current app uses `#search-input` |
| E2E-TASK-01 | Unconfirmed | A command was suggested, but no new result was supplied |

**Manual password recovery:** Previously reported PASS (reset email received, password updated, new-password login succeeded, old password rejected); manual evidence exists in the repository. This is separate from the automated AUTH-04 form-visibility check.

## 5. Developer / Agent-Assisted Runs Are Separate Evidence

The team's Playwright E2E report records a November 25 agent-assisted run, distinct from Prince Karki's independent local run:

- Across the original 24 unique cases, the report records 6 PASS, 18 SKIPPED on each of Desktop Chrome and Mobile Chrome (12 passed browser invocations and 36 skipped). Most authenticated tests were skipped for missing student credentials.
- A separate mocked UI regression suite recorded 12 passing browser invocations across two browser projects; mocked tests do not establish live Supabase authentication or database isolation.
- Combining original + additional test suites, the report lists 24 PASS, 40 SKIPPED, 0 FAIL across its two browser projects. These figures are not an independent 24/24 live-feature pass and must not be attributed to the tester's November 25 local screenshots.

These separate results suggest test-script maintenance has progressed in the repository, but independent verification of the approved corrected version is still needed.

## 6. Remaining Verification and Ownership

| Scope | Current status | Responsible next action |
|---|---|---|
| Correct stale selectors/navigation and false-PASS guards | Developer-owned; corrections documented in newer repository | Test/harness developer confirms reviewed revision and shares runnable QA instructions |
| Independent retest of all eight original failures | Partially retested on older local copy | Tester reruns unchanged, team-approved tests and captures PASS/FAIL/error screenshots |
| E2E-TASK-02/03, unconfirmed onboarding and other unexecuted cases | Not independently verified in this follow-up | Tester runs safe cases on approved QA account; destructive tests only on disposable data with team authorization |
| AI Quiz QUIZ-02 assertion coverage | Not established by original reported PASS | Developer ensures assertions actually run; tester verifies |
| Two-account authenticated RLS DATA-01 / E2E-RLS-01 | NOT RUN | Requires two separate disposable student accounts and live cross-account verification; keep separate from anonymous REST checks |
| Product release approval | NOT ESTABLISHED | Security, live deployment, and team release gates remain separate |

## 7. Evidence Register

The accompanying ZIP contains unchanged copies of screenshots previously shared in the conversation. None is a fabricated screenshot or a new execution by the assistant. The evidence index (`EVIDENCE_INDEX.md`) lists the scope and limitations of each capture.

- `W12-RETEST-ANLY-02-FAIL.png`
- `W12-RETEST-QUIZ-01-FAIL.png`
- `W12-RETEST-QUIZ-03-FAIL.png`
- `W12-RETEST-QUIZ-03-ERROR.png`
- `W12-RETEST-TASK-04-FAIL.png`
- `W12-BASELINE-MOB-02-SELECTOR-FAIL.png`
- `W12-BASELINE-MOB-03-NAVIGATION-TIMEOUT.png`
- `W12-BASELINE-TASK-01-SELECTOR-FAIL.png`
- `W12-BASELINE-QUIZ-AUTHENTICATED.png`

No new screenshot for a test which was not actually executed has been created. Earlier password recovery screenshots are excluded from the ZIP to avoid redistributing possible email addresses, verification codes, or passwords.

## 8. Tester Conclusion for the Professor

The November 22 independent run provided 15 reported outcomes out of 24 cases. The eight original failures can be traced to test-harness locator or browser-navigation errors on the evidence available; no product defect is independently established by those failures. On November 25, the tester reported successful individual reruns of AUTH-04 and ANLY-01 after local test edits, while ANLY-02, QUIZ-01, QUIZ-03, and an additional TASK-04 case still failed on an older local ZIP copy. The supported screenshots and the detailed QUIZ-03 timeout are attached.

The tester's scope is to execute approved tests, document factual outcomes, and report defects, not to make production or test-script changes. The team has separately documented updated harness work and agent-assisted results; the corrected live-authenticated suite remains to be independently rerun. Two-account RLS remains NOT RUN and is not counted as passed.

**Status:** PARTIAL — classification documented and available evidence packaged; independent full-suite verification still pending.
