# Week 05 — Persistence Test Preparation

**Contributor:** Prabin Rai (RaiPrabin697)  
**Course week:** 2026-10-01 to 2026-10-07  
**Status:** Test procedure prepared; execution pending a runnable app with subject/task creation and persistence wired.

## Contribution

I prepared a repeatable check for the Week 5 subject-and-task vertical slice. It will verify the planned user path on the actual React + Vite application: create a subject, add a task with a deadline, refresh the page, and confirm both records remain visible. The Week 5 worklist assigns me the persistence check.

This procedure is for the application itself. The Week 2 standalone storage fixture is useful background, but it does not prove that the React screens persist data.

## Test procedure

### Preconditions

- Use the team’s runnable application branch and record its commit SHA.
- Confirm the subject form, task form, and localStorage save/load behavior are available.
- Start the app using the setup instructions for that branch. If any precondition is missing, record the test as **Blocked** and name the missing dependency; do not report a pass.
- Use synthetic test data only, preferably in a fresh browser profile.

### Steps and expected results

| Step | Action | Expected result |
| --- | --- | --- |
| 1 | Open the running app and note the branch and commit SHA. | The application loads without a startup error. |
| 2 | Create a subject named “Persistence Test.” | The new subject appears in the subject list. |
| 3 | Open that subject and add a task named “Refresh check” with a future deadline. | The task and deadline appear under the correct subject. |
| 4 | Refresh the browser page. | The same subject and task remain visible with their values intact. |
| 5 | Inspect the browser console and the app’s storage entry using the synthetic data. | No persistence-related console errors; saved data matches the UI. |

### Record the result

- **Status:** Pending / Pass / Fail / Blocked
- **App branch and commit:** Pending
- **Browser and test date:** Pending
- **Observed result and issue link (if any):** Pending
- **Evidence links:** Add screenshots from before and after refresh, plus a storage/console capture if useful. Capture these only after running the actual app; do not include personal data or secrets.

## Current result

**Not run.** The main branch currently contains documentation but no application source to launch, so the app-level persistence path cannot yet be tested here. This is consistent with the Week 4 checkpoint’s recorded blocker. Recheck once the setup and UI implementation are available, then replace this status with the observed result and evidence links.

## References

- [Week 5 worklist](WEEK_5_WORKLIST.md)
- [Week 4 contributor update](../week4/week-04.md)
- [Week 2 storage persistence check](../week2/storage-check.md)
- [Week 2 standalone storage fixture](../week2/storage-check-subject-task.html)
