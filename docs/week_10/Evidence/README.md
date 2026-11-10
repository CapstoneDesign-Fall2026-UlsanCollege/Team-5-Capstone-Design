# Week 10 Evidence Directory Guide

**Folder:** [`docs/week_10/Evidence/`](.)  
*(Preserves existing UI/theme screenshots and test logs contributed by Team 5 members without creating a duplicate `evidence/` folder.)*

---

## Existing Evidence Files

- [`Automated test passed.png`](Automated%20test%20passed.png) — Screenshot of passing theme/Vitest test output
- [`desktop evidence.md`](desktop%20evidence.md) — Desktop viewport verification links
- [`mobile evidence.md`](mobile%20evidence.md) — Mobile viewport verification links
- [`light mode check on desktop.md`](light%20mode%20check%20on%20desktop.md) — Desktop light mode checks
- [`light mode check on mobile.md`](light%20mode%20check%20on%20mobile.md) — Mobile light mode checks

*(Additional Week 10 dashboard/onboarding screenshots reside in [`../study-analytics-dashboard.png`](../study-analytics-dashboard.png) and [`../subjects-university-selector.png`](../subjects-university-selector.png).)*

---

## What Belongs Here

- Redacted screenshots proving executed manual or Playwright browser checks (`Signup -> Login`, subject onboarding persistence after refresh, task CRUD in Table Editor, quiz history submission, password recovery Gmail receipt).
- Captured terminal logs from `npm test`, `npm run build`, `python3 tests/run_tests.py`, and `python3 tests/test_ai_quiz.py`.
- Two-student RLS verification proof using disposable test accounts.

---

## Strictly Forbidden Uploads (Security & Privacy Rules)

**Never commit or upload screenshots/logs containing:**
- Plaintext student passwords.
- 6-digit email confirmation or password-recovery OTP verification codes (`{{ .Token }}`).
- `SUPABASE_SERVICE_ROLE_KEY`, database passwords, SMTP credentials, or future `GEMINI_API_KEY`.
- Raw JWT access/refresh tokens (`access_token`, `refresh_token`), `Authorization: Bearer ...` headers, or session cookies.
- Private real student email addresses or PII (use redacted masks or disposable test accounts only).
- Unredacted Supabase Auth server logs containing sensitive tokens or IPs.
