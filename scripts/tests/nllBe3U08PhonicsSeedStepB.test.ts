/**
 * Focused Phonics-A Step B seed-validation tests.
 * Run: npx tsx --test scripts/tests/nllBe3U08PhonicsSeedStepB.test.ts
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
  'supabase/migrations/20261030200000_seed_nll_be3_u08_phonics.sql',
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

const COMPONENT_ID = '3e800008-0000-4000-8000-000000000008'
const LINK_ID = '3e800008-0000-4000-8000-000000000801'
const OPENER_COMPONENT_ID = '3e800008-0000-4000-8000-000000000001'
const STORY_COMPONENT_ID = '3e800008-0000-4000-8000-000000000002'
const LIA_COMPONENT_ID = '3e800008-0000-4000-8000-000000000003'
const GRAMMAR_COMPONENT_ID = '3e800008-0000-4000-8000-000000000004'
const CLIL_COMPONENT_ID = '3e800008-0000-4000-8000-000000000005'
const CULTURE_COMPONENT_ID = '3e800008-0000-4000-8000-000000000006'
const WRITING_COMPONENT_ID = '3e800008-0000-4000-8000-000000000007'

const SB_CANONICAL_PATH = 'big-english/big_english_3_sb/canonical/v1.json'
const WB_CANONICAL_PATH = 'big-english/big_english_3_wb/canonical/v1.json'
const SB_CANONICAL_SHA256 =
  '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6'
const WB_CANONICAL_SHA256 =
  '811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa'
const SS_SHA256 =
  'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a'

const MEMBERSHIPS = [
  ['bep3_sb_act_08_32', 1],
  ['bep3_sb_act_08_33', 2],
  ['bep3_sb_act_08_34', 3],
  ['bep3_sb_act_08_35', 4],
  ['bep_3_wb_act_116_27', 5],
  ['bep_3_wb_act_116_28', 6],
  ['bep_3_wb_act_116_29', 7],
  ['bep_3_wb_act_116_30', 8],
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
    id: 'big_english_3_sb_unit_08_activity_32_summary_phonics_a_v1',
    activityId: 'bep3_sb_act_08_32',
    summaryText:
      'Students listen, read, and repeat the graphemes all, au, and aw with Audio 163; no keyed answers, transcript, IPA, or invented pronunciation rule is added.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      'eb079a327bed4964226ab499f4dbb05278a91856192c33be0f0b1953a4b262c6',
    source: 'SB' as const,
  },
  {
    id: 'big_english_3_sb_unit_08_activity_33_summary_phonics_a_v1',
    activityId: 'bep3_sb_act_08_33',
    summaryText:
      'Students listen to Audio 164, find publisher targets ball, haul, and draw, and say them, preserving the visual dependency without inventing further words or a transcript.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      '07fa8309f46baa30993982081c74700bc47fde4c947a093da9715fb9d6376760',
    source: 'SB' as const,
  },
  {
    id: 'big_english_3_sb_unit_08_activity_34_summary_phonics_a_v1',
    activityId: 'bep3_sb_act_08_34',
    summaryText:
      'Students listen to Audio 165 and blend eight keyed publisher words; keyed answers remain protected and are not treated as an open word list or reconstructed if excluded.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      'd6df47a6bbbc3523d399ff3437c63918f8df4fd71fad83ec903a437746c79309',
    source: 'SB' as const,
  },
  {
    id: 'big_english_3_sb_unit_08_activity_35_summary_phonics_a_v1',
    activityId: 'bep3_sb_act_08_35',
    summaryText:
      'Students read aloud, then listen and chant with Audio 166 using chant evidence bep3_sb_text_08_06 by identity and role only; excluding this activity removes chant evidence everywhere without reconstructing the chant text.',
    canonicalPath: SB_CANONICAL_PATH,
    canonicalSha256: SB_CANONICAL_SHA256,
    activitySha256:
      '1814770428f06a23c53928bab33ff843b29a5632b639c15733135cb51f01769a',
    source: 'SB' as const,
  },
  {
    id: 'big_english_3_wb_unit_08_p116_activity_27_summary_phonics_a_v1',
    activityId: 'bep_3_wb_act_116_27',
    summaryText:
      'Students read and circle all, au, and aw in the publisher word box; keyed circle targets remain protected without inventing additional words.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      '247fb95700c8ec1877a65266ea8979bea5550c8d289631f59d5df5e4e30569a5',
    source: 'WB' as const,
  },
  {
    id: 'big_english_3_wb_unit_08_p116_activity_28_summary_phonics_a_v1',
    activityId: 'bep_3_wb_act_116_28',
    summaryText:
      'Students underline publisher all, au, and aw words in two sentences and read aloud without inventing sentences or reconstructing excluded underlines.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      '2fb3d4c9e46c8fc7db0353e65495739fc3b7dbd67e43d8b37c35b71b48b8acb1',
    source: 'WB' as const,
  },
  {
    id: 'big_english_3_wb_unit_08_p116_activity_29_summary_phonics_a_v1',
    activityId: 'bep_3_wb_act_116_29',
    summaryText:
      'Students connect letter parts and write three keyed words without inventing spellings or reconstructing excluded connect/write items.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      'c580dacd102dfc89b4cc7398453e10e363742444d793abdbeacdbfbe0f232dea',
    source: 'WB' as const,
  },
  {
    id: 'big_english_3_wb_unit_08_p116_activity_30_summary_phonics_a_v1',
    activityId: 'bep_3_wb_act_116_30',
    summaryText:
      'Students listen to Audio 167 and complete five chant-gap prompts; no invented transcript or reconstructed chant answers are added beyond the canonical gap evidence.',
    canonicalPath: WB_CANONICAL_PATH,
    canonicalSha256: WB_CANONICAL_SHA256,
    activitySha256:
      '7b4e92ac24c6ad5e026ac0d6c29ff23d278007770d501922078724d475021270',
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
      prompt_version: 'phonics-a-step-a-knowledge-prep-v0.1',
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
  assert.equal(payloads.length, 8, 'expected exact summary payload count')
  assert.equal(new Set(payloads.map((row) => row.id)).size, 8)
  assert.equal(new Set(payloads.map((row) => row.activityId)).size, 8)
  for (const row of payloads) {
    assert.ok(sql.includes(encodeSummaryInsertRow(row)), `missing insert payload for ${row.id}`)
    assert.ok(sql.includes(encodeSummaryAssertionRow(row)), `missing assertion payload for ${row.id}`)
  }
  assert.match(sql, /summary rows do not exactly match the accepted payload mapping/)
}

function readSql(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8').replaceAll('\r\n', '\n')
}

test('Phonics migration is additive, transactional, and collision-aborting', () => {
  const sql = readSql(MIGRATION)
  const openerSql = readSql(OPENER_MIGRATION)
  const storySql = readSql(STORY_MIGRATION)
  const liaSql = readSql(LIA_MIGRATION)
  const grammarSql = readSql(GRAMMAR_MIGRATION)
  const clilSql = readSql(CLIL_MIGRATION)
  const cultureSql = readSql(CULTURE_MIGRATION)
  const writingSql = readSql(WRITING_MIGRATION)

  assert.match(sql, /^\s*begin;/m)
  assert.match(sql, /^\s*commit;/m)
  assert.equal((sql.match(/^\s*begin;/gm) ?? []).length, 1)
  assert.equal((sql.match(/^\s*commit;/gm) ?? []).length, 1)
  assert.doesNotMatch(sql, /on conflict/i)
  assert.doesNotMatch(sql, /\bupdate\b/i)
  assert.doesNotMatch(sql, /\bdelete\b/i)
  assert.match(sql, /precondition failed/i)
  assert.match(sql, /assertion failed/i)
  assert.ok(sql.includes('expected approved NLL baseline 7/60/60/8'))
  assert.ok(sql.includes('expected post-insert totals 8/68/68/9'))
  assert.match(sql, /be3-u08-phonics/)
  assert.match(sql, /Big English 3 Unit 8 Phonics/)
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
  assert.match(sql, /'Phonics'/)
  assert.doesNotMatch(sql, /'Writing'/)
  assert.doesNotMatch(sql, /'Values'/)
  assert.doesNotMatch(sql, /'I can\.\.\.'/)
  assert.doesNotMatch(sql, /'Structures'/)
  assert.doesNotMatch(sql, /'Vocabulary'/)
  assert.doesNotMatch(sql, /'CLIL\/Culture'/)

  assert.match(openerSql, /be3-u08-opener/)
  assert.doesNotMatch(openerSql, /be3-u08-phonics/)
  assert.match(storySql, /be3-u08-story/)
  assert.doesNotMatch(storySql, /be3-u08-phonics/)
  assert.match(liaSql, /be3-u08-lia/)
  assert.doesNotMatch(liaSql, /be3-u08-phonics/)
  assert.match(grammarSql, /be3-u08-grammar/)
  assert.doesNotMatch(grammarSql, /be3-u08-phonics/)
  assert.match(clilSql, /be3-u08-clil-pe/)
  assert.doesNotMatch(clilSql, /be3-u08-phonics/)
  assert.match(cultureSql, /be3-u08-culture/)
  assert.doesNotMatch(cultureSql, /be3-u08-phonics/)
  assert.match(writingSql, /be3-u08-writing/)
  assert.doesNotMatch(writingSql, /be3-u08-phonics/)
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
})

test('Phonics migration encodes exact pairwise summary payloads and memberships', () => {
  const sql = readSql(MIGRATION)
  for (const [activityId, position] of MEMBERSHIPS) {
    assert.match(sql, new RegExp(`'${COMPONENT_ID}', '${activityId}', ${position}`))
  }
  assertExactSummaryPayloads(sql, ACCEPTED_SUMMARIES)
  assert.match(sql, new RegExp(SB_CANONICAL_SHA256))
  assert.match(sql, new RegExp(WB_CANONICAL_SHA256))
  assert.match(sql, /phonics-a-step-a-knowledge-prep-v0\.1/)
  assert.doesNotMatch(sql, /legacy_version/)

  assert.match(sql, new RegExp(LINK_ID))
  assert.match(sql, /'Phonics'/)
  assert.match(sql, /status = 'proposed'/)
  assert.match(sql, /expected exactly one proposed Phonics SS link/)
  assert.match(sql, new RegExp(SS_SHA256))
  const ssInsertMatches =
    sql.match(/insert into public\.nll_ss_component_links[\s\S]*?;/gi) ?? []
  assert.equal(ssInsertMatches.length, 1)
  assert.match(ssInsertMatches[0]!, /'Phonics'/)

})

test('exact Phonics summary-payload validator rejects swapped or corrupted pairings', () => {
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
  const altered = sql.replaceAll('"phonics-a-step-a-knowledge-prep-v0.1"', '"mutated-prompt-version"')
  assert.throws(() => assertExactSummaryPayloads(altered, ACCEPTED_SUMMARIES), /missing insert payload/)
})

test('Phonics summaries remain hidden unless experimental knowledge is explicitly included', () => {
  const component = {
    id: COMPONENT_ID,
    component_key: 'be3-u08-phonics',
    title: 'Big English 3 Unit 8 Phonics',
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
  const ssLinks = [
    {
      id: LINK_ID,
      component_id: COMPONENT_ID,
      ss_path: 'big-english/big_english_3_sb/canonical/ss_v1.json',
      ss_sha256: SS_SHA256,
      unit_number_raw: '8',
      column_order: 5,
      category_name_raw: 'Phonics',
      status: 'proposed' as const,
      created_at: '2026-10-30T00:00:00.000Z',
    },
  ]

  const normal = assembleNeutralLessonComponent({ component, memberships, summaries, ssLinks })
  assert.equal(normal.activities.filter((activity) => activity.preferredSummary).length, 0)
  assert.equal(normal.proposedSsLinks.length, 1)

  const hidden = assembleNeutralLessonComponent({
    component, memberships, summaries, ssLinks, includeHiddenExperimental: true,
  })
  assert.equal(hidden.activities.filter((activity) => activity.preferredSummary).length, 8)
  assert.deepEqual(
    hidden.activities.map((activity) => activity.activityId),
    MEMBERSHIPS.map(([activityId]) => activityId),
  )
  assert.equal(hidden.proposedSsLinks.length, 1)
})
