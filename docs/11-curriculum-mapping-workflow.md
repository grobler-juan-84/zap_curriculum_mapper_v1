# General Curriculum Mapper — Curriculum Mapping Workflow

**Status:** ACTIVE / EVOLVING  
**Version:** 1.0  
**Purpose:** Project-wide working workflow for curriculum intelligence across Phases 1–4. Practical handoffs only — not a schema, API, or product lock.

**Authority:** Locked phase intent and progressive method live in [`4-decisions.md`](./4-decisions.md) **D017**. Architecture boundaries: [`3-architecture.md`](./3-architecture.md). Overview: [`1-project-overview.md`](./1-project-overview.md).

**Related phase detail:**
- Phase 1 procedures → [`phase-1/phase-1-extraction-workflow.md`](./phase-1/phase-1-extraction-workflow.md)
- Phase 1 data rules → [`phase-1/extraction-data-specification.md`](./phase-1/extraction-data-specification.md)
- Phase 2 experiment status → [`phase-2/phase-2-experiment-status.md`](./phase-2/phase-2-experiment-status.md)
- Phase 4 philosophy → [`phase-4/teacher-enrichment-philosophy.md`](./phase-4/teacher-enrichment-philosophy.md)

This document is intentionally **not locked**. Change it when evidence from real books and teaching use requires it.

---

## 1. Guiding principles

> **Beauty in simplicity — but still thorough.**

1. **Preserve book truth** — Phase 1 evidence is not silently rewritten by later phases (D001, D017).
2. **Minimum sufficient output** — produce the smallest useful deliverable that can support the next phase (D017).
3. **Traceability** — summarization must keep references to earlier evidence (D017).
4. **Progressive discovery** — attempt downstream tasks to learn what upstream outputs actually need (D017).
5. **Separate research from production** — detailed experiments are evidence, not automatic production requirements (D017).
6. **Previously taught ≠ mastered** — recycling and scaffolding must not assume mastery (D017 Phase 4).
7. **Phases are conceptual** — development may move between phases; missing information is fixed where it originated.

---

## 2. Phase map (current focus)

| Phase | Name | Primary question | Status under D017 / D015 |
|---|---|---|---|
| **1** | Extraction / Book Evidence | What does the source contain? | PAUSED at 14/18 COMPLETE; resume only by owner decision |
| **2** | Book Intelligence / Horizontal Mapping | What does this book teach unit by unit? | Active priority — minimum-sufficient overviews |
| **3** | Series Intelligence / Vertical Mapping | How does learning develop across books? | Later — after useful Phase 2 book overviews |
| **4** | Teaching Intelligence | What scaffolding, recycling, gaps, enrichment are justified? | Later — uses Phase 3 + earlier evidence |

**Later phases (5–7)** — Lesson packaging, generation, and evaluation remain in the architecture ([`3-architecture.md`](./3-architecture.md)) but are **out of scope** for this workflow document. No redesign is authorized here.

**Proposed decisions:** Any draft labeled **D018** (or similar) is **proposed only** until recorded LOCKED in [`4-decisions.md`](./4-decisions.md). Do not treat proposed text as authority.

---

## 3. End-to-end information flow

```text
SOURCE PDF / MATERIALS
        ↓
PHASE 1 — Book Evidence (canonical JSON)
        ↓
PHASE 2 — Book Intelligence (horizontal overview)
        ↓
PHASE 3 — Series Intelligence (vertical connections)
        ↓
PHASE 4 — Teaching Intelligence (scaffolding / enrichment opportunities)
        ↓
(later) Lesson packaging → generation → evaluation
```

Each arrow is a **handoff of distinguishable layers**, not a silent rewrite of the previous layer.

---

## 4. Phase 1 — Extraction / Book Evidence

### Purpose

Create detailed, verifiable, source-grounded curriculum evidence for one book.

### Inputs

- Textbook source PDF (R2 `book-sources`, D012)
- SB / WB extraction prompt / unit-batch process ([`phase-1/google-ai-studio-prompt-sb-wb-v2.md`](./phase-1/google-ai-studio-prompt-sb-wb-v2.md))
- Optional Scope & Sequence extraction prompt ([`phase-1/google-ai-studio-prompt-ss-v1.md`](./phase-1/google-ai-studio-prompt-ss-v1.md)) — keep SS evidence distinct from SB/WB canonical datasets
- Catalog identity (`catalog_book_id`, D007 / D009)

### Process (summary)

```text
Register book → extract unit batches → automated validation (D008)
→ human verify beside PDF → merge canonical → whole-book audit
```

Operational detail: [`phase-1/phase-1-extraction-workflow.md`](./phase-1/phase-1-extraction-workflow.md).

### Outputs

- Verified unit batches + **one canonical book JSON**
- Open `extraction_issues` / schema gaps where needed
- Registry / `dataset_versions` status for the book

### Validation

- Structural validation (D008) — errors block new progression
- Human verification of available PDF content (D013/D014)
- Whole-book / source audit before Phase 1 COMPLETE

### Handoff to Phase 2

Phase 2 consumes **verified Phase 1 canonical evidence** only. It must not modify Phase 1 datasets.

---

## 5. Phase 2 — Book Intelligence / Horizontal Mapping

### Purpose

Transform Phase 1 evidence into a **concise, teacher-readable unit-by-unit overview** of what one book teaches (D017).

Focus on meaningful vocabulary, grammar/structures, communicative functions, skills/components, and observable learning expectations **where supported**. Prefer minimum-sufficient density over exhaustive analysis.

### Inputs

- Verified Phase 1 canonical JSON for the book
- Optional: publisher overview as a **density benchmark only** (not a schema)
- Optional: historical Phase 2 research (LR / V3.1 / etc.) as context — **not** mandatory production depth

### Process (summary)

1. Inspect units in Phase 1 evidence.
2. Summarize minimum useful curriculum dimensions per unit.
3. Distinguish book evidence from AI inference (especially outcomes).
4. Keep evidence references for verification.
5. Evaluate usefulness before expanding depth or locking format.

### Outputs

- Book-level horizontal overview (currently experimental Markdown; format **not locked**)
- Explicit uncertainty / missing-evidence notes

Current experiment artifact: [`phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v1.md`](./phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v1.md). Status: [`phase-2/phase-2-experiment-status.md`](./phase-2/phase-2-experiment-status.md).

### Validation

- Claims check against Phase 1 entity/page evidence
- Teacher readability (owner / teacher review — not assumed from AI self-eval)
- Sufficiency check: “enough to attempt an initial vertical comparison later?”

### Handoff to Phase 3

Phase 3 should start from accepted Phase 2 book overviews (plus Phase 1 when needed). Do not invent progression from raw PDFs alone.

**Not authorized here:** Phase 2 JSON schema, API, database model, or UI lock.

---

## 6. Phase 3 — Series Intelligence / Vertical Mapping

### Purpose

Connect learning **across books and levels**: introduction, recycling, extension, and increasing linguistic complexity (D017).

Shared topics or shared vocabulary alone do **not** establish progression.

### Inputs

- Phase 2 book overviews for the books in scope
- Supporting Phase 1 evidence where claims need verification
- Clear book/level identity (catalog IDs)

### Process (summary)

1. Align comparable language targets / functions across books (not topic match alone).
2. Classify relationships (e.g. first encounter → practice → recycle → extend) only when evidence supports them.
3. Separate documented prior learning from assumed prerequisites and observed learner reality.
4. Record gaps that imply missing Phase 2 (or Phase 1) information — fix upstream selectively.

### Outputs

- Cross-book / cross-level connection notes or maps (**format not locked**)
- Explicit non-claims where evidence is weak

### Validation

- Language-led checks (grammar / functions primary; vocab/topic secondary)
- Traceability back to Phase 2 / Phase 1 references
- Owner review before treating any relationship model as production

### Handoff to Phase 4

Teaching Intelligence uses Phase 3 connections **and** earlier evidence. Previously taught content must not be treated as mastered.

**Status:** Parked until useful Phase 2 book overviews exist and owner authorizes a vertical probe. Historical cross-unit experiments remain research only.

---

## 7. Phase 4 — Teaching Intelligence

### Purpose

Derive practical teaching insights from curriculum evidence and connections: scaffolding, deliberate recycling, enrichment opportunities, possible gaps, and preparation for later learning (D017) — without rewriting book truth.

### Inputs

- Phase 1 evidence (floor)
- Phase 2 book intelligence
- Phase 3 connections (when available)
- Teacher Enrichment Philosophy: [`phase-4/teacher-enrichment-philosophy.md`](./phase-4/teacher-enrichment-philosophy.md)

### Process (summary)

1. Start from the curriculum floor (what the book provides).
2. Identify where scaffolding or recycling is justified by evidence/connections.
3. Propose enrichment as **optional depth**, clearly labeled as not source content.
4. Prefer recycling familiar language for productive practice over inventing new compulsory curriculum.

### Outputs

- Teaching recommendations / enrichment opportunities (**format not locked**)
- Clear separation: BOOK EVIDENCE vs INTERPRETATION vs ENRICHMENT

### Validation

- Must not silently alter Phase 1
- Enrichment labeled as non-source
- Owner / teacher judgement remains final

### Handoff to later phases

Phases 5–7 (packaging, generation, evaluation) may consume Teaching Intelligence later. They are not specified here.

**Status:** Formal Phase 4 product work waits on stronger upstream intelligence. Bounded enrichment probes remain research only.

---

## 8. Cross-cutting rules

| Rule | Meaning |
|---|---|
| Layer separation | Evidence ≠ interpretation ≠ connections ≠ enrichment ≠ generated lessons |
| Empty can be correct | Missing fields are allowed; do not invent content to fill schema |
| Schema changes | Record gaps; approve before permanent change (Phase 1 detail docs) |
| Automation | Automate repetitive work only after usefulness is demonstrated |
| Current dataset | 18-book initial set; Phase 2 experiments currently Big English–first (D015) |

---

## 9. Related documents

| Doc | Role |
|---|---|
| [`4-decisions.md`](./4-decisions.md) | Locked decisions (D001, D015–D017, …) |
| [`3-architecture.md`](./3-architecture.md) | System boundaries including Phases 5–7 |
| [`5-progress.md`](./5-progress.md) / [`6-todo.md`](./6-todo.md) | Current state and near-term tasks |
| [`phase-1/dataset-registry.md`](./phase-1/dataset-registry.md) | Book completion status |
| [`8-database-architecture.md`](./8-database-architecture.md) / [`10-storage-architecture.md`](./10-storage-architecture.md) | Catalog vs JSON vs object storage |

---

## Change log

| Date | Change |
|---|---|
| 2026-10-12 | Created as project-wide workflow (relocated/refactored from `phase-1/curriculum-mapping-process.md`). Phase 1 procedures preserved in `phase-1/phase-1-extraction-workflow.md`. |
