# AI Tutor — QA & Verification Testing Report

**Project:** Smart Study Companion — Team 5 (Ulsan College Capstone Design)  
**Baseline Commit SHA:** `17839811b19d029c5625811df95d358d0a28eed1` (`week12/p0-p1-verification-and-fixes`)  
**Feature Branch:** `feature/ai-tutor`  
**Testing Date:** November 22, 2026  
**Local Runtime Environment:** macOS (Node.js `v26.13.0`, Vitest `v2.1.9`, Vite `v6.4.5`, Python 3, PGlite WASM PostgreSQL)  
**Overall Classification:** **IMPLEMENTED — LIVE INTEGRATION PENDING**

---

## 1. Automated & Regression Test Results Summary

| Suite / Command | Scope / Environment | Actual Result | Notes |
| :--- | :--- | :---: | :--- |
| `npm test` (Vitest) | Pure logic (`ai-tutor-logic.js`, `tutor-core.ts`), **Mocked Supabase** (`ai-tutor.js`), + all 11 existing unit suites | **PASS (12 files, 93 / 93 tests)** | Includes 14 new AI Tutor unit/contract tests (`0` failures) |
| `node --test tests/db/ai-tutor.db.test.js` | **Local PGlite Postgres Emulation** executing `001`–`006` + `013_ai_tutor.sql` + `013_ai_tutor_down.sql` | **PASS (4 / 4 suites)** | Proves two-student RLS isolation, anti-impersonation (`role='assistant'` blocked), quota write protection, cascade delete & rollback locally |
| `node --test tests/db/study-streak.db.test.js` | **Local PGlite Postgres Emulation** regression on Migration `011` | **PASS (36 / 36 tests)** | Confirms AI Tutor introduces zero regression to streaks/goals/badges |
| `python3 tests/test_ai_tutor.py` | Local static/structural contract & `src`/`public/src` sync check | **PASS (3 / 3 groups)** | Verifies `013`, Edge Function security checks, sidebar order below Quiz Practice, DOM hooks |
| `python3 tests/test_ai_quiz.py` | Local regression suite for AI Quiz | **PASS (4 / 4 tests)** | Existing AI Quiz checks pass unchanged |
| `python3 tests/run_tests.py` | Project structure, migrations, auth, tasks, catalog, quiz regression | **PASS (11 / 11 groups)** | Zero regression in core functionality |
| `python3 tests/e2e/e2e_runner.py` | Spec & DOM binding checks + **Live Supabase anon REST health probe** | **PASS (3 / 3 groups)** | Confirms live Supabase Auth + catalog (`46` unis, `32` subjects, `128` curricula, `345` Qs) + core RLS `0` anon rows |
| `npm run build` | Vite production bundle build (`public/` -> `dist/`) | **PASS** | Built cleanly (`33 modules transformed`) with `public/ai-tutor.css` & `ai-tutor` modules |
| Live `POST /functions/v1/ai-tutor-chat` probe | Live Supabase Cloud endpoint probe | **HTTP 404 (Not Deployed)** | Expected until `supabase functions deploy ai-tutor-chat` + `GEMINI_API_KEY` secret are configured |
| `npx playwright test` (`tests/e2e/ai-tutor.spec.js`) | Multi-browser automated Chromium/Firefox/Safari UI suite (`AI-01`..`AI-18`) | **NOT RUN (0 / 18 executed)** | `@playwright/test` is not installed in `package.json` / `node_modules` |

---

## 2. E2E Scenario Matrix (`AI-01` through `AI-18`)

> **Honesty Rule:** Automated unit tests and PGlite Postgres tests verify the logic and SQL RLS policies locally; live browser E2E scenarios (`tests/e2e/ai-tutor.spec.js`) require installing `@playwright/test` + live Supabase deploy (`013` + `ai-tutor-chat` + `GEMINI_API_KEY`) and signing in with real test student accounts.

| ID | Scenario | Automated Unit / DB Coverage | Live Browser E2E Status |
| :--- | :--- | :--- | :---: |
| **AI-01** | Open AI Tutor below Quiz Practice | Covered (`tests/test_ai_tutor.py`, `e2e_runner.py` DOM hook) | **NOT RUN** |
| **AI-02** | Start new chat | Covered (`ai-tutor.test.js` **Mocked Supabase**) | **NOT RUN** |
| **AI-03** | Send question & receive real AI answer | Covered (`tutor-core.ts` & **Mocked** `sendTutorMessage`) | **BLOCKED** *(Edge Function not yet deployed on cloud)* |
| **AI-04** | Ask follow-up keeping bounded context | Covered (`MAX_HISTORY_TURNS = 12` in `index.ts`) | **BLOCKED** *(requires live Edge Function)* |
| **AI-05** | Change subject updates & separates context | Covered (`conversationHasDifferentSubjectMessages` real unit test) | **NOT RUN** |
| **AI-06** | Change difficulty changes prompt depth | Covered (`getDifficultyInstruction` unit test) | **BLOCKED** *(live Gemini response verification pending)* |
| **AI-07** | View saved chat history | Covered (`listTutorConversations` mocked contract + PGlite) | **NOT RUN** |
| **AI-08** | Refresh page preserves conversation | Covered in Postgres (`013_ai_tutor.sql` + PGlite) | **NOT RUN** |
| **AI-09** | Delete conversation cascades messages | **PASS** in PGlite (`tests/db/ai-tutor.db.test.js`) | **NOT RUN** |
| **AI-10** | Quiz integration (`Practice This Topic`) | Covered (`mapTutorDifficultyToQuizDifficulty` & `extractTopicFromConversation`) | **NOT RUN** |
| **AI-11** | Switch light/dark theme | CSS variables aligned with `styles.css` (`--bg`, `--bg-elev`, `--ink`, etc.) | **NOT RUN** |
| **AI-12** | Mobile responsive layout | Breakpoints verified in `public/ai-tutor.css` (`980px`, `600px`) | **NOT RUN** |
| **AI-13** | Empty / overly long prompt rejected | **PASS** (`validateTutorMessageInput` unit test) | **NOT RUN** |
| **AI-14** | API error / missing key / timeout UI handling | **PASS** (`normalizeTutorError` unit test) | **NOT RUN** |
| **AI-15** | Logout clears private AI Tutor state | `resetAiTutorState()` wired on logout / `SIGNED_OUT` | **NOT RUN** |
| **AI-16** | Two-student RLS & anti-impersonation security | **PASS (PGlite Local Postgres)** (`ai-tutor.db.test.js`) | **NOT RUN (Live Cloud)** |
| **AI-17** | Multilingual learning (`en`, `ko`, `ne`, `hi`) | **PASS** (`getLanguageInstruction` unit test) | **BLOCKED** *(requires live Gemini response)* |
| **AI-18** | Study plan tasks saved only on explicit confirmation + deduplication | **PASS** (`buildStudyPlanTaskPayloads` unit test) | **NOT RUN** |

---

## 3. Two-Student Security & Privacy Verification

### Local PostgreSQL / PGlite Proof (`tests/db/ai-tutor.db.test.js` — **4 / 4 PASS**)
1. Student B (`auth.uid() = studentB`) received `0` rows querying `ai_tutor_conversations` and `ai_tutor_messages` using Student A's exact conversation UUID.
2. Student B updating or deleting Student A's conversation affected `0` rows.
3. Student B attempting `INSERT` into `ai_tutor_messages` referencing Student A's `conversation_id` was rejected by RLS.
4. Student A attempting to forge `role = 'assistant'` directly via SQL `INSERT` was rejected by RLS (`ai_tutor_messages_insert_student_own`).
5. Authenticated students attempting `UPDATE` on `ai_tutor_messages` or `INSERT` on `ai_tutor_usage_quotas` received `permission denied`.
6. Anonymous queries (`ROLE anon`) returned `0` rows across AI Tutor tables.

### Live Supabase Cloud Status
- Live cloud two-student browser/API RLS verification is **NOT RUN** because `013_ai_tutor.sql` has not yet been executed in Supabase Cloud SQL Editor and `supabase` CLI / test credentials are absent from this session.

---

## 4. Bugs Found & Resolved During Implementation Verification
1. **Mirror Sync Regression Caught Early:** First `npm test` run flagged `tests/unit/backend-services.test.js` failing because `Backend/supabase/migrations/013_ai_tutor.sql` was missing. Mirrored `013_ai_tutor.sql`, `ai-tutor-chat`, `ai-tutor-logic.js`, and `ai-tutor.js` cleanly into `Backend/`, restoring **12/12 files (93/93 tests PASS)**.
2. **Difficulty Guidance Assertion Wording:** Initial `ai-tutor.test.js` assertion expected `'complexity'` while `tutor-core.ts` used `'time/space or mathematical analysis'`. Updated `tutor-core.ts` explicitly to `'time/space complexity or mathematical analysis'` and synced `Backend/`.

---

## 5. Evidence Screenshots Status
See [`docs/ai_tutor/Evidence/README.md`](Evidence/README.md). Zero screenshots fabricated; all `AI-01`..`AI-13` captures remain **NOT RUN** until live Edge Function deployment, DB migration `013`, and authenticated browser sessions are executed.

---

## 6. Final QA Conclusion
Core engineering, Edge Function logic, XSS-safe Markdown rendering, SQL migration + rollback, PGlite PostgreSQL RLS isolation, unit/service contracts, and Vite production bundling are **complete and verified locally (`93/93` Vitest, `40/40` PGlite SQL tests, `11/11` Python system checks, `4/4` AI Quiz, `3/3` AI Tutor checks, `3/3` E2E contract groups, `vite build` pass)**. Live Supabase Cloud verification and Chromium Playwright execution remain **PENDING external deployment & credentials**.
