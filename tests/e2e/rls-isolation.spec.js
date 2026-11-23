// @ts-check
import { test, expect } from '@playwright/test';
import { hasStudentCredentials, loginAsStudent, navigateToView } from './helpers/auth.js';

test.describe('Two-Student Row Level Security (RLS) Isolation (E2E)', () => {
  test('E2E-RLS-01: Cross-account data isolation between Student A and Student B', async ({ browser }) => {
    test.skip(
      !hasStudentCredentials('A') || !hasStudentCredentials('B'),
      'Requires live E2E_STUDENT_A_* and E2E_STUDENT_B_* credentials for live cross-account verification',
    );

    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    await loginAsStudent(pageA, 'A');
    await navigateToView(pageA, 'tasks');

    const studentATask = `Private Task Student A ${Date.now()}`;
    await pageA.click('#add-task-btn');
    await expect(pageA.locator('#task-modal')).toBeVisible();
    await pageA.fill('#task-name', studentATask);
    await pageA.fill('#task-deadline', '2026-12-31T23:59');
    await pageA.click('#task-form button[type="submit"]');

    const taskCardA = pageA.locator('#task-container .task-card', { hasText: studentATask }).first();
    await expect(taskCardA).toBeVisible({ timeout: 8000 });

    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    await loginAsStudent(pageB, 'B');
    await navigateToView(pageB, 'tasks');
    await expect(pageB.locator('#task-container .task-card', { hasText: studentATask })).toHaveCount(0);

    // Clean up Student A's test task
    await taskCardA.locator('.delete-btn').click();
    await expect(pageA.locator('#confirm-modal')).toBeVisible();
    await pageA.click('#confirm-delete');
    await expect(taskCardA).toHaveCount(0, { timeout: 8000 });

    await contextA.close();
    await contextB.close();
  });

  test('E2E-RLS-02: Anonymous direct REST calls to private tables return zero rows', async ({ request }) => {
    const supabaseUrl = 'https://bcwwnjtmrcxggbaallon.supabase.co';
    const anonKey = 'sb_publishable_w2FL6KB5yEyy_iatIN993Q_ifuBdl7i';

    const privateTables = [
      'tasks',
      'profiles',
      'student_subjects',
      'quiz_attempts',
      'quiz_responses',
      'study_preferences',
      'study_activity_events',
      'student_achievements',
    ];

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
      expect(data.length).toBe(0);
    }
  });
});
