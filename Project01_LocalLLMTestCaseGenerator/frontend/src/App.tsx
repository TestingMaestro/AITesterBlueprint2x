import { useState, useEffect } from 'react';
import { 
  Bot, LayoutDashboard, WandSparkles, History, Settings,
  Zap, Sparkles, RefreshCw, PanelRightOpen, Copy, Download,
  FileSpreadsheet, Layers, FileText, Share2, MessageSquareText, Hexagon, Star, CheckCircle2, ChevronDown
} from 'lucide-react';
import './index.css';

function App() {
  const [messages, setMessages] = useState<{role: 'system' | 'ai' | 'user', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState({ tokens: 0, duration: '0.0s' });
  
  // Settings state
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [lmStudioUrl, setLmStudioUrl] = useState('http://localhost:1234');
  const [groqKey, setGroqKey] = useState('');
  const [openAiKey, setOpenAiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('LMStudio'); // default in mockup
  const [activeTab, setActiveTab] = useState<'dashboard' | 'generator' | 'history' | 'settings'>('generator');
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean | null>>({});
  
  // New Feature States
  const [isFastMode, setIsFastMode] = useState(false);
  const [outputView, setOutputView] = useState<'split' | 'full'>('split');
  const [historyItems, setHistoryItems] = useState([
    { id: 1, title: 'Login Flow Text Input', model: 'LMStudio', date: '2026-03-08', content: 'TC-001: Login Flow\n1. Navigate to /login\n2. Enter credentials\n3. Click Login' },
    { id: 2, title: 'Checkout Page Image', model: 'Ollama', date: '2026-03-07', content: 'TC-002: Checkout Process\n1. Add item to cart\n2. Proceed to checkout\n3. Enter payment details' },
    { id: 3, title: 'Password Reset Req', model: 'Groq', date: '2026-03-06', content: 'TC-003: Password Reset\n1. Click Forgot Password\n2. Enter email\n3. Verification email sent' }
  ]);

  useEffect(() => {
    setOllamaUrl(localStorage.getItem('ollamaUrl') || 'http://localhost:11434');
    setLmStudioUrl(localStorage.getItem('lmStudioUrl') || 'http://localhost:1234');
    setGroqKey(localStorage.getItem('groqKey') || '');
    setOpenAiKey(localStorage.getItem('openAiKey') || '');
    setClaudeKey(localStorage.getItem('claudeKey') || '');
    setGeminiKey(localStorage.getItem('geminiKey') || '');
    const savedProvider = localStorage.getItem('selectedProvider');
    if (savedProvider) setSelectedProvider(savedProvider);
  }, []);

  const saveSettings = (provider: string) => {
    localStorage.setItem('ollamaUrl', ollamaUrl);
    localStorage.setItem('lmStudioUrl', lmStudioUrl);
    localStorage.setItem('groqKey', groqKey);
    localStorage.setItem('openAiKey', openAiKey);
    localStorage.setItem('claudeKey', claudeKey);
    localStorage.setItem('geminiKey', geminiKey);
    localStorage.setItem('selectedProvider', provider);
    setSelectedProvider(provider);
    setConnectionStatus(prev => ({ ...prev, [provider]: null }));
    alert(`Settings changed and activated to ${provider}.`);
  };

  const testConnection = async () => {
    try {
      const res = await fetch('/api/test-connection', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ 
           provider: selectedProvider,
           config: { ollamaUrl, lmStudioUrl, groqKey, openAiKey, claudeKey, geminiKey } 
         })
      });
      const data = await res.json();
      if (data.success) {
        setConnectionStatus(prev => ({ ...prev, [selectedProvider]: true }));
        alert(data.message || 'Connection test successful.');
      } else {
        setConnectionStatus(prev => ({ ...prev, [selectedProvider]: false }));
        alert(data.error || 'Connection test failed.');
      }
    } catch (e) {
      setConnectionStatus(prev => ({ ...prev, [selectedProvider]: false }));
      alert('Backend connection failed.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!input.trim() && !imageBase64) return;
    setIsGenerating(true);
    setMessages([{role: 'ai', content: 'Generating...'}]);
    
    // add to history dummy logic
    // history update removed
    
    const startTime = Date.now();
    const currentInput = input;
    const currentImage = imageBase64;
    setInput('');
    setImageBase64(null);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          requirement: currentInput,
          image: currentImage,
          config: { ollamaUrl, groqKey, openAiKey, claudeKey, geminiKey, lmStudioUrl }
        })
      });
      const data = await res.json();
      const endTime = Date.now();
      const durationStr = ((endTime - startTime) / 1000).toFixed(1) + 's';
      const tokenEst = currentInput.length + (data.testCases ? data.testCases.length / 4 : 0);
      
      if (data.success) {
        setMessages([{role: 'ai', content: data.testCases }]);
        setStats({ tokens: Math.floor(tokenEst), duration: durationStr });
        setHistoryItems(prev => [{ id: Date.now(), title: currentInput.substring(0, 20) || 'Image Input', model: selectedProvider, date: new Date().toISOString().split('T')[0], content: data.testCases }, ...prev]);
      } else {
        setMessages([{role: 'ai', content: `Error: ${data.error}` }]);
      }
    } catch (e: any) {
      setMessages([{role: 'ai', content: `Failed to reach Server: ${e.message}` }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (messages.length > 0) {
      handleGenerate();
    }
  };

  const loadHistoryItem = (item: any) => {
    setMessages([{role: 'ai', content: item.content}]);
    setActiveTab('generator');
  };

  const toggleFastMode = () => setIsFastMode(prev => !prev);
  
  const toggleView = () => setOutputView(prev => prev === 'split' ? 'full' : 'split');

  const displayContent = messages.length > 0 ? messages[0].content : 
`TC-001: Login Example

1. Navigate to the login page.
2. Enter a valid username,
3. Enter a valid password.
4. Click the "Login" button.
5. Verify that the user is successfully logged in and redirectred to the dashboard.`;

  return (
    <div className="app-wrapper">

      {/* LEFT COLUMN: Identity + Sidebar */}
      <div className="left-column">
        <div className="sidebar" style={{paddingTop: '32px'}}>
          <div className="glow-border"></div>
          
          <div className="app-identity" style={{padding: '0 20px', marginBottom: '32px'}}>
            <div className="title-row" style={{fontSize: '20px'}}>
               <div className="bot-icon-app" style={{width: 32, height: 32}}><Bot size={20} color="#fff" strokeWidth={2.5} /></div>
               TestGen Buddy
            </div>
            <div className="subtitle" style={{marginLeft: 0, marginTop: '4px'}}>Generate enterprise-grade test cases with local AI</div>
          </div>

          <div className="nav-menu">
             <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><LayoutDashboard size={18} /> Dashboard</div>
             <div className={`nav-item ${activeTab === 'generator' ? 'active' : ''}`} onClick={() => setActiveTab('generator')}><WandSparkles size={18} /> Generator</div>
             <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}><History size={18} /> History</div>
             <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><Settings size={18} /> Settings</div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Header + Output */}
      <div className="right-column">
        <div className="top-header">
           <div className="tabs">
             <button className={`tab-btn ${activeTab === 'generator' ? 'active' : ''}`} onClick={() => setActiveTab('generator')}>Generator</button>
             <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</button>
           </div>
           <div className="running-pill">
             <Zap size={14} color="#facc15" style={{fill: '#facc15'}} /> Running on: <span style={{color: '#fff', fontWeight: 500, marginLeft: '4px'}}>{selectedProvider === 'LMStudio' ? 'LM Studio' : selectedProvider}</span>
           </div>
        </div>

        <div className="main-content">

        {/* CONDITIONAL RENDER BASED ON TAB */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="glass-card">
              <div className="glow-border"></div>
              <div className="card-header"><div className="card-title"><LayoutDashboard size={20} color="var(--accent-gold)" /> Dashboard Overview</div></div>
              <div style={{display: 'flex', gap: '20px', marginTop: '16px'}}>
                <div className="glass-card" style={{flex: 1, padding: '24px', textAlign: 'center', background: 'rgba(0,0,0,0.2)'}}>
                  <h3 style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px'}}>Total Test Cases</h3>
                  <p style={{fontSize: '36px', color: '#fff', fontWeight: 'bold'}}>{historyItems.length}</p>
                </div>
                <div className="glass-card" style={{flex: 1, padding: '24px', textAlign: 'center', background: 'rgba(0,0,0,0.2)'}}>
                  <h3 style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px'}}>Active Provider</h3>
                  <p style={{fontSize: '30px', color: '#fff', fontWeight: 'bold'}}>{selectedProvider}</p>
                </div>
                <div className="glass-card" style={{flex: 1, padding: '24px', textAlign: 'center', background: 'rgba(0,0,0,0.2)'}}>
                  <h3 style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px'}}>Fast Mode</h3>
                  <p style={{fontSize: '30px', color: isFastMode ? '#4ade80' : '#f87171', fontWeight: 'bold'}}>{isFastMode ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card">
              <div className="glow-border"></div>
              <div className="card-header"><div className="card-title"><Zap size={20} color="var(--accent-gold)" /> Quick Actions</div></div>
              <div style={{display: 'flex', gap: '16px', marginTop: '16px'}}>
                 <button className="btn-primary" onClick={() => setActiveTab('generator')}><WandSparkles size={16}/> New Generation</button>
                 <button className="btn-outline" onClick={() => setActiveTab('settings')}><Settings size={16}/> Configure Settings</button>
                 <button className="btn-outline" onClick={() => setActiveTab('history')}><History size={16}/> View History</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'generator' && (
          /* DASHBOARD GRID */
          <div className="dashboard-grid">

            {/* TOP CARD: OUTPUT BOARD */}
            <div className="glass-card card-top">
              <div className="glow-border"></div>
              <div className="card-header" style={{marginBottom: '16px'}}>
                 <div className="card-title"><Sparkles size={22} color="#facc15" style={{fill: '#facc15'}} /> AI Generated Test Cases</div>
                 <div className="action-btn-group">
                   {isGenerating ? (
                     <div className="status-pill-success" style={{background: 'rgba(251, 191, 36, 0.2)', borderColor: 'rgba(251, 191, 36, 0.3)', color: '#fbbf24'}}>
                        <RefreshCw size={14} className="animate-spin" /> Generating...
                     </div>
                   ) : messages.length > 0 ? (
                     <div className="status-pill-success">
                        <CheckCircle2 size={14} /> Done
                     </div>
                   ) : (
                     <div className="status-pill-success" style={{background: 'rgba(148, 163, 184, 0.15)', borderColor: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8'}}>
                        <Zap size={14} /> Ready
                     </div>
                   )}
                 </div>
              </div>

              <div className="meta-bar">
                 <div className="meta-stats">
                   <span>Model: {selectedProvider === 'LMStudio' ? 'LM Studio' : selectedProvider}</span>
                   <span>Tokens: {messages.length ? stats.tokens : 213}</span>
                   <span>Duration: {messages.length ? stats.duration : '1.2s'}</span>
                 </div>
                 <div className="action-btn-group">
                    <button
                      className={`btn-outline ${isFastMode ? 'active-fast' : ''}`}
                      style={{padding: '6px', backgroundColor: isFastMode ? 'rgba(234, 179, 8, 0.1)' : 'transparent', borderColor: isFastMode ? '#eab308' : ''}}
                      title="Toggle Fast Mode (Lower Latency)"
                      onClick={toggleFastMode}
                    >
                      <Zap size={16} color={isFastMode ? "#eab308" : "currentColor"} />
                    </button>
                    <button
                      className="btn-outline"
                      style={{padding: '6px'}}
                      title="Regenerate Test Case"
                      onClick={handleRegenerate}
                      disabled={isGenerating || messages.length === 0}
                    >
                      <RefreshCw size={16} className={isGenerating ? "animate-spin" : ""} />
                    </button>
                    <button
                      className="btn-outline"
                      style={{padding: '6px'}}
                      title={outputView === 'split' ? "Expand Output View" : "Split Input/Output View"}
                      onClick={toggleView}
                    >
                      <PanelRightOpen size={16} />
                    </button>
                 </div>
              </div>

              <div className="output-content">
                 {displayContent}
              </div>

              <div className="output-actions">
                 <div className="action-btn-group">
                   <button className="btn-outline"><Share2 size={15} color="#4ade80" /> Export</button>
                   <button className="btn-outline"><FileSpreadsheet size={15} color="#4ade80" /> CSV</button>
                   <button className="btn-outline"><Copy size={15} color="#c084fc" onClick={() => navigator.clipboard.writeText(displayContent)} /> Copy</button>
                 </div>
                 <div className="action-btn-group">
                   <button className="btn-outline" style={{color: '#60a5fa'}}><MessageSquareText size={15} color="#60a5fa" style={{fill: '#60a5fa'}} /> Jira</button>
                   <button className="btn-outline" style={{color: '#c084fc'}}><Download size={15} color="#c084fc" /> Save Template</button>
                 </div>
              </div>
            </div>

            {/* BOTTOM LEFT CARD: INPUT AREA (Conditionally render based on outputView) */}
            {outputView === 'split' && (
              <div className="glass-card input-area-card">
                 <div className="glow-border"></div>
               <div className="card-header">
                 <div className="card-title"><Sparkles size={20} color="var(--accent-gold)" /> Generate Test Cases</div>
               </div>

               <div className="input-container-inner" style={{background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', flex: 1}}>
                 <textarea
                   className="input-box"
                   style={{background: 'transparent', border: 'none', padding: '4px 0', minHeight: '60px', lineHeight: '1.5'}}
                   placeholder="Describe requirement or paste text here..."
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                       e.preventDefault();
                       handleGenerate();
                     }
                   }}
                 />

                 {imageBase64 && (
                    <div style={{position: 'relative', display: 'inline-block', marginBottom: '12px'}}>
                       <img src={imageBase64} alt="attached" style={{maxHeight:'60px', borderRadius:'6px'}}/>
                       <button onClick={() => setImageBase64(null)} style={{position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', cursor: 'pointer', width: '20px', height: '20px'}}>✕</button>
                    </div>
                 )}

                 <div className="input-toolbar" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
                   <div className="action-btn-group">
                     <label className="btn-outline" style={{cursor: 'pointer'}}>
                       <Layers size={16} color="#6ee7b7" /> Upload Image
                       <input type="file" accept="image/*" style={{display: 'none'}} onChange={handleImageUpload} />
                     </label>
                     <button className="btn-outline"><FileText size={16} /> PRD</button>
                   </div>
                 </div>
               </div>

               <div className="card-bottom-actions" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px'}}>
                  <div style={{position: 'relative', display: 'inline-block'}}>
                    <select className="btn-outline" style={{appearance:'none', paddingRight:'32px', backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.1)'}}
                            value={selectedProvider} onChange={e => setSelectedProvider(e.target.value)}>
                       <option value="LMStudio">LM Studio</option>
                       <option value="Ollama">Ollama</option>
                       <option value="Groq">Groq</option>
                       <option value="OpenAI">OpenAI</option>
                    </select>
                    <ChevronDown size={14} style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888'}} />
                  </div>
                  <button className="btn-primary" onClick={handleGenerate} disabled={isGenerating}>
                     {isGenerating ? 'Generating...' : <>Generate Test Cases <Sparkles size={16} color="#facc15" style={{fill: '#facc15'}} /></>}
                  </button>
               </div>
              </div>
            )}

            {/* BOTTOM RIGHT CARD: SETTINGS (Quick Settings in Generator) */}
            <div className="glass-card settings-card">
               <div className="glow-border"></div>
               <div className="card-header" style={{margin: '0'}}>
                 <div className="card-title" style={{gap: '8px'}}><Settings size={18} /> QUICK SETTINGS</div>
               </div>
               
               <div style={{color: 'var(--text-muted)', fontSize: '14px', marginTop: '16px', marginBottom: '16px'}}>
                  Manage full API connections in the Settings tab.
               </div>

               <div className="settings-list" style={{marginTop: '4px'}}>
                  <button className="btn-outline" style={{width: '100%', justifyContent: 'center', marginBottom: '12px'}} onClick={() => setActiveTab('settings')}>Go to API Settings</button>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
                     <span style={{color: '#fff', fontSize: '14px'}}>Current Provider</span>
                     <span style={{color: 'var(--accent-gold)'}}>{selectedProvider}</span>
                  </div>
               </div>
            </div>

          </div>
        )}
        
        {activeTab === 'history' && (
          /* HISTORY GRID */
          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr', gridTemplateRows: '1fr' }}>
            <div className="glass-card" style={{minHeight: '600px'}}>
              <div className="glow-border"></div>
              <div className="card-header">
                 <div className="card-title"><History size={20} color="var(--accent-gold)" /> Generation History</div>
              </div>
              <div className="history-list" style={{display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px'}}>
                {historyItems.map(item => (
                  <div key={item.id} className="accordion-summary" style={{cursor: 'default', padding: '16px'}}>
                    <div className="acc-icon-title">
                      <FileText size={24} color="var(--accent-blue)" />
                      <div style={{marginLeft: '12px'}}>
                        <div className="acc-title" style={{fontSize: '16px'}}>{item.title}</div>
                        <div className="acc-subtitle" style={{marginTop: '4px'}}>Model: {item.model} | Gen Date: {item.date}</div>
                      </div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <button className="btn-primary" onClick={() => loadHistoryItem(item)}>View in Generator</button>
                    </div>
                  </div>
                ))}
                {historyItems.length === 0 && (
                  <div style={{color: 'var(--text-muted)', textAlign: 'center', padding: '32px'}}>No history items yet. Generate some test cases!</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'minmax(400px, 600px)', justifyContent: 'center' }}>
            {/* FULL SETTINGS CARD */}
            <div className="glass-card settings-card" style={{minHeight: '600px', display: 'flex', flexDirection: 'column'}}>
               <div className="glow-border"></div>
               <div className="card-header" style={{margin: '0'}}>
                 <div className="card-title" style={{gap: '8px', fontSize: '18px'}}><Settings size={22} /> GLOBAL API SETTINGS</div>
               </div>

               <div className="settings-list" style={{marginTop: '16px', flex: 1, overflowY: 'auto'}}>

                 {/* Ollama Accordion */}
                 <details className="accordion-wrapper" open={selectedProvider==='Ollama'}>
                   <summary className="accordion-summary" style={{padding: '12px 0'}}>
                     <div className="acc-icon-title">
                       <div style={{width: 28, height: 28, borderRadius: 6, background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                         <Star size={16} color="#c084fc" />
                       </div>
                       <div>
                         <div className="acc-title">Ollama Setting</div>
                         <div className="acc-subtitle">http://localhost:11434</div>
                       </div>
                     </div>
                     <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                       {connectionStatus['Ollama'] === true && <div className="status-pill-success"><CheckCircle2 size={12} /> Connected</div>}
                       {connectionStatus['Ollama'] === false && <div className="status-pill-success" style={{background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444'}}><Zap size={12} /> Failed</div>}
                       <span>⌄</span>
                     </div>
                   </summary>
                   <div className="accordion-details">
                     <input type="text" className="form-input" value={ollamaUrl} onChange={e => setOllamaUrl(e.target.value)}/>
                     <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'8px'}}>
                       <span style={{fontSize:'12px', color:'#4ade80'}}>Connected ✓</span>
                       <button className="btn-outline" style={{fontSize:'11px', padding:'4px 8px'}} onClick={() => saveSettings('Ollama')}>Set Active</button>
                     </div>
                   </div>
                 </details>

                 {/* LM Studio Accordion */}
                 <details className="accordion-wrapper" open={selectedProvider==='LMStudio'}>
                   <summary className="accordion-summary" style={{padding: '12px 0'}}>
                     <div className="acc-icon-title">
                       <div style={{width: 28, height: 28, borderRadius: 6, background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                         <Share2 size={16} color="#4ade80" />
                       </div>
                       <div>
                         <div className="acc-title">LM Studio Setting</div>
                       </div>
                     </div>
                     <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                       {connectionStatus['LMStudio'] === true && <div className="status-pill-success"><CheckCircle2 size={12} /> Connected</div>}
                       {connectionStatus['LMStudio'] === false && <div className="status-pill-success" style={{background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444'}}><Zap size={12} /> Failed</div>}
                       <span>⌄</span>
                     </div>
                   </summary>
                   <div className="accordion-details">
                     <input type="text" className="form-input" placeholder="URL" value={lmStudioUrl} onChange={e => setLmStudioUrl(e.target.value)}/>
                     <div style={{display:'flex', justifyContent:'flex-end', marginTop:'8px'}}>
                       <button className="btn-outline" style={{fontSize:'11px', padding:'4px 8px'}} onClick={() => saveSettings('LMStudio')}>Set Active</button>
                     </div>
                   </div>
                 </details>

                 {/* Groq Accordion */}
                 <details className="accordion-wrapper" open={selectedProvider==='Groq'}>
                   <summary className="accordion-summary" style={{padding: '12px 0'}}>
                     <div className="acc-icon-title">
                       <div style={{width: 28, height: 28, borderRadius: 6, background: 'rgba(250, 204, 21, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                         <Sparkles size={16} color="#facc15" />
                       </div>
                       <div>
                         <div className="acc-title">Groq Setting</div>
                       </div>
                     </div>
                     <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                       {connectionStatus['Groq'] === true && <div className="status-pill-success"><CheckCircle2 size={12} /> Connected</div>}
                       {connectionStatus['Groq'] === false && <div className="status-pill-success" style={{background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444'}}><Zap size={12} /> Failed</div>}
                       <span>⌄</span>
                     </div>
                   </summary>
                   <div className="accordion-details">
                     <input type="password" className="form-input" placeholder="API Key" value={groqKey} onChange={e => setGroqKey(e.target.value)}/>
                     <div style={{display:'flex', justifyContent:'flex-end', marginTop:'8px'}}>
                       <button className="btn-outline" style={{fontSize:'11px', padding:'4px 8px'}} onClick={() => saveSettings('Groq')}>Set Active</button>
                     </div>
                   </div>
                 </details>

                 {/* OpenAI Accordion */}
                 <details className="accordion-wrapper" open={selectedProvider==='OpenAI'}>
                   <summary className="accordion-summary" style={{padding: '12px 0'}}>
                     <div className="acc-icon-title">
                       <div style={{width: 28, height: 28, borderRadius: 6, background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                         <Hexagon size={16} color="#60a5fa" />
                       </div>
                       <div>
                         <div className="acc-title">Open AI API keys</div>
                       </div>
                     </div>
                     <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                       {connectionStatus['OpenAI'] === true && <div className="status-pill-success"><CheckCircle2 size={12} /> Connected</div>}
                       {connectionStatus['OpenAI'] === false && <div className="status-pill-success" style={{background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444'}}><Zap size={12} /> Failed</div>}
                       <span>⌄</span>
                     </div>
                   </summary>
                   <div className="accordion-details">
                     <input type="password" className="form-input" placeholder="API Key" value={openAiKey} onChange={e => setOpenAiKey(e.target.value)}/>
                     <div style={{display:'flex', justifyContent:'flex-end', marginTop:'8px'}}>
                       <button className="btn-outline" style={{fontSize:'11px', padding:'4px 8px'}} onClick={() => saveSettings('OpenAI')}>Set Active</button>
                     </div>
                   </div>
                 </details>

               </div>

               <div className="settings-actions" style={{display: 'flex', gap: '16px', marginTop: 'auto', paddingTop: '24px'}}>
                 <button className="btn-primary" style={{flex: 1, justifyContent: 'center', fontWeight: '500', padding: '12px'}} onClick={() => saveSettings(selectedProvider)}>Save Configuration</button>
                 <button className="btn-outline" style={{flex: 1, justifyContent: 'center', fontWeight: '500', padding: '12px'}} onClick={testConnection}>Test Connection</button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
   </div>
  );
}

export default App;
