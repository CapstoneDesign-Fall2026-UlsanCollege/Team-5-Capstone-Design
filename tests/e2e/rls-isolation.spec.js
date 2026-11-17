// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Two-Student Row Level Security (RLS) Isolation (E2E)', () => {
  test('E2E-RLS-01: Cross-account data isolation between Student A and Student B', async ({ browser }) => {
    // Context 1: Student A
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    await pageA.goto('/#tasks');

    const studentATask = `Private Task Student A ${Date.now()}`;
    const addBtnA = pageA.locator('#btn-add-task');
    await expect(addBtnA).toBeVisible({ timeout: 5000 });
    await addBtnA.click();
    await pageA.fill('#task-title', studentATask);
    await pageA.fill('#task-deadline', '2026-12-31T23:59');
    await pageA.click('#btn-save-task');
    await expect(pageA.locator(`text=${studentATask}`)).toBeVisible({ timeout: 5000 });

    // Context 2: Student B (completely isolated browser session)
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    await pageB.goto('/#tasks');

    // Student B MUST NOT see Student A's private task
    await expect(pageB.locator(`text=${studentATask}`)).not.toBeVisible({ timeout: 3000 });

    // Close both contexts
    await contextA.close();
    await contextB.close();
  });

  test('E2E-RLS-02: Anonymous direct REST calls to private tables return zero rows', async ({ request }) => {
    const supabaseUrl = 'https://bcwwnjtmrcxggbaallon.supabase.co';
    const anonKey = 'sb_publishable_w2FL6KB5yEyy_iatIN993Q_ifuBdl7i';

    const privateTables = ['tasks', 'profiles', 'student_subjects', 'quiz_attempts', 'quiz_responses'];

    for (const table of privateTables) {
      const response = await request.get(`${supabaseUrl}/rest/v1/${table}?select=*`, {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();
      // Anonymous request must return empty array due to RLS
      expect(data.length).toBe(0);
    }
  });
});

