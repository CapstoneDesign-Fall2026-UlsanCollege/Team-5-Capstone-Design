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
