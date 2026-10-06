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

---

## Documents

### Root & project tracking

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [0-index.md](./0-index.md) | Master documentation index for the General Curriculum Mapper. Lists every project doc with a short summary, version, and lifecycle status. | 1.0 | ACTIVE |
| [1-Project Overview.md](./1-Project%20Overview.md) | High-level project purpose, principles, seven-phase architecture, initial 18-book dataset, Phase 1 priorities, and success definition. | — | ACTIVE |
| [project-tracking/0-project-steps.md](./project-tracking/0-project-steps.md) | Chronological log of agent prompts that changed project files. Each non-Ask, file-changing prompt is recorded as one numbered step with a short summary. | 1.0 | ACTIVE |
| [project-tracking/1-project-status.md](./project-tracking/1-project-status.md) | Evolving project snapshot rewritten after each file-changing prompt: what has been done, current status, and a suggested next small step with a bird’s-eye view of remaining work. | 1.0 | ACTIVE |
| [project-tracking/2-internal-brainstorming.md](./project-tracking/2-internal-brainstorming.md) | Evolving internal brainstorming space for open questions, options, and possible solutions. Ideas here are not binding until promoted into the project decisions log. | 1.0 | ACTIVE |
| [project-tracking/3-project-decisions.md](./project-tracking/3-project-decisions.md) | Locked-in project decision log stemming from brainstorming or explicit choices. Records durable decisions, rationale, and supersession history. | 1.0 | ACTIVE |

### Phase 1

| Doc | Summary | Version | Lifecycle |
|---|---|---|---|
| [phase-1/Curriculum_Mapping_process.md](./phase-1/Curriculum_Mapping_process.md) | Source-of-truth process guide for curriculum mapping: phase responsibilities, traceability, extraction workflow, verification, and how the system should evolve from evidence. | — | ACTIVE |
| [phase-1/Google_AI_Studio_Prompt.md](./phase-1/Google_AI_Studio_Prompt.md) | Phase 1 Google AI Studio extraction prompt (V2). Supports uploading a complete textbook PDF, then extracting **unit by unit** into separate schema-faithful JSON batch files (with `FILE:` labels for saving), without lesson planning or enrichment. | V2 | ACTIVE |
| [phase-1/Extraction_Data_Specification.md](./phase-1/Extraction_Data_Specification.md) | Phase 1 data specification: what to extract from curriculum sources, what not to invent, book-truth rules, uncertainty handling, validation, and canonical dataset expectations. | — | ACTIVE |
| [phase-1/JSON_Schema.md](./phase-1/JSON_Schema.md) | Working Phase 1 JSON schema for canonical book datasets — entities, identifiers, vocabulary/language/activities structures, relationships, schema gaps, and versioning. | 0.1 | ACTIVE |
| [phase-1/Dataset_registry.md](./phase-1/Dataset_registry.md) | Operational registry of the 18 development books: source availability, extraction/validation/verification status, schema version tracking, issues, and schema gaps. | — | ACTIVE |

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
| ACTIVE | 12 | Current working docs, including this index and project-tracking |
| PARKED | 1 | Retained for future Phase 6 work |
| LOCKED | 0 | None currently frozen |

---

## Maintenance

This index is maintained automatically under the project Cursor rule `.cursor/rules/documentation_update.mdc`.

Whenever any file under `docs/` (except routine edits to this index alone) is **added, removed, renamed, or substantively updated**, refresh this file so that:

1. every documentation `.md` file appears exactly once;
2. links resolve correctly;
3. summaries stay accurate;
4. Version and Lifecycle match each document’s header/status fields.
