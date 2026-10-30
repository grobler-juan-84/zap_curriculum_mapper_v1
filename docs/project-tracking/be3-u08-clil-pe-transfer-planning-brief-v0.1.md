# BE3 Unit 8 Content Connection / P.E. Transfer Planning Brief v0.1

**Status:** ACTIVE / CLIL-A APPLIED + CLIL-B/C AUTOMATED-ACCEPTED UNDER ADVANCE AUTHORIZATION
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner advance authorization for CLIL-A apply+verify and CLIL-B/C; D022, D026 and D027 remain in force
**Implementation authorization:** Authorized isolated apply of `20261030170000` plus CLIL-B/C. **Does not** authorize promotion, deployment, additional migrations, commit, or push.

---

## 0. Standing constraints (read first)

1. **Grammar-B/C are committed and pushed** (`e99636ca066ac60b961934c1358f73fed45e0afa` on `main`).
2. The historical **missing-Workbook blocker is cleared**: trusted WB canonical verified (`779981` / `811deea2…04fa`) alongside SB (`938463` / `3924fa23…67e6`).
3. **CLIL-A Step B** is applied/verified/owner-accepted: live **5 / 44 / 44 / 6**; history **24 / 0 / 0**; zero CLIL SS links. See [`be3-u08-clil-pe-knowledge-review-v0.1.md`](./be3-u08-clil-pe-knowledge-review-v0.1.md).
4. Opener, Story, LiA, and Grammar transfer briefs are architectural patterns only — not permission to reuse their content assumptions for CLIL/P.E.
5. Default serving for this relationship remains **`sb_only`**. Flag-off path unchanged.
6. **CLIL-B/C are implemented and automated-accepted** behind default-off `VITE_NLL_CHALKIE_CLIL_PE_ADAPTER_PILOT`; undeployed/unpromoted; local/uncommitted.

---

## 1. Exact component boundary

| Field | Boundary |
|---|---|
| Component | Big English 3 Unit 8 Content Connection / P.E. only |
| Topic | *What Is a Calorie?* (historical docs / Exp 14 naming) |
| Student Book | pp.134–135; page IDs `bep3_sb_p134`, `bep3_sb_p135` |
| Workbook companion | pp.109–110; page IDs `bep_3_wb_p109`, `bep_3_wb_p110` (companion identity only; activity inventory not re-verified) |
| Relationship | `be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110` |
| Stable reference | `be3-sb-wb-u08-p134-135-wb109-110` (`BE3_U08_CLIL_PE_STABLE_REF`) |
| Relationship type | `workbook_practice_for` · `human_verified` (curated companion) |
| Learning-spine role | **Support** / `reading_content` — **not** Core |

### Current resolver / serving state (repository-supported)

- Verified companion available (`BE3_U08_SB134_135_WB109_110`).
- View Workbook available on exact SB pp.134–135 for WB pp.109–110 only.
- `supportsTwoLessonSeries: true`.
- `twoLessonPackagingMode: 'sb_only'` (Opener/Story alone receive `sb_wb`).
- No active SB→WB series title and no serving series handoff for CLIL/P.E.

### Explicit exclusions

No Grammar, Culture, Writing, Phonics, Values, Review, Language in Action, Story, Opener, other Unit 8 spreads, other units, or other books.

---

## 2. Verified current foundations

These are **current repository facts**, not future proposals.

| Area | Current fact |
|---|---|
| Curated companion | Present in `verifiedSbWbCompanions.ts` |
| Resolver / View Workbook | Wired for exact SB 134–135 → WB 109–110 |
| Present serving | Generic Student Book `sb_only` two-lesson packaging |
| Prior pairing acceptance | Docs-only acceptance recorded in the Unit 8 SB→WB pairing-gap / production-pilot docs (companion only; handoff/Chalkie not authorized) |
| Experiment 14 | Historical **SB-only** single-lesson evidence for pp.134–135; provisional; not a methodology lock; not an SB→WB series oracle |
| Local SB inventory | Human-verified Activities **13–18** on pp.134–135 (`bep3_sb_act_08_13` … `bep3_sb_act_08_18`) |
| Neutral package builder | Supports exact CLIL relationship (`clil_pe`) alongside Opener, Story, LiA, Grammar |
| Shared renderer dispatch | Dispatches exact CLIL package to dedicated five-artifact renderer |
| Bespoke five-artifact SB→WB baseline | Present (`renderBe3U08ClilPeNeutralPackageToChalkieShadow`) |
| NLL component / package / renderer / adapter / flag | Live `be3-u08-clil-pe`; default-off `VITE_NLL_CHALKIE_CLIL_PE_ADAPTER_PILOT` |

Coverage map and packaging/companion tests protect companion identity and `sb_only` packaging for this spread.

---

## 3. Evidence blocker — CLEARED

**Cleared 2026-10-30** by direct verification of trusted local canonicals (size + SHA-256 + JSON parse). Exact WB inventory is recorded in the CLIL knowledge review: Activities **11–14** + Think Big on pp.109–110 (`bep_3_wb_act_109_11` … `bep_3_wb_act_110_tb`).

Earlier pairing / pilot documents remain historical context only where they conflict with the knowledge-review inventory.

---

## 4. Instructional-integrity risks

### Verified Student Book risks (local canonical)

- Activities **13–18** span reading / content / P.E. work on pp.134–135.
- Activity **14** uses **Audio 157**, is a listen-and-read CLIL task, and depends on checking answers against Activity **13**.
- Activities **15** and **17** depend on the article / questions associated with Activity **14**.
- Verified answer content includes **calorie figures** that must not be invented, paraphrased beyond evidence, or generalized into unsourced science claims.
- Activity **18** is a project with an **Exercise Chart visual dependency**.
- Prediction, reading, linked comprehension, physical-activity discussion, project/visual work, and answer-key evidence require **source-honest selection behavior** (membership ≠ selection; zero/partial selection must remain honest).

### Teaching-claim risks (Exp 14 historical notes; still relevant)

- Future output must avoid oversimplified or over-definite health/science claims.
- Avoid unsupported “good/bad food” framing and ambiguous “good/bad activities keep you healthy” wording.

### Workbook risks

Workbook dependency risks (audio, diagrams, cloze answers, cross-activity links, Think Big prompts, etc.) remain **unknown until canonical review**.

### Why CLIL/P.E. differs from Opener, Story, and LiA

CLIL/P.E. combines **reading**, **science/content knowledge**, **official audio**, **linked question chains**, **physical-activity discussion**, and **project/visual evidence**. It is not an opener vocabulary/song package, not a story reading package with asymmetric WB scope, and not communicative Did…? LiA practice. Learning-spine placement remains **support / reading_content**, not Core.

---

## 5. Curriculum-authority boundary

- Potentially relevant Scope and Sequence evidence may include Unit 8 **CLIL/Culture → P.E.: Keeping healthy** vocabulary.
- Do **not** conflate that area with Culture **“Strange sports,”** Writing, Phonics, Values (“Get exercise.”), or unrelated health/exercise language.
- **All SS links remain unproposed.**
- No Vocabulary, Structures, I can…, Values, or other component link should be proposed before full SB/WB evidence review.
- The SS remains curriculum authority. Historical experiments (including Exp 14) do not.

---

## 6. Provisional gated sequence

These gates are **future consideration only**. None is authorized by this document.

### CLIL-A — knowledge readiness

**Accepted under advance authorization (2026-10-30) / Step B prepared locally / not applied.**

Completed:

- exact SB/WB inventory (11 activities) and source order;
- fingerprints and provenance;
- eleven preferred v1 hidden/experimental summaries;
- **zero** SS links (CLIL/Culture category conflates Strange sports);
- local fail-closed migration `20261030170000` + focused static suite;
- read-only live preflight still **4 / 33 / 33 / 6**; intended post-apply **5 / 44 / 44 / 6**.

**Still prohibited without a new gate:** applying the migration; database/Storage mutation; CLIL-B/C; promotion; deployment; commit/push of CLIL work.

### CLIL-B — neutral package and renderer parity

**Future consideration only, after CLIL-A acceptance.**

Future consideration only:

- exact relationship package configuration;
- all / partial / zero selection;
- source-order preservation;
- audio, article, answer, calculation, diagram, visual, project, and cross-activity honesty;
- five-artifact renderer;
- BI/NLL boundary decision (default expectation: remain BI-absent unless separately decided);
- non-serving proof;
- retained Opener, Story, LiA, resolver, and `sb_only` regressions.

**Parity authority (proposed):**

```text
verified source contract + owner-reviewed artifact contract
```

No accepted bespoke SB→WB five-artifact baseline exists for CLIL/P.E. **Experiment 14 remains historical SB-only evidence and cannot serve as the SB→WB parity oracle.**

Default packaging must remain `sb_only` until a separately accepted serving decision exists.

### CLIL-C — adapter integration

**Future consideration only, after CLIL-A and CLIL-B acceptance.**

High-level only (not an implementation specification):

- independent default-off flag;
- exact-scope lazy NLL loading;
- selected NLP assembly;
- shared renderer routing;
- stale-result guards;
- current-path (`sb_only`) fallback;
- automated and authenticated manual acceptance.

Do not design overlay wiring, env names, or module layouts in this brief.

---

## 7. Owner decisions (recorded)

1. **LiA-C remains the primary active milestone.**
2. **CLIL/P.E. remains a support component, not Core.**
3. **Experiment 14 is historical SB-only evidence only.**
4. **All SS links remain unproposed** pending complete evidence review.
5. **Future CLIL-B parity** must use verified source contract plus owner-reviewed artifacts.
6. **Default behavior remains `sb_only`.**
7. **CLIL-A implementation is not authorized.**
8. **No broader Unit 8 expansion is authorized.**

---

## 8. Explicit non-actions

This documentation-only brief does **not** authorize:

- edits outside this document;
- application, configuration, or test implementation;
- canonical creation or modification;
- NLL summaries, fingerprints, memberships, migrations, or seeds;
- Supabase CLI setup;
- database or Storage access/writes;
- feature flags;
- package or renderer implementation;
- adapter or overlay wiring;
- NLL visibility promotion;
- deployment;
- any change to existing LiA-C work;
- Grammar or other Unit 8 component work;
- staging, commit, or push.

---

## 9. Recommendation for next owner action

1. Continue LiA-C retained verification and authenticated manual acceptance as the primary stream.
2. Restore `data/phase1/big_english_3_wb/canonical/v1.json` before any CLIL evidence review.
3. Keep this brief provisional until ChatGPT Desktop / owner review decides whether to unlock a later CLIL-A planning authorization.
4. Do not start CLIL coding, NLL design execution, or tracker promotion from this file alone.

---

## 10. Related repository references (read-only context)

- `app/src/features/chalkie/verifiedSbWbCompanions.ts` — `BE3_U08_SB134_135_WB109_110`
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` — Opener/Story-only `sb_wb`; otherwise `sb_only`
- `app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts` — CLIL unsupported
- `app/src/features/chalkie/renderChalkieFromNeutralPackage.ts` — CLIL unsupported dispatch
- `app/src/features/chalkie/be3U08UnitLearningSpine.ts` — support / `reading_content`
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` — historical companion acceptance
- `docs/phase-5/chalkie-single-lesson-experiment-14-results-v0.1.md` — historical SB-only Exp 14
- `docs/phase-5/chalkie-coverage-map.md` — current coverage claim for pp.134–135
- Accepted Opener / Story / LiA briefs — architectural pattern references only
