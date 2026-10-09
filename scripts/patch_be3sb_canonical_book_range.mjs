/**
 * Set BE3-SB canonical book.printed_page_* from merged pages (merge pickBook
 * kept Unit 1 batch range 4–19).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
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
loadEnv(join(root, 'app/.env.local'))
loadEnv(join(root, '.env.local'))

const path = join(root, 'data/phase1/big_english_3_sb/canonical/v1.json')
const j = JSON.parse(readFileSync(path, 'utf8'))
const printed = j.pages.map((p) => p.printed_page).filter((n) => typeof n === 'number')
j.book.printed_page_start = Math.min(...printed)
j.book.printed_page_end = Math.max(...printed)
const note =
  'Canonical book printed range set from merged pages 4–159 (Unit 1 batch metadata had 4–19). Printed pp. 66–67 missing from source PDF (D013); unit gaps 52–57 and 106–111 are checkpoint/review pages not extracted as unit batches.'
const existing = (j.book.notes || '').trim()
j.book.notes = existing.includes('Canonical book printed range')
  ? existing
  : existing
    ? `${existing} ${note}`
    : note

const body = `${JSON.stringify(j, null, 2)}\n`
writeFileSync(path, body, 'utf8')

const { createClient } = createRequire(join(root, 'app/package.json'))(
  '@supabase/supabase-js',
)
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const { error } = await sb.storage
  .from('book-datasets')
  .upload('big-english/big_english_3_sb/canonical/v1.json', Buffer.from(body, 'utf8'), {
    contentType: 'application/json',
    upsert: true,
  })
if (error) throw new Error(error.message)
console.log(
  `patched book printed ${j.book.printed_page_start}–${j.book.printed_page_end}`,
)
