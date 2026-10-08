# General Curriculum Mapper — Todo

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 73  
**Purpose:** Concrete near-term actionable tasks. Not a parking lot for long-term ideas (see [`7-future.md`](./7-future.md)).

---

## Now

- [x] Four Storage-backed pilots Phase 1 COMPLETE (merge + audit + D008 validation).
- [x] D009 naming authority + safe cosmetic renames.
- [x] Document Cloudflare R2 PDF storage architecture (D010).
- [x] **R2 Stage A–C** — connectivity + Beehive 1 integrity copy.
- [x] **R2 Stage D** — `/api/sign-source-pdf` + Validation dual-read (D011).
- [ ] Set R2 CORS for localhost PDF.js in Cloudflare dashboard (token lacked PutBucketCors).
- [ ] Confirm in Validation UI: Beehive 1 badge `via r2`; another pilot `via supabase`.
- [ ] Prepare BE1-WB as the next extraction checkpoint: confirm source, catalog `book_id` (`big_english_1_wb`), aliases, unit/section plan, and validator profile.

## Next

- [ ] **R2 Stage E** — migrate remaining pilot PDFs; verify; retire Supabase `book-sources` only after app verification.
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
