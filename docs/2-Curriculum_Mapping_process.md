# General Curriculum Mapper

# Source of Truth #1 — Curriculum Mapping Process

## Document Status

**Status:** ACTIVE / EVOLVING  
**Project:** General Curriculum Mapper  
**Current Development Priority:** Phase 1 — Curriculum Extraction & Dataset Development

This document is intentionally not locked.

The purpose of the curriculum-mapping process is partly to discover what the eventual system needs.

As different textbook series are extracted, verified, interpreted, connected, enriched and eventually used for lesson generation, we expect to discover information that requires the process, schema or application architecture to change.

Changes should therefore be made when testing provides a meaningful reason for them.

The objective is not to design the perfect theoretical system before doing the work.

The objective is to:

> **Build the system from evidence.**

---

# 1. Purpose

The General Curriculum Mapper is intended to transform curriculum source material into structured curriculum intelligence that helps teachers understand:

- what students have previously encountered;
- what students should reasonably know;
- what they need to learn now;
- how current learning connects to earlier learning;
- what current learning prepares them for later;
- what language needs deliberate recycling;
- what productive language students should be able to use;
- and what useful teaching opportunities exist beyond the minimum textbook requirement.

The project is not simply about extracting textbook content.

The development process should help us discover:

- what information is genuinely useful to teachers;
- what information is unnecessary or excessive;
- what information is missing from the initial design;
- how detailed curriculum extraction should be;
- what AI can reliably extract directly from textbooks;
- what requires human verification;
- what requires AI interpretation;
- how learning develops across pages, units, books, levels and series;
- what should be considered teacher enrichment rather than textbook content;
- what information is useful for lesson generation;
- and what data structures will eventually be required by the application.

The guiding principle remains:

> **Beauty in simplicity — but still thorough.**

We should not collect information simply because AI is capable of extracting or generating it.

Everything collected should eventually have a useful purpose.

---

# 2. Core Architecture

The General Curriculum Mapper is divided into seven conceptual phases.

## Phase 1 — Curriculum Extraction & Structure

What does the source actually contain?

## Phase 2 — AI Curriculum & Linguistic Interpretation

What important linguistic and pedagogical meaning exists within that evidence?

## Phase 3 — Curriculum Connections & Vertical Mapping

How does the learning connect across pages, units, books and levels?

## Phase 4 — Teacher Enrichment

What useful teaching intelligence should deliberately be added beyond the textbook?

## Phase 5 — Lesson Packaging & Structure

What information should be selected and packaged for a particular lesson?

## Phase 6 — Lesson Generation

How can the curriculum intelligence be transformed into classroom-facing material?

## Phase 7 — Evaluation & Refinement

What worked, what failed, and which phase should be improved?

---

# 3. Phases Are Conceptual, Not Strictly Linear

The phases should remain conceptually separate because they represent fundamentally different transformations of information.

However, **development does not need to move through them in strict numerical order**.

For example:

```text
Phase 1
↓
Phase 3 experiment
↓
Phase 4 experiment
↓
Missing information discovered
↓
Return to Phase 1
↓
Improve extraction
↓
Continue
```

This is expected.

Later phases may reveal weaknesses in earlier phases.

The correct response is to return to the phase where the missing information or error originated.

The phase model exists to preserve architectural clarity.

It does not exist to prevent iterative development.

---

# 4. Core Traceability

The conceptual information flow is:

```text
SOURCE MATERIAL
↓
BOOK EVIDENCE
↓
AI INTERPRETATION
↓
CURRICULUM RELATIONSHIPS
↓
TEACHER ENRICHMENT
↓
LESSON PACKAGE
↓
GENERATED LESSON
↓
EVALUATION
```

This separation allows us to distinguish:

```text
What the source says
↓
What AI understands from it
↓
How that learning connects
↓
What we deliberately add
↓
What information a lesson needs
↓
What the generation system produces
↓
How well the result works
```

This traceability is fundamental to the project.

---

# 5. Current Development Dataset

The initial General Curriculum Mapper development dataset contains **18 books across three textbook series**.

## Beehive

- Beehive 1
- Beehive 2

**Total: 2 books**

Beehive provides continuity with the original curriculum-mapping experiments.

---

## Big English

Big English is the curriculum currently used at the school.

Available sources:

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

Big English provides the most complete vertical sequence in the initial dataset and has immediate real-world usefulness because it is the curriculum currently being taught.

---

## Reach Higher

Available sources:

- Reach Higher 2A
- Reach Higher 2B
- Reach Higher 3A
- Reach Higher 4A

**Total: 4 books**

Reach Higher provides a substantially different curriculum structure and an important cross-series test.

---

# 6. Purpose of the Initial Dataset

The 18 books serve two purposes.

## Purpose 1 — Real Curriculum Data

The books should become useful structured curriculum datasets.

## Purpose 2 — System Development Evidence

Processing them should teach us:

- which curriculum structures are universal;
- which are common but not universal;
- which are series-specific;
- which fields are genuinely useful;
- which fields are unnecessary;
- what AI extracts reliably;
- what requires human verification;
- what information later phases require;
- where the schema fails;
- and what the eventual automated application needs to support.

The dataset therefore exists partly to **teach us how to build the General Curriculum Mapper itself**.

---

# 7. Permanent Prior-Knowledge Principle

The curriculum books are not the only source of useful information about what students may already know.

The system should eventually distinguish between at least three concepts.

## Documented Prior Learning

Learning that can be traced directly to earlier curriculum material.

## Expected Prior Knowledge

Language students are reasonably expected to know based on:

- age;
- previous schooling;
- teaching experience;
- curriculum context;
- and knowledge of the learner population.

## Observed Learner Reality

What teachers actually observe students being able or unable to understand and use.

These sources may overlap.

They should not automatically overwrite one another.

For example:

```text
Expected Prior Knowledge:
colors

Earlier Curriculum Evidence:
colors explicitly taught

Observed Learner Reality:
students recognize colors but struggle to answer in full sentences
```

Together, these provide stronger curriculum intelligence than any one source alone.

This distinction does not need to complicate Phase 1 extraction.

It becomes increasingly important during Phases 2–4.

---

# 8. Vocabulary Knowledge Is Not Productive Language Mastery

A central assumption behind the project remains:

> **Knowing a word does not mean a student can use that word productively in English.**

A student may easily recognize or produce:

```text
orange
```

but struggle to produce:

```text
It is orange.
```

They may struggle further with:

```text
What color is it?
It is orange.
```

or:

```text
What color is the bag?
The bag is orange.
```

Therefore, evidence that vocabulary was previously taught should not automatically lead the system to assume mastery of the language structures surrounding that vocabulary.

Familiar vocabulary can instead become useful material for practising:

- sentence formation;
- question formation;
- full answers;
- articles;
- singular and plural;
- `be`;
- `do/does`;
- word order;
- longer responses;
- and increasingly independent speaking.

This distinction is particularly important for our learners.

---

# PHASE 1 — CURRICULUM EXTRACTION & STRUCTURE

# 9. Phase 1 Purpose

Phase 1 asks:

> **What does the source material actually contain?**

Phase 1 is responsible for creating trustworthy structured curriculum evidence before deeper interpretation occurs.

The current priority of the project is to build the Phase 1 dataset across the available textbook series while simultaneously refining the extraction methodology and schema.

Detailed operational rules belong in:

**`4-Phase_1_Extraction_Data_Specification.md`**

and:

**`4A-Phase_1_JSON_Schema.md`**

---

# 10. Phase 1 Core Principle

Phase 1 should:

> **Extract what the source actually contains, preserve where it came from, expose uncertainty, and allow different books to reveal structural needs.**

The extraction system should not silently:

- invent missing information;
- enrich textbook content;
- reinterpret AI assumptions as book truth;
- or force unfamiliar curriculum structures into inappropriate fields.

When uncertain:

> **Flag rather than guess.**

---

# 11. Phase 1 Working Pipeline

The current working pipeline is:

```text
PDF SOURCE
↓
SOURCE REGISTRATION
↓
BOOK STRUCTURE IDENTIFICATION
↓
EXTRACTION BATCHES
↓
AI EXTRACTION
↓
STRUCTURED JSON
↓
AUTOMATED VALIDATION
↓
HUMAN VERIFICATION
↓
MERGE APPROVED BATCHES
↓
WHOLE-BOOK AUDIT
↓
CANONICAL BOOK DATASET
↓
GOOGLE SHEETS / REACT VIEWER
```

The preferred canonical machine representation is now **structured JSON**.

TSV may still be generated where useful for:

- spreadsheet inspection;
- exports;
- manual review;
- or other human-facing purposes.

TSV is no longer assumed to be the permanent canonical data format.

---

# 12. Phase 1 Extraction Strategy

Books should normally be processed in logical extraction batches.

The initial default is:

> **One unit = one extraction batch**

However, this is not a permanent rule.

Batch size should be determined by extraction reliability.

A unit may be split when:

- output becomes too large;
- content is omitted;
- activities become confused;
- visual complexity is high;
- stories require separate handling;
- or testing demonstrates better accuracy with smaller batches.

The governing principle is:

> **Use the largest batch that remains reliably accurate and complete.**

Operational Google AI Studio use of this strategy is defined in **`3-Google_AI_Studio_Prompt.md`**. That prompt currently allows the complete textbook PDF to be supplied as source, then requires the model to identify book structure and return **one separate JSON extraction batch per unit**, each labeled with a recommended filename outside the JSON (for example `<book_id>_unit_01.json`). Whole-book JSON is not produced at the extraction stage; approved unit batches are merged later into the canonical book dataset.

---

# 13. Cross-Series Validation

Phase 1 should not be developed by completing one entire series before testing another.

Early schema development should deliberately expose the system to different textbook structures.

The initial representative test should include:

```text
Beehive 1
↓
Big English 1
↓
Reach Higher 2A
↓
Schema Review
```

The exact sequence may evolve.

The purpose is to avoid accidentally building:

- a Beehive mapper;
- a Big English mapper;
- or a Reach Higher mapper.

The architecture must become a **General Curriculum Mapper**.

---

# 14. Consistency Without Artificial Uniformity

The Phase 1 data structure should aim for:

> **Consistency without artificial uniformity.**

Some curriculum structures will appear across all books.

Others may appear only in:

- particular levels;
- particular series;
- particular book types;
- or individual books.

A common schema does not require every field to contain information.

For example:

```text
phonics = empty
```

may be completely correct for a book with no meaningful phonics component.

The system must never invent information merely because a field exists.

---

# 15. Schema Discovery

The initial schema is a working hypothesis.

The 18-book dataset should challenge it.

When important source content cannot be represented adequately, the system should create a:

> **SCHEMA GAP**

rather than silently changing the architecture.

A schema gap should identify:

- source;
- book;
- unit;
- page;
- observed content;
- closest existing structure;
- why the existing structure is insufficient;
- proposed change;
- and supporting evidence.

The AI may propose schema changes.

It should not silently make permanent architecture decisions.

---

# 16. Schema Change Principle

When a schema gap is discovered:

```text
Record
↓
Verify
↓
Check Existing Schema
↓
Compare Across Sources
↓
Determine Scope
↓
Approve / Reject Change
↓
Version Schema
↓
Reprocess or Migrate Earlier Data if Necessary
```

Not every unusual textbook feature deserves a permanent new field.

The goal is:

> **Flexibility without uncontrolled schema growth.**

---

# 17. Canonical Phase 1 Dataset

Each completed book should ultimately produce one canonical structured dataset.

Example:

```text
big_english_1_student_book.json
```

Individual units may first produce temporary extraction files.

These should eventually be:

- validated;
- human verified;
- merged;
- audited;
- and stored as the canonical Phase 1 representation of that book.

Google Sheets and React are primarily **views over this structured curriculum data**.

They should not become the source of truth themselves.

---

# 18. Phase 1 Human Verification

AI extraction should reduce repetitive human work rather than eliminate professional oversight.

Human verification should focus on questions such as:

- Was every relevant page captured?
- Was important curriculum content omitted?
- Was vocabulary classified correctly?
- Were actual language structures preserved?
- Were activities represented correctly?
- Were stories and continuous text preserved appropriately?
- Did the AI invent anything?
- Were visual and audio dependencies flagged?
- Are uncertainty flags reasonable?
- Does a proposed schema gap represent a real structural problem?

The objective is to shift human effort from:

> copying + formatting

toward:

> checking + deciding.

---

# 19. Phase 1 Output

At the end of Phase 1, we should progressively have:

1. A validated extraction methodology.
2. Canonical structured datasets for the available books.
3. Verified page-level source evidence.
4. A schema tested across substantially different textbook series.
5. Clear identification of meaningful differences between books and series.
6. Reliable separation between source evidence and non-source information.
7. Documented extraction uncertainty.
8. Documented schema gaps.
9. A repeatable validation and verification process.
10. Data that can support Phases 2–7.

We should be able to answer questions such as:

- What exactly appears on this page?
- What vocabulary appears?
- Which vocabulary is targeted?
- What language structures are modelled?
- What questions are asked?
- What answers are expected?
- What activities occur?
- What skills are explicitly practised?
- What does the Workbook reinforce?
- What information exists in one series but not another?
- Where is the extraction uncertain?
- Where does the current schema fail?

Phase 1 establishes the evidence foundation for everything that follows.

---

# PHASE 2 — AI CURRICULUM & LINGUISTIC INTERPRETATION

# 20. Phase 2 Purpose

Phase 2 asks:

> **What important learning exists within the source content that the publisher does not necessarily label explicitly?**

This phase remains deliberately separate from extraction.

Phase 1 records the evidence.

Phase 2 interprets the evidence.

Children's ESL/EAL textbooks frequently teach language implicitly.

For example:

```text
What does she like?
She likes pizza.
```

The publisher may not explicitly identify everything linguistically occurring in those sentences.

AI could identify:

- present simple;
- third-person singular;
- `do/does` question formation;
- subject pronouns;
- subject-verb agreement;
- `like + noun`;
- `like → likes`.

These observations may be valuable even though they were not explicitly labelled by the publisher.

---

# 21. Possible AI Interpretation

AI interpretation may identify:

- grammar points;
- tense;
- sentence patterns;
- language functions;
- implicit grammatical structures;
- prerequisite language;
- vocabulary relationships;
- recycled language;
- increasing linguistic complexity;
- relationships between vocabulary and grammar;
- implicit skill development;
- and language dependencies.

These must remain classified as:

> **AI INTERPRETATION**

rather than:

> **BOOK EVIDENCE**

A teacher or downstream system should always be able to determine:

> Did the source actually state this, or did AI identify it from the evidence?

---

# PHASE 3 — CURRICULUM CONNECTIONS & VERTICAL MAPPING

# 22. Phase 3 Purpose

Phase 3 asks:

> **How does the learning fit together?**

At this point AI may have access to:

```text
BOOK EVIDENCE
+
AI CURRICULUM & LINGUISTIC INTERPRETATION
```

This creates a stronger foundation for identifying curriculum relationships.

The question moves beyond:

> What happens on this page?

toward:

> What learning led to this page, what is happening now, and where does this learning go next?

---

# 23. Curriculum Relationships

Phase 3 should progressively identify relationships across:

- pages;
- lessons;
- units;
- books;
- levels;
- and potentially textbook series.

A language item might eventually be traceable through something resembling:

```text
First Encounter
↓
Practice
↓
Recycling
↓
Expansion
↓
Independent Use
```

The exact relationship model should emerge from the data rather than being forced prematurely.

---

# 24. Prior Knowledge Within Phase 3

Phase 3 may use several different kinds of prior-knowledge information.

## Documented Prior Learning

Evidence showing that something was explicitly encountered in earlier curriculum material.

## Expected Prior Knowledge

Retained assumptions about language students are reasonably expected to know.

## AI-Identified Prerequisite Knowledge

Language AI determines is necessary or helpful for successfully using the current material.

## Observed Learner Reality

Teacher evidence about what students can actually understand and produce.

These sources may overlap.

That is useful.

They should not automatically overwrite one another.

---

# PHASE 4 — TEACHER ENRICHMENT

# 25. Phase 4 Purpose

Phase 4 asks:

> **What useful teaching opportunities can we deliberately add beyond the textbook?**

The textbook remains the curriculum floor.

Enrichment should strengthen learning without silently becoming additional compulsory curriculum.

Possible enrichment includes:

- extension vocabulary;
- additional examples;
- recycled familiar language;
- grammar reinforcement;
- productive sentence practice;
- question formation;
- full-sentence answers;
- common learner errors;
- Korean-English language awareness;
- scaffolding;
- speaking opportunities;
- personalization;
- stretch language;
- interactive practice;
- and deliberate recycling.

The detailed principles governing enrichment belong in the dedicated:

**Teacher Enrichment Philosophy SOT**

---

# 26. Familiar Vocabulary as a Teaching Resource

Familiar vocabulary should not automatically be treated as vocabulary requiring substantial reteaching.

For many students:

> **word recognition is stronger than sentence production.**

Therefore familiar vocabulary can become the material through which students practise productive English.

For example:

```text
orange
↓
It is orange.
↓
What color is it?
It is orange.
↓
What color is the pencil case?
The pencil case is orange.
```

The goal is not merely to increase the number of words students know.

The goal is increasingly accurate, confident and flexible use of English.

This principle should inform enrichment.

It does not require us to complicate Phase 1 extraction.

---

# PHASE 5 — LESSON PACKAGING & STRUCTURE

# 27. Phase 5 Purpose

Phase 5 asks:

> **What information should actually be handed to a lesson-generation system or teacher?**

By this point the curriculum system may contain substantial amounts of information.

Not all of it belongs in every lesson.

Phase 5 selects and packages information relevant to the specific lesson.

Possible inputs include:

- required Book Truth;
- relevant AI interpretation;
- documented prior learning;
- expected prior knowledge;
- recycled language;
- relevant curriculum relationships;
- enrichment opportunities;
- likely learner difficulties;
- scaffolding;
- stretch opportunities;
- and teacher guidance.

The objective is:

> **Maximum useful curriculum intelligence with minimum unnecessary complexity.**

The lesson package should communicate what matters without unnecessarily dictating exactly how it must be taught.

---

# PHASE 6 — LESSON GENERATION

# 28. Phase 6 Purpose

Phase 6 converts lesson-specific curriculum intelligence into classroom-facing teaching material.

Previous Chalkie testing has demonstrated that this general concept can work.

Chalkie development is therefore currently **parked rather than abandoned**.

The present priority is improving the upstream curriculum evidence and mapping system.

The broad division of responsibility should remain:

## General Curriculum Mapper

Provides curriculum intelligence.

## Lesson Generation System

Transforms that intelligence into teaching materials.

## Teacher

Reviews, adapts and makes the final professional decisions.

The General Curriculum Mapper should avoid unnecessarily prescribing:

- every slide;
- every transition;
- every game;
- exact timings;
- or every teacher action.

Teacher autonomy remains important.

---

# PHASE 7 — EVALUATION & REFINEMENT

# 29. Phase 7 Purpose

Outputs from the system should be evaluated.

A useful review framework remains:

## KEEP

What worked well?

## MODIFY

What is useful but needs adjustment?

## REMOVE

What adds little value or causes problems?

## MISSING

What should have been present but was not?

Evaluation should not immediately result in rewriting whichever prompt happens to be closest.

Problems should first be traced back to their source.

---

# 30. Diagnose the Correct Phase

If required curriculum evidence is absent:

> **Phase 1 problem**

If the evidence exists but AI misunderstands its linguistic or pedagogical significance:

> **Phase 2 problem**

If earlier or later learning is connected incorrectly:

> **Phase 3 problem**

If useful teaching expansion is missing or inappropriate:

> **Phase 4 problem**

If the correct information exists but the lesson package communicates it poorly:

> **Phase 5 problem**

If the lesson package is strong but the generation system executes it poorly:

> **Phase 6 problem**

If evaluation itself fails to identify the real issue:

> **Phase 7 problem**

This separation is one of the major architectural principles of the General Curriculum Mapper.

It allows us to fix the actual problem rather than continually adding instructions to prompts.

---

# 31. Core Information Layers

The eventual system can be understood as several related but distinguishable information layers.

## Layer 1 — Book Evidence

What actually appears in the curriculum sources.

## Layer 2 — AI Interpretation

What AI identifies linguistically or pedagogically from the Book Evidence.

## Layer 3 — Curriculum Relationships

How learning connects across pages, units, books and levels.

## Layer 4 — Teacher Enrichment

What useful teaching material or practice can reasonably be added.

## Layer 5 — Lesson Package

The subset of curriculum intelligence selected for a particular lesson.

## Layer 6 — Generated Lesson

The classroom-facing lesson produced by the generation system.

These layers may eventually exist inside the same application or database.

They should nevertheless remain traceable.

---

# 32. Development and Automation Approach

The project should remain deliberately practical.

We do not need to build the complete production application before understanding what deserves to be automated.

The current development flow is approximately:

```text
BOOKS
↓
AI EXTRACTION
↓
STRUCTURED JSON
↓
AUTOMATED VALIDATION
↓
HUMAN VERIFICATION
↓
CURRICULUM DATASET
↓
AI INTERPRETATION
↓
CURRICULUM CONNECTIONS
↓
TEACHER ENRICHMENT
↓
LESSON PACKAGING
↓
LESSON GENERATION
↓
HUMAN EVALUATION
```

Automation should progressively replace repetitive work once testing demonstrates:

- what is useful;
- what is reliable;
- what requires human oversight;
- and what is worth automating.

---

# 33. Google Sheets

Google Sheets may be used during Phase 1 as a human-friendly inspection and verification environment.

Potential views include:

- Books;
- Units;
- Pages;
- Vocabulary;
- Language;
- Activities;
- Continuous Text;
- Curriculum Components;
- Relationships;
- Extraction Issues;
- Schema Gaps.

Google Sheets is primarily a **view over the structured data**.

It should not become the architectural source of truth.

---

# 34. React Application

A React application will be used during development to inspect and understand the curriculum datasets.

The initial React application does not need to be the final production application.

Its purpose is to expose:

- missing information;
- extraction problems;
- awkward data structures;
- schema inconsistencies;
- curriculum relationships;
- cross-series differences;
- and useful teacher-facing views.

The application should evolve alongside the curriculum model.

The data should shape the interface rather than prematurely allowing the interface to dictate the data model.

---

# 35. Current Project Position

The project has deliberately not followed the phases strictly in order.

This has been useful.

Previous experimentation across extraction, enrichment, lesson packaging and Chalkie generation has helped reveal what information the upstream curriculum system needs.

Therefore:

> **We are not restarting the project.**

We are evolving the architecture based on what previous experiments have taught us.

---

## Phase 1

**CURRENT PRIMARY DEVELOPMENT FOCUS**

The extraction methodology has already been substantially explored through Beehive.

The next major step is to create and validate structured Phase 1 datasets across:

- Beehive;
- Big English;
- and Reach Higher.

Structured JSON, automated validation, human verification and cross-series schema discovery are now central to this phase.

---

## Phase 2

AI linguistic and curriculum interpretation has already occurred informally during experimentation.

It has not yet been systematically formalized across the broader dataset.

---

## Phase 3

Significant conceptual work already exists around:

- prior knowledge;
- recycled language;
- prerequisite knowledge;
- productive language;
- and vertical progression.

Full mapping will become substantially stronger once Phase 1 provides a larger verified evidence base.

---

## Phase 4

Teacher enrichment has received substantial development.

The dedicated **Teacher Enrichment Philosophy** provides the current working foundation.

---

## Phase 5

Lesson packaging has already been explored through Chalkie handover experiments.

Further development should wait for stronger upstream curriculum intelligence where practical.

---

## Phase 6

Chalkie sandbox testing has demonstrated that the overall lesson-generation concept is viable.

A successful test approached the project's working target of a roughly **90% useful teaching skeleton**.

Chalkie development is currently parked while upstream curriculum mapping is strengthened.

---

## Phase 7

Evaluation has already occurred informally throughout development.

It should become increasingly systematic as the earlier phases mature.

---

# 36. Current Phase 1 Milestone

The immediate milestone is:

> **Prove the Phase 1 extraction and dataset architecture across three substantially different textbook series.**

The representative initial test should use:

- Beehive 1;
- Big English 1;
- Reach Higher 2A.

We should prove:

```text
PDF
↓
EXTRACTION
↓
STRUCTURED JSON
↓
VALIDATION
↓
HUMAN VERIFICATION
↓
CANONICAL DATASET
↓
GOOGLE SHEETS / REACT
```

before aggressively processing the remainder of the 18-book dataset.

---

# 37. Working Success Target

The system does not need theoretical perfection before it becomes useful.

The current working target is approximately:

> **90% reliable and useful, with visible uncertainty and efficient human verification.**

The important requirements are that:

- essential curriculum information is captured;
- source evidence remains traceable;
- errors can be identified;
- uncertainty is visible;
- corrections are manageable;
- the schema can evolve;
- and the resulting intelligence genuinely helps teachers.

---

# 38. Guiding Principles

## 1. Preserve Book Truth

Never present AI-generated or inferred information as if it appeared in the source.

## 2. Keep Information Traceable

We should always be able to answer:

> **Where did this information come from?**

## 3. Separate Extraction From Interpretation

What the source contains and what AI understands from it are related but different information.

## 4. Connect Only After We Understand

Curriculum relationships become more reliable when based on accurate Book Evidence and useful AI interpretation.

## 5. Retain Prior-Knowledge Assumptions

Documented curriculum evidence should strengthen, challenge or contextualize expected prior knowledge.

It should not automatically erase it.

## 6. Vocabulary Recognition Is Not Language Mastery

Knowing a word does not mean a student can confidently use that word in sentences or questions.

Productive language remains a major objective.

## 7. Empty Can Be Correct

A common data structure does not require every field to contain information.

Never invent data merely to fill a field.

## 8. Let Different Books Reveal Different Needs

Beehive, Big English and Reach Higher may contain substantially different curriculum structures.

The data model should accommodate meaningful differences rather than hiding them.

## 9. Standardize What Is Genuinely Shared

Common structures should be represented consistently across books and series.

Do not create unnecessary differences simply because publishers use different labels.

## 10. Do Not Force False Uniformity

Standardization should not destroy meaningful curriculum differences.

## 11. Curriculum Floor Before Enrichment

Required curriculum must remain protected.

Enrichment deepens learning without silently becoming additional compulsory curriculum.

## 12. Recycle Before Adding

Previously encountered language is a valuable resource for developing stronger productive English.

## 13. Protect Teacher Autonomy

The system should provide intelligence, possibilities and support rather than dictate one correct teaching method.

## 14. Diagnose Before Rewriting

When something fails downstream, determine which phase actually caused the failure before changing prompts or architecture.

## 15. Flag Rather Than Guess

Visible uncertainty is preferable to false confidence.

## 16. Let Schema Changes Come From Evidence

Do not add fields simply because they might theoretically be useful.

Let real curriculum sources expose genuine structural needs.

## 17. Do Not Overengineer Prematurely

Automate repetitive work when useful, but allow the development dataset to teach us what the final architecture actually requires.

## 18. Allow the SOT to Evolve

This document should change when real extraction, analysis, classroom use or application testing provides evidence that the process should improve.

Change is not a failure of the SOT.

It is part of the purpose of the project.

---

# 39. Core Principle

The objective is not maximum data extraction.

The objective is not maximum AI generation.

The objective is:

> **Capture what matters from the curriculum sources, understand what it means, understand how it connects, preserve what we know about our learners, and add only the intelligence that genuinely helps teachers teach better.**

The working process remains:

```text
Extract
↓
Verify
↓
Interpret
↓
Connect
↓
Enrich
↓
Package
↓
Generate
↓
Evaluate
```

Development may move backwards and forwards through these phases whenever evidence demonstrates that improvement is needed.

The initial 18-book dataset should now teach us how to turn this process into a reliable, generalizable **General Curriculum Mapper**.