# localStorage Persistence Test Status

**Assigned to:** adronnie  
**Date:** 2026-09-29  
**Status:**  PENDING

## Test Requirement

From [Week 4 Checkpoint](./chuseok-checkpoint.md):

 Test data persistence  
 Main responsibility: localStorage test
> 
 Open the application.
 Create one subject, such as Programming.
 Add one task, such as Python Basics, with a deadline.
 Refresh the page.
 Check whether the subject and task are still there.
 Record the result and link the evidence, or explain the blocker.
 Expected result: Proof that the subject and task remain after refreshing, or a documented problem.

## Current Status

** BLOCKED** — Test cannot be executed because:

1. **React + Vite project not yet scaffolded**
   - Track 1 (Project setup, Owner: Nabin Khadka) must complete first
   - Required: `npm run dev` running successfully

2. **Application components not yet implemented**
   - Subject creation component needed
   - Task creation component with deadline support needed
   - localStorage integration needed

3. **No browser environment to test**
   - Cannot open or interact with the application

## Blocker Details

The test **cannot produce real evidence** until:
-  React + Vite project is created and runnable
-  Subject creation feature is implemented
-  Task creation with deadline feature is implemented
-  localStorage save/load logic is coded and integrated

This test depends directly on **Track 1** completion (Nabin Khadka's responsibility).

## Action Plan

Once the app is running locally:

1. Open `http://localhost:5173` (or the configured dev server URL)
2. Create subject: **Programming**
3. Add task: **Python Basics** with deadline
4. Refresh the browser
5. Verify subject and task are still present
6. Take screenshot(s) of:
   - Browser DevTools → Application → Local Storage
   - The rendered UI showing the persisted data
7. Document findings in this file
8. Link all evidence (screenshots, console logs, JSON data)

## Expected Outcome

Once this test is executed with actual app evidence, one of two results:

-  **PASS**: Subject and task persist after page refresh
-  **FAIL**: Data is lost; document the bug and create an issue

## No Fake Evidence

This test will **not be marked complete** until there is real, observable proof from running the actual application.

---

**Next Review:** After Track 1 project setup is done (Week 5)
