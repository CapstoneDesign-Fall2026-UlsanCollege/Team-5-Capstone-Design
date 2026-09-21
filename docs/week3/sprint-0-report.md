# Sprint 0 Report — Launch and Scope

**Team:** DJ Barut
**Project:** Smart Study Companion
**Sprint:** Sprint 0 — Launch and Scope
**Date:** 2026-09-21
**Status:** [ ] Ready to close  [x] Ready with an explicitly owned exception

---

## Sprint 0 outcome

During Sprint 0, our team clarified the product we want to build and the MVP path to reach it. We selected **React + Vite + localStorage** for the frontend-only prototype and documented the first end-to-end workflow for the app.

We are ready to begin Sprint 1 development, but **instructor approval for the selected tech stack is still pending**.

---

## Project snapshot

| Field | Current answer |
| --- | --- |
| **Project purpose** | Smart Study Companion is a simple tool for college students to organize subjects, study tasks, deadlines, completed work, and basic quiz review in one place. |
| **Target user** | College students who want a simple way to manage study work and prepare for exams. |
| **In-scope boundary** | Students can create subjects, add study tasks and deadlines, view their study plan, mark tasks as completed, take a short multiple-choice quiz, and see their score. |
| **Out-of-scope boundary** | AI-generated study plans, AI-generated quiz questions, reminders or notifications, user accounts and login, mobile app features, and backend services are not part of the current MVP. |
| **Possible midterm demo sentence** | Our midterm demo will show a student creating a Programming subject, adding two study tasks with deadlines, completing one task, taking a short quiz, and checking the score. |

---

## Sprint 0 exit evidence

| Requirement | Evidence link | Status or short note |
| --- | --- | --- |
| **Team repository and Project board work** | [Repository](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design) / [Project Board](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/projects) | **Complete** — The project is being managed in the team repository and project board. |
| **Team Working Agreement is linked and current** | [Working Agreement](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week1/project_agreement.md) | **Complete** — The current team agreement is linked and recorded in the repo. |
| **Six to ten next-work Issues exist** | [Issues](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues) | **Complete** — Initial Sprint 1 issues are prepared and visible in the repository. |
| **Important Issues have first owners** | [Issues](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues) | **Complete** — Current work is assigned across the team, including stack setup, architecture, subject/task creation, study-plan work, and quiz work. |
| **At least three Issues have a checkable Definition of Done** | [Issues](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues) | **Complete** — The main vertical-slice issues include explicit tasks and validation criteria. |
| **Tech stack comparison is recorded** | [Tech Stack Comparison](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week3/tech-stack-comparison.md) | **Complete** — We compared options and selected React + Vite + localStorage. |
| **Rough wireframe placeholders are linked** | [Wireframe / User Flow Sketch](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week2/User%20Flow%20Sketch.jpg) | **Complete** — The rough screen-flow sketch is stored in the project docs. |
| **Rough architecture placeholder is linked** | [Architecture Sketch](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week3/architecture-sketch.md) | **Complete** — The basic React + Vite and localStorage architecture is documented. |
| **Candidate vertical slice is linked** | [Candidate Vertical Slice](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week3/candidate-vertical-slice.md) | **Complete** — The proposed midterm workflow is documented. |
| **Sprint 0 Quality Quick Checks are complete** | [Sprint 0 Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week3/sprint-0-report.md) | **Complete** — The final report checklist has been reviewed and the pending approval is explicitly noted. |
| **Week 3 Weekly Report is complete** | [Week 3 Weekly Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week3/weekly%20report.md) | **Complete** — The team’s Week 3 evidence is linked and recorded. |

---

## Candidate vertical slice

* **User or actor:** College student
* **Start state:** The student opens Smart Study Companion without having created a Programming subject or any study tasks yet.
* **Smallest end-to-end path:** Create a Programming subject → add two study tasks with deadlines → view the tasks in the study plan → mark one task as completed → take a short multiple-choice quiz → see the score.
* **What the demo should prove:** The main study flow works from creating a subject and tasks to completing a task and getting a quiz result. The information should also remain saved using localStorage.
* **What is deliberately out of scope:** AI study plans, AI-generated quiz questions, reminders and notifications, login or user accounts, mobile features, and backend services.
* **Evidence link:** [Candidate Vertical Slice](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week3/candidate-vertical-slice.md)

---

## Risks and owned exceptions

| Risk or exception | Owner | Next action |
| --- | --- | --- |
| React state and localStorage may not save or update the subject, task, and completion information correctly. | **Adronnie** | Create one subject and one task, refresh the page, and check whether the data persists correctly. |
| Some team members may need time to become comfortable with React components and state. | **Nabin55 / Team** | Start with the basic React concepts needed for the first feature and confirm the implementation pattern early. |
| Instructor approval for React + Vite + localStorage is still pending. | **Team DJ Barut** | Ask for confirmation and record any feedback or required changes before the implementation continues. |
| Adding features such as AI or reminders too early could make the project larger than planned. | **Team DJ Barut** | Keep the MVP focused on the candidate vertical slice until the main workflow is working. |

---

## Bridge into Week 4 and Sprint 1

* **Week 4 Chuseok Checkpoint Issue:** [Set up project and choose tech stack](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/14)
* **Rough sketch or photo link:** [User Flow Sketch](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week2/User%20Flow%20Sketch.jpg)
* **One blocker or question for Week 5:** Can we make the React and localStorage data flow work reliably for subjects, tasks, completion status, and quiz results without expanding the project beyond the MVP?
* **First action after the break:** Set up the React + Vite project and test the basic data flow by creating one subject and one task, saving them to localStorage, refreshing the page, and checking that the information persists.

---

## Final check

* [x] Every evidence link works for someone with access to the team repository.
* [x] The team can explain the project purpose, target user, scope, and candidate vertical slice.
* [x] The next development tasks are represented by small Issues with owners and clear completion requirements.
* [x] No personal information, passwords, secrets, or unapproved real-user data has been added to the project.
* [x] This report is linked from the team's Week 3 evidence or Weekly Report.
* [x] Instructor approval has been checked, or the pending approval has been clearly recorded.

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

Our first step after Sprint 0 will be to build the smallest part of the vertical slice. We will start by creating a subject and study task, then test whether the information can be saved and loaded correctly.

Once this basic part works, we can continue building the study plan, task completion, and quiz features.
