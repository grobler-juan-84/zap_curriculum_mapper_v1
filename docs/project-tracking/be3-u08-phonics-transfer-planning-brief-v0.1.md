# BE3 Unit 8 Phonics Transfer Planning Brief v0.1

**Status:** PROVISIONAL / EVIDENCE-BLOCKED / DOCUMENTATION ONLY
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner-directed documentation-only planning after a read-only repository audit; D022, D026 and D027 remain in force
**Implementation authorization:** **None.** This document does **not** authorize Phonics-A, Phonics-B, Phonics-C, coding, NLL insertion, database work, deployment, promotion, commit, or push.

---

## 0. Standing constraints (read first)

1. **LiA-C is owner-accepted and undeployed.** Remaining Unit 8 planning, including Phonics, is **documented and separately gated**; Phonics is **not** an active implementation stream.
2. This brief is **provisional** because the BE3 Workbook canonical file is unavailable.
3. Exact Workbook activity claims remain **blocked** by the missing canonical and must wait for evidence review after restoration and re-verification.
4. **Future delivery shape remains undecided.** The exact one-page SB → one-page WB companion does **not** authorize an SB/WB two-lesson series, a combined single lesson, or an accepted five-artifact shape.
5. Opener, Story, LiA, and provisional CLIL/P.E., Grammar, Culture, and Writing briefs are architectural patterns only — not permission to reuse their content assumptions for Phonics.
6. Default serving for this relationship remains **`sb_only`**. No serving-path change is proposed here.
7. This brief does **not** authorize Phonics-A/B/C, coding, NLL insertion, database work, deployment, promotion, commit, or push.

---

## 1. Exact component boundary

| Field | Boundary |
|---|---|
| Component | Big English 3 Unit 8 Phonics only |
| Strand | Phonics — *all, au, aw* |
| Student Book | p.141 |
| Workbook companion | p.116 (companion identity only; activity inventory not re-verified) |
| Relationship | `be3_sb_wb_rel_u08_phonics_sb141_wb116` |
| Stable reference | `be3-sb-wb-u08-p141-wb116` (`BE3_U08_PHONICS_STABLE_REF`) |
| Learning-spine position | **Support** / `phonics` (**not** Core) |
| Active SB scope | **p.141 only** — Writing p.140 and Values p.142 remain excluded |

### Current resolver / serving state (repository-supported)

- Verified companion available (`BE3_U08_SB141_WB116`).
- View Workbook available on exact SB p.141 for WB p.116 only.
- `supportsTwoLessonSeries: true`.
- `twoLessonPackagingMode: 'sb_only'` (Opener/Story alone receive `sb_wb`).
- No active SB→WB series title and no serving series handoff for Phonics.
- Active-lesson scope isolates p.141 when the visible PDF spread is 140–141.

### Future delivery shape (explicitly undecided)

The curated 1→1 companion identity does **not** decide packaging:

- **No** authorization for an SB→WB two-lesson series.
- **No** authorization to combine SB and WB into one lesson.
- **No** accepted five-artifact shape.
- Current **`sb_only`** behavior remains unchanged until a separate owner decision after complete WB evidence review.

### Explicit exclusions

No Opener, Story, Language in Action, Content Connection / P.E., Grammar, Culture, Writing, Values, Review, other Unit 8 spreads, other units, or other books. Do not force-pair Phonics p.141 with Writing p.140 or Values p.142.

---

## 2. Verified current foundations

These are **current repository facts**, not future proposals.

| Area | Current fact |
|---|---|
| Curated companion + stable reference | Present in `verifiedSbWbCompanions.ts` |
| Resolver / View Workbook | Wired for exact SB p.141 → WB p.116 |
| Present serving | Generic Student Book `sb_only` packaging |
| Active-page isolation | Protected from Writing p.140 and Values p.142 by active-lesson scope and selection tests |
| Earlier docs acceptance | Covers the **companion only**; handoff/Chalkie generation not authorized |
| Dedicated Phonics Chalkie experiment | **None found** |
| Neutral package builder | Does **not** support this relationship (supported configs: Opener, Story, LiA only) |
| Shared renderer dispatch | Does **not** dispatch Phonics |
| Bespoke / neutral five-artifact SB→WB baseline | **Does not exist** |
| NLL component / package / renderer / adapter / flag | **None** for Phonics |

Coverage map, companion tests, packaging tests, active one-page scope tests, and learning-spine tests protect companion identity, `sb_only` packaging, p.141 isolation, and support / `phonics` placement.

---

## 3. Verified Student Book evidence

Local SB canonical identifies **four** human-verified activities on p.141. Page/component target graphemes are **`all`**, **`au`**, and **`aw`**. Do **not** claim IPA, a universal pronunciation rule, accent behavior, exceptions, or additional target graphemes.

Representative publisher example words needed for boundary description include **ball**, **haul**, and **draw**. Do **not** invent further example words. Do **not** reproduce the full chant text or any audio transcript in this brief.

| Activity | ID | Type / task | Dependencies / honesty notes |
|---|---|---|---|
| **32** | `bep3_sb_act_08_32` | Listen, read, and repeat | **Audio 163**; target graphemes `all`, `au`, `aw`; no keyed answers |
| **33** | `bep3_sb_act_08_33` | Listen, find, and say | **Audio 164**; **visual** dependency; verified publisher targets include `ball`, `haul`, and `draw` |
| **34** | `bep3_sb_act_08_34` | Blending | **Audio 165**; eight keyed publisher words; answer-key protection required |
| **35** | `bep3_sb_act_08_35` | Read aloud, listen, and chant | **Audio 166**; depends on verified chant evidence `bep3_sb_text_08_06`; activity items are empty |

Membership in the Phonics component does **not** select an activity. Only teacher-selected activities may enter future NLP/artifacts. Zero selection must remain honest and must not invent a substitute phonics drill.

---

## 4. Workbook evidence blocker

**Missing dependency:**

`data/phase1/big_english_3_wb/canonical/v1.json`

Its absence **blocks confirmation** of:

- exact WB activity IDs, order, and count;
- fingerprints and hashes;
- exact circle, underline, connect/write, chant-gap, word, answer, and audio evidence;
- safe derived summaries and NLL memberships;
- **future delivery-shape decision** (series vs combined single lesson vs other);
- package selection behavior against real WB evidence;
- renderer parity against accepted artifact expectations;
- canonical-dependent retained regressions for this relationship.

### Historical documentation awaiting canonical re-verification

Earlier pairing / pilot documents describe Workbook p.116 in terms such as circling *all/au/aw*, underlining in sentences, connecting letters and writing, listen-and-write chant gaps, and shared sound/spelling words, while excluding Writing 115 and Review 117. Those statements are **historical documentation only**. They are **not** re-verified facts in this brief and must not be treated as exact activity inventory until the WB canonical is restored and reviewed.

---

## 5. Phonics integrity safeguards

- Bind claims to verified graphemes **`all`**, **`au`**, and **`aw`**.
- Keep sound and spelling claims distinct; do not import general pronunciation knowledge.
- Do **not** add IPA, pronunciation rules, accent variants, exceptions, minimal pairs, or invented words.
- Audio tracks **163–166** must not be reconstructed as transcripts.
- Activity 33 retains its visual dependency.
- Activity 34’s keyed words require answer-key protection.
- Activity 35 may use chant evidence only when the activity is selected.
- If Activity 35 or its chant evidence is excluded, do **not** reconstruct chant wording from memory, page context, NLL, or audio metadata.
- Reference the chant by evidence ID (`bep3_sb_text_08_06`) and role (phonics chant) **without** reproducing its full text.
- Later blend or chant work must not reconstruct excluded earlier listening/finding evidence.
- Zero selection must not create a substitute phonics drill.
- Partial selection must remain exact.
- Keep p.141 isolated from Writing p.140 and Values p.142.
- Distinguish Phonics from Writing conjunctions (*and/but/or*), Grammar morphology, and Culture/CLIL reading.

---

## 6. Curriculum-authority boundary

- Candidate Phonics authority: **`all`**, **`au`**, **`aw`**.
- This remains a **candidate only**.
- **All SS links remain unproposed** until complete SB/WB evidence review.
- Do **not** conflate Phonics with Writing, Structures, CLIL/Culture, Values, or unit vocabulary.
- The SS remains curriculum authority. Pairing docs and the absence of a dedicated Phonics experiment do not replace it.

---

## 7. Provisional gated sequence

These gates are **future consideration only**. None is authorized by this document.

### Phonics-A — knowledge readiness

**Blocked pending WB canonical restoration and owner authorization.**

Future consideration only:

- exact SB/WB inventory and source order;
- evidence-grounded summaries;
- explicit audio and phonics provenance;
- fingerprints and provenance;
- carefully reviewed proposed SS links (if any);
- hidden/experimental NLL design;
- separate owner authorization before any persistent insertion.

**Explicitly prohibited at this stage:** migration, seed, database write, live-NLL insert, promotion, delivery-shape decision, or coding of package/renderer/adapter layers.

### Phonics-B — neutral package and renderer parity

**Future consideration only, after Phonics-A acceptance and a separate delivery-shape decision.**

Future consideration only:

- exact relationship package configuration consistent with the accepted delivery shape;
- all / partial / zero selection;
- source-order preservation;
- grapheme, spelling, word-list, audio, visual, answer, chant, and activity-chain honesty;
- page isolation from Writing and Values;
- five-artifact renderer;
- BI/NLL boundary decision;
- non-serving proof;
- retained Opener, Story, LiA, resolver, one-page isolation, and `sb_only` regressions.

**Parity authority (proposed):**

```text
verified source contract + owner-reviewed artifact contract
```

No inferred pronunciation lesson, teacher word list, single-lesson output, or reconstructed chant may serve as an SB→WB parity oracle. No accepted bespoke SB→WB five-artifact baseline exists for Phonics.

Default packaging must remain `sb_only` until a separately accepted serving / delivery-shape decision exists.

### Phonics-C — adapter integration

**Future consideration only, after Phonics-A and Phonics-B acceptance.**

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
2. **Phonics remains support / `phonics`**, not Core.
3. **Target evidence is limited to `all`, `au`, and `aw`.**
4. **No IPA, pronunciation rules, variants, exceptions, or additional words may be inferred.**
5. **Full chant text is not reproduced in this brief.**
6. **Activity 35 uses chant evidence only when selected.**
7. **P.141 remains isolated from Writing p.140 and Values p.142.**
8. **All SS links remain unproposed** pending complete evidence review.
9. **Future Phonics-B parity** must use verified source contract plus owner-reviewed artifacts.
10. **Future delivery shape remains undecided** (no series, combined single lesson, or five-artifact shape authorized by the companion alone).
11. **Default behavior remains `sb_only`.**
12. **Phonics-A implementation is not authorized.**
13. **No broader Unit 8 expansion is authorized.**

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
- full chant reproduction or audio reconstruction;
- NLL visibility promotion;
- deployment;
- any change to existing LiA-C work;
- any change to provisional CLIL/P.E., Grammar, Culture, or Writing briefs;
- Values or Review work;
- staging, commit, or push.

---

## 10. Recommendation for next owner action

1. Continue LiA-C retained verification and authenticated manual acceptance as the primary stream.
2. Restore `data/phase1/big_english_3_wb/canonical/v1.json` before any Phonics evidence review.
3. Keep this brief provisional until ChatGPT Desktop / owner review decides whether to unlock a later Phonics-A planning authorization.
4. Defer delivery-shape choice until complete WB review; do not infer series or combined packaging from the 1→1 companion alone.
5. Do not start Phonics coding, NLL design execution, or tracker promotion from this file alone.

---

## 11. Related repository references (read-only context)

- `app/src/features/chalkie/verifiedSbWbCompanions.ts` — `BE3_U08_SB141_WB116` / `BE3_U08_PHONICS_STABLE_REF`
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` — Opener/Story-only `sb_wb`; otherwise `sb_only`
- `app/src/features/chalkie/chalkieStudentBookUi.ts` — active one-page scope (p.141 vs p.140 / Values)
- `app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts` — Phonics unsupported
- `app/src/features/chalkie/renderChalkieFromNeutralPackage.ts` — Phonics unsupported dispatch
- `app/src/features/chalkie/be3U08UnitLearningSpine.ts` — support / `phonics`
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` — historical companion acceptance
- `docs/phase-5/chalkie-coverage-map.md` — current coverage claim for p.141
- Accepted Opener / Story / LiA briefs and provisional CLIL/P.E. / Grammar / Culture / Writing briefs — architectural pattern references only
