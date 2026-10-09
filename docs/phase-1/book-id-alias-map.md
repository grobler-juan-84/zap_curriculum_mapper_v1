# Book ID Alias Map

**Status:** ACTIVE  
**Version:** 1.7  
**Date:** 2026-10-09  
  
**Machine-readable map:** [`book_id_aliases.json`](./book_id_aliases.json)  
**Purpose:** Define the catalog `book_id` as the stable identity for Phase 1 joins, document extraction-era aliases rewritten at canonical merge time, and align forward naming with D009.

**Related:** [`../9-naming-conventions.md`](../9-naming-conventions.md) (D009) · [`cross-series-schema-review-notes.md`](./cross-series-schema-review-notes.md) §7.6 · [`dataset-registry.md`](./dataset-registry.md) · decisions **D007**, **D009**

---

## 1. Canonical rule

| Layer | Identity |
|---|---|
| Postgres `books.book_id` | **Canonical catalog ID** |
| Storage path segment (e.g. `…/big_english_1_sb/…`) | Matches catalog ID |
| Dataset Registry folder / registry notes | Matches catalog ID |
| Extracted JSON `book_id` / entity `book_id` fields | May use **aliases**; rewritten at merge |
| Entity ID strings (`unit_id`, `page_id`, …) | **Not** rewritten at merge (D007) |

Canonical curriculum JSON after merge must use:

```text
book.book_id === <catalog_book_id>
```

on the book object and on entity records’ `book_id` fields (when present).

Do not interchange:

- **Registry ID** — human shorthand (`BE1-SB`, `BE1-WB`)
- **Catalog `book_id`** — technical identity (`big_english_1_sb`, `big_english_1_wb`)
- **Series slug** — Storage prefix (`big-english`)
- **Entity ID** — graph identity inside one JSON dataset

---

## 2. Alias table (pilots — grandfathered)

| Registry | Catalog `book_id` | Known aliases | Entity ID prefix examples (not rewritten) |
|---|---|---|---|
| BH1 | `beehive_1_sb` | `beehive_1_sb`, `beehive_american_sb1` | `beehive_1_sb_` |
| BE1-SB | `big_english_1_sb` | `bep1_sb`, `big_english_1_sb` | `bep1_` |
| BE2-SB | `big_english_2_sb` | `bep_sb_2`, `big_english_2_sb` | `bep2_` |
| RH2A | `reach_higher_2a` | `rh_2a`, `reach_higher_2a` | `rh_2a_`, `reach_higher_2a_` |

These pilot entity prefixes remain accepted legacy exceptions (D009 §6). Aliases are compatibility data, not preferred new names.

Add new aliases to [`book_id_aliases.json`](./book_id_aliases.json) when extraction introduces another string for the same catalog book.

---

## 3. Forward policy for new books (D009)

For every book extracted **after** the four COMPLETE pilots:

1. Prefer emitting the **catalog `book_id` directly** in JSON `book_id` fields — avoid inventing new aliases.
2. Use full-word catalog templates:
   - Beehive: `beehive_{level}_sb`
   - Big English: `big_english_{level}_{sb|wb}`
   - Reach Higher: `reach_higher_{level}` (do **not** add `_sb` only on later books)
3. Prefix entity IDs with the full catalog ID:

```text
{catalog_book_id}_unit_{NN}
{catalog_book_id}_page_{PPP}
{catalog_book_id}_vocab_{NNNN}
{catalog_book_id}_language_{NNNN}
{catalog_book_id}_activity_{NNNN}
{catalog_book_id}_text_{NNNN}
{catalog_book_id}_component_{NNNN}
{catalog_book_id}_relationship_{NNNN}
{catalog_book_id}_issue_{NNNN}
{catalog_book_id}_gap_{NNNN}
```

4. Local batch filename: `{catalog_book_id}_unit_{NN}.json`
5. If an extractor still emits a temporary alias, record it here and in `book_id_aliases.json`; merge normalizes `book_id` fields only (D007).

### Prior — BE4-WB (complete)

| Registry | Catalog `book_id` | Series slug | Entity prefix (as extracted) | Aliases |
|---|---|---|---|---|
| BE4-WB | `big_english_4_wb` | `big-english` | mixed Studio prefixes (`bep4_wb_`, `bep_wb_4_`, `be4plus_wb_`, …); Unit 7 collisions remumbered to `big_english_4_wb_*` | `bep4_wb`, `bep_4_wb`, `bep_wb_4`, `be4plus_wb` |

Phase 1 COMPLETE; entity ID strings preserved except U7 collision remumber (D007). Grammar pages 134/135/139/140/142; missing-page cross-refs 88/137/141 recorded as `possible_omission`.

### Prior — BE4-SB (complete)

| Registry | Catalog `book_id` | Series slug | Entity prefix (as extracted) | Aliases |
|---|---|---|---|---|
| BE4-SB | `big_english_4_sb` | `big-english` | mixed Studio prefixes (`bep4_sb_`, `bep_4_sb_`, …) | `bep4_sb`, `bep_4_sb`, `bep_plus_4_sb`, `big_english_plus_4_sb`, `bep_level4_sb` |

Phase 1 COMPLETE; entity ID strings preserved (D007). Unit 4/9 Studio unit-shorthand relationship targets remapped at merge.

### Prior — BE3-WB (complete)

| Registry | Catalog `book_id` | Series slug | Entity prefix (as extracted) | Aliases |
|---|---|---|---|---|
| BE3-WB | `big_english_3_wb` | `big-english` | mixed Studio prefixes (`bep3_wb_`, `bep_3_wb_`, `bep_plus_3_wb_`, …) | `bep3_wb`, `bep_3_wb`, `bep_plus_3_wb`, `bep_level3_wb` |

Phase 1 COMPLETE; entity ID strings preserved (D007).

### Prior — BE3-SB (complete)

| Registry | Catalog `book_id` | Series slug | Entity prefix (as extracted) | Aliases |
|---|---|---|---|---|
| BE3-SB | `big_english_3_sb` | `big-english` | mixed Studio prefixes (`bep_3_sb_`, `bep3_`, `bep_sb_3_`, …); remumbered collisions use `big_english_3_sb_*` | `bep_3_sb`, `bep3_sb`, `bep_sb_3`, `be_plus_3_sb`, `big_english_plus_3_sb`, `bep_level3_sb` |

Phase 1 COMPLETE with D013 missing-source exception (printed pp. 66–67). Local unit merges normalize `book_id` / `unit_id` fields to catalog; non-colliding entity ID strings preserved (D007).

### Prior — BE2-WB (complete)

| Registry | Catalog `book_id` | Series slug | Entity prefix (as extracted) | Aliases |
|---|---|---|---|---|
| BE2-WB | `big_english_2_wb` | `big-english` | `big_english_plus_2_wb_` (preserved) | `big_english_plus_2_wb` |

Do **not** use `bep2_wb`, `be2_wb`, or `BE2-WB` as catalog/entity identities. Extraction used `big_english_plus_2_wb`; catalog stays `big_english_2_wb` (D007 merge normalizes `book_id` fields only).

### Prior — BE1-WB (complete)

| Registry | Catalog `book_id` | Series slug | Expected entity prefix |
|---|---|---|---|
| BE1-WB | `big_english_1_wb` | `big-english` | `big_english_1_wb_` |

---

## 4. Entity ID policy

**Do not rewrite** `unit_id`, `page_id`, `vocabulary_id`, etc. at merge time.

Reason: IDs are already unique within a book; rewriting prefixes risks silent relationship breakage and makes audits harder to compare to verified unit batches.

Extraction-era prefixes for pilots remain allowed fingerprints. Catalog joins and app routing use `books.book_id` / `book.book_id`, not entity ID prefixes.

New books should not create additional abbreviated fingerprints.

---

## 5. Merge-time normalization

Implemented in:

- [`scripts/lib/bookIdAliases.mjs`](../../scripts/lib/bookIdAliases.mjs)
- [`scripts/merge_canonical_book.mjs`](../../scripts/merge_canonical_book.mjs) (runs after array merge)
- [`scripts/normalize_canonical_book_ids.mjs`](../../scripts/normalize_canonical_book_ids.mjs) (patch an existing canonical in Storage)

### Fields rewritten when value is a known alias of the target catalog book

- `book_id`
- `source_book_id` / `target_book_id` only when the value is an alias of **this** catalog book (foreign workbook IDs left alone)

### Metadata recorded on the canonical

- `book.book_id` → catalog ID  
- `book.catalog_book_id` → catalog ID (explicit)  
- `book.extracted_book_ids` → sorted unique pre-normalization values seen  
- `verification.book_id_normalization` → `{ catalog_book_id, aliases_applied, fields_rewritten, entity_ids_preserved: true, normalized_at }`

---

## 6. How to extend

1. Add/update the book entry in `book_id_aliases.json`.
2. Keep `catalog_book_id` identical to Postgres `books.book_id`.
3. For new books, set `entity_id_prefix_examples` to the full catalog prefix (`{catalog_book_id}_`) and prefer an empty or catalog-only alias list.
4. Re-run merge (or `normalize_canonical_book_ids.mjs`) so Storage reflects the map.
5. Mention the alias in the Dataset Registry book notes.

---

## 7. Out of scope

- Renaming Storage folders or Postgres rows (already catalog-correct for pilots)
- Rewriting entity ID strings
- Schema 0.2 curriculum field changes
- Mass-renaming pilot entity prefixes (requires a separate migration decision per D009 §7)
