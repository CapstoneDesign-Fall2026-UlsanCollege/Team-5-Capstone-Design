-- Migration 006: Row Level Security (RLS) Policies
-- Every private student record is protected. Students cannot access other students' data.

-- ============================================================================
-- PROFILES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Students can read their own profile
DROP POLICY IF EXISTS profiles_select_own ON profiles;
CREATE POLICY profiles_select_own ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Students can update their own profile
DROP POLICY IF EXISTS profiles_update_own ON profiles;
CREATE POLICY profiles_update_own ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Insert handled by the trigger (SECURITY DEFINER), but allow user to insert own
DROP POLICY IF EXISTS profiles_insert_own ON profiles;
CREATE POLICY profiles_insert_own ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- SUBJECTS (readable by all users, since they are public academic catalog data)
-- ============================================================================
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Any authenticated or anonymous user can read subjects catalog
DROP POLICY IF EXISTS subjects_select_authenticated ON subjects;
DROP POLICY IF EXISTS subjects_select_all ON subjects;
CREATE POLICY subjects_select_all ON subjects
    FOR SELECT USING (true);

-- ============================================================================
-- STUDENT_SUBJECTS
-- ============================================================================
ALTER TABLE student_subjects ENABLE ROW LEVEL SECURITY;

-- Students can view their own enrollments
DROP POLICY IF EXISTS student_subjects_select_own ON student_subjects;
CREATE POLICY student_subjects_select_own ON student_subjects
    FOR SELECT USING (auth.uid() = student_id);

-- Students can enroll themselves
DROP POLICY IF EXISTS student_subjects_insert_own ON student_subjects;
CREATE POLICY student_subjects_insert_own ON student_subjects
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can update their enrollments (required for upsert operations)
DROP POLICY IF EXISTS student_subjects_update_own ON student_subjects;
CREATE POLICY student_subjects_update_own ON student_subjects
    FOR UPDATE USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- Students can unenroll themselves
DROP POLICY IF EXISTS student_subjects_delete_own ON student_subjects;
CREATE POLICY student_subjects_delete_own ON student_subjects
    FOR DELETE USING (auth.uid() = student_id);

-- ============================================================================
-- TASKS
-- ============================================================================
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Students can only see their own tasks
DROP POLICY IF EXISTS tasks_select_own ON tasks;
CREATE POLICY tasks_select_own ON tasks
    FOR SELECT USING (auth.uid() = student_id);

-- Students can create tasks for themselves
DROP POLICY IF EXISTS tasks_insert_own ON tasks;
CREATE POLICY tasks_insert_own ON tasks
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can update their own tasks
DROP POLICY IF EXISTS tasks_update_own ON tasks;
CREATE POLICY tasks_update_own ON tasks
    FOR UPDATE USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- Students can delete their own tasks
DROP POLICY IF EXISTS tasks_delete_own ON tasks;
CREATE POLICY tasks_delete_own ON tasks
    FOR DELETE USING (auth.uid() = student_id);

-- ============================================================================
-- QUIZ_QUESTIONS (readable by all authenticated and anonymous users)
-- ============================================================================
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Any user can read quiz questions for practice
DROP POLICY IF EXISTS quiz_questions_select_authenticated ON quiz_questions;
DROP POLICY IF EXISTS quiz_questions_select_all ON quiz_questions;
CREATE POLICY quiz_questions_select_all ON quiz_questions
    FOR SELECT USING (true);

-- ============================================================================
-- QUIZ_ATTEMPTS
-- ============================================================================
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Students can view their own attempts
DROP POLICY IF EXISTS quiz_attempts_select_own ON quiz_attempts;
CREATE POLICY quiz_attempts_select_own ON quiz_attempts
    FOR SELECT USING (auth.uid() = student_id);

-- Students can create their own attempts
DROP POLICY IF EXISTS quiz_attempts_insert_own ON quiz_attempts;
CREATE POLICY quiz_attempts_insert_own ON quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ============================================================================
-- QUIZ_RESPONSES
-- ============================================================================
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Students can view responses for their own attempts
DROP POLICY IF EXISTS quiz_responses_select_own ON quiz_responses;
CREATE POLICY quiz_responses_select_own ON quiz_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM quiz_attempts
            WHERE quiz_attempts.id = quiz_responses.attempt_id
            AND quiz_attempts.student_id = auth.uid()
        )
    );

-- Students can insert responses for their own attempts
DROP POLICY IF EXISTS quiz_responses_insert_own ON quiz_responses;
CREATE POLICY quiz_responses_insert_own ON quiz_responses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM quiz_attempts
            WHERE quiz_attempts.id = quiz_responses.attempt_id
            AND quiz_attempts.student_id = auth.uid()
        )
    );

