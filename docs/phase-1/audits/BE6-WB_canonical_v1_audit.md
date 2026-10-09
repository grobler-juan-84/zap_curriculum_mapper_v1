# BE6-WB — Canonical v1 Whole-Book Audit

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-09  
**Canonical path:** `big-english/big_english_6_wb/canonical/v1.json`  
**Catalog book_id:** `big_english_6_wb`

## Purpose

Structural / integrity evidence for the whole-book audit checklist in `extraction-data-specification.md` §22, plus owner human-verification outcome.

## Automated validation summary

- Status: **PASSED_WITH_WARNINGS**
- Errors: 0
- Warnings: 10
- Info: 0

## Counts

| Array | Count |
|---|---:|
| `units` | 9 |
| `pages` | 128 |
| `vocabulary` | 275 |
| `language` | 63 |
| `activities` | 308 |
| `continuous_text` | 46 |
| `curriculum_components` | 79 |
| `relationships` | 53 |
| `extraction_issues` | 30 |
| `schema_gaps` | 1 |

## Coverage

- Expected units: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Present unit numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Missing units: none
- Printed page range in `pages`: 4–139
- Book metadata printed range: 4–139 (patched after merge)
- Unit range gap 90–91 (between U6 and U7)
- Grammar-inclusive overlaps: U3 (32–138) / U4 (48–139) with later units (accepted)

## Integrity

- Structural integrity gate: **PASS**
- Automated structural validation: **PASSED_WITH_WARNINGS** (0 errors)

### Merge hygiene applied before PASS

- Units 3 / 4: extended printed ranges for Extra Grammar Practice pages 138 / 139.
- Unit 8: remumbered colliding `bep6_wb_vocab_*` / `bep6_wb_lang_*` IDs (Studio counter reset vs Unit 3) to `big_english_6_wb_*`.
- Unit 8: remapped Studio unit shorthand `bep6_wb_u8` → `big_english_6_wb_unit_08`.
- Canonical `book.printed_page_start/end` patched to 4–139.
- Mixed Studio entity prefixes preserved except collision remumbers (D007).
- Registry note: [`dataset-registry.md`](../dataset-registry.md) §8N.

### Structural warnings (non-blocking)

| Code | Message |
|---|---|
| `RELATIONSHIP_ENTITY_TYPE_UNKNOWN` | `curriculum_components` / `book` type strings |
| `REQUIRED_BOOK_METADATA_NULL` | `source_filename` unresolved |
| `UNIT_PRINTED_RANGE_GAP` | Gap 90–91 |
| `UNIT_PRINTED_RANGES_OVERLAP` | Grammar-inclusive U3/U4 overlaps |

## Uncertainty (preserved)

- `extraction_issues`: 30 (`audio_required` 23, `visual_verification_required` 5, `ambiguous_instruction` 2)
- `schema_gaps`: 1 (`series_specific`)

## Merge metadata

- `verification.status`: whole_book_audit_passed
- `verification.whole_book_audit`: passed
- Batches merged: 9
- `book.verification_status`: human_verified
- `dataset_versions` v1: verified, is_current

## Owner PDF spot-check

In `/app/validation` for Big English 6 Workbook:

1. Units 1–9 human-verified (owner) against source PDF (R2).
2. Grammar pages 138/139 on Units 3/4 accepted (range overlaps).
3. Open audio / visual / schema-gap issues accepted as documented debt.

**Owner reply (2026-10-09):** Units 1–9 HV passed in Validation.

## Verdict

| Gate | Result |
|---|---|
| Structural integrity | **PASS** |
| Automated validation | **PASSED WITH WARNINGS** (0 errors) |
| Owner human verification | **COMPLETE** |
| Owner PDF spot-check | **PASSED** (via prior unit HV) |
| **Whole-Book Audit** | **PASSED** |

Phase 1 for BE6-WB is **COMPLETE**. Project-wide Phase 1 is **14 / 18**. Big English set (BE1–BE6 SB/WB) is closed.
