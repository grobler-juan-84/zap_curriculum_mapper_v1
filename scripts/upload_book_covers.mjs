/**
 * Upload student-book cover PNGs into the private `book-assets` bucket
 * and set books.cover_path for the four pilot books.
 *
 * Usage (from repo root):
 *   node scripts/upload_book_covers.mjs
 */

import { readFileSync, existsSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)

const bucket = 'book-assets'
const localDir = join(root, 'app', 'src', 'assests', 'images', 'book-series')

const COVERS = [
  {
    bookId: 'beehive_1_sb',
    localFile: 'Beehive1_Student_Book_Cover.png',
    storagePath: 'books/beehive_1_sb/cover.png',
  },
  {
    bookId: 'big_english_1_sb',
    localFile: 'big_english_1_student_book_cover.png',
    storagePath: 'books/big_english_1_sb/cover.png',
  },
  {
    bookId: 'big_english_2_sb',
    localFile: 'big_english_2_student_book_cover.png',
    storagePath: 'books/big_english_2_sb/cover.png',
  },
  {
    bookId: 'reach_higher_2a',
    localFile: 'reach_higher_student_book_cover.png',
    storagePath: 'books/reach_higher_2a/cover.png',
  },
]

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

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

let uploaded = 0
let failed = 0

for (const cover of COVERS) {
  const localPath = join(localDir, cover.localFile)
  if (!existsSync(localPath)) {
    console.error(`MISSING ${localPath}`)
    failed += 1
    continue
  }

  const body = readFileSync(localPath)
  const size = statSync(localPath).size

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(cover.storagePath, body, {
      contentType: 'image/png',
      upsert: true,
    })

  if (uploadError) {
    console.error(`FAIL   ${cover.storagePath}: ${uploadError.message}`)
    failed += 1
    continue
  }

  const { data: updated, error: metaError } = await supabase
    .from('books')
    .update({ cover_path: cover.storagePath })
    .eq('book_id', cover.bookId)
    .select('book_id, cover_path')

  if (metaError) {
    console.warn(
      `WARN   uploaded but could not update books.cover_path for ${cover.bookId}: ${metaError.message}`,
    )
    console.warn('         Apply migration 20261007150000_books_cover_path.sql then re-run.')
  } else {
    console.log(`OK     ${cover.storagePath} (${size} bytes) → ${cover.bookId}`, updated)
  }

  uploaded += 1
}

console.log(`\nDone. uploaded=${uploaded} failed=${failed} total=${COVERS.length}`)
if (failed > 0) process.exit(1)
