# BE1-SB — Canonical v1 Whole-Book Audit (structural)

**Status:** ACTIVE
**Version:** 1.0
**Date:** 2026-10-07
**Canonical path:** `big-english/big_english_1_sb/canonical/v1.json`
**Catalog book_id:** `big_english_1_sb`

## Purpose

Structural / integrity evidence for the whole-book audit checklist in `Extraction_Data_Specification.md` §22.
This report does **not** by itself certify PDF visual fidelity. Owner PDF spot-check is still required.

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

Open issues and schema gaps must remain documented (not silently removed).

## Merge metadata

- `verification.status`: unit_batches_merged
- `verification.whole_book_audit`: not_started
- `verification.merged_at`: 2026-10-07T07:09:44.925Z
- Batches merged: 9

## Owner PDF spot-check checklist

In `/app/validation` for Big English 1 Student Book:

1. Unit 1 start / mid / end pages vs Pages list in the left panel.
2. One review / project / story-like section (use continuous_text or activities as a guide).
3. Confirm open audio/visual extraction issues are acceptable as documented debt (not blockers).

Reply in chat: **audit PASSED** or **audit NEEDS REVIEW** (+ notes).

## Structural verdict (agent)

Structural integrity checks **PASS**. Awaiting owner PDF spot-check for Whole-Book Audit status.
