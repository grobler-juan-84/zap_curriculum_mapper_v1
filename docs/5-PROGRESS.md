# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 59
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Auth, catalog, Validation; pilot unit batches verified.
- **All four Storage-backed pilots Phase 1 COMPLETE:** BE1-SB, BH1, BE2-SB, RH2A (canonical v1 + whole-book audit PASSED).
- D007 book_id alias map + merge-time normalization.
- Cross-series schema review working recommendations owner-accepted (§7).
- Post-pilot 0.2 candidate **defers** every observed gap. Schema remains **0.1** (review notes §11). No schema or prompt patch.
- Automated structural validation implemented (machine schema + shared JavaScript + CLI), integrated with merge/audit, and kept separate from human/source verification (D008).
- Retrospective validation: BE1-SB, BH1, and RH2A **PASSED WITH WARNINGS**; BE2-SB **FAILED** on nine dangling same-book appendix-page relationship targets.

## In progress

- Remaining-book extraction order after the post-pilot schema pass.
- BE2-SB relationship-target triage; no automatic canonical repair.

## Next

- Decide whether BE2 appendix/sticker pages should become page records or the dependency should be remodelled/documented.
- Draft remaining-book extraction order.

## Blocked

- BE2-SB cannot serve as a clean automated-validation baseline until its nine dangling relationship targets are resolved.

---

## Snapshot notes

- **Phase 1 Complete:** 4 / 18 (BE1-SB, BH1, BE2-SB, RH2A).
- **Canonical datasets:** 4 verified.
- **Automated validation:** 3 passed with warnings; 1 failed (BE2-SB relationship integrity).
- **Schema:** 0.1. The 0.2 candidate (2026-10-07) found no universal field with sufficient evidence.
