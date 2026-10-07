# Cross-Series Schema Review Notes (initial draft)

**Status:** ACTIVE  
**Version:** 0.1-draft  
**Date:** 2026-10-07  
**Schema under review:** Phase 1 JSON schema **0.1** ([`JSON_Schema.md`](./JSON_Schema.md))  
**Purpose:** First formal cross-series challenge of schema 0.1 using the Storage-backed pilot set, before large-scale remaining-book extraction.

**Related:** [`Dataset_registry.md`](./Dataset_registry.md) §13–14 · [`Extraction_Data_Specification.md`](./Extraction_Data_Specification.md) · brainstorming entry “Schema gaps before more books”

---

## 1. Scope and evidence

| Registry ID | Series | Evidence used | Phase 1 |
|---|---|---|---|
| BH1 | Beehive 1 SB | Unit batches 01–10 verified; spot-sampled U01 + U05 gaps | IN PROGRESS (canonical pending) |
| BE1-SB | Big English 1 SB | Canonical v1 (whole-book audit **PASSED**) | **COMPLETE** |
| BE2-SB | Big English 2 SB | Unit batches verified; spot-sampled U01 | IN PROGRESS (canonical pending) |
| RH2A | Reach Higher 2A | Units 1–4 verified; spot-sampled U01 (+ U04 structure) | IN PROGRESS (canonical pending) |

This is a **draft review**, not a schema bump. No LOCKED decision yet to change 0.1.

---

## 2. Executive verdict

**Schema 0.1 is good enough to continue pilot work** (canonical merges for BH1 / BE2-SB / RH2A, Validation, audits).

It is **not** yet safe to treat as “done” for all 18 books. Recurring pedagogical structures are still forced into notes/generic activities/components.

**Recommended path (hybrid):** keep extracting/merging on 0.1, and prepare a **small additive schema patch (0.1 → 0.2 candidate)** for the highest-frequency gaps below — then decide CONTINUE vs ADJUST before remaining-book scale-up.

Do **not** invent a separate schema per series.

---

## 3. What already works across series

These top-level arrays and practices held for all four pilots:

| Area | Finding |
|---|---|
| Top-level shape | `units` / `pages` / `vocabulary` / `language` / `activities` / `continuous_text` / `curriculum_components` / `relationships` / `extraction_issues` / `schema_gaps` |
| Page evidence | Printed/PDF page linkage + `section_type` / `section_title` is usable for Verification + PDF jump |
| Vocabulary | Target vs supporting/recycled classifications appear in BH1 / BE1 / RH2A |
| Language | Frames, Q&A, patterns, dialogues transferable (labels differ by series) |
| Uncertainty | `extraction_issues` + `schema_gaps` prevented silent loss of hard features |
| Human verify | Unit-batch verification + (BE1) unit-scoped canonical Validation worked |

**Quality checkpoint (2026-10-07) still stands:** page coverage, vocabulary, and important language structures are satisfactory to continue.

---

## 4. Series structural differences (not necessarily bugs)

### 4.1 Unit scale and pacing

| Book | Typical unit footprint (pilot) | Implication |
|---|---|---|
| BH1 | ~12 instructional pages / unit | Dense YL lesson cycle (Words → Grammar → Story → Skills → Project → Review) |
| BE1 / BE2 | ~16 pages / unit | Similar YL cycle; more phonics / values / culture strands as components |
| RH2A | ~60+ pages / unit (Parts 1–2) | Inquiry + long reading + writing project; “unit” ≠ Beehive/Big English unit |

Schema must allow **large units** without requiring artificial lesson splitting into separate books.

### 4.2 `section_type` / `component_type` vocabulary drift

Same pedagogical idea, different labels (examples):

| Concept | BH1 (examples) | BE1/BE2 (examples) | RH2A (examples) |
|---|---|---|---|
| Vocab intro | `vocabulary_presentation` | `vocabulary` | `vocabulary_presentation` |
| Story | `story` / `story_comprehension` | `story` / `reading_comprehension` | `reading_selection` / `comprehension_response` |
| CLIL | `CLIL` component | `clil` / `clil_math` | less CLIL-centric; more `study_skills` / `reading` |
| Wrap-up | `review` / `project` | `review` / `assessment` / `values` | `unit_review` / `unit_wrapup` / `writing_project_*` |

**Implication:** Do not freeze a closed enum of `section_type` yet. Prefer controlled vocabulary guidance + allow series-local strings until mapping tables exist (Phase 2+).

### 4.3 Identifier / naming drift (operational, high priority)

| Book | Catalog / folder `book_id` | Internal JSON `book_id` | Entity ID style |
|---|---|---|---|
| BH1 | `beehive_1_sb` | `beehive_1_sb` | aligned |
| BE1-SB | `big_english_1_sb` | `bep1_sb` | `bep1_unit_01`, `bep1_page_010` |
| BE2-SB | `big_english_2_sb` | `bep_sb_2` | `bep2_unit_01` |
| RH2A | `reach_higher_2a` | mixed `rh_2a` (U1–3) / `reach_higher_2a` (U4) | mixed |

**Implication:** Fix with an explicit alias map + merge-time normalization (already on TODO). Not a reason to redesign entity arrays.

### 4.4 Continuous text depth

Reach Higher long readings are sometimes summarized rather than fully recited (documented open issues). Schema supports full text; extraction practice needs a clearer rule for long passages (full vs structured summary + page anchors).

---

## 5. Schema-gap themes (clustered)

Registry counts: BH1 **8** · BE1-SB **1** · BE2-SB **0** · RH2A **5**.

### Theme A — Values / SEL / reflective discussion (cross-series)

| Source | Evidence |
|---|---|
| BH1 | Recurring **Think, Feel, Grow** (e.g. U01 p.13, U05 p.65) tied to syllabus emotional well-being |
| BE1 | **Think Big** breakouts (canonical gap `bep1_gap_0101`) — higher-order thinking prompts attached to lessons |
| BE2 | Values/culture appear as components; no formal gap logged on U01 sample |
| RH2A | Inquiry/reflection via Big Question + Think and Respond activities (partially modelled as activities) |

**Problem:** Forced into generic `curriculum_components`, `activities`, or notes; weak for filtering “reflection / values / SEL” across books.

**Candidate additive fix (0.2 sketch):**

- Prefer **one** flexible mechanism, not three series-specific tables:
  - Option 1 (lean): `activities[].sub_feature_type` enum/string (`think_feel_grow`, `think_big`, `values_prompt`, …) **plus** optional `prompt` / `competency_label`
  - Option 2: optional `reflection_prompts[]` top-level array (heavier)

**Lean:** Option 1 first (matches BE1 proposal; can absorb BH1 Think–Feel–Grow without a new entity).

### Theme B — Unit-level inquiry / Big Question (RH-led, possibly reusable)

| Source | Evidence |
|---|---|
| RH2A | Unit Big Question drives opener → readings → wrap-up (`rh_2a_u01_gap_0001`) |

**Candidate additive fix:** optional `units[].inquiry_question` (string) and/or `units[].inquiry_question_id` linking a language/component record.

Scope estimate in data: `series_specific`, but Beehive essential questions / BE themes may benefit later.

### Theme C — Embedded reading checkpoints (RH-led, possibly universal)

| Source | Evidence |
|---|---|
| RH2A | In-text **Before You Continue / Preview / Predict** (`rh_2a_u01_gap_0002`) |

**Problem:** Modelling as standalone activities loses position inside `continuous_text`.

**Candidate additive fix:** `continuous_text[].checkpoints[]` with `{ anchor_note, printed_page, prompt, checkpoint_type }`.

### Theme D — Source glossary / student-facing gloss (RH-led, possibly universal)

| Source | Evidence |
|---|---|
| RH2A | Page-foot simplified definitions (`rh_2a_u01_gap_0003`) |

**Candidate additive fix:** optional `vocabulary[].source_gloss` (or `student_definition`) string.

### Theme E — Non-gaps that look like gaps

| Pattern | Series | Notes |
|---|---|---|
| `audio_required` / `visual_verification_required` | All | Extraction issues, not schema failure |
| `missing_source` (workbook refs) | BH1 | Source availability / scope, not JSON shape |
| activity_type explosion | All | Free-text classification is OK for 0.1; normalize later |

---

## 6. BE2 as vertical check

BE2 Unit 1 shows the same Big English spine as BE1 (vocab → song/story → grammar → CLIL → culture/values → phonics → review) with **0 schema_gaps** on the sample unit.

**Implication:** Within-series vertical continuity looks healthy. Cross-series stress is dominated by **Beehive SEL** + **Reach Higher inquiry/reading scaffolds**, not by BE1→BE2 level hop.

---

## 7. Proposed working recommendations

Until an owner lock:

1. **Continue** BH1 / BE2 / RH2A canonical merges and audits on schema **0.1**.
2. **Do not** pause the pilot for a full schema rewrite.
3. Draft an additive **0.2 candidate** covering Themes A–D only (fields above); keep `schema_gaps` for anything else.
4. Resolve **book_id alias map** before more merges (blocks clean catalog joins more than gap themes do).
5. After 0.2 candidate text exists, decide:
   - **CONTINUE** remaining books on 0.1 and migrate later, or
   - **ADJUST** prompt + schema to 0.2 before remaining-book scale-up.
6. Keep automated validation **NOT RUN** as documented debt; structural audit packs remain the integrity gate.

---

## 8. Open questions for owner

1. Prefer **activity `sub_feature_type`** (lean) vs a dedicated reflection/SEL array for Think–Feel–Grow / Think Big?
2. Is `units[].inquiry_question` enough for Reach Higher Big Question, or do you want a first-class component type?
3. For long RH readings: require **full continuous_text** in Phase 1, or allow structured summary + page anchors when full recitation is impractical?
4. When should 0.2 land relative to BH1 canonical merge — before, after, or parallel?

---

## 9. Next docs / code follow-ups (not done in this draft)

- [ ] Owner answers §8 → lock or reject additive fields (possible future decision entry).
- [ ] If accepted: patch [`JSON_Schema.md`](./JSON_Schema.md) + [`Google_AI_Studio_Prompt.md`](./Google_AI_Studio_Prompt.md) for 0.2.
- [ ] book_id alias map / merge-time normalization.
- [ ] Update registry §13 “Schema Review” row from draft → COMPLETE when owner signs off.

---

## 10. Core review principle

> **Consistency without artificial uniformity.**

Cross-series success means shared arrays and IDs where pedagogy aligns, plus explicit gap/additive fields where publishers intentionally differ — not forcing Reach Higher into a Beehive lesson template (or the reverse).
