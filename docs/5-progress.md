# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 78  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Auth, catalog, Validation; four Storage-backed pilots Phase 1 COMPLETE.
- Schema remains **0.1**; D007–D011 locked; D008 validation integrated.
- **R2 Stages A–E PASS** — all 4 cataloged source PDFs on R2; Validation confirms `provider=r2 delivery=proxy`.
- Local PDF layout under `app/src/assets/books/` (gitignored).
- Scaffolded remaining Big English unit-batch placeholders under `data/phase1/` (90 empty `{}` files; gitignored).

## In progress

- Staging remaining Big English PDFs and filling unit JSON after extraction.

## Next

- Prepare BE1-WB as the next extraction checkpoint.
- Optional later: retire/freeze Supabase `book-sources` (fallback kept).

## Blocked

- None.

---

## Snapshot notes

- **Phase 1 Complete:** 4 / 18.
- **Local working copies:** PDFs in `app/src/assets/books/`; unit JSON in `data/phase1/` — never commit either.
- **Draft next book:** BE1-WB (`big_english_1_wb`).
