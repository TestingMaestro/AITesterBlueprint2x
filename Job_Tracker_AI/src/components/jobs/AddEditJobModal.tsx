import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Building2, Briefcase, MapPin, Link, IndianRupee, Calendar, AlignLeft } from 'lucide-react'
import { cn, STATUS_CONFIG, KANBAN_COLUMNS } from '@/lib/utils'
import { useJobStore } from '@/store/useJobStore'
import type { Job, JobStatus, JobPriority } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  jobId?: string | null
}

const EMPTY: Omit<Job, 'id' | 'user_id' | 'created_at'> = {
  company: '', role: '', location: '', url: '',
  salary_min: undefined, salary_max: undefined,
  status: 'wishlist', priority: 'medium', notes: '',
}

export function AddEditJobModal({ open, onClose, jobId }: Props) {
  const { jobs, addJob, updateJob, removeJob } = useJobStore()
  const existingJob = jobId ? jobs.find(j => j.id === jobId) : null
  const [form, setForm] = useState({ ...EMPTY })
  const navigate = useNavigate()

  useEffect(() => {
    if (existingJob) setForm({ ...existingJob })
    else setForm({ ...EMPTY })
  }, [existingJob, open])

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company || !form.role) return

    if (existingJob) {
      updateJob(existingJob.id, form)
      onClose()
    } else {
      const newJob: Job = {
        ...form,
        id: `j_${Date.now()}`,
        user_id: 'demo',
        created_at: new Date().toISOString(),
        applied_at: form.status !== 'wishlist' ? new Date().toISOString() : undefined,
      }
      addJob(newJob)
      onClose()
      navigate(`/jobs/${newJob.id}`)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="modal-content pointer-events-auto max-h-[90dvh] overflow-y-auto w-full max-w-lg p-0" onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <div className="m-title">{existingJob ? `Edit — ${existingJob.company}` : 'Track New Job'}</div>
                <button onClick={onClose} className="icon-btn">✕</button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label className="m-label">Company *</label>
                      <div className="m-input-w">
                        <Building2 size={13} strokeWidth={2} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-dim)' }} />
                        <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="e.g. Stripe" required className="m-input pl" />
                      </div>
                    </div>
                    <div>
                      <label className="m-label">Role *</label>
                      <div className="m-input-w">
                        <Briefcase size={13} strokeWidth={2} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-dim)' }} />
                        <input value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. Senior Engineer" required className="m-input pl" />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label className="m-label">Location</label>
                      <div className="m-input-w">
                        <MapPin size={13} strokeWidth={2} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-dim)' }} />
                        <input value={form.location || ''} onChange={e => set('location', e.target.value)} placeholder="Remote / NYC" className="m-input pl" />
                      </div>
                    </div>
                    <div>
                      <label className="m-label">Job URL</label>
                      <div className="m-input-w">
                        <Link size={13} strokeWidth={2} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-dim)' }} />
                        <input value={form.url || ''} onChange={e => set('url', e.target.value)} placeholder="https://..." className="m-input pl" />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label className="m-label">Min Salary (₹)</label>
                      <div className="m-input-w">
                        <IndianRupee size={13} strokeWidth={2} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-dim)' }} />
                        <input type="number" value={form.salary_min || ''} onChange={e => set('salary_min', Number(e.target.value))} placeholder="120000" className="m-input pl" />
                      </div>
                    </div>
                    <div>
                      <label className="m-label">Max Salary (₹)</label>
                      <div className="m-input-w">
                        <IndianRupee size={13} strokeWidth={2} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-dim)' }} />
                        <input type="number" value={form.salary_max || ''} onChange={e => set('salary_max', Number(e.target.value))} placeholder="160000" className="m-input pl" />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label className="m-label">Status</label>
                      <select value={form.status} onChange={e => set('status', e.target.value as JobStatus)} className="m-input appearance-none">
                        {KANBAN_COLUMNS.map(s => (
                          <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="m-label">Priority</label>
                      <select value={form.priority} onChange={e => set('priority', e.target.value as JobPriority)} className="m-input appearance-none">
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="m-label">Application Deadline</label>
                    <div className="m-input-w">
                      <Calendar size={13} strokeWidth={2} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-dim)' }} />
                      <input type="date" value={form.deadline || ''} onChange={e => set('deadline', e.target.value)} className="m-input pl" />
                    </div>
                  </div>

                  <div>
                    <label className="m-label">Notes</label>
                    <div className="m-input-w">
                      <AlignLeft size={13} strokeWidth={2} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                      <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Add any notes..." rows={3} className="m-input pl" style={{ resize: 'none' }} />
                    </div>
                  </div>

                  <div className="modal-foot" style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    {existingJob && (
                      <button type="button" onClick={() => { removeJob(existingJob.id); onClose() }} className="btn-secondary" style={{ color: 'var(--red)', borderColor: 'rgba(239,68,68,0.2)', marginRight: 'auto' }}>
                        Delete
                      </button>
                    )}
                    <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">
                      {existingJob ? 'Save Changes' : 'Track Job'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
