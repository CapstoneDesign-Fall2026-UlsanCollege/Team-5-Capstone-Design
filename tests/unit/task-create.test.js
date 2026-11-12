import { beforeEach, describe, expect, it, vi } from 'vitest';

const memoryStorage = new Map();
globalThis.localStorage = {
    getItem: (key) => (memoryStorage.has(key) ? memoryStorage.get(key) : null),
    setItem: (key, value) => memoryStorage.set(key, String(value)),
    removeItem: (key) => memoryStorage.delete(key),
    clear: () => memoryStorage.clear(),
};

vi.mock('../../src/lib/supabase.js', () => ({
    isConfigured: true,
    supabase: { from: () => { throw new Error('This test uses local storage only.'); } },
}));

const { createTask } = await import('../../src/services/tasks.js');

const LOCAL_TASKS_KEY = 'smart_study_tasks';
const validTask = {
    student_id: 'local-student',
    subject_id: 'programming',
    title: 'Finish lab report',
    deadline: '2026-11-20T09:00:00.000Z',
};

function storedTasks() {
    const raw = localStorage.getItem(LOCAL_TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
}

describe('Task create, reject, and local persistence', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('saves a valid task', async () => {
        const result = await createTask(validTask);
        expect(result.error).toBeNull();
        expect(result.data.title).toBe('Finish lab report');
        expect(storedTasks().map((task) => task.title)).toContain('Finish lab report');
    });

    it('rejects a blank title and does not save it', async () => {
        const result = await createTask({ ...validTask, title: '   ' });
        expect(result.data).toBeNull();
        expect(result.error.message).toBe('Task title must be between 1 and 500 characters.');
        expect(storedTasks()).toEqual([]);
    });

    it('keeps the valid task in local storage after create', async () => {
        await createTask(validTask);
        const saved = storedTasks();
        expect(saved).toHaveLength(1);
        expect(saved[0].title).toBe('Finish lab report');
    });
});