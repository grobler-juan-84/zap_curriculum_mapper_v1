# BE3 Book Intelligence Diagnostic (D017) — Step 1

**Date:** 2026-10-13  
**Experiment sequence:** Diagnose BE3 → Test BE5 unchanged → Refine once → Validate on unseen book  
**This step only:** Diagnose BE3  
**Status:** EXPERIMENTAL diagnostic — ready for owner review; **no methodology change**

**Compared artifacts**
- Overview (unchanged): [`be3-sb-u01-u09-book-overview-d017-v1.md`](./be3-sb-u01-u09-book-overview-d017-v1.md)
- Publisher S&S: `C:\Users\ADMINPC\Downloads\BE3-Scope-and-Sequence.pdf` (image-based; Units / Vocabulary / Structures + CLIL·Culture / **Writing** / Phonics / Values / I can…)
- Phase 1: `data/phase1/big_english_3_sb/canonical/v1.json`

**Preserved:** BE2 v1/v2 baseline and prior experiment outputs — **not modified**.

---

## 1. Executive summary

BE3’s weaker publisher alignment is **not primarily a missing Phase 1 writing extraction problem**. All nine units have verified `component_type: writing` rows in Phase 1, matching the publisher Writing strand.

The dominant pattern is:

1. **Presentation** — the D017 v2 eight-column layout (inherited from BE2) has **no Writing column**, while the BE3 publisher S&S does. Writing was folded thinly into Grammar / Learning Outcomes or omitted from the unit table.
2. **Inference** — Learning Outcomes under-represent publisher I Can writing/metalanguage targets (subjects/verbs, topic/detail/final sentences, paragraph parts, title capitals, SVO *writing*), even when Phase 1 and S&S both state them.
3. **Evidence (secondary)** — exact I Can checklist text is still not extracted for BE3 (same F017 pattern as BE2), so outcomes remain AI-inferred and easier to drift from publisher wording. Core **Structures** coverage is mostly adequate.

**Confirmed:** Writing strand exists in publisher S&S and Phase 1; overview under-represents it.  
**Hypothesis:** Adding a Writing column *may* improve BE3-style alignment — **not confirmed as the correct fix** until BE5 shows the same publisher-column pattern under the unchanged methodology.

---

## 2. Publisher vs overview column map

| Publisher S&S column | D017 v2 overview column | Fit |
|---|---|---|
| Unit | Unit | Direct |
| Vocabulary | Vocabulary | Direct |
| Structures | Grammar / Structures | Direct (mostly strong) |
| *(none)* | Communicative Functions | Overview-only interpretive column |
| CLIL/Culture | CLIL / Culture | Direct |
| **Writing** | *(none)* | **Structural mismatch** |
| Phonics | Phonics | Direct |
| Values | Values | Direct |
| I can… | Learning Outcomes (AI-inferred) | Partial — language/CLIL/values often present; **writing I Can items often weak/absent** |

---

## 3. Unit-by-unit discrepancy table

Legend: **OK** = meaningful coverage; **Soft** = present but thin / wording-only gap; **Gap** = meaningful omission or misrepresentation. Classifications may stack.

| Unit | Grammar / Structures vs S&S | Writing vs S&S | Learning Outcomes vs I Can | Other | Likely class |
|---|---|---|---|---|---|
| **1 Wake Up!** | **OK** — *When…?*, *before/after*, frequency adverbs present | **Gap** — S&S *Sentence: Subjects and Verbs*; Phase 1 `bep3_comp_0003` (*Sentence: Subjects and Verbs*, `bep3_sb_p16`); overview only minor “subject + verb” in Grammar | **Soft/Gap** — routines/time/hygiene OK; missing “find and use subjects and verbs” | Values/phonics/CLIL OK | Presentation + Inference |
| **2 A Lot of Jobs!** | **OK** — job/workplace Qs + full present simple | **Gap** — S&S *Sentence: Two Subjects and Verbs*; Phase 1 `bep_sb_3_comp_0003`; overview folds as “compound subjects/verbs” | **Soft/Gap** — jobs OK; missing “find and use two subjects and two verbs” | — | Presentation + Inference |
| **3 Working Hard!** | **OK** — *have to*, *like/love/hate + -ing*, frequency | **Gap** — S&S *Paragraph: Titles*; Phase 1 `be_plus_3_sb_comp_003`; **absent from overview table** | **Gap** — missing “use capital letters in titles” | — | Presentation + Inference |
| **4 Amazing Animals!** | **OK** — *can/can't*, habitats, manner adverbs | **Gap** — S&S *Paragraph: Topic Sentences*; Phase 1 `big_english_3_sb_component_0012`; also language row defines topic sentence — not surfaced as writing/LO | **Gap** — missing “find and use topic sentences” (adverbs only soft in Grammar) | pp. 66–67 `missing_source` (D013) — not used to invent content | Presentation + Inference; Evidence soft on PDF pages only |
| **5 Wonderful Weather!** | **OK** — present/past weather; *was/were*; *There was/were* | **Gap** — S&S *Paragraph: Detail Sentences*; Phase 1 `bep_sb_3_comp_003`; absent from overview | **Gap** — missing “find and use detail sentences” | — | Presentation + Inference |
| **6 Smells Good!** | **OK** — sense verbs + adjectives | **Gap** — S&S *Paragraph: Final Sentences*; Phase 1 `bep3_comp_u6_003`; absent | **Gap** — missing “find and use final sentences” | *would like to* / invites are overview extras vs core S&S Structures (harmless if evidenced) | Presentation + Inference |
| **7 Fabulous Food!** | **OK** — *some/any*, quantifiers, *How much/many* | **Gap** — S&S *Paragraphs*; Phase 1 `bep_3_sb_u07_comp_0008` (full paragraph parts); absent | **Gap** — missing “find different parts of a paragraph” | — | Presentation + Inference |
| **8 Healthy Living** | **Soft** — *Did…?*, regular/irregular past, *and/but/or* present but Phase 1 language rows thin (5) | **Soft/Gap** — S&S *Combining Sentences with and, but, or*; Phase 1 `bep3_sb_comp_08_08`; overview parks conjunctions under Grammar only | **Soft** — past habits/exercise OK; weak explicit “use *and/or/but*” writing goal | — | Presentation + Inference; Evidence soft (thin language) |
| **9 School Trips!** | **OK** — past Wh/Y-N, *didn't* | **Soft/Gap** — S&S *Writing Sentences* (SVO); Phase 1 `bep3_sb_u09_comp_0008`; overview lists SVO under Grammar as “identify sentence parts” | **Soft** — past trips OK; “write SVO sentences” softened to identification | — | Presentation + Inference |

**Acceptable summarization (not counted as gaps):** vocabulary list compression; Communicative Functions column (publisher has none); CLIL/culture/values/phonics topic matches; harmless example-sentence wording.

---

## 4. Classification of meaningful discrepancies

### A. Writing strand invisible in the eight-column table — **CONFIRMED**

| Claim | Support |
|---|---|
| Publisher S&S has a dedicated **Writing** column with a progressive strand U1→U9 | BE3-Scope-and-Sequence.pdf (right panel) |
| Phase 1 contains matching writing components for **all nine units** | Canonical `curriculum_components` with `component_type: writing` (IDs listed in §3) |
| Overview admits writing is under-represented | Overview §D: “Writing strand present but no Writing column” |
| Classification | **Presentation** (format inherited from BE2 v2) **+ Inference** (not promoted into LOs) — **not** primary Evidence failure |

### B. Learning Outcomes miss writing / metalanguage I Can items — **CONFIRMED**

Publisher I Can statements repeatedly pair communicative goals with writing goals (“Find and use topic sentences”, “Use capital letters in titles”, “Write sentences with SVO”, etc.). Overview LOs usually keep communicative/CLIL/values strands and drop writing metalanguage.

| Classification | Notes |
|---|---|
| **Inference** | Primary — evidence existed; outcomes did not elevate writing goals |
| **Evidence** | Secondary — no extracted I Can item text in BE3 Phase 1 (F017), so drift is easier than on BE1 |

### C. Core Structures alignment — **MOSTLY CONFIRMED OK**

Publisher Structures families are largely present in the Grammar column. BE3’s “weaker alignment” complaint is **not** best explained as wholesale grammar omission.

| Soft spots | Class |
|---|---|
| U8 thin language rows | **Evidence** soft + **Inference** compression |
| Writing-adjacent grammar (SVO, conjunctions, subject/verb) treated only as Grammar | **Presentation** |

### D. Missing Writing column as *the* solution — **HYPOTHESIS (not confirmed)**

Plausible that a ninth Writing column (or mandatory Writing cell inside an existing column) would restore publisher-visible alignment for BE3-like books. **Not proven** that this is the right D017 refinement until BE5 is tested **unchanged**.

Alternative hypotheses (still open):
- Keep eight columns but require LOs to include writing goals when Phase 1 `writing` components exist (**Inference-rule** fix).
- Tag writing under Grammar/Structures with an explicit “Writing: …” prefix (**Presentation** fix without new column).

---

## 5. Assessment of the missing Writing column hypothesis

| Question | Answer |
|---|---|
| Does missing Writing column contribute to weaker BE3 alignment? | **Yes — likely major contributor** (Presentation) |
| Is Phase 1 missing writing evidence? | **No** — nine writing components present |
| Must we add a Writing column now? | **No** — diagnose-only; wait for BE5 unchanged test |
| Would adding Writing alone fix LO drift? | **Probably not alone** — Inference habit still drops writing I Can items |
| Risk of adding Writing prematurely? | May overfit BE3; BE1/BE2 may not need the same density |

**Balance:** Presentation gap is real; Inference gap is also real. Evidence gap is secondary (I Can text), not the writing-component gap.

---

## 6. Key questions to monitor in the BE5 experiment (unchanged methodology)

Do **not** generate BE5 in this task. When BE5 is run with the current BE2-based eight-column method, specifically watch:

1. **Does the BE5 publisher S&S include a dedicated Writing column?** (If yes, expect the same Presentation mismatch.)
2. **Does BE5 Phase 1 contain `writing` components for most/all units?** (If yes and overview still omits them → Presentation/Inference confirmed as systematic.)
3. **Do AI-inferred LOs again omit writing/metalanguage I Can targets while covering communicative strands?**
4. **Are core Structures still largely OK while “alignment feel” is weak?** (Separates grammar failure from writing/LO failure.)
5. **Any new gap type at BE5** (e.g. denser past forms, conditionals, multi-clause writing) that the eight-column format cannot hold without invention?
6. **Empty/thin language `full_text` rows** — does BE5 force more label-only inference like BE3 U8?

Success criterion for the BE5 probe (diagnostic sense): determine whether BE3’s pattern **recurs** under unchanged method, before any refine-once step.

---

## 7. Recommendation

| Option | Verdict |
|---|---|
| Refine methodology immediately (add Writing column / change prompt) | **Not yet** |
| Proceed to **Test BE5 unchanged** | **Yes — recommended next** |
| Further BE3-only investigation before BE5 | **Optional, low value** — Phase 1 writing evidence and S&S mismatch are already clear |
| Re-extract Phase 1 / modify I Can now | **No** (F017 remains parked unless owner promotes) |

**Owner decision after this diagnostic:** accept the BE3 diagnosis and authorize BE5 unchanged run, or request a narrower BE3 re-check (e.g. spot-verify one unit’s writing pages in the SB PDF). No locked decision, schema, or prompt change follows from this report alone.

---

## 8. Evidence index (traceability)

### Publisher S&S Writing targets (from BE3-Scope-and-Sequence.pdf)

| Unit | Writing (publisher) |
|---|---|
| 1 | Sentence: Subjects and Verbs |
| 2 | Sentence: Two Subjects and Verbs |
| 3 | Paragraph: Titles |
| 4 | Paragraph: Topic Sentences |
| 5 | Paragraph: Detail Sentences |
| 6 | Paragraph: Final Sentences |
| 7 | Paragraphs |
| 8 | Combining Sentences with *and, but, or* |
| 9 | Writing Sentences (SVO) |

### Phase 1 writing components (canonical)

| Unit | Component ID | Title (Phase 1) |
|---|---|---|
| 1 | `bep3_comp_0003` | Sentence: Subjects and Verbs |
| 2 | `bep_sb_3_comp_0003` | Sentence: Two Subjects and Verbs |
| 3 | `be_plus_3_sb_comp_003` | Paragraph: Titles |
| 4 | `big_english_3_sb_component_0012` | Paragraph: Topic Sentences |
| 5 | `bep_sb_3_comp_003` | Paragraph: Detail Sentences |
| 6 | `bep3_comp_u6_003` | Paragraph: Final Sentences |
| 7 | `bep_3_sb_u07_comp_0008` | Paragraphs (Title, Topic, Detail, Final) |
| 8 | `bep3_sb_comp_08_08` | Combining Sentences with and, but, or |
| 9 | `bep3_sb_u09_comp_0008` | Writing Sentences: Subjects, Verbs, and Objects |

---

## Change log

| Date | Change |
|---|---|
| 2026-10-13 | Created BE3 Book Intelligence diagnostic vs publisher S&S; no overview/prompt/data changes. |
