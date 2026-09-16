# Weekly Report

**Team:** DJ Barut
**Week:** 2
**Date:** 2026-09-15 (updated end-of-class + homework)

Use this template in Weeks 2-3, 5-14, and 16. Weeks 1, 4, and 15 have special reports.

## This week's goal

Choose one project direction for Smart Study Companion, define what is in and out of scope, agree on the smallest useful version and the user flow, and reduce the main uncertainties before Week 3.

## What we committed to do

- [✅] Choose a primary direction and a backup idea (idea-selection-table).
- [✅] Write Design Doc v1 sections 1-6 and 9 with a 3-5 step user flow.
- [✅] Create one investigation Issue per member (5 Issues) and link evidence.
- [✅] Record three team decisions (scope, user flow, approach/risk) + one uncertainty check.
- [✅] Add an individual receipt for every member in this report.

## Evidence links

If it is not linked, it does not count.

| Evidence | Link |
|---|---|
| Issue(s) | Investigation Issues:[Issues](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues) |
| PR(s) / commits | Not applicable this week — planning work |
| Screenshot / demo | [User Flow Diagram](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/0b3e6eaf8c119bdbc936059bbabf11ba8e5084ab/week-02/User%20Flow%20Sketch.jpg) |
| Test/check note | [Storage persistence check](storage-check.md) |
| Document update | [Design Doc v1](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/e9186887b603608a61af22d18c1020c6e68737f3/week-02/design-doc-v1.md), [Idea Selection Table](idea-selection-table.md) |

## Individual receipts

| Student | What they did | Evidence link |
|---|---|---|
| Nabin Khadka | Investigated where the demo stores data; compared localStorage vs JSON file vs Firebase | [Issue#6](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/6) + [storage note](storage-check.md) |
| Sumit Adhikari | Investigated the MVP front-end approach; compared plain HTML/CSS/JS vs React + Vite | [Issue#5](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/5) |
| Prince Karki | Compared existing study-planner and quiz apps to confirm which features are needed | [Issue#3](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/3) |
| Prabin Rai | Investigated how a student should create a quiz (manual entry vs reusable question bank) | [Issue#4](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/4) + [User Flow Diagram](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/0b3e6eaf8c119bdbc936059bbabf11ba8e5084ab/week-02/User%20Flow%20Sketch.jpg) |
| J.N. Taj Oli | Investigated whether reminders belong in the MVP; compared in-app reminders vs postponing; updated the Design Doc and Weekly Report | [Issue#2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/2) + [Design Doc v1](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/e9186887b603608a61af22d18c1020c6e68737f3/week-02/design-doc-v1.md) |

## Blockers or risks

| Blocker/risk | Owner | Next action |
|---|---|---|
| Storage choice affects the stack decision from Week 3 | Nabin Khadka | Bring localStorage test result to stack comparison |
| Quiz question authoring could become slow to build | Prabin Rai | Confirm manual question entry for the MVP |
| Reminder scope not fully agreed | J.N. Taj Oli | Re-check against MVP contract in Week 9 |
| Evidence links use guessed Issue numbers | J.N. Taj Oli | Replace with real Issue links before submitting |

## Decision record

Record only decisions that change scope, approach, ownership, or the next plan.

| Decision | Why we chose it | Owner | Evidence / Issue link |
|---|---|---|---|
| Scope: reminders/notifications postponed, out of scope for MVP | We compared including in-app reminders vs postponing. A reminder system adds scheduling and notification behavior that is not needed to prove the core planner + quiz journey. | J.N. Taj Oli | [Issue#2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/2) + Design Doc v1 section 5 |
| User flow: Start → Create subject → Add task + deadline → Mark task completed → Take quiz → View score | We compared this flow with a dashboard-first flow. The chosen 5-step journey ends in a visible result (score) and matches the smallest useful version. | Prabin Rai | [User Flow Diagram](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/0b3e6eaf8c119bdbc936059bbabf11ba8e5084ab/week-02/User%20Flow%20Sketch.jpg) + [Design Doc v1](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/d2232d85d4dcafed3607ac2d93d9accc5b12c0c8/week-02/design-doc-v1.md) |
| Approach: keep MVP data local (provisional) | We compared localStorage vs a JSON file vs Firebase. localStorage survives a browser refresh with zero server code; Firebase adds accounts and setup we don't need yet. Confirm in Week 3 stack comparison. | Nabin Khadka | [Issue#6](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/6) + [storage-check.md](storage-check.md) |

## Uncertainty check (homework item 2)

**Question:** Will quiz and task data survive a browser refresh in a local-first MVP?

**Check:** Small HTML test using `localStorage` — add a subject, reload the page, and read it back. See [storage-check.md](storage-check.md).

**Result:** *Fill in after running the test — expected: data is still present after reload; success/failure both count as evidence.*

**Decision / next action:** Depends on result — if persistence works, keep localStorage; otherwise reopen Issue #2 and reconsider.

## Next week's bridge task

- Turn the chosen user flow and scope into small implementation Issues for Week 3.
- Use the investigation findings in the tech-stack comparison.
- Refine the rough screens into wireframes.
