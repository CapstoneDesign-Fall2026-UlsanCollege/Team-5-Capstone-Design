# Weekly Report

**Team:** 5  
**Week:** 9  
**Date:** 2026-11-03

## This week's goal

For J.N. Taj Oli, this week focused on reviewing the project documentation and evidence related to the Week 8 auth design, Week 9 login/signup UI work, database review, and upgrade planning. The work was limited to checking whether the repository documents and links were consistent with the actual implementation and to recording only evidence-backed findings.

## What we committed to do

- Review the README, Week 8 auth design, Week 9 UI design, database review, test report, and upgrade plan.
- Verify whether each GitHub link leads to the correct PR, document, commit, or evidence record.
- Review the login/signup mockup validation states and confirm the required field-level error scenarios.
- Document the difference between automated checks, local browser checks, and live Supabase checks.
- Reconcile older no-auth/localStorage documentation with the current Supabase Auth and PostgreSQL implementation.
- Complete the shared report with J.N. Taj Oli’s contribution and evidence.

## Evidence links

If it is not linked, it does not count.

| Evidence | Link |
|---|---|
| Issue(s) |  |
| PR(s) / commits | [PR #41 — Supabase Auth + PostgreSQL migration](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/41) |
| Screenshot / demo | [Signup page](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/public/auth/signup.html), [login page](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/public/auth/login.html) |
| Test/check note | [Week 9 test report](TEST_REPORT_2026-11-03.md); [Current-window evidence](../../Evidence.md) |
| Document update | [Week 8 auth design](../week8/LoginIn_signup_Features.md); [Week 9 UI design](auth-ui-design.md); [Database review](database-model-check-report.md); [Upgrade plan](NEXT_WEEK_UPGRADE_PLAN.md) |
| Current codebase area map / ownership audit (link; update if changed) |  |

## Individual contribution entries — one row per student

Keep this section inside the single shared team report. Each student must enter their own row: one sentence describing the contribution and at least one evidence link. Add rows if your team has more students.

| Student | GitHub login | What they did | Evidence link |
|---|---|---|---|
| Nabin Khadka | `liftupkhadka555-spec` | Authored and merged the Supabase Auth/PostgreSQL migration and live login/signup pages; wrote the Week 8 login/signup design; made two small text edits to the Week 9 documentation package. | [PR #41 — Supabase Auth + PostgreSQL migration](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/41); [Week 8 login/signup design](../week8/LoginIn_signup_Features.md) |
| Sumit Adhkari |  |  |  |
| Prabin Rai |  |  |  |
| Prince Karki |  |  |  |
| J.N. Taj Oli | `jn-oli` | Reviewed the Week 8 auth design, Week 9 UI design and mockups, test report, database review, and next-week upgrade plan; checked that the evidence and documentation matched the current Supabase Auth/PostgreSQL architecture and documented only the validation states supported by the repository files. | [Week 8 auth design](../week8/LoginIn_signup_Features.md); [Week 9 UI design](auth-ui-design.md); [Week 9 test report](TEST_REPORT_2026-11-03.md); [Database review](database-model-check-report.md); [Upgrade plan](NEXT_WEEK_UPGRADE_PLAN.md) |

The Week 9 [auth-ui-design.md](auth-ui-design.md) mockup package is owned by J.N. Taj Oli (`jn-oli`); the two text-edit commits above do not claim authorship of the package.

## Blockers or risks

| Blocker/risk | Owner | Next action |
|---|---|---|
| Live Supabase and browser smoke validation were not completed in this review, so the repo report distinguishes between automated checks and unverified live behavior. | J.N. Taj Oli / testing team | Run a fresh browser and Supabase validation run in a working local environment before claiming live auth behavior. |

## Decision record

Record only decisions that change scope, approach, ownership, or the next plan.

| Decision | Why we chose it | Owner | Evidence / Issue link |
|---|---|---|---|
| Supabase Auth as current authentication architecture | Older documents describe a no-login MVP, while current implementation includes Supabase Auth | Team | [PR #41 — Supabase Auth + PostgreSQL migration](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/41) |
| Live Supabase testing is required for final auth validation | Local automated tests do not verify cloud authentication or RLS | Testing team | [Week 9 test report](TEST_REPORT_2026-11-03.md) |
| Documentation must distinguish mockups from working implementation | The Week 9 UI design is a frontend mockup and does not create real accounts | Documentation team | [Week 9 UI design](auth-ui-design.md) |

## Next week's bridge task

- Confirm pending browser and Supabase validation steps for login/signup and profile flows.
- Complete the remaining evidence checklist for task persistence, quiz recording, and university setup.
