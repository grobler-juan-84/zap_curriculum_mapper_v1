# D018 Comparison Design — V2b Control vs Polarity-Safe Horizontal Map (v0.1)

**Status:** DESIGN ONLY · **GENERATION NOT AUTHORIZED**  
**Date:** 2026-10-18  
**Branch:** `phase-2`  
**Purpose:** Owner-reviewable A/B brief that tests teacher-directed horizontal-mapping curriculum intelligence against the accepted D018 **V2b** control — without restarting broad prompt experimentation.

**Control source:** [`d018-v2-be2-u08-sb128-129-wb104-105-experiment.md`](./d018-v2-be2-u08-sb128-129-wb104-105-experiment.md) (V2-family CLOSED; **V2b** preferred Pass baseline)  
**Mapped input:** [`../phase-2/experiments/be2-u08-polarity-safe-opener-cue-card-v0.1.md`](../phase-2/experiments/be2-u08-polarity-safe-opener-cue-card-v0.1.md) (owner-reviewed; clear; dual polarity)

---

## 1. Comparison question

> Does the mapped input create more natural, purposeful student language without provenance drift, overload, or loss of textbook focus?

Arms differ **only** by whether the polarity-safe horizontal-mapping cue card is appended. Everything else stays fixed.

---

## 2. What stays fixed (both arms)

| Fixed element | Value (V2b control configuration) |
|---|---|
| Curriculum pages | SB **128–129** + WB **104–105** only |
| Out of scope | Later Unit 8 SB; WB **106–117**; habitats; phonics; culture; values; BI/V3/V4/V5 layers |
| Chalkie mode | **Single Lesson** (see §4) |
| Framework | Chalkie Default |
| Theme | Simple |
| Grade | Grade 3 |
| English ability | Grade 2 |
| Requested slide count | **25** |
| Audio activities | **OFF** (V2b critical setting) |
| Lesson format | One short support lesson; picture-led; slides support books, do not replace them |
| Base prompt body | Unchanged V2 paste block (same text V2b used) |
| Evaluation criteria | Same **seven-criterion** D018 rubric + same Pass rule as V2b |
| Floor / Enrichment / Extension split | Not used |

**Pass rule (unchanged):** ≥ **5× Yes**, zero hard scope failures on criterion #1, and no invented listening scripts presented as book text.

**Do not change:** V2b historical scores, preferred-baseline status, or D018 rubric wording.

---

## 3. Arms

### Arm A — Control

- **Identity:** Accepted D018 **V2b** lesson-generation configuration and scope.
- **Prompt:** V2 Chalkie paste block only (§7A) — identical in substance to the V2b run.
- **Settings:** table in §2 (Audio OFF).
- **Reference artifact (already generated):** `WILD ANIMALS(2).pdf` (30 PDF pages with reveals; Audio OFF). New Arm A generation is **optional** only if the owner wants a fresh twin under identical settings; otherwise evaluate Arm B against the existing V2b artifact as control.

### Arm B — Mapped input

- **Identity:** Same configuration and scope as Arm A, **supplemented only** with the teacher-selected, polarity-safe horizontal-mapping cue card.
- **Prompt:** V2 paste block **plus** §7B `[HM]` appendix (cue card content). No other intelligence layers.
- **Settings:** identical to Arm A.
- **Generation:** **NOT AUTHORIZED** until the owner explicitly opens a run.

**Allowed `[HM]` content:** preference +/− paths, polarity-matched agreement, optional quantity / action lines from the cue card.  
**Not allowed in Arm B:** full nine-pattern bank dump; Lesson Series redesign; BI columns; school intelligence; invented publisher wording; treating `can` as prior learning.

---

## 4. Single Lesson vs Lesson Series

**Design choice for this comparison: Single Lesson.**

| Reason | Detail |
|---|---|
| Clean control match | V2b was generated and accepted as **Single Lesson** |
| One variable | Adding Lesson Series would confound “mapped cue card” with “format change” |
| Scope fit | Opener pack (SB 128–129 + WB 104–105) was already tested as one short support lesson |

Lesson Series Experiment 1 remains **parked** ([`d018-lesson-series-be2-u08-experiment-design.md`](./d018-lesson-series-be2-u08-experiment-design.md)). It is **not** Arm B of this brief.

---

## 5. Evaluation plan (when generation is later authorized)

### 5.1 Same seven criteria (both arms)

| # | Criterion |
|---|---|
| 1 | Scope stays on SB 128–129 + WB 104–105 only |
| 2 | Uses the 12 [SB] animal names (or clearly the page set) |
| 3 | Includes / prepares the [SB] like + can frame |
| 4 | Supports book activity types without inventing missing audio scripts; [WB] clearly labeled |
| 5 | [SS] / [SB] / [WB] (and for Arm B: **[HM]**) not silently fused into unmarked “facts” |
| 6 | Short enough / usable (not a unit dump) |
| 7 | Teacher could run the SB and WB book pages after this lesson |

### 5.2 Qualitative overlay (comparison question only — no new numerical thresholds)

| Lens | Ask |
|---|---|
| Natural +/− language | Does Arm B support both like and don’t-like with matched `Me, too!` / `Me neither!`? |
| Purposeful reuse | Are prior patterns used as available practice, not a forced checklist? |
| Provenance | Are [HM] / mapper-generated lines labeled and not presented as publisher text? |
| Overload | Does Arm B add slides/text without improving communication? |
| Textbook focus | Does Arm B still prepare students for SB 128–129 + WB 104–105? |

**Success signal (qualitative):** Arm B improves natural/purposeful student language **without** worsening provenance, length, or textbook focus vs Arm A / existing V2b.

**Non-claims:** This design does not claim classroom validation, Phase 2 closure, or that horizontal mapping already improves Chalkie lessons.

---

## 6. Provenance labels (Arm B)

| Label | Meaning |
|---|---|
| `[SS]` | Unit-level Scope & Sequence |
| `[SB]` | Student Book pp. 128–129 |
| `[WB]` | Workbook pp. 104–105 |
| `[HM]` | Horizontal-mapping / teacher cue card — **available** prior patterns + mapper-generated applications; **not** publisher script |

Unit 8 ability (`Cheetahs can run.` / `Can …?`) remains **current-unit** language, even when practised next to `[HM]` preference lines.

---

## 7. Copy-ready prompts

### 7A — Arm A (control) — V2 paste block (unchanged)

```text
Create a SHORT slide lesson to SUPPORT Big English 2 Unit 8:
- Student Book pages 128–129, AND
- Workbook pages 104–105 ONLY.
Do NOT teach later SB Unit 8 pages or Workbook pages 106–117 (story, Language in Action, habitats, grammar, culture, values, phonics, review).
Do NOT replace the textbooks. Do NOT invent official publisher audio scripts or missing true/false item text.
Prefer picture-led slides and minimal student-facing text. Workbook practice must improve useful practice — do NOT add unnecessary slides or repeat the same animal list on many slides.

LABELS (keep visible to the teacher):
- [SS] = publisher Scope & Sequence (unit-level)
- [SB] = Student Book evidence for pp. 128–129 only
- [WB] = Workbook evidence for pp. 104–105 only

A. WHAT THESE PAGES TEACH

[SS] Unit 8 title: Wild Animals (full SB unit is pp. 128–143 / full WB unit is pp. 104–117 — this lesson uses SB 128–129 + WB 104–105 only)

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

B. TEACHING PROGRESSION (REQUIRED — keep SHORT)

1) [SB] Animal pictures — hear / see / say the 12 names (SB p.128). One tight picture set; do not duplicate as many vocab slides.
2) [SB] Quick recognition (point / find / say) — still SB p.128.
3) [WB] Brief naming/match bridge (Look and write / Look and match) — WB p.104; label as Workbook practice.
4) [SB] Song support for “To the Zoo!” — SB p.129 (do not invent lyrics; use the book/audio).
5) [WB] Song listen-and-write support — WB p.105; tell teacher to use book/audio if lyrics/items are unknown.
6) Model the [SB] frame once or twice: Do you like cheetahs? Yes, I do! Cheetahs can run.
7) Guided oral practice with other animals + light ability talk that stays on these pages.
8) [WB] One short open write: What animals do you like seeing at the zoo? (WB p.105) — do not turn into a long writing lesson.
9) Optional light [SS] can/can't if it helps — do not expand into full unit Q&A or habitats.

C. HARD RULES

- Stay on SB 128–129 + WB 104–105 only.
- Keep [SS], [SB], and [WB] distinguishable on slides / teacher notes.
- Prefer book activities; slides support, not replace.
- If audio item text is unknown, instruct the teacher to use the book/audio — do not invent official tracks.
- Any Chalkie-generated audio is supplementary only — never present as publisher audio.
- Keep the lesson short and classroom-usable; success = students are ready for SB 128–129 and WB 104–105.
```

### 7B — Arm B (mapped) — Arm A prompt + `[HM]` appendix only

Paste **§7A in full**, then append:

```text
D. HORIZONTAL MAPPING — TEACHER CUE [HM] (AVAILABLE, NOT MANDATORY)

Add label [HM] = teacher-selected prior-language practice from Units 1–7, applied to Unit 8 animals.
[HM] is NOT publisher textbook text. Do NOT present [HM] lines as [SB] or [WB].
Selected patterns are AVAILABLE — do not force every pattern onto every slide.
Teacher may use only the preference pair.

[HM] CORE — preference + agreement (use for oral practice after the required [SB] frame)

Affirmative:
Do you like cheetahs?
Yes, I do. I like cheetahs.
Me, too!

Negative:
Do you like snakes?
No, I don't. I don't like snakes.
Me neither!

Polarity rule:
- Me, too! follows Yes, I do. I like…
- Me neither! follows No, I don't. I don't like…
Do not mix polarities.

Swap Unit 8 animals to match pictures.

[HM] OPTIONAL (only if a picture supports them; skip freely)

Quantity:
What are they?
They are zebras.
How many zebras are there?
There are three zebras.
(Number must match the picture. What are they? = mapper-generated identification.)

Action + current-unit ability:
What is the cheetah doing?
It is running.
Can cheetahs run?
Yes, they can.
(Continuous animal wording = mapper-generated adaptation. Can…? = CURRENT Unit 8 ability — not prior learning.)

[HM] HARD RULES
- Keep the required [SB] frame: Do you like cheetahs? Yes, I do! Cheetahs can run.
- Prefer natural +/− student answers over a positive-only path.
- Do not dump a long prior-language bank.
- Do not expand scope beyond SB 128–129 + WB 104–105.
- Do not invent publisher audio or mislabel [HM] as [SB]/[WB].
```

---

## 8. Owner review checklist (design approval)

| # | Question | Owner |
|---|---|---|
| 1 | Is Single Lesson the right fixed mode for this comparison? | [ ] Yes · [ ] Change |
| 2 | Is “existing V2b PDF as Arm A” acceptable, or must Arm A be regenerated? | [ ] Existing OK · [ ] Regenerate both |
| 3 | Is the `[HM]` appendix minimal enough (preference core + optional add-ons only)? | [ ] Yes · [ ] Trim / expand |
| 4 | Approve this design for a **later** generation run? | [ ] Design approved · [ ] Revise first |
| 5 | Authorize generation now? | [ ] **No** (default) · [ ] Yes — separate explicit authorization required |

**Default:** Generation remains **unauthorized** even if the design is approved.

---

## 9. Boundaries

- Does **not** modify V2b results, rubric, or preferred-baseline status.
- Does **not** authorize V3, V4, V5, or Lesson Series generation.
- Does **not** close Phase 2 or lock horizontal-mapping methodology.
- Does **not** claim the cue card already improves Chalkie output.
- Chalkie remains downstream of curriculum intelligence.

---

## 10. Smallest next step after this brief

> Owner completes §8. If design is approved, **separately** authorize Arm B generation (and optional fresh Arm A) under the fixed V2b settings — then score with §5.
