# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 71  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Auth, catalog, Validation; four Storage-backed pilots Phase 1 COMPLETE.
- Schema remains **0.1**; D007–D010 locked; D008 validation integrated.
- **R2 Stage A + Stage B PASS** — S3-compatible API connected to private `book-sources` (list / upload / checksum download / delete under `_connection-tests/` only).

## In progress

- Ready for R2 Stage C (one pilot PDF with existing object key) or BE1-WB prep.

## Next

- **Stage C** — upload one existing source PDF to R2 with the same logical key; verify size/integrity (still keep Supabase copy).
- Or prepare BE1-WB source/catalog/unit plan (`big_english_1_wb`).
- Confirm R2 API token scope in Cloudflare dashboard (Object Read & Write → `book-sources` only).

## Blocked

- None.

---

## Snapshot notes

- **Phase 1 Complete:** 4 / 18.
- **PDF storage:** live app still Supabase; R2 connectivity verified; migration not started.
- **Draft next book:** BE1-WB (`big_english_1_wb`).
