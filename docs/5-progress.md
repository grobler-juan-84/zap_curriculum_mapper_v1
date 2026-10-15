# General Curriculum Mapper — Progress

**Status:** ACTIVE  

**Version:** 1.0  

**Last updated:** Step 154

**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** PAUSED at 14/18 COMPLETE (D015).

- **D017** locked; BE2-SB v2 provisional Book Intelligence working baseline.

- BE3 A/B/A+B refine pack + SS dry checks **9/9** + A+B regen reproducibility **9/9**.

- Nine-column BI UI data contract draft + BE3 Units 1–9 JSON artifact.

- Read-only TS loader/validator + CLI (**PASS**, `units=9`).

- **Read-only BE3 Units 1–9 BI UI preview** at `/app/book-intelligence` (local JSON + loader; all 8 content fields per unit).

## In progress

- None (U1–9 preview recorded; awaiting owner next prompt).

## Next

- Owner-gated: harden preview, other books, or pause — **no DB/Storage** until asked.

## Blocked

- None hard. Soft: F017 parked; BI contract/UI still draft / not locked.

---

## Snapshot notes

- Active Git branch: `phase-2`.

- BI contract: [`phase-2/book-intelligence-ui-data-contract-v1.md`](./phase-2/book-intelligence-ui-data-contract-v1.md)

- Loader: `app/src/lib/bookIntelligence/` · Preview: `app/src/features/book-intelligence/` · CLI: `scripts/validate_book_intelligence_json.mjs`

- BE3 U1–9 JSON: `data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json`

- Direction: D017 LOCKED; D018 LOCKED (Chalkie prompt iterations).
