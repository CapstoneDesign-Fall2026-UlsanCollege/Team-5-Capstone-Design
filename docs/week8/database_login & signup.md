
# Database Design: Login & Signup Feature

## 1. Database Structure

The database contains three tables to support user registration, login, and password recovery.

- **Users:** Stores user account and profile information.
- **User Sessions:** Stores login session information.
- **Password Reset Tokens:** Stores information needed for password recovery.

## 2. Users Table

Stores information about students when they create an account.

| Column Name | Data Type | Description |
|---|---|---|
| user_id | INT (Primary Key) | Unique user ID |
| full_name | VARCHAR(100) | Student's full name |
| email | VARCHAR(255) UNIQUE | Student's email address |
| password_hash | VARCHAR(255) | Hashed password |
| major | VARCHAR(100) | Student's major (optional) |
| study_year | INT | Student's academic year (optional) |
| university | VARCHAR(150) | Student's university (optional) |
| terms_accepted_at | TIMESTAMP | Time when terms were accepted |
| account_status | VARCHAR(20) | Account status |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last account update time |

### Database Rules

- User ID must be unique.
- Full name, email, and password hash are required.
- Email addresses must be unique.
- Passwords must be hashed before being stored.
- Major, study year, and university are optional.
- Passwords must contain at least 8 characters before hashing.
- Terms and conditions must be accepted before signup.

## 3. User Sessions Table

Stores information about user login sessions.

| Column Name | Data Type | Description |
|---|---|---|
| session_id | INT (Primary Key) | Unique session ID |
| user_id | INT (Foreign Key) | References the users table |
| token_hash | VARCHAR(255) UNIQUE | Hashed session token |
| expires_at | TIMESTAMP | Session expiration time |
| created_at | TIMESTAMP | Session creation time |
| revoked_at | TIMESTAMP | Session revocation time |

### Database Rules

- Each session must belong to an existing user.
- Session tokens must be generated securely.
- Session tokens must expire after a limited time.
- Expired or revoked sessions cannot be used.
- One user can have multiple login sessions.

## 4. Password Reset Tokens Table

Stores information required for password recovery.

| Column Name | Data Type | Description |
|---|---|---|
| reset_id | INT (Primary Key) | Unique reset request ID |
| user_id | INT (Foreign Key) | References the users table |
| token_hash | VARCHAR(255) UNIQUE | Hashed password reset token |
| expires_at | TIMESTAMP | Token expiration time |
| used_at | TIMESTAMP | Time when the token was used |
| created_at | TIMESTAMP | Reset request creation time |

### Database Rules

- Each reset token must belong to an existing user.
- Reset tokens must expire after a limited time.
- Each reset token can be used only once.
- Passwords must be hashed before updating the database.
- Old login sessions should be revoked after a password reset when appropriate.

## 5. Database Relationship Diagram

```text
          +----------------------+
          |        USERS         |
          +----------------------+
          | PK user_id           |
          | full_name            |
          | email (UNIQUE)       |
          | password_hash        |
          | major                |
          | study_year           |
          | university           |
          | account_status       |
          | created_at            |
          +----------------------+
                    |
          +---------+---------+
          |                   |
          |                   |
          v                   v
+------------------+  +----------------------+
|  USER_SESSIONS   |  | PASSWORD_RESET_TOKENS|
+------------------+  +----------------------+
| PK session_id    |  | PK reset_id          |
| FK user_id       |  | FK user_id           |
| token_hash       |  | token_hash           |
| expires_at       |  | expires_at            |
| created_at       |  | used_at               |
| revoked_at       |  | created_at            |
+------------------+  +----------------------+
```

### Relationships

- One user can have multiple login sessions.
- One user can have multiple password reset requests.
- Foreign keys connect both tables to the users table.

## 6. Database Validation Rules

- Email must have a valid format.
- Email addresses must be unique.
- Full name is required.
- Password must contain at least 8 characters before hashing.
- Password confirmation must match the password.
- Terms and conditions must be accepted.
- Required fields cannot be empty.
- Session and reset tokens must be secure and expire appropriately.

Input validation must be performed on both the frontend and backend. The database must enforce unique email addresses and other applicable integrity constraints.

## 7. Database Security

- Use HTTPS for communication between the application and server.
- Store password hashes instead of plain-text passwords.
- Use a secure password-hashing algorithm such as Argon2id.
- Protect session tokens and password reset tokens.
- Use rate limiting to prevent repeated login attempts.
- Use foreign keys to maintain relationships between tables.
- Remove expired sessions and used or expired reset tokens according to the data retention policy.

## 8. Database Flow

### Signup Flow

1. User enters their name, email, and password.
2. The application validates the input.
3. The backend checks whether the email already exists.
4. The backend hashes the password.
5. The user information is saved in the users table.
6. The user is redirected to onboarding or the dashboard.

### Login Flow

1. User enters their email and password.
2. The backend searches for the account by email.
3. The backend verifies the password.
4. A secure login session is created.
5. Session information is saved in the user_sessions table.
6. The user is redirected to the dashboard.

### Password Reset Flow

1. User requests a password reset.
2. The system generates a secure reset token.
3. The reset link is sent to the user's email.
4. The system verifies the token.
5. The user creates a new password.
6. The new password hash is saved in the users table.

## 9. Definition of Done

- The users table supports account registration and login.
- Email uniqueness is enforced.
- Passwords are stored securely as hashes.
- Required and optional profile fields are defined.
- Login sessions can expire and be revoked.
- Password recovery is supported.
- Database relationships and constraints are documented.
- Security and data integrity requirements are covered.

## Notes

The database is being tested locally so real database will be updated till week-9
