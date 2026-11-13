# Freeze Decision and Scope Contract

**Decision date:** 2026-11-14  
**Status:** Proposed; team approval and independent acceptance pending  
**Decision owner:** Team confirmation pending

## Required core

An authenticated student selects an available subject, saves a valid task, receives a clear rejection for a blank title, reads the task after reload, and cannot access another student's task through an ordinary account session. Criteria are owned by the [matrix](MVP_VERIFICATION_MATRIX.md).

## Supporting features and exclusions

- Supporting: completion/deadline display, analytics, theme, standard quizzes and academic onboarding. Include only when their evidence supports the demonstrated behavior.
- Recovery email and AI quiz storage/content remain disclosed limitations until rerun.
- Excluded from this documentation change: application fixes, production database changes, deployment changes, new feature scope and automated-test implementation.
- Client-visible answer keys are unsuitable for secure assessment. No approval to accept that risk is inferred; team decision pending.

## Stable and recovery routes

The **candidate live route** uses an identified test deployment and Supabase project. It is not declared stable until core acceptance and independent reproduction are recorded.

The **recovery route** is an explicitly labeled local-only demonstration or historical evidence walkthrough. It demonstrates only its recorded environment; it cannot satisfy cloud save/read or RLS acceptance. Never switch to fallback silently.

## Gates and decision change

1. Record build, mode and operator for each core check.
2. Resolve or precisely document failures; preserve failed receipts.
3. Obtain a non-author repetition without undocumented coaching.
4. Record approval login/date, accepted exclusions and rollback route.

Current outcome: **approval pending; live readiness not certified**. Reviewer observations and their effect on this decision belong in the [handoff](INDEPENDENT_VERIFICATION.md). Any core failure keeps the live route unapproved; a successful independent run supports, but does not itself substitute for, explicit approval.
