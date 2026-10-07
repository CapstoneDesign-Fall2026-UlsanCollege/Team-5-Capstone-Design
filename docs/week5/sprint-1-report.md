# Sprint 1 Report — Vertical Slice Kickoff and Technical Definition

**Team:** Team 5  
**Project:** Smart Study Companion  
**Sprint:** Sprint 1 — Vertical Slice Kickoff  
**Date:** 2026-10-07  
**Status:** [x] Ready with explicitly owned exceptions  

---

## Sprint 1 outcome

During Week 5, the team transitioned from product definition into the first implementation planning phase for the midterm vertical slice. The key accomplishment was aligning on one small and testable user path: creating a subject, adding study tasks with deadlines, and validating that the data persists after refresh using the approved React + Vite + localStorage stack.

The team produced several design and planning documents covering architecture, API structure, database modeling, authentication scope, project work tracking, and persistence validation planning. These documents make the intended MVP clearer and give clear ownership for the next technical work.

The main exception is that the runnable application and browser-level verification were still pending at the end of Week 5. The project has strong documentation and design clarity, but it still needs a working app branch to complete the actual vertical-slice proof.

---

## Scope and chosen user path

The Week 5 worklist and supporting documents establish the Sprint 1 slice as:

- Create a subject
- Add one or more study tasks with deadlines
- View the tasks under the selected subject
- Refresh the page
- Confirm the same subject and tasks remain available after refresh

This was chosen because it is the smallest realistic end-to-end demo path that proves the project value without expanding scope too early.

The evidence across the Week 5 documents is consistent:

- The stack remains React + Vite + localStorage
- The MVP stays frontend-only and anonymous
- No user login is included for the midterm slice
- SQLite is treated as the local development database model, with PostgreSQL kept as a future production target

---

## What Week 5 documents establish

### 1. Architecture and setup
The architecture document sets the project direction:

- Frontend: React + Vite
- Backend: Python + FastAPI or Flask
- Database: SQLite for MVP, PostgreSQL later
- Core flow: create subject -> add tasks -> complete task -> answer quiz -> save progress

It also documents the expected project structure and local setup steps, even though the actual app source was not fully running in the main branch.

### 2. API design
The API design document defines the MVP endpoints for:

- subjects
- tasks
- study plans
- quizzes
- quiz results

The design remains intentionally simple and REST-oriented. It keeps the data model clean, supports future growth, and matches the project scope without adding server-side authentication or a complex backend layer.

### 3. Database design (Local Storage)
The database design document defines a relational model centered on:

- User (future-oriented)
- Subject
- StudyTask
- StudyPlan
- Quiz
- Question
- AnswerChoice
- QuizResult
- StudentAnswer (optional/future analytics)
- Notification (future feature)

It clearly states that the MVP should be lightweight and simple, with SQLite as the local testing database and PostgreSQL as the later production target. The schema is consistent with the subject/task/quiz flow and supports clear task tracking and quiz scoring.

### 4. Authentication decision
The authentication technical decision is explicit: the MVP will not include login or user accounts. This is a deliberate product decision based on:

- the current tech stack
- the scope definition from Sprint 0
- the need to keep the first vertical slice small and demo-friendly
- the expectation that a single-user local workflow is enough for the midterm demonstration

This document also clarifies the tradeoff: the app will run anonymously in browser storage, and data will not sync across devices unless the product is redesigned later.

### 5. Persistence validation preparation
The persistence test document defines a usable browser-level verification procedure. It tells the team to:

- create a subject named "Persistence Test"
- add a task with a deadline
- refresh the page
- confirm the task remains visible
- check the browser console for errors

This is the exact proof intended for the visible-slice validation. It also notes that the test is currently blocked by the absence of a runnable app branch.

### 6. Week 5 work checklist
The worklist shows the Sprint 1 task breakdown with ownership:

- Project setup
- Subject and task UI
- localStorage integration
- Persistence test execution
- Documentation and reporting

This makes the work concrete and assignable. It also names the risks and next actions for each track.

### 7. Tested-by note
The tested-by note defines the exact criteria for claiming that the visible slice works. It is written as an evidence checklist for a teammate other than the author to validate the flow independently.

This is an important quality-control artifact because it turns a verbal claim into a repeatable test procedure.

---

## Week 5 progress analysis

### Completed or substantially prepared

The following work is clearly complete in the documentation sense:

- Sprint 1 slice and proof path are defined
- Architecture and project setup are documented
- API contract is written in enough detail for implementation
- Database schema is designed and reviewed
- Authentication scope is decided and documented
- Persistence test steps are prepared
- Team ownership and responsibilities are assigned

### Still pending in reality

The following items were not yet verified in the working application:

- runnable React + Vite app startup
- subject creation UI
- task creation UI
- localStorage save/load wiring
- actual browser refresh persistence validation
- screenshot or video evidence for the visible slice
- teammate validation using the tested-by note

This means Week 5 produced strong planning and design artifacts, but the application-level proof was still pending at the end of the sprint.

---

## Risks and owned exceptions

| Risk or exception | Owner | Status / next action |
| --- | --- | --- |
| App is not yet runnable on a real branch | Nabin Khadka / Team | Complete project setup and validate startup first |
| Subject/task UI implementation is still in progress | Sumit Adhikari / Nabin Khadka | Build forms and list components |
| localStorage persistence wiring is not yet proven in app | Prince Karki / J.N. Taj Oli | Connect save/load logic and verify refresh behavior |
| Persistence test is prepared but not yet executed | Prabin Rai | Run the actual browser test once app is runnable |
| Documentation is ready but needs evidence link cleanup | J.N. Taj Oli | Add verified screenshots and commit references |

---

## Sprint 1 decision

The Week 5 sprint should be treated as a successful technical preparation phase with explicit implementation exceptions, not a complete end-to-end proof phase.

The team did the following correctly:

- clarified the MVP slice
- locked the technical stack
- documented the architecture
- aligned the API and data design
- set ownership for implementation
- prepared validation steps before coding was complete

The central risk is not design confusion; it is that the actual app build and persistence proof have not yet been demonstrated. Until that is completed, the team must avoid claiming that the vertical slice is fully working.

---

## Final check

- [x] The chosen slice is defined and aligned with the MVP.
- [x] The technical stack decision is documented and consistent.
- [x] Architecture, API, and database design are prepared.
- [x] Authentication scope is deliberately set to no-login for MVP.
- [x] A persistence test procedure exists for the feature.
- [x] Team ownership is assigned for implementation tasks.
- [ ] The app is runnable and validated on a real branch.
- [ ] The subject/task persistence proof is shown in browser testing.
- [ ] The tested-by note is completed by a teammate other than the author.
- [ ] Evidence links (screenshots/video/commit refs) are captured and attached.

---

## Sprint 1 final summary

Week 5 was a strong planning and design sprint for Smart Study Companion. The team moved from general product thinking into technical scoping and implementation readiness. The project documents show that the team understands the user value, the stack, the data model, and the validation target.

However, the sprint should be considered complete only at the point where the actual app is running and the subject/task persistence flow is confirmed in the browser. The remaining work is still clearly defined and owned, and the next milestone is to convert the Week 5 planning into a working, demonstrated vertical slice.

