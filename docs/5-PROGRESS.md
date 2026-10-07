# General Curriculum Mapper — Progress

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 51  
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- Auth, catalog, Validation; pilot unit batches verified for BH1 / BE1-SB / BE2-SB / RH2A.
- **BE1-SB Phase 1 COMPLETE** (canonical v1 + whole-book audit PASSED).
- Cross-series schema review working recommendations owner-accepted.
- **D007 book_id alias map** + merge-time normalization; BE1-SB canonical `book_id` fields normalized to catalog ID.

## In progress

- Canonical merge + audit for BH1, BE2-SB, RH2A on schema 0.1 (using alias normalization).

## Next

- Canonical merge for BH1 (then BE2-SB / RH2A).
- Whole-book audits for newly merged pilot canonicals.
- After remaining pilot audits: consider 0.2 only for changes with sufficient evidence.

## Blocked

- None.

---

## Snapshot notes

- **Phase 1 Complete:** 1 / 18 (BE1-SB only).
- **Identity:** catalog `books.book_id` is canonical; extraction aliases mapped at merge (entity ID prefixes preserved).
- **Schema:** stay on 0.1 through remaining pilot merges.
