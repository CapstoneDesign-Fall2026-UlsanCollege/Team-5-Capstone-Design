# Design Doc v1

**Team:** DJ Barut  
**Project name:** Smart Study Companion  
**Last updated:** 2026-09-17

## 1. Project purpose

Smart Study Companion is a web application for college students. It combines subject management, study tasks, deadlines, task completion, AI-assisted study planning, and simple multiple-choice quizzes to help students stay organized and prepare for exams.

College students may have many study tasks, assignments, and exams to manage. This makes it difficult to remember deadlines and prepare effectively for exams.

## 2. Target users

| Role | Main responsibilities |
|---|---|
| student | Manage subjects, create and review study tasks, set deadlines, complete tasks, receive reminders, take quizzes, and view quiz scores. |

## 3. Smallest useful version

The smallest useful version is a web application that supports this complete workflow:

A student creates a subject and adds study tasks.
A student sets deadlines for the study tasks.
The system displays the tasks in a study plan.
The student marks a study task as completed.
The student takes a simple multiple-choice quiz.
The system calculates and displays the quiz score.

AI-generated study plans, AI-generated quiz questions, and reminders are in scope for the project but are not required for the smallest useful version. They will be implemented after the core workflow is complete and validated.

### Rough user flow

Start -> Add Subject and Study Tasks -> Set Deadline -> Review Study Plan -> Mark Task Completed -> Take Quiz -> View Quiz Score

Optional extensions: Generate AI Study Plan -> Review/Edit Generated Tasks; Generate AI Quiz Questions -> Review Questions; Receive Deadline Reminder.

Evidence / sketch link: [User Flow Sketch](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/0b3e6eaf8c119bdbc936059fbabf11ba8e5084ab/week-02/User%20Flow%20Sketch.jpg)

## 4. In scope

- Student view for subjects and study tasks.
- Creating study tasks and deadlines.
- Study plan view.
- Marking study tasks as completed.
- Simple multiple-choice quizzes.
- Quiz score calculation.
- Quiz result display.
- AI-generated study plans.
- AI-generated quiz questions.
- Reminder and notification system.

## 5. Out of scope

- Online classes.
- Teacher communication.
- Social networking.
- Advanced learning analytics.
- Mobile applications.
- University system integration.

## 6. Midterm demo sentence

Our midterm demo will show:

A student adding a Programming subject, creating study tasks with deadlines, marking a task as completed, taking a short multiple-choice quiz, and viewing the quiz score. If the core workflow is completed early, the team may also show the optional AI-generated support features.

## 7. Final demo sentence

Our final demo will prove:

Smart Study Companion can help a student organize study tasks and deadlines, review an AI-generated study plan, mark completed tasks, receive reminders for upcoming deadlines, take a simple or AI-generated quiz, and review the calculated score.

## 8. MVP features

The first seven features are required for the core MVP. The last three features are in scope but are planned as additional features after the core MVP unless the team confirms that they can be completed on time.

| Feature | Required for MVP? | Primary implementation owner | Research, design, or testing support | Issue link |
|---|---|---|---|---|
| Subject management | Yes | Khadka Nabin | Khadka Nabin: Requirements research | [Issue #6](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/6) |
| Study task management | Yes | Oli J.N. Taj | Oli J.N. Taj: Interface design | [Issue #2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/2) |
| Deadline management | Yes | Khadka Nabin | Adhikari Sumit: Workflow research | [Issue #6](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/6) |
| Study plan | Yes | Khadka Nabin | Karki Prince: Interface design | [Issue #6](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/6) |
| Task completion | Yes | Oli J.N. Taj | Rai Prabin: Testing | [Issue #2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/2) |
| Multiple-choice quiz | Yes | Khadka Nabin | Khadka Nabin: Quiz design | [Issue #6](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/6) |
| Quiz score | Yes | Karki Prince | Khadka Nabin: Testing | [Issue #3](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/3) |
| AI-generated study plans | No | To be assigned | Prompt design, output review, and testing | To be added |
| AI-generated quiz questions | No | To be assigned | Prompt design, answer validation, and testing | To be added |
| Reminder and notification system | No | To be assigned | Notification workflow and timing tests | To be added |

## 9. Functional requirements

### Subjects and study tasks

- Create, view, update, and remove subjects.
- Create study tasks for each subject.
- Add a deadline to each study task.
- Show the subject and deadline for each task.
- Mark study tasks as completed.

### Study plan

- Display study tasks in a simple list.
- Show upcoming deadlines.
- Show completed and incomplete tasks.
- Allow students to review their study tasks.

### AI-generated study plans

- Allow a student to request a study plan for a selected subject.
- Use the subject, study goals, available time, and deadline as generation inputs when available.
- Display the generated plan for review before saving it.
- Allow the student to edit or remove generated tasks.
- Clearly show an error if study-plan generation fails.

### Quizzes

- Add simple multiple-choice questions.
- Display answer choices for each question.
- Allow students to select answers.
- Submit the quiz.
- Check the selected answers.
- Calculate the quiz score.

### AI-generated quiz questions

- Allow a student to request quiz questions for a selected subject.
- Generate multiple-choice questions with answer choices and one correct answer.
- Allow the student to review generated questions before taking the quiz.
- Reject or regenerate questions that do not have a valid answer.
- Clearly show an error if quiz-question generation fails.

### Quiz results

- Display the final quiz score.
- Display the number of correct answers.
- Display the total number of questions.

### Reminders and notifications

- Identify study tasks with upcoming deadlines.
- Display a reminder for an upcoming deadline.
- Identify the subject and task associated with each reminder.
- Avoid changing task completion status when a reminder fails.

## 10. Non-functional requirements

- The interface should be simple enough for a college student to use easily.
- Students should be able to create study tasks quickly.
- The system should show clear validation errors.
- Completed and incomplete tasks should be easy to identify.
- Quiz questions and answers should be easy to read.
- Quiz scores should be calculated correctly.
- AI-generated study plans and quiz questions should be reviewable and editable before use.
- Every generated quiz question must have a valid correct answer.
- The system should handle AI service failures without losing existing subjects, tasks, or quiz results.
- AI requests should not expose real student personal information.
- Reminder timing should be based on the correct task deadline.
- The application should work in a current desktop browser at minimum.
- Demonstration data must not contain real student information.

## 11. Core data model

| Entity | Important fields | Relationship |
|---|---|---|
| User | id, name | Uses the application and manages study tasks. |
| Subject | id, name | Contains study tasks and quizzes. |
| StudyTask | id, subject id, title, deadline, status, source | Belongs to a subject; source identifies manual or AI-generated tasks. |
| StudyPlan | id, subject id, generated time, source | Groups or describes tasks generated for a subject. |
| Quiz | id, subject id, title, source | Contains quiz questions; source identifies manual or AI-generated quizzes. |
| Question | id, quiz id, question text | Belongs to a quiz. |
| AnswerChoice | id, question id, answer text, correct status | Provides answers for a question. |
| QuizResult | id, quiz id, score, completed time | Records the student's quiz score. |
| Notification | id, task id, scheduled time, sent time, status | Represents a reminder for a study-task deadline. |

## 12. Main workflow

```text
Student selects subject
        |
        v
Student creates study task
and sets deadline
        |
        v
System displays study task in study plan
        |
        +--> Optional: system generates a study-plan suggestion
        |    and student reviews or edits it
        |
        +--> Task incomplete: keep task open
        |
        v
System identifies upcoming deadline
        |
        +--> Optional: system displays or sends a reminder
        |
        v
Student marks task as completed
        |
        v
Student selects quiz
        |
        +--> Optional: system generates quiz questions
        |    and student reviews them
        |
        v
Student answers multiple-choice questions
        |
        v
Student submits quiz
        |
        +--> Check answers
        +--> Calculate score
        +--> Save quiz result
        |
        v
Student views quiz score
```

## 13. Risks and unknowns

| Risk / unknown | Why it matters | Plan |
|---|---|---|
| Study planning becomes too complicated | Students need a simple application that is easy to use. | Keep the core study plan as a simple task list with subjects, deadlines, and status. |
| Too many features | Extra features could delay the main project. | Finish and test the seven core MVP features before implementing AI generation and reminders. |
| AI-generated content may be inaccurate | Incorrect plans or quiz questions could confuse students. | Allow students to review and edit generated content, validate correct answers, and provide fallback manual content. |
| AI service may fail or be unavailable | The main workflow could be interrupted. | Show a clear error message and keep the core manual workflow available. |
| Reminder timing may be incorrect | Students may miss deadlines or receive unnecessary notifications. | Use a simple reminder schedule and test it with different deadlines. |
| Incorrect task status | Students could become confused about completed tasks. | Use simple `Pending` and `Completed` statuses. |
| Incorrect quiz score | The score must match the student's answers. | Test the quiz with different answers before the demo. |
| Technical stack not yet confirmed | Development needs a common setup. | Agree on the framework and database before development. |

## 14. Main risk mitigation detail

Initial mitigation: The study planning and quiz features will be kept simple. Study tasks will use clear `Pending` and `Completed` statuses. Quiz questions will have predefined correct answers, and the quiz calculation will be tested with multiple sample answers before the demo.

For the newly in-scope AI and reminder features, the team will first complete the core manual workflow. AI-generated plans and questions will be reviewable before use, and the application will provide a clear fallback when an AI call fails. Reminders will be treated as a stretch feature until the MVP is stable.

## 15. Midterm demonstration scenario

The team will create a Programming subject with two study tasks. The student will add deadlines to the tasks and mark one task as completed. The student will then take a short multiple-choice quiz and view the score after submission.

## 16. Evidence links

- Planning Issue: To be added.
- Weekly Report:
- Idea Selection:
- Wireframe or prototype proof: To be added.

## 17. Open questions for team review

- Which web framework and database will the team use?
- Will the first version include a login screen, or will it use a simple demo student account?
- How many subjects should be included in the demonstration?
- How many questions should the quiz contain?
- Which team member will own the study-task implementation?
- Which team members will own AI study-plan generation, AI quiz-question generation, and reminders?
- Which AI model or service will be used, and what is the fallback if it is unavailable?
- How often should deadline reminders be displayed or sent?
- Will AI-generated content require student approval before it is saved?
