# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 38  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Hybrid Supabase catalog/Storage; pilot unit JSON and source PDFs in private buckets.
- Curriculum library uses live `book_series` / `books` with Storage cover URLs.
- `/app/validation`: unit JSON from Storage; PDF.js two-page signed-URL viewer (unit first page on left).
- Validation workspace splitters: drag left/right (JSON vs PDF+tools) and top/bottom (PDF vs tools).

## In progress

- Spot-check Validation PDF jumps and panel resize on pilot books.
- Apply `20261007150000_books_cover_path.sql` / `20261007160000_seed_source_pdf_book_files.sql` on remote if not already applied.

## Next

- Human-review RH2A Unit 4 via Validation UI; mark `book_files.status`.
- Persist validation notes (DB column or related table) when needed.
- Canonical merges after units verified.

## Blocked

- None hard-blocked.

---

## Snapshot notes

- **Focus:** Storage-backed verification workflow for Phase 1 batches.
- **Usable now:** Auth + catalog + Validation with resizable panes and embedded source PDFs.
- **Not started:** Canonical merges; teacher Ask-AI production path.
