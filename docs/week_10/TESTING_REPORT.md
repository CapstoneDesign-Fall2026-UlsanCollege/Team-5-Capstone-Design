# Week 10 — Smart Study Companion Testing Report

**Project:** Smart Study Companion — Team 5  
**Tester:** Prince Karki (`princekark`)  
**Date:** November 11, 2026  
**Role:** Authentication, End-to-End Testing and Manual QA  
**Overall Status:** Testing completed with outstanding defects

## 1. Testing Objective

The objective was to verify the functionality, persistence, and reliability of the Smart Study Companion application, including authentication, task management, analytics, quizzes, academic onboarding and Supabase database integration.

Testing included browser-based manual tests, negative tests, refresh tests, API inspection and execution of the existing Python automated test suite.

## 2. Authentication Testing

| Test Case | Result | Status |
|---|---|---|
| Valid login | Successfully accessed dashboard | PASS |
| Invalid password | Error displayed | PASS |
| Logout | Returned to login page | PASS |
| Session refresh | Session remained active | PASS |
| Signup | Account created successfully | PASS |
| Signup redirect | Returned to login page | PASS |
| New account login | Successfully opened dashboard | PASS |
| Account isolation | Previous user's tasks not visible | PASS — UI |
| Forgot password | Verification email not received | FAIL |
| Password reset completion | Unable to continue without code | BLOCKED |

## 3. Study Task and Analytics Testing

| Test Case | Result | Status |
|---|---|---|
| Create task | Task created | PASS |
| Edit task | Updated successfully | PASS |
| Complete task | Status changed | PASS |
| Delete task | Task removed | PASS |
| Empty task validation | Blank task rejected | PASS |
| Task persistence | Tasks remained after refresh | PASS |
| Analytics calculations | Correct task counts and 50% completion | PASS |
| Analytics persistence | Values remained after refresh | PASS |

## 4. Quiz Testing

| Test Case | Result | Status |
|---|---|---|
| Standard quiz | 15-question quiz completed | PASS |
| Answer navigation | Worked correctly | PASS |
| Quiz submission | Score and review displayed | PASS |
| Quiz history | Preserved after refresh | PASS |
| Rapid quiz | 10-question quiz started | PASS |
| Rapid quiz timer | Automatic submission after timeout | PASS |
| AI quiz generation | Five questions generated | PASS |
| AI quiz submission | 4/5 score displayed | PASS |
| AI quiz content accuracy | Some answers and questions were inaccurate or generic | FAIL |
| AI quiz cloud persistence | Supabase API returned HTTP 404 | FAIL |

## 5. Academic Onboarding

| Test Case | Result | Status |
|---|---|---|
| Country selection | South Korea displayed | PASS |
| University selection | Ulsan College displayed | PASS |
| Major selection | Computer Science & Engineering | PASS |
| Curriculum display | Core and elective subjects displayed | PASS |
| Subject selection | Seven subjects selected | PASS |
| Save selection | Dashboard opened | PASS |
| Persistence after refresh | University, major and seven subjects retained | PASS |

Country-switch cascading behavior was not independently verified.

## 6. Supabase Database Testing

Verified the live Supabase `tasks` request in Chrome Developer Tools.

**Results:**
- Tasks API returned HTTP 200.
- Saved task data appeared in the server response.
- Subject mapping returned Computer Networks.
- Task completion status was correctly returned.
- Browser UI showed account-level task isolation.

**Outstanding:** Server-side Row Level Security was not independently tested. The `ai_quiz_attempts` request returned HTTP 404 (`PGRST205`).

## 7. Automated Testing

Executed:

`python tests/run_tests.py`

**Result: ALL TESTS PASSED SUCCESSFULLY (11/11)**

The automated checks covered project structure, migrations, authentication markup, validation, analytics, quiz scoring, academic hierarchy, theme and AI quiz implementation.

[View Automated Test Results](Evidence/Prince-Karki/W10-43-automated-test-results.png)

These automated checks do not establish that live email delivery or every cloud database operation is working.

## 8. Bugs Identified

| Bug | Description | Status |
|---|---|---|
| BUG-01 | Password reset verification email not received | OPEN |
| BUG-02 | Supabase AI quiz attempts returned `PGRST205` | OPEN |
| BUG-03 | AI-generated quiz questions lacked educational accuracy | OPEN |

**Recommended next actions:** Investigate email delivery configuration, verify deployed Supabase migrations and improve AI question generation validation.

## 9. Screenshot Evidence

All individual test screenshots are organized here:

[Prince Karki — Testing Evidence](Evidence/Prince-Karki/)

Key screenshots:

- [Automated Test Results](Evidence/Prince-Karki/W10-43-automated-test-results.png)
- [Supabase Task Response](Evidence/Prince-Karki/W10-46-supabase-task-response.png)
- AI Quiz Database Error: the original screenshot reference `Evidence/Prince-Karki/W10-47-ai-quiz-supabase-404.png` is missing at the 2026-11-14 review. See [the recorded storage issue #53](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/53); screenshot supply/privacy review remains pending. This correction does not change Prince's original test attribution or result.
- [Password Recovery Issue](Evidence/Prince-Karki/W10-56-password-recovery-email-not-received.png)
- [Academic Selection](Evidence/Prince-Karki/W10-58-academic-selection-page.png)
- [Academic Selection After Refresh](Evidence/Prince-Karki/W10-59-academic-selection-refresh.png)

## 10. Conclusion

I completed functional and integration testing of the major Smart Study Companion features. The existing Python automated suite passed all 11 checks.

Authentication, tasks, analytics, standard and rapid quizzes, academic selection persistence and Supabase task retrieval worked in the tested scenarios.

Three unresolved issues were identified: password recovery email delivery, AI quiz cloud persistence and AI quiz educational content quality. These defects require developer fixes and retesting.

**Final Assessment:** Core tested features are functional, with documented outstanding bugs and additional database security verification still required.

**Submitted by:** Prince Karki  
**Team:** 5 — Smart Study Companion  
**Date:** November 11, 2026
