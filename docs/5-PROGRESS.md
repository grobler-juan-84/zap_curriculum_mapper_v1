# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 29  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Core Phase 1–7 philosophy + hybrid Supabase catalog/Storage.
- Pilot unit JSON batches uploaded to `book-datasets`.
- Curriculum library loads live `book_series` / `books`.
- Series cover PNGs uploaded to private `book-assets` (Beehive / Big English / Reach Higher).

## In progress

- Apply migration `20261007140000_book_assets_and_series_covers.sql` on remote (adds `cover_path` + Storage read policies) so UI signed cover URLs work for authenticated users.
- Beehive 1 still uses mock interactive page spreads.

## Next

- Apply the book-assets migration in Supabase SQL editor, then refresh `/app/curriculum` to confirm covers.
- Human-review RH2A Unit 4.
- Wire unit batch JSON from Storage into verification/viewer flow.

## Blocked

- None hard-blocked. Soft friction: RH2A `book_id` naming still inconsistent.

---

## Snapshot notes

- **Focus:** Real catalog + series imagery in Storage.
- **Usable now:** Auth + Supabase series/books; covers uploaded (policies/column pending apply).
- **Not started:** Storage-backed page viewer for all books; canonical merges.
