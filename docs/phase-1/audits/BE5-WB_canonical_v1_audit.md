# BE5-WB — Canonical v1 Whole-Book Audit

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-09  
**Canonical path:** `big-english/big_english_5_wb/canonical/v1.json`  
**Catalog book_id:** `big_english_5_wb`

## Purpose

Structural / integrity evidence for the whole-book audit checklist in `extraction-data-specification.md` §22, plus owner human-verification outcome.

## Automated validation summary

- Status: **PASSED_WITH_WARNINGS**
- Errors: 0
- Warnings: 7
- Info: 1

## Counts

| Array | Count |
|---|---:|
| `units` | 9 |
| `pages` | 127 |
| `vocabulary` | 311 |
| `language` | 70 |
| `activities` | 323 |
| `continuous_text` | 45 |
| `curriculum_components` | 82 |
| `relationships` | 51 |
| `extraction_issues` | 25 |
| `schema_gaps` | 4 |

## Coverage

- Expected units: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Present unit numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Missing units: none
- Printed page range in `pages`: 4–142
- Book metadata printed range: 4–142 (patched after merge)
- Gap 46–47 between Units 3 and 4

## Integrity

- Structural integrity gate: **PASS**
- Automated structural validation: **PASSED_WITH_WARNINGS** (0 errors)

### Merge hygiene applied before PASS

- Units 5 / 6 / 7: rear grammar pages (140 / 141 / 142) extend unit printed ranges for D008.
- Unit 2: remapped relationship vocab targets `bep_5_wb_u02_vocab_*` → `bep_5_wb_vocab_*`.
- Unit 3: Studio unit shorthand remapped; SB cross-ref tagged `target_book_id=big_english_5_sb`.
- Mixed Studio entity prefixes preserved (D007).
- Registry note: [`dataset-registry.md`](../dataset-registry.md) §8L.

### Structural warnings (non-blocking)

| Code | Message |
|---|---|
| `REQUIRED_BOOK_METADATA_NULL` | `source_filename` null |
| `UNIT_PRINTED_RANGE_GAP` | Gap 46–47 |
| `UNIT_PRINTED_RANGES_OVERLAP` | Grammar-inclusive U5/U6/U7 ranges |
| `RELATIONSHIP_ENTITY_TYPE_UNKNOWN` | `book` / `curriculum_components` type strings |

## Uncertainty (preserved)

- `extraction_issues`: 25
- `schema_gaps`: 4

## Merge metadata

- `verification.status`: whole_book_audit_passed
- `verification.whole_book_audit`: passed
- Batches merged: 9
- `book.verification_status`: human_verified
- `dataset_versions` v1: verified, is_current

## Owner PDF spot-check

In `/app/validation` for Big English 5 Workbook:

1. Units 1–9 human-verified (owner) against source PDF (R2).
2. Grammar pages 140 / 141 / 142 on Units 5 / 6 / 7 accepted at HV.
3. Open audio / schema-gap issues accepted as documented debt.

**Owner reply (2026-10-09):** Units 1–9 HV passed in Validation.

## Verdict

| Gate | Result |
|---|---|
| Structural integrity | **PASS** |
| Automated validation | **PASSED WITH WARNINGS** (0 errors) |
| Owner human verification | **COMPLETE** |
| Owner PDF spot-check | **PASSED** (via prior unit HV) |
| **Whole-Book Audit** | **PASSED** |

Phase 1 for BE5-WB is **COMPLETE**. Project-wide Phase 1 is **12 / 18**.
