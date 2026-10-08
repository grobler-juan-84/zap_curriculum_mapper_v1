# General Curriculum Mapper — Todo

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 80  
**Purpose:** Concrete near-term actionable tasks. Not a parking lot for long-term ideas (see [`7-future.md`](./7-future.md)).

---

## Now

- [x] Four Storage-backed pilots Phase 1 COMPLETE (merge + audit + D008 validation).
- [x] D009 naming authority + safe cosmetic renames.
- [x] Document Cloudflare R2 PDF storage architecture (D010).
- [x] **R2 Stage A–E** + **D012** R2-only PDFs.
- [x] Align local source PDFs to `app/src/assets/books/` and harden gitignore so PDFs never reach GitHub.
- [x] Scaffold remaining Big English unit-batch JSON folders under `data/phase1/` (gitignored placeholders).
- [x] Register BE1-WB in catalog + upload source PDF to R2 + upload 9 unit JSON to `book-datasets`.
- [ ] **Owner:** Human-verify BE1-WB Units 1–9 in Validation (PDF badge `via r2`; mark batches verified).
- [ ] Place remaining Big English PDFs locally as `big_english_{level}_{sb|wb}.pdf` under `app/src/assets/books/big-english/` (gitignored).

## Next

- [ ] After BE1-WB units verified: preflight → canonical merge → D008 automated validation → whole-book audit.
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
