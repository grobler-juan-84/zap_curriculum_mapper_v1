# General Curriculum Mapper — Progress

**Status:** ACTIVE  

**Version:** 1.0  

**Last updated:** Step 316

**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** PAUSED at 14/18 COMPLETE (D015).

- **D017** / **D018** / **D019** / **D020** / **D021** LOCKED.

- **D021** SB-led Chalkie Workspace with optional mapped Workbook view.

- **BE3 U8 companions in resolver:** opener (series); story asymmetric (series provisional); **LiA through Review** resolver-wired (Writing/Phonics/Review 1→1; no handoff / no Chalkie). **Values p.142** SB-only confirmed; no Workbook companion expected.

- **Active lesson page scope:** one-page components inside a two-page PDF reading spread (e.g. p.140 / p.141) resolve companion + Prepare from the Go / page-control active page; true two-page mappings unchanged.

- **Activity Selection contract v0.5:** Current Lesson is activity-first, with compact verified SB cards, deterministic session selection, selection feedback, and Back/Continue persistence.

- **SB handoff propagation:** selected activities now control detailed prompt evidence, concise outline, suggested vocabulary, language/models, selection-sensitive focus, and supported-series SB Lesson 1. Partial/empty selections cannot fall back to broad page content; Workbook Lesson 2 remains unchanged.

- **Workbook activity selection UI:** exact verified companions now show `human_verified` WB activity cards beneath the SB spread. WB cards default selected, keep separate session state across Back/Continue, and render exact two-page / left-aligned one-page / no-companion shapes.

- Teacher Intelligence left-pane contract: Unit Intelligence accordion implemented.

## In progress

- Activity Selection is **ACTIVE / PARTIALLY IMPLEMENTED**. SB selection propagates into the local handoff; WB cards and session-only selection are implemented, but WB propagation is not.

## Next

- Owner manually checks BE3 U8 pp.128–129 exclusion/restore propagation and unchanged Workbook output, plus p.140 one-page layout.
- Next bounded slice: propagate selected WB evidence into Workbook handoff output without changing verified companion scope or SB behavior.
- Otherwise, separately authorize a series handoff for an already-wired companion, or move to another book/unit.
- Do not build Horizontal Mapping / School Notes / Future Suggestions yet.
- Phase 3 / F005 parked (D020). F021/F022 preserved. No automatic generation.

## Blocked

- Soft: Phase 2 closure, methodology/schema lock, Phase 3 unlock, and full prompt generation remain unauthorized without explicit owner approval.

---

## Snapshot notes

- Active Git branch: `main`.

- Entry: `/app/chalkie` — Student Book–first (D021).
