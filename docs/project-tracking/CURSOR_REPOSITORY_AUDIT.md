# Cursor Task — Read-Only Project Consolidation & Repository Audit

**Status:** APPROVED / DELEGATED / NOT YET COMPLETE
**Date:** 2026-10-29
**Starting commit:** `f8a86c73f074409e5a366a4881ed4118062a87e2`
**Branch:** `main`

## Objective

Conduct the first comprehensive, evidence-backed, read-only audit of the actual Curriculum Mapper repository. Identify genuine opportunities to reduce confusion and maintenance burden without losing operational features, canonical curriculum integrity, important decisions, or valuable experiment history.

Do not clean up anything. Audit first; delete second.

The D025 BE3 Unit 8 NLL pilot is complete. Feature development is frozen. The NLL adds a modular knowledge layer but does not automatically make earlier SB/WB builders, sidecars, packages, or experiments obsolete.

## Read-only boundary

You may inspect repository files, search references, trace imports, review tests and Git history, and run non-mutating diagnostics.

You must not:

- delete, move, archive, rename, or rewrite repository files;
- refactor application code;
- change dependencies, configuration, feature flags, prompts, or production behavior;
- modify Supabase tables, rows, policies, Storage objects, or canonical SS/SB/WB data;
- add features;
- commit, push, deploy, or begin cleanup work.

The only authorized new artifact is the audit report:

`docs/project-tracking/CURSOR_REPOSITORY_AUDIT_REPORT.md`

Do not update operating trackers, decisions, the documentation index, or other files. Clearly report this audit file as the sole change.

## Current invariants to protect

- Canonical SS authority and SB/WB publisher evidence remain immutable foundations.
- AI summaries and other NLL knowledge stay additive, attributed, and independently replaceable.
- D021 SB-first preparation and D022 Neutral Lesson Package boundaries remain active.
- The D024/D025 NLL pilot persists one BE3 U8 component, nine memberships, nine hidden experimental summaries, and two proposed SS links.
- Proposed SS links are not approved curriculum authority.
- Existing teacher-selection and production lesson-generation behavior must remain unchanged.
- No deployment or production NLL integration is authorized.
- The missing local BE3 WB canonical working copy on this PC is a known environment limitation; do not reconcile it during the audit.

## Audit scope

### A. Code, features, and experiments

Identify, with evidence:

- abandoned experiments or prototypes;
- unused components, hooks, utilities, services, scripts, and temporary artifacts;
- duplicate or competing implementations;
- old lesson-package builders and experimental pipelines;
- hardcoded proof-of-concept data that may be superseded;
- dead or overlapping feature flags;
- operational features and compatibility paths that must be preserved.

Do not infer that older SB/WB builders or experimental sidecars are obsolete merely because the NLL exists. Trace imports, callers, tests, flags, runtime paths, and documentation before classifying them.

### B. Documentation and AI instructions

Identify:

- outdated or contradictory architecture descriptions;
- duplicate documentation and competing sources of truth;
- historical experiment records that no longer describe current behavior;
- current instructions that could steer agents in the wrong direction;
- overlapping or conflicting Cursor rules and AI operating instructions;
- opportunities for a smaller authoritative documentation structure.

Preserve important decisions, audit evidence, and historical experiment value. Do not rewrite approved baselines.

### C. Architecture and dependencies

Examine:

- coupling among components, activities, summaries, canonical files, and package builders;
- duplicated curriculum data or redundant transformations;
- competing lesson-package assembly paths;
- old architecture that conflicts with the modular additive NLL;
- unnecessary abstraction layers and dependencies;
- places where complexity can be reduced safely.

Distinguish actual current problems from hypothetical future concerns. Do not recommend refactoring merely because another design is theoretically cleaner.

## Required evidence for each meaningful finding

| Field | Requirement |
|---|---|
| Location | Exact file or directory |
| Finding | What appears redundant, obsolete, conflicting, or confusing |
| Evidence | Imports, references, callers, tests, flags, Git history, or documentation |
| Recommendation | Keep / Consolidate / Archive / Delete |
| Confidence | High / Medium / Low |
| Risk | What could break or be lost if changed |

Classify by current relevance, not age. Do not manufacture findings for completeness. If usage cannot be established confidently, classify it as requiring investigation rather than unused.

## Required report structure

Write `docs/project-tracking/CURSOR_REPOSITORY_AUDIT_REPORT.md` with:

1. **Executive summary** — the few most important findings and overall repository health.
2. **Repository overview** — current application architecture and major directories.
3. **Code/features/experiments findings** — evidence-backed inventory.
4. **Documentation/instructions findings** — conflicts, duplication, and sources of truth.
5. **Architecture/dependencies findings** — real coupling and complexity issues.
6. **Cleanup priorities** grouped as Quick wins, Consolidation, High-risk, and Preserve.
7. **Documentation simplification proposal** — a small authoritative structure for architecture, status, decisions, and history.
8. **Reversible cleanup sequence** — a few bounded batches and the minimum regression tests for each.
9. **Owner decisions required** — only genuine product/history/risk choices.
10. **Audit limitations** — anything not verifiable from this checkout.

## Completion report

Return:

- path to the audit report;
- confirmation that it is the sole repository change from the audit;
- concise list of the highest-priority findings;
- diagnostics run;
- limitations and genuine owner questions;
- confirmation that no cleanup, database/Storage change, canonical edit, commit, push, or deployment occurred.

Stop after the report. ChatGPT Desktop will independently challenge the important findings before any cleanup is approved.
