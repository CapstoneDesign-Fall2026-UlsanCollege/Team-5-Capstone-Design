# Database Design — Smart Study Companion

**Project:** Smart Study Companion  
**Team:** Team 5  
**Course:** Capstone Design — Fall 2026  
**Last Updated:** Week 5  
**References:** [Design Doc v1](../week2/design-doc-v1.md), [Architecture Sketch](../week3/architecture-sketch.md), [ARCHITECTURE_AND_SETUP.md](./ARCHITECTURE_AND_SETUP.md)

---

## Overview

This document defines the database schema for **Smart Study Companion**, a web application that helps college students organize study tasks, set deadlines, and take multiple-choice quizzes.

**Database choice:** SQLite for MVP (local testing) and PostgreSQL for production.

---

## Core Entities and Relationships

### 1. **User**
Represents a student using the application.

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | INTEGER / UUID | PRIMARY KEY | Unique user identifier |
| `name` | TEXT | NOT NULL | Student full name |
| `email` | TEXT | UNIQUE, NULLABLE | Student email (optional for MVP) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

**Reference:** [Design Doc v1 — Section 11](../week2/design-doc-v1.md#11-core-data-model)

---

### 2. **Subject**
Represents a course or study subject (e.g., "Programming", "Math").

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | INTEGER / UUID | PRIMARY KEY | Unique subject identifier |
| `user_id` | INTEGER / UUID | FOREIGN KEY → User | Links subject to student owner |
| `name` | TEXT | NOT NULL | Subject name (e.g., "Programming") |
| `description` | TEXT | NULLABLE | Optional subject description |
| `color` | TEXT | NULLABLE | UI color code (e.g., "#4f46e5") |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When subject was created |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

**Reference:** [Architecture Sketch — Core Data Model](../week3/architecture-sketch.md#core-data-model)

---

### 3. **StudyTask**
Represents a single study task within a subject.

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | INTEGER / UUID | PRIMARY KEY | Unique task identifier |
| `subject_id` | INTEGER / UUID | FOREIGN KEY → Subject | Links task to a subject |
| `title` | TEXT | NOT NULL | Task title (e.g., "Review chapter 2") |
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

**Reference:** [Design Doc v1 — Sections 8, 9](../week2/design-doc-v1.md#8-mvp-features)

---

### 4. **StudyPlan**
Groups and describes tasks generated for a subject (optional, used for AI-generated plans).

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | INTEGER / UUID | PRIMARY KEY | Unique study plan identifier |
| `subject_id` | INTEGER / UUID | FOREIGN KEY → Subject | Links plan to a subject |
| `title` | TEXT | NULLABLE | Optional plan title |
| `generated_at` | TIMESTAMP | DEFAULT NOW() | When the plan was generated |
| `source` | ENUM | DEFAULT 'manual' | 'manual' or 'ai-generated' |
| `reviewed` | BOOLEAN | DEFAULT FALSE | Student has reviewed the plan |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When record was created |

**Reference:** [Design Doc v1 — Section 11](../week2/design-doc-v1.md#11-core-data-model), Section 9 (AI-generated study plans)

---

### 5. **Quiz**
Represents a quiz for a subject.

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | INTEGER / UUID | PRIMARY KEY | Unique quiz identifier |
| `subject_id` | INTEGER / UUID | FOREIGN KEY → Subject | Links quiz to a subject |
| `title` | TEXT | NOT NULL | Quiz title (e.g., "Programming Ch1 Quiz") |
| `source` | ENUM | DEFAULT 'manual' | 'manual' or 'ai-generated' (future) |
| `description` | TEXT | NULLABLE | Optional quiz description |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When quiz was created |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

**Reference:** [Design Doc v1 — Section 11](../week2/design-doc-v1.md#11-core-data-model), Section 9 (Quizzes)

---

### 6. **Question**
Represents a single multiple-choice question in a quiz.

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | INTEGER / UUID | PRIMARY KEY | Unique question identifier |
| `quiz_id` | INTEGER / UUID | FOREIGN KEY → Quiz | Links question to a quiz |
| `question_text` | TEXT | NOT NULL | The question content |
| `order` | INTEGER | NULLABLE | Display order within quiz |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When question was created |

**Constraints:**
- Each quiz must have at least one question for the MVP

**Reference:** [Design Doc v1 — Section 11](../week2/design-doc-v1.md#11-core-data-model)

---

### 7. **AnswerChoice**
Represents a single answer option for a question.

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | INTEGER / UUID | PRIMARY KEY | Unique answer choice identifier |
| `question_id` | INTEGER / UUID | FOREIGN KEY → Question | Links choice to a question |
| `answer_text` | TEXT | NOT NULL | The answer option content |
| `is_correct` | BOOLEAN | DEFAULT FALSE | Marks the correct answer |
| `order` | INTEGER | NULLABLE | Display order for this question |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When answer was created |

**Constraints:**
- Each question must have **exactly one** correct answer (`is_correct = TRUE`)
- Each question should have at least 2 answer choices (typically 4 for MVP)

**Reference:** [Design Doc v1 — Section 9](../week2/design-doc-v1.md#9-functional-requirements) (Quizzes)

---

### 8. **QuizResult**
Records a student's quiz attempt and score.

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | INTEGER / UUID | PRIMARY KEY | Unique result identifier |
| `user_id` | INTEGER / UUID | FOREIGN KEY → User | Links result to student |
| `quiz_id` | INTEGER / UUID | FOREIGN KEY → Quiz | Links result to a quiz |
| `score` | INTEGER | NOT NULL | Number of correct answers |
| `total_questions` | INTEGER | NOT NULL | Total questions in quiz |
| `percentage` | DECIMAL(5, 2) | CALCULATED | Score percentage (0-100) |
| `completed_at` | TIMESTAMP | DEFAULT NOW() | When quiz was completed |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When result was saved |

**Constraints:**
- `score` must be >= 0 and <= `total_questions`
- `percentage` = (`score` / `total_questions`) * 100

**Reference:** [Design Doc v1 — Section 11](../week2/design-doc-v1.md#11-core-data-model), Section 9 (Quiz results)

---

### 9. **StudentAnswer**
Records individual answers a student gave during a quiz (optional, for future analytics).

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | INTEGER / UUID | PRIMARY KEY | Unique answer record identifier |
| `quiz_result_id` | INTEGER / UUID | FOREIGN KEY → QuizResult | Links to a quiz attempt |
| `question_id` | INTEGER / UUID | FOREIGN KEY → Question | Links to the question |
| `selected_answer_id` | INTEGER / UUID | FOREIGN KEY → AnswerChoice | Student's selected answer |
| `is_correct` | BOOLEAN | CALCULATED | Whether answer matches correct answer |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When answer was recorded |

**Reference:** [Design Doc v1 — Section 10](../week2/design-doc-v1.md#10-non-functional-requirements) (Audit trail for quiz scoring)

---

### 10. **Notification** (Future Feature)
Represents deadline reminders for study tasks.

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | INTEGER / UUID | PRIMARY KEY | Unique notification identifier |
| `user_id` | INTEGER / UUID | FOREIGN KEY → User | Links notification to student |
| `task_id` | INTEGER / UUID | FOREIGN KEY → StudyTask | Links notification to a task |
| `scheduled_time` | TIMESTAMP | NOT NULL | When reminder should appear |
| `sent_time` | TIMESTAMP | NULLABLE | When reminder was actually sent |
| `status` | ENUM | DEFAULT 'pending' | 'pending', 'sent', 'cancelled' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When notification was created |

**Reference:** [Design Doc v1 — Section 11](../week2/design-doc-v1.md#11-core-data-model), Section 4 (Reminder system — post-MVP)

---

## Entity Relationship Diagram (ERD)

```text
┌─────────────────┐
│     User        │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email           │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴────────────────────────────────────────┐
    │                                             │
    ▼                                             ▼
┌──────────────┐                        ┌─────────────────┐
│  Subject     │                        │ Notification    │
├──────────────┤                        ├─────────────────┤
│ id (PK)      │─────────┐              │ id (PK)         │
│ user_id (FK) │         │              │ user_id (FK)    │
│ name         │         │              │ task_id (FK)    │
│ color        │         │              │ scheduled_time  │
│ created_at   │         │              │ sent_time       │
└──────────────┘         │              │ status          │
    │                    │              └─────────────────┘
    │ 1:N                │
    │                    │
    ├─────────┐          │
    │         │          │
    ▼         ▼          │
┌──────────────┐    ┌────────────────┐
│ StudyTask    │    │ StudyPlan      │
├──────────────┤    ├────────────────┤
│ id (PK)      │    │ id (PK)        │
│ subject_id   │    │ subject_id(FK) │
│ title        │    │ generated_at   │
│ deadline     │    │ source         │
│ completed    │    │ reviewed       │
│ source       │    └────────────────┘
│ created_at   │
└──────────────┘
    │
    │ 1:N (to Notification)
    │

┌────────────────┐
│    Quiz        │
├────────────────┤
│ id (PK)        │
│ subject_id(FK) │
│ title          │
│ source         │
│ created_at     │
└────────┬───────┘
         │
         │ 1:N
         │
         ▼
┌────────────────────┐
│    Question        │
├────────────────────┤
│ id (PK)            │
│ quiz_id (FK)       │
│ question_text      │
│ order              │
│ created_at         │
└────────┬───────────┘
         │
         │ 1:N
         │
         ▼
┌────────────────────┐
│  AnswerChoice      │
├────────────────────┤
│ id (PK)            │
│ question_id (FK)   │
│ answer_text        │
│ is_correct         │
│ order              │
│ created_at         │
└────────────────────┘

┌────────────────────┐
│   QuizResult       │
├────────────────────┤
│ id (PK)            │
│ user_id (FK)       │
│ quiz_id (FK)       │
│ score              │
│ total_questions    │
│ percentage         │
│ completed_at       │
│ created_at         │
└────────┬───────────┘
         │
         │ 1:N
         │
         ▼
┌────────────────────┐
│ StudentAnswer      │
├────────────────────┤
│ id (PK)            │
│ quiz_result_id(FK) │
│ question_id (FK)   │
│ selected_answer_id │
│ is_correct         │
│ created_at         │
└────────────────────┘
```

---

## SQL Schema Definition

### SQLite (MVP)

```sql
-- User table
CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subject table
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

-- StudyTask table
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

-- StudyPlan table (optional)
CREATE TABLE study_plan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  title TEXT,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source TEXT DEFAULT 'manual',
  reviewed BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subject(id) ON DELETE CASCADE
);

-- Quiz table
CREATE TABLE quiz (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  source TEXT DEFAULT 'manual',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subject(id) ON DELETE CASCADE
);

-- Question table
CREATE TABLE question (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE
);

-- AnswerChoice table
CREATE TABLE answer_choice (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT 0,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
);

-- QuizResult table
CREATE TABLE quiz_result (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  quiz_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5, 2),
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE
);

-- StudentAnswer table (optional, for analytics)
CREATE TABLE student_answer (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_result_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  selected_answer_id INTEGER NOT NULL,
  is_correct BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_result_id) REFERENCES quiz_result(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES question(id),
  FOREIGN KEY (selected_answer_id) REFERENCES answer_choice(id)
);

-- Notification table (future feature)
CREATE TABLE notification (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  task_id INTEGER NOT NULL,
  scheduled_time TIMESTAMP NOT NULL,
  sent_time TIMESTAMP,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES study_task(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_subject_user ON subject(user_id);
CREATE INDEX idx_task_subject ON study_task(subject_id);
CREATE INDEX idx_task_deadline ON study_task(deadline);
CREATE INDEX idx_quiz_subject ON quiz(subject_id);
CREATE INDEX idx_question_quiz ON question(quiz_id);
CREATE INDEX idx_answer_question ON answer_choice(question_id);
CREATE INDEX idx_result_user ON quiz_result(user_id);
CREATE INDEX idx_result_quiz ON quiz_result(quiz_id);
CREATE INDEX idx_notification_user ON notification(user_id);
```

---

## Key Design Decisions

### 1. **User and Multi-User Support**
- Each subject, task, and quiz result is linked to a user via `user_id`
- Enables multi-user support in future versions
- **Reference:** [Design Doc v1 — Section 2](../week2/design-doc-v1.md#2-target-users)

### 2. **Task Status and Deadlines**
- `completed` field uses BOOLEAN for simple `Pending` / `Completed` status
- `deadline` is a DATE field for easy sorting and filtering
- `completed_at` timestamp records when task was finished (for analytics)
- **Reference:** [Design Doc v1 — Section 9](../week2/design-doc-v1.md#9-functional-requirements)

### 3. **Quiz Scoring**
- `QuizResult` stores `score` (correct count) and `total_questions` for clarity
- `percentage` is calculated as (score / total_questions) * 100
- `StudentAnswer` table (optional) enables detailed answer tracking for future features
- **Reference:** [Design Doc v1 — Section 9](../week2/design-doc-v1.md#9-functional-requirements) (Quiz results)

### 4. **Data Source Tracking**
- `source` field in Task, Quiz, and Plan tracks whether content is 'manual' or 'ai-generated'
- Enables future AI-generation features without schema changes
- **Reference:** [Design Doc v1 — Section 4](../week2/design-doc-v1.md#4-in-scope)

### 5. **Cascading Deletes**
- `ON DELETE CASCADE` ensures cleanup when parent records are deleted
- Deleting a subject removes all related tasks, quizzes, and results

### 6. **Indexes**
- Added on foreign keys and commonly filtered fields (`deadline`, `status`)
- Improves query performance as data grows
- Critical for Week 5+ as the app scales

---

## MVP Database Operations

### Create Subject
```sql
INSERT INTO subject (user_id, name, color, created_at)
VALUES (?, ?, ?, datetime('now'));
```

### Create Study Task
```sql
INSERT INTO study_task (subject_id, title, deadline, created_at)
VALUES (?, ?, ?, datetime('now'));
```

### Mark Task Completed
```sql
UPDATE study_task
SET completed = 1, completed_at = datetime('now'), updated_at = datetime('now')
WHERE id = ?;
```

### Get Study Plan (All Tasks for a Subject)
```sql
SELECT id, title, deadline, completed, created_at
FROM study_task
WHERE subject_id = ?
ORDER BY deadline ASC;
```

### Create Quiz Result
```sql
INSERT INTO quiz_result (user_id, quiz_id, score, total_questions, percentage, completed_at)
VALUES (?, ?, ?, ?, (? / ? * 100), datetime('now'));
```

### Record Student Answer
```sql
INSERT INTO student_answer (quiz_result_id, question_id, selected_answer_id, is_correct)
VALUES (?, ?, ?, ?);
```

---

## Data Validation Rules

| Field | Validation Rule |
|---|---|
| `User.email` | Must be unique, valid email format |
| `Subject.name` | NOT NULL, max 100 characters |
| `StudyTask.deadline` | Must be >= created_at date |
| `StudyTask.completed_at` | Only set when completed = TRUE |
| `AnswerChoice.is_correct` | Exactly ONE correct answer per question |
| `Question.quiz_id` | Must have at least 1 and typically 4+ answers per question |
| `QuizResult.score` | 0 <= score <= total_questions |
| `Notification.scheduled_time` | Must be >= task deadline (future feature) |

---

## Performance Considerations

### Query Optimization
1. **Deadline-based queries** (common for study plan): Index on `deadline`
2. **User-specific queries**: Index on `user_id` for subject, result retrieval
3. **Subject tasks**: Index on `subject_id` for filtering
4. **Quiz scoring**: Avoid N+1 queries; fetch quiz + questions + answers in one query

### Data Limits (MVP)
- Expected users per deployment: < 100 (small class/team)
- Expected subjects per user: < 20
- Expected tasks per subject: < 50
- Expected quizzes per subject: < 10
- Expected questions per quiz: 5–20

These limits make the current schema efficient for the MVP.

---

## Migration Plan (Week 6+)

### Phase 1: MVP (Week 5)
- SQLite local database
- Basic CRUD operations
- Simple quiz scoring

### Phase 2: Production Ready (Week 10+)
- Migrate to PostgreSQL
- Add authentication tables (users with passwords)
- Add session/token management
- Implement role-based access control

### Phase 3: Advanced Features (Post-Midterm)
- AI generation logging (track prompts and outputs)
- Notification scheduling and history
- Student analytics and progress reports

---

## References

- [Design Doc v1](../week2/design-doc-v1.md) — Project purpose, scope, and data model
- [Architecture Sketch](../week3/architecture-sketch.md) — System overview and data storage
- [ARCHITECTURE_AND_SETUP.md](./ARCHITECTURE_AND_SETUP.md) — Tech stack (SQLite for MVP)
- [Weekly Report Week 2](../week2/weekly-report.md) — Storage decisions
- [Storage Persistence Check](../week2/storage-check.md) — localStorage test (precursor to this schema)

---

## Questions for Team Review

1. Should we implement `StudentAnswer` table now or add it later for analytics?
2. Do we need user authentication for MVP, or is a single demo user sufficient?
3. Should `Notification` table be created now (empty) or added in post-MVP?
4. What is the preferred naming convention: `snake_case` or `camelCase`?
5. Should we use UUIDs or auto-increment integers for `id` fields?

---

**Document Owner:** J.N. Taj Oli/ Adhikari Sumit
**Last Updated:** 2026-10-03  
Notes: Had discussed with Adhikari Sumit in Week_4
**Status:** Ready for team review
