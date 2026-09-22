# Subject/task localStorage persistence test

**Owner:** Adronnie  
**Scope:** one subject and one task  
**Date:** 2026-09-22

## Result

The test fixture is ready at [storage-check-subject-task.html](../week2/storage-check-subject-task.html). Run it in a browser, click **Create subject and task**, refresh once, and verify that both `Programming` and `Read chapter 1` remain visible. The page records the post-refresh state as **Persistence verified after refresh**.

This is the smallest useful check for the assigned risk: it verifies that both the subject and its task survive a page refresh in the same browser origin.

## Evidence

- [Runnable test fixture](../week2/storage-check-subject-task.html)
- [Issue #5 — front-end approach](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/5)
- [Sprint 0 localStorage risk assignment](sprint-0-report.md#risks-and-owned-exceptions)

## Limitation

This repository currently provides a standalone browser fixture rather than the React application itself. Therefore this check proves browser localStorage behavior and the intended subject/task data shape; it does not yet prove the eventual React component state wiring.
