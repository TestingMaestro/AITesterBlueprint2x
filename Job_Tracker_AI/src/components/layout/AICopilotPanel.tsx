import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Send, Lightbulb, FileText, MessageSquare, TrendingUp, IndianRupee } from 'lucide-react'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils'
import { useJobStore } from '@/store/useJobStore'

const QUICK_PROMPTS = [
  { icon: MessageSquare, label: 'Interview Prep' },
  { icon: FileText,      label: 'Resume Match' },
  { icon: FileText,      label: 'Cover Letter Generator' },
  { icon: IndianRupee,    label: 'Salary Script' },
  { icon: Send,          label: 'Follow-up Email' },
]

interface Message { role: 'user' | 'assistant'; content: string }

const generateProactiveMessage = (jobs: any[]) => {
  const activeApps = jobs.filter(j => j.status !== 'rejected').length
  const companies = new Set(jobs.map(j => j.company)).size
  
  const offers = jobs.filter(j => j.status === 'offer')
  const interviews = jobs.filter(j => j.status === 'interview')
  
  let bestOppText = 'None yet'
  if (offers.length > 0) {
    bestOppText = `**${offers[0].company}** (offer stage)`
  } else if (interviews.length > 0) {
    bestOppText = `**${interviews[0].company}** (interview stage)`
  } else if (jobs.length > 0) {
    bestOppText = `**${jobs[0].company}** (${jobs[0].status} stage)`
  }

  const tip = jobs.some(j => (j.ai_score || 0) < 80)
    ? 'Your AI match scores suggest your next cover letter should emphasize your relevant experience more prominently.'
    : 'Your applications look strong! Keep up the great work.'

  return `👋 Hi! I'm your AI Copilot. I've analyzed your job pipeline and have some insights:

📊 **Pipeline Health:** You have ${activeApps} active applications across ${companies} companies. Your strongest opportunity is ${bestOppText}.

⚡ **Action needed:** Consider following up on older applications today.

💡 **Tip:** ${tip}

What would you like me to help with?`
}

export function AICopilotPanel() {
  const jobs = useJobStore((s) => s.jobs)
  const [messages, setMessages] = useState<Message[]>([])

  // Initialize the first message dynamically
  useEffect(() => {
    if (messages.length === 0 && jobs.length > 0) {
      setMessages([{ role: 'assistant', content: generateProactiveMessage(jobs) }])
    } else if (messages.length === 0 && jobs.length === 0) {
      setMessages([{ role: 'assistant', content: `👋 Hi! I'm your AI Copilot.\n\nYour pipeline is currently empty. Add your first job application and I'll help you track it, prepare for interviews, and optimize your resume!` }])
    }
  }, [jobs, messages.length])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (text?: string) => {
    const userMsg = text || input.trim()
    if (!userMsg) return

    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setIsLoading(true)

    // Demo response (real Claude integration requires API key)
    await new Promise(r => setTimeout(r, 1200))
    
    let reply = ''
    if (userMsg.toLowerCase().includes('interview prep')) {
      reply = `**Interview Prep Strategy:**\n\n1. Review the STAR method for behavioral questions.\n2. Practice explaining your most complex technical project.\n3. Prepare 3 questions to ask the interviewer.\n\nGood luck!`
    } else if (userMsg.toLowerCase().includes('resume match')) {
      reply = `**Resume Match Analysis:**\n\nYour resume matches **85%** of the requirements for your tracked jobs. Consider adding more keywords related to 'Performance Optimization' to bump it to 95%.`
    } else if (userMsg.toLowerCase().includes('cover letter')) {
      reply = `**Cover Letter Draft:**\n\nDear Hiring Manager,\n\nI am thrilled to apply for this position. With my background in full-stack development and strong problem-solving skills, I am confident I would be a great addition to your team.\n\nBest, [Your Name]`
    } else if (userMsg.toLowerCase().includes('salary script')) {
      reply = `**Salary Negotiation Script:**\n\n"Based on my market research and the value I can bring to this role, I am looking for a base salary around $150,000. Is there flexibility in the current budget?"`
    } else if (userMsg.toLowerCase().includes('email') || userMsg.toLowerCase().includes('follow')) {
      reply = `**Follow-up Email:**\n\nHi [Name],\n\nI wanted to follow up on my application submitted last week. I remain very interested in the opportunity and would love to know the status. Thanks!`
    } else {
      reply = `I understand you're asking about: "${userMsg}"\n\nConnect your Anthropic API key in .env to unlock full AI capabilities including resume analysis, cover letter generation, interview prep, and real-time coaching.\n\nFor now, I can see you have **${jobs.length} tracked jobs**. What specific aspect would you like help with?`
    }
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setIsLoading(false)
  }

  const { aiPanelOpen, setAIPanelOpen } = useUIStore()

  return (
    <div className={`copilot-panel ${aiPanelOpen ? 'panel-open' : ''}`}>
      <div className="c-head">
        <div className="c-title">
          <span className="pulse-dot"></span> AI Copilot
        </div>
        <button className="icon-btn" onClick={() => setAIPanelOpen(false)}>✕</button>
      </div>
      
      <div className="c-body" id="cBody">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`c-msg ${m.role === 'user' ? 'c-user' : 'c-sys'}`}
            >
              <div className="c-bubble whitespace-pre-line">{m.content}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="c-msg c-sys">
            <div className="c-bubble">
              <span className="pulse-dot" style={{ display: 'inline-block' }}></span> Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="c-prompts">
        {QUICK_PROMPTS.map(({ icon: Icon, label }) => (
          <button key={label} className="c-prompt" onClick={() => handleSend(label)}>
            <Icon size={12} strokeWidth={2} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
            {label}
          </button>
        ))}
      </div>

      <div className="c-foot">
        <div className="c-input-wrap">
          <input
            type="text"
            className="c-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask Copilot..."
          />
          <button className="c-send" onClick={() => handleSend()} disabled={!input.trim() || isLoading}>
            <Send size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}
