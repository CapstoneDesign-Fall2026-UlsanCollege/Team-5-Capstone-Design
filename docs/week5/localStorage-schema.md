# localStorage Schema — Smart Study Companion MVP

**Project:** Smart Study Companion  
**Team:** Team 5  
**Week:** 5  
**Status:** Active MVP storage format for the frontend-only slice

---

## Scope note

This document describes the data shape actually used by the Week 5 frontend MVP. The project is still intentionally frontend-only and stores data in the browser using `localStorage` instead of a backend database.

The relational schema in [database-design.md](./database-design.md) remains the future backend design. It is useful for planning and later production work, but the current app behavior is defined by this browser storage format.

---

## Storage model

The app stores all app state in a single localStorage key, for example:

```text
smart-study-companion
```

Example payload:

```json
{
  "subjects": [
    {
      "id": "sub_001",
      "name": "Programming",
      "created_at": "2026-10-07T10:30:00Z"
    },
    {
      "id": "sub_002",
      "name": "Math",
      "created_at": "2026-10-07T10:45:00Z"
    }
  ],
  "tasks": [
    {
      "id": "task_001",
      "subject_id": "sub_001",
      "title": "Review chapter 1",
      "description": "Read notes and complete exercises",
      "deadline": "2026-10-14",
      "completed": false,
      "created_at": "2026-10-07T10:35:00Z",
      "completed_at": null
    },
    {
      "id": "task_002",
      "subject_id": "sub_001",
      "title": "Practice quiz",
      "description": null,
      "deadline": "2026-10-15",
      "completed": true,
      "created_at": "2026-10-07T10:40:00Z",
      "completed_at": "2026-10-07T12:00:00Z"
    }
  ],
  "quizResults": [
    {
      "id": "quiz_001",
      "subject_id": "sub_001",
      "score": 2,
      "total_questions": 3,
      "completed_at": "2026-10-07T13:00:00Z"
    }
  ]
}
```

---

## Subject object

```json
{
  "id": "sub_001",
  "name": "Programming",
  "created_at": "2026-10-07T10:30:00Z"
}
```

### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique identifier for the subject |
| `name` | string | Yes | Subject title such as "Programming" |
| `created_at` | ISO date string | Yes | Time when the subject was created |

---

## Task object

```json
{
  "id": "task_001",
  "subject_id": "sub_001",
  "title": "Review chapter 1",
  "description": "Read notes and complete exercises",
  "deadline": "2026-10-14",
  "completed": false,
  "created_at": "2026-10-07T10:35:00Z",
  "completed_at": null
}
```

### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique task identifier |
| `subject_id` | string | Yes | Must match an existing subject ID |
| `title` | string | Yes | Task name |
| `description` | string or null | No | Optional details |
| `deadline` | string | Yes | ISO date or YYYY-MM-DD string |
| `completed` | boolean | Yes | Current completion state |
| `created_at` | ISO date string | Yes | Creation timestamp |
| `completed_at` | ISO date string or null | No | Required only when completed is true |

---

## Quiz result object

```json
{
  "id": "quiz_001",
  "subject_id": "sub_001",
  "score": 2,
  "total_questions": 3,
  "completed_at": "2026-10-07T13:00:00Z"
}
```

### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique quiz result identifier |
| `subject_id` | string | Yes | Must match an existing subject |
| `score` | number | Yes | Number of correct answers |
| `total_questions` | number | Yes | Total quiz questions |
| `completed_at` | ISO date string | Yes | When the quiz was finished |

---

## Validation rules for the MVP

The UI should validate data before saving to localStorage:

- `subject.id` must be unique
- `task.id` must be unique
- `task.subject_id` must exist in `subjects`
- `subject.name` must not be empty or whitespace only
- `task.title` must not be empty
- `task.deadline` must be a valid future or current date
- `task.completed_at` must only be set when `task.completed === true`
- `score` must be between `0` and `total_questions`
- JSON must be parsed safely before reading from localStorage

### Example checks

```javascript
function isValidTask(task) {
  return (
    typeof task.id === 'string' && task.id.length > 0 &&
    typeof task.subject_id === 'string' && task.subject_id.length > 0 &&
    typeof task.title === 'string' && task.title.trim().length > 0 &&
    !!task.deadline && !Number.isNaN(new Date(task.deadline))
  );
}
```

---

## Why this matters

This localStorage structure is the actual source of truth for the Week 5 midterm slice. It keeps the demo simple and allows subject and task data to persist after refresh without a backend. The relational database documents remain important for later backend implementation and migration planning.

---

## Related documents

- [database-design.md](./database-design.md) — future backend schema and SQL planning
- [ARCHITECTURE_AND_SETUP.md](./ARCHITECTURE_AND_SETUP.md) — project architecture and setup
- [WEEK_5_WORKLIST.md](./WEEK_5_WORKLIST.md) — implementation owners and sprint tasks
- [persistence-test.md](./persistence-test.md) — browser verification procedure

