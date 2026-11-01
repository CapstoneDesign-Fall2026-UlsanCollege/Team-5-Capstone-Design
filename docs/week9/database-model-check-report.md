# Formal Technical Report: Smart Study Companion App

Project: Smart Study Companion  
Team: Team 5  
Course: Capstone Design — Fall 2026  
Date: 2026-11-01  
Status: Formal repository review and technical assessment

---

## 1. Executive Summary

This report provides a formal technical review of the Team 5 Capstone Design project, based on the repository implementation and code structure. The application is a university study-management web platform designed for students to manage subjects, tasks, deadlines, and quizzes through a secure authentication flow.

The project currently follows a modern full-stack architecture using:
- Supabase Auth for user authentication
- Supabase PostgreSQL for database storage
- Row Level Security (RLS) for per-user data isolation
- Vite for frontend build and local development
- Vitest for automated testing

The codebase demonstrates a clear separation between frontend logic, service layer, and backend data storage. It is structurally sound and suitable for an MVP/Capstone implementation, with a few production-hardening recommendations regarding security and documentation alignment.

---

## 2. Scope of Review

The assessment was conducted using the repository contents for Team 5, including the following key files and directories:

- `README.md`
- `package.json`
- `src/lib/supabase.js`
- `src/services/auth.js`
- `src/services/tasks.js`
- `src/services/subjects.js`
- `src/services/quiz.js`
- `src/auth-guard.js`
- `public/auth/auth-init.js`
- `public/app.js`
- `supabase/migrations/001_profiles.sql`
- `supabase/migrations/002_subjects.sql`
- `supabase/migrations/003_tasks.sql`
- `supabase/migrations/004_quiz_questions.sql`
- `supabase/migrations/005_quiz_attempts.sql`
- `supabase/migrations/006_rls_policies.sql`

This review covers the implemented application architecture, backend service setup, package dependencies, data model, security, and overall technical quality.

---

## 3. Project Overview

The application is named Smart Study Companion and focuses on academic organization for university students. Its main features include:
- student account registration and login
- subject catalog and enrollment
- schedule/task management with deadlines
- quiz generation and attempt tracking
- profile management and session protection

The current repository structure reflects a conversion from a prototype/local-storage based implementation to a real full-stack system backed by Supabase.

---

## 4. Application Architecture

The project is organized into three key layers:

### 4.1 Frontend Layer
The frontend is built using standard web technologies:
- HTML5
- CSS3
- Vanilla JavaScript (ES Modules)

The repository includes:
- `public/index.html` for dashboard flow
- `public/auth/login.html` and `public/auth/signup.html` for authentication UI
- `public/app.js` for app behavior and UI interactions
- `src/auth-guard.js` for route protection

This approach keeps the app lightweight and simple while still supporting a full-stack architecture through Supabase.

### 4.2 Service Layer
The application introduces a structured service layer under `src/services/`:
- `auth.js` — handles Supabase Auth
- `profile.js` — manages student profile operations
- `tasks.js` — CRUD for study tasks
- `subjects.js` — subject catalog and enrollment logic
- `quiz.js` — quiz question fetching and result tracking

This organization improves code readability and keeps data access logic separate from UI code.

### 4.3 Backend Layer
The backend is implemented using Supabase:
- Supabase Auth handles identity and security
- Supabase PostgreSQL stores all application records
- RLS policies restrict each student to their own records
- SQL migration files define the schema and database logic

This is a modern and appropriate architecture for a capstone project.

---

## 5. Supabase Backend Review

### 5.1 Supabase Client Setup
The project initializes the Supabase client in `src/lib/supabase.js`.

Key code behavior:
- imports `createClient` from `@supabase/supabase-js`
- reads environment variables from Vite config:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- enables automatic token refresh and session persistence

This setup is correct for a frontend-first application using Supabase Auth and RLS.

### 5.2 Authentication Flow
The authentication logic is centralized in `src/services/auth.js`.

Implemented operations include:
- `signUp()` for registration
- `signIn()` for user login
- `signOut()` for session termination
- `resetPassword()` for password recovery
- `updatePassword()` for resetting a new password
- `resendVerification()` for email confirmation
- `getSession()` and `onAuthStateChange()` for auth monitoring

This follows secure and standard Supabase patterns.

### 5.3 Route Protection
The application protects pages using `src/auth-guard.js`.

It performs the following checks:
- if a user is not logged in and attempts to access a protected page, redirect to login
- if a logged-in user visits auth pages, redirect to the dashboard
- listen for auth lifecycle changes and redirect accordingly

This is an effective client-side access-control pattern for a browser-based app.

### 5.4 Database Schema
The backend uses the following main tables defined by migration files:

1. `profiles`
   - stores student profile information
   - linked to `auth.users(id)`
   - automatically created via trigger on signup

2. `subjects`
   - catalog of academic subjects
   - seeded with default Computer Science subjects

3. `student_subjects`
   - many-to-many mapping between students and subjects
   - prevents duplicate enrollment

4. `tasks`
   - stores each student’s study tasks
   - support title, subject, deadline, completion, timestamps

5. `quiz_questions`
   - holds the question bank for all subjects
   - includes multiple-choice options and correct answer data

6. `quiz_attempts`
   - stores a student’s quiz attempt summary
   - tracks score and completion time

7. `quiz_responses`
   - stores each selected answer per attempt

This is a practical data model for the project’s educational workflow.

### 5.5 Row Level Security (RLS)
The migration file `006_rls_policies.sql` enforces strong ownership-based database access.

Examples:
- `profiles_select_own` allows students to read only their own profile
- `tasks_select_own` allows students to access only their own tasks
- `quiz_attempts_select_own` restricts attempts to the same student
- `student_subjects_select_own` prevents cross-user enrollment data exposure

This is a strong backend design feature and demonstrates awareness of secure application development.

---

## 6. Packages and Dependencies Used

The project dependency list is defined in `package.json`.

### 6.1 Runtime Dependencies
- `@supabase/supabase-js` — official Supabase JavaScript SDK for authentication, database access, and session management

### 6.2 Development Dependencies
- `vite` — frontend build tool and local dev server
- `vitest` — JavaScript test runner for unit and validation tests

### 6.3 Project Scripts
The package contains the following scripts:
- `npm run dev` — start Vite development server
- `npm run build` — production build
- `npm run preview` — preview build locally
- `npm test` — run Vitest
- `npm run test:e2e` — Playwright-based end-to-end testing

### 6.4 Package Summary
The project is intentionally lightweight. It avoids heavy frontend frameworks, which is consistent with the decision to use simple HTML/CSS/JS for an academic MVP. The use of Supabase provides essential backend infrastructure without introducing a large server-side codebase.

---

## 7. Code Review Findings by Module

### 7.1 `src/services/auth.js`
This file is well structured and correctly wraps Supabase Auth APIs. It supports the registration, sign-in, sign-out, password reset, and email verification lifecycle. The service abstraction is good for maintainability.

### 7.2 `src/services/tasks.js`
This module implements a clean CRUD pattern for student tasks. It allows creating, updating, toggling completion, and deleting tasks. The queries are tied to the current student ID and the subject relationship, which matches the database design.

### 7.3 `src/services/subjects.js`
This module handles the subject catalog and student enrollment relationship. It uses `student_subjects` and ensures uniqueness using `upsert` with a conflict policy. This is an appropriate design for academic subject selection.

### 7.4 `src/services/quiz.js`
This module handles quiz question selection and attempt persistence. It fetches questions by subject, shuffles them, and saves quiz attempts and responses to backend tables. The architecture is suitable for educational assessment and progress tracking.

### 7.5 `public/auth/auth-init.js`
This file is the front-end form controller for all authentication pages. It validates email and password inputs, handles error states, and communicates with Supabase services. The code is user-friendly and consistent with modern web form patterns.

### 7.6 `src/auth-guard.js`
This module provides route-based protection for the application. It prevents unauthorized access on protected pages and prevents already-authenticated users from re-entering auth screens. This is a practical implementation for a small full-stack app.

---

## 8. Security Analysis

### Strengths
- Supabase Auth is used instead of a custom user-password system
- `profiles` table is linked to `auth.users`
- RLS policies protect user-owned records
- database constraints and foreign keys are used properly
- session persistence and auth state monitoring are enabled

### Security Observation
The current implementation exposes `correct_answer` in the `quiz_questions` table and allows authenticated users to read the question bank. This is not ideal for a production-grade application because the client can read the answer key directly from the database.

This represents the main technical risk in the app.

### Recommendation
For future production readiness, the answer key should be protected or evaluated on the server side using a secure backend function or an edge function instead of returning `correct_answer` to the client.

---

## 9. Technical Strengths

The app demonstrates several positive technical characteristics:
- organized service-based architecture
- use of cloud backend rather than browser-only storage
- proper database normalization
- clear migration-based database evolution
- secure ownership checks via Supabase RLS
- lightweight frontend stack appropriate for capstone work
- testable code structure with Vitest and validation scripts

---

## 10. Technical Risks and Recommendations

### 10.1 Quiz Security Risk
Risk: Medium  
Issue: `correct_answer` is exposed in `quiz_questions` and accessible to authenticated users.

Recommendation:
- Keep the public question bank only for demos
- Move answer validation to a secure backend or edge function
- Restrict access to answer keys from the client

### 10.2 Documentation Drift
Risk: Medium  
Issue: Some older documentation may not match the final Supabase-based implementation.

Recommendation:
- Align all documentation to the actual architecture
- Keep README and migration files as the primary source of truth

### 10.3 Production Hardening
Risk: Low to Medium  
Issue: The MVP is functional, but additional security and monitoring should be added before production deployment.

Recommendation:
- add CI checks for database migrations
- add automated tests for RLS and auth flows
- separate public demo data from production data

---

## 11. Final Assessment

The Team 5 Smart Study Companion project is a well-structured full-stack application using Supabase as the backend infrastructure. The overall architecture is coherent, practical, and suitable for the capstone project scope. The app successfully separates authentication, profile management, tasks, subjects, and quiz data into a clean service and database model.

The most important strengths are:
- real authentication via Supabase Auth
- relational database model with normalized tables
- secure policies using RLS
- proper management of user-specific resources
- lightweight and maintainable code structure

The primary issue to address before broader production deployment is the exposure of quiz answer keys. Once that concern is resolved, the app will be significantly stronger and more suitable for real-world academic usage.

---

## 12. Formal Conclusion

This report concludes that the Team 5 application demonstrates a valid and technically sound architecture built around Supabase. The team has implemented a functional cloud-backed backend, a logical relational database schema, and an appropriate package stack for a capstone MVP.

The project is approved as a current MVP implementation and is considered technically viable for continued development, with emphasis on security refinement and documentation consistency.

---

## 13. Approval Status

Status: Approved for current capstone MVP implementation  
Production-readiness: Requires security review and additional hardening  
Architecture suitability: Strong for project scope  
Backend implementation: Successfully integrated with Supabase

---

Prepared by: Team 5 Capstone Design Review  
Repository reviewed: `CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design`
