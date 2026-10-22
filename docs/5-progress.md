# General Curriculum Mapper — Progress

**Status:** ACTIVE  

**Version:** 1.0  

**Last updated:** Step 324

**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** PAUSED at 14/18 COMPLETE (D015).

- **D017** / **D018** / **D019** / **D020** / **D021** LOCKED.

- **D021** SB-led Chalkie Workspace with optional mapped Workbook view.

- **BE3 U8 companions in resolver:** opener (series); story asymmetric (series provisional); **LiA through Review** resolver-wired (Writing/Phonics/Review 1→1; no handoff / no Chalkie). **Values p.142** SB-only confirmed; no Workbook companion expected.

- **Active lesson page scope:** one-page components inside a two-page PDF reading spread (e.g. p.140 / p.141) resolve companion + Prepare from the Go / page-control active page; true two-page mappings unchanged.

- **Activity Selection contract v0.9:** **IMPLEMENTED / MANUALLY ACCEPTED — local handoff curation; provisional workflow.** Teacher-selectable SB/WB cards (all selected by default); selected-only SB and WB handoff propagation; open-book layouts; BE3 U8 opener persistence accepted (`4 of 5` SB / `3 of 4` WB after Back). Does not authorize Chalkie generation or claim classroom validation.

- **Neutral SB→WB package assembler:** implemented read-only for the accepted BE3 U8 Opener and Story pairs only. It packages exact scopes, selected-only activity/vocabulary/language/audio evidence, explicit selection states and boundaries, and lesson-targeted `[PRIOR]` / `[HM]` / teacher-added support; existing Chalkie UI and rendering are unchanged.

- **Opener shadow-renderer parity (audit v0.3):** proved in tests only for the accepted BE3 U8 Opener package. Five all-selected artifacts match the bespoke builder exactly; exclusions and zero-selection remain package-selected-only. Production UI/output is unchanged.

- **Story shadow-renderer parity (audit v0.4):** proved in tests only for asymmetric SB pp.130–131 → WB p.106. Five all-selected artifacts match exactly; WB p.107 never appears; exclusions, zero-selection, and targeted support remain honest. Production UI/output is unchanged.

- **Shared test-only Chalkie dispatcher (audit v0.5):** supports only the parity-proved Opener and Story relationships. Unsupported relationships throw a typed error with no fallback; production UI/output remains unchanged.

- Teacher Intelligence left-pane contract: Unit Intelligence accordion implemented.

## In progress

- Owner review of the shared test-only dispatcher boundary.

## Next

- Separately choose whether to design a production migration plan or first audit one additional accepted component.
- Do not migrate UI or production Chalkie renderers automatically.
- Do not build Horizontal Mapping / School Notes / Future Suggestions yet.
- Phase 3 / F005 parked (D020). F021/F022 preserved. No automatic generation.

## Blocked

- Soft: Phase 2 closure, methodology/schema lock, Phase 3 unlock, and full prompt generation remain unauthorized without explicit owner approval.

---

## Snapshot notes

- Active Git branch: `main`.

- Entry: `/app/chalkie` — Student Book–first (D021).
