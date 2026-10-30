# Week 7 Implementation Support, Testing, and Documentation Report

**Project:** Smart Study Companion  
**Contributor:** Prince Karki  
**GitHub Username:** princekark  
**Role:** Implementation Support, Testing, and Documentation  
**Reporting Period:** Week 7 — Midterm Preparation  
**Document Status:** Finalized Contribution Record  
**Evidence Directory:** [docs/week7/docs/week7/evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/main/docs/week7/docs/week7/evidence)

## 1. Introduction

This report documents Prince Karki's individual contribution to the Study Planner Application during Week 7, with a focus on implementation support, application testing, quality assurance, and technical documentation.

The purpose of this report is to provide a clear and verifiable record of the work performed, testing activities undertaken, issues identified, and supporting evidence collected during the midterm preparation period.

The report also supports the team's review of application readiness by distinguishing completed work from pending tests, unresolved defects, and planned improvements.

All implementation activities, test outcomes, and contribution claims must reflect work actually completed and must be supported by appropriate evidence where available.

## 2. Role and Responsibilities

I had organized into three areas.

### 2.1 Implementation Support
- Assist the team in reviewing the application's existing functionality.
- Help identify defects, inconsistent behavior, and incomplete workflows.
- Reproduce reported problems and provide clear information to the responsible developer.
- Assist with verifying fixes after implementation, where assigned.
- Record any code, configuration, or documentation changes personally completed.
- Link relevant commits, pull requests, or GitHub issues to establish traceability.

### 2.2 Application Testing and Quality Assurance
- Test the main subject, task, and quiz workflow.
- Verify task creation, deadline handling, and task completion.
- Check whether the quiz corresponds to the selected subject.
- Verify quiz submission and result presentation.
- Test whether relevant data persists after refreshing the application.
- Investigate selected failure scenarios and edge cases.
- Record expected and actual outcomes for each executed test.
- Report reproducible defects and assist with retesting fixes.

### 2.3 Documentation and Reporting
- Maintain accurate test records.
- Update the existing UI testing checklist with verified results where appropriate.
- Document defects, reproduction steps, and relevant evidence.
- Add a traceable contribution entry to the Week 7 Weekly Report.
- Maintain links to relevant issues, commits, pull requests, and screenshots.
- Help ensure that the midterm presentation accurately reflects the application's current status.

## 3. Objectives

The main objectives of this work are to:

- Support the team in improving the reliability of the Study Planner Application.
- Verify the core user workflow before the midterm presentation.
- Identify defects and incomplete behavior that may affect the demonstration.
- Establish a reproducible record of testing activities and outcomes.
- Improve traceability between testing, defect reporting, implementation support, and documentation.
- Provide verifiable evidence of individual contribution.
- Communicate current limitations and recommended follow-up actions to the team.

## 4. Scope of Testing

Testing focuses on the following workflow:

Subject selection → Task creation → Task completion → Subject-based quiz → Quiz submission → Data persistence after refresh

The workflow is intended to verify that the application's main features operate together rather than only functioning as isolated components.

Testing should begin from a known application state. Any relevant prerequisites, existing data, and environment limitations should be recorded before the test begins.

## 5. Evidence Directory

The actual Week 7 evidence files are stored in:

https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/main/docs/week7/docs/week7/evidence

## 6. Working Images

### Main Dashboard
![Main Dashboard](https://raw.githubusercontent.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/main/docs/week7/docs/week7/evidence/Main%20DashBoard.png)

### Add New Task
![Add New Task](https://raw.githubusercontent.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/main/docs/week7/docs/week7/evidence/Add%20New%20Task.png)

### Open Study Task
![Open Study Task](https://raw.githubusercontent.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/main/docs/week7/docs/week7/evidence/open%20study%20task.png)

### Open Quiz
![Open Quiz](https://raw.githubusercontent.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/main/docs/week7/docs/week7/evidence/Open%20Quiz.png)

### Quiz Result
![Quiz Result](https://raw.githubusercontent.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/main/docs/week7/docs/week7/evidence/Quiz%20Result.png)

### Dark Mode
![Dark Mode](https://raw.githubusercontent.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/main/docs/week7/docs/week7/evidence/Dark%20Mode%20.png)

## 7. Additional Quality Assurance Test Cases

### Test Case 6: Data Persistence After Refresh
Objective: Verify that relevant saved data remains available after the application is refreshed.

Procedure:

1. Create a subject or select an existing subject.
2. Create a task and record its deadline.
3. Mark the task as completed.
4. Record the quiz result, if applicable.
5. Refresh the application.
6. Revisit the relevant sections.
7. Check whether the subject, task details, completion status, and other expected persistent data remain available.

Expected Result: Data that the application is designed to persist remains available and is displayed consistently after refresh.

Actual Result: Record separately what happened to the subject, task, completion status, and quiz result.


### Test Case 7: Missing or Invalid Task Information
Objective: Determine how the application handles incomplete task information.

Procedure:

1. Open the task creation form.
2. Attempt to save a task with a required field missing or invalid, where the interface allows the attempt.
3. Observe the application's response.

Expected Result: The application handles invalid input appropriately, communicates the problem where necessary, and avoids creating an unintended invalid task.

Actual Result: Record the observed behavior.


### Test Case 8: Missing Data or Refresh Recovery
Objective: Investigate whether the application handles unavailable or missing data appropriately.

Procedure:

1. Use a safe, reproducible scenario involving missing data or an unsuccessful data retrieval, if the test environment permits.
2. Observe the interface and any error or recovery message.
3. Record whether the application remains usable and whether the user can recover.

Expected Result: The application presents an understandable empty, error, or recovery state rather than misleading the user about whether data was saved.

Actual Result: Record the observed behavior.



Safety note: Do not delete shared or production data to create a failure scenario. Use a controlled test environment and coordinate with the team when necessary.

## 8. Summary

I am supporting implementation review, validating the primary application flow, and documenting the testing evidence used to assess the project’s readiness for the midterm evaluation. This report provides a clear record of responsibilities, testing objectives, scope, and supporting visual evidence from the repository.

Prepared by: Prince Karki (princekark)  
Role: Implementation Support, Testing, and Documentation  
Last updated: 2026-10-21
