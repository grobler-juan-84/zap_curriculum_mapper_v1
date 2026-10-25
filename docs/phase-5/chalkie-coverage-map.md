# Chalkie Coverage Map

**Status:** ACTIVE  
**Version:** 0.1  
**Purpose:** Answer at a glance: “What works where right now?” Claims come only from current app code, focused tests, and live fixture/companion data.

**School Notes:** deferred — not a live Chalkie product feature.

### Legend

| Status | Meaning |
|---|---|
| **Available** | Offered on this route today via the normal teacher-choice path. |
| **Verified special route** | Exact hard-wired / curated route (not the generic baseline). |
| **Conditional** | Offered only when verified evidence exists for that lesson (may be empty). |
| **Not available** | Not offered on this route today. |
| **Not verified** | Cannot be confirmed from current code/tests/fixture data. |

---

## Coverage table

| Book | Unit / pages | Student Book lesson | SB-only two lessons | Chalkie prompt | Detailed lesson plan | Workbook pairing | `[PRIOR]` | `[HM]` | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Any catalog SB | Ready verified page evidence (not an exact row below) | Available | Available | Available | Available | Not available | Conditional | Not available | **Generic Student Book baseline** when `status === 'ready'`. |
| BE2 SB | Unit 8 · pp.128–129 | Verified special route | Not available | Verified special route | Available | Verified special route | Not available | Verified special route | Fixture `isBe2U08PrototypeRoute`. Two-lesson = fixture SB→WB series. `[PRIOR]` empty; curated `[HM]` bank only. |
| BE3 SB | Unit 8 · pp.128–129 | Available | Not available | Verified special route | Available | Verified special route | Conditional | Not available | `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105` → WB 104–105. Mode `sb_wb`. |
| BE3 SB | Unit 8 · pp.130–131 | Available | Not available | Verified special route | Available | Verified special route | Conditional | Not available | `be3_sb_wb_rel_u08_story_sb130-131_wb106` → WB 106. Mode `sb_wb`. |
| BE3 SB | Unit 8 · pp.132–133 | Available | Available | Available | Available | Available | Conditional | Not available | `be3_sb_wb_rel_u08_lia_sb132-133_wb107-108` → WB 107–108. Companion UI; two-lesson mode `sb_only` (no opener/story series handoff). |
| BE3 SB | Unit 8 · pp.134–135 | Available | Available | Available | Available | Available | Conditional | Not available | `be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110` → WB 109–110. Companion UI; mode `sb_only`. |
| BE3 SB | Unit 8 · pp.136–137 | Available | Available | Available | Available | Available | Conditional | Not available | `be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112` → WB 111–112. Companion UI; mode `sb_only`. |
| BE3 SB | Unit 8 · pp.138–139 | Available | Available | Available | Available | Available | Conditional | Not available | `be3_sb_wb_rel_u08_culture_sb138-139_wb113-114` → WB 113–114. Companion UI; mode `sb_only`. |
| BE3 SB | Unit 8 · p.140 | Available | Available | Available | Available | Available | Conditional | Not available | `be3_sb_wb_rel_u08_writing_sb140_wb115` → WB 115. Companion UI; mode `sb_only`. |
| BE3 SB | Unit 8 · p.141 | Available | Available | Available | Available | Available | Conditional | Not available | `be3_sb_wb_rel_u08_phonics_sb141_wb116` → WB 116. Companion UI; mode `sb_only`. |
| BE3 SB | Unit 8 · p.142 | Available | Available | Available | Available | Not available | Conditional | Not available | No entry in `CURATED_VERIFIED_SB_WB_COMPANIONS` (Values). |
| BE3 SB | Unit 8 · p.143 | Available | Available | Available | Available | Available | Conditional | Not available | `be3_sb_wb_rel_u08_review_sb143_wb117` → WB 117. Companion UI; mode `sb_only`. |

---

## Sources for special-route claims

| Exact route | Source files / tests |
|---|---|
| Generic ready baseline (`sb_only` when not opener/story/BE2) | `app/src/features/chalkie/resolveChalkieLessonContext.ts`; `scripts/tests/sbOnlyTwoLessonPackaging.test.ts` |
| Chalkie prompt + detailed lesson plan | `buildChalkiePromptPreview.ts`; `buildDetailedGeneralLessonPlan.ts`; `scripts/tests/buildDetailedGeneralLessonPlan.test.ts` |
| BE2 SB U8 pp.128–129 fixture + `[HM]` | `teacherChoicePrototypeContent.ts`; `resolveChalkieLessonContext.ts` (BE2 branch); `curatedHorizontalMappingEntries.ts` (`BE2_U08_CURATED_HORIZONTAL_MAPPING_ENTRIES` only entries in product store) |
| BE3 opener pp.128–129 → WB 104–105 | `verifiedSbWbCompanions.ts` (`BE3_U08_SB128_129_WB104_105`); `buildBe3U08OpenerSbWbSeriesHandoff.ts`; `scripts/tests/buildBe3U08OpenerSbWbSeriesHandoff.test.ts` |
| BE3 story pp.130–131 → WB 106 | `verifiedSbWbCompanions.ts` (`BE3_U08_SB130_131_WB106`); `buildBe3U08StorySbWbSeriesHandoff.ts`; `scripts/tests/buildBe3U08StorySbWbSeriesHandoff.test.ts` |
| BE3 LiA pp.132–133 → WB 107–108 | `verifiedSbWbCompanions.ts`; `scripts/tests/resolveVerifiedSbWbCompanion.test.ts`; `scripts/tests/sbOnlyTwoLessonPackaging.test.ts` (`sb_only` + companion id) |
| BE3 CLIL/P.E. pp.134–135 → WB 109–110 | `verifiedSbWbCompanions.ts`; `scripts/tests/resolveVerifiedSbWbCompanion.test.ts` / opener packaging tests (`sb_only`) |
| BE3 Grammar pp.136–137 → WB 111–112 | `verifiedSbWbCompanions.ts`; same companion / packaging tests |
| BE3 Culture pp.138–139 → WB 113–114 | `verifiedSbWbCompanions.ts`; same companion / packaging tests |
| BE3 Writing p.140 → WB 115 | `verifiedSbWbCompanions.ts`; same companion / packaging tests |
| BE3 Phonics p.141 → WB 116 | `verifiedSbWbCompanions.ts`; same companion / packaging tests |
| BE3 Values p.142 (no WB) | `verifiedSbWbCompanions.ts` (`CURATED_VERIFIED_SB_WB_COMPANIONS` omits 142); companion tests asserting `workbookCompanion === null` |
| BE3 Review p.143 → WB 117 | `verifiedSbWbCompanions.ts`; same companion / packaging tests |
| `[PRIOR]` conditional | `buildSameUnitPriorLearningCandidates.ts` + assemble wiring in `resolveChalkieLessonContext.ts` |
| `[HM]` only BE2 U8 pp.128–129 | `curatedHorizontalMappingEntries.ts` (`ALL_CURATED_HORIZONTAL_MAPPING_ENTRIES`) |
