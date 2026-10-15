# General Curriculum Mapper — Todo



**Status:** ACTIVE  



**Version:** 1.0  



**Last updated:** Step 169



**Purpose:** Concrete near-term actionable tasks. Not a parking lot for long-term ideas (see [`7-future.md`](./7-future.md)).



---



## Done



- [x] Phase 1 PAUSED / D015–D016 recorded; BE1–BE6 COMPLETE.



- [x] Execute early Phase 2 LR experiments (U6–U8, BE1 U1) and preserve artifacts.



- [x] Run Phase 2 V3.1 independently on BE2-SB Units 1, 6, and 8.



- [x] Organize Phase 2 data under `data/phase2/big_english_2_sb/{interpretations,cross-unit}/`.



- [x] Validate true Cross-Unit V1.2 connections JSON.



- [x] Bounded U6 e2e teacher-brief and enrichment probes (research; not methodology locks).



- [x] Record D017 Progressive Curriculum Intelligence; align canonical docs and trackers.



- [x] Align legacy Phase 2 planning docs with D017 (`phase-2-overview-v2.md`, `data/README.md`).



- [x] Run BE2-SB Units 1–9 Phase 2 whole-book overview experiment (D017 v1 Markdown).



- [x] Relocate/refactor curriculum mapping process into project-wide workflow + Phase 1 extraction workflow.



- [x] Record ChatGPT owner review of BE2-SB U1–9 overview (not accepted; publisher comparison proposed).



- [x] Run D017 v2 second pass; owner approve v2 provisional baseline; park F017 / F018.



- [x] Generate BE1-SB and BE3-SB D017-pattern Book Intelligence overviews; run vertical sufficiency probe.



- [x] Diagnose BE3 overview vs publisher Scope & Sequence (Writing / LO gaps); no methodology change.



- [x] Test BE5 Book Intelligence overview **unchanged** (eight-column / Phase 1 only; S&S not consulted).



- [x] BE5 accepted as baseline stress test only (not approved curriculum overview).



- [x] BE3 Step 3 controlled A/B methodology refinement + partial publisher-reference comparison.



- [x] BE3 combined A+B overview + three-way comparison + owner-review pack.



- [x] Owner decision recorded: prefer BE3 A+B for BE3-SB only; no methodology/schema lock; BE2 v2 unchanged.



- [x] BE3 A+B regen full 9/9 roll-up; all PASS; discrepancies only.



- [x] BE3 Unit 1 A+B controlled-implementation compatibility assessment (read-only).



- [x] Define nine-column Book Intelligence UI data contract draft.



- [x] Create BE3 Unit 1 A+B JSON artifact conforming to draft BI contract.



- [x] Read-only TypeScript loader/validator + CLI for BE3 Unit 1 BI JSON (no UI/DB).



- [x] Read-only BE3 Unit 1 Book Intelligence UI preview (local JSON + loader; no DB/Storage).



- [x] Extend BI preview + JSON to BE3 Units 1–9 A+B (local only; no DB/Storage).



- [x] Visual/content QA of BE3 U1–9 BI preview vs A+B overview (fix U8 LO only; 9/9 PASS).



- [x] Upload BE3 U1–9 BI A+B JSON to Supabase Storage; verify integrity (no DB/UI wiring).



- [x] Switch BI preview to Storage JSON via existing loader (loading/error states; 9 units).



- [x] Integrate Book Intelligence into Series Library navigation (BE3-SB Storage overview).



- [x] Add BI page unit selector (U1–9 one at a time; fields/labels preserved).



- [x] Make BI selected unit URL-addressable (`?unit=`); refresh/share stable.



- [x] BI Unit 1 “View Source Evidence” → Phase 1 Validation (read-only).



- [x] Extend View Source Evidence to Units 2–9; verify correct Validation unit.



- [x] Validation “Back to Book Intelligence” preserves book + `?unit=N` (U1–U9 verified).



- [x] E2E UI acceptance Library → BI → Unit → Validation → Back (scripted PASS; Validation ?unit defects fixed).



- [x] Record D019 MVP acceptance milestone (implementation validated; methodology not locked).



- [x] BI preview split layout (fields left / source PDF right); preserve Storage + `?unit=` (UI-only).



- [x] Fix BI PDF navigation (unit jumps U1/U5/U9; Prev/Next/Go; no pane remount).



- [x] Sync BI unit with visible PDF pages (gaps → no BI; loop-safe; U3/U6/U9 transitions).



- [x] Fix Review1→U4 selecting Unit 1 (remove null-`?unit=` fallback; suppress PDF-driven jumps).



## Now



- [ ] Owner-gated follow-up only: `book_files`, more BI books, harden preview, pause, or other D017 next step.



## Soon



- [ ] Optional: restore original BE3 S&S PDF for fuller publisher check.



- [ ] Optional: supply BE5 publisher Scope & Sequence for deferred diagnostic.



- [x] Upload BE3-SB companion `ss_v1.json` to Storage (`big-english/big_english_3_sb/canonical/ss_v1.json`) without merging into SB `v1.json` or changing `dataset_versions`.



- [x] BE3 Unit 1 SS Writing + I Can dry check vs Control/A/B/A+B (findings only; no overview changes).



- [x] BE3 Unit 2 SS Writing + I Can dry check; A+B dual Pass again → expanded to U3/U5/U9 sample (no book-wide decision).



- [x] Finish BE3 SS Writing + I Can dry checks for Units 4 / 6 / 7 / 8; full 9/9 roll-up (A+B only dual Pass).



- [ ] Lightweight naming checks for books under new policy (legacy pilots exempt).



- [ ] Review post-form Storage measurements before cover thumbnails / PDF linearization.



## Deferred



- [ ] Teacher-readability validation via Chalkie workspace (deferred; not an active Phase 2 blocker).



- [ ] Owner review/accept of BE1/BE3/BE5 overviews as working baselines (separate from refine decision).



- [ ] Resume BH2 / RH2B / RH3A / RH4A Phase 1 pipelines only after explicit owner decision (D015).



- [ ] Any Phase 2 schema / methodology lock — only after explicit owner decision (D017).



- [ ] Phase 2 infrastructure (admin workspace, job queues, automation pipelines) — only when a real problem justifies it.



- [ ] Expand Phase 2 beyond Big English (Beehive / Reach Higher) — only after Big English progressive tests justify it.



- [ ] F017 / F018 Phase 1 extraction improvements — parked; do not implement without explicit owner approval.



---



## Maintenance



- Keep this list short and actionable.



- Move completed items off the list (progress belongs in [`5-progress.md`](./5-progress.md)).



- Park non-now ideas in [`7-future.md`](./7-future.md), not here.



- Keep [`project-tracking/4-mock-data-registry.md`](./project-tracking/4-mock-data-registry.md) current when mock vs live UI data changes.
