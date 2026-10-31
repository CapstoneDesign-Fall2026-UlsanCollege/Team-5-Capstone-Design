# Week 9 — Database Model Check Report

**Project:** Smart Study Companion  
**Team:** Team 5  
**Course:** Capstone Design — Fall 2026  
**Date:** 2026-10-31  
**Status:** Verified against the current repo implementation  
**Owner:** Adronnie

---

## 1. Objective

This report reviews the current database model and full-stack flow for the app’s login, signup, and main application features. The review is based on the actual repository code and migration files in the current project state, not only on the older planning documents.

Scope reviewed:
- Login and signup flow
- Supabase authentication setup
- Protected app route logic
- Student profile model
- Subject/task database model
- Quiz data model and scoring flow
- Row Level Security (RLS) policy design
- Documentation consistency with implementation

---

## 2. Review method

The following project files were checked as the source of truth:

- `README.md`
- `public/auth/login.html`
- `public/auth/signup.html`
- `public/auth/auth-init.js`
- `public/index.html`
- `public/app.js`
- `src/services/auth.js`
- `src/services/profile.js`
- `src/services/tasks.js`
- `src/services/subjects.js`
- `src/services/quiz.js`
- `src/lib/supabase.js`
- `src/auth-guard.js`
- `supabase/migrations/001_profiles.sql`
- `supabase/migrations/002_subjects.sql`
- `supabase/migrations/003_tasks.sql`
- `supabase/migrations/004_quiz_questions.sql`
- `supabase/migrations/005_quiz_attempts.sql`
- `supabase/migrations/006_rls_policies.sql`

---

## 3. Executive summary

The database model is generally sound for the current MVP and matches the app’s purpose:
- student identity is handled through Supabase Auth
- the app stores student profile data in the `profiles` table
- subjects and enrollments are modeled cleanly
- tasks are tracked with deadlines and completion status
- quiz attempts and responses are tracked in a structured way
- RLS policies protect student-owned data from cross-user access

The project has already moved from an earlier local-only / custom-auth design toward a proper Supabase full-stack architecture. This is a positive change and aligns with the project description and app requirements.

The biggest concern is not the base design, but that the documentation still contains mixed legacy design ideas while the actual codebase uses Supabase Auth + PostgreSQL tables. This can confuse future contributors unless the docs are aligned.

---

## 4. Current implemented architecture

### 4.1 Authentication model

The live authentication flow uses Supabase Auth, not a custom login table.

Validated by:
- `src/services/auth.js`
- `public/auth/auth-init.js`
- `src/auth-guard.js`
- `src/lib/supabase.js`

The active flow is:
- `signUp()` → `supabase.auth.signUp()`
- `signIn()` → `supabase.auth.signInWithPassword()`
- `resetPassword()` → `supabase.auth.resetPasswordForEmail()`
- `updatePassword()` → `supabase.auth.updateUser()`
- session state checked through `getSession()`
- redirect logic enforced through `auth-guard`

This is considered a good architecture because:
- passwords are not stored in application tables
- email verification and password reset are handled by Supabase Auth
- session and identity management are centralized and safer than custom session logic

### 4.2 Profile model

The profile table is defined in `001_profiles.sql`:
- `profiles(id, full_name, created_at, updated_at)`
- `id` references `auth.users(id)`
- a trigger creates a profile automatically whenever a new auth user is created

This is a clean 1:1 model between authentication identity and app profile.

---

## 5. Database model check by domain

### 5.1 Profiles

Status: Good

Table: `profiles`

Fields:
- `id` (UUID, PK, auth user reference)
- `full_name`
- `created_at`
- `updated_at`

Assessment:
- correct for app identity
- easy to join with student-owned records
- minimal but sufficient for MVP

Issues:
- no extra student metadata yet (major, year, university, preferred subject, etc.)
- acceptable for MVP but should be extended if the product grows

### 5.2 Subjects and enrollment

Status: Good

Tables:
- `subjects`
- `student_subjects`

This is a suitable data model for a study planner because it separates:
- catalog of subjects
- student interest / enrollment

The subject catalog is seeded with the 5 default computer science subjects.

Assessment:
- appropriate for subject-based study tracking
- supports student personalization
- easy to expand later with course/semester metadata

### 5.3 Tasks

Status: Good

Table: `tasks`

Fields:
- `student_id`
- `subject_id`
- `title`
- `deadline`
- `completed`
- `created_at`
- `updated_at`

Assessment:
- matches the study-planner use case well
- correct for deadlines and completion tracking
- indexes are created for student and subject queries

This aligns with the app UI in `public/index.html` and `public/app.js`.

### 5.4 Quiz questions and attempts

Status: Good overall; one security concern

Tables:
- `quiz_questions`
- `quiz_attempts`
- `quiz_responses`

Assessment:
- clean separation between question bank and attempt history
- supports historical tracking of quiz results
- each response is recorded for per-question analysis

Concern:
- the RLS policy exposes `quiz_questions` to authenticated users, and the question row includes `correct_answer`
- this is acceptable for educational demo purposes, but it is not ideal for secure production scoring

Recommendation:
- separate quiz bank from scoring logic
- keep answer keys server-side or in a protected admin-only layer

---

## 6. RLS review

Status: Strong for a student app

The RLS policies in `006_rls_policies.sql` enforce ownership checks for private tables:
- `profiles` → student only
- `student_subjects` → student only
- `tasks` → student only
- `quiz_attempts` → student only
- `quiz_responses` → only for that student’s attempts

This is correct and prevents one user from seeing another user’s tasks or attempts.

The app also uses authenticated-user read access for public subject and quiz question data.

Security observation:
- subject catalog information can be read by authenticated users
- this is fine
- but client-side access to `correct_answer` is the weakest part of the current design

---

## 7. Login/signup flow review

### 7.1 Signup

The signup form is in `public/auth/signup.html` and wired in `public/auth/auth-init.js`.

It validates:
- full name length
- email format
- password length and complexity
- confirm password match
- terms acceptance

The app then calls `signUp()` from `src/services/auth.js`.

Assessment:
- good UI validation
- good front-end UX
- the flow is correct for typical auth integration

### 7.2 Login

The login form and flow are implemented in `public/auth/login.html` and `public/auth/auth-init.js`.

It validates:
- email syntax
- required password
- redirects authenticated users away from login pages

The app calls `supabase.auth.signInWithPassword()`.

Assessment:
- good implementation
- proper session-based protection

### 7.3 Protected app route

`src/auth-guard.js` ensures that protected pages redirect to login if there is no valid session.

This is a proper pattern and reduces unauthorized access to the dashboard.

---

## 8. Documentation vs implementation check

There is a clear mismatch between the older design docs and the real code.

### Legacy docs that describe a different model
- `docs/week8/database_login & signup.md`

That doc describes a custom database pattern with:
- `users`
- `user_sessions`
- `password_reset_tokens`

This does not match the actual live implementation, which uses:
- Supabase Auth
- `auth.users`
- `profiles`

### Current implementation is in the real app files
- `src/services/auth.js`
- `src/services/profile.js`
- `supabase/migrations/001_profiles.sql`

This means the project documentation is partially outdated. For maintainability, the team should align the docs with the actual implemented architecture.

---

## 9. Findings summary

| Area | Status | Finding |
|---|---|---|
| Login/signup | Pass | Auth flow is implemented with Supabase Auth and protected routes |
| User identity | Pass | `profiles` table correctly links to `auth.users` |
| Task model | Pass | Clean and matches the study planner needs |
| Subject model | Pass | Good subject catalog + enrollment design |
| Quiz model | Pass with caveat | Good tracking model; answer exposure should be hardened |
| RLS | Pass | Good ownership-based enforcement |
| Documentation consistency | Needs update | Older docs still describe a custom auth model |

---

## 10. Risks and recommendations

### Priority 1 — Quiz answer exposure

Recommendation:
- move grading logic to a backend or Supabase Edge function
- do not let browser clients read `correct_answer` freely

### Priority 2 — Documentation alignment

Recommendation:
- update older auth/database docs to clearly state that the app uses Supabase Auth and `profiles`
- remove or clearly label old design documents as drafts or legacy notes

### Priority 3 — Future student metadata

Recommendation:
- add fields like `major`, `student_year`, `university`, `semester`, `preferred_subjects` if the app evolves beyond MVP

---

## 11. Final assessment

Overall verdict: Acceptable and well-structured for the current MVP.

The current implementation demonstrates a strong full-stack architecture for a study companion app:
- secure auth flow
- logical and usable database schema
- ownership-based data isolation
- app data model aligned with business requirements

The model is not weak; it is simply in a transition state between older design documentation and the actual Supabase-based implementation. Once documentation is synchronized and quiz grading is hardened, the architecture becomes a solid foundation for the next stage of the product.

---

## 12. Conclusion

The Team 5 project is on the right direction for a real full-stack app. The database model is suitable for login, signup, task management, subject tracking, and quiz tracking. The main improvements needed are:
1. document alignment,
2. secure quiz grading,
3. further profile metadata when needed.

This is a healthy model for an MVP and a strong base for a final student study companion product.

---

## 13. Evidence summary

This report is based on the actual repository state, especially:
- `README.md`
- `supabase/migrations/*.sql`
- `src/services/*.js`
- `public/auth/*.html`
- `public/app.js`
- `src/auth-guard.js`

The implementation confirms the project already follows the full-stack Supabase model rather than the older custom session-based design described in some planning documents.

---

## 14. Owner note

This report is prepared for Week 9 review and is intended to support the team’s validation of the login/signup and app database model.

The current design is strong for an MVP and fits the app’s scope, with the above recommendations for security and documentation cleanup.

---

End of report.
