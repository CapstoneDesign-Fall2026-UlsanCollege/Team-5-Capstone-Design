/**
 * Quiz Service
 * 
 * Manages quiz questions, attempts and responses in Supabase PostgreSQL.
 * Replaces the localStorage-based quiz system from the original app.
 */
import { supabase } from '../lib/supabase.js';

/**
 * Get quiz questions for a subject.
 * @param {string} subjectId
 * @param {number} [limit] - Number of questions to return (shuffled).
 */
export async function getQuizQuestions(subjectId, limit) {
  let query = supabase
    .from('quiz_questions')
    .select('id, question, options, correct_answer, subject_id')
    .eq('subject_id', subjectId);

  const { data, error } = await query;

  if (error || !data) return { data, error };

  // Shuffle client-side (Fisher-Yates)
  const shuffled = [...data];
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
export async function saveQuizAttempt(attempt) {
  // Insert the attempt record
  const { data: attemptData, error: attemptError } = await supabase
    .from('quiz_attempts')
    .insert({
      student_id: attempt.student_id,
      subject_id: attempt.subject_id,
      mode: attempt.mode,
      score: attempt.score,
      total_questions: attempt.total_questions,
    })
    .select()
    .single();

  if (attemptError || !attemptData) return { data: null, error: attemptError };

  // Insert individual responses
  if (attempt.responses && attempt.responses.length > 0) {
    const responses = attempt.responses.map((r) => ({
      attempt_id: attemptData.id,
      question_id: r.question_id,
      selected_answer: r.selected_answer,
    }));

    const { error: responsesError } = await supabase
      .from('quiz_responses')
      .insert(responses);

    if (responsesError) {
      console.error('Error saving quiz responses:', responsesError.message);
    }
  }

  return { data: attemptData, error: null };
}

/**
 * Get quiz history for a student.
 * @param {string} studentId
 * @param {number} [limit=20]
 */
export async function getQuizHistory(studentId, limit = 20) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*, subject:subjects(id, name, slug)')
    .eq('student_id', studentId)
    .order('completed_at', { ascending: false })
    .limit(limit);
  return { data, error };
}

/**
 * Get detailed results for a specific attempt (with responses).
 * @param {string} attemptId
 */
export async function getAttemptDetail(attemptId) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select(`
      *,
      subject:subjects(id, name, slug),
      responses:quiz_responses(
        id,
        selected_answer,
        question:quiz_questions(id, question, options, correct_answer)
      )
    `)
    .eq('id', attemptId)
    .single();
  return { data, error };
}

