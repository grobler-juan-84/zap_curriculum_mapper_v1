# Local working data

**Do not commit curriculum extraction JSON or source PDFs to GitHub.**

Phase 2 feedback JSON under `data/phase2/**/feedback/` is intentionally tracked (small review / experiment artifacts).

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
data/phase2/{catalog_book_id}/feedback/
data/phase2/{catalog_book_id}/interpretations/   # add when storing Studio result JSON
```

### Current layout

```text
data/phase2/big_english_2_sb/feedback/
  p2-feedback-be2-u01-v3.1.json
  p2-feedback-be2-u06-v3.1.json
  p2-feedback-be2-u08-v3.1.json
```

- Book folder uses catalog `book_id` (same habit as Phase 1).
- `feedback/` holds owner review / experiment JSON for a prompt version.
- Do **not** create empty `interpretations/` until Studio outputs are saved locally; then use sibling folder e.g. `big_english_2_sb_bep2_unit_01_phase2_v3.1.json`.
- Prompt docs remain under `docs/phase-2/` (e.g. `google-ai-studio-unit-interpretation-prompt-v3.1.md`).
- Entire `data/phase2/` is **not** blanket-gitignored (unlike `data/phase1/`). If interpretation outputs become large, gitignore `data/phase2/**/interpretations/` and keep `feedback/` tracked.

---

## Source PDFs

See `app/src/assets/books/{series_slug}/{catalog_book_id}.pdf` (also gitignored).
