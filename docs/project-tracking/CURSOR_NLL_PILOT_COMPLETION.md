# Cursor Task — Complete the BE3 Unit 8 NLL Pilot

**Status:** COMPLETE (migration applied; persistence/RLS verified; committed and pushed)
**Date:** 2026-10-29
**Branch:** `main`

## Objective

Complete the already implemented local BE3 Unit 8 Neutral Lesson Library pilot, verify its persistent Supabase behavior, then commit and push the finished work. Do not add features, deploy, modify canonical curriculum data, or broaden the pilot.

Founding principle:

> A modular, additive knowledge library built on a trusted curriculum foundation. The foundation guides. The library grows. Individual knowledge improves. Everything else keeps working. Beauty in simplicity.

## Current verified state

- Migration exists but is unapplied: `supabase/migrations/20261029120000_create_nll_pilot.sql`.
- Local implementation includes the four-table schema, bounded seed, read-only retrieval, default-off shadow package, tests, and documentation.
- Seven focused NLL tests passed; app TypeScript validation and the existing SS regression suite passed.
- Expected seed: 1 component, 9 activity memberships, 9 hidden experimental summaries, and 2 proposed SS links.
- Authoritative remote source objects were read and hash-verified. No canonical SS/SB/WB or Storage object was changed.
- This work PC lacks a local BE3 WB canonical working copy. Six older WB-dependent regression checks therefore cannot start locally. Record this limitation; do not reconcile or copy unrelated data.
- The working tree intentionally contains the uncommitted NLL pilot and documentation changes. Preserve them and inspect the full diff before committing.

## Exactly three steps

### Step 1 — Apply the Supabase migration

Migration: `supabase/migrations/20261029120000_create_nll_pilot.sql`

1. Confirm the correct existing Supabase project and target database.
2. Review the migration for unintended changes.
3. Confirm it has not already been applied.
4. Apply it using an existing authorized connection.
5. Preserve every canonical SS/SB/WB object and all Storage objects.

If the connection or target cannot be established safely, stop and report the blocker. Do not create a Supabase project or invent credentials.

### Step 2 — Verify the persistent NLL

Run small, focused database smoke tests and verify:

| Record | Expected count |
|---|---:|
| `nll_components` | 1 |
| `nll_component_activities` | 9 |
| `nll_activity_summaries` | 9 |
| `nll_ss_component_links` | 2 |

Also confirm:

- `be3-u08-opener` is retrievable.
- All nine summaries resolve to the correct canonical activity identities.
- All summaries remain `display_status = hidden` and `review_state = experimental`.
- Both SS links remain `status = proposed` and are not returned as approved curriculum authority.
- Authenticated teachers can read according to RLS.
- Administrators can write according to RLS.
- Unauthorized teacher writes are rejected.
- Canonical SS/SB/WB data and Storage objects remain unchanged.

Keep testing bounded. Record the missing local WB working-copy limitation without expanding into data reconciliation.

### Step 3 — Commit and push

Only after Steps 1 and 2 succeed:

1. Review the complete Git diff.
2. Exclude credentials, temporary files, canonical datasets, and unrelated changes.
3. Commit the NLL pilot, tests, migration, and relevant documentation/status records.
4. Push to the intended existing branch without force-pushing.
5. Report the commit hash, branch, and push result.

Do not deploy. If any required step fails, stop and report the incomplete work without committing a false completion state.

## Completion gate and freeze

The NLL pilot is not complete until all three steps succeed and the results are reviewed.

After success, stop new feature development. Do not add NLL units, horizontal progression, teacher enrichment, presentation adapters, UI redesigns, or production NLL integration.

The next milestone is **Curriculum Mapper — Project Consolidation & Repository Audit**. Begin that future audit read-only. Audit first; delete second. Do not perform the audit or delete files within this task.

## Required report

Return:

- confirmed Supabase project/target;
- migration application result;
- exact database counts and RLS smoke-test results;
- canonical/Storage unchanged confirmation;
- focused test results and the local WB limitation;
- reviewed file list;
- commit hash, branch, and push result;
- any blocker or incomplete item.
