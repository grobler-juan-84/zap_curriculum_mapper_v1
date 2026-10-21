# Chalkie BE3 Unit 8 — Production Pilot Plan (v0.1)

**Status:** PRODUCTION PILOT PLAN / **ACTIVE** / first SB→WB pair **COMPLETED** (see results) / **NO FURTHER GENERATION AUTHORIZED**  
**Date:** 2026-10-20 (results note 2026-10-21)  
**Scope:** Big English 3 Student Book · Unit 8 *Healthy Living* · printed pages **128–143** only  
**Catalog / local refs:** `big_english_3_sb` · unit `big_english_3_sb_unit_08`

**Evidence base:** Phase 1 canonical `data/phase1/big_english_3_sb/canonical/v1.json` + local Chalkie resolve (`resolveChalkieLessonContext`) on the unit slice. Experimental history from Exp 10–14 docs only.

**Related:**  
[`chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md`](./chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md) ·  
[`p5-prototype-chalkie-workspace.md`](./p5-prototype-chalkie-workspace.md) ·  
[`chalkie-single-lesson-experiments-11-13-results-v0.1.md`](./chalkie-single-lesson-experiments-11-13-results-v0.1.md) ·  
[`chalkie-single-lesson-experiment-14-results-v0.1.md`](./chalkie-single-lesson-experiment-14-results-v0.1.md) ·  
[`chalkie-operational-pilot-be3-u08-grammar-p136-137-handoff-design-v0.1.md`](./chalkie-operational-pilot-be3-u08-grammar-p136-137-handoff-design-v0.1.md) ·  
[`../phase-6/chalkie-interface-and-generation-workflow.md`](../phase-6/chalkie-interface-and-generation-workflow.md) ·  
[`chalkie-provisional-handoff-template-v0.1.md`](./chalkie-provisional-handoff-template-v0.1.md)

---

## 1. Purpose

This is **not** another prompt-format experiment. It asks whether the existing local Chalkie Workspace can support a **small, repeatable production run** across one complete Student Book unit, using the **unchanged** provisional preferred Single Lesson workflow (Exp 13/14).

**Beauty in Simplicity:** no new scores, automation layers, or methodology gates. Teacher review remains required. Optional **Ask Chalkie** stays post-generation only.

**Packaging preference (docs only, 2026-10-21):** provisional **two-lesson-first** Chalkie generation policy — prefer two lessons; with a verified WB companion use L1 = SB / L2 = WB; without a companion, two honest SB-only lessons are allowed. See [`../phase-6/chalkie-interface-and-generation-workflow.md`](../phase-6/chalkie-interface-and-generation-workflow.md) §1A. This plan’s coverage table and “single lesson likely” historical notes do not override that preference, and do **not** authorize generation.

**This document does not authorize generation.**

---

## 2. Provisional workflow (unchanged)

1. Copy or enter the lesson title.  
2. Paste the complete detailed handoff.  
3. Append the concise teacher-controlled outline in the **same** initial Chalkie input box.  
4. Do **not** click Chalkie’s `Create outline`.  
5. Enter the prepared vocabulary manually during Refine.  
6. Leave unwanted suggestions and optional resources unselected.  
7. Generate.  
8. Teacher-review grammar, answers, reveals, attribution, publisher-like inventions, AI-image text, timing and book-work placement.  
9. Optionally use Ask Chalkie on a specific questionable slide.  
10. Teacher approves the final wording.

---

## 3. How “legitimate two-page spreads” were defined

Canonical pages 128–143 were listed with `section_title` / `section_type` / `page_heading`. A **legitimate two-page lesson spread** for this pilot is a facing pair that forms one continuous teaching component (same section family across both pages).

**Not treated as one two-page lesson:** Writing (p.140) + Phonics (p.141); Values (p.142) + Review (p.143). Those are **adjacent single-page components** and wait for a later single-page (or explicitly scoped) decision.

---

## 4. Unit 8 coverage map

Legend for readiness columns (from local resolve on the full unit summary):

| Column | Meaning |
| --- | --- |
| Words/models | Current-page dedicated vocab and/or activity-derived models |
| Activities | Visible activity lines / outline activities present |
| Prior | Same-unit earlier `[PRIOR]` vocabulary suggestion available |
| Handoff | Local resolve `status === ready` (four-artifact path can open) |

| Pages | Section / type | Topic or best label | Teaching focus (local) | Words/models | Activities | Prior | Handoff | Experimental history | Pilot status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **128–129** | Vocabulary + Song / Vocabulary (`vocabulary` · `song_vocabulary`) | Healthy and unhealthy activities · Live Right! | Learn and use the phrases for Healthy and unhealthy activities; then Did…? short answers | Yes (8 dedicated) | Yes (5) | None (unit opener) | Ready | **SB→WB series pilot COMPLETE** — [`chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md`](./chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md) | **Done (SB→WB series)** — PASS AFTER LIGHT TEACHER REVIEW |
| **130–131** | Story + Reading (`story` · `reading_comprehension`) | An Unhealthy Dinner | Listen/read story; understand why the dinner was unhealthy | No dedicated/current models | Thin (2) | Yes (p.128) | Ready | Companion **ACCEPTED** SB→WB **p.106 only** + asymmetric series handoff **ACCEPTED FOR PROVISIONAL USE** (`be3_sb_wb_rel_u08_story_sb130-131_wb106`); 106–107 pair rejected — [`chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md`](./chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md) · [`chalkie-be3-u08-sb-wb-component-map-v0.1.md`](./chalkie-be3-u08-sb-wb-component-map-v0.1.md) | **Done (local handoff)** — provisional use; no Story Chalkie export claimed; no further Story Chalkie experiments now |
| **132–133** | Language in Action (`grammar_practice`) | Asking About Yesterday / Did…? practice | Ask and answer about past activities using Did…? and short answers | Yes (5 activity models) | Yes (5) | Yes (p.128) | Ready | **Exp 11–13**; SB→WB companion **ACCEPTED** docs-only (`be3_sb_wb_rel_u08_lia_sb132-133_wb107-108`) — [`chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md`](./chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md) | Companion recorded (docs); handoff/Chalkie **not** authorized |
| **134–135** | Content Connection \| P.E. (`clil_pe` · `clil_pe_project`) | What Is a Calorie? | Read about calories / healthy activity; good vs bad for the body | Yes (9 dedicated) | Yes (6) | Yes (p.128) | Ready | **Exp 14**; SB→WB companion **ACCEPTED** docs-only (`be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110`) — [`chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md`](./chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md) | Companion recorded (docs); handoff/Chalkie **not** authorized |
| **136–137** | Grammar (`grammar`) | Regular/irregular past about yesterday | Use regular and irregular past-tense verbs about yesterday | Yes (17 activity models) | Yes (5) | Yes (p.128, p.134) | Ready | **Exp 10**; SB→WB companion **ACCEPTED** docs-only (`be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112`) — [`chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md`](./chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md) | Companion recorded (docs); handoff/Chalkie **not** authorized |
| **138–139** | Culture Connection \| Around the World (`culture` · `culture_activities`) | Strange Sports | Read Strange Sports; talk about the ideas | Yes (9 dedicated) | Yes (4) | Yes (p.128, p.134) | Ready | SB→WB companion **ACCEPTED** docs-only (`be3_sb_wb_rel_u08_culture_sb138-139_wb113-114`) — [`chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md`](./chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md) | Companion recorded (docs); handoff/Chalkie **not** authorized |
| **140** | Writing \| Combining Sentences… (`writing`) | Combining Sentences with and, but, or | *(null from local focus lanes)* | No dedicated | Yes (4) | Yes | Ready (single page) | SB→WB companion **ACCEPTED** docs-only 1→1 (`be3_sb_wb_rel_u08_writing_sb140_wb115`); generation prefers two-lesson-first (L1 SB → L2 WB) | Companion recorded (docs); handoff/Chalkie **not** authorized |
| **141** | Phonics \| all, au, aw (`phonics`) | all, au, aw | *(null)* | Yes (3) | Yes (4) | Yes | Ready (single page) | SB→WB companion **ACCEPTED** docs-only 1→1 (`be3_sb_wb_rel_u08_phonics_sb141_wb116`); generation prefers two-lesson-first (L1 SB → L2 WB) | Companion recorded (docs); handoff/Chalkie **not** authorized |
| **142** | Values \| Get exercise. (`values_project`) | Get exercise. | *(null)* | No dedicated | Yes (3) | Yes | Ready (single page) | **SB-ONLY CONFIRMED** — no WB Values page; two SB-only lessons allowed if generated | **SB-only** — no companion expected |
| **143** | Review (`review_self_assessment`) | Review / self-assessment Unit 8 | Practise regular and irregular past forms (local) | Yes (6 models) | Yes (3) | Yes | Ready (single page) | SB→WB companion **ACCEPTED** docs-only 1→1 (`be3_sb_wb_rel_u08_review_sb143_wb117`); generation prefers two-lesson-first (L1 SB → L2 WB) | Companion recorded (docs); handoff/Chalkie **not** authorized |

**Do not force-pair** 140–141 or 142–143 as one Chalkie Single Lesson under this pilot.

---

## 5. Sequencing recommendation

### Already tested — no immediate repeat

| Spread | Why skip for now |
| --- | --- |
| pp.132–133 | Exp 11–13; preferred path already demonstrated |
| pp.134–135 | Exp 14; non-grammar transfer already demonstrated |
| pp.136–137 | Exp 10 closed (Lesson Series + teacher correction). Do not re-run unless the owner later wants a **Single Lesson** preferred-path transfer on Grammar |

### First production-pilot spread (completed as SB→WB series)

**BE3 SB Unit 08 pp. 128–129 — Vocabulary / Song** (+ WB pp. 104–105)  
Stable refs: `be3-sb-u08-p128-129` · series `be3-sb-wb-u08-p128-129-wb104-105`

**Outcome:** first SB→WB two-lesson production pilot — **PASS AFTER LIGHT TEACHER REVIEW**. See [`chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md`](./chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md). Further generation not authorized by that record.

### Story handoff closed for Chalkie testing (local provisional)

**pp.130–131** Story / Reading → WB **p.106 only**: local asymmetric series handoff **ACCEPTED FOR PROVISIONAL USE**. No further Story Chalkie experiments required now. Does **not** claim a Chalkie export or classroom validation for this route.

### LiA companion recorded (docs only)

**pp.132–133** Language in Action → WB **107–108**: companion **ACCEPTED** (`be3_sb_wb_rel_u08_lia_sb132-133_wb107-108` · ref `be3-sb-wb-u08-p132-133-wb107-108`). Not wired in app; no series handoff; no Chalkie generation. Exp 11–13 Single Lesson history remains **no immediate Chalkie repeat**.

### CLIL P.E. companion recorded (docs only)

**pp.134–135** Content Connection / P.E. → WB **109–110**: companion **ACCEPTED** (`be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110` · ref `be3-sb-wb-u08-p134-135-wb109-110`). Not wired in app; no series handoff; no Chalkie generation. Exp 14 Single Lesson history remains **no immediate Chalkie repeat**.

### Grammar companion recorded (docs only)

**pp.136–137** Grammar → WB **111–112**: companion **ACCEPTED** (`be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112` · ref `be3-sb-wb-u08-p136-137-wb111-112`). Not wired in app; no series handoff; no Chalkie generation. Exp 10 Lesson Series history remains **no immediate Chalkie repeat**.

### Culture companion recorded (docs only)

**pp.138–139** Culture Connection → WB **113–114**: companion **ACCEPTED** (`be3_sb_wb_rel_u08_culture_sb138-139_wb113-114` · ref `be3-sb-wb-u08-p138-139-wb113-114`). Not wired in app; no series handoff; no Chalkie generation.

### Writing companion recorded (docs only, 1→1)

**p.140** Writing → WB **p.115**: companion **ACCEPTED** (`be3_sb_wb_rel_u08_writing_sb140_wb115` · ref `be3-sb-wb-u08-p140-wb115`). Recommended future packaging: **single lesson likely** (not a two-lesson series by default). Not wired in app; no handoff; no Chalkie generation.

### Phonics companion recorded (docs only, 1→1)

**p.141** Phonics → WB **p.116**: companion **ACCEPTED** (`be3_sb_wb_rel_u08_phonics_sb141_wb116` · ref `be3-sb-wb-u08-p141-wb116`). Recommended future packaging: **single lesson likely**. Not wired in app; no handoff; no Chalkie generation.

### Review companion recorded (docs only, 1→1)

**p.143** Review → WB **p.117**: companion **ACCEPTED** (`be3_sb_wb_rel_u08_review_sb143_wb117` · ref `be3-sb-wb-u08-p143-wb117`). Packaging: **single lesson likely**. Not wired; no handoff; no Chalkie generation.

### Values SB-only confirmed

**p.142** Values · *Get exercise.*: **SB-ONLY CONFIRMED** — no Workbook Values page in Unit 8; **SB-only component — no companion expected** (not a mapping failure).

### Unit 8 map status

Component-map content review is **complete**. Next work is owner-gated app wiring of docs-accepted companions (not more map rows).

### Wait / out of this two-page pilot wave

- **pp.140, 141, 142, 143** as singles (and any forced 140–141 / 142–143 pair).  
- Incomplete teaching-focus lanes on Writing / Phonics / Values singles (`teachingFocus` null) — not blockers for resolve `ready`, but not first-wave production targets.

---

## 6. Production-pilot success checks (practical, not scored)

For each authorized run, record only:

- Final Chalkie title vs local title.  
- Export filename + requested slides + PDF page count.  
- Whether book work stayed support (not replacement).  
- Teacher corrections required (must / should / optional).  
- Whether Ask Chalkie was used (optional note).

No new rubric. No D018 re-score.

---

## 7. Boundaries

- Docs / evidence audit only.  
- No application code changes in this plan.  
- No Chalkie generation authorized here.  
- No OpenAI/API generation.  
- No expansion beyond BE3 SB Unit 8.  
- No D018 or `4-decisions.md` edits.  
- No permanent methodology lock.  
- No classroom-validation claim.

---

## 8. SB→WB series note

**Opener:** Content review **ACCEPTED** SB pp.128–129 → WB pp.104–105 (`be3_sb_wb_rel_u08_opener_sb128-129_wb104-105`). Local six copyables via `buildBe3U08OpenerSbWbSeriesHandoff.ts`. Production pilot **PASS AFTER LIGHT TEACHER REVIEW** — [`chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md`](./chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md). No further opener generation authorized by that record.

**Story:** Content review **ACCEPTED** SB pp.130–131 → WB **p.106 only** (`be3_sb_wb_rel_u08_story_sb130-131_wb106`). Local asymmetric six copyables via `buildBe3U08StorySbWbSeriesHandoff.ts`. Handoff **ACCEPTED FOR PROVISIONAL USE** (2026-10-21) — local workflow only; **no** Story Chalkie export or classroom-validation claim; **no** further Story Chalkie experiments now. See [`chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md`](./chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md).

**Language in Action:** Content review **ACCEPTED** SB pp.132–133 → WB pp.107–108 (`be3_sb_wb_rel_u08_lia_sb132-133_wb107-108` · ref `be3-sb-wb-u08-p132-133-wb107-108`). Docs mapping only — **not** in curated companion code; **no** series handoff; **no** Chalkie generation.

**Content Connection / P.E.:** Content review **ACCEPTED** SB pp.134–135 → WB pp.109–110 (`be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110` · ref `be3-sb-wb-u08-p134-135-wb109-110`). Docs mapping only — **not** in curated companion code; **no** series handoff; **no** Chalkie generation.

**Grammar:** Content review **ACCEPTED** SB pp.136–137 → WB pp.111–112 (`be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112` · ref `be3-sb-wb-u08-p136-137-wb111-112`). Docs mapping only — **not** in curated companion code; **no** series handoff; **no** Chalkie generation.

**Culture Connection:** Content review **ACCEPTED** SB pp.138–139 → WB pp.113–114 (`be3_sb_wb_rel_u08_culture_sb138-139_wb113-114` · ref `be3-sb-wb-u08-p138-139-wb113-114`). Docs mapping only — **not** in curated companion code; **no** series handoff; **no** Chalkie generation.

**Writing:** Content review **ACCEPTED** SB p.140 → WB p.115 (`be3_sb_wb_rel_u08_writing_sb140_wb115` · ref `be3-sb-wb-u08-p140-wb115`). Docs mapping only (1→1); recommended packaging **single lesson likely**; **not** in curated companion code; **no** handoff; **no** Chalkie generation.

**Phonics:** Content review **ACCEPTED** SB p.141 → WB p.116 (`be3_sb_wb_rel_u08_phonics_sb141_wb116` · ref `be3-sb-wb-u08-p141-wb116`). Docs mapping only (1→1); recommended packaging **single lesson likely**; **not** in curated companion code; **no** handoff; **no** Chalkie generation.

**Review:** Content review **ACCEPTED** SB p.143 → WB p.117 (`be3_sb_wb_rel_u08_review_sb143_wb117` · ref `be3-sb-wb-u08-p143-wb117`). Docs mapping only (1→1); packaging **single lesson likely**; **not** in curated companion code; **no** handoff; **no** Chalkie generation.

**Values:** **SB-ONLY CONFIRMED** for SB p.142 (*Get exercise.*) — no WB Values page; no companion expected.

Unmapped BE3 spreads still have no series in app (docs-accepted companions not wired except opener/story). Preferred Chalkie use (if later authorized elsewhere): detailed handoff + appended concise outline + scoped vocabulary + teacher review as final safeguard.

---

## 9. Next owner action

**Next owner action:** wire one or more docs-accepted Unit 8 companions into app curated data (smallest safe batch). Do not build new handoffs or authorize Chalkie without a separate step. Unit 8 component-map content review is **complete**.

Until explicitly authorized for a *different* route, **do not generate**.
