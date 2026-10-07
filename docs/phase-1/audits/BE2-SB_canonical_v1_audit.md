# BE2-SB — Canonical v1 Whole-Book Audit

**Status:** ACTIVE
**Version:** 1.3
**Date:** 2026-10-07
**Canonical path:** `big-english/big_english_2_sb/canonical/v1.json`
**Catalog book_id:** `big_english_2_sb`

## Purpose

Structural / integrity evidence for the whole-book audit checklist in `Extraction_Data_Specification.md` §22, plus owner PDF spot-check outcome.

## Counts

| Array | Count |
|---|---:|
| `units` | 9 |
| `pages` | 147 |
| `vocabulary` | 301 |
| `language` | 56 |
| `activities` | 340 |
| `continuous_text` | 54 |
| `curriculum_components` | 90 |
| `relationships` | 25 |
| `extraction_issues` | 16 |
| `schema_gaps` | 0 |

## Coverage

- Expected units: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Present unit numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Missing units: none
- Extra units: none
- Printed page range in `pages`: 4–159 instructional units + appendix stickers 189–191
- Structural integrity gate: **PASS**

## Integrity

- Duplicate entity IDs: none (required ID fields)
- Pages missing `printed_page`: 0
- Units missing page start/end: 0
- Pages referencing unknown `unit_id`: 0
- Structural integrity gate: **PASS**

## Uncertainty (preserved)

- `extraction_issues`: 16 (mostly audio/visual — documented debt)
- `schema_gaps`: 0

Open issues remain documented (not silently removed). Accepted as non-blocking debt for Phase 1 COMPLETE.

## Owner PDF spot-check

In `/app/validation` for Big English 2 Student Book (unit-scoped canonical view).

**Owner reply (2026-10-07):** audit PASSED

## Verdict

| Gate | Result |
|---|---|
| Structural integrity | **PASS** |
| Owner PDF spot-check | **PASSED** |
| **Whole-Book Audit** | **PASSED** |

At the original audit, automated validation was **NOT RUN**. Retrospective validation initially **FAILED** on nine dangling `paired_with` targets to absent sticker pages. On 2026-10-07 those appendix pages (`bep2_p189`–`bep2_p191`, `unit_id` null) were added; revalidation is **PASSED WITH WARNINGS** (0 errors). Historical whole-book/source audit outcome remains PASSED.
