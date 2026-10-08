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

# 7. Phase 2 — AI Curriculum & Linguistic Interpretation

Phase 2 interprets verified curriculum evidence.

Its primary question is:

> **What does this curriculum evidence mean educationally and linguistically?**

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

---

# 8. Phase 3 — Curriculum Connections & Vertical Mapping

Phase 3 examines relationships across curriculum evidence.

Its primary question is:

> **How does this learning connect to other learning?**

Possible relationships include:

```text
Previous Learning
↓
Current Learning
↓
Future Learning
```

Phase 3 may eventually identify:

- vocabulary recycling;
- language progression;
- grammar progression;
- repeated sentence structures;
- prerequisite relationships;
- skill progression;
- concept recurrence;
- cross-unit relationships;
- cross-book relationships;
- cross-level relationships;
- and cross-series relationships.

This phase creates the actual curriculum mapping layer.

Phase 3 should use verified evidence and appropriate Phase 2 interpretation rather than attempting to infer curriculum progression directly from raw source files.

---

# 9. Phase 4 — Teacher Enrichment

Phase 4 deliberately adds teacher-focused intelligence beyond the curriculum source.

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
- [4-decisions.md](./4-decisions.md)