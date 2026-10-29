# NLL Migration Roadmap v0.1

**Status:** ACTIVE / PLANNING AUTHORITY  
**Version:** 0.1  
**Date:** 2026-10-29  
**Authority:** D027; Stage 2 planning authority; Stage 3 complete; Stage 4 local pilot owner-accepted
**Scope:** BE3 Unit 8 Opener pilot first; broader coverage only in Stage 6


This document is the approved **Stage 2** migration roadmap and acceptance-gate authority. It did **not** itself authorize Stage 3 or Stage 4 coding. Stage 3 is **owner-accepted** (bounded default-off Opener card comparison). Stage 4 was subsequently authorized as a **bounded local Opener pilot** (`VITE_NLL_GENERAL_LESSON_PLAN_PILOT`, default off): lazy NLL → NLP package-level `derivedKnowledge` → two-lesson General Lesson Plan. Stage 4 is **owner-accepted** as a bounded default-off Opener pilot (review-corrected; deliberate BI exclusion from the successful pilot path; authenticated-smoke verified) — not deployed/promoted; no NLP persistence; no NLL visibility change; no POC retirement; D022 / shared NLP BI support unchanged (legacy/fallback GLP may still show labelled BI). A Stage 5 implementation brief now exists for owner review only; Stages 5–6 remain unauthorized. The wider D026 feature freeze remains active outside bounded Stage 3/4 work. Production deployment remains deferred. Stage 3/4 work does not reopen or supersede D027. On PC2, the local BE3 WB canonical file exists under gitignored `data/phase1/`; it is not tracked repository content.

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
| 5 | Neutral Lesson Package → Chalkie adapter | **Not authorized** |
| 6 | Broader coverage and enrichment | **Not authorized** |

---

## Stage 3 — NLL summaries → teacher activity cards

**Authorization status:** Bounded default-off comparison **complete and owner-accepted**. Authenticated smoke matrix passed. Does **not** make NLL summaries available for normal use; nine summaries remain `hidden` + `experimental`; POC remains. Not NLL promotion / not POC retirement. Stage 4 later received separate bounded local authorization. Stages 5–6 unauthorized. No deployment.

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
| **Owner decisions pending** | Content acceptance of nine summaries for any future normal-use promotion; when POC display may retire; whether to authorize Stages 4–6 |

---

## Stage 4 — NLL knowledge → Neutral Lesson Package assembly

**Authorization status:** Bounded default-off Opener pilot **complete and owner-accepted**. Automated verification and authenticated smoke matrix passed. Successful Stage 4 output excludes experimental BI; legacy/fallback paths preserve D022 BI. Not deployed/promoted. No Stage 5–6 authorization. No NLP snapshot persistence. No NLL visibility promotion. Nine summaries remain `hidden`/`experimental`. POC remains.

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
| **Owner decisions pending** | Independent review acceptance; whether to persist NLP snapshots later; Stage 5 authorization; future BI role in modular model |

---

## Stage 5 — Neutral Lesson Package → Chalkie adapter

**Authorization status:** Not authorized. A draft implementation brief exists for owner review; it grants no coding approval.

| Field | Detail |
|---|---|
| **Scope** | One accepted relationship first (Opener) |
| **Existing path preserved** | Bespoke handoffs as fallback; Opener/Story canary wrappers (`buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary`, `buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary`) and mismatch diagnostics |
| **Proposed connection** | NLP → `renderChalkieFromNeutralPackage` |
| **Acceptance gates** | Functional replacement for all-selected and key exclusion cases; no reconstruction of unchecked activities; Create-a-prompt completes; not perfect AI prose |
| **Rollback** | Bespoke default path |
| **Non-goals** | Multi-platform adapters; OpenAI revive; classroom-validation claims |
| **Owner decisions** | Whether to authorize the proposed default-off Opener pilot; keep NLL summaries package-only or render them; canary/fallback precedence; when bespoke may archive |

---

## Stage 6 — Broader coverage and enrichment

**Authorization status:** Not authorized.

| Field | Detail |
|---|---|
| **Scope** | Additional components/books only after Stages 3–5 prove replacement for the pilot |
| **Existing path preserved** | Canonical SS/SB/WB; accepted adapter path; experiment/audit history |
| **Proposed connection** | Reuse Stage 3–5 patterns per new scope |
| **Acceptance gates** | Per-scope functional + content gates; no silent bulk promotion |
| **Rollback** | Limit to previously accepted scopes |
| **Non-goals** | Governance bureaucracy; deleting audit/experiment history |
| **Owner decisions** | Which next unit/component; archive vs delete of superseded POC/bespoke |

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
| Opener/Story canary wrappers | `be3U08OpenerNeutralCanary.ts` / `be3U08StoryNeutralCanary.ts` |

---

## Related

- [`../4-decisions.md`](../4-decisions.md) — D027  
- [`nll-pilot-architecture-v0.1.md`](./nll-pilot-architecture-v0.1.md) — pilot facts  
- [`stage-5-implementation-brief-v0.1.md`](./stage-5-implementation-brief-v0.1.md) — draft Stage 5 owner-review brief
- [`../5-progress.md`](../5-progress.md) — current freeze / status  
