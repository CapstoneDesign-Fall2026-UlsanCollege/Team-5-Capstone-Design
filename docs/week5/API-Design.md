# API Design — Smart Study Companion

**Project:** Smart Study Companion  
**Team:** Team 5  
**Course:** Capstone Design — Fall 2026  
**Last Updated:** Week 5  
**References:** [Database Design](./database-design.md), [Architecture and Setup](./ARCHITECTURE_AND_SETUP.md), [Authentication Decision](./Authentication_Techinical_Decision.md)

---

## Overview

This document defines the REST API for **Smart Study Companion**. The API enables the frontend (React + Vite) to interact with the backend (Python FastAPI/Flask + SQLite) for managing subjects, study tasks, deadlines, study plans, quizzes, and quiz results.

**API Base URL:**  (MVP)  
**API Version:** v1  
**Authentication:** None for MVP (anonymous browser-based access with localStorage)

## Notes
 Project is being run locally , so we are not able to show now .And soon be updated our files with code and evidences 

---

## Design Principles

1. **RESTful**: Uses HTTP methods (GET, POST, PUT, DELETE) correctly
2. **JSON-First**: All requests and responses use JSON format
3. **Stateless**: Each request is independent; no session state on backend
4. **Simple**: MVP keeps URLs and payloads simple for fast iteration
5. **Predictable**: Resource naming follows conventions: `/subjects`, `/tasks`, `/quizzes`

---

## HTTP Status Codes

| Code | Meaning | Usage |
|---|---|---|
| `200 OK` | Success | GET, PUT operations |
| `201 Created` | Resource created | POST operations |
| `204 No Content` | Success with no response body | DELETE operations |
| `400 Bad Request` | Invalid request (missing fields, validation error) | All write operations |
| `404 Not Found` | Resource does not exist | GET, PUT, DELETE on non-existent ID |
| `500 Internal Server Error` | Backend error | Server failures |

---

## Error Response Format

All error responses use this standard format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Description of what went wrong",
    "details": {
      "field_name": "Error message for this field"
    }
  }
}
```

### Example Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid task data",
    "details": {
      "title": "Title is required",
      "deadline": "Deadline must be a valid date"
    }
  }
}
```

---

## Core Resources

### 1. Subjects

A **Subject** represents a course or study area (e.g., "Programming", "Math").

#### 1.1 Create Subject
**POST** `/api/v1/subjects`

**Request:**
```json
{
  "name": "Programming Fundamentals",
  "description": "Learn Python and JavaScript",
  "color": "#4f46e5"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Programming Fundamentals",
  "description": "Learn Python and JavaScript",
  "color": "#4f46e5",
  "created_at": "2026-10-03T10:30:00Z",
  "updated_at": "2026-10-03T10:30:00Z"
}
```

**Validation:**
- `name`: Required, string, max 100 characters
- `description`: Optional, string
- `color`: Optional, valid hex color code

---

#### 1.2 Get All Subjects
**GET** `/api/v1/subjects`

**Response:** `200 OK`
```json
{
  "subjects": [
    {
      "id": 1,
      "name": "Programming Fundamentals",
      "description": "Learn Python and JavaScript",
      "color": "#4f46e5",
      "task_count": 5,
      "created_at": "2026-10-03T10:30:00Z",
      "updated_at": "2026-10-03T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Data Structures",
      "description": null,
      "color": "#06b6d4",
      "task_count": 3,
      "created_at": "2026-10-02T14:15:00Z",
      "updated_at": "2026-10-02T14:15:00Z"
    }
  ],
  "total": 2
}
```

---

#### 1.3 Get Subject by ID
**GET** `/api/v1/subjects/{id}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Programming Fundamentals",
  "description": "Learn Python and JavaScript",
  "color": "#4f46e5",
  "task_count": 5,
  "quiz_count": 2,
  "created_at": "2026-10-03T10:30:00Z",
  "updated_at": "2026-10-03T10:30:00Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Subject with id 999 not found"
  }
}
```

---

#### 1.4 Update Subject
**PUT** `/api/v1/subjects/{id}`

**Request:**
```json
{
  "name": "Programming Fundamentals (Updated)",
  "color": "#ec4899"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Programming Fundamentals (Updated)",
  "description": "Learn Python and JavaScript",
  "color": "#ec4899",
  "created_at": "2026-10-03T10:30:00Z",
  "updated_at": "2026-10-03T11:45:00Z"
}
```

---

#### 1.5 Delete Subject
**DELETE** `/api/v1/subjects/{id}`

**Response:** `204 No Content`

**Note:** Deleting a subject cascades to delete all related tasks, quizzes, and results (see [Database Design](./database-design.md)).

---

### 2. Study Tasks

A **StudyTask** represents a single task to complete within a subject (e.g., "Review chapter 2", "Complete homework").

#### 2.1 Create Task
**POST** `/api/v1/subjects/{subject_id}/tasks`

**Request:**
```json
{
  "title": "Review chapter 2",
  "description": "Go through sections 2.1 to 2.5",
  "deadline": "2026-10-10"
}
```

**Response:** `201 Created`
```json
{
  "id": 15,
  "subject_id": 1,
  "title": "Review chapter 2",
  "description": "Go through sections 2.1 to 2.5",
  "deadline": "2026-10-10",
  "completed": false,
  "source": "manual",
  "created_at": "2026-10-03T10:45:00Z",
  "updated_at": "2026-10-03T10:45:00Z",
  "completed_at": null
}
```

**Validation:**
- `title`: Required, string, max 200 characters
- `description`: Optional, string
- `deadline`: Required, ISO 8601 date format (YYYY-MM-DD)

---

#### 2.2 Get All Tasks for a Subject
**GET** `/api/v1/subjects/{subject_id}/tasks`

**Query Parameters:**
- `status` (optional): Filter by status. Values: `all`, `pending`, `completed`. Default: `all`
- `sort` (optional): Sort order. Values: `deadline-asc`, `deadline-desc`, `created-asc`, `created-desc`. Default: `deadline-asc`

**Example:** `GET /api/v1/subjects/1/tasks?status=pending&sort=deadline-asc`

**Response:** `200 OK`
```json
{
  "tasks": [
    {
      "id": 15,
      "subject_id": 1,
      "title": "Review chapter 2",
      "description": "Go through sections 2.1 to 2.5",
      "deadline": "2026-10-10",
      "completed": false,
      "source": "manual",
      "created_at": "2026-10-03T10:45:00Z",
      "updated_at": "2026-10-03T10:45:00Z",
      "completed_at": null
    },
    {
      "id": 16,
      "subject_id": 1,
      "title": "Complete homework",
      "description": null,
      "deadline": "2026-10-15",
      "completed": true,
      "source": "manual",
      "created_at": "2026-10-02T09:30:00Z",
      "updated_at": "2026-10-03T08:00:00Z",
      "completed_at": "2026-10-03T08:00:00Z"
    }
  ],
  "total": 2,
  "pending_count": 1,
  "completed_count": 1
}
```

---

#### 2.3 Get Task by ID
**GET** `/api/v1/tasks/{id}`

**Response:** `200 OK`
```json
{
  "id": 15,
  "subject_id": 1,
  "title": "Review chapter 2",
  "description": "Go through sections 2.1 to 2.5",
  "deadline": "2026-10-10",
  "completed": false,
  "source": "manual",
  "created_at": "2026-10-03T10:45:00Z",
  "updated_at": "2026-10-03T10:45:00Z",
  "completed_at": null
}
```

---

#### 2.4 Update Task
**PUT** `/api/v1/tasks/{id}`

**Request:**
```json
{
  "title": "Review chapter 2 and 3",
  "deadline": "2026-10-12",
  "completed": false
}
```

**Response:** `200 OK`
```json
{
  "id": 15,
  "subject_id": 1,
  "title": "Review chapter 2 and 3",
  "description": "Go through sections 2.1 to 2.5",
  "deadline": "2026-10-12",
  "completed": false,
  "source": "manual",
  "created_at": "2026-10-03T10:45:00Z",
  "updated_at": "2026-10-03T11:20:00Z",
  "completed_at": null
}
```

---

#### 2.5 Mark Task Completed
**PUT** `/api/v1/tasks/{id}/complete`

**Request:** (No body needed)
```json
{}
```

**Response:** `200 OK`
```json
{
  "id": 15,
  "subject_id": 1,
  "title": "Review chapter 2",
  "deadline": "2026-10-10",
  "completed": true,
  "source": "manual",
  "created_at": "2026-10-03T10:45:00Z",
  "updated_at": "2026-10-03T11:25:00Z",
  "completed_at": "2026-10-03T11:25:00Z"
}
```

---

#### 2.6 Delete Task
**DELETE** `/api/v1/tasks/{id}`

**Response:** `204 No Content`

---

### 3. Study Plans

A **StudyPlan** groups and organizes tasks for a subject. (Optional feature for MVP; can be used for AI-generated plans in future.)

#### 3.1 Get Study Plan for a Subject
**GET** `/api/v1/subjects/{subject_id}/study-plan`

**Response:** `200 OK`
```json
{
  "study_plan": {
    "id": 5,
    "subject_id": 1,
    "title": "Week 5 Study Plan",
    "source": "manual",
    "generated_at": "2026-10-03T10:30:00Z",
    "reviewed": false,
    "tasks": [
      {
        "id": 15,
        "title": "Review chapter 2",
        "deadline": "2026-10-10",
        "completed": false
      },
      {
        "id": 16,
        "title": "Complete homework",
        "deadline": "2026-10-15",
        "completed": false
      }
    ]
  }
}
```

**Note:** For MVP, this endpoint simply returns all pending tasks for the subject. Future versions will support AI-generated study plans.

---

### 4. Quizzes

A **Quiz** is a collection of multiple-choice questions for a subject.

#### 4.1 Create Quiz
**POST** `/api/v1/subjects/{subject_id}/quizzes`

**Request:**
```json
{
  "title": "Programming Chapter 1 Quiz",
  "description": "Test your understanding of variables and functions"
}
```

**Response:** `201 Created`
```json
{
  "id": 7,
  "subject_id": 1,
  "title": "Programming Chapter 1 Quiz",
  "description": "Test your understanding of variables and functions",
  "source": "manual",
  "question_count": 0,
  "created_at": "2026-10-03T11:00:00Z",
  "updated_at": "2026-10-03T11:00:00Z"
}
```

**Validation:**
- `title`: Required, string, max 200 characters
- `description`: Optional, string

---

#### 4.2 Get All Quizzes for a Subject
**GET** `/api/v1/subjects/{subject_id}/quizzes`

**Response:** `200 OK`
```json
{
  "quizzes": [
    {
      "id": 7,
      "subject_id": 1,
      "title": "Programming Chapter 1 Quiz",
      "description": "Test your understanding of variables and functions",
      "source": "manual",
      "question_count": 5,
      "created_at": "2026-10-03T11:00:00Z",
      "updated_at": "2026-10-03T11:00:00Z"
    },
    {
      "id": 8,
      "subject_id": 1,
      "title": "Programming Chapter 2 Quiz",
      "description": null,
      "source": "manual",
      "question_count": 4,
      "created_at": "2026-10-02T15:30:00Z",
      "updated_at": "2026-10-02T15:30:00Z"
    }
  ],
  "total": 2
}
```

---

#### 4.3 Get Quiz with Questions
**GET** `/api/v1/quizzes/{id}`

**Response:** `200 OK`
```json
{
  "id": 7,
  "subject_id": 1,
  "title": "Programming Chapter 1 Quiz",
  "description": "Test your understanding of variables and functions",
  "source": "manual",
  "created_at": "2026-10-03T11:00:00Z",
  "updated_at": "2026-10-03T11:00:00Z",
  "questions": [
    {
      "id": 42,
      "quiz_id": 7,
      "question_text": "What is a variable?",
      "order": 1,
      "answers": [
        {
          "id": 101,
          "question_id": 42,
          "answer_text": "A named storage location for data",
          "order": 1
        },
        {
          "id": 102,
          "question_id": 42,
          "answer_text": "A type of function",
          "order": 2
        },
        {
          "id": 103,
          "question_id": 42,
          "answer_text": "A programming language",
          "order": 3
        },
        {
          "id": 104,
          "question_id": 42,
          "answer_text": "None of the above",
          "order": 4
        }
      ]
    }
  ]
}
```

**Note:** When fetching quiz for presentation, answer choices do NOT include `is_correct` field to prevent cheating.

---

#### 4.4 Update Quiz
**PUT** `/api/v1/quizzes/{id}`

**Request:**
```json
{
  "title": "Programming Chapter 1 & 2 Quiz",
  "description": "Comprehensive quiz on chapters 1 and 2"
}
```

**Response:** `200 OK`
```json
{
  "id": 7,
  "subject_id": 1,
  "title": "Programming Chapter 1 & 2 Quiz",
  "description": "Comprehensive quiz on chapters 1 and 2",
  "source": "manual",
  "question_count": 5,
  "created_at": "2026-10-03T11:00:00Z",
  "updated_at": "2026-10-03T11:30:00Z"
}
```

---

#### 4.5 Delete Quiz
**DELETE** `/api/v1/quizzes/{id}`

**Response:** `204 No Content`

**Note:** Deleting a quiz cascades to delete all questions, answers, and results.

---

### 5. Questions and Answers

**Questions** are individual multiple-choice items within a quiz. **AnswerChoices** are the options for each question.

#### 5.1 Create Question
**POST** `/api/v1/quizzes/{quiz_id}/questions`

**Request:**
```json
{
  "question_text": "What is a variable?",
  "order": 1
}
```

**Response:** `201 Created`
```json
{
  "id": 42,
  "quiz_id": 7,
  "question_text": "What is a variable?",
  "order": 1,
  "created_at": "2026-10-03T11:05:00Z"
}
```

**Validation:**
- `question_text`: Required, string, max 500 characters
- `order`: Optional, integer (automatically assigned if not provided)

---

#### 5.2 Create Answer Choice
**POST** `/api/v1/questions/{question_id}/answers`

**Request:**
```json
{
  "answer_text": "A named storage location for data",
  "is_correct": true,
  "order": 1
}
```

**Response:** `201 Created`
```json
{
  "id": 101,
  "question_id": 42,
  "answer_text": "A named storage location for data",
  "is_correct": true,
  "order": 1,
  "created_at": "2026-10-03T11:06:00Z"
}
```

**Validation:**
- `answer_text`: Required, string, max 300 characters
- `is_correct`: Required, boolean
- `order`: Optional, integer

**Business Rule:**
- Each question must have at least 2 answers
- Exactly one answer must have `is_correct = true`

---

#### 5.3 Update Question
**PUT** `/api/v1/questions/{id}`

**Request:**
```json
{
  "question_text": "What is a variable in programming?",
  "order": 2
}
```

**Response:** `200 OK`
```json
{
  "id": 42,
  "quiz_id": 7,
  "question_text": "What is a variable in programming?",
  "order": 2,
  "created_at": "2026-10-03T11:05:00Z"
}
```

---

#### 5.4 Update Answer Choice
**PUT** `/api/v1/answers/{id}`

**Request:**
```json
{
  "answer_text": "A named storage location that holds data",
  "is_correct": true,
  "order": 1
}
```

**Response:** `200 OK`
```json
{
  "id": 101,
  "question_id": 42,
  "answer_text": "A named storage location that holds data",
  "is_correct": true,
  "order": 1,
  "created_at": "2026-10-03T11:06:00Z"
}
```

---

#### 5.5 Delete Question
**DELETE** `/api/v1/questions/{id}`

**Response:** `204 No Content`

**Note:** Deletes all answers for this question and all quiz results that include this question.

---

#### 5.6 Delete Answer Choice
**DELETE** `/api/v1/answers/{id}`

**Response:** `204 No Content`

---

### 6. Quiz Results

A **QuizResult** records a student's quiz attempt, score, and answers.

#### 6.1 Submit Quiz (Create Result)
**POST** `/api/v1/quizzes/{quiz_id}/submit`

**Request:**
```json
{
  "answers": [
    {
      "question_id": 42,
      "selected_answer_id": 101
    },
    {
      "question_id": 43,
      "selected_answer_id": 207
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": 99,
  "quiz_id": 7,
  "score": 1,
  "total_questions": 2,
  "percentage": 50.00,
  "completed_at": "2026-10-03T11:15:00Z",
  "feedback": {
    "passed": false,
    "message": "You scored 1 out of 2. Review the materials and try again."
  }
}
```

**Validation:**
- All questions in the quiz must have answers
- `selected_answer_id` must be a valid answer for the question

**Calculation:**
- Backend compares each `selected_answer_id` against the correct answer
- `score` = count of correct answers
- `total_questions` = total questions in quiz
- `percentage` = (score / total_questions) * 100

---

#### 6.2 Get Quiz Results for a Subject
**GET** `/api/v1/subjects/{subject_id}/quiz-results`

**Response:** `200 OK`
```json
{
  "quiz_results": [
    {
      "id": 99,
      "quiz_id": 7,
      "quiz_title": "Programming Chapter 1 Quiz",
      "score": 1,
      "total_questions": 2,
      "percentage": 50.00,
      "completed_at": "2026-10-03T11:15:00Z"
    },
    {
      "id": 100,
      "quiz_id": 7,
      "quiz_title": "Programming Chapter 1 Quiz",
      "score": 2,
      "total_questions": 2,
      "percentage": 100.00,
      "completed_at": "2026-10-03T12:30:00Z"
    }
  ],
  "total": 2,
  "average_percentage": 75.00
}
```

---

#### 6.3 Get Quiz Result Details
**GET** `/api/v1/quiz-results/{id}`

**Response:** `200 OK`
```json
{
  "id": 99,
  "quiz_id": 7,
  "quiz_title": "Programming Chapter 1 Quiz",
  "score": 1,
  "total_questions": 2,
  "percentage": 50.00,
  "completed_at": "2026-10-03T11:15:00Z",
  "student_answers": [
    {
      "question_id": 42,
      "question_text": "What is a variable?",
      "selected_answer_id": 102,
      "selected_answer_text": "A type of function",
      "correct_answer_id": 101,
      "correct_answer_text": "A named storage location for data",
      "is_correct": false
    },
    {
      "question_id": 43,
      "question_text": "What does 'int' mean?",
      "selected_answer_id": 207,
      "selected_answer_text": "Integer",
      "correct_answer_id": 207,
      "correct_answer_text": "Integer",
      "is_correct": true
    }
  ]
}
```

---

#### 6.4 Delete Quiz Result
**DELETE** `/api/v1/quiz-results/{id}`

**Response:** `204 No Content`

---

## Request/Response Patterns

### 6. Pagination (Future Enhancement)

For endpoints that return lists, we will add pagination support:

**Query Parameters:**
- `page`: Page number (1-indexed). Default: 1
- `per_page`: Items per page. Default: 20, Max: 100

**Example:** `GET /api/v1/subjects?page=2&per_page=10`

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "per_page": 10,
    "total": 45,
    "total_pages": 5
  }
}
```

---

## MVP Scope

For the **Midterm Demo (Week 5)**, the API will support:

### Must Have
-  Create, read, update, delete subjects
-  Create, read, update, mark complete, delete tasks
-  Create, read, update, delete quizzes
-  Create, read, update, delete questions and answers
-  Submit quiz and get score
-  View quiz results

### Nice to Have
-  Study plan endpoint (GET tasks for a subject)
-  Task filtering by status

### Post-MVP (Week 6+)
-  User authentication and multi-user support
-  AI-generated study plans and quizzes
-  Notification/reminder system
-  Student analytics and progress tracking

---

## Backend Implementation Checklist

### Week 5 Implementation Owners

| Task | Owner | Status |
|---|---|---|
| API Setup (Flask/FastAPI + CORS) | Nabin Khadka | In progress |
| Subject endpoints (CRUD) | Sumit Adhikari | In progress |
| Task endpoints (CRUD + complete) | Sumit Adhikari / Prince Karki | In progress |
| Quiz endpoints (CRUD) | Prince Karki | In progress |
| Question/Answer endpoints (CRUD) | Prince Karki | In progress |
| Submit quiz + scoring | J.N Taj Oli | In progress |
| Quiz results endpoints | J.N Taj Oli | In progress |
| Error handling & validation | Prabin Rai | In progress |
| API documentation (Swagger/OpenAPI) | Nabin Khadka | Pending |
| Integration testing | Team | Pending |

---

## Example Frontend Integration

### Create Subject (React + Fetch)

```javascript
async function createSubject(name, description, color) {
  const response = await fetch('http://localhost:5000/api/v1/subjects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, color })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
  
  return await response.json();
}
```

### Mark Task Complete (React + Fetch)

```javascript
async function completeTask(taskId) {
  const response = await fetch(
    `http://localhost:5000/api/v1/tasks/${taskId}/complete`,
    { method: 'PUT' }
  );
  
  if (!response.ok) throw new Error('Failed to complete task');
  return await response.json();
}
```

### Submit Quiz (React + Fetch)

```javascript
async function submitQuiz(quizId, answers) {
  const response = await fetch(
    `http://localhost:5000/api/v1/quizzes/${quizId}/submit`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    }
  );
  
  if (!response.ok) throw new Error('Failed to submit quiz');
  return await response.json();
}
```

---

## CORS Configuration

The backend must enable CORS to allow requests from the React frontend:

```python
# FastAPI example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## References

- [Database Design](./database-design.md) — Database schema
- [ARCHITECTURE_AND_SETUP.md](./ARCHITECTURE_AND_SETUP.md) — Tech stack and setup
- [Authentication Decision](./Authentication_Techinical_Decision.md) — No auth for MVP
- [WEEK_5_WORKLIST.md](./WEEK_5_WORKLIST.md) — Team responsibilities

---

## Document History

| Date | Author | Change |
|---|---|---|
| 2026-10-03 | Nabin Khadka | Initial API Design |

---

**Document Owner:** Nabin Khadka  
**Last Updated:** 2026-10-03  
**Status:** Ready for implementation
