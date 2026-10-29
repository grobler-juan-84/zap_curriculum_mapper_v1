# Stage 5 Implementation Brief v0.1

**Status:** ACTIVE / IMPLEMENTED / MANUALLY ACCEPTED — LIMITED OPENER PILOT
**Version:** 0.1
**Date:** 2026-10-29
**Authority:** D022, D027 and the NLL Migration Roadmap
**Implementation authorization:** **Authorized 2026-10-29 for one bounded local slice; owner accepted A–F on 2026-10-29 and authorized commit/push of the verified Stage 5 paths only**

## Purpose

Define the smallest safe Stage 5 slice for Big English 3 Unit 8 Opener: take one lesson-specific Neutral Lesson Package (NLP) through the existing neutral Chalkie adapter while preserving teacher selections, D022 boundaries and every current fallback.

The owner approved this brief and separately authorized the bounded local implementation on 2026-10-29. On 2026-10-29 the owner formally accepted the bounded implementation and authenticated manual acceptance cases A–F, and authorized commit/push of the verified Stage 5 paths only. The feature remains default-off and undeployed. It does not authorize NLL promotion, POC/canary retirement, Story routing or Stage 6 work.

## Scope

- **Only relationship:** `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105`.
- **Only source scope:** Student Book pp. 128–129 and Workbook pp. 104–105.
- **Target:** NLP → `renderChalkieFromNeutralPackage`.
- **Rollout flag:** `VITE_NLL_CHALKIE_ADAPTER_PILOT`, default `false`.
- **Existing route remains default:** current bespoke handoff with existing Opener/Story canary behavior.
- **Story is out of scope:** no Stage 5 routing for `be3_sb_wb_rel_u08_story_sb130-131_wb106`.

## What existed before this slice

1. `buildNeutralSbWbLessonPackage` already supports the exact verified Opener relationship, rejects scope drift, projects selected SB/WB evidence, records selection state and sets `reconstructExcludedActivities: false`.
2. `renderChalkieFromNeutralPackage` already dispatches exact Opener and Story package identities to parity-proved neutral renderers and throws `UnsupportedNeutralPackageRendererError` for unsupported relationships.
3. `buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary` is already used by the Create-a-prompt path. Its default-off flag keeps the bespoke builder primary. When enabled, it builds both paths and serves neutral output only on exact parity across five artifacts; package, renderer and parity failures serve bespoke output.
4. Existing Opener canary tests cover all-selected, SB exclusion, WB exclusion, partial selection, zero selection, prior-support provenance, typed failures and fallback behavior.
5. Stage 4 already loads `be3-u08-opener`, builds the base NLP and attaches summaries for selected activities as package-level `derivedKnowledge`. It is General Lesson Plan–specific, asynchronous and deliberately omits experimental BI.
6. The Create-a-prompt Chalkie preparation handler is currently synchronous. It builds the detailed prompt through `buildChalkiePromptPreview` and separately builds the BE3 series handoff for the outline/vocabulary artifacts.
7. D022 BI support already exists as optional, labelled `curriculumInterpretation`; the current Opener path keeps BI separate from page evidence and applies optional Chalkie BI framing through its own flag.

## What the bounded Stage 5 slice adds

Behind the new default-off flag, the Create-a-prompt Chalkie action now:

1. confirm the exact Opener relationship, source pages and nine eligible activities;
2. snapshot the current SB/WB selections, prior-support choices, teacher additions and D022 BI inputs;
3. load `be3-u08-opener` with hidden experimental summaries allowed only inside this pilot;
4. build one neutral package from the captured selections;
5. attach only the NLL summaries matching selected canonical activity IDs;
6. pass that NLP to `renderChalkieFromNeutralPackage`;
7. use the one returned five-artifact result for both the detailed prompt and the Chalkie packaging preview.

If the flag is off, scope is ineligible, NLL is unavailable, package assembly fails, rendering fails or a result becomes stale, the flow must call the existing path unchanged. That fallback includes the current bespoke handoff and any separately enabled existing canary. Stage 5 must not delete, bypass or silently change those controls.

### Simple content boundary

The existing neutral Chalkie renderer does not read `derivedKnowledge`; it renders selected publisher evidence and prior support. The recommended Stage 5 v0.1 boundary is therefore **routing consolidation with no new NLL prose in Chalkie output**. `derivedKnowledge` remains attached to the NLP for traceability, but using summary text in Chalkie requires a separate owner decision and acceptance criteria.

## Implemented seam

- `nllChalkieAdapterPilot.ts` owns the flag, exact-scope guard, request identity, lazy NLL load, package assembly, render call and typed fallback result;
- reuse `loadNeutralLessonComponent`, `buildNeutralSbWbLessonPackage`, `attachSelectedNllDerivedKnowledge` and `renderChalkieFromNeutralPackage`;
- `TeacherChoiceFlowOverlay` handles the asynchronous result, rejects stale results, reuses one five-artifact result on success and calls the pre-existing path on any bounded failure;
- `VITE_NLL_CHALKIE_ADAPTER_PILOT=false` is documented in `.env.example` and typed in `app/src/vite-env.d.ts`;
- the existing bespoke builders, canaries, POC, database, Storage and canonical data remain unchanged. Only the shared renderer's module comment was updated to acknowledge the new default-off caller.

Stage 5 does not call `assembleNllGeneralLessonPlanPilot`: that entry point remains tied to the Stage 4 General Lesson Plan flag, result guards and BI-exclusion boundary. Stage 5 reuses only the selected-summary attach helper.

## Selection integrity

- The package must contain only the activity IDs selected at the moment Chalkie preparation begins.
- Unchecked SB or WB activities must be absent from selected evidence, vocabulary, language models, outlines, detailed handoff and attached NLL summaries.
- Zero selection remains a valid explicit state; no page-level, canonical or NLL fallback may recreate activities.
- A late NLL result must not apply after close, back, scope change, selection change, output change or a newer preparation request.
- NLL summaries never become publisher evidence and never override canonical activity wording.

## D022 BI boundary

- BI remains optional, provenance-labelled planning context.
- BI must not set page scope, select activities, populate source vocabulary/language, or become `[SB]`, `[WB]` or `[SS]` evidence.
- Existing flag-off and fallback behavior must remain byte-for-byte compatible where practical.
- The existing optional Chalkie BI-framing flag remains independent.
- Stage 5 must not copy Stage 4's BI omission into shared NLP behavior or expand BI beyond the existing D022 contract.

## Acceptance matrix

| Case | Required result |
|---|---|
| Flag off | No Stage 5 NLL load; current Create-a-prompt output and current canary behavior remain unchanged. |
| Ineligible scope / Story | No Stage 5 NLL load or routing; current path remains unchanged. |
| Opener, all selected | One NLL load; NLP contains five SB + four WB selected activities and nine matching summaries; neutral renderer returns all five Chalkie artifacts; Create-a-prompt completes. |
| SB key exclusion | Excluding SB p.129 Activity 4 keeps it out of the NLP, NLL summary set, detailed handoff, Lesson 1 outline and vocabulary/language derived from that activity. |
| WB key exclusion | Excluding WB p.105 Activity 3 keeps it out of the NLP, NLL summary set, detailed handoff, Lesson 2 outline and vocabulary/language derived from that activity. |
| Zero/partial selection | Honest selection state; no unchecked activity is reconstructed from page context, canonical data or NLL summaries. |
| NLL missing/error | Current path completes successfully; no blank preview and no partial Stage 5 result. Existing canary/bespoke fallback remains available. |
| Package/render error | Current path completes successfully; bounded developer diagnostic contains no prompt or teacher/learner content. |
| Selection changes during load | Stale result is discarded; a newer request or current selection wins. |
| BI absent/present | Both assemble and render; D022 boundaries hold; source evidence and selection-derived fields are unchanged by BI. |
| End-to-end workflow | Teacher completes SB review → WB review → prior skills → neutral review → choose Chalkie → choose package shape → prepare prompt → view/copy the five expected artifacts. |

## Verification record

- Stage 5 focused suite: 9/9 passed.
- Surrounding neutral-package, Opener/Story canary, Stage 4, D022 BI, renderer and five-step teacher-flow regressions: 60/60 passed.
- App typecheck: passed.
- App lint: passed with pre-existing repository warnings and no errors.
- Diff check: passed.
- **Authenticated manual acceptance (2026-10-29):** cases **A–F PASS** on controlled Vite `5174` with process-only `VITE_NLL_CHALKIE_ADAPTER_PILOT=true` (Case F restarted flag-off). Evidence: Opener Stage 5 path; NLL `200` on `nll_components`, `nll_component_activities`, `nll_ss_component_links`, `nll_activity_summaries` (`component_key=be3-u08-opener`); all-selected + teacher-added + five/six copy artifacts with no NLL/summary/BI prose in Chalkie textboxes; partial exclude SB Act4 + WB Act3; zero selection; Story p.130 and Unit 1 non-Opener isolation (no Stage 5 NLL load); flag-off Opener path with no `nll_*` requests. `.env.local` unchanged. No deploy / DB / Storage / canonical / NLL promotion.

## Restrictions

- No deployment.
- No Stage 6 coverage expansion.
- No Story routing.
- No NLL visibility or review-state promotion.
- No POC, bespoke builder or canary retirement.
- No NLP persistence.
- No canonical, Supabase migration, seed, Storage or RLS changes.
- No new Chalkie prose sourced from experimental NLL summaries without a separate owner decision.

## Remaining risks and open questions

1. **Live UI acceptance:** completed and owner-accepted (A–F PASS, 2026-10-29).
2. **NLL content use:** resolved for v0.1 as package-only. Any visible NLL summary prose in Chalkie remains a separate content decision.
3. **Fallback precedence:** implemented as Stage 5 attempt → current existing path (including any separately enabled canary) → bespoke fallback.
4. **Shared prior-support mapping:** Stage 5 keeps a small local mapper to avoid unrelated refactoring. Consolidation can wait for a separately approved cleanup.
5. **Hidden experimental summaries:** the gated pilot exception continues. Rows remain `hidden`/`experimental`; this is not promotion. Flag-off Opener Create-a-prompt may still show D023 local POC experimental cards; that path is independent of Stage 5 NLL loads.

## Recommended owner decision

Bounded Stage 5 Opener pilot is owner-accepted (A–F). Commit/push of the verified Stage 5 paths is separately authorized. Do not deploy, expand Stage 5 scope, promote NLL records, retire the POC/canaries or begin Stage 6.
