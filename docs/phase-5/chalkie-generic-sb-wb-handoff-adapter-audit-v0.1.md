# Generic Two-Lesson SB→WB Handoff Adapter Audit

**Status:** ACTIVE / BOUNDED IMPLEMENTATION — neutral assembler + shared dispatch; Opener-only guarded canary implemented (default off)
**Version:** 0.7
**Date:** 2026-10-22  
**Scope:** Smallest reusable input structure for a future generic two-lesson handoff built from an exact verified Student Book → Workbook companion

---

## 1. Purpose and boundary

This audit compares the two accepted bespoke BE3 Unit 8 local handoffs:

- **Opener:** SB pp.128–129 → WB pp.104–105
- **Story:** SB pp.130–131 → WB p.106

The goal is to identify the smallest reusable, data-driven structure that can assemble either neutral package without embedding component-specific evidence in another platform renderer.

**Implementation status:** **neutral package assembler implemented for accepted Opener and Story pairs only.** `buildNeutralSbWbLessonPackage.ts` implements the bounded contract below from exact curated relationship data plus existing selected SB/WB evidence. It rejects other resolver-wired relationships. **Opener and Story shadow-renderer parity proved.** **Shared Chalkie dispatcher supports the parity-proved Opener and Story packages only.** **Opener-only guarded canary implemented; default off; bespoke fallback on mismatch; Story and all other relationships remain bespoke.** Flag: `VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY`. See [`chalkie-neutral-package-production-migration-plan-v0.1.md`](./chalkie-neutral-package-production-migration-plan-v0.1.md).

The core separation is:

1. **Neutral curriculum and teacher-curation package** — verified scope, selected evidence, purposes, provenance, boundaries, and explicit teacher choices.
2. **Platform adapter** — renders that package into Chalkie title, detailed prompt, outlines, vocabulary chips, and workflow instructions. A future MagicSchool or Canva adapter could render the same package differently without rebuilding evidence or mappings.

---

## 2. Current bespoke handoffs side by side

| Concern | Opener: SB 128–129 → WB 104–105 | Story: SB 130–131 → WB 106 | Reusable conclusion |
|---|---|---|---|
| Verified relationship | Exact curated opener relationship | Exact curated asymmetric Story relationship | Relationship ID and exact SB/WB page IDs must be required inputs; page proximity is never enough. |
| Page shape | 2 SB → 2 WB | 2 SB → 1 WB | Page arrays must be variable-length and preserve exact verified scope. |
| Component | Vocabulary/song opener | Story/reading | Component identity is data, not a switch that guesses content. |
| Package identity | Bespoke series title + stable reference | Bespoke series title + stable reference | Keep neutral naming ingredients separate from platform-formatted title/reference output. |
| Lesson 1 purpose | Introduce/practise healthy-living phrases, song context, short answers | Support story listening/reading and comprehension | Purpose is a bounded planning field, not derivable safely from page numbers alone. |
| Lesson 2 purpose | Consolidate with past/contrast writing, personal responses, song practice | Consolidate story with short answers, personal reflection, categorisation | L2 purpose must be explicit and tied to verified WB evidence. |
| Selected SB evidence | Activity wording, item evidence, audio dependency, models | Story activity wording, expected answer, audio dependency, comprehension | One selected-activity shape can carry wording, answers/tasks, models, and dependencies. |
| Selected WB evidence | Activities 1–4 across two pages | Activities 5, 6, THINK BIG on one page | Same selected-activity shape; activity labels need not be numeric. |
| Vocabulary | Dedicated SB/WB lists when conservatively attributable | Honest “no dedicated SB vocabulary”; WB words/models | Vocabulary is per lesson, may be empty, and needs provenance/attribution status. |
| Language/models | Did…? short answers and personal-response frames | Story answer frame and personal dinner frame | Language/models are per lesson and selected-activity-sensitive. |
| Audio | Multiple official tracks/song dependencies | SB Story audio; WB activities may be non-audio | Audio is optional activity evidence with a source note; never invent scripts. |
| Concise outlines | Curated L1/L2 activity sequence plus supplementary close | Curated Story/WB sequence plus supplementary close | Neutral package needs ordered lesson activity references; Chalkie wording and supplementary steps remain adapter policy. |
| Source labels | `[SB]`, `[WB]`, `[PRIOR]`, teacher-added, supplementary | Same broad provenance families | Provenance is neutral metadata; bracket formatting is adapter rendering. |
| Hard boundaries | Exact pages; exclude later components; no invented lyrics/items | WB106 only; no WB107; no opener import unless selected as prior | Exact page scope and anti-reconstruction rules are reusable; component-specific exclusions stay explicit data. |
| Partial selection | Rebuild from selected activity evidence; conservative page attribution | Same | One neutral selection policy can serve both. |
| Zero selection | Honest empty SB/WB lesson state; package remains structurally valid | Same | Empty state belongs in the package; adapters render it without fallback substitution. |
| Output | Relationship ID, title, stable ref, detailed handoff, L1/L2 outline and vocabulary | Same six outputs | Output shape is common, but these strings are Chalkie renderings rather than neutral source data. |

### Main duplication observed

Both builders independently implement:

- prior-support formatting;
- all-selected versus selection-aware prompt branches;
- selected SB/WB activity rendering;
- honest vocabulary/language empty states;
- zero-selected lesson handling;
- source labels and anti-reconstruction boundaries;
- L1/L2 outline assembly;
- final six-field Chalkie output packaging.

The accepted output differs mainly in verified scope, component identity, purpose, selected evidence, vocabulary/language availability, audio dependencies, and component-specific guidance. Those differences should become inputs, not additional builder forks.

---

## 3. Proposed generic input contract — plain language

The smallest neutral package should contain the following.

### A. Package identity

- **Verified relationship ID** from the existing companion resolver.
- **Catalog book identities** for SB and WB.
- **Series, level, unit number, and unit title**.
- **Component identity**: stable component key plus teacher-facing label (for example vocabulary, story, LiA, CLIL, grammar, culture, writing, phonics, or review).
- **Stable neutral package reference** based on verified scope, not a Chalkie title.

### B. Exact source scope

- **Lesson 1 source:** `SB`, exact verified page IDs, exact printed pages.
- **Lesson 2 source:** `WB`, exact verified companion page IDs, exact printed pages.
- **Relationship shape:** derived from those arrays (for example 2→2, 2→1, or 1→1), never inferred from adjacent pages.
- **Scope boundaries:** explicit exclusions or warnings needed for this pair, such as “WB p.106 only”.

An SB-only component has no WB companion and must not be coerced into this SB→WB package. It should return an honest “no verified Workbook companion” eligibility result and stay on an SB-only packaging path.

### C. Per-lesson intent

For each lesson:

- a short **purpose** grounded in the verified component and activities;
- its source book and exact page scope;
- ordered selected activity evidence;
- selected-activity-sensitive vocabulary;
- selected-activity-sensitive language/models;
- optional audio/source-dependency notes;
- an honest vocabulary/language empty state where applicable;
- a zero-selected state that keeps the lesson slot valid without reconstructing source content.

Purpose must be supplied from reviewed planning data or a teacher-approved bounded derivation. The generic adapter must not invent it from component name alone.

### D. Selected activity evidence

Each selected SB or WB activity needs:

- stable activity/card ID and original verified reference;
- source (`SB` or `WB`);
- page ID and printed page;
- activity number/label when present;
- verified instruction/title;
- verified task/answer evidence when present;
- verified language frame or activity-linked models when present;
- audio dependency and source note when present;
- original ordering within the exact source scope.

The package also needs enough selection metadata to know:

- all eligible activities for each page;
- which activities are selected;
- whether a page remains fully selected;
- whether an entire lesson has zero selected activities.

This preserves the accepted conservative rule: page-attributed vocabulary/language may survive only when every eligible activity on that page remains selected.

### E. Prior and teacher-added support

Each optional support item must be a separate record with:

- stable ID;
- provenance kind: `PRIOR`, `HM`, or `TEACHER_ADDED_UNVERIFIED`;
- label and language/frame;
- source/evidence reference for `PRIOR` or `HM`;
- optional teacher purpose/note;
- **explicit lesson targets**: Lesson 1, Lesson 2, or both by deliberate selection;
- teacher-selected state.

No support item is part of SB/WB current-page evidence.

### F. Sequence and packaging controls

- ordered current-source activity references for Lesson 1 and Lesson 2;
- optional, explicitly labelled supplementary step intents;
- teacher-confirmed two-lesson package shape;
- empty-selection behavior for each lesson;
- neutral source/provenance labels and hard-boundary semantics.

The neutral package should not contain final Chalkie sentences, slide instructions, or vocabulary-chip formatting.

---

## 4. Prior learning and teacher-added support

Prior support is required in the design even though it is optional in any individual handoff.

### Provenance classes

- **`[PRIOR]`** — teacher-selected evidence from earlier pages in the same unit.
- **`[HM]`** — future teacher-selected horizontal-mapping evidence from earlier units in the same book.
- **`[TEACHER-ADDED · UNVERIFIED]`** — teacher-authored support that is not publisher-verified prior evidence.

### Safety rules

All three classes:

- are optional teacher choices;
- are available support only, never compulsory lesson content;
- remain structurally separate from selected current SB/WB activity evidence;
- never replace an excluded or zero-selected SB/WB activity;
- never reconstruct an activity instruction, answer, vocabulary, language, or model;
- may be rendered only where they fit naturally;
- require explicit Lesson 1 and/or Lesson 2 targeting rather than an assumption that each item belongs in both lessons;
- must remain correctly labelled in the detailed handoff and, when used as an outline step, in the relevant lesson’s concise outline.

`[PRIOR]` and `[HM]` require inspectable evidence/source metadata. Teacher-added support must always retain its unverified label. Prior exposure is not evidence of mastery.

### Current-builder gap

The bespoke builders currently accept one series-level `selectedSuggestions` list plus teacher additions and render them in the detailed handoff. They do not encode per-lesson targeting, and their bespoke L1/L2 outline builders do not place selected prior or teacher-added support into a specific lesson outline. Also, the shared suggestion type defaults missing provenance to `[HM]`, while the two BE3 bespoke prior blocks default missing provenance to `[PRIOR]`; their source-label legends define `[PRIOR]` but not `[HM]`, even though a supplied suggestion can carry `[HM]`.

A generic contract must remove that ambiguity:

- provenance is required, not inferred by a builder default;
- lesson targeting is explicit;
- every provenance class present in the package is defined by the platform renderer;
- detailed-handoff and outline renderers consume the same targeted support records.

---

## 5. Legitimate variable fields

The future design must support these without new component-specific builder forks:

- **Asymmetric mappings:** 2 SB pages → 1 WB page, as in Story.
- **One-page pairs:** 1 SB page → 1 WB page.
- **Two-page pairs:** 2 SB pages → 2 WB pages.
- **Component type:** vocabulary, story, LiA, CLIL, grammar, culture, writing, phonics, or review.
- **No dedicated vocabulary:** preserve an honest empty/limited state; do not import a nearby component’s words.
- **Optional audio:** activity-level dependency only; no invented scripts, lyrics, tracks, or answer keys.
- **SB-only components:** not eligible for an SB→WB package; no fake WB Lesson 2.
- **Zero selected SB activities:** valid empty Lesson 1 state; no prior-support substitution.
- **Zero selected WB activities:** valid empty Lesson 2 state; no SB substitution or adjacent-WB leakage.
- **Non-numeric activity labels:** for example `THINK BIG`.
- **Different purpose/sequence needs:** purposes and ordered activity references are data; component type alone does not determine pedagogy.

---

## 6. Neutral package versus Chalkie rendering

| Neutral curriculum / teacher-curation fields | Chalkie-specific rendering fields |
|---|---|
| Verified relationship, book IDs, unit, component | Chalkie title wording and punctuation |
| Exact SB/WB page IDs and printed-page scope | Detailed Chalkie prompt prose and section headings |
| Selected SB/WB activity evidence and ordering | Concise Chalkie outline wording/numbering |
| Per-lesson purpose | Vocabulary-chip string formatting |
| Per-lesson vocabulary and language/models with provenance | Chalkie source-label presentation such as bracket syntax |
| Audio/source dependencies | Chalkie-specific instructions about book work, slide economy, or generation behavior |
| Zero/partial/all-selected state | Chalkie generation settings and Topic/Refine/Theme workflow |
| `[PRIOR]`, `[HM]`, teacher-added records with explicit lesson targets | Chalkie pre-generation entry and post-generation review procedure |
| Hard scope and anti-reconstruction semantics | Platform-specific review/checklist language |
| Stable neutral package reference | Chalkie-facing title and copied stable-reference presentation |

The neutral side is durable evidence and teacher intent. The right side is an adapter. A future MagicSchool or Canva workspace should consume the neutral side and produce its own prompt, outline, structured fields, or export without re-resolving companions or recreating activity selection.

This bounded assembler does not authorize those adapters or claim broader component/platform support.

---

## 7. Known exceptions and gaps

1. **The neutral package is bounded to two accepted pairs.** Opener and Story are implemented; no other resolver-wired relationship is eligible.
2. **All-selected and partial-selection paths differ.** The test-only Opener and Story shadow renderers preserve accepted all-selected prose exactly and render partial/zero states only from neutral selected evidence. Production still uses the bespoke builders.
3. **Purpose is not canonical evidence.** It needs a reviewed planning source or explicit teacher confirmation; it must not be guessed from a component label.
4. **Production rendering still lacks lesson-targeted support consumption.** The neutral package preserves explicit targets, but existing series inputs remain shared across the series and bespoke outlines omit targeted prior/support steps.
5. **Production provenance defaults remain inconsistent.** The neutral package requires explicit provenance, but existing renderers have not migrated.
6. **Supplementary closing steps are bespoke.** They are adapter/teacher policy, not publisher activity evidence.
7. **Only two BE3 series are accepted exemplars.** They demonstrate 2→2 vocabulary/song and 2→1 Story, but not LiA, CLIL, grammar, culture, writing, phonics, review, 1→1, or another publisher.
8. **Resolver-wired does not mean handoff-approved.** Existing LiA–Review mappings must not automatically unlock generic series packaging.
9. **SB-only two-lesson policy is a separate question.** This SB→WB adapter must not invent WB evidence for an SB-only component.
10. **No Chalkie generation or classroom validation follows from package assembly.** Existing owner acceptance covers local handoff curation only.

---

## 8. Explicit non-goals

- Wiring any neutral-package renderer into production UI/output.
- Replacing or refactoring the accepted opener/Story builders.
- Adding a new component-specific handoff.
- Changing Activity Selection UI, state, or propagation.
- Changing canonical evidence, Book Intelligence, verified companion mappings, D018, Chalkie templates, or decisions.
- Designing a database schema or persistence mechanism.
- Implementing `[HM]` retrieval.
- Authorizing Chalkie, MagicSchool, Canva, or other platform generation.
- Claiming classroom validity, cross-component generality, or cross-publisher generality.

---

## 9. Implemented slice and smallest next step

The separately authorized **read-only neutral package assembler and contract tests** are now implemented:

1. Define the minimal neutral package/input types described in §3.
2. Adapt the existing verified resolver plus selected SB/WB evidence into that package for the opener and Story fixtures.
3. Require explicit provenance and lesson targets for optional support records.
4. Assert exact scope, ordering, conservative attribution, partial/zero-selection states, and no WB107 leakage.
5. The package is not wired into the UI and does not replace either production builder.
6. Existing focused selection, resolver, and handoff tests remain green.

This proves the reusable data boundary without changing accepted handoff output.

The separately authorized **Opener test-only shadow-renderer parity slice** is also implemented:

1. `renderBe3U08OpenerNeutralPackageToChalkieShadow.ts` accepts only the exact accepted Opener neutral package.
2. Its all-selected detailed handoff, Lesson 1 outline/vocabulary, and Lesson 2 outline/vocabulary match the established bespoke builder byte-for-byte.
3. Partial and zero-selection rendering consumes only package-selected activity, vocabulary, language, and audio evidence; exclusions cannot return through the accepted all-selected template.
4. Optional `[PRIOR]`, `[HM]`, and `[TEACHER-ADDED · UNVERIFIED]` support preserves explicit Lesson 1 / Lesson 2 targeting.
5. The renderer is imported only by focused tests; production UI, preview, copy actions, routing, and bespoke builders remain unchanged.

The separately authorized **asymmetric Story test-only shadow-renderer parity slice** is now implemented:

1. `renderBe3U08StoryNeutralPackageToChalkieShadow.ts` accepts only the exact accepted Story package: SB pp.130–131 → WB p.106.
2. Its all-selected detailed handoff, Lesson 1 outline/vocabulary, and Lesson 2 outline/vocabulary match the established bespoke Story builder byte-for-byte.
3. Every artifact remains WB p.106-only; WB p.107 and facing-page placeholder content are absent.
4. Partial/zero rendering consumes only package-selected evidence, preserves the honest no-dedicated-SB-vocabulary state, and never substitutes opener or adjacent-page content.
5. Optional support preserves `[PRIOR]`, `[HM]`, or `[TEACHER-ADDED · UNVERIFIED]` provenance plus explicit Lesson 1 / Lesson 2 targets.
6. The Opener proof, both bespoke builders, and all production UI/output remain unchanged.

The separately authorized **test-only shared dispatcher** is now implemented:

1. `renderChalkieFromNeutralPackage.ts` dispatches by exact verified relationship ID to the existing Opener or Story shadow renderer.
2. Both parity and selection-safety test suites now enter through the dispatcher.
3. Unsupported relationships throw typed `UnsupportedNeutralPackageRendererError`; there is no generic fallback or partial output.
4. The dispatcher has no production call site and does not broaden renderer eligibility.

**Opener-only guarded canary (v0.2 plan):** [`chalkie-neutral-package-production-migration-plan-v0.1.md`](./chalkie-neutral-package-production-migration-plan-v0.1.md) — implemented with `VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY` (default off). Exact five-artifact parity serves neutral output; mismatch/failure serves bespoke and emits a bounded developer diagnostic. Story is not canaried.

**Smallest next step:** locally enable the Opener canary flag and review evidence; do not authorize a Story canary or bulk migration automatically.
