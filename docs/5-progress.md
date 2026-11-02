# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 456
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D031** locked; D029 Inspector audit-hardened and smoke-checked under revised scope.
- **Checkpoint on main:** through Step 454 / Priority 4 (`1fb7926`). Priority 3 (`171138a`) already on `origin/main`.
- **BE3 Unit 8** NLL activity-summary path remains on `main` lineage; live NLL **10 / 77 / 77 / 10**; history **29 / 0 / 0**.
- **Priority 2–4 on main:** D031 summaries; Inspector authoritative staleness; exact membership component lookup.
- **Priority 5 local (Step 455):** Genuine SB-only neutral NLP via `buildNeutralSbOnlyLessonPackage` (uncommitted).
- **Teacher Experience Fix #1 (Step 456):** Verified SB→WB Workbook activities now default-selected. Pending scope wait includes companion WB readiness; known-id refs no longer mutate inside setState (Strict Mode-safe). Opener verified **5/5 + 4/4**; Values SB-only unaffected.

## In progress

- Steps 455–456 await owner review / commit authorization.
- Production Inspector transport remains parked (F027).

## Next

- Owner review/commit of Steps 455–456 when ready (separately or together).
- Remaining Teacher Experience findings #2–#4 only when explicitly approved one at a time.
- Hold NLL promotion, deployment, and permanent flag-on defaults until requested.
- F027 production Inspector access only when hosting is chosen and explicitly authorized.

## Blocked

- NLL promotion and production deployment are not authorized.
- Broader `supabase db push` / `--include-all` remain unauthorized.
- Production Inspector access requires F027.

---

## Snapshot notes

- Step 456 is selection-init only; no canonical/NLL/NLP/prompt/adapter changes.
- Root untracked `package-lock.json` remains outside this task.
