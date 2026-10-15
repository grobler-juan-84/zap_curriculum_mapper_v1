# BE2 Book Intelligence — E2E acceptance (D017)

**Date:** 2026-10-15  
**Decision:** D017 Progressive Curriculum Intelligence; milestone **D019** (amended — two-book MVP UI implementation-validated)  
**Scope:** `big_english_2_sb` eight-column Book Intelligence ↔ Phase 1 Validation + PDF nav  
**Status:** ACCEPTANCE — **implementation validated** (D019); BE2 eight-column methodology **provisional**; schema / UI contract **not locked**  
**Scripts:**
- [`../../../scripts/verify_be2_bi_validation_e2e_acceptance.mjs`](../../../scripts/verify_be2_bi_validation_e2e_acceptance.mjs)
- [`../../../scripts/verify_be2_bi_pdf_u1_u9_regression.mjs`](../../../scripts/verify_be2_bi_pdf_u1_u9_regression.mjs)

---

## Flow under test

1. **Library** — Series Library book card → **Book Intelligence** (selects series/book)
2. **Book Intelligence** — Storage overview (`eight_column_baseline`); no Writing field
3. **Unit** — `?unit=1`…`9`; PDF sync via Phase 1 `pdf_page_*`
4. **View Source Evidence** → Validation (`/app/validation?unit=N`)
5. **Back to Book Intelligence** → `/app/book-intelligence/big_english_2_sb?unit=N`

---

## Results

| Area | Result | Notes |
|---|---|---|
| Library → BI route | **PASS** | `/app/book-intelligence/big_english_2_sb` |
| Workspace selection wiring | **PASS** (after fix) | Library + BI deep-link call `selectSeries` / `selectBook` |
| Storage BI load | **PASS** | sha256 `6b371fda5c29…`; `units=9`; `eight_column_baseline` |
| Eight-column UI fields | **PASS** | 7 keys; Writing omitted |
| BI → Validation → Back U1–9 | **PASS** | All round-trips |
| Deep-link `?unit=5` | **PASS** | Not Unit 1 |
| PDF sync U1–9 | **PASS** | Start/mid/end; BE2 bounds (U5@74, U7@112, U9@144) |
| Review gaps | **PASS** | After U3 (52–57); after U6 (106–111) |
| No Unit-1 fallback | **PASS** | Missing/invalid `?unit=` |
| BE3 regressions | **PASS** | Existing BE3 E2E + PDF scripts still green |

**Scripted overall:** **PASS**.

---

## Defects found and fixed

### D1 — Library → BI did not select the book/series

**Symptom:** Opening Book Intelligence navigated by URL only; workspace could stay on another book/series, so “Back to Series” / Validation context felt like BE2 was unreachable.  
**Cause:** `SeriesLibraryPage` `onOpenBookIntelligence` skipped `selectSeries` / `selectBook` (unlike Validate).  
**Fix:** Resolve `catalogBookId` via `curriculumService.getBookByCatalogId` and select before navigate; BI preview also syncs workspace on route `catalogBookId` (deep links).

### D2 — BE2 PDF regression checkpoints were BE3 page numbers (test-only)

**Symptom:** Cloned U1–U9 PDF script failed 12 checks on BE2 bounds (e.g. U5 starts at 74, not 72).  
**Fix:** Update BE2 script checkpoints to Phase 1 `big_english_2_sb` pdf bounds. No app change.

---

## Explicit non-claims

- No browser-driver screenshot pass in this session.  
- No schema, methodology, BI JSON content, or Postgres changes.  
- Contract remains draft / not locked.  
- **D019** records **implementation** validation for BE2 + BE3 only — BE2 eight-column and BE3 nine-column A+B methodologies stay **provisional**.

---

## How to re-run

```bash
node scripts/verify_be2_bi_validation_e2e_acceptance.mjs
node scripts/verify_be2_bi_pdf_u1_u9_regression.mjs
```

Manual smoke: Curriculum → Big English → Big English 2 SB → Book Intelligence → confirm no Writing row → U5 → View Source Evidence → Back → confirm `?unit=5`.
