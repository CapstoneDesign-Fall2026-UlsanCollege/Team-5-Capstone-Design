# Architecture Sketch

**Team:** DJ Barut

**Project:** Smart Study Companion

**Last updated:** Week 3

## One-sentence architecture

This project uses:

**Frontend:** React + Vite  
**Backend:** None for MVP  
**Data:** localStorage for subjects, tasks, deadlines, completion status, and quiz data  
**External services:** None for MVP

## Simple diagram

```text
                    Student
                       ↓
             Smart Study Companion
                       ↓
                React + Vite
                       ↓
          ┌────────────┴────────────┐
          ↓                         ↓
    Subjects & Tasks            Study Plan
          ↓                         ↓
      Add / Save              View / Complete
          └────────────┬────────────┘
                       ↓
                 Quiz Feature
                       ↓
                 Quiz Result
                       ↓
                  localStorage
                       ↓
          Subjects / Tasks / Status
                 / Quiz Data


```
## Main parts

| Part | What it does | Owner | Risk / uncertainty |
|---|---|---|---|
| UI / Frontend | Subject, task, study plan, quiz, and result screens | Nabin55 | Keeping the screens simple and learning React components |
| Data | Stores subjects, tasks, deadlines, completion status, and quiz data using localStorage | Adronnie | Data may be lost if browser storage is cleared |
| Logic / React | Handles adding tasks, completing tasks, checking quiz answers, and calculating scores | Prince | Organizing React state and localStorage data |
| Setup / Docs | Project setup, GitHub issues, documentation, and architecture | Nabin55 | Keeping documentation updated during development |

## Evidence links

Link the repository, issues, diagram, or project board here.

* GitHub repository: [ ]
* Project Issues: [ ]
* Architecture sketch: [ ]
* Project board: [ ]

## Important decisions

| Decision | Why we chose it | Risk |
|---|---|---|
| React + Vite | Helps us organize the different screens and features using React components | Team members need to learn React |
| localStorage | Provides a simple way to save subjects, tasks, deadlines, and quiz data | Data is only stored in the browser |
| No Backend | The main MVP features do not need a server | A backend may be needed for future features |
| Study Plan | Helps students see their tasks, deadlines, and completion status in one place | The study plan may become more complicated with extra features |
| Simple Quiz | Allows students to answer questions and see their score for the midterm | More advanced quiz features may need additional work |

## What could break?

* localStorage data may be lost if the browser storage is cleared.
* React state and localStorage data may not update correctly.
* Task completion status may not save correctly.
* Quiz answers or scores may be calculated incorrectly.
* Some team members may need more time to learn React.
* Adding AI or reminder features too early may make the project harder to finish.
* The project may become difficult to manage if the React components are not organized properly.

## MVP approach

For the first working prototype, we will focus on:

1. React + Vite project setup
2. Create subjects and study tasks
3. Add task deadlines
4. Show the study plan
5. Mark tasks as completed
6. Create a simple multiple-choice quiz
7. Calculate and show the quiz score
8. Save data using localStorage

We will first make the main workflow work and then consider extra features such as AI study plans, AI quiz questions, and reminders.
