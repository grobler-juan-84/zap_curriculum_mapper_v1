import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../shell/WorkspaceProvider'
import { BookWorkspace } from './BookWorkspace'

export function BookWorkspacePage() {
  const navigate = useNavigate()
  const { currentSeries, currentBook, currentSpreadId, setCurrentSpreadId } = useWorkspace()

  return (
    <BookWorkspace
      series={currentSeries}
      book={currentBook}
      currentSpreadId={currentSpreadId}
      onChangeSpread={setCurrentSpreadId}
      onBackToBooks={() => navigate('/app/series')}
    />
  )
}
