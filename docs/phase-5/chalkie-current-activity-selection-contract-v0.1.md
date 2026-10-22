# Chalkie Current Activity Selection Contract

**Status:** ACTIVE DESIGN / NOT YET IMPLEMENTED  
**Version:** 0.1  
**Scope:** Teacher curation of verified current-lesson activities before local handoff assembly

---

## Purpose

The Chalkie Workspace **Current Lesson** step will eventually show verified current-page activity cards. Teachers will be able to keep or exclude specific activities before the local Chalkie handoff is assembled.

This is a **teacher-curation layer**. It is not an AI decision, an evaluation of textbook quality, or an edit to the textbook or its canonical evidence. This contract defines intended behaviour only; it does not authorize UI, schema, resolver, handoff-builder, canonical-data, or Chalkie-generation changes.

## 1. Placement in the workflow

The updated local workflow is:

1. Verified SB/WB/SS evidence
2. Verified activity-level page evidence
3. Teacher selects current activities to include
4. Teacher optionally selects prior learning
5. Local platform adapter assembles the handoff
6. Chalkie generates a draft
7. Teacher reviews and approves or corrects the draft

Activity selection happens **before prior-learning selection**. Current-page source curation must be settled first so optional prior learning cannot silently replace, redefine, or obscure the lesson's verified current evidence.

## 2. Current Lesson card layout

On the **Current Lesson** step:

- Show Student Book activity cards first.
- If a verified Workbook companion exists, show Workbook activity cards below the Student Book cards.
- For each visible page pair, use two columns:
  - SB left-page activities | SB right-page activities
  - WB left-page activities | WB right-page activities
- For a one-page active lesson scope, show only that active page's cards, even when the PDF viewer keeps a two-page spread visible.
- Show the Workbook section only when an evidence-backed companion is resolved for the active lesson scope.

Each activity card must contain only verified evidence:

- source label and printed page, such as `[SB p.132]` or `[WB p.107]`;
- activity number and/or verified activity title or instruction;
- a short verified preview of language, model, vocabulary, or task evidence when safely available;
- an honest empty state when no safe preview is available.

Do not invent a polished teaching summary when source evidence is incomplete. An empty preview is more truthful than inferred source content.

## 3. Selection behaviour

- Select all eligible current-page activity cards by default.
- A checkbox controls inclusion.
- Clicking elsewhere on a card may later reveal details, but must not silently change selection.
- Excluding a card means: **do not include this activity as source content in the local handoff.**
- Exclusion does not remove, alter, or condemn the textbook activity.
- A teacher may exclude a weak song, low-value activity, or unsuitable material and reinforce useful language through separately selected prior learning.
- If all current activities are deselected, show a simple warning: **The handoff will contain no selected current-page activities.**
- Do not automatically select replacement prior learning.
- Do not infer that students have mastered excluded or prior material.

Selections are explicit teacher choices. No AI ranking, recommendation, or automatic substitution is required.

## 4. Effects on the local handoff

Only selected current activities may feed:

- the detailed platform handoff;
- the concise teacher-controlled outline;
- suggested scoped vocabulary;
- activity evidence and verified language or models.

Selected prior learning remains separate and clearly labelled `[PRIOR]` or `[HM]`. Teacher-added unverified support remains separately labelled and must not be presented as publisher evidence.

Excluded activity content must not reappear accidentally through a generic page-level summary, outline, vocabulary list, teaching focus, or other derived handoff field. Later implementation needs focused tests proving that exclusion propagates through **every** local handoff artifact and that no broad page-level fallback reintroduces excluded evidence.

## 5. Evidence quality and manual verification

Activity cards improve manual book verification because:

- missing activity records become visible rather than hidden inside a broad page summary;
- weak or incomplete extracted language is exposed through honest empty states;
- teachers can compare each card directly with the visible PDF;
- selection decisions are transparent before prompt generation;
- individual source records become easier to inspect and correct through the existing verification process.

This supports human verification; it does not replace it. Cards do not make source data automatically complete or correct, and selection does not certify the underlying extraction.

## 6. Boundaries

- No AI or API is required to render cards or assemble selections.
- No Chalkie generation occurs during activity selection.
- Do not change canonical evidence, Book Intelligence, D018, [`../4-decisions.md`](../4-decisions.md), or the future-platform architecture.
- This contract applies first to Chalkie Workspace, but activity selection belongs to the future neutral lesson-package layer and should be reusable by future platform workspaces.
- Preserve the distinction between:
  - verified current-page evidence;
  - teacher-selected prior learning;
  - teacher-added unverified support;
  - Phase 2 Unit Intelligence.
- Unit Intelligence remains interpretation/planning support and must not populate current activity cards or bypass activity selection.
- Workbook cards require a verified companion for the active lesson scope; no companion may be inferred from page proximity.

## 7. Acceptance cases for later implementation

### 7.1 True SB two-page spread

Given a verified two-page SB lesson component with activities on both pages, the Current Lesson step shows separate left- and right-page columns. All eligible cards start selected. Excluding one card removes only that activity's evidence from every handoff artifact; the other page and selected activities remain.

### 7.2 SB→WB paired component

Given an active SB lesson scope with a verified WB companion, SB activity cards appear first and WB cards appear below in their own page columns. Source labels remain distinct. Only selected SB and WB activities feed the handoff; WB evidence is never presented as SB evidence.

### 7.3 One-page active scope inside a visible two-page PDF spread

Given BE3 U8 Writing p.140 active while pp.140–141 remain visible, show only `[SB p.140]` activity cards and, through the verified companion, only `[WB p.115]` cards. Do not show p.141 Phonics or WB p.116 activity cards, and do not create a composite lesson scope.

### 7.4 SB-only page

Given BE3 U8 Values p.142 active, show only `[SB p.142]` activity cards. Do not render a Workbook section or infer a companion from adjacent Review p.143.

### 7.5 Activity without safely extractable language

Given a verified activity record with a source label and title/instruction but no safely extractable language, render the card with an honest preview-empty state. Do not generate a model, vocabulary list, or polished teaching summary.

### 7.6 All activities deselected

Given that the teacher deselects every eligible current activity, show the no-current-activities warning. The local handoff contains no current-page activity evidence, language/models, scoped vocabulary, teaching focus, or outline content derived from those activities. Do not select prior learning automatically; any prior learning remains a separate explicit teacher choice.

## Implementation gate

The smallest later implementation slice is a **read-only current-activity card model and deterministic selector for Student Book evidence only**, scoped to the active lesson pages, with default-selected checkboxes and exclusion-propagation tests. Workbook cards and handoff-builder consumption should follow only after that model preserves provenance and honest empty states.

