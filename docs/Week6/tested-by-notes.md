# Tested-By Note

## What we checked

- **Behavior / related issue:** End-to-end student user path validation for Issue #23
- **Tested behavior:** subject/task/quiz/persistence five-demo path
- **Tested by:** `RaiPrabin697`
- **Date:** 2026-10-08
- **Tester role note:** The tester/evidence support role is separate from theme/CSS ownership. Theme ownership remains tracked in Issue #25.

## Repeatable steps

1. Open the Smart Study Companion app.
2. Choose or create a subject and add a study task with a deadline.
3. Open the Study Plan, find the task, and mark it completed.
4. Open Quiz, choose the same subject, answer questions, and submit.
5. Review the quiz score.
6. Refresh the page and verify that relevant local data remains available in the same browser/localStorage context.

## Expected result

The user can complete the full flow from subject selection -> task creation -> study plan -> completion -> subject-based quiz -> score review. Relevant data remains available after refreshing the page in the same browser/localStorage context.

## Actual result

The main flow is visible and usable in the prototype. Demo 1 shows the app entry. Demo 3 shows the subject/task flow. Demo 4 shows the quiz/result flow. Demo 5 shows persistence after refresh. Demo 2 shows a theme/color inconsistency that remains open in Issue #25 and must be fixed before final visual sign-off.

## Demo review summary

| Demo | Purpose | Screenshot | Observed result | Status |
|---|---|---|---|---|
| Demo 1 | Main page and app entry | [View Demo 1](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%201.png) | The app opens with the study-planner interface and dashboard visible. | Pass |
| Demo 2 | Theme and visual consistency | [View Demo 2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo2.png) | The color/theme needs improvement and remains open in Issue #25. | Needs fix |
| Demo 3 | Subject and task flow | [View Demo 3](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%203.png) | The subject/task flow is visible and usable. | Pass |
| Demo 4 | Quiz flow | [View Demo 4](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%204.png) | The quiz/result flow is visible and usable. | Pass |
| Demo 5 | Persistence check | [View Demo 5](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%205.png) | Refresh behavior shows data remains in the same browser/localStorage context. | Pass |

## Problems found

| Problem | Tracker | Owner |
|---|---|---|
| Theme/color inconsistency | [Issue #25](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/25) | owner to confirm |

## Next action

- Keep Issue #23 open until the evidence reconciliation and theme follow-up match.
- Keep Issue #25 open as the canonical theme/color tracker.
- Fix the theme/CSS issue, rerun the same five-demo path, and update this note with the rerun result.

**Tested-By Note Status:** Tester login/date and proof links are recorded. Main flow evidence is visible; theme fix and rerun remain open.

**Document Owner:** Nabin Khadka
