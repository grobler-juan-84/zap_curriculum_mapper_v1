# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 453
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D031** locked; D029 Inspector audit-hardened and smoke-checked under revised scope.
- **Checkpoint on main:** through Step 452 / D031 (`d993d4b`). Steps 449–451 + D030 already on `origin/main`.
- **BE3 Unit 8** NLL activity-summary path remains on `main` lineage; live NLL **10 / 77 / 77 / 10**; history **29 / 0 / 0**.
- **Priority 2 closed / D031:** 77 summaries accepted unchanged as sufficient, modular, replaceable v1 knowledge; live review states unchanged.
- **Priority 3 local (Step 453):** Inspector supplies authoritative current activity fingerprints from already-loaded SB/WB canonical raw; classifies `current` / `potentially_stale` / `unverifiable` via existing loader. Fixture fingerprints pinned 13/13 to applied Grammar/Values migration hashes. Focused Inspector suite **13/13**. No summary/DB writes.

## In progress

- Step 453 awaits owner commit/push authorization.
- Production Inspector transport remains parked (F027).

## Next

- Owner review/commit of Step 453 when ready.
- Hold NLL promotion, deployment, and permanent flag-on defaults until requested.
- Priority 4 and non-Inspector hash wiring require separate authorization.
- F027 production Inspector access only when hosting is chosen and explicitly authorized.

## Blocked

- NLL promotion and production deployment are not authorized.
- Broader `supabase db push` / `--include-all` remain unauthorized.
- Production Inspector access requires F027.

---

## Snapshot notes

- Step 453 is Inspector-only and read-only for NLL/canonical data. Modal summaries, GLP, adapters, review states, and stored hashes are unchanged.
- Root untracked `package-lock.json` remains outside this task.
