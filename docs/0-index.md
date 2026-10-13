# General Curriculum Mapper — Documentation Index

**Status:** ACTIVE  
**Version:** 1.0  
**Purpose:** Master index of project documentation. Keep this file current whenever docs are added, removed, renamed, or substantively updated.

---

## How to use this index

| Column | Meaning |
|---|---|
| **Doc** | Link to the markdown source |
| **Summary** | Short human-readable description of what the doc contains |
| **Version** | Document or schema version stated in the source (or `—` if none) |
| **Lifecycle** | `ACTIVE` (in use / evolving), `PARKED` (retained, not current priority), or `LOCKED` (frozen) |

Lifecycle values are taken from each document’s own **Status** field and normalized to Active / Parked / Locked.

Docs are organized under `docs/phase-1` … `docs/phase-6` where applicable. `phase-5` remains an intentional placeholder. Active direction is D017 Progressive Curriculum Intelligence (minimum-sufficient Phase 2 Book Intelligence first). Earlier LR / V3.1 / V1.2 / e2e / enrichment work remains historical research under D015/D016.

AI-facing operating trackers: [`4-decisions.md`](./4-decisions.md), [`5-progress.md`](./5-progress.md), [`6-todo.md`](./6-todo.md), [`7-future.md`](./7-future.md).

---

## Documents

### Root — overview & operating trackers

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [0-index.md](./0-index.md) | Master documentation index for the General Curriculum Mapper. Lists every project doc with a short summary, version, and lifecycle status. | 1.0 | ACTIVE |
| [1-project-overview.md](./1-project-overview.md) | High-level project purpose, principles and seven-phase architecture; D015 pauses Phase 1 at 14/18; D017 Progressive Curriculum Intelligence; BE2 U1–9 overview v2 candidate awaiting owner review. | — | ACTIVE |
| [2-tech-stack.md](./2-tech-stack.md) | Locked technology stack: Supabase Auth/Postgres; R2-only textbook PDFs (D010/D012); Supabase Storage for JSON/covers; pilot implementation status. | — | ACTIVE |
| [3-architecture.md](./3-architecture.md) | System architecture: phase boundaries, data flow from source evidence through interpretation, enrichment, packaging, generation, plus cross-cutting storage. | — | ACTIVE |
| [4-decisions.md](./4-decisions.md) | Canonical decision log: locked choices with date, reason, and rejected alternatives (through D017 Progressive Curriculum Intelligence). | 1.0 | ACTIVE |
| [5-progress.md](./5-progress.md) | Current project state (Done / In progress / Next / Blocked). Primary file for understanding where the project is today. | 1.0 | ACTIVE |
| [6-todo.md](./6-todo.md) | Concrete near-term actionable tasks; not a long-term idea dump. | 1.0 | ACTIVE |
| [7-future.md](./7-future.md) | Parking lot for deferred work and ideas not now; F004 Phase 2 promoted by D015, Phase 3 remains parked, and four unfinished Phase 1 books are deferred as F016. | 1.0 | ACTIVE |
| [8-database-architecture.md](./8-database-architecture.md) | Hybrid storage: PostgreSQL catalog vs object storage (R2-only PDFs / Supabase JSON+covers) vs JSON curriculum; status field distinctions. | 1.1 | ACTIVE |
| [9-naming-conventions.md](./9-naming-conventions.md) | Project-wide naming authority: style matrix, identity vocabulary, catalog/entity templates, Postgres UUID vs catalog collision, local PDF + unit-batch paths (`app/src/assets/books/…`, `data/phase1/…`), asset/audit filename rules, legacy grandfathering, and backward-audit policy (D009). App TS uses `catalogBookId` / `bookUuid`. | 1.5 | ACTIVE |
| [10-storage-architecture.md](./10-storage-architecture.md) | Object-storage plan: R2-only textbook PDFs (D012; Stages A–E PASS), Supabase for JSON/covers; unused Supabase PDF copies retained. | 1.2 | ACTIVE |
| [11-curriculum-mapping-workflow.md](./11-curriculum-mapping-workflow.md) | Project-wide curriculum mapping workflow for Phases 1–4 (purpose, inputs, process, outputs, validation, handoffs) under D017; Phases 5–7 referenced only. | 1.0 | ACTIVE |

### Project tracking

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [project-tracking/0-project-steps.md](./project-tracking/0-project-steps.md) | Chronological log of agent prompts that changed project files. Each non-Ask, file-changing prompt is recorded as one numbered step with a short summary. | 1.0 | ACTIVE |
| [project-tracking/1-project-status.md](./project-tracking/1-project-status.md) | Short current snapshot (done / status / next); detailed narrative in [`5-progress.md`](./5-progress.md). | 1.0 | ACTIVE |
| [project-tracking/2-internal-brainstorming.md](./project-tracking/2-internal-brainstorming.md) | Evolving internal brainstorming space for open questions, options, and possible solutions (incl. R2 cutover details after D010). | 1.0 | ACTIVE |
| [project-tracking/3-project-decisions.md](./project-tracking/3-project-decisions.md) | Legacy pointer to [`4-decisions.md`](./4-decisions.md); kept for older links. | 1.0 | ACTIVE |
| [project-tracking/4-mock-data-registry.md](./project-tracking/4-mock-data-registry.md) | Distinguishes live Supabase catalog/Storage/Validation data from remaining UI mocks (Beehive page spreads, teacher AI). | — | ACTIVE |

### Phase 1

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-1/phase-1-extraction-workflow.md](./phase-1/phase-1-extraction-workflow.md) | Practical Phase 1 extraction / book-evidence procedures (pipeline, batches, verification, canonical handoff); Phase 1 paused at 14/18 under D015. | 1.0 | ACTIVE |
| [phase-1/google-ai-studio-prompt.md](./phase-1/google-ai-studio-prompt.md) | Phase 1 Google AI Studio extraction prompt (V2). Unit-by-unit JSON batches with D009 naming; mid-book new-chat caution (carry counters / slug forms; BE2-WB lesson). | V2 | ACTIVE |
| [phase-1/extraction-data-specification.md](./phase-1/extraction-data-specification.md) | Authoritative Phase 1 data specification for extraction boundaries and verified-batch → merge → validation → audit workflow; Phase 1 is paused at 14/18 under D015. | — | ACTIVE |
| [phase-1/json-schema.md](./phase-1/json-schema.md) | Working Phase 1 schema 0.1 plus machine-schema/validator responsibilities, D009 identifier guidance for new books, and `continuous_text.text_id` clarification. | 0.1 | ACTIVE |
| [phase-1/dataset-registry.md](./phase-1/dataset-registry.md) | Operational registry of 18 books: fourteen individually Phase 1 COMPLETE; project-wide Phase 1 paused at 14/18 with BH2 and three Reach Higher books deferred. | — | ACTIVE |
| [phase-1/cross-series-schema-review-notes.md](./phase-1/cross-series-schema-review-notes.md) | Cross-series schema 0.1 review; owner-accepted recommendations, 0.2 deferral, and the later D008 automated-validation status update. | 1.1 | ACTIVE |
| [phase-1/book-id-alias-map.md](./phase-1/book-id-alias-map.md) | Catalog `book_id` is canonical (D007); D009 forward naming; BE1–BE6 SB/WB COMPLETE. | 2.1 | ACTIVE |
| [phase-1/book_id_aliases.json](./phase-1/book_id_aliases.json) | Machine-readable catalog↔alias map; includes BE5/BE6 and prior BE Studio aliases for merge-time `book_id` normalization. | 1 | ACTIVE |
| [phase-1/audits/BE1-SB_canonical_v1_audit.md](./phase-1/audits/BE1-SB_canonical_v1_audit.md) | BE1-SB canonical whole-book/source audit PASSED; retrospective automated validation passed with warnings. | 1.2 | ACTIVE |
| [phase-1/audits/BE1-WB_canonical_v1_audit.md](./phase-1/audits/BE1-WB_canonical_v1_audit.md) | BE1-WB canonical whole-book audit PASSED with D013 missing-source exception (printed pp. 124–129); automated validation passed with warnings. | 1.2 | ACTIVE |
| [phase-1/audits/BH1_canonical_v1_audit.md](./phase-1/audits/BH1_canonical_v1_audit.md) | BH1 canonical whole-book/source audit PASSED; retrospective automated validation passed with warnings. | 1.2 | ACTIVE |
| [phase-1/audits/BE2-SB_canonical_v1_audit.md](./phase-1/audits/BE2-SB_canonical_v1_audit.md) | BE2-SB whole-book/source audit PASSED; appendix sticker pages added so automated validation now PASSED WITH WARNINGS. | 1.3 | ACTIVE |
| [phase-1/audits/BE2-WB_canonical_v1_audit.md](./phase-1/audits/BE2-WB_canonical_v1_audit.md) | BE2-WB canonical whole-book audit PASSED; U8/U9 remumber root cause = mid-book new Studio chats; appendix p.141 omission documented. | 1.3 | ACTIVE |
| [phase-1/audits/BE3-SB_canonical_v1_audit.md](./phase-1/audits/BE3-SB_canonical_v1_audit.md) | BE3-SB canonical whole-book audit PASSED; U3/U4 ID remumber + U2 workbook null-rel fix; missing pp. 66–67 (D013); D008 passed with warnings. | 1.0 | ACTIVE |
| [phase-1/audits/BE3-WB_canonical_v1_audit.md](./phase-1/audits/BE3-WB_canonical_v1_audit.md) | BE3-WB canonical whole-book audit PASSED; grammar pages 136/139/140; U5 p.138 relationship fix; D008 passed with warnings. | 1.0 | ACTIVE |
| [phase-1/audits/BE4-SB_canonical_v1_audit.md](./phase-1/audits/BE4-SB_canonical_v1_audit.md) | BE4-SB canonical whole-book audit PASSED; U4/U9 Studio unit-ID relationship remap; checkpoint gaps 52–57 / 106–111; D008 passed with warnings. | 1.0 | ACTIVE |
| [phase-1/audits/BE4-WB_canonical_v1_audit.md](./phase-1/audits/BE4-WB_canonical_v1_audit.md) | BE4-WB canonical whole-book audit PASSED; grammar pages 134/135/139/140/142; U7 remumber; p.88/137/141 omissions; D008 passed with warnings. | 1.0 | ACTIVE |
| [phase-1/audits/BE5-SB_canonical_v1_audit.md](./phase-1/audits/BE5-SB_canonical_v1_audit.md) | BE5-SB canonical whole-book audit PASSED; checkpoint gaps 52–57 / 106–111; U3 lang_05/07 unresolved warnings; D008 passed with warnings. | 1.0 | ACTIVE |
| [phase-1/audits/BE5-WB_canonical_v1_audit.md](./phase-1/audits/BE5-WB_canonical_v1_audit.md) | BE5-WB canonical whole-book audit PASSED; grammar pages 140/141/142; U2 vocab relationship remap; D008 passed with warnings. | 1.0 | ACTIVE |
| [phase-1/audits/BE6-SB_canonical_v1_audit.md](./phase-1/audits/BE6-SB_canonical_v1_audit.md) | BE6-SB canonical whole-book audit PASSED; checkpoint gaps 52–57 / 106–111; U1 wordlist page_id cleared; D008 passed with warnings. | 1.0 | ACTIVE |
| [phase-1/audits/BE6-WB_canonical_v1_audit.md](./phase-1/audits/BE6-WB_canonical_v1_audit.md) | BE6-WB canonical whole-book audit PASSED; grammar pages 138/139; U8 remumber + unit-alias remap; D008 passed with warnings. | 1.0 | ACTIVE |
| [phase-1/audits/RH2A_canonical_v1_audit.md](./phase-1/audits/RH2A_canonical_v1_audit.md) | RH2A canonical whole-book/source audit PASSED; retrospective automated validation passed with warnings. | 1.2 | ACTIVE |

### Phase 2

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-2/be2-candidate-units.md](./phase-2/be2-candidate-units.md) | Owner-approved first Phase 2 candidate set: BE2-SB Units 6 / 7 / 8 with Unit 6 first (D016); evidence rules and non-selected units. | 1.0 | ACTIVE |
| [phase-2/be2-unit-6-experiment-protocol.md](./phase-2/be2-unit-6-experiment-protocol.md) | Bounded first-experiment protocol for BE2-SB Unit 6 *My Day*: question, inputs, evidence tags, outputs, and evaluation criteria without schema lock. | 1.0 | ACTIVE |
| [phase-2/p2-exp-be2-u06-v1-review.md](./phase-2/p2-exp-be2-u06-v1-review.md) | First Phase 2 experiment review artifact for BE2-SB Unit 6: inventory, prior/future candidates, false friends, method lessons, E1–E6 self-eval; awaiting owner review. | 1.0 | ACTIVE |
| [phase-2/p2-exp-be2-u06-v2-protocol.md](./phase-2/p2-exp-be2-u06-v2-protocol.md) | Second Phase 2 experiment protocol: interpret BE2-SB Unit 6 into observable learning requirements; evaluation criteria V2-E1–E9 defined before results; no schema lock. | 1.0 | ACTIVE |
| [phase-2/p2-exp-be2-u06-v2-review.md](./phase-2/p2-exp-be2-u06-v2-review.md) | Unit 6 learning-requirements review artifact: LRs, grammar/vocab/activities, difficulties, core vs supporting, teacher synthesis, V2-E1–E9 eval; awaiting owner review. | 1.0 | ACTIVE |
| [phase-2/p2-exp-be2-u07-v1-protocol.md](./phase-2/p2-exp-be2-u07-v1-protocol.md) | Unit 7 Phase 2 protocol: apply refined U6 LR method to *My Favorite Food* and evaluate methodological generalization (U7-E1–E9 + G1–G4); no schema lock. | 1.0 | ACTIVE |
| [phase-2/p2-exp-be2-u07-v1-review.md](./phase-2/p2-exp-be2-u07-v1-review.md) | Unit 7 LR interpretation + U6↔U7 method comparison; reusable practices and adaptations documented; awaiting owner review before any Unit 8 work. | 1.0 | ACTIVE |
| [phase-2/p2-exp-be2-u08-v1-protocol.md](./phase-2/p2-exp-be2-u08-v1-protocol.md) | Unit 8 Phase 2 protocol: repeat Unit 7 LR method on *Wild Animals* and compare methodology across Units 6–8 (U8-E1–E9 + G1–G4); no schema lock. | 1.0 | ACTIVE |
| [phase-2/p2-exp-be2-u08-v1-review.md](./phase-2/p2-exp-be2-u08-v1-review.md) | Unit 8 LR interpretation + three-unit method comparison; D016 candidate set LR experiments complete pending owner review. | 1.0 | ACTIVE |
| [phase-2/p2-exp-be1-u01-v1-protocol.md](./phase-2/p2-exp-be1-u01-v1-protocol.md) | BE1 Unit 1 transfer-test protocol: apply BE2 U6–U8 LR method as-is to *Good Morning, Class!*; evaluation criteria BE1-E1–E9 + T1–T7; no methodology/schema lock. | 1.0 | ACTIVE |
| [phase-2/p2-exp-be1-u01-v1-review.md](./phase-2/p2-exp-be1-u01-v1-review.md) | BE1 Unit 1 LR transfer-test review: 12 LRs, evaluation vs BE2 U6–U8, recommendations; methodology transfers; awaiting owner review before further units. | 1.0 | ACTIVE |
| [phase-2/phase-2-experiment-status.md](./phase-2/phase-2-experiment-status.md) | Phase 2 experiment status under D017: BE2 U1–9 overview v1 preserved; v2 second pass + publisher S&S comparison executed (not accepted); LR/V3.1/V1.2/e2e/enrich as research history. | 1.5 | ACTIVE |
| [phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v1.md](./phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v1.md) | D017 Book Intelligence experiment: BE2-SB Units 1–9 Markdown overview + ChatGPT review findings (§G); not formally accepted; preserved as v1 baseline. | 1.0 | ACTIVE |
| [phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v2.md](./phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v2.md) | D017 v2 comparison candidate: eight-column BE2-SB U1–9 overview refined from Phase 1 evidence; not accepted / not production-ready. | 1.0 | ACTIVE |
| [phase-2/experiments/be2-sb-u01-u09-overview-v2-review.md](./phase-2/experiments/be2-sb-u01-u09-overview-v2-review.md) | v1 vs v2 summary, publisher Scope and Sequence comparison (~92% meaningful coverage AI-assessed), and Learning Outcomes consistency assessment. | 1.0 | ACTIVE |
| [phase-2/phase-2-overview-v2.md](./phase-2/phase-2-overview-v2.md) | Historical Phase 2 planning SoT v2 (exhaustive unit/page/JSON sketches); superseded by D017; retained for research context only. | — | PARKED |
| [phase-2/p2-inspect-be2-inputs.md](./phase-2/p2-inspect-be2-inputs.md) | Inspection memo: BE2 Phase 1 JSON shape/U8 slice counts + lessons from prior U6–U8 / BE1 U1 experiments before Studio prompt design. | 1.0 | ACTIVE |
| [phase-2/phase2-v3.1-prompt.md](./phase-2/phase2-v3.1-prompt.md) | Paste-ready experimental Google AI Studio prompt V3.1: unit-neutral linguistic anatomy from Phase 1 canonical JSON. | 3.1 | ACTIVE |
| [phase-2/cross-unit-v1.2-prompt.md](./phase-2/cross-unit-v1.2-prompt.md) | Preferred experimental cross-unit prompt V1.2: connections only (≥2 units); shared_skill vs related_knowledge; not a methodology lock. | 1.2 | ACTIVE |
| [phase-2/p2-exp-be2-v3.1-cross-unit-status.md](./phase-2/p2-exp-be2-v3.1-cross-unit-status.md) | Inventory/validation for BE2 U1/U6/U8 V3.1 unit JSON + cross-unit V1.1/V1.2 artifacts; confirmed vs preferences vs unresolved; V1.2 connections structurally validated. | 1.1 | ACTIVE |
| [phase-2/p2-exp-be2-u06-e2e-v1/p2-exp-be2-u06-e2e-v1-protocol.md](./phase-2/p2-exp-be2-u06-e2e-v1/p2-exp-be2-u06-e2e-v1-protocol.md) | Bounded end-to-end teacher-brief protocol: BE2 U6 Phase 1 vs V3.1+V1.2; isolation rule and evaluation criteria; not a Phase 3 start. | 1.0 | ACTIVE |
| [phase-2/p2-exp-be2-u06-e2e-v1/p2-exp-be2-u06-e2e-v1-brief-a-baseline.md](./phase-2/p2-exp-be2-u06-e2e-v1/p2-exp-be2-u06-e2e-v1-brief-a-baseline.md) | Teacher curriculum Brief A for BE2 U6 focus: Phase 1–only baseline drafted before V3.1/V1.2. | 1.0 | ACTIVE |
| [phase-2/p2-exp-be2-u06-e2e-v1/p2-exp-be2-u06-e2e-v1-brief-b-informed.md](./phase-2/p2-exp-be2-u06-e2e-v1/p2-exp-be2-u06-e2e-v1-brief-b-informed.md) | Teacher curriculum Brief B for BE2 U6 focus: Phase 1 + V3.1 + selected CON-01/CON-02. | 1.0 | ACTIVE |
| [phase-2/p2-exp-be2-u06-e2e-v1/p2-exp-be2-u06-e2e-v1-evaluation.md](./phase-2/p2-exp-be2-u06-e2e-v1/p2-exp-be2-u06-e2e-v1-evaluation.md) | Comparative evaluation of teacher Briefs A vs B; modest planning usefulness; not a methodology lock. | 1.0 | ACTIVE |
| [phase-2/phase2-unit-page-output-v0.1.md](./phase-2/phase2-unit-page-output-v0.1.md) | Earlier experimental Phase 2 unit+page JSON output sketch (0.1-experimental); superseded in practice by v3.1 `phase2_linguistic_anatomy` output shape; retained for history. | 0.1-experimental | PARKED |

### Phase 4

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-4/teacher-enrichment-philosophy.md](./phase-4/teacher-enrichment-philosophy.md) | Phase 4 philosophy for teacher enrichment: floor-first depth, curriculum fidelity, productive language practice, and how enrichment must stay distinct from source evidence. | V1 | ACTIVE |
| [phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-protocol.md](./phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-protocol.md) | Bounded Phase 4 enrichment probe protocol: BE2 U6 A/B (Phase 1 vs V3.1+V1.2); isolation, classification, and decision-change rules; not a Phase 4 start. | 1.0 | ACTIVE |
| [phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-proposal-a-phase1.md](./phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-proposal-a-phase1.md) | Enrichment Proposal A for BE2 U6 focus: up to three conditional opportunities from Phase 1 only (isolation before V3.1/V1.2). | 1.0 | ACTIVE |
| [phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-proposal-b-informed.md](./phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-proposal-b-informed.md) | Enrichment Proposal B for BE2 U6 focus: Phase 1 + V3.1 + CON-01/CON-02; same format as A; CON-01 declined as enrichment driver. | 1.0 | ACTIVE |
| [phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-evaluation.md](./phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-evaluation.md) | Comparative evaluation of enrichment Proposals A vs B; criterion scores plus decision-change analysis (same three interventions). | 1.0 | ACTIVE |

### Phase 6

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-6/chalkie-ai-handover-specifications.md](./phase-6/chalkie-ai-handover-specifications.md) | Parked Phase 6 handover spec from Chalkie.ai experiments; retained while D015 Phase 2 interpretation experiments are the active priority. | V1 | PARKED |

---

## Lifecycle snapshot

| Lifecycle | Count | Notes |
|---|---:|---|
| ACTIVE | 64 | Current working docs, including index, operating trackers, project-wide curriculum mapping workflow, D017 Book Intelligence v1/v2 experiment artifacts, Phase 2 research inventory, Phase 4 enrichment probe, naming conventions, storage architecture, audits, and project-tracking |
| PARKED | 3 | Phase 6 handover spec; Phase 2 unit+page output sketch v0.1; Phase 2 overview v2 (superseded by D017) |
| LOCKED | 0 | None currently frozen |

---

## Maintenance

This index is maintained automatically under the project Cursor rule `.cursor/rules/documentation_update.mdc`.

Operating trackers are maintained under `.cursor/rules/operating_trackers.mdc` and `.cursor/rules/project_status_rule.mdc`.

Whenever any file under `docs/` (except routine edits to this index alone) is **added, removed, renamed, or substantively updated**, refresh this file so that:

1. every documentation `.md` file appears exactly once;
2. links resolve correctly;
3. summaries stay accurate;
4. Version and Lifecycle match each document’s header/status fields.
