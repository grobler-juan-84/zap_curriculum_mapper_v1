/**
 * Focused LiA-A Step B seed-validation tests.
 * Does not rewrite the accepted Opener or Story NLL suites.
 * Run: npx tsx --test scripts/tests/nllBe3U08LiaSeedStepB.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { assembleNeutralLessonComponent } from '../../app/src/features/nll/neutralLessonLibrary.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const LIA_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261029213000_seed_nll_be3_u08_lia.sql',
)
const OPENER_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261029120000_create_nll_pilot.sql',
)
const STORY_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261029180000_seed_nll_be3_u08_story.sql',
)

const LIA_COMPONENT_ID = '3e800008-0000-4000-8000-000000000003'
const LINK_IDS = [
  '3e800008-0000-4000-8000-000000000301',
  '3e800008-0000-4000-8000-000000000302',
] as const
const SUMMARY_IDS = [
  'big_english_3_sb_unit_08_activity_08_summary_lia_a_v1',
  'big_english_3_sb_unit_08_activity_09_summary_lia_a_v1',
  'big_english_3_sb_unit_08_activity_10_summary_lia_a_v1',
  'big_english_3_sb_unit_08_activity_11_summary_lia_a_v1',
  'big_english_3_sb_unit_08_activity_12_summary_lia_a_v1',
  'big_english_3_wb_unit_08_p107_activity_7_summary_lia_a_v1',
  'big_english_3_wb_unit_08_p107_activity_8_summary_lia_a_v1',
  'big_english_3_wb_unit_08_p108_activity_9_summary_lia_a_v1',
  'big_english_3_wb_unit_08_p108_activity_10_summary_lia_a_v1',
] as const
const MEMBERSHIPS = [
  ['bep3_sb_act_08_08', 1],
  ['bep3_sb_act_08_09', 2],
  ['bep3_sb_act_08_10', 3],
  ['bep3_sb_act_08_11', 4],
  ['bep3_sb_act_08_12', 5],
  ['bep_3_wb_act_107_7', 6],
  ['bep_3_wb_act_107_8', 7],
  ['bep_3_wb_act_108_9', 8],
  ['bep_3_wb_act_108_10', 9],
] as const
const SUMMARY_TEXTS = [
  'Students listen to Audio 155, look at two Did …? question-and-short-answer models and use the healthy-living phrase bank to make more.',
  'Students match five healthy-living phrase halves, make questions about yesterday and ask and answer them.',
  "Students complete four short dialogues with did or didn't.",
  'Students reorder words to make five questions about past activities, then ask them.',
  'Students match six Did …? questions to answers, then change the answers.',
  'Students listen to Audio 156 and place stickers to show what Grace and Carlos did on the weekend.',
  "Students complete two health-related dialogues with did or didn't.",
  'Students use the illustrations to circle the past activity that completes each of three sentences about yesterday.',
  'Students use the Activity 9 illustrations to answer seven Did …? questions with affirmative or negative short answers.',
] as const
const ACTIVITY_HASHES = [
  '724834079145d53b8f6084b74517b38e3c82aa6252f5aaae2502c2caabd8462f',
  '87a73133e696f67edbdb501a58dc6f0d8c30e45be39675df4d77a7da6a8309e9',
  '484f2a8af42268c5b9058ce265f3cfb30e6cf9b5f018b6940903099ffe5fe455',
  'f52de88e3b0e6c68d98a8df078a56100d71f7c380e43b197b9044be4a9fed757',
  '220f25dd6ef5fe5683bcb041d252eea726ecc79956ba0a0be278377f7a0c73ba',
  '8d87e2f39b1159ea9695a99ae3d862e0561abdfc6970d7d31e659bfaec835f1b',
  'b1031c028795146942e2cf08d03d8295d4f06d3b38505266b37b66e51daaef56',
  'd505b0b98e5f8bcf58dc392f6caaa54d82b165ba64983d3f7b68f45dbbe5dd73',
  'f8290f121ff0040d8657f3ca795ccbcf46abd9b7cd69758ae4e465055139ccba',
] as const

test('LiA migration is additive, transactional, and collision-aborting', () => {
  const sql = fs.readFileSync(LIA_MIGRATION, 'utf8')
  const openerSql = fs.readFileSync(OPENER_MIGRATION, 'utf8')
  const storySql = fs.readFileSync(STORY_MIGRATION, 'utf8')

  assert.match(sql, /^\s*begin;/m)
  assert.match(sql, /^\s*commit;/m)
  assert.doesNotMatch(sql, /on conflict/i)
  assert.match(sql, /precondition failed/i)
  assert.match(sql, /assertion failed/i)
  assert.match(sql, /expected approved NLL baseline 2\/14\/14\/3/)
  assert.match(sql, /expected post-insert totals 3\/23\/23\/5/)
  assert.match(sql, /be3-u08-lia/)
  assert.match(sql, new RegExp(LIA_COMPONENT_ID))
  for (const linkId of LINK_IDS) assert.match(sql, new RegExp(linkId))
  assert.match(sql, /Structures/)
  assert.match(sql, /I can\.\.\./)
  assert.match(sql, /status = 'proposed'/)
  assert.match(sql, /display_status = 'hidden'/)
  assert.match(sql, /review_state = 'experimental'/)
  assert.doesNotMatch(sql, /create table/i)
  assert.doesNotMatch(sql, /alter table/i)
  assert.doesNotMatch(sql, /policy/i)

  assert.match(openerSql, /be3-u08-opener/)
  assert.doesNotMatch(openerSql, /be3-u08-lia/)
  assert.match(storySql, /be3-u08-story/)
  assert.doesNotMatch(storySql, /be3-u08-lia/)
})

test('LiA migration contains the exact approved memberships, summaries, and source bindings', () => {
  const sql = fs.readFileSync(LIA_MIGRATION, 'utf8')

  for (const [activityId, position] of MEMBERSHIPS) {
    assert.match(
      sql,
      new RegExp(`'${LIA_COMPONENT_ID}', '${activityId}', ${position}`),
    )
  }
  for (const summaryId of SUMMARY_IDS) {
    assert.match(sql, new RegExp(`'${summaryId}'`))
  }
  for (const text of SUMMARY_TEXTS) {
    const escaped = text.replaceAll("'", "''")
    assert.ok(sql.includes(`'${escaped}'`), `missing approved summary: ${text}`)
  }
  for (const hash of ACTIVITY_HASHES) assert.match(sql, new RegExp(hash))

  assert.match(sql, /3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6/)
  assert.match(sql, /811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa/)
  assert.match(sql, /f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a/)
  assert.match(sql, /lia-a-step-a-knowledge-prep-v0\.1/)
  assert.doesNotMatch(sql, /legacy_version/)
})

test('LiA summaries remain hidden unless experimental knowledge is explicitly included', () => {
  const component = {
    id: LIA_COMPONENT_ID,
    component_key: 'be3-u08-lia',
    title: 'Big English 3 Unit 8 Language in Action',
    status: 'draft' as const,
    created_at: '2026-10-29T00:00:00.000Z',
  }
  const memberships = MEMBERSHIPS.map(([activityId, position]) => ({
    component_id: LIA_COMPONENT_ID,
    activity_id: activityId,
    position,
  }))
  const summaries = SUMMARY_IDS.map((id, index) => ({
    id,
    activity_id: MEMBERSHIPS[index][0],
    version: 1,
    summary_text: SUMMARY_TEXTS[index],
    canonical_path:
      index < 5
        ? 'big-english/big_english_3_sb/canonical/v1.json'
        : 'big-english/big_english_3_wb/canonical/v1.json',
    canonical_sha256: 'a'.repeat(64),
    activity_sha256: ACTIVITY_HASHES[index],
    evidence_status: 'sufficient' as const,
    display_status: 'hidden' as const,
    review_state: 'experimental' as const,
    is_preferred: true,
    provenance: { prompt_version: 'lia-a-step-a-knowledge-prep-v0.1' },
    created_at: '2026-10-29T00:00:00.000Z',
  }))
  const ssLinks = [
    {
      id: LINK_IDS[0],
      component_id: LIA_COMPONENT_ID,
      ss_path: 'big-english/big_english_3_sb/canonical/ss_v1.json',
      ss_sha256: 'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
      unit_number_raw: '8',
      column_order: 2,
      category_name_raw: 'Structures',
      status: 'proposed' as const,
      created_at: '2026-10-29T00:00:00.000Z',
    },
    {
      id: LINK_IDS[1],
      component_id: LIA_COMPONENT_ID,
      ss_path: 'big-english/big_english_3_sb/canonical/ss_v1.json',
      ss_sha256: 'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
      unit_number_raw: '8',
      column_order: 7,
      category_name_raw: 'I can...',
      status: 'proposed' as const,
      created_at: '2026-10-29T00:00:00.000Z',
    },
  ]

  const normal = assembleNeutralLessonComponent({
    component,
    memberships,
    summaries,
    ssLinks,
  })
  assert.equal(normal.activities.filter((activity) => activity.preferredSummary).length, 0)
  assert.equal(normal.proposedSsLinks.length, 2)
  assert.deepEqual(normal.curriculumAuthorityLinks, [])

  const hidden = assembleNeutralLessonComponent({
    component,
    memberships,
    summaries,
    ssLinks,
    includeHiddenExperimental: true,
  })
  assert.equal(hidden.activities.filter((activity) => activity.preferredSummary).length, 9)
  assert.deepEqual(
    hidden.activities.map((activity) => activity.activityId),
    MEMBERSHIPS.map(([activityId]) => activityId),
  )
})
