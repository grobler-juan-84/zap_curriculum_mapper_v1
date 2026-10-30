# BE3 Unit 8 Phonics Knowledge Review v0.1

**Status:** PHONICS-A STEP B APPLIED / VERIFIED / OWNER-ACCEPTED UNDER ADVANCE AUTHORIZATION · PHONICS-B/C IMPLEMENTED / AUTOMATED VERIFICATION PASSED / OWNER-ACCEPTED UNDER ADVANCE AUTHORIZATION
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner advance authorization for Phonics-A automated knowledge readiness and local Step B preparation. Canonical SB/WB evidence is authoritative over the historical Phonics brief’s missing-Workbook blocker.
**Implementation authorization:** Phonics-A live; Phonics-B/C behind default-off VITE_NLL_CHALKIE_PHONICS_ADAPTER_PILOT. Does **not** authorize promotion, deployment, flag-on default, commit, or push.

---

## 0. Hard boundary statements

- Trusted SB and WB canonicals verified by size, SHA-256, and JSON parse. Neither canonical was modified.
- Automated evidence consistency replaces separate human review under this authorization.
- Every summary remains preferred v1 `hidden` / `experimental`.
- One component-level SS link is proposed (`Phonics`); status `proposed` only.
- Default serving for this relationship remains **`sb_only`**.
- Accepted delivery shape for future Phonics-B (not implemented here): exact **non-serving** two-lesson SB→WB (Lesson 1 = SB p.141 only; Lesson 2 = WB p.116 only). No combined lesson. No Writing or Values merge.
- Evidence limited to graphemes **`all`**, **`au`**, and **`aw`**. No IPA, universal pronunciation rules, accent variants, exceptions, minimal pairs, or invented words.
- Live NLL at preparation time remains **7 / 60 / 60 / 8**. History **26 recorded / 0 pending / 0 remote-only**. Migration unapplied.

---

## 1. Exact boundary

| Field | Value |
|---|---|
| Proposed component key | `be3-u08-phonics` |
| Title | `Big English 3 Unit 8 Phonics` |
| Relationship | `be3_sb_wb_rel_u08_phonics_sb141_wb116` |
| Stable reference | `be3-sb-wb-u08-p141-wb116` |
| Student Book | p.141 only · `bep3_sb_p141` · Activities **32–35** |
| Workbook | p.116 only · `bep_3_wb_p116` · Activities **27–30** |
| Exact inventory | Four SB + four WB = **eight** verified activities |
| Learning-spine role | Support / `phonics` |
| Current packaging | `sb_only` |
| Deterministic UUID (unused live) | `3e800008-0000-4000-8000-000000000008` |

### Explicit exclusions

Writing p.140 / WB p.115, Values p.142, Review p.143 / WB p.117, adjacent pages, other units/books. No Opener, Story, LiA, Grammar, CLIL, or Culture merge.

---

## 2. Evidence method

1. SB canonical `data/phase1/big_english_3_sb/canonical/v1.json` — `938463` / `3924fa23…67e6`
2. WB canonical `data/phase1/big_english_3_wb/canonical/v1.json` — `779981` / `811deea2…04fa`
3. Approved SS-V2 `docs/SS_JSON_FILES NEW/BE3_SS.JSON` — `f6f756e1…bb5a`
4. Phonics transfer brief (boundary context; WB blocker treated as historical)
5. Companion / resolver / learning-spine / active-page-scope records
6. Writing/Culture/CLIL/Grammar/LiA knowledge + migrations for identifier/fingerprint/provenance conventions only

### Verified source order

| Position | activity_id | Source | Page | Instruction |
|---:|---|---|---:|---|
| 1 | `bep3_sb_act_08_32` | SB | 141 | Listen, read and repeat. |
| 2 | `bep3_sb_act_08_33` | SB | 141 | Listen and find. Then say. |
| 3 | `bep3_sb_act_08_34` | SB | 141 | Listen and blend the sounds. |
| 4 | `bep3_sb_act_08_35` | SB | 141 | Read aloud. Then listen and chant. |
| 5 | `bep_3_wb_act_116_27` | WB | 116 | Read and circle all, au, and aw. |
| 6 | `bep_3_wb_act_116_28` | WB | 116 | Underline the words with all, au, and aw. Then read aloud. |
| 7 | `bep_3_wb_act_116_29` | WB | 116 | Connect the letters. Then write. |
| 8 | `bep_3_wb_act_116_30` | WB | 116 | Listen and write. |

All eight are `human_verified`. Page context: SB heading **all, au, aw** · section `Phonics | all, au, aw` · audio+visual true. WB heading **Phonics | all, au, aw** · section `Phonics` · audio+visual true.

---

## 3. Fingerprints

Algorithm: stable recursively key-sorted JSON of the full canonical activity object (`stableCanonicalJson` / `fingerprintCanonicalActivity`), SHA-256 over UTF-8 bytes.

| activity_id | activity_sha256 |
|---|---|
| `bep3_sb_act_08_32` | `eb079a327bed4964226ab499f4dbb05278a91856192c33be0f0b1953a4b262c6` |
| `bep3_sb_act_08_33` | `07fa8309f46baa30993982081c74700bc47fde4c947a093da9715fb9d6376760` |
| `bep3_sb_act_08_34` | `d6df47a6bbbc3523d399ff3437c63918f8df4fd71fad83ec903a437746c79309` |
| `bep3_sb_act_08_35` | `1814770428f06a23c53928bab33ff843b29a5632b639c15733135cb51f01769a` |
| `bep_3_wb_act_116_27` | `247fb95700c8ec1877a65266ea8979bea5550c8d289631f59d5df5e4e30569a5` |
| `bep_3_wb_act_116_28` | `2fb3d4c9e46c8fc7db0353e65495739fc3b7dbd67e43d8b37c35b71b48b8acb1` |
| `bep_3_wb_act_116_29` | `c580dacd102dfc89b4cc7398453e10e363742444d793abdbeacdbfbe0f232dea` |
| `bep_3_wb_act_116_30` | `7b4e92ac24c6ad5e026ac0d6c29ff23d278007770d501922078724d475021270` |

Canonical path/hash bindings: SB `big-english/big_english_3_sb/canonical/v1.json` / `3924fa23…67e6`; WB `big-english/big_english_3_wb/canonical/v1.json` / `811deea2…04fa`.

---

## 4. Activity evidence summary

| ID | Type | Keyed/open | Audio | Visual | Cross-deps / notes |
|---|---|---|---|---|---|
| 32 | `phonics_listen_read_repeat` | Open (grapheme prompts `all`/`au`/`aw`) | 163 | false | No transcript |
| 33 | `phonics_listen_find_say` | Open targets `ball`/`haul`/`draw` | 164 | **true** | Visual protected |
| 34 | `phonics_blending` | **Eight keyed** blends | 165 | false | Answer-key protected |
| 35 | `phonics_chant` | Open; empty items | 166 | false | Chant evidence `bep3_sb_text_08_06` by identity/role only; **do not reproduce full chant**; excluding 35 removes chant everywhere |
| WB 27 | `phonics_target_identification` | Keyed circle set | none | false | Word box from canonical only |
| WB 28 | `phonics_underline_and_read` | Keyed underlines (2 sentences) | none | false | Canonical sentences only |
| WB 29 | `spelling_matching` | Three keyed connect/write | none | false | Canonical letter parts only |
| WB 30 | `listen_and_write_chant` | Five chant gaps; answers null in canonical | **167** | true | No invented transcript/answers |

No SB↔WB reconstruction dependency. Writing and Values remain isolated.

---

## 5. Preferred v1 summaries (hidden / experimental)

| Summary ID | activity_id | Summary |
|---|---|---|
| `…activity_32_summary_phonics_a_v1` | `bep3_sb_act_08_32` | Students listen, read, and repeat the graphemes all, au, and aw with Audio 163; no keyed answers, transcript, IPA, or invented pronunciation rule is added. |
| `…activity_33_summary_phonics_a_v1` | `bep3_sb_act_08_33` | Students listen to Audio 164, find publisher targets ball, haul, and draw, and say them, preserving the visual dependency without inventing further words or a transcript. |
| `…activity_34_summary_phonics_a_v1` | `bep3_sb_act_08_34` | Students listen to Audio 165 and blend eight keyed publisher words; keyed answers remain protected and are not treated as an open word list or reconstructed if excluded. |
| `…activity_35_summary_phonics_a_v1` | `bep3_sb_act_08_35` | Students read aloud, then listen and chant with Audio 166 using chant evidence bep3_sb_text_08_06 by identity and role only; excluding this activity removes chant evidence everywhere without reconstructing the chant text. |
| `…p116_activity_27_summary_phonics_a_v1` | `bep_3_wb_act_116_27` | Students read and circle all, au, and aw in the publisher word box; keyed circle targets remain protected without inventing additional words. |
| `…p116_activity_28_summary_phonics_a_v1` | `bep_3_wb_act_116_28` | Students underline publisher all, au, and aw words in two sentences and read aloud without inventing sentences or reconstructing excluded underlines. |
| `…p116_activity_29_summary_phonics_a_v1` | `bep_3_wb_act_116_29` | Students connect letter parts and write three keyed words without inventing spellings or reconstructing excluded connect/write items. |
| `…p116_activity_30_summary_phonics_a_v1` | `bep_3_wb_act_116_30` | Students listen to Audio 167 and complete five chant-gap prompts; no invented transcript or reconstructed chant answers are added beyond the canonical gap evidence. |

Provenance prompt: `phonics-a-step-a-knowledge-prep-v0.1`.

---

## 6. SS-link decision

| column_order | category | Decision | Rationale |
|---:|---|---|---|
| 5 | Phonics | **Proposed** | Exact Unit 8 cell lists `all, au, aw` and matching word families; fits all eight activities. |
| 7 | I can... | Withheld | No phonics-specific I can entry. |
| 4 Writing / 6 Values / others | Unsuitable / withheld | Outside Phonics boundary. |

Proposed link id: `3e800008-0000-4000-8000-000000000801` · status `proposed`.

---

## 7. Delivery-shape decision

**Accepted for future Phonics-B only:** non-serving two-lesson SB→WB.

| Rule | Outcome |
|---|---|
| WB p.116 independently usable | **Yes** — four human_verified activities |
| Lesson 1 = SB p.141 only | **Yes** |
| Lesson 2 = WB p.116 only | **Yes** |
| No combined lesson / no Writing-Values merge | **Honored** |
| Serving remains `sb_only` | **Honored** |
| Zero selection invents no phonics drill | **Honored** |

---

## 8. Selection / no-reconstruction

- Membership ≠ selection.
- Zero selection must not invent a phonics drill.
- Partial selection must not reconstruct unchecked audio, words, underlines, blends, or chant text.
- Audio 163–167 never invent transcripts.
- Excluding Activity 35 removes chant evidence everywhere.
- Writing p.140 and Values p.142 stay isolated.

---

## 9. Local Step B artifact

- Migration: `supabase/migrations/20261030200000_seed_nll_be3_u08_phonics.sql`
- Focused suite: `scripts/tests/nllBe3U08PhonicsSeedStepB.test.ts`
- Precondition baseline: **7 / 60 / 60 / 8**
- Intended post-Phonics totals: **8 / 68 / 68 / 9**
- **Applied / verified (2026-10-30):** live totals **8 / 68 / 68 / 9** then chained Review to **9 / 74 / 74 / 9**; history **28 / 0 / 0**.

---

## 10. Read-only preflight (2026-10-30)

| Check | Result |
|---|---|
| Live totals | **7 / 60 / 60 / 8** |
| History | **26 recorded / 0 pending / 0 remote-only** (Writing `20261030190000` recorded) |
| Seven existing components exact | PASS |
| Phonics key/UUID absent | PASS |
| Membership / summary / preferred / SS collisions | **0** |
