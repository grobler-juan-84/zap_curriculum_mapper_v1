import { Navigate } from 'react-router-dom'
import { bookWorkspaceChooseBookPath } from '../book-intelligence/bookIntelligenceStorageRegistry'

/**
 * Compatibility: former `/app/series` main-flow stop → in-workspace chooser.
 */
export function SeriesToWorkspaceChooserRedirect() {
  return <Navigate to={bookWorkspaceChooseBookPath()} replace />
}
