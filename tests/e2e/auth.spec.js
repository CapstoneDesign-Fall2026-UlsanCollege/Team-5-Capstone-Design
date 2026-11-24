// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Authentication & Session Flow (E2E)', () => {
  test('E2E-AUTH-01: Login page renders with required elements', async ({ page }) => {
    await page.goto('/auth/login.html');
    await expect(page).toHaveTitle(/Sign In|Smart Study Companion/i);
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Forgot password/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Create account/i })).toBeVisible();
  });

  test('E2E-AUTH-02: Signup page renders academic selector and validation requirements', async ({ page }) => {
    await page.goto('/auth/signup.html');
    await expect(page.getByLabel(/Full name/i)).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    const countrySelect = page.getByLabel(/Region or country/i);
    const universitySelect = page.getByLabel(/University or college/i);
    await expect(countrySelect).toBeVisible();
    await expect(universitySelect).toBeVisible();
    await expect(page.getByRole('button', { name: /Create Account/i })).toBeVisible();

    await countrySelect.selectOption('South Korea');
    await expect(universitySelect.locator('option', { hasText: 'Ulsan College' })).toHaveCount(1);
  });

  test('E2E-AUTH-03: Invalid login shows visible error alert', async ({ page }) => {
    await page.goto('/auth/login.html');
    await page.getByLabel(/Email/i).fill('invalid.student@example.com');
    await page.getByLabel('Password', { exact: true }).fill('WrongPassword123!');
    await page.getByRole('button', { name: /Sign In/i }).click();

    const alertBox = page.locator('#form-alert');
    await expect(alertBox).toBeVisible({ timeout: 10000 });
    await expect(alertBox).toHaveClass(/is-visible/);
    await expect(alertBox).not.toHaveText('');
  });

  test('E2E-AUTH-04: Password recovery page supports 6-digit OTP entry and link dispatch', async ({ page }) => {
    await page.goto('/auth/forgot-password.html');
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Send recovery instructions/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Enter code/i })).toBeVisible();

    await page.goto('/auth/reset-password.html');
    await expect(page.getByLabel(/Student Email/i)).toBeVisible();
    await expect(page.locator('#otp-code')).toBeVisible();
    await expect(page.getByLabel('New password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm password', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /Update password/i })).toBeVisible();
  });

  test('E2E-AUTH-05: Protected dashboard routes redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/auth\/login\.html/, { timeout: 10000 });
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });
});
