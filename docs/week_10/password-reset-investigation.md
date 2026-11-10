# Password Reset Investigation — Week 10

**Project:** Smart Study Companion — Team 5  
**Issue:** Students did not receive the 6-digit password recovery PIN or reset link email in Gmail on November 10, 2026.  
**Investigation Date:** 2026-11-10  
**Related Setup Guide:** [`docs/SUPABASE_EMAIL_TEMPLATES_SETUP.md`](../SUPABASE_EMAIL_TEMPLATES_SETUP.md)

---

## 1. Bug Description

- **November 9, 2026 (Reported):** During earlier testing, a student received both a recovery PIN and a reset link email.
- **November 10, 2026 (Observed Failure):** When testing live recovery on `forgot-password.html`, clicking *"Send recovery instructions"* showed the UI confirmation box (`"Check your email"`), but **zero emails arrived in Gmail** (checked Inbox, Spam, and All Mail — neither a 6-digit PIN nor a reset link was received).

---

## 2. Expected Behavior

`Enter Email` → `Send Recovery OTP (resetPasswordForEmail)` → `Receive Gmail Message (with 6-digit {{ .Token }} PIN + direct {{ .ConfirmationURL }})` → `Verify 6-digit Code (verifyOtp)` → `New Password` → `Confirm Password` → `Update Password (updateUser + signOut)` → `Login with new password`.

---

## 3. Observed Behavior (Screenshots & User Reports, 2026-11-10)

1. Screenshot of live GitHub Pages [`forgot-password.html`](../../public/auth/forgot-password.html) showed the green success box: *"Check your email — If an account exists for `princekarki127@gmail.com`, we have dispatched a 6-digit verification code and recovery link."*
2. Screenshot of [`reset-password.html`](../../public/auth/reset-password.html) prefilled `Student Email = princekarki127@gmail.com` with empty 6-digit code field (`Resend code` available).
3. **Zero email arrived** in Gmail (Inbox, Spam, or All Mail).
4. Screenshot of **Supabase Dashboard → Authentication → Users** displayed registered user `prince Karki` with email **`princekarki127@gmmail.com`** (misspelled domain with two `m`s: `@gmmail.com`).
5. Screenshot of **Supabase Dashboard → Authentication → Configuration → Sign In / Providers → Email** confirmed **Email OTP length is already `6`**.
6. Screenshot of **Supabase Dashboard → Authentication → Audit Logs** showed `"Write audit logs to the database"` toggle is **OFF**.

---

## 4. Affected Pages and Files

- [`public/auth/forgot-password.html`](../../public/auth/forgot-password.html)
- [`public/auth/reset-password.html`](../../public/auth/reset-password.html)
- [`public/auth/auth-init.js`](../../public/auth/auth-init.js) (`initForgotPassword`, `initResetPassword`)
- [`src/services/auth.js`](../../src/services/auth.js) & [`public/src/services/auth.js`](../../public/src/services/auth.js) (`resetPassword`, `verifyOtp`, `resendPasswordReset`, `updatePassword`)
- [`src/auth-guard.js`](../../src/auth-guard.js) & [`public/src/auth-guard.js`](../../public/src/auth-guard.js)

---

## 5. Supabase Recovery API Calls

1. **Request recovery:**
   `supabase.auth.resetPasswordForEmail(email, { redirectTo: '${getAuthBaseUrl()}/auth/reset-password.html' })` → `POST /auth/v1/recover`
   - Note: Supabase GoTrue intentionally returns HTTP `200` (`{ error: null }`) even when no account matches `email` to prevent user enumeration.
2. **Verify 6-digit OTP (code path):**
   `supabase.auth.verifyOtp({ email, token: cleanToken, type: 'recovery' })`
3. **Update password:**
   `supabase.auth.updateUser({ password: newPassword })` followed automatically by `supabase.auth.signOut()`.

---

## 6. Network and Authentication Log Findings

- **Live `/auth/v1/settings` probe (2026-11-10):** Returned HTTP `200` (`disable_signup: false`, `mailer_autoconfirm: true`, `external.email: true`).
- **Supabase Audit Logs (`audit_log_entries`):** Disabled in project settings (observed in Dashboard screenshot), meaning database auth delivery/error audit rows could not be inspected after the Nov 10 attempt.

---

## 7. OTP Email Template Investigation

- Confirmed in Supabase Dashboard that **Email OTP length = 6**.
- As documented in [`docs/SUPABASE_EMAIL_TEMPLATES_SETUP.md`](../SUPABASE_EMAIL_TEMPLATES_SETUP.md), Supabase's default Reset Password template includes only `{{ .ConfirmationURL }}` and omits `{{ .Token }}` until manually customized in **Authentication → Emails / Notifications → Reset Password**. Even when customized, Supabase only sends to registered existing emails within SMTP limits.

---

## 8. Rate-Limit Investigation

- Default Supabase built-in email service (Free Tier) enforces a low hourly cap (~2–4 emails/hour for testing) and restricts reliable delivery without a custom SMTP provider.
- Once Nov 9 test bursts ran or invalid domains bounced, Nov 10 dispatches can be silently throttled or dropped by shared SMTP unless Custom SMTP is active. (`auth-init.js` already catches explicit `'rate limit'` errors returned by the API when triggered.)

---

## 9. SMTP Configuration Findings

- No Custom SMTP setup has been confirmed in Supabase Dashboard for external Gmail delivery; live project relies on Supabase's built-in mailer with `"mailer_autoconfirm": true`. Without custom SMTP (e.g., Gmail App Password SMTP or Resend), external inbox delivery is not guaranteed in production.

---

## 10. Confirmed Root Cause(s) vs Unconfirmed Factors

1. **Confirmed Root Cause #1 (Registered Email Mismatch in `auth.users`):** Dashboard screenshot proves account `prince Karki` is registered as **`princekarki127@gmmail.com`** (`@gmmail.com`), whereas recovery was submitted for **`princekarki127@gmail.com`**. Because Supabase intentionally returns `{ error: null }` on non-existent addresses, the frontend displayed `"Check your email"` even though no `@gmail.com` user existed to receive mail.
2. **Confirmed Configuration Gap #2:** Built-in Supabase SMTP limits + disabled `Audit Logs` + `"mailer_autoconfirm": true` prevent reliable external Gmail delivery and obscure delivery diagnostics.
3. **Confirmed Code Bug Fixed (#3):** `src/auth-guard.js` previously missed `/auth/reset-password.html` in `AUTH_PAGES`, lacked subpath base-path resolution for `/Team-5-Capstone-Design/public/`, and did not exempt `reset-password` from authenticated redirects if someone clicked a direct recovery link.
4. **UNCONFIRMED Factor (Requires Re-Test with Custom SMTP):** Whether Supabase shared SMTP had already exhausted its Nov 9/10 project quota or dropped messages even for correctly spelled accounts (`adroni753@gmail.com` / `liftupkhadka555@gmail.com`) could not be read because `Audit Logs` is disabled (`OFF`) and Custom SMTP logs are unavailable.

---

## 11. Fixes Actually Implemented

- Updated [`src/auth-guard.js`](../../src/auth-guard.js) and [`public/src/auth-guard.js`](../../public/src/auth-guard.js): added subpath helpers, included `/auth/reset-password.html` & `/auth/verify.html`, and kept recovery sessions on `reset-password.html`.
- Verified [`src/services/auth.js`](../../src/services/auth.js) & [`public/auth/auth-init.js`](../../public/auth/auth-init.js) sanitize 6-digit OTPs cleanly, enforce `isLinkRecovery` vs `cleanOtp.length >= 6`, display rate-limit warnings, and sign out after `updatePassword()`.

---

## 12. Manual Configuration Still Required (Supabase Dashboard)

1. **Fix Typoed Account (`Authentication → Users`):** Update or remove `princekarki127@gmmail.com` and register with valid `princekarki127@gmail.com`.
2. **Configure Custom SMTP (`Project Settings → Authentication → SMTP Settings`):** Enable custom SMTP (Gmail App Password SMTP or Resend/Brevo) so emails bypass Supabase's 2–4/hour built-in cap.
3. **Verify Email Template (`Authentication → Notifications → Emails → Reset Password`):** Confirm both `{{ .Token }}` (6-digit PIN) and `{{ .ConfirmationURL }}` (direct link) are saved.
4. **Confirm Redirect URLs (`Authentication → URL Configuration`):** Allowlist `https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/**` and `http://localhost:3000/**`.
5. **Turn ON Audit Logs (optional diagnostics)** and enable **Confirm email** under **Sign In / Providers → Email** once SMTP is active.

---

## 13. Retesting Instructions

1. Complete Section 12 in Supabase Dashboard using a correctly spelled `@gmail.com` student account.
2. Open `https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/auth/forgot-password.html` (or local `http://localhost:3000/auth/forgot-password.html`) with browser DevTools Network tab open.
3. Submit the registered email; verify `POST /auth/v1/recover` returns HTTP `200`.
4. Confirm Gmail receives an email containing both the 6-digit PIN and direct link within 1 minute.
5. Click *"Enter 6-digit code & new password"*, verify the 6-digit PIN + set a new password (`>=8` chars, letter + number), confirm redirect to `login.html`, and sign in with the new password.

---

## 14. Final Verification Status

- **Status:** **BLOCKED / UNCONFIRMED for live Gmail OTP delivery** (awaiting Dashboard typo fix, Custom SMTP setup, and clean retest); **PASS (static code & auth-guard fix)**.
