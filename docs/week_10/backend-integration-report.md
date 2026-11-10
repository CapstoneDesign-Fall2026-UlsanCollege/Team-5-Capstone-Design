# Backend Integration Report — Week 10

**Project:** Smart Study Companion — Team 5  
**Scope:** Full-stack backend integration review & fixes pushed on `main` (`ec6bd38`), consolidating and extending [`SUPABASE_VERIFICATION_REPORT.md`](SUPABASE_VERIFICATION_REPORT.md) and [`docs/COMPLETE_BACKEND_INTEGRATION_REPORT.md`](../COMPLETE_BACKEND_INTEGRATION_REPORT.md).

---

## 1. Current Backend Implementation Status

Backend service integration in the codebase is updated and verified at the unit/contract level (`27/27` Vitest tests, `11/11` Python checks, Vite build of all 6 HTML pages), with core catalog tables live on Supabase Cloud (`bcwwnjtmrcxggbaallon.supabase.co`). However, **live authenticated end-to-end UI persistence**, **Migration `009`/`010` execution on cloud**, **Edge Function deployment**, and **live Gmail recovery OTP delivery** remain pending Supabase Dashboard actions and live browser testing.

---

## 2. Existing Backend Connections (Live Confirmed Read-Only)

- **Supabase Auth settings (`GET /auth/v1/settings`):** HTTP `200`, Email provider active (`external.email: true`, `disable_signup: false`, `mailer_autoconfirm: true`).
- **Public Read-Only Catalog Tables (`GET /rest/v1/*` with publishable key):**
  - `universities`: HTTP `206`, `46` rows across 7 countries
  - `subjects`: HTTP `206`, `32` rows
  - `major_subjects`: HTTP `206`, `128` rows
  - `quiz_questions`: HTTP `206`, `345` rows
- **Private RLS Tables (`GET /rest/v1/*` anonymous):** `profiles`, `student_subjects`, `tasks`, `quiz_attempts`, `quiz_responses` return HTTP `200` with `[]`.

---

## 3. Missing Backend Connections

- **Live Migration `009` (`ai_quizzes`, `ai_quiz_questions`, `ai_quiz_attempts`):** All three endpoints return HTTP `404` (`PGRST205: Could not find the table 'public.ai_quizzes' in the schema cache`).
- **Live Migration `010` (`010_complete_universities.sql`):** Countries `Bhutan`, `Maldives`, and `Other / International` exist in frontend `academic-catalog.js` and SQL migration `010`, but are not seeded in live `public.universities` yet (`46` live rows vs `10` countries in JS).
- **Live Edge Function (`generate-ai-quiz`):** `POST /functions/v1/generate-ai-quiz` returns HTTP `404` (`{"code":"NOT_FOUND","message":"Requested function was not found"}`).
- **Future AI Study Assistant (`ai-study-assistant`):** Planned only; no tables or functions deployed yet ([`ai-integration-plan.md`](ai-integration-plan.md)).

---

## 4. Broken API Calls (Found During Audit & Fixed in Code)

1. **`subjects` catalog upsert from student sessions (`subjects.js`):** Previously called `.from('subjects').upsert(...)` on a `SELECT`-only table guarded by RLS. **Fixed:** resolved `subjects` UUIDs read-only by `slug` and synchronized only `student_subjects`.
2. **`getStudentSubjects` overwriting empty cloud state (`subjects.js`):** Returned stale `localStorage` data whenever DB returned `[]`. **Fixed:** returns cloud `[]` directly.
3. **`getUniversitiesCatalog` shape mismatch in `app.js`:** `loadUserData()` originally checked `.length` on an object returned by `getUniversitiesCatalog()`, ignoring DB universities. **Fixed:** `dbUniversitiesByCountry` parses object maps cleanly.
4. **Quiz parameter & schema mismatches (`quiz.js` + `app.js`):** `finishQuiz()` passed `-1` for unanswered responses, skipped `mode`, and passed string fallback IDs; `saveQuizAttempt()` dropped `quiz_responses` insert errors. **Fixed:** passes `mode: quiz.mode`, converts unanswered choices to `null`, filters `quiz_responses` to UUID `question_id`s, resolves `subjectSlug -> UUID`, and propagates DB errors.
5. **Silent failure in task/onboarding handlers (`app.js` + `tasks.js`):** Onboarding navigation proceeded without checking `saveStudentSubjects`/`upsertProfile` errors, and task toggle/delete mutated local state without checking DB `{ error }`. **Fixed:** all check `{ error }` first, and `updateTask` now validates `title`, `deadline`, and cloud `subject_id` UUIDs.
6. **Auth guard recovery path bug (`auth-guard.js`):** Lacked subpath base-path calculation and didn't exempt `reset-password.html` from authenticated dashboard redirects. **Fixed.**

---

## 5. Supabase Integration Findings

- Prior static issues documented by Sumit Adhikari in [`SUPABASE_VERIFICATION_REPORT.md`](SUPABASE_VERIFICATION_REPORT.md) (Sections C & D: `tasks` camelCase/snake_case mismatch was partially normalized in `tasks.js` earlier, while `subject_id` validation on `updateTask`, `subjects` RLS upsert violation, missing `mode` / `-1` response index in `finishQuiz()`, and ignored errors on task/profile/quiz saves were resolved in commit `ec6bd38`).
- Client-visible `correct_answer` column on `quiz_questions` remains an open security design trade-off.

---

## 6. `localStorage` and Mock-Data Dependencies

- `src/services/auth.js`: Offline local demo user/session fallback (`study_companion_local_user`, `study_companion_local_session`) remains active only when `!isConfigured`.
- `src/lib/academic-catalog.js`: Supplies offline fallback arrays (`COUNTRIES`, `UNIVERSITIES_BY_COUNTRY`, `SUBJECTS_CATALOG`, `QUIZ_BANK`) cleanly supplementing DB gaps (`Bhutan`, `Maldives`, `Other / International`).
- `src/services/ai-quiz.js`: Falls back to `localStorage` (`ssc_ai_quizzes`, `ssc_ai_quiz_attempts_<id>`) when `ai_quizzes` returns `404 PGRST205`, returning `dbPersisted: false` + `persistenceError` so callers know persistence was local-only.
- `public/app.js`: Initial `selectedEnrolledSlugs` defaults to `['programming', 'data-structures', 'databases']` only until cloud onboarding completes.

---

## 7. Task Persistence Status

- Code-level service validation & UI error checking: **Implemented & Vitest contract-tested**.
- Live browser Supabase persistence after refresh & two-student isolation: **NOT TESTED** interactively in this Week 10 audit cycle (pending disposable test accounts / E2E run).

---

## 8. Quiz Persistence Status

- Curated Standard (`15q` max; `10q` available for 27 expanded subjects) and Rapid (`10q / 30s`) modes aligned to `quiz_attempts` / `quiz_responses` schema and wired to `#quiz-history-list` + `#analytics-quiz-summary`.
- Live database persistence verified only at contract/schema level; live authenticated UI round-trip is **NOT TESTED**; AI quiz cloud persistence is **BLOCKED** by missing Migration `009` (`404 PGRST205`).

---

## 9. Authentication Integration Status

- Signup explicit-login redirect, session guards, OTP sanitization, and reset-password handling are implemented cleanly.
- Live `"mailer_autoconfirm": true` means email confirmation is currently skipped on Supabase Cloud.
- Password recovery OTP Gmail delivery is **BLOCKED / UNCONFIRMED** (see [`password-reset-investigation.md`](password-reset-investigation.md)).

---

## 10. Fixes Implemented (`ec6bd38`)

All code fixes documented above were implemented across `app.js`, `public/app.js`, `public/index.html`, `src/auth-guard.js`, `src/services/{subjects,tasks,quiz,ai-quiz}.js` (+ `public/src/` mirrors), `vite.config.js`, and `supabase/migrations/010_complete_universities.sql`, and verified with `27/27` Vitest tests, `11/11` Python checks, `test_ai_quiz.py`, `node --check`, and Vite production build (`dist/`).

---

## 11. Remaining Backend Work

1. Apply `009_ai_quiz_tables.sql` and `010_complete_universities.sql` in live Supabase SQL Editor.
2. Deploy `generate-ai-quiz` Edge Function via Supabase CLI.
3. Configure Custom SMTP, enable `Confirm email`, update Email Templates (`{{ .Token }}`), fix typoed `@gmmail.com` account, and re-test Gmail OTP end-to-end.
4. Execute interactive two-student RLS CRUD & quiz round-trip verification (`tests/e2e/`).

---

## 12. Relevant GitHub Issue & PR References

- [Issue #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48): Feature Update: Study Task Analytics, University Hierarchy & Scrollable Subject Onboarding
- [Issue #40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40), [#39](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/39), [#38](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/38): Backend, UI & Database Design: Login & Signup Feature
- [Issue #37](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/37), [#34](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/34), [#23](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23): QA Functional, Manual MVP & End-to-End Student Path Validation
- [Issue #22](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/22), [#19](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/19): Subject-Based Task & Quiz Selection / Create Quiz and Calculate Score
- [Issue #30](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/30), [#35](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/35): Contribution ledger & documentation link audit

---

## Integration Comparison Matrix

| Feature | Expected Behavior | Actual Behavior | Status | Evidence | Next Action |
|---|---|---|---|---|---|
| Academic Catalog Read (`universities`, `subjects`, `major_subjects`, `quiz_questions`) | Public read access returns complete catalog rows | Returns HTTP `206` with `46` universities, `32` subjects, `128` mappings, `345` questions (`Bhutan`/`Maldives`/`Other` pending `010`) | **PASS (Partial Seed)** | Live PostgREST probe (2026-11-10); [`010_complete_universities.sql`](../../supabase/migrations/010_complete_universities.sql) | Run Migration `010` in Supabase SQL Editor |
| Student Subject Enrollment (`student_subjects`) | Student enrollments save & reload per `student_id` without writing `subjects` | Code fixed in `subjects.js` (`saveStudentSubjects` / `getStudentSubjects`) & tested with Vitest mock; live browser test not run | **PASS (Unit Mock) / NOT TESTED (Live)** | [`backend-services.test.js`](../../tests/unit/backend-services.test.js); `npm test` `27/27` | Execute live onboarding save & page refresh test |
| Study Tasks CRUD (`tasks`) | Valid tasks persist, toggle, edit, and delete per `auth.uid()` | `tasks.js` & `app.js` validation and error checks fixed & tested via Vitest mock; live DB CRUD not executed | **PASS (Unit Mock) / NOT TESTED (Live)** | [`backend-services.test.js`](../../tests/unit/backend-services.test.js); [`SUPABASE_VERIFICATION_REPORT.md`](SUPABASE_VERIFICATION_REPORT.md) | Execute live two-student CRUD & RLS test |
| Curated Quiz Attempt & History (`quiz_attempts`, `quiz_responses`) | Standard/Rapid attempts save with UUIDs & `NULL` blanks and appear in Quiz History & Analytics | Code fixed in `quiz.js`, `app.js`, `public/index.html`; tested via Vitest mock; live authenticated insert not run | **PASS (Unit Mock) / NOT TESTED (Live)** | [`backend-services.test.js`](../../tests/unit/backend-services.test.js); commit `ec6bd38` | Complete live quiz submission & refresh check |
| AI Quiz Generator (`ai_quizzes`, Edge Function) | Edge function + DB persistence save AI quizzes & attempts | Edge Function `404 NOT_FOUND`; `ai_quizzes` `404 PGRST205`; client degrades cleanly to `localStorage` with `dbPersisted: false` | **BLOCKED (Cloud) / PASS (Fallback Mock)** | Live curl (`404`); [`backend-services.test.js`](../../tests/unit/backend-services.test.js) | Run Migration `009` & deploy `generate-ai-quiz` |
| Signup Confirmation Email | Signup dispatches confirmation email when enabled | Live `/auth/v1/settings` has `mailer_autoconfirm: true`; signup auto-confirms and `signUp()` immediately signs out to force explicit login | **BLOCKED (Dashboard Config)** | Live `GET /auth/v1/settings` | Enable `Confirm email` & Custom SMTP in Supabase |
| Password Recovery 6-Digit OTP Email | Gmail receives 6-digit OTP + link (`{{ .Token }}`) | No email arrived in Nov 10 test (`princekarki127@gmail.com` submitted vs `princekarki127@gmmail.com` in Users; shared SMTP limits; Audit Logs off) | **BLOCKED / FAIL (Live Delivery)** | User Dashboard screenshots; [`password-reset-investigation.md`](password-reset-investigation.md) | Fix email typo, configure SMTP & template, re-test |
| Route & Session Auth Guard (`auth-guard.js`) | Unauthenticated users redirected to `login.html`; recovery session allowed on `reset-password.html` | Subpath helpers & `reset-password` exemption added in `src/auth-guard.js`; JS syntax verified | **PASS (Static/Syntax) / NOT TESTED (Live)** | `node --check`; [`src/auth-guard.js`](../../src/auth-guard.js) | Test PKCE/hash recovery link in browser |
| Two-Student Private RLS Isolation | Student B cannot read/update/delete Student A records | Anonymous probe returns `200 []` on private tables; policies exist in `006_rls_policies.sql`; interactive two-user test unexecuted | **NOT TESTED (Authenticated)** | Live anon PostgREST probe; [`database-verification.md`](database-verification.md) | Run live 2-student isolation test |
| ChatGPT-Style Gemini AI Tutor | Subject-aware Gemini assistant backed by Edge Function & private history | Design & quota plan only — unimplemented by design pending approval | **NOT IMPLEMENTED (Planned)** | [`ai-integration-plan.md`](ai-integration-plan.md); [`AI_STUDY_ASSISTANT_ARCHITECTURE.md`](../AI_STUDY_ASSISTANT_ARCHITECTURE.md) | Review capstone plan before any paid setup |
