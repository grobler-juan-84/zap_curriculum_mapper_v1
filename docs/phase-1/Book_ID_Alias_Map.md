# Book ID Alias Map

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-07  
**Machine-readable map:** [`book_id_aliases.json`](./book_id_aliases.json)  
**Purpose:** Define the catalog `book_id` as the stable identity for Phase 1 joins, and document extraction-era aliases rewritten at canonical merge time.

**Related:** [`Cross_Series_Schema_Review_Notes.md`](./Cross_Series_Schema_Review_Notes.md) §7.6 · [`Dataset_registry.md`](./Dataset_registry.md) · decision **D007**

---

## 1. Canonical rule

| Layer | Identity |
|---|---|
| Postgres `books.book_id` | **Canonical catalog ID** |
| Storage path segment (e.g. `…/big_english_1_sb/…`) | Matches catalog ID |
| Dataset Registry folder / registry notes | Matches catalog ID |
| Extracted JSON `book_id` / entity `book_id` fields | May use **aliases**; rewritten at merge |

Canonical curriculum JSON after merge must use:

```text
book.book_id === <catalog_book_id>
```

on the book object and on entity records’ `book_id` fields (when present).

---

## 2. Alias table (pilot)

| Registry | Catalog `book_id` | Known aliases | Entity ID prefix examples (not rewritten) |
|---|---|---|---|
| BH1 | `beehive_1_sb` | `beehive_1_sb` | `beehive_1_sb_` |
| BE1-SB | `big_english_1_sb` | `bep1_sb`, `big_english_1_sb` | `bep1_` |
| BE2-SB | `big_english_2_sb` | `bep_sb_2`, `big_english_2_sb` | `bep2_` |
| RH2A | `reach_higher_2a` | `rh_2a`, `reach_higher_2a` | `rh_2a_`, `reach_higher_2a_` |

Add new aliases to [`book_id_aliases.json`](./book_id_aliases.json) when extraction introduces another string for the same catalog book.

---

## 3. Entity ID policy

**Do not rewrite** `unit_id`, `page_id`, `vocabulary_id`, etc. at merge time.

Reason: IDs are already unique within a book; rewriting prefixes risks silent relationship breakage and makes audits harder to compare to verified unit batches.

Extraction-era prefixes remain allowed fingerprints. Catalog joins and app routing use `books.book_id` / `book.book_id`, not entity ID prefixes.

---

## 4. Merge-time normalization

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

## 5. How to extend

1. Add/update the book entry in `book_id_aliases.json`.
2. Keep `catalog_book_id` identical to Postgres `books.book_id`.
3. Re-run merge (or `normalize_canonical_book_ids.mjs`) so Storage reflects the map.
4. Mention the alias in the Dataset Registry book notes.

---

## 6. Out of scope

- Renaming Storage folders or Postgres rows (already catalog-correct for pilots)
- Rewriting entity ID strings
- Schema 0.2 curriculum field changes
