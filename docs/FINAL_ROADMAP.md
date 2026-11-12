# Final App Upgrade & Execution Roadmap

**Project:** Smart Study Companion — Team 5  
**Prepared:** 2026-11-12  
**Proposed sprint:** Weeks 11–16 (confirm exact dates and owners with the team)

## Goal

Unblock live Supabase migrations (`009`, `010`), Edge Functions, and email/OTP authentication; verify end-to-end persistence and two-student RLS isolation in live browsers; finalize the quiz scoring policy; and activate the **AI Chat / Study Assistant** extended feature already specified in this repository ahead of the Final Demo. This plan reflects the verified codebase state after Week 10 (`ec6bd38`), where unit/contract suites pass locally (`27/27` Vitest, `11/11` Python) while live cloud deployment and browser E2E checks still require execution.

---

## What is already in the app

| Feature | Current state found in code | Verification status |
|---|---|---|
| Signup/login, email verification, password reset | Auth pages (`login`, `signup`, `verify`, `forgot-password`, `reset-password`), strict signup-to-login redirect, 6-digit OTP sanitization, `src/auth-guard.js` recovery exemption (`ec6bd38`), and local-preview fallback exist | `27/27` Vitest & `11/11` Python checks pass; live Gmail OTP/confirm-email is **BLOCKED** pending Custom SMTP, `Confirm email`, template `{{ .Token }}`, and fixing `princekarki127@gmmail.com` |
| Tasks & Analytics (`#tasks`, `#analytics`) | Create, edit, complete, uncomplete, delete, search, filters, validation guards, `#analytics` completion ring, 7-day chart, and subject progress UI exist | Service contracts pass in Vitest; live browser CRUD after reload and two-student RLS isolation are **NOT TESTED** |
| Subjects & Academic Hierarchy (`#subjects`) | Cascading `Country → University → Faculty → Major` onboarding, scrollable subject picker, `46` live universities, `32` subjects, `128` `major_subjects` mappings, and Migration `010_complete_universities.sql` exist | Live catalog (`46`/`32`/`128`) verified via REST; `010` pending SQL Editor execution; live onboarding save/restore is **NOT TESTED** |
| Quizzes & AI Quiz Generator (`#quiz`) | Standard, Rapid, and AI Quiz tabs, `345` seeded `quiz_questions`, UUID-filtered `quiz_attempts`/`quiz_responses` persistence, `#quiz-history-list`, `009_ai_quiz_tables.sql`, and `supabase/functions/generate-ai-quiz/index.ts` exist | `tests/test_ai_quiz.py` and Vitest mocks pass; live `009` tables (`404 PGRST205`) and `generate-ai-quiz` (`404 NOT_FOUND`) are **BLOCKED** until deployed |
| Profile | Display name, country, university, faculty, major, and password update forms exist (`profile.js`, `app.js`) | Service logic verified in mocks; live Supabase save and reload persistence are **NOT TESTED** |
| Dashboard / Theme | 5-view navigation (`#dashboard`, `#tasks`, `#subjects`, `#analytics`, `#quiz`), light/dark sidebar toggle, responsive CSS, and 6-page Vite production build (`npm run build`) exist | Automated theme checks (6 checks) and Vite build pass; full desktop/mobile 5-view and accessibility pass needs final confirmation |
| AI Chat / Study Assistant (Extended Feature in repo) | Full architecture & RLS schema blueprint ([`docs/AI_STUDY_ASSISTANT_ARCHITECTURE.md`](AI_STUDY_ASSISTANT_ARCHITECTURE.md)), integration plan ([`docs/week_10/ai-integration-plan.md`](week_10/ai-integration-plan.md)), and reusable Deno + Gemini Edge Function pattern ([`supabase/functions/generate-ai-quiz/index.ts`](../supabase/functions/generate-ai-quiz/index.ts)) are already in the repository | **Design-ready in repo (`NOT IMPLEMENTED` / `NOT TESTED`)** — `011_ai_study_assistant.sql`, `ai-study-assistant` Edge Function, and `#view-assistant` UI remain to be built and deployed |

---

## Problems to fix first

### P0 — Live Supabase migrations (`009`, `010`) and `generate-ai-quiz` Edge Function are not deployed
Migrations `001`–`008` are live, but live PostgREST probes return `404 PGRST205` for `ai_quizzes*` (`009_ai_quiz_tables.sql`), `generate-ai-quiz` returns `404 NOT_FOUND`, and Migration `010_complete_universities.sql` (`Bhutan`, `Maldives`, `Other / International`) has not been applied in the Supabase SQL Editor.

**Acceptance criteria:** Apply `009` and `010` in Supabase SQL Editor, deploy `generate-ai-quiz`, and confirm `200`/`206` responses on live REST and authenticated Edge Function requests without relying on local fallback.

### P0 — Live email confirmation and 6-digit OTP password recovery are blocked
Live Supabase Auth currently reports `"mailer_autoconfirm": true`, default shared SMTP limits, disabled `Audit Logs`, and a typoed test account (`princekarki127@gmmail.com`), preventing reliable Gmail verification and recovery OTP delivery.

**Acceptance criteria:** Fix the typoed test account, configure Custom SMTP and email templates (`{{ .Token }}` + `{{ .ConfirmationURL }}` per [`docs/SUPABASE_EMAIL_TEMPLATES_SETUP.md`](SUPABASE_EMAIL_TEMPLATES_SETUP.md)), enable `Confirm email`, allowlist GitHub Pages and `localhost` redirect URLs, and record a live Gmail signup + password-reset OTP pass.

### P0 — Live browser E2E persistence and two-student RLS isolation remain unverified
Although `27/27` Vitest unit/mock tests and `11/11` Python checks pass after `ec6bd38`, [`tests/e2e/`](../tests/e2e/) has no browser specs yet and interactive two-student persistence/isolation has not been executed against live Supabase.

**Acceptance criteria:** Execute authenticated browser tests (and add repeatable Playwright specs in [`tests/e2e/`](../tests/e2e/)) verifying task create/edit/complete/uncomplete/delete, onboarding save/restore, and quiz attempt/response persistence across reload, plus confirm Student B cannot read or modify Student A's data.

### P1 — Quiz answer-key visibility needs a final team decision
Curated quiz questions currently fetch `quiz_questions.correct_answer` to the browser for instant offline-capable grading rather than computing scores server-side.

**Acceptance criteria:** Record a team decision to either move grading server-side (via Edge Function or PostgreSQL RPC) or formally label and document client-side quiz scores as self-study practice results in the final demo.

### P1 — Local preview separation and unlisted-institution path must remain explicit
When Supabase credentials are absent, local preview mode runs in browser storage; additionally, students outside the seeded `46` universities rely on `010_complete_universities.sql` (`Other / International`) and need clear fallback/pending-review handling if custom institution entry is enabled.

**Acceptance criteria:** Never use demo/local-preview auth in production or store real passwords in `localStorage`; clearly label local preview mode when active, and verify `Other / International` / missing-institution selection persists cleanly to `profiles`.

### P1 — Mirrored source trees and clean setup documentation must stay in sync
The repository maintains mirrored client files (`app.js`/`public/app.js`, `src/`/`public/src/`) alongside `Backend/`, and setup documentation must stay aligned with the full `001`–`010` (and upcoming `011`) migration order.

**Acceptance criteria:** Keep `app.js` / `public/app.js` and `src/` / `public/src/` at zero diff, confirm `npm test`, `python3 tests/run_tests.py`, and `npm run build` pass on `main`, and verify [`supabase/setup_all.sql`](../supabase/setup_all.sql) and ordered migrations run cleanly on a fresh Supabase project.

---

## Extended Features (Already in Repo — Ready to Activate)

### Chat Assistant — Google Gemini AI Study Assistant (`#view-assistant`)
The conversational AI Chat Assistant is already designed and documented inside the repository as a separate, subject-aware tutor built on the same Supabase Edge Function + RLS pattern as `generate-ai-quiz`:

- **Existing repository assets:**
  - Architecture & RLS specification: [`docs/AI_STUDY_ASSISTANT_ARCHITECTURE.md`](AI_STUDY_ASSISTANT_ARCHITECTURE.md)
  - Integration roadmap & capacity plan (`50 students × 5 questions/day = 250 requests/day`, free-tier `gemini-2.5-flash`, optional Google Search grounding): [`docs/week_10/ai-integration-plan.md`](week_10/ai-integration-plan.md)
  - Existing Deno + Gemini Edge Function pattern: [`supabase/functions/generate-ai-quiz/index.ts`](../supabase/functions/generate-ai-quiz/index.ts)
- **Implementation & activation scope (after P0 fixes pass):**
  1. **Schema & Secrets (`011_ai_study_assistant.sql`):** Add `public.ai_conversations`, `public.ai_messages`, and `public.ai_usage_quotas` with strict per-user RLS (`auth.uid() = user_id`), and store free-tier `GEMINI_API_KEY` via `npx supabase secrets set` (never in client code).
  2. **Edge Function (`supabase/functions/ai-study-assistant/index.ts`):** Verify caller JWT (`401` on unauthenticated calls), enforce daily student quotas & cooldowns, assemble bounded academic context (`university`, `faculty`, `major`, subject, upcoming tasks, weak quiz areas), and support optional Google Search citations.
  3. **Frontend & Service (`#view-assistant`, `src/services/ai-assistant.js`):** Add the `AI Tutor` sidebar view, conversation history list, citation chips, *"Ask AI Tutor about this topic"* shortcut from quiz reviews, and graceful degradation if the function is offline.

**Acceptance criteria:** Signed-in student selects an enrolled subject, sends messages in `#view-assistant`, reloads and retains private chat history, hits daily quota/cooldown limits safely without exposing `GEMINI_API_KEY`, and Student B cannot read Student A's conversations.

---

## Proposed schedule

| Order | Work | Evidence to attach |
|---|---|---|
| 1 | Apply Migrations `009` and `010` in Supabase SQL Editor and deploy `generate-ai-quiz` Edge Function | Live REST `200`/`206` responses for `ai_quizzes*` & `universities`, plus authenticated `generate-ai-quiz` output |
| 2 | Fix `princekarki127@gmmail.com`, configure Custom SMTP + `{{ .Token }}` templates, enable `Confirm email`, and verify redirect allowlists | Redacted Gmail signup confirmation & 6-digit OTP password reset screenshots/logs |
| 3 | Add Playwright specs in [`tests/e2e/`](../tests/e2e/) and execute live two-student E2E persistence & RLS isolation checks | Dated pass/fail table, Playwright output, and redacted two-account screenshots (`Account A` vs `Account B`) |
| 4 | Finalize quiz answer-key decision (`correct_answer` server-side vs practice disclosure), verify source parity (`src/` vs `public/src/`), and test clean `001`–`010` / `setup_all.sql` setup | Decision note, zero-diff check, `vitest` (`27/27+`) & `run_tests.py` (`11/11`) outputs, clean setup log |
| 5 | Implement & deploy **Extended Feature: Chat Assistant** (`011_ai_study_assistant.sql`, `ai-study-assistant` Edge Function, `#view-assistant`, `src/services/ai-assistant.js`) | Unit tests for quota/`429` handling, live subject chat persistence after reload, and two-student RLS check |
| 6 | Complete remaining desktop/mobile 5-view + `#view-assistant` UI, keyboard, and accessibility pass | Desktop & mobile screenshots (light/dark mode) and keyboard navigation checklist |
| 7 | Run full 6-step Final Demo dress rehearsal ([`week9/FINAL_DEMO_ROADMAP.md`](week9/FINAL_DEMO_ROADMAP.md)), freeze `main`, and finalize docs | Rehearsal sign-off, updated [`PROJECT_STATUS.md`](PROJECT_STATUS.md), and release commit/tag |

---

## Test and evidence record

For each case, record date, branch/build, environment (local or live Supabase), tester, expected result, actual result, pass/fail, and redacted screenshot or log link.

- [ ] Signup, email confirmation, resend, login, logout, and 6-digit OTP password reset (live Gmail + Supabase)
- [ ] Profile & academic onboarding update (`Country → University → Faculty → Major → Subjects`), reload, and persistence
- [ ] Task create/edit/complete/uncomplete/delete and reload persistence
- [ ] Search, filters, deadlines, and `#analytics` progress calculations
- [ ] Standard, Rapid, and AI Quiz attempt, response, and history persistence (`generate-ai-quiz` + `009`)
- [ ] Two-account RLS data isolation for profile, tasks, quiz history, and AI chat conversations
- [ ] Unlisted / `Other / International` university path (`010_complete_universities.sql`)
- [ ] Extended Feature: AI Chat Assistant (`#view-assistant`) subject context, history reload, citation chips, and daily quota/cooldown handling
- [ ] Mobile layout, desktop 5+ view navigation, keyboard navigation, focus, contrast, and accessible labels

---

## Scope limits

- Do not enable paid Gemini API tiers or billing without explicit team and faculty approval; keep `GEMINI_API_KEY` strictly in Supabase Secrets.
- Do not claim complete worldwide university coverage; expand via verified migrations (`010`) and `Other / International` fallback.
- Do not use real student accounts, passwords, access tokens, or private data in repository screenshots or logs.
- Do not count local preview or mocked Vitest runs as proof of live Supabase persistence or RLS enforcement.
- Assign team owners and exact sprint dates before work begins; owners remain to be confirmed with Team 5.

---

## Related project records

- [Week 10 backend final report](week_10/backend-final-report.md)
- [Week 10 backend test results matrix](week_10/backend-test-results.md)
- [Week 10 weekly report](week_10/weekly-report.md)
- [Week 10 slice & stewardship plan](week_10/Slice.md)
- [AI Study Assistant architecture blueprint](AI_STUDY_ASSISTANT_ARCHITECTURE.md)
- [AI Study Assistant integration plan](week_10/ai-integration-plan.md)
- [Final Demo Roadmap](week9/FINAL_DEMO_ROADMAP.md)
- [Week 9 next week upgrade plan (baseline format)](week9/NEXT_WEEK_UPGRADE_PLAN.md)
- [AI Quiz tables migration (`009`)](../supabase/migrations/009_ai_quiz_tables.sql)
- [Complete universities migration (`010`)](../supabase/migrations/010_complete_universities.sql)
- [Supabase setup & project README](../README.md)
