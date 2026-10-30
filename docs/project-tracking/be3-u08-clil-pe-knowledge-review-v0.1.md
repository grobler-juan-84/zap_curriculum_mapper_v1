# BE3 Unit 8 Content Connection / P.E. Knowledge Review v0.1

**Status:** CLIL-A STEP B APPLIED / VERIFIED / OWNER-ACCEPTED; CLIL-B/C AUTOMATED-ACCEPTED UNDER ADVANCE AUTHORIZATION
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner advance authorization for CLIL-A apply+verify and CLIL-B/C implementation with automated acceptance. Canonical SB/WB evidence remains authoritative.
**Implementation authorization:** Authorized isolated apply of `20261030170000` only, plus CLIL-B/C code. **No** additional migration, promotion, deployment, commit, or push is authorized by this update.

---

## 0. Hard boundary statements

- Trusted SB and WB canonicals were verified by size, SHA-256, and JSON parse. Neither canonical was modified.
- The historical CLIL brief’s missing-Workbook blocker is cleared by direct WB canonical verification.
- Automated evidence consistency replaces a separate human review under this authorization.
- Every future summary remains `hidden` / `experimental`. No SS link is proposed.
- Default serving for this relationship remains **`sb_only`**.
- CLIL-B (package/renderer) and CLIL-C (adapter/flag/overlay) are implemented and automated-accepted under advance authorization; flag default-off; undeployed.
- Live NLL after Step B is **5 / 44 / 44 / 6**. Migration `20261030170000` is recorded applied; history **24 / 0 / 0**.

---

## 1. Exact boundary

| Field | Value |
|---|---|
| Proposed component key | `be3-u08-clil-pe` |
| Title | Big English 3 Unit 8 Content Connection / P.E. |
| Relationship | `be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110` |
| Stable reference | `be3-sb-wb-u08-p134-135-wb109-110` |
| Student Book | pp.134–135 · `bep3_sb_p134`, `bep3_sb_p135` · Activities **13–18** |
| Workbook | pp.109–110 · `bep_3_wb_p109`, `bep_3_wb_p110` · Activities **11–14** + Think Big |
| Exact inventory | Six SB + five WB = **eleven** verified activities |
| Learning-spine role | Support / `reading_content` |
| Current packaging | `sb_only` (resolver companion View Workbook only; no CLIL SB→WB series handoff) |
| Deterministic UUID (unused at preflight) | `3e800008-0000-4000-8000-000000000005` |

### Explicit exclusions

No Grammar, Culture, Writing, Phonics, Values, Review, Language in Action, Story, Opener, adjacent pages, other units, or other books. Do not reconstruct excluded linked activities outside this membership.

---

## 2. Evidence and verification method

Step A used only trusted canonical and approved SS evidence:

1. SB canonical `data/phase1/big_english_3_sb/canonical/v1.json` — `938463` bytes / `3924fa23…67e6`
2. WB canonical `data/phase1/big_english_3_wb/canonical/v1.json` — `779981` bytes / `811deea2…04fa`
3. Approved SS-V2 `docs/SS_JSON_FILES NEW/BE3_SS.JSON` — `f6f756e1…bb5a`
4. CLIL transfer brief (boundary context only; WB blocker treated as historical)
5. Companion/resolver / learning-spine records and Experiment 14 (historical SB-only; not parity oracle)
6. Grammar/LiA knowledge + NLL migrations **only** for identifier, fingerprint, provenance, and record-shape conventions

Every eligible activity was checked for page identity, activity number, type, verification status, instruction, items/expected-answer boundaries, language frame, media flags, and isolation from adjacent pages. SB Activities **13–18** were reconfirmed from canonical rather than trusted from historical docs. WB pp.109–110 inventory was derived from the WB canonical.

### Verified source order

Publisher activity numbers establish order within each book; SB activities precede WB activities. Think Big follows WB Activity 14 on p.110.

| Position | activity_id | Source | Page | Publisher instruction |
|---:|---|---|---:|---|
| 1 | `bep3_sb_act_08_13` | SB | 134 | Read, guess, and choose. |
| 2 | `bep3_sb_act_08_14` | SB | 134 | Listen and read. What are the numbers 60, 12,000, 9, and 10? Then check your answers in 13. |
| 3 | `bep3_sb_act_08_15` | SB | 135 | Look at 14. Answer the questions in your notebook. |
| 4 | `bep3_sb_act_08_16` | SB | 135 | Complete the chart. Use the activities from the box. Then add more activities. |
| 5 | `bep3_sb_act_08_17` | SB | 135 | Work with a partner. Ask and answer the questions at the end of the article in 14. |
| 6 | `bep3_sb_act_08_18` | SB | 135 | Make an Exercise Chart for you. Show good activities and bad activities. Are you healthy and in shape? |
| 7 | `bep_3_wb_act_109_11` | WB | 109 | Read and complete. Use the words from the box. |
| 8 | `bep_3_wb_act_109_12` | WB | 109 | Read and circle. Then listen and check. |
| 9 | `bep_3_wb_act_110_13` | WB | 110 | Look at 12. Read and match. |
| 10 | `bep_3_wb_act_110_14` | WB | 110 | Complete the diagram. Add five more activities. |
| 11 | `bep_3_wb_act_110_tb` | WB | 110 | Read and choose. (Think Big) |

All eleven records are `human_verified` and belong only to the four accepted CLIL/P.E. pages. Each `activity_id` occurs exactly once in the combined SB+WB activity arrays.

Page context (not membership rows):

- SB p.134 heading **What Is a Calorie?** · section `Content Connection | P.E.` · `clil_pe`
- Continuous text `bep3_sb_text_08_03` (*What Is a Calorie?*, `reading_passage`, audio-dependent) on p.134
- WB p.109 heading **P.E. | Content Connection** · `clil_pe`

---

## 3. Canonical hashes, fingerprints, and source bindings

### File SHA-256

| Object | Path used for review | Size (bytes) | SHA-256 | Binding decision |
|---|---|---:|---|---|
| SB canonical | `data/phase1/big_english_3_sb/canonical/v1.json` | `938463` | `3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6` | Bind SB summaries to Storage path `big-english/big_english_3_sb/canonical/v1.json` |
| WB canonical | `data/phase1/big_english_3_wb/canonical/v1.json` | `779981` | `811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa` | Bind WB summaries to Storage path `big-english/big_english_3_wb/canonical/v1.json` |
| Approved SS-V2 | `docs/SS_JSON_FILES NEW/BE3_SS.JSON` | — | `f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a` | Reviewed; **no SS link proposed** |

### Activity fingerprints

Algorithm: stable recursively key-sorted JSON of the full canonical activity object (same `stableCanonicalJson` / `fingerprintCanonicalActivity` convention as NLL), SHA-256 over UTF-8 bytes.

| activity_id | activity_sha256 |
|---|---|
| `bep3_sb_act_08_13` | `e0ab565f885400b6274829fdacdcb492ce111e369b8611825cf055b1bb02b321` |
| `bep3_sb_act_08_14` | `04e43b12c5cd6ef7e01b0f2d7613db08ab1e3ddcb1136f8de480e58071b1c6fd` |
| `bep3_sb_act_08_15` | `e4e3a5848aeb91ecad6f4dbfbdb94018e58878e079a43003c4eb73ecb1eedfe5` |
| `bep3_sb_act_08_16` | `1d37a74a555e14b8066cba06e3939339b4c43efbc892dc3a6a72c0d681af4cd3` |
| `bep3_sb_act_08_17` | `15aa2f5b907715e7223a0c8a17af5245485071077e8c6b2d1a7d8587676b0a50` |
| `bep3_sb_act_08_18` | `c7ab978e2ee7ac872bb79bbbd908f89f8b29f699fd8f42300b4cbf4ca4e97948` |
| `bep_3_wb_act_109_11` | `f5b92d0de13c0b30c51a0f082d8744676e4c916a17a6f98992723a18bf03c653` |
| `bep_3_wb_act_109_12` | `ecfd8e6833722077033ba0f1bd4a450a287a8bc81a7fba2d8c80c44fc549ed62` |
| `bep_3_wb_act_110_13` | `4526d0eb5ad95c9ec8f84a08c26d00b539a94c21a678ad12772fea2e40fee13f` |
| `bep_3_wb_act_110_14` | `39f62325f7434edf449866a03594fd76a7da09f959e21adb201314e033f18495` |
| `bep_3_wb_act_110_tb` | `76c7285c24aefc477fce094858cc82790b3f88c33cc2c4329ec777e74a90ca03` |

---

## 4. Record-by-record evidence review

`evidence_status = sufficient` means the verified record supports the narrow teacher-friendly action summary. It does **not** authorize inventing calorie figures, science/health claims, unsupported good-food/bad-food framing, audio wording, answer-key dumps, diagram/visual reconstruction, or excluded linked activities. Membership ≠ selection; zero/partial selection must remain honest.

### 4.1 `bep3_sb_act_08_13` — SB p.134 Activity 13

- **Type:** `reading_prediction` · **Keyed** two-item prediction
- **Evidence:** Instruction *Read, guess, and choose.*; two verified choice prompts about exercise amount and energy use; no media dependency.
- **Proposed summary:** Students read, guess, and choose answers to two warm-up questions about exercise amount and which activity uses more energy.
- **evidence_status:** `sufficient`
- **Boundary note:** Summary does not dump the keyed choices as teaching claims.

### 4.2 `bep3_sb_act_08_14` — SB p.134 Activity 14

- **Type:** `listen_and_read_clil` · **Keyed** article/number identification
- **Evidence:** Audio track **157**; instruction to identify what 60, 12,000, 9, and 10 mean and check Activity 13; expected-answer boundary present for book-check only; article `bep3_sb_text_08_03` on p.134.
- **Proposed summary:** Students listen to Audio 157 and read the article to identify what the numbers 60, 12,000, 9, and 10 mean, then check their Activity 13 answers.
- **evidence_status:** `sufficient`
- **Boundary note:** Does not invent audio wording or paraphrase calorie figures beyond the verified number-identification task.

### 4.3 `bep3_sb_act_08_15` — SB p.135 Activity 15

- **Type:** `reading_comprehension_questions` · **Keyed** five questions
- **Evidence:** Instruction *Look at 14.*; five verified comprehension items whose answers depend on the Activity 14 article; no media dependency.
- **Proposed summary:** Students answer five comprehension questions about the Activity 14 article in their notebooks.
- **evidence_status:** `sufficient`
- **Boundary note:** Preserves the 14→15 dependency; does not dump answer keys or invent science claims.

### 4.4 `bep3_sb_act_08_16` — SB p.135 Activity 16

- **Type:** `categorization_chart` · **Keyed** chart columns + open “add more”
- **Evidence:** Publisher columns *Good for your body* / *Bad for your body*; word-box sorting; then add more activities; no media dependency.
- **Proposed summary:** Students complete a two-column body-activity chart using the word-box activities, then add more activities.
- **evidence_status:** `sufficient`
- **Boundary note:** Uses publisher activity-chart framing only; does not invent good-food/bad-food claims.

### 4.5 `bep3_sb_act_08_17` — SB p.135 Activity 17

- **Type:** `pair_discussion` · **Open** discussion
- **Evidence:** Instruction to ask/answer questions at the end of the article in 14; prompt *How much exercise do you do?*; no media dependency; no expected answers.
- **Proposed summary:** Students work with a partner to ask and answer the questions at the end of the Activity 14 article.
- **evidence_status:** `sufficient`

### 4.6 `bep3_sb_act_08_18` — SB p.135 Activity 18

- **Type:** `project` · **Open** project
- **Evidence:** Make an Exercise Chart; publisher good/bad activities wording; verified language frame; `visual_dependency=true`.
- **Proposed summary:** Students make a personal Exercise Chart of good and bad activities, using the verified language frame.
- **evidence_status:** `sufficient`
- **Boundary note:** Relies on, but does not reconstruct, the Exercise Chart visual.

### 4.7 `bep_3_wb_act_109_11` — WB p.109 Activity 11

- **Type:** `cloze_fill_in` · **Keyed** six gaps
- **Evidence:** Word box note (`active, activities, energy, measure, put on weight, watching TV`); six verified gap items; no media dependency.
- **Proposed summary:** Students complete a six-gap calorie text using the words from the box.
- **evidence_status:** `sufficient`
- **Boundary note:** Does not dump cloze answers.

### 4.8 `bep_3_wb_act_109_12` — WB p.109 Activity 12

- **Type:** `read_circle_and_listen` · circle + audio check
- **Evidence:** Ten circle prompts; **expected answers absent** in canonical; `audio_dependency=true`; note *Audio track 158 required to check.*
- **Proposed summary:** Students read and circle choices in a calorie passage, then listen to Audio 158 to check.
- **evidence_status:** `sufficient`
- **Boundary note:** Does not invent circled answers or audio wording.

### 4.9 `bep_3_wb_act_110_13` — WB p.110 Activity 13

- **Type:** `matching` · **Keyed** five matches
- **Evidence:** Instruction *Look at 12.*; five verified sentence-half matches; no media dependency.
- **Proposed summary:** Students look at Activity 12 and match five sentence halves about calories and activity.
- **evidence_status:** `sufficient`
- **Boundary note:** Preserves 12→13 dependency; does not dump match keys as teaching claims.

### 4.10 `bep_3_wb_act_110_14` — WB p.110 Activity 14

- **Type:** `venn_diagram_classification` · classification + open additions
- **Evidence:** Inside / Inside or Outside / Outside diagram; listed activity set in prompt; add five more; `visual_dependency=true`.
- **Proposed summary:** Students complete the Inside / Outside / Inside or Outside activity diagram and add five more activities.
- **evidence_status:** `sufficient`
- **Boundary note:** Does not invent diagram layout beyond the verified classification labels.

### 4.11 `bep_3_wb_act_110_tb` — WB p.110 Think Big

- **Type:** `read_and_choose` · **Keyed** Think Big choices
- **Evidence:** Three either/or healthy-habit prompts with verified expected choices; no media dependency.
- **Proposed summary:** Students complete the Think Big healthy-choice prompts by choosing one option in each pair.
- **evidence_status:** `sufficient`
- **Boundary note:** Does not dump the three choices as unsupported health doctrine.

---

## 5. Media and dependency matrix

| activity_id | Audio | Visual / diagram | Article / text | Calculation | Project | Think Big | Cross-activity |
|---|---|---|---|---|---|---|---|
| `bep3_sb_act_08_13` | — | — | prediction before article | — | — | — | Checked by 14 |
| `bep3_sb_act_08_14` | Audio **157** | — | `bep3_sb_text_08_03` | number ID task uses publisher figures only | — | — | Checks 13 |
| `bep3_sb_act_08_15` | — | — | depends on 14 article | — | — | — | Look at 14 |
| `bep3_sb_act_08_16` | — | chart (text) | — | — | partial open add | — | — |
| `bep3_sb_act_08_17` | — | — | questions at end of 14 | — | — | — | Article in 14 |
| `bep3_sb_act_08_18` | — | Exercise Chart visual | — | — | project | — | — |
| `bep_3_wb_act_109_11` | — | — | cloze text | — | — | — | — |
| `bep_3_wb_act_109_12` | Audio **158** | — | circle passage | — | — | — | Basis for 13 |
| `bep_3_wb_act_110_13` | — | — | — | — | — | — | Look at 12 |
| `bep_3_wb_act_110_14` | — | Venn/diagram visual | — | — | open add-five | — | — |
| `bep_3_wb_act_110_tb` | — | — | — | — | — | Think Big | — |

Selection honesty requirements for future CLIL-B:

- If Activity 14 is deselected, do not reconstruct Audio 157 / article wording from summary alone.
- If Activity 15 or 17 is selected without 14, preserve partial/zero honesty rather than inventing the article.
- If Activity 12 is deselected, Activity 13’s “Look at 12” dependency remains explicit.
- Project / diagram / Exercise Chart visuals are dependencies, not reconstructible content.
- Never dump answer keys into teacher-facing rendered artifacts beyond evidence-backed task framing.

---

## 6. Proposed SS links

SS authority is the approved SS-V2 object (`f6f756e1…bb5a`). Unit 8 is **Healthy Living**.

### Decision: **no SS link**

| Candidate | Reason withheld |
|---|---|
| CLIL/Culture (`column_order` 3) | Category cell combines **P.E.: Keeping healthy** with **Around the World: Strange sports**. A category-level link would conflate this Content Connection / P.E. component with excluded Culture pages. Not defensible as an exact component-level locator. |
| Vocabulary | Unit Vocabulary is broader healthy-living phrase inventory (Opener/LiA territory), not a clean P.E. calorie/content-connection locator. |
| Structures | Past-simple Structures are Grammar/LiA territory, not this reading/content component. |
| I can... | *…talk about healthy and unhealthy habits* is thematically related but not uniquely component-level for this CLIL spread; do not force to match LiA/Grammar shape. |
| Values | *Get exercise.* is adjacent Values language, not the Content Connection / P.E. curriculum locator. |

All SS links remain **unproposed**. Local Step B inserts **zero** `nll_ss_component_links` rows.

---

## 7. Exact proposed NLL summary payloads (design / local Step B)

All preferred v1 summaries: `evidence_status=sufficient`, `display_status=hidden`, `review_state=experimental`, `is_preferred=true`.

| summary id | activity_id | summary_text |
|---|---|---|
| `big_english_3_sb_unit_08_activity_13_summary_clil_a_v1` | `bep3_sb_act_08_13` | Students read, guess, and choose answers to two warm-up questions about exercise amount and which activity uses more energy. |
| `big_english_3_sb_unit_08_activity_14_summary_clil_a_v1` | `bep3_sb_act_08_14` | Students listen to Audio 157 and read the article to identify what the numbers 60, 12,000, 9, and 10 mean, then check their Activity 13 answers. |
| `big_english_3_sb_unit_08_activity_15_summary_clil_a_v1` | `bep3_sb_act_08_15` | Students answer five comprehension questions about the Activity 14 article in their notebooks. |
| `big_english_3_sb_unit_08_activity_16_summary_clil_a_v1` | `bep3_sb_act_08_16` | Students complete a two-column body-activity chart using the word-box activities, then add more activities. |
| `big_english_3_sb_unit_08_activity_17_summary_clil_a_v1` | `bep3_sb_act_08_17` | Students work with a partner to ask and answer the questions at the end of the Activity 14 article. |
| `big_english_3_sb_unit_08_activity_18_summary_clil_a_v1` | `bep3_sb_act_08_18` | Students make a personal Exercise Chart of good and bad activities, using the verified language frame. |
| `big_english_3_wb_unit_08_p109_activity_11_summary_clil_a_v1` | `bep_3_wb_act_109_11` | Students complete a six-gap calorie text using the words from the box. |
| `big_english_3_wb_unit_08_p109_activity_12_summary_clil_a_v1` | `bep_3_wb_act_109_12` | Students read and circle choices in a calorie passage, then listen to Audio 158 to check. |
| `big_english_3_wb_unit_08_p110_activity_13_summary_clil_a_v1` | `bep_3_wb_act_110_13` | Students look at Activity 12 and match five sentence halves about calories and activity. |
| `big_english_3_wb_unit_08_p110_activity_14_summary_clil_a_v1` | `bep_3_wb_act_110_14` | Students complete the Inside / Outside / Inside or Outside activity diagram and add five more activities. |
| `big_english_3_wb_unit_08_p110_think_big_summary_clil_a_v1` | `bep_3_wb_act_110_tb` | Students complete the Think Big healthy-choice prompts by choosing one option in each pair. |

Provenance generation prompt version: `clil-a-step-a-knowledge-prep-v0.1`.

---

## 8. Read-only live preflight (2026-10-30)

Project: `kivvmobjphtcgxoltqbc` (service-role read-only counts; no credentials printed).

| Check | Result |
|---|---|
| NLL totals | **4 / 33 / 33 / 6** (match) |
| Opener / Story / LiA / Grammar identities | Unchanged (exact draft identities) |
| `be3-u08-clil-pe` / UUID `…000005` | Absent |
| Proposed membership activities already assigned | None |
| Proposed summary IDs / `(activity_id, version=1)` / preferred slots | No collisions |
| Proposed SS-link identities/tuples | N/A (zero links); UUID `…000501` also absent |
| Migration history before adding local CLIL migration | **23 recorded / 0 pending / 0 remote-only** (all local↔remote matched through `20261030160000`) |

No database or Storage mutation occurred during preflight.

---

## 9. Local Step B preparation (not applied)

| Field | Value |
|---|---|
| Migration | `supabase/migrations/20261030170000_seed_nll_be3_u08_clil_pe.sql` |
| Component | one draft `be3-u08-clil-pe` |
| Memberships | eleven ordered rows |
| Summaries | eleven preferred v1 hidden/experimental |
| SS links | **zero** |
| Pre-application baseline asserted | **4 / 33 / 33 / 6** |
| Intended post-application totals | **5 / 44 / 44 / 6** |
| Focused static suite | `scripts/tests/nllBe3U08ClilPeSeedStepB.test.ts` |

Ordinary inserts only. No `ON CONFLICT`, updates, deletes, schema/RLS/policy/grant, or Storage operations. Application remains a separate exact authorization gate.

---

## 10. Automated acceptance record

| Gate | Result |
|---|---|
| SB/WB size + SHA-256 + JSON parse | Pass |
| Exact inventory 6 SB + 5 WB = 11 | Pass |
| Fingerprints recomputed | Pass |
| Conservative evidence sufficiency | Pass (all 11 `sufficient`) |
| SS link decision | Pass — **no link** |
| Live collision/baseline preflight | Pass |
| Local migration + static suite prepared | Pass |
| Migration applied | **No** |
| CLIL-B/C started | **No** |

**Verdict:** `CLIL-A KNOWLEDGE ACCEPTED UNDER ADVANCE AUTHORIZATION / STEP B PREPARED LOCALLY / NOT APPLIED`

---

## 11. Explicit non-actions

This record does **not** authorize applying the CLIL migration, non-dry-run database push, migration-history repair, CLIL-B/C implementation, promotion, deployment, commit, or push of CLIL work.
