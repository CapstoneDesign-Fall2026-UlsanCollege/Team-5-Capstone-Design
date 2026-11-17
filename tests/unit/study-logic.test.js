import { describe, it, expect } from 'vitest';
import {
  normalizeSummary,
  validateDailyGoal,
  goalProgress,
  streakHeadline,
  todayStatus,
  protectionNote,
  buildCalendarMonth,
  describeDay,
  monthBounds,
  shiftMonth,
  addDaysIso,
  localDateKey,
  allDueTodayCompleted,
} from '../../src/lib/study-logic.js';

const raw = (over = {}) => ({
  today: '2026-03-10',
  timezone: 'Asia/Seoul',
  daily_goal: 3,
  current_streak: 5,
  longest_streak: 9,
  protection_balance: 1,
  toward_next_protection: 5,
  total_active_days: 12,
  protected_days_used: 1,
  total_completed_tasks: 20,
  completed_today: 2,
  studied_today: true,
  streak_status: 'active_today',
  tracking_started: '2026-02-20',
  days: [
    { date: '2026-03-09', tasks: 1, kind: 'active' },
    { date: '2026-03-08', tasks: 0, kind: 'protected' },
    { date: '2026-03-10', tasks: 2, kind: 'active' },
  ],
  achievements: [{ badge_key: 'first_step', earned_at: '2026-02-20T01:00:00Z' }],
  ...over,
});

describe('normalizeSummary', () => {
  it('maps server fields and tolerates garbage', () => {
    const s = normalizeSummary(raw());
    expect(s.currentStreak).toBe(5);
    expect(s.dailyGoal).toBe(3);
    expect(s.days).toHaveLength(3);
    expect(s.achievements).toEqual([{ badgeKey: 'first_step', earnedAt: '2026-02-20T01:00:00Z' }]);

    const bad = normalizeSummary({ current_streak: 'x', protection_balance: 99, daily_goal: 500, days: [{ date: 'nope' }], today: 'bad' });
    expect(bad.currentStreak).toBe(0);
    expect(bad.protectionBalance).toBe(2);
    expect(bad.dailyGoal).toBe(3);
    expect(bad.days).toEqual([]);
    expect(bad.today).toBeNull();
    expect(normalizeSummary(null).streakStatus).toBe('none');
  });
});

describe('daily goal', () => {
  it('validates whole numbers 1-20 only', () => {
    expect(validateDailyGoal('3')).toEqual({ ok: true, value: 3 });
    expect(validateDailyGoal(20).ok).toBe(true);
    for (const bad of ['0', '21', '-1', '2.5', 'abc', '', null, undefined]) {
      expect(validateDailyGoal(bad).ok).toBe(false);
    }
  });

  it('shows tasks completed today vs the target (not scheduled tasks)', () => {
    const p = goalProgress(normalizeSummary(raw({ completed_today: 2, daily_goal: 3 })));
    expect(p.label).toBe('2 / 3 Tasks Completed');
    expect(p.pct).toBe(67);
    expect(p.reached).toBe(false);
    expect(goalProgress(normalizeSummary(raw({ completed_today: 5, daily_goal: 3 }))).pct).toBe(100);
    expect(goalProgress(normalizeSummary(raw({ completed_today: 1, daily_goal: 1 }))).label).toBe('1 / 1 Task Completed');
  });
});

describe('streak messaging', () => {
  it('celebrates an active streak with the day count', () => {
    expect(streakHeadline(normalizeSummary(raw({ current_streak: 5 })))).toBe("You're on a 5-day study streak! Keep going!");
    expect(streakHeadline(normalizeSummary(raw({ current_streak: 1 })))).toBe("You've started a study streak! Keep going!");
  });

  it('keeps an at-risk streak visible without pressure', () => {
    const s = normalizeSummary(raw({ streak_status: 'at_risk', studied_today: false, completed_today: 0 }));
    expect(streakHeadline(s)).toContain('still going');
    expect(todayStatus(s).label).toBe('Not yet today');
  });

  it('welcomes students back after a break and guides brand-new students', () => {
    const back = normalizeSummary(raw({ current_streak: 0, streak_status: 'none', studied_today: false }));
    expect(streakHeadline(back)).toMatch(/Welcome back/);
    const fresh = normalizeSummary({ total_active_days: 0 });
    expect(streakHeadline(fresh)).toMatch(/start your first study streak/);
  });

  it('explains protection', () => {
    expect(protectionNote(normalizeSummary(raw({ toward_next_protection: 5, protection_balance: 1 })))).toMatch(/2 more active study days/);
    expect(protectionNote(normalizeSummary(raw({ protection_balance: 2 })))).toMatch(/full/);
  });
});

describe('calendar', () => {
  const s = normalizeSummary(raw());

  it('builds a Sunday-first grid and classifies days', () => {
    const cal = buildCalendarMonth(s, { year: 2026, month: 3 });
    const cells = cal.weeks.flat().filter((c) => c.kind !== 'outside');
    expect(cells).toHaveLength(31);
    expect(cal.weeks.every((w) => w.length === 7)).toBe(true);
    // March 1, 2026 is a Sunday => no leading padding
    expect(cal.weeks[0][0]).toMatchObject({ date: '2026-03-01', kind: 'inactive' });
    const by = Object.fromEntries(cells.map((c) => [c.date, c]));
    expect(by['2026-03-09'].kind).toBe('active');
    expect(by['2026-03-10']).toMatchObject({ kind: 'active', isToday: true, tasks: 2 });
    expect(by['2026-03-08'].kind).toBe('protected');
    expect(by['2026-03-11'].kind).toBe('future');
  });

  it('bounds navigation to tracking start .. today', () => {
    const b = monthBounds(s);
    expect(b.min).toEqual({ year: 2026, month: 2 });
    expect(b.max).toEqual({ year: 2026, month: 3 });
    expect(buildCalendarMonth(s, { year: 2026, month: 3 })).toMatchObject({ canPrev: true, canNext: false });
    expect(buildCalendarMonth(s, { year: 2026, month: 2 })).toMatchObject({ canPrev: false, canNext: true });
  });

  it('describes a selected day', () => {
    expect(describeDay(s, '2026-03-10')).toBe('2 tasks completed.');
    expect(describeDay(s, '2026-03-09')).toBe('1 task completed.');
    expect(describeDay(s, '2026-03-08')).toMatch(/Protected day/);
    expect(describeDay(s, '2026-03-05')).toBe('No tasks completed.');
    expect(describeDay(s, '2026-03-20')).toMatch(/not happened yet/);
    expect(describeDay(s, '2026-02-01')).toMatch(/tracking had not started/);
  });

  it('shows an empty calendar (no activity) without errors', () => {
    const empty = normalizeSummary({ today: '2026-03-10' });
    const cal = buildCalendarMonth(empty, { year: 2026, month: 3 });
    expect(cal.weeks.flat().filter((c) => c.kind === 'active')).toHaveLength(0);
  });

  it('does month and day arithmetic across boundaries', () => {
    expect(shiftMonth({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
    expect(shiftMonth({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
    expect(addDaysIso('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDaysIso('2028-03-01', -1)).toBe('2028-02-29');
  });
});

describe('timezone-aware helpers', () => {
  it('computes the calendar date in the student timezone', () => {
    // 2026-03-10T16:30Z is already Mar 11 in Seoul (UTC+9) but still Mar 10 in Los Angeles.
    expect(localDateKey('2026-03-10T16:30:00Z', 'Asia/Seoul')).toBe('2026-03-11');
    expect(localDateKey('2026-03-10T16:30:00Z', 'America/Los_Angeles')).toBe('2026-03-10');
    expect(localDateKey('garbage', 'UTC')).toBeNull();
  });

  it('detects "all tasks due today completed" only when the completed task was due today', () => {
    const tasks = [
      { id: 'a', deadline: '2026-03-10T03:00:00Z', completed: true },
      { id: 'b', deadline: '2026-03-10T05:00:00Z', completed: true },
      { id: 'c', deadline: '2026-03-12T05:00:00Z', completed: false },
    ];
    expect(allDueTodayCompleted(tasks, 'b', '2026-03-10', 'UTC')).toBe(true);
    expect(allDueTodayCompleted(tasks, 'c', '2026-03-10', 'UTC')).toBe(false); // not due today
    tasks[0].completed = false;
    expect(allDueTodayCompleted(tasks, 'b', '2026-03-10', 'UTC')).toBe(false);
    expect(allDueTodayCompleted([], 'x', '2026-03-10', 'UTC')).toBe(false);
  });
});
