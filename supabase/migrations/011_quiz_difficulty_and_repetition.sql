-- Migration 011: Quiz Difficulty, Explanations, and Repetition Prevention
-- STATUS: PROPOSED (branch fix/quiz-subject-difficulty-repetition). NOT applied to live Supabase.
--         If another migration using 011 is merged first, renumber sequentially before applying.
--         Rollback: supabase/rollbacks/011_quiz_difficulty_and_repetition_down.sql
--
-- Additive only: preserves all existing quiz_questions, quiz_attempts, quiz_responses,
-- ai_quizzes, ai_quiz_questions, ai_quiz_attempts rows and all existing RLS policies.

-- 1. Add optional difficulty, explanation, and normalized fingerprint to curated quiz_questions.
--    Existing rows remain NULL (unclassified) until academically validated; never auto-labeled Hard.
ALTER TABLE public.quiz_questions
    ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    ADD COLUMN IF NOT EXISTS explanation TEXT,
    ADD COLUMN IF NOT EXISTS fingerprint TEXT;

CREATE INDEX IF NOT EXISTS idx_quiz_questions_subject_difficulty
    ON public.quiz_questions(subject_id, difficulty);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_fingerprint
    ON public.quiz_questions(subject_id, fingerprint)
    WHERE fingerprint IS NOT NULL;

COMMENT ON COLUMN public.quiz_questions.difficulty IS 'Validated academic difficulty: easy, medium, hard, or NULL if unclassified';
COMMENT ON COLUMN public.quiz_questions.explanation IS 'Optional pedagogical explanation shown during answer review';
COMMENT ON COLUMN public.quiz_questions.fingerprint IS 'Normalized lowercase text fingerprint for duplicate detection';

-- 2. Record selected difficulty on quiz_attempts for accurate history & analytics.
ALTER TABLE public.quiz_attempts
    ADD COLUMN IF NOT EXISTS difficulty TEXT NOT NULL DEFAULT 'all'
    CHECK (difficulty IN ('all', 'easy', 'medium', 'hard'));

-- 3. Speed up per-student recent-question lookups via quiz_responses + quiz_attempts.
CREATE INDEX IF NOT EXISTS idx_quiz_responses_question
    ON public.quiz_responses(question_id);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student_subject_recent
    ON public.quiz_attempts(student_id, subject_id, completed_at DESC);
