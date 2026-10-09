# BE3-SB — Canonical v1 Whole-Book Audit

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-09  
**Canonical path:** `big-english/big_english_3_sb/canonical/v1.json`  
**Catalog book_id:** `big_english_3_sb`

## Purpose

Structural / integrity evidence for the whole-book audit checklist in `extraction-data-specification.md` §22, plus owner human-verification outcome.

## Automated validation summary

- Status: **PASSED_WITH_WARNINGS**
- Errors: 0
- Warnings: 3 (after book printed-range patch; batch preflight had `source_filename` null)
- Info: 0

## Counts

| Array | Count |
|---|---:|
| `units` | 9 |
| `pages` | 144 |
| `vocabulary` | 489 |
| `language` | 116 |
| `activities` | 372 |
| `continuous_text` | 55 |
| `curriculum_components` | 107 |
| `relationships` | 67 |
| `extraction_issues` | 37 |
| `schema_gaps` | 11 |

## Coverage

- Expected units: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Present unit numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Missing units: none
- Extra units: none
- Printed page range in `pages`: 4–159
- Book metadata printed range: 4–159 (patched from Unit 1 batch metadata after merge)
- Represented-page gaps (not unit batches): 52–57 and 106–111 (checkpoint / review sections between units)
- Source PDF omits printed **66–67** (Unit 4); recorded as open `missing_source` (D013). PDF indices for later units are offset by −2 (D014 viewer mapping).

## Integrity

- Structural integrity gate: **PASS**
- Automated structural validation: **PASSED_WITH_WARNINGS** (0 errors)
- Duplicate entity IDs after remumber: none

### Merge hygiene applied before PASS

- **Root cause:** Units 1–6 were extracted as ~8-page part pairs (and/or mid-book Studio chat resets) with mixed entity ID prefixes (`bep3_*`, `bep_sb_3_*`, …). Units 3–4 reused early counters and collided with Units 1–2.
- Units 3–4 colliding entity IDs remumbered to `big_english_3_sb_{vocab|lang|activity|text|component|relationship|issue}_*` continuing unique counters; internal references remapped; batches re-uploaded.
- Unit 2 invalid relationship `bep3_sb_rel_0002` (`workbook practice for` with `target_entity_id: null`) removed; recorded as open `possible_omission` (no invented workbook page entities).
- Canonical `book.printed_page_start/end` patched to 4–159 (merge had inherited Unit 1 batch range 4–19).
- Registry note: [`dataset-registry.md`](../dataset-registry.md) §8G.

### Structural warnings (non-blocking)

| Code | Message |
|---|---|
| `REQUIRED_BOOK_METADATA_NULL` | `source_filename` null |
| `UNIT_PRINTED_RANGE_GAP` | Gaps 52–57 and 106–111 |

## Uncertainty (preserved)

- `extraction_issues`: 37 (`audio_required` 27, `ambiguous_instruction` 4, `missing_source` 2 for printed pp. 66–67, `visual_verification_required` 2, `possible_omission` 1 workbook cross-ref, `source_erratum` 1)
- `schema_gaps`: 11

## Merge metadata

- `verification.status`: whole_book_audit_passed
- `verification.whole_book_audit`: passed
- Batches merged: 9
- `book.verification_status`: human_verified
- Mixed Studio entity prefixes preserved where non-colliding (D007); remumbered IDs use catalog prefix
- `dataset_versions` v1: verified, is_current

## Owner PDF spot-check

In `/app/validation` for Big English 3 Student Book:

1. Units 1–9 human-verified (owner) against available source PDF (`via r2`).
2. Units 5–9 page display confirmed correct after D014 (`pdf_page` navigation).
3. Open audio / missing-source / workbook-omission issues accepted as documented debt.

**Owner reply (2026-10-09):** Units 1–9 HV passed; page display re-check passed after D014.

## Verdict

| Gate | Result |
|---|---|
| Structural integrity | **PASS** |
| Automated validation | **PASSED WITH WARNINGS** (0 errors) |
| Owner human verification | **COMPLETE** |
| Owner PDF spot-check | **PASSED** |
| **Whole-Book Audit** | **PASSED** |

Phase 1 for BE3-SB is **COMPLETE** with documented missing-source exception for printed pp. 66–67 (D013). Project-wide Phase 1 is **not** complete (remaining books still open).
