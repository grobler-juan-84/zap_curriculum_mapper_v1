# General Curriculum Mapper — Decisions

**Status:** ACTIVE  
**Version:** 1.0  
**Purpose:** Canonical decision log. Record important settled choices with date, reason, and rejected alternatives so future AI/Cursor sessions do not reopen them without cause.

**Related:** Exploratory discussion lives in [`project-tracking/2-internal-brainstorming.md`](./project-tracking/2-internal-brainstorming.md). This file supersedes [`project-tracking/3-project-decisions.md`](./project-tracking/3-project-decisions.md) as the authoritative log.

---

## How to use

- Append only when a choice is intentionally locked.
- Do not delete superseded decisions — mark them `SUPERSEDED` and point to the replacement.
- Prefer short, concrete statements.
- Before proposing a major direction change, read this file first.

### Entry template

```markdown
### D### — Short title

**Date:** YYYY-MM-DD  
**Status:** LOCKED | SUPERSEDED  
**Decision:**  
**Reason:**  
**Alternatives rejected:**  
**Implications:**  
**Supersedes:** — or D###
```

---

## Decision index

| ID | Title | Date | Status |
|---|---|---|---|
| D001 | Phase 1 is extract-only | 2026-10-06 | LOCKED |
| D002 | Unit-batch JSON, then canonical merge | 2026-10-06 | LOCKED |
| D003 | Docs organized by phase folders | 2026-10-06 | LOCKED |
| D004 | Operating trackers live at docs root 4–7 | 2026-10-06 | LOCKED |
| D005 | Supabase is the backend platform | 2026-10-06 | LOCKED |
| D006 | Hybrid storage: Postgres metadata + Storage files + JSON curriculum | 2026-10-07 | LOCKED |
| D007 | Catalog book_id is canonical; aliases normalized at merge | 2026-10-07 | LOCKED |
| D008 | Automated structural validation is a separate future gate | 2026-10-07 | LOCKED |
| D009 | Project-wide naming conventions | 2026-10-07 | LOCKED |
| D010 | Cloudflare R2 for textbook source PDFs | 2026-10-08 | LOCKED |
| D011 | Validation PDF signed URLs via server API; R2-first dual-read | 2026-10-08 | LOCKED (delivery refined by D012) |
| D012 | Source PDFs are R2-only; Supabase PDF dual-read retired | 2026-10-08 | LOCKED |
| D013 | Human verify available PDF content with documented missing-source exception | 2026-10-08 | LOCKED |
| D014 | Validation PDF viewer navigates by extracted `pdf_page`, labels by printed page | 2026-10-09 | LOCKED |
| D015 | Pause Phase 1 at 14/18; prioritize bounded Phase 2 experiments | 2026-10-09 | LOCKED |
| D016 | First Phase 2 candidates: BE2-SB U6 / U7 / U8; U6 first | 2026-10-09 | LOCKED |
| D017 | Progressive Curriculum Intelligence | 2026-10-12 | LOCKED |
| D018 | Five-iteration Chalkie prompt validation | 2026-10-15 | LOCKED |
| D019 | Book Intelligence MVP UI path validated (BE2 + BE3) | 2026-10-15 | LOCKED |
| D020 | Phase 3 Vertical Mapping parked as later priority; cross-book prior-learning reuse | 2026-10-19 | LOCKED |
| D021 | Student Book–first lesson preparation | 2026-10-21 | LOCKED |
| D022 | Neutral Lesson Package is the durable handoff; BI is optional curriculum interpretation | 2026-10-25 | LOCKED |
| D023 | Limited BE3 U8 activity-enrichment POC only | 2026-10-28 | LOCKED |
| D024 | Minimal additive Neutral Lesson Library pilot | 2026-10-29 | LOCKED |
| D025 | Complete NLL pilot through Cursor, then freeze features for repository audit | 2026-10-29 | LOCKED |
| D026 | Repository consolidation begins with a read-only evidence audit | 2026-10-29 | LOCKED |
| D027 | Durable layer model: SS/SB/WB → NLL → NLP → adapters | 2026-10-29 | LOCKED |
| D028 | BE3 U8 Values remains generic SB-only; no specialized NLL/A/B/C | 2026-10-30 | LOCKED |

---

## Decisions

### D001 — Phase 1 is extract-only

**Date:** 2026-10-06  
**Status:** LOCKED  
**Decision:** Phase 1 captures what the curriculum source actually contains. No lesson planning, enrichment, or invented pedagogy in Phase 1 datasets.  
**Reason:** Preserve book-truth and keep enrichment (Phase 4+) clearly separable from evidence.  
**Alternatives rejected:** Mixing teacher tips / lesson plans into extraction JSON; treating AI inference as source content.  
**Implications:** Extraction prompt, schema, and verification stay evidence-oriented.  
**Supersedes:** —

---

### D002 — Unit-batch JSON, then canonical merge

**Date:** 2026-10-06  
**Status:** LOCKED  
**Decision:** Google AI Studio extraction returns one JSON batch per unit (with `FILE:` labels). After human verification, batches merge into one canonical book JSON.  
**Reason:** Whole-book single-shot output is unreliable; unit batches are reviewable and recoverable.  
**Alternatives rejected:** One whole-book JSON as the primary extraction artifact; keeping batches forever as the product.  
**Implications:** Registry tracks batch + book lifecycle; merge/audit are required before COMPLETE.  
**Supersedes:** —

---

### D003 — Docs organized by phase folders

**Date:** 2026-10-06  
**Status:** LOCKED  
**Decision:** Phase-specific documentation lives under `docs/phase-1` … `docs/phase-6`. Empty phase folders are intentional placeholders.  
**Reason:** Keep phase scope visible and prevent cross-phase doc sprawl at the docs root.  
**Alternatives rejected:** Flat numbered dump of all phase docs at `docs/` root.  
**Implications:** Index and cross-links must use phase paths; root docs are overview / stack / architecture / operating trackers.  
**Supersedes:** —

---

### D004 — Operating trackers live at docs root 4–7

**Date:** 2026-10-06  
**Status:** LOCKED  
**Decision:** AI-facing operating state is maintained in `4-decisions.md`, `5-progress.md`, `6-todo.md`, and `7-future.md`.  
**Reason:** Give every session a short, predictable place to read decisions, current state, actionable work, and parked ideas.  
**Alternatives rejected:** Relying only on `project-tracking/` status/decisions for day-to-day AI orientation.  
**Implications:** Cursor rules must keep these four files current; `project-tracking/` remains for steps log and brainstorming.  
**Supersedes:** —

---

### D005 — Supabase is the backend platform

**Date:** 2026-10-06  
**Status:** LOCKED  
**Decision:** Supabase is the selected backend platform for the General Curriculum Mapper. It will provide PostgreSQL, authentication, and object storage when those capabilities are required. Canonical curriculum data remains JSON-first, with PostgreSQL JSONB available where database persistence/querying is useful. Locking Supabase does not require immediate implementation of every Supabase capability.  
**Reason:** The project owner already uses Supabase in KIS Points, reducing unnecessary technology switching and allowing knowledge and development patterns to transfer between projects.  
**Alternatives rejected:** Leaving PostgreSQL / Auth / Storage providers undecided; selecting a different BaaS solely for novelty; normalizing Phase 1 curriculum JSON into relational tables as a precondition for backend choice.  
**Implications:** Tech-stack docs treat Supabase PostgreSQL and Auth as locked. Supabase Storage remains for dataset JSON and covers unless separately decided. Textbook source PDF object storage is refined by **D010** (Cloudflare R2). Supabase is **not** removed wholesale.  
**Supersedes:** —  
**Refined by:** D010 (source PDFs only)

---

### D006 — Hybrid storage: Postgres metadata + Storage files + JSON curriculum

**Date:** 2026-10-07  
**Status:** LOCKED  
**Decision:** Use a hybrid architecture. PostgreSQL holds stable catalog/ops metadata (`book_series`, `books`, `book_files`, `dataset_versions`, profiles). Object storage holds source PDFs and dataset JSON files in private buckets. Canonical curriculum content (units, pages, vocabulary, language, activities, etc.) remains inside JSON documents and is not normalized into relational tables.  
**Reason:** Phase 1 schema is still evolving and publishers differ; premature relational curriculum tables would force constant migrations. Metadata and file pointers are stable enough to model early.  
**Alternatives rejected:** Full relational model of curriculum entities; storing only JSONB blobs with no catalog tables; public Storage buckets for copyrighted PDFs; permanent public URLs as canonical file references.  
**Implications:** App catalog queries Postgres; curriculum detail loads from object storage / local JSON; `dataset_versions.version` ≠ `schema_version`; see `docs/8-database-architecture.md`. Provider split for PDFs vs JSON/covers is refined by **D010**.  
**Supersedes:** —  
**Refined by:** D010 (textbook source PDFs → Cloudflare R2; JSON/covers remain on Supabase Storage until separately decided)

---

### D007 — Catalog book_id is canonical; aliases normalized at merge

**Date:** 2026-10-07  
**Status:** LOCKED  
**Decision:** Postgres `books.book_id` (matching Storage folder segment) is the canonical book identity. Extraction-era `book_id` strings are aliases listed in [`phase-1/book_id_aliases.json`](./phase-1/book_id_aliases.json). At canonical merge (and when re-normalizing), rewrite `book_id` / same-book `source_book_id` / `target_book_id` fields to the catalog ID. Do **not** rewrite entity ID strings (`unit_id`, `page_id`, …).  
**Reason:** Stable catalog identity is required for Storage paths, joins, Validation, and app architecture independently of curriculum schema evolution; extraction prefixes vary by series and must not block merges.  
**Alternatives rejected:** Treating extracted `book_id` as canonical and renaming folders/registry; rewriting all entity ID prefixes at merge; promoting aliases into separate schemas per series.  
**Implications:** Merge script and `normalize_canonical_book_ids.mjs` apply the map; BE1-SB canonical v1 book_id fields normalized 2026-10-07; further pilot merges must use the map. See [`phase-1/book-id-alias-map.md`](./phase-1/book-id-alias-map.md).  
**Supersedes:** —

---

### D008 — Automated structural validation is a separate future gate

**Date:** 2026-10-07
**Status:** LOCKED
**Decision:** Use a small two-layer validator for Phase 1 schema 0.1: machine JSON Schema for shape/types and shared JavaScript for identity, references, D007 normalization, and range consistency. Run lightweight validation on verified batches before merge and full validation on the normalized canonical candidate. Automated `ERROR` findings block new progression; warnings do not. Human curriculum verification and whole-book/source audit remain separate gates.
**Reason:** Deterministic structural checks should replace repetitive manual integrity work without claiming curriculum meaning, source completeness, or PDF fidelity, and without closing extensible cross-series classifications.
**Alternatives rejected:** Treating the historical audit script as a complete validator; using only JSON Schema for graph/reference checks; making all category vocabularies closed enums; treating open issues/schema gaps as automatic failures; combining automated validation with human/source certification.
**Implications:** Merge, audit, and standalone CLI reuse one validation engine. Existing completed pilots are validated retrospectively without silently revoking prior completion; new errors are recorded and triaged. Schema remains 0.1.
**Supersedes:** —

---

### D009 — Project-wide naming conventions

**Date:** 2026-10-07  
**Status:** LOCKED  
**Decision:** Adopt [`9-naming-conventions.md`](./9-naming-conventions.md) as the project-wide naming authority, enforced for agents by `.cursor/rules/naming_conventions.mdc`. Keep registry ID, catalog `book_id`, series slug, Postgres UUID, and entity ID as distinct identities. New books use full-word catalog templates and full catalog `book_id` entity prefixes. Grandfather the four COMPLETE pilots; do not silently rewrite entity IDs (D007).  
**Reason:** The repository had accumulated inconsistent abbreviations and casing across docs, Storage, and extraction JSON. A forward-looking standard before BE1-WB extraction prevents further drift without forcing a risky pilot ID rewrite.  
**Alternatives rejected:** Rewriting pilot entity IDs now; using registry IDs as Storage paths; introducing new abbreviated catalog/entity prefixes (`bep*`, `be*`, `rh*`); making Reach Higher later books use `_sb` while `reach_higher_2a` remains without it; delaying formalization until after the next extraction.  
**Implications:** New folders, docs, code, Storage segments, and curriculum IDs follow the authority doc. Existing mixed doc filenames and pilot entity prefixes remain until a risk-classified backward audit. Authority clarifications (v1.1: tracker kebab targets, audit-report registry filenames, Postgres UUID vs catalog collision, local/public asset rules) refine enforcement without reopening this decision. Extraction prompt / alias guidance are aligned; safe cosmetic renames and validator naming checks remain follow-through.  
**Supersedes:** —

---

### D010 — Cloudflare R2 for textbook source PDFs

**Date:** 2026-10-08  
**Status:** LOCKED  
**Decision:** Cloudflare R2 is the selected object-storage provider for textbook **source PDFs**. The private R2 bucket is named `book-sources`. Existing logical object-key structure (`{series-slug}/{catalog_book_id}/source.pdf`) should be preserved where practical. Supabase remains the backend for PostgreSQL, Auth, and (for now) dataset JSON / cover object storage — it is not removed wholesale. Implementation must follow documentation and connection testing (Stages A–E in [`10-storage-architecture.md`](./10-storage-architecture.md)); this decision does **not** authorize immediate migration or deletion of Supabase PDF objects.  
**Reason:** Separate large copyrighted PDF binaries onto R2 while keeping Supabase strengths for Auth/catalog; keep object keys stable so `book_files` pointers and Validation workflows need minimal path rewrites; require staged verify-before-cutover because PDFs are live in Validation today.  
**Alternatives rejected:** Moving all object storage to R2 in one step; auto-migrating canonical/batch JSON to R2 as part of this change; making the R2 bucket public; deleting Supabase `book-sources` before verified migration; exposing R2 secrets to the Vite frontend.  
**Implications:** Docs and roadmaps treat R2 as the PDF target. Validation PDF signing is refined by **D011**. JSON storage provider remains an open question (brainstorming), not locked here.  
**Supersedes:** — (refines D005/D006 object-storage provider for source PDFs only)  
**Refines:** D005, D006  
**Refined by:** D011, D012

---

### D011 — Validation PDF signed URLs via server API; R2-first dual-read

**Date:** 2026-10-08  
**Status:** LOCKED (delivery refined by D012)  
**Decision:** Validation obtains textbook PDF access through server-side APIs (Vite middleware locally; shared handlers for future Vercel): preferred `POST /api/source-pdf-content` (same-origin byte proxy → blob URL for PDF.js) and optional `POST /api/sign-source-pdf` (presigned URL). Handlers require a valid Supabase user JWT and authorize only catalog `book_files` rows (`file_type = source_pdf`) by `bookFileId` — not arbitrary object keys. R2 secrets never use `VITE_*`. Historical Stage D cutover was **R2-first dual-read** (Supabase Storage fallback). **D012** removes that fallback: Validation delivery is R2-only. JSON datasets and cover images remain on Supabase Storage.  
**Reason:** Browser cannot hold R2 secrets; PDF.js cannot reliably use cross-origin R2 URLs without bucket CORS, and Object Read/Write tokens often lack PutBucketCors — same-origin proxy fixes that; dual-read was needed while only some pilots were on R2.  
**Alternatives rejected:** Signing R2 URLs in the Vite client; requiring browser CORS to R2 before Validation works; accepting raw `storagePath` without catalog check; silent fallback on R2 403; migrating JSON/covers in the same change.  
**Implications:** Auth + catalog authorization pattern from D011 remains. PDF object delivery provider is refined by **D012**.  
**Supersedes:** —  
**Refines:** D010  
**Refined by:** D012

---

### D012 — Source PDFs are R2-only; Supabase PDF dual-read retired

**Date:** 2026-10-08  
**Status:** LOCKED  
**Decision:** Textbook source PDFs are uploaded to and served from **Cloudflare R2 only**. Validation no longer falls back to Supabase Storage `book-sources`. Ops upload (`scripts/upload_source_pdfs.mjs`) writes PDF bytes to R2 and upserts `book_files` metadata in Postgres. Existing Supabase `book-sources` PDF objects are **left in place unused** (not deleted in this decision). Supabase remains authoritative for PostgreSQL, Auth, `book-datasets` JSON, and `book-assets` covers. Logical bucket id `book-sources` and object keys `{series-slug}/{catalog_book_id}/source.pdf` stay unchanged.  
**Reason:** All four cataloged pilot PDFs are verified on R2 (Stage E); continuing dual-read and Supabase PDF uploads risks split-brain and unnecessary egress. Stop-using is enough; physical deletion can wait.  
**Alternatives rejected:** Keeping dual-read indefinitely; deleting Supabase PDF objects in the same change; moving JSON/covers to R2; changing catalog `bucket` / path strings.  
**Implications:** Missing R2 objects surface as Validation errors. New books (e.g. BE1-WB) must be uploaded to R2. Optional later cleanup of unused Supabase PDF objects is parked (F014).  
**Supersedes:** — (refines D011 delivery; does not reopen D010 bucket/key choices)  
**Refines:** D011, D010

---

### D013 — Human verify available PDF content with documented missing-source exception

**Date:** 2026-10-08  
**Status:** LOCKED  
**Decision:** When printed pages are **absent from the supplied source PDF**, human verification may approve a unit batch for the **content that exists in that PDF**, provided the gap is recorded as an open `extraction_issues` entry with `issue_type = missing_source` (and registry notes). Missing pages must **not** be invented, marked verified, or treated as an AI extraction failure. Book-level / Phase 1 completion still requires ordinary gates (remaining units, automated validation, canonical merge, whole-book audit) and is not implied by a single-unit approval with an exception.  
**Reason:** BE1-WB Unit 9 printed pages 124–129 are missing from the source PDF; extraction correctly omitted them. Blocking human verification of available pages would stall the pipeline without improving evidence quality.  
**Alternatives rejected:** Fabricating page/entity records for missing printed pages; marking missing content `human_verified`; treating the omission as an extraction defect; requiring a complete replacement PDF before any Unit 9 approval; changing the Phase 1 schema to encode the exception.  
**Implications:** Unit batches may be `book_files.status = verified` / entity `verification_status = human_verified` while `missing_source` issues remain **open**. Completeness limitations stay visible in the registry and issue list. PDF viewer printed↔PDF index mismatches when pages are absent are a separate deferred UX issue (F015), not a verification blocker.  
**Supersedes:** —

---

### D014 — Validation PDF viewer navigates by extracted `pdf_page`, labels by printed page

**Date:** 2026-10-09  
**Status:** LOCKED  
**Decision:** The Validation PDF viewer opens each unit at the unit's extracted `pdf_page_start` (physical PDF index) and builds a printed↔PDF page map from the unit's page records (`printed_page` + `pdf_page`). The counter shows printed page numbers with the PDF index as secondary text; the Go box accepts printed page numbers. Pages outside the loaded unit are extrapolated from the nearest known mapping. When `pdf_page` is absent, the viewer falls back to printed = PDF index (prior behaviour). Source PDFs with omitted pages are accepted as-is (no re-scan).  
**Reason:** BE3-SB omits printed pp. 66–67 and BE1-WB omits pp. 124–129, shifting every later unit when printed numbers were used as PDF indices. Extraction already records the correct `pdf_page` values, so the data is the single source of truth.  
**Alternatives rejected:** Per-book manual offset or missing-page config in Postgres; inserting blank pages into the source PDFs; re-scanning books; OCR-based page detection.  
**Implications:** Extraction must keep emitting accurate `pdf_page` / `pdf_page_start` values (null for printed pages absent from the PDF). Resolves F015. Extends D013 (missing pages stay documented as `missing_source`).  
**Supersedes:** —  
**Refines:** D013

---

### D015 — Pause Phase 1 at 14/18; prioritize bounded Phase 2 experiments

**Date:** 2026-10-09
**Status:** LOCKED
**Decision:** Intentionally pause Phase 1 with 14 of 18 books COMPLETE and make Phase 2 curriculum interpretation the active development priority. Immediate Phase 2 experiments use the 12 completed Big English Student Books and Workbooks (Levels 1–6). Beehive and Reach Higher are excluded from the immediate experiments; BH1 and RH2A remain valid completed Phase 1 assets, while BH2, RH2B, RH3A, and RH4A remain NOT STARTED and deferred. Phase 3 follows through later controlled experiments. This decision does not select or lock a Phase 2 implementation, JSON schema, storage model, or architecture.
**Reason:** The complete Big English sequence provides a coherent evidence base for learning how curriculum interpretation should work before more extraction or downstream mapping architecture is committed. The phase model is intentionally iterative, so useful Phase 2 evidence can guide whether later Phase 1 work needs adjustment.
**Alternatives rejected:** Treating all 18 books as a prerequisite for Phase 2; declaring project-wide Phase 1 complete; abandoning the four remaining books; including Beehive or Reach Higher in the immediate Phase 2 experiments; prematurely fixing a Phase 2 schema or implementation.
**Implications:** Operating trackers and current-status documentation must show Phase 1 as **PAUSED at 14/18 COMPLETE**, not completed or abandoned. The full Phase 1 pipeline for BH2, RH2B, RH3A, and RH4A stays visible as deferred work. Phase 2 remains a separate interpretation layer over verified Phase 1 evidence (D001). Phase 3 parking rationale is clarified by **D020** (later priority — not a “wait for useful Phase 2 overviews” gate).
**Supersedes:** The draft Phase 1 processing order in `phase-1/dataset-registry.md` §15 as an active priority; the table remains historical context.
**Amended by:** D020 (Phase 3 park reason)

---

### D016 — First Phase 2 candidates: BE2-SB U6 / U7 / U8; U6 first

**Date:** 2026-10-09  
**Status:** LOCKED  
**Decision:** The first controlled Phase 2 interpretation experiments use three owner-approved Big English 2 Student Book units: Unit 6 *My Day*, Unit 7 *My Favorite Food*, and Unit 8 *Wild Animals*. Unit 6 is the first experiment run. Prior/future vertical links for these experiments draw on completed BE1 and BE3 Student Book (and optionally matching Workbook) canonical datasets. This decision does not lock a Phase 2 schema, prompt, storage model, or implementation; the Unit 6 experiment protocol remains an ACTIVE working procedure.  
**Reason:** Evidence-backed discovery across BE1–BE3 showed these three units offer the best balanced prior+future linguistic progressions (timed routines; food preference→quantity; ability modality) without relying on topic match alone.  
**Alternatives rejected:** Starting with BE2 U5 (weak BE1 prior); starting with BE2 U2 (overlaps preference-testing with U7); interpreting a whole BE2 book in one pass; locking a Phase 2 schema before any experiment run.  
**Implications:** Active work follows [`phase-2/be2-candidate-units.md`](./phase-2/be2-candidate-units.md) and [`phase-2/be2-unit-6-experiment-protocol.md`](./phase-2/be2-unit-6-experiment-protocol.md). U7/U8 wait until U6 is reviewed or the owner re-prioritizes.  
**Supersedes:** —

---

### D017 — Progressive Curriculum Intelligence

**Date:** 2026-10-12  
**Status:** LOCKED  
**Decision:** Build curriculum intelligence progressively, starting with the smallest useful output and expanding only when downstream testing demonstrates a real need.

- **Phase 1 — Extraction:** Preserve detailed, verified textbook evidence.
- **Phase 2 — Book Intelligence / Horizontal Mapping:** Produce a concise, structured, teacher-readable unit-by-unit overview of what the book teaches and expects students to learn. Use the Big English publisher overview as a reference for output density, not as a mandatory schema. Include meaningful distinctions such as target/supporting vocabulary, grammatical structures, communicative functions, instructional language, skills, components, and observable outcomes where supported. Do not require all possible fields for every publisher.
- **Phase 3 — Series Intelligence / Vertical Mapping:** Eventually support cross-book / cross-grade prior-learning retrieval and reuse for teacher choice (parallel to within-book horizontal mapping). May still identify introduction, recycling, extension, and increasing complexity, but is **not** framed only as abstract progression analysis. Similar topics alone are not proof of progression. **Parked as a later priority — see D020** (not gated on Phase 2 “sufficiency”).
- **Phase 4 — Teaching Intelligence:** Use available curriculum evidence and connections (including Phase 3 when later available) to identify assumed prior learning, appropriate scaffolding, purposeful recycling, gaps, enrichment opportunities, and preparation for later lessons/units/levels. Do not equate previously taught with mastered.

**Operating principles:**

1. **Minimum sufficient output:** Each phase produces the smallest useful structured deliverable that can support the next phase.
2. **Traceability:** Outputs keep references to earlier evidence; summarization must not erase the underlying source.
3. **Progressive discovery:** Attempt downstream tasks to discover missing requirements before expanding upstream outputs.
4. **Separate research from production:** Detailed Phase 2 experiments remain research evidence; their full analysis is not automatically mandatory in production.
5. **Language-led, context-aware mapping:** Grammar and communicative functions are central to linguistic progression; vocabulary and topic continuity are important supports, not sufficient progression evidence by themselves.
6. **Avoid premature technical commitments:** This decision does not lock a Phase 2 JSON schema, database design, API, prompt, or UI.

**Reason:** The prior experimental approach risked designing an exhaustive Phase 2 analysis before learning which information Phase 3 and Phase 4 actually need. A useful whole-book overview can be tested sooner, with complexity introduced only when justified.  
**Alternatives rejected:** Requiring exhaustive pedagogical and learner-difficulty analysis for every Phase 2 unit; treating the publisher's table columns as a universal schema; designing every downstream mapping field before running a whole-book and cross-book test; mapping progression by shared topics alone.  
**Implications:** Next proposed experiment (awaiting owner execution approval): Big English 2 Student Book Units 1–9 — generate a concise Phase 2 book overview from existing verified Phase 1 data, benchmarked against the publisher table for density (not as a fixed schema). Preserve evidence references; distinguish publisher-stated from AI-inferred outcomes. Evaluate (1) book fidelity, (2) teacher readability, (3) sufficiency for an initial BE1 → BE2 → BE3 vertical comparison. If Phase 3 exposes missing information, record the gap and revise Phase 2 selectively. Phase 2 output format remains provisional until whole-book and vertical tests are reviewed. No application code, schema, database, storage, or canonical Phase 1 dataset changes are authorized.  
**Compatibility:** Preserves D001's extraction/interpretation separation and D015's Phase 2 priority. Builds on, but does not rewrite, D016 and the BE2 U6–U8 / BE1 U1 experimental artifacts.  
**Historical note:** The 2026-10-11 experimental process preference (treat BE2 U1/U6/U8 V3.1 analyses as unit SoT; prefer Cross-Unit V1.2 connections-only) is **superseded as the active development direction**. Those artifacts remain preserved research evidence under operating principle 4; they are not production-mandatory.  
**Supersedes:** Prior D017 wording (2026-10-11 V3.1 + Cross-Unit V1.2 process preference)  
**Does not supersede:** D001, D015, D016

#### Working approvals under D017 (not methodology / schema locks)

These are owner experiment outcomes recorded under D017. They do **not** reopen or rewrite the LOCKED decision above, and they do **not** lock Phase 2 format, schema, prompts, database, API, or UI.

| Date | Approval | Scope | Explicit non-locks |
|---|---|---|---|
| 2026-10-13 | BE2-SB D017 **v2** accepted as provisional Book Intelligence working baseline (eight-column) | BE2-SB continued experimentation | Methodology / schema / format not locked |
| 2026-10-15 | Prefer BE3 Experiment **A+B** (writing-aware Learning Outcomes **+** Writing column) as the BE3-SB experimental Book Intelligence path | **BE3-SB only** | Does **not** change BE2 v2 baseline; does **not** lock methodology/schema; does **not** auto-apply A+B to other books |
| 2026-10-15 | Book Intelligence **MVP UI path** validated for BE3-SB then extended to BE2-SB — see **D019** (amended) | **BE2-SB + BE3-SB implementation** | Validates **implementation** only; BE2 eight-column and BE3 nine-column A+B methodologies remain **provisional**; schema/contract **not locked** |

**BE3 A+B evidence (2026-10-15):** SS Writing + I Can dry checks dual-Pass **9/9** vs companion `ss_v1.json` — [`phase-2/experiments/be3-ss-writing-ican-dry-check-full-roll-up-d017-v1.md`](./phase-2/experiments/be3-ss-writing-ican-dry-check-full-roll-up-d017-v1.md). Owner pack: [`phase-2/experiments/be3-ab-combined-owner-review-d017-v1.md`](./phase-2/experiments/be3-ab-combined-owner-review-d017-v1.md). Preferred artifact: [`phase-2/experiments/be3-sb-u01-u09-book-overview-d017-exp-ab.md`](./phase-2/experiments/be3-sb-u01-u09-book-overview-d017-exp-ab.md). Control / A / B isolates preserved unchanged.

---

### D018 — Five-iteration Chalkie prompt validation

**Date:** 2026-10-15  
**Status:** LOCKED  
**Decision:** Develop and evaluate Chalkie lesson-generation prompts through five cumulative iterations: (V1) Scope & Sequence + Student Book page-specific evidence, (V2) + Workbook, (V3) + AI Curriculum Intelligence, (V4) + Teacher Intelligence, (V5) + School-Specific Intelligence. Start V1 with the two Student Book pages already displayed in the UI. Each iteration must yield a usable Chalkie prompt and be evaluated against its generated lesson to establish meaningful improvement, not merely increased prompt length.  
**Reason:** Scope & Sequence alone lacks the page-specific teaching content needed for a useful lesson; combining it with the Student Book creates a meaningful, testable baseline while preserving progressive simplicity.  
**Alternatives rejected:** Scope & Sequence-only V1; Student Book-only V1; six iterations separating Scope & Sequence and Student Book.  
**Implications:** Preserve source-evidence vs AI-inference boundaries. Gemini remains primarily the extraction tool and OpenAI API the proposed interpretation/prompt-generation tool. Keep lesson scope and evaluation criteria consistent for comparisons. No JSON schema, API implementation, UI redesign, or deployment is locked by this decision.  
**Supersedes:** —  
**Compatibility:** Complements D017; does not replace the existing horizontal/vertical mapping phase distinctions.

**Operational note (2026-10-16):** For comparable D018 runs, record Chalkie creation mode and settings (framework, slide count, theme, vocabulary entry, audio activities, etc.) and review generated output against the prompt. Practical UI/export guidance lives in [`phase-6/chalkie-interface-and-generation-workflow.md`](./phase-6/chalkie-interface-and-generation-workflow.md). That reference does **not** change D018’s iteration scope, lock settings as standards, or unlock Phase 5–6 productization.

**Owner override (2026-10-16) — one-time experimental authorization to proceed to V2:** D018 V1 (BE2 SB Unit 8 pp. 128–129) scored **4 Yes / 3 Partial / 0 No** and remains **BELOW PASS THRESHOLD** (working rule: ≥5 Yes). V1 is accepted as a **usable comparative baseline** only; it is **not** a formal Pass. The owner explicitly authorizes proceeding to **V2** (+ Workbook evidence for the same pilot pages) as a **one-time experimental override**. This override: does **not** change the seven-criterion rubric or Pass threshold; does **not** create a general rule that below-Pass runs may advance; does **not** authorize Phase 5–6 productization; does **not** start V3–V5; does **not** require a V1 rerun at this stage. Evidence: [`phase-5/d018-v1-be2-u08-p128-129-experiment.md`](./phase-5/d018-v1-be2-u08-p128-129-experiment.md).

---

### D019 — Book Intelligence MVP UI path validated (BE2 + BE3)

**Date:** 2026-10-15 (amended same day for BE2)  
**Status:** LOCKED  
**Decision:** The Book Intelligence **MVP UI implementation path is validated for two Big English Student Books**:

| Book | Catalog ID | Column set (provisional) | Path |
|---|---|---|---|
| BE3-SB | `big_english_3_sb` | `nine_column_ab` (A+B; Writing required) | Library → BI (Storage) → `?unit=N` → Validation → Back |
| BE2-SB | `big_english_2_sb` | `eight_column_baseline` (no Writing) | Same shared UI path; dual-set loader/render |

Scripted E2E + PDF U1–U9 acceptance PASS for both books. Shared shell is catalog-book-parameterized; column-set drives field visibility.

**Explicit non-locks (mandatory):** This milestone validates **implementation** of the shared preview path for **BE2-SB and BE3-SB only**. It does **not** lock Phase 2 methodology, JSON schema, UI data contract, prompts, database / `book_files` / `dataset_versions` registration, or Storage path layout as a permanent standard. In particular:

- BE2 **eight-column** overview methodology remains **provisional** (D017 v2 working baseline).
- BE3 **nine-column A+B** preference remains **provisional** (D017 working approval; BE3-SB only).
- Dual column-set support in the draft contract/loader is **not** a methodology unification or schema lock.

D017 operating principle 6 remains in force.

**Reason:** BE3 E2E acceptance established the MVP path; BE2 was added via dual column-set support + Storage/registry without claiming a single methodology for all books.  
**Alternatives rejected:** Treating two-book acceptance as a methodology / schema / contract lock; forcing BE2 into nine-column Writing; declaring production-ready BI for the whole catalog; requiring `book_files` registration; reopening D017.  
**Implications:** Progress and experiment status may treat BE2 and BE3 BI ↔ Validation MVP paths as **implementation-validated**. Further books, contract hardening, Storage formalization, and any methodology change remain owner-gated.  
**Evidence:**  
- BE3: [`phase-2/experiments/be3-bi-validation-e2e-acceptance-d017-v1.md`](./phase-2/experiments/be3-bi-validation-e2e-acceptance-d017-v1.md); [`phase-2/experiments/be3-bi-pdf-navigation-regression-acceptance-d017-v1.md`](./phase-2/experiments/be3-bi-pdf-navigation-regression-acceptance-d017-v1.md); archived scripts under `scripts/archive/bi-pdf-verifiers/`  
- BE2: [`phase-2/experiments/be2-bi-e2e-acceptance-d017-v1.md`](./phase-2/experiments/be2-bi-e2e-acceptance-d017-v1.md); archived scripts under `scripts/archive/bi-pdf-verifiers/`  
**Supersedes:** Prior D019 wording limited to BE3-SB only (same-day amendment).  
**Compatibility:** Complements D017 (and its working approvals) and D018; does not rewrite either.

---

### D020 — Phase 3 Vertical Mapping parked as later priority; cross-book prior-learning reuse

**Date:** 2026-10-19  
**Status:** LOCKED  
**Decision:** Phase 3 — Series Intelligence / Vertical Mapping — remains deliberately **parked for a much later stage** as a matter of **project priority and sequencing**. It is **not** blocked by Phase 2 completion, a “useful / sufficient book overview” threshold, or a standing “wait for owner approval to unlock” prerequisite gate.

When Phase 3 is eventually taken up, its practical teacher-facing role is to extend the same **retrieval-and-reuse** principle as within-book horizontal mapping:

| | Horizontal mapping (current emphasis) | Vertical mapping (Phase 3, later) |
|---|---|---|
| Scope | Earlier **units in the same book** | Earlier **books / grades** in the series |
| AI role | Small evidence-grounded suggestion set (currently **0–5**) | Same pattern when later built |
| Teacher role | Select, deselect, replace, add to, or use **none** | Same when later built |
| Mastery | Prior exposure / prior teaching ≠ mastery | Same |

Primary educational rationale: **cumulative practice and consolidation** — learners may have met foundational language earlier but still need repeated chances to use it accurately and confidently. Illustrative only: a later-grade learner may still need meaningful practice of *What is it? / It is a giraffe.* even if that exchange was introduced in an earlier book.

A particularly important eventual use case is **early units in a new book** (non-binding example): when teaching Big English 3 Unit 8, horizontal mapping can draw from BE3 Units 1–7; when teaching BE3 Unit 1, there are no earlier units in that book — later, vertical mapping could optionally surface suitable prior learning from Big English 2 Units 1–9. This example does **not** lock eligibility rules, matching logic, UI, or timelines.

**Current priorities (unchanged by this park):** (1) finalize a workable Phase 2; (2) develop the practical Phase 4–7 pathway (teaching intelligence, packaging, generation, evaluation); (3) work out how the interface presents evidence-grounded options clearly for teachers. Product direction is AI-suggests / teacher-chooses — not assumed fully automatic “one-click” curricular reuse, and not an abandonment of automation.

**Reason:** Keep later cross-book work visible without contaminating the immediate horizontal-mapping and Phase 2 / Phase 4–7 interface focus; correct docs that incorrectly treated Phase 3 as gated on Phase 2 overview “sufficiency.”  
**Alternatives rejected:** Unlocking or scheduling Phase 3 now; treating Phase 3 as blocked until Phase 2 is “complete” or overviews are “sufficient”; framing Phase 3 only as abstract progression analysis; locking Phase 3 schema, matching, eligible-book policy, UI, or timeline; implying all prior-book material should be reused; equating prior learning with mastery.  
**Implications:** Update overview, architecture, workflow, index, F005, and trackers to match this park reason and eventual teacher-facing purpose. Do **not** start, productize, or schedule Phase 3 implementation. Preserve distinctions among source evidence, AI suggestions, teacher selections, and mapper-generated applications. Horizontal mapping remains the current within-book emphasis.  
**Supersedes:** —  
**Amends / clarifies:** D015 implication that Phase 3 was “parked until controlled Phase 2 experiments provide enough evidence”; D017 Phase 3 bullet (adds teacher-facing retrieval/reuse and explicit later-priority park via this decision); workflow wording that parked Phase 3 “until useful Phase 2 book overviews exist and owner authorizes.”  
**Compatibility:** Preserves D017 progressive method and D001 evidence separation; does not reopen D018/D019.

---

### D021 — Student Book–first lesson preparation

**Date:** 2026-10-21  
**Status:** LOCKED  
**Decision:** For the **standard teacher-facing lesson-preparation workflow**, preparation starts from the **Student Book only**.

1. Teachers choose the Student Book unit and the SB lesson/component they are teaching.
2. Teachers may view the corresponding Workbook at any time.
3. Teachers do **not** create a separate Single Lesson from a Workbook page.
4. Teachers are **not** asked to choose whether to generate from the Student Book or the Workbook.

When an **explicit, human-verified** SB→WB component mapping exists:

- the system may include the Workbook as consolidation/practice in the prepared package;
- the teacher may inspect the mapped Workbook pages;
- the system keeps the evidence distinction clear: **SB = introduction/support**; **WB = consolidation/practice**.

When **no** verified Workbook companion exists:

- prepare the lesson from Student Book evidence only;
- do **not** guess a Workbook match;
- do **not** expose a Workbook-origin lesson-generation path as a workaround.

This supports an **almost-one-button** teacher experience: teachers choose **what they are teaching**, not which internal source-book database should drive the lesson.

**Reason:** Keep the teacher workflow simple and teaching-centred; avoid forcing an SB vs WB generation choice; use verified companions only as under-the-hood consolidation when available.  
**Alternatives rejected:** Asking teachers to pick SB or WB as the generation origin; Workbook-origin Single Lesson as a standard path; guessing WB pairs when none are verified; requiring every lesson to include a Workbook; deleting WB data or mappings.  
**Implications:** Future Chalkie Workspace / packaging UI must treat Student Book selection as the standard entry. Workbook PDFs, Phase 1 WB evidence, and curated SB→WB maps remain; WB may attach only via verified companions. Aligns with the provisional two-lesson-first packaging preference (Lesson 1 SB → Lesson 2 WB when mapped) in [`phase-6/chalkie-interface-and-generation-workflow.md`](./phase-6/chalkie-interface-and-generation-workflow.md) §1A without locking that packaging preference. Does **not** authorize immediate UI/code work. Admin/advanced workflows remain out of scope unless separately approved. Does **not** change D018 experiment design or reopen prior handoff results.  
**Supersedes:** —  
**Compatibility:** Complements D001 (evidence separation), D018 (retained downstream), and curated SB→WB mapping practice; does not rewrite F021/F022.

**Boundary (mandatory):**

- Does **not** delete Workbook data, source PDFs, or mapping work.
- Workbook remains viewable and usable under the hood.
- Does **not** authorize immediate UI/code implementation.
- Does **not** require every lesson to use a Workbook.
- Any future admin/advanced workflow is out of scope unless separately approved.

**Teacher-surface links:** [`phase-5/p5-prototype-chalkie-workspace.md`](./phase-5/p5-prototype-chalkie-workspace.md) · [`phase-6/chalkie-interface-and-generation-workflow.md`](./phase-6/chalkie-interface-and-generation-workflow.md)

---

### D022 — Neutral Lesson Package is the durable handoff; BI is optional curriculum interpretation

**Date:** 2026-10-25  
**Status:** LOCKED  
**Decision:** The durable lesson-preparation handoff is a **Neutral Lesson Package (NLP)** assembled from verified source evidence and teacher selections. Platform outputs (Chalkie, and later MagicSchool / Canva / others) are **adapters** over that package.

Book Intelligence (BI) / Unit Intelligence may enter the NLP **only** as optional, provenance-labelled **`curriculum_interpretation`** planning context (for example communicative focus and suggested learning outcomes). BI must **never**:

- overwrite or replace Phase 1 / verified SB/WB/SS page evidence;
- set or expand printed-page scope;
- populate activity selection, page-scoped vocabulary, or language models;
- be labelled or treated as `[SB]` / `[WB]` / `[SS]` evidence.

The NLP must assemble successfully when only verified source evidence (+ packaging / boundaries / optional teacher-selected prior support) is present. Partial availability of BI, Horizontal Mapping, School Intelligence, or Teacher Intelligence is honest and allowed.

**Reason:** Chalkie is one of several possible generation platforms. Keeping evidence, interpretation, school context, and teacher context distinct makes the package robust and multi-adapter ready while preserving D001 evidence separation.  
**Alternatives rejected:** Treating Chalkie prompts as the product spine; silently merging BI unit overviews into page evidence / vocab / scope; retiring BI entirely; requiring BI before an NLP can assemble; registering BI into Phase 1 canonical JSON or `dataset_versions` in this decision.  
**Implications:** Bounded NLP assembler work is **active** for authorized pairs (see F021 revision). Multi-platform adapters beyond the current Chalkie path remain future. Left-pane Unit Intelligence remains a teacher judgement surface and may feed the NLP interpretation bag when assembled. Do not expand BI to new books until the Opener vertical slice proves adapter value. School Intelligence and Vertical Mapping stay parked (typed room only).  
**Supersedes:** —  
**Amends / clarifies:** F021 (bounded NLP active; multi-platform still future); left-pane Unit Intelligence boundary (interpretation attach allowed; source-evidence mutation still forbidden).  
**Compatibility:** Preserves D001, D017, D019, D021; does not reopen D018 results or lock BI methodology/schema.

---

### D023 — Limited BE3 U8 activity-enrichment POC only

**Date:** 2026-10-28

**Status:** LOCKED

**Decision:** Implement one bounded activity-enrichment proof of concept for:

- five human-verified Big English 3 Unit 8 Student Book activities on pp. 128–129
- four human-verified Workbook companion activities on pp. 104–105 for relationship `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105`

The active POC keeps teacher-friendly summaries in separate experimental sidecar records (SB and WB sidecars remain distinct), preserves the original publisher evidence, uses summary-only teacher cards (no Optional Teaching Guidance; no teacher-facing publisher-evidence disclosure), and projects activity selections into one lesson-specific experimental Neutral Lesson Package with clearly separated `studentBookActivities` and `workbookActivities`. The UI is available only behind `VITE_CHALKIE_BE3_U08_ACTIVITY_ENRICHMENT_POC`, which is default off. Workbook enrichment appears only when the flag is enabled, the SB scope matches exactly, the resolved companion is exactly WB pp. 104–105 for that relationship, and all four expected human-verified Workbook activity IDs match.

**Amendment (2026-10-28):** Optional Teaching Guidance was removed from the active POC (UI, selection state, package fields, and guidance sidecar records). Guidance is parked for possible future reconsideration ([F025](./7-future.md)); do not leave dormant guidance code in this bounded experiment.

**Amendment (2026-10-28):** Exact Workbook companion pp. 104–105 (four activities) added to the same default-off POC. This is not approval for general Workbook enrichment, bulk processing, or library productization ([F024](./7-future.md)).

**Explicit non-locks:** This decision does **not** approve a broad Neutral Lesson Library implementation, production routing, database migrations, bulk enrichment, general Workbook enrichment, canonical Phase 1/SS changes, provider lock-in, expansion beyond these nine activities, or reintroduction of optional teaching guidance without a separate approval. The experimental package projection is not wired into Chalkie or any other generation adapter.

**Reason:** Validate the practical separation among publisher evidence, derived summary, and lesson-specific selection (including SB vs WB source distinction) before considering a larger library architecture. SB Activity 3 (`Play a game.`) is the deliberate insufficient-evidence case: the POC may describe the limitation but must not invent a game procedure.

**Implications:** Owner review should evaluate SB and WB summary accuracy, clarity, selection behaviour, and UI usefulness with the flag enabled. Any correction to the experimental summary text is a bounded POC revision; any wider data model, persistent store, source coverage, production route, guidance reintroduction, or general Workbook enrichment requires separate approval.

**Supersedes:** —

**Compatibility:** Preserves D001 evidence separation, D021 SB-first preparation, and D022 library-independent Neutral Lesson Package assembly.

---

### D024 — Minimal additive Neutral Lesson Library pilot

**Date:** 2026-10-29
**Status:** LOCKED

**Decision:** Implement the BE3 Unit 8 Opener as the first persistent Neutral Lesson Library pilot using four additive Supabase tables: `nll_components`, `nll_component_activities`, `nll_activity_summaries`, and `nll_ss_component_links`. Canonical SS/SB/WB JSON remains unchanged in Storage.

Activity summaries belong directly to stable canonical `activity_id` values, not lesson components. Summary versions can be replaced independently; at most one version is preferred per activity. Source path, dataset SHA-256, and a stable activity fingerprint preserve provenance and identify potentially stale summaries after canonical activity changes.

The pilot contains one component, nine memberships, nine existing summaries (`hidden` + `experimental`), and two `proposed` Unit 8 SS links. Retrieval is read-only. Shadow packaging is default-off, selection-specific, and keeps publisher evidence, AI summaries, and proposed SS relationships distinct.

**Reason:** Establish the smallest useful persistent library that can improve individual knowledge without rewriting canonical evidence or existing lesson components.

**Explicit boundaries:** No production lesson-generation changes, teacher workflow changes, canonical edits, horizontal progression, teacher editing, persistent lesson packages/selections, activity-level SS claims, multi-school model, deployment, or expansion beyond BE3 U8. Remote migration application remains pending because this checkout lacks a linked Supabase CLI/database connection credential.

**Supersedes:** D023's non-lock on persistent NLL work only for this exact pilot. D023 remains the historical bounded sidecar POC decision.

**Compatibility:** Preserves D001, D006, D021, D022, and SS authority.

---

### D025 — Complete NLL pilot through Cursor, then freeze features for repository audit

**Date:** 2026-10-29
**Status:** LOCKED

**Decision:** Delegate exactly three remaining NLL pilot actions to Cursor: (1) safely apply the existing D024 migration to the confirmed existing Supabase project, (2) verify the persistent 1/9/9/2 seed, retrieval, visibility, proposed-SS boundary, RLS behavior, and unchanged canonical foundation, and (3) review, commit, and push only after the first two steps succeed. Deployment is excluded.

The NLL pilot remains incomplete until Cursor reports success for all three actions and the results are reviewed. After successful completion, freeze new feature development. The next milestone is **Project Consolidation & Repository Audit**, beginning read-only under the rule: audit first, delete second.

**Completion annotation (2026-10-29):** All three actions completed and were reviewed. The pilot was committed and pushed on `main` at `f8a86c73f074409e5a366a4881ed4118062a87e2`; no deployment occurred. The feature-development freeze is active.

**Reason:** Close the bounded pilot cleanly before assessing repository redundancy, unused experiments, conflicting documentation, outdated assumptions, and unnecessary complexity.

**Alternatives rejected:** Expanding NLL features before persistence is verified; marking the pilot complete from local tests alone; combining deployment or cleanup with completion; deleting files before an evidence-based audit.

**Implications:** No additional NLL units, horizontal progression, teacher enrichment, adapters, UI redesign, or production NLL integration after completion. Cursor must stop on unsafe connection/target ambiguity or failed verification rather than invent credentials or claim success.

**Supersedes:** —

**Compatibility:** Preserves D024's exact pilot scope, all canonical-data safeguards, and the existing no-deployment boundary.

---

### D026 — Repository consolidation begins with a read-only evidence audit

**Date:** 2026-10-29
**Status:** LOCKED

**Decision:** Begin the Project Consolidation & Repository Audit as a separate read-only milestone. Cursor performs the first technical audit and writes one evidence-backed report. ChatGPT Desktop independently challenges the important findings. The owner approves any cleanup in later, bounded batches.

No file deletion, movement, archival, renaming, refactoring, dependency change, database/Storage mutation, canonical edit, commit, push, deployment, or new feature work is authorized during the first audit.

**Progress annotation (2026-10-29):** Cursor's first-pass audit and ChatGPT Desktop's independent second pass are complete. The owner approved a bounded Batch 0 of documentation and operational-safety corrections only. Feature development remains frozen and production deployment remains deferred.

**Reason:** The repository contains valuable experiments and evolving architecture. Consolidation should reduce real confusion and maintenance burden without deleting operational compatibility paths, canonical evidence, decisions, or useful history based on age or assumption.

**Alternatives rejected:** Immediate cleanup; treating the NLL as proof that prior builders are obsolete; theoretical refactoring without usage evidence; deleting historical records before separating current authority from preserved evidence.

**Implications:** Findings must cite exact locations and usage evidence, classify confidence and risk, and recommend Keep / Consolidate / Archive / Delete. Audit first; delete second. Feature development remains frozen.

**Supersedes:** —

**Compatibility:** Preserves D001, D021, D022, D024, D025, canonical-data safeguards, and the completed NLL pilot.

---

### D027 — Durable layer model: SS/SB/WB → NLL → NLP → adapters

**Date:** 2026-10-29
**Status:** LOCKED

**Decision:** Adopt the durable architecture:

- SS/SB/WB: canonical publisher evidence.
- NLL: single persistent authority for reusable derived lesson knowledge.
- NLP: lesson-specific package assembled from evidence, teacher selections and applicable NLL knowledge.
- Adapters: Chalkie now and future output platforms later.

“Single persistent store” means the single persistent authority for reusable derived lesson knowledge. It does not include canonical SS/SB/WB evidence, transient teacher selections, saved NLP reproducibility snapshots, or automatically every Book Intelligence, teacher or school record.

A saved NLP is a reproducibility snapshot of one lesson preparation, not a competing reusable knowledge authority. Chalkie and future platforms remain adapters over the NLP.

Preserve existing lightweight NLL safeguards: useful source references, activity fingerprints and preferred-summary versioning. Do not add elaborate approval workflows, governance systems or unnecessary bureaucracy.

**Reason:** Keep publisher truth, reusable derived knowledge, lesson-specific packages and platform outputs distinct so the library can improve without rewriting books or making Chalkie the product spine.

**Explicit boundaries:** D027 does not supersede D022–D026. It does not lift the D026 feature freeze. It does not authorize Stages 3–6, production NLL UI wiring, bulk enrichment, expansion beyond the BE3 U8 pilot, retirement of bespoke/neutral/POC paths, or deployment. Stage 2 is planning only. Stages 3–6 require separate owner authorization.

**Alternatives rejected:** Treating Chalkie prompts as the durable store; treating NLP snapshots as the reusable library; merging derived summaries into canonical JSON; declaring NLL proof that D023, neutral canaries or bespoke builders are obsolete without verified replacement; heavyweight approval bureaucracy for summary edits.

**Implications:** Documentation and later migrations must keep the four layers distinguishable. D022 remains the NLP/adapter lock; D023 remains the historical bounded POC; D024/D025 remain the NLL pilot facts; D026’s freeze remains until later stages are explicitly authorized. D022–D026 bodies remain unchanged.

**Supersedes:** —

**Compatibility:** Preserves D001, D021, D022, D023, D024, D025 and D026.

---

### D028 — BE3 U8 Values remains generic SB-only; no specialized NLL/A/B/C

**Date:** 2026-10-30
**Status:** LOCKED

**Decision:** BE3 Unit 8 Values (SB p.142 only; publisher wording *Get exercise.*) is complete by architecture decision: retain the existing generic `sb_only` path; do not invent a Workbook companion; do not create a Values NLL component, A/B/C transfer pipeline, specialized package, renderer, adapter, or flag.

**Reason:** Values has no curated Workbook companion. Forcing a paired SB→WB A/B/C milestone would invent packaging that the evidence does not support and would duplicate an already-working generic SB-only path.

**Alternatives rejected:** Inventing a WB companion from Phonics p.116 or Review p.117; creating Values-A/B/C for consistency with paired components; specialized Values Chalkie routing; Values NLL seed without a concrete benefit case over generic `sb_only`.

**Implications:** Values work stops at architecture/documentation closure plus retained generic-path tests. Phonics and Review remain separately gated paired components. No Values migration may be prepared or applied under this decision.

**Supersedes:** —

**Compatibility:** Preserves D021, D022, D026, and D027.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-30 | Added D028 — BE3 U8 Values remains generic SB-only; no specialized NLL/A/B/C pipeline. |
| 2026-10-29 | Added D027 — durable layer model SS/SB/WB → NLL → NLP → adapters; Stage 2 roadmap recorded; Stages 3–6 and freeze lift not authorized. |
| 2026-10-29 | Annotated D025 completion and D026 audit completion; bounded Batch 0 documentation/operational-safety work approved, with freeze and no-deployment boundaries preserved. |
| 2026-10-29 | Added D026 — repository consolidation starts with a delegated read-only evidence audit; no cleanup or feature work authorized. |
| 2026-10-29 | Added D025 — delegate migration, persistence verification, and Git completion to Cursor; freeze features after success; next milestone is read-only repository consolidation/audit. |
| 2026-10-29 | Added D024 — minimal additive NLL pilot for BE3 U8; stable activity-keyed summaries, four tables, hidden experimental seed, and default-off shadow retrieval/package. |
| 2026-10-28 | Amended D023 — exact WB companion pp. 104–105 (four activities) added to the same default-off summary-only POC; not general WB enrichment. |
| 2026-10-28 | Amended D023 — Optional Teaching Guidance removed from the active POC and parked (F025); summaries + activity selection remain. |
| 2026-10-28 | Added D023 — exact-scope BE3 U8 activity-enrichment POC only; sidecars + experimental package projection; no broad library or production approval. |
| 2026-10-25 | Added D022 — NLP is the durable handoff; BI optional `curriculum_interpretation` only; never page evidence. |
| 2026-10-06 | Created canonical decision log; recorded D001–D004 from existing project doctrine. |
| 2026-10-06 | Added D005 — Supabase backend platform locked. |
| 2026-10-07 | Added D006 — hybrid storage architecture locked; catalog migration created. |
| 2026-10-07 | Added D007 — catalog book_id canonical; alias map + merge-time normalization. |
| 2026-10-07 | Added D008 — automated structural validation is separate from human/source verification and gates future progression on ERROR findings. |
| 2026-10-07 | Added D009 — project-wide naming conventions locked; authority doc + always-on Cursor rule. |
| 2026-10-07 | D009 authority clarified to v1.1 after naming audit (no decision reopen). |
| 2026-10-08 | Added D010 — Cloudflare R2 for textbook source PDFs; refined D005/D006 implications (docs-only; no migration). |
| 2026-10-08 | Added D011 — Validation PDF signing via `/api/sign-source-pdf` with R2-first dual-read and catalog authorization. |
| 2026-10-08 | Added D012 — source PDFs R2-only; Supabase PDF dual-read retired; originals left unused. |
| 2026-10-08 | Added D013 — human verify available PDF content with documented missing-source exception (BE1-WB U9). |
| 2026-10-09 | Added D014 — Validation viewer navigates by extracted `pdf_page` with printed labels (resolves F015; BE3-SB pp. 66–67 missing). |
| 2026-10-09 | Added D015 — Phase 1 intentionally paused at 14/18; bounded Big-English-only Phase 2 experiments become the active priority without locking implementation or schema. |
| 2026-10-09 | Added D016 — first Phase 2 candidates BE2-SB U6/U7/U8 with Unit 6 first; protocol defined without schema lock. |
| 2026-10-11 | Added D017 — prefer V3.1 unit SoT + Cross-Unit V1.2 connections for BE2 experiments; explicitly not a methodology/schema lock. |
| 2026-10-12 | Replaced D017 with Progressive Curriculum Intelligence; prior V3.1+V1.2 preference retained as historical research note only; next proposed experiment = BE2-SB U1–9 book overview (awaiting owner execution approval). |
| 2026-10-15 | Added D018 — five cumulative Chalkie prompt iterations, starting with combined Scope & Sequence + Student Book. |
| 2026-10-15 | Recorded D017 working approval: prefer BE3 Experiment A+B for BE3-SB only; no methodology/schema lock; BE2 v2 baseline unchanged. |
| 2026-10-15 | Added D019 — BE3 BI MVP UI path implementation-validated; methodology/schema/contract explicitly not locked. |
| 2026-10-15 | Amended D019 — two-book implementation validation (BE2 eight-column + BE3 nine-column); both methodologies remain provisional; schema/contract not locked. |
| 2026-10-16 | D018 operational note — cross-reference Chalkie interface/generation workflow V1 for settings recording; decision substance unchanged. |
| 2026-10-16 | D018 owner override — one-time experimental authorization to proceed to V2 despite V1 below formal Pass; rubric and decision design unchanged. |
| 2026-10-19 | Added D020 — Phase 3 Vertical Mapping parked as later priority (not a Phase 2-sufficiency gate); eventual cross-book prior-learning reuse for teacher choice; amends D015/D017 park wording. |
| 2026-10-21 | Added D021 — Student Book–first lesson preparation for the standard teacher workflow; WB via verified companions only; no immediate UI/code authorization. |

