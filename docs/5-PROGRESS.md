# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 34  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Hybrid Supabase catalog/Storage; pilot unit JSON in `book-datasets`.
- Curriculum library uses live `book_series` / `books` with Storage cover URLs.
- Local Phase 1 JSON/covers removed from Git (Storage is source of truth).
- New `/app/validation` route: workspace-like layout for verifying unit-batch JSON (left JSON summary, PDF stub, status tools → `book_files.status`).

## In progress

- Apply `20261007150000_books_cover_path.sql` on remote if not already applied.
- Source PDFs not uploaded yet (validation PDF pane shows placeholder).
- Beehive 1 workspace still uses mock interactive page spreads.

## Next

- Upload pilot source PDFs to `book-sources` and register `source_pdf` rows so validation can embed them.
- Human-review RH2A Unit 4 via Validation UI; mark `book_files.status`.
- Persist validation notes (DB column or related table) when needed.

## Blocked

- None hard-blocked.

---

## Snapshot notes

- **Focus:** Storage-backed verification workflow for Phase 1 batches.
- **Usable now:** Auth + catalog + Validation page loading unit JSON from Storage.
- **Not started:** Canonical merges; teacher Ask-AI production path.
