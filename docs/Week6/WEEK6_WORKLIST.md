# Week 6 Work Checklist — Test the Vertical Slice

**Date:** Thu 2026-10-08 to Wed 2026-10-14  
**Team:** Team 5 — Smart Study Companion  
**Team Size:** 4 members

> Show one visible behavior, ask a teammate who did not build it to test the behavior, and record what actually happened. Keep an unfinished behavior marked incomplete; a failed test is useful evidence for the next Issue.

---

## Core Work — Complete All

### ✅ Run One Real Test

- [ ] **Choose one small user-visible behavior** from the Week 5 vertical slice.
  - [ ] Subject creation and selection
  - [ ] Task addition with deadline
  - [ ] Task completion marking
  - [ ] Quiz subject selection and submission
  - [ ] Data persistence after refresh

- [ ] **Start from a clear place and write repeatable test steps.**
  - [ ] Open `Frontend/index.html` in a clean browser tab
  - [ ] Reset local storage or use fresh browser profile
  - [ ] Document each step in order
  - [ ] Include setup requirements

- [ ] **State the expected result before running the test.**
  - [ ] Describe the visible behavior that should occur
  - [ ] Define any feedback or confirmation the user should see
  - [ ] Note any data that should persist

- [ ] **Ask a teammate other than the author to follow the steps without coaching.**
  - [ ] Tester: _________________
  - [ ] Author: _________________
  - [ ] No explanation or guidance from author during test
  - [ ] Tester follows steps exactly as written

- [ ] **Record the actual result, including confusing or missing behavior.**
  - [ ] Note what actually happened step-by-step
  - [ ] Record any errors, delays, or unexpected behavior
  - [ ] Capture missing visual feedback or data issues
  - [ ] Note confusion or unclear UI elements

- [ ] **If the test fails, record the first failing step and keep the related Issue incomplete.**
  - [ ] First failure at step: _________________
  - [ ] Related Issue: _________________
  - [ ] Mark Issue as "Needs Fix" or "Blocked"

---

### ✅ Connect the Test to the Work

- [ ] **Complete a Tested-By Note with full documentation**
  - [ ] Fill `docs/Week6/tested-by-notes.md` completely
  - [ ] Include tester name, date, and exact steps
  - [ ] Document expected vs. actual results
  - [ ] Add proof link (screenshot, video, or issue reference)
  - [ ] Note the problem found (if any)
  - [ ] Define next action

- [ ] **Update the relevant Issue's Definition of Done and status**
  - [ ] Issue link: _________________
  - [ ] Current status: _________________
  - [ ] Updated Definition of Done: _________________
  - [ ] Mark as: ☐ Pass ☐ Fail ☐ Blocked ☐ Pending

- [ ] **Link the commit or pull request and proof**
  - [ ] Commit SHA or PR number: _________________
  - [ ] Screenshot or demo link: _________________
  - [ ] Issue reference in commit message: Yes / No

- [ ] **If blocked, create or update a blocker Issue**
  - [ ] Blocker Issue created: ☐ Yes ☐ No
  - [ ] Issue number: _________________
  - [ ] Owner assigned: _________________
  - [ ] Next action defined: _________________

---

### ✅ Record Team and Individual Evidence

- [ ] **Update the team's shared Week 6 Weekly Report**
  - [ ] Report location: `docs/Week6/WEEKLY_REPORT.md`
  - [ ] Do not create separate reports
  - [ ] Include test result summary
  - [ ] Link proof and tested-by note

- [ ] **Each student enters their contribution sentence and evidence link**
  - [ ] Member 1 — _________________ — Evidence: _________________
  - [ ] Member 2 — _________________ — Evidence: _________________
  - [ ] Member 3 — _________________ — Evidence: _________________
  - [ ] Member 4 — _________________ — Evidence: _________________
  - [ ] Update `docs/CONTRIBUTION_LEDGER.md` row for each member

- [ ] **Each student completes and links their Individual Evidence Receipt**
  - [ ] Member 1 — Receipt link: _________________
  - [ ] Member 2 — Receipt link: _________________
  - [ ] Member 3 — Receipt link: _________________
  - [ ] Member 4 — Receipt link: _________________

- [ ] **Keep personal data, secrets, and unapproved real-user data out**
  - [ ] No names, emails, or IDs in test results
  - [ ] No API keys or internal secrets
  - [ ] No real user data included
  - [ ] Sanitized or sample data only

---

## Evidence to Link

- [ ] **Relevant implementation Issue**
  - Issue number: _________________
  - Link: _________________
  - Current Definition of Done: ✓ Up to date
  - Status: ☐ Ready ☐ In Progress ☐ Pass ☐ Fail ☐ Blocked

- [ ] **Commit or pull request for the behavior tested**
  - Commit SHA: _________________ or PR #: _________________
  - Link: _________________
  - Includes test evidence reference: Yes / No

- [ ] **Tested-By Note**
  - File: `docs/Week6/tested-by-notes.md`
  - Completed by: _________________
  - Date: _________________
  - Status: ☐ Complete ☐ Pending

- [ ] **Screenshot, demo link, or short video**
  - File or link: _________________
  - Format: ☐ Screenshot ☐ Demo video ☐ Screen recording
  - Shows the expected behavior: Yes / No
  - Shows the actual behavior: Yes / No

- [ ] **Shared Weekly Report**
  - File: `docs/Week6/WEEKLY_REPORT.md`
  - Contribution rows from all members: Yes / No
  - Evidence links present: Yes / No
  - Tester name and result included: Yes / No

- [ ] **Individual Evidence Receipt from each student**
  - All 4 members completed: Yes / No
  - Receipts linked in ledger: Yes / No
  - No duplicates or missing members: Yes / No

- [ ] **Bug or blocker Issue (if found)**
  - Issue number: _________________
  - Link: _________________
  - Owner assigned: _________________
  - Next action defined: _________________

---

## Stretch Menu — Optional After Core Work

### Stronger User Test

- [ ] **Ask a teammate who was NOT in the implementation discussion to try from a clean start**
  - [ ] Different tester than the first: Yes / No
  - [ ] Tester name: _________________
  - [ ] Uses clean browser profile: Yes / No

- [ ] **Test one empty, error, loading, or recovery state**
  - State type: ☐ Empty ☐ Error ☐ Loading ☐ Recovery
  - Specific test: _________________
  - Expected behavior: _________________
  - Actual behavior: _________________

- [ ] **Write one success signal and show how the test observes it**
  - Success signal: _________________
  - How test proves it: _________________
  - Evidence link: _________________

### Better Technical Evidence

- [ ] **Turn the manual check into a repeatable smoke test**
  - [ ] Test steps documented in code comments: Yes / No
  - [ ] Can another dev run it without explanation: Yes / No
  - [ ] Test file location: _________________

- [ ] **Add a short setup note for another teammate to run the slice**
  - [ ] File: `docs/Week6/SETUP_GUIDE.md`
  - [ ] Includes browser requirements: Yes / No
  - [ ] Includes local storage reset steps: Yes / No
  - [ ] Includes expected time: Yes / No

- [ ] **Fix one bug found during the test and repeat the same test**
  - [ ] Bug found: _________________
  - [ ] Fix committed: Yes / No
  - [ ] Commit SHA: _________________
  - [ ] Retest completed: Yes / No
  - [ ] Retest result: ☐ Pass ☐ Fail ☐ Blocked

### Better Midterm Path

- [ ] **Write the first 3–5 steps of the midterm demo path**
  - [ ] File: `docs/Week6/MIDTERM_DEMO_PATH.md`
  - [ ] Step 1: _________________
  - [ ] Step 2: _________________
  - [ ] Step 3: _________________
  - [ ] Step 4: _________________
  - [ ] Step 5: _________________

- [ ] **List one claim the team can already prove and one it cannot**
  - [ ] Can prove: _________________
  - [ ] Cannot yet prove: _________________
  - [ ] Evidence for proven claim: _________________
  - [ ] Blocker for unproven claim: _________________

- [ ] **Identify one improvement for Week 7 rehearsal clarity**
  - [ ] Improvement: _________________
  - [ ] Impact: _________________
  - [ ] Assigned to: _________________

---

## Risks and Exceptions

If a core item is incomplete, name the owner, reason, and next action in GitHub.

| Item | Owner | Reason | Next Action | Review Point |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |

---

## Final Check — Before Submission

- [ ] **Another teammate can repeat the test using the written steps**
  - [ ] Steps are clear and unambiguous: Yes / No
  - [ ] No missing prerequisites: Yes / No
  - [ ] Repeatable without coaching: Yes / No
  - [ ] Tester name (verification): _________________

- [ ] **The evidence supports the claim and the Issue status is honest**
  - [ ] Test result matches Issue status: Yes / No
  - [ ] Proof links are valid and accessible: Yes / No
  - [ ] No overclaimed features in documentation: Yes / No
  - [ ] Reviewed by: _________________ Date: _________________

- [ ] **The next midterm-demo improvement is assigned and visible in GitHub**
  - [ ] Improvement Issue created: ☐ Yes ☐ No
  - [ ] Issue number: _________________
  - [ ] Assigned to: _________________
  - [ ] Added to GitHub project: Yes / No
  - [ ] Visible in [Project Status](../PROJECT_STATUS.md): Yes / No

---

## Quick Links for Your Team

| Resource | Purpose |
|---|---|
| [Tested-By Note Template](tested-by-notes.md) | Record test steps and results |
| [Project Status](../PROJECT_STATUS.md) | Track ready, pending, and blocked work |
| [Contribution Ledger](../CONTRIBUTION_LEDGER.md) | Member evidence tracking |
| [Testing Strategy](../tests/README.md) | Manual test planning |
| [Frontend Prototype](../../Frontend/index.html) | The thing being tested |

---

**Completed by:** _________________ **Date:** _________________

**Reviewed by:** _________________ **Date:** _________________
