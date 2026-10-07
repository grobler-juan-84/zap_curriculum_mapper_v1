/**
 * Merge verified unit-batch JSON files into a canonical book dataset,
 * upload to Storage, and register book_files + dataset_versions.
 *
 * Usage (from repo root):
 *   node scripts/merge_canonical_book.mjs
 *   node scripts/merge_canonical_book.mjs big_english_1_sb
 *
 * Requires: VITE_SUPABASE_URL (or SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { applyCatalogBookId, loadBookIdAliasMap } from './lib/bookIdAliases.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)

const bucket = 'book-datasets'

/** @type {Record<string, { catalogBookId: string, seriesSlug: string, unitPaths: string[] }>} */
const BOOKS = {
  big_english_1_sb: {
    catalogBookId: 'big_english_1_sb',
    seriesSlug: 'big-english',
    unitPaths: [
      'big-english/big_english_1_sb/batches/unit_01.json',
      'big-english/big_english_1_sb/batches/unit_02.json',
      'big-english/big_english_1_sb/batches/unit_03.json',
      'big-english/big_english_1_sb/batches/unit_04.json',
      'big-english/big_english_1_sb/batches/unit_05.json',
      'big-english/big_english_1_sb/batches/unit_06.json',
      'big-english/big_english_1_sb/batches/unit_07.json',
      'big-english/big_english_1_sb/batches/unit_08.json',
      'big-english/big_english_1_sb/batches/unit_09.json',
    ],
  },
}

const ARRAY_KEYS = [
  'units',
  'pages',
  'vocabulary',
  'language',
  'activities',
  'continuous_text',
  'curriculum_components',
  'relationships',
  'extraction_issues',
  'schema_gaps',
]

const ID_FIELDS = {
  units: 'unit_id',
  pages: 'page_id',
  vocabulary: 'vocabulary_id',
  language: 'language_id',
  activities: 'activity_id',
  continuous_text: 'continuous_text_id',
  curriculum_components: 'component_id',
  relationships: 'relationship_id',
  extraction_issues: 'issue_id',
  schema_gaps: 'schema_gap_id',
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

const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL (or SUPABASE_URL) and/or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const bookKey = (process.argv[2] || 'big_english_1_sb').trim()
const bookConfig = BOOKS[bookKey]
if (!bookConfig) {
  console.error(`Unknown book key "${bookKey}". Supported: ${Object.keys(BOOKS).join(', ')}`)
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function asRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : null
}

function mergeArray(key, batches) {
  const idField = ID_FIELDS[key]
  const seen = new Set()
  const out = []
  let collisions = 0
  let noId = 0

  for (const batch of batches) {
    for (const entry of asArray(batch[key])) {
      const rec = asRecord(entry)
      if (!rec) continue
      const id = idField && typeof rec[idField] === 'string' ? rec[idField] : null
      if (id) {
        if (seen.has(id)) {
          collisions += 1
          continue
        }
        seen.add(id)
      } else {
        noId += 1
      }
      out.push(entry)
    }
  }

  return { items: out, collisions, noId }
}

function pickBook(batches) {
  let best = null
  let bestScore = -1
  for (const batch of batches) {
    const book = asRecord(batch.book)
    if (!book) continue
    const score = Object.values(book).filter((v) => v != null && v !== '').length
    if (score > bestScore) {
      best = { ...book }
      bestScore = score
    }
  }
  return best
}

function pickSchema(batches) {
  for (const batch of batches) {
    const schema = asRecord(batch.schema)
    if (schema) return { ...schema }
  }
  return {
    name: 'general_curriculum_mapper_phase1',
    version: '0.1',
    status: 'development',
  }
}

async function downloadJson(storagePath) {
  const { data, error } = await supabase.storage.from(bucket).download(storagePath)
  if (error || !data) {
    throw new Error(`Download failed ${storagePath}: ${error?.message ?? 'no data'}`)
  }
  const text = await data.text()
  return JSON.parse(text)
}

const { data: bookRow, error: bookError } = await supabase
  .from('books')
  .select('id, book_id')
  .eq('book_id', bookConfig.catalogBookId)
  .maybeSingle()

if (bookError || !bookRow?.id) {
  console.error(`Book not found: ${bookConfig.catalogBookId} (${bookError?.message ?? 'no row'})`)
  process.exit(1)
}

const { data: fileRows, error: filesError } = await supabase
  .from('book_files')
  .select('storage_path, status, label')
  .eq('book_id', bookRow.id)
  .eq('file_type', 'batch_json')
  .eq('bucket', bucket)
  .in('storage_path', bookConfig.unitPaths)

if (filesError) {
  console.error(`Failed to list batch files: ${filesError.message}`)
  process.exit(1)
}

const statusByPath = new Map((fileRows ?? []).map((r) => [r.storage_path, r.status]))
for (const path of bookConfig.unitPaths) {
  if (!statusByPath.has(path)) {
    console.error(`Missing book_files row for ${path}`)
    process.exit(1)
  }
  if (statusByPath.get(path) !== 'verified') {
    console.warn(`WARN  ${path} status=${statusByPath.get(path)} (expected verified)`)
  }
}

console.log(`Downloading ${bookConfig.unitPaths.length} batches for ${bookKey}…`)
const batches = []
for (const path of bookConfig.unitPaths) {
  const json = await downloadJson(path)
  batches.push(json)
  console.log(`  OK  ${path}`)
}

const counts = {}
const collisionLog = {}
const merged = {
  schema: pickSchema(batches),
  book: pickBook(batches) ?? { book_id: bookConfig.catalogBookId },
}

const bookNotes = []
if (typeof merged.book.notes === 'string' && merged.book.notes.trim()) {
  bookNotes.push(merged.book.notes.trim())
}
bookNotes.push(
  `Catalog book_id is ${bookConfig.catalogBookId}. Entity ID prefixes from extraction are preserved; book_id fields are normalized via docs/phase-1/book_id_aliases.json.`,
)
merged.book.notes = bookNotes.join(' ')

for (const key of ARRAY_KEYS) {
  const { items, collisions, noId } = mergeArray(key, batches)
  merged[key] = items
  counts[key] = items.length
  if (collisions || noId) {
    collisionLog[key] = { collisions, noId }
  }
}

const mergedAt = new Date().toISOString()
merged.verification = {
  status: 'unit_batches_merged',
  catalog_book_id: bookConfig.catalogBookId,
  schema_version: merged.schema?.version ?? '0.1',
  dataset_version: 1,
  merged_at: mergedAt,
  merged_from: bookConfig.unitPaths,
  unit_batch_statuses: Object.fromEntries(
    bookConfig.unitPaths.map((p) => [p, statusByPath.get(p) ?? null]),
  ),
  whole_book_audit: 'not_started',
  notes:
    'Mechanical merge of verified unit batches. book_id fields normalized to catalog ID; entity IDs preserved as extracted. Whole-book audit still required before Phase 1 COMPLETE.',
}

const aliasMap = loadBookIdAliasMap()
const normStats = applyCatalogBookId(merged, bookConfig.catalogBookId, aliasMap, {
  at: mergedAt,
})
console.log(
  `book_id normalization: rewritten=${normStats.fields_rewritten} seen=[${normStats.extracted_book_ids_seen.join(', ')}]`,
)

const canonicalPath = `${bookConfig.seriesSlug}/${bookConfig.catalogBookId}/canonical/v1.json`
const localDir = join(root, 'data', 'phase1', bookConfig.catalogBookId, 'canonical')
const localPath = join(localDir, 'v1.json')
mkdirSync(localDir, { recursive: true })
const body = `${JSON.stringify(merged, null, 2)}\n`
writeFileSync(localPath, body, 'utf8')
console.log(`Wrote local ${localPath} (${Buffer.byteLength(body)} bytes)`)

const { error: uploadError } = await supabase.storage.from(bucket).upload(canonicalPath, body, {
  contentType: 'application/json',
  upsert: true,
})
if (uploadError) {
  console.error(`Upload failed: ${uploadError.message}`)
  process.exit(1)
}
console.log(`Uploaded ${bucket}/${canonicalPath}`)

const { data: fileRow, error: upsertFileError } = await supabase
  .from('book_files')
  .upsert(
    {
      book_id: bookRow.id,
      file_type: 'canonical_json',
      bucket,
      storage_path: canonicalPath,
      filename: 'v1.json',
      mime_type: 'application/json',
      file_size: Buffer.byteLength(body),
      label: 'Canonical v1',
      status: 'verified',
    },
    { onConflict: 'bucket,storage_path' },
  )
  .select('id')
  .maybeSingle()

if (upsertFileError || !fileRow?.id) {
  console.error(
    `book_files upsert failed: ${upsertFileError?.message ?? 'no id returned'}`,
  )
  process.exit(1)
}

const { error: clearCurrentError } = await supabase
  .from('dataset_versions')
  .update({ is_current: false })
  .eq('book_id', bookRow.id)
  .eq('is_current', true)

if (clearCurrentError) {
  console.warn(`WARN  could not clear prior is_current: ${clearCurrentError.message}`)
}

const { data: existingVersion } = await supabase
  .from('dataset_versions')
  .select('id')
  .eq('book_id', bookRow.id)
  .eq('version', 1)
  .maybeSingle()

let versionError
if (existingVersion?.id) {
  ;({ error: versionError } = await supabase
    .from('dataset_versions')
    .update({
      schema_version: String(merged.schema?.version ?? '0.1'),
      json_file_id: fileRow.id,
      status: 'draft',
      is_current: true,
      notes:
        'Merged from 9 verified unit batches; whole-book audit pending. Entity IDs preserved as extracted.',
    })
    .eq('id', existingVersion.id))
} else {
  ;({ error: versionError } = await supabase.from('dataset_versions').insert({
    book_id: bookRow.id,
    version: 1,
    schema_version: String(merged.schema?.version ?? '0.1'),
    json_file_id: fileRow.id,
    status: 'draft',
    is_current: true,
    notes:
      'Merged from 9 verified unit batches; whole-book audit pending. Entity IDs preserved as extracted.',
  }))
}

if (versionError) {
  console.error(`dataset_versions upsert failed: ${versionError.message}`)
  process.exit(1)
}

console.log('\nMerge counts:')
for (const key of ARRAY_KEYS) {
  console.log(`  ${key}: ${counts[key]}`)
}
if (Object.keys(collisionLog).length) {
  console.log('\nDedup notes:')
  for (const [key, info] of Object.entries(collisionLog)) {
    console.log(`  ${key}: collisions=${info.collisions} noId=${info.noId}`)
  }
}

console.log(`\nDone. canonical=${canonicalPath}`)
console.log(`dataset_versions: version=1 is_current=true status=draft schema=${merged.schema?.version ?? '0.1'}`)
console.log(`book_files id=${fileRow.id}`)
