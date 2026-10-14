# Sprint 1 / Week 6 Validation Plan - Validate the Current Prototype

**Team:** Team 5  
**Sprint:** 1  
**Week:** 6  
**Status:** Based on the current repository prototype and documentation

This file translates the current app and documentation into a practical Week 6 validation plan. It is grounded in the existing project files and the evidence now recorded for the midterm path.

## 1. What the repo already proves

The app includes a browser prototype with core study planner behavior:

- Subjects can be created and managed.
- Tasks can be added with deadlines.
- Tasks can be marked complete/incomplete.
- Study-plan views can show task progress.
- Quiz logic exists and calculates a score.
- Data persists locally in the same browser/localStorage context.
- A theme/color issue remains visible in Demo 2.

Relevant implementation files:

- [Frontend/index.html](../../Frontend/index.html)
- [Frontend/app.js](../../Frontend/app.js)
- [Frontend/styles.css](../../Frontend/styles.css)
- [README.md](../../README.md)

## 2. Week 6 validation objective

Week 6 is a validation and evidence week. The objective is to answer this question honestly:

Can a teammate complete the current study-planning and quiz path, what does the evidence prove, and what remains incomplete?

## 3. User flow tested

The team records one realistic end-to-end path based on the current app:

1. Create or select a subject.
2. Add a study task with a deadline.
3. Confirm the task appears in the study plan.
4. Mark the task complete.
5. Open the quiz flow and answer questions.
6. Submit and review the score.
7. Refresh the page and confirm relevant local data still remains in the same browser/localStorage context.

## 4. Acceptance criteria for Week 6

- The chosen behavior is user-visible and tied to the existing app.
- Test steps are written clearly enough for another teammate to follow.
- Expected behavior is stated before the test starts.
- Tester login and date are recorded.
- Actual behavior is recorded, including the theme/color issue.
- Demo 1-5 proof links are included.
- Issue #23 and Issue #25 match the recorded result.

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
