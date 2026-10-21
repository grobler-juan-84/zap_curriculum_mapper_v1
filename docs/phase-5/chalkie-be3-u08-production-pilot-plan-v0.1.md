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
| **130–131** | Story + Reading (`story` · `reading_comprehension`) | An Unhealthy Dinner | Listen/read story; understand why the dinner was unhealthy | No dedicated/current models | Thin (2) | Yes (p.128) | Ready | Companion **ACCEPTED** SB→WB **p.106 only** (`be3_sb_wb_rel_u08_story_sb130-131_wb106`); 106–107 pair rejected; series handoff **not** enabled — [`chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md`](./chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md) · [`chalkie-be3-u08-sb-wb-component-map-v0.1.md`](./chalkie-be3-u08-sb-wb-component-map-v0.1.md) | Companion recorded; Single Lesson or separate series-handoff approval next |
| **132–133** | Language in Action (`grammar_practice`) | Asking About Yesterday / Did…? practice | Ask and answer about past activities using Did…? and short answers | Yes (5 activity models) | Yes (5) | Yes (p.128) | Ready | **Exp 11–13**; Exp 13 preferred combined-input result | **No immediate repeat** |
| **134–135** | Content Connection \| P.E. (`clil_pe` · `clil_pe_project`) | What Is a Calorie? | Read about calories / healthy activity; good vs bad for the body | Yes (9 dedicated) | Yes (6) | Yes (p.128) | Ready | **Exp 14** strong non-grammar transfer | **No immediate repeat** |
| **136–137** | Grammar (`grammar`) | Regular/irregular past about yesterday | Use regular and irregular past-tense verbs about yesterday | Yes (17 activity models) | Yes (5) | Yes (p.128, p.134) | Ready | **Exp 10** Lesson Series operational pilot: raw CONDITIONAL FAIL → PASS AFTER TEACHER REVIEW | **No immediate repeat** (already teacher-reviewed; different series mode) |
| **138–139** | Culture Connection \| Around the World (`culture` · `culture_activities`) | Strange Sports | Read Strange Sports; talk about the ideas | Yes (9 dedicated) | Yes (4) | Yes (p.128, p.134) | Ready | **None documented** | Eligible later in the unit sequence |
| **140** | Writing \| Combining Sentences… (`writing`) | Combining Sentences with and, but, or | *(null from local focus lanes)* | No dedicated | Yes (4) | Yes | Ready (single page) | None | **Wait** — single-page; not a two-page spread |
| **141** | Phonics \| all, au, aw (`phonics`) | all, au, aw | *(null)* | Yes (3) | Yes (4) | Yes | Ready (single page) | None | **Wait** — single-page |
| **142** | Values \| Get exercise. (`values_project`) | Get exercise. | *(null)* | No dedicated | Yes (3) | Yes | Ready (single page) | None | **Wait** — single-page |
| **143** | Review (`review_self_assessment`) | Review / self-assessment Unit 8 | Practise regular and irregular past forms (local) | Yes (6 models) | Yes (3) | Yes | Ready (single page) | None | **Wait** — single-page; end-of-unit review |

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

### Later eligible (after first pilot)

1. **pp.130–131** Story / Reading — curated companion to **WB p.106 only** (series package off). Ready as Single Lesson, or owner may later approve a story series handoff.  
2. **pp.138–139** Culture *Strange Sports* — ready with dedicated vocab; natural mid/late-unit production candidate.

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

Content review **ACCEPTED** one curated pairing: SB pp.128–129 → WB pp.104–105 (`be3_sb_wb_rel_u08_opener_sb128-129_wb104-105`). See [`chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md`](./chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md).

Local two-lesson handoff (six copyables) is **built** for this pair only via `buildBe3U08OpenerSbWbSeriesHandoff.ts`. Unmapped BE3 spreads still have no series.

**Production pilot results (2026-10-21):** first successful SB→WB two-lesson run — **PASS AFTER LIGHT TEACHER REVIEW**. Exports: L1 30 PDF pages · L2 31 PDF pages. One contained Chalkie-generation short-answer fix (`Yes, did / No, didn't.` → `Yes, he/she did. / No, he/she didn't.`). Full record: [`chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md`](./chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md). **No further generation authorized by that record.**

---

## 9. Next owner action

**Next owner action (choose one):**

1. Authorize (or decline) a **single-lesson** Chalkie generation for **pp. 130–131** (*An Unhealthy Dinner*) or **pp. 138–139**; or  
2. Authorize content review of a **different** explicit SB→WB candidate (not 130–131→106–107) — do not broaden pairing rules.

Until explicitly authorized, **do not generate**.
