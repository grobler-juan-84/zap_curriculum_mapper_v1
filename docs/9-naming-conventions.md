# General Curriculum Mapper — Naming Conventions

**Status:** ACTIVE  
**Version:** 1.2  
**Purpose:** Project-wide authority for naming folders, files, code symbols, database/storage identifiers, and curriculum JSON. Applies across all phases.

**Related:** Locked as [D009](./4-decisions.md#d009--project-wide-naming-conventions). Enforced for agents via `.cursor/rules/naming_conventions.mdc`. Catalog identity remains under [D007](./4-decisions.md#d007--catalog-book_id-is-canonical-aliases-normalized-at-merge). Origin brainstorming: [`project-tracking/2-internal-brainstorming.md`](./project-tracking/2-internal-brainstorming.md) (2026-10-07 naming entry).

---

## 1. Scope

This document governs **new** work going forward. It does not silently rewrite grandfathered pilot identities (see §6).

It covers:

- repository folders and documentation filenames
- React / TypeScript / Node / Python / SQL identifiers and filenames
- Supabase Storage buckets, series slugs, and object path segments
- registry IDs, catalog `book_id` values, and curriculum JSON entity IDs
- environment variables and Cursor rule filenames
- local-only assets and public demo assets
- schema JSON filenames

---

## 2. Identity vocabulary (do not interchange)

| Identity | Role | Form | Examples |
|---|---|---|---|
| **Registry ID** | Human/ops shorthand only | Uppercase with hyphens | `BE1-SB`, `BH2`, `RH2B` |
| **Catalog `book_id`** | Technical join/path identity in Postgres `books.book_id`, Storage, app routing, and canonical JSON | Full-word `snake_case` | `big_english_1_sb`, `beehive_1_sb`, `reach_higher_2a` |
| **Series slug** | Storage path prefix | Full-word `kebab-case` | `big-english`, `beehive`, `reach-higher` |
| **Postgres UUID** | Database row identity for a book (`books.id`) | UUID | Prefer code name `bookUuid` |
| **Entity ID** | Stable graph identity inside one curriculum JSON dataset | Prefixed string | See §5 |

### 2.1 Code naming preference

Use `registryId`, `catalogBookId`, and `bookUuid`.

Avoid bare `bookId` unless the meaning is unambiguous in context.

Legacy app alias: `stableBookId` means the same thing as `catalogBookId`. Prefer `catalogBookId` in new and refactored TypeScript.

### 2.2 Postgres column collision (do not collapse in TypeScript)

| SQL column | Table | Meaning | Preferred TS name |
|---|---|---|---|
| `books.book_id` | `books` | Catalog text identity | `catalogBookId` |
| `book_files.book_id` | `book_files` | UUID FK → `books.id` | `bookUuid` |
| `dataset_versions.book_id` | `dataset_versions` | UUID FK → `books.id` | `bookUuid` |

Never map both layers to a single ambiguous `bookId` property when both can appear in the same feature.

Registry IDs are never Storage folder names. Catalog `book_id` is never rewritten into entity ID prefixes for grandfathered pilots (D007).

---

## 3. Style matrix

| Scope | Convention | Examples / notes |
|---|---|---|
| Multiword repository / feature folders | lowercase `kebab-case` | `project-tracking`, `curriculum-library`; keep conventional `src`, `lib`, `scripts`, `schemas`, `assets` |
| New markdown docs | lowercase `kebab-case` | Numbered root docs: `N-kebab-case.md` (e.g. `9-naming-conventions.md`, `4-decisions.md`) |
| Operating trackers (docs 4–7) | same `N-kebab-case.md` | `4-decisions.md`, `5-progress.md`, `6-todo.md`, `7-future.md` |
| React components / pages / types | `PascalCase` | `ValidationWorkspace`, `BookFileBatch` |
| Hooks / functions / variables | `camelCase` | `useTeacherAiResponses`, `catalogBookId` |
| Acronyms in code **and filenames** | treat as words | `TeacherAiAssistant`, `pdfUrl`; not `TeacherAIAssistant`. All-caps reserved for constants/env |
| Executable Node scripts | `snake_case.mjs` | `merge_canonical_book.mjs` |
| Node/TS service and library modules | established `camelCase` | `phase1Validation.mjs`, `validationService.ts` |
| Python files/packages | `snake_case` | ecosystem standard |
| SQL tables/columns/migration suffixes | `snake_case` | timestamp prefix remains `YYYYMMDDHHMMSS_...sql` |
| JSON keys / schema fields | `snake_case` | `book_id`, `continuous_text` |
| Machine schema filenames | lowercase with dotted version segment allowed | `phase1-0.1.schema.json` |
| Constants / environment variables | `UPPER_SNAKE_CASE` | only public browser values use `VITE_*`; never prefix service-role secrets with `VITE_` |
| Storage bucket IDs / series slugs | lowercase `kebab-case` | `book-datasets`, `big-english`, `reach-higher` |
| Cursor rule filenames | `snake_case.mdc` | `naming_conventions.mdc` |
| Fixed Storage leaf names | stable lowercase names | `source.pdf`, `batches/unit_01.json`, `canonical/v1.json`, `cover.png` |
| Phase 1 whole-book audit reports | `{registry_id}_canonical_v{N}_audit.md` | Ops-facing; registry ID is intentional. Body must still state catalog `book_id` |
| Local-only source PDFs (app assets) | prefer catalog `book_id` | e.g. `big_english_1_sb.pdf` under `assets/books/{series_slug}/` |
| Public static demo assets | presentation kebab-case allowed | e.g. `beehive-1-cover.svg` — not required to match catalog IDs |

---

## 4. Catalog `book_id` templates (new books)

Preserve locked D007 pilot catalog IDs. For every **new** book, use full words — no new `bep`, `be`, or `rh` abbreviations as catalog identities.

| Series | Template | Notes |
|---|---|---|
| Beehive | `beehive_{level}_sb` | Matches locked `beehive_1_sb` |
| Big English | `big_english_{level}_{sb\|wb}` | Matches locked `big_english_1_sb` / `big_english_2_sb` |
| Reach Higher | `reach_higher_{level}` | Matches locked `reach_higher_2a`; **do not** add `_sb` only on later books |

Series slug remains the kebab-case series folder (`beehive`, `big-english`, `reach-higher`).

---

## 5. Entity IDs and extraction filenames (new books)

For newly extracted books, use the **full catalog `book_id`** as the entity prefix:

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

Rules:

- Zero-pad consistently (`unit_01`, `page_001`, `vocab_0001`, …).
- Do not invent new shortened prefixes (`bep3_*`, `rh_3a_*`, …).
- If a source requires more than one logical page record for the same printed page, keep the printed page in data and add a deterministic record suffix rather than colliding IDs.

Local / archival batch filename:

```text
{catalog_book_id}_unit_{NN}.json
```

Storage paths stay:

```text
{series_slug}/{catalog_book_id}/batches/unit_{NN}.json
{series_slug}/{catalog_book_id}/canonical/v{dataset_version}.json
{series_slug}/{catalog_book_id}/source.pdf
```

---

## 6. Legacy / grandfathered pilots

The four Phase 1 COMPLETE pilots remain accepted legacy exceptions for entity ID prefixes, uploaded Storage keys, catalog IDs, and archival filenames:

| Registry | Catalog `book_id` | Legacy entity prefix examples |
|---|---|---|
| BE1-SB | `big_english_1_sb` | `bep1_*` |
| BE2-SB | `big_english_2_sb` | `bep2_*` |
| BH1 | `beehive_1_sb` | `beehive_*` / series-specific prefixes as extracted |
| RH2A | `reach_higher_2a` | `rh_2a_*` |

D007 still applies: merge/normalize rewrites `book_id` / same-book relationship book fields to the catalog ID; **entity ID strings are not rewritten silently**.

Aliases in [`phase-1/book_id_aliases.json`](./phase-1/book_id_aliases.json) are compatibility data, not preferred new names.

---

## 7. Backward-audit policy

Do not mass-rename. Classify each finding as one of:

1. **Safe cosmetic rename** — docs links/casing, local asset typos (`assests` → `assets`), acronym filename fixes (`TeacherAIAssistant` → `TeacherAiAssistant`), unambiguous code symbol cleanup.
2. **Mapper / alias cleanup** — documentation or tool clarity without changing stored graph IDs (e.g. TS `bookId` → `bookUuid` / `catalogBookId`).
3. **Versioned migration required** — any change to canonical entity IDs or Storage keys that are already referenced.
4. **Accepted legacy exception** — leave as-is and document (pilot entity prefixes; public demo cover filenames may stay presentation-kebab).

Any canonical entity-ID migration requires a separate locked decision, old→new ID map, relationship rewrite, new dataset version, automated validation, and whole-book re-audit.

### 7.1 Safe rename batch status (from 2026-10-07 audit)

**Completed 2026-10-07:**

- `app/src/assests/` → `app/src/assets/` (gitignored local folder; `.gitignore` updated)
- Local PDFs renamed to catalog IDs (`beehive_1_sb.pdf`, `big_english_1_sb.pdf`, `big_english_2_sb.pdf`, `reach_higher_2a.pdf`)
- `TeacherAIAssistant.tsx` → `TeacherAiAssistant.tsx` (component/export renamed)
- Root docs → `N-kebab-case.md` (`1-project-overview.md`, `4-decisions.md`, `5-progress.md`, `6-todo.md`, `7-future.md`)
- Phase Title_Case docs under `docs/phase-*` → lowercase kebab-case; live links and Cursor rules updated
- Historical entries in `project-tracking/0-project-steps.md` intentionally retain old filenames as a chronology

**Still pending (mapper / alias cleanup — not this batch):**

- App TS identity fields: prefer `bookUuid` / `catalogBookId` over overloaded `bookId` / `stableBookId`

Audit report filenames using registry IDs (`BE1-SB_canonical_v1_audit.md`, …) are **accepted** under §3.

---

## 8. Approved abbreviations

| Abbreviation | Meaning | Where allowed |
|---|---|---|
| `SB` / `sb` | Student Book | Registry IDs (`BE1-SB`); catalog suffix `_sb` |
| `WB` / `wb` | Workbook | Registry IDs (`BE1-WB`); catalog suffix `_wb` |
| `BH` | Beehive (registry only) | Registry IDs (`BH1`, `BH2`) — not new catalog/entity prefixes |
| `BE` | Big English (registry only) | Registry IDs (`BE1-SB`) — not new catalog/entity prefixes |
| `RH` | Reach Higher (registry only) | Registry IDs (`RH2A`) — not new catalog/entity prefixes |

Do **not** introduce new extraction aliases such as `bep3_sb`, `be_3_sb`, or `rh_2b` as preferred catalog IDs. If an extractor emits a temporary alias, record it in the alias map and normalize at merge (D007).

---

## 9. Agent / implementation checklist

When creating or renaming project artifacts:

1. Choose names from the style matrix in §3.
2. For books, set registry ID, catalog `book_id`, and series slug as distinct fields.
3. For new extractions books, generate entity IDs from the full catalog `book_id` (§5).
4. Do not “fix” grandfathered pilot entity IDs without an explicit migration decision (§6–§7).
5. Prefer explicit code names (`catalogBookId`, `bookUuid`) over overloaded `bookId` or legacy `stableBookId`.
6. Treat acronyms as words in **filenames and** identifiers (`Ai`, not `AI`).
7. Do not rename until the change is classified under §7; prefer small risk-separated batches.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-07 | Created as project-wide naming authority (D009). Promoted from internal brainstorming. |
| 2026-10-07 | v1.1 — Clarified doc casing targets, audit-report filenames, local/public assets, schema filenames, Postgres UUID vs catalog collision, and `stableBookId` → `catalogBookId` preference after repo naming audit. |
| 2026-10-07 | v1.2 — Applied §7.1 safe cosmetic rename batch (assets, TeacherAiAssistant, docs kebab-case). Mapper `bookId` cleanup still pending. |
