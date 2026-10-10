# Phase 2 Iteration — Input Inspection (BE2 + prior experiments)

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-11  
**Purpose:** Record what exists in Phase 1 JSON and prior Phase 2 experiment artifacts before designing the next minimal Google AI Studio prompt/output for Big English 2 Unit 8. Does **not** lock a schema, prompt, or methodology.

---

## 1. Phase 1 inputs confirmed locally

| Asset | Path | Size / notes |
|---|---|---|
| BE2-SB canonical | `data/phase1/big_english_2_sb/canonical/v1.json` | ~0.61 MB; gitignored; schema `0.1` |
| BE2-WB canonical | `data/phase1/big_english_2_wb/canonical/v1.json` | ~0.64 MB; corroboration only |
| BE1-SB canonical | `data/phase1/big_english_1_sb/canonical/v1.json` | ~0.70 MB; used by BE1 U1 transfer test |

**Book identity:** `book.book_id` / `catalog_book_id` = `big_english_2_sb`. Entity IDs keep legacy `bep2_` prefixes (grandfathered).

**Shape:** Top-level arrays (`units`, `pages`, `vocabulary`, `language`, `activities`, `continuous_text`, `curriculum_components`, …). Unit records are metadata only; entities join via `unit_id`.

**Verification:** `whole_book_audit_passed`; unit `bep2_unit_08` is `human_verified`.

---

## 2. BE2 Unit 8 slice (`bep2_unit_08` — *Wild Animals*)

| Field | Value |
|---|---|
| Printed / PDF pages | 128–143 (`bep2_p128`–`bep2_p143`) |
| Pages | 16 |
| Vocabulary | 34 (all `explicitly_listed=true`, classification `target`) |
| Language | 5 rows (ability ×3, adjective order, *They're so + adj*) |
| Activities | 37 |
| Continuous text | 6 |
| Curriculum components | 10 (vocab → song → story → LiA → CLIL → grammar → culture → values → phonics → review) |
| Unit-only JSON slice | ~49 KB (vs ~469 KB full book) — practical Studio input size |

**Language systems (BOOK_EVIDENCE):**

1. `bep2_lang_u8_001` — modal *can* affirmative ability  
2. `bep2_lang_u8_002` — *Can* + singular / *Yes, it can.*  
3. `bep2_lang_u8_003` — *Can* + plural / *No, they can't.*  
4. `bep2_lang_u8_004` — cumulative adjective order  
5. `bep2_lang_u8_005` — *They're so + adjective* (appreciation)

**Evidence gaps:**

- Page `bep2_p143` notes mention an **'I Can' self-assessment block**, but exact sentences are **not extracted** → `MISSING_EVIDENCE` (same pattern as BE2 U6/U7).  
- Open U8 extraction issues: audio-dependent Acts 5 and 29 (`bep2_issue_0013`, `0014`).

---

## 3. Prior Phase 2 experiment inventory

| Experiment | Focus | What it established | Artifact |
|---|---|---|---|
| `P2-EXP-BE2-U06-v1` | Relationships / inventory | Evidence tags; prior/future caution | [`p2-exp-be2-u06-v1-review.md`](./p2-exp-be2-u06-v1-review.md) |
| `P2-EXP-BE2-U06-v2` | Observable LRs | LR method + teacher “one glance”; V2-E8 partial (no teacher) | [`p2-exp-be2-u06-v2-review.md`](./p2-exp-be2-u06-v2-review.md) |
| `P2-EXP-BE2-U07-v1` | U7 LRs + transfer | Method reusable; unit-native grammar systems required | [`p2-exp-be2-u07-v1-review.md`](./p2-exp-be2-u07-v1-review.md) |
| `P2-EXP-BE2-U08-v1` | U8 LRs + 3-unit compare | **13 LRs already drafted** for this unit; three-unit dimensions mostly `REUSABLE_AS_IS` | [`p2-exp-be2-u08-v1-review.md`](./p2-exp-be2-u08-v1-review.md) |
| `P2-EXP-BE1-U01-v1` | Beginner transfer | Method transfers; BE1 has extracted I Can (unlike BE2 U6–U8) | [`p2-exp-be1-u01-v1-review.md`](./p2-exp-be1-u01-v1-review.md) |

Snapshot: [`phase-2-experiment-status.md`](./phase-2-experiment-status.md). Planning SoT: [`phase-2-overview-v2`](./phase-2-overview-v2).

**Shared experimental practices (NOT LOCKED):**

- Tags: `BOOK_EVIDENCE` / `AI_INTERPRETATION` / `UNCERTAIN` / `MISSING_EVIDENCE` / `AI_PREDICTED_DIFFICULTY` / `TEACHER_CONFIRMED_DIFFICULTY`  
- Observable LRs; evidence-led count; core vs supporting (CLIL/culture/values/phonics)  
- Progression as recognition → guided → production *opportunity* (not mastery)  
- Listed vs exposure vocab; purpose-group activity consolidation  
- ~6–8 bullet teacher “one glance”  
- Markdown review artifacts — **no reusable Studio prompt text and no Phase 2 JSON schema were locked**

**No `METHOD_WEAKNESS`** across U6–U8 or BE1 U1. Soft gap: missing I Can text on BE2 units; teacher validation still pending.

---

## 4. Implications for the next step (prompt + JSON design)

1. **Primary input for Studio:** unit-scoped Phase 1 slice for `bep2_unit_08` (~49 KB), not the full book and not the PDF.  
2. **Prior U8 review is a rich baseline**, not a locked schema — next iteration should compress that intelligence into a **reusable prompt + structured Phase 2 JSON**, not re-prove that LRs are possible.  
3. **Carry forward:** evidence tags, observable LRs, unit-native language systems, page-level summaries (overview v2: no separate activity-level records), teacher-facing synthesis.  
4. **Do not invent** I Can wording; omit or tag `MISSING_EVIDENCE`.  
5. **WB optional** for corroboration only.  
6. **Keep experimental** — no methodology/schema lock until owner decision.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-11 | Inspected local BE2/BE1 Phase 1 canonicals and Phase 2 U6–U8 / BE1 U1 experiment artifacts. |
