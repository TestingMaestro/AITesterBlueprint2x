export function ApplicationsPage() {
  return (
    <div className="p-5 max-w-5xl mx-auto">
      <h1 className="font-serif italic text-accent text-2xl tracking-tight mb-2">Applications</h1>
      <p className="text-sm text-slate-500 mb-6">Full sortable and filterable view of all your tracked applications.</p>
      <div className="card p-8 text-center">
        <p className="text-slate-400 font-medium mb-2">Advanced Table View</p>
        <p className="text-sm text-slate-600">Use the Table view on the Dashboard for now. Full filter panel, CSV export and bulk actions are coming in Phase 4.</p>
      </div>
    </div>
  )
}
