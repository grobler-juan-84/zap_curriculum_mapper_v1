# Chalkie Generic Detailed-Handoff Gap Audit (v0.1)

**Status:** ACTIVE / AUDIT · **NOT AN IMPLEMENTATION** · **NOT A METHODOLOGY LOCK** · **DOES NOT AUTHORIZE GENERATION**  
**Version:** 0.1  
**Date:** 2026-10-20  
**Principle:** Beauty in Simplicity — thorough enough for teachers; flexible enough that useful outputs can still pass and adapt.

**Baseline route (verified, non-fixture):** Big English 3 Student Book · Unit 8 ***Healthy Living*** · Grammar · printed **pp. 136–137** · Activities **19–23** (`bep3_sb_p136` / `bep3_sb_p137`).

**Sources consulted:**

| Source | Role |
|---|---|
| Current `/app/chalkie` local prompt preview (`buildDynamicSingleLessonPrompt`) | What the system emits today |
| [`chalkie-operational-pilot-be3-u08-grammar-p136-137-preflight-v0.1.md`](./chalkie-operational-pilot-be3-u08-grammar-p136-137-preflight-v0.1.md) | Verified evidence inventory |
| [`chalkie-operational-pilot-be3-u08-grammar-p136-137-handoff-design-v0.1.md`](./chalkie-operational-pilot-be3-u08-grammar-p136-137-handoff-design-v0.1.md) | Proven manual Experiment 10 handoff + dual-stage review |
| [`chalkie-experiments-1-9-evidence-synthesis-v0.1.md`](./chalkie-experiments-1-9-evidence-synthesis-v0.1.md) | Pattern lessons (outline + per-lesson vocab) |
| [`chalkie-provisional-handoff-template-v0.1.md`](./chalkie-provisional-handoff-template-v0.1.md) | Provisional package shape |
| Phase 1 schema / canonical activity fields | Evidence locations |
| `chalkieEvidence.ts` · `resolveChalkieLessonContext.ts` · `buildChalkiePromptPreview.ts` · teacher-choice overlay | Current implementation |

**Boundaries:** No code in this prompt · no new lesson generation · no new experiment design · no hardcoded BE3 U8 fixture · no mandatory `[HM]` retrieval for v1 · `4-decisions.md` unchanged · no product-readiness claim.

**Related workspace notes:** [`p5-prototype-chalkie-workspace.md`](./p5-prototype-chalkie-workspace.md).

---

## 1. Current prompt assessment (after activity-resolution fix)

### What already works

The Step 239 activity-resolution fix succeeded for the baseline route:

- Both pages resolve inside the unit range.
- Activities **19–23** appear from verified `instruction` fields.
- Scope boundaries remain truthful (printed pages only; no invented publisher scripts).
- Page labels alone still fail the evidence guard (`no_page_evidence`).
- The exact BE2 U8 fixture route is unchanged.

### Why the preview is still too shallow for detailed lesson production

The dynamic single-lesson prompt is an honest **floor summary**, not a detailed teacher-reviewable handoff. Against Experiment 10, the essential control structure is missing.

| # | Gap | Current behaviour | Why it matters |
|---|---|---|---|
| 1 | Vocabulary honesty | Emits `Target vocabulary: none verified for these visible pages` when dedicated `vocabulary[]` rows are empty | Overlooks verified **activity-specific** words/models in nested activity items / notes (e.g. Act 20 pattern models, Act 22 pairs) |
| 2 | Language honesty | Emits `No verified language examples` when dedicated `language[]` rows are empty | Overlooks Act **23** `language_frame`, grammar component title (*They came, and we played.*), and verified item structures / notes |
| 3 | Communicative aim | Uses joined page labels (e.g. “Grammar · Grammar”) as `currentFocus` | Does not express the verified learner outcome (regular past → irregular past → yesterday speaking) |
| 4 | Official audio | Not surfaced | Track **159** / Act 19 audio dependency is core to Exp 10 fidelity |
| 5 | Regular-past patterns | Absent | Act 20 / representative *start–started…* models are teaching content, not optional colour |
| 6 | Irregular pairs | Absent | Act 22 verified pairs are Lesson 2 core models |
| 7 | Page dependency flags | Absent | p.136 `audio_dependency` / `visual_dependency` guide safe Chalkie settings |
| 8 | Package shape | Always “one short lesson” on generic routes | Exp 10 needs a **two-lesson** series for this spread’s load |
| 9 | Lesson allocation | None | No teacher-confirmed L1/L2 activity split |
| 10 | Per-lesson model lists | None | Exp 8–9 showed identical combined lists are a confound |
| 11 | Concise outlines | None | Template requires sequence + early book work, not slide scripts |
| 12 | Protected textbook time | Weak generic “use the book” | No explicit early SB work for named pages/activities |
| 13 | Teacher-review gate | Optional generate; no post-generation fidelity checklist | Exp 10 proved unsupported answer reveals require teacher checking |

**Verdict:** Truthful enough not to invent publisher content; **not yet sufficient** to assemble a detailed, teacher-reviewable Chalkie handoff for an activity-rich grammar spread.

---

## 2. Required evidence-field map

Legend for **Kind:** `direct` = copy as `[SB]` when verified · `derive` = safe deterministic planning support (not publisher wording) · `teacher` = teacher choice/edit · `internal` = verification/internal only · `unavailable` = must not invent.

| Required handoff field | Current UI / prompt behaviour | Existing canonical source | Kind | Minimum implementation change | Risk if omitted | Surface |
|---|---|---|---|---|---|---|
| Book / unit / page identity | Book label, unit line, visible page range | `book` · `units[]` · PDF printed pages | direct | Keep | Scope drift | Prompt + UI |
| Section / page labels | `pageLabels` from `section_title` / `section_type` | `pages[]` | direct | Keep | Weak orientation | Prompt + UI |
| Curriculum component title | Not shown | `curriculum_components[]` (e.g. *They came, and we played.*) | direct | Resolve component linked to visible `page_id` | Lost grammar identity | Prompt |
| Activity number | Not shown (instruction only) | `activities[].activity_number` | direct | Include with instruction | Harder teacher/book match | Prompt + UI |
| Activity instruction | Shown (after Step 239) | `activities[].instruction` | direct | Keep | Floor collapse | Prompt + UI |
| Activity type | Not used as label (good) | `activities[].activity_type` | derive / internal | Optional classification only; never invent label | Misleading type labels | Internal (optional UI) |
| Activity `language_frame` | Ignored | `activities[].language_frame` | direct | Surface when present (e.g. Act 23) | Missing speaking model | Prompt + UI |
| Activity items | Ignored | `activities[].items[]` (prompt / pairs / structures) | direct (selected fields) | Extract **model/word pairs** only when structured and verified; never dump all items as chips | Lost irregular/match evidence | Prompt + internal |
| Activity notes | Ignored | `activities[].notes` | direct / derive | Surface dependency/pattern notes when verified; do not paraphrase as `[SB]` if interpretive | Miss Track/pattern cues | Prompt (careful) |
| Audio dependency | Ignored | page + activity `audio_dependency`; `source_dependency_note` | direct | Surface Track / “official audio required” | Invented Chalkie audio / scripts | Prompt + UI |
| Visual dependency | Ignored | page + activity `visual_dependency` | direct | Surface “use book visual” | Fake textbook scenes | Prompt |
| `source_dependency_note` | Ignored | activity / page notes (e.g. Track 159) | direct | Copy faithfully when present | Silent audio gaps | Prompt |
| Dedicated vocabulary rows | Empty → “none verified” | `vocabulary[]` filtered by page | direct | Keep, but **reword** emptiness | False “no words” claim | Prompt + UI |
| Dedicated language rows | Empty → “no language examples” | `language[]` filtered by page | direct | Keep, but **reword** emptiness | False “no language” claim | Prompt + UI |
| Activity-specific words / models | Not collected | Nested items / notes / frames on visible activities | direct | New collector distinct from dedicated rows | Shallow chips; Exp 8–9 confound | Prompt + UI |
| Expected answers | Ignored (correct default) | `expected_answer` / item answers | internal | Keep out of auto student-facing slides; optional teacher “include answer check” later | Exp 10 Act 19 failure class | Internal (+ optional teacher) |
| Unit context | `unitContextNote` (theme / range) | `units[].theme` + page range | direct (labelled non-page) | Keep labelled | Unit dump if mislabelled | Prompt |
| Communicative aim | Page-label join | Activities + component + frames | derive | Deterministic aim from verified floor; mark as planning support | Aimless / label-echo prompts | Prompt + UI |
| Lesson package choice | Generic = single only; series only BE2 U8 fixture | Teacher choice | teacher | Enable generic single **or** two-lesson **SB-only** series when activity load warrants; no WB hardcode | Forced shallow single lesson | UI + prompt |
| Per-lesson allocation | Absent | Teacher + suggested page/activity split | teacher (+ derive suggest) | Suggest page-based L1/L2; teacher confirms | Unbalanced lessons | UI + prompt |
| Per-lesson vocabulary / models | Absent | Activity-specific collectors + teacher edit | teacher (+ derive suggest) | Separate editable lists per lesson | Vocab confound | UI + prompt |
| Concise outline | Absent | Template six-beat pattern | teacher (+ derive draft) | One short outline per lesson; not slide scripts | Book work delayed | UI + prompt |
| Teacher additions | Overlay Step 3 | Session state | teacher | Keep `[TEACHER-ADDED · UNVERIFIED]` | Lost local needs | UI + prompt |
| Prior-learning selections | Fixture-only BE2 U8 | Future retrieval / none | teacher (optional) | **Not required** for first generic version | Blocking useful routes | UI + prompt (optional) |
| Provenance labels | `[SB]` / `[HM]` / teacher-added; no `[SUPPLEMENTARY]` / `[SS]` | Handoff template | derive (rules text) | Add `[SUPPLEMENTARY]` rule; optional `[SS]` only if SS loaded | Label fusion | Prompt |
| Post-generation teacher-review status | Absent | Exp 10 gate | teacher | Explicit reminder + checklist before “done” | Unsafe answer reveals ship | UI |

---

## 3. Evidence-handling rules (recommended)

### Direct evidence → may appear as `[SB]`

Only when copied faithfully from verified canonical records:

- page identity and printed-page scope;
- activity number + instruction;
- verified `language_frame`;
- source dependency notes (e.g. Track 159);
- verified model or word pairs present as structured activity evidence.

### Safe deterministic derivation → planning support, not `[SB]`

Code may propose, clearly labelled as planning support:

- concise communicative aim from verified activities;
- grouping activity-specific models by suggested lesson;
- flagging an audio-required activity;
- suggesting a page-based L1/L2 split for teacher approval.

### Expected answers → internal verification

- Do **not** auto-promote every `expected_answer` into a student-facing reveal.
- Teacher or handoff design must explicitly choose when an answer check is needed.
- Preserve Exp 10: unsupported answer reveals require teacher checking against the book/official audio.

### Activity-specific language → truthful distinctions

Do **not** report “none verified” solely because dedicated `vocabulary[]` / `language[]` arrays are empty. Prefer:

- “No dedicated vocabulary rows are linked to these pages.”
- “Verified activity-specific words/models are available.”
- “No separate language entity is linked; an activity language frame is available.”

### Missing evidence → stay honest

Do not infer textbook content from pictures, topic similarity, or an LLM. Empty remains empty.

---

## 4. Minimum generic detailed-handoff package

Smallest useful copy-ready package for any sufficiently verified spread (prior learning optional):

1. **Copy-ready lesson title**
2. **Exact source identity and page scope**
3. **Fixed Chalkie settings** (mode, approx. duration/slides defaults, grade/theme placeholders, **audio OFF** when official audio is required)
4. **Verified activity + dependency summary** (numbers, instructions, Track/visual flags)
5. **Grammar / language / content target** (component title + frames + activity-specific models)
6. **Communicative aim** (derived planning support)
7. **Explicit inclusions and exclusions** (visible pages only; bounded “do not teach adjacent unit pages”)
8. **One or two lessons** chosen/confirmed by the teacher
9. **Separate lesson allocations** (which activities / page focus per lesson)
10. **Separate per-lesson vocabulary/model lists** (editable; not one combined dump)
11. **One concise outline per lesson** (sequence + early book work — not slide-by-slide scripts)
12. **Protected textbook work** (named pages/activities early)
13. **Provenance rules** (`[SB]` / `[SUPPLEMENTARY]` / teacher-added; `[HM]` only if selected)
14. **Official-audio handling** (teacher-directed; no invented scripts)
15. **Post-generation teacher-review reminder** (source-fidelity gate)

`[HM]` / prior-learning cards are **optional**. First generic version must work when none are available.

---

## 5. UI versus automatic behaviour

Reuse the existing four-step overlay; avoid a long configuration form.

### System assembles automatically

Evidence-backed or safely derived only:

- source identity + visible-page activities;
- dependency flags / `source_dependency_note`;
- language frames and structured activity-specific models;
- truthful dedicated-vs-activity-specific messaging;
- bounded exclusions for “other unit pages”;
- optional **suggested** L1/L2 split and draft outlines (editable).

### Teacher confirms or edits

At minimum:

- single vs two-lesson package;
- lesson allocation;
- scoped vocabulary/models per lesson;
- concise outline text;
- optional teacher additions;
- final approval before copy / generate;
- final review after generation (checklist, not silent success).

### Suggested overlay reuse (minimal)

| Step | Keep | Add (smallest) |
|---|---|---|
| 1 Current lesson | Identity + activities | Richer activity rows (number, instruction, frame, deps); honest vocab/language lines |
| 2 Prior learning | Optional / often empty | Unchanged for v1 (no retrieval requirement) |
| 3 Your choices | Teacher additions | Light edit of suggested model lists if shown early — or defer lists to Step 4 |
| 4 Lesson inputs | Title + package | Generic two-lesson **SB spread** option (not only BE2 WB fixture); allocation + per-lesson models + outlines + review gate |

---

## 6. Acceptance cases

### Primary — BE3 Unit 8 Grammar pp. 136–137

Without hardcoding this unit, a future generic builder should be capable of surfacing:

- Activities **19–23**
- Track **159** as official audio
- Regular-past spelling activity evidence
- Irregular verb-pair evidence
- Activity **23** speaking frame
- Teacher-confirmed **two-lesson** allocation
- Separate L1 and L2 model lists
- Two concise outlines
- Protected p.136 and p.137 book work
- Teacher-review requirement

The preview need **not** reproduce Experiment 10 word-for-word. It must contain the same **essential evidence and control structure**.

### Secondary regression — prevent a hidden Unit 8-specific solution

| Route | Why |
|---|---|
| **BE3 Unit 3 *Working Hard!* Language in Action SB pp. 40–41** | Already source-preflighted and used in Experiments 8–9; different unit, section type (LiA), and vocabulary pattern; verified in project evidence. |

Do **not** design or generate that lesson in this audit. Future implementation tests should resolve its visible-page activities / frames / dependencies through the same generic path.

---

## 7. Output summary

### 1) Smallest recommended implementation slice

**Deepen visible-page evidence resolution** so the existing single-lesson (and later series) prompt can tell the truth about activity-rich spreads:

- Resolve nested activity fields for visible pages: `activity_number`, `instruction`, `language_frame`, audio/visual flags, `source_dependency_note`, and structured model/word evidence from items/notes when present.
- Replace false “none verified” vocabulary/language lines with the honest dedicated-vs-activity-specific distinctions.
- Derive a short communicative-aim planning line from verified activities (not page-label echo).
- Keep expected answers out of automatic student-facing prompt lines.
- Do **not** yet build full outline editors, generic WB series, or `[HM]` retrieval in this slice.

### 2) Files likely affected

- `app/src/features/chalkie/chalkieEvidence.ts`
- `app/src/features/chalkie/resolveChalkieLessonContext.ts`
- `app/src/features/chalkie/buildChalkiePromptPreview.ts`
- `app/src/types/validation.ts` (summary shape if needed)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` (display of richer Step 1 lines only if already trivial)
- `scripts/tests/resolveChalkieLessonContext.test.ts` (extend BE3 136–137 + labels-only + BE2 fixture)

### 3) Explicitly deferred

- Hardcoded BE3 U8 / Exp 10 prompt fixtures
- Mandatory horizontal-mapping / prior-learning API
- Generic Student Book → Workbook two-lesson packaging
- Full concise-outline authoring UX
- Automatic answer-reveal slides
- Methodology lock, D018 score claims, product readiness
- Experiment 10 word-for-word prompt reproduction
- Phase 2 BI as prompt input

### 4) Acceptance criteria (for the first coding slice)

- BE3 U8 pp. 136–137 prompt/preview no longer claims “no vocabulary/language” when activity-specific models/frames exist.
- Act 23 frame and Track 159 (or equivalent `source_dependency_note` / audio flags) appear as verified evidence.
- Regular-past and irregular model evidence can appear when present in canonical activity structures.
- Communicative aim is not merely “Grammar · Grammar”.
- Labels-only spreads still return `no_page_evidence`.
- BE2 U8 fixture route remains unchanged.
- No BE3-specific hardcoded content in app code.

### 5) Risks

| Risk | Mitigation |
|---|---|
| Over-dumping Act 20 word boxes as chips | Prefer representative structured models; leave full boxes in the book |
| Labelling derived aims as `[SB]` | Explicit “planning support” wording |
| Shipping answer keys | Keep expected answers internal |
| Building a rigid form | Reuse overlay; confirm/edit, don’t over-configure |
| Hidden unit-specific logic | Secondary regression: BE3 U3 LiA pp. 40–41 |

### 6) Single next coding task

> **Implement richer visible-page activity evidence in `chalkieEvidence` / `resolveChalkieLessonContext` / `buildDynamicSingleLessonPrompt`:** surface activity numbers, instructions, `language_frame`, dependency notes/flags, and activity-specific models when present; replace false empty vocabulary/language claims with truthful dedicated-vs-activity-specific messaging; derive a short non-`[SB]` communicative aim; extend the existing BE3 136–137 tests; do not add package/outline/`[HM]` work in that prompt.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-20 | Initial gap audit vs Experiment 10; defines smallest generic detailed-handoff slice. |
