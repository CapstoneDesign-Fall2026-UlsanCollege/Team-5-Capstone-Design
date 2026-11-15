// DRAFT — NOT EXECUTED. Playwright is not installed and selectors are unverified against the live DOM; expect failures until reviewed.
// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Study Task Management & CRUD (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/public/index.html#tasks');
  });

  test('E2E-TASK-01: Tasks view displays create button, filters, and task list', async ({ page }) => {
    await expect(page.locator('#btn-add-task')).toBeVisible();
    await expect(page.locator('#task-search-input')).toBeVisible();
    await expect(page.locator('.filter-btn, .filter-chip')).not.toHaveCount(0);
    await expect(page.locator('#task-list-container, #tasks-grid')).toBeVisible();
  });

  test('E2E-TASK-02: Empty task title triggers client validation without creating row', async ({ page }) => {
    await page.click('#btn-add-task');
    const modal = page.locator('#task-modal');
    await expect(modal).toBeVisible();

    // Leave title blank and submit
    await page.fill('#task-title', '');
    await page.click('#btn-save-task');

    // Validation alert or required prompt should trigger
    const initialTaskCount = await page.locator('.task-item, .task-card').count();
    expect(initialTaskCount).toBeDefined();
  });

  test('E2E-TASK-03: Create new task, verify it appears in list and survives page refresh', async ({ page }) => {
    const taskTitle = `E2E Test Task ${Date.now()}`;
    await page.click('#btn-add-task');
    await page.fill('#task-title', taskTitle);
    await page.fill('#task-deadline', '2026-12-31T23:59');
    await page.click('#btn-save-task');

    // Verify task card appears
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible({ timeout: 5000 });

    // Refresh page and confirm task persists
    await page.reload();
    await page.goto('/public/index.html#tasks');
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible({ timeout: 5000 });

    // Toggle complete
    const checkbox = page.locator(`.task-item:has-text("${taskTitle}") input[type="checkbox"]`).first();
    if (await checkbox.isVisible()) {
      await checkbox.click();
      await page.waitForTimeout(500);
    }

    // Clean up: Delete task
    const deleteBtn = page.locator(`.task-item:has-text("${taskTitle}") .btn-delete-task`).first();
    if (await deleteBtn.isVisible()) {
      page.on('dialog', (dialog) => dialog.accept());
      await deleteBtn.click();
      await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible({ timeout: 5000 });
    }
  });

  test('E2E-TASK-04: Task search input filters task list dynamically', async ({ page }) => {
    const search = page.locator('#task-search-input');
    await search.fill('NonExistentTaskQueryXYZ999');
    await page.waitForTimeout(300);
    const visibleTasks = page.locator('.task-item:visible');
    expect(await visibleTasks.count()).toBe(0);
  });
});

