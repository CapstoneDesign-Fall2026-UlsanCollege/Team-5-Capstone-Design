/**
 * AI Quiz Service — Smart Study Companion
 * 
 * Manages topic-specific AI-generated quizzes via the Supabase Edge Function.
 * When live AI generation is unavailable, falls back ONLY to verified curated
 * subject+difficulty questions (clearly labeled) or reports an honest error.
 * Never fabricates generic template questions as AI output.
 */
import { supabase, isConfigured } from '../lib/supabase.js';
import { getLocalSeenQuestions, getQuizQuestions } from './quiz.js';

const LOCAL_AI_ATTEMPTS_KEY = 'study_companion_ai_quiz_attempts';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidQuestion(q) {
  if (!q || typeof q !== 'object') return false;
  if (!q.question || typeof q.question !== 'string' || q.question.trim().length < 5) return false;
  if (!Array.isArray(q.options) || q.options.length !== 4) return false;
  if (typeof q.correct_answer !== 'number' || q.correct_answer < 0 || q.correct_answer > 3) return false;

  const set = new Set(q.options.map((opt) => String(opt).trim().toLowerCase()));
  if (set.size < 4) return false;

  return true;
}

export function validateAndSanitizeQuestions(questions) {
  if (!Array.isArray(questions)) return [];
  const valid = [];
  const seen = new Set();

  for (const q of questions) {
    if (!isValidQuestion(q)) continue;
    const key = q.question.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    valid.push({
      question: q.question.trim(),
      options: q.options.map((opt) => String(opt).trim()),
      correct_answer: q.correct_answer,
      explanation: q.explanation ? String(q.explanation).trim() : 'Correct answer based on standard academic principles.',
    });
  }

  return valid;
}

async function resolveSubjectUuid(subjectId, subjectSlug = '', subjectName = '') {
  if (UUID_REGEX.test(String(subjectId || ''))) return subjectId;
  if (!isConfigured) return subjectId || null;

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

export async function generateAiQuiz({
  subjectId,
  subjectSlug = '',
  subjectName,
  topic,
  difficulty = 'medium',
  questionCount = 5,
  studentId,
  university = '',
  major = '',
}) {
  const cleanTopic = (topic || '').trim();
  if (cleanTopic.length < 2) {
    return { data: null, error: { message: 'Please enter a topic with at least 2 characters.' } };
  }

  const count = Math.min(Math.max(Number(questionCount) || 5, 1), 20);
  const validDifficulty = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium';
  const resolvedSubjectId = await resolveSubjectUuid(subjectId, subjectSlug, subjectName);
  const subjectKey = subjectSlug || resolvedSubjectId || subjectId || '';
  const localSeen = getLocalSeenQuestions(studentId, subjectKey);

  let edgeFailureReason = 'Live AI Edge Function is not configured in offline mode.';

  // 1. Attempt to invoke Supabase Edge Function if connected
  if (isConfigured) {
    try {
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('generate-ai-quiz', {
        body: {
          subjectId: resolvedSubjectId || subjectId,
          subjectSlug,
          subjectName,
          topic: cleanTopic,
          difficulty: validDifficulty,
          questionCount: count,
          university,
          major,
          recentFingerprints: localSeen.fingerprints.slice(-25),
        },
      });

      if (!edgeError && edgeData && Array.isArray(edgeData.questions) && edgeData.questions.length > 0) {
        const sanitized = validateAndSanitizeQuestions(edgeData.questions);
        if (sanitized.length > 0) {
          return {
            data: {
              quizId: edgeData.quizId,
              topic: edgeData.topic || cleanTopic,
              difficulty: edgeData.difficulty || validDifficulty,
              questions: sanitized,
              source: 'ai_gemini',
              isAiGenerated: true,
              dbPersisted: Boolean(UUID_REGEX.test(String(edgeData.quizId || ''))),
            },
            error: null,
          };
        }
      }
      edgeFailureReason = edgeError?.message || edgeData?.error || 'Live AI Edge Function returned no questions.';
    } catch (err) {
      edgeFailureReason = err?.message || 'Unable to reach live AI Edge Function.';
    }
  }

  // 2. Honest Fallback: use ONLY verified curated questions matching this subject & difficulty.
  //    Never fabricate generic template questions and claim they are AI-generated.
  if (subjectKey) {
    const curated = await getQuizQuestions(subjectSlug || resolvedSubjectId || subjectId, count, {
      difficulty: validDifficulty,
      studentId,
      subjectSlug,
      subjectName,
    });

    const verifiedList = validateAndSanitizeQuestions(
      (curated.data || []).map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
      }))
    );

    if (verifiedList.length > 0) {
      return {
        data: {
          quizId: `curated-fallback-${Date.now()}`,
          topic: cleanTopic,
          difficulty: validDifficulty,
          questions: verifiedList,
          source: 'curated_fallback',
          isAiGenerated: false,
          fallbackReason: edgeFailureReason,
          persistenceError: `Cloud ai_quizzes / Edge Function unavailable (${edgeFailureReason}); using curated fallback.`,
          shortageMessage: curated.meta?.shortageMessage || null,
          dbPersisted: false,
        },
        error: null,
      };
    }
  }

  // 3. Honest Failure: neither live AI nor a matching curated subject+difficulty pool is available.
  return {
    data: null,
    error: {
      code: 'AI_UNAVAILABLE',
      message: `Live AI generation failed (${edgeFailureReason}), and no curated ${validDifficulty} questions exist for ${subjectName || 'this subject'} yet.`,
    },
  };
}

/**
 * Saves a completed student AI quiz attempt and responses.
 */
export async function saveAiQuizAttempt(attempt) {
  const quizId = attempt.quizId || attempt.ai_quiz_id;
  const studentId = attempt.studentId || attempt.user_id;
  const score = Number(attempt.score) || 0;
  const totalQuestions = Number(attempt.totalQuestions || attempt.total_questions) || 0;
  const timeSpentSeconds = attempt.timeSpentSeconds || attempt.time_spent_seconds || null;
  const responses = attempt.responses || [];
  let persistenceError = null;

  if (
    isConfigured &&
    studentId &&
    !String(studentId).startsWith('local-') &&
    UUID_REGEX.test(String(quizId || ''))
  ) {
    try {
      const { data, error } = await supabase
        .from('ai_quiz_attempts')
        .insert({
          ai_quiz_id: quizId,
          user_id: studentId,
          submitted_answers: responses,
          score,
          total_questions: totalQuestions,
          time_spent_seconds: timeSpentSeconds,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!error && data) {
        return { data: { ...data, dbPersisted: true }, error: null };
      }
      persistenceError = error?.message || 'Unknown error saving AI quiz attempt';
      console.warn('Could not save AI quiz attempt to database:', persistenceError);
    } catch (err) {
      persistenceError = err.message;
      console.warn('Could not save AI quiz attempt to database:', err.message);
    }
  } else if (isConfigured && !UUID_REGEX.test(String(quizId || ''))) {
    persistenceError = 'Quiz ran from local/curated fallback without a cloud ai_quizzes record.';
  }

  try {
    const key = `${LOCAL_AI_ATTEMPTS_KEY}_${studentId}`;
    const raw = localStorage.getItem(key);
    const attempts = raw ? JSON.parse(raw) : [];
    const record = {
      id: 'local-attempt-' + Math.random().toString(36).slice(2, 9),
      ai_quiz_id: quizId,
      user_id: studentId,
      submitted_answers: responses,
      score,
      total_questions: totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0,
      time_spent_seconds: timeSpentSeconds,
      completed_at: new Date().toISOString(),
      dbPersisted: false,
      persistenceError,
    };
    attempts.unshift(record);
    localStorage.setItem(key, JSON.stringify(attempts.slice(0, 50)));
    return { data: record, error: null };
  } catch (err) {
    return { data: null, error: { message: err.message } };
  }
}

/**
 * Gets previous AI quiz attempts for a student.
 */
export async function getAiQuizHistory(studentId, limit = 20) {
  let cloudError = null;
  if (isConfigured && studentId && !String(studentId).startsWith('local-')) {
    try {
      const { data, error } = await supabase
        .from('ai_quiz_attempts')
        .select('*, quiz:ai_quizzes(id, topic, difficulty, subject:subjects(id, name, slug))')
        .eq('user_id', studentId)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (!error) return { data: data || [], error: null };
      cloudError = error;
    } catch (err) {
      cloudError = err;
    }
  }

  try {
    const key = `${LOCAL_AI_ATTEMPTS_KEY}_${studentId}`;
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    return { data: list.slice(0, limit), error: cloudError };
  } catch (_) {
    return { data: [], error: cloudError };
  }
}
