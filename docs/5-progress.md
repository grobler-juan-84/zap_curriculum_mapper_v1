# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 459
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D031** locked; D029 Inspector audit-hardened and smoke-checked under revised scope.
- **Checkpoint on main:** through Step 458 / Fix #3 (`6edfaec`). Fixes #1–#2 also local (`935f1bd`, `5aef900`).
- **BE3 Unit 8** NLL activity-summary path remains on `main` lineage; live NLL **10 / 77 / 77 / 10**; history **29 / 0 / 0**.
- **Teacher Experience Fix #1–#3** committed locally (`935f1bd`, `5aef900`, `6edfaec`).
- **Teacher Experience Fix #3b (Step 459):** session-only per-scope activity-selection memory (known+selected SB/WB IDs; empty valid; first-visit defaults; book-session clear; Create-a-prompt freeze unchanged). F028 resolved. Uncommitted.

## In progress

- Step 459 awaits owner review / commit authorization.
- Production Inspector transport remains parked (F027).

## Next

- Owner review/commit of Step 459 when ready.
- Finding #4 only when explicitly approved.
- Hold NLL promotion, deployment, and permanent flag-on defaults until requested.
- F027 production Inspector access only when hosting is chosen and explicitly authorized.

## Blocked

- NLL promotion and production deployment are not authorized.
- Broader `supabase db push` / `--include-all` remain unauthorized.
- Production Inspector access requires F027.

---

## Snapshot notes

- Step 459 is selection-memory only: no Finding #4, navigation, curriculum data, prompt, or adapter changes.
- Root untracked `package-lock.json` remains outside this task.
