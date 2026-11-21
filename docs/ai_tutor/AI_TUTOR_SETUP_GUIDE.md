# AI Tutor — Setup & Deployment Guide

**Project:** Smart Study Companion — Team 5 (Ulsan College Capstone Design)  
**Target Supabase Project:** `bcwwnjtmrcxggbaallon` (`https://bcwwnjtmrcxggbaallon.supabase.co`)  
**Feature Branch:** `feature/ai-tutor`

---

## 1. Prerequisites & Dependencies

- **Node.js `>= 18`** (verified locally on `v26.13.0`) + project dev dependencies (`vite`, `vitest`)
- **Python `>= 3.9`** (for `tests/run_tests.py`, `tests/test_ai_quiz.py`, `tests/test_ai_tutor.py`, and `tests/e2e/e2e_runner.py`)
- **DB Test Dependencies (`tests/db/`):** `@electric-sql/pglite` (already installed in `tests/db/node_modules`)
- **Supabase CLI** (`npx supabase` or installed globally) for deploying Edge Functions and setting server secrets
- **Google AI Studio Account / Gemini API Key:** Free-tier or team-approved `GEMINI_API_KEY` (never enable paid billing without explicit faculty/team approval)

---

## 2. Database Migration Setup (`013_ai_tutor.sql`)

Before students can persist AI Tutor conversations, ensure prerequisite migrations (`001`–`012`, notably `001_profiles.sql`, `002_subjects.sql`, `003_tasks.sql`) are present in Supabase PostgreSQL.

### Option A: Supabase Dashboard SQL Editor
1. Open **Supabase Dashboard → SQL Editor → New Query**.
2. Copy the entire contents of `supabase/migrations/013_ai_tutor.sql`.
3. Click **Run** and confirm `Success. No rows returned`.
4. Inspect **Table Editor** to verify RLS (`Enabled`) is active on:
   - `public.ai_tutor_conversations`
   - `public.ai_tutor_messages`
   - `public.ai_tutor_learning_sessions`
   - `public.ai_tutor_usage_quotas`

### Option B: Rollback (If Needed)
Run `supabase/rollbacks/013_ai_tutor_down.sql` in the SQL Editor to cleanly drop only the AI Tutor tables, policies, and trigger function without affecting core tables (`profiles`, `subjects`, `tasks`, `quiz_attempts`).

---

## 3. Configure Gemini API Key & Edge Function Secrets

**CRITICAL SECURITY RULE:** Never put `GEMINI_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` into `.env`, `VITE_*` variables, `src/`, `public/`, HTML, or Git commits. Store them strictly inside Supabase Edge Function secrets:

```bash
# 1. Authenticate & link project (one time)
supabase login
supabase link --project-ref bcwwnjtmrcxggbaallon

# 2. Set server-side secrets cleanly
supabase secrets set GEMINI_API_KEY="<your-google-ai-studio-api-key>"
supabase secrets set GEMINI_MODEL="gemini-2.5-flash"

# Optional tuning (defaults shown):
supabase secrets set AI_TUTOR_DAILY_LIMIT="30"
supabase secrets set AI_TUTOR_COOLDOWN_SECONDS="2"
```

### Deploy `ai-tutor-chat` Edge Function
```bash
supabase functions deploy ai-tutor-chat
```

*(Also ensure `generate-ai-quiz` is deployed if using **"Practice This Topic"** live AI quiz generation rather than verified curated fallback questions.)*

---

## 4. CORS & Origin Configuration

`supabase/functions/ai-tutor-chat/tutor-core.ts` allows these origins by default:
- `https://team-5-capstone-design-761v.vercel.app`
- `https://capstonedesign-fall2026-ulsancollege.github.io`
- `http://localhost:3000`, `http://127.0.0.1:3000`
- `http://localhost:4173`, `http://127.0.0.1:4173`
- `http://localhost:5173`, `http://127.0.0.1:5173`

To allow an additional custom preview domain, set:
```bash
supabase secrets set ALLOWED_CORS_ORIGINS="https://your-preview-domain.vercel.app"
```

---

## 5. Local Development & Testing

```bash
# Install frontend dependencies (if not installed)
npm install

# Run Vitest unit & service contract tests
npm test

# Run Python integration checks
python3 tests/run_tests.py
python3 tests/test_ai_quiz.py
python3 tests/test_ai_tutor.py

# Run PGlite PostgreSQL schema & two-student RLS isolation tests
node --test tests/db/study-streak.db.test.js
node --test tests/db/ai-tutor.db.test.js

# Build production bundle (public/ -> dist/) and preview locally
npm run build
npm run preview -- --port 4173
```

---

## 6. Hosted Deployment (Vercel & GitHub Pages)

- **Vercel:** Build runs `npm run build` (`vite.config.js` reads from `public/` and outputs `dist/`). Push approved branch changes or merge to the connected Vercel branch.
- **GitHub Pages:** Root `index.html` redirects cleanly into `public/index.html`. Ensure `src/` and `public/src/` remain synchronized (`tests/test_ai_tutor.py` and `tests/unit/backend-services.test.js` verify mirror parity automatically).

---

## 7. Verifying Live AI Functionality (Post-Deploy Checklist)

1. Sign in as a real test student on `https://team-5-capstone-design-761v.vercel.app/#ai-tutor`.
2. Verify **Personalized Context Banner** displays saved Country / University / Major and selected Subject.
3. Ask `"Explain binary search trees."` at **Beginner** level -> verify real Gemini response returns & saves in left **History** list.
4. Ask follow-up `"Can you give me an example in Java?"` -> verify context stays on binary search trees without duplicating conversations.
5. Refresh browser (`Cmd+R`) -> verify conversation persists from Supabase PostgreSQL.
6. Switch **Difficulty** to **Advanced** and **Language** to **Korean** -> verify responses adapt depth cleanly without breaking code block syntax.
7. Click **Practice This Topic** -> verify Quiz view opens with Subject + Topic + mapped Difficulty (`beginner -> easy`, `intermediate -> medium`, `advanced -> hard`).
8. Request a **Study Plan** -> confirm recommended session cards only appear as suggestions until **Add Selected to Study Tasks** is clicked.
9. Run a two-student RLS check with Student B's token against Student A's conversation ID to confirm `0` rows returned and HTTP `403` on Edge Function access.

---

## 8. Troubleshooting

| Symptom / Error Message | Cause | Fix |
| :--- | :--- | :--- |
| `"AI Tutor is not enabled yet because GEMINI_API_KEY is missing on the server."` | Edge Function secret missing (`503`) | Run `supabase secrets set GEMINI_API_KEY="..."` |
| `"AI Tutor backend function or database tables are not deployed in Supabase yet."` | `013_ai_tutor.sql` not applied or `ai-tutor-chat` not deployed (`404` / `PGRST205`) | Apply `013_ai_tutor.sql` and run `supabase functions deploy ai-tutor-chat` |
| `"Your session has expired. Please sign in again."` | Missing/expired Supabase JWT (`401`) | Sign out and sign back in |
| `"Daily AI Tutor limit (30 messages) reached."` | Student hit server-enforced daily quota (`429`) | Wait until UTC midnight or adjust `AI_TUTOR_DAILY_LIMIT` |
| `"Origin not permitted."` | Calling Edge Function from unlisted domain (`403`) | Add domain to `ALLOWED_CORS_ORIGINS` secret |
