# General Curriculum Mapper — Progress

**Status:** ACTIVE  

**Version:** 1.0  

**Last updated:** Step 318

**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** PAUSED at 14/18 COMPLETE (D015).

- **D017** / **D018** / **D019** / **D020** / **D021** LOCKED.

- **D021** SB-led Chalkie Workspace with optional mapped Workbook view.

- **BE3 U8 companions in resolver:** opener (series); story asymmetric (series provisional); **LiA through Review** resolver-wired (Writing/Phonics/Review 1→1; no handoff / no Chalkie). **Values p.142** SB-only confirmed; no Workbook companion expected.

- **Active lesson page scope:** one-page components inside a two-page PDF reading spread (e.g. p.140 / p.141) resolve companion + Prepare from the Go / page-control active page; true two-page mappings unchanged.

- **Activity Selection contract v0.8:** Current Lesson is activity-first, with compact verified SB/WB cards, deterministic separate session selection, selection feedback, and Back/Continue persistence.

- **Selected-only handoff propagation:** SB choices control current-page artifacts and supported-series Lesson 1. Verified-companion WB choices control Workbook-bearing detailed prompts and accepted-series Lesson 2 outlines, vocabulary, language/models, and activity lists.

- **Conservative Workbook boundary:** partial Workbook pages lose page-attributed vocabulary/language; zero Workbook selection keeps a valid explicit empty Lesson 2 with no reconstruction or Student Book substitution. All-selected output preserves the accepted opener/Story baselines.

- **Open-book Activity Selection layout:** every displayed SB/WB section keeps two equal page slots and a centre gutter. One-page scopes retain even-left / odd-right physical position with a muted, non-selectable facing placeholder; no-companion lessons still render no WB section.

- Teacher Intelligence left-pane contract: Unit Intelligence accordion implemented.

## In progress

- Activity Selection implementation is complete for the current local handoffs. Owner manual propagation/visual proof remains.

## Next

- Owner manually checks opener WB105 Activity 3 exclusion, Story WB106 partial selection, zero-WB selection, Back/Continue persistence, and unchanged all-selected output.
- Owner also checks pp.128–129 two-real-page layout, SB p.140–143 physical slots/placeholders, and Story WB p.106 left + placeholder.
- Next smallest coding step after owner proof: only if separately approved, extract the shared selected-evidence package boundary without changing current handoff behavior.
- Otherwise, separately authorize a series handoff for an already-wired companion, or move to another book/unit.
- Do not build Horizontal Mapping / School Notes / Future Suggestions yet.
- Phase 3 / F005 parked (D020). F021/F022 preserved. No automatic generation.

## Blocked

- Soft: Phase 2 closure, methodology/schema lock, Phase 3 unlock, and full prompt generation remain unauthorized without explicit owner approval.

---

## Snapshot notes

- Active Git branch: `main`.

- Entry: `/app/chalkie` — Student Book–first (D021).
