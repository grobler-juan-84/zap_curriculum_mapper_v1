/**
 * Upload series cover PNGs into the private `book-assets` bucket.
 *
 * Local source (gitignored): app/src/assests/images/book-series/*_book_series.png
 * Covers live in Storage after upload; drop files back locally only to re-upload.
 *
 * Reads credentials from app/.env.local (or process env):
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage (from repo root):
 *   node scripts/upload_series_covers.mjs
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
    seriesName: 'Beehive',
    localFile: 'beehive_book_series.png',
    storagePath: 'series/beehive_book_series.png',
  },
  {
    seriesName: 'Big English',
    localFile: 'big_english_book_series.png',
    storagePath: 'series/big_english_book_series.png',
  },
  {
    seriesName: 'Reach Higher',
    localFile: 'reach_higher_book_series.png',
    storagePath: 'series/reach_higher_book_series.png',
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

// Ensure private image bucket exists (idempotent for prototype).
const { error: bucketError } = await supabase.storage.createBucket(bucket, {
  public: false,
  fileSizeLimit: 10485760,
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
})
if (bucketError && !/already exists/i.test(bucketError.message)) {
  console.warn(`Bucket ensure warning: ${bucketError.message}`)
}

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

  const { error: metaError } = await supabase
    .from('book_series')
    .update({ cover_path: cover.storagePath })
    .ilike('name', cover.seriesName)

  if (metaError) {
    console.warn(
      `WARN   uploaded but could not update book_series.cover_path for ${cover.seriesName}: ${metaError.message}`,
    )
  }

  console.log(`OK     ${cover.storagePath} (${size} bytes) → ${cover.seriesName}`)
  uploaded += 1
}

console.log(`\nDone. uploaded=${uploaded} failed=${failed} total=${COVERS.length}`)
if (failed > 0) process.exit(1)
