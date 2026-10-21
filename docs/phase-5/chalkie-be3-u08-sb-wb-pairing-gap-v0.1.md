# BE3 Unit 8 — Student Book → Workbook pairing (v0.1)

**Status:** PAIRING **ACCEPTED** · SERIES HANDOFF **BUILT** · first production pilot **PASS AFTER LIGHT TEACHER REVIEW**  
**Date:** 2026-10-20 (pilot results 2026-10-21)  
**Scope:** Big English 3 · Unit 8 *Healthy Living* · SB pp. **128–129** ↔ WB pp. **104–105**

**Related:**  
[`chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md`](./chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md) ·  
[`chalkie-be3-u08-production-pilot-plan-v0.1.md`](./chalkie-be3-u08-production-pilot-plan-v0.1.md) ·  
[`p5-prototype-chalkie-workspace.md`](./p5-prototype-chalkie-workspace.md) ·  
[`../phase-1/audits/BE3-SB_canonical_v1_audit.md`](../phase-1/audits/BE3-SB_canonical_v1_audit.md) ·  
[`../phase-1/audits/BE3-WB_canonical_v1_audit.md`](../phase-1/audits/BE3-WB_canonical_v1_audit.md) ·  
Code: `app/src/features/chalkie/verifiedSbWbCompanions.ts` · `buildBe3U08OpenerSbWbSeriesHandoff.ts`

---

## 1. Verdict

**ACCEPTED** — one explicit curated relationship for this pair only.

Not accepted as a general Unit 8 pagination rule. Unmapped BE3 spreads still have **no** Workbook companion and **no** series package.

---

## 2. SB versus WB evidence table

| Lens | Student Book pp.128–129 | Workbook pp.104–105 | Aligns? |
| --- | --- | --- | --- |
| Unit identity | Unit 8 *Healthy Living* (`big_english_3_sb_unit_08`, human_verified) | Unit 8 *Healthy Living* (`big_english_3_wb_unit_08`, human_verified) | Yes |
| Page IDs | `bep3_sb_p128`, `bep3_sb_p129` | `bep_3_wb_p104`, `bep_3_wb_p105` | — |
| Section / type | Vocabulary + Song / Vocabulary | unit_opener_vocabulary + song_practice | Yes (opener strand) |
| Target vocabulary | Healthy/unhealthy activity phrases (present): *have a big breakfast*, *drink lots of water*, *ride a bike*, *get enough sleep*, … | Same strand in past/contrast forms: *ate a healthy breakfast*, *drank lots of water*, *rode a bike*, *got ten hours of sleep*, plus unhealthy contrasts | Yes |
| Target language | Act 5: *Did he eat breakfast? / No, he didn’t.* · *Did she ride her bike? / Yes, she did.* | Acts 2–4: *Did you…?* sleep/water/bike/lunch/exercise; *Yes, I did / No, I didn’t* | Yes |
| Activity purpose | Present vocab (listen/look/say), song *Live Right!*, ask-and-answer | Write/check healthy activities, personal Did you…?, song listen/write (Track 153), Yes/No table | Yes — WB consolidates SB opener |
| Pagination alone | First SB spread of U8 | First WB spread of U8 | **Not used as approval basis** |

**Rationale:** content overlap (vocab set, Did…? practice, song strand) shows the Workbook spread practises/consolidates the Student Book opener. Position-in-unit alone was insufficient and was not the acceptance criterion.

---

## 3. Exact mapping

| Field | Value |
| --- | --- |
| Relationship ID | `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105` |
| Type | `workbook_practice_for` |
| Verification | `human_verified` (curated after content review) |
| Source | `curated_verified` (not a pagination heuristic) |
| SB catalog | `big_english_3_sb` |
| SB pages | 128–129 · `bep3_sb_p128`, `bep3_sb_p129` |
| WB catalog | `big_english_3_wb` |
| WB pages | 104–105 · `bep_3_wb_p104`, `bep_3_wb_p105` |

Stored in `app/src/features/chalkie/verifiedSbWbCompanions.ts`. Recognised by `resolveVerifiedSbWbCompanion`.

---

## 4. Series handoff (this pair only)

When this exact pair is selected, `/app/chalkie` enables **Two-lesson series** and shows six local copyables:

1. Series title  
2. Detailed two-lesson Chalkie handoff  
3. Lesson 1 concise outline (SB 128–129)  
4. Lesson 1 suggested vocabulary  
5. Lesson 2 concise outline (WB 104–105)  
6. Lesson 2 suggested vocabulary  

Stable series ref (shown separately, not in the copied title): `be3-sb-wb-u08-p128-129-wb104-105`

Builder: `buildBe3U08OpenerSbWbSeriesHandoff.ts`. L1 = SB scope; L2 = WB consolidation/practice. BE2 fixture unchanged. Single-lesson path unchanged for all routes.

| Behaviour | Status |
| --- | --- |
| Companion resolution for SB 128–129 | **Resolves** to WB 104–105 |
| Other BE3 U8 spreads | Still **no** companion / **no** series |
| Two-lesson series packaging | **Enabled** for this pair only |
| Single-lesson path | Unchanged |
| First production Chalkie series run | **PASS AFTER LIGHT TEACHER REVIEW** — see results doc |

---

## 5. Production pilot outcome

Owner-reviewed Lesson Series exports for this pair only:

- L1: `HEALTHY LIVING_ ACTIVITIES AND QUESTIONS - lesson 1.pdf` (30 PDF pages)  
- L2: `HEALTHY HABITS - lesson 2.pdf` (31 PDF pages)  

Verdict and one Chalkie-generation short-answer correction: [`chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md`](./chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md). **No further generation authorized.** Local handoff / app unchanged after the teacher edit.

---

## 6. Next microstep

Owner-gated: choose the next Single Lesson Unit 8 spread, or authorize another **explicitly curated** SB→WB pair after content review — do not broaden pairing rules.

---

## 7. Boundaries

- No general automatic SB→WB pairing rule.  
- No AI/API.  
- No Chalkie generation in-app.  
- No D018 / `4-decisions.md` changes.
