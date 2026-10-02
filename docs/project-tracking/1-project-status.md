# General Curriculum Mapper — Project Status

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 10  
**Purpose:** Short, evolving snapshot of project progress. Rewrite the three sections below after each file-changing prompt so this file always reflects the current state.

---

## 1. What has been done

- Core Phase 1–7 architecture and curriculum philosophy documented under `docs/`.
- Documentation tooling and Cursor rules in place (including local auto-commit).
- Beehive 1 SB unit batches `01–08` extracted and human-verified (`data/phase1/beehive_1_sb/`).
- Big English 1 SB unit batches `01–09` extracted and human-verified (`data/phase1/big_english_1_sb/`) after project review.
- Registry updated for BH1 and BE1-SB: EXTRACTED + human verification COMPLETE; both remain Phase 1 IN PROGRESS (no canonical merge / whole-book audit yet).

---

## 2. Current status

- **Focus:** Phase 1 — Curriculum Extraction & Dataset Development.
- **BH1 / BE1-SB:** Unit batches complete and human-verified; automated validation not run; canonical book JSON not created.
- **Pilot:** Two of three representative series done; Reach Higher 2A still not started; cross-series schema review still pending.
- **Known follow-ups:** BE1 internal IDs use `bep1_sb` while folder/registry use `big_english_1_sb` — normalize at merge time; open audio/visual issues and Think Big / SEL schema gaps remain documented.

---

## 3. Next small step

**Suggested next move (depends on the next prompt):** Extract **Reach Higher 2A — Unit 1** (or first major instructional section) with `docs/3-Google_AI_Studio_Prompt.md`, save under `data/phase1/reach_higher_2a/`, then run the planned cross-series schema review across BH1 + BE1-SB + RH2A.

**Bird’s-eye still to do (not this step):** canonical merges + whole-book audits for BH1/BE1-SB; schema review (SEL / Think Big); continue remaining books; later phases.

---
