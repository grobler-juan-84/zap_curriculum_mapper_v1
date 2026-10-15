/**
 * Upload a Phase 2 Book Intelligence JSON artifact to Supabase Storage.
 *
 * Storage only — does NOT touch Postgres (`book_files`, `dataset_versions`, etc.).
 * Does NOT merge into Phase 1 `canonical/v1.json`.
 *
 * Default artifact: BE3-SB Units 1–9 A+B draft BI overview.
 *
 * Reads credentials from app/.env.local (or process env):
 *   VITE_SUPABASE_URL (or SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage (from repo root):
 *   node scripts/upload_book_intelligence_json.mjs
 *   node scripts/upload_book_intelligence_json.mjs --file path/to.json --key storage/object/key.json
 *
 * Never commit the service-role key.
 */

import { createHash } from 'node:crypto'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, isAbsolute, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)

const BUCKET = 'book-datasets'

const DEFAULT_LOCAL = resolve(
  root,
  'data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json',
)

const DEFAULT_STORAGE_KEY =
  'big-english/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json'

function loadEnvFile(path) {
  if (!existsSync(path)) return
  const text = readFileSync(path, 'utf8')
  for (const line of text.split(/\r?\n/)) {
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
    if (!(key in process.env) || !process.env[key]) {
      process.env[key] = value
    }
  }
}

function parseArgs(argv) {
  const options = { file: DEFAULT_LOCAL, key: DEFAULT_STORAGE_KEY }
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--file') {
      const value = argv[++i]
      options.file = isAbsolute(value) ? value : resolve(root, value)
    } else if (argv[i] === '--key') {
      options.key = argv[++i]
    }
  }
  return options
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

function assertBiEnvelope(parsed) {
  const errors = []
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('JSON root must be an object')
  }
  if (parsed.schema_name !== 'book_intelligence_unit_overview') {
    errors.push(`schema_name=${parsed.schema_name}`)
  }
  if (parsed.layer !== 'phase2_interpretation') {
    errors.push(`layer=${parsed.layer}`)
  }
  const allowedColumnSets = new Set([
    'eight_column_baseline',
    'nine_column_ab',
  ])
  if (!allowedColumnSets.has(parsed.column_set)) {
    errors.push(`column_set=${parsed.column_set}`)
  }
  if (typeof parsed.catalog_book_id !== 'string' || !parsed.catalog_book_id) {
    errors.push('catalog_book_id missing')
  }
  if (!Array.isArray(parsed.units) || parsed.units.length === 0) {
    errors.push('units[] empty')
  }
  if (errors.length) {
    throw new Error(`BI envelope checks failed: ${errors.join('; ')}`)
  }
}

loadEnvFile(resolve(root, 'app', '.env.local'))
loadEnvFile(resolve(root, '.env.local'))
loadEnvFile(resolve(root, '.env'))

const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

if (!url || !serviceKey) {
  console.error(
    'Missing VITE_SUPABASE_URL (or SUPABASE_URL) and/or SUPABASE_SERVICE_ROLE_KEY.',
  )
  process.exit(1)
}

const { file: localPath, key: storageKey } = parseArgs(process.argv.slice(2))

if (!existsSync(localPath)) {
  console.error(`Local file not found: ${localPath}`)
  process.exit(1)
}

const localBody = readFileSync(localPath)
const localSize = statSync(localPath).size
const localHash = sha256(localBody)

let parsed
try {
  parsed = JSON.parse(localBody.toString('utf8'))
  assertBiEnvelope(parsed)
} catch (err) {
  console.error(
    `Local JSON invalid: ${err instanceof Error ? err.message : err}`,
  )
  process.exit(1)
}

console.log('Upload plan (Storage only — no Postgres writes)')
console.log(`  bucket:     ${BUCKET}`)
console.log(`  key:        ${storageKey}`)
console.log(`  local:      ${localPath}`)
console.log(`  bytes:      ${localSize}`)
console.log(`  sha256:     ${localHash}`)
console.log(`  units:      ${parsed.units.length}`)
console.log(`  catalog:    ${parsed.catalog_book_id}`)
console.log('')

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { error: uploadError } = await supabase.storage
  .from(BUCKET)
  .upload(storageKey, localBody, {
    contentType: 'application/json',
    upsert: true,
  })

if (uploadError) {
  console.error(`UPLOAD FAIL: ${uploadError.message}`)
  process.exit(1)
}

console.log('UPLOAD OK')

const { data: downloadBlob, error: downloadError } = await supabase.storage
  .from(BUCKET)
  .download(storageKey)

if (downloadError || !downloadBlob) {
  console.error(
    `DOWNLOAD FAIL: ${downloadError?.message || 'empty response'}`,
  )
  process.exit(1)
}

const remoteBuffer = Buffer.from(await downloadBlob.arrayBuffer())
const remoteHash = sha256(remoteBuffer)
const remoteSize = remoteBuffer.length

let remoteParsed
try {
  remoteParsed = JSON.parse(remoteBuffer.toString('utf8'))
  assertBiEnvelope(remoteParsed)
} catch (err) {
  console.error(
    `REMOTE JSON invalid: ${err instanceof Error ? err.message : err}`,
  )
  process.exit(1)
}

const checks = [
  ['byte length', localSize === remoteSize, `${localSize} vs ${remoteSize}`],
  ['sha256', localHash === remoteHash, `${localHash} vs ${remoteHash}`],
  [
    'catalog_book_id',
    remoteParsed.catalog_book_id === parsed.catalog_book_id,
    remoteParsed.catalog_book_id,
  ],
  [
    'unit count',
    remoteParsed.units.length === parsed.units.length,
    String(remoteParsed.units.length),
  ],
  [
    'column_set',
    remoteParsed.column_set === parsed.column_set,
    remoteParsed.column_set,
  ],
  [
    'layer',
    remoteParsed.layer === 'phase2_interpretation',
    remoteParsed.layer,
  ],
]

let failed = 0
for (const [name, ok, detail] of checks) {
  if (ok) {
    console.log(`PASS  ${name}${detail ? ` (${detail})` : ''}`)
  } else {
    console.error(`FAIL  ${name}${detail ? ` (${detail})` : ''}`)
    failed += 1
  }
}

if (failed > 0) {
  console.error(`\nIntegrity verification FAILED (${failed} checks).`)
  process.exit(1)
}

console.log('\nIntegrity verification PASS')
console.log(
  `Object: ${BUCKET}/${storageKey} (${remoteSize} bytes, ${remoteParsed.units.length} units)`,
)
console.log('No database / schema / UI wiring performed.')
