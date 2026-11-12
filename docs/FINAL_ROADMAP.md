# Final Project Roadmap — Smart Study Companion (Weeks 11–16)

**Project:** Smart Study Companion  
**Team:** Team 5 — Capstone Design, Fall 2026 (Ulsan College)  
**Date:** 2026-11-12  
**Status:** Active Planning & Execution Roadmap  

> **Documentation Standard:** Only behaviors verified with recorded test output, commits, or redacted proof are marked complete. Pending operational steps and future milestones are explicitly tracked below until executed.

---

## Baseline Entering Week 11

Based on [`week_10/weekly-report.md`](week_10/weekly-report.md), [`week_10/backend-final-report.md`](week_10/backend-final-report.md), and [`PROJECT_STATUS.md`](PROJECT_STATUS.md):
- **Verified in code & automated tests:** Frontend/backend service integration (`ec6bd38`), `27/27` Vitest unit/contract tests, `11/11` Python integration checks ([`tests/run_tests.py`](../tests/run_tests.py)), `vite build`, `#analytics` dashboard, cascading `#subjects` onboarding, and theme toggle unit checks.
- **Live on Supabase Cloud (`bcwwnjtmrcxggbaallon.supabase.co`):** Migrations `001`–`008` (`46` universities, `32` subjects, `128` curricula, `345` quiz questions, RLS-protected student tables).
- **Remaining gaps entering Week 11:** Live Dashboard SQL migrations (`009`, `010`), `generate-ai-quiz` Edge Function deployment, Custom SMTP / email verification & password-reset recovery, authenticated two-student browser E2E checks, and team slice sign-offs.

---

## Stepwise Roadmap (Weeks 11–16)

### Step 1 — Unblock Live Supabase Cloud & Auth Operations *(Immediate / Early Week 11)*
**Goal:** Align the live Supabase Cloud project with the codebase on `main`.

1. **Apply pending database migrations** in Supabase SQL Editor:
   - [`supabase/migrations/009_ai_quiz_tables.sql`](../supabase/migrations/009_ai_quiz_tables.sql) (`ai_quizzes`, `ai_quiz_questions`, `ai_quiz_attempts` + RLS)
   - [`supabase/migrations/010_complete_universities.sql`](../supabase/migrations/010_complete_universities.sql) (`Bhutan`, `Maldives`, `Other / International`)
2. **Deploy AI Quiz Edge Function:**
   - Deploy [`supabase/functions/generate-ai-quiz/index.ts`](../supabase/functions/generate-ai-quiz/index.ts) so live quiz generation replaces the `404 NOT_FOUND` local fallback.
3. **Fix live Auth & Email delivery:**
   - Correct the `princekarki127@gmmail.com` test account typo.
   - Configure Custom SMTP and email templates (`{{ .Token }}` + `{{ .ConfirmationURL }}`) per [`docs/SUPABASE_EMAIL_TEMPLATES_SETUP.md`](SUPABASE_EMAIL_TEMPLATES_SETUP.md).
   - Enable `Confirm email` and verify GitHub Pages + `localhost` redirect URL allowlists.

**Exit Criteria:**
- Live Supabase REST checks return `200`/`206` for `009`/`010` tables.
- `generate-ai-quiz` responds cleanly to authenticated requests.
- Real Gmail signup verification and 6-digit OTP password reset emails deliver end-to-end.

---

### Step 2 — Live E2E Verification & Week 10 Slice Sign-Offs *(Week 11)*
**Goal:** Close every pending member verification item from [`week_10/Slice.md`](week_10/Slice.md) with reproducible evidence.

1. **Slice 1 — Database & RLS (Sumit Adhikari):** Verify live Supabase task save/read operations and prove two-student RLS isolation (Account B cannot read or modify Account A's records).
2. **Slice 2 — Automated Functional & E2E Testing (Prabin Rai):** Implement repeatable browser E2E specs in [`tests/e2e/`](../tests/e2e/) covering task creation, invalid-input rejection, and reload persistence.
3. **Slice 3 — Authentication & Session E2E (Prince Karki):** Execute and record Signup → Verification → Login → Page Refresh Session Restore → Password Reset OTP → Logout on the live build.
4. **Slice 4 — UI/UX & Responsiveness (J.N. Taj Oli):** Complete remaining desktop/mobile navigation checks across `#dashboard`, `#tasks`, `#subjects`, `#analytics`, and `#quiz`.
5. **Evidence Capture:** Store redacted screenshots and execution logs under [`week_10/Evidence/`](week_10/Evidence/README.md) (or Week 11 evidence folder) and update team tracking docs.

**Exit Criteria:**
- All 5 slices have observed results, peer checks, and linked proof (commit/issue/screenshot).

---

### Step 3 — Security, Code-Sync & Build Hardening *(Week 12)*
**Goal:** Resolve architectural gaps and technical debt before adding new features.

1. **Quiz Answer-Key Exposure Decision:**
   - Decide as a team (per [`week9/FINAL_DEMO_ROADMAP.md`](week9/FINAL_DEMO_ROADMAP.md)) whether to move `quiz_questions.correct_answer` grading server-side (via Edge Function or PostgreSQL RPC) or formally document client-side grading as an accepted prototype limitation.
2. **Mirrored Source Synchronization:**
   - Ensure `src/`, `public/src/`, and `Backend/` stay synchronized and verify `npm test`, `python3 tests/run_tests.py`, and `vite build` pass cleanly on `main`.
3. **Clean-Project Migration Check:**
   - Confirm [`supabase/setup_all.sql`](../supabase/setup_all.sql) and ordered migrations `001`–`010` execute cleanly on a fresh schema without manual fixes.

**Exit Criteria:**
- Zero open critical auth/persistence bugs, verified GitHub Pages / Vercel build, and documented answer-key handling.

---

### Step 4 — Google Gemini AI Study Assistant *(Weeks 13–14, Feature Milestone)*
**Goal:** Implement the ChatGPT-style tutor planned in [`week_10/ai-integration-plan.md`](week_10/ai-integration-plan.md) and [`AI_STUDY_ASSISTANT_ARCHITECTURE.md`](AI_STUDY_ASSISTANT_ARCHITECTURE.md) *(starts only after Steps 1–3 pass)*.

1. **Schema & Secrets (Phase 1):**
   - Author `011_ai_study_assistant.sql` (`ai_conversations`, `ai_messages`, `ai_usage_quotas` with strict per-user RLS).
   - Store free-tier `GEMINI_API_KEY` (`gemini-2.5-flash`) exclusively in Supabase Secrets.
2. **Edge Function (Phase 2):**
   - Implement `supabase/functions/ai-study-assistant/index.ts` with JWT validation, per-student daily quota & cooldown limits, bounded academic context (`university`, `faculty`, `major`, subject, weak topics), and optional Google Search grounding.
3. **Frontend & Service (Phase 3):**
   - Add `src/services/ai-assistant.js` and `#view-assistant` UI with conversation history, citations, and *"Ask AI Tutor about this topic"* links from quiz reviews.
4. **Verification (Phase 4):**
   - Unit-test quota/`429` handling and verify two-student RLS isolation on chat history.

**Exit Criteria:**
- Authenticated students can chat per subject, persist conversation history across reload, hit safe daily rate limits, and remain isolated from other users' chats.

---

### Step 5 — Final Demo Dress Rehearsal & Code Freeze *(Week 15)*
**Goal:** Rehearse the full 6-step journey from [`week9/FINAL_DEMO_ROADMAP.md`](week9/FINAL_DEMO_ROADMAP.md) on the live deployment and freeze `main`.

1. **Account Entry:** Disposable signup/sign-in on Live Supabase (keep explicit local-preview fallback rules ready).
2. **Study Setup:** Cascading `Country → University → Faculty → Major → Subject` onboarding (`#subjects`).
3. **Task & Analytics:** Create/complete task → reload page → verify persistence and `#analytics` chart updates.
4. **Two-Account Privacy Check:** Sign in as Account B and verify Account A's private data is blocked.
5. **Quiz & AI Flow:** Run curated quiz + AI quiz generator (and AI Study Assistant if Step 4 shipped); verify attempt history.
6. **Documentation & Code Freeze:** Update [`PROJECT_STATUS.md`](PROJECT_STATUS.md), [`DOCS_ROADMAP.md`](DOCS_ROADMAP.md), and [`CONTRIBUTION_LEDGER.md`](CONTRIBUTION_LEDGER.md) with final commit links and test counts.

**Exit Criteria:**
- End-to-end rehearsal passes with zero unverified claims and a frozen release commit/tag.

---

### Step 6 — Final Capstone Presentation & Evidence Handover *(Week 16)*
- Deliver the live end-to-end product demonstration (with documented fallback criteria if live network/Supabase is unavailable).
- Hand over the complete QA package: [`week9/QA_EVIDENCE_MATRIX.md`](week9/QA_EVIDENCE_MATRIX.md), automated test outputs (`vitest`, `tests/run_tests.py`, `tests/e2e/`), and redacted screenshots.

---

## Summary Timeline

| Phase | Target Window | Primary Focus | Key Gate / Deliverable |
|---|---|---|---|
| **Step 1** | Early Week 11 | Supabase SQL (`009`, `010`), `generate-ai-quiz`, SMTP & Auth ops | Live DB + Edge Function + Gmail OTP working |
| **Step 2** | Week 11 | Live E2E testing & Week 10 Slice 1–4 sign-offs | `tests/e2e/` specs + redacted team evidence |
| **Step 3** | Week 12 | Answer-key decision, `src/`/`public/`/`Backend/` sync, clean migration check | Hardened build & documented security stance |
| **Step 4** | Weeks 13–14 | Gemini AI Study Assistant (`011` + Edge Function + `#view-assistant`) | Subject-aware AI tutor with RLS & quotas |
| **Step 5** | Week 15 | 6-step Final Demo rehearsal & code freeze | Verified live rehearsal + frozen `main` |
| **Step 6** | Week 16 | Final Capstone Presentation & handover | Live demo + final QA/evidence archive |

