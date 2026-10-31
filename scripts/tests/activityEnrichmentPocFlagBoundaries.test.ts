/**
 * UX-01: enrichment POC chrome stays gated and labelled separate from NLL adapters.
 * Run: npx tsx --test scripts/tests/activityEnrichmentPocFlagBoundaries.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  BE3_U08_ACTIVITY_ENRICHMENT_POC_ENV,
  isBe3U08ActivityEnrichmentPocEnabled,
} from '../../app/src/features/chalkie/be3U08ActivityEnrichmentPoc.ts'
import { isNllCardComparisonEnabled } from '../../app/src/features/chalkie/nllCardComparison.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OVERLAY_PATH = path.join(
  ROOT,
  'app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx',
)

const NLL_ADAPTER_ENVS = [
  'VITE_NLL_CHALKIE_ADAPTER_PILOT',
  'VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT',
  'VITE_NLL_CHALKIE_LIA_ADAPTER_PILOT',
  'VITE_NLL_CHALKIE_CLIL_PE_ADAPTER_PILOT',
  'VITE_NLL_CHALKIE_GRAMMAR_ADAPTER_PILOT',
  'VITE_NLL_CHALKIE_CULTURE_ADAPTER_PILOT',
  'VITE_NLL_CHALKIE_WRITING_ADAPTER_PILOT',
  'VITE_NLL_CHALKIE_PHONICS_ADAPTER_PILOT',
  'VITE_NLL_CHALKIE_REVIEW_ADAPTER_PILOT',
] as const

test('all NLL adapters false + enrichment POC false → enrichment disabled', () => {
  const env: Record<string, string> = {
    [BE3_U08_ACTIVITY_ENRICHMENT_POC_ENV]: 'false',
    VITE_CHALKIE_NLL_CARD_COMPARISON: 'false',
  }
  for (const key of NLL_ADAPTER_ENVS) env[key] = 'false'
  assert.equal(isBe3U08ActivityEnrichmentPocEnabled(env), false)
  assert.equal(isNllCardComparisonEnabled(env), false)
})

test('enrichment POC true does not require NLL adapter flags', () => {
  const env: Record<string, string> = {
    [BE3_U08_ACTIVITY_ENRICHMENT_POC_ENV]: 'true',
  }
  for (const key of NLL_ADAPTER_ENVS) env[key] = 'false'
  assert.equal(isBe3U08ActivityEnrichmentPocEnabled(env), true)
})

test('NLL adapter flags alone do not enable enrichment POC', () => {
  const env: Record<string, string> = {
    [BE3_U08_ACTIVITY_ENRICHMENT_POC_ENV]: 'false',
  }
  for (const key of NLL_ADAPTER_ENVS) env[key] = 'true'
  assert.equal(isBe3U08ActivityEnrichmentPocEnabled(env), false)
})

test('overlay gates package on enrichment POC and labels it separate from NLL', () => {
  const source = fs.readFileSync(OVERLAY_PATH, 'utf8')
  assert.match(source, /activityEnrichmentPocEnabled/)
  assert.match(
    source,
    /buildBe3U08ActivityEnrichmentPocPackage[\s\S]*activityEnrichmentPocEnabled/,
  )
  assert.match(source, /Activity enrichment experiment · not NLL adapter/)
  assert.match(source, /data-experimental-activity-enrichment-package/)
  assert.ok(!source.includes('Experimental Neutral Lesson Package projection'))
  // Flag default remains process/env driven — no hardcoded true default in overlay.
  assert.ok(!/BE3_U08_ACTIVITY_ENRICHMENT_POC.*=.*true/.test(source))
})
