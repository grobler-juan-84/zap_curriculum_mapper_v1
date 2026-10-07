/**
 * Add missing BE2-SB appendix sticker page records referenced by
 * listen-and-stick paired_with relationships (bep2_p189–bep2_p191).
 *
 * Usage (from repo root):
 *   node scripts/patch_be2_appendix_sticker_pages.mjs
 */

import { createRequire } from 'node:module'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadBookIdAliasMap } from './lib/bookIdAliases.mjs'
import { getPhase1Book } from './lib/phase1Books.mjs'
import {
  formatValidationSummary,
  validatePhase1Dataset,
} from './lib/phase1Validation.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const bucket = 'book-datasets'
const bookKey = 'big_english_2_sb'
const cfg = getPhase1Book(bookKey)

function loadEnv(path) {
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

loadEnv(resolve(root, 'app', '.env.local'))
loadEnv(resolve(root, '.env.local'))
loadEnv(resolve(root, '.env'))

const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!url || !key) {
  console.error('Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const appendixPages = [
  {
    page_id: 'bep2_p189',
    book_id: 'big_english_2_sb',
    unit_id: null,
    printed_page: 189,
    pdf_page: 189,
    section_title: 'Stickers',
    section_type: 'appendix_stickers',
    page_heading: null,
    instructional: false,
    visual_dependency: true,
    audio_dependency: false,
    notes:
      'Appendix sticker sheet used by Units 1–3 listen-and-stick activities (Activity 11). Added 2026-10-07 to resolve dangling paired_with targets.',
    verification_status: 'needs_review',
  },
  {
    page_id: 'bep2_p190',
    book_id: 'big_english_2_sb',
    unit_id: null,
    printed_page: 190,
    pdf_page: 190,
    section_title: 'Stickers',
    section_type: 'appendix_stickers',
    page_heading: null,
    instructional: false,
    visual_dependency: true,
    audio_dependency: false,
    notes:
      'Appendix sticker sheet used by Units 4–6 listen-and-stick activities (Activity 11). Added 2026-10-07 to resolve dangling paired_with targets.',
    verification_status: 'needs_review',
  },
  {
    page_id: 'bep2_p191',
    book_id: 'big_english_2_sb',
    unit_id: null,
    printed_page: 191,
    pdf_page: 191,
    section_title: 'Stickers',
    section_type: 'appendix_stickers',
    page_heading: null,
    instructional: false,
    visual_dependency: true,
    audio_dependency: false,
    notes:
      'Appendix sticker sheet used by Units 7–9 listen-and-stick activities (Activity 11). Added 2026-10-07 to resolve dangling paired_with targets.',
    verification_status: 'needs_review',
  },
]

const { data, error } = await supabase.storage.from(bucket).download(cfg.canonicalPath)
if (error || !data) {
  console.error(`Download failed: ${error?.message ?? 'no data'}`)
  process.exit(1)
}

const canonical = JSON.parse(await data.text())
if (!Array.isArray(canonical.pages)) {
  console.error('Canonical pages array missing.')
  process.exit(1)
}

const existing = new Set(
  canonical.pages
    .map((page) => (page && typeof page.page_id === 'string' ? page.page_id : null))
    .filter(Boolean),
)

const added = []
for (const page of appendixPages) {
  if (existing.has(page.page_id)) {
    console.log(`Skip existing ${page.page_id}`)
    continue
  }
  canonical.pages.push(page)
  added.push(page.page_id)
}

if (!added.length) {
  console.log('No pages added; all appendix IDs already present.')
} else {
  console.log(`Added pages: ${added.join(', ')}`)
}

canonical.pages.sort((a, b) => {
  const ap = typeof a?.printed_page === 'number' ? a.printed_page : Number.MAX_SAFE_INTEGER
  const bp = typeof b?.printed_page === 'number' ? b.printed_page : Number.MAX_SAFE_INTEGER
  return ap - bp || String(a?.page_id ?? '').localeCompare(String(b?.page_id ?? ''))
})

if (canonical.book && typeof canonical.book === 'object') {
  const printed = canonical.pages
    .map((page) => page?.printed_page)
    .filter((value) => typeof value === 'number')
  if (printed.length) {
    canonical.book.printed_page_start = Math.min(...printed)
    canonical.book.printed_page_end = Math.max(...printed)
  }
}

canonical.verification = {
  ...(canonical.verification && typeof canonical.verification === 'object'
    ? canonical.verification
    : {}),
  appendix_pages_added_at: new Date().toISOString(),
  appendix_pages_added: added,
  notes: [
    typeof canonical.verification?.notes === 'string' ? canonical.verification.notes : null,
    'Added appendix sticker pages bep2_p189–bep2_p191 (unit_id null) to resolve dangling paired_with relationship targets from Activity 11 listen-and-stick items.',
  ]
    .filter(Boolean)
    .join(' '),
}

const aliasMap = loadBookIdAliasMap()
const report = validatePhase1Dataset(canonical, {
  mode: 'canonical',
  bookConfig: cfg,
  aliasMap,
  source: { type: 'patch_candidate', path: cfg.canonicalPath },
})
console.log(formatValidationSummary(report))
if (report.summary.error_count) {
  console.error('Validation still has ERROR findings; refusing upload.')
  process.exit(1)
}

const body = `${JSON.stringify(canonical, null, 2)}\n`
const localDir = join(root, 'data', 'phase1', cfg.catalogBookId, 'canonical')
mkdirSync(localDir, { recursive: true })
const localPath = join(localDir, 'v1.json')
writeFileSync(localPath, body, 'utf8')
console.log(`Wrote local ${localPath}`)

const validationDir = join(root, 'data', 'phase1', cfg.catalogBookId, 'validation')
mkdirSync(validationDir, { recursive: true })
const validationPath = join(validationDir, 'v1.report.json')
writeFileSync(validationPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Wrote validation report ${validationPath}`)

const { error: uploadError } = await supabase.storage.from(bucket).upload(cfg.canonicalPath, body, {
  contentType: 'application/json',
  upsert: true,
})
if (uploadError) {
  console.error(`Upload failed: ${uploadError.message}`)
  process.exit(1)
}
console.log(`Uploaded ${bucket}/${cfg.canonicalPath}`)

const { data: bookRow, error: bookError } = await supabase
  .from('books')
  .select('id')
  .eq('book_id', cfg.catalogBookId)
  .maybeSingle()
if (bookError || !bookRow?.id) {
  console.warn(`WARN book lookup failed: ${bookError?.message ?? 'not found'}`)
} else {
  const { error: fileError } = await supabase
    .from('book_files')
    .update({ file_size: Buffer.byteLength(body) })
    .eq('book_id', bookRow.id)
    .eq('file_type', 'canonical_json')
    .eq('storage_path', cfg.canonicalPath)
  if (fileError) console.warn(`WARN book_files update: ${fileError.message}`)

  const { error: versionError } = await supabase
    .from('dataset_versions')
    .update({
      notes:
        'Canonical v1 patched 2026-10-07: added appendix sticker pages bep2_p189–bep2_p191 for Activity 11 paired_with integrity. Whole-book audit PASSED retained; automated validation now passes with warnings.',
    })
    .eq('book_id', bookRow.id)
    .eq('version', 1)
    .eq('is_current', true)
  if (versionError) console.warn(`WARN dataset_versions update: ${versionError.message}`)
}

console.log('Done.')
