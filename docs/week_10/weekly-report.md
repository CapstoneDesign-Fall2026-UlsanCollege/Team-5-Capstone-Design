# Week 10 Weekly Report — Team 5 (Smart Study Companion)

**Project:** Smart Study Companion  
**Team:** Team 5 — Capstone Design, Fall 2026 (Ulsan College)  
**Week:** 10 ("Own a Slice, Steward an Area")  
**Report Date:** 2026-11-07  
**Status:** Active Implementation & Verification

---

## 1. This Week's Goal & Summary

Our Week 10 goal is to follow the **"Own a Slice, Steward an Area"** milestone documented in [`docs/week_10/Slice.md`](Slice.md):
1. Stabilize the **Full-Stack Authentication, Onboarding, and Session Persistence** flow (including post-signup academic onboarding and 6-digit OTP / link password recovery).
2. Implement and verify the **Study Task Analytics & Workload Breakdown** dashboard (`#analytics`) and **Multi-Tier University & Scrollable Subject Onboarding** (`#subjects`).
3. Ensure every Team 5 member owns a verifiable **Roadmap Slice** and stewards a **Codebase Area**, with independent peer verification and concrete evidence links recorded in the **Member Contribution & Action Table** below.

---

## 2. What Team 5 Committed to Do in Week 10 (Action Checklist)

### Core Milestone Commitments
- [x] **Week 10 Slice & Stewardship Plan:** Author and publish [`docs/week_10/Slice.md`](Slice.md) defining all 5 member slices, codebase area boundaries, and Meet/Exceed verification rules (**Completed by Nabin Khadka**).
- [x] **Study Task Analytics & Workload Breakdown (`#analytics`):** Implement real-time completion rate ring, 7-day weekly activity bar chart, completed/pending/overdue workload breakdown, subject-wise completion progress bars, and upcoming deadlines timeline (**Completed by Nabin Khadka — [Issue #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48), [PR #46](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/46)**).
- [x] **Academic Hierarchy & Scrollable Subject Onboarding (`#subjects` & `signup.html`):** Fix Country/Region → University cascading dropdowns and add scrollable multi-select subject cards with search & category filters (**Completed by Nabin Khadka — [Issue #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48), [PR #46](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/46)**).
- [x] **Live Online App Deployment (GitHub Pages):** Publish live clickable links for Signup, Login, Dashboard, and Study Analytics so teammates can test directly in the browser (**Completed by Nabin Khadka**).
- [ ] **Database Save/Read & RLS Verification (Slice 1 — Sumit Adhikari):** Verify task creation/retrieval in Supabase PostgreSQL and confirm Row-Level Security (RLS) blocks unauthorized cross-student access.
- [ ] **Automated Functional & Regression Testing (Slice 2 — Prabin Rai):** Execute and document repeatable automated tests for task creation, invalid-input rejection, and persistence across reload.
- [ ] **Authentication & End-to-End Session Verification (Slice 3 — Prince Karki):** Execute valid/invalid login, session restoration after page refresh, password recovery, and logout verification on the updated build.
- [x] **Responsive Dashboard & Theme UI Verification (Slice 4 — J.N. Taj Oli):** Desktop and mobile viewport checks, navigation across all 5 views (`#dashboard`, `#tasks`, `#subjects`, `#analytics`, `#quiz`), and before/after screenshots are still open.
- [x] **Light/dark theme toggle automated verification (Slice 4 — J.N. Taj Oli):** `npm test` passed on 2026-11-09 (4 files, 18 tests, 6 theme checks). Recorded in [`docs/week_10/THEME_TOGGLE_VERIFICATION.md`](THEME_TOGGLE_VERIFICATION.md). Commits [`3416d3b`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/3416d3b) and [`ba4e592`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/ba4e592). [Screenshot Evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Evidence/Automated%20test%20passed.png)

---

## 3. Week 10 Evidence Links

| Evidence Category | Link | Status / Notes |
|---|---|---|
| **Week 10 Slice & Stewardship Plan** | [`docs/week_10/Slice.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Slice.md) | Authored by Nabin Khadka (`@liftupkhadka555-spec`) |
| **Week 10 Full-Stack Changes & Total Files Model** | [`docs/week_10/FULL_STACK_CHANGES_MODEL.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/FULL_STACK_CHANGES_MODEL.md) | Complete Week 9 vs. Week 10 full-stack comparison & file tree model |
| **Study Analytics & Onboarding Issue** | [Issue #48 — Feature Update: Study Task Analytics, University Hierarchy & Scrollable Subject Onboarding](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48) | Created with full scope & Definition of Done |
| **Visual Screenshot Evidence Comment** | [Issue #48 Comment — Study Task Analytics & University Selector Screenshots](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48#issuecomment-6706622137) | Contains captured screenshots of `#analytics` and `#subjects` |
| **Merged Pull Request** | [PR #46 — Implement Full-Stack Auth, Academic Hierarchy, Subject Onboarding & Study Analytics](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/46) | Merged into `main` (`adc0967` / `0d1f79d`) |
| **Study Analytics Screenshot** | [`docs/week_10/study-analytics-dashboard.png`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/study-analytics-dashboard.png) | Verified local preview screenshot of `#analytics` |
| **Subjects & University Screenshot** | [`docs/week_10/subjects-university-selector.png`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/subjects-university-selector.png) | Verified local preview screenshot of `#subjects` |
| **Automated Verification Suite** | [`tests/run_tests.py`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/tests/run_tests.py) | 7/7 check groups passing (`python3 tests/run_tests.py`) |
| **Live Online App (Study Analytics)** | [Live Study Task Analytics (`#analytics`)](https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html#analytics) | Live on GitHub Pages |
| **Live Online App (Login / Signup)** | [Live Login](https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/auth/login.html) · [Live Signup](https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/auth/signup.html) | Live on GitHub Pages |
| **Theme toggle automated verification** | [`docs/week_10/THEME_TOGGLE_VERIFICATION.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/THEME_TOGGLE_VERIFICATION.md) | `npm test` PASS on 2026-11-09 by J.N. Taj Oli (`jn-oli`): 4 files, 18 tests, 6 theme checks. Browser click not run. |

---

## 4. Team 5 Member Contribution Table

> **Instructions for Teammates:** Each member must fill in their own row below once their Week 10 slice and verification work are completed, and attach their own Evidence links (Issue, PR, commit, or screenshot).

| Member | GitHub Login | Week 10 Roadmap Slice & Codebase Area | What They Did (Week 10 Contribution) | Evidence Links (Issues, PRs, Docs, Screenshots) | Status |
|---|---|---|---|---|---|
| **Nabin Khadka** | `liftupkhadka555-spec` | **Slice 5:** Full-Stack Auth Integration, Study Task Analytics (`#analytics`), & Academic Hierarchy Onboarding (`#subjects`)<br>**Area:** Frontend, Backend Services, Auth & Analytics (`public/app.js`, `src/lib/academic-catalog.js`, `src/services/*`, `public/auth/*`) | 1. Authored Week 10 planning & slice specification [`docs/week_10/Slice.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Slice.md).<br>2. Implemented **Study Task Analytics & Workload Breakdown** (`#analytics`) with completion rate ring, 7-day weekly activity chart, workload breakdown bars, and subject-wise progress bars.<br>3. Fixed Country/Region → University dropdown selection on `signup.html` and `#subjects`, and built scrollable multi-select subject onboarding.<br>4. Added 6-digit OTP + link password reset and deployed live GitHub Pages app.<br>5. Created [Issue #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48) and posted screenshot verification in [Comment #6706622137](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48#issuecomment-6706622137). | • **Week 10 Slice Doc:** [`docs/week_10/Slice.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Slice.md)<br>• **Full-Stack Changes & Files Model:** [`docs/week_10/FULL_STACK_CHANGES_MODEL.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/FULL_STACK_CHANGES_MODEL.md)<br>• **Study Analytics Issue:** [Issue #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48)<br>• **Issue Screenshot Comment:** [Issue #48 Comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48#issuecomment-6706622137)<br>• **Merged PR:** [PR #46](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/46)<br>• **Screenshots:** [`study-analytics-dashboard.png`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/study-analytics-dashboard.png), [`subjects-university-selector.png`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/subjects-university-selector.png)<br>• **Evidence Doc:** [`Evidence.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/Evidence.md) | **Completed** |
| **Sumit Adhikari** | `adronnie` |Responsible for database design and Supabase integration, including database schema, SQL migrations, table relationships, and Row Level Security (RLS). |Reviewed the Supabase database structure, identified database and frontend integration issues, checked RLS policies, and prepared technical reports documenting database problems, required fixes, and testing procedures. |[AI_USE_AND_CODE_OWNERSHIP_AUDIT](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/b95f895220fb3ea33284d62be5352d2d8cc0ca54/docs/week_10/AI_USE_AND_CODE_OWNERSHIP_AUDIT.md), [SUPABASE_VERIFICATION_REPORT](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/b95f895220fb3ea33284d62be5352d2d8cc0ca54/docs/week_10/SUPABASE_VERIFICATION_REPORT.md) | |
| **Prabin Rai** | `RaiPrabin697` | | | | |
| **Prince Karki** | `princekark` | | | | |
| **J.N. Taj Oli** | `jn-oli` | **Slice 4:** Light/dark theme toggle verification<br>**Area:** Sidebar theme button (`public/styles.css`, `public/src/theme.js`, `tests/unit/theme.test.js`) | Kept the theme button visible in the sidebar and added an automated theme check. `npm test` passed on 2026-11-09 (4 files, 18 tests, 6 theme checks). Desktop/mobile screenshots and the 5-view navigation check are still open. | • **Verification:** [`docs/week_10/THEME_TOGGLE_VERIFICATION.md`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/THEME_TOGGLE_VERIFICATION.md)<br>• **Visibility commit:** [`3416d3b`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/3416d3b)<br>• **Test commit:** [`ba4e592`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/commit/ba4e592)  [Screenshot Evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Evidence/Automated%20test%20passed.png),[desktop evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/e2f71c7669f8e6f7c4f5299a39fc243d2477c02f/docs/week_10/Evidence/desktop%20evidence.md),[mobile evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/e2f71c7669f8e6f7c4f5299a39fc243d2477c02f/docs/week_10/Evidence/mobile%20evidence.md)| **Theme check completed; screenshots still open** |

---

## 5. Detailed Tasks Needed for Each Member in Week 10

To make sure every teammate knows exactly what to execute and submit before the Week 10 deadline, follow the steps for your assigned role:

### 1. Nabin Khadka (`@liftupkhadka555-spec`) — Slice 5 (Completed)
- [x] Author [`docs/week_10/Slice.md`](Slice.md) defining Team 5's Week 10 roadmap slices and area stewardship.
- [x] Implement Study Task Analytics (`#analytics`) with total/completed/pending/overdue counters, 7-day weekly activity chart, and subject-wise progress bars.
- [x] Fix Country/Region → University selector on `signup.html` and `#subjects` and implement scrollable subject selection.
- [x] Open [Issue #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48) and attach visual screenshot proof in [Issue #48 Comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48#issuecomment-6706622137).
- [x] Merge [PR #46](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/46) into `main` and publish live GitHub Pages links.

### 2. Sumit Adhikari (`@adronnie`) — Slice 1 (Database & Supabase Stewardship)

### 3. Prabin Rai (`@RaiPrabin697`) — Slice 2 (Automated Functional Testing)


### 4. Prince Karki (`@princekark`) — Slice 3 (Authentication & E2E Testing)

### 5. J.N. Taj Oli (`@jn-oli`) — Slice 4 (UI/UX & Frontend Responsiveness)
- [x] Keep the sidebar theme button visible (`3416d3b`).
- [x] Add and run `npm test` for the light/dark toggle (`ba4e592`). Result: PASS, 4 files, 18 tests, 6 theme checks, on 2026-11-09.
- [x] Record the result in [`THEME_TOGGLE_VERIFICATION.md`](THEME_TOGGLE_VERIFICATION.md).
- [ ] Capture desktop and mobile screenshots of light and dark mode.
- [ ] Check navigation across `#dashboard`, `#tasks`, `#subjects`, `#analytics`, and `#quiz`.
---

## 6. Blockers, Risks, and Decision Record

### Blockers / Risks
| Blocker / Risk | Owner | Next Action |
|---|---|---|
| Live Supabase Cloud vs. Local Preview Mode distinction | Sumit (`@adronnie`) & Nabin (`@liftupkhadka555-spec`) | Keep Local Preview Mode (used when `.env` credentials are not injected in static GitHub Pages) clearly distinguished from live Supabase PostgreSQL / RLS checks in test reports. |
| Independent peer verification required for "Exceeds" rubric | All Team 5 Members | Each member must execute one peer check of their partner's slice (Sumit ↔ Nabin, Prabin ↔ Prince, JN Taj → Nabin) as defined in [`docs/week_10/Slice.md`](Slice.md). |

### Decision Record
| Decision | Why We Chose It | Owner | Evidence / Issue Link |
|---|---|---|---|
| Dedicated `#analytics` view with real-time task calculations | Provides students immediate visual feedback on completion rate, 7-day study consistency,overdue workload, and per-subject progress without external chart library overhead. | Nabin Khadka (`@liftupkhadka555-spec`) | [Issue #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48), [PR #46](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/46) |
| Multi-tier Academic Hierarchy (`Country → University → Faculty → Major`) + Scrollable Subject Picker | Replaces static subject dropdowns so students from South Korea (Ulsan College), South Asia, and global universities can filter and enroll in multiple courses cleanly. | Nabin Khadka (`@liftupkhadka555-spec`) | [`src/lib/academic-catalog.js`](../../src/lib/academic-catalog.js), [Issue #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48) |
| Host live static build on GitHub Pages (`/public/`) | Enables teammates and instructors to test the latest merged `main` branch online via direct browser links without local setup barriers. | Nabin Khadka (`@liftupkhadka555-spec`) | [Live App Dashboard](https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html) |

---

## 7. Next Week's Bridge Task (Week 11 Preparation)

planning is going to finish the back end as much as possible


