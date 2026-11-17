# AI Quiz Backend & Live Verification — Week 11 MVP Assessment

**Project:** Smart Study Companion  
**Primary Owner (AI Backend & Service):** Nabin Khadka (`liftupkhadka555-spec`)  
**Database Support:** Sumit Adhikari (`adronnie`)  
**Component:** AI Quiz Generator (Edge Function + Client Service + Schema Migration 009)  
**Date:** 2026-11-15  
**Status:** Function code and client fallback engine pass the documented tests; cloud Edge Function deployment and SQL table creation are pending Supabase CLI / Dashboard execution. The live quiz database and PostgREST schema-cache visibility have not been verified.

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

### Client Fallback
When the live Edge Function is unavailable, `src/services/ai-quiz.js` falls back only to verified, curated quiz questions for the selected subject and difficulty, clearly labels them as `curated_fallback`, and sets `dbPersisted: false`. It does not treat fallback questions as proof of live Gemini integration.

---

## 3. Database / `PGRST205` Verification

**Required migration:** [`supabase/migrations/009_ai_quiz_tables.sql`](../../supabase/migrations/009_ai_quiz_tables.sql). It defines `ai_quizzes`, `ai_quiz_questions`, and `ai_quiz_attempts`, enables RLS, and adds policies. The migration file exists in the repository, but the report's current evidence does **not** show that it has been applied to the live Supabase project.

`PGRST205` means PostgREST cannot find the requested table in its schema cache. It does not by itself prove whether the underlying table is absent or whether the API schema cache is stale. Before claiming quiz database persistence works, verify all of the following in the linked Supabase project:

1. Apply migration 009 (instructions below) and confirm all three tables exist in the `public` schema. The migration uses unqualified table names; verify the resulting schema rather than assuming it.
2. Confirm the tables are exposed to the API and accessible to the intended API role, with the migration's RLS policies in place.
3. If tables exist but requests still return `PGRST205`, reload the PostgREST schema cache from the SQL Editor:
   ```sql
   NOTIFY pgrst, 'reload schema';
   ```
4. Retry a request against the exact table name, such as `ai_quizzes`, using an authenticated user. Confirm the response is successful and that inserts/reads obey RLS.

To check table presence and schema in the Supabase SQL Editor:
```sql
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_name IN ('ai_quizzes', 'ai_quiz_questions', 'ai_quiz_attempts')
ORDER BY table_schema, table_name;
```

A successful local test of the migration SQL or a successful schema-cache reload alone is not proof of live API access. Record the live query/API result before marking database persistence verified.

---

## 4. Deployment Instructions (Week 11 Action)

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
   Run [`supabase/migrations/009_ai_quiz_tables.sql`](../../supabase/migrations/009_ai_quiz_tables.sql) to create `ai_quizzes`, `ai_quiz_questions`, and `ai_quiz_attempts` with RLS. Then perform the database and PostgREST checks in Section 3.

---

## 5. Verification Check Results

The dedicated AI Quiz test suite ([`tests/test_ai_quiz.py`](../../tests/test_ai_quiz.py)) was executed:

```
Testing AI Quiz Generator Schema, Validation, Scoring, and UI...
  ✓ Migration 009: Schema, Foreign Keys, Constraints, and RLS verified.
  ✓ AI Question Validation: Rejects malformed/duplicate options and verifies bounds.
  ✓ AI Quiz Scoring: Verified score calculation (3/5 = 60%).
  ✓ Frontend UI: AI Quiz tabs, controls, generator and response handlers verified.
ALL AI QUIZ TESTS PASSED!
```

These are repository-level checks; they verify migration contents and application behavior, not that migration 009 was applied to the live database or that PostgREST recognizes the tables. Contract tests in [`tests/unit/backend-services.test.js`](../../tests/unit/backend-services.test.js) also verify that the service handles a missing `ai_quizzes` table without crashing and reports that persistence did not occur.

**Live database status:** Pending confirmation that migration 009 is applied, all three tables are in `public` and API-accessible, and authenticated quiz persistence succeeds without `PGRST205`.
