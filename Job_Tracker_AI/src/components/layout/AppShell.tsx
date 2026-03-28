import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { AICopilotPanel } from './AICopilotPanel'
import { AddEditJobModal } from '@/components/jobs/AddEditJobModal'
import { useUIStore } from '@/store/useUIStore'
import { useJobStore } from '@/store/useJobStore'
import { cn } from '@/lib/utils'

export function AppShell() {
  const { sidebarOpen, aiPanelOpen, addJobModalOpen, setAddJobModalOpen, editJobId, setEditJobId } = useUIStore()
  const { setViewMode, fetchJobs } = useJobStore()

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'n' || e.key === 'N') { setAddJobModalOpen(true) }
      if (e.key === 'k' || e.key === 'K') { setViewMode('kanban') }
      if (e.key === 't' || e.key === 'T') { setViewMode('table') }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setAddJobModalOpen, setViewMode])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar />
      <div className="app-body">
        <Sidebar />
        
        <main className="main" id="mainArea">
          <Outlet />
        </main>

        <AICopilotPanel />
      </div>

      <AddEditJobModal
        open={addJobModalOpen || !!editJobId}
        onClose={() => { setAddJobModalOpen(false); setEditJobId(null) }}
        jobId={editJobId}
      />
    </div>
  )
}
