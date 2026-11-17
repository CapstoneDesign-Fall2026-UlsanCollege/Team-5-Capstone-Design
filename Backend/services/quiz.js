/**
 * Quiz Service — Smart Study Companion
 * 
 * Manages quiz questions, difficulty filtering, per-student repetition prevention,
 * attempts, and responses in Supabase PostgreSQL with local offline fallback.
 */
import { supabase, isConfigured } from '../lib/supabase.js';
import { QUIZ_BANK, SUBJECTS_CATALOG } from '../lib/academic-catalog.js';
import {
  normalizeDifficulty,
  questionFingerprint,
  selectQuizQuestions,
} from '../lib/quiz-engine.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SEEN_STORAGE_PREFIX = 'ssc_seen_quiz_q';

function seenStorageKey(studentId, subjectKey) {
  return `${SEEN_STORAGE_PREFIX}:${studentId || 'anon'}:${subjectKey || 'default'}`;
}

export function getLocalSeenQuestions(studentId, subjectKey) {
  if (!studentId || !subjectKey || typeof localStorage === 'undefined') {
    return { ids: [], fingerprints: [] };
  }
  try {
    const raw = localStorage.getItem(seenStorageKey(studentId, subjectKey));
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      ids: Array.isArray(parsed?.ids) ? parsed.ids : [],
      fingerprints: Array.isArray(parsed?.fingerprints) ? parsed.fingerprints : [],
    };
  } catch (_) {
    return { ids: [], fingerprints: [] };
  }
}

export function recordSeenQuizQuestions(studentId, subjectKey, questions = []) {
  if (!studentId || !subjectKey || !Array.isArray(questions) || questions.length === 0) return;
  if (typeof localStorage === 'undefined') return;
  try {
    const prev = getLocalSeenQuestions(studentId, subjectKey);
    const ids = new Set(prev.ids.map(String));
    const fps = new Set(prev.fingerprints.map(String));

    for (const q of questions) {
      if (q?.id) ids.add(String(q.id));
      const fp = q?.fingerprint || questionFingerprint(q);
      if (fp) fps.add(fp);
    }

    localStorage.setItem(
      seenStorageKey(studentId, subjectKey),
      JSON.stringify({
        ids: Array.from(ids).slice(-200),
        fingerprints: Array.from(fps).slice(-200),
      })
    );
  } catch (_) {
    // Ignore storage quota errors
  }
}

async function resolveSubjectRow(subjectIdOrSlug) {
  if (!subjectIdOrSlug) return { id: null, slug: null, name: null };
  const raw = String(subjectIdOrSlug);
  if (UUID_REGEX.test(raw)) {
    const cat = SUBJECTS_CATALOG.find((s) => s.id === raw);
    if (cat) return { id: raw, slug: cat.slug, name: cat.name };
    if (isConfigured) {
      try {
        const { data } = await supabase
          .from('subjects')
          .select('id, slug, name')
          .eq('id', raw)
          .maybeSingle();
        if (data) return data;
      } catch (_) {}
    }
    return { id: raw, slug: null, name: null };
  }

  const cat = SUBJECTS_CATALOG.find((s) => s.slug === raw);
  if (isConfigured) {
    try {
      const { data } = await supabase
        .from('subjects')
        .select('id, slug, name')
        .eq('slug', raw)
        .maybeSingle();
      if (data) return data;
    } catch (_) {}
  }
  return { id: null, slug: raw, name: cat?.name || raw };
}

async function getCloudSeenQuestionIds(studentId, subjectUuid) {
  if (!isConfigured || !studentId || String(studentId).startsWith('local-') || !UUID_REGEX.test(String(subjectUuid || ''))) {
    return [];
  }
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('id, quiz_responses(question_id)')
      .eq('student_id', studentId)
      .eq('subject_id', subjectUuid)
      .order('completed_at', { ascending: false })
      .limit(10);

    if (error || !Array.isArray(data)) return [];
    const ids = [];
    for (const attempt of data) {
      for (const resp of attempt.quiz_responses || []) {
        if (resp?.question_id) ids.push(String(resp.question_id));
      }
    }
    return ids;
  } catch (_) {
    return [];
  }
}

function buildCatalogQuestions(slug, subjectIdOverride = null) {
  const list = QUIZ_BANK[slug] || [];
  return list.map((item, idx) => ({
    id: `local-q-${slug}-${idx}`,
    question: item.q,
    options: item.options,
    correct_answer: item.answer,
    difficulty: item.difficulty || null,
    explanation: item.explanation || null,
    subject_id: subjectIdOverride || slug,
    subject_slug: slug,
  }));
}

/**
 * Get quiz questions for a subject with difficulty filtering & repetition prevention.
 * Supports both UUID subject_id and slug (e.g. 'programming', 'databases').
 */
export async function getQuizQuestions(subjectId, limit, options = {}) {
  const difficulty = normalizeDifficulty(options.difficulty || 'all');
  const studentId = options.studentId || null;
  const resolved = await resolveSubjectRow(subjectId);
  const subjectUuid = resolved.id;
  const subjectSlug = options.subjectSlug || resolved.slug || (UUID_REGEX.test(String(subjectId)) ? null : String(subjectId));
  const subjectName = options.subjectName || resolved.name || subjectSlug || 'this subject';
  const subjectKey = subjectSlug || subjectUuid || String(subjectId || '');

  let dbRows = [];

  if (isConfigured && UUID_REGEX.test(String(subjectUuid || ''))) {
    try {
      let res = await supabase
        .from('quiz_questions')
        .select('id, question, options, correct_answer, subject_id, difficulty, explanation, fingerprint')
        .eq('subject_id', subjectUuid);

      if (res.error) {
        res = await supabase
          .from('quiz_questions')
          .select('id, question, options, correct_answer, subject_id')
          .eq('subject_id', subjectUuid);
      }

      if (!res.error && Array.isArray(res.data)) {
        dbRows = res.data;
      }
    } catch (_) {}
  }

  const catalogItems = subjectSlug ? buildCatalogQuestions(subjectSlug, subjectUuid || subjectSlug) : [];
  const catalogByFp = new Map();
  for (const item of catalogItems) {
    const fp = questionFingerprint(item);
    if (fp) catalogByFp.set(fp, item);
  }

  const combinedPool = dbRows.map((row) => {
    const fp = row.fingerprint || questionFingerprint(row);
    const meta = catalogByFp.get(fp);
    return {
      ...row,
      subject_slug: subjectSlug,
      difficulty: row.difficulty || meta?.difficulty || null,
      explanation: row.explanation || meta?.explanation || null,
      fingerprint: fp,
    };
  });

  const dbFingerprints = new Set(combinedPool.map((r) => r.fingerprint));
  for (const item of catalogItems) {
    const fp = questionFingerprint(item);
    if (!dbFingerprints.has(fp)) {
      combinedPool.push({ ...item, fingerprint: fp });
    }
  }

  const localSeen = getLocalSeenQuestions(studentId, subjectKey);
  const cloudSeenIds = await getCloudSeenQuestionIds(studentId, subjectUuid);
  const seenIds = [...new Set([...localSeen.ids, ...cloudSeenIds])];
  const seenFingerprints = localSeen.fingerprints;

  const selection = selectQuizQuestions(combinedPool, {
    subjectId: subjectUuid || subjectId,
    subjectSlug,
    subjectName,
    difficulty,
    limit: limit || 15,
    seenIds,
    seenFingerprints,
    allowReuse: options.allowReuse !== false,
  });

  return {
    data: selection.questions,
    meta: {
      totalEligible: selection.totalEligible,
      unseenCount: selection.unseenCount,
      reusedCount: selection.reusedCount,
      poolExhausted: selection.poolExhausted,
      shortageMessage: selection.shortageMessage,
      difficulty,
      subjectSlug,
      subjectName,
    },
    error: null,
  };
}

/**
 * Save a completed quiz attempt and its individual responses.
 */
export async function saveQuizAttempt(attempt) {
  const studentId = attempt.student_id || attempt.studentId;
  let subjectId = attempt.subject_id || attempt.subjectId;
  const subjectSlug = attempt.subject_slug || attempt.subjectSlug;
  const totalQuestions = attempt.total_questions || attempt.totalQuestions || 0;
  const mode = attempt.mode === 'rapid' ? 'rapid' : 'standard';
  const difficulty = normalizeDifficulty(attempt.difficulty || 'all');
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

      let { data: attemptData, error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          student_id: studentId,
          subject_id: subjectId,
          mode,
          difficulty,
          score,
          total_questions: totalQuestions,
        })
        .select()
        .single();

      if (attemptError && String(attemptError.message || '').toLowerCase().includes('difficulty')) {
        const retry = await supabase
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
        attemptData = retry.data;
        attemptError = retry.error;
      }

      if (attemptError || !attemptData) {
        return { data: null, error: attemptError || new Error('Quiz attempt insert returned no data.') };
      }

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

  try {
    const key = `study_companion_quiz_attempts_${studentId}`;
    const prev = JSON.parse(localStorage.getItem(key) || '[]');
    const record = {
      ...attempt,
      student_id: studentId,
      subject_id: subjectId,
      mode,
      difficulty,
      score,
      total_questions: totalQuestions,
      id: `local-attempt-${Date.now()}`,
      completed_at: new Date().toISOString(),
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
