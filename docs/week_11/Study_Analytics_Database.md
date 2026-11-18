
-- Migration 011: Study Analytics 2.0
-- Study Streaks, Protection, Daily Goals, Achievements
--
-- STATUS: PROPOSED (feature branch only). NOT applied to any Supabase project.
-- Requires explicit team approval + rollback plan before execution.
-- Rollback: supabase/rollbacks/011_study_streak_analytics_down.sql
--
-- Design summary (see docs/week_11/STUDY_ANALYTICS_2_PROPOSAL.md):
--   * The tasks table has NO completed_at column, so completion dates cannot be proven for
--     existing rows. This migration therefore adds an append-only, server-timestamped
--     study_activity_events log, written ONLY by a trigger on tasks.completed.
--   * No backfill: tasks completed before this migration create no events and no streak days.
--   * Streak, protection balance, longest streak, totals and the calendar are DERIVED
--     deterministically from the event log by study_streak_compute(). There are no mutable
--     counters, so page refreshes / retries / multiple devices can never double-award protection.
--   * Achievements are persisted once per student (UNIQUE) and written only by the server.
--   * Students get SELECT-only RLS on all four new objects; every write goes through
--     SECURITY DEFINER functions that derive the student from auth.uid().
--
-- Additive only: no existing table, column, policy, trigger or function is altered or dropped.
-- (CREATE TRIGGER on tasks adds a new, independent AFTER trigger.)

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- Per-student study preferences (daily goal + timezone used to define a "calendar day")
CREATE TABLE IF NOT EXISTS public.study_preferences (
    student_id  UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    daily_goal  INTEGER NOT NULL DEFAULT 3 CHECK (daily_goal BETWEEN 1 AND 20),
    timezone    TEXT NOT NULL DEFAULT 'UTC',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS study_preferences_updated_at ON public.study_preferences;
CREATE TRIGGER study_preferences_updated_at
    BEFORE UPDATE ON public.study_preferences
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

COMMENT ON TABLE public.study_preferences IS 'Study Analytics 2.0: per-student daily goal and timezone';

-- Append-only completion log. One ACTIVE (non-voided) event per task.
-- task_id intentionally has NO foreign key: deleting a completed task must not erase the
-- fact that the student studied that day.
CREATE TABLE IF NOT EXISTS public.study_activity_events (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_id       UUID NOT NULL,
    completed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    activity_date DATE NOT NULL,
    timezone      TEXT NOT NULL,
    voided_at     TIMESTAMPTZ,
    void_reason   TEXT CHECK (void_reason IS NULL OR void_reason = 'undo')
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_study_events_one_active_per_task
    ON public.study_activity_events(task_id) WHERE voided_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_study_events_student_date
    ON public.study_activity_events(student_id, activity_date) WHERE voided_at IS NULL;

COMMENT ON TABLE public.study_activity_events IS 'Study Analytics 2.0: server-timestamped task-completion events (written by trigger only)';

-- Earned badges: at most one row per student per badge
CREATE TABLE IF NOT EXISTS public.student_achievements (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_key  TEXT NOT NULL CHECK (badge_key IN (
        'first_step', 'consistent_learner', 'weekly_champion', 'dedicated_student',
        'study_master', 'task_achiever', 'productivity_star', 'century_club'
    )),
    earned_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_student_achievement UNIQUE (student_id, badge_key)
);

CREATE INDEX IF NOT EXISTS idx_student_achievements_student ON public.student_achievements(student_id);

COMMENT ON TABLE public.student_achievements IS 'Study Analytics 2.0: earned achievement badges (written by server functions only)';

-- ============================================================================
-- 2. ROW LEVEL SECURITY (SELECT-only for students; no direct writes)
-- ============================================================================
ALTER TABLE public.study_preferences     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS study_preferences_select_own ON public.study_preferences;
CREATE POLICY study_preferences_select_own ON public.study_preferences
    FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS study_activity_events_select_own ON public.study_activity_events;
CREATE POLICY study_activity_events_select_own ON public.study_activity_events
    FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS student_achievements_select_own ON public.student_achievements;
CREATE POLICY student_achievements_select_own ON public.student_achievements
    FOR SELECT USING (auth.uid() = student_id);

-- Defense in depth: no INSERT/UPDATE/DELETE policies exist, and table privileges are revoked too.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.study_preferences     FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.study_activity_events FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.student_achievements  FROM PUBLIC, anon, authenticated;

-- ============================================================================
-- 3. INTERNAL FUNCTIONS (not callable by students)
-- ============================================================================

-- Deterministic streak engine. Derives everything from active events; writes nothing.
--
-- Rules (documented in the proposal):
--   * A day is ACTIVE when >= 1 non-voided event has that activity_date (multiple tasks = 1 day).
--   * Each ACTIVE day extends the current streak by 1.
--   * Every 7th active day within a run earns 1 protection (balance capped at 2).
--   * A fully missed day (a day strictly before the current day) while a streak is running:
--       - consumes 1 protection automatically if the balance > 0 (day is PROTECTED:
--         the streak is bridged but NOT incremented and it is NOT an active day), else
--       - resets the streak to 0 and the run's progress toward the next protection.
--   * The current (not yet ended) day never counts as a miss.
--   * "Current day" = greatest(p_today, latest event date) so a timezone move can only
--     extend, never retroactively break, a streak.
CREATE OR REPLACE FUNCTION public.study_streak_compute(p_student UUID, p_today DATE)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
    v_first          DATE;
    v_last_event     DATE;
    v_end            DATE;
    v_streak         INTEGER := 0;
    v_longest        INTEGER := 0;
    v_prot           INTEGER := 0;
    v_toward         INTEGER := 0;
    v_active_days    INTEGER := 0;
    v_protected_days INTEGER := 0;
    v_today_tasks    INTEGER := 0;
    v_total_tasks    INTEGER := 0;
    v_days           JSONB := '[]'::jsonb;
    r                RECORD;
BEGIN
    SELECT min(activity_date), max(activity_date), count(*)
      INTO v_first, v_last_event, v_total_tasks
      FROM public.study_activity_events
     WHERE student_id = p_student AND voided_at IS NULL;

    IF v_first IS NULL THEN
        RETURN jsonb_build_object(
            'today', p_today, 'current_streak', 0, 'longest_streak', 0,
            'protection_balance', 0, 'toward_next_protection', 0,
            'total_active_days', 0, 'protected_days_used', 0,
            'total_completed_tasks', 0, 'completed_today', 0,
            'studied_today', false, 'streak_status', 'none',
            'tracking_started', NULL, 'days', '[]'::jsonb
        );
    END IF;

    v_end := GREATEST(p_today, v_last_event);

    FOR r IN
        SELECT g.d::date AS d, COALESCE(c.n, 0) AS n
          FROM generate_series(v_first, v_end, interval '1 day') AS g(d)
          LEFT JOIN (
                SELECT activity_date, count(*)::int AS n
                  FROM public.study_activity_events
                 WHERE student_id = p_student AND voided_at IS NULL
                 GROUP BY activity_date
          ) c ON c.activity_date = g.d::date
         ORDER BY g.d
    LOOP
        IF r.n > 0 THEN
            v_streak      := v_streak + 1;
            v_active_days := v_active_days + 1;
            v_toward      := v_toward + 1;
            IF v_streak > v_longest THEN v_longest := v_streak; END IF;
            IF v_toward = 7 THEN
                v_prot   := LEAST(2, v_prot + 1);
                v_toward := 0;
            END IF;
            IF r.d >= v_end - 400 THEN
                v_days := v_days || jsonb_build_object('date', r.d, 'tasks', r.n, 'kind', 'active');
            END IF;
            IF r.d = v_end THEN v_today_tasks := r.n; END IF;
        ELSIF r.d < v_end AND v_streak > 0 THEN
            IF v_prot > 0 THEN
                v_prot           := v_prot - 1;
                v_protected_days := v_protected_days + 1;
                IF r.d >= v_end - 400 THEN
                    v_days := v_days || jsonb_build_object('date', r.d, 'tasks', 0, 'kind', 'protected');
                END IF;
            ELSE
                v_streak := 0;
                v_toward := 0;
            END IF;
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'today', v_end,
        'current_streak', v_streak,
        'longest_streak', v_longest,
        'protection_balance', v_prot,
        'toward_next_protection', v_toward,
        'total_active_days', v_active_days,
        'protected_days_used', v_protected_days,
        'total_completed_tasks', v_total_tasks,
        'completed_today', v_today_tasks,
        'studied_today', v_today_tasks > 0,
        'streak_status', CASE
            WHEN v_streak = 0 THEN 'none'
            WHEN v_today_tasks > 0 THEN 'active_today'
            ELSE 'at_risk'
        END,
        'tracking_started', v_first,
        'days', v_days
    );
END;
$$;

-- Awards any newly satisfied badges. Idempotent (UNIQUE + ON CONFLICT DO NOTHING).
CREATE OR REPLACE FUNCTION public.award_study_achievements(p_student UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
    v_tz      TEXT;
    v_today   DATE;
    v_state   JSONB;
    v_longest INTEGER;
    v_tasks   INTEGER;
BEGIN
    SELECT timezone INTO v_tz FROM public.study_preferences WHERE student_id = p_student;
    v_tz := COALESCE(v_tz, 'UTC');
    v_today := (now() AT TIME ZONE v_tz)::date;

    v_state   := public.study_streak_compute(p_student, v_today);
    v_longest := (v_state ->> 'longest_streak')::int;
    v_tasks   := (v_state ->> 'total_completed_tasks')::int;

    INSERT INTO public.student_achievements (student_id, badge_key)
    SELECT p_student, b.badge_key
      FROM (VALUES
        ('first_step',         v_tasks   >= 1),
        ('consistent_learner', v_longest >= 3),
        ('weekly_champion',    v_longest >= 7),
        ('dedicated_student',  v_longest >= 14),
        ('study_master',       v_longest >= 30),
        ('task_achiever',      v_tasks   >= 10),
        ('productivity_star',  v_tasks   >= 50),
        ('century_club',       v_tasks   >= 100)
      ) AS b(badge_key, satisfied)
     WHERE b.satisfied
    ON CONFLICT (student_id, badge_key) DO NOTHING;
END;
$$;

-- Records one completion event (retry-safe) and evaluates achievements.
CREATE OR REPLACE FUNCTION public.record_study_event(p_student UUID, p_task UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
    v_tz TEXT;
BEGIN
    -- Serialize per student so concurrent completions cannot miss each other's counts.
    PERFORM pg_advisory_xact_lock(hashtext(p_student::text));

    SELECT timezone INTO v_tz FROM public.study_preferences WHERE student_id = p_student;
    v_tz := COALESCE(v_tz, 'UTC');

    INSERT INTO public.study_activity_events (student_id, task_id, completed_at, activity_date, timezone)
    VALUES (p_student, p_task, now(), (now() AT TIME ZONE v_tz)::date, v_tz)
    ON CONFLICT (task_id) WHERE voided_at IS NULL DO NOTHING;

    PERFORM public.award_study_achievements(p_student);
END;
$$;

-- Trigger function: the ONLY writer of study_activity_events.
--   * false -> true  : record one event (duplicates impossible: one active event per task)
--   * true  -> false : void the active event (undo). Achievements already earned are kept.
--   * true  -> true  : no-op (network retry / edit of a completed task)
--   * DELETE         : not handled on purpose; deleting a completed task preserves the history.
CREATE OR REPLACE FUNCTION public.log_task_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.completed THEN
            PERFORM public.record_study_event(NEW.student_id, NEW.id);
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.completed AND NOT OLD.completed THEN
            PERFORM public.record_study_event(NEW.student_id, NEW.id);
        ELSIF OLD.completed AND NOT NEW.completed THEN
            PERFORM pg_advisory_xact_lock(hashtext(NEW.student_id::text));
            UPDATE public.study_activity_events
               SET voided_at = now(), void_reason = 'undo'
             WHERE task_id = NEW.id AND voided_at IS NULL;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tasks_log_completion ON public.tasks;
CREATE TRIGGER tasks_log_completion
    AFTER INSERT OR UPDATE OF completed ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.log_task_completion();

-- ============================================================================
-- 4. STUDENT-FACING RPCs (derive the student from auth.uid(); never accept a student id)
-- ============================================================================

-- Saves the student's timezone (affects only FUTURE events; history is never rewritten).
CREATE OR REPLACE FUNCTION public.sync_study_timezone(p_timezone TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
    v_uid UUID := auth.uid();
BEGIN
    IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000'; END IF;
    IF p_timezone IS NULL OR NOT EXISTS (SELECT 1 FROM pg_catalog.pg_timezone_names WHERE name = p_timezone) THEN
        RAISE EXCEPTION 'Unknown timezone' USING ERRCODE = '22023';
    END IF;

    INSERT INTO public.study_preferences (student_id, timezone)
    VALUES (v_uid, p_timezone)
    ON CONFLICT (student_id) DO UPDATE
        SET timezone = EXCLUDED.timezone
        WHERE public.study_preferences.timezone IS DISTINCT FROM EXCLUDED.timezone;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_daily_study_goal(p_goal INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
    v_uid UUID := auth.uid();
BEGIN
    IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000'; END IF;
    IF p_goal IS NULL OR p_goal < 1 OR p_goal > 20 THEN
        RAISE EXCEPTION 'Daily goal must be between 1 and 20 tasks' USING ERRCODE = '22023';
    END IF;

    INSERT INTO public.study_preferences (student_id, daily_goal)
    VALUES (v_uid, p_goal)
    ON CONFLICT (student_id) DO UPDATE SET daily_goal = EXCLUDED.daily_goal;
END;
$$;

-- One round trip: streak state + preferences + earned badges for the signed-in student only.
CREATE OR REPLACE FUNCTION public.get_study_summary()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
    v_uid   UUID := auth.uid();
    v_tz    TEXT;
    v_goal  INTEGER;
    v_today DATE;
    v_state JSONB;
    v_ach   JSONB;
BEGIN
    IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000'; END IF;

    SELECT timezone, daily_goal INTO v_tz, v_goal
      FROM public.study_preferences WHERE student_id = v_uid;
    v_tz   := COALESCE(v_tz, 'UTC');
    v_goal := COALESCE(v_goal, 3);
    v_today := (now() AT TIME ZONE v_tz)::date;

    v_state := public.study_streak_compute(v_uid, v_today);

    SELECT COALESCE(jsonb_agg(jsonb_build_object('badge_key', badge_key, 'earned_at', earned_at)
                              ORDER BY earned_at, badge_key), '[]'::jsonb)
      INTO v_ach
      FROM public.student_achievements WHERE student_id = v_uid;

    RETURN v_state || jsonb_build_object(
        'timezone', v_tz,
        'daily_goal', v_goal,
        'achievements', v_ach
    );
END;
$$;

-- ============================================================================
-- 5. FUNCTION PRIVILEGES
-- ============================================================================
REVOKE ALL ON FUNCTION public.study_streak_compute(UUID, DATE)    FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.award_study_achievements(UUID)      FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_study_event(UUID, UUID)      FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.log_task_completion()               FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.sync_study_timezone(TEXT)           FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.set_daily_study_goal(INTEGER)       FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_study_summary()                 FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sync_study_timezone(TEXT)        TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_daily_study_goal(INTEGER)    TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_study_summary()              TO authenticated;

