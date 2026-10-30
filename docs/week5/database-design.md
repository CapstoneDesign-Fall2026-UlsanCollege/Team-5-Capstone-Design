# Database Design — Smart Study Companion

**Project:** Smart Study Companion  
**Team:** Team 5  
**Course:** Capstone Design — Fall 2026  
**Last Updated:** Week 5  
**References:** [Design Doc v1](../week2/design-doc-v1.md), [Architecture Sketch](../week3/architecture-sketch.md), [ARCHITECTURE_AND_SETUP.md](./ARCHITECTURE_AND_SETUP.md)

---

## Important MVP clarification

This document captures the project’s planned backend database schema for future implementation. It is useful for architecture, API design, and later migration planning.

For the Week 5 midterm vertical slice, the actual app state is intentionally stored in the browser using `localStorage`, not a persistent SQL database. The current frontend-only MVP uses the structure defined in [localStorage-schema.md](./localStorage-schema.md).

In short:

- **Week 5 MVP:** frontend-only, browser storage, no backend required
- **Future phase:** SQLite/PostgreSQL backend with the relational model below

---

## Overview

This document defines the database schema for **Smart Study Companion**, a web application that helps college students organize study tasks, set deadlines, and take multiple-choice quizzes.

**Database choice:** SQLite for MVP (local testing) and PostgreSQL for production.

---

## Core Entities and Relationships

### 1. **User**
Represents a student using the application.

| Field | Type | Constraint | Description |
| --- | --- | --- | --- |
| `id` | INTEGER / UUID | PRIMARY KEY | Unique user identifier |
| `name` | TEXT | NOT NULL | Student full name |
| `email` | TEXT | UNIQUE, NULLABLE | Student email (optional for MVP) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

---

### 2. **Subject**
Represents a course or study subject (e.g., "Programming", "Math").

| Field | Type | Constraint | Description |
| --- | --- | --- | --- |
| `id` | INTEGER / UUID | PRIMARY KEY | Unique subject identifier |
| `user_id` | INTEGER / UUID | FOREIGN KEY → User | Links subject to student owner |
| `name` | TEXT | NOT NULL | Subject name (e.g., "Programming") |
| `description` | TEXT | NULLABLE | Optional subject description |
| `color` | TEXT | NULLABLE | UI color code (e.g., "#4f46e5") |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When subject was created |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

---

### 3. **StudyTask**
Represents a single study task within a subject.

| Field | Type | Constraint | Description |
| --- | --- | --- | --- |
| `id` | INTEGER / UUID | PRIMARY KEY | Unique task identifier |
| `subject_id` | INTEGER / UUID | FOREIGN KEY → Subject | Links task to a subject |
| `title` | TEXT | NOT NULL | Task title |
| `description` | TEXT | NULLABLE | Optional task details |
| `deadline` | DATE | NOT NULL | Task due date |
| `completed` | BOOLEAN | DEFAULT FALSE | Completion status |
| `source` | ENUM | DEFAULT 'manual' | 'manual' or 'ai-generated' (future) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When task was created |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |
| `completed_at` | TIMESTAMP | NULLABLE | When task was marked complete |

**Constraints:**
- `deadline` should be >= `created_at`
- `completed_at` is only set when `completed = TRUE`

---

### 4. **StudyPlan**
Groups and describes tasks generated for a subject.

| Field | Type | Constraint | Description |
| --- | --- | --- | --- |
| `id` | INTEGER / UUID | PRIMARY KEY | Unique study plan identifier |
| `subject_id` | INTEGER / UUID | FOREIGN KEY → Subject | Links plan to a subject |
| `title` | TEXT | NULLABLE | Optional plan title |
| `generated_at` | TIMESTAMP | DEFAULT NOW() | When the plan was generated |
| `source` | ENUM | DEFAULT 'manual' | 'manual' or 'ai-generated' |
| `reviewed` | BOOLEAN | DEFAULT FALSE | Student has reviewed the plan |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When record was created |

---

### 5. **Quiz**
Represents a quiz for a subject.

| Field | Type | Constraint | Description |
| --- | --- | --- | --- |
| `id` | INTEGER / UUID | PRIMARY KEY | Unique quiz identifier |
| `subject_id` | INTEGER / UUID | FOREIGN KEY → Subject | Links quiz to a subject |
| `title` | TEXT | NOT NULL | Quiz title |
| `source` | ENUM | DEFAULT 'manual' | 'manual' or 'ai-generated' (future) |
| `description` | TEXT | NULLABLE | Optional quiz description |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When quiz was created |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

---

### 6. **Question**
Represents a single multiple-choice question in a quiz.

| Field | Type | Constraint | Description |
| --- | --- | --- | --- |
| `id` | INTEGER / UUID | PRIMARY KEY | Unique question identifier |
| `quiz_id` | INTEGER / UUID | FOREIGN KEY → Quiz | Links question to a quiz |
| `question_text` | TEXT | NOT NULL | The question content |
| `order` | INTEGER | NULLABLE | Display order within quiz |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When question was created |

---

### 7. **AnswerChoice**
Represents a single answer option for a question.

| Field | Type | Constraint | Description |
| --- | --- | --- | --- |
| `id` | INTEGER / UUID | PRIMARY KEY | Unique answer choice identifier |
| `question_id` | INTEGER / UUID | FOREIGN KEY → Question | Links choice to a question |
| `answer_text` | TEXT | NOT NULL | The answer option content |
| `is_correct` | BOOLEAN | DEFAULT FALSE | Marks the correct answer |
| `order` | INTEGER | NULLABLE | Display order for this question |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When answer was created |

**Constraints:**
- Each question must have exactly one correct answer (`is_correct = TRUE`)
- Each question should have at least two answer choices

---

### 8. **QuizResult**
Records a student's quiz attempt and score.

| Field | Type | Constraint | Description |
| --- | --- | --- | --- |
| `id` | INTEGER / UUID | PRIMARY KEY | Unique result identifier |
| `user_id` | INTEGER / UUID | FOREIGN KEY → User | Links result to student |
| `quiz_id` | INTEGER / UUID | FOREIGN KEY → Quiz | Links result to a quiz |
| `score` | INTEGER | NOT NULL | Number of correct answers |
| `total_questions` | INTEGER | NOT NULL | Total questions in quiz |
| `percentage` | DECIMAL(5, 2) | CALCULATED | Score percentage (0-100) |
| `completed_at` | TIMESTAMP | DEFAULT NOW() | When quiz was completed |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When result was saved |

---

## MVP vs future backend design

### Current Week 5 MVP reality

The app behaves as follows:

- subject data is stored in localStorage
- task data is stored in localStorage
- refresh keeps items visible
- no backend or database is required for the visible slice

### Future backend implementation

Once the product moves beyond the prototype, the schema above becomes the real source of truth and can be mapped to SQLite or PostgreSQL. This allows safe migration from browser storage to a proper relational database.

---

## LocalStorage validation checklist

The implementation should also validate the frontend data before writing to localStorage:

- `subject.id` must be unique
- `task.id` must be unique
- `task.subject_id` must match an existing subject
- `subject.name` must not be blank
- `task.title` must not be blank
- `task.deadline` must be valid and parseable
- `completed_at` must only be non-null when `completed` is true
- `score` must be between 0 and `total_questions`

These checks are documented in [localStorage-schema.md](./localStorage-schema.md).

---

## SQL Schema Definition

### SQLite (MVP)

```sql
CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subject (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE study_task (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  deadline DATE NOT NULL,
  completed BOOLEAN DEFAULT 0,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subject(id) ON DELETE CASCADE
);

CREATE TABLE quiz_result (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  quiz_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5, 2),
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
```

---

## References

- [localStorage-schema.md](./localStorage-schema.md) — current browser storage shape for Week 5 MVP
- [ARCHITECTURE_AND_SETUP.md](./ARCHITECTURE_AND_SETUP.md) — project architecture and stack
- [WEEK_5_WORKLIST.md](./WEEK_5_WORKLIST.md) — sprint tasks and owners
- [persistence-test.md](./persistence-test.md) — browser-level validation notes

---

**Document Owner:** J.N. Taj Oli / Adhikari Sumit  
**Last Updated:** 2026-10-07  
**Status:** Ready for review, with MVP/localStorage clarification added

