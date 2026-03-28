import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, IndianRupee, Clock, Brain, ExternalLink, MoreHorizontal, Star } from 'lucide-react'
import { cn, formatSalary, daysSince, STATUS_CONFIG, getUrgencyBorder, companyColor, initials } from '@/lib/utils'
import type { Job } from '@/types'
import { useUIStore } from '@/store/useUIStore'
import { useJobStore } from '@/store/useJobStore'

interface Props { job: Job; isDragging?: boolean }

export function JobCard({ job, isDragging }: Props) {
  const navigate = useNavigate()
  const { setEditJobId } = useUIStore()
  const removeJob = useJobStore(s => s.removeJob)

  const since = job.applied_at ? daysSince(job.applied_at) : null
  const urgencyBorder = getUrgencyBorder(job.status, job.applied_at)
  const cfg = STATUS_CONFIG[job.status]

  return (
    <div
      className={`k-card ${isDragging ? 'opacity-50 scale-95 shadow-2xl ring-2 ring-accent/40' : ''}`}
      onClick={(e) => { e.stopPropagation(); setEditJobId(job.id); }}
      style={{ cursor: 'grab' }}
    >
      <div className="k-card-top">
        <div className="k-logo" style={{ background: `var(--${job.company.charCodeAt(0) % 2 ? 'blue' : 'purple'}-dot)` }}>
          {job.company.charAt(0)}
        </div>
        <div className="k-co">{job.company}</div>
        {job.ai_score && <div className="k-score">{job.ai_score}%</div>}
      </div>
      <div className="k-role">{job.role}</div>
      <div className="k-tags">
        {job.location && (
          <span className="k-tag">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            {job.location.includes('Remote') ? 'Remote' : job.location.split(',')[0]}
          </span>
        )}
        {(job.salary_min || job.salary_max) && (
          <span className="k-tag">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            {formatSalary(job.salary_min, job.salary_max)}
          </span>
        )}
        {job.priority === 'high' && (
          <span className="k-tag k-tag-hot">
            Hot
          </span>
        )}
      </div>
      <div className="k-foot">
        <div className="k-avatars">
          <div className="k-avatar" style={{ background: '#333' }}></div>
        </div>
        {since !== null && (
          <div className="k-time">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {since === 0 ? 'Today' : `${since}d`}
          </div>
        )}
      </div>
    </div>
  )
}
