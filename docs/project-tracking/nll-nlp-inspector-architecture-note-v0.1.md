# NLL/NLP Inspector — Architecture Note v0.1

**Status:** ACTIVE  
**Version:** 0.1  
**Date:** 2026-11-01 (audit hardening + local Vite verification same day)  
**Purpose:** Record inspect-first discrepancies, status taxonomy, packaging semantics, experimental-summary policy, staleness limits, authorization boundary, and verification posture for D029.

---

## Spec path mismatches

The original implementation prompt referenced:

- `Curriculum_Mapper_Project_SOT_v1.1.md`
- `Project_Records/README.md`, `Decision_Log.md`, `Validation_Log.md`, `Scope_and_Sequence_Discovery_Log.md`

Those paths **do not exist** in this repository. Live authority is:

- [`docs/4-decisions.md`](../4-decisions.md)
- [`docs/5-progress.md`](../5-progress.md)
- [`docs/8-database-architecture.md`](../8-database-architecture.md)
- [`docs/project-tracking/nll-pilot-architecture-v0.1.md`](./nll-pilot-architecture-v0.1.md)

---

## NLL vs NLP (actual meanings)

| Term | Meaning in this codebase |
|---|---|
| **NLL** | Persistent Neutral Lesson Library — `nll_*` tables / `loadNeutralLessonComponent` activity summaries |
| **NLP** | Ephemeral Neutral Lesson Package — `NeutralSbWbLessonPackage` from `buildNeutralSbWbLessonPackage` |

NLP is **not** a stored library. Create-a-prompt holds teacher selections in memory and assembles NLP for adapters.

---

## Authorization / read posture

- Trustworthy role: `profiles.role` (`teacher` \| `admin`).
- Catalog and NLL **SELECT** are already open to authenticated users; RLS admin-gates **writes**.
- The Inspector does **not** create a new privileged data channel beyond existing authenticated reads.
- **Product surface** dual gate:
  1. UI: `shouldShowNllNlpInspectorCard` / `isAdminProfile` (teachers keep ChatGPT placeholder).
  2. Trusted backend: `POST /api/nll-nlp-inspector/access` via `authorizeAdminBearerUser` — must succeed before report assembly runs in the overlay.
- v1 report Markdown is still assembled **client-side** with the same `buildNeutralSbWbLessonPackage` + `attachSelectedNllDerivedKnowledge` path as Stage 4 / GLP (no duplicate assembler). Full server-side report rendering is deferred (would require serializing the entire Create-a-prompt snapshot into Node).

---

## Environment availability (development vs production)

The NLL/NLP Inspector is currently an **administrator-only development feature**.

Its trusted authorization endpoint, `POST /api/nll-nlp-inspector/access`, is provided through the **Vite development server** (`nllNlpInspectorAccessPlugin`). A production API transport has **not** yet been selected or implemented.

Current behavior:

- The Inspector works in the supported local development environment.
- Administrator access is verified against `profiles.role === 'admin'`.
- Teachers cannot access the Inspector through its supported UI or development API.
- The authorization check **fails closed** if the endpoint is unavailable.
- A normal production build will **not** provide Inspector access until an equivalent production endpoint is implemented.

Before production release, the selected hosting architecture must provide an equivalent trusted route that validates the user session and administrator role.

This limitation affects **Inspector availability only**. It does not change NLL data, NLP assembly, teacher selections, General Lesson Prompt, or Chalkie behavior.

---

## Status taxonomy (independent dimensions)

Do **not** collapse these into a single “unverified” label:

| Dimension | Typical values | Answers |
|---|---|---|
| Source evidence verification | `human_verified`, … | Has underlying activity evidence been verified? |
| NLL summary `review_state` | `experimental`, `reviewed`, `teacher_corrected` | Has the derived summary completed review? |
| Evidence sufficiency | `sufficient`, `insufficient` | Is recorded evidence enough for the summary? |
| Staleness | `current`, `potentially_stale`, `unverifiable` | Can stored activity hash be compared to current? |

Section G uses precise kinds: `missing`, `excluded`, `unverified` (source only), `experimental`, `insufficient_evidence`, `stale`, `staleness_unverifiable`, `unavailable`, `untraceable`.

---

## Packaging terminology

| Field | Meaning |
|---|---|
| `twoLessonPackagingMode` / report “Source/configuration mode” | Create-a-prompt Chalkie Step 3 packaging: `sb_wb` (verified companion series) or `sb_only` (Student-Book-only split of the current spread). **Not** NLP `packaging.type`. |
| NLP `packaging.type` | Actual assembled package shape from `buildNeutralSbWbLessonPackage` (today `two_lesson_sb_wb` when a companion assembles). |

A Values lesson may show configuration `sb_only`, NLL loaded, selections present, and **NLP unavailable** — no fake companion is invented.

---

## Experimental summary policy (current behavior — preserved)

- Create-a-prompt / Stage 4 / GLP load NLL with `includeHiddenExperimental: true`.
- `attachSelectedNllDerivedKnowledge` attaches preferred summaries for **selected NLP activities** without filtering out `review_state=experimental` or `display_status=hidden`.
- Inspector reports that faithfully and does **not** invent a new eligibility gate.
- Product decision to filter experimental summaries from adapters remains a separate authorization.

---

## Staleness limitation

- `loadNeutralLessonComponent` only computes non-`unverifiable` staleness when `currentActivitySha256ById` is supplied.
- Default Inspector / Stage 4 loads do **not** supply current hashes → `staleness: unverifiable`, `currentActivitySha256: null`.
- Inspector preserves hashes and explains unverifiable comparison; it does not invent speculative current-hash lookups.

---

## Authoritative reuse

| Concern | Function |
|---|---|
| NLL load | `loadNeutralLessonComponent` (same as Create-a-prompt summaries / Stage 4) |
| Component key resolve | `resolveBe3U08NllActivitySummarySpec` (shared Create-a-prompt resolver; currently BE3 U8 keyed — not an Inspector-only table) |
| NLP assemble | `buildNeutralSbWbLessonPackage` |
| Derived knowledge attach | `attachSelectedNllDerivedKnowledge` |
| Prior support mapping | `mapTeacherInputsToOpenerPriorSupportForGeneralLessonPlan` |
| Selections | Current overlay in-memory `handoffActivitySelection` / `handoffWorkbookActivitySelection` |

Prior support remains an optional candidate pool; `priorSupportMayReplaceCurrentEvidence: false` is reported from NLP boundaries.

---

## Reuse mandate

Inspector report assembly must call the same NLP builder and NLL loaders used by Create-a-prompt. It must not invent a parallel selection or enrichment pipeline.

---

## Verification log

### 2026-11-01 — Local Vite smoke-check (revised scope)

**Environment:** `http://localhost:5173/` (Vite `npm run dev`). Production transport not tested (F027 deferred).

**Roles**

- Live teacher-session check: **Not performed — no separate teacher account is currently available or required.**
- Teacher access restrictions verified at this development stage via `isAdminProfile` UI tests, `authorizeAdminBearerUser` / access-handler rejection tests, and code inspection that the Inspector card renders only for `profiles.role === 'admin'`.
- Live administrator session verified.

**Admin access endpoint:** HTTP `200`, `allowed: true`, `role: admin`, `inspectorId: nll_nlp_inspector` (token not recorded).

**Phonics (SB 141 / WB 116):** NLL loaded (8); selected 7 / excluded 1 (WB Activity 30); NLP assembled `two_lesson_sb_wb`; derived summaries 7; WB 30 present in NLL/provenance with `selected=false`, `nlp=false`, Section G **Excluded**; absent from NLP selectedActivities and derivedKnowledge; `sb_only` configuration mode shown separately from assembled package type; `human_verified` + `experimental` not collapsed to source-unverified. Regenerating the report preserved the exclusion (read-only).

**Values (SB 142):** NLL `be3-u08-values` loaded (3); selections shown; NLP **unavailable** with companion/package explanation; Workbook pages `none`; no fake companion/package; selected activities `nlp=false`; unavailable not treated as missing curriculum content.

**Data mutation:** No curriculum/NLL/NLP/selection writes observed during report generation.

**Distinction:** Admin behavior was verified live in local Vite. Teacher access restrictions were verified through focused automated tests and code inspection; no separate live teacher account was available or required. Production transport remains deferred under F027.

**Status:** Verified for the supported development environment using live admin verification plus automated teacher-access coverage; production transport deferred.

---

## Deferred improvements

- **Production transport** for `POST /api/nll-nlp-inspector/access` (or equivalent) on the selected hosting architecture — required before production Inspector availability (see Environment availability).
- Server-side report assembly returning Markdown only after admin auth (optional hardening).
- Supplying authoritative current activity hashes into NLL load for real staleness classification.
- Separating teacher-friendly summary text from operational guardrails in NLL schema/content.
- Curriculum-agnostic component-key resolver beyond the shared BE3 U8 table (product work, not Inspector-only).
- True SB-only NLP builder (explicitly out of Inspector scope).
