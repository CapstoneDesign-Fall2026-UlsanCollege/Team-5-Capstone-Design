# Week 11 — Study Analytics Testing and Improvement Suggestions

**Project:** Smart Study Companion — Team 5  
**Tester:** Prince Karki (`princekark`)  
**Date:** November 16, 2026  
**Area:** Study Task Analytics / QA and Improvement Suggestions  
**Status:** Eight guided manual checks completed; enhancement recommendations proposed  
**Related GitHub issue:** [#61 — Study Analytics Pie Chart, Weekly Progress Graph and Data Consistency](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/61)  
**Related existing issues:** [#47 — Actionable Study Analysis](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/47) · [#48 — Study Task Analytics](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48)

## 1. Objective

Review the existing Study Analytics page and test whether its completion percentage, workload breakdown, seven-day scheduled-task graph, and subject progress respond correctly when tasks are created, completed, deleted, and the page is refreshed.

The report also proposes improvements to the pie/doughnut chart presentation, bar-graph clarity, and strict consistency of analytics data.

**Test environment:** Smart Study Companion in a desktop web browser (GitHub Pages application), using Prince Karki's student test account.  
**Test date:** Monday, November 16, 2026.  
**Live application:** https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html#analytics

## 2. Manual Test Results

| Test | Action and observed result | Status | Evidence |
|---|---|---|---|
| W11-01 — Baseline | Analytics initially displayed 0 tasks, 0% completion, zero values across seven days, and 7 enrolled subjects. | PASS (display checked) | [Screenshot 01](../Evidence/Prince-Karki/W11-01-analytics-overview.png) |
| W11-02 — Create | Created a pending Data Structures & Algorithms task due Monday, Nov 16. Analytics showed 1 total, 1 pending, 0 completed; Monday scheduled bar = 1. Task was shown as overdue because its entered deadline time had passed. | PASS | [Screenshot 02](../Evidence/Prince-Karki/W11-02-analytics-after-task-creation.png) |
| W11-03 — Complete | Marked that task completed. Analytics showed 1 completed (100%), 0 pending, 0 overdue, and subject progress 1/1. Monday scheduled bar remained 1. | PASS | [Screenshot 03](../Evidence/Prince-Karki/W11-03-analytics-after-completion.png) |
| W11-04 — Refresh | Refreshed the page. Completion remained 100%, with 1 completed task and the Monday scheduled bar still at 1. | PASS (browser observation) | [Screenshot 04](../Evidence/Prince-Karki/W11-04-analytics-after-refresh.png) |
| W11-05 — Delete | Deleted the completed test task. Analytics returned to 0 tasks, 0% completion, and all-zero weekly bars. | PASS | [Screenshot 05](../Evidence/Prince-Karki/W11-05-analytics-after-deletion.png) |
| W11-06 — Sunday schedule | Created a pending task due Sunday, Nov 15. Sunday scheduled bar = 1, Monday = 0, total tasks = 1, overdue = 1. | PASS | [Screenshot 06](../Evidence/Prince-Karki/W11-06-sunday-bar-graph.png) |
| W11-07 — Two-day schedule | Added a Monday, Nov 16 task while retaining the Sunday task. Weekly bars displayed Sunday = 1 and Monday = 1; total = 2, pending = 2, overdue = 1. | PASS | [Screenshot 07](../Evidence/Prince-Karki/W11-07-multiple-day-bar-graph.png) |
| W11-08 — Mixed completion | Completed the Monday task while leaving Sunday pending. The completion indicator showed 50%; workload showed 1 completed and 1 pending; Sunday and Monday *scheduled* bars stayed at 1 each. | PASS | [Screenshot 08](../Evidence/Prince-Karki/W11-08-completed-vs-pending.png) |

**Summary:** All eight specifically observed scenarios showed the expected values. **No calculation defect was confirmed** during these checks. The remaining recommendations concern presentation, clarity, and continued regression protection.

## 3. Recommendation A — Pie / Doughnut Chart

**Type: UI/UX enhancement; not a verified defect.**

The application already has a circular **overall completion indicator**. It also displays completed and pending counts as horizontal workload bars. However, a separate labeled completion breakdown could be easier for students to interpret.

**Suggested improvement:**
- Show a pie or doughnut chart dividing tasks into **Completed** and **Pending** categories.
- Include numerical totals, percentages, a clear legend, and readable labels; do not rely on color alone.
- Keep the existing overall completion percentage and workload numbers.
- For the observed two-task case, the proposed chart would show **Completed: 1 (50%)** and **Pending: 1 (50%)**.
- For zero tasks, display an explanatory empty state instead of implying progress.

Note: An overdue task may also be pending. If Overdue is shown, avoid counting it as a third mutually exclusive slice unless the categories are deliberately redefined.

## 4. Recommendation B — More Informative Bar-Graph Progress

**Type: Chart clarity enhancement; not a verified calculation defect.**

The existing **Weekly Activity (Last 7 Days)** chart is labeled as **tasks scheduled across the last seven days**. It behaved consistently with that meaning in the observed tests: Sunday and Monday each showed one scheduled task, even when Monday's task was later marked completed.

**Suggested improvement:**
- Retain the existing scheduled-task bars and label their metric unambiguously.
- Consider a separate **Completed vs. Pending** chart, or stacked bars with a clear legend, to communicate completion progress rather than only deadline scheduling.
- Explain in the UI whether bars represent tasks *scheduled* by due date or tasks *completed* on each day.
- Show numeric values and accessible labels.
- Check seven-day rendering, empty data, and mobile readability.

Do not label the current graph as broken merely because completion status does not change its scheduled-task counts.

## 5. Recommendation C — Strict Data Consistency and Maintenance

**Type: Reliability and regression-testing recommendation.**

The observed create, complete, refresh, and delete operations changed analytics correctly during the guided session.

**Recommended safeguards:**
- Derive total, completed, pending, overdue, completion percentage, and subject progress from the same current task dataset.
- Recalculate immediately after create, edit, complete, delete, and deadline changes.
- Validate completed + pending = total for mutually exclusive status categories.
- Keep overdue a subset of eligible pending tasks rather than adding it to the total.
- Check empty states and zero denominators to prevent invalid percentages.
- Confirm saved results after refresh against actual backend task records.
- Run regression checks with multiple students to validate account isolation.
- Add automated unit and browser tests that verify analytics calculations as tasks change.

**Scope limitation:** These screenshots confirm visible application behavior; they do **not** establish server-side Supabase RLS protections, independent cross-account authorization, or long-term cloud persistence.

## 6. Proposed Acceptance Criteria

- [ ] Review and decide whether a separate pie/doughnut completion breakdown adds value.
- [ ] Preserve correct completion counts and percentage calculations.
- [ ] Make the weekly chart's scheduled-task meaning explicit.
- [ ] Evaluate a clearer completed-versus-pending progress visualization.
- [ ] Keep analytics synchronized after task creation, editing, completion, deletion, and refresh.
- [ ] Verify responsive chart layout and accessible labels.
- [ ] Add automated regression coverage for data consistency.
- [ ] Record independent verification results after any UI or analytics change.

## 7. Evidence Index

All screenshot links below resolve relative to this report's proposed location:  
`docs/week_11/Suggestion/PRINCE_KARKI_STUDY_ANALYTICS_REPORT.md`.

| Filename | What it shows |
|---|---|
| [W11-01-analytics-overview.png](../Evidence/Prince-Karki/W11-01-analytics-overview.png) | Initial zero-task analytics |
| [W11-02-analytics-after-task-creation.png](../Evidence/Prince-Karki/W11-02-analytics-after-task-creation.png) | New task updates Monday schedule and counts |
| [W11-03-analytics-after-completion.png](../Evidence/Prince-Karki/W11-03-analytics-after-completion.png) | One completed task and 100% completion |
| [W11-04-analytics-after-refresh.png](../Evidence/Prince-Karki/W11-04-analytics-after-refresh.png) | Same values following refresh |
| [W11-05-analytics-after-deletion.png](../Evidence/Prince-Karki/W11-05-analytics-after-deletion.png) | Deleted task removed from metrics |
| [W11-06-sunday-bar-graph.png](../Evidence/Prince-Karki/W11-06-sunday-bar-graph.png) | Sunday scheduled bar correctly shows 1 |
| [W11-07-multiple-day-bar-graph.png](../Evidence/Prince-Karki/W11-07-multiple-day-bar-graph.png) | Sunday and Monday each show 1 scheduled task |
| [W11-08-completed-vs-pending.png](../Evidence/Prince-Karki/W11-08-completed-vs-pending.png) | Two tasks, one complete and one pending (50%) |

**Privacy note:** Before publishing screenshots in a public repository, inspect them for identifying account details, emails, session tokens, or other sensitive information and redact those where necessary.

## 8. Conclusion

During eight guided manual checks, Study Analytics correctly reflected task creation, task completion, page refresh, task deletion, multiple-day scheduling, and a 50/50 completed-pending breakdown.

The main improvement opportunity is **clearer visualization**, not an observed calculation failure. A labeled pie/doughnut breakdown and more informative weekly progress graph could make the analytics easier to interpret. Continued data-consistency checks and automated regression coverage are recommended.

**Submitted by:** Prince Karki (`princekark`)  
**Tracking issue:** [#61](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/61)  
