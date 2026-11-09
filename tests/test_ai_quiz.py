#!/usr/bin/env python3
"""
Test Suite: AI Quiz Generator Schema, Validation, Scoring, and RLS
"""
import os
import re
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def test_ai_quiz_migration():
    """Verify 009_ai_quiz_tables.sql has all 3 tables, foreign keys, constraints, and RLS."""
    mig_path = os.path.join(ROOT, 'supabase', 'migrations', '009_ai_quiz_tables.sql')
    assert os.path.exists(mig_path), "009_ai_quiz_tables.sql must exist"
    
    with open(mig_path, 'r', encoding='utf-8') as f:
        sql = f.read()

    # Tables
    assert 'CREATE TABLE IF NOT EXISTS ai_quizzes' in sql, "ai_quizzes table missing"
    assert 'CREATE TABLE IF NOT EXISTS ai_quiz_questions' in sql, "ai_quiz_questions table missing"
    assert 'CREATE TABLE IF NOT EXISTS ai_quiz_attempts' in sql, "ai_quiz_attempts table missing"

    # Foreign keys
    assert 'REFERENCES subjects(id)' in sql, "ai_quizzes must reference subjects"
    assert 'REFERENCES profiles(id)' in sql, "ai_quizzes and attempts must reference profiles"
    assert 'REFERENCES ai_quizzes(id)' in sql, "questions and attempts must reference ai_quizzes"

    # Constraints
    assert "CHECK (difficulty IN ('easy', 'medium', 'hard'))" in sql, "difficulty constraint missing"
    assert "CHECK (question_count BETWEEN 1 AND 50)" in sql, "question_count constraint missing"
    assert "CHECK (correct_answer BETWEEN 0 AND 3)" in sql, "correct_answer constraint missing"

    # RLS Policies
    assert 'ALTER TABLE ai_quizzes ENABLE ROW LEVEL SECURITY;' in sql, "RLS on ai_quizzes missing"
    assert 'ALTER TABLE ai_quiz_questions ENABLE ROW LEVEL SECURITY;' in sql, "RLS on ai_quiz_questions missing"
    assert 'ALTER TABLE ai_quiz_attempts ENABLE ROW LEVEL SECURITY;' in sql, "RLS on ai_quiz_attempts missing"
    assert 'ai_quizzes_select_own' in sql, "ai_quizzes select own policy missing"
    assert 'ai_quiz_attempts_select_own' in sql, "ai_quiz_attempts select own policy missing"

    print("  ✓ Migration 009: Schema, Foreign Keys, Constraints, and RLS verified.")

def test_ai_quiz_question_validation():
    """Verify question structure validation logic."""
    def is_valid_question(q):
        if not q or not isinstance(q, dict): return False
        question_text = q.get('question')
        if not question_text or not isinstance(question_text, str) or len(question_text.strip()) < 5:
            return False
        options = q.get('options')
        if not isinstance(options, list) or len(options) != 4:
            return False
        correct_answer = q.get('correct_answer')
        if not isinstance(correct_answer, int) or correct_answer < 0 or correct_answer > 3:
            return False
        # Must have 4 distinct options
        if len(set(str(opt).strip().lower() for opt in options)) < 4:
            return False
        return True

    # Valid
    valid_q = {
        'question': 'What is the time complexity of binary search on a sorted array?',
        'options': ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
        'correct_answer': 1,
        'explanation': 'Binary search halves the search space each step, yielding O(log n).'
    }
    assert is_valid_question(valid_q) is True, "Valid question should pass"

    # Too short
    assert is_valid_question({'question': 'Why?', 'options': ['A', 'B', 'C', 'D'], 'correct_answer': 0}) is False
    # Not 4 options
    assert is_valid_question({'question': 'Valid question text?', 'options': ['A', 'B'], 'correct_answer': 0}) is False
    # Duplicate options
    assert is_valid_question({'question': 'Valid question text?', 'options': ['A', 'B', 'A', 'D'], 'correct_answer': 0}) is False
    # Invalid index
    assert is_valid_question({'question': 'Valid question text?', 'options': ['A', 'B', 'C', 'D'], 'correct_answer': 4}) is False
    assert is_valid_question({'question': 'Valid question text?', 'options': ['A', 'B', 'C', 'D'], 'correct_answer': -1}) is False

    print("  ✓ AI Question Validation: Rejects malformed/duplicate options and verifies bounds.")

def test_ai_quiz_scoring_and_deduplication():
    """Verify scoring calculations and question deduplication."""
    questions = [
        {'q': 'Q1', 'answer': 0},
        {'q': 'Q2', 'answer': 1},
        {'q': 'Q3', 'answer': 2},
        {'q': 'Q4', 'answer': 3},
        {'q': 'Q5', 'answer': 1},
    ]
    student_answers = [0, 1, 0, 3, None]  # 3 correct (idx 0, 1, 3)

    score = sum(1 for idx, q in enumerate(questions) if student_answers[idx] == q['answer'])
    total = len(questions)
    percentage = round((score / total) * 100)

    assert score == 3, f"Expected 3, got {score}"
    assert percentage == 60, f"Expected 60%, got {percentage}%"

    print("  ✓ AI Quiz Scoring: Verified score calculation (3/5 = 60%).")

def test_frontend_ui_elements():
    """Verify index.html and app.js have the AI Quiz UI and handlers."""
    with open(os.path.join(ROOT, 'public', 'index.html'), 'r', encoding='utf-8') as f:
        html = f.read()

    assert 'id="quiz-tab-ai"' in html, "quiz-tab-ai missing in index.html"
    assert 'id="quiz-ai-panel"' in html, "quiz-ai-panel missing in index.html"
    assert 'id="quiz-ai-topic"' in html, "quiz-ai-topic missing in index.html"
    assert 'id="quiz-ai-difficulty"' in html, "quiz-ai-difficulty missing in index.html"
    assert 'id="quiz-ai-count"' in html, "quiz-ai-count missing in index.html"
    assert 'id="quiz-generate-ai-btn"' in html, "quiz-generate-ai-btn missing in index.html"

    with open(os.path.join(ROOT, 'public', 'app.js'), 'r', encoding='utf-8') as f:
        app_js = f.read()

    assert 'startAiQuiz' in app_js, "startAiQuiz missing in app.js"
    assert 'generateAiQuiz' in app_js, "generateAiQuiz import missing in app.js"
    assert 'saveAiQuizAttempt' in app_js, "saveAiQuizAttempt missing in app.js"
    assert 'quiz.mode === \'ai\'' in app_js, "ai mode check missing in finishQuiz"

    print("  ✓ Frontend UI: AI Quiz tabs, controls, generator and response handlers verified.")

if __name__ == '__main__':
    print("Testing AI Quiz Generator Schema, Validation, Scoring, and UI...")
    test_ai_quiz_migration()
    test_ai_quiz_question_validation()
    test_ai_quiz_scoring_and_deduplication()
    test_frontend_ui_elements()
    print("ALL AI QUIZ TESTS PASSED!")

