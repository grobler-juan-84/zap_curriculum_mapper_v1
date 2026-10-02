# General Curriculum Mapper — Project Status

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 9  
**Purpose:** Short, evolving snapshot of project progress. Rewrite the three sections below after each file-changing prompt so this file always reflects the current state.

---

## 1. What has been done

- Core Phase 1–7 architecture and curriculum philosophy documented under `docs/`.
- Documentation tooling and Cursor rules in place (including local auto-commit).
- Beehive 1 SB unit batches `01–08` extracted under `data/phase1/beehive_1_sb/` (schema `0.1`).
- Human verification recorded for all Beehive 1 SB units (Units 1 & 4 PDF-checked; remaining units accepted by project decision). Open audio/workbook issues and SEL schema gaps left documented.
- Dataset registry updated: BH1 EXTRACTED + human verification COMPLETE; Phase 1 still IN PROGRESS (no canonical merge / whole-book audit yet).

---

## 2. Current status

- **Focus:** Phase 1 — Curriculum Extraction & Dataset Development.
- **BH1:** Unit batches complete and human-verified; automated validation not run; canonical `beehive_1_sb.json` not created; Phase 1 not complete.
- **Pilot:** Beehive 1 baseline done enough to start cross-series testing; Big English 1 and Reach Higher 2A still not started.
- **Repo:** Local commits expected after Agent file changes; push remains explicit-only.

---

## 3. Next small step

**Suggested next move (depends on the next prompt):** Extract **Big English 1 Student Book — Unit 1 only** with `docs/3-Google_AI_Studio_Prompt.md`, save as `data/phase1/big_english_1_sb/big_english_1_sb_unit_01.json`, then compare schema fit against Beehive.

**Bird’s-eye still to do (not this step):** BH1 canonical merge + whole-book audit; continue pilot Reach Higher 2A; schema review (incl. SEL gaps); then later phases.

---
