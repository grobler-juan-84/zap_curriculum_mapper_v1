import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
function loadEnv(p) {
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq <= 0) continue
    const k = t.slice(0, eq).trim()
    let v = t.slice(eq + 1).trim()
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1)
    }
    if (!(k in process.env) || !process.env[k]) process.env[k] = v
  }
}
loadEnv(resolve(root, 'app/.env.local'))
loadEnv(resolve(root, '.env.local'))
const { createClient } = createRequire(resolve(root, 'app/package.json'))(
  '@supabase/supabase-js',
)
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const path = 'big-english/big_english_3_sb/batches/unit_02.json'
const { data, error } = await sb.storage.from('book-datasets').download(path)
if (error) throw new Error(error.message)
const j = JSON.parse(await data.text())
console.log('storage bytes', Buffer.byteLength(JSON.stringify(j)))
console.log('rels', j.relationships.length)
j.relationships.forEach((r, i) =>
  console.log(i, r.relationship_id, typeof r.target_entity_id, r.target_entity_id),
)
console.log(
  'has workbook issue',
  (j.extraction_issues || []).some((i) => i.issue_id?.includes('workbook')),
)
