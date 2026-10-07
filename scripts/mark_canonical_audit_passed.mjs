/**
 * Record owner whole-book audit PASSED for a canonical dataset:
 * - patch verification.whole_book_audit on canonical JSON (local + Storage)
 * - set dataset_versions.status = verified
 *
 * Usage:
 *   node scripts/mark_canonical_audit_passed.mjs big_english_1_sb
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)

const bucket = 'book-datasets'

const BOOKS = {
  beehive_1_sb: {
    catalogBookId: 'beehive_1_sb',
    canonicalPath: 'beehive/beehive_1_sb/canonical/v1.json',
    version: 1,
    notes:
      'Whole-book audit PASSED 2026-10-07 (structural integrity + owner PDF spot-check: pages, vocab, sentence structure). Automated validation remains NOT RUN (non-blocking).',
  },
  big_english_1_sb: {
    catalogBookId: 'big_english_1_sb',
    canonicalPath: 'big-english/big_english_1_sb/canonical/v1.json',
    version: 1,
    notes:
      'Whole-book audit PASSED 2026-10-07 (structural integrity + owner PDF spot-check in Validation). Automated validation remains NOT RUN (non-blocking).',
  },
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

loadEnvFile(resolve(root, 'app', '.env.local'))
loadEnvFile(resolve(root, '.env.local'))
loadEnvFile(resolve(root, '.env'))

const bookKey = (process.argv[2] || 'big_english_1_sb').trim()
const cfg = BOOKS[bookKey]
if (!cfg) {
  console.error(`Unknown book "${bookKey}". Supported: ${Object.keys(BOOKS).join(', ')}`)
  process.exit(1)
}

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing Supabase URL or key in env.')
  process.exit(1)
}

const supabase = createClient(url, key)

const { data: bookRow, error: bookError } = await supabase
  .from('books')
  .select('id, book_id')
  .eq('book_id', cfg.catalogBookId)
  .maybeSingle()

if (bookError || !bookRow?.id) {
  console.error(`Book lookup failed: ${bookError?.message ?? 'not found'}`)
  process.exit(1)
}

const { data: blob, error: downloadError } = await supabase.storage
  .from(bucket)
  .download(cfg.canonicalPath)

if (downloadError || !blob) {
  console.error(`Download failed: ${downloadError?.message ?? 'no data'}`)
  process.exit(1)
}

const text = await blob.text()
let canonical
try {
  canonical = JSON.parse(text)
} catch {
  console.error('Invalid JSON in canonical file')
  process.exit(1)
}

const auditedAt = new Date().toISOString()
canonical.verification = {
  ...(canonical.verification && typeof canonical.verification === 'object'
    ? canonical.verification
    : {}),
  whole_book_audit: 'passed',
  whole_book_audit_passed_at: auditedAt,
  status: 'whole_book_audit_passed',
  notes:
    'Owner PDF spot-check PASSED in Validation (unit-scoped canonical view). Structural integrity PASS. Documented extraction_issues / schema_gaps retained.',
}

const body = `${JSON.stringify(canonical, null, 2)}\n`
const localDir = join(root, 'data', 'phase1', cfg.catalogBookId, 'canonical')
mkdirSync(localDir, { recursive: true })
const localPath = join(localDir, 'v1.json')
writeFileSync(localPath, body, 'utf8')
console.log(`Wrote local ${localPath}`)

const { error: uploadError } = await supabase.storage.from(bucket).upload(cfg.canonicalPath, body, {
  contentType: 'application/json',
  upsert: true,
})
if (uploadError) {
  console.error(`Upload failed: ${uploadError.message}`)
  process.exit(1)
}
console.log(`Uploaded ${bucket}/${cfg.canonicalPath}`)

const { data: fileRow, error: fileError } = await supabase
  .from('book_files')
  .update({ file_size: Buffer.byteLength(body), status: 'verified' })
  .eq('book_id', bookRow.id)
  .eq('file_type', 'canonical_json')
  .eq('storage_path', cfg.canonicalPath)
  .select('id')
  .maybeSingle()

if (fileError) {
  console.warn(`WARN  book_files update: ${fileError.message}`)
}

const { data: versionRow, error: versionError } = await supabase
  .from('dataset_versions')
  .update({
    status: 'verified',
    notes: cfg.notes,
    ...(fileRow?.id ? { json_file_id: fileRow.id } : {}),
  })
  .eq('book_id', bookRow.id)
  .eq('version', cfg.version)
  .select('id, status, is_current')
  .maybeSingle()

if (versionError || !versionRow?.id) {
  console.error(
    `dataset_versions update failed: ${versionError?.message ?? 'no row returned (check RLS / service role)'}`,
  )
  process.exit(1)
}

console.log(
  `dataset_versions id=${versionRow.id} status=${versionRow.status} is_current=${versionRow.is_current}`,
)
console.log('Done. whole_book_audit=passed')
