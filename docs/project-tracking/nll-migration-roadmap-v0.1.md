# NLL Migration Roadmap v0.1

**Status:** ACTIVE / PLANNING AUTHORITY  
**Version:** 0.1  
**Date:** 2026-10-29  
**Authority:** D027; Stage 2 planning authority; Stage 3 bounded comparison complete (owner-accepted)
**Scope:** BE3 Unit 8 Opener pilot first; broader coverage only in Stage 6


This document is the approved **Stage 2** migration roadmap and acceptance-gate authority. It did **not** itself authorize Stage 3 coding. Stage 3 was subsequently authorized as a bounded slice, authenticated-smoke-verified, and **owner-accepted** as a complete default-off Opener NLL↔POC card-comparison path. Acceptance does not declare NLL summaries available for normal use: the nine pilot summaries remain `hidden` + `experimental`; the enrichment POC remains in place; this is not NLL promotion or POC retirement. Stages 4–6 remain unauthorized. The wider D026 feature freeze remains active outside that bounded work. Production deployment remains deferred. Stage 3 acceptance does not reopen or supersede D027.

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
| 4 | NLL knowledge → Neutral Lesson Package assembly | **Not authorized** |
| 5 | Neutral Lesson Package → Chalkie adapter | **Not authorized** |
| 6 | Broader coverage and enrichment | **Not authorized** |

---

## Stage 3 — NLL summaries → teacher activity cards

**Authorization status:** Bounded default-off comparison **complete and owner-accepted**. Authenticated smoke matrix passed. Does **not** make NLL summaries available for normal use; nine summaries remain `hidden` + `experimental`; POC remains. Not NLL promotion / not POC retirement. No Stage 4–6 authorization. No deployment.

| Field | Detail |
|---|---|
| **Scope** | BE3 U8 Opener nine activities only (`be3_sb_wb_rel_u08_opener_sb128-129_wb104-105`) |
| **Existing path preserved** | POC summaries via `getBe3U08ActivitySummary` / `getBe3U08WbActivitySummary` in `be3U08ActivityEnrichmentPoc.ts`; current card/selection UX |
| **Local connection** | `nllCardComparison.ts` → `subscribeNllCardComparisonLifecycle` + `loadNeutralLessonComponent('be3-u08-opener', { includeHiddenExperimental: true })` once per eligible overlay/scope (single-flight under React Strict Mode); `TeacherChoiceFlowOverlay` + modal `ActivityEvidenceCard` side-by-side POC/NLL with `· experimental` labels. No fingerprint reconstruction / no staleness chrome in this slice |
| **Flag** | `VITE_CHALKIE_NLL_CARD_COMPARISON` — activity-card comparison only; **default off**. Independent of enrichment POC, `VITE_CHALKIE_NLL_SHADOW_PILOT`, and Opener/Story canaries |
| **Hidden-summary rule** | All nine pilot summaries remain `hidden` + `experimental`. Do **not** promote any row to `available`. `includeHiddenExperimental: true` only inside the controlled comparison path |
| **Fallback** | Existing POC remains the functional fallback and comparison companion until replacement is accepted |
| **Acceptance gates** | NLL cards preserve source boundaries; accurately describe activities (content review); preserve teacher activity selection; do not lose useful POC functionality; fail or fall back honestly when NLL data is unavailable. Functional and content review both required |
| **Rollback** | Flag off → prior POC / publisher-evidence behavior; no DB visibility mutation |
| **Non-goals** | Promoting summaries; bulk books; handoff/adapter changes; Stage 4–6 work |
| **Owner decisions pending** | Content acceptance of nine summaries for any future normal-use promotion; when POC display may retire; whether to authorize Stages 4–6 |

---

## Stage 4 — NLL knowledge → Neutral Lesson Package assembly

**Authorization status:** Not authorized.

| Field | Detail |
|---|---|
| **Scope** | Opener first; Story only after Opener accepted |
| **Existing path preserved** | `buildNeutralSbWbLessonPackage`; D022 BI / evidence boundaries; selection and companion rules |
| **Proposed connection** | Attach NLL preferred summaries as labelled derived fields (not `[SB]`/`[WB]` evidence); proposed SS links stay non-authoritative |
| **Acceptance gates** | Package builds with/without NLL; exclusions still omit activities; publisher evidence unchanged; functional enrichment only |
| **Rollback** | Assemble without NLL-derived fields |
| **Non-goals** | Treating NLP as reusable library; Chalkie default-path change; visibility promotion |
| **Owner decisions** | Persist NLP snapshots now or later; derived field names |

---

## Stage 5 — Neutral Lesson Package → Chalkie adapter

**Authorization status:** Not authorized.

| Field | Detail |
|---|---|
| **Scope** | One accepted relationship first (Opener) |
| **Existing path preserved** | Bespoke handoffs as fallback; Opener/Story canary wrappers (`buildBe3U08OpenerSbWbSeriesHandoffWithNeutralCanary`, `buildBe3U08StorySbWbSeriesHandoffWithNeutralCanary`) and mismatch diagnostics |
| **Proposed connection** | NLP → `renderChalkieFromNeutralPackage` |
| **Acceptance gates** | Functional replacement for all-selected and key exclusion cases; no reconstruction of unchecked activities; Create-a-prompt completes; not perfect AI prose |
| **Rollback** | Bespoke default path |
| **Non-goals** | Multi-platform adapters; OpenAI revive; classroom-validation claims |
| **Owner decisions** | Default-on vs flag; Story sequencing; when bespoke may archive |

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
- [`../5-progress.md`](../5-progress.md) — current freeze / status  
