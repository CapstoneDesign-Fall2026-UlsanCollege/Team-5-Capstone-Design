# Tech Stack Comparison

**Team:** DJ Barut

**Week:** 3

We compared two simple options for building the Smart Study Companion. We mainly looked at what the team already knows, what we need to learn, and what we can finish for the midterm.

## Side-by-Side Comparison

| **Criteria** | **Stack A: React + Vite + localStorage** | **Stack B: HTML/CSS/JavaScript + localStorage** |
|---|---|---|
| **Frontend** | React + Vite | HTML, CSS, JavaScript |
| **Data** | localStorage | localStorage |
| **What can we build?** | Subjects, tasks, study plan, quiz, and results | Same basic features |
| **What do we know?** | Basic HTML, CSS, JavaScript | Basic HTML, CSS, JavaScript |
| **What do we need to learn?** | React components, state, props | Organizing JavaScript for multiple screens |
| **Development** | More setup at first | Easier to start |
| **Code structure** | Components make it easier to separate features | Simple at first, but can get harder with more features |
| **Midterm** | Subject → tasks → study plan → quiz → score | Same basic flow |
| **Main risk** | Learning React takes some time | Code may get messy as the project gets bigger |
| **First feature** | Add subject and study task | Add subject and study task |

## Stack A

- **Stack name:** React + Vite + localStorage
- What can we build with this?: We can make the main screens for subjects, study tasks, the study plan, quizzes, and results.
- What does the team already know?: We know the basics of HTML, CSS, and JavaScript.
- What must we learn?: We need to learn basic React, especially components and state.
- How can we demo it by midterm?: We can show a Programming subject, add two tasks with deadlines, complete one task, take a quiz, and show the score.
- What could go wrong?: Some team members may need time to get used to React. We may also have problems saving or loading data.
- Simplest first screen or feature: Add a subject and study task with a deadline.

## Stack B

- Stack name: HTML/CSS/JavaScript + localStorage
- What can we build with this?: We can make the same main features using normal web technologies.
- What does the team already know?: We already know the basics of HTML, CSS, and JavaScript.
- What must we learn?: We need to organize the JavaScript and connect the different screens.
- How can we demo it by midterm?: We can show the subject, task, study plan, quiz, and result screens.
- What could go wrong?: The code could become harder to manage when we add more features.
- Simplest first screen or feature: A simple form for adding a subject and study task.

## Decision

We choose:

React + Vite + localStorage

Because:

Our project has several screens and features, so we think React will make the project easier to organize. We only need localStorage for the current version, so we don't need to set up a backend yet. We still need to learn some React, but the team can start with the basic parts.

## Instructor approval / notes(Instructor Approval is Pending)

- Team discussed both options and chose **React + Vite + localStorage**.
- We will build the main features first for the midterm.
- We will keep the project simple and consider extra features after the main flow works.
