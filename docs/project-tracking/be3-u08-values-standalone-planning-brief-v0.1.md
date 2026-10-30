# BE3 Unit 8 Values Standalone Planning Brief v0.1

**Status:** DOCUMENTATION ONLY / GENERIC SB-ONLY PATH RETAINED / NO SPECIALIZED MILESTONE
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner-directed documentation-only architecture record after a read-only repository audit; D022, D026 and D027 remain in force
**Implementation authorization:** **None.** This document does **not** authorize code, NLL insertion, database work, deployment, promotion, commit, or push.

---

## 0. Standing constraints (read first)

1. **LiA-C is owner-accepted and undeployed.** Remaining Unit 8 planning, including Values, is **documented and separately gated**; Values is **not** an active implementation stream.
2. **Values has no Workbook companion.** No missing or future Workbook relationship is implied.
3. **No Values-A/B/C transfer roadmap is authorized.** Do not force Values into the paired-component SB→WB A/B/C model for consistency.
4. Opener, Story, LiA, and provisional CLIL/P.E., Grammar, Culture, Writing, and Phonics briefs are architectural comparisons only — not content authority for Values.
5. Generic Student Book **`sb_only`** behavior is the retained path. This brief does not change serving behavior.
6. This document does **not** authorize code, NLL insertion, database work, deployment, promotion, commit, or push.

---

## 1. Exact component boundary

| Field | Boundary |
|---|---|
| Component | Big English 3 Unit 8 Values only |
| Strand | Values — *Get exercise.* |
| Student Book | p.142 |
| Workbook companion | **None** |
| Curated relationship | **None** |
| SB/WB stable reference | **None** |
| View Workbook | **Unavailable** |
| Learning-spine position | **Support** / `values_review` (**not** Core) |
| Active SB scope | **p.142 only** — Phonics p.141 and Review p.143 remain excluded |

### Current resolver / serving state (repository-supported)

- `workbookCompanion === null`.
- `supportsTwoLessonSeries: true`.
- `twoLessonPackagingMode: 'sb_only'`.
- No series title and no stable series reference.
- Generic SB-only single-lesson / SB-only two-lesson prompt/handoff paths may apply through existing builders; this brief does **not** approve the optional two-lesson UI split as a long-term design decision.

### Companion absence is intentional

Absence of a companion is **intentional and verified**, not a mapping gap and not a pairing failure. Do **not** invent a companion from WB Phonics p.116, WB Review p.117, or any other Workbook page.

### Explicit exclusions

No Opener, Story, Language in Action, Content Connection / P.E., Grammar, Culture, Writing, Phonics, Review, other Unit 8 spreads, other units, or other books. Do not force-pair Values p.142 with Review p.143.

---

## 2. Verified current foundations

These are **current repository facts**, not future proposals.

| Area | Current fact |
|---|---|
| Curated companion registry | `CURATED_VERIFIED_SB_WB_COMPANIONS` intentionally **omits** Values p.142 |
| Resolver / coverage / component-map / tests | Confirm **no** Workbook companion; View Workbook unavailable |
| Present serving | Generic Student Book `sb_only` |
| Generic SB-only prompt / handoff | Already exists for pages without a curated companion |
| Dedicated Values Chalkie experiment (U8) | **None found** |
| Neutral SB→WB package builder | **Not applicable** — requires a curated companion |
| Shared SB→WB renderer | **Not applicable** — does not support standalone Values packages |
| Values NLL / specialized package / renderer / adapter / flag | **None** |
| Five-artifact SB→WB baseline | **Does not apply** |

Values has **no Workbook evidence requirement**. Do not treat Workbook canonical availability as a Values blocker.

---

## 3. Verified Student Book evidence

Local SB canonical identifies **three** human-verified activities on p.142. Verified publisher Values statement:

**Get exercise.**

Do **not** invent audio wording, additional health claims, model responses, a game, rules, rubric, moral, or expected student opinion.

| Activity | ID | Type / task | Dependencies / honesty notes |
|---|---|---|---|
| **36** | `bep3_sb_act_08_36` | Look, listen, point, and say | **Audio 168**; **visual** dependency; four image scenarios; keyed healthy/unhealthy classifications |
| **37** | `bep3_sb_act_08_37` | Partner speaking | Publisher **language frames**; open speaking; no keyed items |
| **38** | `bep3_sb_act_08_38` | Group project | Invent an outdoor game, write rules, and teach the class; open production; no items or expected answers |

Membership in the Values component does **not** select an activity. Only teacher-selected activities may enter any future evidence use. Zero selection must remain honest and must not invent a substitute Values lesson.

---

## 4. Values integrity safeguards

- Keep **Get exercise.** as attributed publisher Values wording.
- Do **not** turn the page into medical, nutrition, body, weight, or lifestyle guidance.
- Activity 36’s keyed image classifications require answer-key protection.
- Never invent the Audio 168 transcript.
- Activity 37’s frames are optional speaking models, not required personal disclosures or scripts.
- Activity 38 must not receive a fabricated game, rules, rubric, or model project.
- Avoid prescribing one correct personal belief or lifestyle beyond publisher evidence.
- Avoid cultural, family, ability, health, or access assumptions about exercise.
- Earlier Unit 8 vocabulary, CLIL, Grammar, or other content remains **optional prior support only**.
- Zero selection must not create a substitute Values lesson.
- Preserve isolation from Phonics p.141 and Review p.143.

---

## 5. Curriculum-authority boundary

- Candidate Values authority: **Get exercise.**
- This remains a **candidate link only**.
- **All SS links remain unproposed** pending separate owner review.
- Do **not** conflate Values with CLIL/Culture “Keeping healthy,” Writing, Phonics, or Review.
- The SS remains curriculum authority.

---

## 6. Architecture decision

### Retained decision — generic SB-only

This is the **accepted planning direction**:

- retain existing generic `sb_only` behavior;
- no invented companion;
- no SB→WB neutral package;
- no specialized renderer;
- no five-artifact parity milestone;
- no adapter or flag;
- no active NLL milestone.

### Optional future knowledge review

A standalone SB-only knowledge review may be considered later **only** if the owner approves a concrete benefit case.

It would require:

- evidence-grounded SB-only summaries;
- careful separation of keyed classification, open speaking, and open project work;
- provenance and fingerprints;
- separate SS-link review;
- hidden/experimental status if persistent NLL is ever authorized.

This is **not** named or authorized as Values-A in the current roadmap.

### Specialized renderer or adapter

**Not recommended** without:

- an accepted user need;
- an SB-only artifact contract;
- proof that the generic path is insufficient;
- separate planning and owner authorization.

Do not propose implementation paths or filenames in this brief.

---

## 7. Owner decisions (recorded)

1. **LiA-C remains the primary active milestone.**
2. **Values remains support / `values_review`**, not Core.
3. **Values has no Workbook companion.**
4. **No companion may be invented from WB p.116 or p.117.**
5. **Generic `sb_only` behavior is retained.**
6. **No specialized A/B/C transfer roadmap is created.**
7. **No five-artifact SB→WB contract applies.**
8. **Open speaking and project work must not receive fabricated responses.**
9. **All SS links remain unproposed.**
10. **Current optional two-lesson UI behavior is not changed or approved as a long-term design decision by this brief.**
11. **No Values implementation is authorized.**

---

## 8. Explicit non-actions

This documentation-only brief does **not** authorize:

- edits outside this document;
- application, configuration, or test changes;
- a Workbook companion or relationship;
- NLL summaries, memberships, migrations, or seeds;
- Supabase CLI setup;
- database or Storage access/writes;
- packages, renderers, adapters, flags, overlays, or resolver changes;
- five-artifact parity work;
- promotion or deployment;
- any change to existing LiA-C work;
- any change to provisional CLIL/P.E., Grammar, Culture, Writing, or Phonics briefs;
- Review work;
- staging, commit, or push.

---

## 9. Recommendation for next owner action

1. Continue LiA-C as the primary stream.
2. Treat Values as **architecture-recorded / generic path retained** — not a transfer coding candidate.
3. Do not invent Workbook relationships or specialized Values milestones from this file alone.
4. Revisit a standalone knowledge review only if a concrete owner benefit case appears later.

---

## 10. Related repository references (read-only context)

- `app/src/features/chalkie/verifiedSbWbCompanions.ts` — Values p.142 intentionally omitted; Review notes confirm SB-only
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` — companion null → generic `sb_only`
- `app/src/features/chalkie/chalkieStudentBookUi.ts` — active one-page scope (p.142 vs p.143)
- `app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts` — SB→WB only; not applicable to Values
- `app/src/features/chalkie/renderChalkieFromNeutralPackage.ts` — SB→WB dispatch only; not applicable to Values
- `app/src/features/chalkie/be3U08UnitLearningSpine.ts` — support / `values_review`
- `docs/phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md` — Values SB-only confirmed
- `docs/phase-5/chalkie-coverage-map.md` — View Workbook not available for p.142
- Accepted Opener / Story / LiA briefs and provisional paired-component briefs — architectural comparisons only
