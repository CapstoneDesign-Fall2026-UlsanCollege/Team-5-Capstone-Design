# Week 11 Weekly Report — Smart Study Companion

**Project:** Smart Study Companion  
**Team:** Team 5 — Capstone Design, Fall 2026 (Ulsan College)  
**Milestone:** Week 11 — MVP Verification and Goal Freeze Gate  
**Execution Period:** November 15–18, 2026  
**Report Date:** November 17, 2026  
**Milestone Status:** **CONDITIONAL GO PROPOSED — Core Scope Defined; Final Team Approval and Live Acceptance Pending**

---

## 1. Executive Summary & Reconciliation Baseline

At the close of Week 11, Team 5 reconciles its progress against the **MVP Verification and Goal Freeze Gate** outlined in [`docs/FINAL_ROADMAP.md`](../FINAL_ROADMAP.md). In response to faculty review feedback, this package separates deployment, browser, database and documentation evidence rather than combining them into unsupported success claims.

1. **Scope Defined & Freeze Proposed:** The 5 core student modules (Academic Onboarding, Tasks, Quizzes, Analytics, Auth) are scope-locked, and the Gemini AI Chat Assistant is formally deferred as post-MVP scope.
2. **Frontend Hosting Deployed in Part:** A multi-page Vite production build was deployed to the Vercel Edge Network via a temporary CLI preview. The permanent course-organization deployment remains pending Vercel GitHub App authorization.
3. **Database Probes Completed; Migrations Pending:** Live catalog tables were verified via read-only probes (`universities=46`, `subjects=32`), but migrations `009_ai_quiz_tables.sql` and `010_complete_universities.sql` remain pending in Supabase Cloud.
4. **Automated Testing Differentiated:** Local unit tests (28/28), Python system checks (11/11), and Python contract checks (3/3) pass 100%. However, Playwright browser execution (**0/24 executed**) remains outstanding because browser dependencies and binaries are not installed in the verified environment.
5. **Issue Backlog Reduced:** Audited all 21 historical issues (Sep 19 – Oct 13), closing 18 completed items (#15–#23, #25, #28–#35) via merge commit `09d4c64`. Issue #59 remains open pending deployment administration.

---

## 2. Complete Week 11 Technical Documentation Directory

During Week 11, Team 5 established a comprehensive set of technical documents, verification registers, and test runbooks:

| Category | Deliverable Document | Purpose & Verification Scope | Status |
| :--- | :--- | :--- | :---: |
| **Verification Gate** | [`MVP_VERIFICATION_MATRIX.md`](MVP_VERIFICATION_MATRIX.md) | Central MVP acceptance matrix tracking 19 gates across deployment, auth, tasks, RLS, and testing. | **Restored** |
| **Scope Freeze** | [`FEATURE_FREEZE_DECISION.md`](FEATURE_FREEZE_DECISION.md) | Proposed freeze locking core 5 views and deferring Gemini AI Chat; 5/5 member sign-offs pending. | **Proposed (Pending)** |
| **Deployment** | [`VERCEL_DEPLOYMENT_REPORT.md`](VERCEL_DEPLOYMENT_REPORT.md) | Deployment provenance record reconciling temporary preview URL vs. personal fork vs. course org. | **Active** |
| **Deployment** | [`FRONTEND_DEPLOYMENT_DECISION.md`](FRONTEND_DEPLOYMENT_DECISION.md) | Architectural comparison of Vercel vs. GitHub Pages vs. Netlify; maps to open Issue #59. | **Active** |
| **Deployment** | [`DEPLOYMENT_VERIFICATION.md`](DEPLOYMENT_VERIFICATION.md) | Vite 6 multi-page build verification (112ms, 6 HTML pages) and HTTP security headers (`nosniff`, `DENY`). | **Active** |
| **Issue Audit** | [`ISSUES_AUDIT_SEP19_OCT13.md`](ISSUES_AUDIT_SEP19_OCT13.md) | Audit of 21 historical issues (#14–#36), linking code and screenshots, closing 18 open issues. | **Completed** |
| **Individual Evidence** | [`NABIN_KHADKA_EVIDENCE.md`](NABIN_KHADKA_EVIDENCE.md) | Individual evidence record for Nabin Khadka (`liftupkhadka555-spec`) with disclosed limits. | **Active** |
| **Individual Evidence** | [`RAI_LIVE_TEST_RECEIPT.md`](RAI_LIVE_TEST_RECEIPT.md) | Documentation review and repeatable task check protocol for Prabin Rai (`RaiPrabin697`). | **Active** |
| **Testing & E2E** | [`E2E_TEST_RESULTS.md`](E2E_TEST_RESULTS.md) | Results of 3/3 contract checks and audit of 24 unexecuted Playwright browser specs. | **Active** |
| **Testing — Analytics** | [`Study_Analytics_Report.md`](Study_Analytics_Report.md) | Prince Karki's manual testing receipt covering 8 analytics checks (8 PASS / 0 FAIL) and 8 screenshots. | **Completed** |
| **Testing — Desktop UI/UX** | [`UI_UX_VERIFICATION.md`](UI_UX_VERIFICATION.md) | J.N. Taj Oli's November 16 desktop review covering 45 UI checks across 5 views. | **Completed (Desktop)** |
| **Testing — Mobile UI/UX** | [`MOBILE_UI_EVIDENCE.md`](MOBILE_UI_EVIDENCE.md) | J.N. Taj Oli's November 18 mobile review at 390px across 5 views in light and dark mode, with 10 PASS / 0 FAIL overflow checks. | **Completed (Mobile)** |
| **Codebase Audit** | [`REPOSITORY_AUDIT.md`](REPOSITORY_AUDIT.md) | Baseline code audit confirming BaaS architecture over redundant Express servers. | **Active** |
| **Database & RLS** | [`DATABASE_AND_RLS_VERIFICATION.md`](DATABASE_AND_RLS_VERIFICATION.md) | Read-only Supabase table probes, RLS policies, and non-destructive SQL plan for `009`/`010`. | **Active** |
| **Authentication** | [`AUTHENTICATION_VERIFICATION.md`](AUTHENTICATION_VERIFICATION.md) | 14-step auth journey, session persistence, and Brevo Custom SMTP setup guide. | **Active** |
| **AI Features** | [`AI_QUIZ_LIVE_VERIFICATION.md`](AI_QUIZ_LIVE_VERIFICATION.md) | Edge Function deployment runbook, Gemini API secret management, and client fallback handling. | **Active** |
| **Quality Review** | [`DEFECT_AND_RISK_REGISTER.md`](DEFECT_AND_RISK_REGISTER.md) | Active risk tracker (PGRST205, AI question quality, recovery email delivery, cold-start latency). | **Active** |
| **Quality Review** | [`EVIDENCE_REGISTER.md`](EVIDENCE_REGISTER.md) | Master index of historical and fresh Week 11 screenshot artifacts with privacy controls. | **Updated (Nov 18)** |
| **Quality Review** | [`SPRINT_QUALITY_REVIEW.md`](SPRINT_QUALITY_REVIEW.md) | Quality gate review, release criteria audit, and review checklist. | **Active** |
| **Quality Review** | [`INDEPENDENT_VERIFICATION.md`](INDEPENDENT_VERIFICATION.md) | Authoritative 7-step reproduction protocol for independent non-author two-student RLS testing. | **Active** |
| **Overview** | [`README.md`](README.md) | Week 11 package navigation guide, index, and reading order. | **Active** |
| **Working Drafts** | [`NABIN_WEEKLY_REPORT_DRAFT.md`](NABIN_WEEKLY_REPORT_DRAFT.md) | Working report draft and technical checklist. | **Historical Draft** |

---

## 3. Automated & Verification Test Results

In accordance with faculty instructions, test results are strictly categorized by their verified execution scope:

| Test Suite | Recorded Result | Actual Execution Scope | Evidence Reference |
| :--- | :---: | :--- | :--- |
| **Vitest Unit & Services** | **28 / 28 PASS** | Local unit and service contract tests (`auth`, `tasks`, `quiz`, `theme`) | `npm test` passing in 222ms |
| **Python System Harness** | **11 / 11 PASS** | Structural file checks, schema validation, calculations, catalogs | `python3 tests/run_tests.py` |
| **Python AI Quiz Suite** | **4 / 4 PASS** | Migration 009 schema syntax, bounds validation, scoring | `python3 tests/test_ai_quiz.py` |
| **Python E2E Contract Runner** | **3 / 3 PASS** | Static file existence, DOM selector bindings, anonymous REST health | `python3 tests/e2e/e2e_runner.py` |
| **Playwright Browser Tests** | **0 / 24 EXECUTED** | 24 specs drafted across 7 files; unrun due to missing package installation | [`E2E_TEST_RESULTS.md`](E2E_TEST_RESULTS.md) |
| **Two-Student Authenticated RLS** | **NOT RUN** | Server-side read/update/delete denial across two live accounts unverified | [`INDEPENDENT_VERIFICATION.md`](INDEPENDENT_VERIFICATION.md) |
| **Vite Multi-Page Build** | **PASS (112ms)** | Production bundling of 6 HTML entry points to `dist/` | `npm run build` |

---

## 4. Frontend Deployment Status & Source Provenance

- **Temporary Preview URL:** [`https://rapid-oxygen-cicusvj.tmp.now`](https://rapid-oxygen-cicusvj.tmp.now) (Verified HTTP 200 on all 6 entry points with `nosniff`, `DENY` headers).
- **Personal Fork CI/CD Project:** [`liftupkhadka555-spec/Team-5-Capstone-Design`](https://github.com/liftupkhadka555-spec/Team-5-Capstone-Design) connected to Vercel project `team-5-capstone-desi...`.
- **Course Organization Repository:** Upstream deployment for `CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design` remains pending university administrator approval for the Vercel GitHub App.
- **Source SHA Provenance:** The temporary preview reflects local working tree assets; automated deployment of the latest course repository commit is unverified until administrator authorization is completed.
- **Backend Role:** Supabase Cloud (`bcwwnjtmrcxggbaallon.supabase.co`) remains the application backend; no redundant Node/Express server on Render is required.

---

## 5. Team 5 Member Contributions & Status

| Member | GitHub Login | Verified Week 11 Accomplishments | Outstanding Work / Pending Gates | Primary Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **Nabin Khadka** | `liftupkhadka555-spec` | Vercel preview deployment, Vite multi-page build, E2E spec authoring, contract runner (3/3), audit & closure of 18 issues (#15–#35), Week 11 technical documentation | Permanent course-org deployment approval, migration execution, Playwright execution, final freeze sign-off | [`NABIN_KHADKA_EVIDENCE.md`](NABIN_KHADKA_EVIDENCE.md), [`E2E_TEST_RESULTS.md`](E2E_TEST_RESULTS.md) |
| **Prabin Rai** | `RaiPrabin697` | Documentation package completed: review structure, evidence classification, and repeatable task protocol. Assisted Nov 14 browser checks partially observed Account A task behavior. | Evidence/artifact capture, independent verification, Playwright package installation and browser execution | [`RAI_LIVE_TEST_RECEIPT.md`](RAI_LIVE_TEST_RECEIPT.md), [`INDEPENDENT_VERIFICATION.md`](INDEPENDENT_VERIFICATION.md) |
| **Prince Karki** | `princekark` | Study Analytics manual testing (8 PASS / 0 FAIL), 8 screenshot artifacts, task CRUD observation | Two-student authenticated RLS testing (`DATA-01`), Brevo SMTP setup/OTP delivery, final freeze sign-off | [`Study_Analytics_Report.md`](Study_Analytics_Report.md) |
| **Sumit Adhikari** | `adronnie` | Supabase Cloud schema review, academic catalog probe verification, non-destructive SQL execution plan | Execution of `009` and `010` in Supabase Cloud SQL Editor, live migration receipt, final freeze sign-off | [`DATABASE_AND_RLS_VERIFICATION.md`](DATABASE_AND_RLS_VERIFICATION.md) |
| **J.N. Taj Oli** | `jn-oli` | Desktop UI/UX verification across five views (45 PASS / 0 FAIL), including theme persistence and Escape-key modal behavior; separate 390px mobile verification across five views in light and dark mode (10 PASS / 0 FAIL), with no horizontal overflow | Freeze sign-off; two-student task check and other team release gates remain separate from UI evidence | [`UI_UX_VERIFICATION.md`](UI_UX_VERIFICATION.md), [`MOBILE_UI_EVIDENCE.md`](MOBILE_UI_EVIDENCE.md) |

---

## 6. Formal Scope Freeze Proposal

**Recommendation:** **CONDITIONAL GO PROPOSED**  
Documented in: [`FEATURE_FREEZE_DECISION.md`](FEATURE_FREEZE_DECISION.md)

1. **LOCKED Core MVP Modules (Scope Freeze Proposed):**
   - 5-tier cascading academic onboarding (Country → University → Faculty → Major → Subject).
   - Task CRUD, validation, deadline sorting, and status toggles.
   - Standard curated quiz engine and score calculation.
   - Study task analytics dashboard and progress tracking.
   - User authentication and session persistence.
2. **DEFERRED Beyond MVP:**
   - Google Gemini AI Study Chat Assistant (`#view-assistant`) is formally deferred to post-MVP roadmap to safeguard delivery of core functionality.
   - Reminders, push notifications, and administrative portals remain post-MVP items.
3. **Pending Sign-Offs:** Formal freeze approval remains **PENDING** for all 5 team members until each student signs off on the reconciliation PR.

---

## 7. Priority Handoff to Week 12

1. **P0 (Database):** Execute `supabase/migrations/009_ai_quiz_tables.sql` and `010_complete_universities.sql` in Supabase Cloud SQL Editor to resolve Issue #53 (`PGRST205`). *(Owner: Sumit Adhikari)*
2. **P0 (Security / RLS):** Execute two-student authenticated RLS isolation check (`DATA-01`) per [`INDEPENDENT_VERIFICATION.md`](INDEPENDENT_VERIFICATION.md) using disposable test accounts. *(Reviewer: Prince Karki or another approved non-author)*
3. **P0 (Auth / Email):** Configure Brevo Custom SMTP in Supabase Auth to resolve password recovery delivery (Issue #40). *(Owner: Nabin Khadka / Prince Karki)*
4. **P1 (Automated Testing):** Install `@playwright/test` and run the 24 drafted browser tests against local preview. *(Owner: Prabin Rai)*
5. **P1 (Deployment):** Request university admin approval for the Vercel GitHub App to link `CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design` directly. *(Owner: Nabin Khadka)*
6. **P1 (Freeze Approval):** Collect and record formal sign-offs from all 5 members in [`FEATURE_FREEZE_DECISION.md`](FEATURE_FREEZE_DECISION.md). *(All Members)*
