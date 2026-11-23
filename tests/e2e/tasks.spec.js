// @ts-check
import { test, expect } from '@playwright/test';
import { loginAsStudent, navigateToView } from './helpers/auth.js';

test.describe('Study Task Management & CRUD (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page, 'A');
    await navigateToView(page, 'tasks');
  });

  test('E2E-TASK-01: Tasks view displays create button, filters, and search bar', async ({ page }) => {
    await expect(page.locator('#add-task-btn')).toBeVisible();
    await expect(page.locator('#search-input')).toBeVisible();
    await expect(page.locator('.filters .filter-btn')).toHaveCount(4);
    await expect(page.locator('#view-tasks .plan-board')).toBeVisible();
  });

  test('E2E-TASK-02: Empty task title triggers client validation without creating row', async ({ page }) => {
    const initialCount = await page.locator('#task-container .task-card').count();
    await page.click('#add-task-btn');
    const modal = page.locator('#task-modal');
    await expect(modal).toBeVisible();

    await page.fill('#task-name', '');
    await page.click('#task-form button[type="submit"]');

    await expect(modal).toBeVisible();
    await page.click('#cancel-modal-btn');
    const finalCount = await page.locator('#task-container .task-card').count();
    expect(finalCount).toBe(initialCount);
  });

  test('E2E-TASK-03: Create new task, verify persistence across refresh, toggle complete, and delete', async ({ page }) => {
    const taskTitle = `E2E Test Task ${Date.now()}`;
    await page.click('#add-task-btn');
    await expect(page.locator('#task-modal')).toBeVisible();

    await page.fill('#task-name', taskTitle);
    await page.fill('#task-deadline', '2026-12-31T23:59');
    await page.click('#task-form button[type="submit"]');

    const taskCard = page.locator('#task-container .task-card', { hasText: taskTitle }).first();
    await expect(taskCard).toBeVisible({ timeout: 8000 });

    await page.reload();
    await navigateToView(page, 'tasks');
    await expect(taskCard).toBeVisible({ timeout: 8000 });

    const toggleBtn = taskCard.locator('.toggle-btn');
    await toggleBtn.click();
    await expect(toggleBtn).toHaveClass(/is-on/, { timeout: 5000 });

    await taskCard.locator('.delete-btn').click();
    await expect(page.locator('#confirm-modal')).toBeVisible();
    await page.click('#confirm-delete');
    await expect(taskCard).toHaveCount(0, { timeout: 8000 });
  });

  test('E2E-TASK-04: Task search input filters task list dynamically', async ({ page }) => {
    await page.fill('#search-input', 'NonExistentTaskQueryXYZ999');
    await expect(page.locator('#task-container .task-card:visible')).toHaveCount(0);
    await expect(page.locator('#empty-state')).toBeVisible();
  });
});
