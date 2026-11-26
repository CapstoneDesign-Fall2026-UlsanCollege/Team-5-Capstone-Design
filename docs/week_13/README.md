# Week 13 — Feature Improvements & Manual Time Schedule Hub

**Project:** Smart Study Companion — Team 5 (Ulsan College)  
**Repository:** https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design  
**Working Branch:** `feature/manual-time-schedule-and-improvements` (branched from `main` @ `e817132`)  
**Updated:** November 26, 2026

---

## Release & Branch Status Boundary

- **Frozen Core Release Status (`main`):** Preserved at **`NO-GO — Pending Live Security and Release Verification`** from Week 12 (live `DATA-01` RLS, live migrations `009`/`010`/`012`/`013`, Edge Functions, course Vercel SHA, credentialed live Playwright rerun, and `5/5` sign-offs remain open).
- **Week 13 Feature Branch (`feature/manual-time-schedule-and-improvements`):** Implements four post-freeze usability and planning upgrades alongside local unit, PostgreSQL WASM (`PGlite`), Python, and mocked Playwright verification. Live Supabase Cloud deployment of `014` and `015` remains **`NOT RUN` / pending database release review**.

---

## Quick Verification Commands (Local Non-Cloud)

| Check Scope | Command | Recorded Result |
|---|---|---|
| **1. Production Bundle & Mirrors** | `npm run build && diff -rq src public/src && diff -rq src/lib Backend/lib && diff -rq src/services Backend/services` | **PASS** (`172ms`, `0` mirror diffs) |
| **2. Unit & Pure Schedule Engine** | `npx vitest run` | **105 / 105 PASS** across `13` test files |
| **3. Local PostgreSQL RLS & Rollbacks** | `node --test tests/db/ai-tutor.db.test.js tests/db/time-schedule.db.test.js` | **7 / 7 PASS** (PGlite WASM; not live cloud apply) |
| **4. Python Integrity Suites** | `python3 tests/run_tests.py && python3 tests/test_ai_quiz.py` | **11 / 11** + **4 / 4 PASS** |
| **5. Mocked Browser E2E (Desktop & Mobile)** | `./node_modules/.bin/playwright test tests/e2e/ui-regression-mocked.spec.js tests/e2e/improvements-schedule.spec.js --project="Desktop Chrome"` & `improvements-schedule.spec.js --project="Mobile Chrome (Pixel 5)"` | **10 / 10 PASS** (`Desktop Chrome`), **4 / 4 PASS** (`Mobile Chrome`) |
| **6. Live Cloud Migration & 2-Account E2E** | Apply `014`–`015` live + run credentialed Playwright `DATA-01` / `E2E` | **NOT RUN** (pending live Supabase deployment) |

---

## Week 13 Documents & Evidence

1. **[Week 13 Shared Weekly Report](./weekly-report.md)** — Goals, completed features (`014` & `015`), honest test/security tables, member contributions, risks, and bridge tasks.
2. **[Improvements & Manual Time Schedule Report](../time_schedule/IMPROVEMENTS_AND_TIME_SCHEDULE_REPORT.md)** — Full implementation specification coverage, schema details, and before/after gallery index.
3. **[Visual Evidence (`docs/time_schedule/Evidence/`)](../time_schedule/Evidence/)** — `3` baseline before captures and `9` verified after captures covering Light/Dark modes and Desktop/Mobile viewports.
4. **[Updated Contribution Ledger](../CONTRIBUTION_LEDGER.md)** — Week 13 entries reconciled alongside Week 12–Week 6 history.
