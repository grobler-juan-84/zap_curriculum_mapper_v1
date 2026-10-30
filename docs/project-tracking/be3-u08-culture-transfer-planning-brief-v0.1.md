# BE3 Unit 8 Culture Connection Transfer Planning Brief v0.1

**Status:** ACTIVE / CULTURE-A APPLIED + CULTURE-B/C AUTOMATED-ACCEPTED — undeployed/unpromoted
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner advance authorization for Culture-A apply + Culture-B/C automated acceptance; D022, D026 and D027 remain in force
**Implementation authorization:** Culture-A live; Culture-B/C behind default-off `VITE_NLL_CHALKIE_CULTURE_ADAPTER_PILOT`. Does **not** authorize promotion, deployment, flag-on default, commit, or push.

---

## 0. Standing constraints (read first)

1. **CLIL-A/B/C are committed and pushed** (`3f5fcabdc7a498643051882734744e23710be018` on `main`).
2. The historical **missing-Workbook blocker is cleared**: trusted WB canonical verified (`779981` / `811deea2…04fa`) alongside SB (`938463` / `3924fa23…67e6`).
3. **Culture-A Step B applied** (`20261030180000`): live NLL **6 / 53 / 53 / 6**; history **25 / 0 / 0**; zero Culture SS links. See [`be3-u08-culture-knowledge-review-v0.1.md`](./be3-u08-culture-knowledge-review-v0.1.md).
4. Opener, Story, LiA, Grammar, and CLIL transfer briefs are architectural patterns only — not permission to reuse their content assumptions for Culture.
5. Default serving for this relationship remains **`sb_only`**. Resolver default packaging mode unchanged.
6. **Culture-B/C are implemented and automated-accepted** behind default-off `VITE_NLL_CHALKIE_CULTURE_ADAPTER_PILOT`; undeployed/unpromoted; local/uncommitted.

---

## 1. Exact component boundary

| Field | Boundary |
|---|---|
| Component | Big English 3 Unit 8 Culture Connection / Around the World only |
| Strand | Culture Connection — Around the World (publisher heading includes “Strange sports”) |
| Student Book | pp.138–139 |
| Workbook companion | pp.113–114 (companion identity only; activity inventory not re-verified) |
| Relationship | `be3_sb_wb_rel_u08_culture_sb138-139_wb113-114` |
| Stable reference | `be3-sb-wb-u08-p138-139-wb113-114` (`BE3_U08_CULTURE_STABLE_REF`) |
| Learning-spine position | **Support** / `reading_content` (**not** Core) |

### Current resolver / serving state (repository-supported)

- Verified companion available (`BE3_U08_SB138_139_WB113_114`).
- View Workbook available on exact SB pp.138–139 for WB pp.113–114 only.
- `supportsTwoLessonSeries: true`.
- `twoLessonPackagingMode: 'sb_only'` (Opener/Story alone receive `sb_wb`).
- No active SB→WB series title and no serving series handoff for Culture.

### Explicit exclusions

No Opener, Story, Language in Action, Content Connection / P.E., Grammar, Writing, Phonics, Values, Review, other Unit 8 spreads, other units, or other books.

---

## 2. Verified current foundations

These are **current repository facts**, not future proposals.

| Area | Current fact |
|---|---|
| Curated companion + stable reference | Present in `verifiedSbWbCompanions.ts` |
| Resolver / View Workbook | Wired for exact SB 138–139 → WB 113–114 |
| Present serving | Generic Student Book `sb_only` two-lesson packaging |
| Earlier docs acceptance | Covers the **companion only**; handoff/Chalkie generation not authorized |
| Dedicated Culture Chalkie experiment | **None found** (no Exp-style Culture single-lesson oracle) |
| Exact two-page matching | Protected by existing companion / packaging / isolation tests |
| Neutral package builder | Does **not** support this relationship (supported configs: Opener, Story, LiA only) |
| Shared renderer dispatch | Does **not** dispatch Culture |
| Bespoke / neutral five-artifact SB→WB baseline | **Does not exist** |
| NLL component / package / renderer / adapter / flag | **None** for Culture |

Coverage map, companion tests, packaging tests, and learning-spine tests protect companion identity, `sb_only` packaging, and support / `reading_content` placement for this spread.

---

## 3. Verified Student Book evidence

Local SB canonical identifies **four** human-verified activities on pp.138–139. Do **not** reproduce full answer sets or invent cultural facts, rules, places, years, or country–sport relationships beyond inspected publisher evidence.

| Activity | ID | Type / task | Dependencies / honesty notes |
|---|---|---|---|
| **24** | `bep3_sb_act_08_24` | Partner matching | Sports/country options include **AU, FR, NZ, US, CA, UK**; **no keyed answers**; includes **“Add your own.”** Open matching must not be converted into factual country–sport mappings. |
| **25** | `bep3_sb_act_08_25` | Listen-and-read Culture | **Audio 160**; **visual** dependency; publisher wording **“Strange sports”**; verified source contains start-year evidence for **Octopush**, **Footvolley**, and **Pumpkin Regatta**. Do not invent a transcript or extra cultural claims. |
| **26** | `bep3_sb_act_08_26` | True/false (five claims) | Depends on Activity 25 reading evidence; T/F answers must not reconstruct unchecked reading text. |
| **27** | `bep3_sb_act_08_27` | Completion chart | Chart for the three named sports with origin, description, similar-sports, and reason-started fields; depends on reading/layout evidence. |

Membership in the Culture component does **not** select an activity. Only teacher-selected activities may enter future NLP/artifacts. Zero selection must remain honest.

---

## 4. Workbook evidence blocker — CLEARED

**Cleared 2026-10-30** by direct verification of trusted local canonicals (size + SHA-256 + JSON parse). Exact WB inventory is recorded in the Culture knowledge review: Activities **20–23** + Think Big on pp.113–114 (`bep_3_wb_act_113_20` … `bep_3_wb_act_114_tb`).

Earlier pairing / pilot documents remain historical context only where they conflict with the knowledge-review inventory.

---

## 5. Culture integrity safeguards

- **Activity 24** has **no keyed answers** and must not be converted into factual country–sport mappings.
- **“Add your own”** is open-ended teacher/student work, not publisher factual evidence.
- **“Strange sports”** must remain attributed publisher wording (activity prompt and SS-style heading evidence); future artifacts must not amplify judgmental framing.
- Named sports, start years, locations, rules, and cultural claims remain **selected-source bounded**. Do not invent or generalize beyond verified publisher evidence.
- **Audio 160** must not be reconstructed as a transcript.
- **Activity 26** depends on **Activity 25**; unchecked reading evidence must not be reconstructed through T/F answers.
- **Activity 27** chart and layout dependencies must remain explicit.
- Avoid stereotypes and unsupported cultural comparisons.
- Protect answer-key information (years, T/F claims, chart cells).
- Preserve exact **all / partial / zero** selection honesty.
- Distinguish **Culture** from **CLIL/P.E.** (calories / health), **Values**, **Writing**, and generic sports vocabulary.
- No reconstruction of unchecked activities from page context, NLL membership, or prior-learning suggestions.

---

## 6. Curriculum-authority boundary

- Potentially relevant Unit 8 **CLIL/Culture** Scope and Sequence evidence includes **Around the World: Strange sports** vocabulary: `contest`, `court`, `diving`, `net`, `puck`, `race`, `regatta`, `rowing`, `scuba`, `team`.
- Treat this **only** as a candidate authority boundary.
- Do **not** conflate it with P.E. **“Keeping healthy,”** Grammar Structures, Writing, Phonics, or Values.
- **All SS links remain unproposed** until full SB/WB evidence review.
- The SS remains curriculum authority. Pairing docs, pilot plans, and the absence of a dedicated Culture experiment do not replace it.

---

## 7. Provisional gated sequence

These gates are **future consideration only**. None is authorized by this document.

### Culture-A — knowledge readiness

**Blocked pending WB canonical restoration and owner authorization.**

Future consideration only:

- exact SB/WB inventory and source order;
- evidence-grounded summaries;
- fingerprints and provenance;
- carefully reviewed proposed SS links (if any);
- hidden/experimental NLL design;
- separate owner authorization before any persistent insertion.

**Explicitly prohibited at this stage:** migration, seed, database write, live-NLL insert, promotion, or coding of package/renderer/adapter layers.

### Culture-B — neutral package and renderer parity

**Future consideration only, after Culture-A acceptance.**

Future consideration only:

- exact relationship package configuration;
- all / partial / zero selection;
- source-order preservation;
- reading, cultural-fact, image, audio, answer, chart, layout, and activity-chain honesty;
- five-artifact renderer;
- BI/NLL boundary decision;
- non-serving proof;
- retained Opener, Story, LiA, resolver, and `sb_only` regressions.

**Parity authority (proposed):**

```text
verified source contract + owner-reviewed artifact contract
```

No Culture experiment or single-lesson output may serve as an SB→WB parity oracle. No accepted bespoke SB→WB five-artifact baseline exists for Culture.

Default packaging must remain `sb_only` until a separately accepted serving decision exists.

### Culture-C — adapter integration

**Future consideration only, after Culture-A and Culture-B acceptance.**

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
2. **Culture remains support / `reading_content`**, not Core.
3. **Activity 24 remains an open, non-keyed task** and must not be treated as factual country–sport evidence.
4. **“Strange sports” is retained only as attributed publisher wording.**
5. **No Culture experiment provides a parity oracle.**
6. **All SS links remain unproposed** pending complete evidence review.
7. **Future Culture-B parity** must use verified source contract plus owner-reviewed artifacts.
8. **Default behavior remains `sb_only`.**
9. **Culture-A implementation is not authorized.**
10. **No broader Unit 8 expansion is authorized.**

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
- NLL visibility promotion;
- deployment;
- any change to existing LiA-C work;
- any change to provisional CLIL/P.E. or Grammar briefs;
- Writing, Phonics, Values, or Review work;
- staging, commit, or push.

---

## 10. Recommendation for next owner action

1. Continue LiA-C retained verification and authenticated manual acceptance as the primary stream.
2. Restore `data/phase1/big_english_3_wb/canonical/v1.json` before any Culture evidence review.
3. Keep this brief provisional until ChatGPT Desktop / owner review decides whether to unlock a later Culture-A planning authorization.
4. Do not start Culture coding, NLL design execution, or tracker promotion from this file alone.

---

## 11. Related repository references (read-only context)

- `app/src/features/chalkie/verifiedSbWbCompanions.ts` — `BE3_U08_SB138_139_WB113_114` / `BE3_U08_CULTURE_STABLE_REF`
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` — Opener/Story-only `sb_wb`; otherwise `sb_only`
- `app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts` — Culture unsupported
- `app/src/features/chalkie/renderChalkieFromNeutralPackage.ts` — Culture unsupported dispatch
- `app/src/features/chalkie/be3U08UnitLearningSpine.ts` — support / `reading_content`
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` — historical companion acceptance
- `docs/phase-5/chalkie-coverage-map.md` — current coverage claim for pp.138–139
- Accepted Opener / Story / LiA briefs and provisional CLIL/P.E. / Grammar briefs — architectural pattern references only
