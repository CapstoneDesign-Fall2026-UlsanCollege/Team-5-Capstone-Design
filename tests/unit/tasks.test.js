import { describe, it, expect } from 'vitest';

function calculateTaskMetrics(tasks) {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter((t) => !t.completed && new Date(t.deadline) < new Date()).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, pending, overdue, percentage };
}

function filterTasks(tasks, filter, subjectTab, searchQuery) {
    const query = (searchQuery || '').trim().toLowerCase();
    return tasks.filter((task) => {
        if (filter === 'pending' && task.completed) return false;
        if (filter === 'completed' && !task.completed) return false;
        if (subjectTab !== 'all' && task.subject !== subjectTab) return false;
        if (query && !`${task.subject} ${task.name}`.toLowerCase().includes(query)) return false;
        return true;
    }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
}

describe('Study Task Calculations & Filtering', () => {
    const mockTasks = [
        { id: '1', subject: 'Programming', name: 'Finish Lab 1', deadline: new Date(Date.now() - 3600000).toISOString(), completed: false },
        { id: '2', subject: 'Databases', name: 'ER Diagram', deadline: new Date(Date.now() + 86400000).toISOString(), completed: true },
        { id: '3', subject: 'Programming', name: 'Prepare Quiz', deadline: new Date(Date.now() + 172800000).toISOString(), completed: false },
    ];

    it('calculates total, completed, pending, overdue, and percentage correctly', () => {
        const metrics = calculateTaskMetrics(mockTasks);
        expect(metrics.total).toBe(3);
        expect(metrics.completed).toBe(1);
        expect(metrics.pending).toBe(2);
        expect(metrics.overdue).toBe(1);
        expect(metrics.percentage).toBe(33);
    });

    it('returns 0% progress when no tasks exist', () => {
        const metrics = calculateTaskMetrics([]);
        expect(metrics.percentage).toBe(0);
        expect(metrics.total).toBe(0);
    });

    it('filters by status: pending and completed', () => {
        const pending = filterTasks(mockTasks, 'pending', 'all', '');
        expect(pending.length).toBe(2);
        expect(pending.every(t => !t.completed)).toBe(true);

        const completed = filterTasks(mockTasks, 'completed', 'all', '');
        expect(completed.length).toBe(1);
        expect(completed[0].id).toBe('2');
    });

    it('filters by subject tab', () => {
        const progTasks = filterTasks(mockTasks, 'all', 'Programming', '');
        expect(progTasks.length).toBe(2);
        expect(progTasks.every(t => t.subject === 'Programming')).toBe(true);
    });

    it('filters by keyword search across title and subject', () => {
        const searchRes = filterTasks(mockTasks, 'all', 'all', 'diagram');
        expect(searchRes.length).toBe(1);
        expect(searchRes[0].name).toBe('ER Diagram');
    });
});

