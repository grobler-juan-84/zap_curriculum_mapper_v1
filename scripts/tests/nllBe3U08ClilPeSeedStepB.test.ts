/**
 * Focused CLIL-A Step B seed-validation tests.
 * Does not rewrite the accepted Opener, Story, LiA, or Grammar NLL suites.
 * Run: npx tsx --test scripts/tests/nllBe3U08ClilPeSeedStepB.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { assembleNeutralLessonComponent } from '../../app/src/features/nll/neutralLessonLibrary.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const CLIL_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261030170000_seed_nll_be3_u08_clil_pe.sql',
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

const CLIL_COMPONENT_ID = '3e800008-0000-4000-8000-000000000005'
const OPENER_COMPONENT_ID = '3e800008-0000-4000-8000-000000000001'
const STORY_COMPONENT_ID = '3e800008-0000-4000-8000-000000000002'
const LIA_COMPONENT_ID = '3e800008-0000-4000-8000-000000000003'
const GRAMMAR_COMPONENT_ID = '3e800008-0000-4000-8000-000000000004'

const SB_CANONICAL_PATH = 'big-english/big_english_3_sb/canonical/v1.json'
const WB_CANONICAL_PATH = 'big-english/big_english_3_wb/canonical/v1.json'
const SB_CANONICAL_SHA256 =
  '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6'
const WB_CANONICAL_SHA256 =
  '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa'

const MEMBERSHIPS = [
  ['bep3_sb_act_08_13', 1],
  ['bep3_sb_act_08_14', 2],
  ['bep3_sb_act_08_15', 3],
  ['bep3_sb_act_08_16', 4],
  ['bep3_sb_act_08_17', 5],
  ['bep3_sb_act_08_18', 6],
  ['bep_3_wb_act_109_11', 7],
  ['bep_3_wb_act_109_12', 8],
  ['bep_3_wb_act_110_13', 9],
  ['bep_3_wb_act_110_14', 10],
  ['bep_3_wb_act_110_tb', 11],
] as const

type ClilSummaryPayload = {
  readonly id: string
  readonly activityId: string
  readonly summaryText: string
  readonly canonicalPath: string
  readonly canonicalSha256: string
  readonly activitySha256: string
  readonly source: 'SB' | 'WB'
}

const ACCEPTED_SUMMARIES: readonly ClilSummaryPayload[] = [
  {
    id: 'big_english_3_sb_unit_08_activity_13_summary_clil_a_v1',
    activityId: 'bep3_sb_act_08_13',
    summaryText:
      'Students read, guess, and choose answers to two warm-up questions about exercise amount and which activity uses more energy.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      'e0ab565f885400b6274829fdacdcb492ce111e369b8611825cf055b1bb02b321',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_14_summary_clil_a_v1',
    activityId: 'bep3_sb_act_08_14',
    summaryText:
      'Students listen to Audio 157 and read the article to identify what the numbers 60, 12,000, 9, and 10 mean, then check their Activity 13 answers.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      '04e43b12c5cd6ef7e01b0f2d7613db08ab1e3ddcb1136f8de480e58071b1c6fd',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_15_summary_clil_a_v1',
    activityId: 'bep3_sb_act_08_15',
    summaryText:
      'Students answer five comprehension questions about the Activity 14 article in their notebooks.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      'e4e3a5848aeb91ecad6f4dbfbdb94018e58878e079a43003c4eb73ecb1eedfe5',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_16_summary_clil_a_v1',
    activityId: 'bep3_sb_act_08_16',
    summaryText:
      'Students complete a two-column body-activity chart using the word-box activities, then add more activities.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      '1d37a74a555e14b8066cba06e3939339b4c43efbc892dc3a6a72c0d681af4cd3',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_17_summary_clil_a_v1',
    activityId: 'bep3_sb_act_08_17',
    summaryText:
      'Students work with a partner to ask and answer the questions at the end of the Activity 14 article.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      '15aa2f5b907715e7223a0c8a17af5245485071077e8c6b2d1a7d8587676b0a50',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_18_summary_clil_a_v1',
    activityId: 'bep3_sb_act_08_18',
    summaryText:
      'Students make a personal Exercise Chart of good and bad activities, using the verified language frame.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      'c7ab978e2ee7ac872bb79bbbd908f89f8b29f699fd8f42300b4cbf4ca4e97948',
    source: 'SB',
  },
  {
    id: 'big_english_3_wb_unit_08_p109_activity_11_summary_clil_a_v1',
    activityId: 'bep_3_wb_act_109_11',
    summaryText:
      'Students complete a six-gap calorie text using the words from the box.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      'f5b92d0de13c0b30c51a0f082d8744676e4c916a17a6f98992723a18bf03c653',
    source: 'WB',
  },
  {
    id: 'big_english_3_wb_unit_08_p109_activity_12_summary_clil_a_v1',
    activityId: 'bep_3_wb_act_109_12',
    summaryText:
      'Students read and circle choices in a calorie passage, then listen to Audio 158 to check.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      'ecfd8e6833722077033ba0f1bd4a450a287a8bc81a7fba2d8c80c44fc549ed62',
    source: 'WB',
  },
  {
    id: 'big_english_3_wb_unit_08_p110_activity_13_summary_clil_a_v1',
    activityId: 'bep_3_wb_act_110_13',
    summaryText:
      'Students look at Activity 12 and match five sentence halves about calories and activity.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      '4526d0eb5ad95c9ec8f84a08c26d00b539a94c21a678ad12772fea2e40fee13f',
    source: 'WB',
  },
  {
    id: 'big_english_3_wb_unit_08_p110_activity_14_summary_clil_a_v1',
    activityId: 'bep_3_wb_act_110_14',
    summaryText:
      'Students complete the Inside / Outside / Inside or Outside activity diagram and add five more activities.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      '39f62325f7434edf449866a03594fd76a7da09f959e21adb201314e033f18495',
    source: 'WB',
  },
  {
    id: 'big_english_3_wb_unit_08_p110_think_big_summary_clil_a_v1',
    activityId: 'bep_3_wb_act_110_tb',
    summaryText:
      'Students complete the Think Big healthy-choice prompts by choosing one option in each pair.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      '76c7285c24aefc477fce094858cc82790b3f88c33cc2c4329ec777e74a90ca03',
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
      prompt_version: 'clil-a-step-a-knowledge-prep-v0.1',
    },
  })
}

function encodeClilSummaryInsertRow(row: ClilSummaryPayload): string {
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

function encodeClilSummaryAssertionRow(row: ClilSummaryPayload): string {
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

function assertExactClilSummaryPayloads(
  sql: string,
  payloads: readonly ClilSummaryPayload[],
): void {
  assert.equal(payloads.length, 11, 'expected exactly eleven CLIL summary payloads')
  assert.equal(
    new Set(payloads.map((row) => row.id)).size,
    11,
    'summary IDs must be unique',
  )
  assert.equal(
    new Set(payloads.map((row) => row.activityId)).size,
    11,
    'activity IDs must be unique',
  )

  for (const row of payloads) {
    assert.ok(
      sql.includes(encodeClilSummaryInsertRow(row)),
      `missing exact paired summary payload for ${row.id} / ${row.activityId}`,
    )
    assert.ok(
      sql.includes(encodeClilSummaryAssertionRow(row)),
      `missing exact assertion mapping for ${row.id} / ${row.activityId}`,
    )
  }

  assert.match(
    sql,
    /CLIL summary rows do not exactly match the accepted payload mapping/,
  )
  assert.match(sql, /\bexcept\b/i)
  assert.match(
    sql,
    /expected exactly eleven summaries for CLIL activity IDs/,
  )
  assert.match(
    sql,
    /expected exactly the eleven accepted CLIL summary IDs/,
  )
}

function readSql(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8').replaceAll('\r\n', '\n')
}

test('CLIL migration is additive, transactional, and collision-aborting', () => {
  const sql = readSql(CLIL_MIGRATION)
  const openerSql = readSql(OPENER_MIGRATION)
  const storySql = readSql(STORY_MIGRATION)
  const liaSql = readSql(LIA_MIGRATION)
  const grammarSql = readSql(GRAMMAR_MIGRATION)

  assert.match(sql, /^\s*begin;/m)
  assert.match(sql, /^\s*commit;/m)
  assert.equal((sql.match(/^\s*begin;/gm) ?? []).length, 1)
  assert.equal((sql.match(/^\s*commit;/gm) ?? []).length, 1)
  assert.doesNotMatch(sql, /on conflict/i)
  assert.doesNotMatch(sql, /\bupdate\b/i)
  assert.doesNotMatch(sql, /\bdelete\b/i)
  assert.match(sql, /precondition failed/i)
  assert.match(sql, /assertion failed/i)
  assert.match(sql, /expected approved NLL baseline 4\/33\/33\/6/)
  assert.match(sql, /expected post-insert totals 5\/44\/44\/6/)
  assert.match(sql, /be3-u08-clil-pe/)
  assert.match(sql, /Big English 3 Unit 8 Content Connection \/ P\.E\./)
  assert.match(sql, new RegExp(CLIL_COMPONENT_ID))
  assert.match(sql, /expected zero CLIL SS links/)
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
  assert.doesNotMatch(openerSql, /be3-u08-clil-pe/)
  assert.match(storySql, /be3-u08-story/)
  assert.doesNotMatch(storySql, /be3-u08-clil-pe/)
  assert.match(liaSql, /be3-u08-lia/)
  assert.doesNotMatch(liaSql, /be3-u08-clil-pe/)
  assert.match(grammarSql, /be3-u08-grammar/)
  assert.doesNotMatch(grammarSql, /be3-u08-clil-pe/)

  assert.match(sql, /be3-u08-opener/)
  assert.match(sql, /be3-u08-story/)
  assert.match(sql, /be3-u08-lia/)
  assert.match(sql, /be3-u08-grammar/)
  assert.match(sql, new RegExp(OPENER_COMPONENT_ID))
  assert.match(sql, new RegExp(STORY_COMPONENT_ID))
  assert.match(sql, new RegExp(LIA_COMPONENT_ID))
  assert.match(sql, new RegExp(GRAMMAR_COMPONENT_ID))
})

test('CLIL migration encodes exact pairwise summary payloads and memberships', () => {
  const sql = readSql(CLIL_MIGRATION)

  for (const [activityId, position] of MEMBERSHIPS) {
    assert.match(
      sql,
      new RegExp(`'${CLIL_COMPONENT_ID}', '${activityId}', ${position}`),
    )
  }

  assertExactClilSummaryPayloads(sql, ACCEPTED_SUMMARIES)

  assert.match(sql, new RegExp(SB_CANONICAL_SHA256))
  assert.match(sql, new RegExp(WB_CANONICAL_SHA256))
  assert.match(sql, /clil-a-step-a-knowledge-prep-v0\.1/)
  assert.doesNotMatch(sql, /legacy_version/)
})

test('exact CLIL summary-payload validator rejects swapped or corrupted pairings', () => {
  const sql = readSql(CLIL_MIGRATION)
  assertExactClilSummaryPayloads(sql, ACCEPTED_SUMMARIES)

  const swappedTexts = ACCEPTED_SUMMARIES.map((row, index, rows) => {
    if (index === 0) return { ...row, summaryText: rows[1]!.summaryText }
    if (index === 1) return { ...row, summaryText: rows[0]!.summaryText }
    return row
  })
  assert.throws(
    () => assertExactClilSummaryPayloads(sql, swappedTexts),
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
    () => assertExactClilSummaryPayloads(sql, wrongFingerprint),
    /missing exact paired summary payload/,
  )

  const alteredProvenanceSql = sql.replaceAll(
    '"prompt_version":"clil-a-step-a-knowledge-prep-v0.1"',
    '"prompt_version":"mutated-prompt-version"',
  )
  assert.throws(
    () => assertExactClilSummaryPayloads(alteredProvenanceSql, ACCEPTED_SUMMARIES),
    /missing exact paired summary payload/,
  )
})

test('CLIL summaries remain hidden unless experimental knowledge is explicitly included', () => {
  const component = {
    id: CLIL_COMPONENT_ID,
    component_key: 'be3-u08-clil-pe',
    title: 'Big English 3 Unit 8 Content Connection / P.E.',
    status: 'draft' as const,
    created_at: '2026-10-30T00:00:00.000Z',
  }
  const memberships = MEMBERSHIPS.map(([activityId, position]) => ({
    component_id: CLIL_COMPONENT_ID,
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
  assert.equal(normal.activities.filter((activity) => activity.preferredSummary).length, 0)
  assert.equal(normal.proposedSsLinks.length, 0)
  assert.deepEqual(normal.curriculumAuthorityLinks, [])

  const hidden = assembleNeutralLessonComponent({
    component,
    memberships,
    summaries,
    ssLinks: [],
    includeHiddenExperimental: true,
  })
  assert.equal(hidden.activities.filter((activity) => activity.preferredSummary).length, 11)
  assert.deepEqual(
    hidden.activities.map((activity) => activity.activityId),
    MEMBERSHIPS.map(([activityId]) => activityId),
  )
  assert.equal(hidden.proposedSsLinks.length, 0)
})
