import re

src = r'c:\Users\91914\AITesterBlueprint2x\Job_Tracker_AI\job_assistant_ai_UI.html'
dst = r'c:\Users\91914\AITesterBlueprint2x\Job_Tracker_AI\index.html'

with open(src, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add light theme CSS variables + toggle button styles
light_theme_css = """
/* ── LIGHT THEME ── */
html.light {
  --bg0:#f4f5f8;--bg1:#ffffff;--bg2:#f9fafb;--bg3:#eef0f4;--bg4:#dee1e8;
  --border:#00000012;--border2:#0000001a;--border3:#00000028;
  --text:#1a1d2e;--muted:#5f6680;--dim:#9ba3be;
  --accent:#0077cc;--accent2:#005fa3;--accentbg:rgba(0,119,204,0.08);
  --green:#059669;--greenbg:rgba(5,150,105,0.08);
  --amber:#d97706;--amberbg:rgba(217,119,6,0.08);
  --red:#dc2626;--redbg:rgba(220,38,38,0.08);
  --purple:#7c3aed;--purplebg:rgba(124,58,237,0.08);
  --teal:#0d9488;--tealbg:rgba(13,148,136,0.08);
  --pink:#db2777;
  --shadow:0 4px 24px rgba(0,0,0,0.08);
}
html.light body { background: var(--bg0); color: var(--text); }
html.light .jcard:hover { box-shadow:0 6px 20px rgba(0,0,0,.1); }
html.light .logo {
  background:linear-gradient(135deg,var(--accent),var(--purple));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
html.light .page-title {
  background:linear-gradient(135deg,var(--text) 60%,var(--accent));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
html.light .ai-icon{color:#fff}
html.light .add-job-btn{color:#fff}
html.light .btn-save{color:#fff}
html.light .ai-send{color:#fff}
html.light .top-avatar{color:#fff}
html.light .td-co-dot{color:var(--text)!important}
html.light .jcard-ai{color:#fff}
html.light .funnel-bar{color:#fff}
html.light .col-count{color:var(--text)}
html.light ::selection{background:rgba(0,119,204,0.2);color:var(--text)}
html.light ::-webkit-scrollbar-thumb{background:var(--dim)}

/* theme toggle button */
.theme-toggle{width:30px;height:30px;border-radius:var(--radius-sm);background:var(--bg3);
  border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--muted);font-size:15px;transition:all .15s;flex-shrink:0}
.theme-toggle:hover{border-color:var(--border3);color:var(--text)}
"""

# Inject light theme CSS before </style>
html = html.replace('</style>', light_theme_css + '\n</style>')

# 2. Add theme toggle button in topbar (before the avatar)
toggle_btn = '<div class="theme-toggle" onclick="toggleTheme()" id="theme-toggle" title="Toggle theme">🌙</div>\n    '
html = html.replace('<div class="top-avatar"', toggle_btn + '<div class="top-avatar"')

# 3. Add theme toggle JavaScript before </script>
theme_js = """
// ═══════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════
function toggleTheme(){
  const html = document.documentElement;
  const isLight = html.classList.toggle('light');
  const btn = document.getElementById('theme-toggle');
  btn.textContent = isLight ? '☀️' : '🌙';
  btn.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
  localStorage.setItem('jobflow-theme', isLight ? 'light' : 'dark');
}
// restore saved theme
(function(){
  const saved = localStorage.getItem('jobflow-theme');
  if(saved === 'light'){
    document.documentElement.classList.add('light');
    setTimeout(()=>{
      const btn = document.getElementById('theme-toggle');
      if(btn){ btn.textContent='☀️'; btn.title='Switch to dark mode'; }
    }, 0);
  }
})();
"""
html = html.replace('</script>', theme_js + '\n</script>')

# 4. Update title
html = html.replace('<title>JobFlow AI — Enterprise Job Tracker</title>',
                     '<title>JobFlow AI — Enterprise Job Tracker & AI Assistant</title>')

with open(dst, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ Created enhanced index.html with dark/light theme toggle ({len(html)} bytes)")
