# Week 11 — Study Analytics Testing and Improvement Suggestions

**Project:** Smart Study Companion — Team 5  
**Student:** Prince Karki  
**GitHub Username:** [`@princekark`](https://github.com/princekark)  
**Role:** Tester / QA  
**Testing Date:** November 16, 2026  
**Documentation Updated:** November 18, 2026 _(does not imply a new test run)_  
**Testing Area:** Study Task Analytics  
**Related Issue:** [#61](../../issues/61)  
**Status:** Manual testing completed — improvement suggestions proposed; evidence metadata and peer review pending

## Testing Environment and Evidence Boundaries

| Item | Details |
|---|---|
| **Test operator** | Prince Karki ([`@princekark`](https://github.com/princekark)) |
| **Test date** | November 16, 2026 |
| **Reported test URL** | <https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html#analytics> |
| **Test URL confirmation** | This URL appears in the companion suggestion report. Confirmation is required that it was the exact URL used for the November 16 tests. |
| **Tested build / source revision** | Not captured in the original testing report. Exact deployed build and commit SHA require confirmation. |
| **Browser and version** | Pending confirmation by the original tester. |
| **Device / operating system** | Desktop web browser reported. Exact device, OS, and browser version remain pending confirmation. |
| **Test account** | Prince Karki's student testing account. Email addresses and credentials must not be published. |
| **Account boundary** | Single-account manual UI testing only; not authenticated cross-account RLS verification. |
| **Execution type** | Manual browser observations. |
| **Recorded result** | 8 PASS / 0 FAIL within the described UI scenarios. |
| **Peer review** | Pending independent teammate review and linked review receipt. |

> [!IMPORTANT]
> These observations cover displayed analytics values, task creation, completion, refresh, deletion, and scheduled-task charts. They do **not** independently establish live Supabase database persistence, authenticated two-student Row Level Security (RLS), or production cloud acceptance.

> [!NOTE]
> ### Week 11 scope freeze
> The pie/doughnut chart and weekly graph changes described below are backlog proposals only under [Issue #61](../../issues/61). They are not new Week 11 implementation commitments. Team approval of the core freeze is still pending.

## 1. Objective

The objective of Week 11 testing was to verify the Study Analytics functionality and identify improvements related to:

- Pie chart and task completion visualization
- Weekly bar graph progress
- Strict data maintenance and analytics consistency

Manual testing was performed by creating, completing, refreshing, and deleting tasks, then comparing the results displayed on the Study Analytics dashboard.

## 2. Testing Summary

| Test ID | Test case | Result |
|---|---|---|
| TEST 1 | Initial Study Analytics overview | **PASS** |
| TEST 2 | Analytics after task creation | **PASS** |
| TEST 3 | Analytics after task completion | **PASS** |
| TEST 4 | Analytics persistence after refresh | **PASS** _(reported manual observation; screenshot evidence needs check)_ |
| TEST 5 | Analytics after task deletion | **PASS** |
| TEST 6 | Sunday weekly bar graph verification | **PASS** |
| TEST 7 | Multiple-day bar graph verification | **PASS** |
| TEST 8 | Completed vs. pending task progress | **PASS** |

- **Total tests:** 8
- **Reported passed:** 8
- **Failed:** 0

No calculation errors were confirmed during these manual tests. Screenshot and test-report limitations are described below.

## 3. Detailed Testing Results

### TEST 1 — Initial Analytics Overview

**Action:** Opened Study Analytics with no active tasks.

**Observed result:**

- Completion percentage: **0%**
- Total tasks: **0**
- Completed tasks: **0**
- Pending tasks: **0**
- Weekly graph: All zero
- Enrolled subjects: **7**

**Status:** ✅ **PASS**

**Evidence:** [Screenshot 01 — Initial analytics overview](Evidence/Prince-Karki/W11-01-analytics-overview.png)

---

### TEST 2 — Analytics After Task Creation

**Action:** Created a pending task named `W11 Analytics Test 1` under **Data Structures & Algorithms**.

**Observed result:**

- Total tasks increased to **1**
- Pending tasks increased to **1**
- Completion remained **0%**
- Monday's scheduled-task bar displayed **1**
- The task was shown as overdue because its deadline time had passed

**Status:** ✅ **PASS**

**Evidence:** [Screenshot 02 — Analytics after task creation](Evidence/Prince-Karki/W11-02-analytics-after-task-creation.png)

---

### TEST 3 — Analytics After Task Completion

**Action:** Marked the created task as completed.

**Observed result:**

- Completion increased to **100%**
- Completed tasks: **1**
- Pending tasks: **0**
- Overdue tasks: **0**
- Subject progress displayed **1/1**
- Monday's scheduled-task bar remained **1**

**Status:** ✅ **PASS**

**Evidence:** [Screenshot 03 — Analytics after completion](Evidence/Prince-Karki/W11-03-analytics-after-completion.png)

---

### TEST 4 — Analytics After Refresh

**Action:** Refreshed the browser after completing the task.

**Observed result:**

- Completion remained **100%**
- Completed tasks remained **1**
- Pending tasks remained **0**
- The scheduled-task graph still displayed the correct value

**Status:** ⚠️ **PASS** _(reported manual observation; independent screenshot corroboration pending)_

**Evidence:** [Screenshot 04 — Analytics after refresh](Evidence/Prince-Karki/W11-04-analytics-after-refresh.png)

> [!WARNING]
> The GitHub file blobs for Screenshot 03 and Screenshot 04 are identical. The submitted Screenshot 04 therefore does **not** independently establish that the browser was refreshed. Confirm the original manual observation; if necessary, replace or supplement it with a properly dated refresh capture rather than presenting the original run as independently evidenced.

---

### TEST 5 — Analytics After Task Deletion

**Action:** Deleted the completed test task.

**Observed result:**

- Total tasks returned to **0**
- Completion returned to **0%**
- Pending and completed counts returned to **0**
- Weekly scheduled-task bars returned to zero

**Status:** ✅ **PASS**

**Evidence:** [Screenshot 05 — Analytics after deletion](Evidence/Prince-Karki/W11-05-analytics-after-deletion.png)

---

### TEST 6 — Sunday Bar Graph Verification

**Action:** Created a pending task with a deadline of Sunday, November 15, 2026.

**Observed result:**

- Sunday bar: **1**
- Monday bar: **0**
- Total tasks: **1**
- Pending tasks: **1**
- Overdue tasks: **1**

**Status:** ✅ **PASS**

**Evidence:** [Screenshot 06 — Sunday bar graph](Evidence/Prince-Karki/W11-06-sunday-bar-graph.png)

---

### TEST 7 — Multiple-Day Bar Graph Verification

**Action:** Created a second pending task with a deadline of Monday, November 16, 2026.

**Observed result:**

- Sunday bar: **1**
- Monday bar: **1**
- Total tasks: **2**
- Pending tasks: **2**
- Overdue tasks: **1**
- Both scheduled-task bars displayed correctly

**Status:** ✅ **PASS**

**Evidence:** [Screenshot 07 — Multiple-day bar graph](Evidence/Prince-Karki/W11-07-multiple-day-bar-graph.png)

---

### TEST 8 — Completed vs. Pending Progress

**Action:** Marked the Monday task as completed while keeping the Sunday task pending.

**Observed result:**

- Total tasks: **2**
- Completed tasks: **1 (50%)**
- Pending tasks: **1 (50%)**
- Overall completion: **50%**
- Sunday and Monday scheduled-task bars remained at **1** each

**Status:** ✅ **PASS**

**Evidence:** [Screenshot 08 — Completed vs. pending progress](Evidence/Prince-Karki/W11-08-completed-vs-pending.png)

## 4. Problems and Improvement Suggestions

> [!NOTE]
> Suggestions 1 and 2, and new automated regression work not approved as a core reliability fix, remain in the post-freeze backlog. These are proposals, not confirmed defects or completed features.

### Suggestion 1 — Add a Pie Chart for Task Progress

**Observation:**

The current Study Analytics page displays an overall completion ring and workload counts. However, it does not provide a separate pie chart clearly showing the proportion of completed and pending tasks.

**Recommendation — backlog only:**

Add a pie or doughnut chart displaying:

- Completed tasks and percentage
- Pending tasks and percentage
- A clear legend with labels
- An understandable empty state when there are no tasks

**Example:**

For 2 total tasks:

- Completed: 1 (**50%**)
- Pending: 1 (**50%**)

**Expected benefit:** Students can understand their task completion progress more easily.

| Field | Value |
|---|---|
| Priority | Medium |
| Type | UI/UX enhancement |
| Week 11 disposition | Deferred to backlog under [#61](../../issues/61) |

### Suggestion 2 — Improve Weekly Bar Graph Progress

**Observation:**

The existing weekly bar graph correctly displays tasks scheduled on different days. However, the graph does not distinguish completed tasks from pending tasks.

**Recommendation — backlog only:**

- Keep the existing scheduled-task activity graph
- Clearly explain that the bars represent scheduled tasks
- Add a separate completed-vs-pending progress view or stacked bars
- Add labels or a legend for easier understanding
- Improve readability on mobile screens

**Expected benefit:** Students can distinguish task scheduling from actual task completion progress.

| Field | Value |
|---|---|
| Priority | Medium |
| Type | Analytics visualization enhancement |
| Week 11 disposition | Deferred to backlog under [#61](../../issues/61) |

### Suggestion 3 — Strengthen Data Maintenance

**Observation:**

The tested task creation, completion, deletion, and refresh operations updated analytics correctly. Continued data consistency should nevertheless be protected through more comprehensive testing.

**Recommendation:**

- Automatically update analytics after task creation and editing
- Recalculate statistics after completing or deleting tasks
- Maintain consistent results after refreshing
- Prevent incorrect completion percentages
- Ensure overdue tasks are counted consistently
- Add automated regression tests
- Independently verify Supabase persistence and account data isolation

**Expected benefit:** Improved reliability and accuracy of student study analytics.

| Field | Value |
|---|---|
| Priority | Medium |
| Type | Reliability and testing improvement |
| Week 11 disposition | Documentation and narrowly scoped core reliability verification only; broader changes require team approval. RLS and cloud persistence are separate pending gates. |

## 5. Recommended Acceptance Criteria

The following are proposed future acceptance criteria, not claims of completed implementation:

- [ ] Add or evaluate a clearly labeled pie/doughnut breakdown _(backlog)_
- [ ] Improve completed-vs-pending progress visualization _(backlog)_
- [ ] Preserve existing correct weekly scheduled-task values
- [ ] Update analytics correctly after task changes
- [ ] Maintain correct results after refresh
- [ ] Verify zero-task and overdue-task calculations
- [ ] Test chart responsiveness on mobile devices _(separate check; not covered by desktop session)_
- [ ] Add automated regression tests as approved within the frozen core
- [ ] Verify backend persistence and user data isolation separately (`DATA-01` not run)

## 6. Evidence Location

All screenshots are organized in:

[`docs/week_11/Evidence/Prince-Karki/`](Evidence/Prince-Karki/)

The screenshots document the eight manual test observations reported during Week 11. The identical Screenshot 03/04 issue remains explicitly noted in **TEST 4** and is pending an evidence check.

## 7. Conclusion

During Week 11, eight manual tests were performed on the Smart Study Companion Study Analytics page.

All eight tested scenarios were reported as passing. Completion percentage, pending/completed counts, task deletion updates, refresh behavior, and the scheduled-task bar graph displayed the expected values in the described manual observations, subject to the evidence limitation noted for TEST 4.

The recommended improvements are:

1. A separate pie/doughnut chart
2. A clearer completed-vs-pending progress graph
3. Additional automated data-consistency checks after the applicable scope-freeze decision

These remain improvement recommendations rather than confirmed calculation bugs. The manual analytics observations do not certify the separate cloud/RLS release gate.

**Tester:** Prince Karki ([`@princekark`](https://github.com/princekark))  
**Project:** Smart Study Companion — Team 5  
**Related GitHub Issue:** [#61](../../issues/61)

## 8. Independent Peer Review and QA Handoff

| Item | Status |
|---|---|
| **Reviewer** | Pending assignment to an independent teammate |
| **Review date** | Pending |
| **Review status** | Not yet performed |
| **Review evidence** | Pending link to dated PR review or Issue #61 comment |
| **Source / build confirmation** | Pending confirmation by the original tester or deployment owner |
| **Refresh screenshot review** | Pending verification of identical TEST 3/TEST 4 image files |

### Requested Peer Review

- [ ] Check the eight manual test descriptions and screenshot links against the reported values
- [ ] Confirm the exact testing URL, browser/version, device/OS, and original build/source SHA where independently available
- [ ] Verify whether Screenshot 04 actually records a refresh; request a new, properly dated capture if needed
- [ ] Preserve the distinction between a single-account browser check and authenticated two-account RLS verification
- [ ] Keep chart and graph enhancements in the backlog while the Week 11 scope freeze remains conditional
- [ ] Leave a dated reviewer comment identifying what was checked, what remains unverified, and any findings

> [!CAUTION]
> **Final QA handoff: PENDING independent review.** Manual analytics test results remain attributed to `princekark` and must not be presented as independently reproduced or as cloud/RLS acceptance.

## Related Records

- [Week 11 Evidence Register](../) — indexes the November 16 analytics observations; does not certify cloud/RLS security
- [Week 11 shared report](../) — already includes Prince Karki's individual contribution row
- Week 11 freeze decision — team approval/sign-off remains pending
- Independent verification protocol — separate two-account authenticated RLS check remains not run
- [Issue #61](../../issues/61) — backlog recommendations and peer-review request
