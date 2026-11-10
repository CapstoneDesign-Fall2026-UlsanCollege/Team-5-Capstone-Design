# Task Management, Quiz System & Analytics Testing — Week 10

**Project:** Smart Study Companion — Team 5  
**Test Separation:** Distinguishes **Automated Unit/Contract Tests Executed (2026-11-10)** from **Interactive Live Browser Flows (NOT TESTED / BLOCKED)**. Pre-existing static audit findings from [`SUPABASE_VERIFICATION_REPORT.md`](SUPABASE_VERIFICATION_REPORT.md) are preserved and updated with commit `ec6bd38` fixes.

---

## 1. Task Management Tests

| Test ID | Feature | Expected Result | Actual Result | Status | Evidence |
|---|---|---|---|---|---|
| **TASK-01** | Task Creation & Validation (`createTask`) | Rejects empty/whitespace titles, `>500`-char titles, invalid deadlines, and non-UUID cloud `subject_id`; inserts valid row with `student_id`, `subject_id`, `title`, `deadline` | `createTask` validation boundaries pass in Vitest; live PostgreSQL insert via authenticated session not executed | **PASS (Unit Mock) / NOT TESTED (Live)** | [`backend-services.test.js`](../../tests/unit/backend-services.test.js), [`src/services/tasks.js`](../../src/services/tasks.js) |
| **TASK-02** | Task Editing (`updateTask`) | Validates `title`, `deadline`, and `subject_id` UUID (`mappedUpdates.subject_id`); updates row in `public.tasks` | Fixed previously missing `deadline` & `subject_id` UUID validation on `updateTask`; passes Vitest; live DB update not run | **PASS (Unit Mock) / NOT TESTED (Live)** | [`backend-services.test.js`](../../tests/unit/backend-services.test.js), [`src/services/tasks.js`](../../src/services/tasks.js) |
| **TASK-03** | Task Completion Toggle (`toggleTask` + UI) | UI waits for `apiToggleTask` result; keeps previous completion state & shows error toast if DB update fails | Fixed silent optimistic overwrite in `public/app.js` toggle handler (`ec6bd38`); live browser toggle not run | **PASS (Static Fix) / NOT TESTED (Live)** | [`public/app.js`](../../public/app.js) |
| **TASK-04** | Task Deletion (`deleteTask` + UI) | UI checks `apiDeleteTask` `{ error }` before removing task card from DOM; avoids UUID errors on `local-task-*` IDs | Fixed in `src/services/tasks.js` and `public/app.js` confirm-delete listener (`ec6bd38`); live browser delete not run | **PASS (Static Fix) / NOT TESTED (Live)** | [`src/services/tasks.js`](../../src/services/tasks.js), [`public/app.js`](../../public/app.js) |
| **TASK-05** | Task Filtering, Search & Metrics (`tasks.test.js`) | Filters accurately by `pending`/`completed`, subject tab, keyword query; calculates overdue & completion `%` | `5/5` unit tests PASS in `tests/unit/tasks.test.js` (`2026-11-10`); live DB reload after logout/login **NOT TESTED** | **PASS (Unit) / NOT TESTED (Live)** | [`tests/unit/tasks.test.js`](../../tests/unit/tasks.test.js) |

---

## 2. Quiz System Tests

| Test ID | Feature | Expected Result | Actual Result | Status | Evidence |
|---|---|---|---|---|---|
| **QUIZ-01** | Standard Quiz Loading (`getQuizQuestions`) | Loads 15 questions for 5 Core CS subjects (`10` available per subject for 27 expanded subjects in live DB `quiz_questions`, total `345`) | Live PostgREST confirmed `345` rows in `quiz_questions`; `getQuizQuestions()` shuffles and slices cleanly | **PASS (Live DB Read + Code)** | Live Rest probe (`345` rows); [`src/services/quiz.js`](../../src/services/quiz.js) |
| **QUIZ-02** | Rapid Quiz Timer & Question Flow | `10` questions / `30s` countdown finishes automatically on timeout (`quiz.mode === 'rapid'`) | Deadline math unit-tested in `tests/unit/quiz.test.js` (`4/4` PASS); browser timer run **NOT TESTED** | **PASS (Unit) / NOT TESTED (Live)** | [`tests/unit/quiz.test.js`](../../tests/unit/quiz.test.js) |
| **QUIZ-03** | Quiz Scoring & Answer Review | Computes correct count & rounded `%`; lists wrong answers with correct choice and AI explanations when available | Unit scoring tested in `quiz.test.js` (`4/4`) and `test_ai_quiz.py`; browser DOM review **NOT TESTED** | **PASS (Unit/Python) / NOT TESTED (Live)** | [`tests/unit/quiz.test.js`](../../tests/unit/quiz.test.js), [`tests/test_ai_quiz.py`](../../tests/test_ai_quiz.py) |
| **QUIZ-04** | Curated Quiz Submission & History Persistence (`saveQuizAttempt`, `getQuizHistory`) | Passes `mode`, resolves `subjectSlug -> UUID`, stores `NULL` for unanswered options, filters UUID `question_id`s, renders `#quiz-history-list` | Fixed broken `-1` / missing `mode` / ignored response errors in `quiz.js` & `app.js` (`ec6bd38`); verified with Vitest mocks; live DB write **NOT TESTED** | **PASS (Unit Mock) / NOT TESTED (Live)** | [`backend-services.test.js`](../../tests/unit/backend-services.test.js), [`public/app.js`](../../public/app.js) |
| **QUIZ-05** | AI Quiz Cloud Persistence & Edge Function | Invokes `generate-ai-quiz` and stores rows in `ai_quizzes` / `ai_quiz_questions` / `ai_quiz_attempts` | Edge Function returns `404 NOT_FOUND`; `ai_quizzes` returns `404 PGRST205`; client degrades cleanly to local topic generator (`dbPersisted: false`) verified by Vitest | **BLOCKED (Cloud 404) / PASS (Fallback)** | Live HTTP probe (`404`); [`backend-services.test.js`](../../tests/unit/backend-services.test.js) |

---

## 3. Analytics Integration Tests

| Test ID | Feature | Expected Result | Actual Result | Status | Evidence |
|---|---|---|---|---|---|
| **ANLY-01** | Task Totals, Completion Ring & Weekly Scheduled Chart | Displays accurate total, completed, pending, overdue, `%` orb, subject breakdown, and 7-day scheduled chart label | Task metrics unit-tested (`tasks.test.js`); updated misleading `"0 completed"` chart subtitle to `"0 scheduled"` (`public/index.html` matching `renderWeeklyActivityChart()`); live browser screenshot with refreshed tasks not re-run | **PASS (Unit/Static Fix) / NOT TESTED (Live)** | [`public/index.html`](../../public/index.html), [`public/app.js`](../../public/app.js) |
| **ANLY-02** | Quiz Performance Analytics Summary (`#analytics-quiz-summary`) | Displays Total Attempts, Average Score `%`, Best Score `%`, and recent attempts loaded from `getQuizHistory` + `getAiQuizHistory` | Wired DOM card (`#analytics-quiz-summary`) & `renderQuizAnalytics()` in `public/index.html` + `public/app.js`; live authenticated render **NOT TESTED** | **PASS (Static Wiring) / NOT TESTED (Live)** | [`public/index.html`](../../public/index.html), [`public/app.js`](../../public/app.js) |

---

## 4. Historical vs Newly Executed Checks Note

- Earlier Week 10 documentation ([`SUPABASE_VERIFICATION_REPORT.md`](SUPABASE_VERIFICATION_REPORT.md) by Sumit Adhikari) logged pre-fix static bugs where `finishQuiz()` omitted `mode`, `tasks.js` risked ID/field mismatches, and writes failed silently. Those codebase bugs have now been resolved in commit `ec6bd38` and tested under mocked Vitest contracts (`27/27` PASS), while live authenticated browser CRUD, refresh persistence, and two-student RLS isolation remain **NOT TESTED** pending live test accounts and dashboard SQL/SMTP setup.
