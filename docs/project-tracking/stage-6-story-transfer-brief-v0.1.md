# Stage 6 Story Transfer Planning Brief v0.1

**Status:** 6A OWNER-ACCEPTED / 6B UNAUTHORIZED  
**Version:** 0.1  
**Date:** 2026-10-29  
**Authority:** Owner Stage 6 planning + Stage 6A acceptance; D022, D026 and D027 remain in force  
**Implementation authorization:** Stage **6A complete** (Story NLL knowledge live, hidden/experimental). Stage **6B** adapter transfer, promotion, and deployment remain **not authorized**.

---

## 1. Purpose

Plan the smallest credible transfer of the accepted Stages 3-5 architecture from the Big English 3 Unit 8 Opener to the next already-proven curriculum relationship: **Big English 3 Unit 8 Story**.

This is a transfer test, not a general expansion. It asks whether the durable flow can be repeated honestly for one asymmetric component:

```text
SS / SB / WB -> NLL -> selected NLP -> renderChalkieFromNeutralPackage
```

The library grows. The package selects. The adapter generates. The teacher approves. The SS governs.

---

## 2. Exact proposed scope

| Field | Boundary |
|---|---|
| Component | Big English 3, Unit 8 Story only |
| Relationship | `be3_sb_wb_rel_u08_story_sb130-131_wb106` |
| Package | `be3-sb-wb-u08-p130-131-wb106` |
| Publisher evidence | Student Book pp.130-131 -> Workbook p.106 only |
| Forbidden adjacent scope | Workbook p.107; it is Language in Action, not Story practice |
| Target path | Story NLL knowledge -> selected Story NLP -> `renderChalkieFromNeutralPackage` |
| Rollout if later authorized | A new Story-only, default-off pilot flag; exact name requires owner approval in the implementation brief |

No other Unit 8 component, book, unit, adapter or enrichment type is in scope.

---

## 3. Existing functionality - already present

The following is implementation reality and must be reused rather than rediscovered:

- The curated Story relationship is human-verified and explicitly excludes WB p.107.
- `buildNeutralSbWbLessonPackage` already accepts the exact Story relationship, preserves selected SB/WB evidence, supports all/partial/zero selection, and forbids adjacent-page inference or reconstruction.
- Story packages deliberately omit Book Intelligence. The current D022 boundary is therefore preserved by keeping BI absent from this proposed Story path.
- `renderChalkieFromNeutralPackage` already dispatches the exact Story package to the Story renderer.
- The Story neutral renderer has exact five-artifact parity with the bespoke Story handoff for the accepted relationship.
- `buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary` is already default-off, manually accepted and able to fall back to the bespoke Story builder on mismatch, missing selection, unsupported scope, package failure or renderer failure.
- Existing tests cover flag-off behavior, exact parity, SB Activity 6 exclusion, WB Activity 5 exclusion, partial and zero selection, teacher/prior inputs, diagnostics and the WB p.107 boundary.
- Stage 5 is intentionally Opener-only. Its eligibility check, component key, NLL loader and returned handoff type must not be treated as Story-capable merely because the shared NLP and renderer already understand Story.

## 4. Missing functionality - proposed Stage 6 work

The persistent NLL currently contains one component, `be3-u08-opener`, with nine hidden experimental summaries. It does **not** currently contain an approved Story component or Story summary set.

Before any Story adapter implementation can be authorized, Stage 6 therefore needs two separately reviewable slices:

### 6A - Story knowledge readiness

1. Inventory the exact eligible Story SB and WB activities from existing verified evidence.
2. Draft teacher-friendly Story summaries with evidence sufficiency, provenance and source fingerprints.
3. Review every summary for source fidelity and honest insufficiency handling.
4. Define the proposed Story NLL component key, links and additive records.
5. Keep all proposed records `hidden` and `experimental`; no promotion or live write is implied.
6. Present the proposed records and verification plan for separate owner approval before any migration, seed or Supabase write.

### 6B - Story adapter transfer

Only after 6A content readiness is accepted, prepare a bounded implementation brief for:

1. exact Story-only eligibility;
2. lazy loading of the accepted Story NLL component;
3. selected-summary attachment at NLP package level only;
4. Story NLP rendering through `renderChalkieFromNeutralPackage`;
5. reuse of the existing five displayed/copyable artifacts;
6. stale-result guards equivalent to Stage 5;
7. fallback to the existing Story canary/bespoke path on any failure; and
8. a separate default-off rollout control so Opener and Story remain independently reversible.

No NLL summary prose should enter Chalkie output in this transfer. The summaries remain package-only unless the owner later authorizes a separate content decision.

---

## 5. Acceptance gates for any later implementation

### Functional gate

- Flag unset/false produces no Story NLL requests and preserves the current Story path byte-for-byte where parity is expected.
- Eligibility is limited to `be3_sb_wb_rel_u08_story_sb130-131_wb106` and the two-lesson SB/WB Create-a-prompt path.
- All-selected, partial-selection and zero-selection states preserve the teacher's exact choices.
- Excluding SB Activity 6 keeps it out of every generated artifact.
- Excluding WB p.106 Activity 5 keeps it out of every generated artifact.
- No unchecked activity is reconstructed, substituted or inferred.
- WB p.107 never enters the package, artifacts, diagnostics or fallback result.
- Selected prior support and teacher-added inputs retain their labels, provenance and purpose.
- NLL, package and renderer failure each return the existing Story canary/bespoke result without losing selections or inputs.
- Superseded, closed or scope-changed requests cannot apply stale results.
- Opener, Language in Action, other units, Story single-lesson choices and other books remain unaffected.

### Content gate

- Every proposed Story summary is reviewed against canonical publisher evidence.
- Insufficient evidence is stated honestly rather than completed by invention.
- Summary provenance and fingerprints are auditable.
- NLL knowledge remains clearly derived and cannot alter SS/SB/WB authority.
- Story summaries remain `hidden` and `experimental` until a later, separate promotion decision.

### D022 and output gate

- Story BI behavior remains unchanged: the Story neutral package does not introduce BI.
- Existing Opener BI behavior and Stage 5 BI boundaries remain unchanged.
- NLL summary prose remains package-only and absent from Chalkie textboxes.
- All five Chalkie artifacts display correctly and can be copied through the authenticated Create-a-prompt workflow.

### Operational gate

- Automated tests cover flag-off, scope isolation, all/partial/zero selection, the two key exclusions, WB p.107 absence, teacher inputs, all failure fallbacks, stale prevention and regression of Opener behavior.
- Authenticated manual verification confirms the Story-only network requests by table name/status without exposing tokens, headers or bodies.
- The manual walkthrough verifies all five artifacts and a final flag-off fallback check.
- Implementation remains local, default-off and undeployed until separately accepted.

Functional readiness and content readiness are independent. Both must pass.

---

## 6. Rollback and fallback design

If implementation is later authorized:

- unset/false Story Stage 6 flag -> current Story canary/bespoke path;
- ineligible scope -> current path without NLL loading;
- NLL unavailable, incomplete or stale -> current path;
- package or renderer error -> current path;
- artifact mismatch where the existing canary compares parity -> bespoke output plus bounded diagnostic.

The existing Story canary and bespoke builder remain safety assets. This plan does not authorize their retirement.

---

## 7. Explicit non-goals and restrictions

This planning approval does not authorize:

- application code, refactoring, flags or configuration changes;
- canonical curriculum changes;
- migrations, seeds, Supabase/Storage writes or NLL record promotion;
- deployment;
- NLL summary prose in Chalkie output;
- POC, canary or bespoke-path retirement;
- Opener behavior changes;
- Language in Action, Skills, Grammar, Culture, Writing, other units or other books;
- broader teacher/school enrichment;
- NLP persistence;
- Stage 6 implementation or Stage 7 work.

---

## 8. Risks and open questions

1. **Story NLL content does not yet exist.** Adapter transfer cannot be honestly accepted before Story knowledge is authored and reviewed.
2. **Opener-specific coupling may be hidden in Stage 5.** A later implementation brief must identify the smallest safe reuse boundary without refactor-first generalization.
3. **Asymmetric scope is easy to broaden accidentally.** WB p.107 requires explicit negative assertions at data, package, renderer and UI levels.
4. **Flag proliferation can become confusing.** The owner must approve whether Stage 6 receives a new Story-only flag and how it coexists with the older Story neutral canary.
5. **Content acceptance is not functional acceptance.** Passing code tests cannot approve experimental Story summaries, and content approval cannot prove selection/fallback behavior.
6. **Enrichment is premature.** Broader teacher or school enrichment should wait until this first coverage transfer proves the pattern.

---

## 9. Owner decisions

1. ~~Approve or revise this Story-first Stage 6 transfer plan.~~ **Done.**
2. ~~Authorize a bounded **6A Story knowledge-readiness** slice.~~ **Done — owner-accepted complete** (live **2 / 14 / 14 / 3**; migration `20261029180000` history reconciled).
3. ~~Review and accept the proposed Story summaries and additive NLL records.~~ **Done** (five preferred v1 summaries remain `hidden`/`experimental`; one Structures link `proposed`; WB p.107 excluded).
4. **Still required before 6B:** approve a separate 6B implementation brief, flag name, test matrix and authorized paths.

Stage **6B**, promotion, deployment, and broad `supabase db push` remain unauthorized. See [`stage-6a-story-knowledge-review-v0.1.md`](./stage-6a-story-knowledge-review-v0.1.md).

---

## 10. Related authority and evidence

- [`nll-migration-roadmap-v0.1.md`](./nll-migration-roadmap-v0.1.md) - staged migration and acceptance-gate authority
- [`stage-5-implementation-brief-v0.1.md`](./stage-5-implementation-brief-v0.1.md) - accepted Opener transfer pattern
- [`../phase-5/chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md`](../phase-5/chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md) - existing Story canary and manual acceptance
- [`../phase-5/chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md`](../phase-5/chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md) - neutral package and renderer evidence
- [`../4-decisions.md`](../4-decisions.md) - D022, D026 and D027
