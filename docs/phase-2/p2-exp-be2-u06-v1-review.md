# P2-EXP-BE2-U06-v1 — Experiment Review Artifact

**Status:** ACTIVE (awaiting owner review)  
**Version:** 1.0  
**Date:** 2026-10-09  
**Experiment ID:** `P2-EXP-BE2-U06-v1`  
**Protocol:** [`be2-unit-6-experiment-protocol.md`](./be2-unit-6-experiment-protocol.md) (v1.0; criteria unchanged)  
**Decisions:** D015, D016  
**Focus:** BE2-SB Unit 6 — *My Day* (`bep2_unit_06`, printed pp. 90–105)

**Tag legend:** `BOOK_EVIDENCE` | `AI_INTERPRETATION` | `UNCERTAIN` | `MISSING_EVIDENCE`

This artifact is a reviewable experiment note. It is **not** a locked Phase 2 schema, prompt, or Phase 3 map. Temporary structural tables below are `EXPERIMENT_SKETCH — NOT LOCKED`.

---

## 0. Inputs used

| Role | Catalog ID | Source |
|---|---|---|
| Focus | `big_english_2_sb` | Local `data/phase1/big_english_2_sb/canonical/v1.json` |
| Prior | `big_english_1_sb` | Local `data/phase1/big_english_1_sb/canonical/v1.json` |
| Future | `big_english_3_sb` | Local `data/phase1/big_english_3_sb/canonical/v1.json` |
| WB triangulation (optional) | `big_english_1_wb`, `big_english_2_wb`, `big_english_3_wb` | Local canonicals; corroboration only |

No Beehive, Reach Higher, or external textbook knowledge used.

---

## 1. Focus unit inventory — BE2-SB Unit 6 *My Day*

### 1.1 Unit metadata — `BOOK_EVIDENCE`

| Field | Value |
|---|---|
| `unit_id` | `bep2_unit_06` |
| `book_id` | `big_english_2_sb` |
| Title | My Day |
| Theme | Daily routines, telling time (o'clock), question words, history of timekeeping, punctuality |
| Printed / PDF pages | 90–105 |
| Vocabulary rows | 36 |
| Language rows | 6 |
| Activities | 38 |
| Curriculum components | 10 |
| Continuous text | 6 |

### 1.2 Language targets — `BOOK_EVIDENCE`

| language_id | Printed page | grammar_label | function | Example (full_text) |
|---|---:|---|---|---|
| `bep2_lang_u6_001` | 91 | What time is it? / It's [time] o'clock | asking_and_telling_the_time | What time is it? It's one o'clock. |
| `bep2_lang_u6_002` | 94 | When does he/she + verb / He/She [verb-s] at [time] | asking_and_talking_about_daily_routines | When does he get up? He gets up at 6:00. |
| `bep2_lang_u6_003` | 94 | When do you + verb / I [verb] at [time] | asking_and_talking_about_daily_routines | When do you go to bed? I go to bed at 8:00. |
| `bep2_lang_u6_004` | 95 | start / finish with scheduled events | asking_about_schedules | When does the movie start? It starts at 8:00. |
| `bep2_lang_u6_005` | 98 | Wh- question words (who, what, when, where, how, how many) | asking_open_questions | Who are you? / What's your job? / Where do you work? / How do you get to work? / When do you work? / How many students are in your class? |
| `bep2_lang_u6_006` | 104 | Present simple routine statements and clarification questions | playing_language_game_and_verifying_truth | I go to bed at three o'clock. That's silly! When do you really go to bed? … |

All six language rows have `explicit_in_source: true`.

### 1.3 Vocabulary clusters — `BOOK_EVIDENCE`

| Cluster | Terms (selected) | Pages / IDs |
|---|---|---|
| Clock times | one–twelve o'clock | p.90; `bep2_vocab_u6_001`–`012` |
| Routine verbs | get up, go to bed, start school, go out, watch TV, finish school | pp.91–94; `bep2_vocab_u6_013`–`018` |
| CLIL timekeeping | candle, cup, fall, height, hourglass, sand, shadow, sundial, water clock | p.96; `bep2_vocab_u6_019`–`027` |
| Culture / values | tired, recess, on time, early | pp.100–102 |
| Phonics only | witch, ship, fish, chin, rich | p.103; `bep2_vocab_u6_032`–`036` |

### 1.4 Components and skills — `BOOK_EVIDENCE`

| component_id | Page | Type | Title |
|---|---:|---|---|
| `bep2_comp_u6_01` | 90 | vocabulary | Clock Times |
| `bep2_comp_u6_02` | 91 | song | What Time Is It? |
| `bep2_comp_u6_03` | 92 | story | Max's Day |
| `bep2_comp_u6_04` | 94 | grammar | Language in Action: When does/do...? |
| `bep2_comp_u6_05` | 96 | CLIL | Telling the Time |
| `bep2_comp_u6_06` | 98 | grammar | Grammar: Question Words |
| `bep2_comp_u6_07` | 100 | culture | My Day |
| `bep2_comp_u6_08` | 102 | values | Be on time. |
| `bep2_comp_u6_09` | 103 | phonics | ch, tch, sh |
| `bep2_comp_u6_10` | 104 | review | Unit 6 Review |

Activity types span listening, speaking (ask/answer), reading/matching, project presentation, phonics, and review games (38 activities).

### 1.5 New vs recycled within BE2 U6 — `AI_INTERPRETATION` (with evidence anchors)

| BE2 U6 target | Assessment | Basis |
|---|---|---|
| Clock times + `What time is it?` | **Genuinely new** vs BE1 | `MISSING_EVIDENCE` of any BE1 clock-time `language`/`vocabulary` o'clock set (BE1 scan found none) |
| `When do/does … at [time]` routines | **New frame** over prior daily-life / habitual talk | BE1 has home actions (U5 continuous) and `every day` meals (U7) but not clock-anchored `When` routines |
| `start` / `finish` schedules | **Genuinely new** | No matching BE1 schedule language found |
| Wh- question set (p.98) | **Mostly recycled forms in a new consolidated frame** | BE1 already has separate Who / What / Where / How many / How old items across U1–U8 (cited in §4) |
| Punctuality values / CLIL history of clocks | **New topical layers** | No BE1 equivalent components found |

### 1.6 WB corroboration (optional) — `BOOK_EVIDENCE`

BE2-WB Unit 6 *My Day* (`big_english_2_wb`, pp.74–87) also targets `When does/do…` schedule/routine language, Wh- information questions, and timekeeping CLIL vocab (o'clock, get up, go to bed, sundial, hourglass, …). Used only to corroborate that SB Unit 6 is not an isolated extraction artifact.

---

## 2. Prior-learning candidates (ranked)

### Rank 1 — BE1-SB Unit 5 *Busy at Home* (`bep1_unit_05`, pp.80–95)

**Relationship label (`AI_INTERPRETATION`):** *contrastive prior / partial prerequisite* — daily-life action talk in **present continuous**, not timed present-simple routines.

| Claim | Tag | Citation |
|---|---|---|
| Unit teaches present continuous home actions | `BOOK_EVIDENCE` | `bep1_lang_0501`–`0504` (pp.81–85): e.g. *What are you doing? I'm eating.*; *What's she doing? She's washing/sleeping.* |
| Theme includes “daily home activities” | `BOOK_EVIDENCE` | `bep1_unit_05.theme` |
| Vocabulary includes getting dressed, eating, sleeping, brushing teeth, etc. | `BOOK_EVIDENCE` | `bep1_vocab_0501`–`0512` (p.80) |
| These actions are thematically related to later “day” talk | `AI_INTERPRETATION` | Shared life-domain (home day), different tense/aspect and no clock anchoring |
| Exact routine verbs overlap with BE2 U6 target list | `MISSING_EVIDENCE` | Normalized-term overlap scan BE2-U6 ↔ BE1 units returned **no shared target terms** |
| BE1 U5 prepares the *function* of talking about what people do during a day | `UNCERTAIN` | Plausible pedagogically; not labeled by the books |

**WB corroboration:** BE1-WB U5 also centers present continuous household actions (`big_english_1_wb` U5).

### Rank 2 — BE1-SB Unit 7 *Party Time* (`bep1_unit_07`, pp.118–133) — meal-habit strand only

**Relationship label (`AI_INTERPRETATION`):** *partial prior* — early **habitual present simple** with frequency adverbial, without clock times.

| Claim | Tag | Citation |
|---|---|---|
| Habitual meals with `every day` | `BOOK_EVIDENCE` | `bep1_lang_0708` (p.130): *I eat breakfast/lunch/dinner every day.* |
| Negative present simple for habits/routines | `BOOK_EVIDENCE` | `bep1_lang_0706` (p.126) |
| Days of the week calendar talk | `BOOK_EVIDENCE` | `bep1_lang_0702` (p.120); vocab `bep1_vocab_0712`–`0718` |
| This is prior to BE2 clock-anchored routines | `AI_INTERPRETATION` | Same broad “daily habit” idea; different time expressions (`every day` vs `at 8:00`) |
| Food-possession grammar is prior to BE2 U6 | `AI_INTERPRETATION` rejected for U6 focus | `bep1_lang_0701`/`0703`/`0704` belong to food domain → better deferred to U7 experiment |

### Rank 3 — BE1 Wh-question inventory (distributed; not one unit)

**Relationship label (`AI_INTERPRETATION`):** *recycle into consolidated grammar page* for BE2 p.98.

| BE1 item | Tag | Citation |
|---|---|---|
| What is it? / How many…? | `BOOK_EVIDENCE` | U1 `bep1_lang_0001`, `bep1_lang_0009` |
| Who's he/she? / Who are they? | `BOOK_EVIDENCE` | U2 `bep1_lang_0201`–`0203` |
| What are you/he wearing? / How old…? | `BOOK_EVIDENCE` | U4 `bep1_lang_0402`, `0403`, `0407` |
| Where's / Where are…? | `BOOK_EVIDENCE` | U8 `bep1_lang_0802`, `0803` |
| BE2 U6 *When* as clock routine is new | `AI_INTERPRETATION` | BE1 has no `When do/does … at [time]` language rows in scan |

### Not retained as strong prior

| Candidate | Why |
|---|---|
| BE1 entire book as “daily English” | Too vague; violates protocol ban on topic-only progression |
| Invented BE1 clock unit | `MISSING_EVIDENCE` — see §6 and E4 |

---

## 3. Future-learning candidates (ranked)

### Rank 1 — BE3-SB Unit 1 *Wake Up!* (`big_english_3_sb_unit_01`, pp.4–19)

**Relationship label (`AI_INTERPRETATION`):** *extend* — continues timed routines with finer clock resolution, parts of day, `before`/`after`, and a full frequency-adverb set.

| Claim | Tag | Citation |
|---|---|---|
| `When does she wake up?` + o'clock answer | `BOOK_EVIDENCE` | `bep_3_sb_l0001` (p.5) |
| Specific non-hour times (8:10, 7:50) | `BOOK_EVIDENCE` | `bep_3_sb_l0002`, `l0004` (p.8); vocab `bep_3_sb_v0012`–`v0018` |
| Parts of day (`in the morning/afternoon/evening`) | `BOOK_EVIDENCE` | `bep_3_sb_l0003` (p.8); vocab `v0022`–`v0024` |
| `before` / `after` time sequencing | `BOOK_EVIDENCE` | `bep_3_sb_l0007` (p.11); `bep3_lang_0005` (p.18) |
| Frequency set always–never | `BOOK_EVIDENCE` | `bep3_lang_0001`–`0003` (pp.12–13); vocab `bep3_vocab_0001`–`0005` |
| Shared lexical signals with BE2 U6 | `BOOK_EVIDENCE` | Overlap scan: `four o'clock`, `seven o'clock`, `watch tv` |
| BE3 U1 **extends** BE2 U6 rather than merely repeating topic | `AI_INTERPRETATION` | Same routine domain; added precision, sequencing, frequency |
| Silly-time game continuity | `UNCERTAIN` | BE2 `bep2_lang_u6_006` (p.104) and BE3 `bep3_lang_0006` (p.19) both use “silly” time/routine checks; similarity is interpretive |

**WB corroboration:** BE3-WB U1 *Wake Up!* also has `When` routine questions, `before`/`after`, frequency adverbs, and telling time (`big_english_3_wb` U1).

### Rank 2 — BE3-SB Unit 8 *Healthy Living* (weak / partial)

**Relationship label (`AI_INTERPRETATION`):** *weak recycle* of bedtime/wake language inside a **past-tense / health** unit — not the primary vertical continuation.

| Claim | Tag | Citation |
|---|---|---|
| Example includes *I go to bed at 9:00 and wake up at 7:00* | `BOOK_EVIDENCE` | BE3 U8 language row `bep3_sb_lang_08_05` (coordinating conjunctions) |
| This unit’s main grammar is past simple / health habits | `BOOK_EVIDENCE` | Unit theme and surrounding U8 language inventory (not re-listed here; out of primary focus) |
| Treat as primary future link for BE2 U6 | `AI_INTERPRETATION` **rejected** | Domain shift; conjunction focus ≠ time-system extension |

### Rank 3 — BE3 U3 frequency recycle (secondary)

| Claim | Tag | Citation |
|---|---|---|
| Frequency adverbs with chores | `BOOK_EVIDENCE` | `be_plus_3_sb_lang_011` in U3 *Working Hard!* |
| Primary future for BE2 U6 frequency gap | `UNCERTAIN` | BE3 U1 already introduces the full set; U3 is a later recycle in chores domain |

---

## 4. Rejected false friends

| Candidate match | Why it is **not** educational progression | Tags |
|---|---|---|
| Shared “daily life / my day” **theme** labels across BE1 U5, BE2 U6, BE3 U1 | Theme string similarity does not equal shared grammar; BE1 U5 is continuous actions without clocks | `BOOK_EVIDENCE` of different `grammar_label`s; `AI_INTERPRETATION` that theme alone fails as progression |
| BE2 U6 ↔ BE1 **target vocab overlap ≈ 0** despite related themes | Shows recycled *topic* without recycled *lemmas* — cannot claim lexical recycling from Phase 1 target lists | `BOOK_EVIDENCE` (overlap scan empty); useful negative finding |
| BE1 U7 food unit ↔ BE2 U6 because both mention “routines” / meals | Food possession and taste classification are orthogonal to clock routines; meal `every day` is the only retained strand | `BOOK_EVIDENCE` for U7 food language; rejection is `AI_INTERPRETATION` scoped by protocol focus |
| BE1 `Can I help you?` (U2) as prior to any later modal | Not relevant to U6; noted only to avoid cross-experiment contamination (D016 candidate note) | Out of U6 scope |
| BE3 U9 `sand` vocab overlap with BE2 CLIL `sand` | Homograph/CLIL coincidence; no shared time-routine function | `BOOK_EVIDENCE` of term overlap only; `AI_INTERPRETATION` rejected as progression |
| Phonics items (`witch`, `ship`, `fish`…) as vertical curriculum links | Phonics set is local to BE2 U6 digraph practice | `BOOK_EVIDENCE`; no vertical claim |

**Protocol secondary question 2 (where topic/vocab fails):** The strongest failure mode in this run is **theme match without tense/time-system match** (BE1 U5 ↔ BE2 U6) and **accidental lemma overlap** (BE3 U9 `sand`).

---

## 5. Experiment lessons (method notes for next runs)

1. **Separate time-system from life-domain.** “Daily routines” must be split into continuous action, habitual frequency, and clock-anchored scheduling before claiming progression.  
2. **Always run a negative vocab-overlap check.** Zero overlap can be as informative as high overlap.  
3. **Consolidated grammar pages** (BE2 Wh-set) need distributed prior citations, not a single prior unit.  
4. **WB triangulation** is useful for corroborating SB targets but must not replace SB citations.  
5. **Primary future link can coexist with weak secondary recycles** (BE3 U1 vs U8 bedtime example) — rank them explicitly.  
6. **Do not invent missing prior clock teaching** when the gap is real — mark `MISSING_EVIDENCE` and proceed.  
7. Keep relationship labels (*extend*, *contrastive prior*, *recycle*, *reject*) provisional until owner review.

---

## 6. Open gaps

| Gap | Tag | Impact on later Phase 3 |
|---|---|---|
| No BE1 dedicated clock-time unit / o'clock vocabulary | `MISSING_EVIDENCE` | Any Phase 3 edge “BE1 clocks → BE2 clocks” would be unsupported |
| No publisher-authored cross-level prerequisite map in Phase 1 JSON | `MISSING_EVIDENCE` | All vertical links remain interpretation |
| Wh-question “how” (manner / transport) prior for BE2 *How do you get to work?* is thin | `UNCERTAIN` | BE1 has *How old* / *How many* but not clearly *How do you…* transport |
| Whether song/story continuous_text should count as equal evidence to `language[]` rows | `UNCERTAIN` | Method choice for future protocols |
| Exact pedagogical sequencing intent (why o'clock before half-hours) | Outside Phase 1 evidence | Do not invent; leave to owner / later docs |

---

## 7. Answers to experiment questions (summary)

**Primary question:** Linguistically meaningful priors are mainly **BE1 U5 continuous home actions** (contrastive) and **BE1 U7 `every day` habits** (partial), plus **distributed Wh-forms**. The meaningful future is mainly **BE3 U1 Wake Up!**, which adds finer times, parts of day, `before`/`after`, and frequency adverbs. Every retained link above is tagged so teachers can separate evidence from interpretation.

**Secondary 1 (new vs recycled):** Clock times, `When … at [time]`, and schedule `start`/`finish` are new vs BE1; Wh-forms are largely recycled into one page; CLIL/values layers are new topical content.

**Secondary 2 (topic/vocab failure):** Theme-only “daily life” and accidental `sand` overlap fail as progression signals.

**Secondary 3 (Phase 3 blockers):** Missing BE1 clocks; no explicit publisher cross-level links; Wh-*how* prior thin.

---

## 8. Evaluation against E1–E6

| # | Criterion | Result | Notes |
|---|---|---|---|
| E1 | Separate `BOOK_EVIDENCE` from `AI_INTERPRETATION` on material claims | **PASS** | Tags used throughout §§1–6 |
| E2 | Cite concrete Phase 1 entities for retained links | **PASS** | Unit/language/vocab/component IDs + printed pages |
| E3 | ≥1 rejected same-topic / shared-vocab non-progression | **PASS** | §4 theme-only daily life; empty BE1 vocab overlap; BE3 `sand` |
| E4 | State BE1 clock-time absence; do not invent prior clock unit | **PASS** | §§1.5, 2, 6 |
| E5 | 3–7 actionable method notes | **PASS** | Seven notes in §5 |
| E6 | No locked Phase 2 schema or Phase 3 map | **PASS** | Explicit non-lock; sketches marked not locked |

### Weaknesses / uncertainties (honest)

- Several retained links are **functional/thematic** rather than lemma-identical; strength depends on accepting aspect/time-system reasoning as valid Phase 2 interpretation.  
- Rank 3 Wh-prior is a **composite** across many BE1 units — harder to teach as a single “prior unit.”  
- Silly-game continuity BE2↔BE3 is tagged `UNCERTAIN` and should not be oversold.  
- Optional WB corroboration was light (titles + language labels), not a full SB↔WB activity map.  
- Owner may reject Rank 1 prior (U5) if continuous→simple is considered too weak without shared verbs.

### Unsupported conclusions **not** made

- No claim that BE1 teaches telling time.  
- No claim that BE3 U8 is the main sequel to BE2 U6.  
- No Phase 2 schema fields proposed as locked.

---

## 9. Questions for owner review

1. Accept **BE1 U5** as a valid *contrastive prior* for BE2 U6, or require shared verbs before retaining?  
2. Accept **composite Wh-prior** (distributed BE1 units) as a first-class prior-learning candidate type?  
3. Is the BE2↔BE3 “silly time” parallel worth tracking, or discard as stylistic coincidence?  
4. After this artifact: **accept and queue U7**, **revise protocol**, or **re-run U6** with tighter rules?  
5. Should future experiment artifacts live under `docs/phase-2/` with the `p2-exp-…-review.md` naming used here?

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | First execution of `P2-EXP-BE2-U06-v1`; artifact created for owner review. |
