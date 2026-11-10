# Academic Subject Selection Testing — Week 10

**Project:** Smart Study Companion — Team 5  
**Required Hierarchy:** `Country → University → Faculty/College → Major/Department → Subject`  
**Affected Files:** [`src/lib/academic-catalog.js`](../../src/lib/academic-catalog.js), [`src/services/subjects.js`](../../src/services/subjects.js), [`src/services/profile.js`](../../src/services/profile.js), [`public/app.js`](../../public/app.js), [`public/index.html`](../../public/index.html), [`supabase/migrations/010_complete_universities.sql`](../../supabase/migrations/010_complete_universities.sql)

---

## 1. Existing Implementation

- Dropdowns on `#view-subjects` (`#academic-country`, `#academic-university`, `#academic-faculty`, `#academic-major`) are initialized and cascaded by [`initAcademicHierarchy()`](../../public/app.js).
- Changing `Country` resets `University`, `Faculty`, `Major`, and enrolled subject selection (`updateUniversities('')`). Changing `Faculty` resets `Major` (`updateMajors('')`) and calls `onAcademicHierarchyChange(true)` to display curriculum-matched Core and Elective subjects.
- Signup (`public/auth/signup.html`) also exposes Region/Country → University cascading metadata saved to user metadata and profile trigger.

---

## 2. Database Mapping

- **`public.universities` (`46` live rows / `7` countries):** Queried via [`getUniversitiesCatalog()`](../../src/services/subjects.js) added in commit `ec6bd38`, supplemented for unseeded countries (`Bhutan`, `Maldives`, `Other / International`) from [`academic-catalog.js`](../../src/lib/academic-catalog.js) until [`010_complete_universities.sql`](../../supabase/migrations/010_complete_universities.sql) is run in Supabase SQL Editor.
- **`public.major_subjects` (`128` live rows):** Maps `4` faculties and `15` majors to `32` canonical subject slugs (`subjects.slug`).
- **`public.student_subjects` & `public.profiles`:** Persist selected subject enrollments (`student_id`, `subject_id`) and profile fields (`country`, `university`, `faculty`, `major`, `onboarding_completed`).

---

## 3. Available Dropdowns and Scrolling Lists

- `#academic-country` (`10` countries/regions), `#academic-university` (filtered dynamically by selected country), `#academic-faculty` (`4` faculties), `#academic-major` (filtered by selected faculty).
- `#subject-scroll-container` displays a scrollable subject grid with `#subject-search-input`, category/curriculum filter chips (`#subject-category-chips`), scope toggle (`major` vs `all`), and `#subjects-save-btn`.

---

## 4. Subject Selection Problems Identified & Fixed

1. **`subjects` RLS write violation (Fixed):** Previously `saveStudentSubjects()` called `.from('subjects').upsert(...)` which violates read-only `subjects` RLS for student users. Replaced with read-only slug-to-UUID lookup + `student_subjects` sync (`ec6bd38`).
2. **DB universities map parsing bug (Fixed):** Fixed `loadUserData()` + `initAcademicHierarchy()` to merge `dbUniversitiesByCountry` (grouped object from `getUniversitiesCatalog()`) properly instead of checking `.length` on an object.
3. **Stale `localStorage` overriding empty cloud enrollment (Fixed):** `getStudentSubjects()` now returns DB `[]` cleanly, and `loadUserData()` clears initial 3 default demo slugs when `currentProfile?.onboarding_completed` is true and DB returns empty.
4. **Silent error suppression on save (Fixed):** `saveAcademicProfileAndSubjects()` now validates Country → University membership and checks `{ error }` from both `saveStudentSubjects()` and `upsertProfile()` before navigating to Dashboard.
5. **Missing countries in DB `universities` (`Bhutan`, `Maldives`, `Other / International`):** Authored idempotent Migration [`010_complete_universities.sql`](../../supabase/migrations/010_complete_universities.sql).

---

## 5. Test Cases & 6. Actual Results

| Test ID | Scenario | Expected Behavior | Actual Result | Status | Evidence |
|---|---|---|---|---|---|
| **SUB-01** | Catalog integrity (10 countries, 4 faculties, 15 majors, 32 subjects) | Every country maps >=1 university; every major resolves valid subjects present in `SUBJECTS_CATALOG` & `QUIZ_BANK` | `backend-services.test.js` executes `getUniversities`, `getMajors`, `getSubjectsForMajor` across all entries with zero orphan slugs | **PASS (Vitest Unit)** | `npm test` (`27/27`), [`backend-services.test.js`](../../tests/unit/backend-services.test.js) |
| **SUB-02** | DB `universities` merge + offline country fallback | Live DB universities merged with offline `Bhutan`/`Maldives` fallbacks cleanly | Verified in `getUniversitiesCatalog()` unit test & live REST `universities` (`46` rows) | **PASS (Unit Mock) / Live Partial** | [`backend-services.test.js`](../../tests/unit/backend-services.test.js), live Rest probe |
| **SUB-03** | Read-only `subjects` lookup & `student_subjects` sync | Zero writes to `subjects`; only deselected rows deleted & selected rows upserted in `student_subjects` | Verified with mock query-call assertions in `backend-services.test.js` | **PASS (Unit Mock)** | [`backend-services.test.js`](../../tests/unit/backend-services.test.js) |
| **SUB-04** | Interactive UI cascading selection, scroll list, DB save & login restore | Student picks Country → University → Faculty → Major → Subjects, saves, reloads/re-logs in, and sees identical selection restored | Static HTML/JS controls verified in `tests/run_tests.py`; live interactive browser flow not executed against `supabase.co` | **NOT TESTED (Live Browser)** | [`public/app.js`](../../public/app.js) |
| **SUB-05** | Migration `010` execution on live Supabase | Live `universities` returns rows for all 10 countries | `010_complete_universities.sql` created locally; not yet run in Supabase SQL Editor | **BLOCKED (SQL Editor Action)** | [`010_complete_universities.sql`](../../supabase/migrations/010_complete_universities.sql) |

---

## 7. Remaining Issues

- Run [`010_complete_universities.sql`](../../supabase/migrations/010_complete_universities.sql) in Supabase SQL Editor.
- Execute **SUB-04** end-to-end with an authenticated test student browser session (confirm `profiles` + `student_subjects` rows persist after logout and re-login).
