# MVP Verification Matrix

Prepared 2026-11-14. Every current-run result below is **Not run**. Historical evidence is linked separately and is not copied into current actual results.

| ID | Required behavior and expected result | Current actual / status | Historical evidence | Current environment / revision / tester / proof | Limit / next check |
|---|---|---|---|---|---|
| AUTH-01 | Valid signup/sign-in succeeds; invalid input is rejected; refresh restores intended session; logout removes access | No execution / Not run | [AUTH-01](EVIDENCE_REGISTER.md) | All pending; no current proof | Disposable accounts; confirm live configuration and session |
| TASK-01 | Valid title and subject save exactly one task; blank title saves none | No execution / Not run | [TASK-01 unit result](EVIDENCE_REGISTER.md) | All pending; no current proof | Repeat in browser and inspect service response |
| TASK-02 | Saved task reads back with matching title, subject and deadline; survives reload | No execution / Not run | [TASK-02 browser/API receipt](EVIDENCE_REGISTER.md) | All pending; no current proof | Match row identity before and after reload; local storage alone is not cloud proof |
| TASK-03 | Completing task updates list/count; valid deadline is displayed; invalid date is rejected | No execution / Not run | [Historical report](../week_10/TESTING_REPORT.md) | All pending; no current proof | Record timezone and boundary cases; UI label is not reminder delivery |
| DATA-01 | Account B cannot read, update or delete Account A's private task through the service | No execution / Not run | [UI-only separation](EVIDENCE_REGISTER.md) | All pending; no current proof | Verify response and unchanged A row; use ordinary B session, never privileged key |
| AUTH-02 | Recovery request leads to delivered email and successful reset, then old password fails | No execution / Not run | [Historical failed/blocked receipt](EVIDENCE_REGISTER.md) | All pending; no current proof | Private email steps; acknowledgement alone insufficient |
| QUIZ-01 | Quiz content is appropriate and attempt stores/reloads | No execution / Not run | [Historical failures](EVIDENCE_REGISTER.md) | All pending; no current proof | Supporting feature; unresolved #53/#54, not required task-path gate |
| SETUP-01 | Non-author follows setup on isolated project and repeats core path | No execution / Not run | None | All pending; no current proof | [Clean-setup receipt](INDEPENDENT_VERIFICATION.md) |

Acceptance of the core route requires AUTH-01, TASK-01, TASK-02 and DATA-01 with reproducible receipts and non-author review. Supporting features must be disclosed if excluded. See [freeze decision](FREEZE_DECISION.md).

Record each run using the metadata and evidence classifications in the [register](EVIDENCE_REGISTER.md). Do not count unit tests, source inspections or deployed-page loading as equivalent to live persistence.
