# Weekly Report

**Team:** Team 5 — Smart Study Companion (Ulsan College)  
**Week:** 12  
**Date:** November 20, 2026  
**Repository:** [Team-5-Capstone-Design](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design)  
**Recorded work branch:** `week12/p0-p1-verification-and-fixes` (merged through [PR #72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/72) and [PR #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75))  
**Final Week 12 Status:** **NO-GO (Critical P0 Live Verification & Sign-Off Gates Pending)**

**Reading note:** This report records the November 20 Week 12 assessment and the November 22 independent QA update. The code changes are on `main`. Their presence in Git does not verify the active Vercel build. Claim boundaries are in the [Week 12 evidence map](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/README.md#evidence-map).

## This week's goal

Week 12 focused on P0/P1 stabilization, bug fixes, peer QA handoff, migration hygiene, and honest verification of deployment and security gates before final handoff.

> Fix defects found after Week 11, record only what was actually verified, and keep the deferred AI Tutor unimplemented.

## What we committed to do

- [x] **PR #69 (merged `f2c1134`):** Remove the broken Wireframes sidebar link that returned `404: NOT_FOUND` on Vercel.
- [x] **PR #71 (merged `4183944`):** Fix Retake Quiz through `retakeCurrentQuiz()`, `snapshotQuizConfig()`, and `createQuizAttemptState()`, and add 5 Vitest regression tests.
- [x] **PRs #72 and #75:** Fix the Task Modal empty/invalid deadline crash with `parseDeadlineInputToIso()`.
- [x] Fix the UTC date offset in `dateInputValue()` with `formatLocalDateInput()`.
- [x] Remove the 20-attempt slice cap in `loadAndRenderQuizHistory()` and raise the fetch limit to `200`.
- [x] Rename the unapplied quiz migration to `012_quiz_difficulty_and_repetition.sql` so it no longer shares the `011_` prefix.
- [x] Write the Week 12 audit, SMTP, DATA-01, Playwright, bug-fix, and deployment reports.
- [x] Configure Brevo Custom SMTP in the Supabase Dashboard (verified sender, deactivated Brevo SMTP key IP blocking, fixed the SMTP login `Username`, verified URL Configuration and the recovery template). Live password reset was confirmed on November 20, 2026, and Prince Karki independently rechecked the manual recovery path on November 22.
- [ ] Apply and verify `009_ai_quiz_tables.sql`, `010_complete_universities.sql`, and `012_quiz_difficulty_and_repetition.sql` in live Supabase.
- [ ] Deploy `generate-ai-quiz` and run a live API test.
- [ ] Run live DATA-01 two-student RLS.
- [ ] Finish Playwright: November 22 executed 15 of 24 cases (7 reported PASS, 8 FAIL, 9 unconfirmed). Script fixes and a full rerun are still open ([Issue #81](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/81)).
- [ ] Capture `RT-03`–`RT-08`, record the active Vercel SHA, and collect five peer sign-offs.

## 2. Work completed

- **PR #69 (merged `f2c1134`):** Removed the broken Wireframes sidebar link.
- **PR #71 (merged `4183944`):** Fixed Retake Quiz and added 5 Vitest regression tests.
- **Week 12 work branch `week12/p0-p1-verification-and-fixes`, merged via [PR #72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/72) and [PR #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75):**
  - Fixed the Task Modal empty/invalid deadline crash (`parseDeadlineInputToIso()`).
  - Fixed the UTC date offset in `dateInputValue()` (`formatLocalDateInput()`).
  - Removed the 20-attempt slice cap in `loadAndRenderQuizHistory()` (fetch limit raised to `200`).
  - Resolved the duplicate `011_` prefix by renaming the unapplied quiz migration to `012_quiz_difficulty_and_repetition.sql`.
  - Authored the Week 12 audit, SMTP, DATA-01, Playwright, bug-fix, and deployment verification reports.
  - Configured Brevo Custom SMTP and confirmed live password reset on November 20, 2026.

## 3. Database and backend

- `011_study_streak_analytics.sql`: Applied by user in the Supabase SQL Editor on November 17.
- `009_ai_quiz_tables.sql`, `010_complete_universities.sql`, and `012_quiz_difficulty_and_repetition.sql`: **UNVERIFIED** in live Supabase from the local session.
- **Brevo Custom SMTP / Password Reset ([Issue #40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40)):** User-reported live password-reset success on November 20, 2026. The [SMTP report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/AUTH_SMTP_VERIFICATION.md) does not itself link an independent sanitized run receipt. On November 22, Prince Karki independently verified email delivery, reset by verification code, login with the new password, and rejection of the previous password. Signup verification and expired-token checks remain unverified.
- **`generate-ai-quiz` Edge Function:** **UNVERIFIED**, pending Supabase CLI deployment and a live API test.

## 4. Security verification

- **DATA-01 (Two-Student Authenticated RLS):** **NOT RUN** in live Supabase. The procedure is in [DATA-01-RLS-VERIFICATION.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/DATA-01-RLS-VERIFICATION.md). The November 22 session also left `E2E-RLS-01` and `E2E-RLS-02` not run.

## 5. Automated testing

November 20 recorded result for the Week 12 work branch:

- **Vitest (`npm test`):** **79 / 79 PASS** (11 files; local unit and contract tests).
- **Python system harness (`tests/run_tests.py`):** **11 / 11 PASS**.
- **Python AI Quiz suite (`tests/test_ai_quiz.py`):** **4 / 4 PASS**.
- **Vite build (`npm run build`):** **PASS** (6 HTML entry points).
- **Playwright (`npx playwright test`):** **0 / 24 EXECUTED** on November 20, because `@playwright/test` was not installed in that session.

November 22 independent update (Prince Karki, local Vite preview, Playwright + Chromium): **15 executed with confirmed results, 7 reported PASS, 8 FAIL, 9 unconfirmed.** Details are in section 14.

## 6. Manual testing

- On November 20, browser screenshot evidence `RT-03`–`RT-08` and DATA-01 was **NOT RUN**.
- On November 22, manual password recovery was independently verified as **PASS**: recovery email, verification code, new-password login, and previous-password rejection. Evidence is in the [Week 12 Evidence folder](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/main/docs/week_12/Evidence).

## 7. Bug fixes

Retake Quiz ([PR #71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/71)), Wireframes `404` ([PR #69](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/69)), Task Modal empty-deadline crash, UTC midnight date offset, Quiz History 20-attempt cap, and the duplicate `011_` migration prefix.

See [BUG_FIX_REGRESSION_REPORT.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/BUG_FIX_REGRESSION_REPORT.md) and [QUIZ_RETAKE_BUG_FIX_REPORT.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/QUIZ_RETAKE_BUG_FIX_REPORT.md).

## 8. Independent peer QA and sign-off status

| Member | Assigned Area | Verification | Sign-off |
|---|---|---|---|
| Sumit Adhikari (`adronnie`) | Database & Supabase | Local SQL verified; live `009` / `010` / `012` and DATA-01 pending | **PENDING** |
| Nabin Khadka (`liftupkhadka555-spec`) | Full-Stack Integration & Deployment | Code fixes, local suites, and Brevo password reset verified; Vercel org and Playwright QA pending | **PENDING** |
| Prabin Rai (`RaiPrabin697`) | QA Automation | November 20 recorded 0/24. November 22 moved execution to 15/24; script fixes in Issue #81 are still pending | **PENDING** |
| Prince Karki (`princekark`) | QA & Independent Testing | November 22 Playwright partial run and manual password-recovery PASS recorded; live DATA-01 still pending | **PENDING** |
| J.N. Taj Oli (`jn-oli`) | UI/UX & Frontend | Week 12 UI/retake peer review pending. Design-only AI Tutor spec is local commit `1476c9f` and is not on `origin` yet | **PENDING** |

## 9. Deployment

- Personal fork `liftupkhadka555-spec/Team-5-Capstone-Design` `main` was verified synced to `4183944`.
- That fork-sync receipt predates the Week 12 merge. The active Vercel deployment SHA, and its relationship to current `main`, remain unknown.
- Course-organization Vercel GitHub App approval ([Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59)) remains **PENDING**. See [DEPLOYMENT_VERIFICATION.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/DEPLOYMENT_VERIFICATION.md).

## Evidence links

| Evidence | Link |
|---|---|
| Issue(s) | [Issue #40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40); [Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59); [Issue #79](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/79); [Issue #80](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/80); [Issue #81](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/81) |
| PR(s) / commits | [#69](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/69) `f2c1134`; [#71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/71) `4183944`; [#72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/72); [#75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75); [#76](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/76) |
| Screenshot / demo | [Week 12 Evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/main/docs/week_12/Evidence). `RT-03`–`RT-08` and DATA-01 screenshots were not run on November 20. November 22 recovery and Playwright captures are listed in the automated QA report. |
| Test/check note | [Playwright, November 20, 0/24](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/PLAYWRIGHT_E2E_REPORT.md); [Prince automated QA, November 22, 15/24](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md); [bug-fix regression](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/BUG_FIX_REGRESSION_REPORT.md); [SMTP](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/AUTH_SMTP_VERIFICATION.md) |
| Document update | [Week 12 weekly report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/weekly-report.md); [technical audit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/TECHNICAL_AUDIT.md); [quiz retake report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/QUIZ_RETAKE_BUG_FIX_REPORT.md); [deployment verification](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/DEPLOYMENT_VERIFICATION.md) |
| Current codebase area map / ownership audit | [Ownership audit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/AI_USE_AND_CODE_OWNERSHIP_AUDIT.md) and [Slice plan](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Slice.md). No ownership-map update was committed this week. |

## Individual contribution entries — one row per student

| Student | What they did | Evidence link |
|---|---|---|
| Nabin Khadka (`liftupkhadka555-spec`) | Fixed Wireframes, Retake Quiz, deadline validation, the local date offset, the quiz-history cap, and the `012_` migration, and wrote the Week 12 verification package. | [PR #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75) |
| Prabin Rai (`RaiPrabin697`) | Reconciled Week 11 evidence boundaries and merged the evidence-led Week 12 package. | [PR #76](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/76) |
| Prince Karki (`princekark`) | On November 22, ran 15 of 24 Playwright cases (7 reported PASS, 8 FAIL, 9 unconfirmed). Most failures were outdated selectors or missing test steps. The same session recorded a manual password-recovery pass: recovery email, verification code, new-password login, and old-password rejection. Live two-account RLS was not run. |[Issue #81](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/81);  [automated QA report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md); [Evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/3bf1d50798a0aff7236188fa4b9d658492a6cb3a/docs/week_12/Evidence) |
| J.N. Taj Oli (`jn-oli`) | Wrote the design-only AI Tutor UI/UX specification for the deferred #view-assistant, and opened two unfixed UI bugs: subject cards do not toggle with Enter or Space, and the selected quiz-mode button does not look selected. |[AI_TUTOR_UI_UX_SPEC](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/f1184cc48ad7ae967bfdc92d39848cc72dd543f6/docs/week_12/AI_TUTOR_UI_UX_SPEC.md), [Issue #80](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/80), [Issue #79](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/79)|
| Sumit Adhikari (`adronnie`) | No new Week 12 repository check from November 19–22. Live `009` / `010` / `012` and DATA-01 remain pending. | No Week 12 evidence link |

## Blockers or risks

| Blocker/risk | Owner | Next action |
|---|---|---|
| Live DATA-01 two-student RLS is not executed | Prince Karki, Prabin Rai, Sumit Adhikari | Run DATA-01 with 2 disposable accounts and capture redacted screenshots |
| `generate-ai-quiz` is unverified; signup verification and expired recovery token are still open | Sumit Adhikari, Nabin Khadka | Run `009`, `010`, and `012` in the Supabase Dashboard, deploy the Edge Function, and log those email checks |
| Playwright is 8 FAIL and 9 unconfirmed; failures are mostly outdated selectors, missing mobile navigation, and weak AI Quiz assertions | Prabin Rai, Nabin Khadka | Fix the scripts in Issue #81, then rerun and capture `RT-03`–`RT-08` |
| Active Vercel SHA is unknown; fork sync to `4183944` predates the Week 12 merge. Issue #59 is pending | Nabin Khadka | Record the live deployment SHA and compare it with the merged revision |
| All 5 peer QA and freeze sign-offs are pending | All 5 members | Complete the swaps in [QA_EVIDENCE_MATRIX.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week9/QA_EVIDENCE_MATRIX.md) and sign [FEATURE_FREEZE_DECISION.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_11/FEATURE_FREEZE_DECISION.md) |

## Decision record

| Decision | Why we chose it | Owner | Evidence / Issue link |
|---|---|---|---|
| Week 12 stays NO-GO | Local unit, system, and build checks pass, and the P1 fixes are merged, but live RLS, the Edge Function, a full browser rerun, the Vercel SHA, and sign-offs are still open | Team 5 | [Week 12 weekly report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/weekly-report.md) |
| Rename the unapplied quiz migration to `012_quiz_difficulty_and_repetition.sql` | `011_study_streak_analytics.sql` was already applied on November 17 | Nabin Khadka | [PR #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75) |
| Treat November 22 password recovery as an independent manual PASS, and leave other email paths unverified | Prince verified email, code, new-password login, and old-password rejection. Signup verification and expired-token checks were not part of that run | Prince Karki | [Issue #40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40) |
| Keep the November 22 Playwright failures as test-script work, not confirmed product bugs, until the scripts are corrected and rerun | Most failures came from outdated selectors or missing navigation steps. One AI Quiz PASS has limited assertion coverage | Prince Karki | [Issue #81](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/81) |
| Keep the AI Tutor out of the MVP | The Week 11 freeze deferred `#view-assistant` so bug triage would stay ahead of a new feature | Team 5 | [Feature freeze decision](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_11/FEATURE_FREEZE_DECISION.md) |

## 14. November 22 — Independent Playwright QA update (Prince Karki)

**Tester:** Prince Karki (`princekark`)  
**Role:** Independent QA / Tester  
**Date:** November 22, 2026  
**Testing Tool:** Playwright + Chromium  
**Environment:** Local Vite Preview  
**Status:** Partial verification completed

### Automated testing results

| Result | Count |
|---|---:|
| Total drafted Playwright test cases | 24 |
| Executed with confirmed results | 15 |
| Reported PASS | 7 |
| FAIL | 8 |
| Unconfirmed / Not executed | 9 |

The November 20 report recorded 0/24 browser tests executed. This November 22 update is the later independent run. It covered Authentication, Study Analytics, Quiz, Study Tasks, and Mobile responsiveness.

Several failures were caused by outdated Playwright selectors or missing navigation steps, rather than confirmed application bugs. One AI Quiz test reported PASS with limited assertion coverage.

### Manual password recovery

Independently verified:

- Password recovery email delivery.
- Password reset using the verification code.
- Successful login using the new password.
- Previous password rejected after reset.

**Result:** PASS

### Findings and follow-up

The run found test-script maintenance work: incorrect selectors, incomplete mobile navigation steps, and insufficient AI Quiz assertions. Remaining Tasks, Onboarding, and two-student Supabase RLS verification still need testing.

**GitHub Issue:** [#81 — Fix Playwright Test Failures](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/81)  
**Detailed report:** [Prince Karki — Week 12 Automated QA Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md)  
**Evidence:** [Week 12 Screenshots](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/main/docs/week_12/Evidence)

### QA conclusion

Independent Playwright testing moved from the earlier 0/24 recorded status to 15/24 cases with confirmed execution results. Developer fixes and regression retesting remain pending. The project NO-GO status stays in place because live RLS verification and the other release gates are not complete.

## 13. Final Week 12 status

**NO-GO (Critical P0 Gates Remain Unverified).** Local unit, system, and build checks passed, the P1 code fixes are implemented, Brevo password reset had a reported live success on November 20, and Prince’s November 22 manual recovery check passed. Production or demo readiness stays unclaimed until live DATA-01 RLS verification, a live `generate-ai-quiz` check, the Playwright script fixes and rerun, and team sign-offs are completed with evidence.

## Next week's bridge task

- **Sumit / Nabin:** Verify or run `009`, `010`, and `012` in the Supabase Dashboard, deploy `generate-ai-quiz`, and log live signup and token-expiry email checks.
- **Prince / Prabin / Sumit:** Execute DATA-01 with 2 disposable accounts and capture redacted screenshots.
- **Prabin / Nabin:** Correct the Playwright scripts from Issue #81, rerun the 8 failures and 9 unconfirmed cases, and capture `RT-03`–`RT-08`.
- **Nabin:** Record the active Vercel deployment SHA and compare it with the intended merged revision. Keep the fork-sync claim separate from the deployment claim.
- **All 5 members:** Complete the peer QA swaps and sign the feature-freeze decision. A non-author also runs the Week 13 clean-start setup from `README.md` and `supabase/setup_all.sql`.
