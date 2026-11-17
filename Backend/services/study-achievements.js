/**
 * Study Achievements — badge catalog and pure helpers (no network, no DOM).
 *
 * Badges are earned and persisted SERVER-SIDE (student_achievements, UNIQUE per student/badge).
 * The client only displays them; it can never grant one.
 */

export const BADGE_CATALOG = [
  { key: 'first_step',         name: 'First Step',         icon: 'fa-shoe-prints', description: 'Complete your first study task.',  metric: 'tasks',  target: 1 },
  { key: 'consistent_learner', name: 'Consistent Learner', icon: 'fa-seedling',    description: 'Reach a 3-day study streak.',      metric: 'streak', target: 3 },
  { key: 'weekly_champion',    name: 'Weekly Champion',    icon: 'fa-medal',       description: 'Reach a 7-day study streak.',      metric: 'streak', target: 7 },
  { key: 'dedicated_student',  name: 'Dedicated Student',  icon: 'fa-book-open',   description: 'Reach a 14-day study streak.',     metric: 'streak', target: 14 },
  { key: 'study_master',       name: 'Study Master',       icon: 'fa-crown',       description: 'Reach a 30-day study streak.',     metric: 'streak', target: 30 },
  { key: 'task_achiever',      name: 'Task Achiever',      icon: 'fa-list-check',  description: 'Complete 10 study tasks.',         metric: 'tasks',  target: 10 },
  { key: 'productivity_star',  name: 'Productivity Star',  icon: 'fa-star',        description: 'Complete 50 study tasks.',         metric: 'tasks',  target: 50 },
  { key: 'century_club',       name: 'Century Club',       icon: 'fa-trophy',      description: 'Complete 100 study tasks.',        metric: 'tasks',  target: 100 },
];

export const badgeName = (key) => BADGE_CATALOG.find((b) => b.key === key)?.name || key;

/** Merges the catalog with what the server says is earned. Unknown server keys are ignored. */
export function buildBadgeList(summary) {
  const earned = new Map((summary?.achievements || []).map((a) => [a.badgeKey, a.earnedAt]));
  return BADGE_CATALOG.map((badge) => {
    const unlocked = earned.has(badge.key);
    const current = badge.metric === 'streak'
      ? (summary?.longestStreak || 0)
      : (summary?.totalCompletedTasks || 0);
    return {
      ...badge,
      unlocked,
      earnedAt: unlocked ? earned.get(badge.key) : null,
      progress: Math.min(current, badge.target),
    };
  });
}

/** Badge keys present in `next` but not in `prev`. */
export function newlyEarned(prev, next) {
  const had = new Set((prev?.achievements || []).map((a) => a.badgeKey));
  return (next?.achievements || []).map((a) => a.badgeKey).filter((k) => !had.has(k));
}
