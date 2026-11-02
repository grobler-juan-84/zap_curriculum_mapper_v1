# NLL/NLP Inspector — Architecture Note v0.1

**Status:** ACTIVE
**Version:** 0.1
**Date:** 2026-11-02 (Priority 3 Inspector authoritative staleness; prior contract/tooling/Vite notes retained)
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

**Excluded glossary:** report `excludedByTeacher` / “Teacher-excluded” means currently **unselected** in the Create-a-prompt handoff (`!selected`). It is not a separate intentional-exclusion event log.

**Provenance termination:** when NLP assembly is `unavailable` (genuine SB-only / no supported companion package), Section F states that lineage terminates at teacher selection — `nlp=false` is not missing NLL knowledge.

**Adapter/consumer stub:** report field `adapterOrConsumerInclusion` is reserved and currently always `not_in_scope` (Inspector does not probe Stage 4 GLP or other adapters).

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

## Staleness (Inspector Priority 3)

- Authoritative fingerprint remains `fingerprintCanonicalActivity` over the **full** canonical activity object (`stableCanonicalJson` → SHA-256 lowercase hex).
- Helper `buildCurrentActivitySha256ById` fingerprints already-loaded SB/WB canonical raw by `activity_id` and omits unresolved/failed IDs (fail closed per activity).
- **Inspector path (Step 453):** Workspace passes already-loaded canonical raw into Create-a-prompt; overlay builds the hash map and forwards it to `loadNeutralLessonComponent` via `currentActivitySha256ById`. Match → `current`; mismatch → `potentially_stale` (warn only); missing → `unverifiable`.
- Modal summary / Stage 4 / adapters are **unchanged** in this slice and still omit the map → their loads remain `unverifiable` unless separately authorized later.
- Staleness stays independent of selection, NLP inclusion, review_state, evidence sufficiency, and Values SB-only / NLP-unavailable status.
- No summary prose, stored hashes, preferred versions, or review states are written during inspection.
- Admin-facing note: `unverifiable` means an authoritative **current** activity hash was not available for that activity — it is **not** itself proof that NLL content is stale.

---

## Authoritative reuse

| Concern | Function |
|---|---|
| NLL load | `loadNeutralLessonComponent` (same as Create-a-prompt summaries / Stage 4) |
| Current activity fingerprints | `buildCurrentActivitySha256ById` + `fingerprintCanonicalActivity` (Inspector-supplied map only in Step 453) |
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

## Cross-PC focused verification

After `git pull`, use the repository-managed `app` toolchain (pinned `tsx` in `app/package.json` / `app/package-lock.json`). Do not rely on temporary `npx` installs or copied `node_modules`.

```powershell
npm ci --prefix app
npm --prefix app run test:inspector
```

These are the standard cross-PC setup and focused Inspector verification commands (Work / Home / School / Cursor / ChatGPT Desktop). Environment files remain machine-local and are not transferred via Git.

---

## Verification log

### 2026-11-02 — Priority 3 Inspector authoritative staleness (Step 453)

**Scope:** Inspector-only read-only current-hash supply. No summary/DB/migration/adapter/GLP/modal-summary changes.

- Workspace → overlay canonical raw → `buildCurrentActivitySha256ById` → Inspector → existing `resolveStaleness`.
- Grammar + Values regressions on tracked fixtures under `scripts/fixtures/nll-staleness/`.
- Fixture integrity: each of the **13** tracked activities asserts `fingerprintCanonicalActivity(fixture) ===` literal `activity_sha256` pins from `20261030160000` (Grammar 10) and `20261030220000` (Values 3). Mocked stored hashes use those migration pins; current hashes are computed separately from fixtures.
- Focused suite: `nllNlpInspector.test.ts` **13/13**; loader pilot **7/7**; typecheck exit 0.

### 2026-11-02 — Cross-PC Inspector test runner tooling

**Scope:** Pin `tsx` under `app` and standardize focused Inspector verification. No application/contract behavior change.

- Added pinned `tsx` devDependency + `npm --prefix app run test:inspector`.
- Documented standard commands: `npm ci --prefix app` then `npm --prefix app run test:inspector`.
- Verification: focused suite **9/9** via repository-managed script.

### 2026-11-02 — Contract slice (Grammar fixture + wording)

**Scope:** Authorized smallest contract slice after Grammar+Values inspection report — no SB-only NLP builder, no hash resolution, no GLP/adapter probing.

- Added Grammar Inspector regression (SB 136–137 / WB 111–112; companion `be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112`; NLL `be3-u08-grammar`; config `sb_only` vs package `two_lesson_sb_wb`; WB `bep_3_wb_act_112_19` exclusion remains in NLL / absent from NLP + derivedKnowledge).
- Report Markdown clarifications: excluded=unselected glossary; staleness-unverifiable admin note; provenance termination when NLP unavailable; `adapterOrConsumerInclusion: not_in_scope` stub.
- Focused suite: `nllNlpInspector.test.ts` **9/9**.

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
- Extending authoritative current-hash supply beyond the Inspector (modal summaries / Stage 4 / adapters) — Inspector Priority 3 complete; other callers remain omitted until separately authorized.
- Separating teacher-friendly summary text from operational guardrails in NLL schema/content.
- Curriculum-agnostic component-key resolver beyond the shared BE3 U8 table (product work, not Inspector-only).
- True SB-only NLP builder (explicitly out of Inspector scope).
