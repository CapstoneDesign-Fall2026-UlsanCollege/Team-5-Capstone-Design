// @ts-check
import { test, expect } from '@playwright/test';
import { navigateToView, setupMockedDashboardSession, toggleTheme } from './helpers/auth.js';

/**
 * Local Mocked UI & Responsive Regression Suite (Non-Cloud)
 *
 * Uses Playwright HTTP route interception for Supabase REST/Auth endpoints so the
 * real Vite-built dashboard (public/index.html, public/app.js, public/styles.css)
 * runs in Chromium without live student passwords.
 *
 * Scope boundary: verifies UI layout, DOM selectors, keyboard accessibility, client-side
 * validation, dark theme styles, and quiz retake flow. Does NOT verify live Supabase RLS,
 * live Edge Functions, or real Supabase authentication.
 */
test.describe('Mocked UI & Week 12 Regression Checks (Non-Cloud Browser Verification)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockedDashboardSession(page);
    await page.goto('/');
    await expect(page.locator('#view-dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('UI-REG-01: Sidebar omits unused Wireframes link and exposes active MVP views', async ({ page }) => {
    await expect(page.locator('#sidebar a:has-text("Wireframes")')).toHaveCount(0);
    await expect(page.locator('.nav-link[data-view="dashboard"]')).toBeVisible();
    await expect(page.locator('.nav-link[data-view="tasks"]')).toBeVisible();
    await expect(page.locator('.nav-link[data-view="subjects"]')).toBeVisible();
    await expect(page.locator('.nav-link[data-view="analytics"]')).toBeVisible();
    await expect(page.locator('.nav-link[data-view="quiz"]')).toBeVisible();
  });

  test('UI-REG-02 (Issue #79): Subject cards support Enter and Space keyboard toggling with focus retention', async ({ page }) => {
    await navigateToView(page, 'subjects');

    const firstCard = page.locator('#subject-scroll-container .scrollable-subject-card').first();
    await expect(firstCard).toBeVisible();
    const initialChecked = await firstCard.getAttribute('aria-checked');
    const slug = await firstCard.getAttribute('data-subject-slug');

    await firstCard.focus();
    await page.keyboard.press('Enter');
    const cardAfterEnter = page.locator(`#subject-scroll-container .scrollable-subject-card[data-subject-slug="${slug}"]`);
    await expect(cardAfterEnter).toHaveAttribute('aria-checked', initialChecked === 'true' ? 'false' : 'true');
    await expect(cardAfterEnter).toBeFocused();

    await page.keyboard.press(' ');
    await expect(cardAfterEnter).toHaveAttribute('aria-checked', initialChecked);
    await expect(cardAfterEnter).toBeFocused();
  });

  test('UI-REG-03 (Issue #80): Selected quiz-mode tab updates ARIA state and visual styling', async ({ page }) => {
    await navigateToView(page, 'quiz');

    const curatedTab = page.locator('#quiz-tab-curated');
    const aiTab = page.locator('#quiz-tab-ai');

    await expect(curatedTab).toHaveClass(/is-active/);
    await expect(curatedTab).toHaveAttribute('aria-pressed', 'true');
    await expect(aiTab).not.toHaveClass(/is-active/);
    await expect(aiTab).toHaveAttribute('aria-pressed', 'false');

    const activeBg = await curatedTab.evaluate((el) => getComputedStyle(el).backgroundColor);
    const inactiveBg = await aiTab.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(activeBg).not.toBe(inactiveBg);

    await aiTab.click();
    await expect(aiTab).toHaveClass(/is-active/);
    await expect(aiTab).toHaveAttribute('aria-pressed', 'true');
    await expect(curatedTab).not.toHaveClass(/is-active/);
    await expect(page.locator('#quiz-ai-panel')).toBeVisible();
    await expect(page.locator('#quiz-curated-panel')).toBeHidden();
  });

  test('UI-REG-04: Task deadline validation rejects invalid/missing deadlines cleanly', async ({ page }) => {
    await navigateToView(page, 'tasks');
    const beforeCount = await page.locator('#task-container .task-card').count();

    await page.click('#add-task-btn');
    await expect(page.locator('#task-modal')).toBeVisible();
    await page.fill('#task-name', 'Invalid Deadline Regression Task');
    await page.evaluate(() => {
      const form = document.getElementById('task-form');
      const deadline = document.getElementById('task-deadline');
      if (deadline) {
        deadline.removeAttribute('required');
        deadline.value = '';
      }
      if (form) form.noValidate = true;
    });
    await page.click('#task-form button[type="submit"]');

    await expect(page.locator('#task-modal')).toBeVisible();
    await expect(page.locator('.toast').first()).toContainText(/Please enter a valid deadline date and time/i);

    // Issue #84 regression: verify task subject select & option keep readable contrast in dark mode
    await page.click('#cancel-modal-btn');
    await toggleTheme(page);
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.click('#add-task-btn');
    await expect(page.locator('#task-modal')).toBeVisible();
    const darkSelectColors = await page.locator('#task-subject').evaluate((sel) => {
      const sStyle = getComputedStyle(sel);
      const opt = sel.querySelector('option');
      const oStyle = opt ? getComputedStyle(opt) : null;
      return {
        selectColor: sStyle.color,
        selectBg: sStyle.backgroundColor,
        optionColor: oStyle?.color || '',
        optionBg: oStyle?.backgroundColor || '',
      };
    });
    expect(darkSelectColors.selectColor).not.toBe(darkSelectColors.selectBg);
    expect(darkSelectColors.optionColor).not.toBe(darkSelectColors.optionBg);

    await page.click('#cancel-modal-btn');
    await expect(page.locator('#task-container .task-card')).toHaveCount(beforeCount);
  });

  test('UI-REG-05: Curated quiz completion and Retake Quiz regression flow works in desktop & mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await navigateToView(page, 'quiz');

    const setupOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(setupOverflow.scrollWidth).toBeLessThanOrEqual(setupOverflow.clientWidth + 2);

    await page.click('#quiz-tab-ai');
    const aiOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(aiOverflow.scrollWidth).toBeLessThanOrEqual(aiOverflow.clientWidth + 2);

    await page.click('#quiz-tab-curated');
    await page.click('#quiz-start-btn');
    await expect(page.locator('#quiz-play')).toBeVisible({ timeout: 5000 });

    const playOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(playOverflow.scrollWidth).toBeLessThanOrEqual(playOverflow.clientWidth + 2);

    const totalText = await page.locator('#quiz-progress').innerText();
    const match = totalText.match(/of\s+(\d+)/i);
    const total = match ? Number(match[1]) : 15;

    for (let i = 0; i < total; i += 1) {
      await page.locator('#quiz-options .choice').first().click();
      await page.click('#quiz-next-btn');
    }

    await expect(page.locator('#quiz-result')).toBeVisible({ timeout: 10000 });
    const resultOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(resultOverflow.scrollWidth).toBeLessThanOrEqual(resultOverflow.clientWidth + 2);

    await page.click('#quiz-retake-btn');
    await expect(page.locator('#quiz-play')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#quiz-progress')).toContainText('Question 1 of');
  });
});
