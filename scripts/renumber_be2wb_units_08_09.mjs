/**
 * Fix BE2-WB Units 8–9 entity ID collisions by continuing counters from Units 1–7.
 * Remaps ID strings inside each unit JSON, writes local files, re-uploads to Storage.
 *
 * Usage: node scripts/renumber_be2wb_units_08_09.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const dir = join(root, 'data', 'phase1', 'big_english_2_wb')
const prefix = 'big_english_plus_2_wb'

const ARRAY_SPECS = [
  { key: 'vocabulary', idField: 'vocabulary_id', slug: 'vocab', width: 4 },
  { key: 'language', idField: 'language_id', slug: 'lang', width: 4 },
  { key: 'activities', idField: 'activity_id', slug: 'activity', width: 4 },
  { key: 'continuous_text', idField: 'text_id', slug: 'text', width: 4 },
  { key: 'curriculum_components', idField: 'component_id', slug: 'component', width: 4 },
  { key: 'relationships', idField: 'relationship_id', slug: 'relationship', width: 4 },
  { key: 'extraction_issues', idField: 'issue_id', slug: 'issue', width: 4 },
]

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

function readUnit(n) {
  const path = join(dir, `big_english_2_wb_unit_${String(n).padStart(2, '0')}.json`)
  return JSON.parse(readFileSync(path, 'utf8'))
}

function maxCounter(units, slug) {
  let max = 0
  const re = new RegExp(`^${prefix}_${slug}_(\\d+)$`)
  for (const unit of units) {
    for (const spec of ARRAY_SPECS) {
      if (spec.slug !== slug) continue
      for (const row of unit[spec.key] || []) {
        const id = row?.[spec.idField]
        const m = typeof id === 'string' ? id.match(re) : null
        if (m) max = Math.max(max, Number(m[1]))
      }
    }
  }
  return max
}

function deepRemap(value, map) {
  if (typeof value === 'string') return map.has(value) ? map.get(value) : value
  if (Array.isArray(value)) return value.map((v) => deepRemap(v, map))
  if (!value || typeof value !== 'object') return value
  const out = {}
  for (const [k, v] of Object.entries(value)) out[k] = deepRemap(v, map)
  return out
}

const prior = [1, 2, 3, 4, 5, 6, 7].map(readUnit)
const next = {}
for (const spec of ARRAY_SPECS) next[spec.slug] = maxCounter(prior, spec.slug) + 1

console.log('Starting counters after U1–7:', next)

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

for (const unitNum of [8, 9]) {
  const n = String(unitNum).padStart(2, '0')
  const path = join(dir, `big_english_2_wb_unit_${n}.json`)
  const dataset = JSON.parse(readFileSync(path, 'utf8'))
  const map = new Map()

  for (const spec of ARRAY_SPECS) {
    const rows = dataset[spec.key] || []
    for (const row of rows) {
      const oldId = row?.[spec.idField]
      if (typeof oldId !== 'string') continue
      const newId = `${prefix}_${spec.slug}_${String(next[spec.slug]).padStart(spec.width, '0')}`
      next[spec.slug] += 1
      if (map.has(oldId) && map.get(oldId) !== newId) {
        throw new Error(`Conflicting remap for ${oldId}`)
      }
      map.set(oldId, newId)
    }
  }

  const remapped = deepRemap(dataset, map)
  const body = `${JSON.stringify(remapped, null, 2)}\n`
  writeFileSync(path, body, 'utf8')

  const storagePath = `big-english/big_english_2_wb/batches/unit_${n}.json`
  const { error } = await supabase.storage
    .from('book-datasets')
    .upload(storagePath, Buffer.from(body, 'utf8'), {
      contentType: 'application/json',
      upsert: true,
    })
  if (error) throw new Error(`${storagePath}: ${error.message}`)

  console.log(
    `Unit ${unitNum}: remapped ${map.size} IDs → ${storagePath}`,
  )
}

console.log('Done. Next counters:', next)
console.log('Re-run: node scripts/merge_canonical_book.mjs big_english_2_wb')
