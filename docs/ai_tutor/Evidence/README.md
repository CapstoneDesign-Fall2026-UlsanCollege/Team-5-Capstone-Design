# AI Tutor QA Evidence Directory

**Branch:** `feature/ai-tutor`  
**Status:** **PENDING LIVE CAPTURE (`NOT RUN` — Zero Fabricated Screenshots)**

Live browser screenshots (`AI-01` through `AI-13`) must be captured after:
1. Running `supabase/migrations/013_ai_tutor.sql` in the target Supabase project.
2. Deploying `supabase/functions/ai-tutor-chat` and configuring `GEMINI_API_KEY`.
3. Signing in interactively with two separate student accounts in Chrome/Playwright.

## Required Screenshot Checklist
Never commit unredacted passwords, JWT bearer tokens, API keys, or private student email addresses.

- `AI-01-tutor-dashboard.png`
- `AI-02-new-conversation.png`
- `AI-03-ai-response.png`
- `AI-04-followup-context.png`
- `AI-05-subject-personalization.png`
- `AI-06-difficulty-selection.png`
- `AI-07-chat-history.png`
- `AI-08-refresh-persistence.png`
- `AI-09-quiz-integration.png`
- `AI-10-dark-mode.png`
- `AI-11-mobile-layout.png`
- `AI-12-error-handling.png`
- `AI-13-rls-account-isolation.png`
