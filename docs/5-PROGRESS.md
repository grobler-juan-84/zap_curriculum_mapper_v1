# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 64
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Auth, catalog, Validation; pilot unit batches verified.
- **All four Storage-backed pilots Phase 1 COMPLETE:** BE1-SB, BH1, BE2-SB, RH2A (canonical v1 + whole-book audit PASSED).
- D007 book_id alias map + merge-time normalization.
- Cross-series schema review working recommendations owner-accepted (§7).
- Post-pilot 0.2 candidate **defers** every observed gap. Schema remains **0.1** (review notes §11). No schema or prompt patch for 0.2.
- Automated structural validation implemented and integrated with merge/audit (D008).
- All four pilots now **PASSED WITH WARNINGS** after BE2-SB appendix sticker pages `bep2_p189`–`bep2_p191` were added.
- Drafted the remaining 14-book extraction order (Dataset Registry §15): BE1-WB first, with BH2 / BE2-WB / RH2B early and later Big English SB/WB pairs interleaved with Reach Higher checkpoints.
- **D009 locked:** project-wide naming authority in `docs/9-naming-conventions.md` plus always-on `.cursor/rules/naming_conventions.mdc`. Pilot entity IDs grandfathered.
- Extraction prompt, JSON Schema §3/§5, Extraction Spec, and Book ID Alias Map aligned with D009; BE1-WB pre-registered as `big_english_1_wb`.

## In progress

- Preparing BE1-WB as the next extraction checkpoint under D009 naming.

## Next

- Confirm BE1-WB source PDF, Postgres/Storage catalog row, unit/section plan, and validator profile, then begin extraction.

## Blocked

- None.

---

## Snapshot notes

- **Phase 1 Complete:** 4 / 18 (BE1-SB, BH1, BE2-SB, RH2A).
- **Canonical datasets:** 4 verified.
- **Automated validation:** 4 passed with warnings.
- **Schema:** 0.1.
- **Naming:** D009 locked and reflected in extraction/schema/alias docs.
- **Draft next order:** BE1-WB → BH2 → BE2-WB → RH2B, then paired Big English levels with RH checkpoints.
