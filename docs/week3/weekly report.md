# Weekly Report

**Team:** DJ Barut  
**Week:** Week 3  
**Date:** 2026-09-23

Use one shared report per team in Weeks 2-3, 5-14, and 16. Do not create a separate Weekly Report for each student. Weeks 1, 4, and 15 have special reports. Each student must add their own contribution row.

## This week's goal

What did your team try to improve this week?

> This week our team focused on launching the project by clarifying the product scope, confirming the MVP direction, and preparing the Sprint 0 evidence package. We finalized the Smart Study Companion MVP direction, documented the core user flow, and completed the Week 3 launch materials needed for Sprint 1.

## What we committed to do

- [x] Confirm the project purpose, target user, and initial scope for the app.
- [x] Compare the candidate tech stack and choose the MVP approach.
- [x] Prepare the Sprint 0 report and supporting evidence, including issues and owners.
- [x] Document the candidate vertical slice and next-step risks for Sprint 1.
- [x] Add an individual contribution row for every student.
- [x] Add a checkable Definition of Done for a quiz or study-plan task.

## Evidence links

If it is not linked, it does not count.

| Evidence | Link |
|---|---|
| Issue(s) | [Issue #3 — Shared study-planner and quiz features](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/3), [Issue #18 — Study plan](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/18), [Issue #15 — Create wireframes for main screens](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/15) |
| PR(s) / commits | [Repository commits](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commits/main) |
| Screenshot / demo | [Sprint 0 Report](sprint-0-report.md) |
| Test/check note | [Sprint 0 Report](sprint-0-report.md) |
| Document update | [Week 3 Docs](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/main/docs/week3) |
| Chuseok checkpoint issue | [Week 4 Chuseok Checkpoint report](../week4/chuseok-checkpoint.md) |

## Individual contribution entries — one row per student

Keep this section inside the single shared team report. Each student must enter their own row: one sentence describing the contribution and at least one evidence link. Add rows if your team has more than five students.

| Student | What they did | Evidence link |
|---|---|---|
| liftupkhadka555-spec | Helped define the MVP scope, contributed to the project direction, and was assigned ownership for the first set of Sprint 1 issues in the initial issue breakdown. | [Sprint 0 report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week3/sprint-0-report.md) |
| Adronnie | Contributed to problem framing and risk planning for the MVP, and owns the technical risk around localStorage persistence and state reliability during the first implementation phase. | [Architecture sketch](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week3/architecture-sketch.md) |
| DJ Barut | Coordinated the Week 3 launch activities, reviewed the draft Sprint 0 deliverables, and tracked the pending instructor approval for the selected React + Vite + localStorage stack. | [Sprint 0 report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week3/sprint-0-report.md) |
| princekark | Compared the shared features of study-planner and quiz apps, recommended subjects, tasks, deadlines, quizzes, and scores for the MVP, and identified the risk that an upcoming-task list might be confusing without a calendar. | [Issue #3](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/3) |
| J.N. Taj Oli | Updated the shared project documentation, refined the architecture and Sprint 0 evidence links, reviewed the Week 3 report, and linked the Chuseok checkpoint evidence with exact commit references for the project files. | [Week 3 report update commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/7d8eaf06269d02e66cc01b3611f97fd56ee98f8d), [Contribution row update commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/487d20f6d63e5f18a288f82cc6b515449bec04bb), [Architecture sketch update commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/59d8f6a263ce2393d7cabd1c257dc6f81319663e), [Sprint 0 report update commit](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/5557757abbb766292ee4b736c6aece9f170c2c96) |

## Checkable quiz/study-plan Definition of Done

The following completion check is linked to the assigned quiz work in [Issue #19](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/19):

- [ ] Open the Programming quiz.
- [ ] Answer every multiple-choice question.
- [ ] Click **Submit**.
- [ ] Verify that the result shows the number of correct answers and the total number of questions.
- [ ] Verify that the displayed score matches the selected answers, including a test with at least one incorrect answer.

The equivalent study-plan check in [Issue #18](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/18) is: add two tasks, complete one, refresh the page, and verify the completed state persists.

## Blockers or risks

| Blocker/risk | Owner | Next action |
|---|---|---|
| Instructor approval for the selected React + Vite + localStorage stack is still pending. | Team DJ Barut | Ask for confirmation and record any required changes before Sprint 1 implementation begins. |
| State persistence and localStorage reliability could cause incorrect subject/task data updates if not tested early. | Adronnie | Build and test the initial subject/task save and reload flow before expanding the UI. |
| The upcoming-task list could be confusing without a calendar grid. | princekark | Walk a teammate through the deadline-sorted list and record whether the upcoming tasks are understandable. |

## Decision record

Record only decisions that change scope, approach, ownership, or the next plan.

| Decision | Why we chose it | Owner | Evidence / Issue link |
|---|---|---|---|
| Selected React + Vite + localStorage as the MVP stack. | It supports a simple frontend-only study planner with fast iteration and fits the project scope for the midterm prototype. | Team DJ Barut | [Issue #1](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/1), [Issue #8](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/8) |
| Kept the project in scope for a focused study management MVP. | This reduces risk and keeps the team aligned on the vertical slice for the midterm demo. | Team DJ Barut | [Candidate Vertical Slice](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week3/candidate-vertical-slice.md) |
| Kept subjects, tasks, deadlines, quizzes, and scores; postponed calendars, timers, advanced analytics, and sharing. | These features represent the shared core found in study-planner and quiz app investigations. | Team DJ Barut | [Issue #2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/2), [Issue #3](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/3) |

## Next week's bridge task

- Set up the React + Vite project and initialize the app skeleton.
- Validate the basic subject/task save and reload flow using localStorage.
- Start Sprint 1 work on the first vertical-slice feature set with clear issue owners.
- Run the quiz and study-plan Definition of Done checks and link the results to Issues #18 and #19.

