# Chalkie Provisional Handoff Template (v0.1)

**Status:** DRAFT / EXPERIMENTAL / **NOT A METHODOLOGY LOCK** / **DOES NOT AUTHORIZE GENERATION**  
**Date:** 2026-10-19  
**Evidence base:** Chalkie diagnostic Experiments **5**–**9** + operational Pilot Experiment **10** (BE3 U8 Grammar)  
**Usability check:** [`chalkie-provisional-handoff-template-be2-u05-lia-retrofill-v0.1.md`](./chalkie-provisional-handoff-template-be2-u05-lia-retrofill-v0.1.md)  
**Vocab-allocation:** Exp 8 confound + Exp 9 control — [`chalkie-transfer-be3-u03-lia-p40-41-experiment-design-v0.1.md`](./chalkie-transfer-be3-u03-lia-p40-41-experiment-design-v0.1.md) §9.3 · [`chalkie-transfer-be3-u03-lia-p40-41-vocab-split-runcard-v0.1.md`](./chalkie-transfer-be3-u03-lia-p40-41-vocab-split-runcard-v0.1.md)  
**Source-fidelity gate + teacher-in-the-loop:** Exp 10 dual-stage (raw CONDITIONAL FAIL → PASS AFTER TEACHER REVIEW) — [`chalkie-operational-pilot-be3-u08-grammar-p136-137-handoff-design-v0.1.md`](./chalkie-operational-pilot-be3-u08-grammar-p136-137-handoff-design-v0.1.md) §6  
**Evidence synthesis:** [`chalkie-experiments-1-9-evidence-synthesis-v0.1.md`](./chalkie-experiments-1-9-evidence-synthesis-v0.1.md)  
**Single Lesson Exp 11–13 results:** [`chalkie-single-lesson-experiments-11-13-results-v0.1.md`](./chalkie-single-lesson-experiments-11-13-results-v0.1.md) (provisional preferred: detailed handoff + appended concise outline; do not click `Create outline`)  
**Related:** [`chalkie-outline-context-retention-diagnostic-v0.1.md`](./chalkie-outline-context-retention-diagnostic-v0.1.md) · [`../phase-6/chalkie-interface-and-generation-workflow.md`](../phase-6/chalkie-interface-and-generation-workflow.md)

---

## 1. Pattern (provisional)

```text
Detailed initial curriculum handoff
        +
Concise teacher-controlled outline (per lesson)
        +
Explicit vocabulary selection (per lesson)
```

Working experimental preference only. Teacher review remains required after every generation.

**Working finding (Exp 8–9):** lesson-specific vocabulary chips materially influence what Chalkie treats as teachable content per lesson. Per-lesson allocation remains part of this provisional pattern (practical evidence, not absolute causal proof).

**Teacher-in-the-loop (Exp 10):** AI starting point → teacher review → bounded factual correction → usable lesson. Occasional errors are expected; teacher review is a deliberate production stage (**Beauty in Simplicity** — thorough but practical). Distinguish **must correct** / **should improve** / **optional refinement**. Aspirational 90–100% starting-point quality is **not** a measured claim.

---

## 2. Detailed initial handoff (fill-in)

```text
TITLE / TOPIC: […]
LESSON IDENTITY: [Book · Unit · Title]
EXACT PAGE SCOPE: [e.g. SB pp. __–__ / WB pp. __–__] — only these pages
SOURCE LABELS: [SS] · [SB] · [WB] · [SUPPLEMENTARY] (omit unused; keep distinguishable)

VERIFIED FLOOR CONTENT:
- Target frames / structures: …
- Book activities to support: …
- Scoped words / models used on these pages: …

LESSON ALLOCATION:
- Lesson 1: …
- Lesson 2: …

EXCLUSIONS: [later unit pages, other books, BI/HM unless authorized, invented publisher content]

SAFEGUARDS:
- Do not invent official audio scripts, lyrics, sticker keys, or unknown answer keys.
- Direct the teacher to the official book/audio/stickers when item text is unknown.
- Never convert frequency adverbs (or similar vague quantifiers) into fixed percentages or weekly counts unless the source explicitly does so.
- Do not place generated definitions, examples, answer challenges, charts, or illustrations under an [SB]/[SS]/[WB] label — use [SUPPLEMENTARY].
- A book activity’s verified vocabulary does not make generated sentences [SB].
- Generated representations of textbook activities must look supplementary and must not resemble publisher evidence.
- Unsupported answer reveals are prohibited even when the surrounding activity is correctly cited.

PROTECTED TEXTBOOK WORK: reserve real Student Book / Workbook working time; slides support, not replace. Prefer moving book work earlier when generated preliminaries risk consuming the lesson. “Open the book early” is insufficient if the substantial book activity is still delayed by excessive generated practice.
```

---

## 3. Concise teacher-controlled outline (per lesson)

**Not a slide-by-slide script.** Prescribe sequence and textbook integration only.  
Include all six beats below; **order may adjust** so protected textbook time is not delayed by optional speaking or generated preliminaries (e.g. retrieve → model → guided → book work → communicative → check).

```text
1. Short activation or retrieve
2. Model (target frames; label [SB]/[SUPPLEMENTARY] correctly)
3. Guided practice
4. Purposeful communicative use (light, natural)
5. Protected textbook time (named pages + official audio/stickers if required)
6. Short final check
```

---

## 4. Explicit vocabulary (required) — per-lesson allocation

```text
VOCABULARY — Lesson 1 (manual Chalkie entry, comma-separated): …
VOCABULARY — Lesson 2 (manual Chalkie entry, comma-separated): …
```

Include **only** words justified by each lesson’s **intended focus** within the scoped pages. Do **not** dump broader unit vocabulary merely because it appears elsewhere in the unit.

**Required:** allocate vocabulary **separately per lesson**, aligned to that lesson’s focus. Do **not** default to pasting the same combined list into both lessons.

**Why:** Experiment 8 showed an identical combined list is a **vocabulary-allocation confound**. Experiment 9’s L1-chores / L2-frequency split produced the intended lesson separation (convincing practical evidence vs Exp 8; not absolute causal proof).

Retrieval of already-taught words may happen orally or via the Student Book without re-entering the full prior list, unless the teacher deliberately wants reteaching.

---

## 5. Fixed settings + run record

| Setting | Record |
| --- | --- |
| Mode | Lesson Series / Single Lesson |
| Lessons | e.g. 2 |
| Requested slides | e.g. 25 per lesson |
| Duration | e.g. ≈40 min/lesson including textbook work |
| Framework | e.g. Chalkie Default |
| Theme | e.g. Simple |
| Grade / ability | e.g. Grade 3 / Grade 2 |
| Audio activities | usually **OFF** for textbook-audio-dependent lessons |

Align **title**, **initial handoff**, and **outline bodies** before Generate.

```text
RUN RECORD (after export):
- Lesson 1 export filename / requested slides / exported PDF pages: …
- Lesson 2 export filename / requested slides / exported PDF pages: …
```

Exported PDF pages may include reveal states and are **not** equivalent to planned slides.

---

## 6. Quality checklist

**Pre-generation**

- [ ] Title / initial prompt / outline bodies aligned (no conflicting topic residue)
- [ ] Exact page scope + exclusions stated
- [ ] Floor frames and book activities match verified evidence
- [ ] Vocabulary chips = per-lesson allocation only (lists match each lesson’s focus; not an identical combined dump)
- [ ] Settings recorded (§5)

**Post-generation**

- [ ] Scope held; no unit/page drift
- [ ] Provenance labels not fused into unmarked “facts”
- [ ] Generated definitions / examples / charts / challenges labelled `[SUPPLEMENTARY]` (not `[SB]`/`[SS]` unless verbatim verified)
- [ ] No invented official audio, lyrics, sticker keys, unknown answers, or invented frequency→days/percentage scales
- [ ] Protected textbook work not displaced by generated filler; substantial book activities not delayed behind long preliminaries
- [ ] Definitions / matching / quizzes / answer reveals = **optional support only**
- [ ] Run record completed (§5); PDF page count interpreted with reveal caution
- [ ] **Hard source-fidelity gate (Exp 10):** Every slide that answers, interprets, or visually reconstructs a textbook or official-audio activity has been checked against verified source evidence. If the verified answer was **not** deliberately supplied to the generator, the slide directs teacher/students to the official book/audio and does **not** provide an answer reveal. Generated visuals do not masquerade as textbook evidence.

---

## 7. Boundaries

- No classroom-validation claim.
- No D018 score change from using this template.
- No automatic authorization of future Chalkie runs.
- Not a locked production / methodology standard.
- Teacher review and curation remain required.
