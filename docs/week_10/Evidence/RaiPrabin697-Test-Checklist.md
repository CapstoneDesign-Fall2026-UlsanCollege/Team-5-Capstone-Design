# Rai Prabin - Week 10 Browser Test Checklist

**Purpose:** Repeatable checklist for the Week 10 functional-test slice. This is a plan, not proof of a test run. Every scenario starts as **Not run**.

## Run information

| Field | Record for each run |
|---|---|
| Tester | Rai Prabin (RaiPrabin697), unless another tester is named |
| Date and time | Not run |
| Build/commit or deployed URL | Not run |
| Browser/version; device/viewport | Not run |
| App mode | Not run: Supabase live, Local Preview, or unknown |
| Test accounts | Use labels such as Account A/B; never record credentials |

## Mode and safety gate

Identify the app instance and data path before testing. A successful page load or visible task in Local Preview does not demonstrate cloud persistence or Row Level Security. Mark Supabase live only after confirming an authenticated session against the intended test project and that the operation used the cloud path. If mode is unknown, make no cloud-behavior claim. Use disposable test accounts and data. Never include passwords, OTPs, reset links, access tokens, email addresses, or keys in screenshots, logs, or this report.

## Scenarios

For every scenario record environment, expected result, actual result, status, issue/notes, and screenshot. Results remain **Not run** until actually performed.

### AUTH-01 - Valid sign-up
1. Open sign-up in the recorded app instance.
2. Submit valid disposable account details and complete any required verification without capturing the code.
3. Record confirmation and whether the account can sign in.

**Environment:** Not run. **Expected:** Valid input is accepted and the documented activation flow completes. **Actual:** Not run. **Status:** Not run. **Issue:** None recorded. **Screenshot:** rai-prabin/screenshots/AUTH-01-sign-up-valid.png (pending).

### AUTH-02 - Invalid sign-up
1. Submit an invalid email, then a password failing displayed requirements; use test-only values.
2. Record validation and whether submission is blocked.

**Environment:** Not run. **Expected:** Invalid values are rejected with clear feedback; rejected input creates no account. **Actual:** Not run. **Status:** Not run. **Issue:** None recorded. **Screenshot:** rai-prabin/screenshots/AUTH-02-sign-up-invalid.png (pending; redact values).

### AUTH-03 - Valid sign-in
1. Use the disposable account from AUTH-01 after required verification.
2. Sign in and record the destination and authenticated state.

**Environment:** Not run. **Expected:** Valid credentials open the intended authenticated view. **Actual:** Not run. **Status:** Not run. **Issue:** None recorded. **Screenshot:** rai-prabin/screenshots/AUTH-03-sign-in-valid.png (pending; clear credential fields).

### AUTH-04 - Invalid sign-in
1. Sign out or use a clean session; submit an invalid email/password using test-only values.
2. Record the error and whether the authenticated view remains inaccessible.

**Environment:** Not run. **Expected:** Sign-in is rejected with feedback and no authenticated session is established. **Actual:** Not run. **Status:** Not run. **Issue:** None recorded. **Screenshot:** rai-prabin/screenshots/AUTH-04-sign-in-invalid.png (pending; redact values).

### AUTH-05 - Password-reset request
1. Open password recovery and request a reset for a disposable account.
2. Record on-screen result and whether the test inbox receives the message; do not capture reset links or codes.

**Environment:** Not run. **Expected:** The recovery request is acknowledged and the configured flow can proceed. **Actual:** Not run. **Status:** Not run. **Issue:** None recorded. **Screenshot:** rai-prabin/screenshots/AUTH-05-password-reset-request.png (pending; no email/code visible).

### TASK-01 - Valid task with deadline
1. Sign in and select an available subject.
2. Create a task with a non-sensitive title and future deadline; submit once.
3. Record the result and displayed subject/deadline.

**Environment:** Not run. **Expected:** One task appears with its selected subject and deadline. Verify the saved row separately for any cloud claim. **Actual:** Not run. **Status:** Not run. **Issue:** None recorded. **Screenshot:** rai-prabin/screenshots/TASK-01-valid-task-deadline.png (pending).

### TASK-02 - Invalid task input
1. Submit a blank title, then a whitespace-only title.
2. If allowed, test missing required subject/deadline separately; record whether a task was added.

**Environment:** Not run. **Expected:** Invalid or missing required values are rejected with clear feedback and no task is added. **Actual:** Not run. **Status:** Not run. **Issue:** None recorded. **Screenshot:** rai-prabin/screenshots/TASK-02-invalid-task-input.png (pending).

### TASK-03 - Deadline behavior
1. Create a task with an identifiable due date and, if supported, a past-due date.
2. Check displayed date, ordering, due/overdue state, browser timezone, and any date shift.

**Environment:** Not run. **Expected:** Selected date is retained and displayed consistently; status/order match documented behavior. **Actual:** Not run. **Status:** Not run. **Issue:** None recorded. **Screenshot:** rai-prabin/screenshots/TASK-03-deadline-display.png (pending).

### TASK-04 - Persistence after refresh
1. Use TASK-01 and record app mode. Reload, restore the same test account if needed, and return to the task list.
2. Check if the task, subject, and deadline remain. For cloud persistence, confirm the row in the test database with a non-sensitive account label.

**Environment:** Not run. **Expected:** Task remains after reload in the tested mode; state whether this was browser-local or Supabase-backed. **Actual:** Not run. **Status:** Not run. **Issue:** None recorded. **Screenshot:** rai-prabin/screenshots/TASK-04-after-refresh.png (pending).

## Results summary

| Scenario | Expected | Actual | Status | Issue / next action | Screenshot |
|---|---|---|---|---|---|
| AUTH-01 Valid sign-up | Account flow completes | Not run | Not run | Run with disposable account | Pending |
| AUTH-02 Invalid sign-up | Invalid values rejected | Not run | Not run | Record validation | Pending |
| AUTH-03 Valid sign-in | Authenticated view opens | Not run | Not run | Run after sign-up | Pending |
| AUTH-04 Invalid sign-in | Access denied with feedback | Not run | Not run | Use test-only values | Pending |
| AUTH-05 Password reset | Recovery request handled | Not run | Not run | Check test inbox safely | Pending |
| TASK-01 Valid task/deadline | Task appears with chosen deadline | Not run | Not run | Identify mode and verify save | Pending |
| TASK-02 Invalid task | Required values rejected | Not run | Not run | Confirm no task added | Pending |
| TASK-03 Deadline behavior | Date/status/order consistent | Not run | Not run | Record timezone | Pending |
| TASK-04 Refresh persistence | Task remains in stated mode | Not run | Not run | Separate local from cloud proof | Pending |

## Recording a run

Only replace Not run with observations after executing the scenario. Use Pass, Fail, or Blocked with a brief explanation. Record date, app URL/build, browser, mode, steps, expected/actual outcomes, issue link if applicable, and screenshot filename. Keep Local Preview distinct from live Supabase. A visible page or successful deployment alone does not prove cloud save/read or account isolation.
