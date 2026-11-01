# Backend Design for Smart Study Companion

## 1. Overview

The current Team 5 project is already a full-stack application built around Supabase, using:

- Supabase Auth for login/signup/session management
- Supabase PostgreSQL for persistent data
- Row Level Security (RLS) for data isolation
- Frontend pages and JavaScript services for interaction

This backend design follows the actual code and database structure already present in the repository. It is suitable for the Team 5 capstone app and aligns with the existing migration files and service layer.

---

## 2. Backend Architecture

### 2.1 High-Level Structure

```text
Client (Browser)
  ├── Auth pages
  │    ├── login.html
  │    ├── signup.html
  │    ├── reset-password.html
  │    └── verify.html
  ├── Student dashboard
  │    ├── subjects
  │    ├── tasks
  │    ├── quiz
  │    └── profile
  └── JavaScript service layer
       ├── src/services/auth.js
       ├── src/services/profile.js
       ├── src/services/tasks.js
       ├── src/services/subjects.js
       └── src/services/quiz.js

            ↓ (Supabase client SDK)

Backend / Data Layer
  ├── Supabase Auth
  │    ├── signup/login/logout
  │    ├── email verification
  │    └── password reset
  ├── Supabase PostgreSQL
  │    ├── profiles
  │    ├── subjects
  │    ├── student_subjects
  │    ├── tasks
  │    ├── quiz_questions
  │    ├── quiz_attempts
  │    └── quiz_responses
  └── RLS Policies
       └── student-only access rules
```

### 2.2 Why this is the correct backend for the project

The repository already proves this is a Supabase-backed app:

- `src/lib/supabase.js` creates the Supabase client.
- `src/services/auth.js` wraps Supabase Auth.
- `src/services/tasks.js`, `subjects.js`, and `quiz.js` read/write database tables.
- `supabase/migrations/*.sql` define the database schema and security rules.

This means the app does not need a fully custom Express server for the MVP. The backend is a modern BaaS design.

---

## 3. Core Backend Components

### 3.1 Authentication Service

Responsible for:

- sign up
- sign in
- sign out
- password reset
- email verification
- session handling

Implementation pattern from repo:

```js
export async function signUp({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${window.location.origin}/auth/verify.html`,
    },
  });
  return { data, error };
}
```

This is the correct MVP pattern because it relies on Supabase Auth rather than custom user-password storage.

### 3.2 Profile Service

Responsible for:

- reading the current login profile
- creating/updating a profile row
- attaching data to the authenticated identity

Database relationship:

```text
auth.users(id) 1:1 profiles(id)
```

This model is best practice because it separates:

- authentication identity
- business profile data
- domain application data

### 3.3 Subject Service

Responsible for:

- listing default subjects
- listing all subjects
- enrolling student in subject
- returning student subject list

This supports the academic study planner model where students must register to subjects before creating tasks and quizzes.

### 3.4 Task Service

Responsible for:

- create task
- get tasks by student
- get tasks by subject
- update task details
- toggle completion
- delete task

This matches the planner use case: students track deadlines and assignments.

### 3.5 Quiz Service

Responsible for:

- fetch question bank by subject
- shuffle questions for each quiz session
- save attempts and responses
- read quiz history
- read attempt detail

This is aligned with the app’s educational features and supports quiz-based assessment.

---

## 4. Database Design

### 4.1 Entity Relationship Summary

```text
profiles
  ├── 1:N -> tasks
  ├── 1:N -> quiz_attempts
  └── N:M -> subjects via student_subjects

subjects
  ├── 1:N -> tasks
  ├── 1:N -> quiz_questions
  └── N:M -> profiles via student_subjects

quiz_attempts
  └── 1:N -> quiz_responses

quiz_questions
  └── 1:N -> quiz_responses
```

### 4.2 Table Design

#### profiles
```sql
CREATE TABLE IF NOT EXISTS profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Purpose:
- stores student identity metadata
- links the app user to Supabase auth identity

#### subjects
```sql
CREATE TABLE IF NOT EXISTS subjects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    is_default  BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Purpose:
- defines the study catalog
- supports academic subjects such as CS core courses

#### student_subjects
```sql
CREATE TABLE IF NOT EXISTS student_subjects (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE (student_id, subject_id)
);
```

Purpose:
- many-to-many mapping between student and enrolled subjects

#### tasks
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

Purpose:
- stores deadlines and academic assignments per student and subject

#### quiz_questions
```sql
CREATE TABLE IF NOT EXISTS quiz_questions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id    UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    question      TEXT NOT NULL,
    options       JSONB NOT NULL,
    correct_answer INTEGER NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Purpose:
- stores the question bank for each subject

#### quiz_attempts
```sql
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject_id      UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    mode            TEXT NOT NULL,
    score           INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Purpose:
- records each completed quiz attempt

#### quiz_responses
```sql
CREATE TABLE IF NOT EXISTS quiz_responses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id      UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id     UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    selected_answer INTEGER
);
```

Purpose:
- records the answer history for each attempt

---

## 5. Backend Data Flow

### 5.1 Signup Flow

```text
User submits signup form
  -> auth.signUp()
  -> Supabase creates auth.users row
  -> profile row is created via trigger / app logic
  -> user is redirected to verify page
```

### 5.2 Login Flow

```text
User enters email/password
  -> auth.signInWithPassword()
  -> Supabase returns session
  -> auth guard verifies session before dashboard access
```

### 5.3 Task Flow

```text
User adds task
  -> frontend calls createTask()
  -> Supabase inserts into tasks
  -> task is returned with subject name
  -> dashboard refreshes list
```

### 5.4 Quiz Flow

```text
User selects subject and quiz mode
  -> service loads quiz_questions for subject
  -> frontend shuffles questions and renders UI
  -> user answers questions
  -> frontend saves quiz attempt and all responses
  -> score is calculated and displayed
```

---

## 6. Security Design

### 6.1 Row Level Security

RLS is one of the most important parts of this design. The current repo already implements ownership-based policies, such as:

- profiles_select_own
- tasks_select_own
- student_subjects_select_own
- quiz_attempts_select_own
- quiz_responses_select_own

This ensures a student can only access their own data.

### 6.2 Principle

```text
Users should only read/update/delete records where student_id = current_user_id
```

### 6.3 Production Security Recommendation

The current MVP architecture is valid, but for production the app should avoid exposing `correct_answer` directly to the client during quiz retrieval. A stronger approach would be:

- keep the question bank private to trusted back-end logic
- calculate score on the server side
- return only score/result to the frontend

This is a recommended hardening step for future production deployment.

---

## 7. Backend API Design (Logical Contract)

Even though the project is currently using Supabase directly, the logical API can be modeled as follows.

### Authentication

- POST /auth/signup
- POST /auth/login
- POST /auth/logout
- POST /auth/reset-password
- POST /auth/verify-email

### Profile

- GET /profile
- PUT /profile

### Subjects

- GET /subjects
- GET /subjects/enrolled
- POST /subjects/enroll

### Tasks

- GET /tasks
- GET /tasks?subject_id=
- POST /tasks
- PUT /tasks/:id
- PATCH /tasks/:id/toggle
- DELETE /tasks/:id

### Quiz

- GET /quiz/questions?subject_id=
- POST /quiz/attempts
- GET /quiz/history
- GET /quiz/attempts/:id

This design matches the actual repository service layer and is easy to implement later with Express or Supabase Edge functions.

---

## 8. Recommended Backend Implementation Strategy

### Option A: Keep the current Supabase-first backend
Best for:
- capstone project
- fast MVP delivery
- simple deployment
- low backend complexity

Use this when:
- the app is mainly a browser-based student planner
- you want a minimal server footprint
- you are already using Supabase Auth and PostgreSQL successfully

### Option B: Add a thin custom server later
Best for:
- production-grade security
- advanced quiz scoring logic
- API middleware and centralized validation
- future expansion

Structure:

```text
server/
  controllers/
  routes/
  services/
  middleware/
  config/
```

This would sit in front of Supabase and handle:

- secure score calculation
- centralized validation
- admin features
- reporting endpoints

---

## 9. Final Proposed Backend Design for Team 5

The best design for Team 5 is:

- Frontend: HTML/CSS/JavaScript
- Authentication: Supabase Auth
- Database: PostgreSQL in Supabase
- Data access: Supabase JavaScript SDK
- Security: RLS policies
- Features supported:
  - user login/signup
  - profile management
  - subject enrollment
  - task tracking
  - quiz generation and recordkeeping

This is already consistent with the repository’s current implementation and is appropriate for the project scope.

---

## 10. Conclusion

We have design till now . New update will be based on after testing report done by our tester and project co_ordinator.
