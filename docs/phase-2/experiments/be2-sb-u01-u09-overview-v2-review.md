# BE2-SB U1–9 Overview — v2 Review Bundle

**Date:** 2026-10-13  
**Experiment:** D017 second pass (`P2-EXP-BE2-SB-BOOK-OVERVIEW-D017-v2`)  
**Artifacts:** [v1 (preserved)](./be2-sb-u01-u09-book-overview-d017-v1.md) · [v2 candidate](./be2-sb-u01-u09-book-overview-d017-v2.md)  
**Status:** EXPERIMENTAL review package — **not** acceptance; D017 LOCKED; D018 remains PROPOSED

**Inputs used**
- Primary evidence: `data/phase1/big_english_2_sb/canonical/v1.json`
- Publisher benchmark: `C:\Users\ADMINPC\Downloads\BE2-Curriculum-Scope-and-Sequence.pdf` (image-based; transcribed for comparison)

---

## 1. v1 vs v2 summary

| Aspect | v1 | v2 |
|---|---|---|
| Columns | 5 content cols + combined Supporting Curriculum | **8 columns** (CLIL/Culture, Values, Phonics split out) |
| U3 old/new | Mentioned only as “CLIL museum/old–new” in supporting cell | Explicit in **CLIL/Culture** and **Learning Outcomes** |
| U6 timekeeping variants | “CLIL history of timekeeping” compressed | Explicit **different ways of telling time** + device examples |
| U8 habitats | “CLIL habitats” compressed; habitat words soft in vocab | Habitat set in **Vocabulary**; explicit habitat outcome |
| Learning Outcomes | Mostly language-core; often missed publisher’s CLIL/values-facing I Can | Three concise outcomes/unit aligned to language + CLIL + values *meaning*, still **AI-inferred** |
| Acceptance | Not accepted | Still **not accepted / not production-ready** |

**Intent of v2:** keep beauty-in-simplicity density; fix genuine Phase 2 omissions that Phase 1 already supports; improve teacher scan of supporting curriculum without inventing publisher content.

---

## 2. Publisher comparison (meaningful coverage)

### Method

- Compared all nine units against publisher Scope and Sequence columns: Vocabulary, Structures, CLIL/Culture, Values, Phonics, I Can.
- “Communicative Functions” is a Phase 2 interpretive column (publisher has no separate Functions column) — scored by whether language uses match Structures + I Can intent.
- Counted **meaningful** coverage only (same idea OK if wording differs).
- Did **not** copy publisher text into v2 unless Phase 1 evidence already supports the claim.
- Target: ~**90%** meaningful coverage as a **review target only** (not a locked production threshold).

### Overall judgment

| Dimension | Meaningful coverage (AI-assessed) | Notes |
|---|---:|---|
| Vocabulary (core lists) | ~95% | Core unit lists match; CLIL/culture/values words intentionally thinner in Vocab column (shown under CLIL/Culture or Values) |
| Grammar / Structures | ~95% | All publisher structure families present; harmless example wording differs |
| Communicative Functions | ~90% | Derived from Phase 1 `language.function`; aligns with Structures + I Can uses |
| CLIL / Culture | ~95% | Topics and values of each connection match publisher labels |
| Values | ~100% | Same nine value titles |
| Phonics | ~100% | Same targets (`th`; `ng,nk`; `oo`; `ai,oa`; `ar,er,or`; `ch,tch,sh`; `ee,ie`; `ou,ow`; Alphabet) |
| Learning Outcomes (meaning vs I Can) | ~90% after v2 | See §3; v1 was weaker on CLIL/values-facing outcomes |
| **Combined meaningful coverage** | **~92%** | Meets ~90% review target for this experiment |

### Meaningful omissions (still)

| Item | Type | Severity | Notes |
|---|---|---|---|
| Exact publisher I Can wording | Phase 1 extraction gap | Soft | Blocks exist (page notes) but sentences not extracted — outcomes cannot be labeled publisher-stated |
| Some CLIL/culture wordlists (e.g. full U3 culture household list, full U7 fruit-origin list) | Condensation | Harmless | Topics covered; exhaustive word dump avoided on purpose |
| Checkpoint / Exam Prep / Starters / Wordlist / Song / Cutouts | Scope | Out of scope | Publisher lists them outside Units 1–9 rows |
| Finer clock language (half past / quarter) | Not in publisher vocab row *or* Phase 1 core | None | Publisher U6 vocab is o’clock only; “different ways” = historical devices |

### Unsupported additions (avoid / none material)

| Candidate | Verdict |
|---|---|
| Invented half-past / digital-vs-analog clock outcomes | **Not added** (would be unsupported inflation) |
| Copied publisher I Can as Phase 1 quotes | **Not done** — outcomes remain AI-inferred |
| Extra grammar families beyond Phase 1 language rows | **None material** |

Harmless differences (not counted as omissions): example sentences, column packing, “Communicative Functions” label vs publisher Structures examples.

### Flagged U3 / U6 / U8 check

| Flag | Publisher I Can / CLIL | Phase 1 evidence? | v1 | v2 |
|---|---|---|---|---|
| U3 old/new objects | I Can: talk about new and old objects; CLIL History | Yes — CLIL + vocab + text `bep2_p042` | Under-emphasized | Corrected |
| U6 different ways of telling time | I Can + CLIL History timekeeping | Yes — sundial/candle/hourglass/water clock | Under-emphasized | Corrected |
| U8 animal habitats | I Can: where animals live; CLIL Science habitats | Yes — CLIL + habitat vocab `bep2_p134` | Under-emphasized | Corrected |

These were **Phase 2 interpretation omissions**, not Phase 1 extraction gaps.

---

## 3. Learning Outcomes consistency assessment

### Recurring pattern (v1)

Publisher I Can statements typically cover **three strands** per unit:

1. Core language use  
2. CLIL / content connection  
3. Values (or culture-adjacent) self-check  

v1 outcomes usually captured strand 1 well, and often **under-represented strands 2–3** (especially U3/U6/U8, and partly U2/U4/U5/U7/U9).

### Cause classification

| Cause | Finding |
|---|---|
| Phase 2 interpretation error | **Primary** for U3/U6/U8 flags — evidence already in Phase 1 components/vocab/text |
| Phase 1 extraction gap | **Exact I Can sentence text** missing across all nine review pages (notes only: “Includes 'I Can' self-assessment block”) |
| Evidence sufficient for meaning? | **Yes** for corrected outcomes — themes exist in CLIL/culture/values components even without I Can quotes |

### Upstream Phase 1 recommendation (no action taken)

If owner later wants outcomes labeled **publisher-stated** rather than AI-inferred:

1. Add a targeted extraction rule: capture review-page **I Can** checklist lines as structured text (or continuous_text with explicit `source_section_type=i_can`).
2. Keep this as an **optional evidence improvement** — not required to use the v2 overview as a teacher-facing Book Intelligence candidate.
3. **Do not** re-extract or change the Phase 1 prompt without explicit approval (not done in this pass).

### v2 outcome stance

- Kept outcomes **short, observable, AI-inferred**.
- Aligned meaning to publisher I Can where Phase 1 supports it.
- Did **not** paste publisher I Can strings into the overview as book evidence.

---

## 4. Boundaries respected

- D017 remains LOCKED; D018 remains PROPOSED.
- v1 artifact unchanged.
- No schema, database, API, or UI changes.
- No Workbook second pass; no Phase 3/4 expansion.
- v2 **not** marked accepted or production-ready.

---

## 5. Suggested owner next step

1. Review v2 table for teacher readability.  
2. If acceptable as the working Book Intelligence baseline, say so explicitly (still without schema lock).  
3. Optional soft follow-up: teacher-validation pass; then BE1→BE2→BE3 vertical sufficiency probe.
