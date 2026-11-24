// @ts-check
import { test, expect } from '@playwright/test';
import { loginAsStudent, navigateToView } from './helpers/auth.js';

test.describe('Study Task Analytics Dashboard (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page, 'A');
    await navigateToView(page, 'analytics');
  });

  test('E2E-ANLY-01: Analytics dashboard renders KPI ring, weekly chart, and workload counts', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Study Task Analytics/i })).toBeVisible();
    await expect(page.locator('#analytics-progress-text')).toBeVisible();
    await expect(page.locator('#weekly-activity-chart')).toBeVisible();
    await expect(page.locator('#analytics-task-total')).toBeVisible();
    await expect(page.locator('#workload-completed-text')).toBeVisible();
    await expect(page.locator('#workload-pending-text')).toBeVisible();
    await expect(page.locator('#workload-overdue-text')).toBeVisible();
  });

  test('E2E-ANLY-02: Subject progress and workload breakdown containers render cleanly', async ({ page }) => {
    await expect(page.locator('#subject-progress-container')).toBeVisible();
    await expect(page.locator('#workload-completed-bar')).toBeAttached();
    await expect(page.locator('#workload-pending-bar')).toBeAttached();
    await expect(page.locator('#workload-overdue-bar')).toBeAttached();
  });

  test('E2E-ANLY-03: Quiz Analytics summary card displays performance metrics', async ({ page }) => {
    await expect(page.locator('#analytics-quiz-summary')).toBeVisible();
    await expect(page.locator('#analytics-quiz-total')).toBeVisible();
    await expect(page.locator('#analytics-quiz-avg')).toBeVisible();
    await expect(page.locator('#analytics-quiz-best')).toBeVisible();
  });
});
