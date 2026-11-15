# AI Quiz Backend & Live Verification — Week 11 MVP Assessment

**Project:** Smart Study Companion  
**Primary Owner (AI Backend & Service):** Nabin Khadka (`liftupkhadka555-spec`)  
**Database Support:** Sumit Adhikari (`adronnie`)  
**Component:** AI Quiz Generator (Edge Function + Client Service + Schema Migration 009)  
**Date:** 2026-11-15  
**Status:** Function code and client fallback engine pass 100% of tests; cloud Edge Function deployment and SQL table creation are pending Supabase CLI / Dashboard execution.

---

## 1. Edge Function Architecture (`generate-ai-quiz`)

The Edge Function source code is located at:
[`supabase/functions/generate-ai-quiz/index.ts`](../../supabase/functions/generate-ai-quiz/index.ts)

### Security & Implementation Properties
1. **Mandatory Caller Authentication:**
   - The function extracts the Bearer token from the HTTP `Authorization` header.
   - Verifies the user via `supabaseClient.auth.getUser()`.
   - Rejects unauthenticated callers immediately with HTTP `401 Unauthorized`.
2. **Server-Side API Key Storage:**
   - The Google Gemini API key is read solely from the server environment:
     ```typescript
     const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || "";
     ```
   - **Zero Secret Leakage:** The API key is never bundled in frontend JavaScript, HTML, Vite builds, or Git commits.
3. **Structured Upstream Prompting:**
   - Calls Google Gemini 1.5 Flash (`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`).
   - Enforces strict JSON formatting requiring an array of questions, each with:
     - `question`: Concise conceptual problem statement.
     - `options`: Array of exactly 4 distinct choices.
     - `correct_answer`: 0-based integer index pointing to the right choice.
     - `explanation`: Pedagogical explanation of why the answer is correct and why other choices are distractors.
4. **CORS Headers:**
   - Handles `OPTIONS` preflight requests cleanly with proper `Access-Control-Allow-Origin`, `Access-Control-Allow-Headers`, and `Access-Control-Allow-Methods`.

---

## 2. Live Probe & Current Deployment Status

On **2026-11-15**, the live endpoint was probed:
```bash
POST https://bcwwnjtmrcxggbaallon.supabase.co/functions/v1/generate-ai-quiz
```
- **Observed Result:** **HTTP 404** `{"code":"NOT_FOUND","message":"Requested function was not found"}`.
- **Diagnosis:** The Edge Function code is complete in the repository, but has not yet been pushed to Supabase Cloud using the Supabase CLI.

### Resilient Client Fallback Engine
When the live Edge Function returns 404 or network is unavailable, the client service [`src/services/ai-quiz.js`](../../src/services/ai-quiz.js) activates an internal topic-aware template engine:
- Generates 5 valid questions tailored to the requested subject.
- Sets `dbPersisted: false` to be transparent about cloud persistence status.
- **Rule of Honesty:** The local template fallback is a safety mechanism; it is **not presented as proof of live Gemini API integration**.

---

## 3. Deployment Instructions (Week 11 Action)

To make the AI Quiz Generator live on Supabase Cloud:

1. **Install Supabase CLI and Link Project:**
   ```bash
   npx supabase login
   npx supabase link --project-ref bcwwnjtmrcxggbaallon
   ```
2. **Set the Gemini API Key Secret:**
   ```bash
   npx supabase secrets set GEMINI_API_KEY="<your-google-ai-studio-api-key>"
   ```
3. **Deploy the Edge Function:**
   ```bash
   npx supabase functions deploy generate-ai-quiz --no-verify-jwt
   ```
   *(Note: The function performs its own `supabaseClient.auth.getUser()` verification inside `index.ts`.)*
4. **Execute Migration `009` in SQL Editor:**
   Run [`supabase/migrations/009_ai_quiz_tables.sql`](../../supabase/migrations/009_ai_quiz_tables.sql) to create `ai_quizzes`, `ai_quiz_questions`, and `ai_quiz_attempts` with RLS.

---

## 4. Verification Check Results

The dedicated AI Quiz test suite ([`tests/test_ai_quiz.py`](../../tests/test_ai_quiz.py)) was executed:

```
Testing AI Quiz Generator Schema, Validation, Scoring, and UI...
  ✓ Migration 009: Schema, Foreign Keys, Constraints, and RLS verified.
  ✓ AI Question Validation: Rejects malformed/duplicate options and verifies bounds.
  ✓ AI Quiz Scoring: Verified score calculation (3/5 = 60%).
  ✓ Frontend UI: AI Quiz tabs, controls, generator and response handlers verified.
ALL AI QUIZ TESTS PASSED!
```

Additionally, contract tests in [`tests/unit/backend-services.test.js`](../../tests/unit/backend-services.test.js) verify that when `ai_quizzes` is missing from the database, the service handles the `PGRST205` error cleanly without crashing the UI, warning the user and saving the attempt locally.

