import { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { curriculumService } from '../../services/curriculumService'
import { useWorkspace } from '../shell/WorkspaceProvider'
import {
  DEFAULT_BOOK_INTELLIGENCE_CATALOG_BOOK_ID,
  chalkieWorkspacePath,
} from './bookIntelligenceStorageRegistry'

/**
 * Legacy `/app/book-intelligence` → Chalkie Workspace redirect.
 * Selects the catalog book in workspace state when possible, then replaces the
 * URL with `/app/chalkie` (and `?unit=` when present). Dedicated BI preview UI is retired.
 */
export function BookIntelligenceRedirect() {
  const navigate = useNavigate()
  const { catalogBookId: routeCatalogBookId } = useParams<{
    catalogBookId?: string
  }>()
  const [searchParams] = useSearchParams()
  const { selectSeries, selectBook, catalogLoading } = useWorkspace()

  const catalogBookId =
    routeCatalogBookId?.trim() || DEFAULT_BOOK_INTELLIGENCE_CATALOG_BOOK_ID
  const unitParam = searchParams.get('unit')

  useEffect(() => {
    if (catalogLoading) return

    const match = curriculumService.getBookByCatalogId(catalogBookId)
    if (match) {
      selectSeries(match.series.id)
      selectBook(match.book.id)
    }

    navigate(chalkieWorkspacePath(unitParam), { replace: true })
  }, [
    catalogLoading,
    catalogBookId,
    unitParam,
    selectSeries,
    selectBook,
    navigate,
  ])

  return (
    <div className="flex h-full items-center justify-center bg-slate-50 text-sm text-slate-500">
      Opening Chalkie Workspace…
    </div>
  )
}
