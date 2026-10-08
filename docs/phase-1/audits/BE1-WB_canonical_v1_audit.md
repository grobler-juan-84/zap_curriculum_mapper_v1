# BE1-WB — Canonical v1 Whole-Book Audit

**Status:** ACTIVE  
**Version:** 1.2  
**Date:** 2026-10-08  
**Canonical path:** `big-english/big_english_1_wb/canonical/v1.json`  
**Catalog book_id:** `big_english_1_wb`

## Purpose

Structural / integrity evidence for the whole-book audit checklist in `extraction-data-specification.md` §22, plus owner human-verification outcome. Includes the accepted Unit 9 missing-source exception (D013).

## Automated validation summary

- Status: **PASSED_WITH_WARNINGS**
- Errors: 0
- Warnings: 4
- Info: 0

## Counts

| Array | Count |
|---|---:|
| `units` | 9 |
| `pages` | 120 |
| `vocabulary` | 211 |
| `language` | 59 |
| `activities` | 276 |
| `continuous_text` | 34 |
| `curriculum_components` | 78 |
| `relationships` | 81 |
| `extraction_issues` | 20 |
| `schema_gaps` | 0 |

## Coverage

- Expected units: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Present unit numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Missing units: none
- Extra units: none
- Printed page range in `pages`: 6–135
- Book metadata printed range: 2–147
- Pages with `instructional: false`: 0
- Invented pages for printed 124–129: **0** (correctly absent)

## Integrity

| Entity | Duplicate IDs | Missing ID field |
|---|---:|---:|
| `units` | 0 | 0 |
| `pages` | 0 | 0 |
| `vocabulary` | 0 | 0 |
| `language` | 0 | 0 |
| `activities` | 0 | 0 |
| `continuous_text` | 0 | (entries without dedicated id field may exist) |
| `curriculum_components` | 0 | 0 |
| `relationships` | 0 | 0 |
| `extraction_issues` | 0 | 0 |
| `schema_gaps` | 0 | 0 |

- Structural integrity gate: **PASS**
- Automated structural validation: **PASSED_WITH_WARNINGS** (0 errors)

### Structural warnings (non-blocking)

| Code | Message |
|---|---|
| `BOOK_PAGE_RANGE_DIFFERS_FROM_PAGES` | Book metadata range 2–147 differs from represented pages 6–135 |
| `REQUIRED_BOOK_METADATA_NULL` | `source_filename` null |
| `UNIT_PRINTED_RANGE_GAP` | Gap between unit ranges 48–49 |
| `UNIT_PRINTED_RANGE_GAP` | Gap between unit ranges 92–93 |

## Uncertainty (preserved)

- `extraction_issues`: 20
  - `audio_required`: 19
  - `missing_source`: 1 (Unit 9 printed pages **124–129** absent from supplied PDF — **open**, accepted per D013)
- `schema_gaps`: 0

Open issues remain documented (not silently removed). Accepted as non-blocking debt for Phase 1 COMPLETE **with documented missing-source exception**.

## Accepted source exception (D013)

| Field | Value |
|---|---|
| Dataset | Big English 1 Workbook (`big_english_1_wb`) |
| Unit | 9 |
| Missing printed pages | 124–129 inclusive |
| Cause | Pages absent from supplied source PDF |
| Extraction | Correctly omitted unavailable content |
| Human verification | Approved for available PDF content only |
| Issue status | `missing_source` remains **open** |

## Merge metadata

- `verification.status`: whole_book_audit_passed
- `verification.whole_book_audit`: passed
- Batches merged: 9
- `book.verification_status`: human_verified
- `books.status` (Postgres): verified
- `dataset_versions` v1: verified, is_current

## Owner PDF spot-check

In `/app/validation` for Big English 1 Workbook:

1. Units 1–9 human-verified (owner) against available source PDF.
2. Unit 9 missing printed pages 124–129 confirmed as source-PDF gap (not extraction failure).
3. Open audio `extraction_issues` accepted as documented debt.

**Owner reply (2026-10-08):** audit PASSED (with D013 missing-source exception)

## Verdict

| Gate | Result |
|---|---|
| Structural integrity | **PASS** |
| Automated validation | **PASSED WITH WARNINGS** (0 errors) |
| Owner human verification | **COMPLETE** (available PDF content; U9 exception) |
| Owner PDF spot-check | **PASSED** |
| **Whole-Book Audit** | **PASSED** |

Phase 1 for BE1-WB is **COMPLETE with documented missing-source exception**. Project-wide Phase 1 is **not** complete (remaining books still open).
