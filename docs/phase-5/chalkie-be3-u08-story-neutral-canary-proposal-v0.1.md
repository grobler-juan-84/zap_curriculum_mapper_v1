# BE3 Unit 8 Story Neutral-Package Canary Proposal

**Status:** IMPLEMENTED / MANUALLY ACCEPTED — LIMITED STORY CANARY  
**Version:** 0.3  
**Date:** 2026-10-23  
**Scope:** Limited Story-only production canary for `be3_sb_wb_rel_u08_story_sb130-131_wb106` (SB pp.130–131 → WB p.106 only)

---

## 1. Exact scope

**Relationship:** `be3_sb_wb_rel_u08_story_sb130-131_wb106`  
**Package:** `be3-sb-wb-u08-p130-131-wb106`  
**Pages:** Big English 3 Unit 8 — Student Book pp.130–131 → Workbook **p.106 only** (asymmetric **2→1**)

**Critical boundary:** Workbook **p.107** remains excluded — no WB p.107 content, inference, or placeholder leakage in package assembly, shadow rendering, canary compare, served handoff output, or diagnostics.

Related records:

- Opener limited canary acceptance: [`chalkie-neutral-package-production-migration-plan-v0.1.md`](./chalkie-neutral-package-production-migration-plan-v0.1.md) — `IMPLEMENTED / MANUALLY ACCEPTED — LIMITED OPENER CANARY` (independent; unchanged)
- Adapter / parity context: [`chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md`](./chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md)

---

## 2. Flag (default OFF)

**Name:** `VITE_CHALKIE_BE3_U08_STORY_NEUTRAL_CANARY`  
**Default:** **OFF** (unset / `false` / `0`) — remains owner-controlled locally  
**Enable locally:** set `true` in `app/.env.local`, then restart `npm run dev`  
**Rollback:** set to `false` or remove it, then restart the local app  
**Owner-controlled:** no teacher-facing canary UI or wording

---

## 3. Runtime behaviour (implemented)

1. **Flag off:** always serve the existing bespoke Story builder only; do not run Story neutral assembly/rendering for production preview.
2. **Flag on for this exact relationship only:**
   - build the existing bespoke Story output;
   - build the neutral package from the same selected SB/WB evidence and prior-support inputs;
   - render via the shared dispatcher;
   - compare **all five** artifacts exactly;
   - on **exact parity** → serve the neutral-rendered artifacts;
   - on **any mismatch, unsupported case, package/renderer error** → continue serving bespoke output and emit a **minimal developer diagnostic** containing only the relationship ID and the artifact name(s) that failed or differed.
3. Opener canary remains independent and unchanged. Every other relationship remains bespoke.

Implementation: `app/src/features/chalkie/be3U08StoryNeutralCanary.ts` (wired from overlay + prompt preview).

---

## 4. Manual review evidence (2026-10-23)

Local owner review with the Story canary flag enabled. Scope: **only** `be3_sb_wb_rel_u08_story_sb130-131_wb106` (SB pp.130–131 → WB p.106 only).

Recorded evidence:

- All-selected Story output rendered normally
- Excluding SB Activity 6 removed it from the detailed handoff and Lesson 1 outline; remaining selected SB Activity 7 stayed
- Excluding WB Activity 5 removed it from the detailed handoff and Lesson 2 outline; remaining selected WB activities stayed
- Zero SB and WB selections produced explicit honest empty states, with no reconstructed or substituted content
- The existing Opener canary remains independent and unchanged
- WB p.107 remains excluded; no WB p.107 content, inference, or placeholder leakage

**Acceptance boundary:**

- This accepts the **Story canary only** (`IMPLEMENTED / MANUALLY ACCEPTED — LIMITED STORY CANARY`)
- Flag remains owner-controlled and defaults OFF
- Rollback remains: set the flag to `false` / unset it, then restart the local app
- This record does **not** claim a Chalkie generation result, classroom validation, or that no console diagnostic occurred

---

## 5. Rollback

- set `VITE_CHALKIE_BE3_U08_STORY_NEUTRAL_CANARY` to `false`, or remove it;
- then restart the local app so only the bespoke Story builder runs.

Mismatch fallback (serve bespoke + diagnostic) is an additional safety layer, not a substitute for flag-off rollback.

---

## 6. Non-claims

This acceptance does **not**:

- authorize Chalkie generation;
- claim classroom validation;
- claim that no console diagnostic occurred;
- migrate any relationship other than the exact Story ID above;
- automatically expand to further Unit 8 companions or additional canaries;
- change Opener canary status, D018, canonical data, or locked decisions.

**Status:** `IMPLEMENTED / MANUALLY ACCEPTED — LIMITED STORY CANARY`

**Smallest next step:** pause further canaries and choose the next project area deliberately.
