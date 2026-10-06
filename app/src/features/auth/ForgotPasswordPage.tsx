import { ArrowRight, CheckCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getAuthErrorMessage } from '../../lib/authErrors'
import { supabase } from '../../lib/supabase'
import { AuthLayout } from './AuthLayout'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) {
        setError(getAuthErrorMessage(resetError, 'Unable to send reset email.'))
        return
      }

      // Neutral success — do not reveal whether the email has an account.
      setResetSent(true)
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Unable to send reset email.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We’ll email you a reset link."
      footer={
        <>
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Back to Sign In
          </Link>
        </>
      }
    >
      {resetSent ? (
        <div className="space-y-2 rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
          <div className="flex items-center gap-1.5 font-bold">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>Check your email</span>
          </div>
          <p>
            If an account exists for that address, password reset instructions have been sent.
          </p>
          <div className="pt-2">
            <Link to="/login" className="font-semibold text-slate-600 underline">
              Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="forgot-email"
              className="block text-[11px] font-semibold text-slate-700"
            >
              Email Address
            </label>
            <input
              id="forgot-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="teacher@school.edu"
              className="h-8 w-full rounded border border-slate-300 bg-slate-50 px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {error ? <p className="text-xs text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded bg-indigo-600 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{loading ? 'Sending…' : 'Send Reset Link'}</span>
            {!loading ? <ArrowRight className="h-3.5 w-3.5" /> : null}
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
