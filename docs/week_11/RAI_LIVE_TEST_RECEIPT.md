# Rai Week 11 Live Test Receipt

Prepared 2026-11-14 and reconciled 2026-11-18 (Asia/Seoul). The user handled both account sign-ins privately; an automated assistant operated the browser checks at the request of `RaiPrabin697`. This is assisted observation, not independent teammate verification. Account credentials, verification codes and private email addresses are excluded.

## Environment

- Entry URL: https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html
- Observed landing page: `public/auth/login.html` after the entry URL redirected to sign-in.
- Browser: Google Chrome on macOS for the signed-in checks; exact version pending. The initial signed-out landing-page observation used Codex In-app Browser.
- Repository `main` at preparation: `15d3542ddef81abeb253a5b6d97baf28765f1ca6`.
- Deployed build revision: unknown; the repository SHA above is not proof of the Pages build.
- Runtime mode: source has a configured Supabase URL and publishable key, and the signed-in UI labels the list as cloud-saved. No authenticated network response or server-side storage/RLS result was inspected. The UI label and reload observation alone do not prove live Supabase persistence.
- Test account identifiers: Account A and Account B only; no personal identifiers in this receipt.

## Observed and pending checks

The assisted run took place on 2026-11-14 (Asia/Seoul); the exact time was not recorded. No sanitized screenshot or output artifact was saved, so these observations have no independently inspectable proof link yet. The [verification matrix](MVP_VERIFICATION_MATRIX.md) remains authoritative for team acceptance status.

| Check | Expected result | Actual result / status | Proof |
|---|---|---|---|
| Account A sign-in | Authenticated student session opens | **Observed (UI only):** after the user signed in privately, the app showed a signed-in profile and existing tasks. Authentication response was not inspected. | No sanitized artifact; follow-up capture pending |
| Valid task creation | One task with the chosen subject and deadline appears | **Observed (partial):** the assistant saved `W11-Rai-20261114-task-save-20261114` under Data Structures & Algorithms with the form deadline set to 2026-11-15. The visible list count changed from 3 to 4 and the title appeared. Saved-row deadline and service response were not inspected. | No sanitized artifact; follow-up capture pending |
| Blank-title submission | Rejected; no extra task appears | **Observed (partial):** submitting the empty quick-add title did not add a row; the count remained 4. The validation message was not captured. | No sanitized artifact; follow-up capture pending |
| Read and reload | Same task identity and fields remain after refresh | **Observed (partial):** after reload, Account A remained signed in, the count remained 4, and the same title appeared. Saved-row subject/deadline and server-side persistence were not independently checked. | No sanitized artifact; follow-up capture pending |
| Deadline and completion | Deadline displays correctly; completion changes list/count | Not run | None |
| Account B list | Account A task is absent | **Observed (UI only):** a distinct signed-in Account B session showed 0 tasks in the subject view, including after reload; Account A's test title was absent. This is not a direct RLS denial check. | No sanitized artifact; follow-up capture pending |
| Account B direct read/update/delete | Ordinary B session cannot access or change A task | Not run | None |
| Account A final read | Original task remains unchanged | **Not run:** Chrome did not present a reliable Account A view after switching back from B. The earlier A reload check is not a post-B integrity check. | None |

Next: capture sanitized proof on a known deployed build, repeat the final A read, and have a non-author perform the authenticated read/update/delete protocol in [the handoff](INDEPENDENT_VERIFICATION.md). That protocol and the 24 Playwright browser cases remain **Not run**; do not label UI separation as server-side RLS verification.

## Candidate build check: 2026-11-20

This is a preparation check, **not a new task test**. An automated assistant opened the public Pages URL above in Google Chrome on macOS. The app loaded a signed-in Subjects view, but the displayed account has not been confirmed as a disposable test account. No task was created or changed, no screenshot was saved, and no authenticated network response was inspected. The account shown in the browser is deliberately not identified here.

| Field | Recorded value |
|---|---|
| Check date / operator | 2026-11-20 (Asia/Seoul); automated assistant; `RaiPrabin697` account authorization pending |
| Candidate URL | `https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html#subjects` |
| Repository `main` at check | `8004e2108f2719cfc6ed1c1fceb0a6655951e255` (source reference only) |
| Deployed build revision | Unknown; no Pages deployment-to-commit mapping captured |
| Browser | Google Chrome on macOS; version not recorded |
| Runtime mode | Unknown; signed-in UI alone does not establish a live Supabase request |
| New Account A save/reload, Account B list, direct RLS, final A read | **Not run**; disposable A/B account authorization and build provenance pending |
| Screenshot / service-response proof | None; do not promote this page-load observation to task or isolation evidence |

**Next action:** `RaiPrabin697` confirms two disposable accounts and the candidate build; the assistant can then run the [written protocol](INDEPENDENT_VERIFICATION.md) and capture sanitized evidence. A non-author teammate must separately accept and execute the independent reproduction. Until then, the November 14 observations above remain historical, and `DATA-01` remains **Not run**.

## Seven focused checks: 2026-11-20

The automated assistant prepared this run in Chrome on macOS at the public Pages URL above. The only new browser observation was a signed-in Subjects page. The account was not confirmed as disposable, no second verified account was available, and no task, quiz, or direct API action was performed. Browser version, deployed build SHA, and runtime mode remain unknown. The repository source reference at preparation was `8004e2108f2719cfc6ed1c1fceb0a6655951e255`; it is not a deployed-build identifier. There are no screenshots or service-response artifacts for these checks.

| Check | Repeatable steps / expected result | Actual result and status | Issue / next action |
|---|---|---|---|
| AUTH-11B session refresh | Sign in to disposable A, reload; expect the same authenticated session | **Blocked:** no confirmed disposable A; sign-in and reload were not performed in this run | `RaiPrabin697` confirms A and captures before/after result |
| TASK-11B valid and blank title | Create a uniquely named task with subject/deadline, then submit blank title; expect one new row and no blank row | **Blocked:** no task submission performed | `RaiPrabin697` runs both inputs and records validation message |
| TASK-11C fields and completion | Read task title, subject, deadline, completion; toggle completion; expect matching fields and changed status | **Blocked:** no test task exists for this run | `RaiPrabin697` compares fields and count before/after |
| TASK-11D reload | Reload A; expect same task identity and saved fields | **Blocked:** no test task exists for this run | `RaiPrabin697` captures before/after task ID and fields |
| DATA-11A B list | Sign in to disposable B in a separate profile; expect A's task absent | **Blocked:** B not available and A task not created | `RaiPrabin697` records B's list separately from RLS |
| DATA-01 direct isolation | In B's ordinary session request A task ID for read/update/delete; return to A; expect denial or zero affected rows and A unchanged | **Blocked:** A/B test sessions and task ID unavailable; no authenticated request was sent | `adronnie` supports response interpretation; accepted non-author reviewer executes [protocol](INDEPENDENT_VERIFICATION.md) |
| QUIZ-11A retake | Complete a disposable quiz attempt, press Retake Quiz; expect same subject/difficulty and reset answers/score | **Not run:** current account not confirmed disposable; no quiz attempt created | Retest and add result to [#70](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/70) |

The historical AI quiz storage and content failures remain tracked in [#53](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/53) and [#54](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/54). Those issues and #70 carry the `bug` label; this preparation run did not reproduce them. No new bug issue is warranted without a new observed failure.
