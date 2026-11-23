# Week 12 — Quiz Retake Peer Review

**Project:** Smart Study Companion — Team 5  
**Tester:** J.N. Taj Oli (`jn-oli`)  
**Reviewer:** J.N. Taj Oli → Nabin Khadka  
**Date:** November 23, 2026  
**Testing Area:** Quiz retake flow and mobile Quiz layout  
**Overall Result:** Retake works; one mobile layout issue remains

## 1. Objective

Verify that a completed quiz can be retaken without returning to setup, that the subject and difficulty remain the same, and that the retake starts a new attempt with the questions reset and shuffled.

This review also checked whether the Quiz page remains usable on a phone-width screen.

## 2. Test Results

| Check | What was observed | Result |
| :--- | :--- | :---: |
| Retake stays in the quiz | Retake opened the quiz again without returning to the setup page | **PASS** |
| Subject and difficulty | The retake kept the same subject and same difficulty | **PASS** |
| Questions | The same questions returned for the new attempt | **PASS** |
| Question order | The serial numbers changed because the questions were shuffled | **PASS / Observation** |
| Answers | The retake started with no answer selected | **PASS** |
| Choose another quiz | The rest of the reported retake path worked; choose another quiz returned to setup | **PASS (reported)** |
| Mobile Quiz layout | The Quiz section could be scrolled sideways on a phone-width screen | **FAIL** |

## 3. Question-Order Finding

A retake starts a new attempt. The app loads the questions again and shuffles their order, so question 1 on the second attempt can be a different question from question 1 on the first attempt.

The subject, difficulty, and question text staying the same is the required behavior for this review. The changed serial numbers are from the shuffle, not from the earlier bug that returned the app to the setup page.

## 4. Retake Verification

The peer review confirmed that:

- Selecting **Retake quiz** keeps the app in the Quiz view.
- The previous subject and difficulty are preserved.
- The same question set is loaded again.
- Questions are shuffled for the new attempt.
- Answers are reset for the new attempt.
- The reported choose-another-quiz path works as expected.

## 5. Mobile Layout Finding

On a phone-width screen, the Quiz section moves left and right and requires or permits horizontal scrolling.

The Quiz page should remain inside the viewport width with no sideways scroll. This is a layout defect in the mobile Quiz view. It does not undo the verified retake behavior.

## 6. Evidence

Screenshots were not attached to this report. If the screenshots are available, save them in:

`docs/week_12/Evidence/Quiz-Retake-Fix/`

The following evidence files should be attached:

- `RT-03-after-results.png` — results page after the first quiz
- `RT-04-retake-started.png` — quiz open immediately after selecting **Retake quiz**
- `RT-05-reset-answers.png` — question 1 of the retake with no answer selected
- `RT-06-retake-new-results.png` — new score with earlier attempt still in history
- `RT-07-choose-another.png` — setup page after selecting **Choose another quiz**
- `mobile-horizontal-scroll.png` — phone-width Quiz view showing the sideways overflow

## 7. Conclusion

The quiz retake flow passes the peer review. The new attempt remains in the Quiz view, retains the subject and difficulty, loads the same questions, and shuffles the question order.

One issue remains: the mobile Quiz layout has horizontal overflow and must be adjusted so the page stays within the phone viewport.
