# BE3 Unit 8 Values Standalone Planning Brief v0.1

**Status:** GENERIC SB_ONLY RETAINED / KNOWLEDGE-ONLY NLL APPLIED (D028 NARROW REVISE) / NO PACKAGE·RENDERER·ADAPTER·VALUES FLAG
**Version:** 0.1
**Date:** 2026-10-30 (narrowly revised + applied 2026-10-31)
**Authority:** Owner-directed architecture record; D022, D026, D027, and revised D028 remain in force.
**Implementation authorization:** Generic `sb_only` path retained. Shared modal NLL summary loading targets live `be3-u08-values` behind default-off `VITE_CHALKIE_NLL_ACTIVITY_SUMMARIES`. No Values package, renderer, delivery adapter, or Values-specific serving flag. Migration `20261030220000` applied 2026-10-31 (owner-authorized).

---

## 0. Standing constraints (read first)

1. Values is intentionally **not** an A/B/C component.
2. **Values has no Workbook companion.** No invented relationship.
3. **No Values-A/B/C transfer roadmap is authorized.**
4. Generic Student Book **`sb_only`** behavior is the retained delivery path.
5. Phonics p.141 and Review p.143 remain excluded from Values scope.
6. A Values NLL **knowledge** component is allowed solely to feed the shared Unit 8 modal activity-summary module.
7. Migration `20261030220000` is applied. Do not deploy, promote, or invent specialized Values delivery.

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
| NLL component key | `be3-u08-values` |
| NLL component UUID | `3e800008-0000-4000-8000-000000000010` |
| Prepared migration | `supabase/migrations/20261030220000_seed_nll_be3_u08_values.sql` |

### Current resolver / serving state

- `workbookCompanion === null`.
- `supportsTwoLessonSeries: true`.
- `twoLessonPackagingMode: 'sb_only'`.
- Generic SB-only path retained.
- Shared flag `VITE_CHALKIE_NLL_ACTIVITY_SUMMARIES` (default off) loads Values preferred summaries from live `be3-u08-values`.

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

Prepared preferred v1 summaries (human-authored from canonical evidence; hidden / experimental):

1. Activity 36 — Students listen to Audio 168 and classify four pictured activities as healthy or unhealthy.
2. Activity 37 — Students use the publisher language frames to tell a partner to do healthy things.
3. Activity 38 — Students invent an outdoor game with a group, write the rules, and teach it to the class.

Fingerprints recomputed with `fingerprintCanonicalActivity` against local SB canonical `3924fa23…67e6` and match the migration payload.

### SS link rationale

Approved SS pin `big-english/big_english_3_sb/canonical/ss_v1.json` (`f6f756…bb5a`; source bytes `docs/SS_JSON_FILES NEW/BE3_SS.JSON`) Unit 8 cell: category **Values**, `column_order` **6**, `entries_raw` exact **Get exercise.** One **proposed** link is prepared (`…000000001001`). Knowledge provenance only — not a delivery adapter.

Protect: answer-key classifications (36); audio transcript (never invent); personal disclosures; invented game/rules/rubric/moral/health guidance/model response; cultural, ability, family, health, or access assumptions.

---

## 3. Architecture decision (locked — narrow revise)

### Retained — generic SB-only delivery

- retain existing generic `sb_only` behavior;
- no invented companion;
- no SB→WB neutral package;
- no specialized renderer / delivery adapter / Values-specific flag;
- no five-artifact parity milestone;
- no A/B/C transfer pipeline.

### Newly allowed — knowledge-only NLL component

- live `be3-u08-values` with three ordered memberships and three preferred summaries;
- consume those summaries only through the shared modal summary module;
- live NLL totals: **10 / 77 / 77 / 10**;
- history: **29 / 0 / 0**.

Recorded as **D028** (narrow revise 2026-10-31).

---

## 4. Retained automated verification expectations

Tests must continue to prove:

- no Workbook companion for Values p.142;
- View Workbook unavailable;
- p.142 isolation from Phonics p.141 and Review p.143;
- generic `sb_only` behavior;
- no specialized Values package/renderer/adapter routing;
- Values NLL summaries load only behind the shared default-off flag;
- seed matches exact SB-only memberships and summaries.

---

## 5. Explicit non-actions

Does **not** authorize:

- re-applying or expanding Values beyond the applied knowledge component;
- specialized Values package / renderer / adapter / Values-specific flag;
- invented Workbook relationship;
- promotion or deployment of specialized Values delivery work.

---

## 6. Related repository references

- `app/src/features/chalkie/verifiedSbWbCompanions.ts` — Values p.142 intentionally omitted
- `app/src/features/chalkie/nllActivitySummaries.ts` — shared modal summary loader (includes Values key)
- `supabase/migrations/20261030220000_seed_nll_be3_u08_values.sql` — applied knowledge seed
- `scripts/tests/nllBe3U08ValuesSeedKnowledge.test.ts` — focused seed suite
- `docs/4-decisions.md` — D028
