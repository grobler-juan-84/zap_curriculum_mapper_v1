# BE5-SB — Canonical v1 Whole-Book Audit

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-09  
**Canonical path:** `big-english/big_english_5_sb/canonical/v1.json`  
**Catalog book_id:** `big_english_5_sb`

## Purpose

Structural / integrity evidence for the whole-book audit checklist in `extraction-data-specification.md` §22, plus owner human-verification outcome.

## Automated validation summary

- Status: **PASSED_WITH_WARNINGS**
- Errors: 0
- Warnings: 12
- Info: 0

## Counts

| Array | Count |
|---|---:|
| `units` | 9 |
| `pages` | 142 |
| `vocabulary` | 356 |
| `language` | 93 |
| `activities` | 372 |
| `continuous_text` | 65 |
| `curriculum_components` | 90 |
| `relationships` | 47 |
| `extraction_issues` | 23 |
| `schema_gaps` | 1 |

## Coverage

- Expected units: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Present unit numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Missing units: none
- Printed page range in `pages`: 4–159
- Book metadata printed range: 4–159 (patched after merge)
- Represented-page gaps (not unit batches): 52–57 and 106–111 (checkpoint / review sections between units)

## Integrity

- Structural integrity gate: **PASS**
- Automated structural validation: **PASSED_WITH_WARNINGS** (0 errors)

### Merge hygiene applied before PASS

- Unit 3 JSON repaired at staging (corrupt language/activity splice + quote sanitize); partial Activity 1 retained.
- Canonical `book.printed_page_start/end` patched to 4–159.
- Mixed Studio entity prefixes (`bep5_sb_*`, `bep_5_sb_*`, …) preserved (D007).
- Two Unit 3 relationships point at missing language IDs (`bep_5_u03_lang_05` / `_07`) — non-blocking warnings (possible extract omission from U03 repair).
- Registry note: [`dataset-registry.md`](../dataset-registry.md) §8K.

### Structural warnings (non-blocking)

| Code | Message |
|---|---|
| `REQUIRED_BOOK_METADATA_NULL` | `source_filename` null |
| `UNIT_PRINTED_RANGE_GAP` | Gaps 52–57 and 106–111 |
| `EXTERNAL_RELATIONSHIP_BOOK_ID_MISSING` | Unresolved U3 language endpoints lang_05 / lang_07 |
| `RELATIONSHIP_ENTITY_TYPE_UNKNOWN` | Plural type strings on some Unit 7 relationships |

## Uncertainty (preserved)

- `extraction_issues`: 23
- `schema_gaps`: 1

## Merge metadata

- `verification.status`: whole_book_audit_passed
- `verification.whole_book_audit`: passed
- Batches merged: 9
- `book.verification_status`: human_verified
- `dataset_versions` v1: verified, is_current

## Owner PDF spot-check

In `/app/validation` for Big English 5 Student Book:

1. Units 1–9 human-verified (owner) against source PDF (R2).
2. Printed gaps 52–57 and 106–111 accepted as checkpoint/review sections.
3. Open audio / unresolved-lang-ref / schema-gap issues accepted as documented debt.

**Owner reply (2026-10-09):** Units 1–9 HV passed in Validation.

## Verdict

| Gate | Result |
|---|---|
| Structural integrity | **PASS** |
| Automated validation | **PASSED WITH WARNINGS** (0 errors) |
| Owner human verification | **COMPLETE** |
| Owner PDF spot-check | **PASSED** (via prior unit HV) |
| **Whole-Book Audit** | **PASSED** |

Phase 1 for BE5-SB is **COMPLETE**. Project-wide Phase 1 is **11 / 18**.
