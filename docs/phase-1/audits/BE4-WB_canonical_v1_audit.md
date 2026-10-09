# BE4-WB — Canonical v1 Whole-Book Audit

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-09  
**Canonical path:** `big-english/big_english_4_wb/canonical/v1.json`  
**Catalog book_id:** `big_english_4_wb`

## Purpose

Structural / integrity evidence for the whole-book audit checklist in `extraction-data-specification.md` §22, plus owner human-verification outcome.

## Automated validation summary

- Status: **PASSED_WITH_WARNINGS**
- Errors: 0
- Warnings: 7
- Info: 2

## Counts

| Array | Count |
|---|---:|
| `units` | 9 |
| `pages` | 131 |
| `vocabulary` | 309 |
| `language` | 72 |
| `activities` | 325 |
| `continuous_text` | 52 |
| `curriculum_components` | 93 |
| `relationships` | 38 |
| `extraction_issues` | 40 |
| `schema_gaps` | 3 |

## Coverage

- Expected units: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Present unit numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Missing units: none
- Printed page range in `pages`: 2–142
- Book metadata printed range: 2–142 (patched after merge from Unit 1–9 batches)
- Gap 44–45 between Units 3 and 4 (non-unit printed pages)

## Integrity

- Structural integrity gate: **PASS**
- Automated structural validation: **PASSED_WITH_WARNINGS** (0 errors)

### Merge hygiene applied before PASS

- Units 1 / 2 / 6 / 7 / 9: rear grammar pages (134 / 135 / 139 / 140 / 142) extend unit printed ranges for D008; causes non-blocking `UNIT_PRINTED_RANGES_OVERLAP` warnings vs later units.
- Unit 7: remumbered 46 colliding `bep_wb_4_*` entity IDs to catalog `big_english_4_wb_*` (shared Studio counters with Unit 3).
- Units 4 / 8: removed invalid relationships to non-extracted pages 88 / 137 / 141; recorded as open `possible_omission`.
- Student Book cross-refs tagged with `target_book_id=big_english_4_sb` (external, not checked).
- Mixed Studio entity ID prefixes preserved where non-colliding (D007); catalog `book_id` fields normalized at merge.
- Registry note: [`dataset-registry.md`](../dataset-registry.md) §8J.

### Structural warnings (non-blocking)

| Code | Message |
|---|---|
| `RELATIONSHIP_ENTITY_TYPE_UNKNOWN` | target types `other` / `book` on SB / cross-refs |
| `UNIT_PRINTED_RANGE_GAP` | Gap 44–45 between Units 3 and 4 |
| `UNIT_PRINTED_RANGES_OVERLAP` | Grammar-inclusive unit ranges overlap numerically with later units |

## Uncertainty (preserved)

- `extraction_issues`: 40 (`audio_required` 32, `possible_omission` 3 for p.88/137/141 cross-refs, `missing_source` 2, `visual_verification_required` 3)
- `schema_gaps`: 3

## Merge metadata

- `verification.status`: whole_book_audit_passed
- `verification.whole_book_audit`: passed
- Batches merged: 9
- `book.verification_status`: human_verified
- `dataset_versions` v1: verified, is_current

## Owner PDF spot-check

In `/app/validation` for Big English 4 Workbook:

1. Units 1–9 human-verified (owner) against source PDF (R2).
2. Grammar pages 134 / 135 / 139 / 140 / 142 on Units 1 / 2 / 6 / 7 / 9 accepted at HV.
3. Open audio / possible-omission / schema-gap issues accepted as documented debt.

**Owner reply (2026-10-09):** Units 1–9 HV passed in Validation.

## Verdict

| Gate | Result |
|---|---|
| Structural integrity | **PASS** |
| Automated validation | **PASSED WITH WARNINGS** (0 errors) |
| Owner human verification | **COMPLETE** |
| Owner PDF spot-check | **PASSED** (via prior unit HV) |
| **Whole-Book Audit** | **PASSED** |

Phase 1 for BE4-WB is **COMPLETE**. Project-wide Phase 1 is **10 / 18**.
