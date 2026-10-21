# BE3 Unit 8 — Student Book → Workbook pairing (v0.1)

**Status:** Opener **ACCEPTED** (+ series pilot) · Story handoff **ACCEPTED FOR PROVISIONAL USE** · LiA / CLIL P.E. / Grammar / Culture / Writing **ACCEPTED** (docs) · 106–107 **REJECTED**  
**Date:** 2026-10-20 (updates through 2026-10-21)  
**Scope:** Big English 3 · Unit 8 *Healthy Living* · curated SB↔WB reviews one pair at a time

**Related:**  
[`chalkie-be3-u08-sb-wb-component-map-v0.1.md`](./chalkie-be3-u08-sb-wb-component-map-v0.1.md) ·  
[`chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md`](./chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md) ·  
[`chalkie-be3-u08-production-pilot-plan-v0.1.md`](./chalkie-be3-u08-production-pilot-plan-v0.1.md) ·  
[`p5-prototype-chalkie-workspace.md`](./p5-prototype-chalkie-workspace.md) ·  
Code: `verifiedSbWbCompanions.ts` · `buildBe3U08OpenerSbWbSeriesHandoff.ts` · `buildBe3U08StorySbWbSeriesHandoff.ts`

---

## 1. Accepted — SB pp.128–129 → WB pp.104–105 (opener)

| Field | Value |
| --- | --- |
| Relationship ID | `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105` |
| Pages | SB `bep3_sb_p128`/`bep3_sb_p129` → WB `bep_3_wb_p104`/`bep_3_wb_p105` |
| Series package | **Enabled** (six copyables + production pilot PASS AFTER LIGHT TEACHER REVIEW) |

---

## 2. Accepted — SB pp.130–131 → WB p.106 only (story, asymmetric)

**Companion ACCEPTED** after source review against **WB p.106 only**. WB p.107 explicitly excluded (Language in Action; already rejected as part of 106–107).

### Evidence table

| Lens | Student Book pp.130–131 | Workbook p.106 | Aligns? |
| --- | --- | --- | --- |
| Unit identity | Unit 8 *Healthy Living* | Unit 8 *Healthy Living* | Yes |
| Page IDs | `bep3_sb_p130`, `bep3_sb_p131` | `bep_3_wb_p106` | — |
| Component / type | Story + Reading · *An Unhealthy Dinner* | Story · *An Unhealthy Dinner* (notes) | Yes |
| Target vocabulary | No dedicated SB rows | *unhealthy* (target) | Compatible |
| Target language | Story listen/read; Act 7 Amy-dinner read-and-choose | Act 5 *Did Amy…? / Yes, she did / No, she didn’t* | Yes |
| Activity purpose | Listen/read story; comprehend unhealthy dinner | Story Yes/No short answers; personal dinner write/draw; Think Big healthy/unhealthy | Yes — consolidates story |
| Page-count shape | 2 SB pages | **1 WB page** | Valid (component map) |
| Excluded | — | **p.107 LiA** not in this relationship | — |

### Exact mapping

| Field | Value |
| --- | --- |
| Relationship ID | `be3_sb_wb_rel_u08_story_sb130-131_wb106` |
| Type | `workbook_practice_for` · `human_verified` · `curated_verified` |
| SB | `big_english_3_sb` · pp.130–131 |
| WB | `big_english_3_wb` · **p.106 only** |
| Series package | **Enabled** — six local copyables; L1 = SB 130–131; L2 = WB **106 only**; title `BE3 Unit 08 · SB pp. 130–131 + WB p. 106 — Healthy Living — An Unhealthy Dinner`; ref `be3-sb-wb-u08-p130-131-wb106` (shown separately). |

### Handoff verdict (2026-10-21)

**ACCEPTED FOR PROVISIONAL USE**

| Claim | Status |
| --- | --- |
| Local asymmetric series handoff is structurally sound and source-bounded | **Yes** |
| Preferred Chalkie workflow for any later use | Detailed handoff + appended concise outline + scoped vocabulary + teacher review |
| Further Chalkie generation / experiments for this Story component | **Not required now** — do not run more |
| Chalkie export generated for this story route | **No** — not claimed |
| Classroom-validated slides for this story route | **No** — not claimed |
| Teacher review if/when Chalkie is used later | Final safeguard for slides, grammar, answers/reveals, invented publisher-like wording, timing, and visual/text quality |

Chalkie itself cannot be controlled beyond that preferred workflow; acceptance here is of the **local handoff/workflow**, not of a generated export.

---

## 3. Rejected — SB pp.130–131 → WB pp.106–107

**REJECTED** earlier: p.106 matches the story, but **p.107 is Language in Action**, so the two-page WB block is not a valid companion for Story/Reading.

---

## 4. Accepted — SB pp.132–133 → WB pp.107–108 (Language in Action)

**ACCEPTED** after source review (2026-10-21). Same Unit 8 *Healthy Living* · Language in Action component. Workbook consolidates SB *Did…?* / *did–didn't* short-answer practice; not a different strand. No handoff built; no Chalkie generation authorized.

### Evidence table

| Lens | Student Book pp.132–133 | Workbook pp.107–108 | Aligns? |
| --- | --- | --- | --- |
| Unit identity | Unit 8 *Healthy Living* (`big_english_3_sb_unit_08`) | Unit 8 *Healthy Living* (`big_english_3_wb_unit_08`) | Yes |
| Page IDs | `bep3_sb_p132`, `bep3_sb_p133` | `bep_3_wb_p107`, `bep_3_wb_p108` | — |
| Component / type | Language in Action · `grammar_practice` | Language in Action · `language_in_action` | Yes |
| Target language / models | *Did you have breakfast? / No, I didn't.* · *Did he get enough sleep? / Yes, he did.* (past simple *Did…?* + short answers) | Act 8 *did/didn't* dialogues; Act 10 *Did he get enough sleep?* → *Yes/No, he/she did/didn't* | Yes |
| Activity purpose | Present/practise *Did…?* ask–answer (Acts 8–12: listen/look, match phrases, complete dialogs, scramble questions, read and match) | Consolidate LiA: weekend listen/stick (Act 7); *did/didn't* dialogs (Act 8); picture past phrases (Act 9) feeding *Did…?* answers (Act 10) | Yes — consolidates LiA |
| Page-count shape | 2 SB pages | 2 WB pages | Valid (component map 2→2) |
| Scope / excluded | — | **WB p.106 Story** out of scope (story companion). No later Grammar/CLIL pages. | — |

### Exact mapping (docs record only — not wired in app code)

| Field | Value |
| --- | --- |
| Relationship ID | `be3_sb_wb_rel_u08_lia_sb132-133_wb107-108` |
| Type | `workbook_practice_for` · `human_verified` (docs-recorded; **not** yet in `verifiedSbWbCompanions.ts`) |
| SB | `big_english_3_sb` · pp.132–133 |
| WB | `big_english_3_wb` · pp.107–108 |
| Stable reference | `be3-sb-wb-u08-p132-133-wb107-108` |
| Series handoff / Chalkie | **Not built** · **not authorized** |

---

## 5. Accepted — SB pp.134–135 → WB pp.109–110 (Content Connection / P.E.)

**ACCEPTED** after source review (2026-10-21). Same Unit 8 *Healthy Living* · Content Connection / P.E. (*What Is a Calorie?*). Workbook consolidates calorie / energy / activity content-words and CLIL reading practice; not a different strand. No handoff built; no app wiring; no Chalkie generation authorized.

### Evidence table

| Lens | Student Book pp.134–135 | Workbook pp.109–110 | Aligns? |
| --- | --- | --- | --- |
| Unit identity | Unit 8 *Healthy Living* | Unit 8 *Healthy Living* | Yes |
| Page IDs | `bep3_sb_p134`, `bep3_sb_p135` | `bep_3_wb_p109`, `bep_3_wb_p110` | — |
| Component / type | Content Connection \| P.E. · `clil_pe` / `clil_pe_project` · *What Is a Calorie?* | Content Connection · `clil_pe` · *P.E. \| Content Connection* | Yes |
| Target vocabulary | *active, activities, body, burn, calorie, in shape, measure, put on weight, rest* | *calorie, measure, put on weight, active, energy* (+ cloze: *activities, watching TV*) | Yes — shared CLIL set |
| Target language | Content-word reading; comprehension Qs about calories, weight, exercise | Cloze + listen/circle + match on calorie/energy/active ideas | Yes |
| Activity purpose | Predict; listen/read article; answer; good/bad body chart; partner talk; Exercise Chart project | Complete calorie text; check with audio; match ideas; activity diagram; Think Big healthy choices | Yes — consolidates CLIL P.E. |
| Page-count shape | 2 SB pages | 2 WB pages | Valid (component map 2→2) |
| Scope / excluded | — | LiA 107–108 and Grammar 111–112 out of scope | — |

### Exact mapping (docs record only — not wired in app code)

| Field | Value |
| --- | --- |
| Relationship ID | `be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110` |
| Type | `workbook_practice_for` · `human_verified` (docs-recorded; **not** yet in `verifiedSbWbCompanions.ts`) |
| SB | `big_english_3_sb` · pp.134–135 |
| WB | `big_english_3_wb` · pp.109–110 |
| Stable reference | `be3-sb-wb-u08-p134-135-wb109-110` |
| Series handoff / Chalkie | **Not built** · **not authorized** |

---

## 6. Accepted — SB pp.136–137 → WB pp.111–112 (Grammar)

**ACCEPTED** after source review (2026-10-21). Same Unit 8 *Healthy Living* · Grammar · past simple regular (*-ed* spelling) + irregular forms. Workbook consolidates that morphology and extends with past questions/negatives on the **same** past-simple strand (not a different grammar topic). Distinct from LiA communicative *Did…?* practice on 132–133 / 107–108. No handoff built; no app wiring; no Chalkie generation authorized.

### Evidence table

| Lens | Student Book pp.136–137 | Workbook pp.111–112 | Aligns? |
| --- | --- | --- | --- |
| Unit identity | Unit 8 *Healthy Living* | Unit 8 *Healthy Living* | Yes |
| Page IDs | `bep3_sb_p136`, `bep3_sb_p137` | `bep_3_wb_p111`, `bep_3_wb_p112` | — |
| Component / type | Grammar · `grammar` | Grammar · `grammar` | Yes |
| Target language / models | Regular past (*played/walked/stayed*; spelling rules) + irregular (*went/saw/came*); yesterday speaking frames | Regular spelling chart (*climbed/tried/changed/dropped*); irregular base→past; *didn't* negatives; *Did…?* / *was/were* Q&A | Yes — same past-simple strand |
| Activity purpose | Listen/read; classify regular *-ed*; complete past narrative; match irregulars; tell about yesterday | Classify regulars; write irregulars; narrative cloze; complete *Did…?* Q&A; write negatives | Yes — consolidates + extends Grammar |
| Page-count shape | 2 SB pages | 2 WB pages | Valid (component map 2→2) |
| Scope / excluded | — | LiA 107–108 and CLIL 109–110 out of scope | — |

### Exact mapping (docs record only — not wired in app code)

| Field | Value |
| --- | --- |
| Relationship ID | `be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112` |
| Type | `workbook_practice_for` · `human_verified` (docs-recorded; **not** yet in `verifiedSbWbCompanions.ts`) |
| SB | `big_english_3_sb` · pp.136–137 |
| WB | `big_english_3_wb` · pp.111–112 |
| Stable reference | `be3-sb-wb-u08-p136-137-wb111-112` |
| Series handoff / Chalkie | **Not built** · **not authorized** |

---

## 7. Accepted — SB pp.138–139 → WB pp.113–114 (Culture Connection)

**ACCEPTED** after source review (2026-10-21). Same Unit 8 *Healthy Living* · Culture Connection / Around the World · *Strange Sports* (Octopush, Footvolley, Pumpkin Regatta). Workbook consolidates that culture reading strand; not a different topic. No handoff built; no app wiring; no Chalkie generation authorized.

### Evidence table

| Lens | Student Book pp.138–139 | Workbook pp.113–114 | Aligns? |
| --- | --- | --- | --- |
| Unit identity | Unit 8 *Healthy Living* | Unit 8 *Healthy Living* | Yes |
| Page IDs | `bep3_sb_p138`, `bep3_sb_p139` | `bep_3_wb_p113`, `bep_3_wb_p114` | — |
| Component / type | Culture Connection \| Around the World · `culture` / `culture_activities` · *Strange Sports* | Culture Connection · `culture_connection` · *Around the World* | Yes |
| Target vocabulary | *contest, court, net, puck, race, regatta, rowing, scuba diving, team* | Supporting: *octopush, pumpkin regatta, footvolley*; cloze words *kick, net, regattas, rowing, score, Teams* | Yes — same sports strand |
| Target language / purpose | Match sports/countries; listen/read *Strange Sports*; T/F; complete sports chart | Quick match (Octopush/Footvolley/Pumpkin); listen/read/write; match reasons; T/F; Think Big invent a sport | Yes — consolidates culture reading |
| Page-count shape | 2 SB pages | 2 WB pages | Valid (component map 2→2) |
| Scope / excluded | — | Grammar 111–112 and Writing 115 out of scope | — |

### Exact mapping (docs record only — not wired in app code)

| Field | Value |
| --- | --- |
| Relationship ID | `be3_sb_wb_rel_u08_culture_sb138-139_wb113-114` |
| Type | `workbook_practice_for` · `human_verified` (docs-recorded; **not** yet in `verifiedSbWbCompanions.ts`) |
| SB | `big_english_3_sb` · pp.138–139 |
| WB | `big_english_3_wb` · pp.113–114 |
| Stable reference | `be3-sb-wb-u08-p138-139-wb113-114` |
| Series handoff / Chalkie | **Not built** · **not authorized** |

---

## 8. Accepted — SB p.140 → WB p.115 (Writing, 1→1)

**ACCEPTED** after source review (2026-10-21). Same Unit 8 *Healthy Living* · Writing · *Combining Sentences with and, but, or*. Workbook consolidates that conjunction-writing work. Valid **1→1** component relationship. No handoff built; no app wiring; no Chalkie generation authorized.

### Evidence table

| Lens | Student Book p.140 | Workbook p.115 | Aligns? |
| --- | --- | --- | --- |
| Unit identity | Unit 8 *Healthy Living* | Unit 8 *Healthy Living* | Yes |
| Page IDs | `bep3_sb_p140` | `bep_3_wb_p115` | — |
| Component / type | Writing · `writing` · *Combining Sentences with and, but, or* | Writing · `writing` · *Combining Sentences with and, but, or* | Yes |
| Target language | Coordinating conjunctions *and / but / or* to join sentences | Same *and / but / or* joining clauses | Yes |
| Activity purpose | Gap-fill + listen check; join sentence pairs; read and choose; write three healthy-habit sentences using each conjunction once | Circle *and/but/or*; complete clauses from a box; paragraph cloze with *or/but/and* | Yes — consolidates writing |
| Page-count shape | 1 SB page | 1 WB page | Valid (component map 1→1) |
| Scope / excluded | — | Culture 113–114 and Phonics 116 out of scope | — |

### Exact mapping (docs record only — not wired in app code)

| Field | Value |
| --- | --- |
| Relationship ID | `be3_sb_wb_rel_u08_writing_sb140_wb115` |
| Type | `workbook_practice_for` · `human_verified` (docs-recorded; **not** yet in `verifiedSbWbCompanions.ts`) |
| SB | `big_english_3_sb` · p.140 |
| WB | `big_english_3_wb` · p.115 |
| Stable reference | `be3-sb-wb-u08-p140-wb115` |
| Series handoff / Chalkie | **Not built** · **not authorized** |
| Recommended future packaging | **single lesson likely** (1→1 writing pair; not assumed as a two-lesson series) |

---

## 9. Workspace consequence

| Behaviour | Status |
| --- | --- |
| SB 128–129 companion | WB 104–105 · series **on** (opener handoff + production pilot) |
| SB 130–131 companion | WB **106 only** · series **on** · handoff **ACCEPTED FOR PROVISIONAL USE** |
| SB 132–133 · 134–135 · 136–137 · 138–139 | WB 107–108 · 109–110 · 111–112 · 113–114 · **docs-mapped ACCEPTED**; resolver/series **not** enabled |
| SB 140 companion | WB 115 · **docs-mapped ACCEPTED** (1→1); resolver/series **not** enabled |
| Other BE3 U8 spreads | No companion / no series unless separately reviewed |
| Automatic pairing rule | **None** |

---

## 10. Next microstep

Owner-gated: wire one docs-accepted companion in app code, **or** content-review the next map row (e.g. Phonics SB 141 ↔ WB 116, 1→1) — do not build handoffs or authorize Chalkie without a separate step.

---

## 11. Boundaries

- No general automatic SB→WB pairing rule.  
- No AI/API / Chalkie generation authorized by these docs-only ACCEPTED mappings.  
- No D018 / `4-decisions.md` changes.  
- Docs ACCEPTED mappings are **documentation** only until a separate code step adds them to the curated companion table.
