-- ============================================================================
-- Migration 009: AI Quiz Generator Schema & Row Level Security
-- ============================================================================
-- Description: Adds tables for dynamic, topic-specific AI-generated quizzes,
--              structured questions with answer explanations, and student attempt
--              tracking with Row Level Security (RLS) policies.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. AI QUIZZES (Catalog of generated quiz sessions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_quizzes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id      UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    topic           VARCHAR(255) NOT NULL,
    difficulty      VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    question_count  INT NOT NULL DEFAULT 5 CHECK (question_count BETWEEN 1 AND 50),
    created_by      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status          VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('generating', 'completed', 'failed')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE ai_quizzes IS 'Metadata and configuration for topic-specific AI-generated quizzes';
COMMENT ON COLUMN ai_quizzes.subject_id IS 'Reference to the academic subject';
COMMENT ON COLUMN ai_quizzes.topic IS 'Specific topic prompt requested by the student';
COMMENT ON COLUMN ai_quizzes.difficulty IS 'Difficulty tier: easy, medium, or hard';
COMMENT ON COLUMN ai_quizzes.status IS 'Lifecycle state: generating, completed, or failed';

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_ai_quizzes_subject ON ai_quizzes(subject_id);
CREATE INDEX IF NOT EXISTS idx_ai_quizzes_created_by ON ai_quizzes(created_by);
CREATE INDEX IF NOT EXISTS idx_ai_quizzes_created_at ON ai_quizzes(created_at DESC);

-- ----------------------------------------------------------------------------
-- 2. AI QUIZ QUESTIONS (Structured questions with options & explanations)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_quiz_questions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ai_quiz_id      UUID NOT NULL REFERENCES ai_quizzes(id) ON DELETE CASCADE,
    question_text   TEXT NOT NULL,
    options         JSONB NOT NULL,
    correct_answer  INT NOT NULL CHECK (correct_answer BETWEEN 0 AND 3),
    explanation     TEXT,
    question_order  INT NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE ai_quiz_questions IS 'Individual AI-generated multiple-choice questions belonging to an AI quiz';
COMMENT ON COLUMN ai_quiz_questions.options IS 'JSON array of 4 multiple-choice string choices';
COMMENT ON COLUMN ai_quiz_questions.correct_answer IS '0-based index (0..3) of the correct answer choice';
COMMENT ON COLUMN ai_quiz_questions.explanation IS 'Pedagogical explanation of why the correct option is right';

-- Indexes for fast retrieval
CREATE INDEX IF NOT EXISTS idx_ai_quiz_questions_quiz ON ai_quiz_questions(ai_quiz_id);
CREATE INDEX IF NOT EXISTS idx_ai_quiz_questions_order ON ai_quiz_questions(ai_quiz_id, question_order);

-- ----------------------------------------------------------------------------
-- 3. AI QUIZ ATTEMPTS (Student attempt sessions & submissions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_quiz_attempts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ai_quiz_id          UUID NOT NULL REFERENCES ai_quizzes(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    submitted_answers   JSONB NOT NULL DEFAULT '[]'::jsonb,
    score               INT NOT NULL DEFAULT 0,
    total_questions     INT NOT NULL,
    percentage          INT GENERATED ALWAYS AS (
                            CASE WHEN total_questions > 0 
                            THEN ROUND((score::numeric / total_questions::numeric) * 100) 
                            ELSE 0 END
                        ) STORED,
    time_spent_seconds  INT,
    started_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE ai_quiz_attempts IS 'Student submission records, scores, and answer histories for AI quizzes';
COMMENT ON COLUMN ai_quiz_attempts.submitted_answers IS 'JSON array of student answers: [{ question_id, selected_answer, is_correct }]';

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_quiz_attempts_user ON ai_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_quiz_attempts_quiz ON ai_quiz_attempts(ai_quiz_id);
CREATE INDEX IF NOT EXISTS idx_ai_quiz_attempts_completed ON ai_quiz_attempts(completed_at DESC);

-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE ai_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- AI_QUIZZES POLICIES
DROP POLICY IF EXISTS ai_quizzes_select_own ON ai_quizzes;
CREATE POLICY ai_quizzes_select_own ON ai_quizzes
    FOR SELECT USING (auth.uid() = created_by);

DROP POLICY IF EXISTS ai_quizzes_insert_own ON ai_quizzes;
CREATE POLICY ai_quizzes_insert_own ON ai_quizzes
    FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS ai_quizzes_update_own ON ai_quizzes;
CREATE POLICY ai_quizzes_update_own ON ai_quizzes
    FOR UPDATE USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS ai_quizzes_delete_own ON ai_quizzes;
CREATE POLICY ai_quizzes_delete_own ON ai_quizzes
    FOR DELETE USING (auth.uid() = created_by);

-- AI_QUIZ_QUESTIONS POLICIES
-- Questions can be viewed if user created the quiz
DROP POLICY IF EXISTS ai_quiz_questions_select ON ai_quiz_questions;
CREATE POLICY ai_quiz_questions_select ON ai_quiz_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM ai_quizzes
            WHERE ai_quizzes.id = ai_quiz_questions.ai_quiz_id
              AND ai_quizzes.created_by = auth.uid()
        )
    );

DROP POLICY IF EXISTS ai_quiz_questions_insert ON ai_quiz_questions;
CREATE POLICY ai_quiz_questions_insert ON ai_quiz_questions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM ai_quizzes
            WHERE ai_quizzes.id = ai_quiz_questions.ai_quiz_id
              AND ai_quizzes.created_by = auth.uid()
        )
    );

-- AI_QUIZ_ATTEMPTS POLICIES
DROP POLICY IF EXISTS ai_quiz_attempts_select_own ON ai_quiz_attempts;
CREATE POLICY ai_quiz_attempts_select_own ON ai_quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS ai_quiz_attempts_insert_own ON ai_quiz_attempts;
CREATE POLICY ai_quiz_attempts_insert_own ON ai_quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS ai_quiz_attempts_update_own ON ai_quiz_attempts;
CREATE POLICY ai_quiz_attempts_update_own ON ai_quiz_attempts
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

