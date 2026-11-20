# Week 12 Technical Audit & Baseline

**Project:** Smart Study Companion — Team 5 (Ulsan College)  
**Audit Date:** November 20, 2026  
**Branch:** `week12/p0-p1-verification-and-fixes` (from `main` @ `4183944`)

---

## 1. Existing Working Features (Observed in Repo & Local Suites)
- **Authentication & Route Protection:** `public/auth/` (`login.html`, `signup.html`, `verify.html`, `forgot-password.html`, `reset-password.html`) + `src/services/auth.js` + `src/auth-guard.js`.
- **5-Tier Academic Onboarding:** Country → University → Faculty → Major → Subjects (`src/lib/academic-catalog.js`, `src/services/subjects.js`).
- **Task CRUD & Analytics:** `src/services/tasks.js`, completion ring, 7-day scheduled chart, workload breakdown, subject-wise progress, plus Study Analytics 2.0 (`011_study_streak_analytics.sql`, `src/study-analytics-upgrade.js`).
- **Quiz Practice & Retake Fix:** Standard (15), Rapid (10 / 30s), AI Quiz Generator (`supabase/functions/generate-ai-quiz/index.ts`), `src/lib/quiz-engine.js`, and Retake Quiz (`retakeCurrentQuiz()`, PR #71).
- **Theme & Responsive Shell:** Light/dark persistence (`src/theme.js`), sidebar navigation (broken Wireframes link removed in PR #69).

## 2. Confirmed Bugs & Schema Findings Entering Week 12
1. **Task Modal empty/invalid deadline crash (`public/app.js`):** `new Date(...).toISOString()` ran before validation, throwing `RangeError: Invalid time value` on empty input. *(Fixed in this branch via `parseDeadlineInputToIso`.)*
2. **UTC date offset in `dateInputValue()` (`public/app.js`):** Used `.toISOString().slice(0, 10)`, causing a 1-day shift near midnight in `Asia/Seoul` (`UTC+9`). *(Fixed in this branch via `formatLocalDateInput`.)*
3. **Quiz History 20-attempt cap (`public/app.js`):** `loadAndRenderQuizHistory()` fetched/sliced only 20 attempts, capping Analytics Total Attempts at 20. *(Fixed in this branch: raised fetch limit to 200 and removed the 20-item slice.)*
4. **Duplicate `011_` migration prefix:** Both `011_study_streak_analytics.sql` (applied in Supabase Nov 17) and `011_quiz_difficulty_and_repetition.sql` (unapplied) used `011_`. *(Resolved in this branch by renaming the unapplied quiz migration to `012_quiz_difficulty_and_repetition.sql`.)*

## 3. Unverified / External-Access Components
- **Live Supabase Migrations `009`, `010`, `012`:** Remote DB schema inspection requires Supabase Dashboard/CLI credentials (status: `UNVERIFIED` from local environment).
- **Gemini Edge Function (`generate-ai-quiz`):** Requires Supabase CLI deploy & `GEMINI_API_KEY` secret (`UNVERIFIED` live).
- **Brevo Custom SMTP (Issue #40):** Requires Supabase Auth Dashboard + Brevo DNS/SMTP credentials (`BLOCKED / UNVERIFIED`).
- **Two-Student Live RLS (`DATA-01`):** Requires 2 live disposable student accounts (`NOT RUN` in real cloud).
- **Playwright Browser E2E (`0/24`):** `@playwright/test` is not installed in `node_modules` (`NOT RUN`).
- **Vercel Org Integration (Issue #59):** Requires university GitHub org admin approval (`PENDING`).

## 4. Baseline Test Results (on `4183944` before Week 12 edits)
- `npm test` (Vitest): **10 files, 75 / 75 PASS**
- `python3 tests/run_tests.py`: **11 / 11 PASS**
- `python3 tests/test_ai_quiz.py`: **4 / 4 PASS**
