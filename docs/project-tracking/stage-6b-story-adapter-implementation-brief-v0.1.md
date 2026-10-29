# Stage 6B Story Adapter Implementation Brief v0.1

**Status:** OWNER-ACCEPTED / DEFAULT-OFF / UNDEPLOYED
**Version:** 0.1
**Date:** 2026-10-29
**Authority:** D022, D026 and D027; accepted Stage 5 Opener pilot; accepted Stage 6A Story knowledge; owner Stage 6B implementation + formal acceptance 2026-10-29
**Implementation authorization:** Bounded Stage 6B **complete and owner-accepted** (default-off; undeployed). Stage 5 Opener and Stage 6B Story are the two accepted reference implementations. Promotion, deployment, NLL visibility promotion, POC/canary retirement and broader Stage 6/7 remain **not authorized**.

---

## 1. Purpose

Define the smallest safe Stage 6B transfer for **Big English 3, Unit 8 Story only**:

```text
hidden/experimental Story NLL -> teacher-selected Story NLP
-> renderChalkieFromNeutralPackage -> existing five Chalkie artifacts
```

This is a transfer test, not a generalized adapter rewrite and not a content expansion.

The library grows. The package selects. The adapter generates. The teacher approves. The SS governs.

---

## 2. Exact boundary

| Field | Approved boundary proposed by this brief |
|---|---|
| Story component | `be3-u08-story` |
| Relationship | `be3_sb_wb_rel_u08_story_sb130-131_wb106` |
| Neutral package | `be3-sb-wb-u08-p130-131-wb106` |
| Publisher evidence | SB pp.130–131 and WB p.106 only |
| Explicit exclusion | WB p.107 and every other Unit 8 component |
| UI route | Authenticated Create-a-prompt, two-lesson SB/WB series only |
| Adapter target | `renderChalkieFromNeutralPackage` |
| Proposed flag | `VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT=false` |
| NLL visibility | Explicit pilot read of hidden/experimental records; no promotion |
| Output rule | NLL summaries remain package-only and do not become Chalkie prose |
| BI rule | Story remains BI-absent; existing Opener D022 behavior is unchanged |

Story single-lesson output, Language in Action, Opener, other units and other books are ineligible.

---

## 3. Existing functionality — already implemented and accepted

1. `be3-u08-story` is live as a `draft` NLL component with five preferred v1 summaries, all `hidden` and `experimental`; its one Structures link remains `proposed`.
2. The exact five NLL activities are SB Activities 6 and 7 plus WB p.106 Activities 5, 6 and THINK BIG. WB p.107 has no membership.
3. `buildNeutralSbWbLessonPackage` already validates the curated asymmetric relationship, filters selections to its verified pages, records all/partial/zero selection honestly, sets `reconstructExcludedActivities: false`, and identifies WB p.107 as excluded scope.
4. The Story package deliberately receives no Book Intelligence. `resolveOpenerBookIntelligence` returns BI only for the Opener component, preserving D022.
5. `renderChalkieFromNeutralPackage` already dispatches the exact Story relationship to the accepted Story renderer and produces the five current artifacts.
6. `buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary` is the current default-off neutral parity guard. It falls back to the bespoke Story handoff for flag-off, missing selection, unsupported scope, package error, renderer error or artifact mismatch.
7. `TeacherChoiceFlowOverlay` currently selects the Story canary/bespoke path through `buildExistingChalkieOutput`.
8. Stage 5 already supplies the asynchronous pattern needed for lazy NLL load, request identity, stale-result prevention, package-level summary attachment and fallback to `buildExistingChalkieOutput`; however, its component key, eligibility and handoff type are intentionally Opener-only.
9. Existing Story tests already cover five-artifact parity, all/partial/zero selection, SB Activity 6 exclusion, WB Activity 5 exclusion, teacher/prior inputs, typed fallbacks and WB p.107 absence.

These are foundations, not work to rebuild.

---

## 4. Proposed Stage 6B work

### 4.1 Add one Story-only adapter pilot

Add a bounded module, proposed as `nllStoryChalkieAdapterPilot.ts`, that owns:

- the new default-off flag;
- the constant `BE3_U08_STORY_NLL_COMPONENT_KEY = 'be3-u08-story'`;
- exact Story relationship and two-lesson eligibility;
- a request key containing scope, selected SB/WB activity IDs, selected prior support and teacher additions;
- lazy `loadNeutralLessonComponent(..., { includeHiddenExperimental: true })`;
- selected Story NLP assembly through `buildNeutralSbWbLessonPackage`;
- package-level attachment through the existing `attachSelectedNllDerivedKnowledge` helper;
- Story rendering through `renderChalkieFromNeutralPackage`;
- conversion of the rendered five artifacts to the existing `Be3U08StorySeriesHandoff` shape; and
- typed, non-throwing fallback reasons for flag-off, ineligible scope, missing client/component, NLL load error, package error and renderer error.

Reuse `mapTeacherInputsToStoryPriorSupport` or an equally small shared mapping only if doing so does not change existing Story canary behavior. Do not generalize or rename the accepted Stage 5 Opener module in this slice.

### 4.2 Wire only the existing Create-a-prompt action

In `TeacherChoiceFlowOverlay`:

1. evaluate Stage 6B only for the exact Story two-lesson SB/WB series;
2. snapshot the current selections and teacher inputs;
3. show the existing preparing state while the Story NLL loads;
4. discard late results after close, back, output change, scope change, selection/input change or a newer request;
5. on success, display the returned existing five artifacts; and
6. on any failure, call `buildExistingChalkieOutput` with the same captured selections and inputs.

The Stage 5 Opener branch remains independent and unchanged.

### 4.3 Fallback precedence

```text
Stage 6B flag off or ineligible
  -> current Story path
     -> existing Story neutral canary if separately enabled
        -> bespoke Story handoff on canary failure/mismatch

Stage 6B flag on and exact scope
  -> Story NLL -> selected NLP -> shared renderer
     -> success: existing five Story artifacts
     -> any failure/stale result: current Story path above
```

The new flag must not enable, disable or replace `VITE_CHALKIE_BE3_U08_STORY_NEUTRAL_CANARY`. The Stage 5 Opener flag also remains independent.

---

## 5. Selection and content integrity

- NLL membership is not permission to select an activity. Only the current teacher selection enters the NLP.
- Never reconstruct, infer or substitute an unchecked activity from page context, canonical data, NLL membership or summary text.
- Zero selection is a valid explicit state and must remain empty in the relevant artifact sections.
- Excluding SB Activity 6 removes it, Audio 154 and its task from every artifact unless independently present in a still-selected activity's verified evidence.
- Excluding WB p.106 Activity 5 removes its four Amy-dinner questions from every artifact.
- WB p.107 must not enter eligibility, NLL membership, the NLP, generated artifacts, diagnostics or fallback output.
- Teacher-selected prior support and teacher-added inputs retain label, frame, provenance, purpose and lesson targets.
- Publisher instructions and evidence remain authoritative and unchanged. NLL summaries stay derived, labelled by package structure and absent from Chalkie textboxes.
- The proposed Structures link remains `proposed`; it must not be presented as curriculum authority.

---

## 6. D022 and output boundary

- Do not pass BI inputs into the Story NLP.
- Do not call `applyOpenerBiFramingToHandoff` for Story output.
- Do not alter Opener BI-present or BI-absent behavior.
- Do not let NLL summary text become an objective, procedure, answer, lyric, script or teaching claim.
- Preserve the current five Story artifacts: detailed handoff, Lesson 1 outline, Lesson 1 vocabulary, Lesson 2 outline and Lesson 2 vocabulary. The existing series title remains separately copyable in the UI.

---

## 7. Acceptance matrix

### Automated

| Case | Required result |
|---|---|
| Flag unset/false | No Story NLL request; current Story path unchanged |
| Exact scope only | Only BE3 U8 Story two-lesson SB/WB series can run Stage 6B |
| All selected | Five accepted Story activities remain selected and render |
| Partial selection | Exact remaining SB/WB selections render in source order |
| Zero selection | Honest empty states; no reconstructed activity |
| SB Activity 6 excluded | Activity 6 / Audio 154 task absent from every artifact |
| WB Activity 5 excluded | Its four Amy-dinner questions absent from every artifact |
| WB p.107 boundary | No p.107 activity or content in package or artifacts |
| Teacher inputs | Selected suggestions and teacher additions preserved exactly |
| NLL load missing/error | Existing Story canary/bespoke path succeeds |
| Package failure | Existing Story canary/bespoke path succeeds |
| Renderer failure | Existing Story canary/bespoke path succeeds |
| Stale request | Late output cannot replace current selections/scope/output |
| Flag interaction | Stage 6B, Story canary and Stage 5 Opener flags remain independent |
| D022 | Story has no BI; Opener BI-present/absent regressions pass |
| Scope isolation | Opener, p.107, other components/units/books and Story single-lesson paths make no Story NLL request |
| NLL prose | No experimental summary text is injected into the five Chalkie artifacts |

Reuse the existing Story canary, neutral package, renderer, Stage 5 adapter and teacher-flow regression suites. Add one focused Stage 6B adapter suite; avoid duplicating tests already proving unchanged foundations.

### Authenticated manual acceptance

Use a process-only flag without changing `.env.local`:

1. open BE3 U8 Story (SB pp.130–131 with WB p.106) and complete Create-a-prompt;
2. confirm successful Story-only requests to `nll_components`, `nll_component_activities`, `nll_activity_summaries` and `nll_ss_component_links` by table name/status only;
3. verify all-selected, partial-selection and zero-selection cases;
4. explicitly exclude SB Activity 6 and WB Activity 5 and confirm neither is reconstructed;
5. confirm WB p.107 remains absent;
6. confirm teacher inputs survive;
7. confirm all five artifacts display correctly and can be copied;
8. confirm no NLL-summary or BI prose appears in Chalkie textboxes;
9. confirm Opener and a non-Story scope make no Stage 6B Story request; and
10. restart with the Stage 6B flag unset and verify the current Story fallback completes.

Manual acceptance must be recorded separately; automated results cannot substitute for it.

---

## 8. Proposed implementation paths

Only the following application/config/test paths should be needed if the owner later authorizes implementation:

- `.env.example`
- `app/src/vite-env.d.ts`
- `app/src/features/chalkie/nllStoryChalkieAdapterPilot.ts` (new)
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx`
- `scripts/tests/nllStoryChalkieAdapterPilot.test.ts` (new)

Documentation trackers and this brief may be updated to record implementation evidence. Any additional application path requires an explicit explanation before modification. No canonical, migration, seed or database file belongs in Stage 6B.

---

## 9. Restrictions

Stage 6B implementation, if separately authorized, must not:

- modify canonical SS/SB/WB data, Story NLL records, schema, migrations or Supabase;
- modify `.env.local`, expose credentials, promote summaries or change the proposed SS link;
- deploy or change the default-off production state;
- introduce NLL prose into Chalkie output;
- retire the POC, Stage 5 path, Story canary or bespoke handoff;
- broaden to WB p.107, other Unit 8 components, other units/books or broader enrichment;
- persist NLP snapshots;
- perform refactor-first generalization or unrelated cleanup;
- begin Stage 7; or
- commit or push without a separate owner approval after implementation and verification.

---

## 10. Risks and open questions

1. **Flag interaction:** three independent controls will exist around Opener/Story neutral routing. The precedence above must be explicit in tests and diagnostics.
2. **Eligibility drift:** relationship-ID-only checks are insufficient if malformed page/card scope reaches the overlay. The pilot should validate the accepted companion fields and constrain selections to SB pp.130–131 / WB p.106 before loading NLL.
3. **Shared helper coupling:** importing Story prior-support mapping from the canary is minimal, but its behavior must remain unchanged. Moving helpers solely for architectural tidiness is outside this slice.
4. **Live hidden records:** the pilot intentionally reads hidden/experimental Story knowledge. A missing or incomplete component must fall back; it must not partially render.
5. **Stale UI state:** Stage 5 has one Opener request guard. Story integration must not allow concurrent branches or an old Story result to overwrite a newer output.
6. **Historical migration gaps:** older remote-empty migration entries remain a separate audit risk and are unrelated to Stage 6B runtime acceptance.

---

## 11. Implementation and verification record (2026-10-29)

Owner approved this brief and authorized one bounded local implementation slice.

### Implemented paths

- `.env.example` — `VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT=false`
- `app/src/vite-env.d.ts` — typed Stage 6B flag
- `app/src/features/chalkie/nllStoryChalkieAdapterPilot.ts` — new Story-only assembler
- `app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx` — Story Create-a-prompt wiring with independent stale guards and fallback to `buildExistingChalkieOutput`
- `scripts/tests/nllStoryChalkieAdapterPilot.test.ts` — new focused suite

### Automated verification

| Check | Result |
|---|---|
| Stage 6B focused suite | **10/10** |
| Combined Stage 6B + Story/Opener/neutral/BI/teacher-flow regressions | **74/74** |
| `app` typecheck (`tsc -b`) | **pass** |
| `app` lint (`oxlint`) | **pass** (pre-existing warnings only) |

### Authenticated manual acceptance (2026-10-29) — OWNER-ACCEPTED

Process-only `VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT=true` on Vite `5174` (no `.env.local` change). Network evidence by table name/status only. Owner formally accepted this walkthrough on 2026-10-29.

| Case | Result |
|---|---|
| All-selected Story series + teacher-added | **PASS** — title/ref `be3-sb-wb-u08-p130-131-wb106`; five artifacts displayed/copied; teacher marker survived; NLL `nll_components` / `nll_component_activities` / `nll_ss_component_links` / `nll_activity_summaries` all **200** with `component_key=be3-u08-story` |
| Partial — exclude SB Act 6 + WB Act 5 | **PASS** — Act 7 / WB Act 6 / THINK BIG present; unchecked activities not reconstructed; NLL **200**s |
| Zero selection | **PASS** — “No current Student Book activities were selected” + do-not-reconstruct; no Amy/Act content; teacher survived; NLL **200**s |
| WB p.107 / Language in Action | **PASS** — p.107 present only as excluded-scope wording |
| NLL/BI prose | **PASS** — no experimental-summary or BI leak in Chalkie textboxes |
| Copy controls | **PASS** — all five artifact + title copy buttons present (clipboard blocked by automation focus; UI reported manual-copy fallback) |
| Opener / non-Story isolation | **PASS** — Opener single `be3-sb-u08-p128` prepared with **zero** Story NLL requests |
| Flag-off Story fallback | **PASS** — Vite restarted with flag `<unset>`; Story series prepared instantly with five artifacts; **zero** `nll_*` Story requests |

Observation (non-blocking UX only; not polished in this batch): while flag-on Prepare shows “Preparing…”, Lesson Outlines briefly flash unrelated placeholder text; final settled artifacts were correct.

Temporary Vite `5174` was stopped after the walkthrough. `.env.local` remained unchanged. No canonical, migration, schema, Supabase, Storage or live NLL writes. Stage 6B remains **complete, owner-accepted, default-off and undeployed**. Stage 5 Opener and Stage 6B Story are the two accepted reference implementations.

### Still pending (out of Stage 6B scope)

1. Promotion, deployment and broader Stage 6 / Stage 7 remain unauthorized.
2. NLL visibility promotion and POC/canary/bespoke retirement remain unauthorized.
3. Broad `supabase db push` remains unauthorized.

---

## 12. Related authority and evidence

- [`stage-6-story-transfer-brief-v0.1.md`](./stage-6-story-transfer-brief-v0.1.md)
- [`stage-6a-story-knowledge-review-v0.1.md`](./stage-6a-story-knowledge-review-v0.1.md)
- [`stage-5-implementation-brief-v0.1.md`](./stage-5-implementation-brief-v0.1.md)
- [`nll-migration-roadmap-v0.1.md`](./nll-migration-roadmap-v0.1.md)
- [`../phase-5/chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md`](../phase-5/chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md)
- [`../4-decisions.md`](../4-decisions.md)
