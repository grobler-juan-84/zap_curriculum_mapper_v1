# Phase 2 — BE2 Candidate Units (First Experiment Set)

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-10-09  
**Decision:** [D016](../4-decisions.md)  
**Purpose:** Record the owner-approved Big English 2 Student Book units selected for the first controlled Phase 2 interpretation experiments under D015.

---

## Scope

- Series: Big English only (Beehive and Reach Higher excluded).
- Focus book: `big_english_2_sb` (BE2-SB).
- Prior / future books for vertical links: `big_english_1_sb` / `big_english_1_wb` and `big_english_3_sb` / `big_english_3_wb`.
- This document selects **candidates**. It does **not** lock a Phase 2 schema, storage model, prompt, or implementation.

---

## Approved candidates

| Priority | BE2-SB unit | Title | Unit ID | Printed pages | First-run? |
|---:|---|---|---|---|---|
| 1 | 6 | My Day | `bep2_unit_06` | 90–105 | **Yes** |
| 2 | 7 | My Favorite Food | `bep2_unit_07` | 112–127 | Later |
| 3 | 8 | Wild Animals | `bep2_unit_08` | 128–143 | Later |

### Why these three

| Unit | Primary linguistic system under test | Strongest BE1 anchors | Strongest BE3 anchors |
|---|---|---|---|
| U6 My Day | Timed present-simple routines / clock time | U5 Busy at Home (ongoing actions); U7 meal habits (`every day`) | U1 Wake Up! (finer times, before/after, frequency set) |
| U7 My Favorite Food | Food preferences → countability → offers | U7 Party Time; U9 `like / don't like` | U7 Fabulous Food! (existential + graded quantifiers) |
| U8 Wild Animals | Modal ability `can/can't` | U6 On the Farm (animal actions, not ability) | U4 Amazing Animals (`can/can't` + habitats) |

### Explicitly not selected for this first set

- **U5 My Dream Job** — strong BE3 jobs continuation; weak BE1 prior.
- **U2 My Games** — strong `like + -ing` chain, but overlaps preference-testing with U7.
- **U1 / U3 / U4 / U9** — strong one-sided links only.

---

## Evidence rules for candidate use

1. Treat Phase 1 fields (`units`, `language`, `vocabulary`, `activities`, `curriculum_components`, page IDs) as **book evidence**.
2. Treat “builds on / prepares for / progresses to” claims as **preliminary AI interpretation** until an experiment result is reviewed.
3. Do **not** treat matching topics or repeated vocabulary alone as proof of learning progression.
4. Distinguish BE1 `Can I help you?` (request) from BE2/BE3 ability `can/can't`.

---

## Related

- First-run protocol: [`be2-unit-6-experiment-protocol.md`](./be2-unit-6-experiment-protocol.md)
- Phase 1 process / Phase 2 purpose: [`../phase-1/curriculum-mapping-process.md`](../phase-1/curriculum-mapping-process.md)
- Dataset registry: [`../phase-1/dataset-registry.md`](../phase-1/dataset-registry.md)

---

## Change log

| Date | Change |
|---|---|
| 2026-10-09 | Created; owner approved U6 / U7 / U8 with U6 as first experiment (D016). |
