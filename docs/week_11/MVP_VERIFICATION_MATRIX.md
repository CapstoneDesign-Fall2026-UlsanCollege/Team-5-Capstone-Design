# MVP Verification Matrix — Week 11 Reconciliation

> **Note (Nov 25, 2026):** This file preserves the dated Week 11 (Nov 17) freeze baseline. For the current reconciled release gates, status labels (`PASS`/`FAIL`/`BLOCKED`/`NOT RUN`/`UNCONFIRMED`/`UNVERIFIED`/`DEFERRED`), and deferred AI Tutor separation, see [`docs/week_12/MVP_VERIFICATION_MATRIX.md`](../week_12/MVP_VERIFICATION_MATRIX.md).

**Project:** Smart Study Companion — Team 5 (Ulsan College)  
**Milestone:** Week 11 — MVP Goal Freeze  
**Reconciliation Date:** November 17, 2026  
**Baseline Commit:** `d274332143ad1727e8aa1bd126bc7d4e2bd834b8`  
**Overall Acceptance Status:** **PARTIAL — Core Scope Defined & Tested Locally; Cloud Acceptance & Approvals Pending**

---

## 1. Verification Matrix by Subsystem

| Case ID | Feature / Subsystem | Expected Result | Actual Result | Status | Environment | Operator | Evidence Reference |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| **DEPL-01** | Production Multi-Page Build | Vite bundles 6 HTML entry points to `dist/` without syntax or asset errors | 6 HTML pages bundled in 112ms; gzip sizes reported | **PASS** | Local Node 18+ / Vite 6.0 | Nabin Khadka (`liftupkhadka555-spec`) | [`DEPLOYMENT_VERIFICATION.md`](DEPLOYMENT_VERIFICATION.md) |
| **DEPL-02** | Static Edge CDN Hosting (Temporary) | Client served over HTTPS with security headers (`nosniff`, `DENY`) | HTTP 200 returned on all 6 routes at `https://rapid-oxygen-cicusvj.tmp.now` | **PASS (Temporary)** | Vercel CLI Edge Network | Nabin Khadka (`liftupkhadka555-spec`) | [`VERCEL_DEPLOYMENT_REPORT.md`](VERCEL_DEPLOYMENT_REPORT.md) |
| **DEPL-03** | Course Org CI/CD Deployment | Automated builds on push to `CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design` | Blocked by org third-party app restriction; deployed via personal fork pipeline | **PARTIAL** | Vercel Git Integration | Nabin Khadka (`liftupkhadka555-spec`) | [`FRONTEND_DEPLOYMENT_DECISION.md`](FRONTEND_DEPLOYMENT_DECISION.md) |
| **AUTH-01** | Student Login & Session | Valid credentials sign in; session persists across reload; invalid credentials show error | Login UI, session restore, and error alert verified locally and in mock/contract tests | **PASS (Local/Mock)** | Browser / Local Preview & Vitest | Prince Karki / Vitest | [`../week_10/TESTING_REPORT.md`](../week_10/TESTING_REPORT.md), [`AUTHENTICATION_VERIFICATION.md`](AUTHENTICATION_VERIFICATION.md) |
| **AUTH-02** | Brevo SMTP Confirmation & Reset | 6-digit OTP code or link delivered to student email; password reset successfully | Password recovery request acknowledged by API, but email not received in inbox | **FAIL / BLOCKED** | Live Supabase Auth / Brevo | Prince Karki (`princekark`) | [`DEFECT_AND_RISK_REGISTER.md`](DEFECT_AND_RISK_REGISTER.md), Issue #40 |
| **ONB-01** | Cascading Academic Onboarding | Country → University → Faculty → Major → Subject cascades dynamically | Verified across 46 universities, 32 subjects; persists to localStorage/Supabase | **PASS** | Desktop Chrome / Vitest | J.N. Taj Oli (`jn-oli`) | [`UI_UX_VERIFICATION.md`](UI_UX_VERIFICATION.md), [`../week_10/Evidence/Prince-Karki/W10-58-academic-selection-page.png`](../week_10/Evidence/Prince-Karki/W10-58-academic-selection-page.png) |
| **TASK-01** | Task Creation & Title Validation | Valid title and deadline saves task; blank/whitespace title rejected | Valid task saved; empty title blocked by client validation; 28/28 unit tests pass | **PASS** | Local Browser & Vitest | Prabin Rai / J.N. Taj Oli | [`UI_UX_VERIFICATION.md`](UI_UX_VERIFICATION.md), [`../week_10/Task-create-test-pass.md`](../week_10/Task-create-test-pass.md) |
| **TASK-02** | Task Persistence After Refresh | Created task remains in task list with matching attributes after browser reload | Task remains visible in list after reload (tested manually by J.N. Taj Oli) | **PASS** | Desktop Browser | J.N. Taj Oli (`jn-oli`) | [`UI_UX_VERIFICATION.md`](UI_UX_VERIFICATION.md) |
| **TASK-03** | Task Completion & Deletion | Toggling checkbox marks completed; delete removes task after confirm | Task completion updates counts; delete removes row; verified in analytics | **PASS** | Desktop Browser | Prince Karki / J.N. Taj Oli | [`Study_Analytics_Report.md`](Study_Analytics_Report.md), [`UI_UX_VERIFICATION.md`](UI_UX_VERIFICATION.md) |
| **DATA-01** | Two-Student Authenticated RLS Isolation | Student B cannot read, update, or delete Student A's private tasks via API | UI hides cross-account data, but authenticated server-side API denial not verified with 2 live accounts | **NOT RUN** | Live Supabase PostgREST | Pending Independent Reviewer | [`INDEPENDENT_VERIFICATION.md`](INDEPENDENT_VERIFICATION.md), [`DATABASE_AND_RLS_VERIFICATION.md`](DATABASE_AND_RLS_VERIFICATION.md) |
| **DATA-02** | Anonymous REST Read Blocking | Unauthenticated caller to `/rest/v1/tasks` or `/profiles` gets 0 rows | Tested via `e2e_runner.py` against live endpoint; returns 0 rows due to RLS | **PASS** | Supabase PostgREST HTTPS | Nabin Khadka (`liftupkhadka555-spec`) | [`E2E_TEST_RESULTS.md`](E2E_TEST_RESULTS.md) |
| **ANLY-01** | Study Analytics Calculations & Charts | KPI cards, completion percentage ring, 7-day bar chart, subject progress render cleanly | 8 manual tests executed and passed without calculation error (Nov 16) | **PASS** | Desktop Browser | Prince Karki (`princekark`) | [`Study_Analytics_Report.md`](Study_Analytics_Report.md), [`Evidence/Prince-Karki/`](Evidence/Prince-Karki/) |
| **QUIZ-01** | Standard Curated Quiz & Scoring | 4 choices per question; immediate feedback; score calculated; attempt saved | Curated quiz flows work; questions load from catalog; attempt history rendered | **PASS** | Desktop Browser & Vitest | J.N. Taj Oli / Vitest | [`UI_UX_VERIFICATION.md`](UI_UX_VERIFICATION.md), `tests/unit/quiz.test.js` |
| **QUIZ-02** | Live AI Quiz Storage (Migration 009) | AI quiz generated via Edge Function and saved to `ai_quiz_attempts` table | Live Supabase returns HTTP 404 (PGRST205) because migration 009 is unapplied | **FAIL / BLOCKED** | Supabase Cloud | Prince Karki (`princekark`) | Issue #53, [`AI_QUIZ_LIVE_VERIFICATION.md`](AI_QUIZ_LIVE_VERIFICATION.md) |
| **UI-01** | Desktop 5-View & Theme Integrity | Dashboard, Tasks, Subjects, Analytics, Quiz readable in Light and Dark mode | 45 desktop UI checks passed on 2026-11-16; focus and Escape verified | **PASS** | Desktop Browser (macOS Safari/Chrome) | J.N. Taj Oli (`jn-oli`) | [`UI_UX_VERIFICATION.md`](UI_UX_VERIFICATION.md) |
| **UI-02** | Responsive Mobile (390px Viewport) | Layouts stack vertically; no horizontal scrollbar on mobile width | A separate Nov 18 390px browser-viewport receipt reports 10 PASS / 0 FAIL across five views in light/dark mode; physical-device touch behavior was not checked | **PASS (Viewport only)** | 390px browser viewport; physical device not verified | J.N. Taj Oli (`jn-oli`) | [`MOBILE_UI_EVIDENCE.md`](MOBILE_UI_EVIDENCE.md) |
| **E2E-01** | Playwright Browser Automated Suite | 24 browser test cases execute automatically across 7 specifications | Spec files authored, but `@playwright/test` is not installed; 0/24 browser runs executed | **NOT RUN** | Playwright Chromium/WebKit | Prabin Rai (`RaiPrabin697`) | [`E2E_TEST_RESULTS.md`](E2E_TEST_RESULTS.md) |
| **E2E-02** | Python Contract & DOM Runner | Verifies spec files, HTML IDs, and live anonymous endpoints | 3/3 contract check groups pass in 0.5s | **PASS (Contract)** | Python 3.9 CLI / HTTPS | Nabin Khadka (`liftupkhadka555-spec`) | [`E2E_TEST_RESULTS.md`](E2E_TEST_RESULTS.md) |
| **GATE-01** | Formal Team Freeze Approval | All 5 team members formally approve freezing MVP scope and deferring AI Chat | Freeze proposed in `FEATURE_FREEZE_DECISION.md`; 5/5 member sign-offs pending | **PENDING** | Team Review Process | All 5 Members | [`FEATURE_FREEZE_DECISION.md`](FEATURE_FREEZE_DECISION.md) |

---

## 2. Summary Status Counts

- **Total Cases Tracked:** 19
- **PASS (Within recorded scope):** 13 (DEPL-01, DEPL-02, AUTH-01, ONB-01, TASK-01, TASK-02, TASK-03, DATA-02, ANLY-01, QUIZ-01, UI-01, UI-02, E2E-02)
- **PARTIAL:** 1 (DEPL-03)
- **FAIL / BLOCKED:** 2 (AUTH-02 [Brevo SMTP], QUIZ-02 [PGRST205 Migration 009])
- **NOT RUN:** 2 (DATA-01 [Two-Student RLS], E2E-01 [Playwright Browser Suite])
- **PENDING:** 1 (GATE-01 [Team Freeze Sign-off])

Prabin's [November 14 assisted browser receipt](RAI_LIVE_TEST_RECEIPT.md) adds limited UI observations of task save/reload and separate Account B listing, without a sanitized proof artifact or known deployed build SHA. It does not replace the attributed team checks above or change `DATA-01`, `E2E-01`, or the freeze gate status.

The [November 20 candidate-build check](RAI_LIVE_TEST_RECEIPT.md#candidate-build-check-2026-11-20) established only that the public page loaded in a signed-in browser session. It is **not** a new task test, a cloud-persistence result, or an RLS result. No matrix task/security status changes from that check. `UI-02` is reconciled to the separate November 18 browser-viewport receipt; physical-device touch remains outside its pass scope.

---

## 3. Mandatory Gates for Week 12 Final Demo Readiness

To transition the project from **CONDITIONAL GO PROPOSED** to **DEMO READY**, the following gates must be completed:
1. **DATA-01:** Execute two-student authenticated RLS isolation check using independent reviewer protocol in [`INDEPENDENT_VERIFICATION.md`](INDEPENDENT_VERIFICATION.md).
2. **QUIZ-02:** Execute `supabase/migrations/009_ai_quiz_tables.sql` in Supabase Cloud SQL Editor to resolve Issue #53.
3. **AUTH-02:** Configure Brevo SMTP credentials in Supabase Auth to resolve password recovery delivery.
4. **GATE-01:** Obtain and record all 5 team member sign-offs in [`FEATURE_FREEZE_DECISION.md`](FEATURE_FREEZE_DECISION.md).
