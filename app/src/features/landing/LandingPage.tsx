import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-100">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur-sm sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-600 text-xs font-bold text-white shadow-sm">
            CM
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            General Curriculum Mapper
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/login"
            className="rounded px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="flex items-center gap-1.5 rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            <span>Sign Up</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Understand the curriculum.
          <br />
          Teach with confidence.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
          A workspace for navigating structured curriculum materials with clarity.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-indigo-500"
          >
            <span>Get Started</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/login"
            className="rounded-md border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
          >
            Sign In
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500 sm:px-8">
        General Curriculum Mapper
      </footer>
    </div>
  )
}
