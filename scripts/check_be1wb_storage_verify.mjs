/**
 * Sample Storage batch verification_status for BE1-WB units.
 * Usage: node scripts/check_be1wb_storage_verify.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

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

const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

for (let i = 1; i <= 9; i++) {
  const n = String(i).padStart(2, '0')
  const path = `big-english/big_english_1_wb/batches/unit_${n}.json`
  const { data, error } = await supabase.storage.from('book-datasets').download(path)
  if (error || !data) {
    console.log(`Unit ${i}\tDOWNLOAD FAIL ${error?.message}`)
    continue
  }
  const j = JSON.parse(await data.text())
  const unitVer = j.units?.[0]?.verification_status ?? '?'
  const missing = (j.extraction_issues || []).filter(
    (x) => x.issue_type === 'missing_source' && x.status === 'open',
  )
  console.log(
    `Unit ${i}\tunit=${unitVer}\tbook=${j.book?.verification_status}\topen_missing_source=${missing.length}\tpages=${j.pages?.length ?? 0}`,
  )
  if (i === 9 && missing[0]) {
    console.log(`  missing_source: ${missing[0].description.slice(0, 160)}…`)
  }
}
