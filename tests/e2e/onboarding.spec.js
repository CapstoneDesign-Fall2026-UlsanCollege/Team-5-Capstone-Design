// @ts-check
import { test, expect } from '@playwright/test';
import { loginAsStudent, navigateToView } from './helpers/auth.js';

test.describe('Academic Onboarding & Subject Selection (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page, 'A');
    await navigateToView(page, 'subjects');
  });

  test('E2E-ONB-01: Subjects view renders 5-tier academic hierarchy selectors', async ({ page }) => {
    await expect(page.locator('#academic-country')).toBeVisible();
    await expect(page.locator('#academic-university')).toBeVisible();
    await expect(page.locator('#academic-faculty')).toBeVisible();
    await expect(page.locator('#academic-major')).toBeVisible();
    await expect(page.locator('#subject-search-input')).toBeVisible();
    await expect(page.locator('#save-subjects-btn')).toBeVisible();
  });

  test('E2E-ONB-02: Cascading dropdowns dynamically populate options on selection', async ({ page }) => {
    await page.selectOption('#academic-country', 'South Korea');
    await expect(page.locator('#academic-university option')).not.toHaveCount(0);

    await page.selectOption('#academic-faculty', 'Faculty of Computer Science & Information Technology');
    await expect(page.locator('#academic-major option')).not.toHaveCount(0);

    await page.selectOption('#academic-major', 'Computer Science & Engineering (CSE)');
    await expect(page.locator('.core-badge').first()).toBeVisible({ timeout: 5000 });
  });

  test('E2E-ONB-03: Subject search input filters card list dynamically', async ({ page }) => {
    const searchInput = page.locator('#subject-search-input');
    await searchInput.fill('Algorithms');

    const cards = page.locator('#subject-scroll-container .scrollable-subject-card:visible');
    await expect(cards.first()).toBeVisible({ timeout: 5000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    const cardText = await cards.first().innerText();
    expect(cardText.toLowerCase()).toContain('algorithm');
  });

  test('E2E-ONB-04: Multi-subject selection updates badge count and persists state', async ({ page }) => {
    const cards = page.locator('#subject-scroll-container .scrollable-subject-card');
    await expect(cards.first()).toBeVisible({ timeout: 5000 });

    const beforeCount = Number(await page.locator('#selected-subjects-count').innerText());
    await cards.nth(0).click();
    const afterClickCount = Number(await page.locator('#selected-subjects-count').innerText());
    expect(afterClickCount).not.toBe(beforeCount);

    // Ensure at least one subject stays selected before saving
    if (afterClickCount === 0) {
      await cards.nth(0).click();
    }

    const saveBtn = page.locator('#save-subjects-btn');
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();

    await expect(page.locator('.toast').first()).toBeVisible({ timeout: 8000 });
  });
});
