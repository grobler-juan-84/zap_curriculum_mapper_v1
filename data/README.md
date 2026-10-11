# Local working data

**Do not commit curriculum extraction JSON or source PDFs to GitHub.**

Phase 2 interpretation and cross-unit experiment JSON under `data/phase2/` is intentionally tracked (small experimental artifacts). Entire `data/phase1/` remains gitignored.

---

## Phase 1 — Unit-batch JSON (gitignored)

```text
data/phase1/{catalog_book_id}/{catalog_book_id}_unit_{NN}.json
```

- Entire `data/phase1/` is gitignored.
- Filename uses the full catalog `book_id` (D009), e.g. `big_english_1_wb_unit_01.json`.
- After upload, Storage keys use `{series_slug}/{catalog_book_id}/batches/unit_{NN}.json`.

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

## Phase 2 — Interpretation working data

```text
data/phase2/{catalog_book_id}/interpretations/   # unit-level Phase 2 JSON (SoT for unit findings)
data/phase2/{catalog_book_id}/cross-unit/        # cross-unit consolidation / connections runs
data/phase2/{catalog_book_id}/feedback/          # optional owner-feedback templates (when used)
```

### Current layout (Big English 2 SB)

```text
data/phase2/big_english_2_sb/
  interpretations/
    be2-sb-u01-v3.1.json
    be2-sb-u06-v3.1.json
    be2-sb-u08-v3.1.json
  cross-unit/
    be2-cross-unit-v1.1.json
    be2-cross-unit-v1.2.json    # preserved historically; see docs note — content matches v1.1, not true V1.2 schema
```

- Book folder uses catalog `book_id` (same habit as Phase 1).
- Unit V3.1 JSON files are the source of truth for unit-level findings.
- Cross-unit outputs must not silently replace or rewrite unit IDs.
- Prompt docs remain under `docs/phase-2/` (`phase2-v3.1-prompt.md`, `cross-unit-v1.2-prompt.md`).
- Inventory / validation: `docs/phase-2/p2-exp-be2-v3.1-cross-unit-status.md`.

---

## Source PDFs

See `app/src/assets/books/{series_slug}/{catalog_book_id}.pdf` (also gitignored).
