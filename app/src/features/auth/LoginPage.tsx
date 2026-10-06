import { ArrowRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Supabase auth will be wired in a later prompt.
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your curriculum workspace."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="login-email" className="block text-[11px] font-semibold text-slate-700">
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="teacher@school.edu"
            className="h-8 w-full rounded border border-slate-300 bg-slate-50 px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-[11px] font-semibold text-slate-700"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] text-indigo-600 underline hover:text-indigo-800"
            >
              Forgot?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-8 w-full rounded border border-slate-300 bg-slate-50 px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 pt-0.5">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="remember" className="cursor-pointer text-xs text-slate-600">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className="mt-2 flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded bg-indigo-600 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <span>Sign In</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>
    </AuthLayout>
  )
}
