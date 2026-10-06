import { Outlet } from 'react-router-dom'
import { Sidebar } from '../../components/shared/Sidebar'
import { WorkspaceProvider } from './WorkspaceProvider'

export function AppShell() {
  return (
    <WorkspaceProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans">
        <Sidebar />
        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
    </WorkspaceProvider>
  )
}
