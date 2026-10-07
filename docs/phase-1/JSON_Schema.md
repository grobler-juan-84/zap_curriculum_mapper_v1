# Phase 1 — JSON Schema

**Status:** ACTIVE / EVOLVING  
**Project:** General Curriculum Mapper  
**Phase:** 1 — Curriculum Extraction & Structure  
**Schema Status:** Working Development Schema  
**Purpose:** Define the canonical machine-readable structure for Phase 1 curriculum extraction.

---

# 1. Purpose

The Phase 1 JSON schema defines how extracted curriculum evidence is represented in a consistent, machine-readable format.

The schema must support:

- AI extraction,
- automated validation,
- human verification,
- Google Sheets export,
- React display,
- cross-book comparison,
- cross-series comparison,
- later curriculum mapping,
- and future database ingestion.

The schema is not considered permanently fixed.

The initial 18-book development dataset will be used to test and refine it.

---

# 2. Core Schema Principle

The schema should provide:

> **Consistency without artificial uniformity.**

Common curriculum structures should be represented consistently.

Different textbook structures should not be forced into inappropriate fields simply to maintain a rigid schema.

When valid source content cannot be represented adequately, the extraction process should create a **schema-gap record** rather than silently discard, distort or invent a structure for it.

---

# 3. Canonical Dataset

Each completed book should ultimately have one canonical Phase 1 JSON dataset.

Example:

```text
big_english_1_student_book.json
```

A book may be extracted in multiple batches.

Example:

```text
big_english_1_unit_01.json
big_english_1_unit_02.json
big_english_1_unit_03.json
```

These batch files are intermediate extraction artifacts.

Once validated and verified, they should be merged into the canonical book dataset.

---

# 4. Top-Level Structure

The initial canonical structure is:

```json
{
  "schema": {},
  "book": {},
  "units": [],
  "pages": [],
  "vocabulary": [],
  "language": [],
  "activities": [],
  "continuous_text": [],
  "curriculum_components": [],
  "relationships": [],
  "extraction_issues": [],
  "schema_gaps": [],
  "verification": {}
}
```

This structure is intentionally normalized.

Information should generally be stored once and connected through stable identifiers rather than unnecessarily duplicated throughout the dataset.

---

# 5. Identifier Principle

Every major entity should receive a stable unique identifier.

Example:

```text
big_english_1_sb
big_english_1_sb_u01
big_english_1_sb_p006
big_english_1_sb_vocab_0001
big_english_1_sb_lang_0001
big_english_1_sb_act_0001
```

Exact ID generation may later be automated.

IDs should be:

- unique,
- stable,
- machine-readable,
- predictable where practical,
- and independent of display labels.

Relationships should use IDs rather than repeated free-text names wherever possible.

---

# 6. Schema Metadata

Every canonical dataset should identify the schema version used.

```json
{
  "schema": {
    "name": "general_curriculum_mapper_phase1",
    "version": "0.1",
    "status": "development"
  }
}
```

## Purpose

Schema versioning allows us to know:

- which structure produced a dataset,
- when schema changes occurred,
- whether older books require migration,
- and whether datasets can safely be compared.

During development, schema versions may change frequently.

---

# 7. Book Object

The `book` object identifies the curriculum source.

Example:

```json
{
  "book": {
    "book_id": "big_english_1_sb",
    "series": "Big English",
    "level": "1",
    "book_type": "Student Book",
    "edition": null,
    "publisher": null,
    "source_filename": "Big_English_1_Student_Book.pdf",
    "source_format": "PDF",
    "pdf_page_count": null,
    "printed_page_start": null,
    "printed_page_end": null,
    "language": "English",
    "extraction_status": "in_progress",
    "verification_status": "unverified"
  }
}
```

## Required Initial Fields

- `book_id`
- `series`
- `level`
- `book_type`
- `source_filename`
- `source_format`

Other metadata may remain `null` when unavailable.

Missing metadata should not be invented.

---

# 8. Units

The `units` array represents major curriculum divisions.

Example:

```json
{
  "unit_id": "big_english_1_sb_u01",
  "book_id": "big_english_1_sb",
  "unit_number": "1",
  "title": "My Classroom",
  "theme": "School",
  "printed_page_start": 6,
  "printed_page_end": 15,
  "pdf_page_start": null,
  "pdf_page_end": null,
  "source_section_type": "unit",
  "notes": null,
  "verification_status": "unverified"
}
```

A book may contain structures that are not called "units".

The field `source_section_type` allows the original curriculum terminology to be preserved.

Examples may eventually include:

```text
unit
module
chapter
review
welcome_unit
project
appendix
```

The schema should not rename source structures unnecessarily.

---

# 9. Pages

The `pages` array represents individual instructional pages.

Example:

```json
{
  "page_id": "big_english_1_sb_p006",
  "book_id": "big_english_1_sb",
  "unit_id": "big_english_1_sb_u01",
  "printed_page": 6,
  "pdf_page": 10,
  "section_title": "Vocabulary",
  "section_type": "vocabulary",
  "page_heading": null,
  "instructional": true,
  "visual_dependency": false,
  "audio_dependency": true,
  "notes": null,
  "verification_status": "unverified"
}
```

## Page Identity

Where possible, preserve both:

- `printed_page`
- `pdf_page`

These are not assumed to be identical.

A page may also belong outside a standard unit.

Therefore:

```json
"unit_id": null
```

is valid where appropriate.

---

# 10. Vocabulary

The `vocabulary` array represents lexical curriculum evidence.

Example:

```json
{
  "vocabulary_id": "big_english_1_sb_vocab_0001",
  "book_id": "big_english_1_sb",
  "unit_id": "big_english_1_sb_u01",
  "page_id": "big_english_1_sb_p006",
  "term": "desk",
  "normalized_term": "desk",
  "classification": "target",
  "source_context": "Vocabulary presentation",
  "explicitly_listed": true,
  "notes": null,
  "verification_status": "unverified"
}
```

## Initial Vocabulary Classifications

```text
target
recycled
supporting_context
instructional
uncertain
```

These classifications are working categories and may evolve.

## Classification Principle

Classification depends on pedagogical purpose, not simply whether a word appears on a page.

When uncertain:

```json
{
  "classification": "uncertain",
  "notes": "Vocabulary classification requires manual verification."
}
```

The system should not silently guess.

---

# 11. Language

The `language` array represents actual language structures presented or practised by the source.

Example:

```json
{
  "language_id": "big_english_1_sb_lang_0001",
  "book_id": "big_english_1_sb",
  "unit_id": "big_english_1_sb_u01",
  "page_id": "big_english_1_sb_p007",
  "language_type": "question_answer",
  "prompt": "What is it?",
  "response": "It's a desk.",
  "full_text": null,
  "grammar_label": null,
  "function": "identifying_objects",
  "explicit_in_source": true,
  "notes": null,
  "verification_status": "unverified"
}
```

Possible language types may include:

```text
sentence
sentence_frame
question
answer
question_answer
dialogue
model_exchange
grammar_pattern
functional_language
other
```

These are working categories rather than a permanently closed list.

---

# 12. Preserve Actual Language

Whenever practical, preserve the actual language shown in the source.

For example:

```json
{
  "prompt": "What color is the door?",
  "response": "It's white."
}
```

is more useful than storing only:

```json
{
  "grammar_label": "colors"
}
```

Broad grammatical or functional labels may be stored additionally, but should not replace the source language.

---

# 13. Activities

The `activities` array represents instructional activities.

Example:

```json
{
  "activity_id": "big_english_1_sb_act_0001",
  "book_id": "big_english_1_sb",
  "unit_id": "big_english_1_sb_u01",
  "page_id": "big_english_1_sb_p006",
  "activity_number": "1",
  "activity_type": "listen_point_repeat",
  "instruction": "Listen, point, and repeat.",
  "prompt": null,
  "expected_answer": null,
  "language_frame": null,
  "audio_dependency": true,
  "visual_dependency": true,
  "source_dependency_note": null,
  "notes": null,
  "verification_status": "unverified"
}
```

Activities should preserve the source instruction wherever practical.

The AI may classify an activity type for structural purposes, but the original instruction remains important evidence.

---

# 14. Activity Items

Some activities contain multiple questions, prompts or items.

These should not be compressed into a single ambiguous field.

Where required, an activity may contain structured items:

```json
{
  "activity_id": "big_english_1_sb_act_0002",
  "activity_number": "2",
  "instruction": "Look and answer.",
  "items": [
    {
      "item_number": "1",
      "prompt": "What is it?",
      "expected_answer": "It's a desk."
    },
    {
      "item_number": "2",
      "prompt": "What is it?",
      "expected_answer": "It's a chair."
    }
  ]
}
```

If answers depend on unclear visual or audio information, they should not be invented.

---

# 15. Continuous Text

The `continuous_text` array preserves material that should remain structurally intact.

Examples include:

- stories,
- reading passages,
- dialogues,
- songs,
- chants,
- model conversations,
- poems,
- and other extended language.

Example:

```json
{
  "text_id": "big_english_1_sb_text_0001",
  "book_id": "big_english_1_sb",
  "unit_id": "big_english_1_sb_u01",
  "page_id": "big_english_1_sb_p010",
  "text_type": "story",
  "title": null,
  "content": "...",
  "speaker_structure": null,
  "audio_dependency": false,
  "notes": null,
  "verification_status": "unverified"
}
```

Continuous text should not be incorrectly fragmented into activity-answer records simply because questions appear after it.

**Schema 0.1 ID clarification (2026-10-07):** the primary identifier is `text_id`, as shown above and used by all four pilot canonicals. The automated validator accepts legacy `continuous_text_id` with a warning. This corrects earlier script drift; it is not a schema 0.2 change.

---

# 16. Curriculum Components

The `curriculum_components` array captures explicitly identifiable curriculum components that may vary between series.

Example:

```json
{
  "component_id": "big_english_1_sb_component_0001",
  "book_id": "big_english_1_sb",
  "unit_id": "big_english_1_sb_u01",
  "page_id": "big_english_1_sb_p012",
  "component_type": "phonics",
  "source_label": "Phonics",
  "title": null,
  "description": null,
  "notes": null,
  "verification_status": "unverified"
}
```

Possible examples include:

```text
phonics
pronunciation
listening
speaking
reading
writing
grammar
CLIL
project
review
values
study_skill
```

This list should remain extensible during development.

A series-specific component should not automatically become a permanent universal category.

---

# 17. Relationships

The `relationships` array represents explicit or strongly supported relationships within the source evidence.

Example:

```json
{
  "relationship_id": "big_english_1_rel_0001",
  "book_id": "big_english_1_sb",
  "relationship_type": "practises",
  "source_entity_type": "activity",
  "source_entity_id": "big_english_1_sb_act_0003",
  "target_entity_type": "language",
  "target_entity_id": "big_english_1_sb_lang_0001",
  "evidence_type": "explicit",
  "notes": null,
  "verification_status": "unverified"
}
```

Potential Phase 1 relationships may include:

```text
introduces
practises
reviews
repeats
uses
belongs_to
continues
references
paired_with
```

Phase 1 relationships should remain close to source evidence.

Broader curriculum progression across books belongs primarily to Phase 3.

---

# 18. Student Book / Workbook Relationships

Where Student Books and Workbooks clearly correspond, relationships may connect records across separate canonical book datasets.

Example:

```json
{
  "relationship_type": "workbook_practice_for",
  "source_book_id": "big_english_1_wb",
  "source_entity_id": "big_english_1_wb_p004",
  "target_book_id": "big_english_1_sb",
  "target_entity_id": "big_english_1_sb_p006",
  "evidence_type": "explicit"
}
```

The Workbook remains its own source.

Workbook content should not be assumed from the Student Book.

---

# 19. Extraction Issues

The `extraction_issues` array records uncertainty or problems requiring review.

Example:

```json
{
  "issue_id": "big_english_1_issue_0001",
  "book_id": "big_english_1_sb",
  "unit_id": "big_english_1_sb_u01",
  "page_id": "big_english_1_sb_p008",
  "entity_type": "activity",
  "entity_id": "big_english_1_sb_act_0004",
  "issue_type": "audio_required",
  "severity": "review",
  "description": "Expected answer cannot be verified from the page without audio.",
  "status": "open"
}
```

Possible issue types may include:

```text
uncertain_classification
audio_required
visual_verification_required
missing_source
ambiguous_instruction
possible_omission
page_identity_uncertain
possible_duplicate
manual_review_required
other
```

---

# 20. Schema Gaps

The `schema_gaps` array records source structures that the current schema may not represent adequately.

Example:

```json
{
  "schema_gap_id": "rh_2a_gap_0001",
  "book_id": "reach_higher_2a",
  "unit_id": "reach_higher_2a_u01",
  "page_id": "reach_higher_2a_p020",
  "observed_content": "Description of source feature",
  "closest_existing_structure": "curriculum_components",
  "problem": "Existing structure does not preserve an important distinction.",
  "proposed_change": "Add or extend a field/component structure.",
  "reason": "The distinction appears pedagogically meaningful.",
  "scope_estimate": "unknown",
  "review_status": "pending"
}
```

Possible `scope_estimate` values:

```text
book_specific
series_specific
possibly_universal
unknown
```

Schema proposals are not automatically accepted.

---

# 21. Verification

The canonical dataset should contain book-level verification information.

Example:

```json
{
  "verification": {
    "status": "in_progress",
    "automated_validation": "passed",
    "human_verification": "partial",
    "whole_book_audit": "not_started",
    "open_issue_count": 4,
    "open_schema_gap_count": 1,
    "last_verified": null
  }
}
```

Individual records may also contain their own `verification_status`.

---

# 22. Initial Verification States

The working verification states are:

```text
unverified
needs_review
human_verified
source_dependency
```

Automated structural validation should be tracked separately from human curriculum verification.

A JSON record passing structural validation does not mean the curriculum information itself has been verified.

---

# 23. Null Values

`null` is valid when information genuinely:

- does not exist,
- cannot be determined,
- is not applicable,
- or has not yet been verified.

Example:

```json
{
  "grammar_label": null
}
```

is preferable to inventing:

```json
{
  "grammar_label": "Present Simple"
}
```

when the source does not support that conclusion.

Empty data can be correct data.

---

# 24. Unknown vs Not Applicable

Where this distinction becomes useful, later schema versions may distinguish:

```text
null = unknown / unavailable
not_applicable = concept does not apply
```

This should only be introduced if testing demonstrates that the distinction provides meaningful value.

Do not add complexity merely because it is technically possible.

---

# 25. Source Traceability

Every extracted curriculum record should be traceable back to its source wherever practical.

The minimum useful traceability chain is:

```text
Series
↓
Book
↓
Unit / Section
↓
Page
↓
Entity
```

This allows a teacher or reviewer to return to the original curriculum evidence when something appears incorrect.

---

# 26. Book Evidence vs AI Classification

The schema should preserve the distinction between information copied or directly represented from the source and information classified by AI.

For example:

```json
{
  "term": "desk",
  "classification": "target",
  "explicitly_listed": true
}
```

`desk` may be directly visible source evidence.

`target` may be an AI classification based on how the book presents it.

Later versions may add more explicit provenance fields if testing shows this distinction needs stronger representation.

---

# 27. Extensibility

The schema must support new textbook structures without allowing uncontrolled free-form data.

The preferred process is:

```text
New Structure Found
↓
Can Existing Schema Represent It?
↓
YES → Use Existing Structure
NO → Create Schema Gap
↓
Review Evidence
↓
Approve / Reject Schema Change
↓
Version Schema
```

The extraction AI should not solve unfamiliar structures by creating arbitrary new top-level keys.

---

# 28. Avoiding Schema Explosion

Not every publisher label requires a new field.

For example, three publishers may use:

```text
Language Time
Grammar Focus
Language in Action
```

These may represent similar underlying curriculum components while preserving their original `source_label`.

Example:

```json
{
  "component_type": "grammar",
  "source_label": "Language Time"
}
```

This allows normalization without losing source terminology.

Whether two structures are genuinely equivalent must be established through evidence rather than assumed.

---

# 29. Batch Extraction Structure

An extraction batch may use the same general structure as the canonical dataset but contain only the relevant section.

Example:

```json
{
  "schema": {},
  "book": {},
  "batch": {},
  "units": [],
  "pages": [],
  "vocabulary": [],
  "language": [],
  "activities": [],
  "continuous_text": [],
  "curriculum_components": [],
  "relationships": [],
  "extraction_issues": [],
  "schema_gaps": []
}
```

Example batch metadata:

```json
{
  "batch": {
    "batch_id": "big_english_1_sb_u01_batch01",
    "unit_id": "big_english_1_sb_u01",
    "printed_page_start": 6,
    "printed_page_end": 15,
    "extraction_status": "complete"
  }
}
```

---

# 30. Batch Merge Principle

When verified batches are combined:

- duplicate book metadata should not create duplicate entities,
- IDs must remain stable,
- unit records should merge consistently,
- page records should remain unique,
- entity relationships must remain valid,
- extraction issues must remain attached to their source entities,
- schema gaps must be preserved,
- and verification state must not be lost.

The merge process should eventually be automated.

---

# 31. Google Sheets Mapping

The normalized JSON structure should allow straightforward spreadsheet views.

Potential mapping:

| JSON Structure | Google Sheets Tab |
|---|---|
| `book` | Books |
| `units` | Units |
| `pages` | Pages |
| `vocabulary` | Vocabulary |
| `language` | Language |
| `activities` | Activities |
| `continuous_text` | Continuous Text |
| `curriculum_components` | Curriculum Components |
| `relationships` | Relationships |
| `extraction_issues` | Extraction Issues |
| `schema_gaps` | Schema Gaps |

Google Sheets is a view and verification surface.

The canonical JSON remains the machine-readable Phase 1 dataset.

---

# 32. React Mapping

The same canonical JSON should be usable by the React validation interface.

Possible early views include:

```text
Book
→ Unit
→ Page
→ Vocabulary
→ Language
→ Activities
→ Source Issues
```

Additional views may include:

- cross-unit vocabulary,
- language progression,
- extraction warnings,
- schema gaps,
- verification status,
- source coverage,
- and cross-series comparison.

The JSON schema should not be distorted solely to make one React component easier to build.

---

# 33. Validation Requirements

Automated structural validation is implemented by:

- machine schema [`../../schemas/phase1-0.1.schema.json`](../../schemas/phase1-0.1.schema.json) for root shape, required metadata/IDs, types, and schema compatibility;
- shared JavaScript checks in [`../../scripts/lib/phase1Validation.mjs`](../../scripts/lib/phase1Validation.mjs) for cross-record identity, references, D007 `book_id` normalization, expected units, and page/range consistency;
- CLI [`../../scripts/validate_phase1_json.mjs`](../../scripts/validate_phase1_json.mjs) for human and machine-readable reports.

Nested entity objects remain extensible. Source/series classifications such as `section_type`, `activity_type`, `component_type`, `language_type`, and `relationship_type` are not closed enums in schema 0.1.

Before a batch or canonical dataset is accepted, automated validation checks:

### Structure

- valid JSON,
- recognized top-level structures,
- correct data types,
- required fields present.

### Identity

- unique IDs,
- valid book IDs,
- valid unit IDs,
- valid page IDs.

### Relationships

- referenced entities exist,
- no broken relationship IDs,
- no orphaned records where relationships are required.

### Coverage

- expected page ranges represented,
- duplicate page records identified,
- suspicious gaps flagged.

### Controlled Values

- valid verification states,
- valid known classifications,
- unknown classifications flagged rather than silently accepted.

### Severity

- **ERROR** — malformed/incompatible structure or broken internal identity/reference; blocks a new merge, audit PASS, or Phase 1 progression.
- **WARNING** — suspicious/incomplete structure requiring review but compatible with legitimate source variation; does not block automatically.
- **INFO** — diagnostic counts or external references that cannot be checked inside the current book.

`extraction_issues`, `schema_gaps`, null optional locators, open classifications, and series-specific labels are not errors merely because they exist. Automated validation does not certify source completeness, pedagogical meaning, or PDF fidelity.

Validation rules should evolve alongside the schema without closing extensible categories merely for implementation convenience.

---

# 34. Schema Versioning

The initial development schema may use versions such as:

```text
0.1
0.2
0.3
```

During development:

- minor structural discoveries may increment the development version,
- significant architecture changes should be documented,
- datasets should record the schema version used,
- migrations should only be built when actually necessary.

The schema should not be declared `1.0` until cross-series testing provides sufficient confidence.

---

# 35. Schema Change Log

Each schema revision should eventually record:

```text
Version
Date
Change
Reason
Source Evidence
Affected Books
Migration Required?
```

Example:

```text
Version: 0.3
Change: Added X
Reason: Reach Higher exposed curriculum structure not adequately represented by existing model.
Affected Books: Reach Higher 2A+
Migration Required: Review pending
```

This prevents the schema from changing without a documented reason.

---

# 36. Current Schema Testing Strategy

The initial schema should first be challenged against:

1. **Beehive 1**
2. **Big English 1**
3. **Reach Higher 2A**

These sources represent three different textbook structures.

The purpose is not to prove that the schema is correct.

The purpose is to discover where it is wrong or incomplete.

After this first cross-series test, the schema should be reviewed before large-scale extraction continues.

---

# 37. What We Are Testing

During the initial books, specifically evaluate:

- Can every important page structure be represented?
- Can vocabulary be represented consistently?
- Can actual language structures be preserved?
- Can complex activities be represented?
- Can continuous text remain intact?
- Can different publisher terminology be preserved?
- Can Student Book / Workbook relationships be represented?
- Can uncertainty be represented clearly?
- Can source provenance be maintained?
- Can unusual structures create schema gaps cleanly?
- Can Google Sheets display the data usefully?
- Can React consume the same data without transformation becoming excessive?

These questions are more important than keeping the original schema unchanged.

---

# 38. What the Schema Should NOT Become

The Phase 1 schema should not become:

- a lesson plan schema,
- a teacher methodology schema,
- a Chalkie schema,
- an enrichment schema,
- a learner error database,
- a complete linguistic analysis model,
- or a storage place for every possible observation AI can make.

Phase 1 should capture the curriculum evidence needed by later phases.

Later intelligence should remain layered on top rather than contaminating source truth.

---

# 39. Current Canonical Structure

The current working structure is therefore:

```json
{
  "schema": {
    "name": "general_curriculum_mapper_phase1",
    "version": "0.1",
    "status": "development"
  },

  "book": {},

  "units": [],

  "pages": [],

  "vocabulary": [],

  "language": [],

  "activities": [],

  "continuous_text": [],

  "curriculum_components": [],

  "relationships": [],

  "extraction_issues": [],

  "schema_gaps": [],

  "verification": {}
}
```

This is the **starting structure**, not the assumed final answer.

---

# 40. Core Schema Principle

> **Standardize what is genuinely shared. Preserve what is genuinely different. Flag what cannot yet be represented.**

The first 18 books exist partly to create useful curriculum datasets and partly to teach us what the General Curriculum Mapper's permanent data model actually needs to become.