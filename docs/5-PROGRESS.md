# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 27  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Core Phase 1–7 philosophy documented; docs split into `phase-1`…`phase-6` folders.
- Technology scaffold + Supabase Auth + mock workstation UI.
- Hybrid DB catalog + private Storage buckets (D006).
- Pilot seed: 3 series, 4 books, unit `batch_json` pointers.
- Uploaded all 30 pilot unit JSON batches to private `book-datasets` Storage (paths match seed).

## In progress

- Phase 1 extraction / verification for the pilot series.
- Manual apply/verify of remaining migrations on live project if not fully applied.

## Next

- Human-review RH2A Unit 4 (`needs_review` batch).
- Replace mock curriculum catalog with Supabase series/books + batch file list.
- Prefer moving `SUPABASE_SERVICE_ROLE_KEY` out of Vite-loaded `app/.env.local` into a root server env file.

## Blocked

- None hard-blocked. Soft friction: RH2A `book_id` naming still inconsistent (`reach_higher_2a` vs `rh_2a`).

---

## Snapshot notes

- **Focus:** Catalog + Storage now hold pilot batch files; UI still mock.
- **Usable now:** Auth + mock UI + DB pointers + Storage objects for unit batches.
- **Not started:** Wiring UI to real tables/Storage, canonical merges, PDF uploads.
