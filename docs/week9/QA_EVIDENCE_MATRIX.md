# Week 9 QA Evidence Matrix

**Last updated:** 2026-11-04  
**Scope:** Documentation of available evidence and reproducible follow-up checks. This matrix does not record a new test run.

## Result labels

- **Pass:** The stated expected result was observed and linked proof was recorded.
- **Fail:** The observed result differed from expectation; retain the failure and its proof.
- **Blocked:** The check could not proceed; name the blocker and next action.
- **Not run:** No execution was performed. Do not infer a result from source inspection.
- **Code review only:** Files or schema were inspected without executing the behavior.

## Existing evidence boundaries

The [dated test report](TEST_REPORT_2026-11-03.md) records automated checks on a local working snapshot and says the fresh browser smoke test was not run because the local server could not bind. The [database review](database-model-check-report.md) is a repository/schema review, not a live database run. No live Supabase account, RLS, or cross-account result is established by those records.

## Repeatable QA cases

| Case | Environment | Steps | Expected result | Actual/status | Evidence or next action |
|---|---|---|---|---|---|
| Signup and sign-in | Live Supabase test project, once available | 1. Create a fresh test account. 2. Complete any configured verification step. 3. Sign out, then sign in. | Account is created and the same test account can sign in; errors are visible and no secret is exposed in evidence. | **Not run** in the current Week 9 records. | Run with disposable test accounts; record tester/date and safe screenshot or log. Never record passwords, tokens, or keys. |
| Subject/task create and reload | Live Supabase test project | 1. Sign in as test account A. 2. Select a subject. 3. Create a task. 4. Reload and inspect the task. | The task remains associated with the selected subject after reload; failed writes show an error, not false success. | **Not run** live; catalog mismatch and possible memory fallback are code-review findings. | Reconcile subject catalog first; attach sanitized before/after proof. |
| Account isolation | Live Supabase test project with accounts A and B | 1. Create a private task as A. 2. Sign out and sign in as B. 3. Check B's task list and authorized data access. | B cannot read or mutate A's private task; A still sees it after returning. | **Not run**. RLS behavior is unverified. | Execute only with test accounts; record the outcome and safe evidence. |
| Quiz answer visibility | Schema/code inspection, then authorized live test if available | 1. Inspect quiz-question read policy and client query. 2. Verify whether authenticated clients can receive `correct_answer`. | Answer keys are not exposed to clients, or an explicitly documented temporary risk is accepted with a remediation owner. | **Code review finding:** database review flags answer visibility; no team acceptance decision or live test is recorded. | Resolve the decision and consider trusted server-side scoring; see [database review](database-model-check-report.md). |
| Fresh browser smoke | Local browser | 1. Start the app using the documented local setup. 2. Visit auth, task, and quiz routes. 3. capture dated screenshots and console/network errors. | Routes load and the exercised interactions match the documented behavior. | **Blocked / not run** in the 2026-11-03 report (`listen EPERM`); no fresh browser run claimed here. | Rerun when the local server can bind; update the dated report with actual results. |

## Evidence record template

For each executed case, record:

- Date and tester login (author/tester distinction included)
- Commit or build identifier and environment (local preview or live Supabase)
- Repeatable steps and expected result
- Actual result and one label from the result legend
- Proof link, with credentials and private data removed
- Related issue and its matching status/Definition of Done

## RaiPrabin697 status

This matrix is documentation authored for the Week 9 evidence package. RaiPrabin697 has **not** recorded a fresh signup/sign-in, task reload, or second-account isolation run in this update. The next personal action is to execute those cases in an approved test environment and add date, actual results, and proof only after they are performed.


## Related issue links

| Issue | Use in this evidence package | Context |
|---|---|---|
| [#37 QA: functional, UI, quiz, and persistence testing](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/37) | Follow-up location for test cases and actual results. | Open when checked; its checklist is not evidence that the cases ran. |
| [#39 UI Design: Login & Signup](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/39) | Design-history reference for auth UI. | Its description predates the current implementation; do not treat it as live-auth proof. |
| [#38 Database Design: Login & Signup](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/38) | Database-design history reference. | Its description is a design proposal, not a record of the current database behavior. |
| [#40 Backend: Login & Signup](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40) | Backend/auth work history reference. | Keep its proposed scope distinct from any live test result. |

These links are navigation only. This documentation update does not modify the issues or claim their Definition of Done is satisfied.
