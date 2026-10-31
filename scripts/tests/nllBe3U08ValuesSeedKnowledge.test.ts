/**
 * Focused Values NLL knowledge-seed validation (modal summaries only).
 * Migration is prepared locally; application remains a separate gate.
 * Run: npx tsx --test scripts/tests/nllBe3U08ValuesSeedKnowledge.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  assembleNeutralLessonComponent,
  fingerprintCanonicalActivity,
} from '../../app/src/features/nll/neutralLessonLibrary.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261030220000_seed_nll_be3_u08_values.sql',
)
const REVIEW_MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261030210000_seed_nll_be3_u08_review.sql',
)

const COMPONENT_ID = '3e800008-0000-4000-8000-000000000010'
const SS_LINK_ID = '3e800008-0000-4000-8000-000000001001'
const SB_CANONICAL_PATH = 'big-english/big_english_3_sb/canonical/v1.json'
const SB_CANONICAL_SHA256 =
  '3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6'
const SS_SHA256 =
  'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a'

const MEMBERSHIPS = [
  ['bep3_sb_act_08_36', 1],
  ['bep3_sb_act_08_37', 2],
  ['bep3_sb_act_08_38', 3],
] as const

type SummaryPayload = {
  readonly id: string
  readonly activityId: string
  readonly summaryText: string
  readonly activitySha256: string
}

const ACCEPTED_SUMMARIES: readonly SummaryPayload[] = [
  {
    id: 'big_english_3_sb_unit_08_activity_36_summary_values_nll_v1',
    activityId: 'bep3_sb_act_08_36',
    summaryText:
      'Students listen to Audio 168 and classify four pictured activities as healthy or unhealthy.',
    activitySha256:
      '904d555171527fc0edb93360096c82c48ba1031048209bddcf2f96ccf3b3fd97',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_37_summary_values_nll_v1',
    activityId: 'bep3_sb_act_08_37',
    summaryText:
      'Students use the publisher language frames to tell a partner to do healthy things.',
    activitySha256:
      '28c0f42aa137bf610df5a35223101738043cf0a0f4d7fc6e2bd1c058431880b4',
  },
  {
    id: 'big_english_3_sb_unit_08_activity_38_summary_values_nll_v1',
    activityId: 'bep3_sb_act_08_38',
    summaryText:
      'Students invent an outdoor game with a group, write the rules, and teach it to the class.',
    activitySha256:
      '4b150a90e379b435969e2977869f48d972236ff56898575928177a58ba7f740e',
  },
]

function sqlStringLiteral(value: string): string {
  return "'" + value.replaceAll("'", "''") + "'"
}

function provenanceJson(): string {
  return JSON.stringify({
    record_type: 'teacher_friendly_summary',
    source: 'SB',
    verification_status: 'human_verified',
    original_review_status: 'experimental_review_required',
    generation: {
      method: 'human_authored_from_canonical_evidence',
      prompt_version: 'values-nll-knowledge-prep-v0.1',
    },
  })
}

function encodeSummaryInsertRow(row: SummaryPayload): string {
  return `(
    ${sqlStringLiteral(row.id)},
    ${sqlStringLiteral(row.activityId)}, 1,
    ${sqlStringLiteral(row.summaryText)},
    ${sqlStringLiteral(SB_CANONICAL_PATH)},
    ${sqlStringLiteral(SB_CANONICAL_SHA256)},
    ${sqlStringLiteral(row.activitySha256)},
    'sufficient', 'hidden', 'experimental', true,
    ${sqlStringLiteral(provenanceJson())}
  )`
}

function readSql(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8').replaceAll('\r\n', '\n')
}

test('Values migration is additive, transactional, and collision-aborting', () => {
  const sql = readSql(MIGRATION)
  assert.ok(fs.existsSync(REVIEW_MIGRATION))
  assert.match(sql, /^\s*begin;/m)
  assert.match(sql, /^\s*commit;/m)
  assert.equal((sql.match(/^\s*begin;/gm) ?? []).length, 1)
  assert.equal((sql.match(/^\s*commit;/gm) ?? []).length, 1)
  assert.doesNotMatch(sql, /on conflict/i)
  assert.doesNotMatch(sql, /\bupdate\b/i)
  assert.doesNotMatch(sql, /\bdelete\b/i)
  assert.match(sql, /precondition failed/i)
  assert.match(sql, /assertion failed/i)
  assert.ok(sql.includes('expected post-Review NLL baseline 9/74/74/9'))
  assert.ok(sql.includes('expected post-insert totals 10/77/77/10'))
  assert.match(sql, /be3-u08-values/)
  assert.match(sql, /Big English 3 Unit 8 Values/)
  assert.match(sql, new RegExp(COMPONENT_ID))
  assert.match(sql, /'sufficient', 'hidden', 'experimental', true/)
  assert.doesNotMatch(sql, /create table/i)
  assert.doesNotMatch(sql, /alter table/i)
  assert.doesNotMatch(sql, /bep_3_wb_/)
  assert.doesNotMatch(sql, /VITE_/)
  assert.doesNotMatch(sql, /insert into public\.(?!nll_)/i)
  assert.match(sql, /no Values package\/renderer\/adapter\/flag/)
})

test('Values migration seeds exact SB-only memberships, summaries, and SS link', () => {
  const sql = readSql(MIGRATION)
  for (const [activityId, position] of MEMBERSHIPS) {
    assert.ok(
      sql.includes(`('${COMPONENT_ID}', '${activityId}', ${position})`),
      `missing membership ${activityId}`,
    )
  }
  for (const row of ACCEPTED_SUMMARIES) {
    assert.ok(sql.includes(encodeSummaryInsertRow(row)), `missing insert ${row.id}`)
  }
  assert.ok(sql.includes(SS_LINK_ID))
  assert.ok(sql.includes(`'8', 6, 'Values', 'proposed'`))
  assert.ok(sql.includes(SS_SHA256))
  assert.match(sql, /column 6 Get exercise/)
})

test('Values activity fingerprints match fingerprintCanonicalActivity on local SB canonical', async () => {
  const canonicalPath = path.join(
    ROOT,
    'data/phase1/big_english_3_sb/canonical/v1.json',
  )
  const canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8')) as {
    readonly activities: ReadonlyArray<Record<string, unknown>>
  }
  for (const row of ACCEPTED_SUMMARIES) {
    const activity = canonical.activities.find((a) => a.activity_id === row.activityId)
    assert.ok(activity, `missing canonical activity ${row.activityId}`)
    const fingerprint = await fingerprintCanonicalActivity(activity)
    assert.equal(fingerprint, row.activitySha256, row.activityId)
  }
})

test('Values assemble path yields three preferred hidden experimental summaries', () => {
  const component = {
    id: COMPONENT_ID,
    component_key: 'be3-u08-values',
    title: 'Big English 3 Unit 8 Values',
    status: 'draft' as const,
    created_at: '2026-10-31T00:00:00.000Z',
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
    canonical_path: SB_CANONICAL_PATH,
    canonical_sha256: SB_CANONICAL_SHA256,
    activity_sha256: row.activitySha256,
    evidence_status: 'sufficient' as const,
    display_status: 'hidden' as const,
    review_state: 'experimental' as const,
    is_preferred: true,
    provenance: {
      record_type: 'teacher_friendly_summary',
      source: 'SB',
    },
    created_at: '2026-10-31T00:00:00.000Z',
  }))

  const withoutHidden = assembleNeutralLessonComponent({
    component,
    memberships,
    summaries,
    ssLinks: [],
    includeHiddenExperimental: false,
  })
  assert.equal(
    withoutHidden.activities.filter((a) => a.preferredSummary != null).length,
    0,
  )

  const withHidden = assembleNeutralLessonComponent({
    component,
    memberships,
    summaries,
    ssLinks: [
      {
        id: SS_LINK_ID,
        component_id: COMPONENT_ID,
        ss_path: 'big-english/big_english_3_sb/canonical/ss_v1.json',
        ss_sha256: SS_SHA256,
        unit_number_raw: '8',
        column_order: 6,
        category_name_raw: 'Values',
        status: 'proposed',
        created_at: '2026-10-31T00:00:00.000Z',
      },
    ],
    includeHiddenExperimental: true,
  })
  assert.equal(withHidden.activities.length, 3)
  assert.deepEqual(
    withHidden.activities.map((a) => a.activityId),
    MEMBERSHIPS.map(([id]) => id),
  )
  assert.ok(withHidden.activities.every((a) => a.preferredSummary != null))
  assert.equal(withHidden.proposedSsLinks.length, 1)
  assert.equal(withHidden.curriculumAuthorityLinks.length, 0)
})
