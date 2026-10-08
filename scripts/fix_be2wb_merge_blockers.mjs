/**
 * Fix remaining BE2-WB merge blockers after U8/U9 remumber:
 * 1) Normalize language IDs to `…_lang_NNNN` continuing from Unit 7 (max 30).
 * 2) Convert Unit 8 dangling Extra Grammar Practice relationship (page_141)
 *    into an open extraction_issue — appendix page not in unit batches.
 *
 * Usage: node scripts/fix_be2wb_merge_blockers.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const dir = join(root, 'data', 'phase1', 'big_english_2_wb')
const prefix = 'big_english_plus_2_wb'

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

function deepRemap(value, map) {
  if (typeof value === 'string') return map.has(value) ? map.get(value) : value
  if (Array.isArray(value)) return value.map((v) => deepRemap(v, map))
  if (!value || typeof value !== 'object') return value
  const out = {}
  for (const [k, v] of Object.entries(value)) out[k] = deepRemap(v, map)
  return out
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

let nextLang = 31
let nextIssue = 19

for (const unitNum of [8, 9]) {
  const n = String(unitNum).padStart(2, '0')
  const path = join(dir, `big_english_2_wb_unit_${n}.json`)
  let dataset = JSON.parse(readFileSync(path, 'utf8'))
  const map = new Map()

  for (const row of dataset.language || []) {
    const oldId = row.language_id
    if (typeof oldId !== 'string') continue
    const newId = `${prefix}_lang_${String(nextLang).padStart(4, '0')}`
    nextLang += 1
    map.set(oldId, newId)
  }

  dataset = deepRemap(dataset, map)

  if (unitNum === 8) {
    const before = (dataset.relationships || []).length
    dataset.relationships = (dataset.relationships || []).filter(
      (r) => r?.target_entity_id !== `${prefix}_page_141`,
    )
    const removed = before - dataset.relationships.length
    if (removed) {
      dataset.extraction_issues = dataset.extraction_issues || []
      dataset.extraction_issues.push({
        issue_id: `${prefix}_issue_${String(nextIssue).padStart(4, '0')}`,
        book_id: prefix,
        unit_id: `${prefix}_unit_08`,
        page_id: null,
        entity_type: 'unit',
        entity_id: `${prefix}_unit_08`,
        issue_type: 'possible_omission',
        severity: 'review',
        description:
          'Unit 8 notes Extra Grammar Practice on printed page 141, but that appendix page was not extracted into unit batches (represented pages end at 131). Relationship to page_141 removed to satisfy canonical validation; do not invent appendix page content until appendix extraction is planned.',
        status: 'open',
      })
      nextIssue += 1
      console.log('Unit 8: removed page_141 relationship; added possible_omission issue')
    }
  }

  const body = `${JSON.stringify(dataset, null, 2)}\n`
  writeFileSync(path, body, 'utf8')
  const storagePath = `big-english/big_english_2_wb/batches/unit_${n}.json`
  const { error } = await supabase.storage
    .from('book-datasets')
    .upload(storagePath, Buffer.from(body, 'utf8'), {
      contentType: 'application/json',
      upsert: true,
    })
  if (error) throw new Error(`${storagePath}: ${error.message}`)
  console.log(`Unit ${unitNum}: language remaps=${map.size} uploaded`)
}

console.log(`Done. nextLang=${nextLang} nextIssue=${nextIssue}`)
