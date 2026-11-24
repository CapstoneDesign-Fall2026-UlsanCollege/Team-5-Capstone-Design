# Peer Test Notes and Handoff Trial

**Testing person or team:** J.N. Taj Oli (`jn-oli`), signed in as `zaynwoli8`
**Project tested:** Smart Study Companion — Team 5
**Date:** 25 November 2026

## What we tried

1. Turned on **Dark mode**, opened **Quick Add / Add a study task** on **Subjects & University**, and opened the **Subject** dropdown.
2. Read the open list and the highlighted option. **Computer Networks** was highlighted with dark text on a light bar. **Database Management Systems** was light text on the dark list.
3. Turned on **Light mode** and opened the same **Subject** dropdown. **Computer Networks** was highlighted with light text on a dark bar. **Database Management Systems** was dark text on a white row.

## Area map and handoff

- Area(s) / boundary we followed: UI/UX, responsiveness, and accessibility (`public/index.html`, `public/styles.css`, `public/app.js`). The Quick Add task form crosses into the task-entry flow owned for implementation by Nabin Khadka (`liftupkhadka555-spec`).
- Current area map link: [Codebase area map](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/blob/main/docs/week_10/AI_USE_AND_CODE_OWNERSHIP_AUDIT.md)
- Did we locate the check without relying on the steward? Yes. The dropdown was opened from the on-screen **Quick Add** card. The issue steps say **Study Tasks**, while this check used the **Quick Add** card on **Subjects & University Onboarding**.
- Cross-area dependency or handoff we observed: Sumit Adhikari (`adronnie`) reported Issue #84. Nabin Khadka is the implemented owner. The list only shows subjects already selected for enrollment. This session had **2 subjects selected**, so the open list showed **Computer Networks** and **Database Management Systems**.

## What worked

- In Dark mode, both subject names were readable, and the highlighted option had dark text on a light bar.
- In Light mode, both subject names were readable, and the highlighted option had light text on a dark bar.
- The closed **Subject** field also showed **Computer Networks** clearly in both modes.

## What confused us

- The issue steps point to the **Tasks** section. The card used for this proof is on **Subjects & University Onboarding**.
- The open list is limited to enrolled subjects. With two subjects enrolled, the list does not show the full catalog.

## Bugs or problems found

| Problem | Severity | Suggested Issue title |
|---|---|---|
| No new problem found. The 23 November dark-mode contrast problem was readable in this recheck. | — | [Issue #84-comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84#issuecomment-7138393597) |

## Handoff trial (required in Week 13)

- Access or setup path followed: Opened the deployed site, signed in as `zaynwoli8`, and used the **Light mode** / **Dark mode** control in the sidebar.
- Area map / check path followed: UI/UX area in the Week 10 area map, then the **Quick Add** card and its **Subject** dropdown.
- Could they run, view, or understand the project without team-member guidance? Yes. The dropdown could be opened and judged from the screen without the fix owner pointing to it.
- Result and remaining friction: Peer QA passes for the open **Subject** list in Dark mode and Light mode. The remaining friction is that the written steps name **Study Tasks**, while the working card is on **Subjects & University**, and the list shows only enrolled subjects.
