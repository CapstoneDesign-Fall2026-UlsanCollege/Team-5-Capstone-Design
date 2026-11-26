-- 014_task_description_down.sql
-- Non-destructive column rollback for optional task descriptions.

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'tasks_description_length_check'
          AND conrelid = 'public.tasks'::regclass
    ) THEN
        ALTER TABLE public.tasks
            DROP CONSTRAINT tasks_description_length_check;
    END IF;
END
$$;

ALTER TABLE public.tasks
    DROP COLUMN IF EXISTS description;
