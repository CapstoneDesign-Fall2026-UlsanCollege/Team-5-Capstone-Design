# Wireframe Notes

**Team:** DJ Barut  
**Week:** 3  
**Project:** Smart Study Companion

This note turns the Week 3 planning into a practical wireframe analysis for the MVP. The application is designed around one complete student workflow: create a subject, add study tasks with deadlines, review the plan, mark work complete, take a short quiz, and view the score. The screen flow is intentionally simple, because the project is focused on a usable midterm demo rather than a full-featured platform.

## Screen / interaction 1

- **Name:** Subject & Task Creation Screen
- **Target user:** College student managing multiple subjects and deadlines
- **What the user does:**
  - Enters a subject name such as "Programming" or "Math"
  - Adds a study task with a title and due date
  - Saves the information locally in the browser
  - Repeats the process for additional subjects or tasks
- **What the screen shows:**
  - Top bar with project title and current date
  - Subject input field and add-subject button
  - Task form with title, subject selector, and deadline date
  - A small list of recently added tasks or a task summary card
  - Save confirmation or empty-state message when no tasks exist yet
- **Sketch/photo link:** TBD — add a simple mockup or annotated screenshot later

### Analysis

This is the entry screen for the MVP because it supports the first core action in the product. A student needs to create something concrete before seeing any planning value. The screen should be minimal and fast: one form for subject creation and one form for task creation. This keeps the learning curve low and matches the app's local-first design with `localStorage`.

The most important design rule here is clarity. A student should understand in a few seconds how to add a subject and a study task. The screen should also encourage a habit of adding deadlines immediately, because this is a key part of the product's value.

## Screen / interaction 2

- **Name:** Study Plan / Task Tracker Screen
- **Target user:** Student reviewing weekly workload and deadlines
- **What the user does:**
  - Opens the study plan after creating tasks
  - Reviews upcoming deadlines
  - Marks tasks as complete or incomplete
  - Filters tasks by subject or completion state
- **What the screen shows:**
  - Subject tabs or cards for each subject
  - A list of study tasks grouped by due date or subject
  - Task title, deadline, completion status, and subject name
  - Clear visual distinction between completed and incomplete tasks
  - A summary such as total tasks, completed tasks, and pending tasks
- **Sketch/photo link:** TBD — add a simple mockup or annotated screenshot later

### Analysis

This is the primary value screen of the product. The study plan is where the app becomes useful: students can see what they need to complete and when. It directly supports the core promise of the project—helping students manage tasks and deadlines without getting lost in a long list of assignments.

For a simple MVP, the screen should remain a clean task list instead of a complex calendar. We should sort tasks by deadline and use strong visual indicators for incomplete versus completed work. This reduces cognitive overload and makes the product feel more helpful than a generic to-do app.

The main user need here is progress visibility. If a student can see a clear plan and know what is still pending, the app becomes more than a data entry tool. It becomes a planning helper.

## Screen / interaction 3

- **Name:** Quiz & Result Screen
- **Target user:** Student testing understanding after studying
- **What the user does:**
  - Opens a quiz for a selected subject
  - Answers multiple-choice questions
  - Submits the quiz
  - Reviews the score and number of correct answers
- **What the screen shows:**
  - Subject-focused quiz title
  - One question at a time or a grouped multiple-choice layout
  - Answer options with clear radio-button or card selection
  - Submit button and progress indicator
  - Final result screen with score, percent, and total questions
- **Sketch/photo link:** TBD — add a simple mockup or annotated screenshot later

### Analysis

This screen closes the loop in the MVP workflow. A student does not just create tasks and check plans; they also test whether their study effort paid off. The quiz feature gives the app a practical outcome and supports the project narrative around exam preparation.

Because the MVP is intentionally limited, the quiz should be simple. Multiple-choice questions with fixed answer keys are enough. The key UX objective is not advanced learning logic, but clear and correct scoring. A score screen that displays both the raw number and the percentage helps the student understand progress quickly.

This screen also gives the app a natural demo path. A team member can easily show a subject, add two tasks, complete one, then answer a short quiz and see the score. That story is straightforward and memorable for the midterm demo.

## Easiest first screen to build

We think the easiest first screen/interaction is:

> Subject & Task Creation Screen

Because:

> It has the fewest moving parts, the clearest user flow, and the most direct connection to the MVP. It only requires a simple form, local state, and `localStorage` persistence. It also supports a clean midterm demo: the user can create a subject, add tasks, and immediately see them appear in the study plan.

## Overall wireframe reasoning

Across all screens, the product should follow a very simple interaction model:

1. Create a subject.
2. Add tasks with deadlines.
3. Review the plan.
4. Complete tasks.
5. Take a quiz.
6. See the result.

This flow matches the project design document and keeps the user experience simple enough for a college student to understand immediately. It avoids unnecessary complexity such as login flows, cloud storage, or AI-generated content in the initial version. The app remains focused on the most valuable user task: turning a busy study schedule into manageable, visible progress.

## Suggested screen order for implementation

1. Subject & Task Creation
2. Study Plan / Task Tracker
3. Quiz & Result Screen

This order aligns with the simplest validated path for the week 3 stack decision and the candidate vertical slice. It also reduces technical risk, because each step is easy to test using browser storage and basic React state updates.

## Final conclusion

The wireframe analysis supports a single, focused MVP: a student can manage study tasks by subject, track deadlines, complete work, and test understanding with a simple quiz. The screen designs are intentionally basic, but they directly align with the product's core purpose, user workflow, and the midterm demo requirement.

If the team later adds AI-generated plan suggestions or reminders, those features can be layered onto the same core screens without changing the basic structure of the app.

---

**Updated by:** DJ Barut  
**Updated for:** Week 3 wireframe analysis
