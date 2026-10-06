# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 26  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Core Phase 1–7 philosophy documented; docs split into `phase-1`…`phase-6` folders.
- Technology scaffold: Vite/React/TS/Tailwind under `app/`, Supabase config, Python tooling.
- Supabase Auth wired: signup/login/forgot/reset, AuthProvider, protected routes, profiles migration.
- Authenticated ZCMV1-faithful workstation UI on mock data.
- Hybrid DB catalog + private Storage buckets (D006).
- Pilot seed migrations: 3 series, 4 books, unit `batch_json` file pointers with `label` / per-file `status` (no canonical `dataset_versions` yet).

## In progress

- Phase 1 extraction / verification for the pilot series.
- Manual apply/verify of Supabase migrations on the live project (profiles → catalog → label/status → seed).

## Next

- Apply new migrations on remote Supabase and confirm seed rows.
- Human-review RH2A Unit 4 (`needs_review` batch).
- Later: replace mock curriculum catalog with Supabase series/books + batch file list.

## Blocked

- None hard-blocked. Soft friction: RH2A `book_id` naming still inconsistent (`reach_higher_2a` vs `rh_2a`).

---

## Snapshot notes

- **Focus:** Catalog metadata seeded for feasibility; curriculum truth remains unit JSON.
- **Usable now:** Auth + mock UI + SQL for catalog/Storage + pilot seed ready to apply.
- **Not started:** Uploading JSON bytes to Storage, wiring UI to real tables, canonical merges.
