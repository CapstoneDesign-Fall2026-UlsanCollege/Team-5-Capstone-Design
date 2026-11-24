# Week 12 — Verification & Release Readiness Hub

**Project:** Smart Study Companion — Team 5 (Ulsan College)  
**Repository:** https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design  
**Updated:** November 25, 2026  

---

## Read First

**Status: NO-GO — Pending Live Security and Release Verification.**  
Reconciled through `origin/main` (`bb7c974`) and branch `week12/final-qa-reconciliation`. Frozen Week 11 core bug fixes (`PR #69`, `#71`, `#72`, `#75`) and PR #85 QA/UI fixes are merged or staged for review; **AI Tutor** ([PR #78](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/78), migration `013`) remains **DEFERRED** outside the frozen-core gate. Official course Vercel SHA (`UNKNOWN / UNVERIFIED`), live migrations (`009`, `010`, `012`), live `DATA-01` RLS (`NOT RUN`), live `generate-ai-quiz` (`UNVERIFIED`), credentialed live E2E runs (`18/24 NOT RUN`), and `5/5` team freeze approvals remain open.

1. [MVP Verification Matrix (Week 12)](./MVP_VERIFICATION_MATRIX.md): reconciled mandatory release gates using strict `PASS` / `FAIL` / `BLOCKED` / `NOT RUN` / `UNCONFIRMED` / `UNVERIFIED` / `DEFERRED` taxonomy.
2. [Release Verification Report](./RELEASE_VERIFICATION_REPORT.md): complete Sections A–F release readiness audit.
3. [Shared Weekly Report](./weekly-report.md): decisions, ownership breakdown, and unresolved blockers.

## Evidence Map

| Claim | Source and method | Operator / owner | Revision or environment | Result and limit |
| :--- | :--- | :--- | :--- | :--- |
| Reconciled frozen-core bug fixes (`#69`, `#71`, `#72`, `#75`) & Brevo SMTP password reset (`#40`) | [Regression report](./BUG_FIX_REGRESSION_REPORT.md), [SMTP report](./AUTH_SMTP_VERIFICATION.md), [Prince Recovery QA](./PRINCE_KARKI_PASSWORD_RECOVERY_QA.md) | Nabin Khadka (`liftupkhadka555-spec`) impl / Prince Karki (`princekark`) recovery QA | Merged on `origin/main` (`bb7c974`) | Local unit (`93/93`), PGlite (`36/36`), & password reset verified; signup confirmation & expired token remain `UNVERIFIED`. |
| Database migrations (`009`, `010`, `012`) & `DATA-01` two-student RLS | [Sumit Adhikari Report](./Sumit-Adhikari-Database-Security-Report.md), [DATA-01 protocol](./DATA-01-RLS-VERIFICATION.md) | Sumit Adhikari (`adronnie`) owner / Prince & Prabin QA | Live Supabase REST probes (Nov 25, 2026) | Anon `E2E-RLS-02` `PASS` (0 rows / 8 tables); `009`/`010`/`012` **`UNVERIFIED` (not applied live)**; live `DATA-01` **`NOT RUN`**. |
| Playwright automation repair & independent failure classification | [Prabin Rai Report](./Prabin-Rai-Automation-Repair-Report.md), [Prince QA Report §16](./PRINCE_KARKI_AUTOMATED_QA_REPORT.md), [Playwright Report](./PLAYWRIGHT_E2E_REPORT.md) | Prabin Rai (`RaiPrabin697`) harness / Prince Karki (`princekark`) QA | Nov 22 baseline (`15/24`: 7 PASS, 8 FAIL, 9 unconfirmed); Nov 25 agent-assisted rerun on `bb7c974` + fixes | `6/24` unauth/anon **`PASS`** (`12` Chrome runs); `18/24` authenticated **`NOT RUN`** (`SKIPPED` pending `E2E_STUDENT_A/B`); separate mocked `UI-REG-01..06` **`PASS`** (`12` runs). |
| Responsive Quiz (`#83`, `320px–1440px`), Retake Quiz & Dark Dropdown (`#84`) | [JN Taj Oli Report](./JN-Taj-Oli-Responsive-UI-Report.md), [QUIZ_RETAKE_PEER_REVIEW.md](./QUIZ_RETAKE_PEER_REVIEW.md), [ISSUE_83_UPDATE_DRAFT.md](./ISSUE_83_UPDATE_DRAFT.md) | J.N. Taj Oli (`jn-oli`) fix owner (`#84` reported by `adronnie`) | Nov 23 manual retake + Nov 25 agent-assisted 7-viewport Light/Dark Chrome sweep | Agent-assisted 7-viewport × 2-theme matrix **`PASS`** (`UI-REG-06`), Issue #83 stays **OPEN** (`UNCONFIRMED`) pending `jn-oli` & live QA verification. |
| Official Course Vercel Deployment | [Deployment verification](./DEPLOYMENT_VERIFICATION.md) | Nabin Khadka (`liftupkhadka555-spec`) | HTTP probe vs `team-5-capstone-design.vercel.app` (Nov 25, 2026) | SHA **`UNKNOWN / UNVERIFIED`** (`BLOCKED` locally; active `etag` lags `bb7c974`, [Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59) pending). |
| AI Tutor (`#ai-tutor`, PR `#78`, migration `013`) | [AI Tutor Docs](../ai_tutor/AI_TUTOR_IMPLEMENTATION_REPORT.md), [AI tutor DB model](./AI%20tutor%20DB%20model.md) | Nabin Khadka impl / Sumit DB model / J.N. Taj UI spec | Live cloud probe (Nov 25, 2026) | **`DEFERRED`** — Post-freeze feature; local implementation verified (`4/4` PGlite, `14/14` Vitest), live `013` & `ai-tutor-chat` return `404`. Excluded from MVP gates. |

## Individual Member & Functional Documents

1. **[MVP_VERIFICATION_MATRIX.md](./MVP_VERIFICATION_MATRIX.md)** — Authoritative reconciled Week 12 gate matrix.
2. **[RELEASE_VERIFICATION_REPORT.md](./RELEASE_VERIFICATION_REPORT.md)** — Complete release verification & GO/NO-GO audit (Sections A–F).
3. **[weekly-report.md](./weekly-report.md)** — Team Week 12 shared status, contribution table, decisions, and blockers.
4. **[Sumit-Adhikari-Database-Security-Report.md](./Sumit-Adhikari-Database-Security-Report.md)** (`adronnie`) — Migrations `009`/`010`/`012`/`013`, live `DATA-01` checklist, and Issue #84 reporter attribution.
5. **[Prabin-Rai-Automation-Repair-Report.md](./Prabin-Rai-Automation-Repair-Report.md)** (`RaiPrabin697`) — Playwright semantic locator upgrades, harness fixes, and non-cloud regression separation.
6. **[PRINCE_KARKI_AUTOMATED_QA_REPORT.md](./PRINCE_KARKI_AUTOMATED_QA_REPORT.md)** (`princekark`) — Nov 22 baseline (**15/24**) + Nov 25 8-failure classification table & retest addendum + **[PRINCE_KARKI_PASSWORD_RECOVERY_QA.md](./PRINCE_KARKI_PASSWORD_RECOVERY_QA.md)**.
7. **[JN-Taj-Oli-Responsive-UI-Report.md](./JN-Taj-Oli-Responsive-UI-Report.md)** (`jn-oli`) — Issue `#83`/`#84`/`#79`/`#80` UI/responsive fixes, **7-viewport × 2-theme** matrix, **[ISSUE_83_UPDATE_DRAFT.md](./ISSUE_83_UPDATE_DRAFT.md)**, **[QUIZ_RETAKE_PEER_REVIEW.md](./QUIZ_RETAKE_PEER_REVIEW.md)**, and **[Evidence1/Retake Quiz Evidence.md](./Evidence1/Retake%20Quiz%20Evidence.md)**.
8. **[DEPLOYMENT_VERIFICATION.md](./DEPLOYMENT_VERIFICATION.md)** (`liftupkhadka555-spec`) — Official course Vercel vs fork bundle comparison (`UNKNOWN / UNVERIFIED` SHA) & Issue #59.
9. **[PLAYWRIGHT_E2E_REPORT.md](./PLAYWRIGHT_E2E_REPORT.md)** — Nov 20 (`0/24`), Nov 22 (`15/24`), Nov 23, and Nov 25 Playwright run records.
10. **[TECHNICAL_AUDIT.md](./TECHNICAL_AUDIT.md)**, **[BUG_FIX_REGRESSION_REPORT.md](./BUG_FIX_REGRESSION_REPORT.md)**, **[QUIZ_RETAKE_BUG_FIX_REPORT.md](./QUIZ_RETAKE_BUG_FIX_REPORT.md)**, **[AUTH_SMTP_VERIFICATION.md](./AUTH_SMTP_VERIFICATION.md)**, **[DATA-01-RLS-VERIFICATION.md](./DATA-01-RLS-VERIFICATION.md)**.
11. **[Evidence/Playwright-Fixes/](./Evidence/Playwright-Fixes/)** — Viewport & dark-mode visual screenshots (`320px`, `375px`, `1440px`).
