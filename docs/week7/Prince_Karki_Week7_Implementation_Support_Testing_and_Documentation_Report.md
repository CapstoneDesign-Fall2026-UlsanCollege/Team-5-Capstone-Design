# Week 7 Implementation Support, Testing, and Documentation Report

**Project:** Smart Study Companion  
**Contributor:** Prince Karki  
**GitHub Username:** princekark  
**Role:** Implementation Support, Testing, and Documentation  
**Reporting Period:** Week 7 — Midterm Preparation  
**Document Status:** Testing and Contribution Record  
**Evidence Directory:** [docs/week7/docs/week7/evidence](docs/week7/docs/week7/evidence)

## 1. Introduction

This report documents the Week 7 contribution of Prince Karki for the Smart Study Companion project. Based on the repository evidence and the existing Week 7 documentation, the work focus was on supporting the team’s midterm preparation, reviewing the prototype flow, documenting testing-related findings, and helping organize evidence for the weekly report.

The project repository already contains relevant Week 7 evidence and documentation files, including the UI screenshots, the weekly report, the UI test suggestions, and the sprint quality quick checks. This report consolidates that evidence into a clear contribution record for Prince Karki while remaining explicit about what was observed and what was not formally verified.

## 2. Role and Responsibilities

### 2.1 Implementation Support
- Assisted the team by reviewing the current prototype flow and validating that the documented feature path matched the available evidence.
- Helped identify incomplete or unconfirmed areas requiring follow-up before the midterm presentation.
- Recorded contribution context in the team’s documentation and evidence trail.

### 2.2 Application Testing and Quality Assurance
- Reviewed the documented task and quiz workflow against the app screenshots and project reports.
- Helped confirm the main user path: subject flow, task flow, quiz flow, and result presentation.
- Recorded that the repository contains evidence screenshots, but that the exact execution log and pass/fail tester record were not fully completed in the available documents.

### 2.3 Documentation and Reporting
- Contributed to the team’s Week 7 reporting trail by supporting documentation updates and evidence review.
- Used the project’s existing Week 7 files as the basis for an accurate contribution summary.
- Prepared this individual record to distinguish verified visual evidence from items still requiring formal testing or retesting.

## 3. Objectives

The main objectives for this Week 7 contribution were to:

- support the team’s review of the current study planner prototype,
- compare the documented workflow against available evidence,
- identify gaps in verification and follow-up requirements,
- keep the team’s reporting honest and traceable,
- produce documentation that supports the midterm presentation without overstating unverified claims.

## 4. Scope of Testing

The testing scope reflected the project’s documented demo path:

Subject selection → Task creation → Task completion → Subject-based quiz → Quiz submission → Data persistence after refresh

This report relies on the Week 7 repository evidence rather than claiming a complete end-to-end formal test log that was not captured in the files reviewed.

## 5. Test Environment and Execution Record

| Field | Details |
|---|---|
| Tester | Prince Karki |
| GitHub username | princekark |
| Test date and time | Not explicitly recorded in the repository evidence reviewed for Week 7 |
| Application URL or environment | Not explicitly recorded in the repository evidence reviewed for Week 7 |
| Branch or commit tested | Not explicitly recorded in the repository evidence reviewed for Week 7 |
| Starting state | Week 7 evidence shows the app dashboard and main screens, but the repository does not provide a complete clean-state log or tester-by-test timestamped session record |
| Browser or device | Not explicitly recorded in the repository files reviewed |
| Related GitHub issue | [Issue #23 – End-to-End Student User Path Test Validation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23) |
| Status definitions | Pass = observed behavior met expectation; Fail = observed behavior did not meet expectation; Blocked = could not complete because of blocker; Not Run = not executed or not documented |

## 6. Functional Test Cases

### Test Case 1: Subject Selection or Creation
- Objective: Verify that a user can choose or create a subject.
- Expected result: A subject is selected or created successfully and can be used for later task and quiz operations.
- Actual result: The project evidence shows the dashboard and subject/task-related screens, but there is no complete recorded tester log documenting a formal subject-creation execution and result.
- Status: Not Run (evidence exists, but no formal execution record was found)
- Evidence: [Main Dashboard](docs/week7/docs/week7/evidence/Main%20DashBoard.png)

![Main Dashboard](docs/week7/docs/week7/evidence/Main%20DashBoard.png)

### Test Case 2: Task Creation and Deadline
- Objective: Verify that a task can be created with the correct deadline and associated subject.
- Expected result: A task is saved and displayed with the correct information.
- Actual result: The repository contains a task-creation screenshot, but no formal pass/fail log tying the image to a recorded tester session or exact deadline validation result.
- Status: Not Run (screen evidence available; no complete test record in the reviewed repo files)
- Evidence: [Add New Task](docs/week7/docs/week7/evidence/Add%20New%20Task.png)

![Add New Task](docs/week7/docs/week7/evidence/Add%20New%20Task.png)

### Test Case 3: Task Completion
- Objective: Verify that a task can be marked as completed.
- Expected result: The task status updates and remains visible after navigating or refreshing.
- Actual result: The project evidence includes task view screenshots, but there is no detailed recorded completion-test outcome tied to Prince Karki’s execution.
- Status: Not Run
- Evidence: [Open Study Task](docs/week7/docs/week7/evidence/open%20study%20task.png)

![Open Study Task](docs/week7/docs/week7/evidence/open%20study%20task.png)

### Test Case 4: Subject-Based Quiz
- Objective: Verify that the quiz corresponds to the selected subject.
- Expected result: Questions displayed are relevant to the selected subject.
- Actual result: A quiz screen is present in the repository evidence, but no verified tester note documents the exact subject-to-quiz correctness result.
- Status: Not Run
- Evidence: [Open Quiz](docs/week7/docs/week7/evidence/Open%20Quiz.png)

![Open Quiz](docs/week7/docs/week7/evidence/Open%20Quiz.png)

### Test Case 5: Quiz Submission and Result
- Objective: Verify quiz answers produce the expected result.
- Expected result: The result screen displays a score and feedback consistent with the submitted responses.
- Actual result: The repo includes a quiz result screenshot, but the files reviewed do not provide a complete tester record confirming the exact scoring outcome against known answers.
- Status: Not Run
- Evidence: [Quiz Result](docs/week7/docs/week7/evidence/Quiz%20Result.png)

![Quiz Result](docs/week7/docs/week7/evidence/Quiz%20Result.png)

### Test Case 6: Data Persistence After Refresh
- Objective: Verify that the main data remains available after refresh.
- Expected result: Subject, task status, quiz result, and relevant saved values remain visible after reload.
- Actual result: The repository mentions persistence checks in the project documentation, but the reviewed Week 7 artifacts do not include a complete before/after tester result or screenshot for refresh persistence tied to Prince Karki.
- Status: Not Run
- Evidence: [Week 7 evidence package](docs/week7/docs/week7/evidence/README.md), project documentation in [docs/week7/midterm-demo-script.md](docs/week7/midterm-demo-script.md)

### Test Case 7: Missing or Invalid Task Information
- Objective: Determine how the application handles incomplete task information.
- Expected result: The app should prevent invalid or incomplete task submission and show an understandable error or validation message.
- Actual result: No formal failure-handling test for this scenario was found in the reviewed Week 7 repository records.
- Status: Not Run
- Evidence: Not available in the project evidence reviewed

### Test Case 8: Missing Data or Refresh Recovery
- Objective: Check whether the app handles missing or unavailable data sensibly.
- Expected result: The app should provide an empty state, error message, or recovery entry point rather than misleading the user.
- Actual result: No formal recovery-state test or evidence was found in the reviewed Week 7 project files.
- Status: Not Run
- Evidence: Not available in the project evidence reviewed

## 7. Defect Reporting and Implementation Support

### Implementation support record

The repository’s Week 7 weekly report includes the following entry for Prince Karki:

> “Prince Karki | Supported testing and feedback/report follow-up for the prototype and demo review.”

This indicates that Prince contributed to review and reporting work, rather than claiming direct code-fix ownership. The weathering of the project evidence suggests that his role at this stage was support, verification assistance, and documentation coordination.

### Confirmed project observation from repository files

The project documents identify a notable UI risk: the visual theme and color consistency require improvement before final presentation. This is recorded in the midterm demo script and weekly report and should be treated as a known issue rather than an unverified claim.

## 8. Documentation Contributions

The repository already contains several Week 7 documentation files relevant to this work:

- [docs/week7/weekly-report.md](docs/week7/weekly-report.md)
- [docs/week7/ui-test-suggestions.md](docs/week7/ui-test-suggestions.md)
- [docs/week7/sprint-quality-quick-checks.md](docs/week7/sprint-quality-quick-checks.md)
- [docs/week7/midterm-demo-script.md](docs/week7/midterm-demo-script.md)
- [docs/week7/docs/week7/evidence/README.md](docs/week7/docs/week7/evidence/README.md)

As part of this report, I created a contribution record within the Week 7 folder to consolidate the actual evidence and maintain an accurate account of what was observed and what remains to be formally tested.

### Documentation change record

| Document | Change made | Evidence |
|---|---|---|
| Week 7 contribution report | Created a consolidated individual testing and documentation report for Prince Karki based on the available Week 7 evidence and documentation | This document |
| weekly-report.md | Reviewed and used as source material for contribution context and evidence summary | [Link](docs/week7/weekly-report.md) |
| ui-test-suggestions.md | Reviewed as the UI validation checklist for the app | [Link](docs/week7/ui-test-suggestions.md) |
| sprint-quality-quick-checks.md | Reviewed as the current sprint evidence checklist | [Link](docs/week7/sprint-quality-quick-checks.md) |
| midterm-demo-script.md | Reviewed as the main demo path and risk statement | [Link](docs/week7/midterm-demo-script.md) |

## 9. Evidence and Traceability

| Evidence ID | Description | Evidence link |
|---|---|---|
| E-01 | Main dashboard evidence | [Main Dashboard](docs/week7/docs/week7/evidence/Main%20DashBoard.png) |
| E-02 | Task creation evidence | [Add New Task](docs/week7/docs/week7/evidence/Add%20New%20Task.png) |
| E-03 | Study task evidence | [Open Study Task](docs/week7/docs/week7/evidence/open%20study%20task.png) |
| E-04 | Quiz flow evidence | [Open Quiz](docs/week7/docs/week7/evidence/Open%20Quiz.png) |
| E-05 | Result evidence | [Quiz Result](docs/week7/docs/week7/evidence/Quiz%20Result.png) |
| E-06 | Week 7 project documentation and contribution reference | [weekly-report.md](docs/week7/weekly-report.md) |

## 10. Risks, Limitations, and Outstanding Work

| Risk or limitation | Observed evidence | Current status | Recommended action |
|---|---|---|---|
| Data persistence | Project docs mention refresh/persistence checks, but no complete before/after record was attached in the reviewed evidence. | Unverified | Repeat the refresh check and capture before/after evidence. |
| Quiz correctness | Quiz screen and result screen exist, but no exact tester log compares answers to expected scores. | Unverified | Run a known-answer validation and record the result. |
| Failure handling | No explicit missing-info or invalid-input validation test was found. | Not tested | Add a controlled validation test for missing task data. |
| Visual consistency | Midterm demo script identifies a theme/color issue as a known problem. | Unresolved | Fix the UI theme issue and re-run demonstration evidence. |
| Evidence traceability | Screenshots exist, but the project-level records do not provide a full time-stamped verification trail for every test step. | Partial | Add a formal tester log and link it to each issue or observation. |

## 11. Midterm Presentation Preparation

For the midterm presentation, the honest, evidence-based contribution summary should be:

- Prince Karki supported the team’s Week 7 testing review and documentation follow-up.
- The project evidence includes relevant screenshots for the dashboard, task creation, task flow, quiz flow, and result screen.
- The repository also includes project risk notes indicating that exact tester validation and theme consistency still need follow-up.
- The presentation should clearly separate proven UI evidence from unverified or unrecorded workflow checks.
- Any final claim about workflow success must be tied to a recorded tester result, not only the presence of screenshots.

## 12. Individual Contribution Summary

### Implementation support:
Prince Karki supported the team by reviewing the prototype workflow, helping with the testing/report review, and documenting the evidence trail for the Week 7 midterm preparation work. No direct code-fix implementation was explicitly attributed to him in the Week 7 repository documentation reviewed.

### Testing:
The repository includes screenshots documenting the main UI flow, including the dashboard, task creation, study task, quiz, and result screens. However, the available Week 7 files do not provide a complete, time-stamped test log showing formally executed pass/fail results for each case tied directly to Prince Karki. Therefore, the most accurate position is that visual evidence exists, while formal validation remains partly unconfirmed.

### Documentation:
This report was created in the Week 7 directory to preserve a clear, traceable contribution record. It was based on the Week 7 project files and evidence set already present in the repository.

### Individual evidence:
- [docs/week7/weekly-report.md](docs/week7/weekly-report.md)
- [docs/week7/ui-test-suggestions.md](docs/week7/ui-test-suggestions.md)
- [docs/week7/midterm-demo-script.md](docs/week7/midterm-demo-script.md)
- [docs/week7/docs/week7/evidence/README.md](docs/week7/docs/week7/evidence/README.md)

### Outstanding work:
- complete formal pass/fail execution logs for the main workflow,
- verify refresh persistence with before/after evidence,
- perform a missing-data validation test,
- confirm the final theme fix and retest the visual consistency issue,
- capture a complete tester-by-test evidence trail for the final presentation.

## 13. Conclusion

This Week 7 report accurately reflects the evidence available in the repository and the documented role of Prince Karki in implementation support, testing review, and documentation. The project shows meaningful visual evidence for the dashboard, task workflow, quiz flow, and result screen, but it does not yet provide a complete formal execution record for every main workflow item. This report therefore represents a careful, evidence-based summary that stays truthful about what has been observed and what still remains to be validated before final presentation.

Prepared by: Prince Karki (princekark)  
Role: Implementation Support, Testing, and Documentation  
Last updated: 2026-10-21  
Related Weekly Report: [docs/week7/weekly-report.md](docs/week7/weekly-report.md)  
Related UI Testing Checklist: [docs/week7/ui-test-suggestions.md](docs/week7/ui-test-suggestions.md)
