# Sprint 0 Report — Launch and Scope

**Team:** DJ Barut
**Project:** Smart Study Companion
**Sprint:** Sprint 0 — Launch and Scope
**Date:** 2026-09-23
**Status:** [ ] Ready to close  [x] Ready with an explicitly owned exception

---

## Sprint 0 outcome

During Sprint 0, our team clarified what we want to build and how we are going to approach the project. We decided to use **React + Vite + localStorage** for the MVP and defined a small workflow that we can work toward for the midterm.

We are ready to start development, but **instructor approval for the selected tech stack is still pending**.

---

## Project snapshot

| Field                              | Current answer                                                                                                                                                                                                 | Evidence link              |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **Project purpose**                | Smart Study Companion is a simple tool for college students to organize their subjects, study tasks, deadlines, completed tasks, and basic quiz practice in one place.                                         | [Design Doc / README]      |
| **Target user**                    | College students who want a simple way to keep track of their study work and prepare for exams.                                                                                                                | [Design Doc / README]      |
| **In-scope boundary**              | Students can create subjects, add study tasks and deadlines, view their study plan, mark tasks as completed, take a simple multiple-choice quiz, see their score, and save the information using localStorage. | [Architecture Sketch]      |
| **Out-of-scope boundary**          | AI-generated study plans, AI-generated quiz questions, reminders or notifications, user accounts and login, mobile app features, and backend services are not part of the current MVP.                         | [Candidate Vertical Slice] |
| **Possible midterm demo sentence** | Our midterm demo will show a student creating a Programming subject, adding two study tasks with deadlines, completing one task, taking a short quiz, and checking the quiz score.                             | [Candidate Vertical Slice] |

---

## Sprint 0 exit evidence

| Requirement                                                   | Evidence link                         | Status or short note                                                                                   |
| ------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Team repository and Project board work**                    | [GitHub Repository] / [Project Board] | **Complete / verify link** — Our repository and project work are being managed through GitHub.         |
| **Team Working Agreement is linked and current**              | [Working Agreement]                   | **Complete / verify link** — The current team agreement should be linked here.                         |
| **Six to ten next-work Issues exist**                         | [GitHub Issues]                       | **Complete** — Six initial Issues have been prepared for the next stage of development.                |
| **Important Issues have first owners**                        | [GitHub Issues]                       | **Complete** — Issues #1–#3 are assigned to Nabin55, Issue #4 to Adronnie, and Issues #5–#6 to Prince. |
| **At least three Issues have a checkable Definition of Done** | [GitHub Issues]                       | **Complete** — The three main vertical-slice Issues have clear completion requirements.                |
| **Tech stack comparison is recorded**                         | [Tech Stack Comparison]               | **Complete** — We compared two options and selected React + Vite + localStorage.                       |
| **Rough wireframe placeholders are linked**                   | [Wireframe]                           | **Complete / verify link** — The Week 3 wireframe or rough sketch should be linked here.               |
| **Rough architecture placeholder is linked**                  | [Architecture Sketch]                 | **Complete** — The basic React + Vite and localStorage architecture is documented.                     |
| **Candidate vertical slice is linked**                        | [Candidate Vertical Slice]            | **Complete** — The proposed midterm workflow is documented.                                            |
| **Sprint 0 Quality Quick Checks are complete**                | [Quality Quick Checks]                | **Complete / verify** — The final checklist should be checked before closing Sprint 0.                 |
| **Week 3 Weekly Report is complete**                          | [Week 3 Weekly Report]                | **Complete / verify** — The completed Week 3 report should be linked here.                             |

---

## Candidate vertical slice

* **User or actor:** College student
* **Start state:** The student opens Smart Study Companion without having created a Programming subject or any study tasks yet.
* **Smallest end-to-end path:** Create a Programming subject → add two study tasks with deadlines → view the tasks in the study plan → mark one task as completed → take a short multiple-choice quiz → see the quiz score.
* **What the demo should prove:** The main study flow works from creating a subject and tasks to completing a task and getting a quiz result. The information should also remain saved using localStorage.
* **What is deliberately out of scope:** AI study plans, AI-generated quiz questions, reminders and notifications, login or user accounts, mobile features, and backend services.
* **Evidence link:** [Candidate Vertical Slice]

---

## Risks and owned exceptions

| Risk or exception                                                                                            | Owner              | Next action                                                                                          | Due or review point                                |
| ------------------------------------------------------------------------------------------------------------ | ------------------ | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| React state and localStorage may not save or update the subject, task, and completion information correctly. | **Adronnie**       | Create one subject and one task, refresh the page, and check whether the information is still there. | **Before or during the first implementation task** |
| Some team members may need time to become comfortable with React components and state.                       | **Nabin55 / Team** | Start with the basic React concepts needed for the first feature and learn them while building.      | **Week 4–5**                                       |
| Instructor approval for React + Vite + localStorage is still pending.                                        | **Team DJ Barut**  | Ask for confirmation and record any feedback or required changes.                                    | **Next instructor checkpoint**                     |
| Adding features such as AI or reminders too early could make the project larger than planned.                | **Team DJ Barut**  | Keep the main MVP focused on the current vertical slice until the basic workflow is working.         | **Throughout development**                         |

---

## Bridge into Week 4 and Sprint 1

* **Week 4 Chuseok Checkpoint Issue:** [Add GitHub Issue link]
* **Rough sketch or photo link:** [Add wireframe/sketch link]
* **One blocker or question for Week 5:** Can we make the React and localStorage data flow work reliably for subjects, tasks, completion status, and quiz results without making the project unnecessarily complicated?
* **First action after the break:** Set up the React + Vite project and test the basic data flow by creating one subject and one task, saving them to localStorage, refreshing the page, and checking that the data is still available.

---

## Final check

* [ ] Every evidence link works for someone with access to the team repository.
* [ ] The team can explain the project purpose, target user, scope, and candidate vertical slice.
* [ ] The next development tasks are represented by small Issues with owners and clear completion requirements.
* [ ] No personal information, passwords, secrets, or unapproved real-user data has been added to the project.
* [ ] This report is linked from the team's Week 3 evidence or Weekly Report.
* [ ] Instructor approval has been checked, or the pending approval has been clearly recorded.

---

## Sprint 0 final decision

**Selected stack:** React + Vite + localStorage

**MVP architecture:** Frontend only. We will not use a backend or external services for the current version.

### Primary midterm workflow

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

### Sprint 1 starting point

Our first step after Sprint 0 will be to build the smallest part of the vertical slice. We will start with creating a subject and study task, then test whether the information can be saved and loaded correctly using localStorage.

Once this basic part works, we can continue building the study plan, task completion, and quiz features.
