# Local working data

**Do not commit curriculum extraction JSON or source PDFs to GitHub.**

**Authority:** Phase 1 canonical datasets (local working copies under `data/phase1/` and/or Supabase Storage `book-datasets`) remain the authoritative source for extracted textbook evidence. Current Phase 2 direction is **D017 — Progressive Curriculum Intelligence** (Book Intelligence / horizontal mapping) in `docs/4-decisions.md` — concise teacher-readable book overviews from verified Phase 1 evidence; no premature Phase 2 schema lock.

Phase 2 interpretation and cross-unit experiment JSON under `data/phase2/` is intentionally tracked as **small experimental research artifacts** (not production source of truth). Entire `data/phase1/` remains gitignored.

---

## Phase 1 — Unit-batch JSON (gitignored)

```text
data/phase1/{catalog_book_id}/{catalog_book_id}_unit_{NN}.json
data/phase1/{catalog_book_id}/canonical/v1.json
data/phase1/{catalog_book_id}/canonical/ss_v{N}.json   # optional companion Scope & Sequence (separate JSON shape; never merge into v1.json)
```

- Entire `data/phase1/` is gitignored.
- Filename uses the full catalog `book_id` (D009), e.g. `big_english_1_wb_unit_01.json`.
- After upload, Storage keys use `{series_slug}/{catalog_book_id}/batches/unit_{NN}.json` and `{series_slug}/{catalog_book_id}/canonical/v1.json`.
- Optional SS companions use `{series_slug}/{catalog_book_id}/canonical/ss_v{N}.json` (BE2-SB + BE3-SB `ss_v1.json` — local + Storage objects present; not in `dataset_versions`).

### Remaining Big English scaffolds (local placeholders)

Nine empty `{}` unit files each (unit count to confirm from each PDF):

| Catalog `book_id` | Local folder |
|---|---|
| `big_english_1_wb` | `data/phase1/big_english_1_wb/` |
| `big_english_2_wb` | `data/phase1/big_english_2_wb/` |
| `big_english_3_sb` / `_wb` | `data/phase1/big_english_3_{sb\|wb}/` |
| `big_english_4_sb` / `_wb` | `data/phase1/big_english_4_{sb\|wb}/` |
| `big_english_5_sb` / `_wb` | `data/phase1/big_english_5_{sb\|wb}/` |
| `big_english_6_sb` / `_wb` | `data/phase1/big_english_6_{sb\|wb}/` |

Completed pilots (`big_english_1_sb`, `big_english_2_sb`) live in Supabase Storage as source of truth; restore local copies only when re-uploading.

---

## Phase 2 — Interpretation working data (experimental research)

```text
data/phase2/{catalog_book_id}/interpretations/   # experimental unit-level Phase 2 JSON (research artifacts)
data/phase2/{catalog_book_id}/cross-unit/        # experimental cross-unit consolidation / connections runs
data/phase2/{catalog_book_id}/feedback/          # optional owner-feedback templates (when used)
```

### Current layout

```text
data/phase2/big_english_2_sb/
  interpretations/
    be2-sb-u01-v3.1.json
    be2-sb-u06-v3.1.json
    be2-sb-u08-v3.1.json
  cross-unit/
    be2-cross-unit-v1.1.json
    be2-cross-unit-v1.2.json    # true connections-only V1.2 (`phase2_cross_unit_connections`)

data/phase2/big_english_3_sb/
  interpretations/
    be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json  # nine-column A+B Units 1–9 (draft BI UI contract)
```

- Book folder uses catalog `book_id` (same habit as Phase 1).
- Unit V3.1 JSON files and related Phase 2 outputs are **experimental research artifacts** under D017 principle 4 — not production-mandatory unit source of truth. Phase 1 canonical evidence remains authoritative for textbook content.
- BE3 Units 1–9 Book Intelligence JSON follows [`docs/phase-2/book-intelligence-ui-data-contract-v1.md`](../docs/phase-2/book-intelligence-ui-data-contract-v1.md) (`schema_name: book_intelligence_unit_overview`, `column_set: nine_column_ab`). Draft only — not locked.
- Storage companion (2026-10-15): `book-datasets` → `big-english/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json` (SHA-256 verified). Upload via `scripts/upload_book_intelligence_json.mjs`. Preview `/app/book-intelligence` loads this Storage object. **Not** in `book_files` / `dataset_versions`.
- Cross-unit outputs must not silently replace or rewrite unit IDs.
- Prompt docs remain under `docs/phase-2/` (`phase2-v3.1-prompt.md`, `cross-unit-v1.2-prompt.md`).
- Inventory / validation: `docs/phase-2/p2-exp-be2-v3.1-cross-unit-status.md`.
- Active Phase 2 direction: `docs/4-decisions.md` (D017) and `docs/phase-2/phase-2-experiment-status.md`.

---

## Source PDFs

See `app/src/assets/books/{series_slug}/{catalog_book_id}.pdf` (also gitignored).
