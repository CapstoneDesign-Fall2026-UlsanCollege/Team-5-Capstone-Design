# Database Design Review

**Project:** Smart Study Companion  
**Team:** Team 5  
**Course:** Capstone Design — Fall 2026  
**Week:** 5  
**Decision:** Approved for MVP implementation

---

## Review Summary

We reviewed the current database design for the Smart Study Companion project and agree that it is suitable for the MVP. The design is simple, easy to implement, and matches the project scope: managing subjects, tasks, and quiz results.

The main idea is clear and practical: a student creates a subject, adds study tasks under that subject, and later records quiz results for that subject. This structure is straightforward and fits the current application flow without adding unnecessary complexity.

---

## Why the Design Works

### 1. Subject and task relationship
The `Subject` and `Task` tables are designed in the right way. Each task belongs to one subject, and a subject can have many tasks. This relationship is logical and reflects the real use case of a study planner.

### 2. Task tracking is clear
The `Task` table includes the most important fields for the app:
- `subject_id` for linking the task to a subject
- `title` for task name
- `deadline` for time planning
- `completed` for progress tracking
- `created_at` for record tracking

This is enough for the MVP and gives the frontend a clean way to display and update tasks.

### 3. Quiz results are recorded properly
The `QuizResult` table records the score and total number of questions for each subject. This helps the app track learning progress without making the database too complex.

This design is relevant because the project goal is not a large LMS system; it is a simple study companion with basic quiz functionality.

---

## Approved Data Model

```sql
CREATE TABLE Subject (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    deadline DATETIME NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES Subject(id) ON DELETE CASCADE
);

CREATE TABLE QuizResult (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES Subject(id) ON DELETE CASCADE
);
```

---

## Facts Supporting This Decision

- The database matches the MVP requirements.
- It keeps the data model simple and understandable.
- It follows the basic rules of relational design.
- Foreign keys are used correctly to connect tasks and quiz results to subjects.
- SQLite is acceptable for local testing and small-scale development.
- The structure can later be migrated to PostgreSQL when the app grows.

---

## Database Design Facts

| Item | Review |
|---|---|
| Normalization | Reasonably good for a small MVP |
| Relationship design | Clear and logical |
| Foreign key use | Correct and appropriate |
| Data integrity | Good enough for MVP |
| Simplicity | Strong point of the design |
| Future scalability | Good, with later database migration possible |

---

## Technical Decision

### SQLite for MVP
We agree with using SQLite for the current version. It is lightweight, easy to set up, and does not require a server for early testing. This is a good choice for a small project and matches the current project architecture.

### Python + SQLAlchemy
Using Python with SQLAlchemy is also a good choice. It helps keep the database code cleaner and makes future migration to PostgreSQL easier.

---

## Limitations and Future Improvements

We also recognize the design has limits, but these are acceptable for the current stage:

- There is no user authentication yet.
- The app is designed for a single-user local workflow.
- The quiz system is still simple and does not yet store detailed question-level data.
- If the project grows, the database model should be expanded with things like user accounts, more advanced quiz tables, and a stronger production database setup.

These are not problems for the MVP. They are future enhancements.

---

## Final Decision

We approve this database design for the current project stage.

The design is clear, practical, and aligned with the features already described in the project architecture. It is suitable for implementation and should be accepted as the base model for the MVP.

---

## Team Agreement

**Approved by the team for MVP development.**

We agree to proceed with the current design and continue with SQLite-based development for the early stage, while keeping PostgreSQL migration in mind for future expansion.

---

## References

- Smart Study Companion architecture document
- Week 5 project design discussion
- MVP requirements for subjects, tasks, and quiz results
