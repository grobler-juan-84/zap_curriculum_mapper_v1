# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 416
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D028** are locked. D028 keeps Values as generic `sb_only`.
- **BE3 Unit 8 component pipeline** complete on `main` at `0d135cd` (Opener→Review A/B/C; Values generic).
- Live NLL **9 / 74 / 74 / 9**; history **28 / 0 / 0**.
- Unit 8 automated matrix **353/353** after residual SCOPE-01 grounded-chrome tests.
- **E2E Story→Review flag-on matrices completed**; inventory frozen; shared nav/scope batch complete including residual SCOPE-01 unit title/SS chrome.

## In progress

- None for the SCOPE-01 residual chrome fix (complete pending owner review).

## Next

- Owner review of frozen inventory + post-fix dispositions in [`project-tracking/be3-u08-end-to-end-workflow-validation-v0.1.md`](./project-tracking/be3-u08-end-to-end-workflow-validation-v0.1.md).
- Triage remaining deferred issues (VAL-01, UX-01/02, PRIOR-01, ENV-01) only when authorized.
- Hold promotion, deployment, permanent flag-on defaults, commit/push until requested.

## Blocked

- NLL promotion and production deployment are not authorized.
- Broader `supabase db push` / `--include-all` remain unauthorized.
- Wider D026 feature freeze remains active outside bounded authorized slices.

---

## Snapshot notes

- Active Git branch: `main` at `0d135cda55b3245d3779f778f9131ae5f01f1630` (uncommitted nav/scope + SCOPE-01 chrome + validation docs).
- Shared lesson-anchor navigation for BE3 U8: Next/Prev by lesson, Go expands full lesson + companion, Review end clamp, outside-unit evidence clear, grounded unit chrome from catalog page ranges.
- Default-off adapter flags retained; process-only overrides used during validation.
- Resolver default and failure fallback remain **`sb_only`**.
- Validation evidence under gitignored `tmp/e2e-evidence/`.
