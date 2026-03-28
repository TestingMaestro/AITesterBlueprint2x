import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, ExternalLink, Brain, Edit, Calendar, User, FileText, MessageSquare, IndianRupee } from 'lucide-react'
import { motion } from 'framer-motion'
import { useJobStore } from '@/store/useJobStore'
import { useUIStore } from '@/store/useUIStore'
import { cn, STATUS_CONFIG, formatSalary, formatDate, companyColor, initials } from '@/lib/utils'
import { useState } from 'react'

const TABS = [
  { id: 'overview', label: 'Overview', icon: Brain },
  { id: 'contacts', label: 'Contacts', icon: User },
  { id: 'interviews', label: 'Interviews', icon: Calendar },
  { id: 'documents', label: 'Documents', icon: FileText },
]

const QUICK_ACTIONS = [
  { label: 'Generate Cover Letter', icon: FileText, color: 'text-blue-400' },
  { label: 'Prep Interview Questions', icon: MessageSquare, color: 'text-purple-400' },
  { label: 'Draft Follow-up Email', icon: ExternalLink, color: 'text-amber-400' },
  { label: 'Analyze Job Description', icon: Brain, color: 'text-emerald-400' },
]

export function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { jobs, removeJob } = useJobStore()
  const { setEditJobId } = useUIStore()
  const [activeTab, setActiveTab] = useState('overview')

  const job = jobs.find(j => j.id === id)
  if (!job) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-slate-400 mb-4">Job not found</p>
        <button onClick={() => navigate('/')} className="btn-secondary">Back to Dashboard</button>
      </div>
    </div>
  )

  const cfg = STATUS_CONFIG[job.status]
  const activities = [
    { date: job.created_at, note: 'Job added to tracker', type: 'created' },
    ...(job.applied_at ? [{ date: job.applied_at, note: 'Application submitted', type: 'applied' }] : []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="max-w-5xl mx-auto px-5 py-5">
      {/* Back nav */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 mb-5 transition-colors">
        <ArrowLeft size={13} /> Back to Dashboard
      </button>

      {/* Hero */}
      <div className="table-card" style={{ display: 'block', padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div className="k-logo" style={{ width: '56px', height: '56px', fontSize: '24px', borderRadius: '12px', background: `var(--${job.company.charCodeAt(0) % 2 ? 'blue' : 'purple'}-dot)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {initials(job.company)}
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.1 }}>{job.role}</h1>
              <p style={{ fontSize: '14px', color: 'var(--text-dim)', marginTop: '4px' }}>{job.company}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                <span className={`badge b-${job.status.toLowerCase()}`}>
                  <span className="badge-dot" />{cfg.label}
                </span>
                {job.location && (
                  <span className="k-tag"><MapPin size={11} strokeWidth={2} style={{ marginRight: '4px' }} />{job.location}</span>
                )}
                {(job.salary_min || job.salary_max) && (
                  <span className="k-tag"><IndianRupee size={11} strokeWidth={2} style={{ marginRight: '4px' }} />{formatSalary(job.salary_min, job.salary_max)}</span>
                )}
                {job.applied_at && (
                  <span className="k-tag">Applied {formatDate(job.applied_at)}</span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            {job.url && (
              <a href={job.url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                <ExternalLink size={12} strokeWidth={2} style={{ marginRight: '4px' }} /> View
              </a>
            )}
            <button onClick={() => setEditJobId(job.id)} className="btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
              <Edit size={12} strokeWidth={2} style={{ marginRight: '4px' }} /> Edit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Main tabs area */}
        <div className="col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
            {TABS.map(({ id: tabId, label, icon: Icon }) => (
              <button key={tabId} onClick={() => setActiveTab(tabId)}
                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  activeTab === tabId ? 'bg-white/[0.08] text-white' : 'text-slate-500 hover:text-slate-300')}>
                <Icon size={12} />{label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="card p-4 min-h-[300px]">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <p className="label">Notes</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{job.notes || <span className="text-slate-600">No notes added yet.</span>}</p>
                </div>
                {job.ai_score && (
                  <div>
                    <p className="label">AI Match Score</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all', job.ai_score >= 80 ? 'bg-emerald-500' : job.ai_score >= 60 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${job.ai_score}%` }} />
                      </div>
                      <span className="text-sm font-bold text-white">{job.ai_score}%</span>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><p className="label">Created</p><p className="text-slate-300">{formatDate(job.created_at)}</p></div>
                  {job.deadline && <div><p className="label">Deadline</p><p className="text-red-400">{formatDate(job.deadline)}</p></div>}
                  <div><p className="label">Priority</p><p className="text-slate-300 capitalize">{job.priority}</p></div>
                  <div><p className="label">Status</p><p className={cfg.color}>{cfg.label}</p></div>
                </div>
              </div>
            )}
            {activeTab !== 'overview' && (
              <div className="flex items-center justify-center h-48 text-center">
                <div>
                  <p className="text-slate-500 text-sm mb-2">No {activeTab} added yet</p>
                  <p className="text-xs text-slate-600">Connect Supabase to enable full functionality</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar: activity + quick actions */}
        <div className="space-y-4">
          {/* Quick AI Actions */}
          <div className="card p-3">
            <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">AI Quick Actions</p>
            <div className="space-y-1">
              {QUICK_ACTIONS.map(({ label, icon: Icon, color }) => (
                <button key={label} className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-white/[0.05] transition-all group">
                  <Icon size={13} className={cn(color, 'flex-shrink-0')} />
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="card p-3">
            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Activity</p>
            <div className="space-y-3">
              {activities.map((a, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-0.5" />
                    {i < activities.length - 1 && <div className="w-px flex-1 bg-white/[0.06]" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-xs text-slate-300">{a.note}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{formatDate(a.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
