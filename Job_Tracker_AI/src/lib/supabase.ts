import { createClient } from '@supabase/supabase-js'
import type { Job, Contact, Interview, Document, Activity, AIAnalysis } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      jobs: { Row: Job; Insert: Omit<Job, 'id' | 'created_at'>; Update: Partial<Job> }
      contacts: { Row: Contact; Insert: Omit<Contact, 'id'>; Update: Partial<Contact> }
      interviews: { Row: Interview; Insert: Omit<Interview, 'id'>; Update: Partial<Interview> }
      documents: { Row: Document; Insert: Omit<Document, 'id' | 'created_at'>; Update: Partial<Document> }
      activities: { Row: Activity; Insert: Omit<Activity, 'id'>; Update: Partial<Activity> }
      ai_analyses: { Row: AIAnalysis; Insert: Omit<AIAnalysis, 'id' | 'created_at'>; Update: Partial<AIAnalysis> }
    }
  }
}
