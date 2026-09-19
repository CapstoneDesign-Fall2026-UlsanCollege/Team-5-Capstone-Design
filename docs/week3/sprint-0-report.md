# Sprint 0 Report — Launch and Scope

**Team:** DJ Barut
**Project:** Smart Study Companion
**Sprint:** Sprint 0 — Launch and Scope
**Date:** 2026-09-23
**Status:** [ ] Ready to close  [x] Ready with an explicitly owned exception

---

## Sprint 0 outcome

The team is now ready to begin building the first working version of **Smart Study Companion** using **React + Vite + localStorage**. The project scope, candidate vertical slice, architecture, tech-stack decision, and initial build Issues have been defined so the team can begin implementation with a clear midterm target.

The remaining exception is **instructor approval of the selected tech stack**, which is still pending.

---

## Project snapshot

| Field                              | Current answer                                                                                                                                                                        | Evidence link              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **Project purpose**                | Smart Study Companion helps college students organize subjects, study tasks, deadlines, task completion, and simple quiz practice in one place.                                       | [Design Doc / README]      |
| **Target user**                    | College students who need a simple way to organize study tasks and prepare for exams.                                                                                                 | [Design Doc / README]      |
| **In-scope boundary**              | Create subjects, add study tasks with deadlines, view a study plan, mark tasks complete, take a simple multiple-choice quiz, calculate a quiz score, and save data with localStorage. | [Architecture Sketch]      |
| **Out-of-scope boundary**          | AI-generated study plans, AI-generated quiz questions, reminders/notifications, login/user accounts, mobile-app features, and backend services.                                       | [Candidate Vertical Slice] |
| **Possible midterm demo sentence** | Our midterm demo will show a student creating a Programming subject, adding two study tasks with deadlines, completing one task, taking a short quiz, and seeing the quiz score.      | [Candidate Vertical Slice] |

---

## Sprint 0 exit evidence

| Requirement                                                   | Evidence link                         | Status or short note                                                                                          |
| ------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Team repository and Project board work**                    | [GitHub Repository] / [Project Board] | **Complete / verify link** — Repository and project-management work are being organized in GitHub.            |
| **Team Working Agreement is linked and current**              | [Working Agreement]                   | **Complete / verify link** — Link the current team agreement before submission.                               |
| **Six to ten next-work Issues exist**                         | [GitHub Issues]                       | **Complete** — Six initial Issues have been created/planned for the next work.                                |
| **Important Issues have first owners**                        | [GitHub Issues]                       | **Complete** — Issues #1–#3: Nabin55; Issue #4: Adronnie; Issues #5–#6: Prince.                               |
| **At least three Issues have a checkable Definition of Done** | [GitHub Issues]                       | **Complete** — The three vertical-slice build Issues have checkable completion criteria.                      |
| **Tech stack comparison is recorded**                         | [Tech Stack Comparison]               | **Complete** — React + Vite + localStorage selected after comparison with HTML/CSS/JavaScript + localStorage. |
| **Rough wireframe placeholders are linked**                   | [Wireframe]                           | **Complete / verify link** — Link the Week 3 rough wireframe document or image.                               |
| **Rough architecture placeholder is linked**                  | [Architecture Sketch]                 | **Complete** — React + Vite → localStorage architecture documented.                                           |
| **Candidate vertical slice is linked**                        | [Candidate Vertical Slice]            | **Complete** — Midterm path is documented from subject creation through quiz score.                           |
| **Sprint 0 Quality Quick Checks are complete**                | [Quality Quick Checks]                | **Complete / verify** — Confirm the checklist is checked before closing Sprint 0.                             |
| **Week 3 Weekly Report is complete**                          | [Week 3 Weekly Report]                | **Complete / verify** — Link the final Weekly Report.                                                         |

---

## Candidate vertical slice

* **User or actor:** College student
* **Start state:** The student opens Smart Study Companion and has no Programming subject or study tasks created yet.
* **Smallest end-to-end path:** Create a Programming subject → add two study tasks with deadlines → view them in the study plan → mark one task complete → take a short multiple-choice quiz → see the calculated quiz score.
* **What the demo should prove:** The main study workflow works from creating study data through completing a task and checking quiz results, with the data saved using localStorage.
* **What is deliberately out of scope:** AI study plans, AI-generated quiz questions, reminders/notifications, login/accounts, mobile features, and backend services.
* **Evidence link:** [Candidate Vertical Slice]

---

## Risks and owned exceptions

| Risk or exception                                                                                  | Owner              | Next action                                                                             | Due or review point                     |
| -------------------------------------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------- | --------------------------------------- |
| React state and localStorage may not save and update subject, task, and completion data correctly. | **Adronnie**       | Test creating one subject and one task, refresh the page, and confirm the data remains. | **Before/at first implementation task** |
| Team members may need time to learn React components and state.                                    | **Nabin55 / Team** | Start with basic React components and state while implementing the first feature.       | **Week 4–5**                            |
| Instructor approval of React + Vite + localStorage is still pending.                               | **Team DJ Barut**  | Confirm the selected stack with the instructor and record any feedback.                 | **Next instructor checkpoint**          |
| Extra features such as AI or reminders could increase the project scope.                           | **Team DJ Barut**  | Keep the MVP focused on the documented vertical slice until the main workflow works.    | **Throughout implementation**           |

---

## Bridge into Week 4 and Sprint 1

* **Week 4 Chuseok Checkpoint Issue:** 
* **Rough sketch or photo link:** 
* **One blocker or question for Week 5:** Can the team implement the React + localStorage data flow cleanly enough to support subjects, tasks, completion status, and quiz results without adding unnecessary complexity?
* **First action after the break:** Set up the React + Vite project and implement the smallest data test: create one subject and one study task, save them to localStorage, refresh the page, and verify that the data remains.

---

## Final check

* [] Every evidence link resolves for a reader with team-repository access.
* [] The team can explain the project purpose, target user, scope boundary, and candidate slice.
* [] The next work is represented by small Issues with owners and checkable completion criteria.
* [] The team has not posted personal data, secrets, or unapproved real-user data.
* [] This report is linked from the team's Week 3 evidence or Weekly Report.
* [] Instructor approval of the selected tech stack has been checked or explicitly recorded as pending.

---

## Sprint 0 final decision

**Selected stack:** React + Vite + localStorage

**MVP architecture:** Frontend only; no backend or external services.

**Primary midterm workflow:**

```text
Create Subject
      ↓
Add Study Tasks + Deadlines
      ↓
View Study Plan
      ↓
Complete a Task
      ↓
Take Short Quiz
      ↓
Calculate Quiz Score
      ↓
Save Data with localStorage
```

**Sprint 1 starting point:**

 Build the smallest working version of the vertical slice, beginning with subject/task creation and the localStorage test.
