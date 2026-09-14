# Suggested teammate responses for Week 2 investigation Issues

Use these as **drafts**. The person whose name is listed must actually read the investigator's Issue, confirm the evidence, adjust the wording so it is honest, and post the comment themselves. GitHub requires a sentence that helps the team decide — "Looks good" is not enough.

Post the comment **inside the Issue** and then link/tag it in the Weekly Report evidence table.

---

## Issue #2 (Nabin — storage) — response from Sumit Adhikari

> I agree with the localStorage-first recommendation for the midterm demo. Your checklist is the deciding factor: no server, no accounts, no network, which keeps the demo reproducible on one machine.
>
> One gap: your storage-check only proves the data survives a reload, not that the demo restores a *full state* (subjects + tasks + quiz scores) after the browser fully closes. Can we extend the check so the test also rebuilds a small subject with two tasks and a score, then verifies all three come back?
>
> Suggested next step: add a third button to the test page that writes a small JSON object (`{subject, tasks:[…], score}`), then after restart confirm all fields reload — this covers the midterm demo path.

---

## Issue #3 (Sumit — front-end approach) — response from Nabin Khadka

> I support React + Vite, but let me challenge the "simplest to start" claim. For the midterm demo we mainly need one subject form, one task list, and one quiz screen — plain HTML/CSS/JS could reach that with zero build tooling and be easier for every member to review.
>
> The decision should depend on evidence, not preference: can we scaffold both in Week 3 and compare the time to render one subject list with a deadline? If React's setup takes more than one evening for all five members to run locally, we reopen this Issue.
>
> Suggested next step: add a Week 3 task "scaffold both options and time the setup" and link the result back to this Issue.

---

## Issue #4 (Prince — common app features) — response from Prabin Rai

> This supports our in-scope list well. I agree that subjects/tasks/deadlines/quizzes/scores form the shared core.
>
> Question on one finding: you list calendars as common in planner apps but we are cutting them. Our "upcoming-tasks view" is the replacement — could you walk a teammate through whether a week-at-a-glance list is understandable without a calendar grid? That directly tests the risk row "deadline management may become confusing" in Design Doc section 9.
>
> Suggested next step: record that walkthrough as your part of the uncertainty check and link it to the Weekly Report.

---

## Issue #5 (Prabin — quiz authoring) — response from Prince Karki

> Manual entry per quiz is the right call to protect the midterm path. The reusable bank is a clear future refactor once the question model is proven.
>
> One thing your two sketches should confirm: where the answer key lives. Manual entry makes it tempting to store the correct option inline with the question — fine for a demo, but it means the "view score" screen must not accidentally reveal answers before submission. Please note in the sketch whether the key is shown only after answering.
>
> Suggested next step: link the small quiz data shape (`question → 4 options → correctIndex → score`) to Issue #2's storage work, so the data model is consistent.

---

## Issue #6 (J.N. Taj Oli — reminder scope) — response from Nabin Khadka

> Postponing reminders is consistent with the Decision record, and I agree the upcoming-tasks list covers the core need. Cutting scheduling/notification behavior protects the midterm demo scope.
>
> Challenge: "postpone" must not become "silently dropped" at the final demo. The final demo sentence currently ends at quiz results with no mention of deadlines awareness. Please add one stretch line to Design Doc section 8 (Study Reminders = No) that a *date-sorted upcoming list* is the MVP's reminder substitute, so the final demo's expectations are honest.
>
> Suggested next step: update section 8 with that note and link this Issue from the section.

---

## After posting

1. Copy each final response link into the Weekly Report evidence table (replace the `Issue #N` placeholders).
2. Move each Issue to **Done** only when its Definition of Done checkboxes are all ticked.
3. Record the walkthrough observations in `individual-evidence-receipt.md` and remove the `[PENDING]` markers.