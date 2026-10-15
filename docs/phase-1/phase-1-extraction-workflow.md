# Phase 1 — Extraction / Book Evidence Workflow

**Status:** ACTIVE / EVOLVING  
**Version:** 1.0  
**Purpose:** Practical Phase 1 procedures for producing verified book evidence. Complements the project-wide workflow; does not redefine later phases.

**Project-wide workflow:** [`../11-curriculum-mapping-workflow.md`](../11-curriculum-mapping-workflow.md)  
**Authoritative data rules:** [`extraction-data-specification.md`](./extraction-data-specification.md)  
**Working schema:** [`json-schema.md`](./json-schema.md) (0.1)  
**SB / WB extraction prompt:** [`google-ai-studio-prompt-sb-wb-v2.md`](./google-ai-studio-prompt-sb-wb-v2.md)  
**Scope & Sequence extraction prompt:** [`google-ai-studio-prompt-ss-v1.md`](./google-ai-studio-prompt-ss-v1.md)  
**Book status:** [`dataset-registry.md`](./dataset-registry.md)

**Priority:** Phase 1 is **PAUSED at 14 / 18 COMPLETE** (D015). These procedures remain authoritative when Phase 1 resumes.

---

## 1. Purpose

Phase 1 asks:

> **What does the source material actually contain?**

Create trustworthy structured curriculum evidence before deeper interpretation (Phase 2+).

Phase 1 does **not** create lesson plans, enrichment, vertical maps, or invented pedagogy (D001).

---

## 2. Core principle

> **Extract what the source actually contains, preserve where it came from, expose uncertainty, and allow different books to reveal structural needs.**

Do not silently invent missing information, enrich textbook content, or treat AI assumptions as book truth.

When uncertain: **flag rather than guess.**

---

## 3. Working pipeline

```text
PDF SOURCE (R2 book-sources — D012)
↓
SOURCE REGISTRATION (catalog / book_files)
↓
BOOK STRUCTURE IDENTIFICATION
↓
EXTRACTION BATCHES (default: one unit = one batch)
↓
AI EXTRACTION (Google AI Studio)
↓
STRUCTURED JSON → Storage book-datasets
↓
AUTOMATED VALIDATION (D008)
↓
HUMAN VERIFICATION (/app/validation + PDF)
↓
MERGE APPROVED BATCHES
↓
WHOLE-BOOK AUDIT
↓
CANONICAL BOOK DATASET (dataset_versions)
```

**Canonical machine representation:** structured JSON.  
Spreadsheets / React are **views** over that data, not the source of truth.

Ops scripts and Validation UI implement parts of this pipeline; see project `scripts/` and `/app/validation`.

---

## 4. Extraction strategy

**Default:** one unit = one extraction batch (D002).

Split a unit when output is too large, content is omitted, activities confuse, visuals are dense, or smaller batches prove more accurate.

> **Use the largest batch that remains reliably accurate and complete.**

Studio usage (Student Book / Workbook): supply the textbook PDF; return **one labeled JSON batch per unit**. Whole-book JSON is produced only by later merge. Details: [`google-ai-studio-prompt-sb-wb-v2.md`](./google-ai-studio-prompt-sb-wb-v2.md).

For publisher Scope & Sequence pages (separate source / extraction track), use [`google-ai-studio-prompt-ss-v1.md`](./google-ai-studio-prompt-ss-v1.md). Keep SS output distinct from SB/WB canonical book evidence.

Catalog `book_id` normalization at merge: D007 / [`book-id-alias-map.md`](./book-id-alias-map.md).

---

## 5. Cross-series validation

Do not finish one entire series before testing another when developing the schema.

Early representative stress (historical pilot order):

```text
Beehive 1 → Big English 1 → Reach Higher 2A → schema review
```

Goal: a **General** Curriculum Mapper — not a single-publisher mapper.

Under D015, immediate Phase 2 experiments use completed Big English books; unfinished Beehive/Reach Higher Phase 1 remains deferred (F016).

---

## 6. Consistency without artificial uniformity

Aim for:

> **Consistency without artificial uniformity.**

Empty fields can be correct (e.g. no phonics in a book). Never invent content because a field exists.

---

## 7. Schema discovery and change

Schema 0.1 is a working hypothesis. When source content cannot be represented adequately, record a **SCHEMA GAP** (source, book, unit, page, observed content, closest structure, why insufficient, proposed change, evidence).

Change flow:

```text
Record → Verify → Check existing schema → Compare across sources
→ Determine scope → Approve / reject → Version → Migrate if needed
```

Not every unusual feature deserves a permanent field. Automated structural checks: D008 / `scripts/validate_phase1_json.mjs`.

---

## 8. Canonical dataset

Each completed book produces **one** canonical structured dataset (unit batches → merge → audit).

Local working copies: `data/phase1/{catalog_book_id}/` (gitignored).  
Authoritative Storage path pattern: `{series-slug}/{catalog_book_id}/canonical/v1.json`.

---

## 9. Human verification

AI reduces repetitive work; humans still check:

- page coverage and omissions  
- vocabulary classification  
- language structures and activities  
- stories / continuous text  
- invented content  
- visual / audio dependencies  
- uncertainty flags and schema gaps  

Missing printed pages: verify available PDF content; document `missing_source` (D013). Viewer navigates by `pdf_page` (D014).

Shift effort from **copying + formatting** toward **checking + deciding**.

---

## 10. Phase 1 outputs (definition of done for a book)

1. Validated extraction methodology for that book  
2. Canonical structured dataset  
3. Verified page-level source evidence  
4. Documented uncertainty and schema gaps  
5. Automated validation record (errors triaged)  
6. Whole-book / source audit PASSED (or documented exception)  
7. Data ready to hand off to Phase 2 without modifying Phase 1  

We should be able to answer, from the dataset: what appears on a page; target vocabulary; modelled language; activities; skills; workbook reinforcement; where extraction is uncertain; where the schema fails.

---

## 11. Handoff

| To | What is handed off |
|---|---|
| Phase 2 | Verified canonical JSON only — no Phase 1 mutation |
| Registry / ops | Completion status in [`dataset-registry.md`](./dataset-registry.md) |
| Audits | Reports under [`audits/`](./audits/) |

Project-wide phase handoffs: [`../11-curriculum-mapping-workflow.md`](../11-curriculum-mapping-workflow.md).

---

## Change log

| Date | Change |
|---|---|
| 2026-10-12 | Created from Phase 1 procedural sections formerly in `curriculum-mapping-process.md`. |
