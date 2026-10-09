/**
 * Remove BE4-WB relationships pointing at non-extracted pages (p088/p137/p141)
 * and record open possible_omission issues. Same pattern as BE3-WB p138.
 *
 * Usage: node scripts/fix_be4wb_missing_page_rels.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const catalog = 'big_english_4_wb'
const localDir = join(root, 'data', 'phase1', catalog)

const REMOVALS = [
  {
    unit: 4,
    relationshipId: 'be4plus_wb_u04_rel_002',
    pageHint: 137,
    description:
      'Removed invalid Unit 4 relationship pointing at non-extracted printed page 137 (Extra Grammar Practice).',
  },
  {
    unit: 4,
    relationshipId: 'be4plus_wb_u04_rel_003',
    pageHint: 88,
    description:
      'Removed invalid Unit 4 relationship pointing at non-extracted printed pages 88–89 (Checkpoint Units 4–6).',
  },
  {
    unit: 8,
    relationshipId: 'bep4_wb_rel08_006',
    pageHint: 141,
    description:
      'Removed invalid Unit 8 relationship pointing at non-extracted printed page 141 (Extra Grammar Practice).',
  },
]

function loadEnvFile(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env) || !process.env[key]) process.env[key] = value
  }
}

loadEnvFile(resolve(root, 'app', '.env.local'))
loadEnvFile(resolve(root, '.env.local'))

const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

async function uploadUnit(nn, body) {
  const storagePath = `big-english/${catalog}/batches/unit_${nn}.json`
  await supabase.storage.from('book-datasets').remove([storagePath])
  const { error } = await supabase.storage
    .from('book-datasets')
    .upload(storagePath, Buffer.from(body, 'utf8'), {
      contentType: 'application/json',
      upsert: true,
    })
  if (error) throw new Error(`upload ${storagePath}: ${error.message}`)
}

const byUnit = new Map()
for (const rem of REMOVALS) {
  if (!byUnit.has(rem.unit)) byUnit.set(rem.unit, [])
  byUnit.get(rem.unit).push(rem)
}

for (const [unit, rems] of byUnit) {
  const nn = String(unit).padStart(2, '0')
  const localPath = join(localDir, `${catalog}_unit_${nn}.json`)
  const dataset = JSON.parse(readFileSync(localPath, 'utf8'))
  const removeIds = new Set(rems.map((r) => r.relationshipId))
  const before = (dataset.relationships || []).length
  dataset.relationships = (dataset.relationships || []).filter(
    (rel) => !removeIds.has(rel?.relationship_id),
  )
  const removed = before - dataset.relationships.length

  const issues = Array.isArray(dataset.extraction_issues) ? dataset.extraction_issues : []
  for (const rem of rems) {
    const issueId = `${catalog}_issue_u${nn}_p${rem.pageHint}_crossref`
    if (issues.some((i) => i?.issue_id === issueId)) continue
    issues.push({
      issue_id: issueId,
      book_id: catalog,
      unit_id: `${catalog}_unit_${nn}`,
      page_id: null,
      entity_type: 'relationship',
      entity_id: rem.relationshipId,
      issue_type: 'possible_omission',
      severity: 'review',
      description: rem.description,
      status: 'open',
      verification_status: 'human_verified',
    })
  }
  dataset.extraction_issues = issues

  const body = `${JSON.stringify(dataset, null, 2)}\n`
  writeFileSync(localPath, body, 'utf8')
  await uploadUnit(nn, body)
  console.log(`OK U${nn}: removed ${removed} relationship(s), issues=${issues.length}`)
}

console.log(`Re-run: node scripts/merge_canonical_book.mjs ${catalog}`)
