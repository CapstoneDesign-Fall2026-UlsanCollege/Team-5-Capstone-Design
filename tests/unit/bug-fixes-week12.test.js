import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  formatLocalDateInput,
  formatForDateTimeLocalInput,
  parseDeadlineInputToIso,
} from '../../src/lib/date-utils.js';

describe('Week 12 Bug Fixes — Deadline Validation, Local Date & Quiz History Cap', () => {
  it('Bug A: parseDeadlineInputToIso rejects empty or invalid deadlines without throwing', () => {
    expect(parseDeadlineInputToIso('')).toMatchObject({ ok: false, iso: null });
    expect(parseDeadlineInputToIso('   ')).toMatchObject({ ok: false, iso: null });
    expect(parseDeadlineInputToIso(null)).toMatchObject({ ok: false, iso: null });
    expect(parseDeadlineInputToIso('not-a-date')).toMatchObject({ ok: false, iso: null });

    const valid = parseDeadlineInputToIso('2026-11-20T14:30');
    expect(valid.ok).toBe(true);
    expect(typeof valid.iso).toBe('string');
    expect(Number.isNaN(new Date(valid.iso).getTime())).toBe(false);
  });

  it('Bug A/B: formatForDateTimeLocalInput handles invalid/empty values safely and formats valid dates', () => {
    expect(formatForDateTimeLocalInput('')).toBe('');
    expect(formatForDateTimeLocalInput('invalid-date')).toBe('');
    const formatted = formatForDateTimeLocalInput('2026-11-20T05:15:00.000Z');
    expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it('Bug B: formatLocalDateInput uses local calendar date instead of UTC (midnight boundary)', () => {
    // Construct a local-time Date at 00:30 local time (in Asia/Seoul UTC+9, UTC date is previous day)
    const localMidnight = new Date(2026, 10, 20, 0, 30, 0);
    expect(formatLocalDateInput(localMidnight, 0)).toBe('2026-11-20');
    expect(formatLocalDateInput(localMidnight, 1)).toBe('2026-11-21');
    expect(formatLocalDateInput('invalid', 1)).toBe('');
  });

  it('Bug C: public/app.js raises quiz history fetch limit to 200 and removes the 20-item slice cap', () => {
    const appJs = readFileSync(resolve('public/app.js'), 'utf8');
    expect(appJs).toContain('getQuizHistory(currentUser.id, 200)');
    expect(appJs).toContain('getAiQuizHistory(currentUser.id, 200)');
    expect(appJs).not.toContain('quizHistory = [...curatedItems, ...aiItems]\n        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))\n        .slice(0, 20);');
  });
});
