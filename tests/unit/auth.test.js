import { describe, it, expect } from 'vitest';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LETTER = /[A-Za-z]/;
const NUMBER = /\d/;

function passwordRules(value) {
    return {
        length: value.length >= 8,
        letter: LETTER.test(value),
        number: NUMBER.test(value),
    };
}

function passwordValid(value) {
    const rules = passwordRules(value);
    return rules.length && rules.letter && rules.number;
}

describe('Authentication Validation Logic', () => {
    it('validates university/student email addresses correctly', () => {
        expect(EMAIL_PATTERN.test('student@college.edu')).toBe(true);
        expect(EMAIL_PATTERN.test('john.doe@tu.edu.np')).toBe(true);
        expect(EMAIL_PATTERN.test('plainaddress')).toBe(false);
        expect(EMAIL_PATTERN.test('@missingusername.com')).toBe(false);
        expect(EMAIL_PATTERN.test('username@.com')).toBe(false);
    });

    it('enforces 8+ characters, letter, and number password policy', () => {
        expect(passwordValid('short1A')).toBe(false); // only 7 chars
        expect(passwordValid('alllettershere')).toBe(false); // no number
        expect(passwordValid('1234567890')).toBe(false); // no letter
        expect(passwordValid('studyPass1')).toBe(true); // valid
        expect(passwordValid('NepalStudent2026!')).toBe(true); // valid
    });

    it('evaluates individual password rules accurately', () => {
        const rules = passwordRules('abc');
        expect(rules.length).toBe(false);
        expect(rules.letter).toBe(true);
        expect(rules.number).toBe(false);

        const rules2 = passwordRules('12345678');
        expect(rules2.length).toBe(true);
        expect(rules2.letter).toBe(false);
        expect(rules2.number).toBe(true);
    });
});

