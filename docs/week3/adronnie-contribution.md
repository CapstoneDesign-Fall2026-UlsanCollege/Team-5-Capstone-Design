# Adronnie — direct contribution and persistence evidence

## Direct contribution row

| Student | What they did | Evidence link |
|---|---|---|
| Adronnie | Implemented the smallest localStorage persistence check for one subject and one task, then documented the refresh verification and the remaining limitation that the current repository contains a standalone check rather than the React MVP. | [Subject/task persistence test](../week2/storage-check-subject-task.html) · [Test result](persistence-test.md) · [Issue #5](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/5) |

## Smallest persistence test

1. Open `docs/week2/storage-check-subject-task.html` in a browser.
2. Click **Create subject and task** once.
3. Confirm that `Programming` and `Read chapter 1` are displayed as saved.
4. Refresh the page.
5. Confirm that the same subject and task are displayed with the message **Persistence verified after refresh**.

The check uses one localStorage record containing one subject and one task, so it directly covers the risk assigned to Adronnie without adding unrelated application behavior.
