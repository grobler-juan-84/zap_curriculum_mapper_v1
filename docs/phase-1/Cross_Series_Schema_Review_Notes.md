# Cross-Series Schema Review Notes (initial draft)

**Status:** ACTIVE  
**Version:** 0.2-draft  
**Date:** 2026-10-07  
**Schema under review:** Phase 1 JSON schema **0.1** ([`JSON_Schema.md`](./JSON_Schema.md))  
**Purpose:** First formal cross-series challenge of schema 0.1 using the Storage-backed pilot set, before large-scale remaining-book extraction.

**Related:** [`Dataset_registry.md`](./Dataset_registry.md) §13–14 · [`Extraction_Data_Specification.md`](./Extraction_Data_Specification.md) · brainstorming entry “Schema gaps before more books”

**Working recommendations:** Owner-accepted 2026-10-07 (§7). Schema version remains **0.1** until post-pilot evidence supports a 0.2 candidate.

---

## 1. Scope and evidence

| Registry ID | Series | Evidence used | Phase 1 |
|---|---|---|---|
| BH1 | Beehive 1 SB | Canonical v1 + whole-book audit **PASSED**; spot-sampled U01 + U05 gaps | **COMPLETE** |
| BE1-SB | Big English 1 SB | Canonical v1 (whole-book audit **PASSED**) | **COMPLETE** |
| BE2-SB | Big English 2 SB | Canonical v1 CREATED; unit batches verified; spot-sampled U01 | IN PROGRESS (audit pending) |
| RH2A | Reach Higher 2A | Units 1–4 verified; spot-sampled U01 (+ U04 structure) | IN PROGRESS (canonical pending) |

This is a **draft review**, not a schema bump. No LOCKED decision yet to change 0.1.

---

## 2. Executive verdict

**Schema 0.1 is good enough to continue pilot work** (canonical merges for BH1 / BE2-SB / RH2A, Validation, audits).

Do **not** pause for a schema rewrite. Do **not** invent a separate schema per series.

`schema_gaps` are **classification evidence**: they record structures that 0.1 does not model cleanly. They are **not** automatic candidates for universal schema expansion. Recurring structures should be classified as universal/common-core, series-specific, or book/source-specific (§7). A **0.2 candidate** is deferred until after the remaining pilot books are merged and audited, and only for changes with sufficient evidence.

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

**Implication:** Do not freeze a closed enum of `section_type` yet. Prefer controlled vocabulary guidance + allow series-local strings until mapping tables exist (Phase 2+). Within a series, prefer consistent labels where the structure recurs.

### 4.3 Identifier / naming drift (operational, high priority)

| Book | Catalog / folder `book_id` | Internal JSON `book_id` | Entity ID style |
|---|---|---|---|
| BH1 | `beehive_1_sb` | `beehive_1_sb` | aligned |
| BE1-SB | `big_english_1_sb` | `bep1_sb` | `bep1_unit_01`, `bep1_page_010` |
| BE2-SB | `big_english_2_sb` | `bep_sb_2` | `bep2_unit_01` |
| RH2A | `reach_higher_2a` | mixed `rh_2a` (U1–3) / `reach_higher_2a` (U4) | mixed |

**Implication:** Resolve an explicit **book_id alias map** before further canonical scaling. Stable identity affects storage, catalog joins, and future application architecture independently of curriculum schema design.

### 4.4 Continuous text depth

Reach Higher long readings are sometimes summarized rather than fully recited (documented open issues). Schema supports full text; extraction practice needs a clearer rule for long passages (full vs structured summary + page anchors). Treat as process/evidence policy, not an automatic schema change.

---

## 5. Schema-gap themes (clustered — classification evidence)

Registry counts: BH1 **8** · BE1-SB **1** · BE2-SB **0** · RH2A **5**.

Provisional scope labels below follow §7 classification. They do **not** mean “add to universal schema now.”

### Theme A — Values / SEL / reflective discussion

| Source | Evidence |
|---|---|
| BH1 | Recurring **Think, Feel, Grow** (e.g. U01 p.13, U05 p.65) tied to syllabus emotional well-being |
| BE1 | **Think Big** breakouts (canonical gap `bep1_gap_0101`) — higher-order thinking prompts attached to lessons |
| BE2 | Values/culture appear as components; no formal gap logged on U01 sample |
| RH2A | Inquiry/reflection via Big Question + Think and Respond activities (partially modelled as activities) |

**Provisional classification:** mixture — BH1 Think–Feel–Grow and BE Think Big look **series-specific** (related pedagogically, not identical); cross-series “reflection” as a shared abstract type is **not yet proven common-core**.

**If ever considered for 0.2 (post-pilot):** only with more within-series + cross-series recurrence evidence. Sketch options (not adopted): `activities[].sub_feature_type` vs a heavier `reflection_prompts[]` array.

### Theme B — Unit-level inquiry / Big Question

| Source | Evidence |
|---|---|
| RH2A | Unit Big Question drives opener → readings → wrap-up (`rh_2a_u01_gap_0001`) |

**Provisional classification:** **series-specific** (Reach Higher), unless later books show the same inquiry spine.

**If ever considered for 0.2 (post-pilot):** optional `units[].inquiry_question` is one sketch; keep as gap until recurrence justifies it.

### Theme C — Embedded reading checkpoints

| Source | Evidence |
|---|---|
| RH2A | In-text **Before You Continue / Preview / Predict** (`rh_2a_u01_gap_0002`) |

**Provisional classification:** **series-specific** for now; *possibly* universal later if other series embed mid-text reading prompts the same way.

**If ever considered for 0.2 (post-pilot):** `continuous_text[].checkpoints[]` is one sketch.

### Theme D — Source glossary / student-facing gloss

| Source | Evidence |
|---|---|
| RH2A | Page-foot simplified definitions (`rh_2a_u01_gap_0003`) |

**Provisional classification:** **series-specific** (or book/source-specific) until glosses appear as a recurring cross-series need.

**If ever considered for 0.2 (post-pilot):** optional `vocabulary[].source_gloss` is one sketch.

### Theme E — Non-gaps that look like gaps

| Pattern | Series | Notes |
|---|---|---|
| `audio_required` / `visual_verification_required` | All | Extraction issues, not schema failure |
| `missing_source` (workbook refs) | BH1 | Source availability / scope, not JSON shape |
| activity_type explosion | All | Free-text classification is OK for 0.1; normalize later |

---

## 6. BE2 as vertical check

BE2 Unit 1 shows the same Big English spine as BE1 (vocab → song/story → grammar → CLIL → culture/values → phonics → review) with **0 schema_gaps** on the sample unit.

**Implication:** Within-series vertical continuity looks healthy — prioritize consistent representation inside Big English (and similarly inside Beehive / Reach Higher) while preserving genuine level/book differences. Cross-series stress is dominated by Beehive SEL features and Reach Higher inquiry/reading scaffolds, not by the BE1→BE2 level hop.

---

## 7. Proposed working recommendations

**Owner-accepted 2026-10-07:**

1. Continue BH1 / BE2 / RH2A canonical merges and audits on schema 0.1.
2. Do not pause the pilot for a schema rewrite.
3. Treat current `schema_gaps` primarily as **classification evidence**, not automatic candidates for universal schema expansion.
4. During cross-series review, classify recurring structures as:
   - universal / common-core
   - series-specific
   - book / source-specific
5. Prioritize consistent representation **within a series** where a structure recurs, while preserving genuine differences between levels and books.
6. Resolve the **book_id alias map** before further canonical scaling because stable identity affects storage, catalog joins, and future application architecture independently of curriculum schema design.
7. After the pilot books are merged and audited, review schema 0.1 and create a **0.2 candidate only** for changes supported by sufficient evidence. Do not promote every observed schema gap into the universal schema.
8. Keep automated validation **NOT RUN** as documented debt; structural audit packs remain the current integrity gate.

---

## 8. Remaining open questions

Recommendations in §7 are accepted. Still useful to decide later (not blocking merges):

1. For long RH readings in Phase 1: require **full continuous_text**, or allow structured summary + page anchors when full recitation is impractical?
2. When building the post-pilot 0.2 candidate: what minimum recurrence threshold counts as “sufficient evidence” (e.g. N books in a series, or appearance in ≥2 series)?

---

## 9. Next docs / code follow-ups

- [x] Owner accepts working recommendations (§7).
- [x] book_id alias map / merge-time normalization (D007; BE1-SB canonical fields normalized).
- [x] Canonical merge + whole-book audit for BH1 on schema 0.1 (Phase 1 COMPLETE).
- [x] Canonical merge for BE2-SB on schema 0.1 (audit still pending).
- [ ] Canonical merge + audit for RH2A; BE2-SB whole-book audit.
- [ ] After those audits: draft 0.2 candidate **only** from gaps with sufficient evidence; patch [`JSON_Schema.md`](./JSON_Schema.md) + prompt if accepted.
- [ ] Update registry §13 “Schema Review” row when post-pilot schema review is signed off.

---

## 10. Core review principle

> **Consistency without artificial uniformity.**

Cross-series success means shared arrays and IDs where pedagogy aligns, series-consistent representation where structures recur inside a publisher line, and preserved `schema_gaps` (or later additive fields) where differences are genuine — not forcing Reach Higher into a Beehive lesson template (or the reverse), and not promoting every gap into the universal schema.
