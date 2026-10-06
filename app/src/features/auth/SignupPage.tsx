import { ArrowRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'

export function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Supabase auth will be wired in a later prompt.
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Set up access to your curriculum workspace."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="signup-name" className="block text-[11px] font-semibold text-slate-700">
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="h-8 w-full rounded border border-slate-300 bg-slate-50 px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="signup-email" className="block text-[11px] font-semibold text-slate-700">
            Email Address
          </label>
          <input
            id="signup-email"
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
          <label
            htmlFor="signup-password"
            className="block text-[11px] font-semibold text-slate-700"
          >
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-8 w-full rounded border border-slate-300 bg-slate-50 px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="mt-2 flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded bg-indigo-600 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <span>Create Account</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>
    </AuthLayout>
  )
}
