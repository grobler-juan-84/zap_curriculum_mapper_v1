# BE2 Book Intelligence Integration — Compatibility Gaps & Implementation Plan (D017)

**Date:** 2026-10-15  
**Status:** ACTIVE PLAN — P0/P1/P2/P4 done; P3/P5 (Storage/registry + smoke) pending; methodology / schema **not locked**  
**Version:** 1.2  
**Decision context:** D017 Progressive Curriculum Intelligence; D017 working approvals (BE2 v2 eight-column baseline; BE3 A+B nine-column for BE3-SB only); D019 MVP UI path (BE3)  
**Purpose:** Compare BE2-SB v2 eight-column overview + Phase 1 data with the working BE3 Book Intelligence contract/UI; identify minimum changes to support both column sets; propose a reusable, book-independent UI approach; document gaps and a phased plan.

**Explicit non-actions (this prompt):** No app/code implementation, no Storage upload, no database / `book_files` / methodology / schema lock.

---

## 1. Sources inspected

| Source | Location | Role |
|---|---|---|
| BE2 v2 overview (Markdown) | [`be2-sb-u01-u09-book-overview-d017-v2.md`](./be2-sb-u01-u09-book-overview-d017-v2.md) | Owner-approved **provisional** eight-column Book Intelligence working baseline |
| BE2 v2 review pack | [`be2-sb-u01-u09-overview-v2-review.md`](./be2-sb-u01-u09-overview-v2-review.md) | Coverage / LO notes; not a schema |
| BE2 Phase 1 canonical | `data/phase1/big_english_2_sb/canonical/v1.json` | Evidence + unit page boundaries (`bep2_unit_0N`) |
| BE3 A+B BI JSON | `data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json` | Working nine-column Storage companion |
| BI UI contract (draft) | [`../book-intelligence-ui-data-contract-v1.md`](../book-intelligence-ui-data-contract-v1.md) | Dual `column_set`: `eight_column_baseline` + `nine_column_ab` |
| App types / loader / UI | `app/src/types/bookIntelligence.ts`, `lib/bookIntelligence/*`, `features/book-intelligence/*` | Dual-set loader/UI fields; BE3 Storage consumer only |
| Storage registry | `bookIntelligenceStorageRegistry.ts` | Only `big_english_3_sb` registered |

---

## 2. Structure comparison

### 2.1 Column sets

| | BE2 v2 (baseline) | BE3 A+B (current UI contract) |
|---|---|---|
| Working approval | Eight-column provisional baseline (BE2-SB) | Nine-column A+B preferred (**BE3-SB only**) |
| Content columns | Vocabulary; Grammar / Structures; Communicative Functions; Learning Outcomes *(AI-inferred)*; CLIL / Culture; Values; Phonics | Same seven **plus Writing** |
| Proposed `column_set` | `eight_column_baseline` *(in contract + TS/loader)* | `nine_column_ab` *(implemented; BE3 live)* |
| Machine JSON today | Local U1–9 eight-column JSON (not Storage) | Full U1–9 JSON in repo + Storage |
| Writing strand | Absent (by design for v2 baseline) | Required string + optional `writing_component_id` |

### 2.2 Shared identity (compatible)

Both books can use the same envelope identity model already used by BE3:

| Field | BE2 expectation | Notes |
|---|---|---|
| `catalog_book_id` | `big_english_2_sb` | D009 catalog identity |
| `registry_id` | `BE2-SB` | Ops shorthand only |
| `series_slug` | `big-english` | Same series prefix as BE3 |
| `unit_number` / `title` / printed pages | Present in Markdown + Phase 1 | Align JSON to Phase 1 |
| `unit_id` | Phase 1 `bep2_unit_0N` | **Grandfathered** pilot IDs (D007/D009) — do **not** invent `big_english_2_sb_unit_0N` for evidence join |
| LO provenance | AI-inferred (stated in v2 header) | Same badge pattern as BE3 |

### 2.3 Phase 1 readiness (BE2)

| Check | BE2-SB | Implication for BI UI |
|---|---|---|
| Canonical COMPLETE / human_verified units | Yes (U1–9) | Evidence links + Validation round-trip feasible |
| `pdf_page_start` / `pdf_page_end` | Present for U1–9 | PDF sync can reuse BE3 logic unchanged |
| Inter-unit gaps | After U3 (pdf 52–57), after U6 (pdf 106–111) | Same “no BI for these pages” behavior |
| Writing-focused components | No dedicated writing-strand comps found in a quick scan | Reinforces **not** inventing a Writing column for BE2 v2 |
| Entity ID style | `bep2_*` legacy | Preserve in BI `unit_id`; UI must not assume `big_english_*_unit_*` only |

### 2.4 What the current BE3 UI assumes (BE2 blockers)

| Assumption | Current code/contract | Breaks BE2? |
|---|---|---|
| ~~`column_set === 'nine_column_ab'` only~~ | Types + parser | **Resolved** — both sets accepted |
| ~~`writing` required non-empty~~ | Parser / CLI | **Resolved** — required only for `nine_column_ab` |
| ~~Field list always includes Writing~~ | `uiFieldsForColumnSet` | **Resolved** — column-set-driven |
| Storage registry entry required | Series Library + load path | **Yes** — BE2 not registered |
| BI JSON exists in Storage | BE3 path only | **Yes** — no BE2 artifact yet |
| Default route book | `big_english_3_sb` | Soft — OK if BE2 linked from Library |

PDF split layout, `?unit=`, Validation evidence link, and PDF↔unit sync are already **catalog-book-parameterized** and can stay shared.

---

## 3. Compatibility gaps (summary)

| ID | Gap | Severity | Notes |
|---|---|---|---|
| G1 | ~~No BE2 machine-readable BI JSON~~ | **Done (local)** | Ported from Markdown v2; Storage still pending (G5) |
| G2 | ~~`eight_column_baseline` not in TS/loader~~ | **Done** | Allow-list both sets |
| G3 | ~~`writing` required globally~~ | **Done** | Required only for `nine_column_ab` |
| G4 | ~~UI hardcodes nine fields incl. Writing~~ | **Done** | `uiFieldsForColumnSet` |
| G5 | Storage / local registry has BE3 only | **Blocker** | Additive registry row + upload (Storage-only; no DB) |
| G6 | Legacy `bep2_unit_*` vs full catalog entity prefix | Medium | Use Phase 1 IDs as-is; document grandfathering |
| G7 | BE2 v2 Markdown is the SoT for wording today | Medium | JSON must stay faithful to v2; no silent A+B rewrite |
| G8 | No `book_files` registration for BI companions | Accepted | Same as BE3 (D019 non-lock); registry map is enough for preview |
| G9 | Teacher-readability not validated | Soft | Unchanged; out of this integration slice |

---

## 4. Minimum changes to support eight- and nine-column

Ordered by dependency. Still **proposal only**.

### 4.1 Contract / types (docs + TS, draft — not a lock)

1. Formally define `column_set: "eight_column_baseline"` alongside `nine_column_ab` in the draft contract.  
2. Widen `BookIntelligenceColumnSet` union.  
3. Make unit `writing` / `writing_component_id` **optional**; required only when `column_set === nine_column_ab`.  
4. Keep shared envelope + identity fields identical.

**Rejected (for minimum path):** Forcing BE2 to invent empty `writing: ""` to pass the nine-column loader — contradicts the contract’s own eight-column note and muddies A+B semantics.

### 4.2 Loader / CLI

1. Validate required content keys **by `column_set`**.  
2. Reject unknown `column_set` values (explicit allow-list).  
3. Extend `scripts/validate_book_intelligence_json.mjs` the same way.

### 4.3 Content artifact (BE2)

1. Author `data/phase2/big_english_2_sb/interpretations/be2-sb-u01-u09-book-intelligence-v2-eight-column-v0.1-draft.json` (name TBD under D009).  
2. Populate U1–9 from Markdown v2 cells; set `learning_outcomes_provenance: "ai_inferred"`; set `unit_id` from Phase 1 (`bep2_unit_0N`); include printed (and optionally note pdf bounds come from Phase 1 at runtime).  
3. Upload to Storage under `big-english/big_english_2_sb/interpretations/…` (same pattern as BE3).  
4. **Do not** apply BE3 A+B Writing methodology to BE2.

### 4.4 Registry / navigation

1. Add `big_english_2_sb` to `BOOK_INTELLIGENCE_STORAGE_ARTIFACTS`.  
2. Series Library already gates on `hasBookIntelligenceOverview` — BE2 card gains the action automatically.  
3. Keep default deep link book as BE3 unless product asks otherwise.

### 4.5 UI (reusable; see §5)

1. Replace hardcoded `contentFields()` with a column-set field descriptor map.  
2. Hide Writing row when absent / when eight-column.  
3. Preserve AI-inferred LO badge, split PDF layout, evidence link, PDF sync (no BE2-specific forks).

**Out of minimum scope:** Postgres registration, methodology unification, regenerating BE2 overview, Chalkie prompts, Phase 3.

---

## 5. Proposed reusable, book-independent UI approach

### 5.1 Principle

One preview shell keyed by **`catalogBookId`**, driven by:

1. **Storage registry** → which overview JSON to load  
2. **Document `column_set`** → which fields to render  
3. **Phase 1 canonical (by book UUID)** → PDF + page bounds + Validation evidence  

No per-book React pages (`Be2Preview` / `Be3Preview`).

### 5.2 Column-set descriptor (conceptual)

```text
COLUMN_SET_FIELDS = {
  eight_column_baseline: [
    vocabulary, grammarStructures, communicativeFunctions,
    learningOutcomes(+badge), clilCulture, values, phonics
  ],
  nine_column_ab: [
    ...eight_column_baseline fields,
    writing  // optional highlight styling may remain BE3-oriented, not required for BE2
  ]
}
```

UI iterates descriptors; missing optional values are omitted (not shown as blank Writing).

### 5.3 Shared capabilities (already book-agnostic)

| Capability | Mechanism | BE2 reuse |
|---|---|---|
| Route | `/app/book-intelligence/:catalogBookId?unit=N` | Yes |
| Split layout | Fields left / `ValidationPdfPane` right | Yes |
| Unit tabs + URL | `?unit=` | Yes |
| PDF↔unit sync | Phase 1 `pdf_page_*` ranges | Yes (BE2 gaps analogous) |
| Evidence link | Workspace select book + `/app/validation?unit=N` | Yes if catalog book exists |
| Back from Validation | Registry `hasBookIntelligenceOverview` | Yes once BE2 registered |

### 5.4 Book-specific data only (configuration, not UI forks)

| Config | Example BE2 | Example BE3 |
|---|---|---|
| Storage path | `…/big_english_2_sb/interpretations/be2-…json` | `…/big_english_3_sb/interpretations/be3-…json` |
| `column_set` inside JSON | `eight_column_baseline` | `nine_column_ab` |
| Phase 1 unit IDs | `bep2_unit_0N` | `big_english_3_sb_unit_0N` |

### 5.5 Explicitly avoid

- Hardcoding “if BE3 show Writing”  
- Requiring Writing placeholders for eight-column  
- Renaming BE2 entity IDs to match BE3 templates  
- Merging BE2/BE3 methodologies into one overview format

---

## 6. Implementation plan (phased; owner-gated)

Do **not** start until an explicit owner micro-step asks for implementation.

| Phase | Work | Exit check | Risk |
|---|---|---|---|
| **P0 — Contract align** | Document `eight_column_baseline` in draft contract; list required keys per set | **Done** (draft/not locked) | Low |
| **P1 — Loader dual-set** | Parser/CLI accept both sets; Writing required only for nine-column | **Done** (BE3 PASS + dual-set tests) | Low |
| **P2 — BE2 JSON port** | Markdown v2 → U1–9 JSON; validate with CLI; unit IDs = `bep2_*` | **Done** (CLI PASS; Markdown compare 0 discrepancies) | Medium (manual fidelity) |
| **P3 — Storage + registry** | Upload BE2 JSON; register `big_english_2_sb` | Library shows BI; route loads Storage | Low (ops) |
| **P4 — UI column-set render** | Descriptor-driven fields; hide Writing for eight-column | **Done** (BE3 path unchanged; eight-column config ready) | Low |
| **P5 — Smoke** | BE2 U1/U5/U9 deep links; gap after U3; evidence round-trip; BE3 regression scripts still PASS | Scripted + short manual smoke | Low |

**Suggested first implementation micro-step after approval:** P0+P1 together (types/loader only, with a tiny eight-column fixture — no BE2 product wiring yet), **or** P2 content port in parallel if owner prefers artifact-first.

---

## 7. Decision boundaries (do not reopen casually)

| Locked / approved | Implication for this plan |
|---|---|
| D017 LOCKED | Progressive BI; no premature schema lock |
| BE2 v2 eight-column working baseline | Do not replace with A+B Writing for BE2 |
| BE3 A+B preference is **BE3-only** | Dual column sets are intentional |
| D019 | BE3 MVP path validated; extending to BE2 is additive, not a reopen |
| D007 / D009 | Preserve `bep2_*` entity IDs; use `catalogBookId` / `bookUuid` carefully |

---

## 8. Open questions for the owner (before implement)

1. Confirm JSON filename / Storage path naming for the BE2 eight-column companion.  
2. Confirm `unit_id` = Phase 1 `bep2_unit_0N` (recommended) vs any alias strategy.  
3. Prefer implement order: loader-first (P0–P1) vs content-first (P2)?  
4. Should BE2 become an alternate default anywhere, or Library-entry only?

---

## Change log

| Date | Change |
|---|---|
| 2026-10-15 | Created compatibility gaps + reusable UI plan for BE2 eight-column vs BE3 nine-column; docs only. |
| 2026-10-15 | P0/P1/P4 implemented: dual column-set contract/loader/UI + tests; G2–G4 closed. P2/P3/P5 still pending. |
| 2026-10-15 | P2 done: BE2 v2 Markdown → local eight-column JSON (`bep2_unit_*`); G1 closed locally. P3/P5 still pending. |
