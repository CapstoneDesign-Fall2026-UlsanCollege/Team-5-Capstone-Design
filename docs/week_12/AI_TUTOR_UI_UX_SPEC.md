# AI Tutor UI/UX Design Specification — Future Feature Proposal

**Project:** Smart Study Companion — Team 5
**Repository:** [Team-5-Capstone-Design](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design)  
**Document type:** UI/UX design specification  
**Status:** **DESIGN ONLY — NOT IMPLEMENTED; DEFERRED FROM THE MVP FEATURE FREEZE**  
**View target (proposed):** `#view-assistant` (`href="#assistant"`, `data-view="assistant"`)

Week 11 freeze deferred this feature. Week 12 is **NO-GO**. The integration plan’s `011_ai_study_assistant.sql` name is stale. The proposed slot is `supabase/migrations/013_ai_tutor.sql`, and it is not applied. Do not add it to the frozen MVP without team approval.

---

## 1. Purpose and Scope

Subject-aware explanations, follow-up chat, and links to tasks and quizzes. Uses the existing light and dark themes.

**In scope:** history, subject, mode, composer, optional web-search citations, feedback, copy, save note, practice-quiz handoff, and create, reload, pin, archive, and delete of the student’s own chats.

**Not implemented:** the route, sidebar link, Gemini calls, API key, streaming, live quota, `ai_conversations`, `ai_messages`, `ai_saved_notes`, `ai_usage_quotas`, RLS, citations, feedback, saved notes, and quiz prefill.

The API key stays server-side. The client sends the conversation id and the new message. The server loads prior turns.

---

## 2. Visual Design System

Reuse the tokens in [`public/styles.css`](../../public/styles.css). No new palette or type.

| Token | Proposed use |
| :--- | :--- |
| `--bg` | Conversation canvas |
| `--bg-elev` | History drawer, reply cards, composer |
| `--ink` / `--muted` | Message text / supporting text |
| `--line` | Borders |
| `--teal` | User bubbles, selected mode, Send |
| `--gold` | Citations, saved notes, low quota |
| `--coral` | Errors and exhausted quota |
| `--font` / `--display` | Outfit / Fraunces |
| `--radius` | `22px` cards |

Icons: existing Font Awesome 6.4.0.

---

## 3. Proposed Application Integration

After **Quiz Practice** in `public/index.html`:

```html
<a href="#assistant" class="nav-link" data-view="assistant">
    <i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>
    AI Tutor
</a>
```

Inside `<main class="shell">`:

```html
<div id="view-assistant" class="canvas" hidden>
    <!-- Proposed AI Tutor workspace -->
</div>
```

Preserve existing view ids and behavior.

---

## 4. Layouts

Breakpoints match [`public/styles.css`](../../public/styles.css).

- **Above 980px:** existing `280px` sidebar. History column (new chat, pinned, recent, saved notes) and a thread column (subject, quota, mode, web search, replies, follow-up chips, composer).
- **`max-width: 980px`:** existing off-canvas sidebar. Compact header: menu, Chats drawer, subject. Mode strip scrolls horizontally. Composer stays at the bottom.
- **Below 600px:** same narrow layout. The app already reduces heading size.

The Chats drawer closes on `Esc` and must be keyboard-operable. The mode strip must not trap vertical scrolling.

---

## 5. Proposed Components and Interactions

### 5.1 Tutor modes

| Mode | Key | Behavior |
| :--- | :--- | :--- |
| Explain (default) | `explain` | Intuition, steps, worked example |
| Socratic | `socratic` | Hints and questions before the full answer |
| Exam Prep | `exam_prep` | Traps, edge cases, self-check |
| Summarize | `summarize` | Short revision bullets |

One `tutor_mode` per conversation. It applies to later turns. Not approved for implementation.

### 5.2 Context anchors

- **Subject:** the student’s `student_subjects`, plus General Study (`subject_id` null). Use authorized data only.
- **Linked task:** optional chip. The task must belong to the student, and to the same subject when the chat has one. Send title and deadline only.
- **Web search:** off by default. Show `http` or `https` links only from that reply’s `citations` array.

### 5.3 Assistant reply actions

- **Helpful / Not helpful:** `feedback_rating` `1` / `-1` on that student’s assistant row. Content, role, and conversation id stay unchanged.
- **Copy:** reply as Markdown.
- **Save note:** copy the reply onto a note the student owns. Source ids, when stored, must be theirs. Deleting the chat keeps the copy.
- **Turn into quiz:** open the existing quiz view only through a validated subject and topic handoff.
- **Follow-up chips:** from that reply’s `suggested_actions`. A chip sends in the same conversation.

### 5.4 Conversation history

- **New chat:** owned by the student. Proposed title: `New Study Chat`.
- **Reload:** refresh loads that student’s chats and the open messages.
- **Pin / archive:** pin stays on top. Archive leaves Recent and stays available under Archived.
- **Delete:** confirm, then delete that student’s conversation and its messages.
- **Follow-up:** stays on the open conversation. The client does not send the old transcript.

---

## 6. Empty, Loading, Quota, and Error States

- **Empty:** Fraunces heading “What are we mastering today?”, the selected subject, and up to three starter prompts that authorized data can fulfill.
- **Loading:** reply skeleton, “Tutor is thinking…”, one request at a time, draft kept. Announce the status.
- **Composer:** cap **4,000** characters. Disable Send when empty or over the cap. The 20,000-character column limit is storage, not the composer cap.
- **Quota:** read `ai_usage_quotas` (`request_count`, `daily_limit`, `last_request_at`). Proposed default limit: **30**. Remaining = `daily_limit - request_count`. Under **5 seconds** since the last request, disable Send.
  - More than five left: teal.
  - One to five left: gold.
  - None left: coral, Send disabled, server reset time shown.
- **Errors:** keep the draft. Do not auto-retry. Use the server error code, not the HTTP status alone.
  - Daily cap: “Daily AI Tutor limit reached. Sending returns after the reset time below.”
  - Cooldown: “Please wait a few seconds before the next question.”
  - Upstream or missing function: “AI Tutor is temporarily unavailable. Your draft is preserved below.”

---

## 7. Proposed Entry Flows

1. **Navigation:** open AI Tutor, choose an enrolled subject or General Study and a mode, ask, then follow up in that chat.
2. **Task:** **Ask AI Tutor** may pass an authorized `subject_id` and the student’s own `linked_task_id`.
3. **Quiz results:** **Explain missed concepts in AI Tutor** may pass the quiz subject and a short missed-topic prompt. No quiz foreign key.

Refresh reloads the signed-in student’s chats. These entries are not implemented.

---

## 8. Accessibility Requirements

- `Enter` sends. `Shift + Enter` adds a line. `Esc` closes the Chats drawer.
- Polite live region for replies, quota, cooldown, and errors.
- Name icon-only controls: pin, archive, delete, helpful, not helpful.
- Do not use color alone for selected, quota, or error states.
- Targets at least `44 × 44px` at or below `980px`.
- Resizable text, both themes, horizontal scroll for long code or math.
- Honor `prefers-reduced-motion`.

---

## 9. Implementation Readiness Checklist

- Team approval to leave the Week 11 freeze.
- Week 12 P0 gates closed: live `DATA-01`, live `generate-ai-quiz`, Playwright, and all five sign-offs.
- Server-side JWT, private `GEMINI_API_KEY`, quota enforcement, and RLS.
- Approve `013` for chats, messages, citations, feedback, notes, and `ai_usage_quotas`. Do not reuse `011` or `012`.
- Quota badges, cooldown, and reset time come from the server. Composer cap is 4,000. Daily cap, cooldown, and upstream errors stay separate.
- Task and quiz handoffs do not change existing views.
- Tests cover routing, keyboard, draft retention, quota and errors, and two-student isolation.
- Check above `980px` and at `max-width: 980px`, in light and dark themes.

Until then, this file is a design proposal, not evidence that AI Tutor is implemented or verified.
