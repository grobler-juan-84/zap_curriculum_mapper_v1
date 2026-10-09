/**
 * Fix BE6-WB merge blockers:
 * - Units 3 / 4: extend printed ranges for grammar pages 138 / 139
 * - Remap Studio unit-shorthand relationship endpoints (e.g. bep6_wb_u8)
 *
 * Usage: node scripts/fix_be6wb_merge_blockers.mjs
 *
 * Note: cross-unit ID collisions (U3 vs U8 vocab/lang) are handled by
 * `renumber_be6wb_merge_collisions.mjs`.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const catalog = 'big_english_6_wb'
const localDir = join(root, 'data', 'phase1', catalog)
const grammarUnits = [3, 4]

const UNIT_ALIAS_MAP = {
  bep6_wb_u1: `${catalog}_unit_01`,
  bep6_wb_u2: `${catalog}_unit_02`,
  bep6_wb_u3: `${catalog}_unit_03`,
  bep6_wb_u4: `${catalog}_unit_04`,
  bep6_wb_u5: `${catalog}_unit_05`,
  bep6_wb_u6: `${catalog}_unit_06`,
  bep6_wb_u7: `${catalog}_unit_07`,
  bep6_wb_u8: `${catalog}_unit_08`,
  bep6_wb_u9: `${catalog}_unit_09`,
  bep6_wb_u01: `${catalog}_unit_01`,
  bep6_wb_u02: `${catalog}_unit_02`,
  bep6_wb_u03: `${catalog}_unit_03`,
  bep6_wb_u04: `${catalog}_unit_04`,
  bep6_wb_u05: `${catalog}_unit_05`,
  bep6_wb_u06: `${catalog}_unit_06`,
  bep6_wb_u07: `${catalog}_unit_07`,
  bep6_wb_u08: `${catalog}_unit_08`,
  bep6_wb_u09: `${catalog}_unit_09`,
  bep_6_wb_u01: `${catalog}_unit_01`,
  bep_6_wb_u02: `${catalog}_unit_02`,
  bep_6_wb_u03: `${catalog}_unit_03`,
  bep_6_wb_u04: `${catalog}_unit_04`,
  bep_6_wb_u05: `${catalog}_unit_05`,
  bep_6_wb_u06: `${catalog}_unit_06`,
  bep_6_wb_u07: `${catalog}_unit_07`,
  bep_6_wb_u08: `${catalog}_unit_08`,
  bep_6_wb_u09: `${catalog}_unit_09`,
  bep_wb_6_u01: `${catalog}_unit_01`,
  bep_wb_6_u02: `${catalog}_unit_02`,
  bep_wb_6_u03: `${catalog}_unit_03`,
  bep_wb_6_u04: `${catalog}_unit_04`,
  bep_wb_6_u05: `${catalog}_unit_05`,
  bep_wb_6_u06: `${catalog}_unit_06`,
  bep_wb_6_u07: `${catalog}_unit_07`,
  bep_wb_6_u08: `${catalog}_unit_08`,
  bep_wb_6_u09: `${catalog}_unit_09`,
}

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

function sha(s) {
  return createHash('sha256').update(s).digest('hex').slice(0, 12)
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
  const expected = sha(body)
  for (let attempt = 1; attempt <= 4; attempt++) {
    await supabase.storage.from('book-datasets').remove([storagePath])
    await new Promise((r) => setTimeout(r, 1000 * attempt))
    const { error } = await supabase.storage
      .from('book-datasets')
      .upload(storagePath, Buffer.from(body, 'utf8'), {
        contentType: 'application/json',
        upsert: true,
        cacheControl: '0',
      })
    if (error) throw new Error(`upload ${storagePath}: ${error.message}`)
    await new Promise((r) => setTimeout(r, 1000 * attempt))
    const { data, error: dlErr } = await supabase.storage
      .from('book-datasets')
      .download(storagePath)
    if (dlErr) throw new Error(`verify download ${storagePath}: ${dlErr.message}`)
    const got = sha(await data.text())
    if (got === expected) {
      console.log(`  uploaded+verified ${storagePath} sha=${expected}`)
      return
    }
    console.warn(
      `  stale attempt ${attempt} ${storagePath}: expected ${expected} got ${got}`,
    )
  }
  throw new Error(`stale upload after retries: ${storagePath}`)
}

let totalAliasRewrites = 0

for (let n = 1; n <= 9; n++) {
  const nn = String(n).padStart(2, '0')
  const localPath = join(localDir, `${catalog}_unit_${nn}.json`)
  const dataset = JSON.parse(readFileSync(localPath, 'utf8'))
  const mainUnitId = `${catalog}_unit_${nn}`
  let changed = false

  if (grammarUnits.includes(n)) {
    const pages = dataset.pages || []
    const printed = pageNums(pages, 'printed_page')
    const pdf = pageNums(pages, 'pdf_page')
    const printedEnd = Math.max(...printed)
    const printedStart = Math.min(...printed)
    const pdfEnd = pdf.length ? Math.max(...pdf) : printedEnd
    const pdfStart = pdf.length ? Math.min(...pdf) : printedStart

    dataset.units = (dataset.units || []).filter(
      (u) => !String(u?.unit_id || '').endsWith('_grammar'),
    )
    const mainUnit =
      dataset.units.find((u) => u.unit_id === mainUnitId) ?? dataset.units[0]
    mainUnit.printed_page_start = printedStart
    mainUnit.printed_page_end = printedEnd
    if ('pdf_page_start' in mainUnit) mainUnit.pdf_page_start = pdfStart
    if ('pdf_page_end' in mainUnit) mainUnit.pdf_page_end = pdfEnd
    for (const page of pages) page.unit_id = mainUnitId
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
    changed = true
    console.log(`OK U${nn}: printed ${printedStart}–${printedEnd} (grammar-inclusive)`)
  }

  for (const rel of dataset.relationships || []) {
    for (const field of ['source_entity_id', 'target_entity_id']) {
      const id = rel[field]
      if (typeof id === 'string' && UNIT_ALIAS_MAP[id]) {
        rel[field] = UNIT_ALIAS_MAP[id]
        totalAliasRewrites += 1
        changed = true
      }
    }
  }

  if (!changed) continue
  const body = `${JSON.stringify(dataset, null, 2)}\n`
  writeFileSync(localPath, body, 'utf8')
  await uploadUnit(nn, body)
}

console.log(`Done. aliasRewrites=${totalAliasRewrites}`)
console.log(`Re-run: node scripts/merge_canonical_book.mjs ${catalog}`)
