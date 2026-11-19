# Week 12 — Retake Quiz Bug Fix and QA Verification

**Project:** Smart Study Companion — Team 5  
**Date:** November 19, 2026  
**Testing Area:** Quiz Functionality  
**Bug:** Retake Quiz button incorrectly returns to setup  
**Branch:** `fix/retake-quiz-button` (branched from `main` @ `f2c1134`)  
**Status:** Implemented & verified via local unit/integration tests; live browser & multi-account E2E verification pending

---

## 1. Objective

Fix the broken **Retake quiz** button on the Quiz Practice results screen (`#quiz-result`) so students can immediately restart the exact same quiz mode, subject, difficulty, and AI topic without being sent back to the setup screen, while keeping **Choose another quiz** (`#quiz-to-plan-btn`) navigating to setup.

---

## 2. Bug Description

### Observed Behavior (Before Fix)
1. Student selects a university, subject, and difficulty level and completes a Standard, Rapid, or AI quiz.
2. Results appear on `#quiz-result`.
3. Student clicks **Retake quiz** (`#quiz-retake-btn`).
4. The application navigates back to `#quiz-setup` instead of restarting the quiz—identical to clicking **Choose another quiz** (`#quiz-to-plan-btn`).

### Expected Behavior
Clicking **Retake quiz** must immediately start a new attempt in the same quiz mode (`standard`, `rapid`, or `ai`), preserving the previous subject, difficulty, and AI topic/count, resetting question index to `0`, clearing all answers, resetting the 30-second timer for Rapid mode, and recording the new attempt without duplicating or overwriting historical results. **Choose another quiz** must continue returning to `#quiz-setup`.

---

## 3. Root Cause Analysis

Confirmed by inspecting [`public/app.js`](../../public/app.js):
- `#quiz-retake-btn` and `#quiz-to-plan-btn` were both bound directly to `() => setQuizStage('setup')`.
- Neither `startQuiz(quiz.mode)` nor `startAiQuiz()` was invoked on retake, and no snapshot of the completed quiz configuration (`lastQuizConfig`) was preserved.
- Additionally, `startQuiz()` and `startAiQuiz()` previously cleared `quiz.questions = []` before awaiting question loading, which could wipe the completed attempt if a retake fetch failed, and `finishQuiz()` lacked an idempotency guard (`if (quiz.finished ...)`).

---

## 4. Implementation / Bug Fix

### Files Changed
- [`src/lib/quiz-engine.js`](../../src/lib/quiz-engine.js) *(mirrored to `public/src/lib/quiz-engine.js` and `Backend/lib/quiz-engine.js`)*:
  - Added `snapshotQuizConfig(source)` to capture `{ mode, subject, difficulty, topic, count }`.
  - Added `createQuizAttemptState(params)` to initialize a clean attempt (`index: 0`, `answers: Array(n).fill(null)`, `timeLeft: mode === 'rapid' ? 30 : 0`, `deadline: 0`, `finished: false`).
- [`public/app.js`](../../public/app.js):
  - Added `lastQuizConfig` and `isRetakingQuiz` state.
  - Added `retakeCurrentQuiz()` to prevent concurrent retakes (`isRetakingQuiz` + disabling `#quiz-retake-btn`), sync form inputs from `lastQuizConfig`, and call `startAiQuiz(cfg)` for `mode === 'ai'` or `startQuiz(cfg.mode, cfg)` for `'standard'`/`'rapid'`.
  - Updated `startQuiz(mode, overrideConfig)` and `startAiQuiz(overrideConfig)` to keep the prior attempt intact until new questions load successfully, then reset via `createQuizAttemptState(...)` and restart `startRapidQuizTimer()` for `'rapid'`.
  - Added `if (quiz.finished || !quiz.questions || quiz.questions.length === 0) return;` guard in `finishQuiz()`.
  - Re-wired `#quiz-retake-btn` to `() => retakeCurrentQuiz()` while keeping `#quiz-to-plan-btn` on `() => setQuizStage('setup')`.
- [`tests/unit/quiz-retake.test.js`](../../tests/unit/quiz-retake.test.js):
  - Added 5 unit/contract tests covering `RT-01` through `RT-09`.

---

## 5. Testing Methodology

- **Local Unit & Contract Suite (Vitest):** `npm test` — tests `snapshotQuizConfig`, `createQuizAttemptState`, multi-retake state isolation, and `public/app.js` event-handler/guard wiring.
- **Python System Harness:** `python3 tests/run_tests.py` — verifies project structure, migrations, auth, tasks, academic catalog, quiz scoring, and theme toggle.
- **Python AI Quiz Suite:** `python3 tests/test_ai_quiz.py` — verifies AI quiz schema, validation, scoring, and UI controls.
- **Production Bundle:** `npm run build` — verifies Vite multi-page compilation across all 6 HTML entry points.
- **Browser E2E (`Playwright`):** **NOT RUN** (`@playwright/test` is not installed in `node_modules`).

---

## 6. Test Results

| Test ID | Test Scenario | Expected Behavior | Actual Behavior | Status | Evidence |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **RT-01** | Complete standard quiz and click Retake Quiz | Same quiz mode starts directly | `snapshotQuizConfig` + `#quiz-retake-btn` -> `retakeCurrentQuiz()` -> `startQuiz('standard')` verified in unit/contract tests; live browser click not run | **PASS (Unit) / NOT RUN (Browser)** | [`quiz-retake.test.js`](../../tests/unit/quiz-retake.test.js) |
| **RT-02** | Retake after selecting subject and difficulty | Original selections preserved | `snapshotQuizConfig` & input sync preserve `subject` and `difficulty` | **PASS (Unit) / NOT RUN (Browser)** | [`quiz-retake.test.js`](../../tests/unit/quiz-retake.test.js) |
| **RT-03** | Retake a rapid/timed quiz | Timer resets to 30s and restarts | `createQuizAttemptState` resets `timeLeft: 30, deadline: 0`; `startQuiz` calls `startRapidQuizTimer()` | **PASS (Unit) / NOT RUN (Browser)** | [`quiz-retake.test.js`](../../tests/unit/quiz-retake.test.js) |
| **RT-04** | Retake an AI-generated quiz | AI quiz restarts via existing workflow | `retakeCurrentQuiz()` restores AI topic/subject/difficulty/count and calls `startAiQuiz(cfg)` | **PASS (Unit) / NOT RUN (Browser)** | [`quiz-retake.test.js`](../../tests/unit/quiz-retake.test.js) |
| **RT-05** | Verify answers and score after retake | Answers reset and new score calculated | `answers` reset to `null[]`, `index: 0`, `finished: false` | **PASS (Unit)** | [`quiz-retake.test.js`](../../tests/unit/quiz-retake.test.js) |
| **RT-06** | Click Choose Another Quiz | Returns to quiz setup screen | `#quiz-to-plan-btn` remains wired to `setQuizStage('setup')` | **PASS (Unit)** | [`quiz-retake.test.js`](../../tests/unit/quiz-retake.test.js) |
| **RT-07** | Finish and retake multiple times | Every new attempt starts clean | Sequential `createQuizAttemptState` calls confirmed isolated with no leaked answers | **PASS (Unit)** | [`quiz-retake.test.js`](../../tests/unit/quiz-retake.test.js) |
| **RT-08** | Existing tasks, analytics, auth, and build | No regression introduced | `npm test` **75/75 PASS**, `run_tests.py` **11/11 PASS**, `test_ai_quiz.py` **4/4 PASS**, `vite build` **PASS** | **PASS (Local Suites)** | Command output in PR |
| **RT-09** | Quiz history & Supabase persistence on retake | Previous results preserved, new attempt stored once | `finishQuiz` guard `if (quiz.finished ...) return;` verified; live Supabase round-trip not run | **PASS (Unit) / NOT RUN (Live DB)** | [`quiz-retake.test.js`](../../tests/unit/quiz-retake.test.js) |

---

## 7. Screenshot Evidence

Automated browser capture was unavailable in this session (`@playwright/test` is not installed and Chrome DevTools remote debugging was not active). Manual capture instructions and target filenames (`RT-03` through `RT-08`) are documented in [`Evidence/Quiz-Retake-Fix/README.md`](Evidence/Quiz-Retake-Fix/README.md). No fabricated screenshots were added.

---

## 8. Regression Testing

- `npm test` (Vitest): **10 files, 75 / 75 tests passed** (includes `auth.test.js`, `tasks.test.js`, `task-create.test.js`, `theme.test.js`, `quiz.test.js`, `quiz-engine.test.js`, `quiz-retake.test.js`, `backend-services.test.js`, `study-logic.test.js`, `study-achievements-celebrations.test.js`).
- `python3 tests/run_tests.py`: **11 / 11 passed**.
- `python3 tests/test_ai_quiz.py`: **4 / 4 passed**.
- `npm run build`: **PASS** (138ms, 6 HTML entry points).

---

## 9. Issues or Limitations

1. Live browser E2E execution (`RT-01`–`RT-07` visual flows and `RT-08` screenshots) has not been executed yet because `@playwright/test` is not installed.
2. Live Supabase database persistence on retake (`RT-09`) was verified at the unit/contract level, not against a live Supabase session.

---

## 10. Conclusion

The **Retake quiz** defect in [`public/app.js`](../../public/app.js) was fixed by replacing the `setQuizStage('setup')` stub on `#quiz-retake-btn` with `retakeCurrentQuiz()`, preserving quiz configuration in `lastQuizConfig`, resetting attempt state cleanly via `createQuizAttemptState()`, and guarding `finishQuiz()` against duplicate submissions. All 75 Vitest tests, 11 Python system tests, 4 AI Quiz tests, and the Vite production build pass locally; manual browser screenshot capture and live Supabase verification remain to be completed before merging.
