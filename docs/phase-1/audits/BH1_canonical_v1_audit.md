# BH1 — Canonical v1 Whole-Book Audit

**Status:** ACTIVE
**Version:** 1.1
**Date:** 2026-10-07
**Canonical path:** `beehive/beehive_1_sb/canonical/v1.json`
**Catalog book_id:** `beehive_1_sb`

## Purpose

Structural / integrity evidence for the whole-book audit checklist in `Extraction_Data_Specification.md` §22, plus owner PDF spot-check outcome.

## Counts

| Array | Count |
|---|---:|
| `units` | 10 |
| `pages` | 120 |
| `vocabulary` | 249 |
| `language` | 74 |
| `activities` | 289 |
| `continuous_text` | 34 |
| `curriculum_components` | 94 |
| `relationships` | 46 |
| `extraction_issues` | 37 |
| `schema_gaps` | 10 |

## Coverage

- Expected units: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
- Present unit numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
- Missing units: none
- Extra units: none
- Printed page range in `pages`: 6–133
- Structural integrity gate: **PASS**

## Integrity

| Entity | Duplicate IDs | Missing ID field |
|---|---:|---:|
| `units` | 0 | 0 |
| `pages` | 0 | 0 |
| `vocabulary` | 0 | 0 |
| `language` | 0 | 0 |
| `activities` | 0 | 0 |
| `continuous_text` | 0 | 34 |
| `curriculum_components` | 0 | 0 |
| `relationships` | 0 | 0 |
| `extraction_issues` | 0 | 0 |
| `schema_gaps` | 0 | 0 |

- Pages missing `printed_page`: 0
- Units missing page start/end: 0
- Pages referencing unknown `unit_id`: 0
- Structural integrity gate: **PASS**

## Uncertainty (preserved)

- `extraction_issues`: 37 (mostly `audio_required` / `missing_source` — documented debt)
- `schema_gaps`: 10 (SEL / Think–Feel–Grow and related — classification evidence; not auto-promoted to universal schema)

Open issues and schema gaps remain documented (not silently removed). Accepted as non-blocking debt for Phase 1 COMPLETE.

## Owner PDF spot-check

In `/app/validation` for Beehive 1 (unit-scoped canonical view):

1. Page check — checked.
2. Vocabulary check — checked.
3. Spot-check sentence structure / language evidence — checked.

**Owner reply (2026-10-07):** audit PASSED (page check, vocab check, and spot-check sentence structure).

## Verdict

| Gate | Result |
|---|---|
| Structural integrity | **PASS** |
| Owner PDF spot-check | **PASSED** |
| **Whole-Book Audit** | **PASSED** |

Automated validation remains **NOT RUN** (documented non-blocking for this Phase 1 COMPLETE).
