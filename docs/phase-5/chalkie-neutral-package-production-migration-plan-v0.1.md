# Neutral Package → Shared Chalkie Dispatcher Production Migration Plan

**Status:** LIMITED OPENER + LIMITED STORY CANARIES MANUALLY ACCEPTED  
**Version:** 0.5  
**Date:** 2026-10-23  
**Scope:** Limited Opener canary (manually accepted) for `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105`. Limited Story canary (manually accepted) for `be3_sb_wb_rel_u08_story_sb130-131_wb106` (WB p.106 only). All other relationships remain bespoke.

---

## 1. Purpose and status

**Status:** Opener `IMPLEMENTED / MANUALLY ACCEPTED — LIMITED OPENER CANARY`; Story `IMPLEMENTED / MANUALLY ACCEPTED — LIMITED STORY CANARY`

**Goal:** replace duplicated platform-specific assembly safely, without changing teacher-facing output.

The durable path is:

1. assemble a neutral selected-evidence package;
2. render that package through a small Chalkie-specific dispatcher;
3. keep the live bespoke builders available as immediate rollback.

This plan preserves the accepted teacher experience: same title, detailed handoff, Lesson 1/2 outlines, Lesson 1/2 vocabulary, activity cards, selection flow, and copy actions. There is no teacher-facing canary indicator.

**Opener and Story each have a limited, independently accepted canary.** Story record: [`chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md`](./chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md) — `IMPLEMENTED / MANUALLY ACCEPTED — LIMITED STORY CANARY`. Neither record claims a Chalkie generation result or classroom validation.

---

## 2. Current proven boundary

| Layer | Status | Notes |
|---|---|---|
| Neutral package assembler | Implemented for Opener and Story only | Exact verified scopes, selected-only evidence, partial/zero states, boundaries, and targeted prior support |
| Shared Chalkie dispatcher | Implemented | `renderChalkieFromNeutralPackage` routes by exact relationship ID |
| Opener shadow renderer | Exact parity proved; used by canary when enabled | SB pp.128–129 → WB pp.104–105 (2→2) |
| Story shadow renderer | Exact parity proved; used by Story canary when enabled | SB pp.130–131 → WB p.106 only (2→1); WB p.107 forbidden |
| Production path (default) | Bespoke builders | Canary flags default OFF |
| Opener production canary | **IMPLEMENTED / MANUALLY ACCEPTED — LIMITED OPENER CANARY** | Owner-controlled via `VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY` |
| Story production canary | **IMPLEMENTED / MANUALLY ACCEPTED — LIMITED STORY CANARY** | Owner-controlled via `VITE_CHALKIE_BE3_U08_STORY_NEUTRAL_CANARY` |

Exact relationships:

- **Opener (limited canary accepted):** `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105` · package `be3-sb-wb-u08-p128-129-wb104-105` · **2→2** · SB pp.128–129 → WB pp.104–105
- **Story (limited canary accepted):** `be3_sb_wb_rel_u08_story_sb130-131_wb106` · package `be3-sb-wb-u08-p130-131-wb106` · **2→1** · SB pp.130–131 → WB p.106 only

See [`chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md`](./chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md).

---

## 3. Canary implementation

**First canary only:** Opener relationship `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105`.

### Feature flag

- Name: `VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY`
- Default: **OFF** (unset / `false` / `0`)
- Enable locally: set `VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY=true` in `app/.env.local` (preferred) or document via root `.env.example`, then restart `npm run dev` in `app/`
- **Rollback:** set the flag to `false` / unset it, then restart the local app
- No teacher-facing controls or UI wording
- Remains **owner-controlled** through the local environment flag

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

## 6. Manual review evidence (2026-10-22)

Local owner review with the canary flag enabled. Scope: **only** `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105` (SB pp.128–129 → WB pp.104–105).

Recorded evidence:

- Local canary flag was enabled: `VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY=true`
- All-selected workflow remained visually normal
- Selection persistence worked through Current Lesson → Prior Learning → Back
- SB p.129 Activity 4 and WB p.105 Activity 3 were deliberately unchecked
- The resulting preview excluded both activities from the relevant detailed evidence and concise outlines
- The selected activities remained present
- No excluded activity was reconstructed through vocabulary, language, audio, outlines, or fallback content
- The normal local handoff workflow remained usable

**Acceptance boundary:**

- This section accepts the **Opener canary only** (historical Opener review)
- Story manual acceptance is recorded separately in [`chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md`](./chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md)
- The Opener canary remains owner-controlled through the local environment flag
- Rollback remains: set the Opener flag to false / unset it, then restart the local app
- This record does **not** claim a Chalkie generation or classroom-validation result

---

## 7. Progression gates

1. ~~Canary Opener~~ — implemented (default off).
2. ~~Review local evidence with the flag enabled~~ — **manually accepted** (see §6).
3. ~~Story canary~~ — **IMPLEMENTED / MANUALLY ACCEPTED — LIMITED STORY CANARY** ([`chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md`](./chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md)).
4. Additional component renderers only after an explicit relationship-specific parity slice.
5. No bulk migration. Pause further canaries; choose the next project area deliberately.

---

## 8. Prior-learning protection

- `[PRIOR]`, `[HM]`, and `[TEACHER-ADDED · UNVERIFIED]` stay separate from current-page evidence.
- Neutral package retains provenance and explicit Lesson 1 / Lesson 2 targets.
- Excluded SB/WB activities cannot be restored through the canary path.

---

## 9. Non-goals (still)

- No automatic generic renderer for every relationship.
- No Chalkie generation change.
- No UI redesign or teacher-facing canary indicator.
- No claim of classroom validation.
- No automatic expansion beyond the two limited accepted canaries (Opener + Story).
- No changes to Book Intelligence meaning or canonical data.

---

## 10. Authorization record

Owner-authorized limited Opener canary (manually accepted) and limited Story canary (manually accepted):

1. Opener: `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105` — `IMPLEMENTED / MANUALLY ACCEPTED — LIMITED OPENER CANARY`
2. Story: `be3_sb_wb_rel_u08_story_sb130-131_wb106` (WB p.106 only; no WB p.107) — `IMPLEMENTED / MANUALLY ACCEPTED — LIMITED STORY CANARY`
3. Each flag defaults OFF with bespoke rollback (unset/false + restart) and mismatch fallback
4. No further relationships are canaried; no automatic expansion
5. No Chalkie generation or classroom-validation claim; no claim that no console diagnostic occurred

**Opener status:** `IMPLEMENTED / MANUALLY ACCEPTED — LIMITED OPENER CANARY`  
**Story status:** `IMPLEMENTED / MANUALLY ACCEPTED — LIMITED STORY CANARY`

**Smallest next step:** pause further canaries and choose the next project area deliberately.
