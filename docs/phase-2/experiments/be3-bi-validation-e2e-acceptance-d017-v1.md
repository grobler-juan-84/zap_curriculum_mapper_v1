# BE3 Book Intelligence ↔ Validation — E2E UI acceptance (D017)

**Date:** 2026-10-15  
**Decision:** D017 Progressive Curriculum Intelligence; milestone **D019** (MVP UI path implementation-validated)  
**Scope:** `big_english_3_sb` Book Intelligence preview ↔ Phase 1 Validation round-trip  
**Status:** MVP ACCEPTANCE — **implementation validated** (D019); methodology / schema / UI contract **not locked**; scripted path PASS  
**Script:** [`../../../scripts/verify_bi_validation_e2e_acceptance.mjs`](../../../scripts/verify_bi_validation_e2e_acceptance.mjs)  
**Follow-on:** PDF navigation regression acceptance — [`be3-bi-pdf-navigation-regression-acceptance-d017-v1.md`](./be3-bi-pdf-navigation-regression-acceptance-d017-v1.md) (U1–U9 PASS; implementation only)

---

## Flow under test

1. **Library** — Series Library book card → **Book Intelligence**  
2. **Book Intelligence** — Storage overview loads; select unit (`?unit=N`)  
3. **View Source Evidence** → Validation (`/app/validation?unit=N`)  
4. **Back to Book Intelligence** → `/app/book-intelligence/big_english_3_sb?unit=N`

---

## Method

| Layer | What was run |
|---|---|
| Scripted acceptance | Storage download of BI JSON; route helpers; Validation `pickBatchIdForUnit` uniqueness for U1–U9; deep-link `?unit=5` ≠ Unit 1 |
| Code review / defect hunt | Validation unit-query effects (reload + URL race) |
| Browser automation | Not available in this environment (no Playwright/Cypress). Manual UI smoke still recommended after pull. |

---

## Results

| Step | Result | Notes |
|---|---|---|
| Library → BI route | **PASS** | `/app/book-intelligence/big_english_3_sb` (BI normalizes missing unit → `?unit=1`) |
| Storage BI load | **PASS** | `book-datasets` …/be3-sb-u01-u09-…; `units=9`; sha256 matches local |
| BI unit selector URL | **PASS** | `?unit=1`…`9` addressable |
| BI → Validation evidence | **PASS** | `/app/validation?unit=N` for N=1…9 |
| Validation → BI back | **PASS** | `/app/book-intelligence/big_english_3_sb?unit=N` |
| Deep-link Unit 5 | **PASS** (after fix) | Must select Unit 5, not fall back to Unit 1 |

**Scripted overall:** **PASS** (U1–U9 round-trips).

---

## Defects found and fixed

### D1 — Validation reloaded Storage files on every `?unit=` change

**Symptom:** Changing unit (or syncing `?unit=`) re-ran `listValidationFiles` / canonical download.  
**Cause:** Load effect depended on `[book.id, requestedUnit]`.  
**Fix:** Load on `book.id` only; apply `?unit=` via a separate selection effect.

### D2 — Deep-linked `?unit=N` could be overwritten by Unit 1

**Symptom:** Arriving at Validation with `?unit=5` could briefly treat selection as Unit 1 and rewrite the query to `?unit=1`.  
**Cause:** `currentBatch` fell back to `batches[0]` while `selectedBatchId` was still empty; URL sync ran before apply-unit.  
**Fix:** No `batches[0]` fallback until a batch is selected; URL sync only after `selectedBatchId` is set.

---

## Explicit non-claims

- No browser-driver screenshot pass in this session.  
- No database, schema, or methodology changes beyond the Validation selection/sync bugfixes above.  
- BE3 nine-column A+B methodology remains **provisional** (D017 working approval).  
- **D019** (amended) records **implementation** validation for BE2 + BE3 — not a Phase 2 methodology, schema, or contract lock.

---

## How to re-run

```bash
node scripts/verify_bi_validation_e2e_acceptance.mjs
```

Manual smoke (signed-in app): Curriculum → Big English series → Big English 3 SB → Book Intelligence → pick U5 → View Source Evidence → confirm Validation Unit 5 → Back to Book Intelligence → confirm BI `?unit=5`.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-15 | Acceptance recorded; D1/D2 fixed; scripted U1–U9 PASS. |
| 2026-10-15 | Milestone linked to D019 (implementation validated; methodology not locked). |
| 2026-10-15 | Cross-linked PDF navigation regression acceptance (U1–U9 PASS). |
