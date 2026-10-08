# Testing Documentation

This folder organizes manual testing evidence for the Smart Study Companion prototype and future app work.

## Current Manual Test Areas

| Area | What to check | Evidence |
|---|---|---|
| Subject creation | A subject can be created or selected | [Frontend prototype](../../Frontend/index.html) |
| Task planning | A task and deadline can be added | [Frontend prototype](../../Frontend/index.html) |
| Completion state | A task can be marked complete | [Frontend prototype](../../Frontend/index.html) |
| Quiz scoring | Answers produce visible score feedback | [Quiz validation](quiz-validation.md) |
| Persistence | Data remains after refresh when stored locally | [Week 5 persistence test](../week5/persistence-test.md) |
| Week 6 tested-by evidence | Another person tests without coaching | [Tested-by note](../Week6/tested-by-notes.md) |

## Manual Test Template

Use this structure for each new test result:

| Field | Required content |
|---|---|
| Behavior tested | The exact visible behavior checked |
| Tester | Person who ran the test |
| Date | Test date |
| Expected result | What should happen |
| Actual result | What happened |
| Proof link | Commit, PR, issue, screenshot, or demo link |
| Status | Pass, Fail, Blocked, or Not run |

## Current Status

The repository has a runnable prototype and prepared test notes. Week 6 independent proof should remain pending until another person runs the test and the actual result is recorded.
