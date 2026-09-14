# Week 2 Investigation Issues — copy into GitHub

Create one GitHub Issue per student. Instructions:

1. In the team repo: **Issues → New issue**.
2. Title = the issue title below. Paste the body. Assign yourself. Add to the Project board.
3. Keep evidence, result, and recommendation **in the same Issue**.
4. After posting, ask one teammate to respond in the Issue. Replace the *Teammate response* line with the actual comment link.

> The sections marked **[PENDING]** must be completed with the student's real work before the Wednesday deadline. Do not submit empty evidence.

---

## Issue 1 — Nabin Khadka (Build / Quality lead)

**Title:** Investigate: Where should the MVP store subjects, tasks, and quiz results?

## Question

Should the first demo keep data in the browser (`localStorage`), in a text/JSON file, or in a cloud database (Firebase)?

## Why it matters

This decides how we build the data layer and whether the app needs a server, accounts, or internet for the midterm demo.

## Options considered

| Option | What it would look like | Main benefit | Main concern |
|---|---|---|---|
| Browser localStorage | Data saved on the student's own device | No server, no accounts, instant | Data stays on one browser/device |
| JSON file on server | Small backend reads/writes a file | Simple to inspect data | Needs a server + save/load handling |
| Firebase/Firestore | Cloud database | Syncs across devices | Setup, accounts, network dependency |

## Evidence

- Source, test, sketch, or walkthrough: small HTML test adding a subject and reloading — see `week-02/storage-check.md`.
- Evidence link or attachment: **[PENDING — link the test or a screenshot]**
- What I observed: **[PENDING — fill after the test: did the data survive reload?]**

## Recommendation

I recommend **[localStorage]** because it keeps the midterm demo local, offline and account-free, which matches our smallest useful version.

## Tradeoff or remaining uncertainty

Data will not sync between devices, so a student cannot continue on another machine; we may revisit this before the final demo.

## Definition of Done

- [ ] I compared at least two options.
- [ ] I linked or attached evidence.
- [ ] I explained what I observed.
- [ ] I made one recommendation.
- [ ] I named one tradeoff or remaining uncertainty.
- [ ] I explained how this affects our project.

## Teammate response

*Ask one teammate to agree, challenge, or ask a question. Link their comment here.*

---

## Issue 2 — Sumit Adhikari (Build / Quality lead)

**Title:** Investigate: Which front-end approach should the MVP use?

## Question

Should we build the app with plain HTML/CSS/JavaScript, or with a framework like React (Vite)?

## Why it matters

This sets the project structure, build tooling, and how much we can reuse code between the planner and quiz screens for the midterm demo.

## Options considered

| Option | What it would look like | Main benefit | Main concern |
|---|---|---|---|
| Plain HTML/CSS/JS | Static files, no build step | Simplest to start and debug | Reusing UI gets repetitive |
| React + Vite | Component-based app with dev server | Reusable components for tasks/quizzes | Build step and new concepts to learn |

## Evidence

- Source, test, sketch, or walkthrough: compare the setup for both options.
- Evidence link or attachment: **[PENDING — link setup notes or a blank scaffold]**
- What I observed: **[PENDING]**

## Recommendation

I recommend **[React + Vite]** because the planner and quiz screens share tasks, question lists, and forms that are easier to reuse as components.

## Tradeoff or remaining uncertainty

The build tooling adds setup time, so we should scaffold and commit this early in Week 3.

## Definition of Done

- [ ] I compared at least two options.
- [ ] I linked or attached evidence.
- [ ] I explained what I observed.
- [ ] I made one recommendation.
- [ ] I named one tradeoff or remaining uncertainty.
- [ ] I explained how this affects our project.

## Teammate response

*Ask one teammate to respond. Link their comment here.*

---

## Issue 3 — Prince Karki (Research / Analysis lead)

**Title:** Investigate: Which features do existing study-planner and quiz apps have in common?

## Question

What features are shared by popular study planners and quiz tools, and which should Smart Study Companion keep for the MVP?

## Why it matters

This confirms that our in-scope features (subjects, tasks, deadlines, quizzes, scores) match what users expect, and that we can safely cut the rest.

## Options considered

| Option | What it would look like | Main benefit | Main concern |
|---|---|---|---|
| Study planner apps (e.g. Notion/Google-style planners) | Task + deadline management | Validates planner scope | Often add calendars/timers we do not need |
| Quiz apps (e.g. Quizlet-style) | Card/quizzing + scores | Validates quiz scope | Often add social/anonymized sharing |

## Evidence

- Source, test, sketch, or walkthrough: review at least two apps/web sources, list their core screens and features.
- Evidence link or attachment: **[PENDING — link sources or a short comparison note]**
- What I observed: **[PENDING]**

## Recommendation

I recommend **[keeping subjects, tasks, deadlines, quizzes, and scores]** because those appear in both app families and match the smallest useful version; timers, analytics, and sharing can be cut.

## Tradeoff or remaining uncertainty

Popular apps usually add a calendar view; without it, our upcoming-task list must be clear enough on its own.

## Definition of Done

- [ ] I compared at least two options.
- [ ] I linked or attached evidence.
- [ ] I explained what I observed.
- [ ] I made one recommendation.
- [ ] I named one tradeoff or remaining uncertainty.
- [ ] I explained how this affects our project.

## Teammate response

*Ask one teammate to respond. Link their comment here.*

---

## Issue 4 — Prabin Rai (Research / Analysis support)

**Title:** Investigate: How should a student create a quiz — manual question entry or a reusable question bank?

## Question

For the MVP, should each quiz be built by typing questions directly, or should questions live in a shared bank that quizzes pull from?

## Why it matters

This decides the quiz authoring screen, the data model, and how much work it takes to demo a quiz end-to-end by midterm.

## Options considered

| Option | What it would look like | Main benefit | Main concern |
|---|---|---|---|
| Manual entry per quiz | Add questions directly inside a quiz | Fastest to build | Question reuse is manual |
| Reusable question bank | Questions saved once, quizzes pick from them | Better for real use | More screens and state to build |

## Evidence

- Source, test, sketch, or walkthrough: draw the two authoring flows on paper and walk a teammate through each.
- Evidence link or attachment: **[PENDING — link the two sketches / walkthrough note]**
- What I observed: **[PENDING — what did the teammate expect on each screen?]**

## Recommendation

I recommend **[manual entry per quiz]** because it proves the full "create quiz → answer → score" journey with the least code; we can refactor to a bank later if time allows.

## Tradeoff or remaining uncertainty

Duplicate questions across quizzes until we add a bank — acceptable for the MVP.

## Definition of Done

- [ ] I compared at least two options.
- [ ] I linked or attached evidence.
- [ ] I explained what I observed.
- [ ] I made one recommendation.
- [ ] I named one tradeoff or remaining uncertainty.
- [ ] I explained how this affects our project.

## Teammate response

*Ask one teammate to respond. Link their comment here.*

---

## Issue 5 — J.N. Taj Oli (Evidence / Documentation lead)

**Title:** Investigate: Should reminders be part of the MVP or postponed?

## Question

Should Smart Study Companion include a reminder/notification feature in the MVP, or should it be out of scope for this semester?

## Why it matters

A reminder system adds scheduling, notification, and permission behavior that could block the core planner + quiz demo.

## Options considered

| Option | What it would look like | Main benefit | Main concern |
|---|---|---|---|
| In-app reminder in MVP | Deadline date triggers a visible notice | Users see urgency | Timing/notification logic is extra work |
| Postpone reminders | Just show upcoming tasks by date | Protects the midterm demo | Less "smart" feel at the final demo |

## Evidence

- Source, test, sketch, or walkthrough: review the deadline-handling needs in the design doc and one reference app.
- Evidence link or attachment: **[PENDING — link design doc section + reference note]**
- What I observed: **[PENDING]**

## Recommendation

I recommend **[postponing reminders]** because showing upcoming tasks sorted by date already covers the core need, and notification behavior can wait for a later sprint.

## Tradeoff or remaining uncertainty

Teams that expect "reminders" may find the MVP quieter; we note it as a stretch feature in Design Doc v1 section 8.

## Definition of Done

- [ ] I compared at least two options.
- [ ] I linked or attached evidence.
- [ ] I explained what I observed.
- [ ] I made one recommendation.
- [ ] I named one tradeoff or remaining uncertainty.
- [ ] I explained how this affects our project.

## Teammate response

*Ask one teammate to respond. Link their comment here.*

---

## After all Issues are done

1. Add a completion comment in each Issue with the final result + evidence link.
2. Ask a teammate to respond in each Issue.
3. Link every Issue from the Weekly Report (already set up in `week-02/weekly-report.md` — replace guessed numbers with real ones).
4. Move each Issue to Done only after its Definition of Done is satisfied.