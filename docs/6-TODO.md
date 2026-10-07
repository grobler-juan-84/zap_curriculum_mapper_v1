# General Curriculum Mapper — Todo

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 49  
**Purpose:** Concrete near-term actionable tasks. Not a parking lot for long-term ideas (see [`7-FUTURE.md`](./7-FUTURE.md)).

---

## Now

- [x] Choose next Phase 1 checkpoint: first canonical merge (BE1-SB).
- [x] Merge BE1-SB verified unit batches into canonical v1 + register `dataset_versions`.
- [x] Human-verify BH1 Units 9–10 and RH2A Unit 4; set `book_files.status` to `verified`.
- [x] Structural audit pack for BE1-SB canonical v1.
- [x] Show `canonical_json` in Validation + unit-scoped slices over one canonical file.
- [x] Owner PDF spot-check → **audit PASSED**; BE1-SB Phase 1 COMPLETE (`dataset_versions` verified).
- [x] Draft initial cross-series schema review notes (BH1 / BE1 / RH2A [/ BE2]).
- [ ] Owner sign-off on [`phase-1/Cross_Series_Schema_Review_Notes.md`](./phase-1/Cross_Series_Schema_Review_Notes.md) (§8 questions / CONTINUE vs 0.2).

## Next

- [ ] Document / fix internal `book_id` drift (`bep1_sb` vs `big_english_1_sb`, etc.) before further canonical merges.
- [ ] Canonical merge for BH1 (and other verified pilots) using `scripts/merge_canonical_book.mjs`.
- [ ] Run or design automated structural validation for Phase 1 JSON (currently NOT RUN).

## Soon

- [ ] If 0.2 accepted: patch JSON schema + extraction prompt for additive fields.
- [ ] Persist Validation session notes (optional).
- [ ] Draft remaining-book extraction order after schema review sign-off.

---

## Maintenance

- Keep this list short and actionable.
- Move completed items off the list (progress belongs in [`5-PROGRESS.md`](./5-PROGRESS.md)).
- Park non-now ideas in [`7-FUTURE.md`](./7-FUTURE.md), not here.
- Keep [`project-tracking/4-mock-data-registry.md`](./project-tracking/4-mock-data-registry.md) current when mock vs live UI data changes.
