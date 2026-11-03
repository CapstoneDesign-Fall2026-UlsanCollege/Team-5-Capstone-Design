# Final Demo Roadmap

**Status:** Planning aid; dates and owners beyond confirmed personal documentation work are pending team agreement. No future milestone is reported as complete.

## Demo journey

1. **Account entry:** use a disposable test account to sign up and sign in; record whether the environment is local preview or live Supabase.
2. **Study setup:** choose a subject and show the available study view. Note any catalog mismatch instead of hiding it.
3. **Task behavior:** create a task, show it in the list, reload, and check whether the same account still sees it. Capture errors as well as success.
4. **Privacy check:** sign out, use a separate disposable account, and verify it cannot read or change the first account’s task.
5. **Quiz and limitations:** show quiz behavior only to the extent actually verified; disclose whether answers and attempts persist and whether answer keys are visible to the client.
6. **Evidence close:** link the dated report, QA matrix, issues, and safe proof. State what was not tested.

## Milestones and acceptance evidence

| Milestone | Owner | Acceptance evidence | Status |
|---|---|---|---|
| Prepare QA record and reusable steps | RaiPrabin697 | [QA Evidence Matrix](QA_EVIDENCE_MATRIX.md) and this roadmap | Documentation drafted in this PR |
| Fresh signup/sign-in and task reload | RaiPrabin697 for proposed personal validation; execution pending | Dated steps, expected/actual result, environment, safe screenshot/log | **Not run** |
| Two-account isolation | RaiPrabin697 for proposed personal validation; execution pending | Account A/B result with private values redacted; no credentials | **Not run** |
| Resolve catalog and quiz persistence findings | Owner to confirm | Linked issue, code change, focused test and report update | Pending |
| Decide quiz answer-key exposure treatment | Team decision; owner to confirm | Recorded decision and, if changed, server-side scoring evidence | Pending |
| Confirm migration sequence on clean project | Owner to confirm | Ordered migration list and clean setup/test receipt | Pending |

## Demo fallback criteria

- If live Supabase is unavailable, label the demo **local preview** and do not imply cloud persistence or RLS was exercised.
- If signup or sign-in fails, capture the error without exposing account details; continue only with an explicitly labeled local-only path.
- If task creation appears successful but is lost after reload, record a failure and show the issue; do not describe it as saved.
- If a second account can access another account’s private record, stop the privacy demonstration and record the security issue without exposing private data.
- If quiz persistence or answer privacy is uncertain, show the UI as a prototype and disclose the unverified scope.

## Evidence handling

Use disposable accounts and synthetic tasks only. Redact email addresses and identifiers from screenshots. Never place passwords, access tokens, service keys, or recovery codes in repository files, commit messages, screenshots, or logs.

For every milestone, keep the issue status, acceptance criteria, report, and proof link consistent. Mark a check complete only after a tester records the actual observation.
