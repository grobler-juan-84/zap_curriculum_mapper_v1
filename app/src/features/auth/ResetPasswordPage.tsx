import { ArrowRight, CheckCircle } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuthErrorMessage } from '../../lib/authErrors'
import { supabase } from '../../lib/supabase'
import { useAuth } from './AuthProvider'
import { AuthLayout } from './AuthLayout'

const MIN_PASSWORD_LENGTH = 8

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (authLoading) return
    setReady(true)
  }, [authLoading])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!password || !confirmPassword) {
      setError('Enter and confirm your new password.')
      return
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!session) {
      setError('This reset link is invalid or has expired. Request a new one.')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(getAuthErrorMessage(updateError, 'Unable to update password.'))
        return
      }

      setSuccess(true)
      window.setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1500)
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Unable to update password.'))
    } finally {
      setLoading(false)
    }
  }

  if (!ready || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-600">
        Preparing reset…
      </div>
    )
  }

  return (
    <AuthLayout
      title="Enter new password"
      subtitle="Choose a new password for your account."
      footer={
        <>
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Back to Sign In
          </Link>
        </>
      }
    >
      {!session ? (
        <div className="space-y-2 rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <p>This reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="font-semibold text-indigo-600 underline">
            Request a new reset link
          </Link>
        </div>
      ) : success ? (
        <div className="space-y-2 rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
          <div className="flex items-center gap-1.5 font-bold">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>Password updated</span>
          </div>
          <p>Redirecting you to sign in…</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="reset-password"
              className="block text-[11px] font-semibold text-slate-700"
            >
              New Password
            </label>
            <input
              id="reset-password"
              type="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-8 w-full rounded border border-slate-300 bg-slate-50 px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="reset-confirm"
              className="block text-[11px] font-semibold text-slate-700"
            >
              Confirm Password
            </label>
            <input
              id="reset-confirm"
              type="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-8 w-full rounded border border-slate-300 bg-slate-50 px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {error ? <p className="text-xs text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded bg-indigo-600 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{loading ? 'Updating…' : 'Update Password'}</span>
            {!loading ? <ArrowRight className="h-3.5 w-3.5" /> : null}
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
