# Peer Test Notes and Handoff Trial

## Historical Trial - November 25, 2026

**Tester:** J.N. Taj Oli (`jn-oli`), signed in privately  
**Project:** Smart Study Companion - Team 5  
**Test type:** Non-author UI readability and handoff trial  
**Tested revision:** Unknown  
**Deployed revision:** Unknown

### Route Followed

1. Opened the deployed site and signed in privately.
2. Opened **Subjects & University**.
3. Located **Quick Add / Add a study task**.
4. Opened the **Subject** dropdown in Dark mode.
5. Repeated the same check in Light mode.

This corrects the earlier written navigation that pointed to **Study Tasks**. The working Quick Add card used for this check is under **Subjects & University**.

### Observations

- In Dark mode, the enrolled subject names were readable, and the highlighted option used dark text on a light bar.
- In Light mode, the enrolled subject names were readable, and the highlighted option used light text on a dark bar.
- The closed Subject field was readable in both modes.
- The list showed enrolled subjects only. In that session, two enrolled subjects were available.

### Expected Result

The tester can locate the Quick Add card without guidance and read the closed field, open options, and highlighted option in Light and Dark modes.

### Actual Result

**Pass with documentation friction.** The UI readability criteria were met. The written route was confusing because it named **Study Tasks** instead of **Subjects & University**.

### Help Received

No guidance from the implementation owner was needed to judge the dropdown. The route wording itself required later correction.

### Evidence Boundary

This trial establishes UI readability for the observed session only. It does not establish cloud persistence, migration application, deployed revision identity, or RLS isolation.

### Related Record

[Issue #84 comment](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/84#issuecomment-7138393597)

## Corrected Route

Use [Week 13 Handoff Route](week_13/HANDOFF_ROUTE.md):

`Sign in -> Subjects & University -> Quick Add / Add a study task -> Subject dropdown -> Light and Dark modes`

## Designated Retrial - Prince Karki

The fresh non-author retrial is tracked separately below so it cannot be confused with J.N. Taj Oli's November 25 historical result.

| Field | Current record |
|---|---|
| Tester | Prince Karki (`princekark`) |
| Date | Pending |
| URL | Pending |
| Browser/version | Pending |
| Tested source SHA | `f5dcc8c5d93e284c378d746a9a7a7fae327c3d1f` planned |
| Deployed revision | Unknown |
| Route | [Corrected handoff route](week_13/HANDOFF_ROUTE.md) |
| Help received | Pending; must be recorded after the attempt |
| Expected result | Light/Dark readability and no-coaching criteria in the route |
| Actual result | No retrial observation has been supplied |
| Result | **Blocked - retrial has not been performed** |
| Proof | Pending |
| Remaining friction | Pending |

### Blocker and Next Action

- **Blocker:** `princekark` has not yet performed and reported the uncoached route.
- **Owner:** Prince Karki (`princekark`) for execution; Prabin Rai (`RaiPrabin697`) for receipt reconciliation.
- **Next action:** Prince follows the route without coaching and sends the date, URL, browser/version, selected option, Light/Dark observations, help received, sanitized proof, and any remaining friction.
- **Update rule:** Replace **Blocked** only after the actual observation exists. Do not infer a result from J.N. Taj Oli's historical trial.
