# Week 10 Theme Toggle Verification

**Project:** Smart Study Companion — Team 5
**Tester:** J.N. Taj Oli (`jn-oli`)
**Unit test date:** 2026-11-09
**Browser check date:** 2026-11-11
**Browser:** https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html
**Command:** `npm test`
**App:** https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html

## Result

**Unit tests: PASS** — 4 files, 18 tests. All 6 checks in `tests/unit/theme.test.js` passed.

**Browser screenshots: PASS** — desktop and mobile, light and dark, captured on 2026-11-11.

**Five-view navigation: NOT RUN** — `#dashboard`, `#tasks`, `#subjects`, `#analytics`, and `#quiz` were not each opened on desktop and at mobile width.

| Check | Result | What it covers |
|---|---|---|
| `npm test` | **PASS** — 4 files, 18 tests | Auth, task, quiz, and theme checks. The theme file is `tests/unit/theme.test.js` (6 tests). |
| Saved theme | **PASS** | A stored `dark` or `light` choice is used before the computer setting. |
| System preference | **PASS** | With nothing saved, the page follows the computer light/dark setting. |
| Click | **PASS** | In the unit test, a click switches the theme and stores `dark` or `light`. A second click switches it back. |
| Missing button | **PASS** | Startup does not crash when the button is absent. |
| Sidebar button | **PASS** | `public/index.html` still has the Dark mode / Light mode button, and the sidebar CSS keeps it on screen. |
| Browser click | **PASS** | Opened the app in [open in browser](https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html) and used the sidebar theme button. Desktop and mobile screenshots show light mode and dark mode. |
| Desktop layout | **PASS** | `desktop-light.png` and `desktop-dark.png`. |
| Mobile layout | **PASS** | `mobile-light.png` and `mobile-dark.png`. |
| Five-view navigation | **NOT RUN** | All 5 views were not opened on desktop and at mobile width. |

## Screenshots

| File | What it shows |
|---|---|
| [`docs/week_10/Evidence/desktop-light.png`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Evidence/light%20mode%20check%20on%20desktop.md) | Desktop width, light mode |
| [`docs/week_10/Evidence/desktop-dark.png`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Evidence/light%20mode%20check%20on%20desktop.md) | Desktop width, dark mode |
| [`docs/week_10/Evidence/mobile-light.png`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Evidence/light%20mode%20check%20on%20mobile.md) | Mobile width, light mode |
| [`docs/week_10/Evidence/mobile-dark.png`]([Evidence/mobile-dark.png](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Evidence/light%20mode%20check%20on%20mobile.md)) | Mobile width, dark mode |

## Evidence

| Evidence | What it supports |
|---|---|
| [Commit `3416d3b`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/3416d3b) | Sidebar layout so the theme button stays visible. |
| [Commit `ba4e592`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/ba4e592) | Automated theme check. |
| `tests/unit/theme.test.js` | The 6 theme checks. |
| `public/src/theme.js` | Light/dark logic used by the app. |
| [`docs/week_10/Evidence/Automated test passed.png`](Evidence/Automated%20test%20passed.png) | Terminal output: 4 files passed, 18 tests passed, 6 theme checks passed, on 2026-11-09. |
| [docs/week_10/Evidence/desktop-light/dark.png](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Evidence/light%20mode%20check%20on%20desktop.md) | Desktop light/dark mode. |
| [docs/week_10/Evidence/mobile-light/dark.png](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Evidence/light%20mode%20check%20on%20mobile.md) | Mobile light/dark mode. |

## Limit

The `npm test` run on 2026-11-09 verifies theme logic. The screenshots on 2026-11-11 show light and dark mode at desktop and mobile width. Navigation across `#dashboard`, `#tasks`, `#subjects`, `#analytics`, and `#quiz` on both widths is still open.
