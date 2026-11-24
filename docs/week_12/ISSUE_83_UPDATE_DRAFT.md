# GitHub Issue Update Draft — Issue #83 (Mobile Quiz Horizontal Overflow) & Follow-Up

*(Prepared because direct GitHub issue editing CLI/API is not available in this workspace. Review and post to [Issue #83](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/83) by J.N. Taj Oli (`jn-oli`) after confirming on live preview/production.)*

---

## Suggested Comment / Body Update for Issue #83

- **Issue:** #83 — Phone-width Quiz Horizontal Overflow (`Issue #83`)
- **Reporter & Fix Owner:** J.N. Taj Oli (`jn-oli`) *(agent-assisted implementation on branches `week12/release-readiness-qa-fixes` [PR #85] & `week12/final-qa-reconciliation`, pending `jn-oli` personal verification before closing)*
- **Current Status:** **OPEN — Fix Ready in Repository, Pending Live Redeploy & Independent Phone-Width Recheck**

### Reproduction Steps
1. Open Smart Study Companion on a mobile width (`320px` or `375px`), sign in, and navigate to **Quiz Practice**.
2. Switch between **Standard & Rapid Quiz** and **AI Quiz Generator** tabs, start a quiz, and complete to **Quiz Results**.
3. Before fix: `.quiz-type-tabs`, `.quiz-setup-grid`, and `.modal-actions` (with 3+ result action buttons) expanded wider than `clientWidth`, permitting horizontal sideways scroll (`scrollWidth > clientWidth`).

### Root Cause
- `.quiz-type-tabs` and `.modal-actions` used `display: flex` without `flex-wrap: wrap`.
- `.quiz-setup-grid` used `minmax(220px, 1fr)` without `min(220px, 100%)` clamping, and `.quiz-setup-controls` / `.subject-progress-meta` lacked `min-width: 0` and text wrapping.
- Additionally found and fixed: `.quiz-setup-controls { display: grid; }` overrode HTML `[hidden]`, keeping `#quiz-curated-panel` visible when AI Quiz mode was selected (`#80`), plus narrow `<= 380px` score/question clamp sizing for `320px` screens.

### Files Changed
- `public/index.html`
- `public/styles.css`
- `public/app.js`
- `tests/e2e/ui-regression-mocked.spec.js` (`UI-REG-06`)

### Verification Completed (Agent-Assisted Local Vite Preview + Chromium)
- Verified `document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2` across all **7 viewports (`320px`, `375px`, `390px`, `430px`, `768px`, `1024px`, `1440px`)** in **both Light and Dark modes** covering Curated Setup, AI Tab, Rapid Quiz Play (with timer), Results, and Retake Quiz (`PASS`).
- **Evidence Screenshots:**
  - `docs/week_12/Evidence/Playwright-Fixes/mobile-quiz-setup-320px-dark.png`
  - `docs/week_12/Evidence/Playwright-Fixes/mobile-quiz-setup-375px.png`
  - `docs/week_12/Evidence/Playwright-Fixes/mobile-quiz-result-375px.png`
  - `docs/week_12/Evidence/Playwright-Fixes/desktop-quiz-setup-1440px-light.png`

### Remaining Steps Before Closing Issue #83
1. Confirm `week12/final-qa-reconciliation` is merged and deployed to the live target environment.
2. Perform personal recheck on phone width (light and dark mode) by `jn-oli` and an independent QA teammate (`princekark` / `RaiPrabin697`).
3. Keep Issue #83 **open** until that live verification succeeds.

---

*(Note on Issue #84 — Dark-Mode Subject Dropdown Contrast: **Reporter** = Sumit Adhikari [`adronnie`], **Fix Owner** = J.N. Taj Oli [`jn-oli`], fix included in `public/styles.css` and verified in [`mobile-task-modal-dark-375px.png`](Evidence/Playwright-Fixes/mobile-task-modal-dark-375px.png); also pending independent live check before closing #84.)*
