/**
 * Validate one Phase 1 canonical or batch JSON file.
 *
 * Examples:
 *   node scripts/validate_phase1_json.mjs big_english_1_sb
 *   node scripts/validate_phase1_json.mjs reach_higher_2a --json
 *   node scripts/validate_phase1_json.mjs big_english_1_sb --file path/to/unit.json --mode batch
 *   node scripts/validate_phase1_json.mjs big_english_1_sb --storage-path big-english/big_english_1_sb/batches/unit_01.json --mode batch
 */

import { createRequire } from 'node:module'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadBookIdAliasMap } from './lib/bookIdAliases.mjs'
import { getPhase1Book, PHASE1_BOOKS } from './lib/phase1Books.mjs'
import {
  formatValidationSummary,
  validatePhase1Dataset,
} from './lib/phase1Validation.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const bucket = 'book-datasets'

function parseArgs(argv) {
  const options = {
    bookKey: null,
    file: null,
    storagePath: null,
    mode: 'canonical',
    json: false,
    report: null,
    writeReport: true,
  }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--file') options.file = argv[++index]
    else if (arg === '--storage-path') options.storagePath = argv[++index]
    else if (arg === '--mode') options.mode = argv[++index]
    else if (arg === '--json') options.json = true
    else if (arg === '--report') options.report = argv[++index]
    else if (arg === '--no-report') options.writeReport = false
    else if (!arg.startsWith('--') && !options.bookKey) options.bookKey = arg
    else throw new Error(`Unknown argument "${arg}".`)
  }
  options.bookKey ??= 'big_english_1_sb'
  return options
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

function parseFailureReport({ source, mode, message }) {
  return {
    report_version: 1,
    validator_version: '0.1.0',
    generated_at: new Date().toISOString(),
    mode,
    source,
    dataset_sha256: null,
    dataset: {
      catalog_book_id: null,
      book_id: null,
      schema_name: null,
      schema_version: null,
    },
    summary: {
      status: 'failed',
      error_count: 1,
      warning_count: 0,
      info_count: 0,
    },
    metrics: {
      counts: {},
      printed_page_range: { min: null, max: null },
      vocabulary_classifications: {},
      extraction_issue_types: {},
      schema_gap_scopes: {},
    },
    findings: [
      {
        severity: 'ERROR',
        code: 'JSON_PARSE_FAILED',
        path: '/',
        message,
      },
    ],
    disclaimer:
      'Automated structural validation only. This report does not certify curriculum meaning, source completeness, or PDF fidelity.',
  }
}

async function loadInput(options, config) {
  if (options.file) {
    const path = isAbsolute(options.file) ? options.file : resolve(root, options.file)
    return { text: readFileSync(path, 'utf8'), source: { type: 'file', path } }
  }

  if (!options.storagePath) {
    if (options.mode !== 'canonical') {
      throw new Error('--file or --storage-path is required when validating a batch.')
    }
    const localPath = join(
      root,
      'data',
      'phase1',
      config.catalogBookId,
      'canonical',
      'v1.json',
    )
    if (existsSync(localPath)) {
      return {
        text: readFileSync(localPath, 'utf8'),
        source: { type: 'file', path: localPath },
      }
    }
  }

  loadEnvFile(resolve(root, 'app', '.env.local'))
  loadEnvFile(resolve(root, '.env.local'))
  loadEnvFile(resolve(root, '.env'))
  const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  if (!url || !key) {
    throw new Error('No local canonical file and missing Supabase credentials.')
  }

  const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
    '@supabase/supabase-js',
  )
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const storagePath = options.storagePath || config.canonicalPath
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(storagePath)
  if (error || !data) {
    throw new Error(
      `Download failed ${bucket}/${storagePath}: ${error?.message ?? 'no data'}`,
    )
  }
  return {
    text: await data.text(),
    source: {
      type: 'supabase_storage',
      bucket,
      path: storagePath,
    },
  }
}

function reportPath(options, config) {
  if (!options.writeReport) return null
  if (options.report) {
    return isAbsolute(options.report) ? options.report : resolve(root, options.report)
  }
  if (options.mode === 'batch') {
    const sourceName = basename(options.file || options.storagePath || 'batch.json')
    const reportName = sourceName.replace(/\.json$/i, '') + '.report.json'
    return join(
      root,
      'data',
      'phase1',
      config.catalogBookId,
      'validation',
      'batches',
      reportName,
    )
  }
  return join(
    root,
    'data',
    'phase1',
    config.catalogBookId,
    'validation',
    'v1.report.json',
  )
}

let options
try {
  options = parseArgs(process.argv.slice(2))
} catch (error) {
  console.error(error.message)
  process.exit(2)
}

const config = getPhase1Book(options.bookKey)
if (!config) {
  console.error(
    `Unknown book "${options.bookKey}". Supported: ${Object.keys(PHASE1_BOOKS).join(', ')}`,
  )
  process.exit(2)
}

let loaded
try {
  loaded = await loadInput(options, config)
} catch (error) {
  console.error(error.message)
  process.exit(2)
}

let report
try {
  const dataset = JSON.parse(loaded.text)
  report = validatePhase1Dataset(dataset, {
    mode: options.mode,
    bookConfig: config,
    aliasMap: loadBookIdAliasMap(),
    source: loaded.source,
  })
} catch (error) {
  report = parseFailureReport({
    source: loaded.source,
    mode: options.mode,
    message: error.message,
  })
}

const destination = reportPath(options, config)
if (destination) {
  mkdirSync(dirname(destination), { recursive: true })
  writeFileSync(destination, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

if (options.json) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
} else {
  console.log(formatValidationSummary(report))
  if (destination) console.log(`Report: ${destination}`)
}

process.exitCode = report.summary.error_count > 0 ? 1 : 0
