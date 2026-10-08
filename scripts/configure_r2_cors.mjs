/**
 * Inspect and (if needed) update CORS on R2 bucket `book-sources` for PDF.js.
 * Preserves unrelated CORS rules; only ensures localhost Vite origins for GET/HEAD.
 *
 * Usage (from repo root):
 *   node scripts/configure_r2_cors.mjs           # inspect + apply if needed
 *   node scripts/configure_r2_cors.mjs --dry-run # inspect only
 *
 * CORS does not make the bucket public; it only allows browser origins to use
 * signed URLs / authorized requests.
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const vendorRoot = join(__dirname, '.r2-tools')
const dryRun = process.argv.includes('--dry-run')

const REQUIRED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']
const REQUIRED_METHODS = ['GET', 'HEAD']
const RULE_ID = 'gcm-validation-localhost'

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

loadEnvFile(resolve(root, '.env.local'))
loadEnvFile(resolve(root, '.env'))
loadEnvFile(resolve(root, 'app', '.env.local'))

function normalizeAccountAndEndpoint(rawAccountId, rawEndpoint) {
  let accountId = (rawAccountId || '').trim()
  let endpoint = (rawEndpoint || '').trim()
  if (/^https?:\/\//i.test(accountId)) {
    try {
      const u = new URL(accountId)
      if (!endpoint) endpoint = `${u.protocol}//${u.host}`
      const m = u.host.match(/^([a-f0-9]+)\.r2\.cloudflarestorage\.com$/i)
      if (m) accountId = m[1]
    } catch {
      /* keep */
    }
  } else if (/\.r2\.cloudflarestorage\.com$/i.test(accountId)) {
    if (!endpoint) endpoint = `https://${accountId}`
    const m = accountId.match(/^([a-f0-9]+)\.r2\.cloudflarestorage\.com$/i)
    if (m) accountId = m[1]
  }
  if (!endpoint && accountId) endpoint = `https://${accountId}.r2.cloudflarestorage.com`
  return { endpoint }
}

const { endpoint } = normalizeAccountAndEndpoint(
  process.env.R2_ACCOUNT_ID,
  process.env.R2_ENDPOINT,
)
const accessKeyId = (process.env.R2_ACCESS_KEY_ID || '').trim()
const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || '').trim()
const bucket = (
  process.env.R2_BUCKET_NAME ||
  process.env.R2_BUCKET_BOOK_SOURCES ||
  'book-sources'
).trim()

if (!endpoint || !accessKeyId || !secretAccessKey) {
  console.error('Missing R2 env in root .env.local')
  process.exit(2)
}

const requireVendor = createRequire(join(vendorRoot, 'package.json'))
const {
  S3Client,
  GetBucketCorsCommand,
  PutBucketCorsCommand,
} = requireVendor('@aws-sdk/client-s3')

const client = new S3Client({
  region: 'auto',
  endpoint,
  credentials: { accessKeyId, secretAccessKey },
})

function ruleCoversLocalhost(rule) {
  const origins = rule.AllowedOrigins ?? []
  const methods = (rule.AllowedMethods ?? []).map((m) => m.toUpperCase())
  const hasOrigins = REQUIRED_ORIGINS.every((o) => origins.includes(o) || origins.includes('*'))
  const hasMethods = REQUIRED_METHODS.every((m) => methods.includes(m))
  return hasOrigins && hasMethods
}

function buildMergedCors(existingRules) {
  const others = (existingRules ?? []).filter((rule) => rule.ID !== RULE_ID)
  if (others.some(ruleCoversLocalhost)) {
    return { rules: existingRules ?? [], changed: false, reason: 'existing rule already covers localhost' }
  }
  const localhostRule = {
    ID: RULE_ID,
    AllowedOrigins: REQUIRED_ORIGINS,
    AllowedMethods: REQUIRED_METHODS,
    AllowedHeaders: ['*'],
    ExposeHeaders: ['ETag', 'Content-Length', 'Content-Type', 'Accept-Ranges', 'Content-Range'],
    MaxAgeSeconds: 3600,
  }
  return { rules: [...others, localhostRule], changed: true, reason: 'added/replaced gcm-validation-localhost rule' }
}

let existing = []
try {
  const got = await client.send(new GetBucketCorsCommand({ Bucket: bucket }))
  existing = got.CORSRules ?? []
  console.log(`Existing CORS rules on ${bucket}: ${existing.length}`)
  for (const rule of existing) {
    console.log(
      `  - id=${rule.ID ?? '(none)'} origins=${(rule.AllowedOrigins ?? []).join(',')} methods=${(rule.AllowedMethods ?? []).join(',')}`,
    )
  }
} catch (err) {
  const name = err?.name ?? ''
  const status = err?.$metadata?.httpStatusCode
  if (name === 'NoSuchCORSConfiguration' || status === 404) {
    console.log(`No CORS configuration on ${bucket} yet.`)
    existing = []
  } else {
    console.error(`GetBucketCors failed: ${name}: ${err?.message ?? err}`)
    console.error(
      'If this is AccessDenied, the API token may lack bucket CORS permission — set CORS in the Cloudflare dashboard instead.',
    )
    try {
      client.destroy()
    } catch {
      /* ignore */
    }
    process.exit(1)
  }
}

const merged = buildMergedCors(existing)
if (!merged.changed) {
  console.log(`No CORS change needed (${merged.reason}).`)
  try {
    client.destroy()
  } catch {
    /* ignore */
  }
  process.exit(0)
}

console.log(`Proposed change: ${merged.reason}`)
if (dryRun) {
  console.log('Dry run — not applying.')
  try {
    client.destroy()
  } catch {
    /* ignore */
  }
  process.exit(0)
}

await client.send(
  new PutBucketCorsCommand({
    Bucket: bucket,
    CORSConfiguration: { CORSRules: merged.rules },
  }),
)
console.log(`CORS updated on ${bucket}.`)
try {
  client.destroy()
} catch {
  /* ignore */
}
