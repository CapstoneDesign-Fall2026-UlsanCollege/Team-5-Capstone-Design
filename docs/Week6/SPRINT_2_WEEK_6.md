# Sprint 2 Week 6 Plan — Validate the Current Prototype

**Team:** Team 5  
**Sprint:** 2  
**Week:** 6  
**Status:** Based on the current repository prototype and documentation

This file translates the current app and documentation into a practical Week 6 sprint plan. It is grounded in the existing project files rather than a generic template.

## 1. What the repo already proves

From the repository contents, the app already includes a working browser prototype with core study planner behavior:

- Subjects can be created and managed
- Tasks can be added with deadlines
- Tasks can be marked complete/incomplete
- Study-plan views can filter and group tasks
- Quiz logic exists and calculates a score
- Data persists locally with browser localStorage
- Theme and layout support are present

The relevant implementation files are:

- [Frontend/index.html](../../Frontend/index.html)
- [Frontend/app.js](../../Frontend/app.js)
- [Frontend/styles.css](../../Frontend/styles.css)
- [README.md](../../README.md)

## 2. Week 6 sprint objective

Week 6 is not a full feature build week. It is a validation and evidence week for Sprint 2.

The objective is to answer this question honestly:

> Can a teammate who did not build this flow complete the current study-planning and quiz user path without coaching, and what evidence proves it?

## 3. User flow to test

The team should run one realistic end-to-end path based on the current app:

1. Create or select a subject.
2. Add a study task with a deadline.
3. Confirm the task appears in the study plan.
4. Mark the task complete.
5. Open the quiz flow and answer questions.
6. Submit and review the score.
7. Refresh the page and confirm state still remains.

This path matches the existing app logic and the project’s current MVP scope.

## 4. Acceptance criteria for Week 6

- The chosen behavior is user-visible and tied to the existing app.
- Test steps are written clearly enough for another teammate to follow.
- Expected behavior is stated before the test starts.
- A teammate other than the author executes the test without coaching.
- Actual behavior is recorded, including confusion or missing behavior.
- Proof (screenshot, demo, or recorded step result) is linked in the evidence.
- Any issue found is documented with owner and next action.

## 5. Recommended work split

| Team member | Likely Week 6 role |
|---|---|
| Nabin Khadka | Coordination,Building,issue tracking, proof collection |
| Sumit Adhikari | Frontend validation and UI-flow review |
| Prince Karki | Test execution and bug observation |
| Prabin Rai | Evidence note and validation support |
| J.N. Taj Oli | Documentation and report consistency |

## 6. Evidence checklist

The team should collect and link the following:

- One tested-by note for the chosen user path
- One screenshot or demo proof
- One shared weekly report
- One issue or blocker note if something fails
- One commit, PR, or implementation link if available

## 7. Risks and notes

The current prototype is a browser-only app using localStorage. That means Week 6 should keep the scope realistic and focus on usability, persistence, and honest validation rather than backend features.

The likely issues to watch for:

- unclear empty states
- confusing labels or subject/task flow
- inconsistent behavior after refresh
- quiz flow readability and score clarity
- duplicate or invalid input handling

## 8. Week 6 deliverables

The deliverables are already reflected in the repository files:

- [WEEK6_WORKLIST.md](./WEEK6_WORKLIST.md)
- [WEEKLY_REPORT.md](./WEEKLY_REPORT.md)
- [tested-by-notes.md](./tested-by-notes.md)

These files should be updated based on the actual results of the Week 6 test.

## 9. Sprint 2 connection

This Week 6 plan supports the broader Sprint 2 goal described in [docs/Week7/README.md](../Week7/README.md):

- improve prototype reliability,
- strengthen the demo path,
- document what works,
- and show what still needs future work.

The evidence gathered this week feeds directly into the next sprint decisions.

---

**Current repo status:** prototype exists and is runnable; this week is focused on testing and documenting the real behavior.
