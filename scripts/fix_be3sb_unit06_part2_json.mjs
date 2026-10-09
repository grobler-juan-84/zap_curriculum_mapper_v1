/**
 * One-off repair: escape bare double quotes inside continuous_text content
 * fields in BE3-SB Unit 6 part2 JSON (Studio export often leaves them unescaped).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const path = resolve(
  __dirname,
  '../data/phase1/big_english_3_sb/big_english_3_sb_unit_06_p98_105.json',
)

const raw = readFileSync(path, 'utf8')

function escapeBareQuotesInContentFields(text) {
  const re =
    /("content"\s*:\s*")([\s\S]*?)("\s*,\s*\n\s*"(?:speaker_structure|audio_dependency|notes|verification_status|title|text_type)")/g
  return text.replace(re, (_full, pre, body, post) => {
    let out = ''
    for (let i = 0; i < body.length; i++) {
      const ch = body[i]
      if (ch === '\\') {
        out += ch
        if (i + 1 < body.length) out += body[++i]
        continue
      }
      if (ch === '"') {
        out += '\\"'
        continue
      }
      out += ch
    }
    return pre + out + post
  })
}

const fixed = escapeBareQuotesInContentFields(raw)
const parsed = JSON.parse(fixed)
const pages = (parsed.pages || []).map((p) => p.printed_page)
console.log(
  'PARSE OK',
  `pages ${pages[0]}-${pages.at(-1)} (${pages.length})`,
  `vocab ${parsed.vocabulary?.length}`,
  `acts ${parsed.activities?.length}`,
  `texts ${parsed.continuous_text?.length}`,
)
writeFileSync(path, fixed, 'utf8')
console.log('Wrote', path)
