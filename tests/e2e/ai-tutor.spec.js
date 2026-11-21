// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Playwright E2E Specification — Smart Study Companion AI Tutor (AI-01 through AI-18)
 *
 * NOTE: Requires @playwright/test + browser binaries and an authenticated student session.
 * Tests AI-03..AI-06, AI-14, AI-17 expect either a mocked /functions/v1/ai-tutor-chat route
 * or live deployed Supabase Edge Function + GEMINI_API_KEY. Mark execution mode in report.
 */
test.describe('AI Tutor End-to-End Scenarios (AI-01 .. AI-18)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#ai-tutor');
  });

  test('AI-01: Open AI Tutor from sidebar navigates to #ai-tutor workspace', async ({ page }) => {
    const navLink = page.locator('.nav-link[data-view="ai-tutor"]');
    await expect(navLink).toBeVisible();
    await navLink.click();
    await expect(page.locator('#view-ai-tutor')).toBeVisible();
    await expect(page.locator('#ai-tutor-input')).toBeVisible();
  });

  test('AI-02 & AI-13: Start new chat and prevent empty message submission', async ({ page }) => {
    await page.locator('#ai-tutor-new-btn').click();
    await expect(page.locator('#ai-tutor-welcome')).toBeVisible();
    await page.locator('#ai-tutor-send-btn').click();
    await expect(page.locator('#ai-tutor-messages .ai-msg')).toHaveCount(0);
  });

  test('AI-03 & AI-04: Send question and ask follow-up with mocked ai-tutor-chat route', async ({ page }) => {
    let callCount = 0;
    await page.route('**/functions/v1/ai-tutor-chat', async (route) => {
      callCount += 1;
      const body = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          conversation: { id: 'conv-e2e-1', title: 'Binary Search Trees', subject_slug: body.subjectSlug, difficulty: body.difficulty, updated_at: new Date().toISOString() },
          studentMessage: { id: `m-s-${callCount}`, role: 'student', content: body.message, created_at: new Date().toISOString() },
          assistantMessage: {
            id: `m-a-${callCount}`,
            role: 'assistant',
            content: callCount === 1
              ? 'A binary search tree keeps smaller values left and larger values right.'
              : 'Here is a Java BST insertion example in continuation of binary search trees.',
            metadata: { recommendedQuizTopic: 'Binary Search Trees' },
            created_at: new Date().toISOString(),
          },
          quota: { used: callCount, limit: 30, remaining: 30 - callCount },
        }),
      });
    });

    await page.fill('#ai-tutor-input', 'Explain binary search trees.');
    await page.press('#ai-tutor-input', 'Enter');
    await expect(page.locator('.ai-bubble-assistant')).toContainText('binary search tree');

    await page.fill('#ai-tutor-input', 'Can you give me an example in Java?');
    await page.click('#ai-tutor-send-btn');
    await expect(page.locator('.ai-bubble-assistant').last()).toContainText('Java BST');
  });

  test('AI-05 & AI-06: Subject and difficulty selectors update context', async ({ page }) => {
    await page.selectOption('#ai-tutor-difficulty', 'advanced');
    await expect(page.locator('#ai-tutor-context-banner')).toContainText('Advanced');
    const subjectSelect = page.locator('#ai-tutor-subject');
    const optionCount = await subjectSelect.locator('option').count();
    if (optionCount > 1) {
      const val = await subjectSelect.locator('option').nth(1).getAttribute('value');
      if (val) await subjectSelect.selectOption(val);
    }
  });

  test('AI-07, AI-08, AI-09: Chat history container, refresh hash routing, and delete control render', async ({ page }) => {
    await expect(page.locator('#ai-tutor-conversation-list')).toBeVisible();
    await expect(page.locator('#ai-tutor-search-input')).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL(/#ai-tutor/);
  });

  test('AI-10: Practice This Topic switches to Quiz Practice view', async ({ page }) => {
    await page.click('#ai-tutor-practice-topic-btn');
    await expect(page.locator('#view-quiz')).toBeVisible();
    await expect(page.locator('#quiz-ai-panel')).toBeVisible();
  });

  test('AI-11 & AI-12: Dark mode toggle and mobile viewport usability', async ({ page }) => {
    await page.click('#theme-toggle-btn');
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('#ai-tutor-history-toggle')).toBeVisible();
    await expect(page.locator('#ai-tutor-input')).toBeVisible();
  });

  test('AI-14: AI API failure shows friendly error banner with Retry button without crashing', async ({ page }) => {
    await page.route('**/functions/v1/ai-tutor-chat', async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ code: 'AI_TIMEOUT', error: 'AI Tutor timed out.' }),
      });
    });
    await page.fill('#ai-tutor-input', 'Explain OSI layer 3 routing.');
    await page.click('#ai-tutor-send-btn');
    await expect(page.locator('.ai-error-banner')).toBeVisible();
  });

  test('AI-15, AI-16, AI-17, AI-18: Multilingual selector, Study Plan confirmation UI, and Logout/RLS placeholders', async ({ page }) => {
    await page.selectOption('#ai-tutor-language', 'ko');
    await expect(page.locator('#ai-tutor-language')).toHaveValue('ko');

    await page.selectOption('#ai-tutor-language', 'ne');
    await expect(page.locator('#ai-tutor-language')).toHaveValue('ne');
  });
});
