# BE3 Unit 8 Language in Action Neutral Package / Renderer Parity Brief v0.1

**Status:** LiA-B COMPLETE — OWNER-ACCEPTED / NON-SERVING
**Version:** 0.1
**Date:** 2026-10-29
**Authority:** Owner-approved LiA-B boundary, implementation and final correction review after acceptance of LiA-A
**Implementation authorization:** LiA-B is complete and owner-accepted. The exact neutral package and five-artifact renderer remain non-serving; current LiA serving remains `sb_only`. LiA-C, NLL attachment, feature flags, deployment and promotion remain unauthorized.

---

## 1. Decision sought

Approve or revise the smallest LiA-B scope that can establish neutral-package and renderer parity before any integration is considered.

LiA-B should prove that the exact verified Language in Action source can be represented and rendered honestly as a two-lesson Student Book → Workbook package. It should not change what users receive. LiA-C remains a separate future decision.

**Guiding principle:** Beauty in simplicity — establish parity first, then consider integration.

### Completion record

The approved proof is complete. The exact package, five-artifact all-selected contract, partial/zero behavior, media-honesty rules, lesson-target provenance and fail-closed identity checks passed final review. Verification passed **27/27** focused tests, **90/90** retained regressions and app typecheck. No serving path, feature flag, NLL/BI attachment, deployment, promotion or LiA-C work was added. The proposal language below is retained as the accepted design record.

---

## 2. Protected accepted baseline

LiA-A Steps A–B are owner-accepted but remain uncommitted. They are the review baseline, not disposable working changes.

At the start of this brief, `main` remains at `11215f83854a2d48166f9bbd63834fbc206e40d9`, equal to `origin/main`. The following paths must be preserved exactly unless the owner separately authorizes changes to them.

### Modified documentation

- `docs/0-index.md`
- `docs/3-architecture.md`
- `docs/5-progress.md`
- `docs/6-todo.md`
- `docs/project-tracking/0-project-steps.md`
- `docs/project-tracking/1-project-status.md`
- `docs/project-tracking/nll-migration-roadmap-v0.1.md`

### Untracked accepted LiA-A files

- `docs/project-tracking/be3-u08-lia-knowledge-review-v0.1.md`
- `docs/project-tracking/be3-u08-lia-transfer-planning-brief-v0.1.md`
- `scripts/tests/nllBe3U08LiaSeedStepB.test.ts`
- `supabase/migrations/20261029213000_seed_nll_be3_u08_lia.sql`

### Working-tree safety rules

1. Record the branch, HEAD and full status before and after every Cursor task.
2. Do not reset, restore, checkout, clean, stash, rename, overwrite, stage or commit any protected path.
3. Do not fold accepted LiA-A work into a LiA-B commit. A commit would require separate owner authorization and an explicit path list.
4. Treat any unexpected application, canonical, migration or seed change as a stop condition.
5. For the present inspection, Cursor may read files and run existing non-mutating checks only. It must not edit the repository.

This new brief is the only path added by the present ChatGPT Desktop planning task.

---

## 3. Exact LiA-B candidate boundary

| Field | Boundary |
|---|---|
| Component | Big English 3, Unit 8, Language in Action only |
| Relationship | `be3_sb_wb_rel_u08_lia_sb132-133_wb107-108` |
| Stable reference | `be3-sb-wb-u08-p132-133-wb107-108` |
| Lesson 1 | SB pp.132–133; page IDs `bep3_sb_p132`, `bep3_sb_p133`; Activities 8–12 |
| Lesson 2 | WB pp.107–108; page IDs `bep_3_wb_p107`, `bep_3_wb_p108`; Activities 7–10 |
| Verified activity total | Nine, in canonical SB-then-WB order |
| Intended proof mode | Shadow-only, default-off and non-serving |
| Current serving behavior | Preserve existing `sb_only` behavior |
| Adjacent exclusions | Story: SB pp.130–131 / WB p.106; CLIL/P.E.: SB pp.134–135 / WB pp.109–110 |

No other relationship, component, book, unit, enrichment type or renderer is in scope.

---

## 4. Current behavior and the gap to prove

Read-only inspection establishes the following baseline:

| Area | Current state | LiA-B gap |
|---|---|---|
| Companion resolver | Exact LiA SB/WB relationship is human-verified and resolver-wired | None at relationship level |
| Chalkie context | Only accepted Opener and Story relationships receive `sb_wb`; LiA remains `sb_only` | Do not change this during parity work |
| Neutral package | Supports exact Opener and Story configurations only; other relationships fail closed | Add an exact LiA configuration only after implementation authorization |
| Shared neutral renderer | Dispatches accepted Opener and Story relationships only; unsupported relationships fail closed | Add an exact LiA dispatch only after its renderer contract is approved |
| LiA two-lesson reference | No accepted bespoke SB→WB LiA handoff exists | Define an owner-reviewable artifact contract without claiming nonexistent byte parity |
| NLL | LiA knowledge is live as draft, hidden and experimental | LiA-B must not load or use it |
| Book Intelligence | Opener-only in the neutral package | Keep LiA-B BI-absent |
| Integration | No LiA package/renderer adapter or canary is serving | Preserve this boundary |

The accepted Opener and Story implementations prove the neutral architecture. They are reference patterns, not permission to copy their integration layers into LiA-B.

---

## 5. Parity authority

Opener and Story can compare neutral output byte-for-byte with an accepted bespoke SB→WB handoff. LiA cannot yet make that claim because its current path is single-lesson `sb_only` and no accepted LiA SB→WB artifact set exists.

LiA-B should therefore use two explicit authorities:

1. **Source-contract parity** — the neutral package must preserve the exact relationship, pages, nine activities, order, selections, provenance and exclusions from verified canonical evidence.
2. **Reviewed artifact-contract parity** — the five renderer artifacts must match a small, source-controlled LiA expectation approved through manual owner review before any shadow comparison is called passing.

The existing `sb_only` LiA output is useful regression evidence for naming and current behavior, but it is not the parity oracle for a new two-lesson SB→WB package.

No result should be described as production parity, serving parity or adapter parity during LiA-B.

---

## 6. Proposed future LiA-B implementation scope

The items below are a proposal for a later, separately authorized Cursor implementation task.

### 6.1 Exact neutral package support

- Add one exact supported configuration for the LiA relationship and stable reference.
- Require the stated SB/WB source IDs, relationship type, page IDs and printed pages.
- Preserve canonical activity order: SB Activities 8–12, then WB Activities 7–10.
- Normalize all-selected, partial and zero-selected states without reconstructing excluded content.
- Preserve teacher-selected prior learning and teacher-added language as separate support with explicit provenance.
- Keep NLL-derived knowledge and Book Intelligence absent.
- Reject malformed, adjacent and unsupported scopes.

### 6.2 Dedicated LiA neutral renderer

- Render the existing five-artifact contract only:
  - detailed handoff;
  - Lesson 1 outline;
  - Lesson 1 vocabulary/models;
  - Lesson 2 outline;
  - Lesson 2 vocabulary/models.
- Label Student Book, Workbook, prior and teacher-added evidence distinctly.
- Keep partial and zero-selection states explicit and usable.
- Do not infer answers, transcript wording, sticker placements or unseen visual details.
- Fail closed when the package identity or scope is not the exact LiA contract.

### 6.3 Shadow proof, not integration

- If a shadow comparator is added, it must be default-off and unable to alter the served handoff.
- Compare the neutral output with the approved LiA artifact expectations, not with a fabricated bespoke baseline.
- Report mismatches diagnostically and retain the existing `sb_only` output.
- Do not add LiA routing to the active Chalkie package mode.

The simplest acceptable result is a deterministic package, a deterministic renderer, focused tests and a non-serving proof. A production canary is not required for LiA-B.

---

## 7. Source-honesty requirements

### SB p.132 Activity 8

- Audio 155 wording is not present in the activity record.
- The renderer may identify the listening task, visible `Did …?` models and supplied phrase bank.
- It must not invent transcript wording or implied answers.

### WB p.107 Activity 7

- The activity depends on Audio 156, illustrations and physical stickers.
- The renderer may state the teacher-visible task and dependency.
- It must not invent audio order, sticker placements or completed answers.

### WB pp.108 Activities 9–10

- Both activities depend on the same illustrations; Activity 10 answers derive from those illustrations.
- Selecting Activity 10 does not authorize reconstruction of an excluded Activity 9.
- The renderer should state the visual dependency when needed without supplying unverified answers.

These cautions are acceptance requirements, not optional copy guidance.

---

## 8. Required parity checks

### Identity and isolation

- Exact LiA relationship, stable reference, page IDs, printed pages and activity IDs.
- Story, Opener and CLIL/P.E. relationships remain unsupported by the LiA-specific renderer.
- No facing-page or adjacent-component leakage.
- Accepted Opener and Story tests remain unchanged and passing.

### Selection behavior

- All nine activities selected in canonical order.
- Representative SB exclusion: Activity 8 absent everywhere when excluded.
- Representative WB exclusion: Activity 7 absent everywhere when excluded.
- Independent partial selection on each page.
- Zero SB, zero WB and zero-both states remain honest; prior support cannot replace current evidence.
- WB Activity 10 alone may acknowledge its visual dependency but may not recreate Activity 9.

### Artifact behavior

- Exactly five artifact strings are returned.
- Lesson 1 is SB pp.132–133 only; Lesson 2 is WB pp.107–108 only.
- Activity selections are reflected consistently in handoff, outlines and vocabulary/models.
- Audio, stickers and illustrations remain dependency notes rather than invented content.
- Prior and teacher-added inputs retain provenance and lesson targets.
- Empty vocabulary/model states use explicit, stable wording.

### Guard behavior

- Unsupported or malformed package identity fails closed.
- A shadow mismatch cannot replace current output.
- The proof is default-off and has no UI, configuration or serving effect unless separately authorized.
- No NLL read, adapter attachment, BI overlay, migration, seed or persistent write occurs.

---

## 9. Acceptance criteria for a later implementation review

LiA-B would be ready for owner acceptance only when all of the following evidence is supplied:

1. Before/after Git status proves the accepted LiA-A baseline was preserved.
2. The implementation diff is limited to the separately authorized LiA-B path list.
3. Focused package tests pass for identity, order, all/partial/zero selection and fail-closed scope.
4. Focused renderer tests pass for all five artifacts and source-honesty rules.
5. Opener and Story neutral-package, renderer and isolation suites pass unchanged.
6. Current LiA `sb_only` serving behavior is demonstrated unchanged.
7. Manual review confirms the all-selected five-artifact expectation is teacher-friendly and source-honest.
8. No LiA-C, NLL, BI, deployment, promotion, commit or push work appears in the diff.

Passing tests alone do not approve the teacher-facing artifact wording. That wording requires owner review because it becomes the LiA parity authority.

---

## 10. Explicit LiA-C exclusion

LiA-C remains a separate future adapter/integration milestone. LiA-B must not:

- load or attach `be3-u08-lia` NLL records;
- add NLL stale-hash or provenance handling to the LiA renderer;
- route LiA through an active package/adapter flag;
- change `resolveChalkieLessonContext` from `sb_only` to `sb_wb` for LiA;
- replace the current Chalkie handoff;
- add UI controls or production diagnostics;
- promote hidden/experimental summaries;
- deploy or retire any existing POC/canary.

An accepted LiA-B proves that a neutral package can render correctly. It does not authorize the application to use that result.

---

## 11. Cursor read-only inspection prompt

Use the following as the bounded Cursor task. It authorizes inspection and reporting only.

> Inspect the proposed BE3 Unit 8 Language in Action LiA-B neutral-package/renderer parity scope. Do not modify any file.
>
> First record branch, HEAD and full Git status. Confirm that `main` is still at `11215f83854a2d48166f9bbd63834fbc206e40d9` and explicitly list the eleven accepted but uncommitted LiA-A paths protected in Section 2 of `docs/project-tracking/be3-u08-lia-neutral-package-renderer-parity-brief-v0.1.md`. Do not reset, restore, clean, stash, stage, commit or overwrite them.
>
> Inspect the verified LiA SB/WB evidence and companion relationship; the Opener and Story neutral package configurations; the shared neutral renderer dispatcher; the dedicated Opener and Story shadow renderers; current LiA `sb_only` prompt behavior; and the focused package/canary/isolation tests. Existing tests may be run if they are non-mutating. Do not add or update tests.
>
> Return a concise report containing:
>
> 1. the exact current LiA behavior from resolver through prompt output;
> 2. the exact future files and symbols that would need LiA-B changes, with the smallest proposed diff;
> 3. confirmation that no accepted two-lesson LiA baseline currently exists;
> 4. a proposed five-artifact expectation for owner review, grounded only in the nine verified activities;
> 5. the all/partial/zero, media-honesty, isolation and fail-closed test matrix;
> 6. any conflict with this brief, especially any change that would drift into LiA-C;
> 7. final branch, HEAD and full Git status.
>
> Stop after the report. No implementation, NLL write, migration, seed, app/config/test edit, commit, push, deployment or promotion is authorized.

---

## 12. Owner review gate

Before any LiA-B implementation, the owner should approve:

- the exact package boundary;
- source-contract plus reviewed-artifact parity as the authority;
- the five-artifact output contract;
- shadow-only, non-serving proof;
- the acceptance matrix; and
- continued separation from LiA-C.

After approval, ChatGPT Desktop should prepare a separate, bounded Cursor implementation prompt. Cursor should implement and verify only that approved scope. ChatGPT Desktop should then review Cursor's report and identify gaps before the owner decides the next milestone.

**Accepted result:** focused LiA-B verification **27/27**, retained Opener/Story/resolver/`sb_only` regressions **90/90**, and app typecheck passed. Media honesty, explicit lesson-target provenance and complete fail-closed identity checks were reviewed and accepted. Stop before LiA-C.
