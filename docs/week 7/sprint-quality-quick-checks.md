# Sprint Quality Quick Checks

Complete the section for your current sprint at its final class meeting. These are quick evidence checks, not a demand for a perfect product.

## Sprint 0 - Launch and Scope (Week 3)

- [x] Every member can access the repository and board.  
  Evidence: docs/CONTRIBUTION_LEDGER.md lists members; repo is public.
- [x] Meaningful work has an Issue, owner, and Definition of Done.  
  Evidence: Issues exist (see Issues #22, #23, #25) and many docs reference issue-driven work.
- [x] The project purpose, target user, and scope boundary are visible.  
  Evidence: docs/README.md and docs/README.md describe purpose and target users.
- [x] The team agreement is linked and current.  
  Evidence: docs/week1/project_agreement.md
- [x] No personal data, secrets, or unapproved real-user data has been posted.
  Note: repo appears free of secrets; still follow the rule before adding screenshots.

## Sprint 1 - Vertical Slice (Week 7)

- [x] One small end-to-end user path works or its blocker is clearly documented.  
  Evidence: Week 6 evidence package shows a subject → task → quiz → refresh path (docs/Week6/README.md, Demo images).
- [x] The path has a screenshot, demo, or test note.  
  Evidence: docs/Week6/Demo 1.png, Demo 3.png, Demo 4.png, Demo 5.png and docs/Week6/tested-by-notes.md
- [ ] The team can explain what happens when the main path cannot complete.  
  Status: Not fully documented — some limitations and persistence edge-cases are noted across week3/week5 docs but the explicit fallback behavior and error messaging are not recorded in a single place. Recommend adding a short "fallback plan" section to docs/Week6/README.md or docs/week 7/midterm-demo-script.md. (Owner suggestion: Nabin Khadka)
- [x] The README or setup note tells another person how to view or run the current work.  
  Evidence: docs/README.md points to Frontend/index.html and docs/Week6 evidence. Recommendation: add Frontend/README.md with the single-step "open Frontend/index.html in a browser" and list known issues.
- [x] The team has checked that no secrets or private data are in its shared evidence.
  Evidence: No .env or secret files present in repo; evidence images are screenshots.

## Sprint 2 - MVP and Freeze (Week 11)

- [ ] The MVP happy path has been tested and recorded.
  Status: Partial — an end-to-end prototype path exists (Week 6) but a finalized MVP contract and freeze list are not yet recorded as a single authoritative file.
- [ ] Known bugs are labeled by severity and have an owner or plan.
  Status: Some issues are open and assigned; however severity labels and owner assignments are incomplete for all known bugs (theme issue, persistence race cases).
- [ ] New features are frozen or explicitly justified against the MVP contract.
  Status: Not yet — recommend a short MVP contract file (docs/MVP_CONTRACT.md) and a freeze decision.
- [ ] The project has basic input/error handling or a documented limitation.
  Status: Partially handled in persistence and state-flow tests, but explicit input validation coverage is incomplete.
- [ ] AI-assisted or outside material is reviewed, explainable, and attributed where relevant.
  Status: Not applicable/none detected.

## Sprint 3 - QA and Handoff (Week 14)

- [ ] Main demo path, error/empty state, and key links or buttons have been checked.
- [ ] Keyboard access, visible labels, and readable contrast have received a basic review.
  Status: Contrast/theme issue is outstanding (Demo 2). Accessibility checks need a quick review pass.
- [ ] Setup and handoff instructions work for someone outside the team.
  Status: Recommend Frontend/README.md and a short "how to run the demo" doc for reviewers.
- [ ] The project has safe demo data and no secrets or private data in shared evidence.
- [ ] Demo fallback and remaining blocker plan are documented.

## Sprint 4 - Final Readiness (Week 15)

- [ ] The final demo has been rehearsed with its fallback plan.
- [ ] Presentation and demo roles are assigned.
- [ ] Final evidence, contribution receipts, setup guide, and handoff links are easy to find.
- [ ] Blocker and major-bug status is honest and current.
- [ ] The Final Readiness Report names any remaining action and owner.

---

Updates I made based on a repo review (Weeks 1–6)

- Checked Sprint 0 and most Sprint 1 items because the repo contains the governance docs, design docs, persistence tests, and Week 6 evidence package demonstrating the main path.
- Left several Sprint 2+ items unchecked and added recommendations: add MVP_CONTRACT.md, Frontend/README.md, and a single tested-by re-run after the theme fix.

Recommended immediate actions (high priority)

1. Fix the theme/color inconsistency (owner: Sumit Adhikari) and replace Demo 2.png with updated screenshots in docs/Week6.  
2. Re-run the tested-by steps with a named tester and update docs/Week6/tested-by-notes.md with the tester name, date, and explicit pass/fail outcomes (owner: Prabin Rai / Tester: assigned person).  
3. Add Frontend/README.md (owner: Prince Karki) with one-line run instructions and a short list of known issues and owners.  
4. Create docs/MVP_CONTRACT.md to capture the frozen scope for the MVP and list non-MVP items (owner: Nabin Khadka).  
5. Fill the per-student contribution rows and link PRs/commits in docs/CONTRIBUTION_LEDGER.md and docs/week 7/weekly-report.md (owner: J.N. Taj Oli).  

If you want I can commit the recommended edits: add Frontend/README.md, create docs/MVP_CONTRACT.md draft, and fill docs/week 7/weekly-report.md using the Week 6 evidence. Tell me which files to add or update and whether to commit to main or open a review branch.