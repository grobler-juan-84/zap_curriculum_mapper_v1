import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { getAuthErrorMessage } from '../../lib/authErrors'

export function AppHomePage() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [signingOut, setSigningOut] = useState(false)

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    user?.email ||
    'Signed-in user'

  const handleSignOut = async () => {
    setSigningOut(true)
    setError('')
    try {
      await signOut()
      navigate('/', { replace: true })
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Unable to sign out.'))
      setSigningOut(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Authenticated
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900">Workspace</h1>
          <p className="mt-2 text-sm text-slate-600">
            Temporary post-login screen to confirm authentication works.
          </p>
        </div>

        <dl className="space-y-2 rounded border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">
          <div className="flex justify-between gap-3">
            <dt className="font-semibold">Name</dt>
            <dd>{displayName}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-semibold">Email</dt>
            <dd>{user?.email ?? '—'}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-semibold">Role</dt>
            <dd>{profile?.role ?? '—'}</dd>
          </div>
        </dl>

        {error ? <p className="text-xs text-red-600">{error}</p> : null}

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="h-8 w-full rounded bg-slate-900 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </div>
  )
}
