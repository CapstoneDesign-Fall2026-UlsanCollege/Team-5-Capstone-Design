# Week 03

**Contributor:** RaiPrabin697
**Project:** Smart Study Companion
**Team:** DJ Barut

## Week 03 Goal

Make the first visible user interaction of Smart Study Companion clear, and connect it to state/flow evidence. The React application does not exist yet, so the work this week is to define the first screen, the state transitions it depends on, and to check those transitions with a runnable test fixture.

## First Visible Screen or Interaction

The first screen is the **Subject Detail / Study Plan screen for one subject**. It is the first place the user sees saved data returned from the app.

Project-specific flow, taken from the candidate vertical slice in [candidate-vertical-slice.md](candidate-vertical-slice.md):

```text
App Start
→ Study Plan (subject list)
→ User selects the "Programming" subject
→ Subject Detail / Study Plan screen
```

| Step | What the user sees or does | Visible result |
|---|---|---|
| App Start | App opens with an empty or single-subject state; no data is loaded yet | An empty state message: no subjects yet |
| Study Plan | The user sees their subject(s) as a selectable list | `Programming` appears as a row |
| User selects an item | The user clicks the `Programming` row | The selected subject is highlighted |
| Subject Detail | The detail screen loads only that subject's data | The screen shows `Programming` with its two tasks and their deadlines, e.g. `Read chapter 1 — 2026-09-30` |

This screen is the first observable user flow because it is the earliest point where a user action produces a visible, stored change. It depends on two state transitions already defined in [architecture-sketch.md](architecture-sketch.md): subject selection, and task/completion state belonging to the selected subject.

## State / Flow

| Field | Value |
|---|---|
| **Initial State** | Study Plan — subject list contains `Programming`; no subject is selected |
| **Action** | User selects the `Programming` subject row |
| **Next State** | Subject Detail / Study Plan screen for `Programming`, showing its two tasks with deadlines |
| **Second action** | User marks `Read chapter 1` as completed |
| **Next State** | That task row shows a completed status, and the completed value is written to the data layer |
| **Third action** | User reloads the page |
| **Next State** | The selected subject, its tasks, and the completed status are restored from the data layer |

The final reload transition is the one that matters most: it proves the screen is driven by stored state rather than by in-memory values that disappear on refresh.

## State / Flow Test Evidence

### Evidence found in this repository

| Evidence | Link | What it covers |
|---|---|---|
| State/flow test fixture (subject → task → completion → quiz score → reload) | [prabin-state-flow-test.md](prabin-state-flow-test.md) | Checks all four transitions, including that the completed task and quiz result survive a reload |
| Subject/task persistence fixture | [persistence-test.md](persistence-test.md) → [storage-check-subject-task.html](../week2/storage-check-subject-task.html) | Checks that a subject and its task survive a page refresh |
| Core data model for the subject detail state | [architecture-sketch.md](architecture-sketch.md) | Defines the `subjects` / `tasks` / `quizResults` shape the screen reads |
| Screen structure for the flow | [wireframe-notes.md](wireframe-notes.md), [wireframe sketch.png](<wireframe sketch.png>) | Wireframes for the main screens |
| App structure and midterm flow | [Issue #16](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/16) | Owner-assigned Issue covering the first flow |
| Quiz authoring comparison feeding the flow | [Issue #4](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/4) | Manual entry versus question bank, decided in Week 2 |
| Quiz validation note | [../tests/quiz-validation.md](../tests/quiz-validation.md) | Expected score-calculation behaviour for the quiz step |

### What the existing evidence does and does not prove

The two fixtures are standalone browser pages, not the React application. They prove that browser `localStorage` holds the intended subject/task/completion/score shape across a reload. They do **not** prove the React component state wiring, because the app does not exist yet. This limitation is recorded in [persistence-test.md](persistence-test.md).

### Status: Pending

No React application code exists in this repository, so the following still needs to be linked once the app is running:

1. A screenshot of the Study Plan subject list showing the `Programming` row.
2. A screenshot of the Subject Detail / Study Plan screen after selecting `Programming`.
3. A screenshot of a task row after it is marked completed.
4. A reload result from the running app showing the completed task still marked completed — this is the check that the visible screen reflects stored state.
5. A link to the app commit or pull request that implements the subject selection action.

Until those are linked, the screen and flow above are a **defined, testable target** rather than a demonstrated result.

## Expected Week 03 Result

```text
Study Plan (subject list)
→ User selects the "Programming" subject
→ Subject Detail / Study Plan screen shows its two tasks with deadlines
```

This is the first observable user flow. Success means a user can open the app, see a subject, select it, and see that subject's task data with correct completion state — including after a page refresh.

## Current Status

| Item | Status | Basis |
|---|---|---|
| First visible screen defined (Subject Detail / Study Plan) | Completed | Documented in this file and in [candidate-vertical-slice.md](candidate-vertical-slice.md) |
| State transitions documented | Completed | Documented above and in [architecture-sketch.md](architecture-sketch.md) |
| Data model for the screen | Completed | [architecture-sketch.md](architecture-sketch.md) |
| State/flow test fixture | Completed | [prabin-state-flow-test.md](prabin-state-flow-test.md) |
| localStorage persistence for subject + task | Completed | [persistence-test.md](persistence-test.md) |
| Wireframes for the flow | Completed | [wireframe-notes.md](wireframe-notes.md) |
| React app running and showing the screen | Pending | No application code in this repository |
| Screenshot of the running screen | Pending | Requires the app |
| Reload check on the running app | Pending | Requires the app |
| Instructor approval of React + Vite + localStorage stack | Pending | Recorded as a blocker in [weekly report.md](<weekly report.md>) |

## Related documentation

- [Sprint 0 report](sprint-0-report.md) — sprint exit summary and owned risks
- [Week 3 weekly report](<weekly report.md>) — shared team report and contribution entries
- [Tech stack comparison](tech-stack-comparison.md) — why React + Vite + localStorage
- [Architecture sketch](architecture-sketch.md) — components and data model
- [Wireframe notes](wireframe-notes.md) — screen-by-screen structure
- [Candidate vertical slice](candidate-vertical-slice.md) — the scope this screen belongs to
