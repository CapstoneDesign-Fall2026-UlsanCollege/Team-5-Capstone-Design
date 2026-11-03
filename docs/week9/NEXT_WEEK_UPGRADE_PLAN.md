# Next Week App Upgrade Plan

**Project:** Smart Study Companion — Team 5  
**Prepared:** 2026-11-03  
**Proposed sprint:** Next week (confirm exact dates and owners with the team)

## Goal

Stabilize task and quiz persistence, verify the Supabase-backed account flows, and prepare university support to expand by country. This plan is based on a code review of the local project. Implemented features below are present in source, but live behavior still needs confirmation.

## What is already in the app

| Feature | Current state found in code | Verification status |
|---|---|---|
| Signup/login, email verification, password reset | Auth pages and Supabase/local-preview handlers exist | Live Supabase flow not verified in this review |
| Tasks | Create, edit, complete, delete, search, filters, deadline/progress UI exist | Core data persistence needs verification; catalog mismatch found below |
| Subjects | Ten course options are shown by the frontend catalog | Database currently seeds five subjects; these catalogs do not match |
| Quizzes | Standard and rapid quiz flows, score, and answer review exist for five subjects | Uses local questions; database question loader is not connected |
| Profile | Display name, region, institution, and password forms exist | Supabase profile save needs live verification |
| Dashboard/theme | Task metrics, navigation, and light/dark theme exist | Browser/mobile and accessibility behavior need a fresh manual check |

## Problems to fix first

### P0 — Course and task persistence do not match

The UI offers ten courses while the database seeds five. If a selected course has no database subject ID, task creation falls back to in-memory data. That task can disappear after refresh.

**Acceptance criteria:** Each selectable course maps to a database row. Create a task, refresh, and confirm it remains. If Supabase rejects a task write, show an error and do not display a false success.

### P0 — Quiz answers may not persist

The active quiz flow uses hard-coded questions without database IDs, while the response table requires a question ID. The app sends null IDs for those questions. The score/attempt may save while answer rows fail; the UI does not tell the student. A database question loader is imported but unused.

**Acceptance criteria:** Load questions from one source and retain their IDs. Save each answer against a valid question. Save the attempt and its answers consistently, and show a visible save result. If quiz scores are intended as grades, calculate them on the server; otherwise label them as practice results.

### P1 — Task update failures can be hidden

Completion, edit, and delete interactions can update the screen without reliably handling a failed database response.

**Acceptance criteria:** Show pending/success/error states. On failure, restore the last confirmed task state. Verify create, edit, complete, uncomplete, and delete after a page refresh.

### P1 — Local preview must remain separate from real accounts

When Supabase is unconfigured, the preview flow stores passwords in browser storage and permits demo login with arbitrary credentials. Treat this as prototype-only behavior.

**Acceptance criteria:** Production must not silently use demo authentication. Never store a real password in local storage. Clearly label preview mode and use demo-only accounts/data.

### P1 — University fields need real country values and a missing-institution path

Signup currently offers “South Asia” and “South Korea” as regions, with a short institution list. This will not support students from other countries or institutions.

**Acceptance criteria:** Store a country code per student, let students continue when an institution is missing, and save suggestions as pending review. Store each approved institution’s stable identifier, source, and verification date. Expand coverage in stages instead of promising every university worldwide.

### P1 — Setup documentation omits a migration

The setup guide lists migrations 001–006, but the project includes migration 007 for country/university data.

**Acceptance criteria:** Update setup instructions to include all required migrations in order and verify them on a clean Supabase project.

## Proposed schedule

| Order | Work | Evidence to attach |
|---|---|---|
| 1 | Reconcile the course UI and database catalog; remove memory-only task fallback when cloud mode is active | Catalog comparison; create-and-refresh result for every available course |
| 2 | Connect quiz flow to database question IDs and repair attempt/answer saving | Standard and rapid quiz records; failure case with visible error |
| 3 | Handle task mutation loading and error states | Checklist for create/edit/complete/delete, including a failed request |
| 4 | Verify auth, profile, redirects, and RLS using two test accounts | Dated pass/fail table and screenshots with test accounts only |
| 5 | Update setup docs through migration 007; outline institution catalog and missing-entry workflow | Clean setup record and reviewed schema/workflow proposal |
| 6 | If time remains, add quiz history after saving is reliable; do an accessibility/mobile pass | History empty/populated states; keyboard and mobile screenshots |

## Test and evidence record

For each case, record date, branch/build, environment (local or Supabase), tester, expected result, actual result, pass/fail, and screenshot or log link.

- [ ] Signup, email confirmation, resend, login, logout, password reset
- [ ] Profile update, reload, and persistence
- [ ] Task create/edit/complete/uncomplete/delete and reload
- [ ] Search, filters, deadlines, and progress calculations
- [ ] Standard and rapid quiz attempt and response records
- [ ] Two-account data isolation for profile, tasks, and quiz history
- [ ] Missing university submission and pending-review behavior
- [ ] Mobile layout, keyboard navigation, focus, contrast, and accessible labels

## Scope limits

- Do not claim complete worldwide university coverage this week.
- Do not use real student accounts or private data in evidence screenshots.
- Do not count local preview as proof of Supabase or production behavior.
- Assign team owners and sprint dates before work begins; owners are intentionally left unassigned here.

## Related project records

- [Week 9 test report](TEST_REPORT_2026-11-03.md)
- [Week 9 shared report](weekly-report.md)
- [University catalog migration](../../supabase/migrations/007_universities.sql)
- [Supabase setup guide](../../README.md)
