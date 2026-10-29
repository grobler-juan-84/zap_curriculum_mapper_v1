# NLL Migration Roadmap v0.1

**Status:** ACTIVE / PLANNING AUTHORITY  
**Version:** 0.1  
**Date:** 2026-10-29  
**Authority:** D027; Stage 2 planning authority; Stages 3–5 complete (bounded); Stage 6A Story knowledge owner-accepted; Stage 6B Story adapter owner-accepted / default-off / undeployed
**Scope:** BE3 Unit 8 Opener pilot first; BE3 Unit 8 Story Stage 6A knowledge live (hidden/experimental); Stage 6B Story adapter accepted default-off, undeployed


This document is the approved **Stage 2** migration roadmap and acceptance-gate authority. It did not itself authorize later coding. Stages 3 and 4 are owner-accepted bounded default-off Opener pilots and remain undeployed/unpromoted. On 2026-10-29 the owner approved the Stage 5 brief, authorized one bounded Opener slice (`VITE_NLL_CHALKIE_ADAPTER_PILOT`, default off), then formally accepted automated verification plus authenticated manual cases A–F and authorized commit/push of the verified Stage 5 paths only: selected NLL summaries remain package-only while the NLP routes through `renderChalkieFromNeutralPackage`; D022 BI and existing canary/bespoke fallback remain intact. Stage 5 remains default-off and undeployed. On 2026-10-29 the owner authorized Stage 6 planning, then Stage 6A Story knowledge readiness; Stage 6A is now **owner-accepted complete** (live NLL **2 / 14 / 14 / 3**; Story summaries `hidden`/`experimental`; migration `20261029180000` history reconciled as applied). The owner then approved Stage 6B planning, authorized a bounded Story adapter behind default-off `VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT` (package-only summaries; Story BI-absent; current Story canary/bespoke fallback), and on 2026-10-29 **formally accepted** automated **74/74** verification plus authenticated manual acceptance. Stage 6B is **complete, owner-accepted, default-off and undeployed**. Stage 5 Opener and Stage 6B Story are the two accepted reference implementations. Promotion, deployment, NLL visibility promotion, POC/canary retirement, Stage 7, and broad `supabase db push` remain unauthorized. Older remote-empty migration-history entries remain a separate deferred audit risk. The wider D026 feature freeze remains active outside these bounded slices. This work does not reopen or supersede D027. On PC2, the local BE3 WB canonical file exists under gitignored `data/phase1/`; it is not tracked repository content.

---

## Durable target (D027)

```text
SS / SB / WB   — canonical publisher evidence
        ↓
NLL            — single persistent authority for reusable derived lesson knowledge
        ↓
NLP            — lesson-specific package; optional reproducibility snapshot
        ↓
Adapters       — Chalkie now; future platforms later
```

Acceptance gates prove **functional replacement** and preservation of existing behavior. They do **not** demand perfection from AI-derived interpretations. Technical readiness and content approval are separate; replacement requires both.

---

## Stage numbering

| Stage | Name | Authorization |
|---|---|---|
| 1 | Architecture lock | **Done** (D027 recorded) |
| 2 | Migration roadmap and acceptance gates | **Done** (this document) |
| 3 | NLL summaries → teacher activity cards | **Complete (bounded, default off); smoke passed; owner-accepted — not NLL promotion / not POC retirement** |
| 4 | NLL knowledge → Neutral Lesson Package assembly (+ General Lesson Plan derived output) | **Complete (bounded, default off); owner-accepted; BI excluded from success path — not deployed/promoted** |
| 5 | Neutral Lesson Package → Chalkie adapter | **Complete (bounded, default off); owner-accepted A–F; undeployed / unpromoted** |
| 6 | Broader coverage and enrichment | **6A complete; 6B owner-accepted default-off undeployed; promotion / deploy / Stage 7 not authorized** |

---

## Stage 3 — NLL summaries → teacher activity cards

**Authorization status:** Bounded default-off comparison **complete and owner-accepted**. Authenticated smoke matrix passed. Does **not** make NLL summaries available for normal use; nine summaries remain `hidden` + `experimental`; POC remains. Not NLL promotion / not POC retirement. Stages 4 and 5 later received separate bounded authorization and are complete; Stage 6 Story planning is authorized, but implementation remains unauthorized. No deployment.

| Field | Detail |
|---|---|
| **Scope** | BE3 U8 Opener nine activities only (`be3_sb_wb_rel_u08_opener_sb128-129_wb104-105`) |
| **Existing path preserved** | POC summaries via `getBe3U08ActivitySummary` / `getBe3U08WbActivitySummary` in `be3U08ActivityEnrichmentPoc.ts`; current card/selection UX |
| **Local connection** | `nllCardComparison.ts` → `subscribeNllCardComparisonLifecycle` + `loadNeutralLessonComponent('be3-u08-opener', { includeHiddenExperimental: true })` once per eligible overlay/scope (single-flight under React Strict Mode); `TeacherChoiceFlowOverlay` + modal `ActivityEvidenceCard` side-by-side POC/NLL with `· experimental` labels. No fingerprint reconstruction / no staleness chrome in this slice |
| **Flag** | `VITE_CHALKIE_NLL_CARD_COMPARISON` — activity-card comparison only; **default off**. Independent of enrichment POC, `VITE_CHALKIE_NLL_SHADOW_PILOT`, and Opener/Story canaries |
| **Hidden-summary rule** | All nine pilot summaries remain `hidden` + `experimental`. Do **not** promote any row to `available`. Stage 3 `includeHiddenExperimental: true` remains comparison-path only |
| **Fallback** | Existing POC remains the functional fallback and comparison companion until replacement is accepted |
| **Acceptance gates** | NLL cards preserve source boundaries; accurately describe activities (content review); preserve teacher activity selection; do not lose useful POC functionality; fail or fall back honestly when NLL data is unavailable. Functional and content review both required |
| **Rollback** | Flag off → prior POC / publisher-evidence behavior; no DB visibility mutation |
| **Non-goals** | Promoting summaries; bulk books; handoff/adapter changes; Stage 4–6 work |
| **Owner decisions pending** | Content acceptance of nine summaries for any future normal-use promotion; when POC display may retire; review of the Stage 6 Story transfer plan |

---

## Stage 4 — NLL knowledge → Neutral Lesson Package assembly

**Authorization status:** Bounded default-off Opener pilot **complete and owner-accepted**. Automated verification and authenticated smoke matrix passed. Successful Stage 4 output excludes experimental BI; legacy/fallback paths preserve D022 BI. Not deployed/promoted. A separate bounded Stage 5 Opener slice was later authorized; Stage 6 Story planning is now authorized, but implementation remains unauthorized. No NLP snapshot persistence. No NLL visibility promotion. Nine summaries remain `hidden`/`experimental`. POC remains.

| Field | Detail |
|---|---|
| **Scope** | BE3 U8 Opener only (`be3-u08-opener` / nine activities); Story deferred |
| **Existing path preserved** | `buildNeutralSbWbLessonPackage` (base package without `derivedKnowledge`); existing General plan when flag off / ineligible (retains D022 labelled BI); selection order; shared NLP BI types unchanged |
| **Local connection** | `nllGeneralLessonPlanPilot.ts` lazy-loads NLL on General click; attaches package-level `derivedKnowledge` (not nested in publisher evidence); `renderGeneralLessonPlanFromNeutralPackage.ts` emits two-lesson SB→WB tool-neutral plan |
| **BI boundary** | Experimental Book Intelligence is **deliberately excluded** from this Stage 4 pilot assembly/render. Future BI role in the modular additive model is undecided. No D022 decision or historical BI implementation was removed. |
| **Flag** | `VITE_NLL_GENERAL_LESSON_PLAN_PILOT` — **default off**; General-plan path only; independent of Stage 3 comparison, POC, shadow, canaries |
| **Hidden-summary rule** | Controlled Stage 4 path may read hidden experimental summaries with `includeHiddenExperimental: true`; rows stay `hidden`/`experimental` |
| **Acceptance gates** | Package builds with/without NLL; exclusions omit activities; publisher evidence unchanged; NLL labelled experimental; Stage 4 plan has no BI block; fallback existing General plan + explicit line; no invented objectives/procedures |
| **Rollback** | Flag off → existing General Lesson Plan behavior; no DB visibility mutation |
| **Non-goals** | NLP persistence; treating NLP as reusable library; Chalkie/Stage 5; sequencing UI; visibility promotion; POC retirement; deleting D022/BI |
| **Owner decisions pending** | Whether to persist NLP snapshots later; future BI role in the modular model; review of the Stage 6 Story transfer plan |

---

## Stage 5 — Neutral Lesson Package → Chalkie adapter

**Authorization status:** Bounded default-off Opener pilot **complete and owner-accepted** (automated verification + authenticated manual A–F, 2026-10-29). Commit/push of verified Stage 5 paths authorized. Not deployed/promoted. Stage 6 Story planning is authorized; implementation remains unauthorized. No NLP snapshot persistence. No NLL visibility promotion. Nine summaries remain `hidden`/`experimental`. POC and canaries remain.

| Field | Detail |
|---|---|
| **Scope** | One accepted relationship first (Opener): `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105` |
| **Existing path preserved** | Bespoke handoffs as fallback; Opener/Story canary wrappers (`buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary`, `buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary`) and mismatch diagnostics |
| **Local connection** | `nllChalkieAdapterPilot.ts` lazily loads NLL, assembles the selected NLP, attaches selected package-only summaries and calls `renderChalkieFromNeutralPackage`; `TeacherChoiceFlowOverlay` reuses the returned five artifacts |
| **Flag** | `VITE_NLL_CHALKIE_ADAPTER_PILOT` — **default off**; exact BE3 U8 Opener two-lesson Chalkie path only |
| **Acceptance gates** | Automated all-selected, partial, zero, key-exclusion, failure, stale-result and BI cases pass; Create-a-prompt returns expected artifacts; authenticated manual A–F PASS |
| **Rollback** | Flag off/ineligible/failure → unchanged current path, including separately configured canary and bespoke fallback |
| **Non-goals** | Multi-platform adapters; OpenAI revive; classroom-validation claims; Story routing; Stage 6 |
| **Owner decisions pending** | Whether to deploy later; whether NLL summary prose may enter Chalkie; POC/canary retirement; review of the Stage 6 Story transfer plan |

---

## Stage 6 — Broader coverage and enrichment

**Authorization status:** Stage **6A complete and owner-accepted**. Story NLL knowledge is live but remains `hidden`/`experimental` (not promoted). Stage **6B complete and owner-accepted** behind default-off `VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT` (automated **74/74**; typecheck pass; lint pass with pre-existing warnings only; authenticated manual acceptance passed 2026-10-29). Undeployed/unpromoted. Stage 5 Opener and Stage 6B Story are the two accepted reference implementations. Promotion, deployment, Stage 7, and broad `supabase db push` remain unauthorized. Older remote-empty migration-history entries remain a deferred audit risk.

| Field | Detail |
|---|---|
| **First transfer scope** | BE3 U8 Story: `be3_sb_wb_rel_u08_story_sb130-131_wb106` (SB pp.130–131 → WB p.106 only; WB p.107 forbidden) |
| **Existing path preserved** | Canonical SS/SB/WB; existing Story bespoke builder; accepted Story neutral-package renderer and default-off canary; accepted Opener Stage 3–5 paths; experiment/audit history |
| **6A readiness (accepted)** | Live totals **2 / 14 / 14 / 3**; `be3-u08-story` `draft`; five preferred v1 summaries `hidden`/`experimental`; one Structures link `proposed`; Opener unchanged **1 / 9 / 9 / 2**; migration `20261029180000` recorded applied remotely |
| **6B status** | **Owner-accepted**; default-off; undeployed; automated 10/10 + 74/74; typecheck pass; lint warnings only; manual acceptance passed |
| **Acceptance gates** | Exact scope; content + functional review; all/partial/zero selection; SB Activity 6 and WB Activity 5 exclusions; no WB p.107; teacher inputs; failure/stale fallback; five-artifact authenticated workflow; D022 unchanged |
| **Rollback** | `VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT=false`; failure/ineligible/flag-off returns the current Story canary/bespoke path |
| **Non-goals** | Canonical changes; deployment; promotion; NLL prose in Chalkie; POC/canary retirement; other components/books; broader enrichment; Stage 7; broad `supabase db push` |
| **Owner decisions** | Whether to promote/deploy later; Stage 7 authorization; Preparing-state UX flash remains a non-blocking observation only |

---

## Exact function references (do not rename in planning)

| Symbol | File |
|---|---|
| `assembleNeutralLessonComponent` | `app/src/features/nll/neutralLessonLibrary.ts` |
| `loadNeutralLessonComponent` | `app/src/features/nll/neutralLessonLibrary.ts` |
| `fingerprintCanonicalActivity` | `app/src/features/nll/neutralLessonLibrary.ts` |
| `isNllShadowPilotEnabled` / `buildNllShadowLessonPackage` | `app/src/features/nll/buildNllShadowLessonPackage.ts` |
| `getBe3U08ActivitySummary` / `getBe3U08WbActivitySummary` | `app/src/features/chalkie/be3U08ActivityEnrichmentPoc.ts` |
| `buildNeutralSbWbLessonPackage` | `app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts` |
| `renderChalkieFromNeutralPackage` | `app/src/features/chalkie/renderChalkieFromNeutralPackage.ts` |
| `assembleNllChalkieAdapterPilot` | `app/src/features/chalkie/nllChalkieAdapterPilot.ts` |
| `assembleNllStoryChalkieAdapterPilot` | `app/src/features/chalkie/nllStoryChalkieAdapterPilot.ts` |
| Opener/Story canary wrappers | `be3U08OpenerNeutralCanary.ts` / `be3U08StoryNeutralCanary.ts` |

---

## Related

- [`../4-decisions.md`](../4-decisions.md) — D027  
- [`nll-pilot-architecture-v0.1.md`](./nll-pilot-architecture-v0.1.md) — pilot facts  
- [`stage-5-implementation-brief-v0.1.md`](./stage-5-implementation-brief-v0.1.md) — approved brief and local implementation/verification record
- [`stage-6-story-transfer-brief-v0.1.md`](./stage-6-story-transfer-brief-v0.1.md) — BE3 U8 Story transfer brief (6A accepted; 6B gated)
- [`stage-6a-story-knowledge-review-v0.1.md`](./stage-6a-story-knowledge-review-v0.1.md) — Stage 6A acceptance / migration-history record
- [`stage-6b-story-adapter-implementation-brief-v0.1.md`](./stage-6b-story-adapter-implementation-brief-v0.1.md) — Stage 6B implementation brief + verification record
- [`../5-progress.md`](../5-progress.md) — current freeze / status  
