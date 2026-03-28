import { useNavigate } from 'react-router-dom'
import { useJobStore } from '@/store/useJobStore'
import { cn, STATUS_CONFIG, formatSalary, formatDate, companyColor, initials } from '@/lib/utils'

export function TimelineView() {
  const { jobs, searchQuery, companyFilter, priorityFilter, sortBy } = useJobStore()
  const navigate = useNavigate()

  const sorted = jobs
    .filter(j => {
      if (!j.created_at) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!j.company.toLowerCase().includes(q) && !j.role.toLowerCase().includes(q)) return false
      }
      if (companyFilter && j.company !== companyFilter) return false
      if (priorityFilter && j.priority !== priorityFilter) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const da = a.applied_at ? new Date(a.applied_at).getTime() : 0
        const db = b.applied_at ? new Date(b.applied_at).getTime() : 0
        return db - da
      }
      if (sortBy === 'company') {
        return a.company.localeCompare(b.company)
      }
      return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
    })

  return (
    <div id="timeline-view" className="view active" style={{ display: 'block' }}>
      <div className="timeline-wrap">
        <div className="tl-month">Recent Activity</div>
        {sorted.map(job => {
          const dateObj = new Date(job.created_at || job.applied_at || Date.now())
          const day = dateObj.getDate()
          const month = dateObj.toLocaleString('en-US', { month: 'short' })
          return (
            <div key={job.id} className="tl-item">
              <div className="tl-date">
                <div className="tl-day">{day}</div>
                <div className="tl-m">{month}</div>
              </div>
              <div className="tl-content" onClick={() => navigate(`/jobs/${job.id}`)}>
                <div className="tl-card">
                  <div className="tl-head">
                    <div className="tl-co">
                      <div className="tl-logo" style={{ background: `var(--${job.company.charCodeAt(0) % 2 ? 'blue' : 'purple'}-dot)` }}>
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <div className="tl-name">{job.company}</div>
                        <div className="tl-role">{job.role}</div>
                      </div>
                    </div>
                    <span className={`badge b-${job.status.toLowerCase()}`}>
                      <span className="badge-dot"></span>{job.status}
                    </span>
                  </div>
                  <div className="tl-meta">
                    {job.location && <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>{job.location}</span>}
                    {(job.salary_min || job.salary_max) && <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>{formatSalary(job.salary_min, job.salary_max)}</span>}
                    {job.ai_score && <span style={{color: 'var(--green)'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>{job.ai_score}% Match</span>}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {sorted.length === 0 && (
          <div className="empty-state" style={{ marginTop: '20px' }}>
            <div className="empty-sub">No recent activity</div>
          </div>
        )}
      </div>
    </div>
  )
}
