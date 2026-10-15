# BE3 Unit 1 A+B — Controlled Implementation Compatibility (D017)

**Date:** 2026-10-15  
**Decision:** D017 — Progressive Curriculum Intelligence (LOCKED); D006 hybrid storage (LOCKED)  
**Micro-step:** Read-only assessment — prepare **BE3-SB Unit 1 A+B** for controlled implementation by checking fit against existing relational tables and UI data contracts  
**Preferred content source:** [`be3-sb-u01-u09-book-overview-d017-exp-ab.md`](./be3-sb-u01-u09-book-overview-d017-exp-ab.md) Unit 1 row  
**Reproducibility:** [`be3-u01-ab-regen-reproducibility-d017-v1.md`](./be3-u01-ab-regen-reproducibility-d017-v1.md); full roll-up [`be3-ab-regen-reproducibility-full-roll-up-d017-v1.md`](./be3-ab-regen-reproducibility-full-roll-up-d017-v1.md)  
**Status:** ASSESSMENT ONLY — **no database, schema, Storage, or UI changes in this step**

---

## A. Question and bounds

| Field | Value |
|---|---|
| Question | Can BE3 Unit 1 A+B be implemented in a controlled way without fighting today’s Postgres catalog or UI contracts? |
| Scope | Unit 1 *Wake Up!* only (`big_english_3_sb_unit_01`) |
| Content shape | Nine A+B columns (incl. Writing + writing-aware LOs) |
| Explicit non-actions | No migrations; no JSON schema lock; no UI work; no Storage uploads; no overview edits |

---

## B. Unit 1 A+B payload (what would be implemented)

| Field | Existing A+B Unit 1 value |
|---|---|
| Catalog book | `big_english_3_sb` |
| Unit | `big_english_3_sb_unit_01` — *Wake Up!* — pp. 4–19 |
| Vocabulary | Daily routines; clock times beyond o’clock (*seven thirty, seven forty-five…*); parts of day; hygiene content words |
| Grammar / Structures | *When does…? at… / in the morning…*; *before/after*; frequency adverbs (*always–never*); subject + verb sentences |
| Communicative Functions | Talk about routine times; sequence with before/after; state habit frequency |
| Learning Outcomes *(AI-inferred)* | Talk about daily routines and times; use frequency adverbs for habits; identify subjects and verbs when writing about routines; talk about keeping clean / chores timing |
| CLIL / Culture | Science: Keep It Clean (germs); Culture: time zones / e-pals |
| Values | Do your chores |
| Phonics | **a_e, i_e, o_e** |
| Writing | Sentence craft — subjects & verbs (routine sentences) |
| Evidence anchor | Phase 1 writing component `bep3_comp_0003` (p. 16) |

Layer note: this is **Phase 2 interpretation**, not Phase 1 book-truth (D001 / D017).

---

## C. Relational tables — compatibility

### Tables that exist today

From `supabase/migrations/20261007120000_create_curriculum_catalog.sql` + D006:

| Table | Role | Fit for Unit 1 A+B content |
|---|---|---|
| `book_series` | Series metadata | OK — Big English series already seeded |
| `books` | Catalog identity (`book_id` text + UUID) | **Compatible** — `big_english_3_sb` seeded (`20261009100000_seed_big_english_3_sb.sql`) |
| `book_files` | File pointers (`source_pdf`, `canonical_json`, `batch_json`, `other`) | **Partial** — can point at a future interpretation file via `other`; **no** dedicated Phase 2 file type |
| `dataset_versions` | Phase 1 canonical dataset revisions | **Do not use** for A+B — reserved for Phase 1 evidence versions |
| `profiles` | Auth roles | Unrelated to content shape |

### Tables that do **not** exist (and must not be invented for this micro-step)

No Postgres tables for: units, vocabulary, grammar, learning outcomes, writing strands, CLIL, values, phonics, or Book Intelligence overviews.

D006 / `docs/8-database-architecture.md` explicitly forbid normalizing curriculum entities into relational tables.

### Verdict — relational layer

| Check | Result |
|---|---|
| Catalog identity for BE3-SB | **Compatible** |
| Unit identity available in Phase 1 JSON | **Compatible** (`big_english_3_sb_unit_01`) |
| Place to store nine A+B cells as relational columns | **None by design** — correct under D006 |
| Need a migration to “hold” Unit 1 A+B cells | **No** (and should not) |
| Risk if someone normalizes A+B into Postgres now | **High** — fights D006 and locks an unapproved Phase 2 schema |

**Controlled-implementation implication:** Keep Unit 1 A+B as a **JSON (or Markdown) interpretation artifact** linked, if needed, only by catalog `book_id` / `unit_id`. Do **not** add overview columns to Postgres.

---

## D. UI data contract — compatibility

### Live UI contracts (real data)

| Surface | Contract / types | Consumes today | A+B Unit 1 fit |
|---|---|---|---|
| Curriculum Library | `curriculumService` → `book_series` / `books` / `book_files` | Catalog metadata + covers | **Identity only** — no overview columns |
| Validation | `validationService` + `BatchJsonSummary` / `BookFileBatch` | Phase 1 batch/canonical JSON | **Evidence source only** — not a Book Intelligence view |
| Mock registry note | [`project-tracking/4-mock-data-registry.md`](../../project-tracking/4-mock-data-registry.md) | Distinguishes live vs mock | Confirms Book Intelligence is **not** a live UI path |

`BatchJsonSummary` fields (`vocabulary`, `language`, `activities`, `pages`, …) are Phase 1 evidence slices. They are **not** the nine-column A+B overview contract.

### Mock / prototype UI contracts (not Book Intelligence)

| Type (`app/src/types/curriculum.ts`) | Grain | Used by | Soft map from A+B? |
|---|---|---|---|
| `BookContent.curriculumObjectives` | Page-spread objectives list | Lesson Intelligence (Beehive mock) | Soft → LO fragments only; loses column roles |
| `BookContent.targetVocabulary` | Word items | Same | Soft → vocab words only; not unit overview prose |
| `BookContent.grammarFocus` | String list | Same | Soft → grammar snippets only |
| `BookContent.targetLanguage` | Q/A frame | Same | Soft → functions/models only |
| `TeachingIntelligence.*` | Lesson pedagogy | Same | **No** — different phase/purpose |
| `PageSpread` | Two-page visual chrome | Book viewer mock | **No** — not unit overview |

There is **no** TypeScript type, hook, or route that loads Phase 2 Markdown/JSON Book Intelligence overviews.

### Nine-column Writing gap

| A+B column | Existing UI field | Status |
|---|---|---|
| Vocabulary | Partial mock `targetVocabulary` | Different grain; Beehive-only mock |
| Grammar / Structures | Partial mock `grammarFocus` | Different grain |
| Communicative Functions | Partial mock `targetLanguage` / skills | Incomplete |
| Learning Outcomes | Partial mock `curriculumObjectives` | Name collision risk; not labeled AI-inferred |
| CLIL / Culture | None | **Gap** |
| Values | None | **Gap** |
| Phonics | Activity type enum only | **Gap** as overview cell |
| Writing | None | **Gap** (the A+B differentiator) |

### Verdict — UI layer

| Check | Result |
|---|---|
| Existing live UI can render Unit 1 A+B as-is | **No** |
| Safe to force A+B into `BookContent` / Beehive page mock | **No** — wrong grain, wrong book, hides Writing column |
| New consumer required for controlled UI implementation | **Yes** (future step — not this assessment) |
| Catalog navigation to BE3-SB book card | **Compatible** (identity already live) |

---

## E. Storage / artifact path (compatibility, not implementation)

| Option | Compatible with current rules? | Notes |
|---|---|---|
| Keep docs Markdown only (`docs/phase-2/experiments/…`) | **Yes** | Current state; no UI |
| Local Phase 2 JSON under `data/phase2/…` | **Yes** (pattern exists for BE2 research JSON) | Not wired to app |
| Supabase `book-datasets` companion object (like `ss_v1.json`) | **Possible** without schema lock | `ss_v1` already sits beside Phase 1 `v1.json` **without** `dataset_versions` merge |
| Register via `book_files` | **Partial** | `file_type` allow-list has only `other` as non–Phase-1 escape hatch; dedicated Phase 2 type would need a migration (out of scope) |
| Merge A+B into Phase 1 `canonical/v1.json` | **Incompatible with D001** | Interpretation must stay separate |
| Point `dataset_versions` at A+B | **Incompatible** | That table versions Phase 1 evidence |

---

## F. Controlled-implementation readiness summary

| Layer | Ready? | Gate |
|---|---|---|
| Content quality (U1 A+B) | **Ready** | Reproducible; SS dry-check dual Pass; owner prefers A+B for BE3-SB |
| Catalog identity | **Ready** | `big_english_3_sb` + `big_english_3_sb_unit_01` |
| Relational tables for cells | **N/A — correct absence** | Do not normalize |
| Phase 2 JSON schema | **Not ready / not locked** | D017 forbids premature lock |
| Storage registration convention | **Not decided** | Companion path possible; `book_files` type gap |
| UI data contract for 9 columns | **Not ready** | No consumer; Writing/CLIL/Values/Phonics gaps |
| BE2 v2 eight-column baseline | **Unaffected** | Keep separate; do not overwrite |

### Recommended controlled path (assessment only — not authorized here)

1. Treat Unit 1 A+B as a **single-unit interpretation slice** keyed by `catalogBookId` + `unitId`.  
2. Persist outside Phase 1 canonical JSON (companion JSON or keep Markdown until a tiny JSON draft is approved).  
3. Do **not** migrate Postgres for overview columns.  
4. If UI is later requested: add a **new** Book Intelligence unit-card contract (nine fields + inference labels), not a reuse of `BookContent`.  
5. Keep BE2 v2 eight-column baseline untouched.

### Compatibility verdict

**Catalog / identity: Compatible.**  
**Relational content model: Compatible by not using one (D006).**  
**UI data contract: Not yet compatible — no Book Intelligence consumer; Writing column has no home.**  
**Controlled implementation may proceed later as an additive interpretation artifact + new UI contract; it must not alter Phase 1 tables/JSON or force A+B into existing page-mock types.**

---

## G. Explicit non-actions (this step)

- No Supabase migrations or RLS changes  
- No `book_files` / `dataset_versions` writes  
- No Phase 1 or Phase 2 JSON schema changes  
- No UI/component/type edits  
- No edits to the A+B overview Markdown  

---

## Change log

| Date | Change |
|---|---|
| 2026-10-15 | Created read-only BE3 Unit 1 A+B implementation compatibility assessment vs Postgres catalog and UI contracts. |
