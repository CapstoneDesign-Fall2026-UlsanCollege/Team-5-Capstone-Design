# AI Tutor — Implementation Report

**Project:** Smart Study Companion — Team 5 (Ulsan College Capstone Design)  
**Baseline Commit SHA:** `17839811b19d029c5625811df95d358d0a28eed1` (`week12/p0-p1-verification-and-fixes`)  
**Feature Branch:** `feature/ai-tutor`  
**Status:** **IMPLEMENTED — LIVE INTEGRATION PENDING** *(Code, Edge Function, SQL Migration `013`, and local test suites completed; Supabase Cloud migration `013`, Edge Function deploy, and `GEMINI_API_KEY` secret configuration pending external Dashboard/CLI execution)*

---

## 1. Project Overview
Smart Study Companion is a static ES Module web application (`public/`, Vite build -> `dist/`) backed by Supabase Auth, Supabase PostgreSQL with Row Level Security (RLS), and Deno-based Supabase Edge Functions.

## 2. Objective
Add a personalized, secure, multilingual **AI Tutor** module directly beneath **Quiz Practice** in the existing application navigation without breaking or replacing existing Tasks, Subjects, Analytics, Study Streaks, Quiz Practice, or Authentication modules.

## 3. Existing Architecture Analysis
- **Active App Shell & Entry Point:** `vite.config.js` builds from `public/` (`public/index.html`, `public/app.js`, `public/styles.css`), with root `index.html` redirecting GitHub Pages traffic into `public/index.html`.
- **Module Synchronization Requirement:** `tests/unit/backend-services.test.js` enforces strict parity across `src/`, `public/src/`, and `Backend/` mirrors (`lib/`, `services/`, `supabase/migrations/`, `supabase/functions/`).
- **Reusable Building Blocks Reused:**
  - Auth session & guards (`src/services/auth.js`, `src/lib/supabase.js`)
  - Academic profile & enrolled subjects (`src/services/profile.js`, `src/services/subjects.js`, `src/lib/academic-catalog.js`)
  - Task CRUD (`src/services/tasks.js` `createTask()`)
  - AI Quiz Engine & history (`src/services/ai-quiz.js`, `startAiQuiz()`, `finishQuiz()`)
  - Theme system & design tokens (`public/styles.css` Light/Dark CSS variables)

## 4. New Features Implemented
1. **Sidebar & Routing (`#ai-tutor`):** Added **AI Tutor** directly below **Quiz Practice** (`<a href="#ai-tutor" data-view="ai-tutor">`), with hash routing (`#ai-tutor` and `#assistant` alias) and `#view-ai-tutor`.
2. **Interactive ChatGPT-Style Academic Workspace:** User/assistant separated message streams, Enter-to-send / Shift+Enter newline, character counter (`4000` limit), typing skeleton, Retry on failure without message loss, Copy Answer, Copy Code snippet, Regenerate Answer, New Conversation, Search, Rename, Delete, Light/Dark themes, and mobile drawer layout.
3. **Personalized Academic Context & Difficulty:** Reads saved `country`, `university`, `major`, and enrolled subjects from Supabase DB; lets students adjust Subject manually per chat without altering permanent profile; provides distinct Beginner, Intermediate, and Advanced prompt strategies; never invents unverified university syllabi.
4. **7 Smart Teaching Modes & Safe Rendering:** Explain Concept, Step-by-Step Learning, Simple Example, Exam Preparation, Practice With Me, Hint Mode, and Summarize Topic, paired with strict HTML-escaped Markdown/code rendering (`renderSafeTutorMarkdown()`).
5. **Quiz Integration (`Practice This Topic`):** Maps Tutor difficulty (`beginner/intermediate/advanced`) -> Quiz difficulty (`easy/medium/hard`), prefills `#quiz-ai-subject` + `#quiz-ai-topic` + `#quiz-ai-difficulty`, runs existing `startAiQuiz()` / `finishQuiz()` persistence, and adds **Ask AI Tutor** & **Return to AI Tutor** actions inside `#quiz-result`.
6. **Multilingual Support:** Selector for Auto (Match Question), English, Korean, Nepali, and Hindi, instructing the model to preserve code syntax and keywords verbatim.
7. **Confirmed Study Planning:** Surfaces structured suggested sessions with checkboxes and explicit **Add Selected to Study Tasks** confirmation (`tasks.js` + duplicate prevention). Never auto-creates, edits, or deletes tasks silently.
8. **AI Tutor Learning Summary:** Tracks completed sessions, subjects practiced, practice quizzes, topics reviewed, and recent activity in `ai_tutor_learning_sessions` (at most 1 `tutor_session` per conversation) without inflating or overwriting existing Study Analytics / `011` task streaks.

## 5. System Architecture
```text
Browser (#view-ai-tutor + src/ai-tutor-ui.js + src/services/ai-tutor.js)
   -> Supabase Auth JWT Session
   -> Supabase Edge Function (supabase/functions/ai-tutor-chat/index.ts)
        1. Validates CORS origin & Bearer JWT via Supabase Auth
        2. Validates request bounds via tutor-core.ts
        3. Enforces per-student daily quota & cooldown (ai_tutor_usage_quotas)
        4. Reconstructs trusted profile, subjects, tasks, & quiz scores from DB
        5. Loads bounded chronological history (last 12 messages)
        6. Calls Google Gemini API via server-only GEMINI_API_KEY secret
        7. Validates/sanitizes response & writes server-trusted assistant row
   -> PostgreSQL RLS Tables (013_ai_tutor.sql) -> Verified UI Render
```

## 6. Database Changes
- **Migration:** [`supabase/migrations/013_ai_tutor.sql`](../../supabase/migrations/013_ai_tutor.sql) (mirrored in `Backend/supabase/migrations/013_ai_tutor.sql`)
- **Rollback:** [`supabase/rollbacks/013_ai_tutor_down.sql`](../../supabase/rollbacks/013_ai_tutor_down.sql)
- **Tables Created:**
  - `public.ai_tutor_conversations` — owned by `student_id` (`profiles.id`), stores `title`, `subject_id`, `subject_slug`, `difficulty`, `teaching_mode`, `preferred_language`, timestamps.
  - `public.ai_tutor_messages` — child of `ai_tutor_conversations` (`ON DELETE CASCADE`), stores `role IN ('student', 'assistant')`, `content`, `metadata JSONB`, `created_at`.
  - `public.ai_tutor_learning_sessions` — records completed learning activities (`tutor_session`, `practice_quiz`, `study_plan_created`, `study_plan_task_added`).
  - `public.ai_tutor_usage_quotas` — composite PK `(student_id, usage_date)` enforcing daily usage caps & cooldowns server-side.
- **Live Deployment State:** Migration `013_ai_tutor.sql` has **NOT** yet been executed in live Supabase Cloud (verified via PGlite Postgres tests locally; pending Supabase Dashboard SQL Editor run).

## 7. Supabase Edge Function Implementation
- Files: [`supabase/functions/ai-tutor-chat/index.ts`](../../supabase/functions/ai-tutor-chat/index.ts) and [`supabase/functions/ai-tutor-chat/tutor-core.ts`](../../supabase/functions/ai-tutor-chat/tutor-core.ts) (mirrored in `Backend/supabase/functions/ai-tutor-chat/`).
- Live endpoint probe (`POST https://bcwwnjtmrcxggbaallon.supabase.co/functions/v1/ai-tutor-chat`) returned HTTP `404` because `supabase` CLI is not installed locally and deployment requires maintainer credentials.

## 8. Gemini Integration
- Uses Google Gemini `generateContent` API (`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, default `gemini-2.5-flash`) with `x-goog-api-key: Deno.env.get("GEMINI_API_KEY")`.
- Missing `GEMINI_API_KEY` fails clearly with HTTP `503` (`GEMINI_NOT_CONFIGURED`) — no simulated AI answers are ever returned in place of real AI output.

## 9. Frontend Changes
- [`public/index.html`](../../public/index.html) — added `ai-tutor.css` stylesheet, `AI Tutor` sidebar nav link below `Quiz Practice`, `#view-ai-tutor` view, and `#quiz-ask-tutor-btn` / `#quiz-return-tutor-btn` buttons.
- [`public/ai-tutor.css`](../../public/ai-tutor.css) — dedicated responsive light/dark styles using StudySmart CSS variables.
- [`public/app.js`](../../public/app.js) — integrated `#ai-tutor` routing, Quiz Practice handoff (`openPracticeFromAiTutor`), confirmed study plan task saving (`createConfirmedTaskFromTutor`), and logout reset.
- [`src/lib/ai-tutor-logic.js`](../../src/lib/ai-tutor-logic.js), [`src/services/ai-tutor.js`](../../src/services/ai-tutor.js), [`src/ai-tutor-ui.js`](../../src/ai-tutor-ui.js) — all cleanly synced to `public/src/` (and `lib/`/`services/` synced to `Backend/`).

## 10. Integration with Existing Functionality
- Preserved all existing IDs (`#view-dashboard`, `#view-tasks`, `#view-subjects`, `#view-analytics`, `#view-quiz`), existing analytics metrics, `011` streak engine, and Quiz scoring logic.

## 11. Security Implementation
- JWT validated in Edge Function via `adminClient.auth.getUser(token)`.
- Strict per-student PostgreSQL RLS on all 4 new tables.
- Anti-impersonation rule: client JWT `INSERT` on `ai_tutor_messages` is restricted by RLS to `role = 'student'` inside owned conversations; only the verified Edge Function writes `role = 'assistant'` rows, and `UPDATE`/`DELETE` on individual messages are revoked for `anon`/`authenticated`.
- `ai_tutor_usage_quotas` writes are revoked from `anon`/`authenticated`.
- Zero `dangerouslySetInnerHTML` on unescaped model text; `<script>` and HTML tags are escaped cleanly before formatting.

## 12. Technical Challenges & 13. Solutions Applied
- **Cross-Module Quiz Difficulty Mismatch:** Quiz Practice uses `easy/medium/hard` while AI Tutor uses `beginner/intermediate/advanced`. Solved via explicit `mapTutorDifficultyToQuizDifficulty()` mapper tested in Vitest.
- **Anti-Impersonation & Quota Tampering:** Solved by restricting client RLS policies on `ai_tutor_messages` (`role = 'student'`) and revoking client DML on `ai_tutor_usage_quotas`, delegating assistant writes and quota updates solely to the authenticated Edge Function.
- **Mirror Sync Discipline:** Existing `tests/unit/backend-services.test.js` validates `src/`, `public/src/`, and `Backend/` sync; mirrored all shared service/logic/migration/function artifacts cleanly.

## 14. Remaining Limitations
- `supabase` CLI and `GEMINI_API_KEY` secret are not present in this local session; therefore live cloud Edge Function calls (`ai-tutor-chat`) and live Supabase `013_ai_tutor.sql` deployment remain pending.
- `@playwright/test` is not installed in `package.json` / `node_modules/`, so live multi-browser Chromium execution and `AI-01`..`AI-13` live screenshots remain pending.

## 15. Deployment Requirements
See [`AI_TUTOR_SETUP_GUIDE.md`](AI_TUTOR_SETUP_GUIDE.md) for SQL Editor migration `013_ai_tutor.sql`, `GEMINI_API_KEY` secret setup, and `supabase functions deploy ai-tutor-chat`.

## 16. Summary of Modified & Created Files

| File | Role |
| :--- | :--- |
| `supabase/migrations/013_ai_tutor.sql` *(+ `Backend/`)* | PostgreSQL tables, indexes, triggers, and anti-impersonation RLS |
| `supabase/rollbacks/013_ai_tutor_down.sql` | Clean idempotent rollback script |
| `supabase/functions/ai-tutor-chat/index.ts` *(+ `Backend/`)* | Authenticated Gemini Edge Function handler |
| `supabase/functions/ai-tutor-chat/tutor-core.ts` *(+ `Backend/`)* | Pure request/CORS/prompt/response validation helpers |
| `src/lib/ai-tutor-logic.js` *(+ `public/src/lib/`, `Backend/lib/`)* | Validation, XSS-safe Markdown, difficulty/topic mappers, study plan dedupe |
| `src/services/ai-tutor.js` *(+ `public/src/services/`, `Backend/services/`)* | Supabase chat CRUD, quota reads, Edge invocation & error normalization |
| `src/ai-tutor-ui.js` *(+ `public/src/`)* | AI Tutor UI controller |
| `public/ai-tutor.css` | Responsive light/dark styling aligned with `styles.css` tokens |
| `public/index.html`, `public/app.js` | Navigation slot below Quiz Practice, view markup, Quiz & Task integrations |
| `tests/unit/ai-tutor.test.js`, `tests/db/ai-tutor.db.test.js`, `tests/e2e/ai-tutor.spec.js`, `tests/test_ai_tutor.py`, `tests/e2e/e2e_runner.py` | Unit, mocked service, PGlite RLS/SQL, Python contract, and Playwright specs |
| `docs/ai_tutor/AI_TUTOR_IMPLEMENTATION_REPORT.md`, `AI_TUTOR_TESTING_REPORT.md`, `AI_TUTOR_SETUP_GUIDE.md`, `Evidence/README.md` | Architecture, QA reporting, and setup documentation |
