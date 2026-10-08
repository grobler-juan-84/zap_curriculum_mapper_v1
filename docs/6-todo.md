# General Curriculum Mapper — Todo

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 70  
**Purpose:** Concrete near-term actionable tasks. Not a parking lot for long-term ideas (see [`7-future.md`](./7-future.md)).

---

## Now

- [x] Four Storage-backed pilots Phase 1 COMPLETE (merge + audit + D008 validation).
- [x] D009 naming authority + safe cosmetic renames.
- [x] Document Cloudflare R2 PDF storage architecture (D010; Stages A–E checklist; no implementation).
- [x] **R2 Stage A** — bucket + S3-compatible API token created by owner; ops test script + env template added.
- [ ] **R2 Stage B** — fill root `.env.local` R2 secrets (outside chat), then run `node scripts/test_r2_connection.mjs` to PASS.
- [ ] Prepare BE1-WB as the next extraction checkpoint: confirm source, catalog `book_id` (`big_english_1_wb`), aliases, unit/section plan, and validator profile.

## Next
- [ ] **R2 Stage C** — upload one pilot PDF with existing object key; verify integrity.
- [ ] **R2 Stage D** — storage adapter + replace PDF Supabase calls; keep Auth/JSON/covers on Supabase.
- [ ] **R2 Stage E** — batch migrate PDFs; verify; retire Supabase `book-sources` only after success.
- [ ] Mapper cleanup: prefer `bookUuid` / `catalogBookId` over overloaded `bookId` / `stableBookId` in app TS.

## Soon

- [ ] Add lightweight naming checks for books under the new policy (legacy pilots exempt).
- [ ] Review post-fix Storage measurements before approving cover thumbnails or PDF linearization.
- [ ] Persist Validation session notes (optional).

---

## Maintenance

- Keep this list short and actionable.
- Move completed items off the list (progress belongs in [`5-progress.md`](./5-progress.md)).
- Park non-now ideas in [`7-future.md`](./7-future.md), not here.
- Keep [`project-tracking/4-mock-data-registry.md`](./project-tracking/4-mock-data-registry.md) current when mock vs live UI data changes.
