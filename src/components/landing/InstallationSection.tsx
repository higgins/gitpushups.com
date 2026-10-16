'use client'

import { useId, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Terminal } from 'lucide-react'
import { createAgentPrompt, createGitHook, PUSHUP_FREQUENCIES, type PushupFrequency } from '@/lib/installation'
import { CopyButton } from './CopyButton'
import { PushupFrequencyDemo } from './PushupFrequencyDemo'

export function AgentInstallPrompt({ frequency, username }: { frequency: PushupFrequency; username?: string }) {
  const prompt = createAgentPrompt(frequency, username)
  return <div className="agent-install">
    <div className="agent-prompt">
      <span className="prompt-chevron" aria-hidden="true">›</span>
      <p>{prompt}</p>
      <CopyButton text={prompt} label="Copy agent installation prompt" />
    </div>
    <a className="agent-instructions-link" href={`/agent-setup?frequency=${frequency.id}`}>View setup instructions →</a>
  </div>
}

export function GitHookCode({ frequency = PUSHUP_FREQUENCIES[0], username }: { frequency?: PushupFrequency; username?: string }) {
  const code = createGitHook(frequency, username)
  return <div className="hook-code">
    <div className="code-title"><span><Terminal size={14} aria-hidden="true" /> pre-commit</span><CopyButton text={code} label="Copy Git hook" /></div>
    <pre tabIndex={0} aria-label="Git pre-commit hook"><code>{code.split('\n').map((line, i) => <span key={i} className={line.startsWith('#') ? 'code-comment' : /^(if|fi|then)/.test(line) ? 'code-keyword' : line.includes('printf') ? 'code-message' : ''}>{line}{'\n'}</span>)}</code></pre>
  </div>
}

export function GitHookInstructions({ frequency, username }: { frequency: PushupFrequency; username?: string }) {
  return <div className="hook-instructions">
      <p>Add this check to your repository’s <code>.git/hooks/pre-commit</code>, {username ? 'then' : <>replace <code>GH_USERNAME</code> with your GitHub username, and</>} make it executable with <code>chmod +x .git/hooks/pre-commit</code>.</p>
      <p>If you use Husky or a custom hooks path, add the check there. Keep any existing checks.</p>
      <GitHookCode frequency={frequency} username={username} />
      <p className="fine-print">Record your sets in the app. Changing the slider updates this snippet; reinstall the check to change an existing hook’s schedule.</p>
  </div>
}

const agents = [
  { name: 'Claude', icon: 'claude' },
  { name: 'Cursor', icon: 'cursor' },
  { name: 'GitHub Copilot', icon: 'githubcopilot' },
  { name: 'Devin', icon: 'devin' },
  { name: 'Codex', icon: 'codex' },
]

export function AgentLogos() {
  return <span className="agent-icons">{agents.map(agent => <span key={agent.icon} className={`agent-logo agent-logo-${agent.icon}`} title={agent.name}>
    <Image src={`/agents/${agent.icon}.svg`} width={22} height={22} alt={agent.name} />
  </span>)}</span>
}

export function InstallationTabs({ frequency, username }: { frequency: PushupFrequency; username?: string }) {
  const [selected, setSelected] = useState(0)
  const id = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const contentRef = useRef<HTMLDivElement>(null)
  const [panelHeight, setPanelHeight] = useState<number>()

  useLayoutEffect(() => {
    const content = contentRef.current
    if (!content) return
    // Measure the natural content height; the outer panel animates independently.
    const measure = () => setPanelHeight(content.getBoundingClientRect().height + 2)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    return () => observer.disconnect()
  }, [selected])
  return <div className="installation-tabs">
    <div className="installation-tab-list" role="tablist" aria-label="Installation method">
      {['Set up with your agent', 'Git hook'].map((label, index) => <button key={label} type="button" role="tab" className="agent-tab" aria-label={label} id={`${id}-tab-${index}`} aria-controls={`${id}-panel`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} ref={element => { refs.current[index] = element }} onClick={() => setSelected(index)} onKeyDown={event => {
        const next = event.key === 'ArrowRight' || event.key === 'ArrowLeft' ? 1 - index : event.key === 'Home' ? 0 : event.key === 'End' ? 1 : null
        if (next !== null) { event.preventDefault(); setSelected(next); refs.current[next]?.focus() }
      }}>{index === 0 ? <AgentLogos /> : <Terminal size={18} aria-hidden="true" />}<span>{label}</span></button>)}
    </div>
    <div role="tabpanel" className="installation-panel" style={{ height: panelHeight }} id={`${id}-panel`} aria-labelledby={`${id}-tab-${selected}`} tabIndex={0}>
      <div className="installation-panel-content" ref={contentRef}>
        {selected === 0 ? <AgentInstallPrompt frequency={frequency} username={username} /> : <GitHookInstructions frequency={frequency} username={username} />}
      </div>
    </div>
  </div>
}

export function InstallationSection({ username }: { username?: string }) {
  const [frequency, setFrequency] = useState<PushupFrequency>(PUSHUP_FREQUENCIES[0])
  return <section id="install" className="installation-section section-divider" aria-labelledby="install-title">
    <div className="installation-copy">
      <div className="installation-heading">
        <h2 id="install-title" className="page-heading">Configure your training</h2>
        <p className="section-intro">Choose how often you want to do pushups</p>
      </div>
      <InstallationTabs frequency={frequency} username={username} />
    </div>
    <PushupFrequencyDemo frequency={frequency} onChange={setFrequency} />
  </section>
}
