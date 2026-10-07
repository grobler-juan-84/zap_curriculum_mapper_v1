# General Curriculum Mapper — Todo

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 46  
**Purpose:** Concrete near-term actionable tasks. Not a parking lot for long-term ideas (see [`7-FUTURE.md`](./7-FUTURE.md)).

---

## Now

- [x] Choose next Phase 1 checkpoint: first canonical merge (BE1-SB).
- [x] Merge BE1-SB verified unit batches into canonical v1 + register `dataset_versions`.
- [x] Human-verify BH1 Units 9–10 and RH2A Unit 4; set `book_files.status` to `verified`.
- [x] Structural audit pack for BE1-SB canonical v1 (`scripts/audit_canonical_book.mjs` → [`phase-1/audits/BE1-SB_canonical_v1_audit.md`](./phase-1/audits/BE1-SB_canonical_v1_audit.md)).
- [x] Show `canonical_json` in Validation (picker lists Canonical v1 first for BE1-SB).
- [ ] Owner PDF spot-check in Validation (open **Canonical v1**) → reply **audit PASSED** or **audit NEEDS REVIEW** (required before Phase 1 COMPLETE).

## Next

- [ ] Draft initial cross-series schema review notes (BH1 / BE1 / RH2A [/ BE2]).
- [ ] Document / fix internal `book_id` drift (`bep1_sb` vs `big_english_1_sb`, etc.) before further canonical merges.
- [ ] Run or design automated structural validation for Phase 1 JSON (currently NOT RUN).

## Soon

- [ ] Canonical merge for BH1 (and other verified pilots) using `scripts/merge_canonical_book.mjs`.
- [ ] Persist Validation session notes (optional).
- [ ] Draft remaining-book extraction order after schema review.

---

## Maintenance

- Keep this list short and actionable.
- Move completed items off the list (progress belongs in [`5-PROGRESS.md`](./5-PROGRESS.md)).
- Park non-now ideas in [`7-FUTURE.md`](./7-FUTURE.md), not here.
- Keep [`project-tracking/4-mock-data-registry.md`](./project-tracking/4-mock-data-registry.md) current when mock vs live UI data changes.
