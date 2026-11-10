# Smart Study Companion — Complete Backend Integration Report

**Project:** Team 5 — Smart Study Companion (`https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design`)  
**Branch:** `supabase-auth`  
**Supabase Project:** `https://bcwwnjtmrcxggbaallon.supabase.co`  

---

## 1. Complete Backend Architecture

Smart Study Companion runs as a static ES Module web application (`public/` served on GitHub Pages, Vercel via `vercel.json`, or bundled via Vite 6 `vite.config.js` into `dist/`) paired directly with **Supabase Cloud** using `@supabase/supabase-js@2.45.0` (loaded via `https://esm.sh/@supabase/supabase-js@2.45.0`):

1. **Client Configuration (`src/lib/supabase.js` / `public/src/lib/supabase.js`):**
   - Resolves `supabaseUrl` (`VITE_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` / live default) and public publishable key `supabaseAnonKey` (`VITE_SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / live default `sb_publishable_w2FL6KB5yEyy_iatIN993Q_ifuBdl7i`).
   - Initializes `createClient(..., { auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true } })`.
   - Zero `service_role` keys or private secrets exist in frontend source code.
2. **Auth & Session Guard Layer:**
   - Dedicated auth entry pages in `public/auth/` (`login.html`, `signup.html`, `verify.html`, `forgot-password.html`, `reset-password.html`) wired through `public/auth/auth-init.js` -> `src/services/auth.js`.
   - Route protection handled by `src/auth-guard.js` and `public/app.js` `loadUserData()`.
3. **Service Layer (`src/services/*` synchronized byte-for-byte with `public/src/services/*`):**
   - `auth.js`: Supabase Auth signup (terminating auto-sessions so explicit login is enforced), sign-in, sign-out, recovery email trigger, OTP verification (`verifyOtp`), password update, session helpers.
   - `profile.js`: Student academic profile (`getProfile`, `upsertProfile`, `updateDisplayName`) against `public.profiles`.
   - `subjects.js`: Read-only catalog loaders (`getUniversitiesCatalog`, `getDefaultSubjects`, `getAllSubjects`, `getSubjectsByMajor`) and student enrollment sync (`getStudentSubjects`, `saveStudentSubjects`, `enrollInSubject`).
   - `tasks.js`: CRUD operations (`getTasks`, `getTasksBySubject`, `createTask`, `updateTask`, `toggleTask`, `deleteTask`) against `public.tasks`.
   - `quiz.js`: Shuffled question loading (`getQuizQuestions`), attempt + response persistence (`saveQuizAttempt`), and history retrieval (`getQuizHistory`) against `quiz_questions`, `quiz_attempts`, and `quiz_responses`.
   - `ai-quiz.js`: AI quiz generation (`generateAiQuiz` invoking Edge Function `generate-ai-quiz` with client-side topic engine fallback), validation (`validateAndSanitizeQuestions`), attempt saving (`saveAiQuizAttempt`), and history fetching (`getAiQuizHistory`).
4. **PostgreSQL + Row Level Security (`supabase/migrations/001`–`010` + `setup_all.sql`):**
   - Public read-only catalog tables (`universities`, `subjects`, `major_subjects`, `quiz_questions`).
   - Private student-scoped tables (`profiles`, `student_subjects`, `tasks`, `quiz_attempts`, `quiz_responses`, plus `ai_quizzes`, `ai_quiz_questions`, `ai_quiz_attempts` in Migration `009`).
5. **Future AI Study Assistant Design:** Documented separately without incurring AI charges in [`docs/AI_STUDY_ASSISTANT_ARCHITECTURE.md`](AI_STUDY_ASSISTANT_ARCHITECTURE.md).

---

## 2. All Files Inspected

- **Project Configuration & Entry:** `package.json`, `vite.config.js`, `vitest.config.js`, `vercel.json`, `.gitignore`, `.env.example`, `.env`, `README.md`, `index.html`, `public/index.html`, `public/styles.css`, `app.js`, `public/app.js`
- **Frontend Auth Pages & Guard:** `public/auth/login.html`, `public/auth/signup.html`, `public/auth/verify.html`, `public/auth/forgot-password.html`, `public/auth/reset-password.html`, `public/auth/auth.css`, `public/auth/auth-init.js`, `src/auth-guard.js`, `public/src/auth-guard.js`
- **Frontend Libraries & Services:** `src/lib/supabase.js`, `src/lib/academic-catalog.js`, `src/services/auth.js`, `src/services/profile.js`, `src/services/subjects.js`, `src/services/tasks.js`, `src/services/quiz.js`, `src/services/ai-quiz.js` (and `public/src/*` mirrors)
- **Supabase SQL & Functions:** `supabase/migrations/001_profiles.sql` through `009_ai_quiz_tables.sql`, `supabase/setup_all.sql`, `supabase/functions/generate-ai-quiz/index.ts`
- **Docs & Automated Tests:** `docs/week_10/SUPABASE_VERIFICATION_REPORT.md`, `tests/run_tests.py`, `tests/test_ai_quiz.py`, `tests/unit/auth.test.js`, `tests/unit/quiz.test.js`, `tests/unit/tasks.test.js`, `tests/unit/theme.test.js`, `tests/e2e/` (empty)

---

## 3. All Files Created or Modified

### Modified Files
1. `src/auth-guard.js` & `public/src/auth-guard.js`
2. `src/services/subjects.js` & `public/src/services/subjects.js`
3. `src/services/tasks.js` & `public/src/services/tasks.js`
4. `src/services/quiz.js` & `public/src/services/quiz.js`
5. `src/services/ai-quiz.js` & `public/src/services/ai-quiz.js`
6. `public/index.html`
7. `public/app.js` & `app.js`
8. `vite.config.js`
9. `supabase/setup_all.sql`

### Created Files
1. `supabase/migrations/010_complete_universities.sql` — Idempotent seed migration adding missing catalog countries/universities (`Bhutan`, `Maldives`, `Other / International`, and extra institutions for `Nepal`, `India`, `Bangladesh`, `Pakistan`, `Sri Lanka`, `South Asia`).
2. `tests/unit/backend-services.test.js` — Vitest integration-contract suite (9 tests) verifying catalog integrity and all service fixes.
3. `docs/AI_STUDY_ASSISTANT_ARCHITECTURE.md` — Section 9 Google Gemini AI Study Assistant design specification.
4. `docs/COMPLETE_BACKEND_INTEGRATION_REPORT.md` — This final engineering report.

---

## 4. Backend Connections Completed

- **Catalog Preload Order Fixed (`public/app.js` `loadUserData()`):** Now loads `getAllSubjects()` and `getUniversitiesCatalog()` concurrently via `Promise.all` *before* mapping tasks or enrolled subjects, so task `subject_id` UUIDs resolve properly to subject names and `getSubjectId(name)` resolves cleanly by name or `SUBJECTS_CATALOG` slug fallback.
- **Universities Catalog Connected (`src/services/subjects.js` + `public/app.js`):** Added `getUniversitiesCatalog()` querying `public.universities` from Supabase while preserving unseeded countries from `UNIVERSITIES_BY_COUNTRY`; wired `dbUniversitiesByCountry` into `initAcademicHierarchy()` and `saveAcademicProfileAndSubjects()` (`Country -> University` validation added alongside `Faculty -> Major`).
- **Student Subject Enrollment Fixed (`src/services/subjects.js`):** Stopped `saveStudentSubjects()` from attempting blocked `upsert` writes to read-only `public.subjects` catalog rows. Now resolves UUIDs read-only via `.from('subjects').select('id, slug, name').in('slug', slugs)`, deletes deselected `student_subjects` rows, upserts newly selected enrollments with `onConflict: 'student_id,subject_id'`, and returns `{ data: [], error: null }` cleanly from `getStudentSubjects()` when cloud DB has zero rows (removing stale `localStorage` overwrite behavior).
- **Onboarding Save Error Propagation (`public/app.js` `saveAcademicProfileAndSubjects()`):** Now awaits and checks `{ error }` from both `saveStudentSubjects()` and `upsertProfile()` before mutating local state or navigating to the dashboard.
- **Task Persistence Validation & Error Handling (`src/services/tasks.js` + `public/app.js`):** Added title (`1..500` chars), valid deadline timestamp, and Supabase UUID `subject_id` validation in both `createTask` and `updateTask`; guarded local-prefix IDs (`local-task-...`) in `updateTask`/`deleteTask`; fixed `public/app.js` task toggle and delete listeners to check `{ error }` before mutating UI state.
- **Quiz Submission, History & Analytics Connected (`src/services/quiz.js`, `src/services/ai-quiz.js`, `public/app.js`, `public/index.html`):**
  - Fixed `finishQuiz()` to pass `mode: quiz.mode` (`'standard'` / `'rapid'`), removed nonexistent `timeSpentSeconds` assumption on DB column list in `quiz.js`, replaced invalid `-1` unanswered codes with `NULL` (`quiz.answers[idx] ?? null`), resolved `subjectSlug -> UUID` in `saveQuizAttempt()` and `generateAiQuiz()`, filtered `quiz_responses` to valid UUID `question_id`s, and propagated `quiz_attempts` / `quiz_responses` / `getQuizHistory` errors cleanly.
  - Added Recent Quiz History UI (`#quiz-history-panel` / `#quiz-history-list`) inside `#quiz-setup` and Quiz Performance Summary (`#analytics-quiz-summary`) inside `#view-analytics`, fed by `loadAndRenderQuizHistory()`.
  - Fixed weekly chart header in `#view-analytics` (`"0 scheduled"` / `"Tasks scheduled across the last 7 days."`) to match `renderWeeklyActivityChart()`.
- **Multi-Page Vite Build (`vite.config.js`):** Registered all 6 HTML entry points (`index.html`, `auth/login.html`, `auth/signup.html`, `auth/verify.html`, `auth/forgot-password.html`, `auth/reset-password.html`) under `build.rollupOptions.input`.

---

## 5. Database Tables and Relationships Used

| Table | Primary Key / Unique | Foreign Key Relationships | Live DB Status (Anon Probe) | RLS Status |
|---|---|---|---|---|
| `profiles` | `id UUID PK` | `id -> auth.users(id) ON DELETE CASCADE` | Live (`HTTP 200`, `[]` unauthenticated) | Owner-only (`auth.uid() = id`) |
| `universities` | `id UUID PK`, `UNIQUE(country, name)` | — | Live (`HTTP 206`, `46` rows, 7 countries) | Public `SELECT` (`anon` & `authenticated`) |
| `subjects` | `id UUID PK`, `slug TEXT UNIQUE` | — | Live (`HTTP 206`, `32` rows) | Public `SELECT` only |
| `major_subjects` | `id` | `subject_slug -> subjects(slug) ON DELETE CASCADE` | Live (`HTTP 206`, `128` rows) | Public `SELECT` |
| `student_subjects` | `UNIQUE(student_id, subject_id)` | `student_id -> profiles(id)`, `subject_id -> subjects(id)` | Live (`HTTP 200`, `[]` unauthenticated) | Owner-only (`auth.uid() = student_id`) |
| `tasks` | `id UUID PK` | `student_id -> profiles(id)`, `subject_id -> subjects(id)` | Live (`HTTP 200`, `[]` unauthenticated) | Owner-only (`auth.uid() = student_id`) |
| `quiz_questions` | `id UUID PK` | `subject_id -> subjects(id) ON DELETE CASCADE` | Live (`HTTP 206`, `345` rows) | Public/Auth `SELECT` |
| `quiz_attempts` | `id UUID PK` | `student_id -> profiles(id)`, `subject_id -> subjects(id)` | Live (`HTTP 200`, `[]` unauthenticated) | Owner-only (`auth.uid() = student_id`) |
| `quiz_responses` | `id UUID PK` | `attempt_id -> quiz_attempts(id)`, `question_id -> quiz_questions(id)` | Live (`HTTP 200`, `[]` unauthenticated) | Via parent `quiz_attempts.student_id = auth.uid()` |
| `ai_quizzes` | `id UUID PK` | `subject_id -> subjects(id)`, `created_by -> profiles(id)` | **Missing (`404 PGRST205`)** — Migration `009` unapplied | Defined in `009_ai_quiz_tables.sql` (`auth.uid() = created_by`) |
| `ai_quiz_questions` | `id UUID PK` | `ai_quiz_id -> ai_quizzes(id) ON DELETE CASCADE` | **Missing (`404 PGRST205`)** | Defined via parent `ai_quizzes.created_by = auth.uid()` |
| `ai_quiz_attempts` | `id UUID PK` | `ai_quiz_id -> ai_quizzes(id)`, `user_id -> profiles(id)` | **Missing (`404 PGRST205`)** | Defined (`auth.uid() = user_id`) |

---

## 6. Authentication Fixes

- **Auth Guard Routing (`src/auth-guard.js` & `public/src/auth-guard.js`):**
  - Added subdirectory-safe `getBasePath()`, `getDashboardUrl()`, and `getLoginUrl()` helpers so redirects from `/auth/*.html` work cleanly on both root Vite dev (`localhost:3000`) and GitHub Pages (`/Team-5-Capstone-Design/public/...`).
  - Added `/auth/reset-password.html` and `/auth/verify.html` to `AUTH_PAGES`.
  - Exempted `reset-password` from the automatic "already authenticated -> redirect to dashboard" rule in both initial load and `onAuthStateChange('SIGNED_IN')` so users arriving from a recovery email link stay on `reset-password.html` to enter their new password.
- **Verified Existing Auth Flows (`src/services/auth.js` & `public/auth/auth-init.js`):**
  - `signUp()` calls `supabase.auth.signUp()` and immediately calls `supabase.auth.signOut()` if Supabase auto-created a session (which currently happens because `mailer_autoconfirm: true` is active on live Supabase Cloud), enforcing explicit login via `login.html?registered=true`.
  - `signOut()` clears local session storage, awaits `supabase.auth.signOut()`, and redirects to `login.html`.

---

## 7. Password Reset Root Cause and Resolution

### Observed Root Causes (Why Student Did Not Receive 6-Digit Recovery PIN in Gmail)
1. **Registered Email Typo in Live Supabase Users (`Authentication -> Users` Screenshot Evidence):**
   - In the Supabase Dashboard Users table, account `prince Karki` is registered under **`princekarki127@gmmail.com`** (two `m`s: `@gmmail.com`), whereas on `forgot-password.html` the recovery screenshot submitted **`princekarki127@gmail.com`**.
   - Supabase's `POST /auth/v1/recover` endpoint intentionally returns HTTP `200` (`{ error: null }`) even when no matching user exists to prevent email enumeration; consequently, `forgot-password.html` showed `"Check your email"` while no email was dispatched to `@gmail.com`.
2. **Default Shared Supabase SMTP Restrictions & Dashboard Settings:**
   - Live `/auth/v1/settings` confirms `"mailer_autoconfirm": true` (Email confirmation disabled) and `"external.email": true`.
   - Default Supabase shared SMTP severely throttles free-tier projects (~2–4 emails/hr, unreliable external Gmail delivery), and **Authentication -> Audit Logs** (`audit_log_entries`) is toggled OFF in the Dashboard, leaving delivery/drop visibility unrecorded.
3. **Auth Guard Recovery-Link Interception (Fixed in Code):**
   - Prior to our edit, `src/auth-guard.js` did not include `/auth/reset-password.html` or `/auth/verify.html` in `AUTH_PAGES` and lacked subdirectory base-path calculation, risking broken redirects during GitHub Pages / subpath recovery.

### Resolution
- Fixed `src/auth-guard.js` / `public/src/auth-guard.js` to allow authenticated/recovery sessions to complete password update on `reset-password.html` (`!window.location.pathname.includes('reset-password')`) and navigate properly across subpath deployments.
- Verified `resetPassword()`, `verifyOtp({ email, token: cleanToken, type: 'recovery' })`, `resendPasswordReset()`, and `updatePassword()` (which calls `supabase.auth.signOut()` after password change so the student logs in fresh with the new password).
- **Important Security Note:** If `princekarki127@gmmail.com` belongs to a teammate who typed `@gmmail.com` during signup, an admin must update/recreate that user's email in Supabase Dashboard (`Authentication -> Users`) and configure custom SMTP + `{{ .Token }}` template (Section 11) before re-testing live Gmail OTP delivery.

---

## 8. Task and Quiz Integration Results

- **Tasks (`src/services/tasks.js` + `public/app.js`):**
  - Create, edit, toggle completion, delete, search/filter, and dashboard/analytics calculations are wired to `public.tasks` and `dbSubjects` UUIDs with validation (`title` 1–500 chars, valid `deadline`, valid cloud `subject_id` UUID).
  - UI optimistic-mutation bugs fixed: toggle and delete now check `{ error }` before mutating in-memory `tasks` or dismissing errors silently.
- **Curated Quizzes (`src/services/quiz.js` + `public/app.js`):**
  - Supports 15-question Standard quiz and 10-question / 30-sec Rapid quiz (`loadQuizQuestions()` queries `quiz_questions` by UUID with offline `QUIZ_BANK` fallback).
  - Note: For the 27 expanded subjects seeded by `008_major_subjects_quiz_bank.sql`, the database holds 10 questions per subject (15 questions each for the 5 Core CS subjects, totaling 345 DB questions); requesting 15 questions for a 10-question subject returns all 10 available questions cleanly without failure.
  - `saveQuizAttempt()` now persists `mode`, resolves `subjectSlug -> UUID`, stores `NULL` for unanswered questions, skips local non-UUID question IDs in `quiz_responses`, surfaces save errors cleanly, and refreshes the Quiz History & Quiz Analytics cards.
- **AI Quiz Generator (`src/services/ai-quiz.js`):**
  - Resolves `subjectSlug -> UUID`, attempts Edge Function `generate-ai-quiz` (currently `404` on live cloud), falls back cleanly to topic-aware question generation, attempts DB insert into `ai_quizzes` / `ai_quiz_questions` (currently `404 PGRST205` until Migration `009` is run), falls back cleanly to `localStorage` with `dbPersisted: false` + `persistenceError` diagnostics so students can still complete quizzes without silent data loss confusion.

---

## 9. Actual Automated and Manual Testing Results

| Check / Flow | Status | Observed Evidence |
|---|---|---|
| Parity & Syntax (`diff -u app.js public/app.js`, `diff -r -u src/ public/src/`, `node --check`) | **PASS** | `0` diffs across mirrored files; `ALL_JS_SYNTAX_OK` across all JS modules. |
| Python Integration & Validation Suite (`python3 tests/run_tests.py`) | **PASS** | `ALL TESTS PASSED SUCCESSFULLY (11/11)` covering structure, migrations, 5 auth HTML pages, validation rules, task/analytics metrics, quiz scoring, hierarchy, 32 subjects / 15 majors / 345 questions, theme toggle, AI quiz checks. |
| Python AI Quiz Suite (`python3 tests/test_ai_quiz.py`) | **PASS** | `ALL AI QUIZ TESTS PASSED!` covering Migration 009 SQL, question validation, scoring, and UI hooks. |
| Vitest Unit & Contract Suite (`npm test`) | **PASS** | `Test Files 5 passed (5)`, `Tests 27 passed (27)` (`auth`, `quiz`, `tasks`, `theme`, and `backend-services.test.js` with mocked Supabase client). |
| Vite Production Bundle (`npm run build`) | **PASS** | `vite v6.4.5` built all 6 HTML entry pages (`index.html`, `auth/login.html`, `signup.html`, `verify.html`, `forgot-password.html`, `reset-password.html`) cleanly in `127ms` into `dist/`. |
| Live Supabase Auth Settings (`GET /auth/v1/settings`) | **PASS (Verified Finding)** | HTTP `200`: `disable_signup: false`, `mailer_autoconfirm: true` (`Confirm email` is OFF), `external.email: true`. |
| Live Supabase Catalog Tables (`GET /rest/v1/*` with publishable key) | **PASS (Verified Counts)** | HTTP `206`: `universities` = `46` rows, `subjects` = `32` rows, `major_subjects` = `128` rows, `quiz_questions` = `345` rows. |
| Live Supabase Private RLS Probe (`GET /rest/v1/*` anonymous) | **PASS** | HTTP `200`, `[]` returned on `profiles`, `student_subjects`, `tasks`, `quiz_attempts`, `quiz_responses`. |
| Live Supabase AI Tables (`ai_quizzes`, `ai_quiz_questions`, `ai_quiz_attempts`) | **BLOCKED (`404 PGRST205`)** | Returns `Could not find the table 'public.ai_quizzes' in the schema cache` — Migration `009` has not been applied in Supabase SQL Editor. |
| Live Edge Function (`POST /functions/v1/generate-ai-quiz`) | **BLOCKED (`404 NOT_FOUND`)** | Returns `{"code":"NOT_FOUND","message":"Requested function was not found"}`. |
| End-to-End Authenticated Browser Flows (Signup -> Email Confirm -> Login -> Onboarding Save -> Task CRUD -> Quiz Submit -> Logout -> Restore & Two-Student RLS Isolation) | **NOT TESTED** | Interactive Playwright/browser tests with live disposable student accounts and Gmail inbox access were not run (`tests/e2e/` is empty, no `service_role` key available to clean up test `auth.users`, and custom SMTP / Migration `009` require Dashboard admin action). |
| Live Password Recovery Gmail OTP Delivery | **BLOCKED / NOT TESTED** | Blocked pending fixing typoed test account (`@gmmail.com` -> `@gmail.com`), configuring Custom SMTP, enabling Recovery template `{{ .Token }}`, and verifying Email Confirm setting in Supabase Dashboard. |

---

## 10. Remaining Bugs and Limitations

1. **Migration `009` & `010` Not Applied Live Yet:** Live Supabase lacks `ai_quizzes`, `ai_quiz_questions`, `ai_quiz_attempts` (`404 PGRST205`) and lacks `Bhutan`, `Maldives`, and `Other / International` rows in `public.universities` until `009_ai_quiz_tables.sql` and `010_complete_universities.sql` are run in SQL Editor.
2. **Edge Function `generate-ai-quiz` Not Deployed:** Live calls hit `404` and degrade to client-side `buildTopicQuestions()` templates.
3. **Quiz Answer Security Architecture Trade-Off:** `quiz_questions.correct_answer` is selected to the browser for instant offline-compatible grading; a hardened future iteration should grade submissions inside an RPC or Edge Function if exam integrity against tech-savvy inspection is required.
4. **Weekly Activity Chart Metric Scope:** The Weekly Activity chart counts tasks *scheduled* by `deadline` across the trailing 7 days rather than completed-at timestamps because `public.tasks` only tracks `created_at` / `updated_at` / `deadline` (no `completed_at` column). The UI label has been corrected to say `scheduled` accurately.
5. **E2E Suite Unpopulated:** `tests/e2e/` is currently empty; unit and static tests verify contracts using mocked Supabase clients and static analysis rather than a live headless Chromium run against `supabase.co`.

---

## 11. Required Supabase Dashboard Actions

1. **Run Pending SQL Migrations in Supabase SQL Editor:**
   - Execute [`supabase/migrations/009_ai_quiz_tables.sql`](../supabase/migrations/009_ai_quiz_tables.sql) (creates `ai_quizzes`, `ai_quiz_questions`, `ai_quiz_attempts` + RLS policies).
   - Execute [`supabase/migrations/010_complete_universities.sql`](../supabase/migrations/010_complete_universities.sql) (seeds `Bhutan`, `Maldives`, `Other / International`, and remaining universities idempotently).
2. **Fix Typoed Registered Test Account (`Authentication -> Users`):**
   - Remove or correct `princekarki127@gmmail.com` so the student re-signs up with valid `princekarki127@gmail.com`.
3. **Configure Custom SMTP (`Project Settings -> Authentication -> SMTP Settings` or `Authentication -> Emails`):**
   - Configure an authenticated sender (e.g., Gmail App Password SMTP or Resend/Brevo) so OTP/confirmation emails bypass Supabase's 2–4/hour shared test cap and reach student Gmail inboxes reliably.
4. **Update Email Templates (`Authentication -> Notifications -> Emails`):**
   - **Reset Password** template must include both `{{ .Token }}` (for the 6-digit OTP code on `reset-password.html`) and `{{ .ConfirmationURL }}` (direct recovery link).
   - **Confirm Signup** template should similarly include `{{ .Token }}` and `{{ .ConfirmationURL }}` if PIN entry on `verify.html` is used.
5. **Verify Email Confirmation & URL Configuration (`Authentication -> Configuration`):**
   - Under **Sign In / Providers -> Email**, confirm **Email OTP length = 6** and toggle **Confirm email** ON once custom SMTP is working.
   - Under **URL Configuration**, set **Site URL** and **Redirect URLs** to include:
     - `https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/**`
     - `http://localhost:3000/**`
6. **Deploy Edge Functions (When Ready):**
   ```bash
   npx supabase functions deploy generate-ai-quiz --project-ref bcwwnjtmrcxggbaallon
   ```
   *(Optional future AI Tutor secret — only after approval: `npx supabase secrets set GEMINI_API_KEY=...`)*

---

## 12. Commands Needed to Run and Verify the Application

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run Vite development server (http://localhost:3000)
npm run dev

# 3. Verify root <-> public mirror parity
diff -u app.js public/app.js && diff -r -u src/ public/src/

# 4. Run Python structural, migration, catalog, and AI quiz tests
python3 tests/run_tests.py
python3 tests/test_ai_quiz.py

# 5. Run Vitest unit & service-contract suite (27 tests)
npm test

# 6. Build production bundle (verifies all 6 HTML entries)
npm run build
```
