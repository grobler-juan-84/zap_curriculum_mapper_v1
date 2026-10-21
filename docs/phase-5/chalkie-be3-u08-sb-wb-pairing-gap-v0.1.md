# BE3 Unit 8 — Student Book → Workbook pairing (v0.1)

**Status:** Opener **ACCEPTED** (+ series pilot) · Story handoff **ACCEPTED FOR PROVISIONAL USE** (SB 130–131 → WB **p.106 only**) · 106–107 pair **REJECTED**  
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

## 4. Workspace consequence

| Behaviour | Status |
| --- | --- |
| SB 128–129 companion | WB 104–105 · series **on** (opener handoff + production pilot) |
| SB 130–131 companion | WB **106 only** · series **on** · handoff **ACCEPTED FOR PROVISIONAL USE** (no story Chalkie export claimed) |
| Other BE3 U8 spreads | No companion / no series unless separately reviewed |
| Automatic pairing rule | **None** |

---

## 5. Next microstep

Content-review the next **evidence-backed** component-map candidate (e.g. Language in Action SB 132–133 ↔ WB 107–108) — do not bulk-approve the map; do not run further Story Chalkie experiments now.

---

## 6. Boundaries

- No general automatic SB→WB pairing rule.  
- No AI/API / Chalkie generation authorized by this story verdict.  
- No D018 / `4-decisions.md` changes.
