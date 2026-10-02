# General Curriculum Mapper — Project Overview

**Status:** ACTIVE / EVOLVING  
**Project:** General Curriculum Mapper  
**Current Development Focus:** Phase 1 — Curriculum Extraction & Dataset Development

---

## 1. Project Purpose

The **General Curriculum Mapper** is a textbook-agnostic curriculum intelligence system.

Its purpose is to take curriculum source material, such as Student Books and Workbooks, and transform it into structured, traceable curriculum data that can later be interpreted, connected across books and levels, enriched for teaching purposes, and used to support lesson planning and lesson generation.

The system should help answer three fundamental questions:

1. **What should students already know before this lesson?**
2. **What needs to be learned and practised now?**
3. **What will students need later, and how does the current learning prepare them for it?**

The long-term objective is not simply to digitize textbooks.

The objective is to build useful **curriculum intelligence** that helps teachers understand learning progression and create stronger lessons.

---

## 2. Core Principle

The textbook remains the **curriculum anchor**, but the system must be capable of understanding more than one textbook structure.

The architecture must therefore be:

- textbook-agnostic,
- series-agnostic,
- evidence-driven,
- traceable to source material,
- extensible,
- human-verifiable,
- and capable of evolving as new curriculum structures are discovered.

The system should not force every textbook into a structure designed around the first book processed.

Different books and series should be allowed to reveal what the eventual data model needs.

---

## 3. Current Development Dataset

The initial development and testing dataset consists of three textbook series.

### Beehive

- Beehive 1
- Beehive 2

**Total: 2 books**

Beehive provides the original development dataset and continuity with earlier curriculum mapping experiments.

---

### Big English

Big English is the curriculum currently used at the school.

Available material:

- Big English 1 — Student Book
- Big English 1 — Workbook
- Big English 2 — Student Book
- Big English 2 — Workbook
- Big English 3 — Student Book
- Big English 3 — Workbook
- Big English 4 — Student Book
- Big English 4 — Workbook
- Big English 5 — Student Book
- Big English 5 — Workbook
- Big English 6 — Student Book
- Big English 6 — Workbook

**Total: 12 books**

Big English provides the most complete vertical curriculum sequence in the initial dataset and has immediate real-world usefulness because it is the curriculum currently being taught.

---

### Reach Higher

Available material:

- Reach Higher 2A
- Reach Higher 2B
- Reach Higher 3A
- Reach Higher 4A

**Total: 4 books**

Reach Higher provides an additional publisher and curriculum structure for testing whether the system generalizes beyond Beehive and Big English.

---

### Initial Dataset Total

**18 books across 3 textbook series**

This dataset is intended to provide enough variation to discover, test and refine the General Curriculum Mapper's data structure.

It is not intended to represent the permanent limits of the system.

Future textbook series and updated school curriculum materials should be incorporable without redesigning the entire architecture.

---

## 4. Development Philosophy

The project is deliberately **iterative rather than strictly linear**.

The conceptual phases remain separate because each phase performs a different function.

However, development may move between phases when testing reveals missing information or structural problems.

For example:

**Phase 1 → Phase 3 → Phase 4 → Phase 1 → Phase 2**

is a valid development path.

A later phase may reveal that important information was not captured during extraction. In that case, the correct response is to improve the earlier phase rather than compensate for the missing information downstream.

The project should evolve from evidence produced by actual textbook processing and real teaching use.

---

## 5. System Phases

The current conceptual architecture remains:

### Phase 1 — Curriculum Extraction & Structure

Extract and structure what the curriculum sources actually contain.

### Phase 2 — AI Curriculum & Linguistic Interpretation

Interpret the pedagogical and linguistic meaning of the extracted curriculum evidence.

### Phase 3 — Curriculum Connections & Vertical Mapping

Connect learning across pages, units, books and levels.

### Phase 4 — Teacher Enrichment

Add deliberate teaching intelligence that strengthens learning without replacing or distorting the curriculum.

### Phase 5 — Lesson Packaging & Structure

Select and package the curriculum intelligence needed for a particular lesson or teaching context.

### Phase 6 — Lesson Generation

Use the packaged curriculum intelligence to support AI-assisted lesson generation.

### Phase 7 — Evaluation & Refinement

Evaluate outputs, identify where problems originated, and improve the appropriate phase.

---

## 6. Current Priority — Phase 1

The immediate priority is to build a reliable **Phase 1 dataset** from the available 18 books.

The purpose is not merely to finish extracting the books.

Processing these books should teach us:

- which data structures are common across textbook series,
- which structures are series-specific,
- which fields are genuinely useful,
- which fields are unnecessary,
- which information is difficult for AI to classify,
- where human verification is necessary,
- where the current schema fails,
- and what the eventual automated system needs to support.

Phase 1 therefore serves two purposes:

**1. Build useful curriculum datasets.**

**2. Discover the correct architecture for future curriculum ingestion.**

---

## 7. Phase 1 Working Pipeline

The current intended workflow is:

**PDF Source**

↓

**AI Extraction**

↓

**Structured JSON**

↓

**Automated Validation**

↓

**Human Verification**

↓

**Canonical Book Dataset**

↓

**Google Sheets / React Viewer**

Each book should ultimately produce a structured, verified dataset that preserves traceability to the original source.

Google Sheets and the React application are primarily interfaces for inspecting, comparing and validating the structured curriculum data.

They are not themselves the source of curriculum truth.

---

## 8. Canonical Book Dataset

The current direction is for each processed book to produce **one canonical structured JSON dataset**.

Individual units or sections may be processed separately for extraction reliability, but their verified results should ultimately be combined into the canonical dataset for that book.

Example:

`big_english_1_student_book.json`

The precise JSON structure should not be permanently fixed before sufficient cross-series testing has occurred.

The initial schema should provide a strong baseline while allowing new textbook structures to expose legitimate schema gaps.

---

## 9. Schema Discovery Principle

The system should not silently invent permanent fields whenever unfamiliar textbook content appears.

When source material cannot be represented properly by the current schema, the system should identify a **schema gap**.

A schema gap should record:

- the source,
- the content that cannot be represented adequately,
- the closest existing structure,
- the proposed new structure or field,
- the reason it may be necessary,
- and supporting source evidence.

Schema changes can then be reviewed before becoming part of the canonical model.

This allows the data model to evolve from evidence rather than assumptions.

---

## 10. Cross-Series Validation

The three textbook series should deliberately be used to challenge the architecture.

The objective is not to create:

- a Beehive mapper,
- a Big English mapper,
- or a Reach Higher mapper.

The objective is to discover a structure capable of representing all three while preserving meaningful differences between them.

Early testing should therefore include material from different series rather than completing an entire series before testing another.

This reduces the risk of accidentally designing the system around one publisher's curriculum structure.

---

## 11. Human Verification

AI extraction should reduce manual workload, not remove human oversight.

Human verification remains particularly important for:

- page identification,
- vocabulary classification,
- language structures,
- visual activities,
- audio-dependent activities,
- ambiguous instructions,
- source relationships,
- extraction uncertainty,
- and proposed schema changes.

The goal is to move human effort away from repetitive copying and formatting and toward **checking curriculum accuracy and making meaningful decisions**.

---

## 12. Target Quality

The system does not need theoretical perfection before it becomes useful.

The working target is approximately **90% reliable and useful**, provided that:

- important information is captured,
- uncertainty is visible,
- source evidence remains traceable,
- errors can be corrected,
- the system improves through testing,
- and teachers retain final judgement.

This is a working qualitative target during development, not currently a formal automated acceptance threshold.

The project should prioritize useful, reliable structure over unnecessary complexity.

---

## 13. Teacher-Facing Objective

Later phases should transform the structured curriculum data into information teachers can actually use.

The eventual system should help teachers understand:

- expected prior knowledge,
- documented prior learning,
- current learning requirements,
- future learning dependencies,
- vocabulary progression,
- language progression,
- grammar development,
- question and answer formation,
- full-sentence production,
- deliberate recycling,
- speaking progression,
- common learner errors,
- Korean-English language interference where relevant,
- useful scaffolding,
- interactive practice opportunities,
- and appropriate enrichment.

A central principle is:

**Knowing vocabulary does not necessarily mean students can use that vocabulary productively.**

The mapper should therefore support progression from recognition toward accurate, independent language use.

---

## 14. Lesson Generation

AI lesson generation remains part of the long-term architecture, but it is **not the current development priority**.

Previous Chalkie testing has already demonstrated that structured curriculum intelligence can produce useful AI-generated lesson skeletons.

Current development should therefore focus on strengthening the upstream curriculum dataset and mapping system.

Chalkie or other lesson-generation systems can be revisited once the curriculum intelligence pipeline is sufficiently reliable.

---

## 15. React Application

A React application will be used during development to help inspect and understand the curriculum datasets.

The initial React application does not need to be the final production system.

Its purpose is to help expose:

- missing data,
- poor classifications,
- awkward structures,
- schema inconsistencies,
- cross-book relationships,
- cross-series differences,
- and useful teacher-facing views.

The interface should therefore evolve alongside the curriculum model.

---

## 16. Current Success Definition

The current project milestone is:

> **Prove that the General Curriculum Mapper can reliably extract, structure, verify and display curriculum data from substantially different textbook series without losing important curriculum information or forcing every source into an inappropriate fixed structure.**

Success at this stage does **not** require:

- complete automation,
- perfect extraction,
- perfect enrichment,
- perfect lesson generation,
- or a finished production application.

It requires a sufficiently accurate and useful curriculum model that can continue evolving as additional books and curriculum sources become available.

---

## 17. Long-Term Direction

The eventual system should be capable of accepting a new:

- book,
- level,
- curriculum series,
- or complete curriculum,

and progressively building curriculum intelligence from it.

The intended long-term flow is:

**Source Material**

→ **Structured Curriculum Evidence**

→ **AI Interpretation**

→ **Vertical & Horizontal Curriculum Connections**

→ **Teacher Enrichment**

→ **Lesson-Specific Curriculum Intelligence**

→ **Lesson Planning / AI Lesson Generation**

→ **Teacher Evaluation**

→ **System Refinement**

The goal is not automation for its own sake.

The goal is to build a curriculum system that understands enough about **what students learned, what they are learning, and what they need next** to genuinely help teachers teach better.