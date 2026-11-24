// @ts-check
import { test, expect } from '@playwright/test';
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  hasStudentCredentials,
  loginAsStudent,
  navigateToView,
  getSessionFromBrowser,
} from './helpers/auth.js';

test.describe('Two-Student Row Level Security (RLS) Isolation (E2E)', () => {
  test('E2E-RLS-01: Cross-account UI and API isolation between Student A and Student B (DATA-01)', async ({ browser, request }) => {
    test.skip(
      !hasStudentCredentials('A') || !hasStudentCredentials('B'),
      'Requires live E2E_STUDENT_A_* and E2E_STUDENT_B_* credentials for live DATA-01 verification',
    );

    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    await loginAsStudent(pageA, 'A');
    const sessionA = await getSessionFromBrowser(pageA);
    expect(sessionA?.accessToken).toBeTruthy();
    expect(sessionA?.userId).toBeTruthy();

    await navigateToView(pageA, 'tasks');
    const studentATaskTitle = `Private Task Student A ${Date.now()}`;
    await pageA.getByRole('button', { name: /New task/i }).click();
    const dialogA = pageA.getByRole('dialog');
    await expect(dialogA).toBeVisible();
    await dialogA.getByLabel(/Task name/i).fill(studentATaskTitle);
    await dialogA.getByLabel(/Deadline/i).fill('2026-12-31T23:59');
    await dialogA.getByRole('button', { name: /Save task/i }).click();

    const taskCardA = pageA.locator('#task-container .task-card', { hasText: studentATaskTitle }).first();
    await expect(taskCardA).toBeVisible({ timeout: 8000 });

    const createdTaskId = await taskCardA.locator('.delete-btn').getAttribute('data-id');
    expect(createdTaskId).toBeTruthy();

    // Student B logs in separately using an ordinary authenticated student session (no service_role)
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    await loginAsStudent(pageB, 'B');
    const sessionB = await getSessionFromBrowser(pageB);
    expect(sessionB?.accessToken).toBeTruthy();
    expect(sessionB?.userId).toBeTruthy();
    expect(sessionB.userId).not.toBe(sessionA.userId);

    // 1) UI isolation: Student B cannot see Student A's task
    await navigateToView(pageB, 'tasks');
    await expect(pageB.locator('#task-container .task-card', { hasText: studentATaskTitle })).toHaveCount(0);

    // 2) Direct PostgREST API checks as Student B using ordinary student JWT
    const headersB = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${sessionB.accessToken}`,
      Prefer: 'return=representation',
    };

    const readTaskB = await request.get(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${createdTaskId}&select=*`, { headers: headersB });
    expect(readTaskB.status()).toBe(200);
    expect(await readTaskB.json()).toEqual([]);

    const updateTaskB = await request.patch(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${createdTaskId}`, {
      headers: { ...headersB, 'Content-Type': 'application/json' },
      data: { title: 'Tampered By Student B' },
    });
    expect([200, 204, 403, 404]).toContain(updateTaskB.status());
    const updatedRows = await updateTaskB.json().catch(() => []);
    expect(Array.isArray(updatedRows) ? updatedRows.length : 0).toBe(0);

    const deleteTaskB = await request.delete(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${createdTaskId}`, { headers: headersB });
    expect([200, 204, 403, 404]).toContain(deleteTaskB.status());
    const deletedRows = await deleteTaskB.json().catch(() => []);
    expect(Array.isArray(deletedRows) ? deletedRows.length : 0).toBe(0);

    // Cross-account isolation on private quiz attempts, streak events, and profile
    for (const [table, col] of [
      ['quiz_attempts', 'student_id'],
      ['study_activity_events', 'student_id'],
      ['profiles', 'id'],
    ]) {
      const crossRes = await request.get(`${SUPABASE_URL}/rest/v1/${table}?${col}=eq.${sessionA.userId}&select=*`, { headers: headersB });
      expect(crossRes.status()).toBe(200);
      expect(await crossRes.json()).toEqual([]);
    }

    // 3) Student A retains read access and cleans up their own disposable task
    const readTaskA = await request.get(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${createdTaskId}&select=id,title`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${sessionA.accessToken}` },
    });
    expect(readTaskA.status()).toBe(200);
    const taskARows = await readTaskA.json();
    expect(taskARows).toHaveLength(1);
    expect(taskARows[0].title).toBe(studentATaskTitle);

    await taskCardA.getByRole('button', { name: /Delete task/i }).click();
    await expect(pageA.locator('#confirm-modal')).toBeVisible();
    await pageA.locator('#confirm-modal').getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(taskCardA).toHaveCount(0, { timeout: 8000 });

    await contextA.close();
    await contextB.close();
  });

  test('E2E-RLS-02: Anonymous direct REST calls to private tables return zero rows', async ({ request }) => {
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
      const response = await request.get(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();
      expect(data.length).toBe(0);
    }
  });
});
