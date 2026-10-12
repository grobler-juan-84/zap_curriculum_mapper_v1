# Phase 2 V3.1 + Cross-Unit Experiment Status — BE2-SB

**Status:** ACTIVE  
**Version:** 1.1  
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

### Cross-unit outputs

| Label | Path | Schema on disk | Notes |
|---|---|---|---|
| V1.1 | `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.1.json` | `phase2_cross_unit_consolidation` `0.1-experimental` | Historical consolidation-style inventory |
| V1.2 | `data/phase2/big_english_2_sb/cross-unit/be2-cross-unit-v1.2.json` | `phase2_cross_unit_connections` `0.1.2-experimental` | **True connections-only run** (owner-updated 2026-10-11): 8 connections; all ≥2 units; local IDs resolve against unit SoT |

No Cross-Unit V1 prompt or output was found in the repository.

**History note:** An earlier file at the V1.2 path was briefly a byte-identical copy of V1.1. That mislabeled state is superseded by the current connections JSON; V1.1 remains preserved separately.

### Prompts

| Doc | Role |
|---|---|
| [`phase2-v3.1-prompt.md`](./phase2-v3.1-prompt.md) | Current experimental unit-level linguistic analysis prompt |
| [`cross-unit-v1.2-prompt.md`](./cross-unit-v1.2-prompt.md) | Preferred experimental cross-unit approach: **connections only** |

---

## 3. Confirmed findings

1. All three V3.1 unit JSON files parse as complete, valid JSON with expected top-level keys.
2. Unit analyses remain the SoT; Phase 1 canonical datasets were not modified.
3. `bep2_unit_08:FS-09` exists in the U8 V3.1 file and is cited in V1.2 CON-05 (phonics digraph blending) with a resolvable local ID.
4. Current Cross-Unit V1.2 JSON matches the preferred prompt shape: `phase2_cross_unit_connections` `0.1.2-experimental`; `shared_skill` / `related_knowledge`; no unit inventories; every connection involves ≥2 units; occurrence `local_id` values resolve against the three unit files.
5. Neither V3.1 nor Cross-Unit V1.2 is a locked production methodology (D017 Progressive Curriculum Intelligence — research artifacts only; Book Intelligence is the active direction).

### V1.2 connection summary (experimental)

| ID | Type | Units | Name |
|---|---|---|---|
| CON-01 | related_knowledge | U1+U6 | Wh- Question Formation and Auxiliary Inversion |
| CON-02 | related_knowledge | U6+U8 | Present Simple Third-Person Singular Subject-Verb Agreement |
| CON-03 | related_knowledge | U1+U8 | Pronoun-Referent Agreement Across Singular and Plural Subjects |
| CON-04 | related_knowledge | U1+U6 | Pronoun Contractions with Present Tense Copular / Helping Verbs |
| CON-05 | shared_skill | U1+U6+U8 | Phonemic Blending of Multi-Letter Digraphs to Read Words |
| CON-06 | shared_skill | U1+U6+U8 | Interactive Pairwork Command: ask and answer |
| CON-07 | shared_skill | U1+U6+U8 | Phonics Decoding Task Command: blend the sounds |
| CON-08 | shared_skill | U1+U6+U8 | Chronological/Numerical Ordering Task Command |

---

## 4. Experimental preferences

| Preference | Meaning |
|---|---|
| Unit analysis | Use Phase 2 **V3.1** for further unit runs in this iteration |
| Cross-unit | Prefer **V1.2 connections-only** (current BE2 U1/U6/U8 file is the working example) |
| Scale | Do **not** scale to a full book until an end-to-end later-phase influence experiment clarifies usefulness |
| History | Preserve V1.1 consolidation and earlier LR experiment reviews under `p2-exp-*` |

---

## 5. Unresolved issues

1. **No Cross-Unit V1 artifacts** found on disk (prompt or JSON) — acceptable; not required.
2. **End-to-end later-phase experiment** (how Phase 2 findings influence curriculum mapping / enrichment / packaging) is the next priority and has not started.
3. Teacher validation of earlier “one glance” syntheses still pending (soft).
4. Linguistic usefulness of the eight V1.2 connections is **not teacher-validated**; structural/ID checks pass only.

---

## 6. Validation checklist (re-run 2026-10-11 after V1.2 update)

| Check | Result |
|---|---|
| JSON syntax (U1, U6, U8, cross v1.1, cross v1.2) | PASS |
| Incomplete / truncated unit files | Not observed |
| U8 `FS-09` present in unit SoT | PASS |
| Cross v1.2 == `phase2_cross_unit_connections` `0.1.2-experimental` | PASS |
| Cross v1.2 distinct from v1.1 | PASS |
| Every connection ≥2 units | PASS (8/8) |
| Occurrence local IDs resolve in stated unit SoT | PASS (0 missing) |

---

## 7. Next experiment direction

Bounded **end-to-end** experiment: feed V3.1 unit findings + current V1.2 connections into a later-phase sketch to test usefulness for Chalkie/context-style prompts — before whole-book scale.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-11 | Created after inventory/validation sync; organized data paths; recorded V1.2 file mismatch. |
| 2026-10-11 | Owner replaced V1.2 JSON with true connections output; re-validated IDs/schema; cleared mismatch unresolved item. |
