/**
 * Date & Deadline Utilities — Smart Study Companion
 *
 * Pure helpers for safe deadline parsing and local calendar date formatting
 * (avoids UTC day-shift bugs near midnight in non-UTC timezones like Asia/Seoul).
 */

export function formatLocalDateInput(baseDate = new Date(), daysAhead = 0) {
  const d = baseDate instanceof Date ? new Date(baseDate.getTime()) : new Date(baseDate);
  if (Number.isNaN(d.getTime())) return '';
  d.setDate(d.getDate() + Number(daysAhead || 0));
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatForDateTimeLocalInput(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${mins}`;
}

export function parseDeadlineInputToIso(rawValue) {
  const clean = String(rawValue || '').trim();
  if (!clean) {
    return { ok: false, iso: null, error: 'Please enter a valid deadline date and time.' };
  }
  const parsed = new Date(clean);
  if (Number.isNaN(parsed.getTime())) {
    return { ok: false, iso: null, error: 'Please enter a valid deadline date and time.' };
  }
  return { ok: true, iso: parsed.toISOString(), error: null };
}
