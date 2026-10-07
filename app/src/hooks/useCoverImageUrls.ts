import { useEffect, useMemo, useState } from 'react'
import { resolveCoverImageUrls } from '../services/coverImageService'

export function useCoverImageUrls(paths: readonly (string | undefined)[]): Record<string, string> {
  const pathKey = JSON.stringify([...new Set(paths.filter((path): path is string => Boolean(path)))].sort())
  const normalizedPaths = useMemo(() => JSON.parse(pathKey) as string[], [pathKey])
  const [urls, setUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false

    resolveCoverImageUrls(normalizedPaths).then((resolved) => {
      if (!cancelled) setUrls(resolved)
    })

    return () => {
      cancelled = true
    }
  }, [normalizedPaths])

  return urls
}
