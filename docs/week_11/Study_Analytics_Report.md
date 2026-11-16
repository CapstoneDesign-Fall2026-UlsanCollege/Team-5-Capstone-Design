
# Week 11 — Study Analytics Testing and Improvement Suggestions

**Project:** Smart Study Companion — Team 5  
**Student:** Prince Karki  
**GitHub Username:** `princekark`  
**Role:** Tester / QA  
**Testing Date:** November 16, 2026  
**Testing Area:** Study Task Analytics  
**Related Issue:** #61  
**Status:** Manual Testing Completed — Improvement Suggestions Proposed

---

## 1. Objective

The objective of Week 11 testing was to verify the Study Analytics functionality and identify improvements related to:

1. Pie chart and task completion visualization.
2. Weekly bar graph progress.
3. Strict data maintenance and analytics consistency.

I performed manual testing by creating, completing, refreshing, and deleting tasks and comparing the results displayed on the Study Analytics dashboard.

## 2. Testing Summary

| Test ID | Test Case | Result |
|---|---|---|
| TEST 1 | Initial Study Analytics overview | PASS |
| TEST 2 | Analytics after task creation | PASS |
| TEST 3 | Analytics after task completion | PASS |
| TEST 4 | Analytics persistence after refresh | PASS |
| TEST 5 | Analytics after task deletion | PASS |
| TEST 6 | Sunday weekly bar graph verification | PASS |
| TEST 7 | Multiple-day bar graph verification | PASS |
| TEST 8 | Completed vs. pending task progress | PASS |

**Total Tests:** 8  
**Passed:** 8  
**Failed:** 0

No calculation errors were confirmed during these manual tests.

## 3. Detailed Testing Results

### TEST 1 — Initial Analytics Overview

**Action:** Opened Study Analytics with no active tasks.

**Observed Result:**
- Completion percentage: 0%
- Total tasks: 0
- Completed tasks: 0
- Pending tasks: 0
- Weekly graph: All zero
- Enrolled subjects: 7

**Status:** PASS

**Evidence:** [W11-01-analytics-overview.png](
[Screenshot 01](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_11/Evidence/Prince-Karki/W11-01-analytics-overview.png)
)

### TEST 2 — Analytics After Task Creation

**Action:** Created a pending task named "W11 Analytics Test 1" under Data Structures & Algorithms.

**Observed Result:**
- Total tasks increased to 1.
- Pending tasks increased to 1.
- Completion remained 0%.
- Monday's scheduled-task bar displayed 1.
- The task was shown as overdue because its deadline time had passed.

**Status:** PASS

**Evidence:** [W11-02-analytics-after-task-creation.png](../Evidence/Prince-Karki/W11-02-analytics-after-task-creation.png)

### TEST 3 — Analytics After Task Completion

**Action:** Marked the created task as completed.

**Observed Result:**
- Completion increased to 100%.
- Completed tasks: 1.
- Pending tasks: 0.
- Overdue tasks: 0.
- Subject progress displayed 1/1.
- Monday's scheduled-task bar remained 1.

**Status:** PASS

**Evidence:** [W11-03-analytics-after-completion.png](../Evidence/Prince-Karki/W11-03-analytics-after-completion.png)

### TEST 4 — Analytics After Refresh

**Action:** Refreshed the browser after completing the task.

**Observed Result:**
- Completion remained 100%.
- Completed tasks remained 1.
- Pending tasks remained 0.
- The scheduled-task graph still displayed the correct value.

**Status:** PASS

**Evidence:** [W11-04-analytics-after-refresh.png](../Evidence/Prince-Karki/W11-04-analytics-after-refresh.png)

### TEST 5 — Analytics After Task Deletion

**Action:** Deleted the completed test task.

**Observed Result:**
- Total tasks returned to 0.
- Completion returned to 0%.
- Pending and completed counts returned to 0.
- Weekly scheduled-task bars returned to zero.

**Status:** PASS

**Evidence:** [W11-05-analytics-after-deletion.png](../Evidence/Prince-Karki/W11-05-analytics-after-deletion.png)

### TEST 6 — Sunday Bar Graph Verification

**Action:** Created a pending task with a deadline of Sunday, November 15, 2026.

**Observed Result:**
- Sunday bar: 1.
- Monday bar: 0.
- Total tasks: 1.
- Pending tasks: 1.
- Overdue tasks: 1.

**Status:** PASS

**Evidence:** [W11-06-sunday-bar-graph.png](../Evidence/Prince-Karki/W11-06-sunday-bar-graph.png)

### TEST 7 — Multiple-Day Bar Graph Verification

**Action:** Created a second pending task with a deadline of Monday, November 16, 2026.

**Observed Result:**
- Sunday bar: 1.
- Monday bar: 1.
- Total tasks: 2.
- Pending tasks: 2.
- Overdue tasks: 1.
- Both scheduled-task bars displayed correctly.

**Status:** PASS

**Evidence:** [W11-07-multiple-day-bar-graph.png](../Evidence/Prince-Karki/W11-07-multiple-day-bar-graph.png)

### TEST 8 — Completed vs. Pending Progress

**Action:** Marked the Monday task as completed while keeping the Sunday task pending.

**Observed Result:**
- Total tasks: 2.
- Completed tasks: 1 (50%).
- Pending tasks: 1 (50%).
- Overall completion: 50%.
- Sunday and Monday scheduled-task bars remained at 1 each.

**Status:** PASS

**Evidence:** [W11-08-completed-vs-pending.png](../Evidence/Prince-Karki/W11-08-completed-vs-pending.png)

---

## 4. Problems and Improvement Suggestions

### Suggestion 1 — Add a Pie Chart for Task Progress

**Observation:**

The current Study Analytics page displays an overall completion ring and workload counts. However, it does not provide a separate pie chart clearly showing the proportion of completed and pending tasks.

**Recommendation:**

Add a pie or doughnut chart displaying:
- Completed tasks and percentage.
- Pending tasks and percentage.
- A clear legend with labels.
- An understandable empty state when there are no tasks.

**Example:**

For 2 total tasks:
- Completed: 1 (50%)
- Pending: 1 (50%)

**Expected Benefit:**

Students can understand their task completion progress more easily.

**Priority:** Medium  
**Type:** UI/UX Enhancement

### Suggestion 2 — Improve Weekly Bar Graph Progress

**Observation:**

The existing weekly bar graph correctly displays tasks scheduled on different days. However, the graph does not distinguish completed tasks from pending tasks.

**Recommendation:**

- Keep the existing scheduled-task activity graph.
- Clearly explain that the bars represent scheduled tasks.
- Add a separate completed-vs-pending progress view or stacked bars.
- Add labels or a legend for easier understanding.
- Improve readability on mobile screens.

**Expected Benefit:**

Students can distinguish task scheduling from actual task completion progress.

**Priority:** Medium  
**Type:** Analytics Visualization Enhancement

### Suggestion 3 — Strengthen Data Maintenance

**Observation:**

The tested task creation, completion, deletion, and refresh operations updated analytics correctly.

However, continued data consistency should be protected through more comprehensive testing.

**Recommendation:**

- Automatically update analytics after task creation and editing.
- Recalculate statistics after completing or deleting tasks.
- Maintain consistent results after refreshing.
- Prevent incorrect completion percentages.
- Ensure overdue tasks are counted consistently.
- Add automated regression tests.
- Independently verify Supabase persistence and account data isolation.

**Expected Benefit:**

Improved reliability and accuracy of student study analytics.

**Priority:** Medium  
**Type:** Reliability and Testing Improvement

---

## 5. Recommended Acceptance Criteria

- [ ] Add or evaluate a clearly labeled pie/doughnut breakdown.
- [ ] Improve completed vs. pending progress visualization.
- [ ] Preserve existing correct weekly scheduled-task values.
- [ ] Update analytics correctly after task changes.
- [ ] Maintain correct results after refresh.
- [ ] Verify zero-task and overdue-task calculations.
- [ ] Test chart responsiveness on mobile devices.
- [ ] Add automated regression tests.
- [ ] Verify backend persistence and user data isolation separately.

## 6. Evidence Location

All screenshots are organized under:

`docs/week_11/Evidence/Prince-Karki/`

The screenshots document the eight manual tests carried out during Week 11.

## 7. Conclusion

During Week 11, I performed eight manual tests of the Smart Study Companion Study Analytics page.

All eight tested scenarios passed. The completion percentage, pending and completed counts, task deletion updates, refresh behavior, and scheduled-task bar graph displayed the expected values.

I recommend improving the analytics dashboard with a separate pie chart, a clearer completed-vs-pending progress graph, and additional automated data-consistency checks.

These are improvement recommendations rather than confirmed calculation bugs.

**Tester:** Prince Karki (`princekark`)  
**Project:** Smart Study Companion — Team 5  
**Related GitHub Issue:** [#61](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/61)
