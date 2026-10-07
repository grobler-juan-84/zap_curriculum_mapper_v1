# General Curriculum Mapper — Todo

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 62
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
- [x] Owner accepts schema review working recommendations (§7: continue 0.1; classify gaps; defer 0.2).
- [x] Document / implement `book_id` alias map + merge-time normalization (D007; BE1-SB fields normalized).
- [x] Canonical merge for BH1 using `scripts/merge_canonical_book.mjs` (with book_id normalization).
- [x] Whole-book audit for BH1 canonical (structural pack + owner PDF spot-check) → Phase 1 COMPLETE.
- [x] Canonical merge for BE2-SB using `scripts/merge_canonical_book.mjs`.
- [x] Whole-book audit for BE2-SB canonical → Phase 1 COMPLETE.
- [x] Canonical merge for RH2A using `scripts/merge_canonical_book.mjs`.
- [x] Whole-book audit for RH2A canonical (structural pack + owner PDF spot-check) → Phase 1 COMPLETE.

## Next

- [x] After RH2A audit: draft 0.2 candidate only for changes with sufficient evidence (or explicitly defer). **Deferred** — schema stays 0.1 (review notes §11).
- [x] Implement automated structural validation for Phase 1 JSON; retrospectively run all four pilots.
- [x] Triage BE2-SB's 9 dangling `paired_with` targets (`bep2_p189`–`bep2_p191`): added appendix sticker page records; validation now PASSED WITH WARNINGS.
- [x] Draft remaining-book extraction order after post-pilot schema pass (Dataset Registry §15).
- [ ] Review and approve the project-wide naming proposal, then formalize it in `docs/9-naming-conventions.md`, D009, and `.cursor/rules/naming_conventions.mdc`.
- [ ] Prepare BE1-WB as the next extraction checkpoint: confirm source, catalog `book_id`, aliases, unit/section plan, and validator profile.

## Soon

- [ ] Persist Validation session notes (optional).

---

## Maintenance

- Keep this list short and actionable.
- Move completed items off the list (progress belongs in [`5-PROGRESS.md`](./5-PROGRESS.md)).
- Park non-now ideas in [`7-FUTURE.md`](./7-FUTURE.md), not here.
- Keep [`project-tracking/4-mock-data-registry.md`](./project-tracking/4-mock-data-registry.md) current when mock vs live UI data changes.
