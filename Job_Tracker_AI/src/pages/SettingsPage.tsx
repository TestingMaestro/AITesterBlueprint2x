export function SettingsPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto h-full overflow-y-auto scrollable">
      <div className="page-head" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub mt-1">Manage your profile, preferences, and integrations.</p>
        </div>
      </div>
      <div className="space-y-4">
        {['Profile & Target Role', 'Default Resume', 'Notifications', 'Integrations (LinkedIn, Google Calendar)'].map(section => (
          <div key={section} className="card p-4 flex items-center justify-between hover:bg-white/[0.04] transition-colors" style={{ padding: '16px', borderRadius: '12px' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{section}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Coming in future updates</p>
            </div>
            <div className="badge b-hot"><span className="badge-dot"></span>Soon</div>
          </div>
        ))}
      </div>
    </div>
  )
}
