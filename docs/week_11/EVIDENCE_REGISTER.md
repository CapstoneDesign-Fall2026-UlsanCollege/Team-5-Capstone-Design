# Evidence Register

Reviewed 2026-11-14 against baseline `c8f90a16414b3d93cb19e34733b29b6b2856f435`. This is a source review, not a new test run. Source revision identifies the inspected record unless a tested revision is explicitly recorded.

## Historical receipts

| ID | Classification / operator | Run date and source | Recorded result | Environment, revision and limitation |
|---|---|---|---|---|
| TASK-01 | Unit test / RaiPrabin697 per receipt | November 10 in [task receipt](../week_10/Task-create-test-pass.md); November 11 in [shared report](../week_10/weekly-report.md) | Pass: valid/blank-title checks and local storage; 31 total tests reported | Local unit environment; exact run revision/date need confirmation; not cloud persistence or browser reload |
| TASK-02 | Browser observation and live-service response / princekark per receipt | 2026-11-11 [testing report](../week_10/TESTING_REPORT.md) | Pass recorded: task CRUD, reload, task API HTTP 200 | Deployed browser; exact build/runtime metadata not independently confirmed here; not an RLS denial test |
| AUTH-01 | Browser observation / princekark per receipt | 2026-11-11 [testing report](../week_10/TESTING_REPORT.md) | Pass recorded: login/signup/session/logout | Historical receipt; not freshly reproduced; operator attribution retained |
| AUTH-02 | Browser observation / princekark per receipt | 2026-11-11 [testing report](../week_10/TESTING_REPORT.md) | Fail: recovery email not received; completion Blocked | A request acknowledgement does not prove email delivery or password change |
| DATA-01 | Browser observation / princekark per receipt | 2026-11-11 [testing report](../week_10/TESTING_REPORT.md) | Pass for UI separation only | Server-side read/update/delete denial Not run; no independent RLS certification |
| QUIZ-01 | Browser/service observation / princekark per receipt | 2026-11-11 [testing report](../week_10/TESTING_REPORT.md) | Fail: AI storage/content criteria | [Storage #53](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/53), [content #54](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/54); missing error screenshot noted below |
| ASSIST-01 | Assisted browser observation / automated assistant, not a personal student test | 2026-11-11 [separate branch receipt](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/6a854582e5d25cdc26186f5d612c0b18908cf478/docs/week_10/Evidence/rai-prabin/2026-11-11-browser-run.md) | Historical receipt only; not promoted to a Week 11 Pass | Pinned off-main record; screenshot capture limitations; no claim of independent reproduction |

No independent reviewer is recorded for these receipts by this documentation task. Their operators remain distinct from implementation owners.

## Fresh Week 11 receipts

All runtime cases in the [matrix](MVP_VERIFICATION_MATRIX.md) are **Not run** for Week 11. Before recording a result, add: case ID, timestamp/timezone, source SHA, deployed build/URL, browser/version, live/local mode, operator login, independent reviewer login, expected result, actual result, evidence link and limitation. Unknown metadata must remain unknown, not borrowed from the documentation baseline.

For each run, keep sanitized output and screenshot links beside the written receipt. Record Pass, Fail, Blocked or Not run. A partial check must identify its unverified criterion; do not assign an overall Pass to incomplete acceptance.

## Image and output review

- [Task unit output](../week_10/Evidence/tasl-create-test-pass.png): linked by the historical task receipt; intended to show unit output, not cloud behavior. This task has not completed a pixel-level privacy/caption review of that image.
- Prince's report retains its screenshot sequence. Its missing `W10-47-ai-quiz-supabase-404.png` is not proof; use the written finding and Issue #53 until the image is supplied.
- User-supplied November 11 task/dashboard images show UI state, not a reload action or network persistence. They are not newly uploaded or certified in this package; profile/contact information requires privacy review first.
- Before publishing any new image: inspect every pixel for email addresses, credentials, tokens, recovery URLs and unrelated tabs; redact only private information, disclose redaction, and preserve the visible test outcome. Add a caption naming what the image shows and what it does not establish.

No new screenshots or application-output artifacts were produced for this package.
