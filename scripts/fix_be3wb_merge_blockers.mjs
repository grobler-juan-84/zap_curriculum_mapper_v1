/**
 * Fix BE3-WB merge blockers:
 * - Units 3 / 6 / 7: extend unit/batch printed ranges to include rear grammar pages
 *   (136 / 139 / 140) so batch D008 passes; canonical overlap warnings are accepted.
 * - Unit 5: remove invalid relationship to non-existent page 138.
 *
 * Usage: node scripts/fix_be3wb_merge_blockers.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const catalog = 'big_english_3_wb'
const localDir = join(root, 'data', 'phase1', catalog)
const grammarUnits = [3, 6, 7]

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

function pageNums(pages, field) {
  return pages
    .map((p) => p?.[field])
    .filter((n) => typeof n === 'number' && Number.isFinite(n))
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

for (const n of grammarUnits) {
  const nn = String(n).padStart(2, '0')
  const localPath = join(localDir, `${catalog}_unit_${nn}.json`)
  const dataset = JSON.parse(readFileSync(localPath, 'utf8'))
  const pages = dataset.pages || []
  const printed = pageNums(pages, 'printed_page')
  const pdf = pageNums(pages, 'pdf_page')
  const printedEnd = Math.max(...printed)
  const printedStart = Math.min(...printed)
  const pdfEnd = pdf.length ? Math.max(...pdf) : printedEnd
  const pdfStart = pdf.length ? Math.min(...pdf) : printedStart
  const mainUnitId = `${catalog}_unit_${nn}`

  dataset.units = (dataset.units || []).filter((u) => !String(u?.unit_id || '').endsWith('_grammar'))
  const mainUnit = dataset.units.find((u) => u.unit_id === mainUnitId) ?? dataset.units[0]
  if (!mainUnit) throw new Error(`U${nn}: missing unit`)
  mainUnit.printed_page_start = printedStart
  mainUnit.printed_page_end = printedEnd
  if ('pdf_page_start' in mainUnit) mainUnit.pdf_page_start = pdfStart
  if ('pdf_page_end' in mainUnit) mainUnit.pdf_page_end = pdfEnd

  for (const page of pages) {
    page.unit_id = mainUnitId
  }

  if (dataset.batch && typeof dataset.batch === 'object') {
    dataset.batch.printed_page_start = printedStart
    dataset.batch.printed_page_end = printedEnd
    dataset.batch.pdf_page_start = pdfStart
    dataset.batch.pdf_page_end = pdfEnd
    dataset.batch.unit_id = mainUnitId
  }

  if (dataset.book && typeof dataset.book === 'object') {
    dataset.book.printed_page_start = printedStart
    dataset.book.printed_page_end = printedEnd
  }

  const body = `${JSON.stringify(dataset, null, 2)}\n`
  writeFileSync(localPath, body, 'utf8')
  await uploadUnit(nn, body)
  console.log(`OK U${nn}: printed ${printedStart}–${printedEnd} (grammar-inclusive)`)
}

const u5Path = join(localDir, `${catalog}_unit_05.json`)
const u5 = JSON.parse(readFileSync(u5Path, 'utf8'))
const relBefore = (u5.relationships || []).length
u5.relationships = (u5.relationships || []).filter(
  (rel) => rel?.relationship_id !== 'bep_plus_3_wb_rel_05_08',
)
const relRemoved = relBefore - u5.relationships.length
const issues = Array.isArray(u5.extraction_issues) ? u5.extraction_issues : []
const issueId = `${catalog}_issue_u05_p138_crossref`
if (relRemoved && !issues.some((i) => i?.issue_id === issueId)) {
  issues.push({
    issue_id: issueId,
    book_id: catalog,
    unit_id: `${catalog}_unit_05`,
    page_id: null,
    entity_type: 'relationship',
    entity_id: 'bep_plus_3_wb_rel_05_08',
    issue_type: 'possible_omission',
    severity: 'review',
    description:
      'Removed invalid Unit 5 relationship pointing at non-extracted printed page 138 (bep_plus_3_wb_p138 → bep_plus_3_wb_u05).',
    status: 'open',
    verification_status: 'human_verified',
  })
}
u5.extraction_issues = issues
const u5Body = `${JSON.stringify(u5, null, 2)}\n`
writeFileSync(u5Path, u5Body, 'utf8')
await uploadUnit('05', u5Body)
console.log(`OK U05: removed ${relRemoved} invalid relationship(s)`)

console.log('Done. Re-run: node scripts/merge_canonical_book.mjs big_english_3_wb')
