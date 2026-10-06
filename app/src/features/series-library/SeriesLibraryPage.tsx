import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../shell/WorkspaceProvider'
import { SeriesLibrary } from './SeriesLibrary'

export function SeriesLibraryPage() {
  const navigate = useNavigate()
  const { currentSeries, selectBook } = useWorkspace()

  return (
    <SeriesLibrary
      series={currentSeries}
      onSelectBook={(bookId) => {
        selectBook(bookId)
        navigate('/app/workspace')
      }}
      onBackToCurriculum={() => navigate('/app/curriculum')}
    />
  )
}
