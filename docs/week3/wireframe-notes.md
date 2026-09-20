# Wireframe Notes

**Team:** DJ Barut  
**Week:** 3  
**Project:** Smart Study Companion

A wireframe can be a rough sketch, screenshot, photo, or simple diagram. It does not need to be beautiful.

## Screen / interaction 1

- **Name:** Subject & Task Creation Screen
- **Target user:** College student managing multiple subjects and deadlines
- **What the user does:**
  - Adds a subject name
  - Creates a study task with a title and due date
  - Saves the information locally in the browser
  - Repeats the process for more subjects or tasks
- **What the screen shows:**
  - Top bar with the app title and current date
  - Subject input field and add-subject button
  - Task form with title, subject, and deadline
  - Recently added tasks or a simple task summary
  - Empty state or save confirmation message
- **Sketch/photo link:** TBD

### Analysis

- This is the first and simplest screen in the MVP.
- It supports the main action of creating study data.
- The UI should be clear and easy to use so students can add tasks quickly.

## Screen / interaction 2

- **Name:** Study Plan / Task Tracker Screen
- **Target user:** Student reviewing weekly workload and deadlines
- **What the user does:**
  - Opens the study plan after creating tasks
  - Reviews upcoming deadlines
  - Marks tasks as complete or incomplete
  - Filters tasks by subject or status
- **What the screen shows:**
  - Subject cards or tabs
  - Task list sorted by deadline or subject
  - Task title, deadline, subject, and completion status
  - Clear difference between completed and pending tasks
  - Total, completed, and remaining task summary
- **Sketch/photo link:** TBD

### Analysis

- This is the main value screen of the app.
- Students can see what to study and when to study it.
- A simple task list is better than a complex calendar for the MVP.

## Screen / interaction 3

- **Name:** Quiz & Result Screen
- **Target user:** Student testing understanding after studying
- **What the user does:**
  - Opens a quiz for a selected subject
  - Answers multiple-choice questions
  - Submits the quiz
  - Reviews the final score and correct answers
- **What the screen shows:**
  - Subject-focused quiz title
  - One question at a time or grouped answer choices
  - Clear options and submit button
  - Progress indicator during the quiz
  - Final result with score, percent, and total questions
- **Sketch/photo link:** TBD

### Analysis

- This screen completes the MVP workflow.
- A student can create tasks, review the plan, and then test understanding.
- The quiz should stay simple with basic multiple-choice questions.

## Easiest first screen to build

We think the easiest first screen/interaction is:

> Subject & Task Creation Screen

Because:

> It has the fewest moving parts, the clearest flow, and the strongest connection to the MVP. It only needs a basic form and local `localStorage` storage.

## Final conclusion

The wireframe supports a focused MVP where a student can manage study tasks by subject, track deadlines, complete work, and test understanding with a short quiz.
