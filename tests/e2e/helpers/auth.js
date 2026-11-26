// @ts-check
import { test, expect } from '@playwright/test';

export const SUPABASE_URL = 'https://bcwwnjtmrcxggbaallon.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_w2FL6KB5yEyy_iatIN993Q_ifuBdl7i';
export const AUTH_STORAGE_KEY = 'sb-bcwwnjtmrcxggbaallon-auth-token';

/**
 * Returns { email, password } for Student A or Student B from environment variables.
 * Never hardcodes live credentials in repository source.
 * @param {'A'|'B'} [role]
 */
export function getStudentCredentials(role = 'A') {
  if (role === 'B') {
    return {
      email: process.env.E2E_STUDENT_B_EMAIL || '',
      password: process.env.E2E_STUDENT_B_PASSWORD || '',
    };
  }
  return {
    email: process.env.E2E_STUDENT_A_EMAIL || '',
    password: process.env.E2E_STUDENT_A_PASSWORD || '',
  };
}

/**
 * Returns true if environment credentials exist for the requested student role.
 * @param {'A'|'B'} [role]
 */
export function hasStudentCredentials(role = 'A') {
  const creds = getStudentCredentials(role);
  return Boolean(creds.email && creds.password);
}

/**
 * Skips the current test explicitly if live student credentials are absent,
 * otherwise signs in through the actual login page using accessible locators
 * and waits for the protected dashboard shell.
 * @param {import('@playwright/test').Page} page
 * @param {'A'|'B'} [role]
 */
export async function loginAsStudent(page, role = 'A') {
  const { email, password } = getStudentCredentials(role);
  test.skip(
    !email || !password,
    `Requires live E2E_STUDENT_${role}_EMAIL and E2E_STUDENT_${role}_PASSWORD credentials`,
  );

  await page.goto('/auth/login.html');
  await page.getByLabel(/Email/i).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: /Sign In/i }).click();
  await page.waitForURL((url) => !url.pathname.includes('/auth/login.html'), {
    timeout: 15000,
  });
  await expect(page.locator('#sidebar')).toBeAttached({ timeout: 10000 });
}

/**
 * Reads the authenticated Supabase session token from browser localStorage
 * (ordinary student JWT, never a service-role key).
 * @param {import('@playwright/test').Page} page
 */
export async function getSessionFromBrowser(page) {
  return page.evaluate((storageKey) => {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return {
        accessToken: parsed?.access_token || '',
        userId: parsed?.user?.id || '',
      };
    } catch (_) {
      return null;
    }
  }, AUTH_STORAGE_KEY);
}

/**
 * Navigates to an authenticated dashboard view via the real sidebar navigation.
 * Opens the mobile hamburger drawer first when running on a narrow viewport.
 * @param {import('@playwright/test').Page} page
 * @param {'dashboard'|'tasks'|'subjects'|'analytics'|'quiz'|'ai-tutor'} view
 */
export async function navigateToView(page, view) {
  const openMenuBtn = page.getByRole('button', { name: /Open menu/i });
  if (await openMenuBtn.isVisible()) {
    const isOpen = await page.locator('#sidebar').evaluate((el) => el.classList.contains('is-open'));
    if (!isOpen) {
      await openMenuBtn.click();
      await expect(page.locator('#sidebar')).toHaveClass(/is-open/);
    }
  }

  const navLink = page.locator(`.nav-link[data-view="${view}"]`);
  await expect(navLink).toBeVisible({ timeout: 5000 });
  await navLink.click();
  await expect(page.locator(`#view-${view}`)).toBeVisible({ timeout: 10000 });
}

/**
 * Toggles light/dark theme via #theme-toggle-btn, opening the mobile drawer
 * first when running on narrow viewports.
 * @param {import('@playwright/test').Page} page
 */
export async function toggleTheme(page) {
  const openMenuBtn = page.getByRole('button', { name: /Open menu/i });
  const openedDrawer = (await openMenuBtn.isVisible())
    && !(await page.locator('#sidebar').evaluate((el) => el.classList.contains('is-open')));
  if (openedDrawer) {
    await openMenuBtn.click();
    await expect(page.locator('#sidebar')).toHaveClass(/is-open/);
  }
  await page.locator('#theme-toggle-btn').click();
  if (openedDrawer) {
    await page.getByRole('button', { name: /Close menu/i }).click();
    await expect(page.locator('#sidebar')).not.toHaveClass(/is-open/);
  }
}

/**
 * Ensures the document is in the requested 'light' or 'dark' theme mode.
 * @param {import('@playwright/test').Page} page
 * @param {'light'|'dark'} targetTheme
 */
export async function ensureThemeMode(page, targetTheme) {
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if ((targetTheme === 'dark' && !isDark) || (targetTheme === 'light' && isDark)) {
    await toggleTheme(page);
  }
  if (targetTheme === 'dark') {
    await expect(page.locator('html')).toHaveClass(/dark/);
  } else {
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  }
}

/**
 * Sets up a stateful in-memory Supabase REST/Auth mock inside Playwright's browser
 * context for UI/responsive regression checks when live student credentials are
 * unavailable. Strictly non-cloud — does not verify live auth or Supabase RLS.
 * @param {import('@playwright/test').Page} page
 * @param {{
 *   subjects?: Array<{id:string,name:string,slug:string,description?:string,category?:string,icon?:string}>,
 *   schedules?: Array<Record<string, any>>,
 *   failStudentSubjectsSave?: boolean,
 * }} [options]
 */
export async function setupMockedDashboardSession(page, options = {}) {
  const studentId = '11111111-1111-4111-8111-111111111111';
  const mockUser = {
    id: studentId,
    aud: 'authenticated',
    role: 'authenticated',
    email: 'qa.regression.mock@example.edu',
    user_metadata: { full_name: 'QA Regression Student' },
  };

  const subjects = options.subjects || [
    {
      id: '22222222-2222-4222-8222-222222222201',
      name: 'Data Structures & Algorithms',
      slug: 'data-structures',
      description: 'Trees, graphs, sorting, and complexity analysis',
      category: 'CS Core',
      icon: 'fa-diagram-project',
    },
    {
      id: '22222222-2222-4222-8222-222222222202',
      name: 'Database Management Systems',
      slug: 'databases',
      description: 'Relational algebra, normalization, SQL, and indexing',
      category: 'CS Core',
      icon: 'fa-database',
    },
    {
      id: '22222222-2222-4222-8222-222222222203',
      name: 'Programming Fundamentals',
      slug: 'programming',
      description: 'Core programming logic, syntax, and modular design',
      category: 'CS Core',
      icon: 'fa-code',
    },
    {
      id: '22222222-2222-4222-8222-222222222204',
      name: 'Computer Networks',
      slug: 'computer-networks',
      description: 'OSI model, TCP/IP, routing, and transport protocols',
      category: 'CS Core',
      icon: 'fa-network-wired',
    },
  ];

  let profile = {
    id: studentId,
    full_name: 'QA Regression Student',
    country: 'South Korea',
    university: 'Ulsan College',
    faculty: 'Faculty of Computer Science & Information Technology',
    major: 'Computer Science & Engineering (CSE)',
    onboarding_completed: true,
    updated_at: '2026-11-23T00:00:00.000Z',
  };

  const initialEnrolled = options.subjects ? subjects : subjects.slice(0, 2);
  const enrolledRows = initialEnrolled.map((s) => ({
    id: `33333333-3333-4333-8333-${s.id.slice(-12)}`,
    student_id: studentId,
    subject_id: s.id,
    subject: s,
  }));

  const tasks = [
    {
      id: '44444444-4444-4444-8444-444444444401',
      student_id: studentId,
      subject_id: subjects[0].id,
      subject: { id: subjects[0].id, name: subjects[0].name, slug: subjects[0].slug },
      title: 'Review Binary Search Tree Traversals',
      description: 'Read balanced-tree slides and trace pre-order, in-order, and post-order walks.',
      deadline: '2026-12-20T14:59:00.000Z',
      completed: false,
      created_at: '2026-11-22T09:00:00.000Z',
    },
  ];

  const studySchedules = Array.isArray(options.schedules) ? [...options.schedules] : [];
  const scheduleExceptions = [];
  const quizAttempts = [];
  const expiresAt = Math.floor(Date.now() / 1000) + 3600;
  const sessionPayload = {
    access_token: 'mock-access-token-for-ui-regression',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: expiresAt,
    refresh_token: 'mock-refresh-token',
    user: mockUser,
  };

  await page.addInitScript(
    ({ key, payload }) => {
      window.localStorage.setItem(key, JSON.stringify(payload));
    },
    { key: AUTH_STORAGE_KEY, payload: sessionPayload },
  );

  await page.route(`${SUPABASE_URL}/**`, async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const method = req.method();
    const accept = req.headers()['accept'] || '';
    const wantsSingleObject = accept.includes('application/vnd.pgrst.object+json');

    const jsonReply = (data, status = 200) =>
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(data),
      });

    if (url.pathname.startsWith('/auth/v1/user')) {
      return jsonReply(mockUser);
    }

    if (url.pathname.startsWith('/rest/v1/profiles')) {
      if (method === 'PATCH' || method === 'POST') {
        const body = req.postDataJSON() || {};
        profile = { ...profile, ...body };
        return jsonReply(wantsSingleObject ? profile : [profile]);
      }
      return jsonReply(wantsSingleObject ? profile : [profile]);
    }

    if (url.pathname.startsWith('/rest/v1/subjects')) {
      const slugFilter = url.searchParams.get('slug');
      if (slugFilter && slugFilter.startsWith('in.(') && slugFilter.endsWith(')')) {
        const wanted = new Set(
          slugFilter
            .slice(4, -1)
            .split(',')
            .map((s) => s.replace(/^"|"$/g, '').trim()),
        );
        return jsonReply(subjects.filter((s) => wanted.has(s.slug)));
      }
      if (slugFilter && slugFilter.startsWith('eq.')) {
        const wanted = slugFilter.slice(3).trim();
        const found = subjects.filter((s) => s.slug === wanted);
        return jsonReply(wantsSingleObject ? (found[0] || null) : found);
      }
      return jsonReply(subjects);
    }

    if (url.pathname.startsWith('/rest/v1/student_subjects')) {
      if (options.failStudentSubjectsSave && (method === 'DELETE' || method === 'POST')) {
        return jsonReply({ message: 'Simulated network failure saving subjects' }, 500);
      }
      if (method === 'DELETE') {
        const inParam = url.searchParams.get('subject_id');
        if (inParam && inParam.startsWith('in.(') && inParam.endsWith(')')) {
          const toRemove = new Set(
            inParam
              .slice(4, -1)
              .split(',')
              .map((s) => s.replace(/^"|"$/g, '').trim()),
          );
          for (let i = enrolledRows.length - 1; i >= 0; i -= 1) {
            if (toRemove.has(enrolledRows[i].subject_id)) enrolledRows.splice(i, 1);
          }
        } else {
          enrolledRows.length = 0;
        }
        return jsonReply([]);
      }
      if (method === 'POST') {
        const body = req.postDataJSON();
        const incoming = Array.isArray(body) ? body : [body];
        const upserted = [];
        for (const row of incoming) {
          if (!row?.subject_id) continue;
          const existing = enrolledRows.find((r) => r.subject_id === row.subject_id);
          if (existing) {
            upserted.push(existing);
          } else {
            const subObj = subjects.find((s) => s.id === row.subject_id) || null;
            const created = {
              id: `33333333-3333-4333-8333-${String(row.subject_id).slice(-12)}`,
              student_id: studentId,
              subject_id: row.subject_id,
              subject: subObj,
            };
            enrolledRows.push(created);
            upserted.push(created);
          }
        }
        return jsonReply(upserted);
      }
      return jsonReply(enrolledRows);
    }

    if (url.pathname.startsWith('/rest/v1/tasks')) {
      if (method === 'POST') {
        const body = req.postDataJSON() || {};
        const matchedSubject = subjects.find((s) => s.id === body.subject_id) || subjects[0];
        const created = {
          id: `44444444-4444-4444-8444-${String(Date.now()).slice(-12)}`,
          student_id: studentId,
          subject_id: body.subject_id || matchedSubject.id,
          subject: { id: matchedSubject.id, name: matchedSubject.name, slug: matchedSubject.slug },
          title: body.title || 'Untitled Task',
          description: body.description ?? null,
          deadline: body.deadline || '2026-12-31T14:59:00.000Z',
          completed: Boolean(body.completed),
          created_at: new Date().toISOString(),
        };
        tasks.unshift(created);
        return jsonReply(wantsSingleObject ? created : [created], 201);
      }
      if (method === 'PATCH') {
        const body = req.postDataJSON() || {};
        const idFilter = url.searchParams.get('id')?.replace('eq.', '');
        const idx = tasks.findIndex((t) => t.id === idFilter);
        if (idx >= 0) {
          tasks[idx] = { ...tasks[idx], ...body };
          return jsonReply(wantsSingleObject ? tasks[idx] : [tasks[idx]]);
        }
        return jsonReply([]);
      }
      if (method === 'DELETE') {
        const idFilter = url.searchParams.get('id')?.replace('eq.', '');
        const idx = tasks.findIndex((t) => t.id === idFilter);
        if (idx >= 0) tasks.splice(idx, 1);
        return jsonReply([]);
      }
      return jsonReply(tasks);
    }

    if (url.pathname.startsWith('/rest/v1/study_schedules')) {
      const joinSubject = (row) => {
        const sub = row.subject_id ? subjects.find((s) => s.id === row.subject_id) : null;
        return { ...row, subject: sub ? { id: sub.id, name: sub.name, slug: sub.slug } : null };
      };
      if (method === 'POST') {
        const body = req.postDataJSON() || {};
        const created = joinSubject({
          id: `66666666-6666-4666-8666-${String(Date.now()).slice(-12)}`,
          student_id: studentId,
          completed: false,
          completed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...body,
        });
        studySchedules.push(created);
        return jsonReply(wantsSingleObject ? created : [created], 201);
      }
      if (method === 'PATCH') {
        const body = req.postDataJSON() || {};
        const idFilter = url.searchParams.get('id')?.replace('eq.', '');
        const idx = studySchedules.findIndex((s) => s.id === idFilter);
        if (idx >= 0) {
          studySchedules[idx] = joinSubject({ ...studySchedules[idx], ...body, updated_at: new Date().toISOString() });
          return jsonReply(wantsSingleObject ? studySchedules[idx] : [studySchedules[idx]]);
        }
        return jsonReply([]);
      }
      if (method === 'DELETE') {
        const idFilter = url.searchParams.get('id')?.replace('eq.', '');
        for (let i = studySchedules.length - 1; i >= 0; i -= 1) {
          if (studySchedules[i].id === idFilter) studySchedules.splice(i, 1);
        }
        for (let i = scheduleExceptions.length - 1; i >= 0; i -= 1) {
          if (scheduleExceptions[i].schedule_id === idFilter) scheduleExceptions.splice(i, 1);
        }
        return jsonReply([]);
      }
      return jsonReply(studySchedules.map(joinSubject));
    }

    if (url.pathname.startsWith('/rest/v1/study_schedule_exceptions')) {
      if (method === 'POST') {
        const body = req.postDataJSON() || {};
        const idx = scheduleExceptions.findIndex(
          (e) => e.schedule_id === body.schedule_id && e.occurrence_date === body.occurrence_date,
        );
        const record = {
          id: idx >= 0 ? scheduleExceptions[idx].id : `77777777-7777-4777-8777-${String(Date.now()).slice(-12)}`,
          student_id: studentId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...body,
        };
        if (idx >= 0) {
          scheduleExceptions[idx] = { ...scheduleExceptions[idx], ...record };
        } else {
          scheduleExceptions.push(record);
        }
        return jsonReply(wantsSingleObject ? record : [record], 201);
      }
      if (method === 'DELETE') {
        const idFilter = url.searchParams.get('id')?.replace('eq.', '');
        for (let i = scheduleExceptions.length - 1; i >= 0; i -= 1) {
          if (!idFilter || scheduleExceptions[i].id === idFilter) scheduleExceptions.splice(i, 1);
        }
        return jsonReply([]);
      }
      return jsonReply(scheduleExceptions);
    }

    if (url.pathname.startsWith('/rest/v1/quiz_attempts')) {
      if (method === 'POST') {
        const body = req.postDataJSON() || {};
        const created = {
          id: `55555555-5555-4555-8555-${String(Date.now()).slice(-12)}`,
          ...body,
          completed_at: body.completed_at || new Date().toISOString(),
        };
        quizAttempts.unshift(created);
        return jsonReply(wantsSingleObject ? created : [created], 201);
      }
      return jsonReply(quizAttempts);
    }

    if (url.pathname.startsWith('/rest/v1/rpc/get_study_summary')) {
      return jsonReply({
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null,
        daily_goal_minutes: 30,
        today_minutes: 0,
        streak_freezes: 0,
        achievements: [],
      });
    }

    if (url.pathname.startsWith('/rest/v1/rpc/')) {
      return jsonReply({});
    }

    return jsonReply(wantsSingleObject ? {} : []);
  });
}
