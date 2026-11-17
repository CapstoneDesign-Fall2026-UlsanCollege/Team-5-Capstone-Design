/**
 * Study Analytics 2.0 — pure logic (no DOM, no network, no imports).
 *
 * Everything here is deterministic and unit-testable. The streak/protection ALGORITHM itself is
 * NOT here: it lives once, server-side, in supabase/migrations/011_study_streak_analytics.sql
 * (study_streak_compute). This module only validates input and formats the server's summary,
 * so there is a single source of truth and nothing for the client to drift from.
 */

export const DEFAULT_DAILY_GOAL = 3;
export const DAILY_GOAL_MIN = 1;
export const DAILY_GOAL_MAX = 20;
export const PROTECTION_MAX = 2;
export const PROTECTION_EVERY_DAYS = 7;
/** The server returns calendar days for roughly this many days back. */
export const CALENDAR_HISTORY_DAYS = 400;

const toInt = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : fallback;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Coerces the get_study_summary() JSON into a safe, fully-populated object. */
export function normalizeSummary(raw) {
  const r = raw && typeof raw === 'object' ? raw : {};
  const days = Array.isArray(r.days)
    ? r.days
        .filter((d) => d && ISO_DATE.test(String(d.date)))
        .map((d) => ({
          date: String(d.date),
          tasks: toInt(d.tasks),
          kind: d.kind === 'protected' ? 'protected' : 'active',
        }))
    : [];
  const goal = toInt(r.daily_goal, DEFAULT_DAILY_GOAL);
  return {
    today: ISO_DATE.test(String(r.today)) ? String(r.today) : null,
    timezone: typeof r.timezone === 'string' && r.timezone ? r.timezone : 'UTC',
    dailyGoal: goal >= DAILY_GOAL_MIN && goal <= DAILY_GOAL_MAX ? goal : DEFAULT_DAILY_GOAL,
    currentStreak: toInt(r.current_streak),
    longestStreak: toInt(r.longest_streak),
    protectionBalance: Math.min(PROTECTION_MAX, toInt(r.protection_balance)),
    towardNextProtection: Math.min(PROTECTION_EVERY_DAYS - 1, toInt(r.toward_next_protection)),
    totalActiveDays: toInt(r.total_active_days),
    protectedDaysUsed: toInt(r.protected_days_used),
    totalCompletedTasks: toInt(r.total_completed_tasks),
    completedToday: toInt(r.completed_today),
    studiedToday: Boolean(r.studied_today),
    streakStatus: ['active_today', 'at_risk', 'none'].includes(r.streak_status) ? r.streak_status : 'none',
    trackingStarted: ISO_DATE.test(String(r.tracking_started)) ? String(r.tracking_started) : null,
    days,
    achievements: Array.isArray(r.achievements)
      ? r.achievements
          .filter((a) => a && typeof a.badge_key === 'string')
          .map((a) => ({ badgeKey: a.badge_key, earnedAt: a.earned_at || null }))
      : [],
  };
}

/** Validates a student-entered daily goal. Whole numbers 1-20 only. */
export function validateDailyGoal(input) {
  const text = String(input ?? '').trim();
  if (!/^\d+$/.test(text)) {
    return { ok: false, error: `Enter a whole number from ${DAILY_GOAL_MIN} to ${DAILY_GOAL_MAX}.` };
  }
  const value = Number(text);
  if (value < DAILY_GOAL_MIN || value > DAILY_GOAL_MAX) {
    return { ok: false, error: `Daily goal must be between ${DAILY_GOAL_MIN} and ${DAILY_GOAL_MAX} tasks.` };
  }
  return { ok: true, value };
}

/** "Tasks completed today versus the target" — never the number of tasks SCHEDULED for today. */
export function goalProgress(summary) {
  const goal = summary.dailyGoal;
  const done = summary.completedToday;
  return {
    done,
    goal,
    pct: Math.min(100, Math.round((done / goal) * 100)),
    reached: done >= goal,
    label: `${done} / ${goal} Task${goal === 1 ? '' : 's'} Completed`,
  };
}

export function streakHeadline(summary) {
  const n = summary.currentStreak;
  if (summary.streakStatus === 'active_today' && n > 0) {
    return n === 1
      ? "You've started a study streak! Keep going!"
      : `You're on a ${n}-day study streak! Keep going!`;
  }
  if (summary.streakStatus === 'at_risk' && n > 0) {
    return `Your ${n}-day streak is still going. Complete a task today to extend it.`;
  }
  if (summary.totalActiveDays > 0) {
    return "Welcome back! Every day is a fresh start. Complete a task whenever you're ready.";
  }
  return 'Complete a task to start your first study streak.';
}

export function todayStatus(summary) {
  if (summary.studiedToday) {
    return { key: 'done', label: 'Studied today', detail: `${summary.completedToday} task${summary.completedToday === 1 ? '' : 's'} completed` };
  }
  if (summary.streakStatus === 'at_risk') {
    return { key: 'open', label: 'Not yet today', detail: 'Your streak is still active until today ends' };
  }
  return { key: 'open', label: 'Not yet today', detail: 'Complete a task to count today' };
}

export function protectionNote(summary) {
  const left = PROTECTION_EVERY_DAYS - summary.towardNextProtection;
  if (summary.protectionBalance >= PROTECTION_MAX) {
    return 'Protection is full. It will automatically cover a missed day.';
  }
  return `Next protection after ${left} more active study day${left === 1 ? '' : 's'} in your streak.`;
}

// ---------------------------------------------------------------------------
// Calendar (pure date math on YYYY-MM-DD strings; never uses the browser timezone)
// ---------------------------------------------------------------------------
const pad = (n) => String(n).padStart(2, '0');
export const isoDate = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
export const monthKey = (iso) => iso.slice(0, 7);

export function addDaysIso(iso, delta) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + delta));
  return isoDate(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

export function shiftMonth(ym, delta) {
  const idx = ym.year * 12 + (ym.month - 1) + delta;
  return { year: Math.floor(idx / 12), month: (idx % 12) + 1 };
}

const ymFromIso = (iso) => ({ year: Number(iso.slice(0, 4)), month: Number(iso.slice(5, 7)) });
const ymCompare = (a, b) => a.year * 12 + a.month - (b.year * 12 + b.month);

export function monthBounds(summary) {
  if (!summary.today) return null;
  const max = ymFromIso(summary.today);
  const historyFloor = ymFromIso(addDaysIso(summary.today, -CALENDAR_HISTORY_DAYS));
  let min = summary.trackingStarted ? ymFromIso(summary.trackingStarted) : max;
  if (ymCompare(min, historyFloor) < 0) min = historyFloor;
  return { min, max };
}

/**
 * Builds a Sunday-first month grid. Cell kinds:
 *  active | protected | inactive | future | outside (padding cells)
 */
export function buildCalendarMonth(summary, ym) {
  const bounds = monthBounds(summary);
  if (!bounds) return null;
  const byDate = new Map(summary.days.map((d) => [d.date, d]));
  const first = new Date(Date.UTC(ym.year, ym.month - 1, 1));
  const lead = first.getUTCDay();
  const daysInMonth = new Date(Date.UTC(ym.year, ym.month, 0)).getUTCDate();

  const cells = [];
  for (let i = 0; i < lead; i += 1) cells.push({ kind: 'outside' });
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = isoDate(ym.year, ym.month, day);
    const hit = byDate.get(date);
    let kind = 'inactive';
    if (date > summary.today) kind = 'future';
    else if (hit) kind = hit.kind;
    cells.push({ date, day, kind, tasks: hit ? hit.tasks : 0, isToday: date === summary.today });
  }
  while (cells.length % 7 !== 0) cells.push({ kind: 'outside' });

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return {
    year: ym.year,
    month: ym.month,
    weeks,
    canPrev: ymCompare(ym, bounds.min) > 0,
    canNext: ymCompare(ym, bounds.max) < 0,
  };
}

export function describeDay(summary, iso) {
  if (!iso || !summary.today) return '';
  if (iso > summary.today) return 'This day has not happened yet.';
  const hit = summary.days.find((d) => d.date === iso);
  if (hit && hit.kind === 'protected') {
    return 'Protected day: a streak protection bridged this missed day. No tasks were completed.';
  }
  if (hit) return `${hit.tasks} task${hit.tasks === 1 ? '' : 's'} completed.`;
  if (summary.trackingStarted && iso < summary.trackingStarted) {
    return 'No activity was recorded for this date (study tracking had not started yet).';
  }
  return 'No tasks completed.';
}

/** YYYY-MM-DD of an instant as seen in a given IANA timezone. */
export function localDateKey(value, timeZone) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(d);
  } catch (_) {
    return null;
  }
}

/**
 * "All tasks due today completed": true when at least one task is DUE today (in the student's
 * timezone), every one of them is completed, and the task that was just completed is one of them.
 */
export function allDueTodayCompleted(tasks, justCompletedId, today, timeZone) {
  const due = (tasks || []).filter((t) => localDateKey(t.deadline, timeZone) === today);
  if (due.length === 0) return false;
  if (!due.some((t) => t.id === justCompletedId)) return false;
  return due.every((t) => t.completed);
}
