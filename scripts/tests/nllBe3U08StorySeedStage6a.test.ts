/**
 * Focused Stage 6A Story seed-validation tests.
 * Does not rewrite the historical Opener NLL pilot suite.
 * Run: npx tsx --test scripts/tests/nllBe3U08StorySeedStage6a.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { assembleNeutralLessonComponent } from '../../app/src/features/nll/neutralLessonLibrary.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const STORY_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261029180000_seed_nll_be3_u08_story.sql',
)
const OPENER_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261029120000_create_nll_pilot.sql',
)

const STORY_COMPONENT_ID = '3e800008-0000-4000-8000-000000000002'
const STORY_LINK_ID = '3e800008-0000-4000-8000-000000000201'
const SUMMARY_IDS = [
  'big_english_3_sb_unit_08_activity_06_summary_stage6a_v1',
  'big_english_3_sb_unit_08_activity_07_summary_stage6a_v1',
  'big_english_3_wb_unit_08_p106_activity_5_summary_stage6a_v1',
  'big_english_3_wb_unit_08_p106_activity_6_summary_stage6a_v1',
  'big_english_3_wb_unit_08_p106_activity_tb_summary_stage6a_v1',
] as const
const MEMBERSHIPS = [
  ['bep3_sb_act_08_06', 1],
  ['bep3_sb_act_08_07', 2],
  ['bep_3_wb_act_106_5', 3],
  ['bep_3_wb_act_106_6', 4],
  ['bep_3_wb_act_106_tb', 5],
] as const
const SUMMARY_TEXTS = [
  'Students listen to Audio 154, read the story and answer whether Amy ate a healthy dinner.',
  "Students read the story and choose the correct option in six comprehension items about Amy's dinner.",
  "Students answer four questions about Amy's dinner using Yes, she did or No, she didn’t.",
  'Students draw, write and circle to say what they ate and drank for dinner yesterday and whether it was healthy.',
  'Students draw happy or sad faces to mark fries, lettuce, tomatoes, a bottle of cola, a burger and water as healthy or unhealthy.',
] as const

test('Story migration is additive, transactional, and collision-aborting', () => {
  const sql = fs.readFileSync(STORY_MIGRATION, 'utf8')
  const openerSql = fs.readFileSync(OPENER_MIGRATION, 'utf8')

  assert.match(sql, /^\s*begin;/m)
  assert.match(sql, /^\s*commit;/m)
  assert.doesNotMatch(sql, /on conflict/i)
  assert.match(sql, /precondition failed/i)
  assert.match(sql, /assertion failed/i)
  assert.match(sql, /be3-u08-story/)
  assert.match(sql, new RegExp(STORY_COMPONENT_ID))
  assert.match(sql, new RegExp(STORY_LINK_ID))
  assert.match(sql, /Structures/)
  assert.match(sql, /status = 'proposed'/)
  assert.match(sql, /display_status = 'hidden'/)
  assert.match(sql, /review_state = 'experimental'/)
  assert.match(sql, /activity_id like 'bep_3_wb_act_107_%'/)
  const membershipInsert = sql.slice(
    sql.indexOf('insert into public.nll_component_activities'),
    sql.indexOf('insert into public.nll_activity_summaries'),
  )
  assert.doesNotMatch(membershipInsert, /bep_3_wb_act_107_/)
  assert.doesNotMatch(sql, /create table/i)
  assert.doesNotMatch(sql, /alter table/i)
  assert.doesNotMatch(sql, /policy/i)

  // Opener migration remains the historical schema+seed authority and is untouched
  // by this additive Story file (content-identity check only).
  assert.match(openerSql, /be3-u08-opener/)
  assert.doesNotMatch(openerSql, /be3-u08-story/)
})

test('Story migration seeds exact memberships, summaries, hashes, and fingerprints', () => {
  const sql = fs.readFileSync(STORY_MIGRATION, 'utf8')

  for (const [activityId, position] of MEMBERSHIPS) {
    assert.match(
      sql,
      new RegExp(
        `'${STORY_COMPONENT_ID}', '${activityId}', ${position}`,
      ),
    )
  }
  for (const summaryId of SUMMARY_IDS) {
    assert.match(sql, new RegExp(`'${summaryId}'`))
  }
  for (const text of SUMMARY_TEXTS) {
    const escaped = text.replaceAll("'", "''")
    assert.ok(
      sql.includes(`'${escaped}'`),
      `missing approved summary text: ${text}`,
    )
  }

  assert.match(
    sql,
    /3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6/,
  )
  assert.match(
    sql,
    /811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa/,
  )
  assert.match(
    sql,
    /f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a/,
  )
  assert.match(
    sql,
    /86adac9865b348f5ba411fa8e06b5d0709ef5dc07308bb728d14e3d056ad5294/,
  )
  assert.match(
    sql,
    /e00ee160480815d08a47c8e7a0f8b764a44b6ae93667bada567831ecc1e16b4a/,
  )
  assert.match(
    sql,
    /bf1dc59eb81201fcd8331e514a00a76224db244deadaad84fccb6f8573f196a0/,
  )
  assert.match(
    sql,
    /b20d8761aca70074606754168633f972935b4382fe3c33aabfcc420ca13b57c5/,
  )
  assert.match(
    sql,
    /f003fe506715ec8f7606d00f1c2f15e0dcfb723fb788ddaf47594e42cc3faba8/,
  )
  assert.match(sql, /stage-6a-story-knowledge-prep-v0\.1/)
  assert.doesNotMatch(sql, /legacy_version/)
})

test('Story summaries stay hidden unless includeHiddenExperimental is enabled', () => {
  const component = {
    id: STORY_COMPONENT_ID,
    component_key: 'be3-u08-story',
    title: 'Big English 3 Unit 8 Story',
    status: 'draft' as const,
    created_at: '2026-10-29T00:00:00.000Z',
  }
  const memberships = MEMBERSHIPS.map(([activityId, position]) => ({
    component_id: STORY_COMPONENT_ID,
    activity_id: activityId,
    position,
  }))
  const summaries = SUMMARY_IDS.map((id, index) => ({
    id,
    activity_id: MEMBERSHIPS[index][0],
    version: 1,
    summary_text: SUMMARY_TEXTS[index],
    canonical_path:
      index < 2
        ? 'big-english/big_english_3_sb/canonical/v1.json'
        : 'big-english/big_english_3_wb/canonical/v1.json',
    canonical_sha256: 'a'.repeat(64),
    activity_sha256: 'b'.repeat(64),
    evidence_status: 'sufficient' as const,
    display_status: 'hidden' as const,
    review_state: 'experimental' as const,
    is_preferred: true,
    provenance: { prompt_version: 'stage-6a-story-knowledge-prep-v0.1' },
    created_at: '2026-10-29T00:00:00.000Z',
  }))
  const ssLinks = [
    {
      id: STORY_LINK_ID,
      component_id: STORY_COMPONENT_ID,
      ss_path: 'big-english/big_english_3_sb/canonical/ss_v1.json',
      ss_sha256:
        'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
      unit_number_raw: '8',
      column_order: 2,
      category_name_raw: 'Structures',
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
  assert.equal(
    normal.activities.filter((activity) => activity.preferredSummary).length,
    0,
  )
  assert.equal(normal.proposedSsLinks.length, 1)
  assert.deepEqual(normal.curriculumAuthorityLinks, [])

  const hidden = assembleNeutralLessonComponent({
    component,
    memberships,
    summaries,
    ssLinks,
    includeHiddenExperimental: true,
  })
  assert.equal(
    hidden.activities.filter((activity) => activity.preferredSummary).length,
    5,
  )
  assert.deepEqual(
    hidden.activities.map((activity) => activity.activityId),
    MEMBERSHIPS.map(([activityId]) => activityId),
  )
})
