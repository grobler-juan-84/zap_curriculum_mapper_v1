# General Curriculum Mapper — Architecture

**Status:** ACTIVE / EVOLVING  
**Project:** General Curriculum Mapper  
**Purpose:** Define the high-level system architecture, major boundaries, data flow and separation of responsibilities across the General Curriculum Mapper.

---

# 1. Architecture Goal

The General Curriculum Mapper is designed to transform curriculum source material into increasingly useful layers of curriculum intelligence while preserving a clear connection to the original source.

The architecture must support a progression from:

```text
Curriculum Source
↓
Structured Curriculum Evidence
↓
Curriculum Interpretation
↓
Curriculum Connections
↓
Teacher Enrichment
↓
Lesson Packaging
↓
Lesson Generation
↓
Evaluation & Refinement
```

The system should become more intelligent as information moves downstream without losing the distinction between:

> **what the curriculum actually contains**

and:

> **what the system has interpreted, connected, recommended or generated.**

**Development priority vs phase numbers:** Conceptual phases stay in this architecture. **D027** locks the durable layer model below. The D026 feature-development freeze remains active outside bounded authorized slices. **Stage 3** (Opener NLL↔POC card comparison), **Stage 4** (Opener NLL → NLP → General Lesson Plan pilot) and **Stage 5** (Opener NLP → Chalkie via `renderChalkieFromNeutralPackage`) are complete, bounded, default-off, owner-accepted and undeployed. **Stage 6A/6B Story** is owner-accepted, default-off where applicable and undeployed; Stage 5 Opener and Stage 6B Story remain the two accepted reference implementations. BE3 U8 **Language in Action LiA-A and LiA-B are owner-accepted**: live NLL totals are **3 / 23 / 23 / 5**; LiA remains `draft`, `hidden`/`experimental`, with two `proposed` SS links; the exact SB pp.132–133 → WB pp.107–108 neutral package and five-artifact renderer are parity-proved and BI-absent. **LiA-C is owner-accepted (2026-10-30)** behind default-off `VITE_NLL_CHALKIE_LIA_ADAPTER_PILOT`. **Grammar-A is live and owner-accepted** at totals **4 / 33 / 33 / 6** (`be3-u08-grammar` draft; ten hidden/experimental summaries; one proposed Structures link). **Grammar-B/C are owner-accepted under advance authorization (2026-10-30)** behind default-off `VITE_NLL_CHALKIE_GRAMMAR_ADAPTER_PILOT` for exact `be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112` / `be3-sb-wb-u08-p136-137-wb111-112`: selected NLP, five-artifact renderer, package-level NLL only, BI absence, stale-result guards, and current `sb_only` fallback (resolver default unchanged; undeployed/unpromoted). Remaining Unit 8 planning is documented and separately gated; promotion, deployment, POC/canary retirement, next-component implementation, and broad `supabase db push` remain unauthorized. See [`11-curriculum-mapping-workflow.md`](./11-curriculum-mapping-workflow.md), [`project-tracking/nll-migration-roadmap-v0.1.md`](./project-tracking/nll-migration-roadmap-v0.1.md), [`project-tracking/stage-6-story-transfer-brief-v0.1.md`](./project-tracking/stage-6-story-transfer-brief-v0.1.md), [`project-tracking/stage-6b-story-adapter-implementation-brief-v0.1.md`](./project-tracking/stage-6b-story-adapter-implementation-brief-v0.1.md), [`project-tracking/be3-u08-lia-transfer-planning-brief-v0.1.md`](./project-tracking/be3-u08-lia-transfer-planning-brief-v0.1.md), [`project-tracking/be3-u08-lia-knowledge-review-v0.1.md`](./project-tracking/be3-u08-lia-knowledge-review-v0.1.md) and [`project-tracking/be3-u08-lia-neutral-package-renderer-parity-brief-v0.1.md`](./project-tracking/be3-u08-lia-neutral-package-renderer-parity-brief-v0.1.md).

**Durable layer model (D027):**

```text
SS / SB / WB   — canonical publisher evidence
        ↓
NLL            — single persistent authority for reusable derived lesson knowledge
        ↓
NLP            — lesson-specific package; optional reproducibility snapshot
        ↓
Adapters       — Chalkie now; future output platforms later
```

SS/SB/WB remain independent canonical publisher evidence. NLL does not store canonical evidence, transient selections, NLP snapshots, or automatically every BI/teacher/school record. Generation adapters must not dictate NLL structure. See [`4-decisions.md`](./4-decisions.md) D027.

**Transitional knowledge/package lineages (current implementation reality under D027):** (1) bespoke BE3 handoffs provide the default teacher output, (2) neutral packages and limited canaries validate parity behind default-off flags, (3) the D023 enrichment POC supplies experimental summary sidecars, (4) the D024/D025 NLL pilot plus Stage 6A Story seed supply persistent reusable knowledge for Opener and Story (summaries remain `hidden`/`experimental`), (5) Stage 3 default-off Opener card comparison reads NLL beside POC, (6) Stage 4 default-off Opener pilot may attach selected NLL summaries as package-level NLP `derivedKnowledge` and render a tool-neutral General Lesson Plan, (7) the Stage 5 default-off Opener pilot routes that selected NLP through `renderChalkieFromNeutralPackage` while keeping NLL prose package-only and preserving D022 BI plus canary/bespoke fallback, (8) the Stage 6B default-off Story pilot does the same for exact Story scope while keeping Story BI-absent and falling back to the current Story canary/bespoke path, and (9) the owner-accepted LiA-C default-off pilot does the same for exact LiA scope (`be3-u08-lia`) while keeping LiA BI-absent and falling back to current `sb_only`. No NLP persistence, visibility promotion, deployment or POC/canary retirement occurred. Story has persistent NLL knowledge (draft component; five preferred v1 summaries; one proposed Structures link) plus the owner-accepted Stage 6B adapter (default-off, undeployed). LiA has persistent NLL knowledge plus accepted LiA-B package/renderer and LiA-C adapter (default-off, undeployed). These lineages have different roles today; none currently replaces another.

---

# 2. Core Architecture Principle

The most important architectural rule is:

> **Do not mix source truth with derived intelligence.**

Curriculum evidence, AI interpretation, curriculum relationships, teacher enrichment and generated lesson material serve different purposes.

They should remain distinguishable throughout the system.

Conceptually:

```text
SOURCE TRUTH
    ↓
DERIVED CURRICULUM INTELLIGENCE
    ↓
TEACHER INTELLIGENCE
    ↓
GENERATED OUTPUT
```

Each downstream layer may use information from earlier layers.

A downstream layer should not silently rewrite an upstream layer.

---

# 3. High-Level System Architecture

The General Curriculum Mapper is organized around seven conceptual phases:

```text
PHASE 1
Curriculum Extraction & Structure
        ↓
PHASE 2
AI Curriculum & Linguistic Interpretation
        ↓
PHASE 3
Curriculum Connections & Vertical Mapping
        ↓
PHASE 4
Teacher Enrichment
        ↓
PHASE 5
Lesson Packaging & Structure
        ↓
PHASE 6
Lesson Generation
        ↓
PHASE 7
Evaluation & Refinement
```

These phases represent different responsibilities.

They do not necessarily need to become seven separate software services.

The architecture should preserve the conceptual boundaries without prematurely creating unnecessary technical complexity.

---

# 4. Phase 1 — Curriculum Extraction & Structure

Phase 1 establishes the curriculum evidence layer.

Its primary question is:

> **What does the source material actually contain?**

Inputs may include:

```text
Student Books
Workbooks
PDFs
Teacher Materials
Other Curriculum Sources
```

Phase 1 extracts and structures information such as:

- book metadata;
- units and sections;
- pages;
- vocabulary;
- language;
- activities;
- continuous text;
- curriculum components;
- source relationships;
- extraction issues;
- source dependencies;
- verification information;
- and schema gaps.

The output is structured curriculum evidence.

Conceptually:

```text
PDF / Source
↓
Extraction
↓
Structured JSON
↓
Validation
↓
Human Verification
↓
Canonical Book Dataset
```

Phase 1 must remain conservative.

When information cannot be confidently determined, uncertainty should be recorded rather than replaced with an assumption.

---

# 5. Canonical Curriculum Dataset

The canonical book dataset is the primary structured representation of a curriculum source.

Conceptually:

```text
One Curriculum Source
        ↓
One Canonical Book Dataset
```

Example:

```text
big_english_1_sb.json
```

Extraction may occur through multiple unit or section batches.

Those batches are working artifacts.

The long-term Phase 1 product is the canonical dataset representing the book.

The canonical dataset should remain traceable to the original source.

---

# 6. Source Traceability

Curriculum information should remain traceable wherever practical.

The basic evidence chain is:

```text
Series
↓
Book
↓
Unit / Section
↓
Page
↓
Curriculum Entity
```

This allows:

- human verification;
- correction;
- auditing;
- source comparison;
- debugging;
- and later curriculum interpretation.

Derived intelligence should preserve sufficient references to determine which curriculum evidence produced it.

---

# 7. Phase 2 — Book Intelligence / Horizontal Mapping

Phase 2 interprets verified curriculum evidence into concise book-level intelligence (D017).

Its primary question is:

> **What does this book teach unit by unit, in a form teachers can use—and that later phases can test?**

Possible Phase 2 responsibilities may include interpreting:

- vocabulary function;
- language functions;
- grammatical structures;
- productive language requirements;
- receptive vs productive demands;
- skill requirements;
- prerequisite knowledge;
- likely learner demands;
- linguistic complexity;
- and pedagogically meaningful patterns.

Phase 2 should consume Phase 1 evidence rather than replace it.

Conceptually:

```text
Verified Curriculum Evidence
        ↓
AI / Linguistic Interpretation
        ↓
Derived Curriculum Intelligence
```

Phase 2 outputs should remain identifiable as interpretation.

They should not silently become Phase 1 book truth.

**Current direction (D017 Progressive Curriculum Intelligence — not a methodology/schema lock):** Phase 2 aims for minimum-sufficient **Book Intelligence** (concise, teacher-readable horizontal overviews), not exhaustive unit analysis as production default. Earlier V3.1 / Cross-Unit V1.2 artifacts remain research evidence; see [`phase-2/phase-2-experiment-status.md`](./phase-2/phase-2-experiment-status.md).

---

# 8. Phase 3 — Series Intelligence / Vertical Mapping

**Status:** **PARKED — later priority (D020 / F005).** Not unlocked, scheduled, or productized now. Park reason is sequencing/priority, **not** “wait until Phase 2 overviews are sufficient.”

Phase 3’s eventual **teacher-facing** role is cross-book / cross-grade **prior-learning retrieval and reuse** — conceptually parallel to within-book horizontal mapping, differently scoped (D020):

| | Horizontal (current) | Vertical (Phase 3, later) |
|---|---|---|
| Source of reuse | Earlier units in the **same** book | Earlier **books / grades** |
| AI | Suggest small evidence-grounded set (e.g. 0–5) | Same pattern when later built |
| Teacher | Select / deselect / replace / add / use none | Same |
| Mastery | Exposure ≠ mastery | Same |

It may still identify introduction, recycling, extension, and increasing complexity (D017), but is **not** framed merely as abstract progression analysis. Primary educational rationale: cumulative practice and consolidation.

**Non-binding example:** Teaching BE3 Unit 8 can use horizontal mapping from BE3 Units 1–7; teaching BE3 Unit 1 has no earlier units in-book — later, vertical mapping could optionally suggest suitable prior learning from BE2 Units 1–9. No eligibility rules, matching logic, UI, or timeline are locked by this example.

Its connecting question remains:

> **How does this learning connect to other learning across books and grades — and what prior language can the teacher optionally reuse now?**

```text
Previous Learning (other books / grades)
↓
Current Learning
↓
Future Learning
```

Phase 3 should use verified evidence and appropriate Phase 2 interpretation rather than inferring progression from raw source files alone. Do **not** imply all prior-book material should be reused. Preserve source evidence vs AI suggestion vs teacher selection vs mapper-generated application.

---

# 9. Phase 4 — Teaching Intelligence

Phase 4 deliberately adds teacher-focused intelligence beyond the curriculum source (scaffolding, recycling, enrichment, preparation—D017).

Its primary question is:

> **What useful teaching opportunities can we deliberately add beyond the textbook?**

The textbook remains the curriculum anchor.

The general rule is:

> **FLOOR FIRST. DEPTH SECOND.**

Phase 4 may add:

- recycled language;
- extension vocabulary;
- additional sentence combinations;
- productive speaking opportunities;
- question formation;
- scaffolding;
- error-prevention practice;
- learner-context enrichment;
- personalization;
- and additional language depth.

This information must remain distinguishable from book evidence.

Conceptually:

```text
CURRICULUM EVIDENCE
        +
CURRICULUM INTERPRETATION
        +
CURRICULUM CONNECTIONS
        ↓
TEACHER ENRICHMENT
```

Teacher enrichment extends the curriculum.

It does not rewrite it.

---

# 10. Phase 5 — Lesson Packaging & Structure

Phase 5 prepares curriculum intelligence for downstream lesson-generation systems.

Its primary question is:

> **What information should be handed to a lesson-generation system, and how should it be structured?**

Possible inputs include:

```text
Curriculum Floor
+
Required Vocabulary
+
Required Language
+
Relevant Previous Learning
+
Curriculum Relationships
+
Teacher Enrichment
+
Scaffolding Guidance
+
Generation Constraints
```

The output should be a structured lesson package rather than an unfiltered dump of all available curriculum data.

Phase 5 acts as the boundary between:

> **curriculum intelligence**

and:

> **lesson generation.**

The exact lesson-package structure is not yet permanently locked.

---

# 11. Phase 6 — Lesson Generation

Phase 6 turns the lesson package into usable teaching material.

**Current research emphasis (upstream of this phase):** teacher-directed horizontal mapping for cumulative learning (Phase 2 evidence/interpretation). **D018** remains LOCKED historical/downstream prompt-validation evidence (V2b preferred; V3 pending formal evaluation; Lesson Series approved but not authorized). Phase 6 work here stays experimental packaging/generation practice when later authorized — not a locked product or schema.

**Operational reference (external tool):** [`phase-6/chalkie-interface-and-generation-workflow.md`](./phase-6/chalkie-interface-and-generation-workflow.md) documents observed Chalkie UI settings and generation/export behavior for experiments. Keep layers distinct: **curriculum evidence** → **lesson packaging (prompt)** → **external generation (Chalkie)** → **output evaluation**. Do not treat Chalkie settings or generated slides as curriculum SoT, and do not invent a new data model from the UI guide.

Possible outputs may eventually include:

- lesson slides;
- teacher presentations;
- worksheets;
- speaking activities;
- quizzes;
- practice activities;
- games;
- review material;
- and other classroom resources.

Conceptually:

```text
Lesson Package
↓
Generation System
↓
Teaching Material
↓
Teacher Review
```

Generated teaching material should be treated as a proposal requiring teacher judgement.

It should not be treated as curriculum truth.

The teacher remains the final professional decision-maker.

---

# 12. Phase 7 — Evaluation & Refinement

Phase 7 closes the feedback loop.

Its primary question is:

> **What can we learn from the quality and usefulness of the system's outputs?**

Potential evidence may include:

- extraction errors;
- human corrections;
- mapping problems;
- enrichment quality;
- teacher feedback;
- generation failures;
- recurring learner difficulties;
- curriculum omissions;
- and successful teaching patterns.

Conceptually:

```text
Evaluation Evidence
↓
Refinements to earlier phases / process / schema / tooling
```

Phase 7 must not silently rewrite Phase 1 book-truth. Corrections that change source evidence should flow back through verification and versioning.

---

# 13. Cross-cutting storage (infrastructure)

Curriculum **content** remains JSON-first (Phase 1). **Files** live in private object storage; **catalog identity** lives in PostgreSQL.

Intended split (D010; see [`10-storage-architecture.md`](./10-storage-architecture.md)):

- **Cloudflare R2** — textbook source PDFs (`book-sources`), preserving existing object keys
- **Supabase Storage** — dataset JSON (`book-datasets`) and covers (`book-assets`) until separately decided
- **Supabase** — Auth + PostgreSQL catalog (`book_files` pointers, `dataset_versions`)

This is an infrastructure concern. It does not change phase boundaries or curriculum schema.

---

# 14. Related documents

- [2-tech-stack.md](./2-tech-stack.md)
- [8-database-architecture.md](./8-database-architecture.md)
- [10-storage-architecture.md](./10-storage-architecture.md)
- [11-curriculum-mapping-workflow.md](./11-curriculum-mapping-workflow.md)
- [4-decisions.md](./4-decisions.md)
