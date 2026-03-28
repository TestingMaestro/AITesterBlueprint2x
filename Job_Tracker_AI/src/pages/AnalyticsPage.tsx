import { useJobStore } from '@/store/useJobStore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { cn, STATUS_CONFIG } from '@/lib/utils'

export function AnalyticsPage() {
  const jobs = useJobStore(s => s.jobs)

  const funnelData = Object.entries(STATUS_CONFIG).map(([key, val]) => ({
    name: val.label,
    count: jobs.filter(j => j.status === key).length,
    color: val.dot.replace('bg-', '').split('-').reduce((_, v) => v),
  }))

  const salaryData = jobs
    .filter(j => j.salary_min && j.salary_max)
    .map(j => ({ company: j.company, mid: ((j.salary_min! + j.salary_max!) / 2) / 1000 }))
    .slice(0, 8)

  const offerRate = jobs.length ? Math.round((jobs.filter(j => j.status === 'offer').length / jobs.length) * 100) : 0
  const responseRate = jobs.filter(j => j.applied_at).length
    ? Math.round((jobs.filter(j => ['screening', 'interview', 'offer'].includes(j.status)).length / jobs.filter(j => j.applied_at).length) * 100)
    : 0

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-serif italic text-accent text-2xl tracking-tight">Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">Your job search performance insights</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Applied', value: jobs.filter(j => j.applied_at).length },
          { label: 'Response Rate', value: `${responseRate}%`, highlight: responseRate > 40 },
          { label: 'Offer Rate', value: `${offerRate}%`, highlight: offerRate > 0 },
          { label: 'Active Pipeline', value: jobs.filter(j => !['rejected', 'ghosted'].includes(j.status)).length },
        ].map(({ label, value, highlight }) => (
          <div key={label} className="card p-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
            <p className={cn('text-2xl font-bold mt-1', highlight ? 'text-emerald-400' : 'text-white')}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Funnel chart */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Application Funnel</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={funnelData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={70} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#f1f5f9', fontSize: 11 }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {funnelData.map((_, i) => (
                  <Cell key={i} fill="rgba(108,99,255,0.7)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Salary distribution */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Salary Distribution (k)</h3>
          {salaryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salaryData}>
                <XAxis dataKey="company" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#f1f5f9', fontSize: 11 }} formatter={(v) => [`$${v}k`, 'Mid Salary']} />
                <Bar dataKey="mid" radius={[6, 6, 0, 0]} fill="rgba(16,185,129,0.6)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-slate-600 text-sm">Add salary data to see distribution</div>
          )}
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-4 card p-4 border-accent/20 bg-accent/[0.03]">
        <p className="text-xs font-semibold text-accent mb-1">🤖 AI Insight</p>
        <p className="text-sm text-slate-300">
          Your response rate is <span className="text-white font-semibold">{responseRate}%</span> — top performers average 41%. 
          {responseRate >= 41 
            ? " You're above average! Focus on converting screening calls to interviews." 
            : " Consider tailoring your resume more specifically to each role's tech stack to improve this."}
        </p>
      </div>
    </div>
  )
}
