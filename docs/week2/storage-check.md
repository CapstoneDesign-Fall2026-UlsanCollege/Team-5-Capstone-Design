# Uncertainty check — will MVP data survive a reload?

**Week:** 2
**Owner:** Nabin Khadka
**Date:** 2026-09-15

## Question

Our smallest useful version saves subjects, tasks, deadlines, and quiz results. If we store that data in the browser, will it survive a page reload or a browser restart — or do we need a server or file?

## Check

Open `storage-check.html` in a browser (no server needed):

1. Enter a subject name and click **Save subject to localStorage**.
2. Reload the page.
3. Read the message at the bottom of the page.

## Expected result

The saved subject is still present after reload, because `localStorage` persists per browser and origin.

## What we found

- [PENDING: replace with the actual result]
  - Saved value shown before reload:
  - Value shown after reload:
  - Screenshot / output link (attach here):

## What changes as a result

- [PENDING: e.g. "Keep localStorage for the MVP demo — no server needed. Revisit sync for the final demo."]

## Honesty note

An unsuccessful check still counts when it leads to a clear next action. If the value is empty after reload, we open a new Issue and reconsider storage.