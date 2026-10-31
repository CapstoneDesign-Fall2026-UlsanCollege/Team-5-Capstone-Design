# Database Test and Validation Report

Project: Smart Study Companion  
Team: Team 5  
Course: Capstone Design — Fall 2026  
Date: 2026-10-31  
Status: Formal database review based on repository implementation

---

## 1. Introduction

This document presents the database test and validation report for the Smart Study Companion project developed by Team 5. The review is based on the existing repository code and migration files, rather than on earlier design drafts alone.

The purpose of this report is to verify whether the database design supports the project’s full-stack login, signup, study management, and quiz features, and whether the implementation is structurally sound, secure, and aligned with the actual application code.

---

## 2. Objective

The objectives of this database review are to:

- verify the schema used by the application
- validate the login and signup architecture against the code
- inspect the student profile, subject, task, and quiz data models
- check foreign key relationships and access control
- identify gaps between the design documentation and the implemented code
- provide a formal assessment and recommendations for improvement

---

## 3. Scope of Review

The following project artifacts were reviewed as the source of truth:

- `README.md`
- `src/lib/supabase.js`
- `src/services/auth.js`
- `src/services/profile.js`
- `src/services/tasks.js`
- `src/services/subjects.js`
- `src/services/quiz.js`
- `src/auth-guard.js`
- `public/auth/login.html`
- `public/auth/signup.html`
- `public/auth/auth-init.js`
- `public/index.html`
- `public/app.js`
- `supabase/migrations/001_profiles.sql`
- `supabase/migrations/002_subjects.sql`
- `supabase/migrations/003_tasks.sql`
- `supabase/migrations/004_quiz_questions.sql`
- `supabase/migrations/005_quiz_attempts.sql`
- `supabase/migrations/006_rls_policies.sql`

---

## 4. Current Implementation Architecture

The repository shows a completed migration from the earlier local prototype model to a Supabase-based full-stack architecture.

### 4.1 Authentication layer

The implemented system uses:
- Supabase Auth for login and signup
- `auth.users` as the primary authentication identity
- a separate `profiles` table linked to `auth.users(id)`

This is the recommended design for a modern full-stack application because it separates:
- authentication concerns
- app-user profile data
- domain data such as tasks and quiz records

### 4.2 App data layer

The application stores core features in PostgreSQL tables hosted by Supabase:
- `profiles`
- `subjects`
- `student_subjects`
- `tasks`
- `quiz_questions`
- `quiz_attempts`
- `quiz_responses`

This structure supports the project’s actual use case: a student registers an account, selects subjects, creates study tasks, and records quiz attempts.

---

## 5. Schema Validation Results

### 5.1 Profile table (`profiles`)

Source: `supabase/migrations/001_profiles.sql`

The schema defines:

```sql
CREATE TABLE IF NOT EXISTS profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Validation:
- correct use of `UUID` as primary key
- correct foreign key reference to `auth.users(id)`
- automatic creation of user profile via trigger after signup
- profile row is linked directly to the authenticated identity

Assessment: Pass

### 5.2 Subject and enrollment tables (`subjects`, `student_subjects`)

Source: `supabase/migrations/002_subjects.sql`

The schema defines:
- `subjects` as the catalog of academic subjects
- `student_subjects` as the many-to-many relationship between students and subjects

Validation:
- unique subject slug reduces duplication
- `student_subjects` enforces uniqueness of `(student_id, subject_id)`
- both tables use proper `UUID` keys and foreign key rules
- subject seed data contains the 5 default CS subjects

Assessment: Pass

### 5.3 Task table (`tasks`)

Source: `supabase/migrations/003_tasks.sql`

The schema defines:

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id  UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title       TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 500),
    deadline    TIMESTAMPTZ NOT NULL,
    completed   BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Validation:
- task belongs to one student and one subject
- deadline and completion status are included
- update timestamp is managed automatically
- indexes exist for search and filtering by student, subject, deadline, and completion

Assessment: Pass

### 5.4 Quiz question table (`quiz_questions`)

Source: `supabase/migrations/004_quiz_questions.sql`

The table stores the question bank, the multiple choice answers, and the correct answer index.

Validation:
- subject-linked question bank is properly organized
- array of options uses JSONB
- each question belongs to a valid subject
- a full set of subject-based questions is seeded into the database

Assessment: Pass for MVP structure

### 5.5 Quiz attempts and responses

Source: `supabase/migrations/005_quiz_attempts.sql`

The schema defines:
- `quiz_attempts` for one record per student attempt
- `quiz_responses` for per-question answers within each attempt

Validation:
- attempt data is separated from question bank data
- response records can be reconstructed into a full attempt summary
- lifecycle is consistent with the UI’s quiz result flow

Assessment: Pass

---

## 6. Full-Stack Logic Validation

### 6.1 Login and signup flow

The implemented login and signup flow is in:
- `public/auth/login.html`
- `public/auth/signup.html`
- `public/auth/auth-init.js`
- `src/services/auth.js`

Validation:
- signup calls `supabase.auth.signUp()`
- login calls `supabase.auth.signInWithPassword()`
- password reset and update are implemented through Supabase Auth APIs
- protected pages are redirected using `src/auth-guard.js`

Result:
- the app uses a real authentication system instead of a local-only mock flow
- the flow is consistent with a full-stack application architecture

Assessment: Pass

### 6.2 Session and route protection

Source: `src/auth-guard.js`

This file checks whether a valid Supabase session exists before allowing access to protected pages.

Validation:
- logged-out users are redirected to login
- logged-in users are redirected away from auth pages
- auth state changes are monitored

Assessment: Pass

### 6.3 Student profile handling

Source: `src/services/profile.js`

This service provides:
- `getProfile()`
- `upsertProfile()`
- `updateDisplayName()`

Validation:
- profile record is created and updated safely
- profile is attached to the authenticated account
- UI reads the display name and email from the current Supabase user and profile

Assessment: Pass

### 6.4 Task operations

Source: `src/services/tasks.js`

The service supports:
- create task
- update task
- toggle completion
- delete task
- fetch tasks by student and subject

Validation:
- all operations are connected to the `tasks` table
- subject and student ownership are enforced by RLS
- task list is consistent with the application dashboard

Assessment: Pass

### 6.5 Quiz recording flow

Source: `src/services/quiz.js` and `public/app.js`

The app:
- loads quiz questions by subject
- displays question options
- records each quiz attempt in `quiz_attempts`
- saves individual selected answers in `quiz_responses`

Validation:
- this is a valid tracking design for educational assessment
- the architecture matches the quiz performance feature set of the app

Assessment: Pass for function and modeling

---

## 7. Security and Data Integrity Review

### 7.1 Foreign key integrity

The migration files show proper foreign key usage:
- `profiles.id` → `auth.users.id`
- `tasks.student_id` → `profiles.id`
- `tasks.subject_id` → `subjects.id`
- `quiz_questions.subject_id` → `subjects.id`
- `quiz_attempts.student_id` → `profiles.id`
- `quiz_responses.attempt_id` → `quiz_attempts.id`

This ensures referential integrity and prevents orphan data.

Assessment: Pass

### 7.2 Row Level Security

Source: `supabase/migrations/006_rls_policies.sql`

RLS is enabled on all relevant tables.

Examples:
- `profiles_select_own`
- `tasks_select_own`
- `student_subjects_select_own`
- `quiz_attempts_select_own`
- `quiz_responses_select_own`

This ensures users can only access their own data.

Assessment: Pass

### 7.3 Security concern: quiz answer exposure

The policy for `quiz_questions` currently allows authenticated users to read the table and the data includes `correct_answer`.

This is not ideal for a production-grade application because:
- the client can see the correct answers
- quiz scoring is effectively readable in the database layer
- answer checking should ideally happen on the server side

This is the main security issue identified in the current implementation.

Severity: Medium

Recommendation:
- keep the question bank public only if it is intentional for demo use
- for production, separate the answer key from the public question bank or protect it through server-side scoring logic

---

## 8. Documentation and Implementation Alignment Review

The repository contains both:
- current implementation files using Supabase Auth and PostgreSQL
- older design documents suggesting different models, especially in `docs/week8/database_login & signup.md`

This creates documentation drift.

Examples of outdated or legacy documentation:
- custom `users` table design
- `user_sessions` table
- `password_reset_tokens` model

These ideas are not reflected in the actual implementation. In the current codebase, the app uses `auth.users` and `profiles` instead.

Assessment: Needs documentation correction

---

## 9. Findings Summary

| Category | Result | Comment |
|---|---|---|
| Authentication model | Pass | Supabase Auth is correctly implemented |
| User profile model | Pass | `profiles` table correctly links to `auth.users` |
| Task schema | Pass | Good for deadline-based study planning |
| Subject enrollment model | Pass | Good many-to-many design |
| Quiz tracking model | Pass | Good structure for attempts and responses |
| Row Level Security | Pass | Proper ownership enforcement |
| Security hardening | Needs improvement | `correct_answer` exposure should be reviewed |
| Documentation alignment | Needs update | Older docs do not match implemented architecture |

---

## 10. Formal Risk Assessment

### Risk Level Summary

| Risk | Severity | Description |
|---|---|---|
| Exposed answer keys in quiz questions | Medium | The client can read correct answers from the database |
| Documentation drift | Medium | Older docs may mislead future developers |
| Limited profile metadata | Low | Current MVP schema is small but extendable |

Overall assessment: The database design is appropriate for the project scope and functional requirements, but it should be hardened before final production deployment.

---

## 11. Recommended Improvements

1. Harden quiz scoring logic
   - do not expose `correct_answer` directly to the frontend
   - move answer validation to a secure backend or Supabase function

2. Align documentation with implementation
   - remove or relabel legacy auth design docs
   - clearly document that the live app uses Supabase Auth and `profiles`

3. Expand profile metadata if needed
   - add fields such as major, year, university, or semester if the app evolves beyond MVP

4. Keep schema versioning clean
   - continue using migration files as the source of truth for schema changes

5. Add automated database checks
   - include SQL validation checks in CI pipelines for schema and constraints

---

## 12. Final Conclusion

The Team 5 Smart Study Companion project uses a valid and practical full-stack database design based on Supabase PostgreSQL and Supabase Auth. The schema correctly supports the project goals: student login and signup, subject management, study task tracking, and quiz attempt recording.

The design is structurally sound, the relationships are logically correct, and the RLS policies provide proper student-level isolation. The strongest aspect of the design is that it matches the real app functionality and supports the product vision of a modern study planner and quiz tracker.

The main concern is not the overall architecture, but a need for better security hardening around quiz question answer exposure and documentation consistency. Once those two issues are addressed, the database model will be a strong foundation for a more mature and production-ready product.

---

## 13. Approval Status

Approved for current MVP evaluation: Yes  
Recommended for production refinement: Yes  

This database design is suitable for the Team 5 capstone implementation and demonstrates a sound full-stack approach aligned with the actual codebase.

---

End of report.
