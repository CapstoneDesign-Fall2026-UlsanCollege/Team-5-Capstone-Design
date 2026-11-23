# Weekly Report

**Team:** Team 5 — Smart Study Companion
**Week:** 12  
**Date:** November 20, 2026, updated through November 23, 2026  
**Repository:** [Team-5-Capstone-Design](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design)  
**Recorded work branch:** `week12/p0-p1-verification-and-fixes` (merged through [PR #72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/72) and [PR #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75))  
**Final Week 12 Status:** **NO-GO (Critical P0 Live Verification & Sign-Off Gates Pending)**

**Reading note:** This report records the November 20 Week 12 assessment, the November 22 independent QA update, and the November 23 retake review. The code changes are on `main`. Their presence in Git does not verify the active Vercel build. Claim boundaries are in the [Week 12 evidence map](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/README.md#evidence-map).

## This week's goal

Week 12 focused on P0/P1 stabilization, bug fixes, peer QA handoff, migration hygiene, and honest verification of deployment and security gates before final handoff.

> Fix defects found after Week 11, and record only what was actually verified. The Week 11 freeze deferred the AI Tutor. [PR #78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/78) later added a local implementation. The live `013` deploy and `GEMINI_API_KEY` secret are still pending.

## What we committed to do

- [x] **PR #69 (merged `f2c1134`):** Remove the broken Wireframes sidebar link that returned `404: NOT_FOUND` on Vercel.
- [x] **PR #71 (merged `4183944`):** Fix Retake Quiz through `retakeCurrentQuiz()`, `snapshotQuizConfig()`, and `createQuizAttemptState()`, and add 5 Vitest regression tests.
- [x] **PRs #72 and #75:** Fix the Task Modal empty/invalid deadline crash with `parseDeadlineInputToIso()`.
- [x] Fix the UTC date offset in `dateInputValue()` with `formatLocalDateInput()`.
- [x] Remove the 20-attempt slice cap in `loadAndRenderQuizHistory()` and raise the fetch limit to `200`.
- [x] Rename the unapplied quiz migration to `012_quiz_difficulty_and_repetition.sql` so it no longer shares the `011_` prefix.
- [x] Write the Week 12 audit, SMTP, DATA-01, Playwright, bug-fix, and deployment reports.
- [x] Configure Brevo Custom SMTP in the Supabase Dashboard (verified sender, deactivated Brevo SMTP key IP blocking, fixed the SMTP login `Username`, verified URL Configuration and the recovery template). Live password reset was confirmed on November 20, 2026, and Prince Karki independently rechecked the manual recovery path on November 22.
- [x] **PR #78 (merged `03ae6a4`):** Add the local Gemini AI Tutor implementation. Live cloud `013` deploy and the `GEMINI_API_KEY` secret remain pending.
- [ ] Apply and verify `009_ai_quiz_tables.sql`, `010_complete_universities.sql`, and `012_quiz_difficulty_and_repetition.sql` in live Supabase.
- [ ] Deploy `generate-ai-quiz` and run a live API test.
- [ ] Run live DATA-01 two-student RLS.
- [ ] Finish Playwright: November 22 executed 15 of 24 cases (7 reported PASS, 8 FAIL, 9 unconfirmed). Script fixes and a full rerun are still open ([Issue #81](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/81)).
- [ ] Add the named files `RT-03`–`RT-08`. November 23 manual retake shots are already in [Evidence1](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Evidence1/Retake%20Quiz%20Evidence.md). Record the active Vercel SHA, and collect five peer sign-offs.

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
- **PR #78 (merged `03ae6a4`):** Added the local personalized Gemini AI Tutor. Live `013` deployment and the `GEMINI_API_KEY` secret are still pending.

## 3. Database and backend

- `011_study_streak_analytics.sql`: Applied by user in the Supabase SQL Editor on November 17.
- `009_ai_quiz_tables.sql`, `010_complete_universities.sql`, and `012_quiz_difficulty_and_repetition.sql`: **UNVERIFIED** in live Supabase from the local session.
- `013_ai_tutor.sql`: Added in the repository by PR #78. It is not recorded as applied in live Supabase.
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
- On November 23, J.N. Taj Oli checked Retake Quiz in dark mode, for Standard and Rapid, on desktop and a phone-width screen. Retake stayed in Data Structures & Algorithms (EASY), opened Question 1 of 6 with no answer selected, and the question order changed. Quiz history kept the earlier attempts. The shots are in [Evidence1](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Evidence1/Retake%20Quiz%20Evidence.md). The named files `RT-03`–`RT-08` are still absent. He opened [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83) because the Quiz section scrolls sideways on a phone-width screen.

## 7. Bug fixes

Retake Quiz ([PR #71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/71)), Wireframes `404` ([PR #69](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/69)), Task Modal empty-deadline crash, UTC midnight date offset, Quiz History 20-attempt cap, and the duplicate `011_` migration prefix.

See [BUG_FIX_REGRESSION_REPORT.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/BUG_FIX_REGRESSION_REPORT.md) and [QUIZ_RETAKE_BUG_FIX_REPORT.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/QUIZ_RETAKE_BUG_FIX_REPORT.md).

The November 23 mobile Quiz sideways scroll is open in [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83). It is not fixed.

## 8. Independent peer QA and sign-off status

| Member | Assigned Area | Verification | Sign-off |
|---|---|---|---|
| Sumit Adhikari (`adronnie`) | Database & Supabase | Proposed AI Tutor database model recorded. Live `009` / `010` / `012` and DATA-01 pending | **PENDING** |
| Nabin Khadka (`liftupkhadka555-spec`) | Full-Stack Integration & Deployment | Code fixes, local suites, Brevo password reset, local AI Tutor, and Nov 23 release audit / Playwright (`22 PASS / 40 SKIPPED`) & UI fixes (`#79`, `#80`, `#83`, `#84`, `.quiz-setup-controls[hidden]`) verified on branch `week12/release-readiness-qa-fixes`. Live `009`/`010`/`012`, `generate-ai-quiz`, official Vercel SHA, `013`/`GEMINI_API_KEY`, and `DATA-01` pending | **PENDING** |
| Prabin Rai (`RaiPrabin697`) | QA Automation | November 20 recorded 0/24. November 22 moved execution to 15/24; script fixes in Issue #81 are still pending | **PENDING** |
| Prince Karki (`princekark`) | QA & Independent Testing | November 22 Playwright partial run and manual password-recovery PASS recorded; live DATA-01 still pending | **PENDING** |
| J.N. Taj Oli (`jn-oli`) | UI/UX & Frontend | November 23 retake check recorded in dark mode for Standard and Rapid, on desktop and a phone-width screen. Subject and difficulty stayed Data Structures & Algorithms (EASY). Question order changed. Issue #83 records the sideways scroll. Design-only AI Tutor spec `1476c9f` is on `origin/main`. Freeze sign-off is still open | **PENDING** |

## 9. Deployment

- An earlier personal-fork receipt synced `liftupkhadka555-spec/Team-5-Capstone-Design` `main` to `4183944`. That receipt predates the Week 12 merge.
- Nabin’s later row records a personal-fork sync to `03ae6a4` through [PR #78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/78).
- The course-organization Vercel deployment SHA is still unknown. Neither fork SHA is a claim about that live deployment.
- Course-organization Vercel GitHub App approval ([Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59)) remains **PENDING**. See [DEPLOYMENT_VERIFICATION.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/DEPLOYMENT_VERIFICATION.md).

## Evidence links

| Evidence | Link |
|---|---|
| Issue(s) | [Issue #40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40); [Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59); [Issue #79](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/79); [Issue #80](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/80); [Issue #81](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/81); [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83); [issue #84](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84#issue-6552876384) |
| PR(s) / commits | [#69](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/69) `f2c1134`; [#71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/71) `4183944`; [#72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/72); [#75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75); [#76](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/76); [#78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/78) `03ae6a4` |
| Screenshot / demo | [Week 12 Evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/main/docs/week_12/Evidence). `RT-03`–`RT-08` and DATA-01 screenshots were not run on November 20. November 22 recovery and Playwright captures are listed in the automated QA report. November 23 retake shots are in [Evidence1](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Evidence1/Retake%20Quiz%20Evidence.md). |
| Test/check note | [Playwright, November 20, 0/24](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/PLAYWRIGHT_E2E_REPORT.md); [Prince automated QA, November 22, 15/24](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md); [bug-fix regression](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/BUG_FIX_REGRESSION_REPORT.md); [SMTP](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/AUTH_SMTP_VERIFICATION.md); [retake peer review, November 23](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/QUIZ_RETAKE_PEER_REVIEW.md) |
| Document update | [Week 12 weekly report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/weekly-report.md); [technical audit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/TECHNICAL_AUDIT.md); [quiz retake report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/QUIZ_RETAKE_BUG_FIX_REPORT.md); [deployment verification](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/DEPLOYMENT_VERIFICATION.md); [AI Tutor implementation report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/ai_tutor/AI_TUTOR_IMPLEMENTATION_REPORT.md); [AI Tutor testing report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/ai_tutor/AI_TUTOR_TESTING_REPORT.md); [AI Tutor setup guide](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/ai_tutor/AI_TUTOR_SETUP_GUIDE.md) |
| Current codebase area map / ownership audit | [Ownership audit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/AI_USE_AND_CODE_OWNERSHIP_AUDIT.md) and [Slice plan](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Slice.md). No ownership-map update was committed this week. |

## Individual contribution entries — one row per student

| Student | What they did | Evidence link |
|---|---|---|
| Nabin Khadka (`liftupkhadka555-spec`) | Fixed the broken Wireframes sidebar link (PR #69), Retake Quiz flow + regression tests (PR #71), Task Modal empty/invalid deadline validation (`parseDeadlineInputToIso()`), UTC date offset (`formatLocalDateInput()`), Quiz History 20-attempt cap, and `012_quiz_difficulty_and_repetition.sql` rename (PR #72, PR #75); configured Brevo Custom SMTP (`smtp-relay.brevo.com:587`, verified sender, SMTP IP blocking deactivated, `Username` fix, recovery template/URL config) resolving Issue #40 live password recovery; implemented and locally verified the personalized Gemini AI Tutor (`#ai-tutor`, `013_ai_tutor.sql` & rollback — live cloud `013` deploy & `GEMINI_API_KEY` pending, kept out of MVP gate) (PR #78); synced personal Vercel fork `main` to `03ae6a4`; on `week12/release-readiness-qa-fixes`, fixed Playwright E2E selectors/mobile drawer/unconditional assertions (`Issue #81`, Nov 23 rerun **22 PASS / 40 SKIPPED**), resolved Issues `#79`, `#80`, `#83`, `#84`, and `.quiz-setup-controls[hidden]` visibility bug with Chrome 375px dark/light evidence screenshots, executed live anon Supabase schema/Edge Function/Vercel bundle probes, corrected `README.md` testing claims, and authored `RELEASE_VERIFICATION_REPORT.md` + updated Week 12 verification docs. | [PR #69](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/69); [PR #71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/71); [PR #72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/72); [PR #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75); [PR #78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/78); [PR #82](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/82); [Issue #40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40); **Week 12 Docs:** [`RELEASE_VERIFICATION_REPORT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/RELEASE_VERIFICATION_REPORT.md), [`weekly-report.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/weekly-report.md), [`README.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/README.md), [`TECHNICAL_AUDIT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/TECHNICAL_AUDIT.md), [`QUIZ_RETAKE_BUG_FIX_REPORT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/QUIZ_RETAKE_BUG_FIX_REPORT.md), [`BUG_FIX_REGRESSION_REPORT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/BUG_FIX_REGRESSION_REPORT.md), [`AUTH_SMTP_VERIFICATION.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/AUTH_SMTP_VERIFICATION.md), [`DATA-01-RLS-VERIFICATION.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/DATA-01-RLS-VERIFICATION.md), [`PLAYWRIGHT_E2E_REPORT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/PLAYWRIGHT_E2E_REPORT.md), [`DEPLOYMENT_VERIFICATION.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/DEPLOYMENT_VERIFICATION.md), [`Evidence/Playwright-Fixes/`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/main/docs/week_12/Evidence/Playwright-Fixes), [`Evidence/Quiz-Retake-Fix/README.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Evidence/Quiz-Retake-Fix/README.md), [`Evidence/DATA-01-RLS/README.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Evidence/DATA-01-RLS/README.md); **AI Tutor Docs:** [`AI_TUTOR_IMPLEMENTATION_REPORT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/ai_tutor/AI_TUTOR_IMPLEMENTATION_REPORT.md), [`AI_TUTOR_TESTING_REPORT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/ai_tutor/AI_TUTOR_TESTING_REPORT.md), [`AI_TUTOR_SETUP_GUIDE.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/ai_tutor/AI_TUTOR_SETUP_GUIDE.md), [`docs/ai_tutor/Evidence/README.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/ai_tutor/Evidence/README.md) |
| Prabin Rai (`RaiPrabin697`) | Reconciled Week 11 evidence boundaries and merged the evidence-led Week 12 package. | [PR #76](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/76) |
| Prince Karki (`princekark`) | On November 22, ran 15 of 24 Playwright cases (7 reported PASS, 8 FAIL, 9 unconfirmed). Most failures were outdated selectors or missing test steps. The same session recorded a manual password-recovery pass: recovery email, verification code, new-password login, and old-password rejection. Live two-account RLS was not run. | [Issue #81](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/81); [automated QA report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md); [Evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/3bf1d50798a0aff7236188fa4b9d658492a6cb3a/docs/week_12/Evidence) |
| J.N. Taj Oli (`jn-oli`) | Wrote the design-only AI Tutor UI/UX specification and opened two unfixed UI bugs: subject cards do not toggle with Enter or Space, and the selected quiz-mode button does not look selected. On 23 November, in dark mode, checked Standard and Rapid retake on desktop and a phone-width screen. Retake stayed in Data Structures & Algorithms (EASY), opened Question 1 of 6 with no answer selected, and the question order changed. Quiz history kept the earlier attempts. Opened Issue #83 because the Quiz section scrolls sideways on a phone-width screen. | [AI_TUTOR_UI_UX_SPEC](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/1476c9f/docs/week_12/AI_TUTOR_UI_UX_SPEC.md); [Retake Quiz Evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Evidence1/Retake%20Quiz%20Evidence.md); [QUIZ_RETAKE_PEER_REVIEW](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/QUIZ_RETAKE_PEER_REVIEW.md); [Issue #80](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/80); [Issue #79](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/79); [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83) |
| Sumit Adhikari (`adronnie`) | Wrote the proposed AI Tutor PostgreSQL model for the `013` slot. That model is not applied. Live `009` / `010` / `012` and DATA-01 remain pending. And Tested the Add a Study Task feature in light and dark modes. Identified a subject dropdown text visibility issue in dark mode, captured a screenshot, and documented it in a GitHub issue for fixing.| [AI Tutor DB Model](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/525a4504a0c135ea0b50abe6045ed7b7ac9ac56c/docs/week_12/AI%20tutor%20DB%20model.md),[issue #84](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84#issue-6552876384) |

## Blockers or risks

| Blocker/risk | Owner | Next action |
|---|---|---|
| Live DATA-01 two-student RLS is not executed | Prince Karki, Prabin Rai, Sumit Adhikari | Run DATA-01 with 2 disposable accounts and capture redacted screenshots |
| `generate-ai-quiz` is unverified; signup verification and expired recovery token are still open. Live `013` and `GEMINI_API_KEY` are also pending | Sumit Adhikari, Nabin Khadka | Run `009`, `010`, and `012` in the Supabase Dashboard, deploy the Edge Function, and log those email checks |
| Playwright is 8 FAIL and 9 unconfirmed; failures are mostly outdated selectors, missing mobile navigation, and weak AI Quiz assertions. Named files `RT-03`–`RT-08` are still absent | Prabin Rai, Nabin Khadka | Fix the scripts in Issue #81, then rerun. November 23 manual shots are already in Evidence1 |
| Quiz section scrolls sideways on a phone-width screen | J.N. Taj Oli reported it; Nabin Khadka to fix the layout | Fix [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83) and recheck light mode and dark mode |
| Active course Vercel SHA is unknown. The fork receipts are `4183944` and later `03ae6a4`. Issue #59 is pending | Nabin Khadka | Record the live course deployment SHA and compare it with the merged revision |
| All 5 peer QA and freeze sign-offs are pending | All 5 members | Complete the swaps in [QA_EVIDENCE_MATRIX.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week9/QA_EVIDENCE_MATRIX.md) and sign [FEATURE_FREEZE_DECISION.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_11/FEATURE_FREEZE_DECISION.md) |

## Decision record

| Decision | Why we chose it | Owner | Evidence / Issue link |
|---|---|---|---|
| Week 12 stays NO-GO | Local unit, system, and build checks pass, and the P1 fixes are merged, but live RLS, the Edge Function, a full browser rerun, the course Vercel SHA, and sign-offs are still open | Team 5 | [Week 12 weekly report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/weekly-report.md) |
| Rename the unapplied quiz migration to `012_quiz_difficulty_and_repetition.sql` | `011_study_streak_analytics.sql` was already applied on November 17 | Nabin Khadka | [PR #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75) |
| Treat November 22 password recovery as an independent manual PASS, and leave other email paths unverified | Prince verified email, code, new-password login, and old-password rejection. Signup verification and expired-token checks were not part of that run | Prince Karki | [Issue #40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40) |
| Keep the November 22 Playwright failures as test-script work, not confirmed product bugs, until the scripts are corrected and rerun | Most failures came from outdated selectors or missing navigation steps. One AI Quiz PASS has limited assertion coverage | Prince Karki | [Issue #81](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/81) |
| Record the AI Tutor as a local implementation, with live deploy still pending | Week 11 deferred it. PR #78 merged a local Gemini tutor. Live `013` and `GEMINI_API_KEY` are not verified | Nabin Khadka | [PR #78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/78) |
| Treat the November 23 retake as a browser pass for the retake path, and leave the mobile sideways scroll open | The Evidence1 shots show the same subject and difficulty, Question 1 of 6, no selected answer, a changed question order, and preserved history. Issue #83 tracks the layout bug | J.N. Taj Oli | [Evidence1](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Evidence1/Retake%20Quiz%20Evidence.md); [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83) |

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

## 15. November 23 — Retake Quiz UI review (J.N. Taj Oli)

**Tester:** J.N. Taj Oli (`jn-oli`)  
**Role:** UI/UX & Frontend  
**Date:** November 23, 2026  
**Environment:** Browser, dark mode, desktop and phone-width  
**Status:** Retake path checked; mobile layout issue open

The Evidence1 shots show:

- Standard and Rapid retakes stayed in the quiz.
- Subject and difficulty stayed Data Structures & Algorithms (EASY).
- The retake opened Question 1 of 6 with no answer selected.
- The question order changed.
- Quiz history kept the earlier attempts.

The named files `RT-03`–`RT-08` were not added. [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83) records the reported sideways scroll on a phone-width Quiz screen. The freeze sign-off remains **PENDING**.

**Evidence:** [Retake Quiz Evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Evidence1/Retake%20Quiz%20Evidence.md)  
**Write-up:** [QUIZ_RETAKE_PEER_REVIEW.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/QUIZ_RETAKE_PEER_REVIEW.md)

## 16. November 23 — Release Readiness Audit, Playwright Fixes & UI Defects Fixed (Nabin Khadka)

**Branch:** `week12/release-readiness-qa-fixes` (from `origin/main` @ `e9f86df`)  
**Status:** Fixes committed on QA branch; release remains **NO-GO** pending live P0 gates

- **Live Cloud Probes (Nov 23):** Confirmed `011_study_streak_analytics.sql` active (`HTTP 200`), whereas `009`, `010`, `012`, `013`, `generate-ai-quiz` (`404`), and `ai-tutor-chat` (`404`) are **not applied / not deployed**. Live anonymous RLS probe (`E2E-RLS-02`) returned `0` rows across 8 private tables. Authoritative course Vercel SHA verification remains **BLOCKED** locally; both URLs serve older bundle `etag: "e6cce49db1d3fbd659ee860ed84f94f2"` (`03ae6a4`).
- **UI Defects Fixed:** Resolved `.quiz-setup-controls[hidden]` visibility leak, Issue [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83) (375px Quiz mobile overflow), Issue [#80](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/80) (active quiz tab styling + ARIA), Issue [#79](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/79) (Enter/Space subject card toggling), and Issue [#84](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84) (dark-mode modal/select dropdown contrast).
- **Playwright & Regression Checks:** Updated `tests/e2e/*.spec.js` selectors/drawer navigation, removed weak conditional bypasses, separated non-cloud UI regression checks (`ui-regression-mocked.spec.js`), and ran Chrome Desktop & Mobile (`22 PASS`, `40 SKIPPED` credential-gated live flows, `0 FAIL`) plus Vitest (`93/93`), PGlite (`36/36`, `4/4`), and Python suites (`PASS`).
- **Full Audit Report:** [RELEASE_VERIFICATION_REPORT.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/RELEASE_VERIFICATION_REPORT.md) & [Evidence/Playwright-Fixes/](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/main/docs/week_12/Evidence/Playwright-Fixes)

## 13. Final Week 12 status

**NO-GO (Critical P0 Gates Remain Unverified).** Local unit, system, and build checks passed, the P1 code fixes are implemented, Brevo password reset had a reported live success on November 20, and Prince’s November 22 manual recovery check passed. J.N.’s November 23 retake check passed for the retake path. Production or demo readiness stays unclaimed until live DATA-01 RLS verification, a live `generate-ai-quiz` check, the live AI Tutor deploy, the Playwright script fixes and rerun, the course Vercel SHA, and team sign-offs are completed with evidence.

## Next week's bridge task

- **Sumit / Nabin:** Verify or run `009`, `010`, and `012` in the Supabase Dashboard, deploy `generate-ai-quiz`, and log live signup and token-expiry email checks. Live `013` and `GEMINI_API_KEY` stay with that deploy work.
- **Prince / Prabin / Sumit:** Execute DATA-01 with 2 disposable accounts and capture redacted screenshots.
- **Prabin / Nabin:** Correct the Playwright scripts from Issue #81 and rerun the 8 failures and 9 unconfirmed cases. The named `RT-03`–`RT-08` files are still absent. November 23 manual shots are in Evidence1.
- **Nabin:** Fix the phone-width Quiz sideways scroll in Issue #83. Record the active course Vercel deployment SHA and compare it with the intended merged revision. Keep the fork-sync claims (`4183944`, then `03ae6a4`) separate from the course deployment claim.
- **All 5 members:** Complete the peer QA swaps and sign the feature-freeze decision. A non-author also runs the Week 13 clean-start setup from `README.md` and `supabase/setup_all.sql`.
