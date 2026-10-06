import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../shell/WorkspaceProvider'
import { CurriculumLibrary } from './CurriculumLibrary'
import { useCurriculumCatalog } from './hooks/useCurriculumCatalog'

export function CurriculumLibraryPage() {
  const navigate = useNavigate()
  const seriesList = useCurriculumCatalog()
  const { selectSeries, selectBook } = useWorkspace()

  return (
    <CurriculumLibrary
      seriesList={seriesList}
      onSelectSeries={(seriesId) => {
        selectSeries(seriesId)
        navigate('/app/series')
      }}
      onDirectOpenBook={(bookId) => {
        selectBook(bookId)
        navigate('/app/workspace')
      }}
    />
  )
}
