# BE3 Unit 8 Writing Knowledge Review v0.1

**Status:** WRITING-A APPLIED; WRITING-B/C IMPLEMENTED / AUTOMATED VERIFICATION PASSED / OWNER-ACCEPTED UNDER ADVANCE AUTHORIZATION
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner advance authorization for Writing-A knowledge/apply and Writing-B/C package/renderer/adapter. Canonical SB/WB evidence is authoritative over the historical Writing brief’s missing-Workbook blocker.
**Implementation authorization:** Writing-A live; Writing-B/C behind default-off `VITE_NLL_CHALKIE_WRITING_ADAPTER_PILOT`. Does **not** authorize promotion, deployment, flag-on default, commit, or push.

---

## 0. Hard boundary statements

- Trusted SB and WB canonicals were verified by size, SHA-256, and JSON parse. Neither canonical was modified.
- The historical Writing brief’s missing-Workbook blocker is cleared by direct WB canonical verification.
- Automated evidence consistency replaces a separate human review under this authorization.
- Every summary remains preferred v1 `hidden` / `experimental`.
- Two component-level SS links are proposed (`Writing`, `I can...`); both remain `proposed` only.
- Default serving for this relationship remains **`sb_only`**.
- Accepted delivery shape for future Writing-B (not implemented here): exact **non-serving** two-lesson SB→WB neutral package (Lesson 1 = SB p.140 only; Lesson 2 = WB p.115 only). No combined single lesson. No merge with Phonics.
- Writing-B/C implemented (non-serving two-lesson package + five-artifact renderer + default-off adapter); undeployed/unpromoted.
- Live NLL after Writing-A Step B application: **7 / 60 / 60 / 8**. History **26 recorded / 0 pending / 0 remote-only**.

---

## 1. Exact boundary

| Field | Value |
|---|---|
| Proposed component key | `be3-u08-writing` |
| Title | `Big English 3 Unit 8 Writing` |
| Relationship | `be3_sb_wb_rel_u08_writing_sb140_wb115` |
| Stable reference | `be3-sb-wb-u08-p140-wb115` |
| Student Book | p.140 only · `bep3_sb_p140` · Activities **28–31** |
| Workbook | p.115 only · `bep_3_wb_p115` · Activities **24–26** |
| Exact inventory | Four SB + three WB = **seven** verified activities |
| Learning-spine role | Support / `writing` |
| Current packaging | `sb_only` (resolver companion View Workbook only; no Writing SB→WB series handoff) |
| Deterministic UUID (live) | `3e800008-0000-4000-8000-000000000007` |

### Explicit exclusions

No Opener, Story, Language in Action, Content Connection / P.E., Grammar, Culture, Phonics (SB p.141 / WB p.116), Values, Review, adjacent pages, other units, or other books. Do not merge Writing with Phonics.

---

## 2. Evidence and verification method

Step A used only trusted canonical and approved SS evidence:

1. SB canonical `data/phase1/big_english_3_sb/canonical/v1.json` — `938463` bytes / `3924fa23…67e6`
2. WB canonical `data/phase1/big_english_3_wb/canonical/v1.json` — `779981` bytes / `811deea2…04fa`
3. Approved SS-V2 `docs/SS_JSON_FILES NEW/BE3_SS.JSON` — `f6f756e1…bb5a`
4. Writing transfer brief (boundary context only; WB blocker treated as historical)
5. Companion/resolver / learning-spine / active-page-scope records
6. Culture/CLIL/Grammar/LiA knowledge + NLL migrations **only** for identifier, fingerprint, provenance, and record-shape conventions

Every eligible activity was checked for page identity, activity number, type, verification status, instruction, items/expected-answer boundaries, language frame, media flags, and isolation from Phonics pages. SB Activities **28–31** were reconfirmed from canonical. WB p.115 inventory was derived from the WB canonical.

### Verified source order

Publisher activity numbers establish order within each book; SB activities precede WB activities.

| Position | activity_id | Source | Page | Publisher instruction |
|---:|---|---|---:|---|
| 1 | `bep3_sb_act_08_28` | SB | 140 | Complete these sentences. Then listen and check. |
| 2 | `bep3_sb_act_08_29` | SB | 140 | Join these sentences. Then write. |
| 3 | `bep3_sb_act_08_30` | SB | 140 | Read and choose. |
| 4 | `bep3_sb_act_08_31` | SB | 140 | Write three sentences about healthy habits. Use and, but, and or once. |
| 5 | `bep_3_wb_act_115_24` | WB | 115 | Read and circle. |
| 6 | `bep_3_wb_act_115_25` | WB | 115 | Read and write. Use the ideas from the box. |
| 7 | `bep_3_wb_act_115_26` | WB | 115 | Read and complete with or, but, or and. |

All seven records are `human_verified` and belong only to the two accepted Writing pages. Each `activity_id` occurs exactly once. **SB Activities 28–31 are the complete SB inventory** on p.140. **WB Activities 24–26 are the complete WB inventory** on p.115.

Page context (not membership rows):

- SB p.140 heading **Combining Sentences with and, but, or** · section `Writing | Combining Sentences with and, but, or` · `writing` · page audio dependency true
- WB p.115 heading **Combining Sentences with and, but, or | Writing** · section `Writing` · `writing` · page visual dependency true

Phonics isolation confirmed: SB p.141 Activities 32–35 and WB p.116 Activities 27–30 are outside membership.

---

## 3. Canonical hashes, fingerprints, and source bindings

### File SHA-256

| Object | Path used for review | Size (bytes) | SHA-256 | Binding decision |
|---|---|---:|---|---|
| SB canonical | `data/phase1/big_english_3_sb/canonical/v1.json` | `938463` | `3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6` | Bind SB summaries to Storage path `big-english/big_english_3_sb/canonical/v1.json` |
| WB canonical | `data/phase1/big_english_3_wb/canonical/v1.json` | `779981` | `811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa` | Bind WB summaries to Storage path `big-english/big_english_3_wb/canonical/v1.json` |
| Approved SS-V2 | `docs/SS_JSON_FILES NEW/BE3_SS.JSON` | `44940` | `f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a` | Bind proposed SS links to Storage path `big-english/big_english_3_sb/canonical/ss_v1.json` |

### Activity fingerprints

Algorithm: stable recursively key-sorted JSON of the full canonical activity object (same `stableCanonicalJson` / `fingerprintCanonicalActivity` convention as NLL), SHA-256 over UTF-8 bytes.

| activity_id | activity_sha256 |
|---|---|
| `bep3_sb_act_08_28` | `b27b71a97da7e774cce69485d9e44a560744b7862d75218a6d3aa60dbf01898c` |
| `bep3_sb_act_08_29` | `b951d44f268a7c89e4f6fcadcaca3bb5f6cf134a557f8f8369fa56ba49b68f3f` |
| `bep3_sb_act_08_30` | `8377cffc7556d569987b71460898e76f5c38e66ecaf125912ad0640b5c328b84` |
| `bep3_sb_act_08_31` | `437978d1169a7d8522b81fe8f800336bfb0f9e128f1e2f2995599688537e2326` |
| `bep_3_wb_act_115_24` | `dbc871979d68ef6816112c87f5ddb1dd0df7fa3c268dc06e3c7ae61a2134483c` |
| `bep_3_wb_act_115_25` | `4ac42b5c299e90b9d1a1c0508a27b75fc66e3db1e4865c2a060c82f244e3fc60` |
| `bep_3_wb_act_115_26` | `b1cebb0f0b60cd844e9347d3284708e7cec1b91a36fe3af9c10733772caf6aca` |

---

## 4. Record-by-record evidence review

`evidence_status = sufficient` means the verified record supports the narrow teacher-friendly action summary. It does **not** authorize inventing transcripts, dumping keyed answers as student composition, inventing sample paragraphs/rubrics, reconstructing excluded activities, or inventing health content beyond the publisher prompt. Membership ≠ selection; zero/partial selection must remain honest.

### 4.1 `bep3_sb_act_08_28` — SB p.140 Activity 28

- **Type:** `gap_fill_listen_check` · `human_verified`
- **Task:** Three keyed conjunction gaps; then listen and check.
- **Honesty:** Audio **162** (`source_dependency_note` / `audio_dependency` true). Do not invent a transcript. Do not print the full keyed conjunction answers as student composition.
- **Proposed summary:** Students complete three keyed conjunction gaps, then listen to Audio 162 to check, without inventing a transcript or treating keyed answers as a student composition.
- **Evidence:** sufficient

### 4.2 `bep3_sb_act_08_29` — SB p.140 Activity 29

- **Type:** `sentence_combining_writing` · `human_verified`
- **Task:** Five keyed sentence-combining items (and / but / or).
- **Honesty:** Keyed examples are not a model paragraph or student response. Do not convert them into open production.
- **Proposed summary:** Students join five keyed sentence pairs with and, but, or and write the combined sentences; keyed examples are not a student paragraph.
- **Evidence:** sufficient

### 4.3 `bep3_sb_act_08_30` — SB p.140 Activity 30

- **Type:** `read_and_choose` · `human_verified`
- **Task:** Four keyed `and` / `but` / `or` choices.
- **Honesty:** Do not reconstruct answers if the activity is excluded.
- **Proposed summary:** Students read and choose among and, but, or in four keyed items without reconstructing answers if the activity is excluded.
- **Evidence:** sufficient

### 4.4 `bep3_sb_act_08_31` — SB p.140 Activity 31

- **Type:** `writing_production` · `human_verified`
- **Task:** Open production — write three sentences about healthy habits; use and, but, and or once. No items; no expected answer.
- **Honesty:** Open production only. Do not invent a sample response, paragraph, rubric, checklist, audience, genre, assessment criteria, or teaching procedure. “Healthy habits” is prompt context only.
- **Proposed summary:** Students write three open sentences about healthy habits using and, but, and or once each, without any invented sample response, rubric, or criteria.
- **Evidence:** sufficient

### 4.5 `bep_3_wb_act_115_24` — WB p.115 Activity 24

- **Type:** `conjunction_selection` · `human_verified`
- **Task:** Six keyed or/but/and circle choices.
- **Honesty:** Keyed craft practice only; do not invent writing guidance beyond the verified task.
- **Proposed summary:** Students read and circle the correct and, but, or choice in six keyed items.
- **Evidence:** sufficient

### 4.6 `bep_3_wb_act_115_25` — WB p.115 Activity 25

- **Type:** `sentence_completion_box` · `human_verified`
- **Task:** Four sentence stems completed from a clause box (`visual_dependency` true; notes list four box options).
- **Honesty:** Preserve box/visual dependency. Do not invent completed clauses outside selected publisher evidence. Do not reconstruct excluded box options as free writing.
- **Proposed summary:** Students complete four sentence stems using clause options from the box, preserving the box and visual dependency without inventing clauses.
- **Evidence:** sufficient

### 4.7 `bep_3_wb_act_115_26` — WB p.115 Activity 26

- **Type:** `paragraph_conjunction_cloze` · `human_verified`
- **Task:** Six-gap paragraph cloze with or / but / and.
- **Honesty:** Do not invent paragraph content, answers, or writing guidance beyond the keyed cloze.
- **Proposed summary:** Students complete a six-gap paragraph cloze with or, but, or and without inventing paragraph content beyond the keyed task.
- **Evidence:** sufficient

---

## 5. Keyed / open / dependency matrix

| activity_id | Keyed / open | Audio | Visual / box / layout | Cross-activity |
|---|---|---|---|---|
| `bep3_sb_act_08_28` | Keyed (3 gaps) | Audio 162 listen-and-check | none on activity | none |
| `bep3_sb_act_08_29` | Keyed (5 joins) | none | none | none |
| `bep3_sb_act_08_30` | Keyed (4 choices) | none | none | none |
| `bep3_sb_act_08_31` | Open production | none | none | none |
| `bep_3_wb_act_115_24` | Keyed (6 circles) | none | none | none |
| `bep_3_wb_act_115_25` | Keyed (4 box completions) | none | clause box / visual | none across books |
| `bep_3_wb_act_115_26` | Keyed (6 cloze gaps) | none | paragraph scaffold only | none |

No SB↔WB activity must be reconstructed across books. No Writing activity depends on Phonics.

---

## 6. Exact summary designs (preferred v1)

| Summary ID | activity_id | Summary text |
|---|---|---|
| `big_english_3_sb_unit_08_activity_28_summary_writing_a_v1` | `bep3_sb_act_08_28` | Students complete three keyed conjunction gaps, then listen to Audio 162 to check, without inventing a transcript or treating keyed answers as a student composition. |
| `big_english_3_sb_unit_08_activity_29_summary_writing_a_v1` | `bep3_sb_act_08_29` | Students join five keyed sentence pairs with and, but, or and write the combined sentences; keyed examples are not a student paragraph. |
| `big_english_3_sb_unit_08_activity_30_summary_writing_a_v1` | `bep3_sb_act_08_30` | Students read and choose among and, but, or in four keyed items without reconstructing answers if the activity is excluded. |
| `big_english_3_sb_unit_08_activity_31_summary_writing_a_v1` | `bep3_sb_act_08_31` | Students write three open sentences about healthy habits using and, but, and or once each, without any invented sample response, rubric, or criteria. |
| `big_english_3_wb_unit_08_p115_activity_24_summary_writing_a_v1` | `bep_3_wb_act_115_24` | Students read and circle the correct and, but, or choice in six keyed items. |
| `big_english_3_wb_unit_08_p115_activity_25_summary_writing_a_v1` | `bep_3_wb_act_115_25` | Students complete four sentence stems using clause options from the box, preserving the box and visual dependency without inventing clauses. |
| `big_english_3_wb_unit_08_p115_activity_26_summary_writing_a_v1` | `bep_3_wb_act_115_26` | Students complete a six-gap paragraph cloze with or, but, or and without inventing paragraph content beyond the keyed task. |

Common fields: `version=1`, `evidence_status=sufficient`, `display_status=hidden`, `review_state=experimental`, `is_preferred=true`, provenance `writing-a-step-a-knowledge-prep-v0.1`.

---

## 7. SS-link decisions

SS authority is the approved SS-V2 object (`f6f756e1…bb5a`). Unit 8 = Healthy Living.

| column_order | category_name_raw | Decision | Rationale |
|---:|---|---|---|
| 4 | Writing | **Proposed** | Exact cell: “Combining Sentences with and, but, or.” Matches SB p.140 / WB p.115 strand and all seven activities. No existing Writing-column link for Unit 8. |
| 7 | I can... | **Proposed** | Third I can entry: “…use and, or and but in sentences.” Writing is the primary component-level fit. LiA already links the same column for a different entry; multi-component Structures/I can locators are established. |
| 1 Vocabulary | Withheld | Opener already owns the healthy-living vocab locator; not Writing craft. |
| 2 Structures | Withheld | Past-tense question/statement structures; Grammar/LiA/Opener/Story already cover. |
| 3 CLIL/Culture | Withheld | P.E. / Strange sports; not Writing. |
| 5 Phonics | Unsuitable | SB p.141 / WB p.116 excluded. |
| 6 Values | Unsuitable | “Get exercise.” — not Writing craft. |

Proposed link identities (unused at preflight):

| id | column_order | category | status |
|---|---:|---|---|
| `3e800008-0000-4000-8000-000000000701` | 4 | Writing | `proposed` |
| `3e800008-0000-4000-8000-000000000702` | 7 | I can... | `proposed` |

---

## 8. Automated delivery-shape decision

**Accepted for future Writing-B (not implemented in this Step B):** exact **non-serving** two-lesson SB→WB neutral package.

| Rule | Evidence outcome |
|---|---|
| WB p.115 has independently usable verified Writing practice | **Yes** — three human_verified activities (24–26) with complete instructions/items |
| Lesson 1 can remain SB p.140 only | **Yes** — four complete SB activities; no WB dependency |
| Lesson 2 can remain WB p.115 only | **Yes** — three complete WB activities; no SB reconstruction required |
| No activity must be reconstructed across books | **Yes** — no Look-at / cross-book dependency |
| all / partial / zero remain honest | **Yes** — keyed vs open boundaries are per-activity; zero must not invent a substitute writing task |
| Do not combine SB and WB into one lesson | **Honored** |
| Do not merge Writing with Phonics | **Honored** — p.141 / p.116 excluded |
| Do not change active serving / resolver default | **Honored** — remains `sb_only` until a separate serving gate |

Therefore Writing-B may later implement the two-lesson package/renderer under a separate application gate. This file does **not** authorize Writing-B/C coding.

---

## 9. Selection and no-reconstruction rules

- Membership never implies selection.
- Zero selection must not create a substitute writing task.
- Partial selection must not reconstruct unchecked examples, prompts, box clauses, or cloze answers.
- Audio 162 is listen-and-check only; no invented transcript.
- Activity 31 remains open production with no fabricated response/rubric/criteria.
- Earlier Unit 8 components may be optional prior support only and never replace current Writing evidence.
- SB p.140 stays isolated from Phonics p.141; WB p.115 stays isolated from Phonics p.116.

---

## 10. Read-only live preflight (2026-10-30)

| Check | Result |
|---|---|
| Live totals | **6 / 53 / 53 / 6** |
| History | **25 recorded / 0 pending / 0 remote-only** (remote through `20261030180000`) |
| Opener/Story/LiA/Grammar/CLIL/Culture exact draft identities | **Pass** |
| `be3-u08-writing` / `…000007` absent | **Pass** |
| Membership / summary-id / (activity,v1) / preferred-slot collisions | **0** |
| SS-link IDs `…000701` / `…000702` and Writing component links | **0** |

No credentials printed. No database mutation performed.

---

## 11. Step B payload (applied / verified)

| Field | Value |
|---|---|
| Migration | `20261030190000_seed_nll_be3_u08_writing.sql` (**applied** to `kivvmobjphtcgxoltqbc`) |
| Component | draft `be3-u08-writing` / `…000007` |
| Memberships | 7 ordered |
| Summaries | 7 preferred v1 hidden/experimental |
| SS links | 2 proposed (Writing + I can...) |
| Pre-application | `6 / 53 / 53 / 6` |
| Post-application | `7 / 60 / 60 / 8` |
| History post-apply | **26 recorded / 0 pending / 0 remote-only** |
| Method | isolated workdir + `npx.cmd supabase@2.122.0 db push --linked` (dry-run then once) |

---

## 12. Automated acceptance record

| Gate | Result |
|---|---|
| Canonical size/hash/parse | PASS |
| Complete SB 28–31 + WB 24–26 inventory | PASS |
| Fingerprints recomputed | PASS |
| Delivery-shape decision evidence | PASS — non-serving two-lesson SB→WB |
| SS Writing + I can proposed; others withheld | PASS |
| Live collision preflight | PASS |
| Linked dry-run proposed only Writing | PASS |
| Linked non-dry-run apply | PASS |
| Post-apply totals / identities / memberships / summaries / SS | PASS — **7 / 60 / 60 / 8** |
| Focused + retained seed suites after apply | **29/29** |

`WRITING-A STEP B APPLIED / VERIFIED` · `WRITING-B/C IMPLEMENTED / AUTOMATED VERIFICATION PASSED / OWNER-ACCEPTED UNDER ADVANCE AUTHORIZATION`
