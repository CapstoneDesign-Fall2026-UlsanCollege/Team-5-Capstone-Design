# Week 12 — Responsive UI, Quiz Layout & Dark-Mode Accessibility Report

**1. Student & GitHub Username:** J.N. Taj Oli (`jn-oli`)  
**2. Assigned Responsibility:** UI/UX, Responsive Design, Mobile Layout Fixes, and Retake Quiz UI Peer Verification  
**3. Execution & Attribution Note:** J.N. Taj Oli (`jn-oli`) authored [QUIZ_RETAKE_PEER_REVIEW.md](QUIZ_RETAKE_PEER_REVIEW.md), filed Issues `#79`, `#80`, and `#83`, and completed the November 23 dark-mode Retake Quiz verification. Sumit Adhikari (`adronnie`) reported the dark-mode subject dropdown bug ([Issue #84](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84)). The CSS/JS fixes and multi-viewport Chrome checks below were executed **agent-assisted** under `jn-oli`'s UI fix ownership on branch `week12/final-qa-reconciliation` (`bb7c974`) and remain **open for personal verification and sign-off by J.N. Taj Oli and independent QA**.

---

## 4. Professor's Feedback Addressed

1. Reproduce and fix [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83) (mobile Quiz horizontal overflow) cleanly via layout rules (`flex-wrap`, `min-width: 0`, grid track clamping, responsive spacing/wrapping) rather than hiding `overflow-x`.
2. Verify Quiz across **all 7 representative viewport widths (`320px`, `375px`, `390px`, `430px`, `768px`, `1024px`, `1440px`)** in **both Light and Dark modes**, checking Setup, AI tab, live Rapid Quiz timer, Result actions, Retake Quiz, and desktop preservation.
3. Verify and attribute **Issue #84** (dark-mode subject dropdown contrast & focus states) cleanly: **Reporter = `adronnie`**, **Fix Owner = `jn-oli`**, **Tester = pending peer QA**.
4. Preserve November 23 Retake Quiz evidence and produce a clean Issue #83 update draft instead of assuming GitHub issue edits occurred.

---

## 5. Work Performed & Root Causes Resolved

| Defect / Item | Root Cause Verified | Minimal Fix Implemented | Files Changed |
|---|---|---|---|
| **Issue #83** — Mobile Quiz sideways scroll | `.quiz-type-tabs` and `.modal-actions` (containing 3–4 result buttons) lacked `flex-wrap: wrap`; CSS grid `minmax(220px, 1fr)` / `<select>` pushed tracks wider than narrow mobile widths; `.quiz-setup-controls` and `.subject-progress-meta` lacked `min-width: 0` wrapping; `320px` topbar/score/heading sizes exceeded narrow container widths. | Added `flex-wrap: wrap`, `min(220px, 100%)` / `min(180px, 100%)` grid sizing, `min-width: 0` + `overflow-wrap: anywhere`, responsive `@media (max-width: 600px)` full-width quiz/result actions, and `@media (max-width: 380px)` clamping (preserving desktop 1440px layout). | [`public/index.html`](../../public/index.html), [`public/styles.css`](../../public/styles.css) |
| **Issue #80** — Selected quiz-mode tab styling + **Hidden curated panel override** | `.quiz-type-tabs .btn-ghost.is-active` had no active CSS rules, ARIA `aria-selected`/`aria-pressed` was absent, and `.quiz-setup-controls { display: grid; }` overrode HTML `[hidden]` keeping the curated panel visible beneath the AI tab. | Added `.quiz-setup-controls[hidden] { display: none !important; }`, `.quiz-type-tabs .btn-ghost.is-active` (`--teal-soft` / `--teal`), `role="tablist"` / `role="tab"`, and unified `setQuizSetupMode()` helper. | [`public/index.html`](../../public/index.html), [`public/styles.css`](../../public/styles.css), [`public/app.js`](../../public/app.js) |
| **Issue #79** — Subject card `Enter`/`Space` keyboard toggle | `.scrollable-subject-card` had `tabindex="0"` and `role="checkbox"`, but `#subject-scroll-container` only listened to `click`, not `keydown`. | Extracted shared `toggleSubjectCard()` and added `Enter`/`Space` `keydown` support with focus restoration after re-render. | [`public/app.js`](../../public/app.js) |
| **Issue #84** — Dark-mode subject dropdown contrast *(Reported by `adronnie`)* | `.modal-card` styled `input` but not `select`; transparent `<select>` + missing `color-scheme` and missing `html.dark select option` rules caused unreadable dropdown/option text in dark mode; form `<select>` controls also lacked visible `:focus-visible` outlines. | Styled `.modal-card select`, added `:root { color-scheme: light; }` and `html.dark { color-scheme: dark; }`, added explicit `select option` + `html.dark select option` contrast colors, and added teal hover + `:focus-visible` outline rings across modal/quiz/onboarding selects. | [`public/styles.css`](../../public/styles.css) |

---

## 6. Testing Environment & Verification Matrix (Nov 25, 2026)

- **Environment:** Local Vite Production Preview (`npm run build` → `http://localhost:4173`), Playwright Chromium (`Desktop Chrome` & `Mobile Chrome Pixel 5`), non-cloud UI regression suite [`tests/e2e/ui-regression-mocked.spec.js`](../../tests/e2e/ui-regression-mocked.spec.js) (`UI-REG-01..06`).
- **Condition:** Automated checks used `setupMockedDashboardSession()` HTTP route interception for UI rendering without live student passwords.

### 6.1 7-Viewport Light & Dark Quiz Responsive Matrix (`UI-REG-06` — 14 Combinations)

| Viewport | Light Mode (Setup / AI / Rapid Timer / Result / Retake) | Dark Mode (Setup / AI / Rapid Timer / Result / Retake) | Overflow Condition (`scrollWidth <= clientWidth + 2`) |
|---|:---:|:---:|:---:|
| **320 × 568** | **PASS** | **PASS** | No sideways scroll |
| **375 × 667** | **PASS** | **PASS** | No sideways scroll |
| **390 × 844** | **PASS** | **PASS** | No sideways scroll |
| **430 × 932** | **PASS** | **PASS** | No sideways scroll |
| **768 × 1024** | **PASS** | **PASS** | No sideways scroll |
| **1024 × 768** | **PASS** | **PASS** | No sideways scroll |
| **1440 × 900** | **PASS** | **PASS** | Desktop layout preserved |

### 6.2 Dropdown, Keyboard & Retake Quiz Regression Checks

- `UI-REG-02` (`#79` Enter/Space toggle + focus restore): **PASS** (Desktop Chrome & Mobile Chrome)
- `UI-REG-03` (`#80` active tab style + hidden panel fix): **PASS** (Desktop Chrome & Mobile Chrome)
- `UI-REG-04` (`#84` `#task-subject` contrast & focus in Light/Dark modes): **PASS** (Desktop Chrome & Mobile Chrome)
- `UI-REG-05` (Rapid quiz timer visibility + Retake Quiz clean Question 1 reset): **PASS** (Desktop Chrome & Mobile Chrome)
- Preserved Historical Nov 23 Retake Quiz Peer Review by `jn-oli`: [`QUIZ_RETAKE_PEER_REVIEW.md`](QUIZ_RETAKE_PEER_REVIEW.md) + [`Evidence1/Retake Quiz Evidence.md`](Evidence1/Retake%20Quiz%20Evidence.md).

---

## 7. Captured Visual Evidence

- [`mobile-quiz-setup-320px-dark.png`](Evidence/Playwright-Fixes/mobile-quiz-setup-320px-dark.png) — 320px dark-mode Quiz Setup
- [`mobile-quiz-setup-375px.png`](Evidence/Playwright-Fixes/mobile-quiz-setup-375px.png) — 375px light-mode Quiz Setup
- [`mobile-quiz-result-375px.png`](Evidence/Playwright-Fixes/mobile-quiz-result-375px.png) — 375px Quiz Result + wrapped Retake buttons
- [`mobile-task-modal-dark-375px.png`](Evidence/Playwright-Fixes/mobile-task-modal-dark-375px.png) — 375px dark-mode Add Task modal with readable `#task-subject` dropdown (`Issue #84`)
- [`desktop-quiz-setup-1440px-light.png`](Evidence/Playwright-Fixes/desktop-quiz-setup-1440px-light.png) — 1440px desktop Quiz view preserved intact

---

## 8. Remaining Blockers & Ownership Review Status

- **Issue #83 & Issue #84 Open Status:** Must remain **OPEN** until J.N. Taj Oli (`jn-oli`) and an independent tester re-verify live deployed builds after merge and close cleanly on GitHub (see draft update in [`ISSUE_83_UPDATE_DRAFT.md`](ISSUE_83_UPDATE_DRAFT.md)).
- **UI/UX & Freeze Sign-Off:** **PENDING** final check by `jn-oli`.

---

## 9. Final Conclusion

All responsive overflow causes across `320px`–`1440px` and the dark-mode subject dropdown defect have been corrected and passed agent-assisted Chrome verification (`UI-REG-01..06`). Status stays pending personal confirmation by `jn-oli` and live production deployment verification.
