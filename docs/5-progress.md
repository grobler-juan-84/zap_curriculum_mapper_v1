# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 390
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D027** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters. Stage 3/4/5/6A work does not reopen D027.
- **D024 / D025 NLL pilot complete on `main`:** Opener migration applied; persistent seed and RLS verified.
- **D026 Batch 0** and audit evidence are on `main`. Stage 1–2 docs (D027 + roadmap) recorded.
- **Stages 3–5 complete (bounded):** owner-accepted default-off Opener pilots on `main`; undeployed/unpromoted. Opener summaries remain `hidden` + `experimental`.
- **Stage 6A complete and owner-accepted:** BE3 U8 Story NLL knowledge live at totals **2 / 14 / 14 / 3** (`be3-u08-story` draft; five preferred v1 summaries `hidden`/`experimental`; one Structures link `proposed`; WB p.107 excluded). Migration `20261029180000` recorded as applied remotely via supported CLI repair. Opener remains **1 / 9 / 9 / 2**. No Stage 6B, promotion, or deployment.

## In progress

- Hold for any separately authorized Stage 6B Story adapter brief. Feature freeze otherwise holds outside bounded authorized work.

## Next

- Owner may separately authorize a Stage 6B implementation brief (Story NLL → selected NLP → Chalkie adapter). Until then: hold Stage 6B, promotion, deployment, POC/canary retirement, and broad `supabase db push`.
- Deferred audit risk: older local migrations still show empty remote history entries (including Opener `20261029120000`); not authorized in Stage 6A.

## Blocked

- Stage 6B, NLL promotion, and production deployment are not authorized.
- Broad `supabase db push` is not authorized.
- Wider D026 feature freeze remains active outside bounded authorized slices.

---

## Snapshot notes

- Active Git branch: `main`.
- Live NLL: Opener + Story = **2 / 14 / 14 / 3**; Story knowledge is live but remains hidden/experimental.
- Stages 3–5 remain default-off Opener adapter/UI pilots.
- `data/phase1/big_english_3_wb/canonical/v1.json` may exist locally under gitignored `data/phase1/`.
