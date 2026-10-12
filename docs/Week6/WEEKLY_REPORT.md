# Week 6 Weekly Report — Test the Vertical Slice

**Team:** Team 5 (Smart Study Companion)  
**Week:** 6  
**Date:** Thu 2026-10-08 to Wed 2026-10-14  
**Report Status:** Evidence review complete; theme issue remains open

---

## This week's goal

Week 6 focuses on **testing the Week 5 vertical slice** by running a real end-to-end test with a teammate who was not involved in the implementation. The team will document the testing process, record results, link evidence, and prepare the foundation for the midterm demo.

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

**Related Issue:** [Issue #23 — Complete End-to-End Student User Path Test Validation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23)

**Test steps** (from Tested-By Note):

1. Choose a subject and add a study task with a deadline.
2. Open the Study Plan, find the task, and mark it as completed.
3. Open Quiz, choose the same subject, take the quiz, and submit the answers.
4. Refresh the page and verify that the task/completion and relevant data remain.

**Expected result:**  
The user can complete the entire study flow from subject selection → task → study plan → completion → subject-based quiz → score without errors.

**Actual result:**  
The prototype opens and the end-to-end student path is visible. Screenshots show the main page, subject/task flow, quiz flow, and persistence check. The main functional path is usable, but the theme/color inconsistency is still a visible issue that should remain open until fixed.


**Proof links / screenshots:**

- [Demo 1 - Main Page Entry](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%201.png)
- [Demo 2 - Theme Color Issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo2.png)
- [Demo 3 - Subject & Task Creation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%203.png)
- [Demo 4 - Quiz Flow & Results](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%204.png)
- [Demo 5 - Data Persistence After Refresh](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%205.png)

**Problems found:**  
Theme/color inconsistency is visible [Issue 25](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/25).

**Next action:**  
for now assign the UI owner, and repeat the same demo path after the visual fix.

---

## Evidence links

| Evidence type | Link | Status |
|---|---|---|
| **Tested-By Note** | [docs/Week6/tested-by-notes.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/tested-by-notes.md) | Evidence linked; exact tester confirmation still needed |
| **Implementation Issue** | [Issue #23 — Bug: Complete End-to-End Student User Path Test Validation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23) | Open |
| **Related Feature Issue** | [Issue #25 ](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/25) | Open |
| **Week 5 worklist** | [docs/week5/WEEK_5_WORKLIST.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week5/WEEK_5_WORKLIST.md) | Recorded |
| **Week 6 worklist** | [docs/Week6/WEEK6_WORKLIST.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/WEEK6_WORKLIST.md) | Updated by this report |
| **Commit or PR** | This PR: docs evidence and midterm readiness update | In review |
| **Screenshot/Demo/Video** | Demo 1-5 screenshots linked above | Recorded |
| **Bug or blocker Issue** | Theme/color issue should be tracked from Demo 2 | Needs issue/status update |

---

## Individual contribution entries

| Student | What they did | Evidence link |
|---|---|---|
| liftupkhadka555-spec | Project coordination, proof collection, and Week 6 evidence review | [Week 6 tested-by note](tested-by-notes.md) |
| adronnie | Technical support and database/backend scope discussion | [Week 6 feedback](WEEK6_FEEDBACK_AND_SUGGESTIONS.md) |
| princekark | Repeat Tester role and feedback/report ownership | [Week 6 feedback](WEEK6_FEEDBACK_AND_SUGGESTIONS.md) [repeat test](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23#issuecomment-6128260620) |
| RaiPrabin697 | Tester/evidence support and documentation consistency review | [Week 6 tested-by note](tested-by-notes.md) |
| jn-oli |Reviewed and updated the Week 6 Weekly Report, checked the evidence links, documented the theme inconsistency found during demo review, and identified missing tester confirmation and Issue-status updates. Prepared the next actions for fixing the theme issue and repeating the end-to-end test.| [blocker-issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/25), [weekly-report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/b475dfc5fd1b0a4af554030672bc8db6ad165a39/docs/Week6/WEEKLY_REPORT.md), [issue23](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23) |

---

## Risks and exceptions

If a core item is incomplete, record the owner, reason, and next action below:

| Item | Owner | Reason | Next action | Review point |
|---|---|---|---|---|
| Theme/color inconsistency | Sumit Adhikari, Nabin Khadka | Visible issue recorded in Demo 2 | Create/update issue, fix CSS, and repeat demo path | Tester reruns Demo 1-5 path |
| Database/backend scope | team | Scope is still being discussed | Decide whether midterm remains localStorage-only | Update report and issue status |

---

## Stretch work — optional after core completion

If core work is complete, consider these extensions to strengthen testing and midterm readiness:

### Stronger user test
- [ ] Ask a teammate unfamiliar with the implementation to try the path from a clean start.
- [ ] Test one empty, error, loading, or recovery state.
- [ ] Write one success signal and show how the current test observes it.

### Better technical evidence
- [ ] Turn the manual check into a repeatable smoke test.
- [ ] Add setup notes so another teammate can run the slice.
- [ ] Fix one bug found during the test and repeat.

### Better midterm path
- [x] Write the first 3–5 steps of the midterm demo path.
- [x] List one claim the team can already prove and one it cannot yet prove.
- [x] Identify one improvement for the Week 7 rehearsal.

## Context and links

**Previous reports and planning:**
- [Week 5 Vertical Slice](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week5/WEEK_5_WORKLIST.md) — App scaffolding, component development, and localStorage integration
- [Week 4 Chuseok Checkpoint](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week4/chuseok-checkpoint.md) — Technology stack confirmed (React + Vite + localStorage)
- [Week 3 Sprint 0 Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week3/sprint-0-report.md) — Project scope and initial vertical slice definition
- [Team Working Agreement](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week1/project_agreement.md) — Roles, communication, and expectations

**All open GitHub Issues:**
- [#23 — Bug: Complete End-to-End Student User Path Test Validation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23)
- [#22 — Feature: Subject-Based Task & Quiz Selection](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/22)
- [#21 — Week 5 Track 1: Set up React + Vite project scaffolding](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/21)
- [Full issue list](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues)

---

**Next week's bridge task:**

-Fix the theme/color inconsistency and repeat the same end-to-end student demo path.
-Prepare the Week 7 rehearsal using the confirmed working workflow and identify one improvement based on the retest.
