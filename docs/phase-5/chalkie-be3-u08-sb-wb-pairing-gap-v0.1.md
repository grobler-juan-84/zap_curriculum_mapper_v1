# BE3 Unit 8 — Student Book → Workbook pairing (v0.1)

**Status:** Opener pair **ACCEPTED** + handoff/pilot complete · Story candidate SB 130–131 → WB 106–107 **REJECTED**  
**Date:** 2026-10-20 (pilot results 2026-10-21 · story-candidate review 2026-10-21)  
**Scope:** Big English 3 · Unit 8 *Healthy Living* · curated SB↔WB reviews one pair at a time

**Related:**  
[`chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md`](./chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md) ·  
[`chalkie-be3-u08-production-pilot-plan-v0.1.md`](./chalkie-be3-u08-production-pilot-plan-v0.1.md) ·  
[`p5-prototype-chalkie-workspace.md`](./p5-prototype-chalkie-workspace.md) ·  
[`../phase-1/audits/BE3-SB_canonical_v1_audit.md`](../phase-1/audits/BE3-SB_canonical_v1_audit.md) ·  
[`../phase-1/audits/BE3-WB_canonical_v1_audit.md`](../phase-1/audits/BE3-WB_canonical_v1_audit.md) ·  
Code: `app/src/features/chalkie/verifiedSbWbCompanions.ts` · `buildBe3U08OpenerSbWbSeriesHandoff.ts`

---

## 1. Accepted pair — SB pp.128–129 → WB pp.104–105

**ACCEPTED** — one explicit curated relationship for this pair only.

Not accepted as a general Unit 8 pagination rule. Unmapped BE3 spreads still have **no** Workbook companion unless separately reviewed.

### SB versus WB evidence table

| Lens | Student Book pp.128–129 | Workbook pp.104–105 | Aligns? |
| --- | --- | --- | --- |
| Unit identity | Unit 8 *Healthy Living* (`big_english_3_sb_unit_08`, human_verified) | Unit 8 *Healthy Living* (`big_english_3_wb_unit_08`, human_verified) | Yes |
| Page IDs | `bep3_sb_p128`, `bep3_sb_p129` | `bep_3_wb_p104`, `bep_3_wb_p105` | — |
| Section / type | Vocabulary + Song / Vocabulary | unit_opener_vocabulary + song_practice | Yes (opener strand) |
| Target vocabulary | Healthy/unhealthy activity phrases (present) | Same strand in past/contrast forms | Yes |
| Target language | Act 5: *Did he/she…? / Yes, she did / No, he didn’t* | Acts 2–4: *Did you…? / Yes, I did / No, I didn’t* | Yes |
| Activity purpose | Present vocab, song *Live Right!*, ask-and-answer | Label/check, personal Did you…?, song listen/write | Yes — WB consolidates SB opener |
| Pagination alone | First SB spread of U8 | First WB spread of U8 | **Not used as approval basis** |

### Exact mapping

| Field | Value |
| --- | --- |
| Relationship ID | `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105` |
| Type | `workbook_practice_for` · `human_verified` · `curated_verified` |
| SB | `big_english_3_sb` · pp.128–129 · `bep3_sb_p128`, `bep3_sb_p129` |
| WB | `big_english_3_wb` · pp.104–105 · `bep_3_wb_p104`, `bep_3_wb_p105` |

Series handoff + production pilot for this pair: **built** / **PASS AFTER LIGHT TEACHER REVIEW**. See results doc. Local handoff unchanged after the teacher edit.

---

## 2. Candidate review — SB pp.130–131 → WB pp.106–107

**Verdict: REJECTED** (2026-10-21)

Candidate was reviewed from Phase 1 canonical evidence for all four pages. **Not** approved because pages advance in parallel within Unit 8.

### SB versus WB evidence table

| Lens | Student Book pp.130–131 | Workbook pp.106–107 | Aligns? |
| --- | --- | --- | --- |
| Unit identity | Unit 8 *Healthy Living* (`big_english_3_sb_unit_08`, human_verified) | Unit 8 *Healthy Living* (`big_english_3_wb_unit_08`, human_verified) | Yes (same unit only) |
| Page IDs | `bep3_sb_p130`, `bep3_sb_p131` | `bep_3_wb_p106`, `bep_3_wb_p107` | — |
| Page / component type | Story + Reading (`story` · `reading_comprehension`); component *An Unhealthy Dinner* | p.106 Story (*An Unhealthy Dinner*) · **p.107 Language in Action** (`language_in_action` / grammar) | **No as a two-page companion** — p.107 is a different strand |
| Target vocabulary | No dedicated SB vocab rows on 130–131 | p.106: *unhealthy*; p.107: no story vocab — weekend/habit LiA practice | Weak / mixed |
| Target language / grammar | Story listen/read + Act 7 read-and-choose about Amy’s dinner (party, unhealthy food, fries, fried food, cola/sugar) | p.106: *Did Amy…? / Yes, she did / No, she didn’t* about the dinner; p.107: weekend stickers + *did/didn’t* dialogues (exercise, sleep, breakfast, lunch) | p.106 yes · **p.107 no** for this SB lesson |
| Activity purpose | Listen/read *An Unhealthy Dinner*; comprehend why the dinner was unhealthy | p.106: story Yes/No short answers + personal dinner write/draw; **p.107: LiA listen/stick + dialogue completion** | p.106 consolidates story · **p.107 does not** |
| Practises / consolidates / extends specific SB 130–131? | — | Only **p.106** clearly consolidates the story. **p.107** is Language in Action (closer in role to SB LiA pp.132–133), not Story/Reading support. | **No for candidate pair 106–107** |
| Pagination alone | Second SB spread of U8 | Second WB “block” of U8 | **Insufficient — rejected on this basis alone if content failed** |

### Rejection rationale

1. **WB p.106** is a strong story-practice match for *An Unhealthy Dinner* (shared title/component; Amy dinner *Did…?* comprehension; healthy/unhealthy extension).  
2. **WB p.107** is **Language in Action** (Track 156 stickers; Grace/Carlos weekend; *did/didn’t* dialogues about exercise/sleep/meals) — **not** story/reading consolidation of SB pp.130–131.  
3. Accepting **106–107 as one companion** would package a mismatched LiA page into a Story/Reading relationship, relying on same-unit adjacency rather than specific spread support.  
4. **No mapping added.** No code fallback. Existing opener pair `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105` unchanged.

**Note (not a mapping):** a future owner-gated review could consider **SB 130–131 → WB p.106 only** (or another explicit single-page/scoped relationship). That is **not** accepted here.

---

## 3. Workspace consequence

| Behaviour | Status |
| --- | --- |
| Companion for SB 128–129 | Resolves to WB 104–105; series package available for that pair only |
| Companion for SB 130–131 | **None** (candidate 106–107 rejected) |
| Other BE3 U8 spreads | No companion unless separately reviewed |
| Automatic SB→WB rule | **None** |

---

## 4. Next microstep

Owner-gated: Single Lesson for SB pp.130–131 (no WB series), or content-review a **different** explicit SB→WB candidate (e.g. scoped WB p.106-only, or SB 132–133 ↔ WB LiA) — do not broaden pairing rules; do not generate without authorization.

---

## 5. Boundaries

- No general automatic SB→WB pairing rule.  
- No AI/API.  
- No Chalkie generation in-app.  
- No D018 / `4-decisions.md` changes.  
- Preserve accepted opener pairing and its production-pilot record.
