# General Curriculum Mapper — Progress

**Status:** ACTIVE  

**Version:** 1.0  

**Last updated:** Step 156

**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** PAUSED at 14/18 COMPLETE (D015).

- **D017** locked; BE2-SB v2 provisional Book Intelligence working baseline.

- BE3 A/B/A+B refine pack + SS dry checks **9/9** + A+B regen reproducibility **9/9**.

- Nine-column BI UI data contract draft + BE3 Units 1–9 JSON + local preview (QA 9/9).

- **BE3 U1–9 BI JSON uploaded** to Supabase `book-datasets` (`…/interpretations/…`); SHA-256 integrity **PASS**. No `book_files` / schema / UI wiring.

## In progress

- None (Storage companion recorded; awaiting owner next prompt).

## Next

- Owner-gated: wire UI to Storage, register `book_files`, harden preview, other books, or pause.

## Blocked

- None hard. Soft: F017 parked; BI contract still draft / not locked; UI still local Vite copy.

---

## Snapshot notes

- Active Git branch: `phase-2`.

- Storage: `book-datasets/big-english/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json`

- Upload script: `scripts/upload_book_intelligence_json.mjs`

- Preview (local): `/app/book-intelligence`

- Direction: D017 LOCKED; D018 LOCKED (Chalkie prompt iterations).
