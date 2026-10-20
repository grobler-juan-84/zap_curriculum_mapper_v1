# Operational Pilot Preflight — BE3 Unit 8 Grammar SB pp. 136–137 (v0.1)

**Status:** SOURCE PREFLIGHT / **NOT A HANDOFF** / **NOT AUTHORIZED TO GENERATE**  
**Date:** 2026-10-19  
**Pilot type:** First **operational** Chalkie pilot (provisional workflow from Experiments 1–9) — distinct from experimental transfer tests Exp 7–9  
**Owner proposal (until verified):** Big English 3 · Unit 8 · Grammar · Student Book printed **pp. 136–137**  
**Workflow reference:** [`chalkie-experiments-1-9-evidence-synthesis-v0.1.md`](./chalkie-experiments-1-9-evidence-synthesis-v0.1.md) · [`chalkie-provisional-handoff-template-v0.1.md`](./chalkie-provisional-handoff-template-v0.1.md)

---

## 1. Status and boundaries

| Bound | Statement |
| --- | --- |
| This document | Source preflight only |
| Handoff / outlines / vocab chips | **Not drafted** |
| Chalkie generation | **Not authorized** |
| Methodology lock | **No** |
| Classroom / product claims | **No** |
| D018 / Arm B2 / V2b | **Unchanged** |
| `4-decisions.md` | **Not modified** |

---

## 2. Verified target identity

| Owner proposal | Verified |
| --- | --- |
| Big English 3 | Catalog `big_english_3_sb` (registry BE3-SB) — **confirmed** |
| Unit 8 | `big_english_3_sb_unit_08` · title ***Healthy Living*** · theme health / habits / exercise / past actions · printed **128–143** · `human_verified` — **confirmed** |
| Grammar · SB pp. 136–137 | Both pages `section_title` / `page_heading` **Grammar** · `section_type` **grammar** · unit_id Unit 8 — **confirmed** |

**Corrected / clarified identity (use this going forward):**

> Big English 3 · Unit 8 · ***Healthy Living*** · Student Book **Grammar** printed **pp. 136–137** (`bep3_sb_p136` / `bep3_sb_p137`).

| Mapping | Value |
| --- | --- |
| Printed → PDF | **136 → `pdf_page` 134** · **137 → `pdf_page` 135** |
| Component | `bep3_sb_comp_08_06` · grammar · title **grammar (They came, and we played.)** · `page_id` `bep3_sb_p136` · `human_verified` |
| Page flags | p.136: instructional · visual_dependency **true** · audio_dependency **true** · `human_verified` · p.137: instructional · visual/audio dependency **false** · `human_verified` |

**Adjacent Unit 8 grammar:** Language in Action **pp. 132–133** hosts `Did…?` past questions (`bep3_sb_lang_08_01` / `08_02`). Content Connection P.E. **pp. 134–135** is calorie/CLIL only — regular/irregular past grammar-box rows (`bep3_sb_lang_08_03` / `08_04`) belong on this Grammar spread (**p.136**), not on the CLIL pages.

---

## 3. Evidence inventory

| Layer | Source | Status |
| --- | --- | --- |
| **[SB] canonical** | `data/phase1/big_english_3_sb/canonical/v1.json` | Pages, activities, component, unit — **human_verified** |
| **Source PDF** | `app/src/assets/books/big-english/big_english_3_sb.pdf` | Present locally; identity rests on canonical printed↔pdf mapping (not OCR) |
| **[SS]** | `data/phase1/big_english_3_sb/canonical/ss_v1.json` Unit 8 *Healthy Living* (SB pp. 128–143) | Structures include *They walked.* / *She saw a film.* / past *Did…?* — unit-level companion only |
| Language entities on pp.136–137 | `bep3_sb_lang_08_03` / `08_04` grammar_pattern rows on `bep3_sb_p136` | Plus activity-derived past-verb pairs and component title |

**Not used:** Phase 2 BI; `[HM]`; invented Track 159 wording; Workbook.

---

## 4. Page-by-page content table

### Printed p.136 — Grammar (`bep3_sb_p136`)

| Act | Instruction (verified) | Notes / dependencies |
| --- | --- | --- |
| **19** | Look, listen, and read. How did Donna's dad come home? | Audio **Track 159**; visual; expected answer recorded in canonical: *He came home on his bicycle / by bike.* — **do not invent** track script; treat keyed answer as book-check only |
| **20** | Copy the chart in your notebook and complete. Use the words from the box. | Regular past **spelling classification** (`started` / `cried` / `liked` / `stopped` pattern groups); word box: bake, carry, change, climb, cry, drop, exercise, finish, help, join, love, tip, try, worry; no audio |

### Printed p.137 — Grammar (`bep3_sb_p137`)

| Act | Instruction (verified) | Notes / dependencies |
| --- | --- | --- |
| **21** | Read and complete. | Gap-fill past forms in short texts (Ffyona Campbell / Okan Kaya); answers include *traveled / travelled* dual spelling |
| **22** | Read and match. | Base → irregular past: go/went, come/came, have/had, sleep/slept, fall/fell, write/wrote, fly/flew, put/put |
| **23** | Tell your partner about what you did yesterday. | Pair speaking; model frame in canonical: *Yesterday, I woke up early and walked to school.* / *Yesterday, I went to the park after school. I played soccer.* |

**No sticker / cutout dependency** recorded for these pages.

---

## 5. Grammar and communicative targets

| Target | Evidence |
| --- | --- |
| Regular past simple spelling/forms (-ed / -ied / -d / double consonant + -ed) | Act 20; p.134 box note *start→started, cry→cried, like→liked, stop→stopped*; `[SS]` *They walked.* |
| Irregular past forms | Act 19 *came*; Act 22 set; Act 23 *went / woke*; p.134 box *went / saw / came*; `[SS]` *She saw a film.* |
| Communicative purpose | Talk about completed past actions / what someone did yesterday (Act 23; unit I can… *ask and answer about activities in the past*) |

**Not the focus of these pages:** *Did…? / did / didn't* LiA (pp. 132–133) — prior Unit 8 practice only.

---

## 6. Vocabulary and prerequisite analysis

| Set | Role for this pilot |
| --- | --- |
| Unit 8 healthy-living phrases (p.128) | **Not** required as new scoped teaching for Grammar 136–137 |
| CLIL calorie / culture sports vocab (p.134 / p.138) | **Exclude** as scoped chips |
| Act 20 verb box (base forms for regular past) | **Activity-specific** — core for p.136 spelling work |
| Act 21 narrative verbs (work, move, live, travel, walk, complete, play, last, stop) | **Activity-specific** regular past practice |
| Act 22 irregular pairs | **Activity-specific** irregular set |
| Act 23 model verbs (wake, walk, go, play) | Support for speaking; may overlap Act 22 |
| Prerequisite | Retrieve regular/irregular past **exposure** from Unit 8 LiA / p.134 boxes without teaching CLIL or LiA pages |

**Spelling:** Prefer **SB AmE** page forms where dual (*traveled*); do not force SS BrE (*film* / *fit* variants) into chips. Act 21 explicitly allows traveled/travelled.

**Pilot vocab risk:** Verb lists are large if dumped whole. Future handoff must use **smallest justified per-lesson chips** (Exp 8–9 lesson), not the full unit glossary.

---

## 7. Audio, visual and answer-key dependencies

| Dependency | Detail | Safe handling |
| --- | --- | --- |
| Track **159** | Act 19 required | Official audio only; no invented script |
| Visuals | Act 19 dialogue scene | Direct teacher to book; no fake stickers |
| Answer keys | Acts 19–22 have canonical expected answers | Do **not** present invented keys as publisher text; book work + official audio resolve them |
| Unknown from evidence | Exact Track 159 wording / dialogue lines beyond the comprehension question | Cannot safely reconstruct — **gap** |

---

## 8. Explicit inclusions and exclusions

### In scope (floor)

- SB Grammar **pp. 136–137** only · Acts **19–23** · regular past spelling + irregular past forms + yesterday speaking · Track **159** as teacher-directed official audio.

### Exclude

- LiA **pp. 132–133** as teaching pages (optional brief *Did…?* retrieve only).
- CLIL P.E. **pp. 134–135** as teaching pages (grammar-box retrieve only).
- Culture **138–139**, Writing **140**, Phonics **141**, Values **142**, Review **143**.
- Any Workbook; BI; `[HM]`; Unit 3 / other-unit content.
- Invented Track 159 scripts, dialogue lines, or answer keys presented as publisher text.
- Full healthy-living / CLIL / culture vocabulary dumps.

---

## 9. Two-lesson suitability assessment

| Setting | Fit |
| --- | --- |
| Two lessons · ~25 slides · ~40 min incl. SB work | **Yes** — five activities + two grammar foci + speaking; comparable load to Exp 7–9 LiA spreads |
| Grade 3 / ability Grade 2 · Chalkie Default · Simple · Audio OFF | **Yes** — matches provisional workflow defaults; textbook audio remains teacher-directed |
| One page ≠ one lesson assumption | **Avoided** — split by grammar focus + page load, not by rote page count |

**Risks**

| Risk | Assessment |
| --- | --- |
| Insufficient content for two lessons | Low — Acts 19–23 + speaking |
| Too many grammar targets | Medium — regular spelling rules **and** irregular set; manageable if L1/L2 split is explicit |
| Unavailable official audio/visuals | Medium — Track 159 unknown wording; mitigated by official-audio-only rule |
| Inventing publisher wording/answers | High temptation on Acts 19–22 — must enforce safeguards |
| Excessive / overlapping vocab chips | High if full verb boxes dumped both lessons — apply per-lesson allocation |
| Late book work | Known Chalkie tendency (Exp 9) — outlines must protect early SB time |

---

## 10. Smallest justified L1/L2 allocation (if suitable)

| Lesson | Focus | Book work |
| --- | --- | --- |
| **1 — Introduce** | Regular past forms/spelling; support **p.136** Acts **19–20** | Protected SB **p.136** + official **Track 159** |
| **2 — Practise** | Irregular past + yesterday speaking; support **p.137** Acts **21–23**; light recycle of regular past | Protected SB **p.137** |

**Vocab chips:** not selected in this preflight. Future handoff must allocate **separately** (e.g. L1 = Act 20 base verbs needed for spelling teaching; L2 = Act 22 irregular bases/pasts + minimal speaking support) — no identical combined dump.

---

## 11. Blocking questions or evidence gaps

1. Exact **Track 159** dialogue wording — unavailable; keep out of any prompt.  
2. No dedicated `language` rows on pp.136–137 — frames taken from activities + p.134 boxes + Act 23 models.  
3. Act 21 **traveled/travelled** — lock AmE preference in a later handoff unless owner chooses otherwise.  
4. Whether owner wants any explicit *Did…?* retrieve beat (out of page scope) — default **no** unless requested.

None of these block a design draft; they constrain generation safeguards.

---

## 12. Preflight verdict

### CONDITIONALLY SUITABLE

**Why suitable:** Identity matches owner proposal; both pages are verified Unit 8 Grammar; activity load supports two ~40-minute lessons with genuine SB work; communicative Act 23 present; provisional workflow settings fit.

**Conditions:**

1. Treat as **operational pilot** under Exp 1–9 workflow — not a new transfer experiment.  
2. Enforce official **Track 159** only; no invented scripts/keys.  
3. Explicit L1 regular / L2 irregular (+ speaking) allocation; **per-lesson** vocab chips.  
4. Retrieve prior past exposure without teaching LiA 132–133 or CLIL 134–135.  
5. Protect early textbook time; mark generated examples `[SUPPLEMENTARY]`.

---

## Smallest next action

**Done:** Handoff design drafted — [`chalkie-operational-pilot-be3-u08-grammar-p136-137-handoff-design-v0.1.md`](./chalkie-operational-pilot-be3-u08-grammar-p136-137-handoff-design-v0.1.md) (DRAFT / not authorized to generate). **Next:** owner review/approve before any Chalkie run.
