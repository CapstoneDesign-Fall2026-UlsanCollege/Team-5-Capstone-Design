# Week 10 assisted browser run - 2026-11-11

## Environment and attribution

- Evidence owner: `RaiPrabin697`. The user supplied the signed-in browser session; Codex operated the task checks. This is not an independently executed student test or an automated regression-suite result.
- Browser: Google Chrome on macOS; Asia/Seoul timezone. Exact browser version and deployed commit were not established.
- Target: https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html#tasks
- Backend mode: **unverified**. UI wording mentions a cloud database, but no network receipt, database row, or RLS response was inspected.

## Observed task checks

1. Blank title: on Subjects & University, leave the task title empty and activate Save task. Focus returned to the title field and the list remained empty. A second blank submission in the New task dialog returned focus to Task name; the existing task count remained one. **Partial UI observation only**: whitespace-only input and a visible validation-message screenshot remain pending.
2. Valid title: use Data Structures & Algorithms, enter `QA Week10 Rai 2026-11-11 persistence`, retain the displayed date `2026-11-12`, and submit Save task. The task appeared once; the form cleared and the UI reported one task. **Pass for visible creation only; cloud write unverified.**
3. Deadline: open Study Tasks. The task displayed `Nov 12, 11:59 PM` and `in 1d`. **Pass for this future-date display only**; overdue behavior, timezone transitions, and deadline editing were not tested.
4. Refresh: issue browser reload on Study Tasks and inspect the page again. The same title, subject, deadline, All 1 / Pending 1 / Completed 0 remained visible. **Observed after reload command; full reload completion and storage source were not independently instrumented.** Do not treat this as proof of server persistence.

## Remaining scenarios

- Valid signup and credential-based login: user completed session setup; their submission and email verification were not observed by Codex. **Not independently verified.**
- Invalid signup, invalid credential rejection, password-reset request/delivery, and second-account isolation: **Not run** in this session.
- Automated task regression test: **Not run**. Browser observations do not complete that commitment.
- No application or test code was changed. One labeled test task was left in the account for follow-up; no existing tasks were deleted.

## Screenshot status and next actions

**Screenshots pending.** Capture intermittently returned a blank image or a view that did not match the current accessibility state. A readable account page also exposed the profile email, so it was not uploaded. No image is claimed as proof of the task results above.

Capture privacy-safe, current task-form, task-list, and post-refresh images; verify they show the actual state before adding them to [the screenshot index](screenshots/README.md). Repeat refresh with an observable load boundary and verify live save/read separately. Use a second disposable account for UI isolation and a server response for an RLS claim. Record failures and blockers instead of replacing them with passes.

Related: [test checklist](../RaiPrabin697-Test-Checklist.md), [weekly report](../../weekly-report.md), [PR #52](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/52).
