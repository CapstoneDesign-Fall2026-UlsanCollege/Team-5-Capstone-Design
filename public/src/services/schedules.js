/**
 * Manual Time Schedule & Study Planner Service — Smart Study Companion
 * Handles CRUD for recurring/single schedules and single-occurrence exceptions
 * via Supabase PostgreSQL with RLS and clean non-UUID localStorage fallback.
 */
import { supabase } from '../lib/supabase.js';
import {
  buildLocalTimestampIso,
  getLocalTimezone,
  normalizeOptionalDescription,
  normalizeTimeHHMM,
  parseDateOnly,
  validateScheduleInput,
  MAX_SCHEDULE_DESCRIPTION_LENGTH,
} from '../lib/time-schedule.js';

export const SCHEDULE_STORAGE_KEY = 'smart_study_schedules_v1';
export const SCHEDULE_EXCEPTIONS_STORAGE_KEY = 'smart_study_schedule_exceptions_v1';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(id) {
  return typeof id === 'string' && UUID_REGEX.test(id);
}

function readLocalArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalArray(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

const SCHEDULE_SELECT = `
  id, student_id, subject_id, title, activity_type, description,
  schedule_date, start_time, end_time, start_at, end_at, timezone,
  repeat_rule, repeat_days, repeat_until, completed, completed_at,
  created_at, updated_at,
  subject:subjects ( id, name, slug )
`;

const EXCEPTION_SELECT = `
  id, schedule_id, student_id, occurrence_date, status,
  override_title, override_subject_id, override_activity_type, override_description,
  override_date, override_start_time, override_end_time, override_start_at, override_end_at,
  completed, completed_at, created_at, updated_at
`;

function formatScheduleServiceError(error) {
  const msg = String(error?.message || error || 'Could not save your schedule.');
  const lower = msg.toLowerCase();
  if (lower.includes('row-level security') || error?.code === '42501') {
    return new Error('Please choose a valid subject from your enrolled subjects, then try saving again.');
  }
  if (lower.includes('time_order_check')) {
    return new Error('End Time must be later than Start Time.');
  }
  if (lower.includes('repeat_until')) {
    return new Error('Repeat end date must be on or after the schedule start date.');
  }
  return error instanceof Error ? error : new Error(msg);
}

/**
 * Fetches all study schedules and recurrence exceptions for a student.
 * @param {string} studentId
 */
export async function getSchedules(studentId) {
  if (!isUuid(studentId)) {
    const schedules = readLocalArray(SCHEDULE_STORAGE_KEY)
      .filter((s) => !studentId || s.student_id === studentId);
    const exceptions = readLocalArray(SCHEDULE_EXCEPTIONS_STORAGE_KEY)
      .filter((e) => !studentId || e.student_id === studentId);
    return { data: { schedules, exceptions }, error: null };
  }

  const [schedulesRes, exceptionsRes] = await Promise.all([
    supabase
      .from('study_schedules')
      .select(SCHEDULE_SELECT)
      .eq('student_id', studentId)
      .order('schedule_date', { ascending: true })
      .order('start_time', { ascending: true }),
    supabase
      .from('study_schedule_exceptions')
      .select(EXCEPTION_SELECT)
      .eq('student_id', studentId)
      .order('occurrence_date', { ascending: true }),
  ]);

  if (schedulesRes.error) {
    return { data: null, error: formatScheduleServiceError(schedulesRes.error) };
  }
  if (exceptionsRes.error) {
    return { data: null, error: formatScheduleServiceError(exceptionsRes.error) };
  }

  return {
    data: {
      schedules: schedulesRes.data || [],
      exceptions: exceptionsRes.data || [],
    },
    error: null,
  };
}

/**
 * Creates a manual study schedule (single or recurring).
 * @param {Record<string, any>} payload
 */
export async function createSchedule(payload) {
  const { studentId, ...rawFields } = payload || {};
  const validation = validateScheduleInput(rawFields);
  if (!validation.valid) {
    return { data: null, error: new Error(validation.errors[0]) };
  }

  const n = validation.normalized;
  const resolvedSubjectId = isUuid(n.subject_id) ? n.subject_id : null;

  if (!isUuid(studentId)) {
    const schedules = readLocalArray(SCHEDULE_STORAGE_KEY);
    const record = {
      id: `local-sched-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      student_id: studentId || 'local',
      subject_id: n.subject_id || null,
      subject_name: n.subject_name || null,
      subject: n.subject_name ? { id: n.subject_id, name: n.subject_name, slug: n.subject_slug } : null,
      title: n.title,
      activity_type: n.activity_type,
      description: n.description,
      schedule_date: n.schedule_date,
      start_time: n.start_time,
      end_time: n.end_time,
      start_at: n.start_at,
      end_at: n.end_at,
      timezone: n.timezone,
      repeat_rule: n.repeat_rule,
      repeat_days: n.repeat_days,
      repeat_until: n.repeat_until,
      completed: false,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    schedules.push(record);
    writeLocalArray(SCHEDULE_STORAGE_KEY, schedules);
    return { data: record, error: null };
  }

  const { data, error } = await supabase
    .from('study_schedules')
    .insert({
      student_id: studentId,
      subject_id: resolvedSubjectId,
      title: n.title,
      activity_type: n.activity_type,
      description: n.description,
      schedule_date: n.schedule_date,
      start_time: n.start_time,
      end_time: n.end_time,
      start_at: n.start_at,
      end_at: n.end_at,
      timezone: n.timezone,
      repeat_rule: n.repeat_rule,
      repeat_days: n.repeat_days,
      repeat_until: n.repeat_until,
      completed: false,
      completed_at: null,
    })
    .select(SCHEDULE_SELECT)
    .single();

  if (error) {
    return { data: null, error: formatScheduleServiceError(error) };
  }
  return { data, error: null };
}

/**
 * Updates an entire schedule series or single-occurrence schedule.
 * @param {string} scheduleId
 * @param {Record<string, any>} updates
 */
export async function updateSchedule(scheduleId, updates) {
  const {
    completedOnly = false,
    completed,
    studentId: _omitStudent,
    ...rest
  } = updates || {};

  if (completedOnly) {
    const nextCompleted = Boolean(completed);
    const completedAt = nextCompleted ? new Date().toISOString() : null;

    if (!isUuid(scheduleId)) {
      const schedules = readLocalArray(SCHEDULE_STORAGE_KEY);
      const idx = schedules.findIndex((s) => s.id === scheduleId);
      if (idx === -1) return { data: null, error: new Error('Schedule not found') };
      schedules[idx] = {
        ...schedules[idx],
        completed: nextCompleted,
        completed_at: completedAt,
        updated_at: new Date().toISOString(),
      };
      writeLocalArray(SCHEDULE_STORAGE_KEY, schedules);
      return { data: schedules[idx], error: null };
    }

    const { data, error } = await supabase
      .from('study_schedules')
      .update({ completed: nextCompleted, completed_at: completedAt })
      .eq('id', scheduleId)
      .select(SCHEDULE_SELECT)
      .single();

    if (error) return { data: null, error: formatScheduleServiceError(error) };
    return { data, error: null };
  }

  const validation = validateScheduleInput(rest);
  if (!validation.valid) {
    return { data: null, error: new Error(validation.errors[0]) };
  }
  const n = validation.normalized;
  const resolvedSubjectId = isUuid(n.subject_id) ? n.subject_id : null;

  if (!isUuid(scheduleId)) {
    const schedules = readLocalArray(SCHEDULE_STORAGE_KEY);
    const idx = schedules.findIndex((s) => s.id === scheduleId);
    if (idx === -1) return { data: null, error: new Error('Schedule not found') };
    schedules[idx] = {
      ...schedules[idx],
      subject_id: n.subject_id || null,
      subject_name: n.subject_name || null,
      subject: n.subject_name ? { id: n.subject_id, name: n.subject_name, slug: n.subject_slug } : null,
      title: n.title,
      activity_type: n.activity_type,
      description: n.description,
      schedule_date: n.schedule_date,
      start_time: n.start_time,
      end_time: n.end_time,
      start_at: n.start_at,
      end_at: n.end_at,
      timezone: n.timezone || getLocalTimezone(),
      repeat_rule: n.repeat_rule,
      repeat_days: n.repeat_days,
      repeat_until: n.repeat_until,
      updated_at: new Date().toISOString(),
    };
    writeLocalArray(SCHEDULE_STORAGE_KEY, schedules);
    return { data: schedules[idx], error: null };
  }

  const { data, error } = await supabase
    .from('study_schedules')
    .update({
      subject_id: resolvedSubjectId,
      title: n.title,
      activity_type: n.activity_type,
      description: n.description,
      schedule_date: n.schedule_date,
      start_time: n.start_time,
      end_time: n.end_time,
      start_at: n.start_at,
      end_at: n.end_at,
      timezone: n.timezone || getLocalTimezone(),
      repeat_rule: n.repeat_rule,
      repeat_days: n.repeat_days,
      repeat_until: n.repeat_until,
    })
    .eq('id', scheduleId)
    .select(SCHEDULE_SELECT)
    .single();

  if (error) return { data: null, error: formatScheduleServiceError(error) };
  return { data, error: null };
}

/**
 * Deletes an entire schedule (and cascades all exceptions).
 * @param {string} scheduleId
 */
export async function deleteSchedule(scheduleId) {
  if (!isUuid(scheduleId)) {
    const schedules = readLocalArray(SCHEDULE_STORAGE_KEY).filter((s) => s.id !== scheduleId);
    const exceptions = readLocalArray(SCHEDULE_EXCEPTIONS_STORAGE_KEY).filter((e) => e.schedule_id !== scheduleId);
    writeLocalArray(SCHEDULE_STORAGE_KEY, schedules);
    writeLocalArray(SCHEDULE_EXCEPTIONS_STORAGE_KEY, exceptions);
    return { error: null };
  }

  const { error } = await supabase
    .from('study_schedules')
    .delete()
    .eq('id', scheduleId);

  return { error: error ? formatScheduleServiceError(error) : null };
}

/**
 * Creates or updates an exception for a single occurrence of a recurring schedule
 * (e.g., modify one day's time/title, mark completed/uncompleted, or cancel that occurrence).
 * @param {Record<string, any>} payload
 */
export async function upsertScheduleException(payload) {
  const {
    scheduleId,
    studentId,
    occurrenceDate,
    status = 'modified',
    overrideTitle = null,
    overrideSubjectId = null,
    overrideSubjectName = null,
    overrideActivityType = null,
    overrideDescription = null,
    overrideDate = null,
    overrideStartTime = null,
    overrideEndTime = null,
    completed = false,
    completedAt = null,
  } = payload || {};

  if (!scheduleId || !parseDateOnly(occurrenceDate)) {
    return { data: null, error: new Error('Invalid schedule occurrence reference.') };
  }

  let cleanDesc = null;
  if (overrideDescription !== null && overrideDescription !== undefined) {
    const check = normalizeOptionalDescription(overrideDescription, MAX_SCHEDULE_DESCRIPTION_LENGTH);
    if (!check.valid) return { data: null, error: new Error(check.error) };
    cleanDesc = check.value;
  }

  const effectiveDate = overrideDate || occurrenceDate;
  const normalizedStart = overrideStartTime ? normalizeTimeHHMM(overrideStartTime) : null;
  const normalizedEnd = overrideEndTime ? normalizeTimeHHMM(overrideEndTime) : null;
  const overrideStartAt = normalizedStart ? buildLocalTimestampIso(effectiveDate, normalizedStart) : null;
  const overrideEndAt = normalizedEnd ? buildLocalTimestampIso(effectiveDate, normalizedEnd) : null;

  if (!isUuid(scheduleId) || !isUuid(studentId)) {
    const exceptions = readLocalArray(SCHEDULE_EXCEPTIONS_STORAGE_KEY);
    const idx = exceptions.findIndex((e) => e.schedule_id === scheduleId && e.occurrence_date === occurrenceDate);
    const record = {
      id: idx >= 0 ? exceptions[idx].id : `local-exc-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      schedule_id: scheduleId,
      student_id: studentId || 'local',
      occurrence_date: occurrenceDate,
      status,
      override_title: overrideTitle ? String(overrideTitle).trim() : null,
      override_subject_id: overrideSubjectId || null,
      override_subject_name: overrideSubjectName || null,
      override_activity_type: overrideActivityType || null,
      override_description: cleanDesc,
      override_date: overrideDate || null,
      override_start_time: normalizedStart,
      override_end_time: normalizedEnd,
      override_start_at: overrideStartAt,
      override_end_at: overrideEndAt,
      completed: Boolean(completed),
      completed_at: completed ? (completedAt || new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    };
    if (idx >= 0) {
      exceptions[idx] = { ...exceptions[idx], ...record };
    } else {
      exceptions.push({ ...record, created_at: new Date().toISOString() });
    }
    writeLocalArray(SCHEDULE_EXCEPTIONS_STORAGE_KEY, exceptions);
    return { data: record, error: null };
  }

  const rowPayload = {
    schedule_id: scheduleId,
    student_id: studentId,
    occurrence_date: occurrenceDate,
    status,
    override_title: overrideTitle ? String(overrideTitle).trim() : null,
    override_subject_id: isUuid(overrideSubjectId) ? overrideSubjectId : null,
    override_activity_type: overrideActivityType || null,
    override_description: cleanDesc,
    override_date: overrideDate || null,
    override_start_time: normalizedStart,
    override_end_time: normalizedEnd,
    override_start_at: overrideStartAt,
    override_end_at: overrideEndAt,
    completed: Boolean(completed),
    completed_at: completed ? (completedAt || new Date().toISOString()) : null,
  };

  const { data, error } = await supabase
    .from('study_schedule_exceptions')
    .upsert(rowPayload, { onConflict: 'schedule_id,occurrence_date' })
    .select(EXCEPTION_SELECT)
    .single();

  if (error) return { data: null, error: formatScheduleServiceError(error) };
  return { data, error: null };
}

/**
 * Deletes/cancels a single occurrence of a recurring schedule.
 */
export async function cancelScheduleOccurrence({ scheduleId, studentId, occurrenceDate }) {
  return upsertScheduleException({
    scheduleId,
    studentId,
    occurrenceDate,
    status: 'cancelled',
    completed: false,
    completedAt: null,
  });
}

/**
 * Toggles completion for either a non-recurring schedule or a single occurrence
 * of a recurring schedule (preserving existing overrides cleanly).
 */
export async function toggleScheduleCompletion({ occurrence, studentId, completed }) {
  if (!occurrence?.scheduleId) {
    return { data: null, error: new Error('Missing schedule reference.') };
  }

  if (!occurrence.isRecurring) {
    return updateSchedule(occurrence.scheduleId, {
      completedOnly: true,
      completed: Boolean(completed),
    });
  }

  const existingExc = occurrence.rawException;
  return upsertScheduleException({
    scheduleId: occurrence.scheduleId,
    studentId,
    occurrenceDate: occurrence.occurrenceDate,
    status: existingExc?.status === 'modified' ? 'modified' : (completed ? 'completed' : 'modified'),
    overrideTitle: existingExc?.override_title || null,
    overrideSubjectId: existingExc?.override_subject_id || null,
    overrideSubjectName: existingExc?.override_subject_name || null,
    overrideActivityType: existingExc?.override_activity_type || null,
    overrideDescription: existingExc?.override_description ?? null,
    overrideDate: existingExc?.override_date || null,
    overrideStartTime: existingExc?.override_start_time || null,
    overrideEndTime: existingExc?.override_end_time || null,
    completed: Boolean(completed),
    completedAt: completed ? new Date().toISOString() : null,
  });
}
