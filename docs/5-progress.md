# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 76  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Auth, catalog, Validation; four Storage-backed pilots Phase 1 COMPLETE.
- Schema remains **0.1**; D007–D011 locked; D008 validation integrated.
- **R2 Stages A–E PASS** — all 4 cataloged source PDFs on R2 (SHA-256 verified); Validation console confirms `provider=r2 delivery=proxy` for every pilot; JSON/covers still on Supabase; dual-read fallback retained.

## In progress

- Optional later: retire/freeze Supabase `book-sources` (not started; fallback kept).

## Next

- Prepare BE1-WB as the next extraction checkpoint.

## Blocked

- None.

---

## Snapshot notes

- **Phase 1 Complete:** 4 / 18.
- **PDF storage:** 4/4 cataloged pilots on R2 + browser-verified via proxy; Supabase originals preserved.
- **Draft next book:** BE1-WB (`big_english_1_wb`).
