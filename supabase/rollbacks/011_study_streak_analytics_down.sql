-- Rollback for Migration 011 (Study Analytics 2.0). NOT part of the auto-run migrations folder.
-- Run ONLY after approval, ideally after exporting the three tables below.
-- This removes only objects created by 011. It does not touch tasks data or any earlier migration.
-- WARNING: dropping the tables permanently deletes streak history, goals and earned badges.

DROP TRIGGER IF EXISTS tasks_log_completion ON public.tasks;

DROP FUNCTION IF EXISTS public.get_study_summary();
DROP FUNCTION IF EXISTS public.set_daily_study_goal(INTEGER);
DROP FUNCTION IF EXISTS public.sync_study_timezone(TEXT);
DROP FUNCTION IF EXISTS public.log_task_completion();
DROP FUNCTION IF EXISTS public.record_study_event(UUID, UUID);
DROP FUNCTION IF EXISTS public.award_study_achievements(UUID);
DROP FUNCTION IF EXISTS public.study_streak_compute(UUID, DATE);

DROP TABLE IF EXISTS public.student_achievements;
DROP TABLE IF EXISTS public.study_activity_events;
DROP TABLE IF EXISTS public.study_preferences;
