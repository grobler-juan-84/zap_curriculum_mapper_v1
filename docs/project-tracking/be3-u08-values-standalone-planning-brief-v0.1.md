# BE3 Unit 8 Values Standalone Planning Brief v0.1

**Status:** VALUES COMPLETE BY ARCHITECTURE DECISION / GENERIC SB_ONLY RETAINED / NO SPECIALIZED NLL OR A/B/C PIPELINE
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner-directed architecture record; D022, D026, D027, and D028 remain in force.
**Implementation authorization:** **None** for specialized Values work. Generic `sb_only` path retained. No Values migration, NLL component, package, renderer, adapter, or flag.

---

## 0. Standing constraints (read first)

1. Values is intentionally **not** an A/B/C component.
2. **Values has no Workbook companion.** No invented relationship.
3. **No Values-A/B/C transfer roadmap is authorized.**
4. Generic Student Book **`sb_only`** behavior is the retained path.
5. Phonics p.141 and Review p.143 remain excluded from Values scope.
6. This document does **not** authorize code, NLL insertion, database work, deployment, promotion, commit, or push for Values specialization.

---

## 1. Exact boundary

| Field | Boundary |
|---|---|
| Component | Big English 3 Unit 8 Values only |
| Strand | Values — *Get exercise.* |
| Student Book | p.142 only · `bep3_sb_p142` · Activities **36–38** |
| Workbook companion | **None** |
| Curated relationship | **None** |
| SB/WB stable reference | **None** |
| View Workbook | **Unavailable** |
| Learning-spine position | **Support** / `values_review` (**not** Core) |
| Active SB scope | **p.142 only** — Phonics p.141 and Review p.143 remain excluded |

### Current resolver / serving state

- `workbookCompanion === null`.
- `supportsTwoLessonSeries: true`.
- `twoLessonPackagingMode: 'sb_only'`.
- Generic SB-only path retained.

### Companion absence is intentional

Absence of a companion is **intentional and verified**, not a mapping gap. Do **not** invent a companion from WB Phonics p.116, WB Review p.117, or any other Workbook page.

---

## 2. Canonical closure (2026-10-30)

Trusted SB canonical verified (`938463` / `3924fa23…67e6`). No WB companion required.

| Activity | ID | Type | Fingerprint | Evidence notes |
|---|---|---|---|---|
| **36** | `bep3_sb_act_08_36` | `values_listening_identification` | `904d555171527fc0edb93360096c82c48ba1031048209bddcf2f96ccf3b3fd97` | Audio **168**; **visual** dependency; four keyed healthy/unhealthy classifications |
| **37** | `bep3_sb_act_08_37` | `speaking_imperatives` | `28c0f42aa137bf610df5a35223101738043cf0a0f4d7fc6e2bd1c058431880b4` | Open partner speaking with publisher language frames; no keyed items |
| **38** | `bep3_sb_act_08_38` | `project` | `4b150a90e379b435969e2977869f48d972236ff56898575928177a58ba7f740e` | Open group project; no items or expected answers |

Publisher Values wording protected exactly: **Get exercise.**

Protect: answer-key classifications (36); audio transcript (never invent); personal disclosures; invented game/rules/rubric/moral/health guidance/model response; cultural, ability, family, health, or access assumptions.

Page context: heading **Get exercise.** · section `Values | Get exercise.` · `values_project` · audio+visual true.

---

## 3. Architecture decision (locked)

### Retained decision — generic SB-only

**VALUES COMPLETE BY ARCHITECTURE DECISION / GENERIC SB_ONLY RETAINED / NO SPECIALIZED NLL OR A/B/C PIPELINE**

- retain existing generic `sb_only` behavior;
- no invented companion;
- no SB→WB neutral package;
- no specialized renderer / adapter / flag;
- no NLL component or Values migration;
- no five-artifact parity milestone.

Recorded as **D028**.

### Specialized renderer or adapter

**Not recommended** without an accepted user need, an SB-only artifact contract, proof that the generic path is insufficient, and separate owner authorization.

---

## 4. Retained automated verification expectations

Tests must continue to prove:

- no Workbook companion for Values p.142;
- View Workbook unavailable;
- p.142 isolation from Phonics p.141 and Review p.143;
- generic `sb_only` behavior;
- no specialized Values routing.

---

## 5. Explicit non-actions

Does **not** authorize:

- a Values migration or NLL component;
- specialized Values package / renderer / adapter / flag;
- invented Workbook relationship;
- promotion or deployment of specialized Values work.

---

## 6. Related repository references

- `app/src/features/chalkie/verifiedSbWbCompanions.ts` — Values p.142 intentionally omitted
- `app/src/features/chalkie/resolveChalkieLessonContext.ts` — companion null → generic `sb_only`
- `app/src/features/chalkie/chalkieStudentBookUi.ts` — active one-page scope (p.142 vs p.143)
- `scripts/tests/chalkieWorkbookActivitySelection.test.ts` — Values no-companion coverage
- `docs/4-decisions.md` — D028
