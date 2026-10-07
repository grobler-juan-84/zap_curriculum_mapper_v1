/**
 * Structural whole-book audit of a canonical dataset (integrity / coverage / uncertainty).
 * Does NOT certify PDF visual fidelity — owner spot-check still required.
 *
 * Usage:
 *   node scripts/audit_canonical_book.mjs big_english_1_sb
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)

const bucket = 'book-datasets'

const BOOKS = {
  beehive_1_sb: {
    catalogBookId: 'beehive_1_sb',
    registryId: 'BH1',
    displayName: 'Beehive 1 Student Book',
    canonicalPath: 'beehive/beehive_1_sb/canonical/v1.json',
    expectedUnits: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    reportFile: 'BH1_canonical_v1_audit.md',
  },
  big_english_1_sb: {
    catalogBookId: 'big_english_1_sb',
    registryId: 'BE1-SB',
    displayName: 'Big English 1 Student Book',
    canonicalPath: 'big-english/big_english_1_sb/canonical/v1.json',
    expectedUnits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    reportFile: 'BE1-SB_canonical_v1_audit.md',
  },
  big_english_2_sb: {
    catalogBookId: 'big_english_2_sb',
    registryId: 'BE2-SB',
    displayName: 'Big English 2 Student Book',
    canonicalPath: 'big-english/big_english_2_sb/canonical/v1.json',
    expectedUnits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    reportFile: 'BE2-SB_canonical_v1_audit.md',
  },
}

const ID_FIELDS = {
  units: 'unit_id',
  pages: 'page_id',
  vocabulary: 'vocabulary_id',
  language: 'language_id',
  activities: 'activity_id',
  continuous_text: 'continuous_text_id',
  curriculum_components: 'component_id',
  relationships: 'relationship_id',
  extraction_issues: 'issue_id',
  schema_gaps: 'schema_gap_id',
}

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
loadEnvFile(resolve(root, '.env'))

const bookKey = (process.argv[2] || 'big_english_1_sb').trim()
const cfg = BOOKS[bookKey]
if (!cfg) {
  console.error(`Unknown book "${bookKey}". Supported: ${Object.keys(BOOKS).join(', ')}`)
  process.exit(1)
}

function asArray(v) {
  return Array.isArray(v) ? v : []
}

function asRecord(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v) ? v : null
}

function findDuplicates(items, idField) {
  const seen = new Map()
  const dups = []
  for (const item of items) {
    const rec = asRecord(item)
    if (!rec) continue
    const id = typeof rec[idField] === 'string' ? rec[idField] : null
    if (!id) continue
    if (seen.has(id)) dups.push(id)
    else seen.set(id, true)
  }
  return [...new Set(dups)]
}

async function loadCanonical() {
  const localPath = join(root, 'data', 'phase1', cfg.catalogBookId, 'canonical', 'v1.json')
  if (existsSync(localPath)) {
    console.log(`Loading local ${localPath}`)
    return JSON.parse(readFileSync(localPath, 'utf8'))
  }

  const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  if (!url || !key) {
    throw new Error('No local canonical file and missing Supabase credentials')
  }
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  console.log(`Downloading ${bucket}/${cfg.canonicalPath}`)
  const { data, error } = await supabase.storage.from(bucket).download(cfg.canonicalPath)
  if (error || !data) throw new Error(error?.message || 'download failed')
  return JSON.parse(await data.text())
}

const canonical = await loadCanonical()
const units = asArray(canonical.units)
const pages = asArray(canonical.pages)
const vocabulary = asArray(canonical.vocabulary)
const language = asArray(canonical.language)
const activities = asArray(canonical.activities)
const continuousText = asArray(canonical.continuous_text)
const components = asArray(canonical.curriculum_components)
const relationships = asArray(canonical.relationships)
const issues = asArray(canonical.extraction_issues)
const gaps = asArray(canonical.schema_gaps)
const book = asRecord(canonical.book) || {}
const verification = asRecord(canonical.verification) || {}

const counts = {
  units: units.length,
  pages: pages.length,
  vocabulary: vocabulary.length,
  language: language.length,
  activities: activities.length,
  continuous_text: continuousText.length,
  curriculum_components: components.length,
  relationships: relationships.length,
  extraction_issues: issues.length,
  schema_gaps: gaps.length,
}

const dupReport = {}
for (const [key, idField] of Object.entries(ID_FIELDS)) {
  const items = asArray(canonical[key])
  const dups = findDuplicates(items, idField)
  const missingId = items.filter((item) => {
    const rec = asRecord(item)
    return !rec || typeof rec[idField] !== 'string' || !rec[idField]
  }).length
  dupReport[key] = { duplicates: dups, missingIdCount: missingId }
}

const unitNumbers = units
  .map((u) => {
    const n = asRecord(u)?.unit_number
    return n == null ? null : Number(n)
  })
  .filter((n) => Number.isFinite(n))
const missingUnits = cfg.expectedUnits.filter((n) => !unitNumbers.includes(n))
const extraUnits = unitNumbers.filter((n) => !cfg.expectedUnits.includes(n))

const pagesMissingPrinted = pages.filter((p) => {
  const rec = asRecord(p)
  return !rec || (typeof rec.printed_page !== 'number' && rec.printed_page !== 0)
})

const printedPages = pages
  .map((p) => asRecord(p)?.printed_page)
  .filter((n) => typeof n === 'number')
const pageMin = printedPages.length ? Math.min(...printedPages) : null
const pageMax = printedPages.length ? Math.max(...printedPages) : null

const unitIds = new Set(
  units.map((u) => asRecord(u)?.unit_id).filter((id) => typeof id === 'string'),
)
const orphanPages = pages.filter((p) => {
  const uid = asRecord(p)?.unit_id
  return typeof uid === 'string' && uid && !unitIds.has(uid)
})

const unitsMissingRange = units.filter((u) => {
  const rec = asRecord(u)
  if (!rec) return true
  return rec.printed_page_start == null || rec.printed_page_end == null
})

const nonInstructionalPages = pages.filter((p) => asRecord(p)?.instructional === false)

const issueTypes = {}
for (const issue of issues) {
  const t = asRecord(issue)?.issue_type || asRecord(issue)?.type || 'untyped'
  issueTypes[t] = (issueTypes[t] || 0) + 1
}
const gapTypes = {}
for (const gap of gaps) {
  const t = asRecord(gap)?.gap_type || asRecord(gap)?.closest_existing_structure || 'untyped'
  gapTypes[t] = (gapTypes[t] || 0) + 1
}

const integrityOk =
  Object.values(dupReport).every((r) => r.duplicates.length === 0) &&
  orphanPages.length === 0 &&
  unitsMissingRange.length === 0 &&
  missingUnits.length === 0 &&
  pagesMissingPrinted.length === 0

const auditedAt = new Date().toISOString().slice(0, 10)
const reportLines = [
  `# ${cfg.registryId} — Canonical v1 Whole-Book Audit (structural)`,
  '',
  '**Status:** ACTIVE',
  '**Version:** 1.0',
  `**Date:** ${auditedAt}`,
  `**Canonical path:** \`${cfg.canonicalPath}\``,
  `**Catalog book_id:** \`${cfg.catalogBookId}\``,
  '',
  '## Purpose',
  '',
  'Structural / integrity evidence for the whole-book audit checklist in `Extraction_Data_Specification.md` §22.',
  'This report does **not** by itself certify PDF visual fidelity. Owner PDF spot-check is still required.',
  '',
  '## Counts',
  '',
  '| Array | Count |',
  '|---|---:|',
  ...Object.entries(counts).map(([k, v]) => `| \`${k}\` | ${v} |`),
  '',
  '## Coverage',
  '',
  `- Expected units: ${cfg.expectedUnits.join(', ')}`,
  `- Present unit numbers: ${unitNumbers.sort((a, b) => a - b).join(', ') || '(none)'}`,
  `- Missing units: ${missingUnits.length ? missingUnits.join(', ') : 'none'}`,
  `- Extra units: ${extraUnits.length ? extraUnits.join(', ') : 'none'}`,
  `- Printed page range in \`pages\`: ${pageMin ?? '—'}–${pageMax ?? '—'}`,
  `- Book metadata printed range: ${book.printed_page_start ?? '—'}–${book.printed_page_end ?? '—'}`,
  `- Pages with \`instructional: false\`: ${nonInstructionalPages.length}`,
  `- Continuous text entries: ${continuousText.length}`,
  `- Activities: ${activities.length}`,
  '',
  '## Integrity',
  '',
  `| Entity | Duplicate IDs | Missing ID field |`,
  `|---|---:|---:|`,
  ...Object.entries(dupReport).map(
    ([k, r]) =>
      `| \`${k}\` | ${r.duplicates.length}${r.duplicates.length ? ` (${r.duplicates.slice(0, 5).join(', ')}${r.duplicates.length > 5 ? ', …' : ''})` : ''} | ${r.missingIdCount} |`,
  ),
  '',
  `- Pages missing \`printed_page\`: ${pagesMissingPrinted.length}`,
  `- Units missing page start/end: ${unitsMissingRange.length}`,
  `- Pages referencing unknown \`unit_id\`: ${orphanPages.length}`,
  `- Structural integrity gate: **${integrityOk ? 'PASS' : 'FAIL'}**`,
  '',
  '## Uncertainty (preserved)',
  '',
  `- \`extraction_issues\`: ${issues.length}`,
  ...(Object.keys(issueTypes).length
    ? Object.entries(issueTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([t, n]) => `  - \`${t}\`: ${n}`)
    : ['  - (none)']),
  `- \`schema_gaps\`: ${gaps.length}`,
  ...(Object.keys(gapTypes).length
    ? Object.entries(gapTypes).map(([t, n]) => `  - \`${t}\`: ${n}`)
    : ['  - (none)']),
  '',
  'Open issues and schema gaps must remain documented (not silently removed).',
  '',
  '## Merge metadata',
  '',
  `- \`verification.status\`: ${verification.status ?? '—'}`,
  `- \`verification.whole_book_audit\`: ${verification.whole_book_audit ?? '—'}`,
  `- \`verification.merged_at\`: ${verification.merged_at ?? '—'}`,
  `- Batches merged: ${asArray(verification.merged_from).length}`,
  '',
  '## Owner PDF spot-check checklist',
  '',
  `In \`/app/validation\` for ${cfg.displayName || cfg.catalogBookId}:`,
  '',
  '1. Unit 1 start / mid / end pages vs Pages list in the left panel.',
  '2. Vocabulary spot-check against the PDF.',
  '3. Spot-check language / sentence structure evidence.',
  '4. Confirm open audio/visual extraction issues are acceptable as documented debt (not blockers).',
  '',
  'Reply in chat: **audit PASSED** or **audit NEEDS REVIEW** (+ notes).',
  '',
  '## Structural verdict (agent)',
  '',
  integrityOk
    ? 'Structural integrity checks **PASS**. Awaiting owner PDF spot-check for Whole-Book Audit status.'
    : 'Structural integrity checks **FAIL**. Investigate before marking Whole-Book Audit PASSED.',
  '',
]

const reportDir = join(root, 'docs', 'phase-1', 'audits')
mkdirSync(reportDir, { recursive: true })
const reportPath = join(reportDir, cfg.reportFile)
writeFileSync(reportPath, reportLines.join('\n'), 'utf8')
console.log(`Wrote ${reportPath}`)
console.log(JSON.stringify({ counts, integrityOk, missingUnits, pageMin, pageMax }, null, 2))
