# BE1-SB — Canonical v1 Whole-Book Audit

**Status:** ACTIVE
**Version:** 1.2
**Date:** 2026-10-07
**Canonical path:** `big-english/big_english_1_sb/canonical/v1.json`
**Catalog book_id:** `big_english_1_sb`

## Purpose

Structural / integrity evidence for the whole-book audit checklist in `extraction-data-specification.md` §22, plus owner PDF spot-check outcome.

## Counts

| Array | Count |
|---|---:|
| `units` | 9 |
| `pages` | 144 |
| `vocabulary` | 307 |
| `language` | 75 |
| `activities` | 390 |
| `continuous_text` | 47 |
| `curriculum_components` | 100 |
| `relationships` | 59 |
| `extraction_issues` | 39 |
| `schema_gaps` | 1 |

## Coverage

- Expected units: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Present unit numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Missing units: none
- Extra units: none
- Printed page range in `pages`: 10–165
- Book metadata printed range: 4–187
- Pages with `instructional: false`: 0
- Continuous text entries: 47
- Activities: 390

## Integrity

| Entity | Duplicate IDs | Missing ID field |
|---|---:|---:|
| `units` | 0 | 0 |
| `pages` | 0 | 0 |
| `vocabulary` | 0 | 0 |
| `language` | 0 | 0 |
| `activities` | 0 | 0 |
| `continuous_text` | 0 | 47 |
| `curriculum_components` | 0 | 0 |
| `relationships` | 0 | 0 |
| `extraction_issues` | 0 | 0 |
| `schema_gaps` | 0 | 0 |

- Pages missing `printed_page`: 0
- Units missing page start/end: 0
- Pages referencing unknown `unit_id`: 0
- Structural integrity gate: **PASS**

## Uncertainty (preserved)

- `extraction_issues`: 39
  - `audio_required`: 38
  - `visual_verification_required`: 1
- `schema_gaps`: 1
  - `activities`: 1

Open issues and schema gaps remain documented (not silently removed). Accepted as non-blocking debt for Phase 1 COMPLETE.

## Merge metadata

- `verification.status`: whole_book_audit_passed
- `verification.whole_book_audit`: passed
- Batches merged: 9

## Owner PDF spot-check

In `/app/validation` for Big English 1 Student Book (unit-scoped canonical view):

1. Unit 1 start / mid / end pages vs Pages list — checked.
2. Vocabulary spot-check — checked.
3. Open audio/visual extraction issues accepted as documented debt.

**Owner reply (2026-10-07):** audit PASSED

## Verdict

| Gate | Result |
|---|---|
| Structural integrity | **PASS** |
| Owner PDF spot-check | **PASSED** |
| **Whole-Book Audit** | **PASSED** |

At the original audit, automated validation was **NOT RUN**. Retrospective validation on 2026-10-07: **PASSED WITH WARNINGS** (0 errors, 4 warnings). Historical whole-book/source audit outcome remains PASSED.
