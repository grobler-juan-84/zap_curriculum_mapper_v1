# Chalkie Transfer Test — BE2 Unit 5 Language in Action pp. 78–79 (v0.1)

**Status:** DESIGN DRAFT / **NOT AUTHORIZED TO GENERATE**  
**Date:** 2026-10-19  
**Branch:** `phase-2`  
**Purpose:** Owner-gated transfer test of the provisional Chalkie handoff pattern (Experiments 5/6) on a **new** Big English 2 lesson spread. Design only — no Chalkie run, no lesson evaluation in this document.

**Provisional handoff pattern under test (not locked):**

> Detailed initial curriculum handoff + concise teacher-controlled outline + explicit vocabulary selection.

**Precedents:**  
[`chalkie-outline-context-retention-diagnostic-v0.1.md`](./chalkie-outline-context-retention-diagnostic-v0.1.md) ·  
[`d018-arm-b2-horizontal-map-lesson-input-comparison-design-v0.1.md`](./d018-arm-b2-horizontal-map-lesson-input-comparison-design-v0.1.md) ·  
[`../phase-6/chalkie-interface-and-generation-workflow.md`](../phase-6/chalkie-interface-and-generation-workflow.md)

---



## 1. Experiment question

> Does the Experiment 5/6 provisional handoff pattern transfer to Big English 2 Unit 5 *Language in Action* (Student Book pp. 78–79) — preserving topic/scope, instructional sequence, textbook integration, and provenance discipline — without relying on Unit 8 / Wild Animals content or horizontal-mapping appendices?

| Fixed | Variable / under test |
| --- | --- |
| Chalkie **Lesson Series** · **2 lessons** · **25 requested slides per lesson** | New unit/pages: BE2-SB Unit 5 LiA **pp. 78–79** only |
| ≈ **40 minutes per lesson**, including real textbook work | New detailed initial handoff (§6) from verified U5 evidence |
| Framework **Chalkie Default** · Theme **Simple** | New concise teacher-controlled outlines (§7) |
| Grade **3** · English ability **Grade 2** · Audio **OFF** | New explicit manual vocabulary list (§8) |
| No BI / no `[HM]` / no school intelligence | Transfer fidelity vs Experiment 5/6 working pattern (§9) |
| No generation until owner authorizes | — |

**Not a D018 iteration.** Do not revise D018 scores, V2b status, Arm B2 scores, or lock methodology.

---



## 2. Verified evidence inventory

Located and checked before drafting. No invented publisher content.

| Layer | Source | Verification |
| --- | --- | --- |
| **[SB] canonical** | `data/phase1/big_english_2_sb/canonical/v1.json` (catalog `big_english_2_sb`) | Unit `bep2_unit_05` *My Dream Job* (printed **74–89**); pages `bep2_p078` / `bep2_p079` — section **Language in Action**, `section_type` grammar_practice, `verification_status` **human_verified**; `pdf_page` **78** / **79** |
| **[SB] component** | Same canonical | `bep2_comp_u5_04` — *Language in Action: What do you want to be?* (grammar; `page_id` `bep2_p078`) |
| **[SB] language** | Same canonical | `bep2_lang_u5_002` on p.78: *What does he want to be? He wants to be a doctor.* · Related unit frame `bep2_lang_u5_001` on **p.75** (song page; cited only as unit-adjacent support, **not** in-scope page teaching) |
| **[SB] activities** | Same canonical | p.78 Acts **9–10**; p.79 Acts **11–13** (all human_verified) |
| **[SB] job vocabulary** | Same canonical | Eleven Jobs words on **p.74** (`bep2_vocab_u5_001`–`011`) — used as prior unit target vocab for LiA; **not** extracted as new lemmas on pp.78–79 |
| **Source PDF** | `app/src/assets/books/big-english/big_english_2_sb.pdf` (191 pages) | File present; canonical maps printed 78–79 → `pdf_page` 78–79. Text extraction from those PDF pages returned empty (image-based pages) — page identity rests on Phase 1 human-verified JSON + page-index mapping, not OCR |
| **[SS] Scope & Sequence** | Storage `book-datasets` → `big-english/big_english_2_sb/canonical/ss_v1.json` (SHA-256 per registry `e701e1d784…`); local working copy restored 2026-10-19 for this design | Unit 5 *My Dream Job* (SB pp. 74–89): Jobs vocabulary; Structures including *What do you/does she want to be?*; I can… *talk about jobs* / *say what I want to be and why* / *talk about studying hard and setting goals* |

**Explicitly not used as evidence for this design:** Phase 2 BI JSON; horizontal-mapping packs; Unit 8 prompts; invented audio scripts/lyrics; WB pages.

---



## 3. Exact scope — what pp. 78–79 require

### 3.1 In scope (floor)

**Unit:** Big English 2 · Unit 5 · *My Dream Job*  
**Pages:** Student Book **printed pp. 78–79** only (`bep2_p078`, `bep2_p079`)  
**Section:** Language in Action  

| Page | Activity | Instruction (verified) | Dependencies / notes |
| --- | --- | --- | --- |
| **78** | 9 | Listen. Help Jamie and Jenny make sentences. | Audio Track **104**; visual; frame includes *What do you want to be? I want to be an actor.* / *What does he want to be? He wants to be a doctor.* |
| **78** | 10 | Look and write. Then draw and write. | Visual; items: she→vet; he→teacher; Sally→dancer; open *What do you want to be?* (no keyed answer) |
| **79** | 11 | Listen and stick. Then say. | Audio Track **105**; stickers from **p. 190**; visual |
| **79** | 12 | Look at 11. Ask and answer. | Prompt model: *What does he want to be? He wants to be a singer.* |
| **79** | 13 | Write. Use *do* or *does*. | Four blanks: he→**does**; they→**do**; your cousins→**do**; your brother/sister→**does** |

**Core language (from verified LiA evidence):**

- *What do you want to be? I want to be a/an + job.*
- *What does he/she want to be? He/She wants to be a/an + job.*
- Subject–verb agreement practice: *do* vs *does* in the Wh- question.

**Jobs appearing in LiA items / models (must support):** actor, doctor, vet, teacher, dancer, singer (plus learner’s own job word on Act 10 item 4).

**Communicative aim:** Students can ask and answer about their own and others’ dream jobs using the LiA frames, then complete the book activities on pp. 78–79 with official audio/stickers where required.

### 3.2 Explicit exclusions

Do **not** teach in this series:

- Later Unit 5 SB pages: story/reading beyond retrieval mention; **CLIL** Goods and Services (p.80+); **Grammar** *because* / *look + adjective* (p.82); culture; values; phonics; Unit 5 Review
- Any **Workbook** pages
- Unit 8 / Wild Animals / `[HM]` horizontal mapping
- Book Intelligence columns
- Invented Track 104/105 scripts, sticker key beyond “use stickers from p. 190”, or keyed answers for open Act 10 item 4
- Forcing the full p.74 / `[SS]` Jobs list into every activity (manual Chalkie vocabulary is the six LiA words in §8 only)

### 3.3 Lesson allocation (two lessons on one spread)

Comparable Lesson Series settings remain appropriate: both lessons stay on **SB 78–79** (no WB half). Split by activity load and scaffolding:

| Lesson | Focus | Book work |
| --- | --- | --- |
| **1 — Introduce** | Re-activate Jobs vocab; model 1st/2nd and 3rd-person frames; guided listen/build; support **p.78** Acts 9–10 | Protected Student Book p.78 time + official Track 104 |
| **2 — Practise** | Retrieve frames; support **p.79** Acts 11–13 (stick/say → ask/answer → *do/does*); short independent check | Protected Student Book p.79 time + official Track 105 + stickers p.190 |

---



## 4. Configuration (fixed)

| Setting | Value |
| --- | --- |
| Mode | Lesson Series |
| Lessons | **2** |
| Requested slides | **25 per lesson** |
| Duration | ≈ **40 minutes per lesson**, including textbook work |
| Framework | Chalkie Default |
| Theme | Simple |
| Grade | Grade 3 |
| English ability | Grade 2 |
| Audio activities | **OFF** |

---



## 5. Provenance labels

| Label | Meaning |
| --- | --- |
| `[SS]` | Unit 5 Scope & Sequence (unit-level; do not force whole-unit aims onto these two pages) |
| `[SB]` | Student Book evidence for the cited page only |
| `[SUPPLEMENTARY]` | Chalkie-/teacher-generated examples or adaptations — **not** publisher text |

---



## 6. Detailed initial Chalkie prompt (copy-ready)

Paste as Topic / specific instructions. Title suggestion: `My Dream Job — Language in Action`.

```text
Create a TWO-LESSON SERIES to SUPPORT Big English 2 Unit 5: My Dream Job — Language in Action only.

CONFIGURATION:
- Lesson Series: 2 lessons.
- Approximately 40 minutes per lesson, INCLUDING textbook activities on Student Book pp. 78–79.
- Slides support the book; do not replace or reproduce the book pages unnecessarily.
- Do NOT invent official publisher audio scripts, sticker keys, lyrics, or missing answers.
- Prefer picture-led slides and minimal student-facing text.
- Do NOT add unnecessary slides or dump the whole unit.

TEXTBOOK SCOPE — ONLY:
- Lesson 1 and Lesson 2 both support Student Book pp. 78–79 (Language in Action).
- Lesson 1 emphasizes p.78 activities 9–10.
- Lesson 2 emphasizes p.79 activities 11–13.
Do NOT teach later Unit 5 pages (CLIL/goods & services, because / look + adjective grammar, culture, values, phonics, review) or any Workbook pages.

LABELS (keep visible to the teacher):
- [SS] = publisher Scope & Sequence (unit-level)
- [SB] = Student Book evidence for the cited page only
- [SUPPLEMENTARY] = generated examples (not publisher text)

A. WHAT THESE PAGES TEACH

[SS] Unit 5 title: My Dream Job (full SB unit pp. 74–89 — this series uses SB 78–79 only)

[SS] Vocabulary — Jobs (unit-level list exists on SS / SB p.74; do not dump the full unit list).
Manual Chalkie vocabulary for this series (only): actor, doctor, vet, teacher, dancer, singer

[SS] Structures (unit-level; use the LiA pair on these pages):
- What do you want to be? I want to be an actor.
- What does she want to be? She wants to be a doctor.

[SS] I can… (unit aims — do not force all three on these pages):
- …talk about jobs.
- …say what I want to be and why.
- …talk about studying hard and setting goals.

[SB p.78] Language in Action · component: What do you want to be?
[SB p.78] Model frame (3rd person): What does he want to be? He wants to be a doctor.
[SB p.78] Activity 9: Listen. Help Jamie and Jenny make sentences. (official Track 104)
[SB p.78] Activity 9 language frames include:
  What do you want to be? I want to be an actor.
  What does he want to be? He wants to be a doctor.
[SB p.78] Activity 10: Look and write. Then draw and write.
  1 What does she want to be? → She wants to be a vet.
  2 What does he want to be? → He wants to be a teacher.
  3 What does Sally want to be? → She wants to be a dancer.
  4 What do you want to be? → (learner’s own answer; no keyed publisher answer)

[SB p.79] Activity 11: Listen and stick. Then say. (official Track 105; stickers from p. 190)
[SB p.79] Activity 12: Look at 11. Ask and answer.
  Model: What does he want to be? He wants to be a singer.
  Frame: What does he/she want to be? He/She wants to be a/an [job].
[SB p.79] Activity 13: Write. Use do or does.
  1 What ___ he want to be? → does
  2 What ___ they want to be? → do
  3 What ___ your cousins want to be? → do
  4 What ___ your brother/sister want to be? → does

Jobs used on these pages’ models/items: actor, doctor, vet, teacher, dancer, singer (+ learner choice).

Communicative aim:
Students can ask and answer about dream jobs (self and others) with the LiA frames, then complete SB pp. 78–79 with official audio/stickers.

B. LESSON ALLOCATION (REQUIRED)

LESSON 1 — STUDENT BOOK p.78: INTRODUCE
- Briefly re-activate Jobs vocabulary needed for the frames.
- Model What do you want to be? / I want to be a/an…
- Model What does he/she want to be? / He/She wants to be a/an…
- Guided practice helping students build short exchanges.
- Support official Activity 9 (Track 104) and Activity 10 (look/write/draw).
- Tell the teacher to use the official book/audio; do not invent Track 104 wording.
- End with readiness to work in Student Book p.78.

LESSON 2 — STUDENT BOOK p.79: PRACTISE
- Retrieve Lesson 1 frames efficiently (do not restart a full unit introduction).
- Support Activity 11 (Track 105 + stickers from p. 190): listen, stick, say.
- Support Activity 12 ask-and-answer from the sticker/listen set.
- Support Activity 13 do/does writing.
- Short pair speaking: ask a partner What do you want to be?
- End with readiness to complete Student Book p.79.

C. HARD RULES

- Stay on SB pp. 78–79 only.
- Keep [SS], [SB], and [SUPPLEMENTARY] distinguishable.
- Prefer book activities; slides support, not replace.
- If audio or sticker answers are unknown, instruct the teacher to use the book/audio/stickers — do not invent official tracks or sticker keys.
- Any Chalkie-generated audio is supplementary only (Audio should be OFF for this experiment).
- Keep each lesson classroom-usable for ~40 minutes including textbook work.
- Do not import Wild Animals, Unit 8, or horizontal-mapping content.
```

---



## 7. Concise teacher-controlled outlines

Replace Chalkie auto-outline bodies with these (sequence + textbook integration — **not** slide-by-slide scripts). Manually set vocabulary chips per §8.

### Lesson 1 — Introduce (SB p.78)

**Goal:** Students recognise Jobs words needed for LiA and can use *What do you want to be?* / *What does he/she want to be?* in short guided exchanges, then work p.78.

1. **Warm / activate (short):** Picture-led recall of the six selected job words (actor, doctor, vet, teacher, dancer, singer). Label examples `[SUPPLEMENTARY]` if not quoting the book.
2. **Model:** Teacher models 1st/2nd-person and 3rd-person frames with clear *a/an* + job. Keep `[SB]` frames distinct from `[SUPPLEMENTARY]` swaps.
3. **Guided practice:** Choral → pair build of short Q&A (*What do you want to be?* / *What does she want to be?*).
4. **Communicative use (light):** Two–three guided partner turns choosing a job picture.
5. **Textbook working time (protected):** Student Book **p.78** — Activity 9 with **official Track 104**; Activity 10 look/write/draw (item 4 = learner’s own answer).
6. **Final check (short):** One student asks; one answers with *I want to be a/an…* OR reports *He/She wants to be…* about a picture.

### Lesson 2 — Practise (SB p.79)

**Goal:** Students retrieve the frames, complete p.79 listen/stick/say and ask/answer, practise *do/does*, and produce a short independent exchange.

1. **Retrieve (short):** Quick oral recycle of Lesson 1 frames (no full vocab re-teach).
2. **Model:** Remind *What does he/she want to be? He/She wants to be…*; preview *do* vs *does* in the question.
3. **Guided practice:** Controlled ask/answer from pictures or board prompts; one *do/does* discrimination example.
4. **Textbook working time (protected):** Student Book **p.79** — Activity 11 (**Track 105** + stickers **p. 190**); Activity 12 ask/answer from 11; Activity 13 write *do/does*.
5. **Communicative use:** Pair interview — *What do you want to be?* / *I want to be…*; optional report *He/She wants to be…*
6. **Final check (short):** Two accurate *do/does* questions and one free *What do you want to be?* answer.

---



## 8. Explicit vocabulary list (manual Chalkie entry)

Enter **comma-separated** in each lesson’s vocabulary UI (same set for both lessons).

```text
actor, doctor, vet, teacher, dancer, singer
```

| Justification | Evidence |
| --- | --- |
| LiA page use | Models/items on pp.78–79 use **actor, doctor, vet, teacher, dancer, singer** only |
| Source membership | Each word is also on `[SS]` Unit 5 Jobs and `[SB p.74]` (`bep2_vocab_u5_*`) |
| Why not the full eleven | Owner selection for this transfer test: keep explicit Chalkie vocabulary to the jobs actually used on pp.78–79 |
| Not included | artist, athlete, chef, pilot, writer (p.74 / SS Jobs but unused on these LiA pages); CLIL/culture jobs; phonics/subject words |

---



## 9. Evaluation plan (after a future authorized generation)

Compare the transfer output to the **Experiment 5/6 working pattern** (diagnostic lenses — **not** a D018 score rewrite).

| Lens | Ask |
| --- | --- |
| **Topic / scope fidelity** | Stays on Unit 5 dream jobs / LiA? Any Unit 8 or out-of-scope Unit 5 (CLIL, *because*, values, phonics)? |
| **Sequence** | Lesson 1 introduce → p.78; Lesson 2 retrieve → p.79; modelling → guided → communicative → book work → short check? |
| **Textbook integration** | Protected p.78 / p.79 working time? Official audio/sticker directions without invented scripts? |
| **Provenance** | `[SS]` / `[SB]` / `[SUPPLEMENTARY]` distinguishable? No false publisher audio? |
| **Added material** | Extra definitions/quizzes/reveals beyond the outlines? |
| **Slide economy** | Usable within ≈40 minutes including book work (25 slides = request; PDF pages may include reveals)? |
| **Teacher curation** | How much would a teacher need to cut/relabel before classroom use? |

**Success signal (qualitative):** On-topic, sequence-aligned two-lesson series that supports pp.78–79 comparably to how Experiments 5/6 supported their Wild Animals spread — without claiming classroom validation or methodology lock.

**Non-claims:** No Pass/Fail against D018 rubric unless the owner later authorizes a separate scored review; no product readiness; no Phase 2 closure.

---



## 10. Owner gates


| # | Gate | Status |
| --- | --- | --- |
| 1 | Design drafted from verified SB + SS evidence | **Done (this document)** |
| 2 | Owner approves design (or requests revise) | Pending |
| 3 | Owner authorizes **one** Chalkie Lesson Series generation | **Not authorized** |
| 4 | Record exports + evaluate per §9 | Not started |


**Status line for trackers:** DESIGN DRAFT / NOT AUTHORIZED TO GENERATE.

---



## 11. Boundaries

- Does **not** authorize Chalkie generation.
- Does **not** revise D018 / Arm B2 / V2b scores or preferred-control status.
- Does **not** lock the Experiment 5/6 handoff as production methodology.
- Does **not** add UI, schema, or horizontal-mapping requirements.
- Chalkie remains a transfer/diagnostics surface downstream of curriculum evidence.
