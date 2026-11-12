# Final Demo Roadmap

**Team:** Team 5 — Smart Study Companion (Nabin Khadka, Sumit Adhikari, Prabin Rai, Prince Karki, J.N. Taj Oli)  
**Last updated:** 2026-11-12  

Use this shared roadmap to connect what the project can prove now to the final demo and handoff. Each student should understand the next milestone and add their own contribution and evidence to the shared Weekly Report.

## Final demo promise

Our final demo will show:

> A registered university student signs up or logs in via Supabase Auth, selects their country, university, faculty, major, and enrolled subjects, manages study tasks and deadlines with live `#analytics` metrics, practices curated and AI-generated subject quizzes with persisted attempt history, and proves another student account cannot read or modify their private study data — with an optional subject-aware **AI Chat Assistant** (`#view-assistant`) if cleared during the Week 11 feature-freeze gate.

**Who it helps and what problem it addresses:** University students (across South Korea, South Asia, and international programs) who currently scatter course syllabi, deadlines, progress tracking, and exam practice across disconnected tools and need one subject-anchored, privacy-isolated study workspace.  
**What the evidence will prove:** Live Supabase authentication (signup, verification/OTP, login, refresh persistence, recovery, logout), PostgreSQL task/profile/quiz persistence across page reloads, two-student Row Level Security (RLS) isolation, automated unit/integration/E2E test outputs, responsive desktop/mobile UI with light/dark themes, and independent peer handoff/setup verification.  
**What the demo will not claim:** Complete worldwide university coverage, production-grade server-enforced exam security if `quiz_questions.correct_answer` remains client-graded, paid/unapproved Gemini API tiers, or unverified features not backed by dated repository evidence (local preview mode will be explicitly labeled if cloud fallback is ever needed).

---

## Current state

**MVP progress:** Gap to close  
**If a gap remains, link the Week 11 recovery path:** [Week 10 Backend Final Report](week_10/backend-final-report.md) · [Week 10 Backend Test Results Matrix](week_10/backend-test-results.md) · [Week 10 Slice & Stewardship Plan](week_10/Slice.md) · [Final Demo Fallback Plan](week9/FINAL_DEMO_ROADMAP.md)

**Locked Week 11 Infrastructure & Email Decisions:**
- **Email verification & OTP SMTP:** **Brevo** (Custom SMTP configured in Supabase Auth for signup confirmation and 6-digit OTP password recovery).
- **Frontend deployment:** **Vercel** (using [`vercel.json`](../vercel.json)).
- **Backend deployment:** **Render** (primary backend host alongside Supabase PostgreSQL/Auth/Edge Functions), with **Railway** as the exception/fallback option if needed.

| Status | Behavior, quality, or handoff item | Evidence link | What is still uncertain? |
|---|---|---|---|
| **Working (Unit & Local Build)** | Frontend-to-service fixes (`ec6bd38`), `27/27` Vitest tests (`5` files), `11/11` Python integration checks, `tests/test_ai_quiz.py`, `0` diff between `src/` & `public/src/`, and 6-entry Vite build (`dist/`) | [Backend Test Results](week_10/backend-test-results.md); [`backend-services.test.js`](../tests/unit/backend-services.test.js) | Unit tests use mocks; live browser E2E against Supabase Cloud is not yet executed (`tests/e2e/` has no specs yet) |
| **Partial (Live DB Catalog & Anon RLS)** | Supabase Cloud (`bcwwnjtmrcxggbaallon.supabase.co`) serves `46` universities, `32` subjects, `128` curricula, `345` quiz questions (`HTTP 206`), and blocks anonymous reads (`HTTP 200 []`) on private tables | [Database Verification](week_10/database-verification.md); [Supabase Verification Report](week_10/SUPABASE_VERIFICATION_REPORT.md) | Migrations [`009`](../supabase/migrations/009_ai_quiz_tables.sql) (`404 PGRST205`) & [`010`](../supabase/migrations/010_complete_universities.sql) are not yet applied in SQL Editor; authenticated two-student RLS isolation is **Not tested** |
| **Partial (Auth & Password Recovery)** | Strict signup-to-login redirect, 6-digit OTP sanitization, `src/auth-guard.js` recovery exemption (`ec6bd38`), and password-reset root-cause audit complete | [Password Reset Investigation](week_10/password-reset-investigation.md); [Auth Testing](week_10/authentication-testing.md) | Live Gmail OTP/confirm-email is **Blocked** (`mailer_autoconfirm: true`, default SMTP limits, `Audit Logs` off, and `princekarki127@gmmail.com` typo); **Brevo** Custom SMTP + `Confirm email` setup is scheduled for Week 11, and live login/refresh/logout E2E is **Not tested** |
| **Partial (UI, Analytics & Theme)** | `#analytics` dashboard, `#subjects` cascading hierarchy, `#quiz-history-list`, and automated light/dark theme toggle checks (`6` checks in `npm test`, `3416d3b`, `ba4e592`) complete | [Theme Toggle Verification](week_10/THEME_TOGGLE_VERIFICATION.md); [Week 10 Weekly Report](week_10/weekly-report.md) | Full desktop/mobile 5-view navigation, keyboard focus/accessibility pass, and analytics metric label alignment need final verification |
| **Not tested (AI Quiz Live Edge)** | `009_ai_quiz_tables.sql`, [`generate-ai-quiz`](../supabase/functions/generate-ai-quiz/index.ts), and client fallback engine exist in code | [AI Quiz Integration Report](week_10/AI_QUIZ_DEVELOPER_INTEGRATION_REPORT.md); [Backend Test Results](week_10/backend-test-results.md) | Edge Function returns `404 NOT_FOUND` on live Supabase until deployed; live cloud AI quiz persistence is **Blocked** |
| **Not tested (Team Slices & Handoff)** | Week 10 Slice 5 (Nabin) and Slice 4 theme unit check recorded; area map and audit drafted | [AI Use & Code Ownership Audit](week_10/AI_USE_AND_CODE_OWNERSHIP_AUDIT.md); [Week 10 Weekly Report](week_10/weekly-report.md) | Member role acceptance, code explain-backs, AI-use disclosures, and independent peer checks for Slices 1–4 & 5 remain pending |
| **Planned in Repo (Extended Feature)** | **AI Chat / Study Assistant** (`#view-assistant`) architecture, `011` RLS schema, quota design, and Gemini integration plan are documented inside the repo | [AI Study Assistant Architecture](AI_STUDY_ASSISTANT_ARCHITECTURE.md); [AI Integration Plan](week_10/ai-integration-plan.md) | `011_ai_study_assistant.sql`, `ai-study-assistant` Edge Function, and `#view-assistant` UI are **Not implemented** yet |

---

## Lessons that change our route

| Lesson | Source or evidence | What we will do differently |
|---|---|---|
| **Course / team-process lesson:** Code authorship, green unit mocks, or a successful GitHub Pages build do not prove live integration, and blank teammate rows leave ownership and explain-backs unverified. | [AI Use & Code Ownership Audit](week_10/AI_USE_AND_CODE_OWNERSHIP_AUDIT.md); [Week 10 Weekly Report](week_10/weekly-report.md) | Require every Week 11+ milestone to have a named delivery owner, a backup/peer verifier, a live observed test result (not just mocks), and each member's own Weekly Report row and AI disclosure. |
| **Project lesson from building & testing:** Static mismatches (`camelCase` vs `snake_case`, `subjects` upsert RLS), undeployed SQL/Edge functions (`009`, `010`, `generate-ai-quiz`), and unconfigured SMTP (`@gmmail.com` typo, `mailer_autoconfirm`) silently break live flows even when local UI/fallback looks fine. | [Supabase Verification Report](week_10/SUPABASE_VERIFICATION_REPORT.md); [Password Reset Investigation](week_10/password-reset-investigation.md); [Backend Final Report](week_10/backend-final-report.md) | Lock live Supabase operations (`009`/`010`, Edge Functions, Custom SMTP, URL allowlists) and two-student E2E tests **before** adding any new feature scope, and enforce a clean Week 11 feature-freeze decision. |

---

## Extended features (Already Designed in Repo)

### AI Chat / Study Assistant (`#view-assistant` — Google Gemini)
The conversational **AI Chat Assistant** is already specified inside our repository as an extended feature built on top of our existing Supabase Auth, PostgreSQL RLS, and Deno Edge Function pattern ([`generate-ai-quiz`](../supabase/functions/generate-ai-quiz/index.ts)):

- **Already inside our repo:**
  - Full architecture & RLS schema (`011_ai_study_assistant.sql`: `ai_conversations`, `ai_messages`, `ai_usage_quotas`): [`docs/AI_STUDY_ASSISTANT_ARCHITECTURE.md`](AI_STUDY_ASSISTANT_ARCHITECTURE.md)
  - Phased integration & free-tier quota plan (`gemini-2.5-flash`, `50 students × 5 questions/day = 250 req/day`, optional Google Search grounding): [`docs/week_10/ai-integration-plan.md`](week_10/ai-integration-plan.md)
- **Inclusion gate (Week 11 decision):** Implement and ship `#view-assistant`, `supabase/functions/ai-study-assistant/index.ts`, and `src/services/ai-assistant.js` **only if** Week 11 P0 live Supabase/Auth/E2E checks pass cleanly without risking core stability. If core MVP hardening consumes Week 11–12 capacity, keep the AI Chat Assistant formally scoped as documented future work with zero unverified claims.
- **Security & budget guardrails:** Keep `GEMINI_API_KEY` solely in Supabase Secrets (`npx supabase secrets set`), enforce mandatory JWT auth + server-side daily quotas, never enable paid Gemini tiers without team/faculty approval, and verify two-student RLS isolation on chat history.

---

## Roadmap milestones

Detailed area boundaries, backup partners, and explain-back questions live in the [AI Use and Code Ownership Audit](week_10/AI_USE_AND_CODE_OWNERSHIP_AUDIT.md).

| Week / date | Milestone result and check | Delivery owner(s) | Affected area(s) / support path (if relevant) | Evidence link or planned evidence | Dependency, risk, or fallback |
|---|---|---|---|---|---|
| **10 / Nov 5** — Code ownership and responsible AI audit | Codebase area map, Slice 1–5 plan, Week 10 backend fixes (`ec6bd38`), `27/27` Vitest & `11/11` Python checks, and static ownership audit drafted; teammate explain-backs & live DB/E2E checks opened for closure | Nabin Khadka (integration/audit); Sumit Adhikari, Prabin Rai, Prince Karki, J.N. Taj Oli (Slices 1–4 acceptance pending) | All 6 mapped areas in [AI Use & Code Ownership Audit](week_10/AI_USE_AND_CODE_OWNERSHIP_AUDIT.md) | [Slice.md](week_10/Slice.md); [Weekly Report](week_10/weekly-report.md); [Backend Final Report](week_10/backend-final-report.md); [Ownership Audit](week_10/AI_USE_AND_CODE_OWNERSHIP_AUDIT.md) | **Gap:** 4 member rows & peer explain-backs still open; carry closure into Week 11 check-in |
| **11 / Nov 12** — MVP verification and feature-freeze decision | **1)** Apply `009` & `010`, deploy `generate-ai-quiz`, configure **Brevo** Custom SMTP / `Confirm email` / `princekarki127@gmmail.com` fix; **2)** Stand up **Vercel** (frontend) and **Render** (backend, **Railway** fallback) deployments and allowlist Vercel redirect URLs in Supabase; **3)** Pass live two-student E2E (Auth, Onboarding, Task CRUD, Quiz, RLS) + Playwright smoke spec; **4)** Decide quiz `correct_answer` grading stance & freeze MVP scope (Go/No-Go on **AI Chat Assistant** extended feature) | Nabin (Supabase/Brevo/deploy integration); Sumit (Slice 1 DB/RLS); Prince (Slice 3 Auth E2E); Prabin (Slice 2 `tests/e2e/`); Team 5 (freeze vote) | `vercel.json`, `supabase/migrations/`, `supabase/functions/`, `public/auth/`, `src/services/`, `public/src/`, `tests/e2e/` (handoffs per [Ownership Audit](week_10/AI_USE_AND_CODE_OWNERSHIP_AUDIT.md)) | Live Vercel + Render URLs; Brevo SMTP test receipt; updated [Backend Test Results](week_10/backend-test-results.md); redacted two-account screenshots; feature-freeze decision log | **Risk:** Brevo SMTP verification or Render cold starts delay Week 11 checks. **Fallback:** Use **Railway** for backend if Render blocks, and document local/disposable auth cleanly while deferring AI Chat Assistant |
| **12 / Nov 19** — Peer QA, bug triage, and refactor | Resolve P0/P1 defects from Week 11 live E2E; execute independent peer QA swaps (Sumit ↔ Nabin, Prabin ↔ Prince, J.N. Taj → Nabin); enforce zero-diff sync across `app.js`, `src/`, `public/src/`, and `Backend/`; build **AI Chat Assistant** (`011` + `ai-study-assistant` + `#view-assistant`) *only if* approved at Week 11 freeze | Prabin & Prince (cross-testing); J.N. Taj (UI/responsive/a11y); Nabin & Sumit (bug fixes / optional AI Chat) | Frontend (`public/`, `src/`), Backend (`Backend/`, `supabase/`), Tests (`tests/`) | Peer-signed [QA Evidence Matrix](week9/QA_EVIDENCE_MATRIX.md); closed GitHub Issues; `vitest`, `run_tests.py`, `tests/e2e/` pass logs | **Risk:** Scope creep from AI Chat Assistant delays bug triage. **Fallback:** Cut AI Chat implementation immediately if any core Auth/Task/RLS bug remains open |
| **13 / Nov 26** — Documentation, setup, and handoff proof | Another teammate (not the primary author) performs a clean-start setup & verification trial from [`README.md`](../README.md) / [`supabase/setup_all.sql`](../supabase/setup_all.sql) (`001`–`010` + `011` if shipped); finalize architecture, API, and user-facing docs | Sumit (DB setup handoff) + Prabin/Prince (fresh clone/deploy tester); Nabin (doc review) | `README.md`, `supabase/setup_all.sql`, `supabase/migrations/`, `docs/` | Clean-setup verification log by non-author teammate; updated [Project Status](PROJECT_STATUS.md) & [Docs Roadmap](DOCS_ROADMAP.md) | **Risk:** Missing `.env` / secret instructions fail fresh setup. **Fallback:** Patch setup docs immediately during the trial until reproducible |
| **14 / Dec 3** — Final demo lock and contribution audit | Lock the exact 6-step Final Demo script ([Final Demo Roadmap](week9/FINAL_DEMO_ROADMAP.md)) on the production URL; finalize every member's contribution row, commit/PR links, code explain-back summary, and AI-use disclosure | All 5 Team 5 members (individual rows); Nabin & Prabin (demo & QA audit check) | Full repo & [`docs/CONTRIBUTION_LEDGER.md`](CONTRIBUTION_LEDGER.md), [`docs/week_10/AI_USE_AND_CODE_OWNERSHIP_AUDIT.md`](week_10/AI_USE_AND_CODE_OWNERSHIP_AUDIT.md) | Locked demo script; complete 5-member contribution & AI-use audit; tagged release candidate | **Risk:** Unattributed commits or missing member evidence. **Fallback:** Audit `git log` / PR history in Week 14 meeting so every member signs their own row |
| **15 / Dec 10** — Hardening and final readiness | Zero new features; run full end-to-end dress rehearsal (Auth -> Subjects -> Tasks/Analytics -> 2-Account RLS -> Quiz -> optional AI Chat); verify mobile/desktop light & dark themes, empty/error states, and fallback demo mode | All 5 Team 5 members (rehearsal); J.N. Taj (UI polish/a11y check); Prince & Prabin (re-run E2E) | Deployed **Vercel** (frontend) + **Render**/**Railway** (backend) + live Supabase + **Brevo** SMTP | Rehearsal timing/pass log; final `npm test` + `run_tests.py` + `tests/e2e/` outputs; redacted backup slides/video | **Risk:** Live network, Render sleep, or Supabase outage during presentation. **Fallback:** Warm Render / switch to Railway exception host, or use verified Local Preview fallback + recorded walkthrough |
| **16 / Dec 17** — Final presentation and handoff | Deliver live Capstone Final Demo following verified script and honest scope disclosures; submit final repository, QA Evidence Matrix, and team handoff archive | All 5 Team 5 members | Final tagged release on `main` + `docs/` archive | Live presentation; final archived [QA Evidence Matrix](week9/QA_EVIDENCE_MATRIX.md), test logs, and handover summary | **Fallback:** Explicitly label Local Preview mode if live cloud connectivity fails during demo |

---

## Next one or two weeks

| Issue or action | Owner | Done when | Evidence path |
|---|---|---|---|
| Apply `009_ai_quiz_tables.sql` & `010_complete_universities.sql`, deploy `generate-ai-quiz`, and wire **Vercel** (frontend) + **Render** (backend; **Railway** fallback) deployments | Nabin Khadka + Sumit Adhikari | Live Vercel frontend & Render backend URLs respond cleanly; live REST returns `200`/`206` for `ai_quizzes*` & all `010` countries, and `generate-ai-quiz` returns valid JSON (no `404`) | [Database Verification](week_10/database-verification.md); [Backend Test Results](week_10/backend-test-results.md) |
| Fix `princekarki127@gmmail.com`, configure **Brevo** Custom SMTP + `{{ .Token }}` templates, enable `Confirm email`, and allowlist **Vercel** + `localhost` redirect URLs | Nabin Khadka + Prince Karki | Fresh disposable Gmail account receives Brevo-delivered signup verification + 6-digit OTP recovery email and completes reset on live Vercel URL | [Password Reset Investigation](week_10/password-reset-investigation.md); [`SUPABASE_EMAIL_TEMPLATES_SETUP.md`](SUPABASE_EMAIL_TEMPLATES_SETUP.md) |
| Execute live two-student E2E & RLS isolation checks (and add Playwright spec in `tests/e2e/`) | Sumit Adhikari (RLS), Prabin Rai (`tests/e2e/`), Prince Karki (Auth E2E) | Account A persists onboarding/tasks/quiz across reload; Account B gets zero access to Account A's data; automated E2E passes | [`tests/e2e/`](../tests/e2e/); [QA Evidence Matrix](week9/QA_EVIDENCE_MATRIX.md); `docs/week_10/Evidence/` |
| Complete 5-view desktop/mobile & accessibility check + Week 10 member rows & explain-backs | J.N. Taj Oli (UI/5-view) + All members (own rows) | All 5 Team 5 members have filled Week 10/11 rows, AI disclosures, peer verification links, and desktop/mobile screenshots | [Week 10 Weekly Report](week_10/weekly-report.md); [Ownership Audit](week_10/AI_USE_AND_CODE_OWNERSHIP_AUDIT.md) |
| Week 11 Feature-Freeze & Quiz Grading Decision (plus Go/No-Go on **AI Chat Assistant** extended feature) | Team 5 (all members) | Team decision logged on `quiz_questions.correct_answer` handling and whether `#view-assistant` enters Week 12 sprint | [Final Demo Roadmap](week9/FINAL_DEMO_ROADMAP.md); [AI Integration Plan](week_10/ai-integration-plan.md) |

---

## Top risks

| Risk | Why it matters | Owner | Response or fallback | Review week |
|---|---|---|---|---|
| **Live Supabase, Brevo SMTP & deployment config (`009`/`010`, `generate-ai-quiz`, Vercel/Render)** | Live deployment fails, emails hit Supabase rate caps, or Render free-tier cold starts delay responses even though unit tests pass | Nabin Khadka + Sumit Adhikari | Run `009`/`010` + Edge Function deploy in Week 11; wire **Brevo** SMTP & **Vercel** redirect URLs; use **Railway** as backend exception fallback if Render has issues | Week 11 |
| **No live two-student E2E / RLS proof yet** | Core privacy claim ("students cannot view/edit other students' data") cannot be demonstrated honestly without observed proof | Sumit Adhikari + Prabin Rai + Prince Karki | Run dedicated two-account test protocol + Playwright `tests/e2e/` suite and attach redacted logs/screenshots | Week 11–12 |
| **Client-side `quiz_questions.correct_answer` visibility** | Browser receives answer keys during quiz fetch; if presented as graded assessments, reviewers can flag security gap | Nabin Khadka + Sumit Adhikari | Decide in Week 11 freeze: move grading to Edge Function/RPC or explicitly label quizzes as self-study practice | Week 11 |
| **AI Chat Assistant scope creep or Gemini free-tier quota (`429`)** | Building `011` + `ai-study-assistant` could delay core bug fixes, or live demo could hit free-tier RPM/RPD limits | Nabin Khadka | Keep AI Chat gated behind Week 11 MVP freeze; enforce `ai_usage_quotas` cooldowns and keep core app independent of AI Chat | Week 11–12 |
| **Mirrored code drift (`src/`, `public/src/`, `Backend/`) & uneven teammate evidence** | Edits in one copy break GitHub Pages vs Vite build; blank member rows hurt individual grading | Nabin Khadka + all Team 5 stewards | Run `diff -r src/ public/src/` and `npm run build` on every PR; require weekly member sign-off in Weekly Report | Week 12–14 |

---

## Progress check

- [x] The route begins with current evidence, not assumptions. *(Grounded in Week 10 `ec6bd38`, `backend-test-results.md`, `database-verification.md`, and `AI_USE_AND_CODE_OWNERSHIP_AUDIT.md`.)*
- [x] The final demo claim matches the evidence the team plans to produce.
- [x] Each milestone has a check, owner, and evidence path.
- [x] Code milestones identify the affected area/support path and link the current area map; the map is shared, not an exclusive file assignment.
- [ ] Week 11 includes MVP verification and a feature-freeze decision. *(Scheduled for Week 11 / Nov 12 — execution in progress.)*
- [ ] Week 13 includes another person's handoff/setup trial.
- [ ] Week 14 locks the demo and contribution evidence.
- [ ] Week 15 is for readiness and hardening, not new scope.
- [ ] The shared Weekly Report records each student's own contribution and evidence. *(Pending individual member updates from Sumit, Prabin, Prince, and final Week 11 updates.)*

Update this roadmap when new tests, feedback, or constraints change the best route. Keep old decisions understandable by linking the relevant Issue or evidence.
