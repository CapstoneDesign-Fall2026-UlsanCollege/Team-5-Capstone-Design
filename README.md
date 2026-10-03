# Smart Study Companion

**A study planner and quiz project for college students.** Organize subjects, track study tasks and deadlines, and prepare for quizzes in one place.

**Team 5 · Capstone Design · Fall 2026 · Ulsan College**

> **Project status:** Planning and early implementation documentation. The main branch currently has no application source code. The app-level persistence test is prepared but has not been run.

## Contents

- [Overview](#overview)
- [Problem and approach](#problem-and-approach)
- [Planned MVP](#planned-mvp)
- [First vertical slice](#first-vertical-slice)
- [Technology direction](#technology-direction)
- [Project status](#project-status)
- [Run the project](#run-the-project)
- [Documentation](#documentation)
- [Team](#team)

## Overview

College students manage assignments, exams, and study tasks across multiple subjects. Smart Study Companion is planned as a simple place to organize those responsibilities and review progress. The MVP focuses on subject organization, task deadlines, completion status, and multiple-choice quiz scores.

## Problem and approach

| Student need | Planned response |
| --- | --- |
| Keep coursework organized by subject | Create and review a subject list |
| Remember study tasks and due dates | Add tasks with deadlines under a subject |
| See what is finished | Mark tasks complete and review the study plan |
| Practice before an exam | Take a multiple-choice quiz and view the score |

## Planned MVP

The target user flow is:

1. Create a subject.
2. Add a study task and deadline.
3. Review tasks in the study plan.
4. Mark a task complete.
5. Take a multiple-choice quiz.
6. View the calculated score.

This describes the intended MVP. Features should be marked complete only when the implementation and linked evidence are available in the repository.

## First vertical slice

The Week 5 candidate slice is subject and task creation with local persistence. The planned proof is to create a subject, add a task with a deadline, refresh the browser, and confirm that both remain visible.

The repeatable test procedure is in [docs/week5/week-05-prabin-rai.md](docs/week5/week-05-prabin-rai.md). Its current result is **Not run** because the application source is not yet present on main.

## Technology direction

The project documentation records **React + Vite + browser localStorage** as the MVP and midterm direction. AI generation, reminders, login, and cloud storage are outside the current MVP scope. Week 5 API, authentication, and database notes should be treated as proposals unless the team and instructor confirm a change to the agreed direction.

## Project status

| Area | Current state |
| --- | --- |
| Project goal and MVP direction | Documented |
| Week 1–4 planning and checkpoint records | In the documentation folder |
| Week 5 worklist and technical notes | In progress |
| Application source on main | Not present in the current repository snapshot |
| App-level persistence test | Procedure prepared; not run |
| Demo screenshots | To be added after a real app flow is available |

## Run the project

There is no application source or verified run command on main yet. Setup instructions will be added after the app scaffold is committed and tested on a teammate’s machine. Do not use the standalone Week 2 storage fixture as proof that the application runs.

## Documentation

All course records and project design notes are organized under [docs/](docs/README.md).

| Week | Materials |
| --- | --- |
| [Week 1](docs/week1/README.md) | Launch report, project ideas, team working agreement |
| [Week 2](docs/week2/README.md) | Scope, design document, user flow, research receipts, storage fixture |
| [Week 3](docs/week3/README.md) | Stack comparison, architecture, wireframes, candidate vertical slice |
| [Week 4](docs/week4/README.md) | Chuseok checkpoint and persistence-test blocker |
| [Week 5](docs/week5/WEEK_5_WORKLIST.md) | Vertical-slice worklist and current implementation tasks |
| [Week 5 persistence test](docs/week5/week-05-prabin-rai.md) | Test steps, expected results, and current test status |

## Team

| Member | Responsibility |
| --- | --- |
| Nabin Khadka | Project and board coordination; build |
| Sumit Adhikari | Build and quality |
| Prince Karki | Research and analysis |
| Prabin Rai | Research and analysis support; persistence-test preparation |
| J.N. Taj Oli | Evidence and documentation |
