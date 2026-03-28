import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Job, JobStatus, ViewMode } from '@/types'

const API_URL = 'http://localhost:4000/api/jobs'

interface JobStore {
  jobs: Job[]
  viewMode: ViewMode
  searchQuery: string
  filterStatus: JobStatus | 'all'
  companyFilter: string | null
  priorityFilter: string | null
  sortBy: 'date' | 'company' | null
  isLoading: boolean
  error: string | null
  
  fetchJobs: () => Promise<void>
  addJob: (job: Job) => Promise<void>
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>
  removeJob: (id: string) => Promise<void>
  moveJob: (id: string, newStatus: JobStatus) => Promise<void>
  
  setViewMode: (mode: ViewMode) => void
  setSearchQuery: (q: string) => void
  setFilterStatus: (status: JobStatus | 'all') => void
  setCompanyFilter: (company: string | null) => void
  setPriorityFilter: (priority: string | null) => void
  setSortBy: (sort: 'date' | 'company' | null) => void
}

export const useJobStore = create<JobStore>()(
  immer((set, get) => ({
    jobs: [],
    viewMode: 'kanban',
    searchQuery: '',
    filterStatus: 'all',
    companyFilter: null,
    priorityFilter: null,
    sortBy: null,
    isLoading: false,
    error: null,

    fetchJobs: async () => {
      set((state) => { state.isLoading = true; state.error = null })
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error('Failed to fetch jobs')
        const data = await res.json()
        set((state) => { state.jobs = data; state.isLoading = false })
      } catch (err: any) {
        set((state) => { state.error = err.message; state.isLoading = false })
      }
    },

    addJob: async (job) => {
      set((state) => { state.isLoading = true; state.error = null })
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(job)
        })
        if (!res.ok) throw new Error('Failed to add job')
        const newJob = await res.json()
        set((state) => {
          state.jobs.unshift(newJob)
          state.isLoading = false
        })
      } catch (err: any) {
        set((state) => { state.error = err.message; state.isLoading = false })
      }
    },

    updateJob: async (id, updates) => {
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })
        if (!res.ok) throw new Error('Failed to update job')
        const updatedJob = await res.json()
        set((state) => {
          const idx = state.jobs.findIndex((j) => j.id === id)
          if (idx !== -1) state.jobs[idx] = Object.assign(state.jobs[idx], updatedJob)
        })
      } catch (err: any) {
        set((state) => { state.error = err.message })
      }
    },

    removeJob: async (id) => {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to delete job')
        set((state) => {
          state.jobs = state.jobs.filter((j) => j.id !== id)
        })
      } catch (err: any) {
        set((state) => { state.error = err.message })
      }
    },

    moveJob: async (id, newStatus) => {
      // Optimistic upate (it was previously sync)
      set((state) => {
        const idx = state.jobs.findIndex((j) => j.id === id)
        if (idx !== -1) state.jobs[idx].status = newStatus
      })
      
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        })
        if (!res.ok) throw new Error('Failed to update status')
      } catch (err: any) {
        set((state) => { state.error = err.message })
      }
    },

    setViewMode: (mode) => set((state) => { state.viewMode = mode }),
    setSearchQuery: (q) => set((state) => { state.searchQuery = q }),
    setFilterStatus: (status) => set((state) => { state.filterStatus = status }),
    setCompanyFilter: (c) => set((state) => { state.companyFilter = c }),
    setPriorityFilter: (p) => set((state) => { state.priorityFilter = p }),
    setSortBy: (s) => set((state) => { state.sortBy = s }),
  }))
)
