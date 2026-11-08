# Supabase and Live App Verification Report

**Scope:** This review covers the Week 10 evidence folder, the current main-branch code used by the GitHub Pages app, the related Supabase services and migrations, and the repository deployment status. No files or database records were changed during this review.

**Evidence labels**
- Verified from repository/GitHub: confirmed in code, docs, or GitHub status.
- Not verified live: I could not exercise the app in an interactive browser or inspect the live Supabase project.

## A. Supabase Connection: Cannot Verify

**Verified from repository/GitHub:** The app code initializes a Supabase client and includes auth/database calls. The latest GitHub Pages deployment workflow completed successfully.

**Not verified live:** I could not confirm that the published app connects to Supabase Cloud, that the project is reachable, or that sign-in works. The Week 10 report explicitly marks database save/read and RLS verification as pending.

The client supports a local/demo mode when it does not find configuration. I found no evidence in the reviewed repository files that the GitHub Pages app receives the required Supabase values. That means the app may be running in Local Preview Mode; it needs a browser check to confirm.

## B. Configuration: Missing in the checked-in example; live settings cannot be verified

The checked-in `.env.example` contains placeholder values, not working project credentials. The browser client looks for `window.__ENV__` or `window.VITE_SUPABASE_*` values. A `.env` file is not, by itself, proof that those values reach a served GitHub Pages app.

I did not inspect or reveal any actual environment variables or keys. Never put a Supabase service-role key in browser code.

## C. Database Structure: Problems Found

**Verified from migrations:** The SQL files define profiles, subjects, student enrollments, tasks, quiz questions, quiz attempts/responses, and universities. The `tasks` table requires `student_id`, `subject_id`, a deadline, and a title with a length of 1–500 characters. Task RLS policies are written to restrict reads and changes to rows owned by the authenticated user.

**Problems:**
1. The README migration instructions list `001` through `006` only, and omit `007_universities.sql`, even though that migration adds profile fields and the universities table used by the newer app.
2. The `subjects` table has a read policy in the reviewed RLS migration, but the subject service attempts to upsert catalog rows. Normal authenticated users may be denied those writes.
3. `student_subjects` uses an upsert in the service, but the reviewed policies do not include an update policy for the conflict/update path.
4. Quiz question reads return `correct_answer` to the browser. Students can inspect those answers before completing a quiz.

These are findings from the checked-in code, not confirmation of what is installed in the live Supabase project.

## D. Save and Read Operations: Problems Found; live behavior not verified

The app contains Supabase calls for task creation, reading, updating, and deleting. However, the current frontend and service code disagree about field names:

- `public/app.js` passes `studentId` and `subjectId` to task creation.
- `public/src/services/tasks.js` reads `student_id` and `subject_id`.

As written, task inserts can omit required IDs and fail against the database schema. The same mismatch also affects the local fallback task fields.

Task editing has a related mismatch: the app passes `subjectId`, while the database column is `subject_id`. The update service forwards the supplied property, which can cause the database update to fail.

Quiz saving also has a parameter mismatch:
- `public/app.js` passes camelCase values such as `studentId` and `totalQuestions`.
- `public/src/services/quiz.js` reads snake_case values such as `student_id` and `total_questions`.

The caller also does not provide the service’s expected `mode` field. Quiz attempts are therefore likely to fail validation or insert incomplete data. This is a static code finding, not a live test result.

Some operations also ignore errors or show a success message without verifying that all database writes succeeded.

## E. RLS Security: Problems Found; live enforcement cannot be verified

**Verified from migration code:** `006_rls_policies.sql` enables RLS for `tasks` and defines policies that compare `student_id` with `auth.uid()` for read, insert, update, and delete. If the migration has been applied and the user is authenticated with a valid Supabase session, those task policies are designed to isolate student tasks.

**Not verified:** I could not inspect the live database to confirm that RLS is enabled, that these policies were applied, or that another student is actually blocked.

Other concerns include the missing subject write/update policies and client-visible quiz answers. Do not treat code in a migration file as proof that the live database has those protections.

## F. LocalStorage Fallback: Enabled in the code

The client selects local/demo behavior when Supabase configuration is absent. Task and profile data also have localStorage handling, and auth has a local demo path. A successful-looking demo sign-in or task display does not prove that Supabase Cloud saved the data.

The task form trims and checks the title before submission, so the UI rejects a blank or whitespace-only title. However, direct service/local-storage calls do not enforce the database constraint themselves. The database constraint only applies if the relevant migration is installed and the cloud path is used.

## G. Problems Found

1. Live Supabase connection, project configuration, applied schema, and RLS behavior remain unverified.
2. The checked-in `.env.example` uses placeholders.
3. The deployed GitHub Pages configuration is not evidenced in the reviewed files; the browser client can fall back to local/demo mode.
4. Task creation uses camelCase arguments in the frontend but snake_case fields in the service.
5. Task editing sends `subjectId` rather than `subject_id`.
6. Quiz attempt creation has mismatched argument names and does not provide the expected `mode`.
7. The README omits migration `007_universities.sql`.
8. Subject upserts may be blocked by RLS; enrollment upserts may need an update policy.
9. Some service and UI paths can mask database errors or report success without verifying all writes.
10. Quiz question queries expose correct answers to the client.
11. The tests reviewed cover helper calculations and repository structure, not live Supabase task persistence or two-student isolation.
12. The Week 10 planning document marks database, task-persistence, and RLS scenarios as pending.

## H. Required Fixes

No fixes have been made. Recommended steps:

1. **Fix task argument names:** Align the task calls in `public/app.js` with `public/src/services/tasks.js`. Use the same names consistently—especially `student_id` and `subject_id`—and verify the update payload uses the database column `subject_id`.
2. **Fix quiz argument names:** Align `finishQuiz()` in `public/app.js` with `saveQuizAttempt()` in `public/src/services/quiz.js`. Provide the required values, including the correct student, subject, mode, score, total question count, and response fields.
3. **Review subject permissions:** Decide whether students should be able to write shared subject catalog rows. If not, avoid client-side catalog upserts; otherwise add narrowly scoped, ownership-appropriate policies. Align the enrollment upsert with its RLS policies.
4. **Update setup instructions:** Add `007_universities.sql` to the migration sequence in `README.md`.
5. **Make failures visible:** Check and handle every Supabase error in the subject/profile/task/quiz save flows. Show success only after the required cloud operations actually succeed.
6. **Protect quiz answers:** If answers should stay hidden until submission, do not return `correct_answer` to the browser before scoring.
7. **Configure GitHub Pages safely:** Confirm how the published static app receives the project URL and public anon/publishable key. Do not expose a service-role key.
8. **Add integration tests:** Test the actual task service calls and RLS behavior using a dedicated test project and test accounts; keep credentials out of the repository.

## I. Manual Testing

Use a test Supabase project and test accounts, not real student data.

1. In the Supabase Dashboard, open **Project Settings → API**. Confirm the project URL and public anon/publishable key are configured for the deployed app. Do not share the key or use the service-role key in frontend code.
2. In **Table Editor**, confirm the expected tables exist. Check that the `tasks` columns and constraints match migration `003_tasks.sql`.
3. In the SQL Editor or table policy view, confirm RLS is enabled and inspect the policies for `tasks`, `profiles`, `student_subjects`, `subjects`, and quiz tables. Do not run changes until you have reviewed them.
4. Open the published signup page, create test student A, verify the email if required, and sign in. Confirm this is a real Supabase account—not a local demo session.
5. Create a task with a title, subject, and deadline. Check **Table Editor → tasks** for a row owned by student A. If the task fails, inspect the browser console/network response for the database error.
6. Refresh the app, sign back in as A, and check that the task is still present. Also verify the task row exists in the database.
7. Submit the task form with an empty title and spaces only. Confirm the UI blocks both and no row is added.
8. Create test student B in a separate browser session. Confirm B cannot see A’s task. Attempt to update or delete A’s task as B, then confirm it remains unchanged for A.
9. Repeat the checks only after confirming the app is using the configured Supabase project rather than Local Preview Mode.

I have not performed these interactive tests, so none of these scenarios is reported as passed.

## J. Final Conclusion

**The GitHub Pages deployment is verified at the workflow level, but the live app and Supabase functionality are not verified.** The current code has task and quiz argument mismatches that are likely to break cloud saves, plus setup and RLS concerns. Based on the checked-in code and Week 10 evidence, the database is not ready to be certified as working securely for student data until those issues are addressed and the manual save/read and two-student RLS tests pass.

### Week 10 evidence and live links

- Week 10 folder: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/main/docs/week_10
- Week 10 report: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/weekly-report.md
- Week 10 Slice plan: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/Slice.md
- Study analytics screenshot: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/study-analytics-dashboard.png
- Subjects/university screenshot: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/subjects-university-selector.png
- Live dashboard / analytics: https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html#analytics
- Live login: https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/auth/login.html
- Live signup: https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/auth/signup.html
- Successful Pages deployment workflow: https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/actions/runs/42372842865

This report is intentionally based on repository evidence and static inspection only. It does not claim that live Supabase Cloud behavior has been proven.
