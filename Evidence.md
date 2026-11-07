# Current-window evidence — `liftupkhadka555-spec`

**Student:** Nabin Khadka  
**GitHub login:** `liftupkhadka555-spec`  
**Identity:** The report row **Nabin Khadka is mine.** It is the same person as `@liftupkhadka555-spec` (signed on the [project agreement](docs/week1/project_agreement.md)). GitHub also shows this account as `Nabin55` / `Khadka Nabin` on commits.

This file is my own report row. It lists work I authored and personally verified in the current window. It does not confirm other members’ work.

## Report row

| Student | GitHub login | What I authored and verified | Evidence |
|---|---|---|---|
| Nabin Khadka | `liftupkhadka555-spec` | Supabase Auth + PostgreSQL migration (schema, RLS, client services, auth pages). Live login/signup UI and Week 8 login/signup design. Personally ran local signup/login preview at `/auth/signup.html` and `/auth/login.html`. | [PR #41](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/41), [Week 8 login/signup design](docs/week8/LoginIn_signup_Features.md), [signup.html](public/auth/signup.html), [login.html](public/auth/login.html), [auth-init.js](public/auth/auth-init.js) |

## Parts I authored

| Part | Why it counts as mine | Link |
|---|---|---|
| Supabase full-stack migration | I authored the `supabase-auth` work and merged it as PR #41 (`feat: migrate to Supabase full-stack architecture with Auth and PostgreSQL`). | [PR #41](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/41) |
| Auth UI (live pages) | Login, signup, and auth form lifecycle shipped in that migration: `public/auth/`. | [signup.html](public/auth/signup.html), [login.html](public/auth/login.html), [auth-init.js](public/auth/auth-init.js) |
| Auth UI design (Week 8) | I wrote the login/signup feature design used before implementation. | [LoginIn_signup_Features.md](docs/week8/LoginIn_signup_Features.md), [database_login & signup.md](docs/week8/database_login%20%26%20signup.md) |

## Parts I personally verified

| Check | Result | How to repeat |
|---|---|---|
| Signup page is in this repo and served at `http://localhost:3000/auth/signup.html` | Pass | File: `public/auth/signup.html`. Vite `root` is `public`. |
| Login page loads and accepts a local-preview sign-in | Pass | `http://localhost:3000/auth/login.html` with any valid email and 8+ character password when Supabase env is unset (local preview mode). |
| Dashboard opens after sign-in | Pass | Redirect to `index.html` Subjects & Tasks. |

## What this row is not

- Week 9 [`docs/week9/auth-ui-design.md`](docs/week9/auth-ui-design.md) is owned by J.N. Taj Oli (`jn-oli`). I do not claim that mockup package as my authorship.
- Earlier “Nabin Khadka” rows that only say coordination / Week 6 tested-by notes are still mine, but they are older evidence. **Current-window evidence is PR #41 and the auth UI design/pages above.**
