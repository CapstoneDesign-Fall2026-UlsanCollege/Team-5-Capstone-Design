[EVIDENCE_INDEX.md](https://github.com/user-attachments/files/35397150/EVIDENCE_INDEX.md)
# Evidence index

All screenshots are exact copies of previously provided test screenshots. They are **not fresh executions** by the report preparer. No PASS screenshots were created artificially.

| Screenshot | What it supports | SHA-256 (first 12) |
|---|---|---|
| `screenshots/W12-RETEST-ANLY-02-FAIL.png` | November 24/25 local partially corrected Analytics test; shows FAIL and remaining workload locator in source. | `cbd6636fa838` |
| `screenshots/W12-RETEST-QUIZ-01-FAIL.png` | November 25 QUIZ-01 terminal 1 failed. Exact error line not visible. | `4fb0506de926` |
| `screenshots/W12-RETEST-QUIZ-03-FAIL.png` | November 25 QUIZ-03 terminal 1 failed. See companion error capture. | `bb55b8bf1e59` |
| `screenshots/W12-RETEST-QUIZ-03-ERROR.png` | November 25 Playwright Errors view: timeout waiting for obsolete Start Quiz button locator. | `92578ec3afe1` |
| `screenshots/W12-RETEST-TASK-04-FAIL.png` | November 25 TASK-04 terminal FAIL. Old task search selector visible, exact top error not fully visible. | `362b396e0deb` |
| `screenshots/W12-BASELINE-MOB-02-SELECTOR-FAIL.png` | November 22 original mobile theme-toggle selector failure. | `f53904b50675` |
| `screenshots/W12-BASELINE-MOB-03-NAVIGATION-TIMEOUT.png` | November 22 original mobile hidden-sidebar navigation timeout. | `e666a15d848e` |
| `screenshots/W12-BASELINE-TASK-01-SELECTOR-FAIL.png` | November 22 original TASK-01 failure provided in earlier evidence package. | `47e5ceedc590` |
| `screenshots/W12-BASELINE-QUIZ-AUTHENTICATED.png` | November 22 original authenticated quiz test output captured as prior evidence. | `9ac948e9d0c2` |

## Important evidence boundaries

- AUTH-04 and ANLY-01 individual PASS results are based on the tester’s reported terminal outcomes; original PASS screenshots were **not supplied in this package**.
- Some older screenshots display terminal results without the detailed error above. Where the exact November 25 cause is unknown, the report says so.
- No screenshots of live two-account RLS are included because that verification remains **NOT RUN**.
- Password recovery photos are intentionally excluded because they may expose private account details or codes.
- The screenshots contain ordinary local Windows username/path information; consider redacting this before public sharing if required.
