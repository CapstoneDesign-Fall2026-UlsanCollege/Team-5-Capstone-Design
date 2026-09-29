# Week 4 Checkpoint: Chuseok Report

**Team:** Smart Study Companion  
**Project:** Smart Study Companion  
**Week:** 4

## Student roster

| Student |
|---|
| Nabin Khadka |
| Sumit Adhikari |
| Prince Karki |
| Prabin Rai |
| J.N. Taj Oli |

This is the Week 4 report. It replaces the standard Weekly Report for this week.

## Confirmed technology stack

The MVP will use the following technology stack:

| Component | Technology | Notes |
|---|---|---|
| **Frontend** | React + Vite | Component-based UI for reusable screens |
| **Storage** | `localStorage` | Browser-based persistence; data stored on the device |
| **Backend** | None for the MVP | Frontend-only prototype; no server required |
| **External services** | None for the MVP | No Firebase, APIs, or cloud services for now |

All MVP subjects, study tasks, deadlines, completion status, and quiz results will be stored in the browser using `localStorage`. AI-generated study plans, AI-generated quiz questions, reminders and notifications, user login, cloud storage, and backend services are all postponed until after the core MVP is complete and validated.

This stack is provisional in one respect only: it is confirmed as the team's choice, and it still needs the instructor's approval recorded before Sprint 1 implementation begins. That approval is tracked as a blocker in the [Week 3 weekly report](../week3/weekly%20report.md).

## Project direction

Our team plans to build a simple, user-focused web application that helps college students organize subjects, study tasks, deadlines, and quizzes. The first version will prioritize a clear study workflow over feature count: a student should be able to see their subjects, track tasks and deadlines, and check their understanding with a short quiz, all in one place.

The problem this addresses is that students spread study work across separate tools, which makes deadlines easy to miss and makes it unclear what to revise before an exam. Smart Study Companion keeps the planner and the quiz in one flow rather than adding AI or social features.

The core MVP flow is:

1. Create a subject.
2. Add study tasks and deadlines.
3. Review the study plan.
4. Mark a task as completed.
5. Take a multiple-choice quiz.
6. View the calculated quiz score.

## Out of scope for MVP

The following features are postponed until after the core MVP is complete and validated:

- AI-generated study plans
- AI-generated quiz questions
- Reminders and notifications
- User login and accounts
- Mobile app features
- Calendar view
- Backend services

## Rough sketch or planned screens

The initial website will include the following screens or interactions:

1. **Study dashboard**
   - Show the student's subjects and study tasks.
   - Provide clear navigation to the main study actions.
   - Highlight upcoming deadlines and incomplete tasks.

2. **Subject and task management**
   - Allow a student to create a subject.
   - Allow the student to add study tasks and deadlines.
   - Show the subject and deadline for each task.

3. **Study plan**
   - Display study tasks in a simple list.
   - Distinguish completed and incomplete tasks.
   - Allow the student to mark a task as completed.

4. **Quiz screen**
   - Display simple multiple-choice questions.
   - Allow the student to select answers and submit the quiz.

5. **Quiz result screen**
   - Display the final score.
   - Show the number of correct answers and total questions.

The detailed visual design may change as we learn more about the service, but these screens define the minimum user flow we intend to demonstrate.

## Intended user flow

The minimum successful flow is:

1. A student opens the Smart Study Companion dashboard.
2. The student creates or selects a Programming subject.
3. The student adds study tasks with deadlines.
4. The student reviews the study plan.
5. The student marks one task as completed.
6. The student takes a short multiple-choice quiz.
7. The student submits the quiz and views the calculated score.

If the full application is not ready, we will prepare a clearly labeled prototype flow using sample data so that the page transitions and expected behavior can still be demonstrated.

## Midterm demo sentence

**Our midterm demo will show:** A student creating a Programming subject, adding study tasks with deadlines, reviewing the study plan, marking one task as completed, and taking a short multiple-choice quiz, then seeing the calculated score.

## Minimum midterm requirements

To keep the scope realistic, the midterm version should provide:

- A visible study dashboard or starting screen.
- Subject creation or a clearly labeled sample subject.
- Study-task creation with a deadline.
- A study-plan view showing incomplete and completed tasks.
- A way to mark a task as completed.
- A short multiple-choice quiz.
- Correct quiz-score calculation and result display.
- Clear feedback for successful actions and common validation errors.
- A short explanation of which features are complete and which are planned for later.
- The confirmed React + Vite frontend, `localStorage` storage, and no backend for the MVP.

## One blocker or question for Week 5

Our main question for Week 5 is how to divide and connect the core MVP slices without making the project too large. We need to confirm the interfaces between subject/task management, the study-plan view, and the quiz flow so that each track can be built and tested independently before the pieces are connected.

The blocking dependency is project setup. The persistence test assigned for this checkpoint cannot run until the React + Vite app is scaffolded and serving locally, because the test must observe real application behaviour rather than a standalone fixture. That dependency is documented in the [localStorage persistence test status](adronnie-localstorage-test-status.md) and the [test report](test-reports/localStorage-persistence-test.md).

## Week 5 priorities

1. Confirm the final midterm UI flow and page structure.
2. Assign ownership for subject/task management, the study-plan view, and the quiz flow.
3. Implement the easiest vertical slice: create a subject and add a task with a deadline.
4. Connect task data to the study-plan view and task-completion interaction.
5. Define the sample quiz data and score-calculation success criteria.
6. Keep AI generation, reminders, login, cloud storage, and backend services outside the core midterm scope unless the MVP is complete.

### Track 1: Project setup (Owner: Nabin Khadka)

First task: Set up the React + Vite project scaffolding.

- [ ] Create a new React + Vite project using `npm create vite@latest`
- [ ] Install required dependencies (React, React DOM, and build tools)
- [ ] Add a basic project structure: `/src`, `/src/components`, and `/src/styles`
- [ ] Create a simple root App component and check that the dev server runs
- [ ] Add setup instructions to the README for team members
- [ ] Test that all team members can clone, install, and run the project locally
- [ ] Commit the project scaffolding to the main branch

Definition of done: the project runs with `npm run dev`, team members can clone and run it, and the first vertical slice issues can begin.

### Track 2: First vertical slice â€” subject and task creation (Owner: Sumit Adhikari)

Start with Issue #17: Design Subjects and Study Tasks.

- [ ] Create a React component for the subject-creation form
- [ ] Create a React component for the study-task form (title, deadline, subject)
- [ ] Implement `localStorage` save for subjects and tasks
- [ ] Test: create a Programming subject, add two tasks, then refresh the page
- [ ] Verify that the data persists after reload

Definition of done: a student can create a subject, add tasks with deadlines, refresh the page, and still see the saved data.

## Optional: easiest first screen or interaction

The easiest first interaction is a study dashboard with simple navigation cards for:

- Subjects
- Study Tasks
- Study Plan
- Quiz
- Results

First interaction: select or create a subject, then add a study task with a deadline.

## Evidence and references

- [Design Doc v1](../week2/design-doc-v1.md)
- [Architecture Sketch](../week3/architecture-sketch.md)
- [Tech Stack Comparison](../week3/tech-stack-comparison.md)
- [Sprint 0 Report](../week3/sprint-0-report.md)
- [Candidate Vertical Slice](../week3/candidate-vertical-slice.md)
- [Storage Persistence Check](../week2/storage-check.md)
- [User Flow Sketch](../week2/User%20Flow%20Sketch.jpg)
- [Quiz score validation checklist](../tests/quiz-validation.md)
- [Week 4 docs index](README.md)
- [Week 04 contributor update — Prabin Rai](week-04.md)
- Commit: Add quiz score validation checklist and answer key â€” https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/02f3a14305e03ad6638959417937fbc473aefa5d
