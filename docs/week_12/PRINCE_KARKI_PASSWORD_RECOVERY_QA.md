# Week 12 — Password Recovery Independent QA Retest

**Project:** Smart Study Companion — Team 5  
**QA report location / owner:** Prince Karki (`princekark`)  
**Testing date:** November 20, 2026 (confirm before committing)  
**Role:** Independent QA / Password Recovery Regression Testing 
**testing** backend testing 
**Feature:** Forgot Password → Recovery Email / 6-Digit OTP → Set New Password → Re-login  
**Related issue:** [#40 — Password recovery / SMTP](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40)  
**Implementation reference:** [Week 12 SMTP verification](AUTH_SMTP_VERIFICATION.md)  
**Previous QA baseline:** [Week 10 Testing Report](../week_10/TESTING_REPORT.md)  
**Current status:** **PARTIALLY VERIFIED** — old password rejected after reset; remaining steps need separately recorded evidence.

> **Attribution note:** This file is prepared for the `princekark` QA area. Prince Karki should confirm that he personally performed or independently reviewed the recorded checks before signing it as his own test. Do not credit tests to a person who did not run or review them.

## 1. Objective

Independently retest password recovery after Nabin Khadka's reported authentication/email-delivery update. Compare current observations with the Week 10 failure, where password recovery email was not received and end-to-end password reset was blocked. Verify the complete user path before marking the whole fix as PASS.

## 2. Previous Problem and Reported Fix

- **Week 10 baseline:** Recovery email/code was not received in the tested inbox, so reset completion could not be verified. Earlier investigation also found an incorrectly spelled registered email address and unresolved mail-delivery configuration.
- **Week 12 developer update:** The team reports that Brevo Custom SMTP is configured with Supabase and that live password recovery now works. This is a developer/team report, not a substitute for this independent QA receipt.
- **Independent test scope:** Actual email receipt; 6-digit OTP or recovery link; password update; successful sign-in with new password; old-password rejection.

## 3. Test Environment

- **Application used:** [GitHub Pages password recovery page](https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/auth/forgot-password.html) (confirm this was the exact tested deployment).
- **Browser/device:** [Fill in actual browser and device]
- **Test account:** Existing registered account (email redacted in published evidence)
- **Application build / deployment revision:** Not recorded; request deployment SHA or note unknown.
- **Test operator:** [Confirm who executed the checks]

## 4. Test Cases and Results

| Test ID | Test action | Expected result | Actual recorded result | Status |
| :--- | :--- | :--- | :--- | :--- |
| PR-01 | Open Forgot Password page | Recovery form loads | Page reportedly opened; screenshot/result not attached | **EVIDENCE PENDING** |
| PR-02 | Submit registered email | Recovery request accepted without exposing account status | Tester proceeded; exact response not recorded | **NOT CONFIRMED** |
| PR-03 | Check inbox for recovery email | Real email arrives with a valid recovery method | Tester moved to next step; explicit email receipt result and proof not recorded | **NOT CONFIRMED** |
| PR-04 | Enter valid OTP or use recovery link, then set new password | Recovery authorization accepted and new password saved | Tester proceeded to login tests; exact reset confirmation not recorded | **NOT CONFIRMED** |
| PR-05 | Log in using new password | Login succeeds; Dashboard opens | No explicit PASS/FAIL result recorded | **NOT CONFIRMED** |
| PR-06 | Log out and attempt login with old password | Old password is rejected; access denied | **Tester explicitly reported old password was rejected after resetting it** | **PASS (user-reported; screenshot pending)** |
| PR-07 | Enter invalid/expired recovery code | Clear failure; password unchanged | Not tested in this run | **NOT TESTED** |

**Verified result in this receipt:** 1 user-reported PASS (PR-06); other checkpoints are unconfirmed or not tested. Do not sum them as PASSES or claim the entire workflow has passed yet.

## 5. Steps Used for the Old-Password Negative Test

1. Complete the password recovery attempt using a registered test account.
2. Open the login page after the reset attempt.
3. Log out if an authenticated session is active.
4. Enter the same registered email and the previous password.
5. Click **Sign In**.
6. Observe whether authentication is rejected.

**Expected:** Previous password is no longer valid after a successful password change.  
**Actual:** Previous password was rejected (**tester-reported PASS**).  
**Limitation:** Rejection alone does not prove email delivery, OTP verification, or successful new-password login without separate observations.

## 6. Screenshot Evidence Register

Put redacted captures in `docs/week_12/Evidence/Prince-Karki/`. Link each screenshot from this report after uploading. These are **planned filenames**, not claims that files already exist.

| Evidence ID | Planned filename | What it should show | Upload status |
| :--- | :--- | :--- | :--- |
| E01 | `W12-PR-01-forgot-password.png` | Recovery form open | Pending link |
| E02 | `W12-PR-02-request-submitted.png` | Request response on the page | Pending link |
| E03 | `W12-PR-03-email-received.png` | Inbox entry, with code/link/address hidden | Pending link |
| E04 | `W12-PR-04-reset-page.png` | Reset form with sensitive inputs hidden | Pending link |
| E05 | `W12-PR-05-new-password-login.png` | Authenticated Dashboard after new-password sign-in | Pending link |
| E06 | `W12-PR-06-old-password-rejected.png` | Old-password login failure (password hidden) | Pending link |

**Safety:** Never upload an OTP, recovery URL/token, password, SMTP key, access token, session cookie, or unredacted credentials. If any secret appears in a screenshot, redact it before committing.

## 7. Assessment and Next Action

**Current disposition: PARTIALLY VERIFIED.** The reported old-password rejection is consistent with a changed password, but a complete independent PASS requires explicit confirmation and sanitized evidence for email receipt, OTP/link validation, password update, and new-password login. An independent peer should repeat or review the same steps where practical.

**Next owner:** Prince Karki (`princekark`) / designated QA operator — confirm test attribution and upload redacted screenshots; record actual environment and date; mark PR-02 through PR-05 individually.  
**Implementation support:** Nabin Khadka and Sumit Adhikari — investigate any failed email, code, redirect, or login result.  
**Follow-up:** Comment on [Issue #40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40) with this report and add a short link under `docs/week_12/weekly-report.md` without overwriting teammates' existing work.

## 8. Suggested Shared Weekly Report Contribution (post only after attribution is confirmed)

> **Prince Karki (`princekark`) — Password Recovery QA follow-up:** Prepared independent verification of the Supabase/Brevo password-reset flow after the Week 10 missing-email failure. The old password was reported rejected after reset (**PR-06 PASS**); direct evidence for recovery email receipt, OTP/link verification, and new-password login remains to be confirmed and linked. Current outcome: **PARTIALLY VERIFIED**, with follow-up in `docs/week_12/PRINCE_KARKI_PASSWORD_RECOVERY_QA.md` and Issue #40.
