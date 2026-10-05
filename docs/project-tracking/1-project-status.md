# General Curriculum Mapper — Project Status

**Status:** ACTIVE  
**Version:** 1.0  
**Last updated:** Step 11  
**Purpose:** Short, evolving snapshot of project progress. Rewrite the three sections below after each file-changing prompt so this file always reflects the current state.

---

## 1. What has been done

- Core Phase 1–7 architecture and curriculum philosophy documented under `docs/`.
- Documentation tooling and Cursor rules in place (including local auto-commit).
- Beehive 1 SB units `01–08`, Big English 1 SB `01–09`, and Big English 2 SB `01–09` extracted and human-verified.
- Reach Higher 2A units `1–3` extracted and human-verified; Unit 4 still pending an extraction restriction.
- Registry updated for BH1, BE1-SB, BE2-SB (human verification COMPLETE) and RH2A (PARTIAL); all remain Phase 1 IN PROGRESS (no canonical merge / whole-book audit yet).

---

## 2. Current status

- **Focus:** Phase 1 — Curriculum Extraction & Dataset Development.
- **BH1 / BE1-SB / BE2-SB:** Unit batches human-verified; automated validation not run; canonical book JSON not created.
- **RH2A:** Units 1–3 human-verified; Unit 4 blocked pending extraction restriction; cross-series schema review still pending.
- **Known follow-ups:** BE2 Unit 2 batch was truncated at import (pages/vocabulary/language empty — needs re-extraction); BE1 internal IDs use `bep1_sb` while folder uses `big_english_1_sb`; open audio/visual issues and Think Big / SEL / Reach Higher inquiry schema gaps remain documented.

---

## 3. Next small step

**Suggested next move (depends on the next prompt):** Either re-extract **Big English 2 SB Unit 2** missing pages/vocabulary/language, or extract **Reach Higher 2A Unit 4** once the extraction restriction is lifted — then run the planned cross-series schema review across BH1 + BE1-SB + RH2A (and BE2-SB findings).

**Bird’s-eye still to do (not this step):** finish RH2A Unit 4; repair BE2-U02 missing sections; canonical merges + whole-book audits; schema review; continue remaining books; later phases.

---
