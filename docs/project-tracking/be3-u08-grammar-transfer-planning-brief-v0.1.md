# BE3 Unit 8 Grammar Transfer Planning Brief v0.1

**Status:** PROVISIONAL / EVIDENCE-BLOCKED / DOCUMENTATION ONLY
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner-directed documentation-only planning after a read-only repository audit; D022, D026 and D027 remain in force
**Implementation authorization:** **None.** This document does **not** authorize Grammar-A, Grammar-B, Grammar-C, coding, NLL insertion, database work, deployment, promotion, commit, or push.

---

## 0. Standing constraints (read first)

1. **LiA-C is owner-accepted and undeployed.** Remaining Unit 8 planning, including Grammar, is **documented and separately gated**; Grammar is **not** an active implementation stream.
2. This brief is **provisional** because the BE3 Workbook canonical file is unavailable.
3. Exact Workbook activity claims remain **blocked** by the missing canonical and must wait for evidence review after restoration and re-verification.
4. Opener, Story, LiA, and provisional CLIL/P.E. briefs are architectural patterns only — not permission to reuse their content assumptions for Grammar.
5. Default serving for this relationship remains **`sb_only`**. No serving-path change is proposed here.

---

## 1. Exact component boundary

| Field | Boundary |
|---|---|
| Component | Big English 3 Unit 8 Grammar only |
| Strand | Past simple regular (*-ed* spelling) + irregular forms; yesterday speaking |
| Student Book | pp.136–137; page IDs `bep3_sb_p136`, `bep3_sb_p137` |
| Workbook companion | pp.111–112; page IDs `bep_3_wb_p111`, `bep_3_wb_p112` (companion identity only; activity inventory not re-verified) |
| Relationship | `be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112` |
| Stable reference | `be3-sb-wb-u08-p136-137-wb111-112` (`BE3_U08_GRAMMAR_STABLE_REF`) |
| Relationship type | `workbook_practice_for` · `human_verified` (curated companion) |
| Learning-spine position | **Core 5** / `grammar` |

### Current resolver / serving state (repository-supported)

- Verified companion available (`BE3_U08_SB136_137_WB111_112`).
- View Workbook available on exact SB pp.136–137 for WB pp.111–112 only.
- `supportsTwoLessonSeries: true`.
- `twoLessonPackagingMode: 'sb_only'` (Opener/Story alone receive `sb_wb`).
- No active SB→WB series title and no serving series handoff for Grammar.

### Explicit exclusions

No Opener, Story, Language in Action, Content Connection / P.E., Culture, Writing, Phonics, Values, Review, other Unit 8 spreads, other units, or other books.

---

## 2. Verified current foundations

These are **current repository facts**, not future proposals.

| Area | Current fact |
|---|---|
| Curated companion + stable reference | Present in `verifiedSbWbCompanions.ts` |
| Resolver / View Workbook | Wired for exact SB 136–137 → WB 111–112 |
| Present serving | Generic Student Book `sb_only` two-lesson packaging |
| Pairing acceptance | Docs-only acceptance covers the **companion only**; handoff/Chalkie generation not authorized |
| Experiment 10 | Closed historical **SB-only** operational record (raw CONDITIONAL FAIL → PASS AFTER TEACHER REVIEW); not a methodology lock; not an SB→WB series oracle |
| Same-unit prior learning | Grammar prior-learning cards surface only on **eligible later** Unit 8 lessons (not on Grammar’s own pages or earlier pages) |
| LiA as prior support | LiA may appear as **optional** prior support when Grammar is the current lesson; it must never replace current Grammar evidence |
| Neutral package builder | Does **not** support this relationship (supported configs: Opener, Story, LiA only) |
| Shared renderer dispatch | Does **not** dispatch Grammar |
| Bespoke / neutral five-artifact SB→WB baseline | **Does not exist** |
| NLL component / package / renderer / adapter / flag | **None** for Grammar |

Coverage map, companion tests, packaging tests, learning-spine tests, and prior-learning assembly tests protect companion identity, `sb_only` packaging, Core 5 placement, and prior-learning boundaries for this spread.

---

## 3. Verified Student Book evidence

Local SB canonical identifies **five** human-verified activities on pp.136–137. Do not invent additional examples, verb forms, answers, or rules beyond inspected evidence.

| Activity | ID | Type / task | Dependencies / honesty notes |
|---|---|---|---|
| **19** | `bep3_sb_act_08_19` | Listen-and-read dialogue | **Audio 159**; **visual** dependency; verified keyed answer includes **“by bike”** (book-check only; do not invent audio script) |
| **20** | `bep3_sb_act_08_20` | Regular `-ed` chart / spelling task | Word-box / table dependency; regular past spelling classification |
| **21** | `bep3_sb_act_08_21` | Read-and-complete narrative | Nine-item gap-fill; dual **`traveled` / `travelled`** evidence must be preserved when relevant |
| **22** | `bep3_sb_act_08_22` | Irregular base/past matching | Eight items; irregular inventory must stay evidence-bounded |
| **23** | `bep3_sb_act_08_23` | Pair speaking | Verified yesterday frames only (e.g. walked / went / played models present in canonical frames) |

Membership in the Grammar component does **not** select an activity. Only teacher-selected activities may enter future NLP/artifacts. Zero selection must remain honest.

---

## 4. Workbook evidence blocker

**Missing dependency:**

`data/phase1/big_english_3_wb/canonical/v1.json`

Its absence **blocks confirmation** of:

- exact WB activity IDs, order, and count;
- fingerprints and hashes;
- exact regular / irregular inventories on WB pages;
- question / negative / base-form evidence;
- audio, answer, table, and activity-chain dependencies;
- safe derived summaries and NLL memberships;
- package selection behavior against real WB evidence;
- renderer parity against accepted artifact expectations;
- canonical-dependent retained regressions for this relationship.

### Historical documentation awaiting canonical re-verification

Earlier pairing / pilot documents describe Workbook pp.111–112 in terms such as regulars charts, irregular writing, narrative cloze, and `Did…?` / negative extensions on the same past-simple strand, while excluding LiA 107–108 and CLIL 109–110. Those statements are **historical documentation only**. They are **not** re-verified facts in this brief and must not be treated as exact activity inventory until the WB canonical is restored and reviewed.

---

## 5. Grammar integrity risks

- Keep **regular `-ed` spelling classes** distinct from **irregular** forms; do not invent classification rules or verb lists beyond selected publisher evidence.
- Affirmative, negative, and question structures — and **base-form restoration after `did` / `didn’t`** — must remain source-bounded when such evidence is selected; do not import broad past-simple knowledge to fill gaps.
- Activity 19: **Audio 159** and visual dependence; answer-key fidelity is mandatory. Experiment 10 raw export failed by revealing *on foot* against verified *by bike* — that class of failure must not recur as unlabeled invention.
- Activities 20–22: chart, table, matching, and gap-fill dependencies; dual **`traveled` / `travelled`** evidence must not be collapsed without source support.
- Activity 23: use verified speaking frames only.
- No reconstruction of unchecked activities from page context, grammar-box memory, NLL membership, or prior-learning cards.
- Exact **all / partial / zero** selection honesty remains required.
- Distinguish **LiA communicative `Did…?` practice** (pp.132–133 / companion 107–108) from **Grammar morphology** on pp.136–137.
- Optional LiA prior support on Grammar lessons must never replace current Grammar evidence.

Grammar differs from Opener (vocab/song), Story (narrative reading + asymmetric WB), LiA (communicative Did…?), and CLIL/P.E. (content/reading/P.E.): it is a **Core morphology** component with audio dialogue, spelling charts, irregular matching, narrative completion, and speaking transfer.

---

## 6. Curriculum-authority boundary

- Potentially relevant Unit 8 **Structures** include past affirmative examples (e.g. *They walked.* / *She saw a film.*) and `Did…?` / `did` / `didn’t` material that also relates to LiA.
- Potentially relevant **I can…** evidence includes asking and answering about activities in the past.
- These are **candidates only**.
- **All SS links remain unproposed** until full SB/WB evidence review.
- Do not conflate Grammar with LiA, Culture, Writing, Phonics, Values, or generic past-simple knowledge.
- The SS remains curriculum authority. Experiment 10 does not.

---

## 7. Provisional gated sequence

These gates are **future consideration only**. None is authorized by this document.

### Grammar-A — knowledge readiness

**Blocked pending WB canonical restoration and separate owner authorization.**

Future consideration only:

- exact SB/WB inventory and source order;
- evidence-grounded summaries;
- fingerprints and provenance;
- carefully reviewed proposed SS links (if any);
- hidden/experimental NLL design;
- separate owner authorization before any persistent insertion.

**Explicitly prohibited at this stage:** migration, seed, database write, live-NLL insert, promotion, or coding of package/renderer/adapter layers.

### Grammar-B — neutral package and renderer parity

**Future consideration only, after Grammar-A acceptance.**

Future consideration only:

- exact relationship package configuration;
- all / partial / zero selection;
- source-order preservation;
- grammar-box, audio, visual, answer, spelling, chart, table, and activity-chain honesty;
- five-artifact renderer;
- BI/NLL boundary decision (default expectation: remain BI-absent unless separately decided);
- non-serving proof;
- retained Opener, Story, LiA, resolver, and `sb_only` regressions.

**Parity authority (proposed):**

```text
verified source contract + owner-reviewed artifact contract
```

No accepted bespoke or neutral five-artifact SB→WB baseline exists for Grammar. **Experiment 10 cannot serve as an SB→WB parity oracle** (SB-only operational history with a known raw answer-fidelity failure later corrected by the teacher).

Default packaging must remain **`sb_only`** until a separately accepted serving decision exists.

### Grammar-C — adapter integration

**Future consideration only, after Grammar-A and Grammar-B acceptance.**

High-level only (not an implementation specification):

- independent default-off flag;
- exact-scope lazy NLL loading;
- selected NLP assembly;
- shared renderer routing;
- stale-result guards;
- current-path (`sb_only`) fallback;
- automated and authenticated manual acceptance.

Do not specify module names, flag identifiers, or overlay wiring details in this brief.

---

## 8. Owner decisions (recorded)

1. **LiA-C remains the primary active milestone.**
2. **Grammar remains Core 5 / `grammar`.**
3. **Experiment 10 is historical SB-only and teacher-correction evidence only.**
4. **LiA prior support remains optional** and cannot replace Grammar evidence.
5. **All SS links remain unproposed.**
6. **Future parity** uses verified source contract plus owner-reviewed artifacts.
7. **Default behavior remains `sb_only`.**
8. **Grammar-A implementation is not authorized.**
9. **No broader implementation authority is created** (no Culture/Writing/Phonics/Values/Review or other-unit work).

---

## 9. Explicit non-actions

This documentation-only brief does **not** authorize:

- edits outside this document;
- application, configuration, or test work;
- canonical creation or modification;
- NLL summaries, hashes, memberships, migrations, or seeds;
- Supabase CLI or database operations;
- feature flags;
- package, renderer, adapter, overlay, or resolver changes;
- promotion or deployment;
- LiA-C or CLIL/P.E. edits;
- work on later Unit 8 components;
- staging, commit, or push.

---

## 10. Recommendation for next owner action

1. Continue LiA-C retained verification and authenticated manual acceptance as the primary stream.
2. Restore `data/phase1/big_english_3_wb/canonical/v1.json` before any Grammar evidence review.
3. Keep this brief provisional until ChatGPT Desktop / owner review decides whether to unlock a later Grammar-A planning authorization.
4. Do not start Grammar coding, NLL design execution, or tracker promotion from this file alone.

---

## 11. Related repository references (read-only context)

- `app/src/features/chalkie/verifiedSbWbCompanions.ts` — `BE3_U08_SB136_137_WB111_112`
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` — Opener/Story-only `sb_wb`; otherwise `sb_only`
- `app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts` — Grammar unsupported
- `app/src/features/chalkie/renderChalkieFromNeutralPackage.ts` — Grammar unsupported dispatch
- `app/src/features/chalkie/be3U08UnitLearningSpine.ts` — Core 5 / `grammar`
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` — historical companion acceptance
- `docs/phase-5/chalkie-operational-pilot-be3-u08-grammar-p136-137-preflight-v0.1.md` — SB evidence preflight
- `docs/phase-5/chalkie-operational-pilot-be3-u08-grammar-p136-137-handoff-design-v0.1.md` — Exp 10 design/review
- `docs/phase-5/chalkie-coverage-map.md` — current coverage claim for pp.136–137
- Accepted Opener / Story / LiA briefs and provisional CLIL/P.E. brief — architectural pattern references only
