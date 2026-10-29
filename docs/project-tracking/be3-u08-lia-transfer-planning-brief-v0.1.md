# BE3 Unit 8 Language in Action Transfer Planning Brief v0.1

**Status:** PLANNING ACCEPTED — LiA-A / LiA-B COMPLETE AND OWNER-ACCEPTED
**Version:** 0.1
**Date:** 2026-10-29
**Authority:** Owner-approved LiA planning direction; LiA-A and LiA-B completed and accepted separately; D022, D026 and D027 remain in force
**Implementation authorization:** LiA-A knowledge insertion and LiA-B non-serving package/renderer parity are complete and owner-accepted. LiA-C, feature flags, serving-path changes, deployment and promotion remain unauthorized. See [`be3-u08-lia-knowledge-review-v0.1.md`](./be3-u08-lia-knowledge-review-v0.1.md) and [`be3-u08-lia-neutral-package-renderer-parity-brief-v0.1.md`](./be3-u08-lia-neutral-package-renderer-parity-brief-v0.1.md).

---

## 1. Purpose

Plan the smallest careful extension after the two accepted reference implementations:

- Stage 5: BE3 Unit 8 Opener;
- Stage 6B: BE3 Unit 8 Story.

The next candidate is **Big English 3 Unit 8 Language in Action (LiA)**. The goal is not to copy Story mechanically. It is to preserve what is already proven, identify what LiA still lacks, and add only the layers required for this component.

The library grows. The package selects. The adapter generates. The teacher approves. The SS governs.

### Completion record

- **LiA-A:** complete and owner-accepted. The live component remains `draft`; nine summaries remain `hidden`/`experimental`; two SS links remain `proposed`.
- **LiA-B:** complete and owner-accepted. Exact neutral packaging and the five-artifact renderer are parity-proved, BI/NLL-absent and non-serving. Focused verification passed **27/27**, retained regressions **90/90**, and app typecheck passed.
- **Current serving:** unchanged at `sb_only`.
- **LiA-C:** remains a separate unauthorized adapter/integration gate.

Sections below preserve the planning rationale and gate design that governed the completed LiA-A/B work; their pre-implementation descriptions are historical context, not the current status.

---

## 2. Exact candidate scope

| Field | Boundary |
|---|---|
| Component | Big English 3, Unit 8, Language in Action only |
| Relationship | `be3_sb_wb_rel_u08_lia_sb132-133_wb107-108` |
| Stable reference | `be3-sb-wb-u08-p132-133-wb107-108` |
| Student Book | pp.132–133; page IDs `bep3_sb_p132`, `bep3_sb_p133` |
| Workbook | pp.107–108; page IDs `bep_3_wb_p107`, `bep_3_wb_p108` |
| Relationship status | Human-verified `workbook_practice_for`; docs-accepted and resolver-wired |
| Core language | Past simple questions and short answers with `Did …?`, `did`, and `didn't` |
| Adjacent exclusions | SB pp.130–131 Story; SB pp.134–135 CLIL/P.E.; WB p.106 Story; WB pp.109–110 CLIL/P.E. |
| NLL key | `be3-u08-lia` — live as `draft`; summaries hidden/experimental |

No other Unit 8 component, unit, book, enrichment type or adapter is included.

---

## 3. Verified publisher-evidence inventory

### Student Book — five activities

| Position | Activity ID | Page / activity | Source-grounded activity description |
|---:|---|---|---|
| 1 | `bep3_sb_act_08_08` | SB p.132 Act 8 | Listen to Audio 155, look at two `Did …?` sentence models and make more questions and short answers from the supplied healthy-living phrases. |
| 2 | `bep3_sb_act_08_09` | SB p.132 Act 9 | Match five phrase halves, make five questions about yesterday, then ask and answer using the model. |
| 3 | `bep3_sb_act_08_10` | SB p.133 Act 10 | Complete four short dialogues with `did` or `didn't`. |
| 4 | `bep3_sb_act_08_11` | SB p.133 Act 11 | Put words in order to make five past-simple questions, then ask them. |
| 5 | `bep3_sb_act_08_12` | SB p.133 Act 12 | Read and match six `Did …?` questions with their answers, then change the answers. |

### Workbook — four activities

| Position | Activity ID | Page / activity | Source-grounded activity description |
|---:|---|---|---|
| 6 | `bep_3_wb_act_107_7` | WB p.107 Act 7 | Listen to Audio 156 and use the stickers to show what Grace and Carlos did on the weekend. |
| 7 | `bep_3_wb_act_107_8` | WB p.107 Act 8 | Complete two health-related dialogues with `did` or `didn't`. |
| 8 | `bep_3_wb_act_108_9` | WB p.108 Act 9 | Look at the illustrations and circle the correct past activity and time phrase in three items. |
| 9 | `bep_3_wb_act_108_10` | WB p.108 Act 10 | Use the illustrations to answer seven `Did …?` questions with affirmative or negative short answers. |

All nine activities are `human_verified` in the canonical SB/WB evidence. The descriptions above are planning candidates for later content review; they are not approved NLL records.

### Evidence cautions

- WB Activity 7 depends on Audio 156, illustrations and physical stickers. A summary must not invent the missing audio sequence or sticker placements.
- WB Activities 9–10 depend on illustrations. Activity 10's answers are derived from those illustrations; the summary must not imply that all answers are independently present as text.
- SB Activity 8 depends on Audio 155 and its supplied phrase bank. Do not invent audio wording.
- Earlier Chalkie Experiments 11–13 are derived workflow evidence, not publisher requirements and not NLL source evidence.

---

## 4. SS authority alignment

Approved SS-V2 bytes remain pinned at Storage path `big-english/big_english_3_sb/canonical/ss_v1.json`, hash `f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a`. The local file with the same filename is legacy working evidence and must not silently replace the approved Storage pin.

Unit 8 is **Healthy Living**. Original publisher column order remains:

1. Vocabulary
2. Structures
3. CLIL/Culture
4. Writing
5. Phonics
6. Values / unlabeled `Get exercise.` entry
7. I can...

### Strong proposed links for later review

| Column | Proposed status | Rationale |
|---|---|---|
| Structures | `proposed` | Direct match to `Did (you) get enough sleep yesterday?` and `Yes, I did. / No, I didn't.` across SB and WB LiA practice. |
| I can... | `proposed` | Direct component-level match to `...ask and answer about activities in the past.` |

### Considered but withheld initially

| Column | Reason |
|---|---|
| Vocabulary | SB Activity 9 reuses the Healthy Living phrase set, but LiA's primary component purpose is structural ask/answer practice. Withhold until content review decides whether the overlap merits a component-level link. |
| CLIL/Culture, Writing, Phonics, Values | No defensible LiA-component alignment. |

These links would remain `proposed`; neither would become curriculum authority.

---

## 5. Existing functionality — preserve it

The following already exists and should not be rebuilt during planning:

1. `BE3_U08_SB132_133_WB107_108` is a human-verified curated companion in `verifiedSbWbCompanions.ts`.
2. The resolver enables **View Workbook** for the exact SB spread and exposes WB pp.107–108 only.
3. Activity Selection can represent SB and WB evidence separately.
4. The current two-lesson mode for LiA is deliberately `sb_only`; its generated handoff uses Student Book evidence only even though the Workbook companion is visible.
5. LiA has no accepted SB/WB series handoff, neutral SB/WB package configuration, neutral Chalkie renderer, canary or NLL adapter.
6. `buildNeutralSbWbLessonPackage` and `renderChalkieFromNeutralPackage` currently support only the accepted Opener and Story relationships.
7. Experiments 11–13 established a provisional source-controlled **single-lesson** workflow for SB pp.132–133, with teacher review required. They did not validate an SB→WB series.
8. Stage 5 Opener and Stage 6B Story remain the accepted reference implementations and must stay unchanged.

This gap means LiA cannot honestly jump straight to a Stage 6B-style NLL adapter.

---

## 6. Proposed minimal sequence

### LiA-A — Knowledge readiness

Steps A–B are complete:

1. verify the exact nine-activity inventory and source fingerprints;
2. review each candidate summary beside the canonical activity;
3. confirm evidence sufficiency, especially the audio/sticker/illustration-dependent Workbook activities;
4. verify the proposed component key and identifiers are unused;
5. review Structures and I can... SS links against the approved SS-V2 pin;
6. design additive hidden/experimental records and a Story-scoped-style rollback;
7. stop for owner approval before any persistent write;
8. execute the separately authorized collision-aborting transaction; and
9. verify the live 3 / 23 / 23 / 5 state and reconcile migration `20261029213000` as applied.

The inserted records remain `draft`, `hidden` and `experimental`; SS links remain `proposed`. LiA-A completion does not authorize LiA-B.

### LiA-B — Neutral package and renderer parity

Only after LiA-A content acceptance, decide and prove the delivery shape:

1. **Recommended shape:** two-lesson SB→WB series using the already verified 2→2 companion—Lesson 1 SB pp.132–133, Lesson 2 WB pp.107–108.
2. Preserve the current `sb_only` path as the default until the new relationship passes parity and manual acceptance.
3. Add the exact LiA relationship to the neutral package only; reject adjacent pages and unsupported relationships.
4. Build a LiA handoff/renderer contract for the existing five artifacts.
5. Prove all/partial/zero selection, teacher inputs, audio/sticker/visual dependency honesty and no reconstruction.
6. Use a separate default-off canary or shadow comparison before any NLL adapter routing.

This gate is new for LiA because Story already had these foundations before Stage 6B.

### LiA-C — NLL adapter integration

Only after LiA-A and LiA-B are separately accepted:

1. prepare a bounded implementation brief;
2. define one independent default-off rollout flag;
3. lazy-load `be3-u08-lia` for exact scope only;
4. attach selected summaries at package level only;
5. route the selected NLP through `renderChalkieFromNeutralPackage`;
6. preserve stale-result guards and the accepted LiA canary/current-path fallback;
7. complete automated and authenticated manual acceptance; and
8. keep deployment, promotion and legacy-path retirement separately gated.

Do not create the LiA adapter flag during LiA-A or LiA-B planning.

---

## 7. Acceptance gates

### Content

- Every summary states only what students do in verified evidence.
- No invented audio wording, sticker placement, illustration detail, script, answer or teaching procedure.
- Publisher evidence and derived summaries remain visibly separate.
- SS remains the curriculum authority; links remain proposed.

### Functional

- Exact 2→2 component relationship only.
- Correct nine activity memberships and stable source order.
- All/partial/zero selections preserve teacher choice.
- Key exclusions remove the activity from every artifact and never reconstruct it.
- Suggested key exclusions for later tests: SB Activity 8 and WB Activity 7, because they exercise audio/visual dependency boundaries.
- WB p.106 and pp.109–110 never enter the LiA package.
- Existing Opener and Story behavior remains unchanged.

### Operational

- Persistent records remain hidden/experimental; no normal exposure.
- Package/renderer and adapter controls remain default-off and independently reversible.
- Existing `sb_only` behavior remains the fallback until replacement is accepted.
- Rollback is component-scoped and does not touch Opener or Story.
- No deployment, promotion, POC/canary retirement or bulk Unit 8 migration.

---

## 8. D022 and knowledge boundaries

- The first LiA neutral-package slice should remain BI-absent, matching the narrow Story transfer boundary, unless the owner separately decides otherwise.
- Do not alter existing Opener BI behavior.
- NLL summaries remain package-only and do not become Chalkie prose.
- Same-unit prior-learning suggestions remain optional teacher choices and cannot replace current LiA evidence.
- Experiment-derived teaching advice remains outside the NLL activity-summary record set.

---

## 9. Risks and unresolved questions

1. **Delivery-shape decision:** current LiA two-lesson packaging is `sb_only`; the verified Workbook relationship does not yet authorize changing it to `sb_wb`.
2. **No parity baseline:** unlike Story, LiA has no accepted bespoke SB/WB series handoff or neutral renderer to compare.
3. **Media-dependent evidence:** Audio 155/156, stickers and illustrations limit what summaries and generated artifacts may claim.
4. **Activity 9→10 dependency:** WB Activity 10 relies on the Activity 9 illustrations; selection behavior must remain honest if one is unchecked.
5. **SS over-linking:** Vocabulary overlap is real but may not justify a component-level link; begin with the stronger Structures and I can... proposals.
6. **Historical experiments are not authority:** Exp 11–13 contain useful workflow lessons and known AI-generation errors, but must not seed publisher evidence.
7. **Complexity creep:** do not generalize all remaining Unit 8 components while proving LiA. One component, one gate at a time.

---

## 10. Explicit non-actions

This planning brief does not authorize further work beyond the separately approved LiA-A insertion:

- application, configuration, test, migration or seed changes;
- canonical SS/SB/WB changes;
- Supabase or Storage writes;
- further NLL record insertion or any visibility promotion;
- package, renderer, handoff, canary or adapter implementation;
- changing LiA from `sb_only` to `sb_wb`;
- Chalkie generation or classroom-validation claims;
- deployment;
- POC, Stage 5, Stage 6B, canary or bespoke-path retirement;
- CLIL, Grammar, Culture, Writing, Phonics, Values or Review expansion;
- broad `supabase db push`; or
- commit or push without separate approval.

---

## 11. Owner decisions

The next owner review should decide:

1. approve or revise the LiA-first planning direction;
2. accept the exact SB pp.132–133 → WB pp.107–108 scope;
3. formally accept the completed LiA-A Step B live state;
4. retain the recommended future two-lesson SB→WB shape as a hypothesis, not an implementation authorization; and
5. keep LiA-B and LiA-C separately gated.

Beauty in simplicity: establish trustworthy knowledge, prove one neutral package, then connect one adapter.

---

## 12. Related evidence

- [`nll-migration-roadmap-v0.1.md`](./nll-migration-roadmap-v0.1.md)
- [`stage-6b-story-adapter-implementation-brief-v0.1.md`](./stage-6b-story-adapter-implementation-brief-v0.1.md)
- [`../phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md`](../phase-5/chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md)
- [`../phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md`](../phase-5/chalkie-be3-u08-sb-wb-component-map-v0.1.md)
- [`../phase-5/chalkie-coverage-map.md`](../phase-5/chalkie-coverage-map.md)
- [`../phase-5/chalkie-single-lesson-experiments-11-13-results-v0.1.md`](../phase-5/chalkie-single-lesson-experiments-11-13-results-v0.1.md)
- [`../4-decisions.md`](../4-decisions.md)
