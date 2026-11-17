/**
 * Study Streak Service — thin Supabase RPC wrappers.
 *
 * All streak / protection / achievement logic runs server-side (migration 011). The client:
 *   - tells the server the browser timezone (affects future events only), and
 *   - reads one summary object.
 * Requires an authenticated cloud student. Local-preview students (no Supabase) get a clear
 * "unavailable" result instead of a second, conflicting local source of truth.
 */
import { supabase, isConfigured } from '../lib/supabase.js';
import { normalizeSummary } from '../lib/study-logic.js';

export function isCloudStudent(studentId) {
  return Boolean(isConfigured && studentId && !String(studentId).startsWith('local-'));
}

export function getBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (_) {
    return 'UTC';
  }
}

export async function syncStudyTimezone(studentId) {
  if (!isCloudStudent(studentId)) return { error: { message: 'Cloud account required.' } };
  try {
    const { error } = await supabase.rpc('sync_study_timezone', { p_timezone: getBrowserTimezone() });
    return { error: error || null };
  } catch (err) {
    return { error: err };
  }
}

export async function fetchStudySummary(studentId) {
  if (!isCloudStudent(studentId)) {
    return { data: null, error: { code: 'LOCAL_MODE', message: 'Cloud account required.' } };
  }
  try {
    const { data, error } = await supabase.rpc('get_study_summary');
    if (error) return { data: null, error };
    return { data: normalizeSummary(data), error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}
