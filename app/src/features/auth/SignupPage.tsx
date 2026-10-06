import { ArrowRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuthErrorMessage } from '../../lib/authErrors'
import {
  isSupabaseConfigured,
  SUPABASE_CONFIG_ERROR,
  supabase,
} from '../../lib/supabase'
import { AuthLayout } from './AuthLayout'

export function SignupPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setInfo('')

    if (!isSupabaseConfigured || !supabase) {
      setError(SUPABASE_CONFIG_ERROR)
      return
    }

    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
        },
      })

      if (signUpError) {
        setError(getAuthErrorMessage(signUpError, 'Unable to create account.'))
        return
      }

      if (data.session) {
        navigate('/app', { replace: true })
        return
      }

      setInfo('Check your email to confirm your account before signing in.')
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Unable to create account.'))
    } finally {
      setLoading(false)
    }
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
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label
              htmlFor="signup-first-name"
              className="block text-[11px] font-semibold text-slate-700"
            >
              First Name
            </label>
            <input
              id="signup-first-name"
              type="text"
              required
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="h-8 w-full rounded border border-slate-300 bg-slate-50 px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="signup-last-name"
              className="block text-[11px] font-semibold text-slate-700"
            >
              Last Name
            </label>
            <input
              id="signup-last-name"
              type="text"
              required
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="h-8 w-full rounded border border-slate-300 bg-slate-50 px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
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
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-8 w-full rounded border border-slate-300 bg-slate-50 px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {!isSupabaseConfigured ? (
          <p className="text-xs text-red-600">{SUPABASE_CONFIG_ERROR}</p>
        ) : null}
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
        {info ? <p className="text-xs text-emerald-700">{info}</p> : null}

        <button
          type="submit"
          disabled={loading || !isSupabaseConfigured}
          className="mt-2 flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded bg-indigo-600 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>{loading ? 'Creating…' : 'Create Account'}</span>
          {!loading ? <ArrowRight className="h-3.5 w-3.5" /> : null}
        </button>
      </form>
    </AuthLayout>
  )
}
