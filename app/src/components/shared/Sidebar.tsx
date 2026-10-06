import {
  Bookmark,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  LayoutDashboard,
  LogOut,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'
import { useWorkspace } from '../../features/shell/WorkspaceProvider'
import { curriculumService } from '../../services/curriculumService'

function initialsFromProfile(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  email: string | null | undefined,
): string {
  const first = firstName?.trim()?.[0]
  const last = lastName?.trim()?.[0]
  if (first && last) return `${first}${last}`.toUpperCase()
  if (first) return first.toUpperCase()
  if (email) return email.slice(0, 2).toUpperCase()
  return 'CM'
}

export function Sidebar() {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const {
    sidebarCollapsed: collapsed,
    toggleSidebar,
    openDefaultBeehiveSpread,
    selectSeries,
  } = useWorkspace()

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    user?.email ||
    'Teacher'
  const roleLabel = profile?.role === 'admin' ? 'Admin' : 'Teacher'
  const avatarInitials = initialsFromProfile(
    profile?.first_name,
    profile?.last_name,
    user?.email,
  )

  const navItems = [
    {
      to: '/app/curriculum',
      label: 'Curriculum Library',
      icon: LayoutDashboard,
    },
    {
      to: '/app/series',
      label: 'Beehive Series',
      icon: Layers,
    },
    {
      to: '/app/workspace',
      label: 'Book Workspace',
      icon: BookOpen,
    },
  ]

  const handleLogout = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <aside
      className={`z-20 flex h-screen shrink-0 select-none flex-col border-r border-slate-800 bg-slate-900 text-slate-300 transition-all duration-200 ${
        collapsed ? 'w-14' : 'w-56'
      }`}
    >
      <div className="flex h-12 items-center justify-between border-b border-slate-800 px-3">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-indigo-600 text-xs font-bold text-white shadow-sm">
              CM
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-semibold tracking-tight text-white">
                Curriculum Mapper
              </span>
              <span className="truncate text-[10px] font-normal text-slate-400">
                Teacher Workstation
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-xs font-bold text-white shadow-sm">
            CM
          </div>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="ml-auto rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          {!collapsed ? 'Navigation' : '··'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </NavLink>
          )
        })}

        {!collapsed ? (
          <div className="space-y-1 pt-4">
            <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Quick Jumps
            </div>
            <button
              type="button"
              onClick={() => {
                openDefaultBeehiveSpread()
                navigate('/app/workspace')
              }}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-200"
            >
              <Clock className="h-3.5 w-3.5 shrink-0 text-amber-400" />
              <div className="truncate">
                <span className="text-slate-300">Beehive 1</span> · pp. 6–7
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                const beehive = curriculumService.getSeriesByName('Beehive')
                if (beehive) selectSeries(beehive.id)
                navigate('/app/series')
              }}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-200"
            >
              <Bookmark className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
              <div className="truncate">
                <span className="text-slate-300">All Beehive Books</span>
              </div>
            </button>
          </div>
        ) : null}
      </div>

      <div className="border-t border-slate-800 bg-slate-950/40 p-2">
        {!collapsed ? (
          <div className="flex items-center justify-between rounded bg-slate-800/40 p-1.5">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-indigo-400/30 bg-indigo-500/20 text-xs font-semibold text-indigo-300">
                {avatarInitials}
              </div>
              <div className="min-w-0">
                <div className="truncate text-xs font-medium text-white">{displayName}</div>
                <div className="truncate text-[10px] text-slate-400">{roleLabel}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-rose-400"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            title={`Signed in as ${displayName} (Click to sign out)`}
            className="mx-auto flex h-8 w-8 items-center justify-center rounded bg-slate-800 text-slate-300 transition-colors hover:text-rose-400"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </aside>
  )
}
