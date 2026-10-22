# BE3 Unit 8 Story Neutral-Package Canary Proposal

**Status:** IMPLEMENTED / AWAITING OWNER MANUAL CHECK  
**Version:** 0.2  
**Date:** 2026-10-23  
**Scope:** Limited Story-only production canary for `be3_sb_wb_rel_u08_story_sb130-131_wb106` (SB pp.130–131 → WB p.106 only). Not manually accepted until owner local check.

---

## 1. Exact scope

**Relationship:** `be3_sb_wb_rel_u08_story_sb130-131_wb106`  
**Package:** `be3-sb-wb-u08-p130-131-wb106`  
**Pages:** Big English 3 Unit 8 — Student Book pp.130–131 → Workbook **p.106 only** (asymmetric **2→1**)

**Critical boundary:** Workbook **p.107** must never appear, be inferred, or be reconstructed in package assembly, shadow rendering, canary compare, served handoff output, or diagnostics.

Prerequisites already in place before wiring:

| Prerequisite | Status |
|---|---|
| Accepted Story bespoke series builder | Exists |
| Neutral SB→WB package for this exact relationship | Implemented |
| Story shadow renderer five-artifact parity | Proved in tests |
| Shared Chalkie dispatcher route for this relationship ID | Implemented |
| WB p.106-only / no WB p.107 leakage | Proved in Story parity and selection-safety tests |

Related records:

- Opener limited canary acceptance: [`chalkie-neutral-package-production-migration-plan-v0.1.md`](./chalkie-neutral-package-production-migration-plan-v0.1.md) — `IMPLEMENTED / MANUALLY ACCEPTED — LIMITED OPENER CANARY` (unchanged)
- Adapter / parity context: [`chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md`](./chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md)

---

## 2. Flag (default OFF)

**Name:** `VITE_CHALKIE_BE3_U08_STORY_NEUTRAL_CANARY`  
**Default:** **OFF** (unset / `false` / `0`)  
**Enable locally:** set `true` in `app/.env.local`, then restart `npm run dev`  
**Owner-controlled:** no teacher-facing canary UI or wording

---

## 3. Runtime behaviour (implemented)

1. **Flag off:** always serve the existing bespoke Story builder only; do not run Story neutral assembly/rendering for production preview.
2. **Flag on for this exact relationship only:**
   - build the existing bespoke Story output;
   - build the neutral package from the same selected SB/WB evidence and prior-support inputs;
   - render via the shared dispatcher;
   - compare **all five** artifacts exactly:
     1. detailed two-lesson handoff;
     2. Lesson 1 concise outline;
     3. Lesson 1 vocabulary;
     4. Lesson 2 concise outline;
     5. Lesson 2 vocabulary;
   - on **exact parity** → serve the neutral-rendered artifacts;
   - on **any mismatch, unsupported case, package/renderer error** → continue serving bespoke output and emit a **minimal developer diagnostic** containing only the relationship ID and the artifact name(s) that failed or differed.
3. Opener canary remains independent and unchanged. Every other relationship remains bespoke.

Implementation: `app/src/features/chalkie/be3U08StoryNeutralCanary.ts` (wired from overlay + prompt preview).

---

## 4. Gates covered by focused tests

- all-selected exact five-artifact parity;
- SB exclusion safety;
- WB p.106 exclusion and partial-selection safety;
- zero-selection honesty;
- prior-support provenance and Lesson 1 / Lesson 2 targeting;
- explicit proof that WB p.107 never appears;
- canary-off regression (bespoke only; no neutral calls);
- mismatch/error → bespoke fallback + minimal diagnostic;
- Opener canary behavior remains unchanged / independent.

---

## 5. Rollback

- set `VITE_CHALKIE_BE3_U08_STORY_NEUTRAL_CANARY` to `false`, or remove it;
- then restart the local app so only the bespoke Story builder runs.

Mismatch fallback (serve bespoke + diagnostic) is an additional safety layer, not a substitute for flag-off rollback.

---

## 6. Non-claims

This implementation does **not**:

- authorize Chalkie generation;
- claim classroom validation;
- claim owner manual acceptance (awaiting local check);
- migrate any relationship other than the exact Story ID above;
- automatically expand to further Unit 8 companions;
- change Opener canary status, D018, canonical data, or locked decisions.

**Status:** `IMPLEMENTED / AWAITING OWNER MANUAL CHECK`

**Smallest next step:** owner enables the Story flag locally and manually checks all-selected, exclusions, zero-selection, and WB p.106-only behaviour; do not mark manually accepted until that check passes.
