export type JobStatus = 'wishlist' | 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'ghosted'
export type JobPriority = 'high' | 'medium' | 'low'
export type InterviewType = 'phone' | 'video' | 'onsite' | 'take_home'
export type DocumentType = 'resume' | 'cover_letter' | 'portfolio'

export interface Job {
  id: string
  user_id: string
  company: string
  role: string
  location?: string
  url?: string
  salary_min?: number
  salary_max?: number
  status: JobStatus
  priority: JobPriority
  notes?: string
  ai_score?: number
  created_at: string
  applied_at?: string
  deadline?: string
}

export interface Contact {
  id: string
  job_id: string
  name: string
  email?: string
  phone?: string
  role?: string
  linkedin?: string
  notes?: string
}

export interface Interview {
  id: string
  job_id: string
  round: number
  date_time?: string
  type: InterviewType
  prep_notes?: string
  feedback?: string
  outcome?: string
}

export interface Document {
  id: string
  user_id: string
  type: DocumentType
  version: number
  content_text?: string
  file_url?: string
  created_at: string
  title?: string
}

export interface Activity {
  id: string
  job_id: string
  type: string
  note: string
  created_at: string
}

export interface AIAnalysis {
  id: string
  job_id: string
  resume_match_score: number
  suggestions: {
    matched_skills: string[]
    missing_skills: string[]
    improvements: { bullet: string; suggestion: string }[]
    tailored_summary: string
  }
  created_at: string
}

export type ViewMode = 'kanban' | 'table' | 'timeline'
