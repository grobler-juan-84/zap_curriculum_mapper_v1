# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 25  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Core Phase 1–7 philosophy documented; docs split into `phase-1`…`phase-6` folders.
- Technology scaffold: Vite/React/TS/Tailwind under `app/`, Supabase config, Python tooling.
- Supabase Auth wired: signup/login/forgot/reset, AuthProvider, protected routes, profiles migration.
- Authenticated ZCMV1-faithful workstation UI on mock data.
- Hybrid DB prototype migration: `book_series`, `books`, `book_files`, `dataset_versions` + private Storage buckets `book-sources` / `book-datasets` (D006).

## In progress

- Phase 1 extraction / verification for the pilot series.
- Manual apply/verify of Supabase migrations (profiles + curriculum catalog) on the live project.

## Next

- Apply `20261007120000_create_curriculum_catalog.sql` to the remote Supabase project and confirm buckets/policies.
- Human-review RH2A Unit 4 (`rh2a_sb_unit4.json`).
- Later: replace mock curriculum catalog with real Phase 1 / canonical sources (not started).

## Blocked

- None hard-blocked. Soft friction: RH2A `book_id` naming still inconsistent (`reach_higher_2a` vs `rh_2a`).

---

## Snapshot notes

- **Focus:** Hybrid metadata layer exists in repo; curriculum truth remains JSON-first.
- **Usable now:** Auth + prototype UI (mock) + versioned SQL for catalog/Storage.
- **Not started:** Seeding catalog from registry, uploading PDFs/JSON to Storage, wiring UI to real tables.
