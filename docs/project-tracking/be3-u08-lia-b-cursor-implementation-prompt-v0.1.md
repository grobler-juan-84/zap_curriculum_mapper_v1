# BE3 Unit 8 Language in Action — Cursor LiA-B Implementation Prompt v0.1

**Status:** EXECUTED — LiA-B OWNER-ACCEPTED / NON-SERVING
**Version:** 0.1
**Date:** 2026-10-29
**Prepared by:** ChatGPT Desktop after owner approval of the LiA-B parity scope and Cursor's read-only inspection
**Execution record:** Implemented within the authorized six-path boundary, followed by a two-path correction pass. Final verification: focused **27/27**, retained regressions **90/90**, app typecheck pass; current LiA serving remains `sb_only`. No LiA-C, deployment or promotion.

---

## Cursor task

Implement the smallest non-serving BE3 Unit 8 Language in Action neutral-package and renderer parity slice described below.

Do not begin unless the owner separately authorizes execution of this prompt.

### Guiding principle

Beauty in simplicity: establish parity first, then consider integration.

---

## 1. Protect the accepted working baseline

Before editing, record:

- branch;
- HEAD;
- comparison with `origin/main`; and
- full Git status, including untracked files.

Expected branch and HEAD:

- `main`
- `11215f83854a2d48166f9bbd63834fbc206e40d9`
- equal to `origin/main`

The following eleven accepted LiA-A paths are uncommitted and must not be reset, restored, cleaned, stashed, renamed, overwritten, staged or committed:

### Modified

- `docs/0-index.md`
- `docs/3-architecture.md`
- `docs/5-progress.md`
- `docs/6-todo.md`
- `docs/project-tracking/0-project-steps.md`
- `docs/project-tracking/1-project-status.md`
- `docs/project-tracking/nll-migration-roadmap-v0.1.md`

### Untracked

- `docs/project-tracking/be3-u08-lia-knowledge-review-v0.1.md`
- `docs/project-tracking/be3-u08-lia-transfer-planning-brief-v0.1.md`
- `scripts/tests/nllBe3U08LiaSeedStepB.test.ts`
- `supabase/migrations/20261029213000_seed_nll_be3_u08_lia.sql`

Also preserve these ChatGPT Desktop planning files:

- `docs/project-tracking/be3-u08-lia-neutral-package-renderer-parity-brief-v0.1.md`
- `docs/project-tracking/be3-u08-lia-b-cursor-implementation-prompt-v0.1.md`

Stop and report if the baseline differs or any unexpected application, canonical, migration or seed change exists.

---

## 2. Exact implementation boundary

Implement neutral packaging and a dedicated renderer for this relationship only:

| Field | Exact value |
|---|---|
| Relationship | `be3_sb_wb_rel_u08_lia_sb132-133_wb107-108` |
| Package reference | `be3-sb-wb-u08-p132-133-wb107-108` |
| Component key | `lia` |
| Component title | `Language in Action` |
| Lesson 1 | SB pp.132–133; `bep3_sb_p132`, `bep3_sb_p133`; Activities 8–12 |
| Lesson 2 | WB pp.107–108; `bep_3_wb_p107`, `bep_3_wb_p108`; Activities 7–10 |
| Packaging type | `two_lesson_sb_wb` |
| Proof mode | Tests and direct non-serving renderer only |

Canonical order is SB Activities 8–12 followed by WB Activities 7–10.

Explicitly exclude:

- Opener: SB pp.128–129 / WB pp.104–105;
- Story: SB pp.130–131 / WB p.106;
- CLIL/P.E.: SB pp.134–135 / WB pp.109–110; and
- every other page, component, relationship, unit and book.

Keep Book Intelligence and NLL-derived knowledge absent.

---

## 3. Authorized implementation paths

Only these paths may change:

- `app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts`
- `app/src/features/chalkie/renderBe3U08LiaNeutralPackageToChalkieShadow.ts` — new
- `app/src/features/chalkie/renderChalkieFromNeutralPackage.ts`
- `scripts/tests/buildNeutralSbWbLessonPackage.test.ts`
- `scripts/tests/renderBe3U08LiaNeutralPackageToChalkieShadow.test.ts` — new
- `scripts/tests/renderChalkieFromNeutralPackage.test.ts`

If another path appears necessary, stop and explain why. Do not expand scope automatically.

Do not add a feature flag or shadow comparator in this pass. The direct package and renderer tests are the non-serving proof.

---

## 4. Neutral package requirements

In `buildNeutralSbWbLessonPackage.ts`:

1. Import the already accepted `BE3_U08_SB132_133_WB107_108` companion.
2. Extend the package-reference union with `be3-sb-wb-u08-p132-133-wb107-108`.
3. Extend the component-key union with `lia`.
4. Add one exact `LIA_CONFIG` and register it in `SUPPORTED_CONFIGS`.
5. Use the existing exact-scope and selection normalization machinery; do not create a parallel assembler.
6. Keep `curriculumInterpretation`, `derivedKnowledge` and `schoolContext` absent for LiA.
7. Preserve the existing boundary booleans:
   - exact source scope required;
   - no excluded-activity reconstruction;
   - prior support cannot replace current evidence;
   - no adjacent Workbook inference;
   - no invented source content; and
   - BI cannot become source evidence.
8. Reject a correct relationship ID paired with altered catalog IDs, relationship type, printed pages or page IDs.

Recommended purposes:

- Lesson 1: `Practise past-simple Did …? questions and short answers through the verified Language in Action activities.`
- Lesson 2: `Consolidate Did …? questions, did/didn't responses and past-activity comprehension through the verified Workbook practice.`

---

## 5. Renderer requirements

Create `renderBe3U08LiaNeutralPackageToChalkieShadow.ts`.

The renderer must:

- assert the exact LiA identity and scope;
- return exactly five strings: `detailedHandoff`, `lesson1Outline`, `lesson1Vocabulary`, `lesson2Outline`, `lesson2Vocabulary`;
- use the accepted all-selected contract in §6;
- render partial and zero states from selected package evidence only;
- preserve prior-support provenance and lesson targets;
- distinguish `[SB]`, `[WB]`, `[PRIOR]`, `[TEACHER-ADDED · UNVERIFIED]` and `[SUPPLEMENTARY]`;
- treat audio, stickers and illustrations as dependencies, not permission to reconstruct them;
- never load NLL or BI data; and
- fail closed for any non-LiA or malformed package.

Add one exact LiA dispatcher branch in `renderChalkieFromNeutralPackage.ts`. Retarget the existing unsupported-package test to a genuinely unsupported relationship and retain fail-closed coverage.

Do not route this renderer into the overlay, lesson-context resolver or served prompt path.

---

## 6. Exact all-selected five-artifact contract

The following is the owner-reviewable parity authority for the all-selected package with no prior-support records.

Do not silently embellish it. Minor code factoring is allowed; returned strings must match the approved text exactly.

### 6.1 `detailedHandoff`

```text
Create a short, picture-led TWO-LESSON series to SUPPORT Big English 3 Unit 8 using ONLY these source pages:
- Lesson 1: Student Book printed pages 132–133
- Lesson 2: Workbook printed pages 107–108

Do not expand beyond this exact Language in Action relationship.
Do not replace the Student Book or Workbook.
Do not invent publisher audio scripts, sticker placements, illustration details, or missing answers.
Use the official book audio, stickers and illustrations where the selected activity requires them.
Workbook pages 107–108 are verified source evidence for this series; they may not be the PDF currently open in the workspace.
Treat Lesson 2 as consolidation and practice of the Student Book language—not a second presentation of Lesson 1.

SOURCE LABELS:
- [SB] = Student Book evidence from pages 132–133 only
- [WB] = Workbook evidence from pages 107–108 only
- [PRIOR] = teacher-selected prior learning, not current-page evidence
- [TEACHER-ADDED · UNVERIFIED] = teacher-directed language not verified as publisher evidence
- [SUPPLEMENTARY] = teacher-controlled support, not publisher wording

A. SERIES SCOPE

Lesson 1 — Student Book pp. 132–133
Purpose: practise past-simple Did …? questions and short answers through the verified Language in Action activities.

[SB p.132] Activity 8: Listen and look at the sentences. Help Luke and Amy make more. Use official Audio 155 and the visible sentence models and phrase bank; do not invent audio wording.
[SB p.132] Activity 9: Match the phrases. Make five questions about yesterday. Then ask and answer.
[SB p.133] Activity 10: Complete four dialogues with did or didn't.
[SB p.133] Activity 11: Put the words in order to make five questions. Then ask.
[SB p.133] Activity 12: Read and match six Did …? questions and answers. Then change the answers.
[SB] Verified language models: Did you have breakfast? / No, I didn't. | Did he get enough sleep? / Yes, he did. | Did you do any exercise yesterday? / No, I didn't.
[SB] Dedicated target vocabulary on these pages: none listed.

Lesson 2 — Workbook pp. 107–108
Purpose: consolidate Did …? questions, did/didn't responses and past-activity comprehension through the verified Workbook practice.

[WB p.107] Activity 7: Listen and stick to show what Grace and Carlos did on the weekend. Use official Audio 156, illustrations and stickers; do not invent the audio sequence, placements or answers.
[WB p.107] Activity 8: Read and complete two dialogues with did or didn't.
[WB p.108] Activity 9: Look at the illustrations and circle the past activity that completes each of three sentences.
[WB p.108] Activity 10: Use the Activity 9 illustrations to answer seven Did …? questions. The answers depend on those illustrations; do not reconstruct an excluded Activity 9.
[WB] Verified language model: Did he get enough sleep? / Yes, he did. / No, he didn't.
[WB] Dedicated target vocabulary on these pages: none listed.

B. TEACHER-SELECTED PRIOR LEARNING

No verified prior learning was selected for this lesson.

C. TEACHING GUIDANCE

- Keep Lesson 1 on Student Book pp. 132–133 and Lesson 2 on Workbook pp. 107–108.
- Use only selected current-page activities; do not reconstruct excluded activities from page context.
- Keep Audio 155 and Audio 156 as official-book dependencies; do not generate transcripts.
- Keep the Activity 7 sticker task and Activities 9–10 illustration tasks anchored to the physical Workbook.
- Use selected prior or teacher-added language only as clearly labelled support.
- Keep both lessons concise and classroom-usable.
- Success means students are prepared to work with SB 132–133 and WB 107–108.

D. HARD BOUNDARIES

- Do not use Story pages SB 130–131 or WB 106.
- Do not use CLIL/P.E. pages SB 134–135 or WB 109–110.
- Do not use or reconstruct unselected Student Book or Workbook activities.
- Do not invent publisher audio, sticker or illustration content.
- Do not claim teacher-added language is publisher evidence.
- Do not load or quote NLL-derived summaries or Book Intelligence.
```

For non-empty prior support, replace the single `No verified prior learning…` line using the established Opener/Story provenance formatting. Do not change any other all-selected baseline wording.

### 6.2 `lesson1Outline`

```text
Concise teacher-controlled outline — Lesson 1
Short teaching sequence for Student Book pp. 132–133 only (Language in Action). Keep book-working time; do not expand into a slide-by-slide script.

1. [SB] Activity 8: Listen and look at the sentence models. Use official Audio 155; do not invent transcript wording.
2. [SB] Activity 9: Match five phrase halves, make questions about yesterday, then ask and answer.
3. [SB] Activity 10: Complete four dialogues with did or didn't.
4. [SB] Activity 11: Order words to make five questions, then ask them.
5. [SB] Activity 12: Match six Did …? questions and answers, then change the answers.
6. [SUPPLEMENTARY] Finish with one brief teacher-selected Did …? exchange; do not present it as publisher wording.

```

### 6.3 `lesson1Vocabulary`

```text
No dedicated target vocabulary is listed for SB pp. 132–133. Language models: Did you have breakfast? / No, I didn't. | Did he get enough sleep? / Yes, he did. | Did you do any exercise yesterday? / No, I didn't.
```

### 6.4 `lesson2Outline`

```text
Concise teacher-controlled outline — Lesson 2
Short teaching sequence for Workbook pp. 107–108 only. Consolidation and practice of the Student Book Language in Action strand—not a second Lesson 1. Keep book-working time; do not expand into a slide-by-slide script.

1. [WB] Activity 7: Listen and stick. Use official Audio 156, illustrations and stickers; do not supply unverified placements or answers.
2. [WB] Activity 8: Complete two dialogues with did or didn't.
3. [WB] Activity 9: Use the illustrations to circle the correct past activity in three items.
4. [WB] Activity 10: Use the Activity 9 illustrations to answer seven Did …? questions; do not reconstruct excluded visual evidence.
5. [SUPPLEMENTARY] Finish with one brief teacher-selected Did …? check; do not present it as publisher wording.

```

### 6.5 `lesson2Vocabulary`

```text
No dedicated target vocabulary is listed for WB pp. 107–108. Language model: Did he get enough sleep? / Yes, he did. / No, he didn't.
```

The final newline behavior should match the accepted Opener/Story renderer convention for each artifact.

---

## 7. Partial and zero-selection contract

Use the established neutral renderer pattern, with LiA scope wording.

### Partial selection

- List only selected activities in canonical order.
- Derive words/models and language only through existing selection helpers.
- Do not hardcode the all-selected vocabulary strings into partial output.
- Excluded Activity 8 removes every Audio 155 reference.
- Excluded Activity 7 removes every Audio 156 and sticker-task reference.
- Activity 10 selected without Activity 9 may state that the task depends on Activity 9 illustrations, but must not recreate Activity 9 or its answers.
- Prior support remains separate and cannot replace excluded current evidence.

### Zero selection

- Keep both lesson slots structurally valid.
- State explicitly when no current SB or WB activities are selected.
- Do not add substitute teaching content.
- Use an empty Lesson 1 vocabulary string when SB selection is zero.
- Use `No Workbook activities selected.` when WB selection is zero, matching accepted Story behavior.

---

## 8. Required tests

### Neutral package

- exact identity, component title/key, relationship and stable reference;
- exact SB/WB page IDs and printed pages;
- nine activities in canonical order;
- all-selected status and counts;
- representative per-page partial selection;
- zero SB, zero WB and zero both;
- Activity 8 exclusion removes Audio 155 evidence;
- Activity 7 exclusion removes Audio 156/sticker evidence;
- prior and teacher-added support retain provenance and targets;
- BI, NLL and school context remain absent;
- altered catalog ID, type, page list or page ID fails closed;
- an unrelated resolver-wired relationship remains unsupported.

### Dedicated renderer

- exact equality for all five all-selected artifacts in §6;
- identity assertion rejects non-LiA and malformed packages;
- partial SB and WB selection remains selection-honest;
- zero states use the required wording;
- Activity 8 and Activity 7 exclusions remove their media references everywhere;
- Activity 10-alone behavior acknowledges dependency without reconstructing Activity 9;
- prior and teacher-added provenance and target lessons remain visible;
- no Story, Opener, CLIL/P.E., NLL or BI text leaks into output.

### Shared dispatcher and regressions

- exact LiA package dispatches to the new renderer;
- a genuinely unsupported relationship still throws `UnsupportedNeutralPackageRendererError`;
- existing Opener and Story dispatcher behavior remains byte-identical;
- existing Opener, Story, resolver and `sb_only` LiA tests remain passing;
- current `resolveChalkieLessonContext` still reports LiA as `sb_only`.

Run the focused tests first, then the relevant accepted regression suites. Report exact commands and totals.

---

## 9. Explicitly forbidden work

Do not:

- change `resolveChalkieLessonContext` for LiA;
- modify `TeacherChoiceFlowOverlay` or any served handoff path;
- add or alter a feature flag;
- create a LiA canary or active comparator;
- load or attach `be3-u08-lia` NLL knowledge;
- add NLL provenance, hash or staleness handling;
- add BI or School Intelligence;
- modify canonical evidence;
- create or alter migrations or seeds;
- update project-tracking documentation;
- stage, commit or push anything;
- deploy, promote or retire any POC/canary; or
- begin LiA-C.

---

## 10. Completion report and stop gate

Return:

1. before and after branch, HEAD and full Git status;
2. exact changed-path list;
3. concise implementation summary;
4. test commands and pass/fail totals;
5. confirmation that all eleven protected LiA-A paths and both planning files remain intact;
6. confirmation that current LiA serving remains `sb_only`;
7. confirmation that no NLL, BI, feature-flag, migration, seed, documentation, commit, push, deployment, promotion or LiA-C work occurred;
8. risks, assumptions or deviations.

Stop for ChatGPT Desktop review. Do not stage, commit or push.
