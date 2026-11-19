# Week 12 QA Screenshot Evidence — Retake Quiz Fix

Automated browser capture (`@playwright/test` / Chrome DevTools) was unavailable in this local session (`@playwright/test` is not installed in `node_modules`). Do **not** fabricate screenshots.

Capture the following real screenshots manually in a browser against `npm run dev` (or preview) and save them in this directory using these exact filenames:

| Filename | What to Capture |
| :--- | :--- |
| `RT-01-before-results.png` | *(Optional historical)* Completed quiz results screen before the fix |
| `RT-02-before-bug.png` | *(Optional historical)* Setup screen appearing after clicking **Retake quiz** before the fix |
| `RT-03-after-results.png` | Results screen after completing a quiz (`#quiz-result` visible) |
| `RT-04-retake-started.png` | Same quiz starts directly after clicking **Retake quiz** (`#quiz-play` visible, same mode/subject/difficulty) |
| `RT-05-reset-answers.png` | Question 1 of 15/10/5 with no radio option pre-selected |
| `RT-06-retake-new-results.png` | Newly completed retake attempt with updated score and preserved history |
| `RT-07-choose-another.png` | Setup screen (`#quiz-setup`) appearing after clicking **Choose another quiz** |
| `RT-08-automated-tests.png` | Terminal output showing `npm test` (75/75 PASS), `tests/run_tests.py` (11/11 PASS), and `tests/test_ai_quiz.py` (4/4 PASS) |
