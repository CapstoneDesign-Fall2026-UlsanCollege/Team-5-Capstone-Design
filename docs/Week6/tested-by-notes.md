# Tested-By Note

## What we checked

- **Behavior / related Issue:** End-to-End Student User Path test validation
- **Tested by:** Team member tester (not the author of the implementation)
- **Date:** 2026-10-08

## Demo review summary

| Demo | Purpose | Screenshot | Observed result | Status |
|---|---|---|---|---|
| Demo 1 | Main page and app entry | [View Demo 1](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%201.png) | The app opens with the study-planner interface and the main dashboard is visible. | ✅ Pass |
| Demo 2 | Theme and visual consistency | [View Demo 2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo2.png) | The design/color theme needs improvement and is identified as a visible issue. | ⚠️ Needs fix |
| Demo 3 | Subject and task flow | [View Demo 3](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%203.png) | The user can create/select a subject and review task flow in the study planner. | ✅ Pass |
| Demo 4 | Quiz flow | [View Demo 4](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%204.png) | Subject-based quiz logic and result flow are visible and usable. | ✅ Pass |
| Demo 5 | Persistence and final proof | [View Demo 5](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%205.png) | Refresh/check behavior confirms data persists after page reload. | ✅ Pass |

## Check steps

1. **Open the app** - Review the main study-planner screen ([Demo 1](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%201.png))
2. **Create subject & task** - Choose a subject and add a study task with a deadline ([Demo 3](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%203.png))
3. **Mark complete** - Open the Study Plan, find the task, and mark it complete
4. **Take quiz** - Open the quiz section, choose the same subject, answer questions, and submit ([Demo 4](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%204.png))
5. **Verify persistence** - Refresh the page and verify that the task and quiz data remain ([Demo 5](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%205.png))

## Result

- **Expected result:** The user can complete the full flow from subject selection → task creation → study plan → completion → subject-based quiz → score review without major errors.

- **Actual result:** The overall user flow is functional and visible in the prototype. Demo 1 confirms the app structure opens correctly. Demo 3 shows the subject and task flow work as intended. Demo 4 validates the quiz flow is operational. Demo 5 confirms that data persists after page refresh. Demo 2 identifies a visual/theme inconsistency that needs to be fixed.

- **Proof links (Click to view each demo):**
  - [Demo 1 - Main Page Entry](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%201.png)
  - [Demo 2 - Theme Color Issue](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo2.png)
  - [Demo 3 - Subject & Task Creation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%203.png)
  - [Demo 4 - Quiz Flow & Results](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%204.png)
  - [Demo 5 - Data Persistence After Refresh](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo%205.png)

## Problems found

| Problem | Demo Reference | Severity | Owner |
|---|---|---|---|
| Visual/theme color inconsistency | [Demo 2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo2.png) | Medium | Nabin Khadka, Sumit Adhikari |
| Theme styling needs refinement | [Demo 2](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/Demo2.png) | Medium | Sumit Adhikari (Frontend) |

## Next action

- [ ] **Fix theme color/visual styling** - Improve CSS consistency in the UI design (Owner: Sumit Adhikari)
- [ ] **Verify all demo flows** - Run through the complete end-to-end path again after fixes
- [ ] **Update Week 6 Weekly Report** - Link this tested-by note and all demo proof links
- [ ] **Create GitHub issue for theme fix** - Track the visual inconsistency with specific CSS changes needed
- [ ] **Final validation check** - Have a teammate unfamiliar with the code review Demo 1-5 flow

---

**Tested-By Note Status:** ✅ Complete - All demos reviewed and linked. Ready for Week 6 Weekly Report.

**Last updated:** 2026-10-10 by liftupkhadka555-spec
