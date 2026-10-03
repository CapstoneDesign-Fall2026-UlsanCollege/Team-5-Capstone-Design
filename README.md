<div align="center">

# Smart Study Companion

### A college study planner and quiz project for organizing subjects, study tasks, and deadlines.

[![Capstone Project](https://img.shields.io/badge/Capstone-Fall%202026-2563EB)](docs/README.md)
[![Project Stage](https://img.shields.io/badge/Stage-Planning%20%2F%20Early%20Slice-D97706)](docs/week5/WEEK_5_WORKLIST.md)

[Documentation](docs/README.md) ·
[Week 5 Worklist](docs/week5/WEEK_5_WORKLIST.md) ·
[Team](#team)

</div>

---

## Overview

Smart Study Companion is a Capstone Design project for college students who want one simple place to organize coursework and prepare for quizzes. The planned MVP brings subjects, study tasks, deadlines, task completion, and multiple-choice quiz scores into one study flow.

The project is being developed by Team 5 at Ulsan College for Fall 2026. The repository currently records project planning, user flows, design decisions, test fixtures, and Week 5 implementation work. **The `main` branch does not yet contain the application source code.**

> **Current status:** The team has selected React + Vite with browser `localStorage` for the MVP. Instructor approval is still recorded as a blocker. The app-level subject/task persistence test is prepared but has not been run.

## Planned MVP Experience

The intended student flow is:

1. Create or select a subject.
2. Add study tasks and deadlines.
3. Review the study plan.
4. Mark a task complete.
5. Take a multiple-choice quiz.
6. View the calculated score.

| Capability | Planned behavior | Current evidence |
|---|---|---|
| Subjects | Create and select a course subject | Screen and flow are documented; application UI is pending |
| Study tasks | Add a task with a deadline under a subject | Data and user flow are documented; application UI is pending |
| Study plan | Review tasks and completion state | Wireframe and state transitions are documented |
| Quiz | Answer multiple-choice questions and view a score | Validation expectations are documented; application flow is pending |
| Persistence | Keep subject and task state after refresh | Standalone browser fixtures exist; React app behavior has not been tested |

AI question generation, reminders, login, cloud storage, and backend services are outside the current MVP scope.

## Technology Direction

| Area | Team decision | Status |
|---|---|---|
| Frontend | React + Vite | Selected by the team; instructor approval pending |
| MVP storage | Browser `localStorage` | Selected by the team; instructor approval pending |
| Backend and external services | None for the MVP | Explicitly out of scope in the Week 4 checkpoint |

The Week 5 API, authentication, and database notes should be read as proposals unless the team records an approved change to the MVP decision. See the [Week 4 checkpoint](docs/week4/chuseok-checkpoint.md) for the current decision and blocker.

## Progress and Evidence

| Milestone | Work recorded so far | Evidence |
|---|---|---|
| Week 1 — project launch | Project direction, five candidate ideas, and team working agreement | [Week 1 documentation](docs/week1/README.md) |
| Week 2 — scope and research | Design Doc v1, user-flow sketch, investigation receipts, and a standalone storage check | [Week 2 documentation](docs/week2/README.md) |
| Week 3 — first user flow | Subject Detail / Study Plan screen, state transitions, wireframes, architecture notes, and state/flow test evidence | [Week 3 report](docs/week3/week-03.md) |
| Week 4 — checkpoint | Team stack decision and the app-setup dependency for real persistence testing | [Week 4 checkpoint](docs/week4/chuseok-checkpoint.md) |
| Week 5 — vertical slice | Subject/task slice, implementation worklist, and a repeatable persistence test procedure | [Week 5 worklist](docs/week5/WEEK_5_WORKLIST.md) · [Persistence test procedure](docs/week5/week-05-prabin-rai.md) |

### Evidence Boundaries

The Week 2 and Week 3 storage fixtures are standalone browser pages. They check the planned sample data across a page refresh, but **they do not demonstrate persistence in a React application**. The application-level test remains **Not run** until the app is available. See the [test procedure and status](docs/week5/week-05-prabin-rai.md).

## Architecture

The current target is a React + Vite frontend that stores MVP data in the browser. The planned data includes subjects, study tasks, completion state, and quiz results. The repository contains design and data-model notes, but no application components or running service on `main` yet.

For the proposed screen flow and state model, see the [Week 3 report](docs/week3/week-03.md), [architecture sketch](docs/week3/architecture-sketch.md), and [wireframe notes](docs/week3/wireframe-notes.md).

## Run the Project

There is no application source or verified local run command on `main` yet. Setup instructions will be added after the scaffold is committed and the team verifies that another member can run it. The standalone storage fixtures are documentation evidence, not a runnable version of the application.

## Documentation

| Start here | Purpose |
|---|---|
| [Documentation index](docs/README.md) | Navigate all project and course records |
| [Week 1](docs/week1/README.md) | Launch report, project ideas, and team agreement |
| [Week 2](docs/week2/README.md) | Scope, design, research receipts, and storage fixture |
| [Week 3](docs/week3/README.md) | Stack comparison, wireframes, architecture, and candidate slice |
| [Week 4](docs/week4/README.md) | Chuseok checkpoint and current stack decision |
| [Week 5](docs/week5/WEEK_5_WORKLIST.md) | Vertical-slice worklist and implementation ownership |
| [Test plan and status](docs/week5/week-05-prabin-rai.md) | Subject/task refresh test steps, expected results, and current status |

## Team

| Team member |
|---|
| Nabin Khadka |
| Sumit Adhikari |
| Prince Karki |
| Prabin Rai |
| J.N. Taj Oli |

## Current Limitations

- The `main` branch has no application source code, so the product cannot be run from this branch yet.
- Instructor approval for the selected React + Vite + `localStorage` stack is still tracked as a blocker.
- The app-level persistence test, React screen screenshots, and demo evidence are pending the implementation.
- Week 5 API, authentication, and database notes need to stay clearly separated from the currently selected no-backend MVP unless a decision changes.

---

<div align="center">

**Capstone Design · Fall 2026 · Ulsan College · Team 5**

[Documentation](docs/README.md) ·
[Week 5 Worklist](docs/week5/WEEK_5_WORKLIST.md)

</div>
