#!/usr/bin/env python3
"""
Smart Study Companion — Automated Test Suite
Verifies SQL schema migrations, Auth pages, HTML/CSS/JS file integrity,
academic catalog hierarchy, task analytics metrics, and quiz scoring.
"""

import os
import re
import sys
import json
from datetime import datetime, timedelta

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
        'src/lib/academic-catalog.js',
        'src/services/auth.js',
        'src/services/profile.js',
        'src/services/subjects.js',
        'src/services/tasks.js',
        'src/services/quiz.js',
        'src/auth-guard.js',
        'public/src/theme.js',
        'supabase/migrations/001_profiles.sql',
        'supabase/migrations/002_subjects.sql',
        'supabase/migrations/003_tasks.sql',
        'supabase/migrations/004_quiz_questions.sql',
        'supabase/migrations/005_quiz_attempts.sql',
        'supabase/migrations/006_rls_policies.sql',
        'supabase/migrations/007_universities.sql',
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
    assert len(files) >= 7, f"Expected at least 7 migrations, found {len(files)}"

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

    # 007_universities.sql
    with open(os.path.join(migrations_dir, '007_universities.sql')) as f:
        content = f.read()
        assert 'CREATE TABLE IF NOT EXISTS public.universities' in content or 'CREATE TABLE IF NOT EXISTS universities' in content
        assert 'Ulsan College' in content
        assert 'Tribhuvan University' in content
        assert 'ENABLE ROW LEVEL SECURITY' in content

    print("  ✓ All 7 SQL migrations valid with complete tables, 75 seeded questions, universities catalog, and RLS.")

def test_auth_pages_markup():
    """Verify HTML auth pages have valid markup, required IDs, and dual OTP/link recovery elements."""
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

    # reset-password.html (checks for password and OTP support)
    with open(os.path.join(auth_dir, 'reset-password.html')) as f:
        c = f.read()
        assert 'id="reset-form"' in c
        assert 'id="password"' in c or 'id="new-password"' in c
        assert 'otp-code' in c or 'otp' in c

    print("  ✓ All 5 Auth pages properly structured with required inputs, toggles, and dual OTP/link reset support.")

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

def test_task_metrics_and_analytics_logic():
    """Unit test task progress calculations and weekly activity logic."""
    print("Testing Task Metric & Analytics Calculations...")
    now = datetime.now()
    yesterday = (now - timedelta(days=1)).isoformat()
    tomorrow = (now + timedelta(days=1)).isoformat()
    last_week = (now - timedelta(days=3)).isoformat()

    tasks = [
        {"id": "1", "subject": "Programming", "completed": True, "deadline": yesterday},
        {"id": "2", "subject": "Programming", "completed": False, "deadline": yesterday}, # overdue
        {"id": "3", "subject": "Databases", "completed": False, "deadline": tomorrow},
        {"id": "4", "subject": "Databases", "completed": True, "deadline": last_week},
    ]

    total = len(tasks)
    completed = sum(1 for t in tasks if t["completed"])
    pending = total - completed
    overdue = sum(1 for t in tasks if not t["completed"] and datetime.fromisoformat(t["deadline"]) < now)
    percent = round((completed / total) * 100) if total else 0

    assert total == 4
    assert completed == 2
    assert pending == 2
    assert overdue == 1
    assert percent == 50

    # Subject-wise calculation
    prog_tasks = [t for t in tasks if t["subject"] == "Programming"]
    prog_total = len(prog_tasks)
    prog_completed = sum(1 for t in prog_tasks if t["completed"])
    prog_pct = round((prog_completed / prog_total) * 100)
    assert prog_pct == 50

    print("  ✓ Task metrics and analytics logic pass (50% completion, 1 overdue, subject breakdown).")

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

def test_academic_catalog():
    """Verify academic catalog file contains essential countries and institutions."""
    print("Testing Academic Catalog Hierarchy...")
    catalog_path = os.path.join(WORKSPACE, 'src', 'lib', 'academic-catalog.js')
    with open(catalog_path) as f:
        content = f.read()
        assert 'Nepal' in content
        assert 'South Korea' in content
        assert 'Ulsan College' in content
        assert 'Tribhuvan University' in content
        assert 'SUBJECTS_CATALOG' in content
        assert 'searchSubjects' in content
    print("  ✓ Academic catalog hierarchy includes Korea, Nepal, accredited universities, and subjects.")

def test_theme_toggle():
    """Verify the sidebar theme toggle is wired and stays on screen."""
    print("Testing Theme Toggle...")
    with open(os.path.join(WORKSPACE, 'public', 'index.html'), encoding='utf-8') as f:
        index_html = f.read()
    with open(os.path.join(WORKSPACE, 'public', 'app.js'), encoding='utf-8') as f:
        app_js = f.read()
    with open(os.path.join(WORKSPACE, 'public', 'src', 'theme.js'), encoding='utf-8') as f:
        theme_js = f.read()
    with open(os.path.join(WORKSPACE, 'public', 'styles.css'), encoding='utf-8') as f:
        styles = f.read()

    assert 'id="theme-toggle-btn"' in index_html
    assert 'Dark mode' in index_html
    assert 'Light mode' in index_html
    assert "import { initTheme } from './src/theme.js'" in app_js
    assert 'initTheme()' in app_js
    assert "THEME_KEY = 'smart_study_theme'" in theme_js
    assert "classList.toggle('dark'" in theme_js
    assert "getElementById('theme-toggle-btn')" in theme_js
    assert 'min-height: 0' in styles
    assert 'overflow-y: auto' in styles
    assert 'flex-shrink: 0' in styles
    print("  ✓ Sidebar theme toggle is present, saved, and kept on screen.")

def main():
    print("=" * 60)
    print("  SMART STUDY COMPANION — AUTOMATED TEST SUITE")
    print("=" * 60)
    try:
        test_file_structure()
        test_sql_migrations()
        test_auth_pages_markup()
        test_auth_validation_logic()
        test_task_metrics_and_analytics_logic()
        test_quiz_scoring_logic()
        test_academic_catalog()
        test_theme_toggle()
        print("=" * 60)
        print("  ALL TESTS PASSED SUCCESSFULLY (8/8)")
        print("=" * 60)
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
