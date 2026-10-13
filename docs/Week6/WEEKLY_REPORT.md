# Week 6 Weekly Report - Test the Vertical Slice

**Team:** Team 5 (Smart Study Companion)  
**Week:** 6  
**Date:** Thu 2026-10-08 to Wed 2026-10-14  
**Report Status:** Main flow evidence recorded; theme issue remains open; Issue #23 remains open pending rerun after the theme fix

---

## This week's goal

Week 6 focuses on testing one visible student path and recording honest evidence for midterm readiness. The tested path is the subject/task/quiz/persistence flow shown in Demo 1-5.

---

## Minimum evidence answers

| Question | Current answer |
|---|---|
| What exact behavior was tested? | Subject/task/quiz/persistence five-demo path. |
| Who tested it? | `RaiPrabin697` on 2026-10-08. |
| Was the tester different from theme/CSS owner? | Yes. `RaiPrabin697` is recorded for test/evidence support; theme ownership remains tracked in Issue #25 with owner to confirm. |
| What were the repeatable steps? | Open app, create/select subject, add task, mark completed, take quiz, review score, refresh, verify local data remains. |
| What was expected? | The full flow works without major errors and relevant data remains in the same browser/localStorage context after refresh. |
| What actually happened? | Main flow is visible and usable in Demo 1, 3, 4, and 5. Demo 2 shows a theme/color inconsistency that remains open. |
| What proof supports the claim? | Demo 1-5 screenshots and the documentation commits/PRs listed below. |
| Does issue status match the result? | Issue #23 remains open until the theme follow-up and rerun evidence are complete. Issue #25 is the canonical theme tracker. |
| Where are contribution rows? | See the table below and `docs/CONTRIBUTION_LEDGER.md`. |
| What remains incomplete? | Theme/CSS fix, exact owner confirmation for Issue #25, rerun of the same five-demo path after the fix, and any separate personal receipts if required. |

---

## Test plan and status

### End-to-End Student User Path Test

**Related validation issue:** [Issue #23 - End-to-End Student User Path Test Validation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23)

**Canonical theme tracker:** [Issue #25 - Fix Theme and Color Inconsistency](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/25)

**Tester:** `RaiPrabin697`  
**Date:** 2026-10-08

**Test steps:**

1. Choose or create a subject and add a study task with a deadline.
2. Open the Study Plan, find the task, and mark it completed.
3. Open Quiz, choose the same subject, answer questions, and submit.
4. Review the quiz score.
5. Refresh the page and verify that relevant local data remains in the same browser/localStorage context.

**Expected result:**  
The user can complete the full flow from subject selection -> task creation -> study plan -> completion -> subject-based quiz -> score review. Relevant data remains after refresh in the same browser/localStorage context.

**Actual result:**  
The prototype opens and the main end-to-end student path is visible and usable. Screenshots show the main page, subject/task flow, quiz flow, and persistence check. Demo 2 shows a theme/color inconsistency that does not block the demonstrated behavior.

**Proof links / screenshots:**

- [Demo 1 - Main Page Entry](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%201.png)
- [Demo 2 - Theme Color Issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo2.png)
- [Demo 3 - Subject & Task Creation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%203.png)
- [Demo 4 - Quiz Flow & Results](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%204.png)
- [Demo 5 - Data Persistence After Refresh](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%205.png)

Additionally, the documentation updates were made in PR #24 and related commits for Week 6 evidence:

- [PR #24 - docs: strengthen Week 6 evidence and midterm readiness](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/24)
- Commits referenced in the Week 6 evidence: 
  - https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/0d91404
  - https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/8ce17cb
  - https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/a2ab91d
  - https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/9a52fe6

---

## Evidence links

| Evidence type | Link | Status |
|---|---|---|
| Tested-By Note | [docs/Week6/tested-by-notes.md](tested-by-notes.md) | Tester/date/proof recorded; rerun pending after theme fix |
| Validation Issue | [Issue #23](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23) | Open and aligned with this report |
| Theme Issue | [Issue #25](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/25) | Open; owner to confirm |
| Contribution Ledger | [docs/CONTRIBUTION_LEDGER.md](../CONTRIBUTION_LEDGER.md) | Rows recorded for all five current logins |
| Demo Proof | Demo 1-5 screenshots above | Recorded |

---

## Individual contribution entries

| Login | What they did | Evidence link | Receipt status |
|---|---|---|---|
| `liftupkhadka555-spec` | Coordination, proof collection, and evidence review | [Week 6 tested-by note](tested-by-notes.md) | Pending if separate receipt is required |
| `adronnie` | Formal report ownership and technical scope notes | [Sprint 1 / Week 6 formal report](SPRINT_2_FORMAL_REPORT.md) | Pending if separate receipt is required |
| `princekark` | Repeat-test feedback and report support | [Week 6 feedback](WEEK6_FEEDBACK_AND_SUGGESTIONS.md) | Pending if separate receipt is required |
| `RaiPrabin697` | Tester/evidence support, docs reconciliation, and Issue #23 update | [Tested-by note](tested-by-notes.md), [Issue #23](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23) |
| `jn-oli` | Weekly report review, theme issue tracking, and evidence consistency support | [Issue #25](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/25) | |

---

## Risks and exceptions

| Item | Owner | Reason | Next action | Review point |
|---|---|---|---|---|
| Theme/color inconsistency | owner to confirm in Issue #25 | Visible issue recorded in Demo 2 | Fix CSS/theme and repeat the same five-demo path | Tested-by note and Issue #23 match rerun result |
| localStorage/browser-only scope | Team 5 | Current proof is browser-local only | Keep README/report wording explicit; do not claim backend, login, sync, or multi-device behavior | Evidence remains browser-local and clearly scoped |
| Personal evidence receipts | Each login if required | Separate receipts are not all linked yet | Link each receipt if the team uses personal receipts | Contribution ledger stays complete |

---

## Midterm bridge task

- Fix the theme/color inconsistency and repeat the same end-to-end student demo path.
- After the visual/theme repair, rerun the persistence check and explicitly verify that the fix did not change localStorage/browser persistence behavior; attach updated screenshots or notes and confirm in Issue #23.
- Update Issue #23, Issue #25, the tested-by note, and this report with the rerun result and any new proof links (screenshots, commits, or PRs).

