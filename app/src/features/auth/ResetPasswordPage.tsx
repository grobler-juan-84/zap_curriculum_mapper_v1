import { ArrowRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    // Supabase auth will be wired in a later prompt.
    navigate('/login')
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
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="h-8 w-full rounded border border-slate-300 bg-slate-50 px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {error ? <p className="text-xs text-red-600">{error}</p> : null}

        <button
          type="submit"
          className="mt-2 flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded bg-indigo-600 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <span>Update Password</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>
    </AuthLayout>
  )
}
