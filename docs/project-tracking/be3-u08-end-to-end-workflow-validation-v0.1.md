# BE3 Unit 8 — End-to-End Create-a-prompt Workflow Validation (v0.1)

**Status:** ACTIVE  
**Version:** 0.1  
**Date:** 2026-10-31  
**Scope:** Validation-only milestone for BE3 Unit 8 Create-a-prompt. Issue inventory before fixes.  
**Authority boundary:** No application/tests/migrations/canonicals/`.env.local` edits; no DB/Storage mutation; no promotion; no permanent flag-on; no deploy; no fixes; no commit/push; no next unit/book.

---

## 1. Checkpoint and automated-suite result

| Check | Result |
|---|---|
| Branch | `main` |
| HEAD | `0d135cda55b3245d3779f778f9131ae5f01f1630` |
| `origin/main` | `0d135cda55b3245d3779f778f9131ae5f01f1630` |
| Worktree (app/docs at start) | Clean for shipped Unit 8 checkpoint (only later untracked temp helper under `scripts/` appeared during this pass) |
| Migration history | **28 / 0 / 0** |
| Live NLL totals | **9 / 74 / 74 / 9** (components / activities / summaries / SS links) |
| Full Unit 8 automated suite (pre-fix) | **334 / 334** pass |
| Full Unit 8 automated suite (post-fix) | **343 / 343** pass (`tmp/e2e-u08-suite-postfix.txt`) |
| Full Unit 8 automated suite (SCOPE-01 residual) | **353 / 353** pass (`tmp/e2e-u08-suite-scope01.txt`) |

Checkpoint remains green. Pre-fix inventory was frozen before any product fixes; post-fix dispositions are appended below without deleting original evidence.

---

## 2. Validation environment and flag-control method

| Item | Detail |
|---|---|
| App | Vite `http://127.0.0.1:5173` (`app/`) |
| Auth | Existing signed-in teacher session (login wall present when cold) |
| Book | Big English 3 Student Book · Unit 8 Healthy Living |
| Flag control | **Process-level env only** at Vite launch (never wrote `.env.local`) |
| Flag-off session | All nine `VITE_NLL_CHALKIE_*_ADAPTER_PILOT` = `false`; both `VITE_CHALKIE_BE3_U08_*_NEUTRAL_CANARY` = `false` |
| Flag-on sample | Only `VITE_NLL_CHALKIE_ADAPTER_PILOT=true`; all other adapter flags false |
| Evidence dir | `tmp/e2e-evidence/` (gitignored); no credentials captured |
| Computer Use | Unavailable (`sidecar_unavailable`); IDE browser + CDP used instead |

**Note:** `app/.env.local` still contains `VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY=true`. Process env override was used for this session. Vite precedence should prefer process env; Step 4 still showed “Experimental Neutral Lesson Package projection” from the activity-enrichment / neutral projection UI even with canary forced false — treat as distinct from NLL adapter activation (see issues).

---

## 3. Flag-off baseline matrix

App-confirmed lesson identities (unit load / Next-two-pages / Go), not table trust alone:

| Lesson | App-confirmed SB scope | WB companion (app) | Create-a-prompt (flag-off) | Specialized adapter |
|---|---|---|---|---|
| Opener | pp.128–129 | Yes · WB 104–105 | Full series generate; Ref `be3-sb-wb-u08-p128-129-wb104-105` | Not activated |
| Story | pp.130–131 | Yes · WB p.106 only | Scope confirmed in walk; series path exercised later under opener-only flag | N/A (flag-off) |
| LiA | pp.132–133 | Yes | Scope confirmed | Not activated |
| CLIL/P.E. | pp.134–135 | Yes | Scope confirmed | Not activated |
| Grammar | pp.136–137 | Yes | Scope confirmed | Not activated |
| Culture | pp.138–139 | Yes | Scope confirmed | Not activated |
| Writing | p.140 | Yes | Scope confirmed | Not activated |
| Phonics | p.141 | Yes · WB 116 | Confirmed via Go (skipped by Next-two-pages — defect) | Not activated |
| Values | p.142 | **None** (no View Workbook) | Step **1 of 4** SB → prior → … (no WB step); Acts 36–38 on p.142 only | No specialized flag/path (D028) |
| Review | p.143 | Yes | Scope reachable via Go; not fully generated this pass | Not activated |

### Opener flag-off generate (control)

- SB Step 1: Activities 1–5 on 128–129 only (no adjacent leak).
- WB Step 2: pages 104–105 exact; default **0 of 4** selected; honest empty state.
- Series packaging available; Ref classic `be3-sb-wb-u08-p128-129-wb104-105`.
- Five artifacts populated; L2 with zero WB: “No Workbook activities were selected.”
- Artifact scan: no `be3-u08-opener` key, no BI prose, no answer dump; media honesty lines present.
- Step 4 showed “Experimental Neutral Lesson Package projection” + experimental AI summaries on cards (enrichment PoC UI — not NLL C-adapter).

---

## 4. Per-component flag-on matrix

| Component | Flag (alone) | Reach path | Ref | NLL on target | Isolation (Opener) | Selection modes | Verdict |
|---|---|---|---|---|---|---|---|
| Opener | OPENER | Unit load | `…p128-129-wb104-105` | yes | — | all / prior | PASS |
| Story | STORY | Next ×1 | `…p130-131-wb106` | 4 | nll=0 opener | all/partial/dep/zero_wb | PASS |
| LiA | LIA | Next ×2 | `…p132-133-wb107-108` | 4 | nll=0 opener | all/partial/dep/zero_wb | PASS |
| CLIL/P.E. | CLIL_PE | Next ×3 | `…p134-135-wb109-110` | 4 | nll=0 opener | all/partial/dep/zero_wb | PASS |
| Grammar | GRAMMAR | Next ×4 | `…p136-137-wb111-112` | 4 | nll=0 opener | all/partial/dep/zero_wb | PASS |
| Culture | CULTURE | Next ×5 | `…p138-139-wb113-114` | 4 | nll=0 opener | all/partial/dep/zero_wb | PASS |
| Writing | WRITING | Next ×6 | `…p140-wb115` | 4 | nll=0 opener | all/partial/dep/zero_wb | PASS |
| Phonics | PHONICS | Go 141 (NAV-01 skip path noted) | `…p141-wb116` | 4 | nll=0 opener | all/partial/dep/zero_wb | PASS |
| Review | REVIEW | Go/focus 143 | `…p143-wb117` | 4 | nll=0 opener | all/partial/dep/zero_wb | PASS |
| Values | none | Next / Go 142 | generic `sb_only` | 0 | — | SB-only steps | PASS (D028) |

Evidence JSON under `tmp/e2e-evidence/flag-on-*-matrix.json`. “Book Intelligence” textarea hits are **false positives** (exclusion instruction: “Do not … quote … Book Intelligence”).

**ISSUE-COV-01:** closed — Story→Review independent flag-on browser matrices completed.

No component-specific data/package/renderer/adapter **blocker** appeared outside shared navigation/scope behavior. Safe to proceed with shared nav batch after freeze.

---

## 5. Selection-state coverage

| State | Where exercised |
|---|---|
| All SB selected | Every Story→Review flag-on matrix `all` mode |
| All WB selected | Every paired component `all` mode |
| Zero WB | Every paired component `zero_wb` mode (honest empty / guard text) |
| Partial | Every matrix `partial` mode |
| Dependency-sensitive exclusion | Every matrix `dependency` mode |
| Isolation | Unit 7→8 bounce; only target flag on → Opener classic path, nll=0 |

---

## 6. Five-artifact review findings

### Opener flag-off (WB zero)

| Artifact | Finding |
|---|---|
| Detailed handoff | Classic series; SB 128–129 / WB 104–105 scope; zero-WB honesty |
| L1 outline | Acts 1–5 + official audio cues |
| L1 vocabulary | Opener models present |
| L2 outline | Explicit empty WB slot |
| L2 vocabulary | “No Workbook activities selected.” |

### Opener flag-on (WB all)

| Artifact | Finding |
|---|---|
| Detailed handoff | SB + WB evidence; Live Right / Track 153; “do not invent lyrics or answer keys” |
| L1 / L2 outlines | Selected activities only; consolidation wording for L2 |
| Vocab | L1 opener models; L2 WB-attributable phrases |
| NLL / BI | No hidden NLL prose; no Book Intelligence |

### Story (opener flag on, story flag off)

| Artifact | Finding |
|---|---|
| Ref / pages | `be3-sb-wb-u08-p130-131-wb106`; Lesson 2 = WB **106 only** |
| L1 vocabulary | Honest absence of dedicated SB target list |
| Adapter leak | None from opener pilot |

---

## 7. Dependency / source-honesty findings

| Area | Observation |
|---|---|
| Opener media | Official book audio / Track 153 called out; no invented lyrics |
| Story asymmetric WB | Correctly WB p.106 only |
| Values | No WB action; 4-step flow; no specialized adapter |
| Phonics identity | p.141 + WB 116 confirmed when jumped directly |
| Review | p.143 reachable; anti-aggregation not re-probed in browser beyond suite |
| Answer language | Opener artifacts warn against inventing answer keys (boundary text, not dump) |
| Values UI cards | **Answer: healthy/unhealthy** visible in Create-a-prompt selection UI (see ISSUE-VAL-01) |

---

## 8. Fallback and stale-result findings

| Check | Result |
|---|---|
| Representative adapter | Review flag-on at p.143 |
| Force NLL fail | CDP `fetch` → 503 on `nll_components` (4 blocked) |
| Fallback | Classic series handoff still generated (~2581 chars); overlay not empty/stuck; Back cleared |
| Stale-result | Delayed NLL 2.5s → Cancel + unit bounce to Opener; stale did **not** reopen overlay; fresh Opener Ref `be3-sb-wb-u08-p128-129-wb104-105` |
| Evidence | `tmp/e2e-evidence/fallback-stale.json` |

---

## 9. Teacher-workflow assessment

*(Observations, not defects unless also listed in §10.)*

- Selection checkboxes and “N of M included” are generally understandable on Opener/Story.
- SB→WB split is clear when companion exists; Values correctly omits WB.
- Empty WB state is honest but easy to miss if teacher expects WB included by default.
- Five copy-ready artifacts are usable without internal IDs; Ref mono line is helpful, not noisy.
- Experimental AI summaries + “Neutral Lesson Package projection” add cognitive load on flag-off baseline (looks “specialized” even when NLL C-adapter is off).
- Next-two-pages skipping Phonics is high teacher friction for unit walkthroughs.
- Go-to-page fracturing opener into single-page scope drops companion until unit reselect — high friction.
- Sidebar still shows “Beehive 1 · pp. …” while Chalkie is on BE3 — confusing workspace chrome.
- Component-by-component flags create real validation/ops friction for book-scale migration (nine restarts for independent enable).

---

## 10. Complete prioritized issue inventory

### ISSUE-NAV-01 — Next-two-pages skips Phonics

| Field | Value |
|---|---|
| Component | Phonics / Writing→Values navigation |
| Selection / flag | N/A / flag-off |
| Severity | **high** |
| Layer | UI/workflow |
| Expected | After Writing p.140, next lesson is Phonics p.141 |
| Observed | Next-two-pages jumps **140 → 142** (Values), skipping 141 |
| Steps | Unit 8 opener → Next-two-pages repeatedly through Writing → observe landing |
| Evidence | CDP lesson walk rows in `tmp/e2e-evidence/page-matrix.json` |
| Blast radius | Any teacher walking Unit 8 linearly; Phonics easy to miss |
| Blocks book-scale? | Soft blocker for UX; not NLL data |
| Next investigation | `lessonAnchorPrintedPages` / next-spread logic for mixed 1-page vs 2-page components |

### ISSUE-NAV-02 — Navigation continues past Review

| Field | Value |
|---|---|
| Component | Unit boundary |
| Severity | **medium** |
| Layer | UI/workflow |
| Expected | Hard stop or clear end at Review p.143 |
| Observed | Continues to p.144 / p.146 still labeled Unit 8 evidence |
| Evidence | Same walk |
| Blocks book-scale? | Soft |
| Next investigation | Unit end clamp vs PDF page walk |

### ISSUE-JUMP-01 — Go collapses opener spread / drops companion

| Field | Value |
|---|---|
| Component | Opener (likely other 2-page lessons) |
| Severity | **high** |
| Layer | UI/workflow |
| Expected | Go 128 or 129 resolves opener lesson pp.128–129 + WB companion |
| Observed | Go 128/129 → single-page active lesson; View Workbook disappears until unit reselect restores spread |
| Evidence | Browser snapshots during Phase 1 |
| Blocks book-scale? | Soft–high for teacher jump UX |
| Next investigation | `resolveActiveLessonScope` vs Go printed-page path |

### ISSUE-SCOPE-01 — Outside-unit pages still tagged Unit 8

| Field | Value |
|---|---|
| Component | Unit evidence panel |
| Severity | **medium** |
| Layer | UI/workflow (+ possibly canonical page→unit mapping display) |
| Expected | Pages outside 128–143 not presented as Unit 8 grounded evidence |
| Observed | p.146 still “Unit 8: Healthy Living” |
| Blocks book-scale? | Soft |
| Next investigation | Evidence banner unit resolution when PDF page leaves unit |

### ISSUE-SEL-01 — Transient “0 of N activities included”

| Field | Value |
|---|---|
| Component | Multiple (seen Opener single-page, Phonics, Values) |
| Severity | **medium** |
| Layer | UI/workflow |
| Expected | Stable default inclusion matching lesson cards |
| Observed | After some jumps, left panel shows `0 of N` then later recovers |
| Blocks book-scale? | Soft |
| Next investigation | Selection reconcile on scope change |

### ISSUE-VAL-01 — Values selection UI surfaces answer labels

| Field | Value |
|---|---|
| Component | Values |
| Selection | All SB |
| Flag | none (`sb_only`) |
| Severity | **medium** (teacher-facing; may be intentional for teachers — classify preference vs defect in fix pass) |
| Layer | UI/workflow (+ canonical item answers surfacing) |
| Expected | Create-a-prompt cards teach without dumping keyed answers into the selection chrome (or clearly gate answers) |
| Observed | Activity 36 lists `Answer: healthy/unhealthy` per item |
| Evidence | Values Step 1 snapshot |
| Blocks book-scale? | Soft; policy call |
| Next investigation | Card renderer fields for Values / answer-bearing activities |

### ISSUE-UX-01 — Flag-off still shows “specialized-looking” enrichment chrome

| Field | Value |
|---|---|
| Component | Opener (likely others with enrichment) |
| Flag | all adapters false |
| Severity | **low–medium** |
| Layer | UI/workflow |
| Expected | Flag-off baseline reads as generic `sb_only` |
| Observed | Experimental AI summaries + Neutral Lesson Package projection on Step 4 |
| Blocks book-scale? | Soft (teacher trust / training) |
| Next investigation | Separate enrichment PoC flags from NLL C-adapter mental model |

### ISSUE-UX-02 — Sidebar book chip stale vs Chalkie book

| Field | Value |
|---|---|
| Severity | **low** |
| Layer | UI/workflow |
| Observed | Sidebar “Beehive 1 · pp. …” while Chalkie series/book is Big English 3 |
| Next investigation | Shell workspace chip sync |

### ISSUE-PRIOR-01 — Prior skill page labels collapse to `pp.128-128`

| Field | Value |
|---|---|
| Component | Values prior step (also likely elsewhere) |
| Severity | **low** |
| Layer | UI/workflow |
| Observed | Suggestions show `Unit 08 pp.128-128` style |
| Next investigation | Page-range formatter for single-page priors |

### ISSUE-ENV-01 — Durable canary true in `.env.local`

| Field | Value |
|---|---|
| Severity | **low** (process override used; file not modified this pass) |
| Layer | infrastructure/configuration |
| Observed | `VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY=true` in `app/.env.local` |
| Next investigation | Owner decide whether local default should be false for validation hygiene (no change this pass) |

### ISSUE-COV-01 — Remaining one-flag-on browser matrices incomplete

| Field | Value |
|---|---|
| Severity | **high** → **closed** |
| Disposition | **fixed (validation coverage)** — Story→Review one-flag-on matrices completed; see §4 |
| Observed (original) | Only Opener independently flag-on + Story isolation under opener-only |
| Observed (later) | All eight remaining components completed with all/partial/dependency/zero_wb + isolation |

### Non-issues / preferences (explicit)

- WB defaulting to zero selected on Opener: appears designed; honest empty L2 — preference whether default should include WB.
- Values global activity numbers (36–38): grandfathered identity; preference only.
- “answer keys” phrase in Opener handoff boundaries: not a dump.

---

## 11. Patterns that repeat across components

1. **Mixed page-width lessons** (1-page Writing/Phonics/Values/Review vs 2-page spreads) stress Next/Go scope resolution.
2. **Companion availability is scope-fragile** — fracture the lesson pages and WB disappears.
3. **Enrichment PoC chrome** makes flag-off baselines look “pilot-specialized” even when NLL C-adapters are off.
4. **Asymmetric WB** (Story 106) works when scope is correct — good pattern for book migration.
5. **Component-flag architecture** forces many process restarts for true isolation testing — costly at book scale.

---

## 12. Lessons for lesson-by-lesson → book-by-book migration

- Do not scale Next/Go navigation bugs; they will multiply across 9 units × mixed layouts.
- Keep Values-like `sb_only` exceptions first-class in navigation and Create-a-prompt step counts.
- Separate **teacher-visible enrichment** from **NLL adapter pilots** in flags and UI copy before book rollout.
- Prefer one process-level flag harness / validation runner over nine manual Vite relaunches.
- Automated matrix (334) is necessary but not sufficient for teacher-workflow sign-off — navigation/selection chrome defects only appear in real UI walks.

---

## 13. Recommended fix order

1. **ISSUE-NAV-01** (Phonics skip) + **ISSUE-JUMP-01** (Go spread/companion) — highest teacher blast radius.  
2. **ISSUE-NAV-02 / ISSUE-SCOPE-01** — unit boundary honesty.  
3. **ISSUE-SEL-01** — selection reconcile on scope change.  
4. Complete **ISSUE-COV-01** remaining one-flag-on browser matrices (still validation-only).  
5. **ISSUE-VAL-01** policy + card surfacing.  
6. **ISSUE-UX-01 / PRIOR-01 / UX-02 / ENV-01** — polish and hygiene.  
7. Only then consider promotion/deploy/flag defaults (separately authorized).

---

## 14. Items explicitly deferred (pre-fix list; historical)

- ~~Independent browser flag-on matrices for Story→Review~~ → completed.  
- ~~Clean NLL failure fallback / stale-result~~ → completed under Review flag-on.  
- Values answer chrome (VAL-01), enrichment chrome (UX-01), sidebar chip (UX-02), prior formatting (PRIOR-01), `.env.local` canary (ENV-01).  
- Promotion, deployment, permanent flag-on, next unit/book.  
- Commit/push.

---

## 14b. UNIT 8 E2E ISSUE INVENTORY FROZEN BEFORE FIXES

`UNIT 8 E2E ISSUE INVENTORY FROZEN BEFORE FIXES`

Frozen after Story→Review flag-on matrices, fallback, and stale-result evidence.  
**Blocker check:** no component-specific data/package/renderer/adapter blocker outside shared navigation/scope. Shared nav batch authorized to proceed.

Shared fix targets at freeze: **NAV-01, JUMP-01, NAV-02, SCOPE-01, SEL-01**.

---

## 15. Shared navigation/scope fix batch (after freeze)

### Root causes

| Issue | Root cause |
|---|---|
| NAV-01 | PDF Next used fixed `+2` PDF pages, skipping one-page Phonics between Writing and Values |
| JUMP-01 | Go set active page but `resolveActiveLessonScope` did not expand single-page targets to curated full lesson pages/companion |
| NAV-02 | Next kept walking past Review with no unit-end clamp |
| SCOPE-01 | Outside-unit pages retained Unit 8 lesson evidence/selection |
| SEL-01 | Scope-change selection could apply default against empty/stale card frames and stick at `0 of N` |

### Implementation

- New `chalkieLessonNavigation.ts` — BE3 U8 lesson anchors from curated companions + Values companion-free allowlist
- `resolveActiveLessonScope` — `lesson_anchor` expansion
- `ValidationPdfPane` — host lesson Next/Prev/Go hooks; disable Next at unit end
- `ChalkieWorkspace` — lesson navigate, outside-unit evidence clear, selection pending-default

### Post-fix browser evidence (`tmp/e2e-evidence/postfix-nav-verify.json`)

- Linear walk: 128–129 → … → 140 → **141** → 142 → 143 → Next **disabled**
- Go 129/131/135 → full two-page lessons + WB companions
- Values Go 142 → no WB; Review 143 → WB; Go 144 → active cleared / no companion evidence pages
- Selection after Go no longer stuck with nav lock; pending-default waits for SB cards

### Dispositions

| Issue | Disposition |
|---|---|
| NAV-01 | **fixed** |
| JUMP-01 | **fixed** |
| NAV-02 | **fixed** |
| SCOPE-01 | **fixed** (residual title/SS chrome completed — see §15b) |
| SEL-01 | **fixed** (pending default until SB cards arrive; nav lock no longer freezes empty selection) |
| COV-01 | **fixed** (coverage) |
| VAL-01 / UX-01 / UX-02 / PRIOR-01 / ENV-01 | **deferred** (out of batch; not addressed in SCOPE-01 residual) |

Original pre-fix evidence retained above and in `tmp/e2e-evidence/`.

---

## 15b. Residual ISSUE-SCOPE-01 — unit title / SS chrome (completed)

### Root cause

Outside-unit pages already cleared lesson evidence/activities/companion, but grounded **Unit 8** chrome still came from:

1. `buildCurrentLessonContext` falling back to `summary.units[0]` for `unitLabel` / `unitView` / BI when `unitNumber` was omitted;
2. `curriculumAuthority` always resolving SS for the **selected** unit (`currentUnitNumber`), not the active printed page;
3. Left-panel evidence suffix appending `batch.label` (`Unit 8: Healthy Living`) whenever a batch remained selected.

### Fix (shared page→unit resolution)

- `resolveUnitForPrintedPage` / `resolveGroundedUnitChrome` in `chalkieLessonNavigation.ts` — catalog page ranges only; never invents a unit.
- `ChalkieWorkspace` — rebuilds Curriculum Authority from grounded chrome; clears selected-batch title chrome outside the selected unit; restores Unit 8 on re-entry.
- `currentLessonContext` — explicit `null` clears chrome; summary unit view only when unit numbers match; optional catalog `groundedUnitLabel` for other resolved units.
- `ChalkieLeftPanel` — still renders when `unitView` is cleared; suppresses Unit 8 evidence/batch suffixes outside grounded membership.

### Automated evidence

- Focused scope/nav/context tests: pass (includes Review 143 / outside 144+146 / re-enter / unresolved clear).
- Full Unit 8 matrix: **353 / 353** (`tmp/e2e-u08-suite-scope01.txt`).
- Typecheck pass; lint warnings only (pre-existing); `git diff --check` clean on touched code; encoding/secret scan clean.

### Browser evidence (`tmp/e2e-evidence/postfix-scope01-chrome.json`)

| Page | Result |
|---|---|
| Review p.143 | Unit 8 evidence + SS Healthy Living; Next disabled |
| p.144 | No Unit 8 grounded chrome; SS/evidence map to Unit 9 School Trips!; no Unit 8 batch suffix |
| p.146 | Same — Unit 9 chrome only; no View Workbook |
| Re-enter pp.128–129 | Unit 8 title + evidence + companion restored |
| Re-enter p.141 | Unit 8 title + evidence + companion restored |

### Remaining issue inventory (unchanged deferred set)

| Issue | Disposition |
|---|---|
| VAL-01 | deferred |
| UX-01 | deferred |
| UX-02 | deferred |
| PRIOR-01 | deferred |
| ENV-01 | deferred |

NAV-01, JUMP-01, NAV-02, SCOPE-01, SEL-01, COV-01 are **fixed**.

---

## 16. Final Git status

```text
Branch: main
HEAD: 0d135cda55b3245d3779f778f9131ae5f01f1630
```

Uncommitted: shared nav/scope + residual SCOPE-01 chrome code/tests + this report/trackers. **No commit/push performed.**

---

## 17. Explicit non-mutation confirmation

This combined validation + shared-nav + residual SCOPE-01 fix pass:

- did **not** mutate the database or Storage;  
- did **not** promote summaries/links or enable flags permanently;  
- did **not** deploy;  
- did **not** modify migrations, canonicals, or `.env.local`;  
- did **not** change feature-flag defaults;  
- did **not** commit or push;  
- did **not** begin another unit or book;
- did **not** address VAL-01, UX-01, UX-02, PRIOR-01, or ENV-01.

Temporary process env overrides and gitignored evidence under `tmp/e2e-evidence/` only. Credentials were not exposed in artifacts.
