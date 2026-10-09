/**
 * Remumber BE6-WB entity IDs that collide across units (Studio counter resets
 * on Units 3 and 8 for `bep6_wb_vocab_*` / `bep6_wb_lang_*`). Deep-remaps
 * references within each affected unit, writes local JSON, re-uploads to Storage.
 *
 * Usage: node scripts/renumber_be6wb_merge_collisions.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const dir = join(root, 'data', 'phase1', 'big_english_6_wb')
const catalog = 'big_english_6_wb'

const ARRAY_SPECS = [
  { key: 'vocabulary', idFields: ['vocab_id', 'vocabulary_id'], slug: 'vocab', width: 4 },
  { key: 'language', idFields: ['language_id', 'lang_id'], slug: 'lang', width: 4 },
  { key: 'activities', idFields: ['activity_id'], slug: 'activity', width: 4 },
  { key: 'continuous_text', idFields: ['text_id'], slug: 'text', width: 4 },
  { key: 'curriculum_components', idFields: ['component_id'], slug: 'component', width: 4 },
  { key: 'relationships', idFields: ['relationship_id'], slug: 'relationship', width: 4 },
  { key: 'extraction_issues', idFields: ['issue_id'], slug: 'issue', width: 4 },
  { key: 'schema_gaps', idFields: ['schema_gap_id', 'gap_id'], slug: 'gap', width: 4 },
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

function idOf(row, fields) {
  for (const f of fields) {
    if (typeof row?.[f] === 'string' && row[f]) return { field: f, id: row[f] }
  }
  return null
}

function collectIds(dataset) {
  const ids = new Set()
  for (const spec of ARRAY_SPECS) {
    for (const row of dataset[spec.key] || []) {
      const hit = idOf(row, spec.idFields)
      if (hit) ids.add(hit.id)
    }
  }
  return ids
}

function deepRemap(value, map) {
  if (typeof value === 'string') return map.has(value) ? map.get(value) : value
  if (Array.isArray(value)) return value.map((v) => deepRemap(v, map))
  if (!value || typeof value !== 'object') return value
  const out = {}
  for (const [k, v] of Object.entries(value)) out[k] = deepRemap(v, map)
  return out
}

function sha(s) {
  return createHash('sha256').update(s).digest('hex').slice(0, 12)
}

function readUnit(n) {
  return JSON.parse(
    readFileSync(join(dir, `${catalog}_unit_${String(n).padStart(2, '0')}.json`), 'utf8'),
  )
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

const next = Object.fromEntries(ARRAY_SPECS.map((s) => [s.slug, 1]))
const seen = new Set()

for (let i = 1; i <= 9; i++) {
  const dataset = readUnit(i)
  for (const id of collectIds(dataset)) {
    const m = id.match(new RegExp(`^${catalog}_([a-z]+)_(\\d+)$`))
    if (m && next[m[1]] != null) {
      next[m[1]] = Math.max(next[m[1]], Number(m[2]) + 1)
    }
  }
}

console.log('Seeded catalog counters:', next)

for (const unitNum of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
  const n = String(unitNum).padStart(2, '0')
  const path = join(dir, `${catalog}_unit_${n}.json`)
  const dataset = JSON.parse(readFileSync(path, 'utf8'))
  const map = new Map()

  for (const spec of ARRAY_SPECS) {
    for (const row of dataset[spec.key] || []) {
      const hit = idOf(row, spec.idFields)
      if (!hit) continue
      // Remumber if this ID was already claimed by an earlier unit.
      if (!seen.has(hit.id)) continue
      if (map.has(hit.id)) continue
      let newId
      do {
        newId = `${catalog}_${spec.slug}_${String(next[spec.slug]).padStart(spec.width, '0')}`
        next[spec.slug] += 1
      } while (seen.has(newId) || [...map.values()].includes(newId))
      map.set(hit.id, newId)
    }
  }

  if (map.size === 0) {
    for (const id of collectIds(dataset)) seen.add(id)
    console.log(`Unit ${unitNum}: no remumber needed`)
    continue
  }

  const remapped = deepRemap(dataset, map)
  const body = `${JSON.stringify(remapped, null, 2)}\n`
  writeFileSync(path, body, 'utf8')

  for (const id of collectIds(remapped)) seen.add(id)

  await uploadUnit(n, body)

  console.log(`Unit ${unitNum}: remapped ${map.size} IDs`)
  for (const [oldId, newId] of [...map.entries()].slice(0, 8)) {
    console.log(`  ${oldId} → ${newId}`)
  }
  if (map.size > 8) console.log(`  … +${map.size - 8} more`)
}

const final = new Map()
let collisions = 0
for (let i = 1; i <= 9; i++) {
  for (const id of collectIds(readUnit(i))) {
    if (final.has(id)) {
      collisions += 1
      console.error(`STILL COLLIDES ${id} U${final.get(id)} vs U${i}`)
    } else final.set(id, i)
  }
}
console.log(
  collisions === 0
    ? 'OK: zero cross-unit entity ID collisions'
    : `FAIL: ${collisions} remain`,
)
if (collisions) process.exit(1)

// Also ensure U04 grammar-inclusive range is on Storage (local already patched).
{
  const nn = '04'
  const path = join(dir, `${catalog}_unit_${nn}.json`)
  const body = `${JSON.stringify(JSON.parse(readFileSync(path, 'utf8')), null, 2)}\n`
  writeFileSync(path, body, 'utf8')
  await uploadUnit(nn, body)
  console.log('Re-uploaded U04 to confirm Storage has grammar-inclusive range')
}

console.log(`Re-run: node scripts/merge_canonical_book.mjs ${catalog}`)
