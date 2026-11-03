# Week 9 Test Report and Evidence Index

**Project:** Smart Study Companion — Team 5  
**Prepared:** 2026-11-03 (Asia/Seoul)  
**Local branch tested:** `supabase-auth`  
**Test runner:** Codex ran the listed automated checks; no human tester is claimed for this run.  
**Runtime:** Node v26.13.0; npm 11.20.0; Python 3.9.6.

## Summary

The current local checkout passed its automated logic checks, static project checks, and production build. A fresh browser smoke test could not be completed because the development server was denied permission to bind to `127.0.0.1:3000` (`listen EPERM`). These results describe the local `supabase-auth` checkout, which had uncommitted changes; they do not certify GitHub `main`, a deployed build, or a live Supabase project.

| Check | Result | What the check covers |
|---|---|---|
| `npm test` | **PASS** — 3 files, 12 tests | Auth validation rules, task metrics/filter examples, and quiz scoring/timer examples in the Vitest suite. |
| `python3 tests/run_tests.py` | **PASS** — 6 check groups | Required files, migration text/seed counts and RLS declarations for migrations 001–006, auth page markup, and sample auth/task/quiz logic. |
| `npm run build` | **PASS** — Vite 6.4.5 | Production bundle completed; generated `dist/` output. |
| Browser smoke test | **NOT RUN** | Vite could not bind to localhost in this environment (`listen EPERM`). No fresh visual or interactive page result is claimed here. |

## Limits of these results

- The Vitest tests define small logic helpers inside the test files; they do not import the application service modules.
- The Python suite checks file contents and expected SQL strings. It does not parse or execute migrations against PostgreSQL or Supabase.
- Migration `007_universities.sql` is present in this checkout but is not covered by the existing Python assertions, which check migrations 001–006.
- No live Supabase credentials were used, so account creation, email verification, RLS behavior, and cloud persistence were not tested.
- No Playwright end-to-end run was performed.
- The checkout had 19 tracked modified files and additional untracked files when checks ran. The tested state is therefore a local working snapshot, not a clean release commit.

## Evidence collection

| Evidence | What it supports | Date and limitation |
|---|---|---|
| [PR #41 — Supabase Auth and PostgreSQL migration](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/41) | Auth/database implementation history and review. | Merged PR; source-history evidence, not a fresh live-service test. |
| [Week 8 login/signup design](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week8/LoginIn_signup_Features.md) | Auth flow, field requirements, and validation proposal authored before implementation. | Design evidence. |
| [Login page](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/public/auth/login.html) and [signup page](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/public/auth/signup.html) | Current local checkout’s auth UI source. | Source files only; this report did not load them in a browser. |
| [Week 9 auth UI design and mockups](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week9/auth-ui-design.md) | Clickable design intent and visual references. | Owned by J.N. Taj Oli (`jn-oli`); not evidence of a live backend or Nabin Khadka’s authorship. |
| [Week 6 tested-by note](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/Week6/tested-by-notes.md) and [Week 6 screenshots](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/main/docs/Week6) | Historical prototype, task, quiz, and persistence review. | Dated 2026-10-08; the note itself says the exact tester for each screenshot should be confirmed. Do not present these as a fresh Week 9 run. |
| `npm test`, `python3 tests/run_tests.py`, `npm run build` | Fresh automated results summarized above. | Run against the local `supabase-auth` snapshot on 2026-11-03. |

## Recommended next manual run

When a local server can start, capture dated screenshots and record a named human tester for these steps:

1. Open `/auth/login.html`; submit empty fields and check the visible validation messages.
2. Follow **Create account** to `/auth/signup.html`; try an invalid email, a short password, and a mismatched confirmation.
3. Check that password-rule indicators respond to typing and that the error messages remain connected to their fields.
4. With a configured Supabase project, test signup, email verification, login, logout, and data isolation with two test users. Record expected and actual results separately.
5. Save the screenshots and tester/date details beside this report; keep local-preview results separate from live Supabase results.

## Related project records

- [Current-window contribution evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/Evidence.md)
- [Shared Week 9 report](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week9/weekly-report.md)
- [Existing test documentation](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/tests/README.md)
