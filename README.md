<div align="center">

# Smart Study Companion

### Production-Oriented University Study Management Web Application
**Full-Stack Architecture · Supabase PostgreSQL · Supabase Auth · Row Level Security (RLS)**

[![Status](https://img.shields.io/badge/Architecture-Full--Stack%20Supabase-0f766e)](supabase/migrations/)
[![Auth](https://img.shields.io/badge/Auth-Supabase%20Auth-2dd4bf)](public/auth/)
[![Free Tier](https://img.shields.io/badge/Budget-%240%2Fmonth%20Free%20Tier-c27803)](docs/)

[Documentation](docs/README.md) · [Schema Migrations](supabase/migrations/) · [Architecture Plan](docs/week5/ARCHITECTURE_AND_SETUP.md)

</div>

---

## 1. Overview & Pivot

Smart Study Companion is an academic study management application designed for university students to organize courses, study tasks, deadlines, and quizzes with real student accounts.

### What Changed (The Full-Stack Pivot):
- **Authentication First**: Student identity management replacing browser-only guest storage.
- **Persistent Cloud Database**: Supabase PostgreSQL replacing browser `localStorage`.
- **Row Level Security (RLS)**: Enforced isolation ensuring students cannot view, edit, or delete other students' coursework.
- **Preserved Core UI & Features**: 5 Computer Science subjects, standard & rapid quizzes, 75 quiz questions, progress tracking, and light/dark theme maintained intact.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | HTML5 / CSS3 / Vanilla JavaScript (ES Modules) | Lightweight, standards-based UI with zero framework bloat |
| **Auth** | Supabase Auth | Sign in, registration, email verification, password reset |
| **Database** | Supabase PostgreSQL | Normalized relational database with RLS policies |
| **Client SDK** | `@supabase/supabase-js` | Browser database & auth queries |
| **Hosting** | Vercel (Hobby Free Tier) | High-speed global edge static deployment |
| **Testing** | Automated Test Suite (Python 3 / Vitest) | Schema validation, unit tests, and markup verification |

---

## 3. Project Directory Structure

```
Smart Study Companion/
├── public/                      # Static frontend (production root)
│   ├── index.html               # Student Dashboard (protected view)
│   ├── styles.css               # Main application styles
│   ├── app.js                   # Application controller & Supabase synchronization
│   ├── auth/                    # Authentication UI pages
│   │   ├── login.html           # Student sign-in
│   │   ├── signup.html          # Registration with password validation
│   │   ├── verify.html          # Email confirmation handler
│   │   ├── forgot-password.html # Password reset request
│   │   ├── reset-password.html  # Secure password update form
│   │   ├── auth.css             # Authentication design system
│   │   └── auth-init.js         # Auth controller & form lifecycle
│   └── wireframes/              # UI design reference wireframes
├── src/
│   ├── lib/
│   │   └── supabase.js          # Supabase client singleton
│   ├── services/
│   │   ├── auth.js              # Authentication service methods
│   │   ├── profile.js           # Student profile service
│   │   ├── tasks.js             # Study task CRUD service
│   │   ├── subjects.js          # Subject catalog & enrollment
│   │   └── quiz.js              # Quiz questions & attempt tracking
│   └── auth-guard.js            # Route protection guard
├── supabase/
│   └── migrations/              # Versioned SQL migrations with RLS
│       ├── 001_profiles.sql     # Profiles table linked to auth.users
│       ├── 002_subjects.sql     # Subjects catalog & enrollment
│       ├── 003_tasks.sql        # Study tasks with deadlines
│       ├── 004_quiz_questions.sql # 75 CS multiple-choice questions
│       ├── 005_quiz_attempts.sql  # Attempt tracking & responses
│       └── 006_rls_policies.sql   # Comprehensive Row Level Security
├── tests/
│   ├── run_tests.py             # Automated test suite
│   └── unit/                    # Unit test specs
├── .env.example                 # Template for Supabase credentials
├── vercel.json                  # Vercel deployment configuration
├── package.json                 # Project configuration & scripts
└── README.md
```

---

## 4. Supabase Setup Guide

### Step 1: Create a Supabase Project (Free Tier)
1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. Note your **Project URL** and **API anon key** from `Settings` → `API`.

### Step 2: Apply Database Migrations
In the Supabase SQL Editor, run the SQL files in order from `supabase/migrations/`:
1. `001_profiles.sql` (Creates `profiles` table and auto-creation trigger on new user signup)
2. `002_subjects.sql` (Creates subjects catalog and seeds the 5 Computer Science subjects)
3. `003_tasks.sql` (Creates `tasks` table with indexes)
4. `004_quiz_questions.sql` (Seeds the 75 multiple-choice questions)
5. `005_quiz_attempts.sql` (Creates attempt tracking and response tables)
6. `006_rls_policies.sql` (Enables Row Level Security and creates isolation policies)

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### Step 4: Configure Auth URL Redirects
In the Supabase Dashboard under `Authentication` → `URL Configuration`:
- Set **Site URL** to your deployment URL (or `http://localhost:3000` for development).
- Add redirect URLs:
  - `http://localhost:3000/auth/verify.html`
  - `http://localhost:3000/auth/reset-password.html`
  - `https://your-domain.vercel.app/auth/verify.html`
  - `https://your-domain.vercel.app/auth/reset-password.html`

---

## 5. Running Tests

Run the test suite:
```bash
python3 tests/run_tests.py
```
Expected output:
```
============================================================
  SMART STUDY COMPANION — AUTOMATED TEST SUITE
============================================================
Testing Project File Structure...
  ✓ All required files and directories present.
Testing Database Schema Migrations...
  ✓ All 6 SQL migrations valid with complete tables, 75 seeded questions, and RLS on all 7 tables.
Testing Authentication HTML Pages...
  ✓ All 5 Auth pages properly structured with required inputs, toggles, and scripts.
Testing Auth Validation Logic...
  ✓ Email regex and 8+ char / letter / digit password validation pass.
Testing Task Metric Calculations...
  ✓ Task metrics calculation passes (50% completion on 2/4).
Testing Quiz Scoring Logic...
  ✓ Quiz scoring calculation passes (2/3 correct = 67%).
============================================================
  ALL TESTS PASSED SUCCESSFULLY (6/6)
============================================================
```

---

## 6. Deployment to Vercel (Hobby Free Tier)

1. Connect your repository to Vercel.
2. In Project Settings → Environment Variables, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Set the **Output Directory** to `public` (already configured in `vercel.json`).
4. Click **Deploy**.
