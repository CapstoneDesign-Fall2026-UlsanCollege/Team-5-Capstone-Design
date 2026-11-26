-- 014_task_description.sql
-- Adds optional multiline Task Description / Details support (up to 1000 chars)
-- to public.tasks while keeping all existing rows and RLS policies intact.

ALTER TABLE public.tasks
    ADD COLUMN IF NOT EXISTS description TEXT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'tasks_description_length_check'
          AND conrelid = 'public.tasks'::regclass
    ) THEN
        ALTER TABLE public.tasks
            ADD CONSTRAINT tasks_description_length_check
            CHECK (description IS NULL OR char_length(description) <= 1000);
    END IF;
END
$$;

COMMENT ON COLUMN public.tasks.description IS
    'Optional detailed study instructions, notes, or assignment requirements (max 1000 characters).';
