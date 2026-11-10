/**
 * Quiz Service — Smart Study Companion
 * 
 * Manages quiz questions, attempts and responses in Supabase PostgreSQL
 * with local offline fallback for all 32 subjects in QUIZ_BANK.
 */
import { supabase, isConfigured } from '../lib/supabase.js';
import { QUIZ_BANK } from '../lib/academic-catalog.js';

/**
 * Get quiz questions for a subject.
 * Supports both UUID subject_id and slug (e.g. 'civil-engineering', 'programming').
 * @param {string} subjectId
 * @param {number} [limit] - Number of questions to return (shuffled).
 */
export async function getQuizQuestions(subjectId, limit) {
  if (isConfigured) {
    try {
      // First try querying by subject_id directly
      let { data, error } = await supabase
        .from('quiz_questions')
        .select('id, question, options, correct_answer, subject_id')
        .eq('subject_id', subjectId);

      // If no data and subjectId is a slug, lookup subject by slug first
      if ((!data || data.length === 0) && typeof subjectId === 'string') {
        const { data: sub } = await supabase
          .from('subjects')
          .select('id')
          .eq('slug', subjectId)
          .single();
        if (sub?.id) {
          const res = await supabase
            .from('quiz_questions')
            .select('id, question, options, correct_answer, subject_id')
            .eq('subject_id', sub.id);
          if (res.data && res.data.length > 0) {
            data = res.data;
            error = null;
          }
        }
      }

      if (!error && data && data.length > 0) {
        // Shuffle client-side (Fisher-Yates)
        const shuffled = [...data];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return { data: limit ? shuffled.slice(0, limit) : shuffled, error: null };
      }
    } catch (_) {}
  }

  // Offline / local preview fallback from QUIZ_BANK
  const list = QUIZ_BANK[subjectId] || [];
  const shuffled = list.map((item, idx) => ({
    id: `local-q-${subjectId}-${idx}`,
    question: item.q,
    options: item.options,
    correct_answer: item.answer,
    subject_id: subjectId
  }));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return { data: limit ? shuffled.slice(0, limit) : shuffled, error: null };
}

/**
 * Save a completed quiz attempt and its individual responses.
 * @param {{
 *   student_id: string,
 *   subject_id: string,
 *   mode: 'standard' | 'rapid',
 *   score: number,
 *   total_questions: number,
 *   responses: Array<{ question_id: string, selected_answer: number|null }>
 * }} attempt
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function saveQuizAttempt(attempt) {
  const studentId = attempt.student_id || attempt.studentId;
  let subjectId = attempt.subject_id || attempt.subjectId;
  const subjectSlug = attempt.subject_slug || attempt.subjectSlug;
  const totalQuestions = attempt.total_questions || attempt.totalQuestions || 0;
  const mode = attempt.mode === 'rapid' ? 'rapid' : 'standard';
  const score = attempt.score || 0;

  if (isConfigured && studentId && !String(studentId).startsWith('local-')) {
    try {
      if (!UUID_REGEX.test(String(subjectId || '')) && subjectSlug) {
        const { data: subjectRow, error: subjectError } = await supabase
          .from('subjects')
          .select('id')
          .eq('slug', subjectSlug)
          .maybeSingle();
        if (subjectError) return { data: null, error: subjectError };
        if (subjectRow?.id) subjectId = subjectRow.id;
      }

      if (!UUID_REGEX.test(String(subjectId || ''))) {
        return {
          data: null,
          error: new Error('Invalid or unresolved Supabase subject_id for quiz attempt.'),
        };
      }

      // Insert the attempt record
      const { data: attemptData, error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          student_id: studentId,
          subject_id: subjectId,
          mode,
          score,
          total_questions: totalQuestions,
        })
        .select()
        .single();

      if (attemptError || !attemptData) {
        return { data: null, error: attemptError || new Error('Quiz attempt insert returned no data.') };
      }

      // Insert individual responses (UUID questions only; unanswered mapped to NULL)
      if (attempt.responses && attempt.responses.length > 0) {
        const responses = attempt.responses
          .filter((r) => UUID_REGEX.test(String(r.question_id || r.questionId || '')))
          .map((r) => {
            const rawSelected = r.selected_answer ?? r.selectedAnswer;
            const selectedAnswer =
              typeof rawSelected === 'number' && Number.isFinite(rawSelected) && rawSelected >= 0
                ? rawSelected
                : null;
            return {
              attempt_id: attemptData.id,
              question_id: r.question_id || r.questionId,
              selected_answer: selectedAnswer,
            };
          });

        if (responses.length > 0) {
          const { error: responsesError } = await supabase
            .from('quiz_responses')
            .insert(responses);
          if (responsesError) {
            return { data: attemptData, error: responsesError };
          }
        }
      }

      return { data: attemptData, error: null };
    } catch (err) {
      console.warn('Could not save quiz attempt to cloud:', err);
      return { data: null, error: err };
    }
  }

  // Local storage fallback for attempts
  try {
    const key = `study_companion_quiz_attempts_${studentId}`;
    const prev = JSON.parse(localStorage.getItem(key) || '[]');
    const record = {
      ...attempt,
      student_id: studentId,
      subject_id: subjectId,
      mode,
      score,
      total_questions: totalQuestions,
      id: `local-attempt-${Date.now()}`,
      completed_at: new Date().toISOString()
    };
    prev.unshift(record);
    localStorage.setItem(key, JSON.stringify(prev.slice(0, 50)));
    return { data: record, error: null };
  } catch (_) {
    return { data: attempt, error: null };
  }
}

/**
 * Get quiz history for a student.
 * @param {string} studentId
 * @param {number} [limit=20]
 */
export async function getQuizHistory(studentId, limit = 20) {
  if (isConfigured && studentId && !String(studentId).startsWith('local-')) {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*, subject:subjects(id, name, slug)')
        .eq('student_id', studentId)
        .order('completed_at', { ascending: false })
        .limit(limit);
      if (error) return { data: [], error };
      return { data: data || [], error: null };
    } catch (err) {
      return { data: [], error: err };
    }
  }

  try {
    const key = `study_companion_quiz_attempts_${studentId}`;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    return { data: list.slice(0, limit), error: null };
  } catch (_) {
    return { data: [], error: null };
  }
}
