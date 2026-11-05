
# Week 10 — Code Ownership, Slices, and Work List

**Project:** Smart Study Companion  
**Team:** Team 5  
**Date:** November 5, 2026  
**Status:** Planned / In Progress  
**Repository:** https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design

## 1. Team Goal

Our Week 10 goal is to establish clear code ownership, improve our application's core features, and introduce systematic automated testing.

Each team member is responsible for a specific development or testing slice, including implementation, verification, documentation, and GitHub evidence.

## 2. Team Slice and Ownership Table

| Team Member | Slice | Area / Ownership | Check | Next Action |
|---|---|---|---|---|
| Sumit Adhikari | Database Development | Supabase, database tables, relationships, and data storage | Verify database connectivity, CRUD operations, and access permissions | Design database schema, integrate Supabase, and test data operations |
| Prabin Rai | Automated Functional Testing | Tasks, quizzes, navigation, and regression testing | Run repeatable tests and document actual pass/fail results | Create automated tests and report bugs |
| Prince Karki | Authentication and End-to-End Testing | Signup, login, logout, sessions, and user journeys | Verify authentication behavior, session persistence, and protected pages | Develop test cases and execute end-to-end tests |
| JN Taj Oli | UI/UX and Frontend Development | Interface design, styling, responsiveness, accessibility, and themes | Verify layout consistency, mobile responsiveness, and navigation | Improve frontend design and implement responsive components |
| Nabin | Frontend and Login Development | Authentication UI, form validation, navigation, and backend integration | Verify signup/login functionality, errors, and authentication flow | Implement and integrate login/signup with Supabase Auth |

## 3. Individual Slices and Responsibilities

### 3.1 Sumit Adhikari — Database Development

**My Slice:** Database Development and Supabase Integration

**Area I Own:**
- Database design and schema
- Supabase configuration
- University, faculty, department, and subject data
- Student profiles and study records
- Task, quiz, and progress data storage

**My Check:**
- Verify database connection.
- Test Create, Read, Update, and Delete operations.
- Verify table relationships.
- Check Row Level Security policies.
- Confirm student data is stored and retrieved correctly.

**My Next Action:**
1. Review database requirements.
2. Design required tables and relationships.
3. Configure Supabase.
4. Connect application features to the database.
5. Test database operations and permissions.
6. Upload implementation and testing evidence.

**Status:** Planned / In Progress

---

### 3.2 Prabin Rai — Automated Functional Testing

**My Slice:** Automated Functional and Regression Testing

**Area I Own:**
- Functional test cases
- Automated testing scripts
- Task and deadline testing
- Quiz functionality testing
- Navigation and regression testing

**My Check:**
- Verify task creation, editing, and deletion.
- Test quiz submission and scoring.
- Verify page navigation.
- Check study progress features.
- Confirm existing features still work after updates.

**My Next Action:**
1. Identify important application features.
2. Prepare repeatable functional test cases.
3. Set up an automated testing framework.
4. Automate critical test scenarios.
5. Execute tests and record results.
6. Open GitHub Issues for identified defects.

**Status:** Planned / In Progress

---

### 3.3 Prince Karki — Authentication and End-to-End Testing

**My Slice:** Authentication and End-to-End Testing

**Area I Own:**
- Signup testing
- Login testing
- Logout and session testing
- Authentication error handling
- End-to-end user journey testing

**My Check:**
- Verify signup using valid information.
- Test duplicate email registration.
- Test valid and invalid login attempts.
- Verify logout functionality.
- Test session persistence after refresh.
- Check protected route access.
- Verify the complete authentication flow.

**My Next Action:**
1. Prepare authentication test cases.
2. Coordinate with Nabin.
3. Test signup and login functionality.
4. Automate important authentication scenarios.
5. Run end-to-end tests.
6. Document actual results and report defects.

**Status:** Planned / In Progress

---

### 3.4 JN Taj Oli — UI/UX and Frontend Development

**My Slice:** UI/UX Design and Frontend Implementation

**Area I Own:**
- User interface design
- Frontend styling and components
- Responsive layouts
- Dark and light themes
- Accessibility and usability
- Design consistency

**My Check:**
- Verify consistent design across pages.
- Check mobile and desktop responsiveness.
- Verify navigation buttons.
- Test dark/light theme consistency.
- Check readability and layout alignment.
- Verify frontend usability.

**My Next Action:**
1. Review the existing application interface.
2. Identify UI/UX problems.
3. Improve frontend HTML, CSS, and JavaScript.
4. Implement responsive layouts.
5. Fix theme and navigation issues.
6. Coordinate frontend changes with Nabin.
7. Upload screenshots and GitHub commits.

**Status:** Planned / In Progress

---

### 3.5 Nabin — Frontend and Login Development

**My Slice:** Frontend Development and Authentication Implementation

**Area I Own:**
- Login and signup pages
- Frontend form validation
- Authentication integration
- Login error handling
- Page navigation
- Frontend-to-backend connection

**My Check:**
- Verify login/signup pages load correctly.
- Check required input validation.
- Verify successful authentication.
- Test incorrect credentials.
- Verify navigation after login/logout.
- Confirm authentication works across devices.

**My Next Action:**
1. Review existing authentication code.
2. Improve login and signup interfaces.
3. Integrate Supabase Auth.
4. Implement proper validation.
5. Coordinate testing with Prince Karki.
6. Fix authentication defects.
7. Submit commits and testing evidence.

**Status:** Planned / In Progress

## 4. Week 10 Work Checklist

### Database — Sumit Adhikari
- [ ] Review database requirements.
- [ ] Design database schema.
- [ ] Configure Supabase tables.
- [ ] Connect application data.
- [ ] Test CRUD operations.
- [ ] Verify access permissions.
- [ ] Upload GitHub evidence.

### Automated Testing — Prabin Rai
- [ ] Identify critical features.
- [ ] Prepare functional test cases.
- [ ] Configure automated testing.
- [ ] Test tasks and deadlines.
- [ ] Test quizzes and navigation.
- [ ] Record test results.
- [ ] Report bugs and upload evidence.

### Authentication Testing — Prince Karki
- [ ] Prepare authentication test cases.
- [ ] Test signup/login functionality.
- [ ] Test incorrect credentials.
- [ ] Verify logout and session persistence.
- [ ] Run end-to-end tests.
- [ ] Record actual pass/fail results.
- [ ] Upload evidence.

### UI/UX and Frontend — JN Taj Oli
- [ ] Review current UI/UX.
- [ ] Improve frontend components.
- [ ] Implement responsive design.
- [ ] Verify dark/light themes.
- [ ] Check navigation and accessibility.
- [ ] Fix UI issues.
- [ ] Upload evidence.

### Frontend and Login — Nabin
- [ ] Review existing login code.
- [ ] Improve login/signup pages.
- [ ] Integrate Supabase Auth.
- [ ] Implement validation and errors.
- [ ] Test authentication navigation.
- [ ] Resolve reported issues.
- [ ] Upload commits and evidence.

## 5. Team Collaboration

| Members | Collaboration |
|---|---|
| Sumit + Nabin | Backend and frontend integration |
| Nabin + Prince | Authentication implementation and testing |
| JN Taj + Nabin | Frontend consistency and UI improvements |
| Prabin + Prince | Automated functional and end-to-end testing |
| All Members | GitHub documentation, code review, and bug fixing |

## 6. Definition of Done (DoD)

A task is complete when:

- [ ] Assigned functionality is implemented.
- [ ] Code is committed to GitHub.
- [ ] Relevant automated or manual tests are executed.
- [ ] Actual test results are documented.
- [ ] Known defects and limitations are recorded.
- [ ] GitHub Issue and evidence links are added.
- [ ] Changes are reviewed by the responsible team member.

## 7. Evidence Requirements

Each member must provide:

1. **GitHub Issue:** Assigned task link.
2. **Commit/PR:** Implementation evidence.
3. **Test Results:** Pass, Fail, or Blocked with explanation.
4. **Screenshots:** Relevant interface or test evidence.
5. **Next Action:** Remaining work and known blockers.

## 8. Next Sprint Priorities

1. Complete and verify Supabase database integration.
2. Implement and validate login/signup functionality.
3. Improve frontend responsiveness and usability.
4. Add automated functional and authentication tests.
5. Resolve defects identified during testing.
6. Document code ownership and evidence.
7. Prepare a stable application for the final demonstration.

## 9. Expected Outcome

By the end of this work period, Team 5 aims to establish clear development ownership, strengthen authentication and database integration, improve the frontend interface, and introduce repeatable automated tests.

Every completed task must be supported by actual implementation and verification evidence.

**Note:** All checklist items are initially unchecked. They must only be marked complete after the work and verification are finished.

