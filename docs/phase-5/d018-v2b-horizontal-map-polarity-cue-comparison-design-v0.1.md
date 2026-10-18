# D018 Comparison Design — V2b Inputs vs Polarity-Safe Horizontal Map (v0.1)

**Status:** DESIGN ONLY · **GENERATION NOT AUTHORIZED**  
**Date:** 2026-10-18  
**Branch:** `phase-2`  
**Purpose:** Owner-reviewable A/B brief that tests the incremental effect of teacher-directed `[HM]` curriculum intelligence when **both arms** use the same Lesson Series configuration and V2b-scope textbook inputs.

**Curriculum-input source (both arms):** [`d018-v2-be2-u08-sb128-129-wb104-105-experiment.md`](./d018-v2-be2-u08-sb128-129-wb104-105-experiment.md) (V2-family CLOSED; **V2b** preferred Pass baseline for Single-Lesson history — **not** reused as Arm A PDF here)  
**Mapped input (Arm B only):** [`../phase-2/experiments/be2-u08-polarity-safe-opener-cue-card-v0.1.md`](../phase-2/experiments/be2-u08-polarity-safe-opener-cue-card-v0.1.md)  
**Related (parked, not this brief’s prompt):** [`d018-lesson-series-be2-u08-experiment-design.md`](./d018-lesson-series-be2-u08-experiment-design.md)

---

## 1. Comparison question

> When both arms receive equal instructional space under the same Lesson Series configuration, does adding `[HM]` produce more natural, purposeful cumulative student language — without provenance drift, overload, or loss of textbook focus?

Arms differ **only** by whether the polarity-safe horizontal-mapping cue card is appended. Do **not** attribute improvements solely to Lesson Series mode: both arms use it. Compare **A vs B** for the incremental effect of `[HM]`.

---

## 2. Why Lesson Series (shared by both arms)

**25 requested slides in a Single Lesson proved too restrictive** for the scaffolding desired (introduce → guided speaking → book support → retrieve → deepen practice).

**Two lessons** give more instructional space while keeping the comparison fair: both arms use the **same** Lesson Series settings, so mode is not a confounding variable.

Historical V2b (`WILD ANIMALS(2).pdf`, Single Lesson, Audio OFF) remains the preferred Pass **baseline in the D018 record**. It is **not** Arm A of this comparison, because Arm A must share the Lesson Series configuration with Arm B.

---

## 3. What stays fixed (both arms)

| Fixed element | Value |
|---|---|
| Chalkie mode | **Lesson Series** |
| Lessons | **2** |
| Requested slides | **25 per lesson** |
| Duration | Approximately **40 minutes per lesson**, including textbook work |
| Lesson 1 pages | Student Book **pp. 128–129** — introduce vocabulary and target language; scaffold recognition through guided speaking; support official book activities |
| Lesson 2 pages | Workbook **pp. 104–105** — retrieve Lesson 1 language; deepen guided and independent practice; support official workbook activities |
| Out of scope | Later Unit 8 SB; WB **106–117**; habitats; phonics; culture; values; BI/V3/V4/V5 layers |
| Framework | Chalkie Default |
| Theme | Simple |
| Grade | Grade 3 |
| English ability | Grade 2 |
| Audio activities | **OFF** (preserve V2b audio discipline) |
| Curriculum inputs | Same V2b-scope **[SS] / [SB] / [WB]** evidence (no Book Intelligence append) |
| Evaluation criteria | Same **seven-criterion** D018 rubric + same Pass rule as V2b (apply per series / across both lessons as practical) |
| Floor / Enrichment / Extension split | Not used |
| Prompt difference | **Only** Arm B’s `[HM]` appendix |

**Pass rule (unchanged):** ≥ **5× Yes**, zero hard scope failures on criterion #1, and no invented listening scripts presented as book text.

**Do not change:** V2b historical scores, preferred-baseline status, or D018 rubric wording.

---

## 4. Arms

### Arm A — Control

- **Identity:** Existing V2b curriculum inputs and this shared Lesson Series configuration, **without** `[HM]`.
- **Prompt:** §7A only.
- **Settings:** §3.
- **Generation:** Not authorized until separately opened. Must be newly generated under Lesson Series (historical Single-Lesson V2b PDF is reference only, not Arm A).

### Arm B — Mapped

- **Identity:** Identical inputs and configuration to Arm A, **plus** the approved `[HM]` polarity-safe cue card only.
- **Prompt:** §7A in full + §7B appendix.
- **Settings:** identical to Arm A.
- **Generation:** Not authorized until separately opened.

**Allowed `[HM]`:** preference +/− paths, polarity-matched agreement, optional quantity / action lines from the cue card.  
**Not allowed:** full nine-pattern bank dump; BI columns; school intelligence; invented publisher wording; treating `can` as prior learning; changing lesson count/slides/audio for Arm B only.

---

## 5. Evaluation plan (when generation is later authorized)

### 5.1 Same seven criteria (both arms)

| # | Criterion |
|---|---|
| 1 | Scope stays on SB 128–129 + WB 104–105 only (Lesson 1 SB / Lesson 2 WB allocation respected) |
| 2 | Uses the 12 [SB] animal names (or clearly the page set) |
| 3 | Includes / prepares the [SB] like + can frame |
| 4 | Supports book activity types without inventing missing audio scripts; [WB] clearly labeled in Lesson 2 |
| 5 | [SS] / [SB] / [WB] (and for Arm B: **[HM]**) not silently fused into unmarked “facts” |
| 6 | Short enough / usable for ~40 minutes including book work (not a unit dump; 25 slides/lesson is a request, not a mandate to teach every slide) |
| 7 | Teacher could run the relevant SB (L1) and WB (L2) book pages after each lesson |

### 5.2 Qualitative overlay (incremental `[HM]` effect only)

| Lens | Ask |
|---|---|
| Natural +/− language | Does Arm B support both like and don’t-like with matched `Me, too!` / `Me neither!` better than Arm A? |
| Cumulative purpose | Does Arm B use prior patterns as available practice, not a forced checklist? |
| Provenance | Are [HM] / mapper-generated lines labeled and not presented as publisher text? |
| Overload | Does Arm B add slides/text without improving communication vs Arm A under the **same** space? |
| Textbook focus | Does Arm B still prepare students for SB 128–129 then WB 104–105? |
| Confound check | Any gain must not be explained away as “Lesson Series helped,” because Arm A also uses Lesson Series |

**Success signal (qualitative):** Arm B improves natural/purposeful cumulative student language **vs Arm A** without worsening provenance, overload, or textbook focus.

**Non-claims:** No classroom validation; no Phase 2 closure; no claim that `[HM]` already improves Chalkie output before generation.

---

## 6. Provenance labels

| Label | Meaning |
|---|---|
| `[SS]` | Unit-level Scope & Sequence |
| `[SB]` | Student Book pp. 128–129 (Lesson 1) |
| `[WB]` | Workbook pp. 104–105 (Lesson 2) |
| `[HM]` | Horizontal-mapping cue card — **available** prior patterns + mapper-generated applications; **not** publisher script (Arm B only) |

Unit 8 ability (`Cheetahs can run.` / `Can …?`) remains **current-unit** language.

---

## 7. Copy-ready prompts

Use Chalkie **Lesson Series** · **2 lessons** · **25 requested slides per lesson** · Audio **OFF** · Chalkie Default · Simple · Grade 3 · English ability Grade 2.  
Each lesson ≈ **40 minutes including textbook work**.

### 7A — Arm A (control) — V2b inputs, no `[HM]`

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

### 7B — Arm B (mapped) — identical to §7A + `[HM]` only

Paste **§7A in full**, then append:

```text
D. HORIZONTAL MAPPING — TEACHER CUE [HM] (AVAILABLE, NOT MANDATORY)

Add label [HM] = teacher-selected prior-language practice from Units 1–7, applied to Unit 8 animals.
[HM] is NOT publisher textbook text. Do NOT present [HM] lines as [SB] or [WB].
Selected patterns are AVAILABLE — do not force every pattern onto every slide or every lesson.
Teacher may use only the preference pair.
Use [HM] mainly to enrich oral practice in Lesson 1 and retrieval/practice in Lesson 2 — without expanding textbook scope.

[HM] CORE — preference + agreement (after the required [SB] frame)

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
- Do not change lesson count, slide request, audio, or page allocation versus the control arm.
```

---

## 8. Owner review checklist (design approval)

| # | Confirm | Owner |
|---|---|---|
| 1 | Mode = Lesson Series; **2 lessons**; **25 requested slides per lesson** | [ ] Yes · [ ] Change |
| 2 | Lesson 1 = SB 128–129 introduce; Lesson 2 = WB 104–105 practise (retrieve + deepen) | [ ] Yes · [ ] Change |
| 3 | Approximately **40 minutes per lesson including book work** | [ ] Yes · [ ] Change |
| 4 | Prompts differ **only** by Arm B’s `[HM]` appendix | [ ] Yes · [ ] Change |
| 5 | Audio OFF; framework/theme/grade settings preserved | [ ] Yes · [ ] Change |
| 6 | Approve this design for a **later** generation run? | [ ] Design approved · [ ] Revise first |
| 7 | Authorize generation now? | [ ] **No** (default) · [ ] Yes — **separate** explicit authorization required |

**Default:** Generation remains **unauthorized** even if the design is approved.

---

## 9. Boundaries

- Does **not** modify V2b historical results, rubric, or preferred-baseline status.
- Does **not** authorize generation of Arm A or Arm B.
- Does **not** authorize V3, V4, or V5.
- Does **not** close Phase 2 or lock horizontal-mapping methodology.
- Does **not** claim `[HM]` already improves Chalkie output.
- Chalkie remains downstream of curriculum intelligence.

---

## 10. Smallest next step after this brief

> Owner completes §8. If the design is approved, **separately** authorize generation of **both** Arm A and Arm B under these identical Lesson Series settings — then score with §5, comparing only the incremental effect of `[HM]`.
