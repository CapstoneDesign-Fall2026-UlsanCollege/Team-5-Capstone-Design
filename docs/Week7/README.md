# Sprint 2 Plan — Smart Study Companion

**Team:** Team 5  
**Term:** Fall 2026  
**Sprint:** 2  
**Status:** Planned for current repository state

This sprint is based on the current working prototype in the repo:

- [Frontend prototype](../../Frontend/index.html)
- [Frontend logic](../../Frontend/app.js)
- [Frontend styling](../../Frontend/styles.css)
- [Project documentation hub](../README.md)

The app already demonstrates a complete student flow: create a subject, add study tasks with deadlines, review the plan, mark tasks complete, and take a mixed-topic quiz. Sprint 2 should focus on polishing that flow, fixing weak points, and making the prototype feel production-ready enough for midterm/demo validation.

---

## 1. Sprint Goal

Turn the current browser prototype into a more reliable, polished MVP by improving the core study-plan workflow, strengthening the quiz/user feedback loop, and cleaning up usability issues that affect demo confidence.

### Primary outcome
The team should be able to show a clear end-to-end path:

1. Choose or create a subject
2. Add a study task with a deadline
3. Review the plan and filter tasks
4. Mark work complete
5. Take a quiz for the selected subject or mixed-topic review
6. See a score and understand the result
7. Refresh the page and still see the saved state

---

## 2. Current Repository Evidence

The repo already contains a working prototype and supporting materials:

- Subject creation and task entry are implemented in [Frontend/app.js](../../Frontend/app.js)
- Study-plan rendering, filtering, and completion toggles are implemented in [Frontend/app.js](../../Frontend/app.js)
- Quiz logic and result flow are implemented in [Frontend/app.js](../../Frontend/app.js)
- Styling and layout are defined in [Frontend/styles.css](../../Frontend/styles.css)
- The project overview and MVP scope are described in [README.md](../../README.md)
- Weekly project documentation is tracked in [docs/README.md](../README.md)

### Already working
- Creating subjects
- Adding tasks with deadlines
- Viewing tasks by subject and status
- Marking tasks complete/incomplete
- Deleting tasks and subject chips
- Mixed-topic quiz with score calculation
- Browser localStorage persistence
- Theme switch and responsive layout

### Gaps to fix in Sprint 2
- Some UX flows still feel rough during real use
- Error and empty states should be clearer
- Quiz flow could better support subject-based practice
- The app needs stronger validation and data consistency checks
- The prototype should be easier to demo and easier to test by a peer

---

## 3. Sprint Scope

### Must-have work

| Priority | User story | Deliverable | Relevant files |
|---|---|---|---|
| P0 | As a student, I want to add and edit tasks reliably | Clean task creation, editing, and deletion flow | `Frontend/app.js`, `Frontend/index.html` |
| P0 | As a student, I want to manage my study plan clearly | Better filters, grouping, overdue state, and empty states | `Frontend/app.js`, `Frontend/styles.css` |
| P0 | As a student, I want meaningful quiz feedback | Subject-aware or mixed-topic quiz with clearer score summary | `Frontend/app.js`, `Frontend/index.html` |
| P0 | As a student, I want my data to survive refreshes | Stable localStorage handling and validation | `Frontend/app.js` |
| P0 | As a presenter, I want the app to be easy to demo | Cleaner layout, faster onboarding, clearer labels | `Frontend/styles.css`, `Frontend/index.html` |

### Should-have work

| Priority | User story | Deliverable |
|---|---|---|
| P1 | As a student, I want to see overdue work and next tasks at a glance | Priority dashboard improvements |
| P1 | As a tester, I want predictable behaviors in edge cases | Empty-state, invalid-input, and duplicate-subject handling |
| P1 | As a user, I want a calmer visual experience | Better spacing, hierarchy, and color consistency |
| P1 | As a team, I want a repeatable demo flow | Short scripted demo path and test notes |

### Stretch goals

| Priority | User story | Deliverable |
|---|---|---|
| P2 | Subject-specific quiz generation | Quiz questions filtered by chosen subject |
| P2 | Better progress tracking | Completion percentage breakdown by subject |
| P2 | Refactor toward maintainable structure | Small cleanup for readability and structure |

---

## 4. Detailed Backlog

### A. Task management and data reliability

**Goal:** Make the study planner behave consistently under normal use.

Tasks:
- Validate empty or duplicated subject names.
- Prevent invalid task names and blank deadlines.
- Improve edit behavior so the updated task remains consistent with the UI.
- Confirm the delete and confirm-modal workflow is clear and reliable.
- Ensure task persistence and reload behavior remain correct after repeated edits.

**Acceptance criteria:**
- A user cannot create a blank subject or task.
- Editing a task updates the correct data and view immediately.
- Deleting a task or subject leaves the plan in a valid state.
- Refreshing the page keeps all saved tasks and subjects intact.

### B. Study-plan UX polish

**Goal:** Improve usability and reduce confusion in the plan view.

Tasks:
- Improve filtering by all/pending/completed states.
- Show stronger overdue and progress indicators.
- Add clearer empty states for no tasks, no matches, and no subjects.
- Improve subject grouping and card hierarchy.
- Make the plan area easier to navigate for demo viewers.

**Acceptance criteria:**
- A user can filter by status and subject without confusion.
- Overdue and pending tasks are visually emphasized.
- Empty states explain what the user should do next.
- The plan remains readable on laptop and smaller screens.

### C. Quiz experience

**Goal:** Make the quiz feel like a meaningful learning checkpoint instead of a static mock.

Tasks:
- Improve quiz setup experience and label clarity.
- Ensure answer selection and next-step flow are easy to understand.
- Add better feedback after submission, including score summary.
- Consider subject-based quiz selection as a follow-up improvement.
- Keep the flow simple enough for demonstration without backend data.

**Acceptance criteria:**
- A user can start a quiz, answer questions, and submit without confusion.
- The final score is clear and easy to read.
- The quiz summary explains the number correct and remaining mistakes.
- The flow works without errors from a fresh localStorage state.

### D. Demo and validation readiness

**Goal:** Make the prototype easy to test and present.

Tasks:
- Create a short script for the demo user journey.
- Document expected behavior before testing.
- Run a peer test with a teammate who did not build the feature.
- Record a screenshot or proof of the passing flow.
- Note any bugs found and assign a fix owner.

**Acceptance criteria:**
- One teammate can run the full demo path with the written instructions.
- The team has evidence of at least one real end-to-end test.
- Bugs or unclear behaviors are recorded as issues or notes.

---

## 5. Recommended Team Split

| Member | Focus area |
|---|---|
| Nabin Khadka | Project coordination, sprint tracking, demo readiness |
| Sumit Adhikari | Frontend UX improvements, bug fixes, UI polish |
| Prince Karki | Validation, test flow, issue follow-up |
| Prabin Rai | Evidence, testing notes, documentation |
| J.N. Taj Oli | Documentation support and review |

This can be adjusted if the team wants to assign tasks more directly around front-end editing and QA.

---

## 6. Definition of Done

Sprint 2 is complete when all of the following are true:

- The subject-task-plan flow works consistently in the browser.
- The app clearly handles empty states and invalid input.
- Quiz feedback is understandable and usable.
- One real peer test has been recorded.
- Documentation reflects the current state honestly.
- The team can explain what is proven in the current prototype and what remains out of scope.

---

## 7. Risks and Assumptions

### Risks
- The project is currently a browser-only prototype, not a full backend app.
- Some of the proposed improvements may be blocked by the team’s chosen stack direction.
- Long-term React migration may conflict with immediate polish work if not clarified.

### Assumptions
- Sprint 2 focuses on the current repository state rather than a full backend implementation.
- The app remains a localStorage-based prototype for this sprint.
- The team is optimizing for usability and demo readiness over large architectural changes.

---

## 8. Expected Result by End of Sprint

By the end of Sprint 2, the team should have:

- a cleaner and more reliable prototype,
- stronger evidence for a tested end-to-end student flow,
- a clearer demo script,
- and a documented update showing what is already working and what still needs future work.

This aligns with the project’s current direction and makes the repository stronger for the next milestone.

---

## 9. Related Files

- [README.md](../../README.md)
- [docs/README.md](../README.md)
- [Frontend/index.html](../../Frontend/index.html)
- [Frontend/app.js](../../Frontend/app.js)
- [Frontend/styles.css](../../Frontend/styles.css)
- [docs/Week6/WEEKLY_REPORT.md](../Week6/WEEKLY_REPORT.md)

If needed, this sprint plan can be expanded into a team worklist or a GitHub issue breakdown after the team agrees on the final priorities.
