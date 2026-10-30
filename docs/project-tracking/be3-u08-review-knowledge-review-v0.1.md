# BE3 Unit 8 Review Knowledge Review v0.1

**Status:** REVIEW-A STEP B APPLIED / VERIFIED / OWNER-ACCEPTED UNDER ADVANCE AUTHORIZATION · REVIEW-B/C IMPLEMENTED / AUTOMATED VERIFICATION PASSED / OWNER-ACCEPTED UNDER ADVANCE AUTHORIZATION
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner advance authorization for Review-A automated knowledge readiness and local Step B preparation. Canonical SB/WB evidence is authoritative over the historical Review brief’s missing-Workbook blocker.
**Implementation authorization:** Review-A live; Review-B/C behind default-off VITE_NLL_CHALKIE_REVIEW_ADAPTER_PILOT. Does **not** authorize promotion, deployment, flag-on default, commit, or push.

---

## 0. Hard boundary statements

- Trusted SB and WB canonicals verified by size, SHA-256, and JSON parse. Neither canonical was modified.
- Review is **mixed consolidation**, not whole-unit aggregation. No inheritance of earlier component summaries, memberships, links, packages, or prose.
- Every summary remains preferred v1 `hidden` / `experimental` and **activity-specific**.
- Component-level SS links remain **zero** (over-linking withheld).
- Default serving remains **`sb_only`**.
- Accepted delivery shape for future Review-B (not implemented): exact **non-serving** two-lesson SB→WB (Lesson 1 = SB p.143; Lesson 2 = WB p.117). No combined unit review. No Values merge. No earlier-component aggregation.
- WB gerund-as-subject evidence remains WB-only and is not back-ported into SB summaries.
- Live NLL at preparation time remains **7 / 60 / 60 / 8**. Phonics local migration prepared but unapplied. Review migration unapplied.

---

## 1. Exact boundary

| Field | Value |
|---|---|
| Proposed component key | `be3-u08-review` |
| Title | `Big English 3 Unit 8 Review` |
| Relationship | `be3_sb_wb_rel_u08_review_sb143_wb117` |
| Stable reference | `be3-sb-wb-u08-p143-wb117` |
| Student Book | p.143 only · `bep3_sb_p143` · Activities **39–41** |
| Workbook | p.117 only · `bep_3_wb_p117` · Activities **31–33** |
| Exact inventory | Three SB + three WB = **six** verified activities |
| Learning-spine role | `review_support` / `values_review` |
| Current packaging | `sb_only` |
| Deterministic UUID (unused live) | `3e800008-0000-4000-8000-000000000009` |

### Explicit exclusions

Values p.142, Phonics SB p.141 / WB p.116, Writing, and all earlier Unit 8 components as membership sources.

---

## 2. Evidence method

Same trusted SB/WB/SS sources as Phonics-A. SB Activities **39–41** reconfirmed; WB p.117 inventory derived from WB canonical only.

### Verified source order

| Position | activity_id | Source | Page | Instruction |
|---:|---|---|---:|---|
| 1 | `bep3_sb_act_08_39` | SB | 143 | Read and choose. Then say. |
| 2 | `bep3_sb_act_08_40` | SB | 143 | Do a survey of your classmates. Add two of your own questions. Ask and answer. |
| 3 | `bep3_sb_act_08_41` | SB | 143 | Read and complete. |
| 4 | `bep_3_wb_act_117_31` | WB | 117 | Circle the correct verb. |
| 5 | `bep_3_wb_act_117_32` | WB | 117 | Read and complete. Use the words from the box. |
| 6 | `bep_3_wb_act_117_33` | WB | 117 | Complete the sentences. Use the words in parentheses. |

Page context: SB **Review** · `review_self_assessment` · audio **false** · visual **true**. WB **Review** · audio **false** · visual **true**.

---

## 3. Fingerprints

| activity_id | activity_sha256 |
|---|---|
| `bep3_sb_act_08_39` | `1bb4b39ff4529d1e95892cb9851498deb90cfcb1b3f55500a85fc991cdbf0dcf` |
| `bep3_sb_act_08_40` | `e7ac38891bbffc268882cfd01e17b3b5ff34064393f7ca241bc55383da7e2ce1` |
| `bep3_sb_act_08_41` | `d3caf3deddf110e8ca4d129750c42578b4943d70fa0a4d4de8c9f9c5e6143e7b` |
| `bep_3_wb_act_117_31` | `f4e92af38b4ebaca2fe915300de5026cc82239701ccce9ffb7ec71ae7f7df159` |
| `bep_3_wb_act_117_32` | `e1deeee9dbbe6dde23f13c3047a2c325cbf9afba85d9ff1905aa86ba3604014f` |
| `bep_3_wb_act_117_33` | `3333eaa10ad76b2cfe3828e21de7d46805369a83d728ecbb83c1c1d11c2f7c32` |

---

## 4. Activity evidence summary

| ID | Type | Keyed/open | Visual | Notes |
|---|---|---|---|---|
| 39 | `read_and_choose` | **Four keyed** Did/did/didn't | page-level | Answer-key protected; no SB audio |
| 40 | `class_survey` | Mixed: publisher *Did you…?* cues + two open `[?]` | page-level | Open survey; no invented personal answers / no required disclosure |
| 41 | `read_and_complete_verb_form` | **Six keyed** past forms | page-level | Answer-key protected |
| WB 31 | `verb_form_choice` | Three keyed circles | **true** | Verb-choice only |
| WB 32 | `cloze_completion` | Six keyed cloze from box | false | Word box from canonical |
| WB 33 | `gerund_sentence_completion` | Five keyed gerunds | **true** | **WB-only**; do not back-port to SB |

Represented (Review evidence only): selected *Did…?* communicative review; selected past morphology; healthy-habit topic context in survey prompts. Absent unless later verified inside Review: Story, CLIL, Culture, Writing, Phonics, Values project, song/full Opener vocab, and any earlier-component aggregation.

---

## 5. Preferred v1 summaries (hidden / experimental)

| Summary ID | activity_id | Summary |
|---|---|---|
| `…activity_39_summary_review_a_v1` | `bep3_sb_act_08_39` | Students read and choose among Did, did, and didn't forms in four keyed items without reconstructing answers if the activity is excluded. |
| `…activity_40_summary_review_a_v1` | `bep3_sb_act_08_40` | Students run an open class survey with publisher Did you…? frames, complete initial prompt cues, and add two of their own questions, without inventing personal answers or requiring disclosure. |
| `…activity_41_summary_review_a_v1` | `bep3_sb_act_08_41` | Students complete six keyed past verb forms without reconstructing answers if the activity is excluded and without inventing SB audio. |
| `…p117_activity_31_summary_review_a_v1` | `bep_3_wb_act_117_31` | Students circle the correct verb form in three keyed items, preserving the page visual dependency without reconstructing excluded choices. |
| `…p117_activity_32_summary_review_a_v1` | `bep_3_wb_act_117_32` | Students complete a six-gap cloze from the publisher word box without inventing box words or reconstructing excluded gaps. |
| `…p117_activity_33_summary_review_a_v1` | `bep_3_wb_act_117_33` | Students complete five keyed gerund-as-subject sentences that remain Workbook-only evidence and must not be back-ported into Student Book Review summaries. |

Provenance prompt: `review-a-step-a-knowledge-prep-v0.1`.

---

## 6. SS-link decision

**Zero component-level SS links.** No clean single-strand SS column represents mixed Review without overstating coverage. Activity-level provenance preferred for any future authority mapping. Do not inherit links from earlier components.

---

## 7. Delivery-shape decision

**Accepted for future Review-B only:** non-serving two-lesson SB→WB.

| Rule | Outcome |
|---|---|
| WB p.117 independently usable | **Yes** — three human_verified activities |
| Lesson 1 = SB p.143 only | **Yes** |
| Lesson 2 = WB p.117 only | **Yes** |
| No combined unit review / Values merge / earlier aggregation | **Honored** |
| Serving remains `sb_only` | **Honored** |

---

## 8. Selection / no-reconstruction

- Membership ≠ selection.
- Zero selection must not create a generic Unit 8 review.
- Excluding an activity removes its evidence everywhere.
- Optional prior learning cannot replace Review evidence.
- No invented SB audio.
- Preserve page-level visual dependency without inventing layout meaning.

---

## 9. Local Step B artifact (chained)

- Migration: `supabase/migrations/20261030210000_seed_nll_be3_u08_review.sql`
- Focused suite: `scripts/tests/nllBe3U08ReviewSeedStepB.test.ts`
- Precondition baseline: **exact post-Phonics 8 / 68 / 68 / 9**
- Intended post-Review totals: **9 / 74 / 74 / 9**
- Preserves Phonics + all seven prior components.
- **Applied / verified (2026-10-30):** live totals **9 / 74 / 74 / 9**; history **28 / 0 / 0**; zero Review SS links; Phonics retained.

---

## 10. Read-only collision evidence

Phonics and Review keys/UUIDs absent live; proposed membership/summary/preferred/SS collisions **0** at live **7 / 60 / 60 / 8** before either local migration is applied.
