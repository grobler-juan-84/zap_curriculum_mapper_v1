import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { resolveValidLastActiveWorkspaceEntry } from '../book-workspace/resume'
import { curriculumService } from '../../services/curriculumService'
import { useWorkspace } from './WorkspaceProvider'

/**
 * Post-login / `/app` landing: restore last valid workspace, else Curriculum Library.
 * Never surfaces an error when resume is missing or stale.
 */
export function AppEntryRedirect() {
  const { user } = useAuth()
  const {
    catalogLoading,
    catalogError,
    selectSeries,
    selectBook,
  } = useWorkspace()
  const [target, setTarget] = useState<'workspace' | 'curriculum' | null>(null)

  useEffect(() => {
    if (catalogLoading || target != null) return

    if (catalogError || !user?.id) {
      setTarget('curriculum')
      return
    }

    const seriesList = curriculumService.listSeries()
    const match = resolveValidLastActiveWorkspaceEntry({
      userId: user.id,
      seriesList,
    })

    if (match) {
      selectSeries(match.series.id)
      selectBook(match.book.id)
      setTarget('workspace')
      return
    }

    setTarget('curriculum')
  }, [
    catalogLoading,
    catalogError,
    user?.id,
    selectSeries,
    selectBook,
    target,
  ])

  if (catalogLoading || target == null) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading workspace…
      </div>
    )
  }

  if (target === 'workspace') {
    return <Navigate to="/app/book-workspace" replace />
  }

  return <Navigate to="/app/curriculum" replace />
}
