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

AI-facing operating trackers: [`4-DECISIONS.md`](./4-DECISIONS.md), [`5-PROGRESS.md`](./5-PROGRESS.md), [`6-TODO.md`](./6-TODO.md), [`7-FUTURE.md`](./7-FUTURE.md).

---

## Documents

### Root — overview & operating trackers

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [0-index.md](./0-index.md) | Master documentation index for the General Curriculum Mapper. Lists every project doc with a short summary, version, and lifecycle status. | 1.0 | ACTIVE |
| [1-Project Overview.md](./1-Project%20Overview.md) | High-level project purpose, principles, seven-phase architecture, initial 18-book dataset, Phase 1 priorities, and success definition. Pipeline reflects Storage + Validation UI. | — | ACTIVE |
| [2-tech-stack.md](./2-tech-stack.md) | Locked technology stack and what is implemented in the pilot (Auth, catalog, Storage, Validation) vs still mock/not started (Gemini, Book Workspace spreads, automation). | — | ACTIVE |
| [3-architecture.md](./3-architecture.md) | System architecture: phase boundaries, data flow from source evidence through interpretation, enrichment, packaging, and generation. | — | ACTIVE |
| [4-DECISIONS.md](./4-DECISIONS.md) | Canonical decision log: locked choices with date, reason, and rejected alternatives (through D008 automated structural validation as a separate gate). | 1.0 | ACTIVE |
| [5-PROGRESS.md](./5-PROGRESS.md) | Current project state (Done / In progress / Next / Blocked). Primary file for understanding where the project is today. | 1.0 | ACTIVE |
| [6-TODO.md](./6-TODO.md) | Concrete near-term actionable tasks; not a long-term idea dump. | 1.0 | ACTIVE |
| [7-FUTURE.md](./7-FUTURE.md) | Parking lot for good ideas that are explicitly not now (SaaS polish, Sheets explorer, Phase 2+, workspace wiring). | 1.0 | ACTIVE |
| [8-database-architecture.md](./8-database-architecture.md) | Hybrid storage: PostgreSQL catalog vs private Storage vs JSON curriculum; clarifies `books.status` vs `book_files.status` vs Dataset Registry. | 1.0 | ACTIVE |

### Project tracking

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [project-tracking/0-project-steps.md](./project-tracking/0-project-steps.md) | Chronological log of agent prompts that changed project files. Each non-Ask, file-changing prompt is recorded as one numbered step with a short summary. | 1.0 | ACTIVE |
| [project-tracking/1-project-status.md](./project-tracking/1-project-status.md) | Short current snapshot (done / status / next); detailed narrative in [`5-PROGRESS.md`](./5-PROGRESS.md). | 1.0 | ACTIVE |
| [project-tracking/2-internal-brainstorming.md](./project-tracking/2-internal-brainstorming.md) | Evolving internal brainstorming space for open questions, options, and possible solutions. Ideas here are not binding until promoted into the decision log. | 1.0 | ACTIVE |
| [project-tracking/3-project-decisions.md](./project-tracking/3-project-decisions.md) | Legacy pointer to [`4-DECISIONS.md`](./4-DECISIONS.md); kept for older links. | 1.0 | ACTIVE |
| [project-tracking/4-mock-data-registry.md](./project-tracking/4-mock-data-registry.md) | Distinguishes live Supabase catalog/Storage/Validation data from remaining UI mocks (Beehive page spreads, teacher AI). | — | ACTIVE |

### Phase 1

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-1/Curriculum_Mapping_process.md](./phase-1/Curriculum_Mapping_process.md) | Source-of-truth process guide for curriculum mapping: phase responsibilities, traceability, current pilot completion, D008 validation gate, and evidence-driven evolution. | — | ACTIVE |
| [phase-1/Google_AI_Studio_Prompt.md](./phase-1/Google_AI_Studio_Prompt.md) | Phase 1 Google AI Studio extraction prompt (V2). Supports uploading a complete textbook PDF, then extracting **unit by unit** into separate schema-faithful JSON batch files (with `FILE:` labels for saving), without lesson planning or enrichment. | V2 | ACTIVE |
| [phase-1/Extraction_Data_Specification.md](./phase-1/Extraction_Data_Specification.md) | Phase 1 data specification: extraction boundaries, uncertainty, and the current verified-batch preflight → merge → automated canonical validation → source-audit workflow. | — | ACTIVE |
| [phase-1/JSON_Schema.md](./phase-1/JSON_Schema.md) | Working Phase 1 schema 0.1 plus machine-schema/validator responsibilities, severity rules, and `continuous_text.text_id` clarification. | 0.1 | ACTIVE |
| [phase-1/Dataset_registry.md](./phase-1/Dataset_registry.md) | Operational registry of the 18 development books; four pilots remain Phase 1 COMPLETE, all with automated validation PASSED WITH WARNINGS after BE2 appendix sticker-page patch. | — | ACTIVE |
| [phase-1/Cross_Series_Schema_Review_Notes.md](./phase-1/Cross_Series_Schema_Review_Notes.md) | Cross-series schema 0.1 review; owner-accepted recommendations, 0.2 deferral, and the later D008 automated-validation status update. | 1.1 | ACTIVE |
| [phase-1/Book_ID_Alias_Map.md](./phase-1/Book_ID_Alias_Map.md) | Catalog `book_id` is canonical; documents extraction aliases (incl. `beehive_american_sb1`) and merge-time normalization (D007). | 1.0 | ACTIVE |
| [phase-1/book_id_aliases.json](./phase-1/book_id_aliases.json) | Machine-readable catalog↔alias map used by merge/normalize scripts. | 1 | ACTIVE |
| [phase-1/audits/BE1-SB_canonical_v1_audit.md](./phase-1/audits/BE1-SB_canonical_v1_audit.md) | BE1-SB canonical whole-book/source audit PASSED; retrospective automated validation passed with warnings. | 1.2 | ACTIVE |
| [phase-1/audits/BH1_canonical_v1_audit.md](./phase-1/audits/BH1_canonical_v1_audit.md) | BH1 canonical whole-book/source audit PASSED; retrospective automated validation passed with warnings. | 1.2 | ACTIVE |
| [phase-1/audits/BE2-SB_canonical_v1_audit.md](./phase-1/audits/BE2-SB_canonical_v1_audit.md) | BE2-SB whole-book/source audit PASSED; appendix sticker pages added so automated validation now PASSED WITH WARNINGS. | 1.3 | ACTIVE |
| [phase-1/audits/RH2A_canonical_v1_audit.md](./phase-1/audits/RH2A_canonical_v1_audit.md) | RH2A canonical whole-book/source audit PASSED; retrospective automated validation passed with warnings. | 1.2 | ACTIVE |

### Phase 4

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-4/Teacher_Enrichment_Philosophy.md](./phase-4/Teacher_Enrichment_Philosophy.md) | Phase 4 philosophy for teacher enrichment: floor-first depth, curriculum fidelity, productive language practice, and how enrichment must stay distinct from source evidence. | V1 | ACTIVE |

### Phase 6

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-6/ChalkieAI_Handover_specifications.md](./phase-6/ChalkieAI_Handover_specifications.md) | Parked Phase 6 handover spec from Chalkie.ai experiments — Floor vs Extension packaging, lesson-generation findings, and teacher-skeleton handover patterns. | V1 | PARKED |

---

## Lifecycle snapshot

| Lifecycle | Count | Notes |
|---|---:|---|
| ACTIVE | 26 | Current working docs, including index, operating trackers, and project-tracking |
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
