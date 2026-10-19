# Chalkie Transfer Preflight — BE3 Unit 3 Language in Action pp. 40–41 (v0.1)

**Status:** SOURCE PREFLIGHT / **NOT A HANDOFF PROMPT** / **NOT AUTHORIZED TO GENERATE**  
**Date:** 2026-10-19  
**Purpose:** Verify Phase 1 evidence for a possible next Chalkie transfer target. No Chalkie prompt, no generation, no methodology lock.  
**Template reference:** [`chalkie-provisional-handoff-template-v0.1.md`](./chalkie-provisional-handoff-template-v0.1.md)

---

## 0. Target-identity check (critical)

| Claimed in request | Verified in Phase 1 / SS |
| --- | --- |
| Big English **3**, Unit **3**, *In My House*, SB LiA **pp. 40–41** | Catalog `big_english_3_sb` · Unit `big_english_3_sb_unit_03` title ***Working Hard!*** (theme: chores / daily responsibilities) · printed range **36–51** · LiA pages **40–41** human_verified |

**Finding:** Pages **40–41** exist and are Language in Action, but the unit title is **not** *In My House* (*In My House* is BE2 Unit 3). This preflight continues against **verified** BE3 U3 *Working Hard!* LiA pp. 40–41. Owner must confirm that is the intended target before any later handoff design.

---

## 1. Book / unit / page identity and verification

| Item | Verified fact |
| --- | --- |
| Catalog `book_id` | `big_english_3_sb` (registry BE3-SB; Phase 1 COMPLETE) |
| Canonical | `data/phase1/big_english_3_sb/canonical/v1.json` |
| Unit | `big_english_3_sb_unit_03` · *Working Hard!* · printed **36–51** · `verification_status` **human_verified** |
| Pages | `bep_sb_3_p40` / `bep_sb_3_p41` · printed **40** / **41** · `pdf_page` **40** / **41** · section **Language in Action** · `section_type` grammar_practice · instructional · visual + audio dependency · **human_verified** |
| Source PDF | Local `app/src/assets/books/big-english/big_english_3_sb.pdf` present (registry: R2 `big-english/big_english_3_sb/source.pdf`) |
| Page notes (canonical) | p.40 banner: practice *What do you/they have to do? What does he/she have to do?* · p.41 banner: language practice (**adverbs of frequency**) |
| **[SS]** | Storage companion restored for this preflight: `book-datasets` → `big-english/big_english_3_sb/canonical/ss_v1.json` · Unit 3 *Working Hard!* (SB pp. 36–51) |

---

## 2. Section / component name

| Layer | Verified |
| --- | --- |
| Page section_title / heading | **Language in Action** (both pages) |
| Component | `big_english_3_sb_component_0004` · grammar · `page_id` `bep_sb_3_p40` · title **Language in Action: have to & adverbs of frequency** |

---

## 3. Page inventory (verified floor)

### 3.1 Page 40 — *have to* / *has to*

| Act | Instruction | Language / models | Dependencies |
| --- | --- | --- | --- |
| **8** | Listen and look at the sentences. Help Luke and Amy make more. | Frames: *What do we have to do? / We have to …* · *What does she have to do? / She has to …* | Audio **Track 51**; visual; word-bank tiles: *study for a test, do the dishes, make my bed, take out the trash* |
| **9** | Follow the lines. What do they have to do? | *She has to… / They have to…* · answers: homework; walk the dog; clean their room | Visual line maze (no audio) |
| **10** | What about you? Ask and answer. | *What do you have to do? / I have to …* | Open personal answer (no keyed answer) |

**Language IDs on p.40 (human_verified):**  
`big_english_3_sb_lang_0003` · `0004` · `0005` (*we have to practice the piano* · *she has to walk the dog* · *I have to practice the piano*).

### 3.2 Page 41 — adverbs of frequency (+ recycle *have to*)

| Act | Instruction | Language / models | Dependencies |
| --- | --- | --- | --- |
| **11** | Listen to Alexia's week and find the three mistakes. | Schedule chores (Mon–Fri list in source note) | Audio **Track 53** **required** to identify mistakes; visual schedule |
| **12** | Put the words in order. Then say. | Includes frequency + *have to* questions/statements (e.g. *Do you sometimes make your bed?* · *What do you have to do?* · *Jake never does the dishes.*) | No audio |
| **13** | Look at the chart. Make sentences about Leo. Use *always, usually, sometimes, never*. | *Leo [adverb] [chore].* | Visual chart; key note: always / usually / sometimes / never |

**Vocabulary extracted on p.41:** `always`, `usually`, `sometimes`, `never` (`bep_sb_3_vocab_0010`–`0013`).

**No sticker dependency** recorded for these pages.

### 3.3 Spelling / variety note (SS vs SB)

SS Unit 3 chores list uses some **BrE** forms (*practise the piano*, *take out the rubbish*). SB Phase 1 extraction for these pages uses **AmE** forms (*practice the piano*, *take out the trash*). For page-scoped work, prefer **SB page evidence**; treat SS as unit-level companion only.

---

## 4. In-scope floor and exclusions

### In scope (floor)

- SB **pp. 40–41** only · Language in Action · *have to* / *has to* Q&A + adverbs of frequency with chore phrases used on these pages.
- Support Acts **8–13** with official Track **51** / **53** directions (no invented scripts).

### Explicit exclusions

- Later Unit 3: CLIL Pocket Money (p.42+), Grammar *like/love/hate + -ing* (p.44+), culture, writing, phonics, values, project, review.
- Any Workbook pages.
- BE2 *In My House* content; Unit 8 / `[HM]`; Book Intelligence.
- Invented Track 51/53 wording or Act 11 mistake keys without audio.
- Full unit dump of CLIL/culture/phonics vocabulary.

---

## 5. Earlier Unit 3 dependencies (retrieval / support, not new scoped teaching)

| Prior evidence | Role for a future LiA handoff |
| --- | --- |
| p.36 chores vocabulary (`bep_sb_3_vocab_0001`–`0008`) | **Retrieve** as support for LiA models (not introduce as new “opener” lesson) |
| p.37 song language (`lang_0001`) | Out of LiA page scope; do not expand into song teaching |
| p.38 story *have to* (`lang_0002`) | Prior exposure to *have to*; optional retrieval mention only |
| Frequency adverbs | Appear as **new page-scoped** vocab on **p.41** (also listed on SS) |

---

## 6. Smallest justified manual vocabulary set (future Chalkie)

**Include only** (from LiA page use + required frequency set):

```text
make my bed, walk the dog, practice the piano, take out the trash, do the dishes, clean my room, study for a test, feed the fish, always, usually, sometimes, never
```

**Activity-only phrases** appearing in answers/schedules but **not** in p.36 chore vocab list — do **not** auto-add unless a later handoff explicitly needs them for Act 9/11 fidelity: *do her homework*, *practice the guitar*.

**Do not dump:** CLIL pocket-money set, culture chores set, phonics words, review duplicates.

---

## 7. Template-readiness check

Can the revised provisional handoff template be filled cleanly from this evidence?

| Template need | Status |
| --- | --- |
| TITLE / identity / exact pages | **Fillable** — after correcting unit title to *Working Hard!* |
| Source labels + floor frames/activities | **Fillable** from §3 |
| Scoped vocabulary | **Fillable** from §6 |
| Exclusions / audio safeguards / protected book work | **Fillable** |
| Lesson allocation (2 lessons) | **Fillable but needs design choice** — natural split: L1 = p.40 *have to*; L2 = p.41 frequency (+ recycle *have to*) |
| Outline beats | **Fillable** |

**Real gaps / ambiguities only:**

1. **Owner title mismatch** (*In My House* vs verified *Working Hard!*) — must be resolved before handoff drafting.  
2. **Two grammar foci on one LiA spread** — template can hold both, but allocation must be explicit (not ambiguous “same pages twice”).  
3. **Act 11 is audio-complete-dependent** — template safeguards cover “direct to official audio,” but mistake keys must stay out of any prompt.  
4. **SS vs SB spelling variants** — handoff should lock to SB page forms.

---

## 8. Recommendation

**Conditionally suitable** as the next Chalkie transfer experiment **if** the owner confirms the target is **BE3 Unit 3 *Working Hard!* Language in Action SB pp. 40–41** (not BE2 *In My House*).

**Evidence-based reasons for suitability:**

- Canonical pages, activities, language, vocab, tracks, and SS Unit 3 companion are all available and human_verified.  
- Same LiA grammar-practice transfer class as Experiment 7, with a useful new challenge: **obligation (*have to*) + frequency adverbs** across two pages.  
- Small scoped vocab set can be justified without dumping the unit.

**Reasons to pause / not proceed yet:**

- Requested unit title does not match verified BE3 U3 identity.  
- No handoff prompt should be written until that confirmation.

**Still not authorized:** Chalkie prompt drafting, generation, D018 changes, classroom-validation claims, or methodology lock.
