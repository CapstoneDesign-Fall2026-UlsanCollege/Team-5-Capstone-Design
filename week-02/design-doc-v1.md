# Design Doc v1

**Team:** Team 3  
**Project name:** Smart Study Companion  
**Last updated:** 2026-09-16

## 1. Project purpose
Smart Study Companion is a web application for college students. It combines subject management, study tasks, deadlines, task completion, and simple multiple-choice quizzes in one workflow.

College students may have many study tasks, assignments, and exams to manage. This makes it difficult to remember deadlines and prepare effectively for exams.

## 2. Target users

| Role | Main responsibilities |
|---|---|
|student | Manage subjects, create study tasks, set deadlines, complete tasks, take quizzes, and view quiz scores. |


## 3. Smallest useful version

The smallest useful version is a web application that supports this complete workflow:

A student creates a subject and adds study tasks.
A student sets deadlines for the study tasks.
The system displays the tasks in a study plan.
The student marks a study task as completed.
The student takes a simple multiple-choice quiz.
The system calculates and displays the quiz score.

### Rough user flow

Start -> Add Subject and Study Tasks -> Set Deadline -> Mark Task Completed -> Take Quiz -> View Quiz Score

Evidence / sketch link: [User Flow Sketch](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/0b3e6eaf8c119bdbc936059bbabf11ba8e5084ab/week-02/User%20Flow%20Sketch.jpg)

## 4. In scope

-Student view for subjects and study tasks.
-Creating study tasks and deadlines. 
- Study plan view.
-Marking study tasks as completed. 
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

A student adding a Programming subject, creating study tasks with deadlines, marking a task as completed, taking a short multiple-choice quiz, and viewing the quiz score.

## 7. Final demo sentence

Our final demo will prove:

Smart Study Companion can help a student organize study tasks and deadlines, mark completed tasks, take a simple quiz, and view the quiz score.

## 8. MVP features

| Feature | Required for MVP? | Primary implementation owner | Research, design, or testing support | Issue link |
|---|---|---|---|---|
| Subject management                 | Yes               | Khadka Nabin                  | Khadka Nabin: Requirements research                | To be added |
| Study task management              | Yes               | Oli J.N. Taj                  |Oli J.N. Taj:Interface design                     |[Issue#2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/2)  |
| Deadline management                | Yes               | Khadka Nabin                  | Adhikari Sumit:Workflow research                    | To be added |
| Study plan                         | Yes               | Khadka Nabin                  | Karki Prince:Interface design                     | To be added |
| Task completion                    | Yes               | Oli J.N. Taj                 | Rai Prabin:Testing                              |[Issue#2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/2) |
| Multiple-choice quiz               | Yes               | Khadka Nabin                 | Khadka Nabin:Quiz design                          | To be added |
| Quiz score                         | Yes               | Karki Prince                  | Khadka Nabin:Testing                              |[Issue#3](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/3) |



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

### Quizzes

- Add simple multiple-choice questions.
- Display answer choices for each question.
- Allow students to select answers.
- Submit the quiz.
- Check the selected answers.
- Calculate the quiz score.

### Quiz results

- Display the final quiz score.
- Display the number of correct answers.
- Display the total number of questions.

## 10. Non-functional requirements

- The interface should be simple enough for a college student to use easily.
- Students should be able to create study tasks quickly.
- The system should show clear validation errors.
- Completed and incomplete tasks should be easy to identify.
- Quiz questions and answers should be easy to read.
- Quiz scores should be calculated correctly.
- The application should work in a current desktop browser at minimum.
- Demonstration data must not contain real student information.

## 11. Core data model

| Entity | Important fields | Relationship |
|---|---|---|
| User         | id, name                                     | Uses the application and manages study tasks. |
| Subject      | id, name                                     | Contains study tasks and quizzes.             |
| StudyTask    | id, subject id, title, deadline, status      | Belongs to a subject.                         |
| Quiz         | id, subject id, title                        | Contains quiz questions.                      |
| Question     | id, quiz id, question text                   | Belongs to a quiz.                            |
| AnswerChoice | id, question id, answer text, correct status | Provides answers for a question.              |
| QuizResult   | id, quiz id, score, completed time           | Records the student's quiz score.             |


## 12. Main workflow

```text
Student selects subject
	|
	v
Student creates study task
and sets deadline
	|
	v
System displays study task
	|
	+--> Task incomplete: keep task open
	|
	v
Student marks task as completed
	|
	v
Student selects quiz
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
| Study planning becomes too complicated | Students need a simple application that is easy to use. | Keep the study plan as a simple task list with subjects, deadlines, and status. |
| Too many features                      | Extra features could delay the main project.            | Focus on subjects, tasks, deadlines, completion, and quizzes.                   |
| Incorrect task status                  | Students could become confused about completed tasks.   | Use simple `Pending` and `Completed` statuses.                                  |
| Incorrect quiz score                   | The score must match the student's answers.             | Test the quiz with different answers before the demo.                           |
| Technical stack not yet confirmed      | Development needs a common setup.                       | Agree on the framework and database before development.                         |
|Reminder feature could increase development complexity|Notification timing and permission behavior may delay the core MVP.|Keep reminders out of the MVP and show upcoming tasks by deadline instead.|


## 14. Main risk mitigation detail

Initial mitigation: The study planning and quiz features will be kept simple. Study tasks will use clear Pending and Completed statuses. Quiz questions will have predefined correct answers, and the system will calculate the score after the student submits the quiz. The team will manually test task completion and quiz scoring before the demonstration.

## 15. Midterm demonstration scenario

The team will create a Programming subject with two study tasks. The student will add deadlines to the tasks and mark one task as completed. The student will then take a short multiple-choice quiz and submit the answers. The system will calculate and display the quiz score.
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
