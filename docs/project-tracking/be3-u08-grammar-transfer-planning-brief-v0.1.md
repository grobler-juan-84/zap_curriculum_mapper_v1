# BE3 Unit 8 Grammar Transfer Planning Brief v0.1

**Status:** DOCUMENTATION ONLY — Grammar-A Step A owner-accepted 2026-10-30; Grammar-A Step B / Grammar-B / Grammar-C unauthorized
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner-directed documentation-only planning; Grammar-A Step A content accepted 2026-10-30; D022, D026 and D027 remain in force
**Implementation authorization:** **None for Step B / B / C.** This document does **not** authorize Grammar-A Step B, Grammar-B, Grammar-C, coding, NLL insertion, database work, deployment, promotion, commit, or push.

---

## 0. Standing constraints (read first)

1. **LiA-C is owner-accepted and undeployed.** Grammar remains **separately gated** and is **not** an active implementation stream beyond accepted Step A documentation.
2. The earlier WB evidence blocker is **cleared**. Trusted SB (`3924fa23…67e6`) and WB (`811deea2…04fa`) canonicals are restored locally (gitignored).
3. Exact Grammar inventory and summary designs are recorded in the owner-accepted knowledge review: [`be3-u08-grammar-knowledge-review-v0.1.md`](./be3-u08-grammar-knowledge-review-v0.1.md).
4. Opener, Story, LiA, and provisional CLIL/P.E. briefs are architectural patterns only — not permission to reuse their content assumptions for Grammar.
5. Default serving for this relationship remains **`sb_only`**. No serving-path change is proposed here.

---

## 1. Exact component boundary

| Field | Boundary |
|---|---|
| Component | Big English 3 Unit 8 Grammar only |
| Strand | Past simple regular (*-ed* spelling) + irregular forms; yesterday speaking |
| Student Book | pp.136–137; page IDs `bep3_sb_p136`, `bep3_sb_p137` |
| Workbook companion | pp.111–112; page IDs `bep_3_wb_p111`, `bep_3_wb_p112` (Activities 15–19 accepted in Grammar-A Step A knowledge review) |
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

## 4. Workbook evidence status

**Evidence blocker cleared.** Trusted WB canonical is present locally (gitignored): `779981` bytes / SHA-256 `811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa`.

Owner-accepted Grammar-A Step A inventory (see knowledge review):

| Position | activity_id | Page | Number |
|---:|---|---:|---:|
| 6–10 (after SB 19–23) | `bep_3_wb_act_111_15` … `bep_3_wb_act_112_19` | 111–112 | 15–19 |

No NLL memberships or summaries have been inserted. Grammar-A Step B remains unauthorized.

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
- Grammar-A Step A accepted a future **Structures** link as **`proposed` only** (not inserted).
- **I can…** ask/answer remains **withheld**; Vocabulary and unrelated SS columns remain **unsuitable**.
- Do not conflate Grammar with LiA, Culture, Writing, Phonics, Values, or generic past-simple knowledge.
- The SS remains curriculum authority. Experiment 10 does not.

---

## 7. Provisional gated sequence

These gates are **future consideration only**. None is authorized by this document.

### Grammar-A — knowledge readiness

**Step A owner-accepted 2026-10-30** (documentation/content only). See [`be3-u08-grammar-knowledge-review-v0.1.md`](./be3-u08-grammar-knowledge-review-v0.1.md).

Accepted Step A outcomes (not inserted):

- exact SB/WB inventory and source order (ten memberships);
- evidence-grounded hidden/experimental preferred v1 summary designs;
- fingerprints and provenance bindings to trusted SB/WB hashes;
- Structures as a future `proposed` SS link only; I can… withheld.

**Grammar-A Step B** (migration/seed/NLL insertion) is the next possible owner gate and is **not** authorized.

**Explicitly prohibited without separate authorization:** migration, seed, database write, live-NLL insert, promotion, or coding of package/renderer/adapter layers.

### Grammar-B — neutral package and renderer parity

**Future consideration only, after Grammar-A Step B (and full Grammar-A) acceptance.** Not authorized.

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

1. **Grammar-A Step A is owner-accepted (2026-10-30)** as documentation/content only.
2. **Grammar remains Core 5 / `grammar`.**
3. **Experiment 10 is historical SB-only and teacher-correction evidence only.**
4. **LiA prior support remains optional** and cannot replace Grammar evidence.
5. **Structures** may become a future `proposed` SS link only; **I can…** remains withheld; Vocabulary unsuitable.
6. **Future parity** uses verified source contract plus owner-reviewed artifacts.
7. **Default behavior remains `sb_only`.**
8. **Grammar-A Step B, Grammar-B, and Grammar-C are not authorized.**
9. **No broader implementation authority is created** (no CLIL/P.E./Culture/Writing/Phonics/Values/Review or other-unit work).

---

## 9. Explicit non-actions

This brief does **not** authorize:

- Grammar-A Step B migration, seed, or NLL insertion;
- application, configuration, or test work;
- canonical mutation;
- Supabase CLI, database writes, or Storage mutations;
- feature flags;
- package, renderer, adapter, overlay, or resolver changes;
- promotion or deployment;
- CLIL/P.E./Culture/Writing/Phonics/Values/Review implementation;
- staging, commit, or push unless separately authorized.

---

## 10. Recommendation for next owner action

1. Treat Grammar-A Step B as the next **possible** owner gate — not active work.
2. Do not start Grammar coding, NLL insertion, package/renderer/adapter work, or serving changes from this file alone.
3. Keep CLIL/P.E., Culture, Writing, Phonics, Values, and Review at their existing docs-only statuses.

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
