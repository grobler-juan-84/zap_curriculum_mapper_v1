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
import { loadBookIdAliasMap } from './lib/bookIdAliases.mjs'
import { getPhase1Book, PHASE1_BOOKS } from './lib/phase1Books.mjs'
import {
  formatValidationSummary,
  validatePhase1Dataset,
} from './lib/phase1Validation.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)

const bucket = 'book-datasets'

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
const cfg = getPhase1Book(bookKey)
if (!cfg) {
  console.error(
    `Unknown book "${bookKey}". Supported: ${Object.keys(PHASE1_BOOKS).join(', ')}`,
  )
  process.exit(1)
}

function asArray(v) {
  return Array.isArray(v) ? v : []
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
const validation = validatePhase1Dataset(canonical, {
  mode: 'canonical',
  bookConfig: cfg,
  aliasMap: loadBookIdAliasMap(),
  source: { type: 'canonical_audit', bucket, path: cfg.canonicalPath },
})
const counts = validation.metrics.counts
const integrityOk = validation.summary.error_count === 0
const units = asArray(canonical.units)
const pages = asArray(canonical.pages)
const unitNumbers = units
  .map((unit) => Number(unit?.unit_number))
  .filter((value) => Number.isFinite(value))
const presentUnits = new Set(unitNumbers)
const missingUnits = cfg.expectedUnits.filter((number) => !presentUnits.has(number))
const extraUnits = unitNumbers.filter((number) => !cfg.expectedUnits.includes(number))
const nonInstructionalPages = pages.filter((page) => page?.instructional === false)
const verification =
  canonical.verification && typeof canonical.verification === 'object'
    ? canonical.verification
    : {}
const auditedAt = new Date().toISOString().slice(0, 10)
const escapeCell = (value) => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ')
const findingRows = validation.findings.length
  ? validation.findings.map(
      (finding) =>
        `| ${finding.severity} | \`${finding.code}\` | \`${finding.path}\` | ${escapeCell(finding.message)} |`,
    )
  : ['| — | — | — | No structural findings. |']

const reportLines = [
  `# ${cfg.registryId} — Canonical v1 Whole-Book Audit (structural)`,
  '',
  '**Status:** ACTIVE',
  '**Version:** 1.1',
  `**Date:** ${auditedAt}`,
  `**Canonical path:** \`${cfg.canonicalPath}\``,
  `**Catalog book_id:** \`${cfg.catalogBookId}\``,
  '',
  '## Purpose',
  '',
  'Automated structural validation evidence for `extraction-data-specification.md` §15 and the integrity portion of §22.',
  'This report does **not** certify curriculum meaning, source completeness, or PDF visual fidelity. Owner source spot-check remains separate.',
  '',
  '## Automated validation summary',
  '',
  `- Status: **${validation.summary.status.toUpperCase()}**`,
  `- Errors: ${validation.summary.error_count}`,
  `- Warnings: ${validation.summary.warning_count}`,
  `- Info: ${validation.summary.info_count}`,
  `- Dataset SHA-256: \`${validation.dataset_sha256}\``,
  '',
  '## Counts',
  '',
  '| Array | Count |',
  '|---|---:|',
  ...Object.entries(counts).map(([key, value]) => `| \`${key}\` | ${value} |`),
  '',
  '## Coverage diagnostics',
  '',
  `- Expected units: ${cfg.expectedUnits.join(', ')}`,
  `- Present unit numbers: ${unitNumbers.sort((a, b) => a - b).join(', ') || '(none)'}`,
  `- Missing units: ${missingUnits.length ? missingUnits.join(', ') : 'none'}`,
  `- Extra units: ${extraUnits.length ? extraUnits.join(', ') : 'none'}`,
  `- Printed page range in \`pages\`: ${validation.metrics.printed_page_range.min ?? '—'}–${validation.metrics.printed_page_range.max ?? '—'}`,
  `- Book metadata printed range: ${canonical.book?.printed_page_start ?? '—'}–${canonical.book?.printed_page_end ?? '—'}`,
  `- Pages with \`instructional: false\`: ${nonInstructionalPages.length}`,
  '',
  '## Structural findings',
  '',
  '| Severity | Code | Path | Message |',
  '|---|---|---|---|',
  ...findingRows,
  '',
  `- Automated structural gate: **${integrityOk ? 'PASS' : 'FAIL'}**`,
  '',
  '## Uncertainty (preserved)',
  '',
  `- \`extraction_issues\`: ${counts.extraction_issues}`,
  ...Object.entries(validation.metrics.extraction_issue_types).map(
    ([type, count]) => `  - \`${type}\`: ${count}`,
  ),
  `- \`schema_gaps\`: ${counts.schema_gaps}`,
  ...Object.entries(validation.metrics.schema_gap_scopes).map(
    ([scope, count]) => `  - \`${scope}\`: ${count}`,
  ),
  '',
  'Open issues and schema gaps are diagnostics, not automatic structural failures.',
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
  '1. Unit start / mid / end pages vs the source PDF.',
  '2. Vocabulary and language evidence spot-check.',
  '3. Confirm open audio/visual/source dependencies are acceptable as documented debt.',
  '',
  'Reply in chat: **audit PASSED** or **audit NEEDS REVIEW** (+ notes).',
  '',
  '## Structural verdict (agent)',
  '',
  integrityOk
    ? 'Automated structural validation **PASS** (warnings may remain). Owner source audit is still required.'
    : 'Automated structural validation **FAIL**. Resolve ERROR findings before a new Whole-Book Audit PASS.',
  '',
]

const reportDir = join(root, 'docs', 'phase-1', 'audits')
mkdirSync(reportDir, { recursive: true })
const reportPath = join(reportDir, cfg.reportFile)
writeFileSync(reportPath, reportLines.join('\n'), 'utf8')
console.log(`Wrote ${reportPath}`)
console.log(formatValidationSummary(validation))
console.log(
  JSON.stringify(
    {
      counts,
      integrityOk,
      validationStatus: validation.summary.status,
      missingUnits,
      pageMin: validation.metrics.printed_page_range.min,
      pageMax: validation.metrics.printed_page_range.max,
    },
    null,
    2,
  ),
)
process.exitCode = integrityOk ? 0 : 1
