# Week 6 Issue Status Update Guide

Use this file to update the related GitHub Issue after the team confirms the tested branch, tester, actual result, and proof link.

## Related Issues

| Issue | Why it matters | Current Week 6 status |
|---|---|---|
| [#17 — Design Subjects and Study Tasks](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/17) | Main visible slice: create subject, add tasks, deadlines, localStorage persistence | Pending teammate test |
| [#21 — Set up React + Vite project scaffolding](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/21) | Setup dependency before Issue #17 can be tested in the app | Open; confirm runnable branch/commit |

## When the app is runnable

Post or add this update to Issue #17 after the teammate test is complete:

```text
## Week 6 tested-by update

Tester:
Date:
Branch / commit tested:

Steps checked:
1. Opened the running Smart Study Companion app.
2. Created a Programming subject.
3. Added two study tasks with deadlines.
4. Refreshed the browser page.
5. Checked whether the subject and tasks remained visible.

Expected result:
The subject and tasks remain visible after refresh without persistence-related console errors.

Actual result:

Proof link:

Status decision:
- [ ] Keep issue open because work is incomplete or test failed.
- [ ] Mark relevant DoD items complete because the test passed.

Next action:
```

## If the app is not runnable yet

Post or add this update to Issue #21 and keep Issue #17 incomplete:

```text
## Week 6 blocker update

The Week 6 tested-by check for Issue #17 cannot be completed yet because the runnable React + Vite app branch/commit is not confirmed.

Needed before testing:
- Runnable branch or commit link
- Setup command confirmed by another teammate
- Subject creation and task creation available in the UI
- localStorage save/load wired for the selected path

Next action owner:
Next review date:
```

## Evidence rules

- Do not mark Issue #17 complete until the teammate test has an actual result and proof link.
- If the test fails, record the first failing step and keep the issue open.
- If a screenshot or video includes personal data, replace it with synthetic test data before linking it.
- Link this Week 6 package from the issue update so the evidence trail is easy to review.
