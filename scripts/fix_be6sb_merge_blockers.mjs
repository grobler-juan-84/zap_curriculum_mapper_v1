/**
 * Fix BE6-SB merge blockers:
 * - Unit 1: null page_id on wordlist vocab pointing at missing bep6_unit_01_p160
 *   (source notes cite Wordlist p.166, outside unit range 4–19); record possible_omission.
 *
 * Usage: node scripts/fix_be6sb_merge_blockers.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const catalog = 'big_english_6_sb'
const localDir = join(root, 'data', 'phase1', catalog)
const badPageId = 'bep6_unit_01_p160'

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
  await new Promise((r) => setTimeout(r, 800))
  const { error } = await supabase.storage
    .from('book-datasets')
    .upload(storagePath, Buffer.from(body, 'utf8'), {
      contentType: 'application/json',
      upsert: true,
      cacheControl: '0',
    })
  if (error) throw new Error(`upload ${storagePath}: ${error.message}`)
  await new Promise((r) => setTimeout(r, 800))
}

const nn = '01'
const localPath = join(localDir, `${catalog}_unit_${nn}.json`)
const dataset = JSON.parse(readFileSync(localPath, 'utf8'))
let cleared = 0
for (const v of dataset.vocabulary || []) {
  if (v.page_id === badPageId) {
    v.page_id = null
    cleared += 1
  }
}
const issues = Array.isArray(dataset.extraction_issues) ? dataset.extraction_issues : []
const issueId = `${catalog}_issue_u01_wordlist_p166`
if (cleared && !issues.some((i) => i?.issue_id === issueId)) {
  issues.push({
    issue_id: issueId,
    book_id: catalog,
    unit_id: `${catalog}_unit_01`,
    page_id: null,
    entity_type: 'vocabulary',
    entity_id: null,
    issue_type: 'possible_omission',
    severity: 'review',
    description:
      'Cleared page_id on 4 Unit 1 wordlist vocab rows pointing at missing page_id bep6_unit_01_p160 (notes cite Wordlist p.166; page not extracted into unit batch).',
    status: 'open',
    verification_status: 'human_verified',
  })
}
dataset.extraction_issues = issues
const body = `${JSON.stringify(dataset, null, 2)}\n`
writeFileSync(localPath, body, 'utf8')
await uploadUnit(nn, body)
console.log(`OK U01: cleared ${cleared} wordlist page_id refs; issues=${issues.length}`)
console.log(`Re-run: node scripts/merge_canonical_book.mjs ${catalog}`)
