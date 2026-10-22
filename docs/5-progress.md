# General Curriculum Mapper — Progress

**Status:** ACTIVE  

**Version:** 1.0  

**Last updated:** Step 329

**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** PAUSED at 14/18 COMPLETE (D015).

- **D017** / **D018** / **D019** / **D020** / **D021** LOCKED.

- **D021** SB-led Chalkie Workspace with optional mapped Workbook view.

- **BE3 U8 companions in resolver:** opener (series); story asymmetric (series provisional); **LiA through Review** resolver-wired (Writing/Phonics/Review 1→1; no handoff / no Chalkie). **Values p.142** SB-only confirmed; no Workbook companion expected.

- **Active lesson page scope:** one-page components inside a two-page PDF reading spread (e.g. p.140 / p.141) resolve companion + Prepare from the Go / page-control active page; true two-page mappings unchanged.

- **Activity Selection contract v0.9:** **IMPLEMENTED / MANUALLY ACCEPTED — local handoff curation; provisional workflow.**

- **Neutral SB→WB package assembler** for accepted BE3 U8 Opener and Story pairs only.

- **Opener and Story shadow-renderer parity** proved in tests (Story asymmetric WB p.106 only).

- **Shared Chalkie dispatcher** for the two parity-proved relationships; unsupported relationships throw a typed error.

- **Opener canary:** `IMPLEMENTED / MANUALLY ACCEPTED — LIMITED OPENER CANARY` for `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105` only. Flag `VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY` (default off).

- **Story canary:** `IMPLEMENTED / AWAITING OWNER MANUAL CHECK` for `be3_sb_wb_rel_u08_story_sb130-131_wb106` (SB pp.130–131 → WB p.106 only; WB p.107 forbidden). Flag `VITE_CHALKIE_BE3_U08_STORY_NEUTRAL_CANARY` (default off). Not manually accepted yet.

- Teacher Intelligence left-pane contract: Unit Intelligence accordion implemented.

## In progress

- Owner manual check of the Story canary (flag explicitly enabled).

## Next

- Enable Story canary locally and verify all-selected / exclusions / zero-selection / no WB p.107 before any manual-acceptance mark.
- Do not bulk-migrate additional relationships.
- Do not build Horizontal Mapping / School Notes / Future Suggestions yet.
- Phase 3 / F005 parked (D020). F021/F022 preserved. No automatic generation.

## Blocked

- Soft: Phase 2 closure, methodology/schema lock, Phase 3 unlock, and full prompt generation remain unauthorized without explicit owner approval.
- Soft: Story canary not manually accepted until owner local check.

---

## Snapshot notes

- Active Git branch: `main`.

- Entry: `/app/chalkie` — Student Book–first (D021).
