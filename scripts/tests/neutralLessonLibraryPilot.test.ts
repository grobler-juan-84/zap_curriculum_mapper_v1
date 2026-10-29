import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  assembleNeutralLessonComponent,
  fingerprintCanonicalActivity,
  type NllActivitySummaryRow,
  type NllComponentActivityRow,
  type NllComponentRow,
  type NllSsComponentLinkRow,
} from '../../app/src/features/nll/neutralLessonLibrary.ts'
import {
  buildNllShadowLessonPackage,
  isNllShadowPilotEnabled,
} from '../../app/src/features/nll/buildNllShadowLessonPackage.ts'
import {
  BE3_U08_ACTIVITY_SUMMARY_SIDECAR,
  BE3_U08_WB_ACTIVITY_SUMMARY_SIDECAR,
} from '../../app/src/features/chalkie/be3U08ActivityEnrichmentPoc.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const MIGRATION = path.join(
  ROOT,
  'supabase/migrations/20261029120000_create_nll_pilot.sql',
)
const COMPONENT_ID = '3e800008-0000-4000-8000-000000000001'
const ACTIVITY_ID = 'bep3_sb_act_08_01'

const component: NllComponentRow = {
  id: COMPONENT_ID,
  component_key: 'be3-u08-opener',
  title: 'Big English 3 Unit 8 Opener',
  status: 'draft',
  created_at: '2026-10-29T00:00:00.000Z',
}
const membership: NllComponentActivityRow = {
  component_id: COMPONENT_ID,
  activity_id: ACTIVITY_ID,
  position: 1,
}
const summaryV1: NllActivitySummaryRow = {
  id: 'summary-v1',
  activity_id: ACTIVITY_ID,
  version: 1,
  summary_text: 'Version one',
  canonical_path: 'big-english/big_english_3_sb/canonical/v1.json',
  canonical_sha256: 'a'.repeat(64),
  activity_sha256: 'b'.repeat(64),
  evidence_status: 'sufficient',
  display_status: 'hidden',
  review_state: 'experimental',
  is_preferred: true,
  provenance: { method: 'ai_assisted_draft' },
  created_at: '2026-10-29T00:00:00.000Z',
}
const proposedSsLink: NllSsComponentLinkRow = {
  id: 'link-1',
  component_id: COMPONENT_ID,
  ss_path: 'big-english/big_english_3_sb/canonical/ss_v1.json',
  ss_sha256: 'c'.repeat(64),
  unit_number_raw: '8',
  column_order: 1,
  category_name_raw: 'Vocabulary',
  status: 'proposed',
  created_at: '2026-10-29T00:00:00.000Z',
}

test('migration defines exactly four NLL tables and the bounded pilot row counts', () => {
  const sql = fs.readFileSync(MIGRATION, 'utf8')
  const tables = [...sql.matchAll(/create table if not exists public\.(nll_[a-z_]+)/g)].map(
    (match) => match[1],
  )
  assert.deepEqual(tables, [
    'nll_components',
    'nll_component_activities',
    'nll_activity_summaries',
    'nll_ss_component_links',
  ])

  const membershipSeed = sql.slice(
    sql.indexOf('insert into public.nll_component_activities'),
    sql.indexOf('on conflict (component_id, activity_id) do nothing;'),
  )
  assert.equal((membershipSeed.match(/'bep(?:3|_3)_(?:sb|wb)_act_[^']+'/g) ?? []).length, 9)

  const summarySeed = sql.slice(
    sql.indexOf('insert into public.nll_activity_summaries'),
    sql.indexOf('insert into public.nll_ss_component_links'),
  )
  assert.equal((summarySeed.match(/'big_english_3_(?:sb|wb)_[^']+_summary_poc_v1'/g) ?? []).length, 9)

  const ssSeed = sql.slice(sql.indexOf('insert into public.nll_ss_component_links'))
  assert.equal((ssSeed.match(/3e800008-0000-4000-8000-00000000010[12]/g) ?? []).length, 2)
  assert.match(sql, /where is_preferred = true/)
  assert.doesNotMatch(sql, /update\s+(?:public\.)?(?:books|book_files|dataset_versions|storage\.)/i)

  for (const summary of [
    ...BE3_U08_ACTIVITY_SUMMARY_SIDECAR,
    ...BE3_U08_WB_ACTIVITY_SUMMARY_SIDECAR,
  ]) {
    assert.ok(sql.includes(`'${summary.text.replaceAll("'", "''")}'`))
  }
})

test('hidden summaries are excluded normally and available to explicit shadow retrieval', () => {
  const normal = assembleNeutralLessonComponent({
    component,
    memberships: [membership],
    summaries: [summaryV1],
    ssLinks: [proposedSsLink],
  })
  assert.equal(normal.activities[0]?.preferredSummary, null)
  assert.deepEqual(normal.curriculumAuthorityLinks, [])
  assert.deepEqual(normal.proposedSsLinks, [proposedSsLink])

  const shadow = assembleNeutralLessonComponent({
    component,
    memberships: [membership],
    summaries: [summaryV1],
    ssLinks: [proposedSsLink],
    includeHiddenExperimental: true,
    currentActivitySha256ById: { [ACTIVITY_ID]: summaryV1.activity_sha256 },
  })
  assert.equal(shadow.activities[0]?.preferredSummary?.id, summaryV1.id)
  assert.equal(shadow.activities[0]?.preferredSummary?.staleness, 'current')
})

test('two lesson components reuse one activity summary without summary duplication', () => {
  const lessonB = { ...component, id: 'lesson-b', component_key: 'lesson-b' }
  const lessonBMembership = { ...membership, component_id: lessonB.id }
  const lessonAResolved = assembleNeutralLessonComponent({
    component,
    memberships: [membership],
    summaries: [summaryV1],
    ssLinks: [],
    includeHiddenExperimental: true,
  })
  const lessonBResolved = assembleNeutralLessonComponent({
    component: lessonB,
    memberships: [lessonBMembership],
    summaries: [summaryV1],
    ssLinks: [],
    includeHiddenExperimental: true,
  })
  assert.equal(lessonAResolved.activities[0]?.preferredSummary?.id, summaryV1.id)
  assert.equal(lessonBResolved.activities[0]?.preferredSummary?.id, summaryV1.id)
})

test('preferred summary switches from v1 to v2 without changing component membership', () => {
  const membershipsBefore = JSON.stringify([membership])
  const summaryV2: NllActivitySummaryRow = {
    ...summaryV1,
    id: 'summary-v2',
    version: 2,
    summary_text: 'Version two',
  }
  const resolved = assembleNeutralLessonComponent({
    component,
    memberships: [membership],
    summaries: [{ ...summaryV1, is_preferred: false }, summaryV2],
    ssLinks: [],
    includeHiddenExperimental: true,
  })
  assert.equal(resolved.activities[0]?.preferredSummary?.id, 'summary-v2')
  assert.equal(JSON.stringify([membership]), membershipsBefore)
})

test('changed activity fingerprints flag summaries as potentially stale', () => {
  const resolved = assembleNeutralLessonComponent({
    component,
    memberships: [membership],
    summaries: [summaryV1],
    ssLinks: [],
    includeHiddenExperimental: true,
    currentActivitySha256ById: { [ACTIVITY_ID]: 'd'.repeat(64) },
  })
  assert.equal(
    resolved.activities[0]?.preferredSummary?.staleness,
    'potentially_stale',
  )
})

test('activity fingerprints are stable across object key order', async () => {
  assert.equal(
    await fingerprintCanonicalActivity({ activity_id: ACTIVITY_ID, page_id: 'p128' }),
    await fingerprintCanonicalActivity({ page_id: 'p128', activity_id: ACTIVITY_ID }),
  )
})

test('shadow package is default-off, selection-only, and keeps proposed SS links out of authority', () => {
  assert.equal(isNllShadowPilotEnabled({}), false)
  const resolved = assembleNeutralLessonComponent({
    component,
    memberships: [membership],
    summaries: [summaryV1],
    ssLinks: [proposedSsLink],
    includeHiddenExperimental: true,
  })
  const publisherEvidence = {
    [ACTIVITY_ID]: {
      activityId: ACTIVITY_ID,
      source: 'SB' as const,
      canonicalPath: summaryV1.canonical_path,
      canonicalSha256: summaryV1.canonical_sha256,
      evidenceReference: { pageId: 'bep3_sb_p128' },
    },
  }
  assert.equal(
    buildNllShadowLessonPackage({
      component: resolved,
      selectedActivityIds: [ACTIVITY_ID],
      publisherEvidenceByActivityId: publisherEvidence,
      env: {},
    }),
    null,
  )

  const selected = buildNllShadowLessonPackage({
    component: resolved,
    selectedActivityIds: [ACTIVITY_ID],
    publisherEvidenceByActivityId: publisherEvidence,
    env: { VITE_CHALKIE_NLL_SHADOW_PILOT: 'true' },
  })
  assert.ok(selected)
  assert.equal(selected.activities.length, 1)
  assert.deepEqual(selected.curriculumAuthority, [])
  assert.deepEqual(selected.proposedSsLinks, [proposedSsLink])

  const deselected = buildNllShadowLessonPackage({
    component: resolved,
    selectedActivityIds: [],
    publisherEvidenceByActivityId: publisherEvidence,
    env: { VITE_CHALKIE_NLL_SHADOW_PILOT: 'true' },
  })
  assert.ok(deselected)
  assert.deepEqual(deselected.activities, [])
})
