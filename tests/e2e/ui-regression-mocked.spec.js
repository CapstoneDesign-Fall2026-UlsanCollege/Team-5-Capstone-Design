// @ts-check
import { test, expect } from '@playwright/test';
import { ensureThemeMode, navigateToView, setupMockedDashboardSession } from './helpers/auth.js';

const RESPONSIVE_VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
];

/**
 * Local Mocked UI & Responsive Regression Suite (Non-Cloud)
 *
 * Tracked separately from the 24-case live Playwright E2E baseline.
 * Uses Playwright route interception to test public/index.html + app.js + styles.css
 * across viewports, themes, keyboard interactions, and form validations without live passwords.
 */
test.describe('Mocked UI & Week 12 Regression Checks (Non-Cloud Browser Verification)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockedDashboardSession(page);
    await page.goto('/');
    await expect(page.locator('#view-dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('UI-REG-01: Sidebar omits unused Wireframes link and exposes active views in new order', async ({ page }) => {
    await expect(page.locator('#sidebar a:has-text("Wireframes")')).toHaveCount(0);
    await expect(page.locator('.nav-link[data-view="tasks"]')).toBeVisible();
    await expect(page.locator('.nav-link[data-view="dashboard"]')).toBeVisible();
    await expect(page.locator('.nav-link[data-view="subjects"]')).toBeVisible();
    await expect(page.locator('.nav-link[data-view="analytics"]')).toBeVisible();
    await expect(page.locator('.nav-link[data-view="quiz"]')).toBeVisible();
    await expect(page.locator('.nav-link[data-view="schedule"]')).toBeVisible();
    await expect(page.locator('.nav-link[data-view="ai-tutor"]')).toBeVisible();
  });

  test('UI-REG-02 (Issue #79): Subject cards support Enter and Space keyboard toggling with removal confirm & focus retention', async ({ page }) => {
    await navigateToView(page, 'subjects');

    // Immediate keyboard selection on an unselected subject
    const unselectedCard = page.locator('#subject-scroll-container .scrollable-subject-card[aria-checked="false"]').first();
    await expect(unselectedCard).toBeVisible();
    const slug = await unselectedCard.getAttribute('data-subject-slug');

    await unselectedCard.focus();
    await page.keyboard.press('Enter');
    const cardAfterSelect = page.locator(`#subject-scroll-container .scrollable-subject-card[data-subject-slug="${slug}"]`);
    await expect(cardAfterSelect).toHaveAttribute('aria-checked', 'true');
    await expect(cardAfterSelect).toBeFocused();

    // Keyboard deselection opens Remove Subject? confirmation; confirming removes and restores focus
    await page.keyboard.press(' ');
    const removeModal = page.locator('#subject-remove-modal');
    await expect(removeModal).toBeVisible();
    await page.locator('#subject-remove-confirm').click();
    await expect(removeModal).toBeHidden();
    await expect(cardAfterSelect).toHaveAttribute('aria-checked', 'false');
    await expect(cardAfterSelect).toBeFocused();
  });

  test('UI-REG-03 (Issue #80): Selected quiz-mode tab updates ARIA state and visual styling', async ({ page }) => {
    await navigateToView(page, 'quiz');

    const curatedTab = page.getByRole('tab', { name: /Standard & Rapid Quiz/i });
    const aiTab = page.getByRole('tab', { name: /AI Quiz Generator/i });

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
    await expect(aiTab).toHaveAttribute('tabindex', '0');
    await expect(curatedTab).not.toHaveClass(/is-active/);
    await expect(curatedTab).toHaveAttribute('tabindex', '-1');
    await expect(page.locator('#quiz-ai-panel')).toBeVisible();
    await expect(page.locator('#quiz-curated-panel')).toBeHidden();

    // WAI-ARIA keyboard tab switching (ArrowLeft / ArrowRight)
    await aiTab.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(curatedTab).toHaveClass(/is-active/);
    await expect(curatedTab).toHaveAttribute('aria-pressed', 'true');
    await expect(curatedTab).toBeFocused();
    await expect(page.locator('#quiz-curated-panel')).toBeVisible();
    await expect(page.locator('#quiz-ai-panel')).toBeHidden();
  });

  test('UI-REG-04 (Issue #84): Task deadline validation & dark/light subject dropdown contrast and focus', async ({ page }) => {
    await navigateToView(page, 'tasks');
    const beforeCount = await page.locator('#task-container .task-card').count();

    await page.getByRole('button', { name: /New task/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByLabel(/Task name/i).fill('Invalid Deadline Regression Task');
    await page.evaluate(() => {
      const form = document.getElementById('task-form');
      const deadline = document.getElementById('task-deadline');
      if (deadline) {
        deadline.removeAttribute('required');
        deadline.value = '';
      }
      if (form) form.noValidate = true;
    });
    await dialog.getByRole('button', { name: /Save task/i }).click();

    await expect(dialog).toBeVisible();
    await expect(page.locator('.toast').first()).toContainText(/Please enter a valid deadline date and time/i);

    for (const mode of ['light', 'dark']) {
      await dialog.getByRole('button', { name: /Cancel/i }).click();
      await ensureThemeMode(page, mode);
      await page.getByRole('button', { name: /New task/i }).click();
      await expect(dialog).toBeVisible();
      const subjectSelect = page.locator('#task-subject');
      await subjectSelect.focus();
      const styles = await subjectSelect.evaluate((sel) => {
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
      expect(styles.selectColor).not.toBe(styles.selectBg);
      expect(styles.optionColor).not.toBe(styles.optionBg);
    }

    await dialog.getByRole('button', { name: /Cancel/i }).click();
    await expect(page.locator('#task-container .task-card')).toHaveCount(beforeCount);
  });

  test('UI-REG-05: Curated & Rapid quiz completion and Retake Quiz preserve config cleanly', async ({ page }) => {
    await navigateToView(page, 'quiz');
    await page.getByRole('button', { name: /Start rapid quiz/i }).click();
    await expect(page.locator('#quiz-play')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#quiz-timer')).toBeVisible();

    const totalText = await page.locator('#quiz-progress').innerText();
    const match = totalText.match(/of\s+(\d+)/i);
    const total = match ? Number(match[1]) : 10;

    for (let i = 0; i < total; i += 1) {
      await page.locator('#quiz-options .choice').first().click();
      await page.locator('#quiz-next-btn').click();
    }

    await expect(page.locator('#quiz-result')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Retake quiz/i }).click();
    await expect(page.locator('#quiz-play')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#quiz-timer')).toBeVisible();
    await expect(page.locator('#quiz-progress')).toContainText(`Question 1 of ${total}`);
  });

  test('UI-REG-06 (Issue #83): Full 7-viewport Light/Dark responsive Quiz check has zero horizontal overflow', async ({ page }) => {
    test.setTimeout(120000);
    for (const vp of RESPONSIVE_VIEWPORTS) {
      await page.setViewportSize(vp);
      for (const theme of ['light', 'dark']) {
        await ensureThemeMode(page, theme);
        await navigateToView(page, 'quiz');

        // 1. Setup Curated tab
        const curatedCheck = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(curatedCheck.scrollWidth, `${vp.width}px ${theme} curated setup`).toBeLessThanOrEqual(curatedCheck.clientWidth + 2);

        // 2. Setup AI Quiz tab
        await page.getByRole('tab', { name: /AI Quiz Generator/i }).click();
        const aiCheck = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(aiCheck.scrollWidth, `${vp.width}px ${theme} AI setup`).toBeLessThanOrEqual(aiCheck.clientWidth + 2);

        // 3. Rapid Quiz Play (with live timer & 4 options)
        await page.getByRole('tab', { name: /Standard & Rapid Quiz/i }).click();
        await page.getByRole('button', { name: /Start rapid quiz/i }).click();
        await expect(page.locator('#quiz-play')).toBeVisible();
        await expect(page.locator('#quiz-timer')).toBeVisible();

        const playCheck = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(playCheck.scrollWidth, `${vp.width}px ${theme} quiz play`).toBeLessThanOrEqual(playCheck.clientWidth + 2);

        const totalText = await page.locator('#quiz-progress').innerText();
        const total = Number(totalText.match(/of\s+(\d+)/i)?.[1] || 10);
        for (let i = 0; i < total; i += 1) {
          await page.locator('#quiz-options .choice').first().click();
          await page.locator('#quiz-next-btn').click();
        }

        // 4. Quiz Result + Retake actions
        await expect(page.locator('#quiz-result')).toBeVisible();
        const resultCheck = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(resultCheck.scrollWidth, `${vp.width}px ${theme} quiz result`).toBeLessThanOrEqual(resultCheck.clientWidth + 2);

        await page.getByRole('button', { name: /Choose another quiz/i }).click();
        await expect(page.locator('#quiz-setup')).toBeVisible();
      }
    }
  });
});
