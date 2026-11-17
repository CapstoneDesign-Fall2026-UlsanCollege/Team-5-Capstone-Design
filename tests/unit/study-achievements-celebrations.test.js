import { describe, it, expect } from 'vitest';
import { normalizeSummary } from '../../src/lib/study-logic.js';
import { BADGE_CATALOG, buildBadgeList, newlyEarned } from '../../src/services/study-achievements.js';
import { CELEBRATION_MESSAGES, pickCelebration, markCelebrated } from '../../src/study-celebrations.js';

const summary = (over = {}) =>
  normalizeSummary({
    today: '2026-03-10',
    daily_goal: 3,
    completed_today: 0,
    current_streak: 0,
    longest_streak: 0,
    total_completed_tasks: 0,
    achievements: [],
    ...over,
  });
const badges = (...keys) => keys.map((k) => ({ badge_key: k, earned_at: '2026-03-10T00:00:00Z' }));
const memoryStorage = () => {
  const map = new Map();
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, v), map };
};

describe('badge catalog', () => {
  it('contains exactly the 8 required badges with the required thresholds', () => {
    expect(BADGE_CATALOG.map((b) => [b.key, b.metric, b.target])).toEqual([
      ['first_step', 'tasks', 1],
      ['consistent_learner', 'streak', 3],
      ['weekly_champion', 'streak', 7],
      ['dedicated_student', 'streak', 14],
      ['study_master', 'streak', 30],
      ['task_achiever', 'tasks', 10],
      ['productivity_star', 'tasks', 50],
      ['century_club', 'tasks', 100],
    ]);
  });

  it('shows locked badges with progress and unlocked badges with the earned date', () => {
    const s = summary({ longest_streak: 5, total_completed_tasks: 4, achievements: badges('first_step') });
    const list = buildBadgeList(s);
    const first = list.find((b) => b.key === 'first_step');
    const weekly = list.find((b) => b.key === 'weekly_champion');
    const achiever = list.find((b) => b.key === 'task_achiever');
    expect(first.unlocked).toBe(true);
    expect(first.earnedAt).toBe('2026-03-10T00:00:00Z');
    expect(weekly).toMatchObject({ unlocked: false, progress: 5, target: 7 });
    expect(achiever).toMatchObject({ unlocked: false, progress: 4, target: 10 });
  });

  it('ignores unknown server badge keys and keeps an earned badge even if the streak later reset', () => {
    const s = summary({ longest_streak: 7, current_streak: 0, achievements: badges('weekly_champion', 'bogus') });
    const list = buildBadgeList(s);
    expect(list).toHaveLength(8);
    expect(list.find((b) => b.key === 'weekly_champion').unlocked).toBe(true);
  });

  it('diffs newly earned badges', () => {
    const prev = summary({ achievements: badges('first_step') });
    const next = summary({ achievements: badges('first_step', 'consistent_learner') });
    expect(newlyEarned(prev, next)).toEqual(['consistent_learner']);
    expect(newlyEarned(next, next)).toEqual([]);
    expect(newlyEarned(null, next)).toEqual(['first_step', 'consistent_learner']);
  });
});

describe('pickCelebration', () => {
  const base = { storage: memoryStorage(), studentId: 'u1' };

  it('first completed task', () => {
    const r = pickCelebration({
      ...base, prev: summary(), next: summary({ total_completed_tasks: 1, completed_today: 1, achievements: badges('first_step') }),
    });
    expect(r).toMatchObject({ kind: 'first', message: CELEBRATION_MESSAGES.first, confetti: true });
  });

  it('regular completion', () => {
    const prev = summary({ total_completed_tasks: 4, completed_today: 0, achievements: badges('first_step') });
    const next = summary({ total_completed_tasks: 5, completed_today: 1, achievements: badges('first_step') });
    expect(pickCelebration({ ...base, prev, next })).toMatchObject({ kind: 'regular', confetti: false, message: CELEBRATION_MESSAGES.regular });
  });

  it('three-day and seven-day streaks (via newly earned badges)', () => {
    const had = badges('first_step');
    const r3 = pickCelebration({
      ...base,
      prev: summary({ achievements: had, completed_today: 0 }),
      next: summary({ achievements: badges('first_step', 'consistent_learner'), completed_today: 1, longest_streak: 3 }),
    });
    expect(r3).toMatchObject({ kind: 'streak3', message: CELEBRATION_MESSAGES.streak3 });

    const r7 = pickCelebration({
      ...base,
      prev: summary({ achievements: badges('first_step', 'consistent_learner'), completed_today: 0 }),
      next: summary({ achievements: badges('first_step', 'consistent_learner', 'weekly_champion'), completed_today: 1, longest_streak: 7 }),
    });
    expect(r7).toMatchObject({ kind: 'streak7', message: CELEBRATION_MESSAGES.streak7, confetti: true });
  });

  it('daily goal reached exactly once, with persisted dedupe across refresh', () => {
    const storage = memoryStorage();
    const had = badges('first_step');
    const prev = summary({ achievements: had, completed_today: 2 });
    const next = summary({ achievements: had, completed_today: 3 });
    const r = pickCelebration({ prev, next, storage, studentId: 'u1' });
    expect(r).toMatchObject({ kind: 'goal', message: CELEBRATION_MESSAGES.goal });
    markCelebrated(storage, 'u1', r.markers);

    // undo then complete again the same day -> must NOT celebrate the goal again
    const again = pickCelebration({ prev, next, storage, studentId: 'u1' });
    expect(again.kind).toBe('regular');
    // a different student on the same device is independent
    expect(pickCelebration({ prev, next, storage, studentId: 'u2' }).kind).toBe('goal');
  });

  it('goal is not celebrated when it was already reached before this completion', () => {
    const had = badges('first_step');
    const r = pickCelebration({
      ...base, prev: summary({ achievements: had, completed_today: 3 }), next: summary({ achievements: had, completed_today: 4 }),
    });
    expect(r.kind).toBe('regular');
  });

  it('all tasks due today completed (once per day)', () => {
    const storage = memoryStorage();
    const had = badges('first_step');
    const prev = summary({ achievements: had, completed_today: 0 });
    const next = summary({ achievements: had, completed_today: 1 });
    const r = pickCelebration({ prev, next, allDueTodayDone: true, storage, studentId: 'u1' });
    expect(r).toMatchObject({ kind: 'all-today', message: CELEBRATION_MESSAGES.allToday });
    markCelebrated(storage, 'u1', r.markers);
    expect(pickCelebration({ prev, next, allDueTodayDone: true, storage, studentId: 'u1' }).kind).toBe('regular');
  });

  it('never claims a milestone when the before/after summaries are unavailable', () => {
    const next = summary({ achievements: badges('first_step', 'weekly_champion'), completed_today: 3 });
    expect(pickCelebration({ ...base, prev: null, next }).kind).toBe('regular');
    expect(pickCelebration({ ...base, prev: next, next: null }).kind).toBe('regular');
    expect(pickCelebration({ ...base, prev: null, next: null, allDueTodayDone: true }).kind).toBe('regular');
  });

  it('announces other badges generically', () => {
    const had = badges('first_step');
    const r = pickCelebration({
      ...base,
      prev: summary({ achievements: had, completed_today: 0, total_completed_tasks: 9 }),
      next: summary({ achievements: badges('first_step', 'task_achiever'), completed_today: 1, total_completed_tasks: 10 }),
    });
    expect(r).toMatchObject({ kind: 'badge', message: 'Badge unlocked: Task Achiever!' });
  });

  it('survives unavailable storage', () => {
    const broken = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
    const had = badges('first_step');
    const prev = summary({ achievements: had, completed_today: 2 });
    const next = summary({ achievements: had, completed_today: 3 });
    expect(pickCelebration({ prev, next, storage: broken, studentId: 'u1' }).kind).toBe('goal');
    expect(() => markCelebrated(broken, 'u1', ['k'])).not.toThrow();
  });
});
