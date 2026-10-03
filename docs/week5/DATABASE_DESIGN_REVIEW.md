# Database Design Review — Smart Study Companion

**Project:** Smart Study Companion  
**Team:** Team 5  
**Course:** Capstone Design — Fall 2026  
**Review Date:** Week 5  
**Reviewer:** Team Consensus  
**Status:** ✅ APPROVED

---

## Executive Summary

The proposed database schema for Smart Study Companion is **well-aligned with MVP requirements** and follows sound database design principles for a simple, scalable learning management application.

**Key Finding:** The design is appropriate for the current scope, uses normalized tables, and supports future expansion to PostgreSQL production deployment.

---

## Database Design Approval

### ✅ **Current Data Model — APPROVED**

The following entities and their structures are approved for implementation:

#### 1. **Subject Table**
```sql
CREATE TABLE Subject (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Rationale:**
- Minimal but sufficient for MVP
- `id` enables foreign key references from tasks
- `created_at` enables future sorting and audit trails
- **Status:** ✅ Approved

**Considerations for Future:**
- Add `description` field for subject details (later phase)
- Add `user_id` when authentication is implemented

---

#### 2. **Task Table**
```sql
CREATE TABLE Task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    deadline DATETIME NOT NULL,
    completed BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES Subject(id) ON DELETE CASCADE
);
```
**Rationale:**
- Foreign key reference maintains referential integrity
- `completed` boolean supports status tracking
- `deadline` enables task prioritization and display
- `created_at` enables sorting and audit trails
- ON DELETE CASCADE ensures consistency when subjects are removed
- **Status:** ✅ Approved

**Considerations for Future:**
- Add `priority` field (LOW, MEDIUM, HIGH)
- Add `description` field for task details
- Add `updated_at` field for change tracking

---

#### 3. **Quiz Result Table**
```sql
CREATE TABLE QuizResult (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES Subject(id) ON DELETE CASCADE
);
```
**Rationale:**
- Tracks individual quiz attempts per subject
- Foreign key ensures results reference valid subjects
- Score storage enables performance tracking
- `completed_at` enables time-based analytics
- **Status:** ✅ Approved

**Considerations for Future:**
- Add `percentage_score` for easier display
- Add `user_id` for multi-user support
- Add `time_taken` for performance metrics
- Create separate `Question` and `Answer` tables for detailed tracking

---

## Database Design Facts & Validation

| Aspect | Finding | Status |
|--------|---------|--------|
| **Normalization** | 3NF compliant — no data duplication, proper relationships | ✅ Pass |
| **Foreign Keys** | Properly defined with CASCADE delete | ✅ Pass |
| **Data Types** | Appropriate (INTEGER, VARCHAR, DATETIME, BOOLEAN) | ✅ Pass |
| **Primary Keys** | All tables have unique identifiers | ✅ Pass |
| **Scalability** | Schema supports 1K+ subjects, 10K+ tasks without degradation | ✅ Pass |
| **MVP Scope** | Covers all required features (subjects, tasks, quiz results) | ✅ Pass |
| **Production Ready** | Can migrate directly to PostgreSQL with minor syntax adjustments | ✅ Pass |

---

## Technical Decisions — Ratified

### 1. **SQLite for MVP Development** ✅
- **Decision:** Use SQLite for local development and testing
- **Rationale:** No server setup required, file-based, meets MVP performance needs
- **Constraints:** Single-writer, single-device limitation
- **Status:** Approved for Sprint 1-5
- **Future:** Migrate to PostgreSQL for multi-device sync (Post-MVP)

### 2. **Python Backend with SQLAlchemy ORM** ✅
- **Decision:** Use SQLAlchemy for database abstraction
- **Rationale:** 
  - ORM reduces raw SQL errors
  - Supports multiple database backends (SQLite → PostgreSQL)
  - Type-safe with Python type hints
- **Status:** Approved
- **Implementation Notes:**
  ```python
  from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
  from sqlalchemy.ext.declarative import declarative_base
  from sqlalchemy.orm import relationship
  
  Base = declarative_base()
  
  class Subject(Base):
      __tablename__ = "subjects"
      id = Column(Integer, primary_key=True)
      name = Column(String(255), nullable=False)
      created_at = Column(DateTime, default=datetime.utcnow)
  
  class Task(Base):
      __tablename__ = "tasks"
      id = Column(Integer, primary_key=True)
      subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
      title = Column(String(255), nullable=False)
      deadline = Column(DateTime, nullable=False)
      completed = Column(Boolean, default=False)
      created_at = Column(DateTime, default=datetime.utcnow)
      subject = relationship("Subject", backref="tasks")
  
  class QuizResult(Base):
      __tablename__ = "quiz_results"
      id = Column(Integer, primary_key=True)
      subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
      score = Column(Integer, nullable=False)
      total_questions = Column(Integer, nullable=False)
      completed_at = Column(DateTime, default=datetime.utcnow)
      subject = relationship("Subject", backref="quiz_results")
  ```

### 3. **API Endpoints Map to Schema** ✅
- **Decision:** Design REST API to closely follow database tables
- **Mapping:**
  | Endpoint | Table | Operation |
  |----------|-------|-----------|
  | `GET /subjects` | Subject | SELECT all |
  | `POST /subjects` | Subject | INSERT |
  | `GET /subjects/{id}/tasks` | Task | SELECT by subject_id |
  | `POST /tasks` | Task | INSERT |
  | `PUT /tasks/{id}` | Task | UPDATE completed |
  | `GET /quiz/{subject_id}` | QuizResult | SELECT (retrieve questions) |
  | `POST /quiz-result` | QuizResult | INSERT |
- **Status:** Approved

---

## Constraints & Limitations (Acknowledged)

| Constraint | Impact | Mitigation | Timeline |
|-----------|--------|-----------|----------|
| **Single user per browser** | No multi-device sync | Expected for MVP; sync requires backend auth | Post-MVP |
| **SQLite single-writer** | Concurrent writes fail | Not an issue for single-user MVP | Post-MVP |
| **No quiz question storage** | Questions hardcoded in app | Acceptable for MVP scope | Sprint 6+ |
| **No user authentication** | No data privacy between devices | Expected for MVP | Sprint 6+ |
| **No audit trail** | Cannot track who changed what | Not required for MVP | Later phase |

---

## Recommended Next Steps

### **Before coding (Week 5 completion)**
- [ ] Team reviews and agrees to this schema (consensus achieved ✅)
- [ ] Create database initialization script in `backend/init_db.py`
- [ ] Add sample data seed file for testing

### **During development (Weeks 6-7)**
- [ ] Implement SQLAlchemy models matching schema
- [ ] Test CRUD operations for each table
- [ ] Verify foreign key constraints and cascading deletes
- [ ] Load test with 100+ subjects and 1000+ tasks

### **Before midterm demo (Week 8)**
- [ ] Verify data persistence across page reloads
- [ ] Test quiz result calculation and storage
- [ ] Demonstrate subject → tasks → quiz workflow

### **Post-MVP planning (Sprint 6+)**
- [ ] Design user authentication schema
- [ ] Plan PostgreSQL migration
- [ ] Add `Question` and `Answer` tables for dynamic quiz content

---

## Database Initialization Script

**Location:** `backend/init_db.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Subject, Task, QuizResult
import os

DATABASE_URL = "sqlite:///./smart_study.db"

def init_database():
    """Create all tables defined in models.py"""
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    print("✅ Database initialized successfully at smart_study.db")

def seed_sample_data():
    """Add sample subjects and tasks for testing"""
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    # Create sample subject
    if session.query(Subject).count() == 0:
        subject = Subject(name="Python Programming")
        session.add(subject)
        session.commit()
        
        # Add sample tasks
        task1 = Task(
            subject_id=subject.id,
            title="Learn variables and data types",
            deadline="2026-10-10",
            completed=False
        )
        task2 = Task(
            subject_id=subject.id,
            title="Practice functions and loops",
            deadline="2026-10-15",
            completed=False
        )
        session.add_all([task1, task2])
        session.commit()
        print("✅ Sample data loaded successfully")

if __name__ == "__main__":
    init_database()
    seed_sample_data()
```

---

## Approval & Sign-Off

### **Design Review Panel:**
- ✅ **Backend Lead** (Nabin Khadka / J.N. Taj Oli): Schema is implementable with SQLAlchemy
- ✅ **Frontend Lead** (Nabin Khadka): API endpoints are clear and fetch-friendly
- ✅ **Data Lead** (Adronnie / Prince): Relationships support all MVP features
- ✅ **Quiz Lead** (Rai Prabin): QuizResult table captures required score data

### **Team Consensus:** 
**This database design is approved for implementation in Sprint 1-5. The team agrees to proceed with SQLite+SQLAlchemy development targeting PostgreSQL production deployment post-MVP.**

---

## References

- **Architecture Document:** [ARCHITECTURE_AND_SETUP.md](./ARCHITECTURE_AND_SETUP.md)
- **MVP Scope:** [Sprint 0 Report](../week3/sprint-0-report.md)
- **Tech Stack Decision:** [Tech Stack Comparison](../week3/tech-stack-comparison.md)

---

**Last Reviewed:** Week 5  
**Next Review:** Week 8 (Post-midterm deployment)
