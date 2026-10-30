# Login & Signup Feature Suggestions

## Project Goal

Smart Study Companion should let students create a personal study account, sign in securely, and continue using their study tasks, subjects, and quiz progress without losing access between sessions. The login and signup experience should feel simple, trustworthy, and suitable for college students.

## Suggested User Experience

### 1. Login Page

The login page should be a clean, centered card with the app branding at the top.

Suggested layout:
- Smart Study Companion title and short subtitle
- Email field
- Password field
- "Keep me signed in" checkbox
- "Forgot password?" link
- Primary button: "Sign In"
- Secondary text: "New here? Create account"

Suggested visual flow:
1. User opens the app.
2. User enters email and password.
3. App validates required fields.
4. If valid, backend checks credentials.
5. On success, redirect to dashboard.
6. On failure, show a clear error and let the user retry.

### 2. Signup Page

The signup page should be straightforward and not overwhelming for first-time users.

Suggested fields:
- Full name
- Email address
- Password
- Confirm password
- Optional: major
- Optional: study year
- Optional: university
- Checkbox for accepting terms and conditions

Suggested flow:
1. User clicks "Create account".
2. User fills out all required fields.
3. App validates data in real time or on submit.
4. Backend checks duplicate email.
5. Password is hashed and saved.
6. User is redirected to dashboard or onboarding.

## Validation Rules

### Login validation
- Email must be in a valid format.
- Password must be entered.
- Show inline validation for empty or invalid input.
- If credentials are incorrect, show a general error message such as "Incorrect email or password."

### Signup validation
- Full name is required.
- Email is required and must be unique.
- Password must be at least 8 characters.
- Confirm password must match.
- Terms and conditions must be accepted.
- Optional profile fields should be saved only if provided.

## Suggested Error Messages

- Please enter a valid email address.
- Password is required.
- Password must be at least 8 characters long.
- Passwords do not match.
- This email is already in use.
- Incorrect email or password.
- Please accept the terms and conditions.

## Suggested Security Requirements

- Use HTTPS only.
- Hash passwords before saving to the database.
- Validate inputs on both frontend and backend.
- Rate-limit repeated login attempts.
- Store session tokens securely.
- Use short-lived tokens and expiration logic.
- Support password reset with email-based token flow.
- Never expose sensitive backend details to end users.

## Suggested Database Concept

The repository already proposes a basic design with:
- Users table
- User Sessions table
- Password Reset Tokens table

Recommended fields:

### Users
- user_id
- full_name
- email
- password_hash
- major
- study_year
- university
- terms_accepted_at
- account_status
- created_at
- updated_at

### User Sessions
- session_id
- user_id
- token_hash
- expires_at
- created_at
- revoked_at

### Password Reset Tokens
- reset_id
- user_id
- token_hash
- expires_at
- used_at
- created_at

This structure is a strong starting point for a secure and manageable student-auth system.

## Suggested Authentication Flow

### Signup Flow
1. User opens signup form.
2. User enters full name, email, password, and confirmation.
3. Frontend validates data.
4. Backend confirms email is not already registered.
5. Password is hashed and stored.
6. User account is created.
7. User is redirected to the dashboard or onboarding view.

### Login Flow
1. User enters email and password.
2. Backend looks up user by email.
3. Backend verifies password hash.
4. Backend creates a secure session token.
5. Session token is stored in the session table.
6. User is redirected to the app dashboard.

### Password Reset Flow
1. User requests reset from login screen.
2. System creates a reset token.
3. Token is emailed to the user.
4. User sets a new password.
5. System stores the new hash and invalidates old sessions if needed.

## Suggested Acceptance Criteria

- Students can create an account with required fields.
- Duplicate email addresses are rejected.
- Students can log in with valid credentials.
- Invalid login attempts return clear feedback.
- Passwords are never stored in plain text.
- Sessions expire and can be revoked.
- Password reset can be completed through a secure token flow.

## Recommended Next Step

The next implementation step should be to build the UI screens and backend endpoint structure for:
- Login page
- Signup page
- Forgot password page
- Account validation and secure session creation

This will prepare the project for a working authentication prototype that matches the current documentation and the Smart Study Companion app goals.

## Summary

The current repository documents already define good requirements for the login and signup feature. The most important recommendations are to keep the experience simple, validate thoroughly, use secure password hashing, and design the database around users, sessions, and password reset tokens.

This proposal keeps the feature aligned with the project’s current student-focused scope while remaining practical for a college capstone prototype.

