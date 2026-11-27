# Week 13 Handoff Route

**Route ID:** `HANDOFF-UI-01`  
**Owner:** Prabin Rai (`RaiPrabin697`) - documentation and coordination  
**Designated non-author tester:** Prince Karki (`princekark`)  
**Source revision:** `f5dcc8c5d93e284c378d746a9a7a7fae327c3d1f`  
**Deployed revision:** **Unknown**  
**Current result:** **Blocked - awaiting Prince's uncoached retrial**

## Purpose

This route checks whether a non-author can find and judge the enrolled-subject dropdown without verbal coaching. It is a documentation and UI handoff check, not server-side acceptance.

## Prerequisites

- A selected deployed site URL.
- A private disposable account that can sign in.
- At least one enrolled subject.
- A desktop browser with Light and Dark modes available.
- No password, email address, token, or recovery link included in the receipt.

## Uncoached Route

1. Open the selected deployed site.
2. Sign in using a private disposable account.
3. Open **Subjects & University** from the sidebar.
4. Locate **Quick Add / Add a study task**.
5. Open the **Subject** dropdown.
6. In **Light mode**, record whether the closed field, open options, and highlighted option are readable.
7. In **Dark mode**, repeat the same readability check.
8. Record the selected option, any confusion, the URL, browser/version, tested source revision if known, deployed revision if known, help received, and actual result.

## Important UI Detail

The Subject dropdown contains **enrolled subjects only**. It is not the full subject catalog. If the expected subject is missing, first confirm that it is enrolled before reporting a dropdown defect.

## Expected Results

A successful uncoached handoff meets every criterion below:

- **Navigation:** The tester reaches **Subjects & University** and identifies the Quick Add card without being told where it is.
- **Closed field:** The current enrolled subject is readable before opening the dropdown.
- **Open list:** Every visible enrolled-subject option is readable in Light and Dark modes.
- **Highlighted option:** Text remains distinguishable from its selection background in both modes.
- **Selection:** The tester can identify and record the selected option.
- **Understanding:** The tester recognizes that the list contains enrolled subjects rather than the complete catalog.
- **Evidence:** The receipt records environment, help received, actual result, and sanitized proof.

If any required criterion is missing, do not record a full Pass.

## Result Labels

- **Pass:** Prince completes the route without coaching and all expected-result criteria are met.
- **Fail:** The route is completed, but one or more required criteria are not met.
- **Blocked:** A prerequisite is unavailable or the tester cannot start or finish the route.
- **Not run:** No attempt has been made.

## Evidence Fields

| Field | Required record |
|---|---|
| Tester | Exact GitHub login |
| Date and time | Local date and time |
| URL | Tested page URL |
| Browser | Name and version |
| Source revision | SHA if established; otherwise `Unknown` |
| Deployed revision | SHA if established; otherwise `Unknown` |
| Access route | Exact navigation followed |
| Help received | `None` for an uncoached run, or describe assistance |
| Expected result | Criteria from this document |
| Actual result | What the tester observed |
| Result | Pass, Fail, Blocked, or Not run |
| Proof | Sanitized screenshot or other stable evidence link |
| Remaining friction | Any wording, navigation, or readability issue |

## Receipt Template

| Field | Result |
|---|---|
| Tester | `princekark` |
| Date and time | Pending |
| URL | Pending |
| Browser/version | Pending |
| Source revision | `f5dcc8c5d93e284c378d746a9a7a7fae327c3d1f` planned |
| Deployed revision | Unknown |
| Help received | Pending |
| Light mode actual result | Pending |
| Dark mode actual result | Pending |
| Selected option | Pending |
| Remaining friction | Pending |
| Proof | Pending |
| Overall result | **Blocked - retrial not yet performed** |

## Evidence Boundary

A passing result establishes only that the tester could locate and read this UI path. It does **not** prove:

- task save or reload persistence;
- Supabase migration application;
- live cloud synchronization;
- authenticated cross-account isolation;
- direct RLS read, update, or delete denial;
- deployed revision identity; or
- full credentialed end-to-end behavior.
