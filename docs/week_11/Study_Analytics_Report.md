Week 11 — Study Analytics Testing and Improvement Suggestions
Project: Smart Study Companion — Team 5
Student: Prince Karki
GitHub Username: princekark
Role: Tester / QA
Testing Date: November 16, 2026
Documentation Updated: November 18, 2026 (does not imply a new test run)
Testing Area: Study Task Analytics
Related Issue: #61
Status: Manual Testing Completed — Improvement Suggestions Proposed; Evidence Metadata and Peer Review Pending

Testing Environment and Evidence Boundaries
Test Operator: Prince Karki (princekark)
Test Date: November 16, 2026
Reported Test URL: https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html#analytics
Test URL Confirmation: This URL appears in the companion suggestion report; confirm it was the exact URL used for the November 16 tests.
Tested Build / Source Revision: Not captured in the original testing report; exact deployed build/commit SHA requires confirmation.
Browser and Version: Pending confirmation by the original tester.
Device / Operating System: Desktop web browser reported; exact device, OS, and browser version pending confirmation.
Test Account: Prince Karki's student testing account (do not publish email or credentials).
Account Boundary: Single-account manual UI testing; not authenticated cross-account RLS verification.
Execution Type: Manual browser observations.
Recorded Result: 8 PASS / 0 FAIL within the described UI scenarios.
Peer Review: Pending independent teammate review and linked review receipt.

Scope and limits: These observations cover displayed analytics values, task creation, completion, refresh, deletion, and scheduled-task charts. They do not independently establish live Supabase database persistence, authenticated two-student Row Level Security (RLS), or production cloud acceptance. The separate authenticated task/RLS check (DATA-01) remains NOT RUN in the Week 11 evidence register.

Week 11 scope freeze: The pie/doughnut chart and weekly graph changes described below are backlog proposals only under Issue #61. They are not new Week 11 implementation commitments. Team approval of the core freeze is still pending.

1. Objective
The objective of Week 11 testing was to verify the Study Analytics functionality and identify improvements related to:

Pie chart and task completion visualization.
Weekly bar graph progress.
Strict data maintenance and analytics consistency.
I performed manual testing by creating, completing, refreshing, and deleting tasks and comparing the results displayed on the Study Analytics dashboard.

2. Testing Summary
Test ID	Test Case	Result
TEST 1	Initial Study Analytics overview	PASS
TEST 2	Analytics after task creation	PASS
TEST 3	Analytics after task completion	PASS
TEST 4	Analytics persistence after refresh	PASS (reported manual observation; screenshot needs evidence check)
TEST 5	Analytics after task deletion	PASS
TEST 6	Sunday weekly bar graph verification	PASS
TEST 7	Multiple-day bar graph verification	PASS
TEST 8	Completed vs. pending task progress	PASS
Total Tests: 8
Reported Passed: 8
Failed: 0

No calculation errors were confirmed during these manual tests. The screenshots and test-report limits are described below.

3. Detailed Testing Results
TEST 1 — Initial Analytics Overview
Action: Opened Study Analytics with no active tasks.

Observed Result:

Completion percentage: 0%
Total tasks: 0
Completed tasks: 0
Pending tasks: 0
Weekly graph: All zero
Enrolled subjects: 7
Status: PASS

Evidence: Screenshot 01

TEST 2 — Analytics After Task Creation
Action: Created a pending task named "W11 Analytics Test 1" under Data Structures & Algorithms.

Observed Result:

Total tasks increased to 1.
Pending tasks increased to 1.
Completion remained 0%.
Monday's scheduled-task bar displayed 1.
The task was shown as overdue because its deadline time had passed.
Status: PASS

Evidence: Screenshot 02

TEST 3 — Analytics After Task Completion
Action: Marked the created task as completed.

Observed Result:

Completion increased to 100%.
Completed tasks: 1.
Pending tasks: 0.
Overdue tasks: 0.
Subject progress displayed 1/1.
Monday's scheduled-task bar remained 1.
Status: PASS

Evidence: Screenshot 03

TEST 4 — Analytics After Refresh
Action: Refreshed the browser after completing the task.

Observed Result:

Completion remained 100%.
Completed tasks remained 1.
Pending tasks remained 0.
The scheduled-task graph still displayed the correct value.
Status: PASS (reported manual observation; independent screenshot corroboration pending)

Evidence: Screenshot 04

Evidence integrity note: The GitHub file blobs for Screenshot 03 and Screenshot 04 were identical when checked on November 18, 2026. The submitted Screenshot 04 therefore does not independently establish that the browser was refreshed. Confirm the original manual observation; if a fresh capture is needed, label it as a new dated retest rather than the original November 16 run.

TEST 5 — Analytics After Task Deletion
Action: Deleted the completed test task.

Observed Result:

Total tasks returned to 0.
Completion returned to 0%.
Pending and completed counts returned to 0.
Weekly scheduled-task bars returned to zero.
Status: PASS

Evidence: Screenshot 05

TEST 6 — Sunday Bar Graph Verification
Action: Created a pending task with a deadline of Sunday, November 15, 2026.

Observed Result:

Sunday bar: 1.
Monday bar: 0.
Total tasks: 1.
Pending tasks: 1.
Overdue tasks: 1.
Status: PASS

Evidence: Screenshot 06

TEST 7 — Multiple-Day Bar Graph Verification
Action: Created a second pending task with a deadline of Monday, November 16, 2026.

Observed Result:

Sunday bar: 1.
Monday bar: 1.
Total tasks: 2.
Pending tasks: 2.
Overdue tasks: 1.
Both scheduled-task bars displayed correctly.
Status: PASS

Evidence: Screenshot 07

TEST 8 — Completed vs. Pending Progress
Action: Marked the Monday task as completed while keeping the Sunday task pending.

Observed Result:

Total tasks: 2.
Completed tasks: 1 (50%).
Pending tasks: 1 (50%).
Overall completion: 50%.
Sunday and Monday scheduled-task bars remained at 1 each.
Status: PASS

Evidence: Screenshot 08

4. Problems and Improvement Suggestions
Freeze disposition: Suggestions 1 and 2, and any new automated regression work not approved as a core reliability fix, remain in the post-freeze backlog. These are proposals, not confirmed defects or completed features.

Suggestion 1 — Add a Pie Chart for Task Progress
Observation:

The current Study Analytics page displays an overall completion ring and workload counts. However, it does not provide a separate pie chart clearly showing the proportion of completed and pending tasks.

Recommendation (backlog only):

Add a pie or doughnut chart displaying:

Completed tasks and percentage.
Pending tasks and percentage.
A clear legend with labels.
An understandable empty state when there are no tasks.
Example:

For 2 total tasks:

Completed: 1 (50%)
Pending: 1 (50%)
Expected Benefit:

Students can understand their task completion progress more easily.

Priority: Medium
Type: UI/UX Enhancement
Week 11 Disposition: Deferred to backlog under #61.

Suggestion 2 — Improve Weekly Bar Graph Progress
Observation:

The existing weekly bar graph correctly displays tasks scheduled on different days. However, the graph does not distinguish completed tasks from pending tasks.

Recommendation (backlog only):

Keep the existing scheduled-task activity graph.
Clearly explain that the bars represent scheduled tasks.
Add a separate completed-vs-pending progress view or stacked bars.
Add labels or a legend for easier understanding.
Improve readability on mobile screens.
Expected Benefit:

Students can distinguish task scheduling from actual task completion progress.

Priority: Medium
Type: Analytics Visualization Enhancement
Week 11 Disposition: Deferred to backlog under #61.

Suggestion 3 — Strengthen Data Maintenance
Observation:

The tested task creation, completion, deletion, and refresh operations updated analytics correctly.

However, continued data consistency should be protected through more comprehensive testing.

Recommendation:

Automatically update analytics after task creation and editing.
Recalculate statistics after completing or deleting tasks.
Maintain consistent results after refreshing.
Prevent incorrect completion percentages.
Ensure overdue tasks are counted consistently.
Add automated regression tests.
Independently verify Supabase persistence and account data isolation.
Expected Benefit:

Improved reliability and accuracy of student study analytics.

Priority: Medium
Type: Reliability and Testing Improvement
Week 11 Disposition: Documentation and narrowly scoped core reliability verification only; broader changes require team approval. RLS and cloud persistence are separate pending gates.

5. Recommended Acceptance Criteria
The following are proposed future acceptance criteria, not claims of completed implementation:

Add or evaluate a clearly labeled pie/doughnut breakdown (backlog).
Improve completed vs. pending progress visualization (backlog).
Preserve existing correct weekly scheduled-task values.
Update analytics correctly after task changes.
Maintain correct results after refresh.
Verify zero-task and overdue-task calculations.
Test chart responsiveness on mobile devices (separate check; not covered by desktop session).
Add automated regression tests as approved within the frozen core.
Verify backend persistence and user data isolation separately (DATA-01 not run).
6. Evidence Location
All screenshots are organized under:

docs/week_11/Evidence/Prince-Karki/

The screenshots document the eight manual tests reported during Week 11. The identical Screenshot 03/04 issue remains explicitly noted in TEST 4 pending an evidence check.

7. Conclusion
During Week 11, I performed eight manual tests of the Smart Study Companion Study Analytics page.

All eight tested scenarios were reported as passing. The completion percentage, pending and completed counts, task deletion updates, refresh behavior, and scheduled-task bar graph displayed the expected values in the reported manual observations, subject to the evidence limitation noted for TEST 4.

I recommend improving the analytics dashboard with a separate pie chart, a clearer completed-vs-pending progress graph, and additional automated data-consistency checks after the applicable scope-freeze decision.

These are improvement recommendations rather than confirmed calculation bugs. The manual analytics observations do not certify the separate cloud/RLS release gate.

Tester: Prince Karki (princekark)
Project: Smart Study Companion — Team 5
Related GitHub Issue: #61

8. Independent Peer Review and QA Handoff
Reviewer: Pending assignment to an independent teammate.
Review Date: Pending.
Review Status: Not yet performed.
Review Evidence: Pending link to dated PR review or Issue #61 comment.
Source / Build Confirmation: Pending confirmation by original tester or deployment owner.
Refresh Screenshot Review: Pending verification of identical TEST 3/TEST 4 image files.

Requested Peer Review
Check the eight manual test descriptions and screenshot links against the reported values.
Confirm the exact testing URL, browser/version, device/OS, and original build/source SHA where independently available.
Verify whether Screenshot 04 actually records a refresh. Request a new, properly dated capture if needed.
Preserve the distinction between a single-account browser check and authenticated two-account RLS verification.
Keep chart and graph enhancements in the backlog while the Week 11 scope freeze remains conditional.
Leave a dated reviewer comment identifying what was checked, what remains unverified, and any findings.
Final QA Handoff: PENDING independent review. Manual analytics test results remain attributed to princekark and must not be presented as independently reproduced or cloud/RLS acceptance.

Related Records
Week 11 Evidence Register — indexes the November 16 analytics observations; does not certify cloud/RLS security.
Week 11 shared report — already includes Prince Karki's individual contribution row.
Week 11 freeze decision — team approval/sign-off remains pending.
Independent verification protocol — separate two-account authenticated RLS check remains not run.
Issue #61 — backlog recommendations and peer-review request.
⋮⋮⋮⋮
