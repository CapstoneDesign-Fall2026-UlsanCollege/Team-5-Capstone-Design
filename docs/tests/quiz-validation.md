# Quiz Score Validation — Programming Quiz 1

**Owner:** Prince Karki  
**Purpose:** Validate that the application's first quiz result calculates and displays the correct score.

## One specific next action

Run **Programming — Quiz 1** in the application using the five questions and answer sequence below, then compare the application's result with the expected result.

## Fixed quiz and answer key

| Question | Correct answer |
|---|---|
| What JavaScript keyword declares a block-scoped variable? | `let` |
| Which HTML element creates the largest heading? | `<h1>` |
| Which CSS property changes text color? | `color` |
| Which React hook manages state in a functional component? | `useState` |
| Which command initializes a Vite + React project? | `npm create vite@latest` |

The correct option sequence is **B, A, C, C, B** when the choices are presented in the order used in the quiz.

## Expected result

- Correct answers: **5**
- Total questions: **5**
- Expected percentage: **(5 / 5) × 100 = 100%**

## Validation procedure

1. Open the Quiz screen and start **Programming — Quiz 1**.
2. Select the answer sequence **B, A, C, C, B**.
3. Submit the quiz.
4. Record the score shown on the result screen.
5. Pass the test only if the application displays **5/5 correct** and **100%** (or an equivalent representation).
6. Check the browser's `localStorage` and confirm that the saved first result contains equivalent values: `correct = 5`, `total = 5`, and `percent = 100`.

## First-result record

Complete this table immediately after the first run:

| Field | Recorded value |
|---|---|
| Date/time |  |
| Browser/device |  |
| UI score displayed |  |
| Stored `correct` value |  |
| Stored `total` value |  |
| Stored `percent` value |  |
| Screenshot/evidence link |  |
| Pass or fail |  |
| Notes |  |

**Pass criterion:** The displayed score and stored result both match the independently calculated expected result of **5/5 (100%)**. If either differs, record **Fail** and report the actual values.
