import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, LayoutDashboard, Table, GitBranch, Bell, Sparkles, Sun, Moon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'
import { useJobStore } from '@/store/useJobStore'
import { useUIStore } from '@/store/useUIStore'
import type { ViewMode } from '@/types'

const VIEW_OPTIONS: { mode: ViewMode; icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; label: string }[] = [
  { mode: 'kanban',   icon: LayoutDashboard, label: 'Kanban' },
  { mode: 'table',    icon: Table,           label: 'Table' },
  { mode: 'timeline', icon: GitBranch,       label: 'Timeline' },
]

export function TopBar() {
  const { viewMode, setViewMode, searchQuery, setSearchQuery } = useJobStore()
  const { setAddJobModalOpen, setAIPanelOpen, aiPanelOpen, isDarkMode, toggleTheme } = useUIStore()
  const navigate = useNavigate()
  const jobs = useJobStore((s) => s.jobs)

  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Generate dynamic notifications based on current pipeline
  const notifications = jobs.slice(0, 3).map((job, idx) => {
    let title = 'Application Update'
    let text = `There is an update on your ${job.company} application.`
    if (idx === 0) {
      title = 'Resume Match Available'
      text = `Your resume was analyzed for ${job.company} ${job.role} role.`
    } else if (job.status === 'interview') {
      title = 'Interview Reminder'
      text = `You have an upcoming interview with ${job.company}.`
    } else if (job.status === 'offer') {
      title = 'Great news! 🎉'
      text = `You received an offer from ${job.company}.`
    }
    return { id: job.id + idx, title, text, unread: true }
  })

  // If there are no jobs, show a starter notification
  if (notifications.length === 0) {
    notifications.push({
      id: 'welcome',
      title: 'Welcome to JobTracker AI',
      text: 'Add your first job to start getting AI insights!',
      unread: true
    })
  }

  const unreadCount = notifications.filter(n => n.unread).length

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, setSearchQuery])

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-logo">JT</div>
        <div className="brand-text">JobTracker<em>AI</em></div>
      </div>

      <div className="search-wrap">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          id="globalSearch"
          type="text"
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
          placeholder="Search companies, roles, status…"
        />
        {localSearch && (
          <button id="searchClear" className="visible" onClick={() => setLocalSearch('')} title="Clear search">✕</button>
        )}
      </div>

      <div className="view-tabs">
        {VIEW_OPTIONS.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            className={`vtab ${viewMode === mode ? 'active' : ''}`}
            onClick={() => { setViewMode(mode); navigate('/') }}
          >
            <Icon size={12} strokeWidth={2} />{label}
          </button>
        ))}
      </div>

      <div className="spacer"></div>

      <div className="topbar-right">
        {/* Theme Toggle */}
        <button className="icon-btn" id="themeToggleBtn" onClick={toggleTheme} title="Toggle Dark Mode">
          {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="icon-btn" title="Notifications">
              <Bell size={15} />
              {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
            </div>
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={8} className="w-72 bg-[#13161e] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50 p-0 text-sm">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
              <span className="font-semibold text-slate-200 text-xs">Notifications</span>
            </div>
            <div className="flex flex-col max-h-[300px] overflow-y-auto">
              {notifications.map((n) => (
                <button key={n.id} onClick={() => { setAIPanelOpen(true) }} className="flex flex-col items-start px-3 py-2.5 hover:bg-white/[0.04] border-b border-white/[0.04] transition-all text-left">
                  <span className={`font-medium text-xs ${n.unread ? 'text-white' : 'text-slate-300'}`}>{n.title}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">{n.text}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Copilot toggle */}
        <button
          className={`copilot-toggle ${aiPanelOpen ? 'panel-open' : ''}`}
          onClick={() => setAIPanelOpen(!aiPanelOpen)}
        >
          <span className="pulse-dot"></span> AI Copilot
        </button>

        {/* New Job */}
        <button className="btn-primary" onClick={() => setAddJobModalOpen(true)}>
          <Plus size={13} strokeWidth={2.5} />
          New Job
        </button>
      </div>
    </header>
  )
}
