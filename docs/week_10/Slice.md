
# Week 10 — Own a Slice, Steward an Area

**Project:** Smart Study Companion  
**Team:** Team 5  
**Date:** November 5, 2026  
**Status:** Planned / In Progress

> **Team planning document:** This document describes our proposed Week 10 ownership, roadmap slices, stewardship checks, and next actions. Test results are not claimed as passed unless they have been executed and supported by evidence.

## 1. Two Connected Responsibilities

Each Team 5 member has two connected responsibilities:

- **Roadmap Slice:** A small, verifiable development or testing behavior that contributes to the next milestone.
- **Codebase Area:** A repository area that the member helps maintain, review, document, and verify.
- **Shared Work:** Members coordinate across development, database, design, and testing areas. Ownership does not prevent other members from contributing.

Our primary goal is to stabilize Smart Study Companion's database, authentication, frontend, and core study features through implementation and repeatable testing.

### Assigned Responsibilities

| Member | Roadmap Slice | Area Stewardship | Backup / Handoff |
|---|---|---|---|
| Sumit Adhikari | Save and retrieve student study data using Supabase | Database schema, persistence, and security | Nabin reviews the backend/database interface |
| Prabin Rai | Automate one core task or quiz user journey | Functional and regression testing | Prince reviews and repeats the test |
| Prince Karki | Verify login, logout, and session restoration | Authentication and end-to-end testing | Nabin handles implementation defects; Prabin reviews tests |
| JN Taj Oli | Improve and verify responsive study dashboard UI | UI/UX, frontend styling, and accessibility | Nabin supports frontend integration |
| Nabin | Implement and verify frontend-to-backend authentication flow | Frontend, backend services, APIs, and login | Sumit reviews database access; Prince verifies authentication |

## 2. Team Codebase Area Map

The following boundaries describe logical areas of responsibility. Exact file paths must be confirmed against the current repository.

| Area | Repository Boundary / Components | Stewardship Check | Backup / Handoff |
|---|---|---|---|
| Database / Persistence | Supabase schema, migrations, tables, security policies | Data can be saved and read back; unauthorized access is blocked | Sumit → Nabin |
| Frontend / UI/UX | HTML, CSS, JavaScript, pages, components, themes | Layout works across screen sizes; navigation and controls remain usable | JN Taj → Nabin |
| Frontend / Backend Integration | Application logic, backend services, API calls, authentication client | Requests return expected results; errors are handled correctly | Nabin → Sumit / JN Taj |
| Authentication | Login, signup, logout, session restoration | Valid/invalid credentials and protected access are verified | Nabin → Prince |
| Functional Testing | Automated tests for tasks, quizzes, deadlines, navigation | Tests can be rerun and produce clear pass/fail output | Prabin → Prince |
| End-to-End Testing | Authentication and cross-feature user journeys | Tests cover successful and failing user paths | Prince → Prabin |

**Note:** Before final submission, each steward should link the actual repository directory or file. Do not treat these logical boundaries as verified file paths.

## 3. Roadmap Slices

Our next milestone is to make the existing Smart Study Companion application more reliable.

We have divided the work into five small, measurable slices.

### Slice 1 — Database Save and Read

**Owner:** Sumit Adhikari

**Area Stewarded:** Database and Supabase Integration

**Roadmap Behavior:**

A signed-in student creates a study task, and the application stores it in the database. The task can be retrieved again for that student.

**Implementation Scope:**
- Review required task data fields.
- Prepare or update the database schema.
- Configure the required table and relationships.
- Verify insert and read operations.
- Check student-level data access.

**Explain and Verify:**

**Meets:** Sumit explains how task data reaches the database and demonstrates a successful save/read operation with recorded results.

**Exceeds:** Nabin independently traces the backend-to-database handoff, reproduces the check, and verifies that another student cannot access the task.

| Case | Input | Expected Result | Observed Result |
|---|---|---|---|
| Valid task | Task title and deadline | Task is saved and can be read back | Pending |
| Missing required title | Blank task title | Validation error; invalid task is not saved | Pending |
| Unauthorized access | Another student's task ID | Access is denied | Pending |

**Check:** Database integration test, save/read evidence, and access-policy verification.

**Next Action:** Complete the database task flow and document actual test results.

**Evidence:** GitHub Issue, database changes, test output, and commit/PR link.

---

### Slice 2 — Automated Functional Testing

**Owner:** Prabin Rai

**Area Stewarded:** Functional and Regression Testing

**Roadmap Behavior:**

Automatically verify that a student can create a study task and see it in the task list.

**Implementation Scope:**
- Identify the task creation flow.
- Prepare automated test cases.
- Select and configure an appropriate testing framework.
- Verify valid and invalid task input.
- Record actual results.

**Explain and Verify:**

**Meets:** Prabin creates an automated task test that checks the expected behavior and documents its execution.

**Exceeds:** Prince independently runs the test, reproduces its results, and confirms that the failure path is covered.

| Case | Input | Expected Result | Observed Result |
|---|---|---|---|
| Create task | Valid task details | Task appears in task list | Pending |
| Invalid task | Empty required title | Error displayed; task is not created | Pending |
| Task persistence | Refresh or reopen the application | Task remains available in the intended storage mode | Pending |

**Check:** Repeatable automated test output with expected and actual results.

**Next Action:** Create the first automated task flow test and upload its execution evidence.

**Evidence:** Test script, execution logs, screenshots, and GitHub Issue.

---

### Slice 3 — Authentication and End-to-End Testing

**Owner:** Prince Karki

**Area Stewarded:** Authentication and End-to-End Testing

**Roadmap Behavior:**

Verify that a registered student can log in, access the study dashboard, refresh the page, and remain authenticated until logout.

**Implementation Scope:**
- Prepare valid and invalid login cases.
- Verify login behavior.
- Test session restoration after refresh.
- Verify logout behavior.
- Check access to protected pages.
- Automate important scenarios where feasible.

**Explain and Verify:**

**Meets:** Prince executes the authentication flow and records actual expected-versus-observed results.

**Exceeds:** Prabin independently repeats the tests and checks both successful login and authentication failure paths.

| Case | Input | Expected Result | Observed Result |
|---|---|---|---|
| Valid login | Registered account credentials | Student reaches dashboard | Pending |
| Invalid login | Incorrect credentials | Error displayed; access denied | Pending |
| Session restoration | Refresh after successful login | Session remains valid | Pending |
| Logout | Click logout | Session ends; protected pages require login | Pending |

**Check:** Authentication test results, logs, and session screenshots.

**Next Action:** Coordinate with Nabin, execute authentication tests, and report implementation defects.

**Evidence:** Test scripts, screenshots, GitHub Issue, and execution results.

---

### Slice 4 — UI/UX and Frontend Responsiveness

**Owner:** JN Taj Oli

**Area Stewarded:** UI/UX Design and Frontend Development

**Roadmap Behavior:**

The study dashboard remains usable on desktop and mobile screens, including navigation, task controls, and theme switching.

**Implementation Scope:**
- Review existing interface design.
- Improve page spacing and alignment.
- Implement responsive frontend changes.
- Check dark and light themes.
- Verify accessible controls and navigation.
- Coordinate UI components with Nabin.

**Explain and Verify:**

**Meets:** JN Taj implements a focused UI improvement and demonstrates expected layout behavior on desktop and mobile.

**Exceeds:** Nabin independently reviews the UI behavior, verifies that frontend changes do not break functionality, and records remaining limitations.

| Case | Input | Expected Result | Observed Result |
|---|---|---|---|
| Desktop layout | Open dashboard on desktop | Layout and controls display correctly | Pending |
| Mobile layout | Open dashboard at mobile viewport | Layout remains readable and usable | Pending |
| Theme switch | Switch between light and dark | Theme changes consistently | Pending |
| Navigation | Select dashboard navigation | Correct page or section opens | Pending |

**Check:** Responsive UI verification, screenshots, and functional checks.

**Next Action:** Improve one dashboard UI area and verify the change at desktop and mobile viewport sizes.

**Evidence:** Before/after screenshots, GitHub commits, and test results.

---

### Slice 5 — Full-Stack Authentication Integration

**Owner:** Nabin

**Area Stewarded:** Frontend, Backend, and Login Development

**Roadmap Behavior:**

A student submits valid login credentials through the frontend, the authentication service validates the request, and the application displays the authenticated dashboard.

**Implementation Scope:**
- Implement frontend login functionality.
- Connect frontend logic to authentication services.
- Develop or integrate required backend services/APIs.
- Handle authentication responses.
- Implement input validation and error handling.
- Integrate authenticated data access with the database.
- Coordinate backend/database integration with Sumit.

**Explain and Verify:**

**Meets:** Nabin explains the login request and response flow, demonstrates the working behavior, and records verification evidence.

**Exceeds:** Prince independently tests the authentication flow, while Sumit reviews its database/data-access handoff and unresolved integration issues.

| Case | Input | Expected Result | Observed Result |
|---|---|---|---|
| Valid login | Correct credentials | Authentication succeeds; dashboard opens | Pending |
| Invalid login | Incorrect password | Error displayed; access denied | Pending |
| Empty fields | Missing email/password | Validation prevents invalid submission | Pending |
| Backend failure | Authentication service unavailable | Clear error shown; no false success | Pending |
| Authorized request | Valid user session | Authorized data request succeeds | Pending |

**Check:** Frontend/backend integration tests, authentication checks, and peer verification.

**Next Action:** Connect frontend login with authentication/backend services and resolve integration failures.

**Evidence:** Commits, API/authentication test results, GitHub Issue, and screenshots.

## 4. Explain and Verify the Integration

The team must understand how the application works across areas.

### Authentication Flow

1. Student enters login credentials in the frontend.
2. Nabin's application logic submits the authentication request.
3. Supabase Auth or the configured authentication backend verifies the credentials.
4. The application receives the authentication result.
5. The frontend updates the user's authenticated state.
6. Authorized user data is retrieved through the required database access path.
7. Prince verifies the complete flow.

### Task Persistence Flow

1. Student enters task details.
2. The frontend validates the required information.
3. Application logic sends the data to the configured persistence service.
4. Supabase stores the authorized task record.
5. The application retrieves the saved task.
6. Prabin verifies the user-facing behavior.
7. Sumit checks database storage and access permissions.

These describe the intended integration flows and do not establish that all steps are already implemented.

## 5. Record Both Forms of Ownership

| Member | Slice Ownership | Area Stewardship | Cross-Area Handoff | Check | Open Action |
|---|---|---|---|---|---|
| Sumit | Task database save/read | Database and persistence | Nabin reviews data interface | CRUD and access tests | Complete database verification |
| Prabin | Automated task behavior | Functional testing | Prince repeats test | Automated pass/fail output | Add repeatable tests |
| Prince | Login and session verification | Authentication/E2E testing | Nabin resolves implementation issues | Auth test report | Verify full auth flow |
| JN Taj | Responsive dashboard | UI/UX and frontend | Nabin reviews integration | Responsive UI checks | Improve and verify layout |
| Nabin | Full-stack login flow | Frontend/backend/authentication | Sumit and Prince review boundaries | Integration and auth tests | Complete backend integration |

Area stewardship is a responsibility to keep the code understandable and testable, not exclusive permission to edit it.

Every slice should receive an independent teammate check before being marked complete.

## 6. AI-Assisted Development and Review

AI tools may be used only when permitted by the course rules.

If AI assistance is used, the responsible member must document:

- What AI was asked to help with.
- Which code, tests, or documentation were suggested.
- What the team changed or corrected.
- How the final result was independently reviewed.
- Which tests were actually executed.
- Any remaining uncertainty or limitation.

AI-generated code or test suggestions must not be presented as verified implementation without review and testing.

## 7. Week 10 Work Checklist

### Sumit — Database
- [ ] Confirm database schema.
- [ ] Configure required Supabase tables.
- [ ] Verify database CRUD operations.
- [ ] Verify database access policies.
- [ ] Coordinate backend handoff with Nabin.
- [ ] Record evidence.

### Prabin — Automated Functional Testing
- [ ] Identify critical task/quiz behaviors.
- [ ] Create automated test cases.
- [ ] Test a successful task flow.
- [ ] Test an invalid-input path.
- [ ] Execute and document tests.
- [ ] Request independent verification.

### Prince — Authentication Testing
- [ ] Prepare authentication test cases.
- [ ] Verify valid and invalid login.
- [ ] Verify logout.
- [ ] Check session restoration.
- [ ] Verify protected access.
- [ ] Record actual results.

### JN Taj — UI/UX and Frontend
- [ ] Review current UI design.
- [ ] Improve a dashboard component.
- [ ] Verify desktop responsiveness.
- [ ] Verify mobile responsiveness.
- [ ] Test theme and navigation.
- [ ] Upload screenshots.

### Nabin — Frontend, Backend, and Login
- [ ] Review frontend/backend code.
- [ ] Implement authentication integration.
- [ ] Verify frontend/backend requests.
- [ ] Handle validation and error responses.
- [ ] Coordinate database integration with Sumit.
- [ ] Fix issues reported by testers.
- [ ] Upload commits and evidence.

## 8. Definition of Done

A slice is considered complete when:

- [ ] The intended behavior is implemented.
- [ ] The responsible member can explain the code.
- [ ] The relevant repository area is documented.
- [ ] A meaningful successful test is executed.
- [ ] A relevant error or failure path is checked.
- [ ] Expected and observed results are recorded.
- [ ] A second teammate independently verifies the result.
- [ ] GitHub Issue, commit/PR, and evidence are linked.
- [ ] Known limitations and open actions are documented.

## 9. What Moves Our Work from Meets to Exceeds?

### Slice Ownership

**Meets:** The member implements or verifies a small behavior and provides a test result.

**Exceeds:** Another teammate can reproduce the behavior, including its failure path, using documented instructions.

### Area Stewardship

**Meets:** The member identifies the responsible codebase area and its main verification check.

**Exceeds:** The area has a verified repository boundary, documented checks, and an active backup/learning partner.

### Integration

**Meets:** The member explains how their feature connects with the adjacent area.

**Exceeds:** Both sides of the integration are reviewed and verified by relevant teammates.

### Testing

**Meets:** The member records expected and actual results for a meaningful test.

**Exceeds:** Tests are repeatable, include failure cases, and are independently reproduced.

### Responsible AI

**Meets:** The member records permitted AI assistance and reviews the generated content.

**Exceeds:** The member identifies what AI suggested, what was changed, and how the final result was verified.

### Open Gaps

**Meets:** The team records unfinished tasks and known limitations.

**Exceeds:** Each important unresolved issue has a named owner, next action, and verification requirement.

## 10. Evidence and Next Actions

Each member must link:

1. Their assigned roadmap GitHub Issue.
2. Relevant source files or code area.
3. Implementation commit or Pull Request.
4. Actual test result, output, or screenshots.
5. Independent reviewer or backup.
6. Remaining limitation and next action.

**Evidence Status:** Pending individual updates.

**Next Milestone:** Stabilize database persistence, authentication, frontend usability, and automated verification for the Smart Study Companion final demonstration.

**Important:** Do not mark any test as passed until it has actually been run. Evidence must reflect real repository work and real verification results.
