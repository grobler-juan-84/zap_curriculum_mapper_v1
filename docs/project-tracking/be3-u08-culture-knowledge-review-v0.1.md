# BE3 Unit 8 Culture Connection Knowledge Review v0.1

**Status:** CULTURE-A STEP B APPLIED / VERIFIED / OWNER-ACCEPTED UNDER ADVANCE AUTHORIZATION; CULTURE-B/C AUTOMATED-ACCEPTED
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner advance authorization for Culture-A knowledge, isolated Step B application of `20261030180000`, and Culture-B/C automated acceptance. Canonical SB/WB evidence remains authoritative.
**Implementation authorization:** Culture-A live; Culture-B/C implemented behind default-off `VITE_NLL_CHALKIE_CULTURE_ADAPTER_PILOT`. Does **not** authorize promotion, deployment, flag-on default, NLL visibility changes, commit, or push.

---

## 0. Hard boundary statements

- Trusted SB and WB canonicals were verified by size, SHA-256, and JSON parse. Neither canonical was modified.
- The historical Culture brief’s missing-Workbook blocker is cleared by direct WB canonical verification.
- Automated evidence consistency replaces a separate human review under this authorization.
- Every future summary remains `hidden` / `experimental`. **No SS link is proposed.**
- Default serving for this relationship remains **`sb_only`**.
- Culture-B/C remain unimplemented and unauthorized until Culture-A is applied through a separate exact database-application gate.
- Culture-A Step B applied: live NLL **6 / 53 / 53 / 6**; history **25 / 0 / 0**; zero Culture SS links. Culture-B/C automated-accepted; undeployed/unpromoted.

---

## 1. Exact boundary

| Field | Value |
|---|---|
| Proposed component key | `be3-u08-culture` |
| Title | `Big English 3 Unit 8 Culture Connection` |
| Relationship | `be3_sb_wb_rel_u08_culture_sb138-139_wb113-114` |
| Stable reference | `be3-sb-wb-u08-p138-139-wb113-114` |
| Student Book | pp.138–139 · `bep3_sb_p138`, `bep3_sb_p139` · Activities **24–27** |
| Workbook | pp.113–114 · `bep_3_wb_p113`, `bep_3_wb_p114` · Activities **20–23** + Think Big |
| Exact inventory | Four SB + five WB = **nine** verified activities |
| Learning-spine role | Support / `reading_content` |
| Current packaging | `sb_only` (resolver companion View Workbook only; no Culture SB→WB series handoff) |
| Deterministic UUID (unused at preflight) | `3e800008-0000-4000-8000-000000000006` |

### Explicit exclusions

No Opener, Story, Language in Action, Content Connection / P.E., Grammar, Writing, Phonics, Values, Review, adjacent pages, other units, or other books. Do not reconstruct excluded linked activities outside this membership.

---

## 2. Evidence and verification method

Step A used only trusted canonical and approved SS evidence:

1. SB canonical `data/phase1/big_english_3_sb/canonical/v1.json` — `938463` bytes / `3924fa23…67e6`
2. WB canonical `data/phase1/big_english_3_wb/canonical/v1.json` — `779981` bytes / `811deea2…04fa`
3. Approved SS-V2 `docs/SS_JSON_FILES NEW/BE3_SS.JSON` — `f6f756e1…bb5a`
4. Culture transfer brief (boundary context only; WB blocker treated as historical)
5. Companion/resolver / learning-spine records
6. CLIL/Grammar/LiA knowledge + NLL migrations **only** for identifier, fingerprint, provenance, and record-shape conventions

Every eligible activity was checked for page identity, activity number, type, verification status, instruction, items/expected-answer boundaries, language frame, media flags, and isolation from adjacent pages. SB Activities **24–27** were reconfirmed from canonical rather than trusted from the provisional brief. WB pp.113–114 inventory was derived from the WB canonical.

### Verified source order

Publisher activity numbers establish order within each book; SB activities precede WB activities. Think Big follows WB Activity 23 on p.114.

| Position | activity_id | Source | Page | Publisher instruction |
|---:|---|---|---:|---|
| 1 | `bep3_sb_act_08_24` | SB | 138 | Work with a partner. In which countries do you think these sports are popular? Match the sports to different countries. Choose from these or add your own. |
| 2 | `bep3_sb_act_08_25` | SB | 138 | Listen and read. When did people start these strange sports? |
| 3 | `bep3_sb_act_08_26` | SB | 138 | Look at 25. Read and say true or false. |
| 4 | `bep3_sb_act_08_27` | SB | 139 | Complete this chart about the sports. |
| 5 | `bep_3_wb_act_113_20` | WB | 113 | Look at 21. Read quickly and match. |
| 6 | `bep_3_wb_act_113_21` | WB | 113 | Listen, read, and write. |
| 7 | `bep_3_wb_act_114_22` | WB | 114 | Read and match. |
| 8 | `bep_3_wb_act_114_23` | WB | 114 | Read and circle T for true and F for false. |
| 9 | `bep_3_wb_act_114_tb` | WB | 114 | Make up a strange sport. Draw and describe it. |

All nine records are `human_verified` and belong only to the four accepted Culture pages. Each `activity_id` occurs exactly once in the combined SB+WB activity arrays. **SB Activities 24–27 are the complete SB inventory** on pp.138–139.

Page context (not membership rows):

- SB p.138 heading **Strange Sports** · section `Culture Connection | Around the World` · `culture`
- SB p.139 section `Culture Connection | Around the World` · `culture_activities`
- WB p.113 heading **Around the World | Culture Connection** · `culture_connection`

---

## 3. Canonical hashes, fingerprints, and source bindings

### File SHA-256

| Object | Path used for review | Size (bytes) | SHA-256 | Binding decision |
|---|---|---:|---|---|
| SB canonical | `data/phase1/big_english_3_sb/canonical/v1.json` | `938463` | `3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6` | Bind SB summaries to Storage path `big-english/big_english_3_sb/canonical/v1.json` |
| WB canonical | `data/phase1/big_english_3_wb/canonical/v1.json` | `779981` | `811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa` | Bind WB summaries to Storage path `big-english/big_english_3_wb/canonical/v1.json` |
| Approved SS-V2 | `docs/SS_JSON_FILES NEW/BE3_SS.JSON` | — | `f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a` | Reviewed; **no SS link proposed** |

### Activity fingerprints

Algorithm: stable recursively key-sorted JSON of the full canonical activity object (same `stableCanonicalJson` / `fingerprintCanonicalActivity` convention as NLL), SHA-256 over UTF-8 bytes.

| activity_id | activity_sha256 |
|---|---|
| `bep3_sb_act_08_24` | `91d73d467b5a0f3d250a8e3b707e37baa435972a8bd0f556e574f738ebb7c19f` |
| `bep3_sb_act_08_25` | `765aa1c97c1fd5f6c48f7939b3e9509f5ee142bc74d2e26ea4559a981151146f` |
| `bep3_sb_act_08_26` | `c7fd13fff75b8c9450bd69bf89eefb7555d38176015ebea6da5234aae926ca31` |
| `bep3_sb_act_08_27` | `53d699c4da14681ae91035e58ea6b586e6f047f5d075d47338c38393126e1f14` |
| `bep_3_wb_act_113_20` | `caaae9a48c0d8af780ff7ef9507b8d3f1e3e2366cba50c2927dfe66ae9230ce4` |
| `bep_3_wb_act_113_21` | `4ea2ea0261684b617d610de920784b1793819e9ba7517d17cae7b09095d5f18f` |
| `bep_3_wb_act_114_22` | `b0b3a02d50803e98713b052c60297bc5c23a06f1a4cd074dfccd0bfe3b56d381` |
| `bep_3_wb_act_114_23` | `bce7fc8beccd52654a5e2c6f8697482524605a819f8720e2a72bd0abd1e8ce5c` |
| `bep_3_wb_act_114_tb` | `80eb227d16b30df0fbc01e6e45184a31adbf0c25ff2f1a1f0a861b1a97ba9bf8` |

---

## 4. Record-by-record evidence review

`evidence_status = sufficient` means the verified record supports the narrow teacher-friendly action summary. It does **not** authorize inventing sports/countries/dates/rules/cultural claims, audio transcripts, answer-key dumps, visual reconstruction, stereotypes, or excluded linked activities. Membership ≠ selection; zero/partial selection must remain honest.

### 4.1 `bep3_sb_act_08_24` — SB p.138 Activity 24

- **Type:** `partner_matching` · `human_verified`
- **Task:** Partner match six sports to country options (AU/FR/NZ/US/CA/UK listed in notes) or add your own.
- **Honesty:** Open, non-keyed (`expected_answer` null on all items). Must not convert options into factual country–sport mappings. “Add your own” remains open student work.
- **Media:** no audio; no visual flag on activity.
- **Proposed summary:** Students work with a partner to match listed sports to country options or add their own; the matching is open and not keyed.
- **Evidence:** sufficient

### 4.2 `bep3_sb_act_08_25` — SB p.138 Activity 25

- **Type:** `listen_and_read_culture` · `human_verified`
- **Task:** Listen and read; identify when people started these strange sports.
- **Honesty:** Audio **160** (`source_dependency_note`) and visual dependency explicit. “Strange sports” is attributed publisher wording only. Do not invent transcript, sports, countries, dates, rules, origins, or broader cultural claims beyond selected publisher evidence.
- **Proposed summary:** Students listen to Audio 160 and read about publisher-labelled strange sports to identify when people started them, preserving the visual dependency.
- **Evidence:** sufficient

### 4.3 `bep3_sb_act_08_26` — SB p.138 Activity 26

- **Type:** `read_and_say_true_false` · `human_verified`
- **Task:** Look at 25; five true/false claims.
- **Honesty:** Depends on Activity 25. Selecting 26 must not reconstruct excluded Activity 25 reading text through answer dumps.
- **Proposed summary:** Students look at Activity 25 and say true or false for five claims without reconstructing excluded reading evidence.
- **Evidence:** sufficient

### 4.4 `bep3_sb_act_08_27` — SB p.139 Activity 27

- **Type:** `complete_chart` · `human_verified`
- **Task:** Complete chart rows for origin, description, similar sport(s), and reason started across Octopush / Footvolley / Pumpkin Regatta.
- **Honesty:** Chart/layout dependency. Protect answer cells; do not invent placements or unsupported cultural comparisons.
- **Proposed summary:** Students complete the sports chart for origin, description, similar sports, and reason started, preserving the chart and layout dependency.
- **Evidence:** sufficient

### 4.5 `bep_3_wb_act_113_20` — WB p.113 Activity 20

- **Type:** `quick_read_and_match` · `human_verified`
- **Task:** Look at 21; read quickly and match three sentence halves.
- **Honesty:** Explicit forward dependency on Activity 21; visual dependency true. Selecting 20 must not reconstruct excluded Activity 21.
- **Proposed summary:** Students look at Activity 21 and quickly match three sentence halves about the sports, without reconstructing excluded Activity 21 evidence.
- **Evidence:** sufficient

### 4.6 `bep_3_wb_act_113_21` — WB p.113 Activity 21

- **Type:** `listen_read_and_write` · `human_verified`
- **Task:** Listen, read, and write gaps; word box present; Audio **161** required to check.
- **Honesty:** Do not invent audio wording/order or dump cloze answers.
- **Proposed summary:** Students listen, read, and write gaps from the word box, using Audio 161 to check without inventing audio wording.
- **Evidence:** sufficient

### 4.7 `bep_3_wb_act_114_22` — WB p.114 Activity 22

- **Type:** `reading_matching` · `human_verified`
- **Task:** Read and match five sentence halves.
- **Honesty:** Protect matching answers; do not invent causal/cultural claims beyond publisher item text.
- **Proposed summary:** Students read and match five sentence halves about how and why the sports started.
- **Evidence:** sufficient

### 4.8 `bep_3_wb_act_114_23` — WB p.114 Activity 23

- **Type:** `true_false` · `human_verified`
- **Task:** Circle T/F for five claims.
- **Honesty:** Protect T/F answers; do not invent facts through answer dumps.
- **Proposed summary:** Students circle true or false for five claims about the sports without dumping answer keys.
- **Evidence:** sufficient

### 4.9 `bep_3_wb_act_114_tb` — WB p.114 Think Big

- **Type:** `creative_writing_and_drawing` · `human_verified`
- **Task:** Make up a strange sport; draw and describe it (`The sport is called ______`).
- **Honesty:** Open creative task. Avoid unsupported stereotypes or judgmental framing beyond attributed publisher wording.
- **Proposed summary:** Students invent a strange sport, then draw and describe it using the Think Big prompt.
- **Evidence:** sufficient

---

## 5. Dependency and integrity matrix

| Dependency | Rule |
|---|---|
| SB 25 → SB 26 | Selecting 26 must not reconstruct excluded 25 reading |
| SB 25 → SB 27 | Chart completion depends on reading/layout evidence; do not invent chart cells |
| WB 21 → WB 20 | Selecting 20 must not reconstruct excluded 21 |
| Audio 160 / 161 | Explicit media dependencies; no invented transcripts |
| Visual flags | Preserve SB 25 and WB 20 visual dependencies; do not invent visuals |
| Open Act 24 | Never convert to keyed country–sport facts |
| “Strange sports” | Attributed publisher wording only |
| Selection honesty | all / partial / zero must remain honest; membership ≠ selection |
| Isolation | No Opener/Story/LiA/CLIL/Grammar/Writing/Phonics/Values/Review leakage |

---

## 6. Proposed SS links

Unit 8 SS `CLIL/Culture` (`column_order` 3) contains **two** content blocks in one cell:

1. `P.E.: Keeping healthy` (CLIL/P.E. vocabulary)
2. `Around the World: Strange sports` (Culture vocabulary)

The NLL `nll_ss_component_links` schema locates only at **category** grain (`category_name_raw` / `column_order`). It cannot express a content-block-only locator for `Around the World: Strange sports` without also locating `P.E.: Keeping healthy`.

### Decision: **no SS link**

Linking combined `CLIL/Culture` would import CLIL/P.E. “Keeping healthy” into the Culture component locator and is therefore **not defensible**. Zero links is valid and preferred. All Culture SS links remain **unproposed**. Local Step B inserts **zero** `nll_ss_component_links` rows.

---

## 7. Exact proposed NLL summary payloads (design / local Step B)

| summary id | activity_id | summary_text |
|---|---|---|
| `big_english_3_sb_unit_08_activity_24_summary_culture_a_v1` | `bep3_sb_act_08_24` | Students work with a partner to match listed sports to country options or add their own; the matching is open and not keyed. |
| `big_english_3_sb_unit_08_activity_25_summary_culture_a_v1` | `bep3_sb_act_08_25` | Students listen to Audio 160 and read about publisher-labelled strange sports to identify when people started them, preserving the visual dependency. |
| `big_english_3_sb_unit_08_activity_26_summary_culture_a_v1` | `bep3_sb_act_08_26` | Students look at Activity 25 and say true or false for five claims without reconstructing excluded reading evidence. |
| `big_english_3_sb_unit_08_activity_27_summary_culture_a_v1` | `bep3_sb_act_08_27` | Students complete the sports chart for origin, description, similar sports, and reason started, preserving the chart and layout dependency. |
| `big_english_3_wb_unit_08_p113_activity_20_summary_culture_a_v1` | `bep_3_wb_act_113_20` | Students look at Activity 21 and quickly match three sentence halves about the sports, without reconstructing excluded Activity 21 evidence. |
| `big_english_3_wb_unit_08_p113_activity_21_summary_culture_a_v1` | `bep_3_wb_act_113_21` | Students listen, read, and write gaps from the word box, using Audio 161 to check without inventing audio wording. |
| `big_english_3_wb_unit_08_p114_activity_22_summary_culture_a_v1` | `bep_3_wb_act_114_22` | Students read and match five sentence halves about how and why the sports started. |
| `big_english_3_wb_unit_08_p114_activity_23_summary_culture_a_v1` | `bep_3_wb_act_114_23` | Students circle true or false for five claims about the sports without dumping answer keys. |
| `big_english_3_wb_unit_08_p114_think_big_summary_culture_a_v1` | `bep_3_wb_act_114_tb` | Students invent a strange sport, then draw and describe it using the Think Big prompt. |

Common fields for every row: `version = 1`, `evidence_status = sufficient`, `display_status = hidden`, `review_state = experimental`, `is_preferred = true`, provenance `prompt_version = culture-a-step-a-knowledge-prep-v0.1`.

---

## 8. Local Step B design (unapplied)

| Field | Value |
|---|---|
| Migration | `20261030180000_seed_nll_be3_u08_culture.sql` |
| Component UUID | `3e800008-0000-4000-8000-000000000006` |
| Memberships | nine ordered rows |
| Summaries | nine preferred v1 hidden/experimental |
| SS links | **zero** |
| Pre-application baseline assert | **5 / 44 / 44 / 6** |
| Intended post-application totals | **6 / 53 / 53 / 6** |
| Opener/Story/LiA/Grammar/CLIL | unchanged |
| Application | **not authorized / not applied** |

---

## 9. Read-only live preflight (2026-10-30)

| Check | Result |
|---|---|
| Live totals | **5 / 44 / 44 / 6** |
| Migration history (before local Culture file) | **24 recorded / 0 pending / 0 remote-only** |
| Opener/Story/LiA/Grammar/CLIL identities | exact draft |
| `be3-u08-culture` / `…000006` | absent |
| Culture membership collision | **0** |
| Summary id / `(activity_id, version=1)` / preferred-slot collisions | **0** |
| Reserved SS id / Culture component SS collision | **0** |

No credentials printed. No write operations performed.

---

## 10. Automated acceptance record

| Gate | Result |
|---|---|
| Canonical size/hash/JSON | Pass |
| Complete SB 24–27 inventory | Pass |
| Complete WB 20–23 + Think Big inventory | Pass |
| Fingerprints | Pass |
| Conservative sufficient summaries | Pass |
| Source-honesty / dependency matrix | Pass |
| SS link decision | Pass — **no link** |
| Live collision preflight | Pass |
| Local migration + focused suite | Prepared; unapplied |
| Culture-B/C | Not started |

**Mark:** `CULTURE-A KNOWLEDGE ACCEPTED UNDER ADVANCE AUTHORIZATION / STEP B PREPARED LOCALLY / NOT APPLIED`
