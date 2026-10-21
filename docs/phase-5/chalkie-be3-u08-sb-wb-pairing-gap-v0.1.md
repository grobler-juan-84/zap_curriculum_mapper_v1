# BE3 Unit 8 — Student Book → Workbook pairing (v0.1)

**Status:** Opener **ACCEPTED** (+ series pilot) · Story handoff **ACCEPTED FOR PROVISIONAL USE** · LiA SB 132–133 → WB 107–108 **ACCEPTED** (docs mapping only; no handoff) · 106–107 pair **REJECTED**  
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

## 5. Workspace consequence

| Behaviour | Status |
| --- | --- |
| SB 128–129 companion | WB 104–105 · series **on** (opener handoff + production pilot) |
| SB 130–131 companion | WB **106 only** · series **on** · handoff **ACCEPTED FOR PROVISIONAL USE** |
| SB 132–133 companion | WB 107–108 · **docs-mapped ACCEPTED**; resolver/series handoff **not** enabled |
| Other BE3 U8 spreads | No companion / no series unless separately reviewed |
| Automatic pairing rule | **None** |

---

## 6. Next microstep

Owner-gated: wire the LiA curated companion in app code (smallest safe resolver entry), **or** content-review the next component-map row (e.g. Content Connection SB 134–135 ↔ WB 109–110) — do not build a LiA series handoff or authorize Chalkie without a separate step.

---

## 7. Boundaries

- No general automatic SB→WB pairing rule.  
- No AI/API / Chalkie generation authorized by this LiA verdict.  
- No D018 / `4-decisions.md` changes.  
- This ACCEPTED mapping is a **documentation** record only until a separate code step adds it to the curated companion table.
