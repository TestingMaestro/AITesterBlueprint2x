import { useNavigate } from 'react-router-dom'
import { useJobStore } from '@/store/useJobStore'
import { useUIStore } from '@/store/useUIStore'
import { cn, STATUS_CONFIG, formatSalary, formatDate, timeAgo, companyColor, initials } from '@/lib/utils'
import { ExternalLink, Edit, Trash2, Brain } from 'lucide-react'
import { exportToExcel } from '@/lib/exportExcel'

export function TableView() {
  const { jobs, searchQuery, removeJob, companyFilter, priorityFilter, sortBy } = useJobStore()
  const { setEditJobId } = useUIStore()
  const navigate = useNavigate()

  const filtered = jobs
    .filter(j => {
      // 1. Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!j.company.toLowerCase().includes(q) && !j.role.toLowerCase().includes(q)) return false
      }
      // 2. Company Filter
      if (companyFilter && j.company !== companyFilter) return false
      // 3. Priority Filter
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
      return 0
    })

  return (
    <div id="table-view" className="active" style={{ display: 'block' }}>
      <div className="table-card">
        <div className="table-toolbar">
          <span className="table-title">Job Pipeline</span>
          <span className="count-pill">{filtered.length} jobs</span>
          <div className="toolbar-spacer"></div>
          <button className="tool-btn" onClick={() => exportToExcel(filtered)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
          <button className="tool-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Columns
          </button>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '36px', cursor: 'default' }}><input type="checkbox" className="cb" title="Select all" /></th>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Salary</th>
                <th>Applied</th>
                <th>AI Score</th>
                <th style={{ cursor: 'default', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(job => (
                <tr key={job.id} onClick={() => navigate(`/jobs/${job.id}`)}>
                  <td onClick={e => e.stopPropagation()}>
                    <input type="checkbox" className="cb" title="Select row" />
                  </td>
                  <td>
                    <div className="company-cell">
                      <div className="avatar" style={{ background: `var(--${job.company.charCodeAt(0) % 2 ? 'blue' : 'purple'}-dot)` }}>
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <div className="co-name">{job.company}</div>
                        {job.url && <div className="co-domain">{job.url}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="role-name">{job.role}</div>
                    <div className="role-dept">
                      {
                        job.role.toLowerCase().includes('design') ? 'Design' :
                        job.role.toLowerCase().includes('data') ? 'Data & Analytics' :
                        job.role.toLowerCase().includes('product') && !job.role.toLowerCase().includes('engineer') ? 'Product' :
                        job.role.toLowerCase().includes('market') || job.role.toLowerCase().includes('growth') ? 'Marketing' :
                        'Engineering'
                      }
                    </div>
                  </td>
                  <td>
                    <span className={`badge b-${job.status.toLowerCase()}`}>
                      <span className="badge-dot"></span>{job.status}
                    </span>
                  </td>
                  <td>
                    {job.salary_min ? <span className="sal-val">{formatSalary(job.salary_min, job.salary_max)}</span> : <span className="sal-na">Undisclosed</span>}
                  </td>
                  <td>
                    <div className="date-val">{job.applied_at ? formatDate(job.applied_at) : '—'}</div>
                    <div className="date-ago">{job.applied_at ? timeAgo(job.applied_at) : ''}</div>
                  </td>
                  <td>
                    {job.ai_score ? (
                      <div className="score-wrap">
                        <div className="score-track">
                          <div className="score-fill" style={{ width: `${job.ai_score}%`, background: job.ai_score >= 80 ? 'var(--green-dot)' : 'var(--orange-dot)' }}></div>
                        </div>
                        <span className="score-num">{job.ai_score}</span>
                      </div>
                    ) : <span className="sal-na">—</span>}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="row-actions">
                      <button className="row-btn" onClick={() => setEditJobId(job.id)} title="Edit">
                        <Edit size={12} />
                      </button>
                      {job.url && (
                        <a href={job.url} target="_blank" rel="noreferrer" className="row-btn">
                          <ExternalLink size={12} />
                        </a>
                      )}
                      <button className="row-btn del" onClick={() => removeJob(job.id)} title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div>
              <div className="empty-title">No jobs found</div>
              <div className="empty-sub">Try adjusting your search or filters</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
