# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 28  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Core Phase 1–7 philosophy documented; docs split into `phase-1`…`phase-6` folders.
- Technology scaffold + Supabase Auth + mock workstation UI.
- Hybrid DB catalog + private Storage buckets; pilot seed; 30 unit batches uploaded.
- `/app/curriculum` (and series list) now loads real `book_series` + `books` from Supabase instead of mock catalog cards.

## In progress

- Phase 1 extraction / verification for the pilot series.
- Beehive 1 still uses mock interactive page spreads; other books are catalog-only until Storage JSON is wired into the viewer.

## Next

- Human-review RH2A Unit 4.
- Wire unit batch JSON from Storage into a verification/viewer flow for non-Beehive books.
- Move `SUPABASE_SERVICE_ROLE_KEY` out of Vite-loaded env when convenient.

## Blocked

- None hard-blocked. Soft friction: RH2A `book_id` naming still inconsistent (`reach_higher_2a` vs `rh_2a`).

---

## Snapshot notes

- **Focus:** Real catalog in the UI; curriculum content still hybrid (mock spreads / Storage batches).
- **Usable now:** Authenticated curriculum library + series books from Postgres.
- **Not started:** Full Storage-backed page viewer for all books; canonical merges.
