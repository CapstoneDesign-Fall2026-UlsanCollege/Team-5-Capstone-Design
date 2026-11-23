# Week 12 — Verification & Release Readiness Hub

**Project:** Smart Study Companion — Team 5 (Ulsan College)  
**Repository:** https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design  
**Updated:** November 23, 2026  

---

## Read First

**Status: NO-GO.** Week 12 P1 fixes and PRs `#69`, `#71`, `#72`, `#75`, `#78`, `#82` are merged on `origin/main` (`e9f86df`), and additional November 23 UI/QA fixes (`#79`, `#80`, `#83`, `#84`, `.quiz-setup-controls[hidden]`, and updated Playwright specs) are staged on branch `week12/release-readiness-qa-fixes`. Production course Vercel deployment SHA verification (**BLOCKED locally / bundle mismatch**), live Supabase migrations (`009`, `010`, `012`), live `DATA-01` two-student RLS, live `generate-ai-quiz` Edge Function verification, credentialed Playwright runs, and team sign-offs remain open.

1. [Release Verification Report (Nov 23)](./RELEASE_VERIFICATION_REPORT.md): complete Sections A–F audit, database remediation plan, UI/QA fixes, and GO/NO-GO gates.
2. [Shared weekly report](./weekly-report.md): decisions, ownership, and remaining gates.
3. [Evidence map](#evidence-map): what each result actually establishes.

## Evidence Map

| Claim | Source and method | Operator / date | Revision or environment | Result and limit |
| :--- | :--- | :--- | :--- | :--- |
| Week 12 bug fixes (`#69`, `#71`, `#72`, `#75`) & Nov 23 UI fixes (`#79`, `#80`, `#83`, `#84`, hidden panel fix) | [Regression report](./BUG_FIX_REGRESSION_REPORT.md), [Release report](./RELEASE_VERIFICATION_REPORT.md); Vitest (`93/93`), PGlite, Vite build, mocked Chromium checks (`10/10`) | Nabin Khadka / Nov 20–23, 2026 | `week12/release-readiness-qa-fixes` (`e9f86df` + fixes) | Verified locally & in Chromium UI regression; requires merge & authorized production deploy before claiming live |
| Quiz retake fix | [PR #71](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/71), [Peer review](./QUIZ_RETAKE_PEER_REVIEW.md), [Evidence1](./Evidence1/Retake%20Quiz%20Evidence.md); manual dark-mode + Chrome `UI-REG-05` | J.N. Taj Oli / Nov 23; Nabin Khadka / Nov 23 | Desktop & 375px mobile | Retake path passed; `Issue #83` mobile Quiz sideways scroll & `Issue #84` dark-mode dropdown contrast fixed on `week12/release-readiness-qa-fixes` pending peer recheck |
| Password recovery | [Issue #40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40), [Prince Recovery QA](./PRINCE_KARKI_PASSWORD_RECOVERY_QA.md), [SMTP report](./AUTH_SMTP_VERIFICATION.md) | Prince Karki / Nov 22, 2026 | Live Supabase/Brevo | Manual password recovery PASS; signup confirmation & expired-token checks remain unverified |
| Two-account data isolation | [DATA-01 protocol](./DATA-01-RLS-VERIFICATION.md); anon probe (`E2E-RLS-02`) + PGlite (`36/36`) vs live two-account test | Live `DATA-01` unassigned/pending; `E2E-RLS-02` Nov 23 | Live Supabase (`bcwwnjtmrcxggbaallon`) | Anonymous REST returns `0` rows across 8 tables; live two-student `DATA-01` remains **Not run** |
| Browser E2E | [Playwright report](./PLAYWRIGHT_E2E_REPORT.md), [Prince QA report](./PRINCE_KARKI_AUTOMATED_QA_REPORT.md) | Prince Karki (Nov 22); Nabin Khadka (Nov 23) | Local Vite preview (`Desktop Chrome` + `Mobile Pixel 5`) | Nov 22: **15/24** executed (**7 PASS, 8 FAIL, 9 unconfirmed**). Nov 23 post-fix: **22 PASS** (12 real unauth/anon + 10 mocked UI regression), **40 SKIPPED** pending live student credentials |
| Live Supabase migrations & AI Edge Functions | Live anon REST/Function probes in [Release report §C & §E](./RELEASE_VERIFICATION_REPORT.md) | Nabin Khadka / Nov 23, 2026 | Live Supabase cloud | `011` **APPLIED**; `009`, `010`, `012`, `013`, `generate-ai-quiz`, and `ai-tutor-chat` are **NOT APPLIED / NOT DEPLOYED** |
| Public deployment | [Deployment report](./DEPLOYMENT_VERIFICATION.md); live HTTP header/asset checks | Nabin Khadka / Nov 23, 2026 | Course URL & fork URL (`03ae6a4` / `etag: "e6cce49db1d3fbd659ee860ed84f94f2"`) | Official Vercel SHA **BLOCKED** locally (`Issue #59` pending); active bundle predates `e9f86df` and QA fixes |

## Supporting Documents

1. **[RELEASE_VERIFICATION_REPORT.md](./RELEASE_VERIFICATION_REPORT.md)** — Master Week 12 release readiness report (Sections A–F).
2. **[weekly-report.md](./weekly-report.md)** — Complete Week 12 team report, sign-off table, and blockers.
3. **[DEPLOYMENT_VERIFICATION.md](./DEPLOYMENT_VERIFICATION.md)** — Course vs. fork Vercel audit, `origin/main` SHA check, and Issue #59 org approval.
4. **[PLAYWRIGHT_E2E_REPORT.md](./PLAYWRIGHT_E2E_REPORT.md)** — Nov 20 (`0/24`), Nov 22 (`15/24`), and Nov 23 (`22 PASS / 40 SKIPPED`) browser E2E records.
5. **[PRINCE_KARKI_AUTOMATED_QA_REPORT.md](./PRINCE_KARKI_AUTOMATED_QA_REPORT.md)** & **[PRINCE_KARKI_PASSWORD_RECOVERY_QA.md](./PRINCE_KARKI_PASSWORD_RECOVERY_QA.md)** — Independent Nov 22 Playwright & password recovery QA reports.
6. **[QUIZ_RETAKE_PEER_REVIEW.md](./QUIZ_RETAKE_PEER_REVIEW.md)** & **[Evidence1/Retake Quiz Evidence.md](./Evidence1/Retake%20Quiz%20Evidence.md)** — Nov 23 UI peer review of Retake Quiz.
7. **[TECHNICAL_AUDIT.md](./TECHNICAL_AUDIT.md)** & **[BUG_FIX_REGRESSION_REPORT.md](./BUG_FIX_REGRESSION_REPORT.md)** — Baseline technical audit and bug fixes (`#69`, `#72`, `#75`).
8. **[DATA-01-RLS-VERIFICATION.md](./DATA-01-RLS-VERIFICATION.md)** & **[AUTH_SMTP_VERIFICATION.md](./AUTH_SMTP_VERIFICATION.md)** — Security RLS protocol and Brevo SMTP configuration record.
9. **[Evidence/Playwright-Fixes/](./Evidence/Playwright-Fixes/)** — November 23 Chromium screenshots (`375px` mobile quiz & dark-mode task modal fixes).
