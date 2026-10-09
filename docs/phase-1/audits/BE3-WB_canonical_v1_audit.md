# BE3-WB — Canonical v1 Whole-Book Audit

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-09  
**Canonical path:** `big-english/big_english_3_wb/canonical/v1.json`  
**Catalog book_id:** `big_english_3_wb`

## Purpose

Structural / integrity evidence for the whole-book audit checklist in `extraction-data-specification.md` §22, plus owner human-verification outcome.

## Automated validation summary

- Status: **PASSED_WITH_WARNINGS**
- Errors: 0
- Warnings: 4
- Info: 0

## Counts

| Array | Count |
|---|---:|
| `units` | 9 |
| `pages` | 129 |
| `vocabulary` | 284 |
| `language` | 79 |
| `activities` | 333 |
| `continuous_text` | 45 |
| `curriculum_components` | 86 |
| `relationships` | 43 |
| `extraction_issues` | 31 |
| `schema_gaps` | 1 |

## Coverage

- Expected units: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Present unit numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Missing units: none
- Printed page range in `pages`: 2–140
- Book metadata printed range: 2–140 (patched after merge from Unit 1 batch metadata)

## Integrity

- Structural integrity gate: **PASS**
- Automated structural validation: **PASSED_WITH_WARNINGS** (0 errors)

### Merge hygiene applied before PASS

- Units 3 / 6 / 7: rear grammar reference pages (printed 136 / 139 / 140) extend unit printed ranges for D008; causes non-blocking `UNIT_PRINTED_RANGES_OVERLAP` warnings vs later units (grammar pages are not contiguous with main unit blocks).
- Unit 5: removed invalid relationship `bep_plus_3_wb_rel_05_08` (non-existent printed page 138); recorded as open `possible_omission`.
- Mixed Studio entity ID prefixes preserved where non-colliding (D007); catalog `book_id` fields normalized at merge.
- Registry note: [`dataset-registry.md`](../dataset-registry.md) §8H.

### Structural warnings (non-blocking)

| Code | Message |
|---|---|
| `REQUIRED_BOOK_METADATA_NULL` | `source_filename` null |
| `UNIT_PRINTED_RANGES_OVERLAP` | Grammar-inclusive unit ranges overlap numerically with later units (U3/U4, U6/U7, U7/U8) |

## Uncertainty (preserved)

- `extraction_issues`: 31 (`audio_required` 29, `possible_omission` 1 for p.138 cross-ref, `other` 1)
- `schema_gaps`: 1

## Merge metadata

- `verification.status`: whole_book_audit_passed
- `verification.whole_book_audit`: passed
- Batches merged: 9
- `book.verification_status`: human_verified
- `dataset_versions` v1: verified, is_current

## Owner PDF spot-check

In `/app/validation` for Big English 3 Workbook:

1. Units 1–9 human-verified (owner) against source PDF (R2).
2. Grammar pages 136 / 139 / 140 on Units 3 / 6 / 7 accepted at HV.
3. Open audio issues accepted as documented debt.

**Owner reply (2026-10-09):** Units 1–9 HV passed in Validation.

## Verdict

| Gate | Result |
|---|---|
| Structural integrity | **PASS** |
| Automated validation | **PASSED WITH WARNINGS** (0 errors) |
| Owner human verification | **COMPLETE** |
| Owner PDF spot-check | **PASSED** (via prior unit HV) |
| **Whole-Book Audit** | **PASSED** |

Phase 1 for BE3-WB is **COMPLETE**. Project-wide Phase 1 is **8 / 18**.
