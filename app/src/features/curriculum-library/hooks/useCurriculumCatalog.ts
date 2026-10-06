import { useEffect, useState } from 'react'
import { curriculumService } from '../../../services/curriculumService'
import type { CurriculumSeries } from '../../../types/curriculum'

export type CurriculumCatalogState = {
  seriesList: CurriculumSeries[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function useCurriculumCatalog(): CurriculumCatalogState {
  const [seriesList, setSeriesList] = useState<CurriculumSeries[]>(() =>
    curriculumService.listSeries(),
  )
  const [loading, setLoading] = useState(() => curriculumService.listSeries().length === 0)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    curriculumService
      .loadCatalog({ force: reloadToken > 0 })
      .then((series) => {
        if (cancelled) return
        setSeriesList(series)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setSeriesList([])
        setLoading(false)
        setError(err instanceof Error ? err.message : 'Failed to load curriculum catalog.')
      })

    return () => {
      cancelled = true
    }
  }, [reloadToken])

  return {
    seriesList,
    loading,
    error,
    reload: () => {
      curriculumService.clearCache()
      setReloadToken((value) => value + 1)
    },
  }
}
