import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format, differenceInDays } from 'date-fns'
import type { JobStatus, JobPriority } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return 'Undisclosed'
  const inrFmt = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  })
  
  if (min && max) return `${inrFmt.format(min)} – ${inrFmt.format(max)}`
  if (min) return `${inrFmt.format(min)}+`
  return `Up to ${inrFmt.format(max!)}`
}

export function timeAgo(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function daysSince(date: string): number {
  return differenceInDays(new Date(), new Date(date))
}

export function formatDate(date: string): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatDateTime(date: string): string {
  return format(new Date(date), 'MMM d · h:mma')
}

export const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; border: string; bg: string; dot: string }> = {
  wishlist:   { label: 'Wishlist',   color: 'text-violet-400', border: 'border-violet-500', bg: 'bg-violet-500/10',  dot: 'bg-violet-500' },
  applied:    { label: 'Applied',    color: 'text-blue-400',   border: 'border-blue-500',   bg: 'bg-blue-500/10',    dot: 'bg-blue-500' },
  screening:  { label: 'Screening',  color: 'text-amber-400',  border: 'border-amber-500',  bg: 'bg-amber-500/10',   dot: 'bg-amber-500' },
  interview:  { label: 'Interview',  color: 'text-purple-400', border: 'border-purple-500', bg: 'bg-purple-500/10',  dot: 'bg-purple-500' },
  offer:      { label: 'Offer',      color: 'text-emerald-400',border: 'border-emerald-500',bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
  rejected:   { label: 'Rejected',   color: 'text-red-400',    border: 'border-red-500',    bg: 'bg-red-500/10',     dot: 'bg-red-500' },
  ghosted:    { label: 'Ghosted',    color: 'text-slate-400',  border: 'border-slate-500',  bg: 'bg-slate-500/10',   dot: 'bg-slate-500' },
}

export const PRIORITY_CONFIG: Record<JobPriority, { label: string; color: string }> = {
  high:   { label: 'High',   color: 'text-red-400' },
  medium: { label: 'Medium', color: 'text-amber-400' },
  low:    { label: 'Low',    color: 'text-slate-400' },
}

export const KANBAN_COLUMNS: JobStatus[] = ['wishlist', 'applied', 'screening', 'interview', 'offer', 'rejected']

export function getUrgencyBorder(status: JobStatus, appliedAt?: string): string {
  if (status === 'offer') return 'border-l-emerald-500'
  if (status === 'rejected' || status === 'ghosted') return 'border-l-red-500/60'
  if (status === 'interview') return 'border-l-purple-500'
  if (appliedAt && daysSince(appliedAt) > 10) return 'border-l-amber-500'
  return 'border-l-blue-500/60'
}

export function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function companyColor(company: string): string {
  const colors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-pink-500 to-rose-600',
    'from-cyan-500 to-blue-600',
  ]
  const idx = company.charCodeAt(0) % colors.length
  return colors[idx]
}

export const IS_DEMO = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co'
