# General Curriculum Mapper — Progress

**Status:** ACTIVE
**Version:** 1.0
**Last updated:** Step 398
**Purpose:** Current project state. Read this first to understand where we are today.

---

## Done

- **Phase 1** remains paused at 14/18 COMPLETE (D015).
- **D017–D027** are locked. D021 keeps preparation SB-first; D022 keeps the Neutral Lesson Package as the durable handoff; **D027** locks SS/SB/WB → NLL → NLP → adapters. Stage 3/4/5/6A/6B work does not reopen D027.
- **D024 / D025 NLL pilot complete on `main`:** Opener migration applied; persistent seed and RLS verified.
- **D026 Batch 0** and audit evidence are on `main`. Stage 1–2 docs (D027 + roadmap) recorded.
- **Stages 3–5 complete (bounded):** owner-accepted default-off Opener pilots on `main`; undeployed/unpromoted. Opener summaries remain `hidden` + `experimental`.
- **Stage 6A complete and owner-accepted:** BE3 U8 Story NLL knowledge live at totals **2 / 14 / 14 / 3** (`be3-u08-story` draft; five preferred v1 summaries `hidden`/`experimental`; one Structures link `proposed`; WB p.107 excluded). Migration `20261029180000` recorded as applied remotely. Opener remains **1 / 9 / 9 / 2**.
- **Stage 6B complete and owner-accepted:** default-off `VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT`; automated **74/74**, typecheck pass, lint pass (pre-existing warnings only); authenticated manual acceptance passed. Undeployed/unpromoted. Stage 5 Opener and Stage 6B Story are the two accepted reference implementations.
- **LiA planning accepted:** exact BE3 U8 LiA scope SB pp.132–133 → WB pp.107–108 (`be3_sb_wb_rel_u08_lia_sb132-133_wb107-108`), nine verified activities; separate LiA-A / LiA-B / LiA-C gates.
- **LiA-A complete and owner-accepted:** `be3-u08-lia` is live as `draft` with nine ordered memberships, nine preferred v1 summaries `hidden`/`experimental`, and Structures + I can... links `proposed` (Vocabulary withheld). Totals are **3 / 23 / 23 / 5**; migration `20261029213000` is recorded as applied; focused Opener/Story-retaining verification passed **13/13**.
- **LiA-B complete and owner-accepted:** exact BI/NLL-absent neutral package for SB pp.132–133 → WB pp.107–108 plus a non-serving five-artifact renderer. Source-contract and reviewed-artifact parity passed; media dependencies remain honest; fail-closed identity checks and lesson-target provenance are covered. Focused verification passed **27/27**, retained regressions passed **90/90**, and app typecheck passed. Current serving remains `sb_only`; no flag, overlay/resolver wiring, deployment or promotion.

## In progress

- Finalize the owner-authorized combined LiA-A/LiA-B commit, push and work-PC handoff. Promotion, deployment, POC/canary retirement and broad `supabase db push` remain held.

## Next

- Resume from the handoff on the work PC. LiA-C adapter integration remains the next separate owner gate and is not authorized by LiA-A/B acceptance.
- Deferred audit risk: older local migrations still show empty remote history entries (including Opener `20261029120000`).

## Blocked

- NLL promotion and production deployment are not authorized.
- Broad `supabase db push` is not authorized.
- Wider D026 feature freeze remains active outside bounded authorized slices.

---

## Snapshot notes

- Active Git branch: `main`; pre-LiA accepted baseline `11215f83854a2d48166f9bbd63834fbc206e40d9`; the combined accepted LiA-A/LiA-B closeout is authorized for commit/push.
- Live NLL: Opener + Story + LiA = **3 / 23 / 23 / 5**; all summaries remain hidden/experimental and all SS links remain proposed.
- Stages 3–5 and Stage 6B remain default-off and undeployed.
- `data/phase1/big_english_3_wb/canonical/v1.json` may exist locally under gitignored `data/phase1/`.
