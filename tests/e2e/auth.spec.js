// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Authentication & Session Flow (E2E)', () => {
  test('E2E-AUTH-01: Login page renders with required elements', async ({ page }) => {
    await page.goto('/auth/login.html');
    await expect(page).toHaveTitle(/Sign In|Smart Study Companion/i);
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#login-btn')).toBeVisible();
    await expect(page.locator('a[href*="forgot-password"]')).toBeVisible();
    await expect(page.locator('a[href*="signup"]')).toBeVisible();
  });

  test('E2E-AUTH-02: Signup page renders academic selector and validation requirements', async ({ page }) => {
    await page.goto('/auth/signup.html');
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
    await page.goto('/auth/login.html');
    await page.fill('#email', 'invalid.student@example.com');
    await page.fill('#password', 'WrongPassword123!');
    await page.click('#login-btn');

    const alertBox = page.locator('#form-alert');
    await expect(alertBox).toBeVisible({ timeout: 10000 });
    await expect(alertBox).toHaveClass(/is-visible/);
    await expect(alertBox).not.toHaveText('');
  });

  test('E2E-AUTH-04: Password recovery page supports 6-digit OTP entry and link dispatch', async ({ page }) => {
    await page.goto('/auth/forgot-password.html');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#forgot-btn')).toBeVisible();

    // Verify visible link to reset password page and check 6-digit OTP & password controls
    await expect(page.locator('a.auth-link[href*="reset-password"]')).toBeVisible();
    await page.goto('/auth/reset-password.html');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#otp-code')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirm-password')).toBeVisible();
    await expect(page.locator('#reset-btn')).toBeVisible();
  });

  test('E2E-AUTH-05: Protected dashboard routes redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/auth\/login\.html/, { timeout: 10000 });
    await expect(page.locator('#login-btn')).toBeVisible();
  });
});
