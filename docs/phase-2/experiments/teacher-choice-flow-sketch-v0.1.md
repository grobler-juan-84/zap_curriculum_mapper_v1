# Teacher-Choice Flow Sketch — Prior Learning for One Lesson (v0.1)

**Status:** ACTIVE — prototype **design sketch** only  
**Version:** 0.1  
**Date:** 2026-10-19  
**Authority context:** D017 (progressive method), D019 (BI UI provisional), D020 (Phase 3 parked later)  
**Worked example:** Big English 2 Unit 8 · *Wild Animals* (horizontal mapping within Units 1–7)

**Related evidence (unchanged):**  
[`be2-u08-horizontal-map-lesson-input-pack-v0.1.md`](./be2-u08-horizontal-map-lesson-input-pack-v0.1.md) ·  
[`be2-u08-horizontal-map-teacher-choice-card-v0.1.md`](./be2-u08-horizontal-map-teacher-choice-card-v0.1.md) ·  
[`../../11-curriculum-mapping-workflow.md`](../../11-curriculum-mapping-workflow.md)

---

## 1. Status, purpose, and boundaries

### Purpose

Clarify the simplest teacher-facing end-to-end flow for choosing reusable prior learning for **one lesson**, so product direction and later usability review stay teacher-centred.

### This document is

| Is | Is not |
|---|---|
| A prototype **design sketch** | A production UI specification |
| Clarification of product direction | A locked data contract or API |
| Compatible with existing BE2 U8 HM evidence | A methodology / schema lock |
| Compatible with D020’s later vertical idea | Phase 3 activation or eligibility rules |

### Hard boundaries

- No build requirement, UI wireframes-as-spec, or Phase 2 closure.
- No change to Phase 3 parked status (**D020** — later priority, not a Phase 2 gate).
- No claim of classroom validation or product readiness.
- Horizontal mapping (same book) remains the current emphasis.

---

## 2. Design principles

1. **Current learning first** — show what this lesson already requires before prior-learning options.
2. **AI suggests; teacher decides** — recommendations inform choice; they do not control it.
3. **Soft AI default 0–5** — a small evidence-grounded set; **not** a cap on teacher additions from the full bank.
4. **None is valid** — the teacher may keep zero prior frames.
5. **Exposure ≠ mastery** — previously taught content is available for practice, not assumed known.
6. **Selected ≠ mandatory everywhere** — chosen language may be used selectively; no forced coverage of every selection in every activity.
7. **Keep provenance clear** — distinguish **source evidence**, **AI inference/suggestion**, **teacher additions**, and **mapper-generated examples**.

Visible teacher questions (keep this simple):

> What am I teaching now?  
> What might be useful to reuse?  
> What do I choose?  
> What will support my lesson?

---

## 3. Four-step teacher flow

```text
Current lesson need
→ AI suggests 0–5 relevant prior-language options
→ Teacher keeps, removes, adds, replaces, or selects none
→ Teacher reviews a concise final lesson-input summary
→ Later teaching support / packaging / generation may use those inputs selectively
```

### Step A — Current lesson context

Show the floor of the lesson before any reuse options:

- Unit / pages / lesson focus (as known)
- Required **current** vocabulary and language frames
- What is **not** prior retrieval (e.g. Unit 8 ability language stays current-unit)

### Step B — AI recommendation set

Present a small set of prior-language options (default **0–5**) drawn from eligible earlier units in the **same book** (horizontal mapping).

Each option should be scannable: short frame, why it might fit, caution if needed. Teachers should not need the full curriculum graph to understand the suggestion.

### Step C — Teacher-choice workspace

For each recommendation, the teacher may:

- **Keep**
- **Remove / deselect**
- **Replace**
- **Add** from the fuller prior-language bank
- **Select none**

Teacher additions must carry provenance (e.g. verified prior ID vs teacher-authored / unverified).

### Step D — Final lesson-input summary

A short, reviewable summary of what will support the lesson — current requirements + chosen prior language + additions/deselections — ready for later packaging or generation **without** claiming those systems are locked.

---

## 4. BE2 Unit 8 worked example (*Wild Animals*)

Evidence follows the recorded lesson-input pack (not a new selection).

### Current content (always present)

| Item | Content |
|---|---|
| Animals | cheetah, crocodile, elephant, giraffe, hippo, kangaroo, monkey, parrot, peacock, polar bear, snake, zebra |
| Preference (current unit) | e.g. `Do you like cheetahs? Yes, I do!` |
| Ability (current unit — **not** prior) | e.g. `Cheetahs can run.` / `Can …?` |

### AI-recommended prior frames (four; within soft 0–5)

| ID | Frame (short) | Why suggested |
|---|---|---|
| **PL-19** | `Do you like + noun?` (+/− answers) | Closest prior preference match |
| **PL-08** | `Me, too!` / `Me neither!` | Short agreement exchanges |
| **PL-01** | `What's … doing?` + *-ing* | Action talk after ability |
| **PL-03** | `How many … are there?` | Natural with animal pictures |

### Recorded teacher selection (lesson-input pack)

| Action | Item | Note |
|---|---|---|
| **Keep** | PL-19, PL-01, PL-03 | Final selected prior IDs |
| **Deselect** | PL-08 | Fuller sentence practice preferred for this class (`I like… / I like…, too`); PL-08 remains a valid option for other teachers |
| **Add** | `What is it?` / `What are they?` | Teacher-added identification — **not** a BE2 PL ID; **not** PL-22 |
| Select none | — | Not used |

### Provenance for the teacher-added ID frames

Label clearly as **unverified / vertical possibility** (claimed recycle from earlier grades / books), **not** BE2 Units 1–7 publisher evidence. Do not present as a bank PL ID until vertical mapping (later, D020) can support it.

---

## 5. What the final summary must contain

A usable lesson-input summary should include:

1. **Current-unit requirements** — vocab and current frames (including what is *not* prior).
2. **Teacher-selected prior language** — IDs / short frames kept.
3. **Teacher additions** — wording + provenance (verified prior vs teacher-added / unverified).
4. **Deselections** — where useful for later review (e.g. PL-08 deselected and why).
5. **Usage guidance**
   - Selective use only
   - No forced coverage of every selection
   - No false publisher attribution for mapper-generated or teacher-added wording

Downstream teaching support, packaging, or generation (when separately authorized) may consume this summary **selectively**. This sketch does not define those handoffs.

---

## 6. Future compatibility note (Phase 3 — parked)

**D020** keeps Phase 3 Vertical Mapping **parked as a later priority** (sequencing, not a Phase 2 “sufficiency” gate).

The **same teacher-choice flow** may later surface an additional suggestion source: earlier **books / grades**, still as a small AI set with teacher control.

**Non-binding example only:** when teaching Big English 3 Unit 1, there may be no earlier units in-book; later, vertical mapping could optionally suggest suitable prior learning from Big English 2 Units 1–9.

This note does **not** define eligibility rules, matching logic, a vertical UI, or an implementation timeline. Phase 3 remains parked.

---

## 7. Open questions for later review

Leave explicitly open:

1. Page, panel, or guided stepper?
2. How much evidence is visible by default vs on demand?
3. How the teacher browses the full prior-language bank?
4. How the final selection is handed to later phases / packaging / generation?
5. How horizontal suggestions and (later) vertical suggestions are grouped visually?

---

## 8. Non-claims

This sketch does **not**:

- lock UI, schema, methodology, or Phase 2 completion;
- unlock, schedule, or productize Phase 3;
- prove classroom effectiveness;
- require Chalkie or any generator to consume the summary now.
