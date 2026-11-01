import { Navigate, useLocation } from 'react-router-dom'

/**
 * Replace the current route with `to`, preserving the existing query string.
 */
export function PreserveQueryRedirect({ to }: { to: string }) {
  const location = useLocation()
  const target = `${to}${location.search}`
  return <Navigate to={target} replace />
}
