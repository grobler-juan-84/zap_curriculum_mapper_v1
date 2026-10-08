# Local Phase 1 working data

**Do not commit curriculum extraction JSON or source PDFs to GitHub.**

## Unit-batch JSON (gitignored)

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

## Source PDFs

See `app/src/assets/books/{series_slug}/{catalog_book_id}.pdf` (also gitignored).
