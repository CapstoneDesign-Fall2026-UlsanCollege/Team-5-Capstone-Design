# User Flow — Smart Study Companion

**Status:** Planned flow · **Source:** [Original sketch](User%20Flow%20Sketch.jpg)

## User and objective

A college student wants to keep study work and deadlines visible by subject.

| Step | Student action | Expected system response | Proof to collect |
|---|---|---|---|
| 1 | Open the dashboard | Show subjects or an empty-state message | App screenshot |
| 2 | Create “Programming” | Show the saved subject | Subject list screenshot |
| 3 | Add “Review chapter 1” with a future deadline | Show the task under Programming | Task list screenshot |
| 4 | Refresh the page | Reload the same subject, title, and deadline | Before/after comparison |
| 5 | Mark the task complete | Show its updated status | Later MVP check |
| 6 | Answer and submit a short quiz | Show correct-answer count and score | Later quiz validation |

## First slice and later work

Steps 1–4 are the [Week 5 demonstration target](../week5/VERTICAL_SLICE_PLAN.md). Steps 5–6 describe later core MVP work. Empty input should produce readable feedback without saving an invalid record; exact validation rules still need implementation agreement.

## Evidence boundary

The sketch explains the interaction. The [standalone storage fixtures](storage-check.md) explore persistence separately. Neither artifact establishes that React screens are implemented. See [Week 3 wireframe notes](../week3/wireframe-notes.md) for screen details.
