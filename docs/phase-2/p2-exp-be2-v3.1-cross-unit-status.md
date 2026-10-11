# Phase 2 V3.1 + Cross-Unit Experiment Status — BE2-SB

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-11  
**Decisions:** D015, D016, D017  
**Purpose:** Inventory and validation record for Big English 2 Student Book Phase 2 V3.1 unit analyses and cross-unit consolidation/connection experiments. Distinguishes confirmed findings, experimental preferences, and unresolved issues. Does **not** lock a production methodology or schema.

---

## 1. Scope

| Item | Value |
|---|---|
| Catalog book | `big_english_2_sb` |
| Units analyzed (V3.1) | `bep2_unit_01`, `bep2_unit_06`, `bep2_unit_08` |
| Unit prompt | [`phase2-v3.1-prompt.md`](./phase2-v3.1-prompt.md) |
| Preferred cross-unit prompt | [`cross-unit-v1.2-prompt.md`](./cross-unit-v1.2-prompt.md) |
| Planning SoT | [`phase-2-overview-v2.md`](./phase-2-overview-v2.md) |

---

## 2. File inventory (organized)

### Unit interpretations (source of truth)

| Unit | Path | Schema |
|---|---|---|
| U1 *In My Classroom* | `data/phase2/big_english_2_sb/interpretations/be2-sb-u01-v3.1.json` | `phase2_linguistic_anatomy` `0.3.1-experimental` |
| U6 *My Day* | `data/phase2/big_english_2_sb/interpretations/be2-sb-u06-v3.1.json` | same |
| U8 *Wild Animals* | `data/phase2/big_english_2_sb/interpretations/be2-sb-u08-v3.1.json` | same |

These three files are the **source of truth for unit-level findings**. Cross-unit outputs must preserve exact local IDs and evidence references from these files.

### Cross-unit outputs (historical / experimental)

| Label | Path | Schema on disk | Notes |
|---|---|---|---|
| V1.1 | `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.1.json` | `phase2_cross_unit_consolidation` `0.1-experimental` | Consolidation-style inventory |
| V1.2 (filename) | `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.2.json` | **same as V1.1** | **Byte-identical to V1.1**; not a true V1.2 connections run |

No Cross-Unit V1 prompt or output was found in the repository.

### Prompts

| Doc | Role |
|---|---|
| [`phase2-v3.1-prompt.md`](./phase2-v3.1-prompt.md) | Current experimental unit-level linguistic analysis prompt |
| [`cross-unit-v1.2-prompt.md`](./cross-unit-v1.2-prompt.md) | Preferred experimental cross-unit approach: **connections only** |

---

## 3. Confirmed findings

1. All three V3.1 unit JSON files parse as complete, valid JSON with expected top-level keys (`schema`, `source`, `language_structures`, `foundational_skills`, `vocabulary`, `pages`, `evidence_gaps`).
2. Unit analyses remain the SoT; Phase 1 canonical datasets were not modified.
3. `bep2_unit_08:FS-09` **exists** in the U8 V3.1 file (`Digraph Phonic Decoding for 'ou' and 'ow'`), with evidence refs to U8 phonics activities. It is not a phantom ID relative to the current unit SoT.
4. Cross-Unit V1.2 **prompt** requires: connections involving ≥2 distinct units; exact source IDs; shared_skill vs related_knowledge; schema `phase2_cross_unit_connections` `0.1.2-experimental`; no unit inventories.
5. Neither V3.1 nor Cross-Unit V1.2 is a locked production methodology (D017).

---

## 4. Experimental preferences

| Preference | Meaning |
|---|---|
| Unit analysis | Use Phase 2 **V3.1** for further unit runs in this iteration |
| Cross-unit | Prefer **V1.2 connections-only** for the next genuine cross-unit Studio run |
| Scale | Do **not** scale to a full book until an end-to-end later-phase influence experiment clarifies usefulness |
| History | Preserve earlier LR experiment reviews under `p2-exp-*` and the mislabeled V1.2 cross-unit file |

---

## 5. Unresolved issues

1. **True V1.2 connections output missing.** The file named `be2-cross-unit-v1.2.json` is byte-identical to `be2-cross-unit-v1.1.json` and uses the consolidation schema, not `phase2_cross_unit_connections`. Do **not** treat it as a successful V1.2 run.
2. **V1.1-style consolidation violates V1.2 rules** when judged against the V1.2 prompt: multiple `CS-*` rows involve only one unit; `unit_specific_findings` reproduces inventories.
3. **FS-09 caution.** Current U8 SoT contains FS-09. Any prior claim of a bad FS-09 reference must be re-checked against a *true* V1.2 connections output — do not silently accept older consolidation claims.
4. **No Cross-Unit V1 artifacts** found on disk (prompt or JSON).
5. **End-to-end later-phase experiment** (how Phase 2 findings influence curriculum mapping / enrichment / packaging) is the next priority and has not started.

---

## 6. Validation checklist executed (2026-10-11)

| Check | Result |
|---|---|
| JSON syntax (U1, U6, U8, cross v1.1, cross v1.2 filename) | PASS (all parse) |
| Incomplete / truncated unit files | Not observed |
| U8 `FS-09` present in unit SoT | PASS (exists) |
| Cross v1.2 filename == true V1.2 schema | **FAIL** (duplicate of v1.1 consolidation) |
| Cross output ≥2 units per connection (vs V1.2 rules) | **FAIL** for labeled v1.2 file (single-unit CS rows present) |

---

## 7. Next experiment direction

1. Bounded **end-to-end** experiment: feed V3.1 unit findings (and, when available, true V1.2 connections) into a later-phase sketch to test usefulness for Chalkie/context-style prompts — before whole-book scale.
2. If cross-unit evidence is still needed first: re-run Studio with [`cross-unit-v1.2-prompt.md`](./cross-unit-v1.2-prompt.md) against the three interpretation files and save a new file that actually uses schema `phase2_cross_unit_connections` (do not overwrite the historical mislabeled file without renaming).

---

## Change log

| Date | Change |
|---|---|
| 2026-10-11 | Created after inventory/validation sync; organized data paths; recorded V1.2 file mismatch. |
