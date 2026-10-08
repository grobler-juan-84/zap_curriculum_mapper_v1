# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 70  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Auth, catalog, Validation; four Storage-backed pilots Phase 1 COMPLETE.
- Schema remains **0.1**; D007–D009 locked; D008 validation integrated.
- **D010 locked (docs-only):** Cloudflare R2 for textbook source PDFs (`book-sources`); staged plan in `10-storage-architecture.md`.
- Naming renames, Validation PDF loading fixes, and cover-signing performance work completed earlier.

## In progress

- **R2 Stage B** tooling ready; waiting for R2 secrets in root `.env.local` (gitignored) before running the connectivity test.
- BE1-WB preparation under D009 naming can proceed in parallel.

## Next

- Fill root `.env.local` with `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` (never paste into chat), then re-run Stage B test.
- Prepare BE1-WB source/catalog/unit plan (`big_english_1_wb`).
- Later: Stages C–E after Stage B PASS.

## Blocked

- None.

---

## Snapshot notes

- **Phase 1 Complete:** 4 / 18.
- **Schema:** 0.1.
- **PDF storage:** live = Supabase `book-sources`; target = Cloudflare R2 `book-sources` (D010).
- **Draft next book:** BE1-WB (`big_english_1_wb`).
