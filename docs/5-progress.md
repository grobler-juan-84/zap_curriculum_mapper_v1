# General Curriculum Mapper — Progress

**Status:** ACTIVE  

**Version:** 1.0  

**Last updated:** Step 312

**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** PAUSED at 14/18 COMPLETE (D015).

- **D017** / **D018** / **D019** / **D020** / **D021** LOCKED.

- **D021** SB-led Chalkie Workspace with optional mapped Workbook view.

- **BE3 U8 companions in resolver:** opener (series); story asymmetric (series provisional); **LiA through Review** resolver-wired (Writing/Phonics/Review 1→1; no handoff / no Chalkie). **Values p.142** SB-only confirmed; no Workbook companion expected.

- **Active lesson page scope:** one-page components inside a two-page PDF reading spread (e.g. p.140 / p.141) resolve companion + Prepare from the Go / page-control active page; true two-page mappings unchanged.

- **Activity Selection contract v0.2:** SB-only verified activity-card model + deterministic default selection/exclusion state + selected-evidence accessor implemented and tested. UI cards, Workbook cards, and handoff propagation are not implemented.

- Teacher Intelligence left-pane contract: Unit Intelligence accordion implemented.

## In progress

- Activity Selection is **ACTIVE DESIGN / PARTIALLY IMPLEMENTED**. Visible UI and current handoff output remain unchanged.

## Next

- If explicitly authorized, render SB-only Current Lesson activity cards and checkbox state from the implemented model; keep Workbook cards and handoff propagation out of that slice.
- Otherwise, separately authorize a series handoff for an already-wired companion, or move to another book/unit.
- Do not build Horizontal Mapping / School Notes / Future Suggestions yet.
- Phase 3 / F005 parked (D020). F021/F022 preserved. No automatic generation.

## Blocked

- Soft: Phase 2 closure, methodology/schema lock, Phase 3 unlock, and full prompt generation remain unauthorized without explicit owner approval.

---

## Snapshot notes

- Active Git branch: `main`.

- Entry: `/app/chalkie` — Student Book–first (D021).
