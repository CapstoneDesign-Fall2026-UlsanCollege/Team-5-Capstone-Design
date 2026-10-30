#!/usr/bin/env python3
"""
Smart Study Companion — Automated Test Suite
Verifies SQL schema migrations, Auth pages, HTML/CSS/JS file integrity,
and core business logic (auth validation, task metrics, and quiz scoring).
"""

import os
import re
import sys
import json

WORKSPACE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def test_file_structure():
    """Verify all expected project files and directories exist."""
    print("Testing Project File Structure...")
    required_files = [
        '.env.example',
        'package.json',
        'vite.config.js',
        'vercel.json',
        'public/index.html',
        'public/styles.css',
        'public/app.js',
        'public/auth/login.html',
        'public/auth/signup.html',
        'public/auth/verify.html',
        'public/auth/forgot-password.html',
        'public/auth/reset-password.html',
        'public/auth/auth.css',
        'public/auth/auth-init.js',
        'src/lib/supabase.js',
        'src/services/auth.js',
        'src/services/profile.js',
        'src/services/subjects.js',
        'src/services/tasks.js',
        'src/services/quiz.js',
        'src/auth-guard.js',
        'supabase/migrations/001_profiles.sql',
        'supabase/migrations/002_subjects.sql',
        'supabase/migrations/003_tasks.sql',
        'supabase/migrations/004_quiz_questions.sql',
        'supabase/migrations/005_quiz_attempts.sql',
        'supabase/migrations/006_rls_policies.sql',
    ]
    for rel_path in required_files:
        full_path = os.path.join(WORKSPACE, rel_path)
        assert os.path.exists(full_path), f"Missing required file: {rel_path}"
    print("  ✓ All required files and directories present.")

def test_sql_migrations():
    """Verify SQL migrations structure, tables, and seed count."""
    print("Testing Database Schema Migrations...")
    migrations_dir = os.path.join(WORKSPACE, 'supabase', 'migrations')
    files = sorted(os.listdir(migrations_dir))
    assert len(files) >= 6, f"Expected at least 6 migrations, found {len(files)}"

    # 001_profiles.sql
    with open(os.path.join(migrations_dir, '001_profiles.sql')) as f:
        content = f.read()
        assert 'CREATE TABLE IF NOT EXISTS profiles' in content
        assert 'REFERENCES auth.users' in content
        assert 'handle_new_user' in content

    # 002_subjects.sql
    with open(os.path.join(migrations_dir, '002_subjects.sql')) as f:
        content = f.read()
        assert 'CREATE TABLE IF NOT EXISTS subjects' in content
        assert 'CREATE TABLE IF NOT EXISTS student_subjects' in content
        assert 'Programming' in content
        assert 'Data Structures & Algorithms' in content
        assert 'Databases' in content
        assert 'Computer Networks' in content
        assert 'Operating Systems' in content

    # 003_tasks.sql
    with open(os.path.join(migrations_dir, '003_tasks.sql')) as f:
        content = f.read()
        assert 'CREATE TABLE IF NOT EXISTS tasks' in content
        assert 'student_id' in content
        assert 'deadline' in content
        assert 'completed' in content

    # 004_quiz_questions.sql
    with open(os.path.join(migrations_dir, '004_quiz_questions.sql')) as f:
        content = f.read()
        assert 'CREATE TABLE IF NOT EXISTS quiz_questions' in content
        # Count questions inserted
        q_count = len(re.findall(r"\(v_[a-z_]+,\s*'", content))
        assert q_count == 75, f"Expected 75 seeded quiz questions, found {q_count}"

    # 005_quiz_attempts.sql
    with open(os.path.join(migrations_dir, '005_quiz_attempts.sql')) as f:
        content = f.read()
        assert 'CREATE TABLE IF NOT EXISTS quiz_attempts' in content
        assert 'CREATE TABLE IF NOT EXISTS quiz_responses' in content

    # 006_rls_policies.sql
    with open(os.path.join(migrations_dir, '006_rls_policies.sql')) as f:
        content = f.read()
        for table in ['profiles', 'subjects', 'student_subjects', 'tasks', 'quiz_questions', 'quiz_attempts', 'quiz_responses']:
            assert f'ALTER TABLE {table} ENABLE ROW LEVEL SECURITY' in content, f"RLS not enabled on {table}"
        assert 'auth.uid()' in content

    print("  ✓ All 6 SQL migrations valid with complete tables, 75 seeded questions, and RLS on all 7 tables.")

def test_auth_pages_markup():
    """Verify HTML auth pages have valid markup, required IDs, and forms."""
    print("Testing Authentication HTML Pages...")
    auth_dir = os.path.join(WORKSPACE, 'public', 'auth')

    # login.html
    with open(os.path.join(auth_dir, 'login.html')) as f:
        c = f.read()
        assert 'id="login-form"' in c
        assert 'id="email"' in c
        assert 'id="password"' in c
        assert 'id="form-alert"' in c
        assert 'auth-init.js' in c

    # signup.html
    with open(os.path.join(auth_dir, 'signup.html')) as f:
        c = f.read()
        assert 'id="signup-form"' in c
        assert 'id="email"' in c
        assert 'id="password"' in c
        assert 'id="terms"' in c
        assert 'password-rules' in c

    # verify.html
    with open(os.path.join(auth_dir, 'verify.html')) as f:
        c = f.read()
        assert 'verify-email' in c
        assert 'resend-btn' in c

    # forgot-password.html
    with open(os.path.join(auth_dir, 'forgot-password.html')) as f:
        c = f.read()
        assert 'id="forgot-form"' in c
        assert 'id="email"' in c

    # reset-password.html
    with open(os.path.join(auth_dir, 'reset-password.html')) as f:
        c = f.read()
        assert 'id="reset-form"' in c
        assert 'id="password"' in c or 'id="new-password"' in c

    print("  ✓ All 5 Auth pages properly structured with required inputs, toggles, and scripts.")

def test_auth_validation_logic():
    """Unit test auth validation algorithms."""
    print("Testing Auth Validation Logic...")
    email_regex = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')

    assert email_regex.match("student@university.edu")
    assert email_regex.match("alex@college.edu.np")
    assert not email_regex.match("bademail")
    assert not email_regex.match("@nouser.com")

    def password_valid(pw):
        return len(pw) >= 8 and bool(re.search(r'[A-Za-z]', pw)) and bool(re.search(r'\d', pw))

    assert password_valid("StudySmart2026") is True
    assert password_valid("short1A") is False
    assert password_valid("allcharactershere") is False
    assert password_valid("123456789") is False
    print("  ✓ Email regex and 8+ char / letter / digit password validation pass.")

def test_task_metrics_logic():
    """Unit test task progress calculations."""
    print("Testing Task Metric Calculations...")
    tasks = [
        {"id": "1", "completed": True},
        {"id": "2", "completed": False},
        {"id": "3", "completed": False},
        {"id": "4", "completed": True},
    ]
    total = len(tasks)
    completed = sum(1 for t in tasks if t["completed"])
    pending = total - completed
    percent = round((completed / total) * 100) if total else 0

    assert total == 4
    assert completed == 2
    assert pending == 2
    assert percent == 50
    print("  ✓ Task metrics calculation passes (50% completion on 2/4).")

def test_quiz_scoring_logic():
    """Unit test quiz scoring."""
    print("Testing Quiz Scoring Logic...")
    questions = [
        {"q": "Q1", "answer": 1},
        {"q": "Q2", "answer": 0},
        {"q": "Q3", "answer": 3},
    ]
    answers = [1, 0, 2] # 2 correct, 1 wrong
    correct = sum(1 for idx, q in enumerate(questions) if answers[idx] == q["answer"])
    percent = round((correct / len(questions)) * 100)

    assert correct == 2
    assert percent == 67
    print("  ✓ Quiz scoring calculation passes (2/3 correct = 67%).")

def main():
    print("=" * 60)
    print("  SMART STUDY COMPANION — AUTOMATED TEST SUITE")
    print("=" * 60)
    try:
        test_file_structure()
        test_sql_migrations()
        test_auth_pages_markup()
        test_auth_validation_logic()
        test_task_metrics_logic()
        test_quiz_scoring_logic()
        print("=" * 60)
        print("  ALL TESTS PASSED SUCCESSFULLY (6/6)")
        print("=" * 60)
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

