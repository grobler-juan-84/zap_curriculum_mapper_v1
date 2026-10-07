# RH2A — Canonical v1 Whole-Book Audit

**Status:** ACTIVE
**Version:** 1.2
**Date:** 2026-10-07
**Canonical path:** `reach-higher/reach_higher_2a/canonical/v1.json`
**Catalog book_id:** `reach_higher_2a`

## Purpose

Structural / integrity evidence for the whole-book audit checklist in `extraction-data-specification.md` §22, plus owner PDF spot-check outcome.

## Counts

| Array | Count |
|---|---:|
| `units` | 4 |
| `pages` | 278 |
| `vocabulary` | 226 |
| `language` | 68 |
| `activities` | 229 |
| `continuous_text` | 48 |
| `curriculum_components` | 85 |
| `relationships` | 44 |
| `extraction_issues` | 14 |
| `schema_gaps` | 5 |

## Coverage

- Expected units: 1, 2, 3, 4
- Present unit numbers: 1, 2, 3, 4
- Missing units: none
- Extra units: none
- Printed page range in `pages`: 2–279
- Structural integrity gate: **PASS**

## Integrity

- Duplicate entity IDs: none (required ID fields)
- Pages missing `printed_page`: 0
- Units missing page start/end: 0
- Pages referencing unknown `unit_id`: 0
- Structural integrity gate: **PASS**

## Uncertainty (preserved)

- `extraction_issues`: 14 (mostly audio / other — documented debt)
- `schema_gaps`: 5 (inquiry / reading prompts / glossary — classification evidence per schema review §7)

Open issues and schema gaps remain documented (not silently removed). Accepted as non-blocking debt for Phase 1 COMPLETE.

## Owner PDF spot-check

In `/app/validation` for Reach Higher 2A Student Book (unit-scoped canonical view).

**Owner reply (2026-10-07):** audit PASSED

## Verdict

| Gate | Result |
|---|---|
| Structural integrity | **PASS** |
| Owner PDF spot-check | **PASSED** |
| **Whole-Book Audit** | **PASSED** |

At the original audit, automated validation was **NOT RUN**. Retrospective validation on 2026-10-07: **PASSED WITH WARNINGS** (0 errors, 2 warnings). Historical whole-book/source audit outcome remains PASSED.
