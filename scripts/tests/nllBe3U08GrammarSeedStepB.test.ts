/**
 * Focused Grammar-A Step B seed-validation tests.
 * Does not rewrite the accepted Opener, Story, or LiA NLL suites.
 * Run: npx tsx --test scripts/tests/nllBe3U08GrammarSeedStepB.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { assembleNeutralLessonComponent } from '../../app/src/features/nll/neutralLessonLibrary.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const GRAMMAR_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261030160000_seed_nll_be3_u08_grammar.sql',
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

const GRAMMAR_COMPONENT_ID = '3e800008-0000-4000-8000-000000000004'
const STRUCTURES_LINK_ID = '3e800008-0000-4000-8000-000000000401'
const OPENER_COMPONENT_ID = '3e800008-0000-4000-8000-000000000001'
const STORY_COMPONENT_ID = '3e800008-0000-4000-8000-000000000002'
const LIA_COMPONENT_ID = '3e800008-0000-4000-8000-000000000003'

const SB_CANONICAL_PATH = 'big-english/big_english_3_sb/canonical/v1.json'
const WB_CANONICAL_PATH = 'big-english/big_english_3_wb/canonical/v1.json'
const SB_CANONICAL_SHA256 =
  '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6'
const WB_CANONICAL_SHA256 =
  '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa'

const MEMBERSHIPS = [
  ['bep3_sb_act_08_19', 1],
  ['bep3_sb_act_08_20', 2],
  ['bep3_sb_act_08_21', 3],
  ['bep3_sb_act_08_22', 4],
  ['bep3_sb_act_08_23', 5],
  ['bep_3_wb_act_111_15', 6],
  ['bep_3_wb_act_111_16', 7],
  ['bep_3_wb_act_111_17', 8],
  ['bep_3_wb_act_112_18', 9],
  ['bep_3_wb_act_112_19', 10],
] as const

type GrammarSummaryPayload = {
  readonly id: string
  readonly activityId: string
  readonly summaryText: string
  readonly canonicalPath: string
  readonly canonicalSha256: string
  readonly activitySha256: string
  readonly source: 'SB' | 'WB'
}

const ACCEPTED_SUMMARIES: readonly GrammarSummaryPayload[] = [
  {
    id: 'big_english_3_sb_unit_08_activity_19_summary_grammar_a_v1',
    activityId: 'bep3_sb_act_08_19',
    summaryText:
      "Students look, listen to Audio 159, and read the dialogue to answer how Donna's dad came home.",
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      'aa749d55fdc96f1b08efa95824c688bd06d5af786013c2ec9064397c5fe0133c',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_20_summary_grammar_a_v1',
    activityId: 'bep3_sb_act_08_20',
    summaryText:
      'Students copy the regular-past spelling chart and complete it by sorting the word-box verbs into the chart columns.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      'cf280c387907a1cdfe41919cc7845ccc442247273b78f306d4c86665d1ea12e4',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_21_summary_grammar_a_v1',
    activityId: 'bep3_sb_act_08_21',
    summaryText: 'Students read and complete a nine-item past-form narrative gap-fill.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      '3b39624df961791c53e2f095bbc57f9833146d8b209e431ed7e847223412237b',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_22_summary_grammar_a_v1',
    activityId: 'bep3_sb_act_08_22',
    summaryText: 'Students match eight base verbs to their irregular past forms.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      'aabd99915eddb739229a9a3f24d7e1a03ef85021e5afda1dd8d8c62da2077ec7',
    source: 'SB',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_23_summary_grammar_a_v1',
    activityId: 'bep3_sb_act_08_23',
    summaryText:
      'Students tell a partner what they did yesterday, using the verified model frames.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      '50e5750d70b5af0f8816bfcf599945496db1ae9694bb30cb749f21722b5d6052',
    source: 'SB',
  },
  {
    id: 'big_english_3_wb_unit_08_p111_activity_15_summary_grammar_a_v1',
    activityId: 'bep_3_wb_act_111_15',
    summaryText:
      'Students complete the regular-past spelling chart by sorting the word-box verbs into the given columns.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      'c1cfb0e700232a8b83a074e73af78fa6bb4f5c0fb2a62440b38d183649e543b2',
    source: 'WB',
  },
  {
    id: 'big_english_3_wb_unit_08_p111_activity_16_summary_grammar_a_v1',
    activityId: 'bep_3_wb_act_111_16',
    summaryText: 'Students write the simple-past forms of ten irregular verbs.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      '5fe70c5bb93e7b475182257435f7d875e7e96d4372c3336fc04ad3a57b1d7678',
    source: 'WB',
  },
  {
    id: 'big_english_3_wb_unit_08_p111_activity_17_summary_grammar_a_v1',
    activityId: 'bep_3_wb_act_111_17',
    summaryText:
      'Students complete a thirteen-item narrative cloze with the correct past forms of the verbs in parentheses.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      'e49a9db3deec16cf04c1bb1a6d2118141eeac90b3444f5d2240667e7a4d28bbc',
    source: 'WB',
  },
  {
    id: 'big_english_3_wb_unit_08_p112_activity_18_summary_grammar_a_v1',
    activityId: 'bep_3_wb_act_112_18',
    summaryText:
      'Students use the page models and illustrations to complete six questions and answers about past activities.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      'c95ce7e9e36352db1d38107f5667d8c613b0944db36884a4e1a7fb718feb39f4',
    source: 'WB',
  },
  {
    id: 'big_english_3_wb_unit_08_p112_activity_19_summary_grammar_a_v1',
    activityId: 'bep_3_wb_act_112_19',
    summaryText:
      "Students rewrite three affirmative past sentences as negatives with didn't.",
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      '3868686e77c2d55c8692ae183162fc28ec95d3e32d5feea77cf911ce5a018073',
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
      prompt_version: 'grammar-a-step-a-knowledge-prep-v0.1',
    },
  })
}

/** Exact insert VALUES-row encoding (paired id/activity/text/bindings/provenance). */
function encodeGrammarSummaryInsertRow(row: GrammarSummaryPayload): string {
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

/** Exact post-assertion expected VALUES-row encoding (includes ::jsonb cast). */
function encodeGrammarSummaryAssertionRow(row: GrammarSummaryPayload): string {
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

function assertExactGrammarSummaryPayloads(
  sql: string,
  payloads: readonly GrammarSummaryPayload[],
): void {
  assert.equal(payloads.length, 10, 'expected exactly ten Grammar summary payloads')
  assert.equal(
    new Set(payloads.map((row) => row.id)).size,
    10,
    'summary IDs must be unique',
  )
  assert.equal(
    new Set(payloads.map((row) => row.activityId)).size,
    10,
    'activity IDs must be unique',
  )

  for (const row of payloads) {
    assert.ok(
      sql.includes(encodeGrammarSummaryInsertRow(row)),
      `missing exact paired summary payload for ${row.id} / ${row.activityId}`,
    )
    assert.ok(
      sql.includes(encodeGrammarSummaryAssertionRow(row)),
      `missing exact assertion mapping for ${row.id} / ${row.activityId}`,
    )
  }

  assert.match(
    sql,
    /Grammar summary rows do not exactly match the accepted payload mapping/,
  )
  assert.match(sql, /\bexcept\b/i)
  assert.match(
    sql,
    /expected exactly ten summaries for Grammar activity IDs/,
  )
  assert.match(
    sql,
    /expected exactly the ten accepted Grammar summary IDs/,
  )
}

function readSql(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8').replaceAll('\r\n', '\n')
}

test('Grammar migration is additive, transactional, and collision-aborting', () => {
  const sql = readSql(GRAMMAR_MIGRATION)
  const openerSql = readSql(OPENER_MIGRATION)
  const storySql = readSql(STORY_MIGRATION)
  const liaSql = readSql(LIA_MIGRATION)

  assert.match(sql, /^\s*begin;/m)
  assert.match(sql, /^\s*commit;/m)
  assert.equal((sql.match(/^\s*begin;/gm) ?? []).length, 1)
  assert.equal((sql.match(/^\s*commit;/gm) ?? []).length, 1)
  assert.doesNotMatch(sql, /on conflict/i)
  assert.doesNotMatch(sql, /\bupdate\b/i)
  assert.doesNotMatch(sql, /\bdelete\b/i)
  assert.match(sql, /precondition failed/i)
  assert.match(sql, /assertion failed/i)
  assert.match(sql, /expected approved NLL baseline 3\/23\/23\/5/)
  assert.match(sql, /expected post-insert totals 4\/33\/33\/6/)
  assert.match(sql, /be3-u08-grammar/)
  assert.match(sql, /Big English 3 Unit 8 Grammar/)
  assert.match(sql, new RegExp(GRAMMAR_COMPONENT_ID))
  assert.match(sql, new RegExp(STRUCTURES_LINK_ID))
  assert.match(sql, /'Structures'/)
  assert.match(sql, /status = 'proposed'/)
  assert.match(sql, /'sufficient', 'hidden', 'experimental', true/)
  assert.match(sql, /display_status/)
  assert.match(sql, /review_state/)
  assert.match(sql, /evidence_status/)
  assert.match(sql, /is_preferred/)
  assert.doesNotMatch(sql, /'I can\.\.\.'/)
  assert.doesNotMatch(sql, /'Vocabulary'/)
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
  assert.match(openerSql, new RegExp(OPENER_COMPONENT_ID))
  assert.doesNotMatch(openerSql, /be3-u08-grammar/)
  assert.match(storySql, /be3-u08-story/)
  assert.match(storySql, new RegExp(STORY_COMPONENT_ID))
  assert.doesNotMatch(storySql, /be3-u08-grammar/)
  assert.match(liaSql, /be3-u08-lia/)
  assert.match(liaSql, new RegExp(LIA_COMPONENT_ID))
  assert.doesNotMatch(liaSql, /be3-u08-grammar/)

  assert.match(sql, /be3-u08-opener/)
  assert.match(sql, /be3-u08-story/)
  assert.match(sql, /be3-u08-lia/)
  assert.match(sql, new RegExp(OPENER_COMPONENT_ID))
  assert.match(sql, new RegExp(STORY_COMPONENT_ID))
  assert.match(sql, new RegExp(LIA_COMPONENT_ID))
})

test('Grammar migration encodes exact pairwise summary payloads and memberships', () => {
  const sql = readSql(GRAMMAR_MIGRATION)

  for (const [activityId, position] of MEMBERSHIPS) {
    assert.match(
      sql,
      new RegExp(`'${GRAMMAR_COMPONENT_ID}', '${activityId}', ${position}`),
    )
  }

  assertExactGrammarSummaryPayloads(sql, ACCEPTED_SUMMARIES)

  assert.match(sql, new RegExp(SB_CANONICAL_SHA256))
  assert.match(sql, new RegExp(WB_CANONICAL_SHA256))
  assert.match(sql, /f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a/)
  assert.match(sql, /grammar-a-step-a-knowledge-prep-v0\.1/)
  assert.doesNotMatch(sql, /legacy_version/)

  const ssInsertMatches = sql.match(/insert into public\.nll_ss_component_links[\s\S]*?;/gi) ?? []
  assert.equal(ssInsertMatches.length, 1)
  assert.match(ssInsertMatches[0]!, /'Structures'/)
  assert.doesNotMatch(ssInsertMatches[0]!, /I can/)
  assert.doesNotMatch(ssInsertMatches[0]!, /Vocabulary/)
})

test('exact summary-payload validator rejects swapped or corrupted pairings', () => {
  const sql = readSql(GRAMMAR_MIGRATION)
  assertExactGrammarSummaryPayloads(sql, ACCEPTED_SUMMARIES)

  const swappedTexts = ACCEPTED_SUMMARIES.map((row, index, rows) => {
    if (index === 0) return { ...row, summaryText: rows[1]!.summaryText }
    if (index === 1) return { ...row, summaryText: rows[0]!.summaryText }
    return row
  })
  assert.throws(
    () => assertExactGrammarSummaryPayloads(sql, swappedTexts),
    /missing exact paired summary payload/,
  )

  const wrongActivity = ACCEPTED_SUMMARIES.map((row, index, rows) => {
    if (index === 0) return { ...row, activityId: rows[1]!.activityId }
    if (index === 1) return { ...row, activityId: rows[0]!.activityId }
    return row
  })
  assert.throws(
    () => assertExactGrammarSummaryPayloads(sql, wrongActivity),
    /missing exact paired summary payload/,
  )

  const wrongSource = ACCEPTED_SUMMARIES.map((row, index) =>
    index === 0 ? { ...row, source: 'WB' as const } : row,
  )
  assert.throws(
    () => assertExactGrammarSummaryPayloads(sql, wrongSource),
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
    () => assertExactGrammarSummaryPayloads(sql, wrongFingerprint),
    /missing exact paired summary payload/,
  )

  const alteredProvenanceSql = sql.replaceAll(
    '"prompt_version":"grammar-a-step-a-knowledge-prep-v0.1"',
    '"prompt_version":"mutated-prompt-version"',
  )
  assert.throws(
    () => assertExactGrammarSummaryPayloads(alteredProvenanceSql, ACCEPTED_SUMMARIES),
    /missing exact paired summary payload/,
  )

  const removedProvenanceSql = sql.replaceAll(
    '"original_review_status":"experimental_review_required",',
    '',
  )
  assert.throws(
    () => assertExactGrammarSummaryPayloads(removedProvenanceSql, ACCEPTED_SUMMARIES),
    /missing exact paired summary payload/,
  )
})

test('Grammar summaries remain hidden unless experimental knowledge is explicitly included', () => {
  const component = {
    id: GRAMMAR_COMPONENT_ID,
    component_key: 'be3-u08-grammar',
    title: 'Big English 3 Unit 8 Grammar',
    status: 'draft' as const,
    created_at: '2026-10-30T00:00:00.000Z',
  }
  const memberships = MEMBERSHIPS.map(([activityId, position]) => ({
    component_id: GRAMMAR_COMPONENT_ID,
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
      id: STRUCTURES_LINK_ID,
      component_id: GRAMMAR_COMPONENT_ID,
      ss_path: 'big-english/big_english_3_sb/canonical/ss_v1.json',
      ss_sha256: 'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
      unit_number_raw: '8',
      column_order: 2,
      category_name_raw: 'Structures',
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
  assert.equal(normal.activities.filter((activity) => activity.preferredSummary).length, 0)
  assert.equal(normal.proposedSsLinks.length, 1)
  assert.equal(normal.proposedSsLinks[0]?.category_name_raw, 'Structures')
  assert.deepEqual(normal.curriculumAuthorityLinks, [])

  const hidden = assembleNeutralLessonComponent({
    component,
    memberships,
    summaries,
    ssLinks,
    includeHiddenExperimental: true,
  })
  assert.equal(hidden.activities.filter((activity) => activity.preferredSummary).length, 10)
  assert.deepEqual(
    hidden.activities.map((activity) => activity.activityId),
    MEMBERSHIPS.map(([activityId]) => activityId),
  )
})
