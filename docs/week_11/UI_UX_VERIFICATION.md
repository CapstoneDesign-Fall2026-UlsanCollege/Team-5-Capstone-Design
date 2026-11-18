# Week 11 — Desktop UI Evidence
**Project:** Smart Study Companion — Team 5  
**Tester:** J.N. Taj Oli (`jn-oli`)  
**Date:** 2026-11-16  
**Browser:** Google Chrome 157.0.8103.79  
**Scope:** Desktop browser check of the five application views  
**Overall status:** Desktop UI checks passed

This note records the desktop session.

## 1. What was checked
Signed in on the desktop app and walked through Dashboard, Study Tasks, Subjects & University, Study Analytics, and Quiz Practice.

| Check | Result | Status |
|---|---|---|
| Sidebar shows the signed-in student’s name | Name visible on the dashboard | PASS |
| Dashboard cards: Total tasks, Completed, Pending | Numbers match the Study Tasks list | PASS |
| Upcoming Deadlines list | Deadlines shown on the dashboard | PASS |
| Task Tracker button | Opens `#tasks` | PASS |
| Subjects & University link | Opens `#subjects` | PASS |
| Country, University, Faculty, Major, then subject list | Each step updates the next list | PASS |
| Subject search | List filters as text is typed | PASS |
| One category chip | List filters to that category | PASS |
| Selected-subject count | Count matches the selected cards | PASS |
| Subjects after refresh | Saved selection still shown | PASS |
| Empty task title | Empty title is blocked | PASS |
| New task appears before refresh | New task shows in the list | PASS |
| New task after refresh | Task remains in the list after the page is reloaded | PASS |
| Task checkbox | Completion changes before and after the click | PASS |
| Edit task window | Window opens with the existing task filled in | PASS |
| Delete confirmation | Confirm step appears before the task is removed | PASS |
| Filters: All, Pending, Completed | Each filter shows the matching tasks | PASS |
| Analytics completion ring | Ring is visible | PASS |
| 7-day chart | Chart is visible | PASS |
| Subject progress bar | At least one subject bar is visible | PASS |
| Quiz score numbers | Score figures are visible | PASS |
| Quiz Standard mode | Standard setup opens | PASS |
| Quiz Rapid mode | Rapid setup opens with the timer | PASS |
| Quiz question | Question shows 4 choices | PASS |
| Score and explanations | Shown after the quiz is submitted | PASS |
| AI quiz tab | AI tab opens | PASS |
| Light mode, 5 views, desktop | Each view stays readable | PASS |
| Dark mode, 5 views, desktop | Each view stays readable | PASS |
| Theme after refresh | The selected theme is still on after reload | PASS |
| Tab focus: button, text box, dropdown, link | Focus outline moves to each control | PASS |
| Escape on the task window | Window closes when Escape is pressed | PASS |

## 2. Resolved checks
### Task remains after refresh
- A new task shows in Study Tasks right after it is saved.
- After the page is refreshed, the task remains in the list.

### Escape closes the task window
- The Add / Edit task window is open.
- Pressing Escape closes the window.

## 3. Not in this session
- 390px phone-width layout and sideways-scroll check
- Light and dark mode at phone width

## 4. Screenshot files
[Evidence](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/tree/ba49572591b4aae0bef9ba4e91d2d53dbeb6bf7a/docs/week_11/Evidence%20UI_UX%20verfication)
