/**
 * Study Analytics 2.0 — UI controller.
 *
 * Renders into three mount points that sit AROUND the five existing analytics components
 * (it never touches them):
 *   #study-streak-section    directly below the Study Task Analytics header
 *   #study-calendar-section  below Weekly Activity / Workload Breakdown
 *   #study-badges-section    below Subject-Wise Completion Progress
 *
 * Data source: one server summary (get_study_summary). No local streak state is kept.
 */
import {
  allDueTodayCompleted,
  buildCalendarMonth,
  describeDay,
  goalProgress,
  monthBounds,
  protectionNote,
  shiftMonth,
  streakHeadline,
  todayStatus,
  DAILY_GOAL_MAX,
  DAILY_GOAL_MIN,
  PROTECTION_MAX,
} from './lib/study-logic.js';
import { buildBadgeList } from './services/study-achievements.js';
import { fetchStudySummary, isCloudStudent, syncStudyTimezone } from './services/study-streak.js';
import { saveDailyGoal } from './services/study-goals.js';
import { markCelebrated, pickCelebration, showCelebration } from './study-celebrations.js';

const state = {
  ctx: null,
  summary: null,
  status: 'idle', // idle | loading | ready | unavailable | local
  calMonth: null,
  selectedDate: null,
  tzReady: null,
  requestSeq: 0,
  listenersAttached: false,
};

const $ = (id) => document.getElementById(id);

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const studentId = () => state.ctx?.getStudentId?.() || null;
const notify = (message) => state.ctx?.toast?.(message);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export function initStudyAnalytics(ctx) {
  state.ctx = ctx;
  attachListeners();
}

/** Resolves once the timezone has been saved (or failed). Call before completing a task. */
export function ensureStudyTimezoneSynced() {
  return state.tzReady || Promise.resolve();
}

export async function loadStudyAnalytics() {
  const id = studentId();
  if (!id) return;
  if (!isCloudStudent(id)) {
    state.status = 'local';
    renderStudyAnalytics();
    return;
  }
  state.status = state.summary ? state.status : 'loading';
  renderStudyAnalytics();
  state.tzReady = syncStudyTimezone(id).catch(() => null);
  await state.tzReady;
  await refreshSummary();
}

async function refreshSummary() {
  const id = studentId();
  const seq = ++state.requestSeq;
  const { data, error } = await fetchStudySummary(id);
  if (seq !== state.requestSeq) return null; // a newer request superseded this one
  if (error || !data) {
    if (!state.summary) state.status = 'unavailable';
    renderStudyAnalytics();
    return null;
  }
  state.summary = data;
  state.status = 'ready';
  if (!state.calMonth || !state.selectedDate) {
    const today = data.today;
    state.calMonth = { year: Number(today.slice(0, 4)), month: Number(today.slice(5, 7)) };
    state.selectedDate = today;
  }
  renderStudyAnalytics();
  return data;
}

/**
 * Call ONLY after the task update has succeeded in Supabase. The completion event itself is
 * written by the database trigger in the same transaction; this just reads the result and
 * decides what to celebrate. If the summary can't be read, only the plain message is shown.
 */
export async function handleTaskCompleted(task) {
  try {
    const prev = state.summary;
    const next = isCloudStudent(studentId()) ? await refreshSummary() : null;
    const id = studentId() || '';
    const allDone = next
      ? allDueTodayCompleted(state.ctx?.getTasks?.() || [], task?.id, next.today, next.timezone)
      : false;
    const result = pickCelebration({
      prev, next, allDueTodayDone: allDone, storage: safeStorage(), studentId: id,
    });
    showCelebration(result);
    markCelebrated(safeStorage(), id, result.markers);
  } catch (err) {
    console.warn('Study celebration skipped:', err);
  }
}

/** Call after a completion was successfully undone, to keep the analytics honest. */
export async function handleTaskUndone() {
  if (isCloudStudent(studentId())) await refreshSummary();
}

function safeStorage() {
  try { return window.localStorage; } catch (_) { return null; }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
export function renderStudyAnalytics() {
  if (typeof document === 'undefined') return;
  const streakEl = $('study-streak-section');
  const calEl = $('study-calendar-section');
  const badgeEl = $('study-badges-section');
  if (!streakEl && !calEl && !badgeEl) return;

  if (state.status !== 'ready' || !state.summary) {
    const message = {
      idle: '',
      loading: 'Loading your study streak…',
      local: 'Study streaks, goals and badges are saved to your cloud account. Sign in with a cloud account to use them.',
      unavailable: 'Study streak tracking is not available right now. Your tasks and analytics are not affected.',
    }[state.status] || '';
    const notice = message
      ? `<div class="study-notice" role="status"><i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>${esc(message)}</span></div>`
      : '';
    if (streakEl) streakEl.innerHTML = notice;
    if (calEl) calEl.innerHTML = '';
    if (badgeEl) badgeEl.innerHTML = '';
    return;
  }

  if (streakEl) streakEl.innerHTML = renderStreakCards(state.summary);
  if (calEl) calEl.innerHTML = renderCalendar(state.summary);
  if (badgeEl) badgeEl.innerHTML = renderBadges(state.summary);
}

function renderStreakCards(s) {
  const goal = goalProgress(s);
  const status = todayStatus(s);
  const flameClass = s.currentStreak > 0 ? 'is-lit' : '';
  const shields = Array.from({ length: PROTECTION_MAX }, (_, i) =>
    `<i class="fa-solid fa-shield-halved study-shield ${i < s.protectionBalance ? 'is-full' : ''}" aria-hidden="true"></i>`,
  ).join('');

  return `
    <p class="study-encourage" role="status"><i class="fa-solid fa-fire ${flameClass}" aria-hidden="true"></i> ${esc(streakHeadline(s))}</p>
    <div class="study-card-grid">
      <article class="study-card" aria-label="Current study streak">
        <div class="study-card-head"><i class="fa-solid fa-fire study-flame ${flameClass}" aria-hidden="true"></i><span>Current Study Streak</span></div>
        <strong class="study-card-value">${s.currentStreak}<small> day${s.currentStreak === 1 ? '' : 's'}</small></strong>
        <p class="study-card-note">${s.currentStreak > 0 ? 'Consecutive days with a completed task.' : 'Complete a task to begin.'}</p>
      </article>
      <article class="study-card" aria-label="Longest study streak">
        <div class="study-card-head"><i class="fa-solid fa-trophy" aria-hidden="true"></i><span>Longest Study Streak</span></div>
        <strong class="study-card-value">${s.longestStreak}<small> day${s.longestStreak === 1 ? '' : 's'}</small></strong>
        <p class="study-card-note">Your best run so far.</p>
      </article>
      <article class="study-card" aria-label="Daily study goal">
        <div class="study-card-head"><i class="fa-solid fa-bullseye" aria-hidden="true"></i><span>Daily Study Goal</span></div>
        <strong class="study-card-value study-card-value-sm">${esc(goal.label)}</strong>
        <div class="study-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${goal.pct}" aria-label="Daily goal progress">
          <div class="study-progress-fill ${goal.reached ? 'is-done' : ''}" style="width: ${goal.pct}%;"></div>
        </div>
        <form class="study-goal-form" data-goal-form>
          <label for="study-goal-input">Target</label>
          <input id="study-goal-input" type="number" inputmode="numeric" min="${DAILY_GOAL_MIN}" max="${DAILY_GOAL_MAX}" step="1" value="${s.dailyGoal}" required>
          <button type="submit" class="study-goal-save">Save</button>
        </form>
        <p class="study-goal-error" data-goal-error hidden></p>
      </article>
      <article class="study-card" aria-label="Streak protection">
        <div class="study-card-head"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i><span>Streak Protection</span></div>
        <strong class="study-card-value">${s.protectionBalance}<small> / ${PROTECTION_MAX}</small> <span class="study-shields">${shields}</span></strong>
        <p class="study-card-note">${esc(protectionNote(s))}</p>
        <p class="study-card-note">One protection automatically covers one missed day. It never counts as a study day.</p>
      </article>
      <article class="study-card" aria-label="Today's study status">
        <div class="study-card-head"><i class="fa-solid fa-calendar-day" aria-hidden="true"></i><span>Today's Study Status</span></div>
        <strong class="study-card-value study-card-value-sm ${status.key === 'done' ? 'is-positive' : ''}">${esc(status.label)}</strong>
        <p class="study-card-note">${esc(status.detail)}</p>
      </article>
      <article class="study-card" aria-label="Total active study days">
        <div class="study-card-head"><i class="fa-solid fa-calendar-check" aria-hidden="true"></i><span>Total Active Study Days</span></div>
        <strong class="study-card-value">${s.totalActiveDays}<small> day${s.totalActiveDays === 1 ? '' : 's'}</small></strong>
        <p class="study-card-note">Days with at least one completed task.</p>
      </article>
    </div>`;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const KIND_LABEL = { active: 'Completed study day', protected: 'Protected streak day', inactive: 'Inactive day', future: 'Upcoming' };

function renderCalendar(s) {
  const bounds = monthBounds(s);
  const cal = bounds ? buildCalendarMonth(s, state.calMonth) : null;
  if (!cal) return '';

  const empty = s.totalActiveDays === 0
    ? `<p class="study-calendar-empty">No study activity yet. Complete a task and it will appear here. Only completions recorded after Study Analytics 2.0 was enabled are shown.</p>`
    : '';

  const rows = cal.weeks.map((week) => `
    <div class="study-cal-row" role="row">
      ${week.map((c) => {
        if (c.kind === 'outside') return '<span class="study-cal-cell is-outside" role="gridcell" aria-hidden="true"></span>';
        const classes = ['study-cal-cell', `is-${c.kind}`, c.isToday ? 'is-today' : '', c.date === state.selectedDate ? 'is-selected' : ''].filter(Boolean).join(' ');
        const label = `${MONTH_NAMES[cal.month - 1]} ${c.day}: ${KIND_LABEL[c.kind]}${c.kind === 'active' ? `, ${c.tasks} task${c.tasks === 1 ? '' : 's'}` : ''}${c.isToday ? ' (today)' : ''}`;
        return `<button type="button" class="${classes}" role="gridcell" data-cal-day="${c.date}" aria-label="${esc(label)}" ${c.kind === 'future' ? 'disabled' : ''}>${c.day}</button>`;
      }).join('')}
    </div>`).join('');

  return `
    <section class="plan-board study-calendar" aria-labelledby="study-cal-title">
      <div class="board-toolbar">
        <h2 id="study-cal-title">Study Consistency Calendar</h2>
        <span class="muted">Days you completed tasks (not scheduled tasks)</span>
      </div>
      <div class="study-cal-nav">
        <button type="button" class="study-cal-nav-btn" data-cal-prev aria-label="Previous month" ${cal.canPrev ? '' : 'disabled'}><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
        <strong>${MONTH_NAMES[cal.month - 1]} ${cal.year}</strong>
        <button type="button" class="study-cal-nav-btn" data-cal-next aria-label="Next month" ${cal.canNext ? '' : 'disabled'}><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
      </div>
      <div class="study-cal-grid" role="grid" aria-label="Study activity for ${MONTH_NAMES[cal.month - 1]} ${cal.year}">
        <div class="study-cal-row study-cal-head" role="row">${WEEKDAYS.map((d) => `<span role="columnheader">${d}</span>`).join('')}</div>
        ${rows}
      </div>
      <ul class="study-cal-legend" aria-label="Calendar legend">
        <li><span class="legend-swatch is-active"></span> Completed study day</li>
        <li><span class="legend-swatch is-protected"></span> Protected streak day</li>
        <li><span class="legend-swatch is-inactive"></span> Inactive day</li>
        <li><span class="legend-swatch is-today"></span> Today</li>
      </ul>
      <p class="study-cal-detail" role="status" data-cal-detail>${state.selectedDate ? `<strong>${esc(formatDay(state.selectedDate))}:</strong> ${esc(describeDay(s, state.selectedDate))}` : ''}</p>
      ${empty}
    </section>`;
}

function formatDay(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
}

function formatEarned(iso, tz) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, { timeZone: tz, year: 'numeric', month: 'short', day: 'numeric' });
  } catch (_) {
    return new Date(iso).toLocaleDateString();
  }
}

function renderBadges(s) {
  const list = buildBadgeList(s);
  const earned = list.filter((b) => b.unlocked).length;
  return `
    <section class="plan-board study-badges" aria-labelledby="study-badges-title">
      <div class="board-toolbar">
        <h2 id="study-badges-title">Achievement Badges</h2>
        <span class="muted">${earned} of ${list.length} unlocked</span>
      </div>
      <div class="study-badge-grid">
        ${list.map((b) => `
          <article class="study-badge ${b.unlocked ? 'is-unlocked' : 'is-locked'}" aria-label="${esc(b.name)}: ${b.unlocked ? 'unlocked' : 'locked'}">
            <span class="study-badge-icon"><i class="fa-solid ${b.icon}" aria-hidden="true"></i></span>
            <strong>${esc(b.name)}</strong>
            <p>${esc(b.description)}</p>
            <small>${b.unlocked
              ? `Earned ${esc(formatEarned(b.earnedAt, s.timezone))}`
              : `Locked · ${b.progress} / ${b.target}`}</small>
          </article>`).join('')}
      </div>
    </section>`;
}

// ---------------------------------------------------------------------------
// Events (delegated, attached once)
// ---------------------------------------------------------------------------
function attachListeners() {
  if (state.listenersAttached || typeof document === 'undefined') return;
  state.listenersAttached = true;

  const view = $('view-analytics') || document;

  view.addEventListener('click', (e) => {
    if (!state.summary) return;
    const prev = e.target.closest('[data-cal-prev]');
    const next = e.target.closest('[data-cal-next]');
    const day = e.target.closest('[data-cal-day]');
    if (prev || next) {
      const bounds = monthBounds(state.summary);
      const target = shiftMonth(state.calMonth, prev ? -1 : 1);
      const idx = (m) => m.year * 12 + m.month;
      if (bounds && idx(target) >= idx(bounds.min) && idx(target) <= idx(bounds.max)) {
        state.calMonth = target;
        renderStudyAnalytics();
      }
    } else if (day) {
      state.selectedDate = day.dataset.calDay;
      renderStudyAnalytics();
    }
  });

  view.addEventListener('submit', async (e) => {
    const form = e.target.closest('[data-goal-form]');
    if (!form) return;
    e.preventDefault();
    const input = form.querySelector('input');
    const errEl = $('study-streak-section')?.querySelector('[data-goal-error]');
    const setError = (msg) => {
      if (!errEl) return;
      errEl.textContent = msg || '';
      errEl.hidden = !msg;
    };
    setError('');
    const { data, error } = await saveDailyGoal(studentId(), input.value);
    if (error) {
      setError(error.message || 'Could not save your daily goal. Please try again.');
      return;
    }
    state.summary = { ...state.summary, dailyGoal: data };
    renderStudyAnalytics();
    notify(`Daily goal saved: ${data} task${data === 1 ? '' : 's'} per day`);
  });
}
