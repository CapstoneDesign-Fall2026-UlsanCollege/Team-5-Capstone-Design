<div align="center">

# Smart Study Companion

### A browser-based study planner prototype for subjects, tasks, deadlines, completion tracking, and quiz practice.

[![Capstone](https://img.shields.io/badge/Capstone-Fall%202026-2563EB)](docs/README.md)
[![Prototype](https://img.shields.io/badge/Prototype-Frontend%20Available-16A34A)](Frontend/index.html)
[![Docs](https://img.shields.io/badge/Docs-Week%206%20Ready-9333EA)](docs/README.md)
[![Storage](https://img.shields.io/badge/Storage-localStorage-0F766E)](docs/tests/README.md)

[Open Prototype](Frontend/index.html) ·
[Wireframes](Frontend/wireframes/index.html) ·
[Documentation](docs/README.md) ·
[Project Status](docs/PROJECT_STATUS.md) ·
[Week 6 Evidence](docs/Week6/README.md)

</div>

---

## Overview

Smart Study Companion is Team 5's Fall 2026 capstone project. The product goal is simple: help a student choose a subject, plan study tasks, track completion, and practice with a short quiz in one visible flow.

This repository currently contains documentation, wireframes, and a runnable browser prototype. The prototype in `Frontend/` is plain HTML, CSS, and JavaScript. It is useful for demonstrating the study flow and `localStorage` behavior, while the selected long-term frontend direction remains React + Vite unless the team records a new decision.

## MVP Experience

| Step | Student action | Current repository evidence |
|---|---|---|
| 1 | Create or select a subject | Available in [`Frontend/index.html`](Frontend/index.html) |
| 2 | Add a study task and deadline | Available in [`Frontend/index.html`](Frontend/index.html) |
| 3 | Review the study plan | Available in the prototype and [wireframes](Frontend/wireframes/index.html) |
| 4 | Mark work complete | Available in the prototype |
| 5 | Take a quiz | Available in the prototype |
| 6 | View score feedback | Available in the prototype |

AI question generation, reminders, login, backend services, cloud sync, and user accounts are outside the current MVP scope.

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

The team's selected target remains a React + Vite frontend that stores MVP data in the browser. The repository also includes a runnable plain HTML/CSS/JavaScript prototype in `Frontend/`, with wireframes in `Frontend/wireframes/`. This prototype is not the React + Vite implementation, and there is no backend service.

For the proposed screen flow and state model, see the [Week 3 report](docs/week3/week-03.md), [architecture sketch](docs/week3/architecture-sketch.md), and [wireframe notes](docs/week3/wireframe-notes.md).

## Run the Project

Open [`Frontend/index.html`](Frontend/index.html) in a web browser to run the prototype; no build step is required. The wireframe index is [`Frontend/wireframes/index.html`](Frontend/wireframes/index.html). The prototype stores data in the browser's `localStorage`. The separate storage fixtures are documentation evidence, and the documented app-level persistence test remains to be run.

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

- The current frontend is a plain HTML/CSS/JavaScript prototype, not the selected React + Vite implementation.
- Instructor approval for the selected React + Vite + `localStorage` stack is still tracked as a blocker.
- The app-level persistence test and React screen screenshots are pending the React implementation.
- Week 5 API, authentication, and database notes need to stay clearly separated from the currently selected no-backend MVP unless a decision changes.

---

<div align="center">

**Capstone Design · Fall 2026 · Ulsan College · Team 5**

[Documentation](docs/README.md) ·
[Week 5 Worklist](docs/week5/WEEK_5_WORKLIST.md)

</div>
