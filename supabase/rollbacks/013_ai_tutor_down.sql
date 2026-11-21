-- ============================================================================
-- Rollback 013: Remove AI Tutor Tables, Policies, Triggers & Functions
-- ============================================================================

DROP TRIGGER IF EXISTS trg_ai_tutor_messages_touch ON public.ai_tutor_messages;
DROP TRIGGER IF EXISTS ai_tutor_conversations_updated_at ON public.ai_tutor_conversations;
DROP FUNCTION IF EXISTS public.touch_ai_tutor_conversation_on_message();

DROP POLICY IF EXISTS ai_tutor_quotas_select_own ON public.ai_tutor_usage_quotas;
DROP POLICY IF EXISTS ai_tutor_sessions_insert_own ON public.ai_tutor_learning_sessions;
DROP POLICY IF EXISTS ai_tutor_sessions_select_own ON public.ai_tutor_learning_sessions;
DROP POLICY IF EXISTS ai_tutor_messages_insert_student_own ON public.ai_tutor_messages;
DROP POLICY IF EXISTS ai_tutor_messages_select_own ON public.ai_tutor_messages;
DROP POLICY IF EXISTS ai_tutor_conversations_delete_own ON public.ai_tutor_conversations;
DROP POLICY IF EXISTS ai_tutor_conversations_update_own ON public.ai_tutor_conversations;
DROP POLICY IF EXISTS ai_tutor_conversations_insert_own ON public.ai_tutor_conversations;
DROP POLICY IF EXISTS ai_tutor_conversations_select_own ON public.ai_tutor_conversations;

DROP TABLE IF EXISTS public.ai_tutor_usage_quotas;
DROP TABLE IF EXISTS public.ai_tutor_learning_sessions;
DROP TABLE IF EXISTS public.ai_tutor_messages;
DROP TABLE IF EXISTS public.ai_tutor_conversations;
