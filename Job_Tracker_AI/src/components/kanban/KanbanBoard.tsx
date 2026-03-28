import { useState } from 'react'
import {
  DndContext, DragEndEvent, DragOverEvent, DragStartEvent,
  closestCorners, DragOverlay, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core'
import { KanbanColumn } from './KanbanColumn'
import { JobCard } from './JobCard'
import { useJobStore } from '@/store/useJobStore'
import { KANBAN_COLUMNS } from '@/lib/utils'
import type { Job, JobStatus } from '@/types'

export function KanbanBoard() {
  const { jobs, searchQuery, moveJob, companyFilter, priorityFilter, sortBy } = useJobStore()
  const [activeJob, setActiveJob] = useState<Job | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

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

  const handleDragStart = (e: DragStartEvent) => {
    const job = jobs.find(j => j.id === e.active.id as string)
    setActiveJob(job || null)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    setActiveJob(null)
    if (!over) return

    const jobId = active.id as string
    const overId = over.id as string

    // overId is either a column status or another job's id
    const targetStatus = KANBAN_COLUMNS.includes(overId as JobStatus)
      ? (overId as JobStatus)
      : jobs.find(j => j.id === overId)?.status

    if (targetStatus) {
      moveJob(jobId, targetStatus)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div id="kanban-view" className="view active" style={{ display: 'block' }}>
        <div className="kanban-board">
          {KANBAN_COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              jobs={filtered.filter(j => j.status === status)}
            />
          ))}
        </div>
      </div>

      {/* Drag overlay: ghost card */}
      <DragOverlay>
        {activeJob && <JobCard job={activeJob} isDragging={true} />}
      </DragOverlay>
    </DndContext>
  )
}
