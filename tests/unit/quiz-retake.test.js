import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { snapshotQuizConfig, createQuizAttemptState } from '../../src/lib/quiz-engine.js';

describe('Retake Quiz Configuration & State Reset', () => {
  it('RT-01/RT-02: snapshots standard quiz config preserving subject and difficulty', () => {
    const cfg = snapshotQuizConfig({
      mode: 'standard',
      subject: 'programming',
      difficulty: 'hard',
      count: 15,
    });
    expect(cfg).toEqual({
      mode: 'standard',
      subject: 'programming',
      difficulty: 'hard',
      topic: '',
      count: 15,
    });
  });

  it('RT-03: rapid quiz attempt state resets timer to 30 seconds and clears deadline/answers', () => {
    const questions = Array.from({ length: 10 }, (_, i) => ({
      id: `q-${i}`,
      q: `Question ${i}`,
      options: ['A', 'B', 'C', 'D'],
      answer: 0,
    }));
    const state = createQuizAttemptState({
      mode: 'rapid',
      subject: 'networks',
      difficulty: 'medium',
      questions,
    });
    expect(state.mode).toBe('rapid');
    expect(state.subject).toBe('networks');
    expect(state.difficulty).toBe('medium');
    expect(state.index).toBe(0);
    expect(state.timeLeft).toBe(30);
    expect(state.deadline).toBe(0);
    expect(state.finished).toBe(false);
    expect(state.answers).toEqual(new Array(10).fill(null));
  });

  it('RT-04: snapshots AI quiz config preserving topic, difficulty, and count', () => {
    const cfg = snapshotQuizConfig({
      mode: 'ai',
      subject: 'databases',
      topic: 'Normalization',
      difficulty: 'hard',
      count: 10,
    });
    expect(cfg).toEqual({
      mode: 'ai',
      subject: 'databases',
      difficulty: 'hard',
      topic: 'Normalization',
      count: 10,
    });

    const state = createQuizAttemptState({
      ...cfg,
      aiQuizId: 'ai-123',
      source: 'ai_gemini',
      questions: [{ id: '1', q: 'Q1', options: ['a', 'b', 'c', 'd'], answer: 1 }],
    });
    expect(state.mode).toBe('ai');
    expect(state.topic).toBe('Normalization');
    expect(state.finished).toBe(false);
    expect(state.answers).toEqual([null]);
  });

  it('RT-05/RT-07: multiple sequential retakes start clean with no leaked answers', () => {
    const qs = [
      { id: '1', q: 'Q1', options: ['a', 'b', 'c', 'd'], answer: 0 },
      { id: '2', q: 'Q2', options: ['a', 'b', 'c', 'd'], answer: 1 },
    ];
    const attempt1 = createQuizAttemptState({ mode: 'standard', subject: 'programming', difficulty: 'easy', questions: qs });
    attempt1.answers[0] = 2;
    attempt1.answers[1] = 1;
    attempt1.index = 1;
    attempt1.finished = true;

    const attempt2 = createQuizAttemptState({ mode: 'standard', subject: 'programming', difficulty: 'easy', questions: qs });
    expect(attempt2.index).toBe(0);
    expect(attempt2.finished).toBe(false);
    expect(attempt2.answers).toEqual([null, null]);

    const attempt3 = createQuizAttemptState({ mode: 'standard', subject: 'programming', difficulty: 'easy', questions: qs });
    expect(attempt3.answers).toEqual([null, null]);
    expect(attempt3.finished).toBe(false);
  });

  it('RT-06/RT-09: public/app.js wires #quiz-retake-btn to retakeCurrentQuiz, keeps #quiz-to-plan-btn on setup, and guards finishQuiz', () => {
    const appJs = readFileSync(resolve('public/app.js'), 'utf8');
    expect(appJs).toContain("quizRetake.addEventListener('click', () => retakeCurrentQuiz())");
    expect(appJs).toContain("quizToPlan.addEventListener('click', () => setQuizStage('setup'))");
    expect(appJs).toContain('if (quiz.finished || !quiz.questions || quiz.questions.length === 0) return;');
    expect(appJs).toContain('if (isRetakingQuiz) return;');
  });
});
