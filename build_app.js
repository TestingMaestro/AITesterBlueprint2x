// build_app.js — Generates index.html with embedded test case data
const fs = require('fs');
const testCases = JSON.parse(fs.readFileSync('test_cases.json', 'utf-8'));
const tcJSON = JSON.stringify(testCases);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="description" content="RAG Pipeline - Regression Test Case Suggester for VWO app.vwo.com">
<title>VWO RAG Pipeline — Regression Test Case Suggester</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0e1a;--surface:#111827;--surface2:#1a2235;--glass:rgba(17,24,39,0.7);--border:rgba(99,102,241,0.15);--border2:rgba(99,102,241,0.3);--text:#e2e8f0;--text2:#94a3b8;--accent:#6366f1;--accent2:#818cf8;--accent-glow:rgba(99,102,241,0.25);--high:#ef4444;--high-bg:rgba(239,68,68,0.12);--med:#f59e0b;--med-bg:rgba(245,158,11,0.12);--low:#22c55e;--low-bg:rgba(34,197,94,0.12);--radius:12px;--shadow:0 8px 32px rgba(0,0,0,0.3)}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;flex-direction:column}
.app{display:flex;flex:1;overflow:hidden;height:100vh}

/* Header */
.header{background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%);padding:16px 28px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);position:fixed;top:0;left:0;right:0;z-index:100;height:64px;backdrop-filter:blur(20px)}
.header h1{font-size:20px;font-weight:700;background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.header .subtitle{font-size:12px;color:var(--text2);margin-top:2px}
.header-right{display:flex;gap:12px;align-items:center}
.stat-badge{background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:6px 14px;font-size:12px;color:var(--text2)}
.stat-badge span{color:var(--accent2);font-weight:600}

/* Sidebar */
.sidebar{width:380px;min-width:380px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;margin-top:64px;height:calc(100vh - 64px)}
.sidebar-header{padding:16px;border-bottom:1px solid var(--border)}
.sidebar-header h2{font-size:15px;font-weight:600;margin-bottom:10px;display:flex;align-items:center;gap:8px}
.sidebar-filter{display:flex;gap:8px}
.sidebar-filter select,.sidebar-filter input{flex:1;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--text);font-size:13px;font-family:'Inter',sans-serif;outline:none;transition:border .2s}
.sidebar-filter select:focus,.sidebar-filter input:focus{border-color:var(--accent)}
.chunk-list{flex:1;overflow-y:auto;padding:8px}
.chunk-list::-webkit-scrollbar{width:6px}
.chunk-list::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}
.chunk{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:8px;cursor:pointer;transition:all .2s}
.chunk:hover{border-color:var(--accent);transform:translateX(4px);box-shadow:0 0 20px var(--accent-glow)}
.chunk.active{border-color:var(--accent);background:rgba(99,102,241,0.08)}
.chunk-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.chunk-id{font-size:11px;font-weight:600;color:var(--accent2);font-family:monospace}
.chunk-module{font-size:10px;padding:3px 8px;border-radius:10px;background:rgba(99,102,241,0.1);color:var(--accent2);font-weight:500}
.chunk-title{font-size:13px;font-weight:500;margin-bottom:6px;line-height:1.4}
.chunk-preview{font-size:11px;color:var(--text2);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.priority-badge{display:inline-block;font-size:10px;font-weight:600;padding:2px 8px;border-radius:10px;margin-top:6px}
.priority-High{background:var(--high-bg);color:var(--high)}
.priority-Medium{background:var(--med-bg);color:var(--med)}
.priority-Low{background:var(--low-bg);color:var(--low)}
.type-badge{display:inline-block;font-size:10px;padding:2px 8px;border-radius:10px;background:rgba(148,163,184,0.1);color:var(--text2);margin-top:6px;margin-left:4px}

/* Main */
.main{flex:1;display:flex;flex-direction:column;margin-top:64px;height:calc(100vh - 64px);overflow-y:auto}
.search-section{padding:32px 40px 24px;background:linear-gradient(180deg,rgba(99,102,241,0.05) 0%,transparent 100%)}
.search-title{font-size:28px;font-weight:700;margin-bottom:6px;background:linear-gradient(135deg,#e2e8f0,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.search-desc{color:var(--text2);font-size:14px;margin-bottom:20px}
.search-box{display:flex;gap:10px}
.search-box input{flex:1;background:var(--surface);border:2px solid var(--border);border-radius:var(--radius);padding:14px 20px;font-size:15px;color:var(--text);font-family:'Inter',sans-serif;outline:none;transition:all .3s}
.search-box input:focus{border-color:var(--accent);box-shadow:0 0 30px var(--accent-glow)}
.search-box input::placeholder{color:var(--text2)}
.search-box button{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:var(--radius);padding:14px 28px;font-size:14px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all .2s;white-space:nowrap}
.search-box button:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(99,102,241,0.4)}
.example-queries{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
.example-q{background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:6px 14px;font-size:12px;color:var(--text2);cursor:pointer;transition:all .2s}
.example-q:hover{border-color:var(--accent);color:var(--accent2)}

/* Results */
.results-section{flex:1;padding:0 40px 40px}
.suggestion-box{background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.06));border:1px solid var(--border2);border-radius:var(--radius);padding:20px 24px;margin-bottom:24px;display:none;animation:fadeIn .4s}
.suggestion-box.show{display:block}
.suggestion-box h3{font-size:14px;font-weight:600;color:var(--accent2);margin-bottom:8px;display:flex;align-items:center;gap:8px}
.suggestion-text{font-size:14px;color:var(--text);line-height:1.6}
.suggestion-text strong{color:var(--accent2)}
.results-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.results-header h3{font-size:16px;font-weight:600}
.results-count{font-size:13px;color:var(--text2)}
.result-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:12px;transition:all .3s;animation:slideUp .3s ease-out}
.result-card:hover{border-color:var(--border2);box-shadow:var(--shadow)}
.result-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
.result-left{display:flex;align-items:center;gap:10px}
.result-id{font-family:monospace;font-size:13px;font-weight:600;color:var(--accent2);background:rgba(99,102,241,0.1);padding:4px 10px;border-radius:6px}
.result-title{font-size:15px;font-weight:600}
.relevance{font-size:12px;font-weight:600;padding:4px 10px;border-radius:8px;background:rgba(34,197,94,0.1);color:#22c55e}
.result-meta{display:flex;gap:8px;align-items:center;margin:8px 0 12px;flex-wrap:wrap}
.result-details{display:none;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)}
.result-details.show{display:block}
.detail-row{margin-bottom:10px}
.detail-label{font-size:11px;font-weight:600;color:var(--accent2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.detail-value{font-size:13px;color:var(--text2);line-height:1.6;white-space:pre-line}
.toggle-btn{background:none;border:1px solid var(--border);border-radius:8px;padding:6px 14px;font-size:12px;color:var(--text2);cursor:pointer;font-family:'Inter',sans-serif;transition:all .2s}
.toggle-btn:hover{border-color:var(--accent);color:var(--accent2)}
.no-results{text-align:center;padding:60px 20px;color:var(--text2)}
.no-results .icon{font-size:48px;margin-bottom:16px}
.no-results p{font-size:15px}
.welcome{text-align:center;padding:80px 20px;color:var(--text2)}
.welcome .icon{font-size:64px;margin-bottom:20px;opacity:.6}
.welcome h3{font-size:20px;margin-bottom:8px;color:var(--text)}
.welcome p{font-size:14px;max-width:500px;margin:0 auto;line-height:1.6}
mark{background:rgba(99,102,241,0.25);color:var(--accent2);border-radius:2px;padding:0 2px}

@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* Detail modal */
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:200;backdrop-filter:blur(4px);justify-content:center;align-items:center}
.modal-overlay.show{display:flex}
.modal{background:var(--surface);border:1px solid var(--border2);border-radius:16px;width:90%;max-width:700px;max-height:85vh;overflow-y:auto;padding:28px;box-shadow:0 25px 60px rgba(0,0,0,0.5);animation:fadeIn .3s}
.modal h2{font-size:18px;font-weight:700;margin-bottom:4px}
.modal .modal-id{font-family:monospace;color:var(--accent2);font-size:13px}
.modal-close{position:absolute;top:16px;right:20px;background:none;border:none;color:var(--text2);font-size:24px;cursor:pointer}
.modal-body{margin-top:16px}

@media(max-width:900px){
  .sidebar{width:100%;min-width:unset;height:40vh;border-right:none;border-bottom:1px solid var(--border)}
  .app{flex-direction:column}
  .main{height:60vh}
  .search-section{padding:20px}
  .results-section{padding:0 20px 20px}
}
</style>
</head>
<body>
<header class="header">
  <div>
    <h1>🔍 VWO RAG Pipeline</h1>
    <div class="subtitle">Regression Test Case Suggester — app.vwo.com</div>
  </div>
  <div class="header-right">
    <div class="stat-badge">📦 Chunks: <span id="totalChunks">0</span></div>
    <div class="stat-badge">📋 Modules: <span id="totalModules">0</span></div>
  </div>
</header>

<div class="app">
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>📄 Chunking Viewer</h2>
      <div class="sidebar-filter">
        <select id="moduleFilter"><option value="">All Modules</option></select>
        <input id="chunkSearch" type="text" placeholder="Filter chunks...">
      </div>
    </div>
    <div class="chunk-list" id="chunkList"></div>
  </aside>

  <main class="main">
    <section class="search-section">
      <div class="search-title">Regression Test Case Suggester</div>
      <div class="search-desc">Ask questions about your test cases using natural language. The RAG pipeline will retrieve and suggest relevant regression test cases.</div>
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="e.g. Do we have a test case related to login?">
        <button id="searchBtn" onclick="performSearch()">🔍 Search</button>
      </div>
      <div class="example-queries" id="exampleQueries">
        <div class="example-q" onclick="useExample(this)">Do we have a test case related to login?</div>
        <div class="example-q" onclick="useExample(this)">Show me all high priority A/B testing test cases</div>
        <div class="example-q" onclick="useExample(this)">Find test cases for password reset</div>
        <div class="example-q" onclick="useExample(this)">Heatmap regression tests</div>
        <div class="example-q" onclick="useExample(this)">Billing and subscription tests</div>
      </div>
    </section>

    <section class="results-section">
      <div class="suggestion-box" id="suggestionBox">
        <h3>💡 RAG Suggestion</h3>
        <div class="suggestion-text" id="suggestionText"></div>
      </div>
      <div id="resultsArea">
        <div class="welcome">
          <div class="icon">🧠</div>
          <h3>Welcome to the VWO RAG Pipeline</h3>
          <p>Use the search box above to query the knowledge base of 100 regression test cases. The pipeline will retrieve the most relevant test cases and suggest which ones to run.</p>
        </div>
      </div>
    </section>
  </main>
</div>

<!-- Detail Modal -->
<div class="modal-overlay" id="modal" onclick="if(event.target===this)closeModal()">
  <div class="modal" id="modalContent"></div>
</div>

<script>
const TEST_CASES = ${tcJSON};

// ====== TF-IDF Engine ======
class TFIDFEngine {
  constructor(docs) {
    this.docs = docs;
    this.docTexts = docs.map(d => this.toText(d).toLowerCase());
    this.N = docs.length;
    this.vocab = new Map();
    this.idf = new Map();
    this.tfidfVectors = [];
    this.build();
  }
  toText(d) {
    return [d.id,d.module,d.title,d.preconditions,d.steps,d.expectedResult,d.priority,d.type].join(' ');
  }
  tokenize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\\s]/g,' ').split(/\\s+/).filter(w=>w.length>1);
  }
  build() {
    const df = new Map();
    const tokenized = this.docTexts.map(t => this.tokenize(t));
    tokenized.forEach(tokens => {
      const unique = new Set(tokens);
      unique.forEach(t => df.set(t, (df.get(t)||0)+1));
    });
    df.forEach((freq,term) => {
      this.idf.set(term, Math.log((this.N+1)/(freq+1))+1);
    });
    let idx=0;
    df.forEach((_,term) => { this.vocab.set(term, idx++); });
    this.tfidfVectors = tokenized.map(tokens => this.computeTFIDF(tokens));
  }
  computeTFIDF(tokens) {
    const tf = new Map();
    tokens.forEach(t => tf.set(t,(tf.get(t)||0)+1));
    const maxTF = Math.max(...tf.values(),1);
    const vec = new Float32Array(this.vocab.size);
    tf.forEach((count,term) => {
      if(this.vocab.has(term)) {
        vec[this.vocab.get(term)] = (count/maxTF) * (this.idf.get(term)||0);
      }
    });
    return vec;
  }
  cosine(a,b) {
    let dot=0,na=0,nb=0;
    for(let i=0;i<a.length;i++){dot+=a[i]*b[i];na+=a[i]*a[i];nb+=b[i]*b[i];}
    return (na&&nb)?dot/(Math.sqrt(na)*Math.sqrt(nb)):0;
  }
  search(query, topN=10) {
    const qTokens = this.tokenize(query);
    const qVec = this.computeTFIDF(qTokens);
    const scores = this.tfidfVectors.map((v,i) => ({index:i,score:this.cosine(qVec,v)}));
    // Also boost exact keyword matches
    const qLower = query.toLowerCase();
    scores.forEach(s => {
      const doc = this.docTexts[s.index];
      qTokens.forEach(qt => {
        if(doc.includes(qt)) s.score += 0.02;
      });
      // Priority filter boost
      if(qLower.includes('high') && this.docs[s.index].priority==='High') s.score+=0.1;
      if(qLower.includes('medium') && this.docs[s.index].priority==='Medium') s.score+=0.1;
      if(qLower.includes('low') && this.docs[s.index].priority==='Low') s.score+=0.1;
    });
    return scores.filter(s=>s.score>0.01).sort((a,b)=>b.score-a.score).slice(0,topN);
  }
}

const engine = new TFIDFEngine(TEST_CASES);

// ====== UI Logic ======
const modules = [...new Set(TEST_CASES.map(t=>t.module))];
document.getElementById('totalChunks').textContent = TEST_CASES.length;
document.getElementById('totalModules').textContent = modules.length;

// Populate module filter
const mf = document.getElementById('moduleFilter');
modules.forEach(m => { const o=document.createElement('option');o.value=m;o.textContent=m;mf.appendChild(o); });

function renderChunks() {
  const filter = document.getElementById('moduleFilter').value;
  const search = document.getElementById('chunkSearch').value.toLowerCase();
  const list = document.getElementById('chunkList');
  list.innerHTML = '';
  TEST_CASES.forEach((tc,i) => {
    if(filter && tc.module!==filter) return;
    if(search && !engine.toText(tc).toLowerCase().includes(search)) return;
    const div = document.createElement('div');
    div.className = 'chunk';
    div.onclick = () => showModal(tc);
    div.innerHTML = \`
      <div class="chunk-top">
        <span class="chunk-id">\${tc.id}</span>
        <span class="chunk-module">\${tc.module}</span>
      </div>
      <div class="chunk-title">\${tc.title}</div>
      <div class="chunk-preview">\${tc.steps.split('\\n').slice(0,2).join(' → ')}</div>
      <span class="priority-badge priority-\${tc.priority}">\${tc.priority==='High'?'🔴':''}
\${tc.priority==='Medium'?'🟠':''}\${tc.priority==='Low'?'🟢':''} \${tc.priority}</span>
      <span class="type-badge">\${tc.type}</span>
    \`;
    list.appendChild(div);
  });
}
renderChunks();
document.getElementById('moduleFilter').onchange = renderChunks;
document.getElementById('chunkSearch').oninput = renderChunks;

function useExample(el) {
  document.getElementById('searchInput').value = el.textContent;
  performSearch();
}

document.getElementById('searchInput').addEventListener('keydown', e => {
  if(e.key==='Enter') performSearch();
});

function highlightText(text, query) {
  if(!query) return text;
  const words = query.toLowerCase().split(/\\s+/).filter(w=>w.length>2);
  let result = text;
  words.forEach(w => {
    const re = new RegExp('('+w.replace(/[.*+?^\${}()|[\\]\\\\]/g,'\\\\\\$&')+')','gi');
    result = result.replace(re, '<mark>$1</mark>');
  });
  return result;
}

function performSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if(!query) return;
  const results = engine.search(query, 15);
  const area = document.getElementById('resultsArea');
  const sBox = document.getElementById('suggestionBox');
  const sText = document.getElementById('suggestionText');

  if(results.length === 0) {
    sBox.classList.remove('show');
    area.innerHTML = '<div class="no-results"><div class="icon">🔍</div><p>No matching test cases found. Try a different query.</p></div>';
    return;
  }

  // Suggestion
  const topModules = [...new Set(results.slice(0,5).map(r=>TEST_CASES[r.index].module))];
  const highPriority = results.filter(r=>TEST_CASES[r.index].priority==='High');
  sText.innerHTML = \`For your query about "<strong>\${query}</strong>", we recommend running <strong>\${results.length} test case\${results.length>1?'s':''}</strong> across modules: <strong>\${topModules.join(', ')}</strong>.\${highPriority.length ? ' <br>⚠️ <strong>'+highPriority.length+' high-priority</strong> test case'+(highPriority.length>1?'s':'')+' should be prioritized.' : ''}\`;
  sBox.classList.add('show');

  // Results
  let html = '<div class="results-header"><h3>Retrieved Test Cases</h3><span class="results-count">'+results.length+' results</span></div>';
  results.forEach(r => {
    const tc = TEST_CASES[r.index];
    const pct = Math.min(99, Math.round(r.score * 100));
    html += \`
    <div class="result-card">
      <div class="result-top">
        <div>
          <div class="result-left">
            <span class="result-id">\${tc.id}</span>
            <span class="result-title">\${highlightText(tc.title, query)}</span>
          </div>
          <div class="result-meta">
            <span class="chunk-module">\${tc.module}</span>
            <span class="priority-badge priority-\${tc.priority}">\${tc.priority==='High'?'🔴':tc.priority==='Medium'?'🟠':'🟢'} \${tc.priority}</span>
            <span class="type-badge">\${tc.type}</span>
          </div>
        </div>
        <span class="relevance">\${pct}% match</span>
      </div>
      <div class="detail-row"><div class="detail-label">Expected Result</div><div class="detail-value">\${highlightText(tc.expectedResult, query)}</div></div>
      <button class="toggle-btn" onclick="toggleDetail(this)">Show Full Details ▼</button>
      <div class="result-details">
        <div class="detail-row"><div class="detail-label">Preconditions</div><div class="detail-value">\${tc.preconditions}</div></div>
        <div class="detail-row"><div class="detail-label">Test Steps</div><div class="detail-value">\${highlightText(tc.steps, query)}</div></div>
      </div>
    </div>\`;
  });
  area.innerHTML = html;
}

function toggleDetail(btn) {
  const details = btn.nextElementSibling;
  details.classList.toggle('show');
  btn.textContent = details.classList.contains('show') ? 'Hide Details ▲' : 'Show Full Details ▼';
}

function showModal(tc) {
  const m = document.getElementById('modalContent');
  m.innerHTML = \`
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div><div class="modal-id">\${tc.id}</div><h2>\${tc.title}</h2></div>
      <button onclick="closeModal()" style="background:none;border:none;color:var(--text2);font-size:28px;cursor:pointer;line-height:1">×</button>
    </div>
    <div class="result-meta" style="margin:12px 0">
      <span class="chunk-module">\${tc.module}</span>
      <span class="priority-badge priority-\${tc.priority}">\${tc.priority==='High'?'🔴':tc.priority==='Medium'?'🟠':'🟢'} \${tc.priority}</span>
      <span class="type-badge">\${tc.type}</span>
    </div>
    <div class="modal-body">
      <div class="detail-row"><div class="detail-label">Preconditions</div><div class="detail-value">\${tc.preconditions}</div></div>
      <div class="detail-row"><div class="detail-label">Test Steps</div><div class="detail-value">\${tc.steps}</div></div>
      <div class="detail-row"><div class="detail-label">Expected Result</div><div class="detail-value">\${tc.expectedResult}</div></div>
    </div>
  \`;
  document.getElementById('modal').classList.add('show');
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
}
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });
</script>
</body>
</html>`;

fs.writeFileSync('index.html', html);
console.log('index.html generated successfully (' + (html.length/1024).toFixed(1) + ' KB)');
