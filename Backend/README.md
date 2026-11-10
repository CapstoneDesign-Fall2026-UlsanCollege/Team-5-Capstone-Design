# Backend — Smart Study Companion

This top-level **`Backend/`** folder organizes all Supabase backend code, client-to-Supabase service modules, route auth guard, PostgreSQL schema migrations, consolidated SQL setup script, and Edge Functions in one unified directory alongside [`Frontend/`](../Frontend).

> **Runtime Note:** Live GitHub Pages & Vite bundling serve imports from [`public/src/`](../public/src/) and [`src/`](../src/), while Supabase CLI reads [`supabase/`](../supabase/). All files inside `Backend/` are kept **byte-for-byte synchronized** with those active runtime locations and automatically verified by [`tests/unit/backend-services.test.js`](../tests/unit/backend-services.test.js).

---

## Folder Structure

```text
Backend/
├── README.md
├── auth-guard.js                          # Route protection & reset-password redirect exemption
├── lib/
│   ├── supabase.js                        # @supabase/supabase-js client & configuration detection
│   ├── academic-catalog.js                # 10 countries, 4 faculties, 15 majors, 32 subjects, 345 questions
│   └── regional-catalog.js                # Regional university & subject helper exports
├── services/
│   ├── auth.js                            # Sign up, login, logout, password recovery & 6-digit OTP verifyOtp
│   ├── profile.js                         # Student academic profile CRUD (profiles table)
│   ├── subjects.js                        # Universities catalog, subjects catalog & student_subjects sync
│   ├── tasks.js                           # Task CRUD + validation (tasks table)
│   ├── quiz.js                            # Curated quiz loading, attempt saving & history
│   └── ai-quiz.js                         # AI quiz generation, question validation & attempt history
└── supabase/
    ├── setup_all.sql                      # Consolidated idempotent SQL setup script
    ├── functions/
    │   └── generate-ai-quiz/
    │       └── index.ts                   # Deno Edge Function for dynamic topic-based quiz generation
    └── migrations/
        ├── 001_profiles.sql               # Student profiles & handle_new_user() trigger
        ├── 002_subjects.sql               # Subjects catalog & student_subjects enrollments
        ├── 003_tasks.sql                  # Study tasks & deadlines schema
        ├── 004_quiz_questions.sql         # Core quiz questions schema & initial 75 seeds
        ├── 005_quiz_attempts.sql          # Quiz attempts & individual question responses
        ├── 006_rls_policies.sql           # Row Level Security policies across private tables
        ├── 007_universities.sql           # Academic profile fields & universities table
        ├── 008_major_subjects_quiz_bank.sql # 32 subjects, 128 major_subjects mappings, 345 questions
        ├── 009_ai_quiz_tables.sql         # AI quizzes, questions, and attempts tables + RLS
        └── 010_complete_universities.sql  # Complete country/university parity (Bhutan, Maldives, International)
```

---

## Verification & Sync Check

Run automated parity checks and backend service tests from the repository root:

```bash
diff -r -u supabase/ Backend/supabase/
python3 tests/run_tests.py
python3 tests/test_ai_quiz.py
npm test
npm run build
```
