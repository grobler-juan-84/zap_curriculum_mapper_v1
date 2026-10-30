# BE3 Unit 8 Content Connection / P.E. Transfer Planning Brief v0.1

**Status:** PROVISIONAL / EVIDENCE-BLOCKED / DOCUMENTATION ONLY
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner-directed documentation-only planning after a read-only repository audit; D022, D026 and D027 remain in force
**Implementation authorization:** **None.** This document does **not** authorize CLIL-A, CLIL-B, CLIL-C, coding, NLL insertion, database work, deployment, promotion, commit, or push.

---

## 0. Standing constraints (read first)

1. **LiA-C is owner-accepted and undeployed.** Remaining Unit 8 planning, including CLIL/P.E., is **documented and separately gated**; CLIL/P.E. is **not** an active implementation stream.
2. This brief is **provisional** because the BE3 Workbook canonical file is unavailable on the audit machine.
3. Exact Workbook activity claims must wait for evidence review after the WB canonical is restored and re-verified.
4. Opener, Story, and LiA transfer briefs are architectural patterns only — not permission to reuse their content assumptions for CLIL/P.E.
5. Default serving for this relationship remains **`sb_only`**. No serving-path change is proposed here.

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
| Neutral package builder | Does **not** support this relationship (supported configs: Opener, Story, LiA only) |
| Shared renderer dispatch | Does **not** dispatch CLIL/P.E.; relationship used as unsupported-dispatch test fixture |
| Bespoke five-artifact SB→WB baseline | **Does not exist** |
| NLL component / package / renderer / adapter / flag | **None** for CLIL/P.E. (`be3-u08-opener`, `be3-u08-story`, `be3-u08-lia` only in migrations) |

Coverage map and packaging/companion tests protect companion identity and `sb_only` packaging for this spread.

---

## 3. Evidence blocker

**Missing dependency:**

`data/phase1/big_english_3_wb/canonical/v1.json`

Its absence **blocks confirmation** of:

- exact WB activity IDs;
- activity order and count;
- fingerprints and hashes;
- audio, visual, answer, diagram, and cross-activity dependencies;
- safe derived summaries;
- NLL memberships and records;
- package selection behavior against real WB evidence;
- renderer parity against accepted artifact expectations;
- canonical-dependent retained regressions for this relationship.

### Historical documentation awaiting canonical re-verification

Earlier pairing / pilot documents describe Workbook pp.109–110 in terms such as cloze, listening/circle, matching, activity diagrams, Think Big healthy choices, and shared calorie/energy/active vocabulary. Those statements are **historical documentation only**. They are **not** re-verified facts in this brief and must not be treated as exact activity inventory until the WB canonical is restored and reviewed.

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

**Blocked pending WB canonical restoration and owner authorization.**

Future consideration only:

- exact SB/WB inventory and source order;
- side-by-side evidence review;
- content-safe derived summaries;
- fingerprints and provenance;
- carefully reviewed proposed SS links (if any);
- hidden/experimental NLL design;
- separate owner authorization before any persistent insertion.

**Explicitly prohibited at this stage:** migration, seed, database write, live-NLL insert, promotion, or coding of package/renderer/adapter layers.

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
