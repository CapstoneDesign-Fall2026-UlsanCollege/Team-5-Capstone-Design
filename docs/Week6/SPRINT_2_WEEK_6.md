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

The relevant implementation files are:(old Code , New files will be added soon )

- [Frontend/index.html](../../Frontend/index.html)
- [Frontend/app.js](../../Frontend/app.js)
- [Frontend/styles.css](../../Frontend/styles.css)
- [README.md](../../README.md)

## 2. Week 6 sprint objective

Week 6 is not a full feature build week. It is a validation and evidence week for Sprint 2.

The objective is to answer this question honestly:

Can a teammate who did not build this flow complete the current study-planning and quiz user path without coaching, and what evidence proves it?

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
- The actual behavior is recorded, including any missing or confusing step.
- A proof artifact is linked in the evidence package.
- Any issue found is tracked with owner and next action.

## 5. Work split

| Login | Week 6 role |
|---|---|
| `liftupkhadka555-spec` | Coordination, proof collection, and evidence review |
| `adronnie` | Formal report ownership and technical scope notes |
| `princekark` | Repeat-test feedback and report support |
| `RaiPrabin697` | Tester/evidence support and docs reconciliation |
| `jn-oli` | Weekly report review, theme issue tracking, and evidence consistency support |

## 6. Evidence checklist

- [tested-by note](./tested-by-notes.md)
- [weekly report](./WEEKLY_REPORT.md)
- [Issue #23 validation tracker](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23)
- [Issue #25 theme tracker](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/25)
- Demo 1-5 screenshots
- Contribution rows for all five current logins

## 7. Risks and notes

The current prototype is browser-only and uses localStorage. The current evidence demonstrates the prototype path in the same browser context. It does not prove backend services, login, cloud sync, or multi-device sync.

The open issue to watch:

- Theme/color inconsistency in Demo 2.

## 8. Week 6 deliverables

- [WEEK6_WORKLIST.md](./WEEK6_WORKLIST.md)
- [WEEKLY_REPORT.md](./WEEKLY_REPORT.md)
- [tested-by-notes.md](./tested-by-notes.md)
- [SPRINT_2_FORMAL_REPORT.md](./SPRINT_2_FORMAL_REPORT.md)

These files should stay aligned with the actual test result and open issue status.

---

**Current repo status:** prototype exists and is runnable; this week is focused on testing, reconciling evidence, and documenting the real behavior.
