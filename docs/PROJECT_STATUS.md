# Project Status**Last updated:** 2026-11-04

## Ready

| Item | Evidence |
|---|---|
| Browser prototype opens locally | [Frontend prototype](../Frontend/index.html) |
| Subject/task flow is visible | [Week 6 Demo 3](Week6/Demo%203.png) |
| Quiz flow is visible | [Week 6 Demo 4](Week6/Demo%204.png) |
| Persistence proof is recorded | [Week 6 Demo 5](Week6/Demo%205.png) |
| Tested-by evidence is documented | [Week 6 tested-by note](Week6/tested-by-notes.md) |

## Needs Follow-Up

| Item | Next action |
|---|---|
| Theme/color inconsistency | Create/update issue, fix CSS, and retest |
| Exact independent tester name | Confirm final tester name in the tested-by note |
| Issue Definition of Done | Copy the Week 6 issue-status update into Issues #22 and #23 |
| Midterm rehearsal | Run the demo path from [MIDTERM_DEMO_PATH.md](Week6/MIDTERM_DEMO_PATH.md) |

## Not In Current Scope

- Backend login
- Cloud database sync
- AI-generated quiz questions
- Reminder notifications
- Mobile app packaging


## Week 9 current evidence snapshot

This snapshot supplements the earlier Week 6 status above. Current implementation and test records are summarized in the [Week 9 report](week9/weekly-report.md); the Week 6 prototype screenshots remain historical evidence and are not proof of current Supabase behavior.

### Documentation ready

- [QA Evidence Matrix](week9/QA_EVIDENCE_MATRIX.md) defines reproducible cases and honest result labels.
- [Final Demo Roadmap](week9/FINAL_DEMO_ROADMAP.md) lists the intended journey, evidence criteria, and fallbacks.
- RaiPrabin697’s Week 9 contribution is documentation; no fresh application run is claimed.

### Verification pending

- Fresh browser smoke remains not run in the dated report.
- Live signup/sign-in, email verification, task persistence in Supabase, RLS, and two-account isolation remain unverified in the existing records.
- Subject catalog/task fallback, quiz attempt persistence, and quiz answer-key exposure need follow-up as described in the [Week 9 report](week9/weekly-report.md) and [upgrade plan](week9/NEXT_WEEK_UPGRADE_PLAN.md).

Do not use the older “Not In Current Scope” list above as a statement of the current architecture; it reflects the earlier Week 6 snapshot.
