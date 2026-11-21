/**
 * AI Tutor Service — Smart Study Companion
 *
 * Handles authenticated Supabase PostgreSQL persistence for conversations,
 * messages, quota reads, learning summaries, and Edge Function invocations.
 * Never fabricates simulated cloud AI responses when the server is unavailable.
 */
import { supabase, isConfigured } from '../lib/supabase.js';
import {
  DEFAULT_DAILY_TUTOR_LIMIT,
  normalizeTutorError,
  validateTutorMessageInput,
} from '../lib/ai-tutor-logic.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isAuthenticatedCloudStudent(studentId) {
  return Boolean(isConfigured && studentId && !String(studentId).startsWith('local-'));
}

async function resolveSubjectUuid(subjectId, subjectSlug = '', subjectName = '') {
  if (UUID_REGEX.test(String(subjectId || ''))) return subjectId;
  if (!isConfigured) return null;
  try {
    if (subjectSlug) {
      const { data } = await supabase
        .from('subjects')
        .select('id')
        .eq('slug', subjectSlug)
        .maybeSingle();
      if (data?.id) return data.id;
    }
    if (subjectName) {
      const { data } = await supabase
        .from('subjects')
        .select('id')
        .ilike('name', subjectName)
        .maybeSingle();
      if (data?.id) return data.id;
    }
  } catch (_) {}
  return null;
}

export async function listTutorConversations(studentId) {
  if (!isAuthenticatedCloudStudent(studentId)) {
    return {
      data: [],
      error: normalizeTutorError({
        code: 'INVALID_SESSION',
        message: 'Sign in with a verified student account to access saved AI Tutor history.',
      }),
    };
  }
  try {
    const { data, error } = await supabase
      .from('ai_tutor_conversations')
      .select('*')
      .eq('student_id', studentId)
      .order('updated_at', { ascending: false })
      .limit(100);
    if (error) return { data: [], error: normalizeTutorError(error) };
    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: normalizeTutorError(err) };
  }
}

export async function createTutorConversation({
  studentId,
  title = 'New AI Tutor Chat',
  subjectId = null,
  subjectSlug = null,
  subjectName = '',
  difficulty = 'beginner',
  teachingMode = 'explain',
  preferredLanguage = 'auto',
}) {
  if (!isAuthenticatedCloudStudent(studentId)) {
    return {
      data: null,
      error: normalizeTutorError({ code: 'INVALID_SESSION', message: 'Please sign in to create a tutor chat.' }),
    };
  }
  const cleanTitle = String(title || 'New AI Tutor Chat').trim().slice(0, 200) || 'New AI Tutor Chat';
  const resolvedSubjectId = await resolveSubjectUuid(subjectId, subjectSlug, subjectName);

  try {
    const { data, error } = await supabase
      .from('ai_tutor_conversations')
      .insert({
        student_id: studentId,
        title: cleanTitle,
        subject_id: resolvedSubjectId,
        subject_slug: subjectSlug || null,
        difficulty,
        teaching_mode: teachingMode,
        preferred_language: preferredLanguage || 'auto',
      })
      .select()
      .single();
    if (error) return { data: null, error: normalizeTutorError(error) };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: normalizeTutorError(err) };
  }
}

export async function renameTutorConversation(conversationId, studentId, newTitle) {
  const cleanTitle = String(newTitle || '').trim();
  if (!cleanTitle || cleanTitle.length > 200) {
    return { data: null, error: { code: 'VALIDATION_ERROR', message: 'Title must be between 1 and 200 characters.' } };
  }
  if (!isAuthenticatedCloudStudent(studentId) || !UUID_REGEX.test(String(conversationId || ''))) {
    return { data: null, error: normalizeTutorError({ code: 'INVALID_SESSION' }) };
  }
  try {
    const { data, error } = await supabase
      .from('ai_tutor_conversations')
      .update({ title: cleanTitle })
      .eq('id', conversationId)
      .eq('student_id', studentId)
      .select()
      .single();
    if (error) return { data: null, error: normalizeTutorError(error) };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: normalizeTutorError(err) };
  }
}

export async function updateTutorConversationSettings(conversationId, studentId, updates = {}) {
  if (!isAuthenticatedCloudStudent(studentId) || !UUID_REGEX.test(String(conversationId || ''))) {
    return { data: null, error: null };
  }
  const patch = {};
  if (updates.subjectId !== undefined) patch.subject_id = updates.subjectId;
  if (updates.subjectSlug !== undefined) patch.subject_slug = updates.subjectSlug;
  if (updates.difficulty !== undefined) patch.difficulty = updates.difficulty;
  if (updates.teachingMode !== undefined) patch.teaching_mode = updates.teachingMode;
  if (updates.preferredLanguage !== undefined) patch.preferred_language = updates.preferredLanguage;
  if (Object.keys(patch).length === 0) return { data: null, error: null };

  try {
    const { data, error } = await supabase
      .from('ai_tutor_conversations')
      .update(patch)
      .eq('id', conversationId)
      .eq('student_id', studentId)
      .select()
      .single();
    if (error) return { data: null, error: normalizeTutorError(error) };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: normalizeTutorError(err) };
  }
}

export async function deleteTutorConversation(conversationId, studentId) {
  if (!isAuthenticatedCloudStudent(studentId) || !UUID_REGEX.test(String(conversationId || ''))) {
    return { error: normalizeTutorError({ code: 'INVALID_SESSION' }) };
  }
  try {
    const { error } = await supabase
      .from('ai_tutor_conversations')
      .delete()
      .eq('id', conversationId)
      .eq('student_id', studentId);
    return { error: error ? normalizeTutorError(error) : null };
  } catch (err) {
    return { error: normalizeTutorError(err) };
  }
}

export async function getTutorMessages(conversationId) {
  if (!isConfigured || !UUID_REGEX.test(String(conversationId || ''))) {
    return { data: [], error: null };
  }
  try {
    const { data, error } = await supabase
      .from('ai_tutor_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (error) return { data: [], error: normalizeTutorError(error) };
    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: normalizeTutorError(err) };
  }
}

async function extractInvokeErrorPayload(edgeError, edgeData) {
  if (edgeData && typeof edgeData === 'object' && edgeData.error) {
    return edgeData;
  }
  const status = edgeError?.context?.status || edgeError?.status || 0;
  let body = null;
  if (edgeError?.context && typeof edgeError.context.json === 'function') {
    try {
      body = await edgeError.context.json();
    } catch (_) {}
  }
  if (body && typeof body === 'object') {
    return { status, ...body };
  }
  return {
    status,
    code: edgeError?.code,
    message: edgeError?.message || 'AI Tutor request failed.',
  };
}

export async function sendTutorMessage({
  conversationId = null,
  message = '',
  subjectId = null,
  subjectSlug = null,
  subjectName = '',
  difficulty = 'beginner',
  teachingMode = 'explain',
  preferredLanguage = 'auto',
  regenerateLast = false,
}) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return {
      data: null,
      error: normalizeTutorError({ code: 'OFFLINE' }),
    };
  }

  if (!regenerateLast) {
    const check = validateTutorMessageInput(message);
    if (!check.ok) {
      return { data: null, error: { code: check.code, retryable: false, message: check.error } };
    }
  }

  if (!isConfigured) {
    return {
      data: null,
      error: normalizeTutorError({ code: 'ENDPOINT_UNAVAILABLE', message: 'Supabase is not configured.' }),
    };
  }

  try {
    const { data: sessionRes } = await supabase.auth.getSession();
    const session = sessionRes?.session;
    if (!session?.access_token) {
      return {
        data: null,
        error: normalizeTutorError({ code: 'INVALID_SESSION', status: 401 }),
      };
    }

    const resolvedSubjectId = await resolveSubjectUuid(subjectId, subjectSlug, subjectName);

    const { data: edgeData, error: edgeError } = await supabase.functions.invoke('ai-tutor-chat', {
      body: {
        conversationId,
        message: regenerateLast ? '' : String(message).trim(),
        subjectId: resolvedSubjectId,
        subjectSlug,
        subjectName,
        difficulty,
        teachingMode,
        preferredLanguage,
        regenerateLast: Boolean(regenerateLast),
      },
    });

    if (edgeError || !edgeData?.assistantMessage) {
      const extracted = await extractInvokeErrorPayload(edgeError, edgeData);
      return {
        data: extracted?.conversationId
          ? { conversationId: extracted.conversationId, studentMessage: extracted.studentMessage || null }
          : null,
        error: normalizeTutorError(extracted),
      };
    }

    return { data: edgeData, error: null };
  } catch (err) {
    return { data: null, error: normalizeTutorError(err) };
  }
}

export async function getTutorQuotaStatus(studentId) {
  const defaultQuota = { used: 0, limit: DEFAULT_DAILY_TUTOR_LIMIT, remaining: DEFAULT_DAILY_TUTOR_LIMIT };
  if (!isAuthenticatedCloudStudent(studentId)) return { data: defaultQuota, error: null };

  const todayIso = new Date().toISOString().slice(0, 10);
  try {
    const { data, error } = await supabase
      .from('ai_tutor_usage_quotas')
      .select('request_count')
      .eq('student_id', studentId)
      .eq('usage_date', todayIso)
      .maybeSingle();
    if (error) return { data: defaultQuota, error: normalizeTutorError(error) };
    const used = Number(data?.request_count || 0);
    return {
      data: {
        used,
        limit: DEFAULT_DAILY_TUTOR_LIMIT,
        remaining: Math.max(0, DEFAULT_DAILY_TUTOR_LIMIT - used),
      },
      error: null,
    };
  } catch (err) {
    return { data: defaultQuota, error: normalizeTutorError(err) };
  }
}

export async function getTutorLearningSessions(studentId) {
  if (!isAuthenticatedCloudStudent(studentId)) return { data: [], error: null };
  try {
    const { data, error } = await supabase
      .from('ai_tutor_learning_sessions')
      .select('*')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false })
      .limit(50);
    if (error) return { data: [], error: normalizeTutorError(error) };
    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: normalizeTutorError(err) };
  }
}

export async function recordTutorLearningActivity({
  studentId,
  subjectId = null,
  subjectSlug = null,
  subjectName = '',
  conversationId = null,
  topic,
  difficulty = 'beginner',
  teachingMode = 'explain',
  activityType = 'practice_quiz',
}) {
  if (!isAuthenticatedCloudStudent(studentId)) return { data: null, error: null };
  const resolvedSubjectId = await resolveSubjectUuid(subjectId, subjectSlug, subjectName);
  const cleanTopic = String(topic || 'Study Topic').trim().slice(0, 255) || 'Study Topic';

  try {
    const { data, error } = await supabase
      .from('ai_tutor_learning_sessions')
      .insert({
        student_id: studentId,
        subject_id: resolvedSubjectId,
        subject_slug: subjectSlug || null,
        conversation_id: UUID_REGEX.test(String(conversationId || '')) ? conversationId : null,
        topic: cleanTopic,
        difficulty,
        teaching_mode: teachingMode,
        activity_type: activityType,
      })
      .select()
      .single();
    if (error) return { data: null, error: normalizeTutorError(error) };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: normalizeTutorError(err) };
  }
}
