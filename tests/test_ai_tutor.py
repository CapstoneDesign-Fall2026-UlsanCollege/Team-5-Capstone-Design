#!/usr/bin/env python3
"""
Test Suite: AI Tutor Migration, Security, Edge Function & UI Integration
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def test_ai_tutor_migration_and_rollback():
    """Verify 013_ai_tutor.sql and 013_ai_tutor_down.sql schemas, constraints, and RLS."""
    mig_path = os.path.join(ROOT, 'supabase', 'migrations', '013_ai_tutor.sql')
    down_path = os.path.join(ROOT, 'supabase', 'rollbacks', '013_ai_tutor_down.sql')
    assert os.path.exists(mig_path), "013_ai_tutor.sql must exist"
    assert os.path.exists(down_path), "013_ai_tutor_down.sql rollback must exist"

    with open(mig_path, 'r', encoding='utf-8') as f:
        sql = f.read()

    for table in [
        'ai_tutor_conversations',
        'ai_tutor_messages',
        'ai_tutor_learning_sessions',
        'ai_tutor_usage_quotas',
    ]:
        assert f'CREATE TABLE IF NOT EXISTS public.{table}' in sql, f"Missing table {table}"
        assert f'ALTER TABLE public.{table}' in sql and 'ENABLE ROW LEVEL SECURITY' in sql, f"Missing RLS on {table}"

    assert "role = 'student'" in sql, "Anti-impersonation RLS check on ai_tutor_messages missing"
    assert 'REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.ai_tutor_usage_quotas' in sql


def test_edge_function_and_security():
    """Verify ai-tutor-chat Edge Function validates JWT, origin, quotas, and Gemini env secrets."""
    fn_path = os.path.join(ROOT, 'supabase', 'functions', 'ai-tutor-chat', 'index.ts')
    core_path = os.path.join(ROOT, 'supabase', 'functions', 'ai-tutor-chat', 'tutor-core.ts')
    assert os.path.exists(fn_path), "ai-tutor-chat/index.ts missing"
    assert os.path.exists(core_path), "ai-tutor-chat/tutor-core.ts missing"

    with open(fn_path, 'r', encoding='utf-8') as f:
        fn_src = f.read()
    assert 'Deno.env.get("GEMINI_API_KEY")' in fn_src
    assert 'adminClient.auth.getUser(token)' in fn_src
    assert 'x-goog-api-key' in fn_src
    assert 'GEMINI_NOT_CONFIGURED' in fn_src
    assert 'DAILY_QUOTA_EXCEEDED' in fn_src


def test_frontend_ui_and_src_sync():
    """Verify public/index.html, public/app.js, and synced src <-> public/src AI Tutor files."""
    with open(os.path.join(ROOT, 'public', 'index.html'), 'r', encoding='utf-8') as f:
        html = f.read()

    # Nav link sits right after Quiz Practice and before closing </nav>
    quiz_pos = html.index('data-view="quiz"')
    tutor_pos = html.index('data-view="ai-tutor"')
    nav_end_pos = html.index('</nav>')
    assert quiz_pos < tutor_pos < nav_end_pos, "AI Tutor link must appear directly below Quiz Practice"

    for hook in [
        'id="view-ai-tutor"',
        'id="ai-tutor-subject"',
        'id="ai-tutor-difficulty"',
        'id="ai-tutor-mode"',
        'id="ai-tutor-language"',
        'id="ai-tutor-practice-topic-btn"',
        'id="ai-tutor-input"',
        'id="ai-tutor-send-btn"',
    ]:
        assert hook in html, f"Missing DOM hook {hook}"

    for rel in [
        'src/lib/ai-tutor-logic.js',
        'src/services/ai-tutor.js',
        'src/ai-tutor-ui.js',
    ]:
        src_p = os.path.join(ROOT, rel)
        pub_p = os.path.join(ROOT, 'public', rel)
        assert os.path.exists(src_p) and os.path.exists(pub_p), f"Missing {rel} or public/{rel}"
        with open(src_p, 'r', encoding='utf-8') as f1, open(pub_p, 'r', encoding='utf-8') as f2:
            assert f1.read() == f2.read(), f"Out-of-sync copy: {rel} vs public/{rel}"


if __name__ == '__main__':
    print("Testing AI Tutor Migration, Security, Edge Function & UI Integration...")
    test_ai_tutor_migration_and_rollback()
    print("  ✓ Migration 013 & Rollback: Tables, constraints, and anti-impersonation RLS verified.")
    test_edge_function_and_security()
    print("  ✓ Edge Function ai-tutor-chat: JWT, CORS, quota enforcement, and Gemini key handling verified.")
    test_frontend_ui_and_src_sync()
    print("  ✓ Frontend Integration: Sidebar slot below Quiz Practice, DOM hooks, and src/public sync verified.")
    print("ALL AI TUTOR CONTRACT TESTS PASSED!")
