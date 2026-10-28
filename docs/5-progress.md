# General Curriculum Mapper — Progress

**Status:** ACTIVE  

**Version:** 1.0  

**Last updated:** Step 368

**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** PAUSED at 14/18 COMPLETE (D015).

- **D017** / **D018** / **D019** / **D020** / **D021** / **D022** / **D023** LOCKED.

- **D022:** Neutral Lesson Package is the durable handoff; BI may enter only as optional labelled `curriculumInterpretation` (never page evidence).

- **BI → NLP vertical slice (BE3 U8 Opener):** `toBiPlanningContext` filter; assembler optional attach; detailed lesson plan labelled section; optional Chalkie BI framing behind `VITE_CHALKIE_BE3_U08_OPENER_BI_FRAMING` (default off).

- **D021** SB-led Chalkie Workspace with optional mapped Workbook view.

- **Neutral SB→WB packages + shared dispatcher** for Opener and Story; limited Opener and Story canaries **MANUALLY ACCEPTED**.

- **Prior Learning:** same-unit `[PRIOR]` + curated `[HM]` (BE2 U8 opener) + session `[TEACHER-ADDED · UNVERIFIED]`.

- **Create-a-prompt modal:** five-page flow with optional WB skip; fixed-height shell; SB/WB chrome trimmed.

- **Neutral `CurrentLessonContext`:** left panel Book Content + Book Intelligence from one assembler; shared verified activity cards with Create-a-prompt.

- **Left-panel activity selection:** workspace-owned SB/WB selection is authoritative; Create-a-prompt opens as review of the same state; shared `ActivityEvidenceCard`; deselections cannot re-enter handoff.
- **Modal open-book review layout:** equal-height SB/WB page panels fill the modal body; activity cards expand to content with page-column scroll only; left panel stays unbounded.

- **D023 bounded activity-enrichment POC (simplified):** exact BE3 U8 SB pp. 128–129 five-activity scope; five immutable experimental summary sidecars only; Activity 3 insufficient-evidence guard; lesson-specific experimental package of selected activities + publisher-evidence refs + summaries; default-off development flag. Optional Teaching Guidance removed from the active POC and parked (F025). No canonical/SS, database, bulk, production route, or generation-adapter changes.

- Unused BI PDF/e2e verifier scripts archived under `scripts/archive/bi-pdf-verifiers/`. No further BI book expansion until Opener slice is owner-accepted.

## In progress

- Owner review of the default-off BE3 U8 activity-enrichment POC and its five summary records.
- Owner review of BI planning-context value on BE3 U8 Opener detailed lesson plans.

## Next

- With the development flag enabled locally, smoke-test the five BE3 U8 cards: summary readability, Activity 3 insufficient-evidence warning, selection behaviour, and experimental package preview.
- Smoke-test Create-a-prompt + left-panel selection beside the PDF (defaults, deselect, scope change; rich vs sparse modal cards).
- Accept or refine the Opener BI planning-context slice before expanding BI to other books/components.
- Author a **new verified curated `[HM]` target pack** when ready (not School Notes).
- Pause further canaries / bulk NLP migration until owner directs.
- Relocate `currentLessonContext` + neutral builder cluster out of `features/chalkie/` only as a deliberate follow-up (F023 remainder).

## Blocked

- Soft: curated `[HM]` coverage expansion — no second verified target pack yet.
- Soft: broad Neutral Lesson Library implementation, persistent enrichment storage, production routing, Optional Teaching Guidance reintroduction, and expansion beyond the five-activity POC remain unauthorized.
- Soft: Phase 2 methodology/schema lock, Phase 3 unlock, and full prompt generation remain unauthorized without explicit owner approval.

---

## Snapshot notes

- Active Git branch: `main`.

- Entry: `/app/chalkie` — Student Book–first (D021); NLP + optional BI interpretation (D022); activity selection owned by the left-panel curriculum surface.
