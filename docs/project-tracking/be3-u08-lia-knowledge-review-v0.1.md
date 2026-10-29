# BE3 Unit 8 Language in Action Knowledge Review v0.1

**Status:** LiA-A COMPLETE — OWNER-ACCEPTED
**Version:** 0.1
**Date:** 2026-10-29
**Authority:** Owner-approved LiA-A Steps A–B; bounded Step B insertion executed 2026-10-29
**Implementation authorization:** LiA-A Step B completed and owner-accepted. Migration `20261029213000` inserted the approved records and is recorded as applied. LiA-B was completed and accepted separately. LiA-C, deployment and promotion remain unauthorized.

---

## 1. Exact boundary

| Field | Value |
|---|---|
| Component key | `be3-u08-lia` — live as `draft`; this does **not** mean `status = available` |
| Title | Big English 3 Unit 8 Language in Action |
| Live component status | `draft` |
| Relationship | `be3_sb_wb_rel_u08_lia_sb132-133_wb107-108` |
| Stable reference | `be3-sb-wb-u08-p132-133-wb107-108` |
| Student Book | pp.132–133: Activities 8–12 |
| Workbook | pp.107–108: Activities 7–10 |
| Exact inventory | Five SB activities + four WB activities = nine verified activities |
| Core language | Past simple questions and short answers with `Did …?`, `did` and `didn't` |
| Adjacent exclusions | SB pp.130–131 Story; SB pp.134–135 CLIL/P.E.; WB p.106 Story; WB pp.109–110 CLIL/P.E. |

The accepted resolver/View Workbook relationship is evidence for the exact component boundary. It does not authorize an SB→WB series, neutral package, renderer or NLL adapter.

---

## 2. Evidence and verification method

Step A used only read-only sources:

- SB canonical: `data/phase1/big_english_3_sb/canonical/v1.json`;
- WB canonical: `data/phase1/big_english_3_wb/canonical/v1.json`;
- approved SS-V2 review bytes: `docs/SS_JSON_FILES NEW/BE3_SS.JSON`;
- accepted relationship evidence in `verifiedSbWbCompanions.ts` and the LiA transfer planning brief;
- existing NLL schema, Opener seed and accepted Story knowledge implementation as conventions only; and
- a live read-only NLL collision/baseline check on project `kivvmobjphtcgxoltqbc`.

Every eligible activity was checked for page identity, activity number, activity type, verification status, instruction, item count, language frame and media dependency. No experiment-derived teaching advice was treated as publisher evidence.

### Verified source order

| Position | activity_id | Source | Page | Publisher instruction |
|---:|---|---|---:|---|
| 1 | `bep3_sb_act_08_08` | SB | 132 | Listen and look at the sentences. Help Luke and Amy make more. |
| 2 | `bep3_sb_act_08_09` | SB | 132 | Match the phrases. Make five questions about yesterday. Then ask and answer. |
| 3 | `bep3_sb_act_08_10` | SB | 133 | Complete the dialogs. Use did or didn't. |
| 4 | `bep3_sb_act_08_11` | SB | 133 | Put the words in order to make questions. Then ask. |
| 5 | `bep3_sb_act_08_12` | SB | 133 | Read and match. Now change the answers. |
| 6 | `bep_3_wb_act_107_7` | WB | 107 | Listen and stick. What did Grace and Carlos do on the weekend? |
| 7 | `bep_3_wb_act_107_8` | WB | 107 | Read and complete with did or didn't. |
| 8 | `bep_3_wb_act_108_9` | WB | 108 | Look and circle. |
| 9 | `bep_3_wb_act_108_10` | WB | 108 | Look and answer. |

All nine records are `human_verified` and belong to the exact four accepted pages.

---

## 3. Canonical hashes, fingerprints and source bindings

### File SHA-256

SHA-256 was computed over the raw file bytes.

| Object | Path used for review | SHA-256 | Binding decision |
|---|---|---|---|
| SB canonical | `data/phase1/big_english_3_sb/canonical/v1.json` | `3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6` | Bind future SB summaries to Storage path `big-english/big_english_3_sb/canonical/v1.json` |
| WB canonical | `data/phase1/big_english_3_wb/canonical/v1.json` | `811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa` | Bind future WB summaries to Storage path `big-english/big_english_3_wb/canonical/v1.json` |
| Approved SS-V2 | `docs/SS_JSON_FILES NEW/BE3_SS.JSON` | `f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a` | Bind proposed links to Storage path `big-english/big_english_3_sb/canonical/ss_v1.json` |
| Local legacy SS | `data/phase1/big_english_3_sb/canonical/ss_v1.json` | `4d30c3bae33283262156822b794bebfe1ba545c7fd5a484bbacb9e8135305bd5` | Do not bind; legacy rollback copy, not current SS authority |

The versioned Storage key `big-english/big_english_3_sb/canonical/ss_v1.json` holds the approved SS-V2 object. Its filename does not make the local legacy file authoritative.

### Activity fingerprints

The existing `fingerprintCanonicalActivity` algorithm was reproduced independently: stable recursively key-sorted JSON of the full canonical activity object, SHA-256 over its UTF-8 bytes. The recomputed values matched the prepared evidence.

| activity_id | activity_sha256 |
|---|---|
| `bep3_sb_act_08_08` | `724834079145d53b8f6084b74517b38e3c82aa6252f5aaae2502c2caabd8462f` |
| `bep3_sb_act_08_09` | `87a73133e696f67edbdb501a58dc6f0d8c30e45be39675df4d77a7da6a8309e9` |
| `bep3_sb_act_08_10` | `484f2a8af42268c5b9058ce265f3cfb30e6cf9b5f018b6940903099ffe5fe455` |
| `bep3_sb_act_08_11` | `f52de88e3b0e6c68d98a8df078a56100d71f7c380e43b197b9044be4a9fed757` |
| `bep3_sb_act_08_12` | `220f25dd6ef5fe5683bcb041d252eea726ecc79956ba0a0be278377f7a0c73ba` |
| `bep_3_wb_act_107_7` | `8d87e2f39b1159ea9695a99ae3d862e0561abdfc6970d7d31e659bfaec835f1b` |
| `bep_3_wb_act_107_8` | `b1031c028795146942e2cf08d03d8295d4f06d3b38505266b37b66e51daaef56` |
| `bep_3_wb_act_108_9` | `d505b0b98e5f8bcf58dc392f6caaa54d82b165ba64983d3f7b68f45dbbe5dd73` |
| `bep_3_wb_act_108_10` | `f8290f121ff0040d8657f3ca795ccbcf46abd9b7cd69758ae4e465055139ccba` |

These hashes were recomputed and compared immediately before the separately authorized insertion. They remain the staleness and provenance pins for the live summaries.

---

## 4. Record-by-record evidence review

`evidence_status = sufficient` means the verified record supports the narrow teacher-friendly action summary. It does not mean missing audio, sticker or illustration content may be reconstructed.

### 4.1 `bep3_sb_act_08_08` — SB p.132 Activity 8

- **Verification:** `human_verified`
- **Evidence:** Audio 155; two `Did …?` question-and-short-answer models; healthy-living bank items `drink lots of water`, `eat a healthy lunch`, `get enough exercise`; audio and visual dependencies are true.
- **Proposed summary:** Students listen to Audio 155, look at two `Did …?` question-and-short-answer models and use the healthy-living phrase bank to make more.
- **evidence_status:** `sufficient`
- **Boundary note:** The summary does not invent audio wording, sequence or additional examples.

### 4.2 `bep3_sb_act_08_09` — SB p.132 Activity 9

- **Verification:** `human_verified`
- **Evidence:** Five verified phrase-half pairs; model `Did you do any exercise yesterday? / No, I didn't.`; no media dependency.
- **Proposed summary:** Students match five healthy-living phrase halves, make questions about yesterday and ask and answer them.
- **evidence_status:** `sufficient`

### 4.3 `bep3_sb_act_08_10` — SB p.133 Activity 10

- **Verification:** `human_verified`
- **Evidence:** Four verified gap-fill dialogues and their `did`/`didn't` answers; no media dependency.
- **Proposed summary:** Students complete four short dialogues with `did` or `didn't`.
- **evidence_status:** `sufficient`

### 4.4 `bep3_sb_act_08_11` — SB p.133 Activity 11

- **Verification:** `human_verified`
- **Evidence:** Five verified word-order items and completed past-simple questions; instruction ends with `Then ask.`; no media dependency.
- **Proposed summary:** Students reorder words to make five questions about past activities, then ask them.
- **evidence_status:** `sufficient`

### 4.5 `bep3_sb_act_08_12` — SB p.133 Activity 12

- **Verification:** `human_verified`
- **Evidence:** Six verified `Did …?` questions and matched answers; instruction says to change the answers; no media dependency.
- **Proposed summary:** Students match six `Did …?` questions to answers, then change the answers.
- **evidence_status:** `sufficient`

### 4.6 `bep_3_wb_act_107_7` — WB p.107 Activity 7

- **Verification:** `human_verified`
- **Evidence:** Instruction asks what Grace and Carlos did on the weekend; Audio 156, illustrations and stickers are required; three visual item locators are present without expected answers.
- **Proposed summary:** Students listen to Audio 156 and place stickers to show what Grace and Carlos did on the weekend.
- **evidence_status:** `sufficient`
- **Boundary note:** The summary does not state the audio sequence, sticker destinations or answers.

### 4.7 `bep_3_wb_act_107_8` — WB p.107 Activity 8

- **Verification:** `human_verified`
- **Evidence:** Two verified health-related dialogue items and their `did`/`didn't` completions; no media dependency.
- **Proposed summary:** Students complete two health-related dialogues with `did` or `didn't`.
- **evidence_status:** `sufficient`

### 4.8 `bep_3_wb_act_108_9` — WB p.108 Activity 9

- **Verification:** `human_verified`
- **Evidence:** Three verified either/or sentence items; expected past-activity choices; visual dependency is true.
- **Proposed summary:** Students use the illustrations to circle the past activity that completes each of three sentences about yesterday.
- **evidence_status:** `sufficient`
- **Boundary note:** The summary relies on, but does not describe or reconstruct, the illustrations.

### 4.9 `bep_3_wb_act_108_10` — WB p.108 Activity 10

- **Verification:** `human_verified`
- **Evidence:** Seven verified `Did …?` questions and short answers; language frame `Yes, he/she did. / No, he/she didn't.`; visual dependency is true; canonical note says answers derive from Activity 9 illustrations.
- **Proposed summary:** Students use the Activity 9 illustrations to answer seven `Did …?` questions with affirmative or negative short answers.
- **evidence_status:** `sufficient`
- **Boundary note:** The summary preserves the Activity 9→10 dependency and does not present the answers as independent text-only evidence.

---

## 5. Proposed SS links

SS authority is the approved SS-V2 object with hash `f6f756e1…bb5a`. Unit 8 is **Healthy Living** (`unit_number_raw = "8"`).

### Proposed with `status = proposed`

| column_order | category_name_raw | Direct SS evidence | Component-level rationale |
|---:|---|---|---|
| 2 | Structures | `Did (you) get enough sleep yesterday?` and `Yes, I did./No, I didn't.` | The exact `Did …?` and affirmative/negative short-answer structure is the primary LiA practice across SB and WB. |
| 7 | I can... | `...ask and answer about activities in the past.` | The component repeatedly builds, asks, matches and answers questions about past activities. |

The links are locators for component-level relevance. They do not claim every activity independently satisfies the full SS entry, and they do not become curriculum authority.

### Considered and withheld

| Category | Reason |
|---|---|
| Vocabulary | Healthy-living phrases recur, especially in SB Activities 8–9, but the component's primary purpose is structural ask/answer practice. Do not over-link. |
| CLIL/Culture, Writing, Phonics, Values | No defensible component-level alignment from the accepted LiA pages. |

---

## 6. Pre-insertion identifier availability — live read-only check

A read-only check against `kivvmobjphtcgxoltqbc.supabase.co` on 2026-10-29 found the accepted baseline unchanged:

| Table | Live count |
|---|---:|
| `nll_components` | 2 |
| `nll_component_activities` | 14 |
| `nll_activity_summaries` | 14 |
| `nll_ss_component_links` | 3 |

The two live components are `be3-u08-opener` and `be3-u08-story`, both `draft`. Their 14 summaries remain preferred, `hidden` and `experimental`; all three SS links remain `proposed`.

The following proposed LiA identities had **zero collisions** at check time:

- component key `be3-u08-lia`;
- component UUID `3e800008-0000-4000-8000-000000000003`;
- all nine proposed summary IDs;
- all nine `(activity_id, version = 1)` pairs and preferred-summary slots;
- SS-link UUIDs `3e800008-0000-4000-8000-000000000301` and `3e800008-0000-4000-8000-000000000302`;
- memberships for the nine LiA activity IDs; and
- any other component whose key contains `lia` or whose title contains `Language in Action`.

The final pre-insertion check repeated these queries immediately before Step B. The baseline was still **2 / 14 / 14 / 3** and every collision count was zero.

---

## 7. Approved and inserted hidden/experimental record payloads

These payloads were approved for LiA-A Step B and inserted without visibility promotion.

### 7.1 `nll_components`

| Field | Proposed value |
|---|---|
| `id` | `3e800008-0000-4000-8000-000000000003` |
| `component_key` | `be3-u08-lia` |
| `title` | Big English 3 Unit 8 Language in Action |
| `status` | `draft` |

### 7.2 `nll_component_activities`

| component_id | activity_id | position |
|---|---|---:|
| `…000003` | `bep3_sb_act_08_08` | 1 |
| `…000003` | `bep3_sb_act_08_09` | 2 |
| `…000003` | `bep3_sb_act_08_10` | 3 |
| `…000003` | `bep3_sb_act_08_11` | 4 |
| `…000003` | `bep3_sb_act_08_12` | 5 |
| `…000003` | `bep_3_wb_act_107_7` | 6 |
| `…000003` | `bep_3_wb_act_107_8` | 7 |
| `…000003` | `bep_3_wb_act_108_9` | 8 |
| `…000003` | `bep_3_wb_act_108_10` | 9 |

### 7.3 `nll_activity_summaries`

Common fields for every proposed row:

- `version = 1`;
- `evidence_status = sufficient`;
- `display_status = hidden`;
- `review_state = experimental`;
- `is_preferred = true`.

Shared provenance shape, with `source` set per row:

```json
{
  "record_type": "teacher_friendly_summary",
  "source": "SB|WB",
  "verification_status": "human_verified",
  "original_review_status": "experimental_review_required",
  "generation": {
    "method": "ai_assisted_draft",
    "prompt_version": "lia-a-step-a-knowledge-prep-v0.1"
  }
}
```

No provider, model or human approval is invented in provenance.

| id | activity_id | Proposed summary_text | Canonical binding | activity_sha256 |
|---|---|---|---|---|
| `big_english_3_sb_unit_08_activity_08_summary_lia_a_v1` | `bep3_sb_act_08_08` | Students listen to Audio 155, look at two `Did …?` question-and-short-answer models and use the healthy-living phrase bank to make more. | SB path + `3924fa23…67e6` | `72483407…462f` |
| `big_english_3_sb_unit_08_activity_09_summary_lia_a_v1` | `bep3_sb_act_08_09` | Students match five healthy-living phrase halves, make questions about yesterday and ask and answer them. | SB path + SB hash | `87a73133…09e9` |
| `big_english_3_sb_unit_08_activity_10_summary_lia_a_v1` | `bep3_sb_act_08_10` | Students complete four short dialogues with `did` or `didn't`. | SB path + SB hash | `484f2a8a…e455` |
| `big_english_3_sb_unit_08_activity_11_summary_lia_a_v1` | `bep3_sb_act_08_11` | Students reorder words to make five questions about past activities, then ask them. | SB path + SB hash | `f52de88e…d757` |
| `big_english_3_sb_unit_08_activity_12_summary_lia_a_v1` | `bep3_sb_act_08_12` | Students match six `Did …?` questions to answers, then change the answers. | SB path + SB hash | `220f25dd…73ba` |
| `big_english_3_wb_unit_08_p107_activity_7_summary_lia_a_v1` | `bep_3_wb_act_107_7` | Students listen to Audio 156 and place stickers to show what Grace and Carlos did on the weekend. | WB path + `811deea2…04fa` | `8d87e2f3…5f1b` |
| `big_english_3_wb_unit_08_p107_activity_8_summary_lia_a_v1` | `bep_3_wb_act_107_8` | Students complete two health-related dialogues with `did` or `didn't`. | WB path + WB hash | `b1031c02…ef56` |
| `big_english_3_wb_unit_08_p108_activity_9_summary_lia_a_v1` | `bep_3_wb_act_108_9` | Students use the illustrations to circle the past activity that completes each of three sentences about yesterday. | WB path + WB hash | `d505b0b9…dd73` |
| `big_english_3_wb_unit_08_p108_activity_10_summary_lia_a_v1` | `bep_3_wb_act_108_10` | Students use the Activity 9 illustrations to answer seven `Did …?` questions with affirmative or negative short answers. | WB path + WB hash | `f8290f12…ccba` |

The complete, non-truncated hashes are authoritative in §3 and must be used in any future payload.

### 7.4 `nll_ss_component_links`

| id | component_id | ss_path | ss_sha256 | unit_number_raw | column_order | category_name_raw | status |
|---|---|---|---|---|---:|---|---|
| `3e800008-0000-4000-8000-000000000301` | `…000003` | `big-english/big_english_3_sb/canonical/ss_v1.json` | `f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a` | `8` | 2 | Structures | `proposed` |
| `3e800008-0000-4000-8000-000000000302` | `…000003` | `big-english/big_english_3_sb/canonical/ss_v1.json` | `f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a` | `8` | 7 | I can... | `proposed` |

---

## 8. Step B transactional insertion — executed

Durable migration:

`supabase/migrations/20261029213000_seed_nll_be3_u08_lia.sql`

The migration used the approved bounded shape:

```sql
begin;
-- Fail fast if any proposed key, UUID, summary ID, activity/version pair,
-- preferred-summary slot, membership or SS-link identity is occupied.
-- Insert one draft component.
-- Insert nine exact memberships in positions 1–9.
-- Insert nine v1 preferred hidden/experimental summaries.
-- Insert two proposed SS links.
-- Assert exact LiA rows, exclusions and unchanged Opener/Story identities.
commit;
```

Observed safeguards:

- ordinary inserts only; no `ON CONFLICT … DO NOTHING`;
- one transaction covering all four tables;
- exact identifiers from §7, not generated replacements;
- no schema or RLS change;
- no update to any Opener or Story row;
- no adjacent Story or CLIL activity membership;
- pre-commit assertions for `draft`, `hidden`, `experimental`, preferred v1 summaries and `proposed` links; and
- commit only if all assertions pass.

The live baseline was **2 / 14 / 14 / 3**. The transaction committed and the verified totals became **3 components / 23 memberships / 23 summaries / 5 SS links**.

Focused validation:

- `scripts/tests/nllBe3U08LiaSeedStepB.test.ts` created;
- retained Story seed and Opener NLL pilot suites included; and
- automated result: **13/13 passed**.

Post-write verification confirmed the exact nine ordered memberships, nine preferred v1 `hidden`/`experimental` summaries, two `proposed` links, and unchanged Opener/Story identities. Migration version `20261029213000` is recorded as applied remotely.

---

## 9. Future compensating rollback design — not executed

Rollback must be LiA-scoped and transactional:

```sql
begin;
-- Verify the target is exactly be3-u08-lia / …000003.
-- Delete only SS links …000301 and …000302.
-- Delete only the nine exact *_summary_lia_a_v1 IDs.
-- Delete only memberships owned by component …000003.
-- Delete component …000003 only when component_key = 'be3-u08-lia'.
-- Assert all LiA identities are absent and Opener/Story are unchanged.
commit;
```

Rollback requirements:

- reverse dependency order: links, summaries, memberships, component;
- exact IDs only; never delete broadly by Unit 8, page, prefix or activity ID;
- fail if the target component identity no longer matches;
- assert the accepted Opener and Story component IDs, memberships, summaries and links remain intact; and
- if insertion began from **2 / 14 / 14 / 3**, assert rollback returns exactly to that baseline.

Do not use rollback to retire the accepted Opener or Story records, reconcile unrelated migration history or change NLL visibility.

---

## 10. Step A acceptance checklist

| Gate | Result |
|---|---|
| Exact relationship and four-page boundary | PASS |
| Five SB + four WB activities, stable source order | PASS |
| All nine records `human_verified` | PASS |
| Raw canonical file hashes recomputed | PASS |
| Nine activity fingerprints independently recomputed | PASS |
| Teacher-friendly summaries reviewed against each record | PASS — owner-approved for Step B |
| Audio/sticker/illustration limits preserved | PASS |
| Structures link grounded in approved SS-V2 | PASS — proposed only |
| I can... link grounded in approved SS-V2 | PASS — proposed only |
| Vocabulary and unrelated SS columns withheld | PASS |
| Proposed identifiers collision-checked live | PASS — repeated immediately before insertion |
| Insertion and rollback bounded to LiA | PASS |
| Supabase/persistent write performed | YES — approved LiA-A Step B only |
| Migration or seed file created | YES — `20261029213000_seed_nll_be3_u08_lia.sql` |
| Application/configuration change performed | NO |
| Focused test change performed | YES — seed validation only; 13/13 passed with retained regressions |
| LiA-B or LiA-C work started | NO |

---

## 11. Owner review gate

LiA-A Step B is complete and owner-accepted. The live knowledge remains intentionally draft, hidden/experimental and unpromoted.

LiA-B package/renderer parity was completed and accepted separately. LiA-C adapter work, deployment and promotion require separate authorization.

Beauty in simplicity: nine verified activities, two proposed SS links, one reversible boundary.

---

## 12. Related evidence

- [`be3-u08-lia-transfer-planning-brief-v0.1.md`](./be3-u08-lia-transfer-planning-brief-v0.1.md)
- [`stage-6a-story-knowledge-review-v0.1.md`](./stage-6a-story-knowledge-review-v0.1.md)
- [`nll-migration-roadmap-v0.1.md`](./nll-migration-roadmap-v0.1.md)
- [`../phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md`](../phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md)
- [`../4-decisions.md`](../4-decisions.md)
