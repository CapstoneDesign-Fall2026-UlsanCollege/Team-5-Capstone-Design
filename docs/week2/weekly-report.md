# Weekly Report

**Team:** DJ Barut  
**Week:** 2  
**Date:** 2026-09-17 (updated after design-document review)

Use this template in Weeks 2-3, 5-14, and 16. Weeks 1, 4, and 15 have special reports.

## This week's goal

Choose one project direction for Smart Study Companion, define what is in and out of scope, agree on the smallest useful version and the user flow, and reduce the main uncertainties before Week 3.

## What we committed to do

- [✅] Choose a primary direction and a backup idea in the idea-selection table.
- [✅] Write and update Design Doc v1 with the project purpose, scope, smallest useful version, user flow, requirements, data model, risks, and demo scenarios.
- [✅] Create one investigation Issue per member and link the available evidence.
- [✅] Record team decisions about scope, user flow, storage, and risk.
- [✅] Add an individual receipt for every member in this report.

## Evidence links

If it is not linked, it does not count.

| Evidence | Link |
|---|---|
| Issue(s) | [Nabin Issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/6), [Sumit Issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/5), [Prince Issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/3), [Prabin Issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/4), [J.N. Taj Oli Issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/2) |
| PR(s) / commits | [Design document update commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/8efa9670b52f41c8f0218961d9e2704a511d93c6) |
| Screenshot / demo | [User Flow Diagram](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/0b3e6eaf8c119bdbc936059bbabf11ba8e5084ab/week-02/User%20Flow%20Sketch.jpg) |
| Test/check note | [Storage persistence check](storage-check.md) |
| Document update | [Design Doc v1](design-doc-v1.md), [Idea Selection Table](idea-selection-table.md), [Individual Evidence Receipts](individual-evidence-receipt1.md) |

## Individual receipts

| Student | What they did | Evidence link |
|---|---|---|
| Nabin Khadka | Investigated where the demo stores data and compared localStorage, a JSON file, and Firebase. | [Issue #6](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/6) |
| Sumit Adhikari | Investigated the MVP front-end approach and compared plain HTML/CSS/JavaScript with React + Vite. | [Issue #5](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/5) |
| Prince Karki | Compared existing study-planner and quiz apps to confirm which features are needed. | [Issue #3](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/3) |
| Prabin Rai | Investigated manual quiz question entry versus a reusable question bank. | [Issue #4](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/4) |
| J.N. Taj Oli | Investigated whether reminders belong in the MVP, compared in-app reminders with postponing them, and updated the Design Doc and Weekly Report. | [Issue #2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/2) |

## Blockers or risks

| Blocker/risk | Owner | Next action |
|---|---|---|
| Storage choice affects the stack decision from Week 3. | Nabin Khadka | Bring the localStorage test result to the stack comparison. |
| Quiz question authoring could become slow to build. | Prabin Rai | Confirm manual question entry for the MVP. |
| AI features could increase the project scope. | Team | Complete and test the core manual workflow before implementing AI generation. |
| Reminder timing and notification behavior may be difficult to test. | J.N. Taj Oli | Keep reminders as a post-MVP/stretch feature until the core MVP is stable. |

## Decision record

Record only decisions that change scope, approach, ownership, or the next plan.

| Decision | Why we chose it | Owner | Evidence / Issue link |
|---|---|---|---|
| Scope: reminders and notifications are in the project scope but are not required for the MVP. | A reminder system adds scheduling and notification behavior that is not necessary to prove the core planner and quiz workflow. | J.N. Taj Oli | [Issue #2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/2) |
| Scope: AI-generated study plans and AI-generated quiz questions are post-MVP features. | The team must first complete and validate the manual study-task and quiz workflow. | Team | [Design Doc v1](design-doc-v1.md) |
| User flow: Start → Create subject → Add study task and deadline → Review study plan → Mark task completed → Take quiz → View score. | This flow demonstrates the smallest useful version from subject creation through quiz results. | Team | [User Flow Diagram](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/0b3e6eaf8c119bdbc936059bbabf11ba8e5084ab/week-02/User%20Flow%20Sketch.jpg) |
| Approach: keep MVP data local provisionally. | localStorage survives a browser refresh without server or account setup, while Firebase adds setup and network dependencies. | Nabin Khadka | [Storage persistence check](storage-check.md), [Issue #6](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/6) |
| Quiz authoring: prefer manual question entry for the MVP. | Manual entry proves the complete create quiz → answer → score journey with less implementation work than a reusable question bank. | Prabin Rai | [Issue #4](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/4) |

## Uncertainty check

**Question:** Will quiz and task data survive a browser refresh in a local-first MVP?

**Check:** A small HTML test using `localStorage` added a subject and task, reloaded the page, and read the data back. See [storage-check.md](storage-check.md).

**Result:** The test successfully preserved the subject and task data after refreshing the browser. The data was still available after reload.

**Decision / next action:** We will use localStorage as the provisional storage approach for the MVP. We will confirm the final technology stack during the Week 3 stack comparison.

## Next week's bridge task

- Turn the chosen user flow and scope into small implementation Issues for Week 3.
- Use the investigation findings in the technology-stack comparison.
- Confirm the final front-end approach and storage approach.
- Refine the rough screens into wireframes.
- Complete any remaining investigation evidence and teammate responses.
- Keep the core MVP ahead of AI generation and reminder features.
