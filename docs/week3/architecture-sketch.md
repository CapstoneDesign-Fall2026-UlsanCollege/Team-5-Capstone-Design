# Architecture Sketch

**Team:** DJ Barut

**Project:** Smart Study Companion

**Last updated:** Week 3

## One-sentence architecture

This project uses:

**Frontend:** React + Vite  
**Backend:** None for MVP  
**Data:** localStorage for subjects, tasks, deadlines, completion status, and quiz results  
**External services:** None for MVP

## System overview

```text
                         ┌────────────────────┐
                         │      Student        │
                         └─────────┬──────────┘
                                   │
                                   ▼
                    ┌────────────────────────────┐
                    │ Smart Study Companion UI   │
                    │   React + Vite Application │
                    └────────────┬─────────���─────┘
                                 │
                 ┌───────────────────┼───────────────────┐
                 │                   │                   │
                 ▼                   ▼                   ▼
      ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
      │ Subject Manager  │  │ Task Planner     │  │ Study Progress   │
      │ - Create subject │  │ - Add tasks      │  │ - View plan      │
      │ - Save subject   │  │ - Set deadlines  │  │ - Mark complete  │
      └─────────┬────────┘  └─────────┬────────┘  └─────────┬────────┘
                │                        │                        │
                └────────────────────────┼────────────────────────┘
                                         │
                                         ▼
                        ┌────────────────────────────┐
                        │       Data Layer           │
                        │ localStorage / browser     │
                        │ - subjects                 │
                        │ - tasks                    │
                        │ - deadlines                │
                        │ - completion state         │
                        │ - quiz data                │
                        └─────────────┬──────────────┘
                                      │
                                      ▼
                             ┌──────────────────┐
                             │ Quiz Feature     │
                             │ - MCQ questions  │
                             │ - Score result   │
                             └──────────────────┘
```

## Main parts

| Part | What it does | Owner | Risk / uncertainty |
|---|---|---|---|
| UI / Frontend | Displays subjects, tasks, the study plan, quiz screens, and results | Nabin55 | Keep the interface simple and easy to understand |
| Data | Stores subjects, tasks, deadlines, completion status, and quiz data in localStorage | Adronnie | Data may be lost if browser storage is cleared |
| Logic / React | Handles creating subjects, adding tasks, updating completion, and calculating quiz scores | Prince | State and localStorage updates must stay consistent |
| Setup / Docs | Project setup, issue tracking, documentation, and architecture updates | Nabin55 | Maintain clear documentation as the app grows |

## Key interactions

1. A student creates or selects a subject.
2. They add study tasks with deadlines.
3. The app saves the information in localStorage.
4. The study plan loads saved tasks and shows completion status.
5. The student marks a task as complete.
6. The student answers a short multiple-choice quiz.
7. The app calculates the score and displays the result.
8. The updated state remains saved in the browser.

## Evidence links

- GitHub repository: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design
- Project issues: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues
- Project board: https://github.com/orgs/CapstoneDesign-Fall2026-UlsanCollege/projects
- Architecture sketch: docs/week3/architecture-sketch.md

## Important decisions

| Decision | Why we chose it | Risk |
|---|---|---|
| React + Vite | Helps organize the app into reusable UI components | Team members need time to learn React |
| localStorage | Provides a simple browser-based persistence layer for the MVP | Data is only stored on the device/browser |
| No backend | The MVP is a frontend-only prototype and does not require a server | Future features may require a backend later |
| Study plan | Makes progress visible and helps students track deadlines and completion | Extra features could make the plan cluttered |
| Simple quiz | Meets the midterm demo goal without adding AI or backend complexity | More advanced quiz features may need follow-up work |

## What could break?

- localStorage data may be lost if the browser storage is cleared.
- React state and localStorage may get out of sync.
- Task completion status may not persist correctly.
- Quiz answers or scoring may be calculated incorrectly.
- Some team members may need more time to learn React.
- Extra features such as AI study plans or reminders may make the MVP too large.
- The project may become difficult to manage if components are not organized clearly.

## MVP approach

For the first working prototype, we will focus on:

1. Set up the React + Vite project
2. Create subjects and study tasks
3. Add task deadlines
4. Display the study plan
5. Mark tasks as completed
6. Add a short multiple-choice quiz
7. Calculate and show the quiz score
8. Save the full state using localStorage

We will keep the scope focused on the main workflow first and only add extra features after the core flow works reliably.
