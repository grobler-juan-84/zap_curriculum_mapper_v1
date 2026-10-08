# General Curriculum Mapper — Todo

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 83  
**Purpose:** Concrete near-term actionable tasks. Not a parking lot for long-term ideas (see [`7-future.md`](./7-future.md)).

---

## Now

- [x] Four Storage-backed pilots Phase 1 COMPLETE (merge + audit + D008 validation).
- [x] D009 naming authority + safe cosmetic renames.
- [x] **R2 Stage A–E** + **D012** R2-only PDFs.
- [x] Register BE1-WB + upload PDF/JSON; Unit 9 verify with D013 missing-source exception.
- [x] BE1-WB book-level HV + canonical merge + automated validation + whole-book audit → Phase 1 COMPLETE (with exception).
- [x] All 12 Big English PDFs present locally as `big_english_{level}_{sb|wb}.pdf` under `app/src/assets/books/big-english/` (gitignored).
- [ ] Choose next book from draft order (BH2 / BE2-WB / RH2B per registry §15) and stage catalog + source.

## Next

- [ ] Mapper cleanup: prefer `bookUuid` / `catalogBookId` over overloaded `bookId` / `stableBookId` in app TS.

## Soon

- [ ] Add lightweight naming checks for books under the new policy (legacy pilots exempt).
- [ ] Review post-form Storage measurements before approving cover thumbnails or PDF linearization.
- [ ] Persist Validation session notes (optional).
- [ ] F015 — investigate Validation PDF printed-page ↔ PDF-index navigation when source pages are absent (deferred).

---

## Maintenance

- Keep this list short and actionable.
- Move completed items off the list (progress belongs in [`5-progress.md`](./5-progress.md)).
- Park non-now ideas in [`7-future.md`](./7-future.md), not here.
- Keep [`project-tracking/4-mock-data-registry.md`](./project-tracking/4-mock-data-registry.md) current when mock vs live UI data changes.
