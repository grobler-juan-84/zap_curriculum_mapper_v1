# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 69  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Auth, catalog, Validation; four Storage-backed pilots Phase 1 COMPLETE.
- Schema remains **0.1**; D007–D009 locked; D008 validation integrated.
- **D010 locked (docs-only):** Cloudflare R2 for textbook source PDFs (`book-sources`); staged plan in `10-storage-architecture.md`.
- Naming renames, Validation PDF loading fixes, and cover-signing performance work completed earlier.

## In progress

- Documentation of R2 PDF storage architecture (implementation not started).
- Ready for BE1-WB preparation under D009 naming (can proceed in parallel with R2 Stage A).

## Next

- **Stage A** for R2: verify bucket, choose auth method, configure credentials securely, establish CLI/API access (no app code yet).
- Prepare BE1-WB source/catalog/unit plan (`big_english_1_wb`).
- Later: Stages B–E (connectivity → PDF pilot → adapter → migration).

## Blocked

- None.

---

## Snapshot notes

- **Phase 1 Complete:** 4 / 18.
- **Schema:** 0.1.
- **PDF storage:** live = Supabase `book-sources`; target = Cloudflare R2 `book-sources` (D010).
- **Draft next book:** BE1-WB (`big_english_1_wb`).
