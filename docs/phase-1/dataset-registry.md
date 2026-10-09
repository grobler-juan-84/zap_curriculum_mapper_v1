# General Curriculum Mapper — Dataset Registry

**Status:** ACTIVE  
**Project:** General Curriculum Mapper  
**Purpose:** Track the curriculum sources used by the project and the Phase 1 processing status of each book.

---

# 1. Purpose

The Dataset Registry provides a single operational overview of the curriculum sources being processed by the General Curriculum Mapper.

It tracks:

- which books are available;
- which source files are available;
- which books have entered extraction;
- extraction progress;
- automated validation status;
- human verification status;
- whole-book audit status;
- canonical dataset status;
- schema version;
- open extraction issues;
- open schema gaps;
- and relevant processing notes.

The Registry does **not** contain the detailed curriculum data itself.

Detailed curriculum evidence belongs in the canonical Phase 1 datasets.

The Registry answers:

> **What do we have, where is it in the pipeline, and what still needs attention?**

---

# 2. Current Development Dataset

The initial development dataset contains:

| Series | Books | Count |
|---|---|---:|
| Beehive | Beehive 1–2 | 2 |
| Big English | Levels 1–6 Student Books + Workbooks | 12 |
| Reach Higher | 2A, 2B, 3A, 4A | 4 |
| **Total** |  | **18** |

These books serve two purposes:

1. create useful curriculum datasets for real teaching;
2. challenge and refine the General Curriculum Mapper architecture.

---

# 3. Current Processing Pipeline

Each source progresses broadly through:

```text
SOURCE AVAILABLE
↓
SOURCE REGISTERED
↓
STRUCTURE IDENTIFIED
↓
EXTRACTION
↓
AUTOMATED VALIDATION
↓
HUMAN VERIFICATION
↓
WHOLE-BOOK AUDIT
↓
CANONICAL DATASET
↓
PHASE 1 COMPLETE
```

A book does not need to move through every status in one uninterrupted sequence.

Issues discovered later may require returning to an earlier stage.

---

# 4. Status Vocabulary

To keep the Registry consistent, use the following working statuses where practical.

## Source Availability

```text
AVAILABLE
PARTIAL
NOT AVAILABLE
NEEDS CHECK
```

## Extraction Status

```text
NOT STARTED
IN PROGRESS
EXTRACTED
NEEDS REPROCESSING
```

## Automated Validation

```text
NOT RUN
PASSED
PASSED WITH WARNINGS
FAILED
```

## Human Verification

```text
NOT STARTED
IN PROGRESS
PARTIAL
COMPLETE
NEEDS REVIEW
```

`PARTIAL` means some units/batches have been human-accepted while others remain pending or need review (use book notes / `book_files.status` for detail).

## Whole-Book Audit

```text
NOT STARTED
IN PROGRESS
PASSED
NEEDS REVIEW
```

## Canonical Dataset

```text
NOT CREATED
IN PROGRESS
CREATED
NEEDS REBUILD
```

## Phase 1 Status

```text
NOT STARTED
IN PROGRESS
COMPLETE
BLOCKED
```

These statuses may evolve if real processing demonstrates that additional distinctions are useful.

---

# 5. Schema Version

Every processed book must record the Phase 1 schema version used.

Example:

```text
0.1
```

If the schema changes during extraction, record the version used by the current canonical dataset.

Do not silently assume that all books use the latest schema.

If an older dataset requires migration or reprocessing, record that explicitly.

---

# 6. Initial Dataset Registry

| ID | Series | Level | Book Type | Source | Extraction | Validation | Human Verification | Whole-Book Audit | Canonical JSON | Schema | Open Issues | Schema Gaps | Phase 1 |
|---|---|---|---|---|---|---|---|---|---|---|---:|---:|---|
| BH1 | Beehive | 1 | Book | AVAILABLE | EXTRACTED | PASSED WITH WARNINGS | COMPLETE | PASSED | CREATED | 0.1 | 37 | 10 | COMPLETE |
| BH2 | Beehive | 2 | Book | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE1-SB | Big English | 1 | Student Book | AVAILABLE | EXTRACTED | PASSED WITH WARNINGS | COMPLETE | PASSED | CREATED | 0.1 | 39 | 1 | COMPLETE |
| BE1-WB | Big English | 1 | Workbook | AVAILABLE | EXTRACTED | PASSED WITH WARNINGS | COMPLETE | PASSED | CREATED | 0.1 | 20 | 0 | COMPLETE |
| BE2-SB | Big English | 2 | Student Book | AVAILABLE | EXTRACTED | PASSED WITH WARNINGS | COMPLETE | PASSED | CREATED | 0.1 | 16 | 0 | COMPLETE |
| BE2-WB | Big English | 2 | Workbook | AVAILABLE | EXTRACTED | PASSED WITH WARNINGS | COMPLETE | PASSED | CREATED | 0.1 | 19 | 1 | COMPLETE |
| BE3-SB | Big English | 3 | Student Book | AVAILABLE | EXTRACTED | PASSED WITH WARNINGS | COMPLETE | PASSED | CREATED | 0.1 | 37 | 11 | COMPLETE |
| BE3-WB | Big English | 3 | Workbook | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE4-SB | Big English | 4 | Student Book | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE4-WB | Big English | 4 | Workbook | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE5-SB | Big English | 5 | Student Book | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE5-WB | Big English | 5 | Workbook | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE6-SB | Big English | 6 | Student Book | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE6-WB | Big English | 6 | Workbook | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| RH2A | Reach Higher | 2A | Book | AVAILABLE | EXTRACTED | PASSED WITH WARNINGS | COMPLETE | PASSED | CREATED | 0.1 | 14 | 5 | COMPLETE |
| RH2B | Reach Higher | 2B | Book | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| RH3A | Reach Higher | 3A | Book | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| RH4A | Reach Higher | 4A | Book | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |

---

# 7. Important Source Note

`AVAILABLE` means the curriculum source is currently available for use by the project.

It does **not** mean that:

- the source has been registered;
- its metadata has been verified;
- its page structure has been identified;
- or extraction has begun.

These are separate processing states.

---

# 8. Book Record Template

Where more detail is required than the master table can comfortably contain, use the following book-level record.

```markdown
## Book Record

**Registry ID:**  
**Series:**  
**Level:**  
**Book Type:**  
**Publisher:**  
**Edition:**  

### Source

**Source Availability:**  
**Source Filename:**  
**Source Format:**  
**PDF Page Count:**  
**Printed Page Range:**  
**Source Notes:**  

### Phase 1 Processing

**Source Registration:**  
**Structure Identification:**  
**Extraction Status:**  
**Extraction Batches Planned:**  
**Extraction Batches Complete:**  
**Automated Validation:**  
**Human Verification:**  
**Whole-Book Audit:**  
**Canonical Dataset:**  
**Phase 1 Status:**  

### Schema

**Schema Version:**  
**Migration Required:**  
**Reprocessing Required:**  

### Issues

**Open Extraction Issues:**  
**Open Schema Gaps:**  
**Blocking Issues:**  

### Files

**Canonical JSON:**  
**Google Sheets View:**  
**React Dataset Available:**  

### Notes

-
```

Book-level records should only be expanded when they provide useful operational information.

Do not duplicate detailed curriculum evidence from the canonical dataset.

---

# 8A. BH1 — Beehive 1 Student Book (active)

**Registry ID:** BH1  
**Series:** Beehive (Beehive American)  
**Level:** 1  
**Book Type:** Student Book  
**book_id:** `beehive_1_sb`

### Source

**Source Availability:** AVAILABLE  
**Source Filename:** `Beehive American Student Book 1.pdf`  
**Source Format:** PDF  
**PDF Page Count:** 135  

### Phase 1 Processing

**Extraction Status:** EXTRACTED (unit batches `01–10`)  
**Batch Path:** `data/phase1/beehive_1_sb/`  
**Automated Validation:** PASSED WITH WARNINGS (retrospective 2026-10-07; 0 errors, 21 warnings — 16 workbook references lack `target_book_id`, plus page-range diagnostics)
**Human Verification:** COMPLETE  
**Verification Notes:** Units 1 and 4 PDF-checked; Units 2–3 and 5–8 marked human-verified by project decision after accepting extraction quality. Units 9–10 (At Home / At the Farm) human-verified in Validation (2026-10-07); all unit `book_files.status` = `verified`.  
**Whole-Book Audit:** PASSED (2026-10-07; structural PASS + owner PDF spot-check: pages, vocab, sentence structure)  
**Canonical Dataset:** CREATED (`beehive/beehive_1_sb/canonical/v1.json`; `dataset_versions` v1 `is_current`, status `verified`)  
**Phase 1 Status:** COMPLETE  

### Schema / Issues

**Schema Version:** 0.1  
**Open Issues:** 37 (mostly `audio_required` / `missing_source` workbook refs — documented in canonical; left open)  
**Schema Gaps:** 10 (recurring SEL / Think–Feel–Grow and related — classification evidence per schema review §7)  

### Notes

- Canonical merge completed 2026-10-07 via `scripts/merge_canonical_book.mjs` (10 units, 120 pages, 249 vocab, 74 language, 289 activities). `book_id` fields normalized to catalog `beehive_1_sb` (alias `beehive_american_sb1` rewritten). Entity ID prefixes preserved.
- Whole-book audit evidence: [`audits/BH1_canonical_v1_audit.md`](./audits/BH1_canonical_v1_audit.md) — **PASSED** (owner reply 2026-10-07).
- Second book to reach Phase 1 COMPLETE (after BE1-SB).

---

# 8B. BE1-SB — Big English 1 Student Book (active)

**Registry ID:** BE1-SB  
**Series:** Big English (extracted metadata may say Big English Plus)  
**Level:** 1  
**Book Type:** Student Book  
**Folder / files:** `data/phase1/big_english_1_sb/`  
**Internal book_id in JSON:** catalog `big_english_1_sb` after merge normalization; extraction alias `bep1_sb` (entity IDs may still use `bep1_*` prefixes — see [`book-id-alias-map.md`](./book-id-alias-map.md) / D007)

### Phase 1 Processing

**Extraction Status:** EXTRACTED (unit batches `01–09`)  
**Automated Validation:** PASSED WITH WARNINGS (retrospective 2026-10-07; 0 errors, 4 warnings — page metadata/range diagnostics)
**Human Verification:** COMPLETE  
**Verification Notes:** All unit batches reviewed and accepted by project decision (2026-10-02).  
**Whole-Book Audit:** PASSED (2026-10-07; structural PASS + owner PDF spot-check)  
**Canonical Dataset:** CREATED (`big-english/big_english_1_sb/canonical/v1.json`; `dataset_versions` v1 `is_current`, status `verified`)  
**Phase 1 Status:** COMPLETE  

### Schema / Issues

**Schema Version:** 0.1  
**Open Issues:** 39 (mostly audio/visual verification — documented, left open; carried into canonical v1)  
**Schema Gaps:** 1 (Think Big sub-feature — pending schema review; related to Beehive SEL/reflection gaps)

### Notes

- First canonical merge completed 2026-10-07 via `scripts/merge_canonical_book.mjs` (9 units, 144 pages, 307 vocab, 75 language, 390 activities). Entity IDs preserved (`bep1_*` prefixes).
- `book_id` fields normalized to catalog `big_english_1_sb` (2026-10-07; 1172 fields rewritten from alias `bep1_sb`) via D007 / [`book_id_aliases.json`](./book_id_aliases.json).
- Whole-book audit evidence: [`audits/BE1-SB_canonical_v1_audit.md`](./audits/BE1-SB_canonical_v1_audit.md) — **PASSED** (owner reply 2026-10-07).
- First book to reach Phase 1 COMPLETE. Remaining pilot canonical merges must use merge-time book_id normalization.

---

# 8C. BE2-SB — Big English 2 Student Book (active)

**Registry ID:** BE2-SB  
**Series:** Big English (extracted metadata may say Big English Plus)  
**Level:** 2  
**Book Type:** Student Book  
**Folder / files:** `data/phase1/big_english_2_sb/`  
**Internal book_id in JSON:** extraction alias `bep_sb_2` → normalize to catalog `big_english_2_sb` at merge ([`book-id-alias-map.md`](./book-id-alias-map.md))

### Phase 1 Processing

**Extraction Status:** EXTRACTED (unit batches `01–09`)  
**Automated Validation:** PASSED WITH WARNINGS (patched 2026-10-07; 0 errors after adding appendix sticker pages `bep2_p189`–`bep2_p191`; remaining warnings: unit review-page gaps + stale merged batch status metadata)
**Human Verification:** COMPLETE  
**Verification Notes:** All unit batches reviewed and accepted by project decision (2026-10-05). Unit 2 re-extracted and restored (pages/vocabulary/language); truncation issue cleared.  
**Whole-Book Audit:** PASSED (2026-10-07; structural PASS + owner PDF spot-check)  
**Canonical Dataset:** CREATED (`big-english/big_english_2_sb/canonical/v1.json`; `dataset_versions` v1 `is_current`, status `verified`)  
**Phase 1 Status:** COMPLETE  

### Schema / Issues

**Schema Version:** 0.1  
**Open Issues:** 16 (mostly audio/visual verification — documented in canonical; left open)  
**Schema Gaps:** 0  

### Notes

- Canonical merge completed 2026-10-07 via `scripts/merge_canonical_book.mjs` (9 units, 144 pages, 301 vocab, 56 language, 340 activities). `book_id` fields normalized to catalog `big_english_2_sb` (1036 fields from alias `bep_sb_2`). Entity ID prefixes preserved (`bep2_*`).
- Unit `book_files.status` re-aligned to `verified` after merge (had drifted to `pending`).
- Whole-book audit evidence: [`audits/BE2-SB_canonical_v1_audit.md`](./audits/BE2-SB_canonical_v1_audit.md) — **PASSED** (owner reply 2026-10-07).
- 2026-10-07 structural triage: added appendix sticker pages `bep2_p189`–`bep2_p191` (`unit_id` null, `section_type: appendix_stickers`) so Activity 11 `paired_with` relationships resolve. Canonical now has 147 pages; automated validation **PASSED WITH WARNINGS**.
- Third book to reach Phase 1 COMPLETE (after BE1-SB and BH1).

---

# 8D. RH2A — Reach Higher 2A Student Book (active)

**Registry ID:** RH2A  
**Series:** Reach Higher  
**Level:** 2A  
**Book Type:** Student Book  
**Folder / files:** `data/phase1/reach_higher_2a/`  
**Internal book_id in JSON:** mixed aliases `rh_2a` / `reach_higher_2a` → normalize to catalog `reach_higher_2a` at merge ([`book-id-alias-map.md`](./book-id-alias-map.md))

### Phase 1 Processing

**Extraction Status:** EXTRACTED (units `1–4`; Unit 4 consolidated to `rh2a_sb_unit4.json` from former part1/part2 split)
**Automated Validation:** PASSED WITH WARNINGS (retrospective 2026-10-07; 0 errors, 2 warnings — one duplicate printed-page number and stale book-level verification status)
**Human Verification:** COMPLETE
**Verification Notes:** Units 1–3 reviewed and accepted (2026-10-05). Unit 4 merged into one file (2026-10-06) and human-verified in Validation (2026-10-07); all unit `book_files.status` = `verified`. Continuous-text stories may remain structurally summarized rather than full recitation (documented open issues).
**Whole-Book Audit:** PASSED (2026-10-07; structural integrity + owner PDF spot-check — [`audits/RH2A_canonical_v1_audit.md`](./audits/RH2A_canonical_v1_audit.md))
**Canonical Dataset:** CREATED (`reach-higher/reach_higher_2a/canonical/v1.json`; `dataset_versions` v1 `is_current`, status `verified`)
**Phase 1 Status:** COMPLETE

### Schema / Issues

**Schema Version:** 0.1
**Open Issues:** 14 (includes Unit 4 audio/citation-workaround notes; documented in canonical; left open — non-blocking)
**Schema Gaps:** 5 (Big Question / inquiry, intermittent reading prompts, glossary definitions — classification evidence per schema review §7)

### Notes

- Canonical merge completed 2026-10-07 via `scripts/merge_canonical_book.mjs` (4 units, 278 pages, 226 vocab, 68 language, 229 activities). `book_id` fields normalized to catalog `reach_higher_2a` (715 fields from alias `rh_2a`). Entity ID prefixes preserved.
- Whole-book audit PASSED 2026-10-07; `dataset_versions` marked `verified`.
- Unit 4 part1/part2 batch files were merged into `rh2a_sb_unit4.json` (pp. 212–279) before canonical merge.
- Source PDF in private `book-sources` (`reach-higher/reach_higher_2a/source.pdf`) replaced 2026-10-07 with the full Student Book file (was previously units 1–2 only).
- Reach Higher remains a structural stress test; Beehive / Big English are higher-priority school curriculum sources (see §14).

---

# 8E. BE1-WB — Big English 1 Workbook

**Registry ID:** BE1-WB  
**Series:** Big English  
**Level:** 1  
**Book Type:** Workbook  
**book_id:** `big_english_1_wb`

### Source

**Source Availability:** AVAILABLE  
**Source Format:** PDF  
**PDF Page Count:** 142 (as recorded in unit batches)  
**Printed Page Range:** 2–147 (as recorded in unit batches)  
**Source Notes:** Supplied source PDF omits printed pages **124–129** (Unit 9). Physical PDF jumps from printed 123 → printed 130. Missing pages are a **source-PDF exception**, not an AI extraction failure (D013).

### Phase 1 Processing

**Extraction Status:** EXTRACTED (unit batches `01–09`)  
**Batch Path:** `data/phase1/big_english_1_wb/` (local working copies; Storage `book-datasets` is source of truth after upload)  
**Source PDF:** R2 `big-english/big_english_1_wb/source.pdf` (D012)  
**Automated Validation:** PASSED WITH WARNINGS (2026-10-08; 0 errors, 4 warnings — book page-range vs represented pages, null `source_filename`, unit range gaps 48–49 and 92–93)  
**Human Verification:** COMPLETE (available PDF content; Units 1–9; all unit `book_files.status` = `verified`; `book.verification_status` = `human_verified`; `books.status` = `verified`)  
**Verification Notes:** Approval covers all **available** source-PDF content. Printed pages 124–129 remain unextracted/unverified (`missing_source` left **open** per D013).  
**Whole-Book Audit:** PASSED (2026-10-08; structural PASS + owner HV; see [`audits/BE1-WB_canonical_v1_audit.md`](./audits/BE1-WB_canonical_v1_audit.md))  
**Canonical Dataset:** CREATED (`big-english/big_english_1_wb/canonical/v1.json`; `dataset_versions` v1 `is_current`, status `verified`)  
**Phase 1 Status:** COMPLETE **with documented missing-source exception**  

### Schema / Issues

**Schema Version:** 0.1  
**Open Issues:** 20 (`audio_required` 19 + `missing_source` 1 for printed pp. 124–129). Missing pages accepted as non-blocking completeness debt (D013).  
**Schema Gaps:** 0  

### Notes

- Canonical merge 2026-10-08: 9 units, 120 pages, 211 vocab, 59 language, 276 activities. No page records for printed 124–129.
- Do not invent page/activity/vocabulary records for printed 124–129 until a complete source PDF is available.
- PDF viewer printed-page ↔ PDF-index navigation mismatch when pages are absent remains deferred (F015).

---

# 8F. BE2-WB — Big English 2 Workbook

**Registry ID:** BE2-WB  
**Series:** Big English  
**Level:** 2  
**Book Type:** Workbook  
**book_id:** `big_english_2_wb`

### Source

**Source Availability:** AVAILABLE  
**Source Format:** PDF  
**Source PDF:** R2 `big-english/big_english_2_wb/source.pdf` (D012)  
**Printed page range in `pages`:** 2–131 (book metadata also records 2–147; appendix beyond 131 not fully extracted)

### Phase 1 Processing

**Extraction Status:** EXTRACTED (unit batches `01–09`)  
**Batch Path:** `data/phase1/big_english_2_wb/` (local working copies; Storage `book-datasets` is source of truth after upload)  
**Automated Validation:** PASSED WITH WARNINGS (2026-10-08; 0 errors)  
**Human Verification:** COMPLETE (Units 1–9; Validation PDF via R2)  
**Whole-Book Audit:** PASSED (2026-10-08; see [`audits/BE2-WB_canonical_v1_audit.md`](./audits/BE2-WB_canonical_v1_audit.md))  
**Canonical Dataset:** CREATED (`big-english/big_english_2_wb/canonical/v1.json`; `dataset_versions` v1 `is_current`, status `verified`)  
**Phase 1 Status:** COMPLETE  

### Extraction notes (Google AI Studio workflow)

- **Prior books** in this project were typically extracted in **one** Google AI Studio chat using one PDF and [`google-ai-studio-prompt.md`](./google-ai-studio-prompt.md) for all units.
- **BE2-WB:** Units **1–7** used that continuing-chat approach; Units **8–9** were extracted in **new Studio chats** to free context.
- **Observed effects:** Units 8–9 restarted entity ID counters (collided with earlier units) and used `_language_` while Units 1–7 used `_lang_`. Fixed at merge (remumber + slug normalize); not a Validation/merge tooling defect.
- Extraction alias `big_english_plus_2_wb` / entity prefix `big_english_plus_2_wb_*` preserved; catalog remains `big_english_2_wb` (D007).

### Schema / Issues

**Schema Version:** 0.1  
**Open Issues:** 19 (mostly `audio_required`; plus `possible_omission` for unextracted appendix printed page 141)  
**Schema Gaps:** 1  

### Notes

- Canonical merge 2026-10-08: 9 units, 126 pages, 229 vocab, 43 language, 296 activities.
- When starting a mid-book new Studio chat, carry forward entity ID counters and keep the same ID slug forms (see prompt identifier caution).

---

# 8G. BE3-SB — Big English 3 Student Book

**Registry ID:** BE3-SB  
**Series:** Big English  
**Level:** 3  
**Book Type:** Student Book  
**book_id:** `big_english_3_sb`

### Source

**Source Availability:** AVAILABLE  
**Source Format:** PDF  
**Source PDF:** R2 `big-english/big_english_3_sb/source.pdf` (D012; local `app/src/assets/books/big-english/big_english_3_sb.pdf`)  
**Source Notes:** Supplied PDF omits printed pages **66–67** (Unit 4). Physical PDF jumps from printed 65 → 68, so Units 5–9 sit 2 PDF indices before their printed numbers. Accepted as a source-PDF exception (D013); no re-scan. Validation viewer handles the offset via extracted `pdf_page` (D014).

### Phase 1 Processing

**Extraction Status:** EXTRACTED (unit batches `01–09` in Storage `book-datasets`)  
**Batch Path:** `data/phase1/big_english_3_sb/` (local working copies; Storage is source of truth after upload)  
**Automated Validation:** PASSED WITH WARNINGS (2026-10-09; 0 errors — `source_filename` null; unit range gaps 52–57 and 106–111)  
**Human Verification:** COMPLETE 2026-10-09 (Units 1–9 `book_files.status` = `verified`; entity `verification_status` = `human_verified`; `books.status` = `verified`)  
**Verification Notes:** Owner confirmed vocab/grammar/content correct for all units and page display correct after D014. Printed pp. 66–67 remain open `missing_source` in Unit 4 (D013).  
**Whole-Book Audit:** PASSED (2026-10-09; see [`audits/BE3-SB_canonical_v1_audit.md`](./audits/BE3-SB_canonical_v1_audit.md))  
**Canonical Dataset:** CREATED (`big-english/big_english_3_sb/canonical/v1.json`; `dataset_versions` v1 `is_current`, status `verified`)  
**Phase 1 Status:** COMPLETE **with documented missing-source exception** (printed pp. 66–67)  

### Schema / Issues

**Schema Version:** 0.1  
**Open Issues:** 37 (`audio_required` 27 + `missing_source` 2 for printed pp. 66–67 + other review debt). Missing pages accepted as non-blocking completeness debt (D013).  
**Schema Gaps:** 11  

### Extraction notes

- Units 1–6: Studio JSON size limits → split each unit into two ~8-page parts; merged locally via `scripts/merge_be3sb_unit_parts.mjs`.
- Units 7–9: whole-unit Studio exports (no part split).
- Uploaded 2026-10-09; HV COMPLETE same day; Units 5–9 PDF display offset fixed via D014.
- Merge hygiene: remumbered Units 3–4 colliding entity IDs; removed Unit 2 null-target workbook relationship → open `possible_omission`.
- Canonical merge 2026-10-09: 9 units, 144 pages, 489 vocab, 116 language, 372 activities.
- Mixed Studio entity prefixes preserved where non-colliding (D007); remumbered IDs use catalog prefix.
- Unit 4 carries open `missing_source` for printed pp. 66–67 (D013).

---

# 9. Extraction Batch Tracking

During active extraction, individual books may require batch-level tracking.

When using **`google-ai-studio-prompt.md`** with a complete textbook PDF, expect one JSON batch file per unit (or equivalent major instructional section), typically named like `<book_id>_unit_01.json`, until approved batches are merged into the canonical book dataset.

Example:

| Batch ID | Unit / Section | Page Range | Extraction | Validation | Human Verification | Issues |
|---|---|---|---|---|---|---:|
| BE1-SB-U01 | Unit 1 | TBD | NOT STARTED | NOT RUN | NOT STARTED | — |
| BE1-SB-U02 | Unit 2 | TBD | NOT STARTED | NOT RUN | NOT STARTED | — |

Batch tracking can be maintained:

- temporarily in this document;
- in Google Sheets;
- or eventually by the ingestion application.

The Dataset Registry should remain the high-level source of truth for book status.

---

# 10. Open Issues

The `Open Issues` count should represent unresolved extraction or dataset problems associated with the book.

Examples include:

- uncertain vocabulary classification;
- missing audio;
- visual verification required;
- page identity uncertainty;
- possible omissions;
- broken relationships;
- missing source material;
- validation failures;
- or manual review requirements.

Detailed issue records belong in the canonical dataset or associated processing records.

The Registry only needs the current count and major blocking notes.

---

# 11. Schema Gaps

The `Schema Gaps` count records unresolved proposals created because the current schema may not adequately represent important source content.

Example:

```text
Open Schema Gaps: 3
```

A high number of schema gaps during early cross-series testing is not automatically a problem.

The purpose of the initial dataset is partly to discover these gaps.

However, schema gaps should be reviewed before large-scale extraction continues if they suggest a fundamental structural weakness.

---

# 12. Blocking Issues

Some problems may prevent a book from progressing.

Examples:

- incomplete source;
- unreadable pages;
- extraction repeatedly failing;
- major schema limitation;
- incorrect source version;
- unresolved book structure;
- or a required migration.

Where a blocking issue exists:

```text
Phase 1 Status: BLOCKED
```

and record a short explanation.

---

# 13. Current Cross-Series Pilot

Before aggressively processing all 18 books, the initial Phase 1 architecture should be challenged using representative books from each series.

## Pilot Books

| Order | Book | Purpose | Status |
|---:|---|---|---|
| 1 | Beehive 1 | Existing conceptual baseline / first schema test | **Phase 1 COMPLETE** (canonical v1 + whole-book audit PASSED 2026-10-07) |
| 2 | Big English 1 | Current school curriculum / full-series architecture test | **Phase 1 COMPLETE** (canonical v1 + whole-book audit PASSED 2026-10-07) |
| 3 | Reach Higher 2A | Cross-series structural stress test | **Phase 1 COMPLETE** (canonical v1 + whole-book audit PASSED 2026-10-07) |
| 4 | Big English 2 SB | Extra vertical check (same publisher, next level) | **Phase 1 COMPLETE** (canonical v1 + whole-book audit PASSED 2026-10-07) |
| 5 | Schema Review | Review findings across pilot series | **0.2 DEFERRED** — post-pilot candidate in [`cross-series-schema-review-notes.md`](./cross-series-schema-review-notes.md) §11 (2026-10-07); schema remains 0.1 |

**Infrastructure (pilot books):** unit-batch / canonical JSON remain in private Supabase Storage (`book-datasets`); cover images remain in `book-assets`. Textbook **source PDFs** for all four cataloged pilots are on Cloudflare R2 `book-sources` at the same object keys (Stage E PASS 2026-10-08 — SHA-256 verified; see [`../10-storage-architecture.md`](../10-storage-architecture.md)). Validation loads PDFs **R2-first** via same-origin proxy with Supabase dual-read fallback; Supabase PDF originals are preserved (not deleted). `book_files` rows were not rewritten. Local `data/phase1/` copies are optional working files (gitignored).

The exact extraction sequence may change if practical testing provides a reason.

The important principle is:

> **Expose the schema to different textbook structures early.**

---

# 14. Pilot Decision Point

After representative extraction from:

```text
Beehive 1
+
Big English 1
+
Reach Higher 2A
```

(+ Big English 2 SB as an additional extracted/verified Student Book)

perform a schema review before large-scale processing of the remaining books.

### Extraction quality checkpoint (2026-10-07)

**Project judgement (owner + Validation spot-checks):** first-iteration Phase 1 extraction quality is **satisfactory for continuing development**.

Observed for the pilot set:

- page coverage is accurate enough for verification;
- vocabulary extraction is accurate enough;
- important language / sentence structures are captured to a satisfactory level.

**Priorities going forward:** Beehive and Big English remain the higher-priority curriculum sources; Reach Higher remains valuable as a structurally different stress test.

**All four Storage-backed pilots remain Phase 1 COMPLETE** (BE1-SB, BH1, BE2-SB, RH2A — canonical v1 + whole-book audit PASSED). Automated structural validation now reports **PASSED WITH WARNINGS** for all four after BE2-SB appendix sticker pages `bep2_p189`–`bep2_p191` were added (2026-10-07). Schema review working recommendations are owner-accepted. The post-pilot 0.2 candidate (2026-10-07) **defers** a schema bump; schema remains 0.1.

Phase 1 remains iterative: later linguistic interpretation or curriculum mapping may expose missing evidence and require returning to Phase 1.

Review:

- vocabulary structure;
- language structure;
- activity representation;
- continuous text;
- curriculum components;
- publisher-specific structures;
- relationships;
- source traceability;
- extraction issues;
- schema gaps;
- Google Sheets usability;
- and React usability.

Then decide whether:

```text
CONTINUE
```

or:

```text
ADJUST SCHEMA / EXTRACTION PROCESS
↓
RE-TEST
↓
CONTINUE
```

This checkpoint exists to prevent us from processing all 18 books using a schema that early evidence has already shown to be inadequate.

---

# 15. Recommended Processing Order After Pilot

**Status:** DRAFT — practical default, not a locked decision.

**Owner adjustment (2026-10-08):** After BE1-WB, continue with **Big English** first (next: **BE2-WB**) because the local BE PDF set is the most complete. BH2 / RH2B remain in the draft table but are deferred until the owner pulls them forward.

The pilot is complete and schema 0.2 was deferred. Continue on schema 0.1, using the D008 validator and the existing human/source audit gates. The order deliberately:

- starts with a Workbook so Student Book ↔ Workbook relationships are tested before scaling;
- keeps Beehive and Big English as the higher-priority curriculum sources;
- brings Reach Higher back at intervals as a structural stress test;
- processes later Big English levels as Student Book / Workbook pairs;
- avoids extracting all books from one series before checking another.

## Draft Remaining-Book Order (14 books)

| Order | Registry ID | Book | Why here |
|---:|---|---|---|
| 1 | BE1-WB | Big English 1 Workbook | First Workbook test; closes the BE1 pair and validates cross-book relationship handling against a trusted SB canonical. |
| 2 | BH2 | Beehive 2 | High-priority vertical check; tests whether Beehive SEL / recurring component representation remains consistent at the next level. |
| 3 | BE2-WB | Big English 2 Workbook | Closes the BE2 pair while sticker/appendix dependency lessons are fresh. |
| 4 | RH2B | Reach Higher 2B | Same-level continuation of the RH2A stress test; checks inquiry / long-reading recurrence before later RH levels. |
| 5 | BE3-SB | Big English 3 Student Book | Begins the first fully new Big English level after the pilots. |
| 6 | BE3-WB | Big English 3 Workbook | Completes the level pair before moving upward. |
| 7 | RH3A | Reach Higher 3A | Cross-series checkpoint after one new Big English pair. |
| 8 | BE4-SB | Big English 4 Student Book | Continues Big English vertical progression. |
| 9 | BE4-WB | Big English 4 Workbook | Completes the level pair. |
| 10 | BE5-SB | Big English 5 Student Book | Continues the higher-priority Big English sequence. |
| 11 | BE5-WB | Big English 5 Workbook | Completes the level pair. |
| 12 | RH4A | Reach Higher 4A | Final Reach Higher stress check before the last Big English pair. |
| 13 | BE6-SB | Big English 6 Student Book | Final Big English Student Book. |
| 14 | BE6-WB | Big English 6 Workbook | Completes the initial 18-book dataset. |

## Per-book execution gate

Before extraction, confirm the source is complete and establish the catalog `book_id`, Storage paths, aliases, expected units/sections, and validator book profile. Then use:

```text
unit extraction
→ human verification
→ verified-batch preflight
→ canonical merge + D007 normalization
→ automated canonical validation
→ whole-book/source audit
→ Phase 1 COMPLETE
```

Warnings remain reviewable/non-blocking; any validator **ERROR** blocks progression. New source structures stay in `schema_gaps` unless repeated evidence justifies reopening the deferred 0.2 candidate.

Continue recording:

- extraction issues;
- schema gaps;
- new curriculum components;
- and unexpected source structures

throughout the entire 18-book dataset.

Reorder only for a concrete source/readiness reason (missing/incomplete PDF, unresolved identity, extraction failure, or a deliberate owner priority change). Record the reason rather than silently changing the sequence.

---

# 16. Phase 1 Completion Rule

A book should only be marked:

```text
PHASE 1: COMPLETE
```

when:

- relevant source sections have been processed;
- extraction batches are complete;
- structural validation has passed;
- required human verification has been completed;
- major omissions have been resolved;
- unresolved uncertainty is documented;
- schema gaps are recorded;
- the whole-book audit has passed;
- and the canonical dataset has been created.

For future books, “structural validation has passed” means no automated **ERROR** findings; warnings may remain with review/documentation. Retrospective validation does not silently revoke an already accepted pilot completion state. Any newly detected ERROR is recorded and triaged before the canonical is rebuilt or treated as a clean baseline.

Phase 1 completion does **not** mean:

- Phase 2 interpretation is complete;
- curriculum mapping is complete;
- enrichment is complete;
- lesson packaging is complete;
- or lesson generation is complete.

It means:

> **The source has been represented accurately enough to support later phases.**

---

# 17. Dataset Progress Summary

Update this section as books progress.

## Current Summary

| Metric | Count |
|---|---:|
| Total Books | 18 |
| Sources Available | 18 |
| Phase 1 Not Started | 12 |
| Phase 1 In Progress | 0 |
| Phase 1 Complete | 7 |
| Phase 1 Blocked | 0 |
| Canonical Datasets Created | 6 |
| Human Verification Complete | 6 |
| Whole-Book Audits Passed | 6 |
| Automated Validation Passed With Warnings | 6 |
| Automated Validation Failed | 0 |

These counts should be updated whenever a book changes major processing status.

---

# 18. Series Progress Summary

| Series | Total Books | Not Started | In Progress | Complete | Blocked |
|---|---:|---:|---:|---:|---:|
| Beehive | 2 | 1 | 0 | 1 | 0 |
| Big English | 12 | 8 | 0 | 4 | 0 |
| Reach Higher | 4 | 3 | 0 | 1 | 0 |
| **Total** | **18** | **12** | **0** | **6** | **0** |

---

# 19. Schema Distribution

Use this section once extraction begins.

| Schema Version | Books Using Version | Migration Needed | Notes |
|---|---:|---|---|
| 0.1 | 4 (BH1 + BE1-SB + BE2-SB + RH2A unit batches) | No | BH1: `beehive_1_sb/` (01–10); BE1-SB: `big_english_1_sb/` (01–09); BE2-SB: `big_english_2_sb/` (01–09); RH2A: `reach_higher_2a/` (units 1–4) |

This becomes increasingly important as the Phase 1 schema evolves.

---

# 20. Schema Review Log

Record significant dataset-wide schema review points here.

| Review | Trigger | Books Reviewed | Result | Action |
|---|---|---|---|---|
| Initial Cross-Series Review | First representative extraction | Beehive 1 / Big English 1 / Big English 2 / Reach Higher 2A | **0.2 deferred** — remain on schema 0.1 | No schema or prompt patch. See review notes §11. |

Detailed schema changes should be recorded in the schema change log associated with:

**`json-schema.md`**

The Registry only records the operational result.

---

# 21. Dataset-Level Issues

Use this section only for issues affecting multiple books or the dataset as a whole.

Examples might include:

- extraction prompt weakness;
- ID-generation problems;
- page-number handling;
- schema migration;
- batch-size problems;
- Google Sheets limitations;
- React ingestion issues;
- or source-management problems.

## Current Dataset-Level Issues

**None recorded yet.**

---

# 22. Dataset-Level Decisions

Use this section for important operational decisions that affect how the dataset is processed.

## Current Decisions

### Decision 1 — Initial Dataset

The initial development dataset consists of:

```text
Beehive 1–2
+
Big English 1–6 Student Books and Workbooks
+
Reach Higher 2A, 2B, 3A and 4A
=
18 books
```

### Decision 2 — Canonical Format

Structured JSON is the canonical Phase 1 machine-readable representation.

Google Sheets and React are downstream inspection and verification surfaces.

### Decision 3 — Cross-Series Development

The schema should be tested against substantially different textbook series before large-scale extraction.

### Decision 4 — Schema Evolution

AI may identify schema gaps and propose changes.

Permanent schema changes require review.

### Decision 5 — Human Verification

AI extraction does not equal curriculum verification.

Human verification remains part of Phase 1.

---

# 23. Registry Maintenance Rule

Update the Dataset Registry whenever a book reaches a meaningful processing milestone.

Examples:

```text
NOT STARTED
→
IN PROGRESS
```

or:

```text
Human Verification:
IN PROGRESS
→
COMPLETE
```

or:

```text
Canonical Dataset:
NOT CREATED
→
CREATED
```

Do not update the Registry for every tiny extraction action.

The Registry should remain readable as a high-level operational dashboard.

---

# 24. Registry vs Canonical Dataset

Keep the distinction clear.

## Dataset Registry

Tracks:

```text
What sources exist?
What is their processing status?
What schema version do they use?
What remains unresolved?
```

## Canonical Book Dataset

Contains:

```text
What curriculum evidence was actually extracted?
```

## Phase 2–4 Data

Eventually contains:

```text
What does the evidence mean?
How does it connect?
What useful teaching intelligence should be added?
```

The Registry should not become another curriculum database.

---

# 25. Future Automation

The Registry begins as a simple project document.

As the ingestion workflow becomes automated, much of the Registry may eventually be generated automatically from processing metadata.

Potential automatically calculated information includes:

- extraction progress;
- completed batches;
- validation status;
- verification counts;
- issue counts;
- schema-gap counts;
- schema versions;
- canonical dataset availability;
- and Phase 1 completion.

The human-readable Registry can then become a view over the processing system rather than something manually maintained.

Do not build this automation before the workflow is sufficiently stable.

---

# 26. Current Project Snapshot

```text
GENERAL CURRICULUM MAPPER

Initial Dataset
18 books
3 textbook series

Beehive
2 books

Big English
12 books

Reach Higher
4 books

Current Priority
Phase 1 — Curriculum Extraction & Dataset Development
(extraction quality checkpoint accepted 2026-10-07;
 all four Storage-backed pilots Phase 1 COMPLETE)

Current Canonical Format
Structured JSON (all four pilot books have verified canonical v1 in Supabase Storage)

Current Schema
0.1 Development

Phase 1 Complete
7 / 18 (BE1-SB, BH1, BE2-SB, RH2A, BE1-WB with D013 exception, BE2-WB, BE3-SB with D013 exception)

Storage-backed complete books
Beehive 1 (Phase 1 COMPLETE — canonical v1 + whole-book audit PASSED)
Big English 1 SB (Phase 1 COMPLETE — canonical v1 + whole-book audit PASSED)
Big English 1 WB (Phase 1 COMPLETE with D013 exception — printed pp. 124–129 missing from source PDF)
Big English 2 SB (Phase 1 COMPLETE — canonical v1 + whole-book audit PASSED)
Big English 2 WB (Phase 1 COMPLETE — canonical v1 + whole-book audit PASSED; U8/U9 ID remumber + appendix p.141 omission noted)
Reach Higher 2A (Phase 1 COMPLETE — canonical v1 + whole-book audit PASSED)

Verification UI
React /app/validation (unit-scoped canonical + source PDF)

Automated structural validation
Implemented (machine schema + shared JS validator + CLI)
Six complete books: PASSED WITH WARNINGS

Next Major Checkpoints
Continue Big English (e.g. BE3-WB / BE4-SB) or pull BH2/RH2B when ready (§15 note)
```

---

# 27. Core Registry Principle

> **The Registry tells us what we have, what we have processed, what we trust, what structure it uses, and what still needs attention.**

Keep it:

- current;
- simple;
- operational;
- traceable;
- and useful.

Do not turn it into another curriculum source document.

Its job is to make the state of the General Curriculum Mapper dataset immediately understandable.