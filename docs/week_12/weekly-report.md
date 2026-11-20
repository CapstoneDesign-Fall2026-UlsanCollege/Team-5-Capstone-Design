# Week 12 Weekly Report — Smart Study Companion (Team 5)

**Project:** Smart Study Companion — Team 5 (Ulsan College)  
**Repository:** https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design  
**Date:** November 20, 2026  
**Branch:** `week12/p0-p1-verification-and-fixes`  
**Final Week 12 Status:** **NO-GO (Critical P0 Live Verification & Sign-Off Gates Pending)**

---

## 1. Project Overview
Week 12 focused on P0/P1 stabilization, bug fixes, peer QA handoff, migration hygiene, and honest verification of deployment and security gates prior to final handoff.

## 2. Work Completed
- **PR #69 (merged `f2c1134`):** Removed broken **Wireframes** sidebar link that caused `404: NOT_FOUND` on Vercel.
- **PR #71 (merged `4183944`):** Fixed **Retake quiz** button (`retakeCurrentQuiz()`, `snapshotQuizConfig()`, `createQuizAttemptState()`) and added 5 Vitest regression tests.
- **Week 12 Branch (`week12/p0-p1-verification-and-fixes`):**
  - Fixed Task Modal empty/invalid deadline crash (`parseDeadlineInputToIso()`).
  - Fixed UTC date offset in `dateInputValue()` (`formatLocalDateInput()`).
  - Removed the 20-attempt slice cap in `loadAndRenderQuizHistory()` (fetch limit raised to `200`).
  - Resolved duplicate `011_` migration prefix by renaming the unapplied quiz migration to `012_quiz_difficulty_and_repetition.sql`.
  - Authored Week 12 audit, SMTP, `DATA-01`, Playwright, bug-fix, and deployment verification reports.
  - Configured Brevo Custom SMTP in Supabase Dashboard (verified sender, deactivated Brevo SMTP key IP blocking, fixed SMTP login `Username`, verified URL Configuration & recovery template) and confirmed live password reset working (Nov 20, 2026).

## 3. Database and Backend
- `011_study_streak_analytics.sql`: Applied by user in Supabase SQL Editor on Nov 17.
- `009_ai_quiz_tables.sql`, `010_complete_universities.sql`, `012_quiz_difficulty_and_repetition.sql`: **UNVERIFIED** in live Supabase from local session.
- **Brevo Custom SMTP / Password Reset (Issue #40):** **VERIFIED FOR PASSWORD RESET** (configured and confirmed working live on Nov 20, 2026).
- **`generate-ai-quiz` Edge Function:** **UNVERIFIED** pending Supabase CLI deployment & live API test.

## 4. Security Verification
- **`DATA-01` (Two-Student Authenticated RLS):** **NOT RUN** in live Supabase (procedure documented in [`DATA-01-RLS-VERIFICATION.md`](DATA-01-RLS-VERIFICATION.md)).

## 5. Automated Testing
- **Vitest (`npm test`):** **79 / 79 PASS** (11 files, local unit & contract tests).
- **Python System Harness (`tests/run_tests.py`):** **11 / 11 PASS**.
- **Python AI Quiz Suite (`tests/test_ai_quiz.py`):** **4 / 4 PASS**.
- **Vite Build (`npm run build`):** **PASS** (6 HTML entry points).
- **Playwright Browser E2E (`npx playwright test`):** **0 / 24 EXECUTED** (`@playwright/test` not installed).

## 6. Manual Testing
- Browser screenshot evidence (`RT-03`–`RT-08`, `DATA-01`) remains **NOT RUN** in this local session.

## 7. Bug Fixes
- Retake Quiz button (`PR #71`), broken Wireframes `404` link (`PR #69`), Task Modal empty-deadline crash, UTC midnight date offset, Quiz History 20-attempt cap, and duplicate `011_` migration prefix. See [`BUG_FIX_REGRESSION_REPORT.md`](BUG_FIX_REGRESSION_REPORT.md) and [`QUIZ_RETAKE_BUG_FIX_REPORT.md`](QUIZ_RETAKE_BUG_FIX_REPORT.md).

## 8. Independent Peer QA & Sign-Off Status

| Member | Assigned Area | Verification | Sign-off |
| :--- | :--- | :--- | :---: |
| Sumit Adhikari (`adronnie`) | Database & Supabase | Local SQL verified; live `009`/`010`/`012` & `DATA-01` pending | **PENDING** |
| Nabin Khadka (`liftupkhadka555-spec`) | Full-Stack Integration & Deployment | Code fixes, local suites & Brevo password reset verified; Vercel org & Playwright QA pending | **PENDING** |
| Prabin Rai (`RaiPrabin697`) | QA Automation | `0/24` Playwright browser run pending | **PENDING** |
| Prince Karki (`princekark`) | QA & Independent Testing | Live `DATA-01` two-account test pending | **PENDING** |
| J.N. Taj Oli (`jn-oli`) | UI/UX & Frontend | Week 12 UI/retake peer review pending | **PENDING** |

## 9. Deployment
- Personal fork `liftupkhadka555-spec/Team-5-Capstone-Design` `main` verified synced to `4183944`.
- Course organization Vercel GitHub App approval (Issue #59) remains **PENDING**. See [`DEPLOYMENT_VERIFICATION.md`](DEPLOYMENT_VERIFICATION.md).

## 10. Remaining Problems
1. Live Supabase `DATA-01` two-student RLS test not executed.
2. `generate-ai-quiz` Edge Function live deployment and remaining live email cases (signup verification & expired recovery token) not yet verified *(Brevo Custom SMTP password reset resolved Nov 20, 2026)*.
3. Playwright browser suite (`0/24`) and manual browser screenshots (`RT-03`–`RT-08`) not executed.
4. All 5 team member peer QA & freeze sign-offs remain `PENDING`.

## 11. Next Actions
- **Sumit / Nabin:** Verify/run `009`, `010`, `012` in Supabase Dashboard, deploy `generate-ai-quiz`, and log live signup/token-expiry email checks.
- **Prince / Prabin / Sumit:** Execute `DATA-01` with 2 disposable accounts and capture redacted screenshots.
- **Prabin / Nabin:** Install `@playwright/test`, run `npx playwright test`, and capture `RT-03`–`RT-08` screenshots.
- **All 5 Members:** Complete peer QA swaps in [`docs/week9/QA_EVIDENCE_MATRIX.md`](../week9/QA_EVIDENCE_MATRIX.md) and sign [`docs/week_11/FEATURE_FREEZE_DECISION.md`](../week_11/FEATURE_FREEZE_DECISION.md).

## 12. Evidence Links
- [`TECHNICAL_AUDIT.md`](TECHNICAL_AUDIT.md)
- [`AUTH_SMTP_VERIFICATION.md`](AUTH_SMTP_VERIFICATION.md)
- [`DATA-01-RLS-VERIFICATION.md`](DATA-01-RLS-VERIFICATION.md)
- [`PLAYWRIGHT_E2E_REPORT.md`](PLAYWRIGHT_E2E_REPORT.md)
- [`QUIZ_RETAKE_BUG_FIX_REPORT.md`](QUIZ_RETAKE_BUG_FIX_REPORT.md)
- [`BUG_FIX_REGRESSION_REPORT.md`](BUG_FIX_REGRESSION_REPORT.md)
- [`DEPLOYMENT_VERIFICATION.md`](DEPLOYMENT_VERIFICATION.md)

## 13. Final Week 12 Status
**NO-GO (Critical P0 Gates Remain Unverified):** While all local unit/system/build checks pass, the P1 code fixes are implemented, and Brevo Custom SMTP password reset is verified working live, full production/demo readiness cannot be declared until live `DATA-01` RLS verification, `generate-ai-quiz` Edge Function live check, Playwright browser runs, and team sign-offs are completed with evidence.
