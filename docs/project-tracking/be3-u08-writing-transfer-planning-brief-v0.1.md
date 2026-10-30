# BE3 Unit 8 Writing Transfer Planning Brief v0.1

**Status:** PROVISIONAL / EVIDENCE-BLOCKED / DOCUMENTATION ONLY
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner-directed documentation-only planning after a read-only repository audit; D022, D026 and D027 remain in force
**Implementation authorization:** **None.** This document does **not** authorize Writing-A, Writing-B, Writing-C, coding, NLL insertion, database work, deployment, promotion, commit, or push.

---

## 0. Standing constraints (read first)

1. **LiA-C is owner-accepted and undeployed.** Remaining Unit 8 planning, including Writing, is **documented and separately gated**; Writing is **not** an active implementation stream.
2. This brief is **provisional** because the BE3 Workbook canonical file is unavailable.
3. Exact Workbook activity claims remain **blocked** by the missing canonical and must wait for evidence review after restoration and re-verification.
4. **Future delivery shape remains undecided.** The exact one-page SB → one-page WB companion does **not** authorize an SB/WB two-lesson series or a combined single lesson.
5. Opener, Story, LiA, and provisional CLIL/P.E., Grammar, and Culture briefs are architectural patterns only — not permission to reuse their content assumptions for Writing.
6. Default serving for this relationship remains **`sb_only`**. No serving-path change is proposed here.
7. This brief does **not** authorize Writing-A/B/C, coding, NLL insertion, database work, deployment, promotion, commit, or push.

---

## 1. Exact component boundary

| Field | Boundary |
|---|---|
| Component | Big English 3 Unit 8 Writing only |
| Strand | Writing — *Combining Sentences with and, but, or* |
| Student Book | p.140 |
| Workbook companion | p.115 (companion identity only; activity inventory not re-verified) |
| Relationship | `be3_sb_wb_rel_u08_writing_sb140_wb115` |
| Stable reference | `be3-sb-wb-u08-p140-wb115` (`BE3_U08_WRITING_STABLE_REF`) |
| Learning-spine position | **Support** / `writing` (**not** Core) |
| Active SB scope | **p.140 only** — Phonics p.141 remains excluded |

### Current resolver / serving state (repository-supported)

- Verified companion available (`BE3_U08_SB140_WB115`).
- View Workbook available on exact SB p.140 for WB p.115 only.
- `supportsTwoLessonSeries: true`.
- `twoLessonPackagingMode: 'sb_only'` (Opener/Story alone receive `sb_wb`).
- No active SB→WB series title and no serving series handoff for Writing.
- Active-lesson scope isolates p.140 when the visible PDF spread is 140–141.

### Future delivery shape (explicitly undecided)

The curated 1→1 companion identity does **not** decide packaging:

- **No** authorization for an SB→WB two-lesson series.
- **No** authorization to combine SB and WB into one lesson.
- Current **`sb_only`** behavior remains unchanged until a separate owner decision after complete WB evidence review.

### Explicit exclusions

No Opener, Story, Language in Action, Content Connection / P.E., Grammar, Culture, Phonics, Values, Review, other Unit 8 spreads, other units, or other books. Do not force-pair Writing p.140 with Phonics p.141.

---

## 2. Verified current foundations

These are **current repository facts**, not future proposals.

| Area | Current fact |
|---|---|
| Curated companion + stable reference | Present in `verifiedSbWbCompanions.ts` |
| Resolver / View Workbook | Wired for exact SB p.140 → WB p.115 |
| Present serving | Generic Student Book `sb_only` packaging |
| One-page scope / Phonics isolation | Protected by active-lesson scope and selection tests (p.140 vs p.141) |
| Earlier docs acceptance | Covers the **companion only**; handoff/Chalkie generation not authorized |
| Dedicated Unit 8 Writing Chalkie experiment | **None found** |
| Neutral package builder | Does **not** support this relationship (supported configs: Opener, Story, LiA only) |
| Shared renderer dispatch | Does **not** dispatch Writing |
| Bespoke / neutral five-artifact SB→WB baseline | **Does not exist** |
| NLL component / package / renderer / adapter / flag | **None** for Writing |

Coverage map, companion tests, packaging tests, active one-page scope tests, and learning-spine tests protect companion identity, `sb_only` packaging, p.140 isolation from Phonics, and support / `writing` placement.

---

## 3. Verified Student Book evidence

Local SB canonical identifies **four** human-verified activities on p.140. Do **not** reproduce complete answer sets. Do **not** invent a model paragraph, sample response, rubric, checklist, audience, genre, correction standard, or teaching procedure.

| Activity | ID | Type / task | Dependencies / honesty notes |
|---|---|---|---|
| **28** | `bep3_sb_act_08_28` | Complete, then listen and check | **Audio 162**; three keyed conjunction items; no invented transcript |
| **29** | `bep3_sb_act_08_29` | Combine and write sentences | Five keyed sentence-combining items; keyed examples are **not** a student paragraph |
| **30** | `bep3_sb_act_08_30` | Read and choose | Four keyed *and* / *but* / *or* choices |
| **31** | `bep3_sb_act_08_31` | Open writing production | Write three sentences about healthy habits; use *and*, *but*, and *or* once; **no items / no expected answer** |

Membership in the Writing component does **not** select an activity. Only teacher-selected activities may enter future NLP/artifacts. Zero selection must remain honest and must not invent a substitute writing task.

---

## 4. Workbook evidence blocker

**Missing dependency:**

`data/phase1/big_english_3_wb/canonical/v1.json`

Its absence **blocks confirmation** of:

- exact WB activity IDs, order, and count;
- fingerprints and hashes;
- exact conjunction, clause-box, cloze, answer, audio, and activity-chain evidence;
- safe derived summaries and NLL memberships;
- **future delivery-shape decision** (series vs combined single lesson vs other);
- package selection behavior against real WB evidence;
- renderer parity against accepted artifact expectations;
- canonical-dependent retained regressions for this relationship.

### Historical documentation awaiting canonical re-verification

Earlier pairing / pilot documents describe Workbook p.115 in terms such as circling *and/but/or*, completing clauses from a box, paragraph cloze with *or/but/and*, and shared coordinating-conjunction writing work, while excluding Culture 113–114 and Phonics 116. Those statements are **historical documentation only**. They are **not** re-verified facts in this brief and must not be treated as exact activity inventory until the WB canonical is restored and reviewed.

---

## 5. Writing integrity safeguards

- Separate **keyed craft practice** in Activities 28–30 from **open production** in Activity 31.
- **Audio 162** is listen-and-check evidence; never invent a transcript.
- Keyed joins and choices must not become a required student composition.
- Activity 31 may be summarized **only** as an open production task; no fabricated student text, sample response, rubric, checklist, or invented assessment criteria.
- Preserve the exact publisher prompt without adding audience, purpose, genre, or teaching procedure beyond verified evidence.
- The “healthy habits” topic is **prompt context**, not permission to invent content.
- Zero selection must not produce a substitute writing task.
- Partial selection must not reconstruct unchecked examples.
- Earlier vocabulary, Grammar, LiA, Culture, or CLIL content remains **optional prior support only** — never a replacement for current Writing evidence.
- SB p.140 must never be merged with Phonics p.141 without a separate owner decision.
- Distinguish publisher evidence from AI-created teaching advice.

---

## 6. Curriculum-authority boundary

- Candidate Writing authority: *Combining Sentences with and, but, or.*
- Candidate “I can…” authority: use *and*, *or*, and *but* in sentences.
- These remain **candidates only**.
- **All SS links remain unproposed** until complete SB/WB evidence review.
- Do **not** conflate them with Grammar Structures, CLIL/Culture, Phonics, Values, or generic healthy-habit content.
- The SS remains curriculum authority. Pairing docs and the absence of a dedicated Writing experiment do not replace it.

---

## 7. Provisional gated sequence

These gates are **future consideration only**. None is authorized by this document.

### Writing-A — knowledge readiness

**Blocked pending WB canonical restoration and owner authorization.**

Future consideration only:

- exact SB/WB inventory and source order;
- separate summaries for keyed practice, scaffold, prompt, and open production;
- fingerprints and provenance;
- carefully reviewed proposed SS links (if any);
- hidden/experimental NLL design;
- separate owner authorization before any persistent insertion.

**Explicitly prohibited at this stage:** migration, seed, database write, live-NLL insert, promotion, delivery-shape decision, or coding of package/renderer/adapter layers.

### Writing-B — neutral package and renderer parity

**Future consideration only, after Writing-A acceptance and a separate delivery-shape decision.**

Future consideration only:

- exact relationship package configuration consistent with the accepted delivery shape;
- all / partial / zero selection;
- source-order preservation;
- model, prompt, scaffold, audio, answer, open-production, and page-isolation honesty;
- five-artifact renderer;
- BI/NLL boundary decision;
- non-serving proof;
- retained Opener, Story, LiA, resolver, one-page isolation, and `sb_only` regressions.

**Parity authority (proposed):**

```text
verified source contract + owner-reviewed artifact contract
```

No Writing experiment, keyed example, teacher-created paragraph, or AI-generated response may serve as an SB→WB parity oracle. No accepted bespoke SB→WB five-artifact baseline exists for Writing.

Default packaging must remain `sb_only` until a separately accepted serving / delivery-shape decision exists.

### Writing-C — adapter integration

**Future consideration only, after Writing-A and Writing-B acceptance.**

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

## 8. Owner decisions (recorded)

1. **LiA-C remains the primary active milestone.**
2. **Writing remains support / `writing`**, not Core.
3. **SB p.140 remains isolated from Phonics p.141.**
4. **Activity 31 remains open production** with no fabricated response, rubric, or invented criteria.
5. **Earlier Unit 8 content remains optional prior support only.**
6. **All SS links remain unproposed** pending complete evidence review.
7. **Future Writing-B parity** must use verified source contract plus owner-reviewed artifacts.
8. **Future delivery shape remains undecided** (no series and no combined single lesson authorized by the companion alone).
9. **Default behavior remains `sb_only`.**
10. **Writing-A implementation is not authorized.**
11. **No broader Unit 8 expansion is authorized.**

---

## 9. Explicit non-actions

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
- a combined SB+WB single lesson or an SB→WB two-lesson series delivery shape;
- NLL visibility promotion;
- deployment;
- any change to existing LiA-C work;
- any change to provisional CLIL/P.E., Grammar, or Culture briefs;
- Phonics, Values, or Review work;
- staging, commit, or push.

---

## 10. Recommendation for next owner action

1. Continue LiA-C retained verification and authenticated manual acceptance as the primary stream.
2. Restore `data/phase1/big_english_3_wb/canonical/v1.json` before any Writing evidence review.
3. Keep this brief provisional until ChatGPT Desktop / owner review decides whether to unlock a later Writing-A planning authorization.
4. Defer delivery-shape choice until complete WB review; do not infer series or combined packaging from the 1→1 companion alone.
5. Do not start Writing coding, NLL design execution, or tracker promotion from this file alone.

---

## 11. Related repository references (read-only context)

- `app/src/features/chalkie/verifiedSbWbCompanions.ts` — `BE3_U08_SB140_WB115` / `BE3_U08_WRITING_STABLE_REF`
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` — Opener/Story-only `sb_wb`; otherwise `sb_only`
- `app/src/features/chalkie/chalkieStudentBookUi.ts` — active one-page scope (p.140 vs p.141)
- `app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts` — Writing unsupported
- `app/src/features/chalkie/renderChalkieFromNeutralPackage.ts` — Writing unsupported dispatch
- `app/src/features/chalkie/be3U08UnitLearningSpine.ts` — support / `writing`
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` — historical companion acceptance
- `docs/phase-5/chalkie-coverage-map.md` — current coverage claim for p.140
- Accepted Opener / Story / LiA briefs and provisional CLIL/P.E. / Grammar / Culture briefs — architectural pattern references only
