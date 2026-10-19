# Chalkie Outline / Context Retention Diagnostic

**Version:** 0.1  
**Status:** ACTIVE / EVOLVING — Experiments 1–9 recorded; Exp 7–8 LiA transfers **PASS**; Exp 9 vocab-split control **PASS**; pattern remains provisional / not locked; further generation not authorized by this record  
**Date:** 2026-10-19  
**Scope:** Narrow Chalkie workflow diagnostic. This is not a D018 iteration, a lesson-quality verdict, a methodology lock, or a product decision.

---

## 1. Question

When a user replaces Chalkie’s auto-generated Lesson Series outline bodies with a detailed, unrelated teacher-controlled lesson specification, which input layers still affect the generated presentation?

This diagnostic is motivated by repeated observations that Chalkie’s auto-outline is a substantive transformation rather than a neutral display of the original handoff. It tests observable output behavior only; it does not claim knowledge of Chalkie’s internal implementation.

## 2. Experiment 1 — Space initial topic, Wild Animals outline replacement

### 2.1 Setup

The owner entered this unrelated Topic-stage input:

- **Title:** `Exploring the Solar System`
- **Specific instructions:** a two-lesson space series: Sun, Earth, Moon, stars and planets in Lesson 1; day/night in Lesson 2; picture-led, short language and guided practice.
- **UI configuration:** Grade 3; English ability Grade 2; 25 slides; 2 lessons; American English.
- **Refine settings observed:** Chalkie Default; standards OFF; learning goals/objectives OFF; key vocabulary ON; YouTube OFF; Audio activities OFF; Activity sheet OFF; image source/style Auto.

Chalkie generated space outlines titled **Our Neighbors in Space** and **Day, Night, and Spinning Earth**. At the Outline stage, the owner replaced the outline bodies with the detailed, slide-by-slide Big English 2 Unit 8 *Wild Animals* specifications from the earlier teacher-controlled-outline handover. The owner also manually entered vocabulary in the outline UI:

| Lesson | Manual vocabulary shown in the UI capture |
| --- | --- |
| 1 | cheetah, monkey, zebra, crocodile, parrot, snake, giraffe |
| 2 | zebra, giraffe, monkey, hippo, parrot, peacock |

The original auto-outline titles remained visible as space titles during the replacement. This is an important confound: they may be a separate retained input channel, rather than proof that hidden initial-prompt text alone was used.

### 2.2 Outputs examined

- `Our Neighbors in Space - experiment lesson 1.pdf` — 30 PDF pages.
- `Day, Night, and the Moving Earth - experiment lesson 2.pdf` — 30 PDF pages.

The PDF filenames/titles remain space-oriented. Exported PDF page count may include reveal states and is not equivalent to planned unique slides.

### 2.3 Observed result

The run is a **major failure of outline replacement as a sole source of truth**:

- Both outputs are overwhelmingly space lessons. Lesson 1 teaches the Sun, Earth, Moon, planets, Mars, Jupiter, Saturn and space exploration. Lesson 2 teaches day/night, Earth’s rotation, shadows and Earth’s journey around the Sun.
- The inserted Wild Animals slide-by-slide specifications did not control the visible lesson topic or sequence.
- The manual vocabulary is nevertheless highly visible: animal-definition vocabulary slides appear in both lessons. Lesson 2 also includes a `WILD ANIMALS AT DAY AND NIGHT` slide about zebras, peacocks, owls and nocturnal animals.
- The outcome therefore shows at least two materially influential channels: retained space context (initial topic and/or auto-outline title/state) and manually selected vocabulary.

### 2.4 What this supports — and what it does not

**Supported:** The editable outline body alone is not the reliable source of truth for this run. Chalkie retained or reintroduced the original space framing after the Wild Animals bodies were inserted. Manual vocabulary selection also materially affects output, so it is not a cosmetic convenience; it is a potential production input in any future handoff format.

**Not established:** This single run does not prove that Chalkie uses hidden original-prompt text after outline editing. The retained space titles, non-edited UI fields, generation variability, and the vocabulary controls are alternative or additional sources of influence. It also does not show that all outline replacement is ineffective; it shows that this replacement did not override all relevant context.

## 3. Experiment 2 — correct title, conflicting space instructions, Wild Animals outline replacement

### 3.1 Setup

- **Topic title:** `Wild Animals`.
- **Initial specific instructions:** intentionally unrelated topic content (space), retained only as the conflict input.
- **Outline bodies:** the same detailed, teacher-controlled Big English 2 Unit 8 *Wild Animals* slide-by-slide specifications.
- **Manual vocabulary for both lessons:** zebra, hippo, parrot, giraffe, cheetah, snake.

### 3.2 Outputs examined

- `Day, Night, and Our Sky - experiment 2 - lesson 1.pdf` — 31 PDF pages.
- `Looking Up at the Sky - experiment 2 - lesson 1.pdf` — 32 PDF pages.

The filenames identify both files as “lesson 1”; their content shows them to be two separate outputs. Their exact Chalkie lesson-number association was not established from the filenames alone.

### 3.3 Observed result

Experiment 2 **repeats Experiment 1’s failure**:

- Both exported presentations remain overwhelmingly about space. One teaches day/night, Earth’s rotation, shadows, the Moon and the solar system; the other teaches the Sun, Earth, Moon, stars, planets and telescopes.
- The correct Topic title `Wild Animals` did not make the detailed Wild Animals outline bodies control the final output.
- The manual vocabulary appears prominently and exactly as animal-definition content in both files. One output also adds an `ANIMALS IN DAY AND NIGHT` slide about giraffes, zebras and cheetahs; this is animal material embedded in a space lesson, not the intended Big English 2 lesson.

### 3.4 Revised interpretation

Across two runs, replacing the outline body with detailed Wild Animals instructions did **not** reliably override conflicting space material entered before the Outline step. In Experiment 2, even a correct Wild Animals Topic title was insufficient.

This is strong evidence that the final generation is influenced by more than the replacement outline body. It does **not** identify which retained channel is decisive: the initial specific instructions, generated outline state/titles, vocabulary controls, or another internal context may all contribute. It also reinforces that manually entered vocabulary is a high-impact input field and may need to be explicit in any future platform handoff.

## 4. Experiment 3 — aligned short prompt, then detailed Wild Animals outline replacement

### 4.1 Setup

Experiment 3 removed the intentional topic conflict. It used:

- **Topic title:** `Wild Animals`.
- **Initial specific instructions:** a short, broad Wild Animals / Big English 2 Unit 8 lesson brief (not the detailed slide-by-slide specification).
- **Outline bodies:** the same detailed, teacher-controlled Big English 2 Unit 8 *Wild Animals* slide-by-slide specifications.
- **Manual vocabulary:** zebra, hippo, parrot, giraffe, cheetah, snake for both lessons.

### 4.2 Outputs and result

- `WILD ANIMALS! experiment 3 - lesson 1.pdf` — 29 PDF pages.
- `WILD ANIMAL ACTIONS! experiment 2 - lesson 2.pdf` — 32 PDF pages (the filename says “experiment 2”; it was supplied as Experiment 3 Lesson 2 and is treated as such here).

The outputs are on-topic and closely follow the intended broad progression: grouped vocabulary → identification → Student Book p.128 → preference → ability/action → progressive conversation → Student Book p.129 in Lesson 1; retrieval → recycling → guided speaking → Workbook preparation/work in Lesson 2. This is an aligned-input practical success, not proof that only the replacement outline mattered.

### Expected diagnostic value

| Output pattern | What it would indicate |
| --- | --- |
| Wild Animals output aligns with the sequence | The aligned inputs can produce a usable candidate; this does not show which input layer carried the result. |
| Output remains substantially off-topic or fragmented | The detailed outline is not sufficient even without a deliberate topic conflict. |
| Output uses the correct topic but loses instructional sequence/provenance | The primary issue shifts from topic retention to the fidelity of the outline-to-slide transformation. |

## 5. Experiment 4 — detailed §7A + §7B2 handoff, auto-outline accepted unchanged

### 5.1 Setup

- **Title and initial prompt:** the full aligned Wild Animals §7A + §7B2 handoff.
- **Outline:** Chalkie’s generated two-lesson outline was accepted without body replacement.
- **Auto-outline evidence:** the captured outline correctly allocates Lesson 1 to SB pp.128–129 and Lesson 2 to WB pp.104–105, includes the selected horizontal-mapping frames, and shows Chalkie-selected vocabulary rather than the manual vocabulary set used in Experiment 3.

### 5.2 Outputs and result

- `Meeting Wild Animals at the Zoo - experiment 4 - lesson 1.pdf` — 29 PDF pages.
- `Practicing Wild Animals and Actions - experiment 4 - lesson 2.pdf` — 31 PDF pages.

Experiment 4 is a topic-fidelity success: both outputs remain within the Wild Animals lesson context and preserve the two-lesson SB → WB allocation. It demonstrates that the detailed initial handoff can survive Chalkie’s auto-outline when the upstream inputs are aligned.

## 6. Comparison — Experiment 3 (teacher-controlled outline) vs Experiment 4 (auto-outline)

**Method:** read-only comparison of the four exported PDFs, the known input conditions, and the Experiment 4 auto-outline capture. This comparison is diagnostic only; it does not replace D018’s existing rubric or establish classroom effectiveness.

| Lens | Experiment 3 — short prompt + detailed outline replacement | Experiment 4 — detailed initial handoff + accepted auto-outline | Reading |
| --- | --- | --- | --- |
| Topic and lesson allocation | Strong: both lessons remain Wild Animals; Lesson 1 supports SB pp.128–129 and Lesson 2 moves to WB pp.104–105 | Strong: same topic and SB → WB allocation survive the auto-outline | No meaningful topic-fidelity advantage for the manual outline when all upstream inputs align. |
| Instructional sequence | Clearer intended arc: grouped vocabulary → identification → book work → preference/ability/action → progressive conversation → book work; Lesson 2 includes retrieval and a more explicit move toward independent speaking | Coherent but more topic/activity-led: extended animal facts → pointing/matching → language frames; Lesson 2 inserts several generated definition/matching tasks before or around workbook preparation | The manual outline gives tighter control of the teaching progression and makes the desired instructional relationships more visible. |
| Textbook integration | Explicit p.128 / p.129 and p.104 / p.105 working slides; generally supports rather than replaces book tasks | Also has explicit book pages and official-audio directions, but adds a generated song-word gap-fill and more pre-book activity material | Both preserve book use. Experiment 3 is closer to the intended “slides support the book” role; neither is free of added practice. |
| Horizontal mapping | ID, preferences, positive/negative choice, ability, action, full-echo agreement and quantity are present in a recognisable progression | Same selected ideas are present and several carry visible `[HM]` / `[SUPPLEMENTARY]` labels | Experiment 3 better connects the forms into a usable conversation; Experiment 4 shows labels more consistently on some slides. |
| Provenance | Page references are present, but visible `[HM]` / `[SUPPLEMENTARY]` labelling is relatively sparse in the exports | More visible labels on ID, quantity and full-echo slides; some generated animal facts / writing extensions still lack clear supplementary treatment | Auto-outline is not automatically worse for provenance, but neither condition reliably preserves it. This remains a quality-control requirement. |
| Added / unrequested material | Some definition/matching and answer-reveal material remains, especially in Lesson 2 | More pronounced animal-fact exposition, definitions, matching, and generated song-fill wording | Manual outline reduces but does not eliminate generator-added presentation overhead. |
| Slide economy and likely curation | 29 + 32 exported PDF pages; still requires curation, but the content is comparatively more purpose-directed | 29 + 31 exported PDF pages; comparable length, with more factual/repetitive slides to remove or revise | The manual outline has no page-count advantage, but appears to reduce the amount of irrelevant content a teacher would need to curate. |

### 6.1 Supported conclusion

The full §7A + §7B2 handoff is sufficient for Chalkie to create an on-topic, structurally recognisable lesson series through its auto-outline. A teacher-controlled detailed outline is therefore **not required solely to prevent topic drift when the title and initial prompt are aligned**.

However, Experiment 3 provides better control over instructional sequence and reduces (without eliminating) added activity/fact overhead. The practical trade-off is now visible: the auto-outline is lower effort, while the detailed outline is likely higher fidelity to a chosen teaching sequence and may reduce later teacher curation.

### 6.2 Not yet established

- Neither experiment establishes classroom superiority.
- Neither output is approved as a production lesson template.
- The comparison cannot isolate every variable: Experiment 3 also used manual vocabulary, while Experiment 4 used Chalkie’s auto-selected vocabulary.

## 7. Experiment 5 — detailed initial handoff plus concise teacher-controlled outline

### 7.1 Setup

Experiment 5 retained the aligned Wild Animals generation context and used the concise teacher-controlled Lesson 1 and Lesson 2 outlines prepared after the Experiment 3 vs 4 comparison. These outlines prescribed the instructional sequence and textbook integration without prescribing every individual slide.

The intended pattern was:

```text
Detailed curriculum handoff (§7A + §7B2)
        +
Concise teacher-controlled lesson outline
        +
Explicit vocabulary selection
```

### 7.2 Outputs and result

- `Meeting Wild Animals - experiment 5 - lesson 1.pdf` — 29 PDF pages.
- `PRACTICING WILD ANIMALS - - experiment 5 - lesson 2.pdf` — 29 PDF pages.

Both exports stay on-topic and follow the intended sequence closely.

| Lens | Observed result |
| --- | --- |
| Lesson 1 sequence | Grouped vocabulary → SB p.128 → identification → preference → ability/action → progressive pair speaking → SB p.129. |
| Lesson 2 sequence | Retrieval → connected speaking → protected Workbook pp.104–105 work → writing and sharing. |
| Textbook integration | The PDFs reserve explicit SB/WB working time and teacher use of official audio. |
| Horizontal mapping | Identification, positive/negative preferences, ability, action, agreement and quantity appear in a connected progression. |
| Economy | Both exports are 29 PDF pages. This is slightly leaner than Experiment 4 (29/31), though exported pages still include reveal states. |
| Remaining issue | Chalkie still adds some definitions, matching and answer/reveal material that a teacher may wish to remove or revise. |

### 7.3 Comparative conclusion

Experiment 5 strengthens the working hypothesis that the most effective observed Chalkie handoff is:

> **Detailed initial curriculum handoff (§7A + §7B2) + concise teacher-controlled outline + explicit vocabulary selection.**

Compared with Experiment 4, the concise outline retains the lower-effort benefits of a structured handoff while giving better control of teaching order, textbook working time and the relationship between language patterns. Compared with the Experiment 3 slide-by-slide outline, it achieves comparable topic/sequence fidelity without requiring the mapper to author every slide.

This is a **working experimental preference**, not a locked workflow, product requirement, or proof of classroom superiority. Provenance accuracy, unnecessary generated material and teacher curation remain required quality checks. No further generation follows from this finding without owner approval.

## 4. Handling rules for this diagnostic

- Keep Experiments 1–5 separate from D018 score history and do not recalculate any prior rubric score.
- Do not claim an internal Chalkie mechanism from one or two runs.
- Record all user-controlled input layers: title, specific instructions, refine settings, auto-outline titles, replacement-outline bodies, vocabulary chips and theme.
- Evaluate content source/fidelity before aesthetic or classroom-quality judgments.
- Do not promote a slide-by-slide outline requirement, UI feature, or platform architecture from these diagnostic runs without an explicit owner decision.

## 8. Experiment 6 — exact replication of Experiment 5

### 8.1 Setup

Experiment 6 duplicated the Experiment 5 input and configuration: aligned detailed curriculum handoff, concise teacher-controlled outlines, and the same intended Wild Animals lesson scope. No prompt or outline refinement was introduced for this replication.

### 8.2 Outputs and result

- `Meet the Wild Animals  - experiment 6 - lesson 1.pdf` — 29 PDF pages.
- `WILD ANIMAL PRACTICE AND WORKBOOK FUN-  - experiment 6 - lesson 2.pdf` — 29 PDF pages.

The repeat is topic- and structure-consistent with Experiment 5:

- Lesson 1 remains Wild Animals / Student Book-focused, progressing from vocabulary and p.128 work through identification, preference, ability/action, pair speaking and p.129 work.
- Lesson 2 remains Workbook-focused, progressing through retrieval and connected oral practice into protected p.104 / p.105 activity and writing time.
- The selected horizontal-mapping forms are again visible, including identification, positive/negative preferences, full-sentence agreement, quantity, ability and action.
- The same residual issues remain: generated animal facts/definitions, matching/check material, and answer/reveal pages still require teacher review and possible curation.

### 8.3 Reproducibility finding

Experiment 6 supplies one successful same-input replication of Experiment 5. The observed working pattern is therefore not limited to a single favourable generation run:

> **Detailed initial curriculum handoff (§7A + §7B2) + concise teacher-controlled outline + explicit vocabulary selection** reliably produced two on-topic, sequence-aligned Wild Animals series in Experiments 5 and 6.

This is sufficient to treat the pattern as a **provisional Chalkie handoff candidate** for later transfer testing. It is not proof of platform determinism, classroom effectiveness, or generalisation across units/subjects, and it does not lock a production workflow.

## 9. Experiment 7 — first cross-unit Language in Action transfer test

### 9.1 Setup

Experiment 7 applied the same provisional handoff pattern to a **new** lesson type and unit:

- **Target:** Big English 2 Unit 5 *Language in Action*, Student Book **pp. 78–79** (grammar / dream-job frames — not Unit 8 Wild Animals).
- **Design:** [`chalkie-transfer-be2-u05-lia-p78-79-experiment-design-v0.1.md`](./chalkie-transfer-be2-u05-lia-p78-79-experiment-design-v0.1.md)
- **Inputs:** detailed initial curriculum handoff + concise teacher-controlled outlines + explicit vocabulary (`actor, doctor, vet, teacher, dancer, singer` only).
- **Configuration:** Lesson Series · 2 lessons · 25 slides/lesson · ≈40 min including book work · Chalkie Default · Simple · Grade 3 / English ability Grade 2 · Audio OFF.

### 9.2 Outputs

- `Asking About Dream Jobs - experiment 7 - lesson 1.pdf` — **30** exported PDF pages.
- `QUESTIONS WITH DO AND DOES - expeririment 7 - lesson 2.pdf` — **30** exported PDF pages (filename spelling preserved).

### 9.3 Result — strong qualitative transfer success

Owner review records a **strong qualitative transfer success**:

- Scope stayed on Unit 5 LiA SB pp. 78–79 (no Unit 8 or unrelated Unit 5 drift).
- Lesson 1 clearly supported p.78 (self/other frames, Acts 9–10, Track 104, protected book work).
- Lesson 2 clearly supported p.79 (`do/does`, Acts 11–13, Track 105/stickers, ask-and-answer, short independent use).
- Grammar progression was accurate and appropriately scaffolded; the six-job vocabulary set worked well.
- 30/30 PDF pages are acceptable (reveal/animation states may inflate page count; not a slide-count failure).

**Curation notes (not failure findings):** optional generated definitions/matching/reveals; do not let them displace textbook work; keep unverified examples visibly supplementary.

### 9.4 Transfer finding

Experiments 5–6 showed the pattern works for a Unit 8 vocabulary/song context. Experiment 7 shows it can also transfer to a **grammar / Language in Action** lesson in another unit.

The pattern remains a **provisional candidate**, not a locked methodology, classroom validation, or product standard. Further generation is **not authorized** by this record.

## 10. Experiment 8 — cross-level LiA transfer (BE3 U3)

### 10.1 Setup

Experiment 8 applied the same provisional handoff pattern to a **new book level**:

- **Target:** Big English 3 Unit 3 *Working Hard!* Language in Action, Student Book **pp. 40–41** (*have to / has to* + frequency adverbs).
- **Design / review:** [`chalkie-transfer-be3-u03-lia-p40-41-experiment-design-v0.1.md`](./chalkie-transfer-be3-u03-lia-p40-41-experiment-design-v0.1.md)
- **Inputs:** detailed initial curriculum handoff + concise teacher-controlled outlines + explicit vocabulary.
- **Pre-run vocabulary entry (historical):** the **identical** 12-item list in **both** lessons — eight chores + `always, usually, sometimes, never`.
- **Configuration:** Lesson Series · 2 lessons · 25 slides/lesson · ≈40 min including book work · Chalkie Default · Simple · Grade 3 / English ability Grade 2 · Audio OFF.

### 10.2 Outputs

- `CHORES AND OBLIGATIONS - experiment 8 - lesson 1.pdf` — **31** exported PDF pages.
- `Adverbs of Frequency for Daily Routines - experiment 8 - lesson 2.pdf` — **31** exported PDF pages.

### 10.3 Result — PASS / strong qualitative transfer success

Owner review records a **PASS — strong qualitative transfer success**:

- Scope stayed on BE3 U3 LiA SB pp. 40–41 (new level/unit/grammar focus; two-page LiA spread).
- Accurate grammar; protected SB pp. 40–41 support; official Track **51** / **53** handled correctly.
- No invented publisher audio scripts or Activity 11 answer keys; no topic drift.
- 31/31 PDF pages are acceptable (reveal/animation expansion expected; not a slide-count failure).

**Curation notes (not failure findings):** optional generated definitions/matching/quizzes/reveals/examples; do not let them displace textbook work; keep unverified examples visibly `[SUPPLEMENTARY]`.

### 10.4 Vocabulary-allocation confound (corrected causal read)

An informal observation that Lesson 1 introduced frequency words early and Lesson 2 retaught the whole chores set is **partly caused by duplicated manual vocabulary input**, not a clean independent Chalkie sequencing failure.

Experiment 8 therefore does **not** cleanly test whether Chalkie can maintain a strict L1/L2 vocabulary split when supplied **distinct** lists. The provisional handoff template now requires **per-lesson vocabulary allocation**. Recommended future split for this target: L1 = eight chores; L2 = four frequency adverbs only (retrieve chores orally/via SB as needed).

### 10.5 Transfer finding

Experiment 7 showed cross-**unit** LiA transfer within BE2. Experiment 8 shows the pattern can also transfer across **book level** (BE3) with a two-focus LiA spread.

The pattern remains a **provisional candidate**, not a locked methodology, classroom validation, or product standard. Further generation is **not authorized** by this record.

## 11. Experiment 9 — vocabulary-split control (BE3 U3)

### 11.1 Setup

Experiment 9 repeated Experiment 8 with **one intentional change**:

- **Run card / review:** [`chalkie-transfer-be3-u03-lia-p40-41-vocab-split-runcard-v0.1.md`](./chalkie-transfer-be3-u03-lia-p40-41-vocab-split-runcard-v0.1.md)
- **Fixed:** Exp 8 title, detailed handoff, concise outlines, settings, page scope, exclusions.
- **Changed:** Lesson 1 chips = eight chores only; Lesson 2 chips = `always, usually, sometimes, never` only.

### 11.2 Outputs

- `Chores and Obligations - experiment 9 - lesson 1.pdf` — **31** exported PDF pages.
- `How Often We Do Chores - experiment 9 - lesson 2.pdf` — **31** exported PDF pages.

### 11.3 Result — PASS / vocabulary-split control succeeded

Owner review records a **PASS**:

- L1 did not introduce frequency adverbs as new teaching.
- L2 did not reteach the full eight-item chore set; it still retrieved enough chore language for coherent frequency teaching.
- SB p.40 → p.41 progression remained intact; Tracks 51/53 handled responsibly; no invented Track 53 / Act 11 keys.
- 31/31 PDF pages acceptable (reveals).

**Supported working finding:** Chalkie’s lesson-specific vocabulary chips materially influence what it treats as teachable content in each lesson. Per-lesson vocabulary allocation should remain part of the provisional handoff pattern.

**Qualification:** one stochastic generation is not absolute causal proof; Exp 9 provides **convincing practical evidence** vs Exp 8.

**Curation (not failure):** late L1 book work; optional definitions/matching/quizzes/reveals; mislabelled provenance (`[SS]`/`[SB]` on generated material); rigid invented frequency→days scale; Act 13 chart lookalike / Leo challenge must be verified or `[SUPPLEMENTARY]`.

### 11.4 Transfer finding

Exp 8 established the confound; Exp 9 shows that **distinct per-lesson vocab lists** can produce the intended lesson separation in this setup. Pattern remains provisional; further generation **not authorized**.

## 12. Provisional implication

The eventual platform-neutral lesson package may need to treat vocabulary selection as a first-class, **per-lesson** output field alongside the short general brief and the per-lesson instructional sequence. Experiments 7–9 strengthen that hypothesis. Still a design hypothesis only — not a packaging format lock, methodology lock, or claim that Chalkie is (or is not) suitable as a production backend.
