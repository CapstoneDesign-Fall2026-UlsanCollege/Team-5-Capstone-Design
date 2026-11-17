import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: false,
  supabase: {},
}));

import { QUIZ_BANK } from '../../src/lib/academic-catalog.js';
import {
  filterQuestionsForQuiz,
  selectQuizQuestions,
  normalizeQuestionText,
  normalizeDifficulty,
} from '../../src/lib/quiz-engine.js';
import {
  getQuizQuestions,
  recordSeenQuizQuestions,
  getLocalSeenQuestions,
} from '../../src/services/quiz.js';
import { generateAiQuiz } from '../../src/services/ai-quiz.js';

function makeLocalStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

describe('Quiz Engine — Subject, Difficulty & Repetition Prevention', () => {
  beforeEach(() => {
    globalThis.localStorage = makeLocalStorage();
  });

  it('1. Programming/Easy loads only Easy Programming questions', async () => {
    const res = await getQuizQuestions('programming', 15, {
      difficulty: 'easy',
      studentId: 'student-a',
      subjectSlug: 'programming',
      subjectName: 'Programming',
    });
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data.every((q) => q.difficulty === 'easy')).toBe(true);
    expect(res.data.every((q) => q.subject_slug === 'programming')).toBe(true);
  });

  it('2. Programming/Hard loads only Hard Programming questions (never Easy)', async () => {
    const res = await getQuizQuestions('programming', 15, {
      difficulty: 'hard',
      studentId: 'student-a',
      subjectSlug: 'programming',
      subjectName: 'Programming',
    });
    expect(res.data.length).toBe(5);
    expect(res.data.every((q) => q.difficulty === 'hard')).toBe(true);
    expect(res.meta.shortageMessage).toContain('Only 5 Hard Programming questions available');
  });

  it('3. Databases/Easy does not load Programming questions', async () => {
    const res = await getQuizQuestions('databases', 15, {
      difficulty: 'easy',
      studentId: 'student-a',
      subjectSlug: 'databases',
      subjectName: 'Databases',
    });
    const progQs = new Set(QUIZ_BANK.programming.map((x) => normalizeQuestionText(x.q)));
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data.every((q) => q.difficulty === 'easy')).toBe(true);
    expect(res.data.some((q) => progQs.has(q.fingerprint))).toBe(false);
  });

  it('4. Computer Networks/Medium loads only Medium Networks questions', async () => {
    const res = await getQuizQuestions('networks', 15, {
      difficulty: 'medium',
      studentId: 'student-a',
      subjectSlug: 'networks',
      subjectName: 'Computer Networks',
    });
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data.every((q) => q.difficulty === 'medium')).toBe(true);
    expect(res.data.every((q) => q.subject_slug === 'networks')).toBe(true);
  });

  it('5. Rejects cross-subject rows even if mixed into input pool', () => {
    const mixed = [
      { id: '1', subject_id: 'prog-uuid', question: 'What is a closure in JS?', options: ['A', 'B', 'C', 'D'], correct_answer: 0, difficulty: 'hard' },
      { id: '2', subject_id: 'db-uuid', question: 'What is 3NF in SQL?', options: ['A', 'B', 'C', 'D'], correct_answer: 0, difficulty: 'hard' },
    ];
    const filtered = filterQuestionsForQuiz(mixed, { subjectId: 'prog-uuid', difficulty: 'hard' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('6. Same quiz contains no duplicate questions (even with near-duplicate punctuation)', () => {
    const dupPool = [
      { id: '1', question: 'What is SQL?', options: ['A', 'B', 'C', 'D'], correct_answer: 0 },
      { id: '2', question: 'what is sql', options: ['A', 'B', 'C', 'D'], correct_answer: 0 },
      { id: '3', question: 'What is a primary key?', options: ['A', 'B', 'C', 'D'], correct_answer: 1 },
    ];
    const sel = selectQuizQuestions(dupPool, { limit: 10 });
    expect(sel.questions).toHaveLength(2);
  });

  it('7. New quiz excludes recently answered questions when unseen alternatives exist', async () => {
    const first = await getQuizQuestions('programming', 10, {
      difficulty: 'all',
      studentId: 'student-a',
      subjectSlug: 'programming',
      subjectName: 'Programming',
    });
    expect(first.data).toHaveLength(10);
    recordSeenQuizQuestions('student-a', 'programming', first.data);

    const second = await getQuizQuestions('programming', 10, {
      difficulty: 'all',
      studentId: 'student-a',
      subjectSlug: 'programming',
      subjectName: 'Programming',
    });
    expect(second.data).toHaveLength(10);
    const firstIds = new Set(first.data.map((q) => q.id));
    const overlap = second.data.filter((q) => firstIds.has(q.id));
    // Programming has 25 total; 15 unseen remain after 10, so second attempt must have 0 overlap!
    expect(overlap).toHaveLength(0);
    expect(second.meta.reusedCount).toBe(0);
  });

  it('8. Exhausted pool reports honest shortage/review policy', async () => {
    const allProg = await getQuizQuestions('programming', 25, {
      difficulty: 'all',
      studentId: 'student-a',
      subjectSlug: 'programming',
      subjectName: 'Programming',
    });
    recordSeenQuizQuestions('student-a', 'programming', allProg.data);

    const next = await getQuizQuestions('programming', 15, {
      difficulty: 'all',
      studentId: 'student-a',
      subjectSlug: 'programming',
      subjectName: 'Programming',
    });
    expect(next.meta.poolExhausted).toBe(true);
    expect(next.meta.shortageMessage).toContain('Reshuffling for review');
  });

  it('9. Different students have completely isolated seen-question histories', async () => {
    const a1 = await getQuizQuestions('programming', 15, {
      difficulty: 'all',
      studentId: 'student-a',
      subjectSlug: 'programming',
    });
    recordSeenQuizQuestions('student-a', 'programming', a1.data);

    const bSeen = getLocalSeenQuestions('student-b', 'programming');
    expect(bSeen.ids).toHaveLength(0);

    const b1 = await getQuizQuestions('programming', 15, {
      difficulty: 'all',
      studentId: 'student-b',
      subjectSlug: 'programming',
    });
    expect(b1.meta.unseenCount).toBe(25);
  });

  it('10. Requesting Hard on an unclassified subject returns 0 questions (never downgrades to Easy)', async () => {
    const res = await getQuizQuestions('economics', 15, {
      difficulty: 'hard',
      studentId: 'student-a',
      subjectSlug: 'economics',
      subjectName: 'Economics',
    });
    expect(res.data).toHaveLength(0);
    expect(res.meta.shortageMessage).toContain('No Hard questions are classified for Economics yet');
  });

  it('11. AI Quiz does not use fake generic templates when AI is unavailable; uses verified curated fallback or reports honest error', async () => {
    // For programming/medium, verified curated fallback exists and is honestly labeled
    const curatedFallback = await generateAiQuiz({
      subjectId: 'programming',
      subjectSlug: 'programming',
      subjectName: 'Programming',
      topic: 'Loops and Closures',
      difficulty: 'medium',
      questionCount: 5,
      studentId: 'student-a',
    });
    expect(curatedFallback.error).toBeNull();
    expect(curatedFallback.data.isAiGenerated).toBe(false);
    expect(curatedFallback.data.source).toBe('curated_fallback');
    expect(curatedFallback.data.questions.every((q) => !q.question.includes('foundational operational principles and structured criteria'))).toBe(true);

    // For economics/hard (no live AI + no classified curated pool), returns honest failure
    const honestFail = await generateAiQuiz({
      subjectId: 'economics',
      subjectSlug: 'economics',
      subjectName: 'Economics',
      topic: 'Monetary Policy',
      difficulty: 'hard',
      questionCount: 5,
      studentId: 'student-a',
    });
    expect(honestFail.data).toBeNull();
    expect(honestFail.error?.code).toBe('AI_UNAVAILABLE');
  });

  it('12. normalizeDifficulty handles invalid inputs safely', () => {
    expect(normalizeDifficulty('HARD')).toBe('hard');
    expect(normalizeDifficulty('unknown')).toBe('all');
    expect(normalizeDifficulty(null)).toBe('all');
  });
});
