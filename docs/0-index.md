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

Docs are organized under `docs/phase-1` … `docs/phase-6` where applicable. Empty phase folders (`phase-2`, `phase-3`, `phase-5`) are intentional placeholders and have no markdown docs yet.

AI-facing operating trackers: [`4-decisions.md`](./4-decisions.md), [`5-progress.md`](./5-progress.md), [`6-todo.md`](./6-todo.md), [`7-future.md`](./7-future.md).

---

## Documents

### Root — overview & operating trackers

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [0-index.md](./0-index.md) | Master documentation index for the General Curriculum Mapper. Lists every project doc with a short summary, version, and lifecycle status. | 1.0 | ACTIVE |
| [1-project-overview.md](./1-project-overview.md) | High-level project purpose, principles and seven-phase architecture; D015 pauses Phase 1 at 14/18 and makes bounded Big-English-only Phase 2 experiments the active priority. | — | ACTIVE |
| [2-tech-stack.md](./2-tech-stack.md) | Locked technology stack: Supabase Auth/Postgres; R2-only textbook PDFs (D010/D012); Supabase Storage for JSON/covers; pilot implementation status. | — | ACTIVE |
| [3-architecture.md](./3-architecture.md) | System architecture: phase boundaries, data flow from source evidence through interpretation, enrichment, packaging, generation, plus cross-cutting storage. | — | ACTIVE |
| [4-decisions.md](./4-decisions.md) | Canonical decision log: locked choices with date, reason, and rejected alternatives (through D015 Phase 1 pause / bounded Phase 2 priority). | 1.0 | ACTIVE |
| [5-progress.md](./5-progress.md) | Current project state (Done / In progress / Next / Blocked). Primary file for understanding where the project is today. | 1.0 | ACTIVE |
| [6-todo.md](./6-todo.md) | Concrete near-term actionable tasks; not a long-term idea dump. | 1.0 | ACTIVE |
| [7-future.md](./7-future.md) | Parking lot for deferred work and ideas not now; F004 Phase 2 promoted by D015, Phase 3 remains parked, and four unfinished Phase 1 books are deferred as F016. | 1.0 | ACTIVE |
| [8-database-architecture.md](./8-database-architecture.md) | Hybrid storage: PostgreSQL catalog vs object storage (R2-only PDFs / Supabase JSON+covers) vs JSON curriculum; status field distinctions. | 1.1 | ACTIVE |
| [9-naming-conventions.md](./9-naming-conventions.md) | Project-wide naming authority: style matrix, identity vocabulary, catalog/entity templates, Postgres UUID vs catalog collision, local PDF + unit-batch paths (`app/src/assets/books/…`, `data/phase1/…`), asset/audit filename rules, legacy grandfathering, and backward-audit policy (D009). App TS uses `catalogBookId` / `bookUuid`. | 1.5 | ACTIVE |
| [10-storage-architecture.md](./10-storage-architecture.md) | Object-storage plan: R2-only textbook PDFs (D012; Stages A–E PASS), Supabase for JSON/covers; unused Supabase PDF copies retained. | 1.2 | ACTIVE |

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
| [phase-1/curriculum-mapping-process.md](./phase-1/curriculum-mapping-process.md) | Source-of-truth process guide: phase responsibilities, traceability and evidence-driven evolution; current position is Phase 1 paused at 14/18 and bounded Phase 2 experiments active. | — | ACTIVE |
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

### Phase 4

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-4/teacher-enrichment-philosophy.md](./phase-4/teacher-enrichment-philosophy.md) | Phase 4 philosophy for teacher enrichment: floor-first depth, curriculum fidelity, productive language practice, and how enrichment must stay distinct from source evidence. | V1 | ACTIVE |

### Phase 6

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-6/chalkie-ai-handover-specifications.md](./phase-6/chalkie-ai-handover-specifications.md) | Parked Phase 6 handover spec from Chalkie.ai experiments; retained while D015 Phase 2 interpretation experiments are the active priority. | V1 | PARKED |

---

## Lifecycle snapshot

| Lifecycle | Count | Notes |
|---|---:|---|
| ACTIVE | 36 | Current working docs, including index, operating trackers, naming conventions, storage architecture, audits, and project-tracking |
| PARKED | 1 | Retained for future Phase 6 work |
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
