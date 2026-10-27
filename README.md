## Documentation

| Area | Purpose |
|---|---|
| [Documentation hub](docs/README.md) | Main navigation for all project records |
| [Project status](docs/PROJECT_STATUS.md) | Ready, pending, blocked, and out-of-scope items |
| [Documentation roadmap](docs/DOCS_ROADMAP.md) | Week 1-16 documentation plan |
| [Contribution ledger](docs/CONTRIBUTION_LEDGER.md) | Member contribution rows and evidence links |
| [Testing documentation](docs/tests/README.md) | Manual testing strategy and proof checklist |
| [Monday status](docs/MONDAY_STATUS.md) | Monday completion snapshot and milestone summary |
| [Monday checklist](docs/MONDAY_CHECKLIST.md) | Task checklist for the Monday progress milestone |
| [Week 6 evidence package](docs/Week6/README.md) | Tested-by note, screenshots, report, and next actions |
| [Week 6 midterm demo path](docs/Week6/MIDTERM_DEMO_PATH.md) | Rehearsal path and fallback proof |
| [Week 6 issue status update](docs/Week6/ISSUE_STATUS_UPDATE.md) | Suggested issue and Definition of Done wording |

---

## Smart Study Companion

A browser-based study planner prototype for organizing subjects, tracking study tasks, and practicing with quizzes.

### Project Overview

Smart Study Companion brings a student’s basic study workflow into one interface. The current prototype focuses on a small, visible path from organizing study work to reviewing quiz results.

### Student Workflow

1. Select or create a subject.
2. Add a study task and its deadline.
3. Open the Study Plan and mark the task complete.
4. Take a quiz for a subject and review the score.
5. Refresh the page to check that relevant data remains available in the same browser.

### Current Prototype

The frontend is built with HTML, CSS, and JavaScript. It runs as a static browser prototype and uses localStorage for browser-local data. This demonstrates persistence in the same browser context; it does not demonstrate account-based or cross-device synchronization.

### Run Locally

Open [Frontend/index.html](Frontend/index.html) in a modern browser. No package installation or build step is required.

### Evidence and Status

The [Week 6 evidence package](docs/Week6/README.md) links the demo screenshots, [weekly report](docs/Week6/WEEKLY_REPORT.md), and [tested-by note](docs/Week6/tested-by-notes.md). The evidence records the subject/task, quiz, and same-browser persistence flow. The visual/theme inconsistency shown in Demo 2 remains a follow-up; see [validation Issue #23](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/23) and the open [theme issue #25](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/25).

### Team

Current team accounts:

- [jn-oli](https://github.com/jn-oli)
- [adronnie](https://github.com/adronnie)
- [princekark](https://github.com/princekark)
- [RaiPrabin697](https://github.com/RaiPrabin697)
- [liftupkhadka555-spec](https://github.com/liftupkhadka555-spec)

See the [contribution ledger](docs/CONTRIBUTION_LEDGER.md) for contribution records and their evidence links.

### Scope and Limitations

- Data is stored in the current browser’s localStorage; it is not synced across browsers or devices.
- The current prototype does not include backend login, a cloud database, reminder notifications, or mobile app packaging.
- The theme/color inconsistency remains open and should be retested after its fix.