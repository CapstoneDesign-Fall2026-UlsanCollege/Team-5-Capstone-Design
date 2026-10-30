# Week 6 Weekly Report — Test the Vertical Slice

**Team:** Team 5 (Smart Study Companion)  
**Week:** 6  
**Date:** Thu 2026-10-08 to Wed 2026-10-14  
**Report Status:** Evidence review complete; theme issue remains open

---

## This week's goal

Week 6 focuses on testing the Week 5 vertical slice by running a real end-to-end test with a teammate who was not involved in the implementation. The team documented the testing process, recorded results, linked evidence, and prepared the foundation for the midterm demo.

---

## What we committed to do

### Core work — complete all

- [x] **Run one real test**
  - [x] Choose one small user-visible behavior from the Week 5 vertical slice.
  - [x] Write repeatable test steps.
  - [x] State the expected result before running the test.
  - [x] Ask tester-role teammates to review the steps and screenshots.
  - [x] Record the actual result, including confusing or missing behavior.
  - [x] Record the first visible issue found: theme/color inconsistency.

- [x] **Connect the test to the work**
  - [x] Complete a Tested-By Note with steps, expected/actual results, proof links, problem found, and next action.
  - [ ] Update the relevant Issue's Definition of Done and status.
  - [x] Link screenshot/demo proof.
  - [x] Document the theme issue with owner and next action.

- [x] **Record team and individual evidence**
  - [x] Update one shared Week 6 Weekly Report (this document).
  - [ ] Each student confirms their contribution sentence and evidence link.
  - [ ] Each student completes and links the requested Individual Evidence Receipt if required by the team.
  - [x] Keep personal data, secrets, and unapproved real-user data out of shared evidence.

---

## Test plan and status

### End-to-End Student User Path Test

**Related Issue:** [Issue #23 — Bug: Complete End-to-End Student User Path Test Validation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23)

**Test steps** (from Tested-By Note):

1. Choose a subject and add a study task with a deadline.
2. Open the Study Plan and confirm the task appears.
3. Mark the task complete.
4. Open the quiz and answer the subject-based questions.
5. Submit and review the score.
6. Refresh the page and confirm the relevant data still remains.

**Expected result:**
The user can complete the visible end-to-end flow without major errors, and the task/quiz state remains after refresh.

**Actual result:**
The main flow is visible and functional, but the Demo 2 theme/color inconsistency remains a visible issue that should be fixed before final midterm proof.

**Proof links:**
- [Demo 1](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%201.png)
- [Demo 2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo2.png)
- [Demo 3](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%203.png)
- [Demo 4](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%204.png)
- [Demo 5](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%205.png)

**Problem found:**
Theme/color inconsistency in the visual UI remains open and should be tracked in Issue #25.

---
| Evidence type | Link | Status |
|---|---|---|
| **Tested-By Note** | [docs/Week6/tested-by-notes.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/2f12cab1b69a9e96c1c65f776e9df758f9bb5285/docs/Week6/tested-by-notes.md) | Done |
| **Implementation Issue** | [Issue #23 — Bug: Complete End-to-End Student User Path Test Validation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23) | Open |
| **Related Feature Issue** | [Issue #25 ](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/25) | Open |
| **Week 5 worklist** | [docs/week5/WEEK_5_WORKLIST.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week5/WEEK_5_WORKLIST.md) | Recorded |
| **Week 6 worklist** | [docs/Week6/WEEK6_WORKLIST.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/WEEK6_WORKLIST.md) | Updated by this report |
| **Commit or PR** | [Commit-Links](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commits/main/) | Linked |
| **Screenshot/Demo/Video** | Demo 1-5 screenshots linked above | Recorded |
| **Bug or blocker Issue** | [Issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/25) | updated |

---

## Individual contribution entries

| Student | Contribution row | Evidence |
|---|---| --- |
| Nabin Khadka | Coordination, proof collection, and report review.|https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/3c441eb147bc80c252ec4b1c61768633d592f797/docs/Week6/tested-by-notes.md |
| Sumit Adhikari | Frontend and theme issue ownership. |https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/a7a520ad50acd2eb9baaf7e2d6d9bead538c9b94/docs/Week6/SPRINT_2_FORMAL_REPORT.md |
| RaiPrabin697 | Tester/evidence support and documentation consistency review, test the user path | [Week 6 tested-by note](tested-by-notes.md)[Related issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23) |
| princekark | Repeat Tester role and feedback/report ownership | [Week 6 feedback](WEEK6_FEEDBACK_AND_SUGGESTIONS.md) [repeat test](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23#issuecomment-6128260620) |
| jn-oli |Reviewed and updated the Week 6 Weekly Report, checked the evidence links, documented the theme inconsistency found during demo review, and identified missing tester confirmation and Issue-status updates. Prepared the next actions for fixing the theme issue and repeating the end-to-end test.| [blocker-issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/25), [weekly-report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/b475dfc5fd1b0a4af554030672bc8db6ad165a39/docs/Week6/WEEKLY_REPORT.md), [issue23](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23) |


---

## Risks and exceptions

- Theme/color inconsistency in Demo 2 remains open.
- Browser-only localStorage scope is honest and should remain stated as current scope.

---

## Midterm bridge task

The team will fix the visible theme inconsistency, rerun the same Demo 1-5 path, and update the evidence links and issue status before the midterm presentation.
