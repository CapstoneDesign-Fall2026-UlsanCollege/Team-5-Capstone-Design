# Week 04 — Prabin Rai

**Week:** 4 — Chuseok Checkpoint
**Contributor:** [RaiPrabin697](https://github.com/RaiPrabin697)
**Date:** 2026-09-29

## Goal

Close out the Chuseok checkpoint with an honest record of what exists, and make the persistence-test blocker traceable to the specific piece of work that is holding it up.

Week 4 is ungraded. The checkpoint replaces the standard weekly report, and its value is in confirming the stack and assigning Week 5 ownership clearly rather than adding features.

## What I did

| Item | Status | Evidence |
|---|---|---|
| Confirmed stack recorded in the checkpoint (React + Vite, `localStorage`, no backend) | Completed | [Week 4 Chuseok Checkpoint](chuseok-checkpoint.md#confirmed-technology-stack), [Tech Stack Comparison](../week3/tech-stack-comparison.md) |
| Week 4 docs indexed | Completed | [Week 4 README](README.md) |
| Checkpoint text completed (four paragraphs had been left truncated) | Completed | [Week 4 Chuseok Checkpoint](chuseok-checkpoint.md) |
| Persistence-test blocker traced to its root cause | Completed | [localStorage test status](adronnie-localstorage-test-status.md), [test report](test-reports/localStorage-persistence-test.md) |
| localStorage persistence test executed in the running app | Pending | App is not scaffolded yet — see blocker below |
| Screenshots or localStorage dumps from the running app | Pending | Cannot be produced without the app |
| `localStorage` behaviour verified in a real browser session | Pending | Blocked on Track 1 project setup |

## The blocker, stated precisely

The persistence test is not blocked by a hard problem. It is blocked by ordering.

The repository currently contains documentation only. There is no application source, so there is nothing to open in a browser and observe. The test procedure requires watching a real subject survive a page refresh, which is only meaningful against the running application.

The dependency chain is:

1. [Track 1 — project setup](chuseok-checkpoint.md#track-1-project-setup-owner-nabin-khadka) must scaffold the React + Vite app and get `npm run dev` serving.
2. Subject creation and task creation must exist and be reachable in the UI.
3. `localStorage` save/load must be wired into those components.
4. Only then can the refresh test produce a real pass/fail result.

Until step 4 happens, the correct status is **Blocked**, and that is how the Week 4 test docs record it.

## What already gives us partial confidence

A standalone browser fixture from Week 2 exercises the same `localStorage` write and read path for one subject and two tasks:

- [storage-check-subject-task.html](../week2/storage-check-subject-task.html)
- [Storage Persistence Check](../week2/storage-check.md)

It demonstrates that the storage mechanism behaves as expected, but it is a standalone page, not the application. It is not evidence that React components persist data, and it is not presented as such.

## Consistency checks performed

| Check | Result |
|---|---|
| Week 4 documented as ungraded, and separate from graded weeks | Confirmed — checkpoint states it replaces the weekly report for this week |
| Technology stack matches the Week 3 comparison | Confirmed |
| Week 4 objectives are delivered or explicitly recorded as pending | Confirmed — no unstated blockers |
| Week 5 priorities map to owners | Confirmed — Track 1 and Track 2 have named owners |
| No fake test evidence recorded | Confirmed — no screenshots or dumps fabricated |

## First visible screen

Unchanged from the Week 3 definition, and carried into the checkpoint's intended flow:

`App Start → Study Plan (subject list) → select "Programming" → Subject Detail / Study Plan`

The checkpoint's "Optional: easiest first screen or interaction" section agrees with this. The first interaction is selecting or creating a subject, then adding a study task with a deadline.

## Next week

- Nabin Khadka: scaffold the React + Vite app (Track 1) — this unblocks the persistence test.
- Sumit Adhikari: subject and task creation (Track 2).
- Adronnie: run the persistence test once the app serves, and replace the Blocked status with an actual result.
- Prabin Rai: move the state/flow test from the standalone fixture onto the real app screens once they exist, and update [week-03.md](../week3/week-03.md) evidence links to the new receipts.

## References

- [Week 4 Chuseok Checkpoint](chuseok-checkpoint.md)
- [Week 03 contributor update](../week3/week-03.md)
- [State/flow test](../week3/prabin-state-flow-test.md)
- [Architecture Sketch](../week3/architecture-sketch.md)
- [Sprint 0 Report](../week3/sprint-0-report.md)
