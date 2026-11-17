# Quiz Repetition, Subject Isolation & Difficulty Fix Report

**Branch:** `fix/quiz-subject-difficulty-repetition` (branched from `main` @ `2390f2b`)  
**Date:** November 17, 2026  
**Status:** Implemented & locally verified — **not merged to `main`, Migration `011` not applied to live Supabase, not deployed to Vercel.**

---

## 1. Root Cause Analysis

1. **Question repetition across attempts:** `getQuizQuestions()` in `src/services/quiz.js` only shuffled the subject pool with Fisher–Yates and sliced `0..limit`. Because 27 subjects had 10 questions and 5 CS subjects had 15 questions, a 15-question Standard Quiz returned 100% of the pool on every attempt. No per-student seen-question exclusion existed.
2. **Difficulty not applied:** `quiz_questions` had no `difficulty` column, Standard/Rapid mode had no difficulty selector, and `buildTopicQuestions()` in `src/services/ai-quiz.js` only swapped words (`fundamental` / `standard` / `advanced`) into identical generic templates.
3. **Misleading generic AI fallback:** When the `generate-ai-quiz` Edge Function was unavailable (e.g., not deployed or `GEMINI_API_KEY` missing), `ai-quiz.js` silently generated 10 generic software-architecture templates substituting `subjectName` and `topic` and presented them as AI-generated questions.
4. **Stale subject selection & async race risk:** `fillQuizSubjects()` preserved `prevSelected` whenever it existed in the full 32-subject dropdown (even after changing major/university), `quiz.questions` was not cleared on setup changes, and `startQuiz()` / `startAiQuiz()` lacked a request sequence guard.

---

## 2. Coverage by Subject & Difficulty (`QUIZ_BANK`)

- **Total curated questions:** 379 across 32 subjects (0 duplicates).
- **Difficulty-classified subjects (validated):**
  - `programming`: 25 total (`easy`: 14, `medium`: 6, `hard`: 5)
  - `data-structures`: 23 total (`easy`: 6, `medium`: 12, `hard`: 5)
  - `databases`: 23 total (`easy`: 9, `medium`: 10, `hard`: 4)
  - `networks`: 23 total (`easy`: 10, `medium`: 9, `hard`: 4)
- **Remaining 28 subjects:** 10–15 validated questions each with `difficulty: null` (unclassified). Selecting `All Difficulties` loads all eligible questions; selecting `Easy`/`Medium`/`Hard` for an unclassified subject returns 0 questions with an explicit message rather than mislabeling or downgrading.

---

## 3. Database Changes (Proposed Only)

- Migration: [`supabase/migrations/011_quiz_difficulty_and_repetition.sql`](../../supabase/migrations/011_quiz_difficulty_and_repetition.sql) (mirrored to `Backend/supabase/migrations/`).
  - Adds nullable `difficulty`, `explanation`, and `fingerprint` columns to `quiz_questions`.
  - Adds `difficulty` column (`default 'all'`) to `quiz_attempts`.
  - Adds indexes for `(subject_id, difficulty)`, `(subject_id, fingerprint)`, `quiz_responses(question_id)`, and `quiz_attempts(student_id, subject_id, completed_at DESC)`.
- Rollback: [`supabase/rollbacks/011_quiz_difficulty_and_repetition_down.sql`](../../supabase/rollbacks/011_quiz_difficulty_and_repetition_down.sql).
- **Note:** If another `011_*` migration is merged first, renumber sequentially before executing on Supabase.

---

## 4. Local Test Evidence (Nov 17, 2026)

| Suite | Result | Scope |
|---|---|---|
| Vitest (`npm test`) | **43 / 43 PASS** (7 files) | Existing 31 tests + 12 new tests in `tests/unit/quiz-engine.test.js` |
| Python system harness (`tests/run_tests.py`) | **11 / 11 PASS** | Structure, migrations, catalog, auth, tasks, quiz, theme |
| Python AI quiz suite (`tests/test_ai_quiz.py`) | **4 / 4 PASS** | Schema, validation, scoring, UI |
| Vite production build (`npm run build`) | **PASS** (121ms) | 6 HTML entry points bundled cleanly |

*Live Supabase multi-account cloud verification and Edge Function Gemini live calls were not executed in this local session.*
