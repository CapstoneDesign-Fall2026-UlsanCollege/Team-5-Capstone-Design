# Smart Study Companion — Architecture and Setup Documentation

**Project:** Smart Study Companion (Study Planner + Quiz Tool)  
**Team:** DJ Barut, Nabin Khadka, Adronnie, Prince, RaiPrabin697, Sumit Adhikari, J.N. Taj Oli  
**Last Updated:** Week 5 (October 2026)  
**Course:** Capstone Design — Fall 2026  
**Institution:** Ulsan College  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Component Breakdown](#3-component-breakdown)
4. [Data Flow and State Management](#4-data-flow-and-state-management)
5. [Technology Stack](#5-technology-stack)
6. [Local Development Setup](#6-local-development-setup)
7. [Project Structure](#7-project-structure)
8. [Core Features and Requirements](#8-core-features-and-requirements)
9. [Development Workflow](#9-development-workflow)
10. [Testing Strategy](#10-testing-strategy)
11. [Deployment and Environments](#11-deployment-and-environments)
12. [Configuration and Environment Variables](#12-configuration-and-environment-variables)
13. [Known Limitations and Future Work](#13-known-limitations-and-future-work)
14. [Troubleshooting](#14-troubleshooting)
15. [Team Roles and Responsibilities](#15-team-roles-and-responsibilities)
16. [References and Evidence Links](#16-references-and-evidence-links)

---

## 1. Project Overview

### What is Smart Study Companion?

Smart Study Companion is a web-based application designed to help college students efficiently manage their study tasks and test their knowledge through interactive quizzes. The MVP (Minimum Viable Product) focuses on core study planning and assessment features, with the roadmap including AI-assisted study plans and automated quiz generation.

### Midterm Goal (MVP Scope)

By the midterm demonstration, a student should be able to:
1. Create a study subject (e.g., "Programming")
2. Add multiple study tasks with deadlines
3. View all tasks in a study plan
4. Mark tasks as completed
5. Take a simple multiple-choice quiz
6. See their quiz score and results
7. Have all data persist after a browser refresh (using localStorage)

### Key Principles

- **Simple and intuitive:** Keep the UI clean and easy to use for busy students
- **Local-first MVP:** No backend required initially; use browser localStorage for persistence
- **Testable:** All features should have clear, measurable acceptance criteria
- **Collaborative:** Clear ownership and documentation for each component
- **Incremental:** Build the MVP first, then add AI and advanced features

### Out of Scope for MVP

- User authentication and accounts
- Cloud backend services
- AI-generated study plans or quiz questions
- Automated reminders and notifications
- Mobile app (web-responsive only)
- Real-time multi-user features

---

## 2. System Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Smart Study Companion                       │
│                      (React + Vite Web App)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
            ┌────────┐   ┌────────┐   ┌────────────┐
            │   UI   │   │ React  │   │  Routing   │
            │ Layer  │   │ Logic  │   │   (React   │
            │        │   │        │   │   Router)  │
            └────────┘   └────────┘   └────────────┘
                │             │
                └─────────────┼──────────────┐
                              ▼              ▼
                        ┌──────────┐   ┌─────────────────┐
                        │  State   │   │  localStorage   │
                        │Management│   │   (Browser      │
                        │ (Context)│   │   Persistence)  │
                        └──────────┘   └─────────────────┘
                              │
                ┌─────────────┴──────────────┬────────────────┐
                ▼                             ▼                ▼
           ┌─────────────┐         ┌──────────────────┐  ┌──────────┐
           │  Subjects   │         │  Study Tasks     │  │ Quiz &   │
           │  Component  │         │  Component       │  │ Results  │
           └─────────────┘         └──────────────────┘  └──────────┘
                │                         │                   │
                └─────────────────────────┼───────────────────┘
                                          ▼
                              ┌───────────────────────┐
                              │  Data Models (Local)  │
                              │  - subjects[]         │
                              │  - tasks[]            │
                              │  - quizResults[]      │
                              └───────────────────────┘
```

### High-Level Data Storage

All data is stored in the browser's `localStorage` with the following structure:

```json
{
  "subjects": [
    {
      "id": "subject-1",
      "name": "Programming",
      "color": "#4f46e5"
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "subjectId": "subject-1",
      "title": "Review chapter 2",
      "deadline": "2026-09-25",
      "completed": false
    }
  ],
  "quizResults": [
    {
      "id": "quiz-1",
      "subjectId": "subject-1",
      "score": 80,
      "totalQuestions": 2,
      "completedAt": "2026-09-20T10:00:00Z"
    }
  ]
}
```

---

## 3. Component Breakdown

### 3.1 Frontend Components

#### A. App Root Component
- **File:** `src/App.jsx`
- **Role:** Main entry point; manages routing and global state
- **Responsibilities:**
  - Initialize React Router
  - Load data from localStorage on mount
  - Provide state context to all child components

#### B. Subject Management
- **Components:**
  - `SubjectList.jsx` — Display all subjects
  - `SubjectForm.jsx` — Create new subject
  - `SubjectDetail.jsx` — View and manage a specific subject
- **Role:** Handle subject CRUD operations
- **Data managed:**
  - Subject name
  - Subject ID
  - Color/styling

#### C. Task Management
- **Components:**
  - `TaskList.jsx` — Display tasks for a subject
  - `TaskForm.jsx` — Add or edit a task
  - `TaskItem.jsx` — Individual task row with completion toggle
- **Role:** Handle task CRUD and status tracking
- **Data managed:**
  - Task title
  - Deadline
  - Completion status
  - Associated subject

#### D. Study Plan View
- **File:** `src/components/StudyPlan.jsx`
- **Role:** Central dashboard showing all tasks grouped by subject
- **Features:**
  - Group tasks by subject
  - Show completion status
  - Display upcoming deadlines
  - Quick access to quiz

#### E. Quiz Component
- **Components:**
  - `Quiz.jsx` — Main quiz container
  - `QuestionCard.jsx` — Individual question display
  - `AnswerOptions.jsx` — Multiple choice options
  - `QuizResults.jsx` — Score and results display
- **Role:** Handle quiz workflow and scoring
- **Data managed:**
  - Questions and correct answers
  - User answers
  - Score calculation
  - Results persistence

#### F. Layout and Navigation
- **Components:**
  - `Header.jsx` — Top navigation bar
  - `Navigation.jsx` — Main menu/sidebar
  - `Footer.jsx` — Footer with credits/links
- **Role:** Provide consistent UI structure across all pages

### 3.2 State Management

#### Context API (React Context)
- **File:** `src/context/AppContext.jsx`
- **Provides:**
  - Global app state (subjects, tasks, quiz results)
  - State update functions (create, update, delete)
  - localStorage sync hooks

#### localStorage Interface
- **Module:** `src/utils/storage.js`
- **Functions:**
  - `loadState()` — Retrieve all data from localStorage
  - `saveState()` — Persist state changes to localStorage
  - `clearState()` — Wipe all data (for testing/reset)

---

## 4. Data Flow and State Management

### 4.1 User Flow - Subject to Quiz

```
1. App Start
   └─> Load subjects from localStorage
   └─> Display Subject List screen

2. User Creates Subject "Programming"
   └─> SubjectForm captures input
   └─> New subject added to state
   └─> localStorage updated
   └─> Subject List re-renders with new entry

3. User Selects "Programming"
   └─> Navigate to Subject Detail / Study Plan
   └─> Load tasks for subject from state
   └─> Display Task List for "Programming"

4. User Adds Task with Deadline
   └─> TaskForm captures title + deadline
   └─> New task added to state
   └─> Task list re-renders

5. User Marks Task as Completed
   └─> TaskItem click handler toggles completed flag
   └─> State updated
   └─> localStorage synced
   └─> Visual indicator updates

6. User Selects Quiz
   └─> Load quiz questions (hardcoded for MVP)
   └─> Display Question 1/n
   └─> User selects answer

7. User Submits Quiz
   └─> Compare user answers to correct answers
   └─> Calculate score
   └─> Save result to state and localStorage
   └─> Display Results screen

8. Page Reload
   └─> App re-mounts
   └─> localStorage data restored
   └─> Subject, task completion, and quiz result all persist
```

### 4.2 State Synchronization

**React Component → State Update:**
```
User Action (e.g., task completed)
    ↓
Event Handler (e.g., onClick)
    ↓
setState() or Context dispatch
    ↓
React re-render
    ↓
localStorage.setItem() called
```

**Page Reload:**
```
Browser refresh
    ↓
App component mounts
    ↓
useEffect hook runs
    ↓
localStorage.getItem() retrieves data
    ↓
Context setState with loaded data
    ↓
Components re-render with persisted state
```

---

## 5. Technology Stack

### Frontend Framework
- **React 18.x** — UI library with hooks and context
  - Why: Component-based, good for reusable UI, team familiarity
- **Vite** — Build tool and dev server
  - Why: Fast HMR (hot module replacement), modern ES modules, quick setup
- **React Router v6** — Client-side navigation
  - Why: Declarative routing, easy page transitions, URL state management

### Styling
- **TailwindCSS** (recommended) or **CSS Modules**
  - Why: Rapid UI development, consistent design system, utility-first
  - Alternative: Plain CSS + custom stylesheet if team prefers

### State Management
- **React Context API** — Global state (subjects, tasks, quiz results)
  - Why: Built-in to React, no external dependencies, sufficient for MVP
- **localStorage** — Browser-based persistence
  - Why: No backend needed, works offline, simple for MVP

### Development Tools
- **Node.js 16.x or higher**
- **npm or yarn** — Package manager
- **Git** — Version control
- **VS Code** (recommended IDE)

### Testing (Post-MVP)
- **Vitest** or **Jest** — Unit testing
- **React Testing Library** — Component testing
- **Playwright** or **Cypress** — E2E testing

### Browser Support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires localStorage support

---

## 6. Local Development Setup

### 6.1 Prerequisites

Before you start, ensure you have:
- **Node.js v16+** (check: `node --version`)
- **npm v7+** (check: `npm --version`)
- **Git** installed and configured
- A **code editor** (VS Code recommended)
- A GitHub account with access to the repository

### 6.2 Step-by-Step Setup

#### Step 1: Clone the Repository

```bash
git clone https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design.git
cd Team-5-Capstone-Design
```

#### Step 2: Navigate to the App Directory

```bash
cd src  # or wherever the React app root is
```

#### Step 3: Install Dependencies

```bash
npm install
# or
yarn install
```

This installs:
- React and React DOM
- Vite and build tools
- React Router
- TailwindCSS (if configured)
- Any other dependencies listed in `package.json`

#### Step 4: Run the Development Server

```bash
npm run dev
# or
yarn dev
```

**Expected output:**
```
  VITE v4.x.x  ready in xx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

#### Step 5: Open in Browser

Navigate to `http://localhost:5173/` in your web browser. You should see the Smart Study Companion home screen.

#### Step 6: Verify Setup

- **Test Subject Creation:** Click "Create Subject" and add a test subject
- **Test Task Addition:** Add a task with a deadline
- **Test Persistence:** Open browser DevTools → Application → localStorage → verify data is saved
- **Test Refresh:** Refresh the page (Ctrl+R) and verify data persists

If all steps pass, your local setup is complete! ✅

### 6.3 Common Setup Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `npm install` fails | Node version incompatible | Run `node --version`. Ensure v16+. Consider using [nvm](https://github.com/nvm-sh/nvm) |
| Port 5173 already in use | Another app is using the port | Run `npm run dev -- --port 3000` to use a different port |
| Module not found errors | Missing dependencies | Run `npm install` again or delete `node_modules` and reinstall |
| localStorage not persisting | Browser private/incognito mode | Use a regular browser window; private mode has limited storage |

---

## 7. Project Structure

```
Team-5-Capstone-Design/
├── docs/
│   ├── week1/                          # Launch and project ideas
│   ├── week2/                          # Design docs and research
│   ├── week3/                          # Architecture and sprint planning
│   ├── week4/                          # Checkpoint and progress
│   ├── week5/                          # Current week
│   │   ├── ARCHITECTURE_AND_SETUP.md   # ← You are here
│   │   └── README.md                   # Week 5 overview
│   └── README.md                       # Main docs index
├── src/                                # React app root
│   ├── components/
│   │   ├── App.jsx                     # Root component
│   │   ├── Header.jsx                  # Top navigation
│   │   ├── Navigation.jsx              # Sidebar/menu
│   │   ├── SubjectList.jsx             # Subject management
│   │   ├── SubjectForm.jsx
│   │   ├── SubjectDetail.jsx
│   │   ├── TaskList.jsx                # Task management
│   │   ├── TaskForm.jsx
│   │   ├── TaskItem.jsx
│   │   ├── StudyPlan.jsx               # Main dashboard
│   │   ├── Quiz.jsx                    # Quiz workflow
│   │   ├── QuestionCard.jsx
│   │   ├── AnswerOptions.jsx
│   │   └── QuizResults.jsx
│   ├── context/
│   │   └── AppContext.jsx              # Global state provider
│   ├── hooks/                          # Custom React hooks
│   │   └── useLocalStorage.js          # localStorage hook (if used)
│   ├── utils/
│   │   ├── storage.js                  # localStorage interface
│   │   └── helpers.js                  # Utility functions
│   ├── styles/
│   │   ├── App.css                     # Global styles or Tailwind imports
│   │   └── components.css              # Component-specific styles
│   ├── data/
│   │   └── quizQuestions.js            # Sample quiz questions (MVP)
│   ├── main.jsx                        # Vite entry point
│   └── index.html                      # HTML template
├── public/                             # Static assets
│   └── (logos, images, etc.)
├── .gitignore                          # Git ignore rules
├── .env.example                        # Environment variables template
├── package.json                        # NPM dependencies and scripts
├── vite.config.js                      # Vite configuration
├── README.md                           # Project root README
└── ARCHITECTURE_AND_SETUP.md           # This file (symlinked or copied to root)
```

### Key Directories Explained

- **`docs/`** — All documentation organized by week
- **`src/components/`** — React components (reusable UI pieces)
- **`src/context/`** — Global state management (React Context)
- **`src/utils/`** — Helper functions (localStorage, calculations, etc.)
- **`src/data/`** — Hardcoded quiz questions and sample data
- **`src/styles/`** — CSS and styling files

---

## 8. Core Features and Requirements

### 8.1 MVP Features (Midterm Scope)

#### Feature 1: Subject Management
- **User Can Create a Subject**
  - Input: Subject name (e.g., "Programming", "Math", "Biology")
  - Output: Subject appears in subject list
  - Storage: Subject saved in localStorage
  - Definition of Done: Refresh page; subject persists

- **User Can View All Subjects**
  - Display: List of created subjects
  - Action: Click to select a subject
  - Navigation: Opens Subject Detail / Study Plan view

#### Feature 2: Task Management
- **User Can Add a Task**
  - Input: Task title, subject, deadline (date picker)
  - Output: Task appears in study plan
  - Storage: Task saved in localStorage
  - Definition of Done: Refresh page; task persists with correct deadline and subject

- **User Can Mark a Task Complete**
  - Action: Click checkbox or button on task row
  - Output: Task visually marked as complete (strikethrough, checkmark, etc.)
  - Storage: Completion status saved in localStorage
  - Definition of Done: Refresh page; completed status persists

- **User Can View Tasks in Study Plan**
  - Display: All tasks for a subject grouped by deadline or status
  - Filters: Show pending and completed tasks
  - Visual cues: Highlight overdue tasks, show completion percentage

#### Feature 3: Quiz
- **User Can Take a Quiz**
  - Format: Multiple-choice questions (4 options per question)
  - Questions: Hardcoded sample questions related to subject (MVP; no AI)
  - Interaction: Select one answer per question; click Submit

- **User Can See Quiz Results**
  - Display: Score (X / total), percentage correct
  - Details: Show which questions were answered incorrectly
  - Storage: Quiz result saved in localStorage
  - Definition of Done: Refresh page; quiz result persists

#### Feature 4: Data Persistence
- **All Data Survives Browser Refresh**
  - Mechanism: localStorage in browser
  - Scope: Subjects, tasks, completion status, quiz results
  - Definition of Done: Create data → refresh page → all data intact

### 8.2 Post-MVP Features (Roadmap)

- AI-generated study plans based on subject and deadline
- Automated quiz question generation
- Reminder notifications for upcoming deadlines
- User authentication and cloud storage
- Mobile app (native or PWA)
- Collaboration features (shared study groups)
- Advanced analytics and progress tracking

---

## 9. Development Workflow

### 9.1 Git Workflow

#### Creating a Feature Branch

```bash
# 1. Start from main branch
git checkout main
git pull origin main

# 2. Create a new feature branch (naming convention: feature/description)
git checkout -b feature/add-task-creation

# 3. Make your changes and commit
git add .
git commit -m "Add task creation form and localStorage sync"

# 4. Push to remote
git push origin feature/add-task-creation
```

#### Creating a Pull Request (PR)

- Push your branch and open a PR on GitHub
- Link any related GitHub Issues (e.g., "Closes #17")
- Add a clear description of changes
- Request review from team members
- Once approved, merge to `main`

#### Commit Message Conventions

Use clear, concise commit messages:

```
[Issue #XX] Brief description of change

Optional longer explanation of why this change
was made and any relevant context.
```

Example:
```
[Issue #17] Add subject creation form

- Implement SubjectForm component
- Integrate with AppContext for state management
- Add localStorage persistence for subjects
- Test: Subjects persist after browser refresh
```

### 9.2 Code Review Standards

Before marking a PR as ready, ensure:

- ✅ Code runs without errors (`npm run dev` works)
- ✅ Feature described in GitHub Issue is complete
- ✅ localStorage persistence verified (if applicable)
- ✅ Components are properly named and organized
- ✅ No console errors or warnings
- ✅ Documentation updated (if changes are significant)

### 9.3 Issue Tracking

**Every piece of work should have a GitHub Issue:**

1. **Create an Issue** with a clear title and description
2. **Assign ownership** (who will work on it)
3. **Add a Definition of Done** (checklist of completion criteria)
4. **Create a branch** linked to the Issue (e.g., `git checkout -b feature/issue-17`)
5. **Open a PR** and reference the Issue number
6. **Close the Issue** when PR is merged

---

## 10. Testing Strategy

### 10.1 Manual Testing (MVP)

Until automated tests are set up, perform manual tests:

#### Subject Management Test
```
1. Open app
2. Click "Create Subject"
3. Enter "Programming" and submit
4. Verify subject appears in list
5. Refresh page
6. Verify subject still exists
Result: PASS / FAIL
```

#### Task Management Test
```
1. Select "Programming" subject
2. Click "Add Task"
3. Enter title "Review chapter 1" and deadline "2026-10-05"
4. Submit
5. Verify task appears with correct deadline
6. Click checkbox to mark complete
7. Verify visual change (strikethrough, etc.)
8. Refresh page
9. Verify task still marked complete
Result: PASS / FAIL
```

#### Quiz Test
```
1. Select "Programming" subject
2. Click "Take Quiz"
3. Answer Q1 with option "A", Q2 with option "B"
4. Click "Submit"
5. Verify score displays correctly (e.g., "1 / 2")
6. Refresh page
7. Verify quiz result persists
Result: PASS / FAIL
```

#### localStorage Verification
```
Open browser DevTools:
- Press F12 → Application tab → localStorage
- Look for stored data structure
- Verify subjects, tasks, quizResults keys exist
- Check data format matches schema
Result: PASS / FAIL
```

### 10.2 Automated Testing (Post-MVP)

Once the app is stable, add:

- **Unit Tests** (Vitest): Test utility functions and state logic
- **Component Tests** (React Testing Library): Test component rendering and interaction
- **E2E Tests** (Playwright/Cypress): Test full user workflows

### 10.3 Test Coverage Goals

| Feature | Automated | Manual | Owner |
|---------|-----------|--------|-------|
| Subject CRUD | Post-MVP | ✅ Week 5 | Nabin Khadka |
| Task CRUD | Post-MVP | ✅ Week 5 | Sumit Adhikari |
| Task Completion | Post-MVP | ✅ Week 5 | Prince |
| Quiz Workflow | Post-MVP | ✅ Week 5 | Prince |
| localStorage Persist | Post-MVP | ✅ Week 5 | Adronnie |

---

## 11. Deployment and Environments

### 11.1 Development Environment

**Where:** Local machine  
**How:** `npm run dev` (Vite dev server on `localhost:5173`)  
**Data:** localStorage only (no backend)  
**Access:** Local only

### 11.2 Production Environment (Future)

**Options:**
- **Vercel** — Easiest for React/Vite apps (free tier available)
- **Netlify** — Good alternative with similar features
- **GitHub Pages** — Free static hosting, works for SPA
- **Self-hosted** — Node.js server on AWS/DigitalOcean

**Example Vercel Deployment:**

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Vercel auto-detects Vite config
4. Build command: `npm run build`
5. Deploy!

### 11.3 Build for Production

```bash
npm run build
# Outputs optimized files to /dist folder

# Test production build locally:
npm run preview
```

---

## 12. Configuration and Environment Variables

### 12.1 Environment Variables

Create `.env.local` file (NOT committed to git):

```env
# .env.local (development)
VITE_API_URL=http://localhost:3000  # For future backend
VITE_ENV=development
VITE_APP_NAME=Smart Study Companion
```

### 12.2 .env.example Template

Commit this file to help team members:

```env
# .env.example (committed to repo)
VITE_API_URL=http://localhost:3000
VITE_ENV=development
VITE_APP_NAME=Smart Study Companion
```

### 12.3 Using Environment Variables in Code

```javascript
// src/config.js
export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  env: import.meta.env.VITE_ENV,
  appName: import.meta.env.VITE_APP_NAME,
};

// Usage in component:
import { config } from '../config.js';
console.log(config.appName); // "Smart Study Companion"
```

---

## 13. Known Limitations and Future Work

### 13.1 MVP Limitations

| Limitation | Impact | Workaround / Future Fix |
|-----------|--------|------------------------|
| No backend server | Data lost if localStorage cleared | Add cloud sync in post-MVP |
| No user authentication | All data is shared on device | Add user accounts in Phase 2 |
| Hardcoded quiz questions | Limited question variety | AI generation or admin panel (Phase 2) |
| No reminders/notifications | Students may miss deadlines | Implement browser notifications (Phase 2) |
| No real-time sync | No multi-device sync | Add backend database (Phase 2) |
| Offline only | No data backup | Add export/import feature or cloud (Phase 2) |
| Single-user | Not multi-tenant ready | Add authentication and user isolation |

### 13.2 Roadmap (Post-MVP)

**Phase 2 (After Midterm):**
- User authentication (login/signup)
- Backend API (Node.js/Express)
- Database (MongoDB or PostgreSQL)
- AI-powered study plans
- Quiz question generation

**Phase 3:**
- Mobile app (React Native or PWA)
- Real-time collaboration
- Advanced analytics dashboard
- Integration with learning platforms

**Phase 4:**
- Gamification (badges, achievements)
- Social features (study groups)
- Premium features and monetization

---

## 14. Troubleshooting

### Problem: "Cannot find module 'react'"

**Cause:** Dependencies not installed  
**Solution:**
```bash
npm install
# or
rm -rf node_modules package-lock.json
npm install
```

---

### Problem: "Port 5173 is already in use"

**Cause:** Another process is using the port  
**Solution:**
```bash
# Use a different port:
npm run dev -- --port 3000

# Or find and kill the process using port 5173:
# (On Mac/Linux)
lsof -i :5173
kill -9 <PID>

# (On Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

### Problem: "Data not persisting after refresh"

**Cause:** localStorage disabled or app not saving correctly  
**Solution:**
1. Check browser console for errors (F12)
2. Verify localStorage is enabled (not in private mode)
3. Check DevTools → Application → Storage → localStorage for keys
4. Verify state update logic calls `localStorage.setItem()` after state changes
5. Review `src/utils/storage.js` for bugs

---

### Problem: "Styles not loading or components look broken"

**Cause:** CSS/Tailwind not configured or missing  
**Solution:**
1. Ensure Tailwind is installed: `npm list tailwindcss`
2. Check `src/main.css` or `src/App.css` imports Tailwind
3. Verify `tailwind.config.js` and `postcss.config.js` exist
4. Restart dev server: `Ctrl+C` then `npm run dev`

---

### Problem: "React components not updating when state changes"

**Cause:** State updates not triggering re-renders  
**Solution:**
1. Ensure state is updated using `setState()` or Context dispatch (not mutated directly)
2. Verify component is wrapped in Context provider
3. Use React DevTools browser extension to inspect component state
4. Check for stale closures in event handlers (use proper React hooks)

---

### Problem: "My changes aren't showing up in the browser"

**Cause:** Hot Module Replacement (HMR) not working  
**Solution:**
1. Check dev server is still running
2. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Restart dev server: `Ctrl+C` then `npm run dev`
4. Clear browser cache if needed

---

## 15. Team Roles and Responsibilities

### Project Leadership
- **DJ Barut** (Coordinator) — Overall project coordination, approvals, documentation
- **Nabin Khadka** (Technical Lead) — React + Vite setup, project architecture, deployment

### Feature Owners
| Feature | Owner | Backup |
|---------|-------|--------|
| Subject Management | Nabin Khadka | Sumit Adhikari |
| Task Management | Sumit Adhikari | Adronnie |
| Study Plan Dashboard | Adronnie | Prince |
| Quiz & Scoring | Prince | RaiPrabin697 |
| Data Persistence (localStorage) | Adronnie | Prince |
| Documentation | RaiPrabin697 + Nabin Khadka | J.N. Taj Oli |
| Testing & QA | J.N. Taj Oli | Team |

### Weekly Meetings
- **Stand-ups:** 2–3 times per week (15–20 min)
- **Sprint Reviews:** End of week (30 min)
- **Planning:** Start of week (30–45 min)

---

## 16. References and Evidence Links

### Key Documentation
- [Project Root README](../../README.md)
- [Week 3 Architecture Sketch](../week3/architecture-sketch.md)
- [Week 3 Candidate Vertical Slice](../week3/candidate-vertical-slice.md)
- [Week 4 Chuseok Checkpoint](../week4/chuseok-checkpoint.md)
- [Tech Stack Comparison](../week3/tech-stack-comparison.md)

### Persistence and Testing Evidence
- [localStorage Persistence Test (Week 2)](../week2/storage-check.md)
- [Subject/Task Persistence Fixture](../week2/storage-check-subject-task.html)
- [State/Flow Test (Week 3)](../week3/prabin-state-flow-test.md)
- [Quiz Validation Checklist](../tests/quiz-validation.md)

### GitHub Resources
- [Team Repository](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design)
- [GitHub Issues (Sprint Board)](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues)
- [Project Board](https://github.com/orgs/CapstoneDesign-Fall2026-UlsanCollege/projects)

### External Resources
- [React Documentation](https://react.dev)
- [Vite Getting Started](https://vitejs.dev/guide/)
- [React Router Docs](https://reactrouter.com/)
- [TailwindCSS Docs](https://tailwindcss.com)
- [localStorage MDN Guide](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### Team Collaboration
- **Slack/Discord:** (add channel link)
- **Weekly Reports:** [docs/week{n}/](../)
- **Working Agreement:** [docs/week1/project_agreement.md](../week1/project_agreement.md)

---

## Conclusion

This Architecture and Setup document is the single source of truth for the Smart Study Companion project structure, technology, and development workflow. It evolves with the project — update it as you learn, refactor, and scale.

**Quick Start Reminder:**
```bash
git clone <repo-url>
cd Team-5-Capstone-Design
npm install
npm run dev
```

For questions or clarifications, reach out to **Nabin Khadka** (technical lead) or **DJ Barut** (coordinator).

---

**Document Version:** 1.0 (Week 5)  
**Last Reviewed:** October 2026  
**Next Review:** Week 6 (Post-midterm assessment)
