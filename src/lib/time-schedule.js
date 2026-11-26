/**
 * Pure schedule math, validation, recurrence expansion, overlap detection,
 * and overview aggregation for the Manual Time Schedule & Study Planner.
 */

export const MAX_SCHEDULE_TITLE_LENGTH = 120;
export const MAX_SCHEDULE_DESCRIPTION_LENGTH = 1000;
export const MAX_TASK_DESCRIPTION_LENGTH = 1000;

export const ACTIVITY_TYPES = [
  { value: 'study_session', label: 'Study Session', tone: 'teal', icon: 'fa-book-open' },
  { value: 'assignment', label: 'Assignment', tone: 'indigo', icon: 'fa-file-pen' },
  { value: 'exam_preparation', label: 'Exam Preparation', tone: 'amber', icon: 'fa-award' },
  { value: 'quiz_practice', label: 'Quiz Practice', tone: 'violet', icon: 'fa-circle-question' },
  { value: 'revision', label: 'Revision', tone: 'sky', icon: 'fa-rotate' },
  { value: 'break', label: 'Break', tone: 'mint', icon: 'fa-mug-hot' },
  { value: 'personal_activity', label: 'Personal Activity', tone: 'rose', icon: 'fa-heart' },
  { value: 'other', label: 'Other', tone: 'slate', icon: 'fa-calendar-check' },
];

export const ACTIVITY_TYPE_MAP = new Map(ACTIVITY_TYPES.map((item) => [item.value, item]));

export const REPEAT_RULES = [
  { value: 'none', label: 'Does not repeat' },
  { value: 'daily', label: 'Every day' },
  { value: 'weekly', label: 'Every week' },
  { value: 'weekdays', label: 'Selected weekdays' },
];

export const VALID_REPEAT_RULES = new Set(REPEAT_RULES.map((item) => item.value));

export const WEEKDAY_OPTIONS = [
  { dayIndex: 1, short: 'Mon', label: 'Monday' },
  { dayIndex: 2, short: 'Tue', label: 'Tuesday' },
  { dayIndex: 3, short: 'Wed', label: 'Wednesday' },
  { dayIndex: 4, short: 'Thu', label: 'Thursday' },
  { dayIndex: 5, short: 'Fri', label: 'Friday' },
  { dayIndex: 6, short: 'Sat', label: 'Saturday' },
  { dayIndex: 0, short: 'Sun', label: 'Sunday' },
];

/**
 * Returns metadata for an activity type key, defaulting safely to "Other".
 * @param {string} value
 */
export function getActivityTypeMeta(value) {
  return ACTIVITY_TYPE_MAP.get(value) || ACTIVITY_TYPE_MAP.get('other');
}

/**
 * Validates and normalizes an optional task/schedule description (up to 1000 chars).
 * @param {string|null|undefined} raw
 * @param {number} [maxLength]
 * @returns {{ valid: boolean, value: string|null, error?: string }}
 */
export function normalizeOptionalDescription(raw, maxLength = MAX_TASK_DESCRIPTION_LENGTH) {
  if (raw === null || raw === undefined) {
    return { valid: true, value: null };
  }
  const text = String(raw).trim();
  if (!text) {
    return { valid: true, value: null };
  }
  if (text.length > maxLength) {
    return {
      valid: false,
      value: text,
      error: `Description must be ${maxLength} characters or fewer.`,
    };
  }
  return { valid: true, value: text };
}

/**
 * Parses a strict YYYY-MM-DD calendar date without timezone rollover.
 * @param {string} dateStr
 * @returns {{ year: number, month: number, day: number } | null}
 */
export function parseDateOnly(dateStr) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateStr || '').trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year
    || probe.getUTCMonth() + 1 !== month
    || probe.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

/**
 * Formats a JS Date into YYYY-MM-DD in local time.
 * @param {Date} [date]
 */
export function formatDateOnly(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Adds a signed integer number of calendar days to YYYY-MM-DD (DST-safe via UTC).
 * @param {string} dateStr
 * @param {number} deltaDays
 */
export function addDays(dateStr, deltaDays) {
  const parsed = parseDateOnly(dateStr);
  if (!parsed) return '';
  const dt = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day + deltaDays));
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Computes signed day difference (dateB - dateA) in whole calendar days.
 * @param {string} dateA
 * @param {string} dateB
 */
export function diffDays(dateA, dateB) {
  const a = parseDateOnly(dateA);
  const b = parseDateOnly(dateB);
  if (!a || !b) return NaN;
  const utcA = Date.UTC(a.year, a.month - 1, a.day);
  const utcB = Date.UTC(b.year, b.month - 1, b.day);
  return Math.round((utcB - utcA) / 86400000);
}

/**
 * Returns JS weekday index (0=Sun..6=Sat) for YYYY-MM-DD.
 * @param {string} dateStr
 */
export function getWeekdayIndex(dateStr) {
  const parsed = parseDateOnly(dateStr);
  if (!parsed) return -1;
  return new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)).getUTCDay();
}

/**
 * Returns Monday YYYY-MM-DD for the ISO week containing dateStr.
 * @param {string} dateStr
 */
export function getWeekStartMonday(dateStr) {
  const dayIndex = getWeekdayIndex(dateStr);
  if (dayIndex < 0) return '';
  const offset = dayIndex === 0 ? -6 : 1 - dayIndex;
  return addDays(dateStr, offset);
}

/**
 * Returns all 7 YYYY-MM-DD dates [Mon..Sun] starting from weekStartStr.
 * @param {string} weekStartStr
 */
export function getWeekDates(weekStartStr) {
  const monday = getWeekStartMonday(weekStartStr);
  if (!monday) return [];
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/**
 * Formats a YYYY-MM-DD calendar date for display cleanly in UTC calendar math.
 * @param {string} dateStr
 * @param {Intl.DateTimeFormatOptions} [options]
 */
export function formatCalendarDate(dateStr, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
  const parsed = parseDateOnly(dateStr);
  if (!parsed) return String(dateStr || '');
  const d = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day, 12, 0, 0));
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(d);
}

/**
 * Validates HH:mm or HH:mm:ss and normalizes to HH:mm.
 * @param {string} timeStr
 */
export function normalizeTimeHHMM(timeStr) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(String(timeStr || '').trim());
  if (!match) return '';
  return `${match[1]}:${match[2]}`;
}

/**
 * Converts HH:mm(:ss) to minutes since midnight, or NaN if invalid.
 * @param {string} timeStr
 */
export function timeToMinutes(timeStr) {
  const normalized = normalizeTimeHHMM(timeStr);
  if (!normalized) return Number.NaN;
  const [h, m] = normalized.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Formats HH:mm as localized 12-hour clock time (e.g. "7:00 PM").
 * @param {string} timeStr
 */
export function formatTimeDisplay(timeStr) {
  const normalized = normalizeTimeHHMM(timeStr);
  if (!normalized) return String(timeStr || '');
  const [h, m] = normalized.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Formats minute duration cleanly (e.g., 90 -> "1h 30m").
 * @param {number} minutes
 */
export function formatDurationMinutes(minutes) {
  const mins = Math.max(0, Math.round(Number(minutes) || 0));
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hours === 0) return `${rem}m`;
  if (rem === 0) return `${hours}h`;
  return `${hours}h ${rem}m`;
}

/**
 * Builds an ISO-8601 timestamp string from YYYY-MM-DD and HH:mm in local timezone.
 * @param {string} dateStr
 * @param {string} timeStr
 */
export function buildLocalTimestampIso(dateStr, timeStr) {
  const parsedDate = parseDateOnly(dateStr);
  const normalizedTime = normalizeTimeHHMM(timeStr);
  if (!parsedDate || !normalizedTime) return '';
  const [hh, mm] = normalizedTime.split(':').map(Number);
  const dt = new Date(parsedDate.year, parsedDate.month - 1, parsedDate.day, hh, mm, 0, 0);
  return Number.isNaN(dt.getTime()) ? '' : dt.toISOString();
}

/**
 * Returns local IANA timezone identifier if available.
 */
export function getLocalTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (_) {
    return 'UTC';
  }
}

/**
 * Validates and normalizes schedule form payload before DB save or conflict check.
 * @param {Record<string, unknown>} rawInput
 */
export function validateScheduleInput(rawInput = {}) {
  const errors = [];
  const title = String(rawInput.title || '').trim();
  if (!title) {
    errors.push('Activity Title is required.');
  } else if (title.length > MAX_SCHEDULE_TITLE_LENGTH) {
    errors.push(`Activity Title must be ${MAX_SCHEDULE_TITLE_LENGTH} characters or fewer.`);
  }

  const activityType = String(rawInput.activity_type || '').trim();
  if (!ACTIVITY_TYPE_MAP.has(activityType)) {
    errors.push('Choose a valid Activity Type.');
  }

  const descCheck = normalizeOptionalDescription(rawInput.description, MAX_SCHEDULE_DESCRIPTION_LENGTH);
  if (!descCheck.valid) {
    errors.push(descCheck.error);
  }

  const scheduleDate = String(rawInput.schedule_date || '').trim();
  if (!parseDateOnly(scheduleDate)) {
    errors.push('Choose a valid schedule date.');
  }

  const startTime = normalizeTimeHHMM(rawInput.start_time);
  const endTime = normalizeTimeHHMM(rawInput.end_time);
  if (!startTime) {
    errors.push('Choose a valid Start Time.');
  }
  if (!endTime) {
    errors.push('Choose a valid End Time.');
  }
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  if (Number.isFinite(startMinutes) && Number.isFinite(endMinutes) && endMinutes <= startMinutes) {
    errors.push('End Time must be later than Start Time.');
  }

  const repeatRule = String(rawInput.repeat_rule || 'none').trim() || 'none';
  if (!VALID_REPEAT_RULES.has(repeatRule)) {
    errors.push('Choose a valid Repeat option.');
  }

  const rawRepeatDays = Array.isArray(rawInput.repeat_days) ? rawInput.repeat_days : [];
  const repeatDays = [...new Set(rawRepeatDays.map(Number).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort((a, b) => a - b);

  if (repeatRule === 'weekdays' && repeatDays.length === 0) {
    errors.push('Select at least one weekday for a custom repeating schedule.');
  }

  const rawRepeatUntil = rawInput.repeat_until ? String(rawInput.repeat_until).trim() : '';
  let repeatUntil = null;
  if (repeatRule !== 'none' && rawRepeatUntil) {
    if (!parseDateOnly(rawRepeatUntil)) {
      errors.push('Choose a valid Repeat Until date.');
    } else if (parseDateOnly(scheduleDate) && diffDays(scheduleDate, rawRepeatUntil) < 0) {
      errors.push('Repeat end date must be on or after the schedule start date.');
    } else {
      repeatUntil = rawRepeatUntil;
    }
  }

  const subjectId = rawInput.subject_id ? String(rawInput.subject_id).trim() : null;
  const subjectName = rawInput.subject_name ? String(rawInput.subject_name).trim() : null;
  const subjectSlug = rawInput.subject_slug ? String(rawInput.subject_slug).trim() : null;
  const timezone = String(rawInput.timezone || getLocalTimezone()).trim() || 'UTC';

  const startAt = buildLocalTimestampIso(scheduleDate, startTime);
  const endAt = buildLocalTimestampIso(scheduleDate, endTime);

  return {
    valid: errors.length === 0,
    errors,
    normalized: {
      title,
      subject_id: subjectId,
      subject_name: subjectName,
      subject_slug: subjectSlug,
      activity_type: ACTIVITY_TYPE_MAP.has(activityType) ? activityType : 'study_session',
      description: descCheck.value,
      schedule_date: scheduleDate,
      start_time: startTime,
      end_time: endTime,
      start_at: startAt,
      end_at: endAt,
      timezone,
      repeat_rule: VALID_REPEAT_RULES.has(repeatRule) ? repeatRule : 'none',
      repeat_days: repeatRule === 'weekdays' ? repeatDays : [],
      repeat_until: repeatRule === 'none' ? null : repeatUntil,
    },
  };
}

/**
 * Checks if a schedule base rule naturally falls on targetDate (before exceptions).
 * @param {Record<string, any>} schedule
 * @param {string} targetDate
 */
export function matchesRecurrenceRule(schedule, targetDate) {
  if (!schedule?.schedule_date || !parseDateOnly(targetDate)) return false;
  if (diffDays(schedule.schedule_date, targetDate) < 0) return false;
  if (schedule.repeat_rule !== 'none' && schedule.repeat_until && diffDays(targetDate, schedule.repeat_until) < 0) {
    return false;
  }

  switch (schedule.repeat_rule || 'none') {
    case 'none':
      return schedule.schedule_date === targetDate;
    case 'daily':
      return true;
    case 'weekly':
      return diffDays(schedule.schedule_date, targetDate) % 7 === 0;
    case 'weekdays': {
      const days = Array.isArray(schedule.repeat_days) ? schedule.repeat_days.map(Number) : [];
      return days.includes(getWeekdayIndex(targetDate));
    }
    default:
      return schedule.schedule_date === targetDate;
  }
}

/**
 * Formats repeat settings as concise human-readable text.
 * @param {Record<string, any>} schedule
 */
export function formatRepeatSummary(schedule) {
  const rule = schedule?.repeat_rule || 'none';
  if (rule === 'none') return 'Does not repeat';
  const untilSuffix = schedule.repeat_until ? ` until ${formatCalendarDate(schedule.repeat_until, { month: 'short', day: 'numeric', year: 'numeric' })}` : '';
  if (rule === 'daily') return `Every day${untilSuffix}`;
  if (rule === 'weekly') {
    const weekday = formatCalendarDate(schedule.schedule_date, { weekday: 'long' });
    return `Every ${weekday}${untilSuffix}`;
  }
  if (rule === 'weekdays') {
    const set = new Set((schedule.repeat_days || []).map(Number));
    const names = WEEKDAY_OPTIONS.filter((w) => set.has(w.dayIndex)).map((w) => w.short);
    return `Every ${names.join(', ') || 'selected day'}${untilSuffix}`;
  }
  return 'Does not repeat';
}

function buildOccurrenceObject(schedule, occurrenceDate, exception, subjectLookup) {
  if (exception?.status === 'cancelled') return null;

  const effectiveDate = exception?.override_date || occurrenceDate;
  const startTime = normalizeTimeHHMM(exception?.override_start_time || schedule.start_time);
  const endTime = normalizeTimeHHMM(exception?.override_end_time || schedule.end_time);
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const title = exception?.override_title || schedule.title;
  const activityType = exception?.override_activity_type || schedule.activity_type;
  const description = exception?.override_description !== undefined && exception?.override_description !== null
    ? exception.override_description
    : (exception && 'override_description' in exception && exception.status === 'modified' && exception.override_description === ''
      ? null
      : (schedule.description ?? null));

  const subjectId = exception?.override_subject_id ?? schedule.subject_id ?? null;
  let subjectName = schedule.subject?.name || schedule.subject_name || null;
  if (exception?.override_subject_id && subjectLookup) {
    subjectName = subjectLookup.get(exception.override_subject_id)?.name || subjectName;
  } else if (exception?.override_subject_name) {
    subjectName = exception.override_subject_name;
  } else if (subjectId && subjectLookup && subjectLookup.has(subjectId)) {
    subjectName = subjectLookup.get(subjectId).name;
  }

  const isRecurring = (schedule.repeat_rule || 'none') !== 'none';
  const completed = isRecurring
    ? Boolean(exception?.completed)
    : Boolean(schedule.completed);

  return {
    occurrenceKey: `${schedule.id}:${occurrenceDate}`,
    scheduleId: schedule.id,
    exceptionId: exception?.id || null,
    occurrenceDate,
    effectiveDate,
    title,
    subjectId,
    subjectName,
    activityType,
    activityMeta: getActivityTypeMeta(activityType),
    description,
    startTime,
    endTime,
    startMinutes,
    endMinutes,
    durationMinutes: Math.max(0, endMinutes - startMinutes),
    completed,
    completedAt: isRecurring ? (exception?.completed_at || null) : (schedule.completed_at || null),
    isRecurring,
    repeatRule: schedule.repeat_rule || 'none',
    repeatDays: Array.isArray(schedule.repeat_days) ? schedule.repeat_days : [],
    repeatUntil: schedule.repeat_until || null,
    repeatSummary: formatRepeatSummary(schedule),
    isException: Boolean(exception),
    rawSchedule: schedule,
    rawException: exception || null,
  };
}

/**
 * Expands schedules + recurrence exceptions across an inclusive [rangeStart, rangeEnd] date window.
 * @param {Array<Record<string, any>>} schedules
 * @param {Array<Record<string, any>>} exceptions
 * @param {string} rangeStart
 * @param {string} rangeEnd
 * @param {Map<string, any>} [subjectLookup]
 */
export function expandSchedulesForRange(schedules = [], exceptions = [], rangeStart, rangeEnd, subjectLookup = null) {
  if (!parseDateOnly(rangeStart) || !parseDateOnly(rangeEnd) || diffDays(rangeStart, rangeEnd) < 0) {
    return [];
  }

  const exceptionByKey = new Map();
  const exceptionsBySchedule = new Map();
  for (const exc of exceptions || []) {
    if (!exc?.schedule_id || !exc?.occurrence_date) continue;
    exceptionByKey.set(`${exc.schedule_id}:${exc.occurrence_date}`, exc);
    if (!exceptionsBySchedule.has(exc.schedule_id)) {
      exceptionsBySchedule.set(exc.schedule_id, []);
    }
    exceptionsBySchedule.get(exc.schedule_id).push(exc);
  }

  const totalDays = diffDays(rangeStart, rangeEnd);
  const results = [];
  const emittedKeys = new Set();

  for (const schedule of schedules || []) {
    if (!schedule?.id || !schedule?.schedule_date) continue;

    for (let offset = 0; offset <= totalDays; offset += 1) {
      const candidateDate = addDays(rangeStart, offset);
      if (!matchesRecurrenceRule(schedule, candidateDate)) continue;
      const key = `${schedule.id}:${candidateDate}`;
      const exc = exceptionByKey.get(key) || null;
      const item = buildOccurrenceObject(schedule, candidateDate, exc, subjectLookup);
      if (!item) continue;
      // Only include if its effectiveDate falls within the requested range
      if (diffDays(rangeStart, item.effectiveDate) >= 0 && diffDays(item.effectiveDate, rangeEnd) >= 0) {
        emittedKeys.add(key);
        results.push(item);
      }
    }

    // Also include single occurrences moved into this window from outside via override_date
    for (const exc of exceptionsBySchedule.get(schedule.id) || []) {
      const key = `${schedule.id}:${exc.occurrence_date}`;
      if (emittedKeys.has(key) || exc.status === 'cancelled' || !exc.override_date) continue;
      if (diffDays(rangeStart, exc.override_date) >= 0 && diffDays(exc.override_date, rangeEnd) >= 0) {
        const item = buildOccurrenceObject(schedule, exc.occurrence_date, exc, subjectLookup);
        if (item) {
          emittedKeys.add(key);
          results.push(item);
        }
      }
    }
  }

  results.sort((a, b) => {
    if (a.effectiveDate !== b.effectiveDate) return a.effectiveDate.localeCompare(b.effectiveDate);
    if (a.startMinutes !== b.startMinutes) return a.startMinutes - b.startMinutes;
    if (a.endMinutes !== b.endMinutes) return a.endMinutes - b.endMinutes;
    return a.title.localeCompare(b.title);
  });

  return results;
}

/**
 * Checks whether a candidate schedule (single or recurring) overlaps existing occurrences.
 * Touching edges (e.g. 08:00 end and 08:00 start) are NOT considered conflicts.
 * @param {Record<string, any>} candidate
 * @param {Array<Record<string, any>>} existingSchedules
 * @param {Array<Record<string, any>>} existingExceptions
 * @param {{ ignoreScheduleId?: string, ignoreOccurrenceDate?: string, horizonDays?: number }} [options]
 */
export function findScheduleConflicts(candidate, existingSchedules = [], existingExceptions = [], options = {}) {
  const startMinutes = timeToMinutes(candidate.start_time);
  const endMinutes = timeToMinutes(candidate.end_time);
  if (!parseDateOnly(candidate.schedule_date) || !Number.isFinite(startMinutes) || !Number.isFinite(endMinutes) || endMinutes <= startMinutes) {
    return [];
  }

  const repeatRule = candidate.repeat_rule || 'none';
  const horizonDays = options.horizonDays ?? 90;
  let rangeEnd = candidate.schedule_date;
  if (repeatRule !== 'none') {
    const horizonDate = addDays(candidate.schedule_date, horizonDays);
    if (candidate.repeat_until && diffDays(candidate.repeat_until, horizonDate) > 0) {
      rangeEnd = candidate.repeat_until;
    } else {
      rangeEnd = horizonDate;
    }
  }

  const candidateDates = [];
  const spanDays = Math.max(0, diffDays(candidate.schedule_date, rangeEnd));
  for (let i = 0; i <= spanDays; i += 1) {
    const d = addDays(candidate.schedule_date, i);
    if (matchesRecurrenceRule({ ...candidate, repeat_rule: repeatRule }, d)) {
      candidateDates.push(d);
    }
  }
  if (candidateDates.length === 0) return [];

  const existingOccurrences = expandSchedulesForRange(
    existingSchedules,
    existingExceptions,
    candidateDates[0],
    candidateDates[candidateDates.length - 1],
  );

  const candidateDateSet = new Set(candidateDates);
  const conflicts = [];

  for (const occ of existingOccurrences) {
    if (!candidateDateSet.has(occ.effectiveDate)) continue;
    if (options.ignoreScheduleId && occ.scheduleId === options.ignoreScheduleId) {
      if (!options.ignoreOccurrenceDate || occ.occurrenceDate === options.ignoreOccurrenceDate) {
        continue;
      }
    }
    if (startMinutes < occ.endMinutes && occ.startMinutes < endMinutes) {
      conflicts.push(occ);
    }
  }

  return conflicts;
}

/**
 * Formats a clear conflict prompt message listing the primary colliding block.
 * @param {Array<Record<string, any>>} conflicts
 */
export function buildConflictPromptMessage(conflicts = []) {
  if (!conflicts.length) return '';
  const first = conflicts[0];
  const timeRange = `${formatTimeDisplay(first.startTime)} and ${formatTimeDisplay(first.endTime)}`;
  const extraCount = conflicts.length > 1 ? ` (+${conflicts.length - 1} more conflict${conflicts.length > 2 ? 's' : ''})` : '';
  return `You already have "${first.title}" scheduled between ${timeRange}${extraCount}. Would you like to adjust your schedule or continue?`;
}

/**
 * Computes summary metrics for today's Daily Overview cards from today's occurrences.
 * @param {Array<Record<string, any>>} todayOccurrences
 * @param {Date} [now]
 */
export function computeScheduleOverview(todayOccurrences = [], now = new Date()) {
  const list = Array.isArray(todayOccurrences) ? todayOccurrences : [];
  const scheduledCount = list.length;
  const plannedMinutes = list.reduce((sum, item) => sum + (Number(item.durationMinutes) || 0), 0);
  const completedCount = list.filter((item) => item.completed).length;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const activeOrNext = list.find((item) => !item.completed && item.endMinutes > nowMinutes) || null;
  const isCurrent = Boolean(activeOrNext && activeOrNext.startMinutes <= nowMinutes && nowMinutes < activeOrNext.endMinutes);

  return {
    scheduledCount,
    plannedMinutes,
    plannedFormatted: formatDurationMinutes(plannedMinutes),
    completedCount,
    upcomingSession: activeOrNext,
    isUpcomingCurrent: isCurrent,
  };
}
