# BE3 Methodology Refinement Comparison (D017) — Step 3

**Date:** 2026-10-13  
**Decision:** D017 — Progressive Curriculum Intelligence (LOCKED)  
**Status:** EXPERIMENTAL comparison — **not accepted**; **methodology not locked**; awaiting owner review  
**Validation type:** **Partial publisher-reference validation** (see §1.3)

---

## 1. Experimental controls and methodology

### 1.1 Artifacts compared

| Role | File | Generation inputs |
|---|---|---|
| **Control** | [`be3-sb-u01-u09-book-overview-d017-v1.md`](./be3-sb-u01-u09-book-overview-d017-v1.md) | Phase 1 only; eight columns; original LO inference |
| **Experiment A** | [`be3-sb-u01-u09-book-overview-d017-exp-a.md`](./be3-sb-u01-u09-book-overview-d017-exp-a.md) | Phase 1 only; **same eight columns**; LOs refined to include writing when Phase 1 `writing` components support them |
| **Experiment B** | [`be3-sb-u01-u09-book-overview-d017-exp-b.md`](./be3-sb-u01-u09-book-overview-d017-exp-b.md) | Phase 1 only; **control LO wording preserved**; dedicated **Writing** column from Phase 1 writing components |

**Preserved / untouched:** Phase 1 canonical data; BE1/BE2/BE3/BE5 prior overviews and diagnostics; BE2 v2 provisional baseline.

### 1.2 Isolation design

| Variable | Control | A | B |
|---|---|---|---|
| Eight original columns | Yes | Yes | Yes (plus Writing) |
| Learning Outcomes inference | Original | **Refined for writing** | Original (verbatim) |
| Writing column | No | No | **Yes** |
| Publisher targets used in drafting | No | **No** | **No** |

Hypotheses under test (independent):

- **A:** Underrepresentation is primarily an **inference** problem.
- **B:** Underrepresentation is primarily a **presentation** problem.

Neither hypothesis was assumed sufficient a priori.

### 1.3 Evaluation evidence sources (kept distinct)

| Evidence class | Source | Used for |
|---|---|---|
| **Phase 1 evidence** | `data/phase1/big_english_3_sb/canonical/v1.json` — nine `component_type: writing` rows | Generating A and B; judging unsupported claims vs book evidence |
| **Publisher-derived evaluation evidence (provisional)** | Transcribed Writing + I Can writing targets in [`be3-book-intelligence-diagnostic-d017-v1.md`](./be3-book-intelligence-diagnostic-d017-v1.md) §3 and §8 | **Post-hoc** partial alignment checks only |
| **Original publisher PDF** | `BE3-Scope-and-Sequence.pdf` | **Unavailable on this machine** — recorded as evaluation limitation |

**Safeguards observed:** Publisher transcriptions were **not** used to generate either experimental overview. Evaluation does **not** extrapolate beyond the transcribed Writing strand and the diagnostic’s unit-level I Can writing notes. Publisher alignment alone does **not** prove curriculum accuracy.

### 1.4 Coverage measures (do not conflate)

| Measure | Meaning |
|---|---|
| **Anywhere** | Writing competency visible in any overview cell (Grammar, Functions, LOs, Writing, etc.) |
| **In Learning Outcomes** | Explicit writing/metalanguage goal in the LO cell |
| **In Writing column** | Explicit writing competency in a dedicated Writing cell |

---

## 2. Provisional publisher reference (transcribed only)

From the BE3 diagnostic transcription (not re-derived from a PDF in this run):

| Unit | Publisher Writing (transcribed) | Publisher I Can writing note (diagnostic) |
|---|---|---|
| 1 | Sentence: Subjects and Verbs | find and use subjects and verbs |
| 2 | Sentence: Two Subjects and Verbs | find and use two subjects and two verbs |
| 3 | Paragraph: Titles | use capital letters in titles |
| 4 | Paragraph: Topic Sentences | find and use topic sentences |
| 5 | Paragraph: Detail Sentences | find and use detail sentences |
| 6 | Paragraph: Final Sentences | find and use final sentences |
| 7 | Paragraphs | find different parts of a paragraph |
| 8 | Combining Sentences with *and, but, or* | use *and/or/but* (writing goal) |
| 9 | Writing Sentences (SVO) | write SVO sentences |

---

## 3. Compact unit-by-unit comparison

Legend for writing coverage vs provisional publisher Writing/I Can notes: **Y** = clear match; **Soft** = related but thin / wrong column only; **N** = missing. Grammar / communicative preservation judged vs control (not vs full publisher Structures list beyond diagnostic notes).

| Unit | Control anywhere | Control in LO | A anywhere | A in LO | B anywhere | B in LO | B Writing col | Grammar/Functions vs control | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Soft (Grammar “subject + verb”) | N | Y | Y | Y | N | Y | Preserved | A puts writing in LO; B surfaces in Writing col |
| 2 | Soft (Grammar “compound subjects/verbs”) | N | Y | Y | Y | N | Y | Preserved | Same split pattern |
| 3 | N | N | Y | Y | Y | N | Y | Preserved | Control had no title-capitalization signal |
| 4 | N | N | Y | Y | Y | N | Y | Preserved | Topic-sentence gap closed in A (LO) / B (Writing) |
| 5 | N | N | Y | Y | Y | N | Y | Preserved | Detail-sentence gap closed likewise |
| 6 | N | N | Y | Y | Y | N | Y | Preserved | Final-sentence gap closed likewise |
| 7 | N | N | Y | Y | Y | N | Y | Preserved | Full paragraph parts closed likewise |
| 8 | Soft (Grammar *and/but/or*) | N | Y | Y | Y | N | Y | Preserved | Control parked conjunctions as grammar only |
| 9 | Soft (Grammar “identify sentence parts”) | Soft (“recognize…” not write) | Y | Y | Y | N | Y | Preserved | A restores *write* SVO; B keeps LO soft, Writing explicit |

### Evidence-backed counts (qualitative, nine units)

| Measure | Control | Exp A | Exp B |
|---|---|---|---|
| Writing **anywhere** clear (Y) | **0**/9 (4 Soft) | **9**/9 | **9**/9 |
| Writing **in Learning Outcomes** clear (Y) | **0**/9 | **9**/9 | **0**/9 |
| Writing **in Writing column** clear (Y) | n/a | n/a | **9**/9 |
| Grammar / communicative cells drifted from control | — | **0**/9 intentional drift | **0**/9 |
| Unsupported writing claims vs Phase 1 | — | **0** observed (all nine map to writing comps) | **0** observed |

---

## 4. Evaluation criteria (control vs A vs B)

### 4.1 Writing competency coverage

| Perspective | Finding |
|---|---|
| **Anywhere** | Both A and B restore clear writing coverage for all nine units; control does not. |
| **In Learning Outcomes** | **Only A** restores writing in LOs (9/9). B leaves control LO silence intact. |
| **In Writing column** | **Only B** provides a dedicated, scannable Writing strand (9/9). A has no Writing column. |

### 4.2 Learning-outcome alignment (partial publisher-reference)

Against transcribed I Can writing notes only:

- **Control:** weak/absent for writing metalanguage (matches prior diagnostic).
- **A:** strong unit-by-unit meaning match for the nine transcribed writing I Can notes; communicative/CLIL/values fragments retained from control.
- **B:** LO alignment unchanged from control for writing (still weak); Writing column matches transcribed publisher Writing labels closely via Phase 1 titles.

### 4.3 Grammar and communicative-function preservation

Both experiments preserve control Grammar and Communicative Functions cells. No regression observed in those strands relative to control. Residual control folds (e.g. U1 subject+verb in Grammar) remain; they are not harmful, but they are not a substitute for explicit writing presentation or LO goals.

### 4.4 Teacher readability and conciseness

| Version | Readability note |
|---|---|
| Control | Compact eight-column table; writing easy to miss |
| A | Same layout; LO cells longer (four clauses common) — still scannable but denser |
| B | Wider nine-column table; Writing cells short and easy to scan; LOs stay short like control |

Neither A nor B is clearly superior on readability alone: A densifies LOs; B widens the table.

### 4.5 Evidence traceability

Both A and B cite Phase 1 writing component IDs and printed pages in §D. Traceability is **stronger than control** for writing. U8 remains title-only in Phase 1 (no `description`) — both experiments stay within that limit.

### 4.6 Unsupported claims

No overview invented writing competencies without a Phase 1 writing component. Wording is paraphrased from Phase 1 titles/descriptions, not copied from publisher I Can text during generation. **No approval** that paraphrases equal publisher-exact objectives.

---

## 5. Meaningful improvements and regressions

### Improvements

| Change | Who benefits |
|---|---|
| Writing visible somewhere for all nine units | A and B vs control |
| Writing goals appear as student outcomes | **A only** |
| Writing strand scannable like publisher S&S layout | **B only** |
| Phase 1 writing IDs documented | A and B |

### Regressions / costs

| Cost | Who |
|---|---|
| Longer LO cells; writing mixed with communicative goals | A |
| Diverges from BE2 v2 eight-column provisional baseline format | B |
| Writing still invisible in LOs (if teachers read outcomes first) | B |
| Still no exact publisher I Can extraction (F017 parked) | All |

---

## 6. Which hypothesis is better supported?

| Hypothesis | Support level | Why |
|---|---|---|
| **A — Inference rules** | **Strongly supported for LO alignment** | Adding Phase-1-backed writing to LOs alone closed the transcribed I Can writing gaps without a new column |
| **B — Presentation format** | **Strongly supported for strand visibility** | A Writing column alone restored publisher-like Writing coverage **anywhere** / in-column without changing LOs |
| Either alone is sufficient | **Not supported** | A fixes LOs but not dedicated strand scanning; B fixes scanning but not LO writing goals |

**Verdict:** Both hypotheses are **partially correct and complementary**. The diagnostic’s dual diagnosis (Presentation + Inference) is confirmed by this controlled split. Neither single fix is sufficient if the success criteria include **both** (1) writing in Learning Outcomes and (2) a dedicated Writing presentation.

---

## 7. Is A, B, or combined A+B justified?

| Option | Recommendation |
|---|---|
| Adopt A globally now | **No** — not locked; LO density cost; BE1/BE2 may not need identical writing LO weight |
| Adopt B globally now | **No** — format change vs BE2 v2 baseline; does not fix LO silence |
| **Combined A+B on BE3 (next experiment)** | **Justified as the next controlled test** — only after owner review |
| Declare methodology locked | **No** |

Suggested combined design (not executed here): keep Writing column from B **and** include Phase-1-backed writing fragments in LOs as in A; re-check conciseness; still no publisher-driven drafting.

---

## 8. Implications for BE1, BE2, and BE5

| Book | Implication |
|---|---|
| **BE1** | Prior qualitative LO alignment was strong; do **not** force a Writing column or writing-heavy LOs without checking whether BE1 Phase 1 / publisher strand needs it. Transfer A/B only if writing components warrant. |
| **BE2 (v2 provisional baseline)** | Leave eight-column baseline unchanged for now. B would be a format fork; A would change LO rules. Any change needs explicit owner decision — not implied by this BE3 test. |
| **BE5** | Unchanged-method stress test already showed writing underrepresentation with Phase 1 writing evidence present. A and/or B are **plausible remedies**, but BE5 publisher S&S remains unavailable — treat BE5 application as a separate owner-authorized run, not automatic. |

---

## 9. Remaining uncertainties and recommendations

### Uncertainties

1. Original `BE3-Scope-and-Sequence.pdf` missing locally — evaluation is **partial** and limited to diagnostic transcriptions.
2. Transcribed I Can notes may omit non-writing I Can items; this report does not score full I Can lists.
3. Combined A+B readability (nine columns + denser LOs) is untested.
4. Whether teachers prefer writing in LOs, in a Writing column, or both is unknown (no teacher validation yet).
5. Cross-level transfer (BE5, later BE4/BE6) not demonstrated.

### Recommendations (stop points)

1. **Owner review** of A, B, and this comparison — **do not approve** either overview yet.
2. Prefer authorizing a **combined A+B BE3 experiment** next if both LO writing goals and Writing-column visibility remain success criteria.
3. Keep F017 parked unless exact I Can text becomes necessary after combined testing.
4. Do **not** update the global inference methodology or BE2 v2 baseline from this step alone.
5. Optionally restore the original BE3 S&S PDF for a fuller publisher check later.

---

## 10. Completion checklist

| Item | Status |
|---|---|
| Control preserved | Yes |
| Experiment A saved | Yes |
| Experiment B saved | Yes |
| Comparative evaluation saved | Yes |
| Overview approved | **No** |
| Methodology locked | **No** |
| Combined A+B executed | **No — awaiting owner** |

---

## Change log

| Date | Change |
|---|---|
| 2026-10-13 | Created BE3 A/B methodology refinement comparison; partial publisher-reference validation via diagnostic transcriptions; original S&S PDF noted missing. |
