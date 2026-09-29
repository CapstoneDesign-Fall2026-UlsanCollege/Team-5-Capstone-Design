# Candidate Vertical Slice — Week 3

**Team:** DJ Barut  
**Project:** Smart Study Companion  
**Last updated:** Week 3

This is a planning candidate, not a promise that the whole feature will be built. Revisit it in Week 5 when the implementation plan is more detailed.

## Midterm demo sentence

By midterm, a student can create a Programming subject, add two study tasks with deadlines, complete one task, take a short quiz, and see the quiz score.

## User path

1. The user creates a Programming subject and adds two study tasks with deadlines.
2. The system saves the subject and tasks and shows them in the study plan.
3. The user completes one task, takes a short quiz, and sees the final quiz score.

## In scope for this slice

- Create a Programming subject and two study tasks with deadlines.
- Show tasks in the study plan and mark one task as completed.
- Take a simple multiple-choice quiz and show the calculated score.

## Out of scope for this slice

- AI-generated study plans.
- AI-generated quiz questions.
- Reminders or notifications.
- Login and user accounts.
- Mobile app features.

## First three build Issues

| Issue | Owner | Definition of Done |
|---|---|---|
| Create Subjects and Study Tasks | Adronnie | Student can create a subject, add two tasks with deadlines, and saved data remains after refresh |
| Create Study Plan and Track Tasks | Prince | Saved tasks appear in the study plan and one task can be marked as completed |
| Create Quiz and Calculate Score | Prince | Student can answer a short MCQ quiz and see the correct score and total questions |

## Biggest risk or uncertainty

What could prevent this path from working, and what is the smallest test that would reduce the uncertainty?

 Risk: React state and localStorage may not save and update the subject, task, and completion data correctly.  
 Smallest test: Create one subject and one task, refresh the page, and check that the data is still there.  
 Owner: Adronnie

## Evidence links

- Issue list: [GitHub Issues](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues)
- Wireframe: [wireframe sketch.png](<wireframe sketch.png>) and [wireframe notes](wireframe-notes.md)
- Architecture sketch: [architecture-sketch.md](architecture-sketch.md)
- Stack comparison: [tech-stack-comparison.md](tech-stack-comparison.md)
- State/flow test: [prabin-state-flow-test.md](prabin-state-flow-test.md)
- First visible screen definition: [week-03.md](week-03.md)

## Week 5 restart move

When this candidate becomes an implementation plan, the team will:

- break the path into build Issues;
- confirm owners and Definitions of Done;
- name the shared preview or test path; and
- update the risk and bridge task.
