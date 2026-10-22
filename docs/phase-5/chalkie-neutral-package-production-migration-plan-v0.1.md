# Neutral Package → Shared Chalkie Dispatcher Production Migration Plan

**Status:** DRAFT / NOT AUTHORIZED FOR PRODUCTION WIRING  
**Version:** 0.1  
**Date:** 2026-10-22  
**Scope:** Cautious canary plan for moving the parity-proved Opener relationship from bespoke production builders onto the test-only neutral package → shared Chalkie dispatcher path

---

## 1. Purpose and status

**Status:** `DRAFT / NOT AUTHORIZED FOR PRODUCTION WIRING`

This document defines a cautious canary migration for the already-proved neutral lesson-package architecture. It does **not** authorize any production wiring, feature flag, routing change, UI change, or generation change.

**Goal:** replace duplicated platform-specific assembly safely, without changing teacher-facing output.

The durable path is:

1. assemble a neutral selected-evidence package;
2. render that package through a small Chalkie-specific dispatcher;
3. keep the live bespoke builders available as immediate rollback until parity is proven under production-like conditions.

This plan preserves the accepted teacher experience: same title, detailed handoff, Lesson 1/2 outlines, Lesson 1/2 vocabulary, activity cards, selection flow, and copy actions.

---

## 2. Current proven boundary

Already implemented and test-proved:

| Layer | Status | Notes |
|---|---|---|
| Neutral package assembler | Implemented for Opener and Story only | Exact verified scopes, selected-only evidence, partial/zero states, boundaries, and targeted prior support |
| Test-only shared dispatcher | Implemented | `renderChalkieFromNeutralPackage` routes by exact relationship ID |
| Opener shadow renderer | Exact parity proved in tests | SB pp.128–129 → WB pp.104–105 (2→2) |
| Story shadow renderer | Exact parity proved in tests | SB pp.130–131 → WB p.106 only (2→1); no WB p.107 leakage |
| Production path | Unchanged | Live UI still uses the accepted bespoke Opener and Story builders |

Exact tested relationships:

- **Opener:** relationship `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105` · package reference `be3-sb-wb-u08-p128-129-wb104-105` · shape **2 SB pages → 2 WB pages**
- **Story:** relationship `be3_sb_wb_rel_u08_story_sb130-131_wb106` · package reference `be3-sb-wb-u08-p130-131-wb106` · shape **2 SB pages → 1 WB page**

Unsupported relationships must not be guessed. The dispatcher already throws a typed unsupported error for any other relationship, including resolver-wired companions such as LiA.

See [`chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md`](./chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md).

---

## 3. Canary proposal

**Proposed first canary only:** the accepted Opener relationship  
`be3_sb_wb_rel_u08_opener_sb128-129_wb104-105`  
(SB pp.128–129 → WB pp.104–105).

Story remains on the bespoke production path until Opener is stable under the progression gates below.

### Routing concept

- Introduce an explicit isolated canary route or feature flag that can enable the neutral-package dispatcher for Opener only.
- Keep the live bespoke Opener builder as the default and as the immediate rollback path.
- Do not change teacher-facing surfaces:
  - title;
  - detailed prompt;
  - Lesson 1/2 outlines;
  - Lesson 1/2 vocabulary;
  - activity cards;
  - selection flow;
  - copy actions.

### Explicit non-authorization

This section proposes a design only. No flag, route, shadow comparison, or production call site may be added until the owner authorization named in §9 is recorded.

---

## 4. Required parity gates before enabling any canary

All gates must pass for Opener before any production canary is enabled. Exact equality against the current accepted bespoke output is the standard unless a narrowly justified formatting-only difference is separately accepted in writing.

1. **All-selected exact parity** for the five Chalkie artifacts:
   - detailed two-lesson handoff;
   - Lesson 1 concise outline;
   - Lesson 1 vocabulary;
   - Lesson 2 concise outline;
   - Lesson 2 vocabulary.
2. **SB exclusion propagation** — unchecked Student Book activities remain absent from the detailed handoff and Lesson 1 outline/vocabulary/language paths.
3. **WB exclusion propagation** — unchecked Workbook activities remain absent from the detailed handoff and Lesson 2 outline/vocabulary/language/audio paths.
4. **Partial-page vocabulary/language behaviour** — page-attributed vocabulary/language survive only when every eligible activity on that page remains selected.
5. **Zero-selection honest state** — zero SB or zero WB selection keeps the series structure valid and emits explicit empty states without reconstructing content or substituting the other book.
6. **Prior-support provenance and targeting** — `[PRIOR]`, `[HM]`, and `[TEACHER-ADDED · UNVERIFIED]` retain visible provenance and explicit Lesson 1 / Lesson 2 targets.
7. **Exact-scope protection** — no leakage outside SB 128–129 / WB 104–105 for the Opener canary; Story remains out of canary scope until separately authorized.
8. **No regression to the normal existing handoff path** — with the canary flag off, production output remains byte-identical to today’s bespoke builders.

---

## 5. Runtime safety / observability concept

If a canary is later authorized, comparison and diagnostics must stay developer-facing and narrow.

### Compare only produced artifacts

Compare the five rendered Chalkie artifacts only:

- detailed handoff;
- Lesson 1 outline;
- Lesson 1 vocabulary;
- Lesson 2 outline;
- Lesson 2 vocabulary.

Do **not** compare or store unnecessary teacher identity, learner data, session notes, or free-text teacher additions beyond what is already required to assemble the lesson package for the comparison itself.

### Safe mismatch response

If the canary dispatcher output differs from the bespoke baseline:

1. continue serving the bespoke-builder output to the teacher;
2. record a developer-visible diagnostic that names the relationship, which artifact mismatched, and that the canary was not surfaced;
3. do **not** hide the mismatch behind a silent fallback that pretends the canary succeeded;
4. do **not** show a teacher-facing error for a canary mismatch while the bespoke path remains healthy.

### Rollback in plain language

Rollback means turning the Opener canary flag/route off so the existing bespoke Opener builder is again the only production path. No data migration, no UI redesign, and no Story involvement are required for rollback.

---

## 6. Progression gates

No bulk migration. Progression is relationship-specific and owner-gated.

1. **Canary Opener only** after §4 gates and §9 authorization.
2. **Review evidence** from the Opener canary: exact matches, mismatch diagnostics, selection/zero-selection behaviour, and rollback drills.
3. **Story canary only after Opener is stable.** Story must preserve asymmetric SB pp.130–131 → WB p.106 only and prove no WB p.107 leakage again under the same gates.
4. **Additional component renderers only after an explicit relationship-specific parity slice.** Resolver-wired companions such as LiA, CLIL, Grammar, Culture, Writing, Phonics, or Review do not become eligible merely because a companion exists.
5. **No bulk migration** of every Unit 8 relationship, every book, or every platform renderer.

---

## 7. Prior-learning protection

Optional support remains separate from current-page evidence in every migration step:

- `[PRIOR]` — earlier pages in the same unit;
- `[HM]` — earlier units in the same book;
- `[TEACHER-ADDED · UNVERIFIED]` — teacher-authored support.

Safety rules that must survive canary and later progression:

- optional support only; never compulsory lesson content;
- retain provenance labels and explicit Lesson 1 / Lesson 2 targeting;
- never replace, recreate, or silently restore excluded SB/WB activities;
- never reconstruct activity wording, answers, vocabulary, language, or models from unit context;
- may appear only where they fit naturally and only for the targeted lesson(s).

---

## 8. Non-goals

This plan does **not**:

- authorize or implement automatic generic rendering for every relationship;
- change Chalkie generation, Topic/Refine/Theme workflow, or classroom export behaviour;
- redesign the Chalkie Workspace UI, activity cards, selection flow, or copy actions;
- claim classroom validation;
- change the meaning of the neutral source package or Book Intelligence;
- rewrite canonical data, verified SB→WB mappings, D018, or `docs/4-decisions.md`;
- migrate Story, LiA, or any other companion in the first canary.

---

## 9. Decision required

Before any code canary slice may begin, the owner must explicitly authorize a production canary implementation for the Opener relationship only, naming at least:

1. the exact relationship ID `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105`;
2. that the live bespoke Opener path remains the immediate rollback;
3. that teacher-facing output must remain unchanged;
4. that Story and all other relationships remain out of scope until separately authorized.

**This document does not authorize implementation.** It is a planning artifact only. No feature flag, production call site, UI route, or runtime comparison may be added until that owner authorization is recorded.

**Smallest next step after this plan:** owner review of the Opener-only canary proposal. If accepted, separately authorize a code canary slice that preserves the bespoke rollback path; if not accepted, leave production routing unchanged and choose another project question.
