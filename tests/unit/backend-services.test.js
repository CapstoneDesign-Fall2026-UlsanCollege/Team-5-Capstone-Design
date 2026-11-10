import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    COUNTRIES,
    UNIVERSITIES_BY_COUNTRY,
    FACULTIES,
    SUBJECTS_CATALOG,
    QUIZ_BANK,
    getUniversities,
    getMajors,
    getSubjectsForMajor,
} from '../../src/lib/academic-catalog.js';

// In-memory localStorage polyfill for Node Vitest environment
const memoryStorage = new Map();
if (typeof globalThis.localStorage === 'undefined') {
    globalThis.localStorage = {
        getItem: (k) => (memoryStorage.has(k) ? memoryStorage.get(k) : null),
        setItem: (k, v) => memoryStorage.set(k, String(v)),
        removeItem: (k) => memoryStorage.delete(k),
        clear: () => memoryStorage.clear(),
    };
}

// Track Supabase table calls for contract verification
const mockCalls = [];
let mockHandlers = {};

function createQueryBuilder(table) {
    const state = {
        table,
        op: 'select',
        columns: null,
        payload: null,
        filters: [],
        orders: [],
        limitVal: null,
        singleMode: null,
    };

    const builder = {
        select(cols) {
            if (state.op !== 'insert' && state.op !== 'update' && state.op !== 'upsert') {
                state.op = 'select';
            }
            state.columns = cols;
            return builder;
        },
        insert(payload) {
            state.op = 'insert';
            state.payload = payload;
            return builder;
        },
        update(payload) {
            state.op = 'update';
            state.payload = payload;
            return builder;
        },
        upsert(payload, opts) {
            state.op = 'upsert';
            state.payload = payload;
            state.opts = opts;
            return builder;
        },
        delete() {
            state.op = 'delete';
            return builder;
        },
        eq(col, val) {
            state.filters.push(['eq', col, val]);
            return builder;
        },
        in(col, vals) {
            state.filters.push(['in', col, vals]);
            return builder;
        },
        ilike(col, val) {
            state.filters.push(['ilike', col, val]);
            return builder;
        },
        order(col, opts) {
            state.orders.push([col, opts]);
            return builder;
        },
        limit(n) {
            state.limitVal = n;
            return builder;
        },
        single() {
            state.singleMode = 'single';
            return builder;
        },
        maybeSingle() {
            state.singleMode = 'maybeSingle';
            return builder;
        },
        then(resolve, reject) {
            mockCalls.push({ ...state });
            const handler = mockHandlers[table];
            const result = handler
                ? handler(state)
                : { data: state.singleMode ? null : [], error: null };
            return Promise.resolve(result).then(resolve, reject);
        },
    };
    return builder;
}

vi.mock('../../src/lib/supabase.js', () => ({
    isConfigured: true,
    supabase: {
        from: (table) => createQueryBuilder(table),
        functions: {
            invoke: vi.fn(async () => ({ data: null, error: { message: 'Not deployed' } })),
        },
    },
}));

const { saveStudentSubjects, getStudentSubjects, getUniversitiesCatalog } = await import('../../src/services/subjects.js');
const { createTask, updateTask } = await import('../../src/services/tasks.js');
const { saveQuizAttempt, getQuizHistory } = await import('../../src/services/quiz.js');
const { generateAiQuiz, saveAiQuizAttempt, validateAndSanitizeQuestions } = await import('../../src/services/ai-quiz.js');

const TEST_USER_ID = '5bf37ca0-0d3a-4a70-9eda-2cba31cc4792';
const TEST_SUBJ_ID = '11111111-1111-4111-8111-111111111111';
const TEST_QUIZ_ATTEMPT_ID = '22222222-2222-4222-8222-222222222222';
const TEST_QUESTION_UUID = '33333333-3333-4333-8333-333333333333';

describe('Academic Catalog & Service Integration Contracts', () => {
    beforeEach(() => {
        memoryStorage.clear();
        mockCalls.length = 0;
        mockHandlers = {};
    });

    it('ensures every country, university, faculty, major, and quiz bank entry connects cleanly', () => {
        expect(COUNTRIES.length).toBe(10);
        for (const country of COUNTRIES) {
            const unis = getUniversities(country);
            expect(unis.length).toBeGreaterThan(0);
            expect(UNIVERSITIES_BY_COUNTRY[country]).toEqual(unis);
        }

        const slugSet = new Set(SUBJECTS_CATALOG.map((s) => s.slug));
        expect(slugSet.size).toBe(32);
        expect(FACULTIES.length).toBe(4);

        let totalMajors = 0;
        for (const fac of FACULTIES) {
            const majors = getMajors(fac);
            expect(majors.length).toBeGreaterThan(0);
            totalMajors += majors.length;
            for (const major of majors) {
                const subjects = getSubjectsForMajor(major);
                expect(subjects.length).toBeGreaterThan(0);
                for (const sub of subjects) {
                    expect(slugSet.has(sub.slug)).toBe(true);
                    expect(Array.isArray(QUIZ_BANK[sub.slug])).toBe(true);
                    expect(QUIZ_BANK[sub.slug].length).toBeGreaterThanOrEqual(10);
                }
            }
        }
        expect(totalMajors).toBe(15);
    });

    it('saveStudentSubjects resolves catalog UUIDs read-only and never writes to subjects table', async () => {
        mockHandlers.subjects = () => ({
            data: [{ id: TEST_SUBJ_ID, slug: 'programming' }],
            error: null,
        });
        mockHandlers.student_subjects = (st) => {
            if (st.op === 'select') return { data: [], error: null };
            return { data: [{ student_id: TEST_USER_ID, subject_id: TEST_SUBJ_ID }], error: null };
        };

        const { data, error } = await saveStudentSubjects(TEST_USER_ID, [{ slug: 'programming', name: 'Programming' }]);
        expect(error).toBeNull();
        expect(data.length).toBe(1);

        const subjectWrites = mockCalls.filter((c) => c.table === 'subjects' && c.op !== 'select');
        expect(subjectWrites.length).toBe(0);

        const upsertCall = mockCalls.find((c) => c.table === 'student_subjects' && c.op === 'upsert');
        expect(upsertCall).toBeDefined();
        expect(upsertCall.payload[0]).toEqual({ student_id: TEST_USER_ID, subject_id: TEST_SUBJ_ID });
    });

    it('getStudentSubjects returns empty array from cloud instead of stale localStorage', async () => {
        localStorage.setItem(`ssc_student_subjects_${TEST_USER_ID}`, JSON.stringify([{ slug: 'old-cached' }]));
        mockHandlers.student_subjects = () => ({ data: [], error: null });

        const { data, error } = await getStudentSubjects(TEST_USER_ID);
        expect(error).toBeNull();
        expect(data).toEqual([]);
    });

    it('createTask and updateTask validate title, deadline, and cloud subject UUID', async () => {
        const emptyTitle = await createTask({ studentId: TEST_USER_ID, title: '   ', deadline: '2026-12-01T10:00:00Z' });
        expect(emptyTitle.error).toBeTruthy();

        const tooLong = await createTask({ studentId: TEST_USER_ID, title: 'a'.repeat(501), deadline: '2026-12-01T10:00:00Z' });
        expect(tooLong.error).toBeTruthy();

        const badDeadline = await createTask({ studentId: TEST_USER_ID, title: 'Valid Task', deadline: 'not-a-date' });
        expect(badDeadline.error).toBeTruthy();

        const badSubject = await createTask({
            studentId: TEST_USER_ID,
            subjectId: 'subj-1',
            title: 'Valid Task',
            deadline: '2026-12-01T10:00:00Z',
        });
        expect(badSubject.error).toBeTruthy();

        const badUpdate = await updateTask('task-id', { subjectId: 'subj-1' });
        expect(badUpdate.error).toBeTruthy();
    });

    it('saveQuizAttempt resolves slug to UUID, strips non-UUID response ids, and converts -1 to null', async () => {
        mockHandlers.subjects = () => ({ data: { id: TEST_SUBJ_ID }, error: null });
        mockHandlers.quiz_attempts = () => ({ data: { id: TEST_QUIZ_ATTEMPT_ID, score: 1 }, error: null });
        mockHandlers.quiz_responses = () => ({ data: [], error: null });

        const { data, error } = await saveQuizAttempt({
            studentId: TEST_USER_ID,
            subjectId: 'subj-programming',
            subjectSlug: 'programming',
            mode: 'rapid',
            score: 1,
            totalQuestions: 2,
            responses: [
                { question_id: TEST_QUESTION_UUID, selected_answer: 2 },
                { question_id: 'local-fallback-1', selected_answer: -1 },
                { question_id: TEST_QUESTION_UUID, selected_answer: -1 },
            ],
        });

        expect(error).toBeNull();
        expect(data.id).toBe(TEST_QUIZ_ATTEMPT_ID);

        const respInsert = mockCalls.find((c) => c.table === 'quiz_responses' && c.op === 'insert');
        expect(respInsert).toBeDefined();
        expect(respInsert.payload.length).toBe(2);
        expect(respInsert.payload[0].selected_answer).toBe(2);
        expect(respInsert.payload[1].selected_answer).toBeNull();
    });

    it('getQuizHistory returns cloud error cleanly when database query fails', async () => {
        mockHandlers.quiz_attempts = () => ({ data: null, error: { message: 'RLS denied' } });
        const { data, error } = await getQuizHistory(TEST_USER_ID);
        expect(data).toEqual([]);
        expect(error).toEqual({ message: 'RLS denied' });
    });

    it('generateAiQuiz & saveAiQuizAttempt handle unapplied 009 tables without silent crash and report dbPersisted', async () => {
        mockHandlers.subjects = () => ({ data: { id: TEST_SUBJ_ID }, error: null });
        mockHandlers.ai_quizzes = () => ({
            data: null,
            error: { message: "Could not find the table 'public.ai_quizzes' in the schema cache" },
        });

        const gen = await generateAiQuiz({
            subjectId: null,
            subjectSlug: 'programming',
            subjectName: 'Programming',
            topic: 'Recursion',
            difficulty: 'medium',
            questionCount: 5,
            studentId: TEST_USER_ID,
        });

        expect(gen.error).toBeNull();
        expect(gen.data.questions.length).toBe(5);
        expect(gen.data.dbPersisted).toBe(false);
        expect(gen.data.persistenceError).toContain('ai_quizzes');

        const attempt = await saveAiQuizAttempt({
            quizId: gen.data.quizId,
            studentId: TEST_USER_ID,
            score: 4,
            totalQuestions: 5,
            responses: [],
        });
        expect(attempt.error).toBeNull();
        expect(attempt.data.dbPersisted).toBe(false);
    });

    it('validateAndSanitizeQuestions removes duplicates and invalid question bounds', () => {
        const cleaned = validateAndSanitizeQuestions([
            {
                question: 'Valid Q1?',
                options: ['One', 'Two', 'Three', 'Four'],
                correct_answer: 1,
                explanation: 'Because two.',
            },
            {
                question: 'Valid Q1?',
                options: ['One', 'Two', 'Three', 'Four'],
                correct_answer: 1,
            },
            {
                question: 'Bad bounds?',
                options: ['A', 'B', 'C', 'D'],
                correct_answer: 9,
            },
        ]);
        expect(cleaned.length).toBe(1);
        expect(cleaned[0].correct_answer).toBe(1);
    });

    it('getUniversitiesCatalog merges Supabase rows and preserves unseeded catalog countries', async () => {
        mockHandlers.universities = () => ({
            data: [
                { country: 'South Korea', name: 'Ulsan College' },
                { country: 'South Korea', name: 'Seoul National University (SNU)' },
            ],
            error: null,
        });

        const { data, error } = await getUniversitiesCatalog();
        expect(error).toBeNull();
        expect(data['South Korea']).toEqual(['Ulsan College', 'Seoul National University (SNU)']);
        expect(data['Bhutan'].length).toBeGreaterThan(0);
        expect(data['Maldives'].length).toBeGreaterThan(0);
    });

    it('keeps Backend/ mirror synchronized with src/ and supabase/', () => {
        const rootDir = resolve(process.cwd());
        const jsFiles = [
            'auth-guard.js',
            'lib/supabase.js',
            'lib/academic-catalog.js',
            'lib/regional-catalog.js',
            'services/auth.js',
            'services/profile.js',
            'services/subjects.js',
            'services/tasks.js',
            'services/quiz.js',
            'services/ai-quiz.js',
        ];
        for (const rel of jsFiles) {
            const backendContent = readFileSync(resolve(rootDir, 'Backend', rel), 'utf8');
            const srcContent = readFileSync(resolve(rootDir, 'src', rel), 'utf8');
            const publicSrcContent = readFileSync(resolve(rootDir, 'public/src', rel), 'utf8');
            expect(backendContent).toBe(srcContent);
            expect(backendContent).toBe(publicSrcContent);
        }

        const migs = readdirSync(resolve(rootDir, 'supabase/migrations')).filter((f) => f.endsWith('.sql'));
        expect(migs.length).toBeGreaterThanOrEqual(10);
        for (const m of migs) {
            expect(readFileSync(resolve(rootDir, 'Backend/supabase/migrations', m), 'utf8'))
                .toBe(readFileSync(resolve(rootDir, 'supabase/migrations', m), 'utf8'));
        }
        expect(readFileSync(resolve(rootDir, 'Backend/supabase/setup_all.sql'), 'utf8'))
            .toBe(readFileSync(resolve(rootDir, 'supabase/setup_all.sql'), 'utf8'));
        expect(readFileSync(resolve(rootDir, 'Backend/supabase/functions/generate-ai-quiz/index.ts'), 'utf8'))
            .toBe(readFileSync(resolve(rootDir, 'supabase/functions/generate-ai-quiz/index.ts'), 'utf8'));
    });
});
