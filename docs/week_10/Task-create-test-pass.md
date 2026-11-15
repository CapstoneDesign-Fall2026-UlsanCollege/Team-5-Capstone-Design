# Week 10 – Functional and Regression Testing

**Student:** Prabin Rai  
**Assigned task:** Automate one core task or quiz user journey.  
**Responsibility:** Functional and regression testing.

## 1. Automated Test Execution

**Command:** `npm test`  
**Execution date:** November 10, 2026

**Result:** PASS

| Metric | Actual Result |
|---|---:|
| Test files passed | 6 |
| Total tests passed | 31 |
| Failed tests | 0 |
| Execution time | 1.94 seconds |

Relevant test files:
- `tests/unit/task-create.test.js` – 3 tests passed.
- `tests/unit/tasks.test.js` – 5 tests passed.

## 2. Task Testing

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| Valid task creation | Task is created with valid input | Automated test suite passed; live browser verification pending | PASS (Unit) / NOT TESTED (Live) |
| Invalid task creation | Empty or invalid title is rejected | Automated test suite passed; live browser verification pending | PASS (Unit) / NOT TESTED (Live) |
| Task persistence | Task remains saved after page refresh | Live persistence not verified | NOT TESTED |
| Task completion | Task status changes to completed | Live browser verification pending | NOT TESTED |

*Note: Unit test results do not establish successful live database persistence.*

## 3. Persistence Status

**Task persistence:** NOT VERIFIED through live browser testing.

**AI quiz persistence:** The test output reported that the `public.ai_quizzes` table could not be found in the database schema cache. This requires separate database investigation.

## 4. Evidence

**Automated test execution screenshot:**

[View Task Creation Test Screenshot](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Evidence/tasl-create-test-pass.png)

## 5. Contribution Summary

- Added automated task creation tests.
- Executed the project's automated test suite.
- Reviewed functional and regression test results.
- Identified remaining live application and persistence verification requirements.

**Contributor:** Prabin Rai  
**Week:** 10
