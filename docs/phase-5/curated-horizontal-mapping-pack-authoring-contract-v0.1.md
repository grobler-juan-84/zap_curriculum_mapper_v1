# Curated `[HM]` Pack Authoring Contract

**Status:** ACTIVE — verification-ready authoring gate for additional curated `[HM]` target packs  
**Version:** 0.1  
**Date:** 2026-10-24  
**Scope:** Documentation + test infrastructure only. Does **not** authorize a second product `[HM]` route, School Notes, inferred mappings, UI, or runtime behavior changes.

**Authority links:**

- Prior Learning / HM audit (esp. §8a coverage gate): [`chalkie-prior-learning-horizontal-mapping-audit-v0.1.md`](./chalkie-prior-learning-horizontal-mapping-audit-v0.1.md)
- Runtime store / entry shape: `app/src/features/chalkie/curatedHorizontalMappingEntries.ts`
- Builder (eligibility + exclusions): `app/src/features/chalkie/buildCuratedHorizontalMappingCandidates.ts`
- Contract validator (test infrastructure): `app/src/features/chalkie/curatedHorizontalMappingPackAuthoringContract.ts`
- Reference implementation: BE2 Unit 8 opener (`big_english_2_sb` Unit 8 pp.128–129)

---

## 1. Purpose

Define the **minimum owner-verified information** required before a **new** curated earlier-unit `[HM]` target pack may ship into the product store.

This contract answers: “What must be true and checked in before we may add another `[HM]` route?”  
It does **not** invent curriculum relationships. Expanding coverage without a pack that satisfies this contract remains **blocked** (§8a).

---

## 2. Hard rules (non-negotiable)

1. Entries are **human-curated and owner-verified**. Never infer usefulness from titles, themes, adjacent lessons, or Book Intelligence prose.
2. `[HM]` stays **earlier-unit only**. Same-unit recycle is `[PRIOR]`, not curated `[HM]`.
3. Never surface **current-page / visible-page** source evidence as curated `[HM]`.
4. Suggestions remain **optional and unchecked** by default; handoff only when the teacher selects.
5. Preserve existing `[PRIOR]`, BE2 opener `[HM]`, and session `[TEACHER-ADDED · UNVERIFIED]` behavior unless a separate prompt explicitly authorizes a change.
6. No School Notes product surface, notes store, or invented school-note content under this contract.
7. No OpenAI / API ranking for curated relationships.

---

## 3. Minimum pack fields (verification-ready)

A shippable curated `[HM]` **target pack** must name all of the following. Missing any item = incomplete; must not ship.

### 3.1 Target scope (exact route)

| Required | Meaning |
|---|---|
| `catalogBookId` | Catalog book identity (e.g. `big_english_2_sb`) |
| `targetUnitNumber` | Unit that may offer the cards |
| `targetPrintedPages` | Exact sorted printed-page spread for eligibility (fixture-narrow; not “whole unit”) |

A **new route** means a distinct `(catalogBookId, targetUnitNumber, targetPrintedPages)` triple — not extra PL IDs for an already-shipped target.

### 3.2 Source / earlier-unit relationship (per candidate)

| Required | Meaning |
|---|---|
| Stable candidate `id` | Curated identifier (e.g. `PL-19`) |
| `sourceUnitNumber` | Primary earlier unit; **must differ** from `targetUnitNumber` |
| `sourcePrintedPages` | Source SB printed pages for the relationship |
| `additionalSourceUnitNumbers` (optional) | Extra earlier units for dual-unit bank items only; none may equal the target unit |
| `sourceReference` | Teacher-facing source line (unit + pages) |
| `title`, `contentPreview`, `whyItMayHelp`, `caution` | Card content |
| `provenanceNote` | Why this is earlier-unit support (not current-page evidence) |
| `suggestionLabel` (optional) | Only when dual-unit bank wording cannot be expressed by the default card title formatter |

### 3.3 Exclusion checks (must be explicit and pass)

Before shipping, the pack must document and pass:

1. **Same-unit exclusion:** every primary (and additional) source unit ≠ target unit.
2. **Current-page exclusion:** no `sourcePrintedPages` overlap the pack’s `targetPrintedPages` (and the builder must continue to exclude overlap with the teacher’s visible pages at runtime).
3. **Target-page exactness:** route eligibility uses exact `targetPrintedPages` match — not “any pages in the unit.”

### 3.4 Ownership / verification evidence

| Required | Meaning |
|---|---|
| Owner-verified flag | Explicit confirmation the relationships were human-checked |
| Evidence citations | Repository paths (or equivalent durable citations) to the verified bank / teacher-choice / lesson-input pack that justifies the candidates |
| Short verification summary | One–three sentences naming what was verified and for which target spread |

Phase 2 research docs may support a pack **only** when they already name this exact target spread. Interpretive BI overviews alone do **not** qualify.

### 3.5 Fixture and acceptance-test requirements

Before product store merge for a new route:

1. Focused builder / eligibility tests for the new `(catalogBookId, unit, pages)` route.
2. Regression that existing BE2 U8 opener `[HM]` fixtures, merge/dedupe, optional defaults, and handoff rules remain unchanged unless separately authorized.
3. Coverage inventory still forbids unverified second routes (see `curatedHorizontalMappingCoverageInventory.test.ts`).
4. This authoring-contract validator accepts the new pack’s entries and verification record.

---

## 4. Reference pack (BE2 U8 opener)

| Field | Value |
|---|---|
| `catalogBookId` | `big_english_2_sb` |
| `targetUnitNumber` | `8` |
| `targetPrintedPages` | `[128, 129]` |
| Candidate IDs | `PL-19`, `PL-08`, `PL-01`, `PL-03` |
| Evidence (examples) | `docs/phase-2/experiments/be2-u01-u07-prior-language-bank-u08-horizontal-map-v0.1.md`; teacher-choice / lesson-input packs for the same opener; Slice 3 store + builder tests |

This is the **only** shipped curated `[HM]` route today. Extra PL IDs in research packs for the **same** opener are not a second route (§8a).

---

## 5. Unlock condition (product route)

A **new** curated `[HM]` product route may ship only when:

1. An owner-verified pack satisfying §3 is checked in (entries + verification evidence), and
2. Focused acceptance tests for that route are green, and
3. Runtime still preserves `[PRIOR]` / existing `[HM]` / `[TEACHER-ADDED · UNVERIFIED]` invariants.

Until then, §8a remains in force: **do not** add store entries, UI, or inferred mappings.

---

## 6. Non-goals

- No second product `[HM]` route in this document alone
- No School Notes / notes store
- No AI ranking or automatic relationship discovery
- No badges, filters, or Step 2 redesign
- No changes to canonical curriculum JSON solely to invent HM links

---

## 7. Test gate

Focused gate: `scripts/tests/curatedHorizontalMappingPackAuthoringContract.test.ts`

- Checked-in store entries must remain structurally complete and exclusion-safe.
- Incomplete synthetic entries / packs must be rejected by the validator.
- Must not manufacture a second runtime route or alter builder output.
