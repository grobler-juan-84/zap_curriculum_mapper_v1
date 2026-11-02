# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 461
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D031** locked; D029 Inspector audit-hardened and smoke-checked under revised scope.
- **Checkpoint on main:** through Step 459 / Fix #3b (`d258791`). Fixes #1–#3 also local (`935f1bd`, `5aef900`, `6edfaec`).
- **BE3 Unit 8** NLL activity-summary path remains on `main` lineage; live NLL **10 / 77 / 77 / 10**; history **29 / 0 / 0**.
- **Teacher Experience Fix #1–#3b** committed locally; **#3b correction (Step 461)** uncommitted — blocks false empty memory when prepared unit changes while Create-a-prompt is open.
- **Missing outlines/vocab fix (Step 460):** still uncommitted and untouched by Step 461.

## In progress

- Step 461 (#3b correction) awaits owner review / commit authorization.
- Step 460 remains separate, uncommitted.
- Production Inspector transport remains parked (F027).

## Next

- Owner review/commit of Step 461 (#3b only) when ready; keep Step 460 out of that commit.
- Owner review/commit of Step 460 separately when ready.
- Finding #4 only when explicitly approved.
- Hold NLL promotion, deployment, and permanent flag-on defaults until requested.

## Blocked

- NLL promotion and production deployment are not authorized.
- Broader `supabase db push` / `--include-all` remain unauthorized.
- Production Inspector access requires F027.

---

## Snapshot notes

- Step 461 is Fix #3b only: freeze Create-a-prompt SB summary + skip unstable empty-card memory writes. Step 460 files left as-is.
- Root untracked `package-lock.json` remains outside this task.
