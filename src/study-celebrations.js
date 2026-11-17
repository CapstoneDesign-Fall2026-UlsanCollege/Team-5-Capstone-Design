/**
 * Study Celebrations — choose and show a congratulations message after a task completion.
 *
 * pickCelebration() is pure (unit-tested). The DOM helpers only run in a browser.
 * Rules: celebrate only after the completion was persisted (caller guarantees this); show ONE
 * dismissible toast at a time; milestone dedupe survives refresh via localStorage; confetti is
 * skipped when the user prefers reduced motion.
 */
import { badgeName, newlyEarned } from './services/study-achievements.js';

export const CELEBRATION_MESSAGES = {
  first: "Congratulations! You've completed your first study task!",
  regular: 'Great work! Another task completed. Keep up the momentum!',
  streak3: "You're on fire! Three consecutive days of studying!",
  streak7: "Amazing! You've maintained your study streak for an entire week!",
  streak14: "Incredible! Two weeks in a row. You're a dedicated student!",
  streak30: "Legendary! A 30-day study streak. You're a Study Master!",
  goal: "Fantastic! You've completed your daily study goal!",
  allToday: "Excellent work! You've finished all your tasks scheduled for today!",
};

const STORAGE_PREFIX = 'ssc_celebrated';
const storageKey = (studentId, key) => `${STORAGE_PREFIX}:${studentId}:${key}`;

function seen(storage, studentId, key) {
  try {
    return storage?.getItem(storageKey(studentId, key)) === '1';
  } catch (_) {
    return false;
  }
}

export function markCelebrated(storage, studentId, keys) {
  try {
    (keys || []).forEach((k) => storage?.setItem(storageKey(studentId, k), '1'));
  } catch (_) { /* storage may be unavailable; worst case a message repeats */ }
}

/**
 * @param {object} ctx
 * @param {object|null} ctx.prev  summary BEFORE the completion (normalized) or null
 * @param {object|null} ctx.next  summary AFTER the completion (normalized) or null
 * @param {boolean} ctx.allDueTodayDone  see allDueTodayCompleted()
 * @param {Storage} [ctx.storage]
 * @param {string} [ctx.studentId]
 * @returns {{kind:string, message:string, confetti:boolean, markers:string[]}}
 */
export function pickCelebration(ctx) {
  const { prev, next, allDueTodayDone = false, storage, studentId = '' } = ctx;
  const regular = { kind: 'regular', message: CELEBRATION_MESSAGES.regular, confetti: false, markers: [] };

  // Without a trustworthy before/after pair we never claim a milestone.
  if (!prev || !next) return regular;

  const badges = newlyEarned(prev, next);
  const has = (key) => badges.includes(key);

  if (has('study_master')) return { kind: 'streak30', message: CELEBRATION_MESSAGES.streak30, confetti: true, markers: [] };
  if (has('dedicated_student')) return { kind: 'streak14', message: CELEBRATION_MESSAGES.streak14, confetti: true, markers: [] };
  if (has('weekly_champion')) return { kind: 'streak7', message: CELEBRATION_MESSAGES.streak7, confetti: true, markers: [] };
  if (has('first_step')) return { kind: 'first', message: CELEBRATION_MESSAGES.first, confetti: true, markers: [] };

  const allKey = `all-due:${next.today}`;
  if (allDueTodayDone && !seen(storage, studentId, allKey)) {
    return { kind: 'all-today', message: CELEBRATION_MESSAGES.allToday, confetti: true, markers: [allKey] };
  }

  const before = prev.today === next.today ? prev.completedToday : 0;
  const goalKey = `goal:${next.today}:${next.dailyGoal}`;
  if (before < next.dailyGoal && next.completedToday >= next.dailyGoal && !seen(storage, studentId, goalKey)) {
    return { kind: 'goal', message: CELEBRATION_MESSAGES.goal, confetti: true, markers: [goalKey] };
  }

  if (has('consistent_learner')) return { kind: 'streak3', message: CELEBRATION_MESSAGES.streak3, confetti: true, markers: [] };

  if (badges.length > 0) {
    return { kind: 'badge', message: `Badge unlocked: ${badgeName(badges[0])}!`, confetti: true, markers: [] };
  }
  return regular;
}

// ---------------------------------------------------------------------------
// DOM (browser only)
// ---------------------------------------------------------------------------
export function prefersReducedMotion() {
  try {
    return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (_) {
    return false;
  }
}

let dismissTimer = null;

export function showCelebration(result) {
  if (typeof document === 'undefined' || !result) return;
  const stack = document.getElementById('toast-stack') || document.body;

  stack.querySelectorAll('.celebration-toast').forEach((el) => el.remove());
  clearTimeout(dismissTimer);

  const el = document.createElement('div');
  el.className = `toast celebration-toast celebration-${result.kind}`;
  el.setAttribute('role', 'status');

  const icon = document.createElement('i');
  icon.className = `fa-solid ${result.confetti ? 'fa-trophy' : 'fa-circle-check'} celebration-icon`;
  icon.setAttribute('aria-hidden', 'true');

  const text = document.createElement('span');
  text.className = 'celebration-text';
  text.textContent = result.message;

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'celebration-dismiss';
  close.setAttribute('aria-label', 'Dismiss message');
  close.textContent = '×';
  close.addEventListener('click', () => {
    clearTimeout(dismissTimer);
    el.remove();
  });

  el.append(icon, text, close);
  stack.appendChild(el);
  dismissTimer = setTimeout(() => el.remove(), result.confetti ? 7000 : 4000);

  if (result.confetti && !prefersReducedMotion()) launchConfetti();
}

export function launchConfetti() {
  if (typeof document === 'undefined' || prefersReducedMotion()) return;
  const layer = document.createElement('div');
  layer.className = 'confetti-layer';
  layer.setAttribute('aria-hidden', 'true');
  const colors = ['#2dd4bf', '#fbbf24', '#fb7185', '#60a5fa', '#a78bfa'];
  for (let i = 0; i < 28; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.round(Math.random() * 100)}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.round(Math.random() * 250)}ms`;
    piece.style.setProperty('--drift', `${Math.round((Math.random() - 0.5) * 160)}px`);
    layer.appendChild(piece);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 1900);
}
