# P2-EXP-BE2-U06-v2 — Learning Requirements Review Artifact

**Status:** ACTIVE (awaiting owner review)  
**Version:** 1.0  
**Date:** 2026-10-09  
**Experiment ID:** `P2-EXP-BE2-U06-v2`  
**Protocol:** [`p2-exp-be2-u06-v2-protocol.md`](./p2-exp-be2-u06-v2-protocol.md) (v1.0; criteria V2-E1–E9 defined before this artifact)  
**Decisions:** D015, D016  
**Focus:** BE2-SB Unit 6 — *My Day* (`bep2_unit_06`, printed pp. 90–105)

**Tag legend (experimental — NOT LOCKED):**  
`BOOK_EVIDENCE` | `AI_INTERPRETATION` | `UNCERTAIN` | `MISSING_EVIDENCE` | `AI_PREDICTED_DIFFICULTY` | `TEACHER_CONFIRMED_DIFFICULTY`

Temporary structures: `EXPERIMENT_SKETCH — NOT LOCKED`.  
This is **not** a locked Phase 2 schema, prompt, or product design.  
v1 cross-book mapping is context only; this run does not remake that map.

---

## 0. Inputs

| Role | Source |
|---|---|
| Primary | `data/phase1/big_english_2_sb/canonical/v1.json` → `bep2_unit_06` |
| Optional WB | `data/phase1/big_english_2_wb/canonical/v1.json` → Unit 6 *My Day* |
| Context | [`p2-exp-be2-u06-v1-review.md`](./p2-exp-be2-u06-v1-review.md) |
| BE1/BE3 | Consulted only for one clarifying note in §8 (no remapping) |

**Publisher-stated objectives:** Phase 1 JSON has no dedicated `objectives[]` array for this unit. Page `bep2_p105` notes include an **'I Can' self-assessment block**, but exact I Can sentences were **not extracted** as language/activity entities.  
→ Exact publisher I Can wording: `MISSING_EVIDENCE` in canonical JSON.  
→ Values / component titles below are the closest explicit publisher priority signals: `BOOK_EVIDENCE`.

---

## 1. Executive unit interpretation

**Teacher-readable summary (`AI_INTERPRETATION`, grounded in §2–§5 evidence):**

Unit 6 teaches children to **talk about clock times on the hour** and to **ask and answer when people do everyday things**, using present-simple questions with *do/does* and answers with *at* + time. Students also practise **schedule language** (*start* / *finish*), a **set of Wh- question words** for personal information, plus supporting strands: **historical ways of telling time** (CLIL), **comparing children’s days** (culture), **getting to school on time** (values), and **ch / tch / sh** phonics.

Central student performances are: read/say *o’clock* times; ask *What time is it?*; ask/answer *When do/does …?*; use *start/finish* with times; form/select appropriate Wh-questions. Supporting performances include explaining old timekeeping devices and describing personal punctuality habits.

---

## 2. Learning requirements inventory

`EXPERIMENT_SKETCH — NOT LOCKED`

Each requirement is an **observable ability**. Origin: **AI-inferred** unless noted as publisher-titled component/values language.

| ID | Observable learning requirement | Origin | Core? | Primary evidence |
|---|---|---|---|---|
| LR-01 | Students can **recognize and say** hourly clock times (*one o’clock* … *twelve o’clock*). | AI-inferred from vocab + Act 1–3, 36 | **Core** | `bep2_vocab_u6_001`–`012` (p.90); `bep2_act_u6_01`–`03`; `bep2_act_u6_36` (p.105); component `bep2_comp_u6_01` |
| LR-02 | Students can **ask and answer** *What time is it? / It’s ___ o’clock.* | AI-inferred; frame explicit | **Core** | `bep2_lang_u6_001` (p.91); `bep2_act_u6_06` language_frame |
| LR-03 | Students can **ask and answer when someone does a daily routine**, using *When does he/she …?* / *He/She ___s at ___* or *When do you …?* / *I ___ at ___*. | AI-inferred; grammar explicit | **Core** | `bep2_lang_u6_002`–`003` (p.94); `bep2_act_u6_09`–`12`; song/story texts pp.91–92 |
| LR-04 | Students can **choose *do* vs *does*** in *When* questions and complete matching present-simple answers with times. | AI-inferred from guided writing | **Core** | `bep2_act_u6_10` items (p.94) |
| LR-05 | Students can **ask/answer about when an event starts or finishes** using *start* / *finish* (and related *end* in one item). | AI-inferred | **Core** | `bep2_lang_u6_004` (p.95); `bep2_act_u6_13` |
| LR-06 | Students can **use routine verb phrases** (*get up*, *go to bed*, *start/finish school*, *go out*, *watch TV*, plus story/song extensions) with times. | AI-inferred | **Core** | `bep2_vocab_u6_013`–`018`; song `bep2_text_u6_01`; story `bep2_text_u6_02` |
| LR-07 | Students can **identify and use Wh- question words** (*who, what, when, where, how, how many*) to ask for personal/factual information. | AI-inferred; grammar component titled | **Core** | `bep2_lang_u6_005` (p.98); `bep2_comp_u6_06`; `bep2_act_u6_19`–`24`, `37` |
| LR-08 | Students can **challenge an implausible routine time** and ask for a real time (*That’s silly! When do you really …?*). | AI-inferred from game | Supporting (reinforcement) | `bep2_lang_u6_006` (p.104); `bep2_act_u6_35` |
| LR-09 | Students can **match/describe historical timekeeping devices** (sundial, candle clock, hourglass, water clock) and say what they use to tell time. | AI-inferred; CLIL component | Supporting (CLIL) | `bep2_comp_u6_05`; `bep2_text_u6_03`; `bep2_act_u6_14`–`18`, `38`; vocab `019`–`027` |
| LR-10 | Students can **compare children’s daily schedules** across cultures and judge true/false statements about them. | AI-inferred; culture component | Supporting (culture) | `bep2_comp_u6_07`; `bep2_text_u6_05`; `bep2_act_u6_25`–`28` |
| LR-11 | Students can **sequence and describe steps for getting to school on time** (values: *Be on time.*). | Mixed: values title = publisher; ability = AI-inferred | Supporting (values) | `bep2_comp_u6_08` title *Be on time.*; `bep2_act_u6_29`–`30`; vocab *on time*, *early* |
| LR-12 | Students can **hear, find, blend, and chant** words with *ch*, *tch*, *sh*. | AI-inferred; phonics component | Supporting (phonics) | `bep2_comp_u6_09`; `bep2_act_u6_31`–`34`; vocab `032`–`036` |

**WB corroboration (`BOOK_EVIDENCE`):** BE2-WB U6 practises the same three language foci (*When does…*, *When do you…*, Wh- information questions) plus clock drawing, CLIL old/new timekeepers, culture schedules, punctuality paths, and phonics — supporting that SB expectations are not extraction noise.

---

## 3. Grammar and language-function analysis

`EXPERIMENT_SKETCH — NOT LOCKED`

### 3.1 Target 1 — Telling the time (o’clock)

| Field | Content | Tag |
|---|---|---|
| Structure | *What time is it?* → *It’s [number] o’clock.* | `BOOK_EVIDENCE` `bep2_lang_u6_001` |
| Function | asking_and_telling_the_time | `BOOK_EVIDENCE` |
| Examples | *What time is it? It’s one o’clock.* | `BOOK_EVIDENCE` |
| Expected student use | Ask/answer with clock visuals; write *It’s ___ o’clock* | `AI_INTERPRETATION` from Acts 6, 36 |
| Progression | **Recognition:** Act 1–2 listen/look/say. **Guided:** Act 5 yes/no; Act 36 write from clocks. **Independent-production opportunity:** Act 6 ask/answer (pair). | `AI_INTERPRETATION` of activity types — **not mastery** |
| Plausible difficulty | Distinguishing *o’clock* reading from digital *1:00* labels; number+o’clock chunking | `AI_PREDICTED_DIFFICULTY` |

### 3.2 Target 2 — *When do/does* + present simple routines + *at* + time

| Field | Content | Tag |
|---|---|---|
| Structure | *When does he/she + V?* → *He/She Vs at [time].* / *When do you + V?* → *I V at [time].* | `BOOK_EVIDENCE` `bep2_lang_u6_002`–`003` |
| Function | asking_and_talking_about_daily_routines | `BOOK_EVIDENCE` |
| Examples | *When does he get up? He gets up at 6:00.* / *When do you go to bed? I go to bed at 8:00.* | `BOOK_EVIDENCE` |
| Expected student use | Build sentences with audio support; write *do/does*; pair ask/answer from stickers | `BOOK_EVIDENCE` Acts 9–12 |
| Progression | **Recognition/comprehension:** story Act 7–8. **Guided:** Act 9 listen sentence-building; Act 10 write *do/does*. **Independent-production opportunity:** Act 12 ask/answer; Act 28 personal chart; Act 35 silly game | `AI_INTERPRETATION` |
| 3rd person -s | Explicit in answers (*gets*, *goes*, *brushes* in Act 10) | `BOOK_EVIDENCE` Act 10 items |
| Plausible difficulty | *do/does* selection; 3rd-person *-s*; *at* + time vs bare time | `AI_PREDICTED_DIFFICULTY` |

### 3.3 Target 3 — *start* / *finish* with schedules

| Field | Content | Tag |
|---|---|---|
| Structure | *When does X start/finish?* → *It starts/finishes at [time].* | `BOOK_EVIDENCE` `bep2_lang_u6_004`; Act 13 also uses *end* |
| Function | asking_about_schedules | `BOOK_EVIDENCE` |
| Expected use | Complete schedule questions/answers in writing | `BOOK_EVIDENCE` Act 13 |
| Progression | Mostly **guided writing** after sticker listening (Act 11–13) | `AI_INTERPRETATION` |
| Note | *end* appears in Act 13 item 2 while language row emphasizes *start/finish* | `BOOK_EVIDENCE` + `UNCERTAIN` whether *end* is core target |

### 3.4 Target 4 — Wh- question words (consolidated)

| Field | Content | Tag |
|---|---|---|
| Structure | *who / what / when / where / how / how many* + appropriate *be/do* patterns | `BOOK_EVIDENCE` `bep2_lang_u6_005` |
| Function | asking_open_questions | `BOOK_EVIDENCE` |
| Examples | Dialogue p.98 (`bep2_text_u6_04`); match/circle/write Acts 20–23 | `BOOK_EVIDENCE` |
| Expected use | Circle words; match Q–A; write questions; personal ask/answer | `BOOK_EVIDENCE` Acts 20–24, 37 |
| Progression | **Recognition:** Act 20 circle. **Guided:** Acts 21–23. **Independent-production opportunity:** Act 24 personal answers | `AI_INTERPRETATION` |
| Clarifying prior (from v1; not remapped) | Many Wh-forms appear earlier in BE1 as separate targets | `AI_INTERPRETATION` citing v1 — Unit 6 **consolidates** rather than first-introducing all Wh-words |

### 3.5 Target 5 — Clarification after silly routine claim

| Field | Content | Tag |
|---|---|---|
| Structure | Statement with odd time → *That’s silly! When do you really …?* → real answer | `BOOK_EVIDENCE` `bep2_lang_u6_006` |
| Function | playing_language_game_and_verifying_truth | `BOOK_EVIDENCE` |
| Role | Recycle LR-03 in a game; social language *That’s silly!* | `AI_INTERPRETATION` |

---

## 4. Vocabulary analysis

`EXPERIMENT_SKETCH — NOT LOCKED`

| Cluster | Terms | Expected use (evidence-supported) | Tag |
|---|---|---|---|
| **A. Clock times** | one–twelve o’clock | **Recognition + productive saying/writing** with clocks (Acts 1–3, 6, 36) | `BOOK_EVIDENCE` + `AI_INTERPRETATION` of use level |
| **B. Routine verbs** | get up, go to bed, start school, finish school, go out, watch TV | **Productive** in *When* frames; song/story also use *get dressed*, *brush teeth*, *do homework*, *play*, *come back*, *sleep*, *eat* (supporting context) | `BOOK_EVIDENCE` listed targets vs story/song extensions |
| **C. CLIL timekeeping** | sundial, candle, hourglass, water clock, shadow, sand, height, … | **Recognition + understanding in reading**; productive in poster frame Act 18; review unscramble Act 38 | `AI_INTERPRETATION` — not same demand as Cluster A/B |
| **D. Culture/values** | tired, recess, on time, early | **Understanding in texts**; *on time* / *early* used in values speaking | `BOOK_EVIDENCE` |
| **E. Phonics set** | witch, ship, fish, chin, rich (+ blend items chop, she, match, lunch, …) | **Phonics recognition/pronunciation**, not unit communicative vocab | `BOOK_EVIDENCE` + `AI_INTERPRETATION` |

**Discipline:** Vocabulary *difficulty predictions* are in §6, not mixed into “must produce” claims here.  
**Do not assume** CLIL nouns require free productive use equal to *get up* / *o’clock*.

---

## 5. Skills and activity-purpose analysis

Consolidated by purpose (not every exercise narrated).

| Purpose group | Skills | Develops | Stage (`AI_INTERPRETATION`) | Key refs |
|---|---|---|---|---|
| Clock presentation & practice | L, S, (W review) | LR-01, LR-02 | Introduce → practise → demonstrate-opportunity | Acts 1–6, 36; Comp vocabulary/song |
| Story routines comprehension | L, R | LR-03, LR-06 | Introduce/contextualize | Acts 7–8; `bep2_text_u6_02` |
| *When do/does* grammar practice | L, W, S | LR-03, LR-04 | Guided → pair production opportunity | Acts 9–12; Comp Language in Action |
| Schedule *start/finish* | L, W, S | LR-05 | Practise | Acts 11–13 |
| CLIL timekeepers | R, L, S, Project | LR-09 | Introduce → comprehend → present opportunity | Acts 14–18, 38; Comp CLIL |
| Wh- grammar | L, R, W, S | LR-07 | Introduce → guided → personal production opportunity | Acts 19–24, 37; Comp Grammar |
| Culture schedules | S, L, R, W | LR-10, LR-03 recycle | Reinforce / personalize | Acts 25–28; Comp culture |
| Values punctuality | L, S | LR-11 | Reinforce values language | Acts 29–30; Comp values |
| Phonics | L, S | LR-12 | Separate strand | Acts 31–34 |
| Review game + I Can page | S, W, R | LR-03, LR-01, LR-07, LR-09 | Reinforce / self-check opportunity | Acts 35–38; p.105 note |

**WB (corroboration only):** Additional writing, clock-hand drawing, old/new classification, punctuality path choices — deepen practice load for same cores, especially writing.

**Not claimed:** Any activity “proves mastery.” Independent-production activities are **opportunities**.

---

## 6. Potential learner difficulties

Categories kept separate. **No `TEACHER_CONFIRMED_DIFFICULTY` entries** — none found in repository evidence (`MISSING_EVIDENCE` for classroom confirmation).

### 6.1 General language-learning difficulties — `AI_PREDICTED_DIFFICULTY`

| Difficulty | Likely source | Linked LRs |
|---|---|---|
| Confusing *do* vs *does* in *When* questions | Auxiliary agreement with subject | LR-03, LR-04 |
| Omitting 3rd-person *-s* in answers (*He get up*) | Present-simple morphology | LR-03, LR-06 |
| Mixing *What time is it?* with *When do you …?* | Both involve time but different functions | LR-02 vs LR-03 |
| Choosing wrong Wh-word (*Where* vs *When*, *How* vs *How many*) | Dense Wh set on one grammar spread | LR-07 |
| Treating CLIL device names as equal priority to routines | Cognitive load / lexical novelty | LR-09 vs core |

### 6.2 Plausible Korean EFL difficulties — `AI_PREDICTED_DIFFICULTY`

*Hypotheses with linguistic rationale; **not** observed classroom facts; **not** claimed universal.*

| Hypothesis | Defensible linguistic reason | Linked LRs |
|---|---|---|
| *do/does* and subject–auxiliary inversion feel unnatural | Korean questions typically use particles/intonation without English-style auxiliaries | LR-03, LR-04, LR-07 |
| 3rd-person singular *-s* is easily dropped | Korean verbs do not mark person/number agreement like English present simple | LR-03 |
| *at* + clock time may be under-marked | Korean time expressions often attach differently (e.g. 시에) without a separate preposition parallel to *at* | LR-02, LR-03 |
| *ch / sh / tch* contrasts need focused listening | English digraphs are not one-to-one with Hangul spelling habits; *tch* is especially opaque | LR-12 |

### 6.3 Teacher-confirmed difficulties

| Status | Note |
|---|---|
| None recorded | `MISSING_EVIDENCE` / no `TEACHER_CONFIRMED_DIFFICULTY` available in this experiment’s sources |

---

## 7. Core and supporting learning

### Publisher priority signals — `BOOK_EVIDENCE`

- Explicit language rows (6) center time, *When* routines, schedules, Wh-words, silly-game recycle.  
- Component spine: Vocabulary (clocks) → Song → Story → Language in Action → CLIL → Grammar (Wh) → Culture → Values (*Be on time.*) → Phonics → Review.  
- Activity volume heaviest on clocks, *When* grammar, Wh-pages, then CLIL/culture/values/phonics.

### AI classification — `AI_INTERPRETATION`

| Band | Requirements | Why |
|---|---|---|
| **Core language learning** | LR-01 … LR-07 | Explicit `language[]` targets + high activity emphasis + Language in Action / Grammar components |
| **Supporting — reinforcement game** | LR-08 | Recycles core routines; labeled as game function |
| **Supporting — CLIL** | LR-09 | Cross-curricular content words; fewer communicative recycles than routines |
| **Supporting — culture** | LR-10 | Extends routine talk into reading comparison |
| **Supporting — values** | LR-11 | Publisher values title; social habit language |
| **Supporting — phonics** | LR-12 | Parallel literacy strand; separate from communicative cores |

**Supporting ≠ optional.** This experiment does **not** recommend skipping CLIL, culture, values, or phonics pages.

**Preserve separately:** Publisher component/values titles vs AI “core/supporting” banding.

---

## 8. Evidence and uncertainty register

| Item | Tag | Notes |
|---|---|---|
| Unit theme, 6 language rows, 36 vocab, 10 components, 38 activities | `BOOK_EVIDENCE` | Canonical SB |
| Exact printed **I Can** sentences on p.105 | `MISSING_EVIDENCE` | Page note mentions block; text not in extracted entities |
| Formal publisher objectives list | `MISSING_EVIDENCE` | No objectives array in schema instance |
| *end* vs *finish* as equal targets | `UNCERTAIN` | Act 13 uses *end*; language row highlights *start/finish* |
| Story/song verbs beyond listed target vocab | `BOOK_EVIDENCE` in continuous_text; expected productive status `UNCERTAIN` | e.g. *come back*, *brush my teeth* |
| Wh-set as “new” vs “consolidated” | `AI_INTERPRETATION` | v1 suggested BE1 priors; not re-proven here |
| Sticker dependency Act 11 | `BOOK_EVIDENCE` | Page note: stickers from p.190 |
| Korean difficulty hypotheses | `AI_PREDICTED_DIFFICULTY` only | No teacher confirmation |
| WB as equal authority to SB | Rejected | WB used only to corroborate |

**Unsupported conclusions avoided:** mastery claims; percentage passing criteria; “Korean learners always…”; recommendation to drop supporting strands; locked schema fields.

---

## 9. Teacher-facing synthesis

**Unit 6 in one glance (initial AI review — not teacher-validated):**

1. **Teach the clocks (o’clock)** and the exchange *What time is it?*  
2. **Teach daily routines with times** using *When do/does …?* and *at* + time — watch *do/does* and *-s*.  
3. **Teach schedule questions** with *start* / *finish*.  
4. **Review Wh-questions** (*who/what/when/where/how/how many*) for personal information.  
5. **Also cover (do not skip):** old clocks CLIL, children’s days around the world, *Be on time* habits, and *ch/tch/sh* phonics.  
6. **Practice path:** listen/look → guided write → pair ask/answer → personal chart / silly game / review.  
7. **Likely stickies:** *do/does*, third-person *-s*, mixing *What time* vs *When*, Wh-word choice.

---

## 10. Experiment evaluation and lessons learned

### 10.1 Evaluation against predefined criteria (V2-E1–E9)

| ID | Criterion | Result | Honest notes |
|---|---|---|---|
| V2-E1 | Accuracy | **PASS** | Requirements tracked to SB language/vocab/activities; no invented objective list presented as book fact |
| V2-E2 | Traceability | **PASS** | IDs and printed pages cited throughout |
| V2-E3 | Observability | **PASS with caveat** | Core LRs are performance-shaped; LR-10/11 slightly broader (compare/sequence) but still observable |
| V2-E4 | Language interpretation | **PASS** | Grammar, vocab clusters, functions separated |
| V2-E5 | Learning progression | **PASS with caveat** | Recognition/guided/production-*opportunity* labeled; mastery explicitly denied. Act-to-stage mapping remains interpretive |
| V2-E6 | Evidence discipline | **PASS** | Tags used; difficulties categorized; no fake teacher confirmation |
| V2-E7 | Consolidation | **PASS** | 12 LRs instead of 38 activity commentaries; Wh and routines merged |
| V2-E8 | Teacher usefulness | **PARTIAL PASS** | §9 is clear and concise as AI self-review; **not** teacher-validated; usefulness hypothesized |
| V2-E9 | Scope discipline | **PASS** | No schema lock; no U7/U8; sketches marked experimental |

**Overall:** Experiment produced a usable draft interpretation method for one unit, with V2-E8 only partial because teacher usefulness cannot be confirmed without teachers.

### 10.2 Strengths

- Observable LR wording beats theme slogans.  
- Clear separation of core communicative targets vs CLIL/culture/values/phonics.  
- Activity consolidation keeps the artifact readable.  
- Difficulty section refuses false certainty.

### 10.3 Weaknesses / gaps

- Missing extracted I Can statements limit “publisher objective” fidelity.  
- Production-stage labels are inferred from activity types, not classroom observation.  
- Korean-EFL notes are linguistic hypotheses only.  
- Some story vocabulary productive expectations remain uncertain.  
- Teacher usefulness unvalidated (V2-E8 partial).

### 10.4 Lessons for the next experiment (method only; do not auto-start U7)

1. Prefer extracting or quoting I Can / objective lines when present on review pages.  
2. Keep a fixed LR template (ability + evidence + stage + core flag).  
3. Cap activity narrative via purpose groups early.  
4. Require an empty `TEACHER_CONFIRMED` table to force honesty.  
5. Separate “listed target vocab” from “text-only supporting vocab” in the LR inventory.  
6. Treat teacher-facing synthesis as a first-class deliverable with a length budget (~7 bullets).  
7. Do not promote difficulty hypotheses to requirements.

### 10.5 Unresolved methodological questions (owner)

1. Accept AI **core/supporting** banding as a standing Phase 2 practice, or require publisher I Can before banding?  
2. Should story/song-only verbs become LRs or stay “exposure”?  
3. Is V2-E8 allowed to PASS without any teacher review, or must it remain partial until teachers respond?  
4. Apply this LR method next to **BE2 U7** after owner accept, or revise protocol first?  
5. Keep experiment IDs `P2-EXP-…-vN` + paired `*-protocol.md` / `*-review.md` naming?

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | Executed `P2-EXP-BE2-U06-v2`; learning-requirements artifact created for owner review. |
