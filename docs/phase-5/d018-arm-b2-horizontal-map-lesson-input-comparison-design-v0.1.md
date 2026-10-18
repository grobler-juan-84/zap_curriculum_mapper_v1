# D018 Comparison Design — Arm B2: Teacher-Selected Lesson-Input Pack (v0.1)

**Status:** DESIGN DRAFTED · **owner design approval pending** · **generation not authorized**  
**Date:** 2026-10-18  
**Branch:** `phase-2`  
**Purpose:** Bounded follow-on to the polarity-cue A/B comparison. Tests the incremental effect of the **recorded teacher-selected** `[HM]` lesson-input pack when configuration and V2b-scope textbook inputs stay identical to Arm A.

**Curriculum-input source (shared with Arm A):** [`d018-v2-be2-u08-sb128-129-wb104-105-experiment.md`](./d018-v2-be2-u08-sb128-129-wb104-105-experiment.md) (V2-family CLOSED; **V2b** preferred Pass baseline — historical only)  
**Control arm (reuse, do not regenerate):** Arm A from [`d018-v2b-horizontal-map-polarity-cue-comparison-design-v0.1.md`](./d018-v2b-horizontal-map-polarity-cue-comparison-design-v0.1.md)  
**Mapped input (Arm B2 only):** [`../phase-2/experiments/be2-u08-horizontal-map-lesson-input-pack-v0.1.md`](../phase-2/experiments/be2-u08-horizontal-map-lesson-input-pack-v0.1.md)  
**Historical narrow `[HM]` reference (do not regenerate):** Arm B / Arm A&B from the polarity-cue comparison (scores preserved)

---



## 1. Comparison question

> When instructional space and V2b-scope textbook inputs stay fixed, does the **teacher-selected lesson-input pack** produce more natural, purposeful progressive student language than Arm A — without provenance drift, overload, or loss of textbook focus?

**Primary comparison:** Arm A (no `[HM]`) vs **Arm B2** (recorded pack).  
**Secondary lens (optional, qualitative only):** Arm B2 vs historical Arm B / Arm A&B (narrow polarity cue). Do **not** treat that secondary lens as a new scored A/B run unless the owner later authorizes a formal three-way evaluation.

Arms differ **only** by whether the recorded `[HM]` pack appendix is present. Mode, slides, pages, audio, and textbook evidence stay identical.

---



## 2. Why this follow-on exists

The first Lesson Series A/B run validated a **narrow** polarity/agreement cue (`PL-19` + `PL-08` + optional add-ons). It did **not** test:

```text
complete bank → AI recommend 0–5 → teacher select/override → progressive conversation as available lesson input
```

Owner/teacher review of the lesson-input pack recorded a real override:

| Decision | Detail |
| --- | --- |
| Keep | `PL-19`, `PL-01`, `PL-03` |
| Deselect | `PL-08` (`Me, too!` / `Me neither!`) — school-specific; fuller echo preferred for sentence forming |
| Add | `What is it?` / `What are they?` — practical ID; **not** a BE2 PL ID; **not** PL-22 |

Arm B2 tests whether the generator can respect that **selected set** as available input — including a deselected AI recommendation and a teacher-added unverified/vertical ID frame — without dumping the full bank or claiming publisher evidence for the added ID lines.

---



## 3. What stays fixed (Arm A reuse + Arm B2)


| Fixed element | Value |
| --- | --- |
| Chalkie mode | **Lesson Series** |
| Lessons | **2** |
| Requested slides | **25 per lesson** |
| Duration | Approximately **40 minutes per lesson**, including textbook work |
| Lesson 1 pages | Student Book **pp. 128–129** — introduce; guided speaking; support book activities |
| Lesson 2 pages | Workbook **pp. 104–105** — retrieve; deepen practice; support workbook activities |
| Out of scope | Later Unit 8 SB; WB **106–117**; habitats; phonics; culture; values; BI/V3/V4/V5 layers |
| Framework | Chalkie Default |
| Theme | Simple |
| Grade | Grade 3 |
| English ability | Grade 2 |
| Audio activities | **OFF** |
| Curriculum inputs | Same V2b-scope **[SS] / [SB] / [WB]** evidence (no Book Intelligence append) |
| Evaluation criteria | Same **seven-criterion** D018 rubric + same Pass rule as V2b |
| Floor / Enrichment / Extension split | Not used |
| Prompt difference | **Only** Arm B2’s `[HM]` appendix (§7B2) |


**Pass rule (unchanged):** ≥ **5× Yes**, zero hard scope failures on criterion #1, and no invented listening scripts presented as book text.

**Do not change:** historical V2b scores/preferred-baseline status; recorded Arm A vs Arm B / Arm A&B rubric scores; D018 rubric wording.

---



## 4. Arms



### Arm A — Control (reuse)

- **Identity:** Existing V2b curriculum inputs + shared Lesson Series configuration, **without** `[HM]`.
- **Prompt:** §7A of the polarity-cue comparison (identical text reproduced in §7A below for copy-ready use).
- **Generation:** **Already completed.** Reuse owner exports `Wild Animals - Arm A - Lesson 1.pdf` / `Lesson 2.pdf`. **Do not regenerate** Arm A for this design.



### Arm B / Arm A&B — Historical narrow `[HM]` (reference only)

- **Identity:** Same as Arm A + polarity-safe cue card (`PL-19` + `PL-08` + optional PL-03 / PL-01).
- **Role:** Optional secondary qualitative comparison only.
- **Generation:** Already completed and scored. **Do not regenerate.**



### Arm B2 — Mapped (this design)

- **Identity:** Identical inputs and configuration to Arm A, **plus** the recorded teacher-selected lesson-input pack only.
- **Prompt:** §7A in full + §7B2 appendix.
- **Settings:** identical to Arm A.
- **Generation:** **Not authorized** until owner approves this design and separately authorizes a run.

**Allowed `[HM]` for Arm B2 (final selected set only):**

| Item | Status | Notes |
| --- | --- | --- |
| `PL-19` | Selected | Preference +/−; both paths required as available options |
| `PL-01` | Selected | Continuous action; animal-subject wording = mapper-generated adaptation |
| `PL-03` | Selected | Quantity; only when a clear count picture exists |
| `What is it?` / `What are they?` | Teacher-added | Unverified / vertical possibility; label `[HM]` / `[SUPPLEMENTARY]`; **not** PL-22; do not claim BE2 publisher evidence |
| Current Unit 8 ability | Always available as current-unit | `Can …?` / `Yes, they can.` — **not** prior retrieval |

**Not allowed in Arm B2 `[HM]`:**

- `PL-08` (`Me, too!` / `Me neither!`) — **deselected** for this pack
- Full nine-pattern bank dump / PL-02, PL-13, PL-16, PL-18, PL-20 unless later re-selected
- BI columns; school intelligence; invented publisher wording
- Treating `can` as prior learning
- Changing lesson count / slides / audio / page allocation vs Arm A
- Forcing every selected frame into every activity or every lesson

**Agreement substitute when PL-08 is absent:** prefer fuller sentence echo, e.g. `I like cheetahs. I like cheetahs, too.` (mapper-generated application of preference language — label `[SUPPLEMENTARY]` / `[HM]`, not `[SB]`).

---



## 5. Evaluation plan



### 5.1 Same seven criteria (Arm A reuse vs Arm B2)


| # | Criterion |
| --- | --- |
| 1 | Scope stays on SB 128–129 + WB 104–105 only (Lesson 1 SB / Lesson 2 WB allocation respected) |
| 2 | Uses the 12 [SB] animal names (or clearly the page set) |
| 3 | Includes / prepares the [SB] like + can frame |
| 4 | Supports book activity types without inventing missing audio scripts; [WB] clearly labeled in Lesson 2 |
| 5 | [SS] / [SB] / [WB] / **[HM]** / **[SUPPLEMENTARY]** not silently fused into unmarked “facts” |
| 6 | Short enough / usable for ~40 minutes including book work (25 slides/lesson is a request, not a mandate to teach every slide) |
| 7 | Teacher could run the relevant SB (L1) and WB (L2) book pages after each lesson |




### 5.2 Qualitative overlay (incremental pack effect)


| Lens | Ask |
| --- | --- |
| Teacher-selection fidelity | Does Arm B2 use **only** the recorded selected set (no PL-08 revival; ID frames present where natural)? |
| Progressive conversation | Are short progressive exchanges available (ID → prefer → ability → action / count) without forcing the full chain every time? |
| Both preference polarities | Are yes/like and no/don’t-like both supported without requiring `Me, too!` / `Me neither!`? |
| Provenance | Are teacher-added ID and mapper adaptations labeled and not presented as publisher text? |
| Overload | Does Arm B2 add slides/text without improving communication vs Arm A under the **same** space? |
| Textbook focus | Does Arm B2 still prepare students for SB 128–129 then WB 104–105? |
| vs historical Arm B (optional) | Relative to the narrow cue: more progressive / ID usefulness vs less polarity-agreement scaffolding? |


**Success signal (qualitative):** Arm B2 improves natural/purposeful progressive student language **vs Arm A** while honoring the teacher selection record, without worsening provenance, overload, or textbook focus.

**Non-claims:** No classroom validation; no Phase 2 closure; no product readiness; no comprehensive proof of horizontal mapping; historical V2b and Arm A/B scores unchanged.

---



## 6. Provenance labels


| Label | Meaning |
| --- | --- |
| `[SS]` | Unit-level Scope & Sequence |
| `[SB]` | Student Book pp. 128–129 (Lesson 1) |
| `[WB]` | Workbook pp. 104–105 (Lesson 2) |
| `[HM]` | Teacher-selected prior / available frames from the lesson-input pack — **not** publisher script (Arm B2 only) |
| `[SUPPLEMENTARY]` | Chalkie-/mapper-generated examples, adaptations, and teacher-added ID applications |


Unit 8 ability (`Cheetahs can run.` / `Can …?`) remains **current-unit** language.

---



## 7. Copy-ready prompts

Use Chalkie **Lesson Series** · **2 lessons** · **25 requested slides per lesson** · Audio **OFF** · Chalkie Default · Simple · Grade 3 · English ability Grade 2.  
Each lesson ≈ **40 minutes including textbook work**.

### 7A — Shared base (identical to Arm A control)

```text
Create a TWO-LESSON SERIES to SUPPORT Big English 2 Unit 8: Wild Animals.

CONFIGURATION:
- Lesson Series: 2 lessons.
- Approximately 40 minutes per lesson, INCLUDING textbook activities.
- Slides support the books; do not replace or reproduce them unnecessarily.
- Do NOT invent official publisher audio scripts, lyrics, true/false item text, or missing workbook answers.
- Prefer picture-led slides and minimal student-facing text.
- Do NOT add unnecessary slides or repeat the same animal list many times.

TEXTBOOK SCOPE — ONLY:
- Lesson 1: Student Book pp. 128–129.
- Lesson 2: Workbook pp. 104–105.
Do NOT teach later SB Unit 8 pages or Workbook pages 106–117 (story, Language in Action, habitats, grammar, culture, values, phonics, review).

LABELS (keep visible to the teacher):
- [SS] = publisher Scope & Sequence (unit-level)
- [SB] = Student Book evidence for pp. 128–129 only
- [WB] = Workbook evidence for pp. 104–105 only

A. WHAT THESE PAGES TEACH

[SS] Unit 8 title: Wild Animals (full SB unit is pp. 128–143 / full WB unit is pp. 104–117 — this series uses SB 128–129 + WB 104–105 only)

[SS] Vocabulary — Animals: cheetah, crocodile, elephant, giraffe, hippo, kangaroo, monkey, parrot, peacock, polar bear, snake, zebra
[SS] Vocabulary — Verbs: chase, climb trees

[SS] Structures (unit-level; use lightly if they fit these pages):
- Can a kangaroo jump? Yes, it can.
- Can snakes run? No, they can't.

[SS] I can… (unit aims — do not force all three on these pages):
- …describe animals.
- …talk about where animals live.
- …talk about appreciating animals.

[SB p.128] Vocabulary · Wild Animals
[SB p.128] Target words: giraffe, hippo, kangaroo, cheetah, polar bear, zebra, parrot, monkey, peacock, elephant, crocodile, snake
[SB p.128] Activities: Listen, look, and say. / Listen, find, and say. / Play a game.

[SB p.129] Song / Vocabulary · Song: To the Zoo!
[SB p.129] Word on page: chase
[SB p.129] Language frame (REQUIRED model):
Do you like cheetahs? Yes, I do! Cheetahs can run.
[SB p.129] Activities: Listen and sing. Then look at 1 and find. / Listen and say true or false. / Look at 1. Ask and answer.

[WB p.104] Naming / matching practice (same animal set; peacock included here)
[WB p.104] Activities: Look and write. / Look and match.
[WB p.105] Song support + writing: elephant, chase
[WB p.105] Activities: Listen and sing. Write the words. / What animals do you like seeing at the zoo? (short open response)

Communicative aim:
Students can name the animals, use the [SB] like + can frame, and complete the [WB] naming/match + song-write + short zoo writing — ready for the book pages above.

B. LESSON ALLOCATION (REQUIRED)

LESSON 1 — STUDENT BOOK (pp. 128–129): INTRODUCE
- Introduce vocabulary and target language.
- Scaffold recognition through guided speaking.
- Model the required [SB] frame: Do you like cheetahs? Yes, I do! Cheetahs can run.
- Support the official SB p.128–129 activities (including song/speaking).
- Tell the teacher to use the official book/audio; do not invent lyrics, listening scripts, or true/false statements.
- End with readiness to work in the Student Book pages.

LESSON 2 — WORKBOOK (pp. 104–105): PRACTISE
- Retrieve Lesson 1 language efficiently (do not restart the full introduction).
- Deepen guided and more independent practice with the same animals and like + can frame.
- Support official WB p.104 naming/matching without inventing an unverified answer key.
- Support WB p.105 song/listen-and-write by directing the teacher to the official book/audio.
- Prepare the short response: What animals do you like seeing at the zoo?
- End with readiness to complete the Workbook pages.

C. HARD RULES

- Stay on SB 128–129 (Lesson 1) and WB 104–105 (Lesson 2) only.
- Keep [SS], [SB], and [WB] distinguishable on slides / teacher notes.
- Prefer book activities; slides support, not replace.
- If audio item text is unknown, instruct the teacher to use the book/audio — do not invent official tracks.
- Any Chalkie-generated audio is supplementary only — never present as publisher audio (Audio should be OFF for this experiment).
- Keep each lesson classroom-usable for ~40 minutes including textbook work.
```



### 7B2 — Arm B2 only — append after §7A

Paste **§7A in full**, then append:

```text
D. HORIZONTAL MAPPING — TEACHER-SELECTED LESSON INPUT [HM] (AVAILABLE, NOT MANDATORY)

Add labels:
- [HM] = teacher-selected available prior-language practice (and teacher-added ID) applied to Unit 8 animals
- [SUPPLEMENTARY] = mapper-/AI-generated examples and adaptations

[HM] is NOT publisher textbook text. Do NOT present [HM] or [SUPPLEMENTARY] lines as [SB], [WB], or [SS].
Selected patterns are AVAILABLE — do not force every selected pattern onto every slide or every lesson.
Use [HM] mainly to enrich oral practice in Lesson 1 and retrieval/practice in Lesson 2 — without expanding textbook scope.

FINAL SELECTED SET (use ONLY these [HM] items — do not revive deselected patterns):

1) Teacher-added identification (NOT a BE2 prior-language PL ID; NOT PL-22):
What is it?
It is a cheetah.
What are they?
They are zebras.
Label these [HM] / [SUPPLEMENTARY]. Do not claim they are exact Big English 2 Units 1–7 publisher wording.

2) Prior PL-19 — preference (BOTH polarities available):
Do you like cheetahs?
Yes, I do. I like cheetahs.
Do you like snakes?
No, I don't. I don't like snakes.
Swap Unit 8 animals to match pictures.

3) Agreement WITHOUT PL-08:
Do NOT use Me, too! or Me neither! in this series (teacher deselected PL-08).
Prefer fuller echo for sentence forming, e.g.:
I like cheetahs. I like cheetahs, too.
(Label [HM] / [SUPPLEMENTARY].)

4) Prior PL-03 — quantity (optional; only with a clear count picture):
How many zebras are there?
There are three zebras.
Number must match the picture. Skip freely if no count scene.

5) Prior PL-01 — action (adapted) + CURRENT Unit 8 ability:
What is the cheetah doing?
It is chasing the kangaroo.
Can cheetahs run?
Yes, they can.
Continuous animal wording = mapper-generated adaptation of PL-01.
Can…? / Yes, they can. = CURRENT Unit 8 ability — not prior learning.

PROGRESSIVE EXCHANGE (ILLUSTRATIVE — available shape, not a mandatory full script every time):
What is it? → It is a cheetah. → Do you like cheetahs? → Yes, I do. I like cheetahs. → Can cheetahs run? → Yes, they can. → What is the cheetah doing? → It is chasing the kangaroo.
Integrate short progressive beats into core pair-speaking where natural.
Do not require the entire chain on every slide.
Do not isolate [HM] only in explanation/quiz slides.

[HM] HARD RULES
- Keep the required [SB] frame: Do you like cheetahs? Yes, I do! Cheetahs can run.
- Prefer natural +/− student answers (both paths available).
- Do NOT use Me, too! / Me neither! (PL-08 deselected).
- Do not dump a long prior-language bank or reintroduce unselected PL IDs.
- Do not expand scope beyond SB 128–129 + WB 104–105.
- Do not invent publisher audio or mislabel [HM] / [SUPPLEMENTARY] as [SB]/[WB]/[SS].
- Label mapper-generated examples [SUPPLEMENTARY].
- Do not change lesson count, slide request, audio, or page allocation versus the control arm.
- Reduce unnecessary explanation, repetition, and answer/reveal slides when possible.
```

---



## 8. Owner review checklist (design approval)


| # | Confirm | Owner |
| --- | --- | --- |
| 1 | Mode = Lesson Series; **2 lessons**; **25 requested slides per lesson** | [ ] Yes · [ ] Change |
| 2 | Lesson 1 = SB 128–129 introduce; Lesson 2 = WB 104–105 practise | [ ] Yes · [ ] Change |
| 3 | Approximately **40 minutes per lesson including book work** | [ ] Yes · [ ] Change |
| 4 | Arm A **reused** (not regenerated); prompts differ **only** by §7B2 | [ ] Yes · [ ] Change |
| 5 | Final `[HM]` set = `PL-19` + `PL-01` + `PL-03` + teacher-added ID; **no PL-08** | [ ] Yes · [ ] Change |
| 6 | Audio OFF; framework/theme/grade settings preserved | [ ] Yes · [ ] Change |
| 7 | Approve this **design**? | [ ] Design approved · [ ] Revise first |
| 8 | Authorize **generation** now? | [ ] No (default) · [ ] Yes, generate Arm B2 only |


**Note:** Design approval and generation authorization are separate gates. Completing this document does **not** authorize a Chalkie run.

---



## 9. Boundaries

- Does **not** modify V2b historical results, rubric, or preferred-baseline status.
- Does **not** modify recorded Arm A vs Arm B / Arm A&B scores.
- Does **not** authorize V3, V4, or V5.
- Does **not** close Phase 2 or lock horizontal-mapping methodology.
- Does **not** claim classroom validation or product readiness.
- Does **not** authorize generation by drafting this design.
- Chalkie remains downstream of curriculum intelligence.

---



## 10. Smallest next step

> Owner completes §8 checklist. If design is approved, authorize **Arm B2 generation only** in a separate prompt. Do not regenerate Arm A or historical Arm B.

---



## 11. Generation record (pending)

| Item | Arm A (control) | Arm B2 (mapped) |
| --- | --- | --- |
| Mode | Lesson Series · 2 lessons | Same |
| Requested slides | 25 per lesson | Same |
| Audio | OFF | OFF |
| Prompt | §7A | §7A + §7B2 |
| Status | **REUSE** existing exports | **NOT GENERATED** |
| Exports | `Wild Animals - Arm A - Lesson 1/2.pdf` | — |

---



## 12. Relation to prior comparison refinements

From the polarity-cue evaluation’s proposed refinements (documentation only there; adopted here as Arm B2 prompt guidance where safe):

1. Integrate progressive / +/− pathways into **core pair-speaking**, not only side quizzes.
2. Reduce explanation, repetition, and answer/reveal bulk where possible.
3. Label mapper/AI-created material **`[SUPPLEMENTARY]`**.

These are prompt instructions for Arm B2 — not a rewrite of historical Arm B scores.
