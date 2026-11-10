# Backend Final Report — Week 10 Assessment

**Project:** Smart Study Companion — Team 5  
**Course:** Capstone Design, Fall 2026 (Ulsan College)  
**Repository:** `https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design`  
**Audit & Integration Date:** 2026-11-10  
**Contributor (Backend & Full-Stack Verification Update):** Nabin Khadka (`@liftupkhadka555-spec`)

---

## 1. Executive Summary

This final Week 10 backend audit evaluated every frontend-to-Supabase connection in Smart Study Companion, corrected critical code-level persistence and routing bugs across authentication, academic subject selection, task management, and quiz submission (`commit ec6bd38` on `main`), executed automated verification suites (`27/27` Vitest tests, `11/11` Python integration checks, `vite build`), probed the live Supabase Cloud project (`bcwwnjtmrcxggbaallon.supabase.co`), diagnosed the November 10 Gmail password recovery failure, and documented a cost-safe Google Gemini AI Study Assistant roadmap.

At the close of this review, **application service logic and unit contracts pass**, core PostgreSQL catalog tables (`46` universities, `32` subjects, `128` curricula, `345` quiz questions) are live, and **four operational Dashboard/manual items remain blocking full live end-to-end certification**: applying Migrations `009` and `010`, deploying `generate-ai-quiz`, fixing Custom SMTP / email template / typoed `@gmmail.com` account settings, and executing an authenticated two-student browser/E2E pass.

---

## 2. Work Completed

- Inspected full codebase (`public/`, `src/`, `public/auth/`, `supabase/migrations/001`–`009`, `supabase/functions/`, `tests/`).
- Fixed service-layer and frontend-controller bugs in commit `ec6bd38` (`subjects.js`, `tasks.js`, `quiz.js`, `ai-quiz.js`, `auth-guard.js`, `public/app.js`, `app.js`, `public/index.html`, `vite.config.js`).
- Authored Migration `010_complete_universities.sql` (and updated `supabase/setup_all.sql`).
- Created unit/service-contract suite `tests/unit/backend-services.test.js` (`9` new tests alongside existing `18` tests).
- Executed live non-mutating Supabase REST & Auth probes (`2026-11-10`).
- Produced complete Week 10 technical audit documentation set in [`docs/week_10/`](.).

---

## 3. Files Inspected

- Config & Build: [`package.json`](../../package.json), [`vite.config.js`](../../vite.config.js), [`vitest.config.js`](../../vitest.config.js), [`vercel.json`](../../vercel.json), [`.env.example`](../../.env.example), [`README.md`](../../README.md)
- Frontend App & Auth: [`index.html`](../../index.html), [`public/index.html`](../../public/index.html), [`public/app.js`](../../public/app.js), [`app.js`](../../app.js), [`public/auth/*.html`](../../public/auth/), [`public/auth/auth-init.js`](../../public/auth/auth-init.js)
- Libraries & Services: [`src/lib/supabase.js`](../../src/lib/supabase.js), [`src/lib/academic-catalog.js`](../../src/lib/academic-catalog.js), [`src/auth-guard.js`](../../src/auth-guard.js), [`src/services/{auth,profile,subjects,tasks,quiz,ai-quiz}.js`](../../src/services/)
- SQL & Edge Functions: [`supabase/migrations/001`–`009`](../../supabase/migrations/), [`supabase/setup_all.sql`](../../supabase/setup_all.sql), [`supabase/functions/generate-ai-quiz/index.ts`](../../supabase/functions/generate-ai-quiz/index.ts)
- Tests & Docs: [`tests/run_tests.py`](../../tests/run_tests.py), [`tests/test_ai_quiz.py`](../../tests/test_ai_quiz.py), [`tests/unit/*.test.js`](../../tests/unit/), [`docs/week_10/`](.)

---

## 4. Files Modified (Codebase `ec6bd38` & Week 10 Docs)

- **Backend Code & Tests (`ec6bd38`):** [`app.js`](../../app.js), [`public/app.js`](../../public/app.js), [`public/index.html`](../../public/index.html), [`src/auth-guard.js`](../../src/auth-guard.js), [`src/services/{subjects,tasks,quiz,ai-quiz}.js`](../../src/services/) (and `public/src/` mirrors), [`vite.config.js`](../../vite.config.js), [`supabase/migrations/010_complete_universities.sql`](../../supabase/migrations/010_complete_universities.sql), [`supabase/setup_all.sql`](../../supabase/setup_all.sql), [`tests/unit/backend-services.test.js`](../../tests/unit/backend-services.test.js)
- **Week 10 Documentation (`docs/week10-backend-audit`):** [`backend-architecture.md`](backend-architecture.md), [`backend-integration-report.md`](backend-integration-report.md), [`authentication-testing.md`](authentication-testing.md), [`password-reset-investigation.md`](password-reset-investigation.md), [`database-verification.md`](database-verification.md), [`subject-selection-testing.md`](subject-selection-testing.md), [`task-quiz-testing.md`](task-quiz-testing.md), [`ai-integration-plan.md`](ai-integration-plan.md), [`backend-test-results.md`](backend-test-results.md), [`backend-final-report.md`](backend-final-report.md), [`Evidence/README.md`](Evidence/README.md), [`weekly-report.md`](weekly-report.md), [`docs/CONTRIBUTION_LEDGER.md`](../CONTRIBUTION_LEDGER.md)

---

## 5. Backend Architecture Summary

- Static ES Module client backed by Supabase Auth + Supabase PostgREST PostgreSQL (`@supabase/supabase-js@2.45.0`), Vite 6 multi-page bundling across all 6 HTML pages, public read-only academic catalog tables, and RLS-isolated student records ([`backend-architecture.md`](backend-architecture.md)).

---

## 6. Authentication Findings

- Signup auto-session clearing, explicit login enforcement, password rules (`>=8` chars, letter, number), and session guard subpath routing (`src/auth-guard.js` exempting `reset-password.html`) are verified in code and automated tests.
- Live Supabase Cloud has `"mailer_autoconfirm": true` (`GET /auth/v1/settings`), meaning email confirmation is bypassed until enabled alongside Custom SMTP ([`authentication-testing.md`](authentication-testing.md)).

---

## 7. Password-Reset Investigation Summary

- **Confirmed findings (2026-11-10):**
  1. Dashboard Users screenshot shows `prince Karki` registered as **`princekarki127@gmmail.com`** (`@gmmail.com`), whereas `forgot-password.html` submitted **`princekarki127@gmail.com`**. Supabase returned HTTP `200` to avoid user enumeration while sending nothing to `@gmail.com`.
  2. Built-in shared SMTP limits, disabled `Audit Logs`, and `"mailer_autoconfirm": true` prevent reliable external Gmail delivery and obscure logs; recovery email templates require `{{ .Token }}` + `{{ .ConfirmationURL }}` + Custom SMTP.
  3. `src/auth-guard.js` subpath & `reset-password` exemption bug was fixed (`ec6bd38`). Live Gmail retest remains **BLOCKED** ([`password-reset-investigation.md`](password-reset-investigation.md)).

---

## 8. Database Findings

- `universities` (`46`), `subjects` (`32`), `major_subjects` (`128`), and `quiz_questions` (`345`) are live (`HTTP 206`), and private tables (`profiles`, `student_subjects`, `tasks`, `quiz_attempts`, `quiz_responses`) return `HTTP 200 []` anonymously.
- Migration `009` tables (`ai_quizzes`, `ai_quiz_questions`, `ai_quiz_attempts`) return `404 PGRST205` on live Supabase Cloud; Migration `010` (`Bhutan`, `Maldives`, `Other / International`) is also awaiting SQL Editor execution ([`database-verification.md`](database-verification.md)).

---

## 9. Subject Selection Findings

- Fixed client-side `subjects` upsert RLS failure (`subjects.js`), DB `universities` map merge (`app.js`), stale `localStorage` override, and error checks on onboarding save (`saveAcademicProfileAndSubjects`). Verified via Vitest service contracts; live login-save-restore UI test remains **NOT TESTED** ([`subject-selection-testing.md`](subject-selection-testing.md)).

---

## 10. Task and Quiz Test Results

- Task CRUD validation & optimistic error guards (`tasks.js`, `app.js`), curated quiz submission (`mode`, `NULL` unanswered responses, UUID filtering, `#quiz-history-list`, `#analytics-quiz-summary`), and AI quiz local degradation diagnostics (`dbPersisted`) pass unit/contract tests (`27/27` Vitest, `11/11` Python).
- Live browser Task/Quiz CRUD persistence after reload and two-student RLS isolation remain **NOT TESTED** ([`task-quiz-testing.md`](task-quiz-testing.md), [`backend-test-results.md`](backend-test-results.md)).

---

## 11. AI Integration Readiness

- ChatGPT-style Google Gemini Study Assistant is **design-ready only (`NOT IMPLEMENTED`)** in [`ai-integration-plan.md`](ai-integration-plan.md) and [`AI_STUDY_ASSISTANT_ARCHITECTURE.md`](../AI_STUDY_ASSISTANT_ARCHITECTURE.md), specifying Deno Edge Function placement, Supabase Secret key management, `ai_conversations`/`ai_messages`/`ai_usage_quotas` RLS schema, `50 students × 5 questions/day = 250 requests/day` capacity planning, and zero paid enablement.

---

## 12. Remaining Bugs & Limitations

1. Live DB lacks Migration `009` (`ai_quizzes*` = `404 PGRST205`) and Migration `010` university rows.
2. `generate-ai-quiz` Edge Function returns `404 NOT_FOUND` on live Supabase Cloud.
3. Custom SMTP, `Confirm email`, template `{{ .Token }}`, and corrected student Gmail test account are not configured yet on Supabase Dashboard.
4. `quiz_questions.correct_answer` is fetched to the browser for instant offline-capable grading rather than server-side grading.
5. `tests/e2e/` contains no Playwright browser specs yet.

---

## 13. Pending Work & 14. Recommended Next Actions

1. Run `009_ai_quiz_tables.sql` and `010_complete_universities.sql` in Supabase SQL Editor and deploy `generate-ai-quiz`.
2. Fix `princekarki127@gmmail.com`, configure Custom SMTP, confirm email templates (`{{ .Token }}` + `{{ .ConfirmationURL }}`), enable `Confirm email`, and allowlist GitHub Pages/localhost URLs.
3. Execute an authenticated two-student browser E2E test covering Signup → Confirm → Login → Subject Onboarding → Task CRUD → Quiz Submit → Password Recovery OTP → Logout/Restore, recording sanitized screenshots in [`Evidence/`](Evidence/README.md).

---

## 15. Related GitHub Issues

- [Issue #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48), [#47](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/47), [#40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40), [#39](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/39), [#38](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/38), [#37](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/37), [#35](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/35), [#34](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/34), [#30](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/30), [#23](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23), [#22](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/22), [#19](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/19).

---

## 16. Supporting Documentation Links

- [`backend-architecture.md`](backend-architecture.md)
- [`backend-integration-report.md`](backend-integration-report.md)
- [`authentication-testing.md`](authentication-testing.md)
- [`password-reset-investigation.md`](password-reset-investigation.md)
- [`database-verification.md`](database-verification.md)
- [`subject-selection-testing.md`](subject-selection-testing.md)
- [`task-quiz-testing.md`](task-quiz-testing.md)
- [`ai-integration-plan.md`](ai-integration-plan.md)
- [`backend-test-results.md`](backend-test-results.md)
- [`SUPABASE_VERIFICATION_REPORT.md`](SUPABASE_VERIFICATION_REPORT.md)
- [`Evidence/README.md`](Evidence/README.md)
- [`weekly-report.md`](weekly-report.md)
