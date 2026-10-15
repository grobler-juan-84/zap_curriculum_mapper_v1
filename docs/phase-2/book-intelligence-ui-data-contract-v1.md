# Book Intelligence UI Data Contract — Nine-Column (v1 draft)

**Date:** 2026-10-15  
**Status:** DRAFT / EXPERIMENTAL — **not locked**; documentation only  
**Version:** 0.1-draft  
**Decision context:** D017 Progressive Curriculum Intelligence; D006 hybrid storage; D009 naming  
**Related:** [`experiments/be3-u01-ab-implementation-compatibility-d017-v1.md`](./experiments/be3-u01-ab-implementation-compatibility-d017-v1.md), [`experiments/be3-sb-u01-u09-book-overview-d017-exp-ab.md`](./experiments/be3-sb-u01-u09-book-overview-d017-exp-ab.md)  
**Purpose:** Define the UI-facing data contract for a **nine-column** Book Intelligence unit overview (A+B-style), including field names, types, unit identity, and JSON structure.

**Explicit non-actions (still):** No database migration, no `book_files` / `dataset_versions` registration, no methodology lock. Read-only TS loader/validator + local BE3 U1–9 UI preview exist; Storage object present as a separate companion (UI still local). Contract remains draft.

---

## 1. Scope

| In scope | Out of scope |
|---|---|
| One book → many units → nine overview cells per unit | Phase 1 entity normalization into Postgres |
| Identity keys for catalog / unit join | Replacing BE2 v2 eight-column baseline |
| JSON envelope + TypeScript name mapping | Teacher enrichment / lesson-generation payloads |
| Inference labeling for Learning Outcomes | Page-spread mock (`BookContent`) reuse |

Layer: **Phase 2 interpretation** — not Phase 1 book-truth (D001).

---

## 2. Column set

`column_set`: `"nine_column_ab"`

| # | Display label | JSON key (`snake_case`) | TS property (`camelCase`) | Role |
|---|---|---|---|---|
| 1 | Vocabulary | `vocabulary` | `vocabulary` | What words/phrases the unit targets |
| 2 | Grammar / Structures | `grammar_structures` | `grammarStructures` | Target forms / patterns |
| 3 | Communicative Functions | `communicative_functions` | `communicativeFunctions` | What learners do with the language |
| 4 | Learning Outcomes | `learning_outcomes` | `learningOutcomes` | Demonstrable capabilities (may include writing) |
| 5 | CLIL / Culture | `clil_culture` | `clilCulture` | Content/culture connections |
| 6 | Values | `values` | `values` | Explicit values strand |
| 7 | Phonics | `phonics` | `phonics` | Phonics focus |
| 8 | Writing | `writing` | `writing` | Writing skill / form / task (strand label) |
| — | *(unit identity — not a content column)* | see §3 | see §3 | Join / display header |

**A+B role split (BE3 preferred path):**

- `learning_outcomes` = student capabilities (writing-aware when evidence supports it)
- `writing` = explicit writing skill/form/task
- Related meaning across the two is allowed; identical wording should be avoided

**Eight-column note:** BE2 v2 omits `writing`. That is a different `column_set` (`eight_column_baseline`) and is **not** defined here. Do not force `writing: null` into BE2 baseline consumers without an explicit later decision.

---

## 3. Identity fields

### 3.1 Book-level identity

| JSON key | TS name | Type | Required | Notes |
|---|---|---|---|---|
| `catalog_book_id` | `catalogBookId` | `string` | **yes** | Catalog `books.book_id` (e.g. `big_english_3_sb`) |
| `registry_id` | `registryId` | `string` | no | Ops shorthand only (e.g. `BE3-SB`) |
| `book_uuid` | `bookUuid` | `string` (UUID) \| `null` | no | Postgres `books.id` when known; omit/`null` in offline docs |
| `series_slug` | `seriesSlug` | `string` | no | Storage prefix (e.g. `big-english`) |

Never use bare `book_id` / `bookId` in the UI contract when meaning could collide with UUID FKs.

### 3.2 Unit-level identity

| JSON key | TS name | Type | Required | Notes |
|---|---|---|---|---|
| `unit_id` | `unitId` | `string` | **yes** | Phase 1 entity ID (e.g. `big_english_3_sb_unit_01`) |
| `unit_number` | `unitNumber` | `string` | **yes** | Prefer string to match Phase 1 (`"1"` not `1`) |
| `title` | `title` | `string` | **yes** | Unit title (e.g. `Wake Up!`) |
| `printed_page_start` | `printedPageStart` | `number` \| `null` | no | Printed page start |
| `printed_page_end` | `printedPageEnd` | `number` \| `null` | no | Printed page end |

`unit_id` is the stable join key to Phase 1 evidence. Display headers may combine `unit_number` + `title` + page range.

---

## 4. Content field types

All nine content cells are **teacher-facing summary strings** for the first UI contract (same grain as the experimental Markdown overviews).

| JSON key | Type | Required (nine-column) | Empty allowed? | Inference |
|---|---|---|---|---|
| `vocabulary` | `string` | yes | empty string discouraged | Usually evidence-grounded paraphrase |
| `grammar_structures` | `string` | yes | discouraged | Evidence-grounded |
| `communicative_functions` | `string` | yes | discouraged | Often interpreted from Phase 1 `language.function` |
| `learning_outcomes` | `string` | yes | discouraged | **AI-inferred** unless marked otherwise |
| `clil_culture` | `string` | yes | discouraged | Evidence-grounded |
| `values` | `string` | yes | discouraged | Evidence-grounded |
| `phonics` | `string` | yes | discouraged | Evidence-grounded |
| `writing` | `string` | **yes** for `nine_column_ab` | discouraged | Evidence-grounded form/task label |

### 4.1 Inference metadata (unit-level)

| JSON key | TS name | Type | Required | Allowed values |
|---|---|---|---|---|
| `learning_outcomes_provenance` | `learningOutcomesProvenance` | `string` | no (default `ai_inferred`) | `ai_inferred` \| `evidence_quoted` \| `mixed` |

UI must be able to label Learning Outcomes as inferred when `ai_inferred` / `mixed`.

### 4.2 Optional evidence pointers (unit-level)

Not required for first render; useful for controlled implementation traceability.

| JSON key | TS name | Type | Notes |
|---|---|---|---|
| `writing_component_id` | `writingComponentId` | `string` \| `null` | Phase 1 `curriculum_components.component_id` when Writing is backed |
| `source_phase1_schema_version` | `sourcePhase1SchemaVersion` | `string` \| `null` | e.g. `"0.1"` |

---

## 5. Document envelope (JSON structure)

```json
{
  "schema_name": "book_intelligence_unit_overview",
  "schema_version": "0.1-draft",
  "layer": "phase2_interpretation",
  "column_set": "nine_column_ab",
  "catalog_book_id": "big_english_3_sb",
  "registry_id": "BE3-SB",
  "book_uuid": null,
  "series_slug": "big-english",
  "title": "Big English 3 Student Book — Book Intelligence (A+B)",
  "notes": "Experimental interpretation; not Phase 1 evidence; format not locked.",
  "units": [
    {
      "unit_id": "big_english_3_sb_unit_01",
      "unit_number": "1",
      "title": "Wake Up!",
      "printed_page_start": 4,
      "printed_page_end": 19,
      "vocabulary": "Daily routines; clock times beyond o’clock (seven thirty, seven forty-five…); parts of day; hygiene content words",
      "grammar_structures": "When does…? at… / in the morning…; before/after; frequency adverbs (always–never); subject + verb sentences",
      "communicative_functions": "Talk about routine times; sequence with before/after; state habit frequency",
      "learning_outcomes": "Talk about daily routines and times; use frequency adverbs for habits; identify subjects and verbs when writing about routines; talk about keeping clean / chores timing",
      "learning_outcomes_provenance": "ai_inferred",
      "clil_culture": "Science: Keep It Clean (germs); Culture: time zones / e-pals",
      "values": "Do your chores",
      "phonics": "a_e, i_e, o_e",
      "writing": "Sentence craft — subjects & verbs (routine sentences)",
      "writing_component_id": "bep3_comp_0003",
      "source_phase1_schema_version": "0.1"
    }
  ]
}
```

### 5.1 Envelope fields

| JSON key | TS name | Type | Required | Notes |
|---|---|---|---|---|
| `schema_name` | `schemaName` | `string` | yes | Constant: `book_intelligence_unit_overview` |
| `schema_version` | `schemaVersion` | `string` | yes | Draft: `0.1-draft` |
| `layer` | `layer` | `string` | yes | Constant: `phase2_interpretation` |
| `column_set` | `columnSet` | `string` | yes | `nine_column_ab` for this contract |
| `title` | `title` | `string` | no | Human document title |
| `notes` | `notes` | `string` | no | Caveats for UI/ops |
| `units` | `units` | `array` | yes | Ordered list of unit objects (§3 + §4) |

### 5.2 Minimal single-unit payload (controlled BE3 U1 slice)

A controlled implementation may ship **one** unit inside `units` without requiring the full book:

```json
{
  "schema_name": "book_intelligence_unit_overview",
  "schema_version": "0.1-draft",
  "layer": "phase2_interpretation",
  "column_set": "nine_column_ab",
  "catalog_book_id": "big_english_3_sb",
  "units": [
    {
      "unit_id": "big_english_3_sb_unit_01",
      "unit_number": "1",
      "title": "Wake Up!",
      "printed_page_start": 4,
      "printed_page_end": 19,
      "vocabulary": "…",
      "grammar_structures": "…",
      "communicative_functions": "…",
      "learning_outcomes": "…",
      "learning_outcomes_provenance": "ai_inferred",
      "clil_culture": "…",
      "values": "…",
      "phonics": "…",
      "writing": "…"
    }
  ]
}
```

---

## 6. TypeScript shape

Implemented as read-only loader/validator plus a local BE3 Unit 1 preview route. Names follow D009.

| Module | Path |
|---|---|
| Types | [`../../app/src/types/bookIntelligence.ts`](../../app/src/types/bookIntelligence.ts) |
| Field map | [`../../app/src/lib/bookIntelligence/fieldMap.ts`](../../app/src/lib/bookIntelligence/fieldMap.ts) |
| Parse / validate / map | [`../../app/src/lib/bookIntelligence/parseBookIntelligenceOverview.ts`](../../app/src/lib/bookIntelligence/parseBookIntelligenceOverview.ts) |
| Load from JSON text | [`../../app/src/lib/bookIntelligence/loadBookIntelligenceOverview.ts`](../../app/src/lib/bookIntelligence/loadBookIntelligenceOverview.ts) |
| CLI file check | [`../../scripts/validate_book_intelligence_json.mjs`](../../scripts/validate_book_intelligence_json.mjs) |
| Local BE3 U1–9 preview | `/app/book-intelligence` · [`../../app/src/features/book-intelligence/`](../../app/src/features/book-intelligence/) |

```bash
node scripts/validate_book_intelligence_json.mjs
```

```ts
type BookIntelligenceColumnSet = 'nine_column_ab'

type LearningOutcomesProvenance = 'ai_inferred' | 'evidence_quoted' | 'mixed'

interface BookIntelligenceUnitOverview {
  unitId: string
  unitNumber: string
  title: string
  printedPageStart?: number | null
  printedPageEnd?: number | null
  vocabulary: string
  grammarStructures: string
  communicativeFunctions: string
  learningOutcomes: string
  learningOutcomesProvenance?: LearningOutcomesProvenance
  clilCulture: string
  values: string
  phonics: string
  writing: string
  writingComponentId?: string | null
  sourcePhase1SchemaVersion?: string | null
}

interface BookIntelligenceOverviewDocument {
  schemaName: 'book_intelligence_unit_overview'
  schemaVersion: string
  layer: 'phase2_interpretation'
  columnSet: BookIntelligenceColumnSet
  catalogBookId: string
  registryId?: string
  bookUuid?: string | null
  seriesSlug?: string
  title?: string
  notes?: string
  units: BookIntelligenceUnitOverview[]
}
```

---

## 7. Compatibility rules (contract constraints)

| Rule | Requirement |
|---|---|
| Separation from Phase 1 | Must not be merged into `canonical/v1.json` |
| Postgres | Must not be modeled as relational overview columns (D006) |
| Existing UI mocks | Must not reuse `BookContent` / `PageSpread` as this contract |
| Validation `BatchJsonSummary` | Evidence-only; not a substitute for this overview |
| BE2 v2 baseline | Remains eight-column; out of scope for this `column_set` |
| Required Writing cell | For `nine_column_ab`, `writing` is required |

---

## 8. Non-lock statement

This document defines a **draft UI data contract** so a later controlled implementation has a single named shape to target.

It does **not**:

- lock D017 methodology
- approve a machine JSON Schema file
- authorize Storage paths or `book_files` file types
- replace experimental Markdown overviews as the current source of truth

---

## 9. Populated example artifact

| Artifact | Path |
|---|---|
| BE3-SB Units 1–9 A+B (local) | [`../../data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json`](../../data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json) |
| BE3-SB Units 1–9 A+B (Storage) | `book-datasets` → `big-english/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json` |

Content mirrors the preferred A+B Markdown Units 1–9 rows. Validated by TS loader + CLI; local read-only preview; Storage companion uploaded and integrity-verified (no Postgres registration; UI not wired to Storage).

---

## Change log

| Date | Change |
|---|---|
| 2026-10-15 | Created nine-column Book Intelligence UI data contract draft (fields, types, identity, JSON). Documentation only. |
| 2026-10-15 | Linked populated BE3 Unit 1 A+B JSON example artifact under `data/phase2/…`. |
| 2026-10-15 | Added read-only TS parse/validate/map loader + CLI verifier; BE3 U1 PASS; no UI/DB. |
| 2026-10-15 | Added read-only BE3 Unit 1 BI UI preview (`/app/book-intelligence`); local JSON only; no DB/Storage. |
| 2026-10-15 | Extended BI JSON + preview to BE3 Units 1–9; superseded Unit 1-only slice. |
| 2026-10-15 | Uploaded U1–9 BI JSON to `book-datasets` interpretations path; SHA-256 verified; no DB/UI wiring. |
