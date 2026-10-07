/**
 * Re-apply book_id alias normalization to an existing canonical JSON in Storage
 * (and optional local mirror). Does not rewrite entity ID strings.
 *
 * Usage:
 *   node scripts/normalize_canonical_book_ids.mjs big_english_1_sb
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

const BOOKS = {
  big_english_1_sb: {
    catalogBookId: 'big_english_1_sb',
    canonicalPath: 'big-english/big_english_1_sb/canonical/v1.json',
  },
  big_english_2_sb: {
    catalogBookId: 'big_english_2_sb',
    canonicalPath: 'big-english/big_english_2_sb/canonical/v1.json',
  },
  beehive_1_sb: {
    catalogBookId: 'beehive_1_sb',
    canonicalPath: 'beehive/beehive_1_sb/canonical/v1.json',
  },
  reach_higher_2a: {
    catalogBookId: 'reach_higher_2a',
    canonicalPath: 'reach-higher/reach_higher_2a/canonical/v1.json',
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

const bookKey = (process.argv[2] || '').trim()
if (!bookKey || !BOOKS[bookKey]) {
  console.error(`Usage: node scripts/normalize_canonical_book_ids.mjs <book_key>`)
  console.error(`Supported: ${Object.keys(BOOKS).join(', ')}`)
  process.exit(1)
}

const cfg = BOOKS[bookKey]
const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL (or SUPABASE_URL) and/or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: blob, error: downloadError } = await supabase.storage
  .from(bucket)
  .download(cfg.canonicalPath)

if (downloadError || !blob) {
  console.error(`Download failed: ${downloadError?.message ?? 'no data'} (${cfg.canonicalPath})`)
  process.exit(1)
}

const canonical = JSON.parse(await blob.text())
const aliasMap = loadBookIdAliasMap()
const at = new Date().toISOString()
const stats = applyCatalogBookId(canonical, cfg.catalogBookId, aliasMap, { at })

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

const { data: bookRow } = await supabase
  .from('books')
  .select('id')
  .eq('book_id', cfg.catalogBookId)
  .maybeSingle()

if (bookRow?.id) {
  await supabase
    .from('book_files')
    .update({ file_size: Buffer.byteLength(body) })
    .eq('book_id', bookRow.id)
    .eq('file_type', 'canonical_json')
    .eq('storage_path', cfg.canonicalPath)
}

console.log(`Uploaded ${bucket}/${cfg.canonicalPath}`)
console.log(
  `normalized: rewritten=${stats.fields_rewritten} extracted_seen=[${stats.extracted_book_ids_seen.join(', ')}] aliases=[${stats.aliases_applied.join(', ')}]`,
)
