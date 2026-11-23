import fs from 'node:fs';
import { chromium, defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Configuration — Smart Study Companion (Team 5)
 * Configured for local Vite preview/dev server and live deployment verification.
 * Uses Playwright-managed Chromium when installed, falling back to local Chrome
 * (or PW_CHROMIUM_EXECUTABLE_PATH) when running on developer workstations without
 * downloading a separate Playwright browser binary.
 */
function resolveLocalChromeExecutable() {
  if (process.env.PW_CHROMIUM_EXECUTABLE_PATH) {
    return process.env.PW_CHROMIUM_EXECUTABLE_PATH;
  }
  try {
    const managedPath = chromium.executablePath();
    if (managedPath && fs.existsSync(managedPath)) {
      return undefined;
    }
  } catch (_) {
    // Fall through to system Chrome candidates
  }
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

const chromeExecutable = resolveLocalChromeExecutable();
const chromiumLaunchOptions = chromeExecutable ? { executablePath: chromeExecutable } : undefined;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'tests/e2e/playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: chromeExecutable ? 'off' : 'retain-on-failure',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: chromiumLaunchOptions,
      },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome (Pixel 5)',
      use: {
        ...devices['Pixel 5'],
        launchOptions: chromiumLaunchOptions,
      },
    },
    {
      name: 'Mobile Safari (iPhone 12)',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
