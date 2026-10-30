# Sprint 2 Formal Report

## Capstone Design Project

Prepared by: Team 5, Capstone Design Project  
Ulsan College  
Date: 2026-10-10

---

## 1. Introduction

This report documents the progress and evaluation of Sprint 2 for the Smart Study Companion project. The main purpose of this sprint was to validate the core student workflow and confirm that the project functions properly from the user's perspective.

The application focuses on helping students organize subjects, tasks, deadlines, and quiz activities in one place. During Sprint 2, the team worked on completing and testing the major features of the system, including subject creation, task tracking, completion status, quiz flow, and persistence after refresh.

This sprint was reviewed by a tester who was not directly involved in implementing the features, which provides a more objective evaluation of the usability and functionality of the application.

---

## 2. Sprint 2 Objectives

The primary goals of Sprint 2 were to:

- Confirm that the app loads successfully and works as a student-facing system.
- Verify subject and task management functionality.
- Check whether users can complete a study task and review progress.
- Test the quiz flow using subject-based questions.
- Ensure that user data remains available after refreshing the page.
- Identify UI/theme issues that may affect user experience.
- Prepare for the next improvement cycle and final validation.

---

## 3. Scope of Work Completed

The team completed and reviewed the following major features during Sprint 2:

- Main application entry and layout
- Subject selection and creation
- Task creation with deadlines
- Task completion workflow
- Quiz navigation and answer submission
- Result and score review
- Data persistence after page refresh

These features represent the core workflow for the student user journey and are directly tied to the project’s functional goals.

---

## 4. Testing and Validation Summary

The app was reviewed through five demo screenshots.

### Demo 1: Main Page and App Entry
- Purpose: Check whether the application opens correctly.
- Result: The app opened and displayed the main study planner interface.
- Status: Passed.

### Demo 2: Theme and Visual Consistency
- Purpose: Evaluate design, color theme, and layout consistency.
- Result: A visual/theme inconsistency was recorded.
- Status: Needs fix in Issue #25.

### Demo 3: Subject and Task Flow
- Purpose: Validate subject selection and task creation.
- Result: The subject/task flow was visible and usable.
- Status: Passed.

### Demo 4: Quiz Flow
- Purpose: Check quiz logic and result flow.
- Result: The quiz/result flow was visible and usable.
- Status: Passed.

### Demo 5: Persistence Check
- Purpose: Confirm whether relevant local data remains after refresh.
- Result: Persistence was shown in the same browser/localStorage context.
- Status: Passed.

---

## 5. Functional Results

The expected outcome was that a student could complete the visible workflow without a major functional error.

The evidence shows that the main flow is visible and usable:

- Open the app.
- Select or create a subject.
- Add a study task.
- Mark a task complete.
- Take a quiz.
- Review the score.
- Confirm local data remains after refresh in the same browser context.

The evidence also shows one open visual issue: the Demo 2 theme/color inconsistency.

---

## 6. Problems Identified

### 6.1 Theme and Color Inconsistency
- Severity: Polish / medium presentation concern.
- Description: The application shows inconsistent styling in some interface components.
- Impact: This affects visual quality and may reduce the professionalism of the app during presentation.
- Tracker: [Issue #25](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/25)
- Owner: owner to confirm.

### 6.2 Rerun Needed After Theme Fix
- Description: After the CSS/theme fix, the same five-demo path should be repeated.
- Impact: This confirms the visual repair did not change the working subject/task/quiz/persistence behavior.
- Tracker: Issue #23 and Issue #25.

---

## 7. Overall Assessment

Week 6 demonstrates meaningful progress because the core student workflow is visible and supported by screenshot evidence. The report should remain honest: the functional path has evidence, but the theme issue is not complete until it is fixed, rerun, and linked back to the tested-by note and issues.

---

## 8. Recommendations and Next Actions

1. Fix the visual theme and CSS consistency issue tracked in Issue #25.
2. Confirm the exact owner login for the theme fix.
3. Rerun the same five-demo path after the visual fix.
4. Confirm localStorage persistence still works after the visual change.
5. Update Issue #23, Issue #25, the tested-by note, and the weekly report with the rerun result.
6. Keep the localStorage/browser-only boundary explicit.

---

## 9. Conclusion

The Week 6 evidence shows a working visible prototype path for the main student flow and a clear remaining visual issue. The next midterm-readiness step is to fix the theme inconsistency, rerun the same path, and record the result without overstating scope.

---

Document Owner: Adhikari Ronnie

Document Status: Evidence reconciled; theme fix remains open
