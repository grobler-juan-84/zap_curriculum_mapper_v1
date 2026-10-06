import { ArrowRight, CheckCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Supabase auth will be wired in a later prompt.
    setResetSent(true)
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
            If an account exists for <strong>{email}</strong>, reset instructions were sent.
          </p>
          <div className="flex justify-between pt-2">
            <Link to="/reset-password" className="font-semibold text-indigo-600 underline">
              Continue to Reset
            </Link>
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

          <button
            type="submit"
            className="mt-2 flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded bg-indigo-600 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <span>Send Reset Link</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
