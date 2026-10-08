import { readFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'data', 'phase1', 'big_english_2_wb')
const keys = [
  ['vocabulary', 'vocabulary_id'],
  ['language', 'language_id'],
  ['activities', 'activity_id'],
  ['continuous_text', 'text_id'],
  ['curriculum_components', 'component_id'],
  ['relationships', 'relationship_id'],
  ['extraction_issues', 'issue_id'],
  ['pages', 'page_id'],
]

for (let i = 1; i <= 9; i++) {
  const n = String(i).padStart(2, '0')
  const j = JSON.parse(
    readFileSync(join(dir, `big_english_2_wb_unit_${n}.json`), 'utf8'),
  )
  const parts = [`U${i}`]
  for (const [arr, idField] of keys) {
    const ids = (j[arr] || []).map((x) => x[idField]).filter(Boolean)
    if (!ids.length) {
      parts.push(`${arr}:0`)
      continue
    }
    const nums = ids
      .map((id) => {
        const m = String(id).match(/_(\d+)$/)
        return m ? Number(m[1]) : null
      })
      .filter((x) => x != null)
    parts.push(`${arr}:${ids.length} [${Math.min(...nums)}-${Math.max(...nums)}]`)
  }
  console.log(parts.join(' | '))
}
