# AI Study Assistant Architecture & Integration Blueprint (Google Gemini)

> **Status:** Design Specification Only — **Do not enable paid Gemini API tiers, billing accounts, or unapproved API charges.**
> **Goal:** Add a separate ChatGPT-style conversational AI Study Assistant powered by Google Gemini without exposing secret keys, breaking static GitHub Pages / Vite hosting, or disrupting existing task, subject, and quiz modules.

---

## 1. Existing Backend Structure Inspected

Smart Study Companion currently deploys as a static ESM web application (`public/`, GitHub Pages, or Vite build) backed directly by Supabase Cloud (`https://bcwwnjtmrcxggbaallon.supabase.co`):

- **Existing Edge Function Pattern:** [`supabase/functions/generate-ai-quiz/index.ts`](../supabase/functions/generate-ai-quiz/index.ts) runs on Deno inside Supabase Edge Functions, reads the authenticated JWT from the `Authorization` header, creates a scoped Supabase client, and accepts CORS requests without placing secrets in browser code. *(Note: `generate-ai-quiz` returns `404 NOT_FOUND` on live Supabase Cloud until deployed via Supabase CLI.)*
- **Existing AI Persistence Pattern:** [`supabase/migrations/009_ai_quiz_tables.sql`](../supabase/migrations/009_ai_quiz_tables.sql) defines user-scoped tables (`ai_quizzes`, `ai_quiz_questions`, `ai_quiz_attempts`) protected by Row Level Security (RLS). *(Note: Migration `009` has not yet been executed in live Supabase Cloud — `/rest/v1/ai_quizzes` currently returns `404 PGRST205`.)*
- **Frontend Service Layer:** [`src/services/ai-quiz.js`](../src/services/ai-quiz.js) calls `supabase.functions.invoke(...)` using the student's active Supabase Auth session token and handles graceful fallbacks when Edge Functions or tables are unavailable.

---

## 2. Secure Server-Side Function Location & Secret Management

Because Smart Study Companion has no custom Node/Express backend and runs client-side in browsers, **all calls to Google Gemini MUST execute inside a dedicated Supabase Edge Function**:

- **Function Path:** `supabase/functions/ai-study-assistant/index.ts`
- **Invocation Pattern:** `supabase.functions.invoke('ai-study-assistant', { body: { conversationId, message, subjectSlug, enableSearch } })`
- **Secret Storage:** Store `GEMINI_API_KEY` solely as a Supabase Edge Function Secret:
  ```bash
  npx supabase secrets set GEMINI_API_KEY="<your-gemini-studio-key>"
  ```
- **Zero Exposure Rules:**
  1. Never store `GEMINI_API_KEY` in `.env` with `VITE_` or `NEXT_PUBLIC_` prefixes.
  2. Never commit `GEMINI_API_KEY` into `src/`, `public/`, HTML, JSON, or Git history.
  3. Inside the Edge Function, verify `supabase.auth.getUser()` before making any Gemini request; reject unauthenticated callers with HTTP `401`.
  4. Restrict CORS `Access-Control-Allow-Origin` to approved origins (production GitHub Pages / Vercel URL + local dev ports) or explicitly validate requests alongside mandatory JWT verification.

---

## 3. Proposed Database Schema & RLS Policies (Migration `011_ai_study_assistant.sql`)

To store private multi-turn conversations per student in PostgreSQL:

### Tables

1. **`public.ai_conversations`**
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE`
   - `subject_id UUID NULL REFERENCES public.subjects(id) ON DELETE SET NULL`
   - `title TEXT NOT NULL DEFAULT 'New Study Chat' CHECK (char_length(title) BETWEEN 1 AND 200)`
   - `enable_web_search BOOLEAN NOT NULL DEFAULT false`
   - `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
   - `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`

2. **`public.ai_messages`**
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE`
   - `user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE`
   - `role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system'))`
   - `content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 20000)`
   - `citations JSONB NOT NULL DEFAULT '[]'::jsonb` *(stores grounded web sources when optional search is enabled)*
   - `model_name TEXT NULL`
   - `token_count INT NULL CHECK (token_count IS NULL OR token_count >= 0)`
   - `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`

3. **`public.ai_usage_quotas`** *(server-side rate & quota tracking)*
   - `user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE`
   - `usage_date DATE NOT NULL DEFAULT CURRENT_DATE`
   - `request_count INT NOT NULL DEFAULT 0`
   - `estimated_tokens INT NOT NULL DEFAULT 0`
   - `last_request_at TIMESTAMPTZ NULL`
   - `PRIMARY KEY (user_id, usage_date)`

### Indexes & Triggers
- Index `ai_conversations(user_id, updated_at DESC)` and `ai_messages(conversation_id, created_at ASC)`.
- Trigger updating `ai_conversations.updated_at = now()` whenever a new `ai_messages` row is inserted.

### Row Level Security (RLS)
Enable RLS on all three tables:
- **`ai_conversations`:** Students can `SELECT`, `INSERT`, `UPDATE`, and `DELETE` only rows where `auth.uid() = user_id`.
- **`ai_messages`:** Students can `SELECT` and `INSERT` only messages belonging to conversations where `ai_conversations.user_id = auth.uid()` and `ai_messages.user_id = auth.uid()`.
- **`ai_usage_quotas`:** Students can `SELECT` only their own usage row (`auth.uid() = user_id`); mutations happen server-side via Edge Function / `SECURITY DEFINER` RPC or service-role client inside the Edge Function so students cannot reset their own quota.

---

## 4. Subject-Aware Chat Context Pipeline

Every chat request builds an academic system prompt **server-side** inside `ai-study-assistant` using verified database rows owned by `auth.uid()`:

1. **Academic Profile Context:** Fetch student's `country`, `university`, `faculty`, and `major` from `public.profiles`.
2. **Enrolled Subjects & Focus Subject:**
   - Fetch enrolled subjects from `public.student_subjects`.
   - If the request specifies `subjectSlug` or `conversation.subject_id`, anchor the assistant's system instruction on that subject (e.g., *"Assisting Ulsan College Computer Science student focusing on Data Structures & Algorithms"*).
3. **Optional Study Context Injection (Bounded):**
   - Upcoming overdue/pending tasks from `public.tasks` (titles + deadlines only, capped at e.g. 5 items).
   - Recent quiz performance summary from `public.quiz_attempts` / `public.ai_quiz_attempts` (subject score ratios, capped at 3–5 entries) so the tutor can target weak areas.
4. **Windowed Message History:**
   - Load the last `N = 12–16` messages from `public.ai_messages` for `conversation_id` to preserve continuity while bounding input token growth.

---

## 5. Gemini API Request Design

- **Model Selection:** Default to cost-efficient free/low-tier-friendly model (`gemini-2.5-flash` or current stable Flash model) rather than high-cost flagship models.
- **Endpoint:** Gemini REST `generateContent` (or `streamGenerateContent?alt=sse` if streaming responses to a ChatGPT-style UI pane):
  ```
  POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
  Header: x-goog-api-key: <GEMINI_API_KEY from Deno.env>
  ```
- **Structured Payload:**
  - `systemInstruction`: student's faculty/major/subject persona, academic honesty rules (explain step-by-step, cite assumptions, do not invent facts).
  - `contents`: mapped `user` / `model` turns from `ai_messages` + latest sanitized prompt (length-checked, e.g., max 4,000 chars).
  - `generationConfig`: `temperature: 0.4`, `maxOutputTokens: 1024` (prevents runaway token usage).

---

## 6. Optional Online Search Integration

- **User Opt-In Toggle:** Expose a per-chat switch (`"Include Web Search"`) stored on `ai_conversations.enable_web_search` (off by default).
- **Gemini Grounding Tool:** When enabled *and* permitted by project quota policy, attach `{ "google_search": {} }` in the Gemini `tools` array on `generateContent`:
  ```json
  "tools": [{ "google_search": {} }]
  ```
- **Citation Handling & UI Safety:**
  - Extract `candidates[0].groundingMetadata.groundingChunks` (`uri`, `title`) inside the Edge Function and store sanitized URLs (`https://` / `http://` only) in `ai_messages.citations`.
  - Render clickable source chips beneath assistant replies with `rel="noopener noreferrer" target="_blank"`.
  - Allow toggling search off automatically when upstream search quota is exhausted, falling back to offline academic reasoning with an explicit badge (`"Web search temporarily unavailable — answered from course context"`).

---

## 7. Rate-Limit, Quota & Cost-Safety Controls

Because Smart Study Companion is a capstone student project and paid charges must not be triggered automatically:

1. **Per-Student Daily Quotas:**
   - Default soft limits (configurable via Edge Function env vars): e.g., `MAX_MESSAGES_PER_DAY = 30`, `MIN_SECONDS_BETWEEN_REQUESTS = 5`, `MAX_INPUT_CHARS = 4000`, `MAX_OUTPUT_TOKENS = 1024`.
   - Enforce in `ai_usage_quotas` before calling Gemini; return HTTP `429 Too Many Requests` with `{ code: 'DAILY_QUOTA_EXCEEDED', resetAt }` so the frontend displays a friendly remaining-quota banner.
2. **Gemini Upstream `429` / `503` / Quota Handling:**
   - Do **not** blindly retry in tight loops (amplifies quota depletion).
   - Map Gemini HTTP `429 RESOURCE_EXHAUSTED` or `503 UNAVAILABLE` cleanly to structured JSON (`{ error: 'AI service is temporarily busy or free-tier quota was reached. Please wait a minute and try again.', retryAfterSeconds: 60 }`).
   - Optionally fall back to concise local guidance or task/quiz recommendations without throwing unhandled promise rejections.
3. **No Paid Auto-Enablement:**
   - Use Google AI Studio free-tier API key during capstone testing or await explicit Faculty/Team authorization before attaching Cloud Billing.

---

## 8. Non-Disruptive Frontend Integration Plan

- **Separate Navigation View:** Add a dedicated sidebar item (`AI Tutor` -> `#view-assistant`) cleanly alongside `Dashboard`, `Tasks`, `Subjects`, `Analytics`, and `Quiz`, without altering existing DOM IDs tested by current suites.
- **Dedicated Frontend Service:** Create `src/services/ai-assistant.js` (mirrored to `public/src/services/ai-assistant.js`) with `listConversations`, `createConversation`, `getMessages`, `sendMessage`, `deleteConversation`.
- **Degradation Strategy:** If `ai-study-assistant` Edge Function or `ai_conversations` table is not deployed (`404` / `PGRST205`), show an explicit informational state explaining that the server-side Gemini assistant is not yet enabled, while keeping Tasks, Subjects, Standard Quiz, Rapid Quiz, and AI Quiz Generator working cleanly.
