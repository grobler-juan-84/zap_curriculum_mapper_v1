/**
 * Focused Culture-A Step B seed-validation tests.
 * Does not rewrite accepted Opener, Story, LiA, Grammar, or CLIL NLL suites.
 * Run: npx tsx --test scripts/tests/nllBe3U08CultureSeedStepB.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { assembleNeutralLessonComponent } from '../../app/src/features/nll/neutralLessonLibrary.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const CULTURE_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261030180000_seed_nll_be3_u08_culture.sql',
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

const CULTURE_COMPONENT_ID = '3e800008-0000-4000-8000-000000000006'
const OPENER_COMPONENT_ID = '3e800008-0000-4000-8000-000000000001'
const STORY_COMPONENT_ID = '3e800008-0000-4000-8000-000000000002'
const LIA_COMPONENT_ID = '3e800008-0000-4000-8000-000000000003'
const GRAMMAR_COMPONENT_ID = '3e800008-0000-4000-8000-000000000004'
const CLIL_COMPONENT_ID = '3e800008-0000-4000-8000-000000000005'

const SB_CANONICAL_PATH = 'big-english/big_english_3_sb/canonical/v1.json'
const WB_CANONICAL_PATH = 'big-english/big_english_3_wb/canonical/v1.json'
const SB_CANONICAL_SHA256 =
  '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6'
const WB_CANONICAL_SHA256 =
  '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa'

const MEMBERSHIPS = [
  ['bep3_sb_act_08_24', 1],
  ['bep3_sb_act_08_25', 2],
  ['bep3_sb_act_08_26', 3],
  ['bep3_sb_act_08_27', 4],
  ['bep_3_wb_act_113_20', 5],
  ['bep_3_wb_act_113_21', 6],
  ['bep_3_wb_act_114_22', 7],
  ['bep_3_wb_act_114_23', 8],
  ['bep_3_wb_act_114_tb', 9],
] as const

type CultureSummaryPayload = {
  readonly id: string
  readonly activityId: string
  readonly summaryText: string
  readonly canonicalPath: string
  readonly canonicalSha256: string
  readonly activitySha256: string
  readonly source: 'SB' | 'WB'
}

const ACCEPTED_SUMMARIES: readonly CultureSummaryPayload[] = [
  {
    id: 'big_english_3_sb_unit_08_activity_24_summary_culture_a_v1',
    activityId: 'bep3_sb_act_08_24',
    summaryText:
      'Students work with a partner to match listed sports to country options or add their own; the matching is open and not keyed.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      '91d73d467b5a0f3d250a8e3b707e37baa435972a8bd0f556e574f738ebb7c19f',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_25_summary_culture_a_v1',
    activityId: 'bep3_sb_act_08_25',
    summaryText:
      'Students listen to Audio 160 and read about publisher-labelled strange sports to identify when people started them, preserving the visual dependency.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      '765aa1c97c1fd5f6c48f7939b3e9509f5ee142bc74d2e26ea4559a981151146f',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_26_summary_culture_a_v1',
    activityId: 'bep3_sb_act_08_26',
    summaryText:
      'Students look at Activity 25 and say true or false for five claims without reconstructing excluded reading evidence.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      'c7fd13fff75b8c9450bd69bf89eefb7555d38176015ebea6da5234aae926ca31',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_27_summary_culture_a_v1',
    activityId: 'bep3_sb_act_08_27',
    summaryText:
      'Students complete the sports chart for origin, description, similar sports, and reason started, preserving the chart and layout dependency.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      '53d699c4da14681ae91035e58ea6b586e6f047f5d075d47338c38393126e1f14',
    source: 'SB',
  },
  {
    id: 'big_english_3_wb_unit_08_p113_activity_20_summary_culture_a_v1',
    activityId: 'bep_3_wb_act_113_20',
    summaryText:
      'Students look at Activity 21 and quickly match three sentence halves about the sports, without reconstructing excluded Activity 21 evidence.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      'caaae9a48c0d8af780ff7ef9507b8d3f1e3e2366cba50c2927dfe66ae9230ce4',
    source: 'WB',
  },
  {
    id: 'big_english_3_wb_unit_08_p113_activity_21_summary_culture_a_v1',
    activityId: 'bep_3_wb_act_113_21',
    summaryText:
      'Students listen, read, and write gaps from the word box, using Audio 161 to check without inventing audio wording.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      '4ea2ea0261684b617d610de920784b1793819e9ba7517d17cae7b09095d5f18f',
    source: 'WB',
  },
  {
    id: 'big_english_3_wb_unit_08_p114_activity_22_summary_culture_a_v1',
    activityId: 'bep_3_wb_act_114_22',
    summaryText:
      'Students read and match five sentence halves about how and why the sports started.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      'b0b3a02d50803e98713b052c60297bc5c23a06f1a4cd074dfccd0bfe3b56d381',
    source: 'WB',
  },
  {
    id: 'big_english_3_wb_unit_08_p114_activity_23_summary_culture_a_v1',
    activityId: 'bep_3_wb_act_114_23',
    summaryText:
      'Students circle true or false for five claims about the sports without dumping answer keys.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      'bce7fc8beccd52654a5e2c6f8697482524605a819f8720e2a72bd0abd1e8ce5c',
    source: 'WB',
  },
  {
    id: 'big_english_3_wb_unit_08_p114_think_big_summary_culture_a_v1',
    activityId: 'bep_3_wb_act_114_tb',
    summaryText:
      'Students invent a strange sport, then draw and describe it using the Think Big prompt.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      '80eb227d16b30df0fbc01e6e45184a31adbf0c25ff2f1a1f0a861b1a97ba9bf8',
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
      prompt_version: 'culture-a-step-a-knowledge-prep-v0.1',
    },
  })
}

function encodeCultureSummaryInsertRow(row: CultureSummaryPayload): string {
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

function encodeCultureSummaryAssertionRow(row: CultureSummaryPayload): string {
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

function assertExactCultureSummaryPayloads(
  sql: string,
  payloads: readonly CultureSummaryPayload[],
): void {
  assert.equal(payloads.length, 9, 'expected exactly nine Culture summary payloads')
  assert.equal(
    new Set(payloads.map((row) => row.id)).size,
    9,
    'summary IDs must be unique',
  )
  assert.equal(
    new Set(payloads.map((row) => row.activityId)).size,
    9,
    'activity IDs must be unique',
  )

  for (const row of payloads) {
    assert.ok(
      sql.includes(encodeCultureSummaryInsertRow(row)),
      `missing exact paired summary payload for ${row.id} / ${row.activityId}`,
    )
    assert.ok(
      sql.includes(encodeCultureSummaryAssertionRow(row)),
      `missing exact assertion mapping for ${row.id} / ${row.activityId}`,
    )
  }

  assert.match(
    sql,
    /Culture summary rows do not exactly match the accepted payload mapping/,
  )
  assert.match(sql, /\bexcept\b/i)
  assert.match(
    sql,
    /expected exactly nine summaries for Culture activity IDs/,
  )
  assert.match(
    sql,
    /expected exactly the nine accepted Culture summary IDs/,
  )
}

function readSql(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8').replaceAll('\r\n', '\n')
}

test('Culture migration is additive, transactional, and collision-aborting', () => {
  const sql = readSql(CULTURE_MIGRATION)
  const openerSql = readSql(OPENER_MIGRATION)
  const storySql = readSql(STORY_MIGRATION)
  const liaSql = readSql(LIA_MIGRATION)
  const grammarSql = readSql(GRAMMAR_MIGRATION)
  const clilSql = readSql(CLIL_MIGRATION)

  assert.match(sql, /^\s*begin;/m)
  assert.match(sql, /^\s*commit;/m)
  assert.equal((sql.match(/^\s*begin;/gm) ?? []).length, 1)
  assert.equal((sql.match(/^\s*commit;/gm) ?? []).length, 1)
  assert.doesNotMatch(sql, /on conflict/i)
  assert.doesNotMatch(sql, /\bupdate\b/i)
  assert.doesNotMatch(sql, /\bdelete\b/i)
  assert.match(sql, /precondition failed/i)
  assert.match(sql, /assertion failed/i)
  assert.match(sql, /expected approved NLL baseline 5\/44\/44\/6/)
  assert.match(sql, /expected post-insert totals 6\/53\/53\/6/)
  assert.match(sql, /be3-u08-culture/)
  assert.match(sql, /Big English 3 Unit 8 Culture Connection/)
  assert.match(sql, new RegExp(CULTURE_COMPONENT_ID))
  assert.match(sql, /expected zero Culture SS links/)
  assert.doesNotMatch(sql, /insert into public\.nll_ss_component_links/i)
  assert.doesNotMatch(sql, /'Structures'/)
  assert.doesNotMatch(sql, /'CLIL\/Culture'/)
  assert.doesNotMatch(sql, /'Vocabulary'/)
  assert.doesNotMatch(sql, /'I can\.\.\.'/)
  assert.doesNotMatch(sql, /'Values'/)
  assert.match(sql, /'sufficient', 'hidden', 'experimental', true/)
  assert.match(sql, /display_status/)
  assert.match(sql, /review_state/)
  assert.match(sql, /evidence_status/)
  assert.match(sql, /is_preferred/)
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
  assert.doesNotMatch(openerSql, /be3-u08-culture/)
  assert.match(storySql, /be3-u08-story/)
  assert.doesNotMatch(storySql, /be3-u08-culture/)
  assert.match(liaSql, /be3-u08-lia/)
  assert.doesNotMatch(liaSql, /be3-u08-culture/)
  assert.match(grammarSql, /be3-u08-grammar/)
  assert.doesNotMatch(grammarSql, /be3-u08-culture/)
  assert.match(clilSql, /be3-u08-clil-pe/)
  assert.doesNotMatch(clilSql, /be3-u08-culture/)

  assert.match(sql, /be3-u08-opener/)
  assert.match(sql, /be3-u08-story/)
  assert.match(sql, /be3-u08-lia/)
  assert.match(sql, /be3-u08-grammar/)
  assert.match(sql, /be3-u08-clil-pe/)
  assert.match(sql, new RegExp(OPENER_COMPONENT_ID))
  assert.match(sql, new RegExp(STORY_COMPONENT_ID))
  assert.match(sql, new RegExp(LIA_COMPONENT_ID))
  assert.match(sql, new RegExp(GRAMMAR_COMPONENT_ID))
  assert.match(sql, new RegExp(CLIL_COMPONENT_ID))
})

test('Culture migration encodes exact pairwise summary payloads and memberships', () => {
  const sql = readSql(CULTURE_MIGRATION)

  for (const [activityId, position] of MEMBERSHIPS) {
    assert.match(
      sql,
      new RegExp(`'${CULTURE_COMPONENT_ID}', '${activityId}', ${position}`),
    )
  }

  assertExactCultureSummaryPayloads(sql, ACCEPTED_SUMMARIES)

  assert.match(sql, new RegExp(SB_CANONICAL_SHA256))
  assert.match(sql, new RegExp(WB_CANONICAL_SHA256))
  assert.match(sql, /culture-a-step-a-knowledge-prep-v0\.1/)
  assert.doesNotMatch(sql, /legacy_version/)
})

test('exact Culture summary-payload validator rejects swapped or corrupted pairings', () => {
  const sql = readSql(CULTURE_MIGRATION)
  assertExactCultureSummaryPayloads(sql, ACCEPTED_SUMMARIES)

  const swappedTexts = ACCEPTED_SUMMARIES.map((row, index, rows) => {
    if (index === 0) return { ...row, summaryText: rows[1]!.summaryText }
    if (index === 1) return { ...row, summaryText: rows[0]!.summaryText }
    return row
  })
  assert.throws(
    () => assertExactCultureSummaryPayloads(sql, swappedTexts),
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
    () => assertExactCultureSummaryPayloads(sql, wrongFingerprint),
    /missing exact paired summary payload/,
  )

  const alteredProvenanceSql = sql.replaceAll(
    '"prompt_version":"culture-a-step-a-knowledge-prep-v0.1"',
    '"prompt_version":"mutated-prompt-version"',
  )
  assert.throws(
    () =>
      assertExactCultureSummaryPayloads(
        alteredProvenanceSql,
        ACCEPTED_SUMMARIES,
      ),
    /missing exact paired summary payload/,
  )
})

test('Culture summaries remain hidden unless experimental knowledge is explicitly included', () => {
  const component = {
    id: CULTURE_COMPONENT_ID,
    component_key: 'be3-u08-culture',
    title: 'Big English 3 Unit 8 Culture Connection',
    status: 'draft' as const,
    created_at: '2026-10-30T00:00:00.000Z',
  }
  const memberships = MEMBERSHIPS.map(([activityId, position]) => ({
    component_id: CULTURE_COMPONENT_ID,
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

  const normal = assembleNeutralLessonComponent({
    component,
    memberships,
    summaries,
    ssLinks: [],
  })
  assert.equal(
    normal.activities.filter((activity) => activity.preferredSummary).length,
    0,
  )
  assert.equal(normal.proposedSsLinks.length, 0)
  assert.deepEqual(normal.curriculumAuthorityLinks, [])

  const hidden = assembleNeutralLessonComponent({
    component,
    memberships,
    summaries,
    ssLinks: [],
    includeHiddenExperimental: true,
  })
  assert.equal(
    hidden.activities.filter((activity) => activity.preferredSummary).length,
    9,
  )
  assert.deepEqual(
    hidden.activities.map((activity) => activity.activityId),
    MEMBERSHIPS.map(([activityId]) => activityId),
  )
  assert.equal(hidden.proposedSsLinks.length, 0)
})
