# BE3 Book Intelligence — PDF navigation regression acceptance (D017)

**Date:** 2026-10-15  
**Decision context:** D017 Progressive Curriculum Intelligence; builds on **D019** (MVP UI path implementation-validated)  
**Scope:** `big_english_3_sb` Book Intelligence split preview — PDF ↔ unit synchronization and navigation  
**Status:** ACCEPTANCE RECORDED — scripted U1–U9 regression **PASS**; no application defects in this slice  
**Primary script:** [`../../../scripts/verify_bi_pdf_u1_u9_regression.mjs`](../../../scripts/verify_bi_pdf_u1_u9_regression.mjs)

**Related:**
- MVP round-trip acceptance: [`be3-bi-validation-e2e-acceptance-d017-v1.md`](./be3-bi-validation-e2e-acceptance-d017-v1.md) (D019)
- Companion scripts: `verify_bi_pdf_navigation.mjs`, `verify_bi_pdf_unit_sync.mjs`, `verify_bi_validation_e2e_acceptance.mjs`

---

## Milestone claim

The BE3-SB Book Intelligence PDF navigation slice is **regression-accepted** for scripted coverage of Units 1–9:

- Forward and backward PDF pair walks across the book  
- Inter-unit review/checkpoint gaps (after U3, after U6)  
- Unit selection / deep-link targets (`?unit=1`…`9` → Phase 1 `pdf_page_start`)  
- PDF-driven unit sync without Unit 1 fallback after review gaps  
- Storage BI artifact integrity (9 units)

**Explicit non-locks:** This does **not** lock Phase 2 methodology, JSON schema, UI data contract, prompts, or `book_files` registration. D019 implementation-validated status is unchanged in kind (implementation only).

---

## Coverage matrix

| Area | Result | Notes |
|---|---|---|
| Deep links `?unit=1`…`9` | **PASS** | Jump targets match Phase 1 `pdf_page_start` |
| Unit selection targets | **PASS** | Same resolution as deep links |
| Per-unit start / mid / end sync | **PASS** | All nine units |
| Forward walk (+2 pages) | **PASS** | Visits U1–U9; gaps after U3/U6 |
| Backward walk (−2 pages) | **PASS** | Visits U1–U9; reverse through both gaps |
| Review gap after U3 → U4 | **PASS** | No BI in gap; enters U4; never U1 |
| Review gap after U6 → U7 | **PASS** | No BI in gap; enters U7 |
| Reverse U4 → Review 1 → U3 | **PASS** | |
| Reverse U7 → Review 2 → U6 | **PASS** | |
| Adjacent boundaries (no gap) | **PASS** | e.g. U1↔U2, U8↔U9 |
| In-unit review pages | **PASS** | Still belong to their unit |
| Missing / invalid `?unit=` | **PASS** | No fallback to Unit 1 |
| Storage BI artifact | **PASS** | sha256 matches local; 9 units |

**Scripted overall:** **PASS**

---

## Prior defects closed (this nav slice)

Recorded earlier in the same D017 BI UI thread; regression confirms they stay closed:

1. PDF pane remount on unit change broke Prev/Next — fixed (pane stays mounted).  
2. Review 1 → U4 selected Unit 1 — fixed (no null-`?unit=` fallback; suppress PDF-driven jumps).  
3. Validation `?unit=` reload / deep-link race — fixed under D019 E2E acceptance.

No new application defects found in the full U1–U9 regression run.

---

## Explicit non-claims

- No browser-driver (Playwright/Cypress) pass in this session. Manual UI smoke still useful.  
- No database, schema, methodology, or data-model changes authorized by this milestone.  
- Only `big_english_3_sb` is in scope.

---

## How to re-run

```bash
node scripts/verify_bi_pdf_u1_u9_regression.mjs
node scripts/verify_bi_pdf_unit_sync.mjs
node scripts/verify_bi_pdf_navigation.mjs
node scripts/verify_bi_validation_e2e_acceptance.mjs
```

---

## Change log

| Date | Change |
|---|---|
| 2026-10-15 | PDF navigation regression milestone recorded; U1–U9 scripted PASS; no app defects. |
