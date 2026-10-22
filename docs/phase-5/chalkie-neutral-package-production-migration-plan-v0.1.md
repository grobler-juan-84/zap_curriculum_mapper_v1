# Neutral Package → Shared Chalkie Dispatcher Production Migration Plan

**Status:** ACTIVE — Opener-only guarded canary implemented; default off; bespoke fallback on mismatch; Story and all other relationships remain bespoke  
**Version:** 0.2  
**Date:** 2026-10-22  
**Scope:** Cautious Opener-only canary for moving the parity-proved Opener relationship onto the neutral package → shared Chalkie dispatcher path when explicitly enabled

---

## 1. Purpose and status

**Status:** Opener-only guarded canary implemented; default off; bespoke fallback on mismatch; Story and all other relationships remain bespoke.

**Goal:** replace duplicated platform-specific assembly safely, without changing teacher-facing output.

The durable path is:

1. assemble a neutral selected-evidence package;
2. render that package through a small Chalkie-specific dispatcher;
3. keep the live bespoke builders available as immediate rollback.

This plan preserves the accepted teacher experience: same title, detailed handoff, Lesson 1/2 outlines, Lesson 1/2 vocabulary, activity cards, selection flow, and copy actions. There is no teacher-facing canary indicator.

---

## 2. Current proven boundary

| Layer | Status | Notes |
|---|---|---|
| Neutral package assembler | Implemented for Opener and Story only | Exact verified scopes, selected-only evidence, partial/zero states, boundaries, and targeted prior support |
| Shared Chalkie dispatcher | Implemented | `renderChalkieFromNeutralPackage` routes by exact relationship ID |
| Opener shadow renderer | Exact parity proved; used by canary when enabled | SB pp.128–129 → WB pp.104–105 (2→2) |
| Story shadow renderer | Exact parity proved in tests only | SB pp.130–131 → WB p.106 only (2→1); no production canary |
| Production path (default) | Bespoke builders | Canary flag defaults OFF |
| Opener production canary | Implemented; opt-in | `VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY` |

Exact relationships:

- **Opener (canary-eligible):** `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105` · package `be3-sb-wb-u08-p128-129-wb104-105` · **2→2**
- **Story (bespoke only):** `be3_sb_wb_rel_u08_story_sb130-131_wb106` · package `be3-sb-wb-u08-p130-131-wb106` · **2→1**

See [`chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md`](./chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md).

---

## 3. Canary implementation

**First canary only:** Opener relationship `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105`.

### Feature flag

- Name: `VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY`
- Default: **OFF** (unset / `false` / `0`)
- Enable locally: set `VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY=true` in `app/.env.local` (preferred) or document via root `.env.example`, then restart `npm run dev` in `app/`
- Disable: remove the variable or set it to `false` / `0`, then restart
- No teacher-facing controls or UI wording

### Runtime behaviour

When the flag is **off**: always serve bespoke Opener output; do not run neutral assembly/rendering.

When the flag is **on** for Opener:

1. build the existing bespoke Opener output;
2. build the neutral package from the same selected SB/WB evidence and prior-support inputs;
3. render via the shared dispatcher;
4. compare the five artifacts exactly;
5. on exact parity → serve the neutral-rendered artifacts;
6. on mismatch / unsupported / renderer or package error → serve bespoke and emit a developer-visible diagnostic.

Story and every other relationship continue to call their bespoke builders only.

---

## 4. Required parity gates (enforced by canary)

Compared artifacts:

1. detailed two-lesson handoff;
2. Lesson 1 concise outline;
3. Lesson 1 vocabulary;
4. Lesson 2 concise outline;
5. Lesson 2 vocabulary.

Gates covered by focused tests:

- all-selected exact parity;
- SB / WB exclusion propagation;
- partial-page vocabulary/language behaviour;
- zero-selection honest states;
- prior-support provenance plus explicit Lesson 1 / Lesson 2 targeting on the neutral package;
- exact SB/WB scope (no leakage);
- flag-off path unchanged (bespoke only).

---

## 5. Runtime safety / observability

- Compare only the five produced artifacts — not teacher identity or learner data.
- Safe mismatch response: continue with bespoke output; `console.warn` a concise diagnostic naming the relationship ID and which artifact(s) failed or differed.
- No silent fallback that pretends the canary succeeded.
- Do not log full prompts, teacher-added content, or source activity text.
- **Rollback:** unset / disable `VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY` and restart the app so only the bespoke Opener builder runs.

---

## 6. Progression gates

1. ~~Canary Opener~~ — implemented (default off).
2. Review local evidence with the flag enabled (parity, mismatch diagnostics, selection/zero-selection, rollback).
3. Story canary only after Opener is stable under real use — **not authorized**.
4. Additional component renderers only after an explicit relationship-specific parity slice.
5. No bulk migration.

---

## 7. Prior-learning protection

- `[PRIOR]`, `[HM]`, and `[TEACHER-ADDED · UNVERIFIED]` stay separate from current-page evidence.
- Neutral package retains provenance and explicit Lesson 1 / Lesson 2 targets.
- Excluded SB/WB activities cannot be restored through the canary path.

---

## 8. Non-goals (still)

- No automatic generic renderer for every relationship.
- No Chalkie generation change.
- No UI redesign or teacher-facing canary indicator.
- No claim of classroom validation.
- No Story or other Unit 8 relationship canary.
- No changes to Book Intelligence meaning or canonical data.

---

## 9. Authorization record

Owner-authorized Opener-only code canary (this implementation slice):

1. relationship `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105`;
2. live bespoke Opener path remains immediate rollback (flag default off + mismatch fallback);
3. teacher-facing output unchanged when flag off, and unchanged in content when flag on and parity holds;
4. Story and all other relationships remain bespoke until separately authorized.

**Smallest next step:** locally enable the Opener canary flag, exercise all-selected / exclusion / zero-selection / prior-support paths, confirm diagnostics on a forced mismatch if desired, then either keep the flag off in normal use or separately authorize a Story canary design — do not bulk-migrate.
