# Chalkie Current Activity Selection Contract

**Status:** ACTIVE / PARTIALLY IMPLEMENTED  
**Version:** 0.7  
**Scope:** Teacher curation of verified current-lesson activities before local handoff assembly

---

## Purpose

The Chalkie Workspace **Current Lesson** step shows verified current-page Student Book activity cards and, when an exact verified companion resolves, the mapped Workbook activity cards. Teachers can keep or exclude specific activities in the current modal session before moving to prior learning.

This is a **teacher-curation layer**. It is not an AI decision, an evaluation of textbook quality, or an edit to the textbook or its canonical evidence.

**Implementation status:** **SB activity selection propagates into the local handoff. Workbook activity cards and session-only Workbook selection are implemented, but Workbook selection propagation is not yet implemented.** Current Lesson uses a compact lesson-identity line and separate evidence-shaped SB and WB book surfaces. Both models default every eligible card to selected and preserve checkbox state across Back/Continue while the modal stays open. Only SB selection controls the detailed prompt, concise outline, suggested vocabulary, selection-derived language/models, and selection-sensitive teaching focus.

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

- Show one compact selected-book/unit identity line and one short selection instruction; do not repeat the full lesson metadata, words/models, language, teaching-focus, or provenance summary above the cards.
- Show Student Book activity cards first.
- When an exact verified companion resolves, show a separate **Workbook activities** section beneath the SB spread with its own count and source note.
- Always present a displayed SB or WB section as two equal page panels with a subtle central gutter.
- For a genuine two-page SB lesson scope, both panels contain their real scoped activity cards:
  - SB left-page activities | SB right-page activities
- For a one-page active lesson scope, keep the active page in its physical position (even printed page on the left; odd printed page on the right) and render the facing panel as a quiet visual placeholder.
- A placeholder contains no activity evidence, cards, checkboxes, vocabulary, or selection state. Its message is **Not included in this lesson scope.**
- Use most of the modal width while retaining approximately 24–32px desktop content padding.
- Keep the footer unchanged and the final activity cards scrollable above it.

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
- If all current activities are deselected, show: **No current Student Book activities are selected. A later handoff would contain no selected current-page activities.**
- State plainly: **Selected activities will be included in this local handoff.**
- Workbook cards have separate session-only selection state and count. If all eligible WB cards are unchecked, show a quiet Workbook-specific warning.
- State plainly below the Workbook section: **Workbook activity selection is saved for this session. Current Chalkie handoff content is unchanged until a later implementation step.**
- Do not automatically select replacement prior learning.
- Do not infer that students have mastered excluded or prior material.

Selections are explicit teacher choices. No AI ranking, recommendation, or automatic substitution is required.

## 4. Effects on the local handoff

Only selected current activities feed:

- the detailed platform handoff;
- the concise teacher-controlled outline;
- suggested scoped vocabulary;
- activity evidence and verified language or models.

Selected prior learning remains separate and clearly labelled `[PRIOR]` or `[HM]`. Teacher-added unverified support remains separately labelled and must not be presented as publisher evidence.

Excluded activity content must not reappear through a generic page-level summary, outline, vocabulary list, teaching focus, page label, bespoke series-builder fallback, or other derived handoff field. When any eligible activity is excluded, activity evidence is assembled from selected records only; broad page-level teaching focus and unit context are omitted. With no selected activities, the handoff states that explicitly and instructs Chalkie not to reconstruct current-page work. Prior learning remains separately labelled and never substitutes automatically.

### Conservative vocabulary attribution

- Activity-linked item models and language frames may be included when their activity is selected.
- Dedicated vocabulary or language attributable only to a page may be included only while **all eligible activities on that source page remain selected**.
- Once a page is partially selected, do not use page-level vocabulary or language as fallback evidence.
- If safe attribution is unavailable, emit the existing honest empty state rather than guessing.

For a current SB→WB two-lesson series, SB selection controls Lesson 1 only. Workbook card selection is deliberately not passed to prompt, outline, vocabulary, title, or series-handoff builders; Workbook Lesson 2 remains unchanged until a separately authorized propagation slice.

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

### Workbook layout constraint — implemented

The Workbook activity section preserves the verified companion's actual page position inside an open-book spread:

- a two-page SB component may map to only one Workbook page, as with Story;
- a component may have no Workbook companion, as with Values;
- render cards only for Workbook pages present in the verified companion relationship;
- when one verified WB page is mapped, retain its physical left/right slot and render the facing panel as a quiet, non-selectable visual placeholder with **No verified Workbook content for this lesson.**
- never populate a facing placeholder from an adjacent Workbook page.

The implementation does not infer mappings, broaden the resolver, or change any verified SB→WB relationship.

## 7. Acceptance cases

### 7.1 True SB two-page spread

Given a verified two-page SB lesson component with activities on both pages, the Current Lesson step shows separate left- and right-page columns. All eligible cards start selected. Excluding one card removes only that activity's evidence from every handoff artifact; the other page and selected activities remain.

### 7.2 SB→WB paired component

Given an active SB lesson scope with a verified WB companion, a Workbook section appears below the SB picker. A 2→1 Story mapping renders WB p.106 in the left slot and a quiet right placeholder; it never renders WB p.107 activity content. A one-page odd-numbered companion renders in the right slot with a left placeholder. Values has no companion and renders no Workbook section. Source labels remain distinct. Workbook choices are session-only and do not feed the handoff yet.

### 7.3 One-page active scope inside a visible two-page PDF spread

Given BE3 U8 Writing p.140 active while pp.140–141 remain visible, show `[SB p.140]` activity cards in the left panel and a quiet p.141-facing placeholder on the right. Its verified WB p.115 companion appears in the right panel with a quiet left placeholder. Do not show p.141 Phonics or WB p.116 activity cards, and do not create a composite lesson scope.

### 7.4 SB-only page

Given BE3 U8 Values p.142 active, show `[SB p.142]` activity cards in the left panel and a quiet p.143-facing placeholder on the right. Do not render a Workbook section or infer a companion from adjacent Review p.143.

### 7.5 Activity without safely extractable language

Given a verified activity record with a source label and title/instruction but no safely extractable language, render the card with an honest preview-empty state. Do not generate a model, vocabulary list, or polished teaching summary.

### 7.6 All activities deselected

Given that the teacher deselects every eligible current activity, show the no-current-activities warning. The local handoff contains no current-page activity evidence, language/models, scoped vocabulary, teaching focus, or fabricated outline activity steps, and explicitly prohibits reconstruction from page context. Do not select prior learning automatically; any prior learning remains a separate explicit teacher choice.

## Implementation gate

The bounded SB propagation and Workbook visual/session-state slices are complete:

- read-only Student Book activity-card data from `human_verified` activity rows only;
- active-lesson-page scoping;
- stable IDs backed by original activity IDs;
- safe evidence previews with an explicit empty state;
- all eligible cards selected by default;
- deterministic include/exclude helpers that reject stale IDs;
- a selected-evidence accessor plus exclusion tests;
- Current Lesson SB activity cards grouped under their actual active page(s);
- compact book/unit context followed by a wide, book-spread-style picker;
- every displayed SB/WB section renders an open-book two-panel spread with a subtle gutter; one-page scopes retain physical left/right position and use a visual-only facing placeholder;
- checkbox-only inclusion controls, selection count, honest preview/record empty states, and an all-unselected warning;
- session-only selection preserved across Current Lesson → Prior Learning → Back;
- explicit notice that selected activities feed the local handoff;
- selected-only detailed prompt, concise outline, suggested vocabulary, language/models, and selection-sensitive focus;
- no page-level fallback leakage, including an honest all-unselected state;
- selected-only SB Lesson 1 in supported series, with Workbook Lesson 2 unchanged.
- verified Workbook cards gated by the resolver's exact companion page IDs and `human_verified` activity rows;
- separate WB card IDs, state, count, all-unselected feedback, and stale-ID rejection;
- WB two-page companions render two real panels with a gutter; 2→1 and 1→1 companions retain the verified page's physical slot plus a non-content facing placeholder; no-companion lessons render no WB section;
- Workbook selection persists through Current Lesson → Prior Learning → Back;
- Workbook selection does not alter any local Chalkie handoff artifact.

The next smallest implementation slice is separately authorized **Workbook selection propagation**, with strict selected-only WB evidence and no regression to the existing SB propagation or verified companion scope.

