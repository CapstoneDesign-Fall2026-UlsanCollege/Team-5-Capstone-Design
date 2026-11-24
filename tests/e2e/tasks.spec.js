// @ts-check
import { test, expect } from '@playwright/test';
import { loginAsStudent, navigateToView } from './helpers/auth.js';

test.describe('Study Task Management & CRUD (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page, 'A');
    await navigateToView(page, 'tasks');
  });

  test('E2E-TASK-01: Tasks view displays create button, filters, and search bar', async ({ page }) => {
    await expect(page.getByRole('button', { name: /New task/i })).toBeVisible();
    await expect(page.getByPlaceholder(/Search tasks or subjects/i)).toBeVisible();
    await expect(page.getByRole('tablist', { name: /Task status/i }).getByRole('button')).toHaveCount(4);
    await expect(page.locator('#view-tasks .plan-board')).toBeVisible();
  });

  test('E2E-TASK-02: Empty task title triggers client validation without creating row', async ({ page }) => {
    const initialCount = await page.locator('#task-container .task-card').count();
    await page.getByRole('button', { name: /New task/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByLabel(/Task name/i).fill('');
    await dialog.getByRole('button', { name: /Save task/i }).click();

    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /Cancel/i }).click();
    await expect(page.locator('#task-container .task-card')).toHaveCount(initialCount);
  });

  test('E2E-TASK-03: Create new task, verify persistence across refresh, toggle complete, and delete', async ({ page }) => {
    const taskTitle = `E2E Test Task ${Date.now()}`;
    await page.getByRole('button', { name: /New task/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByLabel(/Task name/i).fill(taskTitle);
    await dialog.getByLabel(/Deadline/i).fill('2026-12-31T23:59');
    await dialog.getByRole('button', { name: /Save task/i }).click();

    const taskCard = page.locator('#task-container .task-card', { hasText: taskTitle }).first();
    await expect(taskCard).toBeVisible({ timeout: 8000 });

    await page.reload();
    await navigateToView(page, 'tasks');
    await expect(taskCard).toBeVisible({ timeout: 8000 });

    const toggleBtn = taskCard.getByRole('button', { name: /Mark as completed/i });
    await toggleBtn.click();
    await expect(taskCard.locator('.toggle-btn')).toHaveClass(/is-on/, { timeout: 5000 });

    await taskCard.getByRole('button', { name: /Delete task/i }).click();
    const confirmDialog = page.locator('#confirm-modal');
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(taskCard).toHaveCount(0, { timeout: 8000 });
  });

  test('E2E-TASK-04: Task search input filters task list dynamically', async ({ page }) => {
    await page.getByPlaceholder(/Search tasks or subjects/i).fill('NonExistentTaskQueryXYZ999');
    await expect(page.locator('#task-container .task-card:visible')).toHaveCount(0);
    await expect(page.locator('#empty-state')).toBeVisible();
  });
});
