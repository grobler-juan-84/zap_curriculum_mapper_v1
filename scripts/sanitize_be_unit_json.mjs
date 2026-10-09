/**
 * Sanitize unit JSON files: escape bare quotes/control chars inside strings
 * (Studio dumps). Works for any catalog folder under data/phase1/.
 *
 * Usage:
 *   node scripts/sanitize_be_unit_json.mjs big_english_5_sb
 *   node scripts/sanitize_be_unit_json.mjs big_english_5_sb 1 2 3
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const catalog = process.argv[2]
if (!catalog) {
  console.error('Usage: node scripts/sanitize_be_unit_json.mjs <catalog_book_id> [units...]')
  process.exit(1)
}
const dir = resolve(__dirname, '../data/phase1', catalog)
const units = process.argv
  .slice(3)
  .map((s) => Number.parseInt(s, 10))
  .filter((n) => Number.isFinite(n) && n >= 1 && n <= 9)
const targets = units.length ? units : [1, 2, 3, 4, 5, 6, 7, 8, 9]

function sanitizeJsonText(raw) {
  let out = ''
  let inString = false
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]
    if (!inString) {
      if (ch === '"') {
        inString = true
        out += ch
      } else {
        out += ch
      }
      continue
    }
    if (ch === '\\') {
      const next = raw[i + 1]
      if (next == null) {
        out += '\\\\'
        continue
      }
      out += ch + next
      i += 1
      continue
    }
    if (ch === '"') {
      let j = i + 1
      while (j < raw.length && (raw[j] === ' ' || raw[j] === '\t')) j += 1
      const nxt = raw[j]
      if (
        nxt == null ||
        nxt === ',' ||
        nxt === '}' ||
        nxt === ']' ||
        nxt === ':' ||
        nxt === '\n' ||
        nxt === '\r'
      ) {
        inString = false
        out += ch
      } else {
        out += '\\"'
      }
      continue
    }
    const code = ch.charCodeAt(0)
    if (code < 0x20) {
      if (ch === '\n') out += '\\n'
      else if (ch === '\r') out += '\\r'
      else if (ch === '\t') out += '\\t'
      continue
    }
    out += ch
  }
  return out
}

let failed = 0
for (const n of targets) {
  const nn = String(n).padStart(2, '0')
  const path = join(dir, `${catalog}_unit_${nn}.json`)
  if (!existsSync(path)) {
    console.error(`MISSING ${path}`)
    failed += 1
    continue
  }
  const raw = readFileSync(path, 'utf8')
  try {
    JSON.parse(raw)
    console.log(`${catalog} U${nn}: already valid`)
    continue
  } catch (e) {
    console.log(`${catalog} U${nn}: repairing (${e.message})`)
  }
  const fixed = sanitizeJsonText(raw)
  try {
    const j = JSON.parse(fixed)
    writeFileSync(path, `${JSON.stringify(j, null, 2)}\n`, 'utf8')
    console.log(
      `${catalog} U${nn}: PARSE OK pages=${j.pages?.length} title=${j.units?.[0]?.title}`,
    )
  } catch (e) {
    console.error(`${catalog} U${nn}: still failing: ${e.message}`)
    failed += 1
  }
}
if (failed) process.exit(1)
