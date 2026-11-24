// @ts-check
import { test, expect } from '@playwright/test';
import { loginAsStudent, navigateToView } from './helpers/auth.js';

test.describe('Subject Quiz & AI Quiz Practice (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page, 'A');
    await navigateToView(page, 'quiz');
  });

  test('E2E-QUIZ-01: Quiz setup view renders mode options, subject selector, and history panel', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /Standard & Rapid Quiz/i })).toBeVisible();
    await expect(page.getByLabel(/^Subject$/i)).toBeVisible();
    await expect(page.locator('#quiz-curated-panel').getByLabel(/^Difficulty Level$/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Start 15-question quiz/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Start rapid quiz/i })).toBeVisible();
    await expect(page.locator('#quiz-history-panel')).toBeVisible();
    await expect(page.locator('#quiz-history-list')).toBeVisible();
  });

  test('E2E-QUIZ-02: AI Quiz tab displays topic prompt, difficulty selector, and generator button', async ({ page }) => {
    const aiTab = page.getByRole('tab', { name: /AI Quiz Generator/i });
    await expect(aiTab).toBeVisible();
    await aiTab.click();

    await expect(aiTab).toHaveClass(/is-active/);
    await expect(aiTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#quiz-curated-panel')).toBeHidden();
    await expect(page.getByLabel(/Academic Subject/i)).toBeVisible();
    await expect(page.getByLabel(/Quiz Topic \/ Concept Prompt/i)).toBeVisible();
    await expect(page.locator('#quiz-ai-difficulty')).toBeVisible();
    await expect(page.getByLabel(/Number of Questions/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate AI Quiz/i })).toBeVisible();
  });

  test('E2E-QUIZ-03: Starting curated quiz displays question card with 4 choices', async ({ page }) => {
    await page.getByRole('button', { name: /Start 15-question quiz/i }).click();

    await expect(page.locator('#quiz-play')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#quiz-question')).not.toHaveText('');
    await expect(page.locator('#quiz-options input[name="quiz-choice"]')).toHaveCount(4);
  });

  test('E2E-QUIZ-04: Completing and retaking quiz starts a clean new attempt', async ({ page }) => {
    await page.getByRole('button', { name: /Start 15-question quiz/i }).click();
    await expect(page.locator('#quiz-play')).toBeVisible({ timeout: 5000 });

    const totalText = await page.locator('#quiz-progress').innerText();
    const match = totalText.match(/of\s+(\d+)/i);
    const total = match ? Number(match[1]) : 15;

    for (let i = 0; i < total; i += 1) {
      await page.locator('#quiz-options .choice').first().click();
      await page.locator('#quiz-next-btn').click();
    }

    await expect(page.locator('#quiz-result')).toBeVisible({ timeout: 10000 });
    const retakeBtn = page.getByRole('button', { name: /Retake quiz/i });
    await expect(retakeBtn).toBeVisible();
    await retakeBtn.click();

    await expect(page.locator('#quiz-play')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#quiz-progress')).toContainText('Question 1 of');
  });
});
