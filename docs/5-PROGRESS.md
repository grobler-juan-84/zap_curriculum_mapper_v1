# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 46  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Auth, catalog, Validation; pilot unit batches verified for BH1 / BE1-SB / BE2-SB / RH2A.
- BE1-SB canonical v1 merged and registered (`dataset_versions` draft).
- Structural whole-book audit pack for BE1-SB (integrity PASS) written under `docs/phase-1/audits/`.
- Validation lists `canonical_json` alongside unit batches (canonical first) for whole-book audit vs PDF.

## In progress

- Owner PDF spot-check for BE1-SB whole-book audit (open Canonical v1 in Validation; awaiting PASSED / NEEDS REVIEW).
- Formal cross-series schema review still open.

## Next

- After owner confirms audit PASSED: record Whole-Book Audit PASSED, set `dataset_versions` verified, mark BE1-SB Phase 1 COMPLETE (automated validation remains NOT RUN, documented as non-blocking).

## Blocked

- Soft-blocked on owner PDF spot-check sign-off for BE1-SB whole-book audit.

---

## Snapshot notes

- **Canonical:** BE1-SB v1 only; visible in `/app/validation` as **Canonical v1**.
- **Structural audit:** PASS (9 units, pages 10–165, no duplicate entity IDs).
- **Not Phase 1 COMPLETE** until owner signs off the PDF spot-check.
