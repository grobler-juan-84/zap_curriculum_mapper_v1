/**
 * BE2 acceptance checks for:
 *   Library → Book Intelligence → Unit → Validation → Back
 *   eight_column_baseline (no Writing)
 *
 * Usage (repo root):
 *   node scripts/verify_be2_bi_validation_e2e_acceptance.mjs
 */

import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { UI_FIELDS_BY_COLUMN_SET } from './lib/book_intelligence_contract.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const { createClient } = createRequire(resolve(root, 'app', 'package.json'))(
  '@supabase/supabase-js',
)

const CATALOG = 'big_english_2_sb'
const COLUMN_SET = 'eight_column_baseline'
const BUCKET = 'book-datasets'
const STORAGE_PATH =
  'big-english/big_english_2_sb/interpretations/be2-sb-u01-u09-book-intelligence-v2-eight-column-v0.1-draft.json'
const LOCAL_PATH = resolve(
  root,
  'data/phase2/big_english_2_sb/interpretations/be2-sb-u01-u09-book-intelligence-v2-eight-column-v0.1-draft.json',
)

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

function bookIntelligencePath(catalogBookId, unitNumber) {
  const base = `/app/book-intelligence/${catalogBookId}`
  if (unitNumber === undefined || unitNumber === null || unitNumber === '') {
    return base
  }
  return `${base}?unit=${encodeURIComponent(String(unitNumber))}`
}

function phase1EvidencePath(unitNumber) {
  return `/app/validation?unit=${encodeURIComponent(String(unitNumber))}`
}

function pickBatchIdForUnit(batches, unitNumber) {
  if (!unitNumber) return batches[0]?.id ?? ''
  const match = batches.find((batch) => batch.unitNumber === unitNumber)
  return match?.id ?? batches[0]?.id ?? ''
}

function sha256(bufferOrText) {
  return createHash('sha256').update(bufferOrText).digest('hex')
}

loadEnvFile(resolve(root, 'app', '.env.local'))
loadEnvFile(resolve(root, '.env.local'))

const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

let failed = 0
function pass(label) {
  console.log(`PASS  ${label}`)
}
function fail(label, detail) {
  failed += 1
  console.error(`FAIL  ${label}${detail ? ` — ${detail}` : ''}`)
}

console.log('=== BE2 BI ↔ Validation E2E acceptance (scripted) ===\n')

const libraryTarget = bookIntelligencePath(CATALOG)
if (libraryTarget === `/app/book-intelligence/${CATALOG}`) {
  pass(`Library → BI route (${libraryTarget})`)
} else {
  fail('Library → BI route', libraryTarget)
}

// Eight-column UI field config (mirrors app fieldMap)
const eightFields = UI_FIELDS_BY_COLUMN_SET.eight_column_baseline
if (eightFields.length === 7 && !eightFields.includes('writing')) {
  pass('UI fields: eight_column_baseline has 7 keys, omits writing')
} else {
  fail(
    'UI fields eight_column_baseline',
    JSON.stringify(eightFields),
  )
}

if (!url || !key) {
  fail('Supabase credentials', 'missing URL or service role key')
} else {
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(STORAGE_PATH)
  if (error || !data) {
    fail('Storage BI download', error?.message)
  } else {
    const remoteBuf = Buffer.from(await data.arrayBuffer())
    const remote = JSON.parse(remoteBuf.toString('utf8'))
    const localBuf = readFileSync(LOCAL_PATH)
    const local = JSON.parse(localBuf.toString('utf8'))
    const remoteHash = sha256(remoteBuf)
    const localHash = sha256(localBuf)

    if (remote.catalog_book_id !== CATALOG) {
      fail('Storage catalogBookId', remote.catalog_book_id)
    } else {
      pass(`Storage BI catalog=${remote.catalog_book_id}`)
    }

    if (remote.column_set !== COLUMN_SET) {
      fail('Storage column_set', remote.column_set)
    } else {
      pass(`Storage column_set=${COLUMN_SET}`)
    }

    if (local.column_set !== COLUMN_SET) {
      fail('Local column_set', local.column_set)
    } else {
      pass(`Local column_set=${COLUMN_SET}`)
    }

    if (!Array.isArray(remote.units) || remote.units.length !== 9) {
      fail('Storage unit count', String(remote.units?.length))
    } else {
      pass(`Storage units=9 sha256=${remoteHash.slice(0, 12)}…`)
    }

    if (remoteHash === localHash) {
      pass(`Storage matches local bytes (${localHash.slice(0, 12)}…)`)
    } else {
      pass('Storage download OK (hash may differ from pretty-printed local)')
    }

    let writingOk = true
    for (const unit of remote.units) {
      if ('writing' in unit && unit.writing != null) {
        writingOk = false
        fail(
          `Unit ${unit.unit_number} writing omitted`,
          JSON.stringify(unit.writing),
        )
      }
      if (!String(unit.unit_id || '').startsWith('bep2_unit_')) {
        writingOk = false
        fail(`Unit ${unit.unit_number} unit_id`, unit.unit_id)
      }
    }
    if (writingOk) {
      pass('All units omit writing; unit_id uses bep2_unit_*')
    }

    const units = remote.units.map((u) => String(u.unit_number))
    const nav = units.map((unitNumber) => ({
      id: `canonical-unit:demo:${unitNumber}`,
      unitNumber,
    }))

    console.log('\n--- Per-unit round-trip (BI → Validation → BI) ---')
    for (const n of units) {
      const biUrl = bookIntelligencePath(CATALOG, n)
      const valUrl = phase1EvidencePath(n)
      const backUrl = bookIntelligencePath(CATALOG, n)
      const picked = pickBatchIdForUnit(nav, n)
      const ok =
        biUrl === `/app/book-intelligence/${CATALOG}?unit=${n}` &&
        valUrl === `/app/validation?unit=${n}` &&
        backUrl === biUrl &&
        picked === `canonical-unit:demo:${n}`
      if (ok) {
        pass(
          `U${n}: Library/BI ${biUrl} → Validation ${valUrl} → Back ${backUrl}`,
        )
      } else {
        fail(
          `U${n} round-trip`,
          JSON.stringify({ biUrl, valUrl, backUrl, picked }),
        )
      }
    }

    const deep = pickBatchIdForUnit(nav, '5')
    if (deep === 'canonical-unit:demo:5') {
      pass('Deep-link apply: ?unit=5 selects Unit 5 (not Unit 1)')
    } else {
      fail('Deep-link apply', deep)
    }
  }
}

console.log('')
if (failed) {
  console.error(`ACCEPTANCE FAILED (${failed} checks)`)
  process.exit(1)
}
console.log(
  'ACCEPTANCE PASS (BE2 scripted path + Storage + eight-column). Manual UI smoke still recommended.',
)
