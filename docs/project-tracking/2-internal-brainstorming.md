# Internal Brainstorming

**Status:** ACTIVE / EVOLVING  
**Version:** 1.0  
**Purpose:** Working space for ideas, options, and possible solutions to open project questions. Nothing here is binding until promoted into `3-project-decisions.md`.

---

## How to use this document

- Capture questions, options, trade-offs, and rough recommendations.
- Prefer short dated entries over long essays.
- Link related schema gaps, registry notes, or extraction issues when useful.
- When an idea becomes a firm project choice, record it in [`3-project-decisions.md`](./3-project-decisions.md) and leave a short pointer here.
- Do **not** treat this file as operational truth; the registry, schema, and locked decisions remain authoritative.

### Entry template

```markdown
### YYYY-MM-DD — Short question title

**Question:**  
**Context:**  
**Options:**
1. …
2. …
**Lean / notes:**  
**Status:** open | leaning | promoted to decision | parked
```

---

## Active themes

Current areas where brainstorming is especially useful:

1. Schema gaps revealed by cross-series extraction (SEL / Think Big / Big Question / glosses / intermittent reading prompts).
2. ID normalization across folder names vs internal `book_id` values.
3. Canonical merge workflow after unit-batch human verification.
4. Handling incomplete or truncated batches (e.g. BE2 Unit 2).
5. When to run automated validation vs continue human review.
6. Reach Higher Unit 4 extraction restriction and pilot completion path.
7. Google Sheets / React views over Phase 1 JSON.

---

## Open brainstorming entries

### 2026-10-05 — Schema gaps before more books

**Question:** Should we pause large-scale extraction and adjust schema 0.1 now that BH1, BE1-SB, BE2-SB, and RH2A (partial) have exposed recurring gaps?  
**Context:** Think Big / SEL reflection, Reach Higher Big Question, glossary definitions, and intermittent reading prompts are already logged as schema gaps.  
**Options:**
1. Continue extracting remaining books on schema 0.1; migrate later.
2. Run a focused cross-series schema review now; bump schema before more books.
3. Hybrid: lock a small additive schema patch for the highest-frequency gaps only, then continue.
**Lean / notes:** Pilot decision point in the registry already points toward review after representative RH2A extraction; Unit 4 still pending may delay a full review, but additive fields could be sketched now.  
**Status:** open

---

### 2026-10-05 — book_id / folder naming consistency

**Question:** How should we normalize IDs such as `big_english_1_sb` (folder) vs `bep1_sb` / `bep_sb_2` (JSON)?  
**Context:** Mismatches will complicate canonical merge, registry joins, and future app views.  
**Options:**
1. Treat folder / registry IDs as canonical; rewrite internal JSON IDs at merge time.
2. Treat extracted `book_id` as canonical; rename folders/registry to match.
3. Keep both with an explicit alias map in the registry or a mapping file.
**Lean / notes:** Merge-time normalization is already noted as a follow-up; an alias map may be the lowest-risk interim step.  
**Status:** open

---

### 2026-10-05 — Canonical merge trigger

**Question:** When should unit batches be merged into a canonical book JSON?  
**Context:** BH1, BE1-SB, and BE2-SB are human-verified at batch level but still Phase 1 IN PROGRESS; no whole-book audit yet.  
**Options:**
1. Merge as soon as all planned unit batches exist and are human-verified.
2. Merge only after automated validation passes.
3. Merge after human verification, then run whole-book audit on the canonical file.
**Lean / notes:** Spec language suggests merge after validated/verified batches; automated validation has not been run yet.  
**Status:** open

---

### 2026-10-05 — Truncated / incomplete batch recovery

**Question:** What is the preferred recovery path for BE2 Unit 2 (missing pages/vocabulary/language)?  
**Context:** Header was reconstructed for JSON validity; surviving activities/texts remain; empty arrays and an open issue document the gap.  
**Options:**
1. Full unit re-extraction into a replacement batch file.
2. Targeted re-extraction of only missing arrays, then merge into the existing file.
3. Leave until canonical merge and rebuild Unit 2 entirely then.
**Lean / notes:** Targeted repair is faster if the extraction prompt can reliably emit only the missing sections; full replace is cleaner if IDs would collide.  
**Status:** open

---

### 2026-10-05 — RH2A Unit 4 and pilot completion

**Question:** Can cross-series schema review start before RH2A Unit 4 exists?  
**Context:** Units 1–3 are human-verified; Unit 4 is blocked by an extraction restriction.  
**Options:**
1. Start schema review now using BH1 + BE1/BE2 + RH2A units 1–3.
2. Wait for Unit 4 so the RH2A representative book is complete.
3. Start a draft review now; finalize after Unit 4.
**Lean / notes:** Units 1–3 already expose distinctive RH structures (Big Question, glosses, intermittent prompts), so a draft review seems viable.  
**Status:** open

---

## Promoted / closed pointers

| Date | Topic | Outcome |
|---|---|---|
| — | — | No brainstorming items promoted yet. See [`3-project-decisions.md`](./3-project-decisions.md). |

---

## Parking lot

Ideas worth keeping but not actively exploring:

- Whether Google Sheets should remain a verification surface once a React dataset browser exists.
- Whether workbook extraction should follow each SB immediately or wait until SB canonical datasets stabilize.
- Long-term automation of registry fields from batch metadata.

---
