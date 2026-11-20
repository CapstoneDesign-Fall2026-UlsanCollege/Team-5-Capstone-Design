# Week 12 — Authentication & Brevo Custom SMTP Verification

**Related Issue:** [#40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40)  
**Responsible:** Sumit Adhikari / Nabin Khadka  
**Date:** November 20, 2026  
**Live SMTP Status:** **VERIFIED FOR PASSWORD RESET** (Brevo Custom SMTP configured in Supabase Dashboard and live password reset confirmed working on November 20, 2026; dedicated signup-verification & expired-token live tests remain unverified)

---

## 1. Local Auth & Recovery Verification
- `tests/unit/auth.test.js` (**3 / 3 PASS** via `npm test`): validates email format, password rules (8+ chars, letter + digit), and 6-digit OTP sanitization.
- `tests/run_tests.py`: verifies all 5 HTML pages under `public/auth/` (`login.html`, `signup.html`, `verify.html`, `forgot-password.html`, `reset-password.html`) and confirms no hardcoded demo OTP (`123456`) remains.

## 2. Live Auth & Email Flows Status

| Flow | Expected Behavior | Live Status | Verification / Notes |
| :--- | :--- | :---: | :--- |
| Signup email verification | Sends verification email via Supabase Auth | **UNVERIFIED** | Brevo Custom SMTP now active (unblocked from default rate limit); awaiting dedicated live signup email test |
| Login & session persistence | Authenticates and redirects to `index.html` | **UNVERIFIED** | Requires dedicated live browser login/reload verification log |
| Forgot password & reset email | Sends 6-digit OTP / recovery link via Brevo SMTP | **PASS (Live)** | Configured Brevo Custom SMTP in Supabase (`smtp-relay.brevo.com:587`, verified sender, SMTP key IP blocking deactivated); live password recovery confirmed working Nov 20, 2026 |
| Password update & re-login | Updates password via `updatePassword()` | **PASS (User-Confirmed)** | Password reset issue confirmed resolved live on Nov 20, 2026 (no secret credentials or personal emails committed) |
| Expired/invalid link handling | Displays clear error message without crash | **UNVERIFIED** | Requires dedicated live token expiry test |

## 3. Brevo Custom SMTP Configuration Applied (Supabase Dashboard)
1. **Brevo Setup (Completed Nov 20, 2026):**
   - Verified the sender email under **Settings → Senders, domains, IPs → Senders**.
   - Generated a dedicated SMTP key under **SMTP & API → SMTP** (never commit SMTP keys or account logins to Git).
   - Under **Settings → Security → Authorized IPs → Blocking unauthorized IP addresses**, set **SMTP keys** to **Deactivated** so Supabase Cloud Auth servers can authenticate without IP rejection.
2. **Supabase Dashboard → Authentication → Emails → SMTP Settings (Completed Nov 20, 2026):**
   - **Enable custom SMTP:** Enabled
   - **Host:** `smtp-relay.brevo.com` | **Port:** `587`
   - **Username:** Brevo's generated SMTP login (`*@smtp-brevo.com`, not the personal Gmail sender address — resolving the earlier `535 5.7.8 Authentication failed` error on `POST /recover`)
   - **Password:** Generated Brevo SMTP key
   - **Sender Email:** Verified sender address
3. **Supabase Dashboard → Authentication → Emails → Templates & URL Configuration:**
   - **Reset password template:** Confirmed to include both `{{ .Token }}` (6-digit OTP) and `{{ .ConfirmationURL }}` (direct recovery link).
   - **Site URL:** `https://team-5-capstone-design-761v.vercel.app`
   - **Redirect URLs:** `https://team-5-capstone-design-761v.vercel.app/**` and `https://capstonedesign-fall2026-ulsancollege.github.io/**`
4. **Live Confirmation:** Triggering password recovery from `auth/forgot-password.html` succeeds and the password reset issue ([#40](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/40)) is confirmed resolved as of November 20, 2026. Dedicated live logging for signup confirmation and expired/invalid link handling remains open for team QA sign-off.
