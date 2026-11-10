# AI Study Assistant Integration Plan — Future Roadmap (Google Gemini)

> **Important Status Notice:** **NOT IMPLEMENTED (Design Proposal Only).** No ChatGPT-style AI Study Assistant endpoint or Gemini API key has been deployed, and **no paid AI services or API charges are enabled**. Deep architectural schema specs also reside in [`docs/AI_STUDY_ASSISTANT_ARCHITECTURE.md`](../AI_STUDY_ASSISTANT_ARCHITECTURE.md).

---

## 1. Student Problems This Feature Solves

- Students practicing quizzes or reviewing complex coursework often need step-by-step explanations tailored to their exact university major, enrolled subject, and upcoming deadlines rather than static multiple-choice keys alone.
- Currently, Smart Study Companion only offers template-based topic quiz generation fallback when the `generate-ai-quiz` Edge Function is undeployed. A conversational tutor bridges comprehension gaps immediately within the study workflow.

---

## 2. Subject-Aware Chat Interface

- Dedicated sidebar navigation view (`AI Tutor` / `#view-assistant`) cleanly separated from `#dashboard`, `#tasks`, `#subjects`, `#analytics`, and `#quiz`.
- Dropdown/context pill binds each chat session to an enrolled subject (`subject_id` / `subjectSlug`) and injects the student's `profiles` academic context (`university`, `faculty`, `major`) + bounded upcoming tasks/quiz weak areas server-side.

---

## 3. Gemini Free API Integration

- Uses Google AI Studio **Gemini Free Tier** (`gemini-2.5-flash` via `generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`) during capstone testing without attaching billing unless explicitly approved by Team 5 and course faculty.

---

## 4. Supabase Edge Function Architecture

- **Proposed Server Location:** `supabase/functions/ai-study-assistant/index.ts` (Deno Edge Function mirroring `generate-ai-quiz` structure).
- Validates the caller's Supabase Auth JWT (`supabase.auth.getUser()`), enforces daily quota before dispatching upstream Gemini requests, builds the bounded academic system prompt from Postgres rows, and stores user + assistant turns.

---

## 5. Secure API Key Storage

- Store `GEMINI_API_KEY` solely via Supabase CLI secret store (`npx supabase secrets set GEMINI_API_KEY=...`).
- Never expose `GEMINI_API_KEY` via `VITE_` / `NEXT_PUBLIC_` browser variables, `src/`, `public/`, HTML, or Git commits.

---

## 6. Student Chat History

- Proposed Migration `011_ai_study_assistant.sql` adds:
  - `public.ai_conversations` (`id`, `user_id -> profiles.id`, `subject_id -> subjects.id`, `title`, `enable_web_search`, `created_at`, `updated_at`)
  - `public.ai_messages` (`id`, `conversation_id -> ai_conversations.id`, `user_id -> profiles.id`, `role IN ('user','assistant','system')`, `content`, `citations JSONB`, `model_name`, `token_count`, `created_at`)
- Protected strictly by RLS policies verifying `auth.uid() = user_id`.

---

## 7. Optional Web Search Grounding

- Per-conversation toggle (`enable_web_search`, default `false`).
- When opted in, Edge Function attaches Gemini `{ "google_search": {} }` grounding tool, extracts verified `https://`/`http://` source URIs into `ai_messages.citations`, and gracefully degrades to offline course context if search quota limits hit.

---

## 8. Educational Explanations and Practice Questions

- System prompt enforces academic integrity: explain concepts step-by-step, highlight intuition and edge cases, generate quick check-understanding questions, and optionally launch/link custom quizzes in `#view-quiz`.

---

## 9. Daily Student Request Limits

- Server-tracked table `public.ai_usage_quotas` (`user_id`, `usage_date`, `request_count`, `estimated_tokens`, `last_request_at`) enforces per-student cooldown (`MIN_SECONDS_BETWEEN_REQUESTS = 5`), input cap (`MAX_INPUT_CHARS = 4000`), output cap (`maxOutputTokens = 1024`), and daily ceiling before calling Gemini.

---

## 10. Example Daily Capacity Calculation

- Planned classroom baseline: **`50` students × `5` questions/day = `250` AI requests per day** (approx. ~250k–500k combined input/output tokens/day depending on 12-turn context window size).
- Setting soft per-student limits around **10–30 requests/day** caps spikes from single users while keeping `50` active classmates within free-tier experimentation tolerances (or highlighting exact quota exhaustion cleanly).

---

## 11. Free-Tier Quota Limitations

- Gemini API Free Tier imposes requests-per-minute (RPM), requests-per-day (RPD), and tokens-per-minute (TPM) limits that change by model/region and may share rate pools across project usage; free-tier prompts may also be subject to Google AI Studio free-tier terms unless upgraded under an approved paid tier.
- Edge Function maps HTTP `429 RESOURCE_EXHAUSTED` / `503` cleanly without tight retry loops and shows user-friendly cooldown banners.

---

## 12. Integration with Quizzes and Exam Preparation

- Weak-topic detection from `quiz_attempts` / `ai_quiz_attempts` lets the student click *"Ask AI Tutor about this topic"* directly after quiz review, feeding missed question concepts cleanly into a new subject conversation.

---

## 13. Privacy and Data Protection

- Mandatory JWT authentication (`401` if missing/invalid).
- Strict per-user RLS on `ai_conversations`, `ai_messages`, and `ai_usage_quotas` read access; quota writes handled server-side so students cannot bypass limits.
- Zero PII/credentials sent in system prompts (only major, faculty, subject name, and bounded study topic).

---

## 14. Estimated Implementation Difficulty

- **Moderate (`~2–3` engineering days once Migrations `009` + SMTP are stabilized):**
  - Low complexity: Migration `011` schema + RLS + frontend service `ai-assistant.js`.
  - Moderate complexity: Edge Function streaming/grounding error handling, quota RPCs, and multi-turn mobile-responsive chat drawer UX.

---

## 15. Development Roadmap

1. **Phase 0 (Prerequisite):** Apply Migration `009`, deploy `generate-ai-quiz`, and finish live end-to-end Auth/Task/Quiz testing.
2. **Phase 1 (Schema & Secrets):** Add `011_ai_study_assistant.sql` (conversations, messages, quotas) + configure free-tier `GEMINI_API_KEY` in Supabase Secrets.
3. **Phase 2 (Edge Function):** Implement `supabase/functions/ai-study-assistant/index.ts` with JWT verification, quota checks, bounded context assembly, and Gemini `generateContent`.
4. **Phase 3 (UI & History):** Add `#view-assistant` + `src/services/ai-assistant.js` with optional search citations and quiz integration.
5. **Phase 4 (Verification):** Unit-test quota/error handling and verify two-student RLS conversation isolation in browser tests.
