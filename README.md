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

## Current Evidence Dashboard

| Week | Focus | Evidence status | Link |
|---|---|---|---|
| Week 1 | Project launch and team agreement | Recorded | [Week 1 docs](docs/week1/README.md) |
| Week 2 | Scope, user flow, and storage fixture | Recorded | [Week 2 docs](docs/week2/README.md) |
| Week 3 | Candidate vertical slice and wireframes | Recorded | [Week 3 docs](docs/week3/README.md) |
| Week 4 | Checkpoint and stack decision | Recorded | [Week 4 docs](docs/week4/README.md) |
| Week 5 | Vertical-slice worklist and manual test plan | Recorded, app-level result pending | [Week 5 docs](docs/week5/README.md) |
| Week 6 | Independent tested-by evidence package | Prepared, real result pending | [Week 6 docs](docs/Week6/README.md) |

Week 6 should stay marked as pending until the team records who tested the feature, what they expected, what actually happened, and a proof link such as a screenshot, demo, PR, or commit.

## Run the Prototype

Open [`Frontend/index.html`](Frontend/index.html) in a browser. No build step is required.

The prototype stores study data in browser `localStorage`. To reset the demo state, clear the browser storage for the page or use a fresh browser profile.

## Documentation

| Area | Purpose |
|---|---|
| [Documentation hub](docs/README.md) | Main navigation for all project records |
| [Project status](docs/PROJECT_STATUS.md) | Ready, pending, blocked, and out-of-scope items |
| [Docs roadmap](docs/DOCS_ROADMAP.md) | Week 1-16 documentation plan |
| [Contribution ledger](docs/CONTRIBUTION_LEDGER.md) | Member contribution rows and evidence links |
| [Testing docs](docs/tests/README.md) | Manual testing strategy and evidence links |
| [Demo guide](docs/demo/README.md) | Midterm and final demo evidence checklist |
| [Decision log](docs/decisions/README.md) | Stack, auth, API, database, and scope decisions |
| [Handoff guide](docs/handoff/README.md) | Setup notes, known limits, and maintainer guidance |

## Team

| Member | Current documented focus |
|---|---|
| Nabin Khadka | Project direction, setup coordination, and launch evidence |
| Sumit Adhikari | Frontend flow, visual structure, and prototype support |
| Prince Karki | Research, storage notes, and technical documentation support |
| Prabin Rai | Evidence organization, testing notes, and documentation polish |
| J.N. Taj Oli | Team documentation support and weekly evidence review |

Contribution rows should be updated when a member adds a commit, PR, issue update, screenshot, demo, or tested-by note.

## Current Limitations

- The current runnable prototype is plain HTML/CSS/JavaScript, not a React + Vite implementation.
- The Week 6 independent tested-by result is prepared but not filled in.
- Screenshot or video proof should be linked only after it exists.
- Week 5 API, authentication, and database notes are planning references, not proof that backend features are implemented.

---

<div align="center">

**Capstone Design · Fall 2026 · Ulsan College · Team 5**

[Documentation](docs/README.md) ·
[Prototype](Frontend/index.html) ·
[Week 6 Evidence](docs/Week6/README.md)

</div>
