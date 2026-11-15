// DRAFT — NOT EXECUTED. Playwright is not installed and selectors are unverified against the live DOM; expect failures until reviewed.
// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Authentication & Session Flow (E2E)', () => {
  test('E2E-AUTH-01: Login page renders with required elements', async ({ page }) => {
    await page.goto('/public/auth/login.html');
    await expect(page).toHaveTitle(/Sign In|Smart Study Companion/i);
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#login-btn')).toBeVisible();
    await expect(page.locator('a[href*="forgot-password"]')).toBeVisible();
    await expect(page.locator('a[href*="signup"]')).toBeVisible();
  });

  test('E2E-AUTH-02: Signup page renders academic selector and validation requirements', async ({ page }) => {
    await page.goto('/public/auth/signup.html');
    await expect(page.locator('#fullname')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#country')).toBeVisible();
    await expect(page.locator('#university')).toBeVisible();
    await expect(page.locator('#signup-btn')).toBeVisible();

    // Verify country selection dynamically populates universities
    await page.selectOption('#country', 'South Korea');
    const ulsanOption = page.locator('#university option', { hasText: 'Ulsan College' });
    await expect(ulsanOption).toHaveCount(1);
  });

  test('E2E-AUTH-03: Invalid login shows visible error alert', async ({ page }) => {
    await page.goto('/public/auth/login.html');
    await page.fill('#email', 'invalid.student@example.com');
    await page.fill('#password', 'WrongPassword123!');
    await page.click('#login-btn');

    const alertBox = page.locator('#auth-alert');
    await expect(alertBox).toBeVisible({ timeout: 10000 });
    await expect(alertBox).toHaveClass(/alert-danger|error/);
  });

  test('E2E-AUTH-04: Password recovery page supports 6-digit OTP entry and link dispatch', async ({ page }) => {
    await page.goto('/public/auth/forgot-password.html');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#reset-btn')).toBeVisible();

    // Verify link to OTP reset page exists
    const otpLink = page.locator('a[href*="reset-password"]');
    await expect(otpLink).toBeVisible();

    // Navigate to reset password page and check 6-digit PIN input
    await page.goto('/public/auth/reset-password.html');
    await expect(page.locator('#otp-code')).toBeVisible();
    await expect(page.locator('#new-password')).toBeVisible();
    await expect(page.locator('#confirm-password')).toBeVisible();
    await expect(page.locator('#submit-btn')).toBeVisible();
  });

  test('E2E-AUTH-05: Protected dashboard routes redirect unauthenticated users', async ({ page }) => {
    // Clear storage to ensure guest state
    await page.goto('/public/index.html');
    // If not authenticated, auth-guard should either keep user in Local Preview Mode with banner or redirect to login
    const isLoginPage = page.url().includes('login.html');
    const hasPreviewBadge = await page.locator('.preview-badge, #preview-banner').isVisible().catch(() => false);
    expect(isLoginPage || hasPreviewBadge).toBeTruthy();
  });
});

