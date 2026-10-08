/** R2 S3-compatible client config from process.env (server-only). */

export type R2Config = {
  accountId: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
}

function normalizeAccountAndEndpoint(rawAccountId: string, rawEndpoint: string): {
  accountId: string
  endpoint: string
} {
  let accountId = rawAccountId.trim()
  let endpoint = rawEndpoint.trim()

  if (/^https?:\/\//i.test(accountId)) {
    try {
      const u = new URL(accountId)
      if (!endpoint) endpoint = `${u.protocol}//${u.host}`
      const m = u.host.match(/^([a-f0-9]+)\.r2\.cloudflarestorage\.com$/i)
      if (m) accountId = m[1]
    } catch {
      /* keep raw */
    }
  } else if (/\.r2\.cloudflarestorage\.com$/i.test(accountId)) {
    if (!endpoint) endpoint = `https://${accountId}`
    const m = accountId.match(/^([a-f0-9]+)\.r2\.cloudflarestorage\.com$/i)
    if (m) accountId = m[1]
  }

  if (!endpoint && accountId) {
    endpoint = `https://${accountId}.r2.cloudflarestorage.com`
  }

  return { accountId, endpoint }
}

export function readR2Config(): R2Config | null {
  const { accountId, endpoint } = normalizeAccountAndEndpoint(
    process.env.R2_ACCOUNT_ID ?? '',
    process.env.R2_ENDPOINT ?? '',
  )
  const accessKeyId = (process.env.R2_ACCESS_KEY_ID ?? '').trim()
  const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY ?? '').trim()
  const bucket = (
    process.env.R2_BUCKET_NAME ||
    process.env.R2_BUCKET_BOOK_SOURCES ||
    'book-sources'
  ).trim()

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) return null
  return { accountId, endpoint, accessKeyId, secretAccessKey, bucket }
}
