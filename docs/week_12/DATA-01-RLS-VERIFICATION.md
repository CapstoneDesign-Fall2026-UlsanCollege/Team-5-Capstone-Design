# Week 12 — Two-Student RLS Security Verification (`DATA-01`)

**Responsible:** Prince Karki / Prabin Rai / Sumit Adhikari  
**Date:** November 20, 2026  
**Live Cloud Status:** **NOT RUN** (requires two live authenticated disposable test accounts)

---

## 1. Local Emulated SQL Isolation (Baseline)
- `tests/db/study-streak.db.test.js` (PGlite local Postgres emulation): verified **36 / 36 PASS** on branch `feature/study-streak-analytics-upgrade`, confirming `study_activity_events`, `study_preferences`, and `student_achievements` reject cross-student reads and direct writes. *(Note: Local emulation is not a substitute for live Supabase `DATA-01` verification.)*

## 2. Live Two-Student Test Matrix (`DATA-01`)

| Test ID | Test Case | Expected | Actual | Status | Evidence |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **DATA-01A** | Student B reads Student A tasks | Access denied (0 rows) | Not executed in live Supabase | **NOT RUN** | [Evidence/DATA-01-RLS/](Evidence/DATA-01-RLS/README.md) |
| **DATA-01B** | Student B reads Student A streaks | Access denied (0 rows) | Not executed in live Supabase | **NOT RUN** | [Evidence/DATA-01-RLS/](Evidence/DATA-01-RLS/README.md) |
| **DATA-01C** | Student B reads Student A quiz attempts | Access denied (0 rows) | Not executed in live Supabase | **NOT RUN** | [Evidence/DATA-01-RLS/](Evidence/DATA-01-RLS/README.md) |
| **DATA-01D** | Student B updates Student A data | No modification (0 rows affected) | Not executed in live Supabase | **NOT RUN** | [Evidence/DATA-01-RLS/](Evidence/DATA-01-RLS/README.md) |
| **DATA-01E** | Student B deletes Student A data | No deletion (0 rows affected) | Not executed in live Supabase | **NOT RUN** | [Evidence/DATA-01-RLS/](Evidence/DATA-01-RLS/README.md) |

## 3. Runnable Test Procedure (for Prince / Prabin / Sumit)
1. Create two disposable test accounts (**Student A** and **Student B**).
2. Log in as **Student A** (`https://team-5-capstone-design-761v.vercel.app`), create a task, mark it complete (generating a streak event), and complete a quiz attempt. Record the task/attempt IDs from Network DevTools.
3. Log out and log in separately as **Student B**.
4. Confirm **Student B**'s UI shows none of Student A's tasks, streaks, or quiz attempts.
5. Using Student B's bearer token in a REST `GET`, `PATCH`, and `DELETE` against Student A's record IDs, verify `0` rows returned and `0` rows modified/deleted.
6. Log back in as **Student A** and confirm all records remain intact. Save redacted screenshots in `docs/week_12/Evidence/DATA-01-RLS/`.
