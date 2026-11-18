# Week 11 — Two-Student Task Check

**Project:** Smart Study Companion — Team 5  
**Tester:** J.N. Taj Oli (`jn-oli`)  
**Date:** 2026-11-18  
**Browser:** Google Chrome 157.0.8103.79  
**Environment:** authenticated two-student check  
**OS:** Windows  
**Account:** Student A and Student B  
**Result:** PASS

This result is separate from the November 16 desktop UI result.

## What was checked

| Step | Result | Status |
|---|---|---|
| Student A creates one task | Task appears in Student A’s Study Tasks list | PASS |
| Student B opens Study Tasks | Student A’s task is not in Student B’s list | PASS |
| Student A signs in again | The same task is still in Student A’s list | PASS |

## Observed result

- Student A added one task.
- That task was not shown in Student B’s Study Tasks list.
- After signing back into Student A, the task was still there.

## Verification boundary

This check verifies task visibility and persistence across two authenticated student sessions. It does not independently test task creation, update, or deletion restrictions beyond the observed isolation case.

## Evidence

[Two Student Task Check](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/ab488c6536583d1fd9131921d0257b502df331ff/docs/week_11/Evidence/Two%20Student%20Task%20Check.md)
