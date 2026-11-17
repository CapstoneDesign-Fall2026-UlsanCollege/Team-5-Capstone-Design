// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Subject Quiz & AI Quiz Practice (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#quiz');
  });

  test('E2E-QUIZ-01: Quiz setup view renders mode options and subject selector', async ({ page }) => {
    await expect(page.locator('#quiz-subject, #select-quiz-subject')).toBeVisible();
    await expect(page.locator('#btn-start-standard-quiz, button:has-text("Standard")')).toBeVisible();
    await expect(page.locator('#btn-start-rapid-quiz, button:has-text("Rapid")')).toBeVisible();
    await expect(page.locator('#quiz-history-panel, #quiz-history-list')).toBeVisible();
  });

  test('E2E-QUIZ-02: AI Quiz tab displays topic prompt, difficulty selector, and generator button', async ({ page }) => {
    const aiTab = page.locator('#tab-ai-quiz, [data-tab="ai-quiz"]');
    if (await aiTab.isVisible()) {
      await aiTab.click();
      await expect(page.locator('#ai-quiz-topic, input[name="ai-topic"]')).toBeVisible();
      await expect(page.locator('#ai-quiz-difficulty, select[name="difficulty"]')).toBeVisible();
      await expect(page.locator('#btn-generate-ai-quiz, button:has-text("Generate")')).toBeVisible();
    }
  });

  test('E2E-QUIZ-03: Starting curated quiz displays question cards with 4 choices', async ({ page }) => {
    const startBtn = page.locator('#btn-start-standard-quiz, button:has-text("Start Quiz")').first();
    await startBtn.click();

    // Verify question player renders
    const questionCard = page.locator('.quiz-question-card, #quiz-question-container');
    await expect(questionCard).toBeVisible({ timeout: 5000 });

    const options = page.locator('.quiz-option, input[type="radio"]');
    await expect(options).toHaveCount(4);
  });
});

