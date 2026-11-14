# Rai Week 11 Live Test Receipt

Prepared 2026-11-14 (Asia/Seoul). Operator: automated assistant acting at the request of `RaiPrabin697`; this is not independent human verification. Account credentials, verification codes and private email addresses are excluded.

## Environment

- Entry URL: https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html
- Observed landing page: `public/auth/login.html` after the entry URL redirected to sign-in.
- Browser: Codex In-app Browser; exact Chromium version pending.
- Repository `main` at preparation: `15d3542ddef81abeb253a5b6d97baf28765f1ca6`.
- Deployed build revision: unknown; the repository SHA above is not proof of the Pages build.
- Runtime mode: source has a configured Supabase URL and publishable key, but the signed-in runtime path and service response have not yet been observed. Do not infer live persistence from the configuration alone.
- Test account identifiers: Account A and Account B only; no personal identifiers in this receipt.

## Planned checks

All checks below remain **Not run** until an observed attempt is recorded with a timestamp, expected and actual result, evidence, and a limitation. The [verification matrix](MVP_VERIFICATION_MATRIX.md) remains authoritative for acceptance status.

| Check | Expected result | Actual result / status | Proof |
|---|---|---|---|
| Account A sign-in | Authenticated student session opens | Not run | None |
| Valid task creation | One task with the chosen subject and deadline appears | Not run | None |
| Blank-title submission | Rejected; no extra task appears | Not run | None |
| Read and reload | Same task identity and fields remain after refresh | Not run | None |
| Deadline and completion | Deadline displays correctly; completion changes list/count | Not run | None |
| Account B list | Account A task is absent | Not run | None |
| Account B direct read/update/delete | Ordinary B session cannot access or change A task | Not run | None |
| Account A final read | Original task remains unchanged | Not run | None |

The independent non-author check in [the handoff](INDEPENDENT_VERIFICATION.md) remains **Not run**. Do not label a browser screenshot alone as proof of server-side RLS denial.
