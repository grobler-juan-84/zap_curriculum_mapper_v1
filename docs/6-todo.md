# General Curriculum Mapper — Todo

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 79  
**Purpose:** Concrete near-term actionable tasks. Not a parking lot for long-term ideas (see [`7-future.md`](./7-future.md)).

---

## Now

- [x] Four Storage-backed pilots Phase 1 COMPLETE (merge + audit + D008 validation).
- [x] D009 naming authority + safe cosmetic renames.
- [x] Document Cloudflare R2 PDF storage architecture (D010).
- [x] **R2 Stage A–C** — connectivity + Beehive 1 integrity copy.
- [x] **R2 Stage D** — `/api/sign-source-pdf` + Validation dual-read (D011).
- [x] Fix Beehive 1 PDF.js CORS failure via same-origin `/api/source-pdf-content` proxy (no bucket CORS admin required).
- [x] **R2 Stage E** — migrate remaining cataloged pilot PDFs; SHA-256 verify; Supabase originals + dual-read retained.
- [x] Confirm in Validation UI: all 4 pilots `provider=r2 delivery=proxy` (owner-confirmed 2026-10-08).
- [x] Align local source PDFs to `app/src/assets/books/` and harden gitignore so PDFs never reach GitHub.
- [x] Scaffold remaining Big English unit-batch JSON folders under `data/phase1/` (gitignored placeholders).
- [x] **D012** — retire Supabase as PDF object store: R2-only Validation + `upload_source_pdfs.mjs`; leave Supabase PDF objects unused (delete later = F014).
- [ ] Place remaining Big English PDFs locally as `big_english_{level}_{sb|wb}.pdf` under `app/src/assets/books/big-english/` (gitignored).
- [ ] Prepare BE1-WB as the next extraction checkpoint: confirm source, catalog `book_id` (`big_english_1_wb`), aliases, unit/section plan, and validator profile.
- [ ] Register BE1-WB in catalog and upload source PDF to R2 via `upload_source_pdfs.mjs` (after local PDF ready).

## Next

- [ ] Mapper cleanup: prefer `bookUuid` / `catalogBookId` over overloaded `bookId` / `stableBookId` in app TS.

## Soon

- [ ] Add lightweight naming checks for books under the new policy (legacy pilots exempt).
- [ ] Review post-form Storage measurements before approving cover thumbnails or PDF linearization.
- [ ] Persist Validation session notes (optional).

---

## Maintenance

- Keep this list short and actionable.
- Move completed items off the list (progress belongs in [`5-progress.md`](./5-progress.md)).
- Park non-now ideas in [`7-future.md`](./7-future.md), not here.
- Keep [`project-tracking/4-mock-data-registry.md`](./project-tracking/4-mock-data-registry.md) current when mock vs live UI data changes.
