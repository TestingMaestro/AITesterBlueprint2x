import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, Briefcase, Calendar, FileText, 
  BarChart3, Settings, ChevronLeft, ChevronRight, 
  Sparkles, Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/useUIStore'
import { useJobStore } from '@/store/useJobStore'

const NAV_ITEMS = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/applications', icon: Briefcase,       label: 'Applications' },
  { to: '/interviews',   icon: Calendar,        label: 'Interviews' },
  { to: '/documents',    icon: FileText,        label: 'Documents' },
]

export function Sidebar() {
  const location = useLocation()
  const { sidebarOpen, setSidebarOpen, setAIPanelOpen, aiPanelOpen } = useUIStore()
  const jobs = useJobStore((s) => s.jobs)
  const { companyFilter, setCompanyFilter, priorityFilter, setPriorityFilter, sortBy, setSortBy } = useJobStore()

  const stats = {
    applied: jobs.filter(j => j.status === 'applied').length,
    interviews: jobs.filter(j => j.status === 'interview').length,
    offers: jobs.filter(j => j.status === 'offer').length,
  }

  // Get unique companies
  const companies = Array.from(new Set(jobs.map(j => j.company))).sort()

  return (
    <aside className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`} id="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-section-label">Navigation</div>
        <div className="nav-list">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
            return (
              <Link
                key={to}
                to={to}
                className={`nav-item ${active ? 'active' : ''}`}
                title={!sidebarOpen ? label : undefined}
              >
                <Icon size={15} strokeWidth={2} />
                <span className="nav-label">{label}</span>
                {label === 'Applications' && <span className="nav-badge">{stats.applied + stats.interviews + stats.offers}</span>}
                {label === 'Interviews' && <span className="nav-badge">{stats.interviews}</span>}
              </Link>
            )
          })}
        </div>

        <div className="sidebar-divider"></div>
        <div className="sidebar-section-label">Quick Stats</div>
        <div className="stat-cards-wrap">
          <div className="stat-card">
            <div className="stat-card-text">
              <span className="sdot" style={{ background: 'var(--blue-dot)' }}></span>
              <span>Applied</span>
            </div>
            <span className="stat-pill">{stats.applied}</span>
          </div>
          <div className="stat-card">
            <div className="stat-card-text">
              <span className="sdot" style={{ background: 'var(--orange-dot)' }}></span>
              <span>Interviews</span>
            </div>
            <span className="stat-pill">{stats.interviews}</span>
          </div>
          <div className="stat-card">
            <div className="stat-card-text">
              <span className="sdot" style={{ background: 'var(--purple-dot)' }}></span>
              <span>Offers</span>
            </div>
            <span className="stat-pill">{stats.offers}</span>
          </div>
        </div>

        <div className="sidebar-divider"></div>
        <div className="sidebar-section-label flex justify-between">
          <span>Filters</span>
          {(companyFilter || priorityFilter || sortBy) && (
            <span style={{color:'var(--accent)', cursor:'pointer', fontSize:'9px', textTransform:'none'}} onClick={() => { setCompanyFilter(null); setPriorityFilter(null); setSortBy(null) }}>Clear</span>
          )}
        </div>
        <div className="filter-section">
          <div className="filter-block">
            <div className="filter-lbl">Sort By</div>
            <select className="filter-select" value={sortBy || ''} onChange={(e) => setSortBy(e.target.value as any || null)}>
              <option value="">Default</option>
              <option value="company">Company A–Z</option>
              <option value="date">Date Applied</option>
            </select>
          </div>
          <div className="filter-block">
            <div className="filter-lbl">Urgency</div>
            <select className="filter-select" value={priorityFilter || ''} onChange={(e) => setPriorityFilter(e.target.value || null)}>
              <option value="">All Priorities</option>
              <option value="high">High (Hot)</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="filter-block">
            <div className="filter-lbl">Companies</div>
            <div className="company-chips">
              {companies.map(c => (
                <span key={c} onClick={() => setCompanyFilter(companyFilter === c ? null : c)} className={`chip ${companyFilter === c ? 'active' : ''}`}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <Link to="/settings" className="footer-item">
            <Settings size={15} strokeWidth={2} />
            <span className="sidebar-footer-text">Settings</span>
          </Link>
          <div className="footer-item" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft size={15} strokeWidth={2} /> : <ChevronRight size={15} strokeWidth={2} />}
            <span className="sidebar-footer-text">Collapse</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
