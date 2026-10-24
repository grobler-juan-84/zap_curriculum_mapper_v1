# Unit Learning Spine & Prior Learning Ranking — Design Record

**Status:** ACTIVE — BE3 U8 spine + ordering + language/grammar `[PRIOR]` on Step 2 with light evidence-kind provenance  
**Version:** 0.8  
**Date:** 2026-10-24  
**Type:** Design + data + metadata + ordering + Step 2 vocabulary/language/grammar surfacing + light evidence-kind display

**Related:**

- Prior Learning / HM audit: [`chalkie-prior-learning-horizontal-mapping-audit-v0.1.md`](./chalkie-prior-learning-horizontal-mapping-audit-v0.1.md) (Slice 1–2 implemented; same-unit `[PRIOR]` may include vocab/LiA/Grammar with light evidence-kind labels)
- Chalkie Workspace: [`p5-prototype-chalkie-workspace.md`](./p5-prototype-chalkie-workspace.md)
- Workflow reference: [`../phase-6/chalkie-interface-and-generation-workflow.md`](../phase-6/chalkie-interface-and-generation-workflow.md)
- Teacher Intelligence left pane: [`teacher-intelligence-left-pane-contract-v0.1.md`](./teacher-intelligence-left-pane-contract-v0.1.md)

**Non-goals (still):** no Step 2 / ranking / UI wiring, no candidate-resolver changes, no canonical JSON or mapping edits, no Chalkie template changes, no D018 reopen, no edits to `docs/4-decisions.md` or `docs/7-future.md`.

---

## 1. Problem

Step 2 same-unit `[PRIOR]` cards may now surface earlier verified **vocabulary, Language in Action, and Grammar**, with light evidence-kind provenance and spine-aware ordering.

For Big English 3 Unit 8 (*Healthy Living*), a later lesson (e.g. Values/Review) can offer earlier Vocabulary, LiA, and Grammar cores when those pages are eligible—without inventing evidence or auto-selecting.

Story/Reading and Culture/Content reading remain useful **support**, but they should not dominate reusable-prior-learning suggestions by default.

---

## 2. Purpose

Define a **generic, author-curated Unit Learning Spine**: a transparent curriculum-author judgement of which components in a unit are **core** reusable learning vs **support**, so future same-unit `[PRIOR]` suggestions can prefer the right foundations without guessing.

**Data slice (done):** BE3 Unit 8 spine is encoded as read-only TypeScript (`unitLearningSpine.ts` + `be3U08UnitLearningSpine.ts`) with focused tests.

**Read-only consumer (done):** `listCoreUnitLearningSpineComponentIds` returns core component IDs in declared spine order (or `[]` when no spine).

**Read-only `[PRIOR]` metadata (done):** `attachUnitLearningSpineMetadata` may set optional `componentId` / `spineRole` (`core` | `support`) on same-unit candidates when printed pages uniquely match one declared spine component. Absent = unclassified.

**Narrow optional ordering (done):** `orderSameUnitPriorLearningCandidatesBySpineRole` — `core` first, then `support`, then unclassified; stable within role. Cards remain optional and unchecked. **No badges or filters.**

**Language/grammar Step 2 surfacing (done):** `assembleSameUnitPriorLearningCandidates` merges vocabulary + verified LiA/Grammar candidates, then applies spine-aware order. Cards remain optional/unchecked with existing `[PRIOR]` provenance.

---

## 3. Explicit rule — what this is / is not

| This **is** | This **is not** |
|---|---|
| Transparent curriculum-author judgement | Automatic page-number logic |
| Per-unit (and per-book) curation that can vary | Keyword matching or synonym “relevance” |
| A visible spine teachers (and systems) can inspect | AI ranking or hidden scoring |
| A way to prefer core recycle targets | A claim that support components are unimportant |
| Compatible with verified evidence only | A substitute for Activity Selection or current-page evidence |

Support components (Story, Culture, Content Connection, Writing, Phonics, Values, Review) remain pedagogically valuable. The spine only says they are usually **not** the default main reusable-prior-learning targets for later lessons in the same unit.

---

## 4. Component record (generic model)

Each spine entry is an author-curated **component record** (implemented as `UnitLearningSpineComponent`):

| Field | Intent | Code |
|---|---|---|
| **Stable component ID** | Durable identity | `componentId` |
| **Book / unit identity** | Catalog + unit | `catalogBookId`, `unitNumber`, `unitTitle` |
| **Component title / type** | Teacher-facing name and family | `title`, `componentType` |
| **Source pages** | Inclusive SB printed pages | `printedPages` |
| **Role** | `core`, `support`, or `review_support` | `role` |
| **Learning kind** | vocabulary, communicative_language, grammar, reading_content, phonics, writing, values_review | `learningKind` |
| **Optional sequencing position** | e.g. Core 1 / Core 3 / Core 5 | `sequencingPosition` |
| **Teacher-facing recycle reason** | Why a later lesson might reuse this | `recycleReason` |
| **Human-verified status** | Never auto-inferred | `verificationStatus: 'human_verified'` |

Records are **human-authored**. Absence of a spine for a unit means systems must not invent one (`getUnitLearningSpine` returns `null`).

---

## 5. Worked example — BE3 Unit 8 (*Healthy Living*) — IMPLEMENTED (data only)

Owner-intended **core sequence** (encoded in `BE3_U08_UNIT_LEARNING_SPINE`):

| Sequencing | Component | Pages | Role | Learning kind | Stable ID |
|---|---|---|---|---|---|
| Core 1 | Vocabulary / Song | 128–129 | `core` | vocabulary | `big_english_3_sb_u08_vocabulary_song` |
| — | Story / Reading | 130–131 | `support` | reading_content | `big_english_3_sb_u08_story_reading` |
| Core 3 | Language in Action | 132–133 | `core` | communicative_language | `big_english_3_sb_u08_language_in_action` |
| — | Content Connection / P.E. | 134–135 | `support` | reading_content | `big_english_3_sb_u08_content_connection_pe` |
| Core 5 | Grammar | 136–137 | `core` | grammar | `big_english_3_sb_u08_grammar` |
| — | Culture Connection | 138–139 | `support` | reading_content | `big_english_3_sb_u08_culture_connection` |
| — | Writing | 140 | `support` | writing | `big_english_3_sb_u08_writing` |
| — | Phonics | 141 | `support` | phonics | `big_english_3_sb_u08_phonics` |
| — | Values | 142 | `support` | values_review | `big_english_3_sb_u08_values` |
| — | Review | 143 | `review_support` | values_review | `big_english_3_sb_u08_review` |

**Intended recycle emphasis:** Core 1 → Core 3 → Core 5 are the primary same-unit foundations. Support spreads may still appear as **optional** reading/content suggestions when evidence exists, but must not crowd out core vocabulary, communicative language, and grammar.

**Runtime today:** Step 2 same-unit `[PRIOR]` may include vocabulary, LiA, and Grammar when earlier verified evidence exists (spine order: core → support → unclassified). Cards stay optional/unchecked. No badges/filters. Handoff changes only when a teacher selects a card. Packages/canaries unchanged.

---

## 6. Future `[PRIOR]` candidate categories

When (and only when) authorized, same-unit suggestions should be able to offer distinct categories—each requiring **verified** source evidence, or honest emptiness:

1. **Verified vocabulary / lexical support** — earlier target vocabulary / models (today’s Slice 1–2 path).
2. **Verified communicative language frames** — earlier Language in Action (or equivalent) frames with verified wording.
3. **Verified grammar patterns / models** — earlier Grammar (or equivalent) patterns with verified evidence.
4. **Optional reading / content support** — Story, Culture, Content Connection, etc., when useful and evidenced; not default “main” recycle targets.
5. **No suggestion when evidence is absent** — never invent frames, grammar, or vocabulary to fill a slot.

Categories stay labelled with `[PRIOR]` provenance and visible source pages. They do not become auto-selected handoff content.

---

## 7. Hard boundaries

1. Candidates remain **optional** and **unchecked by default**.
2. Same-unit `[PRIOR]` stays **separate** from cross-unit `[HM]` (and from teacher-added / School Notes).
3. No candidate may **restore an excluded current activity** (Activity Selection exclusion safety preserved).
4. Language and grammar cards require **verified source evidence**; no paraphrase invention.
5. **Provenance** and **source pages** remain visible on cards / handoff.
6. **No AI/API**, no hidden relevance scoring, and **no automatic lesson selection**.

---

## 8. Intended future teacher experience (simple)

- Preparing a later **Grammar** lesson, the teacher may optionally choose earlier **Vocabulary**, **Language in Action**, and/or an earlier **Grammar** foundation when those cores are relevant and evidenced.
- Preparing a **reading** lesson (Story / Culture / Content), the teacher may still see earlier **core** learning as optional support; the reading spread itself is not treated as the unit’s main reusable learning target by default.
- Empty or sparse evidence stays honest: fewer cards, never fabricated ones.

---

## 9. Relationship to Prior Learning slices

| Slice / track | Status vs this design |
|---|---|
| Slice 1–2 (vocab-only same-unit `[PRIOR]`) | Implemented today; remains truthful but incomplete relative to the spine |
| BE3 U8 spine **data** | **IMPLEMENTED** (read-only) |
| Read-only core-ID **consumer** | **IMPLEMENTED** (`listCoreUnitLearningSpineComponentIds`; internal only) |
| Read-only `[PRIOR]` **metadata** | **IMPLEMENTED** (`attachUnitLearningSpineMetadata`) |
| Narrow spine-role **ordering** | **IMPLEMENTED** (`orderSameUnitPriorLearningCandidatesBySpineRole`; vocab Step 2 only) |
| Language/grammar `[PRIOR]` **foundation + Step 2 surfacing** | **IMPLEMENTED** (`assembleSameUnitPriorLearningCandidates`) |
| Badges / filters / auto-select | **NOT AUTHORIZED** |
| Slice 3 curated `[HM]` | **IMPLEMENTED** (separate track; not replaced by the spine) |

---

## 10. Status and smallest next step

**Status:** `ACTIVE — BE3 U8 vocabulary + LiA + Grammar same-unit [PRIOR] surfaced on Step 2 (optional/unchecked; spine-aware order)`

**Code:**

- `app/src/features/chalkie/assembleSameUnitPriorLearningCandidates.ts`
- `app/src/features/chalkie/buildSameUnitLanguageGrammarPriorLearningCandidates.ts`
- `app/src/features/chalkie/buildSameUnitPriorLearningCandidates.ts`
- `app/src/features/chalkie/orderSameUnitPriorLearningCandidatesBySpineRole.ts`
- (+ spine types/data/metadata helpers)

**Verified BE3 U8 evidence used:**

- LiA p.132: `bep3_sb_lang_08_01`, `bep3_sb_lang_08_02` → Activity `bep3_sb_act_08_08`
- Grammar p.136: `bep3_sb_lang_08_03`, `bep3_sb_lang_08_04`

**Done (Step 341):** light teacher-facing evidence-kind distinction on same-unit `[PRIOR]` provenance lines (`Vocabulary` / `Language in Action` / `Grammar`); no badges, filters, auto-select, or handoff changes.

**Done (Step 342):** Slice 3 curated earlier-unit `[HM]` (BE2 U8 opener verified bank); PRIOR preserved; optional/unchecked; light `[HM]` provenance.

**Done (Step 343):** Coverage expansion gate — no second verified `[HM]` target pack in repo; product store unchanged; inventory test + audit §8a recorded.

**Done (Step 345):** Strengthened session `[TEACHER-ADDED · UNVERIFIED]` path (visible provenance; no auto-select on add; session guidance). Distinct from any future School Notes product.

**Done (Step 346):** Curated `[HM]` pack authoring contract (docs + validator/tests); no second product route.

**Reverted:** Premature School Notes §8b coverage-gate / unlock-pack prep (former Steps 344 / 347 artifacts removed). School Notes is not an active product track.

**Smallest next step (when owner authorizes):** author a new verified curated `[HM]` target pack that passes the authoring contract. Do not implement School Notes or AI automatically.
