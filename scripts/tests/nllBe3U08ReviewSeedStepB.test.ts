/**
 * Focused Review-A Step B seed-validation tests.
 * Run: npx tsx --test scripts/tests/nllBe3U08ReviewSeedStepB.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { assembleNeutralLessonComponent } from '../../app/src/features/nll/neutralLessonLibrary.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261030210000_seed_nll_be3_u08_review.sql',
)
const OPENER_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261029120000_create_nll_pilot.sql',
)
const STORY_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261029180000_seed_nll_be3_u08_story.sql',
)
const LIA_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261029213000_seed_nll_be3_u08_lia.sql',
)
const GRAMMAR_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261030160000_seed_nll_be3_u08_grammar.sql',
)
const CLIL_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261030170000_seed_nll_be3_u08_clil_pe.sql',
)
const CULTURE_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261030180000_seed_nll_be3_u08_culture.sql',
)
const WRITING_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261030190000_seed_nll_be3_u08_writing.sql',
)
const PHONICS_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261030200000_seed_nll_be3_u08_phonics.sql',
)

const COMPONENT_ID = '3e800008-0000-4000-8000-000000000009'
const OPENER_COMPONENT_ID = '3e800008-0000-4000-8000-000000000001'
const STORY_COMPONENT_ID = '3e800008-0000-4000-8000-000000000002'
const LIA_COMPONENT_ID = '3e800008-0000-4000-8000-000000000003'
const GRAMMAR_COMPONENT_ID = '3e800008-0000-4000-8000-000000000004'
const CLIL_COMPONENT_ID = '3e800008-0000-4000-8000-000000000005'
const CULTURE_COMPONENT_ID = '3e800008-0000-4000-8000-000000000006'
const WRITING_COMPONENT_ID = '3e800008-0000-4000-8000-000000000007'
const PHONICS_COMPONENT_ID = '3e800008-0000-4000-8000-000000000008'

const SB_CANONICAL_PATH = 'big-english/big_english_3_sb/canonical/v1.json'
const WB_CANONICAL_PATH = 'big-english/big_english_3_wb/canonical/v1.json'
const SB_CANONICAL_SHA256 =
  '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6'
const WB_CANONICAL_SHA256 =
  '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa'
const SS_SHA256 =
  'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a'

const MEMBERSHIPS = [
  ['bep3_sb_act_08_39', 1],
  ['bep3_sb_act_08_40', 2],
  ['bep3_sb_act_08_41', 3],
  ['bep_3_wb_act_117_31', 4],
  ['bep_3_wb_act_117_32', 5],
  ['bep_3_wb_act_117_33', 6],
] as const

type SummaryPayload = {
  readonly id: string
  readonly activityId: string
  readonly summaryText: string
  readonly canonicalPath: string
  readonly canonicalSha256: string
  readonly activitySha256: string
  readonly source: 'SB' | 'WB'
}

const ACCEPTED_SUMMARIES: readonly SummaryPayload[] = [
  {
    id: 'big_english_3_sb_unit_08_activity_39_summary_review_a_v1',
    activityId: 'bep3_sb_act_08_39',
    summaryText:
      'Students read and choose among Did, did, and didn\'t forms in four keyed items without reconstructing answers if the activity is excluded.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      '1bb4b39ff4529d1e95892cb9851498deb90cfcb1b3f55500a85fc991cdbf0dcf',
    source: 'SB' as const,
  },
  {
    id: 'big_english_3_sb_unit_08_activity_40_summary_review_a_v1',
    activityId: 'bep3_sb_act_08_40',
    summaryText:
      'Students run an open class survey with publisher Did you…? frames, complete initial prompt cues, and add two of their own questions, without inventing personal answers or requiring disclosure.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      'e7ac38891bbffc268882cfd01e17b3b5ff34064393f7ca241bc55383da7e2ce1',
    source: 'SB' as const,
  },
  {
    id: 'big_english_3_sb_unit_08_activity_41_summary_review_a_v1',
    activityId: 'bep3_sb_act_08_41',
    summaryText:
      'Students complete six keyed past verb forms without reconstructing answers if the activity is excluded and without inventing SB audio.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      'd3caf3deddf110e8ca4d129750c42578b4943d70fa0a4d4de8c9f9c5e6143e7b',
    source: 'SB' as const,
  },
  {
    id: 'big_english_3_wb_unit_08_p117_activity_31_summary_review_a_v1',
    activityId: 'bep_3_wb_act_117_31',
    summaryText:
      'Students circle the correct verb form in three keyed items, preserving the page visual dependency without reconstructing excluded choices.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      'f4e92af38b4ebaca2fe915300de5026cc82239701ccce9ffb7ec71ae7f7df159',
    source: 'WB' as const,
  },
  {
    id: 'big_english_3_wb_unit_08_p117_activity_32_summary_review_a_v1',
    activityId: 'bep_3_wb_act_117_32',
    summaryText:
      'Students complete a six-gap cloze from the publisher word box without inventing box words or reconstructing excluded gaps.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      'e1deeee9dbbe6dde23f13c3047a2c325cbf9afba85d9ff1905aa86ba3604014f',
    source: 'WB' as const,
  },
  {
    id: 'big_english_3_wb_unit_08_p117_activity_33_summary_review_a_v1',
    activityId: 'bep_3_wb_act_117_33',
    summaryText:
      'Students complete five keyed gerund-as-subject sentences that remain Workbook-only evidence and must not be back-ported into Student Book Review summaries.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      '3333eaa10ad76b2cfe3828e21de7d46805369a83d728ecbb83c1c1d11c2f7c32',
    source: 'WB' as const,
  },
]

function sqlStringLiteral(value: string): string {
  return "'" + value.replaceAll("'", "''") + "'"
}

function provenanceJson(source: 'SB' | 'WB'): string {
  return JSON.stringify({
    record_type: 'teacher_friendly_summary',
    source,
    verification_status: 'human_verified',
    original_review_status: 'experimental_review_required',
    generation: {
      method: 'ai_assisted_draft',
      prompt_version: 'review-a-step-a-knowledge-prep-v0.1',
    },
  })
}

function encodeSummaryInsertRow(row: SummaryPayload): string {
  return `(
    ${sqlStringLiteral(row.id)},
    ${sqlStringLiteral(row.activityId)}, 1,
    ${sqlStringLiteral(row.summaryText)},
    ${sqlStringLiteral(row.canonicalPath)},
    ${sqlStringLiteral(row.canonicalSha256)},
    ${sqlStringLiteral(row.activitySha256)},
    'sufficient', 'hidden', 'experimental', true,
    ${sqlStringLiteral(provenanceJson(row.source))}
  )`
}

function encodeSummaryAssertionRow(row: SummaryPayload): string {
  return `(
          ${sqlStringLiteral(row.id)},
          ${sqlStringLiteral(row.activityId)},
          1,
          ${sqlStringLiteral(row.summaryText)},
          ${sqlStringLiteral(row.canonicalPath)},
          ${sqlStringLiteral(row.canonicalSha256)},
          ${sqlStringLiteral(row.activitySha256)},
          'sufficient',
          'hidden',
          'experimental',
          true,
          ${sqlStringLiteral(provenanceJson(row.source))}::jsonb
        )`
}

function assertExactSummaryPayloads(
  sql: string,
  payloads: readonly SummaryPayload[],
): void {
  assert.equal(payloads.length, 6, 'expected exact summary payload count')
  assert.equal(new Set(payloads.map((row) => row.id)).size, 6)
  assert.equal(new Set(payloads.map((row) => row.activityId)).size, 6)
  for (const row of payloads) {
    assert.ok(sql.includes(encodeSummaryInsertRow(row)), `missing insert payload for ${row.id}`)
    assert.ok(sql.includes(encodeSummaryAssertionRow(row)), `missing assertion payload for ${row.id}`)
  }
  assert.match(sql, /summary rows do not exactly match the accepted payload mapping/)
}

function readSql(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8').replaceAll('\r\n', '\n')
}

test('Review migration is additive, transactional, and collision-aborting', () => {
  const sql = readSql(MIGRATION)
  const openerSql = readSql(OPENER_MIGRATION)
  const storySql = readSql(STORY_MIGRATION)
  const liaSql = readSql(LIA_MIGRATION)
  const grammarSql = readSql(GRAMMAR_MIGRATION)
  const clilSql = readSql(CLIL_MIGRATION)
  const cultureSql = readSql(CULTURE_MIGRATION)
  const writingSql = readSql(WRITING_MIGRATION)
  const phonicsSql = readSql(PHONICS_MIGRATION)

  assert.match(sql, /^\s*begin;/m)
  assert.match(sql, /^\s*commit;/m)
  assert.equal((sql.match(/^\s*begin;/gm) ?? []).length, 1)
  assert.equal((sql.match(/^\s*commit;/gm) ?? []).length, 1)
  assert.doesNotMatch(sql, /on conflict/i)
  assert.doesNotMatch(sql, /\bupdate\b/i)
  assert.doesNotMatch(sql, /\bdelete\b/i)
  assert.match(sql, /precondition failed/i)
  assert.match(sql, /assertion failed/i)
  assert.ok(sql.includes('expected post-Phonics NLL baseline 8/68/68/9'))
  assert.ok(sql.includes('expected post-insert totals 9/74/74/9'))
  assert.match(sql, /be3-u08-review/)
  assert.match(sql, /Big English 3 Unit 8 Review/)
  assert.match(sql, new RegExp(COMPONENT_ID))
  assert.match(sql, /'sufficient', 'hidden', 'experimental', true/)
  assert.doesNotMatch(sql, /create table/i)
  assert.doesNotMatch(sql, /alter table/i)
  assert.doesNotMatch(sql, /policy/i)
  assert.doesNotMatch(sql, /enable row level security/i)
  assert.doesNotMatch(sql, /create (or replace )?function/i)
  assert.doesNotMatch(sql, /repair/i)
  assert.doesNotMatch(sql, /sb_only/)
  assert.doesNotMatch(sql, /resolver/i)
  assert.doesNotMatch(sql, /renderer/i)
  assert.doesNotMatch(sql, /adapter/i)
  assert.doesNotMatch(sql, /chalkie/i)
  assert.doesNotMatch(sql, /'Phonics'/)
  assert.doesNotMatch(sql, /'Writing'/)
  assert.doesNotMatch(sql, /'Values'/)
  assert.doesNotMatch(sql, /'I can\.\.\.'/)
  assert.doesNotMatch(sql, /'Structures'/)
  assert.doesNotMatch(sql, /'Vocabulary'/)
  assert.doesNotMatch(sql, /'CLIL\/Culture'/)

  assert.match(openerSql, /be3-u08-opener/)
  assert.doesNotMatch(openerSql, /be3-u08-review/)
  assert.match(storySql, /be3-u08-story/)
  assert.doesNotMatch(storySql, /be3-u08-review/)
  assert.match(liaSql, /be3-u08-lia/)
  assert.doesNotMatch(liaSql, /be3-u08-review/)
  assert.match(grammarSql, /be3-u08-grammar/)
  assert.doesNotMatch(grammarSql, /be3-u08-review/)
  assert.match(clilSql, /be3-u08-clil-pe/)
  assert.doesNotMatch(clilSql, /be3-u08-review/)
  assert.match(cultureSql, /be3-u08-culture/)
  assert.doesNotMatch(cultureSql, /be3-u08-review/)
  assert.match(writingSql, /be3-u08-writing/)
  assert.doesNotMatch(writingSql, /be3-u08-review/)
  assert.match(phonicsSql, /be3-u08-phonics/)
  assert.doesNotMatch(phonicsSql, /be3-u08-review/)
  assert.match(sql, /be3-u08-opener/)
  assert.match(sql, new RegExp(OPENER_COMPONENT_ID))
  assert.match(sql, /be3-u08-story/)
  assert.match(sql, new RegExp(STORY_COMPONENT_ID))
  assert.match(sql, /be3-u08-lia/)
  assert.match(sql, new RegExp(LIA_COMPONENT_ID))
  assert.match(sql, /be3-u08-grammar/)
  assert.match(sql, new RegExp(GRAMMAR_COMPONENT_ID))
  assert.match(sql, /be3-u08-clil-pe/)
  assert.match(sql, new RegExp(CLIL_COMPONENT_ID))
  assert.match(sql, /be3-u08-culture/)
  assert.match(sql, new RegExp(CULTURE_COMPONENT_ID))
  assert.match(sql, /be3-u08-writing/)
  assert.match(sql, new RegExp(WRITING_COMPONENT_ID))
  assert.match(sql, /be3-u08-phonics/)
  assert.match(sql, new RegExp(PHONICS_COMPONENT_ID))
})

test('Review migration encodes exact pairwise summary payloads and memberships', () => {
  const sql = readSql(MIGRATION)
  for (const [activityId, position] of MEMBERSHIPS) {
    assert.match(sql, new RegExp(`'${COMPONENT_ID}', '${activityId}', ${position}`))
  }
  assertExactSummaryPayloads(sql, ACCEPTED_SUMMARIES)
  assert.match(sql, new RegExp(SB_CANONICAL_SHA256))
  assert.match(sql, new RegExp(WB_CANONICAL_SHA256))
  assert.match(sql, /review-a-step-a-knowledge-prep-v0\.1/)
  assert.doesNotMatch(sql, /legacy_version/)

  assert.doesNotMatch(sql, /insert into public\.nll_ss_component_links/i)
  assert.match(sql, /expected zero .* SS links/)

})

test('exact Review summary-payload validator rejects swapped or corrupted pairings', () => {
  const sql = readSql(MIGRATION)
  assertExactSummaryPayloads(sql, ACCEPTED_SUMMARIES)
  const swappedTexts = ACCEPTED_SUMMARIES.map((row, index, rows) => {
    if (index === 0) return { ...row, summaryText: rows[1]!.summaryText }
    if (index === 1) return { ...row, summaryText: rows[0]!.summaryText }
    return row
  })
  assert.throws(() => assertExactSummaryPayloads(sql, swappedTexts), /missing insert payload/)
  const wrongFingerprint = ACCEPTED_SUMMARIES.map((row, index) =>
    index === 0
      ? { ...row, activitySha256: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' }
      : row,
  )
  assert.throws(() => assertExactSummaryPayloads(sql, wrongFingerprint), /missing insert payload/)
  const altered = sql.replaceAll('"review-a-step-a-knowledge-prep-v0.1"', '"mutated-prompt-version"')
  assert.throws(() => assertExactSummaryPayloads(altered, ACCEPTED_SUMMARIES), /missing insert payload/)
})

test('Review summaries remain hidden unless experimental knowledge is explicitly included', () => {
  const component = {
    id: COMPONENT_ID,
    component_key: 'be3-u08-review',
    title: 'Big English 3 Unit 8 Review',
    status: 'draft' as const,
    created_at: '2026-10-30T00:00:00.000Z',
  }
  const memberships = MEMBERSHIPS.map(([activityId, position]) => ({
    component_id: COMPONENT_ID,
    activity_id: activityId,
    position,
  }))
  const summaries = ACCEPTED_SUMMARIES.map((row) => ({
    id: row.id,
    activity_id: row.activityId,
    version: 1,
    summary_text: row.summaryText,
    canonical_path: row.canonicalPath,
    canonical_sha256: row.canonicalSha256,
    activity_sha256: row.activitySha256,
    evidence_status: 'sufficient' as const,
    display_status: 'hidden' as const,
    review_state: 'experimental' as const,
    is_preferred: true,
    provenance: JSON.parse(provenanceJson(row.source)),
    created_at: '2026-10-30T00:00:00.000Z',
  }))
  const ssLinks = []

  const normal = assembleNeutralLessonComponent({ component, memberships, summaries, ssLinks })
  assert.equal(normal.activities.filter((activity) => activity.preferredSummary).length, 0)
  assert.equal(normal.proposedSsLinks.length, 0)

  const hidden = assembleNeutralLessonComponent({
    component, memberships, summaries, ssLinks, includeHiddenExperimental: true,
  })
  assert.equal(hidden.activities.filter((activity) => activity.preferredSummary).length, 6)
  assert.deepEqual(
    hidden.activities.map((activity) => activity.activityId),
    MEMBERSHIPS.map(([activityId]) => activityId),
  )
  assert.equal(hidden.proposedSsLinks.length, 0)
})
