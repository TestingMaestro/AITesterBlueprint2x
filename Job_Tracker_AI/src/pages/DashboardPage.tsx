import { motion } from 'framer-motion'
import { useJobStore } from '@/store/useJobStore'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { TableView } from '@/components/views/TableView'
import { TimelineView } from '@/components/views/TimelineView'
import { cn, STATUS_CONFIG } from '@/lib/utils'

export function DashboardPage() {
  const { viewMode, jobs } = useJobStore()

  const stats = [
    { label: 'Total Tracked', value: jobs.length, color: 'text-slate-100' },
    { label: 'Applied', value: jobs.filter(j => j.status === 'applied').length, color: 'text-blue-400' },
    { label: 'Interviews', value: jobs.filter(j => j.status === 'interview').length, color: 'text-purple-400' },
    { label: 'Offers', value: jobs.filter(j => j.status === 'offer').length, color: 'text-emerald-400' },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="page-head">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Your job search pipeline</div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-label">Total Jobs</div>
            <div className="kpi-icon" style={{ background: 'var(--accent-light)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
          </div>
          <div className="kpi-value">{stats[0].value}</div>
          <div className="kpi-foot">In pipeline</div>
        </div>
        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-label">Interviews</div>
            <div className="kpi-icon" style={{ background: 'var(--orange-bg)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
          </div>
          <div className="kpi-value">{stats[2].value}</div>
          <div className="kpi-foot kpi-foot-int">Scheduled</div>
        </div>
        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-label">Offers</div>
            <div className="kpi-icon" style={{ background: 'var(--purple-bg)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
          <div className="kpi-value">{stats[3].value}</div>
          <div className="kpi-foot">Received</div>
        </div>
        <div className="kpi">
          <div className="kpi-top">
            <div className="kpi-label">Avg AI Score</div>
            <div className="kpi-icon" style={{ background: 'var(--green-bg)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
          </div>
          <div className="kpi-value">
            {jobs.filter(j => j.ai_score).length ? Math.round(jobs.reduce((acc, j) => acc + (j.ai_score || 0), 0) / jobs.filter(j => j.ai_score).length) : '—'}
          </div>
          <div className="kpi-foot">Match score</div>
        </div>
      </div>

      {/* View area */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="flex-1 min-h-0"
      >
        {viewMode === 'kanban' && <KanbanBoard />}
        {viewMode === 'table' && <TableView />}
        {viewMode === 'timeline' && <TimelineView />}
      </motion.div>
    </div>
  )
}
