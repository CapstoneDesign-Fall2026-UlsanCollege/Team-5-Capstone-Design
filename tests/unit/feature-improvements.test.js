import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function ensureStorageMock() {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}
ensureStorageMock();

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: false,
  supabase: {
    from: () => {
      throw new Error('Mocked local-only test mode');
    },
  },
}));

const {
  ACTIVITY_TYPES,
  REPEAT_RULES,
  MAX_TASK_DESCRIPTION_LENGTH,
  addDays,
  buildConflictPromptMessage,
  computeScheduleOverview,
  diffDays,
  expandSchedulesForRange,
  findScheduleConflicts,
  formatDurationMinutes,
  formatTimeDisplay,
  getWeekDates,
  normalizeOptionalDescription,
  validateScheduleInput,
} = await import('../../src/lib/time-schedule.js');

const { createTask, getTasks, updateTask } = await import('../../src/services/tasks.js');
const {
  cancelScheduleOccurrence,
  createSchedule,
  deleteSchedule,
  getSchedules,
  toggleScheduleCompletion,
  updateSchedule,
} = await import('../../src/services/schedules.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_HTML = fs.readFileSync(path.resolve(__dirname, '../../public/index.html'), 'utf8');

describe('Feature 1 & 2 — Navigation order & Subject removal dialog contracts in public/index.html', () => {
  it('places Study Tasks 1st, Dashboard 2nd, Time Schedule between Quiz & AI Tutor', () => {
    const navMatch = INDEX_HTML.match(/<nav[^>]*class="side-nav"[^>]*>([\s\S]*?)<\/nav>/);
    expect(navMatch).toBeTruthy();
    const views = Array.from(navMatch[1].matchAll(/data-view="([^"]+)"/g)).map((m) => m[1]);
    expect(views).toEqual(['tasks', 'dashboard', 'subjects', 'analytics', 'quiz', 'schedule', 'ai-tutor']);

    const labels = Array.from(navMatch[1].matchAll(/<a [^>]*>([\s\S]*?)<\/a>/g)).map((m) =>
      m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim(),
    );
    expect(labels).toEqual([
      'Study Tasks',
      'Dashboard',
      'Subjects & University',
      'Study Analytics',
      'Quiz Practice',
      'Time Schedule',
      'AI Tutor',
    ]);
  });

  it('includes accessible Subject Removal Confirmation modal with exact labels and message', () => {
    expect(INDEX_HTML).toContain('id="subject-remove-modal"');
    expect(INDEX_HTML).toContain('Remove Subject?');
    expect(INDEX_HTML).toContain('from your selected subjects?');
    expect(INDEX_HTML).toContain('Your existing study tasks, quiz history and progress will not be deleted.');
    expect(INDEX_HTML).toContain('id="subject-remove-cancel"');
    expect(INDEX_HTML).toContain('id="subject-remove-confirm"');
  });
});

describe('Feature 3 — Optional Task Description validation & local persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('exposes multiline textarea with 1000-char limit & live counter in both add/edit task forms', () => {
    expect(INDEX_HTML).toContain('id="task-description"');
    expect(INDEX_HTML).toContain('id="create-task-description"');
    expect(INDEX_HTML).toContain('maxlength="1000"');
    expect(INDEX_HTML).toContain('Add instructions, important notes, assignment requirements or study goals...');
  });

  it('validates optional multiline task descriptions up to 1000 chars and rejects > 1000', () => {
    expect(normalizeOptionalDescription('')).toEqual({ valid: true, value: null });
    expect(normalizeOptionalDescription('   \n  ')).toEqual({ valid: true, value: null });

    const multi = '- Read Ch 4\n- Solve 1-10';
    expect(normalizeOptionalDescription(multi)).toEqual({ valid: true, value: multi });

    const exactLimit = 'a'.repeat(MAX_TASK_DESCRIPTION_LENGTH);
    expect(normalizeOptionalDescription(exactLimit).valid).toBe(true);

    const overLimit = 'a'.repeat(MAX_TASK_DESCRIPTION_LENGTH + 1);
    const rejected = normalizeOptionalDescription(overLimit);
    expect(rejected.valid).toBe(false);
    expect(rejected.error).toContain('1000');
  });

  it('creates, reads, edits, and clears task descriptions cleanly in local task service', async () => {
    const created = await createTask({
      studentId: 'local-student-1',
      subjectId: 'computer-networks',
      title: 'Complete Chapter 4 Assignment',
      description: '- Read Chapter 4.\n- Complete questions 1–10.',
      deadline: '2026-11-30T23:59:00.000Z',
    });
    expect(created.error).toBeNull();
    expect(created.data.description).toBe('- Read Chapter 4.\n- Complete questions 1–10.');

    const list = await getTasks('local-student-1');
    expect(list.data).toHaveLength(1);
    expect(list.data[0].description).toContain('questions 1–10');

    const cleared = await updateTask(created.data.id, { description: '' });
    expect(cleared.error).toBeNull();
    expect(cleared.data.description).toBeNull();
  });
});

describe('Feature 4 — Manual Time Schedule pure engine & service CRUD', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('supports the exact 8 activity types and 4 repeat options', () => {
    expect(ACTIVITY_TYPES.map((t) => t.label)).toEqual([
      'Study Session',
      'Assignment',
      'Exam Preparation',
      'Quiz Practice',
      'Revision',
      'Break',
      'Personal Activity',
      'Other',
    ]);
    expect(REPEAT_RULES.map((r) => r.label)).toEqual([
      'Does not repeat',
      'Every day',
      'Every week',
      'Selected weekdays',
    ]);
  });

  it('rejects empty title, end_time <= start_time, and missing weekdays', () => {
    const missingTitle = validateScheduleInput({
      title: '   ',
      schedule_date: '2026-11-27',
      start_time: '19:00',
      end_time: '20:30',
      activity_type: 'revision',
    });
    expect(missingTitle.valid).toBe(false);

    const invertedTime = validateScheduleInput({
      title: 'Networking Review',
      schedule_date: '2026-11-27',
      start_time: '19:00',
      end_time: '18:00',
      activity_type: 'revision',
    });
    expect(invertedTime.valid).toBe(false);
    expect(invertedTime.errors.join(' ')).toMatch(/later than Start Time/i);

    const missingDays = validateScheduleInput({
      title: 'Weekday Drill',
      schedule_date: '2026-11-27',
      start_time: '09:00',
      end_time: '10:00',
      activity_type: 'study_session',
      repeat_rule: 'weekdays',
      repeat_days: [],
    });
    expect(missingDays.valid).toBe(false);
  });

  it('expands weekly, daily, and selected weekday schedules and handles single-occurrence exceptions', () => {
    expect(diffDays('2026-11-23', '2026-11-29')).toBe(6);
    expect(addDays('2026-11-29', 1)).toBe('2026-11-30');
    expect(getWeekDates('2026-11-27')).toEqual([
      '2026-11-23',
      '2026-11-24',
      '2026-11-25',
      '2026-11-26',
      '2026-11-27',
      '2026-11-28',
      '2026-11-29',
    ]);

    const weekly = {
      id: 'sched-1',
      title: 'Computer Networks Revision',
      subject_name: 'Computer Networks',
      activity_type: 'revision',
      description: 'Review OSI & TCP/IP',
      schedule_date: '2026-11-27',
      start_time: '19:00',
      end_time: '20:30',
      repeat_rule: 'weekly',
      repeat_days: [],
      repeat_until: '2026-12-18',
      completed: false,
    };

    const exceptions = [
      { schedule_id: 'sched-1', occurrence_date: '2026-12-04', status: 'cancelled' },
      { schedule_id: 'sched-1', occurrence_date: '2026-12-11', status: 'completed', completed: true },
    ];

    const expanded = expandSchedulesForRange([weekly], exceptions, '2026-11-23', '2026-12-20');
    expect(expanded.map((o) => o.effectiveDate)).toEqual(['2026-11-27', '2026-12-11', '2026-12-18']);
    expect(expanded[1].completed).toBe(true);
    expect(expanded[0].durationMinutes).toBe(90);
    expect(formatTimeDisplay('19:00')).toBe('7:00 PM');
    expect(formatDurationMinutes(90)).toBe('1h 30m');
  });

  it('detects overlapping schedule conflicts while ignoring adjacent non-overlapping boundaries', () => {
    const existing = [
      {
        id: 'sched-existing',
        title: 'Computer Networks Revision',
        activity_type: 'revision',
        schedule_date: '2026-11-27',
        start_time: '19:00',
        end_time: '20:30',
        repeat_rule: 'none',
        repeat_days: [],
      },
    ];

    const adjacent = findScheduleConflicts(
      {
        schedule_date: '2026-11-27',
        start_time: '20:30',
        end_time: '21:30',
        repeat_rule: 'none',
      },
      existing,
      [],
    );
    expect(adjacent).toHaveLength(0);

    const overlapping = findScheduleConflicts(
      {
        schedule_date: '2026-11-27',
        start_time: '19:30',
        end_time: '21:00',
        repeat_rule: 'none',
      },
      existing,
      [],
    );
    expect(overlapping).toHaveLength(1);
    expect(buildConflictPromptMessage(overlapping)).toContain('7:00 PM and 8:30 PM');
  });

  it('computes accurate Daily Overview stats (count, duration, completed, upcoming)', () => {
    const todayOccs = [
      {
        title: 'Morning Math',
        durationMinutes: 60,
        completed: true,
        startMinutes: 480,
        endMinutes: 540,
        startTime: '08:00',
        endTime: '09:00',
      },
      {
        title: 'Algorithms Practice',
        durationMinutes: 90,
        completed: false,
        startMinutes: 1140,
        endMinutes: 1230,
        startTime: '19:00',
        endTime: '20:30',
      },
    ];
    const now = new Date('2026-11-27T15:00:00');
    const summary = computeScheduleOverview(todayOccs, now);
    expect(summary.scheduledCount).toBe(2);
    expect(summary.plannedMinutes).toBe(150);
    expect(summary.plannedFormatted).toBe('2h 30m');
    expect(summary.completedCount).toBe(1);
    expect(summary.upcomingSession.title).toBe('Algorithms Practice');
    expect(summary.isUpcomingCurrent).toBe(false);
  });

  it('persists full schedule CRUD, completion toggle/undo, and occurrence cancel via schedule service', async () => {
    const studentId = 'local-student-2';
    const created = await createSchedule({
      studentId,
      title: 'Operating Systems Review',
      subject_id: 'operating-systems',
      subject_name: 'Operating Systems',
      schedule_date: '2026-11-27',
      start_time: '19:00',
      end_time: '20:30',
      activity_type: 'study_session',
      repeat_rule: 'weekly',
    });
    expect(created.error).toBeNull();

    const occ = expandSchedulesForRange([created.data], [], '2026-11-27', '2026-12-04')[0];
    const done = await toggleScheduleCompletion({ occurrence: occ, studentId, completed: true });
    expect(done.error).toBeNull();
    expect(done.data.completed).toBe(true);

    const undone = await toggleScheduleCompletion({
      occurrence: { ...occ, rawException: done.data },
      studentId,
      completed: false,
    });
    expect(undone.data.completed).toBe(false);

    const cancelled = await cancelScheduleOccurrence({
      scheduleId: created.data.id,
      studentId,
      occurrenceDate: '2026-12-04',
    });
    expect(cancelled.data.status).toBe('cancelled');

    const loaded = await getSchedules(studentId);
    const expandedAfterCancel = expandSchedulesForRange(loaded.data.schedules, loaded.data.exceptions, '2026-11-27', '2026-12-11');
    expect(expandedAfterCancel.map((o) => o.effectiveDate)).toEqual(['2026-11-27', '2026-12-11']);

    await updateSchedule(created.data.id, {
      title: 'OS Deep Dive',
      schedule_date: '2026-11-27',
      start_time: '18:00',
      end_time: '19:30',
      activity_type: 'exam_preparation',
      repeat_rule: 'weekly',
    });
    const afterUpdate = await getSchedules(studentId);
    expect(afterUpdate.data.schedules[0].title).toBe('OS Deep Dive');

    await deleteSchedule(created.data.id);
    const afterDelete = await getSchedules(studentId);
    expect(afterDelete.data.schedules).toHaveLength(0);
  });
});
