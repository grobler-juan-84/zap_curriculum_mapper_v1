# Stage 5 Implementation Brief v0.1

**Status:** ACTIVE / DRAFT — OWNER REVIEW
**Version:** 0.1
**Date:** 2026-10-29
**Authority:** D022, D027 and the NLL Migration Roadmap
**Implementation authorization:** **Not authorized**

## Purpose

Define the smallest safe Stage 5 slice for Big English 3 Unit 8 Opener: take one lesson-specific Neutral Lesson Package (NLP) through the existing neutral Chalkie adapter while preserving teacher selections, D022 boundaries and every current fallback.

This is a planning brief only. It does not authorize application code, a new environment flag, deployment, NLL promotion, POC retirement, canary retirement or Stage 6 work.

## Scope

- **Only relationship:** `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105`.
- **Only source scope:** Student Book pp. 128–129 and Workbook pp. 104–105.
- **Target:** NLP → `renderChalkieFromNeutralPackage`.
- **Proposed rollout flag:** `VITE_NLL_CHALKIE_ADAPTER_PILOT`, default `false`.
- **Existing route remains default:** current bespoke handoff with existing Opener/Story canary behavior.
- **Story is out of scope:** no Stage 5 routing for `be3_sb_wb_rel_u08_story_sb130-131_wb106`.

## What already exists

1. `buildNeutralSbWbLessonPackage` already supports the exact verified Opener relationship, rejects scope drift, projects selected SB/WB evidence, records selection state and sets `reconstructExcludedActivities: false`.
2. `renderChalkieFromNeutralPackage` already dispatches exact Opener and Story package identities to parity-proved neutral renderers and throws `UnsupportedNeutralPackageRendererError` for unsupported relationships.
3. `buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary` is already used by the Create-a-prompt path. Its default-off flag keeps the bespoke builder primary. When enabled, it builds both paths and serves neutral output only on exact parity across five artifacts; package, renderer and parity failures serve bespoke output.
4. Existing Opener canary tests cover all-selected, SB exclusion, WB exclusion, partial selection, zero selection, prior-support provenance, typed failures and fallback behavior.
5. Stage 4 already loads `be3-u08-opener`, builds the base NLP and attaches summaries for selected activities as package-level `derivedKnowledge`. It is General Lesson Plan–specific, asynchronous and deliberately omits experimental BI.
6. The Create-a-prompt Chalkie preparation handler is currently synchronous. It builds the detailed prompt through `buildChalkiePromptPreview` and separately builds the BE3 series handoff for the outline/vocabulary artifacts.
7. D022 BI support already exists as optional, labelled `curriculumInterpretation`; the current Opener path keeps BI separate from page evidence and applies optional Chalkie BI framing through its own flag.

## What Stage 5 would add

Behind the new default-off flag, the Create-a-prompt Chalkie action would:

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

## Proposed implementation seam

If authorized later, keep the code surface narrow:

- add one Stage 5 pilot module for the flag, exact-scope guard, lazy NLL load, package assembly, render call and typed fallback result;
- reuse `loadNeutralLessonComponent`, `buildNeutralSbWbLessonPackage`, `attachSelectedNllDerivedKnowledge` and `renderChalkieFromNeutralPackage`;
- make the smallest required `TeacherChoiceFlowOverlay` change to handle the asynchronous result and reuse one prepared output instead of building the prompt and handoff twice;
- add the proposed flag to `app/src/vite-env.d.ts` and `.env.example` only if implementation is authorized;
- leave the existing renderer, bespoke builders, canaries, POC, database and canonical data unchanged unless a reviewed implementation proves a smaller change is impossible.

Do not call `assembleNllGeneralLessonPlanPilot` as the Stage 5 entry point: it is intentionally tied to the Stage 4 General Lesson Plan flag, result guards and BI-exclusion boundary. Reuse its small neutral/NLL helpers rather than coupling Chalkie to the Stage 4 UI path.

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

## Restrictions

- No deployment.
- No Stage 6 coverage expansion.
- No Story routing.
- No NLL visibility or review-state promotion.
- No POC, bespoke builder or canary retirement.
- No NLP persistence.
- No canonical, Supabase migration, seed, Storage or RLS changes.
- No new Chalkie prose sourced from experimental NLL summaries without a separate owner decision.

## Risks and open questions

1. **NLL content use:** Should Stage 5 merely route an NLL-enriched NLP, as recommended, or should Chalkie visibly consume summary text? The latter is a content change and needs separate review.
2. **Asynchronous UI safety:** The current Chalkie handler is synchronous. Stage 5 needs request/scope/selection invalidation equivalent to Stage 4 so stale loads cannot overwrite newer teacher choices.
3. **Duplicate construction:** The overlay currently builds the prompt and BE3 handoff separately. An asynchronous Stage 5 path should produce one result and reuse it to avoid two NLL loads or mismatched snapshots.
4. **Fallback precedence:** Recommended order is Stage 5 attempt → current existing path, which retains the separately configured canary → bespoke fallback. Owner should confirm.
5. **Shared prior-support mapping:** Stage 4 and the canary currently have similar locally named mappers. An authorized implementation should reuse one neutral mapping contract without broad refactoring.
6. **Hidden experimental summaries:** Stage 5 would continue the explicitly gated pilot exception. Rows remain `hidden`/`experimental`; this is not promotion.

## Recommended owner decision

Approve or revise this brief only. If approved, separately authorize one bounded implementation slice for the exact Opener scope under the proposed default-off flag, with the acceptance matrix above and no deployment. Approval of this document must not be interpreted as Stage 5 coding approval.
