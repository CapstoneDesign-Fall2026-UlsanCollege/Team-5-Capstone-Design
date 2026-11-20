# Week 12 — Bug Fix Regression Report

**Project:** Smart Study Companion — Team 5  
**Date:** November 20, 2026  
**Branch:** `week12/p0-p1-verification-and-fixes`

---

## 1. Bug A — Task Modal Empty / Invalid Deadline Crash
- **Root Cause:** In `public/app.js`, `#task-form` submit handler executed `new Date(document.getElementById('task-deadline').value).toISOString()` before validating the input, throwing `RangeError: Invalid time value` on empty or malformed input.
- **Files Changed:** [`src/lib/date-utils.js`](../../src/lib/date-utils.js) *(mirrored to `public/src/lib/` & `Backend/lib/`)*, [`public/app.js`](../../public/app.js), [`tests/unit/bug-fixes-week12.test.js`](../../tests/unit/bug-fixes-week12.test.js).
- **Fix:** Added `parseDeadlineInputToIso()` and `formatForDateTimeLocalInput()`. Invalid or empty inputs now focus the deadline field and show a validation toast without throwing.

## 2. Bug B — UTC Date Offset in `dateInputValue()`
- **Root Cause:** `dateInputValue()` in `public/app.js` used `date.toISOString().slice(0, 10)` (UTC), shifting default deadline dates by 1 day between `00:00` and `08:59` in `Asia/Seoul` (`UTC+9`).
- **Files Changed:** [`src/lib/date-utils.js`](../../src/lib/date-utils.js), [`public/app.js`](../../public/app.js), [`tests/unit/bug-fixes-week12.test.js`](../../tests/unit/bug-fixes-week12.test.js).
- **Fix:** Replaced UTC slicing with `formatLocalDateInput()` using local `getFullYear()`, `getMonth() + 1`, and `getDate()`.

## 3. Bug C — Quiz History 20-Attempt Cap
- **Root Cause:** `loadAndRenderQuizHistory()` in `public/app.js` requested `limit = 20` from `getQuizHistory` and `getAiQuizHistory` and sliced the merged array to `20`, capping **Total Attempts** in Study Analytics at 20.
- **Status:** **FIXED (Backward-Compatible Query & State Increase)**
- **Files Changed:** [`public/app.js`](../../public/app.js), [`tests/unit/bug-fixes-week12.test.js`](../../tests/unit/bug-fixes-week12.test.js).
- **Fix:** Raised query fetch limit to `200` and removed `.slice(0, 20)` from `quizHistory` so Analytics metrics reflect full history while keeping the recent list compact (`slice(0, 8)`).

## 4. Migration Numbering Conflict (`011_` Duplicate)
- **Root Cause:** Both `011_study_streak_analytics.sql` (applied in Supabase Nov 17) and `011_quiz_difficulty_and_repetition.sql` (unapplied) shared the `011_` prefix.
- **Fix:** Preserved `011_study_streak_analytics.sql` and renamed the unapplied quiz migration + rollback to `012_quiz_difficulty_and_repetition.sql` / `012_quiz_difficulty_and_repetition_down.sql`.

## 5. Verification Results
- `npm test` (Vitest): **PASS** (includes new unit tests in [`tests/unit/bug-fixes-week12.test.js`](../../tests/unit/bug-fixes-week12.test.js))
- `python3 tests/run_tests.py`: **11 / 11 PASS**
- `python3 tests/test_ai_quiz.py`: **4 / 4 PASS**
- `npm run build`: **PASS**
