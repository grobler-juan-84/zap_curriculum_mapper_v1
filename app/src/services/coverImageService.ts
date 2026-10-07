import { supabase } from '../lib/supabase'

const COVER_BUCKET = 'book-assets'
const SIGNED_URL_TTL_SECONDS = 60 * 60
const CACHE_LIFETIME_MS = (SIGNED_URL_TTL_SECONDS - 5 * 60) * 1000

type CachedCoverUrl = {
  url: string
  expiresAt: number
}

const urlCache = new Map<string, CachedCoverUrl>()
const inFlight = new Map<string, Promise<string | undefined>>()

function getCachedUrl(path: string): string | undefined {
  const cached = urlCache.get(path)
  if (!cached) return undefined
  if (cached.expiresAt <= Date.now()) {
    urlCache.delete(path)
    return undefined
  }
  return cached.url
}

export async function resolveCoverImageUrls(
  paths: readonly string[],
): Promise<Record<string, string>> {
  const uniquePaths = [...new Set(paths.filter(Boolean))]
  const resolved: Record<string, string> = {}
  const waits: Array<[string, Promise<string | undefined>]> = []
  const pathsToSign: string[] = []

  for (const path of uniquePaths) {
    const cached = getCachedUrl(path)
    if (cached) {
      resolved[path] = cached
      continue
    }

    const pending = inFlight.get(path)
    if (pending) {
      waits.push([path, pending])
    } else {
      pathsToSign.push(path)
    }
  }

  if (pathsToSign.length > 0 && supabase) {
    const batchRequest = supabase.storage
      .from(COVER_BUCKET)
      .createSignedUrls(pathsToSign, SIGNED_URL_TTL_SECONDS)
      .then(({ data, error }) => {
        if (error) throw error

        const urls = new Map<string, string>()
        data?.forEach((item, index) => {
          const path = item.path || pathsToSign[index]
          if (path && item.signedUrl) {
            urls.set(path, item.signedUrl)
            urlCache.set(path, {
              url: item.signedUrl,
              expiresAt: Date.now() + CACHE_LIFETIME_MS,
            })
          }
        })
        return urls
      })

    for (const path of pathsToSign) {
      const pending = batchRequest
        .then((urls) => urls.get(path))
        .catch(() => undefined)
        .finally(() => {
          inFlight.delete(path)
        })
      inFlight.set(path, pending)
      waits.push([path, pending])
    }
  }

  const completed = await Promise.all(
    waits.map(async ([path, pending]) => [path, await pending] as const),
  )
  for (const [path, url] of completed) {
    if (url) resolved[path] = url
  }

  return resolved
}
