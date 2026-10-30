# BE3 Unit 8 Review Transfer Planning Brief v0.1

**Status:** PROVISIONAL / EVIDENCE-BLOCKED / DOCUMENTATION ONLY
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner-directed documentation-only planning after a read-only repository audit; D022, D026 and D027 remain in force
**Implementation authorization:** **None.** This document does **not** authorize Review-A, Review-B, Review-C, coding, NLL insertion, database work, deployment, promotion, commit, or push.

---

## 0. Standing constraints (read first)

1. **LiA-C is owner-accepted and undeployed.** Remaining Unit 8 planning, including Review, is **documented and separately gated**; Review is **not** an active implementation stream.
2. **Review is mixed consolidation, not automatic whole-unit aggregation.** The label “Review” does not prove that every Unit 8 strand is present.
3. This brief is **provisional** because the BE3 Workbook canonical file is unavailable.
4. Exact Workbook activity claims remain **blocked** by the missing canonical and must wait for evidence review after restoration and re-verification.
5. **Future delivery shape remains undecided.** The exact one-page SB → one-page WB companion does **not** authorize an SB/WB two-lesson series, a combined single lesson, or an accepted five-artifact shape.
6. Opener, Story, LiA, and provisional CLIL/P.E., Grammar, Culture, Writing, Phonics, and Values briefs are architectural comparisons and boundary references only — **not** permission to aggregate their evidence into Review.
7. Default serving for this relationship remains **`sb_only`**. No serving-path change is proposed here.
8. This brief does **not** authorize Review-A/B/C, coding, NLL insertion, database work, deployment, promotion, commit, or push.

---

## 1. Exact component boundary

| Field | Boundary |
|---|---|
| Component | Big English 3 Unit 8 Review only |
| Strand | Review / self-assessment (mixed consolidation) |
| Student Book | p.143 |
| Workbook companion | p.117 (companion identity only; activity inventory not re-verified) |
| Relationship | `be3_sb_wb_rel_u08_review_sb143_wb117` |
| Stable reference | `be3-sb-wb-u08-p143-wb117` (`BE3_U08_REVIEW_STABLE_REF`) |
| Learning-spine position | **`review_support`** / `values_review` (**not** Core) |
| Active SB scope | **p.143 only** — Values p.142 remains excluded |

### Current resolver / serving state (repository-supported)

- Verified companion available (`BE3_U08_SB143_WB117`).
- View Workbook available on exact SB p.143 for WB p.117 only.
- `supportsTwoLessonSeries: true`.
- `twoLessonPackagingMode: 'sb_only'` (Opener/Story alone receive `sb_wb`).
- No active SB→WB series title and no serving series handoff for Review.
- Active-lesson scope isolates p.143 when the visible PDF spread is 142–143.

### Future delivery shape (explicitly undecided)

The curated 1→1 companion identity does **not** decide packaging:

- **No** authorization for an SB→WB two-lesson series.
- **No** authorization to combine SB and WB into one lesson.
- **No** accepted five-artifact shape.
- Current **`sb_only`** behavior remains unchanged until a separate owner decision after complete WB evidence review.

### Explicit exclusions

No Opener, Story, Language in Action, Content Connection / P.E., Grammar, Culture, Writing, Phonics, Values, other Unit 8 spreads, other units, or other books. Do not force-pair Review p.143 with Values p.142.

---

## 2. Verified current foundations

These are **current repository facts**, not future proposals.

| Area | Current fact |
|---|---|
| Curated companion + stable reference | Present in `verifiedSbWbCompanions.ts` |
| Resolver / View Workbook | Wired for exact SB p.143 → WB p.117 |
| Present serving | Generic Student Book `sb_only` packaging |
| One-page Values isolation | Protected by active-lesson scope and selection tests (p.143 vs p.142) |
| Earlier docs acceptance | Covers the **companion only**; handoff/Chalkie generation not authorized |
| Dedicated Review Chalkie experiment | **None found** |
| Neutral package builder | Does **not** support this relationship (supported configs: Opener, Story, LiA only) |
| Shared renderer dispatch | Does **not** dispatch Review |
| Bespoke / neutral five-artifact SB→WB baseline | **Does not exist** |
| NLL component / package / renderer / adapter / flag | **None** for Review |

Coverage map, companion tests, packaging tests, active one-page scope tests, and learning-spine tests protect companion identity, `sb_only` packaging, p.143 isolation from Values, and `review_support` placement.

---

## 3. Verified Student Book evidence

Local SB canonical identifies **three** human-verified activities on p.143.

Page-level notes:

- p.143 has a **page-level visual dependency**;
- **no** SB audio dependency on the Review activities;
- **no** continuous reading text on this page.

Do **not** reproduce full answer sets, invent survey answers, or create a unit-wide review lesson from these activities.

| Activity | ID | Type / task | Dependencies / honesty notes |
|---|---|---|---|
| **39** | `bep3_sb_act_08_39` | Read and choose | *Did…?* / *did* / *didn’t* choices; **four keyed** items |
| **40** | `bep3_sb_act_08_40` | Class survey | Publisher frames and prompt cues; initial items contain expected *Did you…?* forms; later items are open/add-your-own; open ask-and-answer work |
| **41** | `bep3_sb_act_08_41` | Read and complete verb forms | **Six keyed** past-form items |

Membership in the Review component does **not** select an activity. Only teacher-selected activities may enter future NLP/artifacts. Zero selection must remain honest and must not invent a generic Unit 8 wrap-up.

---

## 4. Exact represented versus absent strands

### Explicitly represented on SB Review evidence only

- Selected *Did…?* / *did* / *didn’t* communicative review in Activities 39–40;
- Selected past regular/irregular morphology in Activity 41;
- Healthy-habit **topic context** in survey prompts.

This does **not** import the complete LiA, Grammar, or Opener components. Alignment of form or topic is not component inheritance.

### Absent unless later verified within Review evidence

- Story reading;
- CLIL calorie / P.E. article work;
- Culture sports reading;
- Writing *and* / *but* / *or*;
- Phonics *all* / *au* / *aw* or chant;
- Values project;
- Song or full Opener vocabulary inventory;
- WB-only gerund-as-subject practice.

Do **not** treat “Review” as proof that every Unit 8 strand is present.

---

## 5. Workbook evidence blocker

**Missing dependency:**

`data/phase1/big_english_3_wb/canonical/v1.json`

Its absence **blocks confirmation** of:

- exact WB activity IDs, order, and count;
- fingerprints and hashes;
- exact verb-choice, cloze, gerund, answer, visual, or activity-chain evidence;
- safe derived summaries and NLL memberships;
- **future delivery-shape decision** (series vs combined single lesson vs other);
- package selection behavior against real WB evidence;
- renderer parity against accepted artifact expectations;
- canonical-dependent retained regressions for this relationship.

### Historical documentation awaiting canonical re-verification

Earlier pairing / pilot documents describe Workbook p.117 in terms such as circling verbs, healthy-living cloze, and gerund-as-subject practice on the same Review page, while excluding Phonics 116. Those statements are **historical documentation only**. They are **not** re-verified facts in this brief and must not be treated as exact activity inventory until the WB canonical is restored and reviewed.

Specifically:

- Historical WB **gerund-as-subject** work is **WB-page evidence only**;
- it must **not** be back-ported into SB Review summaries;
- historical references using incorrect SB activity numbers must **not** override verified SB Activities **39–41**.

---

## 6. Review integrity safeguards

- Review summaries must be **activity-specific**.
- Never auto-merge earlier Unit 8 NLL components.
- Never inherit earlier summaries or SS links automatically.
- Activities 39 and 41 keyed answers require answer-key protection.
- Activity 40 combines publisher frames with open survey responses — do not invent personal answers or require disclosure.
- Preserve the page-level visual dependency; do not invent layout meaning beyond selected evidence.
- Do **not** invent listening tasks because SB Review has no audio.
- Excluding Activity 39 must not reconstruct its choices from Activities 40 or 41.
- Optional prior learning cannot replace current Review evidence.
- Zero selection must not create a generic Unit 8 wrap-up.
- Keep p.143 isolated from Values p.142.
- Do not treat “Review” as proof that every Unit 8 strand is present.

---

## 7. Curriculum-authority boundary

- No clean single-strand SS column represents mixed Review.
- Component-level SS links would **overstate** coverage.
- **All SS links remain unproposed.**
- If authority links are ever considered, prefer **activity-level provenance** tied to exact Review evidence.
- “I can…” or self-assessment claims must remain publisher-bounded.
- Do **not** inherit links from Opener, Story, LiA, CLIL, Grammar, Culture, Writing, Phonics, or Values.
- The SS remains curriculum authority.

---

## 8. Provisional gated sequence

These gates are **future consideration only**. None is authorized by this document. Do not force A/B/C for consistency with paired components that already have accepted serving paths.

### Review-A — activity-specific knowledge readiness

**Blocked pending WB canonical restoration and owner authorization.**

Future consideration only:

- exact SB/WB Review inventory and source order;
- summaries of Review activities only;
- **no** earlier-component inheritance;
- fingerprints and provenance;
- activity-level authority decision;
- hidden/experimental NLL design;
- separate owner authorization before any persistent insertion.

**Explicitly prohibited at this stage:** migration, seed, database write, live-NLL insert, promotion, delivery-shape decision, merging earlier NLL components, or coding of package/renderer/adapter layers.

### Review-B — neutral package and renderer proof

**Future consideration only, after Review-A acceptance and a separate delivery-shape decision.**

Future consideration only:

- exact relationship package configuration consistent with the accepted delivery shape;
- all / partial / zero selection;
- source-order preservation;
- mixed-strand, keyed/open, visual, and cumulative-task honesty;
- prevention of earlier-component reconstruction;
- five-artifact or separately approved artifact contract;
- BI/NLL boundary decision;
- non-serving proof;
- retained Opener, Story, LiA, resolver, one-page isolation, and `sb_only` regressions.

**Parity authority (proposed):**

```text
verified source contract + owner-reviewed artifact contract
```

No generic unit summary, earlier component package, or teacher-created review may serve as the SB→WB parity oracle. No accepted bespoke SB→WB five-artifact baseline exists for Review.

Default packaging must remain `sb_only` until a separately accepted serving / delivery-shape decision exists.

### Review-C — adapter integration

**Future consideration only, after Review-A and Review-B acceptance.**

High-level only (not an implementation specification):

- independent default-off flag;
- exact-scope lazy Review NLL loading;
- selected Review NLP only;
- shared renderer routing;
- stale-result guards;
- current-path (`sb_only`) fallback;
- automated and authenticated manual acceptance.

Do not design overlay wiring, env names, or module layouts in this brief.

---

## 9. Owner decisions (recorded)

1. **LiA-C remains the primary active milestone.**
2. **Review remains `review_support` / `values_review`**, not Core.
3. **Review is mixed consolidation, not whole-unit aggregation.**
4. **Only exact Review activities may supply Review knowledge.**
5. **Earlier components are never inherited automatically.**
6. **Historical WB gerund evidence remains WB-only** unless canonically verified.
7. **Component-level SS links remain unproposed.**
8. **Activity-level provenance is preferred** for any future authority mapping.
9. **Future Review-B parity** must use verified source contract plus owner-reviewed artifacts.
10. **Future delivery shape remains undecided.**
11. **Default behavior remains `sb_only`.**
12. **Review-A/B/C implementation is not authorized.**
13. **No other unit or book expansion is authorized by this brief.**

---

## 10. Explicit non-actions

This documentation-only brief does **not** authorize:

- edits outside this document;
- application, configuration, or test implementation;
- canonical creation or modification;
- merging earlier NLL components;
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
- any change to provisional CLIL/P.E., Grammar, Culture, Writing, Phonics, or Values briefs;
- another unit or book;
- staging, commit, or push.

---

## 11. Recommendation for next owner action

1. Continue LiA-C retained verification and authenticated manual acceptance as the primary stream.
2. Restore `data/phase1/big_english_3_wb/canonical/v1.json` before any Review evidence review.
3. Keep this brief provisional until ChatGPT Desktop / owner review decides whether to unlock a later Review-A planning authorization.
4. Defer delivery-shape choice until complete WB review; do not infer series or combined packaging from the 1→1 companion alone.
5. Do not start Review coding, NLL design execution, unit-wide aggregation, or tracker promotion from this file alone.

---

## 12. Related repository references (read-only context)

- `app/src/features/chalkie/verifiedSbWbCompanions.ts` — `BE3_U08_SB143_WB117` / `BE3_U08_REVIEW_STABLE_REF`
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` — Opener/Story-only `sb_wb`; otherwise `sb_only`
- `app/src/features/chalkie/chalkieStudentBookUi.ts` — active one-page scope (p.143 vs Values p.142)
- `app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts` — Review unsupported
- `app/src/features/chalkie/renderChalkieFromNeutralPackage.ts` — Review unsupported dispatch
- `app/src/features/chalkie/be3U08UnitLearningSpine.ts` — `review_support` / `values_review`
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` — historical companion acceptance
- `docs/phase-5/chalkie-coverage-map.md` — current coverage claim for p.143
- Accepted Opener / Story / LiA briefs and provisional Unit 8 component briefs — architectural comparisons only; not aggregation authority
