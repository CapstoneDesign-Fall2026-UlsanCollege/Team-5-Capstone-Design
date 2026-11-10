Rai Prabin - Week 10 Browser Test Checklist
Purpose: Repeatable checklist for the Week 10 functional-test slice. This is a test plan, not evidence that any scenario passed. All checks start as Not run.
Run Information
Field
Record for each run
Tester
Rai Prabin (RaiPrabin697) unless another tester is explicitly named
Run date and time
Not run
Build/commit or deployed URL
Not run
Browser and version
Not run
Device and viewport
Not run
App mode
Not run; identify as Supabase live, Local Preview, or unknown
Test account labels
Use labels such as Account A; never record credentials or private keys
Mode and Safety Gate
Identify the app instance and data path before testing. A successful page load or visible task in Local Preview does not demonstrate cloud persistence or Row Level Security. Mark Supabase live only after confirming an authenticated session against the intended test project and that the operation used the cloud path. If mode cannot be confirmed, record unknown and make no cloud-behavior claim. Use disposable test accounts and data. Never include passwords, OTPs, reset links, access tokens, email addresses, or keys in screenshots, logs, or this report.
Scenarios
AUTH-01 - Valid sign-up
Open sign-up in the recorded app instance. 
Enter valid disposable test-account details and submit. 
Complete any required verification without capturing the code. 
Record the confirmation and whether the account can sign in. 
Expected: Valid input is accepted and the documented activation flow completes. Actual: Not run. Status: Not run. Environment: Not run. Issue / notes: None recorded. Screenshot: rai-prabin/screenshots/AUTH-01-sign-up-valid.png (pending).
AUTH-02 - Invalid sign-up
Submit an invalid email, then a password that fails the displayed requirements; use test-only values. 
Record validation messages and whether submission is blocked. 
Expected: Invalid values are rejected with clear feedback; rejected input does not create an account. Actual: Not run. Status: Not run. Environment: Not run. Issue / notes: None recorded. Screenshot: rai-prabin/screenshots/AUTH-02-sign-up-invalid.png (pending; redact values).
AUTH-03 - Valid sign-in
Use the disposable account from AUTH-01 after required verification. 
Sign in and record the destination and authenticated state. 
Expected: Valid credentials open the intended authenticated view. Actual: Not run. Status: Not run. Environment: Not run. Issue / notes: None recorded. Screenshot: rai-prabin/screenshots/AUTH-03-sign-in-valid.png (pending; clear credential fields).
AUTH-04 - Invalid sign-in
Sign out or use a clean session. 
Submit an invalid email/password combination using test-only values. 
Record the error and whether the authenticated view remains inaccessible. 
Expected: Sign-in is rejected, feedback is shown, and no authenticated session is established. Actual: Not run. Status: Not run. Environment: Not run. Issue / notes: None recorded. Screenshot: rai-prabin/screenshots/AUTH-04-sign-in-invalid.png (pending; redact values).
AUTH-05 - Password-reset request
Open password recovery and request a reset for a disposable account. 
Record the on-screen result and whether the test inbox receives the expected message. Do not capture reset links or codes. 
Expected: The documented recovery request is acknowledged and the configured flow can proceed. Actual: Not run. Status: Not run. Environment: Not run. Issue / notes: None recorded. Screenshot: rai-prabin/screenshots/AUTH-05-password-reset-request.png (pending; no email/code visible).
TASK-01 - Valid task with deadline
Sign in and select an available subject. 
Create a task with a non-sensitive title and future deadline; submit once. 
Record the result and displayed subject/deadline. 
Expected: One task appears with the selected subject and deadline. For a cloud claim, separately verify the saved row in the authorized test project. Actual: Not run. Status: Not run. Environment: Not run. Issue / notes: None recorded. Screenshot: rai-prabin/screenshots/TASK-01-valid-task-deadline.png (pending).
TASK-02 - Invalid task input
Submit a blank title, then a whitespace-only title. 
If allowed by the form, test missing required subject/deadline separately. 
Record validation and whether any task was added. 
Expected: Invalid or missing required values are rejected with clear feedback and no task is added. Actual: Not run. Status: Not run. Environment: Not run. Issue / notes: None recorded. Screenshot: rai-prabin/screenshots/TASK-02-invalid-task-input.png (pending).
TASK-03 - Deadline behavior
Create a task with an identifiable due date and, if supported, a past-due date. 
Check displayed date, ordering, and due/overdue state after saving. 
Record browser timezone and any date shift. 
Expected: The selected date is retained and displayed consistently; status and ordering match documented behavior. Actual: Not run. Status: Not run. Environment: Not run. Issue / notes: None recorded. Screenshot: rai-prabin/screenshots/TASK-03-deadline-display.png (pending).
TASK-04 - Persistence after refresh
Use TASK-01 and record the active app mode. 
Reload, restore the same test account if needed, and return to the task list. 
Check whether the task, subject, and deadline remain. 
For cloud persistence, confirm the row in the test database using a non-sensitive account label. 
Expected: The task remains after reload in the tested mode. State whether persistence was browser-local or Supabase-backed. Actual: Not run. Status: Not run. Environment: Not run. Issue / notes: None recorded. Screenshot: rai-prabin/screenshots/TASK-04-after-refresh.png (pending).
Results Summary
Scenario
Expected
Actual
Status
Issue / next action
Screenshot
AUTH-01 Valid sign-up
Account flow completes
Not run
Not run
Run with disposable account
Pending
AUTH-02 Invalid sign-up
Invalid values rejected
Not run
Not run
Record validation
Pending
AUTH-03 Valid sign-in
Authenticated view opens
Not run
Not run
Run after sign-up
Pending
AUTH-04 Invalid sign-in
Access denied with feedback
Not run
Not run
Use test-only values
Pending
AUTH-05 Password reset
Recovery request handled
Not run
Not run
Check test inbox safely
Pending
TASK-01 Valid task/deadline
Task appears with chosen deadline
Not run
Not run
Identify mode and verify save
Pending
TASK-02 Invalid task
Required values rejected
Not run
Not run
Confirm no task added
Pending
TASK-03 Deadline behavior
Date/status/order consistent
Not run
Not run
Record timezone
Pending
TASK-04 Refresh persistence
Task remains in stated mode
Not run
Not run
Separate local from cloud proof
Pending
Recording a Run
Only replace Not run with observations after executing the scenario. Use Pass, Fail, or Blocked with a brief explanation. Record date, app URL/build, browser, mode, repeatable steps, expected and actual outcomes, issue link if applicable, and screenshot filename. Keep Local Preview distinct from live Supabase. A visible page or successful deployment alone does not prove cloud save/read or account isolation.
test
