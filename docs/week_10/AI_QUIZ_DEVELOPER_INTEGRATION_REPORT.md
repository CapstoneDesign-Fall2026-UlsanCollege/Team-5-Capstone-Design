# AI Quiz Generator & Database Integration — Full-Stack Developer Report

**Project:** Smart Study Companion  
**Team:** Team 5 — Capstone Design, Fall 2026 (Ulsan College)  
**Author:** Nabin Khadka (`@liftupkhadka555-spec`), Full-Stack & Database Lead  
**Perspective:** Senior Software Engineer / Full-Stack Developer  
**Milestone:** Week 10 — Database Integration, AI Quiz Generation & Schema Verification  
**Date:** 2026-11-09  

---

## 1. Developer Executive Summary

As part of our Week 10 development deliverables for **Smart Study Companion**, we have integrated an **AI Quiz Generator** that enables students to generate real-time, topic-tailored multiple-choice questions grounded in their accredited university courses.

Rather than rebuilding our database or duplicating existing tables, we implemented this feature as a clean, modular extension to our existing Supabase PostgreSQL architecture. We applied a strict separation of concerns between faculty-approved static question banks (`quiz_questions`) and dynamic AI-generated quiz sessions (`ai_quizzes`, `ai_quiz_questions`, and `ai_quiz_attempts`).

All 11 automated test groups are passing (`11/11 Passing`), and all database migrations are consolidated into both versioned files and an idempotent, 1-click deployment script.

---

## 2. Architectural Analysis of Existing System

Before writing any new code or migrations, we conducted a comprehensive review of the active codebase:

1. **Database Provider:** Supabase Cloud PostgreSQL hosted on AWS (`bcwwnjtmrcxggbaallon.supabase.co`).
2. **Existing Tables:**
   - `profiles`: Student user metadata linked to `auth.users(id)`.
   - `universities`: 46 accredited institutions across South Korea and South Asia.
   - `subjects`: 32 accredited university subjects across 4 faculties.
   - `major_subjects`: 128 degree curriculum mappings (Core vs. Elective courses).
   - `student_subjects`: Student-to-subject enrollments.
   - `tasks`: Student study tasks and deadlines.
   - `quiz_questions`: 345 verified faculty multiple-choice questions.
   - `quiz_attempts` & `quiz_responses`: Attempt tracking for Standard and Rapid quizzes.
3. **Authentication Provider:** Supabase Auth (JWT bearer tokens, session persistence, OTP recovery).
4. **Existing Quiz Modes:**
   - **Standard Quiz:** 15 questions, untimed, drawing from static faculty bank.
   - **Rapid Quiz:** 10 questions, 30-second rapid timer.
5. **Architectural Gap Identified:** The existing quiz system only permitted practicing predetermined catalog subjects with pre-seeded questions. There was no mechanism for a student to test their knowledge on a specific concept (e.g., *"AVL Trees vs. Red-Black Trees"* or *"Keynesian vs. Classical Economics"*) with variable difficulty tiers.

---

## 3. Database Engineering: Schema Migration 009

We authored [`supabase/migrations/009_ai_quiz_tables.sql`](../../supabase/migrations/009_ai_quiz_tables.sql) and appended it into [`supabase/setup_all.sql`](../../supabase/setup_all.sql).

### Normalized Entity Design:

```
[public.profiles] ───(1:N)───► [public.ai_quizzes] ───(1:N)───► [public.ai_quiz_questions]
        │                              │
        │                              ▼ (1:N)
        └──────────────(1:N)───► [public.ai_quiz_attempts]
```

### Table Specifications:

#### 1. `public.ai_quizzes`
- `id` (UUID PK, default `gen_random_uuid()`)
- `subject_id` (UUID FK $\rightarrow$ `public.subjects.id` ON DELETE CASCADE)
- `topic` (`VARCHAR(255)` NOT NULL)
- `difficulty` (`VARCHAR(20)` CHECK `difficulty IN ('easy', 'medium', 'hard')`)
- `question_count` (`INT` CHECK `question_count BETWEEN 1 AND 50`)
- `created_by` (UUID FK $\rightarrow$ `public.profiles.id` ON DELETE CASCADE)
- `status` (`VARCHAR(50)` CHECK `status IN ('generating', 'completed', 'failed')`)
- `created_at` (`TIMESTAMPTZ` DEFAULT `now()`)

#### 2. `public.ai_quiz_questions`
- `id` (UUID PK, default `gen_random_uuid()`)
- `ai_quiz_id` (UUID FK $\rightarrow$ `public.ai_quizzes.id` ON DELETE CASCADE)
- `question_text` (`TEXT` NOT NULL)
- `options` (`JSONB` NOT NULL — validated array of 4 choices)
- `correct_answer` (`INT` CHECK `correct_answer BETWEEN 0 AND 3`)
- `explanation` (`TEXT` — pedagogical rationale)
- `question_order` (`INT` DEFAULT 1)

#### 3. `public.ai_quiz_attempts`
- `id` (UUID PK, default `gen_random_uuid()`)
- `ai_quiz_id` (UUID FK $\rightarrow$ `public.ai_quizzes.id` ON DELETE CASCADE)
- `user_id` (UUID FK $\rightarrow$ `public.profiles.id` ON DELETE CASCADE)
- `submitted_answers` (`JSONB` — array of response items)
- `score` (`INT` NOT NULL DEFAULT 0)
- `total_questions` (`INT` NOT NULL)
- `percentage` (`INT GENERATED ALWAYS AS (ROUND((score / total_questions) * 100)) STORED`)
- `time_spent_seconds` (`INT` NULL)
- `completed_at` (`TIMESTAMPTZ` DEFAULT `now()`)

### Row Level Security (RLS) Implementation:
- Enabled RLS on all 3 tables (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
- `ai_quizzes`: Policies enforce `auth.uid() = created_by` for SELECT, INSERT, UPDATE, DELETE.
- `ai_quiz_questions`: SELECT and INSERT policies enforce that the requesting student owns the parent quiz record (`EXISTS (SELECT 1 FROM ai_quizzes WHERE ... AND created_by = auth.uid())`).
- `ai_quiz_attempts`: Policies enforce `auth.uid() = user_id`.

---

## 4. Backend & API Service Design

### A. Supabase Edge Function: `generate-ai-quiz`
Location: [`supabase/functions/generate-ai-quiz/index.ts`](../../supabase/functions/generate-ai-quiz/index.ts)
- **Security:** Requires `Authorization: Bearer <jwt>`. Validates student session via `supabase.auth.getUser()`.
- **Server-Side Secrets:** Uses `Deno.env.get("GEMINI_API_KEY")`. No API keys are ever shipped to client JavaScript.
- **Model:** Google Gemini 1.5 Flash (`gemini-1.5-flash:generateContent`).
- **Structured JSON Schema:** Configured with `responseMimeType: "application/json"` to eliminate markdown code fences and guarantee strict JSON parsing.

### B. Client Service & Resilient Generation Engine: `src/services/ai-quiz.js`
Location: [`src/services/ai-quiz.js`](../../src/services/ai-quiz.js) (and synchronized in `public/src/services/ai-quiz.js`)
- **Edge Function Invocation:** Tries invoking the serverless function if deployed.
- **Topic-Aware Academic Fallback:** If the Edge Function is not yet deployed or in local preview mode, the client seamlessly invokes our deterministic academic question generator across all 32 subjects.
- **Question Sanitizer & Validator:** `validateAndSanitizeQuestions()` inspects question stems, guarantees 4 distinct options, verifies index bounds (0..3), and eliminates duplicate questions via hash sets.
- **Attempt Persistence:** `saveAiQuizAttempt()` writes to `public.ai_quiz_attempts` with automatic fallback to `localStorage`.

---

## 5. Frontend UI/UX Integration

Location: [`public/index.html`](../../public/index.html), [`public/app.js`](../../public/app.js)

1. **Non-Destructive UI Tabs:**
   In `#view-quiz`, added a pill tab switcher between **Standard & Rapid Quiz** and **AI Quiz Generator**.
2. **Custom Topic Controls:**
   - Academic Subject Selector (`#quiz-ai-subject`) populated dynamically with enrolled and major curriculum courses.
   - Topic prompt input (`#quiz-ai-topic`).
   - Difficulty selector (`#quiz-ai-difficulty`): Easy, Medium, Hard.
   - Question count selector (`#quiz-ai-count`): 5, 10, 15, 20.
3. **Interactive Play & Explanations:**
   - Reuses the existing accessible quiz player seamlessly.
   - In the review stage, renders pedagogical explanations (`q.explanation`) with custom styling to explain *why* the correct answer is right.

---

## 6. Verification and Test Results

We authored [`tests/test_ai_quiz.py`](../../tests/test_ai_quiz.py) and linked it as Test Group 11 in [`tests/run_tests.py`](../../tests/run_tests.py):

```bash
$ python3 tests/run_tests.py
============================================================
  SMART STUDY COMPANION — AUTOMATED TEST SUITE
============================================================
Testing Project File Structure...
  ✓ All required files and directories present.
Testing Database Schema Migrations...
  ✓ All 9 SQL migrations valid with major_subjects mapping, 345 seeded questions across 32 subjects, AI quiz tables, and RLS.
Testing Authentication HTML Pages...
  ✓ All 5 Auth pages properly structured with required inputs, toggles, and dual OTP/link reset support.
Testing Auth Validation Logic...
  ✓ Email regex and 8+ char / letter / digit password validation pass.
Testing Task Metric & Analytics Calculations...
  ✓ Task metrics and analytics logic pass (50% completion, 1 overdue, subject breakdown).
Testing Quiz Scoring Logic...
  ✓ Quiz scoring calculation passes (2/3 correct = 67%).
Testing Academic Catalog Hierarchy...
  ✓ Academic catalog hierarchy includes Korea, Nepal, accredited universities, and subjects.
Testing Major-to-Subject Curriculum & Quiz Bank...
  ✓ 32 subjects, 15 majors, full curriculum mapping, and 345 verified quiz questions.
Testing Theme Toggle...
  ✓ Sidebar theme toggle is present, saved, and kept on screen.
Testing Problem 1, 2, and 3 Integration & Bug Fixes...
  ✓ Problem 1 (Signup -> Login), Problem 2 (Cascading Onboarding & Major Curricula), and Problem 3 (Secure 6-digit Recovery) verified.
  ✓ AI Quiz Generator (009 Schema, RLS, Edge/Local Generator, UI Tabs, and Persistence) verified.
============================================================
  ALL TESTS PASSED SUCCESSFULLY (11/11)
============================================================
```

---

## 7. Artifact Deliverables Summary

| Deliverable | Location | Description |
|---|---|---|
| **SQL Migration 009** | [`supabase/migrations/009_ai_quiz_tables.sql`](../../supabase/migrations/009_ai_quiz_tables.sql) | DDL script for 3 AI tables, indexes, constraints, and RLS |
| **1-Click Consolidated SQL** | [`supabase/setup_all.sql`](../../supabase/setup_all.sql) | Complete 9-migration idempotent cloud deployment script |
| **Edge Function** | [`supabase/functions/generate-ai-quiz/index.ts`](../../supabase/functions/generate-ai-quiz/index.ts) | Serverless AI generator with Gemini API & JWT auth |
| **Client AI Quiz Service** | [`src/services/ai-quiz.js`](../../src/services/ai-quiz.js) | Validation, Edge caller, local engine, and attempt storage |
| **AI Quiz Feature Guide** | [`docs/AI_Quiz_Generator.md`](../AI_Quiz_Generator.md) | Comprehensive workflow, settings, and architecture doc |
| **Database Spec** | [`docs/database/AI_Quiz_Database.md`](../database/AI_Quiz_Database.md) | Table schemas, columns, constraints, and RLS guide |
| **Entity Relationship Diagram** | [`docs/database/AI_Quiz_ERD.md`](../database/AI_Quiz_ERD.md) | Mermaid ERD and relational cardinalities |
| **Verification & Testing Report** | [`docs/AI_Quiz_Testing.md`](../AI_Quiz_Testing.md) | 16 test cases, pass/fail matrices, and test suite logs |
| **Schema Diagrams (SVG & PNG)** | [`docs/database/images/`](../database/images/) | High-resolution architectural and table diagrams |
| **Automated Test Suite** | [`tests/test_ai_quiz.py`](../../tests/test_ai_quiz.py) | Unit test suite verifying schema, validation, and scoring |

