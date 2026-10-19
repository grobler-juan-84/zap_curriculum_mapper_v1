# Chalkie Transfer Test — BE3 Unit 3 Language in Action pp. 40–41 (v0.1)

**Status:** DESIGN **APPROVED** · **GENERATED** (Experiment 8) · **QUALITATIVELY REVIEWED** — **PASS — strong qualitative transfer success** · further generation **not authorized**  
**Date:** 2026-10-19  
**Branch:** `phase-2`  
**Purpose:** Owner-gated transfer test of the provisional Chalkie handoff pattern on Big English 3 Unit 3 *Working Hard!* Language in Action (SB pp. 40–41). Generation and qualitative review recorded; not a D018 scored iteration; not a methodology lock.

**Target identity (owner-confirmed):** Big English **3** · Unit **3** · ***Working Hard!*** · Student Book Language in Action **pp. 40–41** (not BE2 *In My House*).

**Provisional handoff pattern under test (not locked):**

> Detailed initial curriculum handoff + concise teacher-controlled outline + explicit vocabulary selection.

**Evidence base:**  
[`chalkie-transfer-be3-u03-lia-p40-41-preflight-v0.1.md`](./chalkie-transfer-be3-u03-lia-p40-41-preflight-v0.1.md) ·  
[`chalkie-provisional-handoff-template-v0.1.md`](./chalkie-provisional-handoff-template-v0.1.md) ·  
[`chalkie-provisional-handoff-template-be2-u05-lia-retrofill-v0.1.md`](./chalkie-provisional-handoff-template-be2-u05-lia-retrofill-v0.1.md) ·  
[`chalkie-transfer-be2-u05-lia-p78-79-experiment-design-v0.1.md`](./chalkie-transfer-be2-u05-lia-p78-79-experiment-design-v0.1.md) ·  
[`chalkie-outline-context-retention-diagnostic-v0.1.md`](./chalkie-outline-context-retention-diagnostic-v0.1.md)

**Document structure note:** §§1–8 preserve the **pre-run design** (including the vocabulary entry actually used). §9 records **post-run** findings, including the vocabulary-allocation confound. Do not rewrite §§1–8 to erase that history.

---

## 1. Experiment question

> Does the Experiment 5/6/7 provisional handoff pattern transfer to Big English 3 Unit 3 *Working Hard!* Language in Action (Student Book pp. 40–41) — preserving topic/scope, instructional sequence, textbook integration, and provenance discipline — when the LiA spread carries **two** grammar foci (*have to / has to* on p.40; adverbs of frequency on p.41)?

| Fixed | Variable / under test |
| --- | --- |
| Chalkie **Lesson Series** · **2 lessons** · **25 requested slides per lesson** | New book/unit/pages: BE3-SB Unit 3 LiA **pp. 40–41** only |
| ≈ **40 minutes per lesson**, including real textbook work | New detailed initial handoff (§6) from verified preflight evidence |
| Framework **Chalkie Default** · Theme **Simple** | New concise teacher-controlled outlines (§7) with explicit L1/L2 grammar split |
| Grade **3** · English ability **Grade 2** · Audio **OFF** | Explicit manual vocabulary (§8) — **pre-run:** identical 12-item list both lessons (see §9.3 confound) |
| No BI / no `[HM]` / no Workbook / no invented publisher audio | Transfer fidelity vs Experiment 7 LiA success under a harder two-focus spread (§9) |
| One authorized generation run (Experiment 8 — completed) | Further regeneration not authorized |

**Not a D018 iteration.** Do not revise D018 scores, V2b status, Arm B2 scores, or lock methodology.

---

## 2. Verified evidence inventory

Drawn from the source preflight only. No invented publisher content.

| Layer | Source | Verification |
| --- | --- | --- |
| **[SB] canonical** | `data/phase1/big_english_3_sb/canonical/v1.json` | Unit `big_english_3_sb_unit_03` *Working Hard!* (printed **36–51**); pages `bep_sb_3_p40` / `bep_sb_3_p41` — section **Language in Action**, grammar_practice, **human_verified**; `pdf_page` **40** / **41** |
| **[SB] component** | Same | `big_english_3_sb_component_0004` — *Language in Action: have to & adverbs of frequency* |
| **[SB] language** | Same | p.40: `lang_0003`–`0005` (*we/she/I have to…*); prior unit *have to* on p.38 cited as retrieval only |
| **[SB] activities** | Same | p.40 Acts **8–10**; p.41 Acts **11–13** (all human_verified) |
| **[SB] vocabulary** | Same | p.36 chores (`vocab_0001`–`0008`); p.41 frequency (`vocab_0010`–`0013`) |
| **Source PDF** | Local `app/src/assets/books/big-english/big_english_3_sb.pdf` | Present; printed = `pdf_page` 40/41 |
| **[SS]** | Storage `big-english/big_english_3_sb/canonical/ss_v1.json` | Unit 3 *Working Hard!* (SB pp. 36–51): Chores + Adverbs of frequency; Structures including *have to* and frequency patterns |

**Spelling lock:** Use **SB AmE** page forms (*practice the piano*, *take out the trash*). SS BrE variants (*practise*, *rubbish*) are unit-level companion only — do not force into student-facing chips.

**Not used:** Phase 2 BI; `[HM]`; invented Track 51/53 scripts; Act 11 mistake keys; CLIL/culture/phonics dumps; activity-only phrases *do her homework* / *practice the guitar* (preflight: do not auto-add).

---

## 3. Exact scope — what pp. 40–41 require

### 3.1 In scope (floor)

**Unit:** Big English 3 · Unit 3 · *Working Hard!*  
**Pages:** Student Book **printed pp. 40–41** only  
**Section:** Language in Action  

| Page | Act | Instruction (verified) | Dependencies / notes |
| --- | --- | --- | --- |
| **40** | 8 | Listen and look at the sentences. Help Luke and Amy make more. | Official **Track 51**; word-bank: *study for a test, do the dishes, make my bed, take out the trash*; frames *What do we have to do? / We have to…* · *What does she have to do? / She has to…* |
| **40** | 9 | Follow the lines. What do they have to do? | Visual maze; *She/They have to…* |
| **40** | 10 | What about you? Ask and answer. | *What do you have to do? / I have to…* (open) |
| **41** | 11 | Listen to Alexia's week and find the three mistakes. | Official **Track 53** **required** for mistakes; visual schedule — **do not invent** mistake keys |
| **41** | 12 | Put the words in order. Then say. | Frequency + recycled *have to* |
| **41** | 13 | Look at the chart. Make sentences about Leo. Use *always, usually, sometimes, never*. | *Leo [adverb] [chore].* |

**Core language:**

- *What do we/you have to do? We/I have to + chore.*
- *What does he/she have to do? He/She has to + chore.*
- Frequency statements / questions with *always, usually, sometimes, never* + chore phrases.

**Communicative aim:** Students can ask/answer about chores with *have to / has to*, then talk about how often people do chores with frequency adverbs, completing SB pp. 40–41 with official audio where required.

### 3.2 Explicit exclusions

- Later Unit 3: CLIL Pocket Money (p.42+), Grammar *like/love/hate + -ing* (p.44+), culture, writing, phonics, values, project, review
- Any Workbook pages
- BE2 *In My House*; Unit 8 / `[HM]`; Book Intelligence
- Invented Track 51/53 wording or Act 11 answer keys
- Full SS/CLIL/culture/phonics vocabulary dump
- Forcing BrE SS spelling into Chalkie chips

### 3.3 Lesson allocation

| Lesson | Focus | Book work |
| --- | --- | --- |
| **1 — Introduce** | Retrieve chores; model *have to / has to*; support **p.40** Acts 8–10 | Protected SB **p.40** + official **Track 51** |
| **2 — Practise** | Introduce/use frequency adverbs; recycle *have to* lightly; support **p.41** Acts 11–13 | Protected SB **p.41** + official **Track 53** (no invented scripts/keys) |

---

## 4. Configuration (fixed)

| Setting | Value |
| --- | --- |
| Mode | Lesson Series |
| Lessons | **2** |
| Requested slides | **25 per lesson** |
| Duration | ≈ **40 minutes per lesson**, including textbook work |
| Framework | Chalkie Default |
| Theme | Simple |
| Grade | Grade 3 |
| English ability | Grade 2 |
| Audio activities | **OFF** |

---

## 5. Provenance labels

| Label | Meaning |
| --- | --- |
| `[SS]` | Unit 3 Scope & Sequence (unit-level; do not force whole-unit aims onto these two pages) |
| `[SB]` | Student Book evidence for the cited page only |
| `[SUPPLEMENTARY]` | Chalkie-/teacher-generated examples or adaptations — **not** publisher text |

---

## 6. Detailed initial Chalkie prompt (copy-ready)

Paste as Topic / specific instructions. Title suggestion: `Working Hard! — Language in Action`.

```text
Create a TWO-LESSON SERIES to SUPPORT Big English 3 Unit 3: Working Hard! — Language in Action only.

CONFIGURATION:
- Lesson Series: 2 lessons.
- Approximately 40 minutes per lesson, INCLUDING textbook activities on Student Book pp. 40–41.
- Slides support the book; do not replace or reproduce the book pages unnecessarily.
- Do NOT invent official publisher audio scripts, lyrics, sticker keys, or missing answers.
- Prefer picture-led slides and minimal student-facing text.
- Do NOT add unnecessary slides or dump the whole unit.

TEXTBOOK SCOPE — ONLY:
- Lesson 1 and Lesson 2 both support Student Book pp. 40–41 (Language in Action).
- Lesson 1 emphasizes p.40 activities 8–10 (have to / has to).
- Lesson 2 emphasizes p.41 activities 11–13 (adverbs of frequency; light recycle of have to).
Do NOT teach later Unit 3 pages (CLIL Pocket Money, like/love/hate + -ing, culture, writing, phonics, values, project, review) or any Workbook pages.

LABELS (keep visible to the teacher):
- [SS] = publisher Scope & Sequence (unit-level)
- [SB] = Student Book evidence for the cited page only
- [SUPPLEMENTARY] = generated examples (not publisher text)

A. WHAT THESE PAGES TEACH

[SS] Unit 3 title: Working Hard! (full SB unit pp. 36–51 — this series uses SB 40–41 only)

[SS] Vocabulary — Chores + Adverbs of frequency (unit-level lists exist; do not dump CLIL/culture/phonics).
Manual Chalkie vocabulary for this series (only):
make my bed, walk the dog, practice the piano, take out the trash, do the dishes, clean my room, study for a test, feed the fish, always, usually, sometimes, never
(Use American English page forms as above — not SS British variants.)

[SS] Structures (unit-level; use the LiA patterns on these pages):
- What do we/you have to do? We/I have to + chore.
- What does he/she have to do? He/She has to + chore.
- Frequency: always / usually / sometimes / never + chore statements and related questions.

[SS] I can… (unit aims — do not force all on these pages):
- …talk about how often people do things.
- …talk about what people like/don't like doing and have to do.
- …talk about chores and pocket money.
- …use capital letters in titles.

[SB p.40] Language in Action · have to / has to
[SB p.40] Models:
  What do we have to do? / We have to practice the piano.
  What does she have to do? / She has to walk the dog.
  What do you have to do? / I have to practice the piano.
[SB p.40] Activity 8: Listen and look at the sentences. Help Luke and Amy make more. (official Track 51)
  Frames: What do we have to do? / We have to …
           What does she have to do? / She has to …
  Word-bank tiles: study for a test, do the dishes, make my bed, take out the trash
[SB p.40] Activity 9: Follow the lines. What do they have to do?
  Frames: She has to… / They have to…
[SB p.40] Activity 10: What about you? Ask and answer.
  What do you have to do? / I have to … (learner’s own answer; no keyed publisher answer)

[SB p.41] Language in Action · adverbs of frequency
[SB p.41] Frequency words: always, usually, sometimes, never
[SB p.41] Activity 11: Listen to Alexia's week and find the three mistakes. (official Track 53 — REQUIRED)
  Direct the teacher to the official audio + book schedule. Do NOT invent Track 53 wording or the three mistake keys.
[SB p.41] Activity 12: Put the words in order. Then say.
  Includes frequency and recycled have-to questions/statements.
[SB p.41] Activity 13: Look at the chart. Make sentences about Leo. Use always, usually, sometimes, and never.
  Frame: Leo [adverb of frequency] [chore].

Communicative aim:
Students can ask and answer about chores with have to / has to, then talk about how often people do chores with frequency adverbs, and complete SB pp. 40–41 with official audio.

B. LESSON ALLOCATION (REQUIRED)

LESSON 1 — STUDENT BOOK p.40: INTRODUCE (have to / has to)
- Briefly retrieve chore phrases needed for the frames (prior unit vocab — not a new opener unit).
- Model What do we/you have to do? / We/I have to…
- Model What does he/she have to do? / He/She has to…
- Guided practice building short obligation exchanges.
- Support official Activity 8 (Track 51) and Activities 9–10.
- Tell the teacher to use the official book/audio; do not invent Track 51 wording.
- End with readiness to work in Student Book p.40.

LESSON 2 — STUDENT BOOK p.41: PRACTISE (frequency adverbs)
- Retrieve Lesson 1 have-to frames briefly (do not restart a full unit introduction).
- Model always / usually / sometimes / never with chore phrases.
- Support Activity 11 (Track 53): listen and find mistakes — direct to official audio only; do not invent answers.
- Support Activity 12 word order and Activity 13 chart sentences about Leo.
- Short pair speaking about how often they do chores.
- End with readiness to complete Student Book p.41.

C. HARD RULES

- Stay on SB pp. 40–41 only.
- Keep [SS], [SB], and [SUPPLEMENTARY] distinguishable.
- Prefer book activities; slides support, not replace.
- If Track 51 / Track 53 item text or Act 11 mistake keys are unknown, instruct the teacher to use the official book/audio — do not invent publisher content.
- Any Chalkie-generated audio is supplementary only (Audio should be OFF for this experiment).
- Keep each lesson classroom-usable for ~40 minutes including textbook work.
- Do not import BE2 In My House, Wild Animals, Unit 8, horizontal-mapping, CLIL Pocket Money, or like/love/hate + -ing content.
```

---

## 7. Concise teacher-controlled outlines

Replace Chalkie auto-outline bodies with these (sequence + textbook integration — **not** slide-by-slide scripts). Manually set vocabulary chips per §8 (**pre-run:** identical list both lessons — see §9.3).

Beat order may place protected textbook time before communicative use when that better protects book work (per provisional template).

### Lesson 1 — Introduce (SB p.40 · *have to / has to*)

**Goal:** Students retrieve chore phrases and can use *What do you/we have to do?* / *What does he/she have to do?* in short guided exchanges, then work p.40.

1. **Activation / retrieve (short):** Picture-led recall of the eight chore phrases. Label non-book examples `[SUPPLEMENTARY]`.
2. **Model:** *have to* (we/you/I) and *has to* (he/she) with clear chore phrases. Keep `[SB]` frames distinct from `[SUPPLEMENTARY]` swaps.
3. **Guided practice:** Choral → pair build of short obligation Q&A.
4. **Protected textbook time:** Student Book **p.40** — Activity 8 with **official Track 51**; Activities 9–10 (Act 10 = learner’s own answer).
5. **Purposeful communicative use (light):** Two–three partner turns — *What do you have to do?* / *I have to…*
6. **Final check (short):** One accurate *have to* and one accurate *has to* exchange (self or picture).

### Lesson 2 — Practise (SB p.41 · frequency adverbs)

**Goal:** Students use *always / usually / sometimes / never* with chores, recycle *have to* lightly, complete p.41, and produce a short frequency exchange.

1. **Activation / retrieve (short):** Quick oral recycle of Lesson 1 *have to / has to* (no full chore re-teach).
2. **Model:** Frequency adverbs with chore phrases; one recycled *have to* question if useful. Keep `[SB]` vs `[SUPPLEMENTARY]` clear.
3. **Guided practice:** Controlled sentences / questions with the four adverbs.
4. **Protected textbook time:** Student Book **p.41** — Activity 11 (**Track 53** — teacher uses official audio; no invented mistake keys); Activities 12–13.
5. **Purposeful communicative use:** Pair talk — how often they do chores (*I always/usually/sometimes/never…*).
6. **Final check (short):** One accurate frequency sentence and one short *have to* recycle.

---

## 8. Explicit vocabulary list (manual Chalkie entry) — pre-run design

**Historical (as designed and as entered for Experiment 8):** enter the **same** comma-separated list in **both** lessons’ vocabulary UI.

```text
make my bed, walk the dog, practice the piano, take out the trash, do the dishes, clean my room, study for a test, feed the fish, always, usually, sometimes, never
```

| Justification (pre-run) | Evidence |
| --- | --- |
| Chores | Preflight smallest justified set from p.36 / LiA page use (`vocab_0001`–`0008`) |
| Frequency | Extracted on p.41 (`vocab_0010`–`0013`); required for Acts 12–13 |
| Why not more | Preflight excludes CLIL/culture/phonics dumps and activity-only *homework* / *practice the guitar* unless a later owner decision adds them |
| Spelling | SB AmE forms locked (not SS *practise* / *rubbish*) |
| Same list both lessons | Matched then-current provisional template guidance (“same scoped list unless page scope differs”). **Post-run:** this choice is a confound — see §9.3. |

### 8.1 Recommended allocation for a future repeat (post-run guidance)

Do **not** rewrite Experiment 8’s actual inputs. For any future handoff iteration:

| Lesson | Manual vocabulary (recommended) |
| --- | --- |
| **1** (p.40 / *have to–has to*) | `make my bed, walk the dog, practice the piano, take out the trash, do the dishes, clean my room, study for a test, feed the fish` |
| **2** (p.41 / frequency) | `always, usually, sometimes, never` |

Lesson 2 may **retrieve** a small number of already-taught chores orally or via the Student Book; it should **not** receive the entire chore list again unless the teacher deliberately wants reteaching.

---

## 9. Qualitative review (Experiment 8 — recorded)

**Verdict:** **PASS — strong qualitative transfer success.**

The provisional pattern transferred to a **new level, unit, grammar focus, and two-page LiA spread** (BE3 U3 *Working Hard!* SB pp. 40–41).

**Method:** Owner review of the generated Lesson Series slides/exports against the §9 lenses and the Experiment 5/6/7 working pattern. **Not** a D018 seven-criterion scored Pass/Fail.

### 9.1 Generation record

| Item | Lesson 1 | Lesson 2 |
| --- | --- | --- |
| Export | `CHORES AND OBLIGATIONS - experiment 8 - lesson 1.pdf` | `Adverbs of Frequency for Daily Routines - experiment 8 - lesson 2.pdf` |
| Exported PDF pages | **31** | **31** |
| Location | Owner Downloads (not committed) | Owner Downloads (not committed) |
| Prompt / outlines / vocab | §6 + §7 + §8 (identical 12-item list both lessons) | Same pattern |

**Page-count note:** 31/31 exported PDF pages are **acceptable**. Do **not** treat them as a slide-count failure — reveal/animation states can add PDF pages beyond the 25 requested slides.

### 9.2 Lens findings

| Lens | Finding |
| --- | --- |
| **Scope** | **Strong.** Correct BE3 U3 LiA SB pp. 40–41. No CLIL / *like-ing* / WB / BE2 / Unit 8 / `[HM]` drift. |
| **Sequence** | **Strong on page focus** (L1 supports p.40 obligations; L2 supports p.41 frequency). See §9.3 for vocabulary-allocation confound on early frequency / L2 chore reteach appearance. |
| **Textbook integration** | **Strong.** Protected SB pp. 40–41 support; official Track **51** / **53** handled correctly; no invented publisher audio scripts or Activity 11 answer keys. |
| **Provenance** | **Strong.** No unmarked invented publisher content treated as book audio/keys. |
| **Added material** | **Curation note (not failure):** generated definitions, matching, quizzes, reveals, and examples = optional support; must not displace protected book work; mark `[SUPPLEMENTARY]` unless directly verified SB content. |
| **Slide economy** | **Acceptable.** 31/31 PDF pages including likely reveals; not scored as failure. |
| **Teacher curation** | Still required for optional generated support; continue to avoid invented publisher audio wording, keys, or answers. |
| **Transfer meaning** | **PASS.** Pattern transferred beyond BE2 U5 LiA to a new book level with a two-focus LiA spread. |

### 9.3 Corrected lesson-allocation finding (vocabulary-allocation confound)

An earlier informal read suggested: “Lesson split mostly strong — L1 introduces frequency words early, and L2 reteaches the whole chores set.”

**Causal correction:** that appearance is **partly caused by our own setup**, not an independent Chalkie sequencing failure.

- Experiment 8 manually entered the **identical 12-item list** into **both** lessons (chores **and** frequency adverbs).
- Chalkie was therefore explicitly given both the chores and frequency-adverb material for both lessons.
- Record as a **vocabulary-allocation confound**: Experiment 8 does **not** cleanly test whether Chalkie can maintain a strict L1/L2 vocabulary split when supplied **distinct** lists.

**Do not** present L1 early frequency introduction or L2 full-chore reuse as a clean Chalkie failure.  
**Do** require **separate vocabulary lists per lesson** in the next handoff iteration (see §8.1 and the revised provisional template).

### 9.4 Retained curation findings

- Generated definitions, matching, quizzes, reveals, and examples remain **optional support** and must not displace protected book work.
- Mark generated material `[SUPPLEMENTARY]` unless it is directly verified SB content.
- Continue to avoid invented publisher audio wording, keys, or answers.

### 9.5 Non-claims

- No classroom validation; no product readiness; no Phase 2 closure.
- Does **not** lock the handoff pattern as production methodology.
- Does **not** revise D018 / Arm B2 / V2b scores.
- Further generation is **not authorized** by this review.

---

## 10. Owner gates

| # | Gate | Status |
| --- | --- | --- |
| 1 | Source preflight complete | **Done** |
| 2 | Target identity confirmed (*Working Hard!*) | **Done** (owner) |
| 3 | Design drafted from verified preflight evidence | **Done** |
| 4 | Owner approves design | **Done** |
| 5 | Owner authorizes **one** Chalkie Lesson Series generation | **Done** — Experiment 8 generated |
| 6 | Record exports + qualitative review per §9 | **Done** — PASS / strong transfer success; vocab-allocation confound recorded |
| 7 | Further regeneration | **Not authorized** |

**Status line for trackers:** GENERATED · QUALITATIVELY REVIEWED · PASS — strong transfer success · vocab-allocation confound recorded · further generation not authorized.

---

## 11. Boundaries

- Does **not** authorize another Chalkie generation.
- Does **not** revise D018 / Arm B2 / V2b scores or preferred-control status.
- Does **not** lock the Experiment 5/6/7/8 handoff as production methodology.
- Does **not** claim classroom validation or product readiness.
- Does **not** add UI, schema, or horizontal-mapping requirements.
- Chalkie remains a transfer/diagnostics surface downstream of curriculum evidence.
