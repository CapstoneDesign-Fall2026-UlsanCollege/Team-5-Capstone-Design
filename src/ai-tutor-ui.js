/**
 * AI Tutor UI Controller — Smart Study Companion
 *
 * Mounts inside #view-ai-tutor cleanly without disrupting existing views.
 * Integrates personalized student profile/subjects, 7 teaching modes, multilingual
 * prompts, persistent Supabase history, Quiz Practice bridge, confirmed study plan
 * task creation, and AI learning summaries.
 */
import {
  DEFAULT_DAILY_TUTOR_LIMIT,
  MAX_TUTOR_MESSAGE_CHARS,
  TUTOR_QUICK_ACTIONS,
  buildStudyPlanTaskPayloads,
  computeTutorLearningSummary,
  conversationHasDifferentSubjectMessages,
  escapeTutorHtml,
  extractTopicFromConversation,
  filterConversationsByQuery,
  mapTutorDifficultyToQuizDifficulty,
  renderSafeTutorMarkdown,
  validateTutorMessageInput,
} from './lib/ai-tutor-logic.js';
import { SUBJECTS_CATALOG, MAJOR_SUBJECT_MAP, getSubjectsForMajor } from './lib/academic-catalog.js';
import {
  createTutorConversation,
  deleteTutorConversation,
  getTutorLearningSessions,
  getTutorMessages,
  getTutorQuotaStatus,
  listTutorConversations,
  recordTutorLearningActivity,
  renameTutorConversation,
  sendTutorMessage,
  updateTutorConversationSettings,
} from './services/ai-tutor.js';

const state = {
  ctx: null,
  initialized: false,
  conversations: [],
  activeConversation: null,
  messages: [],
  sessions: [],
  quota: { used: 0, limit: DEFAULT_DAILY_TUTOR_LIMIT, remaining: DEFAULT_DAILY_TUTOR_LIMIT },
  searchQuery: '',
  selectedSubjectSlug: '',
  difficulty: 'beginner',
  teachingMode: 'explain',
  preferredLanguage: 'auto',
  sending: false,
  lastFailedRequest: null,
  planTasksSavedByMsgId: new Set(),
};

const $ = (id) => document.getElementById(id);

function notify(msg) {
  state.ctx?.toast?.(msg);
}

function activeSubjectMeta(slug = state.selectedSubjectSlug) {
  const dbSubs = state.ctx?.getDbSubjects?.() || [];
  const subObj = dbSubs.find((s) => s.slug === slug) || SUBJECTS_CATALOG.find((s) => s.slug === slug);
  return {
    id: subObj?.id && !String(subObj.id).startsWith('subj-') ? subObj.id : null,
    slug: subObj?.slug || slug || '',
    name: subObj?.name || 'General University Study',
  };
}

export function initAiTutor(ctx) {
  state.ctx = ctx;
  if (state.initialized) return;
  state.initialized = true;
  bindEvents();
  renderAll();
}

export function resetAiTutorState() {
  state.conversations = [];
  state.activeConversation = null;
  state.messages = [];
  state.sessions = [];
  state.quota = { used: 0, limit: DEFAULT_DAILY_TUTOR_LIMIT, remaining: DEFAULT_DAILY_TUTOR_LIMIT };
  state.lastFailedRequest = null;
  state.sending = false;
  state.planTasksSavedByMsgId.clear();
  renderAll();
}

export async function refreshAiTutorContext() {
  populateSubjectDropdown();
  renderProfileContextBanner();
  renderQuickActions();

  const user = state.ctx?.getCurrentUser?.();
  if (!user?.id) {
    renderAll();
    return;
  }

  const [convRes, quotaRes, sessionsRes] = await Promise.all([
    listTutorConversations(user.id),
    getTutorQuotaStatus(user.id),
    getTutorLearningSessions(user.id),
  ]);

  if (!convRes.error) {
    state.conversations = convRes.data || [];
    if (state.activeConversation) {
      const updatedActive = state.conversations.find((c) => c.id === state.activeConversation.id);
      if (updatedActive) {
        state.activeConversation = updatedActive;
      } else {
        state.activeConversation = null;
        state.messages = [];
      }
    }
  }
  if (quotaRes?.data) state.quota = quotaRes.data;
  if (sessionsRes?.data) state.sessions = sessionsRes.data;

  renderAll();
}

export async function openAiTutorWithContext({
  subjectSlug = '',
  topic = '',
  mode = 'explain',
  prefillOnly = true,
} = {}) {
  populateSubjectDropdown();
  if (subjectSlug) {
    const subjEl = $('ai-tutor-subject');
    if (subjEl && Array.from(subjEl.options).some((o) => o.value === subjectSlug)) {
      subjEl.value = subjectSlug;
      state.selectedSubjectSlug = subjectSlug;
    }
  }
  state.activeConversation = null;
  state.messages = [];
  state.lastFailedRequest = null;
  state.teachingMode = mode || 'explain';
  const modeEl = $('ai-tutor-mode');
  if (modeEl) modeEl.value = state.teachingMode;

  const inputEl = $('ai-tutor-input');
  if (inputEl && topic) {
    inputEl.value = `Help me understand "${topic}" clearly and review key mistakes to watch out for.`;
    updateCharCount();
    if (prefillOnly) inputEl.focus();
  }
  renderAll();
}

function populateSubjectDropdown() {
  const selectEl = $('ai-tutor-subject');
  if (!selectEl) return;

  const profile = state.ctx?.getCurrentProfile?.();
  const enrolledSlugs = state.ctx?.getEnrolledSlugs?.() || new Set();
  const currentMajor = profile?.major || '';
  const prev = state.selectedSubjectSlug || selectEl.value;

  let html = '';

  const enrolledList = Array.from(enrolledSlugs)
    .map((slug) => SUBJECTS_CATALOG.find((s) => s.slug === slug) || { slug, name: slug })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (enrolledList.length > 0) {
    html += `<optgroup label="My Enrolled Subjects (${enrolledList.length})">` +
      enrolledList.map((s) => `<option value="${escapeTutorHtml(s.slug)}">${escapeTutorHtml(s.name)}</option>`).join('') +
      `</optgroup>`;
  }

  if (currentMajor && MAJOR_SUBJECT_MAP[currentMajor]) {
    const nonEnrolledMajor = getSubjectsForMajor(currentMajor).filter((s) => !enrolledSlugs.has(s.slug));
    if (nonEnrolledMajor.length > 0) {
      html += `<optgroup label="Curriculum for ${escapeTutorHtml(currentMajor)}">` +
        nonEnrolledMajor.map((s) => `<option value="${escapeTutorHtml(s.slug)}">${escapeTutorHtml(s.name)}</option>`).join('') +
        `</optgroup>`;
    }
  }

  const otherSubjects = SUBJECTS_CATALOG.filter((s) => !enrolledSlugs.has(s.slug))
    .sort((a, b) => a.name.localeCompare(b.name));
  if (otherSubjects.length > 0) {
    html += `<optgroup label="All Subjects">` +
      otherSubjects.map((s) => `<option value="${escapeTutorHtml(s.slug)}">${escapeTutorHtml(s.name)}</option>`).join('') +
      `</optgroup>`;
  }

  selectEl.innerHTML = html;

  if (prev && Array.from(selectEl.options).some((o) => o.value === prev)) {
    selectEl.value = prev;
  } else if (selectEl.options.length > 0) {
    selectEl.selectedIndex = 0;
  }
  state.selectedSubjectSlug = selectEl.value || '';
}

function renderProfileContextBanner() {
  const banner = $('ai-tutor-context-banner');
  if (!banner) return;
  const profile = state.ctx?.getCurrentProfile?.() || {};
  const subj = activeSubjectMeta();
  const diffEl = $('ai-tutor-difficulty');
  const diffText = diffEl?.selectedOptions?.[0]?.textContent || state.difficulty;
  const modeEl = $('ai-tutor-mode');
  const modeText = modeEl?.selectedOptions?.[0]?.textContent || state.teachingMode;

  const profileBits = [profile.country, profile.university, profile.major].filter(Boolean);
  const profileText = profileBits.length > 0
    ? profileBits.join(' · ')
    : 'Academic profile incomplete (update in Subjects & University)';

  banner.innerHTML =
    `<span><strong>Profile:</strong> ${escapeTutorHtml(profileText)}</span>` +
    `<span><strong>Subject:</strong> ${escapeTutorHtml(subj.name)} · <strong>Level:</strong> ${escapeTutorHtml(diffText)} · <strong>Mode:</strong> ${escapeTutorHtml(modeText)}</span>`;
}

function renderQuotaBadge() {
  const badge = $('ai-tutor-quota-badge');
  if (!badge) return;
  const { used, limit, remaining } = state.quota;
  badge.textContent = `${remaining}/${limit} left today`;
  badge.classList.remove('is-low', 'is-exhausted');
  if (remaining <= 0) {
    badge.classList.add('is-exhausted');
  } else if (remaining <= 5) {
    badge.classList.add('is-low');
  }
  badge.title = `${used} of ${limit} AI Tutor messages used today`;
}

function renderQuickActions() {
  const container = $('ai-tutor-quick-actions');
  if (!container) return;
  container.innerHTML = TUTOR_QUICK_ACTIONS.map((action) => `
    <button type="button" class="ai-quick-chip" data-quick-action="${escapeTutorHtml(action.id)}">
      ${escapeTutorHtml(action.label)}
    </button>
  `).join('');
}

function renderHistoryList() {
  const listEl = $('ai-tutor-conversation-list');
  if (!listEl) return;

  const filtered = filterConversationsByQuery(state.conversations, state.searchQuery);
  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="ai-history-empty">
        <p class="muted">${state.searchQuery ? 'No matching chats found.' : 'No saved chats yet. Ask a question to begin!'}</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map((conv) => {
    const isActive = state.activeConversation?.id === conv.id;
    const subjName = activeSubjectMeta(conv.subject_slug).name;
    const when = conv.updated_at ? new Date(conv.updated_at).toLocaleDateString() : '';
    return `
      <div class="ai-conv-item ${isActive ? 'is-active' : ''}" data-conv-id="${escapeTutorHtml(conv.id)}">
        <button type="button" class="ai-conv-select" data-open-conv="${escapeTutorHtml(conv.id)}">
          <span class="ai-conv-title">${escapeTutorHtml(conv.title || 'Study Chat')}</span>
          <span class="ai-conv-meta">${escapeTutorHtml(conv.subject_slug ? subjName : 'General')} · ${escapeTutorHtml(conv.difficulty || 'beginner')} · ${escapeTutorHtml(when)}</span>
        </button>
        <div class="ai-conv-actions">
          <button type="button" class="icon-btn ai-conv-btn" data-rename-conv="${escapeTutorHtml(conv.id)}" aria-label="Rename conversation" title="Rename">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button type="button" class="icon-btn ai-conv-btn ai-conv-delete" data-delete-conv="${escapeTutorHtml(conv.id)}" aria-label="Delete conversation" title="Delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderLearningSummary() {
  const summaryEl = $('ai-tutor-learning-summary');
  if (!summaryEl) return;

  const stats = computeTutorLearningSummary(state.sessions, state.conversations);
  summaryEl.innerHTML = `
    <div class="ai-summary-grid">
      <div class="ai-summary-stat"><strong>${stats.completedSessions}</strong><span>Sessions</span></div>
      <div class="ai-summary-stat"><strong>${stats.subjectsPracticed}</strong><span>Subjects</span></div>
      <div class="ai-summary-stat"><strong>${stats.quizzesAttempted}</strong><span>Quizzes</span></div>
      <div class="ai-summary-stat"><strong>${stats.topicsReviewed}</strong><span>Topics</span></div>
    </div>
    ${stats.recentActivities.length > 0
      ? `<ul class="ai-recent-activity">` +
        stats.recentActivities.slice(0, 3).map((a) => `<li>${escapeTutorHtml(a.topic)}</li>`).join('') +
        `</ul>`
      : `<p class="muted" style="font-size: 12px; margin: 6px 0 0;">Complete tutor chats or practice quizzes to see summary stats here.</p>`
    }
  `;
}

function renderStudyPlanCard(msg) {
  const items = Array.isArray(msg?.metadata?.studyPlanTasks) ? msg.metadata.studyPlanTasks : [];
  if (items.length === 0) return '';

  const alreadySaved = state.planTasksSavedByMsgId.has(msg.id);
  return `
    <div class="ai-study-plan-card" data-plan-msg-id="${escapeTutorHtml(msg.id)}">
      <div class="ai-plan-head">
        <strong><i class="fa-solid fa-calendar-check"></i> Suggested Study Plan Sessions</strong>
        <span class="muted">Confirm before saving to Study Tasks</span>
      </div>
      <div class="ai-plan-items">
        ${items.map((item, idx) => `
          <label class="ai-plan-item">
            <input type="checkbox" class="ai-plan-checkbox" data-plan-index="${idx}" checked ${alreadySaved ? 'disabled' : ''}>
            <span>
              <strong>${escapeTutorHtml(item.title)}</strong>
              <small class="muted">Target: in ${item.daysFromNow} day${item.daysFromNow === 1 ? '' : 's'} · ~${item.estimatedMinutes} min</small>
            </span>
          </label>
        `).join('')}
      </div>
      <button type="button" class="btn-primary ai-confirm-plan-btn" data-confirm-plan="${escapeTutorHtml(msg.id)}" ${alreadySaved ? 'disabled' : ''}>
        <i class="fa-solid fa-plus"></i>
        <span>${alreadySaved ? 'Added to Study Tasks' : 'Add Selected to Study Tasks'}</span>
      </button>
    </div>
  `;
}

function renderMessages() {
  const threadEl = $('ai-tutor-messages');
  const welcomeEl = $('ai-tutor-welcome');
  if (!threadEl) return;

  const hasContent = state.messages.length > 0 || state.sending || Boolean(state.lastFailedRequest);
  if (welcomeEl) welcomeEl.hidden = hasContent;

  if (!hasContent) {
    threadEl.innerHTML = '';
    return;
  }

  let latestAssistantIdx = -1;
  state.messages.forEach((m, idx) => {
    if (m.role === 'assistant') latestAssistantIdx = idx;
  });

  const blocks = state.messages.map((msg, idx) => {
    const isStudent = msg.role === 'student';
    const timeLabel = msg.created_at
      ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

    if (isStudent) {
      return `
        <article class="ai-msg ai-msg-student">
          <div class="ai-bubble ai-bubble-student">
            <div class="ai-msg-text">${escapeTutorHtml(msg.content).replace(/\n/g, '<br>')}</div>
            <span class="ai-msg-meta">${escapeTutorHtml(timeLabel)}</span>
          </div>
        </article>
      `;
    }

    const followUps = Array.isArray(msg.metadata?.followUpPrompts) ? msg.metadata.followUpPrompts : [];
    const safeHtml = renderSafeTutorMarkdown(msg.content);
    const isLatestAssistant = idx === latestAssistantIdx;

    return `
      <article class="ai-msg ai-msg-assistant" data-msg-id="${escapeTutorHtml(msg.id)}">
        <div class="ai-avatar-badge" aria-hidden="true"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
        <div class="ai-bubble ai-bubble-assistant">
          <div class="ai-msg-body">${safeHtml}</div>
          ${renderStudyPlanCard(msg)}
          ${followUps.length > 0
            ? `<div class="ai-followup-row">` +
              followUps.map((p) => `<button type="button" class="ai-followup-chip" data-followup-text="${escapeTutorHtml(p)}">${escapeTutorHtml(p)}</button>`).join('') +
              `</div>`
            : ''
          }
          <div class="ai-msg-actions">
            <button type="button" class="btn-ghost ai-action-btn" data-copy-msg="${escapeTutorHtml(msg.id)}">
              <i class="fa-regular fa-copy"></i> Copy Answer
            </button>
            ${isLatestAssistant
              ? `<button type="button" class="btn-ghost ai-action-btn" data-regenerate-msg="${escapeTutorHtml(msg.id)}">
                   <i class="fa-solid fa-rotate-right"></i> Regenerate
                 </button>`
              : ''
            }
            <button type="button" class="btn-ghost ai-action-btn ai-practice-btn" data-practice-msg="${escapeTutorHtml(msg.id)}">
              <i class="fa-solid fa-circle-question"></i> Practice This Topic
            </button>
            <span class="ai-msg-meta">${escapeTutorHtml(msg.metadata?.model || 'AI Tutor')} · ${escapeTutorHtml(timeLabel)}</span>
          </div>
        </div>
      </article>
    `;
  });

  if (state.sending) {
    blocks.push(`
      <article class="ai-msg ai-msg-assistant ai-msg-typing" aria-live="polite">
        <div class="ai-avatar-badge" aria-hidden="true"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
        <div class="ai-bubble ai-bubble-assistant">
          <div class="ai-typing-indicator">
            <span class="spinner" aria-hidden="true"></span>
            <span>AI Tutor is preparing a personalized explanation...</span>
          </div>
        </div>
      </article>
    `);
  }

  if (state.lastFailedRequest) {
    blocks.push(`
      <div class="ai-error-banner" role="alert">
        <div>
          <strong>Could not complete AI Tutor request</strong>
          <p>${escapeTutorHtml(state.lastFailedRequest.errorMessage)}</p>
        </div>
        ${state.lastFailedRequest.retryable
          ? `<button type="button" class="btn-primary" id="ai-tutor-retry-btn"><i class="fa-solid fa-rotate-right"></i> Retry</button>`
          : ''
        }
      </div>
    `);
  }

  threadEl.innerHTML = blocks.join('');
  threadEl.scrollTop = threadEl.scrollHeight;
}

function updateComposerState() {
  const sendBtn = $('ai-tutor-send-btn');
  const practiceTopBtn = $('ai-tutor-practice-topic-btn');
  if (sendBtn) {
    sendBtn.disabled = state.sending || state.quota.remaining <= 0;
  }
  if (practiceTopBtn) {
    practiceTopBtn.disabled = state.sending;
  }
  updateCharCount();
}

function updateCharCount() {
  const input = $('ai-tutor-input');
  const counter = $('ai-tutor-char-count');
  if (!input || !counter) return;
  const len = input.value.length;
  counter.textContent = `${len} / ${MAX_TUTOR_MESSAGE_CHARS}`;
  counter.classList.toggle('is-over', len > MAX_TUTOR_MESSAGE_CHARS);
}

function renderAll() {
  renderProfileContextBanner();
  renderQuotaBadge();
  renderQuickActions();
  renderHistoryList();
  renderLearningSummary();
  renderMessages();
  updateComposerState();
}

async function handleSendMessage(overridePrompt = null, options = {}) {
  if (state.sending) return;
  const inputEl = $('ai-tutor-input');
  const rawMessage = overridePrompt !== null ? overridePrompt : (inputEl?.value || '');
  const regenerateLast = Boolean(options.regenerateLast);

  if (!regenerateLast) {
    const validation = validateTutorMessageInput(rawMessage);
    if (!validation.ok) {
      notify(validation.error);
      inputEl?.focus();
      return;
    }
  }

  const subj = activeSubjectMeta();
  const requestPayload = {
    conversationId: state.activeConversation?.id || null,
    message: regenerateLast ? '' : rawMessage.trim(),
    subjectId: subj.id,
    subjectSlug: subj.slug,
    subjectName: subj.name,
    difficulty: state.difficulty,
    teachingMode: state.teachingMode,
    preferredLanguage: state.preferredLanguage,
    regenerateLast,
  };

  if (overridePrompt === null && !regenerateLast && inputEl) {
    inputEl.value = '';
    updateCharCount();
  }

  state.sending = true;
  state.lastFailedRequest = null;

  // Optimistically display pending prompt if starting or continuing
  let optimisticId = null;
  if (!regenerateLast) {
    optimisticId = `pending-${Date.now()}`;
    state.messages.push({
      id: optimisticId,
      role: 'student',
      content: requestPayload.message,
      metadata: { subjectSlug: subj.slug },
      created_at: new Date().toISOString(),
    });
  }
  renderAll();

  const { data, error } = await sendTutorMessage(requestPayload);

  state.sending = false;

  if (error || !data?.assistantMessage) {
    if (data?.conversationId && !state.activeConversation) {
      state.activeConversation = { id: data.conversationId, title: requestPayload.message.slice(0, 56), subject_slug: subj.slug };
    }
    if (optimisticId && !data?.studentMessage && !regenerateLast) {
      // Remove unsaved optimistic bubble and restore prompt into input unless saved on DB
      state.messages = state.messages.filter((m) => m.id !== optimisticId);
      if (inputEl && !inputEl.value.trim()) {
        inputEl.value = requestPayload.message;
        updateCharCount();
      }
    } else if (optimisticId && data?.studentMessage) {
      state.messages = state.messages.map((m) => (m.id === optimisticId ? data.studentMessage : m));
    }
    state.lastFailedRequest = {
      payload: requestPayload,
      savedStudentMessage: Boolean(data?.studentMessage),
      errorMessage: error?.message || 'AI Tutor is temporarily unavailable.',
      retryable: error?.retryable !== false,
    };
    renderAll();
    return;
  }

  if (data.conversation) {
    state.activeConversation = data.conversation;
    const idx = state.conversations.findIndex((c) => c.id === data.conversation.id);
    if (idx >= 0) {
      state.conversations[idx] = data.conversation;
    } else {
      state.conversations.unshift(data.conversation);
    }
    state.conversations.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  if (regenerateLast) {
    // Replace or append regenerated assistant reply cleanly
    state.messages.push(data.assistantMessage);
  } else {
    state.messages = state.messages.filter((m) => m.id !== optimisticId);
    if (data.studentMessage) state.messages.push(data.studentMessage);
    state.messages.push(data.assistantMessage);
  }

  if (data.quota) {
    state.quota = data.quota;
  }

  const user = state.ctx?.getCurrentUser?.();
  if (user?.id) {
    const sessRes = await getTutorLearningSessions(user.id);
    if (sessRes?.data) state.sessions = sessRes.data;
  }

  renderAll();
}

async function openSavedConversation(convId) {
  const found = state.conversations.find((c) => c.id === convId);
  if (!found) return;
  state.activeConversation = found;
  state.lastFailedRequest = null;

  if (found.subject_slug) {
    state.selectedSubjectSlug = found.subject_slug;
    const subjEl = $('ai-tutor-subject');
    if (subjEl && Array.from(subjEl.options).some((o) => o.value === found.subject_slug)) {
      subjEl.value = found.subject_slug;
    }
  }
  if (found.difficulty) {
    state.difficulty = found.difficulty;
    const diffEl = $('ai-tutor-difficulty');
    if (diffEl) diffEl.value = found.difficulty;
  }
  if (found.teaching_mode) {
    state.teachingMode = found.teaching_mode;
    const modeEl = $('ai-tutor-mode');
    if (modeEl) modeEl.value = found.teaching_mode;
  }
  if (found.preferred_language) {
    state.preferredLanguage = found.preferred_language;
    const langEl = $('ai-tutor-language');
    if (langEl) langEl.value = found.preferred_language;
  }

  const { data, error } = await getTutorMessages(convId);
  if (error) {
    notify(error.message);
  } else {
    state.messages = data || [];
  }

  // Collapse mobile history drawer cleanly after picking chat
  $('ai-tutor-sidebar-panel')?.classList.remove('is-open');
  renderAll();
}

async function handlePracticeTopic(messageId = null) {
  const subj = activeSubjectMeta();
  const subset = messageId
    ? state.messages.slice(0, state.messages.findIndex((m) => m.id === messageId) + 1)
    : state.messages;
  const topic = extractTopicFromConversation(subset, subj.name);
  const quizDiff = mapTutorDifficultyToQuizDifficulty(state.difficulty);

  const user = state.ctx?.getCurrentUser?.();
  if (user?.id) {
    await recordTutorLearningActivity({
      studentId: user.id,
      subjectId: subj.id,
      subjectSlug: subj.slug,
      subjectName: subj.name,
      conversationId: state.activeConversation?.id || null,
      topic,
      difficulty: state.difficulty,
      teachingMode: state.teachingMode,
      activityType: 'practice_quiz',
    });
    const sessRes = await getTutorLearningSessions(user.id);
    if (sessRes?.data) state.sessions = sessRes.data;
    renderLearningSummary();
  }

  state.ctx?.onOpenPracticeQuiz?.({
    subjectSlug: subj.slug,
    topic,
    difficulty: quizDiff,
  });
}

async function handleConfirmStudyPlan(msgId) {
  const msg = state.messages.find((m) => m.id === msgId);
  if (!msg || state.planTasksSavedByMsgId.has(msgId)) return;

  const card = document.querySelector(`[data-plan-msg-id="${CSS.escape(msgId)}"]`);
  const items = Array.isArray(msg.metadata?.studyPlanTasks) ? msg.metadata.studyPlanTasks : [];
  const checkedIndexes = card
    ? Array.from(card.querySelectorAll('.ai-plan-checkbox:checked')).map((el) => Number(el.dataset.planIndex))
    : items.map((_, i) => i);

  const selectedItems = checkedIndexes.map((idx) => items[idx]).filter(Boolean);
  if (selectedItems.length === 0) {
    notify('Select at least one suggested study session to add.');
    return;
  }

  const user = state.ctx?.getCurrentUser?.();
  if (!user?.id) {
    notify('Please sign in first to save study tasks.');
    return;
  }

  const subj = activeSubjectMeta();
  const existingTasks = state.ctx?.getTasks?.() || [];
  const { toCreate, skippedDuplicates } = buildStudyPlanTaskPayloads({
    items: selectedItems,
    subjectId: subj.id,
    subjectName: subj.name,
    studentId: user.id,
    existingTasks,
  });

  if (toCreate.length === 0) {
    state.planTasksSavedByMsgId.add(msgId);
    renderMessages();
    notify(skippedDuplicates.length > 0 ? 'Those study tasks are already in your Study Tasks list.' : 'No tasks to add.');
    return;
  }

  let createdCount = 0;
  for (const taskPayload of toCreate) {
    const res = await state.ctx?.createTask?.(taskPayload);
    if (res && !res.error) createdCount += 1;
  }

  if (createdCount > 0) {
    state.planTasksSavedByMsgId.add(msgId);
    await recordTutorLearningActivity({
      studentId: user.id,
      subjectId: subj.id,
      subjectSlug: subj.slug,
      subjectName: subj.name,
      conversationId: state.activeConversation?.id || null,
      topic: `${subj.name} Study Plan (${createdCount} tasks)`,
      difficulty: state.difficulty,
      teachingMode: state.teachingMode,
      activityType: 'study_plan_task_added',
    });
    const sessRes = await getTutorLearningSessions(user.id);
    if (sessRes?.data) state.sessions = sessRes.data;
    state.ctx?.onTasksUpdated?.();
    renderLearningSummary();
    renderMessages();
    notify(
      skippedDuplicates.length > 0
        ? `Added ${createdCount} study task${createdCount === 1 ? '' : 's'} (skipped ${skippedDuplicates.length} duplicate).`
        : `Added ${createdCount} confirmed task${createdCount === 1 ? '' : 's'} to Study Tasks!`
    );
  } else {
    notify('Could not save confirmed study tasks. Please make sure your subjects are saved in Supabase.');
  }
}

function bindEvents() {
  const newBtn = $('ai-tutor-new-btn');
  if (newBtn) {
    newBtn.addEventListener('click', () => {
      state.activeConversation = null;
      state.messages = [];
      state.lastFailedRequest = null;
      renderAll();
      $('ai-tutor-input')?.focus();
    });
  }

  const historyToggle = $('ai-tutor-history-toggle');
  if (historyToggle) {
    historyToggle.addEventListener('click', () => {
      $('ai-tutor-sidebar-panel')?.classList.toggle('is-open');
    });
  }

  const searchEl = $('ai-tutor-search-input');
  if (searchEl) {
    searchEl.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderHistoryList();
    });
  }

  const subjectEl = $('ai-tutor-subject');
  if (subjectEl) {
    subjectEl.addEventListener('change', (e) => {
      const nextSlug = e.target.value;
      state.selectedSubjectSlug = nextSlug;
      if (conversationHasDifferentSubjectMessages(state.messages, nextSlug)) {
        state.activeConversation = null;
        state.messages = [];
        state.lastFailedRequest = null;
        const name = activeSubjectMeta(nextSlug).name;
        notify(`Switched subject to ${name}. Started a clean context (previous chat stays saved).`);
      } else if (state.activeConversation) {
        const subj = activeSubjectMeta(nextSlug);
        const user = state.ctx?.getCurrentUser?.();
        if (user?.id) {
          updateTutorConversationSettings(state.activeConversation.id, user.id, {
            subjectId: subj.id,
            subjectSlug: subj.slug,
          });
        }
      }
      renderAll();
    });
  }

  const diffEl = $('ai-tutor-difficulty');
  if (diffEl) {
    diffEl.addEventListener('change', (e) => {
      state.difficulty = e.target.value;
      const user = state.ctx?.getCurrentUser?.();
      if (state.activeConversation && user?.id) {
        updateTutorConversationSettings(state.activeConversation.id, user.id, { difficulty: state.difficulty });
      }
      renderProfileContextBanner();
    });
  }

  const modeEl = $('ai-tutor-mode');
  if (modeEl) {
    modeEl.addEventListener('change', (e) => {
      state.teachingMode = e.target.value;
      const user = state.ctx?.getCurrentUser?.();
      if (state.activeConversation && user?.id) {
        updateTutorConversationSettings(state.activeConversation.id, user.id, { teachingMode: state.teachingMode });
      }
      renderProfileContextBanner();
    });
  }

  const langEl = $('ai-tutor-language');
  if (langEl) {
    langEl.addEventListener('change', (e) => {
      state.preferredLanguage = e.target.value;
      const user = state.ctx?.getCurrentUser?.();
      if (state.activeConversation && user?.id) {
        updateTutorConversationSettings(state.activeConversation.id, user.id, {
          preferredLanguage: state.preferredLanguage,
        });
      }
    });
  }

  const practiceTopBtn = $('ai-tutor-practice-topic-btn');
  if (practiceTopBtn) {
    practiceTopBtn.addEventListener('click', () => handlePracticeTopic(null));
  }

  const convList = $('ai-tutor-conversation-list');
  if (convList) {
    convList.addEventListener('click', async (e) => {
      const openBtn = e.target.closest('[data-open-conv]');
      if (openBtn) {
        await openSavedConversation(openBtn.dataset.openConv);
        return;
      }

      const renameBtn = e.target.closest('[data-rename-conv]');
      if (renameBtn) {
        const cid = renameBtn.dataset.renameConv;
        const conv = state.conversations.find((c) => c.id === cid);
        const user = state.ctx?.getCurrentUser?.();
        if (!conv || !user?.id) return;
        const nextTitle = window.prompt('Rename conversation:', conv.title || '');
        if (!nextTitle || nextTitle.trim() === conv.title) return;
        const { data, error } = await renameTutorConversation(cid, user.id, nextTitle);
        if (error) {
          notify(error.message);
        } else if (data) {
          conv.title = data.title;
          if (state.activeConversation?.id === cid) state.activeConversation.title = data.title;
          renderHistoryList();
          notify('Conversation renamed');
        }
        return;
      }

      const deleteBtn = e.target.closest('[data-delete-conv]');
      if (deleteBtn) {
        const cid = deleteBtn.dataset.deleteConv;
        const user = state.ctx?.getCurrentUser?.();
        if (!user?.id) return;
        const { error } = await deleteTutorConversation(cid, user.id);
        if (error) {
          notify(error.message);
          return;
        }
        state.conversations = state.conversations.filter((c) => c.id !== cid);
        if (state.activeConversation?.id === cid) {
          state.activeConversation = null;
          state.messages = [];
          state.lastFailedRequest = null;
        }
        renderAll();
        notify('Conversation deleted');
      }
    });
  }

  const quickBar = $('ai-tutor-quick-actions');
  if (quickBar) {
    quickBar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-quick-action]');
      if (!btn) return;
      const action = TUTOR_QUICK_ACTIONS.find((a) => a.id === btn.dataset.quickAction);
      if (!action) return;
      state.teachingMode = action.mode;
      if (modeEl) modeEl.value = action.mode;
      const inputEl = $('ai-tutor-input');
      const subjName = activeSubjectMeta().name;
      if (inputEl) {
        inputEl.value = `${action.prompt}${subjName}`;
        updateCharCount();
        inputEl.focus();
      }
      renderProfileContextBanner();
    });
  }

  const welcomeBox = $('ai-tutor-welcome');
  if (welcomeBox) {
    welcomeBox.addEventListener('click', (e) => {
      const starter = e.target.closest('[data-starter-prompt]');
      if (!starter) return;
      const prompt = starter.dataset.starterPrompt;
      if (prompt) handleSendMessage(prompt);
    });
  }

  const messagesBox = $('ai-tutor-messages');
  if (messagesBox) {
    messagesBox.addEventListener('click', async (e) => {
      const copyCodeBtn = e.target.closest('.ai-copy-code-btn');
      if (copyCodeBtn) {
        const codeText = copyCodeBtn.closest('.ai-code-block')?.querySelector('pre code')?.textContent || '';
        try {
          await navigator.clipboard.writeText(codeText);
          notify('Code copied to clipboard');
        } catch (_) {
          notify('Copy unavailable in this browser context');
        }
        return;
      }

      const copyMsgBtn = e.target.closest('[data-copy-msg]');
      if (copyMsgBtn) {
        const msg = state.messages.find((m) => m.id === copyMsgBtn.dataset.copyMsg);
        if (msg) {
          try {
            await navigator.clipboard.writeText(msg.content);
            notify('Answer copied to clipboard');
          } catch (_) {
            notify('Copy unavailable in this browser context');
          }
        }
        return;
      }

      const regenBtn = e.target.closest('[data-regenerate-msg]');
      if (regenBtn) {
        await handleSendMessage('', { regenerateLast: true });
        return;
      }

      const practiceBtn = e.target.closest('[data-practice-msg]');
      if (practiceBtn) {
        await handlePracticeTopic(practiceBtn.dataset.practiceMsg);
        return;
      }

      const followBtn = e.target.closest('[data-followup-text]');
      if (followBtn) {
        await handleSendMessage(followBtn.dataset.followupText);
        return;
      }

      const confirmPlanBtn = e.target.closest('[data-confirm-plan]');
      if (confirmPlanBtn) {
        await handleConfirmStudyPlan(confirmPlanBtn.dataset.confirmPlan);
        return;
      }

      const retryBtn = e.target.closest('#ai-tutor-retry-btn');
      if (retryBtn && state.lastFailedRequest) {
        const failed = state.lastFailedRequest;
        if (failed.savedStudentMessage || failed.payload.regenerateLast) {
          await handleSendMessage('', { regenerateLast: true });
        } else {
          await handleSendMessage(failed.payload.message);
        }
      }
    });
  }

  const composer = $('ai-tutor-composer');
  const input = $('ai-tutor-input');
  if (composer) {
    composer.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSendMessage();
    });
  }
  if (input) {
    input.addEventListener('input', updateCharCount);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });
  }
}
