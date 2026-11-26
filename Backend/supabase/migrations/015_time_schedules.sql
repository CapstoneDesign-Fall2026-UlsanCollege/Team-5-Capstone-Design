-- 015_time_schedules.sql
-- Manual Time Schedule & Study Planner tables, recurrence exceptions,
-- subject ownership validation, and per-student RLS policies.

CREATE TABLE IF NOT EXISTS public.study_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID NULL REFERENCES public.subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 120),
    activity_type TEXT NOT NULL CHECK (
        activity_type IN (
            'study_session',
            'assignment',
            'exam_preparation',
            'quiz_practice',
            'revision',
            'break',
            'personal_activity',
            'other'
        )
    ),
    description TEXT NULL CHECK (description IS NULL OR char_length(description) <= 1000),
    schedule_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'UTC' CHECK (char_length(btrim(timezone)) BETWEEN 1 AND 80),
    repeat_rule TEXT NOT NULL DEFAULT 'none' CHECK (
        repeat_rule IN ('none', 'daily', 'weekly', 'weekdays')
    ),
    repeat_days SMALLINT[] NOT NULL DEFAULT '{}'::SMALLINT[] CHECK (
        repeat_days <@ ARRAY[0, 1, 2, 3, 4, 5, 6]::SMALLINT[]
    ),
    repeat_until DATE NULL CHECK (repeat_until IS NULL OR repeat_until >= schedule_date),
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT study_schedules_time_order_check CHECK (
        end_time > start_time AND end_at > start_at
    ),
    CONSTRAINT study_schedules_weekdays_rule_check CHECK (
        repeat_rule <> 'weekdays' OR cardinality(repeat_days) > 0
    )
);

CREATE TABLE IF NOT EXISTS public.study_schedule_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID NOT NULL REFERENCES public.study_schedules(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    occurrence_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'modified' CHECK (
        status IN ('modified', 'completed', 'cancelled')
    ),
    override_title TEXT NULL CHECK (
        override_title IS NULL OR (char_length(btrim(override_title)) BETWEEN 1 AND 120)
    ),
    override_subject_id UUID NULL REFERENCES public.subjects(id) ON DELETE SET NULL,
    override_activity_type TEXT NULL CHECK (
        override_activity_type IS NULL OR override_activity_type IN (
            'study_session',
            'assignment',
            'exam_preparation',
            'quiz_practice',
            'revision',
            'break',
            'personal_activity',
            'other'
        )
    ),
    override_description TEXT NULL CHECK (
        override_description IS NULL OR char_length(override_description) <= 1000
    ),
    override_date DATE NULL,
    override_start_time TIME NULL,
    override_end_time TIME NULL,
    override_start_at TIMESTAMPTZ NULL,
    override_end_at TIMESTAMPTZ NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT study_schedule_exceptions_unique_occ UNIQUE (schedule_id, occurrence_date),
    CONSTRAINT study_schedule_exceptions_override_order_check CHECK (
        (
            override_start_time IS NULL
            AND override_end_time IS NULL
            AND override_start_at IS NULL
            AND override_end_at IS NULL
        )
        OR (
            override_start_time IS NOT NULL
            AND override_end_time IS NOT NULL
            AND override_end_time > override_start_time
            AND override_start_at IS NOT NULL
            AND override_end_at IS NOT NULL
            AND override_end_at > override_start_at
        )
    )
);

-- Helpers defined after tables exist (PostgreSQL validates LANGUAGE sql bodies at creation time).
CREATE OR REPLACE FUNCTION public.can_assign_schedule_subject(
    p_student_id UUID,
    p_schedule_id UUID,
    p_subject_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT p_subject_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.student_subjects ss
            WHERE ss.student_id = p_student_id
              AND ss.subject_id = p_subject_id
        )
        OR (
            p_schedule_id IS NOT NULL
            AND EXISTS (
                SELECT 1
                FROM public.study_schedules s
                WHERE s.id = p_schedule_id
                  AND s.student_id = p_student_id
                  AND s.subject_id IS NOT DISTINCT FROM p_subject_id
            )
        );
$$;

REVOKE ALL ON FUNCTION public.can_assign_schedule_subject(UUID, UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_assign_schedule_subject(UUID, UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.can_assign_exception_subject(
    p_student_id UUID,
    p_exception_id UUID,
    p_subject_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT p_subject_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.student_subjects ss
            WHERE ss.student_id = p_student_id
              AND ss.subject_id = p_subject_id
        )
        OR (
            p_exception_id IS NOT NULL
            AND EXISTS (
                SELECT 1
                FROM public.study_schedule_exceptions e
                WHERE e.id = p_exception_id
                  AND e.student_id = p_student_id
                  AND e.override_subject_id IS NOT DISTINCT FROM p_subject_id
            )
        );
$$;

REVOKE ALL ON FUNCTION public.can_assign_exception_subject(UUID, UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_assign_exception_subject(UUID, UUID, UUID) TO authenticated;

CREATE INDEX IF NOT EXISTS idx_study_schedules_student_date
    ON public.study_schedules (student_id, schedule_date, start_time);

CREATE INDEX IF NOT EXISTS idx_study_schedules_student_repeat
    ON public.study_schedules (student_id, repeat_rule, repeat_until);

CREATE INDEX IF NOT EXISTS idx_study_schedule_exceptions_student_occ
    ON public.study_schedule_exceptions (student_id, occurrence_date, schedule_id);

DROP TRIGGER IF EXISTS study_schedules_updated_at ON public.study_schedules;
CREATE TRIGGER study_schedules_updated_at
    BEFORE UPDATE ON public.study_schedules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS study_schedule_exceptions_updated_at ON public.study_schedule_exceptions;
CREATE TRIGGER study_schedule_exceptions_updated_at
    BEFORE UPDATE ON public.study_schedule_exceptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.study_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_schedule_exceptions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.study_schedules FROM anon;
REVOKE ALL ON TABLE public.study_schedule_exceptions FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.study_schedules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.study_schedule_exceptions TO authenticated;

DROP POLICY IF EXISTS "study_schedules: own select" ON public.study_schedules;
CREATE POLICY "study_schedules: own select"
    ON public.study_schedules
    FOR SELECT
    USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "study_schedules: own insert" ON public.study_schedules;
CREATE POLICY "study_schedules: own insert"
    ON public.study_schedules
    FOR INSERT
    WITH CHECK (
        auth.uid() = student_id
        AND (
            study_schedules.subject_id IS NULL
            OR EXISTS (
                SELECT 1
                FROM public.student_subjects ss
                WHERE ss.student_id = auth.uid()
                  AND ss.subject_id = study_schedules.subject_id
            )
        )
    );

DROP POLICY IF EXISTS "study_schedules: own update" ON public.study_schedules;
CREATE POLICY "study_schedules: own update"
    ON public.study_schedules
    FOR UPDATE
    USING (auth.uid() = student_id)
    WITH CHECK (
        auth.uid() = student_id
        AND public.can_assign_schedule_subject(auth.uid(), study_schedules.id, study_schedules.subject_id)
    );

DROP POLICY IF EXISTS "study_schedules: own delete" ON public.study_schedules;
CREATE POLICY "study_schedules: own delete"
    ON public.study_schedules
    FOR DELETE
    USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "study_schedule_exceptions: own select" ON public.study_schedule_exceptions;
CREATE POLICY "study_schedule_exceptions: own select"
    ON public.study_schedule_exceptions
    FOR SELECT
    USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "study_schedule_exceptions: own insert" ON public.study_schedule_exceptions;
CREATE POLICY "study_schedule_exceptions: own insert"
    ON public.study_schedule_exceptions
    FOR INSERT
    WITH CHECK (
        auth.uid() = student_id
        AND EXISTS (
            SELECT 1
            FROM public.study_schedules s
            WHERE s.id = study_schedule_exceptions.schedule_id
              AND s.student_id = auth.uid()
        )
        AND (
            study_schedule_exceptions.override_subject_id IS NULL
            OR EXISTS (
                SELECT 1
                FROM public.student_subjects ss
                WHERE ss.student_id = auth.uid()
                  AND ss.subject_id = study_schedule_exceptions.override_subject_id
            )
        )
    );

DROP POLICY IF EXISTS "study_schedule_exceptions: own update" ON public.study_schedule_exceptions;
CREATE POLICY "study_schedule_exceptions: own update"
    ON public.study_schedule_exceptions
    FOR UPDATE
    USING (auth.uid() = student_id)
    WITH CHECK (
        auth.uid() = student_id
        AND EXISTS (
            SELECT 1
            FROM public.study_schedules s
            WHERE s.id = study_schedule_exceptions.schedule_id
              AND s.student_id = auth.uid()
        )
        AND public.can_assign_exception_subject(
            auth.uid(),
            study_schedule_exceptions.id,
            study_schedule_exceptions.override_subject_id
        )
    );

DROP POLICY IF EXISTS "study_schedule_exceptions: own delete" ON public.study_schedule_exceptions;
CREATE POLICY "study_schedule_exceptions: own delete"
    ON public.study_schedule_exceptions
    FOR DELETE
    USING (auth.uid() = student_id);
