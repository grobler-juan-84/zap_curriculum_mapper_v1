# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 33  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Hybrid Supabase catalog/Storage; pilot unit JSON in `book-datasets`.
- Curriculum library uses live `book_series` / `books`.
- Series + book cover PNGs uploaded to `book-assets`; UI uses Storage signed URLs only.
- Local Phase 1 JSON and cover PNGs removed from the git tree (gitignored; Storage is source of truth).

## In progress

- Apply `20261007150000_books_cover_path.sql` on remote so `books.cover_path` is stored in Postgres (Storage uploads already done; UI has path defaults).
- Beehive 1 still uses mock interactive page spreads.

## Next

- Apply books cover_path migration, then re-run `node scripts/upload_book_covers.mjs` once (needs local cover files dropped back temporarily) to stamp DB paths.
- Human-review RH2A Unit 4.
- Wire unit batch JSON from Storage into verification/viewer flow.

## Blocked

- None hard-blocked.

---

## Snapshot notes

- **Focus:** Storage-backed catalog + covers; no copyrighted curriculum bytes in Git.
- **Usable now:** Auth + Supabase series/books; covers via signed URLs when signed in.
- **Not started:** Storage-backed page viewer for all books; canonical merges.
