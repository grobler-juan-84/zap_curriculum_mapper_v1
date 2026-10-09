/**
 * Fix BE3-SB merge blockers:
 * - Unit 2 relationship with null target_entity_id (workbook cross-ref)
 *   → remove invalid relationship; record open possible_omission issue.
 *
 * Usage: node scripts/fix_be3sb_merge_blockers.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const catalog = 'big_english_3_sb'
const localPath = join(root, 'data', 'phase1', catalog, `${catalog}_unit_02.json`)
const storagePath = `big-english/${catalog}/batches/unit_02.json`

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

const dataset = JSON.parse(readFileSync(localPath, 'utf8'))
const before = (dataset.relationships || []).length
dataset.relationships = (dataset.relationships || []).filter((rel) => {
  if (rel?.relationship_id === 'bep3_sb_rel_0002' && rel.target_entity_id == null) {
    return false
  }
  return typeof rel?.target_entity_id === 'string' && typeof rel?.source_entity_id === 'string'
})
const removed = before - dataset.relationships.length

const issueId = `${catalog}_issue_workbook_u02_crossref`
const issues = Array.isArray(dataset.extraction_issues) ? dataset.extraction_issues : []
if (!issues.some((i) => i?.issue_id === issueId)) {
  issues.push({
    issue_id: issueId,
    book_id: catalog,
    unit_id: `${catalog}_unit_02`,
    page_id: 'bep3_sb_u02_p20',
    entity_type: 'relationship',
    entity_id: 'bep3_sb_rel_0002',
    issue_type: 'possible_omission',
    severity: 'review',
    description:
      'Removed invalid Unit 2 relationship "workbook practice for" with null target_entity_id (cross-book Workbook Unit 2 pointer; no inventing workbook page entities).',
    status: 'open',
    verification_status: 'human_verified',
  })
}
dataset.extraction_issues = issues

const body = `${JSON.stringify(dataset, null, 2)}\n`
writeFileSync(localPath, body, 'utf8')
console.log(`Local U2: removed ${removed} invalid relationship(s); issues=${issues.length}`)

const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

const { error } = await supabase.storage
  .from('book-datasets')
  .upload(storagePath, Buffer.from(body, 'utf8'), {
    contentType: 'application/json',
    upsert: true,
  })
if (error) throw new Error(error.message)
console.log(`Uploaded ${storagePath}`)
