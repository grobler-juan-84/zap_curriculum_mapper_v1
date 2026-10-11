# General Curriculum Mapper — Phase 2 Source of Truth

**Suggested filename:** `phase-2-sot.md`  
**Status:** Planning complete — Ready for implementation preparation  
**Focus:** Curriculum intelligence through AI interpretation  
**Guiding principle:** Beauty in simplicity. Working and useful beats theoretically perfect.

---

## 1. Purpose

Phase 2 transforms existing Phase 1 textbook evidence into structured curriculum intelligence.

**Phase 1 answers:** What is in the textbook?

**Phase 2 answers:** What are students expected to learn from the textbook?

The objective is to identify linguistic learning requirements, expected student performance, and learning progression across pages, units, and books.

Phase 2 provides the foundation for future curriculum mapping, teaching enrichment, and lesson generation.

It does not generate lessons or teaching activities.

## 2. Core Philosophy

1. **Simplicity first.** Build the simplest solution that reliably achieves our objectives.
2. **Reuse existing data.** Phase 1 JSON is already extracted and remains authoritative.
3. **Free tools first.** Prefer Google AI Studio's free tier where practical, subject to available limits.
4. **Manual processing is acceptable.** Automation is desirable but never mandatory.
5. **Automate when beneficial.** Avoid building infrastructure merely because automation is possible.
6. **Evidence before inference.** Interpret what the source supports. Never invent textbook content.
7. **Useful over perfect.** Prioritize meaningful curriculum intelligence over excessive detail or theoretical completeness.
8. **Incremental development.** Test, evaluate, improve, and expand gradually.
9. **Keep architecture maintainable.** Avoid unnecessary services, dependencies, and complexity.

**Rule:** If a simpler solution produces sufficiently reliable results, use it.

## 3. Existing Foundation

Phase 1 has already extracted textbook content into canonical JSON.

Phase 2 will consume this existing JSON.

We do not need to:

- Re-extract textbook content.
- Reprocess original PDFs.
- Rebuild Phase 1.
- Duplicate source evidence unnecessarily.

Phase 1 remains the authoritative representation of textbook content.

Phase 2 generates interpretations linked to that evidence.

**Phase 2 must never silently modify Phase 1.**

## 4. Phase 2 Outputs

Phase 2 produces structured curriculum intelligence at three levels.

### 4.1 Book-Level Intelligence

Identify:

- Overall linguistic progression.
- Major vocabulary areas.
- Grammar and language-function development.
- Recurring language patterns.
- Expected progression in language demands.
- Predicted linguistic difficulties where supported.
- Relevant evidence limitations.

Provide both:

- A concise teacher-friendly overview.
- A detailed structured interpretation.

Book-level processing may use a preliminary overview followed by final consolidation after unit processing.

### 4.2 Unit-Level Intelligence

Identify:

- Learning requirements.
- Core and supporting vocabulary.
- Receptive and productive vocabulary demands.
- Grammar and language functions.
- Core versus supporting language targets.
- Expected observable student performance.
- Learning progression within the unit.
- Phonics, pronunciation, and language skills where relevant.
- Predicted linguistic difficulties.
- Supporting Phase 1 evidence references.

Learning requirements must reflect what the textbook provides opportunities to learn.

They must not be presented as verified student mastery.

### 4.3 Page-Level Intelligence

Identify:

- Main learning focus.
- Target vocabulary.
- Grammar and language functions.
- Expected language performance.
- Relevant phonics, pronunciation, and skills.
- Connections to unit learning requirements.
- Linguistic considerations and predicted difficulties.

Generate a concise, structured page summary suitable for future teacher-facing applications.

**Page-level interpretation is sufficient. Separate activity-level interpretation records are not required.**

## 5. Interpretation Principles

### Evidence and inference

Distinguish between:

- **BOOK_EVIDENCE:** Information directly supported by Phase 1.
- **AI_INTERPRETATION:** Linguistic or curriculum conclusions derived from evidence.
- **AI_PREDICTED_DIFFICULTY:** Potential student difficulties predicted by AI.
- **TEACHER_CONFIRMED_DIFFICULTY:** Difficulties confirmed through actual teaching evidence, if available in the future.

Missing or uncertain information must not be invented.

Unsupported optional fields may simply be omitted.

Identified evidence gaps and meaningful uncertainties can be recorded where useful.

### Learning priorities

Where evidence permits, distinguish:

- Core learning targets.
- Supporting language.
- Incidental exposure.
- Receptive versus productive demands.
- Recognition, guided practice, and independent production opportunities.

Do not confuse the presence of language with an explicit learning objective.

### Non-linguistic content

Songs, stories, cultural references, and values should be identified and briefly described when relevant.

Do not invent learning objectives for them.

## 6. Processing Methodology

Use a practical, simplified interpretation workflow.

### Step 1 — Input

Retrieve the relevant existing Phase 1 JSON.

### Step 2 — Preliminary book context

Generate a broad linguistic overview to support interpretation of the book.

This step may be refined based on actual testing and token costs.

### Step 3 — Unit and page interpretation

Use reusable AI prompts to produce structured unit-level and page-level intelligence.

### Step 4 — Evaluation

Check whether outputs are:

- Linguistically reasonable.
- Supported by source evidence.
- Internally consistent.
- Useful for teachers.
- Structurally valid.

Independent AI evaluation may assist.

Avoid excessive validation loops or unnecessary repeated processing.

### Step 5 — Save outputs

Save successful interpretations as structured Phase 2 JSON.

Maintain clear references to the source evidence and processing version.

### Step 6 — Book consolidation

After processing the units, reconcile the book-level interpretation with the completed unit findings.

**The methodology should remain flexible until validated through real experiments.**

## 7. AI Tools and Cost Strategy

Google AI Studio is the preferred starting point.

Use its free tier where available and suitable.

Existing Phase 1 JSON should reduce the need to supply large PDF files, although token usage depends on the amount of JSON and prompt context.

Processing may be:

- Manual through Google AI Studio.
- Semi-automated using reusable prompts and scripts.
- Automated through an API when practical and worthwhile.

Do not assume that API access has the same free-tier availability or limits as the AI Studio interface.

**Automation is an improvement, not a prerequisite.**

## 8. JSON and Storage Principles

Phase 2 outputs should:

- Use a universal core schema.
- Support optional fields.
- Accommodate different textbook structures.
- Include stable Phase 1 evidence references.
- Record source and schema versions.
- Separate experimental outputs from active production interpretations.
- Preserve previous versions when practical.

Prefer straightforward JSON files.

Use the project's existing storage and database infrastructure where appropriate.

Avoid unnecessary database tables or processing infrastructure.

Schema migrations can be introduced when structural changes make them useful.

## 9. Initial Experiment

**Primary target:** Big English 2 — Unit 8.

We already have experimental work on Big English 2 Units 6–8 and Big English 1 Unit 1.

These experiments should inform our next iteration.

The initial objective is to:

1. Use existing Phase 1 JSON.
2. Develop and test a reusable interpretation prompt.
3. Generate unit-level and page-level Phase 2 JSON.
4. Evaluate linguistic accuracy and usefulness.
5. Refine the methodology.
6. Repeat successfully on another unit.

The initial experiment does not require a complete production processing system.

## 10. Expansion Strategy

Proceed incrementally:

**Stage 1:** Validate the methodology using selected Big English 2 units.

**Stage 2:** Complete Big English 2, including book-level consolidation.

**Stage 3:** Expand book by book through the remaining Big English levels.

**Stage 4:** Adapt and validate the universal methodology for Beehive and Reach Higher.

Do not scale until the preceding stage produces sufficiently reliable results.

## 11. Relationship to Future Phases

Phase 2 provides reusable curriculum intelligence.

Later phases will use this information for:

- **Phase 3:** Curriculum connections, sequencing, and progression mapping.
- **Phase 4:** Teaching enrichment and supplementary learning opportunities.
- **Phase 5:** Teacher-facing presentation and lesson preparation.
- **Later phases:** Lesson generation and evaluation.

Phase 2 should support these future capabilities without attempting to implement them prematurely.

Validated unit-level interpretations may be made available independently.

Book-wide analysis should use a completed, consolidated book interpretation.

## 12. Deliberately Postponed

The following are not initial implementation requirements:

- Dedicated Phase 2 administrator workspace.
- Complex job orchestration.
- Distributed processing queues.
- Advanced concurrency management.
- Automatic job recovery infrastructure.
- Elaborate AI reconciliation pipelines.
- Fully automated downstream regeneration.
- Complex rollback interfaces.
- Extensive automated regression testing.
- Sophisticated prompt-management systems.

These ideas may remain in historical planning documentation.

Implement them only when a demonstrated problem justifies their complexity.

## 13. Definition of Success

Phase 2 is initially successful when:

1. Existing Phase 1 JSON can be interpreted without additional textbook extraction.
2. The AI produces meaningful book, unit, and page curriculum intelligence.
3. Learning requirements and linguistic classifications are reasonably accurate and evidence-supported.
4. Results are saved in a consistent, reusable JSON structure.
5. The same methodology works across multiple units without substantial manual redesign.
6. Processing costs and effort are practical.
7. The resulting intelligence can support future curriculum mapping and teacher-facing features.

Perfection is not required.

Reliability, usefulness, and repeatability are required.

## 14. Immediate Next Step

**Do not begin by building infrastructure.**

First, inspect the existing Phase 1 JSON and previous Phase 2 experiments.

Then design the smallest practical Google AI Studio prompt and JSON output structure for Big English 2 Unit 8.

Test the result before implementing additional functionality.

---

## Final Guiding Principle

**Phase 1 JSON → AI interpretation → Phase 2 JSON**

Start simple.

Make it work.

Make it useful.

Improve only when necessary.

**Beauty in simplicity.**