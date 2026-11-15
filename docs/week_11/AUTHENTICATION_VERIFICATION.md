# Authentication and Password Recovery Verification — Week 11 MVP Assessment

> **Evidence status (read first):** AI-assisted draft prepared 2026-11-15. Only these were actually executed: `npm test` (28/28), `python3 tests/run_tests.py` (11/11), `python3 tests/test_ai_quiz.py` (4/4), `npm run build`, the `tests/e2e/e2e_runner.py` contract check (files, HTML IDs, live Supabase REST probes), and read-only Supabase probes. Playwright browser specs, live auth/email flows, two-student browser tests, and UI/accessibility checks were **NOT run**. Teammate approvals and contributions are **not confirmed**; each member must add their own evidence.


**Project:** Smart Study Companion  
**Integration Owner:** Nabin Khadka (`liftupkhadka555-spec`)  
**Independent Testing Partner:** Prince Karki (`princekark`)  
**Target Environment:** Supabase Auth (`bcwwnjtmrcxggbaallon.supabase.co`) + Brevo SMTP Relay  
**Date:** 2026-11-15  
**Status:** Client-side auth logic and route guards reviewed in code/unit tests; live flows NOT tested; Brevo SMTP setup documented for Supabase Dashboard execution.

---

## 1. Authentication Code & Route Guard Inspection

The authentication system spans 5 dedicated HTML pages, a shared controller, a client service, and a session guard:

| Module / File | Primary Functions | Verification Finding |
|---|---|---|
| [`public/auth/signup.html`](../../public/auth/signup.html) | Registration form, Country/University selector, password rules | Enforces 8+ chars with letters & numbers; redirects strictly to login upon success |
| [`public/auth/login.html`](../../public/auth/login.html) | Sign-in form, error alerts, registration success notice | Pre-fills registered email; smart-routes to `#subjects` or `#dashboard` |
| [`public/auth/verify.html`](../../public/auth/verify.html) | Email confirmation, 6-digit PIN entry, resend verification | Listens for hash tokens (`#access_token`) and supports manual 6-digit OTP confirmation |
| [`public/auth/forgot-password.html`](../../public/auth/forgot-password.html) | Password recovery email dispatch | Validates email syntax, initiates reset, and provides direct button to `reset-password.html` |
| [`public/auth/reset-password.html`](../../public/auth/reset-password.html) | Dual-mode password reset (6-digit OTP code or recovery link) | Includes 6-digit PIN input, 60s cooldown timer, and password match validation |
| [`public/auth/auth-init.js`](../../public/auth/auth-init.js) | Shared client-side authentication controller | Binds UI events to Supabase Auth service functions |
| [`src/services/auth.js`](../../src/services/auth.js) | API wrappers for `signUp`, `signIn`, `verifyOtp`, `resetPasswordForEmail` | Sanitizes 6-digit tokens (`replace(/\D/g, '')`) and handles errors gracefully |
| [`src/auth-guard.js`](../../src/auth-guard.js) | Route protection & session validation | **Fixed in `ec6bd38`:** Explicitly exempts `reset-password.html` from login redirect loops |

---

## 2. Brevo Custom SMTP Integration Architecture

The live probe on 2026-11-15 confirmed:
```json
{
  "external_email": true,
  "disable_signup": false,
  "mailer_autoconfirm": true,
  "smtp_configured": null
}
```
Currently, **`smtp_configured: null`** and **`mailer_autoconfirm: true`**, meaning Supabase's built-in shared mailer is capped at 2–4 emails/hour and email confirmation is bypassed.

### Exact Brevo SMTP Configuration for Supabase Dashboard
To enable real email verification and reliable password-reset OTP delivery:

1. Log in to [Brevo](https://www.brevo.com/) and navigate to **Transactional → Settings → Configuration**.
2. Note your **SMTP Server**, **Port**, **Login**, and generate a new **SMTP Master Password / Key**.
3. In the [Supabase Dashboard](https://supabase.com/dashboard/project/bcwwnjtmrcxggbaallon/settings/auth):
   - Navigate to **Project Settings → Authentication → SMTP Settings**.
   - Toggle **Enable Custom SMTP** to `ON`.
   - **Sender email:** `noreply@yourdomain.com` (or your verified Brevo sender email).
   - **Sender name:** `Smart Study Companion`.
   - **Host:** `smtp-relay.brevo.com`.
   - **Port:** `587`.
   - **Encryption:** `STARTTLS`.
   - **Username:** `<Your Brevo SMTP Login>`.
   - **Password:** `<Your Brevo SMTP Key>`.
   - Click **Save**.
4. In **Authentication → Providers → Email**:
   - Set **Confirm email** to `ON` (disabling `mailer_autoconfirm`).
   - Confirm **Secure email change** is `ON`.
5. In **Authentication → Email Templates**:
   - Update **Reset Password** template with dual recovery tokens per [`docs/SUPABASE_EMAIL_TEMPLATES_SETUP.md`](../SUPABASE_EMAIL_TEMPLATES_SETUP.md):
     ```html
     <h2>Reset Your Smart Study Companion Password</h2>
     <p>Your 6-digit verification code is: <strong>{{ .Token }}</strong></p>
     <p>Or click this link to reset your password directly:</p>
     <p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
     ```

---

## 3. Test Account Typo Resolution

The November 10 investigation ([`docs/week_10/password-reset-investigation.md`](../week_10/password-reset-investigation.md)) confirmed:
- In the Supabase Users list, tester Prince Karki's account was registered as **`princekarki127@gmmail.com`** (with two `m`'s).
- Requests submitted on `forgot-password.html` for `princekarki127@gmail.com` returned HTTP 200 (to prevent email enumeration) but sent nothing.
- **Action for Week 11:** The tester must register a fresh account with the correct email `princekarki127@gmail.com` once Brevo SMTP is active, or use disposable test accounts.

---

## 4. Redirect URL Allowlists

To prevent malicious redirects and ensure session hash tokens are captured:
In **Supabase Dashboard → Authentication → URL Configuration**:
- **Site URL:** `https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html` (or Vercel production URL).
- **Redirect URLs (Allowlist):**
  - `http://localhost:5173/**`
  - `http://localhost:4173/**`
  - `https://capstonedesign-fall2026-ulsancollege.github.io/**`
  - `https://*.vercel.app/**`

---

## 5. Fourteen-Step Live Authentication Test Journey

The table below outlines the end-to-end verification checklist using disposable test accounts (`studentA_test@example.com` and `studentB_test@example.com`):

| Step | User Action | Expected System Response | Current Automated / Live Status |
|---|---|---|---|
| **1** | Submit valid signup form | Account created in `auth.users`, profile created in `public.profiles` | **CODE-REVIEWED ONLY, NOT LIVE-TESTED (Unit/Mock); LIVE BLOCKED until Brevo SMTP** |
| **2** | Check inbox for confirmation email | Branded email received via Brevo relay with 6-digit PIN and confirmation link | **PENDING Brevo Dashboard Setup** |
| **3** | Click verification link or submit 6-digit PIN on `verify.html` | Session verified, redirect to `#subjects` onboarding | **CODE-REVIEWED ONLY, NOT LIVE-TESTED (Code Contract in `auth.js`)** |
| **4** | Log in with confirmed credentials on `login.html` | Successful authentication, JWT stored in localStorage, redirect to dashboard | **CODE-REVIEWED ONLY, NOT LIVE-TESTED (Live REST probe verified)** |
| **5** | Attempt login with incorrect password | Error alert *"Invalid login credentials"* displayed; no false session created | **CODE-REVIEWED ONLY, NOT LIVE-TESTED (Verified in `auth.test.js`)** |
| **6** | Refresh browser tab while logged in | Session automatically restored by `auth-guard.js`; student remains logged in | **CODE-REVIEWED ONLY, NOT LIVE-TESTED (Verified in `backend-services.test.js`)** |
| **7** | Click "Sign Out" button | Supabase session cleared, tokens removed from storage, redirected to `login.html` | **CODE-REVIEWED ONLY, NOT LIVE-TESTED (Verified in `auth.js`)** |
| **8** | Attempt to open `index.html#tasks` directly after logout | `auth-guard.js` detects null session and redirects immediately to `login.html` | **CODE-REVIEWED ONLY, NOT LIVE-TESTED (Verified in `auth-guard.js`)** |
| **9** | Submit registered email on `forgot-password.html` | Success card displayed with button linking to `reset-password.html` | **CODE-REVIEWED ONLY, NOT LIVE-TESTED (Verified in `e2e_runner.py`)** |
| **10** | Receive recovery email | Recovery email delivered via Brevo containing `{{ .Token }}` (6-digit PIN) | **PENDING Brevo Dashboard Setup** |
| **11** | Enter invalid/expired 6-digit code on `reset-password.html` | Visible error alert *"Invalid or expired verification code"* displayed | **CODE-REVIEWED ONLY, NOT LIVE-TESTED (Verified in `auth.js`)** |
| **12** | Enter valid 6-digit code or open recovery link | Code verified via `supabase.auth.verifyOtp({ type: 'recovery' })` | **CODE-REVIEWED ONLY, NOT LIVE-TESTED (Verified in `backend-services.test.js`)** |
| **13** | Submit matching new password (8+ chars, letter, number) | Password updated via `supabase.auth.updateUser({ password })`, success card shown | **CODE-REVIEWED ONLY, NOT LIVE-TESTED (Verified in `auth.test.js`)** |
| **14** | Log in with newly updated password | Sign-in succeeds; old password no longer accepted | **CODE-REVIEWED ONLY, NOT LIVE-TESTED (Verified in code logic)** |

