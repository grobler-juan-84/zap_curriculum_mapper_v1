# BE3 Unit 8 Phonics Transfer Planning Brief v0.1

**Status:** ACTIVE — Phonics-A applied/verified; Phonics-B/C implemented behind default-off flag; undeployed/unpromoted
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner-directed planning after a read-only repository audit; D022, D026 and D027 remain in force. Phonics-A advance authorization supersedes the historical missing-Workbook blocker via direct canonical verification (see knowledge review).
**Implementation authorization:** Phonics-A live; Phonics-B/C behind default-off `VITE_NLL_CHALKIE_PHONICS_ADAPTER_PILOT`. Does **not** authorize promotion, deployment, flag-on default, commit, or push.

---

## 0. Standing constraints (read first)

1. Writing A/B/C is accepted and checkpointed on `main`; remainder-of-Unit-8 work is separately gated.
2. **Historical WB canonical blocker is cleared** by trusted WB canonical verify (size `779981` / SHA-256 `811deea2…04fa`). Exact WB p.116 inventory is recorded in the Phonics knowledge review.
3. Exact Workbook activity claims for Phonics now rest on that knowledge review — not on this brief’s earlier blocked wording.
4. **Delivery shape accepted for future Phonics-B only:** exact non-serving two-lesson SB→WB (Lesson 1 = SB p.141; Lesson 2 = WB p.116). Do not combine into one lesson; do not merge with Writing or Values; active serving remains `sb_only`.
5. Opener, Story, LiA, Grammar, CLIL, Culture, and Writing are architectural patterns only — not permission to reuse their content assumptions for Phonics.
6. Default serving for this relationship remains **`sb_only`**.
7. Phonics-B/C implemented (default-off); real workflow validation still pending.

---

## 1. Exact component boundary

| Field | Boundary |
|---|---|
| Component | Big English 3 Unit 8 Phonics only |
| Strand | Phonics — *all, au, aw* |
| Student Book | p.141 — Activities **32–35** |
| Workbook companion | p.116 — Activities **27–30** (verified in Phonics knowledge review) |
| Relationship | `be3_sb_wb_rel_u08_phonics_sb141_wb116` |
| Stable reference | `be3-sb-wb-u08-p141-wb116` (`BE3_U08_PHONICS_STABLE_REF`) |
| Learning-spine position | **Support** / `phonics` (**not** Core) |
| Active SB scope | **p.141 only** — Writing p.140 and Values p.142 remain excluded |
| Deterministic UUID | `3e800008-0000-4000-8000-000000000008` (local migration only) |

### Current resolver / serving state

- Verified companion available (`BE3_U08_SB141_WB116`).
- View Workbook available on exact SB p.141 for WB p.116 only.
- `supportsTwoLessonSeries: true`.
- `twoLessonPackagingMode: 'sb_only'`.
- No active SB→WB series title and no serving series handoff for Phonics.

### Future delivery shape (accepted for Phonics-B planning; not implemented)

Authority: [`be3-u08-phonics-knowledge-review-v0.1.md`](./be3-u08-phonics-knowledge-review-v0.1.md).

- Lesson 1 = SB p.141 only; Lesson 2 = WB p.116 only.
- No combined lesson; no Writing/Values merge; serving stays `sb_only`.

### Explicit exclusions

No Opener, Story, Language in Action, Content Connection / P.E., Grammar, Culture, Writing, Values, Review, other Unit 8 spreads, other units, or other books.

---

## 2. Verified current foundations

| Area | Current fact |
|---|---|
| Curated companion + stable reference | Present in `verifiedSbWbCompanions.ts` |
| Resolver / View Workbook | Wired for exact SB p.141 → WB p.116 |
| Present serving | Generic Student Book `sb_only` packaging |
| Active-page isolation | Protected from Writing p.140 and Values p.142 |
| Neutral package / renderer / adapter / flag | **None** for Phonics (Phonics-B/C not started) |
| NLL component | Local migration prepared; **not applied** |

---

## 3. Student Book + Workbook evidence

See [`be3-u08-phonics-knowledge-review-v0.1.md`](./be3-u08-phonics-knowledge-review-v0.1.md) for complete inventories, fingerprints, summaries, dependencies, SS decision, and delivery shape.

Target graphemes remain **`all`**, **`au`**, and **`aw`** only. Audio 163–167 protected. Activity 33 visual dependency preserved. Activity 34 eight keyed words protected. Activity 35 chant referenced as `bep3_sb_text_08_06` by identity/role only — full chant text is not reproduced here.

---

## 4. Workbook evidence blocker

**Cleared:** trusted WB canonical verified. Exact WB p.116 inventory is in the Phonics knowledge review. This section is retained only as historical context for the earlier missing-file blocker.

---

## 5. Phonics integrity safeguards

- Bind claims to verified graphemes **`all`**, **`au`**, and **`aw`**.
- Do **not** add IPA, pronunciation rules, accent variants, exceptions, minimal pairs, or invented words.
- Audio tracks **163–167** must not be reconstructed as transcripts.
- Activity 33 retains its visual dependency.
- Activity 34’s keyed words require answer-key protection.
- Activity 35 uses chant evidence only when selected; excluding it removes chant everywhere.
- Zero selection must not create a substitute phonics drill.
- Keep p.141 isolated from Writing p.140 and Values p.142.

---

## 6. Curriculum-authority boundary

- One proposed SS link: **Phonics** column (status `proposed` only) — see knowledge review.
- Do **not** conflate Phonics with Writing, Structures, CLIL/Culture, Values, or unit vocabulary.

---

## 7. Gated sequence

### Phonics-A — knowledge readiness + local Step B

**Prepared / not applied (2026-10-30):** knowledge review + migration `20261030200000` + focused suite. Precondition **7 / 60 / 60 / 8**; intended post **8 / 68 / 68 / 9**.

### Phonics-B / Phonics-C

**Not started.** Require separate authorization after Phonics-A apply/verify.

---

## 8. Explicit non-actions

This brief does **not** authorize apply, Phonics-B/C coding, promotion, deployment, or remainder-of-Unit-8 commit/push.

---

## 9. Related repository references

- [`be3-u08-phonics-knowledge-review-v0.1.md`](./be3-u08-phonics-knowledge-review-v0.1.md)
- `supabase/migrations/20261030200000_seed_nll_be3_u08_phonics.sql` (local only)
- `scripts/tests/nllBe3U08PhonicsSeedStepB.test.ts`
- `app/src/features/chalkie/verifiedSbWbCompanions.ts` — `BE3_U08_SB141_WB116`
