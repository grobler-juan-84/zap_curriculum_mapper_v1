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
COMPLETE
NEEDS REVIEW
```

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
| BH1 | Beehive | 1 | Book | AVAILABLE | EXTRACTED | NOT RUN | COMPLETE | NOT STARTED | NOT CREATED | 0.1 | 31 | 8 | IN PROGRESS |
| BH2 | Beehive | 2 | Book | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE1-SB | Big English | 1 | Student Book | AVAILABLE | EXTRACTED | NOT RUN | COMPLETE | NOT STARTED | NOT CREATED | 0.1 | 39 | 1 | IN PROGRESS |
| BE1-WB | Big English | 1 | Workbook | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE2-SB | Big English | 2 | Student Book | AVAILABLE | EXTRACTED | NOT RUN | COMPLETE | NOT STARTED | NOT CREATED | 0.1 | 16 | 0 | IN PROGRESS |
| BE2-WB | Big English | 2 | Workbook | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE3-SB | Big English | 3 | Student Book | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE3-WB | Big English | 3 | Workbook | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE4-SB | Big English | 4 | Student Book | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE4-WB | Big English | 4 | Workbook | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE5-SB | Big English | 5 | Student Book | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE5-WB | Big English | 5 | Workbook | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE6-SB | Big English | 6 | Student Book | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| BE6-WB | Big English | 6 | Workbook | AVAILABLE | NOT STARTED | NOT RUN | NOT STARTED | NOT STARTED | NOT CREATED | — | — | — | NOT STARTED |
| RH2A | Reach Higher | 2A | Book | AVAILABLE | IN PROGRESS | NOT RUN | PARTIAL | NOT STARTED | NOT CREATED | 0.1 | 8 | 5 | IN PROGRESS |
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

**Extraction Status:** EXTRACTED (unit batches `01–08`)  
**Batch Path:** `data/phase1/beehive_1_sb/`  
**Automated Validation:** NOT RUN  
**Human Verification:** COMPLETE  
**Verification Notes:** Units 1 and 4 PDF-checked; Units 2–3 and 5–8 marked human-verified by project decision after accepting extraction quality.  
**Whole-Book Audit:** NOT STARTED  
**Canonical Dataset:** NOT CREATED  
**Phase 1 Status:** IN PROGRESS  

### Schema / Issues

**Schema Version:** 0.1  
**Open Issues:** 31 (mostly `audio_required` / `missing_source` workbook refs — documented, left open)  
**Schema Gaps:** 8 (recurring SEL / Think–Feel–Grow gap across units — pending schema review)  

### Notes

- Do not mark Phase 1 COMPLETE until canonical merge + whole-book audit are done.
- Next pilot book after Beehive + Big English baselines: Reach Higher 2A.

---

# 8B. BE1-SB — Big English 1 Student Book (active)

**Registry ID:** BE1-SB  
**Series:** Big English (extracted metadata may say Big English Plus)  
**Level:** 1  
**Book Type:** Student Book  
**Folder / files:** `data/phase1/big_english_1_sb/`  
**Internal book_id in JSON:** `bep1_sb` (note: differs from folder/`big_english_1_sb` naming; resolve at canonical-merge or ID-normalization pass)

### Phase 1 Processing

**Extraction Status:** EXTRACTED (unit batches `01–09`)  
**Automated Validation:** NOT RUN  
**Human Verification:** COMPLETE  
**Verification Notes:** All unit batches reviewed and accepted by project decision (2026-10-02).  
**Whole-Book Audit:** NOT STARTED  
**Canonical Dataset:** NOT CREATED  
**Phase 1 Status:** IN PROGRESS  

### Schema / Issues

**Schema Version:** 0.1  
**Open Issues:** 39 (mostly audio/visual verification — documented, left open)  
**Schema Gaps:** 1 (Think Big sub-feature — pending schema review; related to Beehive SEL/reflection gaps)

### Notes

- Do not mark Phase 1 COMPLETE until canonical merge + whole-book audit are done.
- Cross-series pilot next: Reach Higher 2A, then schema review across BH1 + BE1-SB + RH2A.

---

# 8C. BE2-SB — Big English 2 Student Book (active)

**Registry ID:** BE2-SB  
**Series:** Big English (extracted metadata may say Big English Plus)  
**Level:** 2  
**Book Type:** Student Book  
**Folder / files:** `data/phase1/big_english_2_sb/`  
**Internal book_id in JSON:** `bep_sb_2`

### Phase 1 Processing

**Extraction Status:** EXTRACTED (unit batches `01–09`)  
**Automated Validation:** NOT RUN  
**Human Verification:** COMPLETE  
**Verification Notes:** All unit batches reviewed and accepted by project decision (2026-10-05). Unit 2 re-extracted and restored (pages/vocabulary/language); truncation issue cleared.  
**Whole-Book Audit:** NOT STARTED  
**Canonical Dataset:** NOT CREATED  
**Phase 1 Status:** IN PROGRESS  

### Schema / Issues

**Schema Version:** 0.1  
**Open Issues:** 16 (mostly audio/visual verification — documented, left open)  
**Schema Gaps:** 0  

### Notes

- Do not mark Phase 1 COMPLETE until canonical merge and whole-book audit are done.

---

# 8D. RH2A — Reach Higher 2A Student Book (active)

**Registry ID:** RH2A  
**Series:** Reach Higher  
**Level:** 2A  
**Book Type:** Student Book  
**Folder / files:** `data/phase1/reach_higher_2a/`  
**Internal book_id in JSON:** `rh_2a`

### Phase 1 Processing

**Extraction Status:** IN PROGRESS (units `1–3` extracted; **Unit 4 pending** extraction restriction)  
**Automated Validation:** NOT RUN  
**Human Verification:** PARTIAL  
**Verification Notes:** Units 1–3 reviewed and accepted by project decision (2026-10-05). Unit 4 not yet extracted.  
**Whole-Book Audit:** NOT STARTED  
**Canonical Dataset:** NOT CREATED  
**Phase 1 Status:** IN PROGRESS  

### Schema / Issues

**Schema Version:** 0.1  
**Open Issues:** 8 (documented in unit batches; left open)  
**Schema Gaps:** 5 (Big Question / inquiry, intermittent reading prompts, glossary definitions, and related gaps — pending cross-series schema review)

### Notes

- Do not mark human verification COMPLETE until Unit 4 is extracted and reviewed.
- Do not mark Phase 1 COMPLETE until canonical merge + whole-book audit are done.

---

# 9. Extraction Batch Tracking

During active extraction, individual books may require batch-level tracking.

When using **`3-Google_AI_Studio_Prompt.md`** with a complete textbook PDF, expect one JSON batch file per unit (or equivalent major instructional section), typically named like `<book_id>_unit_01.json`, until approved batches are merged into the canonical book dataset.

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
| 1 | Beehive 1 | Existing conceptual baseline / first schema test | EXTRACTED + HUMAN VERIFICATION COMPLETE (canonical merge / whole-book audit pending) |
| 2 | Big English 1 | Current school curriculum / full-series architecture test | EXTRACTED + HUMAN VERIFICATION COMPLETE (canonical merge / whole-book audit pending) |
| 3 | Reach Higher 2A | Cross-series structural stress test | UNITS 1–3 EXTRACTED + HUMAN-VERIFIED; UNIT 4 PENDING EXTRACTION RESTRICTION |
| 4 | Schema Review | Review findings across all three series | NOT STARTED |

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

perform a schema review before large-scale processing.

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

The exact processing order is not permanently fixed.

However, once the representative pilot is successful, a practical approach is to continue processing the available dataset while deliberately maintaining cross-series awareness.

Do not assume that successful extraction of several books from one series proves the architecture is general.

Later levels may still expose new structures.

Continue recording:

- extraction issues;
- schema gaps;
- new curriculum components;
- and unexpected source structures

throughout the entire 18-book dataset.

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
| Phase 1 Not Started | 14 |
| Phase 1 In Progress | 4 |
| Phase 1 Complete | 0 |
| Phase 1 Blocked | 0 |
| Canonical Datasets Created | 0 |
| Human Verification Complete | 3 |
| Whole-Book Audits Passed | 0 |

These counts should be updated whenever a book changes major processing status.

---

# 18. Series Progress Summary

| Series | Total Books | Not Started | In Progress | Complete | Blocked |
|---|---:|---:|---:|---:|---:|
| Beehive | 2 | 1 | 1 | 0 | 0 |
| Big English | 12 | 10 | 2 | 0 | 0 |
| Reach Higher | 4 | 3 | 1 | 0 | 0 |
| **Total** | **18** | **14** | **4** | **0** | **0** |

---

# 19. Schema Distribution

Use this section once extraction begins.

| Schema Version | Books Using Version | Migration Needed | Notes |
|---|---:|---|---|
| 0.1 | 4 (BH1 + BE1-SB + BE2-SB + RH2A unit batches) | No | BH1: `beehive_1_sb/` (01–08); BE1-SB: `big_english_1_sb/` (01–09); BE2-SB: `big_english_2_sb/` (01–09); RH2A: `reach_higher_2a/` (units 1–3; unit 4 pending) |

This becomes increasingly important as the Phase 1 schema evolves.

---

# 20. Schema Review Log

Record significant dataset-wide schema review points here.

| Review | Trigger | Books Reviewed | Result | Action |
|---|---|---|---|---|
| Initial Cross-Series Review | First representative extraction | Beehive 1 / Big English 1 / Reach Higher 2A | PENDING | PENDING |

Detailed schema changes should be recorded in the schema change log associated with:

**`4A-Phase_1_JSON_Schema.md`**

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

Current Canonical Format
Structured JSON

Current Schema
0.1 Development

Phase 1 Complete
0 / 18

Current Cross-Series Pilot
Beehive 1
Big English 1
Reach Higher 2A

Next Major Checkpoint
Initial Cross-Series Schema Review
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