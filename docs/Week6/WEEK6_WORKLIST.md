# Week 6 Work Checklist - Test the Vertical Slice

**Date:** Thu 2026-10-08 to Wed 2026-10-14<br>
**Team:** Team 5

Show one visible behavior, ask a teammate who did not build it to test the behavior, and record what actually happened. Keep unfinished work marked incomplete; a failed or partial test is useful evidence for the next issue.

## Core work - complete all

### Run one real test

- [x] Choose one small user-visible behavior from the Week 5 vertical slice.
- [x] Start from a clear place and write repeatable test steps.
- [x] State the expected result before running the test.
- [x] Ask a teammate other than the author to follow the steps without coaching.
- [x] Record the actual result, including confusing or missing behavior.
- [x] Record the first issue found and keep the related issue open until resolved.

### Connect the test to the work

- [x] Complete a Tested-By Note with the tester, date, steps, expected result, actual result, proof link, problem found, and next action.
- [x] Update Issue #23 so its Definition of Done and status match the result.
- [x] Link screenshot proof for Demo 1-5.
- [x] Use Issue #25 as the canonical theme/color tracker with owner still to confirm.

### Record team and individual evidence

- [x] Update the team's one shared Week 6 Weekly Report.
- [x] Add contribution rows for all five current logins.
- [ ] Link separate personal evidence receipts if the team requires them.
- [x] Keep personal data, secrets, and unapproved real-user data out of shared evidence.

## Evidence to link

- [x] Relevant validation issue with current status: [Issue #23](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23)
- [x] Theme/color tracker: [Issue #25](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/25)
- [x] Tested-By Note with steps, expected and actual results, and proof.
- [x] Demo 1-5 screenshots that support the claim.
- [x] One shared Weekly Report with contribution/evidence rows from every current login.
- [ ] Separate personal evidence receipts, if required by the team.

## Stretch menu - optional after the core work

Choose an extension only if it helps the team test more clearly or prepare the midterm path.

### Stronger user test

- [ ] Ask a teammate unfamiliar with the implementation to try the path from a clean start.
- [ ] Test one empty, error, loading, or recovery state tied to the main path.
- [ ] Write one success signal and show how the current test observes it.

### Better technical evidence

- [ ] Turn the manual check into a repeatable smoke test.
- [ ] Add a short setup note so another teammate can run the slice.
- [ ] Fix the theme issue and repeat the same test.

### Better midterm path

- [x] Write the first 3-5 steps of the midterm demo path.
- [x] List one claim the team can already prove and one claim it cannot yet prove.
- [x] Identify one improvement that will make the midterm rehearsal clearer or more reliable.

## Risks and exceptions

| Item | Owner | Next action | Review point |
|---|---|---|---|
| Theme/color inconsistency | owner to confirm in Issue #25 | Fix CSS/theme, rerun Demo 1-5 path, and link updated proof | Issue #23 and tested-by note match rerun result |
| localStorage/browser-only scope | Team 5 | Keep scope explicit; do not claim backend, login, or multi-device sync | Weekly report and issue text stay honest |

## Final check

- [x] Another teammate can repeat the test using the written steps.
- [x] The evidence supports the claim and the issue status is honest.
- [x] The next midterm-demo improvement is assigned and visible in GitHub.
