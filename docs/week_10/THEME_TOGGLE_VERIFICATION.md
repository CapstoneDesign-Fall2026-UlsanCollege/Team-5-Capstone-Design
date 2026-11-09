# Week 10 Theme Toggle Verification

**Project:** Smart Study Companion — Team 5
**Tester:** J.N. Taj Oli (`jn-oli`)
**Date:** 2026-11-09
**Command:** `npm test`

## Result

**PASS** — 4 files, 18 tests. All 6 checks in `tests/unit/theme.test.js` passed.

| Check | Result | What it covers |
|---|---|---|
| `npm test` | **PASS** — 4 files, 18 tests | Auth, task, quiz, and theme checks. The theme file is `tests/unit/theme.test.js` (6 tests). |
| Saved theme | **PASS** | A stored `dark` or `light` choice is used before the computer setting. |
| System preference | **PASS** | With nothing saved, the page follows the computer light/dark setting. |
| Click | **PASS** | A click switches the theme and stores `dark` or `light`. A second click switches it back. |
| Missing button | **PASS** | Startup does not crash when the button is absent. |
| Sidebar button | **PASS** | `public/index.html` still has the Dark mode / Light mode button, and the sidebar CSS keeps it on screen. |
| Browser click | **NOT RUN** | This run did not open a browser or click the on-screen button. |

## Evidence

| Evidence | What it supports |
|---|---|
| [Commit `3416d3b`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/3416d3b) | Sidebar layout so the theme button stays visible. |
| [Commit `ba4e592`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/ba4e592) | Automated theme check. |
| `tests/unit/theme.test.js` | The 6 theme checks. |
| `public/src/theme.js` | Light/dark logic used by the app. |

## Limit

This verifies the theme logic and that the sidebar button is still in the project. It does not replace a manual check of desktop and mobile screens, or screenshots of all 5 views.
