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

Docs are organized under `docs/phase-1` … `docs/phase-6` where applicable. Active development follows a **teacher-first** priority order: workable Phase 2; practical Phase 4–7 pathway; clear teacher-facing options — with **immediate emphasis on bounded horizontal mapping** for cumulative learning (within one book; teacher-controlled). Main explanation: [`11-curriculum-mapping-workflow.md`](./11-curriculum-mapping-workflow.md). **D018** evidence is preserved but **downstream / parked** for now. Book Intelligence remains provisional under D017/D019. Phase 3 Vertical Mapping remains **parked as a later priority (D020)** — not gated on Phase 2 completion; eventual cross-book prior-learning reuse for teacher choice.

AI-facing operating trackers: [`4-decisions.md`](./4-decisions.md), [`5-progress.md`](./5-progress.md), [`6-todo.md`](./6-todo.md), [`7-future.md`](./7-future.md).

---

## Documents

### Root — overview & operating trackers

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [0-index.md](./0-index.md) | Master documentation index for the General Curriculum Mapper. Lists every project doc with a short summary, version, and lifecycle status. | 1.0 | ACTIVE |
| [1-project-overview.md](./1-project-overview.md) | Project purpose, seven-phase architecture, and teacher-first priorities; **immediate emphasis: horizontal mapping**; Phase 3 Vertical Mapping later priority (D020) for cross-book prior-learning reuse; D018/Chalkie downstream; D017/D019 provisional. | — | ACTIVE |
| [2-tech-stack.md](./2-tech-stack.md) | Locked technology stack: Supabase Auth/Postgres; R2-only textbook PDFs (D010/D012); Supabase Storage for JSON/covers; pilot implementation status. | — | ACTIVE |
| [3-architecture.md](./3-architecture.md) | System architecture: phase boundaries and data flow; horizontal mapping within Phase 2; Phase 3 Vertical Mapping parked as later priority (D020) — teacher-facing cross-book reuse, not Phase-2-gated; D018 downstream. | — | ACTIVE |
| [4-decisions.md](./4-decisions.md) | Canonical decision log through **D020**: Phase 3 Vertical Mapping parked as later priority (not Phase-2-gated); cross-book prior-learning reuse for teacher choice; D017/D019 BI methodologies remain provisional. | 1.0 | ACTIVE |
| [5-progress.md](./5-progress.md) | Current project state (Done / In progress / Next / Blocked). Horizontal mapping is the current in-progress priority. | 1.0 | ACTIVE |
| [6-todo.md](./6-todo.md) | Concrete near-term actionable tasks; Exp 10 closed (PASS AFTER TEACHER REVIEW); identify next project question. | 1.0 | ACTIVE |
| [7-future.md](./7-future.md) | Parking lot for deferred work; F005 Phase 3 later priority (D020); D018 / Lesson Series parked downstream (not cancelled); full Chalkie productization later. | 1.0 | ACTIVE |
| [8-database-architecture.md](./8-database-architecture.md) | Hybrid storage: PostgreSQL catalog vs object storage (R2-only PDFs / Supabase JSON+covers) vs JSON curriculum; status field distinctions. | 1.1 | ACTIVE |
| [9-naming-conventions.md](./9-naming-conventions.md) | Project-wide naming authority: style matrix, identity vocabulary, catalog/entity templates, Postgres UUID vs catalog collision, local PDF + unit-batch / optional `canonical/ss_v{N}.json` paths, asset/audit filename rules, legacy grandfathering, and backward-audit policy (D009). App TS uses `catalogBookId` / `bookUuid`. | 1.6 | ACTIVE |
| [10-storage-architecture.md](./10-storage-architecture.md) | Object-storage plan: R2-only textbook PDFs (D012; Stages A–E PASS), Supabase for JSON/covers; unused Supabase PDF copies retained. | 1.2 | ACTIVE |
| [11-curriculum-mapping-workflow.md](./11-curriculum-mapping-workflow.md) | Project-wide curriculum mapping workflow; **main explanation** of immediate horizontal-mapping flow; Phase 3 Vertical Mapping later priority (D020) for optional cross-book prior learning; D018/Chalkie downstream. | 1.1 | ACTIVE |

### Project tracking

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [project-tracking/0-project-steps.md](./project-tracking/0-project-steps.md) | Chronological log of agent prompts that changed project files. Each non-Ask, file-changing prompt is recorded as one numbered step with a short summary. | 1.0 | ACTIVE |
| [project-tracking/1-project-status.md](./project-tracking/1-project-status.md) | Short current snapshot (done / status / next); detailed narrative in [`5-progress.md`](./5-progress.md). | 1.0 | ACTIVE |
| [project-tracking/2-internal-brainstorming.md](./project-tracking/2-internal-brainstorming.md) | Evolving internal brainstorming space for open questions, options, and possible solutions (incl. R2 cutover details after D010). | 1.0 | ACTIVE |
| [project-tracking/3-project-decisions.md](./project-tracking/3-project-decisions.md) | Legacy pointer to [`4-decisions.md`](./4-decisions.md); kept for older links. | 1.0 | ACTIVE |
| [project-tracking/4-mock-data-registry.md](./project-tracking/4-mock-data-registry.md) | Distinguishes live Supabase catalog/Storage/Validation data from remaining UI mocks/prototypes (Beehive spreads, teacher AI, Storage-backed BE3 BI preview not in `book_files`). | — | ACTIVE |

### Phase 1

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-1/phase-1-extraction-workflow.md](./phase-1/phase-1-extraction-workflow.md) | Practical Phase 1 extraction / book-evidence procedures (pipeline, batches, verification, canonical handoff); Phase 1 paused at 14/18 under D015. | 1.0 | ACTIVE |
| [phase-1/google-ai-studio-prompt-sb-wb-v2.md](./phase-1/google-ai-studio-prompt-sb-wb-v2.md) | Phase 1 Google AI Studio Student Book / Workbook extraction prompt (V2). Unit-by-unit JSON batches with D009 naming; mid-book new-chat caution (carry counters / slug forms; BE2-WB lesson). Formerly `google-ai-studio-prompt.md`. | V2 | ACTIVE |
| [phase-1/google-ai-studio-prompt-ss-v1.md](./phase-1/google-ai-studio-prompt-ss-v1.md) | Phase 1 Google AI Studio Scope & Sequence (SS) extraction prompt (V1). Source-faithful transcription of publisher S&S pages into structured JSON; not curriculum interpretation. | V1 | ACTIVE |
| [phase-1/extraction-data-specification.md](./phase-1/extraction-data-specification.md) | Authoritative Phase 1 data specification for extraction boundaries and verified-batch → merge → validation → audit workflow; Phase 1 is paused at 14/18 under D015. | — | ACTIVE |
| [phase-1/json-schema.md](./phase-1/json-schema.md) | Working Phase 1 schema 0.1 plus machine-schema/validator responsibilities, D009 identifier guidance for new books, and `continuous_text.text_id` clarification. | 0.1 | ACTIVE |
| [phase-1/dataset-registry.md](./phase-1/dataset-registry.md) | Operational registry of 18 books: fourteen individually Phase 1 COMPLETE; project-wide Phase 1 paused at 14/18; BE2/BE3 Phase 2 BI companions in Storage (not merged / not in `book_files`). | — | ACTIVE |
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
| [phase-2/phase-2-experiment-status.md](./phase-2/phase-2-experiment-status.md) | Phase 2 experiment status under D017: BE2 v2 baseline; BE3 A+B preferred for BE3-SB only; BE2 U8 horizontal-mapping artifacts + teacher-choice flow sketch recorded; D019 BI MVP UI validated (implementation only); methodologies provisional. | 1.46 | ACTIVE |
| [phase-2/book-intelligence-ui-data-contract-v1.md](./phase-2/book-intelligence-ui-data-contract-v1.md) | Draft Book Intelligence UI data contract: `eight_column_baseline` + `nine_column_ab`; Writing required only for nine-column; TS loader + CLI + dual-set tests; Storage-backed BE3 U1–9 split preview; not locked. | 0.1-draft | ACTIVE |
| [phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v1.md](./phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v1.md) | D017 Book Intelligence experiment: BE2-SB Units 1–9 Markdown overview + ChatGPT review findings (§G); preserved unchanged as v1 experiment artifact. | 1.0 | ACTIVE |
| [phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v2.md](./phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v2.md) | D017 v2 eight-column BE2-SB U1–9 overview; owner-approved provisional Book Intelligence working baseline (format/methodology/schema not locked). | 1.0 | ACTIVE |
| [phase-2/experiments/be2-sb-u01-u09-overview-v2-review.md](./phase-2/experiments/be2-sb-u01-u09-overview-v2-review.md) | v1 vs v2 summary, publisher Scope and Sequence comparison (~92% meaningful coverage AI-assessed), and Learning Outcomes consistency assessment. | 1.0 | ACTIVE |
| [phase-2/experiments/be1-sb-u01-u09-book-overview-d017-v1.md](./phase-2/experiments/be1-sb-u01-u09-book-overview-d017-v1.md) | D017-pattern eight-column BE1-SB Units 1–9 Book Intelligence overview from Phase 1 evidence; experimental / not accepted. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-sb-u01-u09-book-overview-d017-v1.md](./phase-2/experiments/be3-sb-u01-u09-book-overview-d017-v1.md) | D017-pattern eight-column BE3-SB Units 1–9 Book Intelligence overview from Phase 1 evidence; experimental / not accepted. | 1.0 | ACTIVE |
| [phase-2/experiments/be1-be2-be3-book-intelligence-probe-d017-v1.md](./phase-2/experiments/be1-be2-be3-book-intelligence-probe-d017-v1.md) | Combined horizontal consistency assessment and BE1→BE2→BE3 vertical sufficiency probe (5 examples); not a Phase 3 start. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-book-intelligence-diagnostic-d017-v1.md](./phase-2/experiments/be3-book-intelligence-diagnostic-d017-v1.md) | BE3 overview vs publisher S&S diagnostic: Writing presentation + LO inference gaps; Phase 1 writing evidence present; recommend Test BE5 unchanged. | 1.0 | ACTIVE |
| [phase-2/experiments/be5-sb-u01-u09-book-overview-d017-v1.md](./phase-2/experiments/be5-sb-u01-u09-book-overview-d017-v1.md) | D017-pattern eight-column BE5-SB Units 1–9 Book Intelligence baseline stress test from Phase 1 only (S&S not consulted); experimental / not accepted. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-sb-u01-u09-book-overview-d017-exp-a.md](./phase-2/experiments/be3-sb-u01-u09-book-overview-d017-exp-a.md) | BE3 Experiment A: eight-column overview with inference-only writing LO refinement from Phase 1; experimental / not accepted. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-sb-u01-u09-book-overview-d017-exp-b.md](./phase-2/experiments/be3-sb-u01-u09-book-overview-d017-exp-b.md) | BE3 Experiment B: control LOs preserved plus dedicated Writing column from Phase 1 writing components; experimental / not accepted. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-methodology-refinement-comparison-d017-v1.md](./phase-2/experiments/be3-methodology-refinement-comparison-d017-v1.md) | BE3 control vs Exp A vs Exp B comparison; partial publisher-reference validation via diagnostic S&S transcriptions; combined A+B suggested. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-sb-u01-u09-book-overview-d017-exp-ab.md](./phase-2/experiments/be3-sb-u01-u09-book-overview-d017-exp-ab.md) | BE3 combined A+B overview: owner-preferred BE3-SB Book Intelligence path (2026-10-15); not a methodology/schema lock. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-methodology-a-b-ab-comparison-d017-v1.md](./phase-2/experiments/be3-methodology-a-b-ab-comparison-d017-v1.md) | Three-way BE3 comparison of Experiments A, B, and A+B on evidence fidelity, visibility, duplication, and readability. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-ab-combined-owner-review-d017-v1.md](./phase-2/experiments/be3-ab-combined-owner-review-d017-v1.md) | Owner-review pack for BE3 A/B/A+B; records prefer A+B for BE3-SB only (no methodology/schema lock). | 1.0 | ACTIVE |
| [phase-2/experiments/be3-u01-ss-writing-ican-dry-check-d017-v1.md](./phase-2/experiments/be3-u01-ss-writing-ican-dry-check-d017-v1.md) | BE3 Unit 1 micro dry check: SS Writing + I Can vs Control/A/B/A+B; findings only; no overview changes. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-u02-ss-writing-ican-dry-check-d017-v1.md](./phase-2/experiments/be3-u02-ss-writing-ican-dry-check-d017-v1.md) | BE3 Unit 2 dry check: SS Writing + I Can vs Control/A/B/A+B; A+B dual Pass again; triggers expansion (not book-wide). | 1.0 | ACTIVE |
| [phase-2/experiments/be3-u03-u05-u09-ss-writing-ican-dry-check-d017-v1.md](./phase-2/experiments/be3-u03-u05-u09-ss-writing-ican-dry-check-d017-v1.md) | BE3 expansion sample Units 3/5/9 Writing + I Can dry check after U1+U2 A+B Pass; no book-wide decision. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-u04-u06-u07-u08-ss-writing-ican-dry-check-d017-v1.md](./phase-2/experiments/be3-u04-u06-u07-u08-ss-writing-ican-dry-check-d017-v1.md) | BE3 remaining Units 4/6/7/8 Writing + I Can dry check; A+B dual Pass on all four; findings only. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-ss-writing-ican-dry-check-full-roll-up-d017-v1.md](./phase-2/experiments/be3-ss-writing-ican-dry-check-full-roll-up-d017-v1.md) | Full 9/9 BE3 SS Writing + I Can dry-check roll-up; A+B only dual Pass; owner decision recorded (BE3-only; no methodology lock). | 1.0 | ACTIVE |
| [phase-2/experiments/be3-u01-ab-regen-reproducibility-d017-v1.md](./phase-2/experiments/be3-u01-ab-regen-reproducibility-d017-v1.md) | BE3 Unit 1 independent A+B regen vs existing A+B overview; reproducibility PASS (near-exact; soft wording only); no overview edits. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-u09-ab-regen-reproducibility-d017-v1.md](./phase-2/experiments/be3-u09-ab-regen-reproducibility-d017-v1.md) | BE3 Unit 9 independent A+B regen vs existing A+B overview (book-end check); reproducibility PASS (Writing exact; LO near-exact); no overview edits. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-u05-ab-regen-reproducibility-d017-v1.md](./phase-2/experiments/be3-u05-ab-regen-reproducibility-d017-v1.md) | BE3 Unit 5 independent A+B regen vs existing A+B overview (mid-book check); reproducibility PASS (Writing exact; LO near-exact); no overview edits. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-ab-regen-reproducibility-full-roll-up-d017-v1.md](./phase-2/experiments/be3-ab-regen-reproducibility-full-roll-up-d017-v1.md) | Full 9/9 BE3 A+B regen reproducibility roll-up (remaining U2–U4/U6–U8 + prior U1/U5/U9); discrepancies only; all PASS; no overview edits. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-u01-ab-implementation-compatibility-d017-v1.md](./phase-2/experiments/be3-u01-ab-implementation-compatibility-d017-v1.md) | Read-only BE3 Unit 1 A+B controlled-implementation compatibility vs Postgres catalog and UI contracts; identity OK; no BI consumer yet; no DB/UI changes. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-bi-validation-e2e-acceptance-d017-v1.md](./phase-2/experiments/be3-bi-validation-e2e-acceptance-d017-v1.md) | BE3 BI↔Validation E2E acceptance (D019): Library→BI→Unit→Validation→Back; nine-column provisional; implementation validated; methodology not locked. | 1.0 | ACTIVE |
| [phase-2/experiments/be3-bi-pdf-navigation-regression-acceptance-d017-v1.md](./phase-2/experiments/be3-bi-pdf-navigation-regression-acceptance-d017-v1.md) | BE3 BI PDF navigation regression acceptance: U1–U9 fwd/back, review gaps, selection, deep links; scripted PASS; methodology not locked. | 1.0 | ACTIVE |
| [phase-2/experiments/be2-bi-e2e-acceptance-d017-v1.md](./phase-2/experiments/be2-bi-e2e-acceptance-d017-v1.md) | BE2 BI E2E acceptance (D019): Library→BI→Validation→Back; eight-column provisional; PDF U1–U9 + gaps; scripted PASS; methodology not locked. | 1.0 | ACTIVE |
| [phase-2/experiments/be2-bi-integration-compatibility-plan-d017-v1.md](./phase-2/experiments/be2-bi-integration-compatibility-plan-d017-v1.md) | BE2 BI integration plan: eight- vs nine-column; P0–P5 done (E2E acceptance PASS); contract not locked. | 1.4 | ACTIVE |
| [phase-2/experiments/be2-u01-u07-prior-language-bank-u08-horizontal-map-v0.1.md](./phase-2/experiments/be2-u01-u07-prior-language-bank-u08-horizontal-map-v0.1.md) | BE2 U1–7 → U8 horizontal-mapping investigation: SS-first prior-language bank (22 patterns / 7 vocab categories); docs experiment only. | 0.1 | ACTIVE |
| [phase-2/experiments/be2-u08-horizontal-map-teacher-choice-card-v0.1.md](./phase-2/experiments/be2-u08-horizontal-map-teacher-choice-card-v0.1.md) | BE2 U8 teacher choice card: nine available prior patterns; dual-polarity feedback; not UI. | 0.1 | ACTIVE |
| [phase-2/experiments/be2-u08-cumulative-language-script-pack-v0.1.md](./phase-2/experiments/be2-u08-cumulative-language-script-pack-v0.1.md) | BE2 U8 cumulative-language script pack: Scripts A–D; documentation/teacher-judgment only (not classroom validation). | 0.1 | ACTIVE |
| [phase-2/experiments/be2-u08-polarity-safe-opener-cue-card-v0.1.md](./phase-2/experiments/be2-u08-polarity-safe-opener-cue-card-v0.1.md) | BE2 U8 polarity-safe opener cue card: dual like/don’t-like + matched agreement; owner review: clear, supports +/−, enough for a future bounded Chalkie comparison (not authorized). | 0.1 | ACTIVE |
| [phase-2/experiments/be2-u08-horizontal-map-lesson-input-pack-v0.1.md](./phase-2/experiments/be2-u08-horizontal-map-lesson-input-pack-v0.1.md) | BE2 U8 HM lesson-input pack: selection/review recorded; fed Arm B2 (generated + evaluated vs Arm A). | 0.1 | ACTIVE |
| [phase-2/experiments/teacher-choice-flow-sketch-v0.1.md](./phase-2/experiments/teacher-choice-flow-sketch-v0.1.md) | Prototype design sketch for teacher-choice prior-learning flow (AI 0–5 → teacher decide → lesson-input summary); BE2 U8 worked example; not UI/schema lock; Phase 3 remains parked (D020). | 0.1 | ACTIVE |
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

### Phase 3

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-3/p3-vertical-mapping-candidates.md](./phase-3/p3-vertical-mapping-candidates.md) | Early Phase 3 vertical-mapping candidate notes (historical). Phase 3 remains parked later priority (D020); not a product start. | — | PARKED |
| [phase-3/p3-exp-be2-u06-vertical-v1-protocol.md](./phase-3/p3-exp-be2-u06-vertical-v1-protocol.md) | Historical BE2 U6 vertical-mapping experiment protocol. Research only; Phase 3 not unlocked. | 1.0 | PARKED |
| [phase-3/p3-exp-be2-u06-vertical-v1-review.md](./phase-3/p3-exp-be2-u06-vertical-v1-review.md) | Historical BE2 U6 vertical-mapping experiment review. | 1.0 | PARKED |
| [phase-3/p3-exp-be2-u08-vertical-v1-protocol.md](./phase-3/p3-exp-be2-u08-vertical-v1-protocol.md) | Historical BE2 U8 vertical-mapping experiment protocol. Research only; Phase 3 not unlocked. | 1.0 | PARKED |
| [phase-3/p3-exp-be2-u08-vertical-v1-review.md](./phase-3/p3-exp-be2-u08-vertical-v1-review.md) | Historical BE2 U8 vertical-mapping experiment review. | 1.0 | PARKED |

### Phase 4

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-4/teacher-enrichment-philosophy.md](./phase-4/teacher-enrichment-philosophy.md) | Phase 4 philosophy for teacher enrichment: floor-first depth, curriculum fidelity, productive language practice, and how enrichment must stay distinct from source evidence. | V1 | ACTIVE |
| [phase-4/p4-exp-be2-u08-enrich-v1-protocol.md](./phase-4/p4-exp-be2-u08-enrich-v1-protocol.md) | Historical first Phase 4 enrichment experiment protocol for BE2 U8. Research record; not a product pipeline. | 1.0 | PARKED |
| [phase-4/p4-exp-be2-u08-enrich-v1-review.md](./phase-4/p4-exp-be2-u08-enrich-v1-review.md) | Historical BE2 U8 enrichment experiment review. | 1.0 | PARKED |
| [phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-protocol.md](./phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-protocol.md) | Bounded Phase 4 enrichment probe protocol: BE2 U6 A/B (Phase 1 vs V3.1+V1.2); isolation, classification, and decision-change rules; not a Phase 4 start. | 1.0 | ACTIVE |
| [phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-proposal-a-phase1.md](./phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-proposal-a-phase1.md) | Enrichment Proposal A for BE2 U6 focus: up to three conditional opportunities from Phase 1 only (isolation before V3.1/V1.2). | 1.0 | ACTIVE |
| [phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-proposal-b-informed.md](./phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-proposal-b-informed.md) | Enrichment Proposal B for BE2 U6 focus: Phase 1 + V3.1 + CON-01/CON-02; same format as A; CON-01 declined as enrichment driver. | 1.0 | ACTIVE |
| [phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-evaluation.md](./phase-4/p4-exp-be2-u06-enrich-v1/p4-exp-be2-u06-enrich-v1-evaluation.md) | Comparative evaluation of enrichment Proposals A vs B; criterion scores plus decision-change analysis (same three interventions). | 1.0 | ACTIVE |

### Phase 5

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-5/p5-prototype-chalkie-workspace.md](./phase-5/p5-prototype-chalkie-workspace.md) | Chalkie Workspace UI prototype notes for `/app/chalkie`: dynamic source-context binding, teaching-focus lanes, same-unit `[PRIOR]` suggestions, 3-step teacher-choice flow, local four-artifact handoff with deterministic lesson titles + stable refs. OpenAI lesson-draft path kept dormant off-UI. Not a product lock. | 2.7 | ACTIVE |
| [phase-5/chalkie-generic-detailed-handoff-gap-audit-v0.1.md](./phase-5/chalkie-generic-detailed-handoff-gap-audit-v0.1.md) | Audit of generic `/app/chalkie` prompt vs Experiment 10 detailed handoff; evidence-field map and smallest generic detailed-handoff slice. Audit only — not implementation or methodology lock. | 0.1 | ACTIVE |
| [phase-5/p5-exp-be2-u08-chalkie-brief-v1.md](./phase-5/p5-exp-be2-u08-chalkie-brief-v1.md) | Historical early Chalkie teaching-brief experiment for BE2 U8 (pre-D018 series). Research only. | 1.0 | PARKED |
| [phase-5/p5-exp-be2-u08-chalkie-brief-v1-review.md](./phase-5/p5-exp-be2-u08-chalkie-brief-v1-review.md) | Historical review of early BE2 U8 Chalkie teaching-brief experiment. | 1.0 | PARKED |
| [phase-5/p5-exp-be2-u08-p128-129-chalkie-brief-v1.md](./phase-5/p5-exp-be2-u08-p128-129-chalkie-brief-v1.md) | Historical page-scoped Chalkie brief for BE2 U8 pp. 128–129 (pre-D018). Research only. | 1.0 | PARKED |
| [phase-5/p5-exp-be2-u08-p128-129-chalkie-brief-v1-review.md](./phase-5/p5-exp-be2-u08-p128-129-chalkie-brief-v1-review.md) | Historical review of page-scoped BE2 U8 Chalkie brief. | 1.0 | PARKED |
| [phase-5/d018-v1-be2-u08-p128-129-experiment.md](./phase-5/d018-v1-be2-u08-p128-129-experiment.md) | D018 V1 Chalkie experiment (BE2 U8 pp. 128–129): closed as comparative baseline (4 Yes / 3 Partial; formal Pass not met); one-time owner override authorizes V2 (+ Workbook). | 1.2 | ACTIVE |
| [phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md](./phase-5/d018-v2-be2-u08-sb128-129-wb104-105-experiment.md) | D018 V2-family **CLOSED**: V1/V2 below Pass; V2b preferred Pass baseline/control; V2c Pass equivalent but not preferred; no V2d. | 2.2 | PARKED |
| [phase-5/d018-v3-be2-u08-book-intelligence-experiment.md](./phase-5/d018-v3-be2-u08-book-intelligence-experiment.md) | D018 V3 Book Intelligence experiment: V2b control + append-only `[BI]`; generated as `WILD ANIMALS (1)(1).pdf` (31 PDF pages); formal evaluation pending. | 1.2 | ACTIVE |
| [phase-5/d018-lesson-series-be2-u08-experiment-design.md](./phase-5/d018-lesson-series-be2-u08-experiment-design.md) | D018 Lesson Series Experiment 1: approved configuration and owner-approved two-lesson prompt with outline-review gate; not run; generation not authorized. | 0.4 | ACTIVE |
| [phase-5/d018-v2b-horizontal-map-polarity-cue-comparison-design-v0.1.md](./phase-5/d018-v2b-horizontal-map-polarity-cue-comparison-design-v0.1.md) | Lesson Series A/B comparison (V2b inputs ± `[HM]`): generated and evaluated; Arm A&B preferred for polarity/agreement; points to drafted Arm B2 follow-on. | 0.1 | ACTIVE |
| [phase-5/d018-arm-b2-horizontal-map-lesson-input-comparison-design-v0.1.md](./phase-5/d018-arm-b2-horizontal-map-lesson-input-comparison-design-v0.1.md) | Arm B2 vs Arm A: generated + evaluated; Arm B2 preferred (pack fidelity); neither Pass; regeneration not authorized. | 0.1 | ACTIVE |
| [phase-5/chalkie-outline-context-retention-diagnostic-v0.1.md](./phase-5/chalkie-outline-context-retention-diagnostic-v0.1.md) | Chalkie outline/context diagnostic: Experiments 1–9 + Exp 10 closed (teacher-in-the-loop PASS AFTER REVIEW); pattern provisional / not locked. | 0.1 | ACTIVE |
| [phase-5/chalkie-experiments-1-9-evidence-synthesis-v0.1.md](./phase-5/chalkie-experiments-1-9-evidence-synthesis-v0.1.md) | Consolidation of Chalkie Experiments 1–9; follow-up notes Exp 10 closed (raw fail → PASS AFTER TEACHER REVIEW); EVIDENCE SYNTHESIS / PROVISIONAL. | 0.1 | ACTIVE |
| [phase-5/chalkie-operational-pilot-be3-u08-grammar-p136-137-preflight-v0.1.md](./phase-5/chalkie-operational-pilot-be3-u08-grammar-p136-137-preflight-v0.1.md) | Source preflight for first operational Chalkie pilot: BE3 U8 *Healthy Living* Grammar SB pp.136–137; CONDITIONALLY SUITABLE; language-box placement note corrected to p.136. | 0.1 | ACTIVE |
| [phase-5/chalkie-operational-pilot-be3-u08-grammar-p136-137-handoff-design-v0.1.md](./phase-5/chalkie-operational-pilot-be3-u08-grammar-p136-137-handoff-design-v0.1.md) | BE3 U8 Grammar operational pilot closed: raw CONDITIONAL FAIL → PASS AFTER TEACHER REVIEW (Act 19 bike correction); regeneration not authorized. | 0.1 | ACTIVE |
| [phase-5/chalkie-transfer-be2-u05-lia-p78-79-experiment-design-v0.1.md](./phase-5/chalkie-transfer-be2-u05-lia-p78-79-experiment-design-v0.1.md) | BE2 U5 LiA pp. 78–79 Chalkie transfer test: generated + qualitatively reviewed; strong transfer success; further generation not authorized. | 0.1 | ACTIVE |
| [phase-5/chalkie-provisional-handoff-template-v0.1.md](./phase-5/chalkie-provisional-handoff-template-v0.1.md) | Provisional Chalkie handoff template; source-fidelity gate + teacher-in-the-loop / must-correct distinction from Exp 10; DRAFT / experimental. | 0.1 | ACTIVE |
| [phase-5/chalkie-provisional-handoff-template-be2-u05-lia-retrofill-v0.1.md](./phase-5/chalkie-provisional-handoff-template-be2-u05-lia-retrofill-v0.1.md) | Read-only retrospective dry run of the handoff template against Experiment 7; usability marks, gaps, bounded revision list; later note that same-list vocab guidance was superseded after Exp 8. | 0.1 | ACTIVE |
| [phase-5/chalkie-transfer-be3-u03-lia-p40-41-preflight-v0.1.md](./phase-5/chalkie-transfer-be3-u03-lia-p40-41-preflight-v0.1.md) | Source-only preflight for BE3 U3 LiA SB pp. 40–41 (*Working Hard!*); verified Phase 1/SS facts; not a handoff prompt; generation not authorized. | 0.1 | ACTIVE |
| [phase-5/chalkie-transfer-be3-u03-lia-p40-41-experiment-design-v0.1.md](./phase-5/chalkie-transfer-be3-u03-lia-p40-41-experiment-design-v0.1.md) | BE3 U3 *Working Hard!* LiA pp. 40–41 Experiment 8: PASS / strong transfer success; vocab-allocation confound recorded; further generation not authorized. | 0.1 | ACTIVE |
| [phase-5/chalkie-transfer-be3-u03-lia-p40-41-vocab-split-runcard-v0.1.md](./phase-5/chalkie-transfer-be3-u03-lia-p40-41-vocab-split-runcard-v0.1.md) | Experiment 9 vocab-split control: PASS; L1 chores / L2 frequency chips produced intended lesson separation; further generation not authorized. | 0.1 | ACTIVE |

### Phase 6

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-6/chalkie-interface-and-generation-workflow.md](./phase-6/chalkie-interface-and-generation-workflow.md) | Active Chalkie operational reference (V1.0): Single Lesson vs Lesson Series modes, slide-count/settings, outline review, themes, vocabulary/audio handling, export behavior, and quality control. Observed UI guide for D018 experiments — not a product or schema lock. | V1.0 | ACTIVE |
| [phase-6/chalkie-ai-handover-specifications.md](./phase-6/chalkie-ai-handover-specifications.md) | Parked Phase 6 Chalkie handover/productization spec; D018 remains preserved downstream evidence (does not unlock this handover as production standard). | V1 | PARKED |

---

## Lifecycle snapshot

| Lifecycle | Count | Notes |
|---|---:|---|
| ACTIVE | 118 | Current working docs, including index, operating trackers, horizontal-mapping emphasis, teacher-choice flow sketch, Chalkie Workspace prototype notes, generic detailed-handoff gap audit, Chalkie Experiments 1–10 + provisional handoff template, D017 BI artifacts, preserved D018 evidence, Phase 6 Chalkie ops guide, Phase 2/4 research inventory, naming conventions, storage architecture, audits, and project-tracking |
| PARKED | 15 | Prior 4 parked docs plus restored historical Phase 3 vertical experiments, Phase 4 U8 enrich probe, and early Phase 5 Chalkie brief artifacts (not current product priority; D020 keeps Phase 3 later) |
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
