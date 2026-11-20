# Evidence Register

**Reviewed:** 2026-11-17 against baseline `d274332143ad1727e8aa1bd126bc7d4e2bd834b8`.  
This register reconciles historical records and indexes Week 11 receipts. Prabin's November 14 assisted observations were added on November 18 without changing the November 17 review baseline or promoting them to live-service acceptance.

---

## 1. Historical Receipts (Week 10)

| ID | Classification / Operator | Run Date & Source | Recorded Result | Environment, Revision & Limitation |
| :--- | :--- | :--- | :--- | :--- |
| **TASK-01** | Unit test / `RaiPrabin697` | November 10 in [task receipt](../week_10/Task-create-test-pass.md); Nov 11 in [shared report](../week_10/weekly-report.md) | **PASS**: valid/blank-title checks & local storage; 31 total tests reported | Local unit environment; exact run revision/date need confirmation; not cloud persistence or browser reload |
| **TASK-02** | Browser observation / `princekark` | 2026-11-11 [testing report](../week_10/TESTING_REPORT.md) | **PASS**: task CRUD, reload, task API HTTP 200 | Deployed browser; exact build/runtime metadata not independently confirmed here; not an RLS denial test |
| **AUTH-01** | Browser observation / `princekark` | 2026-11-11 [testing report](../week_10/TESTING_REPORT.md) | **PASS**: login/signup/session/logout | Historical receipt; not freshly reproduced; operator attribution retained |
| **AUTH-02** | Browser observation / `princekark` | 2026-11-11 [testing report](../week_10/TESTING_REPORT.md) | **FAIL**: recovery email not received; completion Blocked | Request acknowledgement does not prove email delivery or password change |
| **DATA-01** | Browser observation / `princekark` | 2026-11-11 [testing report](../week_10/TESTING_REPORT.md) | **PASS (UI-only)** | Server-side read/update/delete denial Not run; no independent RLS certification |
| **QUIZ-01** | Browser/service observation / `princekark` | 2026-11-11 [testing report](../week_10/TESTING_REPORT.md) | **FAIL**: AI storage/content criteria | [Storage #53](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/53), [content #54](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/54); missing error screenshot noted below |
| **ASSIST-01** | Assisted browser observation / automated assistant | 2026-11-11 [separate branch receipt](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/6a854582e5d25cdc26186f5d612c0b18908cf478/docs/week_10/Evidence/rai-prabin/2026-11-11-browser-run.md) | Historical receipt only; not promoted to a Week 11 Pass | Pinned off-main record; screenshot capture limitations; no claim of independent reproduction |

---

## 2. Week 11 Receipts (November 14–17, 2026)

### A. Desktop UI Evidence — J.N. Taj Oli (`jn-oli`)
- **Execution Date:** November 16, 2026
- **Source Document:** [`docs/week_11/UI_UX_VERIFICATION.md`](UI_UX_VERIFICATION.md)
- **Operator:** J.N. Taj Oli (`jn-oli`)
- **Environment:** Desktop Browser (macOS Safari & Chrome, local preview / deployed frontend)
- **Scope Covered:** 45 desktop verification checks covering:
  1. **Dashboard:** Student name visible, task metric cards (Total, Completed, Pending) matching list, Upcoming Deadlines rendered.
  2. **Navigation:** Task Tracker (`#tasks`), Subjects & University (`#subjects`), Analytics (`#analytics`), Quiz (`#quiz`).
  3. **Academic Catalog & Onboarding:** Country → University → Faculty → Major cascading, search filtering, category chips, selected-subject count, and selection persistence across reload.
  4. **Task Interactions:** Empty task title blocked, valid task saved and visible before/after reload, completion checkbox toggling, edit modal pre-population, delete confirmation dialog, and filter chips (All, Pending, Completed).
  5. **Study Analytics & Quiz Views:** Completion ring, 7-day bar chart, subject progress bar, curated quiz mode setup (Standard & Rapid), 4-choice questions, score/explanation display, and AI quiz tab navigation.
  6. **Accessibility & Controls:** Tab key focus outline traversal across buttons, inputs, dropdowns, and links; Escape key dismisses Add/Edit Task modal.
  7. **Theme:** Light and Dark mode readability across all 5 views; theme state persists across reload.
- **Recorded Result:** **45 PASS / 0 FAIL (Desktop)**
- **Explicit Limitation:** **Mobile phone-width testing (390px viewport, touch interaction, and sideways-scroll check) was NOT part of this desktop session.** Desktop results must not be promoted to full responsive mobile certification.

### B. Study Analytics Evidence — Prince Karki (`princekark`)
- **Execution Date:** November 16, 2026
- **Source Document:** [`docs/week_11/Study_Analytics_Report.md`](Study_Analytics_Report.md) / [`Suggestion/PRINCE_KARKI_STUDY_ANALYTICS_REPORT.md`](Suggestion/PRINCE_KARKI_STUDY_ANALYTICS_REPORT.md)
- **Operator:** Prince Karki (`princekark`)
- **Environment:** Desktop Web Browser, Local / Staging Session
- **Related Issue:** [Issue #61](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/61)
- **Scope Covered (8 Manual Tests):**
  1. `TEST 1` — Initial Study Analytics overview (0% completion, 0 tasks, 7 enrolled subjects, zero weekly graph).
  2. `TEST 2` — Analytics after task creation (pending tasks increment, total updates).
  3. `TEST 3` — Analytics after task completion (percentage recalculates, completed counter increments).
  4. `TEST 4` — Analytics persistence after page refresh (ring and stats survive reload).
  5. `TEST 5` — Analytics after task deletion (total decrements, ratio updates cleanly).
  6. `TEST 6` — Sunday weekly bar graph verification (bar height maps accurately to Sunday tasks).
  7. `TEST 7` — Multiple-day bar graph verification (distribution across days).
  8. `TEST 8` — Completed vs. pending task progress alignment.
- **Recorded Result:** **8 PASS / 0 FAIL**
- **Associated Screenshot Artifacts:**
  - [`Evidence/Prince-Karki/W11-01-analytics-overview.png`](Evidence/Prince-Karki/W11-01-analytics-overview.png)
  - [`Evidence/Prince-Karki/W11-02-analytics-after-task-creation.png`](Evidence/Prince-Karki/W11-02-analytics-after-task-creation.png)
  - [`Evidence/Prince-Karki/W11-03-analytics-after-completion.png`](Evidence/Prince-Karki/W11-03-analytics-after-completion.png)
  - [`Evidence/Prince-Karki/W11-04-analytics-after-refresh.png`](Evidence/Prince-Karki/W11-04-analytics-after-refresh.png)
  - [`Evidence/Prince-Karki/W11-05-analytics-after-deletion.png`](Evidence/Prince-Karki/W11-05-analytics-after-deletion.png)
  - [`Evidence/Prince-Karki/W11-06-sunday-bar-graph.png`](Evidence/Prince-Karki/W11-06-sunday-bar-graph.png)
  - [`Evidence/Prince-Karki/W11-07-multiple-day-bar-graph.png`](Evidence/Prince-Karki/W11-07-multiple-day-bar-graph.png)
  - [`Evidence/Prince-Karki/W11-08-completed-vs-pending.png`](Evidence/Prince-Karki/W11-08-completed-vs-pending.png)
- **Explicit Limitation:** These 8 manual checks establish local UI metric calculation and single-session persistence. They do NOT establish authenticated two-student RLS isolation or live database cloud acceptance.

### C. Python Contract Runner — Nabin Khadka (`liftupkhadka555-spec`)
- **Execution Date:** November 15–17, 2026
- **Source Document:** [`docs/week_11/E2E_TEST_RESULTS.md`](E2E_TEST_RESULTS.md)
- **Operator:** Nabin Khadka (`liftupkhadka555-spec`)
- **Command:** `python3 tests/e2e/e2e_runner.py` (wired to `npm run test:e2e`)
- **Recorded Result:** **3/3 Check Groups PASS**
  - Check 1: Playwright spec file existence and size validation.
  - Check 2: HTML entry points and required DOM IDs (`#task-title`, `#btn-add-task`, `#view-analytics`, etc.).
  - Check 3: Live Supabase PostgREST endpoint reachability and anonymous access denial (RLS blocking returning 0 rows).
- **Explicit Limitation:** **This is a static DOM and REST contract check, NOT an automated browser journey.** 0 of the 24 drafted Playwright browser tests were executed in Chromium/Firefox/WebKit.

### D. Two-Student Authenticated RLS Isolation (`DATA-01`)
- **Status:** **NOT RUN**
- **Protocol:** Defined in [`INDEPENDENT_VERIFICATION.md`](INDEPENDENT_VERIFICATION.md).
- **Blocker:** A and B were observed in separate browser sessions on November 14, but no authenticated cross-account PostgREST read, update, or delete response was captured. An independent reviewer and exact affected-row counts remain pending.
- **Explicit Rule:** Anonymous REST checks (`DATA-02`) do not substitute for authenticated two-student RLS verification (`DATA-01`).

### E. Prabin Assisted Browser Observations (`RaiPrabin697`)
- **Run date:** 2026-11-14 (Asia/Seoul); reconciled 2026-11-18. Exact run time and deployed build SHA were not captured.
- **Source:** [Prabin live-test receipt](RAI_LIVE_TEST_RECEIPT.md). The user handled sign-ins privately; an automated assistant operated the browser checks.
- **TASK-11A / AUTH-11A:** Account A's signed-in UI showed the new task title after save and again after reload; empty-title submission added no row. Account B's signed-in subject view showed zero tasks after reload.
- **Result class:** **Observed, UI-only, proof artifact pending.** No sanitized screenshot or authenticated service response was saved. Saved task attributes, final A recheck, and direct B read/update/delete denial remain unverified. This does not change `DATA-01` from **NOT RUN** or establish independent reproduction.

### F. Prabin Candidate-Build Preparation (`RaiPrabin697`)
- **Check date / operator:** 2026-11-20 (Asia/Seoul); automated assistant. `RaiPrabin697` has not confirmed the signed-in browser account as disposable.
- **Source:** [Prabin live-test receipt, candidate-build check](RAI_LIVE_TEST_RECEIPT.md#candidate-build-check-2026-11-20).
- **Environment / revision:** public GitHub Pages URL in Chrome on macOS; repository `main` was `8004e2108f2719cfc6ed1c1fceb0a6655951e255`. Deployed build SHA, Chrome version, and Supabase-versus-Local-Preview mode were not established.
- **Result class:** **Not run** for new task save/reload, Account B list, direct RLS checks, final A read, and independent teammate reproduction. The signed-in page load is preparation only, with no screenshot or service-response proof. Owners/next actions: `RaiPrabin697` confirms disposable accounts and runs the assisted task check; `adronnie` supports direct RLS response interpretation; `princekark` or another accepted non-author runs an independent repeat; `liftupkhadka555-spec` confirms deployed-build provenance.

The [seven-check receipt](RAI_LIVE_TEST_RECEIPT.md#seven-focused-checks-2026-11-20) itemizes the blocked account-dependent checks and the unrun quiz retake. No scenario was promoted to Pass or Fail, and no new bug issue was opened from this preparation attempt. Existing AI quiz issues #53/#54 and quiz-retake issue #70 have the `bug` label; their earlier evidence is not a fresh November 20 reproduction.

---

## 3. Image & Output Privacy Guidelines

1. **Artifact Location:** All verified screenshots must reside in `docs/week_11/Evidence/<member-name>/` or `docs/Week6/`.
2. **Sanitization Requirement:** Before committing any image, inspect every pixel to ensure private email addresses, personal passwords, Supabase service-role keys, and recovery codes are completely redacted.
3. **Attribution:** Captions must state the exact operator, date, environment, and what the image establishes versus what remains unproven.
