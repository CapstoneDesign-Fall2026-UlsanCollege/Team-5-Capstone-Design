/**
 * Automated Unit & Service Contract Tests — AI Tutor
 *
 * Scope labels:
 *   - Pure logic & Edge Function helpers (`ai-tutor-logic.js`, `tutor-core.ts`): Real execution
 *   - Service integration tests (`ai-tutor.js`): Mocked Supabase client (no live network)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  MAX_TUTOR_MESSAGE_CHARS,
  TUTOR_DIFFICULTIES,
  TUTOR_LANGUAGES,
  TUTOR_QUICK_ACTIONS,
  TUTOR_TEACHING_MODES,
  buildStudyPlanTaskPayloads,
  computeTutorLearningSummary,
  conversationHasDifferentSubjectMessages,
  extractTopicFromConversation,
  filterConversationsByQuery,
  mapTutorDifficultyToQuizDifficulty,
  normalizeTutorError,
  renderSafeTutorMarkdown,
  validateTutorMessageInput,
} from '../../src/lib/ai-tutor-logic.js';
import {
  buildCorsHeaders,
  buildTrustedSystemPrompt,
  getDifficultyInstruction,
  getLanguageInstruction,
  getTeachingModeInstruction,
  isOriginPermitted,
  parseAndValidateModelResponse,
  validateTutorRequest,
} from '../../supabase/functions/ai-tutor-chat/tutor-core.ts';

// ---- Mocked Supabase client for service contract verification ----
let mockSession = { access_token: 'mock-jwt-token', user: { id: '11111111-1111-4111-8111-111111111111' } };
let invokeImpl = vi.fn(async () => ({ data: null, error: { message: 'Not configured' } }));
const dbCalls = [];
let tableHandler = () => ({ data: [], error: null });

function mockBuilder(table) {
  const op = { table, action: 'select', payload: null, filters: [], limitVal: null, singleMode: null };
  const b = {
    select(cols) {
      if (op.action === 'select') op.cols = cols;
      return b;
    },
    insert(payload) {
      op.action = 'insert';
      op.payload = payload;
      return b;
    },
    update(payload) {
      op.action = 'update';
      op.payload = payload;
      return b;
    },
    delete() {
      op.action = 'delete';
      return b;
    },
    eq(k, v) {
      op.filters.push(['eq', k, v]);
      return b;
    },
    ilike(k, v) {
      op.filters.push(['ilike', k, v]);
      return b;
    },
    order() {
      return b;
    },
    limit(n) {
      op.limitVal = n;
      return b;
    },
    single() {
      op.singleMode = 'single';
      return b;
    },
    maybeSingle() {
      op.singleMode = 'maybeSingle';
      return b;
    },
    then(resolve, reject) {
      dbCalls.push({ ...op });
      return Promise.resolve(tableHandler(op)).then(resolve, reject);
    },
  };
  return b;
}

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    auth: {
      getSession: vi.fn(async () => ({ data: { session: mockSession } })),
    },
    functions: {
      invoke: (...args) => invokeImpl(...args),
    },
    from: (table) => mockBuilder(table),
  },
}));

const {
  createTutorConversation,
  deleteTutorConversation,
  getTutorMessages,
  getTutorQuotaStatus,
  listTutorConversations,
  renameTutorConversation,
  sendTutorMessage,
} = await import('../../src/services/ai-tutor.js');

const STUDENT_ID = '11111111-1111-4111-8111-111111111111';
const CONV_ID = '22222222-2222-4222-8222-222222222222';
const SUBJ_ID = '33333333-3333-4333-8333-333333333333';

describe('AI Tutor Pure Logic & Safe Rendering', () => {
  it('validates empty and overly long student prompts cleanly', () => {
    expect(validateTutorMessageInput('')).toMatchObject({ ok: false, code: 'EMPTY_MESSAGE' });
    expect(validateTutorMessageInput('   \n\t  ')).toMatchObject({ ok: false, code: 'EMPTY_MESSAGE' });
    const tooLong = 'a'.repeat(MAX_TUTOR_MESSAGE_CHARS + 1);
    expect(validateTutorMessageInput(tooLong)).toMatchObject({ ok: false, code: 'MESSAGE_TOO_LONG' });
    expect(validateTutorMessageInput('  Explain binary trees  ')).toMatchObject({
      ok: true,
      text: 'Explain binary trees',
    });
  });

  it('provides distinct guidance for Beginner, Intermediate, and Advanced difficulty levels', () => {
    expect(TUTOR_DIFFICULTIES.map((d) => d.id)).toEqual(['beginner', 'intermediate', 'advanced']);
    const beg = getDifficultyInstruction('beginner');
    const mid = getDifficultyInstruction('intermediate');
    const adv = getDifficultyInstruction('advanced');
    expect(beg).not.toEqual(mid);
    expect(mid).not.toEqual(adv);
    expect(adv.toLowerCase()).toContain('complexity');
    expect(beg.toLowerCase()).toContain('plain language');
  });

  it('supports all 7 required teaching modes and 4+ prioritized languages', () => {
    expect(TUTOR_TEACHING_MODES).toHaveLength(7);
    expect(TUTOR_QUICK_ACTIONS).toHaveLength(7);
    const modeTexts = TUTOR_TEACHING_MODES.map((m) => getTeachingModeInstruction(m.id));
    expect(new Set(modeTexts).size).toBe(7);

    expect(TUTOR_LANGUAGES.map((l) => l.id)).toEqual(['auto', 'en', 'ko', 'ne', 'hi']);
    expect(getLanguageInstruction('ko')).toContain('Korean');
    expect(getLanguageInstruction('ne')).toContain('Nepali');
    expect(getLanguageInstruction('ko')).toContain('Never translate programming');
  });

  it('safely renders Markdown & code blocks while neutralizing XSS / script payloads', () => {
    const unsafe = [
      '## Trees <script>alert("xss")</script>',
      '<img src=x onerror="alert(1)">',
      '- Node **value** and `left` child',
      '```java',
      'if (root < 0) return "<evil>";',
      '```',
    ].join('\n');

    const html = renderSafeTutorMarkdown(unsafe);
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img ');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
    expect(html).toContain('class="ai-code-block"');
    expect(html).toContain('&lt;evil&gt;');
  });

  it('filters conversations by title/subject and detects mid-conversation subject shifts', () => {
    const convs = [
      { id: '1', title: 'Binary Search Trees', subject_slug: 'data-structures' },
      { id: '2', title: 'SQL Normalization 3NF', subject_slug: 'databases' },
    ];
    expect(filterConversationsByQuery(convs, 'sql')).toHaveLength(1);
    expect(filterConversationsByQuery(convs, 'data-structures')).toHaveLength(1);
    expect(
      conversationHasDifferentSubjectMessages(
        [{ role: 'student', metadata: { subjectSlug: 'databases' } }],
        'operating-systems'
      )
    ).toBe(true);
    expect(
      conversationHasDifferentSubjectMessages(
        [{ role: 'student', metadata: { subjectSlug: 'databases' } }],
        'databases'
      )
    ).toBe(false);
  });

  it('integrates Quiz topic extraction and difficulty mapping consistently', () => {
    expect(mapTutorDifficultyToQuizDifficulty('beginner')).toBe('easy');
    expect(mapTutorDifficultyToQuizDifficulty('intermediate')).toBe('medium');
    expect(mapTutorDifficultyToQuizDifficulty('advanced')).toBe('hard');

    const topic = extractTopicFromConversation(
      [
        { role: 'student', content: 'What is BCNF normalization?' },
        { role: 'assistant', content: 'BCNF...', metadata: { recommendedQuizTopic: 'BCNF Normalization' } },
      ],
      'Databases'
    );
    expect(topic).toBe('BCNF Normalization');
  });

  it('builds study plan tasks only for confirmed selections and prevents duplicate tasks', () => {
    const existingTasks = [{ subject: 'Databases', name: 'Practice 3NF exercises' }];
    const result = buildStudyPlanTaskPayloads({
      items: [
        { title: 'Practice 3NF exercises', daysFromNow: 1, estimatedMinutes: 45 },
        { title: 'Solve SQL join lab sheet', daysFromNow: 2, estimatedMinutes: 60 },
        { title: 'Solve SQL join lab sheet', daysFromNow: 3, estimatedMinutes: 30 },
      ],
      subjectId: SUBJ_ID,
      subjectName: 'Databases',
      studentId: STUDENT_ID,
      existingTasks,
      baseDate: new Date('2026-11-22T00:00:00.000Z'),
    });

    expect(result.skippedDuplicates).toEqual(['Practice 3NF exercises', 'Solve SQL join lab sheet']);
    expect(result.toCreate).toHaveLength(1);
    expect(result.toCreate[0].title).toBe('Solve SQL join lab sheet');
  });

  it('computes AI Tutor learning summary metrics without inflating streak counts', () => {
    const summary = computeTutorLearningSummary(
      [
        { activity_type: 'tutor_session', subject_slug: 'databases', topic: 'Normalization' },
        { activity_type: 'practice_quiz', subject_slug: 'databases', topic: 'SQL Joins' },
        { activity_type: 'tutor_session', subject_slug: 'operating-systems', topic: 'Deadlocks' },
      ],
      [{ id: 'c1', subject_slug: 'databases' }]
    );
    expect(summary.completedSessions).toBe(2);
    expect(summary.subjectsPracticed).toBe(2);
    expect(summary.quizzesAttempted).toBe(1);
    expect(summary.topicsReviewed).toBe(3);
  });

  it('normalizes offline, expired session, missing key, quota, timeout, and DB errors safely', () => {
    expect(normalizeTutorError({ code: 'OFFLINE' }).code).toBe('OFFLINE');
    expect(normalizeTutorError({ status: 401 }).code).toBe('INVALID_SESSION');
    expect(normalizeTutorError({ code: 'GEMINI_NOT_CONFIGURED' }).retryable).toBe(false);
    expect(normalizeTutorError({ code: 'DAILY_QUOTA_EXCEEDED' }).retryable).toBe(false);
    expect(normalizeTutorError({ status: 504 }).retryable).toBe(true);
    expect(normalizeTutorError({ status: 404 }).code).toBe('ENDPOINT_UNAVAILABLE');
  });
});

describe('Edge Function Core Helpers (tutor-core.ts)', () => {
  it('validates request payloads and restricts CORS to approved origins', () => {
    expect(validateTutorRequest({ message: '   ' }).ok).toBe(false);
    expect(validateTutorRequest({ conversationId: 'not-a-uuid', message: 'Hi' }).ok).toBe(false);
    expect(
      validateTutorRequest({
        conversationId: CONV_ID,
        message: 'Explain deadlock',
        difficulty: 'advanced',
        teachingMode: 'hint',
        preferredLanguage: 'ko',
      })
    ).toMatchObject({
      ok: true,
      data: {
        conversationId: CONV_ID,
        difficulty: 'advanced',
        teachingMode: 'hint',
        preferredLanguage: 'ko',
      },
    });

    expect(isOriginPermitted('https://team-5-capstone-design-761v.vercel.app')).toBe(true);
    expect(isOriginPermitted('https://malicious-site.example')).toBe(false);
    expect(buildCorsHeaders('https://malicious-site.example')['Access-Control-Allow-Origin']).toBeUndefined();
  });

  it('builds grounded trusted academic prompts without inventing university syllabi', () => {
    const prompt = buildTrustedSystemPrompt({
      university: 'Ulsan College',
      major: 'Computer Science',
      subjectName: 'Data Structures',
      difficulty: 'advanced',
      teachingMode: 'exam_prep',
      preferredLanguage: 'en',
      upcomingTasks: [{ title: 'Lab 4 Trees', subject: 'Data Structures', deadline: '2026-11-28T12:00:00Z' }],
      recentQuizSummary: [{ subject: 'Data Structures', percentage: 65 }],
    });
    expect(prompt).toContain('Ulsan College');
    expect(prompt).toContain('never invent university-specific syllabi');
    expect(prompt).toContain('Lab 4 Trees');
    expect(prompt).toContain('65%');
  });

  it('parses fenced Gemini JSON replies and handles plain text fallback cleanly', () => {
    const fenced = '```json\n{"answer":"Step 1 <script>evil()</script>","suggestedTitle":"BST Basics","recommendedQuizTopic":"BST","followUpPrompts":["Try Java example"],"studyPlanTasks":[{"title":"Practice BST insertion","daysFromNow":2,"estimatedMinutes":40}]}\n```';
    const res = parseAndValidateModelResponse(fenced, 'BST');
    expect(res.ok).toBe(true);
    expect(res.data.answer).toBe('Step 1');
    expect(res.data.suggestedTitle).toBe('BST Basics');
    expect(res.data.studyPlanTasks).toHaveLength(1);

    const plainFallback = parseAndValidateModelResponse('Plain text answer without JSON', 'Stacks');
    expect(plainFallback.ok).toBe(true);
    expect(plainFallback.data.answer).toBe('Plain text answer without JSON');
    expect(plainFallback.data.recommendedQuizTopic).toBe('Stacks');
  });
});

describe('AI Tutor Service Contracts (Mocked Supabase)', () => {
  beforeEach(() => {
    dbCalls.length = 0;
    invokeImpl.mockReset();
    mockSession = { access_token: 'mock-jwt-token', user: { id: STUDENT_ID } };
    tableHandler = () => ({ data: [], error: null });
  });

  it('lists, creates, renames, loads messages, and deletes owned conversations', async () => {
    tableHandler = (op) => {
      if (op.action === 'select' && op.table === 'subjects') return { data: { id: SUBJ_ID }, error: null };
      if (op.action === 'insert') return { data: { id: CONV_ID, title: op.payload.title }, error: null };
      if (op.action === 'update') return { data: { id: CONV_ID, title: op.payload.title }, error: null };
      return { data: [{ id: CONV_ID, title: 'OS Study' }], error: null };
    };

    const listed = await listTutorConversations(STUDENT_ID);
    expect(listed.error).toBeNull();
    expect(listed.data).toHaveLength(1);

    const created = await createTutorConversation({
      studentId: STUDENT_ID,
      title: 'Binary Trees',
      subjectSlug: 'data-structures',
    });
    expect(created.data.id).toBe(CONV_ID);

    const renamed = await renameTutorConversation(CONV_ID, STUDENT_ID, 'Trees Updated');
    expect(renamed.data.title).toBe('Trees Updated');

    const msgs = await getTutorMessages(CONV_ID);
    expect(msgs.error).toBeNull();

    const deleted = await deleteTutorConversation(CONV_ID, STUDENT_ID);
    expect(deleted.error).toBeNull();
    expect(dbCalls.some((c) => c.table === 'ai_tutor_conversations' && c.action === 'delete')).toBe(true);
  });

  it('invokes ai-tutor-chat Edge Function and maps session-expired or error payloads cleanly', async () => {
    invokeImpl.mockResolvedValueOnce({
      data: {
        conversation: { id: CONV_ID, title: 'SQL Normalization' },
        studentMessage: { id: 'm1', role: 'student', content: 'Explain 3NF' },
        assistantMessage: { id: 'm2', role: 'assistant', content: '3NF removes transitive dependencies.' },
      },
      error: null,
    });

    const okRes = await sendTutorMessage({
      message: 'Explain 3NF',
      subjectSlug: 'databases',
      difficulty: 'intermediate',
      teachingMode: 'explain',
    });
    expect(okRes.error).toBeNull();
    expect(okRes.data.assistantMessage.content).toContain('3NF');

    // Missing session test
    mockSession = null;
    const expiredRes = await sendTutorMessage({ message: 'Follow up question' });
    expect(expiredRes.error.code).toBe('INVALID_SESSION');

    // Quota status read test
    tableHandler = () => ({ data: { request_count: 7 }, error: null });
    const quota = await getTutorQuotaStatus(STUDENT_ID);
    expect(quota.data.used).toBe(7);
    expect(quota.data.remaining).toBe(23);
  });
});
