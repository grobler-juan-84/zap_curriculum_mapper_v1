# BE3 Unit 8 Review Transfer Planning Brief v0.1

**Status:** ACTIVE — Review-A applied/verified; Review-B/C implemented behind default-off flag; Unit 8 pipeline complete / Values generic path retained; undeployed/unpromoted
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner-directed planning after a read-only repository audit; D022, D026 and D027 remain in force. Review-A advance authorization supersedes the historical missing-Workbook blocker via direct canonical verification (see knowledge review).
**Implementation authorization:** Review-A live; Review-B/C behind default-off `VITE_NLL_CHALKIE_REVIEW_ADAPTER_PILOT`. Does **not** authorize promotion, deployment, flag-on default, commit, or push.

---

## 0. Standing constraints (read first)

1. Writing A/B/C is accepted and checkpointed on `main`; remainder-of-Unit-8 work is separately gated.
2. **Review is mixed consolidation, not automatic whole-unit aggregation.**
3. **Historical WB canonical blocker is cleared** by trusted WB canonical verify. Exact WB p.117 inventory is recorded in the Review knowledge review.
4. **Delivery shape accepted for future Review-B only:** exact non-serving two-lesson SB→WB (Lesson 1 = SB p.143; Lesson 2 = WB p.117). No combined unit review; no Values merge; no earlier-component aggregation; serving remains `sb_only`.
5. Earlier Unit 8 briefs are architectural comparisons only — **not** permission to aggregate their evidence into Review.
6. Default serving remains **`sb_only`**.
7. Review-B/C implemented (default-off); real workflow validation still pending.

---

## 1. Exact component boundary

| Field | Boundary |
|---|---|
| Component | Big English 3 Unit 8 Review only |
| Strand | Review / self-assessment (mixed consolidation) |
| Student Book | p.143 — Activities **39–41** |
| Workbook companion | p.117 — Activities **31–33** (verified in Review knowledge review) |
| Relationship | `be3_sb_wb_rel_u08_review_sb143_wb117` |
| Stable reference | `be3-sb-wb-u08-p143-wb117` (`BE3_U08_REVIEW_STABLE_REF`) |
| Learning-spine position | **`review_support`** / `values_review` (**not** Core) |
| Active SB scope | **p.143 only** — Values p.142 remains excluded |
| Deterministic UUID | `3e800008-0000-4000-8000-000000000009` (local migration only) |

### Current resolver / serving state

- Verified companion available (`BE3_U08_SB143_WB117`).
- View Workbook available on exact SB p.143 for WB p.117 only.
- `twoLessonPackagingMode: 'sb_only'`.

### Future delivery shape (accepted for Review-B planning; not implemented)

Authority: [`be3-u08-review-knowledge-review-v0.1.md`](./be3-u08-review-knowledge-review-v0.1.md).

### Explicit exclusions

No Opener, Story, LiA, CLIL/P.E., Grammar, Culture, Writing, Phonics, Values, other Unit 8 spreads, other units, or other books. Do not force-pair Review p.143 with Values p.142.

---

## 2. Verified current foundations

| Area | Current fact |
|---|---|
| Curated companion + stable reference | Present |
| Present serving | Generic `sb_only` |
| Neutral package / renderer / adapter / flag | **None** (Review-B/C not started) |
| NLL component | Local migration prepared after Phonics; **not applied** |
| Component-level SS links | **Zero** (over-linking withheld) |

---

## 3. Evidence

See [`be3-u08-review-knowledge-review-v0.1.md`](./be3-u08-review-knowledge-review-v0.1.md) for complete inventories, fingerprints, activity-specific summaries, dependencies, SS decision, and delivery shape.

Integrity: SB 39/41 answers protected; SB 40 open survey without invented personal answers; page-level visual dependency preserved; no invented SB audio; WB gerund evidence remains WB-only.

---

## 4. Workbook evidence blocker

**Cleared:** trusted WB canonical verified. Exact WB p.117 inventory is in the Review knowledge review.

---

## 5. Gated sequence

### Review-A — knowledge readiness + local Step B

**Prepared / not applied (2026-10-30):** knowledge review + migration `20261030210000` + focused suite. Chained precondition **8 / 68 / 68 / 9** (post-Phonics); intended post **9 / 74 / 74 / 9**.

### Review-B / Review-C

**Not started.**

---

## 6. Explicit non-actions

Does **not** authorize apply, Review-B/C coding, promotion, deployment, earlier-component aggregation, or remainder-of-Unit-8 commit/push.

---

## 7. Related repository references

- [`be3-u08-review-knowledge-review-v0.1.md`](./be3-u08-review-knowledge-review-v0.1.md)
- `supabase/migrations/20261030210000_seed_nll_be3_u08_review.sql` (local only)
- `scripts/tests/nllBe3U08ReviewSeedStepB.test.ts`
- `app/src/features/chalkie/verifiedSbWbCompanions.ts` — `BE3_U08_SB143_WB117`
