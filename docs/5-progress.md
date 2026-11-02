# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 455
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D031** locked; D029 Inspector audit-hardened and smoke-checked under revised scope.
- **Checkpoint on main:** through Step 454 / Priority 4 (`1fb7926`). Priority 3 (`171138a`) already on `origin/main`.
- **BE3 Unit 8** NLL activity-summary path remains on `main` lineage; live NLL **10 / 77 / 77 / 10**; history **29 / 0 / 0**.
- **Priority 2–4 on main:** D031 summaries; Inspector authoritative staleness; exact membership component lookup.
- **Priority 5 local (Step 455):** Genuine SB-only neutral NLP via `buildNeutralSbOnlyLessonPackage` (reuses SB selection + `allocateSbOnlyTwoLessonActivities`; no Workbook invention). Inspector assembles SB-only NLP when no companion. Focused SB-only **6/6**; package **31/31**; Inspector **13/13**.

## In progress

- Step 455 awaits owner review / commit authorization.
- Production Inspector transport remains parked (F027).

## Next

- Owner review/commit of Step 455 when ready.
- Hold NLL promotion, deployment, and permanent flag-on defaults until requested.
- Adapter / GLP consumption of SB-only NLP not authorized.
- F027 production Inspector access only when hosting is chosen and explicitly authorized.

## Blocked

- NLL promotion and production deployment are not authorized.
- Broader `supabase db push` / `--include-all` remain unauthorized.
- Production Inspector access requires F027.

---

## Snapshot notes

- Step 455 adds SB-only NLP assembly + Inspector wiring only. Adapters, GLP, migrations, summaries, and schema are unchanged.
- Root untracked `package-lock.json` remains outside this task.
