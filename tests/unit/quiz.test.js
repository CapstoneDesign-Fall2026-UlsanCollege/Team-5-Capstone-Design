import { describe, it, expect } from 'vitest';

function calculateQuizScore(questions, answers) {
    const correct = questions.reduce((sum, item, index) => {
        return sum + (answers[index] === item.answer ? 1 : 0);
    }, 0);
    const total = questions.length;
    const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
    return { correct, total, percent };
}

describe('Quiz Scoring and Timer Calculations', () => {
    const sampleQuestions = [
        { q: 'Q1', options: ['A', 'B', 'C', 'D'], answer: 1 },
        { q: 'Q2', options: ['A', 'B', 'C', 'D'], answer: 0 },
        { q: 'Q3', options: ['A', 'B', 'C', 'D'], answer: 3 },
    ];

    it('scores 100% when all answers match correct options', () => {
        const answers = [1, 0, 3];
        const res = calculateQuizScore(sampleQuestions, answers);
        expect(res.correct).toBe(3);
        expect(res.percent).toBe(100);
    });

    it('handles partially correct answers accurately', () => {
        const answers = [1, 2, 3]; // index 1 is wrong (expected 0)
        const res = calculateQuizScore(sampleQuestions, answers);
        expect(res.correct).toBe(2);
        expect(res.percent).toBe(67);
    });

    it('treats unanswered or null choices as incorrect', () => {
        const answers = [1, null, undefined];
        const res = calculateQuizScore(sampleQuestions, answers);
        expect(res.correct).toBe(1);
        expect(res.percent).toBe(33);
    });

    it('computes rapid quiz time remaining from deadline', () => {
        const now = Date.now();
        const deadline = now + 15400; // 15.4 seconds left
        const timeLeft = Math.max(0, Math.ceil((deadline - now) / 1000));
        expect(timeLeft).toBe(16);
    });
});

