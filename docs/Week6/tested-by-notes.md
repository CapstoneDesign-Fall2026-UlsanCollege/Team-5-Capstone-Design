# Tested-By Note

## What we checked

- **Behavior / related Issue:** End-to-End Student User Path test validation
- **Tested by:** Team member tester (not the author of the implementation)
- **Date:** 2026-10-08

## Demo review summary

| Demo | Purpose | Observed result | Status |
|---|---|---|---|
| Demo 1 | Main page and app entry | The app opens with the study-planner interface and the main dashboard is visible. | Pass / observed |
| Demo 2 | Theme and visual consistency | The design/color theme needs improvement and is identified as a visible issue. | Needs fix |
| Demo 3 | Subject and task flow | The user can create/select a subject and review task flow in the study planner. | Pass / observed |
| Demo 4 | Quiz flow | Subject-based quiz logic and result flow are visible and usable. | Pass / observed |
| Demo 5 | Persistence and final proof | Refresh/check behavior should be confirmed to ensure data persists after reload. | In progress |

## Demo images

### Demo 1
![Demo 1](https://raw.githubusercontent.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/main/docs/Week6/Demo%201.png)

### Demo 2
![Demo 2](https://raw.githubusercontent.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/main/docs/Week6/Demo2.png)

### Demo 3
![Demo 3](https://raw.githubusercontent.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/main/docs/Week6/Demo%203.png)

### Demo 4
![Demo 4](https://raw.githubusercontent.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/main/docs/Week6/Demo%204.png)

### Demo 5
![Demo 5](https://raw.githubusercontent.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/main/docs/Week6/Demo%205.png)

## Check steps

1. Open the app and review the main study-planner screen.
2. Choose a subject and add a study task with a deadline.
3. Open the Study Plan, find the task, and mark it complete.
4. Open the quiz section, answer questions for the same subject, and submit.
5. Refresh the page and verify that the task and quiz-related data still remain.

## Result

- **Expected result:** The user can complete the full flow from subject selection → task creation → study plan → completion → subject-based quiz → score review without major errors.
- **Actual result:** The overall user flow is visible and functional in the prototype. The main demo confirms the app structure and planner flow, while Demo 2 highlights a design/theme issue. Additional validation is still needed for a complete end-to-end proof.
- **Proof link / screenshot:** See the Week 6 demo files in `docs/Week6/` (Demo 1–Demo 5).

## Problems found

- Visual/theme inconsistency in the interface (noted in Demo 2).
- Full end-to-end proof is still in progress; refresh/persistence validation should be finalized.
- Some evidence items are still marked as pending in the Week 6 report.

## Next action

- Fix or improve the theme color/visual consistency.
- Complete the remaining validation steps for Demo 3–Demo 5.
- Update the shared report and tested-by note with final screenshots and verification results.
- Keep the Team 5 Week 6 report honest and link the final evidence when it is ready.
