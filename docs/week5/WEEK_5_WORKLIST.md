# Week 5 Work Checklist — Start the Vertical Slice

**Date:** Thu 2026-10-01 to Wed 2026-10-07  
**Team:** Team 5 (Smart Study Companion)  
**Midterm Demo Date:** Thu 2026-10-08  

> Choose one small user path, start the first implementation work, and make the proof you will show next week easy to find. Complete the core, link the evidence in GitHub, then choose stretch work that reduces a real risk or improves the product.

---

## Core work — complete all

### 1. Choose and define the slice

- [ ] Review the Week 4 Chuseok Checkpoint, Week 3 candidate slice, and current stack comparison.
- [ ] Choose one small end-to-end user path the team will show on Thu 2026-10-08.
- [ ] Name what the user does, what the system does or shows, and what will count as proof.
- [ ] Confirm the stack (React + Vite + localStorage), or ask the instructor to approve any temporary changes with an owned test and decision date.
- [ ] Update the Vertical Slice Plan and link the relevant design, wireframe, and architecture notes.

**Candidate slice:** Subject and task creation with localStorage persistence  
**Proof:** User creates a subject, adds a task with deadline, refreshes the page, and task persists.

---

### 2. Make the work owned and buildable

- [ ] **Track 1 (Project Setup)** — Owner: **Nabin Khadka**
  - [ ] Scaffold React + Vite project
  - [ ] Set up npm scripts (`npm run dev`, `npm run build`, `npm test`)
  - [ ] Initialize basic folder structure (`src/`, `src/components/`, `src/pages/`, `src/hooks/`)
  - [ ] Add README with setup instructions for other team members
  - [ ] Create initial commit and merge to main
  - **Definition of Done:** `npm run dev` runs successfully on all team members' machines

- [ ] **Track 2 (Subject and Task UI)** — Owner: **Sumit Adhikari**
  - [ ] Create Dashboard component (landing page)
  - [ ] Create Subject List component (displays all subjects)
  - [ ] Create Add Subject form component
  - [ ] Create Subject Detail page (shows tasks for one subject)
  - [ ] Create Add Task form component (with deadline input)
  - [ ] Create Task List component (displays completed and incomplete tasks)
  - **Definition of Done:** UI renders without localStorage; user can see create forms and list screens

- [ ] **Track 3 (localStorage Integration)** — Owner: **Prince Karki**
  - [ ] Create custom hook `useLocalStorage` for persistence
  - [ ] Wire localStorage save/load into Subject List (read/write subjects)
  - [ ] Wire localStorage save/load into Task List (read/write tasks)
  - [ ] Test persistence with browser DevTools Application tab
  - [ ] Document localStorage data structure (JSON schema for subjects and tasks)
  - **Definition of Done:** Data persists after page refresh; localStorage DevTools shows saved data

- [ ] **Track 4 (localStorage Persistence Test)** — Owner: **Prabin Rai**
  - [ ] Create test case: create subject, add task, refresh, verify persistence
  - [ ] Run test against the running app
  - [ ] Capture screenshots of DevTools localStorage and UI
  - [ ] Document pass/fail result and any bugs found
  - [ ] Link evidence in the test report
  - **Definition of Done:** Documented test result with screenshots; bugs logged as GitHub issues if found

- [ ] **Track 5 (Documentation & Weekly Report)** — Owner: **J.N. Taj Oli**
  - [ ] Create Vertical Slice Plan document (link to design and wireframe)
  - [ ] Write setup instructions for running the app locally
  - [ ] Collect evidence from all tracks (commits, PR links, test screenshots)
  - [ ] Create shared Week 5 Weekly Report with individual rows for each team member
  - [ ] Write a one-sentence summary of the visible proof the team will show on Oct 8
  - **Definition of Done:** All evidence linked; every team member has added their own row with contribution and evidence

---

### 3. Evidence to link

- [ ] Stack decision note (already completed in Week 4 Checkpoint)
- [ ] Vertical Slice Plan and links to current design/wireframe/architecture notes
- [ ] 5 implementation tracks with owners and checkable Definitions of Done
- [ ] First implementation commit(s) or an owned blocker Issue describing the next action
- [ ] One shared Week 5 Weekly Report with an individual evidence row for every team member
- [ ] A sentence naming the visible, testable proof the team will bring on Oct 8

---

## Stretch menu — choose a few after the core is complete

### Product and user value

- [ ] Define one success signal for the slice and how the team will observe it
  - **Example:** "10 study tasks created without errors" or "Zero localStorage errors in console"
- [ ] Write a smaller fallback path in case the chosen slice proves too large
  - **Example:** "If full task form is too complex, launch with just title and deadline"
- [ ] Ask one person to walk through the sketch and record one change made from their response
- [ ] Name one tempting feature to postpone and why the cut protects the demo
  - **Example:** "Postpone quiz until Week 6; focus on subjects and tasks for Oct 8"

### Design and experience

- [ ] Annotate the primary flow with actions, system responses, and expected results
- [ ] Add an empty, loading, error, or confirmation state that matters to the chosen path
  - **Example:** "Show 'No tasks yet' message when a subject has no tasks"
- [ ] Check readable labels, keyboard focus, contrast, and mobile layout
- [ ] Capture a simple screenshot or short recording of the current state for next week's comparison

### Technical readiness

- [ ] Add concise setup/run instructions so another teammate can start the project
  - **Link:** `docs/week5/SETUP_INSTRUCTIONS.md`
- [ ] Test the riskiest stack, API, data, or deployment assumption with one small spike
  - **Example:** Verify localStorage quota is sufficient for 100 tasks per subject
- [ ] Add safe sample data and document any data/localStorage limitation; do not add secrets or personal data
- [ ] Add one repeatable smoke check or test for the path being built
  - **Example:** "Navigate: Dashboard → Create Subject → Create Task → Refresh → Verify persistence"
- [ ] Open a small PR and ask a teammate to review the change
  - **Example:** First frontend PR with subject list UI

### Evidence and team practice

- [ ] Make the first three tracks and their dependencies easy to see on the team Project board
- [ ] Link the reason for the slice choice to the evidence that informed it
  - **Evidence:** Week 3 candidate slice, Week 4 Chuseok Checkpoint
- [ ] Record how generated or outside material was reviewed and attributed, when relevant
- [ ] Prepare a two-minute return-from-break update: what changed, what works, and what is still uncertain

---

## Our stretch target

Choose at least two stretch items, or propose an equivalent extension. Explain why they matter:

> **Stretch 1 (Technical Readiness):** Add a smoke test (cypress or React Testing Library) that verifies subjects and tasks persist after page refresh.  
> **Why:** Automated testing reduces manual retesting and catches regressions early.

> **Stretch 2 (Design & Experience):** Add error states for invalid input (e.g., empty task title, deadline in the past) and show user-friendly error messages.  
> **Why:** Better UX and reduces confusion during the demo if a user enters bad data.

> **Stretch 3 (Product Value):** Add a "Mark task complete" toggle and show it in the UI; confirm it persists after refresh.  
> **Why:** This validates the full flow and is a small feature that adds visible value to the demo.

---

## Risks and exceptions

If a core item is incomplete, name the owner, reason, and next action.

| Item | Owner | Reason | Next action | Review point |
|---|---|---|---|---|
| Track 1: Project Setup | Nabin Khadka | — | — | Mon 10-04 |
| Track 2: Subject & Task UI | Sumit Adhikari | — | — | Tue 10-05 |
| Track 3: localStorage Integration | Prince Karki | — | — | Tue 10-05 |
| Track 4: Persistence Test | Prabin Rai | — | — | Wed 10-06 |
| Track 5: Documentation & Report | J.N. Taj Oli | — | — | Wed 10-06 |

---

## Implementation notes

### Folder structure (Track 1)
```
frontend/
├── src/
│   ├── App.jsx                 (Main component)
│   ├── pages/
│   │   ├── Dashboard.jsx       (Home page, list subjects)
│   │   └── SubjectDetail.jsx   (Show tasks for one subject)
│   ├── components/
│   │   ├── SubjectList.jsx     (Reusable list component)
│   │   ├── AddSubjectForm.jsx  (Create subject form)
│   │   ├── TaskList.jsx        (Reusable task list)
│   │   └── AddTaskForm.jsx     (Create task form)
│   ├── hooks/
│   │   └── useLocalStorage.js  (Custom hook for persistence)
│   ├── App.css
│   └── index.css
├── package.json
├── vite.config.js
└── index.html

docs/week5/
├── WEEK_5_WORKLIST.md          (This file)
├── SETUP_INSTRUCTIONS.md       (How to run the app)
├── VERTICAL_SLICE_PLAN.md      (Slice definition and proof)
└── WEEKLY_REPORT.md            (Team progress and evidence)
```

### localStorage data structure (Track 3)
```json
{
  "subjects": [
    {
      "id": "uuid-or-timestamp",
      "name": "Programming",
      "created_at": "2026-10-03T10:00:00Z"
    }
  ],
  "tasks": [
    {
      "id": "uuid-or-timestamp",
      "subject_id": "uuid-or-timestamp",
      "title": "Python Basics",
      "deadline": "2026-10-10",
      "completed": false,
      "created_at": "2026-10-03T10:05:00Z"
    }
  ]
}
```

### Definition of Done for the slice
- [ ] React app scaffolded and `npm run dev` runs
- [ ] Subject creation form works and saves to localStorage
- [ ] Task creation form works and saves to localStorage
- [ ] Subject and task lists display on screen
- [ ] Page refresh preserves all subjects and tasks
- [ ] No console errors
- [ ] At least one team member has run the app successfully on their machine
- [ ] Weekly Report submitted with all team contributions documented
- [ ] Team can state exactly what will be shown on Oct 8

---

## Final check

- [ ] The team can state exactly what it will show next Thursday.
- [ ] The next implementation step is assigned and visible in GitHub.
- [ ] The single Weekly Report includes evidence entered by every team member.
- [ ] All GitHub Issues and PRs are linked in the documentation.
- [ ] The app runs locally without errors on at least two team members' machines.

---

## Key dates and milestones

| Milestone | Date | Owner | Notes |
|---|---|---|---|
| Project setup complete | Fri 10-04 | Nabin Khadka | Track 1 done; app scaffolded |
| UI components working | Tue 10-05 | Sumit Adhikari | Track 2 done; forms and lists render |
| localStorage integration done | Tue 10-05 | Prince Karki | Track 3 done; data persists |
| Persistence test complete | Wed 10-06 | Prabin Rai | Track 4 done; evidence captured |
| Weekly Report & docs done | Wed 10-06 | J.N. Taj Oli | Track 5 done; ready for submission |
| **Demo ready** | **Thu 10-08** | **Team** | **Show to instructor** |

---

## Appendix: Questions for the instructor

If any of the following block progress, create a GitHub Issue with the label `question` and link it here:

- Should we use Tailwind CSS or plain CSS for styling?
- Should we use UUIDs or timestamps for entity IDs in localStorage?
- Is there a preferred testing library (Jest, Vitest, React Testing Library)?
- Should the app support multiple subjects per view, or one subject at a time on Oct 8?

---

**Last Updated:** 2026-10-03  
**Status:** Ready for Team 5 to start implementation
