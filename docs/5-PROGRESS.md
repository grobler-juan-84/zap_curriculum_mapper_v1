# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 49  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Auth, catalog, Validation; pilot unit batches verified for BH1 / BE1-SB / BE2-SB / RH2A.
- **BE1-SB Phase 1 COMPLETE** (canonical v1 + whole-book audit PASSED).
- Initial **cross-series schema review draft** from BH1 / BE1 / BE2 / RH2A evidence.

## In progress

- Owner sign-off on schema review draft (and whether to land additive 0.2 fields).
- Canonical merge for remaining verified pilots (BH1, BE2-SB, RH2A).
- book_id alias / merge-time normalization.

## Next

- Answer schema review open questions (SEL/`sub_feature_type`, Big Question, RH long text, 0.2 timing).
- Canonical merge for BH1 (and other verified pilots).
- Document / fix internal `book_id` drift.

## Blocked

- None.

---

## Snapshot notes

- **Phase 1 Complete:** 1 / 18 (BE1-SB only).
- **Schema:** 0.1 still working; draft recommends hybrid continue + additive 0.2 candidates (not locked).
- **Automated validation:** still NOT RUN (non-blocking).
