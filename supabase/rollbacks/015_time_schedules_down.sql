-- 015_time_schedules_down.sql
-- Removes Manual Time Schedule tables, indexes, triggers, policies, and helper function.

DROP TABLE IF EXISTS public.study_schedule_exceptions CASCADE;
DROP TABLE IF EXISTS public.study_schedules CASCADE;
DROP FUNCTION IF EXISTS public.can_assign_exception_subject(UUID, UUID, UUID);
DROP FUNCTION IF EXISTS public.can_assign_schedule_subject(UUID, UUID, UUID);
