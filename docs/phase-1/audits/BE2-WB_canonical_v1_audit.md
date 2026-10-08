# BE2-WB — Canonical v1 Whole-Book Audit

**Status:** ACTIVE  
**Version:** 1.3  
**Date:** 2026-10-08  
**Canonical path:** `big-english/big_english_2_wb/canonical/v1.json`  
**Catalog book_id:** `big_english_2_wb`

## Purpose

Structural / integrity evidence for the whole-book audit checklist in `extraction-data-specification.md` §22, plus owner human-verification outcome.

## Automated validation summary

- Status: **PASSED_WITH_WARNINGS**
- Errors: 0
- Warnings: 4
- Info: 0

## Counts

| Array | Count |
|---|---:|
| `units` | 9 |
| `pages` | 126 |
| `vocabulary` | 229 |
| `language` | 43 |
| `activities` | 296 |
| `continuous_text` | 43 |
| `curriculum_components` | 76 |
| `relationships` | 42 |
| `extraction_issues` | 19 |
| `schema_gaps` | 1 |

## Coverage

- Expected units: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Present unit numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9
- Missing units: none
- Extra units: none
- Printed page range in `pages`: 2–131
- Book metadata printed range: 2–147 (appendix/extra pages beyond 131 not extracted into unit batches)

## Integrity

- Structural integrity gate: **PASS**
- Automated structural validation: **PASSED_WITH_WARNINGS** (0 errors)
- Duplicate entity IDs after remumber: none

### Merge hygiene applied before PASS

- **Root cause:** Units 1–7 were extracted in one continuing Google AI Studio chat; Units 8–9 were started in **new chats** to free context. That mid-book reset (not Validation or merge tooling) caused the ID issues below.
- Units 8–9 had restarted entity ID counters (collided with Units 1–2). Remumbered to continue from Unit 7; internal references remapped; batches re-uploaded.
- Language IDs normalized to `big_english_plus_2_wb_lang_*` (Units 8–9 had used `_language_*`, matching the prompt template; Units 1–7 had used `_lang_`).
- Unit 8 relationship to unextracted appendix printed page 141 removed; recorded as open `possible_omission` (no invented appendix page content).
- Registry note: [`dataset-registry.md`](../dataset-registry.md) §8F.

### Structural warnings (non-blocking)

| Code | Message |
|---|---|
| `BOOK_PAGE_RANGE_DIFFERS_FROM_PAGES` | Book metadata 2–147 vs represented pages 2–131 |
| `REQUIRED_BOOK_METADATA_NULL` | `source_filename` null |
| `UNIT_PRINTED_RANGE_GAP` | Gaps 44–45 and 88–89 |

## Uncertainty (preserved)

- `extraction_issues`: 19 (`audio_required` 17, `uncertain_classification` 1, `possible_omission` 1 for appendix p.141)
- `schema_gaps`: 1

## Merge metadata

- `verification.status`: whole_book_audit_passed
- `verification.whole_book_audit`: passed
- Batches merged: 9
- `book.verification_status`: human_verified
- Extraction alias `big_english_plus_2_wb` normalized on `book_id` fields at merge (D007); entity ID prefixes preserved
- `dataset_versions` v1: verified, is_current

## Owner PDF spot-check

In `/app/validation` for Big English 2 Workbook:

1. Units 1–9 human-verified (owner) against available source PDF (`via r2`).
2. Open audio / classification / appendix-omission issues accepted as documented debt.

**Owner reply (2026-10-08):** audit PASSED (human verification complete prior to merge)

## Verdict

| Gate | Result |
|---|---|
| Structural integrity | **PASS** |
| Automated validation | **PASSED WITH WARNINGS** (0 errors) |
| Owner human verification | **COMPLETE** |
| Owner PDF spot-check | **PASSED** |
| **Whole-Book Audit** | **PASSED** |

Phase 1 for BE2-WB is **COMPLETE**. Project-wide Phase 1 is **not** complete (remaining books still open).
