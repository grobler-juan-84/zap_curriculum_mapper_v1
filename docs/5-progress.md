# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 73  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Auth, catalog, Validation; four Storage-backed pilots Phase 1 COMPLETE.
- Schema remains **0.1**; D007–D011 locked; D008 validation integrated.
- **R2 Stages A–D PASS** — Beehive 1 on R2; Validation signs PDFs via `/api/sign-source-pdf` (R2-first dual-read); JSON/covers still Supabase.

## In progress

- Stage E (remaining PDF copies + retire Supabase `book-sources` after verification) not started.
- Localhost R2 CORS may need Cloudflare dashboard (Object Read/Write token lacked PutBucketCors).

## Next

- Set R2 bucket CORS for `localhost:5173` / `127.0.0.1:5173` GET+HEAD if PDF.js cross-origin fails.
- Confirm Beehive 1 Validation badge shows **via r2**; another book **via supabase**.
- Stage E planning, or BE1-WB prep.

## Blocked

- None (CORS is a soft follow-up if browser fetch fails).

---

## Snapshot notes

- **Phase 1 Complete:** 4 / 18.
- **PDF storage:** Validation dual-read; R2 has Beehive 1; Supabase originals preserved.
- **Draft next book:** BE1-WB (`big_english_1_wb`).
