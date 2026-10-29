# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 394
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D027** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters. Stage 3/4/5/6A/6B work does not reopen D027.
- **D024 / D025 NLL pilot complete on `main`:** Opener migration applied; persistent seed and RLS verified.
- **D026 Batch 0** and audit evidence are on `main`. Stage 1–2 docs (D027 + roadmap) recorded.
- **Stages 3–5 complete (bounded):** owner-accepted default-off Opener pilots on `main`; undeployed/unpromoted. Opener summaries remain `hidden` + `experimental`.
- **Stage 6A complete and owner-accepted:** BE3 U8 Story NLL knowledge live at totals **2 / 14 / 14 / 3** (`be3-u08-story` draft; five preferred v1 summaries `hidden`/`experimental`; one Structures link `proposed`; WB p.107 excluded). Migration `20261029180000` recorded as applied remotely. Opener remains **1 / 9 / 9 / 2**.
- **Stage 6B complete and owner-accepted:** default-off `VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT`; automated **74/74**, typecheck pass, lint pass (pre-existing warnings only); authenticated manual acceptance passed (all/partial/zero, no reconstruction, p.107 excluded-scope only, five artifacts, no NLL/BI prose, Opener isolation, flag-off fallback, Story NLL **200**s for `be3-u08-story`). Temporary Vite stopped; `.env.local` unchanged. Undeployed/unpromoted. Stage 5 Opener and Stage 6B Story are the two accepted reference implementations.

## In progress

- Hold promotion, deployment, POC/canary retirement, and broad `supabase db push` unless separately authorized.

## Next

- Do not begin Stage 7 or expand beyond accepted Stage 5/6B reference implementations without new owner authorization.
- Deferred audit risk: older local migrations still show empty remote history entries (including Opener `20261029120000`).

## Blocked

- NLL promotion and production deployment are not authorized.
- Broad `supabase db push` is not authorized.
- Wider D026 feature freeze remains active outside bounded authorized slices.

---

## Snapshot notes

- Active Git branch: `main` (Stage 6B commit/push authorized with this acceptance).
- Live NLL: Opener + Story = **2 / 14 / 14 / 3**; Story knowledge remains hidden/experimental.
- Stages 3–5 and Stage 6B remain default-off and undeployed.
- `data/phase1/big_english_3_wb/canonical/v1.json` may exist locally under gitignored `data/phase1/`.
