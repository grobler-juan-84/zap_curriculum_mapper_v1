# Prior Learning / Horizontal Mapping — Design Audit

**Status:** ACTIVE — Slice 1–3 IMPLEMENTED; curated `[HM]` coverage expansion **blocked**; curated `[HM]` pack authoring contract **defined**; School Notes product surface **not authorized**  
**Version:** 1.6  
**Date:** 2026-10-24  
**Scope:** Design rules for teacher-controlled prior-learning / horizontal-mapping support. Same-unit `[PRIOR]` and curated earlier-unit `[HM]` may surface on Step 2 when verified evidence / curated entries exist (optional; never auto-select). School Notes are **not** an active product surface (no approved implementation plan or source pack). No AI. See [`unit-learning-spine-and-prior-learning-ranking-design-v0.1.md`](./unit-learning-spine-and-prior-learning-ranking-design-v0.1.md). New `[HM]` routes require [`curated-horizontal-mapping-pack-authoring-contract-v0.1.md`](./curated-horizontal-mapping-pack-authoring-contract-v0.1.md).

---

## 1. Purpose

Make earlier learning genuinely useful to teachers without guessing, auto-selecting, or rebuilding excluded current activities.

This is a **core future capability** of Teacher Intelligence ([`teacher-intelligence-left-pane-contract-v0.1.md`](./teacher-intelligence-left-pane-contract-v0.1.md); [F022](../7-future.md)). It must be built in **small, safe slices**.

Related context:

- Current Chalkie adapter: [`p5-prototype-chalkie-workspace.md`](./p5-prototype-chalkie-workspace.md)
- Neutral package prior-support fields: [`chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md`](./chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md)
- Activity Selection (current SB/WB evidence remains separate and exclusion-safe)
- Unit Learning Spine + language/grammar Step 2 surfacing: [`unit-learning-spine-and-prior-learning-ranking-design-v0.1.md`](./unit-learning-spine-and-prior-learning-ranking-design-v0.1.md)
- Platform boundary [F021](../7-future.md) preserved

---

## 2. Three clearly separated sources of support

### 2.1 `[PRIOR]` — Same-unit earlier learning

Earlier **verified** pages in the **current unit** of the same book.  
Example: Unit 8 pp.128–129 supporting later Unit 8 Language in Action.

### 2.2 `[HM]` — Earlier-unit learning in the same book

Only when a **human-curated, evidence-backed** relationship exists. Never infer usefulness from word similarity. **Implemented (Slice 3)** via `curatedHorizontalMappingEntries` + `buildCuratedHorizontalMappingCandidates` (BE2 U8 opener verified bank today).

### 2.3 `[TEACHER-ADDED · UNVERIFIED]` — Teacher-created support

Teacher/school authorship only; must stay visibly distinct. Session Step 2 “Add a prior skill” path: optional/unchecked on add, light `[TEACHER-ADDED · UNVERIFIED] · session only — not publisher evidence` provenance on cards, handoff only when selected. **Not** a School Notes product surface.

**Mastery warning:** prior exposure ≠ mastery.

---

## 3. Required candidate record fields

Implemented as `PriorLearningCandidate` in `app/src/features/chalkie/priorLearningCandidate.ts`:

| Field | Property |
|---|---|
| stable ID | `id` |
| source book / unit / page scope | `catalogBookId`, `unitNumber`, `printedPages`, `pageIds` |
| source type | `sourceType`: `PRIOR` / `HM` / `TEACHER_ADDED` |
| title | `title` |
| concise language/content preview | `contentPreview` |
| why it may help | `whyItMayHelp` |
| provenance note | `provenanceNote` |
| explicit target | `target`: `lesson1` / `lesson2` / `both` |
| optional teacher note | `teacherNote` (null in Slice 1 builders) |
| verification status | `verificationStatus`: `verified` / `provisional` / `unverified` |

Adapters (Slice 1 only; no new selection wiring):

- `teacherChoiceSuggestionFromPriorLearningCandidate` — preserves existing Step 2 cards
- `neutralPriorSupportInputFromCandidate` — contract alignment for later slices

---

## 4. Hard rules (non-negotiable)

1. Suggestions are optional and never auto-selected.
2. They remain separate from selected current SB/WB activity evidence.
3. They cannot restore, replace, or reconstruct excluded current activities.
4. They may support selected activities only where the teacher chooses.
5. Provenance must remain visible in the detailed handoff and concise outline.
6. Empty states must be honest.
7. Teacher-controlled horizontal mapping, not AI guessing.
8. No OpenAI/API use for these slices.
9. Do not change Chalkie templates, Activity Selection, neutral-package production routing / canaries, canonical data, D018, or `docs/4-decisions.md` without separate authorization.
10. Slice 2+ requires separate owner authorization.

---

## 5. Inventory of existing sources (Slice 1 audit)

| Existing surface | Nature | Slice 1 disposition |
|---|---|---|
| `BE2_U08_AI_SUGGESTIONS` in `teacherChoiceSuggestions.ts` | Golden fixture for BE2 U8 curated `[HM]` cards | Kept as regression authority; runtime uses curated store |
| `deriveSameUnitEarlierVocabularySuggestions` | Deterministic same-unit earlier-page target vocab → Step 2 cards | Now a thin adapter over `buildSameUnitPriorLearningCandidates` |
| `buildSameUnitPriorLearningCandidates` | **New** read-only `[PRIOR]` candidate builder | Slice 1 deliverable |
| Teacher “Add a prior skill” / teacher-added language | Session `[TEACHER-ADDED · UNVERIFIED]` | Strengthened (Step 345): visible provenance + no auto-select on add; distinct from any future School Notes product |
| Neutral package `priorSupport` | Selected-support contract with lesson targets | Unchanged; mapper helper ready for later |
| Left-pane Horizontal Mapping accordion | Not implemented | Still not implemented |

**Gaps remaining (intentionally):**

- No shared UI surfacing of `PriorLearningCandidate` beyond existing suggestion cards
- No School-Specific Notes product surface (not authorized; no approved plan or source pack)
- Curated `[HM]` store remains BE2 U8 opener–only — see **Coverage expansion gate** (§8a)
- Bespoke handoff provenance defaults remain as before (adapter audit)

---

## 6. Staged implementation

### Slice 1 — IMPLEMENTED

- Inventory recorded (§5)
- Deterministic read-only candidate model (`PriorLearningCandidate`)
- Same-unit `[PRIOR]` builder from human-verified target vocabulary on earlier printed pages
- Existing Step 2 suggestion path preserved via adapter (no selection/UI behaviour change)
- Focused tests: `scripts/tests/buildSameUnitPriorLearningCandidates.test.ts`

### Slice 2 — IMPLEMENTED

- Candidate-aware surface path (`surfaceSameUnitPriorLearningSuggestions`)
- Resolver exposes `sameUnitPriorLearningCandidates` and surfaces PRIOR-only into `priorLearningSuggestions`
- Step 2 cards start unchecked (`initialSelectedPriorLearningIds` → `[]`); light `[PRIOR]` provenance on cards
- BE2 U8 fixture curated cards unchanged and separate from same-unit candidates
- Focused tests: `scripts/tests/surfaceSameUnitPriorLearningSuggestions.test.ts`

### Slice 3 — IMPLEMENTED

- Human-curated earlier-unit `[HM]` store (`curatedHorizontalMappingEntries.ts`)
- Builder + merge: PRIOR first, then HM; id/frame dedupe; optional/unchecked
- Light `[HM]` provenance on Step 2 cards; BE2 U8 golden fixture retained
- Focused tests: `scripts/tests/buildCuratedHorizontalMappingCandidates.test.ts`

### Slice 4 — NOT AUTHORIZED

School-Specific teacher notes as a distinct product surface. **Not** an active product track: no approved implementation plan, source pack, coverage gate, or unlock-pack contract. Session Step 2 teacher-added language is **not** School Notes.

### Future only — AI suggestions

Out of scope; no OpenAI/API ranking.

---

## 7. Non-goals (still)

- No School Notes product surface, notes store, coverage gates, or unlock-pack contracts
- No OpenAI / API wiring or AI ranking of suggestions
- No Chalkie template changes
- No Activity Selection changes
- No neutral-package production routing / canary changes
- No canonical data or mapping changes
- No D018 reopen; no edits to `docs/4-decisions.md`
- No automatic expansion of Unit 8 canaries

---

## 8. Status and next step

**Status:** ACTIVE — Slice 1–3 IMPLEMENTED; curated `[HM]` coverage expansion blocked; curated `[HM]` pack authoring contract defined; School Notes product surface not authorized

**Code:**

- `app/src/features/chalkie/priorLearningCandidate.ts`
- `app/src/features/chalkie/buildSameUnitPriorLearningCandidates.ts`
- `app/src/features/chalkie/surfaceSameUnitPriorLearningSuggestions.ts` (PRIOR + HM merge)
- `app/src/features/chalkie/curatedHorizontalMappingEntries.ts`
- `app/src/features/chalkie/buildCuratedHorizontalMappingCandidates.ts`
- `app/src/features/chalkie/curatedHorizontalMappingPackAuthoringContract.ts` (authoring gate; not a runtime route)
- `app/src/features/chalkie/deriveSameUnitEarlierVocabularySuggestions.ts` (adapter)
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` (candidate + surface wiring)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (optional selection + `[PRIOR]` / `[HM]` provenance)

**Unit Learning Spine / language-grammar:** BE3 U8 same-unit `[PRIOR]` Step 2 assembles vocabulary + verified LiA + Grammar (`assembleSameUnitPriorLearningCandidates`), spine-ordered, optional/unchecked, with light evidence-kind provenance (`Vocabulary` / `Language in Action` / `Grammar`). See [`unit-learning-spine-and-prior-learning-ranking-design-v0.1.md`](./unit-learning-spine-and-prior-learning-ranking-design-v0.1.md).

**Code:** also `assembleSameUnitPriorLearningCandidates.ts`, `buildSameUnitLanguageGrammarPriorLearningCandidates.ts`, evidence-kind display helpers in `priorLearningCandidate.ts`.

**Inventory / contract tests:**

- `scripts/tests/curatedHorizontalMappingCoverageInventory.test.ts`
- `scripts/tests/curatedHorizontalMappingPackAuthoringContract.test.ts`

**Smallest next step:** author a **new verified curated `[HM]` target pack** that passes the `[HM]` authoring contract. Do not implement School Notes or AI suggestions automatically.

---

## 8a. Coverage expansion gate (2026-10-24)

**Question:** Is there a next lesson/unit with genuinely verified curated mapping evidence already in the repository, beyond the BE2 U8 opener bank?

**Sources scanned (docs + code + `data/`):**

| Source | What it provides | Qualifies as a new Step 2 `[HM]` target? |
|---|---|---|
| [`../phase-2/experiments/be2-u01-u07-prior-language-bank-u08-horizontal-map-v0.1.md`](../phase-2/experiments/be2-u01-u07-prior-language-bank-u08-horizontal-map-v0.1.md) | Units 1–7 → **Unit 8 opener only** bank | No — same target as Slice 3 |
| [`../phase-2/experiments/be2-u08-horizontal-map-teacher-choice-card-v0.1.md`](../phase-2/experiments/be2-u08-horizontal-map-teacher-choice-card-v0.1.md) | Teacher selections for **U8 opener** (nine PL IDs available) | No — same target; extra PL IDs are not a new lesson/unit |
| [`../phase-2/experiments/be2-u08-horizontal-map-lesson-input-pack-v0.1.md`](../phase-2/experiments/be2-u08-horizontal-map-lesson-input-pack-v0.1.md) | Final Arm B2 pack for **U8 opener** (`PL-01`, `PL-03`, `PL-19` + teacher-added ID) | No — same target; narrower than fixture, not a second route |
| [`../phase-2/experiments/be2-u08-cumulative-language-script-pack-v0.1.md`](../phase-2/experiments/be2-u08-cumulative-language-script-pack-v0.1.md) | Scripts for **U8 opener** | No — application layer, not a new target spread |
| Phase 2 Book Intelligence overviews / cross-unit experiments | Interpretive / research evidence | No — not human-curated Step 2 `[HM]` relationship packs |
| `data/` Phase 1 canonical JSON | Page/vocab/language evidence for `[PRIOR]` | No — does not encode curated earlier-unit `[HM]` relationships |
| `curatedHorizontalMappingEntries.ts` | Runtime store | **Only** `big_english_2_sb` Unit 8 pp.128–129 (`PL-19`, `PL-08`, `PL-01`, `PL-03`) |

**Verdict:** **No second target lesson/unit qualifies.** Expanding product `[HM]` coverage would require inventing mappings from titles, themes, adjacent lessons, or BI prose — which this gate forbids.

**Not done in this step (by design):**

- No new curated store entries
- No builder / merge / provenance / handoff changes
- No BE2 golden-fixture expansion (extra teacher-choice PL IDs stay research evidence until explicitly authorized as fixture/store content for the same opener)

**Unlock condition:** a new owner-verified curated pack that satisfies the full [`curated-horizontal-mapping-pack-authoring-contract-v0.1.md`](./curated-horizontal-mapping-pack-authoring-contract-v0.1.md) (exact `catalogBookId` + `targetUnitNumber` + `targetPrintedPages`, earlier-unit relationships, provenance, exclusion checks, ownership/verification evidence, fixture + acceptance tests). Same discipline as the BE2 U8 opener pack.

**Authoring contract (2026-10-24):** verification-ready checklist + validator/tests checked in; **no second product `[HM]` route** added. See `curatedHorizontalMappingPackAuthoringContract.ts` and `scripts/tests/curatedHorizontalMappingPackAuthoringContract.test.ts`.
