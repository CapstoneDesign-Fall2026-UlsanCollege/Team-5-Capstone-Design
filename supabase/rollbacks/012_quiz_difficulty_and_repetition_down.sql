-- Rollback for Migration 011 (Quiz Difficulty, Explanations, and Repetition Prevention)
-- Drops only the additive indexes and columns added by 011. Existing rows are preserved.

DROP INDEX IF EXISTS public.idx_quiz_attempts_student_subject_recent;
DROP INDEX IF EXISTS public.idx_quiz_responses_question;
DROP INDEX IF EXISTS public.idx_quiz_questions_fingerprint;
DROP INDEX IF EXISTS public.idx_quiz_questions_subject_difficulty;

ALTER TABLE public.quiz_attempts
    DROP COLUMN IF EXISTS difficulty;

ALTER TABLE public.quiz_questions
    DROP COLUMN IF EXISTS fingerprint,
    DROP COLUMN IF EXISTS explanation,
    DROP COLUMN IF EXISTS difficulty;
