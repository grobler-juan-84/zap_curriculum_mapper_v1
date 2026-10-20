# BE3 Unit 8 — Student Book → Workbook pairing gap (v0.1)

**Status:** EVIDENCE GAP RECORD / **DRAFT** / **NO SERIES PACKAGING AUTHORIZED**  
**Date:** 2026-10-20  
**Scope:** Big English 3 · Unit 8 *Healthy Living* · attempted SB pp. **128–129** → WB companion

**Related:**  
[`chalkie-be3-u08-production-pilot-plan-v0.1.md`](./chalkie-be3-u08-production-pilot-plan-v0.1.md) ·  
[`p5-prototype-chalkie-workspace.md`](./p5-prototype-chalkie-workspace.md) ·  
[`../phase-1/audits/BE3-SB_canonical_v1_audit.md`](../phase-1/audits/BE3-SB_canonical_v1_audit.md) ·  
[`../phase-1/audits/BE3-WB_canonical_v1_audit.md`](../phase-1/audits/BE3-WB_canonical_v1_audit.md)

---

## 1. Requested outcome (blocked)

Enable the Chalkie Workspace **two-lesson Student Book → Workbook** package for one verified BE3 Unit 8 pair, starting from SB pp.128–129.

**Blocked:** no verified SB→WB page pairing exists in canonical / scope-and-sequence evidence.

---

## 2. What was checked

| Source | Finding |
| --- | --- |
| `big_english_3_sb` canonical relationships | No cross-book `workbook_practice_for` (or similar) links with non-null Workbook targets for Unit 8 / pp.128–129 |
| `big_english_3_wb` canonical relationships | No Unit 8 relationships pointing at Student Book pages; existing `paired_with` / `practises` rows are **within-book** activity/text links |
| Scope-and-sequence artifacts in repo | No dedicated BE3 SB↔WB page-pairing SS file for Unit 8 spreads |
| SB extraction issues | Unit 2 issue `big_english_3_sb_issue_workbook_u02_crossref` records removal of invalid `"workbook practice for"` with **null** `target_entity_id` — project already refuses inventing workbook page entities |
| BE3-WB Unit 8 content | Unit **does** exist and is `human_verified`: printed **pp.104–117**. Opener pages **104–105** are `unit_opener_vocabulary` + `song_practice` |

---

## 3. Exact data gap

**Missing:** a human-verified cross-book relationship (or equivalent SS record) that binds:

- Student Book entities/pages for **pp.128–129**, to  
- Workbook entities/pages for a specific companion spread (commonly assumed **104–105** by structural parallel only).

**Not missing:** Workbook Unit 8 opener pages as isolated verified content. Those pages exist; the **pairing** does not.

**Forbidden heuristic (not used):** same unit title + parallel opener section types + BE2’s historical 128–129→104–105 packaging. Parallel structure is **not** verified pairing.

---

## 4. Workspace consequence

| Behaviour | Status |
| --- | --- |
| Single-lesson handoff for BE3 U8 SB pp.128–129 | Unchanged / available when page evidence resolves |
| Two-lesson SB→WB series option for BE3 | **Remains unavailable** (`supportsTwoLessonSeries: false`) |
| BE2 U8 curated fixture series (SB 128–129 → WB 104–105) | Unchanged (prototype route; not a BE3 pairing claim) |

Resolver: `app/src/features/chalkie/resolveVerifiedSbWbCompanion.ts` — returns `null` + `gapReason: 'no_cross_book_relationship'` for real BE3 canonicals on pp.128–129.

---

## 5. What would unlock the series package later

Add **human-verified** cross-book relationship evidence (non-null targets, page-complete for the spread), for example:

- `relationship_type`: `workbook_practice_for` (or an agreed equivalent),  
- `verification_status`: `human_verified`,  
- `target_book_id`: `big_english_3_wb`,  
- source/target entities covering the full SB spread and the full WB companion spread.

Then re-run the focused pairing tests and implement the six local copyables for that one pair only.

Until then: **do not enable BE3 series packaging** and **do not generate** a two-lesson Chalkie handoff for BE3.

---

## 6. Boundaries

- No heuristic pairing.  
- No OpenAI/API.  
- No Chalkie generation.  
- No D018 / `4-decisions.md` changes.  
- No methodology lock.
