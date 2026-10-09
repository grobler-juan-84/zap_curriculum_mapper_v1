# BE6-SB — Canonical v1 Whole-Book Audit

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-09  
**Canonical path:** `big-english/big_english_6_sb/canonical/v1.json`  
**Catalog book_id:** `big_english_6_sb`

## Purpose

Structural / integrity evidence for the whole-book audit checklist in `extraction-data-specification.md` §22, plus owner human-verification outcome.

## Automated validation summary

- Status: **PASSED_WITH_WARNINGS**
- Errors: 0
- Warnings: 2
- Info: 0

## Counts

| Array | Count |
|---|---:|
| `units` | 9 |
| `pages` | 144 |
| `vocabulary` | 307 |
| `language` | 78 |
| `activities` | 352 |
| `continuous_text` | 62 |
| `curriculum_components` | 95 |
| `relationships` | 41 |
| `extraction_issues` | 27 |
| `schema_gaps` | 3 |

## Coverage

- Expected units: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Present unit numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Missing units: none
- Printed page range in `pages`: 4–159
- Book metadata printed range: 4–159 (patched after merge)
- Represented-page gaps (not unit batches): 52–57 and 106–111 (checkpoint / review sections)

## Integrity

- Structural integrity gate: **PASS**
- Automated structural validation: **PASSED_WITH_WARNINGS** (0 errors)

### Merge hygiene applied before PASS

- Unit 1: cleared `page_id` on 4 wordlist vocab rows pointing at missing `bep6_unit_01_p160` (notes cite Wordlist p.166); recorded as open `possible_omission`.
- Canonical `book.printed_page_start/end` patched to 4–159.
- Mixed Studio entity prefixes preserved (D007).
- Registry note: [`dataset-registry.md`](../dataset-registry.md) §8M.

### Structural warnings (non-blocking)

| Code | Message |
|---|---|
| `UNIT_PRINTED_RANGE_GAP` | Gaps 52–57 and 106–111 |

## Uncertainty (preserved)

- `extraction_issues`: 27 (`audio_required` 21, `possible_omission` 1 wordlist, `missing_source` 4, `ambiguous_instruction` 1)
- `schema_gaps`: 3

## Merge metadata

- `verification.status`: whole_book_audit_passed
- `verification.whole_book_audit`: passed
- Batches merged: 9
- `book.verification_status`: human_verified
- `dataset_versions` v1: verified, is_current

## Owner PDF spot-check

In `/app/validation` for Big English 6 Student Book:

1. Units 1–9 human-verified (owner) against source PDF (R2).
2. Printed gaps 52–57 and 106–111 accepted as checkpoint/review sections.
3. Open audio / wordlist-omission / schema-gap issues accepted as documented debt.

**Owner reply (2026-10-09):** Units 1–9 HV passed in Validation.

## Verdict

| Gate | Result |
|---|---|
| Structural integrity | **PASS** |
| Automated validation | **PASSED WITH WARNINGS** (0 errors) |
| Owner human verification | **COMPLETE** |
| Owner PDF spot-check | **PASSED** (via prior unit HV) |
| **Whole-Book Audit** | **PASSED** |

Phase 1 for BE6-SB is **COMPLETE**. Project-wide Phase 1 is **13 / 18**.
