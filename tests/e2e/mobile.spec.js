// @ts-check
import { test, expect } from '@playwright/test';
import { loginAsStudent, navigateToView } from './helpers/auth.js';

test.describe('Mobile Viewport & Responsive Design (E2E)', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page, 'A');
  });

  test('E2E-MOB-01: Mobile dashboard loads without horizontal overflow', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });

  test('E2E-MOB-02: Mobile navigation drawer opens and dark theme toggle works', async ({ page }) => {
    await page.getByRole('button', { name: /Open menu/i }).click();
    const sidebar = page.locator('#sidebar');
    await expect(sidebar).toHaveClass(/is-open/);
    await expect(sidebar).toBeVisible();

    const themeBtn = page.locator('#theme-toggle-btn');
    await expect(themeBtn).toBeVisible();

    const beforeDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    await themeBtn.click();
    const afterDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(afterDark).not.toBe(beforeDark);

    await page.getByRole('button', { name: /Close menu/i }).click();
    await expect(sidebar).not.toHaveClass(/is-open/);
  });

  test('E2E-MOB-03: Switching views through mobile navigation drawer works smoothly', async ({ page }) => {
    await navigateToView(page, 'analytics');
    await expect(page.locator('#view-analytics')).toBeVisible();

    await navigateToView(page, 'tasks');
    await expect(page.locator('#view-tasks')).toBeVisible();
  });

  test('E2E-MOB-04: Mobile quiz setup and AI tab have zero horizontal overflow', async ({ page }) => {
    await navigateToView(page, 'quiz');
    const curatedWidth = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(curatedWidth.scrollWidth).toBeLessThanOrEqual(curatedWidth.clientWidth + 2);

    await page.getByRole('tab', { name: /AI Quiz Generator/i }).click();
    const aiWidth = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(aiWidth.scrollWidth).toBeLessThanOrEqual(aiWidth.clientWidth + 2);
  });
});
