# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 80  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Auth, catalog, Validation; four Storage-backed pilots Phase 1 COMPLETE.
- Schema remains **0.1**; D007–D012 locked; D008 validation integrated.
- **R2 Stages A–E PASS** + **D012** R2-only source PDFs.
- **BE1-WB staged:** catalog seeded, source PDF on R2, 9 unit JSON batches on Supabase `book-datasets` (all `pending` human verify). Smoke PASS.

## In progress

- Human Validation for BE1-WB Units 1–9 (side-by-side PDF + JSON).

## Next

- Owner: verify BE1-WB batches in Validation UI (`via r2`).
- After all units verified: preflight → canonical merge → D008 → whole-book audit (follow-up prompt).

## Blocked

- None.

---

## Snapshot notes

- **Phase 1 Complete:** 4 / 18 (BE1-WB IN PROGRESS).
- **Local working copies:** PDFs in `app/src/assets/books/`; unit JSON in `data/phase1/` — never commit either.
- **Active book:** BE1-WB (`big_english_1_wb`).
