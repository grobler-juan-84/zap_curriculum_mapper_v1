# Phase 1 — Extraction & Dataset Specification

**Status:** ACTIVE / EVOLVING  
**Project:** General Curriculum Mapper  
**Phase:** 1 — Curriculum Extraction & Structure  
**Current Priority:** Build and validate structured datasets across multiple textbook series.

---

# 1. Purpose of Phase 1

Phase 1 converts curriculum source material into structured, traceable and human-verifiable curriculum data.

Its primary responsibility is to answer:

> **What does the source material actually contain?**

Phase 1 should capture the curriculum evidence accurately before later phases attempt to interpret, connect, enrich or generate lessons from it.

The objective is not simply to extract text from PDFs.

The objective is to create a structured representation of each book that another AI system, software system or human reviewer can understand without needing to guess what the original source contained.

---

# 2. Phase 1 Responsibilities

Phase 1 is responsible for:

- source identification,
- book metadata,
- unit and section structure,
- page identification,
- vocabulary extraction,
- language structure extraction,
- activity extraction,
- continuous text extraction,
- story identification,
- phonics content,
- skills content,
- projects,
- review material,
- workbook content,
- source relationships,
- visible curriculum progression within the source,
- extraction uncertainty,
- source traceability,
- schema-gap detection,
- automated structural validation,
- human verification,
- and creation of the canonical book dataset.

Phase 1 should preserve what the book says as faithfully as practical.

---

# 3. Phase 1 Does NOT Do

Phase 1 should not normally:

- create lesson plans,
- generate Chalkie prompts,
- create presentation slides,
- create worksheets,
- invent extension vocabulary,
- invent grammar objectives,
- add unrelated activities,
- decide teaching methodology,
- create elaborate games,
- add Korean-English error correction,
- decide what teachers should teach beyond the source,
- infer vertical curriculum relationships across books,
- or silently enrich book content.

Those responsibilities belong primarily to later phases.

Where interpretation is unavoidable during extraction, it should remain limited and traceable.

---

# 4. Book Truth Principle

The original curriculum source remains the primary evidence.

Phase 1 must preserve a clear distinction between:

**SOURCE EVIDENCE**

and

**AI INTERPRETATION**

The extraction system should never silently convert an AI assumption into book truth.

When information cannot be verified confidently, the system should record uncertainty rather than guess.

Examples:

- `UNCERTAIN — vocabulary classification requires manual verification`
- `AUDIO REQUIRED — answer cannot be fully verified from page alone`
- `VISUAL VERIFICATION REQUIRED`
- `SCHEMA GAP — current structure may not adequately represent this content`

Visible uncertainty is preferable to false certainty.

---

# 5. Initial Development Dataset

Phase 1 will initially be developed and tested using 18 books from three textbook series.

## Beehive

- Beehive 1
- Beehive 2

**Total: 2 books**

## Big English

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

## Reach Higher

- Reach Higher 2A
- Reach Higher 2B
- Reach Higher 3A
- Reach Higher 4A

**Total: 4 books**

The purpose of using multiple series is to prevent the Phase 1 structure from becoming dependent on one publisher's textbook design.

---

# 6. Phase 1 Working Pipeline

The current intended workflow is:

**PDF Source**

↓

**Source Registration**

↓

**Book Structure Identification**

↓

**Extraction Batches**

↓

**AI Extraction**

↓

**Structured JSON**

↓

**Automated Validation**

↓

**Human Verification**

↓

**Merge Approved Batches**

↓

**Whole-Book Audit**

↓

**Canonical Book Dataset**

↓

**Google Sheets / React Viewer**

↓

**Phase 1 Complete**

This workflow may evolve as testing reveals better methods.

---

# 7. Step 1 — Source Registration

Before extraction begins, each source should receive basic identifying metadata.

At minimum:

- Series
- Book / Level
- Book Type
- Edition, where known
- Publisher, where useful
- Source filename
- Source format
- Total PDF pages
- Printed page range, where identifiable
- Extraction status
- Schema version
- Verification status

Example:

```text
Series: Big English
Level: 1
Book Type: Student Book
Source: PDF
Schema Version: 0.1
Status: Not Started
```

The purpose is to ensure every extracted record can ultimately be traced back to a known source.

---

# 8. Step 2 — Book Structure Identification

Before detailed extraction, the system should identify the broad structure of the book.

This may include:

- front matter,
- table of contents,
- units,
- lessons,
- sections,
- review sections,
- stories,
- phonics sections,
- CLIL sections,
- projects,
- assessment material,
- reference material,
- appendices,
- and other recurring structures.

The system should not assume that every series organizes curriculum in the same way.

Book structure should be discovered from the source.

This step helps determine appropriate extraction batches.

---

# 9. Step 3 — Extraction Batching

A complete book should not automatically be treated as one extraction request.

The preferred initial approach is to process logical sections of the book separately.

The default starting point is:

> **One unit = one extraction batch**

However, batch size should be determined by extraction reliability rather than an arbitrary rule.

A unit may be divided further when:

- it contains too many pages,
- the model begins omitting content,
- output becomes too large,
- activity structure becomes confused,
- visual complexity is unusually high,
- stories require separate handling,
- or testing demonstrates better accuracy with smaller batches.

Likewise, multiple small sections may eventually be processed together if testing demonstrates reliable extraction.

The governing principle is:

> **Use the largest extraction batch that remains reliably accurate and complete.**

---

# 10. Step 4 — AI Extraction

Each extraction batch is processed using the approved Phase 1 extraction prompt in **`3-Google_AI_Studio_Prompt.md`**.

That prompt currently supports supplying the **complete textbook PDF** as the source. When used that way, the model must first identify overall book structure, then extract **unit by unit**:

> **One unit = one extraction batch = one separate JSON output**

Each unit output should be labeled outside the JSON with a recommended filename (for example `FILE: <book_id>_unit_01.json`) so it can be saved as an independent batch file, validated, human-verified and later merged. Do not treat a single whole-book JSON as the Phase 1 extraction output at this stage.

The extraction model should:

1. inspect the relevant source pages,
2. identify their curriculum structure,
3. extract the required information,
4. preserve source relationships,
5. classify information only where supported,
6. flag uncertainty,
7. identify information the current schema cannot represent,
8. and return structured machine-readable output.

The preferred primary output format is:

> **Structured JSON**

TSV may still be generated later for human inspection, spreadsheet use or export.

TSV should not need to be the canonical machine representation.

---

# 11. Core Information to Capture

The exact schema will evolve, but Phase 1 should currently be capable of representing the following major information groups.

## Book Metadata

Information identifying the curriculum source.

## Units

Major curriculum divisions and their high-level characteristics.

## Pages

Page identity, location and curriculum context.

## Vocabulary

Words and lexical items appearing with meaningful pedagogical purpose.

Current vocabulary categories may include:

- Target Vocabulary
- Recycled Vocabulary
- Supporting / Context Vocabulary
- Instructional Vocabulary

These classifications should remain evidence-driven and may evolve through cross-series testing.

## Language

Actual language structures presented or practised by the source.

Examples include:

- model sentences,
- question frames,
- answer frames,
- dialogues,
- grammar patterns,
- functional language,
- sentence frames,
- story language,
- and repeated productive structures.

Actual usable language should be preserved rather than reduced to broad labels wherever practical.

## Activities

Individual learning activities and their structure.

Potential information includes:

- activity number,
- instruction,
- prompt,
- item,
- expected answer,
- language frame,
- activity type,
- source dependency,
- and verification notes.

## Continuous Text

Text that should remain structurally intact rather than being incorrectly represented as isolated activity answers.

Examples:

- stories,
- reading passages,
- dialogues,
- chants,
- songs,
- model conversations,
- and other continuous language.

## Skills / Curriculum Components

Where explicitly represented by the book:

- listening,
- speaking,
- reading,
- writing,
- phonics,
- CLIL,
- projects,
- review,
- values,
- pronunciation,
- or other series-specific curriculum components.

## Source Relationships

Relationships explicitly supported by the source.

Examples:

- Workbook practice linked to Student Book content,
- review sections linked to earlier unit content,
- story sections connected to unit language,
- or repeated structures within the same book.

## Extraction Issues

Anything requiring human review.

## Schema Observations

Information that may expose limitations in the current data model.

---

# 12. Vocabulary Classification Principle

A word appearing on a page does not automatically make it target vocabulary.

Vocabulary classification should consider pedagogical purpose.

The system should distinguish, where reasonably possible, between:

### Target Vocabulary

Words the source explicitly introduces or expects students to learn.

### Recycled Vocabulary

Previously known vocabulary deliberately reused for further practice.

### Supporting / Context Vocabulary

Language needed to understand a text, image, instruction or context but not clearly presented as a learning target.

### Instructional Vocabulary

Words used to explain what students should do.

For example, a word such as **sequence** appearing in an instruction should not automatically become lesson target vocabulary.

When classification is genuinely unclear, it should be flagged for human verification.

---

# 13. Language Extraction Principle

Phase 1 should preserve the language students are actually exposed to and expected to use.

For example:

```text
What color is the door?
It is white.
```

should not be reduced only to:

```text
Grammar: Colors
```

Where the book provides usable language, the dataset should preserve usable language.

This becomes important later when the mapper needs to understand:

- question formation,
- answer formation,
- sentence construction,
- language recycling,
- productive language progression,
- and future curriculum relationships.

---

# 14. Visual and Audio Dependencies

Some textbook activities cannot be completely understood from text extraction alone.

The dataset should identify when an activity depends on:

- images,
- illustrations,
- diagrams,
- page layout,
- audio,
- video,
- teacher resources,
- stickers,
- cut-outs,
- or other external material.

The AI should provide the best-supported interpretation available from the source but should not fabricate missing information.

Where necessary:

```text
AUDIO REQUIRED — answer cannot be fully verified from page alone
```

or:

```text
VISUAL VERIFICATION REQUIRED
```

should be recorded.

---

# 15. Automated Validation

After AI extraction, the output should pass through automated structural checks before human approval.

Potential validation checks include:

- valid JSON,
- required metadata present,
- valid source identifiers,
- valid unit identifiers,
- valid page references,
- duplicate records,
- missing page ranges,
- unexpected page gaps,
- malformed classifications,
- orphaned activities,
- orphaned vocabulary records,
- broken relationships,
- missing required identifiers,
- invalid enumeration values,
- and schema version compatibility.

Automated validation checks whether the **data structure is internally valid**.

It does not prove that the AI correctly understood the textbook.

That remains part of human verification.

---

# 16. Human Verification

Human verification should focus on curriculum accuracy rather than manual formatting.

The reviewer should primarily check:

- Were all relevant pages represented?
- Was important content omitted?
- Was content assigned to the correct unit or section?
- Was target vocabulary classified correctly?
- Were language structures captured accurately?
- Were activities represented correctly?
- Were stories and continuous text handled appropriately?
- Were visual/audio limitations flagged correctly?
- Did the AI invent anything?
- Are uncertainty flags reasonable?
- Did the extraction expose a genuine schema gap?

Human corrections should become useful evidence for improving later extraction.

---

# 17. Verification Status

Extracted information should be capable of carrying verification status.

Possible states may include:

```text
UNVERIFIED
AI_VALIDATED
HUMAN_VERIFIED
NEEDS_REVIEW
SOURCE_DEPENDENCY
```

The final naming may change.

The important principle is that the system should distinguish between:

> **data produced by the AI**

and

> **data that has actually been checked against the source.**

---

# 18. Schema Gap Detection

A major purpose of the initial 18-book dataset is to discover what the final curriculum structure needs to represent.

The extraction model should therefore identify content that cannot be adequately represented by the current schema.

A schema gap should include, where possible:

```text
Source
Book
Unit
Page
Content Type
Observed Content
Closest Existing Field / Structure
Problem
Proposed Field / Structure
Reason
Example Evidence
Review Status
```

The model may **propose** schema changes.

It should not silently make permanent architecture decisions.

---

# 19. Schema Change Process

When a schema gap is identified:

1. Record the gap.
2. Verify that the source genuinely contains the information.
3. Check whether an existing field can represent it adequately.
4. Check whether the issue occurs elsewhere.
5. Determine whether it is:
   - book-specific,
   - series-specific,
   - or potentially universal.
6. Decide whether the schema should change.
7. Update the schema version if required.
8. Determine whether previously processed books need reprocessing or migration.

Not every unusual textbook feature deserves a new permanent field.

The goal is:

> **flexibility without uncontrolled schema growth.**

---

# 20. Cross-Series Schema Testing

Schema development should deliberately alternate between textbook series during early testing.

Recommended initial sequence:

```text
Beehive 1
↓
Big English 1
↓
Reach Higher 2A
↓
Schema Review
↓
Additional books
```

The exact sequence may change.

The important principle is to expose the schema to substantially different textbook structures early.

This reduces the risk of designing a:

- Beehive-specific schema,
- Big English-specific schema,
- or Reach Higher-specific schema.

---

# 21. Canonical Book Dataset

Once all extraction batches for a book have been validated and approved, they should be merged into:

> **one canonical Phase 1 dataset for that book**

Example:

```text
big_english_1_student_book.json
```

The canonical dataset should contain or reference:

- book metadata,
- source structure,
- units,
- pages,
- vocabulary,
- language,
- activities,
- continuous text,
- curriculum components,
- source relationships,
- extraction issues,
- uncertainty,
- verification status,
- schema observations,
- and schema version.

The exact implementation will be defined separately in the Phase 1 JSON Schema specification.

---

# 22. Whole-Book Audit

Before a book is marked Phase 1 complete, the merged dataset should receive a whole-book audit.

The audit should check:

## Coverage

- Were all instructional pages processed?
- Were all units processed?
- Were review sections included?
- Were stories included?
- Were projects included?
- Were relevant appendices included?

## Consistency

- Are repeated vocabulary classifications reasonably consistent?
- Are recurring activity structures represented consistently?
- Are recurring language structures represented consistently?
- Are source identifiers consistent?

## Integrity

- Are there duplicate records?
- Are relationships valid?
- Are page references valid?
- Are extraction batches correctly merged?

## Uncertainty

- Are unresolved uncertainty flags visible?
- Are unresolved source dependencies visible?
- Are schema gaps documented?

The audit should not silently remove unresolved problems.

---

# 23. Phase 1 Completion Criteria

A book may be marked:

> **PHASE 1 COMPLETE**

when:

- all relevant source sections have been processed,
- extraction output is structurally valid,
- required human verification has been completed,
- major omissions have been resolved,
- unresolved uncertainties are clearly documented,
- schema gaps are recorded,
- the whole-book audit has passed,
- and the canonical book dataset has been created.

Phase 1 Complete does not mean the curriculum has been interpreted, vertically mapped, enriched or converted into lessons.

It means:

> **the source has been represented accurately enough to become reliable input for later phases.**

---

# 24. Google Sheets Role

Google Sheets may be used as a human-friendly inspection and verification interface.

Structured JSON remains the preferred canonical machine representation.

Google Sheets may display normalized views such as:

- Sources
- Books
- Units
- Pages
- Vocabulary
- Language
- Activities
- Continuous Text
- Relationships
- Extraction Issues
- Schema Gaps

The exact tabs should evolve based on what proves useful during testing.

Google Sheets should not force the underlying curriculum model into unnecessary spreadsheet limitations.

---

# 25. React Viewer Role

The React application should initially function as a **dataset inspection and validation tool**.

Its purpose is to help reveal:

- missing information,
- extraction problems,
- inconsistent classifications,
- awkward schema structures,
- cross-book relationships,
- cross-series differences,
- useful curriculum views,
- and potential teacher-facing features.

The React interface may therefore evolve significantly during Phase 1.

This is expected.

The interface should help us understand the data model rather than prematurely dictate it.

---

# 26. Error Learning

Human corrections should not simply disappear after fixing individual records.

Repeated extraction errors should be analysed.

Examples:

```text
Repeatedly misclassifies instructional vocabulary
Repeatedly misses model dialogues
Repeatedly confuses printed page and PDF page
Repeatedly omits review sections
Repeatedly breaks continuous stories into activity answers
```

Repeated problems may indicate a need to change:

- the extraction prompt,
- extraction batch size,
- schema,
- validation rules,
- preprocessing,
- or human verification procedure.

This is how processing the initial dataset should progressively improve the system.

---

# 27. Dataset Before Automation

The project should resist prematurely building a complex automated ingestion system.

The initial objective is to learn:

- what needs to be extracted,
- what AI can extract reliably,
- what needs human checking,
- what the schema needs,
- and what workflow actually works.

Small automation that reduces repetitive work is encouraged.

Examples:

- automated Gemini calls,
- JSON validation,
- batch processing,
- automatic Google Sheets population,
- extraction status tracking,
- and dataset merging.

Large production architecture should wait until the manual/semi-automated process has generated sufficient evidence.

---

# 28. Phase 1 Success Target

Phase 1 does not require perfect AI extraction.

The working target is approximately:

> **90% reliable and useful extraction with efficient human verification.**

Success means that:

- important curriculum content is consistently captured,
- errors are discoverable,
- uncertainty is visible,
- provenance is preserved,
- human corrections are manageable,
- different textbook structures can be represented,
- and the dataset is useful for later curriculum mapping.

A system that is 90% reliable and easy to verify may be more useful than a theoretically sophisticated system that hides uncertainty.

---

# 29. Phase 1 Development Loop

The expected development loop is:

```text
Extract
↓
Validate
↓
Verify
↓
Inspect
↓
Discover Problem
↓
Identify Cause
↓
Adjust Prompt / Schema / Batch / Validation
↓
Re-test
↓
Continue Dataset
```

Later phases may also reveal missing Phase 1 information.

When that occurs:

```text
Later Phase
↓
Missing Required Evidence Identified
↓
Return to Phase 1
↓
Improve Extraction
↓
Update Dataset
↓
Continue
```

This is expected behaviour.

It is not a failure of the phase model.

---

# 30. Current Immediate Experiment

Before processing all 18 books, the Phase 1 workflow should be proven on representative material from each textbook series.

Initial representative sources:

1. **Beehive 1**
2. **Big English 1**
3. **Reach Higher 2A**

The first objective is not necessarily to complete all three immediately.

The objective is to prove:

**PDF → Extraction Batch → Structured JSON → Validation → Human Verification → Canonical Dataset**

while exposing the current schema to three different textbook structures.

Once this workflow is sufficiently reliable, processing of the broader 18-book dataset can accelerate.

---

# 31. Core Phase 1 Principle

> **Extract what the source actually contains, preserve where it came from, expose uncertainty, allow different books to reveal structural needs, and only then build the architecture around the evidence.**

Phase 1 exists to create trustworthy curriculum evidence.

Everything downstream depends on that foundation.