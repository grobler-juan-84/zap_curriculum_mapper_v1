/**
 * Focused Writing-A Step B seed-validation tests.
 * Does not rewrite accepted Opener, Story, LiA, Grammar, CLIL, or Culture NLL suites.
 * Run: npx tsx --test scripts/tests/nllBe3U08WritingSeedStepB.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { assembleNeutralLessonComponent } from '../../app/src/features/nll/neutralLessonLibrary.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const WRITING_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261030190000_seed_nll_be3_u08_writing.sql',
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

const WRITING_COMPONENT_ID = '3e800008-0000-4000-8000-000000000007'
const WRITING_LINK_ID = '3e800008-0000-4000-8000-000000000701'
const I_CAN_LINK_ID = '3e800008-0000-4000-8000-000000000702'
const OPENER_COMPONENT_ID = '3e800008-0000-4000-8000-000000000001'
const STORY_COMPONENT_ID = '3e800008-0000-4000-8000-000000000002'
const LIA_COMPONENT_ID = '3e800008-0000-4000-8000-000000000003'
const GRAMMAR_COMPONENT_ID = '3e800008-0000-4000-8000-000000000004'
const CLIL_COMPONENT_ID = '3e800008-0000-4000-8000-000000000005'
const CULTURE_COMPONENT_ID = '3e800008-0000-4000-8000-000000000006'

const SB_CANONICAL_PATH = 'big-english/big_english_3_sb/canonical/v1.json'
const WB_CANONICAL_PATH = 'big-english/big_english_3_wb/canonical/v1.json'
const SB_CANONICAL_SHA256 =
  '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6'
const WB_CANONICAL_SHA256 =
  '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa'
const SS_SHA256 =
  'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a'

const MEMBERSHIPS = [
  ['bep3_sb_act_08_28', 1],
  ['bep3_sb_act_08_29', 2],
  ['bep3_sb_act_08_30', 3],
  ['bep3_sb_act_08_31', 4],
  ['bep_3_wb_act_115_24', 5],
  ['bep_3_wb_act_115_25', 6],
  ['bep_3_wb_act_115_26', 7],
] as const

type WritingSummaryPayload = {
  readonly id: string
  readonly activityId: string
  readonly summaryText: string
  readonly canonicalPath: string
  readonly canonicalSha256: string
  readonly activitySha256: string
  readonly source: 'SB' | 'WB'
}

const ACCEPTED_SUMMARIES: readonly WritingSummaryPayload[] = [
  {
    id: 'big_english_3_sb_unit_08_activity_28_summary_writing_a_v1',
    activityId: 'bep3_sb_act_08_28',
    summaryText:
      'Students complete three keyed conjunction gaps, then listen to Audio 162 to check, without inventing a transcript or treating keyed answers as a student composition.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      'b27b71a97da7e774cce69485d9e44a560744b7862d75218a6d3aa60dbf01898c',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_29_summary_writing_a_v1',
    activityId: 'bep3_sb_act_08_29',
    summaryText:
      'Students join five keyed sentence pairs with and, but, or and write the combined sentences; keyed examples are not a student paragraph.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      'b951d44f268a7c89e4f6fcadcaca3bb5f6cf134a557f8f8369fa56ba49b68f3f',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_30_summary_writing_a_v1',
    activityId: 'bep3_sb_act_08_30',
    summaryText:
      'Students read and choose among and, but, or in four keyed items without reconstructing answers if the activity is excluded.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      '8377cffc7556d569987b71460898e76f5c38e66ecaf125912ad0640b5c328b84',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_31_summary_writing_a_v1',
    activityId: 'bep3_sb_act_08_31',
    summaryText:
      'Students write three open sentences about healthy habits using and, but, and or once each, without any invented sample response, rubric, or criteria.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      '437978d1169a7d8522b81fe8f800336bfb0f9e128f1e2f2995599688537e2326',
    source: 'SB',
  },
  {
    id: 'big_english_3_wb_unit_08_p115_activity_24_summary_writing_a_v1',
    activityId: 'bep_3_wb_act_115_24',
    summaryText:
      'Students read and circle the correct and, but, or choice in six keyed items.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      'dbc871979d68ef6816112c87f5ddb1dd0df7fa3c268dc06e3c7ae61a2134483c',
    source: 'WB',
  },
  {
    id: 'big_english_3_wb_unit_08_p115_activity_25_summary_writing_a_v1',
    activityId: 'bep_3_wb_act_115_25',
    summaryText:
      'Students complete four sentence stems using clause options from the box, preserving the box and visual dependency without inventing clauses.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      '4ac42b5c299e90b9d1a1c0508a27b75fc66e3db1e4865c2a060c82f244e3fc60',
    source: 'WB',
  },
  {
    id: 'big_english_3_wb_unit_08_p115_activity_26_summary_writing_a_v1',
    activityId: 'bep_3_wb_act_115_26',
    summaryText:
      'Students complete a six-gap paragraph cloze with or, but, or and without inventing paragraph content beyond the keyed task.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      'b1cebb0f0b60cd844e9347d3284708e7cec1b91a36fe3af9c10733772caf6aca',
    source: 'WB',
  },
]

function sqlStringLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`
}

function provenanceJson(source: 'SB' | 'WB'): string {
  return JSON.stringify({
    record_type: 'teacher_friendly_summary',
    source,
    verification_status: 'human_verified',
    original_review_status: 'experimental_review_required',
    generation: {
      method: 'ai_assisted_draft',
      prompt_version: 'writing-a-step-a-knowledge-prep-v0.1',
    },
  })
}

function encodeWritingSummaryInsertRow(row: WritingSummaryPayload): string {
  return `(
    ${sqlStringLiteral(row.id)},
    ${sqlStringLiteral(row.activityId)}, 1,
    ${sqlStringLiteral(row.summaryText)},
    ${sqlStringLiteral(row.canonicalPath)},
    ${sqlStringLiteral(row.canonicalSha256)},
    ${sqlStringLiteral(row.activitySha256)},
    'sufficient', 'hidden', 'experimental', true,
    '${provenanceJson(row.source)}'
  )`
}

function encodeWritingSummaryAssertionRow(row: WritingSummaryPayload): string {
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
          '${provenanceJson(row.source)}'::jsonb
        )`
}

function assertExactWritingSummaryPayloads(
  sql: string,
  payloads: readonly WritingSummaryPayload[],
): void {
  assert.equal(payloads.length, 7, 'expected exactly seven Writing summary payloads')
  assert.equal(
    new Set(payloads.map((row) => row.id)).size,
    7,
    'summary IDs must be unique',
  )
  assert.equal(
    new Set(payloads.map((row) => row.activityId)).size,
    7,
    'activity IDs must be unique',
  )

  for (const row of payloads) {
    assert.ok(
      sql.includes(encodeWritingSummaryInsertRow(row)),
      `missing exact paired summary payload for ${row.id} / ${row.activityId}`,
    )
    assert.ok(
      sql.includes(encodeWritingSummaryAssertionRow(row)),
      `missing exact assertion mapping for ${row.id} / ${row.activityId}`,
    )
  }

  assert.match(
    sql,
    /Writing summary rows do not exactly match the accepted payload mapping/,
  )
}

function readSql(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8').replaceAll('\r\n', '\n')
}

test('Writing migration is additive, transactional, and collision-aborting', () => {
  const sql = readSql(WRITING_MIGRATION)
  const openerSql = readSql(OPENER_MIGRATION)
  const storySql = readSql(STORY_MIGRATION)
  const liaSql = readSql(LIA_MIGRATION)
  const grammarSql = readSql(GRAMMAR_MIGRATION)
  const clilSql = readSql(CLIL_MIGRATION)
  const cultureSql = readSql(CULTURE_MIGRATION)

  assert.match(sql, /^\s*begin;/m)
  assert.match(sql, /^\s*commit;/m)
  assert.equal((sql.match(/^\s*begin;/gm) ?? []).length, 1)
  assert.equal((sql.match(/^\s*commit;/gm) ?? []).length, 1)
  assert.doesNotMatch(sql, /on conflict/i)
  assert.doesNotMatch(sql, /\bupdate\b/i)
  assert.doesNotMatch(sql, /\bdelete\b/i)
  assert.match(sql, /precondition failed/i)
  assert.match(sql, /assertion failed/i)
  assert.match(sql, /expected approved NLL baseline 6\/53\/53\/6/)
  assert.match(sql, /expected post-insert totals 7\/60\/60\/8/)
  assert.match(sql, /be3-u08-writing/)
  assert.match(sql, /Big English 3 Unit 8 Writing/)
  assert.match(sql, new RegExp(WRITING_COMPONENT_ID))
  assert.match(sql, new RegExp(WRITING_LINK_ID))
  assert.match(sql, new RegExp(I_CAN_LINK_ID))
  assert.match(sql, /'Writing'/)
  assert.match(sql, /'I can\.\.\.'/)
  assert.match(sql, /status = 'proposed'/)
  assert.match(sql, /expected exactly two proposed Writing SS links/)
  assert.match(sql, /'sufficient', 'hidden', 'experimental', true/)
  assert.doesNotMatch(sql, /'Structures'/)
  assert.doesNotMatch(sql, /'Vocabulary'/)
  assert.doesNotMatch(sql, /'CLIL\/Culture'/)
  assert.doesNotMatch(sql, /'Phonics'/)
  assert.doesNotMatch(sql, /'Values'/)
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

  assert.match(openerSql, /be3-u08-opener/)
  assert.doesNotMatch(openerSql, /be3-u08-writing/)
  assert.match(storySql, /be3-u08-story/)
  assert.doesNotMatch(storySql, /be3-u08-writing/)
  assert.match(liaSql, /be3-u08-lia/)
  assert.doesNotMatch(liaSql, /be3-u08-writing/)
  assert.match(grammarSql, /be3-u08-grammar/)
  assert.doesNotMatch(grammarSql, /be3-u08-writing/)
  assert.match(clilSql, /be3-u08-clil-pe/)
  assert.doesNotMatch(clilSql, /be3-u08-writing/)
  assert.match(cultureSql, /be3-u08-culture/)
  assert.doesNotMatch(cultureSql, /be3-u08-writing/)

  assert.match(sql, /be3-u08-opener/)
  assert.match(sql, /be3-u08-story/)
  assert.match(sql, /be3-u08-lia/)
  assert.match(sql, /be3-u08-grammar/)
  assert.match(sql, /be3-u08-clil-pe/)
  assert.match(sql, /be3-u08-culture/)
  assert.match(sql, new RegExp(OPENER_COMPONENT_ID))
  assert.match(sql, new RegExp(STORY_COMPONENT_ID))
  assert.match(sql, new RegExp(LIA_COMPONENT_ID))
  assert.match(sql, new RegExp(GRAMMAR_COMPONENT_ID))
  assert.match(sql, new RegExp(CLIL_COMPONENT_ID))
  assert.match(sql, new RegExp(CULTURE_COMPONENT_ID))
})

test('Writing migration encodes exact pairwise summary payloads and memberships', () => {
  const sql = readSql(WRITING_MIGRATION)

  for (const [activityId, position] of MEMBERSHIPS) {
    assert.match(
      sql,
      new RegExp(`'${WRITING_COMPONENT_ID}', '${activityId}', ${position}`),
    )
  }

  assertExactWritingSummaryPayloads(sql, ACCEPTED_SUMMARIES)

  assert.match(sql, new RegExp(SB_CANONICAL_SHA256))
  assert.match(sql, new RegExp(WB_CANONICAL_SHA256))
  assert.match(sql, new RegExp(SS_SHA256))
  assert.match(sql, /writing-a-step-a-knowledge-prep-v0\.1/)
  assert.doesNotMatch(sql, /legacy_version/)

  const ssInsertMatches =
    sql.match(/insert into public\.nll_ss_component_links[\s\S]*?;/gi) ?? []
  assert.equal(ssInsertMatches.length, 1)
  assert.match(ssInsertMatches[0]!, /'Writing'/)
  assert.match(ssInsertMatches[0]!, /'I can\.\.\.'/)
  assert.doesNotMatch(ssInsertMatches[0]!, /Structures/)
  assert.doesNotMatch(ssInsertMatches[0]!, /Vocabulary/)
})

test('exact Writing summary-payload validator rejects swapped or corrupted pairings', () => {
  const sql = readSql(WRITING_MIGRATION)
  assertExactWritingSummaryPayloads(sql, ACCEPTED_SUMMARIES)

  const swappedTexts = ACCEPTED_SUMMARIES.map((row, index, rows) => {
    if (index === 0) return { ...row, summaryText: rows[1]!.summaryText }
    if (index === 1) return { ...row, summaryText: rows[0]!.summaryText }
    return row
  })
  assert.throws(
    () => assertExactWritingSummaryPayloads(sql, swappedTexts),
    /missing exact paired summary payload/,
  )

  const wrongFingerprint = ACCEPTED_SUMMARIES.map((row, index) =>
    index === 0
      ? {
          ...row,
          activitySha256:
            'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        }
      : row,
  )
  assert.throws(
    () => assertExactWritingSummaryPayloads(sql, wrongFingerprint),
    /missing exact paired summary payload/,
  )

  const alteredProvenanceSql = sql.replaceAll(
    '"prompt_version":"writing-a-step-a-knowledge-prep-v0.1"',
    '"prompt_version":"mutated-prompt-version"',
  )
  assert.throws(
    () =>
      assertExactWritingSummaryPayloads(
        alteredProvenanceSql,
        ACCEPTED_SUMMARIES,
      ),
    /missing exact paired summary payload/,
  )
})

test('Writing summaries remain hidden unless experimental knowledge is explicitly included', () => {
  const component = {
    id: WRITING_COMPONENT_ID,
    component_key: 'be3-u08-writing',
    title: 'Big English 3 Unit 8 Writing',
    status: 'draft' as const,
    created_at: '2026-10-30T00:00:00.000Z',
  }
  const memberships = MEMBERSHIPS.map(([activityId, position]) => ({
    component_id: WRITING_COMPONENT_ID,
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
  const ssLinks = [
    {
      id: WRITING_LINK_ID,
      component_id: WRITING_COMPONENT_ID,
      ss_path: 'big-english/big_english_3_sb/canonical/ss_v1.json',
      ss_sha256: SS_SHA256,
      unit_number_raw: '8',
      column_order: 4,
      category_name_raw: 'Writing',
      status: 'proposed' as const,
      created_at: '2026-10-30T00:00:00.000Z',
    },
    {
      id: I_CAN_LINK_ID,
      component_id: WRITING_COMPONENT_ID,
      ss_path: 'big-english/big_english_3_sb/canonical/ss_v1.json',
      ss_sha256: SS_SHA256,
      unit_number_raw: '8',
      column_order: 7,
      category_name_raw: 'I can...',
      status: 'proposed' as const,
      created_at: '2026-10-30T00:00:00.000Z',
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
  assert.equal(normal.proposedSsLinks.length, 2)

  const hidden = assembleNeutralLessonComponent({
    component,
    memberships,
    summaries,
    ssLinks,
    includeHiddenExperimental: true,
  })
  assert.equal(
    hidden.activities.filter((activity) => activity.preferredSummary).length,
    7,
  )
  assert.deepEqual(
    hidden.activities.map((activity) => activity.activityId),
    MEMBERSHIPS.map(([activityId]) => activityId),
  )
  assert.equal(hidden.proposedSsLinks.length, 2)
  assert.deepEqual(
    hidden.proposedSsLinks.map((link) => link.category_name_raw),
    ['Writing', 'I can...'],
  )
})
