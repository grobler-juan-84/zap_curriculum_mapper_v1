# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 454
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D031** locked; D029 Inspector audit-hardened and smoke-checked under revised scope.
- **Checkpoint on main:** through Step 453 / Priority 3 (`171138a`). Steps 449–452 + D030/D031 already on `origin/main`.
- **BE3 Unit 8** NLL activity-summary path remains on `main` lineage; live NLL **10 / 77 / 77 / 10**; history **29 / 0 / 0**.
- **Priority 2 closed / D031:** 77 summaries accepted unchanged as sufficient, modular, replaceable v1 knowledge; live review states unchanged.
- **Priority 3 on main (Step 453):** Inspector authoritative current activity fingerprints; Grammar/Values fixtures pinned 13/13 to migration hashes; suite **13/13**.
- **Priority 4 local (Step 454):** Inspector component lookup via exact full-set activity membership on `nll_components` / `nll_component_activities`; temporary BE3 U8 hard-coded fallback retained only when membership is unavailable. Focused membership suite **6/6**; Inspector **13/13**.

## In progress

- Step 454 awaits owner review / commit authorization.
- Production Inspector transport remains parked (F027).

## Next

- Owner review/commit of Step 454 when ready.
- Hold NLL promotion, deployment, and permanent flag-on defaults until requested.
- Optional later: migrate Create-a-prompt modal off the BE3 U8 hard-coded resolver (not authorized now).
- F027 production Inspector access only when hosting is chosen and explicitly authorized.

## Blocked

- NLL promotion and production deployment are not authorized.
- Broader `supabase db push` / `--include-all` remain unauthorized.
- Production Inspector access requires F027.

---

## Snapshot notes

- Step 454 is Inspector resolve-path only. Modal summaries, GLP, adapters, review states, migrations, and stored hashes are unchanged.
- Root untracked `package-lock.json` remains outside this task.
