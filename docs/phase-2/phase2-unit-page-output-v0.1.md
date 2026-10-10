# Phase 2 Unit + Page Output Sketch v0.1

**Status:** PARKED  
**Version:** 0.1-experimental  
**Date:** 2026-10-11  
**Purpose:** Earlier experimental JSON shape for Phase 2 unit + page curriculum intelligence. Superseded in active use by prompt v3.1 (`phase2_linguistic_anatomy`). Retained for history.  
**Companion prompt (historical):** v1 unit-interpretation prompt (removed; see [`google-ai-studio-unit-interpretation-prompt-v3.1.md`](./google-ai-studio-unit-interpretation-prompt-v3.1.md)).

**Not locked.** Not a machine JSON Schema file. Optional fields may be omitted when unsupported. No activity-level records. No book-level block in this version.

---

## 1. Design principles

1. Universal enough for other Big English units later; tested first on BE2 Unit 8.
2. Stable Phase 1 evidence references (`evidence_refs` use Phase 1 entity IDs).
3. Record schema/source versions on every output.
4. Prefer omit over invent.
5. Page summaries are enough for future teacher-facing use; do not explode into per-activity records.

---

## 2. Allowed evidence tags

| Tag | Meaning |
|---|---|
| `BOOK_EVIDENCE` | Directly supported by Phase 1 |
| `AI_INTERPRETATION` | Derived curriculum/linguistic conclusion |
| `UNCERTAIN` | Plausible but weakly supported |
| `MISSING_EVIDENCE` | Expected content not present in Phase 1 extraction |
| `AI_PREDICTED_DIFFICULTY` | Predicted learner difficulty |
| `TEACHER_CONFIRMED_DIFFICULTY` | Confirmed by teaching evidence (rare in early runs) |

Tag claims where ambiguity matters. Do **not** require a tag on every string field.

---

## 3. Root shape

```json
{
  "schema": {
    "name": "phase2_unit_page_interpretation",
    "version": "0.1-experimental",
    "status": "experimental"
  },
  "source": {
    "catalog_book_id": "big_english_2_sb",
    "unit_id": "bep2_unit_08",
    "phase1_schema_version": "0.1",
    "phase1_dataset_version": 1,
    "input_note": "Unit-scoped Phase 1 SB slice only; WB omitted"
  },
  "unit": { },
  "pages": [ ]
}
```

---

## 4. Field reference

### 4.1 `unit`

| Field | Type | Notes |
|---|---|---|
| `unit_id` | string | Phase 1 unit id |
| `title` | string | From Phase 1 |
| `printed_page_start` / `printed_page_end` | number | From Phase 1 |
| `teacher_overview` | string[] | 6–8 bullets; “one glance” |
| `executive_summary` | string | Short paragraph |
| `learning_requirements` | object[] | Evidence-led count |
| `language_systems` | object[] | Unit-native systems |
| `vocabulary_clusters` | object[] | Listed vs exposure banding |
| `difficulties` | object[] | Usually AI-predicted |
| `evidence_gaps` | object[] | e.g. missing I Can text |
| `non_linguistic` | object[] | Song/story/culture/values brief notes |

#### `learning_requirements[]`

| Field | Type | Notes |
|---|---|---|
| `id` | string | `LR-01`, `LR-02`, … |
| `statement` | string | Observable ability (“Students can …”) |
| `band` | string | `core` \| `supporting` |
| `origin` | string | `ai_inferred` \| `publisher_signal` |
| `evidence_refs` | string[] | Phase 1 entity IDs |
| `notes` | string | optional |

#### `language_systems[]`

| Field | Type | Notes |
|---|---|---|
| `id` | string | e.g. `LS-01` |
| `structure` | string | Pattern summary |
| `function` | string | Communicative function |
| `examples` | string[] | From Phase 1 where possible |
| `progression` | object | Keys among `recognition`, `guided`, `production_opportunity` (short notes) |
| `predicted_difficulties` | string[] | optional |
| `tag` | string | optional claim tag |

#### `vocabulary_clusters[]`

| Field | Type | Notes |
|---|---|---|
| `label` | string | Cluster name |
| `terms` | string[] | Lemma list |
| `expected_use` | string | `productive` \| `receptive` \| `exposure` |
| `evidence_refs` | string[] | optional |
| `tag` | string | optional |

#### `difficulties[]` / `evidence_gaps[]` / `non_linguistic[]`

Keep lean objects, e.g. `{ "text": "...", "tag": "AI_PREDICTED_DIFFICULTY", "learning_requirement_ids": ["LR-03"] }` or `{ "text": "...", "tag": "MISSING_EVIDENCE" }`.

### 4.2 `pages[]`

| Field | Type | Notes |
|---|---|---|
| `page_id` | string | Phase 1 page id |
| `printed_page` | number | Printed page |
| `main_focus` | string | One short sentence |
| `learning_requirement_ids` | string[] | Links to unit LRs |
| `target_vocabulary` | string[] | May be empty |
| `grammar_functions` | string[] | May be empty |
| `expected_performance` | string | Opportunity language, not mastery |
| `skills` | string[] | e.g. `listening`, `speaking` |
| `difficulties` | string[] | optional |
| `evidence_refs` | string[] | optional |

---

## 5. Partial U8 fragment (shape only — not a complete run)

Illustrative fragment for Big English 2 Unit 8 *Wild Animals*. **Not** a full 13-LR / 16-page interpretation. A complete file comes from the Studio run.

```json
{
  "schema": {
    "name": "phase2_unit_page_interpretation",
    "version": "0.1-experimental",
    "status": "experimental"
  },
  "source": {
    "catalog_book_id": "big_english_2_sb",
    "unit_id": "bep2_unit_08",
    "phase1_schema_version": "0.1",
    "phase1_dataset_version": 1,
    "input_note": "Partial hand fragment for shape validation only"
  },
  "unit": {
    "unit_id": "bep2_unit_08",
    "title": "Wild Animals",
    "printed_page_start": 128,
    "printed_page_end": 143,
    "teacher_overview": [
      "Wild animal words — giraffe, hippo, kangaroo, cheetah, polar bear, zebra, parrot, monkey, peacock, elephant, crocodile, snake.",
      "Ability: Animals can … / Can it/they …? Yes/No, it/they can/can't.",
      "Adjective order: opinion → size/shape → age → color (+ noun).",
      "Appreciation: I like X. They're so + adjective.",
      "Also teach (don’t skip): habitats CLIL, animals near homes, Appreciate animals, ou/ow phonics.",
      "Likely stickies: it/they answers; can't; stacked adjective order; mixing like and can."
    ],
    "executive_summary": "Unit 8 teaches children to name wild animals, talk about what animals can and cannot do, order adjectives before nouns, and express appreciation with They're so + adjective. Habitats, culture, values, and ou/ow phonics are supporting strands.",
    "learning_requirements": [
      {
        "id": "LR-01",
        "statement": "Students can recognize and say wild-animal names (giraffe, hippo, kangaroo, cheetah, polar bear, zebra, parrot, monkey, peacock, elephant, crocodile, snake).",
        "band": "core",
        "origin": "ai_inferred",
        "evidence_refs": [
          "bep2_vocab_u8_001",
          "bep2_vocab_u8_012",
          "bep2_act_u8_01",
          "bep2_act_u8_02",
          "bep2_act_u8_03",
          "bep2_comp_u8_01"
        ]
      },
      {
        "id": "LR-02",
        "statement": "Students can state animal abilities with can + base verb (e.g. Cheetahs can run).",
        "band": "core",
        "origin": "ai_inferred",
        "evidence_refs": [
          "bep2_lang_u8_001",
          "bep2_text_u8_01",
          "bep2_act_u8_06"
        ]
      }
    ],
    "language_systems": [
      {
        "id": "LS-01",
        "structure": "X can V; Can a/an X V? / Can Xs V?; Yes, it/they can. / No, it/they can't.",
        "function": "stating_and_asking_about_animal_abilities",
        "examples": [
          "Cheetahs can run.",
          "Can a kangaroo jump? Yes, it can.",
          "Can snakes run? No, they can't."
        ],
        "progression": {
          "recognition": "Song/story ability exposure",
          "guided": "Language in Action Can it/they frames",
          "production_opportunity": "Pair ask/answer and games"
        },
        "predicted_difficulties": [
          "it vs they in short answers",
          "can't spelling/contraction"
        ],
        "tag": "AI_INTERPRETATION"
      }
    ],
    "vocabulary_clusters": [
      {
        "label": "Wild animals (listed)",
        "terms": [
          "giraffe",
          "hippo",
          "kangaroo",
          "cheetah",
          "polar bear",
          "zebra",
          "parrot",
          "monkey",
          "peacock",
          "elephant",
          "crocodile",
          "snake"
        ],
        "expected_use": "productive",
        "evidence_refs": ["bep2_vocab_u8_001", "bep2_vocab_u8_012"],
        "tag": "BOOK_EVIDENCE"
      }
    ],
    "difficulties": [
      {
        "text": "Stacking adjectives in English opinion → size/shape → age → color order",
        "tag": "AI_PREDICTED_DIFFICULTY",
        "learning_requirement_ids": ["LR-06"]
      }
    ],
    "evidence_gaps": [
      {
        "text": "Page bep2_p143 notes include an I Can self-assessment block, but exact sentences are not extracted.",
        "tag": "MISSING_EVIDENCE",
        "evidence_refs": ["bep2_p143"]
      }
    ],
    "non_linguistic": [
      {
        "text": "Values strand titled Appreciate animals.; do not invent extra core LRs beyond appreciation language frames.",
        "tag": "BOOK_EVIDENCE",
        "evidence_refs": ["bep2_comp_u8_08"]
      }
    ]
  },
  "pages": [
    {
      "page_id": "bep2_p128",
      "printed_page": 128,
      "main_focus": "Present and practise wild-animal vocabulary.",
      "learning_requirement_ids": ["LR-01"],
      "target_vocabulary": [
        "giraffe",
        "hippo",
        "kangaroo",
        "cheetah",
        "polar bear",
        "zebra",
        "parrot",
        "monkey",
        "peacock",
        "elephant",
        "crocodile",
        "snake"
      ],
      "grammar_functions": [],
      "expected_performance": "Students listen, look, and say animal names; find and say; play a simple naming game.",
      "skills": ["listening", "speaking"],
      "evidence_refs": [
        "bep2_p128",
        "bep2_comp_u8_01",
        "bep2_act_u8_01",
        "bep2_act_u8_02",
        "bep2_act_u8_03"
      ]
    }
  ]
}
```

---

## 6. Filename convention

`FILE: {catalog_book_id}_{unit_id}_phase2_v0.1.json`

Example: `big_english_2_sb_bep2_unit_08_phase2_v0.1.json`

---

## 7. Explicit non-claims

- This sketch is **not** approved as a production schema.
- Completing a Studio run for U8 does not lock methodology.
- Book-level consolidation and activity-level records are out of scope for v0.1.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-11 | Created experimental unit+page output sketch v0.1 with partial BE2 U8 fragment. |
