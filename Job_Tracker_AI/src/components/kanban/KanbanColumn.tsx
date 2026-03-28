import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus } from 'lucide-react'
import { cn, STATUS_CONFIG } from '@/lib/utils'
import { JobCard } from './JobCard'
import { useUIStore } from '@/store/useUIStore'
import type { Job, JobStatus } from '@/types'

interface SortableJobCardProps { job: Job }

function SortableJobCard({ job }: SortableJobCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: job.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
    >
      <JobCard job={job} isDragging={isDragging} />
    </div>
  )
}

interface KanbanColumnProps {
  status: JobStatus
  jobs: Job[]
}

export function KanbanColumn({ status, jobs }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: status })
  const { setAddJobModalOpen } = useUIStore()
  const cfg = STATUS_CONFIG[status]

  return (
    <div
      ref={setNodeRef}
      className={`k-col ${isOver ? 'ring-1 ring-accent/30 bg-accent/[0.03]' : ''}`}
    >
      <div className="k-head">
        <span className="k-dot" style={{ background: `var(--${cfg.color.includes('blue') ? 'blue' : cfg.color.includes('amber') ? 'orange' : cfg.color.includes('emerald') ? 'green' : cfg.color.includes('purple') ? 'purple' : 'accent'}-dot)` }}></span>
        <span className="k-title">{cfg.label}</span>
        <span className="k-count">{jobs.length}</span>
      </div>

      <div className="k-cards">
        <SortableContext items={jobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.map(job => (
            <SortableJobCard key={job.id} job={job} />
          ))}
        </SortableContext>

        {jobs.length === 0 && (
          <div className="empty-state" style={{ padding: '20px 0', border: 'none', background: 'transparent' }}>
            <div className="empty-sub" style={{ fontSize: '11px' }}>No jobs here</div>
            <button onClick={() => setAddJobModalOpen(true)} className="btn-ghost" style={{ fontSize: '10px', marginTop: '6px', padding: '4px 8px' }}>+ Add one</button>
          </div>
        )}
      </div>
    </div>
  )
}
