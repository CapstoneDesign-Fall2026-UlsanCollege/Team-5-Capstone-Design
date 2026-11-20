# AI Tutor UI/UX Design Specification — Future Feature Proposal

**Project:** Smart Study Companion — Team 5, Capstone Design, Fall 2026 (Ulsan College)  
**Repository:** [Team-5-Capstone-Design](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design)  
**Document type:** UI/UX design specification  
**Status:** **DESIGN ONLY — NOT IMPLEMENTED; DEFERRED FROM THE MVP FEATURE FREEZE**  
**View target (proposed):** `#view-assistant` (`href="#assistant"`, `data-view="assistant"`)

> This document records a proposed AI Tutor experience. It does not assert that the assistant view, navigation link, database schema, API endpoint, quota, or interactions exist in the application. The feature was deferred from the Week 11 MVP freeze; see [FEATURE_FREEZE_DECISION.md](../week_11/FEATURE_FREEZE_DECISION.md) and the [AI Study Assistant Integration Plan](../week_10/ai-integration-plan.md). Do not add it to the frozen MVP without team approval.

---

## 1. Purpose and Scope

The proposed AI Tutor offers subject-aware study explanations, guided practice, and links to existing task and quiz workflows. This specification describes its intended visual system, layout, interaction states, and accessibility requirements for possible post-MVP implementation.

### In scope for this proposal

- A responsive tutor workspace with conversation history, subject context, mode selection, and a message composer.
- Optional web-search grounding with visible source citations.
- Reply actions for feedback, copying, saving notes, and starting a practice quiz.
- Entry points from study tasks and quiz results.

### Not implemented or approved by this specification

- A production `#view-assistant` route or sidebar link.
- AI service calls, API credentials, streaming, quota enforcement, or live quota values.
- `ai_conversations`, `ai_messages`, `ai_saved_notes`, or quota tables and their RLS policies.
- Web search, citations, feedback persistence, saved-note persistence, or quiz prefill behavior.

Any implementation requires the security, cost, data-model, and verification work described in the linked integration plan. API keys must remain server-side.

---

## 2. Visual Design System

The proposed view reuses the existing CSS custom properties in [`public/styles.css`](../../public/styles.css) and the application's existing typography. Values below document the current token definitions; they are not new tokens.

| CSS token | Light mode | Dark mode | Proposed use |
| :--- | :--- | :--- | :--- |
| `--bg` | `#f3eee4` | `#0c1214` | Conversation canvas |
| `--bg-elev` | `rgba(255, 251, 244, 0.78)` | `rgba(22, 32, 34, 0.78)` | History drawer, reply cards, composer |
| `--ink` | `#1c1915` | `#f4efe6` | Message text and headings |
| `--muted` | `#6b6458` | `#b3aaa0` | Supporting text, timestamps, counters |
| `--line` | `rgba(28, 25, 21, 0.1)` | `rgba(244, 239, 230, 0.1)` | Borders and dividers |
| `--teal` / `--teal-soft` | `#0f766e` / `#d7efe8` | `#2dd4bf` / `rgba(45, 212, 191, 0.12)` | User bubbles, selected mode, primary send action |
| `--gold` | `#c27803` | `#fbbf24` | Citation and saved-note accents; low-quota caution |
| `--coral` | `#c2410c` | `#fb7185` | Error and exhausted-quota states |
| `--font` / `--display` | `"Outfit"` / `"Fraunces"` | `"Outfit"` / `"Fraunces"` | UI and message text / display headings |
| `--radius` | `22px` | `22px` | Elevated workspace cards |

Use the existing Font Awesome 6.4.0 setup for icons. Avoid introducing a separate palette or typography system.

---

## 3. Proposed Application Integration

If the feature is approved and implemented after the MVP freeze, add a navigation item after **Quiz Practice** in `public/index.html`:

```html
<a href="#assistant" class="nav-link" data-view="assistant">
    <i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>
    AI Tutor
</a>
```

Add a sibling view container inside `<main class="shell">`:

```html
<div id="view-assistant" class="canvas" hidden>
    <!-- Proposed AI Tutor workspace -->
</div>
```

The snippets are integration proposals only. Before implementation, confirm the SPA router's route conventions, navigation behavior, and existing automated-test assumptions; preserve existing view IDs and behavior.

---

## 4. Layouts

### 4.1 Desktop (`>= 1024px`)

```text
+--------------------+--------------------------------------------------------------+
| StudySmart         | AI Tutor       [Subject v]       [Quota status, if available] |
| (280px sidebar)    +-----------------------+--------------------------------------+
|                    | + New Study Chat      | Mode: [Explain] [Socratic] [Exam]    |
| > Dashboard        |                       | [Summarize]          [ ] Web Search  |
| > Study Tasks      | PINNED                +--------------------------------------+
| > Subjects         | * Graph BFS vs DFS    |                                      |
| > Study Analytics  |                       | User message                         |
| > Quiz Practice   | RECENT CHATS          |                                      |
| * AI Tutor (future)| - SQL 3NF Practice   | Tutor reply card                     |
|                    | - OS Deadlocks        | 1. Core intuition                    |
| [Up next card]     | - Midterm Review      | 2. Counterexample / worked example  |
| [Profile + Theme]  |                       | 3. Quick-check question              |
|                    | SAVED NOTES           | Sources, when web search is enabled  |
|                    | > Revision Bookmarks  | [Helpful] [Not helpful] [Copy]       |
|                    |                       | [Save note] [Turn into quiz]         |
|                    |                       +--------------------------------------+
|                    |                       | [Follow-up prompt chips]             |
|                    |                       | [Ask about the selected subject...]  |
|                    |                       | [Character count]             [Send] |
+--------------------+-----------------------+--------------------------------------+
```

The quota value is intentionally shown as status-dependent rather than a hard-coded `24 / 30`: no live assistant quota is implemented, and any displayed limit must come from the approved server-side quota policy.

### 4.2 Mobile (`< 768px`)

```text
+------------------------------------------+
| [=] AI Tutor       [Chats]     [Subject v]|
+------------------------------------------+
| [Explain] [Socratic] [Exam] [Summarize]  |  horizontally scrollable mode strip
| Context: selected subject · quota status |
+------------------------------------------+
|                                          |
|             Conversation feed            |
|  Full-width cards; code/math can scroll   |
|  Copy controls remain reachable          |
|                                          |
+------------------------------------------+
| [Web Search: Off]       [Turn into Quiz] |
| +--------------------------------------+ |
| | Type a study question...      [Send] | |
| +--------------------------------------+ |
+------------------------------------------+
```

The **Chats** control opens a slide-over conversation drawer. The drawer must be keyboard-operable and close on `Esc`. The mode strip scrolls horizontally without trapping vertical page scrolling.

---

## 5. Proposed Components and Interactions

### 5.1 Tutor modes

| Mode | Proposed key | Behavior |
| :--- | :--- | :--- |
| Explain (default) | `explain` | Explain intuition, then give a step-by-step breakdown and a worked example. |
| Socratic | `socratic` | Offer progressive hints and guiding questions before revealing a full answer. |
| Exam Prep | `exam_prep` | Highlight common traps, edge cases, complexity or rubric considerations, and a self-check. |
| Summarize | `summarize` | Provide a concise bullet-point revision sheet. |

Mode selection is a design intention. Persistence and server-side prompt behavior need to be specified during implementation.

### 5.2 Context anchors

- **Subject selector:** Intended to use the student's enrolled subjects plus a **General Study** option. Populate it from the authenticated user's authorized data, not a client-trusted list.
- **Linked task:** An optional, removable context chip, for example `Linked Task: ER Diagram Assignment · Due Nov 23`. Task context should be limited to data necessary for the request.
- **Web search:** Per-chat opt-in, off by default. When enabled and supported, display sanitized, verified source links beneath the relevant reply. Do not imply that citations are verified until the service actually supplies and validates them.

### 5.3 Assistant reply actions

- **Helpful / Not helpful:** Record usefulness as `1` / `-1` only after a persistence design and privacy policy are approved.
- **Copy:** Copy the reply as clean Markdown, preserving code and math content where feasible.
- **Save study note:** Save a reply tagged with the active subject only after an authorized storage model and RLS policies exist.
- **Turn into practice quiz:** Navigate to the existing quiz view and prefill subject/topic only if the quiz flow supports a safe, validated handoff.

Icon-only buttons require accessible names; visible text labels are preferred where space allows.

---

## 6. Empty, Loading, Quota, and Error States

### Empty state

Use a Fraunces heading such as **“What are we mastering today?”**, show the selected subject context, and offer three optional starter prompts, for example:

- “Review weak topics from my latest quiz”
- “Break down my nearest deadline”
- “Oral drill on today's subject”

Only show prompts that can be fulfilled with available, authorized application data.

### Loading state

Show an assistant-card skeleton and a **“Tutor is thinking…”** status. Disable duplicate submissions while a request is pending, preserve the user's draft, and expose status updates to assistive technology.

### Quota state

Quota counts and reset times must be provided by the server; do not hard-code the wireframe's `24 / 30` example.

- More than five requests remaining: teal-toned informational badge.
- One to five remaining: gold caution badge.
- No requests remaining: coral badge, disable sending, and show the server-provided reset notice.

These thresholds are proposed UI behavior only and must match the eventual quota policy.

### Service error state

For unavailable endpoints or rate limits, display a non-blocking inline message, for example: **“AI Tutor is temporarily unavailable. Your draft is preserved below.”** Distinguish application quota exhaustion from upstream service errors; do not assume every `404` or `429` has the same cause. Retain the draft and avoid automatic retry loops.

---

## 7. Proposed Entry Flows

1. **Direct navigation:** Open the proposed AI Tutor view, select a subject and mode, ask a question, then continue with follow-up prompts or save a note if supported.
2. **Study task:** An **Ask AI Tutor** action may open the view with an authorized `subject_id` and optional `linked_task_id` context.
3. **Quiz results:** An **Explain missed concepts in AI Tutor** action may open the view with the quiz subject and a bounded missed-topic prompt.

These entry points are not currently promised by this design document as implemented functionality. Validate access control, data minimization, and the receiving view's handling of deep links before enabling them.

---

## 8. Accessibility Requirements

- **Keyboard:** `Enter` sends; `Shift + Enter` inserts a newline; `Esc` closes the mobile conversation drawer. Provide visible focus styles and ensure controls follow a logical tab order.
- **Screen readers:** Use a polite live region for reply/status updates. Add descriptive `aria-label` values to icon-only controls (including pin, archive, delete, helpful, and not helpful). Do not rely on color alone for selected, quota, or error states.
- **Touch:** Interactive targets should be at least `44 × 44px` on viewports below `768px`.
- **Content:** Keep text resizable, preserve sufficient contrast in both themes, and allow horizontal scrolling for long code or math without forcing the whole page to overflow.
- **Motion:** Respect `prefers-reduced-motion` for shimmer and drawer transitions.

---

## 9. Implementation Readiness Checklist

Before this proposal becomes product work, the team should:

- Revisit the Week 11 feature-freeze decision and obtain explicit scope approval.
- Complete the prerequisites and security decisions in the AI Study Assistant integration plan, including authenticated server-side requests, private key storage, quota enforcement, and RLS.
- Approve the conversation, message, citation, feedback, and saved-note data model (if persistence is required).
- Define the source of quota counts and reset times and verify that UI states match server responses.
- Confirm router, quiz-prefill, and task/quiz deep-link contracts without breaking existing views.
- Add automated tests for routing, keyboard/accessibility behavior, draft preservation, quota/error states, and user-data isolation.
- Verify the design at desktop and mobile breakpoints in both light and dark themes.

Until these gates are met, this file remains a design proposal and must not be used as evidence that the AI Tutor is implemented or verified.
