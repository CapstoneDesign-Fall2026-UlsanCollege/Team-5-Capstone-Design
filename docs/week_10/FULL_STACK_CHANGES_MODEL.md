# Week 10 Full-Stack Changes & Total Files Model

**Project:** Smart Study Companion  
**Team:** Team 5 — Capstone Design, Fall 2026 (Ulsan College)  
**Author:** Nabin Khadka (`@liftupkhadka555-spec`)  
**Week:** 10 (Comparison: Week 9 [PR #41](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/41) → Week 10 [PR #46](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/pull/46))  
**Date:** 2026-11-07  
**Related Issue:** [Issue #48](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48)

---

## 1. Total Files Model (Week 10 Full-Stack Architecture Tree)

The diagram below shows every file added or updated across the Frontend, Authentication Pages, Backend Services, Academic Catalog, Database Migrations, and Automated Test Suite in Week 10:

```text
Team-5-Capstone-Design/
├── index.html                                  [UPDATED] 5-view SPA shell (#dashboard, #tasks, #subjects, #analytics, #quiz)
├── app.js                                      [UPDATED] Analytics engine, academic hierarchy, scrollable subject picker
├── styles.css                                  [UPDATED] Analytics charts, scrollable subject grid, light/dark theme layout
├── public/
│   ├── index.html                              [UPDATED] Public build of 5-view SPA shell with #analytics & #subjects
│   ├── app.js                                  [UPDATED] Subpath-safe ESM imports (./src/...) for GitHub Pages hosting
│   ├── styles.css                              [UPDATED] Responsive layout & analytics/onboarding component styles
│   ├── auth/
│   │   ├── signup.html                         [UPDATED] Fixed Region/Country -> University dropdown & post-signup redirect
│   │   ├── login.html                          [UPDATED] Session restore & smart routing (#subjects vs #dashboard)
│   │   ├── forgot-password.html                [UPDATED] Sends recovery code/link & links directly to 6-digit OTP entry
│   │   ├── reset-password.html                 [UPDATED] Dual password reset: 6-digit OTP verification + recovery link
│   │   ├── verify.html                         [UPDATED] Auto-detects email verification session & routes to onboarding
│   │   └── auth-init.js                        [UPDATED] Shared auth controller, OTP handler, and university selector fix
│   └── src/                                    [SYNCED]  Browser ES Module mirror for static/GitHub Pages hosting
│       ├── lib/
│       │   ├── academic-catalog.js             [NEW]     5-tier hierarchy (Country -> University -> Faculty -> Major -> Subjects)
│       │   ├── regional-catalog.js             [UPDATED] Backward-compatible regional university & subject helper exports
│       │   └── supabase.js                     [SYNCED]  Supabase client + Local Preview Mode fallback detector
│       └── services/
│           ├── auth.js                         [UPDATED] Added verifyOtp(), resendVerificationEmail(), & OTP preview support
│           ├── profile.js                      [UPDATED] Added upsertProfile() with country, university, faculty, major, onboarding_completed
│           ├── subjects.js                     [UPDATED] Added saveStudentSubjects() for multi-select subject enrollment
│           ├── tasks.js                        [SYNCED]  Task CRUD service supporting analytics calculations
│           └── quiz.js                         [SYNCED]  Quiz bank & attempt persistence service
├── src/
│   ├── lib/
│   │   ├── academic-catalog.js                 [NEW]     Core 5-tier Academic Catalog & searchSubjects() filter engine
│   │   └── regional-catalog.js                 [UPDATED] Re-exports hierarchy helpers for compatibility
│   └── services/
│       ├── auth.js                             [UPDATED] Core Auth service with 6-digit OTP verification (verifyOtp)
│       ├── profile.js                          [UPDATED] Profile persistence for academic hierarchy & onboarding flag
│       └── subjects.js                         [UPDATED] Student subject enrollment persistence
├── supabase/
│   └── migrations/
│       └── 007_universities.sql                [UPDATED] Adds country, university, faculty, major, onboarding_completed to profiles
├── tests/
│   └── run_tests.py                            [UPDATED] Expanded from 6 to 7 automated check groups (all 7/7 PASS)
└── docs/
    └── week_10/
        ├── Slice.md                            [NEW]     Week 10 "Own a Slice, Steward an Area" team plan
        ├── weekly-report.md                    [NEW]     Week 10 Team 5 report & member contribution table
        ├── FULL_STACK_CHANGES_MODEL.md         [NEW]     This total files model & Week 9 vs. Week 10 comparison
        ├── study-analytics-dashboard.png       [NEW]     Verified screenshot of #analytics view
        └── subjects-university-selector.png    [NEW]     Verified screenshot of #subjects view
```

---

## 2. File-by-File Model of Changes (Week 9 vs. Week 10)

| File Path | Layer | Previous Week (Week 9) | Current Week (Week 10) |
|---|---|---|---|
| [`src/lib/academic-catalog.js`](../../src/lib/academic-catalog.js)<br>[`public/src/lib/academic-catalog.js`](../../public/src/lib/academic-catalog.js) | **Catalog / Data Model** | Did not exist; courses were limited to 5 static CS subjects and `universitiesFor` export was missing. | **New File:** Defines `COUNTRIES`, `UNIVERSITIES_BY_COUNTRY` (including South Korea / Ulsan College, South Asia / Nepal / India, USA, UK, Japan, Australia, Germany, Canada), `FACULTIES`, `MAJORS_BY_FACULTY`, `SUBJECTS_CATALOG` (15+ subjects), `getUniversities()`, `universitiesFor()`, and `searchSubjects()`. |
| [`public/auth/signup.html`](../../public/auth/signup.html)<br>[`public/auth/auth-init.js`](../../public/auth/auth-init.js) | **Frontend Auth & Onboarding** | Selecting a Region/Country failed to populate the University dropdown; after signup, routing did not check onboarding completion. | Fixed `universitiesFor` ES module import so selecting any Region/Country immediately populates the University dropdown; auto-logs in after signup and routes to `#subjects` if `onboarding_completed` is `false`, or `#dashboard` if `true`. |
| [`public/auth/forgot-password.html`](../../public/auth/forgot-password.html)<br>[`public/auth/reset-password.html`](../../public/auth/reset-password.html)<br>[`src/services/auth.js`](../../src/services/auth.js) | **Auth / Password Recovery** | Only supported link-based password reset; failed if the email link was opened in a different browser tab/context. | Added **dual recovery support**: students can verify a **6-digit OTP code (`verifyOtp`)** directly on `reset-password.html` OR use the email recovery link token (`#access_token` / `?code`). |
| [`public/auth/verify.html`](../../public/auth/verify.html) | **Auth / Email Verification** | Static verification notice without session token detection. | Automatically detects Supabase verification tokens or active sessions and redirects the student to onboarding (`#subjects`) or `#dashboard`. |
| [`public/index.html`](../../public/index.html)<br>[`index.html`](../../index.html) | **Frontend Views (HTML)** | Had 4 views without a dedicated Study Task Analytics view or multi-tier academic onboarding card. | Added 5th navigation view **Study Analytics (`#analytics`)** and redesigned **Subjects & University (`#subjects`)** with cascading dropdowns, search input, category filter chips, scrollable subject grid, and sticky save bar. |
| [`public/app.js`](../../public/app.js)<br>[`app.js`](../../app.js) | **Frontend Controller & Analytics Engine** | Basic dashboard counters only; duplicate event listener bug on university dropdown; relative imports (`../src/...`) broke on GitHub Pages subpaths. | Added `renderAnalytics()` engine (Total, Completed, Pending, Overdue, Completion `%` ring, 7-day weekly activity bar chart, subject-wise progress bars, upcoming deadlines), fixed `initAcademicHierarchy()`, and updated ESM imports to `./src/...`. |
| [`public/styles.css`](../../public/styles.css)<br>[`styles.css`](../../styles.css) | **UI / Styling & Theme** | Basic dashboard styles only. | Added CSS grid/flex rules for `#view-analytics`, 7-day bar chart columns, workload progress bars, `.subjects-scroll-container` (`max-height: 440px`), `.subject-select-card`, and `.subjects-sticky-footer` across Light and Dark modes. |
| [`src/services/profile.js`](../../src/services/profile.js)<br>[`public/src/services/profile.js`](../../public/src/services/profile.js) | **Backend Profile Service** | Stored only `id` and `full_name`. | Added `upsertProfile()` and full read/write support for `country`, `university`, `faculty`, `major`, and `onboarding_completed` in both Supabase PostgreSQL and Local Preview Mode. |
| [`src/services/subjects.js`](../../src/services/subjects.js)<br>[`public/src/services/subjects.js`](../../public/src/services/subjects.js) | **Backend Subject Service** | Fetched default subjects only. | Added `saveStudentSubjects(studentId, subjectSlugs)` to persist multi-selected subjects in `student_subjects` and sync with task/quiz dropdowns. |
| [`supabase/migrations/007_universities.sql`](../../supabase/migrations/007_universities.sql) | **Database Schema (PostgreSQL)** | Only added basic `country` and `university` columns. | Added `faculty`, `major`, and `onboarding_completed BOOLEAN DEFAULT false` to `public.profiles`, updated `public.handle_new_user()` trigger, and created `idx_profiles_country_university`. |
| [`tests/run_tests.py`](../../tests/run_tests.py) | **Automated QA & Verification** | 6 check groups covering initial schema and basic auth files. | Expanded to **7 check groups** verifying `academic-catalog.js`, `007_universities.sql` columns, `verifyOtp`, `#analytics` DOM elements, and scrollable `#subjects` onboarding (`7/7 PASSED`). |

---

## 3. Detailed Breakdown of the 5 Full-Stack Upgrades in Week 10

### Upgrade 1 — Authentication, Onboarding Redirect & 6-Digit OTP Password Reset
- **Signup & Login Flow (`signup.html`, `login.html`, `auth-init.js`):**
  - Fixed the Region/Country → University cascading selector on `signup.html`.
  - After signup or login, the app checks `profile.onboarding_completed`:
    - If `false` → redirects to `index.html#subjects` so the student selects their University, Faculty, Major, and Subjects.
    - If `true` → redirects directly to `index.html#dashboard`.
- **Password Recovery (`forgot-password.html`, `reset-password.html`, `src/services/auth.js`):**
  - Added `verifyOtp({ email, token, type: 'recovery' })` alongside URL token detection so students can reset their password using either a **6-digit recovery code** or an **email reset link**.

### Upgrade 2 — Study Task Analytics & Workload Breakdown (`#analytics`)
- **Real-Time Metrics:** Calculates **Total Tasks**, **Completed Tasks**, **Pending Tasks**, **Overdue Tasks**, and **Completion Percentage (`%`)** directly from the authenticated student's tasks.
- **7-Day Weekly Activity Chart:** Groups completed tasks by day of the week over the last 7 days (`Sun`–`Sat`) and renders dynamic vertical bar heights.
- **Workload Breakdown & Subject-Wise Progress Bars:** Displays visual progress bars for Completed/Pending/Overdue ratios and individual completion percentages (`completed/total`) for each enrolled subject.
- **Upcoming Deadlines Timeline:** Sorts pending tasks chronologically and highlights overdue or due-soon tasks.

### Upgrade 3 — Multi-Tier Academic Hierarchy & Scrollable Subject Onboarding (`#subjects`)
- **5-Tier Hierarchy (`src/lib/academic-catalog.js`):**
  $$\text{Country / Region} \rightarrow \text{University / College} \rightarrow \text{Faculty / School} \rightarrow \text{Department / Major} \rightarrow \text{Subjects}$$
- **Scrollable Subject Picker (`public/index.html`, `public/styles.css`):**
  - Scrollable container (`max-height: 440px`) with clickable multi-select subject cards.
  - Live keyword search bar + category filter chips (`All Subjects`, `Core CS`, `Software Dev`, `AI & Data`, `Mathematics`, `Projects`).
  - Live selected count badge (`3 subjects selected`) and sticky **Save & Continue to Dashboard** footer button.

### Upgrade 4 — Database Migration & Service Layer Synchronization (`007_universities.sql`)
- Extended `public.profiles` in PostgreSQL with `country`, `university`, `faculty`, `major`, and `onboarding_completed`.
- Updated `public.handle_new_user()` trigger so metadata submitted during `supabase.auth.signUp()` is automatically written to `public.profiles`.
- Synchronized `src/services/*` and `public/src/services/*` so both Vite builds and static GitHub Pages deployments run identical code.

### Upgrade 5 — Live GitHub Pages Deployment & Visual Evidence
- Updated ESM import paths in `public/app.js` and enabled **GitHub Pages** on `main` (`https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html`).
- Recorded visual verification screenshots in [`docs/week_10/study-analytics-dashboard.png`](study-analytics-dashboard.png), [`docs/week_10/subjects-university-selector.png`](subjects-university-selector.png), and [Issue #48 Comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/48#issuecomment-6706622137).

### Upgrade 6 — Dynamic Faculty & Major Subject Curriculum & Adaptive Quiz Bank Engine
- **Full Faculty & Major Curriculum Mapping (`data/academic-catalog.json`, `src/lib/academic-catalog.js`):**
  - Expanded catalog to 32 accredited subjects across all 4 faculties (`Faculty of Computer Science & Information Technology`, `Faculty of Engineering & Technology`, `Faculty of Science & Mathematics`, `Faculty of Business & Management Studies`) and 15 majors.
  - Defined explicit `core` and `electives` mapping per major.
  - Dynamic subject filtering: Selecting a faculty and major automatically filters and displays the exact accredited curriculum for that degree program, displaying `CORE` and `ELECTIVE` badges on cards.
  - Active curriculum banner with real-time enrolled counters and a one-click `Select All Core` quick-enroll action.
- **Adaptive Major-Aware Quiz Practice Engine (`data/quiz-bank.json`, `src/services/quiz.js`, `public/app.js`):**
  - Expanded the quiz bank to 345 verified multiple-choice questions across all 32 subjects (15 questions for core CS subjects, 10 questions for each of the 27 new engineering, science, and business subjects).
  - Dynamically populates `#quiz-subject` dropdown grouped by:
    1. *My Enrolled Subjects* (user's active courses)
    2. *Curriculum for [Selected Major]* (core and elective courses of current program)
    3. *All Other University Subjects* (full institution catalog)
  - Updated quiz headings dynamically to reflect chosen degree program and university (`Quiz Practice for [Major] — [University]`).
- **PostgreSQL Database Migration (`supabase/migrations/008_major_subjects_quiz_bank.sql`):**
  - Created `public.major_subjects` junction table mapping university majors to subjects with course type (`core` vs `elective`) and semester recommendations.
  - Upserted all 32 subjects into `public.subjects` with canonical slugs and icons.
  - Seeded all 345 multiple-choice questions into `public.quiz_questions` with 4 options and 0-based answer keys.
  - Enforced Row Level Security (RLS) with public read access on `major_subjects` and authenticated attempt recording.
- **Build Pipeline & Test Coverage (`scripts/build_academic_data.py`, `tests/run_tests.py`):**
  - Added single-source JSON generator script that compiles JSON data into ES modules and SQL migrations.
  - Expanded automated test suite from 7 to 8 complete test groups verifying schema, catalogs, RLS, and quiz questions.

