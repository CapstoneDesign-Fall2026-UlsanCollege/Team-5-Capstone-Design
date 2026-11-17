# Nabin Khadka — Week 11 Evidence Dossier

**Member:** Nabin Khadka (`liftupkhadka555-spec`)  
**Role:** Full-Stack Integration, Deployment, Repository Audit, and Release Coordination  
**Date:** November 17, 2026  
**Status:** Implementation, Deployment Preparation, and Documentation Completed in Part — Live Verification and Freeze Approval Pending  

---

## 1. Primary Evidence Documents

1. **Individual Evidence Summary:**  
   [NABIN_KHADKA_EVIDENCE.md](../../docs/week_11/NABIN_KHADKA_EVIDENCE.md)
2. **Vercel Deployment & Provenance Report:**  
   [VERCEL_DEPLOYMENT_REPORT.md](../../docs/week_11/VERCEL_DEPLOYMENT_REPORT.md)
3. **Frontend Deployment Platform Decision (Issue #59):**  
   [FRONTEND_DEPLOYMENT_DECISION.md](../../docs/week_11/FRONTEND_DEPLOYMENT_DECISION.md)
4. **MVP Verification Matrix (19 Gates):**  
   [MVP_VERIFICATION_MATRIX.md](../../docs/week_11/MVP_VERIFICATION_MATRIX.md)
5. **E2E & Test Automation Results:**  
   [E2E_TEST_RESULTS.md](../../docs/week_11/E2E_TEST_RESULTS.md)
6. **Feature Freeze Decision (Conditional Go Proposed):**  
   [FEATURE_FREEZE_DECISION.md](../../docs/week_11/FEATURE_FREEZE_DECISION.md)

---

## 2. Deployment Artifacts & Screenshots

| Artifact File | Description | Captured / Provenance | Status |
| :--- | :--- | :--- | :--- |
| [`W11-VERCEL-01-project-creation.png`](./W11-VERCEL-01-project-creation.png) | Vercel dashboard project import confirmation for `team-5-capstone-design-761v` from `liftupkhadka555-spec/Team-5-Capstone-Design` | Nov 16, 2026 | Verified Screenshot |

---

## 3. Test Suites & Automation Contributions

| Suite | File Location | Executed Result | Notes |
| :--- | :--- | :--- | :--- |
| **Vitest Unit Suite** | `tests/` (`*.test.js`) | 28 / 28 PASS | Local unit / service tests |
| **Python System Harness** | `tests/run_tests.py` | 11 / 11 PASS | Structural and integration checks |
| **Python AI Quiz Suite** | `tests/test_ai_quiz.py` | 4 / 4 PASS | Schema and grading tests |
| **Python Contract Runner** | `tests/e2e/e2e_runner.py` | 3 / 3 PASS | Local contract, file, and DOM checks |
| **Playwright Browser Suite** | `tests/e2e/*.spec.js` | 0 / 24 EXECUTED | Suite audited & repaired; pending browser test runner installation |

---

## 4. Acceptance Gates Reconciliation

In accordance with the Week 11 reconciliation audit, the following gates remain explicitly pending team action:
1. **Playwright Execution:** 24 cases across 7 specifications pending `@playwright/test` runner install and browser runs.
2. **Two-Student Authenticated RLS (`DATA-01`):** Two active student sessions cross-querying each other's tasks pending execution.
3. **Course Organization Deployment:** Linking upstream `CapstoneDesign-Fall2026-UlsanCollege` to Vercel pending university organization admin approval.
4. **Team Freeze Sign-off:** Signatures pending from all 5 team members.
