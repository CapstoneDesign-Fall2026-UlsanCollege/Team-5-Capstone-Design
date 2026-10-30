-- Migration 003: Tasks table
-- Study tasks with deadlines and completion tracking

CREATE TABLE IF NOT EXISTS tasks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id  UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title       TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 500),
    deadline    TIMESTAMPTZ NOT NULL,
    completed   BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tasks_student ON tasks(student_id);
CREATE INDEX IF NOT EXISTS idx_tasks_subject ON tasks(subject_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(student_id, deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(student_id, completed);

-- Auto-update updated_at
CREATE TRIGGER tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

COMMENT ON TABLE tasks IS 'Student study tasks with deadlines';

