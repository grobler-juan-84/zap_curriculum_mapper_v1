# Chalkie — Interface & Generation Workflow

**Version:** V1.4
**Status:** ACTIVE / EVOLVING (observed UI reference; not a product or schema lock)  
**Observed:** 2026-10-16, 2026-10-20, and 2026-10-21, from user-supplied screenshots and generation/export experience
**Suggested repository location:** `docs/phase-6/chalkie-interface-and-generation-workflow.md`  
**Scope:** Single Lesson and Lesson Series creation, options, prompts, review (including optional **Ask Chalkie**), theme, export and quality control. Does not cover Activity Sheets or Workbooks as standalone creation modes.

## 1. Purpose and authority

This is an operational reference for teachers, ChatGPT, and Cursor preparing or reviewing Chalkie-generated lessons. It documents *how to use Chalkie*, not what the publisher curriculum says. Curriculum content must come from verified evidence and the approved lesson package. This document supplements `11-curriculum-mapping-workflow.md`, the Phase 6 handover material, and D018 experiments; it does not override decisions or turn experimental settings into permanent standards.

**Evidence labels:** **Observed** = visible in screenshots; **User-confirmed** = reported from direct use; **Recommended** = proposed working practice; **Unverified** = needs testing. Chalkie may change its UI.

## 2. Start: choose the correct creation mode

From Home, Chalkie shows **Single lesson** (one-off lesson), **Lesson series** (multiple lessons on a topic), **Activity sheets** (print-ready task sheets), and **Workbooks** (whole-topic print resources). **Observed.**

- **Single lesson** is the default for a bounded teaching session or the D018 baseline experiment.
- **Lesson series** is available for a topic split across multiple lessons. **Do not automatically split every lesson into Floor / Enrichment / Extension.** That modular strategy is parked for future investigation.
- The Activity Sheets and Workbooks creation workflows are outside this document's tested scope. Do not confuse the optional *Activity sheet* checkbox during lesson refinement with the standalone Activity sheets mode.

## 3. Step-by-step: Single lesson

### Current observed path (2026-10-20)

The current Single Lesson path is **Topic → Refine → Theme**. The Topic screen now exposes **Create outline** directly beneath the prompt field. Chalkie may also replace or propose a title after the teacher pastes one; in the observed BE3 U8 pp. 132–133 run, the local standard title was followed by the suggested title `Healthy Living Language in Action`. Record both the pasted title and the final accepted Chalkie title during experiments.

The Refine screen accepted the five manually supplied vocabulary phrases as separate chips. The run then continued directly to **Pick your theme**.

**Observed (Exp 12):** selecting **Create outline** and replacing Chalkie’s outline with the local concise outline made the concise outline the dominant/replacement input; the detailed handoff was no longer visible in the main field. Treat that path as outline-replacement, not “detailed handoff plus outline.”

**Provisional preferred Single Lesson path (Exp 13; not a methodology lock):** paste the detailed handoff into the initial prompt box, append the concise teacher-controlled outline underneath it in the **same** box, and do **not** click `Create outline`. Enter vocabulary chips on Refine; generate; teacher-review. Full findings: [`../phase-5/chalkie-single-lesson-experiments-11-13-results-v0.1.md`](../phase-5/chalkie-single-lesson-experiments-11-13-results-v0.1.md). Pre-run design: [`../phase-5/chalkie-single-lesson-experiments-11-12-run-card-v0.1.md`](../phase-5/chalkie-single-lesson-experiments-11-12-run-card-v0.1.md).

**Transfer evidence (Exp 14):** same preferred path on BE3 U8 Content Connection / P.E. pp. 134–135 (*What Is a Calorie?*) — **PASS AFTER LIGHT TEACHER REVIEW — strong non-grammar transfer success**. [`../phase-5/chalkie-single-lesson-experiment-14-results-v0.1.md`](../phase-5/chalkie-single-lesson-experiment-14-results-v0.1.md).

**SB→WB Lesson Series production pilot (2026-10-21):** curated BE3 U8 opener SB pp. 128–129 → WB pp. 104–105 — **PASS AFTER LIGHT TEACHER REVIEW — first successful SB→WB two-lesson production pilot**. One contained Chalkie-generation short-answer defect corrected in final review (`Yes, did / No, didn't.` → `Yes, he/she did. / No, he/she didn't.`). Exports 30/31 PDF pages (answer reveals). Further generation **not** authorized by that record. [`../phase-5/chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md`](../phase-5/chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md).

### Step 1 — Topic

**Observed controls:** topic/title; first dropdown (example: `3rd grade`); second dropdown (example: `2nd grade`); slide-count selector (example: `25 slides`); language (example: `American English`); large free-text instruction box (`Any specific instructions or topics?`); `Create outline` link; file/resource upload area (local upload, Google Drive, link, video icons); Continue.

**Recommended handoff:**
1. Enter a short descriptive topic (e.g., `Wild Animals — Big English 2 Unit 8, SB pp. 128–129`).
2. Set **both** grade/level dropdowns deliberately; their exact semantics are **unverified**, so record the visible values rather than assuming they are interchangeable.
3. Choose the intended slide count. The screenshot shows `25 slides`, **not proof of a universal maximum**.
4. Select language intentionally.
5. Paste the curriculum-grounded prompt into the specific-instructions field. Keep it scoped, with clear floor content, supporting practice, source references and prohibitions.
6. Upload source resources if useful and permitted. Attaching a textbook does not establish that Chalkie will interpret it perfectly: verify results.
7. For the current provisional preferred Single Lesson path, paste detailed handoff + appended concise outline and **do not** click `Create outline`. If `Create outline` is used, expect the outline to dominate/replace the main input (Exp 12); do not assume Lesson Series outline-review behavior.

### Step 2 — Refine

**Observed options:**

| Group | Setting | Screenshot example | Recommended approach |
|---|---|---|---|
| Lesson | Lesson framework | Chalkie default | Hold constant during comparisons unless framework is the test variable |
| Lesson | Align to standards | Off | Enable only if the actual standards selected are appropriate; do not imply verified alignment merely because this is on |
| Lesson | Learning goals/objectives | On | Usually on; goals should reflect actual lesson floor |
| Lesson | Key vocabulary list | On | Supply precise, verified target words |
| Resources | YouTube video | Off | Off unless requested and appropriate |
| Resources | Audio activities | On in initial single-lesson example | **Off by default for textbook-audio-dependent D018 lessons** unless extra Chalkie-generated audio is intentionally wanted |
| Resources | Activity sheet | Off | Enable only when a print-ready companion is wanted |
| Resources | Image styles & sources | Auto (mix of AI and web) | Choose deliberately; verify image suitability |

**Framework choices shown:**

| Preset | Chalkie description |
|---|---|
| Chalkie default | Explicit modeling, guided practice and regular checks for understanding |
| I do / We do / You do | Teacher models, then guided practice, then independent work |
| 5E | Engage, Explore, Explain, Elaborate, Evaluate; inquiry-based |
| Rosenshine's Principles | Daily review, small steps, questioning, models and guided practice |
| Starter / Main / Review | Quick hook, main learning, review or reflection |

**Recommended D018 baseline:** use Chalkie default unless already recorded otherwise, and **record the actual selection** for each run. The lesson-series screenshot instead shows `I do / We do / You do`, illustrating that configurations can differ.

**Vocabulary entry:** Chalkie displays suggestions with individual checkboxes, plus an `Add your own` input. **User-confirmed:** when preparing words to add manually, supply them **comma-separated**, e.g. `giraffe, cheetah, elephant, kangaroo, crocodile, chase`. The UI may tokenize entries individually; check the resulting selected words. Do not blindly accept every suggestion. Distinguish floor vocabulary from optional enrichment.

**Audio clarification:** enabling **Audio activities** may cause Chalkie to create its own audio-based practice. This is **not** automatically a hallucination or prompt failure. Nevertheless, do not represent generated audio or scripts as official publisher audio. If publisher audio is unavailable, explicitly instruct Chalkie to support the teacher's use of the book/audio rather than invent official tracks.

### Step 3 — Theme and generation

**User-confirmed:** Single Lesson also has a theme selection step, although the supplied detailed theme screenshot comes from Lesson Series. Select a readable, classroom-appropriate theme and generate. Do not assume that theme names guarantee large fonts or minimal text. Inspect the output.

**Single-lesson outline note:** `Create outline` is confirmed on the Topic screen. Exp 12 recorded that replacing the auto-outline with a local outline makes the outline the dominant input (detailed handoff no longer visible). Prefer appending the local outline under the detailed handoff without clicking `Create outline` (Exp 13). Do not conflate this with the four-step Lesson Series workflow.

### Optional post-generation: Ask Chalkie

**Observed (Exp 14 screenshot):** after the lesson is generated, Chalkie offers **Ask Chalkie** as a way to question or revise a specific slide. In the recorded case, challenging an ambiguous learning goal (“Is this the right phrasing?”) produced a correct explanation of the ambiguity and clearer suggested wording.

**Intended position in the workflow:**

1. Local system builds the evidence-based handoff **without AI**.
2. Chalkie generates the lesson.
3. Teacher reviews the lesson.
4. When useful, teacher may use **Ask Chalkie** on a specific slide.
5. Teacher approves (or rejects) the final wording.

**Recommended:** treat Ask Chalkie as an **optional** teacher-review aid. It is **not** part of handoff construction, **not** a mandatory gate, and **not** a guarantee of correctness. Preserve teacher-in-the-loop and **Beauty in Simplicity**.

## 4. Step-by-step: Lesson series

**Observed four-stage progression:** `1 Topic → 2 Refine → 3 Outline → 4 Theme`.

**Production evidence (one curated pair only):** BE3 U8 SB 128–129 + WB 104–105 completed as a usable two-lesson series after light teacher review — see §3 transfer note and the Phase 5 results doc. This does **not** unlock open-ended Lesson Series generation or automatic SB→WB pairing.

### Step 1 — Topic

The series topic screen shows the same general inputs as Single Lesson, **plus a lesson-count selector** (example `2 lessons`). Example configuration: `Wild Animals`; `3rd grade`; `2nd grade`; `25 slides`; `2 lessons`; `American English`; detailed instructions; resource uploads; Continue.

**Unverified:** whether slide count is per lesson or total series; test before assuming. The screenshot alone does not resolve this.

### Step 2 — Refine

The series screen offers the same families of controls: lesson framework, standards, learning objectives, key vocabulary, YouTube, audio activities, activity sheet, image styles/sources. In the example: `I do / We do / You do`; standards off; objectives off; vocabulary on; YouTube off; audio off; activity sheet off; image source Auto. Click **Generate outline**.

### Step 3 — Review Outline — IMPORTANT

**Observed:** Chalkie generates separate editable lesson outline panels. In the two-lesson example:

- **Lesson 1 — Meet the Wild Animals:** SB p.128; introduce and practice 12 animal names; Listen/Look/Say, word building, Listen/Find/Say, recognition game and wrap-up.
- **Lesson 2 — To the Zoo and Animal Action:** SB p.129; recap, official textbook song support, `chase`, target question/answer model, guided practice, optional can/can't support, textbook true/false audio, pair speaking.

Each lesson has an editable outline body and **Key vocabulary** chips. The page shows expand/collapse, delete controls, **Add lesson**, and a **Chat with Chalkie** panel for requested changes. **Observed.**

**Review before continuing:**
1. Confirm each lesson has a distinct purpose and realistic amount of content.
2. Check every page reference, vocabulary item, grammar frame and activity against the verified source.
3. Remove invented publisher-specific content or claims of access to official audio.
4. Keep optional support separate from required floor content.
5. Check lesson boundaries; avoid unnecessary repetition or splitting merely to fill a slide quota.
6. Revise the outline directly or ask Chalkie for a targeted change; re-check the result.
7. Check each lesson's vocabulary chips separately, then Continue.

**Important:** this editable outline stage is **confirmed for Lesson Series**; do not assume identical behavior in Single Lesson without testing.

### Step 4 — Theme

**Observed:** `Chalkie` theme library and `Custom MAX` tab; theme filters include `All`, `Early learners`, `Older learners`, `Seasonal`, `Low stimulation`, `Dyslexia`, `Low vision`, `ADHD`. Visible themes include Classic, Light, Dark, Bold, Bright, Simple, Mono, Gradient, Deep, Plains, Science, Math, Pink, Rust, Forest, Coastal, Mint, Blueprint, Storm, Folio and Pop. The screenshot shows **Simple** selected, described as `Less is more`. Click **Generate**.

**Recommended:** begin with **Simple** or another legible, uncluttered theme when student-facing readability matters. Theme is a visual variable; keep it constant in controlled comparisons. Accessibility category labels are **not proof of accessibility compliance**. The actual customization options in `Custom MAX` are **unverified**.

## 5. Writing the instruction prompt

A Chalkie handoff should explicitly separate:

1. **Source and scope:** series/book/unit/pages; evidence available; no expansion into unrelated unit content.
2. **Learning floor:** essential words, target sentences and book tasks.
3. **Sequence:** model → guided recognition/practice → student response → book activity support, adapted to selected framework.
4. **Permitted support:** short visual examples and simple practice needed to prepare students for book tasks.
5. **Optional enrichment:** only if requested, limited and visibly secondary.
6. **Provenance:** use `SB p.__` / `WB p.__` / `SS` labels when relevant; never present invented exercises or generated audio as publisher originals.
7. **Presentation:** picture-led slides; short labels; one clear task per slide; avoid paragraphs, crowded slides and redundant quizzes.
8. **Teacher usage:** preserve teacher use of official book pages and publisher audio; slides support rather than replace them.

**Suggested concise visual rule (recommendation, not a Chalkie guarantee):** `Prefer large visuals and very short student-facing text. Aim for roughly 15–20 words or fewer on ordinary teaching slides, excluding essential target sentences. Put explanations in teacher delivery rather than dense slide text.`

### Example handoff checklist

```text
MODE: Single lesson / Lesson series
TOPIC: ...
GRADE DROPDOWN 1: ...
LEVEL DROPDOWN 2: ...
SLIDES SELECTED: ...
LESSONS SELECTED (series only): ...
LANGUAGE: ...
FRAMEWORK: ...
STANDARDS: on/off + selected standard (if any)
OBJECTIVES: on/off
VOCABULARY: word 1, word 2, word 3
YOUTUBE: on/off
AUDIO ACTIVITIES: on/off
ACTIVITY SHEET: on/off
IMAGE STYLE/SOURCE: ...
THEME: ...
SOURCE ATTACHMENTS: ...
SOURCE SCOPE: ...
PROMPT VERSION / ITERATION: ...
```

## 6. Export and slide-count interpretation

**User-confirmed:** Chalkie slide-count settings are chosen before generation for **both** Single Lesson and Lesson Series. In Lesson Series, the requested slide count is set **per lesson** together with the number of lessons. Do not assume different slide counts can be assigned to individual lessons within one series unless separately verified. During export to Google Slides or PDF, animated answer reveals can be represented as additional pages/slides (often a separate answer state). Thus a **25-slide selection may yield a 29-page PDF** without Chalkie having planned 29 original lesson slides. The 2026-10-21 SB→WB pilot exports (**30** and **31** PDF pages) are consistent with that reveal-page pattern and remain acceptable.

**Evaluation rule:** record both `(a) slide-count selection in Chalkie` and `(b) exported page/slide count`. Inspect duplicated reveal states before calling the lesson too long. Still evaluate classroom pacing and genuine repetition independently.

## 7. Quality-control checklist

- [ ] Creation mode and all selected settings recorded.
- [ ] Correct book, unit, pages, source scope and target audience.
- [ ] Required floor vocabulary and sentence frames present.
- [ ] Manually supplied vocabulary is comma-separated in the handoff and correctly selected in Chalkie.
- [ ] Book activities supported; source references preserved where practical.
- [ ] Official publisher audio distinguished from optional Chalkie-generated audio.
- [ ] Audio checkbox setting matches the intended lesson.
- [ ] Outline reviewed and corrected **if the mode exposes an outline review**.
- [ ] Theme readable and suitable for projected classroom use.
- [ ] Student-facing text minimal; visuals meaningful; no unnecessary explanatory paragraphs.
- [ ] No unnecessary activities or unrequested topic expansion.
- [ ] Actual output and export reveal pages counted separately.
- [ ] Optional: use **Ask Chalkie** only when a specific slide needs questioning; teacher still approves final wording.
- [ ] D018 evaluation uses the same criteria across iterations; improvements judged by teaching value, not simply more content.

## 8. Known pitfalls and safeguards

| Pitfall | Safeguard |
|---|---|
| Blaming Chalkie for additional audio while Audio activities was enabled | Record checkbox state; distinguish generated audio from publisher audio |
| Treating PDF pages as planned slides | Account for exported animation/reveal states |
| Assuming series and single lesson share identical stages | Series outline review is verified; single-lesson equivalent is not |
| Assuming `25 slides` is a hard platform maximum | Record selection; verify selector options separately |
| Assuming two grade selectors are interchangeable | Record both and verify meanings later |
| Overloading prompt and vocabulary controls with duplicate or conflicting instructions | Keep instructions, selected vocabulary and refinements aligned |
| Treating generated outline as authoritative curriculum evidence | Verify against source evidence before generating |
| Switching framework, theme, audio and sources mid-experiment | Hold settings constant unless explicitly testing them |
| Letting slides replace book/audio | Use slides to prepare and scaffold the actual book tasks |
| Making all lessons into series | Choose based on actual teaching need; optional Floor/Enrichment/Extension series idea remains parked |

## 9. Open questions for a future V1.1

- What exactly do the first and second grade/level dropdowns mean?
- What slide-count choices are available; is there any hard limit?
- For Lesson Series, can different slide counts be assigned to individual lessons within one series?
- What precise intermediate screen/state appears after `Create outline` is used in Single Lesson? Partially answered by Exp 12 (outline becomes dominant/replacement input); further UI detail may still be needed.
- What image source/style alternatives exist beyond Auto?
- How does `Custom MAX` theme customization work?
- How are custom vocabulary entries parsed and distributed across lessons?
- Can teacher notes, animation and exports be controlled independently?
- Does enabling `Align to standards` require choosing a specific curriculum, and how is that verified?

## 10. Maintenance

When Chalkie UI changes, update **Observed** sections and note the date. When a teacher experiment changes our preferred defaults, update **Recommended** sections and the reason. Do not silently turn a screenshot observation or single test into a locked rule. Keep this reference linked from `0-index.md` and cross-reference it from Phase 6 experiment/handover documentation when added to the actual Cursor repository.
