-- ============================================================================
-- Migration 013: AI Tutor Schema, Triggers, Indexes & Row Level Security
-- ============================================================================
-- Depends on: 001_profiles.sql (profiles, update_updated_at()), 002_subjects.sql
-- Rollback:   supabase/rollbacks/013_ai_tutor_down.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. AI TUTOR CONVERSATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_tutor_conversations (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title              TEXT NOT NULL DEFAULT 'New AI Tutor Chat'
                       CHECK (char_length(title) BETWEEN 1 AND 200),
    subject_id         UUID NULL REFERENCES public.subjects(id) ON DELETE SET NULL,
    subject_slug       TEXT NULL CHECK (subject_slug IS NULL OR char_length(subject_slug) BETWEEN 1 AND 120),
    difficulty         TEXT NOT NULL DEFAULT 'beginner'
                       CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    teaching_mode      TEXT NOT NULL DEFAULT 'explain'
                       CHECK (teaching_mode IN (
                           'explain',
                           'step_by_step',
                           'simple_example',
                           'exam_prep',
                           'practice_with_me',
                           'hint',
                           'summarize'
                       )),
    preferred_language TEXT NOT NULL DEFAULT 'auto'
                       CHECK (char_length(preferred_language) BETWEEN 2 AND 32),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.ai_tutor_conversations IS 'Private multi-turn AI Tutor chat threads owned by an authenticated student';

CREATE INDEX IF NOT EXISTS idx_ai_tutor_conversations_student_updated
    ON public.ai_tutor_conversations (student_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_tutor_conversations_subject
    ON public.ai_tutor_conversations (student_id, subject_id);

-- ----------------------------------------------------------------------------
-- 2. AI TUTOR MESSAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_tutor_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.ai_tutor_conversations(id) ON DELETE CASCADE,
    role            TEXT NOT NULL CHECK (role IN ('student', 'assistant')),
    content         TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 24000),
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.ai_tutor_messages IS 'Ordered student prompts and server-generated assistant replies for AI Tutor chats';

CREATE INDEX IF NOT EXISTS idx_ai_tutor_messages_conversation_time
    ON public.ai_tutor_messages (conversation_id, created_at ASC);

-- ----------------------------------------------------------------------------
-- 3. AI TUTOR LEARNING SESSIONS (Tracked study summaries without fake streaks)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_tutor_learning_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id      UUID NULL REFERENCES public.subjects(id) ON DELETE SET NULL,
    subject_slug    TEXT NULL,
    conversation_id UUID NULL REFERENCES public.ai_tutor_conversations(id) ON DELETE SET NULL,
    topic           TEXT NOT NULL CHECK (char_length(topic) BETWEEN 1 AND 255),
    difficulty      TEXT NOT NULL DEFAULT 'beginner'
                    CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    teaching_mode   TEXT NOT NULL DEFAULT 'explain'
                    CHECK (teaching_mode IN (
                        'explain',
                        'step_by_step',
                        'simple_example',
                        'exam_prep',
                        'practice_with_me',
                        'hint',
                        'summarize'
                    )),
    activity_type   TEXT NOT NULL
                    CHECK (activity_type IN (
                        'tutor_session',
                        'practice_quiz',
                        'study_plan_created',
                        'study_plan_task_added'
                    )),
    completed_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.ai_tutor_learning_sessions IS 'Verified AI Tutor learning sessions, topic practice launches, and confirmed study plans';

CREATE INDEX IF NOT EXISTS idx_ai_tutor_sessions_student_time
    ON public.ai_tutor_learning_sessions (student_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_tutor_sessions_conversation
    ON public.ai_tutor_learning_sessions (conversation_id, activity_type);

-- ----------------------------------------------------------------------------
-- 4. AI TUTOR DAILY USAGE QUOTAS (Server-only mutations; client read-only)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_tutor_usage_quotas (
    student_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    usage_date       DATE NOT NULL DEFAULT CURRENT_DATE,
    request_count    INT NOT NULL DEFAULT 0 CHECK (request_count >= 0),
    estimated_tokens INT NOT NULL DEFAULT 0 CHECK (estimated_tokens >= 0),
    last_request_at  TIMESTAMPTZ NULL,
    PRIMARY KEY (student_id, usage_date)
);

COMMENT ON TABLE public.ai_tutor_usage_quotas IS 'Server-enforced daily AI Tutor request and token caps per student';

-- ----------------------------------------------------------------------------
-- 5. TRIGGERS
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS ai_tutor_conversations_updated_at ON public.ai_tutor_conversations;
CREATE TRIGGER ai_tutor_conversations_updated_at
    BEFORE UPDATE ON public.ai_tutor_conversations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE FUNCTION public.touch_ai_tutor_conversation_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    UPDATE public.ai_tutor_conversations
       SET updated_at = GREATEST(updated_at, NEW.created_at)
     WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ai_tutor_messages_touch ON public.ai_tutor_messages;
CREATE TRIGGER trg_ai_tutor_messages_touch
    AFTER INSERT ON public.ai_tutor_messages
    FOR EACH ROW EXECUTE FUNCTION public.touch_ai_tutor_conversation_on_message();

REVOKE ALL ON FUNCTION public.touch_ai_tutor_conversation_on_message() FROM PUBLIC, anon, authenticated;

-- ----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.ai_tutor_conversations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tutor_messages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tutor_learning_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tutor_usage_quotas       ENABLE ROW LEVEL SECURITY;

-- Conversations: full ownership only
DROP POLICY IF EXISTS ai_tutor_conversations_select_own ON public.ai_tutor_conversations;
CREATE POLICY ai_tutor_conversations_select_own ON public.ai_tutor_conversations
    FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS ai_tutor_conversations_insert_own ON public.ai_tutor_conversations;
CREATE POLICY ai_tutor_conversations_insert_own ON public.ai_tutor_conversations
    FOR INSERT WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS ai_tutor_conversations_update_own ON public.ai_tutor_conversations;
CREATE POLICY ai_tutor_conversations_update_own ON public.ai_tutor_conversations
    FOR UPDATE USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS ai_tutor_conversations_delete_own ON public.ai_tutor_conversations;
CREATE POLICY ai_tutor_conversations_delete_own ON public.ai_tutor_conversations
    FOR DELETE USING (auth.uid() = student_id);

-- Messages: accessible ONLY via parent conversation ownership.
-- Students can only insert role='student'; role='assistant' is written solely by the verified Edge Function.
DROP POLICY IF EXISTS ai_tutor_messages_select_own ON public.ai_tutor_messages;
CREATE POLICY ai_tutor_messages_select_own ON public.ai_tutor_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.ai_tutor_conversations c
            WHERE c.id = ai_tutor_messages.conversation_id
              AND c.student_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS ai_tutor_messages_insert_student_own ON public.ai_tutor_messages;
CREATE POLICY ai_tutor_messages_insert_student_own ON public.ai_tutor_messages
    FOR INSERT WITH CHECK (
        role = 'student'
        AND EXISTS (
            SELECT 1 FROM public.ai_tutor_conversations c
            WHERE c.id = ai_tutor_messages.conversation_id
              AND c.student_id = auth.uid()
        )
    );

-- Prevent forging/editing/direct-deleting individual messages from client JWTs
-- (Parent conversation deletion cascades child messages automatically.)
REVOKE UPDATE, DELETE ON public.ai_tutor_messages FROM anon, authenticated;

-- Learning sessions: student SELECT & INSERT own records
DROP POLICY IF EXISTS ai_tutor_sessions_select_own ON public.ai_tutor_learning_sessions;
CREATE POLICY ai_tutor_sessions_select_own ON public.ai_tutor_learning_sessions
    FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS ai_tutor_sessions_insert_own ON public.ai_tutor_learning_sessions;
CREATE POLICY ai_tutor_sessions_insert_own ON public.ai_tutor_learning_sessions
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Usage quotas: student read-only; mutations exclusively via server Edge Function
DROP POLICY IF EXISTS ai_tutor_quotas_select_own ON public.ai_tutor_usage_quotas;
CREATE POLICY ai_tutor_quotas_select_own ON public.ai_tutor_usage_quotas
    FOR SELECT USING (auth.uid() = student_id);

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.ai_tutor_usage_quotas FROM PUBLIC, anon, authenticated;
