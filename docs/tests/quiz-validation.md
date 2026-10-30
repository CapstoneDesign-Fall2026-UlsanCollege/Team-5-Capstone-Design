# Quiz Validation

## Quiz modes

The quiz supports five computer-science subjects: Programming, Data Structures & Algorithms, Databases, Computer Networks, and Operating Systems.

- A standard subject quiz presents all 15 questions in that subject's question bank.
- A rapid subject quiz presents 10 randomly selected questions and ends after 30 seconds.
- Both modes show the score, percentage, selected answers, correct answers for missed questions, and the latest result in `localStorage` under `smart_study_quiz_last`.

## Validation checklist

1. Open the Quiz screen and confirm that all five subjects can be selected.
2. For each subject, start a standard quiz and confirm that it contains 15 questions with four answer choices each.
3. Complete a standard quiz and confirm that its result shows the correct score out of 15, percentage, and answer review.
4. For each subject, start a rapid quiz and confirm that it contains 10 questions and starts at 30 seconds.
5. Confirm that the rapid quiz can be submitted before time expires, and that the timer ends the quiz with unanswered questions counted as incorrect.
6. Confirm that the saved result includes the subject, mode, correct count, total count, and percentage.

## Score calculation

The percentage is calculated as:

`round((correct answers / total questions) × 100)`

For an unanswered rapid quiz question, the selected answer is treated as incorrect and the result review identifies it as not answered.
