// @ts-check
import { test, expect } from '@playwright/test';
import { ensureThemeMode, navigateToView, setupMockedDashboardSession } from './helpers/auth.js';

function todayDateOnly() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

test.describe('Smart Study Companion — 4 Feature Improvements & Time Schedule E2E (Mocked Non-Cloud)', () => {
  test('FEAT-01 & FEAT-02: Sidebar nav order & Subject deselection confirmation + failure rollback', async ({ page }) => {
    await setupMockedDashboardSession(page);
    await page.goto('/');
    await expect(page.locator('#view-dashboard')).toBeVisible({ timeout: 10000 });

    // Feature 2: Default landing view stays Dashboard; exact 7-item nav order
    await expect(page.locator('.nav-link[data-view="dashboard"]')).toHaveClass(/is-active/);
    const navViews = await page.locator('.side-nav .nav-link').evaluateAll((els) =>
      els.map((el) => ({
        view: el.getAttribute('data-view'),
        text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
      })),
    );
    expect(navViews).toEqual([
      { view: 'subjects', text: 'Subjects & University' },
      { view: 'dashboard', text: 'Dashboard' },
      { view: 'tasks', text: 'Study Tasks' },
      { view: 'analytics', text: 'Study Analytics' },
      { view: 'quiz', text: 'Quiz Practice & Results' },
      { view: 'schedule', text: 'Time Schedule' },
      { view: 'ai-tutor', text: 'AI Tutor' },
    ]);

    for (const item of navViews) {
      await navigateToView(page, item.view);
      await expect(page.locator(`#view-${item.view}`)).toBeVisible();
      await expect(page.locator(`.nav-link[data-view="${item.view}"]`)).toHaveClass(/is-active/);
    }

    await ensureThemeMode(page, 'dark');
    await navigateToView(page, 'quiz');
    await expect(page.locator('#view-quiz')).toBeVisible();
    await ensureThemeMode(page, 'light');

    await navigateToView(page, 'subjects');

    // Feature 1: Immediate select without modal on unselected subject
    const unselected = page.locator('#subject-scroll-container .scrollable-subject-card[aria-checked="false"]').first();
    const unselectedSlug = await unselected.getAttribute('data-subject-slug');
    await unselected.click();
    await expect(
      page.locator(`#subject-scroll-container .scrollable-subject-card[data-subject-slug="${unselectedSlug}"]`),
    ).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('#subject-remove-modal')).toBeHidden();

    // Deselecting an already-selected subject opens confirmation modal with exact wording
    const selectedCard = page.locator('#subject-scroll-container .scrollable-subject-card[data-subject-slug="databases"]');
    const selectedTitle = await selectedCard.locator('h4').innerText();
    await selectedCard.click();

    const removeModal = page.locator('#subject-remove-modal');
    await expect(removeModal).toBeVisible();
    await expect(removeModal).toContainText('Remove Subject?');
    await expect(removeModal).toContainText(`Are you sure you want to remove ${selectedTitle} from your selected subjects?`);
    await expect(removeModal).toContainText('Your existing study tasks, quiz history and progress will not be deleted.');

    // Cancel keeps subject selected
    await page.locator('#subject-remove-cancel').click();
    await expect(removeModal).toBeHidden();
    await expect(selectedCard).toHaveAttribute('aria-checked', 'true');

    // Escape closes without removing
    await selectedCard.focus();
    await page.keyboard.press('Enter');
    await expect(removeModal).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(removeModal).toBeHidden();
    await expect(selectedCard).toHaveAttribute('aria-checked', 'true');
    await expect(selectedCard).toBeFocused();

    // Confirm removal updates active selection & preserves existing tasks
    await selectedCard.click();
    await page.locator('#subject-remove-confirm').click();
    await expect(removeModal).toBeHidden({ timeout: 5000 });
    await expect(selectedCard).toHaveAttribute('aria-checked', 'false');

    await page.reload();
    await navigateToView(page, 'subjects');
    await expect(
      page.locator('#subject-scroll-container .scrollable-subject-card[data-subject-slug="databases"]'),
    ).toHaveAttribute('aria-checked', 'false');

    // Existing task history stays untouched
    await navigateToView(page, 'tasks');
    await expect(page.locator('#task-container')).toContainText('Review Binary Search Tree Traversals');
  });

  test('FEAT-01B: Restores previous subject selection with clear error when Supabase save fails', async ({ page }) => {
    await setupMockedDashboardSession(page, { failStudentSubjectsSave: true });
    await page.goto('/');
    await navigateToView(page, 'subjects');

    const selectedCard = page.locator('#subject-scroll-container .scrollable-subject-card[data-subject-slug="databases"]');
    await selectedCard.click();
    await expect(page.locator('#subject-remove-modal')).toBeVisible();
    await page.locator('#subject-remove-confirm').click();

    await expect(page.locator('#subject-remove-modal')).toBeHidden({ timeout: 5000 });
    await expect(selectedCard).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('.toast').first()).toContainText(/Could not remove/i);
  });

  test('FEAT-03: Optional multiline Task Description / Details (create, render safely, search, edit, clear, reload)', async ({ page }) => {
    await setupMockedDashboardSession(page);
    await page.goto('/');
    await navigateToView(page, 'tasks');

    // Create task with multiline notes + XSS string
    await page.getByRole('button', { name: /New task/i }).click();
    const modal = page.locator('#task-modal');
    await expect(modal).toBeVisible();

    const notes = '- Read Chapter 4.\n- Complete questions 1-10.\n<img src=x onerror="window.__xssTriggered=true">';
    await page.locator('#task-name').fill('Complete Chapter 4 Assignment');
    await page.locator('#task-description').fill(notes);
    await expect(page.locator('#task-description-count')).toHaveText(`${notes.length} / 1000`);
    await page.locator('#task-form button[type="submit"]').click();

    const taskCard = page.locator('#task-container .task-card', { hasText: 'Complete Chapter 4 Assignment' }).first();
    await expect(taskCard).toBeVisible({ timeout: 5000 });
    await expect(taskCard.locator('.task-desc')).toContainText('Read Chapter 4.');
    expect(await page.evaluate(() => Boolean(window.__xssTriggered))).toBe(false);

    // Search matches inside description too
    await page.locator('#search-input').fill('questions 1-10');
    await expect(taskCard).toBeVisible();
    await page.locator('#search-input').fill('');

    // Survives page reload
    await page.reload();
    await navigateToView(page, 'tasks');
    const reloadedCard = page.locator('#task-container .task-card', { hasText: 'Complete Chapter 4 Assignment' }).first();
    await expect(reloadedCard.locator('.task-desc')).toContainText('Read Chapter 4.');

    // Clear existing description on Edit
    await reloadedCard.locator('.edit-btn').click();
    await expect(page.locator('#task-description')).toHaveValue(notes);
    await page.locator('#task-description').fill('');
    await expect(page.locator('#task-description-count')).toHaveText('0 / 1000');
    await page.locator('#task-form button[type="submit"]').click();
    await expect(reloadedCard.locator('.task-desc')).toHaveCount(0);

    // Quick Add form in Subjects & University also saves multiline Task Description / Details
    await navigateToView(page, 'subjects');
    const quickDesc = '- Summarize DNS resolution.\n- Draw packet header diagram.';
    await page.locator('#create-task-name').fill('Quick Add Notes Task');
    await page.locator('#create-task-description').fill(quickDesc);
    await expect(page.locator('#create-task-description-count')).toHaveText(`${quickDesc.length} / 1000`);
    await page.locator('#create-task-deadline').fill('2026-12-01');
    await page.locator('#create-task-submit').click();

    await navigateToView(page, 'tasks');
    const quickCard = page.locator('#task-container .task-card', { hasText: 'Quick Add Notes Task' }).first();
    await expect(quickCard).toBeVisible({ timeout: 5000 });
    await expect(quickCard.locator('.task-desc')).toContainText('Summarize DNS resolution.');
  });

  test('FEAT-04: Manual Time Schedule full workflow (empty state, create, daily/weekly views, complete/undo, conflict dialog, edit/delete, responsive light/dark)', async ({ page }) => {
    await setupMockedDashboardSession(page);
    await page.goto('/');
    await navigateToView(page, 'schedule');

    // Empty state shown initially
    await expect(page.locator('#schedule-empty-state')).toBeVisible();
    await expect(page.locator('#schedule-empty-state')).toContainText('Your schedule is empty');

    const today = todayDateOnly();

    // Create a weekly schedule activity
    await page.locator('#add-schedule-btn').click();
    await expect(page.locator('#schedule-modal')).toBeVisible();
    await page.locator('#schedule-title').fill('Data Structures Revision');
    await page.locator('#schedule-subject').selectOption({ label: 'Data Structures & Algorithms' });
    await page.locator('#schedule-date').fill(today);
    await page.locator('#schedule-start-time').fill('19:00');
    await page.locator('#schedule-end-time').fill('20:30');
    await page.locator('#schedule-type').selectOption('revision');
    await page.locator('#schedule-description').fill('Review AVL trees and shortest-path algorithms.');
    await expect(page.locator('#schedule-description-count')).toContainText('/ 1000');
    await page.locator('#schedule-repeat-rule').selectOption('weekly');
    await page.locator('#schedule-save-btn').click();

    await expect(page.locator('#schedule-modal')).toBeHidden({ timeout: 5000 });
    await expect(page.locator('#sched-stat-today-count')).toHaveText('1');
    await expect(page.locator('#sched-stat-planned-time')).toHaveText('1h 30m');
    await expect(page.locator('#sched-stat-completed-count')).toHaveText('0');

    const dayCard = page.locator('#schedule-daily-list .schedule-card', { hasText: 'Data Structures Revision' }).first();
    await expect(dayCard).toBeVisible();

    // Completion + Undo
    await dayCard.locator('.schedule-complete-btn').click();
    await expect(dayCard).toHaveClass(/is-completed/);
    await expect(page.locator('#sched-stat-completed-count')).toHaveText('1');

    await dayCard.locator('.schedule-complete-btn').click();
    await expect(dayCard).not.toHaveClass(/is-completed/);
    await expect(page.locator('#sched-stat-completed-count')).toHaveText('0');

    // Conflict detection (adjust vs save anyway)
    await page.locator('#add-schedule-btn').click();
    await page.locator('#schedule-title').fill('Overlapping Practice');
    await page.locator('#schedule-date').fill(today);
    await page.locator('#schedule-start-time').fill('19:30');
    await page.locator('#schedule-end-time').fill('21:00');
    await page.locator('#schedule-type').selectOption('quiz_practice');
    await page.locator('#schedule-save-btn').click();

    const conflictModal = page.locator('#schedule-conflict-modal');
    await expect(conflictModal).toBeVisible();
    await expect(conflictModal).toContainText('Schedule Conflict');
    await expect(conflictModal).toContainText('7:00 PM and 8:30 PM');
    await page.locator('#schedule-conflict-save').click();
    await expect(conflictModal).toBeHidden({ timeout: 5000 });
    await expect(page.locator('#sched-stat-today-count')).toHaveText('2');

    // Switch to Weekly View and verify Mon-Sun grid
    await page.locator('#schedule-tab-weekly').click();
    await expect(page.locator('#schedule-week-grid .schedule-day-col')).toHaveCount(7);
    await expect(page.locator('#schedule-week-grid')).toContainText('Data Structures Revision');

    // Persistence across reload
    await page.reload();
    await navigateToView(page, 'schedule');
    await expect(page.locator('#schedule-daily-list .schedule-card')).toHaveCount(2);

    // Recurring Delete: Delete only this occurrence
    const recurringCard = page.locator('#schedule-daily-list .schedule-card', { hasText: 'Data Structures Revision' }).first();
    await recurringCard.locator('[data-sched-delete]').click();
    const delModal = page.locator('#schedule-delete-modal');
    await expect(delModal).toBeVisible();
    await expect(page.locator('#schedule-delete-single-btn')).toBeVisible();
    await page.locator('#schedule-delete-single-btn').click();
    await expect(delModal).toBeHidden({ timeout: 5000 });
    await expect(page.locator('#schedule-daily-list .schedule-card')).toHaveCount(1);

    // Next week occurrence still exists because only single occurrence was removed
    await page.locator('#schedule-next-btn').click(); // wait: tab is Daily View (+1 day), click Weekly for +7 days!
    await page.locator('#schedule-today-btn').click();
    await page.locator('#schedule-tab-weekly').click();
    await page.locator('#schedule-next-btn').click();
    await expect(page.locator('#schedule-week-grid')).toContainText('Data Structures Revision');

    // Mobile & Dark/Light overflow check on Time Schedule
    await page.setViewportSize({ width: 375, height: 667 });
    for (const mode of ['light', 'dark']) {
      await ensureThemeMode(page, mode);
      const box = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
      }));
      expect(box.sw, `mobile schedule ${mode}`).toBeLessThanOrEqual(box.cw + 2);
    }
  });
});
