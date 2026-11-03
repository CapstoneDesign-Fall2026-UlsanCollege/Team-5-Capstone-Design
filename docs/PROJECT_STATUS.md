# Project Status

**Last updated:** 2026-11-04

## Current evidence snapshot

The current Week 9 record describes Supabase Auth and PostgreSQL implementation, automated checks on a local working snapshot, and the limits of the available browser/live-service evidence. See the [Week 9 shared report](week9/weekly-report.md). Implementation history and source review are not substitutes for a live end-to-end result.

### Documentation available

- [QA Evidence Matrix](week9/QA_EVIDENCE_MATRIX.md): reproducible cases, result labels, environment boundaries, and safe evidence expectations.
- [Final Demo Roadmap](week9/FINAL_DEMO_ROADMAP.md): intended demo path, acceptance evidence, and fallback criteria.
- [Contribution ledger](CONTRIBUTION_LEDGER.md): Week 9 personal record for RaiPrabin697; this entry describes documentation work only.

### Verification pending

| Behavior | Current status | Next action |
|---|---|---|
| Fresh browser smoke test | Not run in the dated test report; local server bind failed. | Rerun when the local server is available and record actual results. |
| Fresh Supabase signup/sign-in and email verification | Not demonstrated by the current records. | Test with disposable accounts; record environment, date, tester, expected/actual result, and safe proof. |
| Task creation and persistence after reload | Live Supabase behavior not verified; subject catalog mismatch/fallback is noted in the code review. | Reconcile the catalog, create a task, reload, and record the observed result. |
| Two-account RLS isolation | Not tested in the existing records. | Verify account B cannot read or change account A’s private test data. |
| Quiz attempts and answer-key privacy | Persistence is unresolved; database review flags client visibility of `correct_answer`. | Record a team decision and verify the chosen approach; consider trusted server-side scoring. |
| Migration setup | README instructions and the reported migration inventory differ. | Confirm the ordered migration set and test on a clean Supabase project. |

See the [Week 9 test report](week9/TEST_REPORT_2026-11-03.md), [database review](week9/database-model-check-report.md), and [upgrade plan](week9/NEXT_WEEK_UPGRADE_PLAN.md) for source evidence and limitations.

## Historical Week 6 prototype evidence

The Week 6 screenshots and tested-by record document a browser-prototype path at that time: [subject/task screenshot](Week6/Demo%203.png), [quiz screenshot](Week6/Demo%204.png), [persistence screenshot](Week6/Demo%205.png), and [tested-by note](Week6/tested-by-notes.md). These are historical prototype artifacts and do not demonstrate current Supabase authentication, cloud persistence, or RLS behavior. The Week 6 theme inconsistency is also a historical follow-up; consult its original issue before treating it as current.

## Scope not demonstrated

- Live account creation, sign-in, and email verification
- Cloud task persistence after reload
- Cross-account data isolation
- Quiz answer privacy and end-to-end attempt/response persistence
- Clean-project migration setup

Do not mark these items complete until a tester records the actual result and links safe proof. Never include passwords, access tokens, service keys, recovery codes, or private account data in repository evidence.
