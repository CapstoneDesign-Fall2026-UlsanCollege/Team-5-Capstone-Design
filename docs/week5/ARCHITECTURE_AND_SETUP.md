# Smart Study Companion — Architecture and Setup

**Project:** Smart Study Companion  
**Team:** Team 5 
**Course:** Capstone Design — Fall 2026  
**Last Updated:** Week 5  

---

## Overview

Smart Study Companion is a web application that helps students manage study tasks and take quizzes.

MVP goal:
- Create subjects
- Add tasks with deadlines
- Mark tasks complete
- Take a quiz and see score
- Save data after refresh

---

## Technology Stack

### Frontend
- React
- Vite
- CSS / Tailwind

### Backend
- Python
- FastAPI or Flask
- SQLite (MVP)

### Database
- SQLite for local testing
- PostgreSQL for later production

---

## Simple Architecture

```text
React Frontend (UI)
      │
      │ HTTP requests
      ▼
Python Backend (API)
      │
      │ Database queries
      ▼
SQLite/PostgreSQL
```

### Main app flow
1. User creates a subject
2. User adds study tasks for that subject
3. User marks tasks as completed
4. User selects a quiz
5. User answers questions
6. Backend stores data and returns score
7. App shows score and saves progress

---

## Project Structure

```text
Team-5-Capstone-Design/
├── docs/
│   └── week5/
│       └── ARCHITECTURE_AND_SETUP.md
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── routes/
│   └── requirements.txt
├── README.md
└── .gitignore
```

---

## Frontend Setup (React)

### 1. Install Node.js
Install Node.js 18+ from nodejs.org.

### 2. Create React app
```bash
cd frontend
npm install
```

### 3. Run app
```bash
npm run dev
```
Open the browser on:
```text

```

---

## Backend Setup (Python)

### 1. Install Python
Install Python 3.10+

### 2. Create virtual environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 3. Install Python packages
```bash
pip install fastapi uvicorn sqlalchemy sqlite3
```

Or if using Flask:
```bash
pip install flask flask-cors sqlite3
```

### 4. Run backend
```bash
python app.py
```

Default backend URL:
```text

```

---

## Basic API Design

### Subjects
- `GET /subjects` — get all subjects
- `POST /subjects` — create subject

### Tasks
- `GET /subjects/{id}/tasks` — get tasks for one subject
- `POST /tasks` — create task
- `PUT /tasks/{id}` — update task status

### Quiz
- `GET /quiz/{subject_id}` — get quiz questions
- `POST /quiz-result` — save quiz result

---

## Data Model

### Subject
```text
id
name
created_at
```

### Task
```text
id
subject_id
title
deadline
completed
created_at
```

### Quiz Result
```text
id
subject_id
score
total_questions
completed_at
```

---

## Example Backend Code

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Smart Study Companion API"}

@app.get("/subjects")
def get_subjects():
    return [{"id": 1, "name": "Programming"}]
```

---

## Frontend to Backend Connection

Example in React:
```javascript
const response = await fetch("http://localhost:8000/subjects");
const data = await response.json();
console.log(data);
```

---

## Development Workflow

1. Start backend
2. Start frontend
3. Create subject
4. Add tasks
5. Mark task complete
6. Take quiz
7. Save result
8. Test refresh behavior

---

## Testing Checklist

- [ ] Frontend runs on (pending)
- [ ] Backend runs on (pending)
- [ ] Subject can be created
- [ ] Task can be added
- [ ] Task can be marked complete
- [ ] Quiz score is calculated correctly
- [ ] Data remains after refresh

---

## Team Responsibility

| Feature | Owner |
|--------|-------|
| React frontend | Nabin Khadka |
| Python backend | Nabin Khadka/ J.N. Taj Oli |
| Data storage | Adronnie/ prince |
| Quiz logic | Rai prabin |
| Documentation | J.N. Taj Oli |

---

## Notes

This project is a simple MVP. We are not using a large complex architecture right now. The main objective is to deliver a working study planner and quiz system with simple clean code.

For the midterm, the important focus is:
- working frontend
- working backend
- simple database
- correct task and quiz logic

---

## Quick Start(Notes)

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy
python app.py

# Frontend
cd frontend
npm install
npm run dev
```






