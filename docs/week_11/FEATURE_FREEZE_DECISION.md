# Week 11 MVP Feature Freeze Decision & Gate Assessment



**Project:** Smart Study Companion  
**Team:** Team 5 — Capstone Design, Fall 2026 (Ulsan College)  
**Date:** 2026-11-15  
**Milestone:** Week 11 Goal Freeze Gate  
**Recommendation (proposed, pending team approval):** **CONDITIONAL GO**

---

## 1. Executive Freeze Summary

At the close of Week 11, Team 5 formally assesses the readiness of the Smart Study Companion Minimum Viable Product (MVP). The purpose of this gate is to **freeze scope**, prevent late-stage feature creep, and focus the team's remaining timeline on operational deployment, peer QA, hardening, and final presentation rehearsals.

### The Recommendation: CONDITIONAL GO
- **Why "GO":** The codebase is structurally sound. Unit and service-contract suites pass at **28/28 tests**; system integration passes at **11/11 check groups**; the multi-page production build succeeds in **117ms**; and draft Playwright specs (not yet run in a browser) plus a contract-check runner passing **3/3 check groups**.
- **Why "CONDITIONAL":** Live cloud deployment requires four specific, non-destructive operational actions in the Supabase Dashboard / CLI before final live demonstration readiness can be certified:
  1. Apply `009_ai_quiz_tables.sql` in the Supabase Cloud SQL Editor.
  2. Apply `010_complete_universities.sql` in the Supabase Cloud SQL Editor.
  3. Deploy `generate-ai-quiz` via Supabase CLI (`npx supabase functions deploy`).
  4. Configure Brevo Custom SMTP in Supabase Auth settings to enable real email verification.

---

## 2. Frozen MVP Scope Boundary

The features below are **scope-locked**. No new functionality, UI redesigns, or database schema additions will be permitted on these core modules through the final Capstone presentation:

| Module / Area | Scope Included in Freeze | Status | Change Policy |
|---|---|---|---|
| **Student Authentication** | Signup, login, logout, 6-digit OTP reset, route protection (`auth-guard.js`), Brevo SMTP | **FROZEN** | Bug fixes only (no new auth providers) |
| **Academic Hierarchy** | 5-tier cascading onboarding (Country → University → Faculty → Major → Subjects) | **FROZEN** | Bug fixes only |
| **Task Management** | Task CRUD, validation, deadline sorting, search, filter chips | **FROZEN** | Bug fixes only |
| **Study Task Analytics** | Real-time completion ring, 7-day scheduled bar chart, subject progress bars | **FROZEN** | Metric alignment only |
| **Curated Quizzes** | 345 questions across 32 subjects, Standard/Rapid modes, explanations, attempt history | **FROZEN** | Bug fixes only |
| **AI Quiz Generator** | Topic-based generation, 4 choices, answer explanations, difficulty levels, local fallback | **FROZEN** | CLI deploy & SQL run only |
| **Database & RLS** | 10 versioned migrations, `setup_all.sql`, Row Level Security on all private tables | **FROZEN** | Execute pending SQL in Dashboard |
| **UI & Theme** | 5-view SPA shell, responsive desktop/mobile layouts, light/dark theme toggle | **FROZEN** | Visual polish & accessibility only |

---

## 3. Extended Feature Decision: Google Gemini AI Chat Assistant

### Background
The repository contains comprehensive architectural blueprints and integration plans for a ChatGPT-style conversational tutor:
- [`docs/AI_STUDY_ASSISTANT_ARCHITECTURE.md`](../AI_STUDY_ASSISTANT_ARCHITECTURE.md)
- [`docs/week_10/ai-integration-plan.md`](../week_10/ai-integration-plan.md)

### Formal Gate Decision: DEFERRED FROM MVP FREEZE
The **Google Gemini AI Chat Assistant (`#view-assistant`)** is formally classified as an **Extended Feature** and **deferred from the core Week 11 MVP build**.

### Justification
1. **MVP Stability First:** Honoring Non-Negotiable Rule 5 & 6, our primary Capstone delivery requirement is a rock-solid study planner with working persistence and verified two-student RLS security. Adding a multi-turn streaming chat assistant before stabilizing live SMTP and E2E isolation would introduce significant defect risk.
2. **Quota & Cost Safety:** Gemini API free-tier quotas (RPM/RPD) and rate limits require careful server-side quota tracking (`public.ai_usage_quotas`). Rushing this implementation would create potential runtime failures during the live presentation.
3. **Repository Preservation:** The complete architecture, schema migration (`011`), and system prompt designs remain safely documented in the repository as approved future work for post-Capstone evolution or an optional Week 13 extension if all P0/P1 defects are resolved ahead of schedule.

---

## 4. Risk Register Entering Week 12

| Risk | Severity | Probability | Mitigation Strategy | Owner |
|---|---|---|---|---|
| **Live Supabase SQL Editor execution delay (`009`, `010`)** | High | Low | Sumit Adhikari executes non-destructive SQL scripts via Dashboard; client service already includes graceful local fallback | Sumit Adhikari |
| **Brevo SMTP domain verification delays** | Medium | Medium | Configure Brevo SMTP key in Supabase Auth; test using authorized sender email; fallback to verified Gmail App Password SMTP if Brevo DNS propagation lags | Nabin Khadka / Prince Karki |
| **Render cold-start latency if deployed as Node server** | High | High | Keep Supabase as primary backend; deploy Render solely as a static file mirror (matching Vercel/GitHub Pages) rather than an artificial Express proxy | Nabin Khadka |
| **Client-side quiz answer visibility (`correct_answer`)** | Medium | High | Formally label curated quizzes as self-study practice assessments during demo, or implement server-side RPC grading in Week 12 | Nabin Khadka / Sumit Adhikari |

---

## 5. Team Approval & Sign-Off Status

No teammate has approved this freeze. Approval status is pending for every member.

| Member | Role | Freeze Sign-Off Status |
|---|---|---|
| Nabin Khadka (`liftupkhadka555-spec`) | Integration Lead | PENDING |
| Sumit Adhikari (`adronnie`) | Database Engineer | PENDING |
| Prince Karki (`princekark`) | QA / Auth Tester | PENDING |
| Prabin Rai (`RaiPrabin697`) | QA Automation Lead | PENDING |
| J.N. Taj Oli (`jn-oli`) | UI/UX Lead | PENDING |
