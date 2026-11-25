# Weekly Report

**Team:** Team 5 — Smart Study Companion
**Week:** 12  
**Date:** November 20, 2026, updated through November 25, 2026  
**Repository:** [Team-5-Capstone-Design](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design)  
**Recorded work branch:** `week12/p0-p1-verification-and-fixes` ([PR #72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/72), [PR #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75)); reconciled on `main` via [PR #85](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/85) (`22879a9`) & [PR #87](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/87) (`032e6cd`)  
**Final Week 12 Status:** **NO-GO — Pending Live Security and Release Verification.**

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
On November 25, J.N. Taj Oli rechecked the UI while signed in as `zaynwoli18`. Subject cards responded to Tab, Space, Enter, and a mouse click in Light mode and Dark mode (Issue #79). The selected Quiz button was filled and the other button stayed an outline: Standard & Rapid Quiz in Light mode, AI Quiz Generator in Dark mode (Issue #80). The phone-width Quiz setup stayed inside the screen in Dark mode and Light mode, and Issue #83 was updated with that result. The Quick Add Subject list was readable in Dark mode and Light mode [Issue #84](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84)_.

## 7. Bug fixes

Retake Quiz ([PR #71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/71)), Wireframes `404` ([PR #69](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/69)), Task Modal empty-deadline crash, UTC midnight date offset, Quiz History 20-attempt cap, and the duplicate `011_` migration prefix.

See [BUG_FIX_REGRESSION_REPORT.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/BUG_FIX_REGRESSION_REPORT.md) and [QUIZ_RETAKE_BUG_FIX_REPORT.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/QUIZ_RETAKE_BUG_FIX_REPORT.md).

The November 23 mobile Quiz sideways scroll is tracked in [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83), and dark-mode subject dropdown contrast in [Issue #84](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84) (reported by `adronnie`). CSS/JS fixes (`#79`, `#80`, `#83`, `#84`, `.quiz-setup-controls[hidden]`, plus WAI-ARIA tab arrow navigation and active-tab fill parity) are merged into `main` via [PR #85](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/85) / [PR #87](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/87) and J.N. Taj Oli manually rechecked Issues #79, #80, #83, and #84 on November 25. Issue #83 is updated. The 7-viewport Chrome matrix remains the agent-assisted record.

## 8. Independent peer QA and sign-off status

| Member | Assigned Area | Verification | Sign-off |
|---|---|---|---|
| Sumit Adhikari (`adronnie`) | Database, Migrations (`009`/`010`/`012`/`013`) & RLS (`DATA-01`) | Database/security audit report and DATA-01 checklist are pending personal review. Live 009, 010, 012, and DATA-01 remain NOT RUN. Issue #84 reporter: Sumit Adhikari (adronnie). Fix owner: J.N. Taj Oli (jn-oli), the login Issue #84 assigns the fix to. Implemented by: Nabin Khadka. | **PENDING** |
| Nabin Khadka (`liftupkhadka555-spec`) | Frontend, Backend, Authentication & Deployment | Completed Week 12 code fixes, SMTP `#40` setup, and local AI Tutor (**DEFERRED**) preserved intact (`PR #69`, `#71`, `#72`, `#75`, `#78`, `#82`, `#85`). Official course Vercel SHA stays **`UNKNOWN / UNVERIFIED`** pending org admin approval ([Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59)) | **PENDING** |
| Prabin Rai (`RaiPrabin697`) | QA Automation & Test Harness | Reconciled evidence (`PR #76`, `#86`). Nov 25 Playwright semantic locator repairs (`getByRole`/`getByLabel`), `E2E-RLS-01` upgrades & non-cloud suite documented in [Prabin report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Prabin-Rai-Automation-Repair-Report.md) as agent-assisted pending personal review & credentialed rerun | **PENDING** |
| Prince Karki (`princekark`) | Independent QA & Regression Testing | Nov 22 Playwright baseline (`15/24`: 7 PASS, 8 FAIL, 9 unconfirmed) & manual password-recovery PASS preserved; 8-failure classification matrix & Nov 25 agent-assisted retest (`6/24` PASS, `18/24` live `NOT RUN`) appended to [Prince report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md) pending independent rerun; `DATA-01` **`NOT RUN`** | **PENDING** |
| J.N. Taj Oli (`jn-oli`) | UI/UX, Responsive Design & Frontend Layout | Nov 23 Retake Quiz peer review preserved ([QUIZ_RETAKE_PEER_REVIEW.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/QUIZ_RETAKE_PEER_REVIEW.md)). Nov 25 manual checks passed for [#79-comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/79#issuecomment-7137217211);  [Issue #80-comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/80#issuecomment-7137440485)(Tab, Space, Enter, and click in Light and Dark mode), #80 (selected Quiz button filled in Light and Dark mode), the phone-width Quiz setup for [Issue #83-comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83#issuecomment-7137817600), and the Quick Add Subject dropdown for  (reported by `adronnie`)  [Issue #84-comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84#issuecomment-7138393597); [Peer test note](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/9492f0b2eccb0c074b2853033d266d8c036ecc6d/docs/week_12/Peer%20test%20note.md) The 7-viewport Chrome matrix remains agent-assisted. The AI Tutor UI/UX spec remains deferred design work. [AI_TUTOR_UI_UX_SPEC](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/1476c9f/docs/week_12/AI_TUTOR_UI_UX_SPEC.md) | **PENDING** |

## 9. Deployment

- An earlier personal-fork receipt synced `liftupkhadka555-spec/Team-5-Capstone-Design` `main` to `4183944` and later to `03ae6a4` through [PR #78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/78).
- The official course-organization Vercel deployment SHA remains **`UNKNOWN / UNVERIFIED`** (`BLOCKED` locally; Nov 25 HTTP probe to `https://team-5-capstone-design.vercel.app/` observed older bundle `etag: "e6cce49db1d3fbd659ee860ed84f94f2"`, lagging `bb7c974`). Fork syncs are not claims about verified course deployment.
- Course-organization Vercel GitHub App approval ([Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59)) remains **OPEN**. See [DEPLOYMENT_VERIFICATION.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/DEPLOYMENT_VERIFICATION.md).

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
| Nabin Khadka (`liftupkhadka555-spec`) | Fixed the broken Wireframes sidebar link (PR #69), Retake Quiz flow + regression tests (PR #71), Task Modal empty/invalid deadline validation (`parseDeadlineInputToIso()`), UTC date offset (`formatLocalDateInput()`), Quiz History 20-attempt cap, and `012_quiz_difficulty_and_repetition.sql` rename (PR #72, PR #75); configured Brevo Custom SMTP (`smtp-relay.brevo.com:587`, verified sender, SMTP IP blocking deactivated, `Username` fix, recovery template/URL config) resolving Issue #40 live password recovery; implemented and locally verified the personalized Gemini AI Tutor (`#ai-tutor`, `013_ai_tutor.sql` & rollback — live cloud `013` deploy & `GEMINI_API_KEY` pending, kept out of MVP gate) (PR #78); synced personal Vercel fork `main` to `03ae6a4`; on `week12/release-readiness-qa-fixes` (`PR #85`, `22879a9`) and `week12/final-qa-reconciliation` (`PR #87`, `032e6cd`), fixed Playwright E2E selectors/mobile drawer/unconditional assertions (`Issue #81`), expanded `E2E-RLS-01` (`DATA-01`) API isolation checks (`rls-isolation.spec.js`), resolved Issues `#79`, `#80`, `#83` (`320px–1440px` Light/Dark + `<= 380px` clamping), `#84` (`select` contrast + `:focus-visible`), and `.quiz-setup-controls[hidden]` visibility bug with Playwright screenshots (`Evidence/Playwright-Fixes/`), executed live anon Supabase/Edge/Vercel probes, corrected `README.md` testing claims, reconciled `MVP_VERIFICATION_MATRIX.md` & member QA reports, and added Week 12 accessibility and documentation updates merged via `PR #88` (`2f1df92` / `af4cb1e`: WAI-ARIA Quiz tab `ArrowLeft`/`ArrowRight`/`Home`/`End` keyboard switching, roving `tabindex`, `.filter-btn.is-on` active contrast parity across `public/index.html`, `public/styles.css`, and `public/app.js`, regression checks in `bug-fixes-week12.test.js` [`94/94` Vitest] & `ui-regression-mocked.spec.js` [`12/12` Chrome], 60-second evaluator quick-verification guide in `docs/week_12/README.md`, and `README.md`/`docs/README.md`/`weekly-report.md` alignment). | [PR #69](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/69); [PR #71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/71); [PR #72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/72); [PR #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75); [PR #78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/78); [PR #82](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/82); [PR #85](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/85); [PR #87](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/87); [PR #88](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/88); [Issue #40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40); **Week 12 Docs & Tests:** [`MVP_VERIFICATION_MATRIX.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/MVP_VERIFICATION_MATRIX.md), [`RELEASE_VERIFICATION_REPORT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/RELEASE_VERIFICATION_REPORT.md), [`weekly-report.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/weekly-report.md), [`README.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/README.md), [`TECHNICAL_AUDIT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/TECHNICAL_AUDIT.md), [`QUIZ_RETAKE_BUG_FIX_REPORT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/QUIZ_RETAKE_BUG_FIX_REPORT.md), [`BUG_FIX_REGRESSION_REPORT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/BUG_FIX_REGRESSION_REPORT.md), [`AUTH_SMTP_VERIFICATION.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/AUTH_SMTP_VERIFICATION.md), [`DATA-01-RLS-VERIFICATION.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/DATA-01-RLS-VERIFICATION.md), [`PLAYWRIGHT_E2E_REPORT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/PLAYWRIGHT_E2E_REPORT.md), [`DEPLOYMENT_VERIFICATION.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/DEPLOYMENT_VERIFICATION.md), [`ui-regression-mocked.spec.js`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/tests/e2e/ui-regression-mocked.spec.js), [`bug-fixes-week12.test.js`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/tests/unit/bug-fixes-week12.test.js), [`Evidence/Playwright-Fixes/`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/main/docs/week_12/Evidence/Playwright-Fixes), [`Evidence/Quiz-Retake-Fix/README.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Evidence/Quiz-Retake-Fix/README.md), [`Evidence/DATA-01-RLS/README.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Evidence/DATA-01-RLS/README.md); **AI Tutor Docs:** [`AI_TUTOR_IMPLEMENTATION_REPORT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/ai_tutor/AI_TUTOR_IMPLEMENTATION_REPORT.md), [`AI_TUTOR_TESTING_REPORT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/ai_tutor/AI_TUTOR_TESTING_REPORT.md), [`AI_TUTOR_SETUP_GUIDE.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/ai_tutor/AI_TUTOR_SETUP_GUIDE.md), [`docs/ai_tutor/Evidence/README.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/ai_tutor/Evidence/README.md) |
| Prabin Rai (`RaiPrabin697`) | Reconciled Week 11/12 evidence boundaries (`PR #76`, `PR #86`). Week 12 Playwright automation harness repairs (`getByRole`/`getByLabel`, `E2E-RLS-01` JWT API isolation, separated non-cloud regression suite) documented in his individual report as **agent-assisted pending personal review and rerun**. | [PR #76](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/76); [PR #86](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/86); [Prabin Automation Repair Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Prabin-Rai-Automation-Repair-Report.md) |
| Prince Karki (`princekark`) | On November 22, personally ran 15 of 24 Playwright cases (7 reported PASS, 8 FAIL, 9 unconfirmed) and verified manual password recovery (email, code, new-password login, old-password rejection). Failure classification matrix for all 8 failures & Nov 25 retest addendum (`6/24` unauth/anon PASS, `18/24` live `NOT RUN`) added as **agent-assisted pending personal re-execution**; live `DATA-01` remains `NOT RUN`. | [Issue #81](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/81); [automated QA report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md); [Evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/3bf1d50798a0aff7236188fa4b9d658492a6cb3a/docs/week_12/Evidence), [AUTOMATED_QA_REPORT](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/4446c374741805e60ecc3c5fdffda744699f5ee5/docs/week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md) |
| J.N. Taj Oli (`jn-oli`) | Authored design-only AI Tutor UI/UX specification, opened Issues `#79`, `#80`, and `#83`, and completed November 23 Retake Quiz peer review in dark mode. On November 25, signed in as `zaynwoli8` and manually checked the UI. Subject cards responded to Tab, Space, Enter, and a mouse click in Light mode and Dark mode (Issue #79). The selected Quiz button was filled and the other stayed an outline: Standard & Rapid Quiz in Light mode, and AI Quiz Generator in Dark mode (Issue #80). The phone-width Quiz setup stayed inside the screen in both modes, and Issue #83 was updated with that result. The Quick Add Subject dropdown was readable in Dark mode and Light mode (Issue #84). The AI Tutor UI/UX spec remains deferred design work.| [AI_TUTOR_UI_UX_SPEC](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/1476c9f/docs/week_12/AI_TUTOR_UI_UX_SPEC.md); [Retake Quiz Evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Evidence1/Retake%20Quiz%20Evidence.md); [QUIZ_RETAKE_PEER_REVIEW](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/QUIZ_RETAKE_PEER_REVIEW.md); [Issue #84-comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84#issuecomment-7138393597); [Issue #79-comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/79#issuecomment-7137217211); [Issue #83-comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83#issuecomment-7137817600); [Peer test note](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/9492f0b2eccb0c074b2853033d266d8c036ecc6d/docs/week_12/Peer%20test%20note.md); [Issue #80-comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/80#issuecomment-7137440485)|
| Sumit Adhikari (`adronnie`) | Wrote the proposed AI Tutor PostgreSQL model for the 013 slot (DEFERRED / not applied). That model is not applied. Live 009 / 010 / 012 and DATA-01 remain not run. Reporter: Sumit Adhikari (adronnie) tested Add a Study Task in light and dark mode, found the subject dropdown text visibility issue in dark mode, captured a screenshot, and opened Issue #84.| [Sumit Database Security Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Sumit-Adhikari-Database-Security-Report.md); [AI Tutor DB Model](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/525a4504a0c135ea0b50abe6045ed7b7ac9ac56c/docs/week_12/AI%20tutor%20DB%20model.md); [issue #84](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84#issue-6552876384), [database security report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/6f9a4ab4c98c95530106150f4f09a954be574a1c/docs/week_12/Sumit-Adhikari-Database-Security-Report.md) |

## Blockers or risks

| Blocker/risk | Owner | Next action |
|---|---|---|
| Live DATA-01 two-student RLS is not executed (`NOT RUN`) | Sumit Adhikari (`adronnie`) owner; Prince Karki (`princekark`), Prabin Rai (`RaiPrabin697`) QA | Run `rls-isolation.spec.js` / manual 9-case `DATA-01` checklist using 2 ordinary accounts and capture redacted screenshots |
| `009`, `010`, `012` unapplied & `generate-ai-quiz` (`404`) unverified; signup verification and expired recovery token open (`013` stays **DEFERRED**) | Sumit Adhikari (`adronnie`), Nabin Khadka (`liftupkhadka555-spec`) | Apply `009`, `010`, `012` after admin authorization, deploy `generate-ai-quiz` with `GEMINI_API_KEY`, log signup/expiry email checks |
| Credentialed 18/24 Playwright live cases (`NOT RUN`) pending personal execution after Issue #81 repairs | Prabin Rai (`RaiPrabin697`), Prince Karki (`princekark`) | Review repaired semantic harness and run full 24-case suite with `E2E_STUDENT_A_*` & `E2E_STUDENT_B_*` |
| Active course Vercel SHA is **`UNKNOWN / UNVERIFIED`** (bundle lags `main` `032e6cd`; Issue #59 pending) | Nabin Khadka (`liftupkhadka555-spec`) | Complete org Vercel approval and verify official production deployment SHA matches release commit |
| All 5 peer QA and freeze sign-offs remain `PENDING` | All 5 members | Complete swaps in [MVP_VERIFICATION_MATRIX.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/MVP_VERIFICATION_MATRIX.md) and sign [FEATURE_FREEZE_DECISION.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_11/FEATURE_FREEZE_DECISION.md) |

## Decision record

| Decision | Why we chose it | Owner | Evidence / Issue link |
|---|---|---|---|
| Week 12 stays NO-GO | Local unit, system, and build checks pass, and the P1 fixes are merged, but live RLS, the Edge Function, a full browser rerun, the course Vercel SHA, and sign-offs are still open | Team 5 | [Week 12 weekly report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/weekly-report.md) |
| Rename the unapplied quiz migration to `012_quiz_difficulty_and_repetition.sql` | `011_study_streak_analytics.sql` was already applied on November 17 | Nabin Khadka | [PR #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75) |
| Treat November 22 password recovery as an independent manual PASS, and leave other email paths unverified | Prince verified email, code, new-password login, and old-password rejection. Signup verification and expired-token checks were not part of that run | Prince Karki | [Issue #40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40) |
| Keep the November 22 Playwright failures as test-script work, not confirmed product bugs, until the scripts are corrected and rerun | Most failures came from outdated selectors or missing navigation steps. One AI Quiz PASS has limited assertion coverage | Prince Karki | [Issue #81](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/81) |
| Record the AI Tutor as a local implementation, with live deploy still pending | Week 11 deferred it. PR #78 merged a local Gemini tutor. Live `013` and `GEMINI_API_KEY` are not verified | Nabin Khadka | [PR #78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/78) |
| Treat the November 23 retake as a browser pass for the retake path, and leave the mobile sideways scroll open | The Evidence1 shots show the same subject and difficulty, Question 1 of 6, no selected answer, a changed question order, and preserved history. Issue #83 tracks the layout bug | J.N. Taj Oli | [Evidence1](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Evidence1/Retake%20Quiz%20Evidence.md); [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83) |
| Record the November 25 UI recheck, and treat Issue #83 as updated | Phone-width Quiz setup stayed inside the screen in Light mode and Dark mode. Subject cards, the selected Quiz button, and the Quick Add Subject list were also checked in both modes. | J.N. Taj Oli | [Issue #84-comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84#issuecomment-7138393597); [Issue #79-comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/79#issuecomment-7137217211); [Issue #83-comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83#issuecomment-7137817600) [Peer test note](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/9492f0b2eccb0c074b2853033d266d8c036ecc6d/docs/week_12/Peer%20test%20note.md), [Issue #80-comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/80#issuecomment-7137440485) |

## 10. November 22 — Independent Playwright QA update (Prince Karki)

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

## 11. November 23 — Retake Quiz UI review (J.N. Taj Oli)

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

## 12. November 23 — Release Readiness Audit, Playwright Fixes & UI Defects Fixed (Nabin Khadka)

**Branch:** `week12/release-readiness-qa-fixes` (from `origin/main` @ `e9f86df`)  
**Status:** Fixes committed on QA branch; release remains **NO-GO** pending live P0 gates

- **Live Cloud Probes (Nov 23):** Confirmed `011_study_streak_analytics.sql` active (`HTTP 200`), whereas `009`, `010`, `012`, `013`, `generate-ai-quiz` (`404`), and `ai-tutor-chat` (`404`) are **not applied / not deployed**. Live anonymous RLS probe (`E2E-RLS-02`) returned `0` rows across 8 private tables. Authoritative course Vercel SHA verification remains **BLOCKED** locally; both URLs serve older bundle `etag: "e6cce49db1d3fbd659ee860ed84f94f2"` (`03ae6a4`).
- **UI Defects Fixed:** Resolved `.quiz-setup-controls[hidden]` visibility leak, Issue [#83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83) (375px Quiz mobile overflow), Issue [#80](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/80) (active quiz tab styling + ARIA), Issue [#79](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/79) (Enter/Space subject card toggling), and Issue [#84](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84) (dark-mode modal/select dropdown contrast).
- **Playwright & Regression Checks:** Updated `tests/e2e/*.spec.js` selectors/drawer navigation, removed weak conditional bypasses, separated non-cloud UI regression checks (`ui-regression-mocked.spec.js`), and ran Chrome Desktop & Mobile (`22 PASS`, `40 SKIPPED` credential-gated live flows, `0 FAIL`) plus Vitest (`93/93`), PGlite (`36/36`, `4/4`), and Python suites (`PASS`).
- **Full Audit Report:** [RELEASE_VERIFICATION_REPORT.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/RELEASE_VERIFICATION_REPORT.md) & [Evidence/Playwright-Fixes/](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/main/docs/week_12/Evidence/Playwright-Fixes)

## 13. November 25 — Final QA, Ownership Reconciliation & Accessibility Hardening (`main` @ `032e6cd`+)

- **Quiz Tab WAI-ARIA & Documentation Hardening:** Upgraded `#quiz-tab-curated` / `#quiz-tab-ai` with WAI-ARIA `ArrowLeft`/`ArrowRight`/`Home`/`End` navigation, roving `tabindex`, and active filled contrast parity with `.filter-btn.is-on`; reconciled Week 12 section numbering, README Week 12 navigation, and evaluator quick-verification commands (`Vitest 94/94`, `PGlite 40/40`, `Python 11/11` & `4/4`, `Playwright UI-REG-01..06 12/12`).
- **Individual Report Ownership Reconciled:** Created/updated dedicated member reports distinguishing reporters, implementation/fix owners, independent QA, and agent-assisted work:
  - [`Sumit-Adhikari-Database-Security-Report.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Sumit-Adhikari-Database-Security-Report.md) (`adronnie` — `009`/`010`/`012`/`013` audit, `DATA-01` API test upgrades, Issue `#84` reporter attribution)
  - [`Prabin-Rai-Automation-Repair-Report.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/Prabin-Rai-Automation-Repair-Report.md) (`RaiPrabin697` — semantic locator upgrades, removed fixed delays, separated non-cloud regression suite)
  - [`PRINCE_KARKI_AUTOMATED_QA_REPORT.md` §16](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/PRINCE_KARKI_AUTOMATED_QA_REPORT.md) (`princekark` — full 8-failure classification matrix + Nov 25 retest breakdown preserving Nov 22 baseline)
  - [`JN-Taj-Oli-Responsive-UI-Report.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/JN-Taj-Oli-Responsive-UI-Report.md) & [`ISSUE_83_UPDATE_DRAFT.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/ISSUE_83_UPDATE_DRAFT.md) (`jn-oli` — `#83`/`#84` fixes verified across **all 7 viewports `320px`, `375px`, `390px`, `430px`, `768px`, `1024px`, `1440px` in Light & Dark modes**)
- **Reconciled Verification Matrix:** Added [`MVP_VERIFICATION_MATRIX.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_12/MVP_VERIFICATION_MATRIX.md) with explicit Week 11 frozen-core gates and **DEFERRED** boundary for AI Tutor (`PR #78` / `013`).
- **Live Cloud Probe Recheck (Nov 25, 2026):** Confirmed `011` active, `009`/`010`/`012`/`013` not applied live (`404`/`[]`/`400`), `generate-ai-quiz` & `ai-tutor-chat` HTTP `404`, and Course Vercel SHA **`UNKNOWN / UNVERIFIED`**.

## 14. Final Week 12 status

**NO-GO — Pending Live Security and Release Verification.** Local unit, PGlite (`36/36`, `4/4`), Python integration suites, Vite build, unauth/live-anon Playwright (`6/24` = `12` Chrome runs), Nov 22 manual password recovery (`princekark`), Nov 23 manual Retake (`jn-oli`), and agent-assisted 7-viewport Light/Dark UI regressions (`UI-REG-01..06`, `12` Chrome runs on `PR #87`) pass. Production readiness stays **NO-GO** until live `DATA-01` RLS (`NOT RUN`), live `009`/`010`/`012` migrations (`UNVERIFIED`), live `generate-ai-quiz` (`UNVERIFIED`), official course Vercel SHA (`UNKNOWN / UNVERIFIED`), credentialed 18/24 Playwright live execution (`NOT RUN`), peer confirmation of `#79`/`#80`/`#83`/`#84` (`UNCONFIRMED`), and 5/5 team freeze sign-offs (`BLOCKED`) are completed with evidence. AI Tutor remains **DEFERRED** outside the frozen MVP release gate.

## 15. Next week's bridge task

- **Sumit / Nabin:** Verify or run `009`, `010`, and `012` in the Supabase Dashboard, deploy `generate-ai-quiz`, and log live signup and token-expiry email checks. Live `013` and `GEMINI_API_KEY` stay with that deploy work.
- **Prince / Prabin / Sumit:** Execute DATA-01 with 2 disposable accounts and capture redacted screenshots into [`Evidence/DATA-01-RLS/`](Evidence/DATA-01-RLS/README.md).
- **Prabin / Prince:** Review repaired Playwright semantic locators (`PR #85`, `PR #87`) and execute all 24 scenarios with live `E2E_STUDENT_A_*` & `E2E_STUDENT_B_*` credentials.
- **Nabin / J.N. Taj Oli:** Redeploy approved `main` commit onto the official course Vercel project (`team-5-capstone-design.vercel.app`), record its actual production SHA, and confirm Issues `#79`, `#80`, `#83`, and `#84` live in both light and dark modes before closing them on GitHub. Keep personal-fork receipts separate from course deployment proof.
- **All 5 members:** Complete peer QA swaps and record formal freeze approvals in `docs/week_11/FEATURE_FREEZE_DECISION.md` & `docs/week_12/weekly-report.md`. A non-author also runs the Week 13 clean-start setup from `README.md` and `supabase/setup_all.sql`.
