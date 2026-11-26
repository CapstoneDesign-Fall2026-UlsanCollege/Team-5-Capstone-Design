/**
 * Manual Time Schedule & Study Planner UI Controller
 * Manages Daily & Weekly views, overview metrics, creation/edit modal,
 * recurrence scope handling, conflict prompts, and deletion confirmation.
 */
import {
  ACTIVITY_TYPES,
  MAX_SCHEDULE_DESCRIPTION_LENGTH,
  WEEKDAY_OPTIONS,
  addDays,
  buildConflictPromptMessage,
  computeScheduleOverview,
  expandSchedulesForRange,
  findScheduleConflicts,
  formatCalendarDate,
  formatDateOnly,
  formatTimeDisplay,
  getWeekDates,
  getWeekStartMonday,
  normalizeOptionalDescription,
  validateScheduleInput,
} from './lib/time-schedule.js';
import {
  cancelScheduleOccurrence,
  createSchedule,
  deleteSchedule,
  getSchedules,
  toggleScheduleCompletion,
  updateSchedule,
  upsertScheduleException,
} from './services/schedules.js';

export function initTimeScheduleController(deps) {
  const {
    getCurrentUser,
    getSubjectOptions,
    getAllSubjects,
    toast,
    burst,
    escapeHtml,
  } = deps;

  let schedules = [];
  let exceptions = [];
  let viewMode = 'daily';
  let selectedDate = formatDateOnly(new Date());
  let editingContext = null;
  let pendingConflictAction = null;
  let pendingDeleteOccurrence = null;
  let isSubmitting = false;
  let isDeleting = false;
  let lastTriggerEl = null;

  const $ = (id) => document.getElementById(id);

  function buildSubjectLookupMap() {
    const map = new Map();
    for (const item of getAllSubjects() || []) {
      if (item?.id) map.set(item.id, item);
      if (item?.slug) map.set(item.slug, item);
      if (item?.name) map.set(item.name, item);
    }
    return map;
  }

  function resolveSubjectDetails(selectedValue) {
    if (!selectedValue) return { subject_id: null, subject_name: null, subject_slug: null };
    const options = [...(getSubjectOptions() || []), ...(getAllSubjects() || [])];
    const match = options.find(
      (s) => s.id === selectedValue || s.slug === selectedValue || s.name === selectedValue,
    );
    if (!match) {
      return { subject_id: selectedValue, subject_name: null, subject_slug: null };
    }
    return {
      subject_id: match.id || match.slug,
      subject_name: match.name,
      subject_slug: match.slug,
    };
  }

  function populateSubjectDropdown(preselectedIdOrSlug = '') {
    const select = $('schedule-subject');
    if (!select) return;
    const activeSubjects = getSubjectOptions() || [];
    const seenIds = new Set();

    const opts = ['<option value="">No specific subject</option>'];
    for (const sub of activeSubjects) {
      const value = sub.id || sub.slug || sub.name;
      if (!value || seenIds.has(value)) continue;
      seenIds.add(value);
      opts.push(`<option value="${escapeHtml(value)}">${escapeHtml(sub.name)}</option>`);
    }

    // Preserve a previously linked (possibly now-deselected) subject when editing an existing item
    if (preselectedIdOrSlug && !seenIds.has(preselectedIdOrSlug)) {
      const catalogMatch = (getAllSubjects() || []).find(
        (s) => s.id === preselectedIdOrSlug || s.slug === preselectedIdOrSlug || s.name === preselectedIdOrSlug,
      );
      const label = catalogMatch ? `${catalogMatch.name} (saved)` : 'Saved subject';
      opts.push(`<option value="${escapeHtml(preselectedIdOrSlug)}">${escapeHtml(label)}</option>`);
    }

    select.innerHTML = opts.join('');
    select.value = preselectedIdOrSlug || '';
  }

  function populateActivityTypeDropdown(selectedType = 'study_session') {
    const select = $('schedule-type');
    if (!select) return;
    select.innerHTML = ACTIVITY_TYPES.map(
      (item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`,
    ).join('');
    select.value = selectedType || 'study_session';
  }

  function renderWeekdayCheckboxes(selectedDays = []) {
    const container = $('schedule-weekdays-picker');
    if (!container) return;
    const activeSet = new Set((selectedDays || []).map(Number));
    container.innerHTML = WEEKDAY_OPTIONS.map((w) => {
      const checked = activeSet.has(w.dayIndex);
      return `
        <label class="schedule-weekday-chip ${checked ? 'is-checked' : ''}">
          <input type="checkbox" name="schedule-repeat-day" value="${w.dayIndex}" ${checked ? 'checked' : ''}>
          <span>${escapeHtml(w.short)}</span>
        </label>
      `;
    }).join('');
  }

  function syncDescriptionCounter() {
    const textarea = $('schedule-description');
    const counter = $('schedule-description-count');
    if (!textarea || !counter) return;
    const len = textarea.value.length;
    counter.textContent = `${len} / ${MAX_SCHEDULE_DESCRIPTION_LENGTH}`;
    counter.classList.toggle('is-near-limit', len >= MAX_SCHEDULE_DESCRIPTION_LENGTH - 50);
  }

  function syncRecurrenceControls() {
    const ruleSelect = $('schedule-repeat-rule');
    const weekdaysGroup = $('schedule-weekdays-group');
    const untilWrap = $('schedule-repeat-until-wrap');
    const untilInput = $('schedule-repeat-until');
    const scopeRadios = document.querySelectorAll('input[name="schedule-edit-scope"]');
    const checkedScope = Array.from(scopeRadios).find((r) => r.checked)?.value || 'series';
    const isSingleOccurrenceEdit = Boolean(editingContext?.isRecurring && checkedScope === 'occurrence');

    if (ruleSelect) ruleSelect.disabled = isSingleOccurrenceEdit;
    if (untilInput) untilInput.disabled = isSingleOccurrenceEdit;

    const rule = isSingleOccurrenceEdit ? 'none' : (ruleSelect?.value || 'none');
    if (weekdaysGroup) weekdaysGroup.hidden = rule !== 'weekdays';
    if (untilWrap) untilWrap.hidden = rule === 'none';
  }

  function updateOverviewCards(subjectLookup) {
    const todayStr = formatDateOnly(new Date());
    const todayOccurrences = expandSchedulesForRange(schedules, exceptions, todayStr, todayStr, subjectLookup);
    const overview = computeScheduleOverview(todayOccurrences, new Date());

    const countEl = $('sched-stat-today-count');
    const timeEl = $('sched-stat-planned-time');
    const doneEl = $('sched-stat-completed-count');
    const upTitleEl = $('sched-stat-upcoming-title');
    const upMetaEl = $('sched-stat-upcoming-meta');

    if (countEl) countEl.textContent = String(overview.scheduledCount);
    if (timeEl) timeEl.textContent = overview.plannedFormatted;
    if (doneEl) doneEl.textContent = String(overview.completedCount);

    if (upTitleEl && upMetaEl) {
      if (overview.upcomingSession) {
        const up = overview.upcomingSession;
        upTitleEl.textContent = up.title;
        const prefix = overview.isUpcomingCurrent ? 'Happening now' : 'Next';
        const subj = up.subjectName ? `${up.subjectName} · ` : '';
        upMetaEl.textContent = `${prefix} · ${subj}${formatTimeDisplay(up.startTime)} – ${formatTimeDisplay(up.endTime)}`;
      } else if (overview.scheduledCount > 0 && overview.completedCount === overview.scheduledCount) {
        upTitleEl.textContent = 'All done today';
        upMetaEl.textContent = 'Every scheduled session today is completed.';
      } else {
        upTitleEl.textContent = 'No upcoming sessions';
        upMetaEl.textContent = 'Add a session to organize your day.';
      }
    }
  }

  function findOccurrenceByKey(key) {
    if (!key) return null;
    const weekDates = getWeekDates(selectedDate);
    const rangeStart = weekDates[0] < selectedDate ? weekDates[0] : selectedDate;
    const rangeEnd = weekDates[6] > selectedDate ? weekDates[6] : selectedDate;
    const all = expandSchedulesForRange(schedules, exceptions, rangeStart, rangeEnd, buildSubjectLookupMap());
    return all.find((occ) => occ.occurrenceKey === key) || null;
  }

  function findUpcomingHighlightKey(dayOccurrences) {
    const todayStr = formatDateOnly(new Date());
    if (selectedDate !== todayStr) return null;
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const match = dayOccurrences.find((item) => !item.completed && item.endMinutes > nowMins);
    return match ? match.occurrenceKey : null;
  }

  function renderDailyView(subjectLookup) {
    const listEl = $('schedule-daily-list');
    const emptyEl = $('schedule-empty-state');
    if (!listEl || !emptyEl) return;

    const occurrences = expandSchedulesForRange(schedules, exceptions, selectedDate, selectedDate, subjectLookup);
    const highlightKey = findUpcomingHighlightKey(occurrences);

    if (occurrences.length === 0) {
      listEl.innerHTML = '';
      listEl.hidden = true;
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;
    listEl.hidden = false;

    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const todayStr = formatDateOnly(now);

    listEl.innerHTML = occurrences.map((occ) => {
      const isHighlighted = occ.occurrenceKey === highlightKey;
      const isCurrent = selectedDate === todayStr && !occ.completed && occ.startMinutes <= nowMins && nowMins < occ.endMinutes;
      const highlightLabel = isCurrent ? 'Happening now' : (isHighlighted ? 'Up next' : '');

      return `
        <article class="schedule-card sched-tone-${escapeHtml(occ.activityMeta.tone)} ${occ.completed ? 'is-completed' : ''} ${isHighlighted ? 'is-highlighted' : ''}" data-occ-key="${escapeHtml(occ.occurrenceKey)}">
          <button
            type="button"
            class="schedule-complete-btn ${occ.completed ? 'is-checked' : ''}"
            data-sched-toggle="${escapeHtml(occ.occurrenceKey)}"
            aria-pressed="${occ.completed ? 'true' : 'false'}"
            aria-label="${occ.completed ? `Undo completion for ${escapeHtml(occ.title)}` : `Mark ${escapeHtml(occ.title)} as completed`}"
            title="${occ.completed ? 'Undo completion' : 'Mark as completed'}"
          >
            <i class="fa-solid fa-check" aria-hidden="true"></i>
          </button>

          <div class="schedule-card-body">
            <div class="schedule-card-badges">
              <span class="schedule-time-pill">
                <i class="fa-regular fa-clock" aria-hidden="true"></i>
                ${escapeHtml(formatTimeDisplay(occ.startTime))} – ${escapeHtml(formatTimeDisplay(occ.endTime))}
              </span>
              <span class="schedule-type-pill">
                <i class="fa-solid ${escapeHtml(occ.activityMeta.icon)}" aria-hidden="true"></i>
                ${escapeHtml(occ.activityMeta.label)}
              </span>
              ${occ.subjectName ? `<span class="schedule-subject-pill">${escapeHtml(occ.subjectName)}</span>` : ''}
              ${occ.isRecurring ? `<span class="schedule-repeat-pill"><i class="fa-solid fa-repeat" aria-hidden="true"></i> ${escapeHtml(occ.repeatSummary)}</span>` : ''}
              ${highlightLabel ? `<span class="schedule-live-pill">${escapeHtml(highlightLabel)}</span>` : ''}
              ${occ.completed ? '<span class="schedule-done-pill"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Completed</span>' : ''}
            </div>
            <h3 class="schedule-card-title">${escapeHtml(occ.title)}</h3>
            ${occ.description ? `<p class="schedule-card-notes">${escapeHtml(occ.description)}</p>` : ''}
          </div>

          <div class="schedule-card-actions">
            <button type="button" class="icon-btn" data-sched-edit="${escapeHtml(occ.occurrenceKey)}" aria-label="Edit ${escapeHtml(occ.title)}" title="Edit schedule">
              <i class="fa-solid fa-pen" aria-hidden="true"></i>
            </button>
            <button type="button" class="icon-btn" data-sched-delete="${escapeHtml(occ.occurrenceKey)}" aria-label="Delete ${escapeHtml(occ.title)}" title="Delete schedule">
              <i class="fa-solid fa-trash" aria-hidden="true"></i>
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderWeeklyView(subjectLookup) {
    const gridEl = $('schedule-week-grid');
    const weekEmptyEl = $('schedule-weekly-empty');
    if (!gridEl) return;

    const weekDates = getWeekDates(selectedDate);
    const weekStart = weekDates[0];
    const weekEnd = weekDates[6];
    const weekOccurrences = expandSchedulesForRange(schedules, exceptions, weekStart, weekEnd, subjectLookup);
    const todayStr = formatDateOnly(new Date());

    if (weekEmptyEl) {
      weekEmptyEl.hidden = weekOccurrences.length > 0;
    }

    const byDay = new Map(weekDates.map((d) => [d, []]));
    for (const occ of weekOccurrences) {
      if (byDay.has(occ.effectiveDate)) {
        byDay.get(occ.effectiveDate).push(occ);
      }
    }

    gridEl.innerHTML = weekDates.map((dateStr) => {
      const dayItems = byDay.get(dateStr) || [];
      const dayName = formatCalendarDate(dateStr, { weekday: 'short' });
      const dayNum = formatCalendarDate(dateStr, { month: 'short', day: 'numeric' });
      const isToday = dateStr === todayStr;

      return `
        <section class="schedule-day-col ${isToday ? 'is-today' : ''}" data-day-date="${escapeHtml(dateStr)}">
          <header class="schedule-day-head">
            <div>
              <div class="schedule-day-name">${escapeHtml(dayName)}</div>
              <div class="schedule-day-date">${escapeHtml(dayNum)}</div>
            </div>
            <button type="button" class="schedule-day-add" data-sched-add-date="${escapeHtml(dateStr)}" aria-label="Add schedule on ${escapeHtml(dayNum)}" title="Add schedule">
              <i class="fa-solid fa-plus" aria-hidden="true"></i>
            </button>
          </header>

          <div class="schedule-day-items">
            ${dayItems.length === 0
              ? '<p class="schedule-day-empty">No sessions</p>'
              : dayItems.map((occ) => `
                  <article class="schedule-mini-card sched-tone-${escapeHtml(occ.activityMeta.tone)} ${occ.completed ? 'is-completed' : ''}" data-occ-key="${escapeHtml(occ.occurrenceKey)}">
                    <div class="schedule-mini-top">
                      <span class="schedule-mini-time">${escapeHtml(formatTimeDisplay(occ.startTime))} – ${escapeHtml(formatTimeDisplay(occ.endTime))}</span>
                      ${occ.completed ? '<i class="fa-solid fa-circle-check" style="color: var(--teal); font-size: 12px;" title="Completed" aria-label="Completed"></i>' : ''}
                    </div>
                    <h4 class="schedule-mini-title">${escapeHtml(occ.title)}</h4>
                    <p class="schedule-mini-sub">
                      ${escapeHtml(occ.activityMeta.label)}${occ.subjectName ? ` · ${escapeHtml(occ.subjectName)}` : ''}
                    </p>
                    <div class="schedule-mini-actions">
                      <button type="button" class="schedule-mini-btn" data-sched-toggle="${escapeHtml(occ.occurrenceKey)}" aria-pressed="${occ.completed ? 'true' : 'false'}" title="${occ.completed ? 'Undo completion' : 'Mark completed'}" aria-label="${occ.completed ? `Undo completion for ${escapeHtml(occ.title)}` : `Complete ${escapeHtml(occ.title)}`}">
                        <i class="fa-solid ${occ.completed ? 'fa-rotate-left' : 'fa-check'}" aria-hidden="true"></i>
                      </button>
                      <button type="button" class="schedule-mini-btn" data-sched-edit="${escapeHtml(occ.occurrenceKey)}" title="Edit" aria-label="Edit ${escapeHtml(occ.title)}">
                        <i class="fa-solid fa-pen" aria-hidden="true"></i>
                      </button>
                      <button type="button" class="schedule-mini-btn" data-sched-delete="${escapeHtml(occ.occurrenceKey)}" title="Delete" aria-label="Delete ${escapeHtml(occ.title)}">
                        <i class="fa-solid fa-trash" aria-hidden="true"></i>
                      </button>
                    </div>
                  </article>
                `).join('')}
          </div>
        </section>
      `;
    }).join('');
  }

  function renderToolbarAndHeader() {
    const tabDaily = $('schedule-tab-daily');
    const tabWeekly = $('schedule-tab-weekly');
    const dailyPanel = $('schedule-daily-panel');
    const weeklyPanel = $('schedule-weekly-panel');
    const rangeLabel = $('schedule-range-label');
    const dateJump = $('schedule-date-jump');

    const isDaily = viewMode === 'daily';
    if (tabDaily) {
      tabDaily.classList.toggle('is-active', isDaily);
      tabDaily.setAttribute('aria-selected', String(isDaily));
    }
    if (tabWeekly) {
      tabWeekly.classList.toggle('is-active', !isDaily);
      tabWeekly.setAttribute('aria-selected', String(!isDaily));
    }
    if (dailyPanel) dailyPanel.hidden = !isDaily;
    if (weeklyPanel) weeklyPanel.hidden = isDaily;
    if (dateJump) dateJump.value = selectedDate;

    if (rangeLabel) {
      if (isDaily) {
        rangeLabel.textContent = formatCalendarDate(selectedDate, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
      } else {
        const weekDates = getWeekDates(selectedDate);
        const startText = formatCalendarDate(weekDates[0], { month: 'short', day: 'numeric' });
        const endText = formatCalendarDate(weekDates[6], { month: 'short', day: 'numeric', year: 'numeric' });
        rangeLabel.textContent = `${startText} – ${endText}`;
      }
    }
  }

  function renderScheduleWorkspace() {
    const subjectLookup = buildSubjectLookupMap();
    renderToolbarAndHeader();
    updateOverviewCards(subjectLookup);
    renderDailyView(subjectLookup);
    renderWeeklyView(subjectLookup);
  }

  function setScheduleFormError(message = '') {
    const box = $('schedule-form-error');
    if (!box) return;
    box.textContent = message;
    box.hidden = !message;
  }

  function openScheduleModal({ occurrence = null, prefillDate = null, triggerEl = null } = {}) {
    const modal = $('schedule-modal');
    if (!modal) return;
    lastTriggerEl = triggerEl || document.activeElement;
    setScheduleFormError('');

    const titleHeading = $('schedule-modal-title');
    const titleInput = $('schedule-title');
    const dateInput = $('schedule-date');
    const startInput = $('schedule-start-time');
    const endInput = $('schedule-end-time');
    const descInput = $('schedule-description');
    const repeatSelect = $('schedule-repeat-rule');
    const untilInput = $('schedule-repeat-until');
    const scopeWrap = $('schedule-edit-scope-wrap');
    const scopeSeriesRadio = document.querySelector('input[name="schedule-edit-scope"][value="series"]');
    const scopeOccRadio = document.querySelector('input[name="schedule-edit-scope"][value="occurrence"]');

    if (occurrence) {
      editingContext = {
        scheduleId: occurrence.scheduleId,
        occurrenceDate: occurrence.occurrenceDate,
        isRecurring: occurrence.isRecurring,
        rawSchedule: occurrence.rawSchedule,
        rawException: occurrence.rawException,
      };
      if (titleHeading) titleHeading.textContent = 'Edit Schedule';
      populateSubjectDropdown(occurrence.subjectId || '');
      populateActivityTypeDropdown(occurrence.activityType || 'study_session');
      if (titleInput) titleInput.value = occurrence.title || '';
      if (dateInput) dateInput.value = occurrence.effectiveDate || selectedDate;
      if (startInput) startInput.value = occurrence.startTime || '18:00';
      if (endInput) endInput.value = occurrence.endTime || '19:00';
      if (descInput) descInput.value = occurrence.description || '';
      if (repeatSelect) repeatSelect.value = occurrence.repeatRule || 'none';
      if (untilInput) untilInput.value = occurrence.repeatUntil || '';
      renderWeekdayCheckboxes(occurrence.repeatDays || []);

      if (scopeWrap) scopeWrap.hidden = !occurrence.isRecurring;
      if (scopeOccRadio) scopeOccRadio.checked = occurrence.isRecurring;
      if (scopeSeriesRadio && !occurrence.isRecurring) scopeSeriesRadio.checked = true;
    } else {
      editingContext = null;
      if (titleHeading) titleHeading.textContent = 'Add Schedule';
      populateSubjectDropdown('');
      populateActivityTypeDropdown('study_session');
      if (titleInput) titleInput.value = '';
      if (dateInput) dateInput.value = prefillDate || selectedDate || formatDateOnly(new Date());
      if (startInput) startInput.value = '18:00';
      if (endInput) endInput.value = '19:00';
      if (descInput) descInput.value = '';
      if (repeatSelect) repeatSelect.value = 'none';
      if (untilInput) untilInput.value = '';
      renderWeekdayCheckboxes([]);
      if (scopeWrap) scopeWrap.hidden = true;
      if (scopeSeriesRadio) scopeSeriesRadio.checked = true;
    }

    syncDescriptionCounter();
    syncRecurrenceControls();
    modal.hidden = false;
    titleInput?.focus();
  }

  function closeScheduleModal() {
    const modal = $('schedule-modal');
    if (modal) modal.hidden = true;
    setScheduleFormError('');
    if (lastTriggerEl && typeof lastTriggerEl.focus === 'function' && lastTriggerEl.isConnected) {
      lastTriggerEl.focus();
    }
  }

  function openConflictModal(conflicts, actionPayload) {
    const modal = $('schedule-conflict-modal');
    const msgEl = $('schedule-conflict-message');
    if (!modal || !msgEl) return;
    pendingConflictAction = actionPayload;
    msgEl.textContent = buildConflictPromptMessage(conflicts);
    modal.hidden = false;
    $('schedule-conflict-adjust')?.focus();
  }

  function closeConflictModal(returnToForm = false) {
    const modal = $('schedule-conflict-modal');
    if (modal) modal.hidden = true;
    pendingConflictAction = null;
    if (returnToForm) {
      $('schedule-start-time')?.focus();
    }
  }

  function openDeleteModal(occurrence, triggerEl = null) {
    const modal = $('schedule-delete-modal');
    if (!modal || !occurrence) return;
    lastTriggerEl = triggerEl || document.activeElement;
    pendingDeleteOccurrence = occurrence;

    const titleEl = $('schedule-delete-title');
    const copyEl = $('schedule-delete-copy');
    const singleBtn = $('schedule-delete-single-btn');
    const seriesBtn = $('schedule-delete-series-btn');

    if (occurrence.isRecurring) {
      if (titleEl) titleEl.textContent = 'Delete Recurring Schedule?';
      if (copyEl) {
        copyEl.textContent = `Delete "${occurrence.title}" only for ${formatCalendarDate(occurrence.effectiveDate, { month: 'short', day: 'numeric', year: 'numeric' })} or remove the entire repeating schedule?`;
      }
      if (singleBtn) singleBtn.hidden = false;
      if (seriesBtn) seriesBtn.textContent = 'Delete Entire Series';
    } else {
      if (titleEl) titleEl.textContent = 'Delete Schedule?';
      if (copyEl) {
        copyEl.textContent = `Are you sure you want to delete "${occurrence.title}" scheduled for ${formatCalendarDate(occurrence.effectiveDate, { month: 'short', day: 'numeric', year: 'numeric' })}?`;
      }
      if (singleBtn) singleBtn.hidden = true;
      if (seriesBtn) seriesBtn.textContent = 'Delete Schedule';
    }

    modal.hidden = false;
    $('schedule-delete-cancel')?.focus();
  }

  function closeDeleteModal() {
    const modal = $('schedule-delete-modal');
    if (modal) modal.hidden = true;
    pendingDeleteOccurrence = null;
    if (lastTriggerEl && typeof lastTriggerEl.focus === 'function' && lastTriggerEl.isConnected) {
      lastTriggerEl.focus();
    }
  }

  async function commitScheduleSave(actionPayload) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    if (isSubmitting) return;

    isSubmitting = true;
    const saveBtn = $('schedule-save-btn');
    const conflictSaveBtn = $('schedule-conflict-save');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
    }
    if (conflictSaveBtn) conflictSaveBtn.disabled = true;

    try {
      const { mode, normalized, editTarget } = actionPayload;
      let result;

      if (mode === 'create') {
        result = await createSchedule({ studentId: currentUser.id, ...normalized });
      } else if (mode === 'edit-occurrence') {
        result = await upsertScheduleException({
          scheduleId: editTarget.scheduleId,
          studentId: currentUser.id,
          occurrenceDate: editTarget.occurrenceDate,
          status: 'modified',
          overrideTitle: normalized.title,
          overrideSubjectId: normalized.subject_id,
          overrideSubjectName: normalized.subject_name,
          overrideActivityType: normalized.activity_type,
          overrideDescription: normalized.description === null ? '' : normalized.description,
          overrideDate: normalized.schedule_date,
          overrideStartTime: normalized.start_time,
          overrideEndTime: normalized.end_time,
          completed: Boolean(editTarget.rawException?.completed),
          completedAt: editTarget.rawException?.completed_at || null,
        });
      } else {
        result = await updateSchedule(editTarget.scheduleId, {
          studentId: currentUser.id,
          ...normalized,
        });
      }

      if (result?.error) {
        setScheduleFormError(result.error.message || 'Could not save schedule.');
        toast(`Could not save schedule: ${result.error.message || 'Please try again.'}`);
        return;
      }

      if (normalized.schedule_date) {
        selectedDate = normalized.schedule_date;
      }

      await loadSchedules();
      closeConflictModal(false);
      closeScheduleModal();
      toast(mode === 'create' ? 'Schedule activity added!' : 'Schedule updated!');
    } finally {
      isSubmitting = false;
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Schedule';
      }
      if (conflictSaveBtn) conflictSaveBtn.disabled = false;
    }
  }

  function handleScheduleFormSubmit(event) {
    event.preventDefault();
    setScheduleFormError('');

    const title = $('schedule-title')?.value || '';
    const subjectVal = $('schedule-subject')?.value || '';
    const scheduleDate = $('schedule-date')?.value || '';
    const startTime = $('schedule-start-time')?.value || '';
    const endTime = $('schedule-end-time')?.value || '';
    const activityType = $('schedule-type')?.value || '';
    const description = $('schedule-description')?.value || '';
    const repeatRule = $('schedule-repeat-rule')?.value || 'none';
    const repeatUntil = $('schedule-repeat-until')?.value || '';
    const repeatDays = Array.from(document.querySelectorAll('input[name="schedule-repeat-day"]:checked'))
      .map((cb) => Number(cb.value));

    const scopeRadio = Array.from(document.querySelectorAll('input[name="schedule-edit-scope"]')).find((r) => r.checked);
    const editScope = editingContext?.isRecurring ? (scopeRadio?.value || 'occurrence') : 'series';
    const isSingleOccurrenceEdit = Boolean(editingContext?.isRecurring && editScope === 'occurrence');

    const subjectDetails = resolveSubjectDetails(subjectVal);
    const validation = validateScheduleInput({
      title,
      ...subjectDetails,
      schedule_date: scheduleDate,
      start_time: startTime,
      end_time: endTime,
      activity_type: activityType,
      description,
      repeat_rule: isSingleOccurrenceEdit ? 'none' : repeatRule,
      repeat_days: isSingleOccurrenceEdit ? [] : repeatDays,
      repeat_until: isSingleOccurrenceEdit ? null : repeatUntil,
    });

    if (!validation.valid) {
      setScheduleFormError(validation.errors[0]);
      toast(validation.errors[0]);
      return;
    }

    const mode = !editingContext
      ? 'create'
      : (isSingleOccurrenceEdit ? 'edit-occurrence' : 'edit-series');

    const actionPayload = {
      mode,
      normalized: validation.normalized,
      editTarget: editingContext,
    };

    const conflicts = findScheduleConflicts(validation.normalized, schedules, exceptions, {
      ignoreScheduleId: editingContext?.scheduleId,
      ignoreOccurrenceDate: mode === 'edit-occurrence' ? editingContext.occurrenceDate : undefined,
    });

    if (conflicts.length > 0) {
      openConflictModal(conflicts, actionPayload);
      return;
    }

    commitScheduleSave(actionPayload);
  }

  async function handleToggleComplete(occKey, triggerEl) {
    const currentUser = getCurrentUser();
    const occ = findOccurrenceByKey(occKey);
    if (!currentUser || !occ) return;

    const nextCompleted = !occ.completed;
    const { error } = await toggleScheduleCompletion({
      occurrence: occ,
      studentId: currentUser.id,
      completed: nextCompleted,
    });

    if (error) {
      toast(`Could not update session: ${error.message}`);
      return;
    }

    await loadSchedules();
    if (nextCompleted && triggerEl && typeof burst === 'function') {
      burst(triggerEl);
    }
    toast(nextCompleted ? 'Study session marked as completed!' : 'Marked session as upcoming.');
  }

  async function handleConfirmDelete(scope) {
    const currentUser = getCurrentUser();
    if (!currentUser || !pendingDeleteOccurrence || isDeleting) return;

    isDeleting = true;
    const singleBtn = $('schedule-delete-single-btn');
    const seriesBtn = $('schedule-delete-series-btn');
    if (singleBtn) singleBtn.disabled = true;
    if (seriesBtn) seriesBtn.disabled = true;

    try {
      const occ = pendingDeleteOccurrence;
      let res;
      if (scope === 'single' && occ.isRecurring) {
        res = await cancelScheduleOccurrence({
          scheduleId: occ.scheduleId,
          studentId: currentUser.id,
          occurrenceDate: occ.occurrenceDate,
        });
      } else {
        res = await deleteSchedule(occ.scheduleId);
      }

      if (res?.error) {
        toast(`Could not delete schedule: ${res.error.message}`);
        return;
      }

      await loadSchedules();
      closeDeleteModal();
      toast(scope === 'single' ? 'Removed this occurrence from schedule.' : 'Schedule removed.');
    } finally {
      isDeleting = false;
      if (singleBtn) singleBtn.disabled = false;
      if (seriesBtn) seriesBtn.disabled = false;
    }
  }

  async function loadSchedules() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      schedules = [];
      exceptions = [];
      renderScheduleWorkspace();
      return;
    }

    const { data, error } = await getSchedules(currentUser.id);
    if (error) {
      toast(`Could not load time schedules: ${error.message}`);
      return;
    }

    schedules = data?.schedules || [];
    exceptions = data?.exceptions || [];
    renderScheduleWorkspace();
  }

  function bindEvents() {
    $('add-schedule-btn')?.addEventListener('click', (e) => {
      openScheduleModal({ prefillDate: selectedDate, triggerEl: e.currentTarget });
    });

    $('schedule-empty-add-btn')?.addEventListener('click', (e) => {
      openScheduleModal({ prefillDate: selectedDate, triggerEl: e.currentTarget });
    });

    $('schedule-tab-daily')?.addEventListener('click', () => {
      viewMode = 'daily';
      renderScheduleWorkspace();
    });

    $('schedule-tab-weekly')?.addEventListener('click', () => {
      viewMode = 'weekly';
      renderScheduleWorkspace();
    });

    $('schedule-prev-btn')?.addEventListener('click', () => {
      selectedDate = addDays(selectedDate, viewMode === 'daily' ? -1 : -7);
      renderScheduleWorkspace();
    });

    $('schedule-next-btn')?.addEventListener('click', () => {
      selectedDate = addDays(selectedDate, viewMode === 'daily' ? 1 : 7);
      renderScheduleWorkspace();
    });

    $('schedule-today-btn')?.addEventListener('click', () => {
      selectedDate = formatDateOnly(new Date());
      renderScheduleWorkspace();
    });

    $('schedule-date-jump')?.addEventListener('change', (e) => {
      if (e.target.value) {
        selectedDate = e.target.value;
        renderScheduleWorkspace();
      }
    });

    $('schedule-description')?.addEventListener('input', syncDescriptionCounter);
    $('schedule-repeat-rule')?.addEventListener('change', syncRecurrenceControls);

    document.querySelectorAll('input[name="schedule-edit-scope"]').forEach((radio) => {
      radio.addEventListener('change', syncRecurrenceControls);
    });

    $('schedule-weekdays-picker')?.addEventListener('change', (e) => {
      const chip = e.target.closest('.schedule-weekday-chip');
      if (chip) chip.classList.toggle('is-checked', e.target.checked);
    });

    $('schedule-form')?.addEventListener('submit', handleScheduleFormSubmit);

    ['schedule-modal-close', 'schedule-modal-cancel', 'schedule-modal-backdrop'].forEach((id) => {
      $(id)?.addEventListener('click', closeScheduleModal);
    });

    $('schedule-conflict-adjust')?.addEventListener('click', () => closeConflictModal(true));
    $('schedule-conflict-backdrop')?.addEventListener('click', () => closeConflictModal(true));
    $('schedule-conflict-save')?.addEventListener('click', () => {
      if (pendingConflictAction) commitScheduleSave(pendingConflictAction);
    });

    ['schedule-delete-cancel', 'schedule-delete-backdrop'].forEach((id) => {
      $(id)?.addEventListener('click', closeDeleteModal);
    });
    $('schedule-delete-single-btn')?.addEventListener('click', () => handleConfirmDelete('single'));
    $('schedule-delete-series-btn')?.addEventListener('click', () => handleConfirmDelete('series'));

    $('view-schedule')?.addEventListener('click', (e) => {
      const addDateBtn = e.target.closest('[data-sched-add-date]');
      if (addDateBtn) {
        openScheduleModal({ prefillDate: addDateBtn.dataset.schedAddDate, triggerEl: addDateBtn });
        return;
      }

      const toggleBtn = e.target.closest('[data-sched-toggle]');
      if (toggleBtn) {
        handleToggleComplete(toggleBtn.dataset.schedToggle, toggleBtn);
        return;
      }

      const editBtn = e.target.closest('[data-sched-edit]');
      if (editBtn) {
        const occ = findOccurrenceByKey(editBtn.dataset.schedEdit);
        if (occ) openScheduleModal({ occurrence: occ, triggerEl: editBtn });
        return;
      }

      const deleteBtn = e.target.closest('[data-sched-delete]');
      if (deleteBtn) {
        const occ = findOccurrenceByKey(deleteBtn.dataset.schedDelete);
        if (occ) openDeleteModal(occ, deleteBtn);
      }
    });
  }

  function closeOpenModalsOnEscape() {
    if (!$('schedule-conflict-modal')?.hidden) {
      closeConflictModal(true);
      return true;
    }
    if (!$('schedule-delete-modal')?.hidden) {
      closeDeleteModal();
      return true;
    }
    if (!$('schedule-modal')?.hidden) {
      closeScheduleModal();
      return true;
    }
    return false;
  }

  bindEvents();

  function resetSchedulesState() {
    schedules = [];
    exceptions = [];
    editingContext = null;
    pendingConflictAction = null;
    pendingDeleteOccurrence = null;
    closeConflictModal(false);
    closeDeleteModal();
    closeScheduleModal();
    renderScheduleWorkspace();
  }

  return {
    loadSchedules,
    resetSchedulesState,
    render: renderScheduleWorkspace,
    refreshSubjects: populateSubjectDropdown,
    closeOpenModalsOnEscape,
    getSchedulesState: () => ({ schedules, exceptions, viewMode, selectedDate }),
  };
}
