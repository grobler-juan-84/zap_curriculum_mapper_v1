/**
 * Sanitize BE3-WB unit JSON: escape bare control characters and unescaped
 * quotes that Studio dumps leave inside string literals.
 *
 * Usage: node scripts/fix_be3wb_json_quotes.mjs 3 6
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = resolve(__dirname, '../data/phase1/big_english_3_wb')
const units = process.argv
  .slice(2)
  .map((s) => Number.parseInt(s, 10))
  .filter((n) => Number.isFinite(n))

if (!units.length) {
  console.error('Usage: node scripts/fix_be3wb_json_quotes.mjs 3 6')
  process.exit(1)
}

/**
 * Walk the raw text; inside JSON strings, escape bare " and control chars.
 * Outside strings, leave structure alone.
 */
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

    // in string
    if (ch === '\\') {
      const next = raw[i + 1]
      if (next == null) {
        out += '\\\\'
        continue
      }
      // keep valid escapes; rewrite bare control after backslash incorrectly
      out += ch + next
      i += 1
      continue
    }
    if (ch === '"') {
      // Lookahead: is this the end of the string?
      // Heuristic: closing quote if followed by optional space then , } ] : or EOF/newline then structural.
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
      // drop other controls
      continue
    }
    out += ch
  }
  return out
}

for (const n of units) {
  const nn = String(n).padStart(2, '0')
  const path = join(dir, `big_english_3_wb_unit_${nn}.json`)
  if (!existsSync(path)) throw new Error(`Missing ${path}`)
  const raw = readFileSync(path, 'utf8')
  try {
    JSON.parse(raw)
    console.log(`U${nn}: already valid JSON`)
    continue
  } catch (e) {
    console.log(`U${nn}: repairing (${e.message})`)
  }
  const fixed = sanitizeJsonText(raw)
  try {
    const j = JSON.parse(fixed)
    writeFileSync(path, `${JSON.stringify(j, null, 2)}\n`, 'utf8')
    console.log(
      `U${nn}: PARSE OK pages=${j.pages?.length} vocab=${j.vocabulary?.length} acts=${j.activities?.length} title=${j.units?.[0]?.title}`,
    )
  } catch (e) {
    console.error(`U${nn}: still failing: ${e.message}`)
    const m = String(e.message).match(/position (\d+)/)
    if (m) {
      const pos = Number(m[1])
      console.error(JSON.stringify(fixed.slice(Math.max(0, pos - 100), pos + 100)))
    }
    process.exit(1)
  }
}
