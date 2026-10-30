-- Migration 006: Row Level Security (RLS) Policies
-- Every private student record is protected. Students cannot access other students' data.

-- ============================================================================
-- PROFILES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Students can read their own profile
CREATE POLICY profiles_select_own ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Students can update their own profile
CREATE POLICY profiles_update_own ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Insert handled by the trigger (SECURITY DEFINER), but allow user to insert own
CREATE POLICY profiles_insert_own ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- SUBJECTS (readable by all authenticated users, since they are catalog data)
-- ============================================================================
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read subjects
CREATE POLICY subjects_select_authenticated ON subjects
    FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- STUDENT_SUBJECTS
-- ============================================================================
ALTER TABLE student_subjects ENABLE ROW LEVEL SECURITY;

-- Students can view their own enrollments
CREATE POLICY student_subjects_select_own ON student_subjects
    FOR SELECT USING (auth.uid() = student_id);

-- Students can enroll themselves
CREATE POLICY student_subjects_insert_own ON student_subjects
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can unenroll themselves
CREATE POLICY student_subjects_delete_own ON student_subjects
    FOR DELETE USING (auth.uid() = student_id);

-- ============================================================================
-- TASKS
-- ============================================================================
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Students can only see their own tasks
CREATE POLICY tasks_select_own ON tasks
    FOR SELECT USING (auth.uid() = student_id);

-- Students can create tasks for themselves
CREATE POLICY tasks_insert_own ON tasks
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can update their own tasks
CREATE POLICY tasks_update_own ON tasks
    FOR UPDATE USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- Students can delete their own tasks
CREATE POLICY tasks_delete_own ON tasks
    FOR DELETE USING (auth.uid() = student_id);

-- ============================================================================
-- QUIZ_QUESTIONS (readable by all authenticated users)
-- ============================================================================
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read quiz questions
-- NOTE: correct_answer is exposed here for client-side scoring.
-- If future quiz types need secure scoring, use an Edge Function instead.
CREATE POLICY quiz_questions_select_authenticated ON quiz_questions
    FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- QUIZ_ATTEMPTS
-- ============================================================================
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Students can view their own attempts
CREATE POLICY quiz_attempts_select_own ON quiz_attempts
    FOR SELECT USING (auth.uid() = student_id);

-- Students can create their own attempts
CREATE POLICY quiz_attempts_insert_own ON quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ============================================================================
-- QUIZ_RESPONSES
-- ============================================================================
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Students can view responses for their own attempts
CREATE POLICY quiz_responses_select_own ON quiz_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM quiz_attempts
            WHERE quiz_attempts.id = quiz_responses.attempt_id
            AND quiz_attempts.student_id = auth.uid()
        )
    );

-- Students can insert responses for their own attempts
CREATE POLICY quiz_responses_insert_own ON quiz_responses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM quiz_attempts
            WHERE quiz_attempts.id = quiz_responses.attempt_id
            AND quiz_attempts.student_id = auth.uid()
        )
    );

