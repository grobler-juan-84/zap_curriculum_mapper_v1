# Phase 2 Experiment Status

**Status:** ACTIVE  
**Version:** 1.28  
**Date:** 2026-10-15  
**Purpose:** Living inventory of Phase 2 experiment lineages. Early LR, V3.1, cross-unit, e2e, and enrichment work remain **historical research evidence** (D017 principle 4). Active direction is Progressive Curriculum Intelligence (D017): minimum-sufficient Book Intelligence. Does **not** lock a Phase 2 methodology, JSON schema, storage model, or product implementation.

---

## 1. Current state

| Item | State |
|---|---|
| Git branch | `phase-2` |
| Phase 1 | PAUSED at 14/18 COMPLETE (D015) |
| Active direction | D017 Progressive Curriculum Intelligence — Book Intelligence first |
| Book Intelligence working baseline | BE2-SB D017 **v2** — owner-approved provisional working baseline; BE2 v1 preserved |
| BE1 / BE3 overviews | Executed (experimental; **not accepted**) |
| Vertical sufficiency probe | Executed — coarse progression signals; minimum-sufficient for bounded Series Intelligence experiments; **not** Phase 3 start |
| Next proposed step | Owner-gated: `book_files` registration, harden preview, other books, or pause — contract still **not locked** |
| BE3 preferred path | Owner prefers **A+B** for **BE3-SB only** (2026-10-15); BE2 v2 baseline unchanged; methodology/schema **not locked** |
| BE3 SS dry checks | **Complete 9/9** — A+B only dual Pass vs `ss_v1.json`; decision recorded under D017 working approvals |
| BE3 A+B regen checks | **Complete 9/9** — all **reproducibility PASS** (soft Near paraphrases only; 0 Drift/Fail); existing overview unchanged |
| BE3 A+B impl. readiness | Units 1–9 JSON in Storage; preview loads Storage via draft loader; still **no** `book_files` / `dataset_versions` |
| BI UI data contract | Draft nine-column contract (`0.1-draft`) + TS loader + Storage-backed U1–9 preview — **not locked** |
| BE3 diagnostic | [`experiments/be3-book-intelligence-diagnostic-d017-v1.md`](./experiments/be3-book-intelligence-diagnostic-d017-v1.md) — Writing presentation + LO inference gaps; Phase 1 writing evidence present |
| BE5 baseline stress test | [`experiments/be5-sb-u01-u09-book-overview-d017-v1.md`](./experiments/be5-sb-u01-u09-book-overview-d017-v1.md) — unchanged method; stress-test only (**not** approved overview); publisher S&S unavailable |
| BE3 Step 3 A/B refine | Exp A + Exp B + isolation comparison completed; **not accepted**; methodology **not locked** |
| BE3 combined A+B | Executed; three-way comparison + owner-review pack; **not accepted**; methodology **not locked** |
| Methodology / schema | **Experimental — NOT LOCKED** |
| Decision note | D017 LOCKED; any **D018** remains **PROPOSED only** |
| Parked Phase 1 ideas | F017 / F018 — not approved for implementation |
| Teacher readability | Deferred to Chalkie workspace — **not** an active Phase 2 blocker |
| Research inventory (V3.1 + cross-unit) | [`p2-exp-be2-v3.1-cross-unit-status.md`](./p2-exp-be2-v3.1-cross-unit-status.md) |

---

## 2. D017 Book Intelligence experiments

### v1 (preserved experiment artifact)

**Artifact:** [`experiments/be2-sb-u01-u09-book-overview-d017-v1.md`](./experiments/be2-sb-u01-u09-book-overview-d017-v1.md)

ChatGPT owner review (2026-10-12): promising minimum-sufficient baseline; flagged U3 old/new, U6 telling-time variants, U8 habitats; proposed publisher comparison. Artifact kept unchanged for comparison history.

### v2 (provisional working baseline — owner-approved 2026-10-13)

**Artifacts (unchanged content; status recorded here):**
- Overview: [`experiments/be2-sb-u01-u09-book-overview-d017-v2.md`](./experiments/be2-sb-u01-u09-book-overview-d017-v2.md)
- Review bundle (v1 vs v2 + publisher comparison + LO assessment): [`experiments/be2-sb-u01-u09-overview-v2-review.md`](./experiments/be2-sb-u01-u09-overview-v2-review.md)

**Owner approval (2026-10-13):**
- Accept v2 as the **provisional Phase 2 Book Intelligence working baseline**.
- Eight-column structure approved for **continued experimentation**.
- ~92% AI-assessed publisher coverage is **sufficient for now**.
- Learning Outcomes remain concise and **AI-inferred**.
- D017 remains LOCKED; Phase 2 **format / methodology / schema are NOT locked**.
- Preserve v1 and v2 experiment artifacts unchanged.

**What v2 refined:** eight-column layout; corrected flagged U3/U6/U8 omissions from Phase 1 evidence; outcomes meaning-aligned where Phase 1 supports.

**Still not claimed:** production-ready standard; methodology lock; schema lock; D018.

### BE1-SB / BE3-SB expansions + vertical probe (2026-10-13)

**Artifacts:**
- BE1 overview: [`experiments/be1-sb-u01-u09-book-overview-d017-v1.md`](./experiments/be1-sb-u01-u09-book-overview-d017-v1.md)
- BE3 overview: [`experiments/be3-sb-u01-u09-book-overview-d017-v1.md`](./experiments/be3-sb-u01-u09-book-overview-d017-v1.md)
- Combined horizontal + vertical probe: [`experiments/be1-be2-be3-book-intelligence-probe-d017-v1.md`](./experiments/be1-be2-be3-book-intelligence-probe-d017-v1.md)

**Result (AI-assessed):** Eight-column pattern transfers. Vertical probe finds meaningful coarse progression (e.g. animals/can/habitats; food quantity; time/routines; jobs; present continuous). Sufficient for bounded Series Intelligence experiments; **not** sufficient to lock Phase 3 or automate entity-level vertical graphs. BE1/BE3 **not accepted** pending owner review. BE2 v1/v2 unchanged.

### BE3 diagnostic vs publisher S&S (2026-10-13)

**Artifact:** [`experiments/be3-book-intelligence-diagnostic-d017-v1.md`](./experiments/be3-book-intelligence-diagnostic-d017-v1.md)

**Finding:** Weaker BE3 publisher alignment is driven mainly by **Presentation** (no Writing column vs publisher Writing strand) and **Inference** (LOs underweight writing/metalanguage I Can items). Phase 1 already has writing components for all nine units — not a primary Evidence failure. Core Structures mostly OK. **Do not refine yet** — next is Test BE5 unchanged. No overview/prompt/data changes in this step.

### BE5 baseline stress test — unchanged method (2026-10-13)

**Artifact:** [`experiments/be5-sb-u01-u09-book-overview-d017-v1.md`](./experiments/be5-sb-u01-u09-book-overview-d017-v1.md)

**Controls observed:** Generated from Phase 1 canonical only **before** consulting BE5 publisher S&S or applying BE3-informed methodology changes. Same eight columns; no Writing column; LOs AI-inferred; BE1/BE2/BE3 artifacts untouched.

**Result (AI-assessed, Phase 1 only):** Method transferred. Grammar denser (gerunds, *used to*, *going to*, present perfect, past continuous, *will*, *may/might*, zero conditional, passive, relative clauses, *for/since*). Writing components exist in Phase 1 for U1–5 and U7–9 (none for U6) but remain untabled — same **Presentation** pattern as BE3. LO writing/genre titles not promoted — same **Inference** risk. New soft issues: U3 thin language rows; U6 values title uncertain; empty `full_text` on some language rows.

**Publisher diagnostic:** **Deferred** — no BE5 Scope & Sequence PDF found locally (unlike BE1/BE2/BE3). No `be5-book-intelligence-diagnostic-d017-v1.md` created.

**Status:** Overview **not accepted** as curriculum overview; owner accepted as **baseline stress test only**. Writing underrepresentation recurred (supports BE3 diagnosis).

### BE3 Step 3 — controlled A/B methodology refinement (2026-10-13)

**Artifacts:**
- Exp A (inference only): [`experiments/be3-sb-u01-u09-book-overview-d017-exp-a.md`](./experiments/be3-sb-u01-u09-book-overview-d017-exp-a.md)
- Exp B (Writing column only): [`experiments/be3-sb-u01-u09-book-overview-d017-exp-b.md`](./experiments/be3-sb-u01-u09-book-overview-d017-exp-b.md)
- Comparison: [`experiments/be3-methodology-refinement-comparison-d017-v1.md`](./experiments/be3-methodology-refinement-comparison-d017-v1.md)

**Controls:** Control v1 preserved. A and B generated from Phase 1 only (publisher targets not used in drafting). Evaluation = **partial publisher-reference validation** against diagnostic S&S transcriptions; original BE3 S&S PDF missing locally.

**Result (AI-assessed):** Both hypotheses partially correct and complementary. A restores writing in Learning Outcomes (9/9); B restores dedicated Writing-column visibility (9/9). Neither alone covers both LO writing goals and strand scanning. Grammar/Functions preserved vs control. Combined A+B justified as next controlled test. No overview approved; methodology not locked; BE2 v2 baseline unchanged.

### BE3 combined A+B experiment (2026-10-13)

**Artifacts:**
- Combined overview: [`experiments/be3-sb-u01-u09-book-overview-d017-exp-ab.md`](./experiments/be3-sb-u01-u09-book-overview-d017-exp-ab.md)
- Three-way comparison (A vs B vs A+B): [`experiments/be3-methodology-a-b-ab-comparison-d017-v1.md`](./experiments/be3-methodology-a-b-ab-comparison-d017-v1.md)
- Owner-review pack: [`experiments/be3-ab-combined-owner-review-d017-v1.md`](./experiments/be3-ab-combined-owner-review-d017-v1.md)

**Controls:** A/B/control and BE2 v2 baseline untouched. Phase 1 only for generation; LO = demonstrable capabilities, Writing = craft/form/task labels (related but not identical wording).

**Result (AI-assessed):** A+B is the only variant covering both writing-in-LO and Writing-column visibility. Grammar/Functions preserved. Moderate intentional LO↔Writing relatedness (no exact duplicates). Denser/wider than B; not automatically superior for every book. **Not accepted**; methodology **not locked**.

### BE3 Unit 1 SS Writing + I Can dry check (2026-10-15)

**Artifact:** [`experiments/be3-u01-ss-writing-ican-dry-check-d017-v1.md`](./experiments/be3-u01-ss-writing-ican-dry-check-d017-v1.md)

**Controls:** Compared existing Control/A/B/A+B Unit 1 cells to companion SS `ss_v1.json` **Writing** + **I can…** only. No overview/prompt/data edits.

**Result (AI-assessed, U1 only):** Control confirms Presentation + Inference gaps. A fixes LO writing metalanguage but not Writing-column visibility. B fixes Writing visibility but not LO metalanguage. **A+B** is the only dual Pass for Unit 1 Writing + I Can. Exact SS wording not preserved (expected under AI-inferred LOs). Does **not** approve A+B book-wide.

### BE3 Unit 2 SS dry check + expansion sample (2026-10-15)

**Artifacts:**
- Unit 2: [`experiments/be3-u02-ss-writing-ican-dry-check-d017-v1.md`](./experiments/be3-u02-ss-writing-ican-dry-check-d017-v1.md)
- Expansion U3/U5/U9: [`experiments/be3-u03-u05-u09-ss-writing-ican-dry-check-d017-v1.md`](./experiments/be3-u03-u05-u09-ss-writing-ican-dry-check-d017-v1.md)

**Controls:** Same Writing + I Can rule vs `ss_v1.json`; no overview edits. Expansion triggered because A+B dual-Passed U1 and U2.

**Result (AI-assessed):** Unit 2 repeats the U1 pattern (A+B only dual Pass). Expansion Units 3, 5, 9 (titles → detail sentences → SVO) also show **A+B only dual Pass**. Sampled 5/9 units; **4/6/7/8 unchecked**. **No book-wide decision.**

### BE3 remaining units + full roll-up (2026-10-15)

**Artifacts:**
- Units 4/6/7/8: [`experiments/be3-u04-u06-u07-u08-ss-writing-ican-dry-check-d017-v1.md`](./experiments/be3-u04-u06-u07-u08-ss-writing-ican-dry-check-d017-v1.md)
- Full roll-up: [`experiments/be3-ss-writing-ican-dry-check-full-roll-up-d017-v1.md`](./experiments/be3-ss-writing-ican-dry-check-full-roll-up-d017-v1.md)
- Owner pack addendum: [`experiments/be3-ab-combined-owner-review-d017-v1.md`](./experiments/be3-ab-combined-owner-review-d017-v1.md) §8

**Result (AI-assessed):** A+B dual-Passes **9/9** units on Writing + writing-I-Can vs `ss_v1.json`. Control/A/B never dual-Pass. **Proceed to owner decision** — no auto-approval, no methodology change, no BE2 v2 change.

### Owner decision — prefer BE3 A+B (2026-10-15)

**Record:** [`../4-decisions.md`](../4-decisions.md) D017 working approvals; [`experiments/be3-ab-combined-owner-review-d017-v1.md`](./experiments/be3-ab-combined-owner-review-d017-v1.md) §9.

| Item | Decision |
|---|---|
| Preferred path | **A+B** |
| Scope | **BE3-SB only** |
| Preferred artifact | [`experiments/be3-sb-u01-u09-book-overview-d017-exp-ab.md`](./experiments/be3-sb-u01-u09-book-overview-d017-exp-ab.md) |
| BE2-SB v2 baseline | Unchanged |
| Methodology / schema | **Not locked** |
| Implementation | None in the decision-recording step |

Control / A / B experiment artifacts remain preserved for comparison history.

### BE3 Unit 1 A+B regen reproducibility (2026-10-15)

**Artifact:** [`experiments/be3-u01-ab-regen-reproducibility-d017-v1.md`](./experiments/be3-u01-ab-regen-reproducibility-d017-v1.md)

**Controls:** Fresh A+B Unit 1 overview from Phase 1 only (S&S not consulted); compared to existing A+B Unit 1 row. Existing book-wide A+B artifact **not edited**.

**Result (AI-assessed):** Non-experimental columns **exact** match. LO and Writing **near-exact** (soft “daily” wording only). Dual writing coverage reproduced. **No methodology/schema/UI change.** Single-unit limit — does not prove U2–U9.

### BE3 Unit 9 A+B regen reproducibility (2026-10-15)

**Artifact:** [`experiments/be3-u09-ab-regen-reproducibility-d017-v1.md`](./experiments/be3-u09-ab-regen-reproducibility-d017-v1.md)

**Controls:** Fresh A+B Unit 9 overview from Phase 1 only (S&S not consulted); compared to existing A+B Unit 9 row. Existing book-wide A+B artifact **not edited**. Book-end pair with U1.

**Result (AI-assessed):** Non-experimental columns **exact** match. Writing **exact**. LO **near-exact** (soft “school trips” vs “trips”). Dual writing coverage reproduced. **No methodology/schema/UI change.** U1+U9 book-end sampling both PASS; still does not prove U2–U8.

### BE3 Unit 5 A+B regen reproducibility (2026-10-15)

**Artifact:** [`experiments/be3-u05-ab-regen-reproducibility-d017-v1.md`](./experiments/be3-u05-ab-regen-reproducibility-d017-v1.md)

**Controls:** Fresh A+B Unit 5 overview from Phase 1 only (S&S not consulted); compared to existing A+B Unit 5 row. Existing book-wide A+B artifact **not edited**. Mid-book sample between U1 and U9.

**Result (AI-assessed):** Non-experimental columns **exact** match. Writing **exact**. LO **near-exact** (soft “about seasons” only). Dual writing coverage reproduced. **No methodology/schema/UI change.** U1+U5+U9 start/mid/end sampling all PASS; still does not prove remaining units.

### BE3 A+B regen reproducibility — full 9/9 roll-up (2026-10-15)

**Artifact:** [`experiments/be3-ab-regen-reproducibility-full-roll-up-d017-v1.md`](./experiments/be3-ab-regen-reproducibility-full-roll-up-d017-v1.md)

**Controls:** Independent A+B regens for remaining U2–U4 / U6–U8 from Phase 1 only; rolled up with prior U1/U5/U9. Discrepancies-only documentation. Existing book-wide A+B artifact **not edited**.

**Result (AI-assessed):** **9/9 PASS**. Drift/Fail **0**. Soft Near paraphrases on 7/9 units (mostly LO wording). U4 and U8 Exact across compared cells. Writing column Exact on U2–U9 (U1 Writing Near only). **No methodology/schema/UI change.**

### BE3 Unit 1 A+B implementation compatibility (2026-10-15)

**Artifact:** [`experiments/be3-u01-ab-implementation-compatibility-d017-v1.md`](./experiments/be3-u01-ab-implementation-compatibility-d017-v1.md)

**Controls:** Read-only check of Unit 1 A+B against Postgres catalog tables (`book_series` / `books` / `book_files` / `dataset_versions`) and live/mock UI contracts (`curriculumService`, Validation `BatchJsonSummary`, Beehive `BookContent` mock). No DB/schema/UI changes.

**Result:** Catalog identity **compatible**. Overview cells must **not** be normalized into Postgres (D006). No live Book Intelligence UI consumer; Writing/CLIL/Values/Phonics have no home in existing types. Controlled path = additive interpretation artifact + future new BI contract — not `BookContent` reuse, not Phase 1 merge.

### Book Intelligence UI data contract — nine-column draft (2026-10-15)

**Artifact:** [`book-intelligence-ui-data-contract-v1.md`](./book-intelligence-ui-data-contract-v1.md)

**Controls:** Documentation-only definition of `column_set: nine_column_ab` — JSON keys, TS names, unit identity, envelope + single-unit slice example (BE3 U1). Explicitly not a methodology/schema lock; no app/DB changes.

**Result:** Named draft contract available for a later controlled Unit 1 JSON/UI step. Writing required; Learning Outcomes provenance default `ai_inferred`. Must not merge into Phase 1 or reuse `BookContent`.

### BE3 Units 1–9 A+B Book Intelligence JSON artifact (2026-10-15)

**Artifact:** [`../../data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json`](../../data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json)

**Controls:** Nine-unit JSON conforming to draft BI UI contract; content from preferred A+B overview Units 1–9. Supersedes the Unit 1-only slice. No Storage registration or Postgres changes.

**Result:** Local experimental interpretation artifact for the read-only preview. Format still **not locked**.

### Book Intelligence TS loader / validator (2026-10-15)

**Artifacts:**
- Types: [`../../app/src/types/bookIntelligence.ts`](../../app/src/types/bookIntelligence.ts)
- Lib: [`../../app/src/lib/bookIntelligence/`](../../app/src/lib/bookIntelligence/)
- CLI: [`../../scripts/validate_book_intelligence_json.mjs`](../../scripts/validate_book_intelligence_json.mjs)

**Controls:** Read-only parse/validate/map (`snake_case` → `camelCase`) for `nine_column_ab`. CLI verifies BE3 U1–9 JSON + field mapping. No DB/Storage.

**Result:** BE3 U1–9 **PASS** (`units=9`); `npm run typecheck` clean. Contract remains draft / not locked.

### BE3 Units 1–9 Book Intelligence UI preview (2026-10-15)

**Artifacts:**
- Preview page: [`../../app/src/features/book-intelligence/`](../../app/src/features/book-intelligence/)
- Route: `/app/book-intelligence` (protected AppShell)
- Storage: `book-datasets` → `big-english/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json`

**Controls:** Read-only UI sketch. Downloads Storage JSON, then `loadBookIntelligenceOverviewFromUnknown`. Loading/error states. Displays all 8 content fields per unit (incl. Writing + LO provenance). No `book_files` / schema / methodology changes.

**Result:** Preview renders all nine A+B unit cards from Storage. Contract still **not locked**.

### BE3 U1–9 BI preview visual/content QA vs A+B overview (2026-10-15)

**Controls:** Cell-by-cell compare of local JSON (`be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json`) against preferred A+B Markdown overview table (markdown italics/bold normalized). Checked completeness (9 units × 8 content fields), titles/pages, Writing present, and `learning_outcomes_provenance: ai_inferred` (UI badge). No overview edits; no DB/Storage.

**Result:** One discrepancy found and fixed — Unit 8 Learning Outcomes had been paraphrased (`and / but / or`); restored to overview wording. Re-check **9/9 PASS**. CLI contract validate PASS (`units=9`).

### BE3 U1–9 BI JSON Storage upload (2026-10-15)

**Artifact:** `book-datasets` → `big-english/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json`  
**Script:** [`../../scripts/upload_book_intelligence_json.mjs`](../../scripts/upload_book_intelligence_json.mjs)

**Controls:** Upload Phase 2 interpretation companion to Supabase Storage only. Download + SHA-256 verify against local file. Explicitly **no** `book_files` / `dataset_versions` writes, no schema migration, no UI wiring (preview still uses Vite local alias).

**Result:** UPLOAD OK; integrity **PASS** (10574 bytes; `units=9`; `sha256=097a145c085287cd53ac009a45602edff15b9ff3cbe160e573824430ef1d5b71`). Format still draft / not locked.

### BE3 U1–9 BI preview wired to Storage (2026-10-15)

**Artifacts:**
- `loadBe3BookIntelligenceFromStorage.ts` + updated `BookIntelligencePreviewPage.tsx`
- Removed local Vite `@bi-be3-ab-json` alias

**Controls:** Switch preview data source from bundled local JSON to verified Storage object. Keep draft-contract loader. Add loading/error UI. No database, schema, or methodology changes.

**Result:** Storage download path verified (9 units, Writing + `ai_inferred` LO on all). App typecheck clean. Preview badge shows `Storage · 9 units`.

---

## 3. Historical research — V3.1 + cross-unit (BE2-SB)

Preserved research artifacts; **not** the active production direction under D017.

| Artifact | Location | Outcome |
|---|---|---|
| BE2 U1 V3.1 | `data/phase2/big_english_2_sb/interpretations/be2-sb-u01-v3.1.json` | Research unit analysis |
| BE2 U6 V3.1 | `data/phase2/big_english_2_sb/interpretations/be2-sb-u06-v3.1.json` | Research unit analysis |
| BE2 U8 V3.1 | `data/phase2/big_english_2_sb/interpretations/be2-sb-u08-v3.1.json` | Research unit analysis |
| Cross-unit V1.1 | `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.1.json` | Historical consolidation shape |
| Cross-unit V1.2 | `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.2.json` | Connections-only research run (8 multi-unit links) |

---

## 4. Historical research — early LR experiments

| Experiment ID | Focus | Artifact | Outcome (summary) |
|---|---|---|---|
| `P2-EXP-BE2-U06-v1` | BE2 U6 relationships | [`p2-exp-be2-u06-v1-review.md`](./p2-exp-be2-u06-v1-review.md) | Prior/future candidates + evidence discipline |
| `P2-EXP-BE2-U06-v2` | BE2 U6 learning requirements | [`p2-exp-be2-u06-v2-review.md`](./p2-exp-be2-u06-v2-review.md) | Observable LR method established |
| `P2-EXP-BE2-U07-v1` | BE2 U7 LRs + generalization | [`p2-exp-be2-u07-v1-review.md`](./p2-exp-be2-u07-v1-review.md) | Method reusable with unit-native adaptations |
| `P2-EXP-BE2-U08-v1` | BE2 U8 LRs + three-unit compare | [`p2-exp-be2-u08-v1-review.md`](./p2-exp-be2-u08-v1-review.md) | D016 candidate set LR runs complete |
| `P2-EXP-BE1-U01-v1` | BE1 U1 LR transfer test | [`p2-exp-be1-u01-v1-review.md`](./p2-exp-be1-u01-v1-review.md) | Method transfers to beginner unit |

---

## 5. Historical research — later-phase influence probes

| Experiment ID | Focus | Artifact | Outcome (summary) |
|---|---|---|---|
| `P2-EXP-BE2-U06-E2E-v1` | Teacher brief A/B | [`p2-exp-be2-u06-e2e-v1/`](./p2-exp-be2-u06-e2e-v1/) | Curriculum-informed brief modestly more useful |
| `P4-EXP-BE2-U06-ENRICH-v1` | Enrichment A/B | [`../phase-4/p4-exp-be2-u06-enrich-v1/`](../phase-4/p4-exp-be2-u06-enrich-v1/) | Phase 2 did not change the three enrichment decisions |

---

## 6. What carries forward

- Verified Phase 1 Big English datasets (local / Storage).
- BE2 D017 **v2** provisional working baseline; BE2 **v1** preserved; BE1/BE3/BE5 experimental overviews awaiting owner review.
- Vertical sufficiency probe: coarse progression signals exist; Series Intelligence may proceed experimentally without Phase 3 lock.
- Research artifacts above as evidence, not mandatory production depth.
- Parked Phase 1 extraction ideas: F017 / F018 in [`../7-future.md`](../7-future.md).

---

## 7. Explicit non-claims

- Phase 2 is **not** product-complete.
- No Phase 2 JSON schema or pipeline is approved.
- Owner approval of BE2 v2 as a **working baseline** does **not** lock format, methodology, or schema.
- BE1/BE3 overviews are **not** accepted until owner review.
- Vertical sufficiency probe is **not** Phase 3 implementation.
- Historical V3.1 / V1.2 success does **not** lock methodology or define production output.
- Phase 3 / Phase 4 are **not** formally started.
- D018 (if discussed) remains **PROPOSED only**.
- F017 / F018 are **PARKED** — not approved for implementation.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | Created preservation snapshot before pushing `phase-2` and branching `phase-3`. |
| 2026-10-11 | Expanded to V3.1 + cross-unit lineage; linked validation status; kept early LR experiments as history. |
| 2026-10-11 | Recorded true Cross-Unit V1.2 connections JSON after owner update (replacing earlier mislabeled duplicate). |
| 2026-10-12 | Aligned to D017 Progressive Curriculum Intelligence; V3.1/V1.2/e2e/enrich marked research history; next proposed = BE2-SB U1–9 book overview (awaiting approval). |
| 2026-10-12 | Executed BE2-SB U1–9 D017 v1 book overview experiment; status → completed / awaiting owner review. |
| 2026-10-12 | Recorded ChatGPT owner review findings; overview not accepted; next proposed = publisher overview comparison (~90% coverage target, non-binding). |
| 2026-10-13 | Executed D017 v2 second pass + publisher S&S comparison; U3/U6/U8 gaps corrected; v2 not accepted; awaiting owner review. |
| 2026-10-13 | Owner approved v2 as provisional Book Intelligence working baseline; format/methodology/schema still not locked; F017/F018 parked. |
| 2026-10-13 | BE1/BE3 overviews + BE1→BE2→BE3 vertical sufficiency probe executed; awaiting owner review; not a Phase 3 start. |
| 2026-10-13 | BE3 diagnostic vs publisher S&S: Writing presentation + LO inference gaps confirmed; recommend Test BE5 unchanged before refine. |
| 2026-10-13 | BE5 unchanged baseline overview generated; publisher S&S unavailable; diagnostic deferred. |
| 2026-10-13 | BE3 Step 3 A/B refine + partial publisher-reference comparison; both hypotheses complementary; combined A+B suggested; await owner review. |
| 2026-10-13 | BE3 combined A+B overview + three-way comparison + owner-review pack; dual writing coverage with density trade-off; stop for owner review of A/B/A+B. |
| 2026-10-15 | Owner decision: prefer BE3 A+B for BE3-SB only; methodology/schema not locked; BE2 v2 unchanged. |
| 2026-10-15 | BE3 Unit 1 A+B independent regen vs existing A+B — reproducibility PASS (near-exact); no overview edits. |
| 2026-10-15 | BE3 Unit 9 A+B independent regen vs existing A+B — reproducibility PASS (Writing exact; LO near-exact); book-end pair with U1. |
| 2026-10-15 | BE3 Unit 5 A+B independent regen vs existing A+B — reproducibility PASS (Writing exact; LO near-exact); mid-book with U1/U9. |
| 2026-10-15 | BE3 A+B regen full 9/9 roll-up (remaining U2–U4/U6–U8); all PASS; soft Near only; no overview edits. |
| 2026-10-15 | BE3 Unit 1 A+B controlled-implementation compatibility assessment (read-only); catalog OK; UI consumer gap; no DB/UI changes. |
| 2026-10-15 | Draft nine-column Book Intelligence UI data contract (fields/types/identity/JSON); docs only; not locked. |
| 2026-10-15 | Created BE3 Unit 1 A+B Book Intelligence JSON artifact conforming to draft contract; no UI/DB changes. |
| 2026-10-15 | Added read-only TS Book Intelligence loader/validator + CLI; BE3 U1 PASS; no UI/DB. |
| 2026-10-15 | Added read-only BE3 Unit 1 BI UI preview (`/app/book-intelligence`); local JSON + loader; no DB/Storage. |
| 2026-10-15 | Extended BI JSON + preview to BE3 Units 1–9 A+B; CLI PASS units=9; no DB/Storage. |
| 2026-10-15 | Visual/content QA of BI preview vs A+B overview; fixed U8 LO only; 9/9 PASS. |
| 2026-10-15 | Uploaded BE3 U1–9 BI A+B JSON to `book-datasets` interpretations path; SHA-256 verified; no DB/UI. |
| 2026-10-15 | BI preview loads Storage JSON via existing loader; loading/error states; local Vite alias removed. |
