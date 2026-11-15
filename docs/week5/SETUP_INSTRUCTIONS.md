# Week 5 Setup Instructions

## Current application setup - 2026-11-14

This addendum describes the current repository; original Week 5 prototype instructions remain below as history. Clean setup has **Not run** in this documentation task.

1. Use an isolated checkout and approved disposable Supabase project. Record the exact source SHA. `package.json` declares Node >=18; use a maintained version compatible with the dependencies and record actual versions.
2. Run `npm install`, then `npm run dev`. Vite serves `public/`, uses port 3000 by default and opens `/auth/login.html`. Use the URL printed by the server; do not assume an occupied port is yours.
3. Inspect `.env.example` and the client configuration before entering test-project values privately. Names include `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; client aliases include `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. No values belong in documentation or screenshots. Never use service-role credentials in the browser.
4. The client has default public configuration fallback; an absent environment file is not proof of local-only mode. Confirm the actual target and mode before writing any records.
5. For a new disposable database, review and apply `supabase/migrations/` in numeric order: `001_profiles.sql`, `002_subjects.sql`, `003_tasks.sql`, `004_quiz_questions.sql`, `005_quiz_attempts.sql`, `006_rls_policies.sql`, `007_universities.sql`, `008_major_subjects_quiz_bank.sql`, `009_ai_quiz_tables.sql`, `010_complete_universities.sql`. Record each outcome. Do not apply a consolidated setup script and the same migrations blindly, or alter a shared project without approval.
6. Confirm Auth redirect/recovery settings for the chosen test URL with the project owner. Database migrations alone do not configure email delivery or deploy AI edge functions.
7. Follow the [safe task smoke check](../week_11/INDEPENDENT_VERIFICATION.md); stop if the target is not the disposable project. Record actual results and cleanup only your test data.

`npm test` is the unit-test command; it does not prove live RLS. `npm run build` builds the static application, not service correctness. The E2E script is not treated as a ready test harness without confirming its dependencies and tests.

Complete the [clean-setup receipt](../week_11/INDEPENDENT_VERIFICATION.md#clean-setup-receipt) with actual output, deviations and metadata. This guidance is based on source inspection, not a completed install or migration run.

## Historical Week 5 prototype instructions

Use these steps to run the current prototype locally.

## Open The Prototype

1. Clone or download the repository.
2. Open `Frontend/index.html` in a browser.
3. Use the subject, task, study plan, and quiz screens.
4. Refresh the page to check local browser storage behavior.

No package install or build step is required for the current plain HTML/CSS/JavaScript prototype.

## Reset Demo Data

Clear browser site data for the local file/page or use a fresh browser profile.

## Evidence Links

- [Week 6 tested-by note](../Week6/tested-by-notes.md)
- [Week 6 weekly report](../Week6/WEEKLY_REPORT.md)
- [Midterm demo path](../Week6/MIDTERM_DEMO_PATH.md)
