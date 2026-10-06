import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4">
      <div className="mb-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-sm font-bold text-white shadow-sm">
            CM
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            General Curriculum Mapper
          </span>
        </Link>
      </div>

      <div className="w-full max-w-sm space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-base font-bold text-slate-900">{title}</h1>
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        </div>
        {children}
        <div className="pt-2 text-center text-xs text-slate-500">{footer}</div>
      </div>
    </div>
  )
}
