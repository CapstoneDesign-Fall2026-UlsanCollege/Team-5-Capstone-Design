/**
 * Pure AI Tutor Logic & Safe Formatting Helpers (Zero DOM / Zero Network)
 *
 * Designed cleanly for both browser ES modules and Vitest unit tests.
 */

export const MAX_TUTOR_MESSAGE_CHARS = 4000;
export const DEFAULT_DAILY_TUTOR_LIMIT = 30;

export const TUTOR_DIFFICULTIES = [
  { id: 'beginner', label: 'Beginner', description: 'Simple language, definitions & foundational examples' },
  { id: 'intermediate', label: 'Intermediate', description: 'Practical applications & problem solving' },
  { id: 'advanced', label: 'Advanced', description: 'Technical depth, complexity & deeper reasoning' },
];

export const TUTOR_TEACHING_MODES = [
  { id: 'explain', label: 'Explain Concept', icon: 'fa-book-open' },
  { id: 'step_by_step', label: 'Step-by-Step Learning', icon: 'fa-list-ol' },
  { id: 'simple_example', label: 'Simple Example', icon: 'fa-code' },
  { id: 'exam_prep', label: 'Exam Preparation', icon: 'fa-graduation-cap' },
  { id: 'practice_with_me', label: 'Practice With Me', icon: 'fa-comments' },
  { id: 'hint', label: 'Hint Mode', icon: 'fa-lightbulb' },
  { id: 'summarize', label: 'Summarize Topic', icon: 'fa-compress' },
];

export const TUTOR_LANGUAGES = [
  { id: 'auto', label: 'Auto (Match Question)' },
  { id: 'en', label: 'English' },
  { id: 'ko', label: 'Korean (한국어)' },
  { id: 'ne', label: 'Nepali (नेपाली)' },
  { id: 'hi', label: 'Hindi (हिन्दी)' },
];

export const TUTOR_QUICK_ACTIONS = [
  { id: 'explain', label: 'Explain a Concept', mode: 'explain', prompt: 'Explain a core concept from ' },
  { id: 'exam', label: 'Prepare for Exam', mode: 'exam_prep', prompt: 'Help me prepare for an upcoming exam on ' },
  { id: 'practice', label: 'Practice Questions', mode: 'practice_with_me', prompt: 'Practice with me step by step on ' },
  { id: 'simplify', label: 'Simplify This', mode: 'step_by_step', prompt: 'Break this down step by step in simple terms: ' },
  { id: 'example', label: 'Give an Example', mode: 'simple_example', prompt: 'Give me a concrete practical example of ' },
  { id: 'summarize', label: 'Summarize Topic', mode: 'summarize', prompt: 'Summarize key takeaways and formulas for ' },
  { id: 'plan', label: 'Create Study Plan', mode: 'exam_prep', prompt: 'Create a realistic study plan for my upcoming assessment in ' },
];

export function escapeTutorHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function validateTutorMessageInput(rawText) {
  const text = typeof rawText === 'string' ? rawText.trim() : '';
  if (!text) {
    return {
      ok: false,
      code: 'EMPTY_MESSAGE',
      text: '',
      error: 'Please enter a study question before sending.',
    };
  }
  if (text.length > MAX_TUTOR_MESSAGE_CHARS) {
    return {
      ok: false,
      code: 'MESSAGE_TOO_LONG',
      text,
      error: `Question is too long (${text.length}/${MAX_TUTOR_MESSAGE_CHARS} characters). Please shorten it.`,
    };
  }
  return { ok: true, code: null, text, error: null };
}

function formatInlineMarkdown(safeEscapedLine) {
  return safeEscapedLine
    .replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function renderTextSegment(segment) {
  const lines = segment.replace(/\r\n/g, '\n').split('\n');
  const htmlParts = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      htmlParts.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      htmlParts.push('</ol>');
      inOl = false;
    }
  };

  for (const rawLine of lines) {
    const escaped = escapeTutorHtml(rawLine);
    const trimmed = escaped.trim();

    if (!trimmed) {
      closeLists();
      continue;
    }

    if (/^###\s+/.test(trimmed)) {
      closeLists();
      htmlParts.push(`<h4>${formatInlineMarkdown(trimmed.replace(/^###\s+/, ''))}</h4>`);
      continue;
    }
    if (/^##\s+/.test(trimmed)) {
      closeLists();
      htmlParts.push(`<h3>${formatInlineMarkdown(trimmed.replace(/^##\s+/, ''))}</h3>`);
      continue;
    }
    if (/^#\s+/.test(trimmed)) {
      closeLists();
      htmlParts.push(`<h3>${formatInlineMarkdown(trimmed.replace(/^#\s+/, ''))}</h3>`);
      continue;
    }

    const ulMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (ulMatch) {
      if (inOl) {
        htmlParts.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        htmlParts.push('<ul>');
        inUl = true;
      }
      htmlParts.push(`<li>${formatInlineMarkdown(ulMatch[1])}</li>`);
      continue;
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      if (inUl) {
        htmlParts.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        htmlParts.push('<ol>');
        inOl = true;
      }
      htmlParts.push(`<li>${formatInlineMarkdown(olMatch[1])}</li>`);
      continue;
    }

    closeLists();
    htmlParts.push(`<p>${formatInlineMarkdown(trimmed)}</p>`);
  }

  closeLists();
  return htmlParts.join('');
}

/**
 * Safely converts AI Tutor markdown into escaped HTML with fenced code blocks.
 * Never allows raw HTML tags or <script> elements to execute.
 */
export function renderSafeTutorMarkdown(markdown) {
  const source = String(markdown ?? '').replace(/\r\n/g, '\n');
  if (!source.trim()) return '';

  const fenceRegex = /```([a-zA-Z0-9_+-]*)\n([\s\S]*?)```/g;
  const output = [];
  let lastIndex = 0;
  let match;

  while ((match = fenceRegex.exec(source)) !== null) {
    if (match.index > lastIndex) {
      output.push(renderTextSegment(source.slice(lastIndex, match.index)));
    }
    const lang = escapeTutorHtml((match[1] || 'code').trim());
    const code = escapeTutorHtml(match[2].replace(/\n$/, ''));
    output.push(
      `<div class="ai-code-block">` +
        `<div class="ai-code-head">` +
          `<span>${lang}</span>` +
          `<button type="button" class="ai-copy-code-btn" aria-label="Copy code snippet">` +
            `<i class="fa-regular fa-copy"></i> Copy code` +
          `</button>` +
        `</div>` +
        `<pre><code>${code}</code></pre>` +
      `</div>`
    );
    lastIndex = fenceRegex.lastIndex;
  }

  if (lastIndex < source.length) {
    output.push(renderTextSegment(source.slice(lastIndex)));
  }

  return output.join('');
}

export function mapTutorDifficultyToQuizDifficulty(difficulty) {
  const clean = String(difficulty || '').toLowerCase();
  if (clean === 'advanced') return 'hard';
  if (clean === 'intermediate') return 'medium';
  return 'easy';
}

export function extractTopicFromConversation(messages, subjectName = '') {
  if (Array.isArray(messages)) {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const m = messages[i];
      const rec = m?.metadata?.recommendedQuizTopic;
      if (typeof rec === 'string' && rec.trim().length >= 2) {
        return rec.trim().slice(0, 80);
      }
    }
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const m = messages[i];
      if (m?.role === 'student' && typeof m.content === 'string' && m.content.trim().length >= 2) {
        const clean = m.content
          .replace(/^(explain|what is|teach me|how does|help me understand|give me an example of|summarize)\s+/i, '')
          .replace(/[?.!]+$/g, '')
          .trim();
        if (clean.length >= 2) return clean.slice(0, 80);
      }
    }
  }
  return (subjectName || 'Core Concepts').slice(0, 80);
}

export function filterConversationsByQuery(conversations, query) {
  const list = Array.isArray(conversations) ? conversations : [];
  const clean = String(query || '').trim().toLowerCase();
  if (!clean) return list;
  return list.filter((conv) => {
    const title = String(conv?.title || '').toLowerCase();
    const subjectSlug = String(conv?.subject_slug || '').toLowerCase();
    return title.includes(clean) || subjectSlug.includes(clean);
  });
}

export function conversationHasDifferentSubjectMessages(messages, nextSubjectSlug) {
  if (!Array.isArray(messages) || messages.length === 0 || !nextSubjectSlug) return false;
  return messages.some((m) => {
    const msgSub = m?.metadata?.subjectSlug;
    return typeof msgSub === 'string' && msgSub.length > 0 && msgSub !== nextSubjectSlug;
  });
}

export function buildStudyPlanTaskPayloads({
  items,
  subjectId,
  subjectName,
  studentId,
  existingTasks = [],
  baseDate = new Date(),
}) {
  const existingKeys = new Set(
    (Array.isArray(existingTasks) ? existingTasks : []).map((t) => {
      const subj = String(t.subject || subjectName || '').trim().toLowerCase();
      const title = String(t.name || t.title || '').trim().toLowerCase();
      return `${subj}::${title}`;
    })
  );

  const toCreate = [];
  const skippedDuplicates = [];
  const seenInBatch = new Set();

  for (const item of Array.isArray(items) ? items : []) {
    const title = String(item?.title || '').trim().slice(0, 500);
    if (!title) continue;

    const dedupeKey = `${String(subjectName || '').trim().toLowerCase()}::${title.toLowerCase()}`;
    if (existingKeys.has(dedupeKey) || seenInBatch.has(dedupeKey)) {
      skippedDuplicates.push(title);
      continue;
    }
    seenInBatch.add(dedupeKey);

    const daysAhead = Math.min(Math.max(Math.round(Number(item?.daysFromNow) || 1), 1), 30);
    const target = new Date(baseDate.getTime());
    target.setDate(target.getDate() + daysAhead);
    target.setHours(21, 0, 0, 0);

    toCreate.push({
      studentId,
      subjectId,
      subjectName,
      title,
      deadline: target.toISOString(),
      completed: false,
    });
  }

  return { toCreate, skippedDuplicates };
}

export function computeTutorLearningSummary(sessions = [], conversations = []) {
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeConversations = Array.isArray(conversations) ? conversations : [];

  const tutorSessions = safeSessions.filter((s) => s.activity_type === 'tutor_session');
  const quizSessions = safeSessions.filter((s) => s.activity_type === 'practice_quiz');

  const subjectsSet = new Set();
  const topicsSet = new Set();

  safeSessions.forEach((s) => {
    if (s.subject_slug) subjectsSet.add(String(s.subject_slug));
    if (s.topic) topicsSet.add(String(s.topic).trim().toLowerCase());
  });
  safeConversations.forEach((c) => {
    if (c.subject_slug) subjectsSet.add(String(c.subject_slug));
  });

  const completedSessions = Math.max(tutorSessions.length, safeConversations.length);

  return {
    completedSessions,
    subjectsPracticed: subjectsSet.size,
    quizzesAttempted: quizSessions.length,
    topicsReviewed: topicsSet.size,
    recentActivities: safeSessions.slice(0, 5),
  };
}

export function normalizeTutorError(err) {
  const code = String(err?.code || '').toUpperCase();
  const status = Number(err?.status || 0);
  const msg = String(err?.message || err?.error || '');

  if (code === 'OFFLINE' || /network|failed to fetch|offline/i.test(msg)) {
    return {
      code: 'OFFLINE',
      retryable: true,
      message: 'No internet connection or unable to reach the server. Please check your connection and retry.',
    };
  }
  if (status === 401 || code === 'INVALID_SESSION' || code === 'UNAUTHORIZED' || /jwt|session|unauthorized/i.test(msg)) {
    return {
      code: 'INVALID_SESSION',
      retryable: false,
      message: 'Your session has expired. Please sign in again to continue.',
    };
  }
  if (status === 403 || code === 'FORBIDDEN') {
    return {
      code: 'FORBIDDEN',
      retryable: false,
      message: 'You do not have permission to access this conversation.',
    };
  }
  if (code === 'GEMINI_NOT_CONFIGURED' || /GEMINI_API_KEY|not enabled/i.test(msg)) {
    return {
      code: 'GEMINI_NOT_CONFIGURED',
      retryable: false,
      message: 'AI Tutor is not configured yet on the server (missing GEMINI_API_KEY). Ask your project admin to deploy Edge Function secrets.',
    };
  }
  if (code === 'DAILY_QUOTA_EXCEEDED') {
    return {
      code: 'DAILY_QUOTA_EXCEEDED',
      retryable: false,
      message: msg || 'Daily AI Tutor request limit reached. Please try again tomorrow.',
    };
  }
  if (status === 429 || code === 'RATE_LIMITED' || code === 'AI_PROVIDER_BUSY') {
    return {
      code: 'RATE_LIMITED',
      retryable: true,
      message: msg || 'AI Tutor is temporarily busy. Please wait a moment and retry.',
    };
  }
  if (status === 504 || code === 'AI_TIMEOUT' || /timeout|timed out/i.test(msg)) {
    return {
      code: 'AI_TIMEOUT',
      retryable: true,
      message: 'AI Tutor took too long to respond. Click Retry to try again without losing your question.',
    };
  }
  if (status === 404 || /404|not found|PGRST205/i.test(msg)) {
    return {
      code: 'ENDPOINT_UNAVAILABLE',
      retryable: false,
      message: 'AI Tutor backend function or database tables are not deployed in Supabase yet.',
    };
  }
  return {
    code: code || 'AI_UNAVAILABLE',
    retryable: true,
    message: msg && msg.length < 180 && !/stack|error at /i.test(msg)
      ? msg
      : 'AI Tutor is temporarily unavailable. Please try again later.',
  };
}
