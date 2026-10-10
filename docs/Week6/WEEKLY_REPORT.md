# Week 6 Weekly Report — Test the Vertical Slice

**Team:** Team 5 (Smart Study Companion)  
**Week:** 6  
**Date:** Thu 2026-10-08 to Wed 2026-10-14  
**Report Status:** In Progress

---

## This week's goal

Week 6 focuses on **testing the Week 5 vertical slice** by running a real end-to-end test with a teammate who was not involved in the implementation. The team will document the testing process, record results, link evidence, and prepare the foundation for the midterm demo.

---

## What we committed to do

### Core work — complete all

- [ ] **Run one real test**
  - [ ] Choose one small user-visible behavior from the Week 5 vertical slice.
  - [ ] Write repeatable test steps.
  - [ ] State the expected result before running the test.
  - [ ] Ask a teammate other than the author to follow the steps without coaching.
  - [ ] Record the actual result, including confusing or missing behavior.
  - [ ] If the test fails, record the first failing step.

- [ ] **Connect the test to the work**
  - [ ] Complete a Tested-By Note with tester, date, steps, expected/actual results, proof link, problem found, and next action.
  - [ ] Update the relevant Issue's Definition of Done and status.
  - [ ] Link commit/PR and screenshot/demo/video when relevant.
  - [ ] If blocked, create or update an Issue with blocker details, owner, and next action.

- [ ] **Record team and individual evidence**
  - [ ] Update one shared Week 6 Weekly Report (this document).
  - [ ] Each student enters their contribution sentence and evidence link.
  - [ ] Each student completes and links an Individual Evidence Receipt.
  - [ ] Keep personal data, secrets, and unapproved real-user data out of shared evidence.

---

## Test plan and status

### End-to-End Student User Path Test

**Related Issue:** [Issue #23 — Bug: Complete End-to-End Student User Path Test Validation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23)

**Test steps** (from Tested-By Note):

1. Choose a subject and add a study task with a deadline.
2. Open the Study Plan, find the task, and mark it as completed.
3. Open Quiz, choose the same subject, take the quiz, and submit the answers.
4. Refresh the page and verify that the task/completion and relevant data remain.

**Expected result:**  
The user can complete the entire study flow from subject selection → task → study plan → completion → subject-based quiz → score without errors.

**Actual result:**  
<img width="1911" height="897" alt="Demo 1" src="https://github.com/user-attachments/assets/2b2aac5b-cdad-4e6d-a9db-c2eada98b2f9" />


**Proof link / screenshot:**  
https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%201.png?raw=true

**Problems found:** (In theme color) 
https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/a6d335fc3e1472d3a2efcfab8ff4288248137102/docs/Week6/Demo2.png

**Next action:**  
*(To be updated)*

---

## Evidence links

| Evidence type | Link | Status |
|---|---|---|
| **Tested-By Note** | [docs/Week6/tested-by-notes.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/tested-by-notes.md) | In Progress |
| **Implementation Issue** | [Issue #23 — Bug: Complete End-to-End Student User Path Test Validation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23) | Open |
| **Related Feature Issue** | [Issue #22 — Feature: Subject-Based Task & Quiz Selection](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/22) | Open |
| **Week 5 Vertical Slice Plan** | [docs/week5/VERTICAL_SLICE_PLAN.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week5/VERTICAL_SLICE_PLAN.md) | *(Link to create if missing)* |
| **Week 5 Setup Instructions** | [docs/week5/SETUP_INSTRUCTIONS.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week5/SETUP_INSTRUCTIONS.md) | *(Link to create if missing)* |
| **Week 5 Weekly Report** | [docs/week5/WEEKLY_REPORT.md](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week5/WEEKLY_REPORT.md) | *(Link to create if missing)* |
| **Commit or PR** | *(To be filled in)* | Pending |
| **Screenshot/Demo/Video** | *(To be filled in)* | Pending |
| **Bug or blocker Issue** | *(To be created if needed)* | Pending |

---

## Individual contribution entries

| Student | What they did | Evidence link |
|---|---|---|
| liftupkhadka555-spec | *(To be filled in)* | *(To be linked)* |
| adronnie | *(To be filled in)* | *(To be linked)* |
| princekark | *(To be filled in)* | *(To be linked)* |
| RaiPrabin697 | *(To be filled in)* | *(To be linked)* |
| jn-oli | *(To be filled in)* | *(To be linked)* |

---

## Risks and exceptions

If a core item is incomplete, record the owner, reason, and next action below:

| Item | Owner | Reason | Next action | Review point |
|---|---|---|---|---|
| *(To be filled in if applicable)* | | | | |

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
- [ ] Write the first 3–5 steps of the midterm demo path.
- [ ] List one claim the team can already prove and one it cannot yet prove.
- [ ] Identify one improvement for the Week 7 rehearsal.

---

## Final check

- [ ] Another teammate can repeat the test using the written steps.
- [ ] The evidence supports the claim and the Issue status is honest.
- [ ] The next midterm-demo improvement is assigned and visible in GitHub.

---

## Context and links

**Previous reports and planning:**
- [Week 5 Vertical Slice](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week5/WEEK_5_WORKLIST.md) — App scaffolding, component development, and localStorage integration
- [Week 4 Chuseok Checkpoint](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week4/chuseok-checkpoint.md) — Technology stack confirmed (React + Vite + localStorage)
- [Week 3 Sprint 0 Report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week3/sprint-0-report.md) — Project scope and initial vertical slice definition
- [Team Working Agreement](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week1/project_agreement.md) — Roles, communication, and expectations

**All open GitHub Issues:**
- [#23 — Bug: Complete End-to-End Student User Path Test Validation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23)
- [#22 — Feature: Subject-Based Task & Quiz Selection](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/22)
- [#21 — Week 5 Track 1: Set up React + Vite project scaffolding](https://github.com/CapstoneDesign-Fall2026-UlsanCollele/Team-5-Capstone-Design/issues/21)
- [Full issue list](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues)

---

## How to update this report

1. **During Week 6:** Team members run the test and fill in the Tested-By Note.
2. **By Wednesday:** Each student adds their contribution row and evidence link.
3. **By Wednesday:** Update the Evidence links section with final PRs, screenshots, and any blockers.
4. **Final check:** Verify that all team members are represented and all links are active.

**Report owner:** J.N. Taj Oli (Evidence / documentation lead)  
**Last updated:** *(To be updated as work progresses)*
