# P3-EXP-BE2-U08-VERTICAL-v1 — Vertical Mapping Review

**Status:** ACTIVE — **owner provisional acceptance** (experimental evidence; **not** a locked methodology)  
**Version:** 1.1  
**Date:** 2026-10-09  
**Experiment ID:** `P3-EXP-BE2-U08-VERTICAL-v1`  
**Protocol:** [`p3-exp-be2-u08-vertical-v1-protocol.md`](./p3-exp-be2-u08-vertical-v1-protocol.md)  
**Decision:** [D017](../4-decisions.md)  
**Hub:** BE2-SB Unit 8 — *Wild Animals* (`bep2_unit_08`, pp. 128–143)

**Tags:** `BOOK_EVIDENCE` | `AI_INTERPRETATION` | `UNCERTAIN` | `MISSING_EVIDENCE`  
`EXPERIMENT_SKETCH — NOT LOCKED`.

---

## 0. Inputs

| Layer | Source |
|---|---|
| Phase 2 LRs (Current) | [`../phase-2/p2-exp-be2-u08-v1-review.md`](../phase-2/p2-exp-be2-u08-v1-review.md) |
| Phase 1 | `big_english_1_sb`, `big_english_2_sb`, `big_english_3_sb`, `big_english_4_sb` canonicals |
| Seed note | [`../phase-2/be2-candidate-units.md`](../phase-2/be2-candidate-units.md) (BE1 U6 farm; BE3 U4 Amazing Animals) |

No Phase 1/2 rewrites. Exact BE2 U8 I Can wording: `MISSING_EVIDENCE` (not extracted) — does not block this map.

---

## 1. Teacher glance

```text
PREVIOUS                              CURRENT (BE2 U8)                    FUTURE
────────                              ────────────────                    ──────
BE1 U6 farm animals + continuous  →   wild animals + can/can't ability →  BE3 U4 can/can't + habitats
  actions (NOT ability can)             (LR-02–05)                         + personal ability
BE1 U2 Can I help you? (request)  ≠   ability can  [REJECT]              
BE1 U1 single color adjectives    →   multi-adjective order (LR-06)    →  (no direct BE3 order page found)
BE2 U7 Do you like…? (same book)  →   preference lead-in (LR-13)         (horizontal recycle)
                                      habitats CLIL (LR-08)            →  BE3 U4 habitats
                                                                      →  BE4 U5 could/couldn't (past ability)
                                                                         + conservation can (further out)
```

---

## 2. Current cores (Phase 2 LRs — abbreviated)

| LR | Focus | Vertical note |
|---|---|---|
| LR-01 | Wild animal names | Vocab support only — farm/wild animal sets differ |
| LR-02–05 | *can / can't* ability | Primary grammar thread |
| LR-06 | Adjective order | Partial descriptive prior; order rule largely new |
| LR-07 / 11 | *They're so + Adj* | Mostly local |
| LR-08 | Habitats | Stronger future in BE3 U4 than prior |
| LR-09–10, 12 | Games / culture / phonics | Leave mostly unmapped |
| LR-13 | *Do you like…?* | Same-book recycle from U7 preference |

---

## 3. Meaningful connections

### 3.1 Previous → Current

| From | To | What it is | What it is not |
|---|---|---|---|
| **BE1 U6 *On the Farm*** (`bep1_unit_06`, pp. 96–111): animal ID + present continuous actions (`bep1_lang_0601`–`0603`, e.g. *What's it doing? It's running.*) | LR-01–05 | **Teaching opportunity** (`AI_INTERPRETATION`): familiar animal-action domain before *can* ability; students may know animal names/actions as vocabulary support | **Not** direct grammatical progression (continuous ≠ modal ability). Exposure ≠ mastery |
| **BE1 U2** *Can I help you?* (`bep1_lang_0208`) | LR-02–05 | — | **Rejected:** request/help *can*, not ability (`BOOK_EVIDENCE` of different function) |
| **BE1 U1** color after ID (`bep1_lang_0004`–`0005`) | LR-06 | Weak **teaching opportunity**: single adjectives before multi-adjective order | **Not** the opinion→size→age→color rule |
| **BE2 U7** *Do you like…?* (same level) | LR-13 | Same-book **recycle** into animal preference opener | Not a cross-level prior |

**Documented absence:** No BE1 language row teaches ability *can/can't* for animals (scan of BE1-SB). BE1 U6 is action continuous, not ability modal.

### 3.2 Current → Future

| From | To | What it is | What it is not |
|---|---|---|---|
| LR-02–05 ability *can* | **BE3 U4 *Amazing Animals*** (`big_english_3_sb_unit_04`, pp. 58–73): *What can parrots do? / Parrots can talk and fly* (`big_english_3_sb_lang_0008`, p.62); *can/but can't* correction (`0010`); review *Can they swim and fly?* (`0017`, p.73); also **personal** *What can you do?* (`0009`) | **Extend** (`AI_INTERPRETATION`): recycles animal ability *can*, adds contrastive *but can't*, and expands to first-person ability | Not “students already master BE2 U8” |
| LR-08 habitats | BE3 U4 habitat Q/A (`lang_0007` p.59; `0016` p.73); components Habitats Song / Protect habitats | **Extend / teaching opportunity** | Topic match alone is insufficient; retained because tied to same communicative thread as ability talk in both units |
| LR-06 adjective order | BE3 U4 | — | **Left unmapped:** no BE3 U4 language row for cumulative adjective order (`BOOK_EVIDENCE` of absence in that unit’s language list) |
| LR-02–05 | **BE4 U5 *Weird and Wild Animals*** (`big_english_4_sb_unit_05`, pp. 74–89): past ability *could/couldn't* (`bep_sb_4_u05_lang006`–`007`, `009`); conservation *can* (`lang010`); habitat endangerment with *because* | **Further extend** (`AI_INTERPRETATION`): past ability and reason clauses — useful later teaching opportunity | Not the immediate next step; BE3 U4 remains primary future |

### 3.3 Left unmapped

| Item | Reason |
|---|---|
| Phonics *ou/ow* | Local |
| Culture koala/llama/snow monkey specifics | Local personalization |
| Camouflage passive (BE3) as prior to BE2 | Wrong direction / different system |
| Perfect animal-lemma recycling BE1→BE2→BE3 | Sets differ; force-fitting lemmas adds noise |
| BE1 U9 *I like horses* as ability prior | Preference, not ability |

---

## 4. Evidence gaps

| Gap | Kind | Notes |
|---|---|---|
| BE2 U8 exact I Can wording | `MISSING_EVIDENCE` | Not extracted |
| BE3 U4 printed pages on some components/vocab | Sparse page fields | Language rows above have printed pages via `page_id` |
| Publisher vertical map | Documented absence | All edges interpretive |
| BE1 ability *can* | Documented absence | Do not invent |

---

## 5. Evaluation

| ID | Result | Notes |
|---|---|---|
| P3-U8-E1 | **PASS** | IDs + pages cited |
| P3-U8-E2 | **PASS** | Tags used |
| P3-U8-E3 | **PASS** | Help *can* rejected |
| P3-U8-E4 | **PASS** | Animal topic alone not used as progression |
| P3-U8-E5 | **PASS** | Adj-order future, phonics, culture left unmapped where weak |
| P3-U8-E6 | **PASS** | Docs-only |
| P3-U8-E7 | **PASS** | See §6 |

---

## 6. Compare with Unit 6 vertical experiment

| | BE2 U6 (*My Day*) | BE2 U8 (*Wild Animals*) |
|---|---|---|
| Primary system | Clock + timed routines | Ability *can/can't* |
| Prior shape | Contrastive / partial (continuous & *every day*) + Wh recycle | Contrastive teaching opportunity (farm continuous) + rejected false *can* |
| Future shape | Clear BE3 U1 time-system extend | Clear BE3 U4 ability/habitat extend; optional BE4 past *could* |
| Documented absence | No BE1 clocks | No BE1 ability *can* |
| What worked | Separation of theme vs grammar; leave weak edges | Same; philosophy made “teaching opportunity vs progression” explicit |
| What was harder | Invented-clock temptation | Collapsing request *can* / continuous actions / ability *can* |
| Method lock? | No — provisional seed only | No — second experiment only |

**Enough insight to explore Phase 4?**  
**Yes, enough to explore Phase 4 philosophically / experimentally later** (e.g. how a teacher might use Previous/Current/Future notes).  
**Not enough to implement Phase 4** (no enrichment engine, UI, or schema). Vertical mapping is still experimental after two hubs.

---

## 7. Owner status

**Provisional acceptance (2026-10-09):** U8 vertical sketch accepted alongside U6 as experimental Phase 3 evidence. Methodology remains **unlocked**. Phase 3 is **paused** (not permanently completed); Phase 4 exploration is next on branch `phase-4`.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | Executed `P3-EXP-BE2-U08-VERTICAL-v1`; compared with U6; Phase 4 readiness note only. |
| 2026-10-09 | v1.1: owner provisional acceptance; Phase 3 pause / Phase 4 handoff note. |
