/** Prints whether R2 env keys are set — never prints values. */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const path = resolve(root, '.env.local')
if (!existsSync(path)) {
  console.log('.env.local: MISSING')
  process.exit(1)
}
const text = readFileSync(path, 'utf8')
const need = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME']
let ok = true
for (const key of need) {
  const m = text.match(new RegExp(`^${key}=(.*)$`, 'm'))
  let v = m ? m[1].trim() : ''
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1)
  }
  if (!v) {
    console.log(`${key}: EMPTY`)
    ok = false
  } else {
    console.log(`${key}: SET (${v.length} chars)`)
  }
}
process.exit(ok ? 0 : 1)
