# Independent Verification and Handoff

Prepared 2026-11-14. **Result: Not run.** Proposed reviewer: princekark; acceptance pending. Choose a non-author of the specific implementation/check and record any overlap; a second name alone does not establish independence.

## Prerequisites

Use an approved disposable test project, two disposable accounts A/B, known source SHA and deployed build. Follow [setup](../week5/SETUP_INSTRUCTIONS.md#current-application-setup-2026-11-14). Account credentials, verification codes and recovery steps stay private. Confirm the runtime mode before testing.

## Core reproduction without coaching

1. Record date/timezone, browser/version, URL/build, revision and live/local mode.
2. Sign in as A; select an existing subject. Create `W11-task-check-<unique suffix>` with a future deadline. Record expected one saved row and actual result.
3. Submit a whitespace-only title. Expect clear rejection and no added row. Record actual UI/service outcome.
4. Read the valid task back; compare ID, title, subject, deadline and completion state. Reload and compare again. Capture sanitized response plus screenshot; a screenshot alone cannot prove the storage source.
5. Sign in as B in a separate browser profile. Check the list, then use the ordinary B session to request A's task ID directly through the supported service/API. Check read, update and delete. Never use a service-role key.
6. Return to A and verify the task is unchanged. Record denial or empty result as actually returned; HTTP 200 with an empty filtered result may be legitimate, so inspect content and state rather than status alone.
7. Save sanitized receipts with [register metadata](EVIDENCE_REGISTER.md). Record assistance/coaching verbatim in substance. Clean up only these disposable test records after evidence capture.

## Reviewer receipt

- Reviewer / implementation author / relationship: pending.
- Execution date, source revision, deployment, browser and mode: pending.
- Expected/actual for TASK-01, TASK-02 and DATA-01: not recorded; **Not run**.
- Evidence links: none yet, not placeholder image filenames.
- Coaching received: not recorded; do not assume none.
- Observation and decision: pending; [freeze](FREEZE_DECISION.md) remains unapproved.
- Next action: reviewer accepts the task, obtains approved environment, runs steps and records failures as well as successes.

## Clean-setup receipt

**SETUP-01: Not run.** Record clean machine/browser profile, Node/package versions, source SHA, migration filenames/order actually applied, sanitized command output, configuration names used, smoke-test result and deviations from instructions. Exact values and secrets must not be included.

No clean installation or migration execution occurred during this documentation work. If prerequisites cannot be obtained, record Blocked with the missing prerequisite and responsible contact instead of marking setup Pass.

## Support path

Proposed: data/RLS to adronnie; integration to liftupkhadka555-spec; test receipt to RaiPrabin697; auth reproduction to princekark; UI to jn-oli. Acceptance and backups are tracked in the [ownership addendum](../week_10/AI_USE_AND_CODE_OWNERSHIP_AUDIT.md#week-11-reconciliation-2026-11-14).
