# Week 5 — Authentication Technical Decision

**Team:** DJ Barut  
**Project:** Smart Study Companion  
**Week:** 5  
**Date:** 2026-10-03  
**Owner:** Nabin Khadka  
**Status:** [x] Complete [  ] Pending review  

---

## Overview

This document records the technical decision on authentication and user account management for the Smart Study Companion MVP. The decision was made after evaluating multiple approaches against project constraints, scope boundaries, and MVP feasibility.

---

## Question under investigation

**Should the MVP include user authentication and login, or use browser-based anonymous access?**

The Smart Study Companion MVP stores data in `localStorage` without a backend server. This raises the question: do we need login, accounts, and user identification for our smallest useful version?

---

## Options evaluated

| Option | Approach | Backend needed | Session/account persistence | Complexity | Recommended for MVP? |
|---|---|---|---|---|---|
| **Option 1: No authentication** | Users access the app anonymously; data is stored per browser/device in `localStorage` | No | Data persists per browser, lost if user clears browser storage | Low | **YES** |
| **Option 2: Simple email/password login** | User creates account, authenticates with email and password; data is stored server-side | Yes (required) | Data persists across devices and browsers if logged in | High | No — blocks MVP |
| **Option 3: Third-party OAuth** | User logs in via Google, GitHub, or similar; data synced to third-party backend | Yes (required) | Data persists if OAuth provider account exists | High | No — adds dependency |
| **Option 4: Local username (client-side)** | User enters a username; app stores data under that username in `localStorage` without authentication | No | Data is tied to username and browser; user can "switch" by entering different username | Medium | No — adds confusion |

---

## Technical decision: No authentication required for MVP

We have decided to **launch the MVP without login or user authentication**. Users access Smart Study Companion anonymously, and all data is stored in the browser's `localStorage`.

### Reasoning

1. **Tech stack matches**: We committed to React + Vite + `localStorage` in Week 3. Adding authentication requires a backend server, which is out of scope.

2. **MVP boundary**: User accounts and login are explicitly listed in the Week 3 Sprint 0 report as **out-of-scope** for the MVP. The core value is organizing study tasks and taking quizzes, not managing accounts.

3. **Simplicity**: A no-auth MVP is faster to build and demo. We can focus on the subject/task/quiz workflow.

4. **Feasibility for demonstration**: The midterm demo will run on a single device with one browser session. Login adds no value for a single-user demo.

5. **Clear scope boundary**: Postponing authentication keeps the MVP boundary clear and makes the path to add accounts later (in Sprint 6–8 or a final-demo phase) straightforward.

---

## Data persistence model (without authentication)

Since we are not implementing login, data will persist in three scenarios:

| Scenario | How it works | User expectation |
|---|---|---|
| **Normal use** | User opens app, creates subjects/tasks, marks tasks complete. Data is saved to `localStorage`. | "My study plan is saved in this browser." |
| **Page refresh** | User reloads the page or closes and reopens the browser tab. Data is restored from `localStorage`. | "My subjects and tasks are still here." |
| **Browser data cleared** | User clears browser history, cookies, or storage. `localStorage` is deleted. | Data is lost; app returns to empty state. |
| **Different browser or device** | User opens the app in a different browser or on a different device. | Data is not synced; each browser has its own independent copy. |

### Test evidence

- **[localStorage persistence test](../week4/test-reports/localStorage-persistence-test.md)** — Confirms that subjects, tasks, and quiz results survive a page reload.
- **[Storage persistence check fixture](../week2/storage-check-subject-task.html)** — Standalone test that exercises `localStorage` write and read for subjects and tasks.

---

## Implications and constraints

### What works with this decision

- ✅ Simple to implement: No server, no session management, no database.
- ✅ Fast iteration: Feature work can focus on UI, quiz logic, and state management.
- ✅ MVP demo: One researcher or team member can demo the app on one device.
- ✅ Scope clarity: Separates MVP from future multi-user or cloud-sync features.

### What does **not** work with this decision

- ❌ Multi-device sync: A user's study plan is specific to one browser/device. Adding a task on a phone will not show on a desktop.
- ❌ Account recovery: If a user clears their browser storage, all data is lost. There is no server backup.
- ❌ Sharing data: Users cannot share study plans or quiz results with classmates or instructors.
- ❌ Later-semester use: After the MVP demo, adding login would require restructuring the data layer.

---

## Future path: Adding authentication

When the project moves beyond the MVP (Sprint 6 or later), login can be added by:

1. **Implementing a backend server** (Node.js + Express, Django, or similar) with a database (MongoDB, PostgreSQL, etc.).
2. **Adding user login** with email/password or OAuth (Google, GitHub, etc.).
3. **Migrating `localStorage` data** to the server, either automatically or with a user import flow.
4. **Syncing across devices** once server state is the source of truth.

This work would be significant, but it is explicitly planned for a later phase and does not block the MVP.

---

## Related decisions and links

| Decision | Status | Link |
|---|---|---|
| Tech stack (React + Vite + `localStorage`) | Approved in Week 3 | [Tech Stack Comparison](../week3/tech-stack-comparison.md) |
| Smallest useful version scope | Defined in Week 2 | [Design Doc v1](../week2/design-doc-v1.md), [Sprint 0 Report](../week3/sprint-0-report.md) |
| In/out of scope | Defined in Week 2 | [Sprint 0 Report — Project Snapshot](../week3/sprint-0-report.md#project-snapshot) |
| `localStorage` persistence check | Completed in Week 2 | [Storage Persistence Check](../week2/storage-check.md) |
| `localStorage` test evidence | Completed in Weeks 2–4 | [localStorage Persistence Test](../week4/test-reports/localStorage-persistence-test.md) |

---

## Sign-off

| Role | Student | Confirmation | Date |
|---|---|---|---|
| Project coordinator | Nabin Khadka | Approved | 2026-10-03 |
| Documentation lead | J.N. Taj Oli | Reviewed | 2026-10-03 |
| Build/quality lead | Sumit Adhikari | Approved | 2026-10-03 |

---

## Honesty note

This decision is firm for the MVP because it aligns with our approved tech stack and scope. If instructor feedback or a new constraint requires user accounts before the midterm demo, this document will be updated with a recovery plan and the decision will be revisited with the team.

For now, "no authentication" is the **cleanest and fastest path to a working, demostrable MVP**.
