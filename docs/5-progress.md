# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 417
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D028** are locked. D028 keeps Values as generic `sb_only`.
- **BE3 Unit 8 component pipeline** complete on `main` at `0d135cd`; nav/scope checkpoint `d27a9f3`.
- Live NLL **9 / 74 / 74 / 9**; history **28 / 0 / 0**.
- Unit 8 automated matrix **353/353** retained after UI polish.
- E2E inventory: NAV/JUMP/SCOPE/SEL/COV fixed; VAL-01 / UX-01 / UX-02 / PRIOR-01 fixed in polish batch.

## In progress

- None for this UI polish batch (complete pending owner review / commit authorization).

## Next

- Owner review of polish dispositions in [`project-tracking/be3-u08-end-to-end-workflow-validation-v0.1.md`](./project-tracking/be3-u08-end-to-end-workflow-validation-v0.1.md).
- Optional owner-local ENV-01 hygiene (`.env.local` canary) — process overrides remain the validation method.
- Hold promotion, deployment, permanent flag-on defaults, commit/push until requested.

## Blocked

- NLL promotion and production deployment are not authorized.
- Broader `supabase db push` / `--include-all` remain unauthorized.
- Wider D026 feature freeze remains active outside bounded authorized slices.

---

## Snapshot notes

- Active Git branch: `main` at `d27a9f3` with uncommitted UI polish changes.
- Selection cards hide keyed answers by default; enrichment POC relabelled separate from NLL; sidebar chip follows workspace book/pages; prior labels use `p.` / `pp.`.
- Default-off adapter flags retained; process-only overrides used during validation.
- Resolver default and failure fallback remain **`sb_only`**.
- Validation evidence under gitignored `tmp/e2e-evidence/`.
