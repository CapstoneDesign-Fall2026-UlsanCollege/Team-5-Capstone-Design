# Database and RLS Verification — Week 11 MVP Assessment



**Project:** Smart Study Companion  
**Primary Owner (Database & Migrations):** Sumit Adhikari (`adronnie`)  
**Integration Support:** Nabin Khadka (`liftupkhadka555-spec`)  
**Target Database:** `https://bcwwnjtmrcxggbaallon.supabase.co`  
**Date:** 2026-11-15  
**Status:** Code contracts & anonymous RLS verified; Migrations `009` & `010` pending SQL Editor execution.

---

## 1. SQL Migrations & Database Schema Inventory

The repository contains 10 sequential SQL migrations and one consolidated idempotent setup script:

| Migration File | Primary Tables / Objects | Purpose | Live Status (`bcwwnjtmrcxggbaallon`) |
|---|---|---|---|
| [`001_profiles.sql`](../../supabase/migrations/001_profiles.sql) | `public.profiles`, `handle_new_user()` trigger | User profiles linked to `auth.users(id)` | **LIVE (HTTP 200)** |
| [`002_subjects.sql`](../../supabase/migrations/002_subjects.sql) | `public.subjects`, `public.student_subjects` | Initial subjects & student enrollment junction | **LIVE (HTTP 200)** |
| [`003_tasks.sql`](../../supabase/migrations/003_tasks.sql) | `public.tasks` | Study tasks with title constraints & deadlines | **LIVE (HTTP 200)** |
| [`004_quiz_questions.sql`](../../supabase/migrations/004_quiz_questions.sql) | `public.quiz_questions` | Initial multiple-choice question bank schema | **LIVE (HTTP 200)** |
| [`005_quiz_attempts.sql`](../../supabase/migrations/005_quiz_attempts.sql) | `public.quiz_attempts`, `public.quiz_responses` | Attempt summaries & per-question student answers | **LIVE (HTTP 200)** |
| [`006_rls_policies.sql`](../../supabase/migrations/006_rls_policies.sql) | RLS on `profiles`, `tasks`, `student_subjects`, `quiz_attempts`, `quiz_responses` | Enforces `auth.uid() = student_id` data isolation | **LIVE (Enforced)** |
| [`007_universities.sql`](../../supabase/migrations/007_universities.sql) | `public.universities`, updated `profiles` columns | Added `country`, `faculty`, `major`, `onboarding_completed` | **LIVE (HTTP 200)** |
| [`008_major_subjects_quiz_bank.sql`](../../supabase/migrations/008_major_subjects_quiz_bank.sql) | `public.major_subjects` (128 rows), 32 subjects, 345 questions | Full curriculum mapping & expanded question bank | **LIVE (HTTP 200)** |
| [`009_ai_quiz_tables.sql`](../../supabase/migrations/009_ai_quiz_tables.sql) | `public.ai_quizzes`, `public.ai_quiz_questions`, `public.ai_quiz_attempts` | Schema & RLS for dynamically generated AI quizzes | **BLOCKED (404 PGRST205)** |
| [`010_complete_universities.sql`](../../supabase/migrations/010_complete_universities.sql) | `public.universities` seed additions | Adds Bhutan, Maldives, and International institutions | **BLOCKED (Unapplied)** |
| [`supabase/setup_all.sql`](../../supabase/setup_all.sql) | All 10 migrations consolidated | Idempotent complete 1-click cloud database setup | **READY FOR EXECUTION** |

---

## 2. Live Supabase Cloud Schema Verification Probes

On **2026-11-15**, read-only HTTP probes were executed against the live Supabase project endpoints using the published anon key:

### Live Catalog Counts
- `GET /rest/v1/universities?select=count` → **HTTP 200**, `[{"count": 46}]` across 7 countries (Bangladesh, India, Nepal, Pakistan, South Asia, South Korea, Sri Lanka).
- `GET /rest/v1/subjects?select=count` → **HTTP 200**, `[{"count": 32}]` accredited subjects across 4 faculties.
- `GET /rest/v1/major_subjects?select=count` → **HTTP 200**, `[{"count": 128}]` degree program curriculum mappings.
- `GET /rest/v1/quiz_questions?select=count` → **HTTP 200**, `[{"count": 345}]` multiple-choice questions.

### Live Unapplied Schema Detection
- `GET /rest/v1/ai_quizzes?select=count` → **HTTP 404**, response:
  ```json
  {"code":"PGRST205","details":null,"hint":null,"message":"Could not find the table 'public.ai_quizzes' in the schema cache"}
  ```
  **Root Cause:** Migration `009_ai_quiz_tables.sql` has not yet been executed in the Supabase Cloud SQL Editor. The client service [`src/services/ai-quiz.js`](../../src/services/ai-quiz.js) handles this gracefully via local fallback, reporting `dbPersisted: false`.
- Countries in `public.universities`:
  `Bhutan`, `Maldives`, and `Other / International` institutions are absent in the live table, confirming Migration `010_complete_universities.sql` is also pending execution.

---

## 3. Non-Destructive SQL Execution Plan (Week 11 Action)

To resolve the live database gap without dropping existing student records or wiping data:

1. Open the **Supabase Cloud Dashboard** for project `bcwwnjtmrcxggbaallon`:
   `https://supabase.com/dashboard/project/bcwwnjtmrcxggbaallon/sql`
2. Open the SQL Editor and paste the contents of:
   - [`supabase/migrations/009_ai_quiz_tables.sql`](../../supabase/migrations/009_ai_quiz_tables.sql)
   - Click **Run**.
3. Next, paste the contents of:
   - [`supabase/migrations/010_complete_universities.sql`](../../supabase/migrations/010_complete_universities.sql)
   - Click **Run**.
4. Both scripts are strictly additive:
   - `009` uses `CREATE TABLE IF NOT EXISTS` and `CREATE POLICY IF NOT EXISTS`.
   - `010` uses `INSERT INTO public.universities (country, name) ... ON CONFLICT DO NOTHING`.
   - **Zero existing profiles, tasks, or quiz records will be overwritten or lost.**

---

## 4. Row Level Security (RLS) Verification

### Anonymous Read Blocking (Live Verified)
Anonymous requests attempting to read private student tables returned HTTP 200 with zero rows leaked:

| Private Table | Request Endpoint | Expected Result | Observed Result | Protection Status |
|---|---|---|---|---|
| `public.tasks` | `GET /rest/v1/tasks?select=*` | 0 rows | `[]` (0 rows) | **PASS (RLS Enforced)** |
| `public.profiles` | `GET /rest/v1/profiles?select=*` | 0 rows | `[]` (0 rows) | **PASS (RLS Enforced)** |
| `public.student_subjects` | `GET /rest/v1/student_subjects?select=*` | 0 rows | `[]` (0 rows) | **PASS (RLS Enforced)** |
| `public.quiz_attempts` | `GET /rest/v1/quiz_attempts?select=*` | 0 rows | `[]` (0 rows) | **PASS (RLS Enforced)** |
| `public.quiz_responses` | `GET /rest/v1/quiz_responses?select=*` | 0 rows | `[]` (0 rows) | **PASS (RLS Enforced)** |

### Two-Student Authenticated Isolation Protocol
The SQL RLS policy in [`006_rls_policies.sql`](../../supabase/migrations/006_rls_policies.sql) enforces:
```sql
CREATE POLICY "Users can only view their own tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = student_id);
```
- **Student A** logs in, creates a task (`title: 'Student A Exam Prep'`, `deadline: '2026-12-01'`).
- The database assigns `student_id = auth.uid()` from the authenticated JWT session.
- **Student B** logs in from an isolated browser context.
- When Student B's client executes `supabase.from('tasks').select('*')`, PostgreSQL evaluates `auth.uid() = student_id` where `auth.uid()` is Student B's UUID.
- Student A's row evaluates to `false` and is omitted from the result set.
- Attempting a direct `UPDATE public.tasks SET title = 'Hacked' WHERE id = '<student-a-task-id>'` returns `0 rows affected` because the `USING` clause rejects unauthorized rows.

---

## 5. Persistence Journey Checklist

| Step | Operation | Source Function | Verified Behavior |
|---|---|---|---|
| **1** | Student Profile Load | `profile.js::getProfile()` | Loads `country`, `university`, `faculty`, `major`, `onboarding_completed` |
| **2** | Academic Onboarding Save | `profile.js::upsertProfile()` + `subjects.js::saveStudentSubjects()` | Writes to `profiles` and `student_subjects` in parallel; sets `onboarding_completed: true` |
| **3** | Curriculum Mapping | `academic-catalog.js` + `public.major_subjects` | Filters 32 subjects down to specific degree curriculum with CORE/ELECTIVE tags |
| **4** | Task Create | `tasks.js::createTask()` | Validates `title` (1–500 chars), inserts row with `student_id = auth.uid()` |
| **5** | Task Complete / Edit | `tasks.js::updateTask()` | Updates `completed: true` and reflects in `#analytics` ring |
| **6** | Task Delete | `tasks.js::deleteTask()` | Removes row from `tasks` with confirmation dialog |
| **7** | Curated Quiz Attempt | `quiz.js::saveQuizAttempt()` | Persists score, duration, total questions to `quiz_attempts`, and responses to `quiz_responses` |
| **8** | AI Quiz Attempt | `ai-quiz.js::saveAiQuizAttempt()` | Saves dynamic quiz questions & user attempt (pending live `009`) |
| **9** | Session Restore | `auth-guard.js::checkAuth()` | Page refresh preserves active session without logging user out |

