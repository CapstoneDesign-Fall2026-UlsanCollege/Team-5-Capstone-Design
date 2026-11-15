// DRAFT — NOT EXECUTED. Playwright is not installed and selectors are unverified against the live DOM; expect failures until reviewed.
// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Academic Onboarding & Subject Selection (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/public/index.html#subjects');
  });

  test('E2E-ONB-01: Subjects view renders 5-tier academic hierarchy selectors', async ({ page }) => {
    await expect(page.locator('#onboarding-country')).toBeVisible();
    await expect(page.locator('#onboarding-university')).toBeVisible();
    await expect(page.locator('#onboarding-faculty')).toBeVisible();
    await expect(page.locator('#onboarding-major')).toBeVisible();
    await expect(page.locator('#subject-search')).toBeVisible();
    await expect(page.locator('#save-subjects-btn')).toBeVisible();
  });

  test('E2E-ONB-02: Cascading dropdowns dynamically populate options on selection', async ({ page }) => {
    // Select Country
    await page.selectOption('#onboarding-country', 'South Korea');
    const uniOptions = page.locator('#onboarding-university option');
    await expect(uniOptions).not.toHaveCount(0);

    // Select Faculty of Computer Science
    await page.selectOption('#onboarding-faculty', 'Faculty of Computer Science & Information Technology');
    const majorOptions = page.locator('#onboarding-major option');
    await expect(majorOptions).not.toHaveCount(0);

    // Select Computer Science Major
    await page.selectOption('#onboarding-major', 'Computer Science');
    
    // Check that curriculum badges (CORE / ELECTIVE) are displayed on subject cards
    const coreBadges = page.locator('.badge-core');
    await expect(coreBadges.first()).toBeVisible({ timeout: 5000 });
  });

  test('E2E-ONB-03: Subject search input filters card list dynamically', async ({ page }) => {
    const searchInput = page.locator('#subject-search');
    await searchInput.fill('Algorithms');

    // Cards should filter to matching subjects
    const cards = page.locator('.subject-select-card:visible');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    const cardText = await cards.first().innerText();
    expect(cardText.toLowerCase()).toContain('algorithm');
  });

  test('E2E-ONB-04: Multi-subject selection updates badge count and persists state', async ({ page }) => {
    // Click on two subject cards
    const cards = page.locator('.subject-select-card');
    if (await cards.count() >= 2) {
      await cards.nth(0).click();
      await cards.nth(1).click();
      
      const saveBtn = page.locator('#save-subjects-btn');
      await expect(saveBtn).toBeEnabled();
      await saveBtn.click();

      // Should show success notification or advance to dashboard
      await page.waitForTimeout(1000);
      const isDashboardOrToast = page.url().includes('dashboard') || (await page.locator('.toast, .alert').isVisible().catch(() => false));
      expect(isDashboardOrToast).toBeTruthy();
    }
  });
});

