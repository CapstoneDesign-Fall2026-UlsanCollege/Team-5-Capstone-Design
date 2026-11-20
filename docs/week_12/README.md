# Week 12 — QA, Bug Fixes & Verification

**Project:** Smart Study Companion — Team 5 (Ulsan College)  
**Repository:** https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design  
**Date:** November 20, 2026  

---

## Read First

**Status: NO-GO.** The Week 12 fixes are merged into `main` through [PR #72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/72) and [PR #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75). This does not establish which revision Vercel serves. Live two-account RLS, browser E2E, and team sign-offs remain unverified.

1. [Shared weekly report](./weekly-report.md): decisions, ownership, and remaining gates.
2. [Evidence map](#evidence-map): what each result actually establishes.
3. [Unresolved gates](#unresolved-gates): the next checks before a GO decision.

## Evidence Map

| Claim | Source and method | Operator / date | Revision or environment | Result and limit |
| :--- | :--- | :--- | :--- | :--- |
| Task deadline, local date, quiz-history, and migration changes | [PR #72](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/72), [PR #75](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/75), [regression report](./BUG_FIX_REGRESSION_REPORT.md); code review and recorded local suites | Individual test operator not stated; November 20 report | Merged into `main`; deployed revision unknown | Fixes are in the repository. No linked live browser regression receipt for these changes. |
| Quiz retake fix | [PR #71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/71), [fix report](./QUIZ_RETAKE_BUG_FIX_REPORT.md); unit tests | See fix report; Week 12 | Repository change; deployed revision unknown | Unit coverage is not a fresh browser retake result. |
| Password recovery | [Issue #40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40), [SMTP report](./AUTH_SMTP_VERIFICATION.md); reported live user confirmation | Nabin / Sumit report; November 20 | Supabase/Brevo; exact build unknown | Password reset reported working. Signup verification, expired token, and independently linked capture remain unverified. |
| Two-account data isolation | [DATA-01 protocol](./DATA-01-RLS-VERIFICATION.md); planned live test | Prince / Prabin / Sumit assigned; no run date | Live Supabase revision unknown | **Not run.** Local SQL emulation does not prove live RLS. |
| Browser E2E | [Playwright report](./PLAYWRIGHT_E2E_REPORT.md); planned browser suite | Prabin / Nabin assigned; no run date | Browser/build unknown | **0/24 executed.** Static or contract checks are separate. |
| Public deployment | [Deployment report](./DEPLOYMENT_VERIFICATION.md); fork sync and config inspection | Nabin; November 20 | Fork `4183944`; live Vercel SHA unknown | Fork synchronization does not verify the deployed build. |

## Unresolved Gates

- **Live RLS:** Prince / Prabin / Sumit run [DATA-01](./DATA-01-RLS-VERIFICATION.md) with two disposable accounts and record redacted responses plus Account A recheck.
- **Browser regression:** Prabin / Nabin run the [Playwright suite](./PLAYWRIGHT_E2E_REPORT.md) and record its actual counts, browser/build, and artifacts.
- **Deployment identity:** Nabin records the active Vercel deployment SHA and checks it against the intended merged revision.
- **Team decision:** Each member reviews their area and records their own result in the [shared report](./weekly-report.md); sign-off remains pending until then.

## Supporting Documents

1. **[weekly-report.md](./weekly-report.md)** — Complete Week 12 status report, sign-off table, and blockers.
2. **[TECHNICAL_AUDIT.md](./TECHNICAL_AUDIT.md)** — Baseline repository audit and confirmed defects.
3. **[BUG_FIX_REGRESSION_REPORT.md](./BUG_FIX_REGRESSION_REPORT.md)** — Task modal deadline crash, UTC date offset, 20-attempt cap, and `012_` migration fix.
4. **[QUIZ_RETAKE_BUG_FIX_REPORT.md](./QUIZ_RETAKE_BUG_FIX_REPORT.md)** — Root cause and QA report for the Retake Quiz button bug (`PR #71`).
5. **[AUTH_SMTP_VERIFICATION.md](./AUTH_SMTP_VERIFICATION.md)** — Password recovery verification & Brevo Custom SMTP setup (Issue #40 — **Password Reset Resolved Live**).
6. **[DATA-01-RLS-VERIFICATION.md](./DATA-01-RLS-VERIFICATION.md)** — Two-student authenticated RLS verification protocol & status (`NOT RUN`).
7. **[PLAYWRIGHT_E2E_REPORT.md](./PLAYWRIGHT_E2E_REPORT.md)** — Playwright browser E2E status (`0 / 24` executed) & run instructions.
8. **[DEPLOYMENT_VERIFICATION.md](./DEPLOYMENT_VERIFICATION.md)** — Fork sync (`4183944`), Vercel status, and Issue #59 org approval.
9. **[Evidence/Quiz-Retake-Fix/README.md](./Evidence/Quiz-Retake-Fix/README.md)** & **[Evidence/DATA-01-RLS/README.md](./Evidence/DATA-01-RLS/README.md)** — Screenshot evidence checklists.
