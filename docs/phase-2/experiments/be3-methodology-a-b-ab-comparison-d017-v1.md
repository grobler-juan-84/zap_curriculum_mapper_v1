# BE3 Methodology Comparison — A vs B vs A+B (D017)

**Date:** 2026-10-13  
**Decision:** D017 — Progressive Curriculum Intelligence (LOCKED)  
**Status:** EXPERIMENTAL three-way comparison — **not accepted**; **methodology not locked**; awaiting owner review  
**Prior A/B isolation study:** [`be3-methodology-refinement-comparison-d017-v1.md`](./be3-methodology-refinement-comparison-d017-v1.md) (unchanged)  
**Owner-review companion:** [`be3-ab-combined-owner-review-d017-v1.md`](./be3-ab-combined-owner-review-d017-v1.md)

---

## 1. Artifacts

| Role | File |
|---|---|
| Control (reference) | [`be3-sb-u01-u09-book-overview-d017-v1.md`](./be3-sb-u01-u09-book-overview-d017-v1.md) |
| Experiment A — inference only | [`be3-sb-u01-u09-book-overview-d017-exp-a.md`](./be3-sb-u01-u09-book-overview-d017-exp-a.md) |
| Experiment B — Writing column only | [`be3-sb-u01-u09-book-overview-d017-exp-b.md`](./be3-sb-u01-u09-book-overview-d017-exp-b.md) |
| Experiment A+B — combined | [`be3-sb-u01-u09-book-overview-d017-exp-ab.md`](./be3-sb-u01-u09-book-overview-d017-exp-ab.md) |

**Untouched:** Phase 1 canonical JSON; BE2 v2 provisional baseline; A/B/control content; application code/schemas.

**Generation safeguard:** A, B, and A+B were drafted from Phase 1 writing components only. Publisher targets (diagnostic transcriptions) are evaluation context only, not generation inputs.

---

## 2. Design differences

| Feature | A | B | A+B |
|---|---|---|---|
| Columns | 8 | 9 (+ Writing) | 9 (+ Writing) |
| Writing in Learning Outcomes | Yes (9/9) | No (control LOs) | Yes (9/9; wording re-shaped vs A) |
| Writing column | No | Yes (9/9) | Yes (9/9) |
| Grammar / Functions vs control | Preserved | Preserved | Preserved |
| LO ↔ Writing wording split | n/a | n/a | Intentional (capability vs craft label) |

---

## 3. Evaluation criteria (applied to all nine units)

| # | Criterion | What was checked |
|---|---|---|
| 1 | Evidence fidelity | Writing claims map to Phase 1 `writing` components |
| 2 | Learning Outcome quality | Demonstrable student capabilities, not topic lists only |
| 3 | Writing visibility | Teacher can see unit writing expectations at a glance |
| 4 | Duplication | Unnecessary identical overlap between LO and Writing |
| 5 | Teacher readability | Scanability / cell density |
| 6 | Curriculum mapping value | Use for horizontal book overview and later vertical probes |
| 7 | Information preservation | Grammar, Functions, vocab, CLIL, values, phonics not weakened |

---

## 4. Three-way comparison table

Legend: **Strong** / **Adequate** / **Weak** / **n/a**. Judgments are qualitative and evidence-backed; not precision scores.

| Criterion | A | B | A+B | Confirmed notes |
|---|---|---|---|---|
| 1. Evidence fidelity | Strong | Strong | Strong | All three stay within nine Phase 1 writing comps; U8 title-only |
| 2. LO quality (incl. writing) | Strong | Weak (writing silent) | Strong | A+B keeps communicative LOs + writing capabilities |
| 3. Writing visibility | Weak (buried in LO) | Strong | Strong | Dedicated column in B and A+B |
| 4. Duplication risk | Low (single place) | Low | **Moderate** | Related LO↔Writing meaning by design; not identical wording |
| 5. Teacher readability | Adequate (dense LOs) | Strong (short LOs + clear Writing) | Adequate | A+B widest + denser LOs than B |
| 6. Mapping value | Adequate | Adequate | **Stronger** | Outcomes + strand label both available for later comparisons |
| 7. Information preservation | Strong | Strong | Strong | Non-writing cells match control |

### Coverage measures (do not conflate)

| Measure | A | B | A+B |
|---|---|---|---|
| Writing **anywhere** clear | 9/9 | 9/9 | 9/9 |
| Writing **in Learning Outcomes** | 9/9 | 0/9 | 9/9 |
| Writing **in Writing column** | n/a | 9/9 | 9/9 |

Control (reference): writing anywhere Soft/absent; in LO 0/9; no Writing column.

---

## 5. Unit-level duplication check (A+B only)

| Unit | LO writing fragment | Writing cell | Overlap judgment |
|---|---|---|---|
| 1 | identify subjects and verbs when writing about routines | Sentence craft — subjects & verbs | Related, not identical — **OK** |
| 2 | produce compound sentences with two subjects and two verbs | Compound subjects/verbs joined by *and* | Related — **OK** |
| 3 | capitalize paragraph titles correctly | Paragraph titles — capitalization rules | Related — **OK** |
| 4 | write a clear topic sentence for a paragraph | Topic sentences (main-idea sentence) | Related — **OK** |
| 5 | support a topic with detail sentences | Detail sentences (supporting ideas) | Related — **OK** |
| 6 | close a paragraph with a final sentence that restates the main idea | Final sentences (restate main idea) | Soft shared metalanguage — **acceptable** |
| 7 | write a short paragraph with title, topic, details, and closing | Paragraph parts — title / topic / detail / final | Soft shared list — **acceptable** |
| 8 | join related ideas using *and*, *but*, or *or* | Sentence combining with *and*, *but*, *or* | Soft shared conjunctions — **acceptable** |
| 9 | write past-tense SVO sentences about trips | SVO sentence structure (subject–verb–object) | Related — **OK** |

**Confirmed:** No unit uses exact identical LO↔Writing strings.  
**Interpretation:** Soft overlap on U6–U8 is metalanguage inevitability, not careless copy-paste.  
**Unresolved:** Whether teachers prefer that soft overlap removed by thinning LOs (risk: weaker outcome statements).

---

## 6. Does A+B add genuine value — or only complexity?

### Confirmed observations

1. A alone does not give a scannable Writing strand.
2. B alone does not put writing into Learning Outcomes.
3. A+B delivers both measures simultaneously.
4. A+B does not weaken Grammar / Functions relative to control.
5. A+B is the densest/widest of the three experimental tables.

### Evidence-based interpretations

1. **Genuine additional value** for BE3-like books where publisher S&S has a Writing column **and** I Can writing goals matter: A+B is the only variant that covers both success criteria identified in the Step 3 isolation study.
2. **Complexity cost is real but bounded:** one extra column (same as B) plus LO density similar to A; not a new schema or second document.
3. A+B is **not automatically superior for every book** — BE1/BE2 may not need nine-column writing emphasis; BE2 v2 baseline remains eight-column until an owner decision.

### Unresolved (owner judgment)

1. Is the readability cost of A+B worth dual writing coverage for BE3?
2. Should future books default to A, B, A+B, or book-conditional rules?
3. Prefer thinning LO writing fragments now that Writing column exists?
4. Restore original BE3 S&S PDF for fuller publisher validation?

---

## 7. Concise findings

| Finding | Class |
|---|---|
| A and B each solve one gap; A+B solves both | Confirmed |
| A+B introduces moderate intentional LO↔Writing relatedness | Confirmed |
| A+B does not lose established non-writing content | Confirmed |
| A+B is denser than B and wider than A | Confirmed |
| A+B is the best BE3 writing-coverage candidate among the three experiments | Interpretation |
| A+B should become the locked D017 methodology | **Not claimed** — owner decision only |
| Teacher preference / classroom usability | Unresolved |

---

## 8. Recommendation (non-binding)

Present **A, B, and A+B together** for owner review. Do **not** approve a format or lock methodology from this document. If dual coverage remains a success criterion for BE3-style books, A+B is the strongest experimental candidate; if scan-minimal eight-column parity with BE2 v2 matters more, prefer A or keep investigating lighter hybrids.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-13 | Created A vs B vs A+B three-way comparison after combined experiment; prior A/B comparison left unchanged. |
