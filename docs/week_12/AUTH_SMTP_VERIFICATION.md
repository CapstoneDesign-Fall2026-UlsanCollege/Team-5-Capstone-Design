# Week 12 — Authentication & Brevo Custom SMTP Verification

**Related Issue:** [#40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40)  
**Responsible:**  Nabin Khadka  / Adhikari sumit
**Date:** November 20, 2026  
**Live SMTP Status:** **UNVERIFIED / BLOCKED** (Supabase Dashboard SMTP credentials not available in local session)

---

## 1. Local Auth & Recovery Verification
- `tests/unit/auth.test.js` (**3 / 3 PASS** via `npm test`): validates email format, password rules (8+ chars, letter + digit), and 6-digit OTP sanitization.
- `tests/run_tests.py`: verifies all 5 HTML pages under `public/auth/` (`login.html`, `signup.html`, `verify.html`, `forgot-password.html`, `reset-password.html`) and confirms no hardcoded demo OTP (`123456`) remains.

## 2. Live Auth & Email Flows Status

| Flow | Expected Behavior | Live Status | Blocker / Notes |
| :--- | :--- | :---: | :--- |
| Signup email verification | Sends verification email via Supabase Auth | **UNVERIFIED** | Rate-limited until Brevo Custom SMTP is configured |
| Login & session persistence | Authenticates and redirects to `index.html` | **UNVERIFIED** | Requires live browser run |
| Forgot password & reset email | Sends 6-digit OTP / recovery link via Brevo SMTP | **BLOCKED** | Brevo SMTP credentials not yet configured in Dashboard |
| Password update & re-login | Updates password via `updatePassword()` | **UNVERIFIED** | Dependent on recovery token delivery |
| Expired/invalid link handling | Displays clear error message without crash | **UNVERIFIED** | Requires live token expiry test |

## 3. Brevo Custom SMTP Configuration Guide (Supabase Dashboard)
1. **Brevo Setup:** Verify a sender email/domain in Brevo and generate an SMTP key (never commit SMTP keys to Git).
2. **Supabase Dashboard → Authentication → SMTP Settings:**
   - Enable **Custom SMTP**
   - **Host:** `smtp-relay.brevo.com` | **Port:** `587`
   - **Username / Password:** Brevo SMTP login & key
   - **Sender Email:** Verified sender address
3. **Supabase Dashboard → Authentication → URL Configuration:**
   - **Site URL:** `https://team-5-capstone-design-761v.vercel.app`
   - **Redirect URLs:** `https://team-5-capstone-design-761v.vercel.app/**`
4. **Verification:** Trigger a password reset in `auth/forgot-password.html` using a disposable test email and attach redacted delivery proof.
